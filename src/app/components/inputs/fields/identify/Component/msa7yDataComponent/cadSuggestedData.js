import React, { Component } from "react";
import { postItem, fetchData } from "app/helpers/apiMethods";
import {
  getMap,
  getIsMapLoaded,
  setIsMapLoaded,
} from "main_helpers/functions/filters/state";
import { esriRequest, getMapInfo } from "../common/esri_request";
import { withTranslation } from "react-i18next";
import {
  redrawNames,
  checkParcelAdjacents,
  intersectQueryTask,
  setParcelName,
  DrawGraphics,
  createFeatureLayer,
  getInfo,
  reverse,
  queryTask,
  project,
  isPointOrArc,
  addGraphicToLayer,
  computeLineAngle,
  addParcelNo,
  getLengthOffset,
  clearGraphicFromLayer,
  getCornersIndex,
  sortLines,
  getCornerIconPosition,
  getColorFromCadIndex,
  zoomToLayer,
  zoomToIdentifyParcel,
  IdentifyTask,
  getPolygons,
  HasArabicCharacters,
  computeAngle,
  highlightFeature,
  convertToArabic,
  getPacrelNoAngle,
  localizeNumber,
  getLineLength,
  GetSpatialId,
  resizeMap,
  computePointDirection,
  selectMainObject,
} from "../common/common_func";
import { layersSetting } from "../mapviewer/config/layers";
import { geometryServiceUrl, mapUrl } from "../mapviewer/config/map";
import { Select, Button, Form, message, Checkbox, Tabs, Row, Col } from "antd";
const { TabPane } = Tabs;
import {
  DragDropContext,
  Droppable,
  Draggable,
  useKeyboardSensor,
} from "react-beautiful-dnd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import { connect } from "react-redux";
import { querySetting, selectDis } from "./Helpers";
var uniqid = require("uniqid");
import {
  slice,
  map,
  get,
  pickBy,
  mapKeys,
  replace,
  assign,
  pick,
  includes,
  orderBy,
  isEqual,
  isEmpty,
} from "lodash";
const _ = require("lodash");
import { LoadModules } from "../common/esri_loader";
import axios from "axios";
import label from "../../../label";
import store from "app/reducers";
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

const sideClass = {
  float: "right",
  textAlign: "right",
  fontSize: "20px",
  marginLeft: "10px",
  marginRight: "10px",
  backgroundColor: "#E0E0E0",
};

const itemContainerWest = {
  borderLeft: "13px solid red",
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

const itemContainerEmpty = {
  height: "auto",
  margin: "auto",
  width: "500px",
  marginTop: "35px",
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

Array.prototype.sum = (prop) => {
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
// Number.prototype.toFixed = function (fixed) {
//   //var re = new RegExp(`^\\d+(?:\\.\\d{0,${fixed}})?`);
//   let str = (!isNaN(Number(this)) && Number(this)?.toString()) || String(this);
//   return str?.slice(0, str.indexOf(".") + fixed + 1);
// };
class cadSuggestedDataComponent extends Component {
  constructor(props) {
    super(props);
    this.parcel_fields_headers = [
      "الإتجاه",
      "شمال / شرق",
      "شمال / غرب",
      "جنوب / شرق",
      "جنوب / غرب",
    ];
    this.parcel_fields = [
      { name: "direction", editable: false },
      { name: "NORTH_EAST_DIRECTION", editable: true },
      { name: "NORTH_WEST_DIRECTION", editable: true },
      { name: "SOUTH_EAST_DIRECTION", editable: true },
      { name: "SOUTH_WEST_DIRECTION", editable: true },
    ];
    this.InvokedToAdParcel = false;

    if (this.props.mainObject?.data_msa7y?.msa7yData?.cadDetails) {
      const {
        mainObject: {
          data_msa7y: {
            msa7yData: { cadDetails },
          },
        },
      } = props;

      this.state = {
        isConfirmed: true,
        outRange: (cadDetails.temp && cadDetails.temp.outRange) || false,
        pointsLength: [],
        annotationLength: 3,
        polygons: [],
        demSaveDraft: false,
        cadFiles: {},
        layerParcels: [],
        planDescription: cadDetails.planDescription || "",
        activeKey: "1",
        cadResults:
          (cadDetails.temp && cadDetails.temp.cadResults) || undefined,
        notify: false,
        hasNotify: false,
        hideDrag: false,
        lineLengthFont: 20,
        parcelNumberFont: 20,
        isBoundry: false,
        mun: cadDetails.mun || {},
        muns: [],
        have_electric_room:
          (cadDetails.temp && cadDetails.temp.have_electric_room) || false,
        electric_room_area:
          (cadDetails.temp && cadDetails.temp.electric_room_area) || 0,
        reqType:
          (([34].indexOf(this.props.currentModule.id) != -1 ||
            [1949, 2048].indexOf(this.props.currentModule.record.workflow_id) !=
              -1) &&
            "duplex") ||
          "",
      };
    } else {
      this.state = {
        isConfirmed: true,
        outRange: false,
        hasNotify: false,
        pointsLength: [],
        annotationLength: 3,
        polygons: [],
        survayParcelCutter: [
          {
            direction: "الشطفة",
            NORTH_EAST_DIRECTION: "",
            NORTH_WEST_DIRECTION: "",
            SOUTH_EAST_DIRECTION: "",
            SOUTH_WEST_DIRECTION: "",
          },
        ],
        demSaveDraft: false,
        cadFiles: {},
        layerParcels: [],
        planDescription: "",
        activeKey: "1",
        cadResults: undefined,
        notify: false,
        hasNotify: false,
        hideDrag: false,
        lineLengthFont: 20,
        parcelNumberFont: 20,
        isBoundry: false,
        mun: {},
        muns: [],
        have_electric_room: false,
        electric_room_area: 0,
        reqType:
          (([34].indexOf(this.props.currentModule.id) != -1 ||
            [1949, 2048].indexOf(this.props.currentModule.record.workflow_id) !=
              -1) &&
            "duplex") ||
          "",
      };
    }

    fetchData(`${workFlowUrl}/api/Municipality`).then((response) => {
      this.state.muns = response.results;
    });

    if (this.props.mainObject?.data_msa7y?.msa7yData?.cadDetails?.temp) {
      const {
        inputs,
        mainObject: {
          data_msa7y: {
            msa7yData: {
              cadDetails: { suggestionsParcels, temp },
            },
          },
          tadkek_data_Msa7y: {
            tadkek_msa7yData: { requestType },
          },
        },
      } = props;

      suggestionsParcels.forEach((element, index) => {
        if (!inputs?.north) {
          inputs?.north?.forEach((input, key) => {
            this.state[input.name + index] = temp[input.name + index] || "";
          });
        }
        if (!inputs?.east) {
          inputs?.east?.forEach((input, key) => {
            this.state[input.name + index] = temp[input.name + index] || "";
          });
        }
        if (!inputs?.west) {
          inputs?.west?.forEach((input, key) => {
            this.state[input.name + index] = temp[input.name + index] || "";
          });
        }
        if (!inputs?.south) {
          inputs?.south?.forEach((input, key) => {
            this.state[input.name + index] = temp[input.name + index] || "";
          });
        }

        //if (!element.parcel_name) {
        element.parcel_name = setParcelName([
          temp["parcel_name" + index],
          requestType != 2 ? temp["parcelSliceNo" + index] : "1",
        ]);

        element.parcelNameRight = temp["parcel_name" + index];
        element.parcelNameLeft =
          requestType != 2 ? temp["parcelSliceNo" + index] : "1";
        //}
        this.state["north_Desc" + index] =
          element["north_Desc"] || temp["north_Desc" + index] || "";
        this.state["west_Desc" + index] =
          element["west_Desc"] || temp["west_Desc" + index] || "";
        this.state["south_Desc" + index] =
          element["south_Desc"] || temp["south_Desc" + index] || "";
        this.state["east_Desc" + index] =
          element["east_Desc"] || temp["east_Desc" + index] || "";

        this.state["northBoundries" + index] =
          element.data[0].data.map((item, i) => {
            return {
              id: `item-${"north_" + i}`,
              content: item.text,
              data: item,
            };
          }) || temp["northBoundries" + index];
        this.state["southBoundries" + index] =
          element.data[4].data.map((item, i) => {
            return {
              id: `item-${"south_" + i}`,
              content: item.text,
              data: item,
            };
          }) || temp["southBoundries" + index];
        this.state["eastBoundries" + index] =
          element.data[1].data.map((item, i) => {
            return {
              id: `item-${"east_" + i}`,
              content: item.text,
              data: item,
            };
          }) || temp["eastBoundries" + index];
        this.state["westBoundries" + index] =
          element.data[3].data.map((item, i) => {
            return {
              id: `item-${"west_" + i}`,
              content: item.text,
              data: item,
            };
          }) || temp["westBoundries" + index];
        this.state["parcelSliceNo" + index] =
          requestType != 2
            ? temp["parcelSliceNo" + index] || element.parcelNameLeft
            : "1";
        this.state["parcel_name" + index] =
          temp["parcel_name" + index] || element.parcelNameRight || "";
        this.state["area" + index] = temp["area" + index] || element.area || "";
      });
    }

    this.isLoaded = true;
    this.toLoadLines = true;
  }

  saveEdit(id, name, i) {
    this.state.survayParcelCutter[0][name] = this["edit_" + name + i];
    this.setState({
      [name + "_isEdit_" + i]: false,
      survayParcelCutter: this.state.survayParcelCutter,
    });
    this.settoStore(this.state.polygons);
  }

  myChangeHandler = (name, i, e, event) => {
    this["edit_" + name + i] = event.target.value;
    e[name] = event.target.value;
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  showEditBtn = (name, value) => {
    return (
      [
        "NORTH_EAST_DIRECTION",
        "NORTH_WEST_DIRECTION",
        "SOUTH_EAST_DIRECTION",
        "SOUTH_WEST_DIRECTION",
      ].indexOf(name) > -1
    );
  };

  enableEdit = (name, i) => {
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  id2List = {
    droppable_North: "northBoundries",
    droppable_South: "southBoundries",
    droppable_East: "eastBoundries",
    droppable_West: "westBoundries",
  };

  getList = (id) => this.state[this.id2List[id] + (this.state.activeKey - 1)];

  onDragEnd = (result) => {
    const { source, destination } = result;
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
        this.state["southBoundries" + (this.state.activeKey - 1)] = items;
      }
      if (source.droppableId === "droppable_North") {
        this.state["northBoundries" + (this.state.activeKey - 1)] = items;
      }
      if (source.droppableId === "droppable_East") {
        this.state["eastBoundries" + (this.state.activeKey - 1)] = items;
      }
      if (source.droppableId === "droppable_West") {
        this.state["westBoundries" + (this.state.activeKey - 1)] = items;
      }
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      if (result.droppable_North) {
        this.state.polygons[+this.state.activeKey - 1].data[0].data =
          result.droppable_North.map((item) => {
            return item.data;
          });
      }
      if (result.droppable_West) {
        this.state.polygons[+this.state.activeKey - 1].data[3].data =
          result.droppable_West.map((item) => {
            return item.data;
          });
      }
      if (result.droppable_South) {
        this.state.polygons[+this.state.activeKey - 1].data[4].data =
          result.droppable_South.map((item) => {
            return item.data;
          });
      }
      if (result.droppable_East) {
        this.state.polygons[+this.state.activeKey - 1].data[1].data =
          result.droppable_East.map((item) => {
            return item.data;
          });
      }

      this.dropSuccess();
      this.calculateLines();

      this.state["northBoundries" + (this.state.activeKey - 1)] =
        result.droppable_North ||
        this.state["northBoundries" + (this.state.activeKey - 1)];
      this.state["southBoundries" + (this.state.activeKey - 1)] =
        result.droppable_South ||
        this.state["southBoundries" + (this.state.activeKey - 1)];
      this.state["eastBoundries" + (this.state.activeKey - 1)] =
        result.droppable_East ||
        this.state["eastBoundries" + (this.state.activeKey - 1)];
      this.state["westBoundries" + (this.state.activeKey - 1)] =
        result.droppable_West ||
        this.state["westBoundries" + (this.state.activeKey - 1)];
    }

    this.settoStore(this.state.polygons);
  };

  dropSuccess = () => {
    const { input } = this.props;
    const { layerParcels } = this.state;

    clearGraphicFromLayer(this.map, "boundriesDirection");
    clearGraphicFromLayer(this.map, "highlightBoundriesGraphicLayer");
    clearGraphicFromLayer(this.map, "pictureGraphicLayer");
    clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");

    var count = 0;

    var oldData = JSON.parse(JSON.stringify(layerParcels));

    this.state.layerParcels = [];

    sortLines(this.state.polygons);

    this.state.polygons.forEach((polygon, key) => {
      if (polygon.polygon) {
        count++;
        var parcelNumber = key + 1;

        if (oldData[key]) {
          polygon.corners = JSON.parse(JSON.stringify(oldData[key].corners));
        } else polygon.corners = [];

        layerParcels.push(JSON.parse(JSON.stringify(polygon.polygon)));
        layerParcels[layerParcels.length - 1].lines = [];
        layerParcels[layerParcels.length - 1].corners = [];

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
              if (this.toLoadLines) {
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

                layerParcels[layerParcels.length - 1].lines.push(polyline);

                var attr = {
                  parcelNumber: parcelNumber,
                };

                addGraphicToLayer(
                  polyline,
                  this.map,
                  "boundriesDirection",
                  color,
                  null,
                  null,
                  null,
                  attr
                );
              }
              // else {
              //   var polyline = new esri.geometry.Polyline(line);
              //   addGraphicToLayer(polyline, this.map, "boundriesDirection", color, null, null, null, attr);
              // }
            });
          }
        });

        layerParcels[layerParcels.length - 1].corners = JSON.parse(
          JSON.stringify(polygon.corners)
        );
      }
    });

    //draw corners
    layerParcels.forEach((polygon, key) => {
      var polygonClass = new esri.geometry.Polygon(polygon);
      var graphic = new esri.Graphic(polygonClass, null, null, null);
      var pt = graphic.geometry.getExtent().getCenter();
      polygon.lines.forEach((line, key) => {
        var attr = {
          BOUNDARY_NO: line.BOUNDARY_NO,
          FROM_CORNER: line.from,
          TO_CORNER: line.to,
          BOUNDARY_LENGTH: line.text,
          BOUNDARY_DIRECTION: line.lineDirection,
        };

        var graphic = new esri.Graphic(line, null, attr, null);
        polygon.lines[key] = graphic;

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

      polygon.corners.forEach((corner, key) => {
        var point = new esri.geometry.Point(corner.lat, corner.lng);
        var mp = esri.geometry.geographicToWebMercator(point);

        var iconTextPosition;
        var iconPosition;

        if (!corner.iconPosition) {
          iconTextPosition = { x: -5, y: 0 };
          iconPosition = { x: 0, y: 0 };

          if (layerParcels.length > 1) {
            iconPosition = getCornerIconPosition(key + 1, polygon.lines);
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
      });
    });

    this.state.polygons.forEach((polygon, key) => {
      if (polygon.polygon) {
        var polygonClass = new esri.geometry.Polygon(polygon.polygon);
        var graphic = new esri.Graphic(polygonClass, null, null, null);
        var pt = graphic.geometry.getExtent().getCenter();

        polygon.position = pt;
        polygon.northDescription = layerParcels[key].northDescription;
        polygon.westDescription = layerParcels[key].westDescription;
        polygon.southDescription = layerParcels[key].southDescription;
        polygon.eastDescription = layerParcels[key].eastDescription;
      }
    });

    // DrawIntersectLines();
  };

  higlightNotify = (polygon) => {
    highlightFeature(
      polygon,
      this.map,
      "notifyZoomGraphicLayer",
      null,
      [255, 255, 255],
      null,
      null,
      true,
      null,
      4
    );
  };

  clearHighlightNotify = () => {
    clearGraphicFromLayer(this.map, "notifyZoomGraphicLayer");
  };

  confirmNotify = (hide) => {
    if (!hide) {
      this.state["hasNotify"] = false;
      this.state["isConfirmed"] = true;
      clearGraphicFromLayer(this.map, "addedParclGraphicLayer");

      this.state.polygons.forEach((elem, key) => {
        //elem.geometry = ;
        addGraphicToLayer(
          elem.polygon,
          this.map,
          "addedParclGraphicLayer",
          [0, 0, 255, 0.8],
          null,
          true,
          (param) => {
            zoomToLayer("addedParclGraphicLayer", this.map, 10);
            //resizeMap(this.map);
          }
        );
      });
      this.getSuggestLine();
    } else {
      this.state["hasNotify"] = true;
      this.state["isConfirmed"] = false;
    }
    var polygons = null;
    if (this.props.mainObject && this.props.mainObject.data_msa7y) {
      const {
        mainObject: {
          data_msa7y: {
            msa7yData: { cadDetails },
          },
        },
      } = this.props;

      polygons =
        !this.InvokedToAdParcel && cadDetails?.suggestionsParcels?.length > 0
          ? cadDetails?.suggestionsParcels
          : this.state["polygons"];
    } else {
      polygons = this.state["polygons"];
    }

    if (!this.state["hasNotify"] && this.state["isConfirmed"]) {
      polygons.map((parcel, index) => {
        parcel.notify = parcel.polygon.notify = "";
      });

      if (
        this.state.cadResults &&
        this.state.cadResults.shapeFeatures &&
        this.state.cadResults.shapeFeatures.length
      ) {
        this.state.cadResults.shapeFeatures.map((parcel) => {
          parcel.notify = "";
        });
      }
    }

    this.settoStore(polygons);
  };

  addParcelToSelect = (geometries, parcelIds) => {
    return new Promise((resolve, reject) => {
      intersectQueryTask({
        outFields: [
          "OBJECTID",
          "MUNICIPALITY_NAME",
          "PARCEL_AREA",
          "PARCEL_LAT_COORD",
          "PARCEL_LONG_COORD",
          "PARCEL_MAIN_LUSE",
          "PLAN_NO",
          "PARCEL_PLAN_NO",
          "USING_SYMBOL",
          "PARCEL_SPATIAL_ID",
        ],
        //spatialRelationship: esri.tasks.Query.SPATIAL_REL_TOUCHES,
        geometry: geometries, // features[0].geometry
        url: mapUrl + "/" + this.LayerID.Landbase_Parcel,
        where: `PARCEL_PLAN_NO ${
          (parcelIds && "in (" + parcelIds.join(",") + ")") || "is not null"
        }`,
        callbackResult: (res) => {
          return resolve(res);
        },
      });
      //}
    });
  };

  initAddParcelNo = (pacrels) => {
    //clearGraphicFromLayer(this.map, "MapPacrelNoGraphicLayer");
    //
    highlightFeature(pacrels, this.map, {
      layerName: "SelectLandsGraphicLayer",
      noclear: false,
      isZoom: false,
      isHiglightSymbol: true,
      highlighColor: [0, 255, 0, 0.5],
      zoomFactor: 10,
    });
    pacrels.forEach((val) => {
      var pt;

      try {
        pt = val.geometry.getExtent().getCenter();
      } catch (e) {
        if (val.geometry.type == "polygon") {
          val.geometry = new esri.geometry.Polygon(val.geometry);
        }
        pt = val.geometry.getExtent().getCenter();
      }

      var angle = getPacrelNoAngle(val);

      addParcelNo(
        pt,
        this.map,
        convertToArabic(val.attributes.PARCEL_PLAN_NO),
        "PacrelUnNamedGraphicLayer",
        28,
        null,
        angle
      );
    });
  };

  cancelNotify = () => {
    this.resetMap();
  };

  clearAllGraphics = () => {
    clearGraphicFromLayer(this.map, "highlightBoundriesGraphicLayer");
    clearGraphicFromLayer(this.map, "PacrelLenNoGraphicLayer");
    clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
    clearGraphicFromLayer(this.map, "addedParclGraphicLayer");
    clearGraphicFromLayer(this.map, "boundriesGraphicLayer");
    clearGraphicFromLayer(this.map, "boundriesDirection");
    clearGraphicFromLayer(this.map, "pictureGraphicLayer");
    clearGraphicFromLayer(this.map, "PacrelUnNamedGraphicLayer");
    clearGraphicFromLayer(this.map, "detailedGraphicLayer");
    clearGraphicFromLayer(this.map, "floorGraphicLayer");
  };

  calculateLines = () => {
    // if (this.state.polygons && this.state.polygons.length) {

    this.state.polygons.forEach((polygon, key) => {
      polygon.data.forEach((lines) => {
        lines.totalLength = 0;
        lines.data.forEach((line) => {
          if (!line.hide) lines.totalLength += +(+line.text).toFixed(2);
        });
        lines.totalLength = lines.totalLength;
      });
    });
  };

  getSuggestLine = () => {
    this.state.polygons.forEach((polygon, index) => {
      if (polygon.area != -1) {
        //this.state['area' + index] = (+polygon.area).toFixed(2);
        var lengthPoint1, lengthPoint2;
        var polyg = new esri.geometry.Polygon(polygon.polygon);
        var polygonCenterPoint = polyg.getExtent().getCenter();

        polygon.data[2].data.forEach((boundry, key) => {
          // //if (this.toLoadLines) {
          // var line = new esri.geometry.Polyline(boundry);
          // var centerPointofLine = line.getExtent().getCenter();

          // var diffrenceInXWithMaxPoint = Math.abs(
          //   centerPointofLine.x - polygon.maxPoint.x
          // );
          // var diffrenceWithPolygonCenterPoint = Math.abs(
          //   centerPointofLine.x - polygonCenterPoint.x
          // );

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
          // //}
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
      }
    });

    this.dropSuccess();

    if (this.state.polygons && this.state.polygons.length > 0) {
      var obj = { polygons: this.state.polygons };
      this.state.polygons.forEach((polygon, index) => {
        this.state["westBoundries" + index] = obj["westBoundries" + index] =
          this.InvokedToAdParcel
            ? polygon.data[3].data.map((item, i) => {
                return {
                  id: `item-${"west_" + i}`,
                  content: item.text,
                  data: item,
                };
              })
            : this.state["westBoundries" + index];
        this.state["northBoundries" + index] = obj["northBoundries" + index] =
          this.InvokedToAdParcel
            ? polygon.data[0].data.map((item, i) => {
                return {
                  id: `item-${"north_" + i}`,
                  content: item.text,
                  data: item,
                };
              })
            : this.state["northBoundries" + index];
        this.state["eastBoundries" + index] = obj["eastBoundries" + index] =
          this.InvokedToAdParcel
            ? polygon.data[1].data.map((item, i) => {
                return {
                  id: `item-${"east_" + i}`,
                  content: item.text,
                  data: item,
                };
              })
            : this.state["eastBoundries" + index];
        this.state["southBoundries" + index] = obj["southBoundries" + index] =
          this.InvokedToAdParcel
            ? polygon.data[4].data.map((item, i) => {
                return {
                  id: `item-${"south_" + i}`,
                  content: item.text,
                  data: item,
                };
              })
            : this.state["southBoundries" + index];
      });

      this.setState(obj);
    }
    this.calculateLines();
  };

  buildCADDetails = () => {
    // componentDidUpdate
    //return new Promise((resolve,reject) => {

    //const { mainObject, mapLayers, t } = this.props;
    let suggestionsParcels =
      this.props.mainObject?.data_msa7y?.msa7yData?.cadDetails
        ?.suggestionsParcels;
    let temp = this.props.mainObject?.data_msa7y?.msa7yData?.cadDetails?.temp;
    let requestType =
      this.props.mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData?.requestType;
    const { t, inputs } = this.props;
    let {
      outRange,
      pointsLength,
      annotationLength,
      polygons,
      lineLengthFont,
      parcelNumberFont,
      isBoundry,
      cadResults,
      notify,
      hideDrag,
      muns,
    } = this.state;
    //if (isPlan) {
    if (this.map && cadResults) {
      //if () {
      //if (!this.state.cadResults.data) {
      clearGraphicFromLayer(this.map, "MapPacrelNoGraphicLayer");
      clearGraphicFromLayer(this.map, "highlightBoundriesGraphicLayer");
      clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
      clearGraphicFromLayer(this.map, "addedParclGraphicLayer");
      clearGraphicFromLayer(this.map, "boundriesGraphicLayer");
      clearGraphicFromLayer(this.map, "boundriesDirection");
      clearGraphicFromLayer(this.map, "pictureGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelUnNamedGraphicLayer");
      clearGraphicFromLayer(this.map, "detailedGraphicLayer");

      this.state["isConfirmed"] = true;
      this.state["outRange"] = null;
      this.state["layerParcels"] = [];

      if (this.state.cadResults) {
        lineLengthFont = 20;
        parcelNumberFont = 20;
      }
      let index = -1;
      if (this.map) {
        this.state["polygons"] = [];

        //this.state.cadResults.lineFeatures = [];
        if (this.state.cadResults.lineFeatures) {
          //draw details
          this.state.cadResults.lineFeatures.forEach((line, appartNumber) => {
            var polyline = new esri.geometry.Polyline(line);
            //lineFeatures.push(polyline);
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

        this.state["hasNotify"] = this.state["demSaveDraft"];
        getPolygons(
          this.state.cadResults.shapeFeatures,
          (polygon, esriModules, elem, key) => {
            this.state["polygons"].push({
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

            var key = this.state.polygons.length - 1;
            // if (!isEmpty(this.state.polygons[key].parcel_name)) {
            //   this.state.polygons[key].parcel_name = isEmpty(this.state[`parcelSliceNo${key}`]) ? this.state[`parcel_name${key}`] : `${this.state[`parcelSliceNo${key}`]}/${this.state[`parcel_name${key}`]}`;
            // }
            //else

            if (
              this.InvokedToAdParcel &&
              isEmpty(this.state.polygons[key].parcel_name)
            ) {
              this.state[`parcelSliceNo${key}`] = this.state.polygons[
                key
              ].parcelNameLeft = requestType != 2 ? "" : "1";
              this.state[`parcel_name${key}`] =
                [34].indexOf(this.props.currentModule.id) != -1 ||
                [1949, 2048].indexOf(
                  this.props.currentModule.record.workflow_id
                ) != -1
                  ? `دوبلكس رقم${key + 1}`
                  : `أرض رقم${key + 1}`; // parcels[key].attributes.PARCEL_PLAN_NO;
              this.state.polygons[key].parcel_name = this.state.polygons[
                key
              ].parcelNameRight = this.state[`parcel_name${key}`];
              this.state[`duplixType${key}`] = "";
              this.state[`area${key}`] = elem.area.toFixed(2);
            }

            this.state["polygons"][key].PARCEL_SPATIAL_ID = "";
            this.state["polygons"][key].area = elem.area;
            this.state["polygons"][key].parcel_nameHidden = "";

            this.state["polygons"][key].notify = polygon.notify;
            this.state["polygons"][key].polygon = polygon;
            this.state["polygons"][key].min;
            this.state["polygons"][key].active = false;
            this.state["polygons"][key].max = 0;
            this.state["polygons"][key].maxPointLineLen;
            this.state["polygons"][key].minPointLineLen;
            this.state["polygons"][key].minLineLen;

            if (polygon.rings.length > 0) {
              var arcLength = 0;
              var arcPoints = [];
              var arcLines = [];

              for (var j = 0, n = polygon.rings[0].length - 1; j < n; j++) {
                var point1 = new esriModules.Point(
                  polygon.rings[0][j][0],
                  polygon.rings[0][j][1],
                  new esri.SpatialReference({ wkid: polygon.spatialReference })
                );
                var point2 = new esriModules.Point(
                  polygon.rings[0][j + 1][0],
                  polygon.rings[0][j + 1][1],
                  new esri.SpatialReference({ wkid: polygon.spatialReference })
                );

                var length = +esriModules.mathUtils.getLength(point1, point2);
                //.toFixed(2);
                //length = Number(parseFloat(length).toFixed(2));

                if (point1.x > this.state["polygons"][key].max) {
                  this.state["polygons"][key].max = point1.x;
                  this.state["polygons"][key].maxPoint = point1;
                }

                if (
                  !this.state["polygons"][key].min ||
                  point1.x < this.state["polygons"][key].min
                ) {
                  this.state["polygons"][key].min = point1.x;
                  this.state["polygons"][key].minPoint = point1;
                }

                if (point2.x > this.state["polygons"][key].max) {
                  this.state["polygons"][key].max = point2.x;
                  this.state["polygons"][key].maxPoint = point2;
                }

                if (
                  !this.state["polygons"][key].min ||
                  point2.x < this.state["polygons"][key].min
                ) {
                  this.state["polygons"][key].min = point2.x;
                  this.state["polygons"][key].minPoint = point2;
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
                      this.state.cadResults.cadFeatures
                    ) &&
                    isPointOrArc(point2, key, this.state.cadResults.cadFeatures)
                  )
                ) {
                  if (
                    isPointOrArc(point2, key, this.state.cadResults.cadFeatures)
                  ) {
                    //
                    arcLength += length;
                    arcPoints.push(point1);
                    path = new esriModules.Polyline(path);
                    path.centroid = path.getExtent().getCenter();
                    arcLines.push(new esriModules.Polyline(path));
                    path.text = arcLength || length;

                    if (
                      this.state.cadResults.boundryFeaturesLen &&
                      this.state.cadResults.boundryFeaturesLen.length &&
                      this.state.cadResults.boundryFeaturesLen.length > 0
                    ) {
                      //
                      var line = getLineLength(
                        this.state.cadResults.boundryFeaturesLen,
                        arcPoints[0],
                        point2,
                        this.state.cadResults.isArc
                      );
                      if (line) path.text = line.length;
                    }

                    length = path.text;
                    path.lines = arcLines;
                    arcLines = [];
                    arcLength = 0;
                    this.state["polygons"][key].data[2].data.push(
                      JSON.parse(JSON.stringify(path))
                    );
                    this.state["polygons"][key].data[2].data[
                      this.state["polygons"][key].data[2].data.length - 1
                    ].centroid = path.getExtent().getCenter();
                  } else {
                    path.hide = true;
                    arcLength += length;
                    arcPoints.push(point1);
                    path = new esriModules.Polyline(path);
                    var polyline = new esriModules.Polyline(path);
                    path.centroid = polyline.getExtent().getCenter();
                    arcLines.push(new esriModules.Polyline(path));
                  }
                }
                if (
                  isPointOrArc(
                    point1,
                    key,
                    this.state.cadResults.cadFeatures
                  ) &&
                  isPointOrArc(point2, key, this.state.cadResults.cadFeatures)
                ) {
                  if (
                    this.state.cadResults.boundryFeaturesLen &&
                    this.state.cadResults.boundryFeaturesLen.length &&
                    this.state.cadResults.boundryFeaturesLen.length > 0
                  ) {
                    //
                    var line = getLineLength(
                      this.state.cadResults.boundryFeaturesLen,
                      point1,
                      point2,
                      this.state.cadResults.isArc
                    );

                    if (line) path.text = line.length;

                    length = path.text;
                  }
                  this.state["polygons"][key].data[2].data.push(
                    JSON.parse(JSON.stringify(path))
                  );
                }

                var polyline = new esriModules.Polyline(path);

                if (
                  !this.state["polygons"][key].minLineLen ||
                  this.state["polygons"][key].minLineLen > length
                )
                  this.state["polygons"][key].minLineLen = length;

                var pt = polyline.getExtent().getCenter();

                if (
                  !(
                    isPointOrArc(
                      point1,
                      key,
                      this.state.cadResults.cadFeatures
                    ) &&
                    isPointOrArc(point2, key, this.state.cadResults.cadFeatures)
                  )
                ) {
                  if (
                    isPointOrArc(point2, key, this.state.cadResults.cadFeatures)
                  ) {
                    if (arcPoints.length)
                      pt = arcPoints[Math.floor(arcPoints.length / 2)];
                  }
                }

                if (
                  isPointOrArc(
                    point1,
                    key,
                    this.state.cadResults.cadFeatures
                  ) &&
                  isPointOrArc(point2, key, this.state.cadResults.cadFeatures)
                ) {
                  this.state["polygons"][key].data[2].data[
                    this.state["polygons"][key].data[2].data.length - 1
                  ].centroid = pt;
                }

                addGraphicToLayer(
                  polyline,
                  this.map,
                  "boundriesGraphicLayer",
                  [0, 0, 255, 0.1],
                  null,
                  null,
                  (param) => {
                    zoomToLayer("boundriesGraphicLayer", this.map, 10);
                    //resizeMap(this.map);
                  }
                );

                if (pt.length) {
                  pt.x = pt[0];
                  pt.y = pt[1];
                }

                var attr = {
                  text: length, //.toFixed(2),
                  angle: getPacrelNoAngle({ geometry: polygon }),
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
                    isPointOrArc(
                      point1,
                      key,
                      this.state.cadResults.cadFeatures
                    ) &&
                    isPointOrArc(point2, key, this.state.cadResults.cadFeatures)
                  ) {
                    pointsLength.push(pt.x.toFixed(4) + "," + pt.y.toFixed(4));

                    addParcelNo(
                      pt,
                      this.map,
                      "" + length.toFixed(2) + "",
                      "editlengthGraphicLayer",
                      lineLengthFont,
                      null,
                      getPacrelNoAngle({ geometry: polygon }),
                      null,
                      attr
                    );
                  } else if (
                    isPointOrArc(point2, key, this.state.cadResults.cadFeatures)
                  ) {
                    if (arcPoints.length)
                      pt = arcPoints[Math.floor(arcPoints.length / 2)];
                    addParcelNo(
                      pt,
                      this.map,
                      "" + length.toFixed(2) + "",
                      "editlengthGraphicLayer",
                      lineLengthFont,
                      null,
                      getPacrelNoAngle({ geometry: polygon }),
                      null,
                      attr
                    );
                  }
                }

                if (
                  isPointOrArc(point2, key, this.state.cadResults.cadFeatures)
                ) {
                  arcPoints = [];
                }
              }

              if (elem.outRange) {
                this.state["outRange"] = true;
              }
              if (elem.notify) {
                //
                this.state["isConfirmed"] = false;
                this.state["hasNotify"] = true;
                addGraphicToLayer(
                  polygon,
                  this.map,
                  "addedParclGraphicLayer",
                  null,
                  [255, 0, 0, 0.6]
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

              if (this.state["reqType"] != "duplex") {
                this.state["polygons"][key].parcel_nameHidden =
                  this.state["polygons"].length +
                  " " +
                  t("labels:PARCELCOUNTERDRAGREV");
                console.log("---P----");
                addParcelNo(
                  polygon.getExtent().getCenter(),
                  this.map,
                  convertToArabic(
                    setParcelName([
                      this.state[`parcel_name${key}`],
                      this.state["parcelSliceNo" + key],
                    ])
                  ),
                  "PacrelUnNamedGraphicLayer",
                  parcelNumberFont,
                  [0, 0, 0],
                  getPacrelNoAngle({ geometry: polygon })
                );
              } else {
                this.state["polygons"][key].parcel_nameHidden =
                  this.state["polygons"].length +
                  " " +
                  t("labels:DUPLIXCOUNTERDRAGREV");
                console.log("---T----");
                addParcelNo(
                  polygon.getExtent().getCenter(),
                  this.map,
                  convertToArabic(
                    setParcelName([
                      this.state[`parcel_name${key}`],
                      this.state["parcelSliceNo" + key],
                    ])
                  ),
                  "PacrelUnNamedGraphicLayer",
                  parcelNumberFont,
                  [0, 0, 0],
                  getPacrelNoAngle({ geometry: polygon })
                );
              }
            }

            // const {
            //   mainObject: {
            //     tadkek_data_Msa7y: {
            //       tadkek_msa7yData: { requestType },
            //     },
            //   },
            // } = this.props;
            let tadkekMainObject = selectMainObject(this.props);

            if (
              this.state["polygons"].length ==
              this.state.cadResults.shapeFeatures.length
            ) {
              if (requestType == 1 && this.state["polygons"].length < 2) {
                this.state["outRange"] = true;

                this.state["polygons"].forEach((polygon) => {
                  polygon.notify = "mapview.parcels.FarzNotify";
                });
                this.state["hasNotify"] = true;
                this.state["isConfirmed"] = false;
              } else if (
                requestType == 2 &&
                this.state["polygons"].length > 1
              ) {
                this.state["outRange"] = true;

                this.state["polygons"].forEach((polygon) => {
                  polygon.notify = "mapview.parcels.DamgNotify";
                });
                this.state["hasNotify"] = true;
                this.state["isConfirmed"] = false;
              }

              // check if suggest polygon has same PARCEL_SPAITAL_ID
              this.state["polygons"].forEach((polygon) => {
                var polygonSpatialId = GetSpatialId(polygon.polygon);

                tadkekMainObject.landData.landData.lands.parcels.forEach(
                  (identifyPolygon) => {
                    if (
                      identifyPolygon.attributes.PARCEL_SPATIAL_ID ==
                      polygonSpatialId
                    ) {
                      this.state["outRange"] = true;
                      this.state["isConfirmed"] = false;
                      this.state["hasNotify"] = true;
                      polygon.notify = "mapview.parcels.HASSAMESPATIALID";
                      addGraphicToLayer(
                        polygon.polygon,
                        this.map,
                        "addedParclGraphicLayer",
                        null,
                        [255, 0, 0, 0.6]
                      );
                    }
                  }
                );
              });

              this.state["demSaveDraft"] = false;

              if (!this.state["hasNotify"]) {
                clearGraphicFromLayer(this.map, "addedParclGraphicLayer");

                this.state["polygons"].forEach((elem, key) => {
                  addGraphicToLayer(
                    elem.polygon,
                    this.map,
                    "addedParclGraphicLayer",
                    [0, 0, 255, 0.8],
                    null,
                    true
                  );
                });

                zoomToIdentifyParcel(this.map);
              }

              this.confirmNotify(this.state["hideDrag"]);
              checkParcelAdjacents(
                tadkekMainObject.landData.landData.lands.parcels,
                false
              );
            }
          }
        );
      }
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !isEqual(nextProps.input.value, this.props.input.value) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      !isEqual(nextProps.forceUpdate, this.props.forceUpdate)
    );
    {
      return true;
    }

    return false;
  }

  settoStore(polygons) {
    const { mun } = this.state;
    const { input, inputs } = this.props;

    if (polygons && polygons.length) {
      var obj = {};
      polygons.forEach((element, key) => {
        obj["westBoundries" + key] = this.state["westBoundries" + key];
        obj["southBoundries" + key] = this.state["southBoundries" + key];
        obj["northBoundries" + key] = this.state["northBoundries" + key];
        obj["eastBoundries" + key] = this.state["eastBoundries" + key];

        inputs?.north?.forEach((input, index) => {
          obj[input.name + key] = this.state[input.name + key];
        });
        inputs?.east?.forEach((input, index) => {
          obj[input.name + key] = this.state[input.name + key];
        });
        inputs?.west?.forEach((input, index) => {
          obj[input.name + key] = this.state[input.name + key];
        });
        inputs?.south?.forEach((input, index) => {
          obj[input.name + key] = this.state[input.name + key];
        });

        obj["area" + key] = this.state["area" + key];
        obj["parcelSliceNo" + key] = this.state["parcelSliceNo" + key];

        obj["parcel_name" + key] = this.state["parcel_name" + key];
        obj["duplixType" + key] = this.state["duplixType" + key] || "";
      });
    }

    var inputChanged = {
      suggestionsParcels: polygons,
      planDescription: this.state.planDescription,
      mun: mun,
      temp: {
        cadResults:
          input.value.cadData ||
          this.state.cadResults ||
          (input.value.temp && input.value.temp.cadResults) ||
          undefined,
        notify:
          input.value.notify ||
          this.state.notify ||
          (input.value.temp && input.value.temp.notify) ||
          false,
        hideDrag:
          input.value.hideDrag ||
          this.state.hideDrag ||
          (input.value.temp && input.value.temp.hideDrag) ||
          false,
        hasNotify:
          this.state["hasNotify"] ||
          (input.value.temp && input.value.temp.hasNotify) ||
          false,
        isConfirmed:
          this.state["isConfirmed"] ||
          (input.value.temp && input.value.temp.isConfirmed) ||
          false,
        outRange:
          this.state["outRange"] ||
          (input.value.temp && input.value.temp.outRange) ||
          false,
        isFarz: true,
        ...obj,
      },
    };
    input.onChange({ ...inputChanged });
    // hasNotify, hideDrag, outRange
    this.setState({
      polygons: polygons,
      hasNotify: this.state["hasNotify"],
      hideDrag: this.state["hideDrag"],
      outRange: this.state["outRange"],
      ...obj,
    });
  }

  // redrawNames = (polygon, map, index) => {
  //
  //   console.log("---r----");
  //   let { parcelNumberFont } = this.state;
  //   if (polygon) {
  //     var filteredGraphic = map
  //       .getLayer("PacrelUnNamedGraphicLayer")
  //       .graphics.find(
  //         (graphic) =>
  //           graphic.geometry.x == polygon.position.x &&
  //           graphic.geometry.y == polygon.position.y
  //       );
  //     if (filteredGraphic) {
  //       map.getLayer("PacrelUnNamedGraphicLayer").remove(filteredGraphic);
  //       var name =
  //         convertToArabic(
  //           setParcelName([
  //             this.state["parcelSliceNo" + index],
  //             this.state[`parcel_name${index}`],
  //           ])
  //         ) || polygon.parcel_nameHidden;

  //       if (name && name.indexOf("حدود المعاملة") >= -1) {
  //         addParcelNo(
  //           polygon.position,
  //           map,
  //           "" + name + "",
  //           "PacrelUnNamedGraphicLayer",
  //           parcelNumberFont,
  //           [0, 0, 0],
  //           getPacrelNoAngle({ geometry: polygon.polygon })
  //         );
  //       }
  //     }
  //   }
  // };

  resetStore() {
    const { mun } = this.state;
    const { input, inputs } = this.props;

    var obj = {};
    if (this.state.polygons && this.state.polygons.length) {
      this.state.polygons.forEach((element, key) => {
        obj["westBoundries" + key] = "";
        obj["southBoundries" + key] = "";
        obj["northBoundries" + key] = "";
        obj["eastBoundries" + key] = "";
        inputs?.north?.forEach((input, index) => {
          obj[input.name + key] = "";
        });
        inputs?.east?.forEach((input, index) => {
          obj[input.name + key] = "";
        });
        inputs?.west?.forEach((input, index) => {
          obj[input.name + key] = "";
        });
        inputs?.south?.forEach((input, index) => {
          obj[input.name + key] = "";
        });
        obj["area" + key] = "";
        obj["parcelSliceNo" + key] = "";
        obj["parcel_name" + key] = "";
        obj["duplixType" + key] = "";
      });
    }
    var polygons = [];
    this.setState({
      polygons: polygons,
      hasNotify: false,
      notify: false,
      hideDrag: false,
      outRange: false,
      isConfirmed: true,
      ...obj,
    });

    var inputChanged = {
      suggestionsParcels: polygons,
      planDescription: "",
      mun: mun,
      temp: {
        cadResults: undefined,
        notify: false,
        hasNotify: false,
        hideDrag: false,
        isFarz: true,
        isConfirmed: true,
        ...obj,
      },
    };

    this.props.input.onChange({ ...inputChanged });
  }

  clearInputs = () => {
    const { inputs } = this.props;
    if (this.state.polygons && this.state.polygons.length) {
      this.state.polygons.forEach((polygon, index) => {
        this.state["westBoundries" + index] = [];
        this.state["northBoundries" + index] = [];
        this.state["eastBoundries" + index] = [];
        this.state["southBoundries" + index] = [];
        inputs?.north?.forEach((input, key) => {
          this.state[input.name + index] = "";
        });
        inputs?.east?.forEach((input, key) => {
          this.state[input.name + index] = "";
        });
        inputs?.west?.forEach((input, key) => {
          this.state[input.name + index] = "";
        });
        inputs?.south?.forEach((input, key) => {
          this.state[input.name + index] = "";
        });
        this.state["area" + index] = "";
        this.state["parcelSliceNo" + index] = "";
        this.state["parcel_name" + index] = "";
        this.state["duplixType" + index] = "";
      });
    }

    this.state["have_electric_room"] = false;
    this.state["electric_room_area"] = "";

    this.state.polygons = [];
    this.state.pointsLength = [];
    this.state.cadFiles = {};
    this.state.layerParcels = [];
    this.state.planDescription = "";
    this.state.activeKey = "1";
  };

  resetMap = () => {
    if (this?.map?.graphicsLayerIds) {
      this.map.graphicsLayerIds.forEach((layerName, index) => {
        clearGraphicFromLayer(this.map, layerName);
      });
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
  };

  checkIntersectionOfParcels = () => {
    const {
      landData: {
        landData: {
          lands: { parcels },
        },
      },
    } = selectMainObject(this.props);

    let isDataDrawn = false;
    getInfo().then((res) => {
      this.LayerID = res;
      let outRange = 0;

      this.state?.cadResults?.shapeFeatures?.forEach((feature) => {
        var polygonJson = {
          rings: feature.rings,
          spatialReference: feature.spatialReference,
        };
        var polygon = new esri.geometry.Polygon(polygonJson);
        this.addParcelToSelect(polygon).then((res) => {
          if (res.features) {
            let isParcelExist = false;

            res.features.map((feature) => {
              isParcelExist =
                parcels.filter((parcel) => {
                  return (
                    feature.attributes.PARCEL_PLAN_NO ==
                      parcel.attributes.PARCEL_PLAN_NO &&
                    feature.attributes.PARCEL_SPATIAL_ID ==
                      parcel.attributes.PARCEL_SPATIAL_ID
                  );
                }).length > 0;

              if (isParcelExist && !isDataDrawn) {
                isDataDrawn = true;
                this.buildCADDetails();
              }
            });

            if (!isDataDrawn) {
              outRange++;
              if (outRange == this.state.cadResults.shapeFeatures.length) {
                this.settoStore([]);
                window.notifySystem(
                  "error",
                  `الكاد المرفق لا يتقاطع مع الأراضي المختارة، يرجي التأكد من إحداثيات الكاد المرفق`
                );
              }
            }
          }
        });
      });
    });
  };

  componentDidUpdate() {
    const { input } = this.props;
    if (input.value && input.value != "" && input.value.justInvoked) {
      this.InvokedToAdParcel = true;
      input.value.justInvoked = false;
      this.isLoaded = false;
      this.map = getMap();
      if (this.map) {
        this.clearInputs();
        this.toLoadLines = true;
        this.state.cadResults = input.value.cadData || undefined;
        this.state.hasNotify = input.value.notify || false;
        this.state.hideDrag = input.value.hideDrag || false;

        if (this.state.cadResults) {
          this.state.cadResults.shapeFeatures.map((parcel, index) => {
            this.state["northBoundries" + index] = "";
            this.state["southBoundries" + index] = "";
            this.state["eastBoundries" + index] = "";
            this.state["westBoundries" + index] = "";
          });

          this.checkIntersectionOfParcels();
        } else {
          this.resetMap();
        }
      }
    } else if (this.isLoaded) {
      this.map = getMap();
      if (getIsMapLoaded()) {
        setIsMapLoaded(false);

        this.toLoadLines = true;
        this.InvokedToAdParcel = false;
        if (this.props.mainObject?.data_msa7y?.msa7yData?.cadDetails) {
          const {
            mainObject: {
              data_msa7y: {
                msa7yData: {
                  cadDetails: { suggestionsParcels, temp },
                },
              },
            },
          } = this.props;

          if (suggestionsParcels && suggestionsParcels.length) {
            suggestionsParcels.forEach((polygon, key) => {
              this.state["duplixType" + key] = temp["duplixType" + key];
            });
          }
        }

        this.checkIntersectionOfParcels();

        this.isLoaded = false;
      }
    }

    return false;
  }

  getParcelAdjacents = (parcels) => {
    getInfo().then((res) => {
      this.LayerID = res;
      var token = "";
      if (window.esriToken) token = "?token=" + window.esriToken;
      var flayer = new esri.layers.FeatureLayer(
        mapUrl + "/" + this.LayerID.Landbase_Parcel + token,
        {
          outFields: ["*"],
        }
      );

      this.besideParcels = [];
      let i = 0;
      if (parcels) {
        var query = new esri.tasks.Query();
        query.objectIds = parcels.map((feature) => feature.attributes.OBJECTID);
        query.outFields = ["*"];
        flayer.queryFeatures(query, (featureSet) => {
          featureSet.features.forEach((parcel) => {
            this.addParcelToSelect(parcel.geometry).then((res) => {
              i++;
              Array.prototype.push.apply(this.besideParcels, res.features);
              if (featureSet.features.length == i) {
                this.initAddParcelNo([
                  ...new Map(
                    this.besideParcels
                      .filter((queryParcel) => {
                        return (
                          featureSet.features.filter((fsFeature) => {
                            return (
                              queryParcel.attributes.OBJECTID ==
                              fsFeature.attributes.OBJECTID
                            );
                          }).length == 0
                        );
                      })
                      .map((item) => [item["attributes"]["OBJECTID"], item])
                  ).values(),
                ]);
              }
            });
          });
        });
      }
    });
  };

  duplixTypeChange = (selectedType, polygon, key, evt) => {
    polygon["duplixType"] = selectedType;
    this.state["duplixType" + key] = selectedType;

    var minLength = 0;
    polygon.data.forEach((val, key) => {
      if (
        (minLength > parseFloat(val.totalLength) || minLength == 0) &&
        val.name != "main"
      ) {
        minLength = val.totalLength;
      }
    });

    if (selectedType == "splited") {
      if (minLength < 11.5) {
        polygon.cantSplitedOrMarged = true;
        polygon.errorInDuplixType = true;
        polygon.errorMsgForDuplixType =
          "لا يمكنك أختيار فلل منفصلة لان طول أقل ضلع فى هذه الدوبلكس أقل من 11.5 متر";
      } else {
        polygon.cantSplitedOrMarged = false;
        polygon.errorInDuplixType = false;
        polygon.errorMsgForDuplixType = "";
      }
    } else if (selectedType == "marged") {
      if (minLength < 9.5) {
        polygon.cantSplitedOrMarged = true;
        polygon.errorInDuplixType = true;
        polygon.errorMsgForDuplixType =
          "لا يمكنك أختيار فلل متصلة لان طول أقل ضلع فى هذه الدوبلكس أقل من 9.5 متر";
      } else {
        polygon.cantSplitedOrMarged = false;
        polygon.errorInDuplixType = false;
        polygon.errorMsgForDuplixType = "";
      }
    } else {
      polygon.errorInDuplixType = false;
      polygon.errorMsgForDuplixType = "";
    }

    if (!isEmpty(polygon.errorMsgForDuplixType))
      window.notifySystem("error", `${polygon.errorMsgForDuplixType}`);

    this.state.polygons[key] = polygon;
    this.settoStore(this.state.polygons);
  };

  onInputTextChange = (polygon, key, evt) => {
    polygon[evt.target.name] = evt.target.value;
    console.log(polygon);
    this.state[evt.target.name + key] = evt.target.value;
    this.state.polygons[key] = polygon;
    this.settoStore(this.state.polygons);
  };

  onParcelTextChange = (polygon, key, evt) => {
    this.state[evt.target.name + key] = evt.target.value;

    polygon.parcel_name = setParcelName([
      this.state[`parcel_name${key}`],
      this.state["parcelSliceNo" + key],
    ]);
    polygon.parcelNameRight = this.state[`parcel_name${key}`];
    polygon.parcelNameLeft = this.state["parcelSliceNo" + key];

    this.state.polygons[key] = polygon;
    redrawNames(
      this.state.polygons[key],
      this.map,
      setParcelName([
        this.state[`parcel_name${key}`],
        this.state["parcelSliceNo" + key],
      ]),
      "PacrelUnNamedGraphicLayer",
      key
    );
    this.settoStore(this.state.polygons);
  };

  onChange = (activeKey) => {
    if (this.state.polygons[+activeKey - 1].data) {
      this.setState({
        activeKey,
        [`duplixType${+activeKey - 1}`]:
          this.state.polygons[+activeKey - 1].duplixType,
        ["westBoundries" + (+activeKey - 1)]: this.state.polygons[
          +activeKey - 1
        ].data[3].data.map((item, i) => {
          return {
            id: `item-${"west_" + i}`,
            content: item.text,
            data: item,
          };
        }),
        ["northBoundries" + (+activeKey - 1)]: this.state.polygons[
          +activeKey - 1
        ].data[0].data.map((item, i) => {
          return {
            id: `item-${"north_" + i}`,
            content: item.text,

            data: item,
          };
        }),
        ["eastBoundries" + (+activeKey - 1)]: this.state.polygons[
          +activeKey - 1
        ].data[1].data.map((item, i) => {
          return {
            id: `item-${"east_" + i}`,
            content: item.text,

            data: item,
          };
        }),
        ["southBoundries" + (+activeKey - 1)]: this.state.polygons[
          +activeKey - 1
        ].data[4].data.map((item, i) => {
          return {
            id: `item-${"south_" + i}`,
            content: item.text,
            data: item,
          };
        }),
      });
    } else {
      this.setState({ activeKey });
    }
  };

  onmouseover = (item) => {
    var polyline = new esri.geometry.Polyline(item);
    highlightFeature(polyline, this.map, {
      layerName: "highlightBoundriesGraphicLayer",
      fillColor: item.color,
    });
  };

  onmouseleave = () => {
    clearGraphicFromLayer(this.map, "highlightBoundriesGraphicLayer");
  };

  onElectricInputChange = (stateName, evt) => {
    this.state[stateName] =
      evt.target.type == "checkbox" ? evt.target.checked : evt.target.value;
    this.settoStore(this.state.polygons);
  };

  render() {
    const { planDescription, reqType, hasNotify, hideDrag, outRange } =
      this.state;
    const {
      mainObject: {
        tadkek_data_Msa7y: {
          tadkek_msa7yData: { requestType },
        },
      },
      isView,
      inputs,
      t,
    } = this.props;

    const {
      landData: {
        landData: {
          lands: { parcels },
        },
      },
    } = selectMainObject(this.props);
    //return <></>;
    return (
      <>
        {!isView && (
          <div>
            <div className="col-md-12">
              {hasNotify && (
                <div
                  className="col-md-12"
                  style={{
                    border: "2px solid #FFA423",
                    height: "400px",
                    borderRadius: "10px",
                    background: "#F2DEDE",
                  }}
                >
                  <div
                    style={{
                      overflowY: "auto",
                      maxHeight: "320px",
                      height: "320px",
                    }}
                  >
                    {this.state.polygons.map((parcel, index) => {
                      return (
                        <>
                          {parcel.notify && (
                            <div
                              onMouseOver={this.higlightNotify.bind(
                                this,
                                parcel.polygon
                              )}
                              onMouseLeave={this.clearHighlightNotify.bind(
                                this
                              )}
                            >
                              <i
                                className="fa fa-exclamation-triangle pulse"
                                style={{
                                  float: "right",
                                  margin: "7px",
                                  marginTop: "10px",
                                  fontSize: "35px",
                                  color: "#E74C3C",
                                }}
                              ></i>
                              <p
                                className="bg-danger"
                                style={{
                                  padding: "5px",
                                  background: "#EFC2C2",
                                }}
                              >
                                {" "}
                                {t(`cadData:${parcel.notify}`)}
                              </p>
                            </div>
                          )}
                        </>
                      );
                    })}
                  </div>
                  {/* <div className="text-center">
                    {!outRange && (
                      <input
                        className="btn btn-primary small-font"
                        type="button"
                        name="name"
                        value={t("modals:Confirm")}
                        onClick={this.confirmNotify.bind(this, false)}
                      />
                    )}
                    <input
                      className="btn btn-danger small-font"
                      type="button"
                      name="name"
                      value={t("modals:Reject")}
                      onClick={this.cancelNotify.bind(this)}
                    />
                  </div> */}
                </div>
              )}
            </div>
            <div className="col-md-12">
              <div>
                {planDescription != "" && (
                  <p style={{ textAlign: "right", fontSize: "18px" }}>
                    {planDescription}
                  </p>
                )}
              </div>
              <div>
                {!hasNotify &&
                  this.state.polygons &&
                  this.state.polygons.length > 0 &&
                  this.state.polygons[0].area != -1 && (
                    <Tabs
                      style={{ marginTop: "30px" }}
                      tabPosition="top"
                      type="card"
                      activeKey={this.state.activeKey}
                      onChange={this.onChange}
                    >
                      {this.state.polygons.map((polygon, key) => {
                        return (
                          <TabPane
                            tab={convertToArabic(
                              polygon.parcel_name ||
                                ([34].indexOf(this.props.currentModule.id) !=
                                  -1 ||
                                [1949, 2048].indexOf(
                                  this.props.currentModule.record.workflow_id
                                ) != -1
                                  ? `دوبلكس رقم${key + 1}`
                                  : `أرض رقم${key + 1}`)
                            )}
                            key={key + 1}
                          >
                            {key == this.state["activeKey"] - 1 && (
                              <div key={key}>
                                <div>
                                  المساحة الكلية :{" "}
                                  {convertToArabic((+polygon.area).toFixed(2))}{" "}
                                  م{convertToArabic(2)}
                                </div>

                                {inputs && (
                                  <DragDropContext onDragEnd={this.onDragEnd}>
                                    <div style={itemContainerNorth}>
                                      <p
                                        style={{
                                          textAlign: "center",
                                          fontSize: "18px",
                                        }}
                                      >
                                        الشمال
                                      </p>

                                      {inputs?.north?.map((input, index) => {
                                        return (
                                          <input
                                            name={input.name}
                                            type={input.type || "text"}
                                            className="ant-input"
                                            placeholder={input.placeholder}
                                            required="required"
                                            value={this.state[input.name + key]}
                                            onChange={this.onInputTextChange.bind(
                                              this,
                                              polygon,
                                              key
                                            )}
                                          />
                                        );
                                      })}

                                      <Droppable droppableId="droppable_North">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle(
                                              snapshot.isDraggingOver
                                            )}
                                          >
                                            {this.state[
                                              "northBoundries" + key
                                            ] &&
                                              this.state[
                                                "northBoundries" + key
                                              ].map((item, index) => (
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
                                                        provided.draggableProps
                                                          .style
                                                      )}
                                                      onMouseOver={this.onmouseover.bind(
                                                        this,
                                                        item.data
                                                      )}
                                                      onMouseLeave={this.onmouseleave.bind(
                                                        this
                                                      )}
                                                    >
                                                      {convertToArabic(
                                                        item.content &&
                                                          (+item.content)?.toFixed(
                                                            2
                                                          )
                                                      )}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                      <p
                                        style={{
                                          float: "left",
                                          textAlign: "left",
                                          fontSize: "20px",
                                        }}
                                      >
                                        طول الحد :{" "}
                                        {convertToArabic(
                                          polygon.data[0].totalLength &&
                                            (+polygon.data[0]
                                              .totalLength).toFixed(2)
                                        )}
                                      </p>
                                    </div>

                                    <div style={{ display: "flex" }}>
                                      <div style={itemContainerEast}>
                                        <p
                                          style={{
                                            textAlign: "center",
                                            fontSize: "18px",
                                          }}
                                        >
                                          الشرق
                                        </p>

                                        {inputs?.east?.map((input, index) => {
                                          return (
                                            <input
                                              name={input.name}
                                              type={input.type || "text"}
                                              className="ant-input"
                                              placeholder={input.placeholder}
                                              required="required"
                                              value={
                                                this.state[input.name + key]
                                              }
                                              onChange={this.onInputTextChange.bind(
                                                this,
                                                polygon,
                                                key
                                              )}
                                            />
                                          );
                                        })}

                                        <Droppable droppableId="droppable_East">
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              style={getListStyle(
                                                snapshot.isDraggingOver
                                              )}
                                            >
                                              {this.state[
                                                "eastBoundries" + key
                                              ] &&
                                                this.state[
                                                  "eastBoundries" + key
                                                ].map((item, index) => (
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
                                                          provided
                                                            .draggableProps
                                                            .style
                                                        )}
                                                        onMouseOver={this.onmouseover.bind(
                                                          this,
                                                          item.data
                                                        )}
                                                        onMouseLeave={this.onmouseleave.bind(
                                                          this
                                                        )}
                                                      >
                                                        {convertToArabic(
                                                          item.content &&
                                                            (+item.content)?.toFixed(
                                                              2
                                                            )
                                                        )}
                                                      </div>
                                                    )}
                                                  </Draggable>
                                                ))}
                                              {provided.placeholder}
                                            </div>
                                          )}
                                        </Droppable>
                                        <p
                                          style={{
                                            float: "left",
                                            textAlign: "left",
                                            fontSize: "20px",
                                          }}
                                        >
                                          طول الحد :{" "}
                                          {convertToArabic(
                                            polygon.data[1].totalLength &&
                                              (+polygon.data[1]
                                                .totalLength).toFixed(2)
                                          )}
                                        </p>
                                      </div>

                                      <div style={itemContainerEmpty}> </div>
                                      <div style={itemContainerWest}>
                                        <p
                                          style={{
                                            textAlign: "center",
                                            fontSize: "18px",
                                          }}
                                        >
                                          الغرب
                                        </p>

                                        {inputs?.west?.map((input, index) => {
                                          return (
                                            <input
                                              name={input.name}
                                              type={input.type || "text"}
                                              className="ant-input"
                                              placeholder={input.placeholder}
                                              required="required"
                                              value={
                                                this.state[input.name + key]
                                              }
                                              onChange={this.onInputTextChange.bind(
                                                this,
                                                polygon,
                                                key
                                              )}
                                            />
                                          );
                                        })}

                                        <Droppable droppableId="droppable_West">
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              style={getListStyle(
                                                snapshot.isDraggingOver
                                              )}
                                            >
                                              {this.state[
                                                "westBoundries" + key
                                              ] &&
                                                this.state[
                                                  "westBoundries" + key
                                                ].map((item, index) => (
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
                                                          provided
                                                            .draggableProps
                                                            .style
                                                        )}
                                                        onMouseOver={this.onmouseover.bind(
                                                          this,
                                                          item.data
                                                        )}
                                                        onMouseLeave={this.onmouseleave.bind(
                                                          this
                                                        )}
                                                      >
                                                        {convertToArabic(
                                                          item.content &&
                                                            (+item.content)?.toFixed(
                                                              2
                                                            )
                                                        )}
                                                      </div>
                                                    )}
                                                  </Draggable>
                                                ))}
                                              {provided.placeholder}
                                            </div>
                                          )}
                                        </Droppable>

                                        <p
                                          style={{
                                            float: "left",
                                            textAlign: "left",
                                            fontSize: "20px",
                                          }}
                                        >
                                          طول الحد :{" "}
                                          {convertToArabic(
                                            polygon.data[3].totalLength &&
                                              (+polygon.data[3]
                                                .totalLength).toFixed(2)
                                          )}
                                        </p>
                                      </div>
                                    </div>

                                    <div style={itemContainerSouth}>
                                      <p
                                        style={{
                                          textAlign: "center",
                                          fontSize: "18px",
                                        }}
                                      >
                                        الجنوب
                                      </p>

                                      {inputs?.south?.map((input, index) => {
                                        return (
                                          <input
                                            name={input.name}
                                            type={input.type || "text"}
                                            className="ant-input"
                                            placeholder={input.placeholder}
                                            required="required"
                                            value={this.state[input.name + key]}
                                            onChange={this.onInputTextChange.bind(
                                              this,
                                              polygon,
                                              key
                                            )}
                                          />
                                        );
                                      })}

                                      <Droppable droppableId="droppable_South">
                                        {(provided, snapshot) => (
                                          <div
                                            ref={provided.innerRef}
                                            style={getListStyle(
                                              snapshot.isDraggingOver
                                            )}
                                          >
                                            {this.state[
                                              "southBoundries" + key
                                            ] &&
                                              this.state[
                                                "southBoundries" + key
                                              ].map((item, index) => (
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
                                                        provided.draggableProps
                                                          .style
                                                      )}
                                                      onMouseOver={this.onmouseover.bind(
                                                        this,
                                                        item.data
                                                      )}
                                                      onMouseLeave={this.onmouseleave.bind(
                                                        this
                                                      )}
                                                    >
                                                      {convertToArabic(
                                                        item.content &&
                                                          (+item.content)?.toFixed(
                                                            2
                                                          )
                                                      )}
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                            {provided.placeholder}
                                          </div>
                                        )}
                                      </Droppable>
                                      <p
                                        style={{
                                          float: "left",
                                          textAlign: "left",
                                          fontSize: "20px",
                                        }}
                                      >
                                        طول الحد :{" "}
                                        {convertToArabic(
                                          polygon.data[4].totalLength &&
                                            (+polygon.data[4]
                                              .totalLength).toFixed(2)
                                        )}
                                      </p>
                                    </div>
                                  </DragDropContext>
                                )}
                              </div>
                            )}
                            {key == this.state["activeKey"] - 1 && (
                              <>
                                <Row gutter={[24, 16]}>
                                  <Col span={4}>
                                    <input
                                      name="parcelSliceNo"
                                      type="number"
                                      placeholder="رقم التقسيم"
                                      className="form-control"
                                      value={this.state[`parcelSliceNo${key}`]}
                                      disabled={requestType == 2}
                                      onChange={this.onParcelTextChange.bind(
                                        this,
                                        polygon,
                                        key
                                      )}
                                    />
                                  </Col>
                                  <Col span={1}>/</Col>
                                  <Col span={4}>
                                    {/* <input
                                      name="parcel_name"
                                      type="text"
                                      placeholder="رقم قطعة الأرض"
                                      className="form-control"
                                      required="required"
                                      value={this.state[`parcel_name${key}`]}
                                      onChange={this.onParcelTextChange.bind(
                                        this,
                                        polygon,
                                        key
                                      )}
                                    /> */}
                                    <Select
                                      getPopupContainer={(trigger) =>
                                        trigger.parentNode
                                      }
                                      // autoFocus
                                      name="parcel_name"
                                      onChange={(val) => {
                                        this.onParcelTextChange(polygon, key, {
                                          target: {
                                            value: val,
                                            name: "parcel_name",
                                          },
                                        });
                                      }}
                                      placeholder="رقم قطعة الارض"
                                      value={this.state[`parcel_name${key}`]}
                                    >
                                      {parcels.map((e, i) => {
                                        return (
                                          <Option
                                            key={e.attributes.PARCEL_SPATIAL_ID}
                                            value={e.attributes.PARCEL_PLAN_NO}
                                          >
                                            {localizeNumber(
                                              e.attributes.PARCEL_PLAN_NO
                                            )}
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  </Col>
                                </Row>
                                <Row gutter={[24, 16]}>
                                  <Col span={9}>
                                    <input
                                      name="area"
                                      type="text"
                                      className="form-control"
                                      placeholder="المساحة (م۲)"
                                      required="required"
                                      value={this.state[`area${key}`]}
                                      onChange={this.onInputTextChange.bind(
                                        this,
                                        polygon,
                                        key
                                      )}
                                    />
                                  </Col>
                                </Row>
                              </>
                            )}
                            {reqType == "duplex" &&
                              key == this.state["activeKey"] - 1 && (
                                <Row gutter={[24, 16]}>
                                  <Col span={4}>
                                    <input
                                      type="radio"
                                      name="duplixType"
                                      value="splited"
                                      checked={
                                        this.state[`duplixType${key}`] ===
                                        "splited"
                                      }
                                      onChange={this.duplixTypeChange.bind(
                                        this,
                                        "splited",
                                        polygon,
                                        key
                                      )}
                                    />{" "}
                                    فلل منفصلة
                                  </Col>
                                  <Col span={5}>
                                    <input
                                      type="radio"
                                      name="duplixType"
                                      value="marged"
                                      checked={
                                        this.state[`duplixType${key}`] ===
                                        "marged"
                                      }
                                      onChange={this.duplixTypeChange.bind(
                                        this,
                                        "marged",
                                        polygon,
                                        key
                                      )}
                                    />{" "}
                                    فلل متصلة
                                  </Col>
                                </Row>
                              )}
                          </TabPane>
                        );
                      })}
                    </Tabs>
                  )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("cadData")(cadSuggestedDataComponent));
