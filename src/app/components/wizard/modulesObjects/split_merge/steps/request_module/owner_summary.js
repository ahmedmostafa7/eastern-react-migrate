import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { plan_approval_fields } from "./reqFields";
import { get, omit } from "lodash";
import applyFilters from "main_helpers/functions/filters";
import landData_farz_simple from "./landData_farz_simple";
import farz_msa7y from "./farz_msa7y";
import landData_farz_no_gis from "./landData_farz_no_gis";
import sugLandData_farz_no_gis from "./suggestedParcels_no_gis";

import landData_farz_simple_duplix from "./landData_farz_simple_duplix";
import sugLandData_farz_duplex_no_gis from "./suggestedParcels_duplex_no_gis";
import landData_farz_duplex_no_gis from "./landData_farz_duplex_no_gis";

export default {
  label: "الملخص",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      var obj = props.wizardSettings.steps;
      const { setMainObjectNoPath, removeMainObject, mainObject } = props;
      // var temp = JSON.parse(JSON.stringify(mainObject));
      // removeMainObject();

      if (values?.owner_summary?.submissionType) {
        if (
          props.mainObject.owner_summary &&
          values.owner_summary.submissionType !=
            props.mainObject.owner_summary.owner_summary.submissionType
        ) {
          delete mainObject["landData"];
          delete mainObject["data_msa7y"];
          delete mainObject["sugLandData"];
          delete mainObject["waseka"];
        }
        delete props.wizardSettings.steps.landData;
        delete props.wizardSettings.steps.data_msa7y;
        delete props.wizardSettings.steps.sugLandData;

        var index = props.steps.indexOf("landData");
        if (index !== -1) {
          props.steps.splice(index, 1);
        }
        index = props.steps.indexOf("data_msa7y");
        if (index !== -1) {
          props.steps.splice(index, 1);
        }

        index = props.steps.indexOf("sugLandData");
        if (index !== -1) {
          props.steps.splice(index, 1);
        }

        if (+values.owner_summary.submissionType == 1) {
          obj["landData"] = { ...landData_farz_simple };
          obj["data_msa7y"] = { ...farz_msa7y };
          if (props.steps.indexOf("landData") == -1) {
            props.steps.splice(1, 0, "landData");
          }
          if (props.steps.indexOf("data_msa7y") == -1) {
            props.steps.splice(3, 0, "data_msa7y");
          }
        } else {
          obj["landData"] = { ...landData_farz_no_gis };
          obj["sugLandData"] = { ...sugLandData_farz_no_gis };
          if (props.steps.indexOf("landData") == -1) {
            props.steps.splice(1, 0, "landData");
          }
          if (props.steps.indexOf("sugLandData") == -1) {
            props.steps.splice(3, 0, "sugLandData");
          }
        }
      }

      if (values?.owner_summary?.submissionType_duplix) {
        if (
          props.mainObject.owner_summary &&
          (([1, 3].indexOf(+values.owner_summary.submissionType_duplix) != -1 &&
            [2, 4].indexOf(
              +props.mainObject.owner_summary.owner_summary
                .submissionType_duplix
            ) != -1) ||
            ([2, 4].indexOf(+values.owner_summary.submissionType_duplix) !=
              -1 &&
              [1, 3].indexOf(
                +props.mainObject.owner_summary.owner_summary
                  .submissionType_duplix
              ) != -1))
        ) {
          delete mainObject["landData"];
          delete mainObject["data_msa7y"];
          delete mainObject["sugLandData"];
          delete mainObject["waseka"];
        }
        delete props.wizardSettings.steps.landData;
        delete props.wizardSettings.steps.data_msa7y;
        delete props.wizardSettings.steps.sugLandData;

        var index = props.steps.indexOf("landData");
        if (index !== -1) {
          props.steps.splice(index, 1);
        }
        index = props.steps.indexOf("data_msa7y");
        if (index !== -1) {
          props.steps.splice(index, 1);
        }

        index = props.steps.indexOf("sugLandData");
        if (index !== -1) {
          props.steps.splice(index, 1);
        }

        if (
          +values.owner_summary.submissionType_duplix == 1 ||
          +values.owner_summary.submissionType_duplix == 3
        ) {
          obj["landData"] = { ...landData_farz_simple_duplix };
          obj["data_msa7y"] = { ...farz_msa7y };
          if (props.steps.indexOf("landData") == -1) {
            props.steps.splice(1, 0, "landData");
          }
          if (props.steps.indexOf("data_msa7y") == -1) {
            props.steps.splice(4, 0, "data_msa7y");
          }
        } else {
          obj["landData"] = { ...landData_farz_duplex_no_gis };
          obj["sugLandData"] = { ...sugLandData_farz_duplex_no_gis };
          if (props.steps.indexOf("landData") == -1) {
            props.steps.splice(1, 0, "landData");
          }
          if (props.steps.indexOf("sugLandData") == -1) {
            props.steps.splice(4, 0, "sugLandData");
          }
        }
      }
      props.wizardSettings.steps = obj;
      setMainObjectNoPath(omit(mainObject, ["allNotes", "workflow_id"]));
      return resolve(values);
    });
  },
  sections: {
    owner_summary: {
      className: "owner_summary_des",
      type: "inputs",
      label: "نوع المعاملة",
      fields: {
        submissionType: {
          field: "radio",
          init: (scope) => {
            var parcels = get(
              scope.props.mainObject,
              "landData.landData.lands.parcels",
              []
            );
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });

            if (!values.owner_summary) {
              scope.props.input.onChange(parcels.length > 0 ? "1" : "2");
            } else {
              scope.props.input.onChange(values.owner_summary.submissionType);
            }
          },
          required: true,
          hideLabel: true,
          permission: {
            show_if_props_equal: { key: "currentModule.id", value: 23 },
          },
          disabled: (val, props) => {
            return Boolean(
              get(
                props.mainObject,
                "landData.landData.lands.parcels.length",
                false
              )
            );
          },
          options: {
            gis: {
              label: "بالبيانات الجغرافية",
              value: "1",
            },
            no_gis: {
              label: "بالبيانات الوصفية",
              value: "2",
            },
          },
        },

        submissionType_duplix: {
          field: "radio",
          init: (scope) => {
            var parcels = get(
              scope.props.mainObject,
              "landData.landData.lands.parcels",
              []
            );

            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });

            if (!values.owner_summary) {
              scope.props.input.onChange(parcels.length > 0 ? "1" : "2");
            } else {
              scope.props.input.onChange(
                values.owner_summary.submissionType_duplix
              );
            }
          },
          required: true,
          hideLabel: true,
          permission: {
            show_if_props_equal: { key: "currentModule.id", value: 34 },
          },
          options: {
            dublix_gis: {
              label: "دوبلكسات بالبيانات الجغرافية",
              value: "1",
              disabled: (val, props) => {
                return [1, 3].indexOf(+val) != -1 || !val
                  ? false
                  : Boolean(
                      get(
                        props.mainObject,
                        "landData.landData.lands.parcels.length",
                        false
                      )
                    );
              },
            },
            dublix_no_gis: {
              label: "دوبلكسات بالبيانات الوصفية",
              value: "2",
              disabled: (val, props) => {
                return [2, 4].indexOf(+val) != -1 || !val
                  ? false
                  : Boolean(
                      get(
                        props.mainObject,
                        "landData.landData.lands.parcels.length",
                        false
                      )
                    );
              },
            },
            parcel_dublix_gis: {
              label: "أراضي دوبلكسية بالبيانات الجغرافية",
              value: "3",
              disabled: (val, props) => {
                return [1, 3].indexOf(+val) != -1 || !val
                  ? false
                  : Boolean(
                      get(
                        props.mainObject,
                        "landData.landData.lands.parcels.length",
                        false
                      )
                    );
              },
            },
            parcel_dublix_no_gis: {
              label: "أراضي دوبلكسية بالبيانات الوصفية",
              value: "4",
              disabled: (val, props) => {
                return [2, 4].indexOf(+val) != -1 || !val
                  ? false
                  : Boolean(
                      get(
                        props.mainObject,
                        "landData.landData.lands.parcels.length",
                        false
                      )
                    );
              },
            },
          },
        },
      },
    },
    summery: {
      label: "Summary",
      type: "wizardSummery",
    },
  },
};
