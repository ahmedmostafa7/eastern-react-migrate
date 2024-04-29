import { host } from "configFiles/config";

export default {
  number: 3,
  label: "Land Data",
  //description: 'this is the Second Step description',
  sections: {
    landData: {
      label: "Koroky Data",
      type: "inputs",
      fields: {
        type: {
          label: "_type",
          field: "radio",
          options: [
            {
              label: "paper kroky",
              value: "p",
            },
            {
              label: "Electronic Kroky",
              value: "e",
            },
          ],
        },
        number: {
          label: "Kroky Number",
          required: true,
        },
        date: {
          label: "Kroky Date",
          field: "hijriDatePicker",
        },
        images: {
          label: "Attachments",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          required: true,
        },
      },
    },
  },
};
