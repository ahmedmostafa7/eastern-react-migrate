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
  label: "اعداد محضر وصف وحصر المشتملات",
  className: "khetab",
  sections: {
    prepare_limitation_reports_print: {
      label: "اعداد محضر وصف وحصر المشتملات",
      className: "radio_det",
      fields: {
        ma7dar_limitation_report_print: {
          label: "محضر حصر المشتملات",
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
                printHost + `/#/building_limitation_report/${id}`,
                "_blank"
              );
              // );
            },
          },
        },
        image_limitation_report: {
          label: "مرفق محضر حصر المشتملات موقع ومعتمد",
          placeholder: "select file",
          field: "simpleUploader",
          multiple: false,
          required: true,
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          // name: "image",
          // path: SubAttachementUrl + "submission/identity_photo",
        },
        ma7dar_descripe_limitation_building_report_print: {
          label: "محضر وصف وتقدير أرض ومشتملات العقار",
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
                printHost + `/#/descripe_limitation_building_report/${id}`,
                "_blank"
              );
              // );
            },
          },
        },
        image_descripe_limitation_building_report: {
          label: "مرفق محضر وصف وتقدير أرض ومشتملات العقار موقع ومعتمد",
          placeholder: "select file",
          field: "simpleUploader",
          multiple: false,
          required: true,
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          // name: "image",
          // path: SubAttachementUrl + "submission/identity_photo",
        },
        ma7dar_final_price_lagna_takdeer_print: {
          label: "محضر لجنة تقدير نزع الملكية",
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
                printHost + `/#/final_price_lagna_takdeer/${id}`,
                "_blank"
              );
              // );
            },
          },
        },
        image_final_price_lagna_takdeer: {
          label: "مرفق محضر لجنة تقدير نزع الملكية موقع ومعتمد",
          placeholder: "select file",
          field: "simpleUploader",
          multiple: false,
          required: true,
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          // name: "image",
          // path: SubAttachementUrl + "submission/identity_photo",
        },
      },
    },
  },
};
