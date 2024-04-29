import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
import { uuid } from "uuidv4";
const _ = require("lodash");
export default {
  number: 1,
  label: "صرف التعويض",
  preSubmit(values, currentStep, props) {
    const { t } = props;
    return new Promise(function (resolve, reject) {
      if (
        !values?.compensation_shake?.compensationShake?.selectedLands ||
        values?.compensation_shake?.compensationShake?.selectedLands?.find(
          (r) =>
            !r.attributes.COMPENSATION_ATTACHMENT ||
            !r.attributes.CHEQUE_ATTACHMENT
        )
      ) {
        window.notifySystem(
          "error",
          "من فضلك ادخل	مرفق خطاب الصرف و	مرفق شيك الصرف لكل الأراضي"
        );
        return reject();
      }

      Object.keys(values?.compensation_shake || {}).forEach((fieldKey) => {
        if (
          !Object.keys(
            props.wizardSettings.steps.compensation_shake.sections
              .compensation_shake.fields
          ).find((r) => r == fieldKey)
        ) {
          delete values?.compensation_shake?.[fieldKey];
        }
      });

      return resolve(values);
    });
  },
  sections: {
    compensation_shake: {
      label: "صرف التعويض",
      type: "inputs",
      required: true,
      fields: {
        compensationShake: {
          field: "compensationShake",
          moduleName: "compensationShake",
          hideLabel: true,
          label: "صرف التعويض",
          disabled: false,
        },
        allParcelsPaid: {
          label: "تم الصرف لجميع الأراضي",
          hideLabel: true,
          field: "boolean",
          required: true,
        },
      },
    },
  },
};
