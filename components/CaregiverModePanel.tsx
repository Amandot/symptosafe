'use client';

import { Heart } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function CaregiverModePanel() {
  const { caregiverMode, setCaregiverMode } = useAppStore();
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-pink-50 to-rose-50 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-pink-200">
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={caregiverMode}
          onChange={(e) => setCaregiverMode(e.target.checked)}
          className="w-5 h-5 text-pink-500 rounded focus:ring-2 focus:ring-pink-500 cursor-pointer"
        />
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
            <Heart size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-800">{t('caregiverMode')}</div>
            <div className="text-xs text-gray-600">{t('describeForSomeone')}</div>
          </div>
        </div>
      </label>
    </div>
  );
}
