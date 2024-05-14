import i18n from "i18next";
import { en } from "./english";
import { ar } from "./arabic";
// import { initReactI18next } from "react-i18next";
// import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        //English translations here
      },
    },
    ja: {
      translation: {
        //Japanese translations here
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
});
// i18n.use("ar").init({
//   resources: {
//     en: en,
//     ar: ar,
//   },
//   fallbackLng: "ar",

//   ns: ["common", "user", "admins", "mobileSideMenu"],
//   defaultNS: "common",

//   keySeparator: false, // we use content as keys
//   interpolation: {
//     escapeValue: false, // not needed for react!!
//     formatSeparator: ",",
//   },

//   react: {
//     wait: true,
//   },
// });

export default i18n;
