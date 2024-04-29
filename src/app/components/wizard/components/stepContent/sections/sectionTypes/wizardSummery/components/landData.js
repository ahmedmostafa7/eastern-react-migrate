import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  convertToArabic,
  localizeNumber,
  getInfo,
  remove_duplicate,
  checkImage,
  map_object,
  checkImportedMainObject,
  selectMainObject,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { esriRequest } from "../../../../../../../inputs/fields/identify/Component/common/esri_request";
import { mapUrl } from "../../../../../../../inputs/fields/identify/Component/mapviewer/config/map";
import { map, get, assign, isEmpty } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { printHost } from "../../../../../../../../../imports/config";
import { Button } from "antd";
import { Collapse } from "antd";
import updateContractIdentifyComponnent from "../../../../../../../inputs/fields/identify/Component/updateContractIdentifyComponnent";
const { Panel } = Collapse;

class landData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subDivList: [],
      app_id:
        props?.currentModule?.record?.app_id ||
        props?.currentModule?.app_id ||
        0,
    };
  }

  componentDidMount() {
    let landData = this.props.mainObject?.landData?.landData || {};

    let isInvest = landData.isInvest;

    if (this.state.subDivList.length == 0 && !isInvest) {
      getInfo().then((res) => {
        esriRequest(mapUrl + "/" + res.Subdivision).then((response) => {
          this.setState({
            subDivList: response.fields[7].domain.codedValues.filter((item) => {
              return item.code != 4;
            }),
          });
        });
      });
    }
  }

  resizeImage = (evt) => {
    evt.target.style.height =
      evt.target.clientWidth - evt.target.clientWidth * 0.3 + "px";
  };

  showGoogleLink = (googleLink) => {
    window.open(googleLink, "_blank");
  };

  getShatfaAndElectricHeader = (landData) => {
    var title = "الشطفات وغرف الكهرباء";
    var isShatfa =
      landData.lands.survayParcelCutter &&
      (landData.lands.survayParcelCutter[0].SHATFA_NORTH_EAST_DIRECTION ||
        landData.lands.survayParcelCutter[0].SHATFA_NORTH_WEST_DIRECTION ||
        landData.lands.survayParcelCutter[0].SHATFA_SOUTH_EAST_DIRECTION ||
        landData.lands.survayParcelCutter[0].SHATFA_SOUTH_WEST_DIRECTION);

    if (landData.lands.electric_room_area && isShatfa) {
      title = "الشطفات وغرف الكهرباء";
    } else if (landData.lands.electric_room_area) {
      title = "غرف الكهرباء";
    } else if (isShatfa) {
      title = "الشطفات";
    } else {
      title = "";
    }

    return title;
  };

  getShatfaArea = (parcel) => {
    let shatfaArea = 0;
    if (parcel?.parcelShatfa && parcel?.parcelShatfa?.isSubtractArea) {
      if (parcel?.parcelShatfa.SHATFA_NORTH_EAST_DIRECTION) {
        shatfaArea += +parcel?.parcelShatfa?.SHATFA_NORTH_EAST_DIRECTION || 0;
      }
      if (parcel?.parcelShatfa.SHATFA_NORTH_WEST_DIRECTION) {
        shatfaArea += +parcel?.parcelShatfa?.SHATFA_NORTH_WEST_DIRECTION || 0;
      }
      if (parcel?.parcelShatfa.SHATFA_SOUTH_EAST_DIRECTION) {
        shatfaArea += +parcel?.parcelShatfa?.SHATFA_SOUTH_EAST_DIRECTION || 0;
      }
      if (parcel?.parcelShatfa.SHATFA_SOUTH_WEST_DIRECTION) {
        shatfaArea += +parcel?.parcelShatfa?.SHATFA_SOUTH_WEST_DIRECTION || 0;
      }
    }
    return shatfaArea;
  };

  calculateAreaForTadekekParcel = (parcel) => {
    let area = (+parcel?.attributes?.PARCEL_AREA).toFixed(2);

    if (
      parcel?.parcelElectric?.electric_room_area &&
      parcel?.parcelElectric?.isSubtractArea
    ) {
      area -= (+parcel?.parcelElectric?.electric_room_area || 0).toFixed(2);
    }
    area -= +this.getShatfaArea(parcel);

    return area;
  };

  getParcelAreaEquation = (parcel) => {
    let returnString = localizeNumber(+parcel?.attributes?.PARCEL_AREA);
    let isShatfaOrElec = false;

    if (
      parcel?.parcelElectric?.electric_room_area &&
      parcel?.parcelElectric?.isSubtractArea
    ) {
      returnString += " - ";
      isShatfaOrElec = true;
      returnString +=
        localizeNumber(
          parcel?.parcelElectric.electric_room_area
        ) /*+ " م" + localizeNumber(2) */ +
        " " +
        "( مساحة غرفة الكهرباء )";
    }

    if (
      parcel?.parcelShatfa &&
      this.getShatfaArea(parcel) > 0 &&
      parcel?.parcelShatfa?.isSubtractArea
    ) {
      returnString += " - ";
      isShatfaOrElec = true;
      returnString +=
        localizeNumber(
          this.getShatfaArea(parcel)
        ) /*+ " م" + localizeNumber(2) */ +
        " " +
        "( مساحة الشطفات )";
    }

    if (isShatfaOrElec)
      returnString +=
        " = " + localizeNumber(this.calculateAreaForTadekekParcel(parcel));

    return returnString;
  };

  openPrint = () => {
    // let id = this.props?.currentModule.CurrentStep?.id;
    if (this.props.currentModule.record.request_no) {
      const {
        t,
        mainObject: { submissionType },
        currentModule: {
          record: { id },
        },
      } = this.props;
      let landDataTemp =
        (this.props.mainObject.landData &&
          this.props.mainObject.landData.landData) ||
        {};

      localStorage.setItem(
        "parcelsData",
        JSON.stringify(landDataTemp?.lands?.parcels)
      );

      window.open(printHost + "/#/print_description_card/" + id, "_blank");
    } else {
      const { setModal } = this.props;
      setModal({
        title: "كارت الوصف",
        name: "fda2",
        // id: id,
        className: "mo3yna_full",
        type: "globalMo3yna",
        mo3aynaObject: this.props.mainObject,
      });
    }
  };

  accessObj = (path, object) => {
    return path.split(".").reduce((o, i) => o[i], object);
  };

  render() {
    const {
      t,
      mainObject: { submissionType },
    } = this.props;

    let submissionData =
      this.props.mainObject?.update_contract_submission_data
        ?.update_contract_submission_data ||
      this.props.mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData;
    let imported_mainObject = checkImportedMainObject(this.props);
    let suggestionsParcels =
      this.props.mainObject?.data_msa7y?.msa7yData?.cadDetails
        ?.suggestionsParcels;
    let tadkek_suggestionsParcels =
      this.props.mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData?.cadDetails
        ?.suggestionsParcels;
    let tadkek_request_no =
      this.props.mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData?.request_no;

    let landData = selectMainObject(this.props)?.landData?.landData || {};
    map_object(landData);

    let duplix_building_details =
      (this.props.mainObject.duplix_building_details &&
        this.props.mainObject.duplix_building_details
          .duplix_building_details) ||
      {};

    let isTadkekMesahy =
      (this.props?.currentModule?.app_id ||
        this.props?.currentModule?.record?.app_id) == 29;

    let isPropertyRemovable =
      (this.props?.currentModule?.app_id ||
        this.props?.currentModule?.record?.app_id) == 30;

    let isUpdateContract =
      (this.props?.currentModule?.app_id ||
        this.props?.currentModule?.record?.app_id) == 14;

    let isKrokyUpdateContract =
      (this.props.mainObject &&
        this.props.mainObject.data_msa7y &&
        this.props.mainObject.data_msa7y.msa7yData.cadDetails.temp
          .isKrokyUpdateContract) ||
      [2028, 2029, 2191].indexOf(
        this.props?.currentModule?.workflow_id ||
          this.props?.currentModule?.record?.workflow_id
      ) != -1 ||
      undefined;
    let isPlan =
      (this.props.mainObject &&
        this.props.mainObject.data_msa7y &&
        this.props.mainObject.data_msa7y.msa7yData.cadDetails.temp.isPlan) ||
      (this.props?.currentModule?.app_id ||
        this.props?.currentModule?.record?.app_id) == 27 ||
      undefined;

    let isFarz =
      (this.props?.currentModule?.app_id ||
        this.props?.currentModule?.record?.app_id) == 1;

    let subDiv = this.state.subDivList.filter(
      (divtype) =>
        divtype.code == landData?.lands?.temp?.subTypeval ||
        (landData.DIVISION_NO && divtype.code == landData.DIVISION_NO)
    )[0];

    let landImage =
      [34].indexOf(this.props.currentModule.id) != -1 ||
      [1949, 2048].indexOf(this.props.currentModule.record.workflow_id) != -1
        ? duplix_building_details.land_real_image
        : landData.image_uploader;

    let suggestImage =
      suggestionsParcels?.find((r) => r.approved_Image != undefined)
        ?.approved_Image ||
      this.props?.mainObject?.data_msa7y?.msa7yData?.screenshotURL;

    let imported_suggestImage =
      (imported_mainObject &&
        typeof imported_mainObject != "boolean" &&
        (imported_mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.find(
          (r) => r?.approved_Image != undefined
        )?.approved_Image ||
          imported_mainObject?.data_msa7y?.msa7yData?.screenshotURL)) ||
      this.props.mainObject?.landData?.imported_suggestImage ||
      "";

    let cad_image_uploader1 =
      ([1, 14].indexOf(this.state.app_id) != -1 &&
        this.props?.mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData
          ?.image_uploader) ||
      "";
    let cad_image_uploader2 =
      ([1, 14, 29].indexOf(this.state.app_id) != -1 &&
        this.props?.mainObject?.data_msa7y?.msa7yData?.image_uploader) ||
      "";

    let suggestionUrl =
      ([30].indexOf(this.state.app_id) != -1 &&
        this.props?.mainObject?.suggestParcelPropertyRemovable?.suggestParcel
          ?.submission_data?.suggestionUrl) ||
      "";

    let table_waseka = this.props?.mainObject?.waseka?.waseka?.table_waseka;

    let hdodAlMo3amla = suggestionsParcels && suggestionsParcels[0];

    let hdodAlMo3amlArea =
      this.props?.mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.reduce(
        function (memo, val) {
          return +memo + +(+val.area).toFixed(2);
        },
        0
      );

    let isInvest = landData.isInvest;
    let requestType =
      this.props?.mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData?.requestType;
    const investSugges = "SITE_ACTIVITY";

    this.parcel_fields_propertyRemoval = [
      { name: "MUNICIPALITY_NAME", label: "البلدية" },
      { name: "PLAN_NO", label: "المخطط" },
      { name: "PARCEL_BLOCK_NO", label: "رقم البلك" },
      { name: "DISTRICT_NAME", label: "الحي" },
      { name: "SUBDIVISION_TYPE", label: "نوع التقسيم" },
      { name: "SUBDIVISION_DESCRIPTION", label: "اسم التقسيم" },
      { name: "USING_SYMBOL", label: "رمز الإستخدام" },
      { name: "BUILD_AREA", label: "مساحة البناء (م٢)" },
    ];

    this.parcel_Area_Details_propertyRemoval = [
      {
        field: "PARCEL_AREA",
        cut_field: "PARCEL_CUT_AREA",
        remain_field: "PARCEL_Remain_AREA",
        label: "المساحة (م٢)",
        isArea: true,
      },
      {
        field: "parcelData.north_length",
        cut_field: "PARCEL_CUT_North_Lenght",
        remain_field: "PARCEL_Remain_North_Lenght",
        label: "طول الحد الشمالي (م)",
      },
      {
        field: "parcelData.north_desc",
        cut_field: "PARCEL_CUT_North_Desc",
        remain_field: "PARCEL_Remain_North_Desc",
        label: "وصف الحد الشمالي",
      },
      {
        field: "parcelData.east_length",
        cut_field: "PARCEL_CUT_East_Lenght",
        remain_field: "PARCEL_Remain_East_Lenght",
        label: "طول الحد الشرقي (م)",
      },
      {
        field: "parcelData.east_desc",
        cut_field: "PARCEL_CUT_East_Desc",
        remain_field: "PARCEL_Remain_East_Desc",
        label: "وصف الحد الشرقي",
      },
      {
        field: "parcelData.south_length",
        cut_field: "PARCEL_CUT_South_Lenght",
        remain_field: "PARCEL_Remain_South_Lenght",
        label: "طول الحد الجنوبي (م)",
      },
      {
        field: "parcelData.south_desc",
        cut_field: "PARCEL_CUT_South_Desc",
        remain_field: "PARCEL_Remain_South_Desc",
        label: "وصف الحد الجنوبي",
      },
      {
        field: "parcelData.west_length",
        cut_field: "PARCEL_CUT_West_Lenght",
        remain_field: "PARCEL_Remain_West_Lenght",
        label: "طول الحد الغربي (م)",
      },
      {
        field: "parcelData.west_desc",
        cut_field: "PARCEL_CUT_West_Desc",
        remain_field: "PARCEL_Remain_West_Desc",
        label: "وصف الحد الغربي",
      },
    ];

    this.suggest_fields_propertyRemoval = [
      {
        name: (parcel) => {
          return parcel.area.toFixed(2);
        },
        label: "المساحة (م٢)",
      },
      {
        name: (parcel) => {
          return parcel.data[0].totalLength;
        },
        label: "طول الحد الشمالي (م)",
      },
      {
        name: (parcel) => {
          return parcel.north_Desc;
        },
        label: "وصف الحد الشمالي",
      },
      {
        name: (parcel) => {
          return parcel.data[4].totalLength;
        },
        label: "طول الحد الجنوبي (م)",
      },
      {
        name: (parcel) => {
          return parcel.south_Desc;
        },
        label: "وصف الحد الجنوبي",
      },
      {
        name: (parcel) => {
          return parcel.data[1].totalLength;
        },
        label: "(م) طول الحد الشرقي",
      },
      {
        name: (parcel) => {
          return parcel.east_Desc;
        },
        label: "وصف الحد الشرقي",
      },
      {
        name: (parcel) => {
          return parcel.data[3].totalLength;
        },
        label: "(م) طول الحد الغربي",
      },
      {
        name: (parcel) => {
          return parcel.weast_Desc;
        },
        label: "وصف الحد الغربي",
      },
    ];

    this.parcel_fields_headers = [
      "البلدية",
      "البلدية الفرعية",
      "الحي",
      "رقم المخطط",
      "رقم الأرض",
      "المساحة التقريبية (م۲)",
      "اسم التقسيم",
      "وصف التقسيم",
      "رمز الإستخدام",
      "النشاط الرئيسي",
      "النشاط المقترح",
      "الإحداثي السيني",
      "الإحداثي الصادي",
      "رابط الوصول بخرائط جوجل",
    ];

    this.parcel_fields = [
      {
        name: "MUNICIPALITY_NAME",
      },
      {
        name: "SUB_MUNICIPALITY_NAME",
      },
      {
        name: "DISTRICT_NAME",
      },
      {
        name: "PLAN_NO",
      },
      { name: "PARCEL_PLAN_NO" },
      {
        name: "PARCEL_AREA",
      },
      { name: "SUBDIVISION_TYPE" },
      { name: "SUBDIVISION_DESCRIPTION" },
      { name: "USING_SYMBOL" },
      {
        name: "PARCEL_MAIN_LUSE",
      },
      {
        name: investSugges,
      },
      {
        name: "X",
      },
      {
        name: "Y",
      },
      {
        name: "googleLink",
        type: "button",
      },
    ];

    return (
      ((landData?.lands?.parcels?.length || isUpdateContract || isFarz) && (
        <>
          {isInvest ? (
            <div>
              <Button
                type="primary"
                icon="print"
                onClick={this.openPrint.bind(this)}
              >
                طباعة كارت الوصف
              </Button>

              <table className="table table-bordered" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    {this.parcel_fields_headers.map((field_header, k) => {
                      return <th>{field_header}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {landData?.lands?.parcels.map((feature, index) => {
                    return (
                      <tr>
                        {this.parcel_fields.map((field, k) => {
                          return (
                            <td key={k}>
                              {field.type == "button" ? (
                                <button
                                  className="btn btn-primary"
                                  style={{ marginRight: "20px" }}
                                  onClick={this.showGoogleLink.bind(
                                    this,
                                    feature?.attributes?.googleLink
                                  )}
                                >
                                  عرض
                                </button>
                              ) : (
                                <>
                                  {localizeNumber(
                                    feature?.attributes?.[field.name] ||
                                      "غير متوفر"
                                  )}
                                </>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {landData?.lands?.parcels?.length == 1 && (
                <div>{checkImage(this.props, landData.previous_Image, {})}</div>
              )}
            </div>
          ) : (
            <div>
              <table className="table table-bordered">
                <tr>
                  <td>
                    {isUpdateContract && imported_mainObject != undefined && (
                      <Collapse
                        className="Collapse"
                        defaultActiveKey={["0"]}
                        key={"shafta"}
                      >
                        <Panel
                          header={t("update_contract_submission_data")}
                          forceRender={true}
                          style={{ margin: "5px" }}
                          key={"0"}
                        >
                          <table className="table table-bordered">
                            {[
                              {
                                key: "request_no",
                                label: "رقم معاملة التدقيق المكاني",
                                isValue: true,
                              },
                              {
                                key: "sakType",
                                label: "نوع الوثيقة",
                                isValue: true,
                                data: [
                                  {
                                    label: "فرز صكوك",
                                    value: "1",
                                  },
                                  {
                                    label: "تحديث صك الكتروني",
                                    value: "3",
                                  },
                                  {
                                    label: "تحديث صك ورقي",
                                    value: "4",
                                  },
                                ],
                              },
                              {
                                key: "update_owner_date",
                                label: "CONTRACTUPDATEOWNWEDATA",
                              },
                              {
                                key: "modify_length_boundries",
                                label: "CONTRACTUPDATEBOUNDRIESMODIFICATION",
                              },
                              {
                                key: "modify_transaction_type_dukan",
                                label: "DUKANTRANSACTIONTYPE",
                              },
                              // {
                              //   key: "modify_area_increase",
                              //   label: "CONTRACTUPDATEAREAMODIFICATIONINC",
                              // },
                              // {
                              //   key: "modify_area_decrease",
                              //   label: "CONTRACTUPDATEAREAMODIFICATIONDEC",
                              // },
                              {
                                key: "update_lengths_units",
                                label: "CONTRACTUPDATELENGTHSUNITS",
                              },
                              {
                                key: "update_district_name",
                                label: "CONTRACTUPDATEDISTRECTNAME",
                              },
                              {
                                key: "update_plan_number",
                                label: "CONTRACTUPDATEPLANENUMBER",
                              },
                              {
                                key: "update_block",
                                label: "CONTRACTUPDATEBLOCK",
                              },
                              {
                                key: "update_paper_contract",
                                label: "CONTRACTUPDATEPAPERCONTRACT",
                              },
                              {
                                key: "splite_parcels_by_one_contarct",
                                label: "CONTRACTUPDATETOONECONTRACT",
                              },
                              {
                                key: "marge_contracts_for_parcels",
                                label: "CONTRACTUPDATEMARGECONTRACTS",
                              },
                            ]
                              .filter((item) => submissionData[item.key])
                              .map((item, index) => {
                                return (
                                  <tr>
                                    <td>{t(`${item.label}`)}</td>
                                    {(item.isValue && (
                                      <td>
                                        {convertToArabic(
                                          (item.data &&
                                            item.data.find(
                                              (r) =>
                                                r.value ==
                                                submissionData[item.key]
                                            ).label) ||
                                            submissionData[item.key]
                                        )}
                                      </td>
                                    )) || (
                                      <td>
                                        <input
                                          type={"checkbox"}
                                          disabled={true}
                                          checked={submissionData[item.key]}
                                        />
                                      </td>
                                    )}
                                  </tr>
                                );
                              }) || (
                              <tr>
                                <td>لا يوجد بيانات</td>
                              </tr>
                            )}
                          </table>
                        </Panel>
                      </Collapse>
                    )}
                  </td>
                </tr>
                <tr>
                  <td valign="top" style={{ width: "50%" }}>
                    {isPropertyRemovable ? (
                      <>
                        {landData.lands.parcels.map((parcel, i) => {
                          return (
                            <Collapse
                              className="Collapse"
                              defaultActiveKey={[]}
                              key={i}
                            >
                              <Panel
                                header={convertToArabic(
                                  `بلدية ${parcel.attributes.MUNICIPALITY_NAME} - مخطط ${parcel.attributes.PLAN_NO} - قطعة أرض رقم ${parcel?.attributes?.PARCEL_PLAN_NO}`
                                )}
                                forceRender={true}
                                style={{ margin: "5px" }}
                              >
                                <table key={i} class="table table-bordered">
                                  <tbody>
                                    {this.parcel_fields_propertyRemoval.map(
                                      (field, key) => {
                                        return field.name == "BUILD_AREA" ? (
                                          <>
                                            <td>{field.label}</td>
                                            <td>
                                              {parcel.attributes[field.name]
                                                ? convertToArabic(
                                                    parcel.attributes[
                                                      field.name
                                                    ]
                                                  )
                                                : "لا توجد"}
                                            </td>
                                          </>
                                        ) : (
                                          parcel.attributes[field.name] && (
                                            <tr key={key}>
                                              <td>{field.label}</td>
                                              <td>
                                                {convertToArabic(
                                                  parcel.attributes[field.name]
                                                )}
                                              </td>
                                            </tr>
                                          )
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>

                                <table
                                  key={i + "key"}
                                  class="table table-striped table-bordered"
                                >
                                  <thead>
                                    <tr>
                                      <th></th>
                                      <th>بيانات قطع الأراضي</th>
                                      <th>
                                        بيانات الجزء المنزوع من قطعة الأرض
                                      </th>
                                      <th>
                                        بيانات الجزء المتبقي من قطعة الأرض
                                      </th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {this.parcel_Area_Details_propertyRemoval.map(
                                      (item, k) => {
                                        return (
                                          <tr key={k}>
                                            <td>{item.label}</td>
                                            <td>
                                              {convertToArabic(
                                                get(
                                                  parcel.attributes,
                                                  item.field
                                                )
                                              )}
                                            </td>
                                            <td>
                                              {convertToArabic(
                                                parcel.attributes[
                                                  item.cut_field
                                                ]
                                              )}
                                            </td>
                                            <td>
                                              {convertToArabic(
                                                parcel.attributes[
                                                  item.remain_field
                                                ]
                                              )}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </Panel>
                            </Collapse>
                          );
                        })}
                      </>
                    ) : (
                      <Collapse
                        className="Collapse"
                        defaultActiveKey={["0"]}
                        key={"parcelData"}
                      >
                        <Panel
                          header={t("بيانات الأرض")}
                          forceRender={true}
                          style={{ margin: "5px" }}
                          key={"0"}
                        >
                          <table className="table table-bordered">
                            <tbody>
                              <>
                                {/* !isPlan &&  */}

                                {[21, 20].indexOf(this.state.app_id) == -1 &&
                                  !isKrokyUpdateContract &&
                                  !isTadkekMesahy &&
                                  !isFarz &&
                                  !isUpdateContract &&
                                  (landData.submissionType ||
                                    landData.sub_type) && (
                                    <tr>
                                      <td>{t("Submission Type")}</td>
                                      <td>
                                        {landData.submissionType ||
                                          submissionType ||
                                          (landData.sub_type == 1 && "فرز") ||
                                          (landData.sub_type == 2 && "دمج") ||
                                          (landData.sub_type == 3 && "تقسيم") ||
                                          landData.sub_type}
                                      </td>
                                    </tr>
                                  )}
                                {isKrokyUpdateContract && !isTadkekMesahy && (
                                  <tr>
                                    <td>{t("Submission Type")}</td>
                                    <td>
                                      {landData.submissionType ||
                                        "إصدار الكروكي المساحي"}
                                    </td>
                                  </tr>
                                )}
                                {isTadkekMesahy && (
                                  <tr>
                                    <td>{t("Submission Type")}</td>
                                    <td>{"التدقيق المكاني"}</td>
                                  </tr>
                                )}
                                {imported_mainObject &&
                                  (isFarz || isUpdateContract) &&
                                  this.props.currentModule?.record?.workflows
                                    ?.name && (
                                    <tr>
                                      <td>
                                        {t(
                                          (isFarz && "نوع مسار العمل") ||
                                            "Submission Type"
                                        )}
                                      </td>
                                      <td>
                                        {
                                          this.props.currentModule?.record
                                            ?.workflows?.name
                                        }
                                      </td>
                                    </tr>
                                  )}
                                {isFarz && requestType && (
                                  <tr>
                                    <td>نوع المعاملة</td>
                                    <td>
                                      {convertToArabic(
                                        (requestType == 1 && "فرز") || "دمج"
                                      )}
                                    </td>
                                  </tr>
                                )}
                                {isFarz && tadkek_request_no && (
                                  <tr>
                                    <td>رقم المعاملة (التدقيق المكاني)</td>
                                    <td>
                                      {convertToArabic(tadkek_request_no)}
                                    </td>
                                  </tr>
                                )}
                                {(isTadkekMesahy ||
                                  (imported_mainObject &&
                                    (isFarz || isUpdateContract))) && (
                                  <tr>
                                    <td>الغرض من المعاملة (التدقيق المكاني)</td>
                                    <td>
                                      {landData?.lands?.selectedMoamlaType ==
                                        "1" || isFarz
                                        ? "فرز الأراضي"
                                        : "تحديث الصكوك"}
                                    </td>
                                  </tr>
                                )}
                                {isTadkekMesahy &&
                                  landData?.lands?.selectedMoamlaType ==
                                    "1" && (
                                    <tr>
                                      <td>نوع الفرز</td>
                                      <td>
                                        {(landData.req_type &&
                                          "فرز دوبلكسات") ||
                                          "فرز أرض فضاء"}
                                      </td>
                                    </tr>
                                  )}
                                {landData.municipality && (
                                  <tr>
                                    <td>{t("Municipality name")}</td>
                                    <td>{landData.municipality.name}</td>
                                  </tr>
                                )}
                                {/* {isFarz &&
                            (landData?.DISTRICT_NO ||
                              landData?.lands?.parcels?.[0]?.attributes
                                ?.DISTRICT_NAME) && (
                              <tr>
                                <td>اسم الحي</td>
                                <td>
                                  {localizeNumber(
                                    landData.DISTRICT_NO ||
                                      landData.lands.parcels[0].attributes
                                        .DISTRICT_NAME
                                  )}
                                </td>
                              </tr>
                            )} */}
                                {(isKrokyUpdateContract || isUpdateContract) &&
                                  landData?.lands?.parcels &&
                                  !isEmpty(
                                    landData?.lands?.parcels[0]?.attributes
                                      ?.SUBDIVISION_TYPE
                                  ) &&
                                  !isEmpty(
                                    landData?.lands?.parcels[0]?.attributes
                                      ?.SUBDIVISION_DESCRIPTION
                                  ) && (
                                    <tr>
                                      <td>
                                        {landData?.lands?.parcels[0]?.attributes
                                          ?.SUBDIVISION_TYPE ||
                                          landData.subdivisions}
                                      </td>
                                      <td>
                                        {localizeNumber(
                                          landData?.lands?.parcels[0]
                                            ?.attributes
                                            ?.SUBDIVISION_DESCRIPTION ||
                                            landData.DIVISION_NO
                                        )}
                                      </td>
                                    </tr>
                                  )}

                                {(((isKrokyUpdateContract ||
                                  isUpdateContract) &&
                                  landData?.lands?.parcels &&
                                  !isEmpty(
                                    landData?.lands?.parcels[0]?.attributes
                                      ?.SUBDIVISION_TYPE
                                  ) &&
                                  isEmpty(
                                    landData?.lands?.parcels[0]?.attributes
                                      ?.SUBDIVISION_DESCRIPTION
                                  )) ||
                                  (!isEmpty(landData.subdivisions) &&
                                    isEmpty(landData.DIVISION_NO))) && (
                                  <tr>
                                    <td>
                                      {landData?.lands?.parcels[0]?.attributes
                                        ?.SUBDIVISION_TYPE ||
                                        landData.subdivisions}
                                    </td>
                                    <td>{"بدون"}</td>
                                  </tr>
                                )}

                                {((isKrokyUpdateContract &&
                                  landData.lands.parcels[0].attributes
                                    .PARCEL_BLOCK_NO) ||
                                  landData?.BLOCK_NO) && (
                                  <tr>
                                    <td>{t("BlockNo")}</td>
                                    <td>
                                      {localizeNumber(
                                        landData?.lands?.parcels?.[0]
                                          ?.attributes?.PARCEL_BLOCK_NO ||
                                          landData?.BLOCK_NO
                                      )}
                                    </td>
                                  </tr>
                                )}
                                {landData?.lands?.parcels?.[0]?.attributes
                                  ?.DISTRICT_NAME && (
                                  <tr>
                                    <td>{t("District")}</td>
                                    <td>
                                      {localizeNumber(
                                        landData?.lands?.parcels?.[0]
                                          ?.attributes?.DISTRICT_NAME
                                      )}
                                    </td>
                                  </tr>
                                )}
                                {isKrokyUpdateContract &&
                                  (landData.STREET_NO ||
                                    landData?.lands?.parcels?.[0]?.attributes
                                      ?.STREET_NAME) && (
                                    <tr>
                                      <td>{t("Street")}</td>
                                      <td>
                                        {localizeNumber(
                                          landData.STREET_NO ||
                                            landData?.lands?.parcels?.[0]
                                              ?.attributes?.STREET_NAME
                                        )}
                                      </td>
                                    </tr>
                                  )}
                                {isFarz &&
                                  ((landData.subdivisions &&
                                    landData.DIVISION_NO) ||
                                    (!landData.subdivisions &&
                                      landData.DIVISION_NO &&
                                      landData.DIVISION_DESCRIPTION) ||
                                    (subDiv &&
                                      landData?.lands?.temp?.subname)) && (
                                    <tr>
                                      <td>
                                        {landData.subdivisions ||
                                          (subDiv && subDiv.name) ||
                                          landData.DIVISION_NO}
                                      </td>
                                      <td>
                                        {
                                          /*landData.DIVISION_NO ||*/
                                          landData.DIVISION_DESCRIPTION ||
                                            landData.lands.temp.subname
                                        }
                                      </td>
                                    </tr>
                                  )}
                                {isFarz &&
                                  ((landData.subdivisions &&
                                    !landData.DIVISION_NO) ||
                                    (!landData.subdivisions &&
                                      landData.DIVISION_NO &&
                                      !landData.DIVISION_DESCRIPTION) ||
                                    (subDiv &&
                                      !landData?.lands?.temp?.subname)) && (
                                    <tr>
                                      <td>
                                        {landData.subdivisions ||
                                          (subDiv && subDiv.name) ||
                                          landData.DIVISION_NO}
                                      </td>
                                      <td>{"بدون"}</td>
                                    </tr>
                                  )}

                                {isFarz &&
                                  landData.STREET_NO &&
                                  !landData.lands.temp && (
                                    <tr>
                                      <td>{t("Street")}</td>
                                      <td>
                                        {localizeNumber(landData.STREET_NO)}
                                      </td>
                                    </tr>
                                  )}
                                {isFarz &&
                                  landData.BLOCK_NO &&
                                  !landData.lands.temp && (
                                    <tr>
                                      <td>{t("BlockNo")}</td>
                                      <td>
                                        {localizeNumber(landData.BLOCK_NO)}
                                      </td>
                                    </tr>
                                  )}
                                {isFarz && landData?.lands?.temp?.block_no && (
                                  <tr>
                                    <td>{t("BlockNo")}</td>
                                    <td>
                                      {localizeNumber(
                                        landData.lands.temp.block_no
                                      )}
                                    </td>
                                  </tr>
                                )}

                                {!isPlan && landData.PLAN_NO && (
                                  <tr>
                                    <td>{t("Plan Number")}</td>
                                    <td>{localizeNumber(landData.PLAN_NO)}</td>
                                  </tr>
                                )}
                                {landData?.lands?.parcels && (
                                  <tr>
                                    <td>{t("Submission parcels")}</td>
                                    <td>
                                      {localizeNumber(
                                        landData.lands.parcels
                                          .map((parcel, index) => {
                                            return (
                                              parcel?.attributes
                                                ?.PARCEL_PLAN_NO ||
                                              parcel?.attributes?.PARCELNAME
                                            );
                                          })
                                          .join(" - ")
                                      )}
                                    </td>
                                  </tr>
                                )}
                                {[22].indexOf(this.props.currentModule.id) ==
                                  -1 && (
                                  <tr>
                                    <td>
                                      {t("Submission parcel area")} (م
                                      {localizeNumber(2)})
                                    </td>
                                    <td>
                                      {localizeNumber(
                                        isTadkekMesahy ||
                                          isFarz ||
                                          isUpdateContract
                                          ? (+hdodAlMo3amlArea).toFixed(2)
                                          : landData.area
                                      )}{" "}
                                      م{localizeNumber(2)}
                                    </td>
                                  </tr>
                                )}

                                {landData?.lands?.parcelData?.north_desc &&
                                  !isTadkekMesahy &&
                                  !isFarz &&
                                  !isUpdateContract && (
                                    <tr>
                                      <td>{t("North Description")}</td>
                                      <td>
                                        {localizeNumber(
                                          isTadkekMesahy
                                            ? hdodAlMo3amla.north_Desc
                                            : landData?.lands?.parcelData
                                                ?.north_desc
                                        )}
                                      </td>
                                    </tr>
                                  )}
                                {[22].indexOf(this.props.currentModule.id) ==
                                  -1 &&
                                  landData?.lands?.parcelData?.north_length &&
                                  !isTadkekMesahy &&
                                  !isFarz &&
                                  !isUpdateContract && (
                                    <tr>
                                      <td>{t("North Length")} (م)</td>
                                      <td>
                                        {localizeNumber(
                                          isTadkekMesahy
                                            ? hdodAlMo3amla.data[0].totalLength
                                            : landData.lands.parcelData
                                                .north_length
                                        )}{" "}
                                        م
                                      </td>
                                    </tr>
                                  )}
                                {landData?.lands?.parcelData?.east_desc &&
                                  !isTadkekMesahy &&
                                  !isFarz &&
                                  !isUpdateContract && (
                                    <tr>
                                      <td>{t("East Description")}</td>
                                      <td>
                                        {localizeNumber(
                                          isTadkekMesahy
                                            ? hdodAlMo3amla.east_Desc
                                            : landData?.lands?.parcelData
                                                ?.east_desc
                                        )}
                                      </td>
                                    </tr>
                                  )}
                                {[22].indexOf(this.props.currentModule.id) ==
                                  -1 &&
                                  landData?.lands?.parcelData?.east_length &&
                                  !isTadkekMesahy &&
                                  !isFarz &&
                                  !isUpdateContract && (
                                    <tr>
                                      <td>{t("East Length")} (م)</td>
                                      <td>
                                        {localizeNumber(
                                          isTadkekMesahy
                                            ? hdodAlMo3amla.data[1].totalLength
                                            : landData?.lands?.parcelData
                                                ?.east_length
                                        )}{" "}
                                        م
                                      </td>
                                    </tr>
                                  )}
                                {landData?.lands?.parcelData?.west_desc &&
                                  !isTadkekMesahy &&
                                  !isFarz &&
                                  !isUpdateContract && (
                                    <tr>
                                      <td>{t("West Description")}</td>
                                      <td>
                                        {localizeNumber(
                                          isTadkekMesahy
                                            ? hdodAlMo3amla.west_Desc
                                            : landData.lands.parcelData
                                                .west_desc
                                        )}
                                      </td>
                                    </tr>
                                  )}
                                {[22].indexOf(this.props.currentModule.id) ==
                                  -1 &&
                                  landData?.lands?.parcelData?.west_length &&
                                  !isTadkekMesahy &&
                                  !isFarz &&
                                  !isUpdateContract && (
                                    <tr>
                                      <td>{t("West Length")} (م)</td>
                                      <td>
                                        {localizeNumber(
                                          isTadkekMesahy
                                            ? hdodAlMo3amla.data[3].totalLength
                                            : landData?.lands?.parcelData
                                                ?.west_length
                                        )}{" "}
                                        م
                                      </td>
                                    </tr>
                                  )}
                                {landData?.lands?.parcelData?.south_desc &&
                                  !isTadkekMesahy &&
                                  !isFarz &&
                                  !isUpdateContract && (
                                    <tr>
                                      <td>{t("South Description")}</td>
                                      <td>
                                        {localizeNumber(
                                          isTadkekMesahy
                                            ? hdodAlMo3amla.south_Desc
                                            : landData?.lands?.parcelData
                                                ?.south_desc
                                        )}
                                      </td>
                                    </tr>
                                  )}
                                {[22].indexOf(this.props.currentModule.id) ==
                                  -1 &&
                                  landData?.lands?.parcelData?.south_length &&
                                  !isTadkekMesahy &&
                                  !isFarz &&
                                  !isUpdateContract && (
                                    <tr>
                                      <td>{t("South Length")} (م)</td>
                                      <td>
                                        {localizeNumber(
                                          isTadkekMesahy
                                            ? hdodAlMo3amla.data[4].totalLength
                                            : landData?.lands?.parcelData
                                                ?.south_length
                                        )}{" "}
                                        م
                                      </td>
                                    </tr>
                                  )}
                                {isFarz &&
                                  !([29].indexOf(this.state.app_id) > -1) &&
                                  [22].indexOf(this.props.currentModule.id) ==
                                    -1 && (
                                    <tr>
                                      <td style={{ width: "400px" }}>
                                        {t("CHANGEPARCELLABEL")}
                                      </td>
                                      <td>
                                        {isEmpty(
                                          this.props.mainObject
                                            ?.tadkek_data_Msa7y
                                            ?.tadkek_msa7yData
                                            ?.CHANGEPARCELReason
                                        ) &&
                                        isEmpty(landData.CHANGEPARCELReason)
                                          ? "لا يوجد اختلاف"
                                          : landData.CHANGEPARCELReason ||
                                            this.props.mainObject
                                              ?.tadkek_data_Msa7y
                                              ?.tadkek_msa7yData
                                              ?.CHANGEPARCELReason}
                                      </td>
                                    </tr>
                                  )}
                                {isFarz &&
                                  !([29].indexOf(this.state.app_id) > -1) &&
                                  [22].indexOf(this.props.currentModule.id) ==
                                    -1 && (
                                    <tr>
                                      <td style={{ width: "400px" }}>
                                        {t("مخالفات")}
                                      </td>
                                      <td>
                                        {isEmpty(
                                          this.props.mainObject
                                            ?.tadkek_data_Msa7y
                                            ?.tadkek_msa7yData?.VIOLATION_STATE
                                        ) && isEmpty(landData?.VIOLATION_STATE)
                                          ? "لا يوجد مخالفات"
                                          : landData?.VIOLATION_STATE ||
                                            this.props.mainObject
                                              ?.tadkek_data_Msa7y
                                              ?.tadkek_msa7yData
                                              ?.VIOLATION_STATE}
                                      </td>
                                    </tr>
                                  )}
                                {[1].indexOf(this.state.app_id) != -1 &&
                                  [10501, 10506, 10513].indexOf(
                                    landData.MUNICIPALITY_NAME
                                  ) != -1 &&
                                  landData?.lands?.parcels?.find(
                                    (parcel) =>
                                      parcel?.attributes?.UNITS_NUMBER &&
                                      parcel?.attributes?.USING_SYMBOL_Code ==
                                        "س1-أ"
                                  ) != undefined && (
                                    <tr>
                                      <td>عدد الوحدات</td>
                                      <td>
                                        <table class="table table-striped table-bordered">
                                          {landData.lands.parcels.map(
                                            (parcel, index) => {
                                              return (
                                                <tr>
                                                  <td>
                                                    قطعة رقم{" "}
                                                    {localizeNumber(
                                                      parcel?.attributes
                                                        ?.PARCEL_PLAN_NO
                                                    )}
                                                  </td>
                                                  <td>
                                                    {
                                                      parcel?.attributes
                                                        ?.UNITS_NUMBER
                                                    }
                                                  </td>
                                                </tr>
                                              );
                                            }
                                          )}
                                        </table>
                                      </td>
                                    </tr>
                                  )}
                                {landData.SITE_DESC && (
                                  <tr>
                                    <td style={{ width: "400px" }}>
                                      {"وصف موقع النافذ اوالشارع المراد ضمه"}
                                    </td>
                                    <td>
                                      {convertToArabic(landData.SITE_DESC)}
                                    </td>
                                  </tr>
                                )}
                                {[59, 58, 63, 74].indexOf(
                                  this.props.treeNode.option.module_id
                                ) != -1 &&
                                  landData.SITE_DESC_METER && (
                                    <tr>
                                      <td style={{ width: "400px" }}>
                                        {"بيانات عرض النافذ اوالممر ( م٢ )"}
                                      </td>
                                      <td>{landData.SITE_DESC_METER}</td>
                                    </tr>
                                  )}
                                {/* {isFarz && [22].indexOf(this.props.currentModule.id) == -1 && (
                      <tr>
                        <td>{t("sakValid")}</td>
                        <td>{}</td>
                      </tr>
                    )} */}
                                {(isKrokyUpdateContract ||
                                  (isFarz &&
                                    !landData.req_type &&
                                    [22].indexOf(this.props.currentModule.id) ==
                                      -1 &&
                                    [1949, 2048, 1971, 2068].indexOf(
                                      this.props.currentModule.record
                                        .workflow_id
                                    ) == -1)) &&
                                  landData?.lands?.parcelData?.parcel_type && (
                                    <tr>
                                      <td>{t("About")}</td>
                                      <td>
                                        {
                                          landData?.lands?.parcelData
                                            ?.parcel_type
                                        }
                                      </td>
                                    </tr>
                                  )}

                                {isKrokyUpdateContract &&
                                  !isTadkekMesahy &&
                                  (landData.krokySubject ||
                                    landData.submissionType) && (
                                    <tr>
                                      <td>{t("Subject")}</td>
                                      <td>
                                        {landData.krokySubject ||
                                          landData.submissionType}
                                      </td>
                                    </tr>
                                  )}
                                {(isPlan || isKrokyUpdateContract) &&
                                  landData.parcel_area && (
                                    <tr>
                                      <td>{"المساحة المستقطعة"}</td>
                                      <td>
                                        {localizeNumber(landData.parcel_area)}{" "}
                                      </td>
                                    </tr>
                                  )}
                                {landData?.lands?.parcels?.length && (
                                  <tr>
                                    <td colSpan="100%">
                                      {(isTadkekMesahy &&
                                      landData?.lands?.parcels?.[0]
                                        ?.parcelData &&
                                      !landData?.lands?.parcels?.[0]
                                        ?.fromTadkeekBefore ? (
                                        <>
                                          <div
                                            style={{
                                              fontWeight: "bold",
                                              textAlign: "center",
                                              marginBottom: "20px",
                                              marginTop: "10px",
                                            }}
                                          >
                                            بيانات حدود الأرض
                                          </div>
                                          {landData.lands.parcels.map(
                                            (parcel, k) => {
                                              return (
                                                <Collapse
                                                  className="Collapse"
                                                  defaultActiveKey={[]}
                                                  key={k}
                                                >
                                                  <Panel
                                                    header={convertToArabic(
                                                      `قطعة أرض رقم ${parcel?.attributes?.PARCEL_PLAN_NO}`
                                                    )}
                                                    forceRender={true}
                                                    style={{ margin: "5px" }}
                                                  >
                                                    <table className="table table-bordered">
                                                      <tr>
                                                        <td></td>
                                                        <td>بيانات الأرض</td>
                                                        <td>
                                                          بيانات الأرض من الرفع
                                                          المساحي
                                                        </td>
                                                        <td>
                                                          صورة وثيقة الملكية
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>رقم قطعة الأرض</td>
                                                        <td>
                                                          {localizeNumber(
                                                            parcel?.attributes
                                                              ?.PARCEL_PLAN_NO
                                                          )}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            ).parcel_name
                                                          )}
                                                        </td>
                                                        <td
                                                          valign="middle"
                                                          rowspan="10"
                                                          align="center"
                                                        >
                                                          {checkImage(
                                                            this.props,
                                                            table_waseka.find(
                                                              (x) =>
                                                                x.selectedLands
                                                                  ?.replaceAll(
                                                                    " ",
                                                                    ""
                                                                  )
                                                                  ?.split("/")
                                                                  ?.join(" / ")
                                                                  ?.split(",")
                                                                  ?.indexOf(
                                                                    parcel?.attributes?.PARCEL_PLAN_NO?.replaceAll(
                                                                      " ",
                                                                      ""
                                                                    )
                                                                      ?.split(
                                                                        "/"
                                                                      )
                                                                      ?.join(
                                                                        " / "
                                                                      )
                                                                  ) != -1
                                                            )?.image_waseka,
                                                            {}
                                                          )}
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          مساحة الأرض (م
                                                          {localizeNumber(2)})
                                                        </td>
                                                        <td>
                                                          {isTadkekMesahy
                                                            ? this.getParcelAreaEquation(
                                                                parcel
                                                              )
                                                            : localizeNumber(
                                                                parcel
                                                                  ?.attributes
                                                                  ?.PARCEL_AREA
                                                              )}
                                                          م{localizeNumber(2)}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            (+suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            ).area).toFixed(2)
                                                          )}
                                                          م{localizeNumber(2)}
                                                        </td>
                                                      </tr>

                                                      <tr>
                                                        <td>
                                                          {t(
                                                            "North Description"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            parcel?.parcelData
                                                              ?.north_desc
                                                          )}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            ).north_Desc
                                                          )}
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t("North Length")}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            parcel?.parcelData
                                                              ?.north_length
                                                          )}{" "}
                                                          م
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            (
                                                              +suggestionsParcels.find(
                                                                (x) =>
                                                                  x.parcel_name ==
                                                                    parcel
                                                                      ?.attributes
                                                                      ?.PARCEL_PLAN_NO &&
                                                                  +x.area.toFixed(
                                                                    2
                                                                  ) ==
                                                                    this.calculateAreaForTadekekParcel(
                                                                      parcel
                                                                    ).toFixed(2)
                                                              )?.data?.[0]
                                                                ?.totalLength ||
                                                              0
                                                            )?.toFixed(2)
                                                          )}{" "}
                                                          م
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t(
                                                            "East Description"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            parcel?.parcelData
                                                              ?.east_desc
                                                          )}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            ).east_Desc
                                                          )}
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t("East Length")}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            parcel?.parcelData
                                                              ?.east_length
                                                          )}{" "}
                                                          م
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            (
                                                              +suggestionsParcels.find(
                                                                (x) =>
                                                                  x.parcel_name ==
                                                                    parcel
                                                                      ?.attributes
                                                                      ?.PARCEL_PLAN_NO &&
                                                                  +x.area.toFixed(
                                                                    2
                                                                  ) ==
                                                                    this.calculateAreaForTadekekParcel(
                                                                      parcel
                                                                    ).toFixed(2)
                                                              )?.data?.[1]
                                                                ?.totalLength ||
                                                              0
                                                            )?.toFixed(2)
                                                          )}{" "}
                                                          م
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t(
                                                            "West Description"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            parcel?.parcelData
                                                              ?.west_desc
                                                          )}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            )?.west_Desc
                                                          )}
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t("West Length")}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            parcel?.parcelData
                                                              ?.west_length
                                                          )}{" "}
                                                          م
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            (
                                                              +suggestionsParcels.find(
                                                                (x) =>
                                                                  x.parcel_name ==
                                                                    parcel
                                                                      ?.attributes
                                                                      ?.PARCEL_PLAN_NO &&
                                                                  +x.area.toFixed(
                                                                    2
                                                                  ) ==
                                                                    this.calculateAreaForTadekekParcel(
                                                                      parcel
                                                                    ).toFixed(2)
                                                              )?.data?.[3]
                                                                ?.totalLength ||
                                                              0
                                                            )?.toFixed(2)
                                                          )}{" "}
                                                          م
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t(
                                                            "South Description"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            parcel?.parcelData
                                                              ?.south_desc
                                                          )}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            )?.south_Desc
                                                          )}
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t("South Length")}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            parcel?.parcelData
                                                              ?.south_length
                                                          )}{" "}
                                                          م
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            (
                                                              +suggestionsParcels.find(
                                                                (x) =>
                                                                  x.parcel_name ==
                                                                    parcel
                                                                      ?.attributes
                                                                      ?.PARCEL_PLAN_NO &&
                                                                  +x.area.toFixed(
                                                                    2
                                                                  ) ==
                                                                    this.calculateAreaForTadekekParcel(
                                                                      parcel
                                                                    ).toFixed(2)
                                                              )?.data?.[4]
                                                                ?.totalLength ||
                                                              0
                                                            )?.toFixed(2)
                                                          )}{" "}
                                                          م
                                                        </td>
                                                      </tr>
                                                    </table>

                                                    {parcel?.parcelElectric && (
                                                      <table className="table table-bordered">
                                                        {parcel?.parcelElectric
                                                          .electric_room_area && (
                                                          <tr>
                                                            <td
                                                              style={{
                                                                width: "50%",
                                                              }}
                                                            >
                                                              {" "}
                                                              مساحة غرفة
                                                              الكهرباء{" "}
                                                              {
                                                                parcel
                                                                  ?.parcelElectric
                                                                  ?.electric_room_place
                                                              }
                                                            </td>
                                                            <td>
                                                              {" "}
                                                              {convertToArabic(
                                                                parcel
                                                                  ?.parcelElectric
                                                                  ?.electric_room_area
                                                              )}{" "}
                                                              م٢{" "}
                                                            </td>
                                                          </tr>
                                                        )}
                                                      </table>
                                                    )}

                                                    {parcel?.parcelShatfa && (
                                                      <table className="table table-bordered">
                                                        {parcel?.parcelShatfa
                                                          ?.SHATFA_NORTH_EAST_DIRECTION && (
                                                          <tr>
                                                            <td
                                                              style={{
                                                                width: "50%",
                                                              }}
                                                            >
                                                              مساحة الشطفة (
                                                              شمال شرق )
                                                            </td>
                                                            <td>
                                                              {" "}
                                                              {convertToArabic(
                                                                parcel
                                                                  ?.parcelShatfa
                                                                  ?.SHATFA_NORTH_EAST_DIRECTION
                                                              )}{" "}
                                                              م٢{" "}
                                                            </td>
                                                          </tr>
                                                        )}

                                                        {parcel?.parcelShatfa
                                                          ?.SHATFA_NORTH_WEST_DIRECTION && (
                                                          <tr>
                                                            <td
                                                              style={{
                                                                width: "50%",
                                                              }}
                                                            >
                                                              مساحة الشطفة (
                                                              شمال غرب )
                                                            </td>
                                                            <td>
                                                              {" "}
                                                              {convertToArabic(
                                                                parcel
                                                                  ?.parcelShatfa
                                                                  ?.SHATFA_NORTH_WEST_DIRECTION
                                                              )}{" "}
                                                              م٢{" "}
                                                            </td>
                                                          </tr>
                                                        )}

                                                        {parcel?.parcelShatfa
                                                          ?.SHATFA_SOUTH_EAST_DIRECTION && (
                                                          <tr>
                                                            <td
                                                              style={{
                                                                width: "50%",
                                                              }}
                                                            >
                                                              مساحة الشطفة (
                                                              جنوب شرق )
                                                            </td>
                                                            <td>
                                                              {" "}
                                                              {convertToArabic(
                                                                parcel
                                                                  ?.parcelShatfa
                                                                  ?.SHATFA_SOUTH_EAST_DIRECTION
                                                              )}{" "}
                                                              م٢{" "}
                                                            </td>
                                                          </tr>
                                                        )}

                                                        {parcel?.parcelShatfa
                                                          ?.SHATFA_SOUTH_WEST_DIRECTION && (
                                                          <tr>
                                                            <td
                                                              style={{
                                                                width: "50%",
                                                              }}
                                                            >
                                                              مساحة الشطفة (
                                                              جنوب غرب )
                                                            </td>
                                                            <td>
                                                              {" "}
                                                              {convertToArabic(
                                                                parcel
                                                                  ?.parcelShatfa
                                                                  ?.SHATFA_SOUTH_WEST_DIRECTION
                                                              )}{" "}
                                                              م٢{" "}
                                                            </td>
                                                          </tr>
                                                        )}
                                                      </table>
                                                    )}
                                                  </Panel>
                                                </Collapse>
                                              );
                                            }
                                          )}
                                        </>
                                      ) : isTadkekMesahy ? (
                                        <>
                                          <div
                                            style={{
                                              fontWeight: "bold",
                                              textAlign: "center",
                                              marginBottom: "20px",
                                              marginTop: "10px",
                                            }}
                                          >
                                            بيانات حدود الأرض
                                          </div>
                                          {landData.lands.parcels.map(
                                            (parcel, k) => {
                                              return (
                                                <Collapse
                                                  className="Collapse"
                                                  defaultActiveKey={[]}
                                                  key={k}
                                                >
                                                  <Panel
                                                    header={convertToArabic(
                                                      `قطعة أرض رقم ${parcel?.attributes?.PARCEL_PLAN_NO}`
                                                    )}
                                                    forceRender={true}
                                                    style={{ margin: "5px" }}
                                                  >
                                                    <table className="table table-bordered">
                                                      <tr>
                                                        <td></td>
                                                        <td>
                                                          بيانات الأرض من الرفع
                                                          المساحي
                                                        </td>
                                                        <td>
                                                          صورة وثيقة الملكية
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>رقم قطعة الأرض</td>

                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            ).parcel_name
                                                          )}
                                                        </td>
                                                        <td
                                                          valign="middle"
                                                          rowspan="10"
                                                          align="center"
                                                        >
                                                          {checkImage(
                                                            this.props,
                                                            table_waseka.find(
                                                              (x) =>
                                                                x.selectedLands
                                                                  ?.replaceAll(
                                                                    " ",
                                                                    ""
                                                                  )
                                                                  ?.split("/")
                                                                  ?.join(" / ")
                                                                  ?.split(",")
                                                                  ?.indexOf(
                                                                    parcel?.attributes?.PARCEL_PLAN_NO?.replaceAll(
                                                                      " ",
                                                                      ""
                                                                    )
                                                                      ?.split(
                                                                        "/"
                                                                      )
                                                                      ?.join(
                                                                        " / "
                                                                      )
                                                                  ) != -1
                                                            )?.image_waseka,
                                                            {}
                                                          )}
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          مساحة الأرض (م
                                                          {localizeNumber(2)})
                                                        </td>

                                                        <td>
                                                          {localizeNumber(
                                                            (+suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            ).area).toFixed(2)
                                                          )}
                                                          م{localizeNumber(2)}
                                                        </td>
                                                      </tr>

                                                      <tr>
                                                        <td>
                                                          {t(
                                                            "North Description"
                                                          )}
                                                        </td>
                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            ).north_Desc
                                                          )}
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t("North Length")}
                                                        </td>

                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            ).data[0]
                                                              .totalLength
                                                          )}{" "}
                                                          م
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t(
                                                            "East Description"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            ).east_Desc
                                                          )}
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t("East Length")}
                                                        </td>

                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            ).data[1]
                                                              .totalLength
                                                          )}{" "}
                                                          م
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t(
                                                            "West Description"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            )?.west_Desc
                                                          )}
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t("West Length")}
                                                        </td>

                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            )?.data?.[3]
                                                              ?.totalLength
                                                          )}{" "}
                                                          م
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t(
                                                            "South Description"
                                                          )}
                                                        </td>

                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            )?.south_Desc
                                                          )}
                                                        </td>
                                                      </tr>
                                                      <tr>
                                                        <td>
                                                          {t("South Length")}
                                                        </td>

                                                        <td>
                                                          {localizeNumber(
                                                            suggestionsParcels.find(
                                                              (x) =>
                                                                x.parcel_name ==
                                                                  parcel
                                                                    ?.attributes
                                                                    ?.PARCEL_PLAN_NO &&
                                                                +x.area.toFixed(
                                                                  2
                                                                ) ==
                                                                  this.calculateAreaForTadekekParcel(
                                                                    parcel
                                                                  ).toFixed(2)
                                                            )?.data?.[4]
                                                              ?.totalLength
                                                          )}{" "}
                                                          م
                                                        </td>
                                                      </tr>
                                                    </table>

                                                    {parcel?.parcelElectric && (
                                                      <table className="table table-bordered">
                                                        {parcel?.parcelElectric
                                                          .electric_room_area && (
                                                          <tr>
                                                            <td
                                                              style={{
                                                                width: "50%",
                                                              }}
                                                            >
                                                              {" "}
                                                              مساحة غرفة
                                                              الكهرباء{" "}
                                                              {
                                                                parcel
                                                                  ?.parcelElectric
                                                                  ?.electric_room_place
                                                              }
                                                            </td>
                                                            <td>
                                                              {" "}
                                                              {convertToArabic(
                                                                parcel
                                                                  ?.parcelElectric
                                                                  ?.electric_room_area
                                                              )}{" "}
                                                              م٢{" "}
                                                            </td>
                                                          </tr>
                                                        )}
                                                      </table>
                                                    )}

                                                    {parcel?.parcelShatfa && (
                                                      <table className="table table-bordered">
                                                        {parcel?.parcelShatfa
                                                          ?.SHATFA_NORTH_EAST_DIRECTION && (
                                                          <tr>
                                                            <td
                                                              style={{
                                                                width: "50%",
                                                              }}
                                                            >
                                                              مساحة الشطفة (
                                                              شمال شرق )
                                                            </td>
                                                            <td>
                                                              {" "}
                                                              {convertToArabic(
                                                                parcel
                                                                  ?.parcelShatfa
                                                                  ?.SHATFA_NORTH_EAST_DIRECTION
                                                              )}{" "}
                                                              م٢{" "}
                                                            </td>
                                                          </tr>
                                                        )}

                                                        {parcel?.parcelShatfa
                                                          ?.SHATFA_NORTH_WEST_DIRECTION && (
                                                          <tr>
                                                            <td
                                                              style={{
                                                                width: "50%",
                                                              }}
                                                            >
                                                              مساحة الشطفة (
                                                              شمال غرب )
                                                            </td>
                                                            <td>
                                                              {" "}
                                                              {convertToArabic(
                                                                parcel
                                                                  ?.parcelShatfa
                                                                  ?.SHATFA_NORTH_WEST_DIRECTION
                                                              )}{" "}
                                                              م٢{" "}
                                                            </td>
                                                          </tr>
                                                        )}

                                                        {parcel?.parcelShatfa
                                                          ?.SHATFA_SOUTH_EAST_DIRECTION && (
                                                          <tr>
                                                            <td
                                                              style={{
                                                                width: "50%",
                                                              }}
                                                            >
                                                              مساحة الشطفة (
                                                              جنوب شرق )
                                                            </td>
                                                            <td>
                                                              {" "}
                                                              {convertToArabic(
                                                                parcel
                                                                  ?.parcelShatfa
                                                                  ?.SHATFA_SOUTH_EAST_DIRECTION
                                                              )}{" "}
                                                              م٢{" "}
                                                            </td>
                                                          </tr>
                                                        )}

                                                        {parcel?.parcelShatfa
                                                          ?.SHATFA_SOUTH_WEST_DIRECTION && (
                                                          <tr>
                                                            <td
                                                              style={{
                                                                width: "50%",
                                                              }}
                                                            >
                                                              مساحة الشطفة (
                                                              جنوب غرب )
                                                            </td>
                                                            <td>
                                                              {" "}
                                                              {convertToArabic(
                                                                parcel
                                                                  ?.parcelShatfa
                                                                  ?.SHATFA_SOUTH_WEST_DIRECTION
                                                              )}{" "}
                                                              م٢{" "}
                                                            </td>
                                                          </tr>
                                                        )}
                                                      </table>
                                                    )}
                                                  </Panel>
                                                </Collapse>
                                              );
                                            }
                                          )}
                                        </>
                                      ) : null) ||
                                        (imported_mainObject != undefined &&
                                          (isUpdateContract || isFarz) && (
                                            <>
                                              <div
                                                style={{
                                                  fontWeight: "bold",
                                                  textAlign: "center",
                                                  marginBottom: "20px",
                                                  marginTop: "10px",
                                                }}
                                              >
                                                بيانات حدود الأرض
                                              </div>
                                              {(isUpdateContract ||
                                                requestType == 1) &&
                                                suggestionsParcels
                                                  .sort(
                                                    (a, b) =>
                                                      a.parcel_name.indexOf(
                                                        "/"
                                                      ) == -1 &&
                                                      b.parcel_name.indexOf(
                                                        "/"
                                                      ) == -1 &&
                                                      (+a.parcel_name >
                                                      +b.parcel_name
                                                        ? 1
                                                        : -1)
                                                  )
                                                  .map((parcel, k) => {
                                                    let tadkek_parcel =
                                                      tadkek_suggestionsParcels?.find(
                                                        (x) =>
                                                          new esri.geometry.Polygon(
                                                            x.polygon
                                                          ).contains(
                                                            new esri.geometry.Polygon(
                                                              parcel?.polygon
                                                            ).getCentroid()
                                                          )
                                                      );

                                                    let landData_parcel =
                                                      (isUpdateContract &&
                                                        landData?.lands?.parcels?.find(
                                                          (y) =>
                                                            new esri.geometry.Polygon(
                                                              y.geometry
                                                            ).contains(
                                                              new esri.geometry.Polygon(
                                                                parcel?.polygon
                                                              ).getCentroid()
                                                            )
                                                        )) ||
                                                      undefined;

                                                    return (
                                                      <Collapse
                                                        className="Collapse"
                                                        defaultActiveKey={[]}
                                                        key={k}
                                                      >
                                                        <Panel
                                                          header={convertToArabic(
                                                            `قطعة أرض رقم ${parcel?.parcel_name}`
                                                          )}
                                                          forceRender={true}
                                                          style={{
                                                            margin: "5px",
                                                          }}
                                                        >
                                                          <table className="table table-bordered">
                                                            <tr>
                                                              <td></td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  بيانات الأرض
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>
                                                                  بيانات الأرض
                                                                  من الرفع
                                                                  المساحي
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>
                                                                  بيانات الأرض
                                                                  من الوضع
                                                                  المقترح
                                                                </td>
                                                              )}
                                                              {isUpdateContract && (
                                                                <td>
                                                                  بيانات الأرض
                                                                  من الرفع
                                                                  المساحي
                                                                </td>
                                                              )}
                                                              <td>
                                                                صورة وثيقة
                                                                الملكية
                                                              </td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                رقم قطعة الأرض
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {localizeNumber(
                                                                    landData_parcel
                                                                      ?.attributes
                                                                      ?.PARCEL_PLAN_NO
                                                                  )}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>
                                                                  {localizeNumber(
                                                                    tadkek_parcel?.parcel_name
                                                                  )}
                                                                </td>
                                                              )}
                                                              <td>
                                                                {localizeNumber(
                                                                  parcel?.parcel_name
                                                                )}
                                                              </td>
                                                              {table_waseka.find(
                                                                (x) =>
                                                                  x.selectedLands
                                                                    .split(",")
                                                                    .indexOf(
                                                                      (
                                                                        tadkek_parcel ||
                                                                        parcel
                                                                      )
                                                                        ?.parcel_name
                                                                    ) != -1
                                                              )
                                                                ?.image_waseka && (
                                                                <td
                                                                  valign="middle"
                                                                  rowspan="10"
                                                                  align="center"
                                                                >
                                                                  {checkImage(
                                                                    this.props,
                                                                    table_waseka.find(
                                                                      (x) =>
                                                                        x.selectedLands
                                                                          /*.split(
                                                                              ","
                                                                            )*/
                                                                          .indexOf(
                                                                            (
                                                                              tadkek_parcel ||
                                                                              parcel
                                                                            )
                                                                              ?.parcel_name
                                                                          ) !=
                                                                        -1
                                                                    )
                                                                      ?.image_waseka,
                                                                    {}
                                                                  )}
                                                                </td>
                                                              )}
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                مساحة الأرض (م
                                                                {localizeNumber(
                                                                  2
                                                                )}
                                                                )
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {
                                                                    this.getParcelAreaEquation(
                                                                      landData_parcel
                                                                    )
                                                                    //       localizeNumber(
                                                                    //   landData_parcel.attributes
                                                                    //     .PARCEL_AREA
                                                                    // )
                                                                  }
                                                                  م
                                                                  {localizeNumber(
                                                                    2
                                                                  )}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>
                                                                  {localizeNumber(
                                                                    (+tadkek_parcel?.area).toFixed(
                                                                      2
                                                                    )
                                                                  )}
                                                                  م
                                                                  {localizeNumber(
                                                                    2
                                                                  )}
                                                                </td>
                                                              )}
                                                              <td>
                                                                {localizeNumber(
                                                                  (+parcel?.area).toFixed(
                                                                    2
                                                                  )
                                                                )}
                                                                م
                                                                {localizeNumber(
                                                                  2
                                                                )}
                                                              </td>
                                                            </tr>
                                                            {/* {isUpdateContract && (
                                                  <tr>
                                                    <td>المساحة نصا</td>
                                                    <td colSpan={2}>
                                                      {localizeNumber(
                                                        (+parcel.area_text).toFixed(
                                                          2
                                                        )
                                                      )}
                                                    </td>
                                                  </tr>
                                                )} */}
                                                            <tr>
                                                              <td>
                                                                {t(
                                                                  "North Description"
                                                                )}
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {`طوله ${convertToArabic(
                                                                    (
                                                                      +landData_parcel
                                                                        ?.parcelData
                                                                        ?.north_length ||
                                                                      0
                                                                    ).toFixed(2)
                                                                  )} م ويحده ${
                                                                    convertToArabic(
                                                                      landData_parcel
                                                                        ?.parcelData
                                                                        ?.north_desc
                                                                    ) || ""
                                                                  }`}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>{`طوله ${convertToArabic(
                                                                  (
                                                                    (tadkek_parcel?.data &&
                                                                      +tadkek_parcel
                                                                        ?.data[0]
                                                                        ?.totalLength) ||
                                                                    0
                                                                  ).toFixed(2)
                                                                )} م ويحده ${
                                                                  convertToArabic(
                                                                    tadkek_parcel?.north_Desc
                                                                  ) || ""
                                                                } ${
                                                                  (isUpdateContract ||
                                                                    isFarz) &&
                                                                  tadkek_parcel?.plateformWidth_north
                                                                    ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                      convertToArabic(
                                                                        tadkek_parcel?.plateformWidth_north
                                                                      )
                                                                    : ""
                                                                }`}</td>
                                                              )}
                                                              <td>{`طوله ${convertToArabic(
                                                                (
                                                                  (parcel?.data &&
                                                                    +parcel
                                                                      ?.data[0]
                                                                      ?.totalLength) ||
                                                                  0
                                                                ).toFixed(2)
                                                              )} م ويحده ${
                                                                convertToArabic(
                                                                  parcel?.north_Desc
                                                                ) || ""
                                                              } ${
                                                                (isUpdateContract ||
                                                                  isFarz) &&
                                                                parcel?.plateformWidth_north
                                                                  ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                    convertToArabic(
                                                                      parcel?.plateformWidth_north
                                                                    )
                                                                  : ""
                                                              }`}</td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                {t(
                                                                  "East Description"
                                                                )}
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {`طوله ${convertToArabic(
                                                                    (
                                                                      +landData_parcel
                                                                        ?.parcelData
                                                                        ?.east_length ||
                                                                      0
                                                                    ).toFixed(2)
                                                                  )} م ويحده ${
                                                                    convertToArabic(
                                                                      landData_parcel
                                                                        ?.parcelData
                                                                        ?.east_desc
                                                                    ) || ""
                                                                  }`}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>{`طوله ${convertToArabic(
                                                                  (
                                                                    (tadkek_parcel?.data &&
                                                                      +tadkek_parcel
                                                                        ?.data[1]
                                                                        ?.totalLength) ||
                                                                    0
                                                                  ).toFixed(2)
                                                                )} م ويحده ${
                                                                  convertToArabic(
                                                                    tadkek_parcel?.east_Desc
                                                                  ) || ""
                                                                } ${
                                                                  (isUpdateContract ||
                                                                    isFarz) &&
                                                                  tadkek_parcel?.plateformWidth_east
                                                                    ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                      convertToArabic(
                                                                        tadkek_parcel?.plateformWidth_east
                                                                      )
                                                                    : ""
                                                                }`}</td>
                                                              )}
                                                              <td>{`طوله ${convertToArabic(
                                                                (
                                                                  (parcel?.data &&
                                                                    +parcel
                                                                      ?.data[1]
                                                                      ?.totalLength) ||
                                                                  0
                                                                ).toFixed(2)
                                                              )} م ويحده ${
                                                                convertToArabic(
                                                                  parcel?.east_Desc
                                                                ) || ""
                                                              } ${
                                                                (isUpdateContract ||
                                                                  isFarz) &&
                                                                parcel?.plateformWidth_east
                                                                  ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                    convertToArabic(
                                                                      parcel?.plateformWidth_east
                                                                    )
                                                                  : ""
                                                              }`}</td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                {t(
                                                                  "West Description"
                                                                )}
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {`طوله ${convertToArabic(
                                                                    (
                                                                      +landData_parcel
                                                                        ?.parcelData
                                                                        ?.west_length ||
                                                                      0
                                                                    ).toFixed(2)
                                                                  )} م ويحده ${
                                                                    convertToArabic(
                                                                      landData_parcel
                                                                        ?.parcelData
                                                                        ?.west_desc
                                                                    ) || ""
                                                                  }`}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>{`طوله ${convertToArabic(
                                                                  (
                                                                    (tadkek_parcel?.data &&
                                                                      +tadkek_parcel
                                                                        ?.data[3]
                                                                        ?.totalLength) ||
                                                                    0
                                                                  ).toFixed(2)
                                                                )} م ويحده ${
                                                                  convertToArabic(
                                                                    tadkek_parcel?.west_Desc
                                                                  ) || ""
                                                                } ${
                                                                  (isUpdateContract ||
                                                                    isFarz) &&
                                                                  tadkek_parcel?.plateformWidth_west
                                                                    ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                      convertToArabic(
                                                                        tadkek_parcel?.plateformWidth_west
                                                                      )
                                                                    : ""
                                                                }`}</td>
                                                              )}
                                                              <td>{`طوله ${convertToArabic(
                                                                (
                                                                  (parcel?.data &&
                                                                    +parcel
                                                                      ?.data[3]
                                                                      ?.totalLength) ||
                                                                  0
                                                                ).toFixed(2)
                                                              )} م ويحده ${
                                                                convertToArabic(
                                                                  parcel?.west_Desc
                                                                ) || ""
                                                              } ${
                                                                (isUpdateContract ||
                                                                  isFarz) &&
                                                                parcel?.plateformWidth_west
                                                                  ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                    convertToArabic(
                                                                      parcel?.plateformWidth_west
                                                                    )
                                                                  : ""
                                                              }`}</td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                {t(
                                                                  "South Description"
                                                                )}
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {`طوله ${convertToArabic(
                                                                    (
                                                                      +landData_parcel
                                                                        ?.parcelData
                                                                        ?.south_length ||
                                                                      0
                                                                    ).toFixed(2)
                                                                  )} م ويحده ${
                                                                    convertToArabic(
                                                                      landData_parcel
                                                                        ?.parcelData
                                                                        ?.south_desc
                                                                    ) || ""
                                                                  }`}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>{`طوله ${convertToArabic(
                                                                  (
                                                                    (tadkek_parcel?.data &&
                                                                      +tadkek_parcel
                                                                        ?.data[4]
                                                                        ?.totalLength) ||
                                                                    0
                                                                  ).toFixed(2)
                                                                )} م ويحده ${
                                                                  convertToArabic(
                                                                    tadkek_parcel?.south_Desc
                                                                  ) || ""
                                                                } ${
                                                                  (isUpdateContract ||
                                                                    isFarz) &&
                                                                  tadkek_parcel?.plateformWidth_south
                                                                    ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                      convertToArabic(
                                                                        tadkek_parcel?.plateformWidth_south
                                                                      )
                                                                    : ""
                                                                }`}</td>
                                                              )}
                                                              <td>{`طوله ${convertToArabic(
                                                                (
                                                                  (parcel?.data &&
                                                                    +parcel
                                                                      ?.data[4]
                                                                      ?.totalLength) ||
                                                                  0
                                                                ).toFixed(2)
                                                              )} م ويحده ${
                                                                convertToArabic(
                                                                  parcel?.south_Desc
                                                                ) || ""
                                                              } ${
                                                                (isUpdateContract ||
                                                                  isFarz) &&
                                                                parcel?.plateformWidth_south
                                                                  ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                    convertToArabic(
                                                                      parcel?.plateformWidth_south
                                                                    )
                                                                  : ""
                                                              }`}</td>
                                                            </tr>
                                                          </table>

                                                          {parcel?.electric_room_area && (
                                                            <table className="table table-bordered">
                                                              <tr>
                                                                <td
                                                                  style={{
                                                                    width:
                                                                      "50%",
                                                                  }}
                                                                >
                                                                  {" "}
                                                                  مساحة غرفة
                                                                  الكهرباء{" "}
                                                                  {
                                                                    parcel?.electric_room_place
                                                                  }
                                                                </td>
                                                                <td>
                                                                  {" "}
                                                                  {convertToArabic(
                                                                    parcel?.electric_room_area
                                                                  )}{" "}
                                                                  م٢{" "}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          )}

                                                          {tadkek_parcel?.electric_room_area &&
                                                            isFarz && (
                                                              <table className="table table-bordered">
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    غرفة
                                                                    الكهرباء
                                                                    (الرفع
                                                                    المساحي)
                                                                    للأرض رقم
                                                                  </td>
                                                                  <td>
                                                                    {convertToArabic(
                                                                      tadkek_parcel?.parcel_name
                                                                    )}
                                                                  </td>
                                                                </tr>
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    {" "}
                                                                    مساحة غرفة
                                                                    الكهرباء{" "}
                                                                    {
                                                                      tadkek_parcel?.electric_room_place
                                                                    }
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {convertToArabic(
                                                                      tadkek_parcel?.electric_room_area
                                                                    )}{" "}
                                                                    م٢{" "}
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            )}

                                                          {parcel?.survayParcelCutter && (
                                                            <table className="table table-bordered">
                                                              {parcel
                                                                ?.survayParcelCutter?.[0]
                                                                ?.NORTH_EAST_DIRECTION && (
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    مساحة الشطفة
                                                                    ( شمال شرق )
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {convertToArabic(
                                                                      parcel
                                                                        ?.survayParcelCutter?.[0]
                                                                        ?.NORTH_EAST_DIRECTION
                                                                    )}{" "}
                                                                    م٢{" "}
                                                                  </td>
                                                                </tr>
                                                              )}

                                                              {parcel
                                                                ?.survayParcelCutter?.[0]
                                                                ?.NORTH_WEST_DIRECTION && (
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    مساحة الشطفة
                                                                    ( شمال غرب )
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {convertToArabic(
                                                                      parcel
                                                                        ?.survayParcelCutter?.[0]
                                                                        ?.NORTH_WEST_DIRECTION
                                                                    )}{" "}
                                                                    م٢{" "}
                                                                  </td>
                                                                </tr>
                                                              )}

                                                              {parcel
                                                                ?.survayParcelCutter?.[0]
                                                                ?.SOUTH_EAST_DIRECTION && (
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    مساحة الشطفة
                                                                    ( جنوب شرق )
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {convertToArabic(
                                                                      parcel
                                                                        ?.survayParcelCutter?.[0]
                                                                        ?.SOUTH_EAST_DIRECTION
                                                                    )}{" "}
                                                                    م٢{" "}
                                                                  </td>
                                                                </tr>
                                                              )}

                                                              {parcel
                                                                ?.survayParcelCutter?.[0]
                                                                ?.SOUTH_WEST_DIRECTION && (
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    مساحة الشطفة
                                                                    ( جنوب غرب )
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {convertToArabic(
                                                                      parcel
                                                                        ?.survayParcelCutter?.[0]
                                                                        ?.SOUTH_WEST_DIRECTION
                                                                    )}{" "}
                                                                    م٢{" "}
                                                                  </td>
                                                                </tr>
                                                              )}
                                                            </table>
                                                          )}

                                                          {tadkek_parcel?.survayParcelCutter &&
                                                            Object.values(
                                                              tadkek_parcel
                                                                ?.survayParcelCutter?.[0]
                                                            ).find(
                                                              (r) =>
                                                                r != "الشطفة" &&
                                                                !_.isEmpty(r)
                                                            ) != undefined &&
                                                            isFarz && (
                                                              <table className="table table-bordered">
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    شطفات (الرفع
                                                                    المساحي)
                                                                    للأرض رقم
                                                                  </td>
                                                                  <td>
                                                                    {convertToArabic(
                                                                      tadkek_parcel?.parcel_name
                                                                    )}
                                                                  </td>
                                                                </tr>
                                                                {tadkek_parcel
                                                                  .survayParcelCutter[0]
                                                                  .NORTH_EAST_DIRECTION && (
                                                                  <tr>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "50%",
                                                                      }}
                                                                    >
                                                                      مساحة
                                                                      الشطفة (
                                                                      شمال شرق )
                                                                    </td>
                                                                    <td>
                                                                      {" "}
                                                                      {convertToArabic(
                                                                        tadkek_parcel
                                                                          ?.survayParcelCutter?.[0]
                                                                          ?.NORTH_EAST_DIRECTION
                                                                      )}{" "}
                                                                      م٢{" "}
                                                                    </td>
                                                                  </tr>
                                                                )}

                                                                {tadkek_parcel
                                                                  ?.survayParcelCutter?.[0]
                                                                  ?.NORTH_WEST_DIRECTION && (
                                                                  <tr>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "50%",
                                                                      }}
                                                                    >
                                                                      مساحة
                                                                      الشطفة (
                                                                      شمال غرب )
                                                                    </td>
                                                                    <td>
                                                                      {" "}
                                                                      {convertToArabic(
                                                                        tadkek_parcel
                                                                          ?.survayParcelCutter?.[0]
                                                                          ?.NORTH_WEST_DIRECTION
                                                                      )}{" "}
                                                                      م٢{" "}
                                                                    </td>
                                                                  </tr>
                                                                )}

                                                                {tadkek_parcel
                                                                  ?.survayParcelCutter?.[0]
                                                                  ?.SOUTH_EAST_DIRECTION && (
                                                                  <tr>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "50%",
                                                                      }}
                                                                    >
                                                                      مساحة
                                                                      الشطفة (
                                                                      جنوب شرق )
                                                                    </td>
                                                                    <td>
                                                                      {" "}
                                                                      {convertToArabic(
                                                                        tadkek_parcel
                                                                          ?.survayParcelCutter?.[0]
                                                                          ?.SOUTH_EAST_DIRECTION
                                                                      )}{" "}
                                                                      م٢{" "}
                                                                    </td>
                                                                  </tr>
                                                                )}

                                                                {tadkek_parcel
                                                                  ?.survayParcelCutter?.[0]
                                                                  ?.SOUTH_WEST_DIRECTION && (
                                                                  <tr>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "50%",
                                                                      }}
                                                                    >
                                                                      مساحة
                                                                      الشطفة (
                                                                      جنوب غرب )
                                                                    </td>
                                                                    <td>
                                                                      {" "}
                                                                      {convertToArabic(
                                                                        tadkek_parcel
                                                                          ?.survayParcelCutter?.[0]
                                                                          ?.SOUTH_WEST_DIRECTION
                                                                      )}{" "}
                                                                      م٢{" "}
                                                                    </td>
                                                                  </tr>
                                                                )}
                                                              </table>
                                                            )}
                                                        </Panel>
                                                      </Collapse>
                                                    );
                                                  })}
                                              {requestType == 2 &&
                                                tadkek_suggestionsParcels
                                                  .sort(
                                                    (a, b) =>
                                                      a.parcel_name.indexOf(
                                                        "/"
                                                      ) == -1 &&
                                                      b.parcel_name.indexOf(
                                                        "/"
                                                      ) == -1 &&
                                                      (+a.parcel_name >
                                                      +b.parcel_name
                                                        ? 1
                                                        : -1)
                                                  )
                                                  .map((tadkek_parcel, k) => {
                                                    let parcel =
                                                      suggestionsParcels?.find(
                                                        (x) =>
                                                          new esri.geometry.Polygon(
                                                            x.polygon
                                                          ).contains(
                                                            new esri.geometry.Polygon(
                                                              tadkek_parcel?.polygon
                                                            ).getCentroid()
                                                          )
                                                      );

                                                    let landData_parcel =
                                                      (isUpdateContract &&
                                                        landData?.lands?.parcels?.find(
                                                          (y) =>
                                                            new esri.geometry.Polygon(
                                                              y.geometry
                                                            ).contains(
                                                              new esri.geometry.Polygon(
                                                                tadkek_parcel?.polygon
                                                              ).getCentroid()
                                                            )
                                                        )) ||
                                                      undefined;

                                                    return (
                                                      <Collapse
                                                        className="Collapse"
                                                        defaultActiveKey={[]}
                                                        key={k}
                                                      >
                                                        <Panel
                                                          header={convertToArabic(
                                                            `قطعة أرض رقم ${tadkek_parcel?.parcel_name}`
                                                          )}
                                                          forceRender={true}
                                                          style={{
                                                            margin: "5px",
                                                          }}
                                                        >
                                                          <table className="table table-bordered">
                                                            <tr>
                                                              <td></td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  بيانات الأرض
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>
                                                                  بيانات الأرض
                                                                  من الرفع
                                                                  المساحي
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>
                                                                  بيانات الأرض
                                                                  من الوضع
                                                                  المقترح
                                                                </td>
                                                              )}
                                                              {isUpdateContract && (
                                                                <td>
                                                                  بيانات الأرض
                                                                  من الرفع
                                                                  المساحي
                                                                </td>
                                                              )}
                                                              <td>
                                                                صورة وثيقة
                                                                الملكية
                                                              </td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                رقم قطعة الأرض
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {localizeNumber(
                                                                    landData_parcel
                                                                      ?.attributes
                                                                      ?.PARCEL_PLAN_NO
                                                                  )}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>
                                                                  {localizeNumber(
                                                                    tadkek_parcel?.parcel_name
                                                                  )}
                                                                </td>
                                                              )}
                                                              <td>
                                                                {localizeNumber(
                                                                  parcel?.parcel_name
                                                                )}
                                                              </td>
                                                              {table_waseka.find(
                                                                (x) =>
                                                                  x.selectedLands
                                                                    .split(",")
                                                                    .indexOf(
                                                                      (
                                                                        tadkek_parcel ||
                                                                        parcel
                                                                      )?.parcel_name?.split(
                                                                        "/"
                                                                      )?.[0]
                                                                    ) != -1
                                                              )
                                                                ?.image_waseka && (
                                                                <td
                                                                  valign="middle"
                                                                  rowspan="10"
                                                                  align="center"
                                                                >
                                                                  {checkImage(
                                                                    this.props,
                                                                    table_waseka.find(
                                                                      (x) =>
                                                                        x.selectedLands
                                                                          /*.split(
                                                                              ","
                                                                            )*/
                                                                          .indexOf(
                                                                            (
                                                                              tadkek_parcel ||
                                                                              parcel
                                                                            )?.parcel_name?.split(
                                                                              "/"
                                                                            )?.[0]
                                                                          ) !=
                                                                        -1
                                                                    )
                                                                      ?.image_waseka,
                                                                    {}
                                                                  )}
                                                                </td>
                                                              )}
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                مساحة الأرض (م
                                                                {localizeNumber(
                                                                  2
                                                                )}
                                                                )
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {
                                                                    this.getParcelAreaEquation(
                                                                      landData_parcel
                                                                    )
                                                                    //       localizeNumber(
                                                                    //   landData_parcel.attributes
                                                                    //     .PARCEL_AREA
                                                                    // )
                                                                  }
                                                                  م
                                                                  {localizeNumber(
                                                                    2
                                                                  )}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>
                                                                  {localizeNumber(
                                                                    (+tadkek_parcel?.area).toFixed(
                                                                      2
                                                                    )
                                                                  )}
                                                                  م
                                                                  {localizeNumber(
                                                                    2
                                                                  )}
                                                                </td>
                                                              )}
                                                              <td>
                                                                {localizeNumber(
                                                                  (+parcel?.area).toFixed(
                                                                    2
                                                                  )
                                                                )}
                                                                م
                                                                {localizeNumber(
                                                                  2
                                                                )}
                                                              </td>
                                                            </tr>
                                                            {/* {isUpdateContract && (
                                                  <tr>
                                                    <td>المساحة نصا</td>
                                                    <td colSpan={2}>
                                                      {localizeNumber(
                                                        (+parcel.area_text).toFixed(
                                                          2
                                                        )
                                                      )}
                                                    </td>
                                                  </tr>
                                                )} */}
                                                            <tr>
                                                              <td>
                                                                {t(
                                                                  "North Description"
                                                                )}
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {`طوله ${convertToArabic(
                                                                    (
                                                                      +landData_parcel
                                                                        ?.parcelData
                                                                        ?.north_length ||
                                                                      0
                                                                    ).toFixed(2)
                                                                  )} م ويحده ${
                                                                    convertToArabic(
                                                                      landData_parcel
                                                                        ?.parcelData
                                                                        ?.north_desc
                                                                    ) || ""
                                                                  }`}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>{`طوله ${convertToArabic(
                                                                  (
                                                                    (tadkek_parcel?.data &&
                                                                      +tadkek_parcel
                                                                        ?.data[0]
                                                                        ?.totalLength) ||
                                                                    0
                                                                  ).toFixed(2)
                                                                )} م ويحده ${
                                                                  convertToArabic(
                                                                    tadkek_parcel?.north_Desc
                                                                  ) || ""
                                                                } ${
                                                                  (isUpdateContract ||
                                                                    isFarz) &&
                                                                  tadkek_parcel?.plateformWidth_north
                                                                    ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                      convertToArabic(
                                                                        tadkek_parcel?.plateformWidth_north
                                                                      )
                                                                    : ""
                                                                }`}</td>
                                                              )}
                                                              <td>{`طوله ${convertToArabic(
                                                                (
                                                                  (parcel?.data &&
                                                                    +parcel
                                                                      ?.data[0]
                                                                      ?.totalLength) ||
                                                                  0
                                                                ).toFixed(2)
                                                              )} م ويحده ${
                                                                convertToArabic(
                                                                  parcel?.north_Desc
                                                                ) || ""
                                                              } ${
                                                                (isUpdateContract ||
                                                                  isFarz) &&
                                                                parcel?.plateformWidth_north
                                                                  ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                    convertToArabic(
                                                                      parcel?.plateformWidth_north
                                                                    )
                                                                  : ""
                                                              }`}</td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                {t(
                                                                  "East Description"
                                                                )}
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {`طوله ${convertToArabic(
                                                                    (
                                                                      +landData_parcel
                                                                        ?.parcelData
                                                                        ?.east_length ||
                                                                      0
                                                                    ).toFixed(2)
                                                                  )} م ويحده ${
                                                                    convertToArabic(
                                                                      landData_parcel
                                                                        ?.parcelData
                                                                        ?.east_desc
                                                                    ) || ""
                                                                  }`}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>{`طوله ${convertToArabic(
                                                                  (
                                                                    (tadkek_parcel?.data &&
                                                                      +tadkek_parcel
                                                                        ?.data[1]
                                                                        ?.totalLength) ||
                                                                    0
                                                                  ).toFixed(2)
                                                                )} م ويحده ${
                                                                  convertToArabic(
                                                                    tadkek_parcel?.east_Desc
                                                                  ) || ""
                                                                } ${
                                                                  (isUpdateContract ||
                                                                    isFarz) &&
                                                                  tadkek_parcel?.plateformWidth_east
                                                                    ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                      convertToArabic(
                                                                        tadkek_parcel?.plateformWidth_east
                                                                      )
                                                                    : ""
                                                                }`}</td>
                                                              )}
                                                              <td>{`طوله ${convertToArabic(
                                                                (
                                                                  (parcel?.data &&
                                                                    +parcel
                                                                      ?.data[1]
                                                                      ?.totalLength) ||
                                                                  0
                                                                ).toFixed(2)
                                                              )} م ويحده ${
                                                                convertToArabic(
                                                                  parcel?.east_Desc
                                                                ) || ""
                                                              } ${
                                                                (isUpdateContract ||
                                                                  isFarz) &&
                                                                parcel?.plateformWidth_east
                                                                  ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                    convertToArabic(
                                                                      parcel?.plateformWidth_east
                                                                    )
                                                                  : ""
                                                              }`}</td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                {t(
                                                                  "West Description"
                                                                )}
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {`طوله ${convertToArabic(
                                                                    (
                                                                      +landData_parcel
                                                                        ?.parcelData
                                                                        ?.west_length ||
                                                                      0
                                                                    ).toFixed(2)
                                                                  )} م ويحده ${
                                                                    convertToArabic(
                                                                      landData_parcel
                                                                        ?.parcelData
                                                                        ?.west_desc
                                                                    ) || ""
                                                                  }`}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>{`طوله ${convertToArabic(
                                                                  (
                                                                    (tadkek_parcel?.data &&
                                                                      +tadkek_parcel
                                                                        ?.data[3]
                                                                        ?.totalLength) ||
                                                                    0
                                                                  ).toFixed(2)
                                                                )} م ويحده ${
                                                                  convertToArabic(
                                                                    tadkek_parcel?.west_Desc
                                                                  ) || ""
                                                                } ${
                                                                  (isUpdateContract ||
                                                                    isFarz) &&
                                                                  tadkek_parcel?.plateformWidth_west
                                                                    ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                      convertToArabic(
                                                                        tadkek_parcel?.plateformWidth_west
                                                                      )
                                                                    : ""
                                                                }`}</td>
                                                              )}
                                                              <td>{`طوله ${convertToArabic(
                                                                (
                                                                  (parcel?.data &&
                                                                    +parcel
                                                                      ?.data[3]
                                                                      ?.totalLength) ||
                                                                  0
                                                                ).toFixed(2)
                                                              )} م ويحده ${
                                                                convertToArabic(
                                                                  parcel?.west_Desc
                                                                ) || ""
                                                              } ${
                                                                (isUpdateContract ||
                                                                  isFarz) &&
                                                                parcel?.plateformWidth_west
                                                                  ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                    convertToArabic(
                                                                      parcel?.plateformWidth_west
                                                                    )
                                                                  : ""
                                                              }`}</td>
                                                            </tr>
                                                            <tr>
                                                              <td>
                                                                {t(
                                                                  "South Description"
                                                                )}
                                                              </td>
                                                              {landData_parcel && (
                                                                <td>
                                                                  {`طوله ${convertToArabic(
                                                                    (
                                                                      +landData_parcel
                                                                        ?.parcelData
                                                                        ?.south_length ||
                                                                      0
                                                                    ).toFixed(2)
                                                                  )} م ويحده ${
                                                                    convertToArabic(
                                                                      landData_parcel
                                                                        ?.parcelData
                                                                        ?.south_desc
                                                                    ) || ""
                                                                  }`}
                                                                </td>
                                                              )}
                                                              {isFarz && (
                                                                <td>{`طوله ${convertToArabic(
                                                                  (
                                                                    (tadkek_parcel?.data &&
                                                                      +tadkek_parcel
                                                                        ?.data[4]
                                                                        ?.totalLength) ||
                                                                    0
                                                                  ).toFixed(2)
                                                                )} م ويحده ${
                                                                  convertToArabic(
                                                                    tadkek_parcel?.south_Desc
                                                                  ) || ""
                                                                } ${
                                                                  (isUpdateContract ||
                                                                    isFarz) &&
                                                                  tadkek_parcel?.plateformWidth_south
                                                                    ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                      convertToArabic(
                                                                        tadkek_parcel?.plateformWidth_south
                                                                      )
                                                                    : ""
                                                                }`}</td>
                                                              )}
                                                              <td>{`طوله ${convertToArabic(
                                                                (
                                                                  (parcel?.data &&
                                                                    +parcel
                                                                      ?.data[4]
                                                                      ?.totalLength) ||
                                                                  0
                                                                ).toFixed(2)
                                                              )} م ويحده ${
                                                                convertToArabic(
                                                                  parcel?.south_Desc
                                                                ) || ""
                                                              } ${
                                                                (isUpdateContract ||
                                                                  isFarz) &&
                                                                parcel?.plateformWidth_south
                                                                  ? "وعرض الرصيف من هذا الاتجاه هو " +
                                                                    convertToArabic(
                                                                      parcel?.plateformWidth_south
                                                                    )
                                                                  : ""
                                                              }`}</td>
                                                            </tr>
                                                          </table>

                                                          {parcel?.electric_room_area && (
                                                            <table className="table table-bordered">
                                                              <tr>
                                                                <td
                                                                  style={{
                                                                    width:
                                                                      "50%",
                                                                  }}
                                                                >
                                                                  {" "}
                                                                  مساحة غرفة
                                                                  الكهرباء{" "}
                                                                  {
                                                                    parcel?.electric_room_place
                                                                  }
                                                                </td>
                                                                <td>
                                                                  {" "}
                                                                  {convertToArabic(
                                                                    parcel?.electric_room_area
                                                                  )}{" "}
                                                                  م٢{" "}
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          )}

                                                          {tadkek_parcel?.electric_room_area &&
                                                            isFarz && (
                                                              <table className="table table-bordered">
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    غرفة
                                                                    الكهرباء
                                                                    (الرفع
                                                                    المساحي)
                                                                    للأرض رقم
                                                                  </td>
                                                                  <td>
                                                                    {convertToArabic(
                                                                      tadkek_parcel?.parcel_name
                                                                    )}
                                                                  </td>
                                                                </tr>
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    {" "}
                                                                    مساحة غرفة
                                                                    الكهرباء{" "}
                                                                    {
                                                                      tadkek_parcel?.electric_room_place
                                                                    }
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {convertToArabic(
                                                                      tadkek_parcel?.electric_room_area
                                                                    )}{" "}
                                                                    م٢{" "}
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            )}

                                                          {parcel?.survayParcelCutter && (
                                                            <table className="table table-bordered">
                                                              {parcel
                                                                ?.survayParcelCutter?.[0]
                                                                ?.NORTH_EAST_DIRECTION && (
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    مساحة الشطفة
                                                                    ( شمال شرق )
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {convertToArabic(
                                                                      parcel
                                                                        ?.survayParcelCutter?.[0]
                                                                        ?.NORTH_EAST_DIRECTION
                                                                    )}{" "}
                                                                    م٢{" "}
                                                                  </td>
                                                                </tr>
                                                              )}

                                                              {parcel
                                                                ?.survayParcelCutter?.[0]
                                                                ?.NORTH_WEST_DIRECTION && (
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    مساحة الشطفة
                                                                    ( شمال غرب )
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {convertToArabic(
                                                                      parcel
                                                                        ?.survayParcelCutter?.[0]
                                                                        ?.NORTH_WEST_DIRECTION
                                                                    )}{" "}
                                                                    م٢{" "}
                                                                  </td>
                                                                </tr>
                                                              )}

                                                              {parcel
                                                                ?.survayParcelCutter?.[0]
                                                                ?.SOUTH_EAST_DIRECTION && (
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    مساحة الشطفة
                                                                    ( جنوب شرق )
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {convertToArabic(
                                                                      parcel
                                                                        ?.survayParcelCutter?.[0]
                                                                        ?.SOUTH_EAST_DIRECTION
                                                                    )}{" "}
                                                                    م٢{" "}
                                                                  </td>
                                                                </tr>
                                                              )}

                                                              {parcel
                                                                ?.survayParcelCutter?.[0]
                                                                ?.SOUTH_WEST_DIRECTION && (
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    مساحة الشطفة
                                                                    ( جنوب غرب )
                                                                  </td>
                                                                  <td>
                                                                    {" "}
                                                                    {convertToArabic(
                                                                      parcel
                                                                        ?.survayParcelCutter?.[0]
                                                                        ?.SOUTH_WEST_DIRECTION
                                                                    )}{" "}
                                                                    م٢{" "}
                                                                  </td>
                                                                </tr>
                                                              )}
                                                            </table>
                                                          )}

                                                          {tadkek_parcel?.survayParcelCutter &&
                                                            Object.values(
                                                              tadkek_parcel
                                                                ?.survayParcelCutter?.[0]
                                                            ).find(
                                                              (r) =>
                                                                r != "الشطفة" &&
                                                                !_.isEmpty(r)
                                                            ) != undefined &&
                                                            isFarz && (
                                                              <table className="table table-bordered">
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      width:
                                                                        "50%",
                                                                    }}
                                                                  >
                                                                    شطفات (الرفع
                                                                    المساحي)
                                                                    للأرض رقم
                                                                  </td>
                                                                  <td>
                                                                    {convertToArabic(
                                                                      tadkek_parcel?.parcel_name
                                                                    )}
                                                                  </td>
                                                                </tr>
                                                                {tadkek_parcel
                                                                  .survayParcelCutter[0]
                                                                  .NORTH_EAST_DIRECTION && (
                                                                  <tr>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "50%",
                                                                      }}
                                                                    >
                                                                      مساحة
                                                                      الشطفة (
                                                                      شمال شرق )
                                                                    </td>
                                                                    <td>
                                                                      {" "}
                                                                      {convertToArabic(
                                                                        tadkek_parcel
                                                                          ?.survayParcelCutter?.[0]
                                                                          ?.NORTH_EAST_DIRECTION
                                                                      )}{" "}
                                                                      م٢{" "}
                                                                    </td>
                                                                  </tr>
                                                                )}

                                                                {tadkek_parcel
                                                                  ?.survayParcelCutter?.[0]
                                                                  ?.NORTH_WEST_DIRECTION && (
                                                                  <tr>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "50%",
                                                                      }}
                                                                    >
                                                                      مساحة
                                                                      الشطفة (
                                                                      شمال غرب )
                                                                    </td>
                                                                    <td>
                                                                      {" "}
                                                                      {convertToArabic(
                                                                        tadkek_parcel
                                                                          ?.survayParcelCutter?.[0]
                                                                          ?.NORTH_WEST_DIRECTION
                                                                      )}{" "}
                                                                      م٢{" "}
                                                                    </td>
                                                                  </tr>
                                                                )}

                                                                {tadkek_parcel
                                                                  ?.survayParcelCutter?.[0]
                                                                  ?.SOUTH_EAST_DIRECTION && (
                                                                  <tr>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "50%",
                                                                      }}
                                                                    >
                                                                      مساحة
                                                                      الشطفة (
                                                                      جنوب شرق )
                                                                    </td>
                                                                    <td>
                                                                      {" "}
                                                                      {convertToArabic(
                                                                        tadkek_parcel
                                                                          ?.survayParcelCutter?.[0]
                                                                          ?.SOUTH_EAST_DIRECTION
                                                                      )}{" "}
                                                                      م٢{" "}
                                                                    </td>
                                                                  </tr>
                                                                )}

                                                                {tadkek_parcel
                                                                  ?.survayParcelCutter?.[0]
                                                                  ?.SOUTH_WEST_DIRECTION && (
                                                                  <tr>
                                                                    <td
                                                                      style={{
                                                                        width:
                                                                          "50%",
                                                                      }}
                                                                    >
                                                                      مساحة
                                                                      الشطفة (
                                                                      جنوب غرب )
                                                                    </td>
                                                                    <td>
                                                                      {" "}
                                                                      {convertToArabic(
                                                                        tadkek_parcel
                                                                          ?.survayParcelCutter?.[0]
                                                                          ?.SOUTH_WEST_DIRECTION
                                                                      )}{" "}
                                                                      م٢{" "}
                                                                    </td>
                                                                  </tr>
                                                                )}
                                                              </table>
                                                            )}
                                                        </Panel>
                                                      </Collapse>
                                                    );
                                                  })}
                                            </>
                                          )) || <></>}
                                    </td>
                                  </tr>
                                )}

                                {/*landData?.lands?.survayParcelCutter && (
                            <tr>
                              <td colSpan="100%">
                                {this.getShatfaAndElectricHeader(landData) !=
                                  "" && (
                                    <Collapse
                                      className="Collapse"
                                      defaultActiveKey={[]}
                                      key={"shafta"}
                                    >
                                      <Panel
                                        header={this.getShatfaAndElectricHeader(
                                          landData
                                        )}
                                        forceRender={true}
                                        style={{ margin: "5px" }}
                                      >
                                        <table
                                          className="table table-bordered"
                                          style={{ marginTop: "10px" }}
                                        >
                                          <tbody>
                                            {landData.lands
                                              .electric_room_area && (
                                                <tr>
                                                  <td> مساحة غرفة الكهرباء : </td>
                                                  <td>
                                                    {" "}
                                                    {convertToArabic(
                                                      landData.lands
                                                        .electric_room_area
                                                    )}{" "}
                                                    م٢{" "}
                                                  </td>
                                                </tr>
                                              )}

                                            {landData.lands
                                              .electric_room_place && (
                                                <tr>
                                                  <td>موقع غرفة الكهرباء : </td>
                                                  <td>
                                                    {convertToArabic(
                                                      landData.lands
                                                        .electric_room_place
                                                    )}
                                                  </td>
                                                </tr>
                                              )}

                                            {landData.lands &&
                                              landData.lands.survayParcelCutter &&
                                              landData.lands
                                                .survayParcelCutter[0] &&
                                              landData.lands.survayParcelCutter[0]
                                                .SHATFA_NORTH_EAST_DIRECTION && (
                                                <tr>
                                                  <td>
                                                    مساحة الشطفة ( شمال شرق )
                                                  </td>
                                                  <td>
                                                    {convertToArabic(
                                                      landData.lands
                                                        .survayParcelCutter[0]
                                                        .SHATFA_NORTH_EAST_DIRECTION
                                                    )}
                                                    {" م٢ "}
                                                  </td>
                                                </tr>
                                              )}

                                            {landData.lands &&
                                              landData.lands.survayParcelCutter &&
                                              landData.lands
                                                .survayParcelCutter[0] &&
                                              landData.lands.survayParcelCutter[0]
                                                .SHATFA_NORTH_WEST_DIRECTION && (
                                                <tr>
                                                  <td>
                                                    مساحة الشطفة ( شمال غرب )
                                                  </td>
                                                  <td>
                                                    {convertToArabic(
                                                      landData.lands
                                                        .survayParcelCutter[0]
                                                        .SHATFA_NORTH_WEST_DIRECTION
                                                    )}
                                                    {" م٢ "}
                                                  </td>
                                                </tr>
                                              )}

                                            {landData.lands &&
                                              landData.lands.survayParcelCutter &&
                                              landData.lands
                                                .survayParcelCutter[0] &&
                                              landData.lands.survayParcelCutter[0]
                                                .SHATFA_SOUTH_EAST_DIRECTION && (
                                                <tr>
                                                  <td>
                                                    مساحة الشطفة ( جنوب شرق )
                                                  </td>
                                                  <td>
                                                    {convertToArabic(
                                                      landData.lands
                                                        .survayParcelCutter[0]
                                                        .SHATFA_SOUTH_EAST_DIRECTION
                                                    )}
                                                    {" م٢ "}
                                                  </td>
                                                </tr>
                                              )}
                                            {landData.lands &&
                                              landData.lands.survayParcelCutter &&
                                              landData.lands
                                                .survayParcelCutter[0] &&
                                              landData.lands.survayParcelCutter[0]
                                                .SHATFA_SOUTH_WEST_DIRECTION && (
                                                <tr>
                                                  <td>
                                                    مساحة الشطفة ( جنوب غرب ){" "}
                                                  </td>
                                                  <td>
                                                    {convertToArabic(
                                                      landData.lands
                                                        .survayParcelCutter[0]
                                                        .SHATFA_SOUTH_WEST_DIRECTION
                                                    )}
                                                    {" م٢ "}
                                                  </td>
                                                </tr>
                                              )}
                                          </tbody>
                                        </table>
                                      </Panel>
                                    </Collapse>
                                  )}
                              </td>
                            </tr>
                          )*/}

                                {cad_image_uploader1 && (
                                  <tr>
                                    <td>تحميل ملف الكاد (الرفع المساحي)</td>
                                    <td>
                                      {checkImage(
                                        this.props,
                                        cad_image_uploader1
                                      )}
                                    </td>
                                  </tr>
                                )}
                                {cad_image_uploader2 && (
                                  <tr>
                                    {(this.state.app_id == 29 && (
                                      <td>تحميل ملف الكاد (الرفع المساحي)</td>
                                    )) || (
                                      <td>تحميل ملف الكاد (الوضع المقترح)</td>
                                    )}
                                    <td>
                                      {checkImage(
                                        this.props,
                                        cad_image_uploader2
                                      )}
                                    </td>
                                  </tr>
                                )}
                                {(isKrokyUpdateContract || isTadkekMesahy) &&
                                  !isPropertyRemovable &&
                                  landData.image_uploader && (
                                    <tr>
                                      {" "}
                                      <td colSpan="100%">
                                        <table className="table">
                                          <tr>
                                            <td valign="middle" align="center">
                                              {t("ParcelImage")}
                                            </td>
                                          </tr>
                                          <tr>
                                            <td valign="middle" align="center">
                                              {checkImage(
                                                this.props,
                                                landData.image_uploader,
                                                {}
                                              )}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  )}
                              </>
                            </tbody>
                          </table>
                        </Panel>
                      </Collapse>
                    )}
                  </td>

                  {!isKrokyUpdateContract &&
                    !isUpdateContract &&
                    !isTadkekMesahy &&
                    !isFarz &&
                    !isPropertyRemovable &&
                    [22].indexOf(this.props.currentModule.id) == -1 &&
                    (landData.image_uploader ||
                      duplix_building_details.land_real_image) && (
                      <td>
                        <table className="table">
                          <tr>
                            <td valign="middle" align="center">
                              {isFarz ? t("Top Image farz") : t("Top Image")}
                            </td>
                          </tr>
                          <tr>
                            <td valign="middle" align="center">
                              {checkImage(this.props, landImage, {
                                width: "500px",
                                height: "400px",
                              })}
                            </td>
                          </tr>
                        </table>
                      </td>
                    )}
                </tr>
                {!isFarz &&
                  !isUpdateContract &&
                  [22].indexOf(this.props.currentModule.id) == -1 &&
                  (landData?.screenshotURL ||
                    landData?.lands?.screenshotURL) && (
                    <tr>
                      {" "}
                      <td colSpan="100%">
                        <table className="table">
                          <tr>
                            <td valign="middle" align="center">
                              {t("ParcelImage")}
                            </td>
                          </tr>
                          <tr>
                            <td valign="middle" align="center">
                              {checkImage(
                                this.props,
                                this.props?.mainObject?.landData
                                  ?.screenshotURL ||
                                  this.props?.mainObject?.landData?.landData
                                    ?.lands?.screenshotURL,
                                {}
                              )}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  )}

                {isPropertyRemovable && landData.image_uploader && (
                  <tr>
                    {" "}
                    <td colSpan="100%">
                      <table className="table">
                        <tr>
                          <td valign="middle" align="center">
                            {t("ParcelImage")}
                          </td>
                        </tr>
                        <tr>
                          <td valign="middle" align="center">
                            {checkImage(
                              this.props,
                              landData.image_uploader,
                              {}
                            )}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                )}
                {isPropertyRemovable && suggestionUrl && (
                  <tr>
                    {" "}
                    <td colSpan="100%">
                      <table className="table">
                        <tr>
                          <td valign="middle" align="center">
                            مسار النزع
                          </td>
                        </tr>
                        <tr>
                          <td valign="middle" align="center">
                            {checkImage(this.props, suggestionUrl, {})}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                )}
                {(isUpdateContract || isTadkekMesahy || isFarz) &&
                  suggestImage && (
                    <tr>
                      {" "}
                      <td colSpan="100%">
                        <table className="table">
                          <tr>
                            {imported_suggestImage &&
                              (isTadkekMesahy || isFarz) && (
                                <td valign="middle" align="center">
                                  بيانات الأرض من الرفع المساحي (التدقيق
                                  المكاني)
                                </td>
                              )}
                            <td valign="middle" align="center">
                              {(!isFarz && "بيانات الأرض من الرفع المساحي") ||
                                "بيانات الأرض من الوضع المقترح"}
                            </td>
                          </tr>
                          <tr>
                            {imported_suggestImage &&
                              (isTadkekMesahy || isFarz) && (
                                <td valign="middle" align="center">
                                  {checkImage(
                                    this.props,
                                    imported_suggestImage,
                                    {}
                                  )}
                                </td>
                              )}
                            <td valign="middle" align="center">
                              {checkImage(this.props, suggestImage, {})}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  )}
              </table>
            </div>
          )}
        </>
      )) || <></>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(landData));
