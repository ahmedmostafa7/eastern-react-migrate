import React, { Component } from "react";
import { Tabs, message } from "antd";
const { TabPane } = Tabs;
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import axios from "axios";
import {
  queryTask,
  getInfo,
  highlightFeature,
  getPolygons,
  addGraphicToLayer,
  clearGraphicFromLayer,
  getFeatureDomainName,
  intersectQueryTask,
  project,
  addParcelNo,
  zoomToLayer,
  GetSpatial,
  resizeMap,
  computePointDirection,
  convertToArabic,
  applyEditsMultiple,
} from "../common/common_func";
import { workFlowUrl } from "imports/config";
import { LoadModules } from "../common/esri_loader";
import { mapUrl } from "../mapviewer/config/map";
import { Select, Button, Form } from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import { connect } from "react-redux";
// import axios from "axios";
import { get } from "lodash";
import { querySetting } from "../IdentifyComponnentCoord/Helpers";
import { timeout } from "d3";
import { json } from "d3";
const { Option } = Select;
const tabsCm = [
  { title: "1", key: "1" },
  { title: "2", key: "2" },
];

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: "2px",
  fontSize: "20px",
  marginRight: "13px",
  float: "right",
  // change background colour if dragging
  background: "#E0E0E0",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const dragStyle = {
  float: "right",
  marginRight: "13px",
  backgroundColor: "#E0E0E0",
  padding: "2px",
};

const getListStyle = (isDraggingOver) => ({
  //background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: "100%",
  height: "60px",
});

const itemContainerNorth = {
  borderTop: "13px solid #008DFF",
  margin: "auto",
  height: "auto",
  width: "500px",
  backgroundColor: "white",
  boxShadow: "1px 1px 3px #505050",
  cursor: "pointer",
  borderRadius: "10px",
  padding: "5px",
  minHeight: "152px",
  overflow: "auto",
};

const itemContainerWeast = {
  borderLeft: "13px solid red",
  height: "auto",
  margin: "auto",
  width: "500px",
  marginTop: "15px",
  backgroundColor: "white",
  boxShadow: "1px 1px 3px #505050",
  cursor: "pointer",
  borderRadius: "10px",
  padding: "5px",
  minHeight: "152px",
  overflow: "auto",
};

const itemContainerEmpty = {
  height: "auto",
  margin: "35px 88px auto",
  width: "500px",
  marginTop: "15px",
  backgroundColor: "white",
  boxShadow: "1px 1px 3px #505050",
  cursor: "pointer",
  borderRadius: "10px",
  padding: "5px",
  minHeight: "152px",
  overflow: "auto",
};

const itemContainerEast = {
  borderRight: "13px solid #8A8A8A",
  height: "auto",
  width: "500px",
  marginTop: "15px",
  backgroundColor: "white",
  boxShadow: "1px 1px 3px #505050",
  cursor: "pointer",
  borderRadius: "10px",
  padding: "5px",
  minHeight: "152px",
  overflow: "auto",
};

const itemContainerSouth = {
  borderBottom: "13px solid #09F869",
  margin: "auto",
  height: "auto",
  width: "500px",
  marginTop: "15px",
  backgroundColor: "white",
  boxShadow: "1px 1px 3px #505050",
  cursor: "pointer",
  borderRadius: "10px",
  padding: "5px",
  minHeight: "152px",
  overflow: "auto",
};
class updateMapFiled extends Component {
  props = {};
  self = null;
  constructor(props) {
    super(props);

    self = this;
    this.props = props;
    this.cadData =
      (this.props.input.value &&
        this.props.input.value.temp &&
        this.props.input.value.temp.cadData) ||
      undefined;
    this.state = {
      polygons: [],
      activeKey: "1",
      mapLoaded: false,
      serviceVal: null,
      serviceSubTypeVal: null,
      servicesSubTypes: [],
      bufferDistance: null,
      servicesTypes: [],
      resultServices: [],
      lands: [],
      weastBoundries: [],
      northBoundries: [],
      eastBoundries: [],
      southBoundries: [],
    };
    this.baseState = this.state;

    if (
      this.props.input &&
      this.props.input.value &&
      this.props.input.value.polygons
    ) {
      this.props.input.value.polygons.forEach((polygon, key) => {
        this.state["north_Desc" + key] = polygon.north_Desc;
        this.state["weast_Desc" + key] = polygon.weast_Desc;
        this.state["south_Desc" + key] = polygon.south_Desc;
        this.state["east_Desc" + key] = polygon.east_Desc;

        this.state["parcel_Name" + key] = polygon.parcel_name;
        this.state["parcel_area_desc" + key] = polygon.parcel_area_desc;

        if (polygon.shtfa_northeast) {
          this.state["shtfa_northeast"] = polygon.shtfa_northeast;
        }
        if (polygon.shtfa_northweast) {
          this.state["shtfa_northweast"] = polygon.shtfa_northweast;
        }
        if (polygon.shtfa_southeast) {
          this.state["shtfa_southeast"] = polygon.shtfa_southeast;
        }
        if (polygon.shtfa_southweast) {
          this.state["shtfa_southweast"] = polygon.shtfa_southweast;
        }
      });
    }
  }

  /**
   * A semi-generic way to handle multiple lists. Matches
   * the IDs of the droppable container to the names of the
   * source arrays stored in the state.
   */
  id2List = {
    droppable_North: "northBoundries",
    droppable_South: "southBoundries",
    droppable_East: "eastBoundries",
    droppable_Weast: "weastBoundries",
  };

  getList = (id) => this.state[this.id2List[id]];

  onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      let state = { items };

      if (source.droppableId === "droppable_South") {
        state = { southBoundries: items };
      }
      if (source.droppableId === "droppable_North") {
        state = { northBoundries: items };
      }
      if (source.droppableId === "droppable_East") {
        state = { eastBoundries: items };
      }
      if (source.droppableId === "droppable_Weast") {
        state = { weastBoundries: items };
      }

      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      if (result.droppable_North) {
        this.Polygons[+this.state.activeKey - 1].data[0].data =
          result.droppable_North.map((item) => {
            return item.data;
          });
      }
      if (result.droppable_Weast) {
        this.Polygons[+this.state.activeKey - 1].data[3].data =
          result.droppable_Weast.map((item) => {
            return item.data;
          });
      }
      if (result.droppable_South) {
        this.Polygons[+this.state.activeKey - 1].data[4].data =
          result.droppable_South.map((item) => {
            return item.data;
          });
      }
      if (result.droppable_East) {
        this.Polygons[+this.state.activeKey - 1].data[1].data =
          result.droppable_East.map((item) => {
            return item.data;
          });
      }

      this.dropSuccess();
      this.calculateLines();

      this.setState({
        northBoundries: result.droppable_North || this.state.northBoundries,
        southBoundries: result.droppable_South || this.state.southBoundries,
        eastBoundries: result.droppable_East || this.state.eastBoundries,
        weastBoundries: result.droppable_Weast || this.state.weastBoundries,
      });
    }
  };

  componentDidMount() {
    getInfo(addedParcelMapServiceUrl).then((res) => {
      // ////
      this.LayerID = res;
    });

    window.updateMap = function () {
      return new Promise((resolve, reject) => {
        var landbase_layer = self.LayerID.Landbase_Parcel;
        var landbase_history_layer = self.LayerID.Landbase_Parcel_H;

        var where = self.props.mainObject.landData.landData.lands.parcels.map(
          (d) => {
            return (
              "( PARCEL_SPATIAL_ID =" +
              d.attributes.PARCEL_SPATIAL_ID +
              " and PARCEL_PLAN_NO = '" +
              d.attributes.PARCEL_PLAN_NO +
              "'" +
              ")"
            );
          }
        );

        let transactionList = [];

        if (where.length > 0) {
          queryTask({
            url: addedParcelMapServiceUrl + "/" + self.LayerID.Landbase_Parcel,
            where: where.join(" or "),
            returnGeometry: true,
            outFields: ["*"],
            callbackResult: (res) => {
              if (res.features.length > 0) {
                res.features.forEach((f) => {
                  //عملية حذف
                  f.attributes.OPERATION_TYPE = 2;
                  f.attributes.ORIGINAL_OBJECTID = f.attributes.OBJECTID;
                  f.attributes.ARCHIVE_TIME = new Date()
                    .toLocaleString()
                    .replace(",", "");
                  f.attributes.USER_NAME = "gis";
                });

                //add to history
                transactionList.push({
                  id: landbase_history_layer,
                  adds: res.features.map((x) => {
                    return {
                      attributes: x.attributes,
                      geometry: x.geometry,
                    };
                  }),
                });

                var updatedFeatures = [];

                self.Polygons.filter((p) => {
                  return p.polygon.layer == "boundry";
                }).forEach((polygon) => {
                  var polygonClass = new esri.geometry.Polygon(polygon.polygon);
                  var graphic = new esri.Graphic(
                    polygonClass,
                    null,
                    null,
                    null
                  );
                  let objectId = res.features.find(
                    (x) => x.attributes.PARCEL_PLAN_NO == polygon.parcel_name
                  )?.attributes.OBJECTID;
                  graphic.attributes = {
                    PARCEL_AREA: polygon.area,
                    OBJECTID: objectId,
                  };
                  updatedFeatures.push(graphic);
                });

                transactionList.push({
                  id: landbase_layer,
                  updates: updatedFeatures.map((x) => {
                    return {
                      attributes: {
                        PARCEL_AREA: x.attributes.PARCEL_AREA,
                        OBJECTID: x.attributes.OBJECTID,
                      },
                      geometry: x.geometry,
                    };
                  }),
                });

                applyEditsMultiple(
                  addedParcelMapServiceUrl,
                  JSON.stringify(transactionList)
                ).then(
                  (data) => {
                    resolve(true);
                  },
                  () => {
                    reject();
                    window.notifySystem(
                      "error",
                      "حدث خطأ أثناء إنهاء المعاملة"
                    );
                  }
                );
              } else {
                reject();
              }
            },
          });
        } else {
          reject();
        }
      });
    };
  }

  dragLength(event) {
    console.log(event);
    this.map.getLayer("editlengthGraphicLayer").remove(event.graphic);
    addParcelNo(
      event.mapPoint,
      this.map,
      "" + event.graphic.attributes["text"],
      "editlengthGraphicLayer",
      35,
      null,
      event.graphic.attributes["angle"],
      null,
      {
        text: event.graphic.attributes["text"],
        angle: event.graphic.attributes["angle"],
      }
    );
  }

  moveBoundries() {
    window.onDragLengthLayer = [];
    window.onDragLengthLayer.push(this.dragLength.bind(this));
    this.map.disablePan();
  }

  mapLoaded = (map) => {
    this.map = map;
    this.moveBoundries();

    console.log(this.props);

    clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

    var polygons =
      this.props.mainObject.suggestParcel.suggestParcel.suggestParcels.polygons;

    if (
      this.props.mainObject &&
      this.props.mainObject.suggestParcel &&
      this.props.mainObject.suggestParcel.suggestParcel.suggestParcels
    ) {
      setTimeout(() => {
        polygons.forEach((f) => {
          f.polygon = new esri.geometry.Polygon(f.polygon);

          if (
            f.parcel_name != "الزائده التنظيميه" &&
            f.parcel_name != "الزائدة"
          ) {
            addParcelNo(
              f.polygon.getExtent().getCenter(),
              this.map,
              convertToArabic(f.parcel_name) + "",
              "ParcelPlanNoGraphicLayer",
              14,
              [0, 0, 0]
            );
          }
        });
      }, 200);
    }

    if (
      this.cadData &&
      !(
        this.props.input &&
        this.props.input.value &&
        this.props.input.value.polygons
      )
    ) {
      this.drawFeatures(this.cadData);
    } else if (polygons) {
      this.drawPolygons(polygons);
    }
  };

  isPointOrArc(point, polygonIndex, cadFeatures) {
    var value = false;

    var points = cadFeatures[polygonIndex];
    for (var i = 0; i < points.length; i++) {
      if (points[i][0] == point.x && points[i][1] == point.y) {
        value = true;
        break;
      }
    }
    return value;
  }

  getLineLength(boundryFeaturesLen, point1, point2, isArc) {
    return (
      isArc &&
      boundryFeaturesLen.find((d) => {
        return (
          (d.points[0].x.toFixed(4) == point1.x.toFixed(4) &&
            d.points[0].y.toFixed(4) == point1.y.toFixed(4) &&
            d.points[1].x.toFixed(4) == point2.x.toFixed(4) &&
            d.points[1].y.toFixed(4) == point2.y.toFixed(4)) ||
          (d.points[0].x.toFixed(4) == point2.x.toFixed(4) &&
            d.points[0].y.toFixed(4) == point2.y.toFixed(4) &&
            d.points[1].x.toFixed(4) == point1.x.toFixed(4) &&
            d.points[1].y.toFixed(4) == point1.y.toFixed(4))
        );
      })
    );
  }

  getPacrelNoAngle(parcel) {
    var xMin;
    var xMax = 0;
    var yMin;
    var yMax = 0;

    parcel.geometry.rings[0].forEach(function (point) {
      if (point[0] > xMax) xMax = point[0];

      if (!xMin || point[0] < xMin) xMin = point[0];

      if (point[1] > yMax) yMax = point[1];

      if (!yMin || point[1] < yMin) yMin = point[1];
    });

    return yMax - yMin > xMax - xMin ? 60 : -15;
  }

  calculateLines() {
    this.Polygons.forEach((polygon) => {
      polygon.data.forEach((lines) => {
        lines.totalLength = 0;
        lines.data.forEach((line) => {
          if (!line.hide) lines.totalLength += line.text;
        });
        lines.totalLength = lines.totalLength.toFixed(2); //Math.floor(parseFloat(lines.totalLength) * 100) / 100;
        //if((lines.totalLength+'').split('.')[1][1] == '9')
        //  lines.totalLength = lines.totalLength.toFixed(2)
      });
    });
  }

  dropSuccess(Polyline) {
    clearGraphicFromLayer(this.map, "boundriesDirection");
    //clearGraphicLayer("PacrelNoGraphicLayer", $scope.map);

    var count = 0;

    //var oldData = JSON.parse(JSON.stringify(this.layerParcels));

    this.layerParcels = [];

    //sortLines(sug.Polygons);

    this.Polygons.forEach((polygon, key) => {
      count++;
      var parcelNumber = key + 1;

      /*if (oldData[key]) {
          polygon.corners = JSON.parse(JSON.stringify((oldData[key].corners)));
      }
      else
          polygon.corners = [];*/

      this.layerParcels.push(JSON.parse(JSON.stringify(polygon.polygon)));
      this.layerParcels[this.layerParcels.length - 1].lines = [];
      this.layerParcels[this.layerParcels.length - 1].corners = [];

      if (polygon.data) {
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
            } else if (boundry.name == "weast") {
              color = [255, 0, 0];
              lineDirection = 4;
            } else if (boundry.name == "south") {
              color = [0, 255, 0];
              lineDirection = 3;
            }

            boundry.data.forEach((line) => {
              if (line.lines) {
                line.lines.forEach((innerLine) => {
                  innerLine.color = color;
                  innerLine.polygonNum = count;
                  innerLine.lineDirection = lineDirection;

                  var polyline = new esri.geometry.Polyline(innerLine);

                  this.layerParcels[this.layerParcels.length - 1].lines.push(
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

              /*var fromCornerIndex = sug.getCornersIndex(polygon.corners, point1);
              if (fromCornerIndex == -1) {
                  polygon.corners.push(point1);
                  fromCornerIndex = polygon.corners.length;
              }
              var toCornerIndex = sug.getCornersIndex(polygon.corners, point2);
              if (toCornerIndex == -1) {
                  polygon.corners.push(point2);
                  toCornerIndex = polygon.corners.length;
              }*/

              //line.from = fromCornerIndex;
              //line.to = toCornerIndex;
              line.BOUNDARY_NO = line.from;

              var polyline1 = new esri.geometry.Polyline(line);

              this.layerParcels[this.layerParcels.length - 1].lines.push(
                polyline
              );

              var attr = {
                parcelNumber: parcelNumber,
              };

              addGraphicToLayer(
                polyline1,
                this.map,
                "boundriesDirection",
                color,
                null,
                null,
                null,
                attr
              );
            });
          }
        });
      }
    });
  }
  getSuggestLine(Polyline) {
    this.Polygons.forEach(function (polygon) {
      var polygonCenterPoint = polygon.polygon.getExtent().getCenter();
      var polyg = new esri.geometry.Polygon(polygon.polygon);
      polygon.data[2].data.forEach(function (boundry, key) {
        // var line = new Polyline(boundry);
        // var centerPointofLine = line.getExtent().getCenter();

        // var diffrenceInXWithMaxPoint = Math.abs(
        //   centerPointofLine.x - polygon.maxPoint.x
        // );
        // var diffrenceWithPolygonCenterPoint = Math.abs(
        //   centerPointofLine.x - polygonCenterPoint.x
        // );

        // //east
        // if (diffrenceInXWithMaxPoint < diffrenceWithPolygonCenterPoint) {
        //   polygon.data[1].data.push(boundry);
        // } else {
        //   var diffrenceInXWithMinPoint = Math.abs(
        //     centerPointofLine.x - polygon.minPoint.x
        //   );
        //   if (diffrenceInXWithMinPoint < diffrenceWithPolygonCenterPoint) {
        //     polygon.data[3].data.push(boundry);
        //   } else if (centerPointofLine.y > polygonCenterPoint.y) {
        //     polygon.data[0].data.push(boundry);
        //   } else {
        //     polygon.data[4].data.push(boundry);
        //   }
        // }
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

      polygon.data[2].data = [];
    });

    this.dropSuccess(Polyline);
    this.calculateLines();
  }

  settoStore(polygons) {
    this.props.input.onChange({
      polygons: polygons,
      temp: {
        cadData: this.cadData,
      },
    });
  }

  drawLengths(polygons) {
    this.Polygons.forEach((elem, key) => {
      if (elem.data) {
        elem.data.forEach((item) => {
          item.data.forEach((boundry) => {
            var attr = {
              text: boundry.text.toFixed(2),
              angle: null,
            };
            console.log(boundry);
            addParcelNo(
              new esri.geometry.Point(boundry.centroid),
              this.map,
              "" + boundry.text.toFixed(2) + "",
              "editlengthGraphicLayer",
              30,
              null,
              null,
              null,
              attr
            );
          });
        });
      }
    });
  }

  drawPolygons(polygons) {
    this.Polygons = polygons;
    console.log(this.Polygons);

    this.Polygons.forEach((elem, key) => {
      elem.polygon = new esri.geometry.Polygon(elem.polygon);
      elem.polygon.type = "polygon";
      console.log(elem.polygon);
      if (elem.polygon.layer == "boundry") {
        addGraphicToLayer(
          elem.polygon,
          this.map,
          "addedParclGraphicLayer",
          [0, 0, 255, 0.8],
          null,
          true
        );
      } else {
        if (elem.polygon.rings.length) {
          addGraphicToLayer(
            elem.polygon,
            this.map,
            "addedParclGraphicLayer",
            [0, 255, 0, 0.8],
            null,
            null,
            null,
            null,
            null,
            null,
            true
          );
        }
      }
    });

    this.dropSuccess();

    this.setState({
      polygons: this.Polygons,
      weastBoundries: this.Polygons[0].data[3].data.map((item, i) => {
        return {
          id: `item-${"weast_" + i}`,
          content: item.text.toFixed(2),
          data: item,
        };
      }),
      northBoundries: this.Polygons[0].data[0].data.map((item, i) => {
        return {
          id: `item-${"north_" + i}`,
          content: item.text.toFixed(2),
          data: item,
        };
      }),
      eastBoundries: this.Polygons[0].data[1].data.map((item, i) => {
        return {
          id: `item-${"east_" + i}`,
          content: item.text.toFixed(2),
          data: item,
        };
      }),
      southBoundries: this.Polygons[0].data[4].data.map((item, i) => {
        return {
          id: `item-${"south_" + i}`,
          content: item.text.toFixed(2),
          data: item,
        };
      }),
    });

    this.drawLengths();

    this.settoStore(this.Polygons);

    setTimeout(() => {
      zoomToLayer("addedParclGraphicLayer", this.map, 8);
    }, 200);

    //resizeMap(this.map);
  }

  drawFeatures(features) {
    LoadModules([
      "esri/geometry/Point",
      "esri/geometry/Polyline",
      "esri/geometry/Polygon",
      "esri/geometry/mathUtils",
      "esri/SpatialReference",
    ]).then(([Point, Polyline, Polygon, mathUtils, SpatialReference]) => {
      clearGraphicFromLayer(this.map, "highlightBoundriesGraphicLayer");
      clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
      clearGraphicFromLayer(this.map, "addedParclGraphicLayer");
      clearGraphicFromLayer(this.map, "boundriesGraphicLayer");
      clearGraphicFromLayer(this.map, "boundriesDirection");
      clearGraphicFromLayer(this.map, "pictureGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelUnNamedGraphicLayer");
      clearGraphicFromLayer(this.map, "detailedGraphicLayer");

      this.layerParcels = [];
      let pointsLength = [];

      this.Polygons = [];

      let lineFeatures = [];
      if (features[0].lineFeatures) {
        //draw details
        features[0].lineFeatures.forEach((line, appartNumber) => {
          var polyline = new Polyline(line);
          lineFeatures.push(polyline);
          addGraphicToLayer(
            polyline,
            this.map,
            "detailedGraphicLayer",
            [0, 0, 255, 0.5],
            null,
            null,
            null
          );
        });
      }

      getPolygons(
        features[0].shapeFeatures,
        (polygon, esriModules, elem, key) => {
          this.Polygons.push({
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
          this.Polygons[key].parcelName = "";
          if (elem.layer == "plus") {
            this.Polygons[key].parcel_name = "الزائده التنظيميه";
            this.Polygons[key].layerName = "plus";
          } else {
            this.Polygons[key].parcel_name = "أرض رقم " + (key + 1);
          }
          this.Polygons[key].PARCEL_SPATIAL_ID = "";
          this.Polygons[key].area = elem.area;
          this.Polygons[key].parcelNameHidden = "";

          this.Polygons[key].notify = polygon.notify;
          this.Polygons[key].polygon = polygon;
          this.Polygons[key].min;
          this.Polygons[key].active = false;
          this.Polygons[key].max = 0;
          this.Polygons[key].maxPointLineLen;
          this.Polygons[key].minPointLineLen;
          this.Polygons[key].minLineLen;

          if (polygon.rings.length > 0) {
            var arcLength = 0;
            var arcPoints = [];
            var arcLines = [];

            for (var j = 0, n = polygon.rings[0].length - 1; j < n; j++) {
              var point1 = new Point(
                polygon.rings[0][j][0],
                polygon.rings[0][j][1],
                new SpatialReference({ wkid: polygon.spatialReference })
              );
              var point2 = new Point(
                polygon.rings[0][j + 1][0],
                polygon.rings[0][j + 1][1],
                new SpatialReference({ wkid: polygon.spatialReference })
              );

              var length = mathUtils.getLength(point1, point2);
              //length = Number(parseFloat(length).toFixed(2));

              if (point1.x > this.Polygons[key].max) {
                this.Polygons[key].max = point1.x;
                this.Polygons[key].maxPoint = point1;
              }

              if (
                !this.Polygons[key].min ||
                point1.x < this.Polygons[key].min
              ) {
                this.Polygons[key].min = point1.x;
                this.Polygons[key].minPoint = point1;
              }

              if (point2.x > this.Polygons[key].max) {
                this.Polygons[key].max = point2.x;
                this.Polygons[key].maxPoint = point2;
              }

              if (
                !this.Polygons[key].min ||
                point2.x < this.Polygons[key].min
              ) {
                this.Polygons[key].min = point2.x;
                this.Polygons[key].minPoint = point2;
              }

              var path = {
                paths: [[polygon.rings[0][j], polygon.rings[0][j + 1]]],
                text: length,
                spatialReference: polygon.spatialReference,
              };

              if (
                !(
                  this.isPointOrArc(point1, key, features[0].cadFeatures) &&
                  this.isPointOrArc(point2, key, features[0].cadFeatures)
                )
              ) {
                if (this.isPointOrArc(point2, key, features[0].cadFeatures)) {
                  //
                  arcLength += length;
                  arcPoints.push(point1);
                  path = new Polyline(path);
                  path.centroid = path.getExtent().getCenter();
                  arcLines.push(new Polyline(path));
                  path.text = arcLength || length;

                  if (
                    features[0].boundryFeaturesLen &&
                    features[0].boundryFeaturesLen.length &&
                    features[0].boundryFeaturesLen.length > 0
                  ) {
                    //
                    var line = this.getLineLength(
                      features[0].boundryFeaturesLen,
                      arcPoints[0],
                      point2,
                      features[0].isArc
                    );
                    if (line) path.text = line.length;
                  }

                  length = path.text;
                  path.lines = arcLines;
                  arcLines = [];
                  arcLength = 0;
                  this.Polygons[key].data[2].data.push(path);
                  this.Polygons[key].data[2].data[
                    this.Polygons[key].data[2].data.length - 1
                  ].centroid = path.getExtent().getCenter();
                } else {
                  path.hide = true;
                  arcLength += length;
                  arcPoints.push(point1);
                  path = new Polyline(path);
                  let polyline = new Polyline(path);
                  path.centroid = polyline.getExtent().getCenter();
                  arcLines.push(new Polyline(path));
                }
              }
              if (
                this.isPointOrArc(point1, key, features[0].cadFeatures) &&
                this.isPointOrArc(point2, key, features[0].cadFeatures)
              ) {
                if (
                  features[0].boundryFeaturesLen &&
                  features[0].boundryFeaturesLen.length &&
                  features[0].boundryFeaturesLen.length > 0
                ) {
                  //
                  let line = this.getLineLength(
                    features[0].boundryFeaturesLen,
                    point1,
                    point2,
                    features[0].isArc
                  );

                  if (line) path.text = line.length;

                  length = path.text;
                }
                this.Polygons[key].data[2].data.push(path);
              }

              let polyline1 = new Polyline(path);

              if (
                !this.Polygons[key].minLineLen ||
                this.Polygons[key].minLineLen > length
              )
                this.Polygons[key].minLineLen = length;

              var pt = polyline1.getExtent().getCenter();

              if (
                !(
                  this.isPointOrArc(point1, key, features[0].cadFeatures) &&
                  this.isPointOrArc(point2, key, features[0].cadFeatures)
                )
              ) {
                if (this.isPointOrArc(point2, key, features[0].cadFeatures)) {
                  if (arcPoints.length)
                    pt = arcPoints[Math.floor(arcPoints.length / 2)];
                }
              }

              if (
                this.isPointOrArc(point1, key, features[0].cadFeatures) &&
                this.isPointOrArc(point2, key, features[0].cadFeatures)
              ) {
                this.Polygons[key].data[2].data[
                  this.Polygons[key].data[2].data.length - 1
                ].centroid = pt;
              }

              if (polygon.layer == "boundry") {
                addGraphicToLayer(
                  polyline1,
                  this.map,
                  "boundriesGraphicLayer",
                  [0, 0, 255, 0.3]
                );
              } else {
                addGraphicToLayer(
                  polyline1,
                  this.map,
                  "boundriesGraphicLayer",
                  [0, 255, 0, 1]
                );
              }

              if (pt.length) {
                pt.x = pt[0];
                pt.y = pt[1];
              }

              let lineLengthFont = 30;

              var attr = {
                text: length.toFixed(2),
                angle: this.getPacrelNoAngle({ geometry: polygon }),
              };

              // because there were similarity between points in fraction part 123.4567 , 123.4512
              if (
                !(
                  pointsLength.indexOf(
                    pt.x.toFixed(4) + "," + pt.y.toFixed(4)
                  ) > -1
                )
              ) {
                if (
                  this.isPointOrArc(point1, key, features[0].cadFeatures) &&
                  this.isPointOrArc(point2, key, features[0].cadFeatures)
                ) {
                  pointsLength.push(pt.x.toFixed(4) + "," + pt.y.toFixed(4));

                  //if(this.Polygons[key].layerName != "plus")
                  //{
                  addParcelNo(
                    pt,
                    this.map,
                    "" + length.toFixed(2) + "",
                    "editlengthGraphicLayer",
                    lineLengthFont,
                    null,
                    this.getPacrelNoAngle({ geometry: polygon }),
                    null,
                    attr
                  );
                  //}
                } else if (
                  this.isPointOrArc(point2, key, features[0].cadFeatures)
                ) {
                  if (arcPoints.length)
                    pt = arcPoints[Math.floor(arcPoints.length / 2)];

                  //if(this.Polygons[key].layerName != "plus")
                  //{
                  addParcelNo(
                    pt,
                    this.map,
                    "" + length.toFixed(2) + "",
                    "editlengthGraphicLayer",
                    lineLengthFont,
                    null,
                    this.getPacrelNoAngle({ geometry: polygon }),
                    null,
                    attr
                  );
                  //}
                }
              }

              if (this.isPointOrArc(point2, key, features[0].cadFeatures)) {
                arcPoints = [];
              }
            }

            if (this.Polygons[key].layerName == "plus") {
              addGraphicToLayer(
                polygon,
                this.map,
                "addedParclGraphicLayer",
                [0, 0, 255, 0.8],
                null,
                null,
                null,
                null,
                null,
                null,
                true
              );
            } else {
              addGraphicToLayer(
                polygon,
                this.map,
                "addedParclGraphicLayer",
                [0, 0, 255, 0.8],
                null,
                true
              );
            }
          }
        }
      );

      setTimeout(() => {
        // sug.getSuggestLine();
        clearGraphicFromLayer(this.map, "addedParclGraphicLayer");

        console.log(this.Polygons);
        this.Polygons.forEach((elem, key) => {
          if (elem.polygon.layer == "boundry") {
            addGraphicToLayer(
              elem.polygon,
              this.map,
              "addedParclGraphicLayer",
              [0, 0, 255, 0.8],
              null,
              true
            );
          } else {
            addGraphicToLayer(
              elem.polygon,
              this.map,
              "addedParclGraphicLayer",
              [0, 255, 0, 0.8],
              null,
              null,
              null,
              null,
              null,
              null,
              true
            );
          }
        });

        this.getSuggestLine(Polyline);

        zoomToLayer("boundriesGraphicLayer", this.map, 8);
        //resizeMap(this.map);

        setTimeout(() => {
          if (this.state["north_Desc0"]) {
            this.Polygons.forEach((polygon, key) => {
              polygon.north_Desc = this.state["north_Desc" + key];
              polygon.weast_Desc = this.state["weast_Desc" + key];
              polygon.south_Desc = this.state["south_Desc" + key];
              polygon.east_Desc = this.state["east_Desc" + key];

              polygon.parcel_name = this.state["parcel_Name" + key];
              polygon.parcel_area_desc = this.state["parcel_area_desc" + key];

              if (this.state["shtfa_northeast"]) {
                polygon.shtfa_northeast = this.state["shtfa_northeast"];
              }
              if (this.state["shtfa_northweast"]) {
                polygon.shtfa_northweast = this.state["shtfa_northweast"];
              }
              if (this.state["shtfa_southeast"]) {
                polygon.shtfa_southeast = this.state["shtfa_southeast"];
              }
              if (this.state["shtfa_southweast"]) {
                polygon.shtfa_southweast = this.state["shtfa_southweast"];
              }
            });
          }

          this.settoStore(this.Polygons);
        }, 1000);

        this.setState({
          polygons: this.Polygons,
          weastBoundries: this.Polygons[0].data[3].data.map((item, i) => {
            return {
              id: `item-${"weast_" + i}`,
              content: item.text.toFixed(2),
              data: item,
            };
          }),
          northBoundries: this.Polygons[0].data[0].data.map((item, i) => {
            return {
              id: `item-${"north_" + i}`,
              content: item.text.toFixed(2),
              data: item,
            };
          }),
          eastBoundries: this.Polygons[0].data[1].data.map((item, i) => {
            return {
              id: `item-${"east_" + i}`,
              content: item.text.toFixed(2),
              data: item,
            };
          }),
          southBoundries: this.Polygons[0].data[4].data.map((item, i) => {
            return {
              id: `item-${"south_" + i}`,
              content: item.text.toFixed(2),
              data: item,
            };
          }),
        });
      }, 500);
    });
  }

  resetAll() {
    this.setState(this.baseState);
  }

  handleChange(e) {
    //console.log(e.target.files[0])
    var reader = new FileReader();
    let self = this;
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      //console.log(reader.result);
      let queryConditions = [];
      let isGuid = false;
      let where = "1=-1";
      let parcels = self.props.mainObject.landData.landData.lands.parcels;
      parcels.forEach((elem) => {
        queryConditions.push(
          "PARCEL_SPATIAL_ID  = " + elem.attributes.PARCEL_SPATIAL_ID
        );
        if (typeof elem.attributes.PARCEL_SPATIAL_ID == "string") {
          if (elem.attributes.PARCEL_SPATIAL_ID.indexOf("-") > -1)
            isGuid = true;
        }
      });
      where = queryConditions.join(" or ");

      if (isGuid || parcels.length == 0) where = "PARCEL_SPATIAL_ID = -1";

      queryTask({
        ...querySetting(self.LayerID.Landbase_Parcel, where, true, ["*"]),
        callbackResult: (res) => {
          let obj = {};
          obj.parcels = res;
          if (obj.parcels.features.length == parcels.length || isGuid) {
            obj.file = reader.result;
            obj.type = "cad";
            obj.url = "split_merge/";
            axios.post(workFlowUrl + "/api/Upload", obj).then((response) => {
              self.cadData = response.data;

              if (
                response.data[0].shapeFeatures.filter((feature) => {
                  return (
                    feature.layer == "boundry" &&
                    feature.notify != "mapview.parcels.NOTIFY_INTERSECT"
                  );
                }).length > 0
              ) {
                message.error("هذة الأرض  خارج حدود الأراضي المختارة");
              } else {
                //self.resetAll();
                self.drawFeatures(response.data);
              }
            });
          }
        },
      });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }
  onChange = (activeKey) => {
    this.setState({
      activeKey,
      weastBoundries: this.Polygons[+activeKey - 1].data[3].data.map(
        (item, i) => {
          return {
            id: `item-${"weast_" + i}`,
            content: item.text.toFixed(2),
            data: item,
          };
        }
      ),
      northBoundries: this.Polygons[+activeKey - 1].data[0].data.map(
        (item, i) => {
          return {
            id: `item-${"north_" + i}`,
            content: item.text.toFixed(2),

            data: item,
          };
        }
      ),
      eastBoundries: this.Polygons[+activeKey - 1].data[1].data.map(
        (item, i) => {
          return {
            id: `item-${"east_" + i}`,
            content: item.text.toFixed(2),

            data: item,
          };
        }
      ),
      southBoundries: this.Polygons[+activeKey - 1].data[4].data.map(
        (item, i) => {
          return {
            id: `item-${"south_" + i}`,
            content: item.text.toFixed(2),

            data: item,
          };
        }
      ),
    });
  };

  updateNorth_Desc = (polygon, key, evt) => {
    polygon.north_Desc = evt.target.value;

    console.log(polygon);
    this.setState({
      ["north_Desc" + key]: evt.target.value,
    });

    this.settoStore(this.state.polygons);
  };

  updateSouth_Desc = (polygon, key, evt) => {
    polygon.south_Desc = evt.target.value;
    console.log(polygon);
    this.setState({
      ["south_Desc" + key]: evt.target.value,
    });

    this.settoStore(this.state.polygons);
  };

  updateWeast_Desc = (polygon, key, evt) => {
    polygon.weast_Desc = evt.target.value;
    console.log(polygon);
    this.setState({
      ["weast_Desc" + key]: evt.target.value,
    });

    this.settoStore(this.state.polygons);
  };

  updateEast_Desc = (polygon, key, evt) => {
    polygon.east_Desc = evt.target.value;
    console.log(polygon);
    this.setState({
      ["east_Desc" + key]: evt.target.value,
    });

    this.settoStore(this.state.polygons);
  };

  updateInputValue = (key, evt) => {
    this.state.polygons.filter((polygon) => {
      return polygon.polygon.layer == "boundry";
    })[0][key] = evt.target.value;

    this.setState({
      [key]: evt.target.value,
    });

    this.settoStore(this.state.polygons);
  };

  updateParcel = (polygon, key, evt) => {
    polygon.parcel_name = evt.target.value;
    console.log(polygon);
    this.setState({
      ["parcel_Name" + key]: evt.target.value,
    });

    this.settoStore(this.state.polygons);

    clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

    setTimeout(() => {
      this.state.polygons.forEach((f) => {
        if (
          f.parcel_name != "الزائده التنظيميه" &&
          f.parcel_name != "الزائدة"
        ) {
          addParcelNo(
            f.polygon.getExtent().getCenter(),
            this.map,
            convertToArabic(f.parcel_name) + "",
            "ParcelPlanNoGraphicLayer",
            14,
            [0, 0, 0]
          );
        }
      });
    }, 200);
  };

  updateParcelDesc = (polygon, key, evt) => {
    polygon.parcel_area_desc = evt.target.value;

    this.setState({
      ["parcel_area_desc" + key]: evt.target.value,
    });

    this.settoStore(this.state.polygons);
  };

  render() {
    const { mapLoaded, polygons } = this.state;

    return (
      <div>
        <div>
          <MapComponent mapload={this.mapLoaded.bind(this)}></MapComponent>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(updateMapFiled);
