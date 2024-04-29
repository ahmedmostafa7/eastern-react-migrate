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
import { initializeSubmissionData } from "main_helpers/functions/prints";
import { Row, Col } from "antd";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import SignPics from "../../../../editPrint/signPics";

export default class Lagna extends Component {
  state = { data: [] };
  componentDidMount() {
    console.log("match_id", this.props.match.params.id);
    initializeSubmissionData(this.props.match.params.id).then((response) => {
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
      let plan_no = get(mainObject, "lagna_karar.lagna_karar.plan_number", "");
      let plan_name = get(mainObject, "lagna_karar.lagna_karar.plan_name", "");
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
      let notes = get(mainObject, "takreers.notes", "");
      let notes1 = get(mainObject, "takreers.notes1", "");
      let morasalat = get(mainObject, "takreers.text1", "");

      this.setState({
        ceator_user_name,
        owners_name,
        plan_no,
        plan_name,
        city,
        eng_user_name,
        printCheck,
        notes,
        notes1,
        morasalat,
        committeeactors1,
        committeeactors5,
        committeeactors_dynamica_id,
        userIdeng,
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
      ceator_user_name = "",
      owners_name = "",
      plan_no = "",
      plan_name = "",
      city = "",
      eng_user_name = "",
      printCheck = false,
      notes = "",
      notes1 = "",
      morasalat = "",
      committeeactors1 = {},
      committeeactors5 = {},
      committeeactors_dynamica_id = "",
      userIdeng = "",
    } = this.state;
    return (
      <div className="table-report-container">
        <div className="">
          {/* <div style= {{display: "grid", justifyContent: "flex-end"}}> */}
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
                <h5 className="headerpadding"> إدارة التخطيـط</h5>
              </div>
              <div className="second_section">
                <h5>الموضوع : الموافقة المبدئية علي اعتماد المخطط </h5>
                <h5 className="headerpadding">
                  رقم ({convertToArabic(plan_no)}) بـ{city}
                </h5>
              </div>
            </header>

            <section className="second_part">
              <div className="secondHeader">
                <h2 style={{ fontSize: "22px" }}>
                  سعادة / رئيس المجلس البلدي بأمانة المنطقة الشرقية
                  <span className="secondHeaderspan">المحترم</span>
                </h2>
                <div className="paragraphPrint para_custom">
                  {" "}
                  <h5>السلام عليكـم ورحمة الله وبركـاته ,,,</h5>
                  <p>
                    &nbsp;&nbsp;&nbsp;أسأل الله لكـم السداد والتوفيق ... وبعـد
                    ،، بناء علي القرار الوزاري رقم ٦٠٧٧٨ / ص ز بتاريخ ١٠ / ٩ /
                    ١٤٢٨ هـ الخاص بالموافقة علي لائحـة إجراءات تخطيط الأراضي في
                    الفقرة الخامسة من البند الأول من القرار بما نصـه
                    <span className="spanAccept">
                      &nbsp;( بموجب قرار الموافقة الإبتدائية على اعتماد المخطط
                      يقوم الأمين أو رئيس البلدية أو رئيس المجمع القروي بإحالة
                      نسخة من المخطط مع كـامل مرفقات المعاملة الخاصة به إلي
                      المجلس البلدي للقيام بالمراجعة اللاحقة إعمالا لدور المجلس
                      الرقابي ) .
                    </span>
                  </p>
                </div>
                <div className="finalParagraph para_custom">
                  <p>
                    &nbsp;&nbsp;&nbsp;عليه نرفق لكـم نسخة من قرار الاعتماد
                    للمخطط رقم ({convertToArabic(plan_no)}) الخاص بتخطيط الأرض
                    المملوكة للمواطن / {owners_name} ،{" "}
                    {convertToArabic(plan_name)} بمدينة&nbsp;
                    {city} .
                  </p>
                </div>
                <h5 className="attachHeader">مـرفقا بها الآتي :- </h5>
                <ul className="para_custom">
                  {notes
                    .replaceAll("\n", "")
                    .split("-")
                    .filter((d) => d != " ")
                    .map((d, k) => {
                      return <li key={k}>{d}</li>;
                    })}
                  {/* <li>طلب التخطيط مقدم من المالك مرفقا به صورة صك الملكية .</li>
                  <li>
                    خطاب من الجهة التي صدر منها الصك ( كتابة العدل ) يفيد بسلامة
                    وسريان مفعول صك الملكية وأساساته التي بني عليها وإنها
                    مستكملة للإجراءات الشرعية والنظامية وأن استخراجها تم وفقا
                    للأنظمة والتعليمات .
                  </li>
                  <li>
                    نسخة من الرفع المساحي للموقع معدا من قبل مكتب هندسي موضحا
                    عليه الإحداثيات لكل أركان وزوايا الموقع وحدود الملكية حسب
                    الصك ومطابقتها للطبيعة ، ومصدقا عليه من الجهة المختصة
                    بالأمانة .{" "}
                  </li>
                  <li>
                    موافقة الجهة المختصة على تقرير دراسة فحص التربة للموقع .
                  </li>
                  <li>
                    موافقة وزارة الطاقة والصناعة والثروة المعدنية علي تخطيط
                    الأرض .
                  </li> */}
                </ul>
              </div>
            </section>
            <div className="pagebreak"></div>
            <div className="seperatePagePrint">
              {" "}
              {/* <header>
                <div className="first_section">
                  <h5>الإدارة العامـة للتخطيط العمراني</h5>
                  <h5 className="headerpadding"> إدارة التخطيـط</h5>
                </div>
              </header> */}
              <section className="second_part">
                <div className="secondHeader">
                  {" "}
                  <ul className="para_custom">
                    <li>
                      نسخة من مخطط تقسيم الموقع موضحا عليه :-
                      <ul>
                        {notes1
                          .replaceAll("\n", "")
                          .split("-")
                          .filter((d) => d != " ")
                          .map((d, k) => {
                            return <li key={k}>{d}</li>;
                          })}
                        {/* <li>
                          خطوط التنظيم ، والمرحلة التي يقع بها بالنسبة للنطاق
                          العمراني ، واشتراطات المرحلة ، والاستعمالات ، وأنظمة
                          البناء .
                        </li>
                        <li>البيانات الإحصائية للمخطط .</li>
                        <li>
                          موافقة خطية من المالك على المخطط وإقرار بالتنازل عن
                          التعويض في حالة الزيادة علي النسبة النظامية حسب
                          التعميم الوزاري رقم ٥٤١٩١ وتاريخ ١٩ / ١١ / ١٤٢١ هـ .
                        </li> */}
                      </ul>
                    </li>
                  </ul>
                </div>
              </section>
              <div style={{ textAlign: "center" }} className="printBye">
                <h5>والسلام عليكـم ورحمة الله وبركـاته ،،،</h5>
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
                        userId={committeeactors_dynamica_id[4]}
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
                  <h6>- صورة للبلدية .</h6>
                  <h6>- صورة {eng_user_name}</h6> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
