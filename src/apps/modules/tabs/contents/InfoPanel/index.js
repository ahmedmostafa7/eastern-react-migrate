import React, { Component } from "react";
import { Button, Pagination } from "antd";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import style from "./style.less";
import { view, print, followUp } from "../../tableActionFunctions/tableActions";
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
class InfoPanelComponent extends Component {
  constructor(props) {
    super(props);
    this.pageSize = props.pageSize || 10;
    this.state = {
      results: [],
      next: "",
      count: "",
      totalInfoPanelPage: 0,
      minInfoPanelIndex: 0,
      maxInfoPanelIndex: 1 * this.pageSize,
      currentInfoPanelPage: 1,
    };

    this.getMoreData = this.getMoreData.bind(this);
    this.isLoaded = true;
    this.myRef = React.createRef();
    this.autoClick = false;
  }

  setScrollEvents() {
    this.infoPanelContent = document.querySelector(".searchBack");
    this.infoPanelContent.addEventListener("scroll", this.getMoreData);
  }

  getMoreData(event) {
    const { next, count, results } = this.state;
    let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    let currentScroll = event.target.scrollTop;

    if (Math.ceil(currentScroll) >= maxScroll) {
      if (next && results.length < count) {
        this.fetchTableData(next.replace("/api", ""));
        this.infoPanelContent.scrollTop = this.infoPanelContent.scrollTop - 50;
      }
    }
  }

  componentWillUnmount() {
    this.infoPanelContent
      ? this.infoPanelContent.removeEventListener("scroll", this.getMoreData)
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

          let res = await axios.get(
            backEndUrlforMap +
              submission.submission_file_path +
              "mainObject.json"
          );
          // .then(
          //   (response) => {
          res.data =
            (typeof res.data == "string" &&
              JSON.parse(window.lzString.decompressFromBase64(res.data))) ||
            res.data;
          if (res.data.hasOwnProperty("search_survey_report")) {
            submission.mainObject = executePlanMapping(res.data, false);
          } else {
            submission.mainObject = res.data;
          }
          i++;

          if (i == data.results.length) {
            return resolve(data);
          }
          //},
          // (response) => {
          //   i++;
          //   submission.mainObject = {};
          //   if (i == data.results.length - 1) {
          //     return resolve(data);
          //   }
          // }
          //);
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
          (values.SubmissionStep ||
            values.SubmissionType ||
            values.municipalityCode)) ||
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
          : values["search_with"] == "SubmissionStep"
          ? (dataParams = {
              current_step_id: values["SubmissionStep"],
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
          fetchData(apiUrl + "?" + `pageNum=${currentPageNo || 1}`, {
            params: config,
          }).then((response) => {
            this.getMainObjectsBySubmissionPath(response).then((data) => {
              this.setState({
                results: [...data.results],
                totalInfoPanelPage: data.count,
                minInfoPanelIndex: 0,
                maxInfoPanelIndex: this.pageSize,
                nextUrl: data.next,
                currentInfoPanelPage: currentPageNo || 1,
                criteria: values,
              });
              if (!data.results.length) {
                window.notifySystem("warning", t("No data found"));
              }
            });
          });
          !this.infoPanelContent
            ? this.setScrollEvents()
            : (this.infoPanelContent.scrollTop = 0);
        } else {
          postItem(
            `${workFlowUrl}/search-json/`, // workFlowUrl
            JSON.stringify(jsonData),
            {
              params: { all: true, ...config },
              headers: {
                "content-type": "application/json",
              },
            }
          ).then(async (data) => {
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

  handleInfoPanelChange = (page) => {
    this.setState({
      currentInfoPanelPage: page,
      minInfoPanelIndex: 0,
      maxInfoPanelIndex: this.pageSize,
    });

    this.getValues(this.state.criteria || {}, "search", page);
  };

  clearData() {
    this.setState({
      resultToExport: [],
      results: [],
      totalInfoPanelPage: 0,
    });
  }

  render() {
    const {
      results,
      currentInfoPanelPage,
      minInfoPanelIndex,
      maxInfoPanelIndex,
      totalInfoPanelPage,
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
            current={currentInfoPanelPage}
            total={totalInfoPanelPage}
            onChange={this.handleInfoPanelChange}
            style={{
              bottom: "0px",
              margin: "0px 0px 40px 0px",
              position: "relative",
            }}
          />
        )}
        {results.length > 0 && totalInfoPanelPage > 0 && (
          <div style={{ textAlign: "right", marginRight: "10px" }}>
            <h5>{`اجمالي المعاملات :  ${convertToArabic(
              totalInfoPanelPage
            )}`}</h5>
          </div>
        )}
        <table className="table archiveTable">
          <tbody>
            {results.length > 0 &&
              results.map((data, i) => {
                // const step_admin = data.assign_to_group_id || data.assign_to_position_id || data.assign_to_user_id;
                return (
                  i >= minInfoPanelIndex &&
                  i < maxInfoPanelIndex && (
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
                          {get(data, "engUserName")}
                        </span>
                      </td>
                      <td>
                        {/* <label>{t("labels:REQUESTEMPLOYEE")} :</label> */}
                        <label>{t("نوع الإستثمار")} :</label>
                        <span className="tdData">
                          {" "}
                          {this.getInvestType(
                            get(
                              data,
                              "mainObject.investType.invest_type.investType",
                              ""
                            )
                          )}
                        </span>
                      </td>
                      <td>
                        {/* <label>{t("labels:REQUESTEMPLOYEE")} :</label> */}
                        <label>{t("نوع النشاط المقترح")} :</label>
                        <span className="tdData">
                          {" "}
                          <table
                            className="table table-invoice "
                            style={{ width: "25%" }}
                          >
                            <tr
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                margin: 0,
                                padding: 0,
                              }}
                            >
                              <th>رقم قطعة الأرض</th>
                              <th>النشاط المقترح</th>
                            </tr>
                            <tbody>
                              {get(
                                data,
                                "mainObject.landData.landData.lands.parcels",
                                []
                              )?.map((parcel, k) => {
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
                                        parcel.attributes.PARCEL_PLAN_NO
                                      )}
                                      {/* </span> */}
                                    </td>
                                    <td>
                                      {/* <span className="tdData"> */}
                                      {convertToArabic(
                                        parcel.attributes.SITE_ACTIVITY
                                      )}
                                      {/* </span> */}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
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
            current={currentInfoPanelPage}
            total={totalInfoPanelPage}
            onChange={this.handleInfoPanelChange}
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
export const InfoPanel = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("tabs")(InfoPanelComponent))
);
