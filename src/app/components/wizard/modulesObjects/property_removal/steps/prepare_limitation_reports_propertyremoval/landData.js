import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import { getMap } from "main_helpers/functions/filters/state";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
import { mapSreenShot } from "../../../../../inputs/fields/identify/Component/common";
const _ = require("lodash");
export default {
  number: 3,
  label: "التقدير المالي",
  preSubmit(values, currentStep, props) {
    const {
      t,
      currentModule: { id },
    } = props;
    return new Promise(function (resolve, reject) {
      return resolve(values);
    });
  },
  sections: {
    landData: {
      label: "التقدير المالي",
      type: "inputs",
      fields: {
        lands: {
          moduleName: "lands",
          label: "بيانات الأرض",
          hideLabel: true,
          field: "propertyRemovalIdentify",
          className: "land_data",
          enableDownloadCad: false,
          ...extraMapOperations,
          showMap: false,
        },
      },
    },
  },
};
