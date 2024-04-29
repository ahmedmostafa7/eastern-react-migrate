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

const getEngCompanyRequestsStatistics = (appId, props) => {
  return (
    ([26, 25, 27].indexOf(appId) == -1 && [
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
    ]) ||
    ([25, 27].indexOf(appId) == -1 && [
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
        isInvest: false,
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
        sectionFunction: "SubmnsCountPerSteps",
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
    ]) ||
    ([27].indexOf(appId) == -1 &&
      [
        // {
        //   title: "رسم توضيحي لأنواع معاملات (*) بالجهات",
        //   name: "illustrationChart",
        //   contentType: "Charts",
        //   //extra: 'Print',
        //   //legend: { display: true },
        //   legend: { display: true },
        //   dataTable: true,
        //   type: "pie",
        //   sectionUrl: `/Submission/GetProvinceStatistics?app_id=${appId}`,
        //   sectionFunction: "getAllStatistics",
        //   content: {
        //     type: "tabsTable",
        //     views: ["color_key", "processes_kind", "number"],
        //     id: ["id"],
        //     fields: [
        //       {
        //         label: "labels:LEGEND",
        //         name: "color_key",
        //       },
        //       {
        //         label: "Processes kind",
        //         name: "processes_kind",
        //       },
        //       {
        //         label: "Number of processes",
        //         name: "number",
        //       },
        //     ],
        //   },
        // },
      ]) ||
    []
  );
};

export const STATISTICS = (props) => {
  let charts = {
    number: 9,
    label: "Statistics",
    icon: "images/statistics.svg",
    name: "statistics",
    moduleName: "STATISTICS",
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
          isInvest: false,
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
        // {
        //     title: 'Illustration of transactions types',
        //     name: 'illustrationChart1',
        //     contentType: 'Charts',
        //     legend: { display: true, position: "top" },
        //     dataTable: true,
        //     type: 'bar',
        //     content: {
        //         type: 'tabsTable',
        //         views: ['processes_kind', 'number'],
        //         id: ['id'],
        //         fields: [
        //             {
        //                 label: "Processes kind",
        //                 name: "processes_kind",
        //             },
        //             {
        //                 label: "Number of processes",
        //                 name: "number",
        //             },
        //         ]
        //     },

        // },
        // {
        //     title: 'Illustration of Land Usage',
        //     name: 'illustrationLandUsage',
        //     contentType: 'Charts',
        //     dataTable: true,
        //     type: 'pie',
        //     sectionUrl: `/Submission/GetLandUSageStatistics?app_id=${appId}`,
        //     sectionFunction: 'getLandUsageStatistics',
        //     content: {
        //         type: 'tabsTable',
        //         views: ['land_usage', 'number'],
        //         id: ['id'],
        //         fields: [
        //             {
        //                 label: "Land usage",
        //                 name: "land_usage",
        //             },
        //             {
        //                 label: "Number of processes",
        //                 name: "number",
        //             },
        //         ]
        //     }
        // },
        // {
        //     title: 'Content data sorting services',
        //     name: 'sortingServicesChart',
        //     contentType: 'Charts',
        //     //extra: 'Print',
        //     type: 'sunburst',
        //     sectionUrl: `/submission/GetAllProvStatistics?app_id=${appId}`,
        //     sectionFunction: 'getAllProvStatistics',
        //     dataTable: true,
        //     content: {
        //         type: 'tabsTable',
        //         views: ['municipality_name', 'number'],
        //         id: ['id'],
        //         fields: [
        //             {
        //                 label: "Municipality name",
        //                 name: "municipality_name",
        //             },
        //             {
        //                 label: "Number of processes",
        //                 name: "number",
        //             },
        //         ]
        //     }
        // },

        // {
        //     title: 'Illustration of all transactions by its kind',
        //     name: 'illustrationKindChart',
        //     contentType: 'Charts',
        //     legend: { display: true, position: "top" },
        //     dataTable: true,
        //     extra: 'Print',
        //     type: 'bar',
        //     sectionUrl: `/submission/GetProvinceStatistics?app_id=${appId}`,
        //     sectionFunction: 'getAllStatisticsKind',
        //     content: {
        //         type: 'tabsTable',
        //         views: ['processes_kind', 'running', 'finished', 'rejected'],
        //         id: ['id'],
        //         fields: [
        //             {
        //                 label: "Processes kind",
        //                 name: "processes_kind",
        //             },
        //             {
        //                 label: "runningProcesses",
        //                 name: "running",
        //             },
        //             {
        //                 label: "finishedProcesses",
        //                 name: "finished",
        //             },
        //             {
        //                 label: "rejectedProcesses",
        //                 name: "rejected",
        //             },
        //         ]
        //     }
        // },
        // {
        //     title: 'Illustration of all transactions by year',
        //     name: 'illustrationYearChart',
        //     contentType: 'Charts',
        //     legend: { display: true, position: "top" },
        //     dataTable: true,
        //     extra: 'Print',
        //     type: 'bar',
        //     sectionUrl: `/submission/GetIOStatistics/?app_id=${appId}&KeyType=1`,
        //     sectionFunction: 'getAllStatisticsByDate',
        //     content: commonContent
        // },
        // {
        //     title: 'Illustration of all transactions FirstKind',
        //     name: 'illustrationYearChart2',
        //     contentType: 'Charts',
        //     legend: { display: true, position: "top" },
        //     dataTable: true,
        //     extra: 'Print',
        //     type: 'bar',
        //     content: commonContent
        // },
        // {
        //     title: 'Illustration of all transactions SecondKind',
        //     name: 'illustrationYearChart0',
        //     contentType: 'Charts',
        //     legend: { display: true, position: "top" },
        //     dataTable: true,
        //     extra: 'Print',
        //     type: 'bar',
        //     content: commonContent
        // },
        // {
        //     title: 'Illustration of all transactions ThirdKind',
        //     name: 'illustrationYearChart1',
        //     contentType: 'Charts',
        //     legend: { display: true, position: "top" },
        //     dataTable: true,
        //     extra: 'Print',
        //     type: 'bar',
        //     content: commonContent
        // },
      ],
    },
  };

  
  let additionalCharts = getEngCompanyRequestsStatistics(props.id, props);
  additionalCharts.forEach((chart, index) => {
    charts.content.sections.splice(2, 0, chart);
  });

  return charts;
};
