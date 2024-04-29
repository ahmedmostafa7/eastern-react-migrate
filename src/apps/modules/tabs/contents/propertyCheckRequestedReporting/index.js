import React, { Component } from "react";
import { Button, Pagination } from "antd";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import style from "./style.less";
import { view, print, followUp } from "../../tableActionFunctions/tableActions";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import { get, isEmpty, pick, concat } from "lodash";
import { fetchData, postItem } from "app/helpers/apiMethods";
import { SearchForm } from "./searchForm";
import axios from "axios";
import { printHost } from "imports/config";
import { convertToArabic } from "../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { executePlanMapping } from "../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/mapping";
import { setEngUserName } from "../../../../../app/components/wizard/modulesObjects/plan_approval/print/printDefaults";
import { workFlowUrl, backEndUrlforMap } from "../../../../../imports/config";
import { jsonData } from "./json_inputs";
class PropertyCheckRequestedReportingComponent extends Component {
  constructor(props) {
    super(props);
    this.pageSize = props.pageSize || 10;
    this.state = {
      results: [],
      next: "",
      count: "",
      totalPropertyCheckPage: 0,
      minPropertyCheckIndex: 0,
      maxPropertyCheckIndex: 1 * this.pageSize,
      currentPropertyCheckPage: 1,
    };

    this.getMoreData = this.getMoreData.bind(this);
    this.isLoaded = true;
    this.myRef = React.createRef();
    this.autoClick = false;
  }

  setScrollEvents() {
    this.PropertyCheckContent = document.querySelector(".searchBack");
    this.PropertyCheckContent.addEventListener("scroll", this.getMoreData);
  }

  getMoreData(event) {
    const { next, count, results } = this.state;
    let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    let currentScroll = event.target.scrollTop;

    if (Math.ceil(currentScroll) >= maxScroll) {
      if (next && results.length < count) {
        this.fetchTableData(next.replace("/api", ""));
        this.PropertyCheckContent.scrollTop =
          this.PropertyCheckContent.scrollTop - 50;
      }
    }
  }

  componentWillUnmount() {
    this.PropertyCheckContent
      ? this.PropertyCheckContent.removeEventListener(
          "scroll",
          this.getMoreData
        )
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

  getInvestType(type) {
    let types = [
      { label: "طرح موقع استثماري جديد", value: "newLocation" },
      { label: "إعادة طرح موقع استثماري", value: "updateLocation" },
    ];

    return types.find((t) => t.value == type)?.label;
  }

  getMainObjectsBySubmissionPath(data) {
    return new Promise((resolve, reject) => {
      let i = 0;
      if (data?.results?.length) {
        data.results.map(async (submission) => {
          submission.engUserName =
            submission.CreatorUser.name ||
            get(
              submission,
              "submission_history[0].users.name",
              submission.CreatorUser.name
            );

          try {
            let res = await axios.get(
              backEndUrlforMap +
                submission.submission_file_path +
                "mainObject.json"
            );

            res.data =
              (typeof res.data == "string" &&
                JSON.parse(window.lzString.decompressFromBase64(res.data))) ||
              res.data;
            if (res.data.hasOwnProperty("search_survey_report")) {
              submission.mainObject = executePlanMapping(res.data, false);
            } else {
              submission.mainObject = res.data;
            }
          } catch (err) {}
          i++;

          if (i == data.results.length) {
            return resolve(data);
          }
        });
      } else {
        return resolve(data);
      }
    });
  }

  getValues(values, button, currentPageNo) {
    const { apiUrl, currentApp, t } = this.props;
    if (!isEmpty(values)) {
      if (
        (values.search_with &&
          (values.SubmissionType || values.municipalityCode)) ||
        values.from_date ||
        values.to_date
      ) {
        if (this.autoClick) {
          this.autoClick = false;
          return;
        }

        let dataParams;

        values["search_with"] == "SubmissionType"
          ? (dataParams = {
              status: values["SubmissionType"],
            })
          : values["search_with"] == "municipalityCode"
          ? (dataParams = {
              municipality_code: values["municipalityCode"],
            })
          : (dataParams = {});

        ////
        const config = {
          app_id: currentApp.id,
          ...dataParams,
          ...pick(values, ["from_date", "to_date"]),
        };
        if (!button) return;
        if (button.includes("search")) {
          postItem(
            apiUrl + "?" + `pageNum=${currentPageNo || 1}`,
            JSON.stringify(jsonData),
            {
              params: config,
              headers: {
                "content-type": "application/json",
              },
            }
          ).then((data) => {
            //this.getMainObjectsBySubmissionPath(response).then((data) => {
            this.setState({
              ...data,
              totalPropertyCheckPage: data.count,
              minPropertyCheckIndex: 0,
              maxPropertyCheckIndex: this.pageSize,
              nextUrl: data.next,
              criteria: values,
              currentPropertyCheckPage: currentPageNo || 1,
              resultToExport: [],
            });

            if (isEmpty(data.results)) {
              window.notifySystem("warning", t("No data found"));
            }
            //  });
          });
          !this.PropertyCheckContent
            ? this.setScrollEvents()
            : (this.PropertyCheckContent.scrollTop = 0);
        } else {
          postItem(`${workFlowUrl}/search-json/`, JSON.stringify(jsonData), {
            params: { all: true, ...config },
            headers: {
              "content-type": "application/json",
            },
          }).then(async (data) => {
            //data.results = data.results.filter((r) => !_.isEmpty(r.json_props));

            this.setState(
              {
                resultToExport: [
                  ...data.results.map((r, i) => ({ no: i + 1, ...r })),
                  {
                    no: "اجمالي عدد المعاملات",
                    request_no: `${data.count} معاملة`,
                  },
                ],
                // data.results.map((r, i) => ({
                //   no: i + 1,
                //   ...r,
                // })),
              },
              () => {
                let ref = this?.myRef;
                if (ref && ref?.current?.click) {
                  this.autoClick = true;
                  ref.current.click();
                }
              }
            );

            if (isEmpty(data.results)) {
              window.notifySystem("warning", t("No data found"));
            }
          });
        }
      }
    }
  }

  handlePropertyCheckChange = (page) => {
    this.setState({
      currentPropertyCheckPage: page,
      minPropertyCheckIndex: 0,
      maxPropertyCheckIndex: this.pageSize,
    });

    this.getValues(this.state.criteria || {}, "search", page);
  };

  clearData() {
    this.setState({
      resultToExport: [],
      results: [],
      totalPropertyCheckPage: 0,
    });
  }

  render() {
    const {
      results,
      currentPropertyCheckPage,
      minPropertyCheckIndex,
      maxPropertyCheckIndex,
      totalPropertyCheckPage,
      resultToExport,
    } = this.state;
    const { t } = this.props;
    return (
      <div className={style.archive_layout}>
        <SearchForm
          onSubmit={this.getValues.bind(this)}
          resultsToExport={resultToExport}
          pageNo={""}
          myRef={this.myRef}
          clearData={this.clearData.bind(this)}
        />

        {/* {results.length !== 0 ? (
          <h2 style={{ textAlign: "right" }}> النتائج </h2>
        ) : (
          false
        )} */}
        {results.length > 0 && (
          <Pagination
            pageSize={this.pageSize}
            current={currentPropertyCheckPage}
            total={totalPropertyCheckPage}
            onChange={this.handlePropertyCheckChange}
            style={{
              bottom: "0px",
              margin: "0px 0px 40px 0px",
              position: "relative",
            }}
          />
        )}
        {results.length > 0 && totalPropertyCheckPage > 0 && (
          <div style={{ textAlign: "right", marginRight: "10px" }}>
            <h5>{`اجمالي المعاملات :  ${convertToArabic(
              totalPropertyCheckPage
            )}`}</h5>
          </div>
        )}
        <table className="table archiveTable">
          <tbody>
            {results.length > 0 &&
              results.map((data, i) => {
                // const step_admin = data.assign_to_group_id || data.assign_to_position_id || data.assign_to_user_id;
                return (
                  i >= minPropertyCheckIndex &&
                  i < maxPropertyCheckIndex && (
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
                      {[3020, 3021].indexOf(get(data, "CurrentStep.id", "")) !=
                        -1 && (
                        <td>
                          <label>{t("labels:Step Name")} :</label>
                          <span className="tdData">
                            {" "}
                            {`${get(data, "CurrentStep.name")} (${get(
                              data,
                              "mainObject.landData.landData.lands.parcels[0].attributes.SUB_MUNICIPALITY_NAME",
                              ""
                            )})`}
                          </span>
                        </td>
                      )}
                      {[3020, 3021].indexOf(get(data, "CurrentStep.id", "")) ==
                        -1 && (
                        <td>
                          <label>{t("labels:Step Name")} :</label>
                          <span className="tdData">
                            {" "}
                            {get(data, "CurrentStep.name")}
                          </span>
                        </td>
                      )}
                      <td>
                        {/* <label>{t("labels:REQUESTEMPLOYEE")} :</label> */}
                        <label>{t("tabs:Creator Name")} :</label>
                        <span className="tdData">
                          {" "}
                          {get(data, "CreatorUser.name")}
                        </span>
                      </td>
                      {data.invoice_number &&
                        !data.submission_invoices?.length && (
                          <>
                            <td>
                              <label>حالة الدفع :</label>
                              <span className="tdData">
                                {" "}
                                {data.is_paid ? "تم الدفع" : "لم يتم الدفع"}
                              </span>
                            </td>
                            <td>
                              <label>رقم الفاتورة :</label>
                              <span className="tdData">
                                {" "}
                                {convertToArabic(
                                  data.invoice_number
                                    ? data.invoice_number
                                    : "لا يوجد"
                                )}
                              </span>
                            </td>
                            <td>
                              <label>تاريخ الفاتورة :</label>
                              <span className="tdData">
                                {" "}
                                {convertToArabic(
                                  data.invoice_date
                                    ? data.invoice_date
                                    : "لا يوجد"
                                )}
                              </span>
                            </td>
                          </>
                        )}
                      {!data.invoice_number &&
                        data.submission_invoices?.length && (
                          <td>
                            <td style={{ gridTemplateColumns: "1fr" }}>
                              <label>الفواتير</label>
                            </td>
                            <td style={{ gridTemplateColumns: "1fr" }}>
                              <table
                                className="table table-invoice "
                                style={{ marginTop: "30px", width: "25%" }}
                              >
                                <tr
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr",
                                    margin: 0,
                                    padding: 0,
                                  }}
                                >
                                  <th>رقم الفاتورة</th>
                                  <th>تاريخ الفاتورة</th>
                                  <th>حالة الدفع </th>
                                </tr>
                                <tbody>
                                  {data.submission_invoices.map(
                                    (invoice, k) => {
                                      return (
                                        <tr
                                          key={k}
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr 1fr",
                                            margin: 0,
                                            padding: "7px",
                                          }}
                                        >
                                          <td>
                                            {/* <span className="tdData"> */}
                                            {convertToArabic(
                                              invoice.invoice_number
                                            )}
                                            {/* </span> */}
                                          </td>
                                          <td>
                                            {/* <span className="tdData"> */}
                                            {convertToArabic(
                                              invoice.invoice_date
                                            )}
                                            {/* </span> */}
                                          </td>
                                          <td>
                                            {/* <span className="tdData"> */}
                                            {invoice.is_paid
                                              ? "تم الدفع"
                                              : "لم يتم الدفع"}
                                            {/* </span> */}
                                          </td>
                                        </tr>
                                      );
                                    }
                                  )}
                                </tbody>
                              </table>
                            </td>
                          </td>
                        )}
                      {/* <td><div>رقم المحضر:</div>{data.committee_no}</td> */}
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>
        {results.length > 0 && (
          <Pagination
            pageSize={this.pageSize}
            current={currentPropertyCheckPage}
            total={totalPropertyCheckPage}
            onChange={this.handlePropertyCheckChange}
            style={{
              bottom: "0px",
              margin: "0px 0px 40px 0px",
              position: "relative",
            }}
          />
        )}
      </div>
    );
  }
}
export const propertycheckRequestingReporting = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("tabs")(PropertyCheckRequestedReportingComponent))
);
