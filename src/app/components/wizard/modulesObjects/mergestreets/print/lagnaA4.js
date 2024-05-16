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
// import EditPrint from "app/components/editPrint";
import { withTranslation } from "react-i18next";
class LagnaA4 extends Component {
  state = {
    data: [],
    printObj: {},
    title1: "",
  };
  componentDidMount() {
    const { t } = this.props;
    console.log("match_id", this.props.params.id);
    initializeSubmissionData(this.props.params.id).then((response) => {
      var mainObject = response.mainObject;
      let ceator_user_name = response.ceator_user_name;
      let submission = response.submission;
      this.state["historydata"] = response.historyData;
      this.setState({ id: this.props.params.id });
      let printObj = response?.printObj;
      let title1 = response?.printObj?.printTextEdited?.lagnaA4?.title1;

      let actors = selectActors(submission, mainObject, [2, 1, 0]);
      //

      let committeeactors1_id = actors?.find((r) => r.index == 0)?.id;
      let committeeactors2_id = actors?.find((r) => r.index == 1)?.id;
      let committeeactors3_id = actors?.find((r) => r.index == 2)?.id;
      // let committeeactors3_id =
      //   actors?.find(r => r.index == 2)?.user.id;

      let committeeactors_dynamica_id = actors?.filter(
        (d) =>
          d?.name ==
          (mainObject?.engSecratoryName ||
            actors?.find((r) => r.index == 2)?.name)
      )?.[0]?.id;

      let committeeactors1 = actors?.find((r) => r.index == 0);
      let committeeactors2 = actors?.find((r) => r.index == 1);
      let committeeactors3 = actors?.find((r) => r.index == 2);

      var ownerNames = "";
      var owners = get(
        mainObject,
        "ownerData.ownerData.owners",
        get(mainObject, "ownerData.ownerData", [])
      );
      Object.keys(owners).map((key) => {
        ownerNames +=
          (!isEmpty(ownerNames) ? ", " + owners[key].name : owners[key].name) ||
          "";
      });

      let owners_name =
        ownerNames ||
        get(mainObject, "destinationData.destinationData.entity.name", "");
      let request_type = get(
        mainObject,
        "data_msa7y.msa7yData.submissionType",
        ""
      );
      let benefit_type = get(
        mainObject,
        "data_msa7y.msa7yData.benefitsType",
        ""
      );

      let plan_no = get(mainObject, "landData.landData.PLAN_NO", "");
      let district = get(
        mainObject,
        "landData.landData.lands.parcels[0].attributes.DISTRICT_NAME",
        ""
      );
      let city = get(
        mainObject,
        "landData.landData.lands.parcels[0].attributes.CITY_NAME",
        ""
      );
      let area = mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels
        .reduce((a, b) => {
          return a + b?.area;
        }, 0)
        .toFixed(2);

      let dayDate = convertToArabic(moment(new Date())?.format("iD/iM/iYYYY"));
      let weekDay = t(convertToArabic(moment(new Date())?.format("ddd")));
      this.setState({
        owners_name,
        request_type,
        benefit_type,
        plan_no,
        district,
        city,
        area,
        committeeactors1,
        committeeactors2,
        committeeactors3,
        committeeactors1_id,
        committeeactors2_id,
        committeeactors3_id,
        committeeactors_dynamica_id,
        // id,
        mainObject,
        printObj,
        title1,
        dayDate,
        weekDay,
      });
    });
  }

  render() {
    console.log(this.state);
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    let {
      owners_name,
      request_type,
      benefit_type,
      plan_no,
      district,
      city,
      area,
      committeeactors1,
      committeeactors2,
      committeeactors3,
      committeeactors1_id,
      committeeactors2_id,
      committeeactors3_id,
      committeeactors_dynamica_id,
      printObj,
      id,
      mainObject,
      title1,
      dayDate,
      weekDay,
    } = this.state;

    return (
      <div
        style={{
          marginTop: "10vh",
          padding: "25px",
          textAlign: "justify",
          lineHeight: 2,
          height: "80vh",
          overflow: "auto",
        }}
        className="lagnaA4"
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
        <h1 style={{ textAlign: "center" }}>محضر اللجنة الفنية</h1>
        <div style={{ marginTop: "1vh" }}>
          <p>
            &nbsp;&nbsp;&nbsp; إشارة إلي تعميم معالي وزير الشئون البلدية و
            القروية رقم ٤٦٨٤٧ في تاريخ ٢٤ / ١٠ / ١٤٣٨ هـ المشار فيه إلي الأمر
            السامي رقم ٤١٨٨٢ و تاريخ ١٢ / ٩ /١٤٣٨ هـ القاضي بالموافقة على ما وجه
            به مجلس الوزراء بإعتماد الإجراءات و الضوابط و الشروط لضم الشوارع و
            الممرات للملكيات المجاورة لها الموضحة تفصيلا فى كتاب سمو الأمين
            العام لمجلس الوزراء رقم ٥١١٠ في ٢٧ / ٧ / ١٤٣٨ هـ .
          </p>
          <div>
            <p>
              &nbsp;&nbsp;&nbsp; و بناءا علي البند الأول من اللائحة المشار إليها
              يتم تشكيل لجنة من الإدارات المختصة بكل أمانة وتكون مهمتها دراسة
              طلب ضم الشوارع و ممرات المشاة ( الطرق الداخلية ) و دمجها بالقطع
              المجاورة وفقا للضوابط و الشروط و هي كالآتي :-{" "}
            </p>
            <div>
              <p>١ - أن يكون {request_type} فاصلا بين أملاك صاحب الطلب فقط</p>
              <p>
                ٢ - ألا يكون {request_type} ذا نفع عام أو له صفة المرفق العام
              </p>
              <p>
                ٣ - {request_type} لا يوجد به ضرر على المجاورين بعد أن تم أخذ
                موافقات خطية منهم على إلغائه
              </p>
              <p>
                ٤ - تم تحديد الوسيلة التي تعوض بالفائدة على الأمانة أن تكون ب
                {benefit_type}
              </p>
            </div>
          </div>
          <p>
            &nbsp;&nbsp;&nbsp; و في يوم ({weekDay}) الموافق ({dayDate}) هـ تم
            إجتماع أعضاء اللجنة الفنية المنوه عنها ، و بدارسة طلب المواطنين /{" "}
            {owners_name} ضم ({request_type}) الواقع بين أملاكهم بالمخطط رقم ({" "}
            {convertToArabic(plan_no)} ) {(district && `ب${district}`) || ""}{" "}
            بمحافظة {city} والبالغ مساحته الإجمالية {convertToArabic(area)} م٢{" "}
          </p>
          <p>
            <EditPrint
              printObj={printObj || mainObject}
              id={id}
              path="lagnaA4.title1"
              oldText={
                title1 || "- يمكن كتابة دباجة للخطاب او اي ملاحظات أخري هنا"
              }
            />
          </p>

          <h4 style={{ textAlign: "center" }}>
            وعليه جرى التوقيع ،،، و الله الموفق
          </h4>
          <h5 style={{ textAlign: "center" }}>أعضاء اللجنة ,,,</h5>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr ",
              gridGap: "30px",
              justifyItems: "center",
              textAlign: "center",
            }}
          >
            <div>
              {/* <p>مندوب إدارة المساحة</p> */}
              <p>{committeeactors1?.position}</p>
              {/* {
                committeeactors2.is_approved &&
                  committee_report_no &&
                  is_paid == 1 &&
                province_id !== null && (
                  <div>
                    <img
                      src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                      width="150px"
                    />
                  </div>
                )
              } */}
              {/* <p style={{ whiteSpace: "nowrap" }}>المهندس / ماجد عوض الأسمري</p> */}
              <p style={{ marginTop: "200px", whiteSpace: "nowrap" }}>
                المهندس / {committeeactors1?.name}
              </p>
            </div>
            <div>
              <p style={{ whiteSpace: "nowrap" }}>
                {/* مندوب الإدارة العامة للأراضي و الممتلكات */}
                {committeeactors2?.position}
              </p>
              {
                // committeeactors2.is_approved &&
                //   committee_report_no &&
                //   is_paid == 1 &&
                province_id !== null && (
                  <div>
                    <img
                      src={`${filesHost}/users/${committeeactors2_id}/sign.png`}
                      width="150px"
                    />
                  </div>
                )
              }
              {/* <p>المساح / عبدالله العليط</p> */}
              <p>المساح / {committeeactors2?.name}</p>
            </div>
            <div>
              {/* <p>مندوب إدارة التخطيط</p> */}
              <p>{committeeactors3?.position}</p>
              {/* {
                committeeactors2.is_approved &&
                  committee_report_no &&
                  is_paid == 1 &&
                province_id !== null && (
                  <div>
                    <img
                      src={`${filesHost}/users/${committeeactors3_id}/sign.png`}
                      width="150px"
                    />
                  </div>
                )
              } */}
              {/* <p>المهندس /راشد خالد الخضير</p> */}
              <p style={{ marginTop: "200px" }}>
                المهندس / {committeeactors3?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation("labels")(LagnaA4);
