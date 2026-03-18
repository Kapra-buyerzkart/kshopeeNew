import i18n, { ModuleType, LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import hi from '../locales/hi.json';

const LANGUAGE_KEY = 'user-language';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lang: string) => void) => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then((savedLanguage) => {
        callback(savedLanguage || 'en');
      })
      .catch((error) => {
        console.warn('Language detection error:', error);
        callback('en');
      });
  },
  init: () => { },
  cacheUserLanguage: (lang: string) => {
    AsyncStorage.setItem(LANGUAGE_KEY, lang).catch((error) => {
      console.warn('Language cache error:', error);
    });
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

export default i18n;
