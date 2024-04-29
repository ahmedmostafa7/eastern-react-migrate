import { workFlowUrl, host } from "configFiles/config";
// import { fetchData } from 'app/helpers/apiMethods';

export const plan_approval_final_approval = {
  name: "plan_approval_final_approval",
  module_id: 14,
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
    finalApproval: {
      number: 2,
      label: "Final Approval",
      sections: {
        finalApproval: {
          label: "Final Approval",
          type: "inputs",
          hideSummaryLabel: true,
          fields: {
            finalDrawingOfPlan: {
              label: "Final drawing of Plan",
              hideLabel: true,
              field: "simpleUploader",
              uploadUrl: `${host}uploadFile/`,
              fileType: ".dwg",
              multiple: true,
              required: true,
            },
            finalApproval: {
              field: "fixedTable",
              hideLabel: true,
              //ObjectsHas:['issuer', 'subject', 'outbox.number', 'outbox.date', 'outbox.attachment', 'inbox.number', 'inbox.date', 'inbox.attachment'],
              fields: {
                issuer: {
                  label: "Issuer",
                  Fixed: true,
                  check: {
                    props: "finalApprovalCheck",
                    key: "issuer",
                    firstColumn: "issuer",
                    secondColumn: "subject",
                  },
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
                  check: {
                    props: "finalApprovalCheck",
                    key: "subject",
                    firstColumn: "issuer",
                    secondColumn: "subject",
                  },
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
                outbox: {
                  label: "Outbox",
                  fields: {
                    number: {
                      label: "Number",
                      sameRowSpan: "subject",
                      hideLabel: true,
                      maxLength: 15,

                      required: true,
                    },
                    date: {
                      label: "Date",
                      sameRowSpan: "subject",
                      hideLabel: true,
                      field: "hijriDatePicker",
                      lessThanToday: true,
                      required: true,
                    },
                    attachment: {
                      label: "Attachment",
                      sameRowSpan: "subject",
                      hideLabel: true,
                      field: "simpleUploader",
                      uploadUrl: `${host}uploadFile/`,
                      fileType: "image/*,.pdf",
                      multiple: false,
                      maxNumOfFiles: 1,
                      required: true,
                    },
                  },
                },
                inbox: {
                  label: "Inbox",
                  fields: {
                    number: {
                      label: "Number",
                      sameRowSpan: "subject",
                      hideLabel: true,
                      digits: true,
                      required: true,
                      maxLength: 15,
                    },
                    date: {
                      label: "Date",
                      sameRowSpan: "subject",
                      required: true,
                      hideLabel: true,
                      field: "hijriDatePicker",
                      lessThanToday: true,
                    },
                    attachment: {
                      label: "Attachment",
                      sameRowSpan: "subject",
                      required: true,
                      hideLabel: true,
                      maxNumOfFiles: 1,
                      field: "simpleUploader",
                      uploadUrl: `${host}uploadFile/`,
                      fileType: "image/*,.pdf",
                      multiple: false,
                    },
                  },
                },
                notes: {
                  label: "Notes",
                  sameRowSpan: "subject",
                  hideLabel: true,
                  maxLength: 100,
                },
              },
            },
          },
        },
      },
    },
    finalApprovalNotes: {
      number: 3,
      label: "Notes",
      sections: {
        notes: {
          label: "Notes",
          type: "inputs",
          fields: {
            notes: {
              field: "tableList",
              label: "finalApprovalNotes",
              className: "modal-table",
              hideLabel: true,
              value_key: "notes",
              moduleName: "FINALApprovalNotes",
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
