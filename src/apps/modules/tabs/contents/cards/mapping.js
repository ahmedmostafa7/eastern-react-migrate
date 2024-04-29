import { get } from "lodash";
export const mapStateToProps = (
  {
    mainApp: { apps, currentApp, charts, currentChart, datesStr },
  },
  ownProps
) => {
  return {
    appId: get(apps, `${currentApp}.id`, 0),
    currentApp: get(apps, currentApp),
    charts: charts,
    currentChart: currentChart,
    datesChart: datesStr || "",
  };
};
