import { host } from "imports/config";
import moment from "moment-hijri";
export default {
  number: 5,
  label: "Comments",
  // preSubmit(values, currentStep, props) {
  //   return new Promise(function (resolve, reject) {
  //     const { t } = props;

  //     values["comment"].date = moment().format("iYYYY/iMM/iD");
  //     let hours = new Date().getHours();
  //     let mintes = new Date().getMinutes();
  //     values["comment"].time = hours + ":" + mintes;
  //     console.log("ccc", values, currentStep, props);

  //     resolve(values);
  //   });
  // },

  //description: 'this is the Second Step description',
  sections: {
    comment: {
      label: "Comments",
      type: "inputs",
      fields: {
        check_plan_approval: {
          permission: { show_match_value_mod: ["48"] },
          field: "radio",
          initValue: "1",
          label: "موقف المدقق من الرفع المساحي",
          hideLabel: false,
          options: {
            accept: {
              label: " مقبول",
              value: "1",
            },
            reject: {
              label: "مرفوض ",
              value: "2",
            },
          },
          required: true,
        },
        comment: {
          label: "Notes",
          field: "textArea",
        },
        attachemnts: {
          label: "Attachments",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
        },
        calling_momtlkat_management: {
          permission: { show_match_value_mod: ["20"] },
          field: "boolean",
          label: "مخاطبة ادارة الممتلكات",
          hideLabel: true,
          // required: true,
        },
        invoice_image: {
          permission: {
            show_every: ["calling_momtlkat_management"],
            show_match_value_mod: ["20"],
          },
          label: "صورة الفاتورة",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
        },
        agreements: {
          permission: {
            show_every: ["calling_momtlkat_management"],
            show_match_value_mod: ["20"],
          },
          label: "الموافقات",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
        },
        invoice_number: {
          permission: {
            show_every: ["calling_momtlkat_management"],
            show_match_value_mod: ["20"],
          },
          label: "رقم الإيصال",
          field: "text",
        },
        invoice_date: {
          permission: {
            show_every: ["calling_momtlkat_management"],
            show_match_value_mod: ["20"],
          },
          label: "تاريخ الإيصال",
          field: "hijriDatePicker",
        },
      },
    },
  },
};
