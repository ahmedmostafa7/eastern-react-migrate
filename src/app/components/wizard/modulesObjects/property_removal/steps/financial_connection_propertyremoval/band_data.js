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
  label: "بيانات البند",
  sections: {
    band_data: {
      label: "بيانات البند",
      type: "inputs",
      required: true,
      fields: {
        band_name: {
          moduleName: "band_name",
          label: "اسم البند",
          required: true,
          field: "text",
        },
        band_number: {
          moduleName: "band_number",
          label: "رقم البند",
          required: true,
          field: "text",
        },
        financial_year: {
          moduleName: "financial_year",
          label: "السنة المالية",
          required: true,
          field: "text",
        },
      },
    },
  },
};
