import React, { Component } from "react";
import {
  getMap,
  getIsMapLoaded,
  setIsMapLoaded,
} from "main_helpers/functions/filters/state";
import applyFilters from "main_helpers/functions/filters";
import {
  zoomToLayer,
  addParcelNo,
  zoomToFeature,
  convertToEnglish,
  convertToArabic,
  getObjectPath,
  getMapGraphics,
  resizeMap,
  getLayerId,
  queryTask,
  highlightFeature,
  getFeatureDomainName,
  clearGraphicFromLayer,
  checkImportedMainObject,
  selectMainObject,
} from "../common/common_func";
// import MoveOnMapSvg from "./move on map.svg";
// import { ReactComponent as MoveOnMapSvg } from "./moveonmap.svg";
import ReactDOM from "react-dom";
import Draggable from "react-draggable";
import { withTranslation } from "react-i18next";
import mapDispatchToProps from "main_helpers/actions/main";
import SvgComp from "./svgComp";
import { connect } from "react-redux";
import { isFunction, isEqual, map, isNumber } from "lodash";
import { Tooltip, Slider, message, Popover } from "antd";
import { host, filesHost } from "imports/config";
import { addedParcelMapServiceUrl, mapUrl } from "../mapviewer/config/map";
import { LoadModules } from "../common/esri_loader";
import ColorPicker from "rc-color-picker";
import Color from "rc-color-picker/lib/helpers/color";
import "rc-color-picker/assets/index.css";
import Content from "./descriptions/boundries";
import "./style.css";
import { StickyContainer, Sticky } from "react-sticky";
import { layersSetting } from "../mapviewer/config";
const mapBtnStyle = {
  background: "#34495e",
  margin: "5px",
};

const mapBtnWhiteForcolorStyle = {
  background: "#34495e",
  color: "#fff",
  margin: "5px",
};
const mapBtnWhiteForcolorMarginStyle = {
  background: "#34495e",
  color: "#fff",
  margin: "5px",
};
const mapInputsStyle = {
  width: "70px",
  background: "#fff",
  color: "#000",
};

const mappTools = {
  // background: "rgba(171,168,168,.18)",
  // borderBottom: "2px solid rgba(10,10,10,.15)",
  textAlign: "center",
  position: "relative",
  zIndex: 100,
};

class MapBtnsComponent extends Component {
  constructor(props) {
    super(props);
    this.map;
    this.state = {
      popUps: {
        editFonts: {
          visible: false,
          title: "",
          content: "",
        },
        moveLines: {
          visible: false,
          title: "",
          content: "",
        },
        editHeight: {
          visible: false,
          title: "",
          content: "",
        },
        editSelect: {
          visible: false,
          title: "",
          content: "",
        },
        activeDrags: 0,
        deltaPosition: {
          x: 0,
          y: 0,
        },
        controlledPosition: {
          x: -400,
          y: 200,
        },
        // showHide: {
        //   visible: false,
        //   title: "",
        //   content: "",
        // },
      },

      activeHeight: false,
      zoomfactor: props?.input?.value?.zoomfactor || 10,
      destroyTimer: null,
      selectedGraphics: [],
      drawToolbar: null,
      editToolbar: null,
      defaultFontSize: props?.input?.value?.defaultFontSize || 20,
      defaultFontRotation: props?.input?.value?.defaultFontRotation || 0,
      fontActive: false,
      isMouseDown: false,
      selectedGraphic: null,
      parcelNoMouseDownEvent: null,
      parcelNoMouseUpEvent: null,
      parcelNoMouseDragEvent: null,
      moveLayerClickEvent: null,
      selectedFontColor: new Color(
        props?.input?.value?.selectedFontColor?.color?._originalInput || "#36c"
      ),
    };
    this.isLoaded = true;
    this.hideLengths = false;
  }
  // state = {};

  handleDrag = (e, ui) => {
    const { x, y } = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      },
    });
  };

  onStart = () => {
    this.setState({ activeDrags: ++this.state.activeDrags });
  };

  onStop = () => {
    this.setState({ activeDrags: --this.state.activeDrags });
  };
  onDrop = (e) => {
    this.setState({ activeDrags: --this.state.activeDrags });
    if (e.target.classList.contains("drop-target")) {
      // alert("Dropped!");
      e.target.classList.remove("hovered");
    }
  };

  // shouldComponentUpdate(nextProps, nextState) {

  //   return (
  //     !isEqual(nextProps.input.value, this.props.input.value) ||
  //     !isEqual(nextProps.lang, this.props.lang) ||
  //     !isEqual(nextProps.forceUpdate, this.props.forceUpdate) ||
  //     true
  //   );
  // }

  // componentWillUnmount() {
  //
  //   this.UpdateStore();
  // }
  componentDidUpdate(oldProps, newProps) {
    if (this.isLoaded) {
      this.map = getMap();
      if (getIsMapLoaded()) {
        //setIsMapLoaded(false);
        this.map.on("click", (evt) => {
          if (this.state["editToolbar"] != null) {
            this.state["editToolbar"].deactivate();
            this.state["editToolbar"] = null;
          }
        });
        this.map.on("pan", (evt) => {
          this.resizeFontByJS("defaultFontSize");
          //this.map.graphics.refresh();
        });
        this.map.on("pan-end", (evt) => {
          this.resizeFontByJS("defaultFontSize");
          // selectMainObject(this.props)?.data_msa7y?.msa7yData?.mapviewer?.mapGraphics.forEach((layer) => {
          //   let _layer = this.map.getLayer(layer?.layerName);
          //   _layer?.refresh();
          // });
          this.map.setScale(this.map.getScale() + 0.005);
          setTimeout(() => {
            this.map.setScale(this.map.getScale() - +0.005);
          }, 100);
          this.map.resize();
          this.map.reposition();
        });

        var scrollTimer = -1;
        var pageContainer = document.getElementsByClassName("wizard-container");
        pageContainer[0].addEventListener("scroll", (e) => {
          if (scrollTimer != -1) clearTimeout(scrollTimer);
          scrollTimer = window.setTimeout(() => {
            this.map.resize();
            this.map.reposition();
          }, 500);
        });
        this.isLoaded = false;
        setTimeout(() => {
          function convertPXToVW(px) {
            return px * (100 / document.documentElement.clientWidth);
          }
          var mapContainer = document.getElementById("map");
          var mapHeight =
            +mapContainer?.style?.height?.replace("vh", "") || "100";
          var mapWidth =
            +mapContainer?.style?.width?.replace("vw", "") ||
            convertPXToVW(this.map?.width);
          this.state["mapHeight"] = mapHeight;
          this.state["mapWidth"] = mapWidth;
          // this.UpdateStore();
        }, 0);
      }
    }

    return true;
  }

  mouseDownEvent = (event) => {
    this.state["selectedGraphic"] = event.graphic;
    this.state["isMouseDown"] = true;
  };

  mouseUpEvent = (event) => {
    this.state["selectedGraphic"] = null;
    this.state["isMouseDown"] = false;
  };

  mouseDragEvent = (event) => {
    if (window.onDragParcelLayer && this.state["isMouseDown"]) {
      window.onDragParcelLayer.forEach((fun) => {
        fun(event);
      });
    }
  };

  zoom = (zoomType, timeout, map) => {
    var graphics = [];
    Object.keys(this.map._layers).forEach((_layerKey) => {
      if (typeof this.map.getLayer(_layerKey).refresh == "function") {
        this.map.getLayer(_layerKey).refresh();
        if (["basemap", "map_graphics"].indexOf(_layerKey.toLowerCase()) == -1)
          graphics.push.apply(graphics, this.map.getLayer(_layerKey).graphics);
      }
    });
    if (graphics && graphics.length > 0) {
      //&& this.state["zoomfactor"] > 0
      var zoomFactor =
        zoomType == "+"
          ? -+this.state["zoomfactor"]
          : +this.state["zoomfactor"];
      this.map.setScale(this.map.getScale() + zoomFactor);
    } else {
      if (zoomType == "+") {
        map.setZoom(0);
      } else {
        map.setZoom(1);
      }
    }
  };

  enableNavigation = () => {
    this.map = getMap();
    this.map.enableMapNavigation();
    this.disableTools(false, false, false, false);
  };
  zoomtoStallite = () => {
    this.map = getMap();

    if (this.map && this.map._maxScale) this.map.setScale(this.map._maxScale);
  };

  openSwipeLayer = () => {
    this.map = getMap();
    LoadModules(["esri/dijit/LayerSwipe"]).then(([LayerSwipe]) => {
      if (!document.getElementById("swipeDiv")) {
        var iDiv = document.createElement("div");
        iDiv.id = "swipeDiv";
        iDiv.className = "block";
        var div2 = document.getElementById("map_root");
        div2.appendChild(iDiv);
        var swipeLayer = this.map.getLayer("basemap");

        this.swipeWidget = new LayerSwipe(
          {
            type: "vertical",
            map: this.map,
            layers: [swipeLayer],
          },
          "swipeDiv"
        );

        this.swipeWidget.startup();
      } else {
        this.swipeWidget.destroy();
      }
    });
  };

  downloadCad = (props) => {
    let mainObject = selectMainObject(this.props);
    const formValues = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });
    let image_uploader =
      this.props.values?.image_uploader ||
      (props.currentStep != "tadkek_data_Msa7y" &&
        mainObject?.data_msa7y?.msa7yData?.image_uploader) ||
      (props.currentStep == "tadkek_data_Msa7y" &&
        (mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData?.image_uploader ||
          formValues?.tadkek_msa7yData?.image_uploader)) ||
      "";
    let image_uploader1 =
      this.props.values?.image_uploader1 ||
      mainObject?.data_msa7y?.msa7yData?.image_uploader1;
    let image_uploader2 =
      this.props.values?.image_uploader2 ||
      mainObject?.data_msa7y?.msa7yData?.image_uploader2;
    let image_uploader3 =
      this.props.values?.image_uploader3 ||
      mainObject?.data_msa7y?.msa7yData?.image_uploader3;

    if (image_uploader1 && image_uploader2 && image_uploader3) {
      window.open(`${filesHost}/${image_uploader3}`, "_blank");
    }

    if (image_uploader1 && image_uploader2 && !image_uploader3) {
      window.open(`${filesHost}/${image_uploader2}`, "_blank");
    }

    if (image_uploader1 && !image_uploader2 && !image_uploader3) {
      window.open(`${filesHost}/${image_uploader1}`, "_blank");
    }

    if (image_uploader) {
      //var filename = values.image_uploader.substring(values.image_uploader.lastIndexOf('\\')+1);
      window.open(`${filesHost}/${image_uploader}`, "_blank");
    }
    this.disableTools(false, false, false, false);
  };

  changefontColor = (color, isDefault) => {
    const { resizableLayer } = this.props;
    if (resizableLayer) {
      if (this.state["selectedGraphics"]) {
        this.state["selectedGraphics"].forEach((graphic) => {
          if (!Array.isArray(resizableLayer)) {
            this.applyFontColor(resizableLayer, graphic, color, isDefault);
          } else {
            map(resizableLayer, (layer) => {
              this.applyFontColor(layer, graphic, color, isDefault);
            });
          }
        });
      }
    }

    this.UpdateStore();
  };
  handlePopUp(popUpKey, title, content, item) {
    this.setState((prevState) => ({
      popUps: {
        ...prevState.popUps,
        [popUpKey]: {
          visible: prevState?.popUps && !prevState?.popUps[popUpKey]?.visible,
          content: <Content data={content} />,
          title: title,
        },
      },
    }));
  }
  changeState(popUpKey) {
    this.setState((prevState) => ({
      popUps: {
        ...prevState.popUps,
        [popUpKey]: {
          visible: false,
        },
      },
    }));
  }

  applyFontColor = (layer, graphic, color, isDefault) => {
    if (this.map.getLayer(layer).graphics.indexOf(graphic) != -1) {
      this.map.getLayer(layer).remove(graphic);

      if (!isDefault) {
        graphic.symbol.oldColor = color;
        graphic.symbol.color = color;
      } else {
        graphic.symbol.color = graphic.symbol.oldColor || graphic.symbol.color;
      }

      this.map.getLayer(layer).add(graphic);
    }
  };

  fontRotated = (value) => {
    const { resizableLayer } = this.props;
    if (resizableLayer) {
      this.state["defaultFontRotation"] = value;
      this.state["activeHeight"] = false;
      this.UpdateStore();

      if (this.state["selectedGraphics"]) {
        this.state["selectedGraphics"].forEach((graphic) => {
          if (!Array.isArray(resizableLayer)) {
            this.applyFontRotation(resizableLayer, graphic);
          } else {
            map(resizableLayer, (layer) => {
              this.applyFontRotation(layer, graphic);
            });
          }
        });

        this.resizeFontByJS("defaultFontSize");
      }
    }
  };

  applyFontRotation = (layer, graphic) => {
    if (this.map.getLayer(layer).graphics.indexOf(graphic) != -1) {
      this.map.getLayer(layer).remove(graphic);
      graphic.symbol.setAngle(+this.state["defaultFontRotation"]);
      graphic.symbol.setSize(+this.state["defaultFontSize"]);
      this.map.getLayer(layer).add(graphic);
    }
  };

  fontChanged = (sizeValue, rotationValue) => {
    const { resizableLayer } = this.props;
    if (resizableLayer) {
      this.state["defaultFontSize"] = sizeValue;
      this.state["defaultFontRotation"] = rotationValue;
      if (this.state["selectedGraphics"]) {
        this.state["selectedGraphics"].forEach((graphic) => {
          if (!Array.isArray(resizableLayer)) {
            this.applyFontRotation(resizableLayer, graphic);
          } else {
            map(resizableLayer, (layer) => {
              this.applyFontRotation(layer, graphic);
            });
          }
        });

        this.resizeFontByJS("defaultFontSize");
      }
    }
    this.UpdateStore();
  };

  resizeFontByJS = (stateName) => {
    // setTimeout(() => {
    //   Object.values(
    //     document.querySelectorAll(`text[font-size="${+this.state[stateName]}"]`)
    //   ).map((elem) => {
    //     elem.setAttribute(
    //       "style",
    //       `font-size: ${+this.state[stateName]}px !important;`
    //     );
    //   });
    // });
  };

  inputChanged = (stateName, operator, isInputChanged, evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    const {
      input: { value, onChange },
    } = this.props;
    this.state[stateName] =
      (!isInputChanged &&
        (operator == "+"
          ? +this.state[stateName] + 5
          : +this.state[stateName] - 5)) ||
      (!isNaN(evt.target.value) && evt.target.value) ||
      this.state[stateName];
    var mapContainer = document.getElementById("map");
    mapContainer.style.width = `${this.state["mapWidth"]}vw`;
    mapContainer.style.height = `${this.state["mapHeight"]}vh`;

    var containers = document.getElementsByClassName("container");
    containers[0].style.maxWidth = `${this.state["mapWidth"]}vw`;
    containers[1].style.maxWidth = `${this.state["mapWidth"]}vw`;
    resizeMap(this.map);
    this.disableTools(true, false, false, false);
  };

  dragLength(event) {
    console.log(event);
    this.map.getLayer("editlengthGraphicLayer").remove(event.graphic);
    event.graphic.geometry.x = event.mapPoint.x;
    event.graphic.geometry.y = event.mapPoint.y;
    event.graphic.symbol.setSize(+this.state["defaultFontSize"]);
    this.map.getLayer("editlengthGraphicLayer").add(event.graphic);
    this.resizeFontByJS("defaultFontSize");
    this.UpdateStore();
  }

  drawOnClick = (event) => {
    var scope = this;
    var editGraphic = event.graphic;
    const { t } = this.props;
    var fields = {
      number: {
        label: t("labels:EDITPARCELLENGTH"),
        placeholder: t("labels:EDITPARCELLENGTHPLACHHOLDER"),
        field: "inputNumber",
        required: true,
      },
    };
    var num = convertToEnglish(editGraphic.symbol.text);
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { number: num },
          ok(values) {
            scope.map.getLayer("editlengthGraphicLayer").remove(editGraphic);
            if (values.number > 0) {
              addParcelNo(
                editGraphic.geometry,
                scope.map,
                "" + convertToArabic((+values.number).toFixed(2)) + "",
                "editlengthGraphicLayer",
                editGraphic.symbol?.font?.size || 20,
                editGraphic.symbol.color || null,
                editGraphic.symbol.angle || 0,
                null,
                {
                  text: (+values.number).toFixed(2),
                  angle: editGraphic.symbol.angle,
                }
              );
            }
            scope.UpdateStore();
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  dragParcelNumber = (event) => {
    event.stopPropagation();
    this.map
      .getLayer("PacrelNoGraphicLayer")
      .remove(this.state["selectedGraphic"]);
    this.state["selectedGraphic"].geometry.x = event.mapPoint.x + 10;
    this.state["selectedGraphic"].geometry.y = event.mapPoint.y;
    this.state["selectedGraphic"].symbol.setSize(
      +this.state["defaultFontSize"]
    );
    this.map
      .getLayer("PacrelNoGraphicLayer")
      .add(this.state["selectedGraphic"]);

    this.resizeFontByJS("defaultFontSize");
  };

  findPointsInExtent = (extent) => {
    const { resizableLayer } = this.props;
    this.state["activeHeight"] = false;
    if (resizableLayer) {
      var selectedGraphics = [];
      if (!Array.isArray(resizableLayer)) {
        dojo.forEach(this.map.getLayer(resizableLayer).graphics, (graphic) => {
          if (extent.geometry.contains(graphic.geometry)) {
            selectedGraphics.push(graphic);
          }
        });
      } else {
        map(resizableLayer, (layer) => {
          dojo.forEach(this.map.getLayer(layer).graphics, (graphic) => {
            if (extent.geometry.contains(graphic.geometry)) {
              selectedGraphics.push(graphic);
            }
          });
        });
      }

      this.changefontColor("", true);

      this.setState({
        selectedGraphics: selectedGraphics,
      });

      this.changefontColor(
        {
          r: this.state["selectedFontColor"].RGB[0],
          g: this.state["selectedFontColor"].RGB[1],
          b: this.state["selectedFontColor"].RGB[2],
          a: 1,
        },
        false
      );

      // (selectedGraphics.length > 0 &&
      //   selectedGraphics[0]?.symbol?.font?.size) ||
      this.fontChanged(
        this.state["defaultFontSize"],
        (selectedGraphics.length > 0 && selectedGraphics[0]?.symbol?.angle) || 0
      );
    }
  };

  disableTools(activeHeight, fontActive, enableDrawTool, enableEditTool, info) {
    if (info) message.success(info, 10);
    this.map.resize();
    this.map.reposition();
    if (this.state["drawToolbar"] && !enableDrawTool) {
      this.state["drawToolbar"].deactivate();
      this.state["drawToolbar"] = null;
    }
    if (this.state["editToolbar"] && !enableEditTool) {
      this.state["editToolbar"].deactivate();
      this.state["editToolbar"] = null;
    }
    this.state["activeHeight"] = activeHeight;
    this.state["fontActive"] = fontActive;
    this.changefontColor("", true);
    this.fontChanged(
      this.state["defaultFontSize"],
      this.state["defaultFontRotation"]
    );
    window.onClickLengthLayer = [];
    window.onClickAddFeatureOnLayer = [];
    window.onClickDeleteFeatureOnLayer = [];
    window.onDragLengthLayer = [];
    window.onDragParcelLayer = [];
    window.onClickFontLayer = [];
    this.setState({
      selectedGraphics: [],
    });
  }

  addFeature = () => {
    this.disableTools(false, false, false, false);
    if (!window.onClickAddFeatureOnLayer.length) {
      window.onClickAddFeatureOnLayer.push(
        this.addEditlengthGraphicLayerFeature.bind(this)
      );
    } else {
      window.onClickAddFeatureOnLayer.pop();
    }
  };
  deleteFeature = () => {
    this.disableTools(false, false, false, false);
    if (!window.onClickDeleteFeatureOnLayer.length) {
      window.onClickDeleteFeatureOnLayer.push(
        this.deleteEditlengthGraphicLayerFeature.bind(this)
      );
    } else {
      window.onClickDeleteFeatureOnLayer.pop();
    }
  };

  addEditlengthGraphicLayerFeature = (event) => {
    let point;
    let symbol;
    let graphic;
    if (
      !event?.graphic ||
      (event?.graphic && event?.graphic?.geometry?.type != "point")
    ) {
      point = new esri.geometry.Point(event.mapPoint);
      symbol = new esri.symbol.TextSymbol("");
      graphic = esri.Graphic(point, symbol);
      event.graphic = graphic;
    } else {
      graphic = event.graphic;
    }
    graphic?.symbol?.setSize(+this.state["defaultFontSize"]);
    this.map.getLayer("editlengthGraphicLayer").add(graphic);
    this.resizeFontByJS("defaultFontSize");
    this.UpdateStore();
    this.drawOnClick(event);
  };
  deleteEditlengthGraphicLayerFeature = (event) => {
    if (event.graphic) {
      this.map.getLayer("editlengthGraphicLayer").remove(event.graphic);
    }
  };

  moveFeatures = () => {
    let enableEditTool = false;
    const { moveLayer } = this.props;
    if (moveLayer) {
      LoadModules([
        "esri/toolbars/edit",
        "dojo/_base/event",
        "esri/tasks/GeometryService",
        "esri/tasks/ProjectParameters",
        "esri/SpatialReference",
      ]).then(
        ([
          Edit,
          event,
          GeometryService,
          ProjectParameters,
          SpatialReference,
        ]) => {
          if (!this.state["editToolbar"]) {
            this.map.disablePan();
            enableEditTool = true;

            this.state["editToolbar"] = new Edit(this.map);

            if (!Array.isArray(moveLayer)) {
              this.applyMoveEventonGraphic(moveLayer, event);
            } else {
              map(moveLayer, (layer) => {
                this.applyMoveEventonGraphic(layer, event);
              });
            }
          }

          this.disableTools(false, false, false, enableEditTool);
        }
      );
    }
  };

  applyMoveEventonGraphic = (layer, event) => {
    if (this.map.getLayer(layer).graphics) {
      let onLayerClick = (evt) => {
        event.stop(evt);
        if (this.state["editToolbar"]) {
          var tool = 0;
          tool = tool | esri.toolbars.Edit.MOVE;
          // tool = tool | esri.toolbars.Edit.SCALE;
          // tool = tool | esri.toolbars.Edit.ROTATE;
          // tool = tool | esri.toolbars.Edit.EDIT_TEXT;
          var options = {
            allowAddVertices: true,
            allowDeleteVertices: true,
            uniformScaling: true,
          };

          evt.graphic.geometry.spatialReference = this.map.spatialReference;
          evt.graphic._extent.spatialReference = this.map.spatialReference;
          this.state["editToolbar"].activate(tool, evt.graphic, options);
        }
      };
      if (this.state[`${layer}ClickEvent`]) {
        dojo.disconnect(this.state[`${layer}ClickEvent`]);
        this.state[`${layer}ClickEvent`] = null;
      }
      this.state[`${layer}ClickEvent`] = dojo.connect(
        this.map.getLayer(layer),
        "onClick",
        onLayerClick
      );
    }
  };

  resizeParcelNumberFont = () => {
    let enableDrawTool = false;
    this.state["fontActive"] = false;
    LoadModules(["esri/toolbars/draw"]).then(([Draw]) => {
      if (!this.state["drawToolbar"]) {
        this.state["fontActive"] = true;
        this.map.disablePan();
        enableDrawTool = true;

        this.state["drawToolbar"] = new Draw(this.map);
        this.state["drawToolbar"].on("draw-end", this.findPointsInExtent);
        this.state["drawToolbar"].activate(Draw.EXTENT);
      }

      this.disableTools(false, this.state["fontActive"], enableDrawTool, false);
    });
  };

  selectOnMap = () => {
    let enableDrawTool = false;
    LoadModules(["esri/toolbars/draw"]).then(([Draw]) => {
      if (!this.state["drawToolbar"]) {
        this.map.disablePan();
        enableDrawTool = true;

        this.state["drawToolbar"] = new Draw(this.map);
        this.state["drawToolbar"].on("draw-end", this.findFeaturesInExtent);
        this.state["drawToolbar"].activate(Draw.EXTENT);

        this.map.on("click", this.findFeaturesInExtent);
      }
    });
  };

  findFeaturesInExtent = (extent) => {
    const { selectMapLayer } = this.props;

    let layerdId = getLayerId(this.map.__mapInfo, selectMapLayer);

    if (layerdId) {
      queryTask({
        url: this.map.getLayer("basemap").url.split("?")[0] + "/" + layerdId,
        geometry: extent.mapPoint || extent.geometry,
        outFields: layersSetting[selectMapLayer].outFields,
        queryWithGemoerty: true,
        returnGeometry: true,
        bufferDistance: 0.1,
        callbackResult: ({ features }) => {
          if (features.length > 0) {
            clearGraphicFromLayer(this.map, "SelectGraphicLayer");
            clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
            clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
            clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");

            highlightFeature(features, this.map, {
              layerName: "ZoomGraphicLayer",
              isZoom: true,
              isHighlighPolygonBorder: true,
              zoomFactor: 20,
            });

            getFeatureDomainName(
              features,
              layerdId,
              null,
              this.map.getLayer("basemap").url.split("?")[0]
              //addedParcelMapServiceUrl
            ).then((r) => {
              this.props.setSelectedFeaturesOnMap(r);
            });
          }
        },
        callbackError(error) {},
      });
    } else {
      window.notifySystem("error", "يجب عليك اختيار الطبقة أولًا");
    }
  };

  moveBoundries() {
    this.disableTools(false, false, false, false);
    window.onDragLengthLayer.push(this.dragLength.bind(this));
    this.map.disablePan();
  }

  editBoundries = () => {
    this.disableTools(false, false, false, false);
    window.onClickLengthLayer.push(this.drawOnClick.bind(this));
  };

  moveParcelNumber = () => {
    this.disableTools(false, false, false, false);
    window.onDragParcelLayer.push(this.dragParcelNumber.bind(this));
    this.state["parcelNoMouseDownEvent"] = this.map
      .getLayer("PacrelNoGraphicLayer")
      .on("mouse-down", this.mouseDownEvent);

    this.state["parcelNoMouseUpEvent"] = this.map
      .getLayer("PacrelNoGraphicLayer")
      .on("mouse-up", this.mouseUpEvent);

    this.state["parcelNoMouseDragEvent"] = this.map
      .getLayer("PacrelNoGraphicLayer")
      .on("mouse-drag", this.mouseDragEvent);
    this.map.disablePan();
  };

  // resizeParcelNumberFont = () => {
  //   window.onClickLengthLayer = [];
  //   window.onDragLengthLayer = [];
  //   window.onDragParcelLayer = [];
  //   window.onClickFontLayer = [];
  //   window.onClickFontLayer.push(this.resizeParcelNumber.bind(this));
  //   this.map.disablePan();
  // };

  showLengths = (isShowLength) => {
    this.disableTools(false, false, false, false);
    if (this.map.getLayer("editlengthGraphicLayer")) {
      this.map
        .getLayer("editlengthGraphicLayer")
        .graphics.forEach((graphic) => {
          graphic.visible = isShowLength;
        });
      this.map.getLayer("editlengthGraphicLayer").redraw();
    }
  };

  forceBaseMapRendering = () => {
    var newBaseMapLayer = new esri.layers.ArcGISDynamicMapServiceLayer(
      mapUrl + "?token=" + window.esriToken,
      {
        id: "basemap",
        refreshInterval: 0.1,
        disableClientCaching: true,
      }
    );

    this.map.addLayer(newBaseMapLayer);

    this.map.reorderLayer(newBaseMapLayer, 0);
  };

  refreshBaseMap = () => {
    var elms = document.querySelectorAll("[id='map_basemap']");
    for (var i = 0; i < elms.length; i++) {
      elms[i].remove();
    }
    var baseMap = this.map.getLayer("basemap");
    if (baseMap) {
      this.map.removeLayer(baseMap);
      this.state["destroyTimer"] = setTimeout(() => {
        clearTimeout(this.state["destroyTimer"]);
        this.forceBaseMapRendering();
      }, 1000);
    } else {
      this.forceBaseMapRendering();
    }
  };

  changeHandler = (colors) => {
    this.state["selectedFontColor"] = new Color(colors.color);
    this.changefontColor(
      {
        r: this.state["selectedFontColor"].RGB[0],
        g: this.state["selectedFontColor"].RGB[1],
        b: this.state["selectedFontColor"].RGB[2],
        a: 1,
      },
      false
    );
    this.fontChanged(
      this.state["defaultFontSize"],
      this.state["defaultFontRotation"]
    );
  };

  setFontStates = (currentFontSize, currentFontRotation) => {
    this.state["defaultFontSize"] = currentFontSize;
    this.state["defaultFontRotation"] = currentFontRotation;
    this.UpdateStore();
  };

  UpdateStore = () => {
    const { input } = this.props;
    let inputChangedValue = {
      ...input?.value,
      activeHeight: this.state["activeHeight"],
      fontActive: this.state["fontActive"],
      mapHeight: this.state["mapHeight"],
      mapWidth: this.state["mapWidth"],
      zoomfactor: this.state["zoomfactor"],
      selectedFontColor: this.state["selectedFontColor"],
      defaultFontSize: this.state["defaultFontSize"],
      defaultFontRotation: this.state["defaultFontRotation"],
      mapScale: this.map.getScale(),
      mapGraphics: (this.map && getMapGraphics(this.map)) || [],
    };

    this.setState(inputChangedValue);
    input.onChange(inputChangedValue);
  };

  render() {
    const {
      input,
      mainObject,
      operations,
      cad,
      enableDownloadCad,
      enableSwipeLayer,
      t,
    } = this.props;
    console.log("mapHeight", this.state?.mapHeight);
    const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
    const { popUps, mapHeight, mapWidth } = this.state;
    // const titleComp = (
    //   <div>
    //     <h3>{title}</h3>
    //     <button
    //       className="btn btn"
    //       onClick={this.changeState.bind(this, popUpKey)}
    //     >
    //       dd
    //     </button>
    //   </div>
    // );

    return (
      <Draggable
        // onStop={this.onDrop}
        bounds={{
          top: -mapHeight * 7.9,
          left: -mapWidth * 7.9,
          right: mapWidth * 7.9,
          bottom: mapHeight * 7.9,
        }}
        {...dragHandlers}
        // positionOffset={{ x: "-10%", y: "-10%" }}
      >
        <div style={mappTools} dir="ltr">
          <div className="toolsOPr">
            {/*<Tooltip title="مقارنة الطبقات">
            {(isFunction(enableSwipeLayer)
              ? enableSwipeLayer(this.props)
              : enableSwipeLayer) && (
                <button
                  className="btn btn-default btn-sm"
                  style={mapBtnWhiteForcolorStyle}
                  type="button"
                  tooltip="مقارنة الطبقات"
                  onClick={this.openSwipeLayer.bind(this)}
                >
                  <span className="fa fa-columns"></span>
                </button>
              )}
              </Tooltip>*/}
            {this.state["fontActive"] && (
              <>
                <ColorPicker
                  color={this.state["selectedFontColor"].toHexString()}
                  alpha={100}
                  onChange={this.changeHandler}
                  placement="topLeft"
                  className="some-class"
                  enableAlpha={false}
                >
                  <button className="rc-color-picker-trigger"></button>
                </ColorPicker>

                <Tooltip title={"زاوية الخط"}>
                  <input
                    min={-360}
                    max={360}
                    className="quantity"
                    name="quantity"
                    value={this.state["defaultFontRotation"]}
                    type="number"
                    onInput={(evt) => {
                      this.fontChanged(
                        this.state["defaultFontSize"],
                        evt.target.value
                      );
                    }}
                    style={{
                      maxWidth: "50px",
                      textAlign: "center",
                      margin: "5px 0px 5px 15px",
                    }}
                  />
                  <Slider
                    min={-360}
                    max={360}
                    style={{
                      width: "100px",
                      display: "inline-block",
                      // margin: "20px 0px 0px 15px",
                    }}
                    value={this.state["defaultFontRotation"]}
                    defaultValue={0}
                    onChange={this.setFontStates.bind(
                      this,
                      this.state["defaultFontSize"]
                    )}
                    onAfterChange={this.fontChanged.bind(
                      this,
                      this.state["defaultFontSize"]
                    )}
                  />
                  <label style={{ margin: "5px 0px 5px 15px" }}>
                    زاوية الخط{" "}
                  </label>
                </Tooltip>
                <Tooltip title={"حجم الخط"}>
                  <div>
                    <input
                      min={0}
                      max={100}
                      className="quantity"
                      name="quantity"
                      value={this.state["defaultFontSize"]}
                      type="number"
                      onInput={(evt) => {
                        this.fontChanged(
                          evt.target.value,
                          this.state["defaultFontRotation"]
                        );
                      }}
                      style={{
                        maxWidth: "50px",
                        textAlign: "center",
                        margin: "5px 0px 5px 15px",
                      }}
                    />
                    <Slider
                      min={0}
                      max={100}
                      step={0.5}
                      style={{
                        width: "100px",
                        display: "inline-block",
                        // margin: "20px 0px 0px 15px",
                      }}
                      value={this.state["defaultFontSize"]}
                      defaultValue={0}
                      onChange={(value) => {
                        this.setFontStates(
                          value,
                          this.state["defaultFontRotation"]
                        );
                      }}
                      onAfterChange={(value) => {
                        this.fontChanged(
                          value,
                          this.state["defaultFontRotation"]
                        );
                      }}
                    />
                  </div>
                  <label style={{ margin: "5px 0px 5px 15px" }}>
                    حجم الخط{" "}
                  </label>
                </Tooltip>
              </>
            )}
          </div>
          {/* <> */}
          <div className="oprs">
            <Tooltip title={t("DownloadCAD")}>
              {(isFunction(enableDownloadCad)
                ? enableDownloadCad(this.props)
                : enableDownloadCad) && (
                <button
                  className="btn btn-default btn-sm"
                  style={mapBtnWhiteForcolorStyle}
                  type="button"
                  tooltip={t("DownloadCAD")}
                  onClick={this.downloadCad.bind(this, this.props)}
                >
                  <span className="fa fa-download"></span>
                </button>
              )}
            </Tooltip>
            {operations &&
              operations.length > 0 &&
              operations.map((item, index) => {
                return item.permission
                  ? item.permission(item)
                  : true && (
                      <Popover
                        content={popUps[item.btnFunctinality]?.content}
                        title={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <button
                              className="btn btn"
                              onClick={this.changeState.bind(
                                this,
                                item?.btnFunctinality
                              )}
                            >
                              X
                            </button>
                            <h3>{item?.tooltip}</h3>
                          </div>
                        }
                        className="mapbtns"
                        trigger="click"
                        visible={popUps[item.btnFunctinality]?.visible}
                        placement="bottom"
                        onVisibleChange={this.handlePopUp.bind(
                          this,
                          item.btnFunctinality,
                          item.tooltip,
                          item.content,
                          item
                        )}
                        destroyTooltipOnHide={true}
                      >
                        <Tooltip title={item.tooltip}>
                          <button
                            className="btn btn-default btn-sm"
                            style={mapBtnWhiteForcolorStyle}
                            type="button"
                            onClick={() => {
                              item.onClick(this);
                            }}
                          >
                            {/* {item.value} kk{item.icon} */}
                            <SvgComp path={item.icon} />
                          </button>
                        </Tooltip>
                      </Popover>
                    );
              })}
            {/* </> */}
            {/* <> */}

            <Tooltip title={t("Pan")}>
              <button
                className="btn btn-default btn-sm mapbtns"
                style={mapBtnWhiteForcolorStyle}
                type="button"
                onClick={this.enableNavigation.bind(this)}
              >
                <SvgComp path="map" />
              </button>
            </Tooltip>

            {this.state["activeHeight"] && (
              <>
                <button
                  onClick={this.inputChanged.bind(this, "mapWidth", "-", false)}
                  className="minus spinBin"
                ></button>
                <input
                  onInput={this.inputChanged.bind(this, "mapWidth", "-", true)}
                  className="quantity"
                  name="quantity"
                  value={this.state["mapWidth"]}
                  type="number"
                />
                <span className={"textAfter"}>{"(العرض)"}</span>
                <button
                  onClick={this.inputChanged.bind(this, "mapWidth", "+", false)}
                  className="plus spinBin"
                ></button>

                <button
                  onClick={this.inputChanged.bind(
                    this,
                    "mapHeight",
                    "-",
                    false
                  )}
                  className="minus spinBin"
                ></button>
                <input
                  onInput={this.inputChanged.bind(this, "mapHeight", "-", true)}
                  className="quantity"
                  name="quantity"
                  value={this.state["mapHeight"]}
                  type="number"
                />
                <span className={"textAfter"}>{"(الطول)"}</span>
                <button
                  onClick={this.inputChanged.bind(
                    this,
                    "mapHeight",
                    "+",
                    false
                  )}
                  className="plus spinBin"
                ></button>

                <Tooltip title={t("Edit")}>
                  <button
                    className="btn btn-default btn-sm"
                    style={mapBtnWhiteForcolorStyle}
                    type="button"
                    tooltip={t("Edit")}
                    onClick={() => {
                      this.disableTools(false, false, false, false);
                    }}
                  >
                    <span className="fa fa-floppy-o"></span>
                  </button>
                </Tooltip>
              </>
            )}

            <Tooltip title="إخفاء / إظهار أطوال الأضلاع">
              <button
                className="btn btn-default btn-sm"
                style={mapBtnWhiteForcolorStyle}
                type="button"
                tooltip="إخفاء / إظهار أطوال الأضلاع"
                onClick={() => {
                  this.showLengths(this.hideLengths);
                  this.hideLengths = !this.hideLengths;
                }}
              >
                <span className="fa fa-eye-slash"></span>
              </button>
            </Tooltip>
            <Tooltip title={t("editBoundries")}>
              {!this.state["activeHeight"] && (
                <button
                  className="btn btn-default btn-sm"
                  style={mapBtnWhiteForcolorStyle}
                  type="button"
                  tooltip={t("ZoomIn")}
                  onClick={() => {
                    this.disableTools(true, false, false, false);
                  }}
                >
                  <span className="fa fa-th-large"></span>
                </button>
              )}
            </Tooltip>

            <Tooltip title={t("ZoomOut")}>
              <button
                className="btn btn-sm"
                type="button"
                style={mapBtnWhiteForcolorStyle}
                name="name"
                value="-"
                onClick={() => {
                  this.map = getMap();
                  this.zoom("-", 0, this.map);
                  this.disableTools(false, false, false, false);
                }}
              >
                <span className="fa fa-minus"></span>
              </button>
            </Tooltip>

            <Tooltip title={t("ZoomIn")}>
              <button
                className="btn btn-sm"
                style={mapBtnWhiteForcolorStyle}
                type="button"
                name="name"
                onClick={() => {
                  this.map = getMap();
                  this.zoom("+", 0, this.map);
                  this.disableTools(false, false, false, false);
                }}
              >
                <span className="fa fa-plus"></span>
              </button>
            </Tooltip>
          </div>
        </div>
      </Draggable>
    );
  }
}

export default connect(() => {}, mapDispatchToProps)(
  withTranslation("actions")(MapBtnsComponent)
);
