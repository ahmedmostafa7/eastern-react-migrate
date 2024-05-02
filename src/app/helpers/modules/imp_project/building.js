import { FloorFields, FlatFields } from "../fields";
import { uuid } from "uuidv4";
import { get, omit, isEmpty, filter, toArray, sumBy } from "lodash";
import { message } from "antd";
import { SubAttachementUrl } from "imports/config";
import { host } from "imports/config";
// import {map} from 'lodash'
const numberField = ["Repeated", "Under Ground", "Level"];
export const collapseField = {
  // use: {
  //     label: "Using",
  //     field: 'select',
  //     data: [{
  //         label: "Trade",
  //         value: 'Trade'
  //     }]
  // },
  repeat: {
    label: "Repeated",
    initValue: 1,
    required: true,
    digits: true,
    maxLength: 4,
  },
  add_floor: {
    field: "button",
    hideLabel: true,
    text: "Add Floor",
    action: {
      type: "custom",
      action(props, stepItem) {
        const fields = FloorFields;
        props.setMain("Popup", {
          popup: {
            type: "create",
            childProps: {
              fields,
              ok(values) {
                const id = values.id || uuid();
                const floors = get(
                  stepItem.buildings,
                  `${props.index}.floors`,
                  {}
                );
                const types = filter(floors, { type: values.type });
                if (values.type != "Repeated" && types.length) {
                  message.error(
                    props.t("Cannot Add This Floor Please Change Type")
                  );
                  return Promise.reject(false);
                }
                props.change(`buildingData.buildings.${props.index}.floors`, {
                  ...floors,
                  [id]: {
                    ...values,
                    main_id: id,
                    repeat: numberField.includes(values.type)
                      ? values.repeat
                      : 1,
                  },
                });
                return Promise.resolve(true);
              },
            },
          },
        });
      },
    },
  },
  floors: {
    label: "Floors",
    field: "list",
    required: true,
    fields: {
      type: { head: "Floor Type" },
      repeat: { head: "Repeat Number" },
      area: { head: "Area" },
      actions: {
        type: "actions",
        head: "",
        actions: {
          edit: {
            action(props, d, stepItem) {
              const fields = FloorFields;
              props.setMain("Popup", {
                popup: {
                  type: "create",
                  childProps: {
                    fields,
                    initialValues: d,
                    // filter: {edit: true},
                    ok(values) {
                      const id = values.main_id || uuid();
                      const floors = get(
                        stepItem.buildings,
                        `${props.index}.floors`,
                        {}
                      );
                      const types = filter(floors, { type: values.type });
                      if (
                        values.type != "Repeated" &&
                        d.type != values.type &&
                        types.length
                      ) {
                        message.error(
                          props.t("Cannot Add This Floor Please Change Type")
                        );
                        return Promise.reject(false);
                      }
                      props.change(
                        `buildingData.buildings.${props.index}.floors`,
                        {
                          ...floors,
                          [id]: {
                            ...values,
                            repeat: numberField.includes(values.type)
                              ? values.repeat
                              : 1,
                          },
                        }
                      );
                      return Promise.resolve(true);
                    },
                  },
                },
              });
            },
            text: "Edit",
            icon: "edit-pen",
            className: "btn btn-warning",
          },
          flat_edit: {
            action(props, d, stepItem) {
              const fields = FlatFields;
              props.setMain("Popup", {
                popup: {
                  type: "create",
                  childProps: {
                    fields,
                    initialValues: d,
                    // filter: {edit: true},
                    ok(values) {
                      const id = values.main_id || uuid();
                      const floors = get(
                        stepItem.buildings,
                        `${props.index}.floors`,
                        {}
                      );
                      props.change(
                        `buildingData.buildings.${props.index}.floors`,
                        { ...floors, [id]: { ...values } }
                      );
                      return Promise.resolve(true);
                    },
                  },
                },
              });
            },
            text: "Flats",
            icon: "edit-pen",
            className: "btn btn-primary",
            permissions: {
              hide_if_value_included: {
                key: "type",
                compare: ["Mezaneen", "Service"],
              },
            },
          },
          delete: {
            action(props, d, stepItem) {
              const floors = get(
                stepItem.buildings,
                `${props.index}.floors`,
                {}
              );
              const data = omit(floors, d.main_id);
              props.change(
                `buildingData.buildings.${props.index}.floors`,
                isEmpty(data) ? "" : data
              );
            },
            text: "Delete",
            className: " btn btn-danger ",
          },
        },
      },
    },
  },
  height: {
    label: "Max Height",
    digits: true,
    maxLength: 4,
    required: true,
  },
  total_area: {
    label: "Total Area",
    field: "calculator",
    func: "totals",
    deps: ["values"],
    params: {
      path: "buildings",
      data: "floors",
      col: "area",
      repeat: "repeat",
    },
    digits: true,
    required: true,
  },
  total_requested_parking: {
    label: "Total Requestd Parking",
    field: "calculator",
    func: "total_parking",
    deps: ["values"],
    params: {
      path: "buildings",
      data: "floors",
      col: "area",
      repeat: "repeat",
    },
    digits: true,
    required: true,
  },
  total_parking: {
    label: "Total Parking",
    digits: true,
    required: true,
    maxLength: 4,
    // compare: {
    //     compare: 'buildingData.buildings',
    //     col: 'total_requested_parking',
    //     op: 'gte'
    // }
  },
  building_ratio: {
    label: "Building Ratio",
    digits: true,
    required: true,
    field: "calculator",
    func: "building_radio",
    deps: ["values"],
    params: {
      lands: "wizard.mainObject.landData.landData.lands.parcels",
      path: "buildings",
      data: "floors",
      col: "total_area",
    },
  },
  supply_area: {
    label: "Supply Area",
    field: "calculator",
    func: "supplyArea",
    deps: ["values"],
    params: {
      path: "buildings",
      data: "floors",
      col: "area",
      repeat: "repeat",
    },
    minValue: 0,
    digits: true,
    required: true,
  },
  far: {
    label: "FAR معامل كتلة البناء",
    field: "radio",
    required: true,
    options: [
      {
        label: "applied",
        value: "1",
      },
      {
        label: "not applied",
        value: "0",
      },
    ],
  },
  surround: {
    label: "Building Surround",
    className: "tb-list",
    field: "list",
    initValue: {
      east: {
        name: "East",
      },
      west: {
        name: "West",
      },
      south: {
        name: "South",
      },
      north: {
        name: "North",
      },
    },
    fields: {
      name: { head: "Name" },
      backward: {
        head: "Backward",
        label: "Backward",
        type: "input",
        hideLabel: true,
        scale: 4,
        digits: true,
        required: true,
      },
      forward: {
        head: "Forward",
        label: "Forward",
        type: "input",
        hideLabel: true,
        scale: 4,
        digits: true,
        required: true,
      },
    },
  },
  fence: {
    label: "Fence",
    maxLength: 4,
    required: true,
    digits: true,
  },
  warch: {
    label: "Warch",
    maxLength: 4,
    required: true,
    digits: true,
  },
};
export default {
  number: 5,
  label: "Building Data",
  //description: 'this is the Third Step description',
  preSubmit(values, currentStep, props) {
    //return values
    return new Promise(function (resolve, reject) {
      const areas = sumBy(
        toArray(get(values, "buildingData.buildings")),
        (d) => d.building_ratio * d.repeat
      );
      if (areas > 100) {
        message.error("نسبة البناء تخطت الحد المسموح");
        // throw "error in land selection"
        reject();
      } else {
        resolve(values);
      }
    });
  },
  sections: {
    buildingData: {
      label: "Building Data",
      type: "inputs",
      fields: {
        add_build: {
          field: "button",
          hideLabel: true,
          deps: ["values.buildings"],
          text: "Add Building",
          action: {
            type: "custom",
            action(props, stepItem) {
              const id = uuid();
              props.change("buildingData.buildings", {
                ...stepItem.buildings,
                [id]: { main_id: id },
              });
              return Promise.resolve(true);
            },
          },
        },
        buildings: {
          label: "Buildings",
          building: true,
          field: "Collapse",
          title: "Building",
          key: "main_id",
          required: true,
          extra: {
            delete: {
              action(props, data, stepItem) {
                props.setMain("Popup", {
                  popup: {
                    type: "confirm",
                    childProps: {
                      msg: "Are You Sure from Delete Item ?",
                      ok(values) {
                        const newData = omit(props.input.value, data.main_id);
                        props.input.onChange(isEmpty(newData) ? "" : newData);
                        return Promise.resolve(true);
                      },
                    },
                  },
                });
              },
              icon: "delete",
              className: " btn btn-danger ",
            },
          },
          fields: collapseField,
        },
        side_image: {
          label: "Side Image",
          placeholder: "select file",
          field: "simpleUploader",
          multiple: false,
          required: true,
          // required: true,
          uploadUrl: `${host}/uploadMultifiles`,
          extensions: ".jpg,.jpeg,.png",
          path: SubAttachementUrl + "submission/building",
        },
        top_image: {
          label: "Top Image",
          placeholder: "select file",
          field: "simpleUploader",
          required: true,
          multiple: false,
          // required: true,
          uploadUrl: `${host}/uploadMultifiles`,
          extensions: ".jpg,.jpeg,.png",
          path: SubAttachementUrl + "submission/building",
        },
      },
    },
  },
};
