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
      resolve(values);
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
          permission: {
            show_if_app_id_equal: { key: "currentModule.id", value: 104 },
          },
        },
        mapviewer: {
          label: "طبقات الخريطة",
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,
          enableSwipeLayer: true,
          baseMapUrl: window.propetryCheckMapUrl,
          isStatlliteMap: true,
          maxScale: 1146.0062689242377,
          cad: {},
          enableDownloadCad: true,
          hideLabel: true,
          fullMapWidth: true,
          ...extraMapOperations,
        },
        cadDetails: {
          label: "تفاصيل الكاد",
          moduleName: "mapviewer",
          isDisabled: true,
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
        confirm_revision: {
          field: "boolean",
          label: "تم التاكد من صحة البيانات حسب الصك",
          required: true,
          permission: {
            show_if_app_id_equal: { key: "currentModule.id", value: 134 },
          },
        },
      },
    },
  },
};
