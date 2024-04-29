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
} from "../../../../inputs/fields/identify/Component/common/common_func";
import { followUp } from "../../../../../../apps/modules/tabs/tableActionFunctions/tableActions";
import { initializeSubmissionData } from "main_helpers/functions/prints";
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
        // let notes = get(mainObject, "takreers.notes", "");

        // let notes1 = get(mainObject, "takreers.notes1", "");
        // let morasalat = get(mainObject, "takreers.text1", "");
        let bda2l_names = get(
          mainObject,
          "bda2l.bands_approval.band_number.owner_selectedValues",
          get(mainObject, "bda2l.bands_approval.band_number.selectedValues", [])
        );

        // let ma7dar_lagna_no = get(
        //   mainObject,
        //   "lagna_karar.lagna_karar.ma7dar_lagna_no",
        //   submission.request_no
        // );
        // let ma7dar_lagna_date = get(
        //   mainObject,
        //   "lagna_karar.lagna_karar.ma7dar_lagna_date",
        //   aminStep?.date?.split("/")?.reverse()?.join("/")
        // )
        //   ?.split("/")
        //   ?.reverse()
        //   ?.join("/");

        let ma7dar_primary_no = submission.request_no;
        let ma7dar_supervision_no = submission.request_no;
        let ma7dar_lagna_no = get(
          mainObject,
          "lagna_karar.lagna_karar.ma7dar_lagna_no",
          submission.request_no
        );
        let ma7dar_primary_date = aminStep?.date; //?.split('/')?.reverse()?.join('/')
        let ma7dar_supervision_date = aminStep?.date; //?.split('/')?.reverse()?.join('/')
        let ma7dar_lagna_date = get(
          mainObject,
          "lagna_karar.lagna_karar.ma7dar_lagna_date",
          aminStep?.date?.split("/")?.reverse()?.join("/")
        )
          ?.split("/")
          ?.reverse()
          ?.join("/");

        let urban = get(mainObject, "bda2l.bands_approval.urban", 0);

        let mun_classes = get(
          mainObject,
          "data_msa7y.msa7yData.cadDetails.mun.mun_classes.mun_class",
          ""
        );
        this.setState({
          ma7dar_primary_no,
          ma7dar_primary_date,
          ma7dar_lagna_no,
          ma7dar_lagna_date,
          ma7dar_supervision_no,
          ma7dar_supervision_date,
          ceator_user_name,
          owners_name,
          plan_no,
          plan_name,
          city,
          eng_user_name,
          printCheck,
          // notes,
          // notes1,
          // morasalat,
          committeeactors3,
          committeeactors_dynamica_id,
          userIdeng,
          bda2l_names,
          urban,
          mun_classes,
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
      ma7dar_primary_no,
      ma7dar_primary_date,
      ma7dar_lagna_no,
      ma7dar_lagna_date,
      ma7dar_supervision_no,
      ma7dar_supervision_date,
      ceator_user_name = "",
      owners_name = "",
      plan_no = "",
      plan_name = "",
      city = "",
      eng_user_name = "",
      printCheck = false,
      // notes = "",
      // notes1 = "",
      //morasalat = "",
      committeeactors3 = {},
      committeeactors_dynamica_id = "",
      userIdeng = "",
      bda2l_names = [],
      urban,
      mun_classes,
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
            <span>{convertToArabic(ma7dar_supervision_no)}</span>
          </p>
          <p style={{ marginTop: "14px" }}>
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(ma7dar_supervision_date?.split("/")[0] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(ma7dar_supervision_date?.split("/")[1] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "5px" }}>
              {convertToArabic(
                ma7dar_supervision_date
                  ?.split("/")[2]
                  ?.substring(
                    2,
                    ma7dar_supervision_date?.split("/")[2]?.length
                  ) || ""
              )}
            </span>
            {"    "}
          </p>
        </div>
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

            <section className="second_part" style={{ zoom: "0.8" }}>
              <div className="secondHeader">
                <h2 style={{ fontSize: "22px" }}>
                  سعادة / مدير عام إدارة الإشراف
                  <span className="secondHeaderspan">المحترم</span>
                </h2>
                <div className="paragraphPrint para_custom">
                  {" "}
                  <h5>السلام عليكـم ورحمة الله وبركـاته ,,,</h5>
                  <p>
                    &nbsp;&nbsp;&nbsp;إشارة للقرار الصادر من معالي الأمين برقم (
                    {convertToArabic(ma7dar_primary_no)}) في (
                    {convertToArabic(ma7dar_primary_date)}) هـ المتضمن الموافقة
                    علي اعتماد المخطط رقم ( {convertToArabic(plan_no)} ) الخاص
                    بتخطيط الأرض المملوكة للمواطن / {owners_name} ،{" "}
                    {convertToArabic(plan_name)} بمدينة {city}
                  </p>
                </div>
                <div className="finalParagraph para_custom">
                  <p>
                    &nbsp;&nbsp;&nbsp; وحيث أن الأرض تقع ضمن حدود المرحلة حتى
                    عام {convertToArabic(urban)}هـ من النطاق العمراني المحدث
                    المعتمد بموجب القرار الوزاري رقم ٦٦٠٠٠ في ٢٠ / ١٢ / ١٤٣٥ هـ،
                    وضمن منطقة مصنفة {mun_classes} حسب الالإستراتيجية العمرانية
                    الوطنية للمملكة، وقد التزم المالك بتنفيذ الخدمات التالية :
                  </p>
                  <ul className="para_custom dashed">
                    {(!Array.isArray(bda2l_names) &&
                      bda2l_names.values.map((d, k) => {
                        return <li key={k}>{d.condition.item_description}</li>;
                      })) ||
                      (Array.isArray(bda2l_names) &&
                        bda2l_names
                          .reduce((a, b) => {
                            a = a.concat(b.values);
                            return a;
                          }, [])
                          .map((d, k) => {
                            return (
                              <li key={k}>{d.condition.item_description}</li>
                            );
                          }))}
                  </ul>
                </div>
              </div>
            </section>
            <div className="paragraphPrint para_custom">
              <p>
                &nbsp;&nbsp;&nbsp;فعليه نرفق لكم بطيه عدد أربع نسخ من المخطط
                الإبتدائي المذكور ونسخة منه على قرص مدمج (CD)، للإطلاع والتنسيق
                من قبلكم مع الجهات المختصة لإنفاذ ذلك وموافاتنا فيما بعد بخطابات
                من الجهات ذات العلاقة تتضمن إنجاز الأعمال المطلوبة حتي يتسني لنا
                على ضوء ما يرد منكم من إكمال اللازم حسب النظام
              </p>
            </div>
            <div style={{ textAlign: "center" }} className="printBye">
              <h5>والسلام عليكـم ورحمة الله وبركـاته ،،،</h5>
            </div>
            <div className="printFooter">
              {/* <h5 style={{ marginBottom: "60px", marginLeft: "27px" }}>
                  مدير عام التخطيط العمراني
                </h5>
                <h5>المهندس / فواز بن فهد العتيبي</h5>{" "} */}
              <h4>{committeeactors3.position}</h4>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <h4 style={{ marginLeft: "80px" }}>المهندس /</h4>
                <h4 style={{ marginLeft: "50px", marginTop: "10px" }}>
                  {committeeactors3.is_approved && province_id && (
                    <SignPics
                      province_id={province_id}
                      userId={committeeactors_dynamica_id[2]}
                      planApproval={true}
                    />
                  )}
                </h4>
              </div>
              <p>{committeeactors3.name}</p>{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
