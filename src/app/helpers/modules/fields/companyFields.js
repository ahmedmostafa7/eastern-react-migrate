import { workFlowUrl, SubAttachementUrl } from "imports/config";
import { host, host2 } from "imports/config";
import { get, omit, isEmpty } from "lodash";
import { v4 as uuidv4 } from "uuid";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
export const owner_companyFields = {
  name: {
    label: "Name",
    field: "text",
    name: "name",
    placeholder: "من فضلك ادخل الاسم",
    required: true,
    maxLength: 200,
  },
  gender: {
    label: "Gender",
    field: "radio",
    required: true,
    name: "gender",
    initValue: "1",
    options: [
      {
        label: "Male",
        value: "1",
        text: "Male",
      },
      {
        label: "Female",
        value: "2",
        text: "Female",
      },
    ],
  },
  ssn: {
    label: "National ID",
    placeholder: "من فضلك ادخل رقم الهوية",
    field: "number",
    name: "ssn",
    unique: workFlowUrl + "owners/search",
    required: true,
    digits: true,
    nationalNum: { key: "nationalidtypes" },
    params: {
      owner_type: "1",
    },
    maxLength: 14,
    minLength: 8,
  },
  nationalid_issuer_name: {
    label: "Nationality Id Issuer Name",
    field: "text",
    required: true,
    placeholder: "من فضلك ادخل جهة اصدار الهوية",
    edit: true,
    name: "nationalid_issuer_name",
  },
  nationalidtype_id: {
    label: "Nationaity Id Type",
    field: "select",
    fetch: `/api/NatinalIdTypes`,
    moduleName: "NatinalIdTypes",
    label_key: "name",
    value_key: "id",
    show: "nationalidtypes.name",
    save_to: "nationalidtypes",
    api_config: { params: { pageIndex: 1, pageSize: 2000 } },
    //filterKey: "id",
    placeholder: "من فضلك اختر نوع الهوية",
    required: true,
    selectChange(value, row, props) {
      axios
        .get(`${workFlowUrl}/api/Nationalities/`, {
          params: { filter_key: "nationalty_type_id", operand: "=", q: value },
        })
        .then(({ data }) => {
          props.setSelector("nationalities", { data: data.results });
        });
    },
  },
  nationality_id: {
    label: "Nationality",
    field: "select",
    moduleName: "nationalities",
    //key: 'id',
    select_first: true,
    show: "nationalities.local_name",
    save_to: "nationalities",
    filterKey: "id",
    label_key: "local_name",
    value_key: "id",
    placeholder: "من فضلك اختر الجنسية",
    data: [],
    required: true,
    minLength: 0,
  },
  phone: {
    label: "Phone Number",
    placeholder: "من فضلك ادخل رقم الهاتف",
    textAfter: 966,
    digits: true,
    minlenght: 9,
    maxLength: 9,
    isFixed: true,
    required: true,
    init_data: (props) => {
      var value = props.input.value;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      props.input.onChange(value);
    },
  },
  mobile: {
    label: "Mobile Number",
    placeholder: "من فضلك ادخل رقم الجوال ex5xxxxxxxx",
    digits: true,
    textAfter: 966,
    minlenght: 9,
    maxLength: 9,
    isFixed: true,
    required: true,
    init_data: (props) => {
      var value = props.input.value;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      props.input.onChange(value);
    },
  },
  email: {
    label: "Email",
    field: "email",
    name: "email",
    placeholder: "من فضلك ادخل البريد الإلكتروني",
    edit: true,
    required: true,
    regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  },
  address: {
    label: "Address",
    placeholder: "من فضلك ادخل العنوان",
    field: "text",
    required: true,
    edit: true,
  },
  deliverd_post: {
    label: "Delivery Post",
    field: "text",
    // required: true,
    placeholder: "من فضلك ادخل الرقم البريدي",
    edit: true,
    name: "deliverd_post",
  },
  image: {
    label: "Profile Image",
    placeholder: "من فضلك ادخل صورة الهوية",
    field: "simpleUploader",
    multiple: false,
    required: true,
    uploadUrl: `${host}/uploadMultifiles`,
    name: "image",
    extensions: ".jpg,.jpeg,.png,.pdf,.PDF",
    path: SubAttachementUrl + "submission/identity_photo",
  },
};

export const ownerGela = {
  1: owner_companyFields,
};
