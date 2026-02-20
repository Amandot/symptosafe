import { NextRequest, NextResponse } from 'next/server';

export interface MedicalFacility {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: 'hospital' | 'clinic' | 'pharmacy';
}

// Multiple Overpass API endpoints for fallback
const OVERPASS_API_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
];

// Helper function to create a timeout promise
function timeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms);
  });
}

// Helper function to fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = 30000
): Promise<Response> {
  try {
    return await Promise.race([
      fetch(url, options),
      timeoutPromise(timeoutMs),
    ]);
  } catch (error) {
    if (error instanceof Error && error.message.includes('timeout')) {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// Helper to delay execution
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, radiusMeters = 5000 } = await request.json();

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Invalid coordinates. Latitude and longitude must be numbers.' },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.' },
        { status: 400 }
      );
    }

    // Optimized query: Only query nodes (faster than ways/relations)
    const query = `
      [out:json][timeout:30];
      (
        node["amenity"="hospital"](around:${radiusMeters},${latitude},${longitude});
        node["amenity"="clinic"](around:${radiusMeters},${latitude},${longitude});
        node["amenity"="pharmacy"](around:${radiusMeters},${latitude},${longitude});
      );
      out;
    `;

    let lastError: Error | null = null;

    // Try each API endpoint with retry logic
    for (let i = 0; i < OVERPASS_API_URLS.length; i++) {
      const apiUrl = OVERPASS_API_URLS[i];
      
      // Add a small delay between endpoint attempts (except for the first one)
      if (i > 0) {
        await delay(500 * i); // Exponential backoff: 500ms, 1000ms, etc.
      }
      
      try {
        const response = await fetchWithTimeout(
          apiUrl,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'SymptoSafe/1.0',
            },
            body: `data=${encodeURIComponent(query)}`,
          },
          30000 // 30 second timeout
        );

        if (!response.ok) {
          // If it's a timeout or gateway error, try next endpoint
          if (response.status === 504 || response.status === 502 || response.status === 503) {
            lastError = new Error(`Overpass API unavailable (${response.status}). Trying alternative endpoint...`);
            continue;
          }
          throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const facilities: MedicalFacility[] = [];

        if (data.elements && Array.isArray(data.elements)) {
          data.elements.forEach((element: any) => {
            const lat = element.lat || element.center?.lat;
            const lng = element.lon || element.center?.lon;
            
            if (!lat || !lng) return;

            const tags = element.tags || {};
            const amenity = tags.amenity;
            
            if (!amenity || !['hospital', 'clinic', 'pharmacy'].includes(amenity)) {
              return;
            }

            const name = tags.name || tags['name:en'] || tags['name:hi'] || tags['name:mr'] || 'Unnamed Facility';
            
            facilities.push({
              id: element.id || Math.random(),
              name,
              lat,
              lng,
              type: amenity as 'hospital' | 'clinic' | 'pharmacy',
            });
          });
        }

        // Remove duplicates based on name and location (within ~50m)
        const uniqueFacilities: MedicalFacility[] = [];
        const seen = new Set<string>();

        facilities.forEach((facility) => {
          const key = `${facility.name}-${Math.round(facility.lat * 1000)}-${Math.round(facility.lng * 1000)}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniqueFacilities.push(facility);
          }
        });

        return NextResponse.json({ facilities: uniqueFacilities });
      } catch (error) {
        console.warn(`Failed to fetch from ${apiUrl}:`, error);
        lastError = error instanceof Error ? error : new Error('Unknown error');
        // Continue to next endpoint
        continue;
      }
    }

    // If all attempts failed, return error response
    if (lastError) {
      console.error('All Overpass API attempts failed:', lastError);
      return NextResponse.json(
        {
          error: 'Unable to fetch medical facilities. The Overpass API may be temporarily unavailable. Please try again in a few moments.',
          details: lastError.message,
        },
        { status: 503 }
      );
    }

    // Fallback: return empty array
    return NextResponse.json({ facilities: [] });
  } catch (error) {
    console.error('Error in medical-facilities API route:', error);
    return NextResponse.json(
      {
        error: 'Internal server error while fetching medical facilities.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

