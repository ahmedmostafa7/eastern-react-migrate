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
  label: "محضر التقدير المبدئي",
  className: "khetab",
  sections: {
    primary_assessment_print: {
      label: "محضر التقدير المبدئي",
      className: "radio_det",
      fields: {
        print: {
          label: "طباعة محضر التقدير المبدئي",
          //hideLabel: true,
          field: "button",
          className: "botnPrint",
          text: "طباعة",
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
                printHost + `/#/pri_price_lagna_takdeer/${id}`,
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
