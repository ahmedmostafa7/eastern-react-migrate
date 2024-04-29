import { message } from "antd";
import { host } from "configFiles/config";
export default {
  number: 2,
  label: "Service Range",
  preSubmit(values, currentStep, props) {
    //return values

    return new Promise(function (resolve, reject) {
      console.log(values);
      //if (!values.landData || !values.landData.lands) {
      //message.error("من فضلك قم بأختيار الأرض");
      //reject();
      //} else {
      resolve(values);
      //}
    });
  },
  //description: 'this is the Second Step description',
  sections: {
    serviceRange: {
      label: "Service Range",
      type: "inputs",
      required: true,
      fields: {
        serviceRange: {
          hideLabel: true,
          field: "IdentifySeriveRange",
          className: "land_data",
        },
      },
    },
  },
};
