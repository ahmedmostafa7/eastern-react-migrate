import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import applyFilters from "main_helpers/functions/filters";
import { withTranslation } from "react-i18next";
import { basicMapOperations } from "main_helpers/variables/mapOperations";
import {
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArray,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getMapGraphics,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
export default {
  label: "المخطط التبتيري",
  preSubmit(values, currentStep, props) {
    return new Promise((resolve, reject) => {
      let streetInvalid = true;
      (
        props?.formValues?.tabtiriPlansData || values?.tabtiriPlansData
      ).planDetails?.streets?.forEach((street) => {
        if (!street.streetname) {
          streetInvalid = false;
        }
      });

      if (!streetInvalid) {
        window.notifySystem("error", "يجب ادخال الاسم لجميع الأراضي", 5);
        return reject();
      }

      var mapObj = getMap();
      if (mapObj) {
        (
          props?.formValues?.tabtiriPlansData || values?.tabtiriPlansData
        ).mapviewer.mapGraphics = (mapObj && getMapGraphics(mapObj)) || [];
      }

      return resolve(props.formValues || values);
    });
  },
  sections: {
    tabtiriPlansData: {
      label: "المخططات التبتيري",
      className: "radio_det",
      fields: {
        mapviewer: {
          label: "الخريطة",
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,

          cad: {},
          baseMapUrl: window.planMapEditing + "MapServer",
          enableDownloadCad: true,
          hideLabel: true,
          ...basicMapOperations,
        },
        planDetails: {
          label: "",
          moduleName: "mapviewer",
          field: "plansData",
          isInViewMode: false,
          hideLabel: true,
          forAddingPlans: false,
        },
      },
    },
  },
};
