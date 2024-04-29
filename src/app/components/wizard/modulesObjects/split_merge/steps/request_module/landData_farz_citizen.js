import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import axios from "axios";
import { host } from "imports/config";
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
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
export default {
  label: "بيانات الأرض",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      const { t } = props;
      var mapObj = getMap();
      values.requestType = values.landData.lands.selectedRequestType;
      if (values.landData && values.landData.lands.parcels) {
        var parcel = values.landData.lands.parcels[0];
        if (parcel) {
          values.landData.req_type = "";
          values.landData.sub_type = values.landData.lands.selectedRequestType;
          values.landData.BLOCK_NO = parcel.attributes.PARCEL_BLOCK_NO;
          values.landData.PLAN_NO = parcel.attributes.PLAN_NO;
          values.landData.BLOCK_SPATIAL_ID = parcel.attributes.BLOCK_SPATIAL_ID;
          values.landData.DIVISION_NO =
            parcel.attributes.SUBDIVISION_DESCRIPTION;
          values.landData.MUNICIPALITY_NAME = values.landData.lands.temp.mun;
          values.landData.CITY_NAME = values.landData.lands.temp.city_name;
          values.landData.DISTRICT = "";
          values.landData.subdivisions = values.landData.lands.temp.subname;
          // values.landData.municipality =
          //   values.landData.lands.lists.MunicipalityNames?.find((mun, index) => {
          //     return mun.code == values.landData.lands.temp.mun;
          //   });

          // values.landData.municipality = {
          //   ...values.landData.lands.lists.MunicipalityNames?.find(
          //     (mun, index) => {
          //       return mun.code == values.landData.lands.temp.mun;
          //     }
          //   ),
          //   CITY_NAME_A: values.landData.lands.temp.city_name,
          // };

          values.landData.submissionType =
            (values.requestType == 1 && "فرز") ||
            (values.requestType == 2 && "دمج") ||
            (values.requestType == 3 && "تقسيم") ||
            ([2191].indexOf(props.currentModule.record.workflow_id) != -1 &&
              "اصدار الكروكي (المواطن)") ||
            "فرد";
        }
      }

      if (!values.landData) {
        window.notifySystem("error", t("messages:validboundries"));
        return reject();
      }

      var errorInParcelData = true;
      var invalid = false;
      if (values.landData.lands.parcels) {
        values.landData.lands.parcels.forEach(function (elem) {
          if (!elem.attributes.PARCEL_PLAN_NO) {
            errorInParcelData = false;
            return;
          }
        });

        if (!errorInParcelData) {
          window.notifySystem("error", t("messages:errorInParcelData"));
          return reject();
        }
      }

      if (props.record.app_id == 21) values.requestType = 1;

      if (values.landData.lands.parcels && values.requestType) {
        if (
          values.requestType == 2 &&
          values.landData.lands.parcels.length <= 1
        ) {
          window.notifySystem("error", t("messages:validRequestTypes"));
          return reject();
        }
      }

      if (props.record.app_id == 21) {
        if (
          !(
            values.landData.lands.parcels &&
            values.landData.lands.parcels.length > 1
          )
        ) {
          window.notifySystem("error", "يجب اختيار أرضين على الأقل");
          return reject();
        }
      }

      return resolve(values);
    });
  },
  sections: {
    landData: {
      label: "بيانات الأرض",
      className: "radio_det",
      fields: {
        lands: {
          moduleName: "lands",
          label: "بيانات الأرض",
          field: "IdentifyFarz",
          className: "land_data",
          is_parcel_type: true,
          isView: false,
          zoomfactor: 25,
          activeHeight: false,
          parcel_fields_headers: ["رقم الأرض"],
          parcel_fields: [
            { name: "PARCEL_PLAN_NO", editable: false, type: "text" },
          ],
          boundariesBtnIsVisible: false,
          cad: {},
          hideLabel: true,
          baseMapUrl: window.mapUrl,
          enableDownloadCad: false,
          ...extraMapOperations,
        },
      },
    },
  },
};
