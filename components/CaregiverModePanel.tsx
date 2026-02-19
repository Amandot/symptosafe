'use client';

import { Heart } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function CaregiverModePanel() {
  const { caregiverMode, setCaregiverMode } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-lg border border-pink-200">
      <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={caregiverMode}
          onChange={(e) => setCaregiverMode(e.target.checked)}
          className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500 rounded focus:ring-2 focus:ring-pink-500 cursor-pointer"
        />
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform">
            <Heart size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm sm:text-base">{t('caregiverMode')}</div>
            <div className="text-[10px] sm:text-xs text-gray-600">{t('describeForSomeone')}</div>
          </div>
        </div>
      </label>
    </div>
  );
}
