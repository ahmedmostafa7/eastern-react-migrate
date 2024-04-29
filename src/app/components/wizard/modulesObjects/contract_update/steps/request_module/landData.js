import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import { extraMapOperations } from "main_helpers/variables/mapOperations";
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
export default {
  label: "بيانات الكروكي",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      var mapObj = getMap();
      const { t } = props;
      values.requestType = 3;
      // var field = wizerd.sections[0].fields[1];

      var parcelSymbols = [
        "س1",
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
      ];
      var duplixSymbols = ["س1-أ"];
      if (props.currentModuleName == "split_empty_request") {
        var isparcel = true;
        //window.notifySystem('error', t('PARCEL_SYMBOL_ERROR'));
      } else if (props.currentModuleName == "split_duplixs_request") {
        var isduplix = true;
        //window.notifySystem('error', t('DUPLIX_SYMBOL_ERROR'));
      }
      if (values.landData) {
        values.landData.area = 0;
        var parcel = values.landData.lands.parcels[0];
        if (parcel) {
          values.landData.sub_type = values.landData.lands.temp.subtype;
          if (props.record.workflows) {
            values.landData.krokySubject = props.record.workflows.name;
          }
          values.landData.sub_type_name = values.landData.lands.temp.subname;
          values.landData.BLOCK_NO = parcel.attributes.PARCEL_BLOCK_NO;
          values.landData.PLAN_NO = parcel.attributes.PLAN_NO;
          values.landData.BLOCK_SPATIAL_ID = parcel.attributes.BLOCK_SPATIAL_ID;
          values.landData.DIVISION_NO =
            parcel.attributes.SUBDIVISION_DESCRIPTION;
          values.landData.MUNICIPALITY_NAME =
            parcel.attributes.MUNICIPALITY_NAME;

          values.landData.PARCEL_AREA_UNIT_NAME = values.landData
            .survay_for_update_contract
            ? parcel.attributes.PARCEL_AREA_UNIT_NAME
            : "";

          values.landData.isSurvay = true;
          values.landData.DISTRICT = "";
          values.landData.subdivisions = values.landData.lands.temp.subname;
        }
        //////
        values.landData.parcel_desc = "";
        values.landData.lands.parcels.forEach(function (val, key) {
          if (val.attributes.PARCEL_AREA) {
            values.landData.GIS_PARCEL_AREA += +val.attributes["SHAPE.AREA"];
            values.landData.area += parseFloat(
              convertToEnglish(val.attributes.PARCEL_AREA)
            );
            values.landData.parcel_desc += values.landData.parcel_desc
              ? ", " + val.attributes.PARCEL_PLAN_NO
              : val.attributes.PARCEL_PLAN_NO;
          }
        });
      }

      if (
        values.landData &&
        !values.landData.submissionType &&
        props.record.workflows
      ) {
        values.landData.submissionType = props.record.workflows.name;
      }

      values.landData.municipality = {
        name: parcel.attributes.MUNICIPALITY_NAME,
      };

      if (!values) {
        return reject();
      }

      var errorInParcelData = true;
      var invalid1 = false;
      var invalid2 = false;
      var invalid3 = false;
      var invalid4 = false;
      if (values.landData.lands.parcels) {
        values.landData.lands.parcels.forEach(function (elem) {
          if (
            !elem.parcelData ||
            (elem.parcelData && Object.keys(elem.parcelData).length == 0)
          ) {
            invalid4 = true;
            return;
          }

          if (isparcel) {
            if (
              parcelSymbols.indexOf(elem.attributes.USING_SYMBOL_CODE) == -1
            ) {
              invalid1 = true;
              return;
            }
          }

          if (isduplix) {
            if (
              duplixSymbols.indexOf(elem.attributes.USING_SYMBOL_CODE) == -1
            ) {
              invalid2 = true;
              return;
            }
          }

          if (!elem.attributes.PARCEL_AREA || !elem.attributes.USING_SYMBOL) {
            invalid3 = true;
            return;
          }
        });

        if (invalid4) {
          window.notifySystem("error", t("KROKYDETAILSVALIDATION"));
          return reject();
        }
        if (invalid1) {
          window.notifySystem("error", t("PARCEL_SYMBOL_ERROR"));
          return reject();
        }

        if (invalid2) {
          window.notifySystem("error", t("DUPLIX_SYMBOL_ERROR"));
          return reject();
        }

        if (invalid3) {
          window.notifySystem("error", t("PARCELDETAILS"));
          return reject();
        }
      } else {
        return reject();
      }

      if (values.landData.lands.parcels && values.requestType) {
        if (
          values.requestType == 2 &&
          values.landData.lands.parcels.length <= 1
        ) {
          window.notifySystem("error", t("VALIDREQUEST")); // VALIDREQUEST
          return reject();
        }
      } else {
        return reject();
      }
      //////

      if (true) {
        // values.landData.lands.lists.subDivType.forEach(function (subdivision) {
        //   if (
        //     subdivision.code ==
        //     values.landData.lands.parcels[0].attributes.SUBDIVISION_TYPE
        //   ) {
        //     values.landData.lands.parcels[0].attributes.SUBDIVISION_TYPE =
        //       subdivision.name;
        //     return;
        //   }
        // });
        if (mapObj) {
          values.landData.lands.mapGraphics =
            (mapObj && getMapGraphics(mapObj)) || [];
          clearGraphicFromLayer(mapObj, "adjacentGraphicLayer");
          highlightFeature(
            values.landData.lands.parcels,
            mapObj,
            { layerName: "addedParclGraphicLayer" },
            false,
            [0, 0, 255, 1],
            [0, 0, 255, 1],
            true
          );

          function printResult(result) {
            values.screenshotURL = result.value;
            values.landData.previous_Image = result.value;
            values.landData.image_uploader = result.value;
            resolve(values);
          }

          mapSreenShot(mapObj, printResult, () => {}, false, "landData");
        } else {
          return resolve(values);
        }
      }
    });
  },
  sections: {
    landData: {
      label: "بيانات الكروكي",
      className: "radio_det",
      fields: {
        lands: {
          moduleName: "lands",
          label: "بيانات الأرض",
          field: "UpdateContractIdentify",
          className: "land_data",
          zoomfactor: 25,
          activeHeight: false,
          operations: [],
          cad: {},
          baseMapUrl: window.mapUrl,
          enableDownloadCad: false,
          ...extraMapOperations,
        },
      },
    },
  },
};
