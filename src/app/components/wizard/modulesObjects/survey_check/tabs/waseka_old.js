import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { plan_approval_fields } from "./reqFields";
import { message } from "antd";
import { get, isEmpty } from "lodash";
const checkLands = (props) => {
  let mainObject = props["mainObject"];
  let parcels = get(mainObject, "landData.landData.lands.parcels", []);
  return parcels.map((d) => {
    let fornattedParcelPlanNo =
      (d.attributes["PARCEL_PLAN_NO"].indexOf("/") > -1 &&
        d.attributes["PARCEL_PLAN_NO"]
          .split("/")
          .map((element) => element.trim())
          .join(" / ")) ||
      d.attributes["PARCEL_PLAN_NO"];
    return {
      id: fornattedParcelPlanNo,
      name: fornattedParcelPlanNo,
    };
  });
};
export default {
  label: "وثيقة الملكية",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      console.log(props);
      let selectedlands = checkLands(props);
      let tableData = values?.waseka?.table_waseka;
      if (selectedlands.length > tableData.length) {
        message.error(" من فضلك ادخل صكوك الملكية لجميع قطع الأراضي");
        reject();
      } else if (
        props?.mainObject?.landData?.landData?.lands?.selectedMoamlaType == 1 &&
        tableData.find(
          (x) =>
            x.number_waseka.indexOf("/") > -1 ||
            x.number_waseka.indexOf("\\") > -1
        )
      ) {
        message.error("عذرًا لا يمكن تقديم معاملات لأراضي ذات صكوك ورقية");
        reject();
      } else {
        resolve(values);
      }
    });
  },
  sections: {
    waseka: {
      init_data: (values, props, fields) => {
        let selectedLands = checkLands(props);
        setTimeout(() => {
          props.setSelector("waseka.data", selectedLands);
          props.setSelector("selectedLands", selectedLands);
          props.change("selectedLands", selectedLands);
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
          permissions: {
            // show_every: ["attachments.changeValue"],
            show_every: ["waseka_data_select"],
          },
          text: "إضافة وثيقة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              if (Object.keys(d).length === 0) {
                message.error(" من فضلك اختر رقم قطعة الأرض");
              } else {
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
                          data = props.values.table_waseka;
                          // data.flatMap(x=>x.selectedLands=)
                        }
                        let land_exist = data.filter(
                          (d, k) => d.selectedLands == values.selectedLands
                        );

                        if (Array.isArray(values.selectedLands)) {
                          let landsObj = values.selectedLands.map((d) => {
                            return { ...values, selectedLands: d };
                          });
                          let landsObj_land_exist = data.filter((d) =>
                            // d.selectedLands ==
                            values.selectedLands.includes(d.selectedLands)
                          );
                          if (landsObj_land_exist.length > 0) {
                            landsObj_land_exist.map((d) => {
                              message.error(
                                `تم إضافة  وثيقة  خاصه بهذه الأرض ${d.selectedLands} من قبل`
                              );
                            });
                          } else {
                            let concatenatedLands = data.concat(landsObj);
                            props.change(
                              "waseka.table_waseka",
                              concatenatedLands
                            );
                          }
                        } else {
                          if (land_exist.length > 0) {
                            message.error(
                              `تم إضافة  وثيقة ملكية  خاصه بهذه الأرض ${land_exist[0].selectedLands} من قبل`
                            );
                          } else {
                            props.change("waseka.table_waseka", [
                              ...data,
                              values,
                            ]);
                          }
                        }
                        return Promise.resolve(true);
                      },
                    },
                  },
                });
              }
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
