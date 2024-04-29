import { Descriptions } from "antd";
import React, { Component } from "react";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import styled, { css } from "styled-components";
import { Modal } from "antd";
import { get, isEmpty, map } from "lodash";
import moment from "moment-hijri";
// import { PrintContext } from "../../../../editPrint/Print_data_Provider";
import {
  convertToArabic,
  localizeNumber,
  checkImage,
  selectActors,
} from "app/components/inputs/fields/identify/Component/common/common_func";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import axios from "axios";
import EditPrint from "app/components/editPrint";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import { withTranslation } from "react-i18next";
import {
  getFieldDomain,
  getLayerId,
} from "../../../../inputs/fields/identify/Component/common/common_func";
import { getMapInfo } from "../../../../inputs/fields/identify/Component/common";
import { investMapUrl } from "../../../../inputs/fields/identify/Component/mapviewer/config";
class investmentsites_lagnh_print extends Component {
  state = {
    data: [],
    printObj: {},
    title1: "",
    title2: "",
    title3: "",
  };

  getDomainValue = (data, attribute) => {
    let result = data.fields.find((d) => d.name == attribute.name);
    if (result && result.domain) {
      let codedValue = result.domain.codedValues.find(
        (d) => d.code == attribute.code
      );
      if (codedValue && codedValue.name) {
        return codedValue.name;
      } else {
        return attribute.code;
      }
    } else {
      return attribute.code;
    }
  };

  componentDidMount() {
    const { t } = this.props;
    // console.log("match_id", this.props.match.params.id);
    initializeSubmissionData(this.props.match.params.id).then((response) => {
      var mainObject = response.mainObject;
      let ceator_user_name = response.ceator_user_name;
      let submission = response.submission;
      this.state["historydata"] = response.historyData;
      this.setState({ id: this.props.match.params.id });
      let printObj = response?.printObj;
      let title1 = response?.printObj?.printTextEdited?.investroll?.title1;
      let title2 = response?.printObj?.printTextEdited?.investroll?.title2;
      let title3 = response?.printObj?.printTextEdited?.investroll?.title3;

      let actors = selectActors(submission, mainObject, [3, 2, 1, 0]);
      //

      let committeeactors1_id = actors?.find((r) => r.index == 0)?.id;
      let committeeactors2_id = actors?.find((r) => r.index == 1)?.id;
      let committeeactors3_id = actors?.find((r) => r.index == 2)?.id;
      let committeeactors4_id = actors?.find((r) => r.index == 3)?.id;

      let committeeactors_dynamica_id = actors?.filter(
        (d) =>
          d?.name ==
          (mainObject?.engSecratoryName ||
            actors?.find((r) => r.index == 2)?.name)
      )?.[0]?.id;

      let committeeactors1 = actors?.find((r) => r.index == 0);
      let committeeactors2 = actors?.find((r) => r.index == 1);
      let committeeactors3 = actors?.find((r) => r.index == 2);
      let committeeactors4 = actors?.find((r) => r.index == 3);

      let request_no = get(submission, "request_no");
      let create_date = get(submission, "create_date");
      let export_no = get(submission, "export_no");
      let export_date = get(submission, "export_date");

      getMapInfo(investMapUrl).then((response) => {
        let domains = response.info.$layers.layers.find(
          (x) => x.name == "Invest_Site_Polygon"
        );
        let domains_landbase = response.info.$layers.layers.find(
          (x) => x.name == "Landbase_Parcel"
        );

        let parcels = mainObject?.landData?.landData?.lands?.parcels.map(
          (parcel) => ({
            municipality_name: parcel?.attributes?.MUNICIPALITY_NAME || "",
            sub_municipality_name:
              parcel?.attributes?.SUB_MUNICIPALITY_NAME || "",
            district_name: this.getDomainValue(domains, {
              name: "DISTRICT_NAME",
              code:
                parcel?.attributes?.DISTRICT_NAME ||
                mainObject?.landData?.landData?.DISTRICT ||
                "",
            }),
            plan_no:
              parcel?.attributes?.PLAN_NO ||
              mainObject?.landData?.landData?.PLAN_NO ||
              "",
            parcel_no: parcel?.attributes?.PARCEL_PLAN_NO || "",
            parcel_area:
              parcel?.attributes?.PARCEL_AREA ||
              mainObject?.landData?.landData?.area ||
              "",
            parcel_main_luse: this.getDomainValue(domains_landbase, {
              name: "PARCEL_MAIN_LUSE",
              code: parcel?.attributes?.PARCEL_MAIN_LUSE || "",
            }),
            site_activity: this.getDomainValue(domains, {
              name: "SITE_ACTIVITY",
              code: parcel?.attributes?.SITE_ACTIVITY || "",
            }),
            long: parcel?.attributes?.long?.toFixed(6) || "",
            lat: parcel?.attributes?.lat?.toFixed(6) || "",
          })
        );

        let invest_type =
          (mainObject?.investType?.invest_type?.investType == "newLocation" &&
            "طرح موقع استثماري جديد") ||
          (mainObject?.investType?.invest_type?.investType ==
            "updateLocation" &&
            "إعادة طرح موقع استثماري") ||
          "";

        let contract_no =
          (mainObject?.investType &&
            mainObject?.investType?.contract_Data?.contractNumber) ||
          "";
        let contract_type =
          (mainObject?.investType &&
            mainObject?.investType?.contract_Data?.contractType) ||
          "";
        let contract_start_date =
          (mainObject?.investType &&
            mainObject?.investType?.contract_Data?.contractStartDate) ||
          "";
        let contract_end_date =
          (mainObject?.investType &&
            mainObject?.investType?.contract_Data?.contractEndDate) ||
          "";
        let contract_enquiry_request_no =
          (mainObject?.investType &&
            mainObject?.investType?.contract_Data?.contractEnquiryRequestNo) ||
          "";
        let contract_enquiry_request_date =
          (mainObject?.investType &&
            mainObject?.investType?.contract_Data
              ?.contractEnquiryRequestDate) ||
          "";

        let efada_lands =
          (mainObject?.efada_lands_statements &&
            mainObject?.efada_lands_statements?.efada_lands_statements
              ?.notes) ||
          "لا يوجد";
        let efada_plan =
          (mainObject?.efada_plan_statements &&
            mainObject?.efada_plan_statements?.efada_plan_statements?.notes) ||
          "لا يوجد";
        let efada_municipalities =
          (mainObject?.efada_municipality_statements &&
            mainObject?.efada_municipality_statements
              ?.efada_municipality_statements?.notes) ||
          "لا يوجد";

        let investmentNotes = mainObject?.remarks?.find(
          (r) => r.step.id == 3128
        )?.comment; // ||  mainObject?.approvalSubmissionNotes?.notes?.notes?.[0]?.notes || ""; // mainObject?.approvalSubmissionNotes?.notes?.notes?.[mainObject?.approvalSubmissionNotes?.notes?.notes?.length - 1]?.notes

        let mun_manager = {
          position:
            mainObject?.municipilty_manager_name?.munManagerUser?.positions
              ?.name || "",
          name: mainObject?.municipilty_manager_name?.name || "",
          id: mainObject?.municipilty_manager_name?.munManagerUser?.id || "",
        };

        let invest_emp = {
          department:
            mainObject?.invest_emp_name?.investEmpUser?.departments?.name || "",
          name: mainObject?.invest_emp_name?.name || "",
        };

        this.setState({
          request_no,
          printObj,
          mainObject,
          title1,
          title2,
          title3,
          create_date,
          export_no,
          export_date,
          committeeactors1_id,
          committeeactors2_id,
          committeeactors3_id,
          committeeactors4_id,
          committeeactors1,
          committeeactors2,
          committeeactors3,
          committeeactors4,
          parcels,
          invest_type,
          contract_no,
          contract_type,
          contract_start_date,
          contract_end_date,
          contract_enquiry_request_no,
          contract_enquiry_request_date,
          efada_lands,
          efada_plan,
          efada_municipalities,
          mun_manager,
          invest_emp,
          investmentNotes,
        });
      });
    });
  }

  render() {
    console.log(this.state);
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    let {
      printObj,
      mainObject,
      id,
      title1,
      title2,
      title3,
      request_no,
      create_date,
      export_no,
      export_date,
      committeeactors1_id,
      committeeactors2_id,
      committeeactors3_id,
      committeeactors4_id,
      committeeactors1,
      committeeactors2,
      committeeactors3,
      committeeactors4,
      parcels = [],
      invest_type,
      contract_no,
      contract_type,
      contract_start_date,
      contract_end_date,
      contract_enquiry_request_no,
      contract_enquiry_request_date,
      efada_lands,
      efada_plan,
      efada_municipalities,
      mun_manager,
      invest_emp,
      investmentNotes,
    } = this.state;

    return (
      <div
        style={{
          padding: "25px",
          textAlign: "justify",
          lineHeight: 1.1,
          height: "80vh",
          overflow: "auto",
          zoom: 0.93,
        }}
        className="invest mohand_font_not_bold_invest benf_print"
      >
        <div className="printBtnDiv">
          {" "}
          <button
            className="btn add-btnT printBtn"
            onClick={() => {
              window.print();
            }}
          >
            طباعة
          </button>
        </div>
        {parcels.map((prcl, k) => {
          return (
            <div key={k}>
              <table
                className="table invest_printTable tableINv"
                style={{ border: "1px solid black" }}
              >
                <tr>
                  <td style={{ textAlign: "center" }}>اسم النموذج</td>
                  <td
                    colSpan={3}
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "25px",
                    }}
                  >
                    محضر اجتماع اللجنة التنفيذية لاعتماد المواقع الاستثمارية
                  </td>
                  <td
                    style={{ textAlign: "center", verticalAlign: "middle" }}
                    rowSpan={4}
                  >
                    <img src="images/logo2.png" width="150px" />
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>كود النموذج</td>
                  <td style={{ textAlign: "center" }}>N2-01/02</td>
                  <td style={{ textAlign: "center" }}> العملية المرتبطة</td>
                  <td style={{ textAlign: "center" }}>طرح الفرص الاستثمارية</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>تاريخ الاصدار</td>
                  <td style={{ textAlign: "center", direction: "ltr" }}>
                    {"20 December 2022"}
                  </td>
                  <td style={{ textAlign: "center" }}>رقم الاصدار</td>
                  <td style={{ textAlign: "center" }}>V1</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>الجهة ذات الصلة</td>
                  <td style={{ textAlign: "center" }}>
                    وكالة الاستثمارات وتنمية الإيرادات
                  </td>
                  <td style={{ textAlign: "center" }}>الإدارة العامة</td>
                  <td style={{ textAlign: "center" }}>التخطيط الاستثماري</td>
                </tr>
              </table>
              <p style={{ lineHeight: 1.3 }}>
                &nbsp;&nbsp;&nbsp; إشارة إلى قرار معالي الأمين رقم ({" "}
                {convertToArabic(44044786)} ) بتاريخ ({" "}
                {convertToArabic("19 / 04 / 1444")} هـ ) بشأن تشكيل اللجنة
                التنفيذية لاعتماد طرح المواقع الاستثمارية وذلك لمناقشة الموقع
                المذكورة بياناته أدناه :
              </p>
              <table
                className="table invest_printTable"
                style={{ border: "1px solid black" }}
              >
                <tr>
                  <td style={{ textAlign: "center" }}>نوع الاستثمار</td>
                  <td style={{ textAlign: "center" }}>{invest_type}</td>
                  {/* <td>
                    <input
                      type="checkbox"
                      style={{ height: "25px", width: "25px" }}
                    />{" "}
                    &nbsp;موقع قائم
                  </td> */}
                  <td style={{ textAlign: "center" }}>X</td>
                  <td style={{ textAlign: "center" }}>{prcl.long}</td>
                  <td style={{ textAlign: "center" }}>Y</td>
                  <td style={{ textAlign: "center" }}>{prcl.lat}</td>
                </tr>
              </table>
              <table
                className="table printTable"
                style={{ border: "1px solid black" }}
              >
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "25px",
                    }}
                  >
                    بيانات الموقع
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>البلدية الفرعية</td>
                  <td style={{ textAlign: "center" }}>
                    {prcl.sub_municipality_name}
                  </td>
                  <td style={{ textAlign: "center" }}>اسم الحي</td>
                  <td style={{ textAlign: "center" }}>{prcl.district_name}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>رقم القطعة</td>
                  <td style={{ textAlign: "center" }}>
                    {convertToArabic(prcl.parcel_no)}
                  </td>
                  <td style={{ textAlign: "center" }}>رقم المخطط</td>
                  <td style={{ textAlign: "center" }}>
                    {convertToArabic(prcl.plan_no)}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>النشاط الرئيسي</td>
                  <td style={{ textAlign: "center" }}>
                    {prcl.parcel_main_luse}
                  </td>
                  <td style={{ textAlign: "center" }}>النشاط المقترح</td>
                  <td style={{ textAlign: "center" }}>{prcl.site_activity}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>المساحة (م٢)</td>
                  <td style={{ textAlign: "center" }}>
                    {convertToArabic(prcl.parcel_area)} م٢
                  </td>
                  <td style={{ textAlign: "center" }}>رقم المعاملة</td>
                  <td style={{ textAlign: "center" }}>
                    {convertToArabic(request_no)}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    رقم وحالة العقد السابق
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {((contract_no || contract_type) &&
                      convertToArabic(contract_no) + " - " + contract_type) ||
                      ""}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      // fontWeight: "bold",
                      // fontSize: "25px",
                    }}
                  >
                    رقم وتاريخ معاملة إدارة العقود
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {((contract_enquiry_request_no ||
                      contract_enquiry_request_date) &&
                      convertToArabic(contract_enquiry_request_no) +
                        " بتاريخ " +
                        convertToArabic(contract_enquiry_request_date)) ||
                      ""}
                  </td>
                  {/* <td>
                {convertToArabic(
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="investroll.title1"
                    oldText={title1 || "V1"}
                  />
                )}
              </td> */}
                </tr>
              </table>
              <table
                className="table printTable"
                style={{ border: "1px solid black" }}
              >
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "25px",
                    }}
                  >
                    ملاحظات أعضاء اللجنة
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    {" "}
                    ملاحظات الإدارة العامة للأراضي والمملتكات
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {convertToArabic(efada_lands)}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    ملاحظات الإدارة العامة للتخطيط العمراني
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {convertToArabic(efada_plan)}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    ملاحظات البلديات المختصة
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {convertToArabic(efada_municipalities)}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center" }}>
                    ملاحظات وكالة الاستثمارات وتنمية الإيرادات
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {convertToArabic(investmentNotes)}
                  </td>
                </tr>
              </table>
              <table
                className="table investsign_printTable"
                style={{ border: "1px solid black" }}
              >
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "25px",
                    }}
                  >
                    اعتماد اللجنة
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center", height: "193px" }}>
                    {/*<h5>{invest_emp?.department}</h5>
                    <h5>{invest_emp?.name}</h5>*/}
                    {committeeactors4?.is_approved && (
                      <>
                        <h5>{committeeactors4?.user?.departments?.name}</h5>
                        <h5>{committeeactors4?.name}</h5>
                        <div>
                          <h5>التوقيع / </h5>
                          <h5>
                            <img
                              src={`${filesHost}/users/${committeeactors4_id}/sign.png`}
                              width="150px"
                            />
                          </h5>
                        </div>
                      </>
                    )}
                  </td>
                  <td style={{ textAlign: "center", height: "193px" }}>
                    {committeeactors1?.is_approved && (
                      <>
                        <h5>{committeeactors1?.user?.departments?.name}</h5>
                        <h5>المهندس / {committeeactors1?.name}</h5>
                        <div>
                          <h5>التوقيع / </h5>
                          <h5>
                            <img
                              src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                              width="150px"
                            />
                          </h5>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: "center", height: "193px" }}>
                    {committeeactors2?.is_approved && (
                      <>
                        <h5>{committeeactors2?.user?.departments?.name}</h5>
                        <h5>المهندس / {committeeactors2?.name}</h5>
                        <div>
                          <h5>التوقيع / </h5>
                          <h5>
                            <img
                              src={`${filesHost}/users/${committeeactors2_id}/sign.png`}
                              width="150px"
                            />
                          </h5>
                        </div>
                      </>
                    )}
                  </td>
                  <td style={{ textAlign: "center", height: "193px" }}>
                    {mun_manager.name && (
                      <>
                        <h5>{mun_manager?.position}</h5>
                        <h5>المهندس / {mun_manager?.name}</h5>
                        <div>
                          <h5>التوقيع / </h5>
                          <h5>
                            <img
                              src={`${filesHost}/users/${mun_manager?.id}/sign.png`}
                              width="150px"
                            />
                          </h5>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    style={{ textAlign: "center", height: "234px" }}
                  >
                    {committeeactors3?.is_approved && (
                      <>
                        <h5>{committeeactors3?.user?.departments?.name}</h5>
                        <h5>{committeeactors3?.position}</h5>
                        <h5>المهندس / {committeeactors3?.name}</h5>
                        <div>
                          <h5>التوقيع / </h5>
                          <h5>
                            <img
                              src={`${filesHost}/users/${committeeactors3_id}/sign.png`}
                              width="150px"
                            />
                          </h5>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              </table>
            </div>
          );
        })}
      </div>
    );
  }
}

export default withTranslation("labels")(investmentsites_lagnh_print);
