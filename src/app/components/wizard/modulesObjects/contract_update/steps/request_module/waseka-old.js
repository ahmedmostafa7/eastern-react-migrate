import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
import { plan_approval_fields } from "./reqFields";
import applyFilters from "main_helpers/functions/filters";
import { get } from "lodash";
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
      let mainObject = props["mainObject"];
      let parcels = get(mainObject, "landData.landData.lands.parcels", []);

      if (["1", "3"].indexOf(values.waseka.sakType) != -1) {
        if (
          (values.waseka.waseka_data_select.length !=
            values.waseka.table_waseka.length &&
            values.waseka.table_waseka.length > 0) ||
          !values.waseka.table_waseka.length
        ) {
          window.notifySystem("error", t("messages:MUSTSELECTALLLANDS"));
          return reject();
        }
      }
      if (values.waseka.sakType == "4") {
        let selectedLands = parcels.map((d) => d.attributes["PARCEL_PLAN_NO"]);
        if (selectedLands.length != values.waseka.table_waseka.length) {
          window.notifySystem("error", t("messages:MUSTSELECTALLLANDS"));
          return reject();
        }
      }
      if (values.waseka.sakType == "2") {
        if (values.waseka.table_waseka_fullList?.length != parcels.length) {
          window.notifySystem("error", "يجب ادخال صك لكل أرض من أراضي المدخلة");
          return reject();
        }
        // values.waseka.table_waseka_temp =
        //   props.selectors?.table_waseka?.table_waseka_temp;
      }

      return resolve(values);
    });
  },
  sections: {
    waseka: {
      init_data: (values, props, fields) => {
        let mainObject = props["mainObject"];
        let parcels = get(mainObject, "landData.landData.lands.parcels", []);
        let selectedLands = parcels.map((d) => d.attributes["PARCEL_PLAN_NO"]);
        console.log("sa2saa", mainObject, parcels, selectedLands);

        let options = [
          {
            label: "فرز صك",
            value: "1",
          },
          {
            label: "تعديل بيانات الصك",
            value: "3",
          },
          {
            label: "تحديث صك ورقي",
            value: "4",
          },
        ];

        if (parcels.length > 1) {
          options.splice(1, 0, {
            label: "دمج صكوك",
            value: "2",
          });
        }

        props.setSelector("sakType", {
          options: options,
        });

        setTimeout(() => {
          let sakType =
            get(values, "sakType", undefined) ||
            get(mainObject, "waseka.waseka.sakType", undefined) ||
            "1";
          // if (!sakType || (sakType && ["1", "3"].indexOf(sakType) != -1)) {
          //   props.change("waseka.waseka_data_select", [...selectedLands]);
          // } else {
          //   props.setSelector("table_waseka", {
          //     table_waseka_temp:
          //       mainObject?.waseka?.waseka?.table_waseka_temp || [],
          //   });
          // }
          props.change(
            "waseka.waseka_data_select",
            (sakType &&
              ["1", "3"].indexOf(sakType) != -1 && [...selectedLands]) ||
              get(mainObject, "waseka.waseka.waseka_data_select", null)
          );
          props.setSelector("waseka_data_select", {
            data: [...selectedLands],
            isMulti:
              !sakType || (sakType && ["1", "3", "4"].indexOf(sakType) != -1),
          });
          props.change("selectedLands", [...selectedLands]);
        }, 1000);
      },
      className: "waseka_des",
      type: "inputs",
      label: "بيانات وثيقة الملكية",

      fields: {
        sakType: {
          label: "نوع الوثيقة",
          className: "sakType",
          required: true,
          initValue: "1",
          field: "radio",
          options: [],
          moduleName: "sakType",
          onClick: (evt, props) => {
            const {
              input: { onChange },
              change,
              setSelector,
              mainObject,
            } = props;
            if (
              evt.target.value == "2" &&
              mainObject?.landData?.landData?.lands?.parcels?.length == 1
            ) {
              window.notifySystem(
                "error",
                "يجب اختيار أكثر من أرض لتفعيل خاصية دمج الصكوك"
              );
              return;
            }
            change("waseka.table_waseka", []);
            change("waseka.table_waseka_fullList", []);
            let parcels = get(
              mainObject,
              "landData.landData.lands.parcels",
              []
            );
            let selectedLands = parcels.map(
              (d) => d.attributes["PARCEL_PLAN_NO"]
            );
            if (["1", "3", "4"].indexOf(evt.target.value) != -1) {
              props.change("waseka.waseka_data_select", [...selectedLands]);
            } else {
              props.change("waseka.waseka_data_select", null);
            }
            setSelector("waseka_data_select", {
              data: [...selectedLands],
              isMulti: ["1", "3", "4"].indexOf(evt.target.value) != -1,
            });
            // setSelector("table_waseka", {
            //   table_waseka_temp: [],
            // });
            onChange(evt.target.value);
          },
        },
        waseka_data_select: {
          field: "switchSelect",
          // required: true,
          //allowClear: false,
          name: "waseka_data_select",
          moduleName: "waseka_data_select",
          deps: ["values.table_waseka"],
          label: " الأراضي المختارة  ",
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });

            return (
              (["1", "3"].indexOf(values.waseka.sakType) != -1 &&
                Boolean(get(values, "waseka.table_waseka.length", false))) ||
              false
            );
          },
          selectChange: (val, rec, props) => {
            let {
              values,
              selectors,
              input: { onChange },
            } = props;
            //
            // if (values?.sakType == "2") {
            //   let items = values?.table_waseka;
            //   props.change(
            //     "waseka.table_waseka",
            //     (items && [...items]) || null
            //   );
            // } else

            if (values?.sakType == "4") {
              if (!values?.table_waseka_fullList) {
                props.change("waseka.table_waseka_fullList", [
                  ...values?.table_waseka,
                ]);
              }
            }

            let full_list =
              values?.table_waseka_fullList || values?.table_waseka;
            props.change(
              "waseka.table_waseka",
              (full_list &&
                [...full_list].filter(
                  (item) => val.indexOf(item.selectedLands) != -1
                )) ||
                null
            );

            onChange(val);
          },
        },
        // waseka_data_select: {
        //   field: "select",
        //   required: true,
        //   name: "waseka_data_select",
        //   moduleName: "waseka_data_select",
        //   deps: ["values.table_waseka"],
        //   label: " الأراضي المختارة  ",
        //   permission: {
        //     show_if_props_equal: { key: "values.sakType", value: "2" },
        //   },
        // },
        add_waseka: {
          field: "button",
          hideLabel: true,
          text: "إضافة وثيقة",
          // deps: ["values.sakType"],
          // permission: {
          //   //show_if_props_equal: { key: "values.sakType", value: "2" },
          //   check_props_values: [
          //     { key: "values.sakType", value: ["1", "3"], equals: true },
          //   ],
          // },
          action: actionFn,
        },
        // ,
        // add_waseka2: {
        //   field: "button",
        //   hideLabel: true,
        //   text: "إضافة وثيقة",
        //   deps: [
        //     "values.sakType",
        //     "values.table_waseka",
        //     "values.waseka_data_select",
        //   ],
        //   permission: {
        //     show_if_props_equal: { key: "values.sakType", value: "2" },
        //     // show_every: ["waseka_data_select"],
        //     // hide_every: ["table_waseka"],
        //   },
        //   action: actionFn,
        // },
        table_waseka: {
          // label: "Representer Data",
          moduleName: "table_waseka",
          hideLabel: true,
          field: "list",
          fields: {
            selectedLands: { head: "أرقام قطع الأراضي" },
            number_waseka: { head: "رقم وثيقة الملكية" },
            date_waseka: { head: "تاريخ الإصدار" },
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
                    const values = applyFilters({
                      key: "FormValues",
                      form: "stepForm",
                    });

                    let filteredWas = values?.waseka?.table_waseka?.filter(
                      (x) => x.selectedLands != d.selectedLands
                    );
                    props.change("waseka.table_waseka", filteredWas);

                    let filteredWasFullList =
                      values?.waseka?.table_waseka_fullList?.filter(
                        (x) => x.selectedLands != d.selectedLands
                      );
                    props.change(
                      "waseka.table_waseka_fullList",
                      filteredWasFullList
                    );
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
