import { workFlowUrl, host } from "imports/config";
import { fetchData } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import { map, get } from "lodash";

export const plan_approval_submission = {
  name: "plan_approval_submission",
  module_id: 11,
  steps: {
    firstData: {
      number: 1,
      label: "First data",
      sections: {
        firstData: {
          label: "First data",
          type: "inputs",
          fields: {
            // old_submission:{
            //     label: 'Old Submission',
            //     hideLabel: false,
            //     hideIfFalse :true,
            //     field:'boolean',
            //     className:'checkboxWizard'
            // },
            one_number: {
              label: "One number",
              hideLabel: false,
              digits: true,
              maxLength: 15,
            },
            credentials: {
              label: "Credentials",
              field: "select",
              required: true,
              data: [
                { label: "الأمانة", value: "1" },
                { label: "وزارة الشئون البلدية والقروية", value: "2" },
                { label: "وزارة الاسكان", value: "3" },
              ],
            },
            submission_type: {
              label: "Submission type",
              field: "select",
              required: true,
              data: [
                { label: "جديد", value: "1" },
                { label: "معدل", value: "2" },
                { label: "مؤرشف", value: "3" },
              ],
            },
            year: {
              label: "Year",
              required: true,
              lessThanYear: true, //the value should be less than this year
              field: "inputNumber",
              maxLength: 4,
              isFixed: true,
              permission: {
                show_match_value: { submission_type: "3" },
              },
            },
            request_no: {
              name: "request_no",
              label: "Request number",
              required: true,
              conditionalNotRequired: ["firstData.old_submission_attach"],
              permission: {
                show_match_value: { submission_type: "2" },
              },
            },
            find_submission: {
              name: "find_submission",
              label: "Find submission",
              field: "button",
              hideValue: true,
              icon: "search",
              permission: {
                show_match_value: { submission_type: "2" },
              },
              buttonAction: (change, input, values, t) => {
                const inputName = get(input, "name");
                const url = `/Submission/GetSubmissionMainObject`;
                fetchData(url, {
                  params: { request_no: get(values, "request_no") },
                })
                  .then((data) => {
                    window.notifySystem("success", t("submission was found"));
                    if (inputName) {
                      change(inputName, "1");
                    }
                  })
                  .catch((e) => {
                    window.notifySystem("warning", t("submission not found"));
                    if (inputName) {
                      change(inputName, "2");
                    }
                  });
              },
            },
            old_submission_attach: {
              label: "Old submission attch",
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: true,
              permission: {
                match_value: { find_submission: "2", submission_type: "2" },
              },
            },
          },
        },
      },
    },
    ownerData: {
      number: 2,
      label: "Owner Data",
      sections: {
        ownerData: {
          label: "Owner Data",
          type: "inputs",
          fields: {
            old_submission_attach: {
              label: "Old submission attch",
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: true,
              required: true,
              permission: {
                show_if_props_includes: { key: "oldSub", value: true },
              },
            },
            owner_name: {
              label: "Owner Name",
              maxLength: 60,
              required: true,
            },
            owner_phone: {
              label: "Phone Number",
              placeholder: "Ex 9660000000000",
              digits: true,
              maxLength: 12,
              isFixed: true,
              required: true,
            },
            owner_type: {
              label: "owner type",
              field: "select",
              required: true,
              resetFields: [
                "ownerData.owner_national_id_type",
                "ownerData.owner_national_id_number",
                "ownerData.code_regesteration",
                "ownerData.commercial_registeration",
                "ownerData.nationalIdImage",
                "ownerData.companyImage",
              ],
              data: [
                { label: "فرد", value: "1" },
                { label: "جهة حكومية", value: "2" },
                { label: "مؤسسة أو شركة", value: "3" },
              ],
            },
            owner_national_id_type: {
              label: "National ID Type",
              field: "select",
              fetch: `${workFlowUrl}/NationalIdTypes`,
              moduleName: "NATIONALIDTYPES",
              label_key: "name",
              value_key: "id",
              api_config: { params: { pageIndex: 1, pageSize: 2000 } },
              required: true,
              permission: {
                show_match_value: { owner_type: "1" },
              },
            },
            owner_national_id_number: {
              label: "National ID Number",
              //type: 'number',
              digits: true,
              maxLength: 14,
              required: true,
              permission: {
                show_match_value: { owner_type: "1" },
              },
              nationalNum: { key: "ownerData.owner_national_id_type" },
            },
            code_regesteration: {
              label: "Government ID Number",
              //type: 'number',
              digits: true,
              maxLength: 14,
              required: true,
              permission: {
                show_match_value: { owner_type: "2" },
              },
              nationalNum: { key: "ownerData.owner_national_id_type" },
            },
            commercial_registeration: {
              label: "Company ID Number",
              //type: 'number',
              digits: true,
              maxLength: 14,
              required: true,
              permission: {
                show_match_value: { owner_type: "3" },
              },
              nationalNum: { key: "ownerData.owner_national_id_type" },
            },
            nationalIdImage: {
              label: "National ID Image",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: false,
              required: true,
              maxNumOfFiles: 1,
              permission: {
                show_match_value: { owner_type: "1" },
              },
            },
            companyImage: {
              label: "company ID Image",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: false,
              required: true,
              maxNumOfFiles: 1,
              permission: {
                show_match_value: { owner_type: "3" },
              },
            },
          },
        },
      },
    },

    landData: {
      number: 3,
      label: "Land Data",
      //description: 'this is the Second Step description',
      sections: {
        landData: {
          label: "Land Data",
          type: "inputs",
          fields: {
            municipality_id: {
              label: "Municipality",
              field: "select",
              showSearch: true,
              fetch: `${workFlowUrl}/Municipalities`,
              moduleName: "MUNICIPALITIES",
              label_key: "name",
              value_key: "id",
              api_config: { params: { pageIndex: 1, pageSize: 1000 } },
              required: true,
              resetFields: ["landData.district_id"],
              selectChange: (val, rec, props) => {
                const { t } = props;
                fetchData(
                  `${workFlowUrl}/District/GetDestrictsByMunicipality/${val}`
                ).then(
                  (response) => {
                    props.setSelector("filteredDistricts", {
                      label_key: "name",
                      value_key: "id",
                      data: response,
                    });
                  },
                  (err) => handleErrorMessages(err, t)
                );
              },
            },
            district_id: {
              label: "District",
              field: "select",
              showSearch: true,
              label_key: "name",
              value_key: "id",
              api_config: { params: { pageIndex: 1, pageSize: 1000 } },
              fetch: `${workFlowUrl}/District`,
              required: true,
              moduleName: "filteredDistricts",
            },
            plan_name: {
              label: "Plan name",
            },
            plan_number: {
              label: "Plan Number",
              maxLength: 10,
            },
            land_number: {
              label: "Piece Number",
              maxLength: 10,
            },
            plan_area: {
              label: "Plan Area",
              field: "inputNumber",
              maxLength: 20,
              required: true,
            },
            urban_boundaries_id: {
              label: "Urban Boundaries Phase",
              // maxLength: 10,
              field: "select",
              required: true,
              fetch: `${workFlowUrl}/UrbanBoundry`,
              api_config: { params: { pageIndex: 1, pageSize: 2000 } },
              moduleName: "UrbanBoundries",
              label_key: "name",
              value_key: "id",
            },
            land_usage: {
              label: "Land Usage",
              field: "select",
              fetch: `${workFlowUrl}/LandUsage`,
              api_config: { params: { pageIndex: 1, pageSize: 2000 } },
              moduleName: "LandUsage",
              label_key: "name",
              value_key: "id",
              required: true,
            },
            urban_boundaries_requirements: {
              label: "Urban Boundaries Requirements",
              hideLabel: false,
              field: "fixedUrl",
              items: [
                {
                  url: "uploads/conditions.pdf",
                  type: "pdf",
                },
              ],
            },
            land_location: {
              label: "District Location",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: true,
              //required: true
            },
            plan_image: {
              label: "Plan Image",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: true,
              //required: true
            },
            urban_boundaries_attach: {
              label: "Urban Boundary",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: true,
              //required: true
            },
            riyadh_development_authority_report: {
              label: "Riyadh Development Authority Report",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: true,
              //required: true
            },
            link_with_surroundings: {
              label: "Link with surroundings",
              field: "simpleUploader",
              hideLabel: true,
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: false,
              maxNumOfFiles: 1,
            },
            strategic_use: {
              label: "Strategic use",
              field: "simpleUploader",
              hideLabel: true,
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: true,
            },
          },
        },
      },
    },
    basic_data: {
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
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: true,
              required: true,
            },
            consultant_authorization: {
              label: "Consultant Authorization",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: true,
              required: true,
            },
          },
        },
      },
    },
    ownership_data: {
      number: 5,
      label: "Ownership Data",
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
                  uploadUrl: `${host}uploadFile/`,
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
                  uploadUrl: `${host}uploadFile/`,
                  fileType: "image/*,.pdf",
                  multiple: true,
                  required: true,
                },
              ],
            },
          },
        },
      },
    },
    studies: {
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
              uploadUrl: `${host}uploadFile/`,
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
              uploadUrl: `${host}uploadFile/`,
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
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: true,
            },
          },
        },
      },
    },
    approvalSubmissionNotes: {
      number: 7,
      label: "Notes",
      sections: {
        notes: {
          label: "Notes",
          type: "inputs",
          fields: {
            notes: {
              field: "tableList",
              className: "modal-table",
              label: "approvalSubmissionNotes",
              hideLabel: true,
              value_key: "notes",
              moduleName: "APPROVALSubmissionNotes",
              hideLabels: true,
              inline: true,
              fields: [
                {
                  name: "notes",
                  label: "Notes",
                  field: "textArea",
                  rows: "5",
                },
                {
                  name: "attachments",
                  label: "Attachments",
                  hideLabel: true,
                  field: "simpleUploader",
                  uploadUrl: `${host}uploadFile/`,
                  fileType: "image/*,.pdf",
                  multiple: true,
                },
              ],
            },
          },
        },
      },
    },
    summery: {
      number: 8,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
  },
};
