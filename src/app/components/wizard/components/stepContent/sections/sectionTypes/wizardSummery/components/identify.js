import React, { Component } from "react";
import { backEndUrlforMap, filesHost } from "imports/config";
import {
  remove_duplicate,
  convertToArabic,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
export default class identify extends Component {
  // remove_duplicate(url) {

  //   return (
  //     filesHost +
  //     url
  //       .split("/")
  //       .filter((d) => d.toLowerCase() != "GISAPI".toLowerCase())
  //       .join("/")
  //       .toString()
  //       .substring(url.toLowerCase().indexOf("subattachments"), url.length)
  //   );
  // }
  render() {
    const { parcels, conditions } =
      this.props.mainObject.landData.landData.lands;
    return (
      <div>
        <img
          src={remove_duplicate(
            this.props.mainObject.landData.submission_data.approvedUrl
          )}
          style={{ width: "100%" }}
        />
        <h1 className="titleSelectedParcel">الأراضي المختارة</h1>
        <table className="table table-bordered" style={{ marginTop: "1%" }}>
          <thead>
            <tr>
              <th>أسم البلدية</th>
              <th>رقم القطعه</th>
              <th>مساحة الأرض من الصك م2</th>
              <th>رقم المخطط</th>
              <th>رقم البلك</th>
              <th>الحي</th>
              <th>نوع التقسيم</th>
              <th>اسم التقسيم</th>
              <th>رمز الاستخدام</th>
              {parcels[0].attributes.Natural_Area && (
                <th>مساحة الأرض من الطبيعة</th>
              )}
            </tr>
          </thead>
          <tbody>
            {parcels.map((e, i) => {
              return (
                <tr key={i}>
                  <td>{convertToArabic(e.attributes.MUNICIPALITY_NAME)}</td>
                  <td>{convertToArabic(e.attributes.PARCEL_PLAN_NO)}</td>
                  <td>{convertToArabic(e.attributes.PARCEL_AREA)}</td>
                  <td>{convertToArabic(e.attributes.PLAN_NO)}</td>
                  <td>
                    {convertToArabic(e.attributes.PARCEL_BLOCK_NO) ||
                      "غير متوفر"}
                  </td>
                  <td>
                    {convertToArabic(e.attributes.DISTRICT_NAME) || "غير متوفر"}
                  </td>
                  <td>
                    {convertToArabic(e.attributes.SUBDIVISION_TYPE) ||
                      "غير متوفر"}
                  </td>
                  <td>
                    {convertToArabic(e.attributes.SUBDIVISION_DESCRIPTION) ||
                      "غير متوفر"}
                  </td>
                  <td>
                    {convertToArabic(e.attributes.USING_SYMBOL) || "غير متوفر"}
                  </td>
                  {e.attributes.Natural_Area && (
                    <td>
                      {convertToArabic(e.attributes.Natural_Area) ||
                        "غير متوفر"}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {!window.isPlusApp && !window.isAkarApp && conditions && (
          <div>
            {" "}
            <h1 className="titleSelectedParcel">الاشتراطات</h1>
            <table className="table table-bordered" style={{ marginTop: "1%" }}>
              <thead>
                <tr>
                  <th>مساحة القسيمة (م2)</th>
                  <th>الحد الأدنى للواجهة (م)</th>
                  <th>نسبة البناء</th>
                  <th>إرتداد الواجهة (م)</th>
                  <th>ارتداد الجوانب (م)</th>
                  <th>ارتداد خلفي (م)</th>
                  <th>عدد الطوابق (م)</th>
                  <th>ارتفاع الطابق (م)</th>
                  <th>معامل كتلة البناء FAR</th>
                  <th>يمكن اضافة دور</th>
                </tr>
              </thead>
              <tbody>
                {conditions.map((e, i) => {
                  return (
                    <tr key={i}>
                      <td>{convertToArabic(e.attributes.SLIDE_AREA)}</td>
                      <td>{convertToArabic(e.attributes.MIN_FROT_OFFSET)}</td>
                      <td>{convertToArabic(e.attributes.BUILDING_RATIO)}</td>
                      <td>{convertToArabic(e.attributes.FRONT_OFFSET)}</td>
                      <td>{convertToArabic(e.attributes.SIDE_OFFSET)}</td>
                      <td>{convertToArabic(e.attributes.BACK_OFFSET)}</td>
                      <td>{convertToArabic(e.attributes.FLOORS)}</td>
                      <td>{convertToArabic(e.attributes.FLOOR_HEIGHT)}</td>
                      <td>{convertToArabic(e.attributes.FAR)}</td>
                      <td>{convertToArabic(e.attributes.ADD_FLOOR)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div>
          <h1 className="titleSelectedParcel">
            {!window.isAkarApp ? "بيانات الموقع" : "حدود الموقع حسب الصك"}
          </h1>

          <table className="table table-bordered" style={{ marginTop: "1%" }}>
            <tbody>
              <tr>
                <td>وصف الحد الشمالي</td>
                <td>
                  {convertToArabic(
                    this.props.mainObject.landData.submission_data.north_desc
                  )}
                </td>
              </tr>
              <tr>
                <td>طول الحد الشمالي</td>
                <td>
                  {convertToArabic(
                    this.props.mainObject.landData.submission_data.north_length
                  )}
                </td>
              </tr>
              <tr>
                <td>وصف الحد الجنوبي</td>
                <td>
                  {convertToArabic(
                    this.props.mainObject.landData.submission_data.south_desc
                  )}
                </td>
              </tr>
              <tr>
                <td>طول الحد الجنوبي</td>
                <td>
                  {convertToArabic(
                    this.props.mainObject.landData.submission_data.south_length
                  )}
                </td>
              </tr>
              <tr>
                <td>وصف الحد الشرقي</td>
                <td>
                  {convertToArabic(
                    this.props.mainObject.landData.submission_data.east_desc
                  )}
                </td>
              </tr>
              <tr>
                <td>طول الحد الشرقي</td>
                <td>
                  {convertToArabic(
                    this.props.mainObject.landData.submission_data.east_length
                  )}
                </td>
              </tr>
              <tr>
                <td>وصف الحد الغربي</td>
                <td>
                  {convertToArabic(
                    this.props.mainObject.landData.submission_data.west_desc
                  )}
                </td>
              </tr>
              <tr>
                <td>طول الحد الغربي</td>
                <td>
                  {convertToArabic(
                    this.props.mainObject.landData.submission_data.west_length
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {this.props.mainObject.landData.akar_data && (
          <div>
            {" "}
            <h1 className="titleSelectedParcel">بيانات العقار</h1>
            <table className="table table-bordered" style={{ marginTop: "1%" }}>
              <thead>
                <tr>
                  <th>اسم الموقع</th>
                  <th>وصف العقار</th>
                  <th>رقم المبني</th>
                  <th>نوع الاستعمال</th>
                  <th>القيمة التقديرية للموقع</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {convertToArabic(
                      this.props.mainObject.landData.akar_data.loc_name
                    )}
                  </td>
                  <td>
                    {convertToArabic(
                      this.props.mainObject.landData.akar_data.desc
                    )}
                  </td>
                  <td>
                    {convertToArabic(
                      this.props.mainObject.landData.akar_data.number
                    )}
                  </td>
                  <td>
                    {convertToArabic(
                      this.props.mainObject.landData.akar_data.using
                    )}
                  </td>
                  <td>
                    {convertToArabic(
                      this.props.mainObject.landData.akar_data.price
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {this.props.mainObject.landData.loc_data && (
          <div>
            {" "}
            <h1 className="titleSelectedParcel">بيانات الموقع</h1>
            <table className="table table-bordered" style={{ marginTop: "1%" }}>
              <thead>
                <tr>
                  <th>حالة الموقع</th>
                  <th>رقم المعاملة المرتبطة</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    {convertToArabic(
                      this.props.mainObject.landData.loc_data.loc_status
                    )}
                  </td>
                  <td>
                    {convertToArabic(
                      this.props.mainObject.landData.loc_data.request_no
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}
