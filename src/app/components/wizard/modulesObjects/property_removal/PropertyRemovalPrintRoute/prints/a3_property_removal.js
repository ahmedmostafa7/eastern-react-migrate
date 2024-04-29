import React, { useState, useEffect, useContext } from "react";
import { PrintContext } from "../Print_data_Provider";
export default function a3PropertyRemoval(props) {
    let {
        request_number,


    } = useContext(PrintContext) ?? props.mo3aynaObject[0];
    console.log("dataPrint", useContext(PrintContext), props.mo3aynaObject);
    return (
        <div className="A3Print" style={{ textAlign: "right", padding: "20px", zoom: .6 }}>
            <div id="first_raw" style={{ display: "grid", gridTemplateColumns: "1fr 6fr" }}>
                <div>
                    <p>الممكله العربيه اسعوديه</p>
                    <p>وزارة الشئون</p>
                    <p>أمانة المنطقه</p>
                </div>
                <div>
                    <table className="table table-bordered">
                        <tr>
                            <td>نموذج رقم 1</td>
                            <td>اسم المشروع</td>
                            <td>نزع ملكيه عقار ضارى</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                </div>
            </div>


            <div id="second_raw">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                    <div>
                        <table className="table table-bordered">
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}> مساحه كامل العقار</td>
                                <td colSpan="4" style={{ textAlign: "center" }}> مساحه الجزء المقتطع </td>
                                <td colSpan="2" rowspan="2" style={{ textAlign: "center" }}> مساحه الجزء المتبقى من الارض </td>
                                <td colSpan="2" rowspan="2" style={{ textAlign: "center" }}> مساحه الجزء المتبقى من البناء </td>

                            </tr>
                            <tr>
                                <td colSpan="2">أرض</td>
                                <td colSpan="2">بناء</td>
                                <td colSpan="2">أرض</td>
                                <td colSpan="2">بناء</td>
                            </tr>
                            <tr>
                                <td>مبنيه</td><td>95</td>
                                <td colSpan="2">
                                    <div style={{ display: "flex", borderBottom: "1px solid", justifyContent: "space-between" }}>

                                        <div > تحت الارضى </div>
                                        <div>95</div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>الارضى</div>
                                        <div>55</div>
                                    </div>
                                </td>

                                <td> مبنيه</td><td>95</td>
                                <td colSpan="2">
                                    <div style={{ display: "flex", borderBottom: "1px solid", justifyContent: "space-between" }}><div style={{}}>  الارضى </div><div>95</div></div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}><div>الاول</div><div>95</div></div>
                                </td>

                                <td>مبينيه</td><td>0</td>
                                <td rowSpan="6" colSpan={2}>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        borderBottom: "1px solid"
                                    }}>
                                        <div>ede</div>
                                        <div>555</div>
                                    </div>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        borderBottom: "1px solid"
                                    }}>
                                        <div>ede</div>
                                        <div>555</div>
                                    </div>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        borderBottom: "1px solid"
                                    }}>
                                        <div>ede</div>
                                        <div>555</div>
                                    </div>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        borderBottom: "1px solid"
                                    }}>
                                        <div>ede</div>
                                        <div>555</div>
                                    </div>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        borderBottom: "1px solid"
                                    }}>
                                        <div>ede</div>
                                        <div>555</div>
                                    </div>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        borderBottom: "1px solid"
                                    }}>
                                        <div>ede</div>
                                        <div>555</div>
                                    </div>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        borderBottom: "1px solid"
                                    }}>
                                        <div>ede</div>
                                        <div>555</div>
                                    </div>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        borderBottom: "1px solid"
                                    }}>
                                        <div>المجموع</div>
                                        <div>555</div>
                                    </div>
                                </td>

                            </tr>
                            <tr>
                                <td> غير مبنيه</td><td>95</td>
                                <td colSpan="2">
                                    <div style={{ display: "flex", borderBottom: "1px solid", justifyContent: "space-between" }}>

                                        <div > تحت الارضى </div>
                                        <div>95</div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid" }}>
                                        <div>الارضى</div>
                                        <div>55</div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>الاول</div>
                                        <div>55</div>
                                    </div>
                                </td>

                                <td>مبنيه</td><td>95</td>
                                <td colSpan="2" >
                                    <div style={{ display: "flex", borderBottom: "1px solid", justifyContent: "space-between" }}><div style={{}}>  الارضى </div><div>95</div></div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}><div>الاول</div><div>95</div></div>
                                </td>

                                <td> مبينيه غير</td><td>0</td>

                            </tr>
                            <tr >
                                <td>المجموع</td><td>95</td>
                                <td colSpan="2">
                                    <div style={{ display: "flex", borderBottom: "1px solid", justifyContent: "space-between" }}>

                                        <div > تحت الارضى </div>
                                        <div>95</div>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <div>الارضى</div>
                                        <div>55</div>
                                    </div>
                                </td>

                                <td>مبنيه</td><td>95</td>
                                <td colSpan="2">
                                    <div style={{ display: "flex", borderBottom: "1px solid", justifyContent: "space-between" }}><div style={{}}>  الارضى </div><div>95</div></div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}><div>الاول</div><div>95</div></div>
                                </td>
                                <td>المجوع</td><td>0</td>
                            </tr>
                        </table>

                        <table className="table table-bordered">
                            <tr>
                                <td colspan="4" style={{ textAlign: "center" }}>الجزء المتبقى من الارض</td>
                                <td colspan="4" style={{ textAlign: "center" }}>الجزء المتبقى من البناء</td>
                                <td>#</td>

                            </tr>
                            <tr>
                                <td colspan="2">قابل للبناء</td>
                                <td colspan="2">غير قابل للبناء</td>
                                <td colspan="2">قابل للاصلاح</td>
                                <td colspan="2">غير قابل للاصلاح</td>
                                <td></td>

                            </tr>
                            <tr>

                                <td>الوظيفه</td> <td></td>
                                <td>الوظيفه</td> <td></td>
                                <td>الوظيفه</td> <td></td>
                                <td>الوظيفه</td> <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>الاسم</td> <td></td>
                                <td>الاسم</td> <td></td>
                                <td>الاسم</td> <td></td>
                                <td>الاسم</td> <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>التوقيع</td> <td></td>
                                <td>التوقيع</td> <td></td>
                                <td>التوقيع</td> <td></td>
                                <td>التوقيع</td> <td></td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                    <div>Map</div>
                </div>
                <div>
                    <table className="table table-bordered">
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}> الحدود و الاطوال بموجب الصك</td>
                            <td colSpan="7" style={{ textAlign: "center" }}>الحدود و الاطوال بموجب الطبيعة</td>
                        </tr>
                        <tr>
                            <td>الاتجاه</td>
                            <td colSpan="4">الحدود </td>
                            <td>الطول</td>
                            <td>الاتجاه</td>
                            <td colSpan="4">الحدود </td>
                            <td>الطول</td>
                            <td>الفرق</td>
                        </tr>
                        <tr>
                            <td>شمالا</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>555</td>
                            <td>شمالا</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>555</td>
                            <td>555555</td>
                        </tr>
                        <tr>
                            <td>شمالا</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>555</td>
                            <td>شمالا</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>555</td>
                            <td>555555</td>
                        </tr>
                        <tr>
                            <td>شمالا</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>555</td>
                            <td>شمالا</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>555</td>
                            <td>555555</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <table className="table table-bordered">
                        <tr><td colSpan="4" style={{ textAlign: "center" }}>الصك الصادر</td></tr>
                        <tr>
                            <td>kklvfklfv</td>
                            <td>kklvfklfv</td>
                            <td>kklvfklfv</td>
                            <td>kklvfklfv</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <table className="table table-bordered">
                        <tr><td colSpan="7" style={{ textAlign: "center" }}>مساحه الارض و مشتملاته</td></tr>
                        <tr>
                            <td>النوع</td>
                            <td>المنزع من العقار</td>
                            <td>الوحده</td>
                            <td>سعر الوحده</td>
                            <td>القيمه</td>
                            <td colSpan={2}>اجمالى التعويض</td>
                        </tr>
                        <tr>
                            <td>ارض</td>
                            <td>55</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td ></td>
                        </tr>
                    </table>
                </div>
            </div >
        </div >
    )
}
