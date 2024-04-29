import { workFlowUrl } from "imports/config";
import { host } from "imports/config";
import axios from "axios";
import { find, get } from "lodash";
export default {
  number: 1,
  label: "Submission Data",
  //description: 'this is the Third Step description',
  sections: {
    submission: {
      label: "Submission Data",
      type: "inputs",
      fields: {
        utilitytype_id: {
          label: "Utility Type",
          field: "select",
          fetch: `/utilitytype`,
          moduleName: "UtilityType",
          label_key: "name",
          value_key: "id",
          show: "utilitytype.name",
          save_to: "utilitytype",
          placeholder: "Please Select Utility Type",
          required: true,
          selectChange(value, row, props) {
            if (row) {
              axios
                .get(`${workFlowUrl}/utilitytype/${row.id}/utilitysubtype`)
                .then(({ data }) => {
                  // console.log(data)
                  const { values } = props;
                  if (data && data.length > 1) {
                    if (!find(data, { id: values.utilitysubtype_id })) {
                      props.change("submission.utilitysubtype_id", "");
                    }
                    props.setSelector("utilitysubtype", { data });
                  } else if (data && data.length == 1) {
                    props.setSelector("utilitysubtype", {
                      // label_key: "name",
                      // value_key: "id",
                      data: data,
                    });
                    props.change("submission.utilitysubtype_id", data[0].id);
                  }
                });
            }
          },
        },
        utilitysubtype_id: {
          label: "Utility Sub Type",
          deps: ["values.utilitytype_id"],
          select_first: true,
          permission: {
            show_any: ["utilitytype_id"],
          },
          required: true,
          label_fun(props) {
            //
            return get(props, "values.utilitytype.subtypes_group_name");
          },
          field: "select",
          moduleName: "utilitysubtype",
          label_key: "name",
          value_key: "id",
          show: "utilitysubtype.name",
          save_to: "utilitysubtype",
          // placeholder: 'Please Select Utility Sub Type'
        },
        // road_type: {
        //   field: 'select',
        //   label: "Road Type",
        //   label_key: "name",
        //   value_key: "name",
        //   placeholder: 'Please Select Road Type',
        //   permission: {
        //     show_if_val_equal: {key: 'utilitytype_id', value: 3},
        //   },
        //   data: [
        //     {"name": "طريق سريع "},
        //     {"name": "طريق غير سريع"},
        //     {"name": "طريق مزدوج منظور تحويله الى طريق سريع"},
        //     {"name": "طريق مفرد منظور تحويله الى طريق سريع"},
        //     {"name": "طريق مزدوج غير منظور تحويله الى طريق سريع"},
        //     {"name": "طريق مفرد غير منظور تحويله الى طريق سريع"},
        //     {"name": "طريق ترابي"},
        //   ]
        // },
        on_main_road: {
          permission: {
            show_if_val_equal: { key: "utilitysubtype_id", value: 41 },
          },
          name: "utilitysubtype_id",
          label: "Utility Position",
          field: "label",
          data: { 41: "المحطة علي الطريق الاقليمي" },
        },
        on_small_road: {
          permission: {
            show_if_val_equal: { key: "utilitysubtype_id", value: 42 },
          },
          name: "utilitysubtype_id",
          label: "Utility Position",
          field: "label",
          data: { 42: "المحطة داخل المخططات المعتمدة للمدن و القري" },
        },
        // road_name: {
        //   permission: {
        //     show_if_val_equal: {key: 'utilitytype_id', value: 3},
        //   },
        //   required: true,
        //   label: 'Road Name'
        // },
        // road_mark: {
        //   permission: {
        //     show_if_val_equal: {key: 'utilitytype_id', value: 3},
        //   },
        //   required: true,
        //   label: 'Road Mark'
        // },
        // school_type: {
        //   permission: {
        //     show_if_val_equal: {key: 'utilitytype_id', value: 1},
        //   },
        //   label: 'School Type',
        //   required: true,
        //   name: 'utilitysubtype_id',
        //   field: 'select',
        //   moduleName: 'utilitysubtype',
        //   show: 'utilitysubtype.name',
        //   save_to: 'utilitysubtype',
        //   label_key: "name",
        //   value_key: "id"
        // },
        school_name: {
          permission: {
            show_if_val_equal: { key: "utilitytype_id", value: 1 },
          },
          label: "School Name",
        },
        school_gender: {
          permission: {
            show_if_val_equal: { key: "utilitytype_id", value: 1 },
          },
          field: "select",
          required: true,
          label: "School Gender",
          label_key: "name",
          value_key: "name",
          data: [
            {
              name: "بنين",
            },
            {
              name: "بنات",
            },
          ],
        },
        school_type: {
          permission: {
            show_if_val_equal: { key: "utilitytype_id", value: 1 },
          },
          label: "School Type",
          label_key: "name",
          required: true,
          value_key: "name",
          field: "select",
          data: [
            {
              name: "مخصصة مرافق تعليمية",
            },
            {
              name: "غير مخصصة مرافق تعليمية",
            },
          ],
        },
        // hospital_type: {
        //   permission: {
        //     show_if_val_equal: {key: 'utilitytype_id', value: 2},
        //   },
        //   required: true,
        //   label: 'Hospital Type',
        //   name: 'utilitysubtype_id',
        //   field: 'select',
        //   moduleName: 'utilitysubtype',
        //   show: 'utilitysubtype.name',
        //   save_to: 'utilitysubtype',
        //   label_key: "name",
        //   value_key: "id"
        // },
        // approval_aggri: {
        //   permission: {
        //     show_if_val_equal: {key: 'utilitytype_id', value: 3},
        //   },
        //   label: 'Agri Ministry Approval',
        //   field: 'simpleUploader',
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   fileType: 'image/*,.pdf',
        //   multiple: true,
        // },
        // approval_trans: {
        //   permission: {
        //     show_if_val_equal: {key: 'utilitytype_id', value: 3},
        //   },
        //   label: 'Trans Ministry Approval',
        //   field: 'simpleUploader',
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   fileType: 'image/*,.pdf',
        //   multiple: true,
        // },
        approval_medical: {
          permission: {
            show_if_val_equal: { key: "utilitytype_id", value: 2 },
          },
          label: "Medical Ministry Approval",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
        },
        approval_school: {
          permission: {
            show_if_val_equal: { key: "utilitytype_id", value: 1 },
          },
          label: "School Ministry Approval",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
        },
        // wedding_type: {
        //   permission: {
        //     show_if_val_equal: {key: 'utilitytype_id', value: 4},
        //   },
        //   label: 'Wedding Type',
        //   select_first: true,
        //   required: true,
        //   name: 'utilitysubtype_id',
        //   field: 'select',
        //   moduleName: 'utilitysubtype',
        //   show: 'utilitysubtype.name',
        //   save_to: 'utilitysubtype',
        //   label_key: "name",
        //   value_key: "id"
        // },
      },
    },
  },
};
