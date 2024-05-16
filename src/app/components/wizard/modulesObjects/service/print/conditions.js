import React, { Component } from "react";
import { get_print_data_by_id } from "app/components/inputs/fields/identify/Component/common/common_func";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import { get, map } from "lodash";
import { convertToArabic } from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import CustomSlider from "app/components/editPrint/zoomEdit";
// import CustomSlider from "app/components/zoomEdit/";
export default class Conditions extends Component {
  state = {
    data: [],
  };
  componentDidMount() {
    initializeSubmissionData(this.props.params.id).then((res) => {
      let mainObject = res.mainObject;
      let submissionData = res.submission;
      // mainObject.printTextEdited.title1,

      let committee_report_no = get(submissionData, "committee_report_no");

      this.setState({
        committee_report_no,
        mainObject: mainObject,
        zoomProps: mainObject?.printTextEdited?.serviceSubmissionType.zoomLevel,
        id: this.props.params.id,

        // path:"",
      });
      console.log("data_print", mainObject, submissionData);
      this.setPrintValues(mainObject, submissionData);
    });
    // mainObject.printTextEdited.map(d=>{
    //   this.state[d]=
    // })
  }
  setPrintValues(mainObject, submissionData) {
    console.log("conditions", mainObject, submissionData);
    let data_table = mainObject?.serviceSubmissionType?.data_table.main;
    var owner =
      mainObject.ownerData &&
      mainObject.ownerData.ownerData.owners[
        Object.keys(mainObject.ownerData.ownerData.owners)[0]
      ];
    var ownerdesc = "";
    var kind = "";
    if (owner) {
      if (owner.ssn) {
        ownerdesc = "المواطن / " + owner.name;
      } else if (owner.commercial_registeration) {
        ownerdesc = "الشركة / " + owner.name;
      } else if (owner.code_regesteration) {
        ownerdesc = "الجهة / " + owner.name;
      }

      if (owner.ssn) {
        kind = "المواطن "; //"/ " + owner.name;
      } else if (owner.commercial_registeration) {
        kind = "الشركة "; // + owner.name;
      } else if (owner.code_regesteration) {
        kind = "الجهة "; //+ owner.name;
      }
    }
    let identity = Object.values(mainObject.ownerData.ownerData.owners)[0].ssn;
    //     Object.values(mainObject.ownerData.ownerData.owners).forEach((owner) => {
    //       let ownerSSn = owner.ssn
    // });
    let phone_number = Object.values(mainObject.ownerData.ownerData.owners)[0]
      .mobile;
    let city =
      mainObject.LandWithCoordinate.landData.lands.parcels[0].attributes
        .MUNICIPALITY_NAME;
    let municipality_name =
      mainObject.LandWithCoordinate.landData.lands.parcels[0].attributes
        .MUNICIPALITY_NAME;
    let district_name =
      mainObject.LandWithCoordinate.landData.lands.parcels[0].attributes
        .DISTRICT_NAME;
    let street_name =
      mainObject.LandWithCoordinate.landData.lands.parcels[0].attributes
        .STREET_NAME;
    let plan_no =
      mainObject.LandWithCoordinate.landData.lands.parcels[0].attributes
        .PLAN_NO;
    let parcel_no = mainObject.LandWithCoordinate.landData.lands.parcels
      .map((parcel) => parcel.attributes.PARCEL_PLAN_NO)
      .join(" - ");
    // let coordinates =
    // mainObject.printTextEdited
    let station_type =
      mainObject.serviceSubmissionType.data_table.utilitysubtype_id;
    let school_gender =
      mainObject.serviceSubmissionType.submission.school_gender;
    let school_name = mainObject.serviceSubmissionType?.submission.school_name;
    let school_type = mainObject.serviceSubmissionType?.submission.school_type;
    let educational_level =
      mainObject.serviceSubmissionType?.submission?.utilitysubtype?.name;
    let hospital_name =
      mainObject.serviceSubmissionType?.submission?.utilitysubtype?.name;
    let wedding_description =
      mainObject.serviceSubmissionType?.submission?.utilitysubtype?.name;
    let cafe_description =
      mainObject.serviceSubmissionType?.submission?.utilitysubtype?.name;

    this.setState({
      data_table,
      ownerdesc,
      identity,
      phone_number,
      mainObject,
      city,
      municipality_name,
      district_name,
      street_name,
      plan_no,
      parcel_no,
      // coordinates,
      station_type,
      school_gender,
      school_name,
      school_type,
      educational_level,
      hospital_name,
      wedding_description,
      cafe_description,
    });
  }

  render() {
    let {
      title,
      data_table = "",
      ownerdesc = "",
      identity = "",
      phone_number,
      mainObject,
      id,
      SliderValue,
      path,
      city = "",
      municipality_name = "",
      district_name = "",
      street_name = "",
      plan_no,
      parcel_no,
      // coordinates,
      station_type = "",
      school_gender = "",
      school_name = "",
      school_type = "",
      educational_level = "",
      hospital_name = "",
      wedding_description = "",
      cafe_description = "",
      zoomStyle = 1,
      // coordinates = "",
      zoomProps,
    } = this.state;

    let utilitytype_id =
      mainObject &&
      mainObject["serviceSubmissionType"].submission.utilitytype_id;
    //  let titleEdit={"name":[{"title1":title1},{"title2":title2}]}
    //  let titleEdit2={name:"title2" ,value:title2}
    return (
      // <CustomSlider
      //   mainObject={mainObject}
      //   path="serviceSubmissionType.zoomLevel"
      //   id={id}
      //   // zoomProps={zoomProps}
      // >
      <div className="table-report-container conditions_print">
        <div>
          <button
            className="btn add-btnT printBtn"
            onClick={() => {
              window.print();
            }}
          >
            طباعة
          </button>
        </div>
        <div
          style={{
            padding: "12px",
            border: "1px solid",
            margin: "10px 0px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            textAlign: "center",
          }}
        >
          <div>
            <p>أمانة المنطقة الشرقية</p>
            <p>وكالة التعمير والمشاريع</p>
          </div>
          <div>
            <p>الإدارة العامة للتخطيط العمراني</p>
            {utilitytype_id == "1" && (
              <p>إستمارة متطلبات إنشاء المدارس الأهلية على الأراضي</p>
            )}
            {utilitytype_id == "2" && (
              <parcel_no>إستمارة متطلبات إنشاء مباني الصحة</parcel_no>
            )}
            {utilitytype_id == "3" && (
              <p>
                تقرير مبدئي للترخيص بإقامة محطة وقود داخل المخططات المعتمدة
                للمدن والقري
              </p>
            )}
            {utilitytype_id == "4" && (
              <p>إستمارة متطلبات إنشاء قصور الأفراح والإستراحات</p>
            )}
            {utilitytype_id == "5" && (
              <p>إستمارة متطلبات إنشاء المقاهي الشعبية</p>
            )}
          </div>
          <div>
            <img src="images/logo2.png" style={{ width: "75px" }} alt="" />
          </div>
        </div>

        {/* for Schools */}
        {utilitytype_id == "1" && (
          <div>
            <div
              style={{
                padding: "12px",
                border: "1px solid",
                margin: "10px 0px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                textAlign: "center",
              }}
            >
              <h3 style={{ textAlign: "center" }}>
                معلومات عن صاحب الطلب و المدرسة
              </h3>
            </div>
            <table
              className="table table-bordered table_conditons"
              style={{ marginBottom: 0 }}
            >
              {/* <tr>
              <td colSpan="6" style= {{ textAlign: "center"}}>معلومات عن صاحب الطلب و المدرسة</td>
            </tr> */}
              <tr>
                <td>اسم صاحب الطلب</td>
                <td>{ownerdesc}</td>
                <td>رقم السجل المدني</td>
                <td>{convertToArabic(identity)}</td>
                <td>رقم الهاتف</td>
                <td>{convertToArabic(phone_number)}</td>
              </tr>
              <tr>
                <td>المدينة</td>
                <td>{city}</td>
                <td>الحي</td>
                <td>{district_name}</td>
                <td>فئة المدرسة</td>
                <td>{school_gender}</td>
                {/* <td>الشارع</td>
                <td>{street_name || "غير متوفر"}</td> */}
              </tr>
              <tr>
                {/* <td>فئة المدرسة</td>
                <td>{school_gender}</td> */}
                <td>المرحلة التعليمية</td>
                <td>{educational_level}</td>
                <td>اسم المدرسة</td>
                <td>{school_name}</td>
                <td>نوع المدرسة</td>
                <td>{school_type}</td>
                {/* <td>الموقع</td>
                <td></td> */}
              </tr>
              {/* <tr>
                <td>اسم المدرسة</td>
                <td colSpan="2">{school_name}</td>
                <td>نوع المدرسة</td>
                <td colSpan="2">{school_type}</td>
              </tr> */}
            </table>
            <table className="table table-bordered table_conditons">
              <thead>
                <th colSpan="3" style={{ textAlign: "center" }}>
                  الإشتراطات
                </th>
                <th>مطابق</th>
                <th>غير مطابق</th>
                <th>ملاحظات</th>
              </thead>
              <tbody>
                {data_table &&
                  map(data_table, (d, k) => {
                    return (
                      <tr key={k}>
                        <td colSpan="3">{convertToArabic(d.name)}</td>
                        <td>
                          {d.verified && (
                            <span>
                              <i className="fas fa-check"></i>
                            </span>
                          )}
                        </td>
                        <td>
                          {!d.verified && (
                            <span>
                              <i className="far fa-times-circle"></i>
                            </span>
                          )}
                        </td>
                        <td>{d?.comment}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* for healthy buildings */}
        {utilitytype_id == "2" && (
          <div>
            <div
              style={{
                padding: "12px",
                border: "1px solid",
                margin: "10px 0px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                textAlign: "center",
              }}
            >
              <h3 style={{ textAlign: "center" }}>معلومات عن صاحب الطلب</h3>
            </div>
            <table
              className="table table-bordered table_conditons"
              style={{ marginBottom: 0 }}
            >
              {/* <tr>
              <td colSpan="6" style= {{ textAlign: "center"}}>معلومات عن صاحب الطلب</td>
            </tr> */}
              <tr>
                <td>اسم صاحب الطلب</td>
                <td>{ownerdesc}</td>
                <td>رقم السجل المدني</td>
                <td>{convertToArabic(identity)}</td>
                <td>رقم الهاتف</td>
                <td>{convertToArabic(phone_number)}</td>
              </tr>
              <tr>
                <td>المدينة</td>
                <td>{city}</td>
                <td>الحي</td>
                <td>{district_name}</td>
                <td>اسم المستشفي / المركز</td>
                <td>{hospital_name}</td>
              </tr>
              {/* <tr>
                <td>الفئة</td>
                <td></td>
                <td>الشارع</td>
                <td>{street_name || "غير متوفر"}</td>
                <td>الموقع</td>
                <td></td>
              </tr> */}
            </table>
            <table className="table table-bordered table_conditons">
              <thead>
                <th colSpan="3" style={{ textAlign: "center" }}>
                  الإشتراطات
                </th>
                <th>مطابق</th>
                <th>غير مطابق</th>
                <th>ملاحظات</th>
              </thead>
              <tbody>
                <tr colSpan="4"></tr>
                {data_table &&
                  map(data_table, (d, k) => {
                    return (
                      <tr key={k}>
                        <td colSpan="3">{convertToArabic(d.name)}</td>
                        <td>
                          {d.verified && (
                            <span>
                              <i className="fas fa-check"></i>
                            </span>
                          )}
                        </td>
                        <td>
                          {!d.verified && (
                            <span>
                              <i className="far fa-times-circle"></i>
                            </span>
                          )}
                        </td>
                        <td>{d?.comment}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* for fuel stations */}
        {utilitytype_id == "3" && (
          <div>
            <div
              style={{
                padding: "12px",
                border: "1px solid",
                margin: "10px 0px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                textAlign: "center",
              }}
            >
              <h3 style={{ textAlign: "center" }}>بيانات طالب الرخصة</h3>
            </div>
            <table
              className="table table-bordered table_conditons"
              style={{ marginBottom: 0 }}
            >
              <tbody>
                {/* <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}></td>
                </tr> */}
                <tr>
                  <td>اسم صاحب الرخصة</td>
                  <td colSpan="2">{ownerdesc}</td>
                  <td>رقم السجل المدنى</td>
                  <td colSpan="2">{convertToArabic(identity)}</td>
                </tr>
                <tr>
                  <td>المدينة</td>
                  <td colSpan="2">{city}</td>
                  <td>الأمانة / البلدية</td>
                  <td colSpan="2">{municipality_name}</td>
                  {/* <td>الحي</td>
                  <td>{district_name}</td> */}
                </tr>
                <tr>
                  <td>الحي</td>
                  <td colSpan="2">{district_name}</td>
                  <td>فئة المحطة</td>
                  <td colSpan="2">{station_type}</td>
                  {/* <td>الشارع</td>
                  <td>{street_name || "غير متوفر"}</td>
                  <td>إحداثيات (GPS)</td>
                  <td></td> */}
                </tr>
              </tbody>
            </table>
            <table className="table table-bordered table_conditons">
              <thead>
                {/* <th>م</th> */}
                <th colSpan="3" style={{ textAlign: "center" }}>
                  الإشتراطات
                </th>
                <th>مطابق</th>
                <th>غير مطابق</th>
                <th>ملاحظات</th>
              </thead>
              <tbody>
                {data_table &&
                  map(data_table, (d, k) => {
                    return (
                      <tr key={k}>
                        {/* <td>{d.id}</td> */}
                        <td colSpan="3">{convertToArabic(d.name)}</td>
                        <td>
                          {d.verified && (
                            <span>
                              <i className="fas fa-check"></i>
                            </span>
                          )}
                        </td>
                        <td>
                          {!d.verified && (
                            <span>
                              <i className="far fa-times-circle"></i>
                            </span>
                          )}
                        </td>
                        <td>{d?.comment}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* for Wedding Palaces */}
        {utilitytype_id == "4" && (
          <div>
            <div
              style={{
                padding: "12px",
                border: "1px solid",
                margin: "10px 0px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                textAlign: "center",
              }}
            >
              <h3 style={{ textAlign: "center" }}>معلومات عن صاحب الطلب</h3>
            </div>
            <table
              className="table table-bordered table_conditons"
              style={{ marginBottom: 0 }}
            >
              {/* <tr>
              <td colSpan="6" style= {{ textAlign: "center"}}>معلومات عن صاحب الطلب</td>
            </tr> */}
              <tr>
                <td>اسم صاحب الطلب</td>
                <td>{ownerdesc}</td>
                <td>رقم السجل المدني</td>
                <td>{convertToArabic(identity)}</td>
                <td>رقم الهاتف</td>
                <td>{convertToArabic(phone_number)}</td>
              </tr>
              <tr>
                <td>المدينة</td>
                <td>{city}</td>
                <td>الحي</td>
                <td>{district_name}</td>
                <td>وصف الخدمة</td>
                <td>{wedding_description}</td>
                {/* <td>الشارع</td>
                <td>{street_name || "غير متوفر"}</td> */}
              </tr>
              <tr>
                {/* <td>الفئة</td>
                <td></td> */}
                <td>بالمخطط</td>
                <td colSpan="2">{convertToArabic(plan_no)}</td>
                <td>الموقع المطلوب على القطعة رقم</td>
                <td colSpan="2">{convertToArabic(parcel_no)}</td>
              </tr>
            </table>
            <table className="table table-bordered table_conditons">
              <thead>
                <th colSpan="3" style={{ textAlign: "center" }}>
                  الإشتراطات
                </th>
                <th>مطابق</th>
                <th>غير مطابق</th>
                <th>ملاحظات</th>
              </thead>
              <tbody>
                {data_table &&
                  map(data_table, (d, k) => {
                    return (
                      <tr key={k}>
                        <td colSpan="3">{convertToArabic(d.name)}</td>
                        <td>
                          {d.verified && (
                            <span>
                              <i className="fas fa-check"></i>
                            </span>
                          )}
                        </td>
                        <td>
                          {!d.verified && (
                            <span>
                              <i className="far fa-times-circle"></i>
                            </span>
                          )}
                        </td>
                        <td>{d?.comment}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* for Cafe */}
        {utilitytype_id == "5" && (
          <div>
            <div
              style={{
                padding: "12px",
                border: "1px solid",
                margin: "10px 0px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                textAlign: "center",
              }}
            >
              <h3 style={{ textAlign: "center" }}>معلومات عن صاحب الطلب</h3>
            </div>
            <table
              className="table table-bordered table_conditons"
              style={{ marginBottom: 0 }}
            >
              <tr>
                <td>اسم صاحب الطلب</td>
                <td>{ownerdesc}</td>
                <td>رقم السجل المدني</td>
                <td>{convertToArabic(identity)}</td>
                <td>رقم الهاتف</td>
                <td>{convertToArabic(phone_number)}</td>
              </tr>
              <tr>
                <td>المدينة</td>
                <td>{city}</td>
                <td>الحي</td>
                <td>{district_name}</td>
                <td>وصف الخدمة</td>
                <td>{cafe_description}</td>
                {/* <td>الشارع</td>
                <td>{street_name || "غير متوفر"}</td> */}
              </tr>
              {/* <tr>
                <td>الفئة</td>
                <td></td>
                <td>بالمخطط</td>
                <td colSpan="2">{convertToArabic(plan_no)}</td>
                <td>الموقع المطلوب على القطعة رقم</td>
                <td colSpan="2">{convertToArabic(parcel_no)}</td>
              </tr> */}
            </table>
            <table className="table table-bordered table_conditons">
              <thead>
                <th colSpan="3" style={{ textAlign: "center" }}>
                  الإشتراطات
                </th>
                <th>مطابق</th>
                <th>غير مطابق</th>
                <th>ملاحظات</th>
              </thead>
              <tbody>
                {data_table &&
                  map(data_table, (d, k) => {
                    return (
                      <tr key={k}>
                        <td colSpan="3">{convertToArabic(d.name)}</td>
                        <td>
                          {d.verified && (
                            <span>
                              <i className="fas fa-check"></i>
                            </span>
                          )}
                        </td>
                        <td>
                          {!d.verified && (
                            <span>
                              <i className="far fa-times-circle"></i>
                            </span>
                          )}
                        </td>
                        <td>{d?.comment}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      // </CustomSlider>
    );
  }
}
