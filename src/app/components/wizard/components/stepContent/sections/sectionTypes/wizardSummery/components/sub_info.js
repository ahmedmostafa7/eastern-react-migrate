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
  project,
  updateStatisticParcels,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { esriRequest } from "../../../../../../../inputs/fields/identify/Component/common/esri_request";
import { mapUrl } from "../../../../../../../inputs/fields/identify/Component/mapviewer/config/map";
import { map, get, assign, isEmpty } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { workFlowUrl } from "../../../../../../../../../imports/config";
import { setPlanDefaults } from "../../../../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/planDefaults";
class allAttachments extends Component {
  constructor(props) {
    super(props);
    const {
      mainObject,
      treeNode: { currentStepInfo },
    } = props;

    // if (mainObject?.plans?.plansData?.planDetails) {
    //   mainObject.plans.plansData.planDetails.statisticsParcels =
    //     updateStatisticParcels(
    //       mainObject?.plans?.plansData?.planDetails.uplodedFeatures?.[
    //         mainObject?.plans?.plansData?.planDetails.selectedCADIndex || 0
    //       ],
    //       mainObject?.plans?.plansData?.planDetails,
    //       mainObject
    //     );
    // }
    setPlanDefaults(mainObject);

    this.state = {
      mainObject: mainObject,
    };
    // statisticsParcels = updateStatisticParcels(
    //   selectedPlan,
    //   planDetails,
    //   this.props.mainObject
    // );
  }

  exportParcelToGoogleMap() {
    const { mainObject } = this.props;
    let graphics = mainObject.data_msa7y.msa7yData.mapviewer.mapGraphics
      .map((layer) => layer.graphics)
      .reduce((a, b) => {
        b.forEach((graphic) => {
          if (
            graphic?.symbol?.type == "esriTS" &&
            (graphic?.geometry.x == "NaN" || graphic?.geometry.y == "NaN")
          ) {
          } else {
            a.push(graphic);
          }
        });
        return a;
      }, [])
      .map((graphic) => new esri.Graphic(graphic));

    var centerPoint = esri.graphicsExtent(graphics).getExtent().getCenter();
    project([centerPoint], 4326, (res) => {
      window.open(
        `http://maps.google.com/maps?q=${res[0].y},${res[0].x}`,
        "_blank"
      );
    });
  }
  render() {
    const {
      treeNode: { currentStepInfo },
    } = this.props;
    const { mainObject } = this.state;
    // let parcelsCount =
    //   mainObject?.plans?.plansData?.planDetails?.detailsParcelTypes
    //     ?.filter(
    //       (r) =>
    //         r.key == "سكنى" ||
    //         r.key == "استثماري" ||
    //         r.key == "صناعى" ||
    //         r.key == "زراعي" ||
    //         r.key == "تجارى"
    //     )
    //     ?.reduce((a, b) => {
    //       return a + b?.value?.[0]?.value?.length;
    //     }, 0) ||
    //   mainObject?.plans?.plansData?.planDetails?.detailsParcelTypes?.reduce(
    //     (a, b) => {
    //       return (
    //         a +
    //         b?.value?.[0]?.value?.filter(
    //           (r) =>
    //             r.typeName == "سكنى" ||
    //             r.typeName == "استثماري" ||
    //             r.typeName == "صناعى" ||
    //             r.typeName == "زراعي" ||
    //             r.typeName == "تجارى"
    //         )?.length
    //       );
    //     },
    //     0
    //   );
    let plan_using_type = get(
      mainObject,
      "submission_data.mostafed_data.mo5tat_use",
      ""
    );
    let parcelsCount =
      get(mainObject, "parcelsCount", 0) ||
      mainObject?.plans?.plansData.planDetails.detailsParcelTypes
        .filter(
          (r) =>
            r.key == "سكنى" ||
            r.key == "استثماري" ||
            r.key == "صناعى" ||
            r.key == "زراعي" ||
            r.key == "تجارى" ||
            (plan_using_type == "حكومي" && r.key == "خدمات حكومية")
        )
        ?.reduce((a, b) => {
          return a + b?.value?.[0]?.value?.length;
        }, 0) ||
      mainObject?.plans?.plansData.planDetails.detailsParcelTypes?.reduce(
        (a, b) => {
          return (
            a +
            b?.value?.[0]?.value?.filter(
              (r) =>
                r.typeName == "سكنى" ||
                r.typeName == "استثماري" ||
                r.typeName == "صناعى" ||
                r.typeName == "زراعي" ||
                r.typeName == "تجارى" ||
                (plan_using_type == "حكومي" && r.typeName == "خدمات حكومية")
            )?.length
          );
        },
        0
      );

    let cutAreaPercentage = get(mainObject, "cutAreaPercentage", 0);
    // mainObject?.plans?.plansData?.planDetails?.statisticsParcels
    //   ?.find(function (x) {
    //     return x.name == "النسب التخطيطية";
    //   })
    //   ?.areaPercentage?.toFixed(2);

    let servicePercentage = get(mainObject, "servicePercentage", 0);
    // mainObject?.plans?.plansData?.planDetails?.statisticsParcels
    //   ?.filter((d) => {
    //     return d.name?.indexOf("خدمات") != -1;
    //   })
    //   ?.reduce((a, b) => {
    //     return a + b?.areaPercentage;
    //   }, 0)
    //   ?.toFixed(2) || 0;

    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            {mainObject?.ownerData?.ownerData?.entity?.name && (
              <tr>
                <td>اسم المالك</td>
                <td>
                  {convertToArabic(
                    (mainObject.ownerData.ownerData.owners &&
                      Object.keys(mainObject.ownerData.ownerData.owners)
                        ?.map(
                          (ownerKey) =>
                            mainObject.ownerData.ownerData.owners[ownerKey].name
                        )
                        ?.join(", ")) ||
                      mainObject?.ownerData?.ownerData?.entity?.name ||
                      ""
                  )}
                </td>
              </tr>
            )}
            <tr>
              <td>اسم البلدية</td>
              <td>
                {convertToArabic(
                  mainObject?.landData?.landData?.municipality?.name
                )}
              </td>
            </tr>
            {mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
              ?.reduce((a, b) => {
                return a + +b.area;
              }, 0)
              ?.toFixed(2) != undefined && (
              <tr>
                <td>مساحة الأرض من الطبيعة</td>
                <td>
                  {convertToArabic(
                    (
                      mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.reduce(
                        (a, b) => {
                          return a + +b.area;
                        },
                        0
                      ) -
                      (mainObject?.data_msa7y?.msa7yData?.cadDetails
                        ?.cuttes_area || 0)
                    )?.toFixed(2) + " م2"
                  )}
                </td>
              </tr>
            )}
            <tr>
              <td>نوع الاستخدام</td>
              <td>
                {convertToArabic(
                  mainObject?.submission_data?.mostafed_data?.use_sumbol
                )}
              </td>
            </tr>
            {mainObject?.lagna_karar?.lagna_karar?.plan_number && (
              <tr>
                <td>رقم المخطط</td>
                <td>
                  {convertToArabic(
                    mainObject?.lagna_karar?.lagna_karar?.plan_number
                  )}
                </td>
              </tr>
            )}
            {cutAreaPercentage != 0 && !isEmpty(cutAreaPercentage) && (
              <tr>
                <td>النسبة التخطيطية</td>
                <td>{convertToArabic(cutAreaPercentage)} %</td>
              </tr>
            )}
            {servicePercentage != 0 && !isEmpty(servicePercentage) && (
              <tr>
                <td>نسبة الخدمات</td>
                <td>{convertToArabic(servicePercentage)} %</td>
              </tr>
            )}
            {parcelsCount != undefined && parcelsCount != "" && (
              <tr>
                <td>عدد قطع الأراضي</td>
                <td>{convertToArabic(parcelsCount)}</td>
              </tr>
            )}
            <tr>
              <td>الخطوة الحالية</td>
              <td>{this.props?.currentModule?.record?.CurrentStep?.name}</td>
            </tr>
            <tr>
              <td>الخطوة التالية</td>
              <td>
                {this.props?.currentModule?.record?.CurrentStep?.next_step
                  ?.name || currentStepInfo?.CurrentStep?.next_step?.name}
              </td>
            </tr>
            {mainObject?.data_msa7y?.msa7yData?.mapviewer?.mapGraphics && (
              <tr>
                <td>موقع المخطط</td>
                <td>
                  <button
                    className="btn add-btnT"
                    onClick={this.exportParcelToGoogleMap.bind(this)}
                  >
                    موقع المخطط على جوجل
                  </button>
                </td>
              </tr>
            )}
            {(mainObject?.landData?.landData?.lands?.parcelData
              ?.plans_approved_Image ||
              mainObject?.landData?.landData?.lands?.parcelData
                ?.approved_Image) != undefined && (
              <tr>
                <td>صورة المخطط</td>
                <td>
                  {checkImage(
                    this.props,
                    mainObject?.landData?.landData?.lands?.parcelData
                      ?.plans_approved_Image ||
                      mainObject?.landData?.landData?.lands?.parcelData
                        ?.approved_Image,
                    {}
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(allAttachments));
