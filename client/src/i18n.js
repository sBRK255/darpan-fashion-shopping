import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './translations/en';
import swTranslations from './translations/sw';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslations },
            sw: { translation: swTranslations }
        },
        lng: localStorage.getItem('language') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n; 