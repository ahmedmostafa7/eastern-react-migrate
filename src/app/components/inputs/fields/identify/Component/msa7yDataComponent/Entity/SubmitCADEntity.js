import { fetchData } from "../../../../../../../helpers/apiMethods";
import {
  DrawIntersectLines,
  GetSpatial,
  GetSpatialId,
  HasArabicCharacters,
  IdentifyTask,
  addGraphicToLayer,
  addParcelNo,
  between,
  calcPolygonArea,
  checkOverlappingFeaturesWithLayer,
  checkParcelAdjacents,
  clearGraphicFromLayer,
  computeAngle,
  computeLineAngle,
  computePointDirection,
  convertToArabic,
  convertToEnglish,
  fromLatLngToDegreeSymbol,
  getColorFromCadIndex,
  getCornerIconPosition,
  getCornersIndex,
  getFeatureDomainCode,
  getFieldDomain,
  getInfo,
  getLengthOffset,
  getLineLength,
  getPacrelNoAngle,
  getPolygons,
  intersectQueryTask,
  isPointOrArc,
  lineLength,
  project,
  projectPolygons,
  queryTask_updated,
  redrawNames,
  resizeMap,
  reverse,
  segment_intersection,
  setDistance,
  setParcelName,
  sortPolygonLines,
  zoomToFeature,
  zoomToLayer,
} from "../../common/common_func";
import { LoadModules } from "../../common/esri_loader";

export class SubmitCADEntity {
  constructor(props, submitCad) {
    // cadResults, polygons, survayParcelCutter, planDescription, isUpdateContract, isKrokyUpdateContract, isPlan, notify, hideDrag, have_electric_room, electric_room_area, electric_room_place, mun, isWithinUrbanBoundry, pointsLength, isConfirmed, activeKey
    
    let _props = props;
    this.layers =
      (submitCad.layers.length && submitCad.layers) ||
      _props.values?.mapviewer?.mapGraphics ||
      [];
    this.redrawPolygonArea = submitCad.redrawPolygonArea || 0;
    this.spatialIDs = submitCad.spatialIDs || 0;
    this.layerParcels = submitCad.layerParcels || [];
    this.updateFeature = submitCad.updateFeature || null;
    this.survayLayer = submitCad.survayLayer || null;
    this.editingTempSurvay = submitCad.editingTempSurvay || null;
    this.isStartEdit = submitCad.isStartEdit || false;
    this.polygons =
      submitCad.polygons ||
      _props.mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels ||
      [];
    this.whereContidionToDeleteCornarsBoundires =
      submitCad.whereContidionToDeleteCornarsBoundires || [];
    this.parcelSpatialIdsToDeleteFromLandContract =
      submitCad.parcelSpatialIdsToDeleteFromLandContract || [];
    this.identifyParcelsToDelete = submitCad.identifyParcelsToDelete || {};
    this.attInspector = submitCad.attInspector || null;
    getInfo().then((res) => {
      getFieldDomain("", res.Landbase_Parcel).then((domains) => {
        this.LayerDomains = domains;
        this.LayerID = res;
      });
    });
  }
  LayerDomains = [];
  LayerID = null;
  redrawPolygonArea = 0;
  spatialIDs = 0;
  layerParcels = [];
  updateFeature = null;
  survayLayer = null;
  editingTempSurvay = null;
  isStartEdit = false;
  polygons = [];
  whereContidionToDeleteCornarsBoundires = [];
  parcelSpatialIdsToDeleteFromLandContract = [];
  identifyParcelsToDelete = {};
  attInspector = null;
  layers = [];
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
    clearGraphicFromLayer(map, "editlengthGraphicLayer");
  };

  getIdentifyParcels = (props, map, callback) => {
    if (props.mainObject.landData.landData.lands.parcels) {
      this.identifyParcelsToDelete.ObjectIds = [];
      this.identifyParcelsToDelete.Parcels = [];
      this.spatialIDs = props.mainObject.landData.landData.lands.parcels
        .map((d) => {
          return d.attributes.PARCEL_SPATIAL_ID;
        })
        .join(" , ");

      props.mainObject.landData.landData.lands.parcels.forEach((value) => {
        var polygonClass = new esri.geometry.Polygon(value.geometry);

        if (this.LayerID) {
          var attr = value.attributes;
          queryTask_updated(
            mapUrl + "/" + this.LayerID.Landbase_Parcel,
            "",
            ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"],
            (result) => {
              var parcel = _.find(result.features, (d) => {
                var isNum = /^\d+$/.test(attr.PARCEL_PLAN_NO);
                if (isNum)
                  return +d.attributes.PARCEL_PLAN_NO == +attr.PARCEL_PLAN_NO;
                else return d.attributes.PARCEL_PLAN_NO == attr.PARCEL_PLAN_NO;
              });

              if (parcel) {
                this.whereContidionToDeleteCornarsBoundires.push(
                  "PARCEL_SPATIAL_ID = " + parcel.attributes.PARCEL_SPATIAL_ID
                );
                this.parcelSpatialIdsToDeleteFromLandContract.push(
                  parcel.attributes.PARCEL_SPATIAL_ID
                );

                //عملية حذف
                attr.OPERATION_TYPE = 2;
                attr.ORIGINAL_OBJECTID = attr.OBJECTID;
                attr.ARCHIVE_TIME = new Date();
                attr.USER_NAME = "Test";

                polygonClass = new esri.geometry.Polygon(parcel.geometry);
                var graphic = new esri.Graphic(polygonClass, null, attr, null);
                this.identifyParcelsToDelete.Parcels.push(graphic);
                // const {
                //   input: { value },
                // } = props;
                // this.settoStore((value && value.layerParcels) || layerParcels);

                if (callback) {
                  callback();
                }
              }
            },
            null,
            (query, Query) => {
              query.geometry = polygonClass; //clone(polygonClass, attr);
              query.distance = 4;
              //query.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
            },
            true,
            undefined,
            map.spatialReference
          );
        }
      });
    }
  };

  getBoundryDirectionName = (direction) => {
    var name = "";
    switch (direction) {
      case 1:
        name = "الحد الشمالي";
        break;
      case 2:
        name = "الحد الشرقي";
        break;
      case 3:
        name = "الحد الجنوبي";
        break;
      case 4:
        name = "الحد الغربي";
        break;
    }
    return name;
  };

  querFromLayer = (
    map,
    layerId,
    where,
    outFields,
    objectFields,
    queryCallback,
    callback
  ) => {
    let data = {};
    queryTask_updated(
      mapUrl + "/" + layerId,
      where,
      outFields,
      (res) => {
        if (outFields[0] == "*") {
          if (res.features && res.features.length > 0) {
            Object.keys(res.features[0].attributes).forEach((key) => {
              if (!data[key]) {
                data[key] = res.features[0].attributes[key];
              }
            });
          }
        } else {
          objectFields.forEach((objectFieldName, index) => {
            data[objectFieldName] =
              res.features[0].attributes[outFields[index]];
          });
        }

        callback(data);
      },
      (error) => {
        callback(data);
      },
      queryCallback,
      true,
      undefined,
      map.spatialReference
    );
  };

  GetSpatialData = (map, pt, PARCEL_SPATIAL_ID) => {
    return new Promise((resolve, reject) => {
      var count = 0;
      var data = {};
      var callbackFn = (res) => {
        count++;
        data = { ...data, ...res };
        if (count == 6) resolve(data);
      };

      var queryCallback = (query, Query) => {
        
        query.geometry = new esri.geometry.Point(pt);
        query.distance = 1;
      };
      if (this.LayerID) {
        this.querFromLayer(
          map,
          this.LayerID.Landbase_Parcel,
          "PARCEL_SPATIAL_ID=" + PARCEL_SPATIAL_ID,
          ["*"],
          null,
          null,
          callbackFn
        );
        this.querFromLayer(
          map,
          this.LayerID.Plan_Data,
          "",
          ["PLAN_SPATIAL_ID"],
          ["PLAN_SPATIAL_ID"],
          queryCallback,
          callbackFn
        );
        this.querFromLayer(
          map,
          this.LayerID.Survey_Block,
          "",
          ["BLOCK_SPATIAL_ID", "BLOCK_NO"],
          ["BLOCK_SPATIAL_ID", "PARCEL_BLOCK_NO"],
          queryCallback,
          callbackFn
        );
        this.querFromLayer(
          map,
          this.LayerID.Subdivision,
          "",
          ["SUBDIVISION_TYPE", "SUBDIVISION_SPATIAL_ID"],
          ["SUBDIVISION_TYPE", "SUBDIVISION_SPATIAL_ID"],
          queryCallback,
          callbackFn
        );
        this.querFromLayer(
          map,
          this.LayerID.Municipality_Boundary,
          "",
          ["MUNICIPALITY_NAME"],
          ["MUNICIPALITY_NAME"],
          queryCallback,
          callbackFn
        );
        this.querFromLayer(
          map,
          this.LayerID.District_Boundary,
          "",
          ["SUB_MUNICIPALITY_NAME", "DISTRICT_NAME"],
          ["SUB_MUNICIPALITY_NAME", "DISTRICT_NAME"],
          queryCallback,
          callbackFn
        );
      }
    });
  };

  #addLayerFeature = (map, layerName, response) => {
    // let maplayerIndex = map.graphicsLayerIds.findIndex((r) => r == layerName);
    // let layerIndex = this.layers.findIndex((r) => r.layerName == layerName);
    // 
    // resizeMap(map);
    // if (layerIndex > -1) {
    //   let graphicIndex = this.layers[layerIndex].graphics.findIndex((r) => {
    //     try {
    //       return (
    //         (r?.geometry?.x &&
    //           response?.geometry?.x &&
    //           r?.geometry?.x == response?.geometry?.x &&
    //           r?.geometry?.y == response?.geometry?.y) ||
    //         (r?.geometry?.rings &&
    //           response?.geometry?.rings &&
    //           response?.geometry?.rings?.[0]?.filter(
    //             (t, i) =>
    //               t?.[0] == r?.geometry?.rings?.[0]?.[i]?.[0] &&
    //               t?.[1] == r?.geometry?.rings?.[0]?.[i]?.[1]
    //           ).length == r?.geometry?.rings?.[0]?.length) ||
    //         (r?.geometry?.paths &&
    //           response?.geometry?.paths &&
    //           response?.geometry?.paths?.[0]?.filter(
    //             (t, i) =>
    //               t?.[0] == r?.geometry?.paths?.[0]?.[i]?.[0] &&
    //               t?.[1] == r?.geometry?.paths?.[0]?.[i]?.[1]
    //           ).length == r?.geometry?.paths[0]?.length)
    //       );
    //     } catch (e) {
    //       
    //       return false;
    //     }
    //   });

    //   if (graphicIndex != -1) {
    //     this.layers[layerIndex].graphics[graphicIndex] = response.toJson();
    //   } else {
    //     this.layers[layerIndex].graphics.push(response.toJson());
    //   }
    // } else {
    //   this.layers.splice(0, 0, {
    //     layerIndex: maplayerIndex,
    //     layerName: layerName,
    //     graphics: [response.toJson()],
    //   });
    // }
  };

  DrawParcels = (props, map, callback) => {
    let { polygons, layerParcels, redrawPolygonArea } = this;

    const {
      input: { value },
      mainObject: {
        data_msa7y: {
          msa7yData: {
            cadDetails: {
              temp: {
                cadResults: { data },
              },
            },
          },
        },
      },
    } = props;

    this.survayLayer = map.getLayer("Landbase_Parcel");
    this.editingTempSurvay = map.getLayer("Proposed_Landbase_Parcel");

    polygons.forEach((polygon) => {
      if (polygon.parcelNameRight && polygon.parcelNameLeft) {
        polygon.parcel_name =
          polygon.parcelNameRight.replaceAll(" ", "") +
          "/" +
          polygon.parcelNameLeft.replaceAll(" ", "");
      }
      polygon.parcel_name = convertToEnglish(polygon.parcel_name);
    });

    if (polygons && !polygons[0].polygon.spatialReference.wkid) {
      var spatialR = map.spatialReference; //: new esri.SpatialReference({ wkid: 32639 });
      polygons.forEach((polygon) => {
        polygon.data[0].data[0].spatialReference = spatialR;
        polygon.data[1].data[0].spatialReference = spatialR;
        polygon.data[3].data[0].spatialReference = spatialR;
        polygon.data[4].data[0].spatialReference = spatialR;

        polygon.data[0].data[0].centroid.spatialReference = spatialR;
        polygon.data[1].data[0].centroid.spatialReference = spatialR;
        polygon.data[3].data[0].centroid.spatialReference = spatialR;
        polygon.data[4].data[0].centroid.spatialReference = spatialR;

        polygon.maxPoint.spatialReference = spatialR;
        polygon.minPoint.spatialReference = spatialR;
        polygon.polygon.spatialReference = spatialR;
        polygon.position.spatialReference = spatialR;

        if (polygon.polygon.cache && polygon.polygon.cache._extent)
          polygon.polygon.cache._extent.spatialReference = spatialR;
      });
    }
    var permanentSlope;
    if (map) {
      projectPolygons(polygons).then((pPolygons) => {
        polygons = pPolygons.polygons || pPolygons;
        this.getIdentifyParcels(props, map, callback);

        clearGraphicFromLayer(map, "boundriesDirection");
        clearGraphicFromLayer(map, "boundriesDirectionToolTip");

        map.getLayer("boundriesDirectionToolTip").on("mouse-move", (evt) => {
          if (!this.isStartEdit) {
            var graphicAttributes = evt.graphic.geometry;
            var content = "";
            content +=
              "<b><center>" +
              this.getBoundryDirectionName(graphicAttributes.lineDirection) +
              "</center>";
            content +=
              "رقم الحد : " + convertToArabic(graphicAttributes.BOUNDARY_NO);
            content +=
              "<br> رقم الأرض : " +
              convertToArabic(graphicAttributes.parcel_name);
            content +=
              "<br> طوله : " +
              convertToArabic(toFixed(graphicAttributes.text, 2)) +
              " م ";
            content +=
              "<br> نقطة بداية الضلع : " +
              convertToArabic(graphicAttributes.from);
            content +=
              "<br> نقطة نهاية الضلع : " +
              convertToArabic(graphicAttributes.to);

            map.infoWindow.setTitle("معلومات الأرض");
            map.infoWindow.setContent(content);
            map.infoWindow.resize(350, 300);
            map.infoWindow.show(
              evt.screenPoint,
              map.getInfoWindowAnchor(evt.screenPoint)
            );
          }
        });

        map.getLayer("boundriesDirectionToolTip").on("mouse-out", (evt) => {
          if (!this.isStartEdit) {
            map.infoWindow.hide();
          }
        });

        window.onDragShatfaLayer = [];
        window.onDragShatfaLayer.push((event) => {
          //

          map.getLayer("shatfaGraphicLayer").remove(event.graphic);
          var line = event.graphic;
          permanentSlope =
            (line.geometry.paths[0][1][1] - line.geometry.paths[0][0][1]) /
            (line.geometry.paths[0][1][0] - line.geometry.paths[0][0][0]);

          event.mapPoint.x += 1.3000009;
          var newLine = setDistance(event.mapPoint, permanentSlope, 10);
          addGraphicToLayer(
            newLine,
            map,
            "shatfaGraphicLayer",
            [0, 0, 255, 0.5],
            null,
            null,
            (response) => {
              this.#addLayerFeature(map, "shatfaGraphicLayer", response);
            },
            null,
            null,
            null,
            null,
            20
          );

          var intersectIndex = 0;
          var intersectLineNumber = 0;
          var newIntersectPolygonRings = [];
          var isIntersect = false;
          var isIntersectBefore = false;
          var intersetcedPoint = null;
          layerParcels.forEach((parcel) => {
            intersectIndex = 0;
            intersectLineNumber = 0;
            newIntersectPolygonRings = [];
            isIntersect = false;
            isIntersectBefore = false;
            //  يجب مراجعتها
            redrawPolygonArea = calcPolygonArea(parcel.geometry.rings);

            for (var i = 0; i < parcel.geometry.rings[0].length; i++) {
              if (i < parcel.geometry.rings[0].length - 1) {
                var path = {
                  paths: [
                    [
                      parcel.geometry.rings[0][i],
                      parcel.geometry.rings[0][i + 1],
                    ],
                  ],
                  spatialReference: new esri.SpatialReference({ wkid: 32639 }),
                };

                intersetcedPoint = segment_intersection(
                  path.paths[0][0][0],
                  path.paths[0][0][1],
                  path.paths[0][1][0],
                  path.paths[0][1][1],
                  newLine.paths[0][0][0],
                  newLine.paths[0][0][1],
                  newLine.paths[0][1][0],
                  newLine.paths[0][1][1]
                );
                if (
                  intersetcedPoint &&
                  between(
                    parcel.geometry.rings[0][i][0],
                    intersetcedPoint.x,
                    parcel.geometry.rings[0][i + 1][0]
                  )
                ) {
                  //
                  isIntersect = true;

                  if (
                    lineLength(
                      intersetcedPoint.x,
                      intersetcedPoint.y,
                      parcel.geometry.rings[0][i + 1][0],
                      parcel.geometry.rings[0][i + 1][1]
                    ) >
                    lineLength(
                      intersetcedPoint.x,
                      intersetcedPoint.y,
                      parcel.geometry.rings[0][i][0],
                      parcel.geometry.rings[0][i][1]
                    )
                  ) {
                    newIntersectPolygonRings.push([
                      intersetcedPoint.x,
                      intersetcedPoint.y,
                    ]);
                    newIntersectPolygonRings.push(
                      parcel.geometry.rings[0][i + 1]
                    );
                  } else {
                    newIntersectPolygonRings.push(parcel.geometry.rings[0][i]);
                    newIntersectPolygonRings.push([
                      intersetcedPoint.x,
                      intersetcedPoint.y,
                    ]);
                  }

                  intersectIndex = i;
                  isIntersectBefore = true;
                } else {
                  if (
                    !(
                      newIntersectPolygonRings.length > 0 &&
                      newIntersectPolygonRings[
                        newIntersectPolygonRings.length - 1
                      ][0] == parcel.geometry.rings[0][i][0] &&
                      newIntersectPolygonRings[
                        newIntersectPolygonRings.length - 1
                      ][1] == parcel.geometry.rings[0][i][1]
                    )
                  ) {
                    newIntersectPolygonRings.push(parcel.geometry.rings[0][i]);
                    newIntersectPolygonRings.push(
                      parcel.geometry.rings[0][i + 1]
                    );
                  }
                }
              }
            }
            if (isIntersect) {
              map.getLayer("highlightDeletedGraphicLayer").clear();
              //
              if (
                newIntersectPolygonRings[
                  newIntersectPolygonRings.length - 1
                ][0] != newIntersectPolygonRings[0][0]
              ) {
                newIntersectPolygonRings.push(newIntersectPolygonRings[0]);
              }
              var polygonJson = {
                rings: [newIntersectPolygonRings],
                spatialReference: { wkid: 32639 },
              };
              polygonClass = new esri.geometry.Polygon(polygonJson);
              redrawPolygonArea = calcPolygonArea(newIntersectPolygonRings);

              parcel.pendingGeometry = polygonClass;
              addGraphicToLayer(
                polygonClass,
                map,
                "highlightDeletedGraphicLayer",
                [0, 0, 0, 1],
                null,
                null,
                (response) => {
                  this.#addLayerFeature(
                    map,
                    "highlightDeletedGraphicLayer",
                    response
                  );
                },
                null,
                null,
                true
              );
            }
          });
        });

        this.clearAllGraphics(map);

        if (polygons) {
          var polygonClass = new esri.geometry.Polygon(polygons[0].polygon);

          var graphic = new esri.Graphic(polygonClass, null, null, null);
          var pt = graphic.geometry.getExtent().getCenter();
          //
          pt.spatialReference = new esri.SpatialReference({ wkid: 32639 });

          this.GetSpatialData(
            map,
            pt,
            props.mainObject.landData.landData.lands.parcels[0].attributes
              .PARCEL_SPATIAL_ID
          ).then((spatialRes) => {
            getFeatureDomainCode(
              [
                {
                  attributes: {
                    DETAILED_LANDUSE:
                      props.mainObject.landData.landData.lands.parcels[0]
                        .attributes.DETAILED_LANDUSE,
                    CITY_NAME:
                      props.mainObject.landData.landData.lands.parcels[0]
                        .attributes.CITY_NAME,
                    ACTUAL_MAINLANDUSE:
                      props.mainObject.landData.landData.lands.parcels[0]
                        .attributes.ACTUAL_MAINLANDUSE,
                  },
                },
              ],
              map.getLayer("Proposed_Landbase_Parcel").layerId
            ).then((domainValues) => {
              var projectedPoints = [];

              polygons.forEach((polygon) => {
                var polygonClass = new esri.geometry.Polygon(polygon.polygon);
                polygon.corners = [];
                var graphic = new esri.Graphic(polygonClass, null, null, null);
                projectedPoints.push(graphic.geometry.getExtent().getCenter());
              });

              map.getLayer("editlengthGraphicLayer").clear();

              var cadResults =
                props.mainObject.data_msa7y.msa7yData.cadDetails.temp
                  .cadResults;
              if (cadResults && cadResults.lineFeatures) {
                cadResults.lineFeatures.forEach((line) => {
                  map.disablePan();
                  var polyline = new esri.geometry.Polyline(line);
                  permanentSlope =
                    (line.paths[0][1][1] - line.paths[0][0][1]) /
                    (line.paths[0][1][0] - line.paths[0][0][0]);
                  var newLine = setDistance(
                    polyline.getExtent().getCenter(),
                    permanentSlope,
                    10
                  );
                  addGraphicToLayer(
                    newLine,
                    map,
                    "shatfaGraphicLayer",
                    [0, 0, 255, 0.5],
                    null,
                    null,
                    (response) => {
                      this.#addLayerFeature(
                        map,
                        "shatfaGraphicLayer",
                        response
                      );
                    },
                    null,
                    null,
                    null,
                    null,
                    20
                  );
                });
              }

              project(
                projectedPoints,
                4326,
                (projectedPointsRes) => {
                  polygons.forEach((polygon, key) => {
                    var polygonClass = new esri.geometry.Polygon(
                      polygon.polygon
                    );
                    polygon.corners = [];
                    var graphic = new esri.Graphic(
                      polygonClass,
                      null,
                      null,
                      null
                    );
                    var parcelSpatialId = GetSpatial(projectedPointsRes[key]);
                    var newpt = projectedPointsRes[key];

                    var polygonlatlng = [
                      fromLatLngToDegreeSymbol(newpt.y),
                      fromLatLngToDegreeSymbol(newpt.x),
                    ];

                    delete spatialRes.OBJECTID;

                    var attr = { ...spatialRes };

                    ///////////////////////////////////////
                    /////// set updated attributes ////////

                    //
                    attr.PARCEL_PLAN_NO = polygon.parcel_name;
                    attr.MUNICIPALITY_NAME = spatialRes["MUNICIPALITY_NAME"];
                    attr.DISTRICT_NAME = spatialRes["DISTRICT_NAME"];
                    attr.SUB_MUNICIPALITY_NAME =
                      spatialRes["SUB_MUNICIPALITY_NAME"];
                    attr.SUBDIVISION_SPATIAL_ID =
                      spatialRes["SUBDIVISION_SPATIAL_ID"] || null;
                    attr.BLOCK_SPATIAL_ID =
                      spatialRes["BLOCK_SPATIAL_ID"] || null;
                    attr.PLAN_SPATIAL_ID =
                      spatialRes["PLAN_SPATIAL_ID"] || null;
                    attr.USING_SYMBOL =
                      props.mainObject.landData.landData.lands.parcels[0]
                        .attributes.USING_SYMBOL_Code ||
                      props.mainObject.landData.landData.lands.parcels[0]
                        .attributes.USING_SYMBOL;
                    attr.PARCEL_LONG_COORD = polygonlatlng[1];
                    attr.PARCEL_AREA = polygon.area;
                    attr.PARCEL_LAT_COORD = polygonlatlng[0];
                    attr.PLAN_NO =
                      props.mainObject.landData.landData.lands.parcels[0].attributes.PLAN_NO;
                    attr.PARCEL_SPATIAL_ID = parcelSpatialId;

                    graphic.attributes = attr;
                    var pt = graphic.geometry.getExtent().getCenter();
                    pt.spatialReference = new esri.SpatialReference({
                      wkid: 32639,
                    });

                    layerParcels.push(graphic);
                    layerParcels[layerParcels.length - 1].lines = [];
                    layerParcels[layerParcels.length - 1].corners = [];
                    layerParcels[layerParcels.length - 1].northBorder =
                      polygon.data[0].border;
                    layerParcels[layerParcels.length - 1].eastBorder =
                      polygon.data[1].border;
                    layerParcels[layerParcels.length - 1].southBorder =
                      polygon.data[3].border;
                    layerParcels[layerParcels.length - 1].weastBorder =
                      polygon.data[4].border;

                    
                    polygon.data.forEach((boundry) => {
                      if (boundry.name != "main") {
                        var color = [0, 0, 255];
                        var lineDirection = 0;

                        if (boundry.name == "north") {
                          color = [0, 141, 255];
                          lineDirection = 1;
                        } else if (boundry.name == "east") {
                          color = [117, 114, 114];
                          lineDirection = 2;
                        }
                        //wast is east
                        else if (
                          boundry.name == "weast" ||
                          boundry.name == "west"
                        ) {
                          color = [255, 0, 0];
                          lineDirection = 4;
                        } else if (boundry.name == "south") {
                          color = [0, 255, 0];
                          lineDirection = 3;
                        }

                        boundry.data.forEach((line, key) => {
                          if (line.lines) {
                            line.lines.forEach((innerLine) => {
                              innerLine.color = color;
                              //innerLine.polygonNum = count;
                              innerLine.lineDirection = lineDirection;

                              if (
                                innerLine.spatialReference.wkid != 32639 &&
                                pPolygons.delta
                              ) {
                                innerLine.paths[0][0][0] =
                                  innerLine.paths[0][0][0] + pPolygons.delta[0];
                                innerLine.paths[0][0][1] =
                                  innerLine.paths[0][0][1] + pPolygons.delta[1];
                                innerLine.paths[0][1][0] =
                                  innerLine.paths[0][1][0] + pPolygons.delta[0];
                                innerLine.paths[0][1][1] =
                                  innerLine.paths[0][1][1] + pPolygons.delta[1];
                                innerLine.spatialReference =
                                  new esri.SpatialReference({ wkid: 32639 });
                              }

                              var polyline = new esri.geometry.Polyline(
                                innerLine
                              );

                              layerParcels[layerParcels.length - 1].lines.push(
                                polyline
                              );

                              addGraphicToLayer(
                                polyline,
                                map,
                                "boundriesDirection",
                                color,
                                null,
                                null,
                                (response) => {
                                  this.#addLayerFeature(
                                    map,
                                    "boundriesDirection",
                                    response
                                  );
                                }
                              );
                            });
                          }

                          //
                          if (
                            line.spatialReference.wkid != 32639 &&
                            pPolygons.delta
                          ) {
                            line.paths[0][0][0] =
                              line.paths[0][0][0] + pPolygons.delta[0];
                            line.paths[0][0][1] =
                              line.paths[0][0][1] + pPolygons.delta[1];
                            line.paths[0][1][0] =
                              line.paths[0][1][0] + pPolygons.delta[0];
                            line.paths[0][1][1] =
                              line.paths[0][1][1] + pPolygons.delta[1];
                            line.spatialReference = new esri.SpatialReference({
                              wkid: 32639,
                            });
                            delete line.cache;
                          } else if (!line.spatialReference.wkid) {
                            line.spatialReference = new esri.SpatialReference({
                              wkid: 32639,
                            });
                          }

                          var polyline = new esri.geometry.Polyline(line);

                          var point1 = {};

                          point1.x = line.paths[0][0][0];
                          point1.y = line.paths[0][0][1];

                          var latlng = esri.geometry.xyToLngLat(
                            point1.x,
                            point1.y
                          );
                          point1.lat = latlng[0];
                          point1.lng = latlng[1];

                          var point2 = {};
                          point2.x = line.paths[0][1][0];
                          point2.y = line.paths[0][1][1];
                          latlng = esri.geometry.xyToLngLat(point2.x, point2.y);
                          point2.lat = latlng[0];
                          point2.lng = latlng[1];

                          var fromCornerIndex = getCornersIndex(
                            polygon.corners,
                            point1
                          );
                          if (fromCornerIndex == -1) {
                            polygon.corners.push(point1);
                            fromCornerIndex = polygon.corners.length;
                          }
                          var toCornerIndex = getCornersIndex(
                            polygon.corners,
                            point2
                          );
                          if (toCornerIndex == -1) {
                            polygon.corners.push(point2);
                            toCornerIndex = polygon.corners.length;
                          }

                          line = polyline;
                          line.from = fromCornerIndex;
                          line.to = toCornerIndex;
                          line.BOUNDARY_NO = line.from;
                          line.lineDirection = lineDirection;
                          line.parcel_name = polygon.parcel_name;
                          line.POLYGON_PARCEL_SPATIAL_ID = parcelSpatialId;

                          boundry.data[key] = line;

                          layerParcels[layerParcels.length - 1].lines.push(
                            line
                          );

                          var pt = polyline.getExtent().getCenter();
                          pt.spatialReference = new esri.SpatialReference({
                            wkid: 32639,
                          });

                          addParcelNo(
                            pt,
                            map,
                            convertToArabic("" + (+line.text).toFixed(2) + ""),
                            "editlengthGraphicLayer",
                            null,
                            null,
                            null,
                            null,
                            null,
                            null,
                            (response) => {
                              this.#addLayerFeature(
                                map,
                                "editlengthGraphicLayer",
                                response
                              );
                            }
                          );
                          addGraphicToLayer(
                            polyline,
                            map,
                            "boundriesDirection",
                            color,
                            null,
                            null,
                            (response) => {
                              this.#addLayerFeature(
                                map,
                                "boundriesDirection",
                                response
                              );
                            }
                          );
                          addGraphicToLayer(
                            polyline,
                            map,
                            "boundriesDirectionToolTip",
                            null,
                            null,
                            null,
                            (response) => {
                              this.#addLayerFeature(
                                map,
                                "boundriesDirectionToolTip",
                                response
                              );
                            }
                          );
                        });
                      }
                    });

                    layerParcels[layerParcels.length - 1].corners =
                      polygon.corners;

                    // setTimeout(() => {
                    //   zoomToLayer("boundriesDirection", map);
                    // }, 100);

                    //
                    // add polygons to temp layer

                    this.editingTempSurvay.applyEdits(layerParcels, null, null);
                    this.editingTempSurvay.on(
                      "edits-complete",
                      function (evt) {}
                    );
                  });

                  //draw corners
                  layerParcels.forEach((polygon, index) => {
                    var northLength = 0,
                      eastLength = 0,
                      southLength = 0,
                      weastLength = 0;

                    polygon.lines.forEach((line, key) => {
                      var attr = {
                        BOUNDARY_NO: line.BOUNDARY_NO,
                        FROM_CORNER: line.from,
                        TO_CORNER: line.to,
                        BOUNDARY_LENGTH: line.text,
                        PARCEL_SPATIAL_ID: polygon.attributes.PARCEL_SPATIAL_ID,
                        BOUNDARY_DIRECTION: line.lineDirection,
                      };

                      var graphic = new esri.Graphic(line, null, attr, null);
                      polygon.lines[key] = graphic;
                      if (line.lineDirection == 1) {
                        if (!polygon.northDescription)
                          polygon.northDescription = "";

                        northLength += line.text;
                        polygon.northDescription =
                          " طوله " +
                          "<b>" +
                          northLength.toFixed(2) +
                          "</b>" +
                          " م" +
                          " ويحده " +
                          "<b>" +
                          (polygon.northBorder || 0) +
                          "</b>";
                      } else if (line.lineDirection == 4) {
                        if (!polygon.weastDescription)
                          polygon.weastDescription = "";

                        weastLength += line.text;
                        polygon.weastDescription =
                          " طوله " +
                          "<b>" +
                          weastLength.toFixed(2) +
                          "</b>" +
                          " م" +
                          " ويحده " +
                          "<b>" +
                          (polygon.weastBorder || 0) +
                          "</b>";
                      } else if (line.lineDirection == 3) {
                        if (!polygon.southDescription)
                          polygon.southDescription = "";

                        southLength += line.text;
                        polygon.southDescription =
                          " طوله " +
                          "<b>" +
                          southLength.toFixed(2) +
                          "</b>" +
                          " م" +
                          " ويحده " +
                          "<b>" +
                          (polygon.southBorder || 0) +
                          "</b>";
                      } else if (line.lineDirection == 2) {
                        if (!polygon.eastDescription)
                          polygon.eastDescription = "";

                        eastLength += line.text;
                        polygon.eastDescription =
                          " طوله " +
                          "<b>" +
                          eastLength.toFixed(2) +
                          "</b>" +
                          " م" +
                          " ويحده " +
                          "<b>" +
                          (polygon.eastBorder || 0) +
                          "</b>";
                      }
                    });

                    polygon.corners.forEach((corner, key) => {
                      var attr = {
                        CORNER_NO: key + 1,
                        XUTM_COORD: corner.x,
                        YUTM_COORD: corner.y,
                        XGCS_COORD: corner.lng,
                        PARCEL_SPATIAL_ID: polygon.attributes.PARCEL_SPATIAL_ID,
                        YGCS_COORD: corner.lat,
                      };

                      var point = new esri.geometry.Point(
                        corner.x,
                        corner.y,
                        map.spatialReference
                      );

                      var graphic = new esri.Graphic(point, null, attr, null);
                      polygon.corners[key] = graphic;

                      var iconTextPosition = { x: -5, y: 0 };
                      var iconPosition = { x: 0, y: 0 };

                      if (layerParcels.length > 1) {
                        iconPosition = getCornerIconPosition(
                          key + 1,
                          polygon.lines
                        );
                        iconTextPosition.x =
                          iconPosition.x > 0
                            ? iconPosition.x
                            : iconPosition.x - 5;
                        iconTextPosition.y =
                          iconPosition.y > 0
                            ? iconPosition.y
                            : iconPosition.y - 4;
                      }
                    });
                  });

                  DrawIntersectLines();
                  
                  if (callback) {
                    callback();
                  }
                  props.setLoading(false);
                },
                true
              );
            });
          });
        }
      });
    }
  };

  drwFeatures = (map) => {
    
    this.editingTempSurvay = map.getLayer("Proposed_Landbase_Parcel");
    this.editingTempSurvay.applyEdits(this.layerParcels, null, null);
    this.editingTempSurvay.on("edits-complete", function (evt) {});

    this.layerParcels.forEach((polygon) => {
      
      polygon.lines.forEach((line) => {
        addGraphicToLayer(
          line.geometry,
          map,
          "boundriesDirection",
          line.geometry.color,
          null,
          null,
          null
        );
        addParcelNo(
          line.geometry.centroid,
          map,
          convertToArabic("" + (+line.geometry.text).toFixed(2) + ""),
          "editlengthGraphicLayer",
          null,
          null,
          null,
          null,
          null,
          null
        );
      });
    });
  };

  InitailizeAttributeinspector = (props, map, polygon) => {
    LoadModules([
      "esri/dijit/AttributeInspector",
      "dojo/dom-construct",
      "esri/geometry/screenUtils",
      "dojo/domReady!",
    ]).then(([AttributeInspector, domConstruct, screenUtils]) => {
      let editingFeatureLayerFieldsInfo = [
        {
          fieldName: "REMARKS",
          isEditable: true,
          tooltip: "REMARKS",
          label: "ملاحظات:",
        },
        {
          fieldName: "USING_SYMBOL",
          isEditable: true,
          tooltip: "USING_SYMBOL",
          label: "رمز الاستخدام:",
        },
        { fieldName: "DISTRICT_NAME", isEditable: true, label: "الحي:" },
        {
          fieldName: "GCP_NO",
          isEditable: true,
          label: "رقم نقطة التحكم الأرضية:",
        },
        {
          fieldName: "MUNICIPALITY_NAME",
          isEditable: false,
          label: "البلدية:",
        },
        {
          fieldName: "SUBDIVISION_NO",
          isEditable: false,
          label: "رقم التقسيم:",
        },
        {
          fieldName: "PARCEL_AREA",
          isEditable: false,
          label: " مساحة الأرض م2:",
        },
      ];
      let layerInfos = [
        {
          featureLayer: this.editingTempSurvay,
          showAttachments: false,
          isEditable: true,
          showDeleteButton: false,
          fieldInfos: editingFeatureLayerFieldsInfo,
        },
      ];

      if (this.attInspector) {
        this.attInspector.destroy();
      }

      this.attInspector = new AttributeInspector(
        {
          layerInfos: layerInfos,
        },
        domConstruct.create("div")
      );

      var saveButton = new dijit.form.Button(
        { label: "حفظ", class: "saveButton" },
        dojo.create("div")
      );
      var canelButton = new dijit.form.Button(
        { label: "الغاء", class: "cancelButton" },
        dojo.create("div")
      );

      dojo.place(
        saveButton.domNode,
        this.attInspector.deleteBtn.domNode,
        "after"
      );
      dojo.place(
        canelButton.domNode,
        this.attInspector.deleteBtn.domNode,
        "after"
      );

      this.attInspector.on("attribute-change", (evt) => {
        //store the updates to apply when the save button is clicked

        this.updateFeature.attributes[evt.fieldName] = evt.fieldValue;
      });

      canelButton.on("click", () => {
        this.isStartEdit = false;
        map.infoWindow.hide();

        editingFeatureLayerFieldsInfo.forEach((val) => {
          if (val.isEditable && val.fieldName != "PARCEL_PLAN_NO") {
            this.updateFeature.attributes[val.fieldName] = "";
          }
        });

        this.editingTempSurvay.clearSelection();
      });

      saveButton.on("click", () => {
        this.isStartEdit = false;

        this.layerParcels.forEach((value, key) => {
          if (
            value.attributes.OBJECTID == this.updateFeature.attributes.OBJECTID
          ) {
            editingFeatureLayerFieldsInfo.forEach((val) => {
              if (val.isEditable) {
                this.layerParcels[key].attributes[val.fieldName] =
                  this.updateFeature.attributes[val.fieldName];
              }
            });
          }
        });

        this.updateFeature
          .getLayer()
          .applyEdits(null, [this.updateFeature], null);
        map.infoWindow.hide();
        this.editingTempSurvay.clearSelection();
      });

      var selectQuery = new esri.tasks.Query();
      selectQuery.objectIds = [polygon.attributes.OBJECTID];

      zoomToFeature([polygon], map, 8, () => {
        this.editingTempSurvay.selectFeatures(
          selectQuery,
          esri.layers.FeatureLayer.SELECTION_NEW,
          (features) => {
            if (features.length > 0) {
              this.updateFeature = features[0];

              map.infoWindow.hide();
              map.resize();
              map.reposition();
              var mapPoint = this.updateFeature.geometry
                .getExtent()
                .getCenter();
              var screenPoint = screenUtils.toScreenPoint(
                map.extent,
                map.width,
                map.height,
                mapPoint
              );

              //screenPoint.x = "243px";
              if (this.attInspector && this.attInspector.domNode) {
                map.infoWindow.setContent(this.attInspector.domNode);
                map.infoWindow.setTitle(this.updateFeature.getLayer().name);
                map.infoWindow.resize(350, 250);
                map.infoWindow.show(
                  mapPoint,
                  map.getInfoWindowAnchor(screenPoint)
                );
                map.infoWindow.on("hide", (evt) => {
                  this.editingTempSurvay.clearSelection();
                });

                this.isStartEdit = true;
              }
            } else {
              map.infoWindow.hide();
            }
          }
        );
      });
    });
  };
}
