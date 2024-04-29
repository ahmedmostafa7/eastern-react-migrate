import { get } from "lodash";
import { convertToArabic } from "../inputs/fields/identify/Component/common/common_func";

export const mapStateToProps = ({ mainApp }, ownProps) => {
  return {
    currentTab: mainApp.currentTab,
    //...mainApp,
    appId: get(mainApp.apps, `${mainApp.currentApp}.id`, 0),
    ...get(mainApp.charts, ownProps.name, {}),
    currentChart: mainApp.currentChart,
    datesChart : mainApp.datesStr || ""
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    setChartData: (data, chartPath) => {
      //

      dispatch({
        type: "setMainApp",
        path: `charts.${chartPath}`,
        data,
      });
      //   dispatch({
      //     type: "setMainApp",
      //     path: "currentChart",
      //     chartPath,
      //   });
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
        path: "currentChart",
        data,
      });
    },
    setChartsDates: (from, to) => {
      dispatch({
        type: "setMainApp",
        path: `datesStr`,
        data: `من ${convertToArabic(from)} هـ إلى ${convertToArabic(to)} هـ`,
      });
    },
    setChartResultToPrint: (data) => {
      dispatch({
        type: "setMainApp",
        path: `resultToPrint`,
        data
      });
    },
  };
};
