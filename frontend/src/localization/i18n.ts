import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import translationEn from "./en.json";

const resources: Resource = {
  en: { translation: translationEn },
};

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: getLocales()[0].languageCode ?? "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
