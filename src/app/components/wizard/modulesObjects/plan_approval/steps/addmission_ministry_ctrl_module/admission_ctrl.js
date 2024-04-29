import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign, isEmpty } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
export default {
  label: "محاضر إستلام الخدمات التي تم تنفيذها",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      let admission_ctrl = props.mainObject?.admissions?.admission_ctrl;
      var editedAttachmentsLength = values.admission_ctrl.attachments.filter(
        (attachment, index) => {
          return attachment.isAdded == true;
        }
      ).length;

      if (editedAttachmentsLength < values.admission_ctrl.attachments.length) {
        window.notifySystem("error", "يجب اضافة كل المرفقات");
        reject();
      } else {
        if (
          values.admission_ctrl.attachments.find((r) => r.id == 1001) ==
            undefined &&
          admission_ctrl?.attachments?.find((r) => r.id == 1001) != undefined
        ) {
          values.admission_ctrl.attachments.push(
            admission_ctrl?.attachments?.find((r) => r.id == 1001)
          );
        }
        resolve(values);
      }
    });
  },
  sections: {
    admission_ctrl: {
      label: "محاضر إستلام الخدمات التي تم تنفيذها",
      type: "inputs",
      fields: {
        attachments: {
          hideLabel: true,
          field: "list",
          type: "inputs",
          moduleName: "attachments",
          label: "المرفقات",
          className: "modal-table",
          init_data: (values, props, fields) => {
            const { mainObject } = props;

            var attachments = JSON.parse(
              JSON.stringify(
                get(mainObject?.admissions?.admission_ctrl, "attachments", [])
              )
            );
            if (!attachments.length) {
              var bandOptions =
                mainObject.bda2l.bands_approval.band_number.oldOptions;
              var bda2l_bands = !isEmpty(
                mainObject?.bda2l?.bands_approval?.band_number
                  ?.owner_selectedValues?.key
              )
                ? mainObject.bda2l.bands_approval.band_number
                    .owner_selectedValues.values
                : !Array.isArray(
                    mainObject?.bda2l?.bands_approval?.band_number
                      ?.selectedValues
                  ) &&
                  !isEmpty(
                    mainObject?.bda2l?.bands_approval?.band_number
                      ?.selectedValues?.key
                  )
                ? mainObject.bda2l.bands_approval.band_number.selectedValues
                    .values
                : Array.isArray(
                    mainObject?.bda2l?.bands_approval?.band_number
                      ?.selectedValues
                  ) &&
                  mainObject?.bda2l?.bands_approval?.band_number?.selectedValues
                    .length
                ? mainObject.bda2l.bands_approval.band_number.selectedValues.reduce(
                    (a, b) => {
                      a = a.concat(b.values);
                      return a;
                    },
                    []
                  )
                : bandOptions.length == 1
                ? (bandOptions[0].label &&
                    bandOptions[0].label.split(",").map((band) => {
                      return {
                        condition: { item_description: band.split("-")[1] },
                      };
                    })) ||
                  []
                : [];
              attachments = [];
              for (var i = 0; i < bda2l_bands.length; i++) {
                attachments.push({
                  id: attachments.length + 1,
                  attachment: "",
                  attachment_type: bda2l_bands[i].condition.item_description,
                  request_date: "",
                  request_no: "",
                  request_notes: "",
                });
              }
            }

            if (props.currentModule.id == 120) {
              if (attachments.find((r) => r?.id == 1001) == undefined) {
                attachments.push({
                  id: 1001,
                  attachment: "",
                  attachment_type: "بيانات خطاب اعتماد غرف الكهرباء",
                  request_date: "",
                  request_no: "",
                  request_notes: "",
                });
              }
            } else {
              attachments = attachments?.filter((r) => r?.id != 1001);
            }

            props.change("admission_ctrl.attachments", attachments);
          },
          fields: {
            attachment_type: { head: "نوع المرفق" },
            request_date: { head: "التاريخ" },
            request_no: { head: "الرقم" },
            request_notes: { head: "الملاحظات" },
            actions: {
              type: "actions",
              head: "",
              actions: {
                show: {
                  permissions: {
                    show_every: ["isAdded"],
                  },
                  className: "btn btn-success",
                  text: "عرض",
                  action(props, d) {
                    // const fields = {
                    //     attachment: {
                    //         field: 'simpleUploader',
                    //         uploadUrl: `${host}/uploadMultifiles`,
                    //         fileType: '.jpg,.jpeg,.png,.pdf',
                    //         multiple: false,
                    //         required: true,
                    //         label: 'المرفق',
                    //         disabled: true
                    //     },
                    //     request_date: {
                    //         field: 'label',
                    //         label: 'تاريخ المرفق',
                    //     },
                    //     request_no: {
                    //         field: 'label',
                    //         label: 'رقم المرفق',
                    //     }
                    // }

                    props.setMain("Popup", {
                      popup: {
                        type: "confirm",
                        imageModal: true,
                        imgUrl: filesHost + "/" + d["attachment"],
                      },
                    });
                  },
                  //icon: "edit-pen",
                  // className: "btn btn-warning",
                  // onOk: {
                  //     action: "add",
                  // },
                },
                add: {
                  permissions: {
                    // hide_every: ["isAdded"],
                    // show_if_props_equal: { key: "currentModule.id", value: 120 },
                    show_multiValues_equal_list: {
                      con1: [
                        { key: "isAdded", value: undefined },
                        { key: "currentModule.id", value: 44 },
                      ],
                      con2: [
                        { key: "isAdded", value: undefined },
                        { key: "id", value: 1001 },
                        { key: "currentModule.id", value: 120 },
                      ],
                      con3: [
                        { key: "isAdded", value: false },
                        { key: "currentModule.id", value: 44 },
                      ],
                    },
                  },
                  // permissions: {

                  // },
                  className: "btn btn-success",
                  text: "Add",
                  action(props, d) {
                    const fields = {
                      attachment: {
                        field: "simpleUploader",
                        uploadUrl: `${host}/uploadMultifiles`,
                        fileType: ".jpg,.jpeg,.png,.pdf",
                        multiple: false,
                        required: true,
                        label: "المرفق",
                      },
                      request_no: {
                        field: "text",
                        label: "رقم المرفق",
                        placeholder: "من فضلك ادخل رقم المرفق",
                        required: true,
                      },
                      request_date: {
                        field: "hijriDatePicker",
                        label: "تاريخ المرفق",
                        placeholder: "من فضلك ادخل تاريخ المرفق",
                        required: true,
                      },
                      request_notes: {
                        field: "textArea",
                        label: "ملاحظات",
                        placeholder: "من فضلك ادخل ملاحظات",
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
                            let data = get(
                              props,
                              "mainValues",
                              props.values?.attachments
                            );
                            let index = data.findIndex(
                              (d) => d.id == values["id"]
                            );
                            values.isAdded = true;
                            data[index] = values;
                            props.change("admission_ctrl.attachments", [
                              ...data,
                            ]);
                            return Promise.resolve(true);
                          },
                        },
                      },
                    });
                  },
                  icon: "edit-pen",
                  // className: "btn btn-warning",
                  onOk: {
                    action: "add",
                  },
                },
                edit: {
                  permissions: {
                    // show_every: ["isAdded"],
                    // show_if_props_equal: { key: "currentModule.id", value: 44 },
                    show_multiValues_equal_list: {
                      con1: [
                        { key: "isAdded", value: true },
                        { key: "currentModule.id", value: 44 },
                      ],
                      con2: [
                        { key: "isAdded", value: true },
                        { key: "id", value: 1001 },
                        { key: "currentModule.id", value: 120 },
                      ],
                    },
                  },
                  // permissions: {

                  // },
                  className: "btn follow",
                  text: "Edit",
                  action(props, d) {
                    const fields = {
                      attachment: {
                        field: "simpleUploader",
                        uploadUrl: `${host}/uploadMultifiles`,
                        fileType: ".jpg,.jpeg,.png,.pdf",
                        multiple: false,
                        required: true,
                        label: "المرفق",
                      },
                      request_no: {
                        field: "text",
                        label: "رقم المرفق",
                        placeholder: "من فضلك ادخل رقم المرفق",
                        required: true,
                      },
                      request_date: {
                        field: "hijriDatePicker",
                        label: "تاريخ المرفق",
                        placeholder: "من فضلك ادخل تاريخ المرفق",
                        required: true,
                      },
                      request_notes: {
                        field: "textArea",
                        label: "ملاحظات",
                        placeholder: "من فضلك ادخل ملاحظات",
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
                            let data = get(
                              props,
                              "mainValues",
                              props.values?.attachments
                            );
                            let index = data.findIndex(
                              (d) => d.id == values["id"]
                            );
                            data[index] = values;
                            props.change("admission_ctrl.attachments", [
                              ...data,
                            ]);
                            return Promise.resolve(true);
                          },
                        },
                      },
                    });
                  },
                  icon: "edit-pen",
                  className: "btn follow",
                  onOk: {
                    action: "edit",
                  },
                },
                delete: {
                  permissions: {
                    // show_every: ["isAdded"],
                    // show_if_props_equal: { key: "currentModule.id", value: 44 },
                    show_multiValues_equal_list: {
                      con1: [
                        { key: "isAdded", value: true },
                        { key: "currentModule.id", value: 44 },
                      ],
                      con2: [
                        { key: "isAdded", value: true },
                        { key: "id", value: 1001 },
                        { key: "currentModule.id", value: 120 },
                      ],
                    },
                  },
                  // permissions: {

                  // },
                  text: "Delete",
                  className: " btn btn-danger ",
                  icon: "delete",
                  action(props, values, stepItem) {
                    let data = get(
                      props,
                      "mainValues",
                      props.values?.attachments
                    );
                    let index = data.findIndex((d) => d.id == values["id"]);
                    values["request_date"] = "";
                    values["request_no"] = "";
                    values["attachment"] = "";
                    values["request_notes"] = "";
                    values["isAdded"] = undefined;
                    data[index] = values;
                    props.change("admission_ctrl.attachments", [...data]);
                  },
                },
              },
            },
          },
        },
      },
    },
    // final_elec_letter: {
    //   label: "بيانات خطاب اعتماد غرف الكهرباء",
    //   fields: {
    //     final_elec_letter_num: {
    //       required: true,
    //       label: "رقم خطاب اعتماد غرف الكهرباء",
    //     },
    //     final_elec_letter_date: {
    //       field: "hijriDatePicker",
    //       lessThanToday: true,
    //       required: true,
    //       label: "تاريخ خطاب اعتماد غرف الكهرباء",
    //     },
    //     final_elec_letter_attachment: {
    //       label: "مرفق خطاب اعتماد غرف الكهرباء",
    //       field: "simpleUploader",
    //       uploadUrl: `${host}/uploadMultifiles`,
    //       fileType: "image/*,.pdf",
    //       multiple: false,
    //       maxNumOfFiles: 1,
    //     },
    //   },
    // },
  },
};
