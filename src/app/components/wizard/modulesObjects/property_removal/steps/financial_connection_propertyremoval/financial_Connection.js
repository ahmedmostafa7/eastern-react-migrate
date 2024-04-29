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
  label: "الارتباط المالي",
  preSubmit(values, currentStep, props) {
    const { t } = props;
    return new Promise(function (resolve, reject) {
      if (values.financial_connection.amount_availability == "2") {
        return reject();
      }
      return resolve(values);
    });
  },
  sections: {
    financial_connection: {
      label: "الارتباط المالي",
      type: "inputs",
      required: true,
      fields: {
        amount_availability: {
          field: "radio",
          initValue: "1",
          required: true,
          // hideLabel: true,
          label: "حالة الارتباط المالي",
          options: {
            available: {
              label: "متوفر المبلغ",
              value: "1",
            },
            not_available: {
              label: "غير متوفر المبلغ",
              value: "2",
            },
          },
          onClick: (event, props) => {
            if (event.target.value == 1) {
              props.change("financial_connection.not_available_notes", null);
            } else {
              props.change("financial_connection.available_notes", null);
            }

            props.input.onChange(event.target.value);
          },
        },
        available_notes: {
          label: "ملاحظات",
          moduleName: "available_notes",
          field: "textArea",
          rows: 4,
          permission: { show_match_value: { amount_availability: "1" } },
        },
        not_available_notes: {
          label: "ملاحظات",
          moduleName: "not_available_notes",
          field: "textArea",
          rows: 4,
          required: true,
          permission: { show_match_value: { amount_availability: "2" } },
        },
      },
    },
  },
};
