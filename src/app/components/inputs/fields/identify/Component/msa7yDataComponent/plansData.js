import React, { Component } from "react";
import { postItem, fetchData } from "app/helpers/apiMethods";
import {
  getMap,
  getIsMapLoaded,
  setIsMapLoaded,
} from "main_helpers/functions/filters/state";
import { esriRequest, getMapInfo } from "../common/esri_request";
import { FormSection } from "redux-form";
import { withTranslation } from "react-i18next";
import {
  DrawGraphics,
  createFeatureLayer,
  getInfo,
  queryTask,
  project,
  isPointOrArc,
  addGraphicToLayer,
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
  computeStreetAngle,
  convertToArabic,
  getUsingSymbol,
  getLayer,
  queryTask_updated,
  checkUploadedLayersFullyContainedByBoundry,
  computeLineLength,
  computeLineAngle,
  rotate,
  getGraphicDimensions,
  getLengthDirectionByCentroid,
  calculateSchemanticProportions,
  resizeMap,
  redrawNames,
  getFieldDomain,
  computePointDirection,
  loadCurrentPlan,
} from "../common/common_func";
import { layersSetting } from "../mapviewer/config/layers";
import { geometryServiceUrl, mapUrl } from "../mapviewer/config/map";
import {
  Select,
  Button,
  Form,
  message,
  Checkbox,
  Tabs,
  Collapse,
  Pagination,
  Radio,
} from "antd";
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
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
import "./planDataStyle.css";
import { Tooltip } from "antd";
import { setPlanDefaults } from "../../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/planDefaults";
//import { planSubmission } from "../../../../../wizard/modulesObjects/plan_approval/steps/final_approval_module/planSubmissionFunction";
const Panel = Collapse.Panel;
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

const planDescStyle = {
  fontSize: "15px",
  fontWeight: "600",
  marginTop: "5px",
  marginBottom: "5px",
};

const containerDetails = {
  minHeight: "10em",
  width: "150em",
  display: "table-cell",
  verticalAlign: "middle",
};

Number.prototype.toFixed = function (fixed) {
  var re = new RegExp(`^\\d+(?:\\.\\d{0,${fixed}})?`);
  return (
    (!isNaN(Number(this)) && Number(this)?.toString()?.match(re)?.[0]) ||
    String(this)?.match(re)?.[0]
  );
};

export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "plansData"),
    ...mapDispatchToProps1(dispatch),
  };
};
class plansDataComponent extends Component {
  constructor(props) {
    super(props);
    this.fields = {
      survayParcelCutter: {
        field: "list",
        hideLabel: true,
        init_data: (values, props) => {
          if (!props.input.value) {
            props.input.onChange([
              {
                direction: "الشطفة",
                NORTH_EAST_DIRECTION: "",
                NORTH_WEST_DIRECTION: "",
                SOUTH_EAST_DIRECTION: "",
                SOUTH_WEST_DIRECTION: "",
              },
            ]);
          }
        },
        fields: {
          direction: { head: "الإتجاه" },
          NORTH_EAST_DIRECTION: {
            head: "شمال / شرق",
            type: "input",
            placeholder: "شمال / شرق",
            field: "text",
            hideLabel: true,
          },
          NORTH_WEST_DIRECTION: {
            head: "شمال / غرب",
            type: "input",
            placeholder: "شمال / غرب",
            field: "text",
            hideLabel: true,
          },
          SOUTH_EAST_DIRECTION: {
            head: "جنوب / شرق",
            type: "input",
            placeholder: "جنوب / شرق",
            field: "text",
            hideLabel: true,
          },
          SOUTH_WEST_DIRECTION: {
            head: "جنوب / غرب",
            type: "input",
            placeholder: "جنوب / غرب",
            field: "text",
            hideLabel: true,
          },
        },
      },
    };
    this.editFields = {
      survayParcelCutter: {
        field: "list",
        hideLabel: true,
        fields: {
          direction: { head: "الإتجاه" },
          NORTH_EAST_DIRECTION: {
            head: "شمال / شرق",
          },
          NORTH_WEST_DIRECTION: {
            head: "شمال / غرب",
          },
          SOUTH_EAST_DIRECTION: {
            head: "جنوب / شرق",
          },
          SOUTH_WEST_DIRECTION: {
            head: "جنوب / غرب",
          },
        },
      },
    };
    this.autoCadColor = [
      [255, 0, 0],
      [255, 255, 0],
      [0, 255, 0],
      [0, 255, 255],
      [0, 0, 255],
      [255, 0, 255],
      [255, 255, 255],
      [128, 128, 128],
      [192, 192, 192],
      [255, 0, 0],
      [255, 127, 127],
      [204, 0, 0],
      [204, 102, 102],
      [153, 0, 0],
      [153, 76, 76],
      [127, 0, 0],
      [127, 63, 63],
      [76, 0, 0],
      [76, 38, 38],
      [255, 63, 0],
      [255, 159, 127],
      [204, 51, 0],
      [204, 127, 102],
      [153, 38, 0],
      [153, 95, 76],
      [127, 31, 0],
      [127, 79, 63],
      [76, 19, 0],
      [76, 47, 38],
      [255, 127, 0],
      [255, 191, 127],
      [204, 102, 0],
      [204, 153, 102],
      [153, 76, 0],
      [153, 114, 76],
      [127, 63, 0],
      [127, 95, 63],
      [76, 38, 0],
      [76, 57, 38],
      [255, 191, 0],
      [255, 223, 127],
      [204, 153, 0],
      [204, 178, 102],
      [153, 114, 0],
      [153, 133, 76],
      [127, 95, 0],
      [127, 111, 63],
      [76, 57, 0],
      [76, 66, 38],
      [255, 255, 0],
      [255, 255, 127],
      [204, 204, 0],
      [204, 204, 102],
      [153, 153, 0],
      [153, 153, 76],
      [127, 127, 0],
      [127, 127, 63],
      [76, 76, 0],
      [76, 76, 38],
      [191, 255, 0],
      [223, 255, 127],
      [153, 204, 0],
      [178, 204, 102],
      [114, 153, 0],
      [133, 153, 76],
      [95, 127, 0],
      [111, 127, 63],
      [57, 76, 0],
      [66, 76, 38],
      [127, 255, 0],
      [191, 255, 127],
      [102, 204, 0],
      [153, 204, 102],
      [76, 153, 0],
      [114, 153, 76],
      [63, 127, 0],
      [95, 127, 63],
      [38, 76, 0],
      [57, 76, 38],
      [63, 255, 0],
      [159, 255, 127],
      [51, 204, 0],
      [127, 204, 102],
      [38, 153, 0],
      [95, 153, 76],
      [31, 127, 0],
      [79, 127, 63],
      [19, 76, 0],
      [47, 76, 38],
      [0, 255, 0],
      [127, 255, 127],
      [0, 204, 0],
      [102, 204, 102],
      [0, 153, 0],
      [76, 153, 76],
      [0, 127, 0],
      [63, 127, 63],
      [0, 76, 0],
      [38, 76, 38],
      [0, 255, 63],
      [127, 255, 159],
      [0, 204, 51],
      [102, 204, 127],
      [0, 153, 38],
      [76, 153, 95],
      [0, 127, 31],
      [63, 127, 79],
      [0, 76, 19],
      [38, 76, 47],
      [0, 255, 127],
      [127, 255, 191],
      [0, 204, 102],
      [102, 204, 153],
      [0, 153, 76],
      [76, 153, 114],
      [0, 127, 63],
      [63, 127, 95],
      [0, 76, 38],
      [38, 76, 57],
      [0, 255, 191],
      [127, 255, 223],
      [0, 204, 153],
      [102, 204, 178],
      [0, 153, 114],
      [76, 153, 133],
      [0, 127, 95],
      [63, 127, 111],
      [0, 76, 57],
      [38, 76, 66],
      [0, 255, 255],
      [127, 255, 255],
      [0, 204, 204],
      [102, 204, 204],
      [0, 153, 153],
      [76, 153, 153],
      [0, 127, 127],
      [63, 127, 127],
      [0, 76, 76],
      [38, 76, 76],
      [0, 191, 255],
      [127, 223, 255],
      [0, 153, 204],
      [102, 178, 204],
      [0, 114, 153],
      [76, 133, 153],
      [0, 95, 127],
      [63, 111, 127],
      [0, 57, 76],
      [38, 66, 76],
      [0, 127, 255],
      [127, 191, 255],
      [0, 102, 204],
      [102, 153, 204],
      [0, 76, 153],
      [76, 114, 153],
      [0, 63, 127],
      [63, 95, 127],
      [0, 38, 76],
      [38, 57, 76],
      [0, 63, 255],
      [127, 159, 255],
      [0, 51, 204],
      [102, 127, 204],
      [0, 38, 153],
      [76, 95, 153],
      [0, 31, 127],
      [63, 79, 127],
      [0, 19, 76],
      [38, 47, 76],
      [0, 0, 255],
      [127, 127, 255],
      [0, 0, 204],
      [102, 102, 204],
      [0, 0, 153],
      [76, 76, 153],
      [0, 0, 127],
      [63, 63, 127],
      [0, 0, 76],
      [38, 38, 76],
      [63, 0, 255],
      [159, 127, 255],
      [51, 0, 204],
      [127, 102, 204],
      [38, 0, 153],
      [95, 76, 153],
      [31, 0, 127],
      [79, 63, 127],
      [19, 0, 76],
      [47, 38, 76],
      [127, 0, 255],
      [191, 127, 255],
      [102, 0, 204],
      [153, 102, 204],
      [76, 0, 153],
      [114, 76, 153],
      [63, 0, 127],
      [95, 63, 127],
      [38, 0, 76],
      [57, 38, 76],
      [191, 0, 255],
      [223, 127, 255],
      [153, 0, 204],
      [178, 102, 204],
      [114, 0, 153],
      [133, 76, 153],
      [95, 0, 127],
      [111, 63, 127],
      [57, 0, 76],
      [66, 38, 76],
      [255, 0, 255],
      [255, 127, 255],
      [204, 0, 204],
      [204, 102, 204],
      [153, 0, 153],
      [153, 76, 153],
      [127, 0, 127],
      [127, 63, 127],
      [76, 0, 76],
      [76, 38, 76],
      [255, 0, 191],
      [255, 127, 223],
      [204, 0, 153],
      [204, 102, 178],
      [153, 0, 114],
      [153, 76, 133],
      [127, 0, 95],
      [127, 63, 111],
      [76, 0, 57],
      [76, 38, 66],
      [255, 0, 127],
      [255, 127, 191],
      [204, 0, 102],
      [204, 102, 153],
      [153, 0, 76],
      [153, 76, 114],
      [127, 0, 63],
      [127, 63, 95],
      [76, 0, 38],
      [76, 38, 57],
      [255, 0, 63],
      [255, 127, 159],
      [204, 0, 51],
      [204, 102, 127],
      [153, 0, 38],
      [153, 76, 95],
      [127, 0, 31],
      [127, 63, 79],
      [76, 0, 19],
      [76, 38, 47],
      [51, 51, 51],
      [91, 91, 91],
      [132, 132, 132],
      [173, 173, 173],
      [214, 214, 214],
      [255, 255, 255],
    ];

    this.pageSize = props.pageSize || 15;

    let cadDetails = props.mainObject?.data_msa7y?.msa7yData?.cadDetails;
    const {
      mainObject: { currentStepId },
      currentModule: {
        record: { CurrentStep },
      },
    } = props;

    var planDetailsInfo = cadDetails?.planDescription || "";

    if (
      props.mainObject &&
      props.mainObject[`${props.currentStep}`] &&
      props.mainObject[`${props.currentStep}`][`${props.currentStep}Data`] &&
      props.mainObject[`${props.currentStep}`][`${props.currentStep}Data`][
        "planDetails"
      ]
    ) {
      const {
        mainObject: {
          [`${props.currentStep}`]: {
            [`${props.currentStep}Data`]: { planDetails },
          },
        },
      } = props;

      if (planDetails.selectedCAD == "firstCAD")
        planDetails.selectedCAD = "perfectCad";
      else if (planDetails.selectedCAD == "secondCAD")
        planDetails.selectedCAD = "secondCad";
      else if (planDetails.selectedCAD == "thirdCAD")
        planDetails.selectedCAD = "thirdCad";

      planDetails.selectedCADIndex =
        planDetails.selectedCAD == "perfectCad"
          ? 0
          : planDetails.selectedCAD == "secondCad"
          ? 1
          : 2;

      this.state = {
        isInvestalIncluded: planDetails.isInvestalIncluded || false,
        zoomRatio: 50,
        plans: [],
        polygons: [],
        selectedCAD: planDetails.selectedCAD || "",
        selectedCADIndex:
          planDetails.selectedCADIndex != -1
            ? planDetails.selectedCADIndex
            : -1,
        planDescription: planDetailsInfo,
        planUsingSymbol: planDetails.planUsingSymbol || "",
        hide_details:
          planDetails.hide_details != undefined &&
          planDetails.hide_details != true
            ? false
            : true,
        streets: planDetails.streets || [],
        currentParcelPage: 1,
        totalParcelPage:
          (planDetails.uplodedFeatures &&
            //.filter((parcel) => parcel.is_cut != 2)
            planDetails?.uplodedFeatures?.[
              planDetails?.selectedCADIndex || 0
            ]?.shapeFeatures?.landbase?.filter((parcel) => parcel.is_cut != 2)
              .length / this.pageSize) ||
          0,
        minParcelIndex: 0,
        maxParcelIndex: 1 * this.pageSize,
        currentInvestalParcelPage: 1,
        totalInvestalParcelPage:
          (planDetails.uplodedFeatures &&
            planDetails?.uplodedFeatures?.[
              planDetails?.selectedCADIndex || 0
            ]?.shapeFeatures?.landbase?.filter((parcel) => parcel.is_cut == 2)
              .length / this.pageSize) ||
          0,
        minInvestalParcelIndex: 0,
        maxInvestalParcelIndex: 1 * this.pageSize,
        currentStreetPage: 1,
        totalStreetPage:
          (planDetails.streets && planDetails.streets.length / this.pageSize) ||
          0,
        minStreetIndex: 0,
        maxStreetIndex: 1 * this.pageSize,
        current_step: (CurrentStep && CurrentStep.id) || currentStepId,
        removeNoSubType: undefined,
        serviceType: planDetails.serviceType || {},
        servicesTypes: planDetails.servicesTypes || [],
        serviceSubType: planDetails.serviceSubType || {},
        servicesSubTypes: planDetails.servicesSubTypes || [],
        bufferDistance: 5,
        uplodedFeatures: planDetails.uplodedFeatures || [],
        statisticsParcels: planDetails.statisticsParcels || [],
        detailsParcelTypes: planDetails.detailsParcelTypes || [],
        TotalParcelArea:
          planDetails.TotalParcelArea ||
          (planDetails.uplodedFeatures &&
            planDetails?.uplodedFeatures?.[
              planDetails?.selectedCADIndex || 0
            ]?.shapeFeatures?.landbase?.reduce((a, b) => a + b.area, 0)) ||
          0,
        servicesLayer: {},
        //cadPath: '',
        streetsAnnotation: planDetails.streetsAnnotation || [],
        enableDownlaodCad:
          (props.mainObject && props.mainObject.enableDownlaodCad) || false,
      };
    } else {
      this.state = {
        isInvestalIncluded: false,
        zoomRatio: 50,
        plans: [],
        polygons: [],
        //hide_details: false,
        selectedCAD: "",
        selectedCADIndex: -1,
        planDescription: planDetailsInfo,
        planUsingSymbol: "",
        hide_details: true,
        streets: [],
        currentParcelPage: 1,
        totalParcelPage: 0,
        minParcelIndex: 0,
        maxParcelIndex: 1 * this.pageSize,
        currentInvestalParcelPage: 1,
        totalInvestalParcelPage: 0,
        minInvestalParcelIndex: 0,
        maxInvestalParcelIndex: 1 * this.pageSize,
        currentStreetPage: 1,
        totalStreetPage: 0,
        minStreetIndex: 0,
        maxStreetIndex: 1 * this.pageSize,
        current_step: (CurrentStep && CurrentStep.id) || currentStepId,
        removeNoSubType: undefined,
        serviceType: {},
        servicesTypes: [],
        serviceSubType: {},
        servicesSubTypes: [],
        bufferDistance: 5,
        uplodedFeatures: [],
        statisticsParcels: [],
        detailsParcelTypes: [],
        TotalParcelArea: 0,
        servicesLayer: {},
        //cadPath: '',
        streetsAnnotation: [],
        enableDownlaodCad: false,
      };
    }

    this.isLoaded = true;
    getInfo(mapUrl).then((response) => {
      let StreetNamingLayerId = response["Street_Naming"];
      getFieldDomain("", StreetNamingLayerId).then((domains) => {
        this.domains = domains;
      });
    });
  }

  isValidCondition = (parcel) => {
    const { mainObject } = this.props;
    if (parcel.usingSymbol) {
      var condition = _.find(mainObject.buildingCondition, function (d) {
        return d.attributes.USING_SYMBOL_CODE == parcel.usingSymbol;
      });
      if (condition && condition.attributes && condition.attributes.SLIDE_AREA)
        return condition.attributes.SLIDE_AREA <= parcel.area;
      else return true;
    } else return true;
  };

  removeNoSubType = (itm) => {
    return itm.cad_sublayers;
  };

  // $scope.$watch(function () {
  //     return $scope.model.selectedModel;

  // }, function (newVal, oldVal) {

  //     if (newVal && newVal != oldVal) {

  //         if (!pdc.serviceTypes) {

  //             $http.get($rootScope.serverUrl + "CadLayers/GetAll?pageSize=40").success(function (data) {
  //                 pdc.servicesTypes = data.results;

  //                 pdc.servicesTypes.forEach(function (type) {
  //                     type.layer_color = eval(type.layer_color);
  //                 });

  //                 init(newVal);

  //             });
  //         }
  //         else
  //             init(newVal);
  //     }

  // }, true);

  resetMap = () => {
    if (this?.map?.graphicsLayerIds) {
      let arr = this.map.graphicsLayerIds.map((x) => x);
      arr.forEach((layerName, index) => {
        if (layerName.toLowerCase().indexOf("Layer_G".toLowerCase()) != -1) {
          this.map.removeLayer(this.map.getLayer(layerName));
        } else {
          clearGraphicFromLayer(this.map, layerName);
        }
      });
    }

    console.log("map", map);

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
  };

  setBuildingCondition = (uplodedFeatures) => {
    return new Promise((resolve, reject) => {
      try {
        let { mainObject } = this.props;
        var usingSymbolObj;
        if (uplodedFeatures) {
          usingSymbolObj = _(uplodedFeatures.shapeFeatures.landbase)
            .groupBy("usingSymbol")
            .value();
        }
        var maxCount = 0;
        if (!isEmpty(usingSymbolObj)) {
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
            "يُسمح بالأستعمالات ال" +
            mainObject.submission_data.mostafed_data.mostafed_type +
            "ة" +
            "وأستعمالاتها التبعية فى المنطقة ال" +
            mainObject.submission_data.mostafed_data.mostafed_type +
            "ة" +
            " " +
            mainObject.selectedMaxUsingSymbol;

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
                    }
                  );
                }
              }
            }
          );
        }
        return resolve(true);
      } catch (error) {
        console.error(error);
        return reject();
      }
    });
  };

  init = function (newVal) {
    this.resetMap();
    const {
      currentModule: { record },
    } = this.props;
    setTimeout(
      function () {
        if (
          this.state.uplodedFeatures?.[newVal]?.shapeFeatures?.landbase &&
          checkUploadedLayersFullyContainedByBoundry(
            this.state.uplodedFeatures[newVal],
            this.props.mainObject.submission_data.mostafed_data.e3adt_tanzem,
            record?.request_no
          )
        ) {
          this.drawFeatures(this.state.uplodedFeatures[newVal]);

          loadCurrentPlan(this.props, this.map, window.loadedLayers, true);
        } else {
          var values = {
            isInvestalIncluded: false,
            statisticsParcels: [],
            enableDownlaodCad: false,
            planDescription: "",
            streets: [],
            detailsParcelTypes: [],
            streetsAnnotation: [],
            serviceSubType: null,
            serviceType: null,
            selectedCAD: "",
            selectedCADIndex: -1,
            planUsingSymbol: "",
            hide_details: true,
            servicesTypes: [],
            servicesSubTypes: [],
            TotalParcelArea: 0,
          };

          var additionalValues = {
            totalParcelPage: 0,
            minParcelIndex: 0,
            maxParcelIndex: 0,
            totalInvestalParcelPage: 0,
            minInvestalParcelIndex: 0,
            maxInvestalParcelIndex: 0,
            totalStreetPage: 0,
            minStreetIndex: 0,
            maxStreetIndex: 0,
          };

          this.props.input.onChange({
            ...values,
            ...additionalValues,
          });

          this.setState({
            ...values,
            ...additionalValues,
          });
        }
      }.bind(this),
      500
    );
  };

  onStreetChange = (street, evt) => {
    const {
      input: { value },
    } = this.props;
    street[evt.target.name] =
      evt.target.name == "streetname"
        ? evt?.target?.value || ""
        : evt?.target?.value;
    street.polygon = street.polygon || new esri.geometry.Polygon(street);
    street.position =
      street.position ||
      new esri.geometry.Polygon(street).getExtent().getCenter();

    // if (evt.target.name == "streetname") {
    //   redrawNames(street, this.map, street.streetname, "PacrelNoGraphicLayer");
    // }

    //this.state.streets[index] = street;
    this.props.input.onChange({ ...value, streets: this.state.streets });
    this.setState({ streets: this.state.streets });
  };

  drawBuffer = function (bufferDistance) {
    if (this.map.getLayer("BufferGraphicLayer"))
      this.map.getLayer("BufferGraphicLayer").clear();

    if (this.state.bufferDistance > 0) {
      LoadModules([
        "esri/tasks/GeometryService",
        "esri/tasks/BufferParameters",
        "esri/geometry/Polygon",
        "esri/geometry/Circle",
      ]).then(([GeometryService, BufferParameters, Polygon, Circle]) => {
        if (!this.state.serviceSubType) {
          _.filter(
            this.state.uplodedFeatures[this.state.selectedCADIndex]
              .shapeFeatures.landbase,
            function (d) {
              return d.typeId == this.state.serviceType.symbol_id;
            }.bind(this)
          ).forEach(
            function (feature) {
              if (!feature.spatialReference.wkid) {
                feature.spatialReference = this.map.spatialReference;
              }
              feature = new Polygon(feature);

              var circleGeometry = new Circle({
                center: feature.getExtent().getCenter(),
                radius: +this.state.bufferDistance,
                radiusUnit: esri.Units.METERS,
              });

              addGraphicToLayer(
                circleGeometry,
                this.map,
                "BufferGraphicLayer",
                [0, 0, 255],
                null,
                false,
                null,
                null,
                null,
                true,
                true,
                null,
                false
              );
            }.bind(this)
          );
        } else {
          _.filter(
            this.state.uplodedFeatures[this.state.selectedCADIndex]
              .shapeFeatures.landbase,
            function (d) {
              return d.useDetails == this.state.serviceSubType.symbol_id;
            }.bind(this)
          ).forEach(
            function (feature) {
              if (!feature.spatialReference.wkid) {
                feature.spatialReference = this.map.spatialReference;
              }
              feature = new Polygon(feature);

              var circleGeometry = new Circle({
                center: feature.getExtent().getCenter(),
                radius: +bufferDistance,
                radiusUnit: esri.Units.METERS,
              });

              addGraphicToLayer(
                circleGeometry,
                this.map,
                "BufferGraphicLayer",
                [0, 0, 255],
                null,
                false,
                null,
                null,
                null,
                true,
                true,
                null,
                false
              );
            }.bind(this)
          );
        }

        var gsvc = GeometryService(geometryServiceUrl);
        var params = new BufferParameters();

        var boundry = new Polygon(
          this.state.uplodedFeatures[
            this.state.selectedCADIndex
          ].shapeFeatures.boundry[0]
        );

        params.geometries = [dojo.clone(boundry)];
        params.distances = [+this.state.bufferDistance];
        params.unit = GeometryService.UNIT_METER;
        params.outSpatialReference = this.map.spatialReference;

        gsvc.buffer(
          params,
          function (geometries) {
            var where = "SRVC_TYPE =" + this.state.serviceType.layer_code;

            if (
              this.state.serviceSubType &&
              this.state.serviceSubType.sublayer_code
            )
              where =
                "SRVC_SUBTYPE =" + this.state.serviceSubType.sublayer_code;

            queryTask({
              url: planMapEditing + "MapServer/" + this.state.servicesLayer.id,
              where: where,
              outFields: ["OBJECTID"],
              callbackResult: (res) => {
                res.features.forEach(
                  function (feature) {
                    var f = new esri.geometry.Point(feature.geometry);

                    if (!boundry.contains(f)) {
                      var circleGeometry = new Circle({
                        center: f,
                        radius: +bufferDistance,
                        radiusUnit: esri.Units.METERS,
                      });

                      addGraphicToLayer(
                        circleGeometry,
                        this.map,
                        "BufferGraphicLayer",
                        [0, 0, 255],
                        null,
                        false,
                        null,
                        null,
                        null,
                        true,
                        true,
                        null,
                        false
                      );
                    }
                  }.bind(this)
                );
              },
              callbackError: () => {
                store.dispatch({ type: "Show_Loading_new", loading: false });
              },
              preQuery: function (query, Query) {
                query.geometry = dojo.clone(geometries[0]);
              },
              returnGeometry: true,
            });
          }.bind(this)
        );
      });
    }
  };

  serviceChange = function (evt) {
    var item = JSON.parse(evt.target.value);
    if (item) {
      this.setState({
        serviceType: item,
        servicesSubTypes: item.cad_sublayers,
      });
    }
  };

  clearBuffer = function () {
    if (this.map.getLayer("BufferGraphicLayer"))
      this.map.getLayer("BufferGraphicLayer").clear();
  };

  dragLength = function (event) {
    this.map.disableMapNavigation();
    this.map.getLayer("PacrelNoGraphicLayer").remove(event.graphic);
    addParcelNo(
      event.mapPoint,
      this.map,
      "" + event.graphic.attributes["text"],
      "PacrelNoGraphicLayer",
      12,
      null,
      event.graphic.attributes["angle"],
      null,
      {
        text: event.graphic.attributes["text"],
        angle: event.graphic.attributes["angle"],
      },
      true,
      false
    );
  };

  moveBoundries = function () {
    window.onDragLengthLayer = [];
    window.onDragLengthLayer.push(this.dragLength);
  };

  getMaxTwoLinesLength = function (streetsLines) {
    var largestA = streetsLines[0];
    var largestB = streetsLines[1];

    for (var i = 0; i < streetsLines.length; i++) {
      if (streetsLines[i].text > largestA.text) {
        largestB = largestA;
        largestA = streetsLines[i];
      } else if (
        streetsLines[i].text > largestB.text &&
        streetsLines[i].paths[0][0][0] != largestA.paths[0][0][0]
      ) {
        largestB = streetsLines[i];
      }
    }

    return [largestA, largestB];
  };

  serviceSubChange = function (evt) {
    var item = JSON.parse(evt.target.value);
    if (item) {
      this.setState({
        bufferDistance: +item.buffer_length,
        serviceSubType: item,
      });
    }
  };

  compareTwoFeatures = function (feature1, feature2) {
    var same = true;
    if (feature1.rings[0].length == feature2.rings[0].length) {
      for (var j = 0, n = feature1.rings[0].length - 1; j < n; j++) {
        if (feature1.rings[0][j] != feature2.rings[0][j]) {
          same = false;
          break;
        }
      }

      return same;
    } else {
      return false;
    }
  };

  computeLineAngle = (pointA, pointB, cetroid, polygon) => {
    var y = pointA[1] - pointB[1];
    var x = pointA[0] - pointB[0];
    var line = new esri.geometry.Polyline([pointA, pointB]);
    var direction = getLengthDirectionByCentroid(
      [pointA, pointB],
      line.getExtent().getCenter(),
      polygon
    );

    var y = pointA[1] - pointB[1];
    var x = pointA[0] - pointB[0];

    return { length: Math.sqrt(x * x + y * y), direction: direction };
  };

  drawFeatures = (uplodedFeatures) => {
    const {
      mainObject,
      input,
      t,
      currentModule: { record },
    } = this.props;
    const { CurrentStep, servicesTypes, serviceSubType } = this.state;

    let msa7yArea = +_.chain(
      this.props.mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels
    )
      .reduce(function (a, b) {
        return a + +b.area;
      }, 0)
      .value()
      .toFixed(2);
    let landbasesArea = +_.chain(uplodedFeatures.shapeFeatures.landbase)
      .reduce(function (a, b) {
        return a + +b.area;
      }, 0)
      .value()
      .toFixed(2);

    if (
      !this.props.mainObject.submission_data.mostafed_data.e3adt_tanzem &&
      !record.request_no &&
      msa7yArea != landbasesArea &&
      (!window.Supporting ||
        (window.Supporting && !window.Supporting.areaDifference))
    ) {
      window.notifySystem(
        "error",
        "boundry لا يساوي اجمالي مساحة المخطط landbase اجمالي مساحات الرسم داخل طبقة",
        10
      );
      window.notifySystem(
        "error",

        convertToArabic(msa7yArea) + " م2 " + ":boundry اجمالي مساحة طبقة",
        10
      );
      window.notifySystem(
        "error",

        convertToArabic(landbasesArea) +
          " م2 " +
          " :landbase اجمالي مساحة طبقة",
        10
      );
      return false;
    }

    var isWithIn = false;

    var moacount = 0;

    if (this.map.getLayer("PacrelNoGraphicLayer"))
      this.map.getLayer("PacrelNoGraphicLayer").clear();

    if (this?.map?.graphicsLayerIds) {
      this.map.graphicsLayerIds.forEach(
        function (layerID) {
          if (this.map.getLayer(layerID)) this.map.getLayer(layerID).clear();
        }.bind(this)
      );
    }
    this.state.bufferDistance = 0;

    if (uplodedFeatures.shapeFeatures.boundry) {
      uplodedFeatures.shapeFeatures.boundry.forEach(
        function (boundry) {
          if (boundry.spatialReference && !boundry.spatialReference.wkid) {
            boundry.spatialReference = this.map.spatialReference;
          }

          boundry.area -=
            +this.props.mainObject?.data_msa7y?.msa7yData?.cadDetails?.cuttes_area?.toFixed(
              2
            ) || 0;

          var feature = new esri.geometry.Polygon(boundry);
          _.filter(uplodedFeatures.annotations, function (d) {
            return d.layer == "boundry";
          }).forEach(function (annotation) {
            if (feature.contains && feature.contains(annotation.shape)) {
              boundry.text = annotation.text;
            }
          });

          var found = [];

          if (mainObject && mainObject.data_msa7y) {
            found = _.filter(feature.rings[0], function (ring) {
              return _.find(
                mainObject.data_msa7y.msa7yData.cadDetails.temp.cadResults
                  .data[0].shapeFeatures[0].rings[0],
                function (ring2) {
                  return ring2[0] == ring[0] && ring2[1] == ring[1];
                }
              );
            });

            if (
              found.length !=
                mainObject.data_msa7y.msa7yData.cadDetails.temp.cadResults
                  .data[0].shapeFeatures[0].rings[0].length &&
              CurrentStep == 2317
            ) {
              window.notifySystem("error", t("PLANOOUTSIDETHEBOUDRY"));
            } else {
              isWithIn = true;
              addGraphicToLayer(
                feature,
                this.map,
                "detailedGraphicLayer",
                [0, 0, 0],
                null,
                null,
                () => {
                  // zoomToLayer(
                  //   "detailedGraphicLayer",
                  //   this.map,
                  //   this.state["zoomRatio"]
                  // );
                  resizeMap(this.map);
                },
                null,
                null,
                true,
                null,
                null,
                false
              );
            }
          } else {
            isWithIn = true;
            addGraphicToLayer(
              feature,
              this.map,
              "detailedGraphicLayer",
              [0, 0, 0],
              null,
              null,
              () => {
                // zoomToLayer(
                //   "detailedGraphicLayer",
                //   this.map,
                //   this.state["zoomRatio"]
                // );
                resizeMap(this.map);
              },
              null,
              null,
              true,
              null,
              null,
              false
            );
          }
        }.bind(this)
      );
    }

    if (uplodedFeatures.shapeFeatures.out_sak_boundry) {
      uplodedFeatures.shapeFeatures.out_sak_boundry.forEach(
        function (boundry) {
          if (boundry.spatialReference && !boundry.spatialReference.wkid) {
            boundry.spatialReference = this.map.spatialReference;
          }

          var feature = new esri.geometry.Polygon(boundry);
          _.filter(uplodedFeatures.annotations, function (d) {
            return d.layer == "out_sak_boundry";
          }).forEach(function (annotation) {
            if (feature.contains && feature.contains(annotation.shape)) {
              boundry.text = annotation.text;
            }
          });

          addGraphicToLayer(
            feature,
            this.map,
            "detailedGraphicLayer",
            [0, 0, 0],
            null,
            null,
            () => {
              // zoomToLayer(
              //   "detailedGraphicLayer",
              //   this.map,
              //   this.state["zoomRatio"]
              // );
              resizeMap(this.map);
            },
            null,
            null,
            true,
            null,
            null,
            false
          );
        }.bind(this)
      );
    }

    if (isWithIn) {
      if (uplodedFeatures.lineFeatures.length > 0) {
        uplodedFeatures.lineFeatures.forEach(
          function (detail) {
            var polyline = new esri.geometry.Polyline(detail);
            addGraphicToLayer(
              polyline,
              this.map,
              "detailedGraphicLayer",
              detail.color ? this.autoCadColor[detail.color - 1] : [60, 60, 60],
              null,
              null,
              () => {
                // zoomToLayer(
                //   "detailedGraphicLayer",
                //   this.map,
                //   this.state["zoomRatio"]
                // );
                resizeMap(this.map);
              },
              null,
              null,
              null,
              null,
              null,
              false
            );
          }.bind(this)
        );
      } else {
        zoomToLayer("detailedGraphicLayer", this.map, this.state["zoomRatio"]);
      }
      var annotations = [];

      uplodedFeatures.annotations.forEach(
        function (annotation) {
          annotation.shape = new esri.geometry.Point(annotation.shape);

          if (annotation.layer == "nearby_plans") {
            var txt = annotation.text;
            if (annotation.text) {
              txt = annotation.text;
            }

            var attr = {
              text: convertToArabic(txt),
              angle: -15,
            };

            addParcelNo(
              annotation.shape,
              this.map,
              convertToArabic(txt),
              "PacrelNoGraphicLayer",
              12,
              [60, 60, 60],
              -15,
              { y: 0, x: 0 },
              attr,
              false,
              false
            );
          }
        }.bind(this)
      );

      if (uplodedFeatures.shapeFeatures.subdivision) {
        uplodedFeatures.shapeFeatures.subdivision.forEach(
          function (subdivision) {
            if (
              subdivision.spatialReference &&
              !subdivision.spatialReference.wkid
            ) {
              subdivision.spatialReference = this.map.spatialReference;
            }
            var feature = new esri.geometry.Polygon(subdivision);

            _.filter(uplodedFeatures.annotations, function (d) {
              return d.layer == "subdivision";
            }).forEach(function (annotation) {
              if (feature.contains && feature.contains(annotation.shape)) {
                subdivision.text = annotation.text;
              }
            });

            addGraphicToLayer(
              feature,
              this.map,
              "detailedGraphicLayer",
              [0, 0, 255],
              null,
              null,
              () => {
                // zoomToLayer(
                //   "detailedGraphicLayer",
                //   this.map,
                //   this.state["zoomRatio"]
                // );
                resizeMap(this.map);
              },
              null,
              null,
              true,
              null,
              null,
              false
            );
          }.bind(this)
        );
      }

      if (uplodedFeatures.shapeFeatures.nearby_plans) {
        uplodedFeatures.shapeFeatures.nearby_plans.forEach(
          function (nearby_plan) {
            nearby_plan.spatialReference.wkid = this.map.spatialReference.wkid;

            var feature = new esri.geometry.Polygon(nearby_plan);

            _.filter(uplodedFeatures.annotations, function (d) {
              return d.layer == "nearby_plans";
            }).forEach(function (annotation) {
              if (feature.contains && feature.contains(annotation.shape)) {
                nearby_plan.text = annotation.text;
              }
            });

            addGraphicToLayer(
              feature,
              this.map,
              "detailedGraphicLayer",
              [60, 60, 60],
              null,
              null,
              () => {
                // zoomToLayer(
                //   "detailedGraphicLayer",
                //   this.map,
                //   this.state["zoomRatio"]
                // );
                resizeMap(this.map);
              },
              null,
              null,
              true,
              null,
              null,
              false
            );

            var ang = -15;

            var txt = nearby_plan.text;

            if (txt) {
              txt = txt;
            }

            var attr = {
              text: convertToArabic(txt),
              angle: -15,
            };

            addParcelNo(
              feature.getExtent().getCenter(),
              this.map,
              convertToArabic(txt),
              "PacrelNoGraphicLayer",
              12,
              [60, 60, 60],
              ang,
              { y: 0, x: 0 },
              attr,
              false,
              false
            );
          }.bind(this)
        );
      }

      if (uplodedFeatures.shapeFeatures.block) {
        uplodedFeatures.shapeFeatures.block.forEach(
          function (block) {
            if (block.spatialReference && !block.spatialReference.wkid) {
              block.spatialReference = this.map.spatialReference;
            }
            var feature = new esri.geometry.Polygon(block);

            _.filter(uplodedFeatures.annotations, function (d) {
              return d.layer == "block";
            }).forEach(function (annotation) {
              if (feature.contains && feature.contains(annotation.shape)) {
                block.text = annotation.text;
              }
            });

            addGraphicToLayer(
              feature,
              this.map,
              "detailedGraphicLayer",
              [0, 255, 0],
              null,
              null,
              null,
              null,
              null,
              true,
              null,
              null,
              false
            );
          }.bind(this)
        );
      }

      this.state.TotalParcelArea = 0;

      var legends = [];
      var isValidCad = true;
      var cadErrors = {};

      // uplodedFeatures.shapeFeatures.landbase =
      //   uplodedFeatures.shapeFeatures.landbase.sort(function (a, b) {
      //     var lowerCaseA;
      //     var lowerCaseB;
      //     if (a.number && b.number) {
      //       lowerCaseA = a.number.toLocaleLowerCase();
      //       lowerCaseB = b.number.toLocaleLowerCase();
      //       return lowerCaseA.localeCompare(lowerCaseB);
      //     }
      //   });
      // console.log(uplodedFeatures.shapeFeatures.landbase);
      uplodedFeatures.shapeFeatures.landbase.forEach(
        function (landbase) {
          if (!landbase.spatialReference.wkid) {
            landbase.spatialReference = this.map.spatialReference;
          }
          var feature = new esri.geometry.Polygon(landbase);
          var color = [0, 255, 255];

          this.state.TotalParcelArea += landbase.area;

          _.filter(uplodedFeatures.annotations, function (d) {
            return d.layer == "landbase";
          }).forEach(
            function (annotation) {
              if (feature.contains && feature.contains(annotation.shape)) {
                landbase.text = annotation.text;
                var res = annotation.text.split("@");

                if (
                  annotation.text.indexOf("@") < 0 &&
                  isNaN(annotation.text)
                ) {
                } else {
                  if (
                    res.length != 3 &&
                    res.length == 1 &&
                    (res[0] < 12 || res[0] > 29)
                  ) {
                    cadErrors["parcels"] =
                      "يجب ان تحتوى الأراضي على رقم الأرض - الاستخدام التفصيلي - رمز الاستخدام";
                    isValidCad = false;
                    return;
                  }

                  landbase.north_length = 0;
                  landbase.south_length = 0;
                  landbase.weast_length = 0;
                  landbase.east_length = 0;

                  if (res.length == 1) {
                    landbase.usingSymbol = res[0].replace(/ /g, "");
                    landbase.useDetails = res[0].replace(/ /g, "");
                  } else {
                    landbase.number = res[0];
                    landbase.useDetails = res[1];

                    if (res.length > 2) {
                      landbase.usingSymbol = res[2].replace(/ /g, "");
                      if (getUsingSymbol(res[2].replace(/ /g, "")))
                        landbase.usingSymbolName = getUsingSymbol(
                          res[2].replace(/ /g, "")
                        ).name;
                      else if (getUsingSymbol(res[2]))
                        landbase.usingSymbolName = getUsingSymbol(res[2]).name;
                      else {
                        res.reverse();

                        landbase.number = res[0];
                        landbase.useDetails = res[1];
                        landbase.usingSymbol = res[2].replace(/ /g, "");

                        if (getUsingSymbol(res[2].replace(/ /g, "")))
                          landbase.usingSymbolName = getUsingSymbol(
                            res[2].replace(/ /g, "")
                          ).name;
                        else if (getUsingSymbol(res[2]))
                          landbase.usingSymbolName = getUsingSymbol(
                            res[2]
                          ).name;
                        else {
                          cadErrors["usingSymbol"] =
                            "رمز الاستخدام غير صحيح لأرض رقم " +
                            landbase.usingSymbol;
                          isValidCad = false;
                          return;
                        }
                      }
                    }
                  }

                  servicesTypes.forEach(function (type) {
                    var subType = _.find(type.cad_sublayers, function (d) {
                      return d.symbol_id == landbase.useDetails;
                    });

                    if (subType) {
                      var f = legends.find(function (x) {
                        return x.id == type.id;
                      });
                      if (!f) legends.push(type);

                      landbase.subType = subType;
                      color = type.layer_color;

                      if (!color) color = [0, 255, 255];

                      landbase.typeName = type.layer_description;
                      landbase.typeId = type.symbol_id;
                      landbase.is_cut = type.is_cut;
                      landbase.is_notfees = type.is_notfees;
                    }
                  });

                  if (!landbase.subType) {
                    var type = _.find(servicesTypes, function (d) {
                      return d.symbol_id == landbase.useDetails;
                    });

                    if (type) {
                      var f = legends.find(function (x) {
                        return x.id == type.id;
                      });
                      if (!f) legends.push(type);
                      landbase.is_cut = type.is_cut;
                      landbase.is_notfees = type.is_notfees;
                      landbase.typeName = type.layer_description;
                      landbase.typeId = type.symbol_id;
                      color = type.layer_color;
                      if (!color) color = [0, 255, 255];
                    } else {
                      if (landbase.typeId != 23 && res.length != 1) {
                        cadErrors["useDetails"] =
                          "الاستخدام التفصيلي غير صحيح لأرض رقم " +
                          landbase.number;
                        isValidCad = false;
                        return;
                      }
                    }
                  }
                }
              }
            }.bind(this)
          );
        }.bind(this)
      );

      this.state.streetsAnnotation = [];

      uplodedFeatures.shapeFeatures.landbase.forEach(
        function (landbase) {
          if (!landbase.spatialReference.wkid) {
            landbase.spatialReference = this.map.spatialReference;
          }
          var feature = new esri.geometry.Polygon(landbase);
          var color = [0, 255, 255];

          _.filter(uplodedFeatures.annotations, function (d) {
            return d.layer == "landbase";
          }).forEach(
            function (annotation) {
              if (feature.contains && feature.contains(annotation.shape)) {
                landbase.text = annotation.text;
                var res = annotation.text.split("@");

                if (
                  annotation.text.indexOf("@") < 0 &&
                  isNaN(annotation.text)
                ) {
                  this.state.streetsAnnotation.push({
                    feature: annotation.shape,
                    text: annotation.text,
                    angle: annotation.angle,
                  });
                  //break;
                } else {
                  if (
                    res.length != 3 &&
                    res.length == 1 &&
                    (res[0] < 12 || res[0] > 29)
                  ) {
                    cadErrors["parcels"] =
                      "يجب ان تحتوى الأراضي على رقم الأرض - الاستخدام التفصيلي - رمز الاستخدام";
                    isValidCad = false;
                    return;
                  }

                  landbase.north_length = 0;
                  landbase.south_length = 0;
                  landbase.weast_length = 0;
                  landbase.east_length = 0;

                  if (res.length == 1) {
                    landbase.usingSymbol = res[0].replace(/ /g, "");
                    landbase.useDetails = res[0].replace(/ /g, "");
                  } else {
                    landbase.number = res[0];
                    landbase.useDetails = res[1];

                    if (res.length > 2) {
                      landbase.usingSymbol = res[2].replace(/ /g, "");

                      if (getUsingSymbol(res[2].replace(/ /g, "")))
                        landbase.usingSymbolName = getUsingSymbol(
                          res[2].replace(/ /g, "")
                        ).name;
                      else if (getUsingSymbol(res[2]))
                        landbase.usingSymbolName = getUsingSymbol(res[2]).name;
                      else {
                        res.reverse();

                        landbase.number = res[0];
                        landbase.useDetails = res[1];
                        landbase.usingSymbol = res[2].replace(/ /g, "");

                        if (getUsingSymbol(res[2].replace(/ /g, "")))
                          landbase.usingSymbolName = getUsingSymbol(
                            res[2].replace(/ /g, "")
                          ).name;
                        else if (getUsingSymbol(res[2]))
                          landbase.usingSymbolName = getUsingSymbol(
                            res[2]
                          ).name;
                        else {
                          cadErrors["usingSymbol"] =
                            "رمز الاستخدام غير صحيح لأرض رقم " +
                            landbase.usingSymbol;
                          isValidCad = false;
                          return;
                        }
                      }
                    }
                  }

                  servicesTypes.forEach(function (type) {
                    var subType = _.find(type.cad_sublayers, function (d) {
                      return d.symbol_id == landbase.useDetails;
                    });

                    if (subType) {
                      var f = legends.find(function (x) {
                        return x.id == type.id;
                      });
                      if (!f) legends.push(type);

                      landbase.subType = subType;
                      color = type.layer_color;

                      if (!color) color = [0, 255, 255];

                      landbase.typeName = type.layer_description;
                      landbase.typeId = type.symbol_id;
                      landbase.is_cut = type.is_cut;
                      landbase.is_notfees = type.is_notfees;
                    }
                  });

                  if (!landbase.subType) {
                    var type = _.find(servicesTypes, function (d) {
                      return d.symbol_id == landbase.useDetails;
                    });

                    if (type) {
                      var f = legends.find(function (x) {
                        return x.id == type.id;
                      });
                      if (!f) legends.push(type);
                      landbase.is_cut = type.is_cut;
                      landbase.is_notfees = type.is_notfees;
                      landbase.typeName = type.layer_description;
                      landbase.typeId = type.symbol_id;
                      color = type.layer_color;
                      if (!color) color = [0, 255, 255];
                    } else {
                      if (landbase.typeId != 23 && res.length != 1) {
                        cadErrors["useDetails"] =
                          "الاستخدام التفصيلي غير صحيح لأرض رقم " +
                          landbase.number;
                        isValidCad = false;
                        return;
                      }
                    }
                  }
                }
              }

              //calculate street width
              if (
                landbase.typeName == "شوارع" ||
                landbase.typeName == "مواقف" ||
                landbase.typeName == "ممرات مشاة"
              ) {
                var streetLines = [];
                landbase.isHide = true;
                var min = 0;
                var max = 0;
                for (var j = 0, n = landbase.rings[0].length - 1; j < n; j++) {
                  var point1 = new esri.geometry.Point(
                    landbase.rings[0][j][0],
                    landbase.rings[0][j][1]
                  );
                  var point2 = new esri.geometry.Point(
                    landbase.rings[0][j + 1][0],
                    landbase.rings[0][j + 1][1]
                  );

                  var length = esri.geometry.getLength(point1, point2);
                  length = Number(parseFloat(length)?.toFixed(2));
                  var path = {
                    paths: [[landbase.rings[0][j], landbase.rings[0][j + 1]]],
                    text: length,
                    spatialReference: landbase.spatialReference,
                  };

                  streetLines.push(path);
                }

                this.state.maxLines = this.getMaxTwoLinesLength(streetLines);
                var polyline1 = new esri.geometry.Polyline(
                  this.state.maxLines[0]
                );
                var polyline2 = new esri.geometry.Polyline(
                  this.state.maxLines[1]
                );
                var ptLine1 = polyline1.getExtent().getCenter();
                var ptLine2 = polyline2.getExtent().getCenter();

                landbase.length = this.state.maxLines[0].text;
                landbase.width = +esri.geometry
                  .getLength(ptLine1, ptLine2)
                  .toPrecision(2);
                if (landbase.typeName == "شوارع")
                  landbase.number = " م" + landbase.width + " ضرع عراش";
              }
            }.bind(this)
          );

          if (landbase.usingSymbol == "خ" && landbase.typeName == "حدائق") {
            landbase.number = landbase.number + "م ";
          } else if (landbase.usingSymbol == "خ") {
            landbase.number = landbase.number + "خ ";
          }

          landbase.north_points = [];
          landbase.south_points = [];
          landbase.weast_points = [];
          landbase.east_points = [];

          var min = 0;
          var max = 0;
          for (var j = 0, n = landbase.rings[0].length - 1; j < n; j++) {
            // var info = this.computeLineAngle(
            //   landbase.rings[0][j],
            //   landbase.rings[0][j + 1],
            //   feature.getExtent().getCenter(),
            //   feature
            // );

            var point1 = new esri.geometry.Point(
              landbase.rings[0][j][0],
              landbase.rings[0][j][1]
            );
            var point2 = new esri.geometry.Point(
              landbase.rings[0][j + 1][0],
              landbase.rings[0][j + 1][1]
            );

            if (point1.x > max) {
              max = point1.x;
              landbase.maxPoint = point1;
            }

            if (!min || point1.x < min) {
              min = point1.x;
              landbase.minPoint = point1;
            }

            if (point2.x > max) {
              max = point2.x;
              landbase.maxPoint = point2;
            }

            if (!min || point2.x < min) {
              min = point2.x;
              landbase.minPoint = point2;
            }
            let info = computePointDirection(
              landbase,
              landbase.rings[0][j],
              landbase.rings[0][j + 1],
              landbase
            );

            if (info.direction == "north") {
              landbase.north_length =
                (landbase.north_length || 0) + info.length;
              landbase.north_points.push([
                landbase.rings[0][j],
                landbase.rings[0][j + 1],
              ]);
            } else if (info.direction == "south") {
              landbase.south_length =
                (landbase.south_length || 0) + info.length;
              landbase.south_points.push([
                landbase.rings[0][j],
                landbase.rings[0][j + 1],
              ]);
            } else if (info.direction == "east") {
              landbase.east_length = (landbase.east_length || 0) + info.length;
              landbase.east_points.push([
                landbase.rings[0][j],
                landbase.rings[0][j + 1],
              ]);
            } else {
              landbase.weast_length =
                (landbase.weast_length || 0) + info.length;
              landbase.weast_points.push([
                landbase.rings[0][j],
                landbase.rings[0][j + 1],
              ]);
            }
          }

          landbase.weast_center_point = null;
          if (landbase.weast_points.length >= 1) {
            var weast_polyline = {
              paths: landbase.weast_points,
              spatialReference: this.map.spatialReference,
            };
            var weast_polyline = new esri.geometry.Polyline(weast_polyline);
            landbase.weast_center_point = weast_polyline
              .getExtent()
              .getCenter();
          }

          landbase.north_center_point = null;
          if (landbase.north_points.length >= 1) {
            var north_polyline = {
              paths: landbase.north_points,
              spatialReference: this.map.spatialReference,
            };
            var north_polyline = new esri.geometry.Polyline(north_polyline);
            landbase.north_center_point = north_polyline
              .getExtent()
              .getCenter();
          }

          landbase.east_center_point = null;
          if (landbase.east_points.length >= 1) {
            var east_polyline = {
              paths: landbase.east_points,
              spatialReference: this.map.spatialReference,
            };
            var east_polyline = new esri.geometry.Polyline(east_polyline);
            landbase.east_center_point = east_polyline.getExtent().getCenter();
          }

          landbase.south_center_point = null;
          if (landbase.south_points.length >= 1) {
            var south_polyline = {
              paths: landbase.south_points,
              spatialReference: this.map.spatialReference,
            };
            var south_polyline = new esri.geometry.Polyline(south_polyline);
            landbase.south_center_point = south_polyline
              .getExtent()
              .getCenter();
          }

          landbase.is_north_front = true;
          landbase.is_south_front = true;
          landbase.is_east_front = true;
          landbase.is_weast_front = true;

          uplodedFeatures.shapeFeatures.landbase
            .filter(function (land) {
              return (
                land.typeName != "شوارع" &&
                land.typeName != "مواقف" &&
                land.typeName != "ممرات مشاة"
              );
            })
            .forEach(
              function (temp_landbase) {
                if (!temp_landbase.spatialReference.wkid) {
                  temp_landbase.spatialReference = this.map.spatialReference;
                }
                var feature = new esri.geometry.Polygon(temp_landbase);

                for (
                  var j = 0, n = temp_landbase.rings[0].length - 1;
                  j < n;
                  j++
                ) {
                  if (!this.compareTwoFeatures(landbase, temp_landbase)) {
                    var path = {
                      paths: [
                        [
                          temp_landbase.rings[0][j],
                          temp_landbase.rings[0][j + 1],
                        ],
                      ],
                      spatialReference: this.map.spatialReference,
                    };

                    var polyline = new esri.geometry.Polyline(path);
                    var pt = polyline.getExtent().getCenter();

                    if (
                      landbase.north_center_point != null &&
                      landbase.north_center_point.x == pt.x &&
                      landbase.north_center_point.y == pt.y
                    ) {
                      landbase.is_north_front = false;
                    }

                    if (
                      landbase.south_center_point != null &&
                      landbase.south_center_point.x == pt.x &&
                      landbase.south_center_point.y == pt.y
                    ) {
                      landbase.is_south_front = false;
                    }

                    if (
                      landbase.east_center_point != null &&
                      landbase.east_center_point.x == pt.x &&
                      landbase.east_center_point.y == pt.y
                    ) {
                      landbase.is_east_front = false;
                    }

                    if (
                      landbase.weast_center_point != null &&
                      landbase.weast_center_point.x == pt.x &&
                      landbase.weast_center_point.y == pt.y
                    ) {
                      landbase.is_weast_front = false;
                    }
                  }
                }
              }.bind(this)
            );

          if (!landbase.frontLength) {
            landbase.frontLength = 0;

            if (landbase.is_east_front) {
              landbase.frontLength = landbase.east_length;
            }
            if (landbase.is_north_front) {
              if (landbase.north_length > landbase.frontLength)
                landbase.frontLength = landbase.north_length;
            }
            if (landbase.is_south_front) {
              if (landbase.south_length > landbase.frontLength)
                landbase.frontLength = landbase.south_length;
            }
            if (landbase.is_weast_front) {
              if (landbase.weast_length > landbase.frontLength)
                landbase.frontLength = landbase.weast_length;
            }

            landbase.frontLength = (+landbase?.frontLength)?.toFixed(2);
          }

          let textcolor = [255, 255, 255];

          if (landbase.usingSymbol && landbase.usingSymbol.indexOf("س") > -1) {
            textcolor = [0, 0, 0];
          }
          if (
            landbase.typeName == "مواقف" ||
            landbase.typeName == "ممرات مشاة"
          ) {
            textcolor = [0, 0, 0];
            color = [255, 255, 255];
          }

          if (landbase.subType && landbase.subType.sublayer_description) {
            var attr = {
              text: landbase.subType.sublayer_description,
              angle: -15,
            };

            addParcelNo(
              feature.getExtent().getCenter(),
              this.map,
              convertToArabic(landbase.subType.sublayer_description),
              "PacrelNoGraphicLayer",
              12,
              textcolor,
              -15,
              { y: -10, x: 0 },
              attr,
              false,
              false
            );
          } else if (
            landbase.usingSymbol &&
            landbase.usingSymbol.indexOf("س") < 0 &&
            landbase.typeName &&
            landbase.typeName.indexOf("شوارع") < 0
          ) {
            if (
              landbase.typeName == "مواقف" ||
              landbase.typeName == "ممرات مشاة"
            ) {
              moacount++;

              ang =
                360 -
                computeStreetAngle(
                  this.state.maxLines[0].paths[0][0],
                  this.state.maxLines[0].paths[0][1],
                  feature.getExtent().getCenter()
                );

              var attr = {
                text:
                  landbase.typeName +
                  " " +
                  "م" +
                  " " +
                  (landbase.typeName != "ممرات مشاة" ? moacount : ""),
                angle: ang,
              };

              addParcelNo(
                feature.getExtent().getCenter(),
                this.map,
                convertToArabic(
                  landbase.typeName +
                    " " +
                    "م" +
                    " " +
                    (landbase.typeName != "ممرات مشاة" ? moacount : "")
                ),
                "PacrelNoGraphicLayer",
                12,
                textcolor,
                ang,
                { y: 0, x: 0 },
                attr,
                false,
                false
              );
            } else if (landbase.typeName == "مناطق مفتوحة") {
              var attr = {
                text: landbase.typeName + " " + "م" + " " + moacount,
                angle: -15,
              };

              addParcelNo(
                feature.getExtent().getCenter(),
                this.map,
                convertToArabic(landbase.typeName + " " + "م" + " " + moacount),
                "PacrelNoGraphicLayer",
                12,
                textcolor,
                -15,
                { y: -10, x: 0 },
                attr,
                false,
                false
              );
            } else {
              var attr = {
                text: landbase.typeName,
                angle: -15,
              };

              addParcelNo(
                feature.getExtent().getCenter(),
                this.map,
                convertToArabic(landbase.typeName),
                "PacrelNoGraphicLayer",
                12,
                textcolor,
                -15,
                { y: -10, x: 0 },
                attr,
                false,
                false
              );
            }
          }
          if (landbase.number) {
            var ang = -15;
            if (landbase.typeName == "شوارع") {
              color = [255, 255, 255];
            } else {
              ang = -15;

              var attr = {
                text: convertToArabic(landbase.number),
                angle: -15,
              };

              addParcelNo(
                feature.getExtent().getCenter(),
                this.map,
                convertToArabic(landbase.number),
                "PacrelNoGraphicLayer",
                12,
                textcolor,
                ang,
                { y: 0, x: 0 },
                attr,
                false,
                false
              );
            }
          }

          if (landbase.typeId && getLayer("G" + landbase.typeId, this.map, 8)) {
            addGraphicToLayer(
              feature,
              this.map,
              "Layer_G" + landbase.typeId,
              null,
              color,
              null,
              () => {
                // zoomToLayer(
                //   "Layer_G" + landbase.typeId,
                //   this.map,
                //   this.state["zoomRatio"]
                // );
                resizeMap(this.map);
              },
              null,
              null,
              false,
              null,
              null,
              false
            );
          } else {
            addGraphicToLayer(
              feature,
              this.map,
              "detailedGraphicLayer",
              null,
              color,
              null,
              () => {
                // zoomToLayer(
                //   "detailedGraphicLayer",
                //   this.map,
                //   this.state["zoomRatio"]
                // );
                resizeMap(this.map);
              },
              null,
              null,
              false,
              null,
              null,
              false
            );
          }
        }.bind(this)
      );

      for (var j = 0; j < this.state.streetsAnnotation.length; j++) {
        var extractNmber =
          this.state.streetsAnnotation[j].text.match(/[\d\.]+/);

        if (extractNmber && extractNmber.length > 0) {
          extractNmber = extractNmber[0];
          this.state.streetsAnnotation[j].text = this.state.streetsAnnotation[
            j
          ].text.replace(extractNmber, extractNmber);
        } else {
          extractNmber = this.state.streetsAnnotation[j].text;
        }

        if (!this.state.streetsAnnotation[j].feature.spatialReference.wkid) {
          this.state.streetsAnnotation[j].feature.spatialReference.wkid =
            this.map.spatialReference.wkid;
        }

        var attr = {
          text: this.state.streetsAnnotation[j].text,
          angle: 360 - this.state.streetsAnnotation[j].angle,
        };

        addParcelNo(
          this.state.streetsAnnotation[j].feature,
          this.map,
          this.state.streetsAnnotation[j].text,
          "PacrelNoGraphicLayer",
          12,
          [0, 0, 0],
          360 - this.state.streetsAnnotation[j].angle,
          { y: 0, x: 0 },
          attr,
          true,
          false
        );
      }

      var maxCount = 0;
      var usingSymbolObj = _(uplodedFeatures.shapeFeatures.landbase)
        .toArray()
        .groupBy("usingSymbol")
        .value();
      Object.keys(usingSymbolObj)
        .filter(function (d) {
          return d && d != "undefined";
        })
        .forEach(
          function (ele, key) {
            if (
              ele.startsWith("س") ||
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
                this.state["planUsingSymbol"] =
                  "رمز استعمال المخطط " + "( " + ele + " )";
              }
            }
          }.bind(this)
        );

      if (
        !isValidCad &&
        !this.props.mainObject.submission_data.mostafed_data.e3adt_tanzem
      ) {
        this.state.hideAll = true;
        Object.keys(cadErrors).forEach((f) => {
          window.notifySystem("error", cadErrors[f], 10);
        });

        this.state.uplodedFeatures[this.state.selectedCADIndex] = null;
        this.props.change(
          `plansData.image_uploader${this.state.selectedCADIndex + 1}`,
          ""
        );
        this.state.plans = [];
        for (var i = 0; i < this.state.uplodedFeatures.length; i++) {
          if (this.state.uplodedFeatures[i]) {
            this.state.selectedCADIndex = i;
            var currentPlan =
              i == 0 ? "perfectCad" : i == 1 ? "secondCad" : "thirdCad";
            this.state.selectedCAD = currentPlan;
            this.state.plans.push(currentPlan);
          } else {
            break;
          }
        }

        this.setBuildingCondition(
          this.state.uplodedFeatures[this.state.selectedCADIndex]
        ).then((response) => {
          this.init(this.state.selectedCADIndex);
        });

        return;
      } else {
        this.state.hideAll = false;
      }

      this.state.servicesTypes = legends;
      this.state["markall"] = { isVisibile: true };
      this.state.servicesTypes.unshift({
        cad_sublayers: null,
        id: "markall",
        is_cut: 1,
        layer_code: 210,
        layer_color: "",
        layer_description: "تحديد الكل",
        sort_id: 1000,
        symbol_id: "markall",
      });

      this.state.streets =
        (this.state.streets?.length && this.state?.streets) ||
        uplodedFeatures.shapeFeatures.landbase.filter((d) => {
          return d.typeName == "شوارع";
        });

      //if (!this.isLoaded) {
      let selectedPlan =
        this.state.uplodedFeatures[this.state.selectedCADIndex];
      this.state.statisticsParcels = this.updateStatisticParcels(selectedPlan);
      var values = {
        isInvestalIncluded: this.state.isInvestalIncluded,
        statisticsParcels: this.state.statisticsParcels,
        enableDownlaodCad: uplodedFeatures.cad_path ? true : false,
        planDescription: this.state.planDescription,
        streets: this.state.streets,
        detailsParcelTypes: this.state.detailsParcelTypes,
        uplodedFeatures: this.state.uplodedFeatures,
        streetsAnnotation: this.state.streetsAnnotation,
        serviceSubType: this.state.serviceSubType,
        serviceType: this.state.serviceType,
        selectedCAD: this.state.selectedCAD,
        selectedCADIndex: this.state.selectedCADIndex,
        planUsingSymbol: this.state.planUsingSymbol,
        hide_details: false,
        servicesTypes: this.state.servicesTypes,
        servicesSubTypes: this.state.servicesSubTypes,
        TotalParcelArea: this.state.TotalParcelArea,
        current_step: this.state.current_step,
      };

      var additionalValues = {
        totalParcelPage:
          //.filter((parcel) => parcel.is_cut != 2)
          this.state.uplodedFeatures[this.state.selectedCADIndex].shapeFeatures
            .landbase.length / this.pageSize,
        totalInvestalParcelPage:
          this.state.uplodedFeatures[
            this.state.selectedCADIndex
          ].shapeFeatures.landbase.filter((parcel) => parcel.is_cut == 2)
            .length / this.pageSize,
        minParcelIndex: 0,
        maxParcelIndex: this.pageSize,
        minInvestalParcelIndex: 0,
        maxInvestalParcelIndex: this.pageSize,
        totalStreetPage: this.state.streets.length / this.pageSize,
        minStreetIndex: 0,
        maxStreetIndex: this.pageSize,
      };

      this.props.input.onChange({
        ...values,
        ...additionalValues,
      });

      this.setState({
        ...values,
        ...additionalValues,
      });
      // } else {
      //   this.isLoaded = false;
      //   this.setState({});
      // }
    }
  };

  // updateStatisticParcels = (uplodedFeatures) => {
  //   //statistics استعمالات
  //   let statisticsParcels = [];
  //   var pacrelTypes = _.chain(uplodedFeatures?.shapeFeatures?.landbase)
  //     ?.sortBy(
  //       function (d) {
  //         var found = _.find(this.state.servicesTypes, function (v) {
  //           return v.symbol_id == d.typeId;
  //         });
  //         return found && found.sort_id ? found.sort_id : 100;
  //       }.bind(this)
  //     )
  //     ?.groupBy("typeName");

  //   this.state.detailsParcelTypes = pacrelTypes
  //     ?.map(function (list, key) {
  //       return {
  //         key: key,
  //         usingTypeArea: _.reduce(
  //           list,
  //           function (memo, d) {
  //             return memo + +d.area;
  //           },
  //           0
  //         ),
  //         value: _.chain(list)
  //           .groupBy(function (d) {
  //             return d.subType && d.subType.sublayer_code;
  //           })
  //           .map(function (list, key) {
  //             return {
  //               key: key,
  //               value: list,
  //               total_area: _.reduce(
  //                 list,
  //                 function (memo, d) {
  //                   return memo + +d.area;
  //                 },
  //                 0
  //               ),
  //             };
  //           })
  //           .value(),
  //       };
  //     })
  //     ?.value();
  //   pacrelTypes = pacrelTypes?.value();
  //   var msa7y_area = _.chain(
  //     this.props.mainObject?.data_msa7y?.msa7yData?.cadDetails
  //       ?.suggestionsParcels
  //   )
  //     ?.reduce(function (a, b) {
  //       return a + +b.area;
  //     }, 0)
  //     ?.value();
  //   Object.keys(pacrelTypes)?.forEach(
  //     function (parcelTypeKey) {
  //       var area = pacrelTypes[parcelTypeKey]
  //         .map(function (p) {
  //           return p.area;
  //         })
  //         .reduce(function (a, b) {
  //           return a + b;
  //         });
  //       statisticsParcels.push({
  //         name: parcelTypeKey,
  //         area: area,
  //         is_cut: pacrelTypes[parcelTypeKey][0].is_cut,
  //         areaPercentage:
  //           (area /
  //             ((this.props.mainObject.submission_data.mostafed_data
  //               .e3adt_tanzem &&
  //               msa7y_area) ||
  //               this.state.TotalParcelArea)) *
  //           100,
  //       });
  //     }.bind(this)
  //   );
  //   //

  //   calculateSchemanticProportions(
  //     uplodedFeatures,
  //     statisticsParcels,
  //     this.state.TotalParcelArea,
  //     this.props.mainObject
  //   );
  //   // this.state.statisticsParcels.push({
  //   //   name: "خدمات",
  //   //   area: this.state.statisticsParcels
  //   //     .filter(function (st) {
  //   //       return st.name.indexOf("خدمات") > -1;
  //   //     })
  //   //     .reduce(function (a, b) {
  //   //       return a + +b.area;
  //   //     }, 0),
  //   //   areaPercentage: this.state.statisticsParcels
  //   //     .filter(function (st) {
  //   //       return st.name.indexOf("خدمات") > -1;
  //   //     })
  //   //     .reduce(function (a, b) {
  //   //       return a + +b.areaPercentage;
  //   //     }, 0),
  //   // });

  //   return statisticsParcels;
  // };

  updateStatisticParcels = (uplodedFeatures) => {
    //statistics استعمالات
    let statisticsParcels = [];
    var pacrelTypes = _.chain(uplodedFeatures?.shapeFeatures?.landbase)
      ?.sortBy(
        function (d) {
          var found = _.find(this.state.servicesTypes, function (v) {
            return v.symbol_id == d.typeId;
          });
          return found && found.sort_id ? found.sort_id : 100;
        }.bind(this)
      )
      ?.groupBy("typeName");

    this.state.detailsParcelTypes = pacrelTypes
      ?.map(function (list, key) {
        return {
          key: key,
          usingTypeArea: _.reduce(
            list,
            function (memo, d) {
              return memo + +d.area;
            },
            0
          ),
          value: _.chain(list)
            .groupBy(function (d) {
              return d.subType && d.subType.sublayer_code;
            })
            .map(function (list, key) {
              return {
                key: key,
                value: list,
                total_area: _.reduce(
                  list,
                  function (memo, d) {
                    return memo + +d.area;
                  },
                  0
                ),
              };
            })
            .value(),
        };
      })
      ?.value();
    pacrelTypes = pacrelTypes?.value();
    var msa7y_area = _.chain(
      this.props.mainObject?.data_msa7y?.msa7yData?.cadDetails
        ?.suggestionsParcels
    )
      ?.reduce(function (a, b) {
        return a + +b.area;
      }, 0)
      ?.value();
    Object.keys(pacrelTypes)?.forEach(
      function (parcelTypeKey) {
        var area = pacrelTypes[parcelTypeKey]
          .map(function (p) {
            return p.area;
          })
          .reduce(function (a, b) {
            return a + b;
          });
        statisticsParcels.push({
          name: parcelTypeKey,
          area: area,
          is_cut: pacrelTypes[parcelTypeKey][0].is_cut,
          is_notfees: pacrelTypes[parcelTypeKey][0].is_notfees,
          areaPercentage:
            (area /
              ((this.props.mainObject.submission_data.mostafed_data
                .e3adt_tanzem &&
                msa7y_area) ||
                this.state.TotalParcelArea)) *
            100,
        });
      }.bind(this)
    );
    //

    calculateSchemanticProportions(
      uplodedFeatures,
      statisticsParcels,
      this.state.TotalParcelArea,
      this.props.mainObject
    );
    // this.state.statisticsParcels.push({
    //   name: "خدمات",
    //   area: this.state.statisticsParcels
    //     .filter(function (st) {
    //       return st.name.indexOf("خدمات") > -1;
    //     })
    //     .reduce(function (a, b) {
    //       return a + +b.area;
    //     }, 0),
    //   areaPercentage: this.state.statisticsParcels
    //     .filter(function (st) {
    //       return st.name.indexOf("خدمات") > -1;
    //     })
    //     .reduce(function (a, b) {
    //       return a + +b.areaPercentage;
    //     }, 0),
    // });

    return statisticsParcels;
  };

  handleParcelChange = (page) => {
    this.setState({
      currentParcelPage: page,
      minParcelIndex: (page - 1) * this.pageSize,
      maxParcelIndex: page * this.pageSize,
    });
  };

  handleInvestalParcelChange = (page) => {
    this.setState({
      currentInvestalParcelPage: page,
      minInvestalParcelIndex: (page - 1) * this.pageSize,
      maxInvestalParcelIndex: page * this.pageSize,
    });
  };
  handleStreetChange = (page) => {
    this.setState({
      currentStreetPage: page,
      minStreetIndex: (page - 1) * this.pageSize,
      maxStreetIndex: page * this.pageSize,
    });
  };

  investalChange = (statisticsParcels, parcel, val) => {
    const {
      input: { value },
    } = this.props;

    parcel.isInvestalIncluded = val;
    let index = statisticsParcels.findIndex((p) => p.name == parcel.name);
    if (index != -1) {
      statisticsParcels[index] = parcel;
    }
    let values = {
      statisticsParcels: statisticsParcels,
    };

    this.setState(values);
    this.props.input.onChange({ ...value, ...values });
  };

  changeVisibilty = (layerName, isVisibile) => {
    var checkboxs = {};
    if (layerName == "markall") {
      this.state["markall"] = this.state["markall"] || {};
      this.state["markall"].isVisibile = !this.state["markall"].isVisibile;

      this.state.servicesTypes.forEach(
        function (service) {
          if (this.map.getLayer("Layer_G" + service.symbol_id))
            this.map
              .getLayer("Layer_G" + service.symbol_id)
              .setOpacity(this.state["markall"].isVisibile ? 1 : 0);

          checkboxs[service.symbol_id + "_visbility"] = this.state["markall"]
            .isVisibile
            ? 1
            : 0;
        }.bind(this)
      );

      if (this.map.getLayer("PacrelNoGraphicLayer"))
        this.map
          .getLayer("PacrelNoGraphicLayer")
          .setOpacity(this.state["markall"].isVisibile ? 1 : 0);
    } else {
      if (this.map.getLayer("Layer_G" + layerName))
        this.map.getLayer("Layer_G" + layerName).setOpacity(isVisibile ? 1 : 0);

      checkboxs[layerName + "_visbility"] = isVisibile ? 1 : 0;
    }

    this.setState({ ...checkboxs });
  };

  zoom = function (feature) {
    feature.type = "polygon";
    highlightFeature({ geometry: feature }, this.map, {
      layerName: "highlightGraphicLayer",
      isZoom: true,
      zoomFactor: 20,
      isHiglightSymbol: true,
      highlighColor: [0, 255, 255, 0.5],
    });
  };

  highlight = function (feature) {
    feature.type = "polygon";
    highlightFeature({ geometry: feature }, this.map, {
      layerName: "highlightBoundriesGraphicLayer",
      isZoom: false,
      highlighColor: [0, 255, 255],
    });
  };

  clearHighlight = (feature) => {
    clearGraphicFromLayer(this.map, "highlightBoundriesGraphicLayer");
  };

  componentDidUpdate() {
    const { input, mainObject } = this.props;
    if (input.value && input.value != "" && input.value.justInvoked) {
      this.state.plans = [];
      input.value.justInvoked = false;
      this.isLoaded = false;
      this.map = getMap();

      if (
        !this.state.uplodedFeatures ||
        (Array.isArray(this.state.uplodedFeatures) &&
          this.state.uplodedFeatures.length == 0)
      ) {
        this.state.uplodedFeatures = [];
        this.state.uplodedFeatures.push(
          (!isEmpty(input.value.perfectCad) && input.value.perfectCad) || null
        );
        this.state.uplodedFeatures.push(
          (!isEmpty(input.value.secondCad) && input.value.secondCad) || null
        );
        this.state.uplodedFeatures.push(
          (!isEmpty(input.value.thirdCad) && input.value.thirdCad) || null
        );
      } else {
        this.state.uplodedFeatures[0] =
          (!isEmpty(input.value.perfectCad) && input.value.perfectCad) || null;
        this.state.uplodedFeatures[1] =
          (!isEmpty(input.value.secondCad) && input.value.secondCad) || null;
        this.state.uplodedFeatures[2] =
          (!isEmpty(input.value.thirdCad) && input.value.thirdCad) || null;
      }

      this.state.hide_details = input.value.hide_details || false;

      for (var i = 0; i < this.state.uplodedFeatures.length; i++) {
        if (this.state.uplodedFeatures[i]) {
          this.state.selectedCADIndex = i;
          var currentPlan =
            i == 0 ? "perfectCad" : i == 1 ? "secondCad" : "thirdCad";
          this.state.selectedCAD = currentPlan;
          this.state.plans.push(currentPlan);
        } else {
          break;
        }
      }

      //if (!this.state.serviceTypes) {
      axios.get(`${host}/CadLayers/GetAll?pageSize=1000`).then(({ data }) => {
        this.state.servicesTypes = data.results;
        this.state.servicesTypes.forEach(function (type) {
          type.layer_color = eval(type.layer_color);
        });

        this.setBuildingCondition(
          this.state.uplodedFeatures[this.state.selectedCADIndex]
        ).then((response) => {
          this.init(this.state.selectedCADIndex);
        });
      });
      //}
      // if (!this.state.serviceTypes) {
      //     axios.get(`${host}/CadLayers/GetAll?pageSize=40`).then(({ data }) => {
      //         this.state.servicesTypes = data.results;
      //         this.state.servicesTypes.forEach(function (type) {
      //             type.layer_color = eval(type.layer_color);
      //         });
      //     });
      // }
      //this.moveBoundries();

      //this.setState({ uplodedFeatures: this.state.uplodedFeatures, selectedCADIndex: this.state.selectedCADIndex, selectedCAD: this.state.selectedCAD });
    } else if (
      this.isLoaded &&
      window.mapInfo &&
      !this.props.values?.mapviewer?.mapGraphics?.length
    ) {
      this.state.plans = [];
      this.map = getMap();
      if (getIsMapLoaded()) {
        setIsMapLoaded(false);
        this.isLoaded = false;
        this.state.servicesLayer = _.filter(
          window.mapInfo.info.$layers.layers,
          function (d) {
            return d.name == "Serivces_Data" || d.name == "Service_Data";
          }
        )[0];
        for (var i = 0; i < this.state.uplodedFeatures.length; i++) {
          if (this.state.uplodedFeatures[i]) {
            this.state.selectedCADIndex = i;
            var currentPlan =
              i == 0 ? "perfectCad" : i == 1 ? "secondCad" : "thirdCad";
            this.state.selectedCAD = currentPlan;
            this.state.plans.push(currentPlan);
          } else {
            break;
          }
        }

        //if (!this.state.serviceTypes) {
        axios.get(`${host}/CadLayers/GetAll?pageSize=1000`).then(({ data }) => {
          this.state.servicesTypes = data.results;
          this.state.servicesTypes.forEach(function (type) {
            type.layer_color = eval(type.layer_color);
          });

          if (this.state.selectedCADIndex != -1) {
            this.setBuildingCondition(
              this.state.uplodedFeatures[this.state.selectedCADIndex]
            ).then((response) => {
              this.init(this.state.selectedCADIndex);
            });
          }
        });
        // }
      }
    } else if (
      this.isLoaded &&
      window.mapInfo &&
      this.props.values?.mapviewer?.mapGraphics?.length
    ) {
      //   this.state.plans = [];
      this.map = getMap();

      if (getIsMapLoaded()) {
        setIsMapLoaded(false);
        this.isLoaded = false;
        //     this.state.servicesLayer = _.filter(
        //       window.mapInfo.info.$layers.layers,
        //       function (d) {
        //         return d.name == "Serivces_Data" || d.name == "Service_Data";
        //       }
        //     )[0];
        for (var i = 0; i < this.state.uplodedFeatures.length; i++) {
          if (this.state.uplodedFeatures[i]) {
            this.state.selectedCADIndex = i;
            var currentPlan =
              i == 0 ? "perfectCad" : i == 1 ? "secondCad" : "thirdCad";
            this.state.selectedCAD = currentPlan;
            this.state.plans.push(currentPlan);
          } else {
            break;
          }
        }

        //this.updateStatisticParcels(this.state.uplodedFeatures[this.state.selectedCADIndex]);
        //     if (!this.state.serviceTypes) {
        //       axios.get(`${host}/CadLayers/GetAll?pageSize=1000`).then(({ data }) => {

        //         this.state.servicesTypes = data.results;
        //         this.state.servicesTypes.forEach(function (type) {
        //           type.layer_color = eval(type.layer_color);
        //         });

        //         if (this.state.selectedCADIndex != -1) {
        //           this.setBuildingCondition(
        //             this.state.uplodedFeatures[this.state.selectedCADIndex]
        //           ).then((response) => {
        //             this.init(this.state.selectedCADIndex);
        //           });
        //         }
        //       });
        //     }
        //   }
      }
    }
    //return true;
  }

  selectPlan = (evt) => {
    const {
      input: { value },
    } = this.props;
    this.state.selectedCAD = evt.target.value;
    this.state.selectedCADIndex =
      evt.target.value.indexOf("first") != -1
        ? 0
        : evt.target.value.indexOf("second") != -1
        ? 1
        : 2;
    this.setState({ hide_details: true });
    this.init(this.state.selectedCADIndex);
  };

  changeBufferDistance = (evt) => {
    this.setState({ bufferDistance: evt.target.value });
  };

  changeNote = (parcel, evt) => {
    const {
      input: { value },
    } = this.props;

    parcel.note = evt.target.value;
    this.setState({ uplodedFeatures: uplodedFeatures });
    this.props.input.onChange({ ...value, uplodedFeatures: uplodedFeatures });
  };

  changeFrontLength = (parcel, evt) => {
    const {
      input: { value },
    } = this.props;

    parcel.frontLength = evt.target.value;
    this.setState({ uplodedFeatures: this.state.uplodedFeatures });
    this.props.input.onChange({
      ...value,
      uplodedFeatures: this.state.uplodedFeatures,
    });
    // onChange
  };

  openPopup = (key, evt) => {
    let { selectedCADIndex, uplodedFeatures } = this.state;
    const {
      input: { value },
    } = this.props;

    let selectedPlan = uplodedFeatures && uplodedFeatures[selectedCADIndex];
    var fields =
      (!selectedPlan.shapeFeatures.landbase[key].survayParcelCutter &&
        this.fields) ||
      this.editFields;
    let scope = this;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: {
            ...selectedPlan.shapeFeatures.landbase[key],
          },
          ok(values) {
            values.cuttes_area = 0;
            if (values.survayParcelCutter.length) {
              if (values.survayParcelCutter[0].NORTH_EAST_DIRECTION) {
                values.cuttes_area +=
                  +values.survayParcelCutter[0].NORTH_EAST_DIRECTION;
              }
              if (values.survayParcelCutter[0].NORTH_WEST_DIRECTION) {
                values.cuttes_area +=
                  +values.survayParcelCutter[0].NORTH_WEST_DIRECTION;
              }
              if (values.survayParcelCutter[0].SOUTH_EAST_DIRECTION) {
                values.cuttes_area +=
                  +values.survayParcelCutter[0].SOUTH_EAST_DIRECTION;
              }
              if (values.survayParcelCutter[0].SOUTH_WEST_DIRECTION) {
                values.cuttes_area +=
                  +values.survayParcelCutter[0].SOUTH_WEST_DIRECTION;
              }
            }
            selectedPlan.shapeFeatures.landbase[key] = {
              ...selectedPlan.shapeFeatures.landbase[key],
              ...values,
            };
            scope.setState({ uplodedFeatures: uplodedFeatures });
            scope.props.input.onChange({
              ...value,
              uplodedFeatures: uplodedFeatures,
            });
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  render() {
    const { mainObject, t, isInViewMode, forAddingPlans } = this.props;
    let {
      hide_details,
      selectedCAD,
      selectedCADIndex,
      planDescription,
      planUsingSymbol,
      servicesTypes,
      streets,
      currentParcelPage,
      totalParcelPage,
      minParcelIndex,
      maxParcelIndex,
      currentInvestalParcelPage,
      totalInvestalParcelPage,
      minInvestalParcelIndex,
      maxInvestalParcelIndex,
      currentStreetPage,
      totalStreetPage,
      minStreetIndex,
      maxStreetIndex,
      current_step,
      serviceType,
      serviceSubType,
      servicesSubTypes,
      bufferDistance,
      uplodedFeatures,
      statisticsParcels,
      detailsParcelTypes,
      TotalParcelArea,
      plans,
    } = this.state;

    let selectedPlan = uplodedFeatures && uplodedFeatures[selectedCADIndex];
    if (statisticsParcels.findIndex((p) => p.isInvestalIncluded) == -1) {
      statisticsParcels = this.updateStatisticParcels(selectedPlan);
    } else {
      calculateSchemanticProportions(
        selectedPlan,
        statisticsParcels,
        TotalParcelArea,
        this.props.mainObject
      );
    }
    console.log("current Step ID: " + current_step);
    return (
      <div>
        {!isInViewMode && selectedCADIndex != -1 && (
          <select
            onChange={this.selectPlan}
            className="form-control"
            style={{ height: "40px" }}
          >
            {map(plans, (plan, index) => {
              return (
                <option value={plan} selected={plan == selectedCAD}>
                  {t(plan)}
                </option>
              );
            })}
          </select>
        )}
        {planDescription && (
          <div style={planDescStyle}>{convertToArabic(planDescription)}</div>
        )}

        {planUsingSymbol && (
          <div className="usingsymbolStyle">
            {convertToArabic(planUsingSymbol)}
          </div>
        )}

        {!isInViewMode && !hide_details && (
          <div style={containerDetails}>
            {/* <div className="panel-group">
                        <div className="panel panel-default">
                            <h4 className="panel-title">
                                <a data-toggle="collapse" href="#collapse5">مفتاح الخريطة</a>
                            </h4>

                            <div id="collapse5" className="panel-collapse collapse">
                                <div className="panel-body"> */}
            <Collapse className="Collapse" key={0}>
              <Panel
                key={0}
                header={`مفتاح الخريطة`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                {servicesTypes &&
                  servicesTypes.map((type, index) => {
                    if (this.state[type.symbol_id + "_visbility"] == undefined)
                      this.state[type.symbol_id + "_visbility"] = true;

                    return (
                      <span style={{ padding: "7px", width: "130px" }}>
                        <span>
                          <input
                            type="checkbox"
                            style={{
                              width: "20px",
                              height: "20px",
                              margin: "3px",
                            }}
                            checked={this.state[type.symbol_id + "_visbility"]}
                            onChange={this.changeVisibilty.bind(
                              this,
                              type.symbol_id,
                              !this.state[type.symbol_id + "_visbility"]
                            )}
                          />
                          <span
                            style={{
                              width: "20px",
                              height: "20px",
                              display: "inline-flex",
                              backgroundColor: type.layer_color
                                ? "rgba(" +
                                  type.layer_color[0] +
                                  ", " +
                                  type.layer_color[1] +
                                  ", " +
                                  type.layer_color[2] +
                                  ", " +
                                  type.layer_color[3] +
                                  ")"
                                : "rgb(255, 255, 255)",
                            }}
                          ></span>
                          <span style={{ fontSize: "16px", margin: "3px" }}>
                            {type.layer_description}
                          </span>
                        </span>
                      </span>
                    );
                  })}
              </Panel>
            </Collapse>
            {/* </div>
                            </div>
                        </div>
                    </div> */}

            {/* <div className="panel-group" >
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" href="#collapse6">الشوارع</a>
                                </h4>
                            </div>
                            <div id="collapse6" className="panel-collapse collapse"> */}
            <Collapse className="Collapse" key={1}>
              <Panel
                key={1}
                header={`الشوارع`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <table className="table table-bordered no-margin table-striped">
                  <thead>
                    <tr>
                      {[52].indexOf(this.props.currentModule.id) != -1 && (
                        <>
                          <td>اسم الشارع</td>
                          <td>صنف الشارع</td>
                          <td>نوع الشارع</td>
                          <td>باتجاه واحد</td>
                          <td>الطريقة مفصولة بجزيرة وسطية</td>
                        </>
                      )}
                      <td>الطول (م)</td>
                      <td>العرض (م)</td>
                      <td>يحسب ضمن معدل نسبة أطوال الشوارع بالمخطط</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {streets &&
                      streets.map((street, index) => {
                        return (
                          index >= minStreetIndex &&
                          index < maxStreetIndex && (
                            <tr>
                              {[52].indexOf(this.props.currentModule.id) !=
                                -1 && (
                                <>
                                  <td>
                                    <input
                                      type="text"
                                      name={"streetname"}
                                      value={street.streetname}
                                      placeholder="من فضلك أدخل اسم الشارع"
                                      className="sidebar-form-control form-control"
                                      onInput={this.onStreetChange.bind(
                                        this,
                                        street
                                      )}
                                    />
                                  </td>
                                  <td>
                                    <Select
                                      getPopupContainer={(trigger) =>
                                        trigger.parentNode
                                      }
                                      autoFocus
                                      name="streetClass"
                                      onChange={(val) => {
                                        this.onStreetChange(street, {
                                          target: {
                                            value: val,
                                            name: "streetClass",
                                          },
                                        });
                                      }}
                                      placeholder="صنف الشارع"
                                      value={street.streetClass}
                                    >
                                      {(
                                        this.domains?.[9]?.domain
                                          ?.codedValues || []
                                      ).map((e, i) => {
                                        return (
                                          <Option key={i + 1} value={e.code}>
                                            {e.name}
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  </td>
                                  <td>
                                    <Select
                                      getPopupContainer={(trigger) =>
                                        trigger.parentNode
                                      }
                                      autoFocus
                                      name="streetType"
                                      onChange={(val) => {
                                        this.onStreetChange(street, {
                                          target: {
                                            value: val,
                                            name: "streetType",
                                          },
                                        });
                                      }}
                                      placeholder="نوع الشارع"
                                      value={street.streetType}
                                    >
                                      {(
                                        this.domains?.[10]?.domain
                                          ?.codedValues || []
                                      ).map((e, i) => {
                                        return (
                                          <Option key={i + 1} value={e.code}>
                                            {e.name}
                                          </Option>
                                        );
                                      })}
                                    </Select>
                                  </td>
                                  <td>
                                    {/* <Select
                                      getPopupContainer={(trigger) =>
                                        trigger.parentNode
                                      }
                                      autoFocus
                                      name="oneWay"
                                      onChange={(val) => {
                                        this.onStreetChange(street, {
                                          target: {
                                            value: val,
                                            name: "oneWay",
                                          },
                                        });
                                      }}
                                      placeholder="باتجاه واحد"
                                      value={street.oneWay}
                                    >
                                      {(
                                        this.domains?.[11]?.domain
                                          ?.codedValues || []
                                      ).map((e, i) => {
                                        return (
                                          <Option key={i + 1} value={e.code}>
                                            {e.name}
                                          </Option>
                                        );
                                      })}
                                    </Select> */}
                                    <RadioGroup
                                      onChange={(val) => {
                                        this.onStreetChange(street, {
                                          target: {
                                            value: val.target.value,
                                            name: "oneWay",
                                          },
                                        });
                                      }}
                                      options={this.domains?.[11]?.domain?.codedValues.map(
                                        (x) => ({
                                          label: x.name,
                                          value: (x.code && true) || false,
                                        })
                                      )}
                                      name={"oneWay"}
                                      type={"radio"}
                                      value={street.oneWay}
                                    />
                                  </td>
                                  <td>
                                    {/* <Select
                                      getPopupContainer={(trigger) =>
                                        trigger.parentNode
                                      }
                                      autoFocus
                                      name="divided"
                                      onChange={(val) => {
                                        this.onStreetChange(street, {
                                          target: {
                                            value: val,
                                            name: "divided",
                                          },
                                        });
                                      }}
                                      placeholder="الطريقة مفصولة بجزيرة وسطية"
                                      value={street.divided}
                                    >
                                      {(
                                        this.domains?.[12]?.domain
                                          ?.codedValues || []
                                      ).map((e, i) => {
                                        return (
                                          <Option key={i + 1} value={e.code}>
                                            {e.name}
                                          </Option>
                                        );
                                      })}
                                    </Select> */}
                                    <RadioGroup
                                      onChange={(val) => {
                                        this.onStreetChange(street, {
                                          target: {
                                            value: val.target.value,
                                            name: "divided",
                                          },
                                        });
                                      }}
                                      options={this.domains?.[12]?.domain?.codedValues.map(
                                        (x) => ({
                                          label: x.name,
                                          value: (x.code && true) || false,
                                        })
                                      )}
                                      name={"divided"}
                                      type={"radio"}
                                      value={street.divided}
                                    />
                                  </td>
                                </>
                              )}
                              <td>
                                {convertToArabic(
                                  parseFloat(street?.length?.toFixed(2))
                                )}
                              </td>
                              <td>
                                {convertToArabic(
                                  parseFloat(street?.width?.toFixed(2))
                                )}
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    margin: "3px",
                                  }}
                                  checked={street.checked}
                                  disabled={
                                    [2322, 3099].indexOf(current_step) == -1
                                  }
                                  onChange={() => {
                                    const {
                                      input: { value },
                                    } = this.props;
                                    street.checked = !street.checked;

                                    this.setState({ streets: streets }, () => {
                                      this.props.input.onChange({
                                        ...value,
                                        streets: streets,
                                      });
                                    });
                                  }}
                                />
                              </td>

                              <td
                                onClick={this.zoom.bind(this, street)}
                                onMouseOver={this.highlight.bind(this, street)}
                                onMouseLeave={this.clearHighlight.bind(this)}
                              >
                                <i className="fa fa-search-plus"></i>
                              </td>
                            </tr>
                          )
                        );
                      })}
                    <tr>
                      {/* {[2322, 3099].indexOf(current_step) != -1 && <td></td>} */}
                      <td>معدل نسبة أطوال الشوارع في المخطط</td>
                      <td colSpan={"100%"}>
                        {(() => {
                          let totalAreaPercentage =
                            mainObject?.landData?.landData?.area / 10000;

                          return convertToArabic(
                            +(
                              streets?.reduce(function (a, b) {
                                if (b.checked) {
                                  return a + +b.length.toFixed(2);
                                }
                                return a;
                              }, 0) / totalAreaPercentage
                            )?.toFixed(2)
                          );
                        })() + " م ط / هكتار"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Pagination
                  pageSize={this.pageSize}
                  current={currentStreetPage}
                  total={streets.length}
                  onChange={this.handleStreetChange}
                  style={{ bottom: "0px", position: "static" }}
                />
              </Panel>
            </Collapse>

            {/* </div>
                        </div>
                    </div> */}

            {/* <div className="panel-group">
                        <div className="panel panel-default">
                            <h4 className="panel-title">
                                <a data-toggle="collapse" href="#collapse1">نطاقات تأثير الخدمات</a>
                            </h4>

                            <div id="collapse1" className="panel-collapse collapse">
                                <div className="panel-body"> */}
            <Collapse className="Collapse" key={2}>
              <Panel
                key={2}
                header={`نطاقات تأثير الخدمات`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <FormSection name={`frm`} className="form">
                  <select
                    name="servTypes"
                    onChange={this.serviceChange.bind(this)}
                    className="form-control"
                    style={{ margin: "5px", fontSize: "16px" }}
                  >
                    <option ng-disabled="false" value="">
                      نوع الخدمة
                    </option>
                    {_.filter(servicesTypes, (type, index) => {
                      return type.cad_sublayers && type.cad_sublayers.length; // != null && type.layer_description.trim() == this.removeNoSubType(type).trim()
                    }).map((item, index) => {
                      return (
                        <option value={JSON.stringify(item)}>
                          {item.layer_description}
                        </option>
                      );
                    })}
                  </select>

                  <select
                    name="servSubTypes"
                    onChange={this.serviceSubChange.bind(this)}
                    className="form-control"
                    style={{ margin: "5px" }}
                  >
                    <option ng-disabled="false" value>
                      مستوى الخدمة
                    </option>
                    {servicesSubTypes &&
                      servicesSubTypes.map((item, index) => {
                        return (
                          <option value={JSON.stringify(item)}>
                            {item.sublayer_description}
                          </option>
                        );
                      })}
                  </select>

                  <input
                    type="text"
                    value={this.state["bufferDistance"]}
                    style={{ margin: "5px", fontSize: "16px" }}
                    onChange={this.changeBufferDistance.bind(this)}
                    placeholder="نطاق التخديم بالمتر"
                    name="service"
                    className="form-control"
                  />

                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    style={{ margin: "5px", fontSize: "16px" }}
                    onClick={this.drawBuffer.bind(
                      this,
                      this.state["bufferDistance"]
                    )}
                  >
                    رسم
                  </button>

                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={this.clearBuffer.bind(this)}
                  >
                    مسح
                  </button>
                </FormSection>
              </Panel>
            </Collapse>
            {/* </div>
                            </div>
                        </div>
                    </div> */}

            {/* <div className="panel-group">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" href="#collapse2">قطع الأراضي</a>
                                </h4>
                            </div>
                            <div id="collapse2" className="panel-collapse collapse"> */}
            <Collapse className="Collapse" key={3}>
              <Panel
                key={3}
                header={`قطع الأراضي`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <section style={{ display: "flex", marginTop: "20px" }}>
                  <div style={{ width: "100%" }}>
                    <table className="table table-bordered no-margin table-striped">
                      <thead>
                        <tr>
                          <td>رقم القطعة</td>
                          <td>الاستخدام</td>
                          {(current_step == 2329 ||
                            current_step == 2330 ||
                            current_step == 2372 ||
                            current_step == 2902 ||
                            current_step == 2903 ||
                            current_step == 2895 ||
                            current_step == 2896 ||
                            current_step == 2897 ||
                            current_step == 2898 ||
                            current_step == 2899 ||
                            current_step == 2900 ||
                            current_step == 2901 ||
                            current_step == 2331 ||
                            current_step == 2371 ||
                            current_step == 3117 ||
                            current_step == 3118 ||
                            current_step == 3119 ||
                            current_step == 3120 ||
                            current_step == 3121 ||
                            current_step == 3122 ||
                            current_step == 3123 ||
                            current_step == 3124 ||
                            current_step == 3125 ||
                            current_step == 3126 ||
                            current_step == 3130 ||
                            current_step == 3132 ||
                            current_step == 3133) && (
                            <td>طول الحد الشمالي (م)</td>
                          )}
                          {(current_step == 2329 ||
                            current_step == 2330 ||
                            current_step == 2372 ||
                            current_step == 2902 ||
                            current_step == 2903 ||
                            current_step == 2895 ||
                            current_step == 2896 ||
                            current_step == 2897 ||
                            current_step == 2898 ||
                            current_step == 2899 ||
                            current_step == 2900 ||
                            current_step == 2901 ||
                            current_step == 2331 ||
                            current_step == 2371 ||
                            current_step == 3117 ||
                            current_step == 3118 ||
                            current_step == 3119 ||
                            current_step == 3120 ||
                            current_step == 3121 ||
                            current_step == 3122 ||
                            current_step == 3123 ||
                            current_step == 3124 ||
                            current_step == 3125 ||
                            current_step == 3126 ||
                            current_step == 3130 ||
                            current_step == 3132 ||
                            current_step == 3133) && (
                            <td>طول الحد الشرقي (م)</td>
                          )}
                          {(current_step == 2329 ||
                            current_step == 2330 ||
                            current_step == 2372 ||
                            current_step == 2902 ||
                            current_step == 2903 ||
                            current_step == 2895 ||
                            current_step == 2896 ||
                            current_step == 2897 ||
                            current_step == 2898 ||
                            current_step == 2899 ||
                            current_step == 2900 ||
                            current_step == 2901 ||
                            current_step == 2331 ||
                            current_step == 2371 ||
                            current_step == 3117 ||
                            current_step == 3118 ||
                            current_step == 3119 ||
                            current_step == 3120 ||
                            current_step == 3121 ||
                            current_step == 3122 ||
                            current_step == 3123 ||
                            current_step == 3124 ||
                            current_step == 3125 ||
                            current_step == 3126 ||
                            current_step == 3130 ||
                            current_step == 3132 ||
                            current_step == 3133) && (
                            <td>طول الحد الجنوبي (م)</td>
                          )}
                          {(current_step == 2329 ||
                            current_step == 2330 ||
                            current_step == 2372 ||
                            current_step == 2902 ||
                            current_step == 2903 ||
                            current_step == 2895 ||
                            current_step == 2896 ||
                            current_step == 2897 ||
                            current_step == 2898 ||
                            current_step == 2899 ||
                            current_step == 2900 ||
                            current_step == 2901 ||
                            current_step == 2331 ||
                            current_step == 2371 ||
                            current_step == 3117 ||
                            current_step == 3118 ||
                            current_step == 3119 ||
                            current_step == 3120 ||
                            current_step == 3121 ||
                            current_step == 3122 ||
                            current_step == 3123 ||
                            current_step == 3124 ||
                            current_step == 3125 ||
                            current_step == 3126 ||
                            current_step == 3130 ||
                            current_step == 3132 ||
                            current_step == 3133) && (
                            <td>طول الحد الغربي (م)</td>
                          )}
                          <td>المساحة (م۲)</td>
                          {current_step != 2329 &&
                            current_step != 3117 &&
                            current_step != 2330 &&
                            current_step != 3118 &&
                            current_step != 2371 &&
                            current_step != 3119 && <td>طول الواجهة (م)</td>}
                          {(current_step == 2329 ||
                            current_step == 2330 ||
                            current_step == 2372 ||
                            current_step == 2902 ||
                            current_step == 2903 ||
                            current_step == 2895 ||
                            current_step == 2896 ||
                            current_step == 2897 ||
                            current_step == 2898 ||
                            current_step == 2899 ||
                            current_step == 2900 ||
                            current_step == 2901 ||
                            current_step == 2331 ||
                            current_step == 2371 ||
                            current_step == 3117 ||
                            current_step == 3118 ||
                            current_step == 3119 ||
                            current_step == 3120 ||
                            current_step == 3121 ||
                            current_step == 3122 ||
                            current_step == 3123 ||
                            current_step == 3124 ||
                            current_step == 3125 ||
                            current_step == 3126 ||
                            current_step == 3130 ||
                            current_step == 3132 ||
                            current_step == 3133) && <td>ملاحظات</td>}

                          <td>الشطفات</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPlan &&
                          selectedPlan.shapeFeatures &&
                          selectedPlan.shapeFeatures.landbase &&
                          selectedPlan.shapeFeatures.landbase
                            //.filter((parcel) => parcel.is_cut != 2)
                            .map((parcel, index) => {
                              return (
                                !parcel.isHide &&
                                index >= minParcelIndex &&
                                index < maxParcelIndex && (
                                  <tr
                                    style={
                                      (this.isValidCondition(parcel) && {
                                        backgroundColor: "white",
                                      }) || { backgroundColor: "#f58c8c" }
                                    }
                                  >
                                    <td>{convertToArabic(parcel.number)}</td>
                                    <td>
                                      {convertToArabic(parcel.usingSymbolName)}
                                    </td>

                                    {(current_step == 2329 ||
                                      current_step == 2330 ||
                                      current_step == 2372 ||
                                      current_step == 2902 ||
                                      current_step == 2903 ||
                                      current_step == 2895 ||
                                      current_step == 2896 ||
                                      current_step == 2897 ||
                                      current_step == 2898 ||
                                      current_step == 2899 ||
                                      current_step == 2900 ||
                                      current_step == 2901 ||
                                      current_step == 2331 ||
                                      current_step == 2371 ||
                                      current_step == 3117 ||
                                      current_step == 3118 ||
                                      current_step == 3119 ||
                                      current_step == 3120 ||
                                      current_step == 3121 ||
                                      current_step == 3122 ||
                                      current_step == 3123 ||
                                      current_step == 3124 ||
                                      current_step == 3125 ||
                                      current_step == 3126 ||
                                      current_step == 3130 ||
                                      current_step == 3132 ||
                                      current_step == 3133) && (
                                      <td>
                                        {convertToArabic(
                                          parseFloat(
                                            parcel?.north_length?.toFixed(2)
                                          )
                                        )}
                                      </td>
                                    )}
                                    {(current_step == 2329 ||
                                      current_step == 2330 ||
                                      current_step == 2372 ||
                                      current_step == 2902 ||
                                      current_step == 2903 ||
                                      current_step == 2895 ||
                                      current_step == 2896 ||
                                      current_step == 2897 ||
                                      current_step == 2898 ||
                                      current_step == 2899 ||
                                      current_step == 2900 ||
                                      current_step == 2901 ||
                                      current_step == 2331 ||
                                      current_step == 2371 ||
                                      current_step == 3117 ||
                                      current_step == 3118 ||
                                      current_step == 3119 ||
                                      current_step == 3120 ||
                                      current_step == 3121 ||
                                      current_step == 3122 ||
                                      current_step == 3123 ||
                                      current_step == 3124 ||
                                      current_step == 3125 ||
                                      current_step == 3126 ||
                                      current_step == 3130 ||
                                      current_step == 3132 ||
                                      current_step == 3133) && (
                                      <td>
                                        {convertToArabic(
                                          parseFloat(
                                            parcel?.east_length?.toFixed(2)
                                          )
                                        )}
                                      </td>
                                    )}
                                    {(current_step == 2329 ||
                                      current_step == 2330 ||
                                      current_step == 2372 ||
                                      current_step == 2902 ||
                                      current_step == 2903 ||
                                      current_step == 2895 ||
                                      current_step == 2896 ||
                                      current_step == 2897 ||
                                      current_step == 2898 ||
                                      current_step == 2899 ||
                                      current_step == 2900 ||
                                      current_step == 2901 ||
                                      current_step == 2331 ||
                                      current_step == 2371 ||
                                      current_step == 3117 ||
                                      current_step == 3118 ||
                                      current_step == 3119 ||
                                      current_step == 3120 ||
                                      current_step == 3121 ||
                                      current_step == 3122 ||
                                      current_step == 3123 ||
                                      current_step == 3124 ||
                                      current_step == 3125 ||
                                      current_step == 3126 ||
                                      current_step == 3130 ||
                                      current_step == 3132 ||
                                      current_step == 3133) && (
                                      <td>
                                        {convertToArabic(
                                          parseFloat(
                                            parcel?.south_length?.toFixed(2)
                                          )
                                        )}
                                      </td>
                                    )}
                                    {(current_step == 2329 ||
                                      current_step == 2330 ||
                                      current_step == 2372 ||
                                      current_step == 2902 ||
                                      current_step == 2903 ||
                                      current_step == 2895 ||
                                      current_step == 2896 ||
                                      current_step == 2897 ||
                                      current_step == 2898 ||
                                      current_step == 2899 ||
                                      current_step == 2900 ||
                                      current_step == 2901 ||
                                      current_step == 2331 ||
                                      current_step == 2371 ||
                                      current_step == 3117 ||
                                      current_step == 3118 ||
                                      current_step == 3119 ||
                                      current_step == 3120 ||
                                      current_step == 3121 ||
                                      current_step == 3122 ||
                                      current_step == 3123 ||
                                      current_step == 3124 ||
                                      current_step == 3125 ||
                                      current_step == 3126 ||
                                      current_step == 3130 ||
                                      current_step == 3132 ||
                                      current_step == 3133) && (
                                      <td>
                                        {convertToArabic(
                                          parseFloat(
                                            parcel?.weast_length?.toFixed(2)
                                          )
                                        )}
                                      </td>
                                    )}

                                    <td>
                                      {convertToArabic(
                                        // Number(
                                        //   parcel?.area.toString().match(/^\d+(?:\.\d{0,2})?/)
                                        // )
                                        parseFloat(
                                          +parcel?.area?.toFixed(2) -
                                            (parcel.cuttes_area ||
                                              (parcel.survayParcelCutter &&
                                                +parcel.survayParcelCutter[0]
                                                  .NORTH_EAST_DIRECTION +
                                                  +parcel.survayParcelCutter[0]
                                                    .NORTH_WEST_DIRECTION +
                                                  +parcel.survayParcelCutter[0]
                                                    .SOUTH_EAST_DIRECTION +
                                                  +parcel.survayParcelCutter[0]
                                                    .SOUTH_WEST_DIRECTION) ||
                                              0)
                                        )
                                      )}
                                    </td>
                                    {[2329, 3117].indexOf(current_step) !=
                                      -1 && (
                                      <td>
                                        <input
                                          type="text"
                                          value={parcel.note}
                                          onChange={this.changeNote.bind(
                                            this,
                                            parcel
                                          )}
                                          placeholder="من فضلك أدخل ملاحظاتك"
                                          className="sidebar-form-control form-control"
                                        />
                                      </td>
                                    )}

                                    {((current_step &&
                                      [2317, 3095].indexOf(current_step) !=
                                        -1 &&
                                      [2329, 3117].indexOf(current_step) ==
                                        -1) ||
                                      !current_step) && (
                                      <td>
                                        <input
                                          type="text"
                                          value={parcel.frontLength}
                                          onChange={this.changeFrontLength.bind(
                                            this,
                                            parcel
                                          )}
                                          placeholder="من فضلك أدخل طول الواجهة"
                                          className="sidebar-form-control form-control"
                                        />
                                      </td>
                                    )}
                                    {current_step &&
                                      current_step != 2317 &&
                                      current_step != 3095 &&
                                      current_step != 2330 &&
                                      current_step != 2329 &&
                                      current_step != 2371 &&
                                      current_step != 3117 &&
                                      current_step != 3118 &&
                                      current_step != 3119 && (
                                        <td>
                                          {convertToArabic(parcel.frontLength)}
                                        </td>
                                      )}
                                    {(current_step == 2329 ||
                                      current_step == 2330 ||
                                      current_step == 2372 ||
                                      current_step == 2902 ||
                                      current_step == 2903 ||
                                      current_step == 2895 ||
                                      current_step == 2896 ||
                                      current_step == 2897 ||
                                      current_step == 2898 ||
                                      current_step == 2899 ||
                                      current_step == 2900 ||
                                      current_step == 2901 ||
                                      current_step == 2331 ||
                                      current_step == 2371 ||
                                      current_step == 3117 ||
                                      current_step == 3118 ||
                                      current_step == 3119 ||
                                      current_step == 3120 ||
                                      current_step == 3121 ||
                                      current_step == 3122 ||
                                      current_step == 3123 ||
                                      current_step == 3124 ||
                                      current_step == 3125 ||
                                      current_step == 3126 ||
                                      current_step == 3130 ||
                                      current_step == 3132 ||
                                      current_step == 3133) && (
                                      <td>{convertToArabic(parcel.note)}</td>
                                    )}
                                    <td>
                                      <button
                                        className="btn"
                                        onClick={this.openPopup.bind(
                                          this,
                                          index
                                        )}
                                      >
                                        {(!parcel?.survayParcelCutter?.length &&
                                          "اضافة شطفات") ||
                                          "تعديل الشطفات"}
                                      </button>
                                    </td>
                                    {!this.isValidCondition(parcel) && (
                                      <td>
                                        <Tooltip title="المساحة لا تطابق اشتراطات البناء">
                                          <i className="fa fa-exclamation-circle"></i>
                                        </Tooltip>
                                      </td>
                                    )}
                                  </tr>
                                )
                              );
                            })}
                      </tbody>
                    </table>

                    <Pagination
                      pageSize={this.pageSize}
                      current={currentParcelPage}
                      total={
                        (selectedPlan &&
                          selectedPlan.shapeFeatures &&
                          selectedPlan.shapeFeatures.landbase &&
                          // .filter(
                          //   (parcel) => parcel.is_cut != 2
                          // )
                          selectedPlan.shapeFeatures.landbase.length) ||
                        0
                      }
                      onChange={this.handleParcelChange}
                      style={{ bottom: "0px", position: "static" }}
                    />
                  </div>
                </section>
              </Panel>
            </Collapse>

            <Collapse className="Collapse" key={3}>
              <Panel
                key={3}
                header={`النسب التخطيطية`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <section style={{ display: "flex", marginTop: "20px" }}>
                  <div style={{ width: "100%" }}>
                    <table className="table table-bordered no-margin table-striped">
                      <thead>
                        <tr>
                          <td>الاستخدام</td>
                          <td>المساحة (م۲)</td>
                          <td>النسبة المئوية (%)</td>
                          <td>تحسب ضمن النسب التخطيطية</td>
                        </tr>
                      </thead>
                      <tbody>
                        {statisticsParcels
                          ?.filter(
                            (parcel) => [1, 2].indexOf(parcel.is_cut) != -1
                          )
                          ?.map((parcel, index) => {
                            return (
                              <tr>
                                {parcel.name != "undefined" && (
                                  <td>{parcel.name}</td>
                                )}
                                <td>
                                  {convertToArabic(
                                    parseFloat(parcel?.area?.toFixed(2))
                                  )}
                                </td>
                                <td>
                                  {convertToArabic(
                                    parseFloat(
                                      parcel?.areaPercentage?.toFixed(2)
                                    )
                                  )}
                                </td>
                                <td>
                                  <span>
                                    <input
                                      type="checkbox"
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        margin: "3px",
                                      }}
                                      checked={
                                        (parcel.is_cut == 1 && true) ||
                                        parcel.isInvestalIncluded
                                      }
                                      disabled={
                                        [2322, 3099].indexOf(current_step) !=
                                          -1 && parcel.is_cut == 2
                                          ? false
                                          : true
                                      }
                                      onChange={this.investalChange.bind(
                                        this,
                                        statisticsParcels,
                                        parcel,
                                        !parcel.isInvestalIncluded
                                      )}
                                    />
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </Panel>
            </Collapse>

            {/* </div>
                        </div>
                    </div> */}
            {/* <div className="panel-group">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" href="#collapse3">مؤشر نسب الاستعمالات</a>
                                </h4>
                            </div>
                            <div id="collapse3" className="panel-collapse collapse"> */}
            <Collapse className="Collapse" key={4}>
              <Panel
                key={4}
                header={`مؤشر نسب الاستعمالات`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <table className="table table-bordered no-margin table-striped">
                  <thead>
                    <tr>
                      <td>الاستخدام</td>
                      <td>المساحة (م۲)</td>
                      <td>النسبة المئوية (%)</td>
                    </tr>
                  </thead>
                  <tbody>
                    {statisticsParcels.map((parcel, index) => {
                      return (
                        <tr>
                          {parcel.name == "undefined" && <td>اخرى</td>}
                          {parcel.name != "undefined" && <td>{parcel.name}</td>}
                          <td>
                            {convertToArabic(
                              parseFloat(parcel?.area?.toFixed(2))
                            )}
                          </td>
                          <td>
                            {convertToArabic(
                              parseFloat(parcel?.areaPercentage?.toFixed(2))
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Panel>
            </Collapse>
            {/* </div>
                        </div>
                    </div> */}

            {/* <div className="panel-group">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" href="#collapse4">الميزانية التفصيلية</a>
                                </h4>
                            </div>
                            <div id="collapse4" className="panel-collapse collapse"> */}
            <Collapse className="Collapse" key={5}>
              <Panel
                key={5}
                header={`الميزانية التفصيلية`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <section style={{ display: "flex", marginTop: "20px" }}>
                  <table className="table table-bordered no-margin table-striped">
                    <thead>
                      <tr>
                        <td>الاستعمال</td>
                        <td>الاستعمال الفرعي</td>
                        <td>العدد</td>
                        <td>المساحة (م۲)</td>
                        <td>النسبة المئوية (%)</td>
                        <td>النسبة المئوية الإجمالية (%)</td>
                      </tr>
                    </thead>
                    <tbody>
                      {detailsParcelTypes.map((detail, index) => {
                        return (
                          <tr>
                            {detail.key == "undefined" && <td>اخرى</td>}
                            {detail.key != "undefined" && <td>{detail.key}</td>}
                            <td>
                              <table className="table no-margin table-striped">
                                {Object.values(detail.value).map(
                                  (value, index) => {
                                    return (
                                      <tr>
                                        <td>
                                          {(value.value[0].subType &&
                                            value.value[0].subType
                                              .sublayer_description) ||
                                            ""}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </table>
                            </td>
                            <td>
                              <table className="table no-margin table-striped">
                                {Object.values(detail.value).map(
                                  (value, index) => {
                                    return (
                                      <tr>
                                        <td>
                                          {convertToArabic(value.value.length)}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </table>
                            </td>
                            <td>
                              <table className="table no-margin table-striped">
                                {Object.values(detail.value).map(
                                  (value, index) => {
                                    return (
                                      <tr>
                                        <td>
                                          {convertToArabic(
                                            parseFloat(
                                              value?.total_area?.toFixed(2)
                                            )
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </table>
                            </td>
                            <td>
                              <table className="table no-margin table-striped">
                                {Object.values(detail.value).map(
                                  (value, index) => {
                                    return (
                                      <tr>
                                        <td>
                                          {convertToArabic(
                                            parseFloat(
                                              (
                                                (value.total_area /
                                                  TotalParcelArea) *
                                                100
                                              )?.toFixed(2)
                                            )
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  }
                                )}
                              </table>
                            </td>
                            <td>
                              {convertToArabic(
                                parseFloat(
                                  (
                                    (detail.usingTypeArea / TotalParcelArea) *
                                    100
                                  )?.toFixed(2)
                                )
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td>معدل نسبة أطوال الشوارع في المخطط</td>
                        <td colSpan={5}>
                          {(() => {
                            let totalAreaPercentage =
                              mainObject?.landData?.landData?.area / 10000;

                            return convertToArabic(
                              +(
                                streets?.reduce(function (a, b) {
                                  if (b.checked) {
                                    return a + +b.length.toFixed(2);
                                  }
                                  return a;
                                }, 0) / totalAreaPercentage
                              )?.toFixed(2)
                            );
                          })() + " م ط / هكتار"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </section>
              </Panel>
            </Collapse>
            {/* </div>
                        </div>
                    </div> */}
          </div>
        )}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  appMapDispatchToProps
)(withTranslation("cadData")(plansDataComponent));
