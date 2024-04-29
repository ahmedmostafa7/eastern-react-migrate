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
} from "../common/common_func";
import applyFilters from "main_helpers/functions/filters";
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
import { PlanEntity } from "./Entity/PlanEntity";
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

export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "plansData"),
    ...mapDispatchToProps1(dispatch),
  };
};

class plansDataComponent extends Component {
  constructor(props) {
    super(props);

    if (
      props?.mainObject?.[`${props.currentStep}`]?.[
        `${props.currentStep}Data`
      ]?.["planDetails"]
    ) {
      const {
        mainObject: {
          [`${props.currentStep}`]: {
            [`${props.currentStep}Data`]: { planDetails },
          },
          data_msa7y: {
            msa7yData: { cadDetails },
          },
        },
      } = props;

      this.state = {
        plan: new PlanEntity(props, {
          layers: planDetails.layers || [],
          isInvestalIncluded: planDetails.isInvestalIncluded || false,
          zoomRatio: 50,
          plans: [],
          polygons: [],
          selectedCAD: planDetails.selectedCAD || "",
          selectedCADIndex:
            planDetails.selectedCADIndex != -1
              ? planDetails.selectedCADIndex
              : -1,
          planDescription: cadDetails?.planDescription || "",
          planUsingSymbol: planDetails.planUsingSymbol || "",
          hide_details:
            planDetails.hide_details != undefined &&
            planDetails.hide_details != true
              ? false
              : true,
          streets: planDetails.streets || [],

          removeNoSubType: undefined,
          serviceType: planDetails.serviceType || {},
          servicesTypes: planDetails.servicesTypes || [],
          serviceSubType: planDetails.serviceSubType || {},
          servicesSubTypes: planDetails.servicesSubTypes || [],
          bufferDistance: planDetails.bufferDistance || 5,
          uplodedFeatures: planDetails.uplodedFeatures || [],
          statisticsParcels: planDetails.statisticsParcels || [],
          detailsParcelTypes: planDetails.detailsParcelTypes || [],
          TotalParcelArea:
            planDetails.TotalParcelArea ||
            (planDetails.uplodedFeatures &&
              planDetails.uplodedFeatures[
                planDetails.selectedCADIndex || 0
              ]?.shapeFeatures?.landbase?.reduce((a, b) => a + b.area, 0)) ||
            0,
          servicesLayer: {},
          //cadPath: '',
          streetsAnnotation: planDetails.streetsAnnotation || [],
          enableDownlaodCad: props?.mainObject?.enableDownlaodCad || false,
        }),
      };
    } else {
      this.state = {
        plan: new PlanEntity(props),
      };
    }
    this.isLoaded = true;
  }

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

  init = function (newVal) {
    this.resetMap();
    const { plan } = this.state;
    plan.checkStreetDomains().then((domains) => {
      plan.domains = domains;
      plan.checkServicesTypes().then((serviceTypes) => {
        plan.servicesTypes = serviceTypes;
        plan.init_plan(this.props, newVal, this.map, () => {
          this.setState(
            {
              plan,
            },
            () => {
              this.setToStore();
            }
          );
        });
      });
    });
  };

  onStreetChange = (key, evt) => {
    let { plan } = this.state;
    plan.streets[key][evt.target.name] =
      evt.target.name == "streetname"
        ? evt?.target?.value || ""
        : evt?.target?.value;
    plan.streets[key].polygon =
      street.polygon || new esri.geometry.Polygon(plan.streets[key]);
    plan.streets[key].position =
      plan.streets[key].position ||
      new esri.geometry.Polygon(plan.streets[key]).getExtent().getCenter();
    this.setState(
      {
        plan,
      },
      () => {
        this.setToStore();
      }
    );
  };

  drawBuffer = function (bufferDistance) {
    const { plan } = this.state;
    plan.drawBuffer(bufferDistance, this.map, () => {
      store.dispatch({ type: "Show_Loading_new", loading: false });
    });
  };

  serviceChange = function (evt) {
    var item = JSON.parse(evt.target.value);
    let { plan } = this.state;
    plan.serviceType = item;
    plan.servicesSubTypes = item.cad_sublayers;
    this.setState(
      {
        plan,
      },
      () => {
        this.setToStore();
      }
    );
  };

  clearBuffer = function () {
    const { plan } = this.state;
    plan.clearBuffer(this.map);
  };

  dragLength = function (event) {
    const { plan } = this.state;
    plan.dragLength(this.map, event);
  };

  moveBoundries = function () {
    window.onDragLengthLayer = [];
    window.onDragLengthLayer.push(this.dragLength);
  };

  serviceSubChange = function (evt) {
    var item = JSON.parse(evt.target.value);
    let { plan } = this.state;
    plan.bufferDistance = +item.buffer_length;
    plan.serviceSubType = item;
    this.setState(
      {
        plan,
      },
      () => {
        this.setToStore();
      }
    );
  };

  handleParcelChange = (page) => {
    let { plan } = this.state;
    plan.currentParcelPage = page;
    plan.minParcelIndex = (page - 1) * plan.pageSize;
    plan.maxParcelIndex = page * plan.pageSize;
    this.setState(
      {
        plan,
      },
      () => {
        this.setToStore();
      }
    );
  };

  handleInvestalParcelChange = (page) => {
    let { plan } = this.state;
    plan.currentInvestalParcelPage = page;
    plan.minInvestalParcelIndex = (page - 1) * plan.pageSize;
    plan.maxInvestalParcelIndex = page * plan.pageSize;
    this.setState(
      {
        plan,
      },
      () => {
        this.setToStore();
      }
    );
  };
  handleStreetChange = (page) => {
    let { plan } = this.state;
    plan.currentStreetPage = page;
    plan.minStreetIndex = (page - 1) * plan.pageSize;
    plan.maxStreetIndex = page * plan.pageSize;
    this.setState(
      {
        plan,
      },
      () => {
        this.setToStore();
      }
    );
  };

  investalChange = (key, evt) => {
    let { plan } = this.state;
    if (key == -1) {
      plan.statisticsParcels = plan.updateStatisticParcels(this.props);
    } else {
      plan.statisticsParcels[key].isInvestalIncluded =
        (plan.statisticsParcels[key].is_cut == 1 && true) || evt.target.checked;
      calculateSchemanticProportions(
        plan.uplodedFeatures?.[plan.selectedCADIndex],
        plan.statisticsParcels,
        plan.TotalParcelArea,
        this.props.mainObject
      );
    }
    this.setState(
      {
        plan,
      },
      () => {
        this.setToStore();
      }
    );
  };

  changeVisibilty = (layerName, isVisibile) => {
    let { plan } = this.state;
    var checkboxs = {};
    if (layerName == "markall") {
      plan.markall.isVisibile = !plan.markall.isVisibile;
      plan.servicesTypes.forEach((service) => {
        if (this.map.getLayer("Layer_G" + service.symbol_id))
          this.map
            .getLayer("Layer_G" + service.symbol_id)
            .setOpacity(plan.markall.isVisibile ? 1 : 0);

        checkboxs[service.symbol_id + "_visbility"] = plan.markall.isVisibile
          ? 1
          : 0;
      });

      if (this.map.getLayer("PacrelNoGraphicLayer"))
        this.map
          .getLayer("PacrelNoGraphicLayer")
          .setOpacity(plan.markall.isVisibile ? 1 : 0);
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

  setToStore = () => {
    const { plan } = this.state;
    var values = {
      isInvestalIncluded: plan?.isInvestalIncluded,
      statisticsParcels: plan?.statisticsParcels,
      enableDownlaodCad: plan?.uplodedFeatures.cad_path ? true : false,
      planDescription: plan?.planDescription,
      streets: plan?.streets,
      detailsParcelTypes: plan?.detailsParcelTypes,
      uplodedFeatures: plan?.uplodedFeatures,
      streetsAnnotation: plan?.streetsAnnotation,
      serviceSubType: plan?.serviceSubType,
      serviceType: plan?.serviceType,
      selectedCAD: plan?.selectedCAD,
      selectedCADIndex: plan?.selectedCADIndex,
      planUsingSymbol: plan?.planUsingSymbol,
      hide_details: plan?.hide_details,
      servicesTypes: plan?.servicesTypes,
      servicesSubTypes: plan?.servicesSubTypes,
      TotalParcelArea: plan?.TotalParcelArea,
      current_step: plan?.current_step,
      bufferDistance: plan?.bufferDistance,
      buildingCondition: plan?.buildingCondition || [],
      layers: plan.layers || [],
    };

    var additionalValues = {
      totalParcelPage:
        plan?.uplodedFeatures?.[plan?.selectedCADIndex]?.shapeFeatures?.landbase
          ?.length / plan?.pageSize,
      totalInvestalParcelPage:
        plan?.uplodedFeatures?.[
          plan?.selectedCADIndex
        ]?.shapeFeatures?.landbase?.filter((parcel) => parcel?.is_cut == 2)
          ?.length / plan?.pageSize,
      minParcelIndex: plan?.minParcelIndex,
      maxParcelIndex: plan?.pageSize,
      minInvestalParcelIndex: plan?.minInvestalParcelIndex,
      maxInvestalParcelIndex: plan?.pageSize,
      totalStreetPage: plan?.streets?.length / plan?.pageSize,
      minStreetIndex: plan?.minStreetIndex,
      maxStreetIndex: plan?.pageSize,
    };

    this.props.input.onChange({
      ...values,
      ...additionalValues,
    });
  };

  componentDidUpdate() {
    const { input, mainObject } = this.props;
    const vals = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });

    if (input.value && input.value != "" && input.value.justInvoked) {
      input.value.justInvoked = false;
      this.isLoaded = false;
      this.map = getMap();
      let plan = {};
      plan.plans = [];

      if (
        !plan.uplodedFeatures ||
        (Array.isArray(plan.uplodedFeatures) &&
          plan.uplodedFeatures.length == 0)
      ) {
        plan.uplodedFeatures = [];
        plan.uplodedFeatures.push(
          (!isEmpty(input.value.perfectCad) && input.value.perfectCad) || null
        );
        plan.uplodedFeatures.push(
          (!isEmpty(input.value.secondCad) && input.value.secondCad) || null
        );
        plan.uplodedFeatures.push(
          (!isEmpty(input.value.thirdCad) && input.value.thirdCad) || null
        );
      } else {
        plan.uplodedFeatures[0] =
          (!isEmpty(input.value.perfectCad) && input.value.perfectCad) || null;
        plan.uplodedFeatures[1] =
          (!isEmpty(input.value.secondCad) && input.value.secondCad) || null;
        plan.uplodedFeatures[2] =
          (!isEmpty(input.value.thirdCad) && input.value.thirdCad) || null;
      }

      plan.hide_details = input.value.hide_details || false;

      for (var i = 0; i < plan.uplodedFeatures.length; i++) {
        if (plan.uplodedFeatures[i]) {
          plan.selectedCADIndex = i;
          var currentPlan =
            i == 0 ? "perfectCad" : i == 1 ? "secondCad" : "thirdCad";
          plan.selectedCAD = currentPlan;
          plan.plans.push(currentPlan);
        } else {
          break;
        }
      }

      this.setState(
        {
          plan: new PlanEntity(this.props, plan),
        },
        () => {
          this.init(plan.selectedCADIndex);
        }
      );
    } else if (
      this.isLoaded &&
      window.mapInfo &&
      !vals?.plansData?.mapviewer?.mapGraphics?.length
    ) {
      let { plan } = this.state;
      this.map = getMap();
      if (getIsMapLoaded()) {
        setIsMapLoaded(false);
        this.isLoaded = false;

        plan.plans = [];
        for (var i = 0; i < plan.uplodedFeatures.length; i++) {
          if (plan.uplodedFeatures[i]) {
            plan.selectedCADIndex = i;
            var currentPlan =
              i == 0 ? "perfectCad" : i == 1 ? "secondCad" : "thirdCad";
            plan.selectedCAD = currentPlan;
            plan.plans.push(currentPlan);
          } else {
            break;
          }
        }

        if (plan.selectedCADIndex != -1) {
          this.setState(
            {
              plan,
            },
            () => {
              this.init(plan.selectedCADIndex);
            }
          );
        }
      }
    } else if (
      this.isLoaded &&
      window.mapInfo &&
      vals?.plansData?.mapviewer?.mapGraphics?.length
    ) {
      let { plan } = this.state;
      this.map = getMap();
      if (getIsMapLoaded()) {
        setIsMapLoaded(false);
        this.isLoaded = false;
        for (var i = 0; i < plan.uplodedFeatures.length; i++) {
          if (plan.uplodedFeatures[i]) {
            plan.selectedCADIndex = i;
            var currentPlan =
              i == 0 ? "perfectCad" : i == 1 ? "secondCad" : "thirdCad";
            plan.selectedCAD = currentPlan;
            plan.plans.push(currentPlan);
          } else {
            break;
          }
        }

        this.setState(
          {
            plan,
          },
          () => {
            this.setToStore();
          }
        );
      }
    }
    //return true;
  }

  selectPlan = (evt) => {
    const {
      input: { value },
    } = this.props;
    let { plan } = this.state;
    plan.selectedCAD = evt.target.value;
    plan.selectedCADIndex =
      evt.target.value.indexOf("first") != -1
        ? 0
        : evt.target.value.indexOf("second") != -1
        ? 1
        : 2;
    plan.hide_details = true;
    this.setState(
      {
        plan,
      },
      () => {
        this.init(plan.selectedCADIndex);
      }
    );
  };

  changeBufferDistance = (evt) => {
    let { plan } = this.state;
    plan.bufferDistance = evt.target.value;
    this.setState(
      {
        plan,
      },
      () => {
        this.setToStore();
      }
    );
  };

  changeNote = (key, evt) => {
    let { plan } = this.state;
    plan.uplodedFeatures[plan.selectedCADIndex].shapeFeatures.landbase[
      key
    ].note = evt.target.value;
    this.setState(
      {
        plan,
      },
      () => {
        this.setToStore();
      }
    );
  };

  changeFrontLength = (key, evt) => {
    let { plan } = this.state;
    plan.uplodedFeatures[plan.selectedCADIndex].shapeFeatures.landbase[
      key
    ].frontLength = evt.target.value;
    this.setState(
      {
        plan,
      },
      () => {
        this.setToStore();
      }
    );
  };

  render() {
    const { mainObject, t, isInViewMode, forAddingPlans } = this.props;
    let { plan } = this.state;
    return (
      <div>
        {!isInViewMode && plan.selectedCADIndex != -1 && (
          <select
            onChange={this.selectPlan}
            className="form-control"
            style={{ height: "40px" }}
          >
            {map(plan.plans, (plan, index) => {
              return (
                <option value={plan} selected={plan == plan.selectedCAD}>
                  {t(plan)}
                </option>
              );
            })}
          </select>
        )}
        {plan.planDescription && (
          <div style={planDescStyle}>
            {convertToArabic(plan.planDescription)}
          </div>
        )}

        {plan.planUsingSymbol && (
          <div className="usingsymbolStyle">
            {convertToArabic(plan.planUsingSymbol)}
          </div>
        )}

        {!isInViewMode && !plan.hide_details && (
          <div style={containerDetails}>
            <Collapse className="Collapse" key={0}>
              <Panel
                key={0}
                header={`مفتاح الخريطة`}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                {plan.servicesTypes &&
                  plan.servicesTypes.map((type, index) => {
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
                    {plan.streets &&
                      plan.streets.map((street, index) => {
                        return (
                          index >= plan.minStreetIndex &&
                          index < plan.maxStreetIndex && (
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
                                        index
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
                                        this.onStreetChange(index, {
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
                                        plan.domains?.[9]?.domain
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
                                        this.onStreetChange(index, {
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
                                        plan.domains?.[10]?.domain
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
                                    <RadioGroup
                                      onChange={(val) => {
                                        this.onStreetChange(index, {
                                          target: {
                                            value: val.target.value,
                                            name: "oneWay",
                                          },
                                        });
                                      }}
                                      options={plan.domains?.[11]?.domain?.codedValues.map(
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
                                    <RadioGroup
                                      onChange={(val) => {
                                        this.onStreetChange(index, {
                                          target: {
                                            value: val.target.value,
                                            name: "divided",
                                          },
                                        });
                                      }}
                                      options={plan.domains?.[12]?.domain?.codedValues.map(
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
                                    [2322, 3099].indexOf(plan.current_step) ==
                                    -1
                                  }
                                  onChange={() => {
                                    plan.streets[index].checked =
                                      !plan.streets[index].checked;
                                    this.setState(
                                      {
                                        plan,
                                      },
                                      () => {
                                        this.setToStore();
                                      }
                                    );
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
                      <td>معدل نسبة أطوال الشوارع في المخطط</td>
                      <td colSpan={"100%"}>
                        {(() => {
                          let totalAreaPercentage =
                            mainObject?.landData?.landData?.area / 10000;

                          return convertToArabic(
                            +(
                              plan.streets?.reduce(function (a, b) {
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
                  pageSize={plan.pageSize}
                  current={plan.currentStreetPage}
                  total={plan.streets.length}
                  onChange={this.handleStreetChange}
                  style={{ bottom: "0px", position: "static" }}
                />
              </Panel>
            </Collapse>
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
                    {_.filter(plan.servicesTypes, (type, index) => {
                      return type.cad_sublayers && type.cad_sublayers?.length;
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
                    {plan.servicesSubTypes &&
                      plan.servicesSubTypes.map((item, index) => {
                        return (
                          <option value={JSON.stringify(item)}>
                            {item.sublayer_description}
                          </option>
                        );
                      })}
                  </select>

                  <input
                    type="text"
                    value={plan["bufferDistance"]}
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
                    onClick={this.drawBuffer.bind(this, plan["bufferDistance"])}
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
                          {(plan.current_step == 2329 ||
                            plan.current_step == 2330 ||
                            plan.current_step == 2372 ||
                            plan.current_step == 2902 ||
                            plan.current_step == 2903 ||
                            plan.current_step == 2895 ||
                            plan.current_step == 2896 ||
                            plan.current_step == 2897 ||
                            plan.current_step == 2898 ||
                            plan.current_step == 2899 ||
                            plan.current_step == 2900 ||
                            plan.current_step == 2901 ||
                            plan.current_step == 2331 ||
                            plan.current_step == 2371 ||
                            plan.current_step == 3117 ||
                            plan.current_step == 3118 ||
                            plan.current_step == 3119 ||
                            plan.current_step == 3120 ||
                            plan.current_step == 3121 ||
                            plan.current_step == 3122 ||
                            plan.current_step == 3123 ||
                            plan.current_step == 3124 ||
                            plan.current_step == 3125 ||
                            plan.current_step == 3126 ||
                            plan.current_step == 3130 ||
                            plan.current_step == 3132 ||
                            plan.current_step == 3133) && (
                            <td>طول الحد الشمالي (م)</td>
                          )}
                          {(plan.current_step == 2329 ||
                            plan.current_step == 2330 ||
                            plan.current_step == 2372 ||
                            plan.current_step == 2902 ||
                            plan.current_step == 2903 ||
                            plan.current_step == 2895 ||
                            plan.current_step == 2896 ||
                            plan.current_step == 2897 ||
                            plan.current_step == 2898 ||
                            plan.current_step == 2899 ||
                            plan.current_step == 2900 ||
                            plan.current_step == 2901 ||
                            plan.current_step == 2331 ||
                            plan.current_step == 2371 ||
                            plan.current_step == 3117 ||
                            plan.current_step == 3118 ||
                            plan.current_step == 3119 ||
                            plan.current_step == 3120 ||
                            plan.current_step == 3121 ||
                            plan.current_step == 3122 ||
                            plan.current_step == 3123 ||
                            plan.current_step == 3124 ||
                            plan.current_step == 3125 ||
                            plan.current_step == 3126 ||
                            plan.current_step == 3130 ||
                            plan.current_step == 3132 ||
                            plan.current_step == 3133) && (
                            <td>طول الحد الشرقي (م)</td>
                          )}
                          {(plan.current_step == 2329 ||
                            plan.current_step == 2330 ||
                            plan.current_step == 2372 ||
                            plan.current_step == 2902 ||
                            plan.current_step == 2903 ||
                            plan.current_step == 2895 ||
                            plan.current_step == 2896 ||
                            plan.current_step == 2897 ||
                            plan.current_step == 2898 ||
                            plan.current_step == 2899 ||
                            plan.current_step == 2900 ||
                            plan.current_step == 2901 ||
                            plan.current_step == 2331 ||
                            plan.current_step == 2371 ||
                            plan.current_step == 3117 ||
                            plan.current_step == 3118 ||
                            plan.current_step == 3119 ||
                            plan.current_step == 3120 ||
                            plan.current_step == 3121 ||
                            plan.current_step == 3122 ||
                            plan.current_step == 3123 ||
                            plan.current_step == 3124 ||
                            plan.current_step == 3125 ||
                            plan.current_step == 3126 ||
                            plan.current_step == 3130 ||
                            plan.current_step == 3132 ||
                            plan.current_step == 3133) && (
                            <td>طول الحد الجنوبي (م)</td>
                          )}
                          {(plan.current_step == 2329 ||
                            plan.current_step == 2330 ||
                            plan.current_step == 2372 ||
                            plan.current_step == 2902 ||
                            plan.current_step == 2903 ||
                            plan.current_step == 2895 ||
                            plan.current_step == 2896 ||
                            plan.current_step == 2897 ||
                            plan.current_step == 2898 ||
                            plan.current_step == 2899 ||
                            plan.current_step == 2900 ||
                            plan.current_step == 2901 ||
                            plan.current_step == 2331 ||
                            plan.current_step == 2371 ||
                            plan.current_step == 3117 ||
                            plan.current_step == 3118 ||
                            plan.current_step == 3119 ||
                            plan.current_step == 3120 ||
                            plan.current_step == 3121 ||
                            plan.current_step == 3122 ||
                            plan.current_step == 3123 ||
                            plan.current_step == 3124 ||
                            plan.current_step == 3125 ||
                            plan.current_step == 3126 ||
                            plan.current_step == 3130 ||
                            plan.current_step == 3132 ||
                            plan.current_step == 3133) && (
                            <td>طول الحد الغربي (م)</td>
                          )}
                          <td>المساحة (م۲)</td>
                          {plan.current_step != 2329 &&
                            plan.current_step != 3117 &&
                            plan.current_step != 2330 &&
                            plan.current_step != 3118 &&
                            plan.current_step != 2371 &&
                            plan.current_step != 3119 && (
                              <td>طول الواجهة (م)</td>
                            )}
                          {(plan.current_step == 2329 ||
                            plan.current_step == 2330 ||
                            plan.current_step == 2372 ||
                            plan.current_step == 2902 ||
                            plan.current_step == 2903 ||
                            plan.current_step == 2895 ||
                            plan.current_step == 2896 ||
                            plan.current_step == 2897 ||
                            plan.current_step == 2898 ||
                            plan.current_step == 2899 ||
                            plan.current_step == 2900 ||
                            plan.current_step == 2901 ||
                            plan.current_step == 2331 ||
                            plan.current_step == 2371 ||
                            plan.current_step == 3117 ||
                            plan.current_step == 3118 ||
                            plan.current_step == 3119 ||
                            plan.current_step == 3120 ||
                            plan.current_step == 3121 ||
                            plan.current_step == 3122 ||
                            plan.current_step == 3123 ||
                            plan.current_step == 3124 ||
                            plan.current_step == 3125 ||
                            plan.current_step == 3126 ||
                            plan.current_step == 3130 ||
                            plan.current_step == 3132 ||
                            plan.current_step == 3133) && <td>ملاحظات</td>}

                          <td>الشطفات</td>
                          <td></td>
                        </tr>
                      </thead>
                      <tbody>
                        {plan?.uplodedFeatures[
                          plan.selectedCADIndex
                        ]?.shapeFeatures?.landbase
                          //.filter((parcel) => parcel.is_cut != 2)
                          ?.map((parcel, index) => {
                            return (
                              !parcel.isHide &&
                              index >= plan.minParcelIndex &&
                              index < plan.maxParcelIndex && (
                                <tr
                                  style={
                                    (plan.isValidCondition(
                                      this.props,
                                      parcel
                                    ) && {
                                      backgroundColor: "white",
                                    }) || { backgroundColor: "#f58c8c" }
                                  }
                                >
                                  <td>{convertToArabic(parcel.number)}</td>
                                  <td>
                                    {convertToArabic(parcel.usingSymbolName)}
                                  </td>

                                  {(plan.current_step == 2329 ||
                                    plan.current_step == 2330 ||
                                    plan.current_step == 2372 ||
                                    plan.current_step == 2902 ||
                                    plan.current_step == 2903 ||
                                    plan.current_step == 2895 ||
                                    plan.current_step == 2896 ||
                                    plan.current_step == 2897 ||
                                    plan.current_step == 2898 ||
                                    plan.current_step == 2899 ||
                                    plan.current_step == 2900 ||
                                    plan.current_step == 2901 ||
                                    plan.current_step == 2331 ||
                                    plan.current_step == 2371 ||
                                    plan.current_step == 3117 ||
                                    plan.current_step == 3118 ||
                                    plan.current_step == 3119 ||
                                    plan.current_step == 3120 ||
                                    plan.current_step == 3121 ||
                                    plan.current_step == 3122 ||
                                    plan.current_step == 3123 ||
                                    plan.current_step == 3124 ||
                                    plan.current_step == 3125 ||
                                    plan.current_step == 3126 ||
                                    plan.current_step == 3130 ||
                                    plan.current_step == 3132 ||
                                    plan.current_step == 3133) && (
                                    <td>
                                      {convertToArabic(
                                        parseFloat(
                                          parcel?.north_length?.toFixed(2)
                                        )
                                      )}
                                    </td>
                                  )}
                                  {(plan.current_step == 2329 ||
                                    plan.current_step == 2330 ||
                                    plan.current_step == 2372 ||
                                    plan.current_step == 2902 ||
                                    plan.current_step == 2903 ||
                                    plan.current_step == 2895 ||
                                    plan.current_step == 2896 ||
                                    plan.current_step == 2897 ||
                                    plan.current_step == 2898 ||
                                    plan.current_step == 2899 ||
                                    plan.current_step == 2900 ||
                                    plan.current_step == 2901 ||
                                    plan.current_step == 2331 ||
                                    plan.current_step == 2371 ||
                                    plan.current_step == 3117 ||
                                    plan.current_step == 3118 ||
                                    plan.current_step == 3119 ||
                                    plan.current_step == 3120 ||
                                    plan.current_step == 3121 ||
                                    plan.current_step == 3122 ||
                                    plan.current_step == 3123 ||
                                    plan.current_step == 3124 ||
                                    plan.current_step == 3125 ||
                                    plan.current_step == 3126 ||
                                    plan.current_step == 3130 ||
                                    plan.current_step == 3132 ||
                                    plan.current_step == 3133) && (
                                    <td>
                                      {convertToArabic(
                                        parseFloat(
                                          parcel?.east_length?.toFixed(2)
                                        )
                                      )}
                                    </td>
                                  )}
                                  {(plan.current_step == 2329 ||
                                    plan.current_step == 2330 ||
                                    plan.current_step == 2372 ||
                                    plan.current_step == 2902 ||
                                    plan.current_step == 2903 ||
                                    plan.current_step == 2895 ||
                                    plan.current_step == 2896 ||
                                    plan.current_step == 2897 ||
                                    plan.current_step == 2898 ||
                                    plan.current_step == 2899 ||
                                    plan.current_step == 2900 ||
                                    plan.current_step == 2901 ||
                                    plan.current_step == 2331 ||
                                    plan.current_step == 2371 ||
                                    plan.current_step == 3117 ||
                                    plan.current_step == 3118 ||
                                    plan.current_step == 3119 ||
                                    plan.current_step == 3120 ||
                                    plan.current_step == 3121 ||
                                    plan.current_step == 3122 ||
                                    plan.current_step == 3123 ||
                                    plan.current_step == 3124 ||
                                    plan.current_step == 3125 ||
                                    plan.current_step == 3126 ||
                                    plan.current_step == 3130 ||
                                    plan.current_step == 3132 ||
                                    plan.current_step == 3133) && (
                                    <td>
                                      {convertToArabic(
                                        parseFloat(
                                          parcel?.south_length?.toFixed(2)
                                        )
                                      )}
                                    </td>
                                  )}
                                  {(plan.current_step == 2329 ||
                                    plan.current_step == 2330 ||
                                    plan.current_step == 2372 ||
                                    plan.current_step == 2902 ||
                                    plan.current_step == 2903 ||
                                    plan.current_step == 2895 ||
                                    plan.current_step == 2896 ||
                                    plan.current_step == 2897 ||
                                    plan.current_step == 2898 ||
                                    plan.current_step == 2899 ||
                                    plan.current_step == 2900 ||
                                    plan.current_step == 2901 ||
                                    plan.current_step == 2331 ||
                                    plan.current_step == 2371 ||
                                    plan.current_step == 3117 ||
                                    plan.current_step == 3118 ||
                                    plan.current_step == 3119 ||
                                    plan.current_step == 3120 ||
                                    plan.current_step == 3121 ||
                                    plan.current_step == 3122 ||
                                    plan.current_step == 3123 ||
                                    plan.current_step == 3124 ||
                                    plan.current_step == 3125 ||
                                    plan.current_step == 3126 ||
                                    plan.current_step == 3130 ||
                                    plan.current_step == 3132 ||
                                    plan.current_step == 3133) && (
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
                                      parseFloat(
                                        parcel?.area?.toFixed(2) -
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
                                  {[2329, 3117].indexOf(plan.current_step) !=
                                    -1 && (
                                    <td>
                                      <input
                                        type="text"
                                        value={parcel.note}
                                        onChange={this.changeNote.bind(
                                          this,
                                          index
                                        )}
                                        placeholder="من فضلك أدخل ملاحظاتك"
                                        className="sidebar-form-control form-control"
                                      />
                                    </td>
                                  )}
                                  {((plan.current_step &&
                                    [2317, 3095].indexOf(plan.current_step) !=
                                      -1 &&
                                    [2329, 3117].indexOf(plan.current_step) ==
                                      -1) ||
                                    !plan.current_step) && (
                                    <td>
                                      <input
                                        type="text"
                                        value={parcel.frontLength}
                                        onChange={this.changeFrontLength.bind(
                                          this,
                                          index
                                        )}
                                        placeholder="من فضلك أدخل طول الواجهة"
                                        className="sidebar-form-control form-control"
                                      />
                                    </td>
                                  )}
                                  {plan.current_step &&
                                    plan.current_step != 2317 &&
                                    plan.current_step != 3095 &&
                                    plan.current_step != 2330 &&
                                    plan.current_step != 2329 &&
                                    plan.current_step != 2371 &&
                                    plan.current_step != 3117 &&
                                    plan.current_step != 3118 &&
                                    plan.current_step != 3119 && (
                                      <td>
                                        {convertToArabic(parcel.frontLength)}
                                      </td>
                                    )}
                                  {(plan.current_step == 2329 ||
                                    plan.current_step == 2330 ||
                                    plan.current_step == 2372 ||
                                    plan.current_step == 2902 ||
                                    plan.current_step == 2903 ||
                                    plan.current_step == 2895 ||
                                    plan.current_step == 2896 ||
                                    plan.current_step == 2897 ||
                                    plan.current_step == 2898 ||
                                    plan.current_step == 2899 ||
                                    plan.current_step == 2900 ||
                                    plan.current_step == 2901 ||
                                    plan.current_step == 2331 ||
                                    plan.current_step == 2371 ||
                                    plan.current_step == 3117 ||
                                    plan.current_step == 3118 ||
                                    plan.current_step == 3119 ||
                                    plan.current_step == 3120 ||
                                    plan.current_step == 3121 ||
                                    plan.current_step == 3122 ||
                                    plan.current_step == 3123 ||
                                    plan.current_step == 3124 ||
                                    plan.current_step == 3125 ||
                                    plan.current_step == 3126 ||
                                    plan.current_step == 3130 ||
                                    plan.current_step == 3132 ||
                                    plan.current_step == 3133) && (
                                    <td>{convertToArabic(parcel.note)}</td>
                                  )}
                                  <td>
                                    <button
                                      className="btn"
                                      onClick={() => {
                                        plan.openPopup(
                                          this.props,
                                          !parcel?.survayParcelCutter?.length,
                                          index,
                                          () => {
                                            this.setState(
                                              {
                                                plan,
                                              },
                                              () => {
                                                this.setToStore();
                                              }
                                            );
                                          }
                                        );
                                      }}
                                    >
                                      {(!parcel?.survayParcelCutter?.length &&
                                        "اضافة شطفات") ||
                                        "عرض الشطفات"}
                                    </button>
                                    {parcel?.survayParcelCutter?.length && (
                                      <button
                                        className="btn"
                                        onClick={() => {
                                          plan.openPopup(
                                            this.props,
                                            true,
                                            index,
                                            () => {
                                              this.setState(
                                                {
                                                  plan,
                                                },
                                                () => {
                                                  this.setToStore();
                                                }
                                              );
                                            }
                                          );
                                        }}
                                      >
                                        {"تعديل الشطفات"}
                                      </button>
                                    )}
                                  </td>

                                  {!plan.isValidCondition(
                                    this.props,
                                    parcel
                                  ) && (
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
                      pageSize={plan.pageSize}
                      current={plan.currentParcelPage}
                      total={
                        plan?.uplodedFeatures[plan.selectedCADIndex]
                          ?.shapeFeatures?.landbase?.length || 0
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
                        {plan.statisticsParcels
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
                                        [2322, 3099].indexOf(
                                          plan.current_step
                                        ) != -1 && parcel.is_cut == 2
                                          ? false
                                          : true
                                      }
                                      onChange={this.investalChange.bind(
                                        this,
                                        plan.statisticsParcels.findIndex(
                                          (r) => r.name == parcel.name
                                        ) || -1
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
                    {plan.statisticsParcels.map((parcel, index) => {
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
                      {plan.detailsParcelTypes.map((detail, index) => {
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
                                                  plan.TotalParcelArea) *
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
                                    (detail.usingTypeArea /
                                      plan.TotalParcelArea) *
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
                                plan.streets?.reduce(function (a, b) {
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
