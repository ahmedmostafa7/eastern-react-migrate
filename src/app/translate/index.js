import i18n from "i18next";
import { en } from "./english";
import { ar } from "./arabic";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
// i18n.use(initReactI18next);
i18n.use("ar").init({
  // we init with resources
  resources: {
    en: en,
    ar: ar,
  },
  fallbackLng: "ar",
  // debug: true,

  // have a common namespace used around the full app
  ns: ["common", "user", "admins", "mobileSideMenu"],
  defaultNS: "common",

  keySeparator: false, // we use content as keys
  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ",",
  },

  react: {
    wait: true,
  },
});

export default i18n;
