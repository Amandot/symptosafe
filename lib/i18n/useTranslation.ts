import { useAppStore } from '../store/useAppStore';
import { translations } from './translations';

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  
  const t = (
    key: keyof typeof translations.en,
    params?: Record<string, string | number>
  ): string => {
    const template = translations[language][key] || translations.en[key] || String(key);
    if (!params) return template;

    return Object.entries(params).reduce((acc, [k, v]) => {
      return acc.replaceAll(`{${k}}`, String(v));
    }, template);
  };

  return { t, language };
}
