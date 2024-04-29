import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import axios from "axios";
import {
  convertToArabic,
  plan_classes,
  getUrbans,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { setPlanDefaults } from "../../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/planDefaults";
export default {
  label: "بدائل ضوابط تخطيط الأراضي",
  preSubmit(values, currentStep, props) {
    //return values

    return new Promise(function (resolve, reject) {
      // let isFormValid = true;
      // values.submission_data = values.landData.lands.submission_data || {};
      if (
        !(props.formValues || values).bands_approval.band_number
          .owner_selectedValues
      ) {
        window.notifySystem("error", "من فضلك اختر البدائل");
        return reject();
      }
      // throw "error in land selection"
      else {
        // props.actionVals.className = "next";
        return resolve(props.formValues || values);
      }
    });
  },
  sections: {
    bands_approval: {
      label: "موافقة المالك على المخطط وتطوير المخطط",
      className: "radio_det",
      fields: {
        urban: {
          moduleName: "urban",
          label: "النطاق العمراني",
          placeholder: "من فضلك اختر النطاق العمراني",
          field: "text",
          disabled: true,
          init_data: (props) => {
            const {
              input: { onChange, value },
              mainObject,
            } = props;
            var urban = getUrbans(props).find((d) => {
              return d.code == mainObject.bda2l.bands_approval.urban;
            });
            if (urban) {
              console.log(urban.name);
              onChange(urban.name);
            }
          },
        },
        main_header_title: {
          moduleName: "main_header_title",
          label: "main_header_title",
          field: "label",
          hideLabel: true,
          className: "bda2ll",
          init_data: (props) => {
            const {
              input: { onChange, value },
              mainObject,
            } = props;

            setPlanDefaults(mainObject);

            //if (!value) {
            var sug = mainObject.plans.plansData.planDetails.uplodedFeatures;
            var cutArea =
              (mainObject.cutAreaPercentage &&
                `${convertToArabic(mainObject.cutAreaPercentage)} %`) ||
              _.chain(
                sug[mainObject.plans.plansData.planDetails.selectedCADIndex]
                  .shapeFeatures.landbase
              )
                .filter(function (parcel) {
                  return parcel.is_cut;
                })
                .reduce(function (a, b) {
                  return a + +b.area;
                }, 0)
                .value()
                .toFixed(2);
            var plan_name = plan_classes.find(function (d) {
              return d.f(
                +mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.area?.toFixed(
                  2
                ) || 0
              );
            });
            String.prototype.bind_format = function () {
              var args = arguments;
              return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != "undefined" ? args[number] : "";
              });
            };
            //console.log(getUrbans(props));

            var urbanName = getUrbans(props).find((d) => {
              return (
                d.code == mainObject.bda2l.bands_approval.urban ||
                d.name == mainObject.bda2l.bands_approval.urban
              );
            }).name;
            onChange(
              convertToArabic(
                "أوافق علي المخطط وما ورد به من أنظمة و تعليمات أو ملاحظات وعلي النسبة التخطيطية المقتطعة للمرافق العامة و البالغة {0} ولا أطالب بالتعويض عما زاد عن النسبة النظامية وكذلك التزم بتنفيذ ضوابط التنمية العمرانية المعتمدة بقرار مجلس الوزراء ( ١٥٧ ) وتاريخ ١١ / ٥ / ١٤٢٨ هـ ولائحتها التنفيذية المحدثة المعتمدة بقرار وزير الشئون البلدية والقروية رقم ٦٦٠٠ في ٢٠ / ١٢ / ١٤٣٥ هـ وفق ضوابط مرحلة التنمية العمرانية حتي {1} بمدينة {2} المحددة ( {3} ) ال{4} المتضمنة ما يلي :-".bind_format(
                  cutArea,
                  urbanName,
                  mainObject.landData.landData.municipality.name,
                  mainObject.landData.landData.municipality.mun_classes
                    .mun_class,
                  plan_name.name
                )
              )
            );
            //}
          },
        },
        band_number: {
          moduleName: "bandNumber",
          label: "",
          field: "customRadio",
          editButton: false,
          radios: true,
          checkboxes: false,
          isMotabkh: true,
        },
        main_footer_title: {
          moduleName: "main_header_title",
          label: "main_header_title",
          field: "label",
          hideLabel: true,
          init_data: (props) => {
            const {
              input: { onChange, value },
            } = props;
            if (!value)
              onChange(
                "ولا يحق لي المطالبة بالإعتماد النهائي للمخطط الا بعد تنفيذ جميع ما ورد أعلاه وهذا إقرار مني بذلك"
              );
          },
        },
        owner_acceptance: {
          label: "نسخة من المخطط مصدقة من المكتب الهندسي مصدقة من المالك",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".jpg,.jpeg,.png",
          multiple: false,
          required: true,
          textTruncated: true,
          truncatedCharacterIndex: 10,
        },
        others: {
          label: "أخري",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".jpg,.jpeg,.png,.pdf",
          multiple: true,
        },
      },
    },
  },
};
