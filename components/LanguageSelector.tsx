'use client';

import { Globe } from 'lucide-react';
import { useAppStore } from '@/lib/store/useAppStore';
import type { Language } from '@/types';

export default function LanguageSelector() {
  const { language, setLanguage } = useAppStore();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
        <Globe size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
      </div>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-white/90 backdrop-blur-md border-2 border-purple-200 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
