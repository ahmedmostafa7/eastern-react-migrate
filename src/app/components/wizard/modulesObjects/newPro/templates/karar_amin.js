import React, { Component } from "react";
import axios from "axios";
import { get } from "lodash";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import { initializeSubmissionData } from "main_helpers/functions/prints";
// import { khetab_3adl } from "../create";
import moment from "moment-hijri";
import {
  convertToArabic,
  selectActors,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
export default class kararAmin extends Component {
  state = { data: [] };
  componentDidMount() {
    let self = this;
    initializeSubmissionData(this.props.match.params.id).then((response) => {
      var mainObject = response.mainObject;
      let ceator_user_name = response.ceator_user_name;
      let submission = response.submission;
      this.state["historydata"] = response.historyData;
      let invoice =
        submission.submission_invoices
          ?.map((invoice) => invoice.invoice_number)
          ?.join(", ") ||
        submission.invoice_number ||
        "";

      let is_paid =
        submission?.submission_invoices?.filter(
          (invoice) => invoice?.is_paid == true
        )?.length == submission?.submission_invoices?.length ||
        submission.is_paid;

      let committee_date = submission.committee_date;
      let committee_report_no = submission.committee_report_no;
      let request_no = submission.request_no;
      let userObject = get(mainObject["ownerData"], "ownerData.owners", "");

      let actors = selectActors(submission, mainObject, [2, 1, 0]);
      ////
      let committeeactors1_id = actors?.find((r) => r.index == 0)?.id;
      let committeeactors2_id = actors?.find((r) => r.index == 1)?.id;
      let committeeactors3_id = actors?.find((r) => r.index == 2)?.id;

      let committeeactors1 = actors?.find((r) => r.index == 0);
      let committeeactors2 = actors?.find((r) => r.index == 1);
      let committeeactors3 = actors?.find((r) => r.index == 2);
      let approve_references = get(
        mainObject,
        "engUserNameToPrint.engUser.id",
        0
      );

      let ownerType = get(mainObject["ownerData"], "ownerData.owner_type", "");
      let owner_names = Object.values(userObject)
        .map((user) => get(user, "name"))
        .join(" , ");
      let name =
        `لل${
          (ownerType == 1 &&
            ((owner_names.split(",").length > 1 && "مواطنين") || "مواطن")) ||
          (ownerType == 2 && "جهة") ||
          (ownerType == 3 &&
            get(Object.values(userObject)[0], "subtype") == "1" &&
            "شركة") ||
          (ownerType == 3 &&
            get(Object.values(userObject)[0], "subtype") == "2" &&
            "مؤسسة") ||
          (ownerType == 4 &&
            ((owner_names.split(",").length > 1 && "مواطنين") || "مواطن"))
        } / ` + owner_names;

      let sakObj = Object.values(
        get(mainObject["sakData"], "sakData.saks", {})
      );
      let mun =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes[
          "MUNICIPALITY_NAME"
        ];
      // let sak = get(Object.values(sakObj)[0], "number");
      // let sak_date = get(Object.values(sakObj)[0], "date");
      // let ketab_3adl = get(Object.values(sakObj)[0], "issuer");
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

      if (
        !["حي", "الحي", "حى", "الحى"].some(
          (el) => el7ay.split(" ").find((w) => w == el) != undefined
        )
      ) {
        el7ay = "حي " + el7ay;
      }

      let taksem =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
          .SUBDIVISION_TYPE;
      let wasf_taksem =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
          .SUBDIVISION_DESCRIPTION;

      let sak_area =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
          .PARCEL_AREA;
      let sak_natural_area =
        mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
          .Natural_Area;
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
      let karar_date = get(
        mainObject.krar_amin,
        "karar_amin_date",
        "" //this.getDayToday()
      );
      this.setState({
        name,
        land_num,
        mo5atat,
        el7ay,
        // sak,
        // sak_date,
        // ketab_3adl,
        sakObj,
        committee_date,
        committee_report_no,
        invoice,
        sak_area,
        sak_natural_area,
        zayda_area,
        east,
        west,
        west_det,
        request_no,
        north_det,
        north,
        south,
        south_det,
        east_det,
        land_area,
        area_desc,
        karar_date,
        mun,
        taksem,
        wasf_taksem,
        committeeactors1_id,
        committeeactors2_id,
        committeeactors3_id,
        committeeactors1,
        committeeactors2,
        committeeactors3,
        approve_references,
        is_paid,
      });
    });
  }
  convertEnglishToArabic(english, notreverse) {
    var arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (english == null || english == "") {
      return "";
    } else {
      english = english.toString();
      var chars = (english + "").split("");
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
  getDayToday() {
    let hijDate = moment().format("iYYYY/iM/iD");
    return this.convertEnglishNotReverseToArabic(hijDate);
  }
  render() {
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    let {
      name,
      land_num,
      mo5atat,
      el7ay,
      // sak,
      // sak_date,
      // ketab_3adl,
      sakObj = [],
      committee_date,
      committee_report_no,
      invoice,
      sak_area,
      sak_natural_area,
      zayda_area,
      east,
      west,
      west_det,
      request_no,
      north_det,
      north,
      south,
      south_det,
      east_det,
      land_area,
      area_desc,
      karar_date,
      mun,
      taksem,
      wasf_taksem,
      committeeactors1_id,
      committeeactors2_id,
      committeeactors3_id,
      committeeactors1,
      committeeactors2,
      committeeactors3,
      approve_references,
      is_paid = "",
    } = this.state;

    return (
      <>
        <div className="table-report-container">
          {/* <Header /> */}
          <div className="table-pr">
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
                zoom: "0.85",
                margin: "20px 25px",
                // overflow: "visible"
              }}
              className="content-temp mohand_font"
            >
              <div style={{ height: "16vh" }}></div>
              <div style={{ textAlign: "right" }}>
                {/* <h5>بلدية {mun} </h5> */}
                <h5>وحــدة الزوائد التنظيمية</h5>
              </div>
              <div style={{ textAlign: "left" }}>
                <h5>
                  الموضوع / اضافة الزائدة ل
                  {land_num?.split("-")?.length > 1
                    ? "لأراضي أرقام"
                    : "أرض رقم"}{" "}
                  {convertToArabic(land_num)}{" "}
                </h5>
                <h5>
                  بالمخطط المعتمد رقم {convertToArabic(mo5atat)} بمدينة {mun}
                </h5>
              </div>
              <h5
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "35px",
                }}
              >
                قرار رقم{" "}
                <span style={{ fontSize: "25px" }}>
                  ({convertToArabic(request_no)})
                </span>{" "}
                بتاريخ{" "}
                <span style={{ unicodeBidi: "plaintext", fontSize: "25px" }}>
                  ({convertToArabic(karar_date)})
                </span>{" "}
                هـ
              </h5>
              <br />
              <div style={{ margin: "5px", textAlign: "justify" }}>
                <h5
                  style={{
                    fontSize: "40px",
                    lineHeight: " 40px",
                    fontWeight: "bold",
                  }}
                >
                  إن أمين المنطقة الشرقية{" "}
                </h5>
                <p>
                  <span style={{ paddingRight: "4vw" }}>
                    استنادا للأمر السامـي رقم
                  </span>{" "}
                  {convertToArabic("40152")} بتاريخ{" "}
                  {convertToArabic("29/6/1441")} هـ بشأن تحديث لائحة التصرف
                  بالعقارات البلدية الموافق عليها بالأمر رقم ٣٨٣١٣ / ب / ٣ في{" "}
                  {convertToArabic("24/9/1423")} هـ القاضـي بالموافقة على لائحة
                  التصرف بالعقارات البلدية المنصوص في المادة الثالثة منها بأنه
                  يجوز بقرار من وزير الشئون البلدية والقروية بيع الأراضي المخصصة
                  للسكن والزوائد المنح وزوائد التخطيط وبعد الاطلاع على تعميم
                  صاحب السمو الملكي وزير الشئون البلدية والقروية رقم{" "}
                  {convertToArabic("ص ز / 67347")} بتاريخ{" "}
                  {convertToArabic("15/11/1426")} هـ و المبني على ما رفع للمقام
                  السامـي الكريم رقم {convertToArabic("6254")} وتاريخ{" "}
                  {convertToArabic("26/1/1426")} هـ حيث تلقى الأمر السامـي
                  البرقـي الكريم رقم {convertToArabic("م ب / 1108")} في{" "}
                  {convertToArabic("23/9/1426")} هـ المعطوف على المحضر رقم{" "}
                  {convertToArabic("290")} بتاريخ {convertToArabic("29/7/1426")}{" "}
                  هـ المعد في هيئة الخبراء والمتضمن (مناسبة الإبقاء على النصوص
                  الحالية للائحة التصرف بالعقارات البلدية الصادرة بالأمر السامي
                  رقم ب ٣٨٣١٣ / ٣ دون التعديل عدا بيع زوائد المنح وزوائد التنظيم
                  وزوائد التخطيط الواردة في المادة الثالثة من اللائحة وإضافة
                  العبارة التالية لنهايتها :)
                </p>

                <h5 style={{ textAlign: "center" }}>
                  (ويجوز للوزير تفويض من يراه بشأن زوائد المنـح وزوائد التنظيم
                  وزوائد التخطيط )
                </h5>
                <p>
                  وقد تضمن الأمر السامـي الكـريم الموافقة على ما تضمنه المحضر
                  المشار إليه أعلاه واستنادا إلى تفويضنا بصلاحية بيع زوائد
                  التنظيم وزوائد المنح وزوائد التخطيط المنصوص عليها بالمادة
                  الثالثة من لائحـة التصرف بالعقارات البلديـة والتقيد بكافة
                  الإجـراءات المنصوص عليها بهذه اللائحـة فيما يتعلق بذلك.
                </p>
                <h5 style={{ paddingRight: "4vw" }}>
                  وبناءا على الصـلاحيات المخولة لنا نظاما يقرر ما يلي :{" "}
                </h5>
                <p>
                  <span style={{ fontSize: "25px" }}>أولا :</span>
                  الموافقة على بيع الزائدة التنظيمية البالغ مساحتها (
                  {convertToArabic(zayda_area)}) م۲ الحاصلة على{" "}
                  {land_num?.split("-")?.length > 1
                    ? "القطع أرقام"
                    : "القطعة رقم"}{" "}
                  <span style={{ fontSize: "25px" }}>
                    ({convertToArabic(land_num)}){" "}
                    {wasf_taksem != null &&
                    ["منطقة", "فئة", "مركز الحى"].some((el) =>
                      wasf_taksem.includes(el)
                    )
                      ? taksem
                          .replace("منطقة", "")
                          .replace("فئة", "")
                          .replace("مركز الحى", "")
                      : taksem != null
                      ? taksem
                      : ""}
                    {" - "} {wasf_taksem != null ? wasf_taksem : ""} من المخطط
                    رقم ({convertToArabic(mo5atat)}){" "}
                  </span>
                  الواقعة في {el7ay} بمدينة {mun} والعائدة {name} بموجب{" "}
                  {(sakObj.length > 1 && "الصكوك") || "الصك"} رقم
                  <span style={{ fontSize: "30px" }}>
                    {" "}
                    {sakObj
                      .map((sak, index) => convertToArabic(sak.number))
                      .join(" - ")}{" "}
                    بتاريخ
                  </span>{" "}
                  <span>
                    {sakObj
                      .map((sak, index) => convertToArabic(sak.date))
                      .join(" - ")}
                  </span>
                  هـ والتى تم استيفاء قيمتها بموجب فاتورة سداد رقم{" "}
                  {convertToArabic(invoice)} .{" "}
                </p>
                <p>
                  <span style={{ fontSize: "25px" }}>ثانيا :</span> يبلغ أصل هذا
                  القرار ومشفوعاته لمدير إدارة الأراضي والممتلكات لإستكـمال
                  الإجـراءات اللازمة نحو تنفيذه وإكـمال مخاطبة كـتابة العدل.
                </p>
                <div
                  style={{
                    margin: "20px",

                    display: "grid",
                    gridGap: "15px",
                  }}
                  className="kara_amin_sig"
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    {
                      // committee_report_no &&
                      is_paid == 1 && province_id !== null && (
                        <div>
                          <img
                            src={`${filesHost}/users/${
                              approve_references || committeeactors3_id
                            }/sub_sign.png`}
                            width="50px"
                          />
                        </div>
                      )
                    }
                    {
                      // committeeactors2.is_approved &&
                      // committee_report_no &&
                      is_paid == 1 && province_id !== null && (
                        <div style={{ marginLeft: "10vw" }}>
                          <img
                            src={`${filesHost}/users/${committeeactors2_id}/sub_sign.png`}
                            width="50px"
                          />
                        </div>
                      )
                    }
                  </div>
                  <div
                    style={{
                      justifySelf: "flex-end",
                      gridGap: "20px",
                      display: "grid",
                      direction: "ltr",
                    }}
                  >
                    <h5 style={{ fontWeight: "bold", fontSize: "35px" }}>
                      {/* أمين المنطقة الشرقية */}
                      {committeeactors1?.position}
                    </h5>
                    <h5
                      style={{
                        marginLeft: "290px",
                        fontWeight: "bold",
                        fontSize: "35px",
                        direction: "ltr",
                      }}
                    >
                      {" "}
                      / المهندس
                    </h5>
                    <h5
                      style={{
                        margin: "-90px 20px 0px 50px",
                      }}
                    >
                      <img
                        src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                        width="150px"
                      />
                    </h5>
                    <h5 style={{ fontWeight: "bold", fontSize: "35px" }}>
                      {/* فهد بن محمد الجبير */}
                      {committeeactors1?.name}
                    </h5>
                  </div>
                  <h5
                    style={{
                      textDecoration: "underline",
                      fontWeight: "bold",
                      color: "red",
                      textAlign: "right",
                      position: "absolute",
                      bottom: "1vh",
                      width: "100%",
                      right: "1vw",
                    }}
                  >
                    نعمل مـعـا عـلـي تعزيز كــفـاءة الإنـفـاق
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
