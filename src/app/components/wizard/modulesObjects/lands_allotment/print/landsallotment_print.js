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
class landsallotment_print extends Component {
  state = {
    data: [],
    printObj: {},
    title1: "",
    title2: "",
    title3: "",
  };
  componentDidMount() {
    const { t, mo3aynaObject } = this.props;
    // const {  } = this.props;

    if (mo3aynaObject) {
      console.log(this.props, mo3aynaObject);
    } else {
      initializeSubmissionData(this?.props?.match?.params?.id).then(
        (response) => {
          getSubmissionHistory(
            response.submission.workflow_id,
            this.props
          ).then((result) => {
            var mainObject = response.mainObject;
            let ceator_user_name = response.ceator_user_name;
            let submission = response.submission;
            this.state["steps_history"] = result.steps_history;
            this.state["historydata"] = response.historyData;
            this.setState({ id: this.props.match.params.id });
            let printObj = response?.printObj;
            let title1 = response?.printObj?.printTextEdited?.landsroll?.title1;
            let title2 = response?.printObj?.printTextEdited?.landsroll?.title2;
            let title3 = response?.printObj?.printTextEdited?.landsroll?.title3;

            let actors = selectActors(submission, mainObject, [2, 1, 0]);
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
            //let committeeactors3 = actors?.find((r) => r.index == 2);
            let allotmentUser =
              mainObject?.allotmentUserNameToPrint?.allotmentUser || "";
            let request_no = get(submission, "request_no");
            let create_date = moment(
              get(submission, "create_date"),
              "D/MM/YYYY"
            ).format("DD/MM/YYYY");
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
              (mainObject?.letter && mainObject?.letter?.letter?.letter_no) ||
              "";
            let letter_date =
              (mainObject?.letter && mainObject?.letter?.letter?.letter_date) ||
              "";
            let import_no =
              (mainObject?.letter && mainObject?.letter?.letter?.import_no) ||
              "";
            let import_date =
              (mainObject?.letter && mainObject?.letter?.letter?.import_date) ||
              "";
            let calling_no =
              (mainObject?.letter && mainObject?.letter?.letter?.calling_no) ||
              "";
            let calling_date =
              (mainObject?.letter &&
                mainObject?.letter?.letter?.calling_date) ||
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
              committeeactors1,
              committeeactors2,
              // committeeactors3,
              allotmentUser,
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
          });
        }
      );
    }
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
      request_no,
      create_date,
      export_no,
      export_date,
      committeeactors1_id,
      committeeactors2_id,
      committeeactors3_id,
      committeeactors1,
      committeeactors2,
      // committeeactors3,
      allotmentUser,
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
          padding: "25px",
          textAlign: "justify",
          lineHeight: 1.3,
          height: "80vh",
          overflow: "auto",
          zoom: 0.94,
        }}
        className="ta5ses mohand_font_cust"
      >
        {/* {plans.map((plan, k) => (
          <div
            key={k}
            style={{
              textAlign: "left",
              position: "absolute",
              left: "0vh",
              top: "3vh",
            }}
          >
            <p style={{ marginLeft: "50px" }}>
              <span>
                {convertToArabic(request_no)} - {convertToArabic(k + 1)}
              </span>
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
                {convertToArabic(create_date?.split("/")[2] || "")}
              </span>
              {"    "}
            </p>
          </div>
        ))} */}
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
            <header
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                marginTop: "10vh",
                // position: "fixed",
                // width: "100%",
              }}
            >
              <div>
                <h5>الإدارة العامة للأراضي والممتلكات</h5>
                <h5>إدارة تخصيص الأراضي الحكومية</h5>
              </div>
              <div
                style={{
                  textAlign: "center",
                  whiteSpace: "normal",
                  marginTop: "3vw",
                }}
              >
                <h5>
                  الموضوع : تخصيص{" "}
                  {(plan.selectedLands.length == 1 && "قطعة الأرض") ||
                    "قطع الأراضي"}{" "}
                  ل{entity_name} ب{convertToArabic(plan.munval.name)} بالمنطقة
                  الشرقية
                </h5>
              </div>
              {aminStep && (
                <div
                  style={{
                    textAlign: "left",
                    marginTop: "-9vh",
                    left: "0vh",
                    top: "3vh",
                  }}
                >
                  <p style={{ marginLeft: "50px" }}>
                    <span>
                      {convertToArabic(request_no)} - {convertToArabic(k + 1)}
                    </span>
                  </p>
                  <p style={{ marginTop: "14px" }}>
                    <span style={{ marginLeft: "50px" }}>
                      {convertToArabic(aminStep?.date?.split("/")[0] || "")}
                    </span>
                    {"    "}
                    <span style={{ marginLeft: "50px" }}>
                      {convertToArabic(aminStep?.date?.split("/")[1] || "")}
                    </span>
                    {"    "}
                    <span style={{ marginLeft: "5px" }}>
                      {convertToArabic(aminStep?.date?.split("/")[2] || "")}
                    </span>
                    {"    "}
                  </p>
                </div>
              )}
            </header>
            <div>
              <h4 style={{ textAlign: "center", fontWeight: "bold" }}>
                قرار تخصيص
              </h4>
              <h5 style={{ fontWeight: "bold" }}>إن أمين المنطقة الشرقية</h5>
              <div>
                {/* بداية قرار تخصيص جهة حكومية */}
                {entity_type == 1 && (
                  <div>
                    <p>
                      &nbsp;&nbsp;&nbsp; بناء على نظام الطرق والمباني وقرار مجلس
                      الوزراء رقم {convertToArabic("1270")} بتاريخ{" "}
                      {convertToArabic("12/11/1392")} هـ المتضمن القواعد
                      والإجراءات الواجب إتباعها في التخطيط
                    </p>
                    <p>
                      &nbsp;&nbsp;&nbsp; وبناء على أحكام نظام البلديات والقري
                      الصادرة بالمرسوم الملكي رقم {convertToArabic("م/5")}{" "}
                      بتاريخ {convertToArabic("21/2/1397")} هـ وبناءا على قرار
                      مجلس الوزراء رقم {convertToArabic("680")} بتاريخ{" "}
                      {convertToArabic("25/11/1380")} هـ القاضي بإعطاء الإدارات
                      الحكومية ما تحتاج إليه من الأراضي
                    </p>
                    {is_main_municipality && (
                      <p>
                        &nbsp;&nbsp;&nbsp; وبعد الإطلاع على خطاب {entity_name}{" "}
                        بالمنطقة الشرقية رقم {convertToArabic(letter_no)} بتاريخ{" "}
                        {convertToArabic(letter_date)} هـ والمتضمن طلب إصدار
                        قرارات تخصيص (
                        {(plan.selectedLands.length == 1 && "لقطعة الأرض") ||
                          "لقطع الأراضي"}
                        ) ل{entity_name} الموضحة بخطابهم المشار أعلاه وفق
                        الإحداثيات بالمخطط رقم ({" "}
                        {convertToArabic(plan.planeval.name)} ) بحي{" "}
                        {convertToArabic(
                          plan.selectedLands[0].attributes.DISTRICT_NAME
                        )}{" "}
                        ب{convertToArabic(plan.munval.name)} وبعد دراسة الطلب من
                        قبل الإدارة العامة للتخطيط العمراني
                      </p>
                    )}
                    {!is_main_municipality && (
                      <p>
                        &nbsp;&nbsp;&nbsp; وبعد الإطلاع على خطاب {entity_name}{" "}
                        بالمنطقة الشرقية رقم {convertToArabic(letter_no)} بتاريخ{" "}
                        {convertToArabic(letter_date)} هـ والمتضمن طلب إصدار
                        قرارات تخصيص (
                        {(plan.selectedLands.length == 1 && "لقطعة الأرض") ||
                          "لقطع الأراضي"}
                        ) ل{entity_name} الموضحة بخطابهم المشار أعلاه وفق
                        الإحداثيات بالمخطط رقم ({" "}
                        {convertToArabic(plan.planeval.name)} ) بحي{" "}
                        {convertToArabic(
                          plan.selectedLands[0].attributes.DISTRICT_NAME
                        )}{" "}
                        ب{convertToArabic(plan.munval.name)} وبعد دراسة الطلب من
                        قبل بلدية {convertToArabic(plan.munval.name)}
                      </p>
                    )}
                    {is_main_municipality &&
                      plan_letter_entity_type !=
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع على{" "}
                          {plan_letter_entity_type} {entity_name} ب
                          {convertToArabic(plan.munval.name)} رقم{" "}
                          {convertToArabic(plan_letter_ma7dar_no)} بتاريخ{" "}
                          {convertToArabic(plan_letter_ma7dar_date)} هـ بشأن{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.SRVC_SUBTYPE
                          )}{" "}
                          (
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DETAILED_LANDUSE
                          )}
                          ) بالمخطط رقم ( {convertToArabic(plan.planeval.name)}{" "}
                          ) بحي{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DISTRICT_NAME
                          )}{" "}
                          ب{convertToArabic(plan.munval.name)} وبعد دراسة الطلب
                          من قبل الإدارة العامة للتخطيط العمراني
                        </p>
                      )}
                    {is_main_municipality &&
                      plan_letter_entity_type ==
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع وموافقة الجهة
                          المستفيدة ({entity_name}) على نسخة المخطط و المصادقة
                          والتوقيع بذلك بشأن{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.SRVC_SUBTYPE
                          )}{" "}
                          (
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DETAILED_LANDUSE
                          )}
                          ) بالمخطط رقم ( {convertToArabic(plan.planeval.name)}{" "}
                          ) بحي{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DISTRICT_NAME
                          )}{" "}
                          ب{convertToArabic(plan.munval.name)} وبعد دراسة الطلب
                          من قبل الإدارة العامة للتخطيط العمراني
                        </p>
                      )}
                    {!is_main_municipality &&
                      plan_letter_entity_type !=
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع على{" "}
                          {plan_letter_entity_type} {entity_name} ب
                          {convertToArabic(plan.munval.name)} رقم{" "}
                          {convertToArabic(plan_letter_ma7dar_no)} بتاريخ{" "}
                          {convertToArabic(plan_letter_ma7dar_date)} هـ بشأن{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.SRVC_SUBTYPE
                          )}{" "}
                          (
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DETAILED_LANDUSE
                          )}
                          ) بالمخطط رقم ( {convertToArabic(plan.planeval.name)}{" "}
                          ) بحي{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DISTRICT_NAME
                          )}{" "}
                          ب{convertToArabic(plan.munval.name)}
                          وبعد دراسة الطلب من قبل بلدية{" "}
                          {convertToArabic(plan.munval.name)}
                        </p>
                      )}
                    {!is_main_municipality &&
                      plan_letter_entity_type ==
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع وموافقة الجهة
                          المستفيدة ({entity_name}) على نسخة المخطط و المصادقة
                          والتوقيع بذلك بشأن{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.SRVC_SUBTYPE
                          )}{" "}
                          (
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DETAILED_LANDUSE
                          )}
                          ) بالمخطط رقم ( {convertToArabic(plan.planeval.name)}{" "}
                          ) بحي{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DISTRICT_NAME
                          )}{" "}
                          ب{convertToArabic(plan.munval.name)}
                          وبعد دراسة الطلب من قبل بلدية{" "}
                          {convertToArabic(plan.munval.name)}
                        </p>
                      )}
                    <p>
                      &nbsp;&nbsp;&nbsp; وبناء على الصلاحيات المخولة لنا بقرار
                      تفويض الصلاحيات رقم {convertToArabic("1/4300000057")}{" "}
                      بتاريخ {convertToArabic("5/3/1444")} هـ القاضي في الفقرة
                      رقم {convertToArabic("272")} بإصدار قرارات التخصيص لمواقع
                      الخدمات والمرافق الحكومية وتعديلها أو إلغاءها على ضوء مخطط
                      معتمد من صاحب الصلاحية وبدراسة الموضوع من قبل المختصين
                      بهذه الأمانة على ضوء المعايير التخطيطية لإستعمالات الأراضي
                    </p>
                    <h5 style={{ textAlign: "center", fontWeight: "bold" }}>
                      يقرر ما يلي :
                    </h5>
                    {/* فى حالة أرض واحدة */}
                    {plan.selectedLands.length == 1 && (
                      <p>
                        أولا : تخصيص قطعة الأرض رقم (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.PARCEL_PLAN_NO
                        )}
                        ) الموضحة بالمخطط المعتمد رقم (
                        {convertToArabic(plan.planeval.name)}) لـ (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.SRVC_SUBTYPE
                        )}{" "}
                        (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.DETAILED_LANDUSE
                        )}
                        ) ) بمساحة إجمالية ({" "}
                        {convertToArabic(
                          plan.selectedLands[0].attributes.PARCEL_AREA
                        )}{" "}
                        م٢ ) (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.PARCEL_AREA_TEXT
                        )}
                        )، بحي {plan.selectedLands[0].attributes.DISTRICT_NAME}{" "}
                        {plan.selectedLands[0].attributes.SUBDIVISION_TYPE &&
                          `ب${plan.selectedLands[0].attributes.SUBDIVISION_TYPE}`}{" "}
                        ب{plan.munval.name} بالمنطقة الشرقية
                      </p>
                    )}
                    {/* فى حالة أكثر من أرض */}
                    {plan.selectedLands.length > 1 && (
                      <div>
                        <p>
                          أولا : تخصيص قطع الأراضي الموضح أرقامها ومساحتها في
                          البيان التالي :
                        </p>
                        <table
                          className="table printTable"
                          style={{ border: "1px solid black" }}
                        >
                          <tr>
                            <th>م</th>
                            <th>رقم قطع الأراضي</th>
                            <th>الحي</th>
                            <th>الغرض</th>
                            <th>المساحة الإجمالية (م٢)</th>
                            <th>اسم التقسيم</th>
                            {/* <th>وصف التقسيم</th> */}
                          </tr>
                          {plan.selectedLands.map((land, index) => {
                            return (
                              <tr>
                                <td>{convertToArabic(index + 1)}</td>
                                <td>
                                  {convertToArabic(
                                    land.attributes.PARCEL_PLAN_NO
                                  )}
                                </td>
                                <td>
                                  {convertToArabic(
                                    land.attributes.DISTRICT_NAME
                                  )}
                                </td>
                                <td>
                                  {convertToArabic(
                                    land.attributes.SRVC_SUBTYPE
                                  )}{" "}
                                  (
                                  {convertToArabic(
                                    land.attributes.DETAILED_LANDUSE
                                  )}
                                  )
                                </td>
                                <td>
                                  {convertToArabic(land.attributes.PARCEL_AREA)}{" "}
                                  م٢
                                </td>
                                {/* <td>
                                  {convertToArabic(
                                    land.attributes.SUBDIVISION_TYPE
                                  )}
                                </td> */}
                                <td>
                                  {convertToArabic(
                                    land.attributes.SUBDIVISION_DESCRIPTION
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </table>
                        <p>
                          الموضحة في المخطط المعتمد رقم (
                          {convertToArabic(plan.planeval.name)}) بحي{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DISTRICT_NAME
                          )}{" "}
                          ب{convertToArabic(plan.munval.name)} بالمنطقة الشرقية
                        </p>
                      </div>
                    )}
                    <p>
                      ثانيا : تلتزم الجهة المستفيدة بعمل جسات التربة قبل طلب
                      الترخيص والشروع في البناء
                    </p>
                    {is_main_municipality && (
                      <p>
                        ثالثا : يلغ أصل القرار مع نسخة مصدقة من المخطط المشار
                        إليه للإدارة العامة للأراضي والممتلكات لاستكمال
                        الإجراءات النظامية اللازمة ومخاطبة كتابة العدل للإفراغ
                        وتسجيلها باسم {entity_name}
                      </p>
                    )}
                    {!is_main_municipality && (
                      <p>
                        ثالثا : يلغ أصل القرار مع نسخة مصدقة من المخطط المشار
                        إليه لبلدية {convertToArabic(plan.munval.name)} لاستكمال
                        الإجراءات النظامية اللازمة ومخاطبة كتابة العدل للإفراغ
                        وتسجيلها باسم هيئة{entity_name}
                      </p>
                    )}
                  </div>
                )}
                {/* نهاية قرار تخصيص جهة حكومية */}

                {/* بداية قرار تخصيص مراكز أهلية */}
                {entity_type == 2 && (
                  <div>
                    <p>
                      &nbsp;&nbsp;&nbsp; بناء على نظام الطرق والمباني وقرار مجلس
                      الوزراء رقم {convertToArabic("1270")} بتاريخ{" "}
                      {convertToArabic("12/11/1392")} هـ المتضمن القواعد
                      والإجراءات الواجب إتباعها في التخطيط
                    </p>
                    <p>
                      &nbsp;&nbsp;&nbsp; وبناء على أحكام نظام البلديات والقري
                      الصادرة بالمرسوم الملكي رقم {convertToArabic("م/5")}{" "}
                      بتاريخ {convertToArabic("21/2/1397")} هـ وبناءا على الأمر
                      السامي الكريم رقم {convertToArabic("5116")} في{" "}
                      {convertToArabic("8/8/1432")} هـ بشأن الموافقة على ما
                      انتهت إليه اللجنة المشكلة بالأمر السامي الكريم رقم
                      ٤/ب/١٦٠٥٠ في {convertToArabic("4/4/1424")} هـ من هذه
                      الوزارة ووزارة الشئون الإجتماعية لوضع الضوابط والشروط
                      اللازمة لمنح {entity_name} الأراضي اللازمة لها
                    </p>
                    {is_main_municipality &&
                      plan_letter_entity_type !=
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع على خطاب معالي وزير
                          الموارد البشرية و التنمية الإجتماعية رقم{" "}
                          {convertToArabic(letter_no)} بتاريخ{" "}
                          {convertToArabic(letter_date)} هـ المرفق به طلب{" "}
                          {center_name} والمرخص من {entity_name} برقم ({" "}
                          {convertToArabic(center_license_number)} ) بتاريخ{" "}
                          {convertToArabic(license_issue_date)} هـ لصاحبه /{" "}
                          {center_owner_name} وطلب معاليه النظر في إمكانية منح
                          المركز{" "}
                          {(plan.selectedLands.length == 1 && "أرض") || "أراضي"}{" "}
                          وبعد الإطلاع على مذكرة الإحالة الصادرة من مكتب معالي
                          الوزير برقم {convertToArabic("1/4200408328")} بتاريخ{" "}
                          {convertToArabic("26/5/1443")}
                          هـ وبعد دراسة الطلب بالإدارة العامة للتخطيط العمراني
                          بالأمانة وموافقة الجهة المستفيدة ب
                          {plan_letter_entity_type} رقم (
                          {convertToArabic(plan_letter_ma7dar_no)}) بتاريخ (
                          {convertToArabic(plan_letter_ma7dar_date)}) هـ (
                          {(plan.selectedLands.length == 1 && "قطعة الأرض") ||
                            "قطع الأراضي"}
                          ) رقم (
                          {convertToArabic(
                            plan.selectedLands
                              .map((land) => land.attributes.PARCEL_PLAN_NO)
                              .join(" - ")
                          )}
                          ) بالمخطط المعتمد رقم ({" "}
                          {convertToArabic(plan.planeval.name)} ) البالغ مساحتها
                          (
                          {convertToArabic(
                            plan.selectedLands
                              .reduce(
                                (a, b) => a + +b.attributes.PARCEL_AREA,
                                0
                              )
                              .toFixed(2)
                          )}{" "}
                          م٢)
                        </p>
                      )}
                    {is_main_municipality &&
                      plan_letter_entity_type ==
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع على خطاب معالي وزير
                          الموارد البشرية و التنمية الإجتماعية رقم{" "}
                          {convertToArabic(letter_no)} بتاريخ{" "}
                          {convertToArabic(letter_date)} هـ المرفق به طلب{" "}
                          {center_name} والمرخص من {entity_name} برقم ({" "}
                          {convertToArabic(center_license_number)} ) بتاريخ{" "}
                          {convertToArabic(license_issue_date)} هـ لصاحبه /{" "}
                          {center_owner_name} وطلب معاليه النظر في إمكانية منح
                          المركز{" "}
                          {(plan.selectedLands.length == 1 && "أرض") || "أراضي"}{" "}
                          وبعد الإطلاع على مذكرة الإحالة الصادرة من مكتب معالي
                          الوزير برقم {convertToArabic("1/4200408328")} بتاريخ{" "}
                          {convertToArabic("26/5/1443")}
                          هـ وبعد دراسة الطلب بالإدارة العامة للتخطيط العمراني
                          بالأمانة وموافقة الجهة المستفيدة {entity_name} عىل
                          نسخة المخطط و المصادقة و التوقيع بذلك على (
                          {(plan.selectedLands.length == 1 && "قطعة الأرض") ||
                            "قطع الأراضي"}
                          ) رقم (
                          {convertToArabic(
                            plan.selectedLands
                              .map((land) => land.attributes.PARCEL_PLAN_NO)
                              .join(" - ")
                          )}
                          ) بالمخطط المعتمد رقم ({" "}
                          {convertToArabic(plan.planeval.name)} ) البالغ مساحتها
                          (
                          {convertToArabic(
                            plan.selectedLands
                              .reduce(
                                (a, b) => a + +b.attributes.PARCEL_AREA,
                                0
                              )
                              .toFixed(2)
                          )}{" "}
                          م٢)
                        </p>
                      )}
                    {!is_main_municipality &&
                      plan_letter_entity_type !=
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع على خطاب معالي وزير
                          الموارد البشرية و التنمية الإجتماعية رقم{" "}
                          {convertToArabic(letter_no)} بتاريخ{" "}
                          {convertToArabic(letter_date)} هـ المرفق به طلب{" "}
                          {center_name} والمرخص من {entity_name} برقم ({" "}
                          {convertToArabic(center_license_number)} ) بتاريخ{" "}
                          {convertToArabic(license_issue_date)} هـ لصاحبه /{" "}
                          {center_owner_name} وطلب معاليه النظر في إمكانية منح
                          المركز{" "}
                          {(plan.selectedLands.length == 1 && "أرض") || "أراضي"}{" "}
                          وبعد الإطلاع على مذكرة الإحالة الصادرة من مكتب معالي
                          الوزير برقم {convertToArabic("1/4200408328")} بتاريخ{" "}
                          {convertToArabic("26/5/1443")} هـ وخطاب بلدية{" "}
                          {convertToArabic(plan.munval.name)} بالأمانة رقم{" "}
                          {convertToArabic("4211854")}
                          في {convertToArabic("29/1/1443")} هـ وموافقة الجهة
                          المستفيدة ب{plan_letter_entity_type} رقم (
                          {convertToArabic(plan_letter_ma7dar_no)}) بتاريخ (
                          {convertToArabic(plan_letter_ma7dar_date)}) هـ على
                          (قطعة أرض / قطع أراضي) رقم ({convertToArabic("خ4")})
                          بالمخطط المعتمد رقم ({" "}
                          {convertToArabic(plan.planeval.name)} ) البالغ مساحتها
                          (
                          {convertToArabic(
                            plan.selectedLands[0].attributes.PARCEL_AREA
                          )}{" "}
                          م٢)
                        </p>
                      )}
                    {!is_main_municipality &&
                      plan_letter_entity_type ==
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع على خطاب معالي وزير
                          الموارد البشرية و التنمية الإجتماعية رقم{" "}
                          {convertToArabic(letter_no)} بتاريخ{" "}
                          {convertToArabic(letter_date)} هـ المرفق به طلب{" "}
                          {center_name} والمرخص من {entity_name} برقم ({" "}
                          {convertToArabic(center_license_number)} ) بتاريخ{" "}
                          {convertToArabic(license_issue_date)} هـ لصاحبه /{" "}
                          {center_owner_name} وطلب معاليه النظر في إمكانية منح
                          المركز{" "}
                          {(plan.selectedLands.length == 1 && "أرض") || "أراضي"}{" "}
                          وبعد الإطلاع على مذكرة الإحالة الصادرة من مكتب معالي
                          الوزير برقم {convertToArabic("1/4200408328")} بتاريخ{" "}
                          {convertToArabic("26/5/1443")} هـ وخطاب بلدية{" "}
                          {convertToArabic(plan.munval.name)} بالأمانة رقم{" "}
                          {convertToArabic("4211854")}
                          في {convertToArabic("29/1/1443")} هـ وموافقة الجهة
                          المستفيدة {entity_name} على نسخة المخطط والمصادقة
                          والتوقيع بذلك على (قطعة أرض / قطع أراضي) رقم (
                          {convertToArabic("خ4")}) بالمخطط المعتمد رقم ({" "}
                          {convertToArabic(plan.planeval.name)} ) البالغ مساحتها
                          (
                          {convertToArabic(
                            plan.selectedLands[0].attributes.PARCEL_AREA
                          )}{" "}
                          م٢)
                        </p>
                      )}
                    <p>
                      &nbsp;&nbsp;&nbsp; وبناء على الصلاحيات المخولة لنا بقرار
                      تفويض الصلاحيات رقم {convertToArabic("4100380000")} بتاريخ{" "}
                      {convertToArabic("23/8/1441")} هـ القاضي في الفقرة رقم (
                      {convertToArabic("272")}) بإصدار قرارات التخصيص لمواقع
                      الخدمات والمرافق الحكومية وتعديلها أو إلغاءها على ضوء مخطط
                      معتمد من صاحب الصلاحية وبدراسة الموضوع من قبل المختصين
                      بهذه الأمانة على ضوء المعايير التخطيطية لإستعمالات الأراضي
                    </p>
                    <h5>يقرر ما يلي :</h5>
                    {plan.selectedLands.length == 1 && (
                      <p>
                        أولا : تخصيص قطعة الأرض رقم (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.PARCEL_PLAN_NO
                        )}
                        ) الموضحة بالمخطط المعتمد رقم (
                        {convertToArabic(plan.planeval.name)}) لـ (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.SRVC_SUBTYPE
                        )}{" "}
                        (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.DETAILED_LANDUSE
                        )}
                        ) ) بمساحة إجمالية ({" "}
                        {convertToArabic(
                          plan.selectedLands[0].attributes.PARCEL_AREA
                        )}{" "}
                        م٢ ) (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.PARCEL_AREA_TEXT
                        )}
                        )،بحي{" "}
                        {convertToArabic(
                          plan.selectedLands[0].attributes.DISTRICT_NAME
                        )}{" "}
                        ب{convertToArabic(plan.munval.name)} بالمنطقة الشرقية
                      </p>
                    )}
                    {plan.selectedLands.length > 1 && (
                      <div>
                        <p>
                          أولا : تخصيص قطع الأراضي الموضح أرقامها ومساحتها في
                          البيان التالي :
                        </p>
                        <table
                          className="table printTable"
                          style={{ border: "1px solid black" }}
                        >
                          <tr>
                            <th>م</th>
                            <th>رقم قطع الأراضي</th>
                            <th>الحي</th>
                            <th>الغرض</th>
                            <th>المساحة الإجمالية (م٢)</th>
                            <th>اسم التقسيم</th>
                            {/* <th>وصف التقسيم</th> */}
                          </tr>
                          {plan.selectedLands.map((land, index) => {
                            return (
                              <tr>
                                <td>{convertToArabic(index + 1)}</td>
                                <td>
                                  {convertToArabic(
                                    land.attributes.PARCEL_PLAN_NO
                                  )}
                                </td>
                                <td>
                                  {convertToArabic(
                                    land.attributes.DISTRICT_NAME
                                  )}
                                </td>
                                <td>
                                  {convertToArabic(
                                    land.attributes.SRVC_SUBTYPE
                                  )}{" "}
                                  (
                                  {convertToArabic(
                                    land.attributes.DETAILED_LANDUSE
                                  )}
                                  )
                                </td>
                                <td>
                                  {convertToArabic(land.attributes.PARCEL_AREA)}{" "}
                                  م٢
                                </td>
                                {/* <td>
                                  {convertToArabic(
                                    land.attributes.SUBDIVISION_TYPE
                                  )}
                                </td> */}
                                <td>
                                  {convertToArabic(
                                    land.attributes.SUBDIVISION_DESCRIPTION
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </table>
                        <p>
                          الموضحة في المخطط المعتمد رقم ({" "}
                          {convertToArabic(plan.planeval.name)}) بحي{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DISTRICT_NAME
                          )}{" "}
                          بمدينة
                          {convertToArabic(plan.munval.name)} بالمنطقة الشرقية
                        </p>
                      </div>
                    )}
                    <p>
                      ثانيا : تلتزم الجهة المستفيدة بعمل جسات التربة قبل طلب
                      الترخيص والشروع في البناء
                    </p>
                    <p>
                      ثالثا : يبلغ نسخة من القرار المشار إليه للإدارة العامة
                      للتخطيط العمراني بالأمانة للإطلاع ولاستكمال الإجراءات
                      النظامية اللازمة لتسليم الموقع لـ {entity_name} وأصل
                      القرار مع نسخة مصدقة من المخطط المشار إليه أعلاه لبلدية{" "}
                      {convertToArabic(plan.munval.name)} للإطلاع ولإكمال
                      إجراءات الترخيص بالبناء للجهة المستفيدة ولمتابعة إنشاء
                      المشروع بحيث تبقي الأرض ملكا للبلدية وتحت تصرف - المركز
                      المذكور - إلى أن يقام المشروع خلال ثلاث سنوات أو تعاد
                      الأرض للبلدية وفق للأمر السامي رقم{" "}
                      {convertToArabic("5116/م ب")} في{" "}
                      {convertToArabic("8/8/1432")} هـ
                    </p>
                  </div>
                )}
                {/* نهاية قرار تخصيص مراكز اهلية */}

                {/* بداية قرار تخصيص جمعيات خيرية */}
                {entity_type == 3 && (
                  <div>
                    <p>
                      &nbsp;&nbsp;&nbsp; بناء على نظام الطرق والمباني وقرار مجلس
                      الوزراء رقم {convertToArabic("1270")} بتاريخ{" "}
                      {convertToArabic("12/11/1392")} هـ المتضمن القواعد
                      والإجراءات الواجب إتباعها في التخطيط
                    </p>
                    <p>
                      &nbsp;&nbsp;&nbsp; وبناء على أحكام نظام البلديات والقري
                      الصادرة بالمرسوم الملكي رقم {convertToArabic("م/5")}{" "}
                      بتاريخ {convertToArabic("21/2/1397")} هـ وبناءا على قرار
                      مجلس الوزراء رقم {convertToArabic("610")} بتاريخ{" "}
                      {convertToArabic("13/5/1395")} هـ القاضي بأن تمنح كل
                      الجمعيات الخيرية{" "}
                      {(plan.selectedLands.length == 1 && "أرض") || "أراضي"}{" "}
                      لإقامة مقرات عليها وقرار مجلس الوزراء رقم{" "}
                      {convertToArabic("216")} بتاريخ{" "}
                      {convertToArabic("26/2/1424")} هـ القاضي بأن تنمح كل جمعية
                      خيرية{" "}
                      {(plan.selectedLands.length == 1 && "قطعة أرض") ||
                        "قطع أراضي"}{" "}
                      مساحتها لاتزيد عن ألفين و خمسمائة متر مربع
                    </p>
                    {is_main_municipality &&
                      plan_letter_entity_type !=
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع على برقية معالي وزير
                          العمل و التنمية الإجتماعية رقم{" "}
                          {convertToArabic(letter_no)} بتاريخ{" "}
                          {convertToArabic(letter_date)} هـ المبلغ بخطاب سعادة
                          مدير عام التخطيط المحلي بالوزارة رقم{" "}
                          {convertToArabic(calling_no)} بتاريخ
                          {convertToArabic(calling_date)} هـ بشأن طلب منح جمعية{" "}
                          {entity_name}{" "}
                          {(plan.selectedLands.length == 1 && "قطعة أرض") ||
                            "قطع أراضي"}{" "}
                          بمساحة (
                          {convertToArabic(
                            plan.selectedLands
                              .reduce(
                                (a, b) => a + +b.attributes.PARCEL_AREA,
                                0
                              )
                              .toFixed(2)
                          )}{" "}
                          م٢) في مدينة {convertToArabic(plan.munval.name)} وبعد
                          دراسة الطلب من قبل الإدارة العامة للتخطيط العمراني
                          بالأمانة وموافقة الجهة المستفيدة على نسخة المخطط
                          والمصادقة والتوقيع بذلك والمبلغ ب
                          {plan_letter_entity_type}
                          سعادة مدير فرع وزارة الموارد البشرية و التنمية
                          الإجتماعية رقم (
                          {convertToArabic(plan_letter_ma7dar_no)}) في (
                          {convertToArabic(plan_letter_ma7dar_date)}) هـ
                        </p>
                      )}
                    {is_main_municipality &&
                      plan_letter_entity_type ==
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع على برقية معالي وزير
                          العمل و التنمية الإجتماعية رقم{" "}
                          {convertToArabic(letter_no)} بتاريخ{" "}
                          {convertToArabic(letter_date)} هـ المبلغ بخطاب سعادة
                          مدير عام التخطيط المحلي بالوزارة رقم{" "}
                          {convertToArabic(calling_no)} بتاريخ
                          {convertToArabic(calling_date)} هـ بشأن طلب منح جمعية{" "}
                          {entity_name}{" "}
                          {(plan.selectedLands.length == 1 && "قطعة أرض") ||
                            "قطع أراضي"}{" "}
                          بمساحة (
                          {convertToArabic(
                            plan.selectedLands
                              .reduce(
                                (a, b) => a + +b.attributes.PARCEL_AREA,
                                0
                              )
                              .toFixed(2)
                          )}{" "}
                          م٢) في مدينة {convertToArabic(plan.munval.name)} وبعد
                          دراسة الطلب من قبل الإدارة العامة للتخطيط العمراني
                          بالأمانة وموافقة الجهة المستفيدة على نسخة المخطط
                          والمصادقة والتوقيع بذلك والمبلغ بسعادة مدير فرع وزارة
                          الموارد البشرية و التنمية الإجتماعية
                        </p>
                      )}
                    {!is_main_municipality &&
                      plan_letter_entity_type !=
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع على برقية معالي وزير
                          العمل و التنمية الإجتماعية رقم{" "}
                          {convertToArabic(letter_no)} بتاريخ{" "}
                          {convertToArabic(letter_date)} هـ المبلغ بخطاب سعادة
                          مدير عام التخطيط المحلي بالوزارة رقم{" "}
                          {convertToArabic(calling_no)} بتاريخ
                          {convertToArabic(calling_date)} هـ بشأن طلب منح جمعية{" "}
                          {entity_name}{" "}
                          {(plan.selectedLands.length == 1 && "قطعة أرض") ||
                            "قطع أراضي"}{" "}
                          بمساحة (
                          {convertToArabic(
                            plan.selectedLands
                              .reduce(
                                (a, b) => a + +b.attributes.PARCEL_AREA,
                                0
                              )
                              .toFixed(2)
                          )}{" "}
                          م٢) في مدينة {convertToArabic(plan.munval.name)} وبعد
                          دراسة الطلب من قبل بلدية{" "}
                          {convertToArabic(plan.munval.name)} بالأمانة وموافقة
                          الجهة المستفيدة على نسخة المخطط والمصادقة والتوقيع
                          بذلك والمبلغ ب{plan_letter_entity_type}
                          سعادة مدير فرع وزارة الموارد البشرية و التنمية
                          الإجتماعية رقم (
                          {convertToArabic(plan_letter_ma7dar_no)}) في (
                          {convertToArabic(plan_letter_ma7dar_date)}) هـ
                        </p>
                      )}
                    {!is_main_municipality &&
                      plan_letter_entity_type ==
                        "موافقة الجهة المستفيدة على نسخة المخطط" && (
                        <p>
                          &nbsp;&nbsp;&nbsp; وبعد الإطلاع على برقية معالي وزير
                          العمل و التنمية الإجتماعية رقم{" "}
                          {convertToArabic(letter_no)} بتاريخ{" "}
                          {convertToArabic(letter_date)} هـ المبلغ بخطاب سعادة
                          مدير عام التخطيط المحلي بالوزارة رقم{" "}
                          {convertToArabic(calling_no)} بتاريخ
                          {convertToArabic(calling_date)} هـ بشأن طلب منح جمعية{" "}
                          {entity_name}{" "}
                          {(plan.selectedLands.length == 1 && "قطعة أرض") ||
                            "قطع أراضي"}{" "}
                          بمساحة (
                          {convertToArabic(
                            plan.selectedLands
                              .reduce(
                                (a, b) => a + +b.attributes.PARCEL_AREA,
                                0
                              )
                              .toFixed(2)
                          )}{" "}
                          م٢) في مدينة {convertToArabic(plan.munval.name)} وبعد
                          دراسة الطلب من قبل بلدية{" "}
                          {convertToArabic(plan.munval.name)} بالأمانة وموافقة
                          الجهة المستفيدة على نسخة المخطط والمصادقة والتوقيع
                          بذلك والمبلغ بسعادة مدير فرع وزارة الموارد البشرية و
                          التنمية الإجتماعية
                        </p>
                      )}
                    <p>
                      &nbsp;&nbsp;&nbsp; وبناء على الصلاحيات المخولة لنا بقرار
                      تفويض الصلاحيات رقم {convertToArabic("4100280000")} بتاريخ{" "}
                      {convertToArabic("23/8/1441")} هـ القاضي في الفقرة رقم (
                      {convertToArabic("272")}) بإصدار قرارات التخصيص لمواقع
                      الخدمات والمرافق الحكومية وتعديلها أو إلغاءها على ضوء مخطط
                      معتمد من صاحب الصلاحية وبدراسة الموضوع من قبل المختصين
                      بهذه الأمانة على ضوء المعايير التخطيطية لإستعمالات الأراضي
                    </p>
                    <h5>يقرر ما يلي :</h5>
                    {plan.selectedLands.length == 1 && (
                      <p>
                        أولا : تخصيص قطعة الأرض رقم (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.PARCEL_PLAN_NO
                        )}
                        ) الموضحة بالمخطط المعتمد رقم (
                        {convertToArabic(plan.planeval.name)}) لـ (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.SRVC_SUBTYPE
                        )}{" "}
                        (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.DETAILED_LANDUSE
                        )}
                        ) ) بمساحة إجمالية ({" "}
                        {convertToArabic(
                          plan.selectedLands[0].attributes.PARCEL_AREA
                        )}{" "}
                        م٢ ) (
                        {convertToArabic(
                          plan.selectedLands[0].attributes.PARCEL_AREA_TEXT
                        )}
                        ) بحي{" "}
                        {convertToArabic(
                          plan.selectedLands[0].attributes.DISTRICT_NAME
                        )}{" "}
                        ب{convertToArabic(plan.munval.name)} بالمنطقة الشرقية
                      </p>
                    )}
                    {plan.selectedLands.length > 1 && (
                      <div>
                        <p>
                          أولا : تخصيص قطع الأراضي الموضح أرقامها ومساحتها في
                          البيان التالي :
                        </p>
                        <table
                          className="table printTable"
                          style={{ border: "1px solid black" }}
                        >
                          <tr>
                            <th>م</th>
                            <th>رقم قطع الأراضي</th>
                            <th>الحي</th>
                            <th>الغرض</th>
                            <th>المساحة الإجمالية (م٢)</th>
                            <th>اسم التقسيم</th>
                            {/* <th>وصف التقسيم</th> */}
                          </tr>
                          {plan.selectedLands.map((land, index) => {
                            return (
                              <tr>
                                <td>{convertToArabic(index + 1)}</td>
                                <td>
                                  {convertToArabic(
                                    land.attributes.PARCEL_PLAN_NO
                                  )}
                                </td>
                                <td>
                                  {convertToArabic(
                                    land.attributes.DISTRICT_NAME
                                  )}
                                </td>
                                <td>
                                  {convertToArabic(
                                    land.attributes.SRVC_SUBTYPE
                                  )}{" "}
                                  (
                                  {convertToArabic(
                                    land.attributes.DETAILED_LANDUSE
                                  )}
                                  )
                                </td>
                                <td>
                                  {convertToArabic(land.attributes.PARCEL_AREA)}{" "}
                                  م٢
                                </td>
                                {/* <td>
                                  {convertToArabic(
                                    land.attributes.SUBDIVISION_TYPE
                                  )}
                                </td> */}
                                <td>
                                  {convertToArabic(
                                    land.attributes.SUBDIVISION_DESCRIPTION
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </table>
                        <p>
                          الموضحة في المخطط المعتمد رقم (
                          {convertToArabic(plan.planeval.name)}) بحي{" "}
                          {convertToArabic(
                            plan.selectedLands[0].attributes.DISTRICT_NAME
                          )}{" "}
                          بمدينة
                          {convertToArabic(plan.munval.name)} بالمنطقة الشرقية
                        </p>
                      </div>
                    )}
                    <p>
                      ثانيا : تلتزم الجهة المستفيدة بعمل جسات التربة قبل طلب
                      الترخيص والشروع في البناء
                    </p>
                    {is_main_municipality && (
                      <p>
                        ثالثا : يلغ أصل القرار مع نسخة مصدقة من المخطط المشار
                        إليه للإدارة العامة للأراضي والممتلكات لاستكمال
                        الإجراءات النظامية اللازمة ومخاطبة كتابةالعدل للإفراغ
                        وتسجيلها باسم {entity_name}
                      </p>
                    )}
                    {!is_main_municipality && (
                      <p>
                        ثالثا : يلغ أصل القرار مع نسخة مصدقة من المخطط المشار
                        إليه لبلدية {convertToArabic(plan.munval.name)} لاستكمال
                        الإجراءات النظامية اللازمة ومخاطبة كتابةالعدل للإفراغ
                        وتسجيلها باسم {entity_name}
                      </p>
                    )}
                  </div>
                )}
                {/* نهاية قرار تخصيص جمعيات خيرية */}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                // alignItems: "center",
              }}
            >
              {allotmentUser && province_id !== null && (
                <div>
                  <img
                    src={`${filesHost}/users/${allotmentUser.id}/sub_sign.png`}
                    width="80px"
                  />
                </div>
              )}
              {committeeactors2?.is_approved && province_id !== null && (
                <div>
                  <img
                    src={`${filesHost}/users/${committeeactors2_id}/sub_sign.png`}
                    width="80px"
                  />
                </div>
              )}

              <div className="printFooter" style={{ marginLeft: "35px" }}>
                {/* <h5>أمين المنطقة الشرقية</h5> */}
                <h5>{committeeactors1?.position}</h5>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <h5 style={{ marginLeft: "30px" }}>المهندس /</h5>
                  <h5 style={{ marginLeft: "25px" }}>
                    {committeeactors1?.is_approved && province_id && (
                      <img
                        src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                        width="150px"
                      />
                    )}
                  </h5>
                </div>
                <h5>{committeeactors1?.name}</h5>
                {/* <h5>فهد بن محمد الجبير</h5> */}
              </div>
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
                    path="landsroll.title1"
                    oldText={
                      title1 ||
                      "- صورة لسعادة وكيل الوزارة للتخطيط الحضري والأرضي ."
                    }
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="landsroll.title2"
                    oldText={title2 || "- نسخة من المخطط المصدق ."}
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="landsroll.title3"
                    oldText={title3 || "  - يمكن اضافة مراسلات أخري هنا ."}
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

export default withTranslation("labels")(landsallotment_print);
