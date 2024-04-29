import React, { Component } from "react";
import { get } from "lodash";
import { message, Button } from "antd";
import axios from "axios";
import Header from "app/components/print/header";
export default class printMa7dar extends Component {
  render() {
    return (
      <>
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
              className="content-m7dar_two"
            >
              <div style={{ height: "16vh" }}></div>
              <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
                محضر اللجنة الفنية
              </h2>
              <br />
              <div style={{ margin: "5px", textAlign: "justify" }}>
                <p className="text_type">
                  إشارة الى تعميم معالى وزير الشئون البلدية و القروية رقم 46847
                  فى تاريخ 1438/10/24 هـ المشار فيه الى الأمر السامى الكريم رقم
                  41882 و تاريح 1438/9/12 هـ القاضى بالموافقة على ما وجه به مجلس
                  الوزراء بأعتماد الاجراءات والضوابط و الشروط لضم الشوارع و
                  الممرات للملكيات المجاورة لها الموضحه تفصيلا فى كتاب سمو
                  الأمين العام لمجلس الوزراء رقم 5110 فى 1438/7/27 هـ .
                </p>
                <p className="text_type">
                  و بناءا على البند الاول من اللائحة المشار اليها يتم تشكيل لجنة
                  من الإ دارات المختصة لكل أمانة و بلدية تكون مهمتها دراسة طلب
                  ضم الشوارع وممرات المشاة(الطرق الداخلية) و دمجها بالقطع
                  المجاورة و قد تم استيفاء الضوابط و الشروط وهى كالآتى :-
                </p>
                <p className="text_type">
                  1-ممر المشاة فاصلا بين أملاك صاحب الطلب فقط
                </p>
                <p className="text_type">
                  2- الممر ليس له نفعا عام أو صفة المرفق العام
                </p>
                <p className="text_type">
                  3- الممر لا يوجد به ضرر على المجاورين بعد أن تم أخذ موافقات
                  خطية منهم على إلغائه
                </p>
                <p className="text_type">
                  4-تم تحديد الوسيلة التى تعود بالفائدة على الأمانة أن يكون
                  بالبيع
                </p>
                <p className="text_type">
                  و فى يوم الأثنين الموافق 1439/3/9 هـ تم إجتماع أعضاء اللجنة
                  الفنية المنوه عنها , و بدراسة المعاملة المتعلقة بطلب المواطنين
                  /إبراهيم و عمر أبناء محمد القضيب ضم ممر المشاة الواقع بين
                  املاكهم بالمخطط رقم (38) بالراكة بمحافظة الخبر والبالغ مساحته
                  الإجمالية (222,80 م2)
                </p>
                <p className="text_type">
                  و فى يوم الأثنين الموافق 1439/3/9 هـ تم إجتماع أعضاء اللجنة
                  الفنية المنوه عنها , و بدراسة المعاملة المتعلقة بطلب المواطنين
                  /إبراهيم و عمر أبناء محمد القضيب ضم ممر المشاة الواقع بين
                  املاكهم بالمخطط رقم (38) بالراكة بمحافظة الخبر والبالغ مساحته
                  الإجمالية (222,80 م2)
                </p>
              </div>
              <h3 className="text_type" style={{ textAlign: "center" }}>
                وعليه جرى التوقيع ,,, و الله الموفق
              </h3>
              <h3 className="text_type" style={{ textAlign: "center" }}>
                أعضاء اللجنة ,,,
              </h3>
              <div className="lagna_members">
                <div>مندوب إدارة المساحة</div>
                <div>مندوب الأراضي و الممتلكات</div>
                <div>مندوب إدارة التخطيط</div>
                <div>المهندس/ماجد عوض الأسمرى</div>
                <div>المساح/سليمان عبد الله العليط</div>
                <div>المهندس / راشد خالد الخضير</div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
