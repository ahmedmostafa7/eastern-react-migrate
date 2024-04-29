import { workFlowUrl, host } from "imports/config";
import { fetchData, postItem } from "app/helpers/apiMethods";
import { map, get } from "lodash";
import { printHost } from "imports/config";
export default {
  label: "دباجة  محضر اللجنة الفنية",
  sections: {
    debagh: {
      label: " دباجة طباعة محضر اللجنة الفنية ",
      fields: {
        debagh_text_area: {
          field: "textArea",
          required: true,
          rows: "8",
          textEdit:
            "-	وبعد دراسة الأوراق اتضح لأعضاء اللجنة أن المساحة الزائدة التنظيمية الشائعة المطلوب شرائها لا يمكن البناء عليها بشكل مستقل وتقع ضمن حدود خطوط التنظيم داخل أرض المواطن المذكور وليس في بيعها عليه ضرر على أحد وبناءا عليه يرى أعضاء اللجنة ان يتم بيع المساحة الزائدة المشار اليها بهذا المحضر على المواطن المذكور أعلاه",
          label: "دباجة طباعة محضر اللجنة الفنية",
        },
      },
    },
  },
};
