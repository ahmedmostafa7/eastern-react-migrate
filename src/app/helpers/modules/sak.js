import { host } from "imports/config";
import { uuid } from "uuidv4";
import { omit } from "lodash";
export default {
  number: 4,
  label: "Sak Data",
  //description: 'this is the Second Step description',
  sections: {
    landData: {
      label: "Sak Data",
      type: "inputs",
      maxLength: 10,
      fields: {
        number: {
          label: "Kroky Number",
          required: true,
        },
        date: {
          label: "Kroky Date",
          field: "hijriDatePicker",
        },
        image: {
          label: "Attachments",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          required: true,
        },
        button: {
          label: "Add Sak",
          filed: "button",
          buttonAction(change, input, values) {
            const id = uuid();
          },
        },
      },
    },
  },
};
