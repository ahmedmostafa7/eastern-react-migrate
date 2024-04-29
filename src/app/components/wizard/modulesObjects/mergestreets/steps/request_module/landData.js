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
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      var mapObj = getMap();
      values.requestType = 3;
      const { t } = props;
      var duplixSymbols = [
        "س1-أ",
        "س1-أ - سكني",
        "ت-10",
        "ت-10/ص",
        "ت-12",
        "ت-12/ص",
        "ت-15",
        "ت-15/ص",
        "ت-2",
        "ت-2/ص",
        "ت-3",
        "ت-3/ص",
        "ت-5",
        "ت-5/ص",
        "ت1-أ",
        "ت1-أ/ص",
        "ت1-ب",
        "ت1-ب/ص",
        "ت2-أ",
        "ت2-أ/ص",
        "خ ت",
      ];
      var isduplix = false;
      if (values.landData && values.landData.lands.parcels) {
        values.landData.area = 0;
        var parcel = values.landData.lands.parcels[0];
        if (parcel) {
          values.landData.req_type = "";
          values.landData.sub_type = 3;
          values.landData.BLOCK_NO = parcel.attributes.PARCEL_BLOCK_NO;
          values.landData.PLAN_NO = parcel.attributes.PLAN_NO;
          values.landData.BLOCK_SPATIAL_ID = parcel.attributes.BLOCK_SPATIAL_ID;
          values.landData.DIVISION_NO =
            parcel.attributes.SUBDIVISION_DESCRIPTION;
          values.landData.subdivisions = parcel.attributes.SUBDIVISION_TYPE;
          values.landData.MUNICIPALITY_NAME = values.landData.lands.temp.mun;
          values.landData.CITY_NAME = values.landData.lands.temp.city_name;
          values.landData.DISTRICT = "";
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
          // values.landData.submissionType =
          //   values.requestType == 3 ? "تقسيم" : "";
        }

        var invalid = false;
        values.landData.lands.parcels.forEach(function (val, key) {
          if (val.attributes.PARCEL_AREA) {
            values.landData.area += parseFloat(val.attributes.PARCEL_AREA);
          } else {
            invalid = true;
          }
        });

        if (invalid) {
          window.notifySystem("error", t("messages:ParcelArea"));
          return reject();
        }

        if (
          !window.Supporting ||
          (window.Supporting && !window.Supporting.OverArea)
        ) {
          if (
            values.landData.lands.parcels.length == 1 &&
            values.landData.area >= 10000
          ) {
            window.notifySystem("error", t("messages:allowedArea"));
            return reject();
          }
        }
      }

      if (!values.landData) {
        window.notifySystem("error", t("messages:validboundries"));
        return reject();
      }

      var errorInParcelData = true;
      if (values.landData.lands.parcels) {
        values.landData.lands.parcels.forEach(function (elem) {
          //elem.valid = false;
          if (
            !elem.attributes.PARCEL_AREA ||
            !elem.attributes.USING_SYMBOL
            //!elem.valid
          ) {
            errorInParcelData = false;
            return;
          }
        });

        if (
          !window.Supporting ||
          (window.Supporting && !window.Supporting.UsingSymbol)
        ) {
          if (!errorInParcelData) {
            window.notifySystem("error", t("messages:errorInParcelData"));
            return reject();
          }
        }
      } else {
        return reject();
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
      } else {
        return reject();
      }

      if (
        values.landData.lands.parcels &&
        isEmpty(values.landData.lands.parcelData)
      ) {
        window.notifySystem(
          "error",
          t("messages:PARCELDESCRIPTIONANDBOUNDARIES")
        );
        return reject();
      }

      if (
        !(
          values.landData.lands.parcels &&
          values.landData.lands.parcels.length > 1
        )
      ) {
        window.notifySystem("error", "يجب اختيار أرضين على الأقل");
        return reject();
      }

      if (mapObj) {
        values.landData.lands.mapGraphics =
          (mapObj && getMapGraphics(mapObj)) || [];
        // clearGraphicFromLayer(mapObj, "adjacentGraphicLayer");
        // clearGraphicFromLayer(mapObj, "PacrelUnNamedGraphicLayer");
        // clearGraphicFromLayer(mapObj, "addedParclGraphicLayer");

        // highlightFeature(values.landData.lands.parcels, mapObj, {
        //   layerName: "addedParclGraphicLayer",
        //   isZoom: false,
        //   highlighColor: [0, 255, 1],
        // });

        mapSreenShot(
          mapObj,
          (result) => {
            values.landData.lands.screenshotURL = result.value;
            values.landData.previous_Image = result.value;
            resolve(values);
          },
          () => {},
          false,
          "landData"
        );
      } else {
        return resolve(values);
      }
    });
  },
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
          isView: false,
          baseMapUrl: window.mapUrl,
          enableDownloadCad: false,
          ...extraMapOperations,
        },
        SITE_DESC: {
          moduleName: "SITE_DESC",
          required: true,
          label: "وصف موقع النافذ اوالشارع المراد ضمه",
          placeholder: "من فضلك ادخل وصف موقع النافذ اوالشارع المراد ضمه",
          field: "textArea",
        },
        VIOLATION_STATE: {
          moduleName: "VIOLATION_STATE",
          // required: true,
          label: "مخالفات",
          placeholder: "من فضلك ادخل المخالفات",
          field: "textArea",
        },
        CHANGEPARCEL: {
          moduleName: "CHANGEPARCEL",
          //required: true,
          label:
            "وجود اختلاف بين استمارة التطبيق على الطبيعة وصك الملكية عن بيانات الخريطة",
          field: "boolean",
        },
        CHANGEPARCELReason: {
          moduleName: "CHANGEPARCELReason",
          required: true,
          label: "وجه الإختلاف",
          placeholder: "من فضلك ادخل وجه الإختلاف",
          field: "textArea",
          permission: {
            show_match_value: { CHANGEPARCEL: true },
          },
        },
      },
    },
  },
};
