import React, { Component } from "react";
import * as chartTypes from "./chartTypes";
import { get, indexOf } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
import { connect } from "react-redux";
import { tabsTable } from "../../../apps/modules/tabs/contents";
import * as fetchDataFunctions from "./apiFunctions";
import { withTranslation } from "react-i18next";
import { withRouter } from "apps/routing/withRouter";
import { printHost } from "../../../imports/config";
import { apps } from "../inputs/fields/identify/Component/common/common_func";
export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "lands"),
    ...mapDispatchToProps1(dispatch),
  };
};
class renderChart extends Component {
  constructor(props) {
    super(props);

    this.ChartComponent = get(chartTypes, props.type, chartTypes.bar);
    this.fetch = get(fetchDataFunctions, props.sectionFunction, () => (
      <div>NOT VALID</div>
    )).bind(this);
    this.myRef = React.createRef();
    this.props.setChartResultToPrint(undefined);
  }
  componentDidMount() {
    const { data, setPrint } = this.props;
    // if (!data) {
    this.fetch ? this.fetch() : null;
    // }
  }

  shouldComponentUpdate(prevProps) {
    return (
      prevProps.data !== this.props.data ||
      prevProps.results !== this.props.results
    );
  }

  print() {
    const { name, type, setCurrentChart, appId } = this.props;

    let chartImage =
      this.myRef?.current.myRef.current.chartInstance.toBase64Image(
        "image/png",
        1
      );
    let data = {};
    var cache = [];
    data.label = this.props.title?.replaceAll(
      "(*)",
      apps.find((r) => r.appId == appId)?.name || ""
    );
    data.data = this.props.data;
    data.dataTable = this.props.dataTable;
    data.datesChart = this.props.datesChart;
    data.title = this.props.title?.replaceAll(
      "(*)",
      apps.find((r) => r.appId == appId)?.name || ""
    );
    data.content = JSON.stringify(this.props.content);
    data.results = JSON.stringify(this.props.results);
    let eliminateCircularRecursive = function (key, value) {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return;
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    };
    //data.datasets = JSON.stringify(data.datasets, eliminateCircularRecursive);

    let dimo = JSON.stringify(data, eliminateCircularRecursive);
    // // cache=null
    // localStorage.removeItem("chartImage");
    // localStorage.removeItem("chartInfo");
    // setTimeout(() => {
    //   try {
    //     localStorage.setItem("chartImage", chartImage);
    //     localStorage.setItem("chartInfo", dimo);
    //   } catch (e) {
    //     console.error(e);
    //   }
    this.props.setChartResultToPrint({ chartImage: chartImage, data: dimo });
    setTimeout(() => {
      this.props.history.push("/print_chart");
    }, 1500);
    //window.open(printHost + "/#/print_chart", "_blank");
    // }, 200);
  }

  render() {
    const { label, name, hideLabel, data, dataTable } = this.props;
    const { ChartComponent } = this;

    let TabsTable = dataTable ? tabsTable : () => <div> </div>;
    return (
      <div>
        <div className="grid">
          <button
            className="btn print print-btn"
            onClick={this.print.bind(this, data)}
          >
            طباعة
          </button>
        </div>
        <div
          className="dddop"
          style={{
            display: "flex",
            flexDirection: "row",
            // justifyContent: "center"
          }}
        >
          {data && (
            <div>
              <ChartComponent
                // onElementClick={this.onElementClick}
                {...this.props}
                // style={{flexGrow:1}}
                key={Math.random()}
                ref={this.myRef}
              />
            </div>
          )}

          {data && (
            <div style={{ flex: 2 }} className="chartsTable">
              <TabsTable moduleName={name} {...this.props} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    appMapDispatchToProps
  )(withTranslation("tabs")(renderChart))
);
