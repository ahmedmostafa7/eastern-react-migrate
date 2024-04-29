import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import { withTranslation } from "react-i18next";
import {
  redrawNames,
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArray,
  objectPropFreqsInArrayForKroki,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getFileName,
  getPacrelNoAngle,
  formatPythonObject,
  convertToArabic,
  localizeNumber,
  getMapGraphics,
  getUsingSymbols,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
export default {
  label: "الوضع المقترح",
  sections: {
    msa7yData: {
      init_data: (values, props, fields) => {
        let data = getUsingSymbols().then((res) => {
          props.setSelector("usingSymbolType", {
            data: res,
          });
        });
      },
      label: "الوضع المقترح",
      className: "radio_det",
      fields: {
        mapviewer: {
          label: "طبقات الخريطة",
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,
          ...extraMapOperations,
          cad: {},
          baseMapUrl: window.mapUrl,
          enableDownloadCad: true,
          hideLabel: true,
          fullMapWidth: true,
        },
        cadDetails: {
          label: "تفاصيل الكاد",
          moduleName: "mapviewer",
          field: "cadSuggestedData", // دي لازم تبقا  submitCADSuggestedData
          isView: true,
          hideLabel: true,
        },
        submissionType: {
          moduleName: "submissionType",
          required: true,
          label: "نوع المعاملة",
          placeholder: "من فضلك ادخل نوع المعاملة",
          field: "select",
          label_key: "name",
          value_key: "code",
          data: [
            { code: "شارع", name: "شارع" },
            { code: "ساحة", name: "ساحة" },
            { code: "ممر مشاة", name: "ممر مشاة" },
            { code: "ساحة و شارع", name: "ساحة و شارع" },
            { code: "ساحة و ممر مشاة", name: "ساحة و ممر مشاة" },
          ],
          disabled: true,
        },
        benefitsType: {
          moduleName: "benefitsType",
          required: true,
          label: "نوع معاوضة الفائدة",
          placeholder: "من فضلك ادخل نوع معاوضة الفائدة",
          field: "select",
          label_key: "name",
          value_key: "code",
          data: [
            { code: "البيع", name: "البيع" },
            { code: "المعاوضة", name: "المعاوضة" },
          ],
          disabled: (values, props) => {
            return (
              [2414, 2535].indexOf(props.currentModule.record.CurrentStep.id) ==
              -1
            );
          },
        },
        usingSymbolType: {
          moduleName: "usingSymbolType",
          required: true,
          label: "نوع استخدام المنطقة",
          placeholder: "من فضلك ادخل نوع استخدام المنطقة",
          field: "select",
          label_key: "name",
          value_key: "code",
          disabled: true,
        },
      },
    },
  },
};
