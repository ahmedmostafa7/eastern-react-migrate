import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign, isEmpty } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import { localizeNumber } from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
export default {
  label: "التقرير الفني",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      const { t, mainObject } = props;
      let duplixTypeValid = false;
      let LessThen2Handred = false;
      if (
        !window.Supporting ||
        (window.Supporting && !window.Supporting.duplixTypeLength)
      ) {
        if (
          values.duplix_checktor.split_duplixs ||
          values.duplix_checktor.merged_duplixs
        ) {
          if (
            !(
              values.duplix_checktor.split_duplixs &&
              values.duplix_checktor.merged_duplixs
            )
          ) {
            duplixTypeValid = true;
          }
        } else {
          window.notifySystem("error", t("messages:DUPLIX_MERGE_SPLITE"));
          return reject();
        }
      } else {
        duplixTypeValid = true;
      }

      if (
        mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
          ?.length
      ) {
        let invalid = false;
        mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.forEach(
          function (val, key) {
            if (+val.area < 200) {
              invalid = true;
            }
          }
        );

        if (invalid) {
          if (window.Supporting && window.Supporting.LessThen2Handred) {
            LessThen2Handred = true;
          } else {
            window.notifySystem(
              "error",
              `يجب أن تكون مساحات الأراضي لا تقل عن ${localizeNumber(200)} متر`
            );
            return reject();
          }
        } else {
          LessThen2Handred = true;
        }
      }
      // [0].attributes.AREA
      if (
        mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels?.length
      ) {
        let invalid = false;
        mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels?.forEach(
          function (val, key) {
            if (+val.attributes.AREA < 200) {
              invalid = true;
            }
          }
        );

        if (invalid) {
          if (window.Supporting && window.Supporting.LessThen2Handred) {
            LessThen2Handred = true;
          } else {
            window.notifySystem(
              "error",
              `يجب أن تكون مساحات الأراضي لا تقل عن ${localizeNumber(200)} متر`
            );
            return reject();
          }
        } else {
          LessThen2Handred = true;
        }
      }

      if (LessThen2Handred && duplixTypeValid) return resolve(values);
    });
  },
  sections: {
    duplix_checktor: {
      label: "التقرير الفني",
      // className: "radio_det",
      fields: {
        street_length_check: {
          label: "لا يقل عرض الشارع عن ١٢ متر",
          field: "boolean",
          required: true,
        },
        one_area_check: {
          label: "لا تقل مساحة القطعة الواحدة بعد التجزئة عن ٢٠٠ متر",
          field: "boolean",
          required: true,
          // init_data: (props) => {
          //   if (
          //     !window.Supporting ||
          //     (window.Supporting && !window.Supporting.LessThen2Handred)
          //   ) {
          //     props.input.onChange(true);
          //   }
          // },
          // onChangeValidate: (props, evt) => {
          //
          //   const { mainObject } = props;
          //   if (
          //     mainObject.data_msa7y.msa7yData &&
          //     mainObject.data_msa7y.msa7yData.cadDetails
          //   ) {
          //     if (
          //       mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels
          //         .length
          //     ) {
          //       let invalid = false;
          //       mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.forEach(
          //         function (val, key) {
          //           if (+val.area < 200) {
          //             invalid = true;
          //           }
          //         }
          //       );
          //
          //       if (
          //         window.Supporting &&
          //         window.Supporting.LessThen2Handred &&
          //         invalid
          //       ) {
          //         props.input.onChange(evt.target.checked);
          //       } else {
          //         window.notifySystem(
          //           "error",
          //           `يجب أن تكون مساحات الأراضي لا تقل عن ${localizeNumber(
          //             200
          //           )} متر`
          //         );
          //         props.input.onChange(true);
          //       }
          //     }
          //   }
          // },
        },
        merged_duplixs: {
          label: "البناء علي قطعة الأرض فلل متصلة",
          field: "boolean",
          // itemChanged: function (evt, stepItem, steps, mainObject, props) {
          //
          //   var fields = steps.duplix_checktor.sections.duplix_checktor.fields;
          //   var field = fields.line_area_len_merg;
          //   field.required = true;
          //   var field = fields.line_area_len_split;
          //   field.required = true;
          // }
        },
        split_duplixs: {
          label: "البناء علي قطعة الأرض فلل منفصلة",
          field: "boolean",
          // itemChanged: function (evt, stepItem, steps, mainObject, props) {
          //
          //   var fields = steps.duplix_checktor.sections.duplix_checktor.fields;
          //   var field = fields.line_area_len_merg;
          //   field.required = true;
          //   var field = fields.line_area_len_split;
          //   field.required = true;
          // }
        },
        line_area_len_merg: {
          moduleName: "line_area_len_merg",
          label:
            "لا يقل طول ضلع القطعة الواحدة علي الشارع عن ٩.٥ متر للمباني المتصلة",
          field: "boolean",
          deps: ["values.merged_duplixs"],
          disabled: true,
          checked: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(
              get(values, "duplix_checktor.merged_duplixs", false)
            );
          },
        },
        line_area_len_split: {
          moduleName: "line_area_len_split",
          label:
            "لا يقل طول ضلع القطعة الواحدة علي الشارع عن ١١.٥ متر للمباني المنفصلة",
          field: "boolean",
          deps: ["values.split_duplixs"],
          disabled: true,
          checked: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(get(values, "duplix_checktor.split_duplixs", false));
          },
        },
        direct_line: {
          label: "حد التقسيم مستقيماً",
          field: "boolean",
          required: true,
        },
        unit_connect: {
          label: "لا يزيد التلاصق للوحدة الواحدة عن جهتين",
          field: "boolean",
          required: true,
        },
        comm_air_room: {
          label: "لا تشترك الوحدات المتلاصقة في منور واحد",
          field: "boolean",
          required: true,
        },
        internal_parking: {
          label: "موقف داخلي لكل قطعة سكنية مفرزة",
          field: "boolean",
          required: true,
        },
        externals: {
          label: "الأرتدادات",
          field: "boolean",
          required: true,
        },
        notes: {
          label: "ملاحظات",
          placeholder: "ادخل ملاحظاتك على التقرير الفني هنا ...",
          field: "textArea",
          rows: 5,
        },
      },
    },
  },
};
