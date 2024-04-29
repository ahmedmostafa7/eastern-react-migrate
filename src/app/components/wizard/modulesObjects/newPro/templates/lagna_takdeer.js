import React, { Component } from "react";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import { get } from "lodash";
import axios from "axios";
import {
  convertToArabic,
  selectActors,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import ZoomSlider from "app/components/editPrint/zoomEdit";
export default class Takdeer extends Component {
  state = { data: {}, mainObject: {} };
  componentDidMount() {
    console.log("ss", this.props);
    let self = this;
    initializeSubmissionData(this.props.match.params.id).then((response) => {
      var mainObject = response.mainObject;
      let ceator_user_name = response.ceator_user_name;
      let submission = response.submission;
      this.state["historydata"] = response.historyData;

      let current_step = submission.current_step;
      let invoice =
        submission.submission_invoices
          ?.map((invoice) => invoice.invoice_number)
          ?.join(", ") || submission.invoice_number;
      let commite_date = submission.committee_date;
      let commite_num = submission.committee_report_no;
      let reqNo = submission.request_no;
      let reqDate = submission.create_date;
      let userObject = get(mainObject["ownerData"], "ownerData.owners", "");

      let actors = selectActors(submission, mainObject, [4, 3, 2, 1, 0]);
      ////
      let committeeactors1_id = actors?.find((r) => r.index == 0)?.id;
      let committeeactors2_id = actors?.find((r) => r.index == 1)?.id;
      // let committeeactors3_id =
      //   actors?.find(r => r.index == 2)?.user.id;

      let committeeactors_dynamica_id = actors?.filter(
        (d) =>
          d?.name ==
          (mainObject?.engSecratoryName ||
            actors?.find((r) => r.index == 2)?.name)
      )?.[0]?.id;

      let committeeactors4_id = actors?.find((r) => r.index == 3)?.id;
      let committeeactors5_id = actors?.find((r) => r.index == 4)?.id;

      let committeeactors1 = actors?.find((r) => r.index == 0);
      let committeeactors2 = actors?.find((r) => r.index == 1);
      let committeeactors3 = actors?.find((r) => r.index == 2);
      let committeeactors4 = actors?.find((r) => r.index == 3);
      let committeeactors5 = actors?.find((r) => r.index == 4);

      // mainObject["ma7dar"]["ma7dar_mola5s"]["debagh_text"];
      let ownerId =
        mainObject["ownerData"]["ownerData"]["owners"][
          [Object.keys(mainObject["ownerData"]["ownerData"]["owners"])[0]]
        ].ssn;
      let mun =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes[
          "MUNICIPALITY_NAME"
        ];
      let district =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes[
          "DISTRICT_NAME"
        ];
      let name = Object.values(userObject)
        .map((user) => get(user, "name"))
        .join(", ");
      let land_num = mainObject["landData"]["landData"]["lands"]["parcels"]
        .map((parcel) => parcel.attributes.PARCEL_PLAN_NO)
        .join(" - ");
      let mo5atat = this.convertEnglishToArabic(
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
          .PLAN_NO
      );
      let el7ay =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
          .DISTRICT_NAME;
      let sakObj = Object.values(
        get(mainObject["sakData"], "sakData.saks", {})
      );
      // let sak = get(Object.values(sakObj)[0], "number");
      // let sak_date = get(Object.values(sakObj)[0], "date");
      // let Khetab_3adl = get(Object.values(sakObj)[0], "issuer");

      // let allArea = mainObject["landData"]["landData"]["lands"][
      //   "parcels"
      // ].reduce((sum, cur) => sum + +cur.attributes.PARCEL_AREA, 0);
      // let sak_area =
      //   allArea.toFixed(2) -
      //   (+mainObject["suggestParcel"]["suggestParcel"]["electricArea"] ||
      //     0) -
      //   (+mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"]
      //     .temp.shtfa_northeast || 0) -
      //   (+mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"]
      //     .temp.shtfa_northweast || 0) -
      //   (+mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"]
      //     .temp.shtfa_southeast || 0) -
      //   (+mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"]
      //     .temp.shtfa_southweast || 0);
      // sak_area = sak_area + "";
      // console.log("i-------", sak_area);

      let allAreaBefore = mainObject["landData"]["landData"]["lands"]["parcels"]
        .reduce((sum, cur) => sum + +cur.attributes.PARCEL_AREA, 0)
        .toFixed(2);

      let allArea = this.convertEnglishToArabic(allAreaBefore);

      // let allNaturalArea = mainObject["landData"]["landData"]["lands"][
      //   "parcels"
      // ][0].attributes["Natural_Area"]
      //   ? mainObject["landData"]["landData"]["lands"]["parcels"].reduce(
      //       (sum, cur) => sum + +cur.attributes.Natural_Area,
      //       0
      //     )
      //   : "غير متوفر";

      let allNaturalArea =
        [
          ...(mainObject?.suggestParcel?.suggestParcel.suggestParcels?.polygons.find(
            (p) => {
              return (
                (p.polygon && p.polygon.layer == "full_boundry") ||
                (p.layerName && p.layerName == "full_boundry")
              );
            }
          ) ||
            mainObject?.suggestParcel?.suggestParcel.suggestParcels?.polygons.filter(
              (p) => {
                return (
                  (p.polygon && p.polygon.layer == "boundry") ||
                  (p.layerName && p.layerName == "boundry")
                );
              }
            )),
        ]?.reduce((a, b) => {
          return (
            a +
            +(
              b.area -
              (+b.electricArea || 0) -
              (+b.shtfa_northeast || 0) -
              (+b.shtfa_northweast || 0) -
              (+b.shtfa_southeast || 0) -
              (+b.shtfa_southweast || 0)
            ).toFixed(2)
          );
        }, 0) || 0;

      // let parcel =
      //   mainObject?.suggestParcel?.suggestParcel.suggestParcels?.polygons.filter(
      //     (p) => {
      //       return (
      //         (p.polygon && p.polygon.layer == "boundry") ||
      //         (p.layerName && p.layerName == "boundry")
      //       );
      //     }
      //   )[0];

      let sak_natural_area = allNaturalArea.toFixed(2);
      sak_natural_area = this.convertEnglishToArabic(sak_natural_area);

      // let sak_natural_area;
      // allNaturalArea !== "غير متوفر"
      //   ? (sak_natural_area = this.convertEnglishToArabic(
      //       allNaturalArea.toFixed(2) + ""
      //     ))
      //   : (sak_natural_area = "غير متوفر");

      let zayda_area =
        (+(
          mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
            "polygons"
          ].filter((p) => {
            return (
              p.layerName &&
              ["boundry", "full_boundry"].indexOf(p.layerName) == -1
            );
          })?.[0]?.area || 0
        )).toFixed(2) + "";
      /*حساب الشطفات*/
      // let shatfa_array = get(
      //   mainObject,
      //   "suggestParcel.suggestParcel.suggestParcels.temp",
      //   ""
      // );

      // let shatfa_lengths;
      // Object.keys(shatfa_array).includes("cadData")
      //   ? (shatfa_lengths =
      //       Object.values(shatfa_array)
      //         .slice(1)
      //         .reduce((a, b) => a + b, 0) || 0)
      //   : (shatfa_lengths =
      //       Object.values(shatfa_array).reduce((a, b) => a + b, 0) || 0);
      // if (Number(shatfa_lengths) > Number(zayda_area)) {
      //   shatfa_lengths = 0;
      // }
      // zayda_area = Number(zayda_area) - shatfa_lengths;
      // zayda_area = zayda_area.toFixed(2);
      // console.log("شطفات", shatfa_lengths);
      /*نهاية الشطفات*/
      let editPrice =
        JSON.parse(localStorage.getItem("edit_price")) ||
        mainObject?.ma7dar?.ma7dar_mola5s ||
        {};
      let debaghText = editPrice["debagh_text"];
      let ma7dar_date = editPrice["date"];
      // mainObject["ma7dar"]["ma7dar_mola5s"].date;
      let meter_price = editPrice["meter_price"];
      // mainObject["ma7dar"]["ma7dar_mola5s"].meter_price;
      // let edit_meter_price = mainObject["edit_price"]["meter_price"];
      let total_price = editPrice["declaration"];
      //  mainObject["ma7dar"]["ma7dar_mola5s"].declaration;
      let meter_text = editPrice["text_meter"];
      // mainObject["ma7dar"]["ma7dar_mola5s"].text_meter;
      let total_price_letters = editPrice["text_declaration"];
      // mainObject["ma7dar"]["ma7dar_mola5s"].text_declaration;

      let isZaedaLgnah =
        mainObject["landData"]["landData"]["lands"].isZaedaLgnah;

      this.setState({
        name,
        ownerId,
        // edit_meter_price,
        isZaedaLgnah,
        land_num,
        meter_text,
        mo5atat,
        reqNo,
        reqDate,
        debaghText,
        el7ay,
        // sak,
        // sak_date,
        // Khetab_3adl,
        sakObj,
        allArea,
        // sak_area,
        sak_natural_area,
        zayda_area,
        ma7dar_date,
        mun,
        district,
        commite_date,
        commite_num,
        meter_price,
        total_price,
        invoice,
        total_price_letters,
        current_step,
        committeeactors1_id,
        committeeactors2_id,
        committeeactors_dynamica_id,
        committeeactors4_id,
        committeeactors5_id,
        committeeactors1,
        committeeactors2,
        committeeactors3,
        committeeactors4,
        committeeactors5,
      });

      console.log(mainObject, this.state.land_num);
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
      english = english.toString();
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
    const {
      isZaedaLgnah,
      name = "",
      ownerId = "",
      land_num = "",
      invoice = "",
      mo5atat = "",
      el7ay = "",
      // edit_meter_price,
      commite_date = "",
      meter_text,
      commite_num = "",
      debaghText = "",
      reqNo = "",
      reqDate = "",
      // sak = "",
      // sak_date = "",
      // Khetab_3adl = "",
      sakObj = [],
      meter_price = "",
      allArea = "",
      // sak_area = "",
      mun = "",
      district = "",
      sak_natural_area = "",
      zayda_area = "",
      total_price_letters = "",
      total_price = "",
      ma7dar_date = "",
      current_step,
      committeeactors1_id = "",
      committeeactors2_id = "",
      committeeactors_dynamica_id = "",
      committeeactors4_id = "",
      committeeactors5_id = "",
      committeeactors1 = {},
      committeeactors2 = {},
      committeeactors3 = {},
      committeeactors4 = {},
      committeeactors5 = {},
    } = this.state;

    return (
      <>
        <div className="table-report-container">
          {/* <Header /> */}
          <div className="table-pr">
            <div
              style={{
                display: "grid",
                justifyContent: "left",
              }}
            >
              <button
                className="btn btn-warning hidd"
                onClick={() => {
                  window.print();
                }}
              >
                طباعه
              </button>
              {/* <p style={{position:'absolute',left:"3%",top:'0%',fontSize:'24px'}}>{this.convertEnglishToArabic("14/1440")}</p> */}
            </div>
            <div
              style={{
                height: "75vh",
                color: "#000",
                margin: "10px",
                // overflow: "visible"
              }}
              className="content-temp lagna_takdeer"
            >
              <div style={{ height: "16vh" }}></div>
              <h2
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {current_step == 2556 || current_step == 2642
                  ? " محضر إعادة تقدير"
                  : "محضر لجنة التقدير"}
              </h2>
              <br />
              <div
                style={{
                  margin: "5px",
                  textAlign: "justify",
                  lineHeight: "1.8",
                }}
              >
                <p>
                  &nbsp; &nbsp; &nbsp; بناءً على قرار معالي وزير الشـئون
                  البلديـة والقرويـة رقم {convertToArabic("4200242416/3")}{" "}
                  بتاريخ{" "}
                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {convertToArabic("15/04/1442")}
                  </span>{" "}
                  هـ ،القاضـي بإعتماد أعضاء لجنة التقدير بأمانة المنطقة الشرقية
                  المكونة من أربعة أعضاء يمثلون البلدية وزارة المالية وإمـارة
                  المنطقة الشرقية والهيئة العامة لعقارات الدولة وتكون اللجنة
                  برئاسة رئيس البلدية أو موظف لا تقل مرتبته عن (الثانية عشرة) ،
                  وبناءً على المادة الخامسة عشر من لائحة التصرف بالعقارات
                  البلديـة إجتمعت اللجنة لدراسة المعاملة المحالة للجنة من سعادة
                  مدير عام الاراضي والممتلكات بالقيد رقم{" "}
                  {convertToArabic(reqNo)} وتاريخ {convertToArabic(reqDate)} هـ
                  وتم تقدير سعر الزائدة الحاصلة في الأرض الموضحة بياناتها أدناه
                  :
                </p>

                <table
                  className="table table-bordered table-ma7dar"
                  style={{ zoom: 0.8 }}
                >
                  <tr>
                    <td>اسم صاحب الأرض</td>
                    <td colSpan="3">{name}</td>
                    <td>رقم الهوية الوطنية</td>
                    <td>{convertToArabic(ownerId)}</td>
                  </tr>
                  <tr>
                    <td>رقم صك التملك</td>
                    <td>
                      {sakObj.map((sak) => (
                        <div>
                          <span
                            style={{
                              fontSize: "18px",
                              unicodeBidi: "plaintext",
                            }}
                          >
                            {convertToArabic(sak.number)}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td>تاريخ صك التملك</td>
                    <td colSpan="3">
                      {sakObj.map((sak) => (
                        <div>
                          <span
                            style={{
                              fontSize: "18px",
                              unicodeBidi: "plaintext",
                            }}
                          >
                            {convertToArabic(sak.date)}
                          </span>
                          <span> هـ </span>
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      {land_num?.split("-")?.length > 1
                        ? "أرقام الأراضي"
                        : "رقم الأرض"}
                    </td>
                    <td>{convertToArabic(land_num)}</td>
                    <td>رقم المخطط</td>
                    <td>{mo5atat}</td>
                    <td>الحي / البلدية</td>
                    <td>
                      {district} {"ب" + mun}
                    </td>
                  </tr>
                  <tr>
                    <td>المساحة حسب الصك</td>
                    <td>
                      <span>
                        <span
                          style={{
                            fontWeight: "bold",
                            unicodeBidi: "plaintext",
                          }}
                        >
                          {" "}
                          {allArea}{" "}
                        </span>
                        <span style={{ marginRight: "10px" }}> م۲ </span>
                      </span>
                    </td>
                    <td>المساحة حسب الطبيعة</td>
                    <td>
                      <span>
                        <span
                          style={{
                            fontWeight: "bold",
                            unicodeBidi: "plaintext",
                          }}
                        >
                          {" "}
                          {sak_natural_area}
                        </span>
                        <span style={{ marginRight: "10px" }}> م۲ </span>
                      </span>
                    </td>
                    <td>مقدار المساحة الزائدة</td>
                    <td>
                      <span>
                        <span
                          style={{
                            fontWeight: "bold",
                            unicodeBidi: "plaintext",
                          }}
                        >
                          {" "}
                          {convertToArabic(zayda_area, false, true)}{" "}
                        </span>
                        <span style={{ marginRight: "10px" }}> م۲ </span>
                      </span>
                    </td>
                  </tr>
                </table>
                {/* <p style={{ lineHeight: "2" }}>{debaghText}</p> */}
                {/* {isZaedaLgnah && <p style={{ lineHeight: "2" }}>
                وبتداول الأسعار السائدة في السوق ترى اللجنة تقدير قيمة المساحة الزائدة المنوه عنها 
                بمبلغ إجمالي مقداره {this.convertEnglishToArabic(total_price)} ( {total_price_letters} ) ريال بواقع مبلغ {this.convertEnglishToArabic(meter_price)} ({meter_text}) ريال للمتر المربع.
                </p>} */}
                <ZoomSlider>
                  {isZaedaLgnah &&
                    !(current_step == 2556 || current_step == 2642) && (
                      <p style={{ lineHeight: "1.5" }}>
                        {debaghText} بمحضر اللجنة برقم{" "}
                        {convertToArabic(commite_num)} وتاريخ{" "}
                        {convertToArabic(commite_date)}هـ بمبلغ إجمالي مقداره{" "}
                        {convertToArabic(total_price)} ( {total_price_letters} )
                        {(total_price_letters?.indexOf("ريال") == -1 && "ريال") || ""} بواقع مبلغ {convertToArabic(meter_price)} (
                        {meter_text}) {(meter_text?.indexOf("ريال") == -1 && "ريال") || ""} للمتر المربع.
                      </p>
                    )}
                  {isZaedaLgnah &&
                    (current_step == 2556 || current_step == 2642) && (
                      <p style={{ lineHeight: "1.5" }}>
                        {debaghText} بمحضر اللجنة برقم
                        {convertToArabic(commite_num)} وتاريخ{" "}
                        {convertToArabic(commite_date)}هـ بمبلغ إجمالي مقداره{" "}
                        {this.convertEnglishToArabic(total_price)} ({" "}
                        {total_price_letters} ) {(total_price_letters?.indexOf("ريال") == -1 && "ريال") || ""} بواقع مبلغ{" "}
                        {convertToArabic(meter_price)} ({meter_text}) {(meter_text?.indexOf("ريال") == -1 && "ريال") || ""} للمتر
                        المربع.
                      </p>
                    )}

                  {!isZaedaLgnah &&
                    (current_step == 2556 || current_step == 2642) && (
                      <p style={{ lineHeight: "1.5" }}>
                        {debaghText} &nbsp;بمبلغ إجمالي مقداره{" "}
                        {convertToArabic(total_price)} ( {total_price_letters} )
                        {(total_price_letters?.indexOf("ريال") == -1 && "ريال") || ""} بواقع مبلغ {convertToArabic(meter_price)} (
                        {meter_text}) {(meter_text?.indexOf("ريال") == -1 && "ريال") || ""} للمتر المربع.
                      </p>
                    )}
                  {!isZaedaLgnah &&
                    !(current_step == 2556 || current_step == 2642) && (
                      <p style={{ lineHeight: "1.5" }}>
                        {debaghText} &nbsp;بمبلغ إجمالي مقداره{" "}
                        {convertToArabic(total_price)} ( {total_price_letters} )
                        {(total_price_letters?.indexOf("ريال") == -1 && "ريال") || ""} بواقع مبلغ {convertToArabic(meter_price)} (
                        {meter_text}){" "}
                        {(meter_text?.indexOf("ريال") == -1 && "ريال") || ""}{" "}
                        للمتر المربع.
                      </p>
                    )}
                </ZoomSlider>
                <p style={{ textAlign: "center", lineHeight: "2" }}>
                  وعليه جرى التوقيع ..
                </p>
                <div
                  className="oppo"
                  style={{
                    // margin: "20px",
                    marginTop: "50px",
                    // direction: "ltr",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gridGap: "30px",
                    textAlign: "center",
                    zoom: 0.8,
                    whiteSpace: "normal",
                  }}
                >
                  <div>
                    <h5
                      style={{
                        lineHeight: "2",
                        whiteSpace: "normal",
                        fontWeight: "bold",
                      }}
                    >
                      {/* مندوب الهيئة العامة لعقارات الدولة بالمنطقة الشرقية */}
                      {committeeactors1?.position}
                    </h5>
                    <h5>
                      {/* بندر بن خالد الوسمي */}
                      {committeeactors1?.name}
                    </h5>
                  </div>
                  <div>
                    <h5
                      style={{
                        lineHeight: "2",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                      }}
                    >
                      {/* مندوب فرع وزارة المالية بالمنطقة الشرقية */}
                      {committeeactors2?.position}
                    </h5>
                    <h5>
                      {/* محمد بن موسى قحل */}
                      {committeeactors2?.name}
                    </h5>
                  </div>
                  <div>
                    <h5
                      style={{
                        lineHeight: "2",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                      }}
                    >
                      {/* مندوب أمانة المنطقة الشرقية */}
                      {committeeactors3?.position}
                    </h5>
                    <h5>
                      {/* نايف بن سيف القصير */}
                      {committeeactors3?.name}
                    </h5>
                  </div>
                  <div>
                    <h5
                      style={{
                        lineHeight: "2",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                      }}
                    >
                      {/* مندوب إمارة المنطقة الشرقية */}
                      {committeeactors4?.position}
                    </h5>
                    <h5>
                      {/* سليمان بن إبراهيم المطرودي */}
                      {committeeactors4?.name}
                    </h5>
                  </div>
                  <div>
                    <h5
                      style={{
                        lineHeight: "2",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                        // gridColumn: '3/3',
                        // marginTop:'100px'
                      }}
                    ></h5>
                    <h5></h5>
                  </div>
                  <div>
                    <h5
                      style={{
                        lineHeight: "2",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                        // gridColumn: '3/3',
                        // marginTop:'100px'
                      }}
                    >
                      {/* رئيس لجنة التقدير */}
                      {committeeactors5?.position}
                    </h5>
                    <h5>
                      {/* عبدالسلام بن جارالله القحطاني */}
                      {committeeactors5?.name}
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

//                 {isZaedaLgnah &&
//                   !(current_step == 2556 || current_step == 2642) && (
//                     <p style={{ lineHeight: "2" }}>
//                       بناءً عليه جرى وقوف اللجنة على الموقع وبتداول الأسعار
//                       السائدة في السوق ترى اللجنة تقدير قيمة المساحة الزائدة
//                       المنوه عنها بمحضر اللجنة برقم{" "}
//                       {this.convertEnglishToArabic(commite_num)} وتاريخ{" "}
//                       {this.convertEnglishToArabic(commite_date)}بمبلغ إجمالي
//                       مقداره {this.convertEnglishToArabic(total_price)} ({" "}
//                       {total_price_letters} ) ريال بواقع مبلغ{" "}
//                       {this.convertEnglishToArabic(meter_price)} ({meter_text})
//                       ريال للمتر المربع.
//                     </p>
//                   )}
//                 {isZaedaLgnah &&
//                   (current_step == 2556 || current_step == 2642) && (
//                     <p style={{ lineHeight: "2" }}>
//                       مناسبة السعر المقدر سابقا بمحضر اللجنة برقم
//                       {this.convertEnglishToArabic(commite_num)} وتاريخ{" "}
//                       {this.convertEnglishToArabic(commite_date)}بمبلغ إجمالي
//                       مقداره {this.convertEnglishToArabic(total_price)} ({" "}
//                       {total_price_letters} ) ريال بواقع مبلغ{" "}
//                       {this.convertEnglishToArabic(meter_price)} ({meter_text})
//                       ريال للمتر المربع.
//                     </p>
//                   )}

//                 {!isZaedaLgnah &&
//                   (current_step == 2556 || current_step == 2642) && (
//                     <p style={{ lineHeight: "2" }}>
//                       مناسبة السعر المقدر سابقا بمبلغ إجمالي مقداره{" "}
//                       {this.convertEnglishToArabic(total_price)} ({" "}
//                       {total_price_letters} ) ريال بواقع مبلغ{" "}
//                       {this.convertEnglishToArabic(meter_price)} ({meter_text})
//                       ريال للمتر المربع.
//                     </p>
//                   )}
//                 {!isZaedaLgnah &&
//                   !(current_step == 2556 || current_step == 2642) && (
//                     <p style={{ lineHeight: "2" }}>
//                       بناءً عليه جرى وقوف اللجنة على الموقع وبتداول الأسعار
//                       السائدة في السوق ترى اللجنة تقدير قيمة المساحة الزائدة
//                       المنوه عنها بمبلغ إجمالي مقداره{" "}
//                       {this.convertEnglishToArabic(total_price)} ({" "}
//                       {total_price_letters} ) ريال بواقع مبلغ{" "}
//                       {this.convertEnglishToArabic(meter_price)} ({meter_text})
//                       ريال للمتر المربع.
//                     </p>
//                   )}
