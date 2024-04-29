import { workFlowUrl, host, SubAttachementUrl } from "imports/config";
// import {map} from 'lodash'
export default {
  number: 1,
  label: "Submission Data",
  //description: 'this is the Third Step description',
  sections: {
    submission: {
      label: "Submission Data",
      type: "inputs",
      fields: {
        sub_type: {
          label: "Submission Type",
          field: "select",
          showSearch: true,
          moduleName: "Consultants",
          label_key: "name",
          value_key: "id",
          data: [
            {
              id: "imp",
              name: "Important Project",
            },
            {
              id: "imp_time",
              name: "Important Project Time",
            },
          ],
          required: true,
        },
        kroky_search: {
          field: "search",
          label: "Search With Kroky Number",
          placeholder: "Search With Kroky Number",
          url: `${workFlowUrl}/Submission/GetFirstMulitFilter/?fake=`,
          method: "post",
          filter_key: "request_no=",
          label_value: "request_no",
          label_key: "request_no",
          min: 4,
          params: {
            "app_id=": 8,
          },
          permission: {
            hide_every: ["without_kroky"],
          },
          onSelect(value, option, values, props) {
            const { change } = props;
            change("submission.kroky", [option]);
          },
        },
        kroky: {
          field: "list",
          required: true,
          permission: {
            hide_every: ["without_kroky"],
          },
          label: "Kroky Data",
          fields: {
            request_no: {
              head: "Kroky Number",
            },
            create_date: {
              head: "Kroky Date",
            },
            actions: {
              type: "actions",
              head: "",

              actions: {
                delete: {
                  text: "Delete",
                  className: " btn btn-danger ",
                  action(props) {
                    props.change("submission.kroky", []);
                  },
                },
              },
            },
            // issuer: {
            //     head: "Kroky Issuer",
            // }
          },
        },
        without_kroky: {
          field: "boolean",
          label: "Not attach To Kroky",
          permission: {
            hide_every: ["kroky.length"],
          },
        },
      },
    },
    kroky: {
      label: "Kroky Data",
      permission: {
        show_every: ["submission.without_kroky"],
      },
      fields: {
        submission_no: {
          label: "Kroky Number",
          required: true,
        },
        submission_date: {
          label: "Kroky Date",
          field: "hijriDatePicker",
          lessThanToday: true,
          required: true,
        },
        isuue_date: {
          label: "Kroky Issue",
          required: true,
        },
        image: {
          label: "Kroky Image",
          placeholder: "select file",
          field: "simpleUploader",
          multiple: false,
          required: true,
          uploadUrl: `${host}/uploadMultifiles`,
          name: "image",
          extensions: ".jpg,.jpeg,.png,.pdf",
          path: SubAttachementUrl + "submission/kroky_image",
        },
      },
    },
  },
};
