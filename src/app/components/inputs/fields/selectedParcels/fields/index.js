import { workFlowUrl, SubAttachementUrl } from "configFiles/config";
import { host, host2 } from "configFiles/config";
import axios from "axios";
export const parcelDataFields = {
  north_length: {
    label: "طول الحد الشمالي (م)",
    placeholder: "طول الحد الشمالي (م)",
    type: "number",
    name: "name",
    maxLength: 200,
    required: true,
  },
  north_desc: {
    label: "وصف الحد الشمالي",
    placeholder: "وصف الحد الشمالي",
    type: "text",
    name: "name",
    maxLength: 200,
    required: true,
  },
  south_length: {
    label: "طول الحد الجنوبي (م)",
    placeholder: "طول الحد الجنوبي (م)",
    type: "number",
    name: "name",
    maxLength: 200,
    required: true,
  },
  south_desc: {
    label: "وصف الحد الجنوبي",
    placeholder: "Please Enter Company Name",
    type: "text",
    name: "name",
    maxLength: 200,
    required: true,
  },
  east_length: {
    label: "طول الحد الشرقي (م)",
    placeholder: "طول الحد الشرقي (م)",
    type: "number",
    name: "name",
    maxLength: 200,
    required: true,
  },
  east_desc: {
    label: "وصف الحد الشرقي",
    placeholder: "وصف الحد الشرقي",
    type: "text",
    name: "name",
    maxLength: 200,
    required: true,
  },
  west_length: {
    label: "طول الحد الغربي (م)",
    placeholder: "طول الحد الغربي (م)",
    type: "number",
    name: "name",
    maxLength: 200,
    required: true,
  },
  west_desc: {
    label: "وصف الحد الغربي",
    placeholder: "وصف الحد الغربي",
    type: "text",
    name: "name",
    maxLength: 200,
    required: true,
  },
};
