import React, { Component } from "react";
import { host, backEndUrlforMap } from "configFiles/config";
import { fetchData } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import { get, isEmpty } from "lodash";
import Header from "./header";
import axios from "axios";
import { workFlowUrl } from "configFiles/config";
class PrintBox extends Component {
  state = {
    data: {},
    record: {},
    sak: [],
    krar: [],
    submission: [],
    national: "",
    district: "",
    use: "",
    urban: "",
  };
  componentDidMount() {
    const rec = JSON.parse(localStorage.getItem("record")) || {};
    const { submission_file_path } = rec;
    let district = "";
    let use = "";
    let urban = "";
    fetchData(backEndUrlforMap + submission_file_path + "mainObject.json")
      .then((data) => {
        data =
          (typeof data == "string" &&
            JSON.parse(window.lzString.decompressFromBase64(data))) ||
          data;
        let districtId = get(data, "landData.landData.district_id", "");
        let useId = get(data, "landData.landData.land_usage", "");
        let urbanId = get(data, "landData.landData.urban_boundaries_id", "");

        axios.get(`${workFlowUrl}/District/${districtId}`).then((response) => {
          district = response.data.name;
          axios.get(`${workFlowUrl}/PlanUsage/${useId}`).then((plan) => {
            use = plan.data.name;
            axios
              .get(`${workFlowUrl}/UrbanBoundry/${urbanId}`)
              .then((boundry) => {
                urban = boundry.data.name;

                // this.setState({ record: rec, data })
                let sak = get(data, "ownership_data.property_contract", {});
                let krar = get(data, "ownership_data.survey_reports", {});
                let submission = get(data, "planningStudies.pendingReview", {});
                this.setState({
                  record: rec,
                  data,
                  sak,
                  krar,
                  submission,
                  district,
                  use,
                  urban,
                });
              });
          });
        });
      })
      .catch((e) => {
        console.log(e);
        failure(t);
      });
  }
  getNationalId(typeId) {
    axios.get(`${workFlowUrl}/NationalIdTypes/${typeId}`).then((response) => {
      this.setState({ national: response.data.name });
    });
  }
  getDistrictId(districtId) {
    axios.get(`${workFlowUrl}/District/${districtId}`).then((response) => {
      this.setState({ district: response.data.name });
    });
  }
  getUseId(userId) {
    axios.get(`${workFlowUrl}/PlanUsage/${userId}`).then((response) => {
      this.setState({ use: response.data.name });
    });
  }
  getUrbanId(urbanId) {
    axios.get(`${workFlowUrl}/UrbanBoundry/${urbanId}`).then((response) => {
      this.setState({ urban: response.data.name });
    });
  }
  render() {
    const {
      record,
      data,
      sak,
      krar,
      submission,
      national,
      district,
      use,
      urban,
    } = this.state;
    console.log("fff", record, data, sak, krar, submission);

    // if (!isEmpty(districtId) && isEmpty(district)){

    //     this.getDistrictId(districtId)

    // }

    return (
      <div className="grid customize" style={{ background: "#fff" }}>
        <Header name="بيانات مشروع" />
        <div
          className="hidden2"
          style={{
            direction: "ltr",
            justifyContent: "flex-end",
            marginLeft: "2%",
          }}
        >
          <button
            className="btn btn-warning"
            onClick={() => {
              window.print();
            }}
          >
            طباعه
          </button>
        </div>

        <div
          className="print-takrer"
          style={{ height: "81vh", overflowY: "scroll" }}
        >
          <table className="table size_table" style={{ boxShadow: "none" }}>
            <tbody>
              <tr>
                <td className="lable-cust">المالك</td>
                <td>{get(data, "ownerData.ownerData.owner_name", "")}</td>
              </tr>
              <tr>
                <td className="lable-cust">الهوية</td>
                <td>
                  {get(data, "ownerData.ownerData.owner_type", "") == 1
                    ? get(
                        data,
                        "ownerData.ownerData.owner_national_id_number",
                        ""
                      )
                    : get(data, "ownerData.ownerData.owner_type", "") == 2
                    ? get(data, "ownerData.ownerData.code_regesteration", "")
                    : get(
                        data,
                        "ownerData.ownerData.commercial_registeration",
                        ""
                      )}
                </td>
              </tr>
              <tr>
                <td className="lable-cust">اسم المشروع</td>
                <td>{get(data, "landData.landData.plan_name", "بدون")}</td>
              </tr>
              <tr>
                <td className="lable-cust">رقم المشروع</td>
                <td>{get(record, "request_no", "")}</td>

                <td className="lable-cust">الرقم الموحد</td>
                <td>{get(data, "firstData.firstData.one_number", "بدون")}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <table className="table size_table">
            <tbody>
              <tr>
                <td className="lable-cust">رقم المخطط</td>
                <td>{get(data, "landData.landData.plan_number", "بدون")}</td>

                <td className="lable-cust">اسم الحى</td>
                <td>{district}</td>
              </tr>
              <tr>
                <td className="lable-cust">رقم القطعة</td>
                <td>{get(data, "ownerData.ownerData.owner_type", "")}</td>

                <td className="lable-cust">المساحة</td>
                <td>{get(data, "landData.landData.plan_area", "")}</td>
              </tr>
              <table className="table table-map">
                <thead>
                  <th>رقم الصك</th>
                  <th>تاريخه</th>
                </thead>
                <tbody>
                  {sak &&
                    sak.contracts &&
                    sak.contracts.map((d, k) => {
                      return (
                        <tr key={k}>
                          <td>{d.contract_number}</td>
                          <td>{d.contract_date}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <table className="table table-map ">
                <thead>
                  <th>رقم القرار المساحى</th>
                  <th>تاريخه</th>
                </thead>
                <tbody>
                  {krar &&
                    krar.surveyReports &&
                    krar.surveyReports.map((d, k) => {
                      return (
                        <tr key={k}>
                          <td>{d.report_number}</td>
                          <td>{d.report_date}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <tr>
                <td className="lable-cust">النطاق العمرانى</td>
                <td>{urban ? urban : "بدون"}</td>

                <td className="lable-cust">الاستعمال</td>
                <td>{use ? use : "بدون"}</td>
              </tr>
            </tbody>
          </table>
          <h2>المرفقات: "المتطلبات الأساسية لقرار اعتماد المخططات"</h2>
          <table className="table size_table">
            <tbody>
              <tr>
                <td className="lable-cust"> خطاب التقديم</td>
                <td>
                  {get(data, "basic_data.basic_data.application_letter", "")
                    .length != 0 ? (
                    <span>
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="lable-cust">تفويض الاستثمارى</td>
                <td>
                  <span>
                    <i className="fa fa-check-circle" aria-hidden="true"></i>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="lable-cust">صورة الصك</td>
                <td>
                  <span>
                    <i className="fa fa-check-circle" aria-hidden="true"></i>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="lable-cust">الهوية</td>
                <td>
                  {get(data, "ownerData.ownerData.owner_type", "") != 2 ||
                  get(data, "ownerData.ownerData.owner_type", "") == null ? (
                    <span>
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="lable-cust">صورة القرار المساحي </td>
                <td>
                  <span>
                    <i className="fa fa-check-circle" aria-hidden="true"></i>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="lable-cust">الفكرة التصميمية</td>
                <td>
                  <span>
                    <i className="fa fa-check-circle" aria-hidden="true"></i>
                  </span>
                </td>
              </tr>

              <tr>
                <td className="lable-cust">النطاق العمراني </td>
                <td>
                  <span>
                    <i className="fa fa-check-circle" aria-hidden="true"></i>
                  </span>
                </td>
              </tr>
              <tr>
                <td className="lable-cust">الموقع الاستراتيجي</td>
                <td>
                  {get(data, "landData.landData.strategic_use", "").length !=
                  0 ? (
                    <span>
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="lable-cust">الربط مع المجاورين</td>
                <td>
                  {get(data, "landData.landData.strategic_use", "").length !=
                  0 ? (
                    <span>
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="lable-cust">دراسة فحص التربة</td>
                <td>
                  {get(
                    data,
                    "studies.soil_testing.soil_testing_letter_number",
                    ""
                  ) ? (
                    <span>
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="lable-cust">دراسة الهيدرولوجية</td>
                <td>
                  {get(
                    data,
                    "studies.hydraulics_studies.hydraulics_letter_number",
                    ""
                  ) ? (
                    <span>
                      <i className="fa fa-check-circle" aria-hidden="true"></i>
                    </span>
                  ) : (
                    <span>
                      <i className="fa fa-times-circle" aria-hidden="true"></i>
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <h2>مراجعات الطلب</h2>
          <table className="table size_table">
            <thead>
              <th>م</th>
              <th>تاريخ التقديم</th>
              <th>تاريخ النتيجة</th>
              <th>الملاحظات</th>
            </thead>
            <tbody>
              {submission &&
                submission.submissions &&
                submission.submissions.map((d, k) => {
                  return (
                    <tr key={k}>
                      <td>{k + 1}</td>
                      <td>{d.submissionDate}</td>

                      <td>{d.submissionAttachDate}</td>

                      <td>{d.notes ? d.notes : "بدون"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default PrintBox;
