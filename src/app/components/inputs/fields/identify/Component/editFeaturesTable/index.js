import React, { Component } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Checkbox,
  Pagination,
  message,
} from "antd";
import RenderField from "app/components/inputs";
import { serverFieldMapper } from "app/helpers/functions";
import { mapDispatchToProps, mapStateToProps } from "./maping";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  addParcelNo,
  clearGraphicFromLayer,
  convertToArabic,
  DrawFeatures,
  formatKmlAttributes,
  getFeatureDomainName,
  getFieldDomain,
  getInfo,
  GetSpatialId,
  highlightFeature,
  project,
  queryTask,
  zoomToFeature,
} from "../common/common_func";
import {
  addedParcelMapServiceUrl,
  addFeaturesMapLayers,
} from "../mapviewer/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import store from "app/reducers";
import {
  faSearchPlus,
  faEdit,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  getMap,
  getIsMapLoaded,
  setIsMapLoaded,
} from "main_helpers/functions/filters/state";
import { Modal } from "antd";
import { groupBy } from "lodash";

const pageSize = 10;

class editFeaturesTableComponent extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.isLoaded = true;
    this.state = {
      features: props.mainObject?.mapEditFeatures?.editableFeatures || null,
      editFields: [],
      editFeature: {},
      current: 1,
      totalPage: 0,
      minIndex: 0,
      uploadFileDetails:
        props.UploadFileDetails ||
        props.mainObject.locationData.uploadFileDetails,
      maxIndex: pageSize,
      selectedFeatures: [],
      isEditMultiple: false,
    };
  }

  formatNumber(num) {
    return (+num).toFixed(2).replace(/[.,]00$/, "");
  }

  zoomToFeature(feature) {
    var opacity = 1;
    if (feature?.geometry?.type == "polygon") {
      opacity = 0.5;
    }

    highlightFeature(feature, this.map, {
      layerName: "highlightGraphicLayer",
      isZoom: true,
      zoomFactor: 20,
      isHiglightSymbol: true,
      highlighColor: [0, 255, 255, opacity],
    });
  }

  removeFeature(index) {
    this.state.features.splice(index, 1);

    this.drawEditableFeatures(this.state.features);

    this.props.setEditableFeatures([...this.state.features]);

    this.setState({ features: [...this.state.features] });
  }

  drawEditableFeatures(features) {
    let layerInfo =
      addFeaturesMapLayers[this.state.uploadFileDetails.layerName];
    let annotationField = layerInfo.outFields.find((x) => x.isMainAnnotaion);
    clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");
    clearGraphicFromLayer(this.map, "ZoomGraphicLayer");

    features.forEach((f) => {
      let pt;

      if (f.geometry.type == "point") {
        pt = f.geometry;
      } else {
        if (f.geometry.getExtent) {
          pt = f.geometry.getExtent().getCenter();
        } else {
          if (f.geometry.type == "polygon") {
            f.geometry = new esri.geometry.Polygon(
              JSON.parse(JSON.stringify(f.geometry))
            );
          } else {
            f.geometry = new esri.geometry.Polyline(
              JSON.parse(JSON.stringify(f.geometry))
            );
          }
          pt = f.geometry.getExtent().getCenter();
        }
      }
      addParcelNo(
        pt,
        this.map,
        convertToArabic(f.attributes[annotationField.name]),
        "ParcelPlanNoGraphicLayer",
        40,
        [0, 0, 0]
      );

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
            this.LayerID[this.state.uploadFileDetails.layerName],
            null,
            addedParcelMapServiceUrl
          ).then((r) => {
            store.dispatch({ type: "Show_Loading_new", loading: false });

            let spatialReferenceField = addFeaturesMapLayers[
              this.state.uploadFileDetails.layerName
            ].outFields.find((x) => x.isSpatialId);
            if (spatialReferenceField) {
              r.forEach((feature) => {
                feature.attributes[spatialReferenceField.name] =
                  GetSpatialId(feature);
              });
            }

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

  componentDidUpdate() {
    if (this.isLoaded) {
      this.map = getMap();
      if (getIsMapLoaded()) {
        this.isLoaded = false;
        getInfo(addedParcelMapServiceUrl).then((res) => {
          getFieldDomain(
            "",
            res[this.state.uploadFileDetails.layerName],
            addedParcelMapServiceUrl
          ).then((fields) => {
            this.LayerFields = fields;
            this.LayerID = res;
            this.layerInfo =
              addFeaturesMapLayers[this.state.uploadFileDetails.layerName];

            try {
              if (this.props.editableFeatures?.length) {
                this.props.editableFeatures.map((f) => (f.isSelected = false));

                this.drawEditableFeatures(this.props.editableFeatures);
                this.setState({
                  features: [...this.props.editableFeatures],
                  totalPage: this.props.editableFeatures.length / pageSize,
                  minIndex: 0,
                  maxIndex: pageSize,
                });
              } else {
                if (this.state.uploadFileDetails.fileType == "cad") {
                  //store.dispatch({ type: 'Show_Loading_new', loading: true })
                  if (
                    this.state.uploadFileDetails.activeLayerDetails.type ==
                    "polygon"
                  ) {
                    DrawFeatures(this.map, this.state.uploadFileDetails).then(
                      (features) => {
                        this.getSpatialRelationsWithLayers(
                          features,
                          this.layerInfo.spatialRelationLayers
                        ).then((spatialFeatures) => {
                          getFeatureDomainName(
                            spatialFeatures,
                            res[this.state.uploadFileDetails.layerName],
                            null,
                            addedParcelMapServiceUrl
                          ).then((r) => {
                            //store.dispatch({ type: 'Show_Loading_new', loading: false })
                            let spatialReferenceField = addFeaturesMapLayers[
                              this.state.uploadFileDetails.layerName
                            ].outFields.find((x) => x.isSpatialId);
                            if (spatialReferenceField) {
                              r.forEach((feature) => {
                                feature.attributes[spatialReferenceField.name] =
                                  GetSpatialId(feature);
                              });
                            }

                            this.setState({
                              features: r,
                              totalPage: r.length / pageSize,
                              minIndex: 0,
                              maxIndex: pageSize,
                            });
                            this.props.setEditableFeatures([...r]);
                          });
                        });
                      }
                    );
                  } else if (
                    this.state.uploadFileDetails.activeLayerDetails.type ==
                    "line"
                  ) {
                    let features = [];
                    let featuresMapping =
                      this.state.uploadFileDetails.fileData.lineFeatures.map(
                        (object) => ({ ...object })
                      );
                    let spatialReference = new esri.SpatialReference(
                      featuresMapping[0].spatialReference.wkid
                    );

                    featuresMapping.forEach((f) => {
                      features.push({
                        geometry: esri.geometry.Polyline(
                          f.paths,
                          spatialReference
                        ),
                        attributes: {},
                      });
                      features[features.length - 1].geometry.spatialReference =
                        spatialReference;
                    });

                    this.reProjectAndMapSpatailRelation(features);
                  } else if (
                    this.state.uploadFileDetails.activeLayerDetails.type ==
                    "point"
                  ) {
                    let features = [];
                    let featuresMapping =
                      this.state.uploadFileDetails.fileData.pointFeatures.map(
                        (object) => ({ ...object })
                      );
                    let spatialReference = new esri.SpatialReference(
                      featuresMapping[0].spatialReference.wkid
                    );

                    featuresMapping.forEach((f) => {
                      features.push({
                        geometry: esri.geometry.Point(
                          f.x,
                          f.y,
                          spatialReference
                        ),
                        attributes: {},
                      });
                      features[features.length - 1].geometry.spatialReference =
                        spatialReference;
                    });

                    this.reProjectAndMapSpatailRelation(features);
                  }
                } else if (this.state.uploadFileDetails.fileType == "shape") {
                  let features =
                    this.state.uploadFileDetails.fileData.features.map(
                      (object) => ({ ...object })
                    );
                  let spatialReference = new esri.SpatialReference(
                    this.state.uploadFileDetails.fileData.spatialReference.wkid
                  );
                  features.forEach((f) => {
                    f.attributes = this.mapFieldsAndGetDomainCodes(
                      f.attributes,
                      "code"
                    );

                    if (
                      this.state.uploadFileDetails.fileData.geometryType ==
                      "esriGeometryPolygon"
                    ) {
                      f.geometry = esri.geometry.Polygon(
                        f.geometry,
                        this.state.uploadFileDetails.fileData.spatialReference
                      );
                    } else if (
                      this.state.uploadFileDetails.fileData.geometryType ==
                      "esriGeometryPolyline"
                    ) {
                      f.geometry = esri.geometry.Polyline(
                        f.geometry,
                        this.state.uploadFileDetails.fileData.spatialReference
                      );
                    } else {
                      f.geometry = esri.geometry.Point(
                        f.geometry,
                        this.state.uploadFileDetails.fileData.spatialReference
                      );
                    }

                    f.geometry.spatialReference = spatialReference;
                  });

                  this.reProjectAndMapSpatailRelation(features);
                } else if (this.state.uploadFileDetails.fileType == "kml") {
                  let features =
                    this.state.uploadFileDetails.fileData.features.map(
                      (object) => ({ ...object })
                    );
                  features.forEach((f) => {
                    if (f.attributes.PopupInfo) {
                      f.attributes = formatKmlAttributes(f);
                      f.attributes = this.mapFieldsAndGetDomainCodes(
                        f.attributes,
                        "name"
                      );
                    }

                    if (
                      this.state.uploadFileDetails.fileData.geometryType ==
                      "esriGeometryPolygon"
                    ) {
                      f.geometry = esri.geometry.Polygon(
                        f.geometry,
                        this.state.uploadFileDetails.fileData.spatialReference
                      );
                    } else if (
                      this.state.uploadFileDetails.fileData.geometryType ==
                      "esriGeometryPolyline"
                    ) {
                      f.geometry = esri.geometry.Polyline(
                        f.geometry,
                        this.state.uploadFileDetails.fileData.spatialReference
                      );
                    } else {
                      f.geometry = esri.geometry.Point(
                        f.geometry,
                        this.state.uploadFileDetails.fileData.spatialReference
                      );
                    }
                  });

                  this.reProjectAndMapSpatailRelation(features);
                } else if (this.state.uploadFileDetails.fileType == "excel") {
                  let notFormatedFeatures =
                    this.state.uploadFileDetails.fileData.features.map(
                      (object) => ({ ...object })
                    );

                  //group by serial
                  let layerOutFields =
                    this.state.uploadFileDetails.activeLayerDetails.outFields;

                  let xMapFieldName = layerOutFields.find(
                    (x) => x.name == "x"
                  )?.mappingField;
                  let yMapFieldName = layerOutFields.find(
                    (x) => x.name == "y"
                  )?.mappingField;
                  let serialMapFieldName = layerOutFields.find(
                    (x) => x.name == "serial"
                  )?.mappingField;

                  notFormatedFeatures = groupBy(
                    notFormatedFeatures,
                    (v) => v.attributes[serialMapFieldName]
                  );

                  let features = [];

                  if (
                    this.state.uploadFileDetails.activeLayerDetails.type ==
                    "polygon"
                  ) {
                    Object.keys(notFormatedFeatures).forEach((serial) => {
                      let rings = [
                        notFormatedFeatures[serial].map((f) => {
                          return [
                            f.attributes[xMapFieldName],
                            f.attributes[yMapFieldName],
                          ];
                        }),
                      ];

                      //check if start point = end point x , y
                      if (
                        !(
                          rings[0][0][0] == rings[0][rings[0].length - 1][0] &&
                          rings[0][0][1] == rings[0][rings[0].length - 1][1]
                        )
                      ) {
                        rings[0].push(rings[0][0]);
                      }

                      features.push({
                        attributes: notFormatedFeatures[serial][0].attributes,
                        geometry: { rings: rings },
                      });
                    });
                  } else if (
                    this.state.uploadFileDetails.activeLayerDetails.type ==
                    "line"
                  ) {
                    Object.keys(notFormatedFeatures).forEach((serial) => {
                      let paths = [
                        notFormatedFeatures[serial].map((f) => {
                          return [
                            f.attributes[xMapFieldName],
                            f.attributes[yMapFieldName],
                          ];
                        }),
                      ];

                      features.push({
                        attributes: notFormatedFeatures[serial][0].attributes,
                        geometry: { paths: paths },
                      });
                    });
                  } else if (
                    this.state.uploadFileDetails.activeLayerDetails.type ==
                    "point"
                  ) {
                    Object.keys(notFormatedFeatures).forEach((serial) => {
                      let points = notFormatedFeatures[serial].map((f) => {
                        return [
                          f.attributes[xMapFieldName],
                          f.attributes[yMapFieldName],
                        ];
                      });

                      features.push({
                        attributes: notFormatedFeatures[serial][0].attributes,
                        geometry: { x: points[0][0], y: points[0][1] },
                      });
                    });
                  }

                  let spatialReference = new esri.SpatialReference(
                    this.map.spatialReference.wkid
                  );

                  features.forEach((f) => {
                    if (
                      this.state.uploadFileDetails.activeLayerDetails.type ==
                      "polygon"
                    ) {
                      f.geometry = esri.geometry.Polygon(
                        f.geometry,
                        this.state.uploadFileDetails.fileData.spatialReference
                      );
                    } else if (
                      this.state.uploadFileDetails.activeLayerDetails.type ==
                      "line"
                    ) {
                      f.geometry = esri.geometry.Polyline(
                        f.geometry,
                        this.state.uploadFileDetails.fileData.spatialReference
                      );
                    } else if (
                      this.state.uploadFileDetails.activeLayerDetails.type ==
                      "point"
                    ) {
                      f.geometry = esri.geometry.Point(
                        f.geometry,
                        this.state.uploadFileDetails.fileData.spatialReference
                      );
                    }

                    f.geometry.spatialReference = spatialReference;
                    f.attributes = this.mapFieldsAndGetDomainCodes(
                      f.attributes,
                      "name"
                    );
                  });

                  this.reProjectAndMapSpatailRelation(features);
                } else if (this.state.uploadFileDetails.fileType == "google") {
                  let features = [];
                  let points = this.state.uploadFileDetails.googlePoints.map(
                    (f) => {
                      return [+f.long, +f.lat];
                    }
                  );

                  let spatialReference = new esri.SpatialReference(4326);

                  points.forEach((f) => {
                    f.geometry = esri.geometry.Point(
                      f[0],
                      f[1],
                      spatialReference
                    );
                    f.geometry.spatialReference = spatialReference;

                    features.push({ attributes: {}, geometry: f.geometry });
                  });

                  this.reProjectAndMapSpatailRelation(features);
                }
              }
            } catch (error) {
              window.notifySystem("error", "حدث خطأ أثناء إضافة البيانات");
            }
          });
        });
      }
    }
  }

  mapFieldsAndGetDomainCodes = (attributes, searchBy) => {
    let tempAttributes = {};

    this.state.uploadFileDetails.activeLayerDetails.outFields.forEach(
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
            bufferDistance: 1,
            outFields: item.bindFields.map((i) => i.dependLayerField),
            returnExecuteObject: true,
          })
        );
      });

      let promises = window.promiseAll(promiseList);
      promises.then((result) => {
        let checkSelfIntersectIndex = spatialRelationLayers.findIndex(
          (x) => x.checkSelfIntersect
        );
        if (checkSelfIntersectIndex > -1) {
          if (result[checkSelfIntersectIndex].features.length) {
            message.error(
              "لا يمكن رفع " +
                addFeaturesMapLayers[this.state.uploadFileDetails.layerName]
                  .label +
                " فوق " +
                addFeaturesMapLayers[this.state.uploadFileDetails.layerName]
                  .label +
                " موجودة بالفعل"
            );
            resolve([]);
          }
        }

        for (let feature of features) {
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
        }

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
      this.state.features.forEach((f) => {
        if (f.isSelected) {
          Object.keys(this.state.editFeature.attributes).forEach(
            (attribute) => {
              if (this.state.editFeature.attributes[attribute])
                f.attributes[attribute] =
                  this.state.editFeature.attributes[attribute];
            }
          );
        }
      });
    } else {
      this.state.features[this.state.editFeature.index].attributes = {
        ...this.state.editFeature.attributes,
      };
    }

    this.setState({
      features: [...this.state.features],
      showModal: false,
      isEditMultiple: false,
    });

    this.props.setEditableFeatures([...this.state.features]);
    this.drawEditableFeatures([...this.state.features]);
  };

  removeDialog = () => {
    this.setState({ showModal: false, isEditMultiple: false });
  };

  editFeature(feature, index) {
    let editFeatureObj = { index: index };
    editFeatureObj.attributes = { ...feature.attributes };
    let layerInfo =
      addFeaturesMapLayers[this.state.uploadFileDetails.layerName];
    let editFieldsObj = [];

    let mandatoryFields = layerInfo.outFields
      .filter((x) => x.isMandatory)
      .map((f) => f.name);

    layerInfo.outFields.forEach((outField) => {
      editFieldsObj.push(this.LayerFields.find((x) => x.name == outField.name));
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

  isdisabledField = (field) => {
    let isFound = false;
    this.layerInfo.spatialRelationLayers.forEach((layer) => {
      if (!isFound)
        isFound = layer?.bindFields?.find((x) => x.mappingField == field.name);
    });
    return isFound;
  };

  onChangeSelectFeature = (index, e) => {
    this.state.features[index].isSelected =
      !this.state.features[index].isSelected;
    let selectedFeatures = this.state.features.filter((x) => x.isSelected);

    if (selectedFeatures.length > 1) {
      this.setState({
        selectedFeatures: [...selectedFeatures],
        features: [...this.state.features],
      });
    } else {
      this.setState({
        selectedFeatures: [],
        features: [...this.state.features],
      });
    }
  };

  zoomToSelectedFeature = () => {
    let features = [];

    this.state.features.forEach((f, index) => {
      if (f.isSelected) {
        features.push(f);
      }
    });

    if (!features.length) {
      features = this.state.features;
    }

    this.drawEditableFeatures(features);
  };

  editSelectedFeatures = () => {
    let editFeatureObj = { attributes: {} };
    let layerInfo =
      addFeaturesMapLayers[this.state.uploadFileDetails.layerName];
    let editFieldsObj = [];

    layerInfo.outFields.forEach((outField) => {
      if (!this.isdisabledField(outField))
        editFieldsObj.push(
          this.LayerFields.find((x) => x.name == outField.name)
        );
    });

    this.setState({
      showModal: true,
      editFields: [...editFieldsObj],
      editFeature: { ...editFeatureObj },
      isEditMultiple: true,
    });
  };

  deleteSelectedFeatures = () => {
    let features = [];

    this.state.features.forEach((f, index) => {
      if (!f.isSelected) {
        features.push(f);
      }
    });

    this.drawEditableFeatures(features);

    this.props.setEditableFeatures([...features]);

    this.setState({
      features: [...features],
      selectedFeatures: [],
      isSelectAll: false,
    });
  };

  onChangeSelectAll = () => {
    this.state.features.map((f) => {
      f.isSelected = !this.state.isSelectAll;
    });
    this.setState({
      features: [...this.state.features],
      isSelectAll: !this.state.isSelectAll,
      selectedFeatures: [],
    });
  };

  handleChange = (page) => {
    this.setState({
      current: page,
      minIndex: (page - 1) * pageSize,
      maxIndex: page * pageSize,
    });
  };

  render() {
    const { uploadFileDetails } = this.state;
    const {
      features,
      editFields,
      editFeature,
      isSelectAll,
      selectedFeatures,
      current,
      minIndex,
      maxIndex,
    } = this.state;
    const layerInfo = addFeaturesMapLayers[uploadFileDetails?.layerName];
    return (
      <div>
        {features?.length ? (
          <div>
            <div
              style={{
                background: "#57779d",
                textAlign: "center",
                padding: "5px",
              }}
            >
              <h3
                style={{
                  color: "white",
                  float:
                    isSelectAll || selectedFeatures?.length > 1
                      ? "right"
                      : "none",
                  marginRight: "20px",
                }}
              >
                عدد النتائج : {features.length}
              </h3>
              {(isSelectAll || selectedFeatures?.length > 1) && (
                <div style={{ textAlign: "left" }}>
                  <Button
                    size="large"
                    onClick={this.editSelectedFeatures.bind(this)}
                    style={{ marginLeft: "10px" }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    <span style={{ marginRight: "5px" }}>تعديل المحدد</span>
                  </Button>
                  {selectedFeatures?.length > 1 &&
                    selectedFeatures?.length != features?.length && (
                      <Button
                        size="large"
                        onClick={this.deleteSelectedFeatures.bind(this)}
                        style={{ marginLeft: "10px" }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        <span style={{ marginRight: "5px" }}>إزالة المحدد</span>
                      </Button>
                    )}
                  <Button
                    size="large"
                    onClick={this.zoomToSelectedFeature.bind(this)}
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
                        checked={isSelectAll}
                        onChange={this.onChangeSelectAll.bind(this)}
                      ></Checkbox>
                    </div>
                  </th>
                  {layerInfo?.outFields
                    ?.filter((x) => !x.notInclude)
                    ?.map((field) => {
                      return <th>{field.arName}</th>;
                    })}
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => {
                  return (
                    index >= minIndex &&
                    index < maxIndex && (
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          <Checkbox
                            style={{ marginTop: "20px" }}
                            checked={feature.isSelected}
                            onChange={this.onChangeSelectFeature.bind(
                              this,
                              index
                            )}
                          ></Checkbox>
                        </td>
                        {layerInfo?.outFields
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
                          <Button
                            className="toolsBtnStyle"
                            style={{ margin: "auto 1px" }}
                            disabled={
                              isSelectAll || selectedFeatures?.length > 1
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
                          <Button
                            className="toolsBtnStyle"
                            style={{ margin: "auto 1px" }}
                            disabled={
                              isSelectAll || selectedFeatures?.length > 1
                            }
                            size="large"
                            onClick={this.removeFeature.bind(this, index)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="" />
                          </Button>
                          <Button
                            className="toolsBtnStyle"
                            style={{ margin: "auto 1px" }}
                            size="large"
                            onClick={this.zoomToFeature.bind(this, feature)}
                          >
                            <FontAwesomeIcon icon={faSearchPlus} className="" />
                          </Button>
                        </td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
            <div className="updateMap" style={{ marginTop: "20px" }}>
              <Pagination
                pageSize={pageSize}
                current={current}
                total={features.length}
                onChange={this.handleChange}
                style={{ bottom: "0px" }}
              />
            </div>
          </div>
        ) : (
          <></>
        )}

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
                                  disabled={this.isdisabledField(field)}
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
                                  disabled={this.isdisabledField(field)}
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
)(withTranslation("labels")(editFeaturesTableComponent));
