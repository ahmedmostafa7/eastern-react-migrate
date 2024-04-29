import React, { Component } from "react";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import { get, map } from "lodash";
import {
  convertToArabic,
  selectActors,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import axios from "axios";
import main from "../../../../inputs/fields/calculator/main";
// import debagh from "../tabs/debagh";

export default class LangnaFaneh extends Component {
  state = { name: "" };
  componentDidMount() {
    let self = this;
    initializeSubmissionData(this.props.match.params.id).then((response) => {
      var mainObject = response.mainObject;
      let ceator_user_name = response.ceator_user_name;
      let submission = response.submission;
      this.state["historydata"] = response.historyData;
      let commite_date = submission.committee_date;
      let commite_num = submission.committee_report_no;
      let request_no = submission.request_no;
      let create_date = submission.create_date;
      let userObject = get(mainObject["ownerData"], "ownerData.owners", "");

      let actors = selectActors(submission, mainObject, [2, 1, 0]);
      ////
      let committeeactors1_id = actors?.find((r) => r.index == 0)?.id;
      let committeeactors2_id = actors?.find((r) => r.index == 1)?.id;
      let committeeactors3_id = actors?.find((r) => r.index == 2)?.id;

      // let committeeactors_dynamica_id = actors?.filter(
      //   (d) =>
      //     d?.name ==
      //     (mainObject?.engSecratoryName ||
      //       actors?.find((r) => r.index == 3)?.name)
      // )?.[0]?.id;

      let committeeactors1 = actors?.find((r) => r.index == 0);
      let committeeactors2 = actors?.find((r) => r.index == 1);
      let committeeactors3 = actors?.find((r) => r.index == 2);

      let name = Object.values(userObject)
        .map((user) => get(user, "name"))
        .join(" , ");
      let identity = mainObject["ownerData"]["ownerData"].owner;
      let land_num = mainObject["landData"]["landData"]["lands"]["parcels"]
        .map((parcel) => parcel.attributes.PARCEL_PLAN_NO)
        .join(" - ");
      let mo5atat =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
          .PLAN_NO;
      let el7ay =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
          .DISTRICT_NAME;
      let mun =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes[
          "MUNICIPALITY_NAME"
        ];
      let sakObj = get(mainObject["sakData"], "sakData.saks", []);
      sakObj = !Array.isArray(sakObj) && typeof sakObj == 'object' && Object.values(sakObj) || sakObj
      // let sak = get(Object.values(sakObj)[0], "number");
      // let sak_date = get(Object.values(sakObj)[0], "date");
      // let Ketab_3adl = get(Object.values(sakObj)[0], "issuer");
      let debagh = get(mainObject, "debagh.debagh.debagh_text_area", "");
      // mainObject["debagh"]["debagh"]["debagh_text_area"] || "";
      // let debaghWords=debagh.split("-");
      // console.log("ff",debaghWords)
      let taksem =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
          .SUBDIVISION_TYPE;
      let wasf_taksem =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
          .SUBDIVISION_DESCRIPTION;
      // let karar_date = mainObject["krar_amin"]["karar_amin"].date_krar;
      // let karar_num = mainObject["krar_amin"]["karar_amin"].num_krar;

      let allArea = get(mainObject, "landData.landData.lands.parcels", "");

      allArea =
        allArea &&
        allArea.reduce((sum, cur) => sum + +cur.attributes.PARCEL_AREA, 0);
      let allNaturalArea = get(
        mainObject,
        "landData.landData.lands.parcels",
        ""
      );
      allNaturalArea =
        allNaturalArea &&
        allNaturalArea.reduce(
          (sum, cur) => sum + +cur.attributes.Natural_Area,
          0
        );

      let sak_area = allArea && allArea.toFixed(2) + "";
      let sak_natural_area = allNaturalArea && allNaturalArea.toFixed(2) + "";
      // let zayda_area = get(
      //   mainObject,
      //   "suggestParcel.suggestParcel.suggestParcels.polygons",
      //   ""
      // );

      let parcel = mainObject["suggestParcel"]["suggestParcel"][
        "suggestParcels"
      ]["polygons"].filter((p) => {
        return (
          (p.polygon && p.polygon.layer == "boundry") ||
          (p.layerName && p.layerName == "boundry")
        );
      })[0];

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

      let north =
        mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ][0]["data"][0].totalLength;
      let south =
        mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ][0]["data"][4].totalLength;
      let east =
        mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ][0]["data"][1].totalLength;
      let west =
        mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ][0]["data"][3].totalLength;
      let north_det =
        mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ][0].north_Desc;
      let south_det =
        mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ][0].south_Desc;
      let east_det =
        mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ][0].east_Desc;
      let west_det =
        mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ][0].weast_Desc;
      let land_area =
        mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ][0].area;
      let area_desc =
        mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
          "polygons"
        ][0].parcel_area_desc;
      // let total=mainObject["ma7dar"]["ma7dar_mola5s"].declaration
      // let total_letters=mainObject["ma7dar"]["ma7dar_mola5s"].text_declaration
      // let meter_price=mainObject["ma7dar"]["ma7dar_mola5s"].meter_price
      this.setState({
        name,
        land_num,
        mo5atat,
        debagh,
        el7ay,

        commite_date,
        commite_num,
        request_no,
        create_date,
        sakObj,
        // sak,
        // sak_date,
        // Ketab_3adl,
        identity,
        sak_area,
        sak_natural_area,
        // debaghWords,
        zayda_area,
        east,
        west,
        mun,
        west_det,
        north_det,
        // total,
        // total_letters,
        // meter_price,
        north,
        south,
        south_det,
        east_det,
        land_area,
        area_desc,
        taksem,
        wasf_taksem,
        // karar_num,
        // karar_date,
        committeeactors1_id,
        committeeactors2_id,
        committeeactors3_id,
        // committeeactors_dynamica_id,
        committeeactors1,
        committeeactors2,
        committeeactors3,
      });
    });
  }
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
      name = "",
      land_num = "",
      mo5atat = "",
      el7ay = "",
      taksem = "",
      wasf_taksem = "",
      sakObj = [],
      // sak = "",
      // sak_date = "",
      // ketab_3adl = "",
      north,
      mun = "",
      debagh = "",
      north_det,
      south,
      south_det,
      east,
      east_det,
      west,
      west_det,
      total = "",
      total_letters,
      commite_date = "",
      commite_num = "",
      request_no = "",
      create_date = "",

      meter_price = "",
      sak_area = "",
      sak_natural_area = "",
      zayda_area = "",
      identity = "",
      karar_date = "",
      karar_num = "",
      committeeactors1_id = "",
      committeeactors2_id = "",
      committeeactors3_id = "",
      // committeeactors_dynamica_id = "",
      committeeactors1 = {},
      committeeactors2 = {},
      committeeactors3 = {},
    } = this.state;

    // console.log("de",debagh)
    return (
      <>
        <div className="table-report-container">
          {/* <Header /> */}
          <div className="table-pr" style={{ zoom: "0.9" }}>
            <div style={{ display: "grid", justifyContent: "flex-end" }}>
              <button
                className="btn btn-warning hidd"
                onClick={() => {
                  window.print();
                }}
              >
                طباعه
              </button>
            </div>
            <div
              style={{
                height: "75vh",
                zoom: 0.87,
                margin: "0px 15px",
                // overflow: "visible"
              }}
              className="content-temp lagna_faneh mohand_font_not_bold"
            >
              <div style={{ height: "16vh" }}></div>
              <div style={{ textAlign: "right" }}>
                <h5>الإدارة العامة للأراضي والممتلكات</h5>
                <h5 style={{ marginRight: "53px" }}>لجنة الزوائد التنظيمية </h5>
              </div>
              <h2
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "22px",
                }}
              >
                محضر لجنة فنية
                <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
                  محضر رقم{" "}
                  <span style={{ fontSize: "20px" }}>
                    ( {convertToArabic(commite_num)} )
                  </span>{" "}
                  بتاريخ{" "}
                  <span style={{ unicodeBidi: "plaintext", fontSize: "20px" }}>
                    ( {convertToArabic(commite_date)} )
                  </span>{" "}
                  هـ
                </h2>
              </h2>
              <br />
              <div style={{ margin: "5px", textAlign: "justify" }}>
                <p style={{ lineHeight: "2", color: "#000" }}>
                  &nbsp; &nbsp; &nbsp; إشارة إلي الأمر السامي الكـريم رقم{" "}
                  {convertToArabic("38313/ب/3")} بتاريخ{" "}
                  {convertToArabic("24/09/1422")} هـ القاضـي بالموافقة على
                  لائحـة التصـرف بالعقـارات البلديـة والمبلغـة بتعمـيم وزير
                  الشـئون البلديـة والقرويـة رقم {convertToArabic("58750/700")}ب
                  بتاريخ {convertToArabic("17/11/1423")} هـ
                </p>
                <p style={{ lineHeight: "2", color: "#000" }}>
                  &nbsp; &nbsp; &nbsp; وبناءً على الفقرة ( الرابعة ) من البند
                  ثانيا من المادة الثالثة من اللائحة المشار إليها أعـلاه
                  المتضـمن : ( تباع زوائد التنظيم وزوائد التخطيط التى تسمح أنظمة
                  البناء بإقامة مباني مستقلة عليها عن طريق المزايدة العامة إلا
                  إذا كان هناك ضرر على مالك العقار المجاور لها من جراء بيعها على
                  غيره وفي هذه الحالة تباع على مالك العقار المجاور بسعر السوق في
                  وقت البيع بشرط أن يثبت الضرر بمعرفة لجنة فنية من البلديـة
                  والإمارة وزارة المالية ) .
                </p>
                <p style={{ lineHeight: "2", color: "#000" }}>
                  {" "}
                  بناء عليه إجتمع أعضـاء اللجنة الفنية المنوه عنها خارج أوقات
                  الدوام الرسمية وبدراسة المعاملة المحالة للجنة من سـعادة مدير
                  عام إدارة الأراضي والممتلكات بأمانة المنطقة الشرقية برقم{" "}
                  {convertToArabic(request_no)} بتاريخ{" "}
                  <span style={{ fontSize: "22px" }}>
                    {convertToArabic(create_date)}
                  </span>
                  هـ المتعلقة بطلب{" "}
                  {`${
                    (name?.split(",").length > 1 && "المـواطنين") || "المـواطن"
                  }`}{" "}
                  / {name} شـراء الزائـدة التنظيمية الحاصـلة على{" "}
                  {land_num?.split("-")?.length > 1
                    ? "القطع أرقام"
                    : "القطعة رقم"}{" "}
                  ({convertToArabic(land_num)}){" "}
                  {wasf_taksem != null && wasf_taksem.includes("منطقة", "فئة")
                    ? taksem.replace("منطقة", "").replace("فئة", "")
                    : taksem != null
                    ? taksem
                    : ""}
                  {"-"}
                  {wasf_taksem != null ? wasf_taksem : ""} بالمخطط رقم (
                  {convertToArabic(mo5atat)}) حي {el7ay} بمدينة {mun} العائد له
                  بموجب {(sakObj.length > 1 && "الصكوك") || "الصك"} رقم (
                  {convertToArabic(sakObj?.map((r) => r.number).join(" - "))}) ب
                  {(sakObj.length > 1 && "تواريخ") || "تاريخ"}{" "}
                  <span
                    style={{
                      unicodeBidi: "plaintext",
                      fontSize: "25px",
                      marginRight: "10px",
                    }}
                  >
                    {sakObj?.map((r) => convertToArabic(r.date)).join(" - ")}
                  </span>
                  &nbsp;هـ حيث أن مساحة الأرض ({convertToArabic(sak_area)}) م۲
                  حسب الصك ومساحة الزائدة التنظيمية الشائعة المطلوب شرائها (
                  {convertToArabic(zayda_area)}) م۲ حسب استمارة طلب شراء الزائدة
                  المعتمدة إلكترونيا من الإدارة العامة للتخطيط العمراني برقم (
                  {convertToArabic(request_no)}) بتاريخ
                  <span style={{ fontSize: "22px" }}>
                    {convertToArabic(create_date)}
                  </span>{" "}
                  هـ.
                  {/* <span
                    style={{
                      unicodeBidi: "plaintext",
                      fontSize: "20px",
                      marginRight: "10px",
                    }}
                  >
                    {" "}
                    {this.convertEnglishToArabic(sak_date, true)}
                  </span>
                  <span> هـ </span> */}
                </p>
                <p style={{ lineHeight: "2", color: "#000" }}>
                  {/* &nbsp; &nbsp; &nbsp;  */}
                  {/* {debaghWords.map(d=>{<p>{d}</p>})}
                   */}
                  {debagh
                    ? debagh.split("-").map((d, i) => {
                        return (
                          <p key={i} style={{ lineHeight: "2" }}>
                            {d}
                          </p>
                        );
                      })
                    : ""}
                </p>
                <p style={{ textAlign: "center", color: "#000" }}>
                  والله الموفق ,,,
                </p>
                <br />
                <h5
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "22px",
                    color: "#000",
                  }}
                >
                  أعـضـاء اللجـنة
                </h5>
                <div
                  style={{
                    // margin: "20px",
                    direction: "ltr",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gridGap: "30px",
                    textAlign: "center",
                  }}
                >
                  <div>
                    <h5
                      style={{
                        lineHeight: "2",
                        whiteSpace: "nowrap",
                        fontWeight: "bold",
                      }}
                    >
                      {/* مندوب أمانة المنطقة الشرقية */}
                      {committeeactors3.position}
                    </h5>
                    <h5 style={{ marginTop: "85px", fontWeight: "bold" }}>
                      {/* عبدالله يوسف الثاني */}
                      الأستاذ / {committeeactors3.name}
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
                      {committeeactors2.position}
                    </h5>
                    <h5 style={{ marginTop: "85px", fontWeight: "bold" }}>
                      {/* الأستاذ / مشبب محمد آل معيض */}
                      الأستاذ / {committeeactors2.name}
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
                      {/* مندوب أمارة المنطقة الشرقية */}
                      {committeeactors1.position}
                    </h5>
                    <h5 style={{ marginTop: "85px", fontWeight: "bold" }}>
                      {/* الأستاذ / تركي عبدالله التميمي */}
                      {committeeactors1.name}
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
