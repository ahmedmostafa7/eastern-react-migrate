import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { plan_approval_fields } from "./reqFields";
import { get } from "lodash";
import { message } from "antd";
const checkWasekaLands = (props) => {
  let mainObject = props["mainObject"];
  let parcels = get(mainObject, "landData.landData.lands.parcels", []).reduce(
    (a, b) => {
      a = [...a, ...b.selectedLands];
      return a;
    },
    []
  );

  return parcels.map((d, index) => ({
    id:
      (parcels.filter(
        (land) => land.attributes["PLAN_NO"] == d.attributes["PLAN_NO"]
      ).length == parcels.length &&
        d.attributes["PARCEL_PLAN_NO"]) ||
      d.attributes["PLAN_NO"] ||
      index + 1,
    name: d.attributes["PARCEL_PLAN_NO"],
  }));
};
export default {
  label: "وثيقة الملكية",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      let selectedlands = checkWasekaLands(props);
      let tableData = values?.waseka?.table_waseka;
      if (selectedlands.length > tableData.length) {
        message.error(" من فضلك ادخل صكوك الملكية لجميع قطع الأراضي");
        reject();
      } else {
        resolve(values);
      }
    });
  },
  sections: {
    waseka: {
      init_data: (values, props, fields) => {
        let selectedLands = checkWasekaLands(props);
        setTimeout(() => {
          let data = {
            label_key: "name",
            value_key: "id",
            data: [...selectedLands],
          };
          props.setSelector("waseka_data_select", data);
          props.setSelector("waseka_selectedLands", data);
        }, 1000);
      },
      className: "waseka_des",
      type: "inputs",
      label: "بيانات وثيقة الملكية",

      fields: {
        waseka_data_select: {
          field: "select",
          show: "waseka_data_select",
          moduleName: "waseka_data_select",
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
              const fields = get(plan_approval_fields, "3", {});
              props.setMain("Popup", {
                popup: {
                  type: "create",
                  initialValues: { selectedLands: d["waseka_data_select"] },
                  childProps: {
                    fields,
                    initialValues: { selectedLands: d["waseka_data_select"] },
                    ok(values) {
                      //
                      let data = [];
                      if (get(props["values"], "table_waseka", null)) {
                        data = props.values.table_waseka;
                        // data.flatMap(x=>x.selectedLands=)
                      }
                      //
                      if (Array.isArray(values.selectedLands)) {
                        let landsObj_land_exist = data.filter(
                          (d) =>
                            values.selectedLands.includes(d.selectedLands) ||
                            values.selectedLands.includes(d.id)
                        );
                        if (landsObj_land_exist.length > 0) {
                          landsObj_land_exist.map((d) => {
                            message.error(
                              `تم إضافة  وثيقة  خاصه بهذه الأرض ${d.selectedLands} من قبل`
                            );
                          });
                        } else {
                          let landsObj = values.selectedLands.map((d) => {
                            return {
                              ...values,
                              selectedLands: props.selectors.waseka.data.find(
                                (item) => item.id == d
                              )?.name,
                              id: d,
                            };
                          });
                          let concatenatedLands = data.concat(landsObj);
                          props.change(
                            "waseka.table_waseka",
                            concatenatedLands
                          );
                        }
                      } else {
                        let land_exist = data.filter(
                          (d, k) =>
                            d.selectedLands == values.selectedLands ||
                            d.id == values.selectedLands
                        );
                        if (land_exist.length > 0) {
                          message.error(
                            `تم إضافة  وثيقة ملكية  خاصه بهذه الأرض ${land_exist[0].selectedLands} من قبل`
                          );
                        } else {
                          //
                          props.change("waseka.table_waseka", [
                            ...data,
                            {
                              ...values,
                              selectedLands:
                                props.selectors.waseka_data_select.data.find(
                                  (item) => values.selectedLands == item.id
                                )?.name,
                              id: values.selectedLands,
                            },
                          ]);
                        }
                      }
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
          label: "بيانات وثيقة الملكية",
          hideLabel: true,
          field: "list",
          fields: {
            selectedLands: { head: "رقم قطعة الارض " },
            number_waseka: { head: "رقم وثيقة الملكية" },
            waseka_search: { head: "جهة إصدار وثيقة الملكية " },

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
