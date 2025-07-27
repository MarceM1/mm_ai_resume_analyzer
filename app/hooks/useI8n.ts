import en from '~/local/en.json';
import es from '~/local/es.json';
import { useLanguageStore } from '~/lib/language';

const translations = {
  en,
  es,
};

export const useI18n = () => {
  const language = useLanguageStore((state) => state.language);
  return translations[language];
};