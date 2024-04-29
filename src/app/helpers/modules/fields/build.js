import { omit, isEmpty, sumBy, toArray } from "lodash";
import { uuid } from "uuidv4";
import { message } from "antd";
export const FloorFields = {
  type: {
    field: "select",
    required: true,
    label: "Floor Type",
    data: [
      {
        label: "Under Ground",
        value: "Under Ground",
      },
      {
        label: "Ground",
        value: "Ground",
      },
      {
        label: "Mezaneen",
        value: "Mezaneen",
      },
      {
        label: "Repeated",
        value: "Repeated",
      },
      {
        label: "Upper Attached",
        value: "Upper Attached",
      },
      {
        label: "Service",
        value: "Service",
      },
      {
        label: "Outside",
        value: "Outside",
      },
      {
        label: "Level",
        value: "Level",
      },
    ],
  },
  repeat: {
    label: "Repeat Number",
    initValue: 1,
    required: true,
    digits: true,
    permission: {
      floor_repeat: true,
    },
  },
  area: {
    label: "Area",
    // max_number_related: 'floor',
    digits: true,
    required: true,
  },
};

export const FlatFields = {
  // flat_name: {
  //     label: "Flat Name",
  //     required: true
  // },
  flat_use: {
    label: "Flat Usage",
    field: "select",
    required: true,
    data: [
      {
        value: "House",
        label: "House",
      },
      {
        value: "Trade",
        label: "Trade",
      },
      {
        value: "Manage",
        label: "Manage",
      },
      {
        label: "Park",
        value: "Park",
      },
    ],
  },
  flat_area: {
    label: "Area",
    digits: true,
    required: true,
  },
  add_flat: {
    field: "button",

    hideLabel: true,
    text: "Add Flat",
    action: {
      type: "custom",
      action(props, values) {
        // const {floor} = props;
        const areas =
          Number(values.area) -
          sumBy(toArray(values.flats), (d) => Number(d.flat_area));
        if (values.flat_area > areas) {
          message.error(props.t("You Exceed Floor Area"));
          return Promise.reject();
        }
        const id = uuid();
        props.change("flats", {
          ...values.flats,
          [id]: {
            main_id: id,
            flat_name: values.flat_name,
            flat_area: values.flat_area,
            flat_use: values.flat_use,
          },
        });
        return Promise.resolve(true);
      },
    },
  },
  flats: {
    field: "list",
    label: "Flats",
    required: true,
    fields: {
      // flat_name: {head: "Flat Number"},
      flat_use: { head: "Flat Usage" },
      flat_area: { head: "Area" },
      actions: {
        type: "actions",
        head: "",
        actions: {
          delete: {
            action(props, d, values) {
              const data = omit(values.flats, d.main_id);
              props.change(`flats`, isEmpty(data) ? "" : data);
            },
            text: "Delete",
            className: " btn btn-danger ",
          },
        },
      },
    },
  },
};
