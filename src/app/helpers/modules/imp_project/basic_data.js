import { workFlowUrl, host } from "configFiles/config";
import { map } from "lodash";
export default {
  number: 4,
  label: "Basic Data",
  //description: 'this is the Third Step description',
  sections: {
    basic_data: {
      label: "Basic Data",
      type: "inputs",
      fields: {
        eng_company_id: {
          label: "Consultant Name",
          field: "select",
          showSearch: true,
          fetch: `${workFlowUrl}/EngineeringCompanies`,
          moduleName: "Consultants",
          label_key: "name",
          value_key: "id",
          api_config: { params: { pageIndex: 1, pageSize: 2000 } },
          required: true,
          resetFields: ["register_no"],
          selectChange: (val, rec, props) => {
            const { change } = props;
            map(rec, (value, key) => {
              change(`basic_data.${key}`, value);
            });
          },
        },
        register_no: {
          label: "Engineering License Number",
          placeholder: "Engineering License Number",
          digits: true,
          disabled: true,
        },
        office_phone: {
          label: "Office Phone Number",
          placeholder: "Ex 9660000000000",
          digits: true,
          disabled: true,
        },
        fax: {
          label: "Fax Number",
          placeholder: "Ex 9660000000000",
          digits: true,
          disabled: true,
        },
        engineer_phone: {
          label: "Planning Engineer Phone Number",
          placeholder: "Ex 9660000000000",
          digits: true,
          disabled: true,
        },
        email: {
          label: "Email Address",
          emailValid: true,
          disabled: true,
        },
        application_letter: {
          label: "Application Letter",
          hideLabel: true,
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          required: true,
        },
        consultant_authorization: {
          label: "Consultant Authorization",
          hideLabel: true,
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
