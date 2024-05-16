import React, { Component } from "react";
import axios from "axios";
import { get, isEmpty, map } from "lodash";
import { workFlowUrl, backEndUrlforMap } from "imports/config";
import moment from "moment-hijri";
import {
  convertToArabic,
  remove_duplicate,
  get_print_data_by_id,
  map_subM,
  landsNoSort,
  mappingCity,
  localizeNumber,
  getParcelLengths,
  selectActors,
  getDistrictNameById,
} from "app/components/inputs/fields/identify/Component/common/common_func";
import { initializeSubmissionData } from "main_helpers/functions/prints";
// import QRCode from "qrcode.react";
import QRCode from "react-qr-code";
import { Modal, Form, Button } from "antd";
import { Row, Col } from "antd";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { mapStateToProps } from "./mapping";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import {
  selectMainObject,
  switchBetweenTadkekMsa7yAndOriginalMsa7y,
} from "../inputs/fields/identify/Component/common";
class printDuplix extends Component {
  state = { data: [] };
  msa7yData = null;
  componentDidMount() {
    const { mo3aynaObject } = this.props.modal;
    if (mo3aynaObject) {
      this.msa7yData = switchBetweenTadkekMsa7yAndOriginalMsa7y(mo3aynaObject);
      this.setPrintValues(mo3aynaObject);
    } else {
      initializeSubmissionData(this.props.params.id).then((res) => {
        let mainObject = res.mainObject;
        this.msa7yData = switchBetweenTadkekMsa7yAndOriginalMsa7y(mainObject);
        let submissionData = res.submission;
        let municipalities = res.MunicipalityNames;
        let committee_report_no = get(submissionData, "committee_report_no");
        this.setState({ committee_report_no });
        console.log("data_print", mainObject, submissionData);
        this.setPrintValues(mainObject, submissionData, municipalities);
      });
    }

    this.cities = [
      {
        name: "الدمام",
        code: 100,
      },
      {
        name: "الظهران",
        code: 120,
      },
      {
        name: "القطيف",
        code: 300,
      },
      {
        name: "سيهات",
        code: 330,
      },
      {
        name: "صفوى",
        code: 360,
      },
      {
        name: "عنك",
        code: 350,
      },
      {
        name: "تاروت",
        code: 340,
      },
      {
        name: "الخبر",
        code: 200,
      },
      {
        name: "راس تنورة",
        code: 450,
      },
      {
        name: "حفر الباطن",
        code: 550,
      },
    ];
  }

  setPrintValues(mainObject, submissionData, municipalities) {
    let request_number = submissionData && submissionData["request_no"];
    let create_date = (submissionData && submissionData["create_date"]) || "";
    let committee_report_number =
      submissionData && submissionData["committee_report_no"];
    let committee_date = submissionData && submissionData["committee_date"];
    let export_number = submissionData && submissionData["export_no"];
    let export_date = submissionData && submissionData["export_date"];
    let actors = selectActors(submissionData, mainObject, [4, 3, 2, 1, 0]);
    ////
    let committeeactors1 = actors?.find((r) => r.index == 3);
    let committeeactors2 = actors?.find((r) => r.index == 1);
    let committeeactors3 = actors?.find((r) => r.index == 2);
    let office_creator =
      submissionData && submissionData["CreatorUser"]["name"];

    let ownersCount =
      (mainObject?.ownerData &&
        Object.values(mainObject?.ownerData?.ownerData?.owners)?.length) ||
      (mainObject?.owners_data && mainObject?.owners_data?.owners?.length) ||
      "0";
    let nationalityId =
      (mainObject?.owners_data &&
        mainObject?.owners_data?.owners[0]?.nationalidtypes?.id) ||
      (mainObject?.ownerData &&
        Object.values(mainObject?.ownerData?.ownerData?.owners)[0]
          ?.nationalidtypes?.id) ||
      (Object.values(mainObject?.ownerData?.ownerData?.owners)[0]?.owners &&
        Object.values(mainObject?.ownerData?.ownerData?.owners)[0]?.owners[0]
          ?.nationalidtypes?.id) ||
      "";
    let owner_name =
      (mainObject?.owners_data && mainObject?.owners_data?.owners[0]?.name) ||
      (mainObject?.ownerData &&
        Object.values(mainObject?.ownerData?.ownerData?.owners)[0]?.name) ||
      "";
    let owners =
      (mainObject?.ownerData &&
        Object.values(mainObject?.ownerData?.ownerData?.owners)) ||
      (mainObject?.owners_data && mainObject?.owners_data?.owners) ||
      [];
    let userObject = get(mainObject?.ownerData, "ownerData.owners", "");
    let ownerType = mainObject?.ownerData?.ownerData?.owner_type;
    let defaults = this.init(mainObject, submissionData);
    let submission_lists = (defaults && defaults.submission_lists) || [];
    let footerParcelsTitle = (defaults && defaults.footerParcelsTitle) || {};
    mappingCity(mainObject, this.cities);
    let landData = mainObject.landData.landData;
    let sub_type = mainObject.landData.landData.sub_type;

    let municipality =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.MUNICIPALITY_NAME;
    municipality =
      landData?.CITY_NAME ||
      landData?.municipality?.CITY_NAME_A ||
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.CITY_NAME ||
      (landData?.municipality && landData?.municipality?.name) ||
      (municipality && municipality?.name) ||
      (municipality &&
        !isNaN(municipality) &&
        municipalities?.find((mun) => mun.code == municipality)?.name) ||
      municipality ||
      "بدون";
    let sub_municipality =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0].attributes
        ?.SUB_MUNICIPALITY_NAME;
    let plan_number =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0].attributes?.PLAN_NO;
    let subdivision_type =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0].attributes
        ?.SUBDIVISION_TYPE;
    let subdivision_description =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.SUBDIVISION_DESCRIPTION;
    getDistrictNameById(
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0].attributes
        ?.DISTRICT_NAME
    ).then((res) => {
      this.setState({ district_name: res });
    });

    let block_number =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.PARCEL_BLOCK_NO;
    let parcel_plan_number =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.PARCEL_PLAN_NO;
    let parcel_area =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0].attributes
        ?.PARCEL_AREA;
    let using_symbol =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0].attributes
        ?.USING_SYMBOL;

    let sak_number = mainObject?.waseka?.waseka.table_waseka[0]?.number_waseka;
    let sak_date = mainObject?.waseka.waseka?.table_waseka[0]?.date_waseka;
    let issuer_name =
      mainObject?.waseka?.waseka?.table_waseka?.[0]?.waseka_search;

    let parcel_type = mainObject.landData.landData.lands.parcelData.parcel_type;
    let office_create_remark =
      (mainObject.approvalSubmissionNotes.notes.notes.length > 0 &&
        mainObject.approvalSubmissionNotes.notes.notes[0].notes) ||
      "";
    let office_remark =
      (mainObject.remarks && mainObject.remarks[0].comment) || "";
    let submission_type = mainObject.landData.landData.submissionType || "";
    let head = mainObject.data_msa7y?.msa7yData?.HEAD;
    head = mainObject.sugLandData?.sugLandData?.HEAD
      ? mainObject.sugLandData?.sugLandData?.HEAD
      : false;
    let submissionTypeName = mainObject?.submissionTypeName;

    this.setState({
      request_number,
      mainObject,
      submissionTypeName,
      committee_report_number,
      head,
      committee_date,
      export_number,
      export_date,
      committeeactors1,
      committeeactors2,
      committeeactors3,
      office_creator,
      owner_name,
      ownersCount,
      owners,
      nationalityId,
      submission_lists,
      mainObject,
      footerParcelsTitle,
      landData,
      sub_type,
      municipality,
      sub_municipality,
      plan_number,
      subdivision_type,
      subdivision_description,
      block_number,
      parcel_plan_number,
      parcel_area,
      using_symbol,
      create_date,
      sak_number,
      sak_date,
      issuer_name,
      // north_description,
      // north_length,
      // south_description,
      // south_length,
      // east_description,
      // east_length,
      // west_description,
      // west_length,
      submissionData,
      submission_type,
      parcel_type,
      office_create_remark,
      office_remark,
      ownerType,
      userObject,
    });
    // console.log(parcel_plan);
  }

  init = (mainObject, submission) => {
    mainObject.waseka.waseka.table_waseka.forEach((land, index) => {
      if (!land.PARCEL_PLAN_NO) {
        land.PARCEL_PLAN_NO =
          this.msa7yData?.cadDetails?.suggestionsParcels[
            index
          ].attributes?.PARCEL_PLAN_NO;
      }
    });

    map_subM(this.msa7yData?.cadDetails?.suggestionsParcels);
    var perefLen = 6;
    var footerParcelsTitle = "";
    if (
      mainObject.waseka.waseka.table_waseka.length == 1 ||
      mainObject.waseka.waseka.table_waseka.length == 2
    ) {
      if (mainObject.waseka.waseka.table_waseka.length == 2) {
        footerParcelsTitle = "القطع ";
        mainObject.waseka.waseka.table_waseka.forEach((val) => {
          footerParcelsTitle += val.PARCEL_PLAN_NO + " , ";
        });
      } else {
        footerParcelsTitle = "القطعة ";
        footerParcelsTitle +=
          mainObject?.waseka?.waseka?.table_waseka?.[0]?.PARCEL_PLAN_NO + " , ";
      }
    } else {
      var selected_parcels_length = this.msa7yData.cadDetails.suggestionsParcels
        ? this.msa7yData?.cadDetails?.suggestionsParcels.length
        : 0;
      footerParcelsTitle =
        "القطع من  :" +
        this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
          ?.PARCEL_PLAN_NO +
        " الى : " +
        this.msa7yData?.cadDetails?.suggestionsParcels?.[
          selected_parcels_length - 1
        ]?.attributes?.PARCEL_PLAN_NO;
    }

    var submission_lists = [];
    var lists_object = {
      currents: [],
      suggestions: [],
    };
    var lists_length = 0;
    if (mainObject.data_msa7y) {
      mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels = _.sortBy(
        mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels,
        (d) => {
          return landsNoSort(d, "parcel_name");
        }
      );
    }
    if (mainObject.waseka) {
      mainObject.waseka.waseka.table_waseka = _.sortBy(
        mainObject.waseka.waseka.table_waseka,
        (d) => {
          return landsNoSort(d, "PARCEL_PLAN_NO");
        }
      );
      this.msa7yData.cadDetails.suggestionsParcels = _.sortBy(
        this.msa7yData?.cadDetails?.suggestionsParcels,
        (d) => {
          return landsNoSort(d.attributes, "PARCEL_PLAN_NO");
        }
      );
    }

    if (
      mainObject.waseka &&
      mainObject.waseka.waseka.table_waseka.length > 0 &&
      mainObject.data_msa7y &&
      mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.length > 0
    ) {
      lists_length =
        mainObject.waseka &&
        mainObject.waseka.waseka.table_waseka.length + mainObject.data_msa7y &&
        mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.length;
    }
    if (lists_length > perefLen) {
      while (mainObject.waseka.waseka.table_waseka.length > 0) {
        lists_object.currents.push(
          mainObject.waseka.waseka.table_waseka.splice(0, perefLen)
        );
      }
      lists_object.currents.forEach((current, key) => {
        if (current.length < perefLen + 1 && current.length > perefLen - 1) {
          submission_lists.push({
            currents: current.map((wasekaLand) => {
              var land = this.msa7yData?.cadDetails?.suggestionsParcels?.find(
                (parcel) => {
                  return (
                    parcel?.attributes?.PARCEL_PLAN_NO ==
                    wasekaLand?.selectedLands
                  );
                }
              );
              return {
                ...wasekaLand,
                area: wasekaLand?.area || land?.attributes?.PARCEL_AREA || 0,
                UNITS_NUMBER: land?.attributes?.UNITS_NUMBER || "",
                USING_SYMBOL_Code: land?.attributes?.USING_SYMBOL_Code || "",
              };
            }),
          });
          if (lists_object.currents.length == 1) {
            while (
              mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels
                .length > 0
            ) {
              submission_lists.push({
                suggestions:
                  mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.splice(
                    0,
                    perefLen
                  ),
              });
            }
          }
        } else {
          if (current.length == perefLen) {
            submission_lists.push({
              currents: current.map((wasekaLand) => {
                var land = this.msa7yData?.cadDetails?.suggestionsParcels?.find(
                  (parcel) => {
                    return (
                      parcel?.attributes?.PARCEL_PLAN_NO ==
                      wasekaLand?.selectedLands
                    );
                  }
                );
                return {
                  ...wasekaLand,
                  area: wasekaLand?.area || land?.attributes?.PARCEL_AREA || 0,
                  UNITS_NUMBER: land?.attributes?.UNITS_NUMBER || "",
                  USING_SYMBOL_Code: land?.attributes?.USING_SYMBOL_Code || "",
                };
              }),
            });
          } else {
            submission_lists.push({
              currents: current.map((wasekaLand) => {
                var land = this.msa7yData?.cadDetails?.suggestionsParcels?.find(
                  (parcel) => {
                    return (
                      parcel?.attributes?.PARCEL_PLAN_NO ==
                      wasekaLand?.selectedLands
                    );
                  }
                );
                return {
                  ...wasekaLand,
                  area: wasekaLand?.area || land?.attributes?.PARCEL_AREA || 0,
                  UNITS_NUMBER: land?.attributes?.UNITS_NUMBER || "",
                  USING_SYMBOL_Code: land?.attributes?.USING_SYMBOL_Code || "",
                };
              }),
              suggestions:
                mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.splice(
                  0,
                  perefLen - current.length
                ),
            });
          }

          while (
            mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels
              .length > 0
          ) {
            submission_lists.push({
              suggestions:
                mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.splice(
                  0,
                  perefLen
                ),
            });
          }
        }
      });
      while (
        mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.length > 0
      ) {
        submission_lists.push({
          suggestions:
            mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels.splice(
              0,
              perefLen
            ),
        });
      }
    } else {
      submission_lists = [
        {
          currents: mainObject?.waseka?.waseka?.table_waseka?.map(
            (wasekaLand) => {
              var land = this.msa7yData?.cadDetails?.suggestionsParcels?.find(
                (parcel) => {
                  return (
                    parcel?.attributes?.PARCEL_PLAN_NO ==
                    wasekaLand?.selectedLands
                  );
                }
              );
              return {
                ...wasekaLand,
                area: wasekaLand?.area || land?.attributes?.PARCEL_AREA || 0,
                UNITS_NUMBER: land?.attributes?.UNITS_NUMBER || "",
                USING_SYMBOL_Code: land?.attributes?.USING_SYMBOL_Code || "",
              };
            }
          ),
          suggestions:
            mainObject.data_msa7y &&
            mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels,
        },
      ];
    }

    return { submission_lists, footerParcelsTitle };
  };

  render() {
    const {
      request_number = "",
      committee_report_number = "",
      committee_date = "",
      export_number = "",
      export_date = "",
      committeeactors1 = {},
      committeeactors2 = {},
      committeeactors3 = {},
      office_creator = "",
      submissionTypeName = "",
      owner_name = "",
      ownersCount = 0,
      owners = [],
      nationalityId = "",
      submission_lists = [],
      mainObject = {},
      footerParcelsTitle = "",
      landData = {},
      sub_type = "",
      municipality = "",
      sub_municipality = "",
      plan_number = "",
      subdivision_type = "",
      subdivision_description = "",
      district_name = "",
      block_number = "",
      parcel_plan_number = "",
      parcel_area = "",
      using_symbol = "",
      sak_number = "",
      sak_date = "",
      issuer_name = "",
      create_date,
      // north_description = "",
      // north_length = "",
      // south_description = "",
      // south_length = "",
      // east_description = "",
      // east_length = "",
      // west_description = "",
      // west_length = "",
      head,
      submissionData = {},
      submission_type = "",
      // parcel_type = "",
      office_create_remark = [],
      office_remark = "",
      committee_report_no,
      ownerType,
      userObject,
    } = this.state;
    let owners_name =
      owners &&
      owners.length &&
      Object.values(owners)
        .map((d) => d.name)
        .join("-");
    const {
      handleCancel,
      t,
      modal: { title, submit, content, customFooter },
    } = this.props;
    console.log("daa", this.state);

    const footer = customFooter ? (
      <div>
        {customFooter.map((button) => (
          <Button {...button}> {t(button.label)} </Button>
        ))}
        <Button type="danger" onClick={handleCancel}>
          {t("No")}
        </Button>
      </div>
    ) : undefined;
    return (
      <Modal
        title={t(title)}
        visible={true}
        className="mo3yna_full"
        footer={footer}
        cancelType="danger"
        onOk={() => {
          submit();
          handleCancel();
        }}
        okText={t("Yes")}
        cancelText={t("No")}
        onCancel={handleCancel}
      >
        <div
          className={
            !committee_report_no
              ? "watermark table-report-container font_size_12"
              : "no-watermark table-report-container font_size_12"
          }
          // style={{ zoom: ".79" }}
        >
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
          {submission_lists &&
            map(submission_lists, (duplix, index) => {
              return (
                <div
                  key={index}
                  className="table-pr-farz"
                  ref={(el) => (this.componentRef = el)}
                >
                  <div className="height_row">
                    <div
                      className="rightPart"
                      style={{ borderLeft: "1px solid", textAlign: "center" }}
                    >
                      <form className="farz_header">
                        <div>
                          <label>
                            {committee_report_number
                              ? "محضر لجنة"
                              : "رقم المعاملة"}
                          </label>{" "}
                          <label className="outline_print" type="text">
                            {convertToArabic(
                              committee_report_number || request_number
                            )}
                          </label>
                        </div>
                        <div>
                          <label>و تاريخ</label>
                          <label type="text" className="outline_print">
                            {convertToArabic(committee_date) ||
                              convertToArabic(create_date)}{" "}
                            هـ
                          </label>
                        </div>
                        <div className="farz_est">
                          <label>الدوبلكسات</label>
                          <label type="text" className="outline_print">
                            استمارة رقم {convertToArabic(index + 1)} من{" "}
                            {convertToArabic(submission_lists.length)}
                          </label>
                        </div>
                      </form>
                      <div>
                        <div>
                          <p>
                            بناء على التعميم الوزاري رقم( ١٣٣٨٤ ) وتاريخ ( ١٤ /
                            ٣ / ١٤٣٤ ) هـ الخاص بتجزئة القطع والمباني السكنية
                            الى أجزاء أصغر او وحدات كل منها فى صك ملكية مستقل.
                            عليه فقد اجتمع أعضاء اللجنة الفنية للنظر فى
                            المعاملات المحالة للجنة. وبعد الإطلاع على الطلب
                            المقدم
                          </p>
                        </div>
                      </div>
                      <ZoomSlider>
                        <div>
                          <form>
                            <div className="before_mwatn">
                              <label style={{}}>
                                {" "}
                                من{" "}
                                {ownersCount == 1 && nationalityId && (
                                  <>
                                    <span>المواطن</span>{" "}
                                    <div className="">
                                      {nationalityId == 1988 && (
                                        <span>الخليجي</span>
                                      )}{" "}
                                    </div>
                                  </>
                                )}
                              </label>
                              {ownersCount > 1 && <label>المواطنين</label>}
                              {owners &&
                                owners.length &&
                                map(owners, (owner) => {
                                  return (
                                    <div>
                                      <label
                                        className="outline_print"
                                        type="text"
                                      >
                                        <span>
                                          {owner.name}{" "}
                                          {`${
                                            (owner.ssn && "برقم هوية") ||
                                            (owner.code_regesteration &&
                                              "بكود جهة") ||
                                            (owner.commercial_registeration &&
                                              "برقم سجل تجاري")
                                          }: ${localizeNumber(
                                            owner.ssn ||
                                              owner.code_regesteration ||
                                              owner.commercial_registeration
                                          )}`}{" "}
                                        </span>
                                      </label>
                                    </div>
                                  );
                                })}
                            </div>
                          </form>
                        </div>
                      </ZoomSlider>
                      <div>
                        {duplix.currents && (
                          <div style={{ textAlign: "right" }}>
                            <p>
                              بشأن فرز الوحدات السكنية العائدة ملكيتها له على
                              القطع
                            </p>
                          </div>
                        )}
                        {duplix.currents && (
                          <div>
                            <table className="table table-bordered">
                              <tbody>
                                <tr>
                                  <td>رقم القطعة</td>
                                  {landData.DIVISION_NO &&
                                    (subdivision_type ||
                                      landData.subdivisions) && (
                                      <td>
                                        {subdivision_type ||
                                          landData.subdivisions}
                                      </td>
                                    )}
                                  <td>رقم الصك</td>
                                  <td>تاريخه</td>
                                  <td>رمز الإستخدام</td>
                                  {[10501, 10506, 10513].indexOf(
                                    landData.MUNICIPALITY_NAME
                                  ) != -1 &&
                                    duplix.currents.find(
                                      (land) =>
                                        land?.UNITS_NUMBER &&
                                        [
                                          land.USING_SYMBOL_Code,
                                          land.USING_SYMBOL,
                                        ].indexOf("س1-أ") != -1
                                    ) != undefined && <td>عدد الوحدات</td>}
                                  <td>المساحة (م٢)</td>
                                </tr>
                              </tbody>
                              <tbody>
                                {map(duplix.currents, (land, key) => {
                                  return (
                                    <tr>
                                      <td>
                                        {localizeNumber(land.selectedLands)}
                                      </td>
                                      {subdivision_description && (
                                        <td>
                                          {subdivision_description || "بدون"}
                                        </td>
                                      )}
                                      <td>
                                        {convertToArabic(land.number_waseka)}
                                      </td>
                                      <td>
                                        {convertToArabic(land.date_waseka)} هـ
                                      </td>
                                      <td>
                                        {convertToArabic(
                                          land.USING_SYMBOL || using_symbol
                                        )}
                                      </td>
                                      {([10501, 10506, 10513].indexOf(
                                        landData.MUNICIPALITY_NAME
                                      ) != -1 &&
                                        land?.UNITS_NUMBER &&
                                        [
                                          land.USING_SYMBOL_Code,
                                          land.USING_SYMBOL,
                                        ].indexOf("س1-أ") != -1 && (
                                          <td>
                                            {convertToArabic(
                                              land?.UNITS_NUMBER || ""
                                            )}
                                          </td>
                                        )) ||
                                        (duplix.currents.filter(
                                          (r) => !isEmpty(r.UNITS_NUMBER)
                                        ).length > 0 && <></>)}
                                      <td>
                                        {convertToArabic(
                                          (isNaN(
                                            +(
                                              this.msa7yData?.cadDetails?.suggestionsParcels?.find(
                                                (parcelLand) =>
                                                  parcelLand?.attributes
                                                    ?.PARCEL_PLAN_NO ==
                                                  land?.selectedLands
                                              )?.attributes?.PARCEL_AREA ||
                                              parcel_area
                                            )
                                          ) &&
                                            (this.msa7yData?.cadDetails?.suggestionsParcels?.find(
                                              (parcelLand) =>
                                                parcelLand?.attributes
                                                  ?.PARCEL_PLAN_NO ==
                                                land?.selectedLands
                                            )?.attributes?.PARCEL_AREA ||
                                              parcel_area)) ||
                                            (+(
                                              this.msa7yData?.cadDetails?.suggestionsParcels?.find(
                                                (parcelLand) =>
                                                  parcelLand?.attributes
                                                    ?.PARCEL_PLAN_NO ==
                                                  land?.selectedLands
                                              )?.attributes?.PARCEL_AREA ||
                                              parcel_area
                                            )).toFixed(2) || // .toString().match(/\d+/)[0]
                                            0
                                        ) + " م٢"}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                        <div>
                          <table className="table table-bordered">
                            <tbody>
                              <tr>
                                <td>البلك رقم</td>
                                <td>
                                  {convertToArabic(block_number) || "بدون"}
                                </td>
                                <td>المخطط رقم</td>
                                <td>{convertToArabic(plan_number)}</td>
                              </tr>
                              <tr>
                                <td>الحي</td>
                                <td>{district_name}</td>
                                <td>من مدينة</td>
                                <td>{municipality}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        {/* <div>
                          <table className="table table-bordered">
                            <tbody>
                              <tr>
                                <td>شمالا</td>
                                <td
                                  style={{
                                    width: "10vw",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {convertToArabic(north_description)}
                                </td>
                                <td>بطول</td>
                                <td>{convertToArabic(north_length)} م</td>
                                <td>جنوبا</td>
                                <td
                                  style={{
                                    width: "10vw",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {convertToArabic(south_description)}
                                </td>
                                <td>بطول</td>
                                <td>{convertToArabic(south_length)} م</td>
                              </tr>
                              <tr>
                                <td>شرقا</td>
                                <td>{convertToArabic(east_description)}</td>
                                <td>بطول</td>
                                <td>{convertToArabic(east_length)} م</td>
                                <td>غربا</td>
                                <td>{convertToArabic(west_description)}</td>
                                <td>بطول</td>
                                <td>{convertToArabic(west_length)} م</td>
                              </tr>
                            </tbody>
                          </table>
                        </div> */}
                        {this.msa7yData?.cadDetails?.suggestionsParcels.length >
                          0 &&
                          this.msa7yData?.cadDetails?.suggestionsParcels.map(
                            (parcel) => (
                              <div>
                                <table className="table table-bordered">
                                  <tbody>
                                    <tr>
                                      <td
                                        colSpan={4}
                                        style={{ textAlign: "center" }}
                                      >
                                        رقم القطعة
                                      </td>
                                      <td
                                        colSpan={4}
                                        style={{ textAlign: "center" }}
                                      >
                                        {convertToArabic(
                                          parcel?.attributes?.PARCEL_PLAN_NO
                                        )}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>شمالا</td>
                                      <td
                                        style={{
                                          width: "10vw",
                                          whiteSpace: "normal",
                                        }}
                                      >
                                        {convertToArabic(
                                          parcel?.parcelData?.north_desc ||
                                            parcel.north_Desc
                                        )}
                                      </td>
                                      <td>بطول</td>
                                      <td>
                                        {convertToArabic(
                                          (parcel?.parcelData?.north_length &&
                                            (+parcel?.parcelData
                                              ?.north_length).toFixed(2)) ||
                                            (+parcel.data[0]
                                              ?.totalLength)?.toFixed(2)
                                        )}{" "}
                                        م
                                      </td>
                                      <td>جنوبا</td>
                                      <td
                                        style={{
                                          width: "10vw",
                                          whiteSpace: "normal",
                                        }}
                                      >
                                        {convertToArabic(
                                          parcel?.parcelData?.south_desc ||
                                            parcel.south_Desc
                                        )}
                                      </td>
                                      <td>بطول</td>
                                      <td>
                                        {convertToArabic(
                                          (parcel?.parcelData?.south_length &&
                                            (+parcel?.parcelData
                                              ?.south_length).toFixed(2)) ||
                                            (+parcel.data[4]
                                              ?.totalLength)?.toFixed(2)
                                        )}{" "}
                                        م
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>شرقا</td>
                                      <td>
                                        {convertToArabic(
                                          parcel?.parcelData?.east_desc ||
                                            parcel.east_Desc
                                        )}
                                      </td>
                                      <td>بطول</td>
                                      <td>
                                        {convertToArabic(
                                          (parcel?.parcelData?.east_length &&
                                            (+parcel?.parcelData
                                              ?.east_length).toFixed(2)) ||
                                            (+parcel.data[1]
                                              ?.totalLength)?.toFixed(2)
                                        )}{" "}
                                        م
                                      </td>
                                      <td>غربا</td>
                                      <td>
                                        {convertToArabic(
                                          parcel?.parcelData?.west_desc ||
                                            parcel.west_Desc
                                        )}
                                      </td>
                                      <td>بطول</td>
                                      <td>
                                        {convertToArabic(
                                          (parcel?.parcelData?.west_length &&
                                            (+parcel?.parcelData
                                              ?.west_length).toFixed(2)) ||
                                            (+parcel.data[3]
                                              ?.totalLength)?.toFixed(2)
                                        )}{" "}
                                        م
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            )
                          )}
                        <div>
                          <form>
                            <div
                              style={{
                                textAlign: "right",
                                margin: "20px 10px",
                              }}
                            >
                              <label style={{ marginRight: "25px" }}>
                                و هي عبارة عن
                              </label>
                              &nbsp;{" "}
                              {mainObject.duplix_building_details && (
                                <>
                                  {
                                    mainObject.duplix_building_details
                                      .duplix_building_details.duplix_is
                                  }
                                  {submissionTypeName ==
                                    "طلب فرز أراضي بنظام الدوبلكسات بالبيانات الوصفية" ||
                                  "طلب فرز أراضي بنظام الدوبلكسات"
                                    ? " وقد تم الترخيص بموجب رخصة بناء رقم"
                                    : " وقد تم البناء بموجب رخصة بناء رقم"}
                                  (
                                  {convertToArabic(
                                    mainObject.duplix_building_details
                                      .duplix_building_details
                                      .duplix_licence_number
                                  )}
                                  ) فى (
                                  {convertToArabic(
                                    mainObject.duplix_building_details
                                      .duplix_building_details
                                      .duplix_licence_date
                                  )}
                                </>
                              )}
                            </div>
                          </form>
                        </div>
                        {duplix.suggestions && (
                          <>
                            <div>
                              <div
                                style={{
                                  textAlign: "right",
                                  margin: "20px 10px",
                                }}
                              >
                                <p>
                                  وقد قررت اللجنة الموافقة على فرزها ضمن صكوك
                                  ملكية مستقلة على التحو الذى يشير إليه الرسم
                                  التوضيحي و ذلك كما يلي :
                                </p>
                              </div>
                            </div>
                            <div>
                              <table className="table table-bordered">
                                <thead>
                                  <tr>
                                    <td>رقم القطعة</td>
                                    <td>شمالا</td>
                                    <td>جنوبا</td>
                                    <td>شرقا</td>
                                    <td>غربا</td>
                                    <td>المساحة (م٢)</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {duplix.suggestions &&
                                    map(duplix.suggestions, (land) => {
                                      return (
                                        <tr>
                                          <td>
                                            {convertToArabic(
                                              land.parcel_name ||
                                                land.attributes?.PARCELNAME
                                            )}
                                          </td>
                                          {getParcelLengths(land)}
                                          {/* <td>
                                            {convertToArabic(
                                              (
                                                (land.attributes &&
                                                  +land.attributes
                                                    .north_length) ||
                                                +land.north_length ||
                                                +land.data[0].totalLength
                                              ).toFixed(2)
                                            )}{" "}
                                            م
                                          </td>
                                          <td>
                                            {convertToArabic(
                                              (
                                                (land.attributes &&
                                                  +land.attributes
                                                    .south_length) ||
                                                +land.south_length ||
                                                +land.data[4].totalLength
                                              ).toFixed(2)
                                            )}{" "}
                                            م
                                          </td>
                                          <td>
                                            {convertToArabic(
                                              (
                                                (land.attributes &&
                                                  +land.attributes
                                                    .east_length) ||
                                                +land.east_length ||
                                                +land.data[1].totalLength
                                              ).toFixed(2)
                                            )}{" "}
                                            م
                                          </td>
                                          <td>
                                            {convertToArabic(
                                              (
                                                (land.attributes &&
                                                  +land.attributes
                                                    .west_length) ||
                                                +land.west_length ||
                                                +land.data[3].totalLength
                                              ).toFixed(2)
                                            )}{" "}
                                            م
                                          </td> */}
                                          <td>
                                            {convertToArabic(
                                              (isNaN(
                                                +(
                                                  (land?.attributes &&
                                                    land?.attributes?.AREA) ||
                                                  land?.area
                                                )
                                              ) &&
                                                ((land?.attributes &&
                                                  land?.attributes?.AREA) ||
                                                  land?.area)) ||
                                                (+(
                                                  (land?.attributes &&
                                                    land?.attributes?.AREA) ||
                                                  land?.area
                                                )).toFixed(2) + " م٢" || // .toString().match(/\d+/)[0]
                                                0 + " م٢"
                                            )}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        <div
                          style={{
                            textAlign: "right",
                            // marginTop: "25px",
                            marginRight: "45px",
                          }}
                        >
                          <p className="notes_word">ملاحظات :</p>
                          <p>
                            {
                              convertToArabic(office_create_remark)
                              // ||
                              //   convertToArabic(office_remark)
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="leftPart" style={{ textAlign: "center" }}>
                      <div
                        className={
                          head ? "vertical_img_farz" : "horizontal_img"
                        }
                      >
                        <div className="right_img">
                          <div style={{ textAlign: "right" }}>
                            <label style={{ textAlign: "right" }}>
                              الوضع السابق
                            </label>
                            <br></br>
                            <label style={{ textAlign: "right" }}>
                              مقياس الرسم :
                            </label>
                            <p>1:1000</p>
                          </div>
                          <div
                            className="upperImg"
                            style={{ borderBottom: "1px solid" }}
                          >
                            <img
                              src={remove_duplicate(
                                mainObject.landData.imported_suggestImage ||
                                  landData.previous_Image ||
                                  landData.image_uploader
                              )}
                            />
                          </div>
                        </div>
                        <div className="left_img">
                          <div style={{ textAlign: "right" }}>
                            <label>الوضع المعتمد</label>
                            <br></br>
                            <label>مقياس الرسم :</label>
                            <p>1:1000</p>
                          </div>

                          <div
                            className="upperImg"
                            // style={{ borderBottom: "1px solid" }}
                          >
                            <img
                              src={remove_duplicate(
                                landData.approved_Image ||
                                  mainObject?.data_msa7y?.msa7yData?.cadDetails
                                    ?.suggestionsParcels?.[0]?.approved_Image ||
                                  // landData?.lands?.parcelData?.approved_Image ||
                                  mainObject?.data_msa7y?.msa7yData
                                    ?.screenshotURL ||
                                  (mainObject.sugLandData &&
                                    mainObject.sugLandData.sugLandData
                                      .APPROVED_IMAGE)
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      submission_lists.length == 1
                        ? "breakAfter"
                        : "section_down "
                    }
                  >
                    <div className="rightDown">
                      {/* <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",

                          // marginBottom: "15px",
                        }}
                      >
                        <div className="gap_tawke3">
                          <p style={{ marginBottom: "40px" }}>
                            {committeeactors3.position}
                          </p>
                          <p>{committeeactors3.name}</p>
                        </div>
                        <div className="gap_tawke3">
                          <p style={{ marginBottom: "40px" }}>
                            {committeeactors2.position}
                          </p>
                          <p>{committeeactors2.name}</p>
                        </div>
                      </div> */}
                      <p
                        style={{
                          borderTop: "1px solid",
                          borderBottom: "1px solid",
                          padding: "10px 0px",
                        }}
                      >
                        تم إعداد التقرير الفني وتعبئة هذا النموذج من قبل مكتب{" "}
                        {office_creator}
                      </p>
                      <div>
                        <p>صورة لبلدية {sub_municipality}</p>
                        <p>صورة لإدارة المساحة</p>
                        <p>صورة لإدارة التخطيط لتحديث المخططات</p>
                        <p>
                          صورة أساس المعاملة للإدارة العامة للتخطيط العمراني
                        </p>
                        <p>صورة لشركة السعودية للكهرباء فرع المنطقة الشرقية</p>
                      </div>
                    </div>
                    <div
                      className="leftDown"
                      style={{ textAlign: "justify", padding: "10px" }}
                    >
                      <div>
                        <p>
                          صاحب الفضل رئيس {issuer_name} <span>حفظه الله</span>
                        </p>
                        <p>السلام عليكم و رحمة الله و بركاته</p>
                        <p>
                          تجدون أعلاه محضر اللجنة الفنية رقم ({" "}
                          {convertToArabic(committee_report_number)} ) في ({" "}
                          {convertToArabic(committee_date)} ) المتظمن رأيها
                          الفني حيال طلب{" "}
                          {(["2", "3"].indexOf(ownerType) == -1 &&
                            (ownersCount > 1 ? "المواطنين" : "المواطن")) ||
                            (ownerType == "2" && "الجهة") ||
                            (ownerType == "3" &&
                              get(Object.values(userObject)[0], "subtype") ==
                                "1" &&
                              "شركة") ||
                            (ownerType == "3" &&
                              get(Object.values(userObject)[0], "subtype") ==
                                "2" &&
                              "مؤسسة")}{" "}
                          /{" "}
                          {(ownersCount > 1 &&
                            map(owners, (owner) => {
                              return owner.name;
                            }).join(" - ")) ||
                            owner_name}{" "}
                          . (تقسيم) العقار القائم
                          {convertToArabic(footerParcelsTitle)} بلك ({" "}
                          {convertToArabic(block_number) || "بدون"} ){" "}
                          {subdivision_type} ( {subdivision_description} ) ضمن
                          المخطط المعتمد رقم ( {convertToArabic(plan_number)} )
                          حي ( {district_name} ) الواقعة بمدينة ( {municipality}{" "}
                          ) وذلك ضمن صكوك ملكية مستقلة ولموافقتنا على ذلك نأمل
                          الإطلاع وإكمال اللازم وفق الأنظمة و التعليمات
                        </p>
                        <p>و السلام عليكم ورحمة الله و بركاته</p>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            border: "1px solid",
                            padding: "10px",
                          }}
                        >
                          <section>
                            <p>أمانةة المنطقة الشرقية</p>
                            <p>الإدارة العامة للتخطيط العمراني</p>
                            <p>رقم الصادر : {convertToArabic(export_number)}</p>
                            <p>تاريخه : {convertToArabic(export_date)} هـ</p>
                          </section>
                          <section>
                            <QRCode
                              size={128}
                              value={`رقم الصادر : ${export_number}`}
                            />
                          </section>
                        </div>

                        {/* <section style={{ textAlign: "center" }}>
                          <p style={{ marginBottom: "25px" }}>
                            {committeeactors1.position}
                          </p>
                          <p
                            style={{
                              marginLeft: "235px",
                              marginBottom: "25px",
                            }}
                          >
                            المهندس /
                          </p>
                          <p>{committeeactors1.name}</p>
                        </section> */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Modal>
    );
  }
}
export const duplxis = connect(mapStateToProps)(
  withTranslation("modals")(printDuplix)
);
