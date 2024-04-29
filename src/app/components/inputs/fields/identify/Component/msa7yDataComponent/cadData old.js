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
  resetMapData,
  redrawNames,
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
  localizeNumber,
  setParcelName,
  intersectQueryTask,
  resizeMap,
  getLineLength,
  computePointDirection,
  checkOverlappingFeaturesWithLayer,
  CheckShapeOverlapWithBoundry,
} from "../common/common_func";
import { layersSetting } from "../mapviewer/config/layers";
import { geometryServiceUrl, mapUrl } from "../mapviewer/config/map";
import { Row, Col, Select, Button, Form, message, Checkbox, Tabs } from "antd";
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
import { FINAL_SERVICE_REVIEW } from "../../../../../wizard/modulesObjects";
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

Array.prototype.sum = function (prop) {
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

class cadDataComponent extends Component {
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
    let mainObject =
      (
        this.props.mainObject?.update_contract_submission_data
          ?.update_contract_submission_data ||
        this.props.mainObject?.tadkek_data_msa7y?.tadkek_msa7yData
      )?.imported_mainObject || this.props?.mainObject;
    let cadDetails = mainObject?.data_msa7y?.msa7yData?.cadDetails;

    if (cadDetails) {
      const { input } = props;
      this.state = {
        viewNumbersOnly:
          ((
            this.props.mainObject?.update_contract_submission_data
              ?.update_contract_submission_data ||
            this.props.mainObject?.tadkek_data_msa7y?.tadkek_msa7yData
          )?.imported_mainObject &&
            true) ||
          false,
        zoomRatio:
          [2028, 2029, 2191].indexOf(
            this.props?.currentModule?.workflow_id ||
              this.props?.currentModule?.record?.workflow_id
          ) != -1 ||
          this.props?.currentModule?.app_id == 14 ||
          this.props?.currentModule?.record?.app_id == 14
            ? 50
            : 25,
        isConfirmed: true,
        outRange: null,
        hasNotify: false,
        pointsLength: [],
        annotationLength: 17,
        polygons:
          cadDetails?.suggestionsParcels && cadDetails?.suggestionsParcels[0]
            ? cadDetails?.suggestionsParcels
            : [],
        demSaveDraft: false,
        cadFiles: {},
        layerParcels: [],
        planDescription: cadDetails?.planDescription || "",
        activeKey: "1",
        isWithinUrbanBoundry: cadDetails?.isWithinUrbanBoundry || null,
        cadResults:
          (cadDetails?.temp && cadDetails?.temp?.cadResults) || undefined,
        isKrokyUpdateContract:
          (props?.currentModule?.app_id ||
            props?.currentModule?.record?.app_id) == 8 || false,

        isTadkekMesahy:
          [29, 1].indexOf(
            props?.currentModule?.app_id || props?.currentModule?.record?.app_id
          ) != -1,
        isUpdateContract:
          (props?.currentModule?.app_id ||
            props?.currentModule?.record?.app_id) == 14 || false,
        isPlan:
          (props?.currentModule?.app_id ||
            props?.currentModule?.record?.app_id) == 16 || false,

        notify: (cadDetails?.temp && cadDetails?.temp?.notify) || false,
        hideDrag: (cadDetails?.temp && cadDetails?.temp?.hideDrag) || false,
        lineLengthFont: 25,
        parcelNumberFont: 25,
        isBoundry: false,
        mun: cadDetails?.mun || {},
        muns: [],
        have_electric_room:
          (cadDetails?.temp && cadDetails?.temp?.have_electric_room) || false,
        electric_room_area:
          (cadDetails?.temp && cadDetails?.temp?.electric_room_area) || 0,
        electric_room_place:
          (cadDetails?.temp && cadDetails?.temp?.electric_room_place) || 0,
        reqType:
          ([1949, 2048].indexOf(this.props.currentModule.record.workflow_id) !=
            -1 &&
            "duplex") ||
          "",
      };

      if (
        cadDetails?.temp &&
        (cadDetails?.temp?.isKrokyUpdateContract || cadDetails?.temp?.isPlan)
      ) {
        this.state["survayParcelCutter"] = cadDetails?.survayParcelCutter || [
          {
            direction: "الشطفة",
            NORTH_EAST_DIRECTION: "",
            NORTH_WEST_DIRECTION: "",
            SOUTH_EAST_DIRECTION: "",
            SOUTH_WEST_DIRECTION: "",
          },
        ];
      }

      if (this.state.isTadkekMesahy) {
        if (this.state.polygons) {
          this.state.polygons.forEach((polygon, index) => {
            this.state[`parcel_name${index}`] = polygon.parcel_name;
          });
        }
      }

      if (this.state?.isUpdateContract && this.state.polygons.length > 0) {
        this.state.polygons.forEach((polygon, index) => {
          this.state[`have_electric_room${index}`] =
            polygon.have_electric_room || false;
          this.state[`electric_room_area${index}`] =
            polygon.electric_room_area || "";
          this.state[`electric_room_place${index}`] =
            polygon.electric_room_place;
        });
      }
    } else {
      this.state = {
        viewNumbersOnly:
          ((
            this.props.mainObject?.update_contract_submission_data
              ?.update_contract_submission_data ||
            this.props.mainObject?.tadkek_data_msa7y?.tadkek_msa7yData
          )?.imported_mainObject &&
            true) ||
          false,
        zoomRatio:
          [2028, 2029, 2191].indexOf(
            this.props?.currentModule?.workflow_id ||
              this.props?.currentModule?.record?.workflow_id
          ) != -1 ||
          this.props?.currentModule?.app_id == 14 ||
          this.props?.currentModule?.record?.app_id == 14
            ? 50
            : 25,
        isConfirmed: true,
        outRange: null,
        hasNotify: false,
        pointsLength: [],
        annotationLength: 17,
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
        isWithinUrbanBoundry: null,
        cadResults: undefined,
        isKrokyUpdateContract:
          (props?.currentModule?.app_id ||
            props?.currentModule?.record?.app_id) == 8 || false,

        isTadkekMesahy:
          [29, 1].indexOf(
            props?.currentModule?.app_id || props?.currentModule?.record?.app_id
          ) != -1,
        isUpdateContract:
          (props?.currentModule?.app_id ||
            props?.currentModule?.record?.app_id) == 14 || false,
        isPlan:
          (props?.currentModule?.app_id ||
            props?.currentModule?.record?.app_id) == 16 || false,
        notify: false,
        hideDrag: false,
        lineLengthFont: 25,
        parcelNumberFont: 25,
        isBoundry: false,
        mun: {},
        muns: [],
        have_electric_room: false,
        electric_room_area: 0,
        electric_room_place: 0,
        reqType:
          ([1949, 2048].indexOf(this.props.currentModule.record.workflow_id) !=
            -1 &&
            "duplex") ||
          "",
      };
    }

    fetchData(`${workFlowUrl}/api/Municipality`).then((response) => {
      this.state.muns = response.results;
    });

    if (cadDetails?.temp) {
      const {
        landData: {
          requestType,
          landData: {
            lands: { parcelData, parcels, survayParcelCutter },
          },
        },
        data_msa7y: {
          msa7yData: {
            cadDetails: { suggestionsParcels, temp },
          },
        },
      } = mainObject;

      const { inputs } = props;

      suggestionsParcels.forEach((element, index) => {
        if (this.state.isUpdateContract) {
          if (element.parcel_name != "حدود المعاملة") {
            let landDataParcel = parcels.find((r) =>
              new esri.geometry.Polygon(element.polygon).contains(
                new esri.geometry.Polygon(r.geometry).getExtent().getCenter()
              )
            );
            if (landDataParcel) {
              // element.data[0].data = [
              //   {
              //     ...element.data[0].data[0],
              //     text: +landDataParcel.parcelData.north_length,
              //   },
              // ];
              // element.data[0].totalLength =
              //   +landDataParcel.parcelData.north_length;
              // element.data[1].data = [
              //   {
              //     ...element.data[1].data[0],
              //     text: +landDataParcel.parcelData.east_length,
              //   },
              // ];
              // element.data[1].totalLength =
              //   +landDataParcel.parcelData.east_length;
              // element.data[3].data = [
              //   {
              //     ...element.data[3].data[0],
              //     text: +landDataParcel.parcelData.west_length,
              //   },
              // ];
              // element.data[3].totalLength =
              //   +landDataParcel.parcelData.west_length;
              // element.data[4].data = [
              //   {
              //     ...element.data[4].data[0],
              //     text: +landDataParcel.parcelData.south_length,
              //   },
              // ];
              // element.data[4].totalLength =
              //   +landDataParcel.parcelData.south_length;
              element.survayParcelCutter = [
                {
                  direction: "الشطفة",
                  NORTH_EAST_DIRECTION:
                    landDataParcel?.parcelShatfa?.SHATFA_NORTH_EAST_DIRECTION ||
                    "",
                  NORTH_WEST_DIRECTION:
                    landDataParcel?.parcelShatfa?.SHATFA_NORTH_WEST_DIRECTION ||
                    "",
                  SOUTH_EAST_DIRECTION:
                    landDataParcel?.parcelShatfa?.SHATFA_SOUTH_EAST_DIRECTION ||
                    "",
                  SOUTH_WEST_DIRECTION:
                    landDataParcel?.parcelShatfa?.SHATFA_SOUTH_WEST_DIRECTION ||
                    "",
                },
              ];

              this.state["electric_room_area" + index] =
                landDataParcel?.parcelElectric?.electric_room_area || "";
              this.state["electric_room_place" + index] =
                landDataParcel?.parcelElectric?.electric_room_place || "";
            }
          }
        }

        inputs.north.forEach((input, key) => {
          this.state[input.name + index] = temp[input.name + index] || "";
        });
        inputs.east.forEach((input, key) => {
          this.state[input.name + index] = temp[input.name + index] || "";
        });
        inputs.west.forEach((input, key) => {
          this.state[input.name + index] = temp[input.name + index] || "";
        });
        inputs.south.forEach((input, key) => {
          this.state[input.name + index] = temp[input.name + index] || "";
        });
        this.state["parcelSliceNo" + index] =
          requestType != 2 ? temp["parcelSliceNo" + index] || "" : "";
        this.state["parcel_name" + index] =
          element.parcel_name || temp["parcelName" + index] || "";
        this.state["area_text" + index] = temp["area_text" + index] || "";
      });

      this.recalculateBoundries(suggestionsParcels, (obj) => {
        Object.keys(obj).forEach((key) => {
          this.state[key] = obj[key];
        });
      });
    }

    this.isLoaded = true;
    this.toLoadLines = true;
    //this.setState({});
  }

  saveEdit(id, name, i, polygonKey) {
    if (this.state.isUpdateContract) {
      this.state.polygons[polygonKey]["survayParcelCutter"][0][name] =
        this["edit_" + name + i + `${!isNaN(polygonKey) ? polygonKey : ""}`];
      this.setState({
        [name +
        "_isEdit_" +
        i +
        `${!isNaN(polygonKey) ? polygonKey : ""}`]: false,
      });
    } else {
      this.state[
        `survayParcelCutter${!isNaN(polygonKey) ? polygonKey : ""}`
      ][0][name] =
        this["edit_" + name + i + `${!isNaN(polygonKey) ? polygonKey : ""}`];
      this.setState({
        [name +
        "_isEdit_" +
        i +
        `${!isNaN(polygonKey) ? polygonKey : ""}`]: false,
        [`survayParcelCutter${!isNaN(polygonKey) ? polygonKey : ""}`]:
          this.state[
            `survayParcelCutter${!isNaN(polygonKey) ? polygonKey : ""}`
          ],
      });
    }
    this.settoStore(this.state.polygons);
  }

  myChangeHandler = (name, i, e, polygonKey, event) => {
    this["edit_" + name + i + `${!isNaN(polygonKey) ? polygonKey : ""}`] =
      event.target.value;
    e[name] = event.target.value;
    this.setState({
      [name + "_isEdit_" + i + `${!isNaN(polygonKey) ? polygonKey : ""}`]: true,
    });
  };

  showEditBtn = (name, value) => {
    return (
      (!this.state.viewNumbersOnly &&
        [
          "NORTH_EAST_DIRECTION",
          "NORTH_WEST_DIRECTION",
          "SOUTH_EAST_DIRECTION",
          "SOUTH_WEST_DIRECTION",
        ].indexOf(name) > -1) ||
      false
    );
  };

  enableEdit = (name, i, polygonKey) => {
    this.setState({
      [name + "_isEdit_" + i + `${!isNaN(polygonKey) ? polygonKey : ""}`]: true,
    });
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
        state = { ["southBoundries" + (this.state.activeKey - 1)]: items };
      }
      if (source.droppableId === "droppable_North") {
        state = { ["northBoundries" + (this.state.activeKey - 1)]: items };
      }
      if (source.droppableId === "droppable_East") {
        state = { ["eastBoundries" + (this.state.activeKey - 1)]: items };
      }
      if (source.droppableId === "droppable_West") {
        state = { ["westBoundries" + (this.state.activeKey - 1)]: items };
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

      this.setState({
        ["northBoundries" + (this.state.activeKey - 1)]:
          result.droppable_North ||
          this.state["northBoundries" + (this.state.activeKey - 1)],
        ["southBoundries" + (this.state.activeKey - 1)]:
          result.droppable_South ||
          this.state["southBoundries" + (this.state.activeKey - 1)],
        ["eastBoundries" + (this.state.activeKey - 1)]:
          result.droppable_East ||
          this.state["eastBoundries" + (this.state.activeKey - 1)],
        ["westBoundries" + (this.state.activeKey - 1)]:
          result.droppable_West ||
          this.state["westBoundries" + (this.state.activeKey - 1)],
      });
    }
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
              // } else {
              //   var polyline = new esri.geometry.Polyline(line);
              //   addGraphicToLayer(
              //     polyline,
              //     this.map,
              //     "boundriesDirection",
              //     color,
              //     null,
              //     null,
              //     null,
              //     attr
              //   );
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

      polygon?.corners?.forEach((corner, key) => {
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

        if (!this.state.isUpdateContract && !this.state.isKrokyUpdateContract)
          addParcelNo(
            mp,
            this.map,
            "" + (key + 1) + "",
            "PacrelNoGraphicLayer",
            25,
            [255, 0, 0],
            null,
            iconTextPosition
          );
      });
    });

    this.state.polygons.forEach((polygon, key) => {
      if (polygon.polygon) {
        var polygonClass = new esri.geometry.Polygon(polygon.polygon);
        var graphic = new esri.Graphic(polygonClass, null, null, null);
        var pt = graphic.geometry.getExtent().getCenter();

        polygon.position = pt;
        polygon.northDescription = layerParcels[key]?.northDescription || "";
        polygon.westDescription = layerParcels[key]?.westDescription || "";
        polygon.southDescription = layerParcels[key]?.southDescription || "";
        polygon.eastDescription = layerParcels[key]?.eastDescription || "";
        if (!polygon.isFullBoundry && !this.state.isKrokyUpdateContract) {
          redrawNames(
            polygon,
            this.map,
            setParcelName([
              this.state["parcel_name" + key],
              this.state["parcelSliceNo" + key],
            ]),
            "PacrelNoGraphicLayer",
            key
          );
        }
      }
    });

    // DrawIntersectLines();
  };

  calculateLines = () => {
    this.state.polygons.forEach((polygon, key) => {
      polygon.data.forEach((lines) => {
        lines.totalLength = 0;
        lines.data.forEach((line) => {
          if (!line.hide) lines.totalLength += line.text;
        });
        lines.totalLength = lines.totalLength.toFixed(2);
      });
    });
    this.settoStore(this.state.polygons);
  };

  getSuggestLine = () => {
    this.state.polygons.forEach((polygon, index) => {
      if (polygon.area != -1) {
        this.state["area" + index] = (+polygon.area).toFixed(2);
        var lengthPoint1, lengthPoint2;
        var polyg = new esri.geometry.Polygon(polygon.polygon);
        var polygonCenterPoint = polyg.getExtent().getCenter();

        polygon.data[2].data.forEach((boundry, key) => {
          if (this.toLoadLines) {
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
            //   if (direction.direction == "west") {
            //     polygon.data[3].data.push(boundry);
            //   } else if (direction.direction == "north") {
            //     polygon.data[0].data.push(boundry);
            //   } else if (direction.direction == "south") {
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
          }
        });

        polygon.data[2].data = [];
      }
    });

    // const {
    //   mainObject: {
    //     waseka: {
    //       waseka: { sakType },
    //     },
    //   },
    // } = this.props;

    //if (!sakType || (sakType && sakType != "4")) {
    this.dropSuccess();
    //}

    this.recalculateBoundries(this.state.polygons, (obj) => {
      this.setState(obj);
    });
    this.calculateLines();
  };

  recalculateBoundries = (polygons, callback) => {
    if (polygons && polygons.length > 0) {
      var obj = { polygons: polygons };
      polygons.forEach((polygon, index) => {
        obj["westBoundries" + index] = polygon.data[3].data.map((item, i) => {
          return {
            id: `item-${"west_" + i}`,
            content: convertToArabic(item.text.toFixed(2)),
            data: item,
          };
        });
        obj["northBoundries" + index] = polygon.data[0].data.map((item, i) => {
          return {
            id: `item-${"north_" + i}`,
            content: convertToArabic(item.text.toFixed(2)),
            data: item,
          };
        });
        obj["eastBoundries" + index] = polygon.data[1].data.map((item, i) => {
          return {
            id: `item-${"east_" + i}`,
            content: convertToArabic(item.text.toFixed(2)),
            data: item,
          };
        });
        obj["southBoundries" + index] = polygon.data[4].data.map((item, i) => {
          return {
            id: `item-${"south_" + i}`,
            content: convertToArabic(item.text.toFixed(2)),
            data: item,
          };
        });
      });

      if (callback) {
        callback(obj);
      }
    }
  };

  buildCADDetails = (isLoading) => {
    // componentDidUpdate
    //return new Promise((resolve,reject) => {
    let mainObject =
      (
        this.props.mainObject?.update_contract_submission_data
          ?.update_contract_submission_data ||
        this.props.mainObject?.tadkek_data_msa7y?.tadkek_msa7yData
      )?.imported_mainObject || this.props?.mainObject;
    const { mapLayers, t } = this.props;
    const {
      outRange,
      pointsLength,
      annotationLength,
      polygons,
      lineLengthFont,
      parcelNumberFont,
      isBoundry,
      cadResults,
      isKrokyUpdateContract,
      isUpdateContract,
      isPlan,
      notify,
      hideDrag,
      muns,
    } = this.state;

    //if(this.state.polygons && this.state.polygons.length == 0 && cadResults.data.length > 0){

    //if (isPlan) {

    if (this.map && cadResults && cadResults.data) {
      getInfo().then((res) => {
        let LayerID = res;

        intersectQueryTask({
          outFields: ["*"],
          geometry:
            (cadResults?.data &&
              cadResults?.data[0]?.shapeFeatures &&
              cadResults?.data[0]?.shapeFeatures[0]) ||
            null,
          url: mapUrl + "/" + LayerID?.Municipality_Boundary,
          where: `MUNICIPALITY_NAME = ${
            mainObject?.landData?.landData?.municipality_id ||
            mainObject?.landData?.landData?.municipality?.code ||
            mainObject?.landData?.landData?.lands?.parcels?.[0]?.attributes
              ?.MUNICIPALITY_NAME_Code
          }`,
          preQuery: (query, Query) => {
            query.spatialRelationship = Query.SPATIAL_REL_WITHIN;
          },
          callbackResult: (res) => {
            this.state.mun = _.find(muns, function (d) {
              return (
                res?.features &&
                res?.features[0]?.attributes?.MUNICIPALITY_NAME == d?.code
              );
            });
            this.settoStore(this.state.polygons);
          },
          errorCallbackResult: (res) => {
            this.state.mun = null;
            this.settoStore(this.state.polygons);
          },
        });
      });
      let settings = {
        map: this.map,
        layers: mapLayers,
        tolerance: 1,
        polygonFeature: cadResults?.data[0]?.shapeFeatures[0],
        identifyResults: (results) => {
          results = _.groupBy(results, "layerName");
          var munLits = [];
          var urbanList = [];
          var submunList = [];

          if (
            (mainObject?.landData?.landData?.municipality_id ||
              mainObject?.landData?.landData?.municipality?.code ||
              mainObject?.landData?.landData?.lands?.parcels?.[0]?.attributes
                ?.MUNICIPALITY_NAME_Code) &&
            results &&
            results["Municipality_Boundary"]
          ) {
            var mun_class =
              mainObject?.landData?.landData?.municipality?.mun_classes
                ?.mun_class;

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

            this.setState({
              planDescription:
                "مرحلة التنمية العمرانية ك ( " +
                urbanList.join(" , ") +
                " ) بمدينة  ( " +
                munLits.join(" , ") +
                " ) المحددة ( " +
                submunList.join(" , ") +
                " )",
            });
            this.settoStore(this.state.polygons);
          }
        },
      };

      if (cadResults?.data[0]?.shapeFeatures[0]) {
        this.map.spatialReference = new esri.SpatialReference({
          wkid:
            cadResults?.data[0]?.shapeFeatures[0]?.spatialReference?.wkid ||
            32639,
        });
      }

      IdentifyTask(settings);

      clearGraphicFromLayer(this.map, "highlightBoundriesGraphicLayer");
      clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
      clearGraphicFromLayer(this.map, "addedParclGraphicLayer");
      clearGraphicFromLayer(this.map, "boundriesGraphicLayer");
      clearGraphicFromLayer(this.map, "boundriesDirection");
      clearGraphicFromLayer(this.map, "pictureGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelUnNamedGraphicLayer");
      clearGraphicFromLayer(this.map, "detailedGraphicLayer");

      var fullBoundryIndex = cadResults?.data[0]?.shapeFeatures?.findIndex(
        (feature) => feature.isFullBoundry
      );
      if (fullBoundryIndex > 0) {
        let tempShapeFeature = JSON.parse(
          JSON.stringify(cadResults?.data[0]?.shapeFeatures[fullBoundryIndex])
        );

        cadResults?.data[0]?.shapeFeatures?.splice(fullBoundryIndex, 1);
        cadResults.data[0]?.shapeFeatures?.unshift(tempShapeFeature);

        if (cadResults?.data[0]?.cadFeatures) {
          let tempCADFeature = JSON.parse(
            JSON.stringify(cadResults?.data[0]?.cadFeatures[fullBoundryIndex])
          );
          cadResults?.data[0]?.cadFeatures?.splice(fullBoundryIndex, 1);
          cadResults?.data[0]?.cadFeatures?.unshift(tempCADFeature);
        }
      }

      var cadResponse = cadResults?.data[0]?.shapeFeatures;
      var cadOutOfSakBoundriesResponse = cadResults?.data[0]?.outOfSakBoundries;
      var cadHiddenOfSakBoundriesResponse =
        cadResults?.data[0]?.hiddenOfSakBoundries;

      const { inputs } = this.props;
      //
      const {
        landData: { requestType },
      } = mainObject;

      if (
        cadResponse.length > 1 &&
        (!(
          isKrokyUpdateContract ||
          isUpdateContract ||
          this.props.currentModule.record.workflow_id == 2028
        ) ||
          (isUpdateContract && requestType == 2))
      ) {
        cadResults.data = null;
        window.notifySystem("error", t("NOTVALIDCAD"));
        return;
      }

      if (
        isKrokyUpdateContract ||
        isUpdateContract ||
        this.props.currentModule.record.workflow_id == 2028
      ) {
        this.state.isBoundry = _.find(
          cadResults?.data[0]?.shapeFeatures,
          (d) => {
            return d.isFullBoundry;
          }
        );

        if (
          !this.state.isBoundry &&
          cadResults?.data[0]?.shapeFeatures?.length > 1
        ) {
          window.notifySystem("error", t("BOUNDRYNOTFOUND"));
          return;
        }
      }

      //this.state.cadFiles: cadResults.data[0]});

      var cadResponsePoints = _.chain(cadResults?.data[0]?.shapeFeatures)
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

      var cadResponseOutOfSakBoundriesPoints = _.chain(
        cadResults?.data[0]?.outOfSakBoundries
      )
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

      var cadResponseCopy = JSON.stringify(cadResults?.data[0]?.shapeFeatures);
      var cadResponseOutOfSakBoundriesCopy = JSON.stringify(
        cadResults?.data[0]?.outOfSakBoundries
      );

      var cadArcResponseCopy = JSON.stringify(
        cadResults?.data[0]?.shapeFeatures
      );
      var unPolgyons = JSON.parse(cadArcResponseCopy);
      unPolgyons.forEach((polygon, key) => {
        polygon.rings[0] = _.filter(polygon.rings[0], (point) => {
          return isPointOrArc(
            { x: point[0], y: point[1] },
            key,
            cadResults?.data[0]?.cadFeatures
          );
        });
      });

      var unprojectArcPolygons = _.chain(cadResults?.data[0]?.shapeFeatures)
        .map((polygon, key) => {
          return polygon.rings[0].map((point) => {
            if (
              isPointOrArc(
                { x: point[0], y: point[1] },
                key,
                cadResults?.data[0]?.cadFeatures
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

      project(
        cadResponsePoints,
        32639,
        (points) => {
          if (points) {
            var plogs = _.chain(JSON.parse(cadResponseCopy))
              .map((d) => {
                d.rings[0] = ((Array.isArray(points[0]) && points[0]) || points)
                  ?.splice(0, d.rings[0].length)
                  ?.map((point) => {
                    return [point.x, point.y];
                  });
                //d.spatialReference = new esri.SpatialReference({ wkid: 102100 });
                return d;
              })
              .value();

            var index = -1;

            let featuresLengthTemp = JSON.parse(cadResponseCopy).length;

            getPolygons(
              JSON.parse(cadResponseCopy),
              (polygon_project, esriModules, elem, key) => {
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
                    //data.datasets = JSON.stringify(data.datasets, eliminateCircularRecursive);

                    res.features = JSON.parse(
                      JSON.stringify(res.features, eliminateCircularRecursive)
                    );
                    this.state.isWithinUrbanBoundry = res.features;
                  }
                  //stepItem.isWithinUrbanBoundry = false;
                  else {
                    this.state.isWithinUrbanBoundry = false;
                    this.resetStore();
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

                  checkOverlappingFeaturesWithLayer(
                    window.mapUrl +
                      "/" +
                      _.find(mapLayers, (layer) => {
                        return (
                          layer.name.toLowerCase() == "municipality_boundary"
                        );
                      })?.id,
                    polygon,
                    "MUNICIPALITY_NAME = " +
                      (mainObject?.landData?.landData?.municipality_id ||
                        mainObject?.landData?.landData?.municipality?.code ||
                        mainObject?.landData?.landData?.lands?.parcels?.[0]
                          ?.attributes?.MUNICIPALITY_NAME_Code),
                    this.map
                  ).then(
                    (res) => {
                      let municipality =
                        mainObject?.landData?.landData?.municipality_id ||
                        mainObject?.landData?.landData?.municipality?.code ||
                        mainObject?.landData?.landData?.lands?.parcels?.[0]
                          ?.attributes?.MUNICIPALITY_NAME_Code;

                      if (
                        res?.features[0]?.attributes?.MUNICIPALITY_NAME ==
                        municipality
                      ) {
                        checkOverlappingFeaturesWithLayer(
                          window.mapUrl +
                            "/" +
                            _.find(mapLayers, (layer) => {
                              return (
                                layer.name.toLowerCase() == "urbanareaboundary"
                              );
                            })?.id,
                          polygon,
                          undefined,
                          this.map
                        ).then(successWithinFun, (res) => {
                          this.state.isWithinUrbanBoundry = false;
                          this.resetMsa7yData();
                          //this.resetStore();
                          window.notifySystem(
                            "error",
                            t("messages:IS_NOT_WITHIN_URBAN_AREA_BOUNDRY"),
                            10
                          );
                        });
                      } else {
                        this.resetMsa7yData();
                        window.notifySystem(
                          "error",
                          t("خارج نطاق البلدية المختارة"),
                          10
                        );
                      }
                    },
                    (res) => {
                      //this.state.isWithinUrbanBoundry = false;
                      this.resetMsa7yData();
                      window.notifySystem(
                        "error",
                        t("خارج نطاق البلدية المختارة"),
                        10
                      );
                    }
                  );

                  // queryTask({
                  //   url:
                  //     window.mapUrl +
                  //     "/" +
                  //     _.find(mapLayers, (layer) => {
                  //       return layer.name.toLowerCase() == "urbanareaboundary";
                  //     })?.id,
                  //   where: "1=1",
                  //   outFields: ["OBJECTID", "REMARKS"],
                  //   callbackResult: successWithinFun,
                  //   callbackError: () => {
                  //     //    store.dispatch({type:'Show_Loading_new',loading: false});
                  //     this.state.isWithinUrbanBoundry = false;
                  //   },
                  //   preQuery: (query, Query) => {
                  //     if (polygon) {
                  //       query.geometry = dojo.clone(polygon);
                  //       query.spatialRelationship = Query.SPATIAL_REL_WITHIN;
                  //     }
                  //   },
                  // });
                }
                const { input } = this.props;
                const { isView } = this.props;

                const {
                  landData: {
                    landData: {
                      lands: { parcels },
                    },
                  },
                } = mainObject;

                if (this.InvokedToAdParcel) {
                  this.state.polygons.splice(
                    !polygon_project.isFullBoundry
                      ? this.state.polygons.length
                      : 0,
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

                let isFullBoundryIndex = JSON.parse(cadResponseCopy)?.findIndex(
                  (cadParcel) => cadParcel?.isFullBoundry
                );

                // key =
                // isFullBoundryIndex > -1 &&
                //   (isKrokyUpdateContract ||
                //     isUpdateContract ||
                //     this.props.currentModule.record.workflow_id == 2028)
                //     ? this.state.polygons.length - 1
                //     : 0;
                if (polygon_project.isFullBoundry) {
                  this.state.polygons[key].parcel_name = "حدود المعاملة";
                  this.state.polygons[key].isFullBoundry = true;
                  this.state.polygons[key].area =
                    (!isLoading &&
                      +cadResponse.sum("area").toFixed(2) -
                        (+cadOutOfSakBoundriesResponse
                          ?.sum("area")
                          ?.toFixed(2) || 0) -
                        (+cadHiddenOfSakBoundriesResponse
                          ?.sum("area")
                          ?.toFixed(2) || 0)) ||
                    mainObject?.data_msa7y?.msa7yData?.cadDetails?.temp[
                      "area" + key
                    ];
                } else {
                  this.state.polygons[key].area =
                    (!isLoading &&
                      ((isFullBoundryIndex == -1 &&
                        elem.area -
                          (+cadOutOfSakBoundriesResponse
                            ?.sum("area")
                            ?.toFixed(2) || 0) -
                          (+cadHiddenOfSakBoundriesResponse
                            ?.sum("area")
                            ?.toFixed(2) || 0)) ||
                        elem.area)) ||
                    mainObject?.data_msa7y?.msa7yData?.cadDetails?.[
                      "area" + key
                    ] ||
                    (this.state.polygons[key].area > 0 &&
                      this.state.polygons[key].area) ||
                    Math.abs(+elem.area.toFixed(2)) ||
                    "";

                  if (
                    this.state.isUpdateContract &&
                    !isEmpty(this.state.polygons[key].parcel_name)
                  ) {
                    this.state.polygons[key].parcel_name = isEmpty(
                      this.state[`parcelSliceNo${key}`]
                    )
                      ? this.state[`parcel_name${key}`]
                      : `${this.state[`parcelSliceNo${key}`]}/${
                          this.state[`parcel_name${key}`]
                        }`;

                    // if (this.state.polygons[key]?.position) {
                    //   redrawNames(
                    //     this.state.polygons[key],
                    //     this.map,
                    //     setParcelName([
                    //       this.state["parcel_name" + key],
                    //       this.state["parcelSliceNo" + key],
                    //     ]),
                    //     "PacrelNoGraphicLayer",
                    //     key
                    //   );
                    // }
                  } else if (
                    (this.state.isUpdateContract ||
                      this.state.isKrokyUpdateContract) &&
                    isEmpty(this.state.polygons[key].parcel_name)
                  ) {
                    this.state[`parcelSliceNo${key}`] = "";
                    this.state.polygons[key].parcel_name = this.state
                      .isKrokyUpdateContract
                      ? `أرض رقم ${key}`
                      : `أرض رقم ${key + 1}`;
                    this.state[`parcel_name${key}`] =
                      this.state.polygons[key].parcel_name;
                  } else if (
                    !this.state.isKrokyUpdateContract &&
                    !this.state.isUpdateContract
                  )
                    this.state.polygons[key].parcel_name =
                      parcels[isFullBoundryIndex > -1 ? key - 1 : key]
                        ?.attributes?.PARCEL_PLAN_NO || "";
                }

                this.state.polygons[key].polygon_unprojected = unPolgyons[key];
                this.state.polygons[key].polygon_unprojected.polylines = [];
                this.state.polygons[key].notify = polygon_project.notify;
                this.state.polygons[key].polygon = polygon;
                this.state.polygons[key].min;
                this.state.polygons[key].max = 0;
                this.state.polygons[key].maxPointLineLen;
                this.state.polygons[key].minPointLineLen;
                this.state.polygons[key].minLineLen;

                if (polygon.rings.length > 0) {
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

                    if (point1.x > this.state.polygons[key].max) {
                      this.state.polygons[key].max = point1.x;
                      this.state.polygons[key].maxPoint = point1;
                    }

                    if (
                      !this.state.polygons[key].min ||
                      point1.x < this.state.polygons[key].min
                    ) {
                      this.state.polygons[key].min = point1.x;
                      this.state.polygons[key].minPoint = point1;
                    }

                    if (point2.x > this.state.polygons[key].max) {
                      this.state.polygons[key].max = point2.x;
                      this.state.polygons[key].maxPoint = point2;
                    }

                    if (
                      !this.state.polygons[key].min ||
                      point2.x < this.state.polygons[key].min
                    ) {
                      this.state.polygons[key].min = point2.x;
                      this.state.polygons[key].minPoint = point2;
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
                          cadResults?.data[0]?.cadFeatures
                        ) &&
                        isPointOrArc(
                          point2,
                          key,
                          cadResults?.data[0]?.cadFeatures
                        )
                      )
                    ) {
                      if (
                        isPointOrArc(
                          point2,
                          key,
                          cadResults?.data[0]?.cadFeatures
                        )
                      ) {
                        arcLength += length;
                        arcPoints.push(point1);
                        path = new esriModules.Polyline(path);
                        path.centroid = path.getExtent().getCenter();
                        arcLines.push(new esriModules.Polyline(path));
                        path.text = arcLength || length;

                        if (
                          cadResults?.data[0]?.boundryFeaturesLen?.length > 0
                        ) {
                          var line = getLineLength(
                            cadResults?.data[0]?.boundryFeaturesLen,
                            arcPoints[0],
                            point2,
                            cadResults?.data[0]?.isArc || false
                          );
                          if (line) path.text = line.length;
                        }

                        length = path.text;
                        path.lines = arcLines;
                        arcLines = [];
                        arcLength = 0;

                        this.state.polygons[key].data[2].data.push(
                          JSON.parse(JSON.stringify(path))
                        );
                        this.state.polygons[key].data[2].data[
                          this.state.polygons[key].data[2].data.length - 1
                        ].centroid = path.getExtent().getCenter();
                      } else {
                        arcLength += length;
                        arcPoints.push(point1);
                        path = new esriModules.Polyline(path);
                        var polyline = new esriModules.Polyline(path);
                        path.centroid = polyline.getExtent().getCenter();
                        arcLines.push(new esriModules.Polyline(path));
                        path.hide = true;
                        // if (
                        //   this.state.isKrokyUpdateContract ||
                        //   this.state.isUpdateContract
                        // ) {
                        //   this.state.polygons[key].data[2].data.push(
                        //     JSON.parse(JSON.stringify(path))
                        //   );
                        //   this.state.polygons[key].data[2].data[
                        //     this.state.polygons[key].data[2].data.length - 1
                        //   ].centroid = path.getExtent().getCenter();
                        // } else {
                        //   path.hide = true;
                        // }
                      }
                    }
                    if (
                      isPointOrArc(
                        point1,
                        key,
                        cadResults?.data[0]?.cadFeatures
                      ) &&
                      isPointOrArc(
                        point2,
                        key,
                        cadResults?.data[0]?.cadFeatures
                      )
                    ) {
                      if (cadResults?.data[0]?.boundryFeaturesLen?.length > 0) {
                        var line = getLineLength(
                          cadResults?.data[0]?.boundryFeaturesLen,
                          point1,
                          point2,
                          cadResults?.data[0]?.isArc || false
                        );
                        if (line) path.text = line.length;

                        length = path.text;
                      }
                      this.state.polygons[key].data[2].data.push(
                        JSON.parse(JSON.stringify(path))
                      );
                      this.state.polygons[
                        key
                      ].polygon_unprojected.polylines.push(path);
                    }

                    var polyline = new esriModules.Polyline(path);

                    if (
                      !this.state.polygons[key].minLineLen ||
                      this.state.polygons[key].minLineLen > length
                    )
                      this.state.polygons[key].minLineLen = length;

                    var pt = polyline.getExtent().getCenter();

                    if (
                      !(
                        isPointOrArc(
                          point1,
                          key,
                          cadResults?.data[0]?.cadFeatures
                        ) &&
                        isPointOrArc(
                          point2,
                          key,
                          cadResults?.data[0]?.cadFeatures
                        )
                      )
                    ) {
                      if (
                        isPointOrArc(
                          point2,
                          key,
                          cadResults?.data[0]?.cadFeatures
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
                        cadResults?.data[0]?.cadFeatures
                      ) &&
                      isPointOrArc(
                        point2,
                        key,
                        cadResults?.data[0]?.cadFeatures
                      )
                    ) {
                      this.state.polygons[key].data[2].data[
                        this.state.polygons[key].data[2].data.length - 1
                      ].centroid = pt;
                    }

                    addGraphicToLayer(
                      polyline,
                      this.map,
                      "boundriesGraphicLayer",
                      null,
                      null,
                      null,
                      (response) => {
                        let app_id =
                          this.props?.currentModule?.app_id ||
                          this.props?.currentModule?.record?.app_id;
                        if (
                          [14, 8].indexOf(app_id) != -1 ||
                          [14, 8].indexOf(app_id) != -1
                        ) {
                          resizeMap(this.map, (app_id == 8 && 10) || undefined);
                        } else {
                          zoomToLayer(
                            "boundriesGraphicLayer",
                            this.map,
                            this.state["zoomRatio"]
                          );
                        }
                      }
                    );

                    if (pt.length) {
                      pt.x = pt[0];
                      pt.y = pt[1];
                    }

                    var ang;

                    if (!isBoundry) {
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
                        pointsLength.indexOf(
                          pt.x.toFixed(4) + "," + pt.y.toFixed(4)
                        ) > -1 && !polygon_project.isFullBoundry
                      )
                    ) {
                      if (
                        isPointOrArc(
                          point1,
                          key,
                          cadResults?.data[0]?.cadFeatures
                        ) &&
                        isPointOrArc(
                          point2,
                          key,
                          cadResults?.data[0]?.cadFeatures
                        )
                      ) {
                        pointsLength.push(
                          pt.x.toFixed(4) + "," + pt.y.toFixed(4)
                        );

                        addParcelNo(
                          pt,
                          this.map,
                          "" + parseFloat(length.toFixed(2)) + "",
                          "editlengthGraphicLayer",
                          lineLengthFont,
                          null,
                          ang,
                          polygon_project.isFullBoundry
                            ? getLengthOffset(pt, this.state.polygons[key])
                            : null,
                          attr
                        );
                      } else if (
                        isPointOrArc(
                          point2,
                          key,
                          cadResults?.data[0]?.cadFeatures
                        )
                      ) {
                        //
                        if (arcPoints.length) {
                          pt = arcPoints[Math.floor(arcPoints.length / 2)];
                          //pt.spatialReference.wkid = 102100;
                        }

                        addParcelNo(
                          pt,
                          this.map,
                          "" + parseFloat(length.toFixed(2)) + "",
                          "editlengthGraphicLayer",
                          lineLengthFont,
                          null,
                          ang,
                          polygon_project.isFullBoundry
                            ? getLengthOffset(pt, this.state.polygons[key])
                            : null,
                          attr
                        );
                      }
                    }

                    if (
                      isPointOrArc(
                        point2,
                        key,
                        cadResults?.data[0]?.cadFeatures
                      )
                    ) {
                      points = [];
                      arcPoints.forEach((point) => {
                        points.push(
                          esri.geometry.toScreenPoint(
                            this.map.extent,
                            this.map.width,
                            this.map.height,
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

                  if (outRange) {
                    this.state.outRange = true;
                  }

                  if (notify) {
                    //
                    // isConfirmed = false;
                    // hasNotify = true;
                    this.state.isConfirmed = false;
                    this.state.hasNotify = true;
                    addGraphicToLayer(
                      polygon,
                      this.map,
                      "addedParclGraphicLayer",
                      null,
                      null
                    );
                  } else {
                    addGraphicToLayer(
                      polygon,
                      this.map,
                      "addedParclGraphicLayer",
                      null,
                      null,
                      true
                    );
                  }
                }

                if (
                  this.state.isTadkekMesahy &&
                  !this.state.polygons[key].isFullBoundry
                ) {
                  this.state.polygons[key].position =
                    this.state.polygons[key].polygon.getCentroid();
                  redrawNames(
                    this.state.polygons[key],
                    this.map,
                    setParcelName([
                      this.state["parcel_name" + key],
                      this.state["parcelSliceNo" + key],
                    ]),
                    "PacrelUnNamedGraphicLayer",
                    key
                  );
                }

                if (
                  this.state.isTadkekMesahy &&
                  featuresLengthTemp == 2 &&
                  key == 1
                ) {
                  this.state.polygons = [{ ...this.state.polygons[1] }];
                }
              }
            );
            var cadifArcResponsePoints = _.chain(
              cadResults?.data[0]?.shapeFeatures
            )
              .map((polygon, key) => {
                return polygon.rings[0].map((point) => {
                  if (
                    isPointOrArc(
                      { x: point[0], y: point[1] },
                      key,
                      cadResults?.data[0]?.cadFeatures
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

            cadifArcResponsePoints = cadifArcResponsePoints.filter((n) => {
              return n != null;
            });

            project(cadifArcResponsePoints, 4326, (points) => {
              if (points) {
                var polygons_unprojected = _.chain(unPolgyons)
                  .map((d) => {
                    d.rings[0] = points?.splice(0, d.rings[0].length);
                    d.spatialReference = new esri.SpatialReference({
                      wkid: 4326,
                    });
                    return d;
                  })
                  .value();

                getPolygons(
                  polygons_unprojected,
                  (polygon_WGS84, esriModules, elem, key) => {
                    if (this.state.polygons[key]) {
                      this.state.polygons[
                        key
                      ]?.polygon_unprojected?.rings?.forEach((rings, index) => {
                        this.state.polygons[key].polygon_unprojected.rings[
                          index
                        ] = polygon_WGS84.rings[index];
                      });
                    }
                  }
                );
              }
              project(cadResponseOutOfSakBoundriesPoints, 32639, (points) => {
                if (points) {
                  var plogs = _.chain(
                    JSON.parse(cadResponseOutOfSakBoundriesCopy)
                  )
                    .map((d) => {
                      d.rings[0] = (
                        (Array.isArray(points[0]) && points[0]) ||
                        points
                      )
                        ?.splice(0, d.rings[0].length)
                        ?.map((point) => {
                          return [point.x, point.y];
                        });
                      //d.spatialReference = new esri.SpatialReference({ wkid: 102100 });
                      return d;
                    })
                    .value();

                  getPolygons(
                    JSON.parse(cadResponseOutOfSakBoundriesCopy),
                    (polygon_project, esriModules, elem, key) => {
                      var polygon = new esri.geometry.Polygon(plogs[key]);
                      addGraphicToLayer(
                        polygon,
                        this.map,
                        "addedParclGraphicLayer",
                        null,
                        null
                      );
                    }
                  );
                }
              });

              if (this.InvokedToAdParcel) {
                this.getSuggestLine();
              }
            });

            //this.state.this.state.polygons : _.sortBy(this.state.polygons, (d) => { return d.polygon && !d.polygon.isFullBoundry }) });
          }
        },
        true
      );

      var details = [];
      //draw details
      cadResults?.data[0]?.details?.forEach((appart, appartNumber) => {
        var polyline = new esri.geometry.Polyline(appart);
        details.push(polyline);
      });

      var detailsCopy = JSON.parse(JSON.stringify(details));

      if (details && details.length > 0 && this.InvokedToAdParcel) {
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
                    this.map,
                    "detailedGraphicLayer",
                    getColorFromCadIndex(detailsCopy[index].color),
                    null,
                    null,
                    (response) => {
                      let app_id =
                        this.props?.currentModule?.app_id ||
                        this.props?.currentModule?.record?.app_id;
                      if (
                        [14, 8].indexOf(app_id) != -1 ||
                        [14, 8].indexOf(app_id) != -1
                      ) {
                        resizeMap(this.map, (app_id == 8 && 10) || undefined);
                      } else {
                        zoomToLayer(
                          "detailedGraphicLayer",
                          this.map,
                          this.state["zoomRatio"]
                        );
                      }
                    }
                  );
                }
              });

              // if (details) {
              //     zoomToLayer("detailedGraphicLayer", this.map, this.state["zoomRatio"]);
              // }
              // else
              //     zoomToLayer("boundriesGraphicLayer", this.map, this.state["zoomRatio"]);
            }
          },
          true
        );
      }

      var annotations = [];

      cadResults?.data[0]?.annotations?.forEach((annotation) => {
        var point = new esri.geometry.Point(annotation.shape);
        point.text = annotation.text;
        point.angle = annotation.angle;
        annotations.push(point);
      });

      var annotationsCopy = JSON.parse(JSON.stringify(annotations));

      if (annotations && annotations.length > 0 && this.InvokedToAdParcel) {
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
                //annotation.spatialReference = new esri.SpatialReference({ wkid: 102100 });

                var text = annotationsCopy[index].text;

                if (annotationsCopy[index].text.indexOf("شارع") > -1) {
                  var extractNmber =
                    annotationsCopy[index].text.match(/[\d\.]+/);

                  if (extractNmber && extractNmber.length > 0) {
                    extractNmber = extractNmber[0];
                    annotationsCopy[index].text = annotationsCopy[
                      index
                    ].text.replace(
                      extractNmber,
                      extractNmber.split("").join("")
                    );
                  }
                  text = annotationsCopy[index].text;
                }
                if (HasArabicCharacters(annotationsCopy[index].text))
                  text = reverse(annotationsCopy[index].text);

                if (annotationsCopy[index].text.indexOf("شارع") > -1) {
                  addParcelNo(
                    annotation,
                    this.map,
                    text,
                    "detailedGraphicLayer",
                    annotationLength,
                    getColorFromCadIndex(annotationsCopy[index].color),
                    360 - (annotationsCopy[index].angle || 0),
                    null,
                    null,
                    true
                  );
                } else {
                  addParcelNo(
                    annotation,
                    this.map,
                    text,
                    "detailedGraphicLayer",
                    annotationLength,
                    getColorFromCadIndex(annotationsCopy[index].color),
                    360 - (annotationsCopy[index].angle || 0),
                    null,
                    null
                  );
                }
              });
            }
          },
          true
        );
      }

      //cadResults.data = this.state.polygons;

      //this.state.demSaveDraft = false;
      this.state.demSaveDraft = false;

      if (!this.state.hasNotify && isLoading) {
        clearGraphicFromLayer(this.map, "addedParclGraphicLayer");
        if (!hideDrag) {
          this.getSuggestLine();
        } else {
          //this.state.isConfirmed = false;
          this.state.isConfirmed = false;
        }
        this.state.polygons.forEach((elem, key) => {
          addGraphicToLayer(
            elem.polygon,
            this.map,
            "addedParclGraphicLayer",
            null,
            null,
            true
          );
        });

        zoomToIdentifyParcel(this.map);
      }
    } //else {
    //   window.notifySystem('warning', t('خارج نطاق البلدية الرئيسية'))
    //   return;
    // }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !isEqual(nextProps.input?.value, this.props.input?.value) ||
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
    console.log("pooooollllllyyyyygggggooooonnnnnnss", polygons);
    var obj = {};
    polygons.forEach((element, key) => {
      obj["westBoundries" + key] = this.state["westBoundries" + key];
      obj["southBoundries" + key] = this.state["southBoundries" + key];
      obj["northBoundries" + key] = this.state["northBoundries" + key];
      obj["eastBoundries" + key] = this.state["eastBoundries" + key];
      inputs.north.forEach((input, index) => {
        obj[input.name + key] = this.state[input.name + key];
      });
      inputs.east.forEach((input, index) => {
        obj[input.name + key] = this.state[input.name + key];
      });
      inputs.west.forEach((input, index) => {
        obj[input.name + key] = this.state[input.name + key];
      });
      inputs.south.forEach((input, index) => {
        obj[input.name + key] = this.state[input.name + key];
      });

      obj["area" + key] = this.state["area" + key];
      obj["parcelSliceNo" + key] = this.state["parcelSliceNo" + key];
      obj["area_text" + key] = this.state["area_text" + key];
      obj["parcelName" + key] = this.state["parcel_name" + key];
      obj["duplixType" + key] = this.state["duplixType" + key] || 1;

      if (this.state.isUpdateContract) {
        if (!element.survayParcelCutter) {
          element.survayParcelCutter = [
            {
              direction: "الشطفة",
              NORTH_EAST_DIRECTION: "",
              NORTH_WEST_DIRECTION: "",
              SOUTH_EAST_DIRECTION: "",
              SOUTH_WEST_DIRECTION: "",
            },
          ];
        }
        element.have_electric_room =
          this.state[`have_electric_room${key}`] || false;
        element.electric_room_area =
          this.state[`electric_room_area${key}`] || "";
        element.electric_room_place =
          this.state[`electric_room_place${key}`] || "";
      }
    });

    if (this.state.isKrokyUpdateContract || this.state.isPlan) {
      obj["have_electric_room"] = this.state["have_electric_room"];
      obj["electric_room_area"] = this.state["electric_room_area"];
    }

    var inputChanged = {
      suggestionsParcels: polygons,
      planDescription: this.state.planDescription,
      isWithinUrbanBoundry: this.state.isWithinUrbanBoundry,
      mun: mun,
      temp: {
        cadResults:
          input?.value?.cadData ||
          (input?.value?.temp && input?.value?.temp?.cadResults) ||
          this.state.cadResults ||
          undefined,
        isKrokyUpdateContract:
          input?.value?.isKrokyUpdateContract ||
          (input?.value?.temp && input?.value?.temp?.isKrokyUpdateContract) ||
          this.state.isKrokyUpdateContract ||
          false,
        isUpdateContract: this.state.isUpdateContract || false,
        isPlan:
          input?.value?.isPlan ||
          (input?.value?.temp && input?.value?.temp?.isPlan) ||
          this.state.isPlan ||
          false,
        notify:
          input?.value?.notify ||
          (input?.value?.temp && input?.value?.temp?.notify) ||
          this.state.notify ||
          false,
        hideDrag:
          input?.value?.hideDrag ||
          (input?.value?.temp && input?.value?.temp?.hideDrag) ||
          this.state.hideDrag ||
          false,
        ...obj,
      },
    };

    if (this.state.isKrokyUpdateContract || this.state.isPlan) {
      inputChanged["survayParcelCutter"] = this.state.survayParcelCutter;
    }
    input.onChange({ ...inputChanged });

    this.setState({
      polygons: polygons,
      ...obj,
    });
  }

  resetStore() {
    const { mun } = this.state;
    const { input, inputs } = this.props;

    var obj = {};
    this.state.polygons.forEach((element, key) => {
      obj["westBoundries" + key] = "";
      obj["southBoundries" + key] = "";
      obj["northBoundries" + key] = "";
      obj["eastBoundries" + key] = "";
      inputs.north.forEach((input, index) => {
        obj[input.name + key] = "";
      });
      inputs.east.forEach((input, index) => {
        obj[input.name + key] = "";
      });
      inputs.west.forEach((input, index) => {
        obj[input.name + key] = "";
      });
      inputs.south.forEach((input, index) => {
        obj[input.name + key] = "";
      });
      obj["area" + key] = "";
      obj["parcelSliceNo" + key] = "";
      obj["area_text" + key] = "";
      obj["parcelName" + key] = "";
      obj["duplixType" + key] = "";
    });

    if (this.state.isKrokyUpdateContract || this.state.isPlan) {
      obj["have_electric_room"] = false;
      obj["electric_room_area"] = "";
    }
    var polygons = [];
    this.setState({ polygons: polygons, ...obj });

    var inputChanged = {
      suggestionsParcels: polygons,
      planDescription: "",
      isWithinUrbanBoundry: false,
      mun: mun,
      temp: {
        //map: this.map,
        cadResults: undefined,
        isKrokyUpdateContract: this.state.isKrokyUpdateContract || false,
        isUpdateContract: this.state.isUpdateContract || false,
        isPlan: this.state.isPlan || false,
        notify: false,
        hideDrag: false,
        ...obj,
      },
    };

    if (this.state.isKrokyUpdateContract || this.state.isPlan) {
      inputChanged["survayParcelCutter"] = [
        {
          direction: "الشطفة",
          NORTH_EAST_DIRECTION: "",
          NORTH_WEST_DIRECTION: "",
          SOUTH_EAST_DIRECTION: "",
          SOUTH_WEST_DIRECTION: "",
        },
      ];
    } else if (this.state.isUpdateContract) {
      inputChanged["suggestionsParcels"].forEach((parcel, index) => {
        parcel.survayParcelCutter = [
          {
            direction: "الشطفة",
            NORTH_EAST_DIRECTION: "",
            NORTH_WEST_DIRECTION: "",
            SOUTH_EAST_DIRECTION: "",
            SOUTH_WEST_DIRECTION: "",
          },
        ];
        polygon.have_electric_room = false;
        polygon.electric_room_area = "";
        polygon.electric_room_place = "";
      });
    }

    this.props.input.onChange({ ...inputChanged });
  }

  clearInputs = () => {
    const { inputs } = this.props;
    this.state.polygons.forEach((polygon, index) => {
      this.state["westBoundries" + index] = [];
      this.state["northBoundries" + index] = [];
      this.state["eastBoundries" + index] = [];
      this.state["southBoundries" + index] = [];
      inputs.north.forEach((input, key) => {
        this.state[input.name + index] = "";
      });
      inputs.east.forEach((input, key) => {
        this.state[input.name + index] = "";
      });
      inputs.west.forEach((input, key) => {
        this.state[input.name + index] = "";
      });
      inputs.south.forEach((input, key) => {
        this.state[input.name + index] = "";
      });
      this.state["area" + index] = "";
      this.state["area_text" + index] = "";
      this.state["parcelSliceNo" + index] = "";
      this.state["parcel_name" + index] = "";
      this.state["duplixType" + index] = "";
      if (this.state.isUpdateContract) {
        polygon.survayParcelCutter = [
          {
            direction: "الشطفة",
            NORTH_EAST_DIRECTION: "",
            NORTH_WEST_DIRECTION: "",
            SOUTH_EAST_DIRECTION: "",
            SOUTH_WEST_DIRECTION: "",
          },
        ];
        this.state[`have_electric_room${index}`] = false;
        this.state[`electric_room_area${index}`] = "";
        this.state[`electric_room_place${index}`] = "";
      }
    });

    this.state["have_electric_room"] = false;
    this.state["electric_room_area"] = "";
    //this.state["electric_room_place"] = "";

    this.state.polygons = [];
    this.state.pointsLength = [];
    this.state.cadFiles = {};
    this.state.layerParcels = [];
    this.state.planDescription = "";
    this.state.activeKey = "1";
    this.state.isWithinUrbanBoundry = true;
  };

  resetMsa7yData = () => {
    resetMapData(this.map);
    this.resetStore();
  };

  checkOverlayFeatures = (boundry, parcels) => {
    let found = false;
    parcels.forEach((parcel) => {
      if (CheckShapeOverlapWithBoundry(boundry[0], parcel.geometry)) {
        found = true;
      }
    });

    return found;
  };

  componentDidUpdate() {
    const { input } = this.props;

    let mainObject =
      (
        this.props.mainObject?.update_contract_submission_data
          ?.update_contract_submission_data ||
        this.props.mainObject?.tadkek_data_msa7y?.tadkek_msa7yData
      )?.imported_mainObject || this.props?.mainObject;

    if (input?.value && input?.value != "" && input?.value?.justInvoked) {
      this.InvokedToAdParcel = true;
      input.value.justInvoked = false;
      this.isLoaded = false;
      this.map = getMap();

      this.toLoadLines = true;
      this.state.cadResults = input?.value?.cadData || undefined;
      // this.state.isTadkekMesahy = this.props.currentModule.app_id == 29;
      // this.state.isKrokyUpdateContract =
      //   input?.value?.isKrokyUpdateContract || false;
      // this.state.isUpdateContract = input?.value?.isUpdateContract || false;
      // this.state.isPlan = input?.value?.isPlan || false;
      this.state.notify = input?.value?.notify || false;
      this.state.hideDrag = input?.value?.hideDrag || false;
      this.clearInputs();
      if (this.state.isKrokyUpdateContract || this.state.isPlan) {
        this.state.survayParcelCutter = [
          {
            direction: "الشطفة",
            NORTH_EAST_DIRECTION: "",
            NORTH_WEST_DIRECTION: "",
            SOUTH_EAST_DIRECTION: "",
            SOUTH_WEST_DIRECTION: "",
          },
        ];
      }
      if (this.state.cadResults)
        setTimeout(() => {
          if (this.state.isTadkekMesahy) {
            if (
              this.state.cadResults?.data[0]?.shapeFeatures?.filter(
                (x) => !x.isFullBoundry
              )?.length != mainObject.landData.landData.lands.parcels.length
            ) {
              window.notifySystem(
                "error",
                "عدد الأراضي المرفوعة لا يتوافق مع عدد الأراضي المختارة"
              );
            } else {
              if (
                !this.checkOverlayFeatures(
                  this.state.cadResults?.data[0]?.shapeFeatures?.filter(
                    (x) => !x.isFullBoundry
                  ),
                  mainObject.landData.landData.lands.parcels
                )
              ) {
                window.notifySystem(
                  "error",
                  "الرفع المساحي لا يتقاطع مع حدود الأراضي المختارة"
                );
              } else {
                this.buildCADDetails(false);
              }
            }
          } else {
            this.buildCADDetails(false);
          }
        });
      else {
        this.resetMsa7yData();

        if (
          (this.props?.currentModule?.record.app_id == 14 ||
            this.props?.currentModule?.app_id == 14) &&
          this.props.mainObject?.waseka?.waseka?.sakType == "4"
        ) {
          this.loadParcelsFromLandData();
          this.settoStore(this.state.polygons);
        }
      }
    } else if (
      this.isLoaded &&
      window.mapInfo &&
      !mainObject?.data_msa7y?.msa7yData?.mapviewer?.mapGraphics?.length
    ) {
      this.map = getMap();
      if (getIsMapLoaded()) {
        setIsMapLoaded(false);
        this.toLoadLines = true;

        this.InvokedToAdParcel =
          !mainObject.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.filter(
            (r) =>
              !r.isFullBoundry &&
              r.data.filter((e) => +e.totalLength == 0).length > 0
          )?.length
            ? false
            : true;
        if (this.InvokedToAdParcel) {
          this.state.polygons = [];
        }
        if (
          (this.props?.currentModule?.record.app_id == 14 ||
            this.props?.currentModule?.app_id == 14) &&
          this.props.mainObject?.waseka?.waseka?.sakType == "4" &&
          mainObject?.landData?.landData?.lands?.parcels.length == 1
        ) {
          this.loadParcelsFromLandData();
        } else {
          setTimeout(() => {
            this.buildCADDetails(true);
          });
        }
        this.isLoaded = false;
      }
    } else if (
      this.isLoaded &&
      window.mapInfo &&
      mainObject?.data_msa7y?.msa7yData?.mapviewer?.mapGraphics?.length
    ) {
      this.map = getMap();
      if (getIsMapLoaded()) {
        setIsMapLoaded(false);
        // this.toLoadLines = false;
        // this.InvokedToAdParcel = false;
        if (
          (this.props?.currentModule?.record.app_id == 14 ||
            this.props?.currentModule?.app_id == 14) &&
          this.props.mainObject?.waseka?.waseka?.sakType == "4" &&
          mainObject?.landData?.landData?.lands?.parcels.length == 1
        ) {
          this.loadParcelsFromLandData();
        }
        this.isLoaded = false;
      }
    }
    return false;
  }

  loadParcelsFromLandData = () => {
    let mainObject =
      (
        this.props.mainObject?.update_contract_submission_data
          ?.update_contract_submission_data ||
        this.props.mainObject?.tadkek_data_msa7y?.tadkek_msa7yData
      )?.imported_mainObject || this.props?.mainObject;
    if (!this.state.polygons.length && !this.state?.cadResults) {
      //this.state.isUpdateContract = true;
      this.state.cadResults = {
        data: [
          {
            shapeFeatures: mainObject?.landData?.landData?.lands?.parcels.map(
              (polygon, index) => {
                return { ...polygon, index };
              }
            ),
          },
        ],
      };
      this.state.cadResults.data[0].shapeFeatures.forEach((elem) => {
        this.state[`parcel_name${elem.index}`] =
          elem?.attributes?.PARCEL_PLAN_NO;

        this.state.polygons.splice(this.state.polygons.length, 0, {
          polygon: elem,
          parcel_name: elem?.attributes?.PARCEL_PLAN_NO,
          area: elem?.attributes?.PARCEL_AREA,
          data: [
            {
              name: "north",
              data: [
                {
                  lineDirection: 1,
                  text:
                    +elem?.parcelData?.north_length?.inputValue ||
                    +elem?.parcelData?.north_length,
                },
              ],
              totalLength:
                elem?.parcelData?.north_length?.inputValue?.toString() ||
                +elem?.parcelData?.north_length,
            },
            {
              name: "east",
              data: [
                {
                  lineDirection: 2,
                  text:
                    +elem?.parcelData?.east_length?.inputValue ||
                    +elem?.parcelData?.east_length,
                },
              ],
              totalLength:
                elem?.parcelData?.east_length?.inputValue?.toString() ||
                +elem?.parcelData?.east_length,
            },
            { name: "main", data: [], totalLength: "0.00" },
            {
              name: "west",
              data: [
                {
                  lineDirection: 4,
                  text:
                    +elem?.parcelData?.west_length?.inputValue ||
                    +elem?.parcelData?.west_length,
                },
              ],
              totalLength:
                elem?.parcelData?.west_length?.inputValue?.toString() ||
                elem?.parcelData?.west_length,
            },
            {
              name: "south",
              data: [
                {
                  lineDirection: 3,
                  text:
                    +elem?.parcelData?.south_length?.inputValue ||
                    +elem?.parcelData?.south_length,
                },
              ],
              totalLength:
                elem?.parcelData?.south_length?.inputValue?.toString() ||
                +elem?.parcelData?.south_length,
            },
          ],
          north_Desc: elem?.parcelData.north_desc.toString(),
          north_length_text: "",
          east_Desc: elem?.parcelData.east_desc.toString(),
          east_length_text: "",
          west_Desc: elem?.parcelData.west_desc.toString(),
          west_length_text: "",
          south_Desc: elem?.parcelData.south_desc.toString(),
          south_length_text: "",
          electric_room_area: "",
          electric_room_place: "",
          have_electric_room: false,
          survayParcelCutter: [
            {
              direction: "الشطفة",
              NORTH_EAST_DIRECTION: "",
              NORTH_WEST_DIRECTION: "",
              SOUTH_EAST_DIRECTION: "",
              SOUTH_WEST_DIRECTION: "",
            },
          ],
        });
      });
    } else if (
      this.state?.cadResults?.data[0]?.cadFeatures?.length &&
      this.state?.polygons?.length &&
      !mainObject?.data_msa7y?.msa7yData?.mapviewer?.mapGraphics?.length
    ) {
      this.buildCADDetails(true);
    }
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
        polygon.errorMsgForDuplixType = "DUPLIXSPLITEDERRORMESSAGE";
      } else {
        polygon.cantSplitedOrMarged = false;
        polygon.errorInDuplixType = false;
        polygon.errorMsgForDuplixType = "";
      }
    } else if (selectedType == "marged") {
      if (minLength < 9.5) {
        polygon.cantSplitedOrMarged = true;
        polygon.errorInDuplixType = true;
        polygon.errorMsgForDuplixType = "DUPLIXMARGEDERRORMESSAGE";
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
      window.notifySystem("error", `messages:${polygon.errorMsgForDuplixType}`);

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

  // onParcelTextChange = (polygon, key, evt) => {
  //   this.state[evt.target.name + key] = evt.target.value;
  //   polygon.parcel_name = isEmpty(this.state[`parcelSliceNo${key}`])
  //     ? this.state[`parcel_name${key}`]
  //     : `${this.state[`parcelSliceNo${key}`]}/${
  //         this.state[`parcel_name${key}`]
  //       }`;
  //   this.state.polygons[key] = polygon;
  //   this.settoStore(this.state.polygons);
  // };

  onParcelTextChange = (polygon, key, evt) => {
    this.state[evt.target.name + key] = evt.target.value;

    polygon.parcel_name = setParcelName([
      this.state[`parcel_name${key}`],
      this.state["parcelSliceNo" + key],
    ]);

    polygon.parcelNameRight = this.state[`parcel_name${key}`];
    polygon.parcelNameLeft = this.state["parcelSliceNo" + key];

    this.state.polygons[key] = polygon;

    if (this.state.isTadkekMesahy) {
      clearGraphicFromLayer(this.map, "PacrelUnNamedGraphicLayer");

      this.state.polygons
        .filter((x) => !x.isFullBoundry)
        .forEach((polygon, key) => {
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
        });
    } else {
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
    }

    this.settoStore(this.state.polygons);
  };

  onChange = (activeKey) => {
    if (this.state.polygons[+activeKey - 1].data) {
      this.setState({
        activeKey,
        ["westBoundries" + (+activeKey - 1)]: this.state.polygons[
          +activeKey - 1
        ].data[3].data.map((item, i) => {
          return {
            id: `item-${"west_" + i}`,
            content: convertToArabic(item.text.toFixed(2)),
            data: item,
          };
        }),
        ["northBoundries" + (+activeKey - 1)]: this.state.polygons[
          +activeKey - 1
        ].data[0].data.map((item, i) => {
          return {
            id: `item-${"north_" + i}`,
            content: convertToArabic(item.text.toFixed(2)),

            data: item,
          };
        }),
        ["eastBoundries" + (+activeKey - 1)]: this.state.polygons[
          +activeKey - 1
        ].data[1].data.map((item, i) => {
          return {
            id: `item-${"east_" + i}`,
            content: convertToArabic(item.text.toFixed(2)),

            data: item,
          };
        }),
        ["southBoundries" + (+activeKey - 1)]: this.state.polygons[
          +activeKey - 1
        ].data[4].data.map((item, i) => {
          return {
            id: `item-${"south_" + i}`,
            content: convertToArabic(item.text.toFixed(2)),
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
    const {
      planDescription,
      survayParcelCutter,
      isKrokyUpdateContract,
      isPlan,
      isUpdateContract,
      reqType,
      viewNumbersOnly,
    } = this.state;

    let mainObject =
      (
        this.props.mainObject?.update_contract_submission_data
          ?.update_contract_submission_data ||
        this.props.mainObject?.tadkek_data_msa7y?.tadkek_msa7yData
      )?.imported_mainObject || this.props?.mainObject;
    const { isView, inputs } = this.props;

    // const {
    //   landData: {
    //     landData: {
    //       area,
    //       lands: { parcels },
    //     },
    //   },
    // } = mainObject;
    let requestType = mainObject?.landData?.requestType;
    let parcels = mainObject?.landData?.landData?.lands?.parcels;
    let area = mainObject?.landData?.landData?.area;
    return (
      <div>
        <div style={{ marginTop: "50px" }}>
          {!isKrokyUpdateContract &&
            !isUpdateContract &&
            planDescription != "" && (
              <p style={{ textAlign: "right", fontSize: "18px" }}>
                {planDescription}
              </p>
            )}
        </div>
        <div>
          {!isView &&
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
                      tab={convertToArabic(polygon.parcel_name)}
                      key={key + 1}
                    >
                      <div key={key}>
                        {!isKrokyUpdateContract &&
                          !isUpdateContract &&
                          (polygon.area ||
                            parseFloat(
                              parcels?.[key]?.attributes?.PARCEL_AREA || 0
                            )) > 0 && (
                            <>
                              <div>
                                المساحة الكلية للأرض حسب الطبيعة :{" "}
                                {convertToArabic((+polygon.area).toFixed(2))} م
                                {convertToArabic(2)}
                              </div>
                              <div>
                                مساحة الأرض حسب وثيقة الملكية :{" "}
                                {convertToArabic(
                                  isKrokyUpdateContract
                                    ? polygon.parcel_name != "حدود المعاملة"
                                      ? parseFloat(
                                          parcels?.[key - 1]?.attributes
                                            ?.PARCEL_AREA || 0
                                        ).toFixed(2)
                                      : area
                                    : parseFloat(
                                        parcels?.[key]?.attributes
                                          ?.PARCEL_AREA || 0
                                      ).toFixed(2)
                                )}{" "}
                                م{convertToArabic(2)}
                              </div>
                            </>
                          )}
                        {(isKrokyUpdateContract || isUpdateContract) &&
                          polygon.area > 0 && (
                            <>
                              <div>
                                المساحة الكلية :{" "}
                                {convertToArabic(
                                  (+polygon.cad_area || +polygon.area).toFixed(
                                    2
                                  )
                                )}{" "}
                                م{convertToArabic(2)}
                              </div>
                            </>
                          )}
                        {
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

                              {inputs.north.map((input, index) => {
                                return (
                                  <input
                                    name={input.name}
                                    type={input.type || "text"}
                                    className="ant-input"
                                    placeholder={input.placeholder}
                                    required="required"
                                    value={polygon[input.name]}
                                    onChange={this.onInputTextChange.bind(
                                      this,
                                      polygon,
                                      key
                                    )}
                                  />
                                );
                              })}

                              {!viewNumbersOnly && (
                                <Droppable droppableId="droppable_North">
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      style={getListStyle(
                                        snapshot.isDraggingOver
                                      )}
                                    >
                                      {this.state["northBoundries" + key] &&
                                        this.state["northBoundries" + key].map(
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
                                                  {item.content}
                                                </div>
                                              )}
                                            </Draggable>
                                          )
                                        )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              )}
                              <p
                                style={{
                                  float: "left",
                                  textAlign: "left",
                                  fontSize: "20px",
                                }}
                              >
                                طول الحد :{" "}
                                {convertToArabic(polygon.data[0].totalLength)}
                              </p>
                              {/* <p style={{ float: "right",textAlign: "right", fontSize: "20px" }}>
                            {polygon.data[0].data.map((side, subkey) => {
                                return (
                                  <span style={sideClass} onMouseOver={this.onmouseover.bind(this, side)} onMouseLeave={this.onmouseleave.bind(this)}>{parseFloat(side.text).toFixed(2)}</span>
                                )
                            })}
                          </p> */}
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

                                {inputs.east.map((input, index) => {
                                  return (
                                    <input
                                      name={input.name}
                                      type={input.type || "text"}
                                      className="ant-input"
                                      placeholder={input.placeholder}
                                      required="required"
                                      value={polygon[input.name]}
                                      onChange={this.onInputTextChange.bind(
                                        this,
                                        polygon,
                                        key
                                      )}
                                    />
                                  );
                                })}

                                {!viewNumbersOnly && (
                                  <Droppable droppableId="droppable_East">
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        style={getListStyle(
                                          snapshot.isDraggingOver
                                        )}
                                      >
                                        {this.state["eastBoundries" + key] &&
                                          this.state["eastBoundries" + key].map(
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
                                                    {item.content}
                                                  </div>
                                                )}
                                              </Draggable>
                                            )
                                          )}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                )}
                                <p
                                  style={{
                                    float: "left",
                                    textAlign: "left",
                                    fontSize: "20px",
                                  }}
                                >
                                  طول الحد :{" "}
                                  {convertToArabic(polygon.data[1].totalLength)}
                                </p>
                                {/* <p style={{ float: "right",textAlign: "right", fontSize: "20px" }}>
                            {polygon.data[1].data.map((side, subkey) => {
                                return (
                                  <span style={sideClass} onMouseOver={this.onmouseover.bind(this, side)} onMouseLeave={this.onmouseleave.bind(this)}>{parseFloat(side.text).toFixed(2)}</span>
                                )
                            })}
                          </p> */}
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

                                {inputs.west.map((input, index) => {
                                  return (
                                    <input
                                      name={input.name}
                                      type={input.type || "text"}
                                      className="ant-input"
                                      placeholder={input.placeholder}
                                      required="required"
                                      value={polygon[input.name]}
                                      onChange={this.onInputTextChange.bind(
                                        this,
                                        polygon,
                                        key
                                      )}
                                    />
                                  );
                                })}

                                {!viewNumbersOnly && (
                                  <Droppable droppableId="droppable_West">
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        style={getListStyle(
                                          snapshot.isDraggingOver
                                        )}
                                      >
                                        {this.state["westBoundries" + key] &&
                                          this.state["westBoundries" + key].map(
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
                                                    {item.content}
                                                  </div>
                                                )}
                                              </Draggable>
                                            )
                                          )}
                                        {provided.placeholder}
                                      </div>
                                    )}
                                  </Droppable>
                                )}

                                <p
                                  style={{
                                    float: "left",
                                    textAlign: "left",
                                    fontSize: "20px",
                                  }}
                                >
                                  طول الحد :{" "}
                                  {convertToArabic(polygon.data[3].totalLength)}
                                </p>
                                {/* <p style={{ float: "right",textAlign: "right", fontSize: "20px" }}>
                            {polygon.data[3].data.map((side, subkey) => {
                                return (
                                  <span style={sideClass} onMouseOver={this.onmouseover.bind(this, side)} onMouseLeave={this.onmouseleave.bind(this)}>{parseFloat(side.text).toFixed(2)}</span>
                                )
                            })}
                          </p> */}
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

                              {inputs.south.map((input, index) => {
                                return (
                                  <input
                                    name={input.name}
                                    type={input.type || "text"}
                                    className="ant-input"
                                    placeholder={input.placeholder}
                                    required="required"
                                    value={polygon[input.name]}
                                    onChange={this.onInputTextChange.bind(
                                      this,
                                      polygon,
                                      key
                                    )}
                                  />
                                );
                              })}

                              {!viewNumbersOnly && (
                                <Droppable droppableId="droppable_South">
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      style={getListStyle(
                                        snapshot.isDraggingOver
                                      )}
                                    >
                                      {this.state["southBoundries" + key] &&
                                        this.state["southBoundries" + key].map(
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
                                                  {item.content}
                                                </div>
                                              )}
                                            </Draggable>
                                          )
                                        )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              )}
                              <p
                                style={{
                                  float: "left",
                                  textAlign: "left",
                                  fontSize: "20px",
                                }}
                              >
                                طول الحد :{" "}
                                {convertToArabic(polygon.data[4].totalLength)}
                              </p>
                              {/* <p style={{ float: "right",textAlign: "right", fontSize: "20px" }}>
                            {polygon.data[4].data.map((side, subkey) => {
                              return (
                                <span style={sideClass} onMouseOver={this.onmouseover.bind(this, side)} onMouseLeave={this.onmouseleave.bind(this)}>{parseFloat(side.text).toFixed(2)}</span>
                              )
                            })}
                          </p> */}
                            </div>
                          </DragDropContext>
                        }
                      </div>
                      {/* {isUpdateContract &&
                        polygon.parcel_name != "حدود المعاملة" && (
                          <div
                            className="col-xs-12"
                            style={{ marginTop: "30px", padding: "0px" }}
                          >
                            <div
                              className="col-xs-2"
                              style={{ margin: "20px 0px", float: "left" }}
                            >
                              <input
                                name="parcelSliceNo"
                                type="text"
                                className="form-control"
                                value={this.state[`parcelSliceNo${key}`]}
                                disabled={requestType == 2}
                                placeholder="اسم التقسيم"
                                onChange={this.onParcelTextChange.bind(
                                  this,
                                  polygon,
                                  key
                                )}
                              />
                            </div>
                            <div style={{ margin: "20px 0px", float: "left" }}>
                              /
                            </div>
                            <div
                              className="col-xs-2"
                              style={{ margin: "20px 0px", float: "left" }}
                            >
                              <input
                                name="parcel_name"
                                type="text"
                                className="form-control"
                                required="required"
                                value={this.state[`parcel_name${key}`]}
                                disabled={viewNumbersOnly}
                                placeholder="رقم قطعة الأرض"
                                onChange={this.onParcelTextChange.bind(
                                  this,
                                  polygon,
                                  key
                                )}
                              />
                            </div>
                          </div>
                        )} */}

                      {polygon.parcel_name != "حدود المعاملة" && (
                        <Row gutter={[24, 16]}>
                          {isKrokyUpdateContract && (
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
                          )}
                          {isKrokyUpdateContract && <Col span={1}>/</Col>}
                          {(isUpdateContract ||
                            isKrokyUpdateContract ||
                            this.state.isTadkekMesahy) && (
                            <Col span={(isUpdateContract && 9) || 4}>
                              <Select
                                getPopupContainer={(trigger) =>
                                  trigger.parentNode
                                }
                                autoFocus
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
                                disabled={viewNumbersOnly}
                              >
                                {parcels?.map((e, i) => {
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
                          )}
                        </Row>
                      )}
                      {isKrokyUpdateContract && (
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
                      )}

                      {isUpdateContract && (
                        <Row gutter={[24, 16]}>
                          <Col span={9}>
                            <input
                              name={`${
                                (isUpdateContract && "area_text") || "area"
                              }`}
                              type="text"
                              className="form-control"
                              placeholder={`${
                                (isUpdateContract &&
                                  "من فضلك ادخل المساحة نصا هنا") ||
                                "المساحة م2"
                              }`}
                              required="required"
                              value={
                                this.state[
                                  ((isUpdateContract && "area_text") ||
                                    "area") + `${key}`
                                ]
                              }
                              onChange={this.onInputTextChange.bind(
                                this,
                                polygon,
                                key
                              )}
                            />
                          </Col>
                        </Row>
                      )}
                      {isUpdateContract && (
                        <div className="col-xs-12">
                          <div>
                            {!polygon.isFullBoundry &&
                              polygon.survayParcelCutter?.length > 0 && (
                                <div style={{ marginTop: "20px" }}>
                                  <h1 className="titleSelectedParcel">
                                    الشطفات
                                  </h1>

                                  <table
                                    className="table table-bordered"
                                    style={{ marginTop: "1%" }}
                                  >
                                    <thead>
                                      <tr>
                                        {this.parcel_fields_headers.map(
                                          (field_header, k) => {
                                            return <th>{field_header}</th>;
                                          }
                                        )}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {polygon.survayParcelCutter?.map(
                                        (e, i) => {
                                          return (
                                            <tr key={i}>
                                              {this.parcel_fields.map(
                                                (field, k) => {
                                                  return (
                                                    <td key={k}>
                                                      <div>
                                                        {field.editable ? (
                                                          !this.state[
                                                            field.name +
                                                              "_isEdit_" +
                                                              i +
                                                              `${key}`
                                                          ] ? (
                                                            <span>
                                                              <span>
                                                                {e[
                                                                  field.name
                                                                ] || ""}
                                                              </span>
                                                              {this.showEditBtn(
                                                                field.name,
                                                                e[field.name]
                                                              ) && (
                                                                <span>
                                                                  <button
                                                                    className="btn"
                                                                    style={{
                                                                      marginRight:
                                                                        e[
                                                                          field
                                                                            .name
                                                                        ]
                                                                          ? "20px"
                                                                          : "0px",
                                                                    }}
                                                                    onClick={(
                                                                      event
                                                                    ) => {
                                                                      this.enableEdit(
                                                                        field.name,
                                                                        i,
                                                                        key
                                                                      );
                                                                    }}
                                                                  >
                                                                    <i className="fas fa-edit"></i>
                                                                  </button>
                                                                </span>
                                                              )}
                                                            </span>
                                                          ) : (
                                                            <span
                                                              style={{
                                                                display: "grid",
                                                                gridTemplateColumns:
                                                                  "1fr auto",
                                                              }}
                                                            >
                                                              <input
                                                                key={i}
                                                                className="form-control"
                                                                type="number"
                                                                step="any"
                                                                name={`${
                                                                  field.name +
                                                                  i +
                                                                  `${key}`
                                                                }`}
                                                                value={
                                                                  e[field.name]
                                                                }
                                                                onChange={(
                                                                  event
                                                                ) => {
                                                                  this.myChangeHandler(
                                                                    field.name,
                                                                    i,
                                                                    e,
                                                                    key,
                                                                    event
                                                                  );
                                                                }}
                                                              />
                                                              <button
                                                                className="btn"
                                                                style={{
                                                                  marginRight:
                                                                    "20px",
                                                                }}
                                                                onClick={(
                                                                  event
                                                                ) => {
                                                                  this.saveEdit(
                                                                    0,
                                                                    field.name,
                                                                    i,
                                                                    key
                                                                  );
                                                                }}
                                                              >
                                                                <i className="fa fa-floppy-o"></i>
                                                              </button>
                                                            </span>
                                                          )
                                                        ) : (
                                                          <span>
                                                            <span>
                                                              {e[field.name] ||
                                                                ""}
                                                            </span>
                                                          </span>
                                                        )}
                                                      </div>
                                                    </td>
                                                  );
                                                }
                                              )}
                                            </tr>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                          </div>
                          {isUpdateContract &&
                            polygon.parcel_name != "حدود المعاملة" && (
                              <div>
                                {!viewNumbersOnly && (
                                  <div>
                                    <input
                                      type="checkbox"
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        margin: "3px",
                                      }}
                                      checked={
                                        (!viewNumbersOnly &&
                                          this.state[
                                            `have_electric_room${key}`
                                          ]) ||
                                        true
                                      }
                                      disabled={viewNumbersOnly}
                                      onChange={(evt) => {
                                        this.state[`electric_room_area${key}`] =
                                          "";
                                        this.onElectricInputChange(
                                          `have_electric_room${key}`,
                                          evt
                                        );
                                      }}
                                    />
                                    تشمل غرفة الكهرباء
                                  </div>
                                )}
                                {((!viewNumbersOnly &&
                                  this.state[`have_electric_room${key}`]) ||
                                  true) && (
                                  <div>
                                    <input
                                      className="form-control"
                                      type="number"
                                      step="any"
                                      name={`electric_room_area${key}`}
                                      value={
                                        this.state[`electric_room_area${key}`]
                                      }
                                      placeholder="مساحة غرفة الكهرباء"
                                      onChange={this.onElectricInputChange.bind(
                                        this,
                                        `electric_room_area${key}`
                                      )}
                                      disabled={viewNumbersOnly}
                                    />
                                  </div>
                                )}
                                {((!viewNumbersOnly &&
                                  this.state[`have_electric_room${key}`]) ||
                                  true) && (
                                  <div>
                                    <input
                                      className="form-control"
                                      type="text"
                                      step="any"
                                      name={`electric_room_place${key}`}
                                      value={
                                        this.state[`electric_room_place${key}`]
                                      }
                                      placeholder="مكان غرفة الكهرباء"
                                      onChange={this.onElectricInputChange.bind(
                                        this,
                                        `electric_room_place${key}`
                                      )}
                                      disabled={viewNumbersOnly}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                        </div>
                      )}
                    </TabPane>
                  );
                })}
              </Tabs>
            )}

          {isPlan &&
            this.state.polygons &&
            this.state.polygons.length > 0 &&
            this.state.polygons[0].area != -1 && (
              <div style={{ gridColumn: "1/3" }}>
                <div>
                  {survayParcelCutter?.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                      <h1 className="titleSelectedParcel">الشطفات</h1>

                      <table
                        className="table table-bordered"
                        style={{ marginTop: "1%" }}
                      >
                        <thead>
                          <tr>
                            {this.parcel_fields_headers.map(
                              (field_header, k) => {
                                return <th>{field_header}</th>;
                              }
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {survayParcelCutter?.map((e, i) => {
                            return (
                              <tr key={i}>
                                {this.parcel_fields.map((field, k) => {
                                  return (
                                    <td key={k}>
                                      <div>
                                        {field.editable ? (
                                          !this.state[
                                            field.name + "_isEdit_" + i
                                          ] ? (
                                            <span>
                                              <span>{e[field.name] || ""}</span>
                                              {this.showEditBtn(
                                                field.name,
                                                e[field.name]
                                              ) && (
                                                <span>
                                                  <button
                                                    className="btn"
                                                    style={{
                                                      marginRight: e[field.name]
                                                        ? "20px"
                                                        : "0px",
                                                    }}
                                                    onClick={(event) => {
                                                      this.enableEdit(
                                                        field.name,
                                                        i
                                                      );
                                                    }}
                                                  >
                                                    <i className="fas fa-edit"></i>
                                                  </button>
                                                </span>
                                              )}
                                            </span>
                                          ) : (
                                            <span
                                              style={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr auto",
                                              }}
                                            >
                                              <input
                                                key={i}
                                                className="form-control"
                                                type="number"
                                                step="any"
                                                name={`${field.name + i}`}
                                                value={e[field.name]}
                                                onChange={(event) => {
                                                  this.myChangeHandler(
                                                    field.name,
                                                    i,
                                                    e,
                                                    undefined,
                                                    event
                                                  );
                                                }}
                                              />
                                              <button
                                                className="btn"
                                                style={{
                                                  marginRight: "20px",
                                                }}
                                                onClick={(event) => {
                                                  this.saveEdit(
                                                    0,
                                                    field.name,
                                                    i
                                                  );
                                                }}
                                              >
                                                <i className="fa fa-floppy-o"></i>
                                              </button>
                                            </span>
                                          )
                                        ) : (
                                          <span>
                                            <span>{e[field.name] || ""}</span>
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                {(isKrokyUpdateContract || isPlan) &&
                  this.state.polygons &&
                  this.state.polygons.length > 0 &&
                  this.state.polygons[0].area != -1 && (
                    <div>
                      <div>
                        <input
                          type="checkbox"
                          style={{
                            width: "20px",
                            height: "20px",
                            margin: "3px",
                          }}
                          checked={this.state["have_electric_room"]}
                          onChange={(evt) => {
                            this.state[`electric_room_area`] = "";
                            this.onElectricInputChange(
                              `have_electric_room`,
                              evt
                            );
                          }}
                        />
                        تشمل غرفة الكهرباء
                      </div>
                      {this.state["have_electric_room"] && (
                        <div>
                          <input
                            className="form-control"
                            type="number"
                            step="any"
                            name="electric_room_area"
                            value={this.state["electric_room_area"]}
                            placeholder="مساحة غرفة الكهرباء"
                            onChange={this.onElectricInputChange.bind(
                              this,
                              "electric_room_area"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  )}
              </div>
            )}
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("cadData")(cadDataComponent));
