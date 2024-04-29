import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign, filter, isEmpty } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import { withTranslation } from "react-i18next";
import {
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArray,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getFileName,
  formatPythonObject,
  localizeNumber,
  getMapGraphics,
  selectMainObject,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
import { getMap } from "main_helpers/functions/filters/state";
import { checkAppMainLayers } from "app/helpers/errors";
export default {
  label: "بيانات الرفع المساحي",
  preSubmit(values, currentStep, props) {
    const { t, mainObject } = props;
    return new Promise(function (resolve, reject) {
      var mapObj = getMap();

      var valid = true;
      var valid_Letters = true;
      var validParcelsNames = true;
      var requirParcelsNames = false;
      var cuttesAreaValid = true;
      var areaTextValid = true;
      var elecRoomAreaValid = true;
      const {
        landData: { landData },
      } = selectMainObject(props);

      if (
        (props?.formValues?.msa7yData || values?.msa7yData).cadDetails
          ?.suggestionsParcels.length > 0
      ) {
        (
          props?.formValues?.msa7yData || values?.msa7yData
        ).cadDetails?.suggestionsParcels.forEach(function (ele, key) {
          let noOfMissedSides = 0;
          if (valid && !ele.isFullBoundry) {
            noOfMissedSides += (!ele?.data?.[0]?.data?.length && 1) || 0;
            noOfMissedSides += (!ele?.data?.[1]?.data?.length && 1) || 0;
            noOfMissedSides += (!ele?.data?.[3]?.data?.length && 1) || 0;
            noOfMissedSides += (!ele?.data?.[4]?.data?.length && 1) || 0;
            if (
              props?.mainObject?.waseka?.waseka?.sakType != "4" &&
              noOfMissedSides > 1
            ) {
              valid = false;
            }
          }
        });

        let isFullBoundryExists = (
          props?.formValues?.msa7yData || values?.msa7yData
        ).cadDetails.suggestionsParcels.find(function (d) {
          return d.polygon && d.polygon.isFullBoundry;
        });
        if (
          isFullBoundryExists &&
          +isFullBoundryExists?.area?.toFixed(2) !=
            +(
              props?.formValues?.msa7yData || values?.msa7yData
            ).cadDetails.suggestionsParcels
              .filter(function (d) {
                return d.polygon && !d.polygon.isFullBoundry;
              })
              .reduce((a, b) => {
                a += +b?.area || 0;
                return a;
              }, 0)
              ?.toFixed(2)
        ) {
          valid = false;
        }

        if (valid) {
          (
            props?.formValues?.msa7yData || values?.msa7yData
          ).cadDetails.suggestionsParcels
            .filter(function (d) {
              return d.polygon && d.polygon.isFullBoundry;
            })
            .forEach(function (ele, key) {
              if (
                !ele.east_Desc ||
                !ele.west_Desc ||
                !ele.north_Desc ||
                !ele.south_Desc
              ) {
                valid = false;
                return;
              }
              // if (
              //   !ele.north_length_text ||
              //   !ele.south_length_text ||
              //   !ele.east_length_text ||
              //   !ele.west_length_text
              // ) {
              //   valid_Letters = false;
              //   return;
              // }
            });

          (
            props?.formValues?.msa7yData || values?.msa7yData
          ).cadDetails.suggestionsParcels
            .filter(function (d) {
              return d.polygon && !d.polygon.isFullBoundry;
            })
            .forEach(function (ele, key) {
              // if (!ele.area_text) {
              //   areaTextValid = false;
              //   return;
              // }

              if (
                !ele.east_Desc ||
                !ele.west_Desc ||
                !ele.north_Desc ||
                !ele.south_Desc
              ) {
                valid = false;
                return;
              }
              // if (
              //   !ele.north_length_text ||
              //   !ele.south_length_text ||
              //   !ele.east_length_text ||
              //   !ele.west_length_text
              // ) {
              //   valid_Letters = false;
              //   return;
              // }
              if (ele.parcel_name && ele.parcel_name.indexOf("أرض رقم") == -1) {
                if (
                  objectPropFreqsInArray(
                    (props?.formValues?.msa7yData || values?.msa7yData)
                      .cadDetails?.suggestionsParcels,
                    "parcel_name",
                    ele.parcel_name
                  )
                ) {
                  validParcelsNames = false;
                  return;
                }
              }
              if (
                (!ele.parcel_name ||
                  (ele.parcel_name &&
                    ele.parcel_name.indexOf("أرض رقم") != -1)) &&
                !ele.isFullBoundry
              ) {
                requirParcelsNames = true;
              }
            });
        }
        if (requirParcelsNames) {
          window.notifySystem(
            "error",
            t("messages:REQUIRNAMESUGGESTIONVALIDATIONMSG")
          );
        }

        if (!valid) {
          window.notifySystem(
            "error",
            t("messages:WRONGSUGGESTIONVALIDATIONMSG")
          );
          //return reject();
        }

        if (!valid_Letters) {
          window.notifySystem(
            "error",
            t("messages:WRONGSUGGESTIONVALIDATIONWITHLETTERSMSG")
          );
          //return reject();
        }

        if (!validParcelsNames) {
          window.notifySystem(
            "error",
            t("messages:WRONGNAMESUGGESTIONVALIDATIONMSG")
          );
          //return reject();
        }

        if (!cuttesAreaValid) {
          window.notifySystem(
            "error",
            t("messages:MUSTDEFBETWEENAREAANDCUTTS")
          );
          //return reject();
        }

        if (!areaTextValid) {
          window.notifySystem(
            "error",
            t("messages:MUSTENTERELECTRICROOMAREATEXT")
          );
          //return reject();
        }

        if (!elecRoomAreaValid) {
          window.notifySystem("error", t("messages:MUSTENTERELECTRICROOMAREA"));
          //return reject();
        }

        if (
          !valid ||
          !valid_Letters ||
          !validParcelsNames ||
          !cuttesAreaValid ||
          !areaTextValid ||
          !elecRoomAreaValid ||
          requirParcelsNames
        ) {
          return reject();
        }
      } else {
        // if (
        //   landData?.lands?.parcels.length == 1 &&
        //   ["4"].indexOf(mainObject?.waseka?.waseka?.sakType) != -1
        // ) {
        //   window.notifySystem(
        //     "error",
        //     t("messages:WRONGSUGGESTIONVALIDATIONMSG")
        //   );
        //   window.notifySystem(
        //     "error",
        //     t("messages:WRONGNAMESUGGESTIONVALIDATIONMSG")
        //   );
        //   window.notifySystem("error", t("requirNameSuggest"));
        //   if (req_type) {
        //     window.notifySystem("error", t("messages:validTypeSuggest"));
        //   }
        // } else if (
        //   (landData?.lands?.parcels.length > 1 &&
        //     ["4"].indexOf(mainObject?.waseka?.waseka?.sakType) != -1) ||
        //   ["1", "2", "3"].indexOf(mainObject?.waseka?.waseka?.sakType) != -1
        // ) {
        //   window.notifySystem("error", t("messages:CADREQUIRED"));
        // }
        return reject();
      }
      // if (
      //   ["2", "3", "4"].indexOf(mainObject?.waseka?.waseka?.sakType) > -1 ||
      //   ((props?.formValues?.msa7yData || values?.msa7yData).cadDetails
      //     ?.suggestionsParcels &&
      //     (
      //       props?.formValues?.msa7yData || values?.msa7yData
      //     ).cadDetails.suggestionsParcels.filter(function (d) {
      //       return d.polygon && !d.polygon.isFullBoundry;
      //     }).length == landData?.lands?.parcels.length)
      // ) {
      //   if (
      //     ["2", "3", "4"].indexOf(mainObject?.waseka?.waseka?.sakType) == -1
      //   ) {
      //     var valid_names;
      //     for (var i = 0; i < landData?.lands?.parcels.length; i++) {
      //       landData.lands.parcels[i].attributes.PARCEL_PLAN_NO =
      //         landData?.lands?.parcels[i].attributes.PARCEL_PLAN_NO.trim();
      //       var sug_prcl = filter(
      //         (props?.formValues?.msa7yData || values?.msa7yData).cadDetails
      //           ?.suggestionsParcels,
      //         (d) => {
      //           return (
      //             localizeNumber(
      //               landData?.lands?.parcels[i].attributes.PARCEL_PLAN_NO.split(
      //                 "/"
      //               )
      //                 .map((r) => r.trim())
      //                 .join("/")
      //                 .trim()
      //             ) ==
      //             localizeNumber(
      //               d.parcel_name
      //                 .split("/")
      //                 .map((r) => r.trim())
      //                 .join("/")
      //                 .trim()
      //             )
      //           );
      //         }
      //       )[0];
      //       if (sug_prcl && mainObject?.waseka?.waseka?.sakType != "2") {
      //         valid_names = true;
      //       } else {
      //         console.log(" this Parcel must be founded");
      //         valid_names = false;
      //         break;
      //       }
      //     }

      //     if (!valid_names && mainObject?.waseka?.waseka?.sakType != "2") {
      //       window.notifySystem("error", t("messages:PARCEL_UNIQUE_ALREADY"));
      //       return reject();
      //     }
      //   } else {
      //     switch (props?.mainObject?.waseka?.waseka?.sakType) {
      //       case "2":
      //         if (
      //           !(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
      //             ?.suggestionsParcels ||
      //           ((props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
      //             ?.suggestionsParcels &&
      //             (props?.formValues?.msa7yData || values?.msa7yData)
      //               ?.cadDetails?.suggestionsParcels.length > 1)
      //         ) {
      //           window.notifySystem(
      //             "error",
      //             t("cadData:mapview.parcels.DamgNotify")
      //           );
      //           return reject();
      //         }
      //         break;
      //       case "3":
      //       case "4":
      //         break;
      //     }
      //   }
      // } else {
      //   console.log("Length of suggestion must equel length of identfiy");
      //   window.notifySystem("error", t("messages:NOT_EQUAL_PARCEL_NUMBER"));
      //   return reject();
      // }

      if (
        (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails.temp
          ?.cadResults?.data[0]?.cadFeatures?.length
      ) {
        if (mapObj) {
          if (values?.msa7yData?.mapviewer) {
            values.msa7yData.mapviewer.mapGraphics =
              (mapObj && getMapGraphics(mapObj)) || [];
          }
          // if (
          //   (props?.formValues?.msa7yData || values?.msa7yData).cadDetails
          //     ?.suggestionsParcels.length > 0
          // ) {
          //   clearGraphicFromLayer(mapObj, "PacrelUnNamedGraphicLayer");
          // }

          // (
          //   props?.formValues?.msa7yData || values?.msa7yData
          // ).cadDetails.suggestionsParcels.forEach(function (polygon, key) {
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

          function printResult(result) {
            (
              props?.formValues?.msa7yData || values?.msa7yData
            ).cadDetails.suggestionsParcels[0].approved_Image = result.value;
            //parcelData.approved_Image = result.value;3
            return resolve(props.formValues || values);
          }
          mapSreenShot(mapObj, printResult, () => {}, false, "data_msa7y");
        } else {
          return resolve(values);
        }
      } else {
        return resolve(props.formValues || values);
      }
    });
  },
  sections: {
    msa7yData: {
      label: "الرفع المساحي",
      className: "radio_det",
      fields: {
        // image_uploader: {
        //   label: "ملف الرفع المساحي",
        //   field: "simpleUploader",
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   fileType: ".DWG",
        //   multiple: false,
        //   // permission: {
        //   //   hide_if_props_equal: {
        //   //     key: "mainObject.waseka.waseka.sakType",
        //   //     value: "4",
        //   //   },
        //   // },
        //   preRequest: (props) => {
        //     var parcels = landData?.lands?.parcels;
        //     return new Promise(function (resolve, reject) {
        //       var layerId = {};
        //       getInfo().then((res) => {
        //         layerId = res;
        //         var isGuid = false;
        //         var settings = {
        //           url: window.mapUrl + "/" + layerId.Landbase_Parcel,
        //           returnGeometry: true,
        //           outFields: ["*"],
        //           callbackResult: (response) => {
        //             if (response.features.length == parcels.length || isGuid) {
        //               // response.features = response.features.map((feature) => {
        //               //   return {
        //               //     ...feature,
        //               //     attributes: formatPythonObject(feature.attributes),
        //               //   };
        //               // });
        //               resolve(response);
        //             } else {
        //               reject();
        //             }
        //           },
        //           callbackError: (response) => {
        //             reject();
        //           },
        //         };

        //         var queryConditions = [];

        //         parcels.forEach(function (elem) {
        //           queryConditions.push(
        //             "PARCEL_SPATIAL_ID  = " + elem.attributes.PARCEL_SPATIAL_ID
        //           );
        //           if (typeof elem.attributes.PARCEL_SPATIAL_ID == "string") {
        //             if (elem.attributes.PARCEL_SPATIAL_ID.indexOf("-") > -1)
        //               isGuid = true;
        //           }
        //         });
        //         settings.where = queryConditions.join(" or ");

        //         if (isGuid || parcels.length == 0)
        //           settings.where = "PARCEL_SPATIAL_ID = -1";

        //         queryTask(settings);
        //       });
        //     });
        //   },
        //   postRequest: (uploadedUrl, props, preRequestResults) => {
        //     store.dispatch({ type: "Show_Loading_new", loading: true });
        //     const { t } = props;
        //     if (uploadedUrl) {
        //       //var featuresJson = formatPythonObject(preRequestResults);
        //       var objects = formatPythonObject(
        //         landData?.lands?.parcels
        //       );
        //       uploadGISFile(
        //         `${window.restServicesPath}/GeoData_DataMsa7y/GPServer/GeoData_DataMsa7y`,
        //         {
        //           CAD_File_Name: uploadedUrl,
        //           parcels:
        //             (preRequestResults?.features?.length &&
        //               JSON.stringify(objects)) ||
        //             "",
        //         },
        //         (data) => {
        //           if (
        //             props.mainObject.waseka.waseka.sakType == "2" &&
        //             data?.value?.data &&
        //             data?.value?.data[0]?.shapeFeatures.length > 1
        //           ) {
        //             window.notifySystem(
        //               "error",
        //               t("cadData:mapview.parcels.DamgNotify")
        //             );
        //             props.input.onChange("");
        //             props.change("msa7yData.cadDetails", {
        //               cadData: null,
        //               isKrokyUpdateContract: false,
        //               isUpdateContract: false,
        //               isPlan: false,
        //               notify: true,
        //               hideDrag: false,
        //               justInvoked: true,
        //               isEdit: false,
        //             });
        //             store.dispatch({
        //               type: "Show_Loading_new",
        //               loading: false,
        //             });
        //             return;
        //           }

        //           if (checkAppMainLayers(props, data.value.data[0])) {
        //             props.change("msa7yData.mapviewer", {
        //               ...props.values.mapviewer,
        //               mapGraphics: [],
        //             });
        //             props.change("msa7yData.cadDetails", {
        //               cadData: data.value,
        //               isKrokyUpdateContract: false,
        //               isUpdateContract: true,
        //               isPlan: false,
        //               notify: true,
        //               hideDrag: false,
        //               justInvoked: true,
        //               isEdit: false,
        //             });
        //           }
        //           store.dispatch({ type: "Show_Loading_new", loading: false });
        //         }
        //       );
        //     } else {
        //       props.change("msa7yData.cadDetails", {
        //         cadData: null,
        //         isKrokyUpdateContract: false,
        //         isUpdateContract: false,
        //         isPlan: false,
        //         notify: true,
        //         hideDrag: false,
        //         justInvoked: true,
        //         isEdit: false,
        //       });
        //       store.dispatch({ type: "Show_Loading_new", loading: false });
        //     }
        //   },
        //   permissions: {
        //     check_props_values: [
        //       {
        //         key: "mainObject.waseka.waseka.sakType",
        //         value: ["1", "2", "3"],
        //         equals: true,
        //       },
        //     ],
        //   },
        // },
        mapviewer: {
          label: "طبقات الخريطة",
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,
          cad: {},
          init_data: (props) => {
            let mainObject = selectMainObject(props);

            if (
              props.input.value ||
              mainObject?.data_msa7y?.msa7yData?.mapviewer
            ) {
              props.input.onChange(
                props.input.value || mainObject.data_msa7y.msa7yData.mapviewer
              );
            }
          },
          baseMapUrl: window.mapUrl,
          enableDownloadCad: false,
          hideLabel: true,
          fullMapWidth: true,
          isStatlliteMap: false,
          isGeographic: true,
          // maxScale:1146.0062689242377,
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
              // {
              //   placeholder: "من فضلك ادخل طول الحد الشمالي بالأحرف",
              //   name: "north_length_text",
              //   type: "text",
              // },
            ],
            east: [
              {
                placeholder: "من فضلك ادخل وصف الحد الشرقي",
                name: "east_Desc",
              },
              // {
              //   placeholder: "من فضلك ادخل طول الحد الشرقي بالأحرف",
              //   name: "east_length_text",
              //   type: "text",
              // },
            ],
            west: [
              {
                placeholder: "من فضلك ادخل وصف الحد الغربي",
                name: "west_Desc",
              },
              // {
              //   placeholder: "من فضلك ادخل طول الحد الغربي بالأحرف",
              //   name: "west_length_text",
              //   type: "text",
              // },
            ],
            south: [
              {
                placeholder: "من فضلك ادخل وصف الحد الجنوبي",
                name: "south_Desc",
              },
              // {
              //   placeholder: "من فضلك ادخل طول الحد الجنوبي بالأحرف",
              //   name: "south_length_text",
              //   type: "text",
              // },
            ],
          },
        },
      },
    },
  },
};
