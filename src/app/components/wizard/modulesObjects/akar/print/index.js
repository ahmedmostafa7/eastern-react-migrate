import React, { Component } from "react";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import { get } from "lodash";
import axios from "axios";
import MapComponent from "../../../../inputs/fields/identify/Component/MapComponent/MapComponent";
import {
  highlightFeature,
  addGraphicToLayer,
  zoomToLayer,
  checkImage,
  loadCurrentPlan,
  projectWithPromise,
} from "../../../../inputs/fields/identify/Component/common/common_func";
import {
  convertToArabic,
  selectActors,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
export default class Takdeer extends Component {
  state = { data: {}, mainObject: {} };
  constructor(props) {
    super(props);
    this.map1Loaded = false;
    this.map2Loaded = false;
  }
  gmod(n, m) {
    return ((n % m) + m) % m;
  }

  kuwaiticalendar(adjust) {
    var today = new Date();
    if (adjust) {
      let adjustmili = 1000 * 60 * 60 * 24 * adjust;
      let todaymili = today.getTime() + adjustmili;
      today = new Date(todaymili);
    }
    let day = today.getDate();
    let month = today.getMonth();
    let year = today.getFullYear();
    let m = month + 1;
    let y = year;
    if (m < 3) {
      y -= 1;
      m += 12;
    }

    let a = Math.floor(y / 100);
    let b = 2 - a + Math.floor(a / 4);
    if (y < 1583) b = 0;
    if (y == 1582) {
      if (m > 10) b = -10;
      if (m == 10) {
        b = 0;
        if (day > 4) b = -10;
      }
    }

    let jd =
      Math.floor(365.25 * (y + 4716)) +
      Math.floor(30.6001 * (m + 1)) +
      day +
      b -
      1524;

    b = 0;
    if (jd > 2299160) {
      a = Math.floor((jd - 1867216.25) / 36524.25);
      b = 1 + a - Math.floor(a / 4);
    }
    let bb = jd + b + 1524;
    let cc = Math.floor((bb - 122.1) / 365.25);
    let dd = Math.floor(365.25 * cc);
    let ee = Math.floor((bb - dd) / 30.6001);
    day = bb - dd - Math.floor(30.6001 * ee);
    month = ee - 1;
    if (ee > 13) {
      cc += 1;
      month = ee - 13;
    }
    year = cc - 4716;

    let wd = this.gmod(jd + 1, 7) + 1;

    let iyear = 10631 / 30;
    let epochastro = 1948084;
    let epochcivil = 1948085;

    let shift1 = 8.01 / 60;

    let z = jd - epochastro;
    let cyc = Math.floor(z / 10631);
    z = z - 10631 * cyc;
    let j = Math.floor((z - shift1) / iyear);
    let iy = 30 * cyc + j;
    z = z - Math.floor(j * iyear + shift1);
    let im = Math.floor((z + 28.5001) / 29.5);
    if (im == 13) im = 12;
    let id = z - Math.floor(29.5001 * im - 29);

    var myRes = new Array(8);

    myRes[0] = day; //calculated day (CE)
    myRes[1] = month - 1; //calculated month (CE)
    myRes[2] = year; //calculated year (CE)
    myRes[3] = jd - 1; //julian day number
    myRes[4] = wd - 1; //weekday number
    myRes[5] = id; //islamic date
    myRes[6] = im - 1; //islamic month
    myRes[7] = iy; //islamic year

    return myRes;
  }
  writeIslamicDate(adjustment) {
    var iDate = this.kuwaiticalendar(adjustment);
    var outputIslamicDate =
      iDate[5] - 1 + "/" + (iDate[6] + 1) + "/" + iDate[7];
    return outputIslamicDate;
  }
  componentDidMount() {
    axios
      .get(workFlowUrl + "/api/Submission/" + this.props.params.id)
      .then(({ data }) => {
        let submission = data;
        axios
          .get(backEndUrlforMap + data.submission_file_path + "mainObject.json")
          .then(async (data) => {
            console.log(data.data);
            data.data =
              (typeof data.data == "string" &&
                JSON.parse(window.lzString.decompressFromBase64(data.data))) ||
              data.data;
            var mainObject = data.data;
            // let report_no = " " + submission.committee_report_no;
            let request_no = " " + submission.request_no;
            let loc_name = mainObject["landData"]["akar_data"]["loc_name"];
            let desc = mainObject["landData"]["akar_data"]["desc"];
            let number = mainObject["landData"]["akar_data"]["number"];
            let price = mainObject["landData"]["akar_data"]["price"];
            let using = mainObject["landData"]["akar_data"]["using"];

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

            let municipality =
              mainObject["landData"]["landData"]["lands"]["parcels"][0][
                "attributes"
              ]["MUNICIPALITY_NAME"];
            let district =
              mainObject["landData"]["landData"]["lands"]["parcels"][0][
                "attributes"
              ]["DISTRICT_NAME"];
            let spatial_id =
              mainObject["landData"]["landData"]["lands"]["parcels"][0][
                "attributes"
              ]["PARCEL_SPATIAL_ID"];
            let area =
              mainObject["landData"]["landData"]["lands"]["parcels"][0][
                "attributes"
              ]["PARCEL_AREA"];
            let coordinates =
              mainObject["landData"] &&
              (await projectWithPromise(
                [
                  new esri.geometry.Polygon(
                    mainObject["landData"]["landData"]["lands"][
                      "parcels"
                    ][0].geometry
                  ),
                ],
                4326,
                null,
                false
              ));
            coordinates = new esri.geometry.Polygon(
              coordinates[0]
            ).getCentroid();
            let plan_num =
              mainObject["landData"]["landData"]["lands"]["parcels"][0][
                "attributes"
              ]["PLAN_NO"];
            let block_num =
              mainObject["landData"]["landData"]["lands"]["parcels"][0][
                "attributes"
              ]["PARCEL_BLOCK_NO"];
            let parcel_num =
              mainObject["landData"]["landData"]["lands"]["parcels"][0][
                "attributes"
              ]["PARCEL_PLAN_NO"];
            let subdivision =
              mainObject["landData"]["landData"]["lands"]["parcels"][0][
                "attributes"
              ]["SUBDIVISION_DESCRIPTION"];
            let lat =
              mainObject["landData"]["landData"]["lands"]["parcels"][0][
                "attributes"
              ]["PARCEL_LAT_COORD"];
            let long =
              mainObject["landData"]["landData"]["lands"]["parcels"][0][
                "attributes"
              ]["PARCEL_LONG_COORD"];
            let date =
              mainObject["sakData"]["sakData"] &&
              mainObject["sakData"]["sakData"]["saks"][
                Object.keys(mainObject["sakData"]["sakData"]["saks"])[0]
              ]["date"];
            let issuer =
              mainObject["sakData"]["sakData"] &&
              mainObject["sakData"]["sakData"]["saks"][
                Object.keys(mainObject["sakData"]["sakData"]["saks"])[0]
              ]["issuer"];
            let sak_num =
              mainObject["sakData"]["sakData"] &&
              mainObject["sakData"]["sakData"]["saks"][
                Object.keys(mainObject["sakData"]["sakData"]["saks"])[0]
              ]["number"];

            let feature =
              mainObject["landData"]["landData"]["lands"]["parcels"][0];

            let points = feature.geometry.rings[0].map((f) => {
              return { x: f[0], y: f[1] };
            });
            points.splice(-1, 1);

            let north_desc = mainObject["landData"]["submission_data"][
              "parcel_data"
            ]
              ? mainObject["landData"]["submission_data"]["parcel_data"][
                  "fields"
                ]["north_desc"].value
              : mainObject["landData"]["submission_data"]["north_desc"];
            let north_length = mainObject["landData"]["submission_data"][
              "parcel_data"
            ]
              ? mainObject["landData"]["submission_data"]["parcel_data"][
                  "fields"
                ]["north_length"].value
              : mainObject["landData"]["submission_data"]["north_length"];
            let south_desc = mainObject["landData"]["submission_data"][
              "parcel_data"
            ]
              ? mainObject["landData"]["submission_data"]["parcel_data"][
                  "fields"
                ]["south_desc"].value
              : mainObject["landData"]["submission_data"]["south_desc"];
            let south_length = mainObject["landData"]["submission_data"][
              "parcel_data"
            ]
              ? mainObject["landData"]["submission_data"]["parcel_data"][
                  "fields"
                ]["south_length"].value
              : mainObject["landData"]["submission_data"]["south_length"];
            let east_desc = mainObject["landData"]["submission_data"][
              "parcel_data"
            ]
              ? mainObject["landData"]["submission_data"]["parcel_data"][
                  "fields"
                ]["east_desc"].value
              : mainObject["landData"]["submission_data"]["east_desc"];
            let east_length = mainObject["landData"]["submission_data"][
              "parcel_data"
            ]
              ? mainObject["landData"]["submission_data"]["parcel_data"][
                  "fields"
                ]["east_length"].value
              : mainObject["landData"]["submission_data"]["east_length"];
            let west_desc = mainObject["landData"]["submission_data"][
              "parcel_data"
            ]
              ? mainObject["landData"]["submission_data"]["parcel_data"][
                  "fields"
                ]["west_desc"].value
              : mainObject["landData"]["submission_data"]["west_desc"];
            let west_length = mainObject["landData"]["submission_data"][
              "parcel_data"
            ]
              ? mainObject["landData"]["submission_data"]["parcel_data"][
                  "fields"
                ]["west_length"].value
              : mainObject["landData"]["submission_data"]["west_length"];
            let approvedUrl =
              mainObject["landData"]["submission_data"]["approvedUrl"];
            this.setState({
              loc_name,
              feature,
              desc,
              number,
              points,
              price,
              north_desc,
              north_length,
              south_desc,
              south_length,
              east_desc,
              east_length,
              west_desc,
              west_length,
              using,
              date,
              issuer,
              sak_num,
              // report_no,
              request_no,
              municipality,
              district,
              spatial_id,
              area,
              coordinates,
              plan_num,
              block_num,
              parcel_num,
              subdivision,
              lat,
              long,
              committeeactors1_id,
              committeeactors2_id,
              committeeactors3_id,
              // committeeactors_dynamica_id,
              committeeactors1,
              committeeactors2,
              committeeactors3,
              approvedUrl,
              mainObject,
            });
          });
      });
  }

  mapLoadedMap1(mainObject, feature, map) {
    // map.on("load", function (err) {
    //   console.log(2);
    //
    //   if (!this.map1Loaded) {
    //     this.map1Loaded = true;
    if (!mainObject?.landData?.landData?.lands?.mapGraphics?.length) {
      setTimeout(() => {
        if (feature && map) {
          addGraphicToLayer(
            feature,
            map,
            "ZoomGraphicLayer",
            null,
            null,
            true,
            (graphic) => {}
          );
        }
      }, 1000);
    } else {
      loadCurrentPlan(
        this.props,
        map,
        mainObject?.landData?.landData?.lands?.mapGraphics || null,
        true
      );
    }
    //   }
    // });

    map.getLayer("ZoomGraphicLayer").on("graphic-add", (evt) => {
      map.setExtent(esri.graphicsExtent([evt.graphic]));
    });
  }

  mapLoadedMap2(mainObject, feature, map) {
    // highlightFeature(feature, map, {
    //   isZoom: true,
    //   layerName: "ZoomGraphicLayer",
    //   //zoomFactor: 8,
    // });

    //     map.on("load", function (err) {
    //       console.log(2);
    //
    //       if (!this.map2Loaded) {
    //         this.map2Loaded = true;
    if (!mainObject?.landData?.landData?.lands?.mapGraphics?.length) {
      setTimeout(() => {
        if (feature && map) {
          addGraphicToLayer(
            feature,
            map,
            "ZoomGraphicLayer",
            null,
            null,
            true,
            (graphic) => {}
          );
        }
      }, 1000);
    } else {
      loadCurrentPlan(
        this.props,
        map,
        mainObject?.landData?.landData?.lands?.mapGraphics || null,
        true
      );
    }
    //   }
    // });

    map.getLayer("ZoomGraphicLayer").on("graphic-add", (evt) => {
      map.setExtent(esri.graphicsExtent([evt.graphic]));
    });
  }
  convertEnglishToArabic(english) {
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
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    const {
      loc_name,
      desc,
      number,
      price,
      north_desc,
      north_length,
      south_desc,
      south_length,
      east_desc,
      east_length,
      west_desc,
      west_length,
      using,
      date,
      issuer,
      sak_num,
      municipality,
      district,
      spatial_id,
      area,
      coordinates,
      plan_num,
      block_num,
      parcel_num,
      points,
      subdivision,
      lat,
      long,
      // report_no,
      request_no,
      feature,
      committeeactors1_id = "",
      committeeactors2_id = "",
      committeeactors3_id = "",
      // committeeactors_dynamica_id = "",
      committeeactors1 = {},
      committeeactors2 = {},
      committeeactors3 = {},
      approvedUrl = "",
      mainObject,
    } = this.state;

    return (
      <>
        <div
          className="table-report-container"
          style={{ paddingTop: 0, zoom: ".85" }}
        >
          {/* <Header /> */}
          <div className="">
            <div
              style={{
                display: "grid",
                justifyContent: "flex-end",
              }}
            >
              <button
                className="btn btn-warning hidd"
                onClick={() => {
                  window.print();
                }}
              >
                طباعة
              </button>
            </div>
            <div
              style={{
                height: "75vh",

                margin: "10px",
                // overflow: "visible"
              }}
              className="content-temp akar"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 1fr ",
                  border: "1px solid",
                  alignItems: "center",
                  justifyItems: "center",
                  gridGap: "10px",
                }}
              >
                <div>
                  <h4
                    style={{
                      display: "grid",
                      lineHeight: "1.5",
                      textAlign: "right",
                      marginRight: "15px",
                    }}
                  >
                    <span>المملكة العربية السعودية </span>
                    <span>وزارة الشئون البلدية والقروية والإسكان</span>
                    <span>أمانة المنطقة الشرقية</span>
                    <span>الإدارة العامة للأراضي والممتلكات</span>
                  </h4>
                </div>
                <div>
                  <div style={{ justifySelf: "center", textAlign: "center" }}>
                    <img
                      src="images/logo2.png"
                      style={{ width: "75px" }}
                      alt=""
                    />
                    <h2
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        margin: 0,
                      }}
                    >
                      وثيقة ممتلك عقار بلدي
                    </h2>
                    <div style={{ display: "flex", gridGap: "10px" }}>
                      <p
                        style={{
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          marginRight: "30px",
                        }}
                      >
                        رقم الوثيقة {convertToArabic(request_no)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="middle-title">
                  <img src="images/saudiVision.png" width="150px" />
                </div>
              </div>

              {/* <br /> */}
              <p style={{ textDecoration: "underline", textAlign: "right" }}>
                بيانات الموقع :
              </p>
              <table className="table table-bordered">
                {/* <tr>
                  <td>المميز المكاني</td>
                  <td colSpan="5">{spatial_id}</td>
                </tr> */}
                <tr>
                  <td>المحافظة / البلدية</td>
                  <td>{municipality || "-------"}</td>
                  <td>اسم البلدية</td>
                  <td>{municipality || "-------"}</td>
                  <td> اسم الحي</td>
                  <td>{district || "-------"}</td>
                </tr>
                <tr>
                  <td>رقم المخطط</td>
                  <td>{convertToArabic(plan_num || "-------")}</td>
                  <td>اسم الموقع</td>
                  <td>{loc_name || "-------"}</td>
                  <td>وصف العقار</td>
                  <td>{desc || "-------"}</td>
                </tr>
                <tr>
                  <td>المجاورة</td>
                  <td>{subdivision || "-------"}</td>
                  <td>رقم البلك</td>
                  <td>{convertToArabic(block_num || "-------")}</td>
                  <td>رقم القطعة </td>
                  <td>{convertToArabic(parcel_num || "-------")}</td>
                </tr>
                <tr>
                  <td>نوع الاستعمال</td>
                  <td>{using || "-------"}</td>
                  <td>رقم المبني</td>
                  <td>{convertToArabic(number || "-------")}</td>
                  {price && <td> القيمة التقديرية للمتر المربع </td>}
                  {price && <td>{convertToArabic(price || "-------")}</td>}
                </tr>
                <tr>
                  <td>المساحة (م۲)</td>
                  <td>{convertToArabic(area)}</td>
                  <td>X</td>
                  <td>
                    {convertToArabic(coordinates?.x?.toFixed(6)) || "-------"}
                  </td>
                  <td>Y</td>
                  <td>
                    {convertToArabic(coordinates?.y?.toFixed(6)) || "-------"}
                  </td>
                </tr>
              </table>
              {sak_num && (
                <p style={{ textDecoration: "underline", textAlign: "right" }}>
                  بيانات الصك :
                </p>
              )}
              {sak_num && (
                <table className="table table-bordered">
                  <tr>
                    <th>رقم الصك</th>
                    <th>تاريخ الصك</th>
                    <th>مساحة الصك (م۲)</th>
                    <th>مصدر الصك</th>
                  </tr>
                  <tr>
                    <td>{convertToArabic(sak_num)}</td>
                    <td>{convertToArabic(date)} هـ</td>
                    {/* <td>{convertToArabic(date)}</td> */}
                    <td>{convertToArabic(area)}</td>
                    <td>{issuer}</td>
                  </tr>
                  {/* <tr>
                  <td>مصدر الصك</td>
                  <td>{issuer}</td>
                  <td>اسم الموقع</td>
                  <td colSpan="3">{loc_name}</td>
                </tr> */}
                </table>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridGap: "10px",
                }}
              >
                <div>
                  <p
                    style={{ textDecoration: "underline", textAlign: "right" }}
                  >
                    إحداثيات أركان الموقع UTM :
                  </p>
                  <table className="table table-bordered">
                    <thead>
                      <th>م </th>
                      <th>شرقيات </th>
                      <th>شماليات</th>
                    </thead>
                    <tbody>
                      {points &&
                        points.map((point, i) => {
                          return (
                            <tr key={i}>
                              <td>{convertToArabic(i + 1)}</td>
                              <td>{convertToArabic(point.x.toFixed(5))}</td>
                              <td>{convertToArabic(point.y.toFixed(5))}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div>
                  <p
                    style={{ textDecoration: "underline", textAlign: "right" }}
                  >
                    بيانات الحدود و الأطوال من الصك:
                  </p>
                  <table className="table table-bordered">
                    <thead>
                      <th> الإتجاهات</th>
                      <th>وصف الحدود</th>
                      <th>الأطوال (م)</th>
                    </thead>
                    <tr>
                      <td>الشمالي</td>
                      <td>{convertToArabic(north_desc)}</td>
                      <td>{convertToArabic(north_length)}</td>
                    </tr>
                    <tr>
                      <td>الجنوبي</td>
                      <td>{convertToArabic(south_desc)}</td>
                      <td>{convertToArabic(south_length)}</td>
                    </tr>
                    <tr>
                      <td>الشرقي</td>
                      <td>{convertToArabic(east_desc)}</td>
                      <td>{convertToArabic(east_length)}</td>
                    </tr>
                    <tr>
                      <td>الغربي</td>
                      <td>{convertToArabic(west_desc)}</td>
                      <td>{convertToArabic(west_length)}</td>
                    </tr>
                  </table>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "50% 50%",
                  zoom: ".65",
                  gridGap: "20px",
                  padding: "20px",
                }}
                className="akarMapPrint"
              >
                <div style={{ width: "100%" }}>
                  <p
                    style={{ textDecoration: "underline", textAlign: "right" }}
                  >
                    كروكي الموقع :
                  </p>
                  {feature && (
                    <MapComponent
                      // style={{ width: "50vw" }}
                      id="map1"
                      mapId="map1"
                      mapload={this.mapLoadedMap1.bind(
                        this,
                        mainObject,
                        feature
                      )}
                    ></MapComponent>
                  )}
                  {/* {checkImage(this.props, approvedUrl, {})} */}
                </div>
                <div style={{ width: "100%" }}>
                  <p
                    style={{ textDecoration: "underline", textAlign: "right" }}
                  >
                    كروكي الموقع العام :
                  </p>
                  {feature && (
                    <MapComponent
                      // style={{ width: "50vw" }}
                      id="map2"
                      mapId="map2"
                      mapload={this.mapLoadedMap2.bind(
                        this,
                        mainObject,
                        feature
                      )}
                    ></MapComponent>
                  )}
                </div>
              </div>
              <div className="sig">
                {/* <p>تاريخ اعداد الوثيقة : {this.writeIslamicDate()} </p> */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p>اسم المساح</p>
                    {/* <p style={{ textAlign: "center" }}>
                      {mainObject?.survey_user?.survUser?.id && province_id && (
                        <img
                          src={`${filesHost}/users/${mainObject?.survey_user?.survUser?.id}/sign.png`}
                          width="150px"
                        />
                      )}
                    </p>
                    <p>{mainObject?.survey_user?.name || ""}</p> */}
                  </div>
                  <div>
                    <p>رئيس البلدية</p>
                    {/* <p>{mainObject?.munplan_manager_user?.munPlanSurvUser?.positions?.name}</p>
                    <p style={{ textAlign: "center" }}>
                      {mainObject?.munplan_manager_user?.munPlanSurvUser && province_id && (
                        <img
                          src={`${filesHost}/users/${mainObject?.munplan_manager_user?.munPlanSurvUser?.id}/sign.png`}
                          width="150px"
                        />
                      )}
                    </p>
                    <p>{mainObject?.munplan_manager_user?.name || ""}</p> */}
                  </div>
                  <div>
                    <p>مدير عام الأراضي والممتلكات</p>
                    {/* <p>{committeeactors1.position}</p>
                    <p style={{ textAlign: "center" }}>
                      {committeeactors1?.is_approved && province_id && (
                        <img
                          src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                          width="150px"
                        />
                      )}
                    </p>
                    <p style={{ textAlign: "center" }}>{committeeactors1.name}</p> */}
                  </div>
                  <div>
                    <p>يعتمد / أمين المنطقة الشرقية</p>
                    {/* <p>يعتمد / {committeeactors2.position}</p> */}
                    <p style={{ marginLeft: "250px" }}>المهندس /</p>
                    {/* <p style={{ marginLeft: "50px", marginTop: "10px" }}>
                      {committeeactors2?.is_approved && province_id && (
                        <img
                          src={`${filesHost}/users/${committeeactors2_id}/sign.png`}
                          width="150px"
                        />
                      )}
                    </p>
                    <p>{committeeactors2.name}</p> */}
                    <p>فهد بن محمد الجبير</p>
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
