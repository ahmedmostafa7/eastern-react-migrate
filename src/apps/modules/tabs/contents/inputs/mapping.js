import { get } from "lodash";
import { getFormValues } from "redux-form";
import { convertToArabic } from "../../../../../app/components/inputs/fields/identify/Component/common/common_func";

export const mapStateToProps = (state, ownProps) => {
  const { mainApp } = state;
  return {
    values: getFormValues("inputStatisticsForm")(state),
    currentTab: mainApp.currentTab,
    //...mainApp,
    ...get(mainApp.charts, ownProps.name, {}),
    datesChart : mainApp.datesStr || ""
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
    setLoading: (data) => {
      dispatch({
        type: "setMainApp",
        path: "loading",
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
  };
};
