import React from "react";
export default function BoundryEdit({ data }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        textAlign: "right",
        direction: "rtl",
      }}
    >
      {data == "move" ? (
        <div>
          <p>- برجاء الضغط على طول الضلع المراد تحريكه .</p>
          <p>
            - برجاء الضغط على الدائرة الحمراء أسفل طول الضلع . ({" "}
            <img src="images/red_circle.PNG" width="25px" height="25px" /> )
          </p>
          <p>
            - برجاء سحب / تحريك الضلع إلى المكان المراد . ({" "}
            <img src="images/hand_icon.PNG" width="25px" height="25px" /> )
          </p>
        </div>
      ) : data == "select" ? (
        <div>
          <p>
            - برجاء تكبير الخريطة للوصول الى مكان قطعة الأرض أو قطع الأراضي
            المراد تحديده .
          </p>
          <p>
            - برجاء الضفط مع السحب على قطعة الأرض / قطع الأراضي المراد تحديدها .
          </p>
          <p>
            - برجاء الضغط على زر إضافة الأراضي المحددة أسفل الخريطة ليتم اضافة
            الأرض / الأراضي المحددة إلى الأراضي المختارة . ({" "}
            <img
              src="images/add_selected_lands.PNG"
              width="70px"
              height="50px"
            />{" "}
            )
          </p>
          <p></p>
        </div>
      ) : data == "edit" ? (
        <div>
          <p>- برجاء الضغط على طول الضلع المراد تعديله .</p>
          <p>
            - برجاء كتابة طول الضلع الجديد بالشاشة المصغرة و الضغط على زر حفظ .
          </p>
        </div>
      ) : data == "fonts" ? (
        <div>
          <p>
            - برجاء تحديد أرقام الأراضي أو أطوال الأضلاع المراد التحكم في الخط
            بها عن طريق الوقوف علي الخريطة والسحب لتحدديد أراقام الأراضي وأطوال
            الأضلاع .
          </p>
          <p>- برجاء الضغط على مؤشر الخاص بحجم الخط للتحكم في حجم الخط .</p>
          <p>
            - برجاء الضغط علي المؤشر الخاص بزاوية الخط للتحكم فى تحديد زاوية
            الخط المراد ظهور الأرقام بها .
          </p>
          <p>
            - برجاء الضغط على المربع الملون حتي تتمكن من التحكم فى لون الخط . ({" "}
            <img src="images/color_square.PNG" width="30px" height="30px" /> )
          </p>
        </div>
      ) : data == "splitLayer" ? (
        <div>
          <p>
            - برجاء الوقوف على المؤشر مع السحب ({" "}
            <img src="images/compare_layers.png" width="30px" height="30px" /> )
            يمينا و يسارا لإخفاء وإظهار طبقة الخريطة .
          </p>
        </div>
      ) : data == "zoomStallite" ? (
        <div>
          <p>
            - برجاء الضغط على التقريب الى المصور الجغرافي حتى يتمكن النظام من
            عرض الخريطة بال (sacle) الخاص بال (map Satellite)
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}