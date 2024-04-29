import { host } from "configFiles/config";

export default {
  number: 5,
  label: "Ownership Data",
  // className:'titleSelectedParcel',
  sections: {
    property_contract: {
      label: "Property Contract",
      type: "inputs",
      fields: {
        contracts: {
          field: "tableList",
          className: "modal-table",
          label: "Contracts",
          hideLabel: true,
          value_key: "contract_number",
          moduleName: "CONTRACTS",
          hideLabels: true,
          required: true,
          inline: true,
          fields: [
            {
              name: "contract_number",
              label: "Contract Number",
              maxLength: 15,
              required: true,
            },
            {
              name: "contract_date",
              label: "Contract Date",
              field: "hijriDatePicker",
              dateFormat: "iYYYY/iMM/iDD",
              required: true,
              lessThanToday: true,
            },
            {
              name: "contract_issuer",
              label: "Contract Issuer",
              maxLength: 50,
              required: true,
            },
            {
              name: "contract_attach",
              label: "Contract Image Attachment",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}/uploadMultifiles`,
              fileType: "image/*,.pdf",
              multiple: true,
              required: true,
            },
          ],
        },
      },
    },
    survey_reports: {
      label: "Survey reports",
      type: "inputs",
      fields: {
        surveyReports: {
          field: "tableList",
          className: "modal-table",
          label: "Survey reports",
          hideLabel: true,
          value_key: "report_number",
          moduleName: "SURVEYREPORTS",
          hideLabels: true,
          required: true,
          inline: true,
          fields: [
            {
              name: "report_number",
              label: "Report Number",
              maxLength: 15,
              required: true,
            },
            {
              name: "report_date",
              label: "Report Date",
              field: "hijriDatePicker",
              lessThanToday: true,
              required: true,
            },
            {
              name: "report_issuer",
              label: "Survey Report Issuer",
              maxLength: 50,
              required: true,
            },
            {
              name: "report_attach",
              label: "Survey Report Image Attachment",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}/uploadMultifiles`,
              fileType: "image/*,.pdf",
              multiple: true,
              required: true,
            },
          ],
        },
      },
    },
  },
};
