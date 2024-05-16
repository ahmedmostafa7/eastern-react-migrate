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
class sakPropertycheck_letter_return extends Component {
  state = {
    data: [],
    printObj: {},
    title1: "",
    title2: "",
    title3: "",
    title4: "",
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
      let title1 = response?.printObj?.printTextEdited?.propertyreturn?.title1;
      let title2 = response?.printObj?.printTextEdited?.propertyreturn?.title2;
      let title3 = response?.printObj?.printTextEdited?.propertyreturn?.title3;
      let title4 = response?.printObj?.printTextEdited?.propertyreturn?.title4;

      let actors = selectActors(submission, mainObject, [1, 0]);
      //

      let committeeactors1_id = actors?.find((r) => r?.index == 0)?.id;
      let committeeactors2_id = actors?.find((r) => r?.index == 1)?.id;

      let committeeactors_dynamica_id = actors?.filter(
        (d) =>
          d?.name ==
          (mainObject?.engSecratoryName ||
            actors?.find((r) => r?.index == 2)?.name)
      )?.[0]?.id;

      let committeeactors1 = actors?.find((r) => r?.index == 0);
      let committeeactors2 = actors?.find((r) => r?.index == 1);

      let request_no = get(submission, "request_no");
      let create_date = get(submission, "create_date");
      let export_no = get(submission, "export_no");
      let export_date = get(submission, "export_date");

      var ownerNames = "";
      var owners = Object.keys(mainObject?.ownerData?.ownerData?.owners)?.map(
        (ownerKey) => {
          return {
            owner_name: mainObject?.ownerData?.ownerData?.owners[ownerKey].name,
            identity: localizeNumber(
              mainObject?.ownerData?.ownerData?.owners[ownerKey].ssn ||
                mainObject?.ownerData?.ownerData?.owners[ownerKey]
                  .code_regesteration ||
                mainObject?.ownerData?.ownerData?.owners[ownerKey]
                  .commercial_registeration
            ),
            identity_label:
              (mainObject?.ownerData?.ownerData?.owners[ownerKey].ssn &&
                "هوية وطنية") ||
              (mainObject?.ownerData?.ownerData?.owners[ownerKey]
                .code_regesteration &&
                "كود الجهة") ||
              (mainObject?.ownerData?.ownerData?.owners[ownerKey]
                .commercial_registeration &&
                "سجل التجاري"),
          };
        }
      );

      let owners_name =
        owners?.map((r) => r?.owner_name)?.join(", ") ||
        get(mainObject, "destinationData.destinationData.entity.name", "");

      // var representerData = mainObject?.ownerData?.representerData.reps?.map(
      //   (representer) => {
      //
      //     return {
      //       representer_name: representer.name,
      //       identity: localizeNumber(
      //         representer.ssn ||
      //           representer.code_regesteration ||
      //           representer.commercial_registeration
      //       ),
      //       identity_label:
      //         (representer.ssn && "السجل المدنى") ||
      //         (representer.code_regesteration && "كود الجهة") ||
      //         (representer.commercial_registeration && "السجل التجاري"),
      //       representer_nationality: representer.nationalities.local_name,
      //     };
      //   }
      // );

      let has_representer =
        mainObject?.ownerData &&
        mainObject?.ownerData?.ownerData?.has_representer;
      let wakil_name =
        mainObject?.ownerData &&
        mainObject?.ownerData?.representerData?.reps?.[0]?.name;
      let wakil_nationality_name =
        mainObject?.ownerData &&
        mainObject?.ownerData?.representerData?.reps?.[0]?.nationalities
          ?.local_name;
      let wakil_nationality_type =
        mainObject?.ownerData &&
        mainObject?.ownerData?.representerData?.reps?.[0]?.nationalidtypes
          ?.name;
      let wakil_identity_no =
        mainObject?.ownerData &&
        mainObject?.ownerData?.representerData?.reps?.[0]?.ssn;

      // let representData = get(mainObject, "ownerData.representData", null);
      let wekala_sak_no =
        mainObject?.ownerData &&
        mainObject?.ownerData?.representData?.sak_number;
      let wekala_sak_date =
        mainObject?.ownerData && mainObject?.ownerData?.representData?.sak_date;
      let wekala_issuer =
        mainObject?.ownerData && mainObject?.ownerData?.representData?.issuer;

      // let skok = get(mainObject, "waseka.waseka.table_waseka", []);
      let sak_no =
        mainObject?.waseka &&
        mainObject?.waseka?.waseka?.table_waseka?.[0]?.number_waseka;
      let sak_date =
        mainObject?.waseka &&
        mainObject?.waseka?.waseka?.table_waseka?.[0]?.date_waseka;
      let sak_issuer =
        mainObject?.waseka &&
        mainObject?.waseka?.waseka?.table_waseka?.[0]?.waseka_search;

      let municipality_name =
        (mainObject?.landData &&
          mainObject?.landData?.landData?.municipality?.name) ||
        (mainObject?.landData &&
          mainObject?.landData?.landData?.municipality?.CITY_NAME);
      let district_name =
        mainObject?.landData &&
        mainObject?.landData?.landData?.lands?.parcels?.[0]?.selectedLands?.[0]
          ?.attributes?.DISTRICT_NAME;
      let parcel_description =
        (mainObject?.landData && mainObject?.landData?.landData?.parcel_desc) ||
        (mainObject?.landData &&
          mainObject?.landData?.landData?.lands?.parcels?.[0]?.attributes
            ?.PARCEL_PLAN_NO);

      // let parcels = get(
      //   mainObject,
      //   "landData.landData.lands.parcels",
      //   []
      // ).reduce((a, b) => {
      //   a = (a.length && [
      //     ...a,
      //     ...b.selectedLands?.map((e) => {
      //       return e.attributes;
      //     }),
      //   ]) || [
      //     ...b.selectedLands?.map((e) => {
      //       return e.attributes;
      //     }),
      //   ];
      //   return a;
      // }, []);

      let adle_letter_no =
        mainObject?.afada_adle_statements &&
        mainObject?.afada_adle_statements?.afada_adle_statements?.letter_number;
      let adle_letter_date =
        mainObject?.afada_adle_statements &&
        mainObject?.afada_adle_statements?.afada_adle_statements?.letter_date;

      this.setState({
        printObj,
        request_no,
        create_date,
        export_no,
        export_date,
        committeeactors1_id,
        committeeactors2_id,
        committeeactors1,
        committeeactors2,
        owners_name,
        owners,
        // skok,
        sak_no,
        sak_date,
        sak_issuer,
        // parcels,
        municipality_name,
        district_name,
        parcel_description,
        // representerData,
        has_representer,
        wakil_name,
        wakil_identity_no,
        wakil_nationality_name,
        wakil_nationality_type,
        // representData,
        wekala_sak_no,
        wekala_sak_date,
        wekala_issuer,
        adle_letter_no,
        adle_letter_date,
        title1,
        title2,
        title3,
        title4,
      });
    });
  }

  render() {
    console.log(this.state);
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    let {
      printObj,
      id,
      request_no,
      create_date,
      export_no,
      export_date,
      committeeactors1_id,
      committeeactors2_id,
      committeeactors1,
      committeeactors2,
      owners_name,
      owners,
      // skok,
      sak_no,
      sak_date,
      sak_issuer,
      // parcels,
      municipality_name,
      district_name,
      parcel_description,
      // representerData,
      has_representer,
      wakil_name,
      wakil_identity_no,
      wakil_nationality_name,
      wakil_nationality_type,
      // representData,
      wekala_sak_no,
      wekala_sak_date,
      wekala_issuer,
      adle_letter_no,
      adle_letter_date,
      title1,
      title2,
      title3,
      title4,
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
        className="mohand_font_cust_22 ta5sesVis"
      >
        <div
          style={{
            textAlign: "left",
            position: "absolute",
            left: "2vh",
            top: "1vh",
          }}
        >
          <p style={{ marginLeft: "50px" }}>
            <span>{convertToArabic(export_no)}</span>
          </p>
          <p style={{ marginTop: "14px" }}>
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(export_date?.split("/")[0] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(export_date?.split("/")[1] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "5px" }}>
              {convertToArabic(export_date?.split("/")[2] || "")}
            </span>
            {"    "}
          </p>
        </div>
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
        <header
          style={{
            display: "flex",
            justifyContent: "right",
            position: "fixed",
            width: "100%",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "center",
            }}
          >
            <div>
              <h5>الإدارة العامة للأراضي والممتلكات</h5>
              <h5 style={{ marginRight: "35px" }}>إدارة فحص الملكية</h5>
            </div>
            <div style={{ display: "grid", zoom: 0.9 }}>
              <div style={{ textAlign: "center" }}>
                <p>الموضوع: بشأن التأكد من سريان مفعول الصك العائد ملكيته</p>
                <h5>لـ / {owners_name}</h5>
              </div>
            </div>
          </div>
        </header>
        <div style={{ marginTop: "14vh" }}>
          <div>
            <h2>
              فضيلة / رئيس {convertToArabic(sak_issuer)}
              <span style={{ float: "left", fontWeight: "bold" }}>
                سلمه الله
              </span>
            </h2>
            <h3 style={{ fontWeight: "bold" }}>
              السلام عليكم ورحمة الله وبركاته ..
              <span>أسأل الله لكم السداد والتوفيق ،، وبعد</span>
            </h3>
          </div>

          <div style={{ marginTop: "5vh" }}>
            {/* start of more than one time */}
            <div>
              <p>
                &nbsp;&nbsp;&nbsp; إشارة لخطاب فضيلتكم رقم{" "}
                {convertToArabic(adle_letter_no)} بتاريخ{" "}
                {convertToArabic(adle_letter_date)} هـ المبني على خطابنا رقم{" "}
                {convertToArabic("390933324")} في {convertToArabic("22/2/1440")}{" "}
                هـ المرفق ومشفوعاته بشأن التأكد من سريان مفعول الصك الصادر من{" "}
                {sak_issuer} رقم ({convertToArabic(sak_no)}) بتاريخ{" "}
                {convertToArabic(sak_date)} هـ قطعة{" "}
                {convertToArabic(parcel_description)} بمدينة {municipality_name}{" "}
                ، والعائد ملكيته لـ / {owners_name} بموجب{" "}
                {owners?.map((r) => r?.identity_label).join(" - ")} رقم (
                {owners?.map((r) => r?.identity).join(" - ")})
              </p>
              {/* <p>
                &nbsp;&nbsp;&nbsp; وحيث تمت الإحاطة بما جاء بخطاب فضيلتكم المشار
                إليه أعلاه المتضمن أن أساسه الصك رقم {convertToArabic("331")} في{" "}
                {convertToArabic("12/8/1374")} هـ صادر من كتابة عدل القطيف ومرفق
                إجابة فضيلة رئيس كتابة عدل القطيف .
              </p> */}
              <p>
                &nbsp;&nbsp;&nbsp;{" "}
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="propertyroll.title1"
                    oldText={
                      title1 || "وحيث تمت الإحاطة بما جاء بخطاب فضيلتكم المشار"
                    }
                  />
                </h6>
              </p>
              <p>
                &nbsp;&nbsp;&nbsp;{" "}
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="propertyroll.title2"
                    oldText={title2 || "أود إحاطة فضيلتكم بأنه سبق"}
                  />
                </h6>
              </p>
              <p>
                &nbsp;&nbsp;&nbsp;{" "}
                <h6>
                  <EditPrint
                    printObj={printObj || mainObject}
                    id={id}
                    path="propertyroll.title3"
                    oldText={
                      title3 || "كما تضمنت إفادة الموظف المختص لدي كتابة عدل"
                    }
                  />
                </h6>
              </p>
              {/* <p>
                &nbsp;&nbsp;&nbsp; أود إحاطة فضيلتكم بأنه سبق وأن ورد خطاب
                الإدارة طرفكم رقم {convertToArabic("391428147")} بتاريخ{" "}
                {convertToArabic("6/5/1439")} هـ (المرفق صورته) بشأن التأكد من
                سريان مفعول الصك رقم ({convertToArabic("1666")}) بتاريخ{" "}
                {convertToArabic("7/5/1395")} هـ الذي يحوي حدود وأبعاد الأرض
                الكائن موقعها بالخبر الشمالية رقم {convertToArabic("7")} من
                أراضي السلمان بمحافظة الخبر و العائد ملكيتها ل / شركة مجموعة
                الزامل القابضة سجل تجاري رقم {convertToArabic("2051002758")} وقد
                تضمن خطابكم إرفاق إفادة الموظف المختص لديهم والمؤرخة{" "}
                {convertToArabic("5/5/1439")} هـ المتضمن الإفادة بأنه أجاب فضيلة
                رئيس كتابة عدل محافظة القطيف بالخطابرقم{" "}
                {convertToArabic("39820387")} في
                {convertToArabic("12/3/1439")} هـ للإفادة عن الصك الصادر من
                قبلهم برقم {convertToArabic("331")} فى
                {convertToArabic("12/8/1374")} هـ والذى يعتبر هو الأساس للصك
                الصادر من إدارتهم حسب خطاب وكيل الوزارة للشؤون التوثيق برقم{" "}
                {convertToArabic("262682627")} في {convertToArabic("5/6/1437")}{" "}
                هـ المرفق صورة منه لفة رقم {convertToArabic("32")} وكان جوابه
                وهذا نصه (أن اصك المذكور أعلاه تبين لهم أن سجل الصك موقع ومختوم
                وأساساته الت بني عليها مستكمله للإجراءات الشرعية والنظامية وأن
                إصدارها قد تم وفقا للإجراءات الشرعية النظاميةالمتبعة وبما يتفق
                مع الأوامر السامية والأنظمة والتعليمات علما أن سجل الصك عليه عدة
                تهميشات بالانتقال إلى ملاك أخرين بموجب الصك رقم{" "}
                {convertToArabic("199")} فى {convertToArabic("23/5/1377")} هـ
                بموجب الصك رقم
                {convertToArabic("485")} في {convertToArabic("5/2/1388")} هـ
                أنتهي ){" "}
              </p> */}
              {/* <p>
                &nbsp;&nbsp;&nbsp; كما تضمنت إفادة الموظف المختص لدي كتابة عدل
                محافظة الخبر الأولي المشار إلأيها أعلاه بالرجوع إلى سجل الصك رقم
                {convertToArabic("1666")} في {convertToArabic("7/5/195")} هـ
                الصادر من عدل الخبر الذى اساسه الصك رقم {convertToArabic("485")}
                في {convertToArabic("5/3/1388")} هـ المتفر من الصك الأساس الصادر
                من عدل القطيف برقم
                {convertToArabic("331")} في {convertToArabic("12/8/1374")} هـ
                تبين أنه ساري المفعول{" "}
              </p> */}
              <p>
                &nbsp;&nbsp;&nbsp; لذا نعيد لفضيلتكم كامل أوراق المعاملة بأمل
                الإطلاع والإفادة عن الصك رقم {convertToArabic(sak_no)} بتاريخ{" "}
                {convertToArabic(sak_date)} هـ والصادر من إدارتكم وفقا للأنظمة
                والتعليمات المنظمة لذلك ، مع المصادقة بما يثبت سريان مفعول
                ومطابقة (صورة الصك المرفقة) لسجله وفقا لتوجيهات بهذا الأمر ،
                وتضمين إفادة فضيلتكم بالخطاب الموجة للأمانة ، حتى يتسني للإدارة
                المختصة بالأمانة إكمال اللازم على ضوئه .
              </p>
            </div>
            {/* end of more than one time */}

            <div style={{ textAlign: "center" }}>
              <h5>والسلام عليكم ورحمه الله وبركاته ،،،</h5>
            </div>
            {committeeactors1?.is_approved &&
              // committee_report_no &&
              // is_paid == 1 &&
              province_id !== null && (
                <div>
                  <img
                    src={`${filesHost}/users/${committeeactors1_id}/sub_sign.png`}
                    width="80px"
                  />
                </div>
              )}
            <div
              className="printFooter"
              style={{
                textAlign: "center",
                display: "grid",
                gridGap: "40px",
                justifyContent: "end",
              }}
            >
              {/* <h5>مدير عام إدارة الأراضي والممتلكات</h5> */}
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
                  {committeeactors1?.is_approved && province_id && (
                    <img
                      src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                      width="150px"
                    />
                  )}
                </h5>
              </div>
              <h5>{committeeactors1?.name}</h5>
              {/* <h5>صالح بن عبدالرحمن الراجح</h5> */}
            </div>
            <div>
              {/* <h6>- 23-20-2-40</h6> */}
              <h6>
                <EditPrint
                  printObj={printObj || mainObject}
                  id={id}
                  path="propertyroll.title4"
                  oldText={title4 || "- 23-20-2-40"}
                />
              </h6>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation("labels")(sakPropertycheck_letter_return);
