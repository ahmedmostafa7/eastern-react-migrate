import React, { Component } from "react";
import { Button, Pagination } from "antd";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import style from "./style.less";
import { view, print, followUp } from "../../tableActionFunctions/tableActions";
import { withTranslation } from "react-i18next";
import { withRouter } from "apps/routing/withRouter";
import { get, isEmpty, pick, concat } from "lodash";
import { fetchData } from "app/helpers/apiMethods";
import { SearchForm } from "./searchForm";
import axios from "axios";
// import planStatus from 'app/components/wizard/plan_status';
import { printHost } from "imports/config";
import { convertToArabic } from "../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { executePlanMapping } from "../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/mapping";
import { setEngUserName } from "../../../../../app/components/wizard/modulesObjects/plan_approval/print/printDefaults";
import { workFlowUrl, backEndUrlforMap } from "../../../../../imports/config";
class FinishedComponent extends Component {
  constructor(props) {
    super(props);
    this.pageSize = props.pageSize || 10;
    this.state = {
      results: [],
      next: "",
      count: "",
      totalFinishedPage: 0,
      minFinishedIndex: 0,
      maxFinishedIndex: 1 * this.pageSize,
      currentFinishedPage: 1,
    };
    this.getMoreData = this.getMoreData.bind(this);
    this.isLoaded = true;
  }

  setScrollEvents() {
    this.FinishedContent = document.querySelector(".searchBack");
    this.FinishedContent.addEventListener("scroll", this.getMoreData);
  }

  getMoreData(event) {
    const { next, count, results } = this.state;
    let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    let currentScroll = event.target.scrollTop;

    if (Math.ceil(currentScroll) >= maxScroll) {
      if (next && results.length < count) {
        this.fetchTableData(next.replace("/api", ""));
        this.FinishedContent.scrollTop = this.FinishedContent.scrollTop - 50;
      }
    }
  }

  componentWillUnmount() {
    this.FinishedContent
      ? this.FinishedContent.removeEventListener("scroll", this.getMoreData)
      : null;
  }

  componentDidMount() {
    if (this.isLoaded) {
      this.isLoaded = false;
      const { apiUrl, currentApp, t } = this.props;
      this.getValues({}, "search", 1);
    }
  }

  fetchTableData(url) {
    fetchData(url).then((data) => {
      ////
      this.setState({
        results: concat(this.state.results, data.results),
        next: data.next,
        count: data.count,
      });
    });
  }

  getMainObjectsBySubmissionPath(data) {
    return new Promise((resolve, reject) => {
      let i = 0;
      if (data.results.length > 0) {
        data.results.map((submission) => {
          submission.engUserName = get(
            submission,
            "submission_history[0].users.name",
            submission.CreatorUser.name
          );

          // axios
          //   .get(
          //     backEndUrlforMap +
          //       submission.submission_file_path +
          //       "mainObject.json"
          //   )
          //   .then(
          //     (response) => {
          //       if (response.data.hasOwnProperty("search_survey_report")) {
          //         submission.mainObject = executePlanMapping(
          //           response.data,
          //           false
          //         );
          //       } else {
          //         submission.mainObject = response.data;
          //       }
          //       i++;

          //       if (i == data.results.length - 1) {
          //         return resolve(data);
          //       }
          //     },
          //     (response) => {
          //       i++;
          //       submission.mainObject = {};
          //       if (i == data.results.length - 1) {
          //         return resolve(data);
          //       }
          //     }
          //   );
        });
      }
      //else {
      return resolve(data);
      //}
    });
  }

  getValues(values, button, currentPageNo) {
    const { apiUrl, currentApp, t } = this.props;
    // if (button.includes("search")) { //

    axios
      .get(
        window.workFlowUrl +
          (apiUrl + "?" + `pageNum=${currentPageNo}`).replace(
            "/" +
              window.workFlowUrl.substring(
                window.workFlowUrl.lastIndexOf("/") + 1,
                window.workFlowUrl.length
              ),
            ""
          )
      )
      .then((response) => {
        ////
        this.getMainObjectsBySubmissionPath(response.data).then((data) => {
          this.setState({
            ...response.data,
            totalFinishedPage: response.data.count,
            minFinishedIndex: 0,
            maxFinishedIndex: this.pageSize,
            nextUrl: response.data.next,
            criteria: values,
          });
          if (!response.data.results) {
            window.notifySystem("warning", t("No data found"));
          }
        });
      });
    !this.FinishedContent
      ? this.setScrollEvents()
      : (this.FinishedContent.scrollTop = 0);
    // } else {
    //   fetchData(apiUrl + "0", { params: config }).then((data) => {
    //     let newWindow = window.open(
    //       `${printHost}/#/print_report`,
    //       "Report",
    //       data
    //     );
    //     newWindow.submissions = get(data, "results", []);
    //   });
    // }
    //}
    //}
  }

  handleFinishedChange = (page) => {
    this.setState({
      currentFinishedPage: page,
      minFinishedIndex: 0,
      maxFinishedIndex: this.pageSize,
    });

    this.getValues(this.state.criteria || {}, "search", page);
  };

  render() {
    const {
      results,
      currentFinishedPage,
      minFinishedIndex,
      maxFinishedIndex,
      totalFinishedPage,
    } = this.state;
    const { t } = this.props;
    return (
      <div className={style.archive_layout}>
        {/* <SearchForm onSubmit={this.getValues.bind(this)} /> */}

        {/* {results.length !== 0 ? (
          <h2 style={{ textAlign: "right" }}> النتائج </h2>
        ) : (
          false
        )} */}
        <Pagination
          pageSize={this.pageSize}
          current={currentFinishedPage}
          total={totalFinishedPage}
          onChange={this.handleFinishedChange}
          style={{
            bottom: "0px",
            margin: "0px 0px 40px 0px",
            position: "relative",
          }}
        />
        {totalFinishedPage > 0 && (
          <div style={{ textAlign: "right", marginRight: "10px" }}>
            <h5>{`اجمالي المعاملات المنتهية :  ${convertToArabic(
              totalFinishedPage
            )}`}</h5>
          </div>
        )}
        <table className="table archiveTable">
          <tbody>
            {results &&
              results.map((data, i) => {
                // const step_admin = data.assign_to_group_id || data.assign_to_position_id || data.assign_to_user_id;
                return (
                  i >= minFinishedIndex &&
                  i < maxFinishedIndex && (
                    <tr className={style.archive_data} key={i}>
                      {" "}
                      <div className={style.archive_print}>
                        <Button
                          className="btn view"
                          icon="windows"
                          onClick={view.bind(this, data)}
                        >
                          عرض
                        </Button>
                        <Button
                          className="btn follow"
                          icon="rise"
                          onClick={followUp.bind(this, data)}
                        >
                          متابعة
                        </Button>
                        <Button
                          className="btn print noMobile"
                          icon="printer"
                          onClick={print.bind(this, data)}
                        >
                          طباعة
                        </Button>
                      </div>
                      <td>
                        <label>{t("Request No")} :</label>
                        <span className="tdData">
                          {convertToArabic(data.request_no)}
                        </span>
                      </td>
                      <td>
                        <label>تاريخ المعاملة :</label>
                        <span className="tdData">
                          {convertToArabic(data.create_date)} هـ
                        </span>
                      </td>
                      <td>
                        <label>{t("labels:Step Name")} :</label>
                        <span className="tdData">
                          {" "}
                          {get(data, "CurrentStep.name")}
                        </span>
                      </td>
                      <td>
                        <label>{t("labels:REQUESTEMPLOYEE")} :</label>
                        <span className="tdData">
                          {" "}
                          {get(data, "engUserName")}
                        </span>
                      </td>
                      <td>
                        <label>{t("Owner Name")}:</label>
                        {data.owner_name}
                      </td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>
        <Pagination
          pageSize={this.pageSize}
          current={currentFinishedPage}
          total={totalFinishedPage}
          onChange={this.handleFinishedChange}
          style={{
            bottom: "0px",
            margin: "0px 0px 40px 0px",
            position: "relative",
          }}
        />
      </div>
    );
  }
}

export const Finished = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("tabs")(FinishedComponent))
);
