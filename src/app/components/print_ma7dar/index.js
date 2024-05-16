import React, { Component } from "react";
import Header from "./header";
import { get } from "lodash";
import { message } from "antd";
import axios from "axios";
import {
  workFlowUrl,
  backEndUrlforMap,
  filesHost,
} from "../../../imports/config";

import { localizeNumber } from "../../components/inputs/fields/identify/Component/common/common_func";

import Committee from "app/helpers/modules/imp_project/committee";
import { sortBy, filter } from "lodash";
import EditPrint from "app/components/editPrint";
import ZoomSlider from "app/components/editPrint/zoomEdit";

export default class Ma7dar extends Component {
  state = {
    mainObject: null,
    request_no: "",
    printObj: {},
    submission: null,
    ownerdesc: null,
    title1: "(موافقة مبدئية)",
    description1:
      "- إبرام عقد موثق مع إحدى الشركات المشغلة والمؤهلة من قبل الوزارة لإدارة وتشغيل وصيانة المحطة ومتابعة الطلب - تقديم الدراسات اللازمة وفكرة التصميم المعماري لهذه اللجنة لجنة الخدمات بالإدارة العامة للتخطيط العمراني وتتضمن ( منظور + الواجهات + مخطط الموقع العام + المخططات المعمارية )",
    description2:
      "- إن هذه الموافقة مبدئية وليست نهائية وتعتبر مهلة محددة بـ (٦) أشهر فقط من تاريخ المحضر ويلزم خلالها قيام صاحب العلاقة بإستكمال ما جاء بالفقرة أعلاه وإستخراج رخصة البناء حسب المتبع نظاميا خلال المدة المحددة .",
    description3:
      "- تسلم نسخة من هذا القرار لصاحب العلاقة للتقيد بما ورد أعلاه .",
  };

  removeMohndsDuplicate(name) {
    ["/", "المهندس", "مهندس"].forEach((replaceName) => {
      if (name) {
        name = name?.replaceAll(replaceName, "");
      }
    });
    return name;
  }

  componentDidMount() {
    // let self = this;

    axios
      .get(workFlowUrl + "/api/Submission/" + this.props.params.id)
      //.get("http://localhost:8080/www/submission?.json")
      .then(({ data }) => {
        let submission = data;
        axios
          .get(backEndUrlforMap + data.submission_file_path + "mainObject.json")
          //.get("http://localhost:8080/www/mainObject?.json")
          .then((data) => {
            data.data =
              (typeof data.data == "string" &&
                JSON.parse(window.lzString.decompressFromBase64(data.data))) ||
              data.data;
            //
            //submission?.committees = submission?.committees || {}
            //submission?.committees?.committee_actors = sortBy(filter(Committee.sections.members.fields, (d, key) => (get(data, `data.committee.members.${key}`, false))), 'index')

            /////////////////////////////////////////////

            submission.committee_report_no =
              submission?.committee_report_no?.split("/")[0] +
              " / " +
              submission?.committee_report_no?.split("/")[1];
            submission.committee_report_no =
              submission.committee_report_no.includes("undefined")
                ? null
                : submission.committee_report_no;
            submission.committee_date =
              submission?.committee_date?.split("/")[0] +
              " / " +
              submission?.committee_date?.split("/")[1] +
              " / " +
              submission?.committee_date?.split("/")[2];
            submission.committee_date = submission.committee_date.includes(
              "undefined"
            )
              ? null
              : submission.committee_date;

            var mainObject = data.data;

            submission.committees.committee_actors =
              mainObject?.committee?.members.main;
            var prepareCommitteeActors = [];
            submission?.committees?.committee_actors &&
              Object.keys(submission?.committees?.committee_actors).forEach(
                (key) => {
                  prepareCommitteeActors.push(
                    submission?.committees?.committee_actors[key]
                  );
                }
              );

            prepareCommitteeActors = prepareCommitteeActors?.filter((item) => {
              return item.active;
            });
            prepareCommitteeActors = prepareCommitteeActors?.sort((a, b) =>
              a.sign_order > b.sign_order
                ? 1
                : b.sign_order > a.sign_order
                ? -1
                : 0
            );

            submission.committees.committee_actors = prepareCommitteeActors;

            console.log(submission?.committees?.committee_actors);

            var owner =
              mainObject?.ownerData &&
              mainObject?.ownerData?.ownerData?.owners[
                Object.keys(mainObject?.ownerData?.ownerData?.owners)[0]
              ];
            var ownerdesc = "";
            var kind = "";
            if (owner) {
              if (owner.ssn) {
                ownerdesc = "المواطن / " + owner.name;
              } else if (owner.commercial_registeration) {
                ownerdesc = "الشركة / " + owner.name;
              } else if (owner.code_regesteration) {
                ownerdesc = "الجهة / " + owner.name;
              }

              if (owner.ssn) {
                kind = "المواطن "; //"/ " + owner.name;
              } else if (owner.commercial_registeration) {
                kind = "الشركة "; // + owner.name;
              } else if (owner.code_regesteration) {
                kind = "الجهة "; //+ owner.name;
              }
            }

            var parcelInfo = "";

            if (
              mainObject?.LandWithCoordinate?.landData?.lands?.parcels &&
              mainObject?.LandWithCoordinate?.landData?.lands?.parcels[0]
                .attributes.PLAN_NO
            ) {
              var parcelnumbers = "";

              if (
                mainObject?.LandWithCoordinate?.landData?.lands?.parcels
                  .length > 1
              ) {
                parcelnumbers =
                  "على قطع الأراضي أرقام ( " +
                  mainObject?.LandWithCoordinate?.landData?.lands?.parcels
                    .map((d) => {
                      return localizeNumber(d.attributes.PARCEL_PLAN_NO);
                    })
                    .join(" - ") +
                  " )";
              } else {
                parcelnumbers =
                  " على قطعة الأرض رقم ( " +
                  localizeNumber(
                    mainObject?.LandWithCoordinate?.landData?.lands?.parcels &&
                      mainObject?.LandWithCoordinate?.landData?.lands
                        ?.parcels[0].attributes.PARCEL_PLAN_NO
                  ) +
                  " )";
              }

              parcelInfo =
                parcelnumbers +
                " بالمخطط رقم ( " +
                localizeNumber(
                  mainObject?.LandWithCoordinate?.landData?.lands?.parcels &&
                    mainObject?.LandWithCoordinate?.landData?.lands?.parcels[0]
                      .attributes.PLAN_NO
                ) +
                " ) ";

              if (
                mainObject?.LandWithCoordinate?.landData?.lands?.parcels &&
                mainObject?.LandWithCoordinate?.landData?.lands?.parcels[0]
                  .attributes.DISTRICT_NAME
              ) {
                parcelInfo +=
                  " في حي " +
                    mainObject?.LandWithCoordinate?.landData?.lands?.parcels &&
                  mainObject?.LandWithCoordinate?.landData?.lands?.parcels[0]
                    .attributes.DISTRICT_NAME;
              }

              parcelInfo +=
                " بمدينة " +
                ((mainObject?.LandWithCoordinate?.landData?.lands?.parcels &&
                  mainObject?.LandWithCoordinate?.landData?.lands?.parcels[0]
                    .attributes.MUNICIPALITY_NAME) ||
                  "");
            } else {
              parcelInfo =
                " على ( " +
                (mainObject?.LandWithCoordinate?.landData?.lands?.parcels
                  .map((d) => {
                    return localizeNumber(d.attributes.PARCEL_PLAN_NO);
                  })
                  .join(" - ") || "") +
                " )";
              parcelInfo +=
                " بمدينة " +
                ((mainObject?.LandWithCoordinate?.landData?.lands?.parcels &&
                  mainObject?.LandWithCoordinate?.landData?.lands?.parcels[0]
                    .attributes.MUNICIPALITY_NAME) ||
                  "");
            }

            var parcelDesc =
              " وذلك لمناقشة طلب " +
              //ownerdesc +
              kind +
              " الموضح بياناته أدناه ";
            //" ترخيص " +
            //mainObject?.serviceSubmissionType?.submission?.utilitytype.name +
            //" " +
            //parcelInfo;

            this.setState({
              ownerdesc: ownerdesc,
              mainObject: mainObject,
              // printObj: printObj,
              id: this.props.params.id,
              submission: submission,
              parcelDesc: parcelDesc,
            });
          })
          .catch(() => {
            message.error("حدث خطأ");
          });
        axios
          .get(
            backEndUrlforMap + data.submission_file_path + "printObject.json"
          )
          .then(({ data }) => {
            let printObj = data?.newPrintObj;
            let title1 = data?.newPrintObj?.printTextEdited.ma7dar?.title1;
            let description1 =
              data?.newPrintObj?.printTextEdited?.ma7dar?.description1;
            let description2 =
              data?.newPrintObj?.printTextEdited?.ma7dar?.description2;
            let description3 =
              data?.newPrintObj?.printTextEdited?.ma7dar?.description3;
            this.setState({
              printObj: printObj,
              title1: title1 || this.state.title1,
              description1: description1 || this.state.description1,
              description2: description2 || this.state.description2,
              description3: description3 || this.state.description3,
            });
          });
      })
      .catch((data) => {
        console.log(data);
        message.error("حدث خطأ");
      });
  }

  convertToArabic = function (num) {
    if (num) {
      var id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];
      return num.replace(/[0-9]/g, function (w) {
        return id[+w];
      });
    } else {
      return "";
    }
  };

  render() {
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    const {
      submission,
      mainObject,
      parcelDesc,
      ownerdesc,
      id,
      printObj,
      title1,
      description1,
      description2,
      description3,
    } = this.state;
    // console.log("kj",get(mainObject,'mainObject?.serviceSubmissionType?.submission?.utilitysubtype.description',""))
    let utilitytype_id =
      mainObject && mainObject.serviceSubmissionType.submission?.utilitytype_id;
    console.log(this.state);
    return (
      <div className="grid " style={{ background: "#fff" }}>
        <Header />
        <div
          className="hidden2"
          style={{
            direction: "ltr",
            justifyContent: "flex-end",
            marginLeft: "2%",
            lineHeight: 1.7,
            color: "#000",
          }}
        >
          <button
            className="btn btn-warning"
            onClick={() => {
              window.print();
            }}
          >
            طباعه
          </button>
        </div>
        <ZoomSlider>
          <div
            style={{
              height: "75vh",

              margin: "160px 20px 30px 25px",
              textAlign: "justify",
              // marginRight: "20px",
              lineHeight: 1.5,
              color: "#000",
              // overflow: "visible"
            }}
            className="content-m7dar"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              <h4
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                محضر اجتماع لجنة الخدمات رقم{" "}
                {localizeNumber(submission?.committee_report_no ?? "")} هـ
                &nbsp;
                {/* (موافقة
              مبدئية) */}
              </h4>
              <EditPrint
                printObj={printObj && printObj}
                id={id}
                path="ma7dar.title1"
                oldText={title1}
              />
            </div>
            <br />
            <div>
              <p>
                أنه فى يوم {localizeNumber(submission?.committee_date)} هـ
                وبناءا على القرار الإداري رقم ۲۲٤ في ٤ / ٧ / ۱٤۲٦ هـ تم عقد
                إجتماع لجنة الخدمات بمقر الإدارة العامة للتخطيط العمراني بحضور
                كل من :-{" "}
              </p>
              {submission?.committees?.committee_actors
                .slice(0, submission?.committees?.committee_actors.length)
                .reverse()
                .map((actor) => {
                  return (
                    <div className="names">
                      <div>
                        <span>
                          المهندس / {this.removeMohndsDuplicate(actor?.name)}
                        </span>
                      </div>
                      <div className="job">
                        <span>{actor?.position_name}</span>
                      </div>
                    </div>
                  );
                })}
              <p style={{ marginTop: "10px" }}>{parcelDesc}</p>
              <table className="table table-bordered table-ma7dar">
                <tr>
                  <td>المالك </td>
                  <td>{ownerdesc}</td>
                  <td>النشاط</td>
                  <td>
                    <span>
                      <span>
                        {
                          mainObject?.serviceSubmissionType?.submission
                            ?.utilitytype.name
                        }
                      </span>
                      {mainObject?.serviceSubmissionType?.submission
                        ?.utilitytype.id == 3 && (
                        <span>
                          {" "}
                          -{" "}
                          {mainObject?.serviceSubmissionType?.submission
                            ?.utilitytype.default_utility_class ||
                            mainObject?.Conditions?.conditions
                              ?.utilitysubtype_id}{" "}
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>قطع الاراضي</td>
                  <td>
                    {mainObject?.LandWithCoordinate?.landData?.lands?.parcels
                      .map((d) => {
                        return localizeNumber(d.attributes.PARCEL_PLAN_NO);
                      })
                      .join(" - ")}
                  </td>
                  <td>المساحة (م٢)</td>
                  <td>
                    {localizeNumber(
                      (+mainObject?.LandWithCoordinate?.landData?.lands?.parcels
                        .map((d) => d.attributes.PARCEL_AREA)
                        .reduce((prev, next) => +prev + +next)).toFixed(2)
                    )}
                  </td>
                </tr>
                <tr>
                  <td>المدينه</td>
                  <td>
                    {mainObject?.LandWithCoordinate?.landData?.lands?.parcels &&
                      mainObject?.LandWithCoordinate?.landData?.lands
                        ?.parcels[0].attributes.MUNICIPALITY_NAME}
                  </td>
                  <td>المخطط</td>
                  <td>
                    {localizeNumber(
                      mainObject?.LandWithCoordinate?.landData?.lands
                        ?.parcels &&
                        mainObject?.LandWithCoordinate?.landData?.lands
                          ?.parcels[0].attributes.PLAN_NO
                    )}
                  </td>
                </tr>
                {mainObject?.serviceSubmissionType?.submission?.utilitytype
                  .id == 3 && (
                  <tr>
                    <td>بعد أقرب محطة في نفس الإتجاه</td>
                    <td>
                      {localizeNumber(
                        mainObject?.Conditions?.conditions?.utility_same_distance?.inputValue?.toString() ||
                          "لايوجد"
                      )}{" "}
                      {(mainObject?.Conditions?.conditions
                        ?.utility_same_distance?.inputValue &&
                        mainObject?.Conditions?.conditions
                          ?.utility_same_distance?.extValue) ||
                        ""}
                    </td>
                    <td>بعد أقرب محطة في الإتجاه المقابل</td>
                    <td>
                      {localizeNumber(
                        mainObject?.Conditions?.conditions?.utility_opposite_distance?.inputValue?.toString() ||
                          "لايوجد"
                      )}{" "}
                      {(mainObject?.Conditions?.conditions
                        ?.utility_opposite_distance?.inputValue &&
                        mainObject?.Conditions?.conditions
                          ?.utility_opposite_distance?.extValue) ||
                        ""}
                    </td>
                  </tr>
                )}
              </table>
              <p>
                {mainObject?.printSetting &&
                  mainObject?.printSetting?.print.main}
              </p>
              <ZoomSlider>
                <div className="conditions">
                  <h4 style={{ lineHeight: "1.5" }}>
                    عليه و بدراسة الموضوع وفق ما جاء بالتعميم رقم ٤١٠٠١٣٠٦٨٢
                    بتاريخ ١١ / ٤ / ١٤٤٠ هـ والخاصة{" "}
                    {utilitytype_id == "4" ? (
                      <span>
                        باشتراطات قاعات المناسبات (قصور افراح - استراحات){" "}
                      </span>
                    ) : (
                      <span>بلائحة مراكز الخدمة</span>
                    )}{" "}
                    اتضح ملائمة : الموقع للنشاط المطلوب لذا وجه المجتمعون
                    بالموافقة شريطة مراعاة التالى
                  </h4>
                  <h4 style={{ lineHeight: "1.5" }}>
                    {/* - تقديم الدراسات اللازمة وفكرة التصميم المعماري لهذه اللجنة لجنة
                الخدمات بالإدارة العامة للتخطيط العمراني وتتضمن ( منظور +
                الواجهات + مخطط الموقع العام + المخططات المعمارية ) */}
                    <EditPrint
                      printObj={printObj && printObj}
                      id={id}
                      path="ma7dar.description1"
                      oldText={description1 && description1}
                    />
                    {utilitytype_id == "4" && <span> مع مراعاة الاتى </span>}
                  </h4>
                  {utilitytype_id == "4" && (
                    <div>
                      <p>
                        - مراعاة توفير موقف /٢٥ م٢ من إجمالي مساحة البناء (قصور
                        أفراح)
                      </p>
                      <p>
                        - مراعاة توفير موقف /٥٠ م٢ من إجمالي مساحة البناء
                        (الاستراحات)
                      </p>

                      <p>
                        - عمل أسوار مصمته على حدود مواقع مباني قاعات المناسبات
                        جهة جوار الملاصق السكني
                      </p>
                    </div>
                  )}

                  <h4 style={{ lineHeight: "1.5" }}>
                    {/* - إن هذه الموافقة مبدئية وليست نهائية وتعتبر مهلة محددة بستة
                أشهر فقط من تاريخ المحضر ويلزم خلالها قيام صاحب العلاقة بإستكمال
                ما جاء بالفقرة أعلاه وإستخراج رخصة البناء حسب المتبع نظاميا خلال
                المدة المحددة . */}
                    <EditPrint
                      printObj={printObj && printObj}
                      id={id}
                      path="ma7dar.description2"
                      oldText={description2 && description2}
                    />
                  </h4>
                  <h4>
                    {/* - تسلم نسخة من هذا القرار لصاحب العلاقة للتقيد بما ورد أعلاه . */}
                    <EditPrint
                      printObj={printObj && printObj}
                      id={id}
                      path="ma7dar.description3"
                      oldText={description3 && description3}
                    />
                  </h4>
                  {/* <br /> */}
                </div>
              </ZoomSlider>
              <h5 style={{ textAlign: "center" }}>
                {" "}
                و عليه جري التوقيع والله الموفق ...
              </h5>

              <div className="engs">
                {submission?.committees?.committee_actors
                  .filter(
                    (actor, index) =>
                      index !=
                      submission?.committees?.committee_actors.length - 1
                  )
                  .map((actor, k) => {
                    return (
                      <div
                        key={k}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "2.2fr 1fr",
                          marginBottom: "15px",
                        }}
                      >
                        {submission?.committee_report_no &&
                          province_id !== null && (
                            <div>
                              <div>
                                المهندس /{" "}
                                {this.removeMohndsDuplicate(actor?.name)}
                              </div>
                              <img
                                src={`${filesHost}/users/${actor?.id}/sign.png`}
                                width="150px"
                              />
                            </div>
                          )}
                      </div>
                    );
                  })}
              </div>
              <h5
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  // fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                يعتمد ،،،،،
              </h5>
              <div
                style={{
                  margin: " 20px 50px",
                  direction: "ltr",
                  display: "grid",
                  gridGap: "5px",
                }}
              >
                <h5 style={{ fontSize: "20px", marginLeft: "80px" }}>
                  {
                    submission?.committees?.committee_actors
                      .slice(0, submission?.committees?.committee_actors.length)
                      .reverse()?.[0]?.position_name
                  }
                </h5>
                <h5
                  style={{
                    marginLeft: "130px",
                    // fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {submission?.committee_report_no &&
                        province_id !== null && (
                          <div>
                            <img
                              src={`${filesHost}/users/${
                                submission?.committees?.committee_actors
                                  .slice(
                                    0,
                                    submission?.committees?.committee_actors
                                      .length
                                  )
                                  .reverse()[0]?.id
                              }/sign.png`}
                              width="150px"
                              style={{ marginRight: "50px" }}
                            />
                          </div>
                        )}{" "}
                    </span>
                    {submission?.committee_report_no &&
                      province_id !== null && <span>/ المهندس</span>}
                  </div>
                </h5>

                <h5 style={{ fontSize: "20px", marginLeft: "80px" }}>
                  {this.removeMohndsDuplicate(
                    submission?.committees?.committee_actors
                      .slice(0, submission?.committees?.committee_actors.length)
                      .reverse()[0]?.name
                  )}
                </h5>
              </div>

              {/* <h5 style={{ textAlign: "center", marginTop: "10px" }}>يعتمد ...</h5>
            <div className="signtautre" style={{ marginLeft: "25px" }}>
              <div>
                <div style={{ textAlign:'center' }}>
                  وكيل الأمين المساعد للتعمير و المشاريع
                  <p
                    style={{ textAlign: "center", fontSize: "10px !important" }}
                  >
                    المشرف العام على الإدارة العامة للتخطيط العمرانى
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  {
                    submission?.committees?.committee_actors[
                      submission?.committees?.committee_actors.length - 2
                    ].name
                  }
                </div>
              </div>
              <div>
                <div style={{ marginLeft: "10px" ,alignSelf:'flex-start'}}>
                  وكيل الأمين للتعمير و المشاريع
                </div>
                <div style={{ textAlign: "center" }}>
                  {
                    submission?.committees?.committee_actors[
                      submission?.committees?.committee_actors.length - 1
                    ].name
                  }
                </div>
              </div>
              </div> */}
            </div>
          </div>
        </ZoomSlider>
      </div>
    );
  }
}
