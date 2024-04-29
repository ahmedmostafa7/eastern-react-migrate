import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import axios from "axios";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign, isEmpty } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import { selectionMapOperations } from "main_helpers/variables/mapOperations";

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
  convertToEnglish,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
export default {
  label: "بيانات الأرض",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      var mapObj = getMap();
      values.requestType =
        values.landData.lands.selectedRequestType || values.requestType;
      const { t } = props;
      var parcelSymbols = [
        "س1",
        "س1-أ - سكني",
        "س1-ب - سكني",
        "س2",
        "س1-أ",
        "س1-أ/ص",
        "س1-ب",
        "س1-ب/ص",
        "س2-أ",
        "س2-أ/ص",
        "س2-ب",
        "س2-ب/ص",
        "س3-أ",
        "س3-أ/ص",
        "س3-ب",
        "س3-ب/ص",
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
      /// identfiy_parcel.selectedParcels[0].attributes.SUBDIVISION_TYPE
      var isparcel = true;
      if (values.landData && values.landData.lands.parcels) {
        values.landData.area = 0;
        var parcel = values.landData.lands.parcels[0];
        if (parcel) {
          values.landData.req_type = "";
          values.landData.sub_type =
            values.landData.lands.selectedRequestType || values.requestType;
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
          values.landData.submissionType =
            values.requestType == 1
              ? "فرز"
              : values.requestType == 2
              ? "دمج"
              : "تقسيم";
        }

        var invalid = false;
        values.landData.lands.parcels.forEach(function (val, key) {
          if (val.attributes.PARCEL_AREA) {
            values.landData.area += parseFloat(
              convertToEnglish(val.attributes.PARCEL_AREA)
            );
          } else {
            invalid = true;
          }
        });

        if (invalid) {
          window.notifySystem("error", t("messages:ParcelArea"));
          return reject();
        }

        let checkIsSuggestInvestInvalid = false;
        values.landData.lands.parcels.forEach(function (val, key) {
          if (!val.attributes.SITE_ACTIVITY) {
            checkIsSuggestInvestInvalid = true;
          }
        });

        if (checkIsSuggestInvestInvalid) {
          window.notifySystem("error", "من فضلك قم باختيار النشاط المقترح");
          return reject();
        }

        // if (
        //   !window.Supporting ||
        //   (window.Supporting && !window.Supporting.OverArea)
        // ) {
        //   if (
        //     values.landData.lands.parcels.length == 1 &&
        //     values.landData.area >= 10000
        //   ) {
        //     window.notifySystem("error", t("messages:allowedArea"));
        //     return reject();
        //   }
        // }
      }

      var errorInParcelData = true;
      var invalid = false;
      /*if (values.landData.lands.parcels) {
        values.landData.lands.parcels.forEach(function (elem) {
          elem.valid = false;
          if (isparcel && !invalid) {
            if (parcelSymbols.indexOf(elem.attributes.USING_SYMBOL) == -1) {
              // elem.attributes.USING_SYMBOL_Code ||
              invalid = true;
            } else {
              elem.valid = true;
            }
          }
          // else {
          //   elem.valid = true;
          // }
          if (
            !elem.attributes.PARCEL_AREA ||
            !elem.attributes.USING_SYMBOL ||
            !elem.valid
          ) {
            errorInParcelData = false;
            return;
          }
        });

        if (
          !window.Supporting ||
          (window.Supporting && !window.Supporting.UsingSymbol)
        ) {
          if (invalid) {
            window.notifySystem("error", t("messages:USINGSYMBOLCHECKERS"));
            return reject();
          }

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
      }*/

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
      className: "radio_det",
      fields: {
        lands: {
          moduleName: "lands",
          label: "بيانات الأرض",
          field: "IdentifyInvest",
          className: "land_data",
          zoomfactor: 25,
          activeHeight: false,
          is_parcel_type: true,
          isView: false,
          cad: {},
          hideLabel: true,
          baseMapUrl: window.investMapUrl,
          enableDownloadCad: false,
          //...extraMapOperations,
          ...selectionMapOperations,
        },
      },
    },
  },
};
