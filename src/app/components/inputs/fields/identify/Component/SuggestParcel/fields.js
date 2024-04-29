import { SubAttachementUrl } from "configFiles/config";
import { host } from "configFiles/config";

export default [
  {
    name: "file_upload",
    label: "مرفق الرفع المساحى",
    hideLabel: true,
    field: "simpleUploader",
    uploadUrl: `${host}/uploadMultifiles`,
    fileType: "image/*,.pdf",
    multiple: true,
  },
];
