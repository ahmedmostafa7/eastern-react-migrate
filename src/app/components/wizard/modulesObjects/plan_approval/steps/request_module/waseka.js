import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { plan_approval_fields } from "./reqFields";
import { get } from "lodash";
import { message } from "antd";
export default {
  label: "وثيقة الملكية",
  sections: {
    waseka: {
      init_data: (values, props, fields) => {
        let mainObject = props["mainObject"];
        let parcels = get(mainObject, "landData.landData.lands.parcels", []);
        let selectedLands = parcels.map((d) => d.attributes["PARCEL_PLAN_NO"]);
        console.log("sa2saa", mainObject, parcels, selectedLands);
        setTimeout(() => {
          props.change("waseka.waseka_data_select", [selectedLands]);
          props.change("selectedLands", [selectedLands]);
        }, 1000);
      },
      className: "waseka_des",
      type: "inputs",
      label: "بيانات وثيقة الملكية",

      fields: {
        waseka_data_select: {
          field: "select",
          show: "waseka_data_select",
          moduleName: "waseka",
          label: " الأراضي المختارة  ",
          label_key: "name",
          value_key: "id",
        },
        add_waseka: {
          field: "button",
          hideLabel: true,
          text: "إضافة وثيقة",
          permissions: {
            // show_every: ["attachments.changeValue"],
            show_every: ["waseka_data_select"],
          },
          action: {
            type: "custom",
            action(props, d, stepItem) {
              if (d == null) {
                message.error("من");
              }
              console.log("stem", stepItem);
              //if (!d["table_waseka"]?.length) {
              const fields = get(
                plan_approval_fields,
                (props.currentModule.id == 108 && "5") || "3",
                {}
              );
              props.setMain("Popup", {
                popup: {
                  type: "create",
                  initialValues: { selectedLands: d["waseka_data_select"] },
                  childProps: {
                    fields,
                    initialValues: { selectedLands: d["waseka_data_select"] },
                    ok(values) {
                      let data = [];
                      if (props["values"]["table_waseka"]) {
                        data = props["values"]["table_waseka"];
                      }

                      props.change("waseka.table_waseka", [
                        ...data,
                        {
                          ...values,
                          number_waseka:
                            values.number_waseka ||
                            values.number_waseka_1 ||
                            values.number_waseka_2 ||
                            "",
                          date_waseka:
                            values.date_waseka ||
                            values.date_waseka_1 ||
                            values.date_waseka_2 ||
                            "",
                          image_waseka:
                            values.image_waseka ||
                            values.image_waseka_1 ||
                            values.image_waseka_2 ||
                            "",
                          waseka_search: values.waseka_search || "لا يوجد",
                          // name_waseka: values.name_waseka || "",
                          // selectedLands: values.selectedLands,
                        },
                      ]);
                      return Promise.resolve(true);
                    },
                  },
                },
              });
              // } else {
              //   message.error(`تم إضافة وثيقة ملكية  خاصة بهذه الأرض  من قبل`);
              // }
            },
          },
        },

        table_waseka: {
          // label: "Representer Data",
          hideLabel: true,
          field: "list",
          fields: {
            number_waseka: { head: "رقم الوثيقة" },
            waseka_search: { head: "جهة إصدار الوثيقة " },

            actions: {
              type: "actions",
              head: "",
              actions: {
                delete: {
                  text: "Delete",
                  className: " btn btn-danger ",
                  icon: "delete",
                  action(props, d, stepItem) {
                    let filteredWas = props["mainValues"].filter((x) => x != d);
                    props.change("waseka.table_waseka", filteredWas);
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
