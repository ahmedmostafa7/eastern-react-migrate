import { v4 as uuidv4 } from "uuid";
import { SakFields } from "./fields";
// import {host} from 'configFiles/config'
// import {  } from "axios";
import { get, omit, isEmpty } from "lodash";
import { message } from "antd";
export default (props) => ({
  number: 4,
  label: "Sak Data",
  preSubmit(values, currentStep, props) {
    return new Promise((resolve, reject) => {
      console.log("was", values, currentStep, props);
      return resolve(values);
    });
  },
  //description: 'this is the Second Step description',
  sections: {
    sakData: {
      label: "Sak Data",
      type: "inputs",
      fields: {
        ...SakFields(props),
        add_sak: {
          field: "button",
          hideLabel: true,
          text: "Add Sak",
          action: {
            type: "custom",
            action(props, stepItem, values) {
              if (
                stepItem.lands &&
                stepItem.number &&
                stepItem.date &&
                stepItem.issuer &&
                stepItem.image
              ) {
                let owner = [];

                if (
                  props.mainObject.ownerData &&
                  props.mainObject.ownerData.ownerData
                ) {
                  owner =
                    props.mainObject.ownerData.ownerData.owners[
                      Object.keys(
                        props.mainObject.ownerData.ownerData.owners
                      )[0]
                    ];

                  get(
                    "http://webgis.eamana.gov.sa/GISAPI/contracts/IsVarifiedContract",
                    {
                      params: {
                        id:
                          owner.ssn ||
                          owner.commercial_registeration ||
                          owner.code_regesteration,
                        contractDate: stepItem.date.split("/").join("-"),
                        contractNo: stepItem.number,
                      },
                    }
                  ).then(function (res) {
                    props.change("sakData.valid", res.data.Message);
                  });
                }
                const id = uuid();
                props.change("sakData", {
                  saks: {
                    ...stepItem.saks,
                    [id]: { ...omit(stepItem, ["saks"]), main_id: id },
                  },
                  issuer: "",
                });
                return Promise.resolve(true);
              } else {
                message.error(props.t("Please Enter All Field"));
              }
            },
          },
          // permission: {
          //   check_object_keys_length: { key: "saks", value: 0 },
          // },
        },
        saks: {
          field: "list",
          label: "Saks",
          requiredSak: true,
          fields: {
            lands: { head: "أرقام قطع الأراضي" },
            number: { head: "Number" },
            date: { head: "Date" },
            issuer: { head: "Sak Issuer" },
            // image: {
            //     head: 'Sak Image',
            //     type: "image",
            // },
            actions: {
              head: "",
              type: "actions",
              actions: {
                delete: {
                  action(props, d, stepItem) {
                    const data = omit(stepItem.saks, d.main_id);
                    props.change("sakData.saks", isEmpty(data) ? "" : data);
                  },
                  text: "Delete",
                  className: " btn btn-danger ",
                },
              },
            },
          },
        },
      },
    },
  },
});
