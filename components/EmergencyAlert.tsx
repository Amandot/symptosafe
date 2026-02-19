'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MapPin } from 'lucide-react';
import type { EmergencyResult } from '@/types';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface EmergencyAlertProps {
  emergency: EmergencyResult;
}

export default function EmergencyAlert({ emergency }: EmergencyAlertProps) {
  const { t } = useTranslation();

  if (!emergency.isEmergency) return null;

  const handleCallEmergency = () => {
    window.location.href = 'tel:911';
  };

  const handleFindHospital = () => {
    window.open('https://www.google.com/maps/search/hospital+near+me', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800 z-50 flex items-center justify-center p-3 sm:p-4"
    >
      <div className="max-w-2xl w-full">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 sm:p-6 inline-block mb-3 sm:mb-4">
            <AlertTriangle size={60} className="sm:w-[90px] sm:h-[90px] text-white" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 sm:mb-3 drop-shadow-2xl">
            {t('emergency')}
          </h1>
          <p className="text-lg sm:text-2xl text-white/95 font-semibold">{emergency.emergencyType}</p>
        </motion.div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl mb-4 sm:mb-6 border-4 border-white/50">
          <p className="text-base sm:text-xl text-gray-800 mb-5 sm:mb-8 text-center font-medium leading-relaxed">
            {emergency.message}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCallEmergency}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 sm:py-5 px-5 sm:px-6 rounded-xl sm:rounded-2xl hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg font-bold shadow-xl"
            >
              <Phone size={22} className="sm:w-[26px] sm:h-[26px]" />
              {t('callEmergency')}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFindHospital}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 sm:py-5 px-5 sm:px-6 rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg font-bold shadow-xl"
            >
              <MapPin size={22} className="sm:w-[26px] sm:h-[26px]" />
              {t('findHospital')}
            </motion.button>
          </div>
        </div>

        <p className="text-white text-center text-xs sm:text-sm font-medium bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-2.5 sm:p-3">
          {t('disclaimer')}
        </p>
      </div>
    </motion.div>
  );
}
