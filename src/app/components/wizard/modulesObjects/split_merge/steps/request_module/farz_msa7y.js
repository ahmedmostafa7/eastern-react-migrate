import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign, isEmpty } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import { withTranslation } from "react-i18next";
import {
  redrawNames,
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArray,
  objectPropFreqsInArrayForKroki,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getFileName,
  getPacrelNoAngle,
  formatPythonObjectForFarz,
  convertToArabic,
  localizeNumber,
  getMapGraphics,
  selectMainObject,
  addGraphicToLayer,
  highlightFeature,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
import { checkAppMainLayers } from "app/helpers/errors";
export default {
  label: "الوضع المقترح",
  preSubmit(values, currentStep, props) {
    const { t } = props;

    var mapObj = getMap();
    return new Promise(function (resolve, reject) {
      var valid = true;
      var validParcelsNames = true;
      var requirParcelsNames = true;
      var validDuplixTypes = true;
      var totalnorthlength = 0;
      var totalsouthlength = 0;
      var totaleastlength = 0;
      var totalwestlength = 0;
      let req_type =
        (([34].indexOf(props.currentModule.id) != -1 ||
          [1949, 2048].indexOf(props.currentModule.record.workflow_id) != -1) &&
          "duplix") ||
        "";

      const {
        landData: {
          landData: { area },
        },
      } = selectMainObject(props);

      if (
        (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
          ?.suggestionsParcels &&
        (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
          ?.suggestionsParcels.length
      ) {
        if (req_type) {
          var total_sug_duplix_areas = _(
            (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
              ?.suggestionsParcels
          ).reduce((memo, val) => {
            return +memo + +(+val.area).toFixed(2);
          }, 0);
          if ((+total_sug_duplix_areas).toFixed(2) != area.toFixed(2)) {
            window.notifySystem("error", t("messages:PARCEL_AREA_PROBLEM"));
            return reject();
          } else {
            if (props.mainObject.duplix_checktor) {
              props.mainObject.duplix_checktor.duplix_checktor.one_area_check = false;
            }
          }
        }

        let duplixErrorMessage = "";
        (
          props?.formValues?.msa7yData || values?.msa7yData
        ).cadDetails.suggestionsParcels.forEach(function (ele, key) {
          if (
            !ele.data[0].data.length ||
            !ele.data[1].data.length ||
            ele.data[2].data.length ||
            !ele.data[3].data.length ||
            !ele.data[4].data.length
          ) {
            valid = false;
            return;
          }
          if (
            isEmpty(ele.north_Desc) ||
            isEmpty(ele.east_Desc) ||
            isEmpty(ele.west_Desc) ||
            isEmpty(ele.south_Desc)
          ) {
            valid = false;
            return;
          }
          if (ele.parcel_name) {
            if (
              objectPropFreqsInArrayForKroki(
                (props?.formValues?.msa7yData || values?.msa7yData)?.cadDetails
                  ?.suggestionsParcels,
                "parcel_name",
                ele.parcel_name
              )
            ) {
              validParcelsNames = false;
              return;
            }
          }

          if (!ele.parcel_name) {
            requirParcelsNames = false;
            return;
          }

          if (req_type && (!ele.duplixType || ele.cantSplitedOrMarged)) {
            validDuplixTypes = false;
            duplixErrorMessage = ele.errorMsgForDuplixType;
            return;
          }

          totalnorthlength += +ele.data[0].totalLength;
          totalsouthlength += +ele.data[4].totalLength;
          totaleastlength += +ele.data[1].totalLength;
          totalwestlength += +ele.data[3].totalLength;
        });

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

        if (!requirParcelsNames) {
          window.notifySystem("error", t("messages:requirNameSuggest"));
          return reject();
        }

        if (
          req_type &&
          !validDuplixTypes &&
          (!window.Supporting ||
            (window.Supporting && !window.Supporting.duplixTypeLength))
        ) {
          window.notifySystem(
            "error",
            t(`messages:${duplixErrorMessage || "validTypeSuggest"}`)
          );
          return reject();
        }

        // if (+parcelData.north_length != totalnorthlength || +parcelData.south_length != totalsouthlength || +parcelData.east_length != totaleastlength || +parcelData.west_length != totalwestlength) {
        //   window.notifySystem("error", t("MSGFOREQUALTYOFAREAS"))
        //   return reject()
        // }
      } else {
        window.notifySystem("error", t("cadData:NOTVALIDCAD"));
        window.notifySystem(
          "error",
          t("messages:WRONGSUGGESTIONVALIDATIONMSG")
        );
        window.notifySystem(
          "error",
          t("messages:WRONGNAMESUGGESTIONVALIDATIONMSG")
        );
        window.notifySystem("error", t("requirNameSuggest"));
        if (req_type) {
          window.notifySystem("error", t("messages:validTypeSuggest"));
        }
        return reject();
      }

      // if ((props?.formValues?.msa7yData || values?.msa7yData).cadDetails.suggestionsParcels.length > 0) {
      //   clearGraphicFromLayer(mapObj, "PacrelUnNamedGraphicLayer");
      // }

      if (mapObj) {
        (
          props?.formValues?.msa7yData || values?.msa7yData
        ).mapviewer.mapGraphics = (mapObj && getMapGraphics(mapObj)) || [];
        (
          props?.formValues?.msa7yData || values?.msa7yData
        ).cadDetails.suggestionsParcels.forEach(function (polygon, key) {
          redrawNames(
            polygon,
            mapObj,
            polygon.parcel_name,
            "PacrelUnNamedGraphicLayer",
            key
          );
          // addParcelNo(polygon.position, mapObj, "" + localizeNumber(polygon.parcel_name) + "", "PacrelUnNamedGraphicLayer", 20, [0, 0, 0],
          //   getPacrelNoAngle({
          //     geometry: polygon.polygon
          //   }, true));
        });

        //mainObject.suggestion_parcel.redraw = tempData.redraw;

        function printResult(result) {
          (props?.formValues?.msa7yData || values?.msa7yData).screenshotURL =
            result.value;
          resolve(props.formValues || values);
        }

        mapSreenShot(mapObj, printResult, () => {}, false, "data_msa7y");
      } else {
        return resolve(values);
      }
    });
  },
  sections: {
    msa7yData: {
      label: "الوضع المقترح",
      className: "radio_det",
      fields: {
        image_uploader: {
          label: "ملف الأتوكاد",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".DWG",
          multiple: false,
          // required: true,
          // hideLabel: true,
          preRequest: (props) => {
            const {
              landData: {
                landData: {
                  lands: { parcels },
                },
              },
            } = selectMainObject(props);

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
                      return resolve(true);
                    } else {
                      return reject();
                    }
                  },
                  callbackError: (response) => {
                    return reject();
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
          postRequest: (uploadedUrl, props) => {
            const { t } = props;
            store.dispatch({ type: "Show_Loading_new", loading: true });

            const {
              landData: {
                landData: {
                  lands: { parcels },
                },
              },
            } = selectMainObject(props);

            const {
              mainObject: {
                tadkek_data_Msa7y: {
                  tadkek_msa7yData: { image_uploader, requestType },
                },
              },
            } = props;

            if (uploadedUrl) {
              uploadGISFile(
                `${window.restServicesPath}/GeoData_FarzMsa7y/GPServer/GeoData_FarzMsa7y`,
                {
                  CAD_File_Name: uploadedUrl,
                  requestType: requestType,
                  Tadkek_CAD_Path: image_uploader,
                  //parcels: JSON.stringify(objects),
                },
                (data) => {
                  data.value[0].shapeFeatures.forEach((feature) => {
                    feature.spatialReference = new esri.SpatialReference(32639);
                  });

                  if (
                    requestType == 2 &&
                    data.value[0].shapeFeatures.filter(
                      (r) => r.layer == "boundry"
                    ).length > 1
                  ) {
                    window.notifySystem("error", t("messages:wrongDamge"), 10);
                  } else if (
                    requestType == 1 &&
                    data.value[0].shapeFeatures.filter(
                      (r) => r.layer == "boundry"
                    ).length == 1
                  ) {
                    window.notifySystem("error", t("messages:wrongFarz"), 10);
                  } else {
                    var isNotify =
                      data.value[0].shapeFeatures.filter(
                        (parcel) =>
                          parcel.notify &&
                          parcel.notify.toLowerCase().indexOf("intersect") == -1
                      ).length > 0;

                    if (checkAppMainLayers(props, data.value[0])) {
                      props.change("msa7yData.mapviewer", {
                        ...props.values.mapviewer,
                        mapGraphics: [],
                      });
                      props.change("msa7yData.cadDetails", {
                        cadData: data.value[0],
                        notify: isNotify,
                        hideDrag: isNotify,
                        justInvoked: true,
                      });
                    }
                  }
                  store.dispatch({
                    type: "Show_Loading_new",
                    loading: false,
                  });
                }
              );
            } else {
              props.change("msa7yData.cadDetails", {
                cadData: null,
                notify: false,
                hideDrag: false,
                justInvoked: true,
              });
              store.dispatch({ type: "Show_Loading_new", loading: false });
            }
          },
          //hideLabel: true
        },
        mapviewer: {
          label: "طبقات الخريطة",
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,
          ...extraMapOperations,
          cad: {},
          baseMapUrl: window.mapUrl,
          enableDownloadCad: false,
          hideLabel: true,
          fullMapWidth: true,
        },
        cadDetails: {
          label: "تفاصيل الكاد",
          moduleName: "mapviewer",
          field: "cadSuggestedData", // دي لازم تبقا  submitCADSuggestedData
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
        HEAD: {
          moduleName: "HEAD",
          //required: true,
          label: "عرض الصور في الإستمارة بشكل رأسي",
          field: "boolean",
        },
      },
    },
  },
};
