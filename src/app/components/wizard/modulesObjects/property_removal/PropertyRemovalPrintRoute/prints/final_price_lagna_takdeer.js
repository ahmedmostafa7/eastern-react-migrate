import React, { useState, useEffect, useContext } from "react";
import { PrintContext } from "../Print_data_Provider";
import {
  convertToArabic,
  reformatNumLetters,
} from "../../../../../inputs/fields/identify/Component/common";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import EditPrint from "app/components/editPrint";
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";
export default function FinalPriceLagnaTakdeer(props) {
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
      style={{
        // borderRadius: "15px",
        // border: "1px solid"
        zoom: 0.85,
        lineHeight: "3",
      }}
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
          gridTemplateColumns: "auto 180px auto",
          gridGap: "10px",
          alignItems: "center",
          position: "fixed",
          width: "100%",
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
        <div
          style={{
            justifySelf: "end",
            display: "grid",
            gridGap: "10px",
            marginTop: "7vh",
          }}
        >
          {/* <img src="images/saudiVision.png" width="130px" /> */}
          <h5>الموضوع : بشأن نزع ملكية جميع العقارات التي تعترض تنفيذ ربط</h5>
          <h5>منطقة السوق المركزية بكورنيش الدمام بالمنطقة الشرقية</h5>
          <h5>اسم المالك :- أمانة المنطقة الشرقية</h5>
          <h5>بناء على القرار 45000350 وبتاريخ 1/1/1445 هـ</h5>
        </div>
      </div>
      <div>
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            textDecoration: "underline",
            marginTop: "20vh",
          }}
        >
          محضر لجنة تقدير نزع ملكية العقار رقم (120)
        </div>
        <p>
          بناء على قرار معالي أمين المنطقة الشرقية رقم 45000350 بتاريخ 1/1/1445
          هـ القاضي بالموافقة على بدء إجراءات نزع ملكية العقارات التي تعترض
          تنفيذ ربط منطقة السوق المركزية بكورنيش الدمام بالمنطقة الشرقية وذلك
          بناء على قرار الصلاحيات المخولة له بموجب قرار معالي وزير الشئون
          البلدية والقروية والإسكان رقم (1/4400485927) وتاريخ 17/7/1444 هـ
          بتفويض الصلاخيات لأمناء المناطق ومنها صلاحية إصدار قرار الموافقة على
          البدء فى إجراءات نزع الملكية للمنفعة العامة وفقا لأحكام نظام نزع ملكية
          العقارات للمنفعة العامة ووضع اليد المؤقت على العقار اصادر بقرار مجلس
          الوزراء الموقر رقم (31) تاريخ 5/2/1424 هـ والمصادق عليه المرسوم الملكي
          رقم (م/15) بتاريخ 11/3/1424 هـ ولائحته التنفيذية ، وما جاء فيها بتشكسل
          اللجنة المنصوص عليها بالمادة السابعة لتقدير قيمة نزع ملكية العقار رقم
          (120) من المخطط رقم (82/1) المملوك للمستفيدين (فيصل وحمد وعبدالرحمن
          ووفاء وهيفاء ونداء وهناء أبناء وبنات سعد بن حمد القروني) بموجب الصك
          رقم (330107041851) وتاريخ 27/3/1445 هـ الصادر من (البورصة العقارية)
        </p>
        <p>
          فقد تم عقد اجتماع لجنة تقدير نزع الملكية في يوم الأربعاء بتاريخ
          3/4/1445 هـ وفقا للمادة السابعة من نظام نزع الملكية الأنف الذكر مكونة
          من الأعضاء الأتية أسمائهم :
        </p>
        <div style={{ pageBreakAfter: "always" }}>
          <table className="table table-bordered">
            <tr>
              <td>1- </td>
              <td>مندوب إمارة منطقة المنطقة الشرقية</td>
              <td>الأستاذ / عايض بن سعد العتيبي</td>
            </tr>
            <tr>
              <td>2- </td>
              <td>مندوب وزارة العدل بالمنطقة الشرقية</td>
              <td>الشيخ / صالح بن محمد المنيع</td>
            </tr>
            <tr>
              <td>3-</td>
              <td>مندوب فرع الهيئة العامة لعقارات الدولة</td>
              <td>الأستاذ / بندر بن خالد الوسمي</td>
            </tr>
            <tr>
              <td>4- </td>
              <td>عضو الخبرة بغرفة الشرقية</td>
              <td>الأستاذ / خالد بن عبدالله النمير</td>
            </tr>
            <tr>
              <td>5- </td>
              <td>عضو الخبرة بغرفة الشرقية</td>
              <td>الأستاذ / أنس بن عادل الرشود</td>
            </tr>
            <tr>
              <td>6- </td>
              <td>مندوب أمانة المنطقة الشرقية</td>
              <td>المهندس / عمر بن مستور الغامدي</td>
            </tr>
            <tr>
              <td>7- </td>
              <td>مندوب الجهة صاحبة المشروع</td>
              <td>الأستاذ / صالح بن عبدالرحمن الراجح</td>
            </tr>
          </table>
        </div>
      </div>
      <p style={{ marginTop: "20vh" }}>
        وبعد معاينة الموقع على الطبيعة وفقا للفقرة الأولي من المادة العاشرة ،
        وبعد الإطلاع على محاضر الحصر ، وبعد مراعاة المعايير والظوابط التي
        تضمنتها السادسة عشر من الائحة التنفيذية لظام نزع ملكية العقارات للمنفعة
        العامة ووضع اليد المؤقت على العقار وتم اتخاذ أسلوب السوق (طريقة المقارنة
        للتقييم) وذلك بعد تحليل أسعار تقدير العقارات المماثلة للعقار محل التقييم
        ، ووفقا لما ورد بالفقرة الثانية البند (أ) من المادة العاشرة من نظام نزع
        الملكية المشار إليه أعلاه ، وكذلك مراعاة ما ورد بالأمر السامي الكريم رقم
        12951 وتاريخ 22/5/1400 هـ ، المتضمن (عدم المغالاة عند وضع الأسعار)
        والأمر السامي الكريم رقم 9849/م ب في 13/12/1429 هـ ، القاضي (بأن تكون
        التقديرات عادلة ووفقا للأسعار السائدة ويوضع فى اإعتبار المحافظة على
        أموال الدولة) والأمر السامي الكريم رقم (37779) وتاريخ 13/10/1434 هـ
        (القاضي بالتأكيد على مندوبي الجهات في لجان التقدير بالتقيد التام بأن
        تكون التقديرات عادلة ووفقا للأسعار العادلة ومسببة) ، أضافة الى حالة الصك
        ونوع الاستخدام مما يؤثر في قيمة التقدير ، ومراعاة ما ورد في المادة
        الثانية عشر من نظام نزع الملكية وعليه تقرر تقدير سعر المتر المربع للعقار
        المنزوع ملكيته وابالغ مساحته (750) م2 سبعمائة وخمسون متر مربعا ، وبناء
        على محضر الحصر المؤرخ في 25/2/1445 هـ فقد رأت الجنة أن السعر المناسب
        للمتر المربع الواحد للأرض هو (3000) ثلاثة آلاف ريالا سعوديا لاغير
        والبناء بمجموع مساحة (548368) خمسمائة وثمانية واربعون مترا وثمانية وستون
        سنتيمترا لكامل البناء وقدرته اللجنة بقيمة (215000) مائتان وخمسة عشر الف
        ريال وهذا يشمل السور الخرساني والحديدي وبعض المنشآت الداخليةبواقع سعر
        المتر (391.85) ريال ، وبذلكفإن مبلغ التعويض قيمة العقار شاملا المبني هة
        (2465000) مليونان وأربعمائة وخمسة وستون ألف ريال سعودي ، وبعد الإطلاع
        على قرار مجلس الوزراء رقم (323) بتاريخ 28/4/1444 هـ والصادر به المرسوم
        الملكي رقم (م/61) بتاريخ 29/4/1444 هـ والذي يشمل نصه (إضافة 20% على
        القيمة السوقية للعقار) تعويضا عن نزع الملكية وعملا بما جاء فيه{" "}
        <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
          فإن القيمة الإجمالية للتقدير هي (2958000) مليونين وتسعمائة وثمانية
          وخمسون ألف ريالا سعوديا
        </span>{" "}
        ويعتبر هذا السعر نهائي للجنة علما بان أبعاد حدود العقار النهائية هي
        كالتالي :
      </p>
      <div style={{ pageBreakAfter: "always", zoom: 0.85 }}>
        <table className="table table-bordered">
          <tr>
            <td>الإتجاه</td>
            <td style={{ textAlign: "center" }}>شمالا</td>
            <td style={{ textAlign: "center" }}>جنوبا</td>
            <td style={{ textAlign: "center" }}>شرقا</td>
            <td style={{ textAlign: "center" }}>غربا</td>
          </tr>
          <tr>
            <td>الحد</td>
            <td>شارع عرض 10 يليه موقف سيارات</td>
            <td>شارع عرض 12 م</td>
            <td>الأرض رقم 119</td>
            <td>الأرض رقم 121</td>
          </tr>
          <tr>
            <td>الطول</td>
            <td>25 م</td>
            <td>25 م</td>
            <td>30 م</td>
            <td>30 م</td>
          </tr>
          <tr>
            <td>المساحة الإجمالية</td>
            <td colSpan={4} style={{ textAlign: "center" }}>
              750 م2 سبعمائة وخمسون مترا مربعا
            </td>
          </tr>
        </table>
      </div>
      <p style={{ textAlign: "center", marginTop: "20vh" }}>
        توقيعات أعضاء اللجنة على ما ورد بالمحضر
      </p>
      <div>
        <table className="table table-bordered">
          <tr>
            <td>الجهة</td>
            <td>المندوب</td>
            <td>التوقيع</td>
          </tr>
          <tr>
            <td>مندوب إمارة منطقة المنطقة الشرقية</td>
            <td>الأستاذ / عايض بن سعد العتيبي</td>
            <td></td>
          </tr>
          <tr>
            <td>مندوب وزارة العدل بالمنطقة الشرقية</td>
            <td>الشيخ / صالح بن محمد المنيع</td>
            <td></td>
          </tr>
          <tr>
            <td>مندوب فرع الهيئة العامة لعقارات الدولة</td>
            <td>الأستاذ / بندر بن خالد الوسمي</td>
            <td></td>
          </tr>
          <tr>
            <td>عضو الخبرة بغرفة الشرقية</td>
            <td>الأستاذ / خالد بن عبدالله النمير</td>
            <td></td>
          </tr>
          <tr>
            <td>عضو الخبرة بغرفة الشرقية</td>
            <td>الأستاذ / أنس بن عادل الرشود</td>
            <td></td>
          </tr>
          <tr>
            <td>مندوب أمانة المنطقة الشرقية</td>
            <td>المهندس / عمر بن مستور الغامدي</td>
            <td></td>
          </tr>
          <tr>
            <td>مندوب الجهة صاحبة المشروع</td>
            <td>الأستاذ / صالح بن عبدالرحمن الراجح</td>
            <td></td>
          </tr>
          <tr>
            <td>أمين المنطقة الشرقية</td>
            <td>المهندس / فهد بن محمد الجبير</td>
            <td></td>
          </tr>
        </table>
      </div>
    </div>
  );
}
