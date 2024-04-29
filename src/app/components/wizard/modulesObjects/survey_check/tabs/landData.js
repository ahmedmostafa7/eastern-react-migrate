import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import { getMap } from "main_helpers/functions/filters/state";
import { basicMapOperations } from "main_helpers/variables/mapOperations";
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
} from "../../../../inputs/fields/identify/Component/common/common_func";
export default {
  label: "بيانات الأرض",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      var mapObj = getMap();
      const { t } = props;

      values.requestType = values.landData.lands.selectedRequestType || 3;
      // var field = wizerd.sections[0].fields[1];
      values.landData = { ...(props.formValues || values).landData };

      values.landData.req_type = values.landData.lands.selected_Req_type;
      var parcelSymbols = [
        "س1",
        "س2",
        "س1-أ",
        "س1-أ - سكني",
        "س1-أ – سكني",
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
      var duplixSymbols = [
        "س1-أ",
        "س1-أ - سكني",
        "س1-أ – سكني",
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
      if (!values.landData.lands.selectedMoamlaType) {
        window.notifySystem("error", "من فضلك قم باختيار الغرض من المعاملة");
        return reject();
      }
      let isparcel;
      let isduplix;
      if (values.landData.lands.selectedMoamlaType == 1) {
        if (values.landData.req_type == undefined) {
          window.notifySystem("error", "من فضلك قم بإختيار نوع الفرز");
          return reject();
        }

        if (values.landData.req_type == "") {
          isparcel = true;
          //window.notifySystem('error', t('PARCEL_SYMBOL_ERROR'));
        } else if (values.landData.req_type == "duplix") {
          isduplix = true;
          //window.notifySystem('error', t('DUPLIX_SYMBOL_ERROR'));
        }
      }

      if (values.landData.lands.selectedMoamlaType == 2) {
        values.landData.req_type = undefined;
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
          values.landData.DIVISION_NO = parcel.attributes.SUBDIVISION_TYPE;

          values.landData.DIVISION_DESCRIPTION =
            parcel.attributes.SUBDIVISION_DESCRIPTION;

          values.landData.PARCEL_AREA_UNIT_NAME = values.landData
            .survay_for_update_contract
            ? parcel.attributes.PARCEL_AREA_UNIT_NAME
            : "";

          /*values.landData.lands.electric_room_area = (props.formValues||values).landData.lands.electric_room_area;
          values.landData.lands.electric_room_place = (props.formValues||values).landData.lands.electric_room_place;
          values.landData.lands.have_electric_room =(props.formValues||values).landData.lands.have_electric_room;
          values.landData.lands.survayParcelCutter = (props.formValues||values).landData.lands.survayParcelCutter;
          */

          values.landData.MUNICIPALITY_NAME = values.landData.lands.temp.mun;
          values.landData.isSurvay = true;
          values.landData.DISTRICT = "";
          values.landData.subdivisions = values.landData.lands.temp.subname;
        }
        //////
        var parcelIsZero = false;
        values.landData.parcel_desc = "";
        values.landData.lands.parcels.forEach(function (val, key) {
          if (val.attributes.PARCEL_AREA && +val.attributes.PARCEL_AREA > 0) {
            values.landData.GIS_PARCEL_AREA += +val.attributes["SHAPE.AREA"];
            values.landData.area += parseFloat(
              convertToEnglish(val.attributes.PARCEL_AREA)
            );
            values.landData.parcel_desc += values.landData.parcel_desc
              ? ", " + val.attributes.PARCEL_PLAN_NO
              : val.attributes.PARCEL_PLAN_NO;
          } else {
            parcelIsZero = true;
          }
        });
      }

      var unitNumber_invalid;
      var invalid = false;
      var errorInParcelData = true;
      //فرز
      if (values.landData.lands.selectedMoamlaType == 1) {
        values.landData.lands.parcels.forEach(function (val, key) {
          val.valid = false;

          if (
            !unitNumber_invalid &&
            [10501, 10506, 10513].indexOf(values.landData.MUNICIPALITY_NAME) !=
              -1
          ) {
            //if (values.landData.lands.parcels.length == 1) {
            if (
              val.attributes.USING_SYMBOL_Code == "س1-أ" &&
              val.attributes.UNITS_NUMBER &&
              (!val.attributes.UNITS_NUMBER_Code ||
                val.attributes.UNITS_NUMBER_Code == 1) &&
              (!window.Supporting ||
                (window.Supporting && !window.Supporting.UNITS_NUMBER))
            ) {
              unitNumber_invalid = 1;
            } else if (
              val.attributes.USING_SYMBOL_Code == "س1-أ" &&
              !val.attributes.UNITS_NUMBER &&
              (!window.Supporting ||
                (window.Supporting && !window.Supporting.UNITS_NUMBER))
            ) {
              unitNumber_invalid = 2;
            } else if (
              !val.attributes.UNITS_NUMBER &&
              (!window.Supporting ||
                (window.Supporting && !window.Supporting.UNITS_NUMBER))
            ) {
              unitNumber_invalid = 2;
            }
            //}
          }

          if (isparcel && !invalid) {
            if (
              parcelSymbols
                .map((arrItem) => arrItem?.replace(/\s/g, "")?.trim())
                .indexOf(
                  val.attributes.USING_SYMBOL?.replace(/\s/g, "")?.trim()
                ) == -1
            ) {
              invalid = true;
            } else {
              val.valid = true;
            }
          }

          if (isduplix && !invalid) {
            if (
              duplixSymbols
                .map((arrItem) => arrItem?.replace(/\s/g, "")?.trim())
                .indexOf(
                  val.attributes.USING_SYMBOL?.replace(/\s/g, "")?.trim()
                ) == -1
            ) {
              invalid = true;
            } else {
              val.valid = true;
            }
          }

          if (
            !val.attributes.PARCEL_AREA ||
            !val.attributes.USING_SYMBOL ||
            !val.valid
          ) {
            errorInParcelData = false;
            return;
          }

          // if (!unitNumber_invalid) {
          //   if (!val.attributes.PARCEL_AREA) {
          //     unitNumber_invalid = 3;
          //   }
          // }
        });

        if (
          !window.Supporting ||
          (window.Supporting && !window.Supporting.UsingSymbol)
          //&& values.landData.lands.parcels.length == 1
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

        if (unitNumber_invalid == 1) {
          window.notifySystem(
            "error",
            "عذرا، لا يمكن تقديم طلب فرز على هذه الأرض ( لان عدد الوحدات يساوي وحدة واحدة بالقطعة )"
          );
          return reject();
        }

        if (unitNumber_invalid == 2) {
          window.notifySystem(
            "error",
            "عذرا، لا يمكن تقديم طلب فرز على هذه الأرض ( لان عدد الوحدات غير متوفر )"
          );
          return reject();
        }

        // if (unitNumber_invalid == 3) {
        //   window.notifySystem("error", t("messages:ParcelArea"));
        //   return reject();
        // }

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

      if (parcelIsZero) {
        window.notifySystem(
          "error",
          "يجب التأكد من ادخال المساحات للأراضي المختارة"
        );
        return reject();
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

      if (
        values.landData.lands.parcels.filter((x) => x.parcelData).length !=
        values.landData.lands.parcels.length
      ) {
        if (!values.landData.lands.parcels[0].attributes.isTadkeekBefore) {
          window.notifySystem("error", "من فضلك أدخل حدود وأبعاد الأرض");
          return reject();
        }
      }

      if (values.landData.lands.parcels.length == 1) {
        values.landData.lands.parcelData = {
          ...values.landData.lands.parcels[0].parcelData,
        };
      }

      /* if (
         !values.landData ||
         Object.keys(values.landData.lands.parcelData).length == 0
       ) {
         window.notifySystem("error", t("KROKYDETAILSVALIDATION"));
         return reject();
       }*/

      // var invalid1 = false;
      // var invalid2 = false;
      // var invalid3 = false;
      // if (values.landData.lands.parcels) {
      //   values.landData.lands.parcels.forEach(function (elem) {
      //     if (isparcel) {
      //       if (
      //         parcelSymbols.indexOf(elem.attributes.USING_SYMBOL_CODE) == -1
      //       ) {
      //         invalid1 = true;
      //         return;
      //       }
      //     }

      //     if (isduplix) {
      //       if (
      //         duplixSymbols.indexOf(elem.attributes.USING_SYMBOL_CODE) == -1
      //       ) {
      //         invalid2 = true;
      //         return;
      //       }
      //     }

      //     if (!elem.attributes.PARCEL_AREA || !elem.attributes.USING_SYMBOL) {
      //       invalid3 = true;
      //       return;
      //     }
      //   });

      //   if (invalid1) {
      //     window.notifySystem("error", t("PARCEL_SYMBOL_ERROR"));
      //     return reject();
      //   }

      //   if (invalid2) {
      //     window.notifySystem("error", t("DUPLIX_SYMBOL_ERROR"));
      //     return reject();
      //   }

      //   if (invalid3) {
      //     window.notifySystem("error", t("PARCELDETAILS"));
      //     return reject();
      //   }
      // } else {
      //   return reject();
      // }

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
        let _layer = mapObj.getLayer("SelectGraphicLayer");
        _layer?.graphics
          ?.filter((r) => !r.attributes.isParcel)
          ?.forEach((graphic) => {
            graphic.setSymbol(null);
          });
        _layer?.refresh();

        values.landData.lands.mapGraphics =
          (mapObj && getMapGraphics(mapObj)) || [];
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
          field: "IdentifySurvey",
          className: "land_data",
          zoomfactor: 25,
          activeHeight: false,
          cad: {},
          baseMapUrl: window.mapUrl,
          enableDownloadCad: false,
          ...basicMapOperations,
        },
      },
    },
  },
};
