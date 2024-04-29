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
  objectPropFreqsInArray,
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
              lands: { parcels, parcelData },
              municipality_id,
            },
          },
        },
      } = props;

      if (
        (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
          .suggestionsParcels?.length
      ) {
        if (
          props.currentModule.id != 108 &&
          ((+parcelData.north_length).toFixed(2) !=
            (+(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.suggestionsParcels[0].data[0].totalLength).toFixed(2) ||
            (+parcelData.east_length).toFixed(2) !=
              (+(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
                ?.suggestionsParcels[0].data[1].totalLength).toFixed(2) ||
            (+parcelData.west_length).toFixed(2) !=
              (+(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
                ?.suggestionsParcels[0].data[3].totalLength).toFixed(2) ||
            (+parcelData.south_length).toFixed(2) !=
              (+(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
                ?.suggestionsParcels[0].data[4].totalLength).toFixed(2)) &&
          (!window.Supporting ||
            (window.Supporting && !window.Supporting.EqualityOfArea))
        ) {
          window.notifySystem("error", t("cadData:MSGFOREQUALTYOFAREAS"));
          return reject();
        }

        var isDescValid = true;
        (
          props?.formValues?.msa7yData || values?.msa7yData
        ).cadDetails.suggestionsParcels.forEach((parcel, index) => {
          Object.keys(
            props.wizardSettings.steps.data_msa7y.sections.msa7yData.fields
              .cadDetails.inputs
          ).forEach((dir) => {
            props.wizardSettings.steps.data_msa7y.sections.msa7yData.fields.cadDetails.inputs[
              dir
            ].forEach((input) => {
              if (
                !(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
                  .temp[input.name + index]
              ) {
                isDescValid = false;
                return;
              }
            });
          });
        });

        if (!isDescValid) {
          window.notifySystem("error", t("cadData:COMPLETEPARCELDESCRIPTION"));
          return reject();
        }

        if (
          ((props?.formValues?.msa7yData || values?.msa7yData).cadDetails.mun &&
            (props?.formValues?.msa7yData || values?.msa7yData).cadDetails.mun
              .code) != municipality_id &&
          municipality_id != props.mainObject.selectedMunFromKroky
        ) {
          window.notifySystem("error", t("cadData:DIFFRENT_MUN_CHOOSE"));
          return reject();
        }

        let noOfMissedSides = (
          props?.formValues?.msa7yData || values?.msa7yData
        ).cadDetails.suggestionsParcels.filter(function (ele, key) {
          return (
            !ele.data[0].data.length ||
            !ele.data[1].data.length ||
            !ele.data[3].data.length ||
            !ele.data[4].data.length
          );
        }).length;

        if (noOfMissedSides > 1) {
          valid = false;
        }

        // (
        //   props?.formValues?.msa7yData || values?.msa7yData
        // ).cadDetails.suggestionsParcels.forEach(function (ele, key) {
        //   ////
        //   if (
        //     // !ele.data[0].data.length ||
        //     // !ele.data[1].data.length ||
        //     // //ele.data[2].data.length ||
        //     // !ele.data[3].data.length ||
        //     // !ele.data[4].data.length
        //     (["0.00", null, undefined].indexOf(ele.data[0].totalLength) == -1 && !ele.data[0].data.length) ||
        //     (["0.00", null, undefined].indexOf(ele.data[1].totalLength) == -1 && !ele.data[1].data.length) ||
        //     //(["0.00", null, undefined].indexOf(ele.data[2].totalLength) != -1 && ele.data[2].data.length) ||
        //     (["0.00", null, undefined].indexOf(ele.data[3].totalLength) == -1 && !ele.data[3].data.length) ||
        //     (["0.00", null, undefined].indexOf(ele.data[4].totalLength) == -1 && !ele.data[4].data.length)
        //   ) {
        //     valid = false;
        //   }
        //   // if (ele.parcel_name) {
        //   //   if (
        //   //     objectPropFreqsInArrayForKroki(
        //   //       (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
        //   //         ?.suggestionsParcels,
        //   //       "parcel_name",
        //   //       ele.parcel_name
        //   //     )
        //   //   ) {
        //   //     validParcelsNames = false;
        //   //   }
        //   // }
        // });

        if (!valid) {
          window.notifySystem(
            "error",
            t("messages:WRONGSUGGESTIONVALIDATIONMSG")
          );
          return reject();
        }
      } else {
        window.notifySystem("error", t("cadData:NOTVALIDCAD"));
        window.notifySystem(
          "error",
          t("messages:WRONGSUGGESTIONVALIDATIONMSG")
        );
        return reject();
      }

      if (
        !(props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
          ?.isWithinUrbanBoundry
      ) {
        // if (mapObj) {
        //   window.notifySystem(
        //     "error",
        //     t("messages:IS_NOT_WITHIN_URBAN_AREA_BOUNDRY")
        //   );
        // }
        return reject();
      }

      (
        props?.formValues?.msa7yData || values?.msa7yData
      ).cadDetails.cuttes_area = 0;
      if (
        (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
          ?.survayParcelCutter?.length
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
          ?.cuttes_area >=
        (props?.formValues?.msa7yData || values?.msa7yData).cadDetails
          .suggestionsParcels[0].area
      ) {
        window.notifySystem("error", t("messages:MUSTDEFBETWEENAREAANDCUTTS"));
        return reject();
      }

      if (
        +(
          +(
            props?.formValues?.msa7yData || values?.msa7yData
          ).cadDetails.suggestionsParcels[0].area.toFixed(2) -
          (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
            ?.cuttes_area
        ).toFixed(2) != +area.toFixed(2) &&
        (!window.Supporting ||
          (window.Supporting && !window.Supporting.EqualityOfArea))
      ) {
        window.notifySystem("error", t("cadData:MSGFOREQUALTYOFAREAS"));
        return reject();
      }

      if (valid) {
        // if ((props?.formValues?.msa7yData || values?.msa7yData).cadDetails.suggestionsParcels.length > 0) {
        //   clearGraphicFromLayer(mapObj, "PacrelUnNamedGraphicLayer");
        // }
        // (props?.formValues?.msa7yData || values?.msa7yData).cadDetails.suggestionsParcels.forEach(function (polygon, key) {
        //   addParcelNo(polygon.position, mapObj, "", "PacrelUnNamedGraphicLayer", 30, [0, 0, 0], -10);
        // });
        if (mapObj) {
          (
            props?.formValues?.msa7yData || values?.msa7yData
          ).mapviewer.mapGraphics = (mapObj && getMapGraphics(mapObj)) || [];
          function printResult(result) {
            (
              props?.formValues?.msa7yData || values?.msa7yData
            ).cadDetails.suggestionsParcels[0].approved_Image = result.value;
            const {
              mainObject: {
                landData: {
                  landData: {
                    lands: { parcelData },
                  },
                },
              },
            } = props;
            parcelData.approved_Image = result.value;
            resolve(props.formValues);
          }
          mapSreenShot(mapObj, printResult, false, "data_msa7y");
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
          required: false,
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
                      isKrokyUpdateContract: false,
                      isUpdateContract: false,
                      isPlan: true,
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
                isPlan: true,
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
