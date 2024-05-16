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
  getFeatureDomainName,
  getInfo,
  intersectQueryTask,
  selectActors,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { followUp } from "../../../../../../apps/modules/tabs/tableActionFunctions/tableActions";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import { Row, Col } from "antd";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import SignPics from "../../../../editPrint/signPics";

export default class adle_report_letter extends Component {
  state = { data: [] };
  componentDidMount() {
    console.log("match_id", this.props.params.id);
    initializeSubmissionData(this.props.params.id).then((response) => {
      this.getDistrict(
        response.mainObject?.data_msa7y?.msa7yData?.cadDetails
          ?.suggestionsParcels[0]?.polygon
      );
      followUp({ ...this.props.params }, 0, {}, null, false, this.props).then(
        (res) => {
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
          let city = get(
            mainObject,
            "landData.landData.municipality.CITY_NAME_A",
            ""
          );
          let parcel_no = get(
            mainObject,
            "landData.landData.lands.parcels[0].attributes.PARCEL_PLAN_NO",
            ""
          );
          // let sak = get(mainObject, "waseka.waseka.table_waseka", "");

          let sak_no = get(
            mainObject,
            "waseka.waseka.table_waseka.0.number_waseka",
            ""
          );
          let sak_date = get(
            mainObject,
            "waseka.waseka.table_waseka.0.date_waseka",
            ""
          );
          let sak_issuer = get(
            mainObject,
            "waseka.waseka.table_waseka.0.waseka_search",
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
            city,
            parcel_no,
            sak_no,
            sak_date,
            sak_issuer,
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
          });
        }
      );
    });
  }

  getDistrict = (polygon) => {
    getInfo(mapUrl).then((response) => {
      intersectQueryTask({
        outFields: ["DISTRICT_NAME"],
        geometry: new esri.geometry.Polygon(polygon),
        url: mapUrl + "/" + response["District_Boundary"],
        callbackResult: (res) => {
          getFeatureDomainName(
            res.features,
            response["District_Boundary"]
          ).then((features) => {
            this.setState({
              district: features
                .map((x) => x.attributes.DISTRICT_NAME)
                .join(" - "),
            });
          });
        },
      });
    });
  };

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
      parcel_no = "",
      sak_no = "",
      sak_date = "",
      sak_issuer = "",
      eng_user_name = "",
      printCheck = false,
      morasalat = "",
      committeeactors5 = {},
      committeeactors_dynamica_id = "",
      userIdeng = "",
      ma7dar_tawze3_no,
      ma7dar_tawze3_date,
      district,
      ma7dar_primary_no,
      ma7dar_primary_date,
      approvalDate,
      approval_no,
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
                <h5 className="headerpadding" style={{ marginRight: "50px" }}>
                  {" "}
                  إدارة المساحة
                </h5>
              </div>
            </header>

            <section className="second_part">
              <div className="secondHeader">
                {" "}
                <h2 style={{ fontSize: "22px" }}>
                  فضيلة / رئيس {sak_issuer}
                  <span className="secondHeaderspan">حفظه الله</span>
                </h2>
              </div>
              <div className="paragraphPrint para_custom">
                <h5>السلام عليكـم ورحمة الله وبركـاته ,,,</h5>
                <p>
                  &nbsp;&nbsp;&nbsp; أسال الله لكم السداد والتوفيق .. وبعد ،
                  بطيه صورة الصك رقم ( {convertToArabic(sak_no)} ) بتاريخ ({" "}
                  {convertToArabic(sak_date)} ) هـ للأرض ({" "}
                  {convertToArabic(parcel_no)} ) والواقعة في حي ({district})
                  بمدينة ( {city} ) والمملوكة لـ / {owners_name} والتي تم
                  تخطيطها بموجب المخطط المعتمد رقم ( {convertToArabic(plan_no)}{" "}
                  ) والذي تم اعتماده من قبلنا بموجب قرار الاعتماد النهائي رقم (
                  {convertToArabic(approval_no)}) وتاريخ (
                  {convertToArabic(approvalDate)}) هـ .
                </p>
                <p>
                  &nbsp;&nbsp;&nbsp; عليه تجدون برفقه نسخة من المخطط المعتمد رقم
                  ( {convertToArabic(plan_no)} ) بعد أن تم تبتير الأراضي على
                  الطبيعة وحساب الأبعاد والمساحات وعمل الجداول اللازمة .
                </p>
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
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
