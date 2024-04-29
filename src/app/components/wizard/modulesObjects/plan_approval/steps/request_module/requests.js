import { printHost, filesHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl, backEndUrlforMap } from "imports/config";
import { get, remove, values } from "lodash";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
import { Message } from "antd";
import { plan_approval_fields } from "./reqFields";
// import main from "../../../../../inputs/fields/calculator/main";
// import { tree } from "d3-hierarchy";
import {
  convertToArabic,
  localizeNumber,
  remove_duplicate,
  checkImage,
} from "../../../../../inputs/fields/identify/Component/common/common_func";

export default {
  label: "المتطلبات النظامية",
  preSubmit(values, currentStep, props) {
    let data = get(values, "attachments.table_attachments", []).map((d) => d);
    let dataAdded = get(values, "attachments.table_attachments", []).map(
      (d) => d.added
    );
    let dataName = get(values, "attachments.table_attachments", []).map(
      (d) => d.name
    );

    let fa7s = get(values, "attachments.table_attachments", [])
      .filter((d) => d.id == 4)
      .map((x) => x.fa7s)[0];
    let reqFields = [...dataName, "فحص التربة"];
    console.log(dataAdded, fa7s);
    return new Promise(function (resolve, reject) {
      if (dataAdded.includes(false)) {
        //   reqFields.map((d) => Message.error(`من فضلك قم بادخال ${d}`));
        //   // throw "error in land selection"
        //   reject();
        // } else if (Object.keys(fa7s).length == 0) {
        //   Message.error(`من فضلك قم بادخال فحص التربة`);
        data
          .filter((x) => x.added == false)
          .map((d) => Message.error(`من فضلك قم بادخال ${d.name}`));
        // throw "error in land selection"
        reject();
        // } else if (Object.keys(fa7s).length == 0) {
        //   Message.error(`من فضلك قم بادخال فحص التربة`);
      } else {
        resolve(values);
      }
    });
  },
  sections: {
    requests: {
      label: "المتطلبات النظامية",
      type: "inputs",
      fields: {
        attachment_img: {
          label: "صورة من الفكرة التخطيطية للمخططات المجاورة",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*",
          multiple: false,
          required: true,
          maxNumOfFiles: 1,
        },
        attachment_cad: {
          label: "ملف الكاد من الفكرة التخطيطية للمخططات المجاورة",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".dwg,.DWG",
          multiple: false,
          required: true,
          maxNumOfFiles: 1,
        },
        service_domains: {
          label: "نطاقات التخديم",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          requried: true,
        },
        m7dar_papers_delivery: {
          label: "محضر تسليم أوراق المعاملة",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          requried: true,
        },
      },
    },

    attachments: {
      field: "list",
      // type: "inputs",
      className: "modal-table",
      label: "المرفقات",
      init_data: (values, props, fields) => {
        let mainObject = props["mainObject"];
        let combinedData = [
          {
            id: 1,
            name: "طلب المالك أو الوكيل موقع ومصدق من المكتب	",
            added: false,
          },
          {
            id: 2,
            name: " تعهد من المالك بصحة البيانات مصدق من المكتب ",
            added: false,
          },
          {
            id: 3,
            name: " نسخة من الكروكي المساحي والرفع المساحي لموقع الأرض",
            added: false,
          },
          {
            id: 4,
            name: "تقرير دراسة فحص التربة للموقع	",
            added: false,
            fa7s: {},
          },
          {
            id: 5,
            name: "تقرير الدراسة الهيدرولوجية للموقع	",
            added: true,
          },
          {
            id: 6,
            name: "وزارة الطاقة",
            added: false,
          },
          {
            id: 7,
            name: "سريان مفعول الصك الورقي",
            added: false,
          },
          {
            id: 8,
            name: "   موافقة وزارة الصناعة والثروة المعدنية	",
            added: false,
          },
        ];
        let combinedData2 = [
          ...combinedData,
          {
            id: 9,
            name: "موافقة هيئة المدن الصناعية",
            added: false,
          },
          {
            id: 10,
            name: "دراسة تقييم الأثر البيئي للمخططات الصناعية",
            added: false,
          },
        ];
        let combinedData3 = [
          ...combinedData,
          {
            id: 11,
            name: "تقرير الدراسة المرورية",
            added: false,
          },
          {
            id: 12,
            name: "موافقة الجهات ذات العلاقة",
            added: false,
          },
          {
            id: 13,
            name: "موافقة وزارة الزراعة",
            added: false,
          },
        ];
        let combinedMostafedSpecial = [
          {
            id: 14,
            name: "تصميم الأرصفة والشوارع",
            added: false,
          },
        ];
        let mostafed_type = get(
          mainObject,
          "submission_data.mostafed_data.mostafed_type",
          ""
        );
        let mo5tatUse = get(
          mainObject,
          "submission_data.mostafed_data.mo5tat_use",

          ""
        ).split(".")[0];
        let table_data = get(
          mainObject,
          "requests.attachments.table_attachments",
          []
        );

        if (table_data.length == 0) {
          setTimeout(() => {
            if (mo5tatUse == "سكني" && mostafed_type == "حكومي") {
              props.change("attachments.table_attachments", combinedData);

              // props.change("attachments.table_attachments.fixedData", 2);
            } else if (mo5tatUse == "صناعي" && mostafed_type == "حكومي") {
              props.change("attachments.table_attachments", combinedData2);
            } else if (mo5tatUse == "حكومي" && mostafed_type == "حكومي") {
              props.change("attachments.table_attachments", combinedData);
            } else if (mo5tatUse == "استثماري" && mostafed_type == "حكومي") {
              props.change("attachments.table_attachments", combinedData);
            } else if (mo5tatUse == "سكني" && mostafed_type == "خاص") {
              props.change("attachments.table_attachments", [
                ...combinedData,
                ...combinedMostafedSpecial,
              ]);
            } else if (mo5tatUse == "صناعي" && mostafed_type == "خاص") {
              props.change("attachments.table_attachments", [
                ...combinedData2,
                ...combinedMostafedSpecial,
              ]);
            } else if (mo5tatUse == "زراعي" && mostafed_type == "خاص") {
              props.change("attachments.table_attachments", [
                ...combinedData3,
                ...combinedMostafedSpecial,
              ]);
            } else if (mo5tatUse == "تجاري" && mostafed_type == "خاص") {
              props.change("attachments.table_attachments", [
                ...combinedData,
                ...combinedMostafedSpecial,
              ]);
            } else if (mo5tatUse == "خدمات عامة" && mostafed_type == "خاص") {
              props.change("attachments.table_attachments", [
                ...combinedData,
                ...combinedMostafedSpecial,
              ]);
            } else if (
              mo5tatUse == "مركز تجارة و أعمال" &&
              mostafed_type == "خاص"
            ) {
              props.change("attachments.table_attachments", [
                ...combinedData,
                ...combinedMostafedSpecial,
              ]);
            } else if (mo5tatUse == "أسواق جملة" && mostafed_type == "خاص") {
              props.change("attachments.table_attachments", [
                ...combinedData,
                ...combinedMostafedSpecial,
              ]);
            }

            console.log("d", mo5tatUse, combinedData);
          }, 1000);
        } else {
          props.change("attachments.table_attachments", table_data);
        }
      },

      fields: {
        add_attachment: {
          field: "button",
          hideLabel: true,
          text: "إضافة",
          action: {
            type: "custom",
            action(props, stepItem) {
              console.log("stem", stepItem);
              const fields = get(plan_approval_fields, "1", {});
              props.setMain("Popup", {
                popup: {
                  type: "create",
                  childProps: {
                    fields,
                    ok(values) {
                      let data =
                        props?.mainValues ||
                        props?.values?.table_attachments ||
                        [];
                      values.id = 1;
                      if (data.length > 0 && data[data.length - 1].id) {
                        values.id = data[data.length - 1].id + 1;
                      }
                      props.change("attachments.table_attachments", [
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
        table_attachments: {
          // label: "Representer Data",
          hideLabel: true,
          field: "list",
          moduleName: "requests",
          inline: true,
          value_key: "table_attachments",
          fields: {
            name: { head: "اسم المرفق" },
            number: { head: "الرقم" },
            date: { head: "التاريخ" },
            // image: { head: "المرفقات" },
            actions: {
              type: "actions",
              head: "",
              actions: {
                add: {
                  text: "إضافة",
                  action(props, d, step) {
                    const fields = get(plan_approval_fields, "2", {});
                    let data =
                      props?.mainValues ||
                      props?.values?.table_attachments ||
                      [];

                    props.setMain("Popup", {
                      popup: {
                        type: "create",
                        childProps: {
                          fields,
                          initialValues: d,
                          // filter: {edit: true},
                          ok(values, stepItem) {
                            let ArrId = data.find(
                              (d) => d.id == values["id"]
                            ).id;
                            values["added"] = true;

                            let newDataFiltered = data.filter(
                              (d) => d.id != ArrId
                            );
                            let dataCust = [...newDataFiltered, values];
                            let dataArranged = dataCust.sort(
                              (a, b) => a.id - b.id
                            );

                            props.change(
                              "attachments.table_attachments",
                              dataArranged
                            );
                            // console.log("dop", a5ra);
                            return Promise.resolve(true);
                          },
                        },
                      },
                    });
                  },

                  permissions: {
                    // show_every: ["attachments.changeValue"],
                    hide_every: ["image_motlbat"],
                  },
                  // icon: "edit-pen",
                  className: "btn btn-success",
                },
                show: {
                  className: "btn follow",
                  permissions: {
                    show_every: ["image_motlbat"],
                  },

                  text: "عرض",
                  action(props, d) {
                    // image_motlbat[0].data
                    props.setMain("Popup", {
                      popup: {
                        type: "confirm",
                        imageModal: true,
                        imgUrl: remove_duplicate(d.image_motlbat[0].data)
                          ? remove_duplicate(d.image_motlbat[0].data)
                          : remove_duplicate(d.image_motlbat),
                      },
                    });
                  },
                },

                edit: {
                  permissions: {
                    show_every: ["image_motlbat"],
                  },
                  className: "btn follow",
                  text: "Edit",
                  action(props, d) {
                    const fields = get(plan_approval_fields, "2", {});
                    props.setMain("Popup", {
                      popup: {
                        type: "create",
                        childProps: {
                          fields,
                          initialValues: d,
                          // filter: {edit: true},
                          ok(values) {
                            // const id = values["id"];
                            let data =
                              props?.mainValues ||
                              props?.values?.table_attachments ||
                              [];
                            let Index = data.findIndex(
                              (d) => d.id == values["id"]
                            );
                            window.id = data[Index].id;

                            data[Index] = values; // let newData = data.filter((d) => d.id != ArrId);
                            props.change("attachments.table_attachments", data);
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
                delete: {
                  permissions: {
                    show_every: ["image_motlbat"],
                  },
                  text: "Delete",
                  className: "btn follow",
                  icon: "delete",
                  action(props, d, stepItem) {
                    let attachs =
                      props?.mainValues ||
                      props?.values?.table_attachments ||
                      [];
                    let index = attachs.findIndex(
                      (deleteRow) => deleteRow.id == d.id
                    );
                    delete d.image_motlbat;
                    delete d.date;
                    if (d.number) delete d.number;
                    attachs[index] = d;
                    props.change("attachments.table_attachments", attachs);
                  },
                },
                fa7s: {
                  className: "btn follow",
                  permissions: {
                    show_match_id: ["4"],
                  },

                  text: "تفاصيل تقرير فحص التربة",
                  action(props, d) {
                    const fields = get(plan_approval_fields, "4", {});
                    let mainValues = props["mainValues"].filter(
                      (d) => d.id == 4
                    )[0];
                    props.setMain("Popup", {
                      popup: {
                        type: "create",
                        // imageModal: true,
                        // imgUrl: host + "/" + d["image"],
                        childProps: {
                          fields,
                          initialValues: d["fa7s"],
                          // filter: {edit: true},
                          ok(values) {
                            mainValues["fa7s"] = values;
                            // props.change("fa7s", [values]);
                            return Promise.resolve(true);
                          },
                        },
                      },
                    });
                  },
                },
              },
            },
          },
          required: true,
        },
      },
    },
  },
};
