import React, { Component } from "react";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import axios from "axios";
import { get } from "lodash";
import main from "../../../../inputs/fields/calculator/main";
import SignPics from "../../../../editPrint/signPics";
import {
  convertToArabic,
  localizeNumber,
  selectActors,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import EditPrint from "app/components/editPrint";
import { QRCode } from "react-qr-svg";
import { initializeSubmissionData } from "main_helpers/functions/prints";
export default class Khetab extends Component {
  state = { name: "" };
  componentDidMount() {
    if (this.props.params.id) {
      initializeSubmissionData(this.props.params.id).then((response) => {
        var mainObject = response.mainObject;
        let ceator_user_name = response.ceator_user_name;
        let submission = response.submission;
        this.state["historydata"] = response.historyData;

        let invoice =
          submission["submission_invoices"]
            ?.map((invoice) => invoice.invoice_number)
            ?.join(", ") ||
          submission["invoice_number"] ||
          "";
        let invoice_date =
          submission["submission_invoices"]
            ?.map((invoice) => invoice.invoice_date)
            ?.join(", ") ||
          submission["invoice_date"] ||
          "";
        let request_no = submission["request_no"];
        let export_no = submission?.export_no;
        let export_date = submission?.export_date;
        let printId = this.props?.match?.params?.id;
        let actors = selectActors(submission, mainObject, [0]);
        let committeeActor = actors?.find((r) => r.index == 0);
        let committeeactors_dynamica_id = actors?.reduce(
          (b, a) => b && b?.concat(a?.id),
          []
        );
        let committee_report_no = get(submission, "committee_report_no", "");
        let is_paid =
          submission?.submission_invoices?.filter(
            (invoice) => invoice?.is_paid == true
          )?.length == submission?.submission_invoices?.length ||
          submission.is_paid;
        var owners = Object.keys(mainObject?.ownerData?.ownerData?.owners).map(
          (ownerKey) => {
            return {
              owner_name:
                mainObject?.ownerData?.ownerData?.owners[ownerKey].name,
              identity: localizeNumber(
                mainObject?.ownerData?.ownerData?.owners[ownerKey].ssn ||
                  mainObject?.ownerData?.ownerData?.owners[ownerKey]
                    .code_regesteration ||
                  mainObject?.ownerData?.ownerData?.owners[ownerKey]
                    .commercial_registeration
              ),
              identity_label:
                (mainObject?.ownerData?.ownerData?.owners[ownerKey].ssn &&
                  "رقم السجل المدني") ||
                (mainObject?.ownerData?.ownerData?.owners[ownerKey]
                  .code_regesteration &&
                  "كود الجهة") ||
                (mainObject?.ownerData?.ownerData?.owners[ownerKey]
                  .commercial_registeration &&
                  "السجل التجاري"),
            };
          }
        );
        let land_num = this.convertEnglishToArabic(
          mainObject["landData"]["landData"]["lands"]["parcels"]
            ?.map((parcel) => parcel.attributes.PARCEL_PLAN_NO)
            ?.join(" - ")
        );

        let block_num =
          (mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
            .PARCEL_BLOCK_NO != null &&
            this.convertEnglishToArabic(
              mainObject["landData"]["landData"]["lands"]["parcels"][0]
                .attributes.PARCEL_BLOCK_NO
            )) ||
          null;
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
        let ketab_3adl = get(Object.values(sakObj)[0], "issuer");
        //console.log("dd", sakObj, ketab_3adl);
        let taksem =
          mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
            .SUBDIVISION_TYPE;
        let wasf_taksem =
          mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes
            .SUBDIVISION_DESCRIPTION;
        // let karar_date = this.convertEnglishToArabic(
        //   mainObject["krar_amin"]["karar_amin"].date_krar
        // );
        // let karar_num = this.convertEnglishToArabic(
        //   mainObject["krar_amin"]["karar_amin"].num_krar
        // );

        let allArea = mainObject["landData"]["landData"]["lands"][
          "parcels"
        ].reduce((sum, cur) => sum + +cur.attributes.PARCEL_AREA, 0);
        let allNaturalArea = mainObject["landData"]["landData"]["lands"][
          "parcels"
        ].reduce((sum, cur) => sum + +cur.attributes.Natural_Area, 0);

        let sak_area = allArea.toFixed(2) + "";
        let sak_natural_area = this.convertEnglishToArabic(
          allNaturalArea.toFixed(2) + ""
        );
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
        //       Object.values(shatfa_array).reduce((a, b) => a + b, 0) ||
        //       0);
        // if (Number(shatfa_lengths) > Number(zayda_area)) {
        //   shatfa_lengths = 0;
        // }
        // zayda_area = Number(zayda_area) - shatfa_lengths;
        // zayda_area = zayda_area.toFixed(2);
        // zayda_area = this.convertEnglishToArabic(zayda_area);
        // console.log("شطفات", shatfa_lengths);
        /*نهاية الشطفات*/

        let zayda_text = mainObject["suggestParcel"]["suggestParcel"][
          "suggestParcels"
        ]["polygons"].filter((p) => {
          return (
            p.layerName &&
            ["boundry", "full_boundry"].indexOf(p.layerName) == -1
          );
        })[0].parcel_area_desc;

        // let north = this.convertEnglishToArabic(
        //   [
        //     mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
        //       "polygons"
        //     ].find((p) => {
        //       return (
        //         (p.polygon && p.polygon.layer == "full_boundry") ||
        //         (p.layerName && p.layerName == "full_boundry")
        //       );
        //     }) ||
        //       mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
        //         "polygons"
        //       ].find((p) => {
        //         return (
        //           (p.polygon && p.polygon.layer == "boundry") ||
        //           (p.layerName && p.layerName == "boundry")
        //         );
        //       }),
        //   ]
        //     ?.reduce((a, b) => a + +b["data"][0].totalLength, 0)
        //     ?.toFixed(2) || 0
        // );
        // let south = this.convertEnglishToArabic(
        //   [
        //     mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
        //       "polygons"
        //     ].find((p) => {
        //       return (
        //         (p.polygon && p.polygon.layer == "full_boundry") ||
        //         (p.layerName && p.layerName == "full_boundry")
        //       );
        //     }) ||
        //       mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
        //         "polygons"
        //       ].find((p) => {
        //         return (
        //           (p.polygon && p.polygon.layer == "boundry") ||
        //           (p.layerName && p.layerName == "boundry")
        //         );
        //       }),
        //   ]
        //     ?.reduce((a, b) => a + +b["data"][4].totalLength, 0)
        //     ?.toFixed(2) || 0
        // );
        // let east = this.convertEnglishToArabic(
        //   [
        //     mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
        //       "polygons"
        //     ].find((p) => {
        //       return (
        //         (p.polygon && p.polygon.layer == "full_boundry") ||
        //         (p.layerName && p.layerName == "full_boundry")
        //       );
        //     }) ||
        //       mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
        //         "polygons"
        //       ].find((p) => {
        //         return (
        //           (p.polygon && p.polygon.layer == "boundry") ||
        //           (p.layerName && p.layerName == "boundry")
        //         );
        //       }),
        //   ]
        //     ?.reduce((a, b) => a + +b["data"][1].totalLength, 0)
        //     ?.toFixed(2) || 0
        // );
        // let west = this.convertEnglishToArabic(
        //   [
        //     mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
        //       "polygons"
        //     ].find((p) => {
        //       return (
        //         (p.polygon && p.polygon.layer == "full_boundry") ||
        //         (p.layerName && p.layerName == "full_boundry")
        //       );
        //     }) ||
        //       mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
        //         "polygons"
        //       ].find((p) => {
        //         return (
        //           (p.polygon && p.polygon.layer == "boundry") ||
        //           (p.layerName && p.layerName == "boundry")
        //         );
        //       }),
        //   ]
        //     ?.reduce((a, b) => a + +b["data"][3].totalLength, 0)
        //     ?.toFixed(2) || 0
        // );
        // let north_det = get(
        //   mainObject,
        //   "landData.submission_data.north_desc",
        //   ""
        // );
        // let south_det = get(
        //   mainObject,
        //   "landData.submission_data.south_desc",
        //   ""
        // );
        // let east_det = get(
        //   mainObject,
        //   "landData.submission_data.east_desc",
        //   ""
        // );
        // let west_det = get(
        //   mainObject,
        //   "landData.submission_data.west_desc",
        //   ""
        // );

        let land_area =
          mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
            "polygons"
          ][0].area;
        let area_desc =
          mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
            "polygons"
          ][0].parcel_area_desc;
        // let parcel = mainObject["suggestParcel"]["suggestParcel"][
        //   "suggestParcels"
        // ]["polygons"].filter((p) => {
        //   return (
        //     (p.polygon && p.polygon.layer == "boundry") ||
        //     (p.layerName && p.layerName == "boundry")
        //   );
        // })[0];

        let total = mainObject["ma7dar"]["ma7dar_mola5s"].declaration;
        let total_area = +(
          [
            ...(mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
              "polygons"
            ].find((p) => {
              return (
                (p.polygon && p.polygon.layer == "full_boundry") ||
                (p.layerName && p.layerName == "full_boundry")
              );
            }) ||
              mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
                "polygons"
              ].filter((p) => {
                return (
                  (p.polygon && p.polygon.layer == "boundry") ||
                  (p.layerName && p.layerName == "boundry")
                );
              })),
          ]
            ?.reduce(
              (a, b) =>
                a +
                +(
                  b.area -
                  (+b.electricArea || 0) -
                  (+b.shtfa_northeast || 0) -
                  (+b.shtfa_northweast || 0) -
                  (+b.shtfa_southeast || 0) -
                  (+b.shtfa_southweast || 0)
                ).toFixed(2),
              0
            )
            ?.toFixed(2) || "0"
        );

        //total_area = total_area + "";
        // let total_area_letters = [
        //   mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
        //     "polygons"
        //   ].find((p) => {
        //     return (
        //       (p.polygon && p.polygon.layer == "full_boundry") ||
        //       (p.layerName && p.layerName == "full_boundry")
        //     );
        //   }) ||
        //     mainObject["suggestParcel"]["suggestParcel"]["suggestParcels"][
        //       "polygons"
        //     ].find((p) => {
        //       return (
        //         (p.polygon && p.polygon.layer == "boundry") ||
        //         (p.layerName && p.layerName == "boundry")
        //       );
        //     }),
        // ]?.[0]?.parcel_area_desc;

        let total_letters =
          mainObject["ma7dar"]["ma7dar_mola5s"].text_declaration;
        let meter_price = this.convertEnglishToArabic(
          mainObject["ma7dar"]["ma7dar_mola5s"].meter_price
        );
        let meter_text = mainObject["ma7dar"]["ma7dar_mola5s"].text_meter;
        let mun =
          mainObject["landData"]["landData"]["lands"]["parcels"][0].attributes[
            "MUNICIPALITY_NAME"
          ];

        // let north_text = mainObject["land_bound"]["bound"].north;
        // let south_text = mainObject["land_bound"]["bound"].south;
        // let east_text = mainObject["land_bound"]["bound"].east;
        // let west_text = mainObject["land_bound"]["bound"].west_text;
        let polygons;
        if (
          mainObject?.land_bound?.bound &&
          !mainObject?.land_bound?.bound?.parcels_bounds
        ) {
          polygons = [
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
          ];
          if (mainObject?.land_bound?.bound?.north && polygons) {
            polygons[0].north = mainObject?.land_bound?.bound?.north;
          }
          if (mainObject?.land_bound?.bound?.south && polygons) {
            polygons[0].south = mainObject?.land_bound?.bound?.south;
          }
          if (mainObject?.land_bound?.bound?.east && polygons) {
            polygons[0].east = mainObject?.land_bound?.bound?.east;
          }
          if (mainObject?.land_bound?.bound?.west && polygons) {
            polygons[0].west = mainObject?.land_bound?.bound?.west_text;
          }
        }

        let boundsOfPolygons =
          mainObject["land_bound"]["bound"]["parcels_bounds"]["polygons"] ||
          polygons ||
          [];
        let karar_amin_date = get(mainObject, "karar_amin_date", "");
        let owner_type = get(mainObject, "ownerData.ownerData.owner_type", "1");

        this.setState({
          boundsOfPolygons,
          name,
          mainObject,
          export_no,
          export_date,
          karar_amin_date,
          meter_text,
          invoice,
          printId,
          invoice_date,
          request_no,
          total_area,
          //total_area_letters,
          land_num,
          block_num,
          mo5atat,
          mun,
          el7ay,
          // sak,
          // sak_date,
          ketab_3adl,
          sakObj,
          owners,
          sak_area,
          sak_natural_area,
          zayda_area,
          zayda_text,
          // east,
          // west,
          // west_det,
          // north_det,
          // north,
          // south,
          // south_det,
          // east_det,
          land_area,
          area_desc,
          taksem,
          wasf_taksem,
          // karar_num,
          // karar_date,
          total,
          total_letters,
          meter_price,
          // north_text,
          // south_text,
          // east_text,
          // west_text,
          owner_type,
          committeeActor,
          committeeactors_dynamica_id,
          committee_report_no,
          is_paid,
        });

        axios
          .get(
            backEndUrlforMap +
              submission.submission_file_path +
              "printObject.json"
          )
          .then(({ data }) => {
            console.log("dda", data);
            let printObj = data?.newPrintObj;
            let title1 = data?.newPrintObj?.printTextEdited?.khetab?.title1;
            let title2 = data?.newPrintObj?.printTextEdited?.khetab?.title2;
            let title3 = data?.newPrintObj?.printTextEdited?.khetab?.title3;
            let title4 = data?.newPrintObj?.printTextEdited?.khetab?.title4;
            let title5 = data?.newPrintObj?.printTextEdited?.khetab?.title5;
            let title6 = data?.newPrintObj?.printTextEdited?.khetab?.title6;
            let title7 = data?.newPrintObj?.printTextEdited?.khetab?.title7;
            this.setState({
              title1,
              title2,
              title5,
              title6,
              title7,
              title3,
              title4,
              printObj,
            });
          });
      });
    }
  }
  convertEnglishToArabic(english) {
    var chars, i;
    english = english + "";
    var arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

    // let stringEnglish=english.toString()
    if (english == null || english == "") {
      return "";
    } else if (english.includes("والقطعة") || english.includes("القطعة")) {
      english.replace("القطعة", "").replace("و", "");
      english = english.toString();
      chars = english.split("");
      for (i = 0; i < chars.length; i++) {
        if (/\d/.test(chars[i])) {
          chars[i] = arabicNumbers[chars[i]];
        }
      }
      let revesedChars = chars.join("");
      console.log("dd", revesedChars);
      return revesedChars.split(" و").reverse().join(" و");
    } else {
      chars = english.split("");
      for (i = 0; i < chars.length; i++) {
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
      boundsOfPolygons = [],
      name = "",
      land_num = "",
      block_num = "",
      total_area = "",
      //total_area_letters = "",
      export_no = "",
      export_date = "",
      mo5atat = "",
      el7ay = "",
      // sak = "",
      // sak_date = "",
      sakObj = [],
      //north,
      meter_text = "",
      taksem,
      printId = "",
      wasf_taksem,
      invoice,
      invoice_date,
      request_no,
      //north_det,
      title1 = "",
      title2 = "",
      title3 = "",
      title4 = "",
      title5 = "",
      title6 = "",
      title7 = "",
      // south,
      // south_det,
      // east,
      // east_det,
      // west,
      // west_det,
      total = "",
      total_letters,
      ketab_3adl = "",
      meter_price = "",
      sak_area = "",
      sak_natural_area = "",
      zayda_area = "",
      zayda_text = "",
      owners,
      karar_amin_date = "",
      karar_date = "",
      karar_num = "",
      mun = "",
      // north_text = "",
      // south_text = "",
      // east_text = "",
      // west_text = "",
      mainObject = "",
      owner_type = "1",
      printObj,
      committeeActor = {},
      committeeactors_dynamica_id = [],
      committee_report_no,
      is_paid,
    } = this.state;
    return (
      <>
        <div className="table-report-container">
          {/* <Header /> */}
          {mun != "الخبر" && (
            <div>
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
                <div className="new_khetab_stuff">
                  <p>
                    <span>{export_no ? convertToArabic(export_no) : ""}</span>
                  </p>
                  <p style={{ marginTop: "14px" }}>
                    <span style={{ marginLeft: "60px" }}>
                      {localizeNumber(export_date?.split("/")[0] || "")}
                    </span>
                    {"    "}
                    <span style={{ marginLeft: "60px" }}>
                      {localizeNumber(export_date?.split("/")[1] || "")}
                    </span>
                    {"    "}
                    <span>
                      {localizeNumber(
                        export_date
                          ?.split("/")[2]
                          ?.substring(2, export_date?.split("/")[2]?.length) ||
                          ""
                      )}
                    </span>
                    {"    "}
                  </p>
                </div>
                <div
                  style={{
                    height: "75vh",
                    zoom: "0.9",
                    margin: "35px 50px",
                    // overflow: "visible"
                  }}
                  className="content-temp ma7dar_3adl"
                >
                  <div style={{ height: "16vh" }}></div>

                  <section style={{ display: "grid", justifyContent: "end" }}>
                    <QRCode
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="Q"
                      style={{ width: 128 }}
                      value={`export number : ${export_no}`}
                    />
                  </section>
                  <div style={{ textAlign: "right" }}>
                    <h5>الإدارة العامة للتخطيط العمراني</h5>
                    <h5 style={{ marginRight: "104px" }}>إدارة المساحـة</h5>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <h5>الموضوع :- إضافة زائدة تنظيمية</h5>
                  </div>
                  <div>
                    <br />
                    {/* <br />
                    <br /> */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "4fr 1fr",
                        textAlign: "right",
                      }}
                    >
                      <h5 style={{ fontWeight: "bold" }}>
                        فضيلة رئيس {ketab_3adl}{" "}
                      </h5>
                      <h5 style={{ fontWeight: "bold" }}>حفظه الله</h5>
                    </div>
                    <h5 style={{ textAlign: "right" }}>
                      السلام عليكم ورحمة الله وبركـاته ،،،،
                    </h5>
                  </div>

                  <div style={{ margin: "5px", textAlign: "justify" }}>
                    <p>
                      &nbsp; &nbsp; &nbsp;نرفق لفضيلتكم الطلب المقدم بشأن تحديث
                      معلومات الصك التالي بياناته :-
                    </p>
                    {block_num == null && (
                      <table className="table table-bordered table-ma7dar">
                        <tr>
                          <td>{`${
                            (owners?.length > 0 && "اسماء الملاك") ||
                            "اسم المالك"
                          }`}</td>
                          <td style={{ fontWeight: "bold" }}>
                            {owners?.map((o) => o?.owner_name).join(", ")}
                          </td>
                          <td>{owners?.[0]?.identity_label}</td>
                          <td style={{ fontWeight: "bold", fontSize: "22px" }}>
                            {owners?.map((o) => o?.identity).join(", ")}
                          </td>
                        </tr>

                        <tr>
                          <td>رقم الصك</td>
                          <td
                            style={{
                              fontWeight: "bold",
                              fontSize: "22px",
                              textAlign: "center",
                            }}
                          >
                            {sakObj.map((sak) => (
                              <div
                              // style={{
                              //   display: "grid",
                              //   justifyItems: "flex-end",
                              // }}
                              >
                                <span
                                  style={{
                                    fontSize: "18px",
                                    unicodeBidi: "plaintext",
                                  }}
                                >
                                  {convertToArabic(sak.number)} وبـتـاريخ{" "}
                                  {convertToArabic(sak.date)} هـ
                                </span>
                              </div>
                            ))}
                          </td>
                          <td>
                            {sakObj?.filter((r) => r?.lands?.length)?.length >
                              1 ||
                            sakObj?.filter((r) => r?.lands?.length > 1)
                              ?.length ||
                            land_num.split("-").length > 1
                              ? "أرقام القطع"
                              : "رقم القطعة"}
                          </td>
                          <td
                            style={{
                              fontWeight: "bold",
                              fontSize: "22px",
                              textAlign: "center",
                            }}
                          >
                            {(sakObj?.filter((r) => r?.lands?.length)?.length &&
                              sakObj?.map((sak) => (
                                <div
                                // style={{
                                //   display: "grid",
                                //   justifyItems: "flex-end",
                                // }}
                                >
                                  <span
                                    style={{
                                      fontSize: "18px",
                                      unicodeBidi: "plaintext",
                                    }}
                                  >
                                    {convertToArabic(
                                      Array.isArray(sak?.lands)
                                        ? sak?.lands?.join(" - ")
                                        : sak?.lands
                                    )}
                                  </span>
                                </div>
                              ))) || (
                              <span
                                style={{
                                  fontSize: "18px",
                                  unicodeBidi: "plaintext",
                                }}
                              >
                                {convertToArabic(land_num)}
                              </span>
                            )}
                          </td>
                        </tr>

                        {wasf_taksem && (
                          <tr>
                            <td>اسم التقسيم</td>
                            <td style={{ fontWeight: "bold" }}>{taksem}</td>

                            <td>وصف التقسيم</td>
                            <td style={{ fontWeight: "bold" }}>
                              {convertToArabic(wasf_taksem)}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td>رقم المخطط المعتمد</td>
                          <td style={{ fontWeight: "bold" }}>
                            {convertToArabic(mo5atat)}
                          </td>
                          <td>اسم الحي</td>
                          <td style={{ fontWeight: "bold" }}>{el7ay}</td>
                        </tr>
                        {block_num && (
                          <tr>
                            <td>رقم البلك</td>
                            <td colSpan={3} style={{ fontWeight: "bold" }}>
                              {convertToArabic(block_num)}
                            </td>
                            {/* <td>اسم الحي</td>
                        <td style={{ fontWeight: "bold" }}>{el7ay}</td> */}
                          </tr>
                        )}
                      </table>
                    )}
                    {block_num != null && (
                      <table className="table table-bordered table-ma7dar">
                        <tr>
                          <td>{`${
                            (owners?.length > 1 && "اسماء الملاك") ||
                            "اسم المالك"
                          }`}</td>
                          <td style={{ fontWeight: "bold" }}>
                            {owners?.map((o) => o?.owner_name)?.join(", ")}
                          </td>
                          <td>{owners?.[0]?.identity_label}</td>
                          <td style={{ fontWeight: "bold", fontSize: "22px" }}>
                            {owners?.map((o) => o?.identity)?.join(", ")}
                          </td>
                        </tr>

                        <tr>
                          <td>رقم الصك</td>
                          <td
                            style={{
                              fontWeight: "bold",
                              fontSize: "22px",
                              textAlign: "center",
                            }}
                          >
                            {sakObj?.map((sak) => (
                              <div
                                style={{
                                  display: "grid",
                                  justifyItems: "flex-end",
                                }}
                              >
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
                          <td>بتاريخ</td>
                          <td
                            style={{
                              fontWeight: "bold",
                              fontSize: "22px",
                              textAlign: "center",
                            }}
                          >
                            {sakObj?.map((sak) => (
                              <div
                                style={{
                                  display: "grid",
                                  justifyItems: "flex-end",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "18px",
                                    unicodeBidi: "plaintext",
                                  }}
                                >
                                  {convertToArabic(sak.date)} هـ
                                </span>
                              </div>
                            ))}
                          </td>
                        </tr>

                        {/* <tr>
                          <td>رقم الصك</td>
                          <td style={{ fontWeight: "bold", fontSize: "22px" }}>
                            {convertToArabic(sak)}
                          </td>
                          <td>بتاريخ</td>
                          <td style={{ fontWeight: "bold", fontSize: "22px" }}>
                            {convertToArabic(sak_date)} هـ
                          </td>
                        </tr> */}
                        {wasf_taksem && (
                          <tr>
                            <td>اسم التقسيم</td>
                            <td style={{ fontWeight: "bold" }}>{taksem}</td>

                            <td>وصف التقسيم</td>
                            <td style={{ fontWeight: "bold" }}>
                              {convertToArabic(wasf_taksem)}
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td>رقم المخطط المعتمد</td>
                          <td style={{ fontWeight: "bold" }}>
                            {convertToArabic(mo5atat)}
                          </td>
                          <td>
                            {land_num?.split("-")?.length > 1
                              ? "أرقام القطع"
                              : "رقم القطعة"}
                          </td>
                          <td style={{ fontWeight: "bold", fontSize: "22px" }}>
                            {convertToArabic(land_num)}
                          </td>
                        </tr>
                        <tr>
                          <td>رقم البلك</td>
                          <td style={{ fontWeight: "bold" }}>
                            {convertToArabic(block_num)}
                          </td>
                          <td>اسم الحي</td>
                          <td style={{ fontWeight: "bold" }}>{el7ay}</td>
                        </tr>
                      </table>
                    )}
                    <ZoomSlider>
                      <p>
                        &nbsp; &nbsp; &nbsp;وبعد أن تم تطبيق الصك على المخطط
                        المعتمد وتبين أن هناك زيادة بالمساحة بمقدار{" "}
                        {convertToArabic(zayda_area)} م۲ ({zayda_text}) فقط لا
                        غير وقد تم استيفاء قيمة الزائدة بموجب فاتورة سداد رقم{" "}
                        {convertToArabic(invoice)} في تاريخ{" "}
                        {convertToArabic(invoice_date)} هـ
                      </p>
                      <p>
                        حيث أصبحت الأطوال والمساحة الإجمالية بعد الزائدة كالتالي
                        :-{" "}
                      </p>
                    </ZoomSlider>
                    <ZoomSlider>
                      <div>
                        {boundsOfPolygons.map((polygon) => (
                          <>
                            <p>
                              &nbsp; &nbsp; &nbsp; حدود وأبعاد ومساحة القطعة رقم{" "}
                              {convertToArabic(polygon.parcel_name)} كالتالي :
                            </p>
                            <p>
                              شمالا : بطول{" "}
                              {convertToArabic(polygon.data[0].totalLength)} متر
                              ( {polygon.north} ) ويحدها{" "}
                              {convertToArabic(polygon.north_Desc)} .
                            </p>
                            <p>
                              جنوبا : بطول{" "}
                              {convertToArabic(polygon.data[4].totalLength)} متر
                              ( {polygon.south} ) ويحدها{" "}
                              {convertToArabic(polygon.south_Desc)} .
                            </p>
                            <p>
                              شرقا : بطول{" "}
                              {convertToArabic(polygon.data[1].totalLength)} متر
                              ( {polygon.east} ) ويحدها{" "}
                              {convertToArabic(polygon.east_Desc)} .
                            </p>
                            <p>
                              غربا : بطول{" "}
                              {convertToArabic(polygon.data[3].totalLength)} متر
                              ( {polygon.west} ) ويحدها{" "}
                              {convertToArabic(polygon.weast_Desc)} .
                            </p>
                            <p>
                              <EditPrint
                                printObj={printObj || mainObject}
                                id={printId}
                                path="khetab.title3"
                                oldText={title3 || "المساحة الإجمالية للأرض هي"}
                              />
                              = {convertToArabic(polygon.area.toFixed(2))} م۲ (
                              <EditPrint
                                printObj={printObj || mainObject}
                                id={printId}
                                path="khetab.title2"
                                oldText={title2 || polygon.parcel_area_desc}
                              />
                              {})
                            </p>
                          </>
                        ))}

                        <p>
                          <EditPrint
                            printObj={printObj || mainObject}
                            id={printId}
                            path="khetab.title3"
                            oldText={title3 || "المساحة الإجمالية"}
                          />
                          = {convertToArabic(total_area)} م۲
                          {/* (
                          <EditPrint
                            printObj={printObj || mainObject}
                            id={printId}
                            path="khetab.title2"
                            oldText={title2 || total_area_letters}
                          />
                          {}) */}
                          <EditPrint
                            printObj={printObj || mainObject}
                            id={printId}
                            path="khetab.title4"
                            oldText={title4 || "وباقي معلومات الصك صحيحة ."}
                          />
                        </p>
                      </div>
                    </ZoomSlider>
                    <p>
                      لذا نأمل من فضيلتكم إجراء التهميش اللازم بما يفيد ذلك على
                      الصك المذكور والسجلات لديكم مع أخذ مصادقة المالك على ذلك
                    </p>
                    <p style={{ textAlign: "center" }}>
                      والسلام عليكم ورحمه الله وبركاته ,,,,
                    </p>
                    <div className="khetab_sign" style={{ marginLeft: "5px" }}>
                      <h5>
                        {(committeeActor && committeeActor?.position) ||
                          "وكيل الأمين المساعد للتعمير"}
                      </h5>
                      {/* <h5 style={{ marginLeft: "400px", marginTop: "15px" }}>
                        المهندس /{" "}
                        {committeeActor &&
                          committeeActor.is_approved &&
                          province_id && (
                            <SignPics
                              province_id={province_id}
                              committee_report_no={committee_report_no}
                              is_paid={is_paid}
                              userId={committeeactors_dynamica_id[0]}
                            />
                          )}
                      </h5> */}
                      <div>
                        <h5
                          style={{
                            marginLeft: "290px",
                            // fontWeight: "bold",
                            fontSize: "25px",
                            direction: "ltr",
                          }}
                        >
                          {" "}
                          / المهندس
                        </h5>
                        <h5
                          style={{
                            margin: "10px 20px 0px 50px",
                          }}
                        >
                          {committeeActor &&
                            committeeActor.is_approved &&
                            province_id && (
                              <SignPics
                                province_id={province_id}
                                // committee_report_no={committee_report_no}
                                is_paid={is_paid}
                                userId={committeeactors_dynamica_id[0]}
                              />
                            )}
                        </h5>
                      </div>
                      <h5>
                        {(committeeActor && committeeActor.name) ||
                          "متعب بن ظاهر الحسيني"}
                      </h5>
                    </div>
                    {/* <div style={{textAlign:"right"}}>
                    <p style={{margin: 0}}>ح50</p>
                    <p style={{margin: 0}}>ص. لإدارة التخطيط (المساحة)</p>
                    <p style={{margin: 0}}>ص. للمساح/ </p>
                    <p style={{margin: 0}}>ص. للصادر للقيد رقم</p>
                  </div> */}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* خطاب كتابة العدل لبلدية الخبر */}

          {mun == "الخبر" && (
            <div>
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
                <div className="new_khetab_stuff">
                  <p>
                    <span>{export_no ? convertToArabic(export_no) : ""}</span>
                  </p>
                  <p style={{ marginTop: "14px" }}>
                    <span style={{ marginLeft: "60px" }}>
                      {localizeNumber(export_date?.split("/")[0] || "")}
                    </span>
                    {"    "}
                    <span style={{ marginLeft: "60px" }}>
                      {localizeNumber(export_date?.split("/")[1] || "")}
                    </span>
                    {"    "}
                    <span>
                      {localizeNumber(
                        export_date
                          ?.split("/")[2]
                          ?.substring(2, export_date?.split("/")[2]?.length) ||
                          ""
                      )}
                    </span>
                    {"    "}
                  </p>
                </div>
                <div
                  style={{
                    height: "75vh",
                    zoom: "0.9",
                    margin: "-165px 50px",
                    lineHeight: "35px",
                    // overflow: "visible"
                  }}
                  className="content-temp ma7dar_3adl"
                >
                  <div style={{ height: "16vh" }}></div>

                  <section style={{ display: "grid", justifyContent: "end" }}>
                    <QRCode
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                      level="Q"
                      style={{ width: 128 }}
                      value={`export number : ${export_no}`}
                    />
                  </section>
                  <div>
                    {/* <h5 style={{ marginRight: "104px", textAlign: "right" }}>
                      بلديـة محافظة الخبر{" "}
                    </h5> */}
                    <h5 style={{ marginRight: "74px", textAlign: "right" }}>
                      إدارة الأراضي والمساحـة
                    </h5>
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <h5>
                      الموضوع / اضافة الزائدة ل
                      {land_num?.split("-")?.length > 1
                        ? "لأراضي أرقام"
                        : "أرض رقم"}{" "}
                      {land_num}{" "}
                    </h5>
                    <h5>
                      بالمخطط المعتمد رقم {mo5atat} بمدينة {mun}
                    </h5>
                  </div>
                  <div>
                    <br />
                    {/* <br />
                    <br /> */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "4fr 1fr",
                      }}
                    >
                      <h5
                        style={{
                          fontWeight: "bold",

                          textAlign: "right",
                        }}
                      >
                        فضيلة / رئيس {ketab_3adl}{" "}
                      </h5>
                      <h5 style={{ fontWeight: "bold" }}>المحترم </h5>
                    </div>
                    <h5 style={{ textAlign: "right" }}>
                      السلام عليكم ورحمة الله وبركـاته ،،،،
                    </h5>
                  </div>
                  <div
                    style={{
                      margin: "5px",
                      textAlign: "justify",
                      lineHeight: "40px",
                    }}
                  >
                    <p style={{}}>
                      &nbsp; &nbsp; &nbsp; بناء على تعميم صــاحب الســمو الملكي
                      وزير الشــئون البلديـة والقرويـة رقم{" "}
                      {convertToArabic("67347")} / ص ز بتاريخ{" "}
                      {convertToArabic("15/11/1426")} هـــ وتفويض معالي أمين
                      المنطقة الشرقية بصلاحية بيع زوائد المنح والتنظيم والتخطيط
                      المنصـوص عليها بالمادة الثالثة من لائحه التصرف بالعقارات
                      البلديـة والتقيد بكافة الإجـراءات المنصوص عليها بهذه
                      اللائحه وبناء علي الصلاحيات المخوله لمعالي أمين المنطقة
                      الشرقية بموجب القرار الوزاري رقم{" "}
                      {convertToArabic("17777")} بتاريخ{" "}
                      {convertToArabic("1/4/1431")} هـــ وذلكـ لمخاطبه كتاب
                      العدل بخصوص الزوائد التنظيمية بعد استكمال إجراءاتها وصدور
                      قرار الأمين بذلكـ بالنقص أو الزيادة.
                    </p>
                    <p style={{ marginTop: "20px" }}>
                      &nbsp; &nbsp; &nbsp; عليه فقد صدر قرار معالي الأمين رقم ({" "}
                      {convertToArabic(request_no)} ) بتاريخ{" "}
                      {convertToArabic(karar_amin_date)}
                      هـــ بالموافقة على بيع الزائدة التنظيمية عليه تم إستيفاء
                      قيمة الزيـادة والبـالغـه مساحتـها ({" "}
                      {convertToArabic(zayda_area)} ) م۲ ( {zayda_text} ) وذلكـ
                      بموجب فاتورة سداد رقم {convertToArabic(invoice)} في تاريخ{" "}
                      {convertToArabic(invoice_date)} هــ الحاصلة ل
                      {land_num?.split("-")?.length > 1
                        ? "لأراضي أرقام"
                        : "أرض رقم"}{" "}
                      ( {land_num} ){" "}
                      {wasf_taksem != null &&
                      wasf_taksem.includes("منطقة", "فئة")
                        ? taksem.replace("منطقة", "").replace("فئة", "")
                        : taksem != null
                        ? taksem
                        : ""}
                      {"-"} {wasf_taksem != null ? wasf_taksem : ""} بالمخطط
                      المعتمد رقم {mo5atat} الواقعة بحي {el7ay} بـ{mun}{" "}
                      والعائــده لـ /{" "}
                      {owners?.map((o) => o?.owner_name)?.join(" , ")} رقم
                      الهوية ( {owners?.map((o) => o?.identity)?.join(" , ")} )
                      بموجب
                      {(sakObj.length > 1 && "الصكوك") || "الصك"} رقم ({" "}
                      {convertToArabic(
                        sakObj.map((sak) => sak.number)?.join(" - ")
                      )}{" "}
                      ) في{" "}
                      {sakObj
                        ?.map((sak) => convertToArabic(sak.date))
                        ?.join(" - ")}{" "}
                      هــ الصادر من إدارتكم
                    </p>
                    <p style={{ marginTop: "20px" }}>
                      فإن حدود وأبعاد ومساحة الأرض بعد إضافة المساحة الزائدة
                      إليها تصبح كالتالي :
                    </p>
                    <ZoomSlider>
                      <div>
                        {boundsOfPolygons.map((polygon) => (
                          <>
                            <p>
                              &nbsp; &nbsp; &nbsp; حدود وأبعاد ومساحة القطعة رقم{" "}
                              {convertToArabic(polygon.parcel_name)} كالتالي :
                            </p>
                            <p>
                              شمالا : بطول{" "}
                              {convertToArabic(polygon.data[0].totalLength)} متر
                              ( {polygon.north} ) ويحدها{" "}
                              {convertToArabic(polygon.north_Desc)} .
                            </p>
                            <p>
                              جنوبا : بطول{" "}
                              {convertToArabic(polygon.data[4].totalLength)} متر
                              ( {polygon.south} ) ويحدها{" "}
                              {convertToArabic(polygon.south_Desc)} .
                            </p>
                            <p>
                              شرقا : بطول{" "}
                              {convertToArabic(polygon.data[1].totalLength)} متر
                              ( {polygon.east} ) ويحدها{" "}
                              {convertToArabic(polygon.east_Desc)} .
                            </p>
                            <p>
                              غربا : بطول{" "}
                              {convertToArabic(polygon.data[3].totalLength)} متر
                              ( {polygon.west} ) ويحدها{" "}
                              {convertToArabic(polygon.weast_Desc)} .
                            </p>
                            <p>
                              <EditPrint
                                printObj={printObj || mainObject}
                                id={printId}
                                path="khetab.title5"
                                oldText={title5 || "المساحة الإجمالية للأرض هي"}
                              />
                              = {convertToArabic(polygon.area.toFixed(2))} م۲ (
                              <EditPrint
                                printObj={printObj || mainObject}
                                id={printId}
                                path="khetab.title6"
                                oldText={title6 || polygon.parcel_area_desc}
                              />
                              {})
                            </p>
                          </>
                        ))}
                        <p>
                          <EditPrint
                            printObj={printObj || mainObject}
                            id={printId}
                            path="khetab.title5"
                            oldText={title5 || "المساحة الإجمالية"}
                          />
                          <div style={{ display: "inline-block" }}>
                            {convertToArabic(total_area)} م۲
                          </div>
                          {/* <EditPrint
                            printObj={printObj || mainObject}
                            id={printId}
                            path="khetab.title6"
                            oldText={title6 || total_area_letters}
                          /> */}
                          <EditPrint
                            printObj={printObj || mainObject}
                            id={printId}
                            path="khetab.title7"
                            oldText={
                              title7 ||
                              " وبرفقه كروكي مصدق من قبلنا يوضح حدود وأبعاد ومساحة الأرض قبل إضافة الزائدة و بعد إضافة الزائدة التنظيمية"
                            }
                          />
                        </p>
                      </div>
                    </ZoomSlider>
                    <p>
                      عليه نأمل تعديل مساحة وحدود وأبعاد الصك المشار إليه بموجبه
                      مع أخذ مصادقة المالك على ذلك .
                    </p>
                    <p style={{ textAlign: "center", marginTop: "10px" }}>
                      والسلام عليكم ورحمه الله وبركاته ،،،،
                    </p>
                    {/* <div style={{ margin: "20px", direction: "ltr", display: "grid", gridGap: "15px" }}>
                      <h5 style={{ fontWeight: "bold", fontSize: "35px" }}>
                        أمين المنطقة الشرقية
                      </h5>
                      <h5 style={{ marginLeft: "280px", fontWeight: "bold", }}>
                        {" "}
                        / المهندس
                      </h5>
                      <h5 style={{ fontWeight: "bold",  }}>
                        فهد بن محمد الجبير
                      </h5>
                    </div> */}
                    <div
                      style={{
                        fontWeight: "bold",
                        marginTop: "25px",
                        display: "grid",
                        gridGap: "35px",
                        textAlign: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      {/* <h5>رئيس بلدية محافظة الخبر</h5> */}
                      <h5>{committeeActor && committeeActor?.position}</h5>
                      <h5 style={{ marginLeft: "310px" }}> المهندس /</h5>
                      {/* <h5>مشعل بن الحميدي الحربي </h5> */}
                      <h5>{committeeActor && committeeActor?.name}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}
