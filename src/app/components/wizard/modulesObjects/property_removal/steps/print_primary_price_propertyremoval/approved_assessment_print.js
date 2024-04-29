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
  label: "محضر لجنة التقدير المبدئي",
  className: "khetab",
  sections: {
    approved_assessment_print: {
      label: "محضر لجنة التقدير المبدئي",
      className: "radio_det",
      fields: {
        ma7dar_attachment: {
          label: "مرفق محضر لجنة التقدير المبدئي",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          //uploadUrl: `${host}uploadFile/`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
        },
        print: {
          label: "طباعة محضر لجنة التقدير المبدئي",
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
