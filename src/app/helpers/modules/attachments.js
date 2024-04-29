import { host } from "configFiles/config";
export default {
  number: 5,
  label: "Attachemnts",
  //description: 'this is the Second Step description',
  sections: {
    attachemnts: {
      label: "Attachments",
      type: "inputs",
      fields: {
        paper: {
          label: "Conditional Paper",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required: true,
        },
        folder: {
          label: "Project Folder",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required: true,
        },
        cad_files: {
          label: "Attachments",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".dwg",
          required: true,
        },
        view_files: {
          label: "Attachments",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".pdf",
          required: true,
        },
      },
    },
  },
};
