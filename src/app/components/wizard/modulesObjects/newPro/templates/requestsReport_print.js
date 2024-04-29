import React, { Component } from "react";
import axios from "axios";
import { get } from "lodash";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import moment from "moment-hijri";
import {
  convertToArabic,
  selectActors,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import {
  jsonData,
  columns,
} from "../../../../../../apps/modules/tabs/contents/addedparcelsRequestedReporting/json_inputs";
import { fetchData, postItem } from "app/helpers/apiMethods";
import ExportCSV from "../../../../../../apps/modules/tabs/contents/addedparcelsRequestedReporting/ExportCSV";

export default class addedparcels_requestsReport extends Component {
  state = { data: [] };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    let self = this;

    postItem(`${workFlowUrl}/search-json/`, JSON.stringify(jsonData), {
      params: {
        all: true,
        ...JSON.parse(localStorage.getItem("imports/config")),
      },
      headers: {
        "content-type": "application/json",
      },
    }).then((data) => {
      let results = data?.results;

      this.setState({
        results,
      });
    });
  }

  render() {
    let { results = [] } = this.state;
    console.log("res", results);

    return (
      <div className="prit">
        <div className="">
          <div style={{ display: "grid", justifyContent: "flex-end" }}>
            <button
              className="btn btn-warning hidd"
              onClick={() => {
                window.print();
              }}
            >
              طباعه
            </button>
            {/* {(results?.length && (
              <ExportCSV data={results} columns={columns} pageNo={""} />
            )) || <></>} */}
            {/* <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="btn btn-warning hidd"
              table="table-to-xls"
              filename="tablexls"
              sheet="tablexls"
              buttonText="استخراج ملف اكسيل"
            /> */}
          </div>
          {/* <table id={"table-to-xls"} className={"table"}> */}
          {/* <tr> */}
          {/* <td colSpan={"100%"}> */}
          <div
            className="header_fixed_cust "
            // style={{ border: "1px solid #000" }}
          >
            <div>
              <img src="images/logo3.png" width="100px" />
            </div>
            <div style={{ display: "grid", justifyItems: "center" }}>
              <img src="images/logo2.png" width="100px" />
              <p style={{ textAlign: "center" }}>
                تقارير معاملات الزوائد التنظيمية
              </p>
            </div>
            <img src="images/saudiVision.png" width="100px" />
          </div>

          {results?.map((data, index) => {
            return (
              (!_.isEmpty(data?.json_props) && (
                <div>
                  {/* فى حالة عدم سداد الفاتورة */}
                  {(data?.submission_invoices == null ||
                    (data?.submission_invoices?.length &&
                      data?.submission_invoices?.find(
                        (r) => r.is_paid == false
                      ) != undefined)) &&
                    !data?.is_paid && (
                      <div
                        className={index % 2 == 0 ? `pageBreakE` : ""}
                        style={{ marginTop: "16vh" }}
                      >
                        <table className="table table-bordered table-ma7dar">
                          <tr>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              رقم المعاملة
                            </td>
                            <td style={{ textAlign: "center" }} colSpan={2}>
                              {convertToArabic(data?.request_no)}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              حالة المعاملة
                            </td>
                            <td style={{ textAlign: "center" }} colSpan={2}>
                              {data?.status == 1
                                ? "جارية"
                                : data?.status == 2
                                ? "منتهية"
                                : data?.status == 3
                                ? "معتذر عنها"
                                : "متوقفة"}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              اسم المالك
                            </td>
                            <td style={{ textAlign: "center" }} colSpan={2}>
                              {convertToArabic(
                                data?.json_props?.owner_name?.join(" - ")
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              {(data?.json_props?.ssn && "رقم الهوية") ||
                                (data?.json_props?.code_regesteration &&
                                  "كود الجهة") ||
                                (data?.json_props?.commercial_registeration &&
                                  "السجل التجاري")}
                            </td>
                            <td style={{ textAlign: "center" }} colSpan={2}>
                              {convertToArabic(
                                (
                                  data?.json_props?.ssn ||
                                  data?.json_props?.code_regesteration ||
                                  data?.json_props?.commercial_registeration
                                )?.join(" - ")
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              البلدية
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {convertToArabic(
                                data?.json_props?.MUNICIPALITY_NAME[0]
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              رقم المخطط
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {convertToArabic(data?.json_props?.PLAN_NO[0])}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              رقم قطعة الأرض
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {convertToArabic(
                                data?.json_props?.PARCEL_PLAN_NO?.join(" - ")
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              مساحة الأرض من الصك (م٢)
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {convertToArabic(
                                data?.json_props?.PARCEL_AREA?.reduce(
                                  (a, b) => a + (+b || 0),
                                  0
                                ).toFixed(2)
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              مساحة الأرض من الطبيعة (م٢)
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {convertToArabic(
                                data?.json_props?.Natural_Area?.reduce(
                                  (a, b) => a + (+b || 0),
                                  0
                                ).toFixed(2)
                              )}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              مساحة الزائدة (م٢)
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
                              {convertToArabic(
                                (
                                  (!_.isEmpty(data?.json_props) &&
                                    data?.json_props?.Zayda_area) || [0]
                                )
                                  ?.reduce((a, b, i) => {
                                    if (
                                      [
                                        "plus",
                                        "notplus",
                                        "الزائدة",
                                        "الزائده التنظيميه",
                                      ].indexOf(
                                        data?.json_props?.Zayda_layerName?.[
                                          i
                                        ]?.toLowerCase()
                                      ) != -1
                                    ) {
                                      a = a + (+b || 0);
                                    }

                                    return a;
                                  }, 0)
                                  ?.toFixed(2)
                              )}
                            </td>
                          </tr>
                          <tr>
                            {data?.json_props?.karar_amin_date && (
                              <>
                                <td
                                  style={{
                                    textAlign: "center",
                                    background: "#ddd",
                                  }}
                                >
                                  رقم خطاب قرار معالي الأمين
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                  }}
                                >
                                  {convertToArabic(data?.request_no)}
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                    background: "#ddd",
                                  }}
                                >
                                  تاريخ خطاب قرار معالي الأمين
                                </td>
                                <td
                                  style={{
                                    textAlign: "center",
                                  }}
                                >
                                  {convertToArabic(
                                    data?.json_props?.karar_amin_date
                                  )}
                                </td>
                              </>
                            )}
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              حالة الدفع
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                              }}
                            >
                              لم يتم الدفع
                            </td>
                          </tr>
                        </table>
                      </div>
                    )}
                  {/* فى حالة سداد الفاتورة */}
                  {((data?.submission_invoices != null &&
                    data?.submission_invoices?.find((r) => r.is_paid == true) !=
                      undefined) ||
                    data?.is_paid == true) && (
                    <div
                      className={index % 2 == 0 ? `pageBreakE` : ""}
                      style={{ marginTop: "16vh" }}
                    >
                      <table className="table table-bordered table-ma7dar">
                        <tr>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                          >
                            رقم المعاملة
                          </td>
                          <td style={{ textAlign: "center" }} colSpan={2}>
                            {convertToArabic(data?.request_no)}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                          >
                            حالة المعاملة
                          </td>
                          <td style={{ textAlign: "center" }} colSpan={2}>
                            {data?.status == 1
                              ? "جارية"
                              : data?.status == 2
                              ? "منتهية"
                              : data?.status == 3
                              ? "معتذر عنها"
                              : "متوقفة"}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                          >
                            اسم المالك
                          </td>
                          <td style={{ textAlign: "center" }} colSpan={2}>
                            {convertToArabic(
                              data?.json_props?.owner_name?.join(" - ")
                            )}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                          >
                            {(data?.json_props?.ssn && "رقم الهوية") ||
                              (data?.json_props?.code_regesteration &&
                                "كود الجهة") ||
                              (data?.json_props?.commercial_registeration &&
                                "السجل التجاري")}
                          </td>
                          <td style={{ textAlign: "center" }} colSpan={2}>
                            {convertToArabic(
                              (
                                data?.json_props?.ssn ||
                                data?.json_props?.code_regesteration ||
                                data?.json_props?.commercial_registeration
                              )?.join(" - ")
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                          >
                            البلدية
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {convertToArabic(
                              data?.json_props?.MUNICIPALITY_NAME[0]
                            )}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                          >
                            رقم المخطط
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {convertToArabic(data?.json_props?.PLAN_NO[0])}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                          >
                            رقم قطعة الأرض
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {convertToArabic(
                              data?.json_props?.PARCEL_PLAN_NO?.join(" - ")
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                          >
                            مساحة الأرض من الصك (م٢)
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {convertToArabic(
                              data?.json_props?.PARCEL_AREA?.reduce(
                                (a, b) => a + (+b || 0),
                                0
                              ).toFixed(2)
                            )}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                          >
                            مساحة الأرض من الطبيعة (م٢)
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {convertToArabic(
                              data?.json_props?.Natural_Area?.reduce(
                                (a, b) => a + (+b || 0),
                                0
                              ).toFixed(2)
                            )}
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                          >
                            مساحة الزائدة (م٢)
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {convertToArabic(
                              (
                                (!_.isEmpty(data?.json_props) &&
                                  data?.json_props?.Zayda_area) || [0]
                              )
                                ?.reduce((a, b, i) => {
                                  if (
                                    [
                                      "plus",
                                      "notplus",
                                      "الزائدة",
                                      "الزائده التنظيميه",
                                    ].indexOf(
                                      data?.json_props?.Zayda_layerName?.[
                                        i
                                      ]?.toLowerCase()
                                    ) != -1
                                  ) {
                                    a = a + (+b || 0);
                                  }

                                  return a;
                                }, 0)
                                ?.toFixed(2)
                            )}
                          </td>
                        </tr>
                        {data?.json_props?.karar_amin_date && (
                          <tr>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              رقم خطاب قرار معالي الأمين
                            </td>
                            <td style={{ textAlign: "center" }} colSpan={2}>
                              {convertToArabic(data?.request_no)}
                            </td>
                            <td
                              style={{
                                textAlign: "center",
                                background: "#ddd",
                              }}
                            >
                              تاريخ خطاب قرار معالي الأمين
                            </td>
                            <td style={{ textAlign: "center" }} colSpan={2}>
                              {convertToArabic(
                                data?.json_props?.karar_amin_date
                              )}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                            colSpan={6}
                          >
                            الفواتير
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                            colSpan={2}
                          >
                            رقم الفاتورة
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                            colSpan={2}
                          >
                            تاريخ الفاتورة
                          </td>
                          <td
                            style={{
                              textAlign: "center",
                              background: "#ddd",
                            }}
                            colSpan={2}
                          >
                            حالة الدفع
                          </td>
                        </tr>
                        {data?.submission_invoices?.map((invoice) => {
                          return (
                            <tr>
                              <td style={{ textAlign: "center" }} colSpan={2}>
                                {convertToArabic(invoice.invoice_number)}
                              </td>
                              <td style={{ textAlign: "center" }} colSpan={2}>
                                {convertToArabic(invoice.invoice_date)}
                              </td>
                              <td style={{ textAlign: "center" }} colSpan={2}>
                                {invoice.is_paid ? "تم الدفع" : "لم يتم الدفع"}
                              </td>
                            </tr>
                          );
                        })}
                        {data?.invoice_number && (
                          <tr>
                            <td style={{ textAlign: "center" }} colSpan={2}>
                              {convertToArabic(data?.invoice_number)}
                            </td>
                            <td style={{ textAlign: "center" }} colSpan={2}>
                              {convertToArabic(data?.invoice_date)}
                            </td>
                            <td style={{ textAlign: "center" }} colSpan={2}>
                              {data?.is_paid ? "تم الدفع" : "لم يتم الدفع"}
                            </td>
                          </tr>
                        )}
                      </table>
                    </div>
                  )}
                </div>
              )) || <></>
            );
          })}
          {/* </td> */}
          {/* </tr> */}
          {/* </table> */}
        </div>
      </div>
    );
  }
}
