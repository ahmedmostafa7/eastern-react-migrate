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
import {
  setEngUserName,
  mapPrintObjects,
  initializeSubmissionData,
} from "main_helpers/functions/prints";
import { Row, Col } from "antd";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import SignPics from "../../../../editPrint/signPics";

export default class Lagna extends Component {
  state = { data: [] };
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

        let actors = selectActors(submission, mainObject, [4, 3, 2, 1, 0]);
        //
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
        (!isEmpty(ownerNames) ? ", " + owners[key].name : owners[key].name) ||
        "";
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
        let ma7dar_primary_no = submission.request_no;
        let ma7dar_lagna_no = get(
          mainObject,
          "lagna_karar.lagna_karar.ma7dar_lagna_no",
          submission.request_no
        );
        let ma7dar_primary_date = aminStep?.date; //?.split('/')?.reverse()?.join('/')
        let ma7dar_lagna_date = get(
          mainObject,
          "lagna_karar.lagna_karar.ma7dar_lagna_date",
          aminStep?.date?.split("/")?.reverse()?.join("/")
        )
          ?.split("/")
          ?.reverse()
          ?.join("/");

        let city = get(
          mainObject,
          "landData.landData.municipality.CITY_NAME_A",
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
        let printCheck = get(mainObject, "takreers.print_check", false);
        let notes = get(mainObject, "takreers.notes", "");
        let morasalat = get(mainObject, "takreers.text1", "");

        let eng_user_name =
          (mainObject.engUserNameToPrint &&
            mainObject.engUserNameToPrint.engUserName) ||
          get(this.state["historydata"], "data.results[0].users.name", "");

        eng_user_name =
          (eng_user_name.indexOf("المهندس /") != -1 &&
            eng_user_name.replaceAll("المهندس /", "")) ||
          eng_user_name ||
          "";

        this.setState({
          ceator_user_name,
          owners_name,
          plan_no,
          plan_name,
          ma7dar_lagna_no,
          ma7dar_lagna_date,
          ma7dar_primary_no,
          ma7dar_primary_date,
          city,
          plan_using_type,
          using_type,
          eng_user_name,
          printCheck,
          notes,
          morasalat,
          committeeactors1,
          committeeactors5,
          committeeactors_dynamica_id,
          userIdeng,
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
  convertEnglishNotReverseToArabic(english) {
    var arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (english == null || english == "") {
      return "";
    } else {
      var chars = english.split("");
      for (var i = 0; i < chars.length; i++) {
        if (/\d/.test(chars[i])) {
          chars[i] = arabicNumbers[chars[i]];
        }
      }
      let revesedChars = chars.join("");
      return revesedChars;
    }
  }

  render() {
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    let {
      ceator_user_name = "",
      owners_name = "",
      plan_no = "",
      plan_name = "",
      ma7dar_lagna_no = "",
      ma7dar_lagna_date = "",
      ma7dar_primary_no,
      ma7dar_primary_date,
      city = "",
      plan_using_type = "",
      using_type = "",
      eng_user_name = "",
      printCheck = false,
      notes = "",
      morasalat = "",
      committeeactors1 = {},
      committeeactors5 = {},
      committeeactors_dynamica_id = "",
      userIdeng = "",
    } = this.state;
    return (
      <div className="table-report-container">
        <div
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
        </div>
        <div className="" style={{ zoom: "0.86" }}>
          <div className="">
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
          <div className="printContent mohand_font_not_bold">
            <header>
              <div className="first_section">
                {/* <h5 style={{ marginRight: "50px" }}>
                  وكالة التعمير والمشاريع{" "}
                </h5> */}
                <h5>الإدارة العامـة للتخطيط العمرانـي</h5>
                <h5 style={{ marginRight: "85px" }}>إدارة التخطيط</h5>
              </div>
              <div className="second_section">
                <h5>الموضوع : الموافقة المبدئية علي المخطط</h5>
                <h5 style={{ marginLeft: "63px" }}>
                  رقم ({convertToArabic(plan_no)}) بمدينة {city}
                </h5>
              </div>
            </header>

            <div className="third_part">
              {/* <h4 style={{ marginTop: "15px" }}>قرار</h4> */}
              <h4 style={{ marginBottom: "15px" }}>
                المـوافقة المبدئية علي الفكرة التخطيطية
              </h4>
              {/* <h5>إن أمين المنطقة الشرقية</h5> */}
              <div className="paragraphPrint takreerParagraph para_custom">
                <p>
                  {" "}
                  &nbsp;&nbsp;&nbsp;بناء علي الصلاحيات المخولة لأمين المنطقة
                  الشرقية بموجب القرار رقم ١ / ٤٤٠٠٤٨٥٩٢٧ وتاريخ ١٧ / ٧ / ١٤٤٤
                  هـ والقرار رقم ١ / ٤٣٠٠٠٠٠٠٥٧ وتاريخ ٥ / ٣ / ١٤٤٣ هـ ، وبناء
                  علي أحكام نظام البلديات والقري الصادر بالمرسوم الملكـي رقم م /
                  ٥ في ٢١ / ٢ / ١٣٩٧ هـ وبناء علي قرار مجلس الوزراء رقم ١٥٧ في
                  ١١ / ٥ / ١٤٢٨ هـ القاضي بالموافقة علي قواعد تحديد النطاق
                  العمراني لمدن المملكة .
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;وعلي ضوء محضر اللجنة الفنية رقم (
                  {convertToArabic(ma7dar_lagna_no)}) وتاريخ (
                  {convertToArabic(ma7dar_lagna_date)}) هـ ، المتضمن الموافقة
                  علي الفكرة التخطيطية المقترحة للمخطط رقم ({" "}
                  {convertToArabic(plan_no)} ) الخاص بتخطيط الأرض المملوكة
                  للمواطن / {owners_name} ، {convertToArabic(plan_name)} بمدينة{" "}
                  {city} كإستخدام {plan_using_type}{" "}
                  {convertToArabic(using_type)} .
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp;وحيث اتضح من دراسة الموضوع أن المخطط يقع ضمن
                  المرحلة التنموية حتي عام ١٤٤٠ هـ من النطاق العمراني لحاضرة
                  الدمام المعتمد بقرار مجلس الوزراء المشار إليه أعلاه ولا يتعارض
                  مع إستعمالات المخطط المعتمد للمدينة بالإضافة إلي ملائمته من
                  الناحية التخطيطية واستيفائه لكـافة المتطلبات والإجراءات
                  النظامية .
                </p>

                <h5 style={{ textAlign: "center" }}>يـقـرر مــا يلـي :</h5>
                <p>
                  {/* <span style={{ fontWeight: "bold" }}>أولا :</span> */}
                  &nbsp;أولا : الموافقة المبدئية علي الفكرة التخطيطية للمخطط رقم
                  ( {convertToArabic(plan_no)} ) بمدينة {city} ، ويلزم على
                  المالك تنفيذ إشتراطات المرحلة الواقعة بها المخطط وفقا لقرار
                  مجلس الوزراء المشار إليه أعلاه ولائحته التنفيذية الصادرة بقرار
                  سمو الوزير رقم ٦٦٠٠٠ وتاريخ ٢٠ / ١٢ / ١٤٣٥ هـ .
                </p>
                {/* {notes
                  .replaceAll("\n", "")
                  .split("-")
                  .filter((d) => d != " " || d != "")
                  .map((d, k) => {
                    return <p key={k}>{d}</p>;
                  })} */}
                <p>
                  {/* <span style={{ fontWeight: "bold" }}>ثانيا :</span> */}
                  &nbsp;ثانيا : يبلغ أصل هذه الموافقة وصورتين مصدقتين من المخطط
                  للإدارة العامة للتخطيط العمراني لإستكـمال الإجراءات النظامية
                  حيال اعتماده .
                </p>
                {/* <p>
                  <span style={{ fontWeight: "bold" }}>ثالثا :</span>
                  &nbsp;يبلغ صورة من هذا القرار وصورة من المخطط مع نسخة من كـامل
                  أوراق المعاملة إلي المجلس البلدي وفقا للقرار الوزاري رقم ٦٠٧٧٨
                  / ص ز وتاريخ ١٠ / ٩ / ١٤٢٨ هـ .
                </p> */}
              </div>
            </div>
            <div className="printFooter">
              {/* <h5>أمين المنطقة الشرقية</h5> */}
              <h5>{committeeactors5.position}</h5>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <h5 style={{ marginLeft: "80px" }}>المهندس /</h5>
                <h5 style={{ marginLeft: "50px", marginTop: "10px" }}>
                  {committeeactors5.is_approved && province_id && (
                    <SignPics
                      province_id={province_id}
                      userId={committeeactors_dynamica_id[0]}
                      planApproval={true}
                    />
                  )}
                </h5>
              </div>
              <h5>{committeeactors5.name}</h5>
              {/* <h5>فهد بن محمد الجبير</h5> */}
            </div>

            {printCheck != 0 && printCheck != false && (
              <div className="heads">
                <h6>
                  {morasalat
                    .replaceAll("\n", "")
                    .split("-")
                    .map((d, k) => {
                      return <div key={k}>{d}</div>;
                    })}
                </h6>

                {/* <h6>- صورة لمكتبنا .</h6>
                <h6>
                  - صورة للإدارة العامة للتخطيط العمراني للقيد رقم
                  ................. في ....... / ....... / .............. هـ .
                </h6>
                <h6>- صورة لإدارة نظم المعلومات الجغرافية .</h6>
                <h6>
                  - صورة لوحدة التدقيق والمتابعة لمخاطبة المجلس البلدي وتزويده
                  بنسخة من كامل الأوراق .
                </h6> 
                <h6>- صورة {eng_user_name}</h6>*/}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
