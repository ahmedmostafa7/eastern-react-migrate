import React, { Component } from "react";
import {
  getMap,
  getIsMapLoaded,
  setIsMapLoaded,
} from "main_helpers/functions/filters/state";
import "./submitCADSugData.css";
//import DOMPurify from 'dompurify'
import {
  zoomToFeature,
  generateUUID,
  projectPolygons,
  lineIntersect,
  setDistance,
  between,
  calcPolygonArea,
  lineLength,
  segment_intersection,
  queryTask_updated,
  clone,
  addGraphicToLayer,
  project,
  GetSpatial,
  fromLatLngToDegreeSymbol,
  getSubdivisionCode,
  addParcelNo,
  getCornerIconPosition,
  DrawIntersectLines,
  zoomToLayer,
  clearGraphicFromLayer,
  getInfo,
  getCornersIndex,
  toFixed,
  convertToArabicToMap,
  convertToArabic,
  getFieldDomain,
  convertToEnglish,
  resizeMap,
  getFeatureDomainCode,
} from "../common/common_func";

import { mapUrl } from "../mapviewer/config/map";
import "antd/dist/reset.css";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
import { connect } from "react-redux";

import { LoadModules } from "../common/esri_loader";
import { submitFarzSplitAndMerge } from "../../../../../wizard/modulesObjects/split_merge/steps/request_module/farzSubmitFunction";

export const wasekaFields = {
  selectedLands: {
    field: "select",
    label: "الأراضي المختارة",
    placeholder: "الأراضي المختارة",
    required: true,
    label_key: "PARCEL_PLAN_NO",
    value_key: "PARCEL_PLAN_NO",
    moduleName: "waseka",
  },
  mlkya_type: {
    field: "select",
    label: " نوع وثيقة الملكية  ",
    placeholder: "من فضلك اختر نوع وثيقة الملكية",
    label_key: "name",
    value_key: "id",
    showSearch: true,
    required: true,
    moduleName: "ee",
    data: [
      { id: "1", name: " صك ملكية" },
      { id: "2", name: " أخري" },
    ],
  },
  number_waseka: {
    label: "رقم وثيقة الملكية",
    placeholder: "من فضلك ادخل رقم وثيقة الملكية",
    required: true,
    digits: true,
  },
  date_waseka: {
    label: " تاريخ إصدار وثيقة الملكية",
    placeholder: "من فضلك ادخل تاريخ إصدار وثيقة الملكية",
    field: "hijriDatePicker",
    lessThanToday: true,
    required: true,
  },
  waseka_search: {
    field: "search",
    label: " جهة إصدار وثيقة الملكية ",
    placeholder: "من فضلك اختر جهة إصدار وثيقة الملكية",
    url: `${workFlowUrl}/issuers/searchbymunicabilityid?municapility_id=10513`,
    filter_key: "q",
    label_key: "name",
    required: true,
    onSelect(value, option, values, props) {
      const issuer_id = option.id || "";
      props.change("issuer_id", option.id);
    },
  },
  image_waseka: {
    label: "صورة وثيقة الملكية",
    placeholder: "select file",
    field: "simpleUploader",
    multiple: false,
    required: true,
    uploadUrl: `${host}/uploadMultifiles`,
    fileType: "image/*,.pdf",
    // name: "image",
    // path: SubAttachementUrl + "submission/identity_photo",
  },
  name_waseka: {
    label: "اسم وثيقة الملكية",
    placeholder: "من فضلك ادخل اسم وثيقة الملكية",
    required: true,
    permission: { show_match_value: { mlkya_type: "2" } },
  },
};

export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "lands"),
    ...mapDispatchToProps1(dispatch),
  };
};

class submitCADSuggestedDataComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redrawPolygonArea: 0,
      spatialIDs: 0,
      layerParcels: [],
      updateFeature: null,
      survayLayer: null,
      editingTempSurvay: null,
      isStartEdit: false,
      polygons:
        props.mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels,
      whereContidionToDeleteCornarsBoundires: [],
      parcelSpatialIdsToDeleteFromLandContract: [],
      identifyParcelsToDelete: {},
      attInspector: null,
    };

    this.props.setLoading(true);
    this.isLoaded = true;

    window.finishSplitMergeParcels = () => {
      return submitFarzSplitAndMerge(this.map, this.state);
    };
  }

  componentDidUpdate() {
    if (this.isLoaded) {
      this.isLoaded = false;
      this.map = getMap();
      if (getIsMapLoaded()) {
        setIsMapLoaded(false);
        getInfo().then((res) => {
          getFieldDomain("", res.Landbase_Parcel).then((domains) => {
            this.LayerDomains = domains;
            this.LayerID = res;
            this.DrawParcels();
          });
        });
      }
    }
    return false;
  }

  getIdentifyParcels = () => {
    let { layerParcels } = this.state;
    if (this.props.mainObject?.landData?.landData?.lands?.parcels) {
      this.state["identifyParcelsToDelete"].ObjectIds = [];
      this.state["identifyParcelsToDelete"].Parcels = [];
      this.state["spatialIDs"] =
        this.props.mainObject?.landData?.landData?.lands?.parcels
          .map((d) => {
            return d.attributes.PARCEL_SPATIAL_ID;
          })
          .join(" , ");

      this.props.mainObject?.landData?.landData?.lands?.parcels.forEach(
        (value) => {
          var polygonClass = new esri.geometry.Polygon(value.geometry);

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
                this.state["whereContidionToDeleteCornarsBoundires"].push(
                  "PARCEL_SPATIAL_ID = " + parcel.attributes.PARCEL_SPATIAL_ID
                );
                this.state["parcelSpatialIdsToDeleteFromLandContract"].push(
                  parcel.attributes.PARCEL_SPATIAL_ID
                );

                //عملية حذف
                attr.OPERATION_TYPE = 2;
                attr.ORIGINAL_OBJECTID = attr.OBJECTID;
                attr.ARCHIVE_TIME = new Date();
                attr.USER_NAME = "Test";

                polygonClass = new esri.geometry.Polygon(parcel.geometry);
                var graphic = new esri.Graphic(polygonClass, null, attr, null);
                this.state["identifyParcelsToDelete"].Parcels.push(graphic);
                const {
                  input: { value },
                } = this.props;
                this.settoStore((value && value.layerParcels) || layerParcels);
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
            this.map.spatialReference
          );
        }
      );
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

  getTextLinePosition = (lineDirection) => {
    var out = { x: 0, y: 0 };

    if (lineDirection == 1) {
      out.y = 25;
    } else if (lineDirection == 4) {
      out.x = 10;
    } else if (lineDirection == 3) {
      out.y = -10;
    } else if (lineDirection == 2) {
      out.x = -40;
    }

    return out;
  };

  GetSpatialData = (pt, PARCEL_SPATIAL_ID) => {
    return new Promise((resolve, reject) => {
      var count = 0;
      var data = {};

      queryTask_updated(
        mapUrl + "/" + this.LayerID.Landbase_Parcel,
        "PARCEL_SPATIAL_ID=" + PARCEL_SPATIAL_ID,
        ["*"],
        (res) => {
          count++;

          if (res.features && res.features.length > 0) {
            Object.keys(res.features[0].attributes).forEach((key) => {
              if (!data[key]) {
                data[key] = res.features[0].attributes[key];
              }
            });
          }

          if (count == 6) resolve(data);
        },
        (error) => {
          reject();
        },
        null,
        true,
        undefined,
        this.map.spatialReference
      );

      queryTask_updated(
        mapUrl + "/" + this.LayerID.Plan_Data,
        "",
        ["PLAN_SPATIAL_ID"],
        (res) => {
          count++;

          if (res.features && res.features.length > 0)
            data["PLAN_SPATIAL_ID"] =
              res.features[0].attributes["PLAN_SPATIAL_ID"];

          if (count == 6) resolve(data);
        },
        (error) => {
          reject();
        },
        (query, Query) => {
          query.geometry = new esri.geometry.Point(pt);
          query.distance = 1;
        },
        true,
        undefined,
        this.map.spatialReference
      );

      queryTask_updated(
        mapUrl + "/" + this.LayerID.Survey_Block,
        "",
        ["BLOCK_SPATIAL_ID"],
        (res) => {
          count++;

          if (res.features && res.features.length > 0) {
            data["BLOCK_SPATIAL_ID"] =
              res.features[0].attributes["BLOCK_SPATIAL_ID"];
            data["PARCEL_BLOCK_NO"] = res.features[0].attributes["BLOCK_NO"];
          }

          if (count == 6) resolve(data);
        },
        (error) => {
          reject();
        },
        (query, Query) => {
          query.geometry = new esri.geometry.Point(pt);
          query.distance = 1;
        },
        true,
        undefined,
        this.map.spatialReference
      );

      queryTask_updated(
        mapUrl + "/" + this.LayerID.Subdivision,
        "",
        ["SUBDIVISION_TYPE", "SUBDIVISION_SPATIAL_ID"],
        (res) => {
          count++;

          if (res.features && res.features.length > 0) {
            data["SUBDIVISION_TYPE"] =
              res.features[0].attributes["SUBDIVISION_TYPE"];
            data["SUBDIVISION_SPATIAL_ID"] =
              res.features[0].attributes["SUBDIVISION_SPATIAL_ID"];
          }

          if (count == 6) resolve(data);
        },
        (error) => {
          reject();
        },
        (query, Query) => {
          query.geometry = new esri.geometry.Point(pt);
          query.distance = 1;
        },
        true,
        undefined,
        this.map.spatialReference
      );

      queryTask_updated(
        mapUrl + "/" + this.LayerID.Municipality_Boundary,
        "",
        ["MUNICIPALITY_NAME"],
        (res) => {
          count++;

          if (res.features && res.features.length > 0) {
            data["MUNICIPALITY_NAME"] =
              res.features[0].attributes["MUNICIPALITY_NAME"];
          }

          if (count == 6) resolve(data);
        },
        (error) => {
          reject();
        },
        (query, Query) => {
          query.geometry = new esri.geometry.Point(pt);
          query.distance = 1;
        },
        true,
        undefined,
        this.map.spatialReference
      );

      queryTask_updated(
        mapUrl + "/" + this.LayerID.District_Boundary,
        "",
        ["SUB_MUNICIPALITY_NAME", "DISTRICT_NAME"],
        (res) => {
          count++;

          if (res.features && res.features.length > 0) {
            data["SUB_MUNICIPALITY_NAME"] =
              res.features[0].attributes["SUB_MUNICIPALITY_NAME"];
            data["DISTRICT_NAME"] = res.features[0].attributes["DISTRICT_NAME"];
          }

          if (count == 6) resolve(data);
        },
        (error) => {
          reject();
        },
        (query, Query) => {
          query.geometry = new esri.geometry.Point(pt);
          query.distance = 1;
        },
        true,
        undefined,
        this.map.spatialReference
      );
    });
  };

  DrawParcels = () => {
    let { polygons, layerParcels, redrawPolygonArea } = this.state;

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
    } = this.props;
    this.state["survayLayer"] = this.map.getLayer("Landbase_Parcel");
    this.state["editingTempSurvay"] = this.map.getLayer(
      "Proposed_Landbase_Parcel"
    );

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
      var spatialR = this.map.spatialReference; //: new esri.SpatialReference({ wkid: 32639 });
      polygons.forEach((polygon) => {
        polygon.parcel_name = convertToEnglish(polygon.parcel_name);

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
    if (this.map) {
      projectPolygons(polygons).then((pPolygons) => {
        polygons = pPolygons.polygons || pPolygons;
        this.getIdentifyParcels();

        clearGraphicFromLayer(this.map, "boundriesDirection");
        clearGraphicFromLayer(this.map, "boundriesDirectionToolTip");

        this.map
          .getLayer("boundriesDirectionToolTip")
          .on("mouse-move", (evt) => {
            if (!this.state["isStartEdit"]) {
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

              this.map.infoWindow.setTitle("معلومات الأرض");
              this.map.infoWindow.setContent(content);
              this.map.infoWindow.resize(350, 300);
              this.map.infoWindow.show(
                evt.screenPoint,
                this.map.getInfoWindowAnchor(evt.screenPoint)
              );
            }
          });

        this.map
          .getLayer("boundriesDirectionToolTip")
          .on("mouse-out", (evt) => {
            if (!this.state["isStartEdit"]) {
              this.map.infoWindow.hide();
            }
          });

        window.onDragShatfaLayer = [];
        window.onDragShatfaLayer.push((event) => {
          //

          this.map.getLayer("shatfaGraphicLayer").remove(event.graphic);
          var line = event.graphic;
          permanentSlope =
            (line.geometry.paths[0][1][1] - line.geometry.paths[0][0][1]) /
            (line.geometry.paths[0][1][0] - line.geometry.paths[0][0][0]);

          event.mapPoint.x += 1.3000009;
          var newLine = setDistance(event.mapPoint, permanentSlope, 10);
          addGraphicToLayer(
            newLine,
            this.map,
            "shatfaGraphicLayer",
            [0, 0, 255, 0.5],
            null,
            null,
            null,
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

            redrawPolygonArea = calcPolygonArea(parcel.geometry.rings);

            if (redrawPolygonArea)
              this.setState({ redrawPolygonArea: redrawPolygonArea });

            //isClockWise = parcel.isClockwise(parcel.geometry.rings[0])

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
              this.map.getLayer("highlightDeletedGraphicLayer").clear();
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

              this.setState({ redrawPolygonArea: redrawPolygonArea });

              parcel.pendingGeometry = polygonClass;
              addGraphicToLayer(
                polygonClass,
                this.map,
                "highlightDeletedGraphicLayer",
                [0, 0, 0, 1],
                null,
                null,
                null,
                null,
                null,
                true
              );
            }
          });
        });

        clearGraphicFromLayer(this.map, "highlightBoundriesGraphicLayer");
        clearGraphicFromLayer(this.map, "addedParclGraphicLayer");
        //clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
        clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
        clearGraphicFromLayer(this.map, "pictureGraphicLayer");

        if (polygons) {
          var polygonClass = new esri.geometry.Polygon(polygons[0].polygon);

          var graphic = new esri.Graphic(polygonClass, null, null, null);
          var pt = graphic.geometry.getExtent().getCenter();
          //
          pt.spatialReference = new esri.SpatialReference({ wkid: 32639 });

          this.GetSpatialData(
            pt,
            this.props.mainObject?.landData?.landData?.lands?.parcels[0]
              .attributes.PARCEL_SPATIAL_ID
          ).then((spatialRes) => {
            getFeatureDomainCode(
              [
                {
                  attributes: {
                    DETAILED_LANDUSE:
                      this.props.mainObject?.landData?.landData?.lands
                        ?.parcels[0].attributes.DETAILED_LANDUSE,
                    CITY_NAME:
                      this.props.mainObject?.landData?.landData?.lands
                        ?.parcels[0].attributes.CITY_NAME,
                    ACTUAL_MAINLANDUSE:
                      this.props.mainObject?.landData?.landData?.lands
                        ?.parcels[0].attributes.ACTUAL_MAINLANDUSE,
                  },
                },
              ],
              this.map.getLayer("Proposed_Landbase_Parcel").layerId
            ).then((domainValues) => {
              var projectedPoints = [];

              polygons.forEach((polygon) => {
                var polygonClass = new esri.geometry.Polygon(polygon.polygon);
                polygon.corners = [];
                var graphic = new esri.Graphic(polygonClass, null, null, null);
                projectedPoints.push(graphic.geometry.getExtent().getCenter());
              });

              this.map.getLayer("editlengthGraphicLayer").clear();

              var cadResults =
                this.props.mainObject.data_msa7y.msa7yData.cadDetails.temp
                  .cadResults;
              if (cadResults && cadResults.lineFeatures) {
                cadResults.lineFeatures.forEach((line) => {
                  this.map.disablePan();
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
                    this.map,
                    "shatfaGraphicLayer",
                    [0, 0, 255, 0.5],
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    20
                  );
                });
              }
              // else if(wc.mainObject.suggestion_parcel)
              // {
              //     wc.mainObject.suggestion_parcel.cad_file[0].lineFeatures.forEach(function (line) {

              //             this.map.disablePan();
              //             var polyline = new esri.geometry.Polyline(line);
              //             permanentSlope = (line.paths[0][1][1] - line.paths[0][0][1]) / (line.paths[0][1][0] - line.paths[0][0][0]);
              //             var newLine = cadsub.setDistance(polyline.getExtent().getCenter() , permanentSlope , 10)
              //             commonMapServ.addGraphicToLayer(newLine, this.map, "editlengthGraphicLayer", [0, 0, 255, 0.5],null,null,null,null,null,null,null,10);
              //     });
              // }

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
                      this.props.mainObject?.landData?.landData?.lands
                        ?.parcels[0].attributes.USING_SYMBOL_Code ||
                      this.props.mainObject?.landData?.landData?.lands
                        ?.parcels[0].attributes.USING_SYMBOL;
                    attr.PARCEL_LONG_COORD = polygonlatlng[1];
                    attr.PARCEL_AREA = polygon.area;
                    attr.PARCEL_LAT_COORD = polygonlatlng[0];
                    attr.PLAN_NO =
                      this.props.mainObject?.landData?.landData?.lands?.parcels[0].attributes.PLAN_NO;
                    attr.PARCEL_SPATIAL_ID = parcelSpatialId;

                    //////////////////////////////////////
                    /////////////////////////////////////

                    /*var attr = {
                        //"OBJECTID": this.props.mainObject?.landData?.landData?.lands?.parcels.find(parcel => parcel.attributes.PARCEL_PLAN_NO == polygon.parcel_name).attributes.OBJECTID,
                        PARCEL_PLAN_NO: polygon.parcel_name,
                        PARCEL_BLOCK_NO:
                          this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                            .attributes.PARCEL_BLOCK_NO || "",
                        BLDG_CONDITIONS:
                          this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                            .attributes.BLDG_CONDITIONS || "",
                        SUBDIVISION_DESCRIPTION:
                          this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                            .attributes.SUBDIVISION_DESCRIPTION || "",
                        SUBDIVISION_TYPE:
                          getSubdivisionCode(
                            this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                              .attributes.SUBDIVISION_TYPE
                            , this.LayerDomains.find((l) => l.name == "SUBDIVISION_TYPE")) || null,
                        DISTRICT_NAME: spatialRes["DISTRICT_NAME"],
                        SUB_MUNICIPALITY_NAME: spatialRes["SUB_MUNICIPALITY_NAME"],
                        SUBDIVISION_SPATIAL_ID:
                          spatialRes["SUBDIVISION_SPATIAL_ID"] || null,
                        BLOCK_SPATIAL_ID: spatialRes["BLOCK_SPATIAL_ID"] || null,
                        PLAN_SPATIAL_ID: spatialRes["PLAN_SPATIAL_ID"] || null,
                        USING_SYMBOL:
                          this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                            .attributes.USING_SYMBOL_Code || this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                              .attributes.USING_SYMBOL,
                        MUNICIPALITY_NAME: spatialRes["MUNICIPALITY_NAME"],
                        PLAN_NO:
                          this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                            .attributes.PLAN_NO,
                        PARCEL_LONG_COORD: polygonlatlng[1],
                        PARCEL_AREA: polygon.area,
                        PARCEL_LAT_COORD: polygonlatlng[0],
                        PARCEL_SPATIAL_ID: parcelSpatialId,
                        PARCEL_SUB_LUSE:
                          this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                            .attributes.PARCEL_SUB_LUSE_Code || this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                              .attributes.PARCEL_SUB_LUSE,
                        PARCEL_MAIN_LUSE:
                          this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                            .attributes.PARCEL_MAIN_LUSE_Code || this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                              .attributes.PARCEL_MAIN_LUSE,
                        STREET_NAME: this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                          .attributes.STREET_NAME,
                        DETAILED_LANDUSE: domainValues[0].attributes.DETAILED_LANDUSE,
                        CITY_NAME: domainValues[0].attributes.CITY_NAME,
                        ACTUAL_MAINLANDUSE: domainValues[0].attributes.ACTUAL_MAINLANDUSE,
                        LANDMARK_NAME: this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                          .attributes.LANDMARK_NAME,
                        UNITS_NUMBER:
                          this.props.mainObject?.landData?.landData?.lands?.parcels[0]
                            .attributes.UNITS_NUMBER,
                      };*/

                    /*addGraphicToLayer(
                        polygonClass,
                        this.map,
                        "addedParclGraphicLayer",
                        [0, 0, 0, 0.01],
                        null,
                        false,
                        () => { },
                        attr,
                        null,
                        true
                      );*/

                    graphic.attributes = attr;
                    var pt = graphic.geometry.getExtent().getCenter();
                    pt.spatialReference = new esri.SpatialReference({
                      wkid: 32639,
                    });

                    // addParcelNo(
                    //   pt,
                    //   this.map,
                    //   convertToArabic("" + polygon.parcel_name + ""),
                    //   "PacrelNoGraphicLayer",
                    //   30,
                    //   [255, 0, 0],
                    //   -10
                    // );

                    layerParcels.push(graphic);
                    layerParcels[layerParcels.length - 1].lines = [];
                    layerParcels[layerParcels.length - 1].corners = [];
                    layerParcels[layerParcels.length - 1].northBorder =
                      polygon.data[0].border || polygon.north_Desc;
                    layerParcels[layerParcels.length - 1].eastBorder =
                      polygon.data[1].border || polygon.east_Desc;
                    layerParcels[layerParcels.length - 1].southBorder =
                      polygon.data[3].border || polygon.south_Desc;
                    layerParcels[layerParcels.length - 1].weastBorder =
                      polygon.data[4].border || polygon.west_Desc;

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
                                this.map,
                                "boundriesDirection",
                                color
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
                            this.map,
                            convertToArabic("" + (+line.text).toFixed(2) + ""),
                            "editlengthGraphicLayer",
                            null,
                            null,
                            null
                          );
                          addGraphicToLayer(
                            polyline,
                            this.map,
                            "boundriesDirection",
                            color
                          );
                          addGraphicToLayer(
                            polyline,
                            this.map,
                            "boundriesDirectionToolTip"
                          );
                        });
                      }
                    });

                    layerParcels[layerParcels.length - 1].corners =
                      polygon.corners;

                    // setTimeout(() => {
                    //   zoomToLayer("boundriesDirection", this.map);
                    // }, 100);

                    resizeMap(this.map);

                    //
                    // add polygons to temp layer

                    this.state["editingTempSurvay"].applyEdits(
                      layerParcels,
                      null,
                      null
                    );
                    this.state["editingTempSurvay"].on(
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
                        this.map.spatialReference
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

                      //commonMapServ.addGraphicToLayer(point, this.map, "pictureGraphicLayer", null, null, null, null, null, iconPosition);
                      //commonMapServ.addParcelNo(point, this.map, "" + (key + 1) + "", "PacrelNoGraphicLayer", 12, [0, 0, 0], null, iconTextPosition);
                    });
                  });

                  DrawIntersectLines();

                  this.settoStore(
                    (value && value.layerParcels) || layerParcels
                  );

                  //$rootScope.showLoading = false;
                  this.props.setLoading(false);
                },
                true
              );
            });
          });
        }
      });
    }
  };

  settoStore(parcels) {
    const { input } = this.props;

    var value = input.value;
    var inputChanged = {
      ...value,
      layerParcels: parcels,
      parcelSpatialIdsToDeleteFromLandContract:
        this.state["parcelSpatialIdsToDeleteFromLandContract"] ||
        (value && value.parcelSpatialIdsToDeleteFromLandContract) ||
        [],
      whereContidionToDeleteCornarsBoundires:
        this.state["whereContidionToDeleteCornarsBoundires"] ||
        (value && value.whereContidionToDeleteCornarsBoundires) ||
        [],
      identifyParcelsToDelete:
        this.state["identifyParcelsToDelete"] ||
        (value && value.identifyParcelsToDelete) ||
        [],
    };

    input.onChange({ ...inputChanged });

    this.setState({
      ...inputChanged,
    });
  }

  saveEditablePolygon = () => {
    const { layerParcels } = this.state;
    if (layerParcels && layerParcels.length) {
      layerParcels.forEach((parcel) => {
        if (parcel.pendingGeometry) {
          parcel.geometry = parcel.pendingGeometry;
        }
      });
    }
  };

  InitailizeAttributeinspector = (polygon) => {
    let { layerParcels } = this.state;

    //this.state["editingTempSurvay"]._outFields = ['USING_SYMBOL'];

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
          featureLayer: this.state["editingTempSurvay"],
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

        this.state["updateFeature"].attributes[evt.fieldName] = evt.fieldValue;
      });

      canelButton.on("click", () => {
        this.state["isStartEdit"] = false;
        this.map.infoWindow.hide();

        editingFeatureLayerFieldsInfo.forEach((val) => {
          if (val.isEditable && val.fieldName != "PARCEL_PLAN_NO") {
            this.state["updateFeature"].attributes[val.fieldName] = "";
          }
        });

        this.state["editingTempSurvay"].clearSelection();
        // this.state["updateFeature"] = null;
      });

      saveButton.on("click", () => {
        this.state["isStartEdit"] = false;

        layerParcels.forEach((value, key) => {
          if (
            value.attributes.OBJECTID ==
            this.state["updateFeature"].attributes.OBJECTID
          ) {
            editingFeatureLayerFieldsInfo.forEach((val) => {
              if (val.isEditable) {
                layerParcels[key].attributes[val.fieldName] =
                  this.state["updateFeature"].attributes[val.fieldName];
                //$scope.$apply();
              }
            });
          }
        });

        this.state["updateFeature"]
          .getLayer()
          .applyEdits(null, [this.state["updateFeature"]], null);
        this.map.infoWindow.hide();
        this.state["editingTempSurvay"].clearSelection();
        // this.state["updateFeature"] = null;
      });

      var selectQuery = new esri.tasks.Query();
      selectQuery.objectIds = [polygon.attributes.OBJECTID];

      zoomToFeature([polygon], this.map, 8, () => {
        this.state["editingTempSurvay"].selectFeatures(
          selectQuery,
          esri.layers.FeatureLayer.SELECTION_NEW,
          (features) => {
            if (features.length > 0) {
              this.state["updateFeature"] = features[0];

              this.map.infoWindow.hide();
              this.map.resize();
              this.map.reposition();
              var mapPoint = this.state["updateFeature"].geometry
                .getExtent()
                .getCenter();
              var screenPoint = screenUtils.toScreenPoint(
                this.map.extent,
                this.map.width,
                this.map.height,
                mapPoint
              );

              //screenPoint.x = "243px";
              if (this.attInspector && this.attInspector.domNode) {
                this.map.infoWindow.setContent(this.attInspector.domNode);
                this.map.infoWindow.setTitle(
                  this.state["updateFeature"].getLayer().name
                );
                this.map.infoWindow.resize(350, 250);
                this.map.infoWindow.show(
                  mapPoint,
                  this.map.getInfoWindowAnchor(screenPoint)
                );
                this.map.infoWindow.on("hide", (evt) => {
                  this.state["editingTempSurvay"].clearSelection();
                  // this.state["updateFeature"] = null;
                });
                // setTimeout(() => {
                //
                //   document.getElementsByClassName("close")[0].onClick = (evt) => {
                //
                //     this.state["editingTempSurvay"].clearSelection();
                //     // this.state["updateFeature"] = null;
                //   }
                // }, 1000)

                this.state["isStartEdit"] = true;
              }
            } else {
              this.map.infoWindow.hide();
            }
          }
        );
      });
    });
  };

  edit = (polygon, evt) => {
    this.InitailizeAttributeinspector(polygon);
    var el = document.querySelector(".wizard-container");
    //el.scrollTop = el.scrollHeight;
    setTimeout(function () {
      el.scrollTop = 0;
    }, 500);
    evt.preventDefault();
  };
  addSak = (parcel, scope) => {
    const { mainObject, setMain } = scope.props;
    const { layerParcels } = scope.state;

    var fields = wasekaFields;

    if (!parcel.contract) fields.selectedLands.data = [parcel.attributes];

    setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...parcel.contract },
          ok(values) {
            values.unique_id = generateUUID();
            values.municipilty_id =
              mainObject.landData.landData.lands.parcels[0].attributes.MUNICIPALITY_NAME_Code;
            values.PLAN_NO =
              mainObject.landData.landData.lands.parcels[0].attributes.PLAN_NO;
            values.PARCEL_PLAN_NO =
              mainObject.landData.landData.lands.parcels[0].attributes.PARCEL_PLAN_NO;
            values.PARCEL_BLOCK_NO =
              mainObject.landData.landData.lands.parcels[0].attributes.PARCEL_BLOCK_NO;
            parcel.contract = values;
            scope.settoStore(layerParcels);
            return Promise.resolve(true);
          },
        },
      },
    });
  };
  removeSak = (parcel, evt) => {
    const { layerParcels } = this.state;
    if (parcel.contract) {
      parcel.contract = null;
      this.settoStore(layerParcels);
    }
  };

  render() {
    const { redrawPolygonArea, spatialIDs, layerParcels } = this.state;
    return (
      <div className="col-md-12">
        <div style={{ marginTop: "10px" }}>
          المساحة :{redrawPolygonArea > 0 ? redrawPolygonArea : ""}
          {redrawPolygonArea > 0 && (
            <button
              className="btn btn-primary btn-margin"
              type="button"
              name="name"
              style={{ marginRight: "50px" }}
              onClick={this.saveEditablePolygon.bind(this)}
            >
              حفظ
            </button>
          )}
        </div>

        <div style={{ marginTop: "10px" }}>spatial ids : {spatialIDs}</div>

        <table
          className="table table-bordered no-margin"
          style={{ marginTop: "23px" }}
        >
          <thead>
            <tr>
              <th>رقم قطعة الأرض</th>
              <th>وصف الحدود</th>
              <th>خيارات</th>
            </tr>
          </thead>
          <tbody>
            {layerParcels.map((parcel, index) => {
              return (
                <tr key={index}>
                  <td>{convertToArabic(parcel.attributes.PARCEL_PLAN_NO)}</td>
                  <td>
                    <b>الحد الشمالي :</b>
                    <br />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: convertToArabic(parcel.northDescription),
                      }}
                    ></span>
                    <br />
                    <br />
                    <b>الحد الشرقي :</b>
                    <br />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: convertToArabic(parcel.eastDescription),
                      }}
                    ></span>
                    <br />
                    <br />
                    <b>الحد الجنوبي :</b>
                    <br />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: convertToArabic(parcel.southDescription),
                      }}
                    ></span>
                    <br />
                    <br />
                    <b>الحد الغربي :</b>
                    <br />
                    <span
                      dangerouslySetInnerHTML={{
                        __html: convertToArabic(parcel.weastDescription),
                      }}
                    ></span>
                  </td>
                  <td>
                    <button
                      className="btn follow"
                      type="button"
                      name="name"
                      onClick={this.edit.bind(this, parcel)}
                    >
                      تعديل
                    </button>
                    {!parcel.contract && (
                      <button
                        className="btn follow"
                        type="button"
                        name="name"
                        onClick={() => {
                          this.addSak(parcel, this);
                        }}
                      >
                        إضافة صك
                      </button>
                    )}
                    {parcel.contract && (
                      <button
                        className="btn follow"
                        type="button"
                        name="name"
                        onClick={this.removeSak.bind(this, parcel)}
                      >
                        مسح صك
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  appMapDispatchToProps
)(submitCADSuggestedDataComponent);
