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
  objectPropFreqsInArrayForKroki,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getFileName,
  formatPythonObject,
  getMapGraphics,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
import { checkAppMainLayers } from "app/helpers/errors";

export default {
  label: "بيانات الرفع المساحي",
  preSubmit(values, currentStep, props) {
    const { t } = props;
    return new Promise(function (resolve, reject) {
      var mapObj = getMap();
      var valid = true;
      var validParcelsNames = true;
      var requirParcelsNames = true;
      const {
        mainObject: {
          landData: {
            landData: {
              area,
              lands: { survay_for_update_contract, parcels, parcelData },
              municipality_id,
            },
          },
        },
      } = props;
      if (
        (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
          ?.suggestionsParcels?.length
      ) {
        // let noOfMissedSides = (
        //   props?.formValues?.msa7yData || values?.msa7yData
        // ).cadDetails.suggestionsParcels.filter(function (ele, key) {
        //   return (
        //     !ele.data[0].data.length ||
        //     !ele.data[1].data.length ||
        //     !ele.data[3].data.length ||
        //     !ele.data[4].data.length
        //   );
        // }).length;

        // if (noOfMissedSides > 1) {
        //   valid = false;
        // }

        (
          props?.formValues?.msa7yData || values?.msa7yData
        ).cadDetails?.suggestionsParcels.forEach(function (ele, key) {
          let noOfMissedSides = 0;
          if (valid) {
            noOfMissedSides += (!ele?.data?.[0]?.data?.length && 1) || 0;
            noOfMissedSides += (!ele?.data?.[1]?.data?.length && 1) || 0;
            noOfMissedSides += (!ele?.data?.[3]?.data?.length && 1) || 0;
            noOfMissedSides += (!ele?.data?.[4]?.data?.length && 1) || 0;
            if (
              //props?.mainObject?.waseka?.waseka?.sakType != "4" &&
              noOfMissedSides > 1
            ) {
              valid = false;
            }
          }
        });

        if (valid) {
          (
            props?.formValues?.msa7yData || values?.msa7yData
          ).cadDetails.suggestionsParcels.forEach(function (ele, key) {
            if (
              !ele.north_Desc ||
              !ele.east_Desc ||
              !ele.west_Desc ||
              !ele.south_Desc
            ) {
              valid = false;
              return;
            }
            if (ele.parcel_name) {
              if (
                objectPropFreqsInArrayForKroki(
                  (props?.formValues?.msa7yData || values?.msa7yData)
                    ?.cadDetails?.suggestionsParcels,
                  "parcel_name",
                  ele.parcel_name
                )
              ) {
                validParcelsNames = false;
                return;
              }
            }
            //if (!ele.parcelName) {
            //    requirParcelsNames = false;
            //}
          });
        }
      } else {
        window.notifySystem("error", t("messages:CADREQUIRED"));
        return reject();
      }

      if (!valid) {
        window.notifySystem(
          "error",
          t("messages:WRONGSUGGESTIONVALIDATIONMSG")
        );
        return reject();
      }
      if (!validParcelsNames) {
        window.notifySystem(
          "error",
          t("messages:WRONGNAMESUGGESTIONVALIDATIONMSG")
        );
        return reject();
      }

      if (!survay_for_update_contract) {
        var sug_area = _(
          (
            props?.formValues?.msa7yData || values?.msa7yData
          ).cadDetails.suggestionsParcels.filter((p) => {
            return p.parcel_name != "حدود المعاملة";
          })
        ).reduce(function (memo, val) {
          return +memo + +val.area;
        }, 0);
        // if (+area != +(+sug_area).toFixed(2)) {
        //   //var area_orgn = +(parcelData.area);
        //   var area_plus = +area + 2;
        //   var area_muns = +area - 2;

        //   if (
        //     +(+sug_area).toFixed(2) >= area_muns &&
        //     +(+sug_area).toFixed(2) <= area_plus
        //   ) {
        //   } else {
        //     window.notifySystem("error", t("cadData:MSGFOREQUALTYOFAREAS"));
        //     return reject();
        //   }
        // }

        (
          props?.formValues?.msa7yData || values?.msa7yData
        ).cadDetails.cuttes_area = 0;
        if (
          (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
            ?.survayParcelCutter.length
        ) {
          if (
            (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.survayParcelCutter[0].NORTH_EAST_DIRECTION
          ) {
            (
              props?.formValues?.msa7yData || values?.msa7yData
            ).cadDetails.cuttes_area += +(
              props?.formValues?.msa7yData || values?.msa7yData
            )?.cadDetails?.survayParcelCutter[0]?.NORTH_EAST_DIRECTION;
          }
          if (
            (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.survayParcelCutter[0]?.NORTH_WEST_DIRECTION
          ) {
            (
              props?.formValues?.msa7yData || values?.msa7yData
            ).cadDetails.cuttes_area += +(
              props?.formValues?.msa7yData || values?.msa7yData
            )?.cadDetails?.survayParcelCutter[0]?.NORTH_WEST_DIRECTION;
          }
          if (
            (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.survayParcelCutter[0]?.SOUTH_EAST_DIRECTION
          ) {
            (
              props?.formValues?.msa7yData || values?.msa7yData
            ).cadDetails.cuttes_area += +(
              props?.formValues?.msa7yData || values?.msa7yData
            )?.cadDetails?.survayParcelCutter[0]?.SOUTH_EAST_DIRECTION;
          }
          if (
            (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.survayParcelCutter[0].SOUTH_WEST_DIRECTION
          ) {
            (
              props?.formValues?.msa7yData || values?.msa7yData
            ).cadDetails.cuttes_area += +(
              props?.formValues?.msa7yData || values?.msa7yData
            )?.cadDetails?.survayParcelCutter[0]?.SOUTH_WEST_DIRECTION;
          }
        }
        if (
          (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails?.temp
            ?.have_electric_room &&
          (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails?.temp
            ?.electric_room_area
        ) {
          (
            props?.formValues?.msa7yData || values?.msa7yData
          ).cadDetails.cuttes_area += +(
            props?.formValues?.msa7yData || values?.msa7yData
          )?.cadDetails?.temp?.electric_room_area;
        }

        if (
          (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
            ?.cuttes_area >= sug_area
        ) {
          window.notifySystem(
            "error",
            t("messages:MUSTDEFBETWEENAREAANDCUTTS")
          );
          return reject();
        }

        if (
          +(
            +sug_area.toFixed(2) -
            (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.cuttes_area
          ).toFixed(2) != +area.toFixed(2)
        ) {
          window.notifySystem("error", t("cadData:MSGFOREQUALTYOFAREAS"));
          return reject();
        }

        if (parcelData) {
          var sug_0_tot_plus =
            +(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.suggestionsParcels[0]?.data[0]?.totalLength + 0.05;
          var sug_0_tot_muns =
            +(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.suggestionsParcels[0]?.data[0]?.totalLength - 0.05;

          var sug_4_tot_plus =
            +(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.suggestionsParcels[0]?.data[4]?.totalLength + 0.05;
          var sug_4_tot_muns =
            +(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.suggestionsParcels[0]?.data[4]?.totalLength - 0.05;

          var sug_1_tot_plus =
            +(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.suggestionsParcels[0]?.data[1]?.totalLength + 0.05;
          var sug_1_tot_muns =
            +(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.suggestionsParcels[0]?.data[1]?.totalLength - 0.05;

          var sug_3_tot_plus =
            +(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.suggestionsParcels[0]?.data[3]?.totalLength + 0.05;
          var sug_3_tot_muns =
            +(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.suggestionsParcels[0]?.data[3]?.totalLength - 0.05;

          if (
            +parcelData.north_length >= +sug_0_tot_muns.toFixed(2) &&
            +parcelData.north_length <= +sug_0_tot_plus.toFixed(2) &&
            +parcelData.west_length >= +sug_3_tot_muns.toFixed(2) &&
            +parcelData.west_length <= +sug_3_tot_plus.toFixed(2) &&
            +parcelData.east_length >= +sug_1_tot_muns.toFixed(2) &&
            +parcelData.east_length <= +sug_1_tot_plus.toFixed(2) &&
            +parcelData.south_length >= +sug_4_tot_muns.toFixed(2) &&
            +parcelData.south_length <= +sug_4_tot_plus.toFixed(2)
          ) {
          } else {
            window.notifySystem("error", t("MSGFOREQUALTYOFAREAS"));
            return reject();
          }
        }
      }

      //
      if (mapObj) {
        (
          props?.formValues?.msa7yData || values?.msa7yData
        ).mapviewer.mapGraphics = (mapObj && getMapGraphics(mapObj)) || [];

        // if (
        //   (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails?.suggestionsParcels
        //     .length > 0
        // ) {
        //   clearGraphicFromLayer(mapObj, "PacrelUnNamedGraphicLayer");
        // }

        // (
        //   props?.formValues?.msa7yData || values?.msa7yData
        // ).cadDetails.suggestionsParcels.forEach(function (
        //   polygon,
        //   key
        // ) {
        //   addParcelNo(
        //     polygon.position,
        //     mapObj,
        //     "" + polygon.parcel_name + "",
        //     "PacrelUnNamedGraphicLayer",
        //     30,
        //     [0, 0, 0],
        //     -10
        //   );
        // });
        //
        function printResult(result) {
          (
            props?.formValues?.msa7yData || values?.msa7yData
          ).cadDetails.suggestionsParcels[0].approved_Image = result.value;
          parcelData.approved_Image = result.value;
          return resolve(props.formValues);
        }
        mapSreenShot(mapObj, printResult, () => {}, false, "data_msa7y");
      } else {
        return resolve(values);
      }
    });
  },
  sections: {
    msa7yData: {
      label: "الرفع المساحي",
      className: "radio_det",
      fields: {
        image_uploader: {
          label: "ملف الرفع المساحي",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".DWG",
          multiple: false,
          //required: true,
          // hideLabel: true,
          preRequest: (props) => {
            var parcels = props.mainObject.landData.landData.lands.parcels;
            return new Promise(function (resolve, reject) {
              var layerId = {};
              getInfo().then((res) => {
                layerId = res;
                var isGuid = false;
                var settings = {
                  url: window.mapUrl + "/" + layerId.Landbase_Parcel,
                  returnGeometry: true,
                  outFields: ["*"],
                  callbackResult: (response) => {
                    if (response.features.length == parcels.length || isGuid) {
                      // response.features = response.features.map((feature) => {
                      //   return {
                      //     ...feature,
                      //     attributes: formatPythonObject(feature.attributes),
                      //   };
                      // });
                      resolve(response);
                    } else {
                      reject();
                    }
                  },
                  callbackError: (response) => {
                    reject();
                  },
                };

                var queryConditions = [];

                parcels.forEach(function (elem) {
                  queryConditions.push(
                    "PARCEL_SPATIAL_ID  = " + elem.attributes.PARCEL_SPATIAL_ID
                  );
                  if (typeof elem.attributes.PARCEL_SPATIAL_ID == "string") {
                    if (elem.attributes.PARCEL_SPATIAL_ID.indexOf("-") > -1)
                      isGuid = true;
                  }
                });
                settings.where = queryConditions.join(" or ");

                if (isGuid || parcels.length == 0)
                  settings.where = "PARCEL_SPATIAL_ID = -1";

                queryTask(settings);
              });
            });
          },
          postRequest: (uploadedUrl, props, preRequestResults) => {
            store.dispatch({ type: "Show_Loading_new", loading: true });

            if (uploadedUrl) {
              //var featuresJson = formatPythonObject(preRequestResults);
              var objects = formatPythonObject(
                props?.mainObject?.landData?.landData?.lands?.parcels
              );

              uploadGISFile(
                `${window.restServicesPath}/GeoData_DataMsa7y/GPServer/GeoData_DataMsa7y`,
                {
                  CAD_File_Name: uploadedUrl,
                  parcels:
                    (preRequestResults?.features?.length &&
                      JSON.stringify(objects)) ||
                    "",
                },
                (data) => {
                  if (checkAppMainLayers(props, data.value.data[0])) {
                    props.change("msa7yData.mapviewer", {
                      ...props.values.mapviewer,
                      mapGraphics: [],
                    });
                    props.change("msa7yData.cadDetails", {
                      cadData: data.value,
                      isKrokyUpdateContract: true,
                      isUpdateContract: false,
                      isPlan: false,
                      notify: true,
                      hideDrag: false,
                      justInvoked: true,
                      isEdit: false,
                    });
                  }
                  store.dispatch({ type: "Show_Loading_new", loading: false });
                }
              );
            } else {
              props.change("msa7yData.cadDetails", {
                cadData: null,
                isKrokyUpdateContract: false,
                isUpdateContract: false,
                isPlan: false,
                notify: true,
                hideDrag: false,
                justInvoked: true,
                isEdit: false,
              });
              store.dispatch({ type: "Show_Loading_new", loading: false });
            }
          },
        },
        mapviewer: {
          label: "طبقات الخريطة",
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,
          cad: {},
          baseMapUrl: window.mapUrl,
          enableDownloadCad: false,
          hideLabel: true,
          fullMapWidth: true,
          ...extraMapOperations,
        },
        cadDetails: {
          label: "تفاصيل الكاد",
          moduleName: "mapviewer",
          field: "cadData",
          isView: false,
          hideLabel: true,
          inputs: {
            north: [
              {
                placeholder: "من فضلك ادخل وصف الحد الشمالي",
                name: "north_Desc",
              },
              {
                placeholder: "من فضلك ادخل عرض الرصيف في هذا الإتجاه",
                name: "plateformWidth_north",
                type: "number",
              },
            ],
            east: [
              {
                placeholder: "من فضلك ادخل وصف الحد الشرقي",
                name: "east_Desc",
              },
              {
                placeholder: "من فضلك ادخل عرض الرصيف في هذا الإتجاه",
                name: "plateformWidth_east",
                type: "number",
              },
            ],
            west: [
              {
                placeholder: "من فضلك ادخل وصف الحد الغربي",
                name: "west_Desc",
              },
              {
                placeholder: "من فضلك ادخل عرض الرصيف في هذا الإتجاه",
                name: "plateformWidth_west",
                type: "number",
              },
            ],
            south: [
              {
                placeholder: "من فضلك ادخل وصف الحد الجنوبي",
                name: "south_Desc",
              },
              {
                placeholder: "من فضلك ادخل عرض الرصيف في هذا الإتجاه",
                name: "plateformWidth_south",
                type: "number",
              },
            ],
          },
        },
      },
    },
  },
};
