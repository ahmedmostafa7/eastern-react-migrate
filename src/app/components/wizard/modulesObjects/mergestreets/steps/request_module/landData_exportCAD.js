import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import axios from "axios";
import store from "app/reducers";
import { map, get, assign, isEmpty } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import {
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArray,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getFileName,
  highlightFeature,
  getMapGraphics,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
export default {
  label: "بيانات الأرض",
  sections: {
    landData: {
      label: "بيانات الأرض",
      // className: "radio_det",
      fields: {
        lands: {
          moduleName: "lands",
          label: "بيانات الأرض",
          field: "IdentifyFarz",
          className: "land_data",
          zoomfactor: 25,
          activeHeight: false,
          is_parcel_type: false,
          isView: true,
          baseMapUrl: window.mapUrl,
          enableDownloadCad: false,
          ...extraMapOperations,
        },
        SITE_DESC_METER: {
          moduleName: "SITE_DESC_METER",
          required: true,
          label: " بيانات عرض النافذ اوالممر ( م٢ )",
          placeholder: "من فضلك ادخل بيانات عرض النافذ اوالممر ( م٢ )",
          field: "inputNumber",
          required: true,
          disabled: (values, props) => {
            return [59].indexOf(props.currentModule.id) == -1;
          },
        },
      },
    },
  },
};
