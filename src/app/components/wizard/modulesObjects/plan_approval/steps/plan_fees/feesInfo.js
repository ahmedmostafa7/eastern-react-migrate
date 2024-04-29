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
  CalculateFees,
  CalculateTotalFees,
  CalculateIncreasePercentage,
} from "../../../../../../../main_helpers/functions/fees";
import {
  plan_classes,
  getUrbans,
  convertToArabic,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
export default {
  label: "رسوم المخطط",
  // preSubmit(values, currentStep, props) {
  //   const { t } = props;
  //   return new Promise(function (resolve, reject) {
  //     let description = "";
  //     if (values.feesInfo.feesValue) {
  //       description += `الرسوم الأساسية: ${convertToArabic(
  //         values.feesInfo.feesValue || 0
  //       )} ريال وقيمة الزيادة:  ${convertToArabic(
  //         CalculateIncreasePercentage(values.feesInfo)
  //       )} ريال`;
  //       values.feesInfo.description = description;
  //       return resolve(values);
  //     }
  //     return reject();
  //   });
  // },
  sections: {
    feesInfo: {
      label: "رسوم المخطط",
      // hideLabel: true,
      className: "radio_det",
      fields: {
        feesValue: {
          moduleName: "feesValue",
          label: "رسوم المخطط (ريال)",
          field: "inputNumber",
          disabled: true,
          init_data: (props) => {
            const {
              input: { onChange, value },
            } = props;

            if (!value) {
              CalculateFees(props).then((res) => {
                onChange(res);
                setTimeout(() => {
                  const values = applyFilters({
                    key: "FormValues",
                    form: "stepForm",
                  });

                  let updatedFees = {
                    ...values?.feesInfo,
                    feesValue: res,
                    increasePercentage:
                      values?.feesInfo?.increasePercentage || 0,
                  };

                  let description = "";
                  if (res) {
                    description += `${
                      (!updatedFees?.feesList?.length &&
                        `الرسوم الأساسية: ${convertToArabic(res || 0)} ريال`) ||
                      ""
                    } ${
                      (updatedFees.increasePercentage &&
                        `${
                          (!updatedFees?.feesList?.length && "و") || ""
                        } قيمة الزيادة:  ${convertToArabic(
                          CalculateIncreasePercentage(updatedFees)
                        )} ريال`) ||
                      ""
                    }`;
                    values.feesInfo.description = description;
                  }

                  props.change(
                    "feesInfo.feesTotalValue",
                    CalculateTotalFees(updatedFees)
                  );
                });
              });
            }
          },
        },

        notes: {
          moduleName: "notes",
          field: "textArea",
          // required: true,
          rows: "8",
          label: "ملاحظة",
          placeholder: "من فضلك ادخل هنا الملاحظات",
        },
        feesList: {
          field: "list",
          className: "modal-table",
          label: "feesList",
          moduleName: "feesList",
          fields: {
            invoice_number: {
              head: "رقم الفاتورة",
            },
            invoice_date: {
              head: "تاريخ الفاتورة",
            },
            fees: {
              head: "اجمالي الفاتورة",
            },
            is_paid: {
              head: "حالة الفاتورة",
              type: "input",
              field: "label",
              hideLabel: true,
              init_data: (props) => {
                if (typeof props == "object") {
                  const {
                    input: { value, onChange },
                  } = props;

                  onChange((value && "تم الدفع") || "لم يتم الدفع");
                } else {
                  return (
                    (typeof props == "boolean" &&
                      ((props && "تم الدفع") || "لم يتم الدفع")) ||
                    props
                  );
                }
              },
            },
            description: {
              head: "وصف الفاتورة",
            },
          },
          permission: { show_every: ["feesList"] },
        },
        increasePercentage: {
          moduleName: "increasePercentage",
          label: "نسبة الزيادة (%)",
          field: "inputNumber",
          init_data: (props) => {
            const {
              input: { onChange, value },
            } = props;
            onChange(0);
          },
          onClick: (props, value) => {
            const {
              input: { onChange },
            } = props;

            onChange(value);
            setTimeout(() => {
              const values = applyFilters({
                key: "FormValues",
                form: "stepForm",
              });

              let description = "";
              if (values?.feesInfo?.feesValue) {
                description += `${
                  (!values.feesInfo?.feesList?.length &&
                    `الرسوم الأساسية: ${convertToArabic(
                      values?.feesInfo?.feesValue || 0
                    )} ريال `) ||
                  ""
                } ${
                  (value &&
                    `${
                      (!values.feesInfo?.feesList?.length && "و") || ""
                    } قيمة الزيادة:  ${convertToArabic(
                      CalculateIncreasePercentage({
                        feesValue: values?.feesInfo?.feesValue,
                        increasePercentage: value,
                      })
                    )} ريال`) ||
                  ""
                }`;
                values.feesInfo.description = description;
              }

              props.change(
                "feesInfo.feesTotalValue",
                CalculateTotalFees({
                  ...values.feesInfo,
                  increasePercentage: value,
                })
              );
            });
          },
        },
        feesTotalValue: {
          moduleName: "feesTotalValue",
          label: "الإجمالي",
          field: "label",
          init_data: (props) => {
            const {
              input: { onChange },
            } = props;

            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });

            onChange(CalculateTotalFees(values.feesInfo));
          },
        },
      },
    },
  },
};
