import { workFlowUrl, host } from "configFiles/config";
// import { fetchData } from 'app/helpers/apiMethods';

export const plan_approval_first_approval = {
  name: "plan_approval_first_approval",
  module_id: 13,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    firstApproval: {
      number: 2,
      label: "First Approval",
      sections: {
        firstApproval: {
          label: "First Approval",
          type: "inputs",
          fields: {
            first_plan_number: {
              label: "First Plan Number",
              field: "inputNumber",
              maxLength: 15,
              required: true,
            },
            land_planning_committee_ruling_number: {
              label: "Land Planning Committee Ruling Number",
              field: "inputNumber",
              maxLength: 50,
              required: true,
            },
            ruling_year: {
              label: "Ruling Year",
              field: "hijriDatePicker",
              required: true,
            },
            land_planning_committee_ruling: {
              label: "Land Planning Committee Ruling",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: "image/*,.pdf",
              multiple: false,
              required: true,
              maxNumOfFiles: 1,
            },
            firstDrawingOfPlan: {
              label: "First drawing of Plan",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: ".dwg",
              multiple: true,
              required: true,
            },
          },
        },
      },
    },
    plan_budget: {
      number: 3,
      label: "Plan budget",
      sections: {
        plan_budget: {
          label: "Plan budget",
          type: "inputs",
          hideSummaryLabel: true,
          fields: {
            percentages: {
              moduleName: "percentages",
              field: "multiTableList",
              label: "Percentages",
              hideLabel: true,
              hideSummaryLabel: true,
              required: true,
              value_key: "usage",
              ObjectHasLength: ["OWNER", "PLAN"],
              inline: true,
              tablesField: {
                name: "percentage_type",
                label: "Percentage type",
                field: "select",
                config: {
                  selectValues: ["OWNER", "PLAN"],
                  sum: "area",
                  sum_to: "plan_budget.percentages",
                  sumFields: ["area", "area_percentage"],
                },
                split: [
                  { label: "المالك", moduleName: "OWNER" },
                  { label: "التخطيط", moduleName: "PLAN" },
                ],
              },
              fields: [
                {
                  name: "usage",
                  label: "Usage",
                  field: "select",
                  moduleName: "PLANUSAGE",
                  label_key: "name",
                  value_key: "name",
                  api_config: { params: { pageIndex: 1, pageSize: 2000 } },
                  fetch: `${workFlowUrl}/PlanUsage`,
                  required: true,
                },
                {
                  name: "number_of_pieces",
                  label: "Number of pieces",
                  digits: true,
                },
                {
                  name: "area",
                  label: "Area",
                  required: true,
                  digits: true,
                },
                {
                  name: "area_percentage",
                  label: "Area percentage %",
                  permissions: { hide: true },
                  field: "percentage",
                },
              ],
            },
          },
        },
      },
    },

    finalApprovalCheck: {
      number: 4,
      label: "Final Approval Check",
      sections: {
        finalApproval: {
          label: "Final Approval Check",
          type: "inputs",
          hideSummaryLabel: true,
          fields: {
            finalApprovalCheck: {
              field: "fixedTable",
              hideLabel: true,
              required: true,
              ObjectHasOne: ["check"],
              fields: {
                issuer: {
                  label: "Issuer",
                  Fixed: true,
                  data: [
                    {
                      value: "المساحة / البلدية الفرعية",
                    },
                    {
                      value: "الدراسات والتصميم",
                      rowSpan: 2,
                    },
                    {
                      value: "الدراسات والتصميم",
                      rowSpan: 0,
                    },
                    {
                      value: "التنفيذ والاشراف",
                      rowSpan: 3,
                    },
                    {
                      value: "التنفيذ والاشراف",
                      rowSpan: 0,
                    },
                    {
                      value: "التنفيذ والاشراف",
                      rowSpan: 0,
                    },
                    {
                      value: "تقنية المعلومات والخدمات الالكترونية",
                    },
                    {
                      value: "التسمية والترقيم",
                    },
                    {
                      value: "شركة المياه الوطنية",
                      rowSpan: 2,
                    },
                    {
                      value: "شركة المياه الوطنية",
                      rowSpan: 0,
                    },
                    {
                      value: "الشركة السعودية للكهرباء",
                      rowSpan: 2,
                    },
                    {
                      value: "الشركة السعودية للكهرباء",
                      rowSpan: 0,
                    },
                  ],
                },
                subject: {
                  Fixed: true,
                  label: "Subject",
                  data: [
                    {
                      value: "التطبيق على الطبيعة",
                    },
                    {
                      value: "قطاعات ومناسيب شوارع المخطط",
                    },
                    {
                      value: "تصريف السيول والعبارات",
                    },
                    {
                      value: "تصريف انارة الجزر الوسطى",
                    },
                    {
                      value: "تنفيذ رصف الجزر الوسطى",
                    },
                    {
                      value: "تنفيذ سفلتة الشوارع",
                    },
                    {
                      value: "تنزيل المخطط على خريطة الاساس",
                    },
                    {
                      value: "التسمية والترقيم والتأكد من اسم الحى",
                    },
                    {
                      value: "تنفيذ شبكة المياه",
                    },
                    {
                      value: "تنفيذ شبكة الصرف الصحى",
                    },
                    {
                      value: "تحديد مواقع محطات التوزيع",
                    },
                    {
                      value: "تمديد شبكة الكهرباء",
                    },
                  ],
                },
                check: {
                  label: "Check",
                  sameRowSpan: "subject",
                  hideLabel: true,
                  field: "boolean",
                },
              },
            },
          },
        },
      },
    },
    firstApprovalNotes: {
      number: 5,
      label: "Notes",
      sections: {
        notes: {
          label: "Notes",
          type: "inputs",
          fields: {
            notes: {
              field: "tableList",
              label: "firstApprovalNotes",
              className: "modal-table",
              hideLabel: true,
              value_key: "notes",
              moduleName: "FIRSTApprovalNotes",
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
  },
};
