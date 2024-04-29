import React, { Component } from "react";
import axios from "axios";
import { get, isEmpty } from "lodash";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import moment from "moment-hijri";
import {
  convertToArabic,
  selectActors,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { followUp } from "../../../../../../apps/modules/tabs/tableActionFunctions/tableActions";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import { Row, Col } from "antd";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import SignPics from "../../../../editPrint/signPics";
import EditPrint from "app/components/editPrint";
import ZoomSlider from "app/components/editPrint/zoomEdit";

export default class ministry_report_letter extends Component {
  state = { 
    data: [],
    title1: "", };
  componentDidMount() {
    console.log("match_id", this.props.match.params.id);
    initializeSubmissionData(this.props.match.params.id).then((response) => {
      followUp(
        { ...this.props.match.params },
        0,
        {},
        null,
        false,
        this.props
      ).then((res) => {
        // let aminStep =
        //   res?.prevSteps?.[
        //     res?.prevSteps?.findLastIndex(
        //       (step) => step?.name?.indexOf("أمين المنطقة الشرقية") != -1
        //     )
        //   ];
        let primaryApprovalIndex = res?.prevSteps?.findLastIndex(
          (step) => [2326, 3107].indexOf(step.prevStep.id) != -1
        );

        let aminSignPrimaryApprovalIndex = res?.prevSteps?.findLastIndex(
          (step) => [2851, 3112].indexOf(step.prevStep.id) != -1
        );

        let finalApprovalIndex = res?.prevSteps?.findLastIndex(
          (step) => [2372, 2330, 3119].indexOf(step.prevStep.id) != -1
        );

        let aminSignatureIndex = res?.prevSteps?.findLastIndex(
          (step) => [2899, 3124, 2921].indexOf(step.prevStep.id) != -1
        );

        let aminStep = null;
        if (
          aminSignPrimaryApprovalIndex > primaryApprovalIndex &&
          (finalApprovalIndex == -1 ||
            (finalApprovalIndex > -1 &&
              finalApprovalIndex > aminSignPrimaryApprovalIndex))
        ) {
          aminStep = res?.prevSteps?.[aminSignPrimaryApprovalIndex];
        }
        var mainObject = response.mainObject;
        let ceator_user_name = response.ceator_user_name;
        let submission = response.submission;
        this.state["historydata"] = response.historyData;
        this.setState({ id: this.props.match.params.id });
          let printObj = response?.printObj;
          let title1 = response?.printObj?.printTextEdited?.ministryReport?.title1;
          this.setState({
            printObj: printObj,
            title1: title1,
          });

        let actors = selectActors(submission, mainObject, [4, 3, 2, 1, 0]);

        let committeeactors1 = actors?.find((r) => r.index == 0);
        let committeeactors2 = actors?.find((r) => r.index == 1);
        let committeeactors3 = actors?.find((r) => r.index == 2);
        let committeeactors4 = actors?.find((r) => r.index == 3);
        let committeeactors5 = actors?.find((r) => r.index == 4);

        let userIdeng =
          mainObject?.engUserNameToPrint?.engUser?.id ||
          get(this.state["historydata"], "data.results[0].users.id", 0);

        let committeeactors_dynamica_id = actors?.reduce(
          (b, a) => b && b?.concat(a?.id),
          []
        );

        var ownerNames = "";
        var owners = get(
          mainObject,
          "ownerData.ownerData.owners",
          get(mainObject, "ownerData.ownerData", [])
        );
        Object.keys(owners).map((key) => {
          ownerNames +=
            (!isEmpty(ownerNames)
              ? ", " + owners[key].name
              : owners[key].name) || "";
        });

        let owners_name =
          ownerNames ||
          get(mainObject, "destinationData.destinationData.entity.name", "");
        let plan_no = get(
          mainObject,
          "lagna_karar.lagna_karar.plan_number",
          ""
        );
        let plan_name = get(
          mainObject,
          "lagna_karar.lagna_karar.plan_name",
          ""
        );
        let plan_description = get(
          mainObject,
          "print_notes.printed_remarks.plan_desc",
          ""
        );
        let plan_using_type = get(
          mainObject,
          "submission_data.mostafed_data.mo5tat_use",
          ""
        );
        let using_type = get(
          mainObject,
          "submission_data.mostafed_data.use_sumbol",
          ""
        );
        let city = get(
          mainObject,
          "landData.landData.municipality.CITY_NAME_A",
          ""
        );

        let eng_user_name =
          (mainObject.engUserNameToPrint &&
            mainObject.engUserNameToPrint.engUserName) ||
          get(this.state["historydata"], "data.results[0].users.name", "");

        eng_user_name =
          (eng_user_name.indexOf("المهندس /") != -1 &&
            eng_user_name.replaceAll("المهندس /", "")) ||
          eng_user_name ||
          "";
        let printCheck = get(mainObject, "takreers.print_check", false);
        let morasalat = get(mainObject, "takreers.text1", "");

        let ma7dar_tawze3_no = submission.request_no;
        let ma7dar_tawze3_date = aminStep?.date; //?.split('/')?.reverse()?.join('/')
        let ma7dar_lagna_date = get(
          mainObject,
          "lagna_karar.lagna_karar.ma7dar_lagna_date",
          aminStep?.date?.split("/")?.reverse()?.join("/")
        )
          ?.split("/")
          ?.reverse()
          ?.join("/");

        let ma7dar_primary_no = submission.request_no;
        let ma7dar_primary_date = aminStep?.date;
        let approval_no = submission.request_no;
        let approvalDate = "";
        if (aminSignatureIndex > finalApprovalIndex) {
          approvalDate =
            (finalApprovalIndex != -1 &&
              res?.prevSteps?.[aminSignatureIndex]?.date) ||
            "";
        }
        this.setState({
          ceator_user_name,
          owners_name,
          plan_no,
          plan_name,
          plan_description,
          plan_using_type,
          using_type,
          city,
          eng_user_name,
          printCheck,
          morasalat,
          committeeactors5,
          committeeactors_dynamica_id,
          userIdeng,
          ma7dar_tawze3_no,
          ma7dar_tawze3_date,
          ma7dar_primary_no,
          ma7dar_primary_date,
          approvalDate,
          approval_no,
          title1,
          printObj,
          mainObject,
        });
      });
    });
  }

  convertEnglishToArabic(english, notreverse) {
    //
    var arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (!english || english == null || english == "") {
      return "";
    } else {
      let stringEnglish = english.toString();
      var chars = stringEnglish.split("");
      for (var i = 0; i < chars.length; i++) {
        if (/\d/.test(chars[i])) {
          chars[i] = arabicNumbers[chars[i]];
        }
      }
      let revesedChars = chars.join("");
      if (notreverse) return revesedChars; //.split('/').reverse().join('/')

      if (revesedChars.indexOf(".") > -1) {
        return revesedChars;
      }
      // console.log("ee",stringEnglish)
      return revesedChars.split("/").reverse().join("/");
    }
  }

  render() {
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    let {
      owners_name = "",
      plan_no = "",
      plan_description = "",
      plan_using_type = "",
      using_type = "",
      city = "",
      committeeactors5 = {},
      committeeactors_dynamica_id = "",
      ma7dar_primary_no,
      ma7dar_primary_date,
      approvalDate,
      approval_no,
      title1,
      printObj,
      mainObject,
      id,
    } = this.state;
    return (
      <div className="table-report-container" style={{ marginTop: "20px" }}>
        {/* <div
          style={{
            textAlign: "left",
            position: "absolute",
            left: "0vh",
            top: "3vh",
          }}
        >
          <p style={{ marginLeft: "50px" }}>
            <span>{convertToArabic(ma7dar_tawze3_no)}</span>
          </p>
          <p style={{ marginTop: "14px" }}>
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(ma7dar_tawze3_date?.split("/")[0] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(ma7dar_tawze3_date?.split("/")[1] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "5px" }}>
              {convertToArabic(
                ma7dar_tawze3_date
                  ?.split("/")[2]
                  ?.substring(2, ma7dar_tawze3_date?.split("/")[2]?.length) ||
                  ""
              )}
            </span>
            {"    "}
          </p>
        </div> */}
        <div className="table-pr" style={{ display: "grid" }}>
          {/* <div style={{ display: "grid", justifyContent: "flex-end" }}> */}
          <div className="">
            <button
              className="btn add-btnT printBtn"
              onClick={() => {
                window.print();
              }}
            >
              طباعة
            </button>
          </div>
          {/* </div> */}
          <div className="printContent mohand_font_not_bold">
            <header>
              <div className="first_section">
                <h5>الإدارة العامـة للتخطيط العمراني</h5>
                <h5 className="headerpadding" style={{ marginRight: "40px" }}> إدارة التخطيـط</h5>
              </div>
              <div className="second_section">
                <h5>الموضوع : تبليغ المخطط المعتمد</h5>
                <h5 className="headerpadding">
                  رقم ({convertToArabic(plan_no)}) بـ{city}
                </h5>
              </div>
            </header>

            <section className="second_part">
              <div className="secondHeader">
                {" "}
                <h2 style={{ fontSize: "22px" }}>
                  سعادة / وكيل الوزارة للتخطيط الحضري
                  <span className="secondHeaderspan">الموقر</span>
                </h2>
                {/* <h3 style={{ fontSize: "21px" }}>
                  فرع المنطقة الشرقية _ ص.ب : ٥١٩٠ الدمام : ٣١٤٢٢
                </h3> */}
              </div>
              <div className="paragraphPrint para_custom">
                <h5>السلام عليكـم ورحمة الله وبركـاته ,,,</h5>
                <p>
                  &nbsp;&nbsp;&nbsp;أسال الله لكم السداد والتوفيق .. وبعد ، نرفق
                  لسعادتكم نسخة من المخطط رقم ( {convertToArabic(plan_no)} )
                  الخاص بتخطيط أرض / {owners_name} ، الواقعة{" "}
                  {convertToArabic(plan_description)} بمدينة {city} كإستخدام{" "}
                  {plan_using_type} {convertToArabic(using_type)} .
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp; وذلك بعد أن تم اعتماده نهائيا بناء على قرار
                  الاعتماد الصادر من قبلنا برقم ({convertToArabic(approval_no)})
                  وتاريخ ({convertToArabic(approvalDate)}) هـ ، وبناء على
                  الصلاحيات المخولة لنا بموجب القرار رقم{" "}
                  {convertToArabic("1/4300000057")} وتاريخ{" "}
                  {convertToArabic("5/3/1443")} هـ ، مع الإحاطة بأنه قد تم تبليغ
                  الجهات المعنية طبقا للتعميم رقم {convertToArabic("132/5")} في{" "}
                  {convertToArabic("25/10/1401")} هـ والقرار الوزاري رقم{" "}
                  {convertToArabic("60778/ص ز")} في{" "}
                  {convertToArabic("10/9/1428")} هـ وذلك للتمشي بموجبه حسب
                  النظام .
                </p>
                {/* <p>
                  &nbsp;&nbsp;&nbsp; وذلك بعد أن تم اعتماده ابتدائيا بناء على
                  قرار الاعتماد الصادر من قبلنا برقم (
                  {convertToArabic(ma7dar_primary_no)}) وتاريخ (
                  {convertToArabic(ma7dar_primary_date)}) هـ ، وبناء على
                  الصلاحيات المخولة لنا بموجب القرار رقم{" "}
                  {convertToArabic("1/4300000057")} وتاريخ{" "}
                  {convertToArabic("5/3/1443")} هـ ، مع الإحاطة بأنه قد تم تبليغ
                  الجهات المعنية طبقا للتعميم رقم {convertToArabic("132/5")} في{" "}
                  {convertToArabic("25/10/1401")} هـ والقرار الوزاري رقم{" "}
                  {convertToArabic("60778/ص ز")} في{" "}
                  {convertToArabic("10/9/1428")} هـ وذلك للتمشي بموجبه حسب
                  النظام .
                </p> */}
              </div>

              <div style={{ textAlign: "center" }} className="printBye">
                <h5>والسلام عليكـم ورحمة الله وبركـاته ،،،</h5>
              </div>
              <div className="printFooter">
                {/* <h5 style={{ marginBottom: "60px", marginLeft: "27px" }}>
                  أمين المنطقة الشرقية
                </h5>
                <h5>المهندس / فهد بن محمد الجبير</h5>{" "} */}
                <h4>{committeeactors5.position}</h4>
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <h4 style={{ marginLeft: "80px" }}>المهندس /</h4>
                  <h4 style={{ marginLeft: "50px", marginTop: "10px" }}>
                    {committeeactors5.is_approved && province_id && (
                      <SignPics
                        province_id={province_id}
                        userId={committeeactors_dynamica_id[4]}
                        planApproval={true}
                      />
                    )}
                  </h4>
                </div>
                <p>{committeeactors5.name}</p>{" "}
                <ZoomSlider>
                  <div className="heads">
                    <h6>صورة مع التحية لكل من :-</h6>
                    <h6>
                      - الاتصالات السعودية بالمنطقة الشرقية مع نسخة من المخطط .
                    </h6>
                    <h6>
                      - فرع وزارة البيئة والمياه والزراعة بالمنطقة الشرقية مع نسخة
                      من المخطط .
                    </h6>
                    <h6>
                      - الشركة السعودية للكهرباء فرع المنطقة الشرقية مع نسخة من
                      المخطط .
                    </h6>
                    <h6>
                      - إدارة التصاميم والخدمات الهندسية - الشركة السعودية
                      للكهرباء فرع المنطقة الشرقية نسخة من المخطط + قرص (CD) .
                    </h6>
                    <h6>- لبلدية {city} مع نسخة من المخطط .</h6>
                    <h6>
                      - إدارة المساحة مع نسخة معتمدة منالمخطط لتبليغ كاتب العدل
                      بنسخة معتمدة بعد إكمال اللازم ومن ثم تسليم صاحب العلاقة
                      بنسخة .
                    </h6>
                    {/* <h6>
                      - التخطيط العمراني لتسديد القيد رقم 43047506 في 12/5/1445 هـ
                      وحفظ كامل الأساس بالأرشيف الفني + نسخة معتمدة (الحفظ الدائم)
                      .
                    </h6> */}
                    <h6>
                      <EditPrint
                        printObj={printObj || mainObject}
                        id={id}
                        path="ministryReport.title1"
                        oldText={
                          title1 ||
                          "- التخطيط العمراني لتسديد القيد رقم 43047506 في 21/5/1445 هـ وحفظ كامل الأساس بالأرشيف الفني + نسخة معتمدة (الحفظ الدائم) ."
                        }
                      />
                    </h6>
                    <h6>
                      - قسم المعلومات الجغرافية بالإدارة العامة للتخطيط العمراني
                      مع نسخة من المخطط لتحديث خارطة الأساس .
                    </h6>
                    <h6>
                      - إدارة رخص البناء مع نسخة من خطاب تبليغ ونسخة من المخطط .
                    </h6>
                    <h6>- الصادر العام .</h6>
                  </div>
                </ZoomSlider>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
