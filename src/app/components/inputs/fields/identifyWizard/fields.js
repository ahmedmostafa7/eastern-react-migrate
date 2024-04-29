export const idtFields = [
  {
    name: "municipality",
    moduleName: "muns",
    label: "اختر البلدية",
    field: "select",

    required: true,
    label_key: "name",
    value_key: "code",
  },
  {
    name: "submunicipality",
    moduleName: "muns_sec",
    label: "اختر البلدية الفرعية",
    required: true,
    field: "select",

    label_key: "name",
    value_key: "code",
  },
  {
    name: "district",
    label: "اختر المنطقة",
    moduleName: "districts",
    field: "select",
    label_key: "attributes.DISTRICT_NAME",
    value_key: "attributes.DISTRICT_NAME_Code",
  },
  {
    name: "checks",
    label: "اختر الطبقات",
    field: "multiChecks",
    required: true,
  },

  {
    name: "tableAdd",
    hideLabel: true,
    field: "gistTable",

    coulmns: [
      {
        title: "البلدية",
        dataIndex: "mun",
        key: "mun",
      },
      {
        title: "البلدية الفرعية",
        dataIndex: "sub_mun",
        key: "sub_mun",
      },
      {
        title: "الحي",
        dataIndex: "district",
        key: "district",
      },
      {
        title: "الطبقات",
        dataIndex: "floors",
        key: "floors",
      },
    ],
  },
  {
    name: "requested_file_type",
    moduleName: "requested_file_type",
    label: "اختر البلدية الفرعية",
    required: true,
    field: "select",
    data: [
      {
        label: "Shape",
        value: "Shape",
      },
      {
        label: "CAD",
        value: "CAD",
      },
      {
        label: "KML",
        value: "KML",
      },
    ],
  },
];
