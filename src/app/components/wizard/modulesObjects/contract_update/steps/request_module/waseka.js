import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { plan_approval_fields } from "./reqFields";
import applyFilters from "main_helpers/functions/filters";
import { get } from "lodash";
import {
  convertToArabic,
  selectMainObject,
} from "../../../../../inputs/fields/identify/Component/common";
const actionFn = {
  type: "custom",
  action(props, d, stepItem) {
    const { t, mainObject, values, setSelector } = props;

    let parcels = get(mainObject, "landData.landData.lands.parcels", []);
    let selectedLands = parcels.map((d) => d.attributes["PARCEL_PLAN_NO"]);

    let wasekaParcels = get(values, "table_waseka", []) || [];
    let wasekaSelectedLands = wasekaParcels?.map((d) => d.selectedLands);

    if (["1", "3"].indexOf(d.sakType) != -1) {
      if (d["waseka_data_select"].length == wasekaSelectedLands.length) {
        window.notifySystem("error", t("messages:PARCEL_ALL_UNIQUE"));
        return;
      } else if (
        d["waseka_data_select"].length != wasekaSelectedLands.length &&
        wasekaSelectedLands.length > 0
      ) {
        window.notifySystem("error", t("messages:MUSTRESETALLLANDS"));
        return;
      }
      if (d["waseka_data_select"].length != selectedLands.length) {
        window.notifySystem("error", t("messages:MUSTSELECTALLLANDS"));
        return;
      }
    } else if (d.sakType == "2") {
      if (!d["waseka_data_select"]) {
        window.notifySystem("error", t("messages:MUSTSELECTONELAND"));
        return;
      }
      if (
        wasekaSelectedLands.filter(
          (parcelNo) => +parcelNo == +d["waseka_data_select"]
        ).length
      ) {
        window.notifySystem("error", t("messages:PARCEL_UNIQUE"));
        return;
      }
    }

    let landNumbers =
      (props.values.sakType == "4" &&
        Array.isArray(d["waseka_data_select"]) &&
        d["waseka_data_select"].length &&
        d["waseka_data_select"].filter(
          (land) =>
            props.values.table_waseka.filter((sak) => sak.selectedLands == land)
              .length == 0
        )) ||
      d["waseka_data_select"];

    if (
      props.values.sakType == "4" &&
      props.values.table_waseka.length &&
      !landNumbers.length
    ) {
      window.notifySystem("error", t("messages:SakExists"));
      return;
    } else if (!wasekaParcels.length && !landNumbers.length) {
      window.notifySystem("error", t("messages:required"));
    }

    if (d == null) {
      message.error("من");
    }
    console.log("stem", stepItem);
    const fields = { ...get(plan_approval_fields, "3", {}) };
    props.setMain("Popup", {
      popup: {
        type: "create",
        // initialValues: {
        //   selectedLands: landNumbers,
        // },
        childProps: {
          fields,
          initialValues: { selectedLands: landNumbers },
          ok(values) {
            //
            let data = [];
            if (props["values"]["table_waseka_fullList"]) {
              data = props["values"]["table_waseka_fullList"];
            }

            let newItems =
              (typeof values.selectedLands != "string" &&
                Array.isArray(values.selectedLands) && [
                  ...values.selectedLands.map((land) => {
                    return { ...values, selectedLands: land };
                  }),
                ]) ||
              (typeof values.selectedLands == "string" && [{ ...values }]);

            props.change("waseka.table_waseka", [...newItems]);
            props.change("waseka.table_waseka_fullList", [
              ...data,
              ...newItems,
            ]);
            return Promise.resolve(true);
          },
        },
      },
    });
  },
};
export default {
  label: "وثيقة الملكية",
  preSubmit(values, currentStep, props) {
    const { t } = props;
    return new Promise(function (resolve, reject) {
      let mainObject = props.mainObject;
      // let parcels = get(mainObject, "landData.landData.lands.parcels", []);
      if (
        ["1", "3"].indexOf(
          mainObject?.update_contract_submission_data
            ?.update_contract_submission_data?.sakType
        ) != -1
      ) {
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

        if (wasekaNumber_invalid) {
          window.notifySystem(
            "error",
            convertToArabic(
              "لابد أن تكون أرقام وثيقة الملكية بطول كل صك 12 خانة"
            )
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
      }
      return resolve(values);
    });
  },
  sections: {
    waseka: {
      className: "waseka_des",
      type: "inputs",
      label: "بيانات وثيقة الملكية",

      fields: {
        table_waseka: {
          // label: "Representer Data",
          moduleName: "table_waseka",
          hideLabel: true,
          field: "list",
          init_data: (values, props) => {
            //if (!props.input.value) {
            let mainObject = selectMainObject(props);
            if (mainObject?.waseka) {
              mainObject.waseka.waseka.table_waseka =
                mainObject.waseka.waseka.table_waseka.map((r) => ({
                  ...r,
                  image_waseka: (Array.isArray(r.image_waseka) &&
                    r.image_waseka) || [r.image_waseka],
                }));
              props.input.onChange(mainObject.waseka.waseka.table_waseka);
            }
            //}
            // else {

            // }
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
                          initialValues: { ...d },
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
