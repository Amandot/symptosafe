'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { MapPin, Loader2, AlertCircle, Navigation } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { fetchNearbyMedicalFacilities, type MedicalFacility } from '@/lib/utils/overpass-api';

// Dynamically import HospitalMap with SSR disabled (required for Leaflet)
const HospitalMap = dynamic(() => import('./HospitalMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={32} />
    </div>
  ),
});

export default function HospitalFinder() {
  const { t } = useTranslation();
  const { latitude, longitude, loading, error } = useGeolocation();
  const [facilities, setFacilities] = useState<MedicalFacility[]>([]);
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);
  const [facilitiesError, setFacilitiesError] = useState<string | null>(null);

  const handleGetDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  // Fetch facilities when location is available
  useEffect(() => {
    if (latitude && longitude && !facilitiesLoading && facilities.length === 0) {
      setFacilitiesLoading(true);
      fetchNearbyMedicalFacilities(latitude, longitude, 5000)
        .then((fetchedFacilities) => {
          setFacilities(fetchedFacilities);
          setFacilitiesError(null);
        })
        .catch((err) => {
          console.error('Error fetching facilities:', err);
          setFacilitiesError(err instanceof Error ? err.message : 'Failed to load facilities');
        })
        .finally(() => {
          setFacilitiesLoading(false);
        });
    }
  }, [latitude, longitude, facilitiesLoading, facilities.length]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100"
      >
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
          <p className="text-sm sm:text-base text-gray-700 font-medium">
            {t('requestingLocation') || 'Requesting your location...'}
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100"
      >
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertCircle className="text-red-600" size={48} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            {t('locationAccessRequired') || 'Location Access Required'}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {t('tryAgain') || 'Try Again'}
          </button>
        </div>
      </motion.div>
    );
  }

  if (!latitude || !longitude) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100"
      >
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
          <div className="bg-indigo-100 p-4 rounded-full mb-4">
            <MapPin className="text-indigo-600" size={48} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            {t('enableLocation') || 'Enable Location Access'}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 max-w-md">
            {t('locationPrompt') || 'Please grant location access to find nearby hospitals, clinics, and pharmacies.'}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* Map Container */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100 overflow-hidden">
        <div className="h-[500px] sm:h-[600px] w-full">
          <HospitalMap userLat={latitude} userLng={longitude} facilities={facilities} />
        </div>
      </div>

      {/* Facilities List */}
      {facilitiesLoading ? (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 shadow-xl border border-purple-100">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-indigo-600 mr-3" size={24} />
            <span className="text-sm sm:text-base text-gray-700 font-medium">
              {t('loadingFacilities') || 'Loading nearby facilities...'}
            </span>
          </div>
        </div>
      ) : facilitiesError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl sm:rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <p className="text-sm sm:text-base text-red-800">{facilitiesError}</p>
          </div>
        </div>
      ) : facilities.length > 0 ? (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-purple-100">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="text-indigo-600" size={24} />
            {t('nearbyFacilities') || 'Nearby Medical Facilities'}
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({facilities.length})
            </span>
          </h3>
          <div className="space-y-3">
            {facilities.map((facility) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {facility.type === 'hospital' ? '🏥' : facility.type === 'clinic' ? '🏥' : '💊'}
                      </span>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {facility.name}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize mb-2">
                      {facility.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {facility.lat.toFixed(6)}, {facility.lng.toFixed(6)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleGetDirections(facility.lat, facility.lng)}
                    className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <Navigation size={14} />
                    <span className="hidden sm:inline">{t('getDirections') || 'Directions'}</span>
                    <span className="sm:hidden">{t('directions') || 'Go'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 shadow-xl border border-purple-100">
          <div className="text-center py-8">
            <MapPin className="text-gray-400 mx-auto mb-3" size={48} />
            <p className="text-sm sm:text-base text-gray-600">
              {t('noFacilitiesFound') || 'No medical facilities found nearby. Try expanding your search radius.'}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
