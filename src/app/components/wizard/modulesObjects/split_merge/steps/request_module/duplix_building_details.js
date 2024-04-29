import { host } from "imports/config";
const _ = require("lodash");
export default {
  label: "تفاصيل المبنى",
  sections: {
    duplix_building_details: {
      label: "تفاصيل المبنى",
      className: "radio_det",
      fields: {
        duplix_licence_number: {
          label: "رقم رخصة البناء",
          field: "text",
          required: true,
          placeholder: "من فضلك ادخل رقم رخصة البناء",
        },
        duplix_licence_date: {
          label: "تاريخ رخصة البناء",
          field: "hijriDatePicker",
          required: true,
          placeholder: "من فضلك ادخل تاريخ رخصة البناء",
        },
        duplix_is: {
          label: "عبارة عن",
          field: "text",
          placeholder: "عبارة عن ...",
        },
        build_licence_image: {
          label: "صورة رخصة البناء",
          required: true,
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*",
          multiple: false,
        },
        arc_blocks_images: {
          label: "صور المخطط المعماري المعتمد",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*",
          multiple: true,
        },
        land_real_image: {
          label: "صورة فوتوغرافية للأرض",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*",
          multiple: false,
          required: true,
        },
        front_build_image: {
          label: "صور فوتوغرافية للمبني",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*",
          multiple: true,
        },
      },
    },
  },
};
