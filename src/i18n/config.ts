import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ptJSON from './locales/pt.json';
import enJSON from './locales/en.json';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            pt: { translation: ptJSON },
            en: { translation: enJSON },
        },
        lng: 'pt', // Default to Portuguese
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
