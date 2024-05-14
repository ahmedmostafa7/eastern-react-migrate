export const DRAFT_SUBMISSIONS = ({ id: appId }) => ({
  number: 5,
  label: "Drafts",
  name: "draft",
  moduleName: "DRAFT_SUBMISSIONS",
  apiUrl: `/drafts/GetDraftsByUserID/${appId}`,
  content: {
    type: "tabsTable",
    views: ["name", "created_at"],
    id: ["id"],
    actions: {
      continue: {
        name: "continue",
        label: "Continue",
        function: "continueSubmission",
        class: "continue"
      },
      delete: {
        name: "delete",
        label: "Delete",
        url: `/api/draft/`,
        function: "deleteFunc",
        class: "delete"
      }
    },
    fields: [
      {
        label: "Name",
        name: "name",
        sorter: "sortName",
        field: "text"
      },
      {
        label: "Created at",
        name: "created_at",
        field: "textDate",
        sorter: "sortDate"
      }
    ]
  },
  icon: "../images/draft.svg"
});
