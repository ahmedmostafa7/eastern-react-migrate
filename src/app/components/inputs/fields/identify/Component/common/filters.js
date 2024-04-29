import axios from "axios";
import { querySetting } from "../propertyCheckIdentifyComponnent/Helpers";
import {
  clearGraphicFromLayer,
  highlightFeature,
  queryTask,
} from "./common_func";
import { esriRequest } from "./esri_request";
var uniqid = require("uniqid");
export const onMunChange = (scope, e, callback) => {
  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    clearGraphicFromLayer(scope.map, "SelectLandsGraphicLayer");
    scope.setState({
      munval: e,
      planeval: undefined,
      subTypeval: undefined,
      subNameval: undefined,
      blockval: undefined,
      parcelval: undefined,
      // selectedLands: [],
      // selectedLandsT: [],
      PlanNum: [],
      blockNum: [],
      subDivNames: [],
      //subDivType: [],
      parcelId: null,
      parcelNum: [],
      parcelData: scope.state.parcelData || {},
    });

    if (
      scope.props?.mainObject?.serviceSubmissionType?.submission?.utilitytype_id
    ) {
      axios
        .get(
          window.workFlowUrl +
            "/utilityType/" +
            scope.props.mainObject.serviceSubmissionType.submission
              .utilitytype_id +
            "/utilityClass?municipalityCode=" +
            e
        )
        .then((response) => {
          scope.cateogry = response.data;
        });
    }

    queryTask({
      ...querySetting(
        scope.LayerID.Municipality_Boundary,
        `MUNICIPALITY_NAME='${e}'`,
        true,
        ["*"],
        window.filterUrl
      ),
      callbackResult: (res) => {
        scope.pol = res.features[0];
        highlightFeature(scope.pol, scope.map, {
          layerName: "SelectGraphicLayer",
          isZoom: true,
          isHiglightSymbol: true,
          highlighColor: [0, 0, 0, 0.25],
        });
        scope.setState({ city_name: scope.pol?.attributes?.CITY_NAME_A || "" });
      },
    });

    getParcels(
      scope,
      scope.state.MunicipalityNames?.filter((m) => m?.code == e)?.[0],
      `MUNICIPALITY_NAME='${e}'`,
      { returnDistinctValues: true },
      ["PLAN_SPATIAL_ID", "PLAN_NO"]
    ).then((features) => {
      scope.setState({
        //parcelSearch: null,
        // parcelNum: features.map((e, i) => {
        //   return {
        //     ...e,
        //     i,
        //   };
        // }),
        PlanNum: features
          .filter((r) => r.attributes.PLAN_SPATIAL_ID && r.attributes.PLAN_NO)
          .map((e, i) => {
            return {
              attributes: {
                PLAN_SPATIAL_ID: e.attributes.PLAN_SPATIAL_ID,
                PLAN_NO: e.attributes.PLAN_NO,
              },
              i: i,
            };
          }),
      });
    });

    if (scope.resetGraphics) {
      scope.resetGraphics();
    }
  } else {
    queryTask({
      ...querySetting(
        scope.LayerID.Municipality_Boundary,
        `MUNICIPALITY_NAME='${e}'`,
        true,
        ["*"],
        window.filterUrl
      ),
      callbackResult: (res) => {
        scope.pol = res.features[0];
        scope.planId = null;
        if (e) {
          getParcels(
            scope,
            scope.state.MunicipalityNames?.filter((m) => m?.code == e)?.[0],
            `MUNICIPALITY_NAME='${e}'`,
            { returnDistinctValues: true },
            ["PLAN_SPATIAL_ID", "PLAN_NO"]
          ).then((features) => {
            scope.setState(
              {
                // parcelSearch: null,
                // parcelNum: features.map((e, i) => {
                //   return {
                //     ...e,
                //     i,
                //   };
                // }),
                PlanNum: features
                  .filter(
                    (r) => r.attributes.PLAN_SPATIAL_ID && r.attributes.PLAN_NO
                  )
                  .map((e, i) => {
                    return {
                      attributes: {
                        PLAN_SPATIAL_ID: e.attributes.PLAN_SPATIAL_ID,
                        PLAN_NO: e.attributes.PLAN_NO,
                      },
                      i: i,
                    };
                  }),
              },
              callback
            );
          });
        } else {
          if (callback && typeof callback == "function") {
            callback();
          }
        }
      },
    });
  }
};

export const onPlaneChange = (scope, f, callback) => {
  var planSpatialId = scope.state.PlanNum.filter(
    (m) =>
      (m.attributes?.PLAN_SPATIAL_ID && m.i == f) || m.attributes.PLAN_NO == f
  )?.[0]?.attributes?.PLAN_SPATIAL_ID;

  scope.planId = planSpatialId;
  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    clearGraphicFromLayer(scope.map, "SelectLandsGraphicLayer");
    clearGraphicFromLayer(scope.map, "SelectGraphicLayer");
    scope.setState({
      plan_no: scope.state.PlanNum.filter(
        (m) =>
          (m.attributes?.PLAN_SPATIAL_ID && m.i == f) ||
          m.attributes.PLAN_NO == f
      )?.[0]?.attributes?.PLAN_NO,
      planeval: f,
      subTypeval: undefined,
      subNameval: undefined,
      blockval: undefined,
      parcelval: undefined,
      blockNum: [],
      subDivNames: [],
      // subDivType: [],
      parcelId: null,
      parcelNum: [],
      parcelData: scope.state.parcelData || {},
      // selectedLands: [],
      // selectedLandsT: [],
    });
    queryTask({
      ...querySetting(
        scope.LayerID.Plan_Data,
        `PLAN_SPATIAL_ID='${planSpatialId}'`,
        true,
        ["MUNICIPALITY_NAME"],
        window.filterUrl
      ),
      returnGeometry: true,
      callbackResult: (res) => {
        scope.pol = res.features[0];
        highlightFeature(res.features[0], scope.map, {
          layerName: "SelectGraphicLayer",
          isZoom: true,
          isHiglightSymbol: true,
          highlighColor: [0, 0, 0, 0.25],
        });
      },
    });

    getParcels(
      scope,
      scope.state.PlanNum.filter(
        (m) =>
          (m.attributes?.PLAN_SPATIAL_ID && m.i == f) ||
          m.attributes.PLAN_NO == f
      )?.[0],
      `PLAN_SPATIAL_ID='${planSpatialId}'`
    ).then((features) => {
      scope.setState({
        parcelSearch: null,
        parcelNum: features.map((e, i) => {
          return {
            ...e,
            i,
          };
        }),
      });
    });

    getParcels(
      scope,
      scope.state.PlanNum.filter(
        (m) =>
          (m.attributes?.PLAN_SPATIAL_ID && m.i == f) ||
          m.attributes.PLAN_NO == f
      )?.[0],
      `PLAN_SPATIAL_ID='${planSpatialId}'`,
      { returnDistinctValues: true },
      ["PARCEL_BLOCK_NO", "BLOCK_SPATIAL_ID"]
    ).then((features) => {
      scope.setState({
        blockNum: features
          .filter(
            (r) => r.attributes.BLOCK_SPATIAL_ID && r.attributes.PARCEL_BLOCK_NO
          )
          .map((e, i) => {
            return {
              attributes: {
                BLOCK_NO: e.attributes.PARCEL_BLOCK_NO,
                BLOCK_SPATIAL_ID: e.attributes.BLOCK_SPATIAL_ID,
              },
              i: i,
            };
          }),
      });
    });

    esriRequest(
      (window.filterUrl || mapUrl) + "/" + scope.LayerID.Subdivision
    ).then((response) => {
      scope.setState({ subDivType: response.fields[7].domain.codedValues });
    });

    if (scope.resetGraphics) {
      scope.resetGraphics();
    }
  } else {
    scope.pol = scope.state.PlanNum.filter(
      (m) =>
        (m.attributes?.PLAN_SPATIAL_ID && m.i == f) || m.attributes.PLAN_NO == f
    )?.[0];

    if (f) {
      // getParcels(
      //   scope,
      //   scope.state.PlanNum.filter(
      //     (m) =>
      //       (m.attributes?.PLAN_SPATIAL_ID && m.i == f) ||
      //       m.attributes.PLAN_NO == f
      //   )?.[0],
      //   `PLAN_SPATIAL_ID='${planSpatialId}'`
      // ).then((features) => {
      //   scope.setState({
      //     parcelSearch: null,
      //     parcelNum: features.map((e, i) => {
      //       return {
      //         ...e,
      //         i,
      //       };
      //     }),
      //   });
      // });

      getParcels(
        scope,
        scope.state.PlanNum.filter(
          (m) =>
            (m.attributes?.PLAN_SPATIAL_ID && m.i == f) ||
            m.attributes.PLAN_NO == f
        )?.[0],
        `PLAN_SPATIAL_ID='${planSpatialId}'`,
        { returnDistinctValues: true },
        ["PARCEL_BLOCK_NO", "BLOCK_SPATIAL_ID"]
      ).then((features) => {
        scope.setState(
          {
            blockNum: features
              .filter(
                (r) =>
                  r.attributes.BLOCK_SPATIAL_ID && r.attributes.PARCEL_BLOCK_NO
              )
              .map((e, i) => {
                return {
                  attributes: {
                    BLOCK_NO: e.attributes.PARCEL_BLOCK_NO,
                    BLOCK_SPATIAL_ID: e.attributes.BLOCK_SPATIAL_ID,
                  },
                  i: i,
                };
              }),
          },
          callback
        );
      });
    } else {
      if (callback && typeof callback == "function") {
        callback();
      }
    }
  }
};
export const onSubTypeChange = (scope, e, callback) => {
  //scope.onPlaneChange(scope.state.planeval);
  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    scope.setState({
      subType_name: scope.state.subDivType.filter((m) => m.code == e)?.[0]
        ?.name,
      subTypeval: e,
    });
    queryTask({
      ...querySetting(
        scope.LayerID.Subdivision,
        `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${scope.planId}`,
        false,
        ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"],
        window.filterUrl
      ),
      returnGeometry: true,
      callbackResult: (res) => {
        scope.setState({ subDivNames: res.features });
      },
    });
  } else {
    if (e) {
      queryTask({
        ...querySetting(
          scope.LayerID.Subdivision,
          `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${scope.planId}`,
          false,
          ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"],
          window.filterUrl
        ),
        returnGeometry: true,
        callbackResult: (res) => {
          scope.setState({ subDivNames: res.features }, callback);
        },
      });
    } else {
      if (callback && typeof callback == "function") {
        callback();
      }
    }
  }

  // if (callback && typeof callback == "function") {
  //   callback();
  // }
  // scope.onSubNameChange(scope.state.subNameval);
  // scope.DrawGraph();
};

export const onSubNameChange = (scope, value, callback) => {
  var selectedSubDivName = scope.state.subDivNames.filter(
    (m) =>
      m.attributes.SUBDIVISION_SPATIAL_ID == value ||
      m.attributes.SUBDIVISION_DESCRIPTION == value
  )?.[0];
  //if (selectedSubDivName) {
  var e = selectedSubDivName?.attributes?.SUBDIVISION_SPATIAL_ID;
  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    clearGraphicFromLayer(scope.map, "SelectLandsGraphicLayer");
    scope.setState({
      subName_name: selectedSubDivName?.attributes?.SUBDIVISION_DESCRIPTION,
      subNameval: e,
      blockval: undefined,
      parcelval: undefined,
      parcelNum: [],
      parcelId: null,
    });
    queryTask({
      ...querySetting(
        scope.LayerID.Subdivision,
        `SUBDIVISION_SPATIAL_ID=${e}`,
        true,
        ["SUBDIVISION_SPATIAL_ID"],
        window.filterUrl
      ),
      returnGeometry: true,
      callbackResult: (res) => {
        if (res) {
          scope.pol = res.features[0];
          highlightFeature(res.features[0], scope.map, {
            layerName: "SelectGraphicLayer",
            isZoom: true,
            isHiglightSymbol: true,
            highlighColor: [0, 0, 0, 0.25],
          });
        }
      },
    });

    getParcels(scope, selectedSubDivName, `SUBDIVISION_SPATIAL_ID=${e}`).then(
      (features) => {
        scope.setState({
          parcelSearch: null,
          parcelNum: features.map((e, i) => {
            return {
              ...e,
              i,
            };
          }),
        });
      }
    );

    if (scope.resetGraphics) {
      scope.resetGraphics();
    }
  } else {
    scope.pol = selectedSubDivName;
    // getParcels(scope, scope.pol, `SUBDIVISION_SPATIAL_ID=${e}`).then(
    //   (features) => {
    //     scope.setState({
    //       parcelSearch: null,
    //       parcelNum: features
    //         .filter((r) => r.attributes.SUBDIVISION_SPATIAL_ID == e)
    //         .map((e, i) => {
    //           return {
    //             ...e,
    //             i,
    //           };
    //         }),
    //     });
    //   }
    // );
    if (callback && typeof callback == "function") {
      callback();
    }
  }
};

export const onBlockChange = (scope, e, callback) => {
  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    clearGraphicFromLayer(scope.map, "SelectLandsGraphicLayer");
    scope.setState({
      block_no: scope.state.blockNum.filter(
        (m) => m.attributes.BLOCK_SPATIAL_ID == e
      )?.[0]?.attributes?.BLOCK_NO,
      blockval: e,
      parcelval: undefined,
      parcelId: null,
      parcelNum: [],
      // selectedLands: [],
      // selectedLandsT: [],
    });
    queryTask({
      ...querySetting(
        scope.LayerID.Survey_Block,
        `BLOCK_SPATIAL_ID=${e}`,
        true,
        ["BLOCK_SPATIAL_ID"],
        window.filterUrl
      ),
      returnGeometry: true,
      callbackResult: (res) => {
        scope.pol = res.features[0];
        highlightFeature(res.features[0], scope.map, {
          layerName: "SelectGraphicLayer",
          isZoom: true,
          isHiglightSymbol: true,
          highlighColor: [0, 0, 0, 0.25],
        });
      },
    });

    getParcels(
      scope,
      scope.state.blockNum.filter(
        (m) => m.attributes.BLOCK_SPATIAL_ID == e
      )?.[0],
      `BLOCK_SPATIAL_ID=${e}`
    ).then((features) => {
      scope.setState({
        parcelSearch: null,
        parcelNum: features.map((e, i) => {
          return {
            ...e,
            i,
          };
        }),
      });
    });
    if (scope.resetGraphics) {
      scope.resetGraphics();
    }
  } else {
    scope.pol = scope.state.blockNum.filter(
      (m) => m.attributes.BLOCK_SPATIAL_ID == e
    )?.[0];
    // getParcels(scope, scope.pol, `BLOCK_SPATIAL_ID=${e}`).then((features) => {
    //   scope.setState({
    //     parcelSearch: null,
    //     parcelNum: features
    //       .filter((r) => r.attributes.BLOCK_SPATIAL_ID == e)
    //       .map((e, i) => {
    //         return {
    //           ...e,
    //           i,
    //         };
    //       }),
    //   });
    // });
    if (callback && typeof callback == "function") {
      callback();
    }
  }
};

export const onLandParcelChange = (scope, f, callback) => {
  scope.RolBackPol = scope.pol;
  scope.RolBackParcelNum = scope.state.parcelNum;
  if (!scope.state.selectedLands.length) {
    var e = scope.state.parcelNum?.filter((m) => m.i === f)?.[0]?.attributes
      ?.PARCEL_SPATIAL_ID;
    if (
      (!callback || (callback && typeof callback == "object")) &&
      !scope.loadLists
    ) {
      scope.setState({ parcelId: e, parcelval: f });
      if (scope.getParcelsWithinBufferedArea) {
        scope
          .getParcelsWithinBufferedArea(
            scope.RolBackPol,
            `PARCEL_SPATIAL_ID='${e}'`
          )
          .then((res) => {
            scope.selectedLandsT = [];
            highlightFeature(res.features[0], scope.map, {
              layerName: "SelectGraphicLayer",
              strokeColor: [0, 0, 0],
              highlightWidth: 3,
              isHighlighPolygonBorder: true,
              isZoom: true,
              zoomFactor: 10,
            });
          });
      } else {
        queryTask({
          ...querySetting(
            scope.LayerID.Landbase_Parcel,
            `PARCEL_SPATIAL_ID='${e}'`,
            true,
            ["PARCEL_SPATIAL_ID"],
            window.filterUrl
          ),
          callbackResult: (res) => {
            scope.selectedLandsT = [];
            highlightFeature(res.features[0], scope.map, {
              layerName: "SelectGraphicLayer",
              strokeColor: [0, 0, 0],
              highlightWidth: 3,
              isHighlighPolygonBorder: true,
              isZoom: true,
              zoomFactor: 25,
            });
          },
        });
      }
    }
  } else {
    // clearGraphicFromLayer(scope.map, "SelectGraphicLayer");
    if (f) {
      var prevParcelId = scope.state.parcelId;
      var g = scope.state.parcelNum.filter((m) => m.i == f)?.[0];
      scope.state["parcelId"] = g?.attributes?.PARCEL_SPATIAL_ID;
      //scope.setState({ parcelId: g.attributes.PARCEL_SPATIAL_ID });

      scope.LandHoverOff(
        scope.map
          .getLayer("SelectGraphicLayer")
          .graphics.find(
            (prevGraphic) =>
              prevGraphic?.attributes?.PARCEL_SPATIAL_ID == prevParcelId
          )
      );

      scope.setState({ parcelval: f });
    }
  }

  if (callback && typeof callback == "function") {
    callback();
  }
};

export const onSearch = async (scope, filterValue, isSearch) => {

  if ((!scope.state.selectedLands.length || isSearch) && filterValue != "") {

    if (scope.searchTimeOut) clearTimeout(scope.searchTimeOut);

    scope.searchTimeOut = setTimeout(async () => {

      let filterQuery = [];
      filterQuery.push(scope.parcelFilterWhere);
      filterQuery.push("PARCEL_PLAN_NO like '" + filterValue + "%'");

      let filterWhere = filterQuery.join(" and ");
      queryTask({
        ...querySetting(scope.LayerID.Landbase_Parcel, filterWhere, false,
          [
            "PARCEL_SPATIAL_ID",
            "PARCEL_PLAN_NO",
            "OBJECTID"
          ],scope.mapUrl),
        returnGeometry: false,
        callbackResult: (res) => {
          res.features = res.features.map((e, i) => {
            return {
              ...e,
              i: uniqid(),
            };
          });
          scope.setState({
            parcelId: null,
            parcelNum: res.features,
          });
        }
      });

    }, 500);
  }
}

export const getParcels = (
  scope,
  featureToBeBuffered,
  where,
  settings = {},
  outFields = ["*"]
) => {
  return new Promise((resolve, reject) => {
    //if (!scope.state.allParcels) {
    scope.parcelFilterWhere = where || '';
    if (scope.getParcelsWithinBufferedArea && featureToBeBuffered) {
      scope
        .getParcelsWithinBufferedArea(
          featureToBeBuffered,
          where,
          false,
          outFields,
          settings
        )
        .then((resps) => {
          resolve(resps.features);
        });
    } else {
      queryTask({
        ...querySetting(
          scope.LayerID.Landbase_Parcel,
          where,
          false,
          [...outFields],
          window.filterUrl
        ),
        callbackResult: (res) => {
          resolve(res.features);
        },
        ...settings,
      });
    }
    // } else {
    //   resolve(scope.state.allParcels);
    // }
  });
};
