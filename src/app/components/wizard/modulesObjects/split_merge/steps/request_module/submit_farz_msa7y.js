import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import { withTranslation } from "react-i18next";
import {
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
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
import { submitFarzSplitAndMerge } from "./farzSubmitFunction";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
export default {
  label: "اعتماد الوضع المقترح",
  // preSubmit(values, currentStep, props) {
  //   const { t } = props;
  //   var map = getMap();
  //   return new Promise(function (resolve, reject) {
  //     let {
  //       formValues: {
  //         msa7yData: { cadDetails },
  //       },
  //     } = props;
  //     submitFarzSplitAndMerge(map, cadDetails, props).then(
  //       (response) => {
  //         var contracts = [];

  //         var invalid = _.filter(cadDetails.layerParcels, function (d) {
  //           return !d.contract;
  //         });
  //         if (invalid.length > 0) {
  //           window.notifySystem("error", t("messages:SAK_REQUIRE"));
  //           return reject();
  //         }

  //         cadDetails.layerParcels.forEach(function (parcel) {
  //           if (parcel.contract) {
  //             var result = _.sortBy(contracts, (d) => {
  //               return parcel.contract.unique_id;
  //             });
  //             if (!result.length) {
  //               contracts.push(parcel.contract);
  //             }
  //           }
  //         });

  //         cadDetails.contracts = contracts;

  //         return resolve(props.formValues);
  //       },
  //       (response) => {
  //         return reject();
  //       }
  //     );
  //   });
  // },
  sections: {
    msa7yData: {
      label: "اعتماد الوضع المقترح",
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
          field: "submitCADSuggestedData", // دي لازم تبقا  submitCADSuggestedData
          hideLabel: true,
        },
      },
    },
  },
};
