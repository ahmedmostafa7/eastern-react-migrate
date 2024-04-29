import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import axios from "axios";
import {
  convertListToString,
  convertStringToList,
  plan_classes,
  getUrbans,
  ids,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
export default {
  label: "بدائل ضوابط تخطيط الأراضي",
  preSubmit(values, currentStep, props) {
    //return values

    return new Promise(function (resolve, reject) {
      let selectedValues = (props.formValues || values).bands_approval
        .band_number.selectedValues;
      if (
        (!Array.isArray(selectedValues) && !selectedValues) ||
        (Array.isArray(selectedValues) && !selectedValues.length)
      ) {
        window.notifySystem("error", "من فضلك اختر البدائل");
        return reject();
      }
      // throw "error in land selection"
      else {
        // props.actionVals.className = "next";
        return resolve(props.formValues || values);
      }
    });
  },
  sections: {
    bands_approval: {
      label: "بدائل ضوابط تخطيط الأراضي",
      className: "radio_det",
      fields: {
        urban: {
          moduleName: "urban",
          label: "النطاق العمراني",
          placeholder: "من فضلك اختر النطاق العمراني",
          field: "select",
          label_key: "name",
          value_key: "code",
          required: true,
          init: (props) => {
            if (props) {
              props.setSelector("urban", {
                data: getUrbans(props),
              });

              if (props.input && ids[props?.input?.value]) {
                props.input.onChange(ids[props?.input?.value]);
              }
            }
          },
          selectChange: (val, rec, props) => {
            String.prototype.build_url = function (data) {
              let ret = [];
              for (let d in data)
                ret.push(
                  encodeURIComponent(d) + "=" + encodeURIComponent(data[d])
                );
              if (ret.length) {
                return this + "?" + ret.join("&");
              } else {
                return this;
              }
            };

            if (ids[val]) {
              val = ids[val];
            }

            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            console.log(values);
            var boundaryCode = get(
              values,
              "bands_approval.band_number.boundary_code",
              0
            );

            let selectedBadl = get(
              props.mainObject,
              "bda2l.bands_approval.band_number.boundary_code",
              0
            );

            if (boundaryCode != val) {
              var params = { boundary_code: val };
              params["mun_class_id"] =
                props.mainObject.landData.landData.municipality.mun_classes.mun_class_id;
              axios
                .post(
                  (
                    window.host + "/devOptionsItems/GetAllMulitFilter"
                  ).build_url({ operation: 1, pageSize: 100 }),
                  params
                )
                .then((response) => {
                  var data = response.data;
                  var list = _.chain(plan_classes)
                    .filter(function (d) {
                      return d.f(
                        +props.mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.area?.toFixed(
                          2
                        ) || 0
                      );
                    })
                    .map(function (d) {
                      return d.id;
                    })
                    .value();
                  var main_conditions = _.filter(data.results, function (d) {
                    return list.indexOf(d.plan_class_id) > -1;
                  });
                  var ids = _.map(main_conditions, function (d) {
                    return d.item_code;
                  });
                  axios
                    .post(window.host + "/developmentItems/GetItems", ids)
                    .then((response) => {
                      //
                      var items = response.data;
                      main_conditions.forEach(function (d) {
                        d.condition = _.find(items, function (v) {
                          return v.item_code == d.item_code;
                        });
                      });

                      var index = 0;
                      var radios = [];
                      var name = "";
                      _.chain(main_conditions)
                        .groupBy("plan_class_id")
                        .map(function (list, key) {
                          index += 1;
                          var out = [];
                          name =
                            "" +
                            index +
                            " - " +
                            (_.find(plan_classes, function (d) {
                              return d.id == key;
                            }).name || "إفراغ كلي");

                          var values = _.chain(list)
                            .groupBy("option_code")
                            .map(function (lst, k) {
                              if (selectedBadl == val) {
                                let oldOptions =
                                  props?.mainObject?.bda2l?.bands_approval
                                    ?.band_number?.oldOptions;

                                if (oldOptions?.length && lst?.length) {
                                  let oldItems =
                                    oldOptions
                                      .map((r) => r.value[0])
                                      ?.find((r) => r.key == k && r.modal == k)
                                      ?.values || [];

                                  lst = [
                                    ...lst,
                                    ...oldItems
                                      ?.filter(
                                        (d) =>
                                          !lst?.filter(
                                            (r) => r.item_code == d.item_code
                                          ).length
                                      )
                                      ?.map((r) => ({
                                        ...r,
                                        option_code: lst[0].option_code,
                                      })),
                                  ];
                                }
                              }

                              out.push({
                                label: convertListToString(
                                  lst.sort((a, b) =>
                                    a.item_code > b.item_code ? 1 : -1
                                  ),
                                  "condition.item_description"
                                ),
                                value: _.chain(
                                  lst.sort((a, b) =>
                                    a.item_code > b.item_code ? 1 : -1
                                  )
                                )
                                  .groupBy("option_code")
                                  .map(function (sublst, u) {
                                    return {
                                      key: u,
                                      values: sublst,
                                      modal: u,
                                    };
                                  })
                                  .value(),
                                checked: false,
                              });

                              return {
                                key: k,
                                values: lst,
                                modal: k,
                              };
                            })
                            .value();

                          // out[0].main_header = function () {
                          //     return name;
                          // };
                          radios.push.apply(radios, out);
                          return {
                            key: key,
                            selected: false,
                            value: values,
                            name: name,
                          };
                        })
                        .value();

                      // props.setSelector('bandNumber', {
                      //     options: radios,
                      //     label: name,
                      //     dropDown: {isInvoked: true}
                      // })

                      props.change("bands_approval.band_number", {
                        options: radios,
                        label: name,
                        justInvoked: true,
                        boundary_code: val,
                        mun_class_id:
                          props.mainObject.landData.landData.municipality
                            .mun_classes.mun_class_id,
                        plan_class_id: list[0],
                      });
                    });
                });
            }
          },
          resetData: (props) => {
            if (
              !props.mainObject ||
              (props.mainObject && !props.mainObject.bda2l)
            ) {
              props.setSelector("bandNumber", {
                options: [],
                label: "",
                dropDown: { isInvoked: true },
              });
            }
          },
        },
        band_number: {
          moduleName: "bandNumber",
          label: "",
          deps: ["values.urban"],
          field: "customRadio",
          options: [],
          editButton: true,
          radios: false,
          checkboxes: true,
          isMotabkh: false,
          popupFields: {
            values: {
              hideLabel: true,
              field: "tableList",
              moduleName: "itemDescs",
              hideLabels: true,
              inline: true,
              addFrom: "bottom",
              value_key: "item_description",
              fields: [
                {
                  name: "condition.item_description",
                  label: "",
                  field: "text",
                },
              ],
            },
          },
        },
      },
    },
  },
};
