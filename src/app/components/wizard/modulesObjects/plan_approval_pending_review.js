import { workFlowUrl, host } from "configFiles/config";
// import { fetchData } from 'app/helpers/apiMethods';

export const plan_approval_pending_review = {
  name: "plan_approval_pending_review",
  module_id: 12,
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
    planningStudies: {
      number: 2,
      label: "Planning Studies",
      sections: {
        pendingReview: {
          label: "Pending Review",
          type: "inputs",
          fields: {
            submissions: {
              required: true,
              field: "tableList",
              className: "modal-table",
              label: "Submissions",
              hideLabel: true,
              addFrom: "bottom",
              value_key: "submission_number",
              moduleName: "SUBMISSION_PLAN_APPROVAL",
              hideLabels: true,
              inline: true,
              hideSummaryLabel: true,
              fields: [
                {
                  name: "submission_number",
                  label: "Submission Number",
                  field: "autoValue",
                  permissions: { hide: true },
                  function: "addOne",
                  // required: true
                },
                {
                  name: "submissionDate",
                  label: "Submission Date",
                  field: "hijriDatePicker",
                  lessThanToday: true,
                  required: true,
                },
                {
                  name: "submission_attach",
                  label: "Submission Attachment",
                  hideLabel: true,
                  field: "simpleUploader",
                  uploadUrl: `${host}uploadFile/`,
                  fileType: "image/*,.pdf",
                  multiple: true,
                  required: true,
                },
                {
                  name: "submissionAttachDate",
                  label: "Submission Attach Date",
                  field: "hijriDatePicker",
                  lessThanToday: true,
                  required: true,
                },
                {
                  name: "submission_result_attach",
                  label: "Submission Result",
                  hideLabel: true,
                  field: "simpleUploader",
                  uploadUrl: `${host}uploadFile/`,
                  fileType: "image/*,.pdf",
                  multiple: true,
                  required: true,
                },
                {
                  name: "notes",
                  label: "Notes",
                  maxLength: 100,
                  // required: true
                },
              ],
            },
            notes: {
              label: "General Notes",
              field: "textArea",
              rows: 4,
              maxLength: 100,
            },
          },
        },
      },
    },
    pendingReviewNotes: {
      number: 3,
      label: "Notes",
      sections: {
        notes: {
          label: "Notes",
          type: "inputs",
          fields: {
            notes: {
              field: "tableList",
              className: "modal-table",
              label: "pendingReviewNotes",
              hideLabel: true,
              value_key: "notes",
              moduleName: "PENDINGReviewNotes",
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
