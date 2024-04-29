import React, { Component } from "react";
import { get, map, slice, isEmpty } from "lodash";
import * as chartTypes from "../charts/chartTypes";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import Header from "../portal/header";
import Header2 from "./header";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { tabsTable } from "../../../apps/modules/tabs/contents";
import * as fetchDataFunctions from "../charts/apiFunctions";
import { Row, Col } from "antd";
import {
  backGroundColors,
  hoverColors,
  backGroundColors_circle,
} from "../colors";
import { Button } from "antd";
import { convertToArabic } from "../inputs/fields/identify/Component/common/common_func";
class PrintChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartInfo: null,
      ChartComponent: null,
    };

    // this.fetch = get(fetchDataFunctions, chartInfo.sectionFunction, () => (
    //   <div>NOT VALID</div>
    // )).bind(this);

    //}, 10000)
    this.isLoaded = true;
  }

  componentDidMount() {
    let chartInfo = null;
    const { resultToPrint } = this.props;
    if (this.isLoaded && resultToPrint) {
      this.isLoaded = false;
      let data = JSON.parse(resultToPrint.data);
      chartInfo = { ...data };
      chartInfo.results = JSON.parse(chartInfo.results);
      chartInfo.content = JSON.parse(chartInfo.content);
      if (chartInfo.results) {
        chartInfo.results
          .filter((item) => item.color_key)
          .forEach((item, key) => {
            item.color_key = (item.processes_kind != "إجمالي المعاملات" && (
              <Button
                size="small"
                shape="circle"
                // style={{}}
                // ref={(el) => {
                //   if (el) {
                //     el.props.style={
                //       "background-color":
                //       backGroundColors[key],
                //       "important"
                //     );
                //   }
                // }}
                className={backGroundColors_circle[key]}
              ></Button>
            )) || <></>;
          });
      }
      // localStorage.removeItem("chartImage");
      // localStorage.removeItem("chartInfo");4
      this.setState({
        chartImage: resultToPrint?.chartImage || "",
        chartInfo: chartInfo || null,
        ChartComponent:
          (chartInfo && get(chartTypes, chartInfo.type, chartTypes.bar)) ||
          null,
      });
    }
  }

  // shouldComponentUpdate(prevProps) {
  //
  //   return (
  //     prevProps.resultToPrint !== this.props.resultToPrint ||
  //     prevProps.charts !== this.props.charts
  //   );
  // }

  renderInfo() {
    const { chartInfo, ChartComponent, chartImage } = this.state;
    const { label, name, hideLabel, data, dataTable, title, datesChart } =
      chartInfo;
    const { t } = this.props;
    let TabsTable = dataTable ? tabsTable : () => <div> </div>;
    return (
      <div className="grid customize">
        <Header2 name={t(`${title}`)} dates={datesChart} />
        <section className="print-section">
          <button
            className="btn print print-btn2 hidden2"
            onClick={() => {
              window.print();
            }}
          >
            طباعة
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {/* <ChartComponent
              // onElementClick={this.onElementClick}
              {...chartInfo}
              // style={{flexGrow:1}}
              key={Math.random()}
            /> */}
            <img src={chartImage} style={{ width: "390px", height: "325px" }} />
          </div>
          <div
            style={{
              pageBreakInside: "always",
              overflow: "visible",
              margin: "35px",
              width: "auto",
              display: "table",
            }}
            className={
              label == "Engineering offices evaluations"
                ? "table_print_stat"
                : "rating_tab"
            }
          >
            <TabsTable
              moduleName={name}
              {...chartInfo}
              hideButton={true}
              print={true}
            />
          </div>
        </section>
      </div>
    );
  }

  render() {
    const { chartInfo } = this.state;
    return (chartInfo && this.renderInfo()) || <></>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("tabs")(PrintChart));
