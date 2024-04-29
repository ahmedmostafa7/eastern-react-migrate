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
import { getSubmissionHistory } from "main_helpers/functions/submission_history";
import axios from "axios";
import EditPrint from "app/components/editPrint";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import { withTranslation } from "react-i18next";
class landsallotment_beneficiary_print extends Component {
  state = {
    data: [],
    printObj: {},
    title1: "",
    title2: "",
    title3: "",
    title4: "",
    title5: "",
    title6: "",
    title7: "",
  };
  componentDidMount() {
    const { t } = this.props;
    // console.log("match_id", this.props.match.params.id);
    initializeSubmissionData(this.props.match.params.id).then((response) => {
      getSubmissionHistory(response.submission.workflow_id, this.props).then(
        (result) => {
          var mainObject = response.mainObject;
          this.state["steps_history"] = result.steps_history;
          let ceator_user_name = response.ceator_user_name;
          let submission = response.submission;
          this.state["historydata"] = response.historyData;
          this.setState({ id: this.props.match.params.id });
          let printObj = response?.printObj;
          let title1 = response?.printObj?.printTextEdited?.benf?.title1;
          let title2 = response?.printObj?.printTextEdited?.benf?.title2;
          let title3 = response?.printObj?.printTextEdited?.benf?.title3;
          let title4 = response?.printObj?.printTextEdited?.benf?.title4;
          let title5 = response?.printObj?.printTextEdited?.benf?.title5;
          let title6 = response?.printObj?.printTextEdited?.benf?.title6;
          let title7 = response?.printObj?.printTextEdited?.benf?.title7;

          let actors = selectActors(submission, mainObject, [1, 0]);
          //

          let committeeactors1_id = actors?.find((r) => r.index == 0)?.id;
          let committeeactors2_id = actors?.find((r) => r.index == 1)?.id;
          let committeeactors3_id = actors?.find((r) => r.index == 2)?.id;

          let committeeactors_dynamica_id = actors?.filter(
            (d) =>
              d?.name ==
              (mainObject?.engSecratoryName ||
                actors?.find((r) => r.index == 2)?.name)
          )?.[0]?.id;

          let committeeactors1 = actors?.find((r) => r.index == 0);
          let committeeactors2 = actors?.find((r) => r.index == 1);
          let committeeactors3 = actors?.find((r) => r.index == 2);

          let request_no = get(submission, "request_no");
          let create_date = get(submission, "create_date");
          let export_no = get(submission, "export_no");
          let export_date = get(submission, "export_date");

          let entity_type =
            (mainObject?.destinationData &&
              mainObject?.destinationData?.destinationData?.entity
                ?.entity_type_id) ||
            (mainObject?.destinationData &&
              mainObject?.destinationData?.destinationData?.entity_type_id) ||
            "";
          let entity_name =
            (mainObject?.destinationData &&
              mainObject?.destinationData?.destinationData?.entity?.name) ||
            "";

          let center_name =
            (mainObject?.destinationData &&
              mainObject?.destinationData?.destinationData?.center_name) ||
            "";
          let center_owner_name =
            (mainObject?.destinationData &&
              mainObject?.destinationData?.destinationData
                ?.center_owner_name) ||
            "";
          let center_license_number =
            (mainObject?.destinationData &&
              mainObject?.destinationData?.destinationData
                ?.center_license_number) ||
            "";
          let license_issue_date =
            (mainObject?.destinationData &&
              mainObject?.destinationData?.destinationData
                ?.license_issue_date) ||
            "";

          let letter_no =
            (mainObject?.letter && mainObject?.letter?.letter?.letter_no) || "";
          let letter_date =
            (mainObject?.letter && mainObject?.letter?.letter?.letter_date) ||
            "";
          let import_no =
            (mainObject?.letter && mainObject?.letter?.letter?.import_no) || "";
          let import_date =
            (mainObject?.letter && mainObject?.letter?.letter?.import_date) ||
            "";
          let calling_no =
            (mainObject?.letter && mainObject?.letter?.letter?.calling_no) ||
            "";
          let calling_date =
            (mainObject?.letter && mainObject?.letter?.letter?.calling_date) ||
            "";

          let plan_letter_entity_type =
            (mainObject?.beneficiary_attachments &&
              mainObject?.beneficiary_attachments?.beneficiary_attachments
                ?.letter_type) ||
            "";
          let plan_letter_ma7dar_no =
            (mainObject?.beneficiary_attachments &&
              mainObject?.beneficiary_attachments?.beneficiary_attachments
                ?.letter_no) ||
            (mainObject?.beneficiary_attachments &&
              mainObject?.beneficiary_attachments?.beneficiary_attachments
                ?.ma7dar_no) ||
            "";
          let plan_letter_ma7dar_date =
            (mainObject?.beneficiary_attachments &&
              mainObject?.beneficiary_attachments?.beneficiary_attachments
                ?.letter_date) ||
            (mainObject?.beneficiary_attachments &&
              mainObject?.beneficiary_attachments?.beneficiary_attachments
                ?.ma7dar_date) ||
            "";

          let municipality_name =
            mainObject?.landData.landData.lands.parcels[0].munval.name;

          let is_main_municipality =
            municipality_name == "الدمام" ||
            municipality_name == "الخبر" ||
            municipality_name == "الظهران";

          let municipality_code =
            mainObject?.landData.landData.lands.parcels[0].munval.code;
          let sub_municipality_name =
            mainObject?.landData.landData.lands.parcels[0].selectedLands[0]
              .attributes.SUB_MUNICIPALITY_NAME;
          let sub_municipality_code =
            mainObject?.landData.landData.lands.parcels[0].selectedLands[0]
              .attributes.SUB_MUNICIPALITY_NAME_Code;
          let plans = mainObject?.landData.landData.lands.parcels;
          let plan_number = mainObject?.landData.landData.lands.parcels
            .map((parcel) => parcel.selectedLands[0].attributes.PLAN_NO)
            .join(" - ");
          let district_name = mainObject?.landData.landData.lands.parcels
            .map((parcel) => parcel.selectedLands[0].attributes.DISTRICT_NAME)
            .join(" - ");
          let subdivision_type = mainObject?.landData.landData.lands.parcels
            .map(
              (parcel) => parcel.selectedLands[0].attributes.SUBDIVISION_TYPE
            )
            .join(" - ");
          let subdivision_description =
            mainObject?.landData.landData.lands.parcels
              .map(
                (parcel) =>
                  parcel.selectedLands[0].attributes.SUBDIVISION_DESCRIPTION
              )
              .join(" - ");
          let parcels = mainObject?.landData.landData.lands.parcels.reduce(
            (a, b) => {
              b.selectedLands.map((land) => {
                a.push({
                  ...land.attributes,
                });
              });
              return a;
            },
            []
          );

          let aminSignIndex = this.state[
            "steps_history"
          ]?.prevSteps?.findLastIndex(
            (step) => [2999].indexOf(step.prevStep.id) != -1
          );

          let krarPrintIndex = this.state[
            "steps_history"
          ]?.prevSteps?.findLastIndex(
            (step) => [3000].indexOf(step.prevStep.id) != -1
          );

          let aminStep;
          if (
            (krarPrintIndex == -1 && aminSignIndex != -1) ||
            (krarPrintIndex > -1 &&
              aminSignIndex > -1 &&
              krarPrintIndex > aminSignIndex &&
              krarPrintIndex - aminSignIndex == 1)
          ) {
            aminStep =
              this.state["steps_history"]?.prevSteps?.[aminSignIndex] || null;
          }

          this.setState({
            aminStep,
            printObj,
            mainObject,
            // id,
            title1,
            title2,
            title3,
            title4,
            title5,
            title6,
            title7,
            request_no,
            create_date,
            export_no,
            export_date,
            committeeactors1_id,
            committeeactors2_id,
            committeeactors3_id,
            committeeactors1,
            committeeactors2,
            committeeactors3,
            entity_type,
            entity_name,
            center_name,
            center_owner_name,
            center_license_number,
            license_issue_date,
            letter_no,
            letter_date,
            import_no,
            import_date,
            calling_no,
            calling_date,
            plan_letter_entity_type,
            plan_letter_ma7dar_no,
            plan_letter_ma7dar_date,
            municipality_name,
            is_main_municipality,
            municipality_code,
            sub_municipality_name,
            sub_municipality_code,
            plan_number,
            plans,
            district_name,
            subdivision_type,
            subdivision_description,
            parcels,
          });
        }
      );
    });
  }

  render() {
    console.log(this.state);
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    let {
      aminStep,
      printObj,
      mainObject,
      id,
      title1,
      title2,
      title3,
      title4,
      title5,
      title6,
      title7,
      request_no,
      create_date,
      export_no,
      export_date,
      committeeactors1_id,
      committeeactors2_id,
      committeeactors3_id,
      committeeactors1,
      committeeactors2,
      committeeactors3,
      entity_type,
      entity_name,
      center_name,
      center_owner_name,
      center_license_number,
      license_issue_date,
      letter_no,
      letter_date,
      import_no,
      import_date,
      calling_no,
      calling_date,
      plan_letter_entity_type,
      plan_letter_ma7dar_no,
      plan_letter_ma7dar_date,
      municipality_name,
      is_main_municipality,
      municipality_code,
      sub_municipality_name,
      sub_municipality_code,
      plan_number,
      plans = [],
      district_name,
      subdivision_type,
      subdivision_description,
      parcels,
    } = this.state;

    return (
      <div
        style={{
          // marginTop: "10vh",
          padding: "25px",
          textAlign: "justify",
          lineHeight: 1.5,
          height: "80vh",
          overflow: "auto",
          // zoom: ".95",
        }}
        className="benf_print mohand_font_cust"
      >
        {/* <div
          style={{
            textAlign: "left",
            position: "absolute",
            left: "0vh",
            top: "3vh",
          }}
        >
          <p style={{ marginLeft: "50px" }}>
            <span>{convertToArabic(request_no)}</span>
          </p>
          <p style={{ marginTop: "14px" }}>
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(create_date?.split("/")[0] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(create_date?.split("/")[1] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "5px" }}>
              {convertToArabic(
                ma7dar_primary_date
                  ?.split("/")[2]
                  ?.substring(2, create_date?.split("/")[2]?.length) ||
                  ""
              )}
            </span>
            {"    "}
          </p>
        </div> */}
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
        {plans.map((plan, k) => (
          <div key={k}>
            <header style={{ marginTop: "10vh" }}>
              <div>
                <h5>الإدارة العامة للأراضي والممتلكات</h5>
              </div>
              <div
                style={{
                  display: "grid",
                  justifyItems: "flex-start",
                  justifyContent: "flex-end",
                  whiteSpace: "normal",
                  gridAutoColumns: ".44fr",
                }}
              >
                <h5>
                  الموضوع : تسليم{" "}
                  {(plan.selectedLands.length == 1 && "قطعة الأرض") ||
                    "قطع الأراضي"}{" "}
                  ل{entity_name}
                </h5>
                <h5>ب{plan.munval.name} بالمنطقة الشرقية</h5>
              </div>
            </header>
            <div>
              <h2 style={{ fontWeight: "bold" }}>
                {/* سعادة / المدير العام للتعليم بالمنطقة الشرقية */}
                <h6>
                  <span>سعادة / </span>{" "}
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="benf.title1"
                    oldText={title1 || entity_name}
                  />
                  <span style={{ float: "left" }}>المحترم</span>
                </h6>
              </h2>
              <h3>
                السلام عليكم ورحمة الله وبركاته ..
                <span>أسأل الله لكم السداد والتوفيق ،، وبعد</span>
              </h3>
            </div>
            <div>
              {is_main_municipality && (
                <p>
                  &nbsp;&nbsp;&nbsp; إشارة لخطاب سعادتكم رقم{" "}
                  {convertToArabic(letter_no)} بتاريخ{" "}
                  {convertToArabic(letter_date)} هـ والمتضمن طلب إصدار قرارات
                  تخصيص ل
                  {(plan.selectedLands.length == 1 && "لقطعة الأرض") ||
                    "لقطع الأراضي"}{" "}
                  ل{entity_name} الموضحة بخطابهم المشار إليه أعلاه وفق
                  الإحداثيات بالمخطط رقم ({convertToArabic(plan.planeval.name)})
                  بحي {plan.selectedLands[0].attributes.DISTRICT_NAME} ب
                  {plan.selectedLands[0].attributes.SUB_MUNICIPALITY_NAME} ب
                  {plan.munval.name}
                </p>
              )}
              {!is_main_municipality && (
                <p>
                  &nbsp;&nbsp;&nbsp; إشارة لخطاب سعادتكم رقم{" "}
                  {convertToArabic("4300172853")} بتاريخ{" "}
                  {convertToArabic("9/2/1443")} هـ والمتضمن طلب إصدار قرارات
                  تخصيص ل
                  {(plan.selectedLands.length == 1 && "لقطعة الأرض") ||
                    "لقطع الأراضي"}{" "}
                  ل{entity_name} الموضحة بخطابهم المشار إليه أعلاه وفق
                  الإحداثيات بالمخطط رقم ({convertToArabic(plan.planeval.name)})
                  بحي {plan.selectedLands[0].attributes.DISTRICT_NAME} ب
                  {plan.selectedLands[0].attributes.SUB_MUNICIPALITY_NAME} ب{" "}
                  {plan.munval.name}
                </p>
              )}
              {/* فى حالة أرض واحدة  */}
              {plan.selectedLands.length == 1 && (
                <p>
                  &nbsp;&nbsp;&nbsp; أود إفادة سعادتكم أنه ببحث الموضوع على ضوء
                  دراسة المخططات المعتمدة والمعايير التخطيطية لاستعمالات الأراضي
                  تم تخصيص قطعة الأرض رقم (
                  {convertToArabic(
                    plan.selectedLands[0].attributes.PARCEL_PLAN_NO
                  )}
                  ) الموضحة بالمخطط المعتمد رقم (
                  {convertToArabic(plan.planeval.name)}) لـ "
                  {plan.selectedLands[0].attributes.SRVC_SUBTYPE}" ب
                  {plan.selectedLands[0].attributes.SUB_MUNICIPALITY_NAME} ب
                  {plan.munval.name} بالمنطقة الشرقية للاستعمال المطلوب وفقا
                  لقرار التخصيص رقم ({convertToArabic(request_no)} -{" "}
                  {convertToArabic(k + 1)}) بتاريخ{" "}
                  {convertToArabic(aminStep?.date)} هـ
                  <span>(المرفق صورته)</span>
                </p>
              )}
              {/* فى حالة اكثر من ارض  */}
              {plan.selectedLands.length > 1 && (
                <p>
                  &nbsp;&nbsp;&nbsp; أود إفادة سعادتكم أنه ببحث الموضوع على ضوء
                  دراسة المخططات المعتمدة والمعايير التخطيطية لاستعمالات الأراضي
                  تم تخصيص قطع الأراضي أرقام (
                  {convertToArabic(
                    plan.selectedLands
                      .map((land) => land.attributes.PARCEL_PLAN_NO)
                      .join(" - ")
                  )}
                  ) الموضحة بالمخطط المعتمد رقم (
                  {convertToArabic(plan.planeval.name)}) لـ "
                  {plan.selectedLands[0].attributes.SRVC_SUBTYPE}" ب
                  {plan.selectedLands[0].attributes.SUB_MUNICIPALITY_NAME} ب
                  {plan.munval.name} بالمنطقة الشرقية للاستعمال المطلوب وفقا
                  لقرار التخصيص رقم ({convertToArabic(request_no)} -{" "}
                  {convertToArabic(k + 1)}) بتاريخ{" "}
                  {convertToArabic(aminStep?.date)} هـ{" "}
                  <span> (المرفق صورته)</span>
                </p>
              )}
              {is_main_municipality && (
                <p>
                  &nbsp;&nbsp;&nbsp; وقد تم إشعار الإدارة العامة للتخطيط
                  العمراني بصورة من خطابنا هذا لاستكمال إجراءات تسليم{" "}
                  {(plan.selectedLands.length == 1 && "قطعة الأرض") ||
                    "قطع الأراضي"}{" "}
                  المشار إليها أعلاه واستكمال الإجراءات النظامية لتسجيلها باسم
                  عقارات الدولة لصالح {entity_name} حسب الأنظمة المتبعة
                </p>
              )}
              {!is_main_municipality && (
                <p>
                  &nbsp;&nbsp;&nbsp; وقد تم إشعار بلدية {plan.munval.name} بصورة
                  من خطابنا هذا لاستكمال إجراءات تسليم{" "}
                  {(plan.selectedLands.length == 1 && "قطعة الأرض") ||
                    "قطع الأراضي"}{" "}
                  المشار إليها أعلاه و استكمال الإجرءات النظامية لتسجيلها باسم
                  عقارات الدولة لصالح
                  {entity_name} حسب الأنظمة المتبعة
                </p>
              )}
            </div>
            <div>
              <h5 style={{ textAlign: "center" }}>
                والسلام عليكم ورحمه الله وبركاته ،،،
              </h5>
            </div>
            <div className="printFooter">
              {/* <h5>مدير عام إدارة الأراضي والممتلكات</h5> */}
              <h5>{committeeactors2?.position}</h5>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <h5 style={{ marginLeft: "80px", fontWeight: "bold" }}>
                  المهندس /
                </h5>
                <h5 style={{ marginLeft: "50px" }}>
                  {committeeactors2.is_approved && province_id !== null && (
                    <img
                      src={`${filesHost}/users/${committeeactors2_id}/sign.png`}
                      width="150px"
                    />
                  )}
                </h5>
              </div>
              <h5 style={{ fontWeight: "bold" }}>{committeeactors2?.name}</h5>
              {/* <h5>صالح بن عبدالرحمن الراجح</h5> */}
            </div>
            <h5 style={{ textDecoration: "underline", fontWeight: "bold" }}>
              نعمل مـعـا عـلـي تعزيز كــفـاءة الإنـفـاق
            </h5>
            <ZoomSlider>
              <div style={{ pageBreakAfter: "always" }}>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="benf.title2"
                    oldText={title2 || " - صورة لمكتب معالي الأمين ."}
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="benf.title3"
                    oldText={
                      title3 ||
                      "  - صورة لللإدارة العامة للأراضي والممتلكات لإفراج ذلك بالسجلات."
                    }
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="benf.title4"
                    oldText={
                      title4 ||
                      " -  صورة لللإدارة العامة للتخطيط العمراني لإفراج ذلك على أساسات المخططات لديكم."
                    }
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="benf.title5"
                    oldText={
                      title5 || "  - صورة لوحدة تخصيص الأراضي الحكومية ."
                    }
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="benf.title6"
                    oldText={
                      title6 ||
                      " - صورة / للصادر لتسديد للقيد رقم 43015268 بتاريخ 13 / 6 / 1443    هـ ."
                    }
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="benf.title7"
                    oldText={title7 || "  - يمكن اضافة مراسلات أخري هنا ."}
                  />
                </h6>
              </div>
            </ZoomSlider>
          </div>
        ))}
      </div>
    );
  }
}

export default withTranslation("labels")(landsallotment_beneficiary_print);
