import React, { useState, useEffect, useContext } from "react";
import { PrintContext } from "../Print_data_Provider";
import { convertToArabic } from "../../../../../inputs/fields/identify/Component/common";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import EditPrint from "app/components/editPrint";
export default function BuildingLimitation(props) {
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
        // marginTop: "10vh",
        zoom: ".9",
        lineHeight: 2.5,
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

      <div
        className="HeaderPrint"
        style={{ gridTemplateColumns: "auto auto auto" }}
      >
        <div>
          <h5>الممكله العربيه اسعوديه</h5>
          <h5>وزارة الشئون</h5>
          <h5>أمانة المنطقه</h5>
          <h5>الإدارة العامة للأراضي والممتلكات</h5>
          {/* <h5>إدارة نزع الملكية</h5> */}
        </div>
        <div>
          <img src="images/logo2.png" width="150px" />
        </div>

        {/* <div><img src="images/logo2.png" width="100px" /></div>
                <div>3</div> */}
        <div style={{ textAlign: "left", left: "9%", marginTop: "7vh" }}>
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
          // textDecoration: "underline",
          marginTop: "1vh",
        }}
      >
        ( محضر حصر مشتملات )
      </div>
      {/* <p>إن أمين المنطقة الشرقية</p> */}
      <p>
        محضر اللجنة المشكلة بموجب المادة السادسة من نظام نزع ملكية العقارات
        للمنفعة العامة ووضع اليد المؤقت على العقار لحصر مشتملات العقار رقم (120)
        بالمخطط المعتمد رقم (82/1) بحي السلام ، المراد نزع ملكيتها لصالح أمانة
        المنطقة الشرقية بالدمام
      </p>
      <div>
        <p>
          <span>
            1- اسم مالك العقار : فيصل و حمد و عبدالرحمن و وفاء و هيفاء و نداء و
            هناء أبناء و بنات يعد بن حمد القروني
          </span>
          <span> رقم السجل المدني : 1005449325</span>
        </p>
        <p>
          <span>2- اسم المشروع : تنفيذ مشروع ربط منطقة السوق</span>
          <span>المركزية بكورنيش الدمام بالمنطقة الشرقية</span>
        </p>
        <p> 3- رقم العقار : (120)</p>
        <p>
          <span> 4- رقم صك الملكية :330107041851 </span>
          <span> تاريخه : 27/3/1445 هـ</span>
          <span> مصدره : البورصة العقارية</span>
        </p>
        <p> 5- موقع العقار : داخل حدود التنمية</p>
        <p>6- مساحة الجزء المتبقي من الأرض : منزوع كامل مساحة العقار</p>
        <p>
          7- مساحة المبني : (274.34 م2) ،; عدد الأدوار : (2) ، ; المساحة
          الإجمالية : (548.68 م2)
        </p>
        <p>8- المساحة المراد اقتطاعها من الأرض : (750 م2)</p>
        <p>9- مشتملات أخري للعقار : أ. سور بلك بارتفاع 3 م وطول 110 م.ط</p>
        <p>
          9- مشتملات أخري للعقار : ب. سور حديد شينكو بارتفاع 1.5 م وطول 80.5 م.ط
        </p>
        <p>
          أقر أنا / حمد بن سعد القروني وكيل ملاك العقار أعلاه بموجب الوكالة رقم
          (431427593) و تاريخ (25/3/1443 هـ) أنني أطلعت على البيانات المدونه
          أعلاه وأنها صحيحة وعلى ذلك أوقع .
        </p>
        <p>
          <span>الاسم / ...........................................</span>
          <span>التوقيع / ........................................</span>
        </p>
      </div>
      <p
        style={{
          fontWeight: "bold",
          textDecoration: "underline",
          textAlign: "center",
        }}
      >
        أعضاء لجنة حصر مشتملات العقارات
      </p>
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
        <div style={{ display: "grid", gridGap: "15px" }}>
          <h5>مندوب الجهة المستفيدة</h5>
          <h5>الاسم / صالح بن عبدالرحمن الراجح</h5>
          <h5>
            <span>..................</span> <span>/التوقيع</span>
          </h5>
        </div>
        <div style={{ display: "grid", gridGap: "15px" }}>
          <h5>مندوب الأمانة</h5>
          <h5>الاسم / عمر بن مستور الغامدي</h5>
          <h5>
            <span>..................</span> <span>/التوقيع</span>
          </h5>
        </div>
        <div style={{ display: "grid", gridGap: "15px" }}>
          <h5>مندوب أمانة المنطقة الشرقية</h5>
          <h5>الاسم / عايض بن سعد العتيبي</h5>
          <h5>
            <span>..................</span> <span>/التوقيع</span>
          </h5>
        </div>
      </div>
    </div>
  );
}
