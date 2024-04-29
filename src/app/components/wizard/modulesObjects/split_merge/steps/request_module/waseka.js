import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { plan_approval_fields } from "./reqFields";
import { message } from "antd";
import { get, isEmpty } from "lodash";
import {
  checkWasekaLands,
  convertToArabic,
  selectMainObject,
} from "../../../../../inputs/fields/identify/Component/common/common_func";
export default {
  label: "وثيقة الملكية",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      let wasekaNumber_invalid = false;
      let wasekaNumber_specialChar_invalid = false;
      values.waseka.table_waseka.forEach((row) => {
        if (row.number_waseka.length != 12 && !wasekaNumber_invalid) {
          wasekaNumber_invalid = true;
        }

        if (
          specialChars.test(row.number_waseka) &&
          !wasekaNumber_specialChar_invalid
        ) {
          wasekaNumber_specialChar_invalid = true;
        }
      });

      let skok_numbers = values.waseka.table_waseka
        .map(
          (r) => r.number_waseka // r.selectedLands.split(",").length > 1
        )
        .reduce((a, b) => {
          if (!a.filter((r) => r == b).length) {
            a.push(b);
          }

          return a;
        }, []);

      if (
        skok_numbers.filter(
          (s) =>
            values.waseka.table_waseka.filter((r) => r.number_waseka == s)
              .length > 1
        ).length &&
        props.mainObject.tadkek_data_Msa7y.tadkek_msa7yData.requestType == 2
      ) {
        window.notifySystem(
          "error",
          convertToArabic("عذرا، لا يمكن ادخال صك واحد لأكثر من قطعة أرض")
        );
        return reject();
      }

      if (wasekaNumber_invalid) {
        window.notifySystem(
          "error",
          convertToArabic("لابد أن تكون أرقام وثيقة الملكية بطول كل صك 12 خانة")
        );
        return reject();
      }

      if (wasekaNumber_specialChar_invalid) {
        window.notifySystem(
          "error",
          "يجب أن يكون رقم وثيقة الملكية عبارة عن أرقام فقط"
        );
        return reject();
      }

      return resolve(values);
    });
  },
  sections: {
    waseka: {
      // init_data: (values, props, fields) => {
      //   let mainObject = props["mainObject"];
      //   let selectedLands = checkWasekaLands(props);
      //   if (
      //     typeof mainObject?.waseka?.waseka?.waseka_data_select == "object" &&
      //     isEmpty(mainObject?.waseka?.waseka?.waseka_data_select)
      //   ) {
      //     mainObject.waseka.waseka.waseka_data_select = selectedLands[0].id;
      //   }
      //   props.setSelector("waseka", {
      //     data: selectedLands,
      //   });
      //   props.change(
      //     "waseka.waseka_data_select",
      //     typeof mainObject?.waseka?.waseka?.waseka_data_select == "object" &&
      //       isEmpty(mainObject?.waseka?.waseka?.waseka_data_select)
      //       ? selectedLands[0].id
      //       : mainObject?.waseka?.waseka?.waseka_data_select
      //   );

      //   setTimeout(() => {
      //     props.setSelector("selectedLands", selectedLands);
      //     props.change("selectedLands", selectedLands);
      //   }, 1000);
      // },
      className: "waseka_des",
      type: "inputs",
      label: "بيانات وثيقة الملكية",

      fields: {
        // waseka_data_select: {
        //   field: "select",
        //   show: "waseka_data_select",
        //   moduleName: "waseka",
        //   label: " الأراضي المختارة  ",
        //   label_key: "name",
        //   value_key: "id",
        // },
        // add_waseka: {
        //   field: "button",
        //   hideLabel: true,
        //   permissions: {
        //     // show_every: ["attachments.changeValue"],
        //     show_every: ["waseka_data_select"],
        //   },
        //   text: "إضافة وثيقة",
        //   action: {
        //     type: "custom",
        //     action(props, d, stepItem) {
        //       if (Object.keys(d).length === 0) {
        //         message.error(" من فضلك اختر رقم قطعة الأرض");
        //       } else {
        //         console.log("stem", stepItem);
        //         const fields = get(plan_approval_fields, "3", {});
        //         props.setMain("Popup", {
        //           popup: {
        //             type: "create",
        //             initialValues: { selectedLands: d["waseka_data_select"] },
        //             childProps: {
        //               fields,
        //               initialValues: { selectedLands: d["waseka_data_select"] },
        //               ok(values) {
        //                 let data = [];
        //                 if (props["values"]["table_waseka"]) {
        //                   data = props.values.table_waseka;
        //                   // data.flatMap(x=>x.selectedLands=)
        //                 }
        //                 let land_exist = data.filter(
        //                   (d, k) => d.selectedLands == values.selectedLands
        //                 );

        //                 if (Array.isArray(values.selectedLands)) {
        //                   let landsObj = values.selectedLands.map((d) => {
        //                     return { ...values, selectedLands: d };
        //                   });
        //                   let landsObj_land_exist = data.filter((d) =>
        //                     // d.selectedLands ==
        //                     values.selectedLands.includes(d.selectedLands)
        //                   );
        //                   if (landsObj_land_exist.length > 0) {
        //                     landsObj_land_exist.map((d) => {
        //                       message.error(
        //                         `تم إضافة  وثيقة  خاصه بهذه الأرض ${d.selectedLands} من قبل`
        //                       );
        //                     });
        //                   } else {
        //                     let concatenatedLands = data.concat(landsObj);
        //                     props.change(
        //                       "waseka.table_waseka",
        //                       concatenatedLands
        //                     );
        //                   }
        //                 } else {
        //                   if (land_exist.length > 0) {
        //                     message.error(
        //                       `تم إضافة  وثيقة ملكية  خاصه بهذه الأرض ${land_exist[0].selectedLands} من قبل`
        //                     );
        //                   } else {
        //                     props.change("waseka.table_waseka", [
        //                       ...data,
        //                       values,
        //                     ]);
        //                   }
        //                 }
        //                 return Promise.resolve(true);
        //               },
        //             },
        //           },
        //         });
        //       }
        //     },
        //   },
        // },

        table_waseka: {
          // label: "Representer Data",
          moduleName: "table_waseka",
          hideLabel: true,
          field: "list",
          init_data: (values, props) => {
            // if (!props.input.value.length) {
            let mainObject = selectMainObject(props);

            props.input.onChange(
              mainObject?.waseka?.waseka?.table_waseka || []
            );
            //}
          },
          fields: {
            selectedLands: { head: "أرقام قطع الأراضي" },
            number_waseka: { head: "رقم وثيقة الملكية" },
            date_waseka: { head: "تاريخ الإصدار" },
            waseka_search: { head: "جهة إصدار وثيقة الملكية " },
            actions: {
              type: "actions",
              head: "",
              actions: {
                // delete: {
                //   text: "Delete",
                //   className: " btn btn-danger ",
                //   icon: "delete",
                //   action(props, d, stepItem) {
                //     const values = applyFilters({
                //       key: "FormValues",
                //       form: "stepForm",
                //     });

                //     let filteredWas = values?.waseka?.table_waseka?.filter(
                //       (x) => x.selectedLands != d.selectedLands
                //     );
                //     props.change("waseka.table_waseka", filteredWas);

                //     // let filteredWasFullList =
                //     //   values?.waseka?.table_waseka_fullList?.filter(
                //     //     (x) => x.selectedLands != d.selectedLands
                //     //   );
                //     // props.change(
                //     //   "waseka.table_waseka_fullList",
                //     //   filteredWasFullList
                //     // );
                //   },
                // },
                edit: {
                  text: "Edit",
                  className: "btn btn-warning",
                  icon: "edit",
                  action(props, d, stepItem) {
                    let index = props.mainValues.findIndex(
                      (r) => r.selectedLands == d.selectedLands
                    );
                    const fields = { ...get(plan_approval_fields, "3", {}) };
                    props.setMain("Popup", {
                      popup: {
                        type: "create",
                        childProps: {
                          fields,
                          initialValues: { ...props.mainValues[index] },
                          ok(values) {
                            props.mainValues[index] = values;
                            props.change("waseka.table_waseka", [
                              ...props.mainValues,
                            ]);
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
          // required: true,
        },
      },
    },
  },
};
