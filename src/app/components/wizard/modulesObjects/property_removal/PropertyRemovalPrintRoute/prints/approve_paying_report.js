import React, { useState, useEffect, useContext } from "react";
import { PrintContext } from "../Print_data_Provider";
import { convertToArabic } from "../../../../../inputs/fields/identify/Component/common";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import EditPrint from "app/components/editPrint";
export default function ApprovePaying(props) {
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
          <h5>الإدارة العامة للأراضي والممتلكات</h5>
          <h5>إدارة نزع الملكية</h5>
        </div>
      </div>
      <div
        style={{ textAlign: "left", left: "9%" }}
        className="fixed_header_print"
      >
        <p>الموضوع : الموافقة على صرف تعويض نزع الملكية العقار المملوك</p>
        <p>للمستفيد / مالك العقار رقم 120 بحي السلام بالدمام</p>
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
        &nbsp; &nbsp; &nbsp; بناءا على الصلاحيات المخولة له بموجب قرار معالي وزير الشئون البلدية والقروية والإسكان رقم (4300000057/1) وتاريخ 05/03/1443 هـ بتفويض الصلاحيات لأمناء المناطق ومنها صلاحية صرف تعويضات نزع الملكيات وأجرة المثل
      </p>
      <p>
        &nbsp; &nbsp; &nbsp; بعد الاطلاع على قرارنا رقم (45000350) بتاريخ 1/1/1445 هـ القاضي بالموافقة على بدء إجراءات نزع ملكية جميع العقارات التى تعترض تنفيذ ربط منطقة السوق المركزية بكورنيش الدمام بالمنطقة الشرقية ومنها عقار المستفيدين / فيصل و حمد و عبدالرحمن و وفاء و هيفاء و ندا و هناء و أبناء و بنات سعد بن حمد القروني ، وبعد الاطلاع على الإجراءات النظامية المنصوص عليها فى نظام نزع ملكية العقار للمنفعة العامة ووضع اليد المؤقت على العقار الصادر بالمرسوم الملكي رقم (م/15) وتاريخ 11/03/1424 هـ بتشكيل اللجنة المنصوص عليها بالمادة السابعة لتقدير قيمة نزع الملكية للعقار رقم (120) من المخطط رقم (82/1) بحي السلام بالدمام والمملوك للمدعي بموجب الصك رقم (330107041851) وتاريخ 27/3/1445 هـ. 
      </p>
      <p>
        &nbsp; &nbsp; &nbsp; وبعد الاطلاع على تقدير اللجنة المختصة لتقدير العقار المشار إليه بموج محضر الوصف والتقدير المرفق بالمعاملة
      </p>
      <p>&nbsp; &nbsp; &nbsp; وبناء على ما تقتضيه المصلحة العامة</p>
      <div>
        يقرر ما يلى :
        <p style={{ marginRight: "30px" }}>
          ١- الموافقة على نزع ملكية عقار المستفيدين / فيصل و حمد و عبدالرحمن و وفاء و هيفاء و نداء و هناء أبناء و بنات سعد بن حمد القروني رقم (120) من المخطط رقم (82/1) بحس السلام بالدمام بالأرض وفقا لصحائف نزع الملكية والمستندات المرفقة بقرارنا هذا على النحو التالي :
        </p>
        <table className="table table-bordered th-nowrap" style={{ zoom: 0.79 }}>
            <thead>
                <th>موقع العقار</th>
                <th>رقم الصك وتاريخه</th>
                <th>المساحة المنزوع ملكيتها من الارض (م2)</th>
                <th> سعر المتر المربع من الارض (الريال)</th>
                <th>إجمالي التعويض (الريال)</th>
                <th>إجمالي التعويض (الريال) بعد إضافة 20% </th>
            </thead>
            <tbody>
              <tr>
                <td>
                    مخطط رقم 82/1
                </td>
                <td>
                    330107041851
                </td>
                <td>
                    750 م2
                </td>
                <td>
                    3000 ريال
                </td>
                <td>
                    2250000 ريال
                </td>
                <td>
                    2700000 ريال
                </td>
              </tr>
            </tbody>
        </table>
        <p style={{ marginRight: "30px" }}>
          2- صرف تعويض نزع ملكية عقار المستفيد الوارد بالفقرة الأولي من هذا القرار البالغ (2958000) مليونان وتسعمائة وثمانية وخمسون ريال سعودي من تكاليف المشروع رقم (401020000) ومسماه (نزع ملكيات مختلفة) ضمن ميزانية أمانة المنطقة الشرقية للعام المالي 1444/1445 هـ .
          {/* <EditPrint
            printObj={printObj || mainObject}
            id={printId}
            path="propertyremoval.title2"
            oldText={
              title2 ||
              " 2- نشر قرارنا هذا وفقاً للفقرة الثانية من المادة الخامسة من نظام نزع الملكية المشار اليه أعلاه. "
            }
          /> */}
        </p>
        <p style={{ marginRight: "30px" }}>
          3- إتخاذ الإجراءات النظامية اللازمة للتهميش على صك ملكية العقار المذكور بما يفيد استلام التعويض وانتقال ملكية المساحة المنزوعة من الارض الموضحة أعلاه لمنفعة (أمانة المنطقة الشرقية) .
          {/* <EditPrint
            printObj={printObj || mainObject}
            id={printId}
            path="propertyremoval.title3"
            oldText={
              title3 ||
              " 3- دعوة مالكي العقارات التي تعترض تنفيذ المشروع (بشكل كلي أو جزئي) لتقديم نسخة من صك الملكية للأمانة مع توثيق تاريخ تقديمهم. "
            }
          /> */}
        </p>
        <p style={{ marginRight: "30px" }}>
          4- على الجهات المعنية كل فيما يخصه مراعاة استكمال الإجراءات النظامية الازمة قبل الصرف ويبلغ هذا للمختصين .
          {/* <EditPrint
            printObj={printObj || mainObject}
            id={printId}
            path="propertyremoval.title4"
            oldText={
              title4 ||
              " 4- تشكيل اللجنة الواردة في الفقرة الثالثة من المادة السادسة من نظام نزع ملكية العقارات للمنفعة العامة للوقوف على العقارات المراد نزع ملكيتها و اعداد المحاضر اللازمة و توقيعها و اعتمادها وفق مقتضى النظام. "
            }
          /> */}
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
