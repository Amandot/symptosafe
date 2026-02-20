export interface MedicalFacility {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: 'hospital' | 'clinic' | 'pharmacy';
}

/**
 * Fetches nearby medical facilities using the Next.js API route (server-side proxy)
 * This avoids CORS issues and provides better error handling
 * 
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param radiusMeters - Search radius in meters (default: 5000)
 * @returns Array of medical facilities
 */
export async function fetchNearbyMedicalFacilities(
  latitude: number,
  longitude: number,
  radiusMeters: number = 5000
): Promise<MedicalFacility[]> {
  try {
    const response = await fetch('/api/medical-facilities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude,
        longitude,
        radiusMeters,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.facilities || [];
  } catch (error) {
    // Handle network errors, CORS errors, and other fetch failures
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(
        'Unable to connect to the server. Please check your internet connection and try again.'
      );
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unknown error occurred while fetching medical facilities.');
  }
}

