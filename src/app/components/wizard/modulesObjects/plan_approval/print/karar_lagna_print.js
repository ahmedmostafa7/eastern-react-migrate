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
  reformatWasekaData,
  selectActors,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { followUp } from "../../../../../../apps/modules/tabs/tableActionFunctions/tableActions";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import { Row, Col } from "antd";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import SignPics from "../../../../editPrint/signPics";

export default class Lagna extends Component {
  state = { data: [] };
  componentDidMount() {
    console.log("match_id", this.props.params.id);
    initializeSubmissionData(this.props.params.id).then((response) => {
      followUp({ ...this.props.params }, 0, {}, null, false, this.props).then(
        (res) => {
          // let aminStep =
          //   res?.prevSteps?.[
          //     res?.prevSteps?.findLastIndex(
          //       (step) => step?.name?.indexOf("أمين المنطقة الشرقية") != -1
          //     )
          //   ];

          let lagnaFanehIndex = res?.prevSteps?.findLastIndex(
            (step) => [2768, 3105].indexOf(step.prevStep.id) != -1
          );

          let aminStep = null;
          if (lagnaFanehIndex - 1 > -1) {
            aminStep = res?.prevSteps?.[lagnaFanehIndex - 1];
          }

          var mainObject = response.mainObject;
          let ceator_user_name = response.ceator_user_name;
          let submissionData = response.submission;
          this.state["historydata"] = response.historyData;

          let actors = selectActors(
            submissionData,
            mainObject,
            [4, 3, 2, 1, 0]
          );
          //
          let committeeactors1 = actors?.find((r) => r.index == 0);
          let committeeactors2 = actors?.find((r) => r.index == 1);
          let committeeactors3 = actors?.find((r) => r.index == 2);
          let committeeactors4 = actors?.find((r) => r.index == 3);
          let committeeactors5 = actors?.find((r) => r.index == 4);
          //
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
          let ma7dar_lagna_no = get(
            mainObject,
            "lagna_karar.lagna_karar.ma7dar_lagna_no",
            submissionData?.request_no
          );

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
          let saks = get(mainObject, "waseka.waseka.table_waseka", "");
          let plan_using_type = get(
            mainObject,
            "submission_data.mostafed_data.mo5tat_use",
            ""
          );
          let parcel_count =
            get(mainObject, "parcelsCount", 0) ||
            mainObject?.plans?.plansData.planDetails.detailsParcelTypes
              .filter(
                (r) =>
                  r.key == "سكنى" ||
                  r.key == "استثماري" ||
                  r.key == "صناعى" ||
                  r.key == "زراعي" ||
                  r.key == "تجارى" ||
                  (plan_using_type == "حكومي" && r.key == "خدمات حكومية")
              )
              ?.reduce((a, b) => {
                return a + b?.value?.[0]?.value?.length;
              }, 0) ||
            mainObject?.plans?.plansData.planDetails.detailsParcelTypes?.reduce(
              (a, b) => {
                return (
                  a +
                  b?.value?.[0]?.value?.filter(
                    (r) =>
                      r.typeName == "سكنى" ||
                      r.typeName == "استثماري" ||
                      r.typeName == "صناعى" ||
                      r.typeName == "زراعي" ||
                      r.typeName == "تجارى" ||
                      (plan_using_type == "حكومي" &&
                        r.typeName == "خدمات حكومية")
                  )?.length
                );
              },
              0
            );

          let urban_range = get(
            mainObject,
            "landData.landData.municipality.mun_classes.mun_class",
            ""
          );
          let cut_area_percentage = get(mainObject, "cutAreaPercentage", "");
          let parcel_area = get(
            mainObject,
            "landData.landData.lands.parcels.0.attributes.PARCEL_AREA",
            ""
          );
          let services_percentage = get(mainObject, "servicesPercentage", "");

          let remarks = get(
            mainObject,
            "lagna_notes.lagna_remarks.remarks",
            ""
          );

          let ownersnames = get(mainObject, "ownerData.ownersname", "");

          let isSignAmin = remarks.find((remark) => {
            return remark.isSignAmin == true || remark.isSignAmin == 1;
          })?.checked;

          let eng_user_name =
            (mainObject.engUserNameToPrint &&
              mainObject.engUserNameToPrint.engUserName) ||
            (this.state["historydata"]?.data?.results?.length &&
              this.state["historydata"]?.data?.results?.[
                this.state["historydata"]?.data?.results?.length - 1
              ]?.users?.name) ||
            "";

          eng_user_name =
            (eng_user_name.indexOf("المهندس /") != -1 &&
              eng_user_name.replaceAll("المهندس /", "")) ||
            eng_user_name ||
            "";

          let committeeactors_dynamica_id = actors?.reduce(
            (b, a) => b && b?.concat(a?.id),
            []
          );

          let userIdeng =
            mainObject?.engUserNameToPrint?.engUser?.id ||
            (this.state["historydata"]?.data?.results?.length &&
              this.state["historydata"]?.data?.results?.[
                this.state["historydata"]?.data?.results?.length - 1
              ]?.users?.id);

          this.setState({
            mainObject,
            committeeactors_dynamica_id,
            userIdeng,
            ceator_user_name,
            committeeactors1,
            committeeactors2,
            committeeactors3,
            committeeactors4,
            committeeactors5,
            owners_name,
            plan_no,
            plan_name,
            city,
            sak_no,
            sak_date,
            sak_issuer,
            parcel_count,
            plan_using_type,
            urban_range,
            cut_area_percentage,
            parcel_area,
            services_percentage,
            remarks,
            isSignAmin,
            saks,
            ownersnames,
            eng_user_name,
            ma7dar_lagna_date,
            ma7dar_lagna_no,
          });
        }
      );
    });
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
      mainObject,
      ceator_user_name = "",
      committeeactors1 = {},
      committeeactors2 = {},
      committeeactors3 = {},
      committeeactors4 = {},
      committeeactors5 = {},
      committeeactors_dynamica_id = "",
      userIdeng = "",
      owners_name = "",
      plan_no = "",
      plan_name = "",
      city = "",
      sak_no = "",
      sak_date = "",
      sak_issuer = "",
      parcel_count = "",
      plan_using_type = "",
      urban_range = "",
      cut_area_percentage = "",
      parcel_area = "",
      services_percentage = "",
      remarks = [],
      saks = [],
      isSignAmin = false,
      ownersnames = "",
      eng_user_name = "",
      ma7dar_lagna_date,
      ma7dar_lagna_no,
    } = this.state;
    return (
      <div className="table-report-container lagna_karar">
        <div
          style={{
            textAlign: "left",
            position: "absolute",
            left: "0vh",
            top: "1vh",
          }}
        >
          <p style={{ marginLeft: "50px" }}>
            <span>{convertToArabic(ma7dar_lagna_no)}</span>
          </p>
          <p style={{ marginTop: "14px" }}>
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(ma7dar_lagna_date?.split("/")[0] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "50px" }}>
              {convertToArabic(ma7dar_lagna_date?.split("/")[1] || "")}
            </span>
            {"    "}
            <span style={{ marginLeft: "5px" }}>
              {convertToArabic(
                ma7dar_lagna_date
                  ?.split("/")[2]
                  ?.substring(2, ma7dar_lagna_date?.split("/")[2]?.length) || ""
              )}
            </span>
            {"    "}
          </p>
        </div>
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
        <div
          style={{
            zoom: 0.94,
            display: "grid",
            gridTemplateRows: "auto auto auto 5vh",
          }}
          className="table-pr"
          ref={(el) => (this.componentRef = el)}
        >
          <div className="" style={{ marginTop: "200px", zoom: "0.77" }}>
            <div className="firstPart">
              <h5 style={{ textAlign: "center" }}>
                محضر إعتماد إبتدائي للفكرة التخطيطية
              </h5>
            </div>
            <div className="third_part" style={{ textAlign: "right" }}>
              <Row>
                <Col span={12}>
                  <b>رقم المخطط</b> : <span>{convertToArabic(plan_no)}</span>
                </Col>{" "}
                <Col span={12}>
                  <b>اسم المالك</b> : <span>{owners_name}</span>
                </Col>
                <Col span={12}>
                  <b>المدينة</b> : <span>{city}</span>
                </Col>{" "}
                <Col span={12}>
                  <b>اسم المخطط</b> : <span>{convertToArabic(plan_name)}</span>
                </Col>
              </Row>
              {saks &&
                reformatWasekaData({ mainObject }, saks).map((sak) => {
                  return (
                    <Row>
                      <Col span={12}>
                        <b>مصدره</b>:{" "}
                        <span>
                          {convertToArabic(
                            (sak.number_waseka_1 && "قرار وزاري") ||
                              (sak.number_waseka_2 && "قرار نزع ملكية") ||
                              (sak.number_waseka && sak.waseka_search)
                          )}
                        </span>
                      </Col>
                      <Col span={6}>
                        <b>تاريخه</b>:
                        <span> {convertToArabic(sak.date_waseka)} هـ</span>
                      </Col>
                      <Col span={6}>
                        {(sak.number_waseka_1 && <b>رقم القرار الوزاري</b>) ||
                          (sak.number_waseka_2 && (
                            <b>رقم قرار نزع الملكية</b>
                          )) ||
                          (sak.number_waseka && <b>رقم الصك</b>)}{" "}
                        : <span>{convertToArabic(sak.number_waseka)}</span>
                      </Col>
                    </Row>
                  );
                })}
            </div>
            <hr
              style={{
                width: "50%",
                margin: "20px 275px",
                textAlign: "center",
              }}
            ></hr>
            <div style={{ textAlign: "right", paddingTop: "15px" }}>
              <h6>
                إنه في يوم ...... الموافق ............ تم استعراض الفكرة
                التخطيطية المعده من قبل {ceator_user_name} للأرض المذكوره أعلاه
              </h6>
              <h6
                style={{ textDecoration: "underline", paddingBottom: "15px" }}
              >
                وفق البيانات الموضحة أدناه :
              </h6>
              <table
                className="table printTable"
                style={{ border: "1px solid black" }}
              >
                <tr style={{ border: "1px solid black" }}>
                  <th>عدد القطع</th>
                  <th>نوع الإستخدام</th>
                  <th>النطاق العمراني</th>
                  <th>النسبة التخطيطية المقتطعة</th>
                  <th>مساحة الأرض (م٢)</th>
                  <th>نسبة الخدمات</th>
                </tr>
                <tr>
                  <td>{convertToArabic(parcel_count)}</td>
                  <td>{plan_using_type}</td>
                  <td>{urban_range} عام ١٤٣٥ - ١٤٤٠ هـ</td>
                  <td>{convertToArabic(cut_area_percentage)} %</td>
                  <td>{convertToArabic(parcel_area)} (م٢)</td>
                  <td>{convertToArabic(services_percentage)} %</td>
                </tr>
              </table>
            </div>{" "}
          </div>
          <div className="printNotes" style={{ zoom: "0.77" }}>
            <h5>الملاحظات :</h5>
            <ul>
              <li>
                - الفكرة التخطيطية مناسبة و معدة بحسب المعايير التخطيطية المتبعة
                و وفقا للإشتراطات و ضوابط التنمية المعتمدة بالمنطقة
              </li>
              <li>
                - الأرض تقع ضمن منطقة مصنفة كــ ({urban_range}) حسب تصنيف
                الإستراتيجية العمرانية الوطنية المعتمدة بقرار من مجلس الوزراء
                رقم ١٥٧ في ١١ / ٥ / ١٤٢٨ هـ ولائحتها التنفيذية المحدثة بقرار سمو
                الوزير رقم ٦٦٠٠٠ في ٢٠ / ١٢ / ١٤٣٥ هـ الخاصة بحاضرة {city}
              </li>
              {remarks &&
                remarks.map((note) => {
                  return (
                    note.checked == 1 &&
                    !note.isSignAmin && <li>- {note.remark}</li>
                  );
                })}
            </ul>
          </div>
          <div className="printFinalHead">
            <h5>وعليه جري التوقيع والله الموفق</h5>
            <h5>أعضاء اللجنة</h5>
          </div>
          <div
            style={{ zoom: 0.9 }}
            className={
              committeeactors5.name
                ? "new_wakel"
                : isSignAmin
                ? "new_wakel"
                : "printFinal"
            }
          >
            <div>
              <h4>المهندس المختص</h4>
              {province_id && (
                <SignPics
                  province_id={province_id}
                  userId={userIdeng}
                  planApproval={true}
                />
              )}
              <p style={{ whiteSpace: "normal" }}>المهندس / {eng_user_name}</p>
            </div>
            <div>
              <h4>{committeeactors2.position}</h4>
              {committeeactors2.is_approved && province_id && (
                <SignPics
                  province_id={province_id}
                  userId={committeeactors_dynamica_id[3]}
                  planApproval={true}
                />
              )}
              <p>المهندس / {committeeactors2.name}</p>{" "}
              {/* <h4>مدير إدارة التخطيط</h4>
              <p>المهندس / محمد بن سعيد الدوسري</p>{" "} */}
            </div>
            <div>
              <h4>{committeeactors3.position}</h4>
              {committeeactors3.is_approved && province_id && (
                <SignPics
                  province_id={province_id}
                  userId={committeeactors_dynamica_id[2]}
                  planApproval={true}
                />
              )}
              <p>المهندس / {committeeactors3.name}</p>{" "}
              {/* <h4>مدير عام التخطيط العمراني</h4>
              <p>المهندس / فواز بن فهد العتيبي</p>{" "} */}
            </div>
            {committeeactors1.name && (
              <div>
                <h4>{committeeactors1.position}</h4>
                {committeeactors1.is_approved && province_id && (
                  <SignPics
                    province_id={province_id}
                    userId={committeeactors_dynamica_id[4]}
                    planApproval={true}
                  />
                )}
                <p>المهندس / {committeeactors1.name}</p>{" "}
              </div>
            )}
            {isSignAmin > 0 && (
              <div style={committeeactors5.name ? {} : { order: 2 }}>
                <h4>يعتمد / {committeeactors5.position}</h4>
                {committeeactors5.is_approved && province_id && (
                  <SignPics
                    province_id={province_id}
                    userId={committeeactors_dynamica_id[0]}
                    planApproval={true}
                  />
                )}
                <p>المهندس / {committeeactors5.name}</p>
                {/* <h4>يعتمد / أمين المنطقة الشرقية</h4>
                <p>المهندس / فهد بن محمد الجبير</p> */}
              </div>
            )}
            <div className={!isSignAmin ? "last_left" : ""}>
              <h4>{committeeactors4.position}</h4>{" "}
              {committeeactors4.is_approved && province_id && (
                <SignPics
                  province_id={province_id}
                  userId={committeeactors_dynamica_id[1]}
                  planApproval={true}
                />
              )}
              <p>المهندس / {committeeactors4.name}</p>{" "}
              {/* <h4>وكيل الأمين للتعمير والمشاريع</h4>{" "}
              <p>المهندس / مازن بن عادل بخرجي</p>{" "} */}
            </div>
          </div>

          <div className="printDateBottom">/ ٠١ / ٠١-٠١-٠٥-٠١</div>
        </div>{" "}
      </div>
    );
  }
}
