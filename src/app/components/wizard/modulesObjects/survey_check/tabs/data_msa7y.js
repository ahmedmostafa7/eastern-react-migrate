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
} from "../../../../inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
import { checkAppMainLayers } from "app/helpers/errors";
import {
  extraMapOperations,
  surveyOperation,
} from "main_helpers/variables/mapOperations";

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

      const suggParcels = (props?.formValues?.msa7yData || values?.msa7yData)
        ?.cadDetails?.suggestionsParcels;

      if (
        props?.currentModule?.id == 118 &&
        props.currentModule?.record?.app_id == 14
      ) {
        return resolve(values);
      } else {
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
                // if (
                //   objectPropFreqsInArrayForKroki(
                //     (props?.formValues?.msa7yData || values?.msa7yData)
                //       ?.cadDetails?.suggestionsParcels,
                //     "parcel_name",
                //     ele.parcel_name
                //   )
                // ) {
                //   validParcelsNames = false;
                //   return;
                // }
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

        if (true /*!survay_for_update_contract*/) {
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

          let lands = props.mainObject.landData.landData.lands;
          let isValidParcelArea = true;

          lands.parcels.forEach((parcel) => {
            var sugMatchParcel = (
              props?.formValues?.msa7yData || values?.msa7yData
            )?.cadDetails?.suggestionsParcels.find(
              (x) =>
                x.parcel_name == parcel.attributes["PARCEL_PLAN_NO"] &&
                +x.area.toFixed(2) ==
                  (+parcel.attributes["PARCEL_AREA"]).toFixed(2)
            );

            let cuttes_area = 0;

            if (
              parcel.parcelShatfa &&
              parcel.parcelShatfa.isSubtractArea &&
              props.mainObject.landData.landData.lands.selectedMoamlaType == 2
            ) {
              if (parcel.parcelShatfa.SHATFA_NORTH_EAST_DIRECTION) {
                cuttes_area += +parcel.parcelShatfa.SHATFA_NORTH_EAST_DIRECTION;
              }
              if (parcel.parcelShatfa.SHATFA_NORTH_WEST_DIRECTION) {
                cuttes_area += +parcel.parcelShatfa.SHATFA_NORTH_WEST_DIRECTION;
              }
              if (parcel.parcelShatfa.SHATFA_SOUTH_EAST_DIRECTION) {
                cuttes_area += +parcel.parcelShatfa.SHATFA_SOUTH_EAST_DIRECTION;
              }
              if (parcel.parcelShatfa.SHATFA_SOUTH_WEST_DIRECTION) {
                cuttes_area += +parcel.parcelShatfa.SHATFA_SOUTH_WEST_DIRECTION;
              }
            }
            if (
              parcel.parcelElectric &&
              parcel.parcelElectric.isSubtractArea &&
              props.mainObject.landData.landData.lands.selectedMoamlaType == 2
            ) {
              cuttes_area += +parcel.parcelElectric.electric_room_area;
            }

            if (sugMatchParcel) {
              if (
                (+sugMatchParcel.area).toFixed(2) !=
                (
                  +parcel.attributes["PARCEL_AREA"] - cuttes_area.toFixed(2)
                ).toFixed(2)
              ) {
                isValidParcelArea = false;
              }
            } else {
              isValidParcelArea = false;
            }
          });

          if (!isValidParcelArea) {
            window.notifySystem(
              "error",
              "يجب ان تكون مساحة الأرض من الصك مساوية لمساحة الأرض من الرفع المساحى"
            );
            return reject();
          }

          /*let survayParcelCutter = props.mainObject.landData.landData.lands.survayParcelCutter;
  
          if (survayParcelCutter && survayParcelCutter.length) {
            if (survayParcelCutter[0].SHATFA_NORTH_EAST_DIRECTION) {
              (props?.formValues?.msa7yData || values?.msa7yData).cadDetails.cuttes_area +=
                +survayParcelCutter[0]?.SHATFA_NORTH_EAST_DIRECTION;
            }
            if (survayParcelCutter[0].SHATFA_NORTH_WEST_DIRECTION) {
              (props?.formValues?.msa7yData || values?.msa7yData).cadDetails.cuttes_area +=
                +survayParcelCutter[0]?.SHATFA_NORTH_WEST_DIRECTION;
            }
            if (survayParcelCutter[0].SHATFA_SOUTH_EAST_DIRECTION) {
              (props?.formValues?.msa7yData || values?.msa7yData).cadDetails.cuttes_area +=
                +survayParcelCutter[0]?.SHATFA_SOUTH_EAST_DIRECTION;
            }
            if (survayParcelCutter[0].SHATFA_SOUTH_WEST_DIRECTION) {
              (props?.formValues?.msa7yData || values?.msa7yData).cadDetails.cuttes_area +=
                +survayParcelCutter[0]?.SHATFA_SOUTH_WEST_DIRECTION;
            }
          }
  */

          if (
            lands.parcels.length !=
            (
              props?.formValues?.msa7yData || values?.msa7yData
            )?.cadDetails?.suggestionsParcels.filter((x) => !x.isFullBoundry)
              .length
          ) {
            window.notifySystem("error", t("MSGFOREQUALTYOFAREAS"));
            return reject();
          }

          /*if (lands.have_electric_room && lands.electric_room_area) {
            (props?.formValues?.msa7yData || values?.msa7yData).cadDetails.cuttes_area += +lands.electric_room_area;
          }*/

          /*
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
          */

          /*if (
            +(
              +sug_area.toFixed(2)
            ).toFixed(2) != +area.toFixed(2) -
            (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.cuttes_area
          ) {
            window.notifySystem("error", "يجب ان تكون مساحة الأرض من الصك مساوية لمساحة الأرض من الرفع المساحى");
            return reject();
          }*/

          /*
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
          }*/

          let isValidArea = true;
          let isMatchParcel = true;
          //loop on parcels and compare each details
          if (lands.parcels.length) {
            lands.parcels.forEach((parcel) => {
              if (parcel.parcelData) {
                var sugMatchParcel = (
                  props?.formValues?.msa7yData || values?.msa7yData
                )?.cadDetails?.suggestionsParcels.find(
                  (x) =>
                    x.parcel_name == parcel.attributes["PARCEL_PLAN_NO"] &&
                    +x.area.toFixed(2) ==
                      (+parcel.attributes["PARCEL_AREA"]).toFixed(2)
                );

                if (!sugMatchParcel) {
                  isMatchParcel = false;
                } else if (
                  sugMatchParcel &&
                  !(
                    parcel.parcelShatfa?.SHATFA_NORTH_EAST_DIRECTION ||
                    parcel.parcelShatfa?.SHATFA_NORTH_WEST_DIRECTION ||
                    parcel.parcelShatfa?.SHATFA_SOUTH_EAST_DIRECTION ||
                    parcel.parcelShatfa?.SHATFA_SOUTH_WEST_DIRECTION
                  )
                ) {
                  var sug_0_tot_plus =
                    +sugMatchParcel.data[0]?.totalLength + 0.05;
                  var sug_0_tot_muns =
                    +sugMatchParcel.data[0]?.totalLength - 0.05;
                  var sug_4_tot_plus =
                    +sugMatchParcel.data[4]?.totalLength + 0.05;
                  var sug_4_tot_muns =
                    +sugMatchParcel.data[4]?.totalLength - 0.05;
                  var sug_1_tot_plus =
                    +sugMatchParcel.data[1]?.totalLength + 0.05;
                  var sug_1_tot_muns =
                    +sugMatchParcel.data[1]?.totalLength - 0.05;
                  var sug_3_tot_plus =
                    +sugMatchParcel.data[3]?.totalLength + 0.05;
                  var sug_3_tot_muns =
                    +sugMatchParcel.data[3]?.totalLength - 0.05;

                  if (
                    +parcel.parcelData.north_length >=
                      +sug_0_tot_muns.toFixed(2) &&
                    +parcel.parcelData.north_length <=
                      +sug_0_tot_plus.toFixed(2) &&
                    +parcel.parcelData.west_length >=
                      +sug_3_tot_muns.toFixed(2) &&
                    +parcel.parcelData.west_length <=
                      +sug_3_tot_plus.toFixed(2) &&
                    +parcel.parcelData.east_length >=
                      +sug_1_tot_muns.toFixed(2) &&
                    +parcel.parcelData.east_length <=
                      +sug_1_tot_plus.toFixed(2) &&
                    +parcel.parcelData.south_length >=
                      +sug_4_tot_muns.toFixed(2) &&
                    +parcel.parcelData.south_length <=
                      +sug_4_tot_plus.toFixed(2)
                  ) {
                  } else {
                    isValidArea = false;
                  }
                }
              }
            });

            if (lands?.parcels[0]?.attributes?.isTadkeekBefore) {
              lands.parcelData = {
                fromTadkeekBefore: true,
                east_desc: suggParcels[0]?.east_Desc,
                south_desc: suggParcels[0]?.south_Desc,
                west_desc: suggParcels[0]?.west_Desc,
                north_desc: suggParcels[0]?.north_Desc,
                east_length: suggParcels[0]?.data[1].totalLength,
                south_length: suggParcels[0]?.data[4].totalLength,
                west_length: suggParcels[0]?.data[3].totalLength,
                north_length: suggParcels[0]?.data[0].totalLength,
              };

              lands?.parcels.forEach((parcel, index) => {
                parcel.parcelData = {
                  east_desc: suggParcels[index]?.east_Desc,
                  south_desc: suggParcels[index]?.south_Desc,
                  west_desc: suggParcels[index]?.west_Desc,
                  north_desc: suggParcels[index]?.north_Desc,
                  east_length: suggParcels[index]?.data[1].totalLength,
                  south_length: suggParcels[index]?.data[4].totalLength,
                  west_length: suggParcels[index]?.data[3].totalLength,
                  north_length: suggParcels[index]?.data[0].totalLength,
                };
              });
            }

            if (!isMatchParcel) {
              window.notifySystem("error", "من فضلك قم باختيار الأرض");
              return reject();
            }
            if (!isValidArea) {
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
          if (props?.currentModule?.id == 114) {
            mapSreenShot(
              mapObj,
              printResult,
              () => {},
              false,
              "data_msa7y",
              true
            );
          } else {
            return resolve(values);
          }
        } else {
          return resolve(values);
        }
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

                    // data.value.data[0].shapeFeatures?.forEach((shape) => {
                    //   shape.rings = shape.rings.map((ring) =>
                    //     ring.map((point) => [point[0], point[1]])
                    //   );

                    //   delete shape.hasM;
                    //   delete shape.hasZ;
                    // });
                    //
                    props.change("msa7yData.cadDetails", {
                      cadData: data.value,
                      isKrokyUpdateContract: false,
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
          permission: {
            show_if_app_id_equal: { key: "currentModule.id", value: 114 },
          },
          visible: (val, props) => {
            return !props?.mainObject?.landData?.landData?.lands?.parcels[0]
              ?.attributes?.isTadkeekBefore;
          },
        },
        mapviewer: {
          label: "طبقات الخريطة",
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,
          enableDownloadCad: true,
          enableSwipeLayer: true,
          cad: {},
          baseMapUrl: window.tadketMesahyMapUrl,
          isStatlliteMap: true,
          maxScale: 1146.0062689242377,
          hideLabel: true,
          fullMapWidth: true,
          init_after_mapLoaded: (props) => {
            if (
              props?.mainObject?.landData?.landData?.lands?.parcels[0]
                ?.attributes?.isTadkeekBefore
            ) {
              var data = JSON.parse(
                '{"value":{"data":[{"hiddenOfSakBoundries":[],"shapeFeatures":[],"outOfSakBoundries":[],"isArc":false,"details":[],"cadFeatures":[],"annotations":[]}]}}'
              );

              data.value.data[0].cadFeatures =
                props.mainObject.landData.landData.lands.parcels.map(
                  (p) => p.geometry.rings[0]
                );
              data.value.data[0].shapeFeatures =
                props.mainObject.landData.landData.lands.parcels.map((p) => {
                  p.geometry.area = +p.attributes["PARCEL_AREA"];
                  return p.geometry;
                });

              if (checkAppMainLayers(props, data.value.data[0])) {
                /*props.change("msa7yData.mapviewer", {
                  ...props.values.mapviewer,
                  mapGraphics: [],
                });*/
                props.change("msa7yData.cadDetails", {
                  cadData: data.value,
                  isKrokyUpdateContract: false,
                  isUpdateContract: false,
                  isPlan: false,
                  notify: true,
                  hideDrag: false,
                  justInvoked: true,
                  isEdit: false,
                });
              }
            }
          },
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
            ],
            east: [
              {
                placeholder: "من فضلك ادخل وصف الحد الشرقي",
                name: "east_Desc",
              },
            ],
            west: [
              {
                placeholder: "من فضلك ادخل وصف الحد الغربي",
                name: "west_Desc",
              },
            ],
            south: [
              {
                placeholder: "من فضلك ادخل وصف الحد الجنوبي",
                name: "south_Desc",
              },
            ],
          },
        },
      },
    },
  },
};
