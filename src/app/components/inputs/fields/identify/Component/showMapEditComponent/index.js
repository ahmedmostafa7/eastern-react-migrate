import React, { Component } from "react";
import { Button, Checkbox, Tooltip } from "antd";
import { mapDispatchToProps, mapStateToProps } from "./maping";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  addParcelNo,
  clearGraphicFromLayer,
  convertToArabic,
  highlightFeature,
  zoomToFeature,
} from "../common/common_func";
import {
  addedParcelMapServiceUrl,
  editAndDeleteMapLayers,
} from "../mapviewer/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import MapComponent from "../MapComponent/MapComponent";
import { Sticky, StickyContainer } from "react-sticky";
import MapBtnsComponent from "../MapBtnsComponent";
import { getMapInfo } from "../common/esri_request";

const pageSize = 10;
class showMapEditComponent extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.isLoaded = true;
    this.editLayerName;

    this.state = {
      features: null,
      editFields: [],
      editFeature: {},
      current: 1,
      allFeatures: props?.mainObject?.editUpdateCreate?.editableFeatures || {},
      totalPage: 0,
      minIndex: 0,
      maxIndex: pageSize,
      selectedFeatures: [],
      isEditMultiple: false,
      mapLoaded: false,
      locationData: props?.mainObject?.locationData || null,
    };

    if (this.state.locationData) {
      this.state.allFeatures = {};
      this.state.allFeatures[
        props.mainObject.locationData.uploadFileDetails.layerName
      ] = { features: props.mainObject.mapEditFeatures.editableFeatures };
    }
  }

  formatNumber(num) {
    return (+num).toFixed(2).replace(/[.,]00$/, "");
  }

  zoomToFeature(feature) {
    highlightFeature(feature, this.map, {
      layerName: "ZoomGraphicLayer",
      isZoom: true,
      isHighlighPolygonBorder: true,
      zoomFactor: 20,
    });
  }

  drawEditableFeatures(features, layer) {
    let annotationField = editAndDeleteMapLayers[layer].outFields.find(
      (x) => x.isShowLabelOnMap
    );

    //clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");
    clearGraphicFromLayer(this.map, "ZoomGraphicLayer");

    features.forEach((f) => {
      let pt;

      if (f.geometry.type == "point") {
        pt = f.geometry;
      } else {
        pt = f.geometry.getExtent().getCenter();
      }
      /*addParcelNo(
                pt, this.map, convertToArabic(f.attributes[annotationField.name]),
                "ParcelPlanNoGraphicLayer", 40, [0, 0, 0]
            );*/

      var symbol;

      if (f.geometry.type === "point") {
        symbol = new esri.symbol.SimpleMarkerSymbol(
          esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
          28,
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([0, 0, 0]),
            2
          ),
          new esri.Color([0, 0, 0, 0.2])
        );
      } else if (f.geometry.type === "polyline") {
        symbol = new esri.symbol.SimpleLineSymbol(
          esri.symbol.SimpleLineSymbol.STYLE_SOLID,
          new esri.Color([0, 0, 0]),
          7
        );
      } else {
        symbol = new esri.symbol.SimpleFillSymbol(
          esri.symbol.SimpleFillSymbol.STYLE_NULL,
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.Color([0, 0, 0]),
            3
          ),
          new esri.Color([0, 0, 0])
        );
      }

      var graphic = new esri.Graphic(f.geometry, symbol, null);

      this.map.getLayer("ZoomGraphicLayer").add(graphic);
    });

    zoomToFeature(this.map.getLayer("ZoomGraphicLayer").graphics, this.map, 2);
  }

  drawInfoFeatures(allFeatures) {
    clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

    Object.keys(allFeatures).forEach((info) => {
      let annotationField = editAndDeleteMapLayers[info].outFields.find(
        (x) => x.isShowLabelOnMap
      );

      allFeatures[info].features.forEach((f) => {
        let pt;
        let tempGeometry;

        if (f.geometry.type == "polygon") {
          tempGeometry = new esri.geometry.Polygon(
            JSON.parse(JSON.stringify(f.geometry))
          );
        } else if (f.geometry.type == "point") {
          tempGeometry = new esri.geometry.Point(
            JSON.parse(JSON.stringify(f.geometry))
          );
        } else {
          tempGeometry = new esri.geometry.Polyline(
            JSON.parse(JSON.stringify(f.geometry))
          );
        }

        if (f.geometry.type == "point") {
          pt = tempGeometry;
        } else {
          pt = tempGeometry.getExtent().getCenter();
        }

        addParcelNo(
          pt,
          this.map,
          convertToArabic(f.attributes[annotationField.name]),
          "ParcelPlanNoGraphicLayer",
          40,
          [0, 0, 0]
        );
      });
    });
  }

  componentDidUpdate() {}

  onChangeSelectFeature = (index, feature, e) => {
    this.state.allFeatures[feature.layerName].features[index].isSelected =
      !this.state.allFeatures[feature.layerName].features[index].isSelected;

    let selectedFeatures = this.state.allFeatures[
      feature.layerName
    ].features.filter((x) => x.isSelected);

    if (selectedFeatures.length > 1) {
      this.setState({
        selectedFeatures: [...selectedFeatures],
        allFeatures: { ...this.state.allFeatures },
      });
    } else {
      this.setState({
        selectedFeatures: [],
        allFeatures: { ...this.state.allFeatures },
      });
    }
  };

  zoomToSelectedFeature = (layer) => {
    let features = [];

    this.state.allFeatures[layer].features.forEach((f, index) => {
      if (f.isSelected) {
        features.push(f);
      }
    });

    if (!features.length) {
      features = this.state.features;
    }

    this.drawEditableFeatures(features, layer);
  };

  removeSelectedFeatures = (layer) => {
    this.state.allFeatures[layer].isSelectAll = false;
    this.state.allFeatures[layer].selectedFeatures = [];
    this.state.allFeatures[layer].features = [
      ...this.state.allFeatures[layer].features.filter((x) => !x.isSelected),
    ];

    this.props.setEditableFeatures({ ...this.state.allFeatures });

    this.setState({
      allFeatures: { ...this.state.allFeatures },
    });
  };

  onChangeSelectAll = (layerName) => {
    this.state.allFeatures[layerName].isSelectAll =
      !this.state.allFeatures[layerName].isSelectAll;
    this.state.allFeatures[layerName].selectedFeatures = [];

    this.state.allFeatures[layerName].features.map((f) => {
      f.isSelected = this.state.allFeatures[layerName].isSelectAll;
    });
    this.setState({
      allFeatures: { ...this.state.allFeatures },
    });
  };

  handleChange = (page) => {
    this.setState({
      current: page,
      minIndex: (page - 1) * pageSize,
      maxIndex: page * pageSize,
    });
  };

  mapLoaded = (map) => {
    getMapInfo(addedParcelMapServiceUrl).then((response) => {
      map.__mapInfo = response;
      this.map = map;

      //
      this.setState({ mapLoaded: true });
      this.props.setCurrentMap(map);

      if (Object.keys(this.state.allFeatures).length > 0) {
        if (
          this.state?.allFeatures[Object.keys(this.state.allFeatures)[0]]
            ?.features?.length > 0
        ) {
          this.drawInfoFeatures(this.state.allFeatures);

          highlightFeature(
            this.state.allFeatures[Object.keys(this.state.allFeatures)[0]]
              .features,
            this.map,
            {
              layerName: "ZoomGraphicLayer",
              isZoom: true,
              isHighlighPolygonBorder: true,
              zoomFactor: 20,
            }
          );
        }
      }
    });
  };

  setSelectMapLayer = (layer) => {
    this.props.setSelectMapLayer(layer);
  };

  render() {
    const { allFeatures } = this.state;
    return (
      <div>
        <div>
          <div className="">
            <div>
              <StickyContainer style={{ direction: "ltr" }}>
                <Sticky bottomOffset={80}>
                  {({ style }) => (
                    <MapBtnsComponent
                      style={style}
                      {...this.props}
                    ></MapBtnsComponent>
                  )}
                </Sticky>
              </StickyContainer>
              <div>
                <MapComponent
                  mapload={this.mapLoaded.bind(this)}
                  {...this.props}
                ></MapComponent>
              </div>
            </div>
          </div>
        </div>

        {Object.keys(allFeatures).map((layer) => {
          return allFeatures[layer].features?.length ? (
            <div>
              <div
                style={{
                  background: "#57779d",
                  textAlign: "center",
                  padding: "5px",
                }}
              >
                <label
                  style={{
                    color: "white",
                    width: "90%",
                    float:
                      allFeatures[layer].isSelectAll ||
                      allFeatures[layer].selectedFeatures?.length > 1
                        ? "right"
                        : "none",
                    marginRight: "20px",
                    fontSize: "23px !important",
                  }}
                >
                  {editAndDeleteMapLayers[layer].name}
                </label>
                {(allFeatures[layer].isSelectAll ||
                  allFeatures[layer].selectedFeatures?.length > 1) && (
                  <Button
                    className="toolsBtnStyle"
                    size="large"
                    onClick={this.zoomToSelectedFeature.bind(this, layer)}
                  >
                    <FontAwesomeIcon icon={faSearchPlus} className="" />
                  </Button>
                )}
              </div>
              <table
                className="table table-bordered centeredTable"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>
                      <div>
                        <Checkbox
                          style={{ marginTop: "20px" }}
                          checked={allFeatures[layer].isSelectAll}
                          onChange={this.onChangeSelectAll.bind(this, layer)}
                        ></Checkbox>
                      </div>
                    </th>
                    {editAndDeleteMapLayers[layer]?.outFields
                      ?.filter((x) => !x.notInclude)
                      ?.map((field) => {
                        return <th>{field.arName}</th>;
                      })}
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {allFeatures[layer].features.map((feature, index) => {
                    return (
                      <tr
                        style={{
                          background: feature.isDelete
                            ? "#ff000045"
                            : feature.isUploaded
                            ? "#fff6588f"
                            : "",
                        }}
                      >
                        <td style={{ textAlign: "center" }}>
                          <Checkbox
                            style={{ marginTop: "20px" }}
                            checked={feature.isSelected}
                            onChange={this.onChangeSelectFeature.bind(
                              this,
                              index,
                              feature
                            )}
                          ></Checkbox>
                        </td>
                        {editAndDeleteMapLayers[layer]?.outFields
                          ?.filter((x) => !x.notInclude)
                          ?.map((field) => {
                            return (
                              <td>
                                {isNaN(feature.attributes[field.name]) ||
                                !feature.attributes[field.name]
                                  ? feature.attributes[field.name] ||
                                    "غير متوفر"
                                  : this.formatNumber(
                                      feature.attributes[field.name]
                                    )}
                              </td>
                            );
                          })}
                        <td>
                          <Tooltip title="تقريب">
                            <Button
                              className="toolsBtnStyle"
                              style={{ margin: "auto 3px" }}
                              size="large"
                              onClick={this.zoomToFeature.bind(this, feature)}
                            >
                              <FontAwesomeIcon
                                icon={faSearchPlus}
                                className=""
                              />
                            </Button>
                          </Tooltip>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <></>
          );
        })}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(showMapEditComponent));
