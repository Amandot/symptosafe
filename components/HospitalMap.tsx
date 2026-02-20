'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { MedicalFacility } from '@/lib/utils/overpass-api';
import { Navigation } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

// Fix for default Leaflet marker icon in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

// Custom icon for user location
const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `<div style="
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Custom icons for medical facilities
const createFacilityIcon = (type: 'hospital' | 'clinic' | 'pharmacy') => {
  const colors = {
    hospital: '#ef4444', // red
    clinic: '#3b82f6', // blue
    pharmacy: '#10b981', // green
  };

  const icons = {
    hospital: '🏥',
    clinic: '🏥',
    pharmacy: '💊',
  };

  return L.divIcon({
    className: 'custom-facility-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      background: ${colors[type]};
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      font-size: 16px;
    ">${icons[type]}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface MapCenterProps {
  center: [number, number];
}

function MapCenter({ center }: MapCenterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [map, center]);
  return null;
}

interface HospitalMapProps {
  userLat: number;
  userLng: number;
  facilities: MedicalFacility[];
}

export default function HospitalMap({ userLat, userLng, facilities }: HospitalMapProps) {
  const { t } = useTranslation();

  const handleGetDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[userLat, userLng]}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 0 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapCenter center={[userLat, userLng]} />
        
        {/* User location marker */}
        <Marker position={[userLat, userLng]} icon={createUserIcon()}>
          <Popup>
            <div className="text-sm font-semibold text-gray-800">
              {t('yourLocation') || 'Your Location'}
            </div>
          </Popup>
        </Marker>

        {/* Medical facility markers */}
        {facilities.map((facility) => (
          <Marker
            key={facility.id}
            position={[facility.lat, facility.lng]}
            icon={createFacilityIcon(facility.type)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-sm text-gray-900 mb-1">{facility.name}</h3>
                <p className="text-xs text-gray-600 mb-2 capitalize">{facility.type}</p>
                <button
                  onClick={() => handleGetDirections(facility.lat, facility.lng)}
                  className="w-full mt-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-xs font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <Navigation size={12} />
                  {t('getDirections') || 'Get Directions'}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

