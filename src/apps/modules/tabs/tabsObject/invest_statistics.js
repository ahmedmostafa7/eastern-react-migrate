const commonContent = {
  type: "tabsTable",
  views: ["date", "input", "output", "total"],
  id: ["id"],
  fields: [
    {
      label: "Year period",
      name: "date",
    },
    {
      label: "Inputs",
      name: "input",
    },
    {
      label: "Outputs",
      name: "output",
    },
    {
      label: "Number of processes",
      name: "total",
    },
  ],
};

const getEngCompanyRequestsInvestStatistics = (appId, props) => {
  
  return (
    (appId != 26 && [
      {
        title: "رسم توضيحي لأعداد معاملات (*) بالمكاتب الهندسية",
        name: "illustrationChart2",
        contentType: "Charts",
        //extra: 'Print',
        legend: { display: false },
        dataTable: true,
        type: "pie",
        sectionUrl: `/Submission/GetEngCompanyRequestsStatistics?app_id=${appId}`,
        sectionFunction: "GetEngCompanyRequestsStatistics",
        content: {
          type: "tabsTable",
          views: ["color_key", "name", "count"],
          id: ["id"],
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
              label: "Number of processes",
              name: "count",
            },
          ],
        },
      },
    ]) || [
      {
        title: "مؤشرات (*) للمعاملات المتأخرة",
        name: "illustrationChart5",
        contentType: "Charts",
        //extra: 'Print',
        //legend: { display: true },
        legend: { display: false },
        dataTable: true,
        type: "bar",
        sectionUrl: `/submission/statistics/app/${appId}/ProgressPerStep`,
        isInvest: true,
        sectionFunction: "SubmnsCountPerStepDelayed",
        content: {
          type: "tabsTable",
          views: ["name", "inTimeCount", "warningCount", "delayedCount"],
          id: ["id"],
          fields: [
            // {
            //   label: "مفتاح الخطوات",
            //   name: "color_key",
            // },
            {
              label: "Step name",
              name: "name",
            },
            {
              label: "معاملات فى وقتها",
              name: "inTimeCount",
            },
            {
              label: "معاملات قربت على التأخير",
              name: "warningCount",
            },
            {
              label: "معاملات متأخرة",
              name: "delayedCount",
            },
          ],
        },
      },
      {
        title: "مؤشرات (*)",
        name: "illustrationChart4",
        contentType: "Charts",
        //extra: 'Print',
        //legend: { display: true },
        legend: { display: false },
        dataTable: true,
        type: "pie",
        sectionUrl: `/submission/statistics/workflow/${2154}/SubmnsCountPerStep`,
        sectionFunction: "SubmnsCountPerStep",
        content: {
          type: "tabsTable",
          views: ["color_key", "stepName", "number"],
          id: ["id"],

          fields: [
            {
              label: "مفتاح الخطوات",
              name: "color_key",
            },
            {
              label: "Step name",
              name: "stepName",
            },
            {
              label: "Number of processes",
              name: "number",
            },
          ],
        },
      },
    ]
  );
};

export const INVESTMENT_STATISTICS = (props) => {
  let charts = {
    number: 9,
    label: "investment_Statistics",
    icon: "images/statistics.svg",
    name: "investment_Statistics",
    moduleName: "INVESTMENT_STATISTICS",
    content: {
      type: "cards",
      sections: [
        {
          title: "",
          name: "filters",
          SubmnsCountPerStepUrl: `/submission/statistics/workflow/${2154}/SubmnsCountPerStep`,
          ProgressPerStepUrl: `/submission/statistics/app/${props.id}/ProgressPerStep`,
          pieChartUrl: `/Submission/GetProvinceStatistics?app_id=${props.id}`,
          sunBurstUrl: `/submission/GetAllProvStatistics?app_id=${props.id}`,
          GetProvinceStatisticsUrl: `/submission/GetProvinceStatistics?app_id=${props.id}`,
          GetEngCompanyRequestsStatisticsUrl: `/Submission/GetEngCompanyRequestsStatistics?app_id=${props.id}`,
          isInvest: true,
          contentType: "Inputs",
          buttonTitle: "Filter",
          fields: [
            {
              name: "from",
              label: "From date",
              field: "hijriDatePicker",
              dateFormat: "iYYYY/iMM/iDD",
              lessThanToday: true,
              lessThanDate: { key: "to", label: "الى تاريخ" },
            },
            {
              name: "to",
              label: "To date",
              field: "hijriDatePicker",
              dateFormat: "iYYYY/iMM/iDD",
              lessThanToday: true,
              moreThanDate: { key: "from", label: "من تاريخ" },
            },
          ],
        },
        {
          title: "رسم توضيحي لأنواع معاملات (*)",
          name: "illustrationChart",
          contentType: "Charts",
          //extra: 'Print',
          //legend: { display: true },
          legend: { display: true },
          dataTable: true,
          type: "pie",
          sectionUrl: `/Submission/GetProvinceStatistics?app_id=${props.id}`,
          sectionFunction: "getAllStatistics",
          content: {
            type: "tabsTable",
            views: ["color_key", "processes_kind", "number"],
            id: ["id"],
            fields: [
              {
                label: "labels:LEGEND",
                name: "color_key",
              },
              {
                label: "Processes kind",
                name: "processes_kind",
              },
              {
                label: "Number of processes",
                name: "number",
              },
            ],
          },
        },
        {
          title: "رسم توضيحي لأعداد معاملات (*) بالنسبة لمسارات العمل",
          name: "illustrationChart3",
          contentType: "Charts",
          //extra: 'Print',
          dataTable: true,
          type: "bar",
          sectionUrl: `/submission/GetProvinceStatistics?app_id=${props.id}`,
          sectionFunction: "GetProvinceStatistics",
          content: {
            type: "tabsTable",
            views: ["processes_kind", "running", "finished", "rejected"],
            id: ["id"],
            fields: [
              {
                label: "Workflow kind",
                name: "processes_kind",
              },
              {
                label: "runningProcesses",
                name: "running",
              },
              {
                label: "finishedProcesses",
                name: "finished",
              },
              {
                label:
                  (props.id == 26 && "canceledProcesses") ||
                  "rejectedProcesses",
                name: "rejected",
              },
            ],
          },
        },
      ],
    },
  };

  
  let additionalCharts = getEngCompanyRequestsInvestStatistics(props.id, props);
  additionalCharts.forEach((chart, index) => {
    charts.content.sections.splice(2, 0, chart);
  });

  return charts;
};