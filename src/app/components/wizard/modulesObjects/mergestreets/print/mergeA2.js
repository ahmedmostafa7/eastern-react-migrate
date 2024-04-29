import { Descriptions, Modal, Col, Row } from "antd";
import React, { useState, useEffect, useContext, Component } from "react";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import styled, { css } from "styled-components";
import { get, isEmpty, map } from "lodash";
// import { PrintContext } from "../../../../editPrint/Print_data_Provider";
import SignPics from "../../../../editPrint/signPics";
import {
  convertToArabic,
  localizeNumber,
  checkImage,
  selectActors,
  getUsingSymbols,
} from "app/components/inputs/fields/identify/Component/common/common_func";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import axios from "axios";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import { esriRequest } from "../../../../inputs/fields/identify/Component/common/esri_request";
import { queryTask_updated } from "../../../../inputs/fields/identify/Component/common/common_func";

export default class addstreets extends Component {
  state = { data: [] };
  componentDidMount() {
    console.log("match_id", this.props.match.params.id);
    initializeSubmissionData(this.props.match.params.id).then((response) => {
      var mainObject = response.mainObject;
      let ceator_user_name = response.ceator_user_name;
      let submission = response.submission;
      this.state["historydata"] = response.historyData;
      let userIdeng =
        mainObject?.engUserNameToPrint?.engUser?.id ||
        (this.state["historydata"]?.data?.results?.length &&
          this.state["historydata"]?.data?.results?.[
            this.state["historydata"]?.data?.results?.length - 1
          ]?.users?.id);
      let request_no = get(submission, "request_no", "");
      let is_approved = get(submission, "is_approved", "");

      let printType = get(
        mainObject,
        "print_notes.printed_remarks.printType",
        []
      );
      let actors = selectActors(submission, mainObject, [4, 3, 2, 1, 0]);
      //
      let committeeactors1 = actors?.find((r) => r.index == 0);
      let committeeactors2 = actors?.find((r) => r.index == 1);
      let committeeactors3 = actors?.find((r) => r.index == 2);
      let committeeactors4 = actors?.find((r) => r.index == 3);
      let committeeactors5 = actors?.find((r) => r.index == 4);
      let committeeactors_dynamica_id = actors?.reduce(
        (b, a) => b && b?.concat(a?.id),
        []
      );

      let committeeactors1_id = actors?.find((r) => r.index == 0)?.id;
      let committeeactors2_id = actors?.find((r) => r.index == 1)?.id;
      let committeeactors3_id = actors?.find((r) => r.index == 2)?.id;
      let committeeactors4_id = actors?.find((r) => r.index == 3)?.id;
      let committeeactors5_id = actors?.find((r) => r.index == 4)?.id;
      
      let scope = this;
      getUsingSymbols().then((res) => {
        esriRequest(window.planMapEditing + "MapServer/layers").then(function (
          maplayers
        ) {
          
          if (window.planMapEditing) {
            var layer = _.find(maplayers.tables, function (d) {
              return d.name == "Tbl_Parcel_Conditions";
            });
            if (layer && layer.id) {
              queryTask_updated(
                window.planMapEditing + "MapServer/" + layer.id,
                "USING_SYMBOL_CODE='" +
                  mainObject?.data_msa7y?.msa7yData?.usingSymbolType +
                  "'",
                ["*"],
                function (result) {
                  
                  scope.setState({
                    using_symbol: res?.find(
                      (r) =>
                        r.code ==
                        mainObject?.data_msa7y?.msa7yData?.usingSymbolType
                    )?.name,
                    selectedMaxUsingSymbolCode:
                      mainObject?.data_msa7y?.msa7yData?.usingSymbolType,
                    SLIDE_AREA: get(
                      result.features,
                      "0.attributes.SLIDE_AREA",
                      ""
                    ),
                    MIN_FROT_OFFSET: get(
                      result.features,
                      "0.attributes.MIN_FROT_OFFSET",
                      ""
                    ),
                    FRONT_OFFSET: get(
                      result.features,
                      "0.attributes.FRONT_OFFSET",
                      ""
                    ),
                    SIDE_OFFSET: get(
                      result.features,
                      "0.attributes.SIDE_OFFSET",
                      ""
                    ),
                    BACK_OFFSET: get(
                      result.features,
                      "0.attributes.BACK_OFFSET",
                      ""
                    ),
                    BUILDING_RATIO: get(
                      result.features,
                      "0.attributes.BUILDING_RATIO",
                      ""
                    ),
                    DESCRIPTION: get(
                      result.features,
                      "0.attributes.DESCRIPTION",
                      ""
                    ),
                  });
                }
              );
            }
          }
        });
      });

      var ownerNames = "";
    var owners = get(
      mainObject,
      "ownerData.ownerData.owners",
      get(mainObject, "ownerData.ownerData", [])
    );
    Object.keys(owners).map((key) => {
      ownerNames +=
        (!isEmpty(ownerNames) ? ", " + owners[key].name : owners[key].name) ||
        "";
    });

    let owners_name =
      ownerNames ||
      get(mainObject, "destinationData.destinationData.entity.name", "");
      let request_type = get(
        mainObject,
        "data_msa7y.msa7yData.submissionType",
        ""
      );
      let request_type_meter = get(
        mainObject,
        "landData.landData.SITE_DESC_METER",
        ""
      );
      let benefit_type = get(
        mainObject,
        "data_msa7y.msa7yData.benefitsType",
        ""
      );
      
      let plan_no = get(mainObject, "landData.landData.PLAN_NO", "");
      let district = get(
        mainObject,
        "landData.landData.lands.parcels[0].attributes.DISTRICT_NAME",
        ""
      );
      let city = get(
        mainObject,
        "landData.landData.lands.parcels[0].attributes.CITY_NAME",
        ""
      );
      let area = mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels
        .reduce((a, b) => {
          return a + b?.area;
        }, 0)
        .toFixed(2);
      let city_code = mainObject.landData.landData.MUNICIPALITY_NAME;
      let landImage = get(mainObject, "landData.landData.previous_Image", "");
      let msa7yImage = get(mainObject, "landData.landData.approved_Image", "");
      let detailedImage = get(
        mainObject,
        "landData.landData.detailed_Image",
        ""
      );
      let uplodedFeature = get(mainObject, "sortedtabtiriLandbase", "");
      let owner_acceptance = get(
        mainObject,
        "bda2l.bands_approval.main_header_title",
        ""
      );
      var bda2l_descs = [];
      let selectedBandsValues = get(
        mainObject,
        "bda2l.bands_approval.band_number.owner_selectedValues",
        get(mainObject, "bda2l.bands_approval.band_number.selectedValues", [])
      );

      if (!Array.isArray(selectedBandsValues)) {
        selectedBandsValues?.values?.map((item, index) => {
          bda2l_descs.push(`${index + 1} - ${item.condition.item_description}`);
        });
      } else if (Array.isArray(selectedBandsValues)) {
        selectedBandsValues
          ?.reduce((a, b) => {
            a = a.concat(b.values);
            return a;
          }, [])
          ?.forEach((item, i) => {
            bda2l_descs.push(`${i + 1} - ${item.condition.item_description}`);
          });
      }

      let bda2l = bda2l_descs.join(" ");
      let print_notes = get(
        mainObject,
        "print_notes.printed_remarks.remarks",
        []
      );
      let preparedDate = "";
      let approvalDate = "";
      let isMMSignShow = false;
      let landData_Parcels = get(
        mainObject,
        "landData.landData.lands.parcels",
        []
      );
      let msa7yData_Parcels = get(
        mainObject,
        "data_msa7y.msa7yData.cadDetails.suggestionsParcels",
        []
      );
      scope.setState({
        is_approved,
        landData_Parcels,
        msa7yData_Parcels,
        owners_name,
        request_no,
        request_type,
        request_type_meter,
        benefit_type,
        plan_no,
        district,
        city,
        area,
        committeeactors1,
        committeeactors2,
        committeeactors3,
        committeeactors4,
        committeeactors5,
        committeeactors_dynamica_id,
        committeeactors1_id,
        committeeactors2_id,
        committeeactors3_id,
        committeeactors4_id,
        committeeactors5_id,
        userIdeng,
        printType,
        city_code,
        landImage,
        msa7yImage,
        detailedImage,
        uplodedFeature,
        owner_acceptance,
        bda2l,
        print_notes,
        preparedDate,
        approvalDate,
        isMMSignShow,
      });
    });
  }

  render() {
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    let {
      is_approved,
      landData_Parcels,
      msa7yData_Parcels,
      using_symbol,
      owners_name = "",
      request_no = "",
      request_type = "",
      request_type_meter = "",
      benefit_type = "",
      plan_no = "",
      district = "",
      city = "",
      area = "",
      committeeactors1,
      committeeactors2,
      committeeactors3,
      committeeactors4,
      committeeactors5,
      selectedMaxUsingSymbolCode,
      committeeactors_dynamica_id,
      committeeactors1_id,
      committeeactors2_id,
      committeeactors3_id,
      committeeactors4_id,
      committeeactors5_id,
      userIdeng = "",
      printType,
      SLIDE_AREA = "",
      MIN_FROT_OFFSET = "",
      FRONT_OFFSET,
      SIDE_OFFSET,
      BACK_OFFSET,
      BUILDING_RATIO,
      DESCRIPTION,
      city_code = 0,
      landImage = "",
      msa7yImage = "",
      detailedImage = "",
      uplodedFeature,
      owner_acceptance = "",
      bda2l = [],
      print_notes = [],
      preparedDate = "",
      approvalDate = "",
      isMMSignShow = false,
    } = this.state;
    return (
      <div>
        <div
          className={
            printType == 1
              ? "tempA2 tempA0 table-report-container"
              : "tempA0 table-report-container"
          }
          style={{ textAlign: "right", zoom: "0.65" }}
        >
          <div style={{ border: "1px solid #000" }}>
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  marginLeft: "10px",
                  display: "grid",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="btn btn-warning hidd"
                  style={{ marginBottom: "3px" }}
                  onClick={() => {
                    window.print();
                  }}
                >
                  طباعة
                </button>
              </div>
            </div>
            <Row>
              {/* <Col span={4} className="rowPadding"> */}
              <div style={{ position: "absolute", left: "1%", zIndex: "1" }}>
                <img src="images/north.png" width="150px" />
              </div>
              <Col
                span={17}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  justifyItems: "center",
                  padding: "20px",
                }}
              >
                <Col
                  span={uplodedFeature ? "14" : "20"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "50vh",
                    alignItems: "center",
                    marginTop: "1vh",
                  }}
                >
                  <div className="mawk3am">
                    <img
                      style={{ maxHeight: "50vh" }}
                      src={"./images/mowkeaam1.jpg"}
                      // style={{ height: "25cm", width: "100%" }}
                    />

                    <p style={{ textAlign: "center" }}> الموقع العام</p>
                  </div>
                </Col>
                <Col
                  span={uplodedFeature ? "14" : "20"}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    height: "50vh",
                    alignItems: "center",
                    marginTop: "1vh",
                  }}
                >
                  <div className="mawk3am">
                    {/* <img
                      style={{ maxHeight: "66vh" }}
                      src={remove_duplicate(detailedImage)}
                      // style={{ height: "25cm", width: "100%" }}
                    /> */}
                    {checkImage(this.props, detailedImage, {
                      maxHeight: "50vh",
                    })}
                    <p style={{ textAlign: "center" }}>
                      {" "}
                      الموقع التفصيلي للمخطط
                    </p>
                  </div>
                </Col>
                <Col style={{ display: "flex", justifyContent: "flex-start" }}>
                  {" "}
                  <div>
                    {/* <img
                      src={remove_duplicate(landImage)}
                      style={{ maxWidth: "15vw" }}
                    /> */}
                    {checkImage(this.props, landImage, {
                      maxWidth: "15vw",
                    })}
                    <p style={{ textAlign: "center" }}>قبل التعديل</p>
                  </div>
                </Col>{" "}
                <Col style={{ display: "flex", justifyContent: "flex-start" }}>
                  {" "}
                  <div>
                    {/* <img
                      src={remove_duplicate(landImage)}
                      style={{ maxWidth: "15vw" }}
                    /> */}
                    {checkImage(this.props, msa7yImage, {
                      maxWidth: "15vw",
                    })}
                    <p style={{ textAlign: "center" }}>بعد التعديل</p>
                  </div>
                </Col>{" "}
              </Col>
              {/* </Col> */}
              <Col
                span={7}
                className={
                  printType == 2
                    ? "right_side_height righttablesTemoA0"
                    : "righttablesTemoA0"
                }
                style={{ border: "2px solid #000" }}
              >
                {" "}
                <ZoomSlider>
                  <div style={{ height: "100%" }}>
                    <div style={{ padding: "10px" }}>
                      <div className="zoom-print">
                        <h4 style={{ textAlign: "right" }} className="boldText">
                          الإستعمال :-
                        </h4>
                        <p style={{ direction: "ltr", textAlign: "center" }}>
                          {using_symbol}
                        </p>
                        <h4 style={{ textAlign: "right" }} className="boldText">
                          تنظيمات البناء :-
                        </h4>
                        <p>
                          ١ - إعتماد المخطط لا يعني تثبيت حدود الملكية وعلي
                          الأمانة تطبيق الصك الشرعي ومطابقته على الطبيعة.
                        </p>
                        <p>
                          ٢ - لا يجوز التصرف فى أي قطعة من قطع المخطط سواء
                          بالبيع أو البناء أو بأي شكل أخر إلا بعد تركيز كافة
                          المخطط على الطبيعة وفقا للمخطط المعتمد.
                        </p>
                        <p>
                          ٣ - قبل إعطاء فسح البناء يجب علي الأمانة التأكد من
                          وجود البتر الخرسانية.
                        </p>
                        <p>
                          ٤ - تباع القطع بحدودها الموضحة بالمخطط ولا يجوز
                          تقسيمها إلي أجزاء أصغر.
                        </p>
                        <p>
                          ٥ - القطع المخصصة للمرافق العامة لا يسمح بالبناء عليها
                          إلا للغرض نفسه.
                        </p>
                        <p>
                          ٦ - الشطفات :- تعمل الشطفات عند تقاطع الشوارع ويكون
                          ضلعي الشطفة متساويان وطول كل منهما يساوي ٥/١ عرض
                          الشارع الأكبر عرضا عند التقاطع وبحيث ألا تقل عن ٣
                          أمتار ولا تزيد عن ٦ أمتار ما لم يذكر خلاف ذلك على
                          المخطط.
                        </p>
                        <p>
                          ٧ - جميع ممرات المشاة بعرض ثمانية أمتار ما لم يذكر
                          خلاف ذلك.
                        </p>

                        <h4 style={{ textAlign: "right" }} className="boldText">
                          شروط المنطقة :-
                        </h4>
                        <table
                          className="table table-bordered"
                          // style={{ margin: "15px", width: "95%" }}
                        >
                          <tbody>
                            <tr>
                              <td colSpan="2" style={{ textAlign: "center" }}>
                                المنطقة {using_symbol}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2">
                                الاستعمالات المشروطة المسموح بها و استعمالاتها
                                الابعية
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2">
                                <p>١ - مؤسسات تجارة التجزئة</p>
                                <p>٢ - مؤسسات الخدمات العامة</p>
                                <p>
                                  ٣ - مؤسسات تجارة الجملة ولا تشمل المستودعات
                                </p>
                                <p>٤ - المكاتب</p>
                                <p>
                                  ٥ - الإستعمال السكني عندما يكون واقعا فوق
                                  الطابق الأرضي للمبني
                                </p>
                              </td>
                            </tr>
                            <tr>
                              {" "}
                              <td>
                                <span>الحد الأدني للإرتدادات</span>
                                <table className="table table-bordered">
                                  <tr>
                                    <td>الأمامي</td>
                                    <td>الجوانب</td>
                                    <td>الخلفي</td>
                                  </tr>
                                  <tr>
                                    <td>{convertToArabic(FRONT_OFFSET)}</td>
                                    <td>{convertToArabic(SIDE_OFFSET)}</td>
                                    <td>{convertToArabic(BACK_OFFSET)}</td>
                                  </tr>
                                </table>
                              </td>{" "}
                              <td>
                                مساحة المباني :- الحد الأقصي لمساحة البناء{" "}
                                {convertToArabic(BUILDING_RATIO)} من مساحة
                                القسيمة ما عدا المنطق الموضحة بالرمز{" "}
                                {selectedMaxUsingSymbolCode}
                                بالأطلس تكون نسبة البناء ١٠٠ %
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2">
                                الحد الأقصي لإرتفاع المبني :-{" "}
                                {convertToArabic(DESCRIPTION)}
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2">
                                <p style={{ textAlign: "center" }}>
                                  مواقف السيارات خارج الشارع
                                </p>
                                <p>
                                  ١ - يلزم توفير موقف سيارة لكل موظف فى المصنع و
                                  مرفق تجارة الجملة و التوزيع
                                </p>
                                <p>
                                  ٢ - موقف سيارة واحد لكل ٥٠ متر مربع من المساحة
                                  الأرضية لأعمال الخدمات بما فيها المكاتب و محل
                                  تجارة التجزئة المقتصره و الغير مقتصره على
                                  السلع كبيرة الحجم كالسيارات أو الآثاث
                                </p>
                                <p>٣ - موقف سيارة لكل وحدة سكنية</p>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2">
                                <p style={{ textAlign: "center" }}>
                                  إشتراطات اللافتات
                                </p>
                                <p>
                                  ١- لا يجوز أن يزيد مجموع مساحة اللافتات علي
                                  متر مربع لكل ثلاثة أمتار طولية من واجهة المبني
                                  المطلة علي الشارع.
                                </p>
                                <p>
                                  ٢- يجب أن تكون اللافتات القائمة بذاتها أي غير
                                  المتصلة بالمباني مطابقة لشروط ارتدادات وارتفاع
                                  البناء الخاص بالمنطقة.
                                </p>
                                <p>
                                  ٣- لا يجوز أن تبرز أي لافتة فوق المبني الذي
                                  توجد عليه.
                                </p>
                              </td>{" "}
                            </tr>
                          </tbody>
                        </table>
                        <ZoomSlider>
                          <h4
                            style={{ textAlign: "right" }}
                            className="boldText"
                          >
                            ملاحظات :-
                          </h4>
                          <div style={{ padding: "15px", zoom: 0.7 }}>
                            {print_notes?.map((note) => {
                              return note.checked && <p>{note.remark}</p>;
                            })}
                          </div>
                        </ZoomSlider>
                      </div>
                    </div>
                  </div>
                </ZoomSlider>
              </Col>
            </Row>
            <Row
              className="rowPadding rowPageBorder"
              style={{ direction: "ltr", justifyContent: "right" }}
              type="flex"
            >
              <Col span={5} className="flexCol1">
                <div className="div-border-arabic">
                  <h4 style={{ textAlign: "center" }}>التطبيق علي الطبيعة</h4>
                  <p>
                    تم تطبيق المخطط علي الطبيعة ووجد مطابقا للصك والطبيعة
                    ولايوجد ما يحول دون تنفيذه واعتماده
                  </p>
                  {(city != "الخبر" || city_code != "10506") && (
                    <table
                      className="table table-bordered"
                      style={{ marginBottom: "4vh" }}
                    >
                      <tr>
                        <td>المساح</td>
                        <td>الختم</td>
                        <td>مدير إدارة المساحة</td>
                      </tr>
                    </table>
                  )}
                  {(city == "الخبر" || city_code == "10506") && (
                    <table
                      className="table table-bordered"
                      style={{ marginBottom: "4vh" }}
                    >
                      <tr>
                        <td>المساح</td>
                        <td>مدير إدارة الأراضي والمساحة</td>
                        <td>رئيس بلدية محافظة الخبر</td>
                      </tr>
                    </table>
                  )}
                  {/* {owner_acceptance && ( */}
                  <div>
                    {" "}
                    {/* className="div-border-arabic" */}
                    <h4 style={{ textAlign: "center" }}>موافقة المالك</h4>
                    <p>
                      أوافق على المخطط و على ما ورد به من أنظمة و تعليمات أو
                      ملاحظات
                    </p>
                    {/* <p>{owner_acceptance}</p>
                    <p>{bda2l}</p> */}
                    <table
                      className="table table-bordered"
                      style={{ marginBottom: "4vh" }}
                    >
                      <tr>
                        <td>الإسم</td>
                        <td>التوقيع</td>
                      </tr>
                    </table>
                  </div>
                  {/* )} */}
                </div>
              </Col>
              <Col span={4} className="flexCol1">
                <div className="div-border-arabic ">
                  <img src="images/2-681x.PNG"></img>
                </div>
              </Col>
              <Col span={4} className="flexCol1">
                <div className="div-border-arabic">
                  <p>جدول المقارنة</p>
                  <table
                    className="table table-bordered"
                    style={{ marginBottom: "4vh" }}
                  >
                    <tr>
                      <td></td>
                      <td>قبل التعديل</td>
                      <td>بعد التعديل</td>
                    </tr>
                    <tr>
                      <td>{request_type}</td>
                      <td>{convertToArabic(request_type_meter)} م</td>
                      <td rowSpan={landData_Parcels?.length + 1}>
                        {convertToArabic(
                          msa7yData_Parcels
                            ?.reduce((a, b) => {
                              return a + +b.area;
                            }, 0)
                            ?.toFixed(2)
                        )}{" "}
                        م٢
                      </td>
                    </tr>
                    {landData_Parcels?.map((parcel, index) => {
                      return (
                        <tr>
                          <td>
                            {convertToArabic(parcel.attributes.PARCEL_PLAN_NO)}
                          </td>
                          <td>
                            {convertToArabic(parcel.attributes.PARCEL_AREA)} م٢
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </Col>{" "}
              <Col span={4} className="flexCol1">
                <div className="div-border-arabic">
                  <img src="images/ar.PNG"></img>
                </div>
              </Col>{" "}
              <Col span={7} className="flexCol1">
                <div className="div-border-arabic">
                  <Row
                    style={{
                      borderBottom: "1px solid",
                      paddingBottom: "12px",
                      alignItems: "center",
                    }}
                  >
                    <Col span={6}>
                      <div style={{ justifySelf: "center" }}>
                        <img
                          style={{ width: "60px" }}
                          src="images/logo2.png"
                        ></img>
                      </div>
                    </Col>
                    <Col span={12}>
                      {" "}
                      <div style={{ textAlign: "center" }}>
                        <h6 style={{ fontSize: "20px" }}>
                          وزارة الشئون البلدية والقروية
                        </h6>
                        <h6 style={{ fontSize: "20px" }}>
                          أمانة المنطقة الشرقية
                        </h6>
                        <h6 style={{ fontSize: "20px" }}>
                          الإدارة العامة للتخطيط العمراني
                        </h6>
                      </div>
                    </Col>
                    <Col span={6}>
                      {" "}
                      <div style={{ justifySelf: "center" }}>
                        <img
                          style={{ width: "60px" }}
                          src="images/logo3.png"
                        ></img>
                      </div>
                    </Col>
                  </Row>

                  <Row
                    style={{ borderBottom: "1px solid", paddingBottom: "12px" }}
                  >
                    <Col span={18}>
                      <table
                        className="table table-bordered"
                        style={{ marginTop: "10px" }}
                      >
                        <tr>
                          <td>المدينة</td>
                          <td>الدمام</td>
                        </tr>
                        <tr>
                          <td>المحافظة</td>
                          <td>شرق الدمام</td>
                        </tr>
                        <tr>
                          <td>المنطقة</td>
                          <td>الشرقية</td>
                        </tr>
                      </table>
                    </Col>{" "}
                    <Col span={6}>
                      <div style={{ paddingLeft: "10px" }}>
                        <p>
                          تعديل جزئي بالمخطط ({convertToArabic(plan_no)}) بضم
                          النافذ ({request_type}) الى القطع رقم (
                          {landData_Parcels
                            ?.map((parcel, index) => {
                              return convertToArabic(
                                parcel.attributes.PARCEL_PLAN_NO
                              );
                            })
                            .join(" , ")}
                          ) المملوكة لـ {owners_name}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <div
                    style={{ borderBottom: "1px solid", paddingBottom: "12px" }}
                  >
                    <Row className="rowPadding">
                      <Col span={6}>
                        <div style={{ paddingRight: "10px" }}>
                          {" "}
                          <div
                            style={{
                              borderBottom: "1px solid",
                            }}
                          >
                            <p>رقم المخطط :- {convertToArabic(plan_no)}</p>
                          </div>
                          <div
                            style={{
                              borderBottom: "1px solid",
                            }}
                          >
                            <p>تاريخ الإعداد</p>
                            <p> / / 14 هـ</p>
                          </div>
                          <div>
                            <p>تاريخ الإعتماد</p>
                            <p> / / 14 هـ</p>
                          </div>
                        </div>
                      </Col>
                      <Col span={18}>
                        <table
                          className="table table-bordered"
                          style={{ marginTop: "10px" }}
                        >
                          <tr>
                            <td>الوظيفة</td>
                            <td>الإسم</td>
                            <td>التوقيع</td>
                          </tr>
                          {/* <tr>
                          <td>المكتب الهندسي المصمم</td>
                          <td colSpan="2">{ceator_user_name}</td>
                        </tr> */}
                          {/* {isMMSignShow && ( */}
                          <tr>
                            <td>المهندس المشرف</td>
                            <td>اسم المهندس المشرف</td>
                            <td></td>
                            {/* <td>
                            {province_id && (
                              <SignPics
                                committee_report_no={committee_report_no}
                                is_paid={is_paid}
                                province_id={province_id}
                                userId={userIdeng}
                              />
                            )}
                          </td> */}
                          </tr>
                          {/* )} */}

                          <tr>
                            <td>{committeeactors1?.position}</td>
                            <td>المهندس / {committeeactors1?.name}</td>
                            <td>
                              {" "}
                              {is_approved == 1 && province_id && (
                                <img
                                  src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                                  width="130px"
                                />
                              )}
                            </td>
                          </tr>

                          <tr>
                            <td>{committeeactors2?.position}</td>
                            <td>المهندس / {committeeactors2?.name}</td>
                            {/* <td>مدير عام التخطيط العمراني</td>
                            <td>م / فواز بن فهد العتيبي</td> */}
                            <td>
                              {" "}
                              {is_approved == 1 && province_id && (
                                <img
                                  src={`${filesHost}/users/${committeeactors2_id}/sign.png`}
                                  width="130px"
                                />
                              )}
                            </td>
                          </tr>

                          {committeeactors3?.name && (
                            <tr>
                              <td>{committeeactors3?.position}</td>
                              <td>المهندس / {committeeactors3?.name}</td>
                              <td>
                                {" "}
                                {is_approved == 1 && province_id && (
                                  <img
                                    src={`${filesHost}/users/${committeeactors3_id}/sign.png`}
                                    width="130px"
                                  />
                                )}
                              </td>
                            </tr>
                          )}

                          <tr>
                            <td>{committeeactors4?.position}</td>
                            <td>المهندس / {committeeactors4?.name}</td>
                            {/* <td>وكيل الأمين للتعمير والمشاريع</td>
                            <td>م / مازن بن عادل بخرجي</td> */}
                            <td>
                              {" "}
                              {is_approved == 1 && province_id && (
                                <img
                                  src={`${filesHost}/users/${committeeactors4_id}/sign.png`}
                                  width="130px"
                                />
                              )}
                            </td>
                          </tr>
                        </table>

                        <div
                          style={{
                            borderTop: "2px solid #000",
                            paddingTop: "10px",
                          }}
                        >
                          <p>يعتمد {committeeactors5?.position}</p>

                          <p style={{ textAlign: "center" }}>
                            المهندس / {committeeactors5?.name}
                          </p>
                          {/* <p>يعتمد أمين المنطقة الشرقية</p>
                          <p>المهندس / فهد بن محمد الجبير</p> */}
                          <p style={{ textAlign: "center" }}>التوقيع</p>
                          {is_approved == 1 && province_id && (
                            <p style={{ textAlign: "center" }}>
                              {" "}
                              <img
                                src={`${filesHost}/users/${committeeactors5_id}/sign.png`}
                                width="130px"
                              />
                            </p>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>

                {/* <div>
                  <span>إجمالي مساحة غرفة الكهرباء :- </span>
                </div> */}
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
