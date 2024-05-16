import React, { Component } from "react";
import { workFlowUrl, backEndUrlforMap, filesHost } from "imports/config";
import { get } from "lodash";
import axios from "axios";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import // convertEnglishToArabic,
// convertEnglishNotReverseToArabic,
"./helperFunctions";
import {
  checkImage,
  convertToArabic,
  remove_duplicate,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
export default class BuyZayda extends Component {
  state = {
    radio1: 1,
    radio2: 1,
    radio3: 1,
    radio4: 1,
    radio6: 1,
    radio5: 1,
  };
  convertEnglishToArabic(english, notreverse) {
    //
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
      if (notreverse) return revesedChars; //.split('/').reverse().join('/')
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
  componentDidMount() {
    initializeSubmissionData(this.props.params.id).then((response) => {
      var mainObject = response.mainObject;
      let dataZayda =
        mainObject["buy_zayda"]["zayda_data"] || mainObject["buy_zayda"];
      let landData =
        mainObject["landData"]["landData"]["lands"]["parcels"]["0"][
          "attributes"
        ];
      let parcels_no = mainObject["landData"]["landData"]["lands"]["parcels"]
        .map((parcel) => parcel.attributes.PARCEL_PLAN_NO)
        .join(" - ");
      let submission_data = mainObject["landData"]["submission_data"];

      let zayda_area =
        (+mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ].filter((p) => {
          return (
            p.layerName &&
            ["boundry", "full_boundry"].indexOf(p.layerName) == -1
          );
        })[0].area).toFixed(2) + "";
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
      //         .reduce((a, b) => {  return Number(a) + Number(b); }, 0) || 0)
      //   : (shatfa_lengths =
      //       Object.values(shatfa_array).reduce((a, b) => {  return Number(a) + Number(b); }, 0) || 0);

      // if (Number(shatfa_lengths) > Number(zayda_area)) {
      //   shatfa_lengths = 0;
      // }

      // zayda_area = Number(zayda_area) - shatfa_lengths;
      // zayda_area = zayda_area.toFixed(2);
      // console.log("شطفات", shatfa_lengths);
      /*نهاية الشطفات*/

      let sakk = Object.values(mainObject?.sakData?.sakData?.saks);
      // let sakRandomNum = sakk && Object.keys(sakk);
      // let mun_opinion = get(
      //   data,
      //   "data.sellingConfirmation.notes.acceptOrReject",
      //   "لم يتم تحديد رأي الجهة بعد"
      // );

      const {
        radio1,
        radio2,
        radio3,
        radio4,
        radio5,
        radio6,
        text7,
        text8,
        text3,
        text4,
        text5,
        text6,
        other_services,
        services,
        zayda_3aada,
        zayda_mansh2,
      } = dataZayda;
      const {
        MUNICIPALITY_NAME,
        PARCEL_AREA,
        PLAN_NO,
        SUBDIVISION_TYPE,
        SUBDIVISION_DESCRIPTION,
        DISTRICT_NAME,
        PARCEL_PLAN_NO,
      } = landData;
      const {
        east_desc,
        east_length,
        north_desc,
        north_length,
        south_desc,
        south_length,
        west_desc,
        west_length,
      } = submission_data;
      this.setState({
        radio1,
        radio2,
        radio3,
        PARCEL_PLAN_NO,
        parcels_no,
        radio4,
        radio5,
        radio6,
        text3,
        text4,
        text5,
        text6,
        text7,
        mainObject,
        other_services,
        text8,
        services,
        zayda_3aada,
        SUBDIVISION_TYPE,
        SUBDIVISION_DESCRIPTION,
        DISTRICT_NAME,
        zayda_mansh2,
        MUNICIPALITY_NAME,
        PARCEL_AREA,
        PLAN_NO,
        east_desc,
        east_length,
        north_desc,
        north_length,
        south_desc,
        south_length,
        west_desc,
        west_length,
        zayda_area,
        // mun_opinion,
        sakk,
      });
    });
  }
  render() {
    const {
      radio1 = "",
      MUNICIPALITY_NAME,
      PARCEL_PLAN_NO,
      parcels_no = "",
      text7 = "",
      text8 = "",
      text3 = "",
      text5 = "",
      text6,
      SUBDIVISION_TYPE,
      SUBDIVISION_DESCRIPTION,
      DISTRICT_NAME,
      PLAN_NO,
      east_length,
      mainObject,
      north_length,
      south_length,
      west_length,
      radio3 = "",
      radio4 = "",
      radio5 = "",
      radio6 = "",
      services = [],
      other_services,
      zayda_3aada = "",
      zayda_mansh2 = "",
      zayda_area = "",
      sakk = [],
      // mun_opinion = "",
    } = this.state;
    console.log(text6);
    return (
      <div>
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
                // height: "75vh",

                margin: "10px",
                zoom: ".78",
                // overflow: "visible"
              }}
              className="content-temp buy_zayda"
            >
              <div style={{ height: "16vh" }}></div>
              <h2
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                استمارة طلب شراء زائدة تنظيمية
              </h2>
              <div>
                {sakk.map((r) => (
                  <div style={{ display: "grid", justifyItems: "flex-end" }}>
                    <p>
                      {" "}
                      <span style={{ fontSize: "25px" }}>
                        {" "}
                        رقم الصك {convertToArabic(r.number)} في{" "}
                      </span>
                      <span style={{ fontSize: "25px" }}>
                        {this.convertEnglishNotReverseToArabic(r.date)} هـ
                      </span>
                    </p>
                  </div>
                ))}
                <div>
                  <p
                    style={{
                      textDecoration: "underline",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    {" "}
                    ايضاحات عن الزائدة التنظيمية
                  </p>
                  <p style={{ fontWeight: "bold", textAlign: "right" }}>
                    موقع الزائدة التنظيمية :-{" "}
                  </p>
                  <table className="table table-bordered table-buy_zayda">
                    <tr>
                      <td>رقم قطعة الأرض</td>
                      <td>رقم المخطط</td>
                      <td>اسم الحي</td>
                      <td>اسم التقسيم</td>
                      <td>وصف التقسيم</td>
                    </tr>
                    <tr>
                      <td>{convertToArabic(parcels_no)}</td>
                      <td>{convertToArabic(PLAN_NO)}</td>
                      <td>{DISTRICT_NAME || "غير متوفر"}</td>
                      <td>{SUBDIVISION_TYPE || "غير متوفر"}</td>
                      <td>{SUBDIVISION_DESCRIPTION || "غير متوفر"}</td>
                    </tr>
                  </table>
                  {mainObject &&
                    checkImage(
                      this.props,
                      mainObject?.suggestParcel?.suggestParcel?.submission_data
                        ?.suggestionUrl ||
                        mainObject?.suggestParcel?.submission_data
                          ?.suggestionUrl,
                      { width: "100%" }
                    )}
                  {/* <p>
                    القطعة رقم ({PARCEL_PLAN_NO}) الحي ({DISTRICT_NAME}) بـ(
                    {SUBDIVISION_TYPE}) ({SUBDIVISION_DESCRIPTION}){" "}
                  </p> */}
                  <p style={{ fontWeight: "bold", textAlign: "right" }}>
                    إيضاحات عن الزائدة التنظيمية :-
                  </p>

                  <table className="table table-bordered table-buy_zayda">
                    <tr>
                      <td>الضلع الشمالي بطول</td>
                      <td style={{ unicodeBidi: "plaintext" }}>
                        {convertToArabic(north_length)} م
                      </td>
                    </tr>
                    <tr>
                      <td>الضلع الجنوبي بطول</td>
                      <td style={{ unicodeBidi: "plaintext" }}>
                        {convertToArabic(south_length)} م
                      </td>
                    </tr>
                    <tr>
                      <td>الضلع الشرقي بطول</td>
                      <td style={{ unicodeBidi: "plaintext" }}>
                        {convertToArabic(east_length)} م
                      </td>
                    </tr>
                    <tr>
                      <td>الضلع الغربي بطول</td>
                      <td style={{ unicodeBidi: "plaintext" }}>
                        {convertToArabic(west_length)} م
                      </td>
                    </tr>
                    <tr>
                      <td>المساحة الإجمالية للزائدة (م۲)</td>
                      <td style={{ unicodeBidi: "plaintext" }}>
                        {convertToArabic(zayda_area)} م۲
                      </td>
                    </tr>
                  </table>
                  <div style={{ display: "flex", gridGap: "100px" }}>
                    <p>- عائدة الزائدة :- {zayda_3aada}</p>
                    <p>- منشأة الزائدة :- {zayda_mansh2}</p>
                  </div>
                  <p style={{ textAlign: "right" }}>
                    - مدي ملائمة تلك الزائدة للتنظيم :-
                    <span style={{ fontSize: "22px", marginRight: "20px" }}>
                      {radio1 === "1" ? "ملائمة" : "غير ملائمة"}
                    </span>
                  </p>
                  <p style={{ textAlign: "right" }}>
                    - هل يمكن البناء علي الزائدة بشكل منفرد :-
                    <span style={{ fontSize: "22px", marginRight: "20px" }}>
                      {radio3 === "1" ? "نعم" : "لا"}
                    </span>
                  </p>
                  <p style={{ textAlign: "right" }}>
                    - هل يوجد منشأت على تلك الزائدة :-
                    <span style={{ fontSize: "22px", marginRight: "20px" }}>
                      {radio4 === "1" ? "نعم" : "لا"}
                    </span>
                  </p>
                  <p style={{ textAlign: "right" }}>
                    - هل للزائدة استمرارية ويمكن أن تكون تكمله لها :-
                    <span style={{ fontSize: "22px", marginRight: "20px" }}>
                      {radio5 === "1" ? "نعم" : "لا"}
                    </span>
                  </p>
                  <p style={{ textAlign: "right" }}>
                    - هل المذكور هو المستفيد الوحيد من الزائدة وليس في بيعها ضرر
                    على أحد :-
                    <span style={{ fontSize: "22px", marginRight: "20px" }}>
                      {radio6 === "1" ? "نعم" : "لا"}
                    </span>
                  </p>
                  <p style={{ textAlign: "right" }}>
                    - ما مدى حاجة الخدمات والمرافق العامة لهذه الزائدة أو لجزء
                    منها :-
                    <p style={{ marginRight: "20px" }}>
                      {services.length > 0
                        ? services.map((d, k) => {
                            return (
                              <span style={{ fontSize: "22px" }} key={k}>
                                {[d == "اخرى" ? other_services : d]} -{" "}
                              </span>
                            );
                          })
                        : "لا يوجد"}
                    </p>
                  </p>
                  <p style={{ textAlign: "right" }}>
                    - رأي الجهة المختصة في البلدية في بيع هذه الزائدة من عدمها
                    :-
                  </p>
                </div>
              </div>
              <br />
              <div
                style={{
                  textAlign: "center",
                  fontSize: "35px",
                  fontWeight: "bold",
                }}
              >
                تــم الاعــتــمــاد إلــكــتــرونــيــا
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// <span>
// {" "}
// <p> تفاصيل :- {text3}</p>
// </span>

// <span>
// {" "}
// <p> لماذا :- {text5}</p>
// </span>

// <span>
// {" "}
// <p> تفاصيل :- {text6}</p>
// </span>

// <span>
// {" "}
// <p>تفاصيل :- {text7}</p>
// </span>

// <span>
// {" "}
// <p>تفاصيل :- {text8}</p>
// </span>

// <span style={{ fontSize: "22px", marginRight: "20px" }}>
// {mun_opinion === "1" ? "يمكن البيع" : "لا يمكن البيع"}
// </span>

// <div
// style={{
//   display: "grid",
//   gridTemplateColumns: "1fr 1fr 1fr",
//   justifyItems: "center",
// }}
// >
// <div>
//   {/* style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr'}}> */}
//   <p>المساح</p>
//   <p></p>
// </div>
// <div>
//   <p>مدير ادارة المساحة</p>
//   <p style={{ marginTop: "70px" }}>مساعد بن مفضي الحربي</p>
// </div>
// <div>
//   <p>مدير عام التخطيط العمرانى</p>
//   <p style={{ marginTop: "70px" }}>
//     المهندس / فواز بن فهد العتيبي
//   </p>
// </div>
// </div>

// {MUNICIPALITY_NAME == "الخبر" && (
// <div
//   style={{
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr 1fr",
//     justifyItems: "center",
//   }}
// >
//   <div>
//     {/* style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr'}}> */}
//     <p>المساح</p>
//     <p></p>
//   </div>
//   <div>
//     <p>رئيس قسم الأراضي</p>
//     <p style={{ marginTop: "100px" }}>عبدالكريم علي سرور</p>
//   </div>
//   <div>
//     <p>مدير عام التخطيط العمرانى</p>
//     <p style={{ marginTop: "100px" }}>
//       المهندس / فواز بن فهد العتيبي
//     </p>
//   </div>
// </div>
// )}
