import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { plan_approval_fields } from "./reqFields";
import { get } from "lodash";
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
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("stem", stepItem);
              const fields = get(plan_approval_fields, "3", {});
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

                      props.change("waseka.table_waseka", [...data, values]);
                      return Promise.resolve(true);
                    },
                  },
                },
              });
            },
          },
        },

        table_waseka: {
          // label: "Representer Data",
          hideLabel: true,
          field: "list",
          fields: {
            waseka_search: { head: "جهة إصدار وثيقة الملكية " },
            number_waseka: { head: "رقم وثيقة الملكية" },

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
