import { workFlowUrl } from "imports/config";
import axios from "axios";
import { get } from "lodash";
import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host } from "imports/config";
// http://10.15.15.64/testgisapi2/utilitytype
// http://10.15.15.64/testgisapi2/utilitytype/{type_id}/utilitysubtype
// http://10.15.15.64/testgisapi2/utilitysubtype/{subtype_id}/requirements

// import {map} from 'lodash'
const onClick = (scope, controlName, val) => {
  let {
    input: { onChange, value },
  } = scope.props;
  delete value[controlName];
  let controlValue = { [controlName]: val, ...value };
  scope.state[controlName] = val;
  onChange(controlValue);
  scope.setState(controlValue);
};

export default {
  number: 2,
  label: "Submission Conditions",
  //description: 'this is the Third Step description',
  sections: {
    map: {
      type: "inputs",
      fields: {
        map: {
          hideLabel: true,
          field: "IdentifySeriveRange",
        },
      },
    },
    conditions: {
      init_data(values, props) {
        if (!get(props, "mainObject.Conditions.conditions")) {
          const sub = get(
            props,
            "mainObject.serviceSubmissionType.submission.utilitysubtype_id"
          );
          const utilityClass = get(
            props,
            "mainObject.LandWithCoordinate.landData.lands.parcels[0].attributes.category"
          );
          axios
            .get(`${workFlowUrl}/utilitysubtype/${sub}/requirements`, {
              params: { utilityClass },
            })
            .then(({ data }) => {
              // console.log(data)
              const mainData = data.reduce(
                (o, v) => ({
                  ...o,
                  [v.id]: { id: v.id, name: v.description, verified: false },
                }),
                {}
              );
              props.change("conditions", { main: mainData });
            });
        }
      },
      label: "Submission Conditions",
      type: "inputs",
      fields: {
        main: {
          label: "Condition Data",
          field: "list",
          fields: {
            name: { head: "Name" },
            verified: {
              head: "Verified    Not Verified",
              type: "input",
              field: "radio",
              hideLabel: true,
              options: [{ value: true }, { value: false }],
              hide_sublabel: true,
            },
            comment: {
              head: "comment",
              label: "comment",
              type: "input",
              hideLabel: true,
              // permission: {
              //   show_if_val_equal: { key: "verified", value: false }
              // }
            },
          },
          required: true,
        },
        utilitysubtype_id: {
          permission: {
            stateFilter: {
              key: "Comparing",
              path: "wizard.mainObject.serviceSubmissionType.submission.utilitysubtype_id",
              val: 42,
            },
          },
          required: true,
          label: "Utility Sub Type",
          field: "select",
          // moduleName: 'utilitysubtype',
          label_key: "name",
          data: [
            {
              id: "فئه ب",
              name: "فئه ب",
            },
            {
              id: "فئه ج",
              name: "فئه ج",
            },
          ],
          value_key: "id",
          // show: 'utilitysubtype.name',
          // save_to: 'utilitysubtype',
          placeholder: "Please Select Utility Sub Type",
        },
        utility_same_distance: {
          permission: {
            stateFilter: {
              key: "Comparing",
              path: "wizard.mainObject.serviceSubmissionType.submission.utilitysubtype_id",
              val: 42,
            },
          },
          required: true,
          label: "Utility Same Distance",
          field: "inputNumber",
          placeholder: "Please enter the distance",
          hasAU: true,
          data: [
            { value: "م", label: "م" },
            { value: "كم", label: "كم" },
          ],
          value_key: "value",
          label_key: "label",
          extInitialValue: "م",
          onClick: onClick,
        },
        utility_opposite_distance: {
          permission: {
            stateFilter: {
              key: "Comparing",
              path: "wizard.mainObject.serviceSubmissionType.submission.utilitysubtype_id",
              val: 42,
            },
          },
          required: true,
          label: "Utility Opposite Distance",
          field: "inputNumber",
          placeholder: "Please enter the distance",
          hasAU: true,
          data: [
            { value: "م", label: "م" },
            { value: "كم", label: "كم" },
          ],
          value_key: "value",
          label_key: "label",
          extInitialValue: "م",
          onClick: onClick,
        },
        print_conditions: {
          label: "طباعة الإشتراطات ",
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);

              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];

              // let data_table_conditions = ;
              mainObject.serviceSubmissionType.data_table = props?.values;
              // localStorage.setItem("edit_price", JSON.stringify(edit_price));
              const url = "/Submission/SaveEdit";
              const params = { sub_id: id };

              delete mainObject.temp;

              return postItem(
                url,
                {
                  mainObject: window.lzString.compressToBase64(
                    JSON.stringify({ ...mainObject })
                  ),
                  tempFile: {},
                },
                { params }
              ).then(() =>
                window.open(printHost + `/#/service_condition/${id}`, "_blank")
              );
            },
          },
        },
        // end print button
      },
    },
  },
};

export const Summary = {
  number: 2,
  label: "Submission Conditions",
  //description: 'this is the Third Step description',
  sections: {
    conditions: {
      label: "Submission Conditions",
      type: "inputs",
      fields: {
        main: {
          label: "conditions",
          field: "list",
          fields: {
            name: { head: "Name" },
            verified: {
              head: "Verified",
              type: "input",
              field: "boolean",
              hideLabel: true,
              hide_sublabel: true,
            },
            comment: {
              head: "comment",
              label: "comment",
              type: "input",
              hideLabel: true,
            },
          },
          required: true,
        },
        utilitysubtype_id: {
          permission: {
            stateFilter: {
              key: "Comparing",
              path: "wizard.mainObject.serviceSubmissionType.submission.utilitysubtype_id",
              val: 42,
            },
          },
          required: true,
          label: "Utility Sub Type",
          field: "select",
          // moduleName: 'utilitysubtype',
          label_key: "name",
          data: [
            {
              id: "فئه ب",
              name: "فئه ب",
            },
            {
              id: "فئه ج",
              name: "فئه ج",
            },
          ],
          value_key: "id",
          // show: 'utilitysubtype.name',
          // save_to: 'utilitysubtype',
          placeholder: "Please Select Utility Sub Type",
        },
        utility_same_distance: {
          permission: {
            stateFilter: {
              key: "Comparing",
              path: "wizard.mainObject.serviceSubmissionType.submission.utilitysubtype_id",
              val: 42,
            },
          },
          required: true,
          label: "Utility Same Distance",
          field: "inputNumber",
          placeholder: "Please enter the distance",
          init_data: (props) => {
            const {
              input: { value },
            } = props;
            if (value) {
              return (
                (value.inputValue && `${value.inputValue} ${value.extValue}`) ||
                ""
              );
            }
            return "";
          },
        },
        utility_opposite_distance: {
          permission: {
            stateFilter: {
              key: "Comparing",
              path: "wizard.mainObject.serviceSubmissionType.submission.utilitysubtype_id",
              val: 42,
            },
          },
          required: true,
          label: "Utility Opposite Distance",
          field: "inputNumber",
          init_data: (props) => {
            const {
              input: { value },
              onChange,
            } = props;
            if (value) {
              return (
                (value.inputValue && `${value.inputValue} ${value.extValue}`) ||
                ""
              );
            }
            return "";
          },
          placeholder: "Please enter the distance",
        },
      },
    },
  },
};
