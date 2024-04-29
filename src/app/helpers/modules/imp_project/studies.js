import { host } from "configFiles/config";

export default {
  number: 6,
  label: "Studies",
  sections: {
    hydraulics_studies: {
      label: "Hydraulics Studies",
      type: "inputs",
      fields: {
        hydraulics_letter_number: {
          label: "Letter Number",
          maxLength: 15,
          //required: true
        },
        hydraulics_letter_date: {
          label: "Letter Date",
          field: "hijriDatePicker",
          lessThanToday: true,
          //required: true
        },
        hydraulics_notes: {
          label: "Notes",
          field: "textArea",
          rows: 4,
          maxLength: 100,
        },
        hydraulics_letter_attach: {
          label: "Letter Attachment",
          hideLabel: true,
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          //required: true
        },
      },
    },
    soil_testing: {
      label: "Soil Testing",
      type: "inputs",
      fields: {
        soil_testing_letter_number: {
          label: "Letter Number",
          maxLength: 15,
          //required: true
        },
        soil_testing_letter_date: {
          label: "Letter Date",
          field: "hijriDatePicker",
          lessThanToday: true,
          //required: true
        },
        soil_testing_notes: {
          label: "Notes",
          field: "textArea",
          rows: 4,
          maxLength: 100,
        },
        soil_testing_letter_attach: {
          label: "Letter Attachment",
          hideLabel: true,
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          //required: true
        },
      },
    },
    traffic_studies: {
      label: "Traffic Studies",
      type: "inputs",
      fields: {
        soil_testing_letter_number: {
          label: "Letter Number",
          maxLength: 15,
        },
        soil_testing_letter_date: {
          label: "Letter Date",
          field: "hijriDatePicker",
          lessThanToday: true,
        },
        soil_testing_notes: {
          label: "Notes",
          field: "textArea",
          rows: "4",
          maxLength: 100,
        },
        soil_testing_letter_attach: {
          label: "Letter Attachment",
          hideLabel: true,
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
        },
      },
    },
  },
};
