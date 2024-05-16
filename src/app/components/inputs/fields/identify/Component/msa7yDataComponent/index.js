import React, { Component } from "react";
import { esriRequest, getMapInfo } from "../common/esri_request";
import {
  DrawGraphics,
  createFeatureLayer,
  getInfo,
  queryTask,
  addParcelNo,
  project,
  resizeMap,
} from "../common/common_func";
import { StickyContainer, Sticky } from "react-sticky";

import {
  geometryServiceUrl,
  // mapUrl,
  Municipality_Boundary,
  UrbanAreaBoundary,
} from "../mapviewer/config/map";
import { Select, Button, Form, message, Checkbox } from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import MapBtnsComponent from "../MapBtnsComponent";
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
} from "lodash";
import { LoadModules } from "../common/esri_loader";
import axios from "axios";
import label from "../../../label";
class Msa7yDataComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapLoaded: false,
      mapObj: null,
      legendItems: [],
      mapLayers: [],
      show: true,
    };

    if (props.init_data) {
      props.init_data(props);
    }
  }

  // componentDidUpdate() {
  //    const {mapObj, mapLayers} = this.state;
  //   // const {mainObject, input} = this.props;
  //   // if(input.value != "" && input.value.setMap && typeof(input.value.setMap) === 'function'){
  //   //   input.value.setMap(mapObj, mapLayers);
  //   // }
  //   // this.props.setCurrentMap(mapObj);
  //   // this.props.change("msa7yData.cadDetails", {
  //   //   cadData: null,
  //   //   mapObj: null,
  //   //   mapLayers: null,
  //   //   isKrokyUpdateContract: false,
  //   //   isUpdateContract:  false,
  //   //   isPlan: true,
  //   //   notify: true,
  //   //   hideDrag: false,
  //   //   justInvoked: true
  //   // });
  //   return true;
  // }

  refreshTocVisibilty = (mapObj, legendItems) => {
    var mapScale = mapObj.getScale();
    //visable layers in thier scale
    legendItems.forEach(function (layer) {
      let minScale = layer.minScale;
      let maxScale = layer.maxScale;

      if (
        (maxScale <= mapScale || maxScale == 0) &&
        (minScale >= mapScale || minScale == 0)
      ) {
        layer.disable = false;
      } else {
        layer.disable = "disableLabel";
      }
    });
  };

  dragLength(map, event) {
    console.log(event);
    map.getLayer("editlengthGraphicLayer").remove(event.graphic);

    addParcelNo(
      event.mapPoint,
      map,
      "" + event.graphic.attributes["text"],
      "editlengthGraphicLayer",
      30,
      null,
      event.graphic.attributes["angle"],
      null,
      {
        text: event.graphic.attributes["text"],
        angle: event.graphic.attributes["angle"],
      }
    );
    // });
  }

  dragParcelNumber = function (map, event) {
    map.getLayer("PacrelNoGraphicLayer").remove(event.graphic);
    addParcelNo(
      event.mapPoint,
      map,
      "" + event.graphic.attributes["text"],
      "PacrelNoGraphicLayer",
      25,
      null,
      event.graphic.attributes["angle"],
      null,
      {
        text: event.graphic.attributes["text"],
        angle: event.graphic.attributes["angle"],
      }
    );
  };

  moveBoundries(map) {
    window.onDragParcelLayer = [];
    window.onDragLengthLayer = [];
    window.onDragLengthLayer.push(this.dragLength.bind(this, map));
    map.disablePan();
  }

  // moveParcelNumber(map) {
  //   //mapServ.onClickLengthLayer = [];
  //   window.onDragLengthLayer = [];
  //   window.onDragParcelLayer = [];
  //   window.onDragParcelLayer.push(this.dragParcelNumber.bind(this, map));
  //   map.disablePan();
  // }

  mapLoaded = (map) => {
    const { legendItems, mapLayers } = this.state;
    const {
      mainObject,
      baseMapUrl,
      input: { value, onChange },
    } = this.props;
    this.props.setMap(map);
    this.map = map;
    getMapInfo(baseMapUrl).then((response) => {
      // window.mapUrl

      var obj = {};
      response.info.$legends.forEach((legend) => {
        if (legend.visible) {
          // createFeatureLayer(legend.layerId,legend.layerName,legend.isHidden,legend.visible, (featureLayer) => {
          //   featureLayer.id = legend.layerName;
          //   featureLayer.name = legend.layerName;
          //   map.addLayer(featureLayer);
          // })

          //obj["checkbox" + legend.layerId] = legend.visible;
          let legendItem = value?.legendItems?.find(
            (legendItem) => legendItem?.layerId == legend?.layerId
          );
          if (legendItem) {
            legend.visible = legendItem?.visible;
          }
          obj["checkboxArrow" + legend.layerId] = "fa fa-caret-left ";

          if (response.layersSetting[legend.layerName]) {
            legend.name = response.layersSetting[legend.layerName].name;
            legend.imgs = legend.legend;
            legend.show = false;
            legendItems.push(legend);
          }
        }
      });

      response.info.$layers.layers.map((layer, key) => {
        mapLayers.push(layer);
        map.addLayer(
          new esri.layers.FeatureLayer(
            mapUrl.replace("MapServer", "FeatureServer") +
              "/" +
              layer.id +
              "?token=" +
              window.esriToken,
            {
              id: layer.name,
              name: layer.name,
              mode: esri.layers.FeatureLayer.MODE_SELECTION,
              opacity: 0,
              type: "FeatureLayer",
              outFields: ["*"],
            }
          )
        );
      });

      this.moveBoundries(map);
      //this.moveParcelNumber(map);
      this.refreshTocVisibilty(map, legendItems);
      this.setState({
        mapLoaded: true,
        mapObj: map,
        mapInfo: response,
        ...obj,
        legendItems: legendItems,
        mapLayers: mapLayers,
      });
      onChange({ ...value, legendItems });
      this.refreshBasemap(map, legendItems);
      this.props.setCurrentMap(map);
      this.props.setMapLayers(mapLayers);

      if (this.props.init_after_mapLoaded)
        this.props.init_after_mapLoaded(this.props);
    });
  };

  extentChange = (map) => {
    const { legendItems } = this.state;

    this.refreshTocVisibilty(map, legendItems);
    this.setState({ legendItems: legendItems });
  };

  changeLayer = (legendItem, evt) => {
    const { mapObj, mapLoaded, mapInfo, legendItems } = this.state;

    const {
      input: { value, onChange },
    } = this.props;
    var obj = {};
    legendItems.forEach(function (layer) {
      if (legendItem.layerName == layer.layerName) {
        layer.visible = evt.target.checked;
      }
    });
    onChange({ ...value, legendItems });
    this.setState({ legendItems });
    this.refreshBasemap(mapObj, legendItems);
  };

  refreshBasemap = (mapObj, legendItems) => {
    var baseMap = mapObj.getLayer("basemap");
    baseMap.setVisibleLayers(
      legendItems.filter((layer) => layer.visible).map((layer) => layer.layerId)
    );
    baseMap.refresh();
  };

  expand = (legendItem, evt) => {
    //ng-class="{'fa-caret-down':layer.show,'fa-caret-left':!layer.show,'fa-caret-right':lang != 'ar'&amp;&amp;!layer.show}"

    // ["checkboxArrow" + legendItem.layerId]

    legendItem.show = !legendItem.show;
    this.setState({
      ["checkboxArrow" + legendItem.layerId]: legendItem.show
        ? "fa fa-caret-down"
        : "fa fa-caret-left",
    });
  };

  zoomToLayer = (layer, evt) => {
    const { mapObj, mapLoaded, mapInfo } = this.state;

    if (layer.minScale > 0 && layer.disable) {
      //
      var dpi = 96; //Set to resolution of your screen
      var scale = layer.minScale;
      var mapunitInMeters = 111319.5; //size of one degree at Equator. Change if you are using a projection with a different unit than degrees
      var newRes = scale / (dpi * 39.37 * mapunitInMeters);
      var newExtent = mapObj.extent.expand(newRes * 600);
      mapObj.setExtent(newExtent);
    }
  };

  render() {
    // "fa fa-caret-left fa-caret-right"
    const { mapLoaded, mapInfo, legendItems } = this.state;

    const { fullMapWidth } = this.props;

    return (
      <div>
        {!fullMapWidth && (
          <button
            className={
              !this.state.show
                ? `btn btn_dyn_sidebar_open`
                : `btn btn_dyn_sidebar_close`
            }
            onClick={() => {
              this.setState({ show: !this.state.show });
              setTimeout(() => {
                function convertPXToVW(px) {
                  return (
                    px *
                    (100 / document.documentElement.clientWidth)
                  ).toFixed(0);
                }
                var mapParentContainer =
                  document.getElementById("mapContainer");
                var mapContainer = document.getElementById("map");
                var maxWidth =
                  convertPXToVW(mapParentContainer.clientWidth) + "vw";
                mapContainer.style.width = maxWidth;
                var containers = document.getElementsByClassName("container");
                containers[0].style.maxWidth = maxWidth;
                containers[1].style.maxWidth = maxWidth;
                resizeMap(this.map);
              });
            }}
          >
            <i
              // style={{ fontSize: "2em" }}
              // onClick={this.closeSideMenu}
              className={
                this.state.show
                  ? `fas fa-chevron-right closeSideMenuArrow`
                  : `fas fa-chevron-left closeSideMenuArrow`
              }
            ></i>
          </button>
        )}
        <StickyContainer style={{ direction: "ltr" }} className="btn_dragable">
          <Sticky bottomOffset={80}>
            {({ style }) => (
              <MapBtnsComponent
                style={style}
                {...this.props}
              ></MapBtnsComponent>
            )}
          </Sticky>
        </StickyContainer>
        <div
          className={
            (!fullMapWidth &&
              (this.state.show
                ? "content-section implementation"
                : "adjust_left_content")) ||
            ""
          }
          // style={{ direction: "ltr" }}
        >
          {mapLoaded && !fullMapWidth && (
            <div
              style={{
                direction: "ltr",
                height: "445px",
              }}
              className={this.state.show ? "" : "hide_right_content"}
            >
              {legendItems.map((legendItem, k) => {
                return (
                  <div key={k}>
                    <div style={{ margin: "auto" }}>
                      <i
                        disabled={legendItem.disable}
                        className="fa fa-search-plus"
                        onClick={this.zoomToLayer.bind(this, legendItem)}
                      ></i>
                      <span>
                        <label
                          key={legendItem.layerId}
                          style={{
                            marginRight: "10px",
                            width: "70%",
                          }}
                        >
                          {legendItem.name}
                        </label>
                        <Checkbox
                          disabled={legendItem.disable}
                          name={legendItem.layerName}
                          onChange={this.changeLayer.bind(this, legendItem)}
                          checked={legendItem?.visible}
                        />
                        <i
                          className={
                            this.state["checkboxArrow" + legendItem.layerId]
                          }
                          style={{ marginLeft: "10px", marginRight: "10px" }}
                          onClick={this.expand.bind(this, legendItem)}
                        ></i>
                      </span>
                    </div>
                    <div
                      style={{ display: legendItem.show ? "block" : "none" }}
                    >
                      {legendItem.imgs.map((img) => {
                        return (
                          <div>
                            <img
                              src={
                                "data:" +
                                img.contentType +
                                ";base64," +
                                img.imageData
                              }
                              style={{ width: img.width, height: img.height }}
                            />
                            <label
                              style={{
                                width: "80%",
                                direction: "rtl",
                                paddingRight: "10px",
                              }}
                            >
                              {img.label}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <MapComponent
            mapload={this.mapLoaded.bind(this)}
            extentChange={this.extentChange.bind(this)}
            {...this.props}
          ></MapComponent>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Msa7yDataComponent);
