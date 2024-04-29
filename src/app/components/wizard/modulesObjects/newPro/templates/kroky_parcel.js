import React, { Component } from "react";
import {
  workFlowUrl,
  backEndUrlforMap,
  host,
  filesHost,
} from "../../../../../../imports/config";
import { get } from "lodash";
import { convertToArabic } from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import axios from "axios";

export default class LangnaFaneh extends Component {
  state = { name: "" };
  componentDidMount() {
    let self = this;
    axios
      .get(workFlowUrl + "/api/Submission/" + this.props.match.params.id)
      .then(({ data }) => {
        console.log("s", data);
        let commite_date = data["committee_date"];
        let commite_num = data["committee_report_no"];
        let submission = data;
        axios
          .get(backEndUrlforMap + data.submission_file_path + "mainObject.json")
          .then((data) => {
            console.log("Ff", data);
            data.data =
              (typeof data.data == "string" &&
                JSON.parse(window.lzString.decompressFromBase64(data.data))) ||
              data.data;
            var mainObject = data.data;

            let aParcelArea = mainObject["landData"]["landData"]["lands"][
              "parcels"
            ].reduce((sum, cur) => sum + +cur.attributes.PARCEL_AREA, 0);

            let parcel_area = aParcelArea;

            let PARCEL_MAIN_LUSE =
              mainObject["landData"]["landData"]["lands"]["parcels"][0]
                .attributes.PARCEL_MAIN_LUSE;

            let parcels = mainObject["suggestParcel"]["suggestParcel"][
              "suggestParcels"
            ]["polygons"].filter((p) => {
              return (
                (p.polygon && p.polygon.layer == "boundry") ||
                (p.layerName && p.layerName == "boundry")
              );
            });

            let all_natural_area =
              [
                ...(mainObject["suggestParcel"]["suggestParcel"][
                  "suggestParcels"
                ]["polygons"].find((p) => {
                  return (
                    (p.polygon && p.polygon.layer == "full_boundry") ||
                    (p.layerName && p.layerName == "full_boundry")
                  );
                }) ||
                  mainObject["suggestParcel"]["suggestParcel"][
                    "suggestParcels"
                  ]["polygons"].filter((p) => {
                    return (
                      (p.polygon && p.polygon.layer == "boundry") ||
                      (p.layerName && p.layerName == "boundry")
                    );
                  })),
              ]?.reduce((a, b) => {
                return (
                  a +
                  (+b.area -
                    (+b.electricArea || 0) -
                    (+b.shtfa_northeast || 0) -
                    (+b.shtfa_northweast || 0) -
                    (+b.shtfa_southeast || 0) -
                    (+b.shtfa_southweast || 0))
                );
              }, 0) || 0;
            
            // let allArea = mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
            //   "polygons"
            // ].reduce(function (acc, obj) { return acc + (+obj.area); }, 0);

            // let plusArea = mainObject["suggestParcel"]["suggestParcel"][
            //   "suggestParcels"
            // ]["polygons"].find((p) => {
            //   return (
            //     (p.polygon && p.polygon.layer == "plus") ||
            //     p.layerName == "notPlus"
            //   );
            // }).area;

            // let all_zayda_area =
            //   plusArea -
            //   (+mainObject["suggestParcel"]["suggestParcel"]["electricArea"] ||
            //     0) -
            //   (+parcels.shtfa_northeast || 0) -
            //   (+parcels.shtfa_northweast || 0) -
            //   (+parcels.shtfa_southeast || 0) -
            //   (+parcels.shtfa_southweast || 0);

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

            this.setState({
              parcel_area,
              all_natural_area,
              PARCEL_MAIN_LUSE,
              // allArea,
              // plusArea,
              // all_zayda_area,
              zayda_area,
              mainObject,
            });
          });
      });
  }
  convertDateEnglishToArabic(english) {
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
  convertEnglishToArabic(english) {
    english = english + "";
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
      parcel_area,
      PARCEL_MAIN_LUSE,
      all_natural_area,
      // allArea,
      // plusArea,
      // all_zayda_area,
      zayda_area,
      mainObject,
    } = this.state;
    return (
      <>
        {mainObject && (
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

                  margin: "10px",
                  // overflow: "visible"
                }}
                className="content-temp kroky_parcel"
              >
                <div style={{ height: "16vh" }}></div>

                <h2
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "25px",
                  }}
                >
                  بيانات موقع الزائدة التنظيمية
                </h2>
                <br />
                <div>
                  <img
                    src={
                      filesHost +
                      mainObject?.suggestParcel.suggestParcel.submission_data?.suggestionUrl
                    }
                    style={{ width: "100%" }}
                  />
                </div>
                <div
                  style={{
                    margin: "5px",
                    marginTop: "50px",
                    textAlign: "justify",
                  }}
                >
                  <h4>استخدام الأرض : {PARCEL_MAIN_LUSE}</h4>
                </div>
                <div style={{ margin: "5px", textAlign: "justify" }}>
                  <h4>
                    {" "}
                    المساحة حسب الطبيعة :{" "}
                    {convertToArabic(all_natural_area.toFixed(2))} م۲
                  </h4>
                </div>
                <div style={{ margin: "5px", textAlign: "justify" }}>
                  <h4> المساحة حسب الصك : {convertToArabic(parcel_area)} م۲</h4>
                </div>
                <div style={{ margin: "5px", textAlign: "justify" }}>
                  <h4>
                    مساحة الزائدة التنظيمية : {convertToArabic(zayda_area)} م۲
                    {/* {convertToArabic((zayda_area).toFixed(2))} م۲ */}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
