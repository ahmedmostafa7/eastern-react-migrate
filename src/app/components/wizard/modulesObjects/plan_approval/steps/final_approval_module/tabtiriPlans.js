import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import applyFilters from "main_helpers/functions/filters";
import { basicMapOperations } from "main_helpers/variables/mapOperations";
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
  getMapGraphics,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
export default {
  label: "المخطط التبتيري",
  preSubmit(values, currentStep, props) {
    return new Promise((resolve, reject) => {
      var mapObj = getMap();
      const {
        mainObject,
        t,
        currentModule: {
          record: { CurrentStep },
        },
      } = props;
      if (mapObj) {
        (
          props?.formValues?.tabtiriPlansData || values?.tabtiriPlansData
        ).mapviewer.mapGraphics = (mapObj && getMapGraphics(mapObj)) || [];

        function printResult(result) {
          const {
            landData: {
              landData: {
                lands: { parcelData },
              },
            },
          } = mainObject;
          parcelData.plans_approved_Image = result.value;
          return resolve(props.formValues || values);
        }

        mapSreenShot(mapObj, printResult, () => {}, false, "plans");
      } else {
        return resolve(props.formValues || values);
      }

      //
    });
  },
  sections: {
    tabtiriPlansData: {
      label: "المخططات التبتيري",
      className: "radio_det",
      fields: {
        image_uploader: {
          label: "ملف المخطط التبتيري",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".DWG",
          multiple: false,
          required: true,
          visible: (val, props) => {
            return (
              [2329, 3117].indexOf(props.currentModule.record.CurrentStep.id) !=
              -1
            );
          },
          preRequest: (props) => {},
          postRequest: (uploadedUrl, props) => {
            if (uploadedUrl) {
              store.dispatch({ type: "Show_Loading_new", loading: true });
              uploadGISFile(
                `${window.restServicesPath}/GeoData_SuggestedPlans/GPServer/GeoData_SuggestedPlans`,
                {
                  CAD_File_Name: uploadedUrl,
                },
                (data) => {
                  props.change("tabtiriPlansData.mapviewer", {
                    ...props.values.mapviewer,
                    mapGraphics: [],
                  });
                  props.change("tabtiriPlansData.planDetails", {
                    perfectCad: data.value,
                    secondCad: null,
                    thirdCad: null,
                    justInvoked: true,
                    hide_details: false,
                  });
                  store.dispatch({ type: "Show_Loading_new", loading: false });
                }
              );
            } else {
              store.dispatch({ type: "Show_Loading_new", loading: true });
              props.change("tabtiriPlansData.planDetails", {
                perfectCad: null,
                secondCad: null,
                thirdCad: null,
                justInvoked: true,
                hide_details: true,
              });
              store.dispatch({ type: "Show_Loading_new", loading: false });
            }
          },
        },
        mapviewer: {
          label: "الخريطة",
          hideLabel: true,
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,

          cad: {},
          baseMapUrl: window.planMapEditing + "MapServer",
          enableDownloadCad: (props) => {
            return (
              [2329, 3117].indexOf(props.currentModule.record.CurrentStep.id) ==
              -1
            );
            //return props.currentModule.record.CurrentStep.id != 2329;
          },
          ...basicMapOperations,
        },
        planDetails: {
          label: "",
          hideLabel: true,
          moduleName: "mapviewer",
          field: "plansData",
          isInViewMode: false,
          forAddingPlans: true,
        },
      },
    },
  },
};
