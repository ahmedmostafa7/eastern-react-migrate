import { workFlowUrl, host } from "imports/config";
import { fetchData, postItem } from "app/helpers/apiMethods";
import { map, get } from "lodash";
import { printHost } from "imports/config";
export default {
  label: "بيانات المعاملة",
  sections: {
    submission_data_export: {
      label: " بيانات المعاملة ",
      fields: {
        submission_no: {
          label: "رقم المعاملة ",
          required: true,
        },
        date: {
          label: "تاريخ المعاملة",
          field: "hijriDatePicker",
          lessThanToday: true,
          required: true,
        },
        import_no: {
          label: "رقم الوارد ",
          required: true,
        },
        export_no: {
          label: "رقم الصادر ",
          required: true,
        },
        submission_text_area: {
          field: "textArea",
          required: true,
          rows: "8",

          label: "وصف المعاملة",
        },
        attachment: {
          label: "المرفقات",

          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          required: true,
          // maxNumOfFiles: 1,
        },
      },
    },
  },
};
