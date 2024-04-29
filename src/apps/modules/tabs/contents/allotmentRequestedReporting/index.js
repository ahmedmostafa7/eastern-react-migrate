import React, { Component } from "react";
import { Button, Pagination } from "antd";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import style from "./style.less";
import { view, print, followUp } from "../../tableActionFunctions/tableActions";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import {
  get,
  isEmpty,
  pick,
  concat,
  map,
  omitBy,
  isNull,
  isObject,
} from "lodash";
import { fetchData, postItem } from "app/helpers/apiMethods";
import { SearchForm } from "./searchForm";
import { jsonData } from "./json_inputs";
// import planStatus from 'app/components/wizard/plan_status';
import { printHost } from "imports/config";
import { convertToArabic } from "../../../../../app/components/inputs/fields/identify/Component/common/common_func";

class allotmentRequestingReportingComponent extends Component {
  constructor(props) {
    super(props);
    this.pageSize = props.pageSize || 12;
    this.state = {
      results: [],
      next: "",
      count: "",
      totalRequestingReportingPage: 0,
      minRequestingReportingIndex: 0,
      maxRequestingReportingIndex: 1 * this.pageSize,
      currentRequestingReportingPage: 1,
      fields: {
        // request_no: {
        //   label: "رقم المعاملة",
        //   action: "",
        //   conditionToShow: "data.json_props.owner_type",
        // },
        owner_type: {
          label: "نوع المالك",
          action: "",
          conditionToShow: "false",
        },
        owner_name: {
          label: "اسم المالك",
          action: "",
          conditionToShow: "data.json_props.owner_name",
        },
        plan_number: {
          label: "رقم المخطط المعتمد",
          action: "",
          conditionToShow: "data.json_props.plan_number",
        },
        use_sumbol: {
          label: "نوع الإستخدام",
          action: "",
          conditionToShow: "data.json_props.use_sumbol",
        },
        ssn: {
          label: "رقم الهوية ",
          action: "",
          conditionToShow: "false",
        },
        code_regesteration: {
          label: "كود الجهة",
          action: "",
          conditionToShow: "false",
        },
        commercial_registeration: {
          label: "رقم السجل التجاري",
          action: "",
          conditionToShow: "false",
        },
        MUNICIPALITY_NAME: {
          label: "البلدية",
          action: "",
          conditionToShow: "false",
        },
        PLAN_NO: {
          label: "رقم المخطط",
          action: "",
          conditionToShow: "false",
        },
        PARCEL_PLAN_NO: {
          label: "رقم قطعة الأرض",
          action: "",
          conditionToShow: "false",
        },
        PARCEL_AREA: {
          label: "مساحة الأرض من الصك",
          action: "",
          conditionToShow: "false",
        },
        Natural_Area: {
          label: "مساحة الأرض من الطبيعة",
          action: "",
          conditionToShow: "false",
        },
        Zayda_layerName: {
          label: "مساحة الزائدة (اسم الطبقة)",
          action: "",
          conditionToShow: "false",
        },
        Zayda_area: {
          label: "مساحة الزائدة (المساحة)",
          action: `((!_.isEmpty(data?.json_props) && data?.json_props?.Zayda_area) || [0])?.reduce((a, b, i) => {
            if (
              ["plus", "notplus"].indexOf(
                data?.json_props?.Zayda_layerName[i]?.toLowerCase()
              ) != -1
            ) {
              a = a + (+b || 0);
            }
      
            return a;
          }, 0)?.toFixed(2)`,
          conditionToShow: "false",
        },
        // parcels_total_area: {
        //   label: "مساحات قطع الأراضي السكنية",
        //   action: `data.json_props["lands"]?.filter((a) => (!a.is_cut))?.reduce(
        //     (a, b) => {
        //
        //     return a + (+b.area || 0)
        //     },
        //     0
        //   )?.toFixed(2) || 0`,
        //   conditionToShow: "true",
        // },
        // commercial_total_area: {
        //   label: "مساحات قطع الأراضي التجارية",
        //   action: `data.json_props["lands"]?.filter((a) => a.typeName == 'تجارى')?.reduce(
        //     (a, b) => {
        //
        //     return a + (+b.area || 0)
        //     },
        //     0
        //   )?.toFixed(2) || 0`,
        //   conditionToShow: "true",
        // },
        // marafik_total_area: {
        //   // usingSymbol
        //   label: "مساحات قطع الأراضي مرفق حكومي (مرافق + خدمات)",
        //   action: `(+data.json_props["lands"]?.filter((a) => a.usingSymbol == 'خ')?.reduce(
        //     (a, b) => {
        //
        //     return a + (+b.area || 0)
        //     },
        //     0
        //   )?.toFixed(2) + +data.json_props["lands"]?.filter((a) => a.typeName == 'مواقف')?.reduce(
        //     (a, b) => {
        //
        //     return a + (+b.area || 0)
        //     },
        //     0
        //   )?.toFixed(2) + +data.json_props["lands"]?.filter((a) => a.typeName == 'حدائق')?.reduce(
        //     (a, b) => {
        //
        //     return a + (+b.area || 0)
        //     },
        //     0
        //   )?.toFixed(2)) || 0`,
        //   conditionToShow: "true",
        // },
        shtfa_northeast: {
          label: "مساحة الشطفات(الشمال الشرقي)",
          action: "",
          conditionToShow: "false",
        },
        shtfa_northweast: {
          label: "مساحة الشطفات(الشمال الغربي)",
          action: "",
          conditionToShow: "false",
        },
        shtfa_southeast: {
          label: "مساحة الشطفات(الجنوب الشرقي)",
          action: "",
          conditionToShow: "false",
        },
        shtfa_southweast: {
          label: "مساحة الشطفات(الجنوب الغربي)",
          action: "",
          conditionToShow: "false",
        },
        electricArea: {
          label: "غرفة الكهرباء",
          action: "",
          conditionToShow: "false",
        },
        karar_amin: {
          label: "رقم خطاب قرار معالي الأمين",
          action: "data.request_no",
          conditionToShow: "data.json_props.karar_amin_date",
        },
        karar_amin_date: {
          label: "تاريخ خطاب قرار معالي الأمين",
          action: "",
          conditionToShow: "data.json_props.karar_amin_date",
        },
        // invoice_number: {
        //   label: "رقم الفاتورة",
        //   action: "",
        //   conditionToShow: "true",
        // },
        // invoice_date: {
        //   label: "تاريخ الفاتورة",
        //   action: "",
        //   conditionToShow: "true",
        // },
      },
    };
    this.getMoreData = this.getMoreData.bind(this);
    this.myRef = React.createRef();
    this.autoClick = false;
  }

  setScrollEvents() {
    this.requestingReportingContent = document.querySelector(".searchBack");
    this.requestingReportingContent.addEventListener(
      "scroll",
      this.getMoreData
    );
  }

  getMoreData(event) {
    const { next, count, results } = this.state;
    let maxScroll = event.target.scrollHeight - event.target.clientHeight;
    let currentScroll = event.target.scrollTop;

    if (Math.ceil(currentScroll) >= maxScroll) {
      if (next && results.length < count) {
        this.fetchTableData(next.replace("/api", ""));
        this.requestingReportingContent.scrollTop =
          this.requestingReportingContent.scrollTop - 50;
      }
    }
  }

  componentWillUnmount() {
    this.requestingReportingContent
      ? this.requestingReportingContent.removeEventListener(
          "scroll",
          this.getMoreData
        )
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

  clearData() {
    this.setState({
      resultToExport: [],
    });
  }

  getValues(values, button, currentPageNo) {
    const { apiUrl, currentApp, t } = this.props;
    //if (!isEmpty(values)) {
    // if (
    //   (values.search_with &&
    //     (values.search || values.statusSearch || values.SubmissionType)) ||
    //   values.from_date ||
    //   values.to_date
    // ) {
    if (this.autoClick) {
      this.autoClick = false;
      return;
    }
    const plan_status = get(values, "statusSearch", null);
    let otherParams = {};
    !plan_status
      ? (otherParams[get(values, "search_with")] = get(values, "search", null))
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
      : values["search_with"] == "entity_type_id"
      ? (dataParams = {
          entity_type_id: values["entity_type_id"],
        })
      : values["search_with"] == "entity_id"
      ? (dataParams = {
          entity_id: values["entity_id"],
        })
      : (dataParams = {
          status: values["SubmissionType"],
        });

    const config = {
      app_id: currentApp.id,
      plan_status,
      ...dataParams,
      pageNum: currentPageNo || "0",
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
        this.setState({
          ...data,
          totalRequestingReportingPage: data.count,
          minRequestingReportingIndex: 0,
          maxRequestingReportingIndex: this.pageSize,
          nextUrl: data.next,
          criteria: values,
          currentRequestingReportingPage: currentPageNo || 1,
          resultToExport: [],
        });

        if (isEmpty(data.results)) {
          window.notifySystem("warning", t("No data found"));
        }
      });

      // if (!currentPageNo) {
      //   postItem(apiUrl + "0", JSON.stringify(jsonData), {
      //     params: { all: true, ...config },
      //     headers: {
      //       "content-type": "application/json",
      //     },
      //   }).then(async (data) => {

      //     data.results = data.results.filter((r) => !_.isEmpty(r.json_props));
      //     // for (let i = 0; i < data.results.length; i++) {
      //     //   let result = await followUp(
      //     //     { id: data.results[i].id },
      //     //     0,
      //     //     {},
      //     //     null,
      //     //     false,
      //     //     this.props
      //     //   );
      //     //

      //     //   let primaryApprovalIndex = result.prevSteps.findLastIndex(
      //     //     (step) => [2326, 3107].indexOf(step.prevStep.id) != -1
      //     //   );

      //     //   let aminSignPrimaryApprovalIndex = result.prevSteps.findLastIndex(
      //     //     (step) => [2851, 3112].indexOf(step.prevStep.id) != -1
      //     //   );

      //     //   let primary_Approval_date = [""];
      //     //   if (aminSignPrimaryApprovalIndex > primaryApprovalIndex) {
      //     //     primary_Approval_date = [
      //     //       result?.prevSteps?.[aminSignPrimaryApprovalIndex]?.date || "",
      //     //     ];
      //     //   }

      //     //   let final_Approval_date = [""];
      //     //   let finalApprovalIndex = result.prevSteps.findLastIndex(
      //     //     (step) => [2372, 2330, 3119].indexOf(step.prevStep.id) != -1
      //     //   );
      //     //   let aminSignatureIndex = result.prevSteps.findLastIndex(
      //     //     (step) => [2899, 3124, 2921].indexOf(step.prevStep.id) != -1
      //     //   );

      //     //   if (aminSignatureIndex > finalApprovalIndex) {
      //     //     final_Approval_date = [
      //     //       (finalApprovalIndex != -1 &&
      //     //         result.prevSteps[aminSignatureIndex]?.date) ||
      //     //         "",
      //     //     ];
      //     //   }
      //     //   data.results[i].json_props = {
      //     //     ...data.results[i].json_props,
      //     //     primary_Approval_date,
      //     //     final_Approval_date,
      //     //   };
      //     // }

      //     this.setState({
      //       resultToExport: data.results,
      //     });

      //     if (isEmpty(data.results)) {
      //       window.notifySystem("warning", t("No data found"));
      //     }
      //   });
      // }
      !this.requestingReportingContent
        ? this.setScrollEvents()
        : (this.requestingReportingContent.scrollTop = 0);
    } else {
      postItem(apiUrl, JSON.stringify(jsonData), {
        params: { all: true, ...config },
        headers: {
          "content-type": "application/json",
        },
      }).then(async (data) => {
        data.results = data.results.filter((r) => !_.isEmpty(r.json_props));

        this.setState(
          {
            resultToExport: [
              ...data.results.map((r, i) => ({ no: i + 1, ...r })),
              {
                no: "اجمالي عدد المعاملات",
                request_no: `${data.count} معاملة`,
              },
            ], //data.results,
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
    //   }
    // }
  }

  handleRequestingReportingChange = (page) => {
    this.setState({
      currentRequestingReportingPage: page,
      minRequestingReportingIndex: 0,
      maxRequestingReportingIndex: this.pageSize,
    });

    this.getValues(this.state.criteria || {}, "search", page);
  };

  render() {
    const {
      results,
      count,
      currentRequestingReportingPage,
      totalRequestingReportingPage,
      fields,
      resultToExport = [],
    } = this.state;
    const { t } = this.props;
    return (
      <div className={style.requestingReporting_layout}>
        <SearchForm
          onSubmit={this.getValues.bind(this)}
          resultsToExport={resultToExport}
          pageNo={""}
          myRef={this.myRef}
          clearData={this.clearData.bind(this)}
        />
        {results.length > 0 && (
          <Pagination
            pageSize={this.pageSize}
            current={currentRequestingReportingPage}
            total={totalRequestingReportingPage}
            onChange={this.handleRequestingReportingChange}
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
                return (
                  <tr className={style.requestingReporting_data} key={i}>
                    <div className={style.requestingReporting_print}>
                      <Button
                        className="btn view"
                        icon="windows"
                        onClick={view.bind(this, data)}
                      >
                        عرض
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
                    {Object.keys(data.json_props).map((key, y) => {
                      return (
                        eval(fields[key]?.conditionToShow) == true ||
                        ([null, undefined].indexOf(
                          eval(fields[key]?.conditionToShow)?.[0]
                        ) == -1 && (
                          <td>
                            <label>{t(fields[key].label)}</label>
                            <span className="tdData">
                              {convertToArabic(
                                (fields[key].action &&
                                  eval(fields[key].action)) ||
                                  (!isObject(
                                    get(data.json_props, key, "")?.[0]
                                  ) &&
                                    get(data.json_props, key, "").join(
                                      " - "
                                    )) ||
                                  ""
                              )}
                            </span>
                          </td>
                        )) || <></>
                      );
                    })}
                    {(data.invoice_number &&
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
                      )) ||
                      (!data.invoice_number &&
                        data.submission_invoices?.length && (
                          <td>
                            <td style={{ gridTemplateColumns: "1fr" }}>
                              <label>الفواتير</label>
                            </td>
                            <td style={{ gridTemplateColumns: "1fr" }}>
                              <table
                                className="table table-invoice"
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
                        )) || (
                        <td>
                          <label>حالة الدفع :</label>
                          <span className="tdData"> {"لم يتم الدفع"}</span>
                        </td>
                      )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}
export const allotmentRequestingReporting = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("tabs")(allotmentRequestingReportingComponent))
);
