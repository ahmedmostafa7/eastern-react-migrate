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
  label: "الموقع التفصيلي للمخطط",
  preSubmit(values, currentStep, props) {
    const { t } = props;

    var mapObj = getMap();
    return new Promise(function (resolve, reject) {
      if (mapObj) {
        function printResult(result) {
          props.mainObject.landData.landData.detailed_Image = result.value;
          resolve(props.formValues || values);
        }

        mapSreenShot(mapObj, printResult, () => {}, false, "data_msa7y");
      } else {
        return resolve(values);
      }
    });
  },
  sections: {
    msa7yData: {
      init_data: (values, props, fields) => {
        let data = getUsingSymbols().then((res) => {
          props.setSelector("usingSymbolType", {
            data: res,
          });
        });
      },
      label: "تحديد الموقع التفصيلي للمخطط",
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
          enableDownloadCad: false,
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
        //,
        // submissionType: {
        //   moduleName: "submissionType",
        //   required: true,
        //   label: "نوع المعاملة",
        //   placeholder: "من فضلك ادخل نوع المعاملة",
        //   field: "select",
        //   label_key: "name",
        //   value_key: "code",
        //   data: [
        //     { code: "شارع", name: "شارع" },
        //     { code: "ساحة", name: "ساحة" },
        //     { code: "ممر مشاة", name: "ممر مشاة" },
        //     { code: "ساحة و شارع", name: "ساحة و شارع" },
        //     { code: "ساحة و ممر مشاة", name: "ساحة و ممر مشاة" },
        //   ],
        //   disabled: true
        // },
        // benefitsType: {
        //   moduleName: "benefitsType",
        //   required: true,
        //   label: "نوع معاوضة الفائدة",
        //   placeholder: "من فضلك ادخل نوع معاوضة الفائدة",
        //   field: "select",
        //   label_key: "name",
        //   value_key: "code",
        //   data: [
        //     { code: "البيع", name: "البيع" },
        //     { code: "المعاوضة", name: "المعاوضة" },
        //   ],
        //   disabled: true
        // },
        // usingSymbolType: {
        //   moduleName: "usingSymbolType",
        //   required: true,
        //   label: "نوع استخدام المنطقة",
        //   placeholder: "من فضلك ادخل نوع استخدام المنطقة",
        //   field: "select",
        //   label_key: "name",
        //   value_key: "code",
        //   disabled: true
        // },
      },
    },
  },
};
