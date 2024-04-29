import React, { useState, useEffect, useContext } from "react";
import { PrintContext } from "../Print_data_Provider";
import { convertToArabic } from "../../../../../inputs/fields/identify/Component/common";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import EditPrint from "app/components/editPrint";
export default function InitProcedurePrint(props) {
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
    mun
  } = useContext(PrintContext) ?? props.mo3aynaObject[0];
  console.log("dataPrint", useContext(PrintContext), props.mo3aynaObject);
  return (
    <div
      className="printContainerHeight"
      style={{
        marginTop: "10vh",
        // zoom: ".9",
        lineHeight: 3,
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

      <div className="HeaderPrint fixed_header_print">
        <div>
          {/* <h5>الممكله </h5>
                    <h5>وزارة</h5>
                    <h5>أمانة</h5> */}
          <h5>الإدارة العامة للأراضي والممتلكات</h5>
          <h5>إدارة نزع الملكية</h5>
        </div>
        {/* <div><img src="images/logo2.png" width="100px" /></div>
                <div>3</div> */}
      </div>
      <div
        style={{ textAlign: "left", left: "9%" }}
        className="fixed_header_print"
      >
        <p>الموضوع : بشأن نزع ملكية العقارات التي تعترض</p>
        <p>{project.project_name}</p>
      </div>

      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          textDecoration: "underline",
          marginTop: "9vh",
        }}
      >
        قرار
      </div>
      <p>إن أمين المنطقة الشرقية</p>
      <p>
        &nbsp; &nbsp; &nbsp; بناءً على المرسوم الملكي رقم ({" "}
        {convertToArabic("م/15")} ) في {convertToArabic("11/3/1424")} هـ القاضي
        بالموافقة على نظام نزع ملكية العقارات للمنفعة العامة و وضع اليد المؤقت
        على العقار و لائحته التنفيذية الصادرة بقرار مجلس الوزراء رقم ({" "}
        {convertToArabic("54")} ) و تاريخ {convertToArabic("11/2/1437")} هـ ، و
        بناءً على الصلاحيات المخولة له بموجب قرار معالي وزير الشؤون البلدية
        والقروية والإسكان رقم ( {convertToArabic("1/4400485927")} ) وتاريخ{" "}
        {convertToArabic("17/7/1444")} هـ بتفويض الصلاحيات لأمناء المناطق ومنها
        صلاحية اصدار قرار الموافقة على البدء في إجراءات نزع الملكية للمنفعة
        العامة وفقا لأحكام نظام نزع ملكية العقارات للمنفعة العامة و وضع اليد
        المؤقت على العقار و لائحته التنفيذية.
      </p>
      <p>&nbsp; &nbsp; &nbsp; وبناء على ما تفتضيه المصلحة العامة</p>
      <div>
        يقرر ما يلى :
        <p style={{ marginRight: "30px" }}>
          ١- الموافقة على بدء اجراءات نزع ملكية جميع العقارات التي تعترض (
           {convertToArabic(project.project_name)} ) في مدينة {mun} بالمنطقة
          الشرقية من اعتماد المشروع رقم ( {convertToArabic(band_data.band_number)} ) و مسماه ( {convertToArabic(band_data.band_name)} )
           ضمن ميزانية الأمانة للعام المالي ( {convertToArabic(band_data.financial_year)} ).
        </p>
        <p style={{ marginRight: "30px" }}>
          {/* 2- نشر قرارنا هذا وفقاً للفقرة الثانية من المادة الخامسة من نظام نزع
          الملكية المشار اليه أعلاه. */}
          <EditPrint
            printObj={printObj || mainObject}
            id={printId}
            path="propertyremoval.title2"
            oldText={
              title2 ||
              " 2- نشر قرارنا هذا وفقاً للفقرة الثانية من المادة الخامسة من نظام نزع الملكية المشار اليه أعلاه. "
            }
          />
        </p>
        <p style={{ marginRight: "30px" }}>
          {/* 3- دعوة مالكي العقارات التي تعترض تنفيذ المشروع (بشكل كلي أو جزئي)
          لتقديم نسخة من صك الملكية للأمانة مع توثيق تاريخ تقديمهم. */}
          <EditPrint
            printObj={printObj || mainObject}
            id={printId}
            path="propertyremoval.title3"
            oldText={
              title3 ||
              " 3- دعوة مالكي العقارات التي تعترض تنفيذ المشروع (بشكل كلي أو جزئي) لتقديم نسخة من صك الملكية للأمانة مع توثيق تاريخ تقديمهم. "
            }
          />
        </p>
        <p style={{ marginRight: "30px" }}>
          {/* 4- تشكيل اللجنة الواردة في الفقرة الثالثة من المادة السادسة من نظام
          نزع ملكية العقارات للمنفعة العامة للوقوف على العقارات المراد نزع
          ملكيتها و اعداد المحاضر اللازمة و توقيعها و اعتمادها وفق مقتضى النظام. */}
          <EditPrint
            printObj={printObj || mainObject}
            id={printId}
            path="propertyremoval.title4"
            oldText={
              title4 ||
              " 4- تشكيل اللجنة الواردة في الفقرة الثالثة من المادة السادسة من نظام نزع ملكية العقارات للمنفعة العامة للوقوف على العقارات المراد نزع ملكيتها و اعداد المحاضر اللازمة و توقيعها و اعتمادها وفق مقتضى النظام. "
            }
          />
        </p>
        <p
          style={{
            marginRight: "30px",
            pageBreakBefore: "always",
            marginTop: "30vh",
          }}
        >
          {/* 5- تشكيل اللجنة الواردة في المادة السابعة من نظام نزع ملكية العقارات
          للمنفعة العامة و كذلك الفقرة السابعة من المادة الخامسة عشره من لائحته
          التنفيذية لتقدير العقارات المنوه عنها – على أن يتم التقيد بالأمر
          السامي الكريم رقم 9849/م ب في13/12/1429هـ القاضي بعدم المبالغة في
          التقديرات و التعميم البرقي السامي الكريم رقم 37779 في 12/10/1434هـ
          القاضي بأن تكون التعديلات عادلة و وفقا للأسعار السائدة بالسوق و مسببه،
          و أن تضع لجان التقدير في اعتبارها أهمية المحافظة على المال العام- و
          إعداد المحاضر اللازمة مع إيضاح مراتب أعضاء اللجان (لا تقل عن السادسة)
          و مؤهل مندوب وزارة العدل( لا يقل عن المؤهل المقرر للتعيين في السلك
          القضائي – بكالوريوس شريعة) و أرقام عضوية مندوبي الغرفة التجارية بهيئة
          المقيمين المعتمدين على أن يكونوا من حاملي الشهادة الجامعية الحاصلين
          دورات تدريبية معتمدة من الهيئة السعودية للمقيمين المعتمدين وفقا لمقتضى
          الأمر السامي الكريم رقم 11988 في 12/3/1439هـ و توقيع المحضرين و
          اعتمادهما و تبليغ مالكي العقارات المقرر نزع ملكيتها بالتعويض المقدر
          بالطرق الإدارية وفق مقتضى النظام. */}
          <EditPrint
            printObj={printObj || mainObject}
            id={printId}
            path="propertyremoval.title5"
            oldText={
              title5 ||
              " 5- تشكيل اللجنة الواردة في المادة السابعة من نظام نزع ملكية العقارات للمنفعة العامة وكذلك الفقرة السابعة من المادة الخامسة عشره من لائحته التنفيذية لتقدير العقارات المنوه عنها – على أن يتم التقيد بالأمر السامي الكريم رقم 9849/م ب في13/12/1429هـ القاضي بعدم المبالغة في التقديرات والتعميم البرقي السامي الكريم رقم 37779 في 12/10/1434هـ القاضي بأن تكون التعديلات عادلة ووفقا للأسعار السائدة بالسوق ومسببه وأن تضع لجان التقدير في اعتبارها أهمية المحافظة على المال العام - وإعداد المحاضر اللازمة مع إيضاح مراتب أعضاء اللجان (لا تقل عن السادسة) ومؤهل مندوب وزارة العدل ( لا يقل عن المؤهل المقرر للتعيين في السلك القضائي – بكالوريوس شريعة) وأرقام عضوية مندوبي الغرفة التجارية بهيئة المقيمين المعتمدين على أن يكونوا من حاملي الشهادة الجامعية الحاصلين دورات تدريبية معتمدة من الهيئة السعودية للمقيمين المعتمدين وفقا لمقتضي الأمر السامي الكريم رقم 11988 في 12/3/1439هـ وتوقيع المحضرين واعتمادهما وتبليغ مالكي العقارات المقرر نزع ملكيتها بالتعويض المقدر بالطرق الإدارية وفق مقتضي النظام.، "
            }
          />
        </p>
        <p style={{ marginRight: "30px" }}>
          {/* 6- الرفع لنا بعد اكتمال المعاملة و اعداد صحائف نزع الملكية و ذلك
          لإصدار قرار بالموافقة على صرف التعويضات للعقارات المتضمنة بالمشروع. */}
          <EditPrint
            printObj={printObj || mainObject}
            id={printId}
            path="propertyremoval.title6"
            oldText={
              title6 ||
              " 6- الرفع لنا بعد اكتمال المعاملة و اعداد صحائف نزع الملكية و ذلك لإصدار قرار بالموافقة على صرف التعويضات للعقارات المتضمنة بالمشروع. "
            }
          />
        </p>
        <p style={{ textAlign: "center" }}>والله ولي التوفيق ,,,</p>
      </div>
      {/* <div style={{ display: "grid", justifyContent: "end", gridGap: "30px" }}>
        <h4>أمين المنطقة الشرقية</h4>
        <h4 style={{ marginRight: "-100px" }}>المهندس /</h4>
        <h4>فهد بن محمد الجبير</h4>
      </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          // alignItems: "center",
        }}
      >
        {propertyRemovalUser && province_id !== null && (
          <div>
            <img
              src={`${filesHost}/users/${propertyRemovalUser?.id}/sub_sign.png`}
              width="80px"
            />
          </div>
        )}
        {committeeactors1?.is_approved && province_id !== null && (
          <div>
            <img
              src={`${filesHost}/users/${committeeactors1_id}/sub_sign.png`}
              width="80px"
            />
          </div>
        )}

        <div className="printFooter" style={{ marginLeft: "35px" }}>
          {/* <h5>أمين المنطقة الشرقية</h5> */}
          <h5>{committeeactors2?.position}</h5>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <h5 style={{ marginLeft: "30px" }}>المهندس /</h5>
            <h5 style={{ marginLeft: "25px" }}>
              {committeeactors2?.is_approved && province_id && (
                <img
                  src={`${filesHost}/users/${committeeactors2_id}/sign.png`}
                  width="150px"
                />
              )}
            </h5>
          </div>
          <h5>{committeeactors2?.name}</h5>
          {/* <h5>فهد بن محمد الجبير</h5> */}
        </div>
      </div>
    </div>
  );
}
