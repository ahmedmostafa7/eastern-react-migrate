import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { pricingFields } from "./pricing_Fields";
const _ = require("lodash");
// let onInputChange = (
//   pricefieldName,
//   areaFieldName,
//   totalFieldName,
//   val,
//   props
// ) => {
//   const formValues = applyFilters({
//     key: "FormValues",
//     form: "stepForm",
//   });
//   let parcel_price_index =
//     formValues?.primary_pricing?.parcels_prices.findIndex(
//       (r) => r.parcel_plan_no == formValues?.primary_pricing?.parcel_plan_no
//     );
//   formValues.primary_pricing.parcels_prices[parcel_price_index][
//     pricefieldName
//   ] = val;
//   formValues.primary_pricing.parcels_prices[parcel_price_index][
//     totalFieldName
//   ] =
//     val *
//     (+formValues?.primary_pricing?.parcels_prices?.[parcel_price_index]?.[
//       areaFieldName
//     ] || 0);
//   props.change(
//     `primary_pricing.${totalFieldName}`,
//     formValues?.primary_pricing?.parcels_prices?.[parcel_price_index]?.[
//       totalFieldName
//     ] || 0
//   );

//   props.change(
//     "primary_pricing.total_of_totals_of_cut_areas",
//     formValues?.primary_pricing?.parcels_prices.reduce(
//       (a, b) => a + +b.parcel_cut_area,
//       0
//     )
//   );
//   props.change(
//     "primary_pricing.total_of_totals_of_cut_prices",
//     formValues?.primary_pricing?.parcels_prices.reduce(
//       (a, b) => a + +b.total_parcel_cut_price,
//       0
//     )
//   );
// };

export default {
  number: 1,
  label: "التسعير المبدئي",
  preSubmit(values, currentStep, props) {
    const { t } = props;
    return new Promise(function (resolve, reject) {
      if (
        !values?.primary_pricing?.primaryPricing?.selectedLands ||
        values?.primary_pricing?.primaryPricing?.selectedLands?.find(
          (r) => !r.attributes.PARCEL_METER_PRICE
        )
      ) {
        window.notifySystem("error", "من فضلك ادخل التسعير المبدئي لكل أرض");
        return reject();
      }

      Object.keys(values.primary_pricing).forEach((fieldKey) => {
        if (
          !Object.keys(
            props.wizardSettings.steps.primary_pricing.sections.primary_pricing
              .fields
          ).find((r) => r == fieldKey)
        ) {
          delete values.primary_pricing[fieldKey];
        }
      });

      return resolve(values);
    });
  },
  sections: {
    primary_pricing: {
      label: "التسعير المبدئي",
      type: "inputs",
      required: true,
      init_data: (values, props, fields) => {
        setTimeout(() => {
          if (
            !values ||
            !values?.primary_pricing?.primaryPricing?.selectedLands
          ) {
            let pricing_table_totals = [
              {
                total_of_totals_of_cut_areas: 0,
                total_of_totals_of_cut_prices: 0,
              },
            ];
            props.change(
              "primary_pricing.pricing_table_totals",
              pricing_table_totals
            );
          }
        }, 1000);
      },
      fields: {
        // add_price: {
        //   field: "button",
        //   hideLabel: true,
        //   // className:'btn',
        //   text: "اضافة التسعير المبدئي",
        //   // text: "Add Owner",
        //   action: {
        //     type: "custom",
        //     action(props, stepItem) {
        //       let fields = pricingFields;
        //
        //       props.setMain("Popup", {
        //         popup: {
        //           type: "create",
        //           childProps: {
        //             fields,
        //             ok(values) {
        //               const formValues = applyFilters({
        //                 key: "FormValues",
        //                 form: "stepForm",
        //               });
        //               let parcels =
        //                 props?.mainObject?.landData?.landData?.lands?.parcels;
        //               let pricing_table =
        //                 formValues?.primary_pricing?.pricing_table?.filter(
        //                   (r, index) =>
        //                     index !=
        //                     formValues?.primary_pricing?.pricing_table?.length -
        //                       1
        //                 ) || [];
        //               values?.parcel_plan_no?.map((parcelNo) => {
        //                 let prcl = parcels.find(
        //                   (r) => r?.attributes?.PARCEL_PLAN_NO == parcelNo
        //                 )?.attributes;
        //                 pricing_table.push({
        //                   no: uuid(),
        //                   parcel_meter_price_in_letters:
        //                     values.parcel_meter_price_in_letters,
        //                   parcel_no: parcelNo,
        //                   parcel_area: prcl.PARCEL_AREA,
        //                   parcel_cut_area: prcl.PARCEL_CUT_AREA,
        //                   parcel_meter_price: values?.parcel_meter_price || 0,
        //                   total_parcel_price: +(
        //                     +prcl.PARCEL_AREA *
        //                     +(values?.parcel_meter_price || 0)
        //                   ).toFixed(2),
        //                   total_parcel_cut_price: +(
        //                     +prcl.PARCEL_CUT_AREA *
        //                     +(values?.parcel_meter_price || 0)
        //                   ).toFixed(2),
        //                 });
        //               });

        //               let pricing_table_totals = [
        //                 {
        //                   total_of_totals_of_cut_areas: pricing_table
        //                     .reduce((a, b) => a + +b.parcel_cut_area, 0)
        //                     .toFixed(2),
        //                   total_of_totals_of_cut_prices: pricing_table.reduce(
        //                     (a, b) => a + +b.total_parcel_cut_price,
        //                     0
        //                   ),
        //                 },
        //               ];
        //               props.change(
        //                 "primary_pricing.pricing_table_totals",
        //                 pricing_table_totals
        //               );
        //
        //               props.change(
        //                 "primary_pricing.pricing_table",
        //                 pricing_table
        //               );

        //               return Promise.resolve(true);
        //             },
        //           },
        //         },
        //       });
        //     },
        //   },
        // },
        // pricing_table: {
        //   field: "list",
        //   moduleName: "pricing_table",
        //   hideLabel: true,
        //   required: true,
        //   label: "التسعير المبدئي لقطع الأراضي",
        //   fields: {
        //     parcel_no: { head: "رقم قطعة الأرض" },
        //     parcel_area: { head: "مساحة القطعة" },
        //     parcel_meter_price: { head: "سعر المتر بالقطعة" },
        //     total_parcel_price: {
        //       head: "السعر الإجمالي للمساحة الاجمالية للقطعة",
        //     },
        //     parcel_cut_area: { head: "مساحة الجزء المنزوع لكل قطعة" },
        //     total_parcel_cut_price: {
        //       head: "السعر الإجمالي للمساحة الاجمالية المنزوعة للقطعة",
        //     },
        //     actions: {
        //       type: "actions",
        //       head: "خيارات",

        //       actions: {
        //         delete: {
        //           permissions: {
        //             show_every: ["no"],
        //           },
        //           action(props, d, stepItem) {
        //             const formValues = applyFilters({
        //               key: "FormValues",
        //               form: "stepForm",
        //             });
        //
        //             let pricing_table =
        //               formValues?.primary_pricing?.pricing_table?.filter(
        //                 (r, index) => d.parcel_no != r.parcel_no
        //               );
        //             props.change(
        //               "primary_pricing.pricing_table",
        //               pricing_table
        //             );
        //           },
        //           text: "Delete",
        //           className: " btn btn-danger ",
        //         },
        //       },
        //     },
        //   },
        // },
        primaryPricing: {
          field: "primaryPricing",
          moduleName: "primaryPricing",
          hideLabel: true,
          label: "التسعير المبدئي لقطع الأراضي",
        },
        pricing_table_totals: {
          field: "list",
          moduleName: "pricing_table_totals",
          hideLabel: true,
          required: true,
          label: "التسعير المبدئي لقطع الأراضي",
          fields: {
            total_of_totals_of_cut_areas: {
              head: "المساحة الإجمالية المنزوعة لكامل الأراضي",
            },
            total_of_totals_of_cut_prices: {
              head: "السعر الإجمالي لكامل مساحة الجزء المنزوع من كامل الأراضي",
            },
          },
        },

        // total_cut_price_in_letters: {
        //   moduleName: "total_cut_price_in_letters",
        //   label:
        //     "السعر الإجمالي لكامل مساحة الجزء المنزوع من كامل الأراضي بالحروف",
        //   required: true,
        //   field: "text",
        // },
        // ma7dar_date: {
        //   moduleName: "ma7dar_date",
        //   label: "تاريخ المحضر",
        //   placeholder: "من فضلك ادخل تاريخ المحضر",
        //   required: true,
        //   field: "hijriDatePicker",
        // },
        // ma7dar_attachment: {
        //   label: "مرفق محضر لجنة التقدير المبدئي",
        //   field: "simpleUploader",
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   //uploadUrl: `${host}uploadFile/`,
        //   fileType: "image/*,.pdf",
        //   multiple: false,
        //   required: true,
        // },
        print_ma7dar: {
          label: "طباعة محضر لجنة التقدير المبدئي",
          //hideLabel: true,
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              // console.log("po", stepItem, props);
              // let id = stepItem["wizard"]["currentModule"]["record"].id;
              // window.open(
              //   printHost + `/#/pri_price_lagna_takdeer/${id}`,
              //   "_blank"
              // );

              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];
              const url = "/Submission/SaveEdit";
              const params = { sub_id: id };

              return (
                (!props?.field?.in_summery &&
                  postItem(
                    url,
                    {
                      mainObject: window.lzString.compressToBase64(
                        JSON.stringify({
                          ...{
                            ...mainObject,
                            primary_pricing: props["values"],
                          },
                        })
                      ),
                      tempFile: {},
                    },
                    { params }
                  ).then(() =>
                    window.open(
                      printHost + `/#/pri_price_lagna_takdeer/${id}`,
                      "_blank"
                    )
                  )) ||
                window.open(
                  printHost + `/#/pri_price_lagna_takdeer/${id}`,
                  "_blank"
                )
              );
            },
          },
        },
      },
    },
  },
};
