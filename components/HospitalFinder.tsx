'use client';

import { MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function HospitalFinder() {
  const { t } = useTranslation();
  const handleFindHospital = () => {
    window.open('https://www.google.com/maps/search/hospital+near+me', '_blank');
  };

  return (
    <button
      onClick={handleFindHospital}
      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 sm:py-4 px-4 sm:px-5 rounded-xl sm:rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:shadow-2xl font-bold text-sm sm:text-base group"
    >
      <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
        <MapPin size={20} className="sm:w-[22px] sm:h-[22px]" />
      </div>
      <span>{t('findHospital')}</span>
    </button>
  );
}
