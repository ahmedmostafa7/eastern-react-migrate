import React, { Component } from "react";
import axios from "axios";
import { get, isEmpty, map, isNumber } from "lodash";
import { workFlowUrl, backEndUrlforMap } from "imports/config";
import moment from "moment-hijri";
// import { initializeSubmissionData } from "./printDefaults";
import { filesHost } from "imports/config";
import { initializeSubmissionData } from "main_helpers/functions/prints";
// import SignPic from "../../../../editPrint/signPics";
import {
  convertToArabic,
  remove_duplicate,
  get_print_data_by_id,
  map_subM,
  landsNoSort,
  mappingCity,
  getSubdivisionNameByCode,
  map_object,
  getInfo,
  getFieldDomain,
  getParcelLengths,
  selectActors,
  getDistrictNameById,
  isValidUrl,
} from "app/components/inputs/fields/identify/Component/common/common_func";
// import QRCode from "qrcode.react";
// let path=filehost/
import QRCode from "react-qr-code";
import { Row, Col } from "antd";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";
import ZoomSlider from "app/components/editPrint/zoomEdit";
import {
  print_name,
  selectMainObject,
  signature_type,
  switchBetweenTadkekMsa7yAndOriginalMsa7y,
} from "../../../../inputs/fields/identify/Component/common/common_func";
export default class printDuplix extends Component {
  state = { data: [] };
  componentDidMount() {
    getInfo().then((res) => {
      getFieldDomain("", res.Landbase_Parcel).then((domains) => {
        this.LayerDomains = domains;
        if (this.props.mo3aynaObject) {
          this.msa7yData = switchBetweenTadkekMsa7yAndOriginalMsa7y(
            this.props.mo3aynaObject
          );
          this.setPrintValues(this.props.mo3aynaObject);
        } else {
          initializeSubmissionData(this.props.match.params.id).then((res) => {
            let mainObject = res.mainObject;
            this.msa7yData =
              switchBetweenTadkekMsa7yAndOriginalMsa7y(mainObject);
            let municipalities = res.MunicipalityNames;
            if (mainObject?.landData) {
              map_object(mainObject?.landData?.landData);
              map_subM(this.msa7yData?.cadDetails?.suggestionsParcels);
            }
            let submissionData = res.submission;
            let committee_report_no = get(
              submissionData,
              "committee_report_no"
            );
            this.setState({ committee_report_no });
            console.log("data_print", mainObject, submissionData);
            this.setPrintValues(mainObject, submissionData, municipalities);
          });
        }

        this.cities = this.LayerDomains.find(
          (l) => l.name == "CITY_NAME"
        ).domain.codedValues;
      });
    });
  }
  // checkImg(path) {
  //   let url = `${filesHost}/users/${path}/sign.png`;
  //   if (url) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  setPrintValues(mainObject, submissionData, municipalities) {
    let request_number = submissionData && submissionData["request_no"];
    let committee_report_number =
      submissionData && submissionData["committee_report_no"];
    let committee_date = submissionData && submissionData["committee_date"];
    let create_date = (submissionData && submissionData["create_date"]) || "";
    let export_number = submissionData && submissionData["export_no"];
    let export_date = submissionData && submissionData["export_date"];

    let is_paid =
      submissionData?.submission_invoices?.filter(
        (invoice) => invoice?.is_paid == true
      )?.length == submissionData?.submission_invoices?.length ||
      submissionData.is_paid;

    let actors = selectActors(submissionData, mainObject, [4, 3, 2, 1, 0]);

    let signatures =
      (submissionData &&
        (submissionData?.committees?.committee_actors ||
          submissionData?.CurrentStep?.signatures)) ||
      (print_name &&
        signature_type &&
        mainObject?.print_signature[print_name][signature_type]?.signatures) ||
      (print_name && mainObject?.print_signature[print_name]?.signatures) ||
      [];
    ////
    let committeeactors1_id = actors?.find((r) => r.index == 4)?.id;
    let committeeactors2_id = actors?.find((r) => r.index == 3)?.id;
    // let committeeactors3_id =
    //   actors?.find(r => r.index == 2)?.user.id;

    let committeeactors_dynamica_id = actors?.filter(
      (d) =>
        d?.name ==
        (mainObject?.engSecratoryName ||
          actors?.find((r) => r.index == 2)?.name)
    )?.[0]?.id;

    let committeeactors1 = actors?.find((r) => r.index == 4);
    let committeeactors2 = actors?.find((r) => r.index == 3);
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
    mappingCity(mainObject, this.cities);
    let landData = mainObject?.landData?.landData;
    let sub_type = mainObject?.landData?.landData?.sub_type;
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
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.SUB_MUNICIPALITY_NAME;

    sub_municipality =
      (landData?.SUB_MUNICIPALITY && landData?.SUB_MUNICIPALITY?.name) ||
      (sub_municipality && sub_municipality?.name) ||
      sub_municipality ||
      "بدون";

    let plan_number =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.PLAN_NO ||
      //  landData?.PLAN_NO ||
      "بدون";

    let subdivision_type =
      getSubdivisionNameByCode(
        // landData?.subdivisions ||
        this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
          ?.SUBDIVISION_TYPE,
        this.LayerDomains.find((l) => l.name == "SUBDIVISION_TYPE")
      ) || "";

    let subdivision_description =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.SUBDIVISION_DESCRIPTION ||
      // landData?.DIVISION_DESCRIPTION ||
      // landData?.DIVISION_NO ||
      "بدون";
    getDistrictNameById(
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.DISTRICT_NAME ||
        // landData?.DISTRICT_NO ||
        "بدون"
    ).then((res) => {
      this.setState({ district_name: res });
    });

    let block_number =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.PARCEL_BLOCK_NO ||
      // landData?.BLOCK_NO ||
      "بدون";
    let parcel_plan_number =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.PARCEL_PLAN_NO ||
      //landData?.PARCEL_NO ||
      "بدون";
    let parcel_area =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.PARCEL_AREA ||
      // landData?.area ||
      "بدون";
    let using_symbol =
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.USING_SYMBOL ||
      this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
        ?.USING_SYMBOL_TEXT;

    let sak_number =
      mainObject?.waseka?.waseka?.table_waseka?.[0]?.number_waseka;
    let sak_date = mainObject?.waseka?.waseka?.table_waseka?.[0]?.date_waseka;
    let issuer_name =
      mainObject?.waseka?.waseka?.table_waseka?.[0]?.waseka_search;

    let parcel_type = landData?.lands?.parcelData?.parcel_type;
    let office_create_remark =
      (mainObject?.approvalSubmissionNotes &&
        mainObject?.approvalSubmissionNotes?.notes?.notes?.length &&
        mainObject?.approvalSubmissionNotes?.notes?.notes
          .filter((note) => !isEmpty(note?.notes))
          .map((note) => note?.notes)
          .join(" - ")) ||
      "";
    // approvalSubmissionNotes.notes.notes
    let office_remark =
      (mainObject?.remarks && mainObject?.remarks[0]?.comment) || "";
    let submission_type = landData?.submissionType || "";

    let defaults = this.init(mainObject, submissionData);
    let submission_lists = (defaults && defaults?.submission_lists) || [];
    let footerParcelsTitle = (defaults && defaults?.footerParcelsTitle) || {};

    let head;
    if (mainObject?.sugLandData) {
      head =
        mainObject?.sugLandData?.sugLandData?.HEAD == true ||
        mainObject?.sugLandData?.sugLandData?.HEAD == 1
          ? true
          : false;
    }

    if (mainObject?.data_msa7y) {
      head =
        mainObject?.data_msa7y?.msa7yData?.HEAD == true ||
        mainObject?.data_msa7y?.msa7yData?.HEAD == 1
          ? true
          : false;
    }

    this.setState({
      request_number,
      head,
      committee_report_number,
      committee_date,
      create_date,
      export_number,
      is_paid,
      export_date,
      committeeactors1_id,
      committeeactors2_id,
      committeeactors_dynamica_id,
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
      sak_number,
      sak_date,
      issuer_name,
      submissionData,
      submission_type,
      parcel_type,
      office_create_remark,
      office_remark,
      ownerType,
      userObject,
      signatures,
    });
    // console.log(parcel_plan);
  }

  init = (mainObject, submission) => {
    mainObject?.waseka?.waseka?.table_waseka?.forEach((land, index) => {
      if (!land?.PARCEL_PLAN_NO) {
        land.PARCEL_PLAN_NO =
          this.msa7yData?.cadDetails?.suggestionsParcels[
            land?.waseka_search ? 0 : index
          ]?.attributes?.PARCEL_PLAN_NO;
      }
    });

    //map_subM(this.msa7yData?.cadDetails?.suggestionsParcels);
    var perefLen = 6;
    var footerParcelsTitle = "";
    if (
      mainObject?.waseka?.waseka?.table_waseka?.length == 1 ||
      mainObject?.waseka?.waseka?.table_waseka?.length == 2
    ) {
      if (mainObject?.waseka?.waseka?.table_waseka?.length == 2) {
        footerParcelsTitle = "القطع ";
        mainObject?.waseka?.waseka?.table_waseka?.forEach((val) => {
          footerParcelsTitle += val.PARCEL_PLAN_NO + " , ";
        });
      } else {
        footerParcelsTitle = "القطعة ";
        footerParcelsTitle +=
          mainObject?.waseka?.waseka?.table_waseka?.[0]?.PARCEL_PLAN_NO + " , ";
      }
    } else {
      var selected_parcels_length = this.msa7yData?.cadDetails
        ?.suggestionsParcels
        ? this.msa7yData?.cadDetails?.suggestionsParcels?.length
        : 0;
      footerParcelsTitle =
        "القطع من  :" +
        this.msa7yData?.cadDetails?.suggestionsParcels?.[0]?.attributes
          ?.PARCEL_PLAN_NO +
        " الى : " +
        this.msa7yData?.cadDetails?.suggestionsParcels[
          selected_parcels_length - 1
        ]?.attributes?.PARCEL_PLAN_NO;
    }

    var submission_lists = [];
    var lists_object = {
      currents: [],
      suggestions: [],
    };
    var lists_length = 0;
    if (mainObject?.data_msa7y) {
      mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels = _.sortBy(
        mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels,
        (d) => {
          return landsNoSort(d, "parcel_name");
        }
      );
    }

    if (mainObject?.sugLandData) {
      mainObject.sugLandData.sugLandData.lands.suggestedParcels = _.sortBy(
        mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels,
        (d) => {
          return landsNoSort(d?.attributes, "PARCELNAME");
        }
      );
    }
    if (mainObject?.waseka) {
      mainObject.waseka.waseka.table_waseka = _.sortBy(
        mainObject?.waseka?.waseka?.table_waseka,
        (d) => {
          return landsNoSort(d, "PARCEL_PLAN_NO");
        }
      );
      this.msa7yData.cadDetails.suggestionsParcels = _.sortBy(
        this.msa7yData?.cadDetails?.suggestionsParcels,
        (d) => {
          return landsNoSort(d?.attributes, "PARCEL_PLAN_NO");
        }
      );
    }

    if (
      mainObject?.waseka &&
      mainObject?.waseka?.waseka?.table_waseka?.length > 0 &&
      mainObject?.data_msa7y &&
      mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
        ?.length > 0
    ) {
      lists_length =
        mainObject?.waseka &&
        mainObject?.waseka?.waseka?.table_waseka?.length +
          mainObject?.data_msa7y &&
        mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
          ?.length;
    }

    if (
      mainObject?.waseka?.waseka?.table_waseka?.length > 0 &&
      mainObject?.sugLandData &&
      mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels?.length > 0
    ) {
      lists_length =
        mainObject?.waseka?.waseka?.table_waseka?.length +
        mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels?.length;
    }

    if (lists_length > perefLen) {
      while (mainObject?.waseka?.waseka?.table_waseka?.length > 0) {
        lists_object?.currents?.push(
          mainObject?.waseka?.waseka?.table_waseka?.splice(0, perefLen)
        );
      }
      lists_object?.currents?.forEach((current, key) => {
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
          if (lists_object?.currents?.length == 1) {
            while (
              (mainObject?.data_msa7y &&
                mainObject?.data_msa7y?.msa7yData?.cadDetails
                  ?.suggestionsParcels?.length > 0) ||
              (mainObject?.sugLandData &&
                mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels
                  ?.length > 0)
            ) {
              submission_lists.push({
                suggestions:
                  (mainObject?.data_msa7y &&
                    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.splice(
                      0,
                      perefLen
                    )) ||
                  (mainObject?.sugLandData &&
                    mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels?.splice(
                      0,
                      perefLen
                    )),
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
                (mainObject?.data_msa7y &&
                  mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.splice(
                    0,
                    perefLen - current.length
                  )) ||
                (mainObject?.sugLandData &&
                  mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels?.splice(
                    0,
                    perefLen - current.length
                  )),
            });
          }

          while (
            (mainObject?.data_msa7y &&
              mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
                ?.length > 0) ||
            (mainObject?.sugLandData &&
              mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels
                ?.length > 0)
          ) {
            submission_lists.push({
              suggestions:
                (mainObject?.data_msa7y &&
                  mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.splice(
                    0,
                    perefLen
                  )) ||
                (mainObject?.sugLandData &&
                  mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels?.splice(
                    0,
                    perefLen
                  )),
            });
          }
        }
      });
      while (
        (mainObject?.data_msa7y &&
          mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
            ?.length > 0) ||
        (mainObject?.sugLandData &&
          mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels
            ?.length > 0)
      ) {
        submission_lists.push({
          suggestions:
            (mainObject?.data_msa7y &&
              mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.splice(
                0,
                perefLen
              )) ||
            (mainObject?.sugLandData &&
              mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels?.splice(
                0,
                perefLen
              )),
        });
      }
    } else {
      submission_lists = [
        {
          // landData.landData.lands.parcels[0]?.attributes?.PARCEL_AREA
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
            (mainObject?.data_msa7y &&
              mainObject?.data_msa7y?.msa7yData?.cadDetails
                ?.suggestionsParcels) ||
            (mainObject?.sugLandData &&
              mainObject?.sugLandData?.sugLandData?.lands?.suggestedParcels),
        },
      ];
    }

    return { submission_lists, footerParcelsTitle };
  };

  clearImg = (evt) => {
    this.src = "";
  };

  render() {
    let province_id = JSON.parse(localStorage.getItem("user"))?.province_id;
    const {
      request_number = "",
      committee_report_number = "",
      committee_date = "",
      create_date = "",
      export_number = "",
      export_date = "",
      committeeactors1_id = "",
      committeeactors2_id = "",
      committeeactors_dynamica_id = "",
      committeeactors1 = {},
      committeeactors2 = {},
      committeeactors3 = {},
      office_creator = "",
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
      is_paid = "",
      using_symbol = "",
      head = "",
      sak_number = "",
      sak_date = "",
      issuer_name = "",
      submissionData = {},
      submission_type = "",
      // parcel_type = "",
      office_create_remark = "",
      office_remark = "",
      committee_report_no,
      ownerType,
      userObject,
      signatures = null,
    } = this.state;
    let owners_name =
      owners &&
      owners.length &&
      Object.values(owners)
        .map((d) => d.name)
        .join("-");
    console.log("Head", owners_name);

    return (
      <div
        // className="table-report-container"
        className={
          !committee_report_no
            ? "watermark table-report-container font_size_12"
            : "no-watermark table-report-container font_size_12"
        }
        // style={{ zoom: ".79" }}
      >
        {/* <ReactToPrint
          trigger={() => {
            return (
            );
          }}
          content={() => this.componentRef}
        /> */}
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
                          بناء على التعميم الوزاري رقم( ١٣٣٨٤ ) وتاريخ ( ١٤ / ٣
                          / ١٤٣٤ ) هـ الخاص بتجزئة القطع والمباني السكنية الى
                          أجزاء أصغر او وحدات كل منها فى صك ملكية مستقل. عليه
                          فقد اجتمع أعضاء اللجنة الفنية للنظر فى المعاملات
                          المحالة للجنة. وبعد الإطلاع على الطلب المقدم
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
                                  {nationalityId == 1988 && (
                                    <span>الخليجي</span>
                                  )}{" "}
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
                                        }: ${convertToArabic(
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
                                {(subdivision_type ||
                                  landData?.subdivisions) && (
                                  <td>
                                    {subdivision_type || landData?.subdivisions}
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
                                      {convertToArabic(land?.selectedLands)}
                                    </td>
                                    {(subdivision_type ||
                                      landData?.subdivisions) && (
                                      <td>
                                        {convertToArabic(
                                          subdivision_description
                                        ) || "بدون"}
                                      </td>
                                    )}
                                    <td>
                                      {convertToArabic(land?.number_waseka)}
                                    </td>
                                    <td>
                                      {convertToArabic(land?.date_waseka)} هـ
                                    </td>
                                    <td>
                                      {convertToArabic(
                                        land?.USING_SYMBOL || using_symbol
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
                              <td>{convertToArabic(block_number) || "بدون"}</td>
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
                            style={{ textAlign: "right", margin: "3px 10px" }}
                          >
                            <label style={{ marginRight: "25px" }}>
                              و هي عبارة عن
                            </label>
                            &nbsp;{" "}
                            {mainObject.duplix_building_details && (
                              <label className="outline_print" type="text">
                                {
                                  mainObject?.duplix_building_details
                                    .duplix_building_details.duplix_is
                                }
                                {submissionData.workflow_id == "2048" ||
                                submissionData.workflow_id == "2068"
                                  ? " وقد تم الترخيص بموجب رخصة بناء رقم"
                                  : " وقد تم البناء بموجب رخصة بناء رقم"}
                                (
                                {convertToArabic(
                                  mainObject?.duplix_building_details
                                    .duplix_building_details
                                    .duplix_licence_number
                                )}
                                ) فى (
                                {convertToArabic(
                                  mainObject?.duplix_building_details
                                    .duplix_building_details.duplix_licence_date
                                )}
                                )
                              </label>
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
                                margin: "3px 10px",
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
                                            land?.parcel_name ||
                                              land?.attributes?.PARCELNAME
                                          )}
                                        </td>
                                        {getParcelLengths(land)}
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
                        className="notes_farz"
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
                      className={head ? "vertical_img_farz" : "horizontal_img"}
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
                                landData?.previous_Image ||
                                landData?.image_uploader
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
                              landData?.approved_Image ||
                                mainObject?.data_msa7y?.screenshotURL ||
                                mainObject?.data_msa7y?.msa7yData?.cadDetails
                                  ?.suggestionsParcels?.[0]?.approved_Image ||
                                // landData?.lands?.parcelData?.approved_Image ||
                                mainObject?.data_msa7y?.msa7yData
                                  ?.screenshotURL ||
                                (mainObject?.sugLandData &&
                                  mainObject?.sugLandData?.sugLandData
                                    ?.APPROVED_IMAGE)
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
                      <div
                        className={
                          is_paid == 1 &&
                          committee_report_no &&
                          province_id !== null
                            ? "gap_tawke3_small"
                            : "gap_tawke3"
                        }
                      >
                        <p style={{ marginBottom: "40px" }}>
                          {mainObject?.engSecratoryUser?.user?.positions
                            ?.name || committeeactors3.position}
                        </p>
                        {(mainObject?.engSecratoryUser ||
                          committeeactors3.is_approved) &&
                          committee_report_no &&
                          is_paid == 1 &&
                          province_id !== null &&
                          signatures?.length > 0 && (
                            <div>
                              <img
                                onError={(e) => {
                                  e.currentTarget.src = "";
                                }}
                                src={`${filesHost}/users/${
                                  mainObject?.engSecratoryUser?.user?.id ||
                                  committeeactors_dynamica_id
                                }/sign.png`}
                                width="150px"
                              />
                            </div>
                          )}
                        <p>
                          المهندس /{" "}
                          {mainObject?.engSecratoryUser?.engSecratoryName ||
                            mainObject?.engSecratoryName ||
                            committeeactors3.name}
                        </p>
                      </div>
                      <div
                        className={
                          is_paid == 1 &&
                          committee_report_no &&
                          province_id !== null
                            ? "gap_tawke3_small"
                            : "gap_tawke3"
                        }
                      >
                        <p style={{ marginBottom: "40px" }}>
                          {committeeactors2.position}
                        </p>
                        {committeeactors2.is_approved &&
                          committee_report_no &&
                          is_paid == 1 &&
                          province_id !== null &&
                          signatures?.length > 0 && (
                            <div>
                              <img
                                onError={(e) => {
                                  e.currentTarget.src = "";
                                }}
                                src={`${filesHost}/users/${committeeactors2_id}/sign.png`}
                                width="150px"
                              />
                            </div>
                          )}
                        <p>المهندس / {committeeactors2.name}</p>
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
                      <p>صورة أساس المعاملة للإدارة العامة للتخطيط العمراني</p>
                      <p>صورة لشركة السعودية للكهرباء فرع المنطقة الشرقية</p>
                    </div>
                  </div>
                  <div
                    className="leftDown"
                    style={{ textAlign: "justify", padding: "10px" }}
                  >
                    <div>
                      <p style={{ fontWeight: "bold" }}>
                        صاحب الفضيلة رئيس {issuer_name} <span>حفظه الله</span>
                      </p>
                      <p>السلام عليكم و رحمة الله و بركاته</p>
                      <p>
                        تجدون أعلاه محضر اللجنة الفنية رقم ({" "}
                        {convertToArabic(committee_report_number)} ) في ({" "}
                        {convertToArabic(committee_date)} ) المتظمن رأيها الفني
                        حيال طلب{" "}
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
                        . (تقسيم) العقار القائم{" "}
                        {convertToArabic(footerParcelsTitle)} بلك ({" "}
                        {convertToArabic(block_number) || "بدون"} ){" "}
                        {subdivision_type &&
                          (subdivision_type || landData?.subdivisions) +
                            ` (${convertToArabic(
                              subdivision_description
                            )})`}{" "}
                        ضمن المخطط المعتمد رقم ( {convertToArabic(plan_number)}{" "}
                        ) حي ( {district_name} ) الواقعة بمدينة ( {municipality}{" "}
                        ) وذلك ضمن صكوك ملكية مستقلة ولموافقتنا على ذلك نأمل
                        الإطلاع وإكمال اللازم وفق الأنظمة و التعليمات
                      </p>
                      <p> و السلام عليكم ورحمة الله و بركاته</p>
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
                          <p>أمانة المنطقة الشرقية</p>
                          <p>الإدارة العامة للتخطيط العمراني</p>
                          <p>رقم الصادر : {convertToArabic(export_number)}</p>
                          <p>تاريخه : {convertToArabic(export_date)} هـ</p>
                        </section>
                        <section>
                          <QRCode
                            size={128}
                            value={`Export Number : ${export_number}`}
                            export
                            number
                          />
                        </section>
                      </div>

                      {/* <section style={{ textAlign: "center", display: "grid" }}>
                        <p>{committeeactors1.position}</p>
                        {committeeactors1.is_approved &&
                          committee_report_no &&
                          is_paid == 1 &&
                          province_id !== null &&
                          signatures?.length > 0 && (
                            <div>
                              <img
                                onError={(e) => {
                                  e.currentTarget.src = "";
                                }}
                                src={`${filesHost}/users/${committeeactors1_id}/sign.png`}
                                width="200px"
                              />
                            </div>
                          )}
                        <p
                          style={{ textIndent: "-275px", marginBottom: "25px" }}
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
    );
  }
}
