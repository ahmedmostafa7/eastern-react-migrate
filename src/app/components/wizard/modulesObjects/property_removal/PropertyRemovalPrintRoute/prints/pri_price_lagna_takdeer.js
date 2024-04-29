import React, { useState, useEffect, useContext } from "react";
import { PrintContext } from "../Print_data_Provider";
import {
  convertToArabic,
  reformatNumLetters,
} from "../../../../../inputs/fields/identify/Component/common";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import EditPrint from "app/components/editPrint";
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";
export default function PriPriceLagnaTakdeer(props) {
  let {
    request_number,
    primary_pricing = {},
    title1,
    printObj,
    mainObject,
    printId,
    committeeactors1,
    committeeactors2,
    committeeactors3,
    committeeactors1_id,
    committeeactors2_id,
    committeeactors3_id,
    province_id,
  } = useContext(PrintContext) ?? props.mo3aynaObject[0];
  console.log("dataPrint", useContext(PrintContext), props.mo3aynaObject);
  return (
    <div
      className="printContainerHeight"
      style={
        {
          // borderRadius: "15px",
          // border: "1px solid"
        }
      }
    >
      <div style={{ textAlign: "left" }} className="hidden2">
        <button
          className="btn btn-warning "
          onClick={() => {
            window.print();
          }}
        >
          طباعة
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr",
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: "10px" }}>
          <h5 style={{ marginRight: "45px" }}>المملكة العربية السعودية</h5>
          <h5>وزارة الشئون البلدية والقروية والإسكان</h5>
          <h5 style={{ marginRight: "55px" }}>أمانة المنطقة الشرقية</h5>
          <h5 style={{ marginRight: "10px" }}>
            الإدارة العامة للأراضي والممتلكات
          </h5>
          <h5 style={{ marginRight: "80px" }}>إدارة نزع الملكية</h5>
        </div>
        <div style={{ justifySelf: "center" }}>
          <img src="images/logo2.png" width="100px" />
        </div>
        <div style={{ justifySelf: "end" }}>
          <img src="images/saudiVision.png" width="130px" />
        </div>
      </div>
      {/* <div style={{ textAlign: "center", fontWeight: "bold" }}>title</div>
            <p>p1</p>
            <p>p2</p>
            <p>p3</p> */}
      <table className="table table-bordered th-nowrap" style={{ zoom: 0.79 }}>
        <thead>
          <th style={{ width: "3vw" }}>#</th>
          <th style={{ width: "9vw" }}>رقم العقار</th>
          <th style={{ width: "12vw" }}>المدينة والمخطط</th>
          <th style={{ width: "14vw" }}>رقم الصك وتاريخه</th>
          <th style={{ width: "12vw" }}>مصدر الصك</th>
          <th style={{ width: "12vw" }}>مالك العقار</th>
          <th style={{ width: "13vw" }}>مساحة العقار (م٢)</th>
          <th style={{ width: "16vw" }}> قيمة المتر المربع (بالريال)</th>
          <th style={{ width: "13vw" }}>مساحة البناء (م٢)</th>
          <th style={{ width: "18vw" }}>قيمة التعويض التقريبي (بالريال)</th>
        </thead>
        <tbody>
          {primary_pricing.primaryPricing?.selectedLands?.map(
            (primaryPrice, index) => (
              <tr>
                <td>{convertToArabic(index + 1)}</td>
                <td>
                  {convertToArabic(primaryPrice.attributes.PARCEL_PLAN_NO)}
                </td>
                <td>
                  {convertToArabic(primaryPrice.attributes.MUNICIPALITY_NAME)}
                  <br />
                  مخطط {convertToArabic(primaryPrice.attributes.PLAN_NO)}
                </td>
                <td>
                  {(primaryPrice.attributes.PARCEL_SAK_NO && (
                    <>
                      ({convertToArabic(primaryPrice.attributes.PARCEL_SAK_NO)})
                      في
                      <br />(
                      {convertToArabic(primaryPrice.attributes.PARCEL_SAK_DATE)}
                      ) هـ
                    </>
                  )) ||
                    "لا يوجد"}
                </td>
                <td>
                  {convertToArabic(primaryPrice.attributes.PARCEL_SAK_ISSUER) ||
                    "لا يوجد"}
                </td>
                <td>
                  {convertToArabic(primaryPrice.attributes.PARCELOWNER) ||
                    "لا يوجد"}
                </td>
                <td>
                  {convertToArabic(primaryPrice.attributes.PARCEL_CUT_AREA)} م٢
                </td>
                <td>
                  {convertToArabic(primaryPrice.attributes.PARCEL_METER_PRICE)}{" "}
                  ريال
                </td>
                <td>
                  {(primaryPrice.attributes.BUILD_AREA &&
                    `${convertToArabic(
                      primaryPrice.attributes.BUILD_AREA
                    )} م٢`) ||
                    "لا يوجد"}{" "}
                </td>
                <td>
                  {convertToArabic(
                    primaryPrice.attributes.TOTAL_PARCEL_CUT_PRICE
                  )}{" "}
                  ريال
                </td>
              </tr>
            )
          )}
          <tr>
            <td colSpan={2} style={{ fontWeight: "bold" }}>
              إجمالي مبلغ التعويض
            </td>
            <td colSpan={3}>
              {convertToArabic(
                primary_pricing?.pricing_table_totals?.[0]
                  ?.total_of_totals_of_cut_prices
              )}{" "}
              ريال
            </td>
            <td colSpan={2} style={{ fontWeight: "bold" }}>
              إجمالي مبلغ التعويض بالحروف
            </td>
            <td colSpan={3}>
              {/* {(primary_pricing?.pricing_table_totals?.[0]
                ?.total_of_totals_of_cut_prices &&
                reformatNumLetters(
                  toArabicWord(
                    primary_pricing?.pricing_table_totals?.[0]
                      ?.total_of_totals_of_cut_prices
                  ),
                  "ريال"
                )) ||
                ""} */}
              <EditPrint
                printObj={printObj || mainObject}
                id={printId}
                path="propertyremoval.title1"
                oldText={
                  title1 ||
                  (primary_pricing?.pricing_table_totals?.[0]
                    ?.total_of_totals_of_cut_prices &&
                    reformatNumLetters(
                      toArabicWord(
                        primary_pricing?.pricing_table_totals?.[0]
                          ?.total_of_totals_of_cut_prices
                      ),
                      "ريال"
                    )) ||
                  " "
                }
              />
            </td>
          </tr>
        </tbody>
      </table>
      <p
        style={{
          textAlign: "center",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
        className="p_customize"
      >
        هذه الأسعار تقريبية فقط وذلك للارتباط على المبلغ في الميزانية وليست
        ملزمة للأمانة .. وإنما يعتمد على الأسعار التي يتم تحديدها من قبل لجنة
        نزع الملكية
      </p>
      <p style={{ textAlign: "center" }}>وعلى ذلك جري التوقيع ،،،</p>
      {/* <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}> */}
      <div style={{ marginTop: "50px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div
            style={{
              fontWeight: "bold",
              textAlign: "right",
              marginRight: "50px",
            }}
          >
            {/* <h5
              style={{
                fontWeight: "bold",
                textAlign: "right",
                marginRight: "50px",
              }}
            >
              مدير عام إدارة الأراضي والممتلكات
            </h5>
            <h5
              style={{
                fontWeight: "bold",
                textAlign: "right",
                paddingTop: "75px",
                marginRight: "75px",
              }}
            >
              صالح بن عبدالرحمن الراجح
            </h5> */}
            {committeeactors1?.name && (
              <div>
                <h5>{committeeactors1?.position}</h5>
                <h5 style={{ marginRight: "55px" }}>
                  {committeeactors1?.is_approved && province_id && (
                    <img
                      src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                      width="150px"
                    />
                  )}
                </h5>
                <h5 style={{ marginRight: "20px" }}>
                  {committeeactors1?.name}
                </h5>
              </div>
            )}
          </div>
          <div
            style={{
              fontWeight: "bold",
              textAlign: "left",
              marginLeft: "75px",
            }}
          >
            {/* <h5
              style={{
                fontWeight: "bold",
                textAlign: "left",
                marginLeft: "75px",
              }}
            >
              مدير عام الإدارة القانونية
            </h5>
            <h5
              style={{
                fontWeight: "bold",
                textAlign: "left",
                paddingTop: "75px",
                marginLeft: "50px",
              }}
            >
              عبدالسلام بن جارالله القحطاني
            </h5> */}
            {committeeactors2?.name && (
              <div>
                <h5>{committeeactors2?.position}</h5>
                <h5 style={{ marginLeft: "25px" }}>
                  {committeeactors2?.is_approved && province_id && (
                    <img
                      src={`${filesHost}/users/${committeeactors2_id}/sign.png`}
                      width="150px"
                    />
                  )}
                </h5>
                <h5>{committeeactors2?.name}</h5>
              </div>
            )}
          </div>
        </div>
        <div
          style={{ gridColumn: "1/3", textAlign: "center", marginTop: "20px" }}
        >
          <h5 style={{ fontWeight: "bold", textAlign: "center" }}>
            يعتمد / {committeeactors3?.position}
          </h5>
          <h5 style={{ marginLeft: "280px", fontWeight: "bold" }}>المهندس /</h5>
          <h5>
            {committeeactors3?.is_approved && province_id && (
              <img
                src={`${filesHost}/users/${committeeactors3_id}/sign.png`}
                width="150px"
              />
            )}
          </h5>
          <h5
            style={{
              fontWeight: "bold",
              textAlign: "center",
              paddingTop: "30px",
            }}
          >
            {/* فهد بن محمد الجبير */}
            {committeeactors3?.name}
          </h5>
        </div>
      </div>
    </div>
  );
}
