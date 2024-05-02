import React, { Component } from "react";
import { Button, Pagination } from "antd";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import style from "./style.less";
import { view, print, followUp } from "../../tableActionFunctions/tableActions";
import { withTranslation } from "react-i18next";
import { withRouter } from "apps/routing/withRouter";
import { get, isEmpty, pick, concat, map } from "lodash";
import { fetchData } from "app/helpers/apiMethods";
import { SearchForm } from "./searchForm";
// import planStatus from 'app/components/wizard/plan_status';
import { printHost } from "imports/config";
import { convertToArabic } from "../../../../../app/components/inputs/fields/identify/Component/common/common_func";

class ArchiveComponent extends Component {
  constructor(props) {
    super(props);
    this.pageSize = props.pageSize || 12;
    this.state = {
      results: [],
      next: "",
      count: "",
      totalArchivePage: 0,
      minArchiveIndex: 0,
      maxArchiveIndex: 1 * this.pageSize,
      currentArchivePage: 1,
    };
    this.getMoreData = this.getMoreData.bind(this);
  }

  setScrollEvents() {
    this.archiveContent = document.querySelector(".searchBack");
    this.archiveContent.addEventListener("scroll", this.getMoreData);
  }

  getMoreData(event) {
    const { next, count, results } = this.state;
    let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    let currentScroll = event.target.scrollTop;

    if (Math.ceil(currentScroll) >= maxScroll) {
      if (next && results.length < count) {
        this.fetchTableData(next.replace("/api", ""));
        this.archiveContent.scrollTop = this.archiveContent.scrollTop - 50;
      }
    }
  }

  componentWillUnmount() {
    this.archiveContent
      ? this.archiveContent.removeEventListener("scroll", this.getMoreData)
      : null;
  }

  fetchTableData(url) {
    fetchData(url).then((data) => {
      this.setState({
        results: concat(this.state.results, data.results),
        next: data.next,
        count: data.count,
      });
    });
  }

  getValues(values, button, currentPageNo) {
    const { apiUrl, currentApp, t } = this.props;
    if (!isEmpty(values)) {
      if (
        (values.search_with &&
          (values.search || values.statusSearch || values.SubmissionType)) ||
        values.from_date ||
        values.to_date
      ) {
        const plan_status = get(values, "statusSearch", null);
        let otherParams = {};
        !plan_status
          ? (otherParams[get(values, "search_with")] = get(
              values,
              "search",
              null
            ))
          : null;
        let dataParams;

        values["search_with"] == "owner_value"
          ? (dataParams = {
              owner_key: values["sub_search_with"],
              owner_value: values["search"],
            })
          : values["search_with"] == "request_no"
          ? (dataParams = {
              request_no: values["search"],
            })
          : values["search_with"] == "committee_report_no"
          ? (dataParams = {
              committee_report_no: values["search"],
            })
          : values["search_with"] == "export_no"
          ? (dataParams = {
              export_no: values["search"],
            })
          : values["search_with"] == "PARCEL_PLAN_NO"
          ? (dataParams = {
              PARCEL_PLAN_NO: values["search"],
            })
          : values["search_with"] == "PLAN_NO"
          ? (dataParams = {
              PLAN_NO: values["search"],
            })
          : (dataParams = {
              status: values["SubmissionType"],
            });

        ////
        const config = {
          app_id: currentApp.id,
          plan_status,
          ...dataParams,
          // owner_key:
          //   values["search_with"] == "owner_name"
          //     ? 4
          //     : values["search_with"] == 1
          //     ? 1
          //     : "",

          // owner_value: values["search"],
          // ...otherParams,
          ...pick(values, ["from_date", "to_date"]),
        };

        if (button.includes("search")) {
          fetchData(apiUrl + "?" + `pageNum=${currentPageNo || 1}`, {
            params: config,
          }).then((data) => {
            ////
            this.setState({
              ...data,
              totalArchivePage: data.count,
              minArchiveIndex: 0,
              maxArchiveIndex: this.pageSize,
              nextUrl: data.next,
              criteria: values,
              currentArchivePage: currentPageNo || 1,
            });

            if (isEmpty(data.results)) {
              window.notifySystem("warning", t("No data found"));
            }
          });
          !this.archiveContent
            ? this.setScrollEvents()
            : (this.archiveContent.scrollTop = 0);
        } else {
          fetchData(apiUrl + "?" + `pageNum=${currentPageNo || 1}`, {
            params: config,
          }).then((data) => {
            this.setState({
              ...data,
              totalArchivePage: data.count,
              minArchiveIndex: 0,
              maxArchiveIndex: this.pageSize,
              nextUrl: data.next,
              criteria: values,
              currentArchivePage: currentPageNo || 1,
            });
            let newWindow = window.open(
              `${printHost}/#/print_report`,
              "Report",
              data
            );
            newWindow.submissions = get(data, "results", []);
          });
        }
      }
    }
  }

  handleArchiveChange = (page) => {
    this.setState({
      currentArchivePage: page,
      minArchiveIndex: 0,
      maxArchiveIndex: this.pageSize,
    });

    this.getValues(this.state.criteria || {}, "search", page);
  };

  render() {
    const { results, count, currentArchivePage, totalArchivePage } = this.state;
    const {
      t,
      currentApp: { id },
    } = this.props;
    // console.log(currentApp)
    return (
      <div className={style.archive_layout}>
        <SearchForm onSubmit={this.getValues.bind(this)} />
        {results.length > 0 && (
          <Pagination
            pageSize={this.pageSize}
            current={currentArchivePage}
            total={totalArchivePage}
            onChange={this.handleArchiveChange}
            style={{
              bottom: "0px",
              margin: "0px 0px 40px 0px",
              position: "relative",
            }}
          />
        )}
        {results.length !== 0 ? (
          <h2 style={{ textAlign: "right", marginRight: "10px" }}>
            عدد النتائج : {convertToArabic(count)} معاملة
          </h2>
        ) : (
          false
        )}
        <table className="table archiveTable">
          <tbody>
            {results.length > 0 &&
              results.map((data, i) => {
                // const step_admin = data.assign_to_group_id || data.assign_to_position_id || data.assign_to_user_id;

                return (
                  <tr className={style.archive_data} key={i}>
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
                      {this?.props?.currentApp?.id != 14 && (
                        <Button
                          className="btn print_arch
                         "
                          icon="printer"
                          onClick={print.bind(this, data)}
                        >
                          طباعة
                        </Button>
                      )}
                    </div>
                    <td>
                      <label>{t("Request No")}</label>
                      <span className="tdData">
                        {convertToArabic(data.request_no)}
                      </span>
                    </td>
                    {data.committee_report_no && (
                      <td>
                        <label>{t("Committee report number")}</label>
                        <span className="tdData">
                          {convertToArabic(
                            get(data, "committee_report_no", "") || ""
                          )}
                        </span>
                      </td>
                    )}
                    {data.export_no && (
                      <td>
                        <label>{t("Export number")}</label>
                        <span className="tdData">
                          {convertToArabic(get(data, "export_no", "") || "")}
                        </span>
                      </td>
                    )}
                    <td>
                      <label>{t("Step Name")}</label>
                      <span className="tdData">
                        {([14].indexOf(data.app_id) != -1 &&
                          [2172, 2127, 2333].indexOf(data?.CurrentStep.id) !=
                            -1 &&
                          !data.survey_check_request_no &&
                          `طباعة المعاملة`) ||
                          ([1].indexOf(data.app_id) != -1 &&
                            [1851, 1955, 2115].indexOf(data?.CurrentStep.id) !=
                              -1 &&
                            !data.survey_check_request_no &&
                            `طباعة المحضر الفني`) ||
                          get(data, "CurrentStep.name", "") +
                            (((data?.submission_invoices?.length > 0 ||
                              data.invoice_number) &&
                              ` (${
                                ((data?.submission_invoices?.filter(
                                  (invoice) => invoice?.is_paid == true
                                ).length == data?.submission_invoices?.length ||
                                  data.invoice_number) &&
                                  "جاهزة للطباعة") ||
                                "معلقة"
                              })`) ||
                              "")}
                      </span>
                    </td>
                    <td>
                      <label>{t("Charger")}</label>
                      <span className="tdData">
                        {(data.CurrentStep.is_end &&
                          (([1].indexOf(data.app_id) != -1 &&
                            data.submission_farz_lands?.filter(
                              (r) => r.deed_dateh && r.deed_no
                            ).length != data.submission_farz_lands?.length) ||
                            ([14].indexOf(data.app_id) != -1 &&
                              !data.submission_lands_contracts[0]
                                .is_nagez_deed_issued) ||
                            ([1, 14].indexOf(data.app_id) != -1 &&
                              !data.is_rid_response_received)) &&
                          "وزارة الشئون البلدية والقروية") ||
                          (data.assign_to_user_id &&
                            data.users &&
                            data.users.name) ||
                          (data.assign_to_position_id &&
                            data.CurrentStep &&
                            data.CurrentStep.positions &&
                            data.CurrentStep.positions.users &&
                            map(
                              data.CurrentStep.positions.users,
                              (position) => position.name
                            ).join(" , ")) ||
                          (data.assign_to_group_id &&
                            data.CurrentStep &&
                            data.CurrentStep.groups &&
                            data.CurrentStep.groups.name) ||
                          get(data, "CreatorUser.name", "")}
                      </span>
                    </td>
                    <td>
                      <label>{t("Submission Status")}</label>
                      <span className="tdData">
                        {data.status == 1
                          ? (!data.CurrentStep.is_end && "جارية") ||
                            ([1, 14].indexOf(data.app_id) != -1 &&
                              !data.is_rid_response_received &&
                              "جاري اصدار هوية عقارية") ||
                            ((([1].indexOf(data.app_id) != -1 &&
                              data.submission_farz_lands?.filter(
                                (r) => r.deed_dateh && r.deed_no
                              ).length != data.submission_farz_lands?.length) ||
                              ([14].indexOf(data.app_id) != -1 &&
                                !data.submission_lands_contracts[0]
                                  .is_nagez_deed_issued)) &&
                              "جاري اصدار الصك") ||
                            ((([14].indexOf(data.app_id) != -1 &&
                              data.submission_lands_contracts[0]
                                .is_nagez_deed_issued) ||
                              ([1].indexOf(data.app_id) != -1 &&
                                data.submission_farz_lands?.filter(
                                  (r) => r.deed_dateh && r.deed_no
                                ).length ==
                                  data.submission_farz_lands?.length)) &&
                              "تحت الإنهاء")
                          : data.status == 2
                          ? "منتهية"
                          : data.status == 3
                          ? (id == 26 && "مرفوضة") || "معتذر عنها"
                          : "متوقفة"}
                      </span>
                    </td>
                    <td>
                      <label>{t("Creator Name")}</label>
                      <span className="tdData">
                        {get(data, "CreatorUser.name")}
                      </span>
                    </td>
                    <td>
                      <label>{t("Owner Name")}</label>
                      <span className="tdData"> {data.owner_name}</span>
                    </td>
                    {data.invoice_number &&
                      !data.submission_invoices?.length && (
                        <>
                          <td>
                            <label>رقم الفاتورة</label>
                            <span className="tdData">
                              {data.invoice_number
                                ? convertToArabic(data.invoice_number)
                                : "لا يوجد"}
                            </span>
                          </td>
                          <td>
                            <label>تاريخ الفاتورة</label>
                            <span className="tdData">
                              {data.invoice_date
                                ? convertToArabic(data.invoice_date)
                                : "لا يوجد"}
                            </span>
                          </td>
                          <td>
                            <label>حالة الدفع </label>
                            <span className="tdData">
                              {data.is_paid ? "تم الدفع" : "لم يتم الدفع"}
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
                                {data.submission_invoices.map((invoice, k) => {
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
                                        {convertToArabic(invoice.invoice_date)}
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
                                })}
                              </tbody>
                            </table>
                          </td>
                        </td>
                      )}
                    {/* <td><div>رقم المحضر:</div>{data.committee_no}</td> */}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}
export const Archive = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("tabs")(ArchiveComponent))
);
