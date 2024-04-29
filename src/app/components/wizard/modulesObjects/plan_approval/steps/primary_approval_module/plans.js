import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import applyFilters from "main_helpers/functions/filters";
import { basicMapOperations } from "main_helpers/variables/mapOperations";
import { withTranslation } from "react-i18next";
import {
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArray,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
export default {
  label: "المخططات المقترحة",
  sections: {
    plansData: {
      label: "المخططات المقترحة",
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
          forAddingPlans: false,
          hideLabel: true,
        },
      },
    },
  },
};
