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

export const SURVEYCHECK_INDICATORS_TEAMWORK = (props) => {
  let charts = {
    number: 9,
    label: "team_indicators",
    icon: "images/statistics.svg",
    name: "team_indicators",
    moduleName: "SURVEYCHECK_INDICATORS_TEAMWORK",
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
          teamIndicatorUrl: `/submission/statistics/step/${3153}/currentDelayedCountPerUser`,
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
          title: "مؤشرات فريق العمل",
          name: "illustrationChart13",
          contentType: "Charts",
          //extra: 'Print',
          dataTable: true,
          type: "bar",
          sectionUrl: `/submission/statistics/step/${3153}/currentDelayedCountPerUser`,
          sectionFunction: "checkTeamPerformance",
          content: {
            type: "tabsTable",
            views: ["name", "currentCount", "delayedCount", "finishedCount"],
            id: ["id"],
            fields: [
              {
                label: "Employeename",
                name: "name",
              },
              {
                label: "المعاملات الجارية",
                name: "currentCount",
              },
              {
                label: "المعاملات المتأخرة",
                name: "delayedCount",
              },
              {
                label: "المعاملات المنجزة (المنتهية)",
                name: "finishedCount",
              },
            ],
          },
        },
      ],
    },
  };

  return charts;
};
