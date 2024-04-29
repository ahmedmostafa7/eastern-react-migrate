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
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getMapGraphics,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
export default {
  label: "المخططات المقترحة",
  preSubmit(values, currentStep, props) {
    var map = getMap();
    const {
      mainObject,
      t,
      currentModule: {
        record: { CurrentStep },
      },
    } = props;
    return new Promise(function (resolve, reject) {
      if (CurrentStep && [2317, 3095].indexOf(CurrentStep.id) != -1) {
        if (
          values?.planDetails?.uplodedFeatures?.[
            values?.planDetails?.selectedCADIndex
          ]?.shapeFeatures?.landbase ||
          []
            .filter((d) => {
              return !d.isHide;
            })
            .find((d) => {
              return !d.frontLength;
            })
        ) {
          window.notifySystem("error", "من فضلك قم بإدخال طول الواجهة للأراضي");
          return reject();
        }
      }
      if (CurrentStep && [2322, 3099].indexOf(CurrentStep.id) != -1) {
        // if (mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.length > 0) {
        //     clearGraphicFromLayer(map, "PacrelUnNamedGraphicLayer");
        // }
        // mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.forEach(function (polygon, key) {
        //     addParcelNo(polygon.position, map, "" + polygon.parcelName + "", "PacrelUnNamedGraphicLayer", 30, [0, 0, 0], -10);
        // });
        if (map) {
          if (
            !(props?.formValues?.plansData || values?.plansData)?.mapviewer
              ?.mapGraphics?.length
          ) {
            (
              props?.formValues?.plansData || values?.plansData
            ).mapviewer.mapGraphics = (map && getMapGraphics(map)) || [];
          }
          function printResult(result) {
            const {
              landData: {
                landData: {
                  lands: { parcelData },
                },
              },
            } = mainObject;
            parcelData.plans_approved_Image = result.value;
            return resolve(props.formValues);
          }

          mapSreenShot(map, printResult, () => {}, false, "plans");
        } else {
          return resolve(values);
        }
      } else {
        return resolve(props.formValues);
      }
    });
  },
  sections: {
    plansData: {
      label: "المخططات المقترحة",
      className: "radio_det",
      fields: {
        mapviewer: {
          label: "الخريطة",
          moduleName: "mapviewer",
          field: "msa7yData",
          zoomfactor: 25,
          activeHeight: false,

          cad: {},
          baseMapUrl: window.planMapEditing + "MapServer",
          enableDownloadCad: true,
          hideLabel: true,
          ...basicMapOperations,
        },
        planDetails: {
          label: "",
          moduleName: "mapviewer",
          field: "plansData",
          isInViewMode: false,
          forAddingPlans: false,
          hideLabel: true,
        },
      },
    },
  },
};
