import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import { convertToArabic } from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
export default {
  label: "ملاحظات اللجنة الفنية",
  // preSubmit(values, currentStep, props) {
  //     return new Promise(function (resolve, reject) {
  //
  //         resolve(values);
  //     });
  // },
  sections: {
    lagna_remarks: {
      label: "ملاحظات اللجنة الفنية",
      type: "inputs",
      fields: {
        addPrintNote: {
          field: "button",
          hideLabel: true,
          text: "إضافة ملاحظة",
          action: {
            type: "custom",
            action(props, stepItem) {
              console.log("stem", stepItem);
              const fields = {
                remark: {
                  field: "textArea",
                  label: "الملاحظة",
                  rows: 8,
                  required: true,
                },
              };
              props.setMain("Popup", {
                popup: {
                  type: "create",
                  childProps: {
                    fields,
                    ok(values) {
                      let data = props["values"]["remarks"];
                      var maxNum = Math.max.apply(
                        Math,
                        data.map(function (o) {
                          return o.num;
                        })
                      );
                      values.num = ++maxNum;
                      values.checked = true;
                      values.isDefault = false;
                      props.change("lagna_remarks.remarks", [...data, values]);
                      return Promise.resolve(values);
                    },
                  },
                },
              });
            },
          },
        },
        remarks: {
          hideLabel: true,
          field: "list",
          type: "inputs",
          moduleName: "remarks",
          label: "الملاحظات",
          className: "modal-table",
          init_data: (values, props, fields) => {
            const { mainObject, t } = props;
            var lgnah_remarks =
              mainObject?.lagna_notes?.lagna_remarks?.remarks || [];
            if (
              (!values ||
                (values &&
                  (!values.remarks ||
                    (values.remarks && !values.remarks.length)))) &&
              mainObject?.requests?.attachments?.table_attachments?.length
            ) {
              for (
                var i = 0;
                i < mainObject.requests.attachments.table_attachments.length;
                i++
              ) {
                var attachment =
                  mainObject.requests.attachments.table_attachments[i];
                if (attachment && attachment.id != 1 && attachment.id != 3) {
                  var firstTxt = "تم";
                  var txt = t(attachment.name);

                  if (attachment.id != 2 && attachment.id != 7) {
                    firstTxt += " " + "موافقة ";
                  }

                  if (attachment.id == 2) {
                    firstTxt += " " + " أخذ ";
                  }

                  if (attachment.id == 4 || attachment.id == 5) {
                    firstTxt += " " + " الجهة المختصة على ";
                  }

                  if (attachment.id != 7) {
                    firstTxt +=
                      txt +
                      " " +
                      " بموجب خطابهم رقم " +
                      (convertToArabic(attachment.number) || "  ") +
                      " في " +
                      convertToArabic(attachment.date) +
                      " هـ ";
                  }

                  if (attachment.id == 7) {
                    firstTxt =
                      " التأكد من سريان مفعول صك الملكية بموجب خطاب " +
                      convertToArabic(
                        mainObject?.waseka?.waseka?.table_waseka?.[0]
                          ?.waseka_search
                      ) +
                      "  رقم " +
                      (convertToArabic(attachment.number) || "  ") +
                      " في " +
                      convertToArabic(attachment.date) +
                      " هـ ";
                  }

                  if (attachment.id == 14) {
                    firstTxt =
                      "تم استلام تصميم الأرصفة والشوارع من قبل المكتب الهندسي و تعتبر كافة التقاطعات و قطاعات الشوارع وتنسيق المواقع ايضاحية ويجوز إعادة النظر فيها من قبل الجهات المعنية ";
                  }

                  lgnah_remarks.push({
                    num: i,
                    checked: 1,
                    remark: firstTxt,
                    isDefault: true,
                  });
                }
              }

              lgnah_remarks.push({
                num: lgnah_remarks.length,
                checked:
                  mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.reduce(
                    (a, b) => {
                      return a + +b.area;
                    },
                    0
                  ) >= 5000,
                isSignAmin: true,
                remark: "توقيع معالي أمين المنطقة الشرقية",
                isDefault: true,
              });
              props.change("lagna_remarks.remarks", lgnah_remarks);
            }

            if (
              lgnah_remarks.filter((r) => r.isCopied).length !=
              mainObject?.print_notes?.printed_remarks?.remarks.length
            ) {
              mainObject?.print_notes?.printed_remarks?.remarks.forEach(
                (print_note) => {
                  if (!lgnah_remarks.find((r) => r.old_num == print_note.num)) {
                    lgnah_remarks.push({
                      num: lgnah_remarks.length,
                      checked: print_note.checked,
                      remark: print_note.remark,
                      isDefault: print_note.isDefault,
                      isCopied: true,
                      old_num: print_note.num,
                    });
                  }
                }
              );
              props.change("lagna_remarks.remarks", lgnah_remarks);
            }
          },
          fields: {
            checked: {
              head: "",
              field: "boolean",
              type: "input",
              hideLabel: true,
              hide_sublabel: true,
            },
            remark: { head: "الملاحظات" },
            actions: {
              type: "actions",
              head: "",
              actions: {
                edit: {
                  className: "btn follow",
                  text: "Edit",
                  action(props, d) {
                    const fields = {
                      remark: {
                        field: "textArea",
                        label: "الملاحظة",
                        placeholder: "من فضلك ادخل هنا الملاحظة",
                        rows: 8,
                        required: true,
                      },
                    };
                    props.setMain("Popup", {
                      popup: {
                        type: "create",
                        childProps: {
                          fields,
                          initialValues: d,
                          ok(values) {
                            let data = props["values"]["remarks"];
                            let index = data.findIndex(
                              (d) => d.num == values["num"]
                            );
                            data[index] = values;
                            props.change("lagna_remarks.remarks", [...data]);
                            return Promise.resolve(true);
                          },
                        },
                      },
                    });
                  },
                  icon: "edit-pen",
                  className: "btn btn-warning ediT",
                  onOk: {
                    action: "add",
                  },
                },
                delete: {
                  permissions: {
                    hide_every: ["isDefault"],
                    show_multiValues_equal_list: {
                      con1: [{ key: "isCopied", value: undefined }],
                    },
                  },
                  text: "Delete",
                  className: " btn btn-danger ",
                  icon: "delete",
                  action(props, d, stepItem) {
                    let newdata = props["mainValues"].filter(
                      (m) => m.num != d.num
                    );
                    props.change("lagna_remarks.remarks", newdata);
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
