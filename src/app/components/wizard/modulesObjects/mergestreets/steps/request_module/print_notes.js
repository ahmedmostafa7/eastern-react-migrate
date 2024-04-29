import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
export default {
  label: "ملاحظات الطباعة",
  // preSubmit(values, currentStep, props) {
  //     return new Promise(function (resolve, reject) {
  //
  //         resolve(values);
  //     });
  // },
  sections: {
    printed_remarks: {
      init_data: (values, props, fields) => {
        let mainObject = props["mainObject"];
        console.log(props);
        console.log(values);

        if (mainObject.print_notes) {
          mainObject.print_notes.printed_remarks.remarks =
            mainObject?.print_notes?.printed_remarks?.remarks?.map(
              (remark, index) => {
                return {
                  ...remark,
                  num: index,
                };
              }
            );
          props.change(
            "printed_remarks.remarks",
            mainObject.print_notes.printed_remarks.remarks
          );
        }
      },
      label: "ملاحظات الطباعة",
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
                      let data = props?.values?.remarks || [];
                      var maxNum = Math.max.apply(
                        Math,
                        data.map(function (o) {
                          return o.num;
                        })
                      );
                      values.num = (!data.length && 1) || ++maxNum;
                      values.checked = true;
                      values.isDefault = false;
                      props.change("printed_remarks.remarks", [
                        ...data,
                        values,
                      ]);
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
          // init_data: (values, props, fields) => {
          //   String.prototype.bind_format = function () {
          //     var args = arguments;
          //     return this.replace(/{(\d+)}/g, function (match, number) {
          //       return typeof args[number] != 'undefined'
          //         ? args[number]
          //         : ''
          //         ;
          //     });
          //   };

          //   var printed_remarks = [{
          //     number: 1,
          //     expression: function (props) {
          //       const { mainObject } = props;
          //
          //       return "صك الملكية رقم {0} في {1} والصادر من كتابة العدل {2} والساري المفعول بموجب التحقق الالكتروني.‬"
          //         .bind_format(mainObject.waseka.waseka.table_waseka[0].number_waseka, mainObject.waseka.waseka.table_waseka[0].date_waseka, mainObject.waseka.waseka.table_waseka[0].waseka_search);
          //     },
          //   }, {
          //     number: 2,
          //     expression: function (props) {
          //       const { mainObject } = props;
          //
          //       return "‫تم اعداد هذا المخطط بناء على خطاب وكيل أول وزارة تخطيط المدن رقم {0} في {1} هـ المبنى على خطاب مقام وزير العمل رئيس مجلس إدارة المؤسسة العامة للتعليم الفني والتدريب المهني رقم ......... وتاريخ .......... هـ ."
          //         .bind_format(mainObject.waseka.waseka.table_waseka[0].number_waseka, mainObject.waseka.waseka.table_waseka[0].date_waseka)
          //     },
          //   }, {
          //     number: 3,
          //     expression: function (props) {
          //       const { mainObject } = props;
          //
          //       return "‫تم اعداد المخطط بناء على الرفع المساحي المرسل من {0} بإحالتهم رقم {1} بتاريخ {2}"
          //         .bind_format(mainObject.submission_data.mostafed_data.committee_name || 'إدارة المساحة', mainObject.submission_data.mostafed_data.req_no, mainObject.submission_data.mostafed_data.req_date);
          //     }
          //   }, {
          //     number: 4,
          //     expression: function (props) {
          //       const { mainObject } = props;
          //
          //       var model = mainObject.requests.attachments.table_attachments.find(function (d) { return d.id == 8 });
          //       return "‫تم أخذ موافقة وزارة البترول والثروة المعدنية على تخطيط الأرض بالصك رقم ({0}) في {1} المستند علية الوثائق {2} في {3} هـ المتضمن عدم الاعتراض على تخطيط الأرض"
          //         .bind_format(model.number, model.date, mainObject.waseka.waseka.table_waseka[0].number_waseka, mainObject.waseka.waseka.table_waseka[0].date_waseka);
          //     }
          //   }
          // ];

          //   var remarks = [];
          //
          //   if (!values || (values && !values.remarks)) {
          //     for (var i = 0; i < printed_remarks.length; i++) {
          //       remarks.push({
          //         num: i,
          //         remark: printed_remarks[i].expression(props),
          //         checked: true,
          //         isDefault: true
          //       });
          //     }

          //     props.change("printed_remarks.remarks", remarks);
          //     //props.setSelector('remarks', { data: remarks });
          //   }
          // },
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
                            let data =
                              props?.values?.remarks ||
                              props?.mainObject?.print_notes?.printed_remarks
                                ?.remarks ||
                              [];
                            let index = data.findIndex(
                              (d) => d.num == values["num"]
                            );
                            data[index] = values;
                            props.change("printed_remarks.remarks", [...data]);
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
                  },
                  text: "Delete",
                  className: " btn btn-danger ",
                  icon: "delete",
                  action(props, d, stepItem) {
                    let newdata = props["mainValues"].filter(
                      (m) => m.num != d.num
                    );
                    props.change("printed_remarks.remarks", newdata);
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
