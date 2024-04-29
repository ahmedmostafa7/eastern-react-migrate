import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { plan_approval_fields } from "./reqFields";
import { message } from "antd";
import { get, isEmpty, reject } from "lodash";
import {
  convertToArabic,
  convertToArabicToMap,
  convertToEnglish,
} from "../../../../inputs/fields/identify/Component/common";
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
    const { t } = props;
    return new Promise(function (resolve, reject) {
      let mainObject = props.mainObject;
      let parcels = get(mainObject, "landData.landData.lands.parcels", []);

      if (
        parcels.filter(
          (parcel) =>
            Object.values(get(values, "sakData.saks", {})).filter(
              (sak) =>
                !sak.lands ||
                (sak.lands &&
                  sak.lands
                    .split(",")
                    .indexOf(parcel.attributes.PARCEL_PLAN_NO) == -1)
            ).length > 0
        ).length
      ) {
        window.notifySystem("error", "اختبار", 10);
        return reject();
      }
      return resolve(values);
    });
  },
  sections: {
    sakData: {
      init_data: (values, props, fields) => {
        let lands = checkLands(props);
        setTimeout(() => {
          props.setSelector("sakData.data", lands);
          props.setSelector("lands.data", lands);
          // props.change("lands", lands);
        }, 1000);
      },
      className: "waseka_des",
      type: "inputs",
      label: "بيانات وثيقة الملكية",

      fields: {
        waseka_data_select: {
          field: "select",
          show: "waseka_data_select",
          moduleName: "sakData",
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
                    //initialValues: { lands: d["waseka_data_select"] },
                    childProps: {
                      fields,
                      initialValues: { lands: d["waseka_data_select"] },
                      ok(values) {
                        let data = [];
                        if (props["values"]["saks"]) {
                          data = props.values.saks;
                          // data.flatMap(x=>x.lands=)
                        }
                        let land_exist = data.filter(
                          (d, k) => d.lands == values.lands
                        );

                        if (Array.isArray(values.lands)) {
                          let landsObj = values.lands.map((d) => {
                            return { ...values, lands: d };
                          });

                          landsObj = {
                            ...values,
                            lands: values.lands.join(","),
                          };

                          let landsObj_land_exist = data.filter((d) =>
                            values.lands.includes(d.lands)
                          );
                          if (landsObj_land_exist.length > 0) {
                            landsObj_land_exist.map((d) => {
                              message.error(
                                `تم إضافة  وثيقة  خاصه بهذه الأرض ${d.lands} من قبل`
                              );
                            });
                          } else {
                            let concatenatedLands = data.concat(landsObj);
                            props.change("sakData.saks", concatenatedLands);
                          }
                        } else {
                          if (land_exist.length > 0) {
                            message.error(
                              `تم إضافة  وثيقة ملكية  خاصه بهذه الأرض ${land_exist[0].lands} من قبل`
                            );
                          } else {
                            props.change("sakData.saks", [...data, values]);
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

        saks: {
          label: "بيانات وثيقة الملكية",
          hideLabel: true,
          field: "list",
          fields: {
            lands: { head: "رقم قطعة الارض " },
            number: { head: "رقم وثيقة الملكية" },
            issuer: { head: "جهة إصدار وثيقة الملكية " },

            actions: {
              type: "actions",
              head: "",
              actions: {
                delete: {
                  text: "Delete",
                  className: " btn btn-danger ",
                  icon: "delete",
                  action(props, d, stepItem) {
                    let filteredWas = (
                      (Array.isArray(props["mainValues"]) &&
                        props["mainValues"]) ||
                      Object.values(props["mainValues"])
                    ).filter((x) => x != d);
                    props.change("sakData.saks", filteredWas);
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
