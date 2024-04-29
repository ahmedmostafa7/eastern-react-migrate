import { get } from "lodash";

export const mapStateToProps = ({ mainApp }) => {
  return {
    app_id: get(mainApp.apps, mainApp.currentApp, {}).id,
    currentChart: get(mainApp, `charts.currentChart`, ""),
    charts: mainApp.charts,
    currentTab: mainApp.currentTab,
    resultToPrint: mainApp.resultToPrint
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    setChartData: (data, path) => {
      dispatch({
        type: "setMainApp",
        path: `charts.${path}`,
        data,
      });
    },
    setData: (data) => {
      dispatch({
        type: "setMainApp",
        path: `charts.printData`,
        data,
      });
    },
    setLoading: (data) => {
      dispatch({
        type: "setMainApp",
        path: "loading",
        data,
      });
    },
    setPrint: (data) => {
      dispatch({
        type: "setMainApp",
        path: "print",
        data,
      });
    },
    setCurrentChart: (data) => {
      dispatch({
        type: "setMainApp",
        path: "charts.currentChart",
        data,
      });
    },
  };
};
