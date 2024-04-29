import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import applyFilters from "main_helpers/functions/filters";
import { withTranslation } from "react-i18next";
import {
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArray,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getFileName,
  checkUploadedLayersFullyContainedByBoundry,
  getMapGraphics,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";

export default {
  label: "إصدار خطاب سريان مفعول الصك",
  className: "khetab",
  sections: {
    letter_print: {
      label: "إصدار خطاب سريان مفعول الصك",
      className: "radio_det",
      fields: {
        print: {
          label: "طباعة خطاب سريان مفعول الصك",
          //hideLabel: true,
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          permission: {
            show_if_val_equal: {
              key: "mainObject.afada_adle_statements.afada_adle_statements.table_afada.length",
              value: 0,
              defaultValue: 0,
            },
          },
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);
              let id = stepItem["wizard"]["currentModule"]["record"].id;
              // let mainObject = props["mainObject"];
              // // let edit_price = props["values"];
              // // localStorage.setItem("edit_price", JSON.stringify(edit_price));
              // const url = "/Submission/SaveEdit";
              // const params = { sub_id: id };
              // delete mainObject.temp;
              // return postItem(
              //   url,
              //   { mainObject: mainObject, tempFile: {} },
              //   { params }
              // ).then(() =>
              window.open(
                printHost + `/#/sakPropertycheck_letter/${id}`,
                "_blank"
              );
              // );
            },
          },
        },
        print_return: {
          label: "طباعة اعادة خطاب سريان مفعول الصك",
          //hideLabel: true,
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          permission: {
            show_if_val_not_equal: {
              key: "mainObject.afada_adle_statements.afada_adle_statements.table_afada.length",
              value: 0,
              defaultValue: 0,
            },
          },
          // permission: {
          //   check_props_values: [
          //     {
          //       key: "mainObject.afada_adle_statements.afada_adle_statements.table_afada.length",
          //       value: [0, undefined],
          //       equals: false,
          //     },
          //   ],
          // },
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);
              let id = stepItem["wizard"]["currentModule"]["record"].id;
              // let mainObject = props["mainObject"];
              // // let edit_price = props["values"];
              // // localStorage.setItem("edit_price", JSON.stringify(edit_price));
              // const url = "/Submission/SaveEdit";
              // const params = { sub_id: id };
              // delete mainObject.temp;
              // return postItem(
              //   url,
              //   { mainObject: mainObject, tempFile: {} },
              //   { params }
              // ).then(() =>
              window.open(
                printHost + `/#/sakPropertycheck_letter_return/${id}`,
                "_blank"
              );
              // );
            },
          },
        },
      },
    },
  },
};
