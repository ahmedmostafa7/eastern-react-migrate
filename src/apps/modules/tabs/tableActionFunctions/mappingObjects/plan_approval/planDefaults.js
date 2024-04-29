import { esriRequest } from "../../../../../../app/components/inputs/fields/identify/Component/common/esri_request";
import {
  convertToArabic,
  queryTask_updated,
  updateStatisticParcels,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { get, isEmpty } from "lodash";
export const setPlanDefaults = (mainObject, withRequests = true) => {
  return new Promise((resolve, reject) => {
    try {
      if (mainObject.lagna_notes && mainObject.lagna_notes.lagna_remarks) {
        mainObject.isShowAmin =
          mainObject.lagna_notes.lagna_remarks.remarks.find((x) => {
            return x.isSignAmin == true;
          }) &&
          mainObject.lagna_notes.lagna_remarks.remarks.find((x) => {
            return x.isSignAmin == true;
          }).checked;
      }

      if (mainObject.ownerData) {
        var ownerNames = "";
        var owners = get(
          mainObject,
          "ownerData.ownerData.owners",
          get(mainObject, "ownerData.ownerData", [])
        );
        Object.keys(owners).map((key) => {
          ownerNames +=
            (!isEmpty(ownerNames)
              ? ", " + owners[key].name
              : owners[key].name) || "";
        });
        mainObject.ownerData.ownersname =
          ownerNames ||
          get(mainObject, "destinationData.destinationData.entity.name", "");
      }
      
      if (mainObject?.plans?.plansData?.planDetails) {
        var sug = mainObject.plans.plansData.planDetails;
        var usingSymbolObj;
        if (sug?.uplodedFeatures?.[sug?.selectedCADIndex]) {
          usingSymbolObj = _(
            sug?.uplodedFeatures?.[sug?.selectedCADIndex]?.shapeFeatures
              ?.landbase
          )
            .groupBy("usingSymbol")
            .value();
        }
        mainObject.plans.plansData.planDetails.statisticsParcels =
          updateStatisticParcels(
            sug?.uplodedFeatures?.[sug?.selectedCADIndex],
            sug,
            mainObject
          );

        
        if (usingSymbolObj) {
          Object.keys(usingSymbolObj)
            .filter(function (d) {
              return d && d != "undefined";
            })
            .forEach(function (ele, key) {
              if (
                ele.startsWith("س") ||
                ele.startsWith("(س") ||
                ele.startsWith("ص") ||
                ele.startsWith("ت") ||
                ele.startsWith("ز") ||
                ele.startsWith("خ") ||
                ele.startsWith("م-") ||
                ele.startsWith("ت-ج")
              ) {
                if (
                  usingSymbolObj[ele].length > maxCount &&
                  convertToArabic(
                    mainObject.submission_data.mostafed_data.use_sumbol
                  ).indexOf(convertToArabic(ele)) != -1
                ) {
                  maxCount = usingSymbolObj[ele].length;

                  // if (ele == "ت-3") {
                  //   ele = "م-ت ع";
                  // }
                  
                  mainObject.selectedMaxUsingSymbolCode = ele;
                  mainObject.selectedMaxUsingSymbol =
                    "منطقة " +
                    mainObject.submission_data.mostafed_data.mostafed_type +
                    (ele.indexOf("س") > -1 ? "ة" : "") +
                    " " +
                    ele;
                }
              }
            });
          mainObject.MaxUsingSymbolDescription =
            "يُسمح بالإستعمالات ال" +
            mainObject.submission_data.mostafed_data.mo5tat_use +
            ((mainObject.submission_data.mostafed_data.mo5tat_use.lastIndexOf(
              "ي"
            ) != -1 &&
              "ة") ||
              "") +
            " " +
            "و إستعمالاتها التبعية فى المنطقة ال" +
            mainObject.submission_data.mostafed_data.mo5tat_use +
            ((mainObject.submission_data.mostafed_data.mo5tat_use.lastIndexOf(
              "ي"
            ) != -1 &&
              "ة") ||
              "") +
            " " +
            mainObject.selectedMaxUsingSymbol;

          mainObject.locationStatis = {};
          mainObject.locationStatis.landsShapCount =
            sug?.uplodedFeatures?.[
              sug?.selectedCADIndex
            ]?.shapeFeatures?.landbase?.length;
          mainObject.locationStatis.mosqeShapCount = _.filter(
            sug?.uplodedFeatures?.[sug?.selectedCADIndex]?.shapeFeatures
              ?.landbase || [],
            function (d) {
              return d.subType && d.subType.sublayer_description == "مسجد";
            }
          ).length;
          mainObject.locationStatis.boiesSchoolsCount = _.filter(
            sug?.uplodedFeatures?.[sug?.selectedCADIndex]?.shapeFeatures
              ?.landbase || [],
            function (d) {
              return (
                d.subType && d.subType.sublayer_description.indexOf("بنين") > -1
              );
            }
          ).length;
          mainObject.locationStatis.girlsSchoolsCount = _.filter(
            sug?.uplodedFeatures?.[sug?.selectedCADIndex]?.shapeFeatures
              ?.landbase || [],
            function (d) {
              return (
                d.subType && d.subType.sublayer_description.indexOf("بنات") > -1
              );
            }
          ).length;
          mainObject.locationStatis.totalPlanArea =
            sug?.uplodedFeatures?.[sug?.selectedCADIndex]?.shapeFeatures
              ?.boundry &&
            sug?.uplodedFeatures?.[sug?.selectedCADIndex]?.shapeFeatures
              ?.boundry[0].area;
          mainObject.locationStatis.totalServicesAreas = _.filter(
            sug?.uplodedFeatures?.[sug?.selectedCADIndex]?.shapeFeatures
              ?.landbase || [],
            function (d) {
              return (
                d.usingSymbolName && d.usingSymbolName.indexOf("خدمات") > -1
              );
            }
          ).reduce(function (memo, val) {
            return +memo + +val.area;
          }, 0);
          if (
            mainObject.locationStatis.totalServicesAreas &&
            mainObject.locationStatis.totalPlanArea
          ) {
            mainObject.locationStatis.totalServicesPersentage =
              (mainObject.locationStatis.totalServicesAreas /
                mainObject.locationStatis.totalPlanArea) *
              100;
          }
        }

        if (mainObject.plans.plansData.planDetails.statisticsParcels) {
          mainObject.cutAreaPercentage =
            mainObject?.plans?.plansData?.planDetails?.statisticsParcels
              ?.find(function (x) {
                return x.name == "النسب التخطيطية";
              })
              ?.areaPercentage?.toFixed(2);
          mainObject.servicesPercentage =
            mainObject?.plans?.plansData?.planDetails?.statisticsParcels
              ?.filter((d) => {
                return d.name?.indexOf("خدمات") != -1;
              })
              ?.reduce((a, b) => {
                return a + b?.areaPercentage;
              }, 0)
              ?.toFixed(2) || 0;
        }

        
        if (mainObject.plans.plansData.planDetails.streets) {
          mainObject.plans.plansData.planDetails.streets =
            mainObject.plans.plansData.planDetails.streets.map((street) => {
              let currentPolygon = new esri.geometry.Polygon(street);
              if (
                street.checked == undefined &&
                mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
                  mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
                ]?.shapeFeatures?.boundry?.[0]
              ) {
                street.checked =
                  (window.geometryEngine.contains(
                    new esri.geometry.Polygon(
                      mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
                        mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
                      ]?.shapeFeatures?.boundry?.[0]
                    ),
                    currentPolygon
                  ) ||
                    window.geometryEngine.within(
                      currentPolygon,
                      new esri.geometry.Polygon(
                        mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
                          mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
                        ]?.shapeFeatures?.boundry?.[0]
                      )
                    )) &&
                  !currentPolygon.rings[0].filter((r, index) => {
                    try {
                      return window.geometryEngine.touches(
                        new esri.geometry.Polygon(
                          mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
                            mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
                          ]?.shapeFeatures?.boundry?.[0]
                        ),
                        new esri.geometry.Polyline([
                          r,
                          currentPolygon.rings[0][index + 1],
                        ])
                      );
                    } catch (ex) {
                      return false;
                    }
                  }).length;
              }
              return street;
            });

          let totalAreaPercentage =
            mainObject?.landData?.landData?.area / 10000;

          mainObject.streetlengthsPercentage = +(
            mainObject?.plans?.plansData?.planDetails?.streets?.reduce(
              function (a, b) {
                
                if (b.checked) {
                  return a + +b.length.toFixed(2);
                }
                return a;
              },
              0
            ) / totalAreaPercentage
          )?.toFixed(2);
        }

        let plan_using_type = get(
          mainObject,
          "submission_data.mostafed_data.mo5tat_use",
          ""
        );

        mainObject.parcelsCount =
          // mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
          //   mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
          // ]?.shapeFeatures?.landbase?.filter((x) => {
          //   return (
          //     // x.typeName != "شوارع" &&
          //     // x.typeName != "مواقف" &&
          //     // x.typeName != null &&
          //     // x.typeName != "مناطق مفتوحة" &&
          //     // x.typeName != "ممرات مشاة"
          //     !x.is_cut
          //   );
          // })?.length ||
          +(mainObject?.plans?.plansData.planDetails.detailsParcelTypes
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
          ));

        if (
          mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
            mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
          ]?.shapeFeatures?.landbase
        ) {
          mainObject.servicesCount =
            mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
              mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
            ]?.shapeFeatures?.landbase?.filter((x) => {
              return x.usingSymbol == "خ";
            }).length;
          mainObject.parkingCount =
            mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
              mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
            ]?.shapeFeatures?.landbase?.filter((x) => {
              return x.typeName == "مواقف";
            }).length;
          mainObject.gardenCount =
            mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
              mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
            ]?.shapeFeatures?.landbase?.filter((x) => {
              return x.typeName == "حدائق";
            }).length;

          //
          mainObject.commercialCount =
            mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
              mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
            ]?.shapeFeatures?.landbase?.filter((x) => {
              return x.typeName == "تجارى";
            }).length;

          //mainObject.parcelsCount -= mainObject.servicesCount;
        }

        if (mainObject?.plans?.plansData?.planDetails?.statisticsParcels) {
          let servicePercentage =
            mainObject.plans.plansData.planDetails.statisticsParcels
              ?.filter((d) => {
                return d.name?.indexOf("خدمات") != -1;
              })
              ?.reduce((a, b) => {
                return a + b?.areaPercentage;
              }, 0)
              ?.toFixed(2) || 0;
          mainObject.servicePercentage = servicePercentage;
        }

        var maxCount = 0;
        // mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails?.uplodedFeatures?.[mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails?.selectedCADIndex].shapeFeatures.landbase

        if (
          mainObject.tabtiriPlans &&
          mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails
            ?.uplodedFeatures?.[
            mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails
              ?.selectedCADIndex
          ]
        ) {
          mainObject.tabtiriPlans.tabtiriPlansData.planDetails.uplodedFeatures[
            mainObject.tabtiriPlans.tabtiriPlansData.planDetails.selectedCADIndex
          ].shapeFeatures.landbase =
            mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails?.uplodedFeatures?.[
              mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails
                ?.selectedCADIndex
            ]?.shapeFeatures?.landbase?.sort((a, b) =>
              +a.number > +b.number ? 1 : +b.number > +a.number ? -1 : 0
            );

          mainObject.sortedtabtiriLandbase =
            mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails?.uplodedFeatures?.[
              mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails
                ?.selectedCADIndex
            ]?.shapeFeatures?.landbase
              ?.filter((k) => {
                return +k.number > 0;
              })
              ?.sort((a, b) =>
                +a.number > +b.number ? 1 : +b.number > +a.number ? -1 : 0
              );

          mainObject.sortedtabtiriLandbase =
            mainObject.sortedtabtiriLandbase.concat(
              mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails?.uplodedFeatures?.[
                mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails
                  ?.selectedCADIndex
              ]?.shapeFeatures?.landbase?.filter((k) => {
                return isNaN(k.number);
              })
            );
        }

        if (
          mainObject.plans &&
          mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
            mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
          ]?.shapeFeatures
        ) {
          mainObject.plans.plansData.planDetails.uplodedFeatures[
            mainObject.plans.plansData.planDetails.selectedCADIndex
          ].shapeFeatures.landbase =
            mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
              mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
            ]?.shapeFeatures?.landbase?.sort((a, b) =>
              +a.number > +b.number ? 1 : +b.number > +a.number ? -1 : 0
            );

          mainObject.sortedLandbase =
            mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
              mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
            ]?.shapeFeatures?.landbase
              ?.filter((k) => {
                return +k.number > 0;
              })
              ?.sort((a, b) =>
                +a.number > +b.number ? 1 : +b.number > +a.number ? -1 : 0
              );

          mainObject.sortedLandbase = mainObject.sortedLandbase.concat(
            mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[
              mainObject?.plans?.plansData?.planDetails?.selectedCADIndex
            ]?.shapeFeatures?.landbase?.filter((k) => {
              return isNaN(k.number);
            })
          );
        }

        if (!withRequests) {
          return resolve(mainObject);
        } else {
          esriRequest(window.planMapEditing + "MapServer/layers").then(
            function (maplayers) {
              if (window.planMapEditing) {
                var layer = _.find(maplayers.tables, function (d) {
                  return d.name == "Tbl_Parcel_Conditions";
                });
                if (layer && layer.id) {
                  queryTask_updated(
                    window.planMapEditing + "MapServer/" + layer.id,
                    "USING_SYMBOL_CODE='" +
                      mainObject.selectedMaxUsingSymbolCode +
                      "'",
                    ["*"],
                    function (result) {
                      mainObject.buildingCondition = result.features;
                      return resolve(mainObject);
                    }
                  );
                }
              }
            }
          );
        }
      } else {
        return resolve(mainObject);
      }
    } catch (error) {
      return reject();
    }
  });
};
