import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import {
  convertToArabic,
  localizeNumber,
  getInfo,
  remove_duplicate,
  checkImage,
  map_object,
  calculateSchemanticProportions,
  updateStatisticParcels,
  getFieldDomain,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { getSubmissionHistory } from "main_helpers/functions/submission_history";
import {
  Select,
  Button,
  Form,
  message,
  Checkbox,
  Tabs,
  Collapse,
  Pagination,
  Tooltip,
} from "antd";
const Panel = Collapse.Panel;
import "../../../../../../../inputs/fields/identify/Component/msa7yDataComponent/planDataStyle.css";
import { esriRequest } from "../../../../../../../inputs/fields/identify/Component/common/esri_request";
import { mapUrl } from "../../../../../../../inputs/fields/identify/Component/mapviewer/config/map";
import { map, get, assign, isEmpty, isFunction } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
import { connect } from "react-redux";
import { workFlowUrl } from "../../../../../../../../../imports/config";
const planDescStyle = {
  fontSize: "15px",
  fontWeight: "600",
  marginTop: "5px",
  marginBottom: "5px",
};

const containerDetails = {
  minHeight: "10em",
  width: "150em",
  display: "table-cell",
  verticalAlign: "middle",
};

export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "plansData"),
    ...mapDispatchToProps1(dispatch),
  };
};
class allAttachments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isImageShown: false,
    };

    this.fields = {
      survayParcelCutter: {
        field: "list",
        hideLabel: true,
        init_data: (values, props) => {
          if (!props.input.value) {
            props.input.onChange([
              {
                direction: "الشطفة",
                NORTH_EAST_DIRECTION: "",
                NORTH_WEST_DIRECTION: "",
                SOUTH_EAST_DIRECTION: "",
                SOUTH_WEST_DIRECTION: "",
              },
            ]);
          }
        },
        fields: {
          direction: { head: "الإتجاه" },
          NORTH_EAST_DIRECTION: {
            head: "شمال / شرق",
          },
          NORTH_WEST_DIRECTION: {
            head: "شمال / غرب",
          },
          SOUTH_EAST_DIRECTION: {
            head: "جنوب / شرق",
          },
          SOUTH_WEST_DIRECTION: {
            head: "جنوب / غرب",
          },
        },
      },
    };

    getInfo(mapUrl).then((response) => {
      let StreetNamingLayerId = response["Street_Naming"];
      getFieldDomain("", StreetNamingLayerId).then((domains) => {
        this.domains = domains;
      });
    });
  }

  componentDidMount() {
    getSubmissionHistory(
      this.props.currentModule.record.workflow_id,
      this.props,
      this.props.currentModule.record
    ).then((result) => {
      let prevStep_fekraTakhtitya =
        result.steps_history.prevSteps.find(
          (r) => [2322, 3099].indexOf(r.prevStep.id) != -1
        ) != undefined;
      let currentStep_fekraTakhtitya =
        [2322, 3099].indexOf(
          result.steps_history.currentSteps.currentStep.id
        ) != -1;
      if (prevStep_fekraTakhtitya || currentStep_fekraTakhtitya) {
        this.setState({ isImageShown: true });
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  // calculateSchemanticProportions = (uplodedFeatures, statisticsParcels, planDetails) => {
  //   var msa7y_area = _.chain(
  //     this.props.mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels
  //   )
  //     .reduce(function (a, b) {
  //       return a + +b.area;
  //     }, 0)
  //     .value();

  //   var cutAreaIsCut =
  //     _.chain(uplodedFeatures.shapeFeatures.landbase)
  //       .filter((parcel) => {
  //         return parcel.is_cut && parcel.is_cut != 2;
  //       })
  //       .reduce((a, b) => {
  //         return a + +b.area;
  //       }, 0)
  //       .value() +
  //     (_.chain(statisticsParcels)
  //       ?.filter((parcel) => parcel.isInvestalIncluded == true)
  //       ?.reduce((a, b) => {
  //         return a + +b.area;
  //       }, 0)
  //       ?.value() || 0);

  //   var totalLandbasesArea = _.chain(uplodedFeatures.shapeFeatures.landbase)
  //     .reduce((a, b) => {
  //       return a + +b.area;
  //     }, 0)
  //     .value();

  //   var newCutArea = this.props.mainObject.submission_data.mostafed_data
  //     .e3adt_tanzem
  //     ? msa7y_area - (totalLandbasesArea - cutAreaIsCut)
  //     : cutAreaIsCut;

  //   let nesabIndex = statisticsParcels.findIndex(
  //     (parcel) => parcel.name == "النسب التخطيطية"
  //   );
  //   let nesabObj = {
  //     name: "النسب التخطيطية",
  //     area: newCutArea,
  //     areaPercentage:
  //       (newCutArea /
  //         ((this.props.mainObject.submission_data.mostafed_data.e3adt_tanzem &&
  //           msa7y_area) ||
  //           planDetails.TotalParcelArea)) *
  //       100,
  //   };
  //   if (nesabIndex == -1) {
  //     statisticsParcels.push(nesabObj);
  //   } else {
  //     statisticsParcels[nesabIndex] = nesabObj;
  //   }
  // };

  handleParcelChange = (page) => {
    this.setState({
      currentParcelPage: page,
      minParcelIndex: (page - 1) * this.pageSize,
      maxParcelIndex: page * this.pageSize,
    });
  };

  handleStreetChange = (page) => {
    this.setState({
      currentStreetPage: page,
      minStreetIndex: (page - 1) * this.pageSize,
      maxStreetIndex: page * this.pageSize,
    });
  };

  isValidCondition = (parcel) => {
    const { mainObject } = this.props;
    if (parcel.usingSymbol) {
      var condition = _.find(mainObject.buildingCondition, function (d) {
        return d.attributes.USING_SYMBOL_CODE == parcel.usingSymbol;
      });
      if (condition && condition.attributes && condition.attributes.SLIDE_AREA)
        return condition.attributes.SLIDE_AREA <= parcel.area;
      else return true;
    } else return true;
  };

  openPopup = (key, evt) => {
    var fields = this.fields;

    let data =
      (!this.props?.treeNode?.option?.data && this.props?.data?.data) ||
      (!this.props?.data?.data && this.props?.data) ||
      this.props?.treeNode?.option?.data ||
      this.props?.data?.data;
    let uplodedFeatures = data?.planDetails.uplodedFeatures;
    let selectedCADIndex = data?.planDetails.selectedCADIndex;

    // const {
    //   input: { value },
    // } = this.props;

    let selectedPlan = uplodedFeatures && uplodedFeatures[selectedCADIndex];
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: {
            ...selectedPlan.shapeFeatures.landbase[key],
          },
          ok(values) {
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  render() {
    const {
      mainObject: {
        streetlengthsPercentage,
        data_msa7y: {
          msa7yData: { cadDetails },
        },
        landData: {
          landData: {
            lands: {
              parcelData: { plans_approved_Image, approved_Image },
            },
          },
        },
        currentStepId,
      },
      currentModule: {
        record: { CurrentStep },
      },
    } = this.props;
    const { isImageShown } = this.state;
    this.pageSize = 15;

    let data =
      (!this.props?.treeNode?.option?.data && this.props?.data?.data) ||
      (!this.props?.data?.data && this.props?.data) ||
      this.props?.treeNode?.option?.data ||
      this.props?.data?.data;
    let planDetails = data?.planDetails;

    let planDescription = cadDetails.planDescription || "";
    let planUsingSymbol = planDetails.planUsingSymbol || "";
    let hide_details = planDetails.hide_details || false;
    let current_step = (CurrentStep && CurrentStep.id) || currentStepId;
    let streets = planDetails.streets || [];
    let minStreetIndex = this.state.minStreetIndex || 0;
    let maxStreetIndex = this.state.maxStreetIndex || 1 * this.pageSize;
    let currentStreetPage = this.state.currentStreetPage || 1;
    let currentParcelPage = this.state.currentParcelPage || 1;
    let minParcelIndex = this.state.minParcelIndex || 0;
    let maxParcelIndex = this.state.maxParcelIndex || 1 * this.pageSize;
    let uplodedFeatures = planDetails.uplodedFeatures;
    let selectedCADIndex = planDetails.selectedCADIndex;

    let detailsParcelTypes = planDetails.detailsParcelTypes || [];
    let TotalParcelArea =
      planDetails.TotalParcelArea ||
      (uplodedFeatures &&
        uplodedFeatures[
          planDetails.selectedCADIndex || 0
        ]?.shapeFeatures?.landbase?.reduce((a, b) => a + b.area, 0)) ||
      0;
    let servicesTypes = planDetails.servicesTypes || [];
    let selectedPlan = uplodedFeatures && uplodedFeatures[selectedCADIndex];
    let statisticsParcels =
      (planDetails.statisticsParcels.filter(
        (parcel) => parcel.isInvestalIncluded
      ).length > 0 &&
        planDetails.statisticsParcels) ||
      [];
    if (statisticsParcels.length == 0) {
      statisticsParcels = updateStatisticParcels(
        selectedPlan,
        planDetails,
        this.props.mainObject
      );
    }

    return (
      <div>
        {isImageShown &&
          checkImage(this.props, plans_approved_Image || approved_Image, {
            width: "100%",
          })}
        {planDescription && (
          <div style={planDescStyle}>{convertToArabic(planDescription)}</div>
        )}

        {planUsingSymbol && (
          <div className="usingsymbolStyle">
            {convertToArabic(planUsingSymbol)}
          </div>
        )}

        {!hide_details && (
          <div style={containerDetails}>
            <Collapse className="Collapse" defaultActiveKey={["0"]}>
              <Panel
                key={1}
                header={`الشوارع`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <table className="table table-bordered no-margin table-striped">
                  <thead>
                    <tr>
                      {[2331, 3126].indexOf(current_step) != -1 && (
                        <>
                          {streets?.find((x) => x.streetname != undefined) !=
                            undefined && <td>اسم الشارع</td>}
                          {streets?.find((x) => x.streetClass != undefined) !=
                            undefined && <td>صنف الشارع</td>}
                          {streets?.find((x) => x.streetType != undefined) !=
                            undefined && <td>نوع الشارع</td>}
                          {streets?.find((x) => x.oneWay != undefined) !=
                            undefined && <td>باتجاه واحد</td>}
                          {streets?.find((x) => x.divided != undefined) !=
                            undefined && <td>الطريقة مفصولة بجزيرة وسطية</td>}
                        </>
                      )}
                      <td>الطول (م)</td>
                      <td>العرض (م)</td>
                      <td>يحسب ضمن معدل نسبة أطوال الشوارع بالمخطط</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {streets &&
                      streets.map((street, index) => {
                        return (
                          index >= minStreetIndex &&
                          index < maxStreetIndex && (
                            <tr>
                              {[2331, 3126].indexOf(current_step) != -1 && (
                                <>
                                  {street.streetname != undefined && (
                                    <td>{street.streetname}</td>
                                  )}
                                  {street.streetClass != undefined && (
                                    <td>
                                      {
                                        this.domains?.[9]?.domain?.codedValues.find(
                                          (x) => x.code == street.streetClass
                                        )?.name
                                      }
                                    </td>
                                  )}
                                  {street.streetType != undefined && (
                                    <td>
                                      {
                                        this.domains?.[10]?.domain?.codedValues.find(
                                          (x) => x.code == street.streetType
                                        )?.name
                                      }
                                    </td>
                                  )}
                                  {street.oneWay != undefined && (
                                    <td>{(street.oneWay && "نعم") || "لا"}</td>
                                  )}
                                  {street.divided != undefined && (
                                    <td>{(street.divided && "نعم") || "لا"}</td>
                                  )}
                                </>
                              )}
                              <td>
                                {convertToArabic(
                                  parseFloat(street?.length?.toFixed(2))
                                )}
                              </td>
                              <td>
                                {convertToArabic(
                                  parseFloat(street?.width?.toFixed(2))
                                )}
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    margin: "3px",
                                  }}
                                  checked={street.checked}
                                  disabled={true}
                                />
                              </td>
                            </tr>
                          )
                        );
                      })}
                    <tr>
                      <td>معدل نسبة أطوال الشوارع في المخطط</td>
                      <td colSpan={"100%"}>
                        {convertToArabic(streetlengthsPercentage) +
                          " م ط / هكتار"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Pagination
                  pageSize={this.pageSize}
                  current={currentStreetPage}
                  total={streets.length}
                  onChange={this.handleStreetChange}
                  style={{ bottom: "0px", position: "static" }}
                />
              </Panel>
              <Panel
                key={3}
                header={`قطع الأراضي`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <section style={{ display: "flex", marginTop: "20px" }}>
                  <div style={{ width: "100%" }}>
                    <table className="table table-bordered no-margin table-striped">
                      <thead>
                        <tr>
                          <td>رقم القطعة</td>
                          <td>الاستخدام</td>
                          {(current_step == 2329 ||
                            current_step == 2330 ||
                            current_step == 2372 ||
                            current_step == 2902 ||
                            current_step == 2903 ||
                            current_step == 2895 ||
                            current_step == 2896 ||
                            current_step == 2897 ||
                            current_step == 2898 ||
                            current_step == 2899 ||
                            current_step == 2900 ||
                            current_step == 2901 ||
                            current_step == 2331 ||
                            current_step == 2371 ||
                            current_step == 3117 ||
                            current_step == 3118 ||
                            current_step == 3119 ||
                            current_step == 3120 ||
                            current_step == 3121 ||
                            current_step == 3122 ||
                            current_step == 3123 ||
                            current_step == 3124 ||
                            current_step == 3125 ||
                            current_step == 3126 ||
                            current_step == 3130 ||
                            current_step == 3132 ||
                            current_step == 3133) && (
                            <td>طول الحد الشمالي (م)</td>
                          )}
                          {(current_step == 2329 ||
                            current_step == 2330 ||
                            current_step == 2372 ||
                            current_step == 2902 ||
                            current_step == 2903 ||
                            current_step == 2895 ||
                            current_step == 2896 ||
                            current_step == 2897 ||
                            current_step == 2898 ||
                            current_step == 2899 ||
                            current_step == 2900 ||
                            current_step == 2901 ||
                            current_step == 2331 ||
                            current_step == 2371 ||
                            current_step == 3117 ||
                            current_step == 3118 ||
                            current_step == 3119 ||
                            current_step == 3120 ||
                            current_step == 3121 ||
                            current_step == 3122 ||
                            current_step == 3123 ||
                            current_step == 3124 ||
                            current_step == 3125 ||
                            current_step == 3126 ||
                            current_step == 3130 ||
                            current_step == 3132 ||
                            current_step == 3133) && (
                            <td>طول الحد الشرقي (م)</td>
                          )}
                          {(current_step == 2329 ||
                            current_step == 2330 ||
                            current_step == 2372 ||
                            current_step == 2902 ||
                            current_step == 2903 ||
                            current_step == 2895 ||
                            current_step == 2896 ||
                            current_step == 2897 ||
                            current_step == 2898 ||
                            current_step == 2899 ||
                            current_step == 2900 ||
                            current_step == 2901 ||
                            current_step == 2331 ||
                            current_step == 2371 ||
                            current_step == 3117 ||
                            current_step == 3118 ||
                            current_step == 3119 ||
                            current_step == 3120 ||
                            current_step == 3121 ||
                            current_step == 3122 ||
                            current_step == 3123 ||
                            current_step == 3124 ||
                            current_step == 3125 ||
                            current_step == 3126 ||
                            current_step == 3130 ||
                            current_step == 3132 ||
                            current_step == 3133) && (
                            <td>طول الحد الجنوبي (م)</td>
                          )}
                          {(current_step == 2329 ||
                            current_step == 2330 ||
                            current_step == 2372 ||
                            current_step == 2902 ||
                            current_step == 2903 ||
                            current_step == 2895 ||
                            current_step == 2896 ||
                            current_step == 2897 ||
                            current_step == 2898 ||
                            current_step == 2899 ||
                            current_step == 2900 ||
                            current_step == 2901 ||
                            current_step == 2331 ||
                            current_step == 2371 ||
                            current_step == 3117 ||
                            current_step == 3118 ||
                            current_step == 3119 ||
                            current_step == 3120 ||
                            current_step == 3121 ||
                            current_step == 3122 ||
                            current_step == 3123 ||
                            current_step == 3124 ||
                            current_step == 3125 ||
                            current_step == 3126 ||
                            current_step == 3130 ||
                            current_step == 3132 ||
                            current_step == 3133) && (
                            <td>طول الحد الغربي (م)</td>
                          )}
                          <td>المساحة (م۲)</td>
                          {current_step != 2329 &&
                            current_step != 3117 &&
                            current_step != 2330 &&
                            current_step != 3118 &&
                            current_step != 2371 &&
                            current_step != 3119 && <td>طول الواجهة (م)</td>}
                          {(current_step == 2329 ||
                            current_step == 2330 ||
                            current_step == 2372 ||
                            current_step == 2902 ||
                            current_step == 2903 ||
                            current_step == 2895 ||
                            current_step == 2896 ||
                            current_step == 2897 ||
                            current_step == 2898 ||
                            current_step == 2899 ||
                            current_step == 2900 ||
                            current_step == 2901 ||
                            current_step == 2331 ||
                            current_step == 2371 ||
                            current_step == 3117 ||
                            current_step == 3118 ||
                            current_step == 3119 ||
                            current_step == 3120 ||
                            current_step == 3121 ||
                            current_step == 3122 ||
                            current_step == 3123 ||
                            current_step == 3124 ||
                            current_step == 3125 ||
                            current_step == 3126 ||
                            current_step == 3130 ||
                            current_step == 3132 ||
                            current_step == 3133) && <td>ملاحظات</td>}

                          <td>الشطفات</td>

                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPlan?.shapeFeatures?.landbase?.map(
                          (parcel, index) => {
                            return (
                              !parcel.isHide &&
                              index >= minParcelIndex &&
                              index < maxParcelIndex && (
                                <tr
                                  style={
                                    (this.isValidCondition(parcel) && {
                                      backgroundColor: "white",
                                    }) || { backgroundColor: "#f58c8c" }
                                  }
                                >
                                  <td>{convertToArabic(parcel.number)}</td>
                                  <td>
                                    {convertToArabic(parcel.usingSymbolName)}
                                  </td>

                                  {(current_step == 2329 ||
                                    current_step == 2330 ||
                                    current_step == 2372 ||
                                    current_step == 2902 ||
                                    current_step == 2903 ||
                                    current_step == 2895 ||
                                    current_step == 2896 ||
                                    current_step == 2897 ||
                                    current_step == 2898 ||
                                    current_step == 2899 ||
                                    current_step == 2900 ||
                                    current_step == 2901 ||
                                    current_step == 2331 ||
                                    current_step == 2371 ||
                                    current_step == 3117 ||
                                    current_step == 3118 ||
                                    current_step == 3119 ||
                                    current_step == 3120 ||
                                    current_step == 3121 ||
                                    current_step == 3122 ||
                                    current_step == 3123 ||
                                    current_step == 3124 ||
                                    current_step == 3125 ||
                                    current_step == 3126 ||
                                    current_step == 3130 ||
                                    current_step == 3132 ||
                                    current_step == 3133) && (
                                    <td>
                                      {convertToArabic(
                                        parseFloat(
                                          parcel?.north_length?.toFixed(2)
                                        )
                                      )}
                                    </td>
                                  )}
                                  {(current_step == 2329 ||
                                    current_step == 2330 ||
                                    current_step == 2372 ||
                                    current_step == 2902 ||
                                    current_step == 2903 ||
                                    current_step == 2895 ||
                                    current_step == 2896 ||
                                    current_step == 2897 ||
                                    current_step == 2898 ||
                                    current_step == 2899 ||
                                    current_step == 2900 ||
                                    current_step == 2901 ||
                                    current_step == 2331 ||
                                    current_step == 2371 ||
                                    current_step == 3117 ||
                                    current_step == 3118 ||
                                    current_step == 3119 ||
                                    current_step == 3120 ||
                                    current_step == 3121 ||
                                    current_step == 3122 ||
                                    current_step == 3123 ||
                                    current_step == 3124 ||
                                    current_step == 3125 ||
                                    current_step == 3126 ||
                                    current_step == 3130 ||
                                    current_step == 3132 ||
                                    current_step == 3133) && (
                                    <td>
                                      {convertToArabic(
                                        parseFloat(
                                          parcel?.east_length?.toFixed(2)
                                        )
                                      )}
                                    </td>
                                  )}
                                  {(current_step == 2329 ||
                                    current_step == 2330 ||
                                    current_step == 2372 ||
                                    current_step == 2902 ||
                                    current_step == 2903 ||
                                    current_step == 2895 ||
                                    current_step == 2896 ||
                                    current_step == 2897 ||
                                    current_step == 2898 ||
                                    current_step == 2899 ||
                                    current_step == 2900 ||
                                    current_step == 2901 ||
                                    current_step == 2331 ||
                                    current_step == 2371 ||
                                    current_step == 3117 ||
                                    current_step == 3118 ||
                                    current_step == 3119 ||
                                    current_step == 3120 ||
                                    current_step == 3121 ||
                                    current_step == 3122 ||
                                    current_step == 3123 ||
                                    current_step == 3124 ||
                                    current_step == 3125 ||
                                    current_step == 3126 ||
                                    current_step == 3130 ||
                                    current_step == 3132 ||
                                    current_step == 3133) && (
                                    <td>
                                      {convertToArabic(
                                        parseFloat(
                                          parcel?.south_length?.toFixed(2)
                                        )
                                      )}
                                    </td>
                                  )}
                                  {(current_step == 2329 ||
                                    current_step == 2330 ||
                                    current_step == 2372 ||
                                    current_step == 2902 ||
                                    current_step == 2903 ||
                                    current_step == 2895 ||
                                    current_step == 2896 ||
                                    current_step == 2897 ||
                                    current_step == 2898 ||
                                    current_step == 2899 ||
                                    current_step == 2900 ||
                                    current_step == 2901 ||
                                    current_step == 2331 ||
                                    current_step == 2371 ||
                                    current_step == 3117 ||
                                    current_step == 3118 ||
                                    current_step == 3119 ||
                                    current_step == 3120 ||
                                    current_step == 3121 ||
                                    current_step == 3122 ||
                                    current_step == 3123 ||
                                    current_step == 3124 ||
                                    current_step == 3125 ||
                                    current_step == 3126 ||
                                    current_step == 3130 ||
                                    current_step == 3132 ||
                                    current_step == 3133) && (
                                    <td>
                                      {convertToArabic(
                                        parseFloat(
                                          parcel?.weast_length?.toFixed(2)
                                        )
                                      )}
                                    </td>
                                  )}

                                  <td>
                                    {convertToArabic(
                                      parseFloat(
                                        +parcel?.area?.toFixed(2) -
                                          (parcel.cuttes_area ||
                                            (parcel.survayParcelCutter &&
                                              +parcel.survayParcelCutter[0]
                                                .NORTH_EAST_DIRECTION +
                                                +parcel.survayParcelCutter[0]
                                                  .NORTH_WEST_DIRECTION +
                                                +parcel.survayParcelCutter[0]
                                                  .SOUTH_EAST_DIRECTION +
                                                +parcel.survayParcelCutter[0]
                                                  .SOUTH_WEST_DIRECTION) ||
                                            0)
                                      )
                                    )}
                                  </td>

                                  {((current_step &&
                                    [2317, 3095].indexOf(current_step) != -1 &&
                                    [2329, 3117].indexOf(current_step) == -1) ||
                                    !current_step) && (
                                    <td>{parcel.frontLength}</td>
                                  )}
                                  {current_step &&
                                    current_step != 2317 &&
                                    current_step != 3095 &&
                                    current_step != 2330 &&
                                    current_step != 2329 &&
                                    current_step != 2371 &&
                                    current_step != 3117 &&
                                    current_step != 3118 &&
                                    current_step != 3119 && (
                                      <td>
                                        {convertToArabic(parcel.frontLength)}
                                      </td>
                                    )}
                                  {(current_step == 2329 ||
                                    current_step == 2330 ||
                                    current_step == 2372 ||
                                    current_step == 2902 ||
                                    current_step == 2903 ||
                                    current_step == 2895 ||
                                    current_step == 2896 ||
                                    current_step == 2897 ||
                                    current_step == 2898 ||
                                    current_step == 2899 ||
                                    current_step == 2900 ||
                                    current_step == 2901 ||
                                    current_step == 2331 ||
                                    current_step == 2371 ||
                                    current_step == 3117 ||
                                    current_step == 3118 ||
                                    current_step == 3119 ||
                                    current_step == 3120 ||
                                    current_step == 3121 ||
                                    current_step == 3122 ||
                                    current_step == 3123 ||
                                    current_step == 3124 ||
                                    current_step == 3125 ||
                                    current_step == 3126 ||
                                    current_step == 3130 ||
                                    current_step == 3132 ||
                                    current_step == 3133) && (
                                    <td>{convertToArabic(parcel.note)}</td>
                                  )}
                                  {(parcel?.survayParcelCutter?.length > 0 && (
                                    <td>
                                      <button
                                        className="btn"
                                        onClick={this.openPopup.bind(
                                          this,
                                          index
                                        )}
                                      >
                                        تعديل الشطفات
                                      </button>
                                    </td>
                                  )) || <td></td>}
                                  {!this.isValidCondition(parcel) && (
                                    <td>
                                      <Tooltip title="المساحة لا تطابق اشتراطات البناء">
                                        <i className="fa fa-exclamation-circle"></i>
                                      </Tooltip>
                                    </td>
                                  )}
                                </tr>
                              )
                            );
                          }
                        )}
                      </tbody>
                    </table>

                    <Pagination
                      pageSize={this.pageSize}
                      current={currentParcelPage}
                      total={selectedPlan?.shapeFeatures?.landbase?.length || 0}
                      onChange={this.handleParcelChange}
                      style={{ bottom: "0px", position: "static" }}
                    />
                  </div>
                </section>
              </Panel>
              <Panel
                key={4}
                header={`النسب التخطيطية`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <div style={{ width: "100%" }}>
                  <table className="table table-bordered no-margin table-striped">
                    <thead>
                      <tr>
                        <td>الاستخدام</td>
                        <td>المساحة (م۲)</td>
                        <td>النسبة المئوية (%)</td>
                        <td>تحسب ضمن النسب التخطيطية</td>
                      </tr>
                    </thead>
                    <tbody>
                      {statisticsParcels
                        ?.filter(
                          (parcel) => [1, 2].indexOf(parcel.is_cut) != -1
                        )
                        ?.map((parcel, index) => {
                          return (
                            <tr>
                              {parcel.name != "undefined" && (
                                <td>{parcel.name}</td>
                              )}
                              <td>
                                {convertToArabic(
                                  parseFloat(parcel?.area?.toFixed(2))
                                )}
                              </td>
                              <td>
                                {convertToArabic(
                                  parseFloat(parcel?.areaPercentage?.toFixed(2))
                                )}
                              </td>
                              <td>
                                <span>
                                  <input
                                    type="checkbox"
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      margin: "3px",
                                    }}
                                    checked={
                                      parcel.is_cut == 1
                                        ? true
                                        : parcel.isInvestalIncluded
                                    }
                                    disabled={true}
                                  />
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </Panel>
              <Panel
                key={5}
                header={`مؤشر نسب الاستعمالات`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <table className="table table-bordered no-margin table-striped">
                  <thead>
                    <tr>
                      <td>الاستخدام</td>
                      <td>المساحة (م۲)</td>
                      <td>النسبة المئوية (%)</td>
                    </tr>
                  </thead>
                  <tbody>
                    {statisticsParcels.map((parcel, index) => {
                      return (
                        <tr>
                          {parcel.name == "undefined" && <td>اخرى</td>}
                          {parcel.name != "undefined" && <td>{parcel.name}</td>}
                          <td>
                            {convertToArabic(
                              parseFloat(parcel?.area?.toFixed(2))
                            )}
                          </td>
                          <td>
                            {convertToArabic(
                              parseFloat(parcel?.areaPercentage?.toFixed(2))
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Panel>
              <Panel
                key={6}
                header={`الميزانية التفصيلية`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <section style={{ display: "flex", marginTop: "20px" }}>
                  <table className="table table-bordered no-margin table-striped">
                    <thead>
                      <tr>
                        <td>الاستعمال</td>
                        <td>الاستعمال الفرعي</td>
                        <td>العدد</td>
                        <td>المساحة (م۲)</td>
                        <td>النسبة المئوية (%)</td>
                        <td>النسبة المئوية الإجمالية (%)</td>
                      </tr>
                    </thead>
                    <tbody>
                      {detailsParcelTypes.map((detail, index) => {
                        return (
                          <tr>
                            {detail.key == "undefined" && <td>اخرى</td>}
                            {detail.key != "undefined" && <td>{detail.key}</td>}
                            <td>
                              <table className="table no-margin table-striped">
                                {Object.values(detail.value).map(
                                  (value, index) => {
                                    return (
                                      <tr>
                                        <td>
                                          {(value.value[0].subType &&
                                            value.value[0].subType
                                              .sublayer_description) ||
                                            ""}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </table>
                            </td>
                            <td>
                              <table className="table no-margin table-striped">
                                {Object.values(detail.value).map(
                                  (value, index) => {
                                    return (
                                      <tr>
                                        <td>
                                          {convertToArabic(value.value.length)}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </table>
                            </td>
                            <td>
                              <table className="table no-margin table-striped">
                                {Object.values(detail.value).map(
                                  (value, index) => {
                                    return (
                                      <tr>
                                        <td>
                                          {convertToArabic(
                                            parseFloat(
                                              value?.total_area?.toFixed(2)
                                            )
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </table>
                            </td>
                            <td>
                              <table className="table no-margin table-striped">
                                {Object.values(detail.value).map(
                                  (value, index) => {
                                    return (
                                      <tr>
                                        <td>
                                          {convertToArabic(
                                            parseFloat(
                                              (
                                                (value.total_area /
                                                  TotalParcelArea) *
                                                100
                                              )?.toFixed(2)
                                            )
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </table>
                            </td>
                            <td>
                              {convertToArabic(
                                parseFloat(
                                  (
                                    (detail.usingTypeArea / TotalParcelArea) *
                                    100
                                  )?.toFixed(2)
                                )
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td>معدل نسبة أطوال الشوارع في المخطط</td>
                        <td colSpan={5}>
                          {convertToArabic(streetlengthsPercentage) +
                            " م ط / هكتار"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </Panel>
            </Collapse>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  appMapDispatchToProps
)(withTranslation("labels")(allAttachments));
