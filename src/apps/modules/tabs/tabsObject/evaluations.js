export const RATING = ({ id: appId }) => ({
  number: 8,
  label: "Evaluations",
  name: "evaluations",
  moduleName: "RATING",
  icon: "images/evaluation.svg",
  content: {
    type: "cards",
    sections: [
      {
        title: "Engineering offices evaluations",
        name: "evaluationChart",
        contentType: "Charts",
        legend: { display: false },
        className: "delete_alert",
        dataTable: true,
        //extra: "Print",
        type: "pie",
        //apiUrl:'/submission/GetWarningStatistics?pageNum=0&app_id=1',
        sectionUrl: `/submission/GetWarningStatistics?pageNum=0&app_id=${appId}`,
        sectionFunction: "getEvaluationData",
        id: ["id"],
        content: {
          type: "tabsTable",
          views: ["color_key", "name", "count"],
          id: ["id"],
          actions: {
            delete: {
              name: "get",
              label: "Delete alert",
              class: "delete_alert",
              function: "deleteFunc",
              deleteFrom: "charts.evaluationChart",
              url: "/submission/ResetWarning?eng_comp_id=",
              reloadUrl: `/submission/GetWarningStatistics?pageNum=0&app_id=${appId}`,
              // permission: { show_if_val_equal: "ss" },
            },
            // class: "delete_alert",
          },
          fields: [
            {
              label: "Color key",
              name: "color_key",
            },
            {
              label: "Office name",
              name: "name",
            },
            {
              label: "Alerts number",
              name: "count",
            },
          ],
        },
      },
    ],
  },
});
