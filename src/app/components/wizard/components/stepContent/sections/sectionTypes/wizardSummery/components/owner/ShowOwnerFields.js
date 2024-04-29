export const owner = {
  name: {
    label: "Name",
    type: "text",
    name: "name",
    placeholder: "من فضلك ادخل الاسم",
    required: true,
    maxLength: 200,
  },
  owner_type: {
    label: "owner type",
    type: "text",
    name: "ownerType",
    init_data: (props) => {
      let { t, val, data, owner_type } = props;
      
      return (
        (owner_type &&
          `${t(
            (owner_type == 1 && "Person") ||
              (owner_type == 2 && "Organization") ||
              (owner_type == 3 && "Special") ||
              (owner_type == 4 && "Others") ||
              ""
          )}`) ||
        ""
      );
    },
  },
  // gender: {
  //   label: "Gender",
  //   type: "text",
  //   name: "gender",
  //   init_data: (props) => {
  //
  //     const { t } = props;
  //     var value = props.val; // || t("Female");
  //     if (value && value == "1") {
  //       value = t("Male");
  //     } else if (value && value == "2") {
  //       value = t("Female");
  //     }
  //     return value;
  //   },
  // },
  ssn: {
    label: "National ID",
    placeholder: "من فضلك ادخل رقم الهوية",
    type: "text",
    name: "ssn",
  },
  nationalid_issuer_name: {
    label: "Nationality Id Issuer Name",
    type: "text",
    name: "nationalid_issuer_name",
  },
  nationalidtype_id: {
    label: "Nationaity Id Type",
    type: "text",
    moduleName: "NatinalIdTypes",
    init_data: (props) => {
      if (props.data.nationalidtypes) {
        return props.data.nationalidtypes.name;
      }

      return props.val;
    },
  },
  nationality_id: {
    label: "Nationality",
    type: "text",
    moduleName: "nationalities",
    init_data: (props) => {
      if (props.data.nationalities) {
        return props.data.nationalities.local_name;
      }

      return props.val;
    },
  },
  phone: {
    label: "Phone Number",
    textAfter: 966,
    init_data: (props) => {
      var value = props.val;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      return (value && `966${value}`) || "";
    },
  },
  mobile: {
    label: "Mobile Number",
    textAfter: 966,
    init_data: (props) => {
      var value = props.val;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      return (value && `966${value}`) || "";
    },
  },
  email: {
    label: "Email",
    type: "text",
    name: "email",
  },
  address: {
    label: "Address",
    type: "text",
  },
  deliverd_post: {
    label: "Delivery Post",
    type: "text",
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
    type: "text",
    name: "name",
    maxLength: 200,
    required: true,
  },
  subtype: {
    label: "Company Type",
    type: "text",
    name: "subtype",
    init_data: (props) => {
      let { t, val, data, owner_type } = props;
      var value = val;

      if (value && value == "1") {
        value = t("Company");
      } else if (value && value == "2") {
        value = t("Corporation");
      }

      // person: {
      //   label: "Person",
      //   value: "1",
      // },
      // org: {
      //   label: "Organization",
      //   value: "2",
      // },
      // special: {
      //   label: "Special",
      //   value: "3",
      // },
      // others: {
      //   label: "Others",
      //   value: "4",
      // },
      
      return (
        (owner_type &&
          `${value} - ${t(
            (owner_type == 1 && "Person") ||
              (owner_type == 2 && "Organization") ||
              (owner_type == 3 && "Special") ||
              (owner_type == 4 && "Others") ||
              ""
          )}`) ||
        ""
      );
    },
  },

  commercial_registeration: {
    label: "Commercial Registeration",
    digits: true,
    name: "commercial_registeration",
    type: "text",
  },
  phone: {
    label: "Phone Number",
    type: "text",
    textAfter: "966",
    init_data: (props) => {
      var value = props.val;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      return (value && `966${value}`) || "";
    },
    // regex: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
  },
  mobile: {
    label: "Mobile Number",
    textAfter: "966",
    type: "text",
    init_data: (props) => {
      var value = props.val;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      return (value && `966${value}`) || "";
    },
  },
  email: {
    label: "Email",
    type: "text",
    name: "email",
  },
  status: {
    label: " حالة الجهة",
    type: "text",
    init_data: (props) => {
      const { t } = props;
      var value = props.val;
      if (value && value == "1") {
        value = t("مفعلة");
      } else if (value && value == "2") {
        value = t("مجمدة");
      }
      return value;
    },
  },
  address: {
    label: "Address",
    type: "text",
    name: "address",
  },
  fax: {
    label: "Fax Number",
    type: "text",
    name: "fax",
  },
  website: {
    label: "WebSite",
    type: "text",
    name: "website",
  },

  //   owners: {
  //     field: "search",
  //     name: "owners",
  //     search_match: "eq",
  //     className: "owner_table",
  //     label: "الملاك",
  //     placeholder: "البحث برقم الهوية ",
  //     // owner: true,
  //     deps: ["values.owner_type", "values.owners"],
  //     min: 7,
  //     url: `${workFlowUrl}/owners/search`,
  //     filter_key: "q",
  //     label_key: "ssn",
  //     label_value: "ssn",
  //     params: {
  //       owner_type: "1",
  //     },
  //     onSelect(value, option, values, props) {
  //       const owners = values.owners || {};
  //       props.change("owners", {
  //         [option.id]: { ...option, main_id: option.id },
  //       });
  //     },
  //     permission: { show_match_value: { subtype: "2" } },
  //   },
  //   owners_pri: {
  //     label: "Owners",
  //     hideLabel: true,
  //     // name: "owners",
  //     field: "tableList",
  //     className: "tableOwnerADD",
  //     // hideLabels: true,
  //     permission: { show_match_value: { subtype: "2" } },

  //     inline: true,
  //     fields: [
  //       {
  //         label: "Name",
  //         type: "text",
  //         name: "name",
  //         placeholder: "من فضلك ادخل الاسم",
  //         required: true,
  //         maxLength: 200,
  //         hideLabel: true,
  //       },
  //       {
  //         label: "Gender",
  //         field: "radio",
  //         required: true,
  //         name: "gender",
  //         hideLabel: true,
  //         initValue: "1",
  //         options: [
  //           {
  //             label: "Male",
  //             value: "1",
  //             text: "Male",
  //           },
  //           {
  //             label: "Female",
  //             value: "2",
  //             text: "Female",
  //           },
  //         ],
  //       },
  //       {
  //         label: "National ID",
  //         placeholder: "من فضلك ادخل رقم الهوية",
  //         field: "number",
  //         name: "ssn",
  //         unique: workFlowUrl + "owners/search",
  //         required: true,
  //         digits: true,
  //         nationalNum: { key: "nationalidtypes" },
  //         params: {
  //           owner_type: "1",
  //         },
  //         maxLength: 14,
  //         minLength: 8,
  //       },
  //       {
  //         label: "Nationality Id Issuer Name",
  //         type: "text",
  //         required: true,
  //         placeholder: "من فضلك ادخل جهة اصدار الهوية",
  //         edit: true,
  //         name: "nationalid_issuer_name",
  //       },
  //       {
  //         label: "Nationaity Id Type",
  //         field: "select",
  //         fetch: `/api/NatinalIdTypes`,
  //         moduleName: "NatinalIdTypesd",
  //         label_key: "name",
  //         value_key: "id",
  //         name: "hawya",
  //         // show: "nationalidtypes.name",
  //         // save_to: "nationalidtypes",
  //         api_config: { params: { pageIndex: 1, pageSize: 2000 } },
  //         //filterKey: "id",
  //         placeholder: "من فضلك اختر نوع الهوية",
  //         required: true,
  //         selectChange(value, row, props) {
  //           axios
  //             .get(`${workFlowUrl}/api/Nationalities/`, {
  //               params: {
  //                 filter_key: "nationalty_type_id",
  //                 operand: "=",
  //                 q: value,
  //               },
  //             })
  //             .then(({ data }) => {
  //               props.setSelector("nationalities", { data: data.results });
  //             });
  //         },
  //       },
  //       {
  //         label: "Nationality",
  //         field: "select",
  //         moduleName: "nationalities",
  //         //key: 'id',
  //         select_first: true,
  //         show: "nationalities.local_name",
  //         save_to: "nationalities",
  //         filterKey: "id",
  //         label_key: "local_name",
  //         value_key: "id",
  //         placeholder: "من فضلك اختر الجنسية",
  //         data: [],
  //         required: true,
  //         minLength: 0,
  //         name: "nat",
  //       },
  //       {
  //         label: "Phone Number",
  //         placeholder: "من فضلك ادخل رقم الهاتف",
  //         textAfter: 966,
  //         digits: true,
  //         name: "phoneNumber",
  //         // minLength: 9,
  //         maxLength: 9,
  //         isFixed: true,
  //         required: true,
  //         init_data: (props) => {
  //           var value  = props.val;
  //           if (value && value.startsWith("966", 0)) {
  //             value = value.replace("966", "");
  //           }
  //           return value;
  //         },
  //       },
  //       {
  //         label: "Mobile Number",
  //         placeholder: "من فضلك ادخل رقم الجوال ex5xxxxxxxx",
  //         digits: true,
  //         textAfter: 966,
  //         // minLength: 9,
  //         maxLength: 9,
  //         isFixed: true,
  //         required: true,
  //         name: "dd",
  //         init_data: (props) => {
  //           var value  = props.val;
  //           if (value && value.startsWith("966", 0)) {
  //             value = value.replace("966", "");
  //           }
  //           return value;
  //         },
  //       },
  //       {
  //         label: "Email",
  //         field: "email",
  //         name: "email",
  //         placeholder: "من فضلك ادخل البريد الإلكتروني",
  //         edit: true,
  //         required: true,
  //         regex: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  //       },
  //       {
  //         label: "Address",
  //         placeholder: "من فضلك ادخل العنوان",
  //         type: "text",
  //         required: true,
  //         edit: true,
  //         name: "ee",
  //       },
  //       {
  //         label: "Delivery Post",
  //         type: "text",
  //         // required: true,
  //         placeholder: "من فضلك ادخل الرقم البريدي",
  //         edit: true,
  //         name: "deliverd_post",
  //       },
  //       {
  //         label: "Profile Image",
  //         placeholder: "من فضلك ادخل صورة الهوية",
  //         field: "simpleUploader",
  //         multiple: false,
  //         required: true,
  //         uploadUrl: `${host}/uploadMultifiles`,
  //         name: "image",
  //         extensions: ".jpg,.jpeg,.png,.pdf,.PDF",
  //         path: SubAttachementUrl + "submission/identity_photo",
  //       },
  //     ],
  //   },
};
export const ownerGeneralSectorFields = {
  name: {
    label: "Company Name",
    type: "text",
    name: "name",
  },
  code_regesteration: {
    label: "Code Registeration",
    type: "text",
    name: "code_regesteration",
  },
  phone: {
    label: "Phone Number",
    placeholder: "من فضلك ادخل رقم الهاتف",
    type: "text",
    textAfter: "966",
    init_data: (props) => {
      var value = props.val;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      return (value && `966${value}`) || "";
    },
  },
  mobile: {
    label: "Mobile Number",
    placeholder: "من فضلك ادخل رقم الجوال ex5xxxxxxxx",
    digits: true,
    textAfter: "966",
    text: "text",
    init_data: (props) => {
      var value = props.val;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      return (value && `966${value}`) || "";
    },
  },
  email: {
    label: "Email",
    type: "text",
    name: "email",
  },
  address: {
    label: "Address",
    type: "text",
  },
  fax: {
    label: "Fax Number",
    type: "text",
    name: "fax",
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
    type: "text",
    name: "name",
  },
  code_regesteration: {
    label: "Code Registeration",
    type: "text",
    name: "code_regesteration",
  },
  phone: {
    label: "Phone Number",
    digits: true,
    textAfter: "966",
    type: "text",
    init_data: (props) => {
      var value = props.val;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      return (value && `966${value}`) || "";
    },
  },
  mobile: {
    label: "Mobile Number",
    textAfter: "966",
    type: "text",
    init_data: (props) => {
      var value = props.val;
      if (value && value.startsWith("966", 0)) {
        value = value.replace("966", "");
      }
      return (value && `966${value}`) || "";
    },
  },
  email: {
    label: "Email",
    type: "text",
    name: "email",
  },
  status: {
    label: "Status",
    type: "text",
    name: "status",
    required: true,
    init_data: (props) => {
      const { t } = props;
      var value = props.val;
      if (value && value == "1") {
        value = t("Active");
      } else if (value && value == "2") {
        value = t("In Active");
      }
      return value;
    },
  },
  address: {
    label: "Address",
    type: "text",
    name: "address",
  },
  fax: {
    label: "Company Fax",
    type: "text",
    name: "fax",
  },
  website: {
    label: "WebSite",
    type: "text",
    name: "website",
  },
};

export const ownerFields = {
  1: owner,
  2: ownerGeneralSectorFields,
  3: ownerCompanyFields,
  4: ownerOthersFields,
};
