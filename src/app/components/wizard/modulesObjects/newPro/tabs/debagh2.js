import { workFlowUrl, host } from "imports/config";
import { fetchData, postItem } from "app/helpers/apiMethods";
import { map, get } from "lodash";
import { printHost } from "imports/config";
export default {
  label: "دباجة  محضر تقدير الملكيات",
  sections: {
    debagh: {
      label: " دباجة  محضر تقدير الملكيات ",
      fields: {
        debagh_text_area: {
          field: "textArea",
          required: true,
          rows: "8",
          //   textEdit:"-حسب استمارة طلب شراء الزائدة الموقعة من سعادة مدير عام التخطيط العمراني بموجب خطاب رقم   بتاريخ  هـ المرفقة ضمن أوراق المعاملة -	وبعد دراسة الأوراق اتضح لأعضاء اللجنة أن المساحة الزائدة التنظيمية الشائعة المطلوب شرائها لا يمكن البناء عليها بشكل مستقل وتقع ضمن حدود خطوط التنظيم داخل أرض المواطن المذكور وليس في بيعها عليه ضرر على أحد وبناءا عليه يرى أعضاء اللجنة ان يتم بيع المساحة الزائدة المشار اليها بهذا المحضر على المواطن المذكور أعلاه",
          label: "دباجة  محضر تقدير الملكيات",
        },
      },
    },
  },
};
