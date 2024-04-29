import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
const _ = require("lodash");
export default {
  number: 1,
  label: "بيانات العقار",
  sections: {
    akar_data: {
      label: "بيانات العقار",
      type: "inputs",
      required: true,
      fields: {
        akar_type: {
          moduleName: "akar_type",
          label: "نوع العقار",
          required: true,
          field: "text",
        },
        development_type: {
          moduleName: "development_type",
          label: "نوع البناء",
          required: true,
          field: "text",
        },
        count_of_floors: {
          moduleName: "count_of_floors",
          label: "عدد الأدوار",
          required: true,
          field: "text",
        },
        development_status: {
          showSearch: true,
          moduleName: "development_status",
          label: "حالة البناء",
          placeholder: "من فضلك حالة البناء",
          field: "select",
          label_key: "name",
          value_key: "id",
          data: [
            { id: 1, name: "ممتاز" },
            { id: 2, name: "جيد" },
            { id: 3, name: "وسط" },
            { id: 4, name: "ردئ" },
            { id: 5, name: "متصدع" },
            { id: 6, name: "منهدم" },
          ],
          required: true,
        },
        additions: {
          label: "الاضافات التجميلية داخل البناء",
          field: "textArea",
          rows: 4,
          maxLength: 100,
        },
      },
    },
  },
};
