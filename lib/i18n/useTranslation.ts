import { useAppStore } from '../store/useAppStore';
import { translations } from './translations';

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { t, language };
}
