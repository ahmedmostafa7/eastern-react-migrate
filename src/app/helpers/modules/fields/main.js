import { workFlowUrl, SubAttachementUrl } from "imports/config";
import { host, host2 } from "imports/config";
import { get, omit, isEmpty } from "lodash";
import { uuid } from "uuidv4";
import applyFilters from "main_helpers/functions/filters";
import { ownerGela } from "./companyFields";

import axios from "axios";
export const owner = {
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
    uniqueIdentity: workFlowUrl + "/owners/search",
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
    // required: true,
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
export const ownerCompanyFields = {
  name: {
    label: "Company Name",
    placeholder: "من فضلك ادخل اسم الجهة",
    field: "text",
    name: "name",
    maxLength: 200,
    required: true,
  },
  subtype: {
    label: "Company Type",
    field: "radio",
    name: "subtype",
    required: true,
    options: [
      {
        label: "Company",
        value: "1",
        text: "Company",
      },
      {
        label: "Corporation",
        value: "2",
        text: "Corporation",
      },
    ],
  },

  commercial_registeration: {
    label: "Commercial Registeration",
    placeholder: "من فضلك ادخل رقم السجل التجاري",
    digits: true,
    name: "commercial_registeration",
    required: true,
    maxLength: 15,
    nationalNum: { key: "nationalidtypes" },
    uniqueIdentity: workFlowUrl + "/owners/search",
    // minLength: 10,
    params: {
      owner_type: "3",
    },
  },
  phone: {
    label: "Phone Number",
    placeholder: "من فضلك ادخل رقم الهاتف",
    digits: true,
    textAfter: "966",
    // minlength: 9,
    maxLength: 9,
    isFixed: true,
    // required: true,
    iskk: true,
    init_data: (props) => {
      var value = props.input.value;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      props.input.onChange(value);
    },
    // regex: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
  },
  mobile: {
    label: "Mobile Number",
    placeholder: "من فضلك ادخل رقم الجوال ex5xxxxxxxx",
    digits: true,
    textAfter: "966",
    // minlength: 9,
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
    type: "text",
    placeholder: "من فضلك ادخل البريد الإلكتروني",
    name: "email",
    required: true,
    regex: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
    errors: [
      {
        name: "pattern",
        msg: "global.INVALIDEMAIL",
      },
    ],
  },
  status: {
    label: " حالة الجهة",
    field: "radio",

    required: true,
    options: [
      {
        label: "مفعلة",
        value: "1",
        text: "مفعلة",
      },
      {
        label: "مجمدة",
        value: "2",
        text: "مجمدة",
      },
    ],
  },
  address: {
    label: "Address",
    placeholder: "من فضلك ادخل العنوان",
    type: "text",
    maxLength: 100,
    edit: true,
    required: true,
  },
  fax: {
    label: "Fax Number",
    type: "text",
    placeholder: "من فضلك ادخل رقم الفاكس",
    name: "fax",
    digits: true,
    // minLength: 10,
    maxLength: 12,
    //maxLength: "14",
    // regex: "^[0-9]{0,14}$",
    edit: true,
  },
  website: {
    label: "WebSite",
    type: "text",
    placeholder: "من فضلك ادخل الموقع الإلكتروني",
    name: "website",
    maxLength: 20,
    edit: true,
  },

  owners: {
    field: "search",
    name: "owners",
    search_match: "eq",
    className: "owner_table",
    label: "الملاك",
    placeholder: "البحث برقم الهوية ",
    deps: ["values.owner_type", "values.owners"],
    min: 7,
    url: `${workFlowUrl}/owners/search`,
    filter_key: "q",
    label_key: "ssn",
    label_value: "ssn",
    params: {
      owner_type: "1",
    },
    onSelect(value, option, values, props) {
      const owners = values.owners || {};
      props.change("owners", {
        [option.id]: { ...option, main_id: option.id },
      });
    },
    permission: { show_match_value: { subtype: "2" } },
  },
  owners_pri: {
    label: "Owners",
    hideLabel: true,
    // name: "owners",
    field: "tableList",
    className: "tableOwnerADD",
    // hideLabels: true,
    permission: { show_match_value: { subtype: "2" } },

    inline: true,
    fields: [
      {
        label: "Name",
        field: "text",
        name: "name",
        placeholder: "من فضلك ادخل الاسم",
        required: true,
        maxLength: 200,
        hideLabel: true,
      },
      {
        label: "Gender",
        field: "radio",
        required: true,
        name: "gender",
        hideLabel: true,
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
      {
        label: "National ID",
        placeholder: "من فضلك ادخل رقم الهوية",
        field: "number",
        name: "ssn",
        uniqueIdentity: workFlowUrl + "/owners/search",
        required: true,
        digits: true,
        nationalNum: { key: "nationalidtypes" },
        params: {
          owner_type: "1",
        },
        maxLength: 14,
        minLength: 8,
      },
      {
        label: "Nationality Id Issuer Name",
        field: "text",
        required: true,
        placeholder: "من فضلك ادخل جهة اصدار الهوية",
        edit: true,
        name: "nationalid_issuer_name",
      },
      {
        label: "Nationaity Id Type",
        field: "select",
        fetch: `/api/NatinalIdTypes`,
        moduleName: "NatinalIdTypesd",
        label_key: "name",
        value_key: "id",
        name: "hawya",
        // show: "nationalidtypes.name",
        // save_to: "nationalidtypes",
        api_config: { params: { pageIndex: 1, pageSize: 2000 } },
        //filterKey: "id",
        placeholder: "من فضلك اختر نوع الهوية",
        required: true,
        selectChange(value, row, props) {
          axios
            .get(`${workFlowUrl}/api/Nationalities/`, {
              params: {
                filter_key: "nationalty_type_id",
                operand: "=",
                q: value,
              },
            })
            .then(({ data }) => {
              props.setSelector("nationalities", { data: data.results });
            });
        },
      },
      {
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
        name: "nat",
      },
      {
        label: "Phone Number",
        placeholder: "من فضلك ادخل رقم الهاتف",
        textAfter: 966,
        digits: true,
        name: "phoneNumber",
        // minLength: 9,
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
      {
        label: "Mobile Number",
        placeholder: "من فضلك ادخل رقم الجوال ex5xxxxxxxx",
        digits: true,
        textAfter: 966,
        // minLength: 9,
        maxLength: 9,
        isFixed: true,
        required: true,
        name: "dd",
        init_data: (props) => {
          var value = props.input.value;
          if (value && value.startsWith("966", 0)) {
            value = value.replace("966", "");
          }
          props.input.onChange(value);
        },
      },
      {
        label: "Email",
        field: "email",
        name: "email",
        placeholder: "من فضلك ادخل البريد الإلكتروني",
        edit: true,
        required: true,
        regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      },
      {
        label: "Address",
        placeholder: "من فضلك ادخل العنوان",
        field: "text",
        required: true,
        edit: true,
        name: "ee",
      },
      {
        label: "Delivery Post",
        field: "text",
        // required: true,
        placeholder: "من فضلك ادخل الرقم البريدي",
        edit: true,
        name: "deliverd_post",
      },
      {
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
    ],
  },
};
export const ownerGeneralSectorFields = {
  name: {
    label: "Company Name",
    placeholder: "من فضلك ادخل اسم الجهة",
    type: "text",
    name: "name",
    maxLength: 200,
    required: true,
  },
  code_regesteration: {
    label: "Code Registeration",
    placeholder: "من فضلك ادخل كود الجهة",
    nationalNum: { key: "nationalidtypes" },
    type: "number",
    name: "code_regesteration",
    required: true,
    digits: true,
    minLength: 10,
    maxLength: 14,
    uniqueIdentity: workFlowUrl + "/owners/search",
    params: {
      owner_type: "2",
    },
  },
  phone: {
    label: "Phone Number",
    placeholder: "من فضلك ادخل رقم الهاتف",
    digits: true,
    textAfter: "966",
    // minlength: 9,
    maxLength: 9,
    isFixed: true,
    // required: true,
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
    textAfter: "966",
    // minlength: 9,
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
    type: "text",
    placeholder: "من فضلك ادخل البريد الإلكتروني",
    name: "email",
    required: true,
    regex: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
    errors: [
      {
        name: "pattern",
        msg: "global.INVALIDEMAIL",
      },
    ],
  },
  address: {
    label: "Address",
    placeholder: "من فضلك ادخل العنوان",
    type: "text",
    maxLength: 100,
    edit: true,
    required: true,
  },
  fax: {
    label: "Fax Number",
    type: "text",
    placeholder: "من فضلك ادخل رقم الفاكس",
    name: "fax",
    digits: true,
    // minLength: 10,
    maxLength: 12,
    //maxLength: "14",
    //regpattern: "^[0-9]{0,14}$",
    edit: true,
  },
  website: {
    label: "WebSite",
    maxLength: 20,
    type: "text",
    placeholder: "من فضلك ادخل الموقع الإلكتروني",
    name: "website",
    edit: true,
  },
};

export const ownerOthersFields = {
  name: {
    label: "Company Name",
    placeholder: "من فضلك ادخل اسم الجهة",
    type: "text",
    name: "name",
    maxLength: 200,
    required: true,
  },
  code_regesteration: {
    label: "Code Registeration",
    placeholder: "من فضلك ادخل كود الجهة",
    type: "number",
    name: "code_regesteration",
    required: true,
    uniqueIdentity: workFlowUrl + "/owners/search",
    min: 1000000000,
    params: {
      owner_type: "2",
    },
  },
  phone: {
    label: "Phone Number",
    placeholder: "من فضلك ادخل رقم الهاتف",
    digits: true,
    textAfter: "966",
    // minlength: 9,
    maxLength: 9,
    isFixed: true,
    // required: true,
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
    textAfter: "966",
    minlength: 9,
    maxLength: 9,
    isFixed: true,
    required: true,
    placeholderInside: true,
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
    type: "text",
    placeholder: "من فضلك ادخل البريد الإلكتروني",
    name: "email",
    required: true,
    regex: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
    errors: [
      {
        name: "pattern",
        msg: "global.INVALIDEMAIL",
      },
    ],
  },
  status: {
    label: "Status",
    field: "radio",
    name: "status",
    required: true,
    options: [
      {
        label: "Active",
        value: "1",
        text: "Active",
      },
      {
        label: "In Active",
        value: "2",
        text: "In Active",
      },
    ],
  },
  address: {
    label: "Address",
    placeholder: "من فضلك ادخل العنوان",
    maxLength: 100,
    edit: true,
    required: true,
  },
  fax: {
    label: "Company Fax",
    type: "text",
    placeholder: "من فضلك ادخل رقم الفاكس",
    name: "fax",
    maxLength: 12,
    //regpattern: "^[0-9]{0,14}$",
    edit: true,
  },
  website: {
    label: "WebSite",
    maxLength: 20,
    type: "text",
    placeholder: "من فضلك ادخل الموقع الإلكتروني",
    name: "website",
    edit: true,
  },
};

export const ownerFields = {
  1: owner,
  2: ownerGeneralSectorFields,
  3: ownerCompanyFields,
  4: ownerOthersFields,
};
//LandWithCoordinate

export const SakFields = (props = {}) => ({
  lands: {
    label: "Parcels",
    field: "multiSelect",
    path: "wizard.mainObject.LandWithCoordinate.landData.lands.parcels",
    label_key: "attributes.PARCEL_PLAN_NO",
    value_key: "attributes.PARCEL_PLAN_NO",
    //required: true,
  },
  number: {
    label: "Sak Number",
    // required: true,
    maxLength: 20,
  },
  date: {
    label: "Sak Date",
    // required: true,
    field: "hijriDatePicker",
  },
  issuer: {
    moduleName: "issuer",
    label: "Sak Issuer",
    field: "search",
    placeholder: "Please Select Sak Issuer",
    url: `${workFlowUrl}/issuers/searchbymunicabilityid`,
    // required: true,
    // show: 'issuer.name',
    // save_to: 'issuer',
    // preRequest: (props) => {
    //   let { params, setSelector } = props;
    //   // if (
    //   //   !params.municapility_id &&
    //   //   get(props.mainObject, "landData.landData.lands.temp.mun")
    //   // ) {
    //     setSelector("issuer", {
    //       params: {
    //         ...params,
    //         municapility_id: get(
    //           props.mainObject,
    //           "landData.landData.lands.temp.mun"
    //         ) || get(props.mainObject, prps.search_params.municapility_id.replace("wizard.mainObject", "")),
    //       },
    //     });
    //   //}
    // },
    label_key: "name",
    filter_key: "q",
    params: {
      ...props.search_params,
    },
  },
  image: {
    label: "Sak Image",
    field: "simpleUploader",
    uploadUrl: `${host}/uploadMultifiles`,
    fileType: "image/*,.pdf",
    // required: true
  },
});
