import { querySetting } from "../propertyCheckIdentifyComponnent/Helpers";
var uniqid = require("uniqid");
import {
  clearGraphicFromLayer,
  getFeatureDomainName,
  highlightFeature,
  queryTask,
} from "./common_func";
import { esriRequest } from "./esri_request";
var uniqid = require("uniqid");

export const onSearch = async (scope, filterValue) => {
  if (
    !scope.state.serviceData?.find(
      (item) =>
        item.munval?.code == scope.state.munval &&
        item.planeval?.code == scope.state.planeval &&
        item.subNameval?.code == scope.state.subNameval &&
        item.blockval?.code == scope.state.blockval
    )?.selectedLands?.length &&
    filterValue != ""
  ) {
    if (scope.searchTimeOut) clearTimeout(scope.searchTimeOut);
    //if (!scope.state.parcelNum?.length) return;
    scope.searchTimeOut = setTimeout(async () => {
      debugger;
      let filterQuery = [];
      filterQuery.push(scope.parcelFilterWhere);
      filterQuery.push("PARCEL_PLAN_NO like '%" + filterValue + "%'");

      let filterWhere = filterQuery.join(" and ");
      console.log(filterWhere);
      queryTask({
        ...querySetting(
          scope.LayerID.Landbase_Parcel,
          filterWhere,
          false,
          ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"],
          scope.mapUrl
        ),
        returnGeometry: false,
        callbackResult: (res) => {
          res.features = res.features.map((e, i) => {
            return {
              ...e,
              i: e.attributes.PARCEL_SPATIAL_ID,
            };
          });
          scope.setState({
            parcelId: null,
            parcelNum: res.features,
          });
        },
      });
    }, 500);
  }
};

export const getParcels = (
  scope,
  featureToBeBuffered,
  where,
  settings = {},
  outFields = ["*"]
) => {
  return new Promise((resolve, reject) => {
    //if (!scope.state.allParcels) {
    //scope.parcelFilterWhere = where || "";
    if (scope.getParcelsWithinBufferedArea && featureToBeBuffered) {
      scope
        .getParcelsWithinBufferedArea(
          featureToBeBuffered,
          where,
          false,
          [...outFields],
          settings
        )
        .then((resps) => {
          resolve(resps.features);
        });
    } else {
      queryTask({
        ...querySetting(
          scope.LayerID.UnplannedParcels || scope.LayerID.Landbase_Parcel,
          where,
          false,
          [...outFields],
          (scope.LayerID.UnplannedParcels && window.propetryCheckMapUrl) ||
            mapUrl
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

export const onDistrictChange = (scope, e, callback) => {
  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    clearGraphicFromLayer(scope.map, "SelectLandsGraphicLayer");
    clearGraphicFromLayer(scope.map, "ParcelPlanNoGraphicLayer");

    const {
      values,
      currentModule: { id },
    } = scope.props;

    scope.setState({
      districtval: e,
      parcelval: undefined,
      parcelId: null,
      parcelNum: [],
      parcelData: scope.parcelData,
      plan_no: undefined,
    });

    queryTask({
      url:
        ((scope.LayerID.UnplannedParcels && window.propetryCheckMapUrl) ||
          mapUrl) +
        "/" +
        scope.LayerID.District_Boundary,
      where: `DISTRICT_NAME ='${e}'`,
      outFields: ["DISTRICT_NAME"],
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

    scope.getServiceParcels(scope.state.munval, e, null, null);
  } else {
    if (e) {
      scope.pol = scope.state.Districts.filter((r) => r.code == e)?.[0];
      scope.getServiceParcels(scope.state.munval, e, null, null);
    } else {
      if (callback && typeof callback == "function") {
        callback();
      }
    }
  }
};

export const onMunChange = (scope, e, callback) => {
  let serviceDataItem = scope.state.serviceData?.find(
    (item) =>
      item.munval?.code == e &&
      item.planeval?.code == undefined &&
      item.subNameval?.code == undefined &&
      item.blockval?.code == undefined
  );
  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    clearGraphicFromLayer(scope.map, "SelectLandsGraphicLayer");
    clearGraphicFromLayer(scope.map, "ParcelPlanNoGraphicLayer");
    const {
      values,
      currentModule: { id },
    } = scope.props;
    scope.setState({
      munval: e,
      districtval: undefined,
      planeval: undefined,
      parcelval: undefined,
      parcelId: null,
      parcelNum: [],
      parcelData: scope.parcelData,
      plan_no: undefined,
    });
    scope.planId = null;

    queryTask({
      url:
        ((scope.LayerID.UnplannedParcels && window.propetryCheckMapUrl) ||
          mapUrl) +
        "/" +
        scope.LayerID.Municipality_Boundary,
      where: `MUNICIPALITY_NAME='${e}'`,
      outFields: ["MUNICIPALITY_NAME"],
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
    if (scope.props.currentModule.record.app_id == 27) {
      GetDistrictByMunID(scope, e, () => {});
    } else {
      GetPlansByMunID(scope, e, () => {});
    }
    scope.getServiceParcels(e, null, null, null);
  } else {
    debugger;
    scope.pol = scope.state.MunicipalityNames.filter((m) => m.code == e)?.[0];
    // queryTask({
    //   url:
    //     ((scope.LayerID.UnplannedParcels && window.propetryCheckMapUrl) ||
    //       mapUrl) +
    //     "/" +
    //     scope.LayerID.Municipality_Boundary,
    //   where: `MUNICIPALITY_NAME='${e}'`,
    //   outFields: ["MUNICIPALITY_NAME"],
    //   returnGeometry: true,
    //   callbackResult: (res) => {
    //     scope.pol = res.features[0];
    if (e) {
      if (scope.props.currentModule.record.app_id == 27) {
        GetDistrictByMunID(scope, e, callback);
      } else {
        GetPlansByMunID(scope, e, callback);
      }
      // if (
      //   !serviceDataItem?.selectedLands?.length &&
      //   scope.state.munval &&
      //   !scope.state.planeval &&
      //   !scope.state.subNameval &&
      //   !scope.state.blockval
      // ) {
      //   highlightFeature(scope.pol, scope.map, {
      //     layerName: "SelectGraphicLayer",
      //     isZoom: true,
      //     isHiglightSymbol: true,
      //     highlighColor: [0, 0, 0, 0.25],
      //   });
      //   //scope.getServiceParcels(e, null, null, null);
      // }
    } else {
      if (callback && typeof callback == "function") {
        callback();
      }
    }
    //   },
    // });
  }
};

export const GetDistrictByMunID = (scope, e, callback) => {
  getParcels(
    scope,
    scope.state.MunicipalityNames?.filter((m) => m?.code == e)?.[0],
    `MUNICIPALITY_NAME='${e}'`,
    { returnDistinctValues: true },
    ["DISTRICT_NAME"]
  ).then((features) => {
    getFeatureDomainName(
      features,
      scope.LayerID.UnplannedParcels || scope.LayerID.Landbase_Parcel,
      false,
      (scope.LayerID.UnplannedParcels && window.propetryCheckMapUrl) || mapUrl
    ).then((res) => {
      scope.setState(
        {
          Districts: res.map((r) => {
            return {
              code: r.attributes.DISTRICT_NAME_Code,
              name: r.attributes.DISTRICT_NAME,
            };
          }),
        },
        callback
      );
    });
  });
};

export const GetPlansByMunID = (scope, e, callback) => {
  getParcels(
    scope,
    scope.state.MunicipalityNames?.filter((m) => m?.code == e)?.[0],
    `MUNICIPALITY_NAME='${e}'`,
    { returnDistinctValues: true },
    ["PLAN_SPATIAL_ID", "PLAN_NO"]
  ).then((features) => {
    scope.setState(
      {
        PlanNum: features
          .filter((r) => r.attributes.PLAN_SPATIAL_ID && r.attributes.PLAN_NO)
          .map((e, i) => {
            return {
              ...e,
              i: e.attributes.PLAN_SPATIAL_ID,
            };
          }),
      },
      callback
    );
  });
};
export const onPlaneChange = (scope, f, callback) => {
  var planSpatialId = scope.state.PlanNum.filter((m) => m.i == f)?.[0]
    ?.attributes?.PLAN_SPATIAL_ID;
  let serviceDataItem = scope.state.serviceData?.find(
    (item) =>
      item.munval?.code == scope.state.munval &&
      item.planeval?.code == f &&
      item.subNameval?.code == undefined &&
      item.blockval?.code == undefined
  );
  debugger;
  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    clearGraphicFromLayer(scope.map, "SelectLandsGraphicLayer");
    clearGraphicFromLayer(scope.map, "ParcelPlanNoGraphicLayer");

    // if (
    //   scope.state.serviceData.length &&
    //   !scope.state.serviceData?.find(
    //     (item) =>
    //       item.munval?.code == scope.state.munval && item.planeval?.code == f
    //   )
    // ) {
    //   window.notifySystem("warning", "يجب اختيار مخطط واحد فقط");
    //   return;
    // }

    const {
      values,
      currentModule: { id },
    } = scope.props;

    scope.setState({
      plan_no: scope.state.PlanNum.filter((m) => m.i == f)?.[0]?.attributes
        ?.PLAN_NO,
      planeval: f,
      subTypeval: undefined,
      subType_name: undefined,
      subNameval: undefined,
      subName_name: undefined,
      blockval: undefined,
      block_no: undefined,
      parcelval: undefined,
      blockNum: [],
      subDivNames: [],
      subDivType: [],
      parcelId: null,
      parcelNum: [],
      parcelData: scope.parcelData,
    });

    queryTask({
      ...querySetting(
        scope.LayerID.Plan_Data,
        `PLAN_SPATIAL_ID='${planSpatialId}'`,
        true,
        ["MUNICIPALITY_NAME"]
      ),
      callbackResult: (res) => {
        scope.pol = res.features[0];
        highlightFeature(res.features[0], scope.map, {
          layerName: "SelectGraphicLayer",
          isZoom: true,
          isHiglightSymbol: true,
          highlighColor: [0, 0, 0, 0.25],
        });
        scope.planId = planSpatialId;
      },
    });

    GetBlocksByPlanID(scope, f, planSpatialId, callback);
    scope.getServiceParcels(scope.state.munval, f, null, null);
    esriRequest(
      ((scope.LayerID.UnplannedParcels && window.propetryCheckMapUrl) ||
        mapUrl) +
        "/" +
        scope.LayerID.Subdivision
    ).then((response) => {
      scope.setState({ subDivType: response.fields[7].domain.codedValues });
    });
    if (scope.checkDrawAvailability) {
      scope.checkDrawAvailability();
    }
  } else {
    scope.pol = scope.state.PlanNum.filter(
      (m) =>
        (m.attributes?.PLAN_SPATIAL_ID && m.i == f) || m.attributes.PLAN_NO == f
    )?.[0];

    if (f) {
      GetBlocksByPlanID(scope, f, planSpatialId, callback);
      // if (
      //   !serviceDataItem?.selectedLands?.length &&
      //   scope.state.munval &&
      //   scope.state.planeval &&
      //   !scope.state.subNameval &&
      //   !scope.state.blockval
      // ) {
      //   highlightFeature(scope.pol, scope.map, {
      //     layerName: "SelectGraphicLayer",
      //     isZoom: true,
      //     isHiglightSymbol: true,
      //     highlighColor: [0, 0, 0, 0.25],
      //   });
      //   // scope.getServiceParcels(scope.state.munval, f, null, null);
      // }
      esriRequest(
        ((scope.LayerID.UnplannedParcels && window.propetryCheckMapUrl) ||
          mapUrl) +
          "/" +
          scope.LayerID.Subdivision
      ).then((response) => {
        scope.setState({ subDivType: response.fields[7].domain.codedValues });
      });
      if (scope.checkDrawAvailability) {
        scope.checkDrawAvailability();
      }
    } else {
      if (callback && typeof callback == "function") {
        callback();
      }
    }
  }
};

export const GetBlocksByPlanID = (scope, f, planSpatialId, callback) => {
  getParcels(
    scope,
    scope.state.PlanNum.filter(
      (m) =>
        (m.attributes?.PLAN_SPATIAL_ID && m.i == f) || m.attributes.PLAN_NO == f
    )?.[0],
    `PLAN_SPATIAL_ID='${planSpatialId}' AND PARCEL_BLOCK_NO IS NOT NULL AND LOWER(PARCEL_BLOCK_NO) <> 'null'`,
    { returnDistinctValues: true },
    ["PARCEL_BLOCK_NO", "BLOCK_SPATIAL_ID"]
  ).then((features) => {
    scope.setState(
      {
        blockNum: features
          .filter(
            (r) => r.attributes.BLOCK_SPATIAL_ID && r.attributes.PARCEL_BLOCK_NO
          )
          .map((e, i) => {
            return {
              attributes: {
                BLOCK_NO: e.attributes.PARCEL_BLOCK_NO, //e.attributes.BLOCK_SPATIAL_ID,   ||
                BLOCK_SPATIAL_ID: e.attributes.BLOCK_SPATIAL_ID,
              },
              i: e.attributes.BLOCK_SPATIAL_ID,
            };
          }),
      },
      callback
    );
  });
};
export const onSubTypeChange = (scope, e, callback) => {
  let serviceDataItem = scope.state.serviceData?.find(
    (item) =>
      item.munval?.code == scope.state.munval &&
      item.planeval?.code == scope.state.planeval &&
      item.subTypeval?.code == e &&
      item.blockval?.code == undefined
  );
  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    clearGraphicFromLayer(scope.map, "SelectLandsGraphicLayer");
    clearGraphicFromLayer(scope.map, "ParcelPlanNoGraphicLayer");

    scope.setState({
      subType_name: scope.state.subDivType.filter((m) => m?.code == e)[0].name,
      subTypeval: e,
      subNameval: undefined,
      subName_name: undefined,
      blockval: undefined,
      block_no: undefined,
      parcelval: undefined,
    });
    getSubNamesBySubType(scope, e, callback);
  } else {
    if (e) {
      getSubNamesBySubType(scope, e, callback); // callback
    } else {
      if (callback && typeof callback == "function") {
        callback();
      }
    }
  }
};

export const getSubNamesBySubType = (scope, e, callback) => {
  getParcels(
    scope,
    scope.state.subDivType?.filter((m) => m?.code == e)?.[0],
    `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${scope.planId}`,
    { returnDistinctValues: true },
    ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"]
  ).then((features) => {
    scope.setState(
      {
        subDivNames: features
          .filter(
            (r) =>
              r.attributes.SUBDIVISION_SPATIAL_ID != null &&
              r.attributes.SUBDIVISION_DESCRIPTION != null
          )
          .reduce((a, b) => {
            if (
              !a.find(
                (r) =>
                  r.attributes.SUBDIVISION_SPATIAL_ID ==
                  b.attributes.SUBDIVISION_SPATIAL_ID
              )
            ) {
              a.push(b);
            }
            return a;
          }, [])
          .map((e, i) => {
            return {
              attributes: {
                SUBDIVISION_SPATIAL_ID: e.attributes.SUBDIVISION_SPATIAL_ID, //  e.attributes.PARCEL_BLOCK_NO ||
                SUBDIVISION_DESCRIPTION: e.attributes.SUBDIVISION_DESCRIPTION,
              },
              i: e.attributes.SUBDIVISION_SPATIAL_ID,
            };
          }),
      },
      callback
    );
    //scope.setState({ subDivNames: features }, callback);
  });
};

export const onSubNameChange = (scope, e, callback) => {
  let subName = scope.state.subDivNames.filter(
    (m) => m.attributes.SUBDIVISION_SPATIAL_ID == e || m.i == e
  )?.[0];
  let serviceDataItem = scope.state.serviceData?.find(
    (item) =>
      item.munval?.code == scope.state.munval &&
      item.planeval?.code == scope.state.planeval &&
      item.subNameval?.code == subName?.attributes?.SUBDIVISION_SPATIAL_ID &&
      item.blockval?.code == undefined
  );

  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    clearGraphicFromLayer(scope.map, "SelectLandsGraphicLayer");
    clearGraphicFromLayer(scope.map, "ParcelPlanNoGraphicLayer");
    const {
      values,
      currentModule: { id },
    } = scope.props;
    scope.setState({
      subName_name: subName?.attributes?.SUBDIVISION_DESCRIPTION,
      subNameval: subName?.attributes?.SUBDIVISION_SPATIAL_ID,
      blockval: undefined,
      block_no: undefined,
      parcelval: undefined,
      parcelNum: [],
      parcelId: null,
    });

    queryTask({
      ...querySetting(
        scope.LayerID.Subdivision,
        `SUBDIVISION_SPATIAL_ID=${subName?.attributes?.SUBDIVISION_SPATIAL_ID}`,
        true,
        ["SUBDIVISION_SPATIAL_ID"]
      ),
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
    scope.getServiceParcels(
      scope.state.munval,
      scope.state.districtval || scope.state.planeval,
      subName?.attributes?.SUBDIVISION_SPATIAL_ID,
      null
    );
  } else {
    scope.pol = subName;
    // if (
    //   !serviceDataItem?.selectedLands?.length &&
    //   scope.state.munval &&
    //   scope.state.planeval &&
    //   scope.state.subNameval &&
    //   !scope.state.blockval
    // ) {
    //   highlightFeature(scope.pol, scope.map, {
    //     layerName: "SelectGraphicLayer",
    //     isZoom: true,
    //     isHiglightSymbol: true,
    //     highlighColor: [0, 0, 0, 0.25],
    //   });
    // scope.getServiceParcels(
    //   scope.state.munval,
    //   scope.state.districtval || scope.state.planeval,
    //   subName?.attributes?.SUBDIVISION_SPATIAL_ID,
    //   null
    // );
    //}
    if (callback && typeof callback == "function") {
      callback();
    }
  }
};

export const onBlockChange = (scope, e, callback) => {
  let blockObj = scope.state.blockNum.filter(
    (m) => m.attributes.BLOCK_SPATIAL_ID == e || m.i == e
  )?.[0];
  let serviceDataItem = scope.state.serviceData?.find(
    (item) =>
      item.munval?.code == scope.state.munval &&
      item.planeval?.code == scope.state.planeval &&
      item.subNameval?.code == scope.state.subNameval &&
      item.blockval?.code == blockObj?.attributes?.BLOCK_SPATIAL_ID
  );
  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    clearGraphicFromLayer(scope.map, "SelectLandsGraphicLayer");
    clearGraphicFromLayer(scope.map, "ParcelPlanNoGraphicLayer");

    const {
      values,
      currentModule: { id },
    } = scope.props;

    scope.setState({
      block_no: blockObj?.attributes?.BLOCK_NO,
      blockval: blockObj?.attributes?.BLOCK_SPATIAL_ID,
      parcelval: undefined,
      parcelId: null,
      parcelNum: [],
    });

    queryTask({
      ...querySetting(
        scope.LayerID.Survey_Block,
        `BLOCK_SPATIAL_ID=${blockObj?.attributes?.BLOCK_SPATIAL_ID}`,
        true,
        ["BLOCK_SPATIAL_ID"]
      ),
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

    scope.getServiceParcels(
      scope.state.munval,
      scope.state.districtval || scope.state.planeval,
      null,
      blockObj?.attributes?.BLOCK_SPATIAL_ID
    );
  } else {
    scope.pol = blockObj;
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
    // if (
    //   !serviceDataItem?.selectedLands?.length &&
    //   scope.state.munval &&
    //   scope.state.planeval &&
    //   !scope.state.subNameval &&
    //   scope.state.blockval
    // ) {
    //   highlightFeature(scope.pol, scope.map, {
    //     layerName: "SelectGraphicLayer",
    //     isZoom: true,
    //     isHiglightSymbol: true,
    //     highlighColor: [0, 0, 0, 0.25],
    //   });
    // scope.getServiceParcels(
    //   scope.state.munval,
    //   scope.state.districtval || scope.state.planeval,
    //   null,
    //   blockObj?.attributes?.BLOCK_SPATIAL_ID
    // );
    // }
    if (callback && typeof callback == "function") {
      callback();
    }
  }
};

export const onLandParcelChange = (scope, f, callback) => {
  //;
  let serviceDataItem = scope.state.serviceData?.find(
    (item) =>
      item.munval?.code == scope.state.munval &&
      item.planeval?.code == scope.state.planeval &&
      item.subNameval?.code == scope.state.subNameval &&
      item.blockval?.code == scope.state.blockval
  );
  let selectedLands = serviceDataItem?.selectedLands || [];

  var e = serviceDataItem?.parcelNum?.filter((m) => m.i === f)?.[0]?.attributes
    ?.PARCEL_SPATIAL_ID;
  if (!e) {
    e = scope.state.parcelNum?.filter((m) => m.i === f)?.[0]?.attributes
      ?.PARCEL_SPATIAL_ID;
    scope.RolBackParcelNum = scope.state.parcelNum || [];
  } else {
    scope.RolBackParcelNum = serviceDataItem?.parcelNum;
  }

  var s = serviceDataItem?.parcelNum?.filter((m) => m.i === f)?.[0]?.attributes
    ?.SUBMISSIONNO;

  if (!s) {
    s = scope.state.parcelNum?.filter((m) => m.i === f)?.[0]?.attributes
      ?.PARCEL_SPATIAL_ID;
  }

  if (
    (!callback || (callback && typeof callback == "object")) &&
    !scope.loadLists
  ) {
    scope.setState({
      parcelId: e,
      parcelval: f,
      SUBMISSIONNO: s,
    });
    scope.RolBackPol = scope.pol;

    if (e) {
      queryTask({
        url:
          ((scope.LayerID.UnplannedParcels && window.propetryCheckMapUrl) ||
            mapUrl) +
          "/" +
          (scope.LayerID.UnplannedParcels || scope.LayerID.Landbase_Parcel),
        where: `PARCEL_SPATIAL_ID='${e}'`,
        outFields: ["PARCEL_SPATIAL_ID"],
        returnGeometry: true,
        callbackResult: (res) => {
          if (serviceDataItem && !selectedLands.length) {
            serviceDataItem.selectedLandsT = [];
          }
          highlightFeature(res.features[0], scope.map, {
            layerName: "SelectGraphicLayer",
            strokeColor: [0, 0, 0],
            highlightWidth: 3,
            isHighlighPolygonBorder: true,
            isZoom: true,
            zoomFactor: 50,
          });
        },
      });
    }
  } else {
    // clearGraphicFromLayer(scope.map, "SelectGraphicLayer");
    if (f) {
      var prevParcelId = scope.state.parcelId;
      var g = serviceDataItem?.parcelNum?.filter((m) => m.i === f)?.[0];

      if (!g) {
        g = scope.state.parcelNum?.filter((m) => m.i === f)?.[0];
      }
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
