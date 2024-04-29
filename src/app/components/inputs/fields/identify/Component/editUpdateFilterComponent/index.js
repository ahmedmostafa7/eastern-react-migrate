import React, { Component } from "react";
import { Menu, Dropdown, Icon } from "antd";
import {
  Button,
  Form,
  Input,
  Select,
  Checkbox,
  Upload,
  message,
  Tooltip,
} from "antd";
import RenderField from "app/components/inputs";
import { serverFieldMapper } from "app/helpers/functions";
import { mapDispatchToProps, mapStateToProps } from "./maping";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { host } from "imports/config";
import {
  addParcelNo,
  clearGraphicFromLayer,
  convertToArabic,
  DrawFeatures,
  drawLength,
  drawLength_Lines,
  executeGPTool,
  formatKmlAttributes,
  formatMappingExcel,
  formatMappingShape,
  getFeatureDomainName,
  getFieldDomain,
  getInfo,
  getLayerId,
  highlightFeature,
  project,
  queryTask,
  readExcel,
  showLoading,
  uploadGISFile,
  zoomToFeature,
} from "../common/common_func";
import {
  addedParcelMapServiceUrl,
  editAndDeleteMapLayers,
  layersSetting,
  addFeaturesMapLayers,
} from "../mapviewer/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import store from "app/reducers";
import {
  faSearchPlus,
  faEdit,
  faStar,
  faTrash,
  faTimes,
  faWindowMaximize,
  faPlus,
  faCloudUploadAlt,
  faCloudDownloadAlt,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
  getMap,
  getIsMapLoaded,
  setIsMapLoaded,
} from "main_helpers/functions/filters/state";
import { Modal } from "antd";
import { groupBy } from "lodash";
import MapComponent from "../MapComponent/MapComponent";
import { Sticky, StickyContainer } from "react-sticky";
import MapBtnsComponent from "../MapBtnsComponent";
import FilterComponent from "../FilterComponent";
import { getMapInfo } from "../common/esri_request";
import ExportCSV from "./ExportCSV";

const pageSize = 10;
class editUpdateFilterComponent extends Component {
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
      originalFeatures:
        props?.mainObject?.editUpdateCreate?.originalFeatures || {},
      totalPage: 0,
      minIndex: 0,
      maxIndex: pageSize,
      selectedFeatures: [],
      isEditMultiple: false,
      mapLoaded: false,
    };

    this.props.setEditableFeatures({ ...this.state.allFeatures });
    this.props.setOriginalFeatures({ ...this.state.originalFeatures });
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

  removeFeature(feature, index) {
    this.state.allFeatures[feature.layerName].features.splice(index, 1);
    this.state.originalFeatures[feature.layerName].features.splice(index, 1);

    this.props.setEditableFeatures({ ...this.state.allFeatures });
    this.props.setOriginalFeatures({ ...this.state.originalFeatures });

    this.setState({
      allFeatures: { ...this.state.allFeatures },
      originalFeatures: { ...this.state.originalFeatures },
    });
  }

  deleteFeature(feature, index) {
    this.state.allFeatures[feature.layerName].features[index].isDelete =
      !this.state.allFeatures[feature.layerName].features[index].isDelete;
    this.props.setEditableFeatures({ ...this.state.allFeatures });

    this.setState({ allFeatures: { ...this.state.allFeatures } });
  }

  drawEditableFeatures(features) {
    //let layerInfo = addFeaturesMapLayers.find((l) => l.value == this.props.UploadFileDetails.layerName);
    //let annotationField = layerInfo.outFields.find((x) => x.isMainAnnotaion);
    clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");
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

  reProjectAndMapSpatailRelation(features) {
    store.dispatch({ type: "Show_Loading_new", loading: true });
    project(
      [...features.map((x) => x.geometry)],
      this.map.spatialReference.wkid,
      (res) => {
        features.forEach((f, index) => {
          f.geometry = res[index];
        });

        this.getSpatialRelationsWithLayers(
          features,
          this.layerInfo.spatialRelationLayers
        ).then((spatialFeatures) => {
          getFeatureDomainName(
            spatialFeatures,
            this.LayerID[this.props.UploadFileDetails.layerName],
            null,
            addedParcelMapServiceUrl
          ).then((r) => {
            store.dispatch({ type: "Show_Loading_new", loading: false });

            this.drawEditableFeatures([...r]);
            this.props.setEditableFeatures([...r]);
            this.setState({
              features: [...r],
              totalPage: r.length / pageSize,
              minIndex: 0,
              maxIndex: pageSize,
            });
          });
        });
      },
      true
    );
  }

  componentDidUpdate() {}

  mapFieldsAndGetDomainCodes = (attributes, searchBy) => {
    let tempAttributes = {};

    this.props.UploadFileDetails.activeLayerDetails.outFields.forEach(
      (outField) => {
        if (outField.mappingField) {
          let domainField = this.LayerFields.find(
            (x) => x.name == outField.name
          );
          if (domainField?.domain) {
            let domainValues = domainField.domain.codedValues.filter(
              (x) => x[searchBy] == attributes[outField.mappingField]
            );
            if (domainValues.length == 1) {
              if (searchBy == "code") {
                tempAttributes[outField.name + "_Code"] = domainValues[0].code;
                tempAttributes[outField.name] = domainValues[0].name;
              } else {
                tempAttributes[outField.name + "_Code"] = domainValues[0].code;
                tempAttributes[outField.name] =
                  attributes[outField.mappingField] != "<Null>"
                    ? attributes[outField.mappingField]
                    : null;
              }
            }
          } else {
            tempAttributes[outField.name] =
              attributes[outField.mappingField] != "<Null>"
                ? attributes[outField.mappingField]
                : null;
          }
        }
      }
    );

    return tempAttributes;
  };

  getSpatialRelationsWithLayers = (features, spatialRelationLayers) => {
    return new Promise((resolve, reject) => {
      store.dispatch({ type: "Show_Loading_new", loading: true });
      let intersectGraphic = window.geometryEngine.union(
        features.map((f) => {
          return f.geometry;
        })
      );
      let promiseList = [];
      spatialRelationLayers.forEach((item) => {
        let layerId = this.LayerID[item.layerName];
        promiseList.push(
          queryTask({
            url: addedParcelMapServiceUrl + "/" + layerId,
            geometry: intersectGraphic,
            queryWithGemoerty: true,
            returnGeometry: true,
            outFields: item.bindFields.map((i) => i.dependLayerField),
            returnExecuteObject: true,
          })
        );
      });

      let promises = window.promiseAll(promiseList);
      promises.then((result) => {
        features.forEach((feature) => {
          spatialRelationLayers.forEach((item, index) => {
            let intersectedGeometry = result[index].features.find((x) => {
              return window.geometryEngine.contains(
                x.geometry,
                feature.geometry
              );
            });
            if (intersectedGeometry) {
              item.bindFields.forEach((bindField) => {
                feature.attributes[bindField.mappingField] =
                  intersectedGeometry.attributes[bindField.dependLayerField];
              });
            }
          });
        });

        store.dispatch({ type: "Show_Loading_new", loading: false });

        if (!features.find((x) => x.attributes.MUNICIPALITY_NAME)) {
          message.error("البيانات المدرجة خارج حدود البلديات");

          resolve([]);
        } else {
          resolve([...features]);
        }
      });
    });
  };

  handleOk = () => {
    if (this.state.isEditMultiple) {
      this.state.allFeatures[this.state.isEditMultiple].features.forEach(
        (f) => {
          if (f.isSelected) {
            Object.keys(this.state.editFeature.attributes).forEach(
              (attribute) => {
                if (this.state.editFeature.attributes[attribute])
                  f.attributes[attribute] =
                    this.state.editFeature.attributes[attribute];
              }
            );
          }
        }
      );
    } else {
      this.state.allFeatures[this.state.editFeature.layerName].features[
        this.state.editFeature.index
      ].attributes = { ...this.state.editFeature.attributes };
    }

    this.setState({
      allFeatures: { ...this.state.allFeatures },
      showModal: false,
      isEditMultiple: false,
    });

    this.props.setEditableFeatures({ ...this.state.allFeatures });
    //this.drawEditableFeatures([...this.state.features]);
  };

  removeDialog = () => {
    this.setState({ showModal: false, isEditMultiple: false });
  };

  checkIntersect = (features, OBJECTID) => {
    if (features.length == 1) {
      if (features[0].attributes["OBJECTID"] != OBJECTID) {
        return true;
      }
    } else if (features.length > 1) {
      return true;
    }
    return false;
  };

  checkLineFullIntersect = (features, OBJECTID, newFeature, layerType) => {
    let isIntersect = false;
    if (layerType == "line") {
      if (features.length == 1) {
        if (features[0].attributes["OBJECTID"] != OBJECTID) {
          return true;
        }
      } else if (features.length > 1) {
        features
          .filter((x) => x.attributes["OBJECTID"] != OBJECTID)
          .forEach((f) => {
            if (!isIntersect) {
              if (newFeature.spatialReference)
                delete newFeature.spatialReference._geVersion;
              if (f.geometry.spatialReference)
                delete f.geometry.spatialReference._geVersion;

              isIntersect = window.geometryEngine.equals(
                newFeature,
                f.geometry
              );
            }
          });
      }
    } else {
      return true;
    }
    return isIntersect;
  };

  editGraphicFeature(feature, index, type, layer) {
    if (this.editToolbar) this.editToolbar.deactivate();
    else {
      this.editToolbar = new window.Edit(this.map);

      this.editToolbar.on("deactivate", (evt) => {
        if (evt.info.isModified) {
          let editGraphic = { ...evt.graphic };

          let editFeature = this.state.allFeatures[
            this.editLayerName
          ].features.find(
            (x) =>
              x.attributes["OBJECTID"] == editGraphic.attributes["OBJECTID"]
          );

          let layerId = getLayerId(this.map.__mapInfo, editGraphic.layerName);

          queryTask({
            url: addedParcelMapServiceUrl + "/" + layerId,
            geometry: editGraphic.geometry,
            outFields: ["OBJECTID"],
            spatialRelationship:
              editAndDeleteMapLayers[editGraphic.layerName].type == "line"
                ? "SPATIAL_REL_INTERSECTS"
                : "SPATIAL_REL_OVERLAPS",
            queryWithGemoerty: true,
            returnGeometry: true,
            callbackResult: ({ features }) => {
              if (
                !this.checkIntersect(
                  features,
                  editGraphic.attributes["OBJECTID"]
                ) ||
                !this.checkLineFullIntersect(
                  features,
                  editGraphic.attributes["OBJECTID"],
                  editGraphic.geometry,
                  editAndDeleteMapLayers[editGraphic.layerName].type
                )
              ) {
                if (
                  editAndDeleteMapLayers[editGraphic.layerName].type ==
                  "polygon"
                ) {
                  let areaField = editAndDeleteMapLayers[
                    editGraphic.layerName
                  ].outFields.find((x) => x.isArea);
                  if (areaField) {
                    //

                    if (editGraphic.geometry.spatialReference)
                      delete editGraphic.geometry.spatialReference._geVersion;

                    editFeature.attributes[areaField.name] =
                      window.geometryEngine.planarArea(
                        new esri.geometry.Polygon(
                          JSON.parse(JSON.stringify(editGraphic.geometry))
                        )
                      );
                    window.notifySystem("info", "تم تغيير المساحة");
                  }

                  drawLength(this.map, [
                    {
                      geometry: new esri.geometry.Polygon(
                        JSON.parse(JSON.stringify(editGraphic.geometry))
                      ),
                    },
                  ]);
                } else if (
                  editAndDeleteMapLayers[editGraphic.layerName].type == "line"
                ) {
                  drawLength_Lines(this.map, [
                    {
                      geometry: new esri.geometry.Polyline(
                        JSON.parse(JSON.stringify(editGraphic.geometry))
                      ),
                    },
                  ]);
                }
                editFeature.geometry = editGraphic.geometry;
                editFeature.isUploaded = true;

                this.props.setEditableFeatures({ ...this.state.allFeatures });

                this.setState({
                  allFeatures: { ...this.state.allFeatures },
                });

                highlightFeature(editFeature, this.map, {
                  layerName: "ZoomGraphicLayer",
                  isZoom: true,
                  isHighlighPolygonBorder: true,
                  zoomFactor: 20,
                });

                this.map.graphics.clear();
              } else {
                window.notifySystem("error", "لا يمكن رسم قطعتين متقاطعتين");

                highlightFeature(editFeature, this.map, {
                  layerName: "ZoomGraphicLayer",
                  isZoom: true,
                  isHighlighPolygonBorder: true,
                  zoomFactor: 20,
                });

                this.map.graphics.clear();
              }
            },
          });
        }
      });
      //Use the edit toolbar to edit vertices
    }

    this.editLayerName = layer;

    var polygonSymbol = new esri.symbol.SimpleFillSymbol();
    var polylineSymbol = new esri.symbol.SimpleLineSymbol();
    var symbol = feature.geometry.rings ? polygonSymbol : polylineSymbol;

    let tempGeometry = null;

    if (feature.geometry.type == "polygon") {
      tempGeometry = new esri.geometry.Polygon(
        JSON.parse(JSON.stringify(feature.geometry))
      );
    } else if (feature.geometry.type == "point") {
      tempGeometry = new esri.geometry.Point(
        JSON.parse(JSON.stringify(feature.geometry))
      );
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
    } else {
      tempGeometry = new esri.geometry.Polyline(
        JSON.parse(JSON.stringify(feature.geometry))
      );
    }

    var graphic = new esri.Graphic(tempGeometry, symbol, feature.attributes);

    graphic.layerName = layer;

    this.map.graphics.clear();

    this.map.graphics.add(graphic);

    if (type == "MOVE") {
      this.editToolbar.activate(window.Edit.MOVE, graphic);
    } else if (type == "EDIT_VERTICES") {
      if (graphic.type == "point") {
        this.editToolbar.activate(window.Edit.MOVE, graphic);
      } else {
        this.editToolbar.activate(
          window.Edit.EDIT_VERTICES | window.Edit.SCALE,
          graphic
        );

        if (feature.geometry.type == "polygon") {
          drawLength(this.map, [
            {
              geometry: new esri.geometry.Polygon(
                JSON.parse(JSON.stringify(graphic.geometry))
              ),
            },
          ]);
        } else if (feature.geometry.type == "polyline") {
          drawLength_Lines(this.map, [
            {
              geometry: new esri.geometry.Polyline(
                JSON.parse(JSON.stringify(graphic.geometry))
              ),
            },
          ]);
        }
      }
    } else if (type == "ROTATE")
      this.editToolbar.activate(window.Edit.ROTATE, graphic);
  }

  editFeature(feature, index) {
    let editFeatureObj = { index: index };
    editFeatureObj.attributes = { ...feature.attributes };
    editFeatureObj.layerName = feature.layerName;

    let layerInfo = editAndDeleteMapLayers[feature.layerName];
    let layerFields = this.map.__mapInfo.info.$layers.layers.find(
      (x) => x.name == feature.layerName
    )?.fields;
    let editFieldsObj = [];

    let mandatoryFields = layerInfo.outFields
      .filter((x) => x.isMandatory)
      .map((f) => f.name);

    layerInfo.outFields.forEach((outField) => {
      editFieldsObj.push(layerFields.find((x) => x.name == outField.name));
    });

    editFieldsObj.forEach((item) => {
      if (item && mandatoryFields.indexOf(item.name) > -1) {
        item.isMandatory = true;
      }
      if (item && item.domain && item.type == "esriFieldTypeInteger") {
        editFeatureObj.attributes[item.name + "_Code"] =
          +editFeatureObj.attributes[item.name + "_Code"];
      }
    });

    this.setState({
      showModal: true,
      editFields: [...editFieldsObj],
      editFeature: { ...editFeatureObj },
      isEditMultiple: false,
    });
  }

  handleUserInput = (e) => {
    let editFeatureTemp = { ...this.state.editFeature };
    editFeatureTemp.attributes[e.target.name] = e.target.value;
    this.setState({ editFeature: { ...editFeatureTemp } });
  };

  selectHandleChange = (e, value) => {
    let editFeatureTemp = { ...this.state.editFeature };
    editFeatureTemp.attributes[e.name + "_Code"] = value;
    editFeatureTemp.attributes[e.name] = e.domain.codedValues.find(
      (x) => x.code == value
    ).name;

    this.setState({ editFeature: { ...editFeatureTemp } });
  };

  isdisabledField = (field, feature) => {
    if (feature) {
      let layerInfo = editAndDeleteMapLayers[feature.layerName || feature];
      return layerInfo?.outFields?.find((x) => x.name == field.name)
        ?.isDisabled;
    }
    return false;
  };

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

    this.drawEditableFeatures(features);
  };

  editSelectedFeatures = (layer) => {
    let editFeatureObj = { attributes: {} };
    let layerInfo = editAndDeleteMapLayers[layer];
    let layerFields = this.map.__mapInfo.info.$layers.layers.find(
      (x) => x.name == layer
    )?.fields;

    let editFieldsObj = [];

    layerInfo.outFields.forEach((outField) => {
      if (!this.isdisabledField(outField, layer))
        editFieldsObj.push(layerFields.find((x) => x.name == outField.name));
    });

    this.setState({
      showModal: true,
      editFields: [...editFieldsObj],
      editFeature: { ...editFeatureObj },
      isEditMultiple: layer,
    });
  };

  deleteSelectedFeatures = (layer) => {
    this.state.allFeatures[layer].features.forEach((f, index) => {
      f.isDelete = !f.isDelete;
    });

    this.props.setEditableFeatures({ ...this.state.allFeatures });

    this.setState({
      allFeatures: { ...this.state.allFeatures },
    });
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

      this.map.on("click", (evt) => {
        this.editToolbar.deactivate();
      });
      this.setState({ mapLoaded: true });
      this.props.setCurrentMap(map);

      if (Object.keys(this.state.allFeatures).length > 0) {
        if (
          this.state?.allFeatures[Object.keys(this.state.allFeatures)[0]]
            ?.features?.length > 0
        ) {
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

  addFeature = (feature) => {
    this.state.allFeatures[feature.layerName] =
      this.state.allFeatures[feature.layerName] || {};
    this.state.allFeatures[feature.layerName].features =
      this.state.allFeatures[feature.layerName].features || [];
    this.state.allFeatures[feature.layerName].features.push({ ...feature });

    //set original features for compare
    this.state.originalFeatures[feature.layerName] =
      this.state.originalFeatures[feature.layerName] || {};
    this.state.originalFeatures[feature.layerName].features =
      this.state.originalFeatures[feature.layerName].features || [];
    this.state.originalFeatures[feature.layerName].features.push(
      JSON.parse(JSON.stringify(feature))
    );

    this.setState({
      allFeatures: { ...this.state.allFeatures },
      originalFeatures: { ...this.state.originalFeatures },
    });

    this.props.setEditableFeatures({ ...this.state.allFeatures });
    this.props.setOriginalFeatures({ ...this.state.originalFeatures });
  };

  addSelectedFeaturesFromMap = () => {
    this.props.selectedFeaturesOnMap.forEach((f) => {
      f.layerName = this.props.selectMapLayer;
      this.addFeature(f);
    });

    this.props.setSelectedFeaturesOnMap([]);
  };

  exportFile = (fileType, layer) => {
    let conditions = this.state.allFeatures[layer].features.map((f) => {
      return "OBJECTID = " + f.attributes["OBJECTID"];
    });
    let where = conditions.join(" or ");
    let whereClause = [{ ["SDE." + layer]: where }];
    let params = {
      Filters: whereClause,
      FileType: fileType,
    };
    showLoading(true);
    //notification with it is succeeded
    //notificationMessage(t("fileUploading"), 5);
    executeGPTool(
      window.exportFeaturesGPUrl,
      params,
      this.callBackExportFile,
      this.callbackExportError,
      "output_value"
    );
  };

  callBackExportFile = (result) => {
    if (result) {
      let anchor = document.createElement("a");
      anchor.href = window.filesURL + "/" + result.value;
      // anchor.download = layersNames[activeLink].layerName
      document.body.appendChild(anchor);
      anchor.click();
    }
    showLoading(false);
  };
  callbackExportError = (err) => {
    console.log(err);
    //notification with something error happened
    //notificationMessage(t("ErrorOccurd"), 5);

    window.notifySystem("error", "حدث خطأ اثناء استخراج الملفات");
    showLoading(false);
  };

  exportMenu = (layer) => {
    return (
      <Menu className="exportMenu">
        <Menu.Item>
          <label onClick={() => this.exportFile("Shape", layer)}>
            Shape استخراج ملف
          </label>
        </Menu.Item>
        <Menu.Item>
          <>
            <ExportCSV
              dataSet={() =>
                this.exportCsvMapping(this.state.allFeatures[layer].features)
              }
              labels={[...layersSetting[layer].outFields, "x", "y"]}
              layerName={layer}
            />
          </>
        </Menu.Item>
      </Menu>
    );
  };

  setFeatures = (features, layer) => {
    let layerdId = getLayerId(this.map.__mapInfo, layer);

    getFeatureDomainName(
      features,
      layerdId,
      false,
      addedParcelMapServiceUrl
    ).then((domainFeatures) => {
      store.dispatch({ type: "Show_Loading_new", loading: false });

      domainFeatures.forEach((d) => {
        d.isUploaded = true;
        d.layerName = layer;
      });

      this.state.allFeatures[layer] = this.state.allFeatures[layer] || {};
      this.state.allFeatures[layer].features =
        this.state.allFeatures[layer].features || [];
      //self.state.allFeatures[layer].features.push(...domainFeatures);

      let isMatched = true;
      domainFeatures.forEach((f) => {
        let tempF = this.state.allFeatures[layer].features.find(
          (x) => x.attributes.OBJECTID == f.attributes.OBJECTID
        );
        if (tempF) {
          tempF.attributes = { ...f.attributes };
          tempF.geometry = f.geometry;
          tempF.isUploaded = true;
        } else {
          isMatched = false;
        }
      });

      if (isMatched) {
        this.zoomToFeature(this.state.allFeatures[layer].features);
        this.setState({
          allFeatures: { ...this.state.allFeatures },
        });
        this.props.setEditableFeatures({ ...this.state.allFeatures });
      } else {
        window.notifySystem(
          "error",
          "للبيانات المرفوعة لا يتوافق مع البيانات المختارة OBJECTID"
        );
      }
    });
  };

  uploadMenu = (layer) => {
    let self = this;
    let startUpload = false;

    const excelUploadProps = {
      name: "file",
      action: `${host}/uploadMultifiles`,
      accept: ".xlsx,.xls",
      onChange(info) {
        if (info.file.status === "uploading") {
          if (!startUpload) {
            store.dispatch({ type: "Show_Loading_new", loading: true });
            startUpload = true;
          }
        }

        if (info.file.status === "done") {
          readExcel(info.file?.response[0]?.data, (res) => {
            let features = formatMappingExcel(res.features, layer, self.map);

            self.setFeatures(features, layer);
          });
        }
      },
    };

    const handleFileChange = (e) => {
      if (e.target.files.length == 8) {
        const formData = new window.FormData();
        for (let i = 0; i < e.target.files.length; i++) {
          formData.append("file" + i, e.target.files[i]);
        }
        return axios
          .post(`${host}/uploadShpeFiles`, formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then(({ data }) => {
            let params, outputName, processingToolUrl;

            params = {
              ShapeFile_Name: data[0].data,
            };

            processingToolUrl = `${window.restServicesPath.replace(
              "/Eastern",
              ""
            )}/ShapeFileToJSON/GPServer/ShapeFileToJSON`;

            //outputName = "Output_JSON";

            uploadGISFile(
              processingToolUrl,
              params,
              (data) => {
                if (data.value?.features?.length) {
                  let features = formatMappingShape(
                    data.value.features,
                    layer,
                    self.map
                  );
                  self.setFeatures(features, layer);
                } else {
                  window.notifySystem("error", "الملف لا يحتوي على بيانات");
                }
                store.dispatch({
                  type: "Show_Loading_new",
                  loading: false,
                });
              },
              outputName
            );
          });
      }
    };

    return (
      <Menu className="exportMenu">
        <Menu.Item>
          <>
            <input
              type="file"
              id="actual-btn"
              hidden
              onChange={handleFileChange}
              multiple
            />
            <label htmlFor="actual-btn">Shape رفع ملف</label>
          </>
        </Menu.Item>
        <Menu.Item>
          <Upload {...excelUploadProps}>
            <label>Excel رفع ملف</label>
          </Upload>
        </Menu.Item>
      </Menu>
    );
  };

  exportCsvMapping = (features) => {
    let records = [];
    let featuresClone = JSON.parse(JSON.stringify(features));

    featuresClone.forEach((f) => {
      Object.keys(f.attributes).forEach((attribute) => {
        if (f.attributes[attribute + "_Code"] != null) {
          f.attributes[attribute] = f.attributes[attribute + "_Code"];
          delete f.attributes[attribute + "_Code"];
        }
      });
    });

    featuresClone.forEach((f) => {
      if (f.geometry?.rings) {
        f.geometry?.rings[0]?.forEach((point) => {
          records.push({
            attributes: { ...f.attributes, x: point[0], y: point[1] },
          });
        });
      } else if (f.geometry?.paths) {
        f.geometry?.paths[0]?.forEach((point) => {
          records.push({
            attributes: { ...f.attributes, x: point[0], y: point[1] },
          });
        });
      } else {
        records.push({
          attributes: { ...f.attributes, x: f.geometry.x, y: f.geometry.y },
        });
      }
    });

    return records;
  };

  render() {
    const {
      fullMapWidth,
      selectedFeaturesOnMap,
      mainObject: {
        selectEditingWorkFlow: {
          selectWorkFlow: { workflowType },
        },
      },
    } = this.props;
    const { editFields, editFeature, mapLoaded, allFeatures } = this.state;
    return (
      <div>
        <div>
          <div className={!fullMapWidth ? "filter-section implementation" : ""}>
            <div>
              {mapLoaded && (
                <div
                  style={{
                    boxShadow: "1px 1px 3px black",
                    paddingLeft: "15px",
                    height: "487px",
                    overflowY: "auto",
                    overflowX: "hidden",
                  }}
                >
                  <FilterComponent
                    map={this.map}
                    setSelectMapLayer={this.setSelectMapLayer}
                    addFeature={this.addFeature}
                  />
                </div>
              )}
            </div>
            <div>
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
        </div>
        <div style={{ textAlign: "end", marginTop: "10px" }}>
          {selectedFeaturesOnMap && selectedFeaturesOnMap.length ? (
            <Button
              onClick={this.addSelectedFeaturesFromMap.bind(this)}
              className="add_mktab toolsBtnStyle"
              type="primary"
              icon="plus"
            >
              {" "}
              إضافة مواقع{" "}
            </Button>
          ) : (
            <div></div>
          )}
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
                  <div style={{ textAlign: "left" }}>
                    {workflowType == "update_geo" && (
                      <Dropdown overlay={this.exportMenu(layer)}>
                        <a
                          className="ant-dropdown-link"
                          style={{ marginLeft: "20px" }}
                          onClick={(e) => e.preventDefault()}
                        >
                          <FontAwesomeIcon
                            icon={faCloudDownloadAlt}
                            style={{ marginLeft: "5px" }}
                          />
                          تنزيل البيانات <Icon type="down" />
                        </a>
                      </Dropdown>
                    )}
                    {workflowType == "update_geo" && (
                      <Dropdown overlay={this.uploadMenu(layer)}>
                        <a
                          className="ant-dropdown-link"
                          style={{ marginLeft: "20px" }}
                          onClick={(e) => e.preventDefault()}
                        >
                          <FontAwesomeIcon
                            icon={faCloudUploadAlt}
                            style={{ marginLeft: "5px" }}
                          />
                          رفع البيانات <Icon type="down" />
                        </a>
                      </Dropdown>
                    )}
                    {workflowType == "edit" || workflowType == "update_geo" ? (
                      <Button
                        className="toolsBtnStyle"
                        size="large"
                        onClick={this.editSelectedFeatures.bind(this, layer)}
                        style={{ marginLeft: "10px" }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        <span style={{ marginRight: "5px" }}>تعديل المحدد</span>
                      </Button>
                    ) : (
                      <Button
                        className="toolsBtnStyle"
                        size="large"
                        onClick={this.deleteSelectedFeatures.bind(this, layer)}
                        style={{ marginLeft: "10px" }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                        <span style={{ marginRight: "5px" }}>حذف المحدد</span>
                      </Button>
                    )}
                    {(allFeatures[layer].isSelectAll ||
                      allFeatures[layer].selectedFeatures?.length >
                        1) /*&& selectedFeatures?.length != features?.length*/ && (
                      <Button
                        className="toolsBtnStyle"
                        size="large"
                        onClick={this.removeSelectedFeatures.bind(this, layer)}
                        style={{ marginLeft: "10px" }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        <span style={{ marginRight: "5px" }}>إزالة المحدد</span>
                      </Button>
                    )}
                    <Button
                      className="toolsBtnStyle"
                      size="large"
                      onClick={this.zoomToSelectedFeature.bind(this, layer)}
                    >
                      <FontAwesomeIcon icon={faSearchPlus} className="" />
                    </Button>
                  </div>
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
                          {(workflowType == "edit" ||
                            workflowType == "update_geo") && (
                            <Tooltip title="تعديل">
                              <Button
                                className="toolsBtnStyle"
                                style={{ margin: "auto 3px" }}
                                disabled={
                                  allFeatures[layer].isSelectAll ||
                                  allFeatures[layer].selectedFeatures?.length >
                                    1
                                }
                                size="large"
                                onClick={this.editFeature.bind(
                                  this,
                                  feature,
                                  index
                                )}
                              >
                                <FontAwesomeIcon icon={faEdit} className="" />
                              </Button>
                            </Tooltip>
                          )}
                          {workflowType == "update_geo" &&
                            editAndDeleteMapLayers[layer].type != "point" && (
                              <Tooltip title="تعديل الأبعاد">
                                <Button
                                  className="toolsBtnStyle"
                                  style={{ margin: "auto 3px" }}
                                  disabled={
                                    allFeatures[layer].isSelectAll ||
                                    allFeatures[layer].selectedFeatures
                                      ?.length > 1
                                  }
                                  size="large"
                                  onClick={this.editGraphicFeature.bind(
                                    this,
                                    feature,
                                    index,
                                    "EDIT_VERTICES",
                                    layer
                                  )}
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <rect width="24" height="24" fill="white" />
                                    <path
                                      d="M20.2891 14.0082V20.2889H3.71133V4.16516L20.2891 14.0082Z"
                                      stroke="#196F6C"
                                      stroke-width="1.2"
                                    />
                                    <line
                                      x1="20.4443"
                                      y1="14.8336"
                                      x2="20.4443"
                                      y2="5.49971"
                                      stroke="#196F6C"
                                      stroke-linecap="square"
                                      stroke-dasharray="2 2"
                                    />
                                    <path
                                      d="M3.61133 3.72223L18.5 3.72223"
                                      stroke="#196F6C"
                                      stroke-linecap="square"
                                      stroke-dasharray="2 2"
                                    />
                                    <rect
                                      x="2"
                                      y="2"
                                      width="3.33333"
                                      height="3.33333"
                                      fill="#196F6C"
                                    />
                                    <rect
                                      x="2"
                                      y="18.6667"
                                      width="3.33333"
                                      height="3.33333"
                                      fill="#196F6C"
                                    />
                                    <rect
                                      x="18.6665"
                                      y="18.6667"
                                      width="3.33333"
                                      height="3.33333"
                                      fill="#196F6C"
                                    />
                                    <rect
                                      x="18.6665"
                                      y="12"
                                      width="3.33333"
                                      height="3.33333"
                                      fill="#A61C35"
                                    />
                                    <rect
                                      x="18.9165"
                                      y="2.25"
                                      width="2.83333"
                                      height="2.83333"
                                      stroke="#196F6C"
                                      stroke-width="0.5"
                                    />
                                  </svg>
                                </Button>
                              </Tooltip>
                            )}
                          {workflowType == "update_geo" && (
                            <Tooltip title="تحريك">
                              <Button
                                className="toolsBtnStyle"
                                style={{ margin: "auto 3px" }}
                                disabled={
                                  allFeatures[layer].isSelectAll ||
                                  allFeatures[layer].selectedFeatures?.length >
                                    1
                                }
                                size="large"
                                onClick={this.editGraphicFeature.bind(
                                  this,
                                  feature,
                                  index,
                                  "MOVE",
                                  layer
                                )}
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <rect width="24" height="24" fill="white" />
                                  <line
                                    x1="4.04983"
                                    y1="19.153"
                                    x2="20.2047"
                                    y2="4.79307"
                                    stroke="#196F6C"
                                    stroke-width="1.2"
                                    stroke-linecap="square"
                                  />
                                  <path
                                    d="M4 4.00006L20.1323 20.1324"
                                    stroke="#196F6C"
                                    stroke-linecap="square"
                                    stroke-dasharray="2 2"
                                  />
                                  <rect
                                    x="9.65186"
                                    y="10.0161"
                                    width="3.80243"
                                    height="3.80243"
                                    fill="#A61C35"
                                  />
                                </svg>
                              </Button>
                            </Tooltip>
                          )}

                          {workflowType == "update_geo" &&
                            editAndDeleteMapLayers[layer].type != "point" && (
                              <Tooltip title="تدوير">
                                <Button
                                  className="toolsBtnStyle"
                                  style={{ margin: "auto 3px" }}
                                  disabled={
                                    allFeatures[layer].isSelectAll ||
                                    allFeatures[layer].selectedFeatures
                                      ?.length > 1
                                  }
                                  size="large"
                                  onClick={this.editGraphicFeature.bind(
                                    this,
                                    feature,
                                    index,
                                    "ROTATE",
                                    layer
                                  )}
                                >
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g clip-path="url(#clip0_16_25)">
                                      <rect
                                        width="24"
                                        height="24"
                                        transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 24 24)"
                                        fill="white"
                                      />
                                      <path
                                        d="M10.2502 10.4689C11.2028 9.91891 12.4323 10.2483 12.9823 11.201C13.5323 12.1536 13.2028 13.383 12.2502 13.933C11.2976 14.483 10.0682 14.1536 9.51815 13.201C8.96815 12.2483 9.29758 11.0189 10.2502 10.4689ZM19.0444 7.70096C21.5294 12.0051 20.0544 17.5102 15.7502 19.9952L17.2502 22.5933L11.7861 21.1292L13.2502 15.6651L14.7502 18.2631C18.1017 16.3281 19.2474 12.0525 17.3124 8.70096C15.3774 5.34944 11.1017 4.20378 7.7502 6.13878C4.39869 8.07378 3.25303 12.3494 5.18803 15.701C5.94303 17.0087 7.06738 17.9761 8.34386 18.567L7.80678 20.5168C6.04219 19.7804 4.48598 18.485 3.45598 16.701C0.970976 12.3968 2.44606 6.89173 6.7502 4.40673C11.0543 1.92173 16.5594 3.39681 19.0444 7.70096Z"
                                        fill="#196F6C"
                                      />
                                    </g>
                                    <defs>
                                      <clipPath id="clip0_16_25">
                                        <rect
                                          width="24"
                                          height="24"
                                          fill="white"
                                          transform="matrix(1.19249e-08 -1 -1 -1.19249e-08 24 24)"
                                        />
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </Button>
                              </Tooltip>
                            )}
                          {workflowType == "delete" && (
                            <Tooltip title="حذف">
                              <Button
                                className="toolsBtnStyle"
                                style={{ margin: "auto 3px" }}
                                disabled={
                                  allFeatures[layer].isSelectAll ||
                                  allFeatures[layer].selectedFeatures?.length >
                                    1
                                }
                                size="large"
                                onClick={this.deleteFeature.bind(
                                  this,
                                  feature,
                                  index
                                )}
                              >
                                <FontAwesomeIcon icon={faTrash} className="" />
                              </Button>
                            </Tooltip>
                          )}
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
                          <Tooltip title="إزالة">
                            <Button
                              className="toolsBtnStyle"
                              style={{ margin: "auto 3px" }}
                              size="large"
                              onClick={this.removeFeature.bind(
                                this,
                                feature,
                                index
                              )}
                            >
                              <FontAwesomeIcon icon={faTimes} className="" />
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

        <Modal
          width={800}
          title="تعديل البيانات"
          onOk={this.handleOk}
          visible={this.state.showModal}
          onCancel={this.removeDialog}
          okText="نعم"
          cancelText="إلغاء"
        >
          <div>
            <table>
              <tbody>
                {editFields.length > 0 &&
                  editFields
                    .filter((x) => x)
                    .map((field) => {
                      return (
                        <tr>
                          <td>
                            {field.alias}
                            {field.isMandatory && (
                              <label
                                style={{ marginRight: "10px", color: "red" }}
                              >
                                *
                              </label>
                            )}
                          </td>
                          <td>
                            <div>
                              {field.domain?.codedValues?.length ? (
                                <Select
                                  disabled={this.isdisabledField(
                                    field,
                                    editFeature
                                  )}
                                  style={{ width: "80%" }}
                                  virtual={false}
                                  onChange={this.selectHandleChange.bind(
                                    this,
                                    field
                                  )}
                                  className="dont-show"
                                  value={
                                    editFeature.attributes[
                                      field.name + "_Code"
                                    ] || editFeature.attributes[field.name]
                                  }
                                  placeholder={"من فضلك أدخل " + field.alias}
                                  getPopupContainer={(trigger) =>
                                    trigger.parentNode
                                  }
                                >
                                  {field.domain.codedValues.map(
                                    (domain, index) => {
                                      return (
                                        <Select.Option
                                          value={domain.code}
                                          id={domain.code}
                                        >
                                          {domain.name}
                                        </Select.Option>
                                      );
                                    }
                                  )}
                                </Select>
                              ) : (
                                <Input
                                  disabled={this.isdisabledField(
                                    field,
                                    editFeature
                                  )}
                                  name={field.name}
                                  type={
                                    field.type == "esriFieldTypeString"
                                      ? "text"
                                      : "number"
                                  }
                                  onChange={this.handleUserInput}
                                  value={editFeature.attributes[field.name]}
                                  placeholder={"من فضلك أدخل " + field.alias}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(editUpdateFilterComponent));
