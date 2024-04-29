import { fetchData } from "../../../../../../../helpers/apiMethods";
import {
  GetSpatialId,
  HasArabicCharacters,
  IdentifyTask,
  addGraphicToLayer,
  addParcelNo,
  checkOverlappingFeaturesWithLayer,
  checkParcelAdjacents,
  clearGraphicFromLayer,
  computeAngle,
  computeLineAngle,
  computePointDirection,
  convertToArabic,
  getColorFromCadIndex,
  getCornerIconPosition,
  getCornersIndex,
  getInfo,
  getLengthOffset,
  getLineLength,
  getPacrelNoAngle,
  getPolygons,
  intersectQueryTask,
  isPointOrArc,
  project,
  redrawNames,
  resizeMap,
  reverse,
  setParcelName,
  sortPolygonLines,
  zoomToLayer,
} from "../../common/common_func";

Array.prototype.sum = function (prop) {
  if (!this) return;
  var total = 0;
  for (var y = 0, _len = this.length; y < _len; y++) {
    prop = prop.replace(/\[(\w+)\]/g, ".$1");
    prop = prop.replace(/^\./, "");
    var a = prop.split(".");
    var data = JSON.parse(JSON.stringify(this[y]));

    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in data) {
        data = data[k];
      } else {
        return 0;
      }
    }

    total += data;
  }
  return total;
};

export class CADEntity {
  constructor(props, cad) {
    // cadResults, polygons, survayParcelCutter, planDescription, isUpdateContract, isKrokyUpdateContract, isPlan, notify, hideDrag, have_electric_room, electric_room_area, electric_room_place, mun, isWithinUrbanBoundry, pointsLength, isConfirmed, activeKey
    let _props = props;
    this.cadResults = cad?.cadResults || null;
    this.isUpdateContract = cad?.isUpdateContract || false;
    this.isKrokyUpdateContract = cad?.isKrokyUpdateContract || false;
    this.isPlan = cad?.isPlan || false;
    this.notify = cad?.notify || false;
    this.hasNotify = cad?.notify || false;
    this.hideDrag = cad?.hideDrag || false;
    const {
      mainObject: {
        landData: {
          landData: {
            lands: { temp, parcels },
          },
        },
      },
    } = _props;
    this.neighbors =
      cad?.neighbors ||
      (parcels?.filter(
        (r) =>
          temp?.parcelDis?.find(
            (e) =>
              r?.attributes?.PARCEL_PLAN_NO.indexOf(
                e?.attributes?.PARCEL_PLAN_NO
              ) != -1
          ) != undefined
      ).length &&
        temp?.parcelDis?.filter((f) => {
          return (
            parcels
              .map((r) => r?.attributes?.PARCEL_PLAN_NO)
              .indexOf(f?.attributes?.PARCEL_PLAN_NO) == -1
          );
        })) ||
      [];
    this.zoomRatio =
      [2028, 2029, 2191].indexOf(
        _props?.currentModule?.workflow_id ||
          _props?.currentModule?.record?.workflow_id
      ) != -1 ||
      _props?.currentModule?.app_id == 14 ||
      _props?.currentModule?.record?.app_id == 14
        ? 50
        : 25;

    this.reqType =
      ([1949, 2048].indexOf(_props.currentModule.record.workflow_id) != -1 &&
        "duplex") ||
      "";

    this.have_electric_room = cad?.have_electric_room || false;
    this.electric_room_area = cad?.electric_room_area || 0;
    this.electric_room_place = cad?.electric_room_place || 0;
    this.mun = cad?.mun || {};
    this.isWithinUrbanBoundry = cad?.isWithinUrbanBoundry || [];
    this.planDescription = cad?.planDescription || "";
    this.polygons = cad?.polygons || [];
    this.pointsLength = cad?.pointsLength || [];
    this.isConfirmed = cad?.hasNotify ? false : true;
    this.survayParcelCutter = cad?.survayParcelCutter || [
      {
        direction: "الشطفة",
        NORTH_EAST_DIRECTION: "",
        NORTH_WEST_DIRECTION: "",
        SOUTH_EAST_DIRECTION: "",
        SOUTH_WEST_DIRECTION: "",
      },
    ];
    this.activeKey = cad?.activeKey || "1";
    this.layers =
      (cad?.layers?.length && cad?.layers) ||
      _props.values?.mapviewer?.mapGraphics ||
      [];
    this.isBoundry = cad?.isBoundry;

    if (!cad?.muns?.length) {
      fetchData(`${workFlowUrl}/api/Municipality`).then((response) => {
        this.muns = response;
      });
    } else {
      this.muns = cad?.muns;
    }
  }
  neighbors = [];
  muns = [];
  mun = {};
  polygons = [];
  cadResults = null;
  planDescription = "";
  isWithinUrbanBoundry = [];
  isUpdateContract = false;
  isKrokyUpdateContract = false;
  isPlan = false;
  layers = [];
  outRange = false;
  isConfirmed = true;
  hasNotify = false;
  notify = "";
  zoomRatio = 50;
  hideDrag = false;
  reqType = "";
  have_electric_room = false;
  electric_room_area = 0;
  electric_room_place = 0;
  pointsLength = [];
  layerParcels = [];
  survayParcelCutter = [];
  activeKey = 1;
  static annotationLength = 17;
  static lineLengthFont = 25;
  static parcelNumberFont = 25;
  isBoundry = false;

  drawNeighbors = (map) => {
    this.neighbors?.forEach((f) => {
      f.geometry = new esri.geometry.Polygon(f.geometry);
      addParcelNo(
        f.geometry.getExtent().getCenter(),
        map,
        convertToArabic(f.attributes.PARCEL_PLAN_NO) + "",
        "ParcelPlanNoGraphicLayer",
        14,
        [0, 0, 0],
        null,
        null,
        null,
        true,
        (response) => {
          this.#addLayerFeature(map, "ParcelPlanNoGraphicLayer", response);
        }
      );
    });
  };

  clearAllGraphics = (map) => {
    clearGraphicFromLayer(map, "highlightBoundriesGraphicLayer");
    clearGraphicFromLayer(map, "PacrelLenNoGraphicLayer");
    clearGraphicFromLayer(map, "PacrelNoGraphicLayer");
    clearGraphicFromLayer(map, "addedParclGraphicLayer");
    clearGraphicFromLayer(map, "boundriesGraphicLayer");
    clearGraphicFromLayer(map, "boundriesDirection");
    clearGraphicFromLayer(map, "pictureGraphicLayer");
    clearGraphicFromLayer(map, "PacrelUnNamedGraphicLayer");
    clearGraphicFromLayer(map, "detailedGraphicLayer");
    clearGraphicFromLayer(map, "floorGraphicLayer");
  };

  checkFeatureMunicipality = (props, callback) => {
    const {
      mapLayers,
      mainObject: {
        landData: { landData },
      },
    } = props;
    getInfo().then((res) => {
      let LayerID = res;
      intersectQueryTask({
        outFields: ["*"],
        geometry: this.cadResults?.data?.[0]?.shapeFeatures?.[0] || null,
        url: mapUrl + "/" + LayerID?.Municipality_Boundary,
        where: `MUNICIPALITY_NAME = ${
          landData?.municipality_id ||
          landData?.municipality?.code ||
          landData?.lands?.parcels?.[0]?.attributes?.MUNICIPALITY_NAME_Code
        }`,
        preQuery: (query, Query) => {
          query.spatialRelationship = Query.SPATIAL_REL_WITHIN;
        },
        callbackResult: (res) => {
          this.mun = _.find(this.muns.results, function (d) {
            return (
              res?.features &&
              res?.features[0]?.attributes?.MUNICIPALITY_NAME == d?.code
            );
          });
          //this.settoStore(this.polygons);
          callback();
        },
        errorCallbackResult: (res) => {
          this.mun = null;
          callback();
        },
      });
    });
  };

  getPlanDescription = (props, map, callback) => {
    const {
      mapLayers,
      mainObject: {
        landData: { landData },
      },
    } = props;
    let settings = {
      map: map,
      layers: mapLayers,
      tolerance: 1,
      polygonFeature: (
        (!this.cadResults?.data?.length && this.cadResults) ||
        this.cadResults?.data[0]
      )?.shapeFeatures[0],
      identifyResults: (results) => {
        results = _.groupBy(results, "layerName");
        var munLits = [];
        var urbanList = [];
        var submunList = [];

        if (
          (landData?.municipality_id ||
            landData?.municipality?.code ||
            landData?.lands?.parcels?.[0]?.attributes
              ?.MUNICIPALITY_NAME_Code) &&
          results &&
          results["Municipality_Boundary"]
        ) {
          var mun_class = landData?.municipality?.mun_classes?.mun_class;

          results["Municipality_Boundary"].forEach((mun) => {
            submunList.push(
              (mun?.feature?.attributes["تصنيف البلدية"]?.toUpperCase() !=
                "NULL" &&
                mun?.feature?.attributes["تصنيف البلدية"]) ||
                mun_class
            );
          });

          results["Municipality_Boundary"].forEach(
            function (mun) {
              munLits.push(mun.feature.attributes["اسم البلدية"]);
            }.bind(this)
          );
          results["UrbanAreaBoundary"].forEach((urban) => {
            urbanList.push(urban.feature.attributes["نوع النطاق العمرانى"]);
          });

          // this.setState({
          //   planDescription:
          //     "مرحلة التنمية العمرانية ك ( " +
          //     urbanList.join(" , ") +
          //     " ) بمدينة  ( " +
          //     munLits.join(" , ") +
          //     " ) المحددة ( " +
          //     submunList.join(" , ") +
          //     " )",
          // });
          // this.settoStore(this.state.polygons);
          this.planDescription =
            "مرحلة التنمية العمرانية ك ( " +
            urbanList.join(" , ") +
            " ) بمدينة  ( " +
            munLits.join(" , ") +
            " ) المحددة ( " +
            submunList.join(" , ") +
            " )";

          callback();
        }
      },
    };

    IdentifyTask(settings);
  };

  checkRankOfFullboundryFeature = () => {
    var fullBoundryIndex = (
      (!this.cadResults?.data?.length && this.cadResults) ||
      this.cadResults?.data[0]
    )?.shapeFeatures?.findIndex((feature) => feature.isFullBoundry);
    if (fullBoundryIndex > 0) {
      let tempShapeFeature = JSON.parse(
        JSON.stringify(
          (
            (!this.cadResults?.data?.length && this.cadResults) ||
            this.cadResults?.data[0]
          )?.shapeFeatures[fullBoundryIndex]
        )
      );

      (
        (!this.cadResults?.data?.length && this.cadResults) ||
        this.cadResults?.data[0]
      )?.shapeFeatures?.splice(fullBoundryIndex, 1);
      (
        (!this.cadResults?.data?.length && this.cadResults) ||
        this.cadResults?.data[0]
      )?.shapeFeatures?.unshift(tempShapeFeature);

      if (
        (
          (!this.cadResults?.data?.length && this.cadResults) ||
          this.cadResults?.data[0]
        )?.cadFeatures
      ) {
        let tempCADFeature = JSON.parse(
          JSON.stringify(
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.cadFeatures[fullBoundryIndex]
          )
        );
        (
          (!this.cadResults?.data?.length && this.cadResults) ||
          this.cadResults?.data[0]
        )?.cadFeatures?.splice(fullBoundryIndex, 1);
        (
          (!this.cadResults?.data?.length && this.cadResults) ||
          this.cadResults?.data[0]
        )?.cadFeatures?.unshift(tempCADFeature);
      }
    }
  };

  checkCADValidity = (props) => {
    let valid = true;
    var cadResponse = this.cadResults;
    const { t } = props;
    const {
      inputs,
      mainObject: {
        landData: { requestType },
      },
    } = props;
    //
    if (
      cadResponse.length > 1 &&
      (!(
        this.isKrokyUpdateContract ||
        this.isUpdateContract ||
        props.currentModule.record.workflow_id == 2028
      ) ||
        (this.isUpdateContract && requestType == 2))
    ) {
      cadResponse.data = null;
      window.notifySystem("error", t("NOTVALIDCAD"));
      valid = false;
    }

    if (
      this.isKrokyUpdateContract ||
      this.isUpdateContract ||
      props.currentModule.record.workflow_id == 2028
    ) {
      this.isBoundry = _.find(cadResponse?.data[0]?.shapeFeatures, (d) => {
        return d.isFullBoundry;
      });

      if (!this.isBoundry && cadResponse?.data[0]?.shapeFeatures?.length > 1) {
        window.notifySystem("error", t("BOUNDRYNOTFOUND"));
        valid = false;
      }
    }

    return valid;
  };

  convertFeaturesToRealPoints = (features) => {
    return _.chain(features)
      .map((polygon, key) => {
        return polygon.rings[0].map((point) => {
          return new esri.geometry.Point(
            point[0],
            point[1],
            new esri.SpatialReference(polygon.spatialReference)
          );
        });
      })
      .flatten(true)
      .value();
  };

  convertArcFeaturesToRealPoints = (features) => {
    let cadifArcResponsePoints = _.chain(
      (
        (!this.cadResults?.data?.length && this.cadResults) ||
        this.cadResults?.data[0]
      )?.shapeFeatures
    )
      .map((polygon, key) => {
        return polygon.rings[0].map((point) => {
          if (
            isPointOrArc(
              { x: point[0], y: point[1] },
              key,
              (
                (!this.cadResults?.data?.length && this.cadResults) ||
                this.cadResults?.data[0]
              )?.cadFeatures
            )
          ) {
            return new esri.geometry.Point(
              point[0],
              point[1],
              new esri.SpatialReference(polygon.spatialReference)
            );
          } else return null;
        });
      })
      .flatten(true)
      .value();

    return cadifArcResponsePoints.filter((n) => {
      return n != null;
    });
  };

  setFeatureProjection = (features, beforeCallback, afterCallback) => {
    project(
      beforeCallback(features),
      32639,
      (points) => {
        if (points) {
          var plogs = _.chain(JSON.parse(JSON.stringify(features)))
            .map((d) => {
              d.rings[0] = ((Array.isArray(points[0]) && points[0]) || points)
                ?.splice(0, d.rings[0].length)
                ?.map((point) => {
                  return [point.x, point.y];
                });
              return d;
            })
            .value();

          getPolygons(
            JSON.parse(JSON.stringify(features)),
            (polygon_project, esriModules, elem, key) => {
              afterCallback(
                plogs,
                polygon_project,
                esriModules,
                elem,
                key,
                points
              );
            }
          );
        }
      },
      true
    );
  };

  setDetailFeaturesProjection = (props, map, features, InvokedToAdParcel) => {
    var details = [];
    //draw details
    features?.forEach((appart, appartNumber) => {
      var polyline = new esri.geometry.Polyline(appart);
      details.push(polyline);
    });

    var detailsCopy = JSON.parse(JSON.stringify(details));

    if (details && details.length > 0 && InvokedToAdParcel) {
      project(
        details,
        32639,
        (details_Projected) => {
          if (details_Projected) {
            (
              (Array.isArray(details_Projected[0]) && details_Projected[0]) ||
              details_Projected
            ).forEach((parcel, index) => {
              //parcel.spatialReference = new esri.SpatialReference({ wkid: 102100 });

              if (parcel.getExtent()) {
                var pt = parcel.getExtent().getCenter();

                addGraphicToLayer(
                  parcel,
                  map,
                  "detailedGraphicLayer",
                  getColorFromCadIndex(detailsCopy[index].color),
                  null,
                  null,
                  (response) => {
                    let app_id =
                      props?.currentModule?.app_id ||
                      props?.currentModule?.record?.app_id;
                    if (
                      [14, 8].indexOf(app_id) != -1 ||
                      [14, 8].indexOf(app_id) != -1
                    ) {
                      resizeMap(map, (app_id == 8 && 10) || undefined);
                    } else {
                      zoomToLayer("detailedGraphicLayer", map, this.zoomRatio);
                    }

                    this.#addLayerFeature(
                      map,
                      "detailedGraphicLayer",
                      response
                    );
                  }
                );
              }
            });
          }
        },
        true
      );
    }
  };

  setAnnotationFeaturesProjection = (
    props,
    map,
    features,
    InvokedToAdParcel
  ) => {
    var annotations = [];
    features?.forEach((annotation) => {
      var point = new esri.geometry.Point(annotation.shape);
      point.text = annotation.text;
      point.angle = annotation.angle;
      annotations.push(point);
    });

    var annotationsCopy = JSON.parse(JSON.stringify(annotations));

    if (annotations && annotations.length > 0 && InvokedToAdParcel) {
      project(
        annotations,
        32639,
        (annotations_Projected) => {
          if (annotations_Projected) {
            (
              (Array.isArray(annotations_Projected[0]) &&
                annotations_Projected[0]) ||
              annotations_Projected
            ).forEach((annotation, index) => {
              var text = annotationsCopy[index].text;

              if (annotationsCopy[index].text.indexOf("شارع") > -1) {
                var extractNmber = annotationsCopy[index].text.match(/[\d\.]+/);

                if (extractNmber && extractNmber.length > 0) {
                  extractNmber = extractNmber[0];
                  annotationsCopy[index].text = annotationsCopy[
                    index
                  ].text.replace(extractNmber, extractNmber.split("").join(""));
                }
                text = annotationsCopy[index].text;
              }
              if (HasArabicCharacters(annotationsCopy[index].text))
                text = reverse(annotationsCopy[index].text);

              if (annotationsCopy[index].text.indexOf("شارع") > -1) {
                addParcelNo(
                  annotation,
                  map,
                  text,
                  "detailedGraphicLayer",
                  this.annotationLength,
                  getColorFromCadIndex(annotationsCopy[index].color),
                  360 - (annotationsCopy[index].angle || 0),
                  null,
                  null,
                  true,
                  (response) => {
                    this.#addLayerFeature(
                      map,
                      "detailedGraphicLayer",
                      response
                    );
                  }
                );
              } else {
                addParcelNo(
                  annotation,
                  map,
                  text,
                  "detailedGraphicLayer",
                  this.annotationLength,
                  getColorFromCadIndex(annotationsCopy[index].color),
                  360 - (annotationsCopy[index].angle || 0),
                  null,
                  null,
                  null,
                  (response) => {
                    this.#addLayerFeature(
                      map,
                      "detailedGraphicLayer",
                      response
                    );
                  }
                );
              }
            });
          }
        },
        true
      );
    }
  };

  #addLayerFeature = (map, layerName, response) => {
    let maplayerIndex = map.graphicsLayerIds.findIndex((r) => r == layerName);
    let layerIndex = this.layers.findIndex((r) => r.layerName == layerName);
    
    if (layerIndex > -1) {
      let graphicIndex = this.layers[layerIndex].graphics.findIndex((r) => {
        try{
          return (
            (r?.geometry?.x &&
              response?.geometry?.x &&
              r?.geometry?.x == response?.geometry?.x &&
              r?.geometry?.y == response?.geometry?.y) ||
            (r?.geometry?.rings &&
              response?.geometry?.rings &&
              response?.geometry?.rings?.[0]?.filter(
                (t, i) =>
                  t?.[0] == r?.geometry?.rings?.[0]?.[i]?.[0] &&
                  t?.[1] == r?.geometry?.rings?.[0]?.[i]?.[1]
              ).length == r?.geometry?.rings?.[0]?.length) ||
            (r?.geometry?.paths &&
              response?.geometry?.paths &&
              response?.geometry?.paths?.[0]?.filter(
                (t, i) =>
                  t?.[0] == r?.geometry?.paths?.[0]?.[i]?.[0] &&
                  t?.[1] == r?.geometry?.paths?.[0]?.[i]?.[1]
              ).length == r?.geometry?.paths[0]?.length)
          );
        }
        catch (e) {
          
          return false;
        }
        
      });

      if (graphicIndex != -1) {
        this.layers[layerIndex].graphics[graphicIndex] = response.toJson();
      } else {
        this.layers[layerIndex].graphics.push(response.toJson());
      }
    } else {
      this.layers.splice(0, 0, {
        layerIndex: maplayerIndex,
        layerName: layerName,
        graphics: [response.toJson()],
      });
    }
  };

  drawFeatures = (
    props,
    polygon,
    polygon_project,
    key,
    esriModules,
    map,
    points
  ) => {
    var arcLength = 0;
    var arcPoints = [];
    var arcLines = [];
    for (var j = 0, n = polygon.rings[0].length - 1; j < n; j++) {
      var point1 = new esri.geometry.Point(
        polygon.rings[0][j][0],
        polygon.rings[0][j][1]
      );
      var point2 = new esri.geometry.Point(
        polygon.rings[0][j + 1][0],
        polygon.rings[0][j + 1][1]
      );

      var point1_project = new esri.geometry.Point(
        polygon_project.rings[0][j][0],
        polygon_project.rings[0][j][1]
      );
      var point2_project = new esri.geometry.Point(
        polygon_project.rings[0][j + 1][0],
        polygon_project.rings[0][j + 1][1]
      );

      var length = esriModules.mathUtils.getLength(
        point1_project,
        point2_project
      );
      //length = Number(parseFloat(length).toFixed(2));

      if (point1.x > this.polygons[key].max) {
        this.polygons[key].max = point1.x;
        this.polygons[key].maxPoint = point1;
      }

      if (!this.polygons[key].min || point1.x < this.polygons[key].min) {
        this.polygons[key].min = point1.x;
        this.polygons[key].minPoint = point1;
      }

      if (point2.x > this.polygons[key].max) {
        this.polygons[key].max = point2.x;
        this.polygons[key].maxPoint = point2;
      }

      if (!this.polygons[key].min || point2.x < this.polygons[key].min) {
        this.polygons[key].min = point2.x;
        this.polygons[key].minPoint = point2;
      }

      var path = {
        paths: [[polygon.rings[0][j], polygon.rings[0][j + 1]]],
        text: length,
        spatialReference: polygon.spatialReference,
      };

      if (
        !(
          isPointOrArc(
            point1,
            key,
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.cadFeatures
          ) &&
          isPointOrArc(
            point2,
            key,
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.cadFeatures
          )
        )
      ) {
        if (
          isPointOrArc(
            point2,
            key,
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.cadFeatures
          )
        ) {
          arcLength += length;
          arcPoints.push(point1);
          path = new esriModules.Polyline(path);
          path.centroid = path.getExtent().getCenter();
          arcLines.push(new esriModules.Polyline(path));
          path.text = arcLength || length;

          if (
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.boundryFeaturesLen?.length > 0
          ) {
            var line = getLineLength(
              (
                (!this.cadResults?.data?.length && this.cadResults) ||
                this.cadResults?.data[0]
              )?.boundryFeaturesLen,
              arcPoints[0],
              point2,
              (
                (!this.cadResults?.data?.length && this.cadResults) ||
                this.cadResults?.data[0]
              )?.isArc || false
            );
            if (line) path.text = line.length;
          }

          length = path.text;
          path.lines = arcLines;
          arcLines = [];
          arcLength = 0;

          this.polygons[key].data[2].data.push(
            JSON.parse(JSON.stringify(path))
          );
          this.polygons[key].data[2].data[
            this.polygons[key].data[2].data.length - 1
          ].centroid = path.getExtent().getCenter();
        } else {
          arcLength += length;
          arcPoints.push(point1);
          path = new esriModules.Polyline(path);
          var polyline = new esriModules.Polyline(path);
          path.centroid = polyline.getExtent().getCenter();
          arcLines.push(new esriModules.Polyline(path));
          path.hide = true;
        }
      }
      if (
        isPointOrArc(
          point1,
          key,
          (
            (!this.cadResults?.data?.length && this.cadResults) ||
            this.cadResults?.data[0]
          )?.cadFeatures
        ) &&
        isPointOrArc(
          point2,
          key,
          (
            (!this.cadResults?.data?.length && this.cadResults) ||
            this.cadResults?.data[0]
          )?.cadFeatures
        )
      ) {
        if (
          (
            (!this.cadResults?.data?.length && this.cadResults) ||
            this.cadResults?.data[0]
          )?.boundryFeaturesLen?.length > 0
        ) {
          var line = getLineLength(
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.boundryFeaturesLen,
            point1,
            point2,
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.isArc || false
          );
          if (line) path.text = line.length;

          length = path.text;
        }
        this.polygons[key].data[2].data.push(JSON.parse(JSON.stringify(path)));
        this.polygons[key]?.polygon_unprojected?.polylines?.push(path);
      }

      var polyline = new esriModules.Polyline(path);

      if (
        !this.polygons[key].minLineLen ||
        this.polygons[key].minLineLen > length
      )
        this.polygons[key].minLineLen = length;

      var pt = polyline.getExtent().getCenter();

      if (
        !(
          isPointOrArc(
            point1,
            key,
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.cadFeatures
          ) &&
          isPointOrArc(
            point2,
            key,
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.cadFeatures
          )
        )
      ) {
        if (
          isPointOrArc(
            point2,
            key,
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.cadFeatures
          )
        ) {
          if (arcPoints.length)
            pt = arcPoints[Math.floor(arcPoints.length / 2)];
        }
      }

      if (
        isPointOrArc(
          point1,
          key,
          (
            (!this.cadResults?.data?.length && this.cadResults) ||
            this.cadResults?.data[0]
          )?.cadFeatures
        ) &&
        isPointOrArc(
          point2,
          key,
          (
            (!this.cadResults?.data?.length && this.cadResults) ||
            this.cadResults?.data[0]
          )?.cadFeatures
        )
      ) {
        this.polygons[key].data[2].data[
          this.polygons[key].data[2].data.length - 1
        ].centroid = pt;
      }

      addGraphicToLayer(
        polyline,
        map,
        "boundriesGraphicLayer",
        null,
        null,
        null,
        (response) => {
          let app_id =
            props?.currentModule?.app_id ||
            props?.currentModule?.record?.app_id;
          if ([14, 8].indexOf(app_id) != -1 || [14, 8].indexOf(app_id) != -1) {
            resizeMap(map, (app_id == 8 && 10) || undefined);
          } else {
            zoomToLayer("boundriesGraphicLayer", map, this.zoomRatio);
          }

          this.#addLayerFeature(map, "boundriesGraphicLayer", response);
        }
      );

      if (pt.length) {
        pt.x = pt[0];
        pt.y = pt[1];
      }

      var ang;

      if (
        !_.find(
          (
            (!this.cadResults?.data?.length && this.cadResults) ||
            this.cadResults?.data[0]
          )?.shapeFeatures || [],
          (d) => {
            return d.isFullBoundry;
          }
        )
      ) {
        ang = computeLineAngle(
          polygon.rings[0][j],
          polygon.rings[0][j + 1],
          polygon.getExtent().getCenter()
        );
      }

      var attr = {
        text: parseFloat(length.toFixed(2)),
        angle: ang,
      };

      // because there were similarity between points in fraction part 123.4567 , 123.4512
      if (
        !(
          this.pointsLength.indexOf(pt.x.toFixed(4) + "," + pt.y.toFixed(4)) >
            -1 && !polygon_project.isFullBoundry
        )
      ) {
        if (
          isPointOrArc(
            point1,
            key,
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.cadFeatures
          ) &&
          isPointOrArc(
            point2,
            key,
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.cadFeatures
          )
        ) {
          this.pointsLength.push(pt.x.toFixed(4) + "," + pt.y.toFixed(4));

          addParcelNo(
            pt,
            map,
            "" + parseFloat(length.toFixed(2)) + "",
            "editlengthGraphicLayer",
            this.lineLengthFont,
            null,
            ang,
            polygon_project.isFullBoundry
              ? getLengthOffset(pt, this.polygons[key])
              : null,
            attr,
            null,
            (response) => {
              this.#addLayerFeature(map, "editlengthGraphicLayer", response);
            }
          );
        } else if (
          isPointOrArc(
            point2,
            key,
            (
              (!this.cadResults?.data?.length && this.cadResults) ||
              this.cadResults?.data[0]
            )?.cadFeatures
          )
        ) {
          //
          if (arcPoints.length) {
            pt = arcPoints[Math.floor(arcPoints.length / 2)];
            //pt.spatialReference.wkid = 102100;
          }

          addParcelNo(
            pt,
            map,
            "" + parseFloat(length.toFixed(2)) + "",
            "editlengthGraphicLayer",
            this.lineLengthFont,
            null,
            ang,
            polygon_project.isFullBoundry
              ? getLengthOffset(pt, this.polygons[key])
              : null,
            attr,
            null,
            (response) => {
              this.#addLayerFeature(map, "editlengthGraphicLayer", response);
            }
          );
        }
      }

      if (
        isPointOrArc(
          point2,
          key,
          (
            (!this.cadResults?.data?.length && this.cadResults) ||
            this.cadResults?.data[0]
          )?.cadFeatures
        )
      ) {
        points = [];
        arcPoints.forEach((point) => {
          points.push(
            esri.geometry.toScreenPoint(
              map.extent,
              map.width,
              map.height,
              new esri.geometry.Point(
                point[0],
                point[1],
                new esri.SpatialReference({
                  wkid: polygon.spatialReference,
                })
              )
            )
          );
        });
        //
        arcPoints = [];
      }
    }
  };

  populatePolygons = (
    props,
    plogs,
    polygon_project,
    esriModules,
    elem,
    key,
    points,
    InvokedToAdParcel,
    isLoading,
    map,
    callback
  ) => {
    const { t } = props;
    const {
      mapLayers,
      mainObject: {
        landData: { landData },
      },
    } = props;
    var polygon = new esri.geometry.Polygon(plogs[key]);
    //check if in urban area boundry
    var successWithinFun = (res) => {
      if (res.features.length > 0) {
        var cache = [];
        let eliminateCircularRecursive = function (key, value) {
          if (typeof value === "object" && value !== null) {
            if (cache.indexOf(value) !== -1) {
              // Circular reference found, discard key
              return;
            }
            // Store value in our collection
            cache.push(value);
          }
          return value;
        };

        res.features = JSON.parse(
          JSON.stringify(res.features, eliminateCircularRecursive)
        );
        this.isWithinUrbanBoundry = res.features;
      } else {
        this.isWithinUrbanBoundry = [];
        //this.resetStore();
        callback(false);
        window.notifySystem(
          "error",
          t("messages:IS_NOT_WITHIN_URBAN_AREA_BOUNDRY")
        );
        return;
      }

      // store.dispatch({type:'Show_Loading_new',loading: false});
    };

    if (mapLayers?.length) {
      //"Municipality_Boundary"
      let municipality =
        landData?.municipality_id ||
        landData?.municipality?.code ||
        landData?.lands?.parcels?.[0]?.attributes?.MUNICIPALITY_NAME_Code;
      checkOverlappingFeaturesWithLayer(
        window.mapUrl +
          "/" +
          _.find(mapLayers, (layer) => {
            return layer.name.toLowerCase() == "municipality_boundary";
          })?.id,
        polygon,
        "MUNICIPALITY_NAME = " + municipality
      ).then(
        (res) => {
          if (res?.features[0]?.attributes?.MUNICIPALITY_NAME == municipality) {
            checkOverlappingFeaturesWithLayer(
              window.mapUrl +
                "/" +
                _.find(mapLayers, (layer) => {
                  return layer.name.toLowerCase() == "urbanareaboundary";
                })?.id,
              polygon
            ).then(successWithinFun, (res) => {
              this.isWithinUrbanBoundry = [];
              //this.resetMsa7yData();
              //this.resetStore();
              callback(false);
              window.notifySystem(
                "error",
                t("messages:IS_NOT_WITHIN_URBAN_AREA_BOUNDRY"),
                10
              );
            });
          } else {
            //this.resetMsa7yData();
            callback(false);
            window.notifySystem("error", t("خارج نطاق البلدية المختارة"), 10);
          }
        },
        (res) => {
          //this.state.isWithinUrbanBoundry = false;
          //this.resetMsa7yData();
          callback(false);
          window.notifySystem("error", t("خارج نطاق البلدية المختارة"), 10);
        }
      );
    }
    const { input, isView } = props;
    const {
      lands: { parcels },
    } = landData;
    if (InvokedToAdParcel) {
      this.polygons.splice(
        !polygon_project.isFullBoundry ? this.polygons.length : 0,
        0,
        {
          parcel_name: "",
          area: -1,
          data: [
            { name: "north", data: [], totalLength: 0 },
            { name: "east", data: [], totalLength: 0 },
            { name: "main", data: [], totalLength: 0 },
            { name: "west", data: [], totalLength: 0 },
            { name: "south", data: [], totalLength: 0 },
          ],
        }
      );
    }

    var cadResponse = (
      (!this.cadResults?.data?.length && this.cadResults) ||
      this.cadResults?.data[0]
    )?.shapeFeatures;
    let isFullBoundryIndex = JSON.parse(JSON.stringify(cadResponse))?.findIndex(
      (cadParcel) => cadParcel?.isFullBoundry
    );

    var cadOutOfSakBoundriesResponse = (
      (!this.cadResults?.data?.length && this.cadResults) ||
      this.cadResults?.data[0]
    )?.outOfSakBoundries;
    var cadHiddenOfSakBoundriesResponse = (
      (!this.cadResults?.data?.length && this.cadResults) ||
      this.cadResults?.data[0]
    )?.hiddenOfSakBoundries;

    if (polygon_project.isFullBoundry) {
      this.polygons[key].parcel_name = "حدود المعاملة";
      this.polygons[key].isFullBoundry = true;
      this.polygons[key].area =
        !isLoading &&
        +cadResponse.sum("area").toFixed(2) -
          (+cadOutOfSakBoundriesResponse?.sum("area")?.toFixed(2) || 0) -
          (+cadHiddenOfSakBoundriesResponse?.sum("area")?.toFixed(2) || 0);
    } else {
      this.polygons[key].area =
        (!isLoading &&
          ((isFullBoundryIndex == -1 &&
            elem.area -
              (+cadOutOfSakBoundriesResponse?.sum("area")?.toFixed(2) || 0) -
              (+cadHiddenOfSakBoundriesResponse?.sum("area")?.toFixed(2) ||
                0)) ||
            elem.area)) ||
        (this.polygons[key].area > 0 && this.polygons[key].area) ||
        Math.abs(+elem.area.toFixed(2)) ||
        "";

      if (this.isUpdateContract && !isEmpty(this.polygons[key].parcel_name)) {
        this.polygons[key].parcel_name = isEmpty(
          this.polygons[key][`parcelSliceNo`]
        )
          ? this.polygons[key][`parcelName`]
          : `${this.polygons[key][`parcelSliceNo`]}/${
              this.polygons[key][`parcelName`]
            }`;
      } else if (
        (this.isUpdateContract || this.isKrokyUpdateContract) &&
        isEmpty(this.polygons[key].parcel_name)
      ) {
        this.polygons[key][`parcelSliceNo`] = "";
        this.polygons[key].parcel_name = `أرض رقم ${key + 1}`;
        this.polygons[key][`parcelName`] = this.polygons[key].parcel_name;
      } else if (!this.isKrokyUpdateContract && !this.isUpdateContract)
        this.polygons[key].parcel_name =
          parcels[isFullBoundryIndex > -1 ? key - 1 : key]?.attributes
            ?.PARCEL_PLAN_NO || "";
    }

    this.polygons[key].polygon_unprojected = JSON.parse(
      JSON.stringify(cadResponse)
    ).map((polygon, key) => {
      polygon.rings[0] = _.filter(polygon.rings[0], (point) => {
        return isPointOrArc(
          { x: point[0], y: point[1] },
          key,
          (
            (!this.cadResults?.data?.length && this.cadResults) ||
            this.cadResults?.data[0]
          )?.cadFeatures
        );
      });

      return polygon;
    })[key];
    this.polygons[key].polygon_unprojected.polylines = [];
    this.polygons[key].notify = polygon_project.notify;
    this.polygons[key].polygon = polygon;
    this.polygons[key].min;
    this.polygons[key].max = 0;
    this.polygons[key].maxPointLineLen;
    this.polygons[key].minPointLineLen;
    this.polygons[key].minLineLen;

    if (polygon.rings.length > 0) {
      var arcLength = 0;
      var arcPoints = [];
      var arcLines = [];

      this.drawFeatures(
        props,
        polygon,
        polygon_project,
        key,
        esriModules,
        map,
        points
      );

      // if (this.outRange) {
      //   this.outRange = true;
      // }

      if (this.notify) {
        addGraphicToLayer(
          polygon,
          map,
          "addedParclGraphicLayer",
          null,
          null,
          null,
          (response) => {
            this.#addLayerFeature(map, "addedParclGraphicLayer", response);
          }
        );
      } else {
        addGraphicToLayer(
          polygon,
          map,
          "addedParclGraphicLayer",
          null,
          null,
          true,
          (response) => {
            this.#addLayerFeature(map, "addedParclGraphicLayer", response);
          }
        );
      }
    }
  };

  populateUnprojectedPolygons = (
    props,
    plogs,
    polygon_project,
    esriModules,
    elem,
    key,
    points,
    InvokedToAdParcel,
    isLoading,
    map,
    callback
  ) => {
    if (this.polygons[key]) {
      this.polygons[key]?.polygon_unprojected?.rings?.forEach(
        (rings, index) => {
          this.polygons[key].polygon_unprojected.rings[index] =
            polygon_project.rings[index];
        }
      );
    }
  };

  drawOutOfSakBoundriesFeatures = (
    props,
    plogs,
    polygon_project,
    esriModules,
    elem,
    key,
    points,
    InvokedToAdParcel,
    isLoading,
    map,
    callback
  ) => {
    var polygon = new esri.geometry.Polygon(plogs[key]);
    addGraphicToLayer(
      polygon,
      map,
      "addedParclGraphicLayer",
      null,
      null,
      null,
      (response) => {
        this.#addLayerFeature(map, "addedParclGraphicLayer", response);
      }
    );
  };

  drawCADFeatures = (prop, map, cadLayerName, featureType) => {
    if (this.cadResults[cadLayerName]) {
      //draw details
      this.cadResults[cadLayerName].forEach((feature, appartNumber) => {
        var shape = eval(`new esri.geometry.${featureType}(feature)`);
        addGraphicToLayer(
          shape,
          map,
          "detailedGraphicLayer",
          [0, 0, 255, 0.5],
          null,
          null,
          (response) => {
            this.#addLayerFeature(map, "detailedGraphicLayer", response);
          }
        );
      });
    }
  };

  populateFarzPolygons = (
    props,
    plogs,
    polygon_project,
    esriModules,
    elem,
    key,
    points,
    InvokedToAdParcel,
    isLoading,
    map,
    callback
  ) => {
    const { t } = props;
    var polygon = new esri.geometry.Polygon(plogs[key]);
    if (InvokedToAdParcel) {
      this.polygons.push({
        parcel_name: "",
        area: -1,
        data: [
          { name: "north", data: [], totalLength: 0 },
          { name: "east", data: [], totalLength: 0 },
          { name: "main", data: [], totalLength: 0 },
          { name: "west", data: [], totalLength: 0 },
          { name: "south", data: [], totalLength: 0 },
        ],
      });

      if (isEmpty(this.polygons[key].parcel_name)) {
        this.polygons[key].parcelSliceNo = this.polygons[key].parcelNameLeft =
          "";
        this.polygons[key].parcel_name = this.polygons[key].parcelNameRight =
          [34].indexOf(props.currentModule.id) != -1 ||
          [1949, 2048].indexOf(props.currentModule.record.workflow_id) != -1
            ? `دوبلكس رقم${key + 1}`
            : `أرض رقم${key + 1}`; // parcels[key].attributes.PARCEL_PLAN_NO;

        this.polygons[key].duplixType = "";
        this.polygons[key].area = elem.area.toFixed(2);
      }

      this.polygons[key].PARCEL_SPATIAL_ID = "";
      this.polygons[key].area = elem.area;
      this.polygons[key].parcel_nameHidden = "";
      this.polygons[key].notify = polygon.notify;
      this.polygons[key].polygon = polygon;
      this.polygons[key].min;
      this.polygons[key].active = false;
      this.polygons[key].max = 0;
      this.polygons[key].maxPointLineLen;
      this.polygons[key].minPointLineLen;
      this.polygons[key].minLineLen;
    }

    if (polygon.rings.length > 0) {
      this.drawFeatures(
        props,
        polygon,
        polygon_project,
        key,
        esriModules,
        map,
        points
      );

      if (elem.outRange) {
        this.outRange = true;
      }
      if (elem.notify) {
        //
        this.isConfirmed = false;
        this.hasNotify = true;
        addGraphicToLayer(
          polygon,
          map,
          "addedParclGraphicLayer",
          null,
          [255, 0, 0, 0.6],
          null,
          (response) => {
            this.#addLayerFeature(map, "addedParclGraphicLayer", response);
          }
        );
      } else {
        addGraphicToLayer(
          polygon,
          map,
          "addedParclGraphicLayer",
          [0, 0, 255, 0.8],
          null,
          true,
          (response) => {
            this.#addLayerFeature(map, "addedParclGraphicLayer", response);
          }
        );
      }

      if (this.reqType != "duplex") {
        this.polygons[key].parcel_nameHidden =
          this.polygons.length + " " + t("labels:PARCELCOUNTERDRAGREV");

        addParcelNo(
          polygon.getExtent().getCenter(),
          map,
          convertToArabic(this.polygons[key].parcel_name),
          "PacrelUnNamedGraphicLayer",
          this.parcelNumberFont,
          [0, 0, 0],
          getPacrelNoAngle({ geometry: polygon }),
          null,
          null,
          null,
          (response) => {
            this.#addLayerFeature(map, "PacrelUnNamedGraphicLayer", response);
          }
        );
      } else {
        this.polygons[key].parcel_nameHidden =
          this.polygons.length + " " + t("labels:DUPLIXCOUNTERDRAGREV");

        addParcelNo(
          polygon.getExtent().getCenter(),
          map,
          convertToArabic(this.polygons[key].parcel_name),
          "PacrelUnNamedGraphicLayer",
          this.parcelNumberFont,
          [0, 0, 0],
          getPacrelNoAngle({ geometry: polygon }),
          null,
          null,
          null,
          (response) => {
            this.#addLayerFeature(map, "PacrelUnNamedGraphicLayer", response);
          }
        );
      }
    }

    if (this.polygons.length == this.cadResults.shapeFeatures.length) {
      if (
        props.mainObject.landData.requestType == 1 &&
        this.polygons.length < 2
      ) {
        this.outRange = true;
        this.polygons[key].notify = "mapview.parcels.FarzNotify";
        this.hasNotify = true;
        this.isConfirmed = false;
      } else if (
        props.mainObject.landData.requestType == 2 &&
        this.polygons.length > 1
      ) {
        this.outRange = true;
        this.polygons[key].notify = "mapview.parcels.DamgNotify";
        this.hasNotify = true;
        this.isConfirmed = false;
      }

      var polygonSpatialId = GetSpatialId(polygon.polygon || polygon);

      props.mainObject.landData.landData.lands.parcels.forEach(
        (identifyPolygon) => {
          if (
            identifyPolygon.attributes.PARCEL_SPATIAL_ID == polygonSpatialId
          ) {
            this.outRange = true;
            this.isConfirmed = false;
            this.hasNotify = true;
            polygon.notify = "mapview.parcels.HASSAMESPATIALID";
            addGraphicToLayer(
              polygon.polygon || polygon,
              map,
              "addedParclGraphicLayer",
              null,
              [255, 0, 0, 0.6],
              null,
              (response) => {
                this.#addLayerFeature(map, "addedParclGraphicLayer", response);
              }
            );
          }
        }
      );

      //this.confirmNotify(props, map, polygon, InvokedToAdParcel);

      checkParcelAdjacents(
        props.mainObject.landData.landData.lands.parcels,
        false
      );

      if (callback) {
        callback();
      }
    }
  };

  getSuggestLine = (props, map, elem, InvokedToAdParcel) => {
    let polygon = elem;
    if (polygon.area != -1) {
      var lengthPoint1, lengthPoint2;
      var polyg = new esri.geometry.Polygon(polygon.polygon || polygon);
      var polygonCenterPoint = polyg.getExtent().getCenter();

      if (
        polygon.data[2].data.length > 0 &&
        !polygon.data[1].data.length &&
        !polygon.data[3].data.length &&
        !polygon.data[0].data.length &&
        !polygon.data[4].data.length
      ) {
        polygon.data[2].data.forEach((boundry, key) => {
          let direction = computePointDirection(
            polygon,
            boundry.paths[0][0],
            boundry.paths[0][1],
            polyg
          );
          if (direction.direction == "east") {
            polygon.data[1].data.push(boundry);
          } else {
            if (direction.direction == "west") {
              polygon.data[3].data.push(boundry);
            } else if (direction.direction == "north") {
              polygon.data[0].data.push(boundry);
            } else if (direction.direction == "south") {
              polygon.data[4].data.push(boundry);
            }
          }
        });
      }

      polygon.data[2].data = [];
    }

    this.dropSuccess(props, map, polygon);
    this.calculateLines(polygon);
  };

  dropSuccess = (props, map, polygon) => {
    var count = 0;

    var oldData = JSON.parse(JSON.stringify(this.layerParcels));

    this.layerParcels = [];
    sortPolygonLines(polygon);

    if (polygon.polygon || polygon) {
      count++;
      var parcelNumber = key + 1;

      if (oldData[key]) {
        polygon.corners = JSON.parse(JSON.stringify(oldData[key].corners));
      } else polygon.corners = [];

      this.layerParcels.push(
        JSON.parse(JSON.stringify(polygon.polygon || polygon))
      );
      this.layerParcels[this.layerParcels.length - 1].lines = [];
      this.layerParcels[this.layerParcels.length - 1].corners = [];

      polygon.data.forEach((boundry) => {
        var lineDirection;
        if (boundry.name != "main") {
          var color = [0, 0, 255];

          if (boundry.name == "north") {
            color = [0, 141, 255];
            lineDirection = 1;
          } else if (boundry.name == "east") {
            color = [117, 114, 114];
            lineDirection = 2;
          } else if (boundry.name == "west") {
            color = [255, 0, 0];
            lineDirection = 4;
          } else if (boundry.name == "south") {
            color = [0, 255, 0];
            lineDirection = 3;
          }

          boundry.data.forEach((line) => {
            //if (this.toLoadLines) {
            line.color = color;
            line.polygonNum = count;
            line.lineDirection = lineDirection;

            var polyline = new esri.geometry.Polyline(line);

            var point1 = {};
            point1.x = line.paths[0][0][0];
            point1.y = line.paths[0][0][1];

            point1.x = Number(point1.x.toPrecision(12));
            point1.y = Number(point1.y.toPrecision(12));

            var latlng = esri.geometry.xyToLngLat(point1.x, point1.y);
            point1.lat = latlng[0];
            point1.lng = latlng[1];

            var point2 = {};
            point2.x = line.paths[0][1][0];
            point2.y = line.paths[0][1][1];

            point2.x = Number(point2.x.toPrecision(12));
            point2.y = Number(point2.y.toPrecision(12));

            latlng = esri.geometry.xyToLngLat(point2.x, point2.y);
            point2.lat = latlng[0];
            point2.lng = latlng[1];

            var fromCornerIndex = getCornersIndex(polygon.corners, point1);
            if (fromCornerIndex == -1) {
              polygon.corners.push(point1);
              fromCornerIndex = polygon.corners.length;
            }
            var toCornerIndex = getCornersIndex(polygon.corners, point2);
            if (toCornerIndex == -1) {
              polygon.corners.push(point2);
              toCornerIndex = polygon.corners.length;
            }

            line.from = fromCornerIndex;
            line.to = toCornerIndex;
            line.BOUNDARY_NO = line.from;

            var polyline = new esri.geometry.Polyline(line);

            this.layerParcels[this.layerParcels.length - 1].lines.push(
              polyline
            );

            var attr = {
              parcelNumber: parcelNumber,
            };

            addGraphicToLayer(
              polyline,
              map,
              "boundriesDirection",
              color,
              null,
              null,
              (response) => {
                this.#addLayerFeature(map, "boundriesDirection", response);
              },
              attr
            );
          });
        }
      });

      this.layerParcels[this.layerParcels.length - 1].corners = JSON.parse(
        JSON.stringify(polygon.corners)
      );
    }
    //});

    //draw corners
    this.layerParcels.forEach((polygon, layerParcelIndex) => {
      var polygonClass = new esri.geometry.Polygon(polygon);
      var graphic = new esri.Graphic(polygonClass, null, null, null);
      var pt = graphic.geometry.getExtent().getCenter();
      polygon.lines.forEach((line, lineIndex) => {
        var attr = {
          BOUNDARY_NO: line.BOUNDARY_NO,
          FROM_CORNER: line.from,
          TO_CORNER: line.to,
          BOUNDARY_LENGTH: line.text,
          BOUNDARY_DIRECTION: line.lineDirection,
        };

        var graphic = new esri.Graphic(line, null, attr, null);
        polygon.lines[lineIndex] = graphic;

        var tempString = " يميل "; //" من النقطة " + "<b>" + line.from + "</b>" + " الي النقطة " + "<b>" + line.to + "</b>" + " ";

        if (line.lineDirection == 1) {
          if (!polygon.northDescription)
            polygon.northDescription = "من الغرب الي الشرق";
          else {
            polygon.northDescription += " ثم ";
          }
          polygon.northDescription +=
            tempString +
            computeAngle(line.paths[0][0], line.paths[0][1]) +
            " بطول " +
            "<b>" +
            line.text +
            "</b>" +
            " م";
        } else if (line.lineDirection == 4) {
          if (!polygon.westDescription)
            polygon.westDescription = " من الجنوب الي الشمال";
          else {
            polygon.westDescription += " ثم ";
          }
          polygon.westDescription +=
            tempString +
            computeAngle(line.paths[0][0], line.paths[0][1]) +
            " بطول " +
            "<b>" +
            line.text +
            "</b>" +
            " م";
        } else if (line.lineDirection == 3) {
          if (!polygon.southDescription)
            polygon.southDescription = "من الشرق الي الغرب";
          else {
            polygon.southDescription += " ثم ";
          }

          polygon.southDescription +=
            tempString +
            computeAngle(line.paths[0][0], line.paths[0][1]) +
            " بطول " +
            "<b>" +
            line.text +
            "</b>" +
            " م";
        } else if (line.lineDirection == 2) {
          if (!polygon.eastDescription)
            polygon.eastDescription = "من الشمال الي الجنوب";
          else {
            polygon.eastDescription += " ثم ";
          }

          polygon.eastDescription +=
            tempString +
            computeAngle(line.paths[0][0], line.paths[0][1]) +
            " بطول " +
            "<b>" +
            line.text +
            "</b>" +
            " م";
        }
      });

      polygon?.corners?.forEach((corner, cornerIndex) => {
        var point = new esri.geometry.Point(corner.lat, corner.lng);
        var mp = esri.geometry.geographicToWebMercator(point);

        var iconTextPosition;
        var iconPosition;

        if (!corner.iconPosition) {
          iconTextPosition = { x: -5, y: 0 };
          iconPosition = { x: 0, y: 0 };

          if (this.layerParcels.length > 1) {
            iconPosition = getCornerIconPosition(
              cornerIndex + 1,
              polygon.lines
            );
            iconTextPosition.x =
              iconPosition.x > 0 ? iconPosition.x : iconPosition.x - 5;
            iconTextPosition.y =
              iconPosition.y > 0 ? iconPosition.y : iconPosition.y - 4;
          }

          corner.iconTextPosition = iconTextPosition;
          corner.iconPosition = iconPosition;
        } else {
          iconTextPosition = corner.iconTextPosition;
          iconPosition = corner.iconPosition;
        }

        // if (!this.isUpdateContract)
        //   addParcelNo(
        //     mp,
        //     map,
        //     "" + (cornerIndex + 1) + "",
        //     "PacrelNoGraphicLayer",
        //     25,
        //     [255, 0, 0],
        //     null,
        //     iconTextPosition
        //   );
      });
    });

    if (polygon.polygon) {
      var polygonClass = new esri.geometry.Polygon(polygon.polygon);
      var graphic = new esri.Graphic(polygonClass, null, null, null);
      var pt = graphic.geometry.getExtent().getCenter();

      polygon.position = pt;
      polygon.northDescription = this.layerParcels[key]?.northDescription || "";
      polygon.westDescription = this.layerParcels[key]?.westDescription || "";
      polygon.southDescription = this.layerParcels[key]?.southDescription || "";
      polygon.eastDescription = this.layerParcels[key]?.eastDescription || "";
      // if (!polygon.isFullBoundry && !this.isKrokyUpdateContract) {
      //   redrawNames(
      //     polygon,
      //     map,
      //     setParcelName([polygon["parcelName"], polygon["parcelSliceNo"]]),
      //     "PacrelNoGraphicLayer",
      //     key
      //   );
      // }
    }
    //});
  };

  calculateLines = (polygon) => {
    polygon.data.forEach((lines) => {
      lines.totalLength = 0;
      lines.data.forEach((line) => {
        if (!line.hide) lines.totalLength += line.text;
      });
      lines.totalLength = lines.totalLength.toFixed(2);
    });
  };

  updateParcelNo = (map, layerName, text, key) => {
    redrawNames(this.polygons[key], map, text, layerName, key, (response) => {
      
      this.#addLayerFeature(map, layerName, response);
    });
  };

  drawLengths(elem, map) {
    elem.data.forEach((item) => {
      item.data.forEach((boundry) => {
        var attr = {
          text: convertToArabic(boundry.text.toFixed(2)),
          angle: null,
        };
        console.log(boundry);
        addParcelNo(
          new esri.geometry.Point(boundry.centroid),
          map,
          "" + convertToArabic(boundry.text.toFixed(2)) + "",
          "editlengthGraphicLayer",
          30,
          null,
          null,
          null,
          attr,
          null,
          (response) => {
            zoomToLayer("editlengthGraphicLayer", map, this.zoomRatio);
            this.#addLayerFeature(map, "editlengthGraphicLayer", response);
          }
        );
      });
    });
  }

  drawPolygons(props, map) {
    this.polygons
      .filter((p) => {
        return p.layerName?.toLowerCase() != "notPlus"?.toLowerCase();
      })
      .forEach((elem, key) => {
        elem.polygon = new esri.geometry.Polygon(elem.polygon);
        elem.polygon.type = "polygon";
        console.log(elem.polygon);
        if (elem.polygon.layer?.toLowerCase() == "boundry"?.toLowerCase()) {
          addGraphicToLayer(
            elem.polygon,
            map,
            "addedParclGraphicLayer",
            [0, 0, 255, 0.8],
            null,
            true,
            (response) => {
              zoomToLayer("addedParclGraphicLayer", map, this.zoomRatio);
              this.#addLayerFeature(map, "addedParclGraphicLayer", response);
            }
          );
          if (elem.parcel_name) {
            addParcelNo(
              new esri.geometry.Polygon(elem.polygon).getExtent().getCenter(),
              map,
              convertToArabic(elem.parcel_name) + "",
              "ParcelPlanNoGraphicLayer",
              14,
              [0, 0, 0],
              null,
              null,
              null,
              true,
              (response) => {
                this.#addLayerFeature(
                  map,
                  "ParcelPlanNoGraphicLayer",
                  response
                );
              }
            );
          }
        } else if (
          elem.polygon.layer?.toLowerCase() == "plus"?.toLowerCase()
        ) {
          addGraphicToLayer(
            elem.polygon,
            map,
            "addedParclGraphicLayer",
            [0, 255, 0, 0.8],
            null,
            null,
            (response) => {
              zoomToLayer("addedParclGraphicLayer", map, this.zoomRatio);
              this.#addLayerFeature(map, "addedParclGraphicLayer", response);
            },
            null,
            null,
            null,
            true
          );
        }
        this.dropSuccess(this.props, map, elem);
        this.drawLengths(elem, map);
      });
  }

  populateZawaedPolygons = (
    props,
    plogs,
    polygon_project,
    esriModules,
    elem,
    key,
    points,
    InvokedToAdParcel,
    isLoading,
    map,
    callback
  ) => {
    this.polygons.push({
      parcelName: "",
      area: -1,
      data: [
        { name: "north", data: [], totalLength: 0 },
        { name: "east", data: [], totalLength: 0 },
        { name: "main", data: [], totalLength: 0 },
        { name: "weast", data: [], totalLength: 0 },
        { name: "south", data: [], totalLength: 0 },
      ],
    });
    this.polygons[key].parcelName = "";
    if (elem.layer?.toLowerCase() == "plus"?.toLowerCase()) {
      this.polygons[key].parcel_name = "الزائده التنظيميه";
      this.polygons[key].layerName = "plus";
    } else if (elem.layer?.toLowerCase() == "boundry"?.toLowerCase()) {
      this.polygons[key].parcel_name = "أرض رقم " + (key + 1);
      this.polygons[key].layerName = "boundry";
    } else if (elem.layer?.toLowerCase() == "full_boundry"?.toLowerCase()) {
      this.polygons[key].parcel_name = "حدود المعاملة ";
      this.polygons[key].layerName = "full_boundry";
    }

    this.polygons[key].PARCEL_SPATIAL_ID = "";
    this.polygons[key].area = elem.area;
    this.polygons[key].parcelNameHidden = "";

    this.polygons[key].notify = polygon_project.notify;
    this.polygons[key].polygon = polygon_project;
    this.polygons[key].min;
    this.polygons[key].active = false;
    this.polygons[key].max = 0;
    this.polygons[key].maxPointLineLen;
    this.polygons[key].minPointLineLen;
    this.polygons[key].minLineLen;

    if (polygon_project.rings.length > 0) {
      var arcLength = 0;
      var arcPoints = [];
      var arcLines = [];

      for (var j = 0, n = polygon_project.rings[0].length - 1; j < n; j++) {
        var point1 = new esri.geometry.Point(
          polygon_project.rings[0][j][0],
          polygon_project.rings[0][j][1],
          new esri.SpatialReference({ wkid: polygon_project.spatialReference })
        );
        var point2 = new esri.geometry.Point(
          polygon_project.rings[0][j + 1][0],
          polygon_project.rings[0][j + 1][1],
          new esri.SpatialReference({ wkid: polygon_project.spatialReference })
        );

        var length = esriModules.mathUtils.getLength(point1, point2);
        //length = Number(parseFloat(length).toFixed(2));

        if (point1.x > this.polygons[key].max) {
          this.polygons[key].max = point1.x;
          this.polygons[key].maxPoint = point1;
        }

        if (!this.polygons[key].min || point1.x < this.polygons[key].min) {
          this.polygons[key].min = point1.x;
          this.polygons[key].minPoint = point1;
        }

        if (point2.x > this.polygons[key].max) {
          this.polygons[key].max = point2.x;
          this.polygons[key].maxPoint = point2;
        }

        if (!this.polygons[key].min || point2.x < this.polygons[key].min) {
          this.polygons[key].min = point2.x;
          this.polygons[key].minPoint = point2;
        }

        var path = {
          paths: [
            [polygon_project.rings[0][j], polygon_project.rings[0][j + 1]],
          ],
          text: length,
          spatialReference: polygon_project.spatialReference,
        };

        if (
          !(
            isPointOrArc(point1, key, this.cadResults?.[0]?.cadFeatures) &&
            isPointOrArc(point2, key, this.cadResults?.[0]?.cadFeatures)
          )
        ) {
          if (isPointOrArc(point2, key, this.cadResults?.[0]?.cadFeatures)) {
            //
            arcLength += length;
            arcPoints.push(point1);
            path = new esri.geometry.Polyline(path);
            path.centroid = path.getExtent().getCenter();
            arcLines.push(new esri.geometry.Polyline(path));
            path.text = arcLength || length;

            if (this.cadResults?.[0]?.boundryFeaturesLen?.length) {
              //
              var line = getLineLength(
                this.cadResults?.[0]?.boundryFeaturesLen,
                arcPoints[0],
                point2,
                this.cadResults?.[0]?.isArc
              );
              if (line) path.text = line.length;
            }

            length = path.text;
            path.lines = arcLines;
            arcLines = [];
            arcLength = 0;
            this.polygons[key].data[2].data.push(path);
            this.polygons[key].data[2].data[
              this.polygons[key].data[2].data.length - 1
            ].centroid = path.getExtent().getCenter();
          } else {
            path.hide = true;
            arcLength += length;
            arcPoints.push(point1);
            path = new esri.geometry.Polyline(path);
            let polyline = new esri.geometry.Polyline(path);
            path.centroid = polyline.getExtent().getCenter();
            arcLines.push(new esri.geometry.Polyline(path));
          }
        }
        if (
          isPointOrArc(point1, key, this.cadResults?.[0]?.cadFeatures) &&
          isPointOrArc(point2, key, this.cadResults?.[0]?.cadFeatures)
        ) {
          if (this.cadResults?.[0]?.boundryFeaturesLen?.length) {
            //
            let line = getLineLength(
              this.cadResults?.[0]?.boundryFeaturesLen,
              point1,
              point2,
              this.cadResults?.[0]?.isArc
            );

            if (line) path.text = line.length;

            length = path.text;
          }
          this.polygons[key].data[2].data.push(path);
        }

        let polyline1 = new esri.geometry.Polyline(path);

        if (
          !this.polygons[key].minLineLen ||
          this.polygons[key].minLineLen > length
        )
          this.polygons[key].minLineLen = length;

        var pt = polyline1.getExtent().getCenter();

        if (
          !(
            isPointOrArc(point1, key, this.cadResults?.[0]?.cadFeatures) &&
            isPointOrArc(point2, key, this.cadResults?.[0]?.cadFeatures)
          )
        ) {
          if (isPointOrArc(point2, key, this.cadResults?.[0]?.cadFeatures)) {
            if (arcPoints.length)
              pt = arcPoints[Math.floor(arcPoints.length / 2)];
          }
        }

        if (
          isPointOrArc(point1, key, this.cadResults?.[0]?.cadFeatures) &&
          isPointOrArc(point2, key, this.cadResults?.[0]?.cadFeatures)
        ) {
          this.polygons[key].data[2].data[
            this.polygons[key].data[2].data.length - 1
          ].centroid = pt;
        }

        if (polygon_project.layer?.toLowerCase() == "boundry"?.toLowerCase()) {
          addGraphicToLayer(
            polyline1,
            map,
            "boundriesGraphicLayer",
            [0, 0, 255, 0.3],
            null,
            null,
            (response) => {
              zoomToLayer("boundriesGraphicLayer", map, this.zoomRatio);
              this.#addLayerFeature(map, "boundriesGraphicLayer", response);
            }
          );
        } else {
          addGraphicToLayer(
            polyline1,
            map,
            "boundriesGraphicLayer",
            [0, 255, 0, 1],
            null,
            null,
            (response) => {
              zoomToLayer("boundriesGraphicLayer", map, this.zoomRatio);
              this.#addLayerFeature(map, "boundriesGraphicLayer", response);
            }
          );
        }

        if (pt.length) {
          pt.x = pt[0];
          pt.y = pt[1];
        }

        let lineLengthFont = 30;

        var attr = {
          text: convertToArabic(length.toFixed(2)),
          angle: getPacrelNoAngle({ geometry: polygon_project }),
        };

        // because there were similarity between points in fraction part 123.4567 , 123.4512
        if (
          !(
            this.pointsLength.indexOf(pt.x.toFixed(4) + "," + pt.y.toFixed(4)) >
            -1
          )
        ) {
          if (
            isPointOrArc(point1, key, this.cadResults?.[0]?.cadFeatures) &&
            isPointOrArc(point2, key, this.cadResults?.[0]?.cadFeatures)
          ) {
            this.pointsLength.push(pt.x.toFixed(4) + "," + pt.y.toFixed(4));

            //if(this.polygons[key].layerName != "plus")
            //{
            addParcelNo(
              pt,
              map,
              "" + convertToArabic(length.toFixed(2)) + "",
              "editlengthGraphicLayer",
              lineLengthFont,
              null,
              getPacrelNoAngle({ geometry: polygon_project }),
              null,
              attr,
              null,
              (response) => {
                zoomToLayer("editlengthGraphicLayer", map, this.zoomRatio);
                this.#addLayerFeature(map, "editlengthGraphicLayer", response);
              }
            );
            //}
          } else if (
            isPointOrArc(point2, key, this.cadResults?.[0]?.cadFeatures)
          ) {
            if (arcPoints.length)
              pt = arcPoints[Math.floor(arcPoints.length / 2)];

            //if(this.polygons[key].layerName != "plus")
            //{
            addParcelNo(
              pt,
              map,
              "" + convertToArabic(length.toFixed(2)) + "",
              "editlengthGraphicLayer",
              lineLengthFont,
              null,
              getPacrelNoAngle({ geometry: polygon_project }),
              null,
              attr,
              null,
              (response) => {
                zoomToLayer("editlengthGraphicLayer", map, this.zoomRatio);
                this.#addLayerFeature(map, "editlengthGraphicLayer", response);
              }
            );
            //}
          }
        }

        if (isPointOrArc(point2, key, this.cadResults?.[0]?.cadFeatures)) {
          arcPoints = [];
        }
      }

      if (
        this.polygons[key].layerName?.toLowerCase() == "plus"?.toLowerCase()
      ) {
        addGraphicToLayer(
          polygon_project,
          map,
          "addedParclGraphicLayer",
          [0, 0, 255, 0.8],
          null,
          null,
          (response) => {
            zoomToLayer("boundriesGraphicLayer", map, this.zoomRatio);
            this.#addLayerFeature(map, "boundriesGraphicLayer", response);
          },
          null,
          null,
          null,
          true
        );
      } else {
        addGraphicToLayer(
          polygon_project,
          map,
          "addedParclGraphicLayer",
          [0, 0, 255, 0.8],
          null,
          true,
          (response) => {
            zoomToLayer("boundriesGraphicLayer", map, this.zoomRatio);
            this.#addLayerFeature(map, "boundriesGraphicLayer", response);
          }
        );
      }
    }
  };
}
