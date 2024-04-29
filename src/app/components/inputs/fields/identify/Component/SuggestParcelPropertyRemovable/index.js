import React, { Component } from "react";
import { Tabs, message } from "antd";
const { TabPane } = Tabs;
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { post } from "axios";
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
  resizeMap,
  computePointDirection,
  convertToArabic,
} from "../common/common_func";
import uploadField from "./fields";
import { Form, Button, Alert, Select } from "antd";
import { Field, reduxForm } from "redux-form";
import RenderField from "app/components/inputs";
import { serverFieldMapper } from "app/helpers/functions";

import fileUploaderComponent from "../../../fileUploader";
import { workFlowUrl } from "imports/config";
import { LoadModules } from "../common/esri_loader";
import { mapUrl } from "../mapviewer/config/map";

import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import MapBtnsComponent from "../MapBtnsComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import { connect } from "react-redux";
import axios from "axios";
import { get } from "lodash";
import { querySetting } from "../IdentifyComponnentCoord/Helpers";
import { timeout } from "d3";
import { json } from "d3";
import { host } from "../../../../../../../imports/config";
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
class SuggestParcelPropertyRemovableFiled extends Component {
  props = {};
  self = null;
  isHideLength = true;
  constructor(props) {
    super(props);
    console.log(props);
    this.props = props;
    this.fields = uploadField.map((f) => serverFieldMapper(f));
    this.neighbors =
      this.props.mainObject &&
      this.props.mainObject?.landData?.landData?.lands?.temp.parcelDis;
    this.neighbors =
      this.neighbors &&
      this.neighbors.filter((f) => {
        return (
          this.props.mainObject?.landData?.landData?.lands?.parcels[0]
            .attributes.PARCEL_PLAN_NO != f.attributes.PARCEL_PLAN_NO
        );
      });

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

        if (polygon.layerName?.toLowerCase() == "notPlus"?.toLowerCase()) {
          this.state["parcel_area_" + key] = polygon.area;
        }
      });

      if (this.props.input.value.temp.shtfa_northeast) {
        this.state["shtfa_northeast"] =
          this.props.input.value.temp.shtfa_northeast;
      }
      if (this.props.input.value.temp.shtfa_northweast) {
        this.state["shtfa_northweast"] =
          this.props.input.value.temp.shtfa_northweast;
      }
      if (this.props.input.value.temp.shtfa_southeast) {
        this.state["shtfa_southeast"] =
          this.props.input.value.temp.shtfa_southeast;
      }
      if (this.props.input.value.temp.shtfa_southweast) {
        this.state["shtfa_southweast"] =
          this.props.input.value.temp.shtfa_southweast;
      }
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
    getInfo().then((res) => {
      // ////
      this.LayerID = res;
    });
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

    this.props.setMap(map);
    this.moveBoundries();

    clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

    if (
      this.props.input &&
      this.props.input.value &&
      this.props.input.value.polygons
    ) {
      setTimeout(() => {
        this.props.input.value.polygons.forEach((f) => {
          if (f.polygon) {
            f.polygon = new esri.geometry.Polygon(f.polygon);

            /*if (
              f.parcel_name != "الزائده التنظيميه" &&
              f.parcel_name != "الزائدة" &&
              f.parcel_name != "حدود المعاملة "
            ) {
              addParcelNo(
                f.polygon.getExtent().getCenter(),
                this.map,
                f.parcel_name + "",
                "ParcelPlanNoGraphicLayer",
                14,
                [0, 0, 0]
              );
            }*/
          }
        });

        this.neighbors &&
          this.neighbors.forEach((f) => {
            f.geometry = new esri.geometry.Polygon(f.geometry);
            addParcelNo(
              f.geometry.getExtent().getCenter(),
              this.map,
              f.attributes.PARCEL_PLAN_NO + "",
              "ParcelPlanNoGraphicLayer",
              14,
              [0, 0, 0]
            );
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
    } else if (
      this.props.input &&
      this.props.input.value &&
      this.props.input.value.polygons
    ) {
      this.drawPolygons();
    }

    this.props.setCurrentMap(map);
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

  // convertToArabic(num) {
  //   if (num) {
  //     var id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];
  //     return num.replace(/[0-9]/g, function (w) {
  //       return id[+w];
  //     });
  //   } else {
  //     return "";
  //   }
  // }

  calculateLines() {
    this.Polygons.filter((p) => {
      return p.layerName?.toLowerCase() != "notPlus"?.toLowerCase();
    }).forEach((polygon) => {
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

    this.Polygons.filter((p) => {
      return p.layerName?.toLowerCase() != "notPlus"?.toLowerCase();
    }).forEach((polygon, key) => {
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
    });
  }
  getSuggestLine(Polyline) {
    this.Polygons.filter((p) => {
      return p.layerName?.toLowerCase() != "notPlus"?.toLowerCase();
    }).forEach(function (polygon) {
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
        //map: this.map,
        cadData: this.cadData,
        shtfa_northeast: this.state["shtfa_northeast"] || 0,
        shtfa_northweast: this.state["shtfa_northweast"] || 0,
        shtfa_southeast: this.state["shtfa_southeast"] || 0,
        shtfa_southweast: this.state["shtfa_southweast"] || 0,
      },
    });
  }

  resetStore() {
    this.props.input.onChange({
      polygons: [],
      temp: {
        //map: this.map,
        cadData: null,
        shtfa_northeast: 0,
        shtfa_northweast: 0,
        shtfa_southeast: 0,
        shtfa_southweast: 0,
      },
    });

    this.setState({
      polygons: [],
      shtfa_northeast: "",
      shtfa_northweast: "",
      shtfa_southeast: "",
      shtfa_southweast: "",
    });
  }

  drawLengths(polygons) {
    this.Polygons.filter((p) => {
      return p.layerName?.toLowerCase() != "cut_parcel"?.toLowerCase();
    }).forEach((elem, key) => {
      elem.data.forEach((item) => {
        item.data.forEach((boundry) => {
          var attr = {
            text: convertToArabic(boundry.text.toFixed(2)),
            angle: null,
          };
          console.log(boundry);
          if (!this.isHideLength) {
            addParcelNo(
              new esri.geometry.Point(boundry.centroid),
              this.map,
              "" + convertToArabic(boundry.text.toFixed(2)) + "",
              "editlengthGraphicLayer",
              30,
              null,
              null,
              null,
              attr
            );
          }
        });
      });
    });
  }

  drawPolygons(polygons) {
    this.Polygons = this.props.input.value.polygons;

    /*this.polygons = this.polygons.sort((a,b)=> {
      return (a.layerName > b.layerName) ? 1 : ((b.layerName > a.layerName) ? -1 : 0);} );
*/
    console.log(this.Polygons);

    this.Polygons.filter((p) => {
      return p.layerName?.toLowerCase() != "notPlus"?.toLowerCase();
    }).forEach((elem, key) => {
      elem.polygon = new esri.geometry.Polygon(elem.polygon);
      elem.polygon.type = "polygon";
      console.log(elem.polygon);
      if (elem.polygon.layer?.toLowerCase() == "boundry"?.toLowerCase()) {
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
      clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

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

      let tempFeatures = features[0].shapeFeatures.reverse();

      if (tempFeatures[0].layer != features[0].layer) {
        features[0].shapeFeatures = tempFeatures;
        features[0].cadFeatures = features[0].cadFeatures.reverse();
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
          if (elem.layer?.toLowerCase() == "cut_parcel"?.toLowerCase()) {
            this.Polygons[key].parcel_name = "مسار النزع";
            this.Polygons[key].layerName = "cut_parcel";
          } else if (elem.layer?.toLowerCase() == "boundry"?.toLowerCase()) {
            this.Polygons[key].parcel_name = "حدود الأرض";
            this.Polygons[key].layerName = "boundry";
          } else if (
            elem.layer?.toLowerCase() == "full_boundry"?.toLowerCase()
          ) {
            this.Polygons[key].parcel_name = "حدود المعاملة ";
            this.Polygons[key].layerName = "full_boundry";
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

              if (polygon.layer?.toLowerCase() == "boundry"?.toLowerCase()) {
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
                text: convertToArabic(length.toFixed(2)),
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
                  if (!this.isHideLength) {
                    addParcelNo(
                      pt,
                      this.map,
                      "" + convertToArabic(length.toFixed(2)) + "",
                      "editlengthGraphicLayer",
                      lineLengthFont,
                      null,
                      this.getPacrelNoAngle({ geometry: polygon }),
                      null,
                      attr
                    );
                  }
                  //}
                } else if (
                  this.isPointOrArc(point2, key, features[0].cadFeatures)
                ) {
                  if (arcPoints.length)
                    pt = arcPoints[Math.floor(arcPoints.length / 2)];

                  //if(this.Polygons[key].layerName != "plus")
                  //{
                  if (!this.isHideLength) {
                    addParcelNo(
                      pt,
                      this.map,
                      "" + convertToArabic(length.toFixed(2)) + "",
                      "editlengthGraphicLayer",
                      lineLengthFont,
                      null,
                      this.getPacrelNoAngle({ geometry: polygon }),
                      null,
                      attr
                    );
                  }
                  //}
                }
              }

              if (this.isPointOrArc(point2, key, features[0].cadFeatures)) {
                arcPoints = [];
              }
            }

            if (
              this.Polygons[key].layerName?.toLowerCase() ==
              "cut_parcel"?.toLowerCase()
            ) {
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

        //console.log(this.Polygons);

        this.Polygons.reverse()
          .filter((p) => {
            return p.layerName?.toLowerCase() != "notPlus"?.toLowerCase();
          })
          .forEach((elem, key) => {
            if (elem.polygon.layer?.toLowerCase() == "boundry"?.toLowerCase()) {
              addGraphicToLayer(
                elem.polygon,
                this.map,
                "addedParclGraphicLayer",
                [0, 0, 255, 0.8],
                null,
                true
              );
            } else if (
              elem.polygon.layer?.toLowerCase() == "cut_parcel"?.toLowerCase()
            ) {
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

        // setTimeout(() => {
        //   this.neighbors.forEach((f) => {
        //     f.geometry = new esri.geometry.Polygon(f.geometry);
        //     addParcelNo(
        //       f.geometry.getExtent().getCenter(),
        //       this.map,
        //       f.attributes.PARCEL_PLAN_NO + "",
        //       "ParcelPlanNoGraphicLayer",
        //       14,
        //       [0, 0, 0]
        //     );
        //   });
        // }, 200);

        console.log(this.Polygons);

        this.getSuggestLine(Polyline);

        zoomToLayer("boundriesGraphicLayer", this.map, 8);

        //resizeMap(this.map);

        setTimeout(() => {
          if (this.state["north_Desc0"] && !this.newCadUploaded) {
            this.newCadUploaded = false;
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
          } else {
            this.Polygons.forEach((polygon, key) => {
              this.setState({
                // parcel_area_desc0: "",
                // parcel_area_desc1: "",
                // parcel_area_desc2: "",
                // parcel_area_0: "",
                // parcel_area_1: "",
                // parcel_area_2: "",
                // parcel_Name0: "",
                // parcel_Name1: "",
                // parcel_Name2: "",
                ["parcel_area_desc" + key]: "",
                ["parcel_area_" + key]: "",
                ["parcel_Name" + key]: "",
                ["north_Desc" + key]: "",
                ["weast_Desc" + key]: "",
                ["south_Desc" + key]: "",
                ["east_Desc" + key]: "",
              });
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

  componentDidUpdate() {
    const { input } = this.props;

    let self = this;
    if (input.value && input.value != "" && input.value.justInvoked) {
      input.value.justInvoked = false;
      let response = input.value.cadData;
      if (response) {
        if (
          !response[0].shapeFeatures.find((feature) => {
            return feature.layer?.toLowerCase() == "boundry"?.toLowerCase();
          })
          // ||
          // !response[0].shapeFeatures.find((feature) => {
          //   return (
          //     feature.layer?.toLowerCase() == "PLUS"?.toLowerCase()
          //      ||
          //     feature.layer?.toLowerCase() == "NOTPLUS"?.toLowerCase()
          //   );
          // })
        ) {
          message.error("الكاد المرفق غير مطابق للمواصفات");
          return;
        }

        if (
          response[0].shapeFeatures.filter((feature) => {
            return (
              feature.layer?.toLowerCase() == "boundry"?.toLowerCase() &&
              feature.notify != "mapview.parcels.NOTIFY_INTERSECT"
            );
          }).length > 0
        ) {
          message.error("هذة الأرض  خارج حدود الأراضي المختارة");
          return;
        } else {
          clearGraphicFromLayer(self.map, "ParcelPlanNoGraphicLayer");
          //self.resetAll();
          self.setState({ polygons: [] });
          self.Polygons = [];
          self.newCadUploaded = true;
          self.drawFeatures(response);
        }
      } else {
        if (this?.map?.graphicsLayerIds) {
          this.map.graphicsLayerIds.forEach(
            function (layerName, index) {
              clearGraphicFromLayer(this.map, layerName);
            }.bind(this)
          );
        }

        this.map?.setExtent(
          new esri.geometry.Extent({
            xmin: 351074.79384063353,
            ymin: 2908411.351837893,
            xmax: 461736.99433170113,
            ymax: 2947768.2013849253,
            spatialReference: {
              wkid: 32639,
            },
          })
        );

        this.resetStore();
      }
    }
  }

  // handleChange(e) {
  //   //console.log(e.target.files[0])
  //   var reader = new FileReader();
  //   let self = this;
  //   reader.readAsDataURL(e.target.files[0]);
  //   reader.onload = () => {
  //     //console.log(reader.result);

  //   };
  //   reader.onerror = function (error) {
  //     console.log("Error: ", error);
  //   };
  // }
  onChange = (activeKey) => {
    if (this.Polygons[+activeKey - 1].data) {
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
    } else {
      this.setState({ activeKey });
    }
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
    var polygon = this.state.polygons.filter((polygon) => {
      return (
        polygon.polygon &&
        polygon.polygon.layer?.toLowerCase() == "boundry"?.toLowerCase()
      );
    })[0];

    if (polygon) {
      polygon[key] = evt.target.value;
    }

    this.state[key] = evt.target.value;

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
        if (f.polygon) {
          /*if (
            f.parcel_name != "الزائده التنظيميه" &&
            f.parcel_name != "الزائدة" &&
            f.parcel_name != "حدود المعاملة "
          ) {
            addParcelNo(
              f.polygon.getExtent().getCenter(),
              this.map,
              f.parcel_name + "",
              "ParcelPlanNoGraphicLayer",
              14,
              [0, 0, 0]
            );
          }*/
        }
      });

      this.neighbors.forEach((f) => {
        f.geometry = new esri.geometry.Polygon(f.geometry);
        addParcelNo(
          f.geometry.getExtent().getCenter(),
          this.map,
          f.attributes.PARCEL_PLAN_NO + "",
          "ParcelPlanNoGraphicLayer",
          14,
          [0, 0, 0]
        );
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

  updateParcelArea = (polygon, key, evt) => {
    polygon.area = evt.target.value;

    this.setState({
      ["parcel_area_" + key]: evt.target.value,
    });

    this.settoStore(this.state.polygons);
  };

  getParcelsArea = (parcels, attr) => {
    return parcels
      .map((parcel) => {
        return parcel ? parcel[attr] || parcel.attributes[attr] : 0;
      })
      .reduce((partialSum, a) => (+partialSum || 0) + (+a || 0), 0)
      .toFixed(2);
  };

  render() {
    const { mapLoaded, polygons } = this.state;
    const { mainObject } = this.props;
    let parcels = mainObject?.landData?.landData?.lands?.parcels;
    return (
      <div>
        {/* <label for="id" className="btn">
          اختر ملف
        </label>
        {/* <input id="files" style="visibility:hidden;" type="file">}
        <input
          id="id"
          type="file"
          style={{ visibility: "hidden" }}
          onChange={this.handleChange.bind(this)}
          data-buttonText="ff"
        /> */}
        <div>
          <MapBtnsComponent {...this.props}></MapBtnsComponent>
        </div>
        <div>
          <MapComponent
            mapload={this.mapLoaded.bind(this)}
            {...this.props}
          ></MapComponent>

          {mapLoaded}
        </div>

        <div>
          <table className="table table-bordered" style={{ marginTop: "1%" }}>
            <tbody>
              <tr>
                <td>
                  <b>المساحة الكلية للأرض من الطبيعة</b>
                </td>
                <td>
                  {" "}
                  {convertToArabic(
                    this.getParcelsArea(
                      polygons.filter(
                        (d) => d.layerName?.toLowerCase() == "boundry"
                      ),
                      "area"
                    )
                  )}{" "}
                  م٢
                </td>
              </tr>
              <tr>
                <td>
                  <b>المساحة الكلية للأرض من شاشة بيانات الأرض</b>
                </td>
                <td>
                  {convertToArabic(this.getParcelsArea(parcels, "PARCEL_AREA"))}{" "}
                  م٢
                </td>
              </tr>
              <tr>
                <td>
                  <b>المساحة الكلية لمسار النزع من الطبيعة </b>
                </td>
                <td>
                  {convertToArabic(
                    this.getParcelsArea(
                      polygons.filter(
                        (d) => d.layerName?.toLowerCase() == "cut_parcel"
                      ),
                      "area"
                    )
                  )}{" "}
                  م٢
                </td>
              </tr>
              <tr>
                <td>
                  <b>المساحة الكلية للجزء المنزوع من شاشة بيانات الأرض</b>
                </td>
                <td>
                  {convertToArabic(
                    this.getParcelsArea(parcels, "PARCEL_CUT_AREA")
                  )}{" "}
                  م٢
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {false && polygons.length > 0 && (
          <Tabs
            style={{ marginTop: "30px" }}
            tabPosition="top"
            type="card"
            activeKey={this.state.activeKey}
            onChange={this.onChange}
          >
            {polygons.map((polygon, key) => {
              return (
                <TabPane
                  tab={convertToArabic(polygon.parcel_name)}
                  key={key + 1}
                >
                  <div key={key}>
                    {polygon.layerName?.toLowerCase() == "boundry" && (
                      <>
                        <div>
                          المساحة الكلية للأرض من الطبيعة:{" "}
                          {convertToArabic(polygon.area.toFixed(2))} م٢
                        </div>
                        <div>
                          المساحة الكلية للأرض من الصك:{" "}
                          {convertToArabic(
                            this.getParcelsArea(parcels, "PARCEL_AREA")
                          )}{" "}
                          م٢
                        </div>
                      </>
                    )}

                    {polygon.layerName?.toLowerCase() == "cut_parcel" && (
                      <>
                        <div>
                          المساحة الكلية لمسار النزع من الطبيعة:{" "}
                          {convertToArabic(polygon.area.toFixed(2))} م٢
                        </div>
                        <div>
                          المساحة الكلية للجزء المنزوع من الصك:{" "}
                          {convertToArabic(
                            this.getParcelsArea(parcels, "PARCEL_CUT_AREA")
                          )}{" "}
                          م٢
                        </div>
                      </>
                    )}

                    {polygon.layerName?.toLowerCase() != ""?.toLowerCase() && (
                      <DragDropContext onDragEnd={this.onDragEnd}>
                        <div style={itemContainerNorth}>
                          <p style={{ textAlign: "center", fontSize: "18px" }}>
                            الشمال
                          </p>

                          <input
                            className="ant-input"
                            placeholder="وصف الحد الشمالي"
                            required={
                              polygon.layerName?.toLowerCase() !=
                              ""?.toLowerCase()
                            }
                            value={this.state["north_Desc" + key]}
                            onChange={this.updateNorth_Desc.bind(
                              this,
                              polygon,
                              key
                            )}
                          />

                          <Droppable droppableId="droppable_North">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                              >
                                {this.state.northBoundries.map(
                                  (item, index) => (
                                    <Draggable
                                      key={item.id}
                                      draggableId={item.id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                          )}
                                        >
                                          {convertToArabic(item.content)}
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          <p style={{ textAlign: "left", fontSize: "20px" }}>
                            طول الحد :{" "}
                            {convertToArabic(polygon.data[0].totalLength)}
                          </p>
                        </div>

                        <div style={{ display: "flex" }}>
                          <div style={itemContainerEast}>
                            <p
                              style={{ textAlign: "center", fontSize: "18px" }}
                            >
                              الشرق
                            </p>

                            <input
                              className="ant-input"
                              placeholder="وصف الحد الشرقي"
                              required={
                                polygon.layerName?.toLowerCase() !=
                                ""?.toLowerCase()
                              }
                              value={this.state["east_Desc" + key]}
                              onChange={this.updateEast_Desc.bind(
                                this,
                                polygon,
                                key
                              )}
                            />

                            <Droppable droppableId="droppable_East">
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  style={getListStyle(snapshot.isDraggingOver)}
                                >
                                  {this.state.eastBoundries.map(
                                    (item, index) => (
                                      <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                              snapshot.isDragging,
                                              provided.draggableProps.style
                                            )}
                                          >
                                            {convertToArabic(item.content)}
                                          </div>
                                        )}
                                      </Draggable>
                                    )
                                  )}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                            <p style={{ textAlign: "left", fontSize: "20px" }}>
                              طول الحد :{" "}
                              {convertToArabic(polygon.data[1].totalLength)}
                            </p>
                          </div>

                          <div style={itemContainerEmpty}> </div>
                          <div style={itemContainerWeast}>
                            <p
                              style={{ textAlign: "center", fontSize: "18px" }}
                            >
                              الغرب
                            </p>

                            <input
                              className="ant-input"
                              placeholder="وصف الحد الغربي"
                              required={
                                polygon.layerName?.toLowerCase() !=
                                ""?.toLowerCase()
                              }
                              value={this.state["weast_Desc" + key]}
                              onChange={this.updateWeast_Desc.bind(
                                this,
                                polygon,
                                key
                              )}
                            />

                            <Droppable droppableId="droppable_Weast">
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  style={getListStyle(snapshot.isDraggingOver)}
                                >
                                  {this.state.weastBoundries.map(
                                    (item, index) => (
                                      <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                              snapshot.isDragging,
                                              provided.draggableProps.style
                                            )}
                                          >
                                            {convertToArabic(item.content)}
                                          </div>
                                        )}
                                      </Draggable>
                                    )
                                  )}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>

                            <p style={{ textAlign: "left", fontSize: "20px" }}>
                              طول الحد :{" "}
                              {convertToArabic(polygon.data[3].totalLength)}
                            </p>
                          </div>
                        </div>

                        <div style={itemContainerSouth}>
                          <p style={{ textAlign: "center", fontSize: "18px" }}>
                            الجنوب
                          </p>

                          <input
                            className="ant-input"
                            placeholder="وصف الحد الجنوبي"
                            required={
                              polygon.layerName?.toLowerCase() !=
                              ""?.toLowerCase()
                            }
                            value={this.state["south_Desc" + key]}
                            onChange={this.updateSouth_Desc.bind(
                              this,
                              polygon,
                              key
                            )}
                          />

                          <Droppable droppableId="droppable_South">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                              >
                                {this.state.southBoundries &&
                                  this.state.southBoundries.map(
                                    (item, index) => (
                                      <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                              snapshot.isDragging,
                                              provided.draggableProps.style
                                            )}
                                          >
                                            {convertToArabic(item.content)}
                                          </div>
                                        )}
                                      </Draggable>
                                    )
                                  )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          <p style={{ textAlign: "left", fontSize: "20px" }}>
                            طول الحد :{" "}
                            {convertToArabic(polygon.data[4].totalLength)}
                          </p>
                        </div>
                      </DragDropContext>
                    )}
                  </div>

                  {/*
                  {polygon.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
                    polygon.layerName?.toLowerCase() !=
                      "notPlus"?.toLowerCase() &&
                    polygon.layerName?.toLowerCase() !=
                      "full_boundry"?.toLowerCase() && (
                      // <input
                      //   className="ant-input"
                      //   placeholder="رقم الأرض"
                      //   style={{
                      //     width: "450px",
                      //     float: "left",
                      //     marginTop: "50px",
                      //     fontSize: "18px",
                      //     height: "50px",
                      //     marginLeft: "20px",
                      //   }}
                      //   required={true}
                      //   value={this.state["parcel_Name" + key]}
                      //   onChange={this.updateParcel.bind(this, polygon, key)}
                      // />
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        name="parcel_Name"
                        onChange={(val) => {
                          this.updateParcel(polygon, key, {
                            target: {
                              value: val,
                              name: "parcel_Name",
                            },
                          });
                        }}
                        placeholder="رقم قطعة الارض"
                        value={this.state[`parcel_Name${key}`]}
                        style={{
                          width: "450px",
                          float: "left",
                          marginTop: "50px",
                          fontSize: "18px",
                          height: "50px",
                          marginLeft: "20px",
                        }}
                      >
                        {parcels?.map((e, i) => {
                          return (
                            <Option
                              key={e.attributes.PARCEL_SPATIAL_ID}
                              value={e.attributes.PARCEL_PLAN_NO}
                            >
                              {convertToArabic(e.attributes.PARCEL_PLAN_NO)}
                            </Option>
                          );
                        })}
                      </Select>
                    )}

                  <input
                    className="ant-input"
                    placeholder="المساحة بالحروف"
                    style={{
                      width: "450px",
                      float: "left",
                      marginTop: "50px",
                      fontSize: "18px",
                      height: "50px",
                      marginLeft: "20px",
                    }}
                    required={true}
                    value={this.state["parcel_area_desc" + key]}
                    onChange={this.updateParcelDesc.bind(this, polygon, key)}
                  />

                  {polygon.layerName?.toLowerCase() ==
                    "notPlus"?.toLowerCase() && (
                    <input
                      className="ant-input"
                      type="number"
                      placeholder="المساحة بالأرقام"
                      style={{
                        width: "450px",
                        float: "left",
                        marginTop: "50px",
                        fontSize: "18px",
                        height: "50px",
                        marginLeft: "20px",
                      }}
                      required={true}
                      value={this.state["parcel_area_" + key]}
                      onChange={this.updateParcelArea.bind(this, polygon, key)}
                    />
                  )}
                    */}
                </TabPane>
              );
            })}
          </Tabs>
        )}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SuggestParcelPropertyRemovableFiled);
