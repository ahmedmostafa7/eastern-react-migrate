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
class landsallotment_adle extends Component {
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

  checkShatfa = (key) => {
    return [
      { key: "SHATFA_NORTH_EAST_DIRECTION", label: "شمال / شرق" },
      { key: "SHATFA_NORTH_WEST_DIRECTION", label: "شمال / غرب" },
      { key: "SHATFA_SOUTH_EAST_DIRECTION", label: "جنوب / شرق" },
      { key: "SHATFA_SOUTH_WEST_DIRECTION", label: "جنوب / غرب" },
    ].find((r) => r.key == key)?.label;
  };

  checkElecRoom = (key) => {
    return [
      { key: "ELEC_NORTH_EAST_DIRECTION", label: "شمال / شرق" },
      { key: "ELEC_NORTH_WEST_DIRECTION", label: "شمال / غرب" },
      { key: "ELEC_SOUTH_EAST_DIRECTION", label: "جنوب / شرق" },
      { key: "ELEC_SOUTH_WEST_DIRECTION", label: "جنوب / غرب" },
    ].find((r) => r.key == key)?.label;
  };
  componentDidMount() {
    const { t } = this.props;
    console.log("match_id", this.props.match.params.id);
    initializeSubmissionData(this.props.match.params.id).then((response) => {
      getSubmissionHistory(response.submission.workflow_id, this.props).then(
        (result) => {
          var mainObject = response.mainObject;
          let ceator_user_name = response.ceator_user_name;
          let submission = response.submission;
          this.state["steps_history"] = result.steps_history;
          this.state["historydata"] = response.historyData;
          this.setState({ id: this.props.match.params.id });
          let printObj = response?.printObj;
          let title1 = response?.printObj?.printTextEdited?.adle?.title1;
          let title2 = response?.printObj?.printTextEdited?.adle?.title2;
          let title3 = response?.printObj?.printTextEdited?.adle?.title3;
          let title4 = response?.printObj?.printTextEdited?.adle?.title4;
          let title5 = response?.printObj?.printTextEdited?.adle?.title5;
          let title6 = response?.printObj?.printTextEdited?.adle?.title6;
          let title7 = response?.printObj?.printTextEdited?.adle?.title7;

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

          let issuer_name =
            (mainObject?.waseka && mainObject?.waseka?.waseka?.waseka_search) ||
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
            create_date,
            export_no,
            printObj,
            export_date,
            mainObject,
            title1,
            title2,
            title3,
            title4,
            title5,
            title6,
            title7,

            committeeactors1_id,
            committeeactors2_id,
            committeeactors1,
            committeeactors2,
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
            issuer_name,
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
      request_no,
      create_date,
      export_no,
      export_date,
      committeeactors1_id,
      committeeactors2_id,
      committeeactors1,
      committeeactors2,
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
      issuer_name,
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
      parcels,
    } = this.state;

    return (
      <div
        style={{
          marginTop: "10vh",
          padding: "25px",
          textAlign: "justify",
          lineHeight: 1.2,
          height: "80vh",
          overflow: "auto",
          zoom: 0.88,
        }}
        className="adle mohand_font_cust"
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
            <span>{convertToArabic(ma7dar_primary_no)}</span>
          </p>
          <p style={{ marginTop: "14px" }}>
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(ma7dar_primary_date?.split("/")[0] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(ma7dar_primary_date?.split("/")[1] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "5px" }}>
              {convertToArabic(
                ma7dar_primary_date
                  ?.split("/")[2]
                  ?.substring(2, ma7dar_primary_date?.split("/")[2]?.length) ||
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
            <header>
              <div>
                <h5>الإدارة العامة للأراضي والممتلكات</h5>
                <h5>إدارة تخصيص الأراضي الحكومية</h5>
              </div>
              <div style={{ textAlign: "left" }}>
                <h5>
                  الموضوع : بشأن تخصيص{" "}
                  {(plan.selectedLands.length == 1 && "قطعة الأرض") ||
                    "قطع الأراضي"}{" "}
                  بالمخطط المعتمد رقم {convertToArabic(plan.planeval.name)}
                </h5>
                <h5>
                  في حي {plan.selectedLands[0].attributes.DISTRICT_NAME} ب
                  {plan.selectedLands[0].attributes.SUB_MUNICIPALITY_NAME} ب
                  {plan.munval.name} بالمنطقة الشرقية
                </h5>
              </div>
            </header>
            <div>
              <h2>
                {/* فضيلة / رئيس كتابة عدل بمحافظة القطيف */}
                <span>فضيلة / رئيس {issuer_name}</span>
                <span style={{ float: "left" }}>سلمه الله</span>
              </h2>
              <h6>
                <EditPrint
                  printObj={printObj || mainObject}
                  id={id}
                  path="adle.title1"
                  oldText={title1 || "صورة مع التحية لسعادة"}
                />
              </h6>
              <div style={{ display: "flex" }}>
                <h3>السلام عليكم ورحمة الله وبركاته ..</h3>
                <h5>أسأل الله لكم السداد والتوفيق ،، وبعد</h5>
              </div>
            </div>
            {/* فى حالة أرض واحدة */}
            {plan.selectedLands.length == 1 && (
              <div>
                <p>
                  &nbsp;&nbsp;&nbsp; برفقه قرار التخصيص رقم (
                  {convertToArabic(request_no)} - {convertToArabic(k + 1)})
                  بتاريخ {convertToArabic(aminStep?.date)} هـ والمشار فيه لخطاب{" "}
                  {entity_name} بالمنطقة الشرقية رقم{" "}
                  {convertToArabic(letter_no)} بتاريخ{" "}
                  {convertToArabic(letter_date)} هـ بشأن تخصيص قطعة أرض بالمخطط
                  المعتمد رقم {convertToArabic(plan.planeval.name)} في حي{" "}
                  {plan.selectedLands[0].attributes.DISTRICT_NAME} ب
                  {plan.selectedLands[0].attributes.SUB_MUNICIPALITY_NAME}ب
                  {plan.munval.name} وذلك لإقامة (
                  {plan.selectedLands[0].attributes.SRVC_SUBTYPE}) عليها
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp; وجاء بالقرار الإشارة الى نظام الطرق
                  والمباني وقرار مجلس الوزراء رقم {convertToArabic("1370")} في{" "}
                  {convertToArabic("12/11/1393")} هـ المتضمن القواعد والإجراءات
                  الواجب اتباعها في التخطيط وكذلك الإشارة الى قرار مجلس الوزراء
                  رقم {convertToArabic("680")} في{" "}
                  {convertToArabic("25/11/1380")} هـ القاضي بإعطاء الإدرارات
                  الحكومية ما تحتاج من الأراضي وبناءا على الصلاحيات المخولة لنا
                  بتعميم صاحب السمو الملكي وزيرالشئون البلدية و القروية رقم{" "}
                  {convertToArabic("34813")}
                  بتاريخ {convertToArabic("29/6/1431")} هـ القاضي بتعديل الفقرة
                  ({convertToArabic("2 - 30")}) من قرار الصلاحيات رقم{" "}
                  {convertToArabic("17777")} في {convertToArabic("1/4/1431")} هـ
                  المتضمن تفويضنا لصلاحيات إصدار قرارات التخصيص لمواقع المساجد
                  والمدراس والمستوصفات - بحيث تشمل جميع المواقع المعتمدة للخدمات
                  والمرافق العامة ضمن المخططات السكنية الحكومية المعتمدة
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp; لذا نرفق لفضيلتكم بيان التحديد رقم (
                  {convertToArabic("38 / ق")}) في
                  {convertToArabic("9/7/1443")} هـ لقطعة الأرض رقم (
                  {convertToArabic(
                    plan.selectedLands[0].attributes.PARCEL_PLAN_NO
                  )}
                  ) {plan.selectedLands[0].attributes.SRVC_SUBTYPE} بمساحة (
                  {convertToArabic(
                    plan.selectedLands[0].attributes.PARCEL_AREA
                  )}{" "}
                  م٢) التي تم تخصيصها بالمخطط المعتمد رقم{" "}
                  {convertToArabic(plan.planeval.name)} بحي{" "}
                  {plan.selectedLands[0].attributes.DISTRICT_NAME} ب
                  {plan.selectedLands[0].attributes.SUB_MUNICIPALITY_NAME} ل
                  {plan.selectedLands[0].attributes.SRVC_SUBTYPE} ب
                  {plan.munval.name} بالمنطقة الشرقية
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp; أمل إطلاع فضيلتكم و تسجيلها باسم هيئة
                  عقارات الدولة لصالح {entity_name} بالمنطقة الشرقية وتزويدنا
                  بصورة من الصك بعد صدوره علما بأن الأرض خالية من الشوائب
                  والملكيات
                </p>
              </div>
            )}
            {/* فى حالة اكثر من ارض */}
            {plan.selectedLands.length > 1 && (
              <div>
                <p>
                  &nbsp;&nbsp;&nbsp; برفقه نسخه قرارنا رقم (
                  {convertToArabic(request_no)} - {convertToArabic(k + 1)})
                  بتاريخ {convertToArabic(aminStep?.date)}
                  هـ المبني على نظام الطرق والمباني وقرار مجلس الوزارء رقم{" "}
                  {convertToArabic("1270")}
                  بتاريخ {convertToArabic("12/11/1392")} هـ المتضمن القواعد
                  والإجراءات الواجب إتباعها في التخطيط ـ وبناء على أحكام نظام
                  البلديات والقري الصادرة بالمرسوم الملكي رقم{" "}
                  {convertToArabic("م/5")} بتاريخ {convertToArabic("21/2/1397")}{" "}
                  هـ ـ وبناء على قرار مجلس الوزراء رقم {convertToArabic("680")}{" "}
                  بتاريخ {convertToArabic("25/11/1380")} هـ القاضي بإعطاء
                  الإدارات الحكومية ما تحتاج إليه من الأراضي
                </p>
                {is_main_municipality && (
                  <p>
                    &nbsp;&nbsp;&nbsp; وبعد الإطلاع على خطاب {entity_name} ب
                    {plan.munval.name} رقم {convertToArabic(letter_no)} بتاريخ{" "}
                    {convertToArabic(letter_date)} هـ بشأن طلب قرارات التخصيص
                    للأراضي الواقعة بالمخطط رقم (
                    {convertToArabic(plan.planeval.name)}) بحي{" "}
                    {plan.selectedLands[0].attributes.DISTRICT_NAME} بمدينة{" "}
                    {plan.munval.name} والموضح أرقامها بخطابهم ، وبعد الإطلاع
                    على خطاب الإدارة العامة للتخطيط العمراني بالأمانة رقم{" "}
                    {convertToArabic("40066259")} بتاريخ{" "}
                    {convertToArabic("4/7/1440")} هـ
                  </p>
                )}
                {!is_main_municipality && (
                  <p>
                    &nbsp;&nbsp;&nbsp; وبعد الإطلاع على خطاب {entity_name} ب
                    {plan.munval.name} رقم {convertToArabic("22/8/627")} بتاريخ{" "}
                    {convertToArabic("23/6/1440")} هـ بشأن طلب قرارات التخصيص
                    للأراضي الواقعة بالمخطط رقم (
                    {convertToArabic(plan.planeval.name)}) بحي
                    {plan.selectedLands[0].attributes.DISTRICT_NAME} بمدينة{" "}
                    {plan.munval.name} والموضح أرقامها بخطابهم ، وبعد الإطلاع
                    على خطاب بلدية {plan.munval.name} رقم{" "}
                    {convertToArabic("40066259")} بتاريخ{" "}
                    {convertToArabic("4/7/1440")} هـ
                  </p>
                )}
                <p>
                  &nbsp;&nbsp;&nbsp; وحيث تمت الموافقة على تخصيص قطع الأراضي
                  الموضحة قرارنا المشار إليه أعلاه بالمخطط المعتمد رقم (
                  {convertToArabic(plan.planeval.name)}) بحي{" "}
                  {plan.selectedLands[0].attributes.DISTRICT_NAME} بمدينة{" "}
                  {plan.munval.name} بالمنطقة الشرقية
                </p>
                {plan.selectedLands.length > 1 &&
                  plan.selectedLands.map((land) => (
                    <div>
                      {plan.selectedLands.length > 1 && (
                        <p
                          style={{
                            textDecoration: "underline",
                            paddingRight: "58px",
                          }}
                        >
                          وأن حدود وأبعاد ومساحة القطعة رقم (
                          {convertToArabic(land.attributes.PARCEL_PLAN_NO)})
                          المخصصة "
                          {convertToArabic(land.attributes.SRVC_SUBTYPE)} (
                          {convertToArabic(land.attributes.DETAILED_LANDUSE)})"
                          كالتالي :
                        </p>
                      )}
                      <p>
                        شمالا بطول :{" "}
                        {convertToArabic(land.parcelData.north_length)} م (
                        {convertToArabic(land.parcelData.north_length_text)})
                        ويحدها : {convertToArabic(land.parcelData.north_desc)}
                      </p>
                      <p>
                        جنوبا بطول :{" "}
                        {convertToArabic(land.parcelData.south_length)} م (
                        {convertToArabic(land.parcelData.south_length_text)})
                        ويحدها : {convertToArabic(land.parcelData.south_desc)}
                      </p>
                      <p>
                        شرقا بطول :{" "}
                        {convertToArabic(land.parcelData.east_length)} م (
                        {convertToArabic(land.parcelData.east_length_text)})
                        ويحدها : {convertToArabic(land.parcelData.east_desc)}
                      </p>
                      <p>
                        غربا بطول :{" "}
                        {convertToArabic(land.parcelData.west_length)} م (
                        {convertToArabic(land.parcelData.west_length_text)})
                        ويحدها : {convertToArabic(land.parcelData.west_desc)}
                      </p>
                      <p>
                        المساحة الإجمالية :{" "}
                        {convertToArabic(land.attributes.PARCEL_AREA)} م٢ (
                        {convertToArabic(land.attributes.PARCEL_AREA_TEXT)})
                      </p>
                      {Object.keys(land.parcelShatfa || {}).length > 0 && (
                        <p>
                          و ذلك بعد خصم
                          {Object.keys(land.parcelShatfa)
                            .map(
                              (key) =>
                                ` الشطفة الواقعة بالركن (${this.checkShatfa(
                                  key
                                )}) بمقدار ${convertToArabic(
                                  land.parcelShatfa[key]
                                )} م٢`
                            )
                            .join(" و")}
                        </p>
                      )}
                      {/* {land?.parcelElectric && (<p>
                        و ذلك بعد خصم
                        {` غرفة الكهرباء الواقعة بالركن ${land?.parcelElectric?.electric_room_place} بمقدار ${convertToArabic(land?.parcelElectric?.electric_room_area)} م٢`}
                      </p>)} */}
                      {Object.keys(land.parcelElectric || {}).length > 0 && (
                        <p>
                          و ذلك بعد خصم
                          {Object.keys(land.parcelElectric)
                            .map(
                              (key) =>
                                ` غرفة الكهرباء الواقعة بالركن (${this.checkElecRoom(
                                  key
                                )}) بمقدار ${convertToArabic(
                                  land.parcelElectric[key]
                                )} م٢`
                            )
                            .join(" و")}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            )}
            <p>
              &nbsp;&nbsp;&nbsp; وقد جري تحديد قطع الأراضي سالفة الذكر أعلاه ،
              الواقعة بالمخطط المعتمد رقم ({convertToArabic(plan.planeval.name)}
              ) بحي {plan.selectedLands[0].attributes.DISTRICT_NAME} بمدينة{" "}
              {plan.munval.name} المعطاة عن طريق قرار مجلس الوزارء رقم{" "}
              {convertToArabic("680")} بتاريخ {convertToArabic("25/11/1380")} هـ
              وقرار التخصيص رقم ({convertToArabic(request_no)} -{" "}
              {convertToArabic(k + 1)}) بتاريخ {convertToArabic(aminStep?.date)}{" "}
              هـ
            </p>
            <p>
              &nbsp;&nbsp;&nbsp; أمل إطلاع فضيلتكم و تسجيلها وإفراغها باسم هيئة
              عقارات الدولة لصالح {entity_name}
              بالمنطقة الشرقية وتزويدنا بنسخة من الصكوك بعد صدورها
            </p>
            <div>
              <h5 style={{ textAlign: "center" }}>
                والسلام عليكم ورحمه الله وبركاته ،،،
              </h5>
            </div>
            <div className="printFooter">
              {/* <h5>أمين المنطقة الشرقية</h5> */}
              <h5>{committeeactors1?.position}</h5>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <h5 style={{ marginLeft: "80px" }}>المهندس /</h5>
                <h5 style={{ marginLeft: "50px", marginTop: "10px" }}>
                  {
                    // committeeactors1?.is_approved &&
                    province_id && (
                      <img
                        src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                        width="150px"
                      />
                    )
                  }
                </h5>
              </div>
              <h5>{committeeactors1?.name}</h5>
              {/* <h5>فهد بن محمد الجبير</h5> */}
            </div>
            <h5 style={{ textDecoration: "underline", fontWeight: "bold" }}>
              نعمل مـعـا عـلـي تعزيز كــفـاءة الإنـفـاق
            </h5>
            <ZoomSlider>
              <div>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="adle.title1"
                    oldText={
                      title1 ||
                      " - صورة مع التحية لسعادة مدير فرع هيئة عقارات الدولة بالمنطقة الشرقية"
                    }
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="adle.title2"
                    oldText={
                      title2 ||
                      " - صورة مع التحية لسعادة  لسعادة مدير عام التعليم بالمنطقة الشرقية"
                    }
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="adle.title3"
                    oldText={
                      title3 || " - ص / للإدارة العامة للأراضي والممتلكات ."
                    }
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="adle.title4"
                    oldText={
                      title4 ||
                      " - ص / للإدارة العامة للتخطيط العمراني لإدراج ذلك على المخطط مع نسخة من قرار الأمين"
                    }
                  />
                </h6>
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="adle.title5"
                    oldText={title5 || " - ص / للأراضي ."}
                  />
                </h6>
                <h6>
                  {" "}
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="adle.title6"
                    oldText={title6 || " - يمكن اضافة مراسلات أخري هنا ."}
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

export default withTranslation("labels")(landsallotment_adle);
