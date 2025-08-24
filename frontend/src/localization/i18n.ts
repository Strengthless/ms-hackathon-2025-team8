import i18n, { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'

// Import translation files
import translationEn from './en.json'
import translationZhHK from './zh-HK.json'

const resources: Resource = {
    en: { translation: translationEn },
    'zh-HK': { translation: translationZhHK },
}

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
    resources,
    lng: getLocales()[0].languageCode ?? 'en', // default based on device
    fallbackLng: 'en', // important for when translations are missing
    interpolation: {
        escapeValue: false,
    },
    react: { useSuspense: false },
})

export default i18n
