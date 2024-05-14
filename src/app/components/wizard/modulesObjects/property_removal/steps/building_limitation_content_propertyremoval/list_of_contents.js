import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
const _ = require("lodash");
export default {
  number: 1,
  label: "حصر المشتملات",
  sections: {
    list_of_contents: {
      label: "حصر المشتملات",
      type: "inputs",
      required: true,
      fields: {
        akar_site: {
          name: "akar_site",
          moduleName: "akar_site",
          label: "موقع العقار",
          required: true,
          field: "select",
          data: [
            {
              label: "داخل حدود التنمية",
              value: 1,
            },
            {
              label: "خارج حدود التنمية",
              value: 2,
            },
          ],
        },
        akar_type: {
          label: "نوع العقار",
          placeholder: "من فضلك ادخل نوع العقار",
          field: "text",
          name: "akar_type",
          required: true,
        },
        building_exists: {
          label: "يوجد مبنى",
          hideLabel: true,
          field: "boolean",
          // required: true,
        },
        building_type: {
          label: "نوع البناء",
          placeholder: "من فضلك ادخل نوع البناء",
          field: "text",
          name: "building_type",
          required: true,
          permission: {
            show_every: ["building_exists"],
          },
        },
        building_status: {
          name: "building_status",
          moduleName: "building_status",
          label: "حالة البناء",
          required: true,
          field: "select",
          data: [
            {
              label: "ممتاز",
              value: 1,
            },
            {
              label: "جيد",
              value: 2,
            },
            {
              label: "وسط",
              value: 3,
            },
            {
              label: "ردئ",
              value: 4,
            },
            {
              label: "متصدع",
              value: 5,
            },
            {
              label: "متهدم",
              value: 6,
            },
          ],
          permission: {
            show_every: ["building_exists"],
          },
        },
        floors_count: {
          label: "عدد الادوار",
          placeholder: "من فضلك ادخل عدد الادوار",
          field: "inputNumber",
          name: "floors_count",
          required: true,
          permission: {
            show_every: ["building_exists"],
          },
        },
        contents: {
          field: "textArea",
          required: true,
          rows: "8",
          // textEdit:"-حسب استمارة طلب شراء الزائدة الموقعة من سعادة مدير عام التخطيط العمراني بموجب خطاب رقم   بتاريخ  هـ المرفقة ضمن أوراق المعاملة -	وبعد دراسة الأوراق اتضح لأعضاء اللجنة أن المساحة الزائدة التنظيمية الشائعة المطلوب شرائها لا يمكن البناء عليها بشكل مستقل وتقع ضمن حدود خطوط التنظيم داخل أرض المواطن المذكور وليس في بيعها عليه ضرر على أحد وبناءا عليه يرى أعضاء اللجنة ان يتم بيع المساحة الزائدة المشار اليها بهذا المحضر على المواطن المذكور أعلاه",
          label: "المشتملات",
        },
        addons: {
          field: "textArea",
          rows: "8",
          // textEdit:"-حسب استمارة طلب شراء الزائدة الموقعة من سعادة مدير عام التخطيط العمراني بموجب خطاب رقم   بتاريخ  هـ المرفقة ضمن أوراق المعاملة -	وبعد دراسة الأوراق اتضح لأعضاء اللجنة أن المساحة الزائدة التنظيمية الشائعة المطلوب شرائها لا يمكن البناء عليها بشكل مستقل وتقع ضمن حدود خطوط التنظيم داخل أرض المواطن المذكور وليس في بيعها عليه ضرر على أحد وبناءا عليه يرى أعضاء اللجنة ان يتم بيع المساحة الزائدة المشار اليها بهذا المحضر على المواطن المذكور أعلاه",
          label: "الاضافات التجميلية داخل البناء",
        },
        notes: {
          field: "textArea",
          rows: "8",
          // textEdit:"-حسب استمارة طلب شراء الزائدة الموقعة من سعادة مدير عام التخطيط العمراني بموجب خطاب رقم   بتاريخ  هـ المرفقة ضمن أوراق المعاملة -	وبعد دراسة الأوراق اتضح لأعضاء اللجنة أن المساحة الزائدة التنظيمية الشائعة المطلوب شرائها لا يمكن البناء عليها بشكل مستقل وتقع ضمن حدود خطوط التنظيم داخل أرض المواطن المذكور وليس في بيعها عليه ضرر على أحد وبناءا عليه يرى أعضاء اللجنة ان يتم بيع المساحة الزائدة المشار اليها بهذا المحضر على المواطن المذكور أعلاه",
          label: "الملاحظات (ان وجدت)",
        },
      },
    },
  },
};
