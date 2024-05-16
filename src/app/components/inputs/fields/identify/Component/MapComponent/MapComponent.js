import React, { Component } from "react";
import {
  getInfo,
  objectPropFreqsInArray,
  getObjectPath,
  getMapGraphics,
  resizeMap,
  clearGraphicFromLayer,
  reverseString,
  localizeNumber,
  convertToArabic,
  selectMainObject,
  loadCurrentPlan,
  CreateCustomTileLayer,
} from "../common/common_func";
import { LoadModules } from "../common/esri_loader";
import { investMapUrl, mapUrl } from "../mapviewer/config/map";
import { setMap } from "main_helpers/functions/filters/state";
import applyFilters from "main_helpers/functions/filters";
class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.isGraphicsLoaded = true;
    window.onClickAddFeatureOnLayer = [];
    window.onClickDeleteFeatureOnLayer = [];
  }

  componentWillUnmount() {
    setMap(undefined);
  }

  componentDidUpdate() {
    if (this.map && this.props.input?.value?.isApplyTadkekMsa7yData) {
      this.props.input.value.isApplyTadkekMsa7yData = false;
      loadCurrentPlan(
        this.props,
        this.map,
        selectMainObject(this.props)?.data_msa7y?.msa7yData?.mapviewer
          ?.mapGraphics || null,
        true
      );
    }

    if (
      this.map &&
      [14].indexOf(
        this.props?.currentModule?.app_id ||
          this.props?.currentModule?.record?.app_id ||
          localStorage.getItem("appId")
      ) != -1 &&
      this.isGraphicsLoaded
    ) {
      this.isGraphicsLoaded = false;
      loadCurrentPlan(
        this.props,
        this.map,
        selectMainObject(this.props)?.data_msa7y?.msa7yData?.mapviewer
          ?.mapGraphics || null,
        true
      );
    }
  }

  componentDidMount() {
    this.mapId = this.props.mapId || "map";
    this.isShowZoomSlider = this.props.isShowZoomSlider;
    LoadModules([
      "esri/layers/GraphicsLayer",
      "esri/map",
      "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/layers/ArcGISTiledMapServiceLayer",
      "esri/geometry/Extent",
      "esri/layers/FeatureLayer",
    ]).then(
      ([
        GraphicsLayer,
        Map,
        ArcGISDynamicMapServiceLayer,
        ArcGISTiledMapServiceLayer,
        Extent,
        FeatureLayer,
      ]) => {
        this.ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer;
        this.GraphicsLayer = GraphicsLayer;
        this.Map = Map;
        this.Extent = Extent;
        this.FeatureLayer = FeatureLayer;
        this.ArcGISTiledMapServiceLayer = ArcGISTiledMapServiceLayer;

        let graphicsLayers = [
          { id: "SelectLandsGraphicLayer" },
          { id: "SelectGraphicLayer" },
          { id: "annotation" },
          {
            id: "boundriesDirectionToolTip",
            opacity: 0,
          },
          { id: "ZoomGraphicLayer" },
          { id: "BufferGraphicLayer" },
          { id: "addedParclGraphicLayer" },
          { id: "pictureGraphicLayer" },
          { id: "PacrelUnNamedGraphicLayer" },
          { id: "detailedGraphicLayer" },
          { id: "boundriesGraphicLayer" },
          { id: "boundriesDirection" },
          { id: "editlengthGraphicLayer" },
          { id: "boundriesDirectionToolTip" },
          { id: "highlightGraphicLayer" },
          { id: "highlightBoundriesGraphicLayer" },
          { id: "highlightDeletedGraphicLayer" },
          { id: "shatfaGraphicLayer" },
          { id: "PacrelNoGraphicLayer" },
          { id: "ParcelPlanNoGraphicLayer" },
        ];

        var mapParentContainer = document.getElementById("mapContainer");
        var mapContainer = document.getElementById(this.mapId);

        mapContainer.style.height =
          (this.props?.input?.value?.mapHeight ||
            ([16, 14].indexOf(
              this.props?.currentModule?.app_id ||
                this.props?.currentModule?.record?.app_id ||
                localStorage.getItem("appId")
            ) != -1
              ? "100"
              : [1, 8].indexOf(
                  this.props?.currentModule?.app_id ||
                    this.props?.currentModule?.record?.app_id ||
                    localStorage.getItem("appId")
                ) != -1
              ? "70"
              : // : [29].indexOf(
                //     this.props?.currentModule?.app_id ||
                //       this.props?.currentModule?.record?.app_id ||
                //       localStorage.getItem("appId")
                //   ) != -1 && this.props.currentStep == "data_msa7y"
                // ? "170"
                mapContainer.style.height)) + "vh";

        function convertPXToVW(px) {
          return px * (100 / document.documentElement.clientWidth); //.toFixed(0);
        }

        mapContainer.style.width =
          (this.props?.input?.value?.mapWidth ||
            convertPXToVW(mapParentContainer.clientWidth)) + "vw";

        this.map = new Map(this.mapId, {
          slider: (() => {
            return ["print", "gisservices", "tamlikakar", "addedparcel"].some(
              (d) => window.location.href.indexOf(d) > -1
            ) || this.isShowZoomSlider
              ? true
              : false;
          })(),
          //maxScale: this.props.maxScale,
          logo: false,
        });

        let mUrl = this.props?.baseMapUrl || mapUrl;

        this.map._maxScale = this.props.maxScale;

        this.map.extent = new Extent({
          xmin: 351074.79384063353,
          ymin: 2908411.351837893,
          xmax: 461736.99433170113,
          ymax: 2947768.2013849253,
          spatialReference: {
            wkid: 32639,
          },
        });

        if (this.props.isStatlliteMap || this.props.isGeographic) {
          //this.map.setBasemap("satellite");
          this.map.extent = new Extent({
            xmin: 5565121.73626563,
            ymin: 3047018.8544949857,
            xmax: 5581608.618197727,
            ymax: 3054625.640541891,
            spatialReference: {
              wkid: 102100,
            },
          });
        }

        var token = "";
        if (window.esriToken) token = "?token=" + window.esriToken;
        let app_id =
          this.props?.currentModule?.app_id ||
          this.props?.currentModule?.record?.app_id ||
          localStorage.getItem("appId");

        window.dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer(
          (this.props?.baseMapUrl || mapUrl) + token,
          {
            id: "basemap",
            refreshInterval: 0.1,
            disableClientCaching: true,
            visible:
              (app_id != 8 && true) ||
              (app_id == 8 && this.props.currentStep != "data_msa7y" && true) ||
              false,
          }
        );

        // ;
        // var baseLayer = new (CreateCustomTileLayer())(
        //   "https://mt1.google.com/vt/lyrs=s&hl=en&z={z}&x={x}&y={y}",
        //   {
        //     id: "mm",
        //     refreshInterval: 0.1,
        //     disableClientCaching: true,
        //     visible: true,
        //   }
        // );
        // this.map.addLayer(baseLayer);
        // ;

        if (this.props.isStatlliteMap) {
          window.stalliteLayer = new ArcGISDynamicMapServiceLayer(
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
            { id: "bs" }
          );

          this.map.addLayer(window.stalliteLayer);
        }

        this.map.addLayer(window.dynamicMapServiceLayer);

        graphicsLayers.forEach((layer) => {
          this.map.addLayer(this.createLayer(layer));
        });

        this.map
          .getLayer("editlengthGraphicLayer")
          .on("mouse-drag", function (event) {
            if (window.onDragLengthLayer) {
              window.onDragLengthLayer.forEach((fun) => {
                fun(event);
              });
            }
          });

        this.map
          .getLayer("shatfaGraphicLayer")
          .on("mouse-drag", function (event) {
            if (window.onDragShatfaLayer) {
              window.onDragShatfaLayer.forEach((fun) => {
                fun(event);
              });
            }
          });
        this.map
          .getLayer("editlengthGraphicLayer")
          .on("click", function (event) {
            if (window.onClickLengthLayer) {
              window.onClickLengthLayer.forEach(function (fun) {
                fun(event);
              });
            }
            if (window.onClickAddFeatureOnLayer.length) {
              window.onClickAddFeatureOnLayer.forEach(function (fun) {
                fun(event);
              });
            }
            if (window.onClickDeleteFeatureOnLayer.length) {
              window.onClickDeleteFeatureOnLayer.forEach(function (fun) {
                fun(event);
              });
            }
          });

        this.map.on("click", function (event) {
          if (window.onClickAddFeatureOnLayer.length) {
            window.onClickAddFeatureOnLayer.forEach(function (fun) {
              fun(event);
            });
          }
          if (window.onClickDeleteFeatureOnLayer.length) {
            window.onClickDeleteFeatureOnLayer.forEach(function (fun) {
              fun(event);
            });
          }
        });

        this.map.on("load", () => {
          this.props.mapload(this.map);

          var maxWidth = convertPXToVW(mapParentContainer.clientWidth) + "vw";
          var containers = document.getElementsByClassName("container");
          containers[0].style.maxWidth = maxWidth;
          containers[1].style.maxWidth = maxWidth;
          if (this.props.input && this.isGraphicsLoaded) {
            const {
              input: { value },
            } = this.props;

            loadCurrentPlan(
              this.props,
              this.map,
              value.mapGraphics,
              this.isGraphicsLoaded
            );
          }
        });

        const groupBy = (items, key) =>
          items.reduce(
            (result, item) => ({
              ...result,
              [item[key]]: [...(result[item[key]] || []), item],
            }),
            {}
          );
        if (this.props.input) {
          this.map.on("extent-change", () => {
            if (this.props.extentChange) {
              this.props.extentChange(this.map);
            }

            if (!this.isGraphicsLoaded) {
              let {
                input: { value, onChange },
              } = this.props;
              onChange({
                ...value,
                mapScale: this.map.getScale(),
              });
            }
          });

          // this.map.on("zoom-end", () => {
          //   const {
          //     input: { value },
          //   } = this.props;

          //   loadCurrentPlan(value);
          // });
        }
      }
    );
  }

  // loadCurrentPlan = (value) => {
  //   if (this.props.captureMapExtent) {
  //     this.props.captureMapExtent(this.map);
  //   }

  //   if (value) {
  //     setTimeout(() => {
  //       if (value?.mapGraphics?.length && this.isGraphicsLoaded) {
  //         value?.mapGraphics.forEach((layer) => {
  //           let _layer = this.map.getLayer(layer?.layerName);
  //           if (!_layer) {
  //             _layer = new esri.layers.GraphicsLayer();
  //             _layer.opacity = 1;
  //             _layer.id = layer?.layerName;
  //             if (layer.layerIndex) {
  //               this.map?.addLayer(_layer, layer.layerIndex);
  //             } else {
  //               this.map?.addLayer(_layer);
  //             }
  //           }

  //           if (_layer?.graphics?.length) {
  //             clearGraphicFromLayer(this.map, layer?.layerName);
  //           }
  //           layer?.graphics?.forEach((graphic) => {
  //             let shape;
  //             let symbol;
  //             if (graphic?.geometry?.paths) {
  //               shape = new esri.geometry.Polyline(graphic?.geometry);
  //               symbol = new esri.symbol.SimpleLineSymbol(graphic?.symbol);
  //             } else if (graphic?.geometry?.rings) {
  //               shape = new esri.geometry.Polygon(graphic?.geometry);
  //               symbol = new esri.symbol.SimpleFillSymbol(graphic?.symbol);
  //             } else if (graphic?.symbol?.type == "esriTS") {
  //               shape = graphic?.geometry.x != "NaN" && graphic?.geometry.y != "NaN" && new esri.geometry.Point(graphic?.geometry) || null;
  //               symbol = new esri.symbol.TextSymbol(graphic?.symbol);
  //             } else {
  //               shape = new esri.geometry.Point(graphic?.geometry);
  //               symbol = new esri.symbol.SimpleMarkerSymbol(graphic?.symbol);
  //             }

  //             //

  //             if (symbol.text) {
  //               //   if (symbol.text.indexOf("/") > -1) {
  //               //     symbol.text = reverseString(symbol.text);
  //               //   }
  //               //   else
  //               if (symbol.text.indexOf("\\") > -1) {
  //                 symbol.text = symbol.text.replaceAll("\\", "/");
  //                 //symbol.text = reverseString(symbol.text);
  //               }

  //               symbol.text = symbol.text
  //                 .split("/")
  //                 .map((element) => element.trim());
  //               symbol.text = convertToArabic(symbol.text.join(" / "));
  //             }

  //             if (shape) {
  //             _layer?.add(new esri.Graphic(shape, symbol, graphic?.attributes));
  //             }
  //           });
  //           _layer?.refresh();
  //         });

  //         //setTimeout(() => {
  //         resizeMap(
  //           this.map,
  //           [14, 1].indexOf(
  //             this.props?.currentModule?.app_id ||
  //               this.props?.currentModule?.record?.app_id ||
  //               localStorage.getItem("appId")
  //           ) != -1 && 10
  //         );
  //         window.dynamicMapServiceLayer?.refresh();
  //         //this.map.setScale(value?.mapScale);
  //         //}, 2000);
  //       }

  //       this.isGraphicsLoaded = false;
  //     }, 0);
  //   }
  // };

  createLayer = (layer) => {
    var out = null;

    if (layer.type === "ArcGISDynamicMapServiceLayer") {
      out = new this.ArcGISDynamicMapServiceLayer(layer.url);
    } else if (layer.type === "FeatureLayer") {
      out = new this.FeatureLayer(layer.url, {
        opacity: 0,
        id: layer.id,
        mode: layer.mode,
        outFields: layer.outFields || ["*"],
      });
    } else if (layer.type === "ArcGISTiledMapServiceLayer") {
      out = new this.ArcGISTiledMapServiceLayer(layer.url);
    } else {
      out = new this.GraphicsLayer();
    }

    out.opacity = layer.opacity || 1;
    out.id = layer.id;
    out.featureCollection = layer.featureCollection;
    return out;
  };

  render() {
    const { printStyle } = this.props;
    return (
      <div
        id={"mapContainer"}
        style={{
          width: "100%",
          boxShadow: "1px 1px 7px 0 rgba(12,4,4,.38)",
          // maxWidth: '100%'
        }}
      >
        <div
          id={this.props.mapId || "map"}
          className={printStyle ? "printStyle" : "normalStyle"}
        ></div>
      </div>
    );
  }
}

export default MapComponent;
