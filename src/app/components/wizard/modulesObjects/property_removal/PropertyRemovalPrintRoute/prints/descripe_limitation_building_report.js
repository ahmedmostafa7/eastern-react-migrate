import React, { useState, useEffect, useContext } from "react";
import { PrintContext } from "../Print_data_Provider";
import { convertToArabic } from "../../../../../inputs/fields/identify/Component/common";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import EditPrint from "app/components/editPrint";
export default function DescripeLimitationBuilding(props) {
  let {
    request_number,
    project = {},
    band_data = {},
    printObj,
    printId,
    title2,
    title3,
    title4,
    title5,
    title6,
    mainObject,
    committeeactors1,
    committeeactors2,
    committeeactors1_id,
    committeeactors2_id,
    province_id,
    propertyRemovalUser,
    mun,
  } = useContext(PrintContext) ?? props.mo3aynaObject[0];
  console.log("dataPrint", useContext(PrintContext), props.mo3aynaObject);
  return (
    <div
      className="printContainerHeight"
      style={{
        marginTop: "10vh",
        zoom: ".85",
        lineHeight: 1.7,
      }}
    >
      <div style={{ textAlign: "left" }} className="hidden2">
        <button
          className="btn btn-warning"
          onClick={() => {
            window.print();
          }}
        >
          طباعة
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "auto auto auto" }}>
        <div>
          <h5>الممكله العربيه السعوديه</h5>
          <h5> وزارة الشئون البلدية و القروية</h5>
          <h5> أمانة المنطقه الشرقية</h5>
          <h5>الإدارة العامة للأراضي والممتلكات</h5>
          <h5>الإدارة العامة للأراضي والممتلكات</h5>
          <h5>إدارة نزع الملكية</h5>
        </div>
        <div>
          <img src="images/logo2.png" width="150px" />
        </div>
        <div style={{ marginTop: "7vh" }}>
          <p>الموضوع : بشأن نزع ملكية جميع العقارات التي تعترض تنفيذ ربط</p>
          <p>منطقة السوق المركزية بكورنيش الدمام بالمنطقة الشرقية</p>
          <p>اسم المالك :- أمانة المنطقة الشرقية</p>
          <p>بناء على القرار 45000350 وبتاريخ 1/1/1445 هـ</p>
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          textDecoration: "underline",
          marginTop: "1vh",
        }}
      >
        محضر وصف وتقدير أرض ومشتملات العقار رقم (120)
      </div>
      <p>
        اسم المالك : فيصل و حمد و عبدالرحمن و وفاء و هيفاء و نداء و هناء أبناء و
        بنات يعد بن حمد القروني بحسب الأنصبة الشرعية بالصك
      </p>
      <p>
        رقم الصك : 330107041851 &nbsp; &nbsp; وتاريخه : 27/3/1445 هـ &nbsp;
        &nbsp; في : البورصة العقارية
      </p>
      <p>
        الموقع : المخطط المعتمد رقم : (82/1) بالدمام &nbsp;&nbsp;&nbsp;&nbsp; حي
        : السلام
      </p>
      <p>1- الوصف الإجمالي للعقار :</p>
      <p>
        نوع العقار : أرض بمساحة (750) م2 &nbsp;&nbsp; نوع البناء : خرساني
        &nbsp;&nbsp; بمساحة إجمالية : (548.68) م2 &nbsp;&nbsp; عدد الأدوار (2)
      </p>
      <p>2- المشتملات : </p>
      <p>أ. سور بلك بارتفاع 3 م وطول 110 م.ط</p>
      <p>ب. سور حديد شينكو بارتفاع 1.5 م وطول 80.5 م.ط</p>
      <p>3- الملاحظات : لايوجد</p>
      <p>
        4- التقديرات : للمبني (215000) ريال (مائتان وخمسة عشر ألف ريال) لاغير
      </p>
      <div>
        <table className="table table-bordered">
          <tr>
            <td>سعر المتر المربع للأرض (ريال)</td>
            <td>3000</td>
            <td>فقط ثلاثة آلف ريالا سعوديا لاغير</td>
          </tr>
          <tr>
            <td>مساحة الأرض المنزوعة (م2)</td>
            <td>750 م2</td>
            <td>سبعمائة وخمسون متر مربعا</td>
          </tr>
          <tr>
            <td>المبلغ الإجمالي للتعويض (ريال)</td>
            <td>2456000</td>
            <td>فقط مليونان وأربعمائة وخمسة وستون ألف ريال سعودي لاغير</td>
          </tr>
        </table>
      </div>
      <p>
        تم الشخوص على العقار الموضحة بياناته أعلاه وأتضح أن المعلومات امبنية
        أنفا صحيحة وأن اأسعار التي حددت أخذت بعين الاعتبار موقع العقار بالنسبة
        للمنطقة وللعقارات المجاورة بحسب وصفه
      </p>
      <div>
        <table className="table table-bordered">
          <tr>
            <td colSpan={6} style={{ textAlign: "center" }}>
              أعضاء لجنة التقديرات
            </td>
          </tr>
          <tr>
            <td>مندوب إمارة المنطقة الشرقية</td>
            <td></td>
            <td></td>
            <td>مندوب وزارة العدل بالشرقية</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>مندوب هيئة عقارات الدولة بالشرقية</td>
            <td></td>
            <td></td>
            <td>مندوب أمانة المنطقة الشرقية</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>عضو الخبرة</td>
            <td></td>
            <td></td>
            <td>مندوب الجهة المستفيدة</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>عضو الخبرة</td>
            <td></td>
            <td></td>
            <td>يعتمد / أمين المنطقة الشرقية</td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </div>
    </div>
  );
}
