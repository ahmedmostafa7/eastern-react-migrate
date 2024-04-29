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
  label: "بيانات الحكم القضائي / الخطاب",
  sections: {
    judge_letter: {
      label: "بيانات الحكم القضائي / الخطاب",
      type: "inputs",
      required: true,
      fields: {
        data_type: {
          showSearch: true,
          moduleName: "data_type",
          label: "نوع طلب النزع",
          placeholder: "من فضلك اختر نوع طلب النزع",
          field: "select",
          label_key: "name",
          value_key: "id",
          data: [
            { id: 1, name: " حكم قضائي" },
            { id: 2, name: " خطاب" },
          ],
          required: true,
          selectChange: (val, rec, props) => {
            if (val == 1) {
              props.change("judge_letter.letter_no", null);
              props.change("judge_letter.letter_date", null);
              props.change("judge_letter.municipality_entry_no", null);
              props.change("judge_letter.municipality_entry_date", null);
              props.change("judge_letter.letter_attachment", null);
            } else {
              props.change("judge_letter.case_no", null);
              props.change("judge_letter.judge_no", null);
              props.change("judge_letter.judge_date", null);
              props.change("judge_letter.judge_attachment", null);
            }
          },
        },
        case_no: {
          moduleName: "case_no",
          label: "رقم القضية",
          required: true,
          field: "text",
          permission: { show_match_value: { data_type: 1 } },
        },
        judge_no: {
          moduleName: "judge_no",
          label: "رقم الحكم القضائي",
          required: true,
          field: "text",
          permission: { show_match_value: { data_type: 1 } },
        },
        judge_date: {
          moduleName: "judge_date",
          label: "تاريخ الحكم القضائي",
          required: true,
          field: "hijriDatePicker",
          permission: { show_match_value: { data_type: 1 } },
        },
        judge_attachment: {
          label: "مرفق صورة من الحكم القضائي",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          //uploadUrl: `${host}uploadFile/`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
          permission: { show_match_value: { data_type: 1 } },
        },
        letter_no: {
          moduleName: "letter_no",
          label: "رقم الخطاب",
          required: true,
          field: "text",
          permission: { show_match_value: { data_type: 2 } },
        },
        letter_date: {
          moduleName: "letter_date",
          label: "تاريخ الخطاب",
          required: true,
          field: "hijriDatePicker",
          permission: { show_match_value: { data_type: 2 } },
        },
        municipality_entry_no: {
          moduleName: "municipality_entry_no",
          label: "رقم الورود للأمانة",
          required: true,
          field: "text",
          permission: { show_match_value: { data_type: 2 } },
        },
        municipality_entry_date: {
          moduleName: "municipality_entry_date",
          label: "تاريخ الورود للأمانة",
          required: true,
          field: "hijriDatePicker",
          permission: { show_match_value: { data_type: 2 } },
        },
        letter_attachment: {
          label: "مرفق صورة من الخطاب",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          //uploadUrl: `${host}uploadFile/`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
          permission: { show_match_value: { data_type: 2 } },
        },
      },
    },
  },
};
