import { map, get, assign, isEmpty } from "lodash";
import { workFlowUrl, host } from "imports/config";
export default {
  label: "اعتماد حالة الأرض",
  // preSubmit(values, currentStep, props) {
  //   return new Promise((resolve, reject) => {
  //     //values["step_id"] = 000;
  //     console.log("mun_remark props", props);
  //     console.log("mun_remark currentStep", currentStep);
  //     return resolve(values);

  //   })
  // },
  sections: {
    mun_remark: {
      label: "اعتماد حالة الأرض",
      className: "radio_det",
      fields: {
        files: {
          label: "صورة حالة الأرض",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*",
          multiple: false,
          required: true,
        },
        comment: {
          moduleName: "comment",
          label: "ملاحظات",
          placeholder: "من فضلك ادخل الملاحظات",
          field: "textArea",
        },
      },
    },
  },
};
