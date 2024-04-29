import React, { Component } from "react";
import { esriRequest } from "../common/esri_request";
import {
  queryTask,
  getInfo,
  highlightFeature,
  clearGraphicFromLayer,
  getFeatureDomainName,
  intersectQueryTask,
  addParcelNo,
  convertToEnglish,
  localizeNumber,
  convertToArabic,
} from "../common/common_func";
import {
  onBlockChange,
  onLandParcelChange,
  onMunChange,
  onPlaneChange,
  onSubNameChange,
  onSubTypeChange,
  getParcels,
  onSearch,
} from "../common";
import applyFilters from "main_helpers/functions/filters";
import { geometryServiceUrl, mapUrl } from "../mapviewer/config/map";
import { Select, Button, Form, message } from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import MapBtnsComponent from "../MapBtnsComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import { connect } from "react-redux";
import { querySetting, selectDis } from "./Helpers";
var uniqid = require("uniqid");
import { StickyContainer, Sticky } from "react-sticky";
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
const { Option } = Select;

class addedParcelsIdentifyComponnent extends Component {
  constructor(props) {
    super(props);
    this.PlanNum = [];
    this.planId = null;
    this.parcelTs = [];
    this.selectedLandsT =
      (props?.input?.value?.temp?.parcelDis && [
        { features: props?.input?.value?.temp?.parcelDis },
      ]) ||
      [];
    this.selectedLands = [];
    this.selectionMode = false;
    this.parcel_fields = [
      "PARCEL_PLAN_NO",
      "PARCEL_AREA",
      "PARCEL_BLOCK_NO",
      "DISTRICT_NAME",
      "SUBDIVISION_TYPE",
      "SUBDIVISION_DESCRIPTION",
      "USING_SYMBOL",
      "Natural_Area",
    ];

    this.state = {
      mapLoaded: false,
      munval:
        (props.input && props.input.value.temp && props.input.value.temp.mun) ||
        undefined,
      planeval:
        this.props.mainObject?.landData?.landData?.PLAN_NO ||
        (props.input &&
          props.input.value.temp &&
          props.input.value.temp.plan) ||
        undefined,
      subTypeval:
        (props.input &&
          props.input.value.temp &&
          props.input.value.temp.subTypeval) ||
        undefined,
      subNameval:
        (props.input &&
          props.input.value.temp &&
          props.input.value.temp.subNameval) ||
        undefined,
      blockval:
        (props.input &&
          props.input.value.temp &&
          props.input.value.temp.blockval) ||
        undefined,
      selectedLands: (props.input && props.input.value.parcels) || [],
      parcelval:
        (props.input &&
          props.input.value.temp &&
          props.input.value.temp.parcelval) ||
        undefined,
      conditions: (props.input && props.input.value.conditions) || undefined,
      blockNum: [],
      planSersh: null,
      subDivNames: [],
      subDivType: [],
      parcelNum: this.props?.input?.value?.temp?.parcelDis || [],
      parcelNumS: [],
      MunicipalityNames: [],
      PlanNum: [],
      parcelId: null,
      mapExtend: null,
      parcelSearch: null,
      poly: null,
      landsData: {},
      submission_data: props?.values?.submission_data || {
        north_length: "0",
        north_desc: "",
        south_length: "0",
        south_desc: "",
        east_length: "0",
        east_desc: "",
        west_length: "0",
        west_desc: "",
      },
    };
  }
  LayerID = [];

  convertToArabic(num) {
    if (num) {
      var id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];
      return num.replace(/[0-9]/g, function (w) {
        return id[+w];
      });
    } else {
      return "";
    }
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  componentDidMount() {
    if (window.isAkarApp) {
      console.log("window", window);
      this.parcel_fields = [
        "PARCEL_PLAN_NO",
        "PARCEL_AREA",
        "PARCEL_BLOCK_NO",
        "DISTRICT_NAME",
        "SUBDIVISION_TYPE",
        "SUBDIVISION_DESCRIPTION",
        "USING_SYMBOL",
      ];
    }
    getInfo().then((res) => {
      this.LayerID = res;
      getParcels(this, null, "", { returnDistinctValues: true }, [
        "MUNICIPALITY_NAME",
      ]).then((features) => {
        getFeatureDomainName(features, this.LayerID.Landbase_Parcel).then(
          (features) => {
            this.setState(
              {
                MunicipalityNames: features
                  .filter((r) => r.attributes.MUNICIPALITY_NAME)
                  .map((r) => {
                    return {
                      code: r.attributes.MUNICIPALITY_NAME_Code,
                      name: r.attributes.MUNICIPALITY_NAME,
                    };
                  }),
                allParcels: features,
              },
              () => {
                this.loadLists = true;
                if (this.state.munval) {
                  onMunChange(this, this.state.munval, () => {
                    onPlaneChange(this, this.state.planeval, () => {
                      onSubTypeChange(this, this.state.subTypeval, () => {
                        onSubNameChange(this, this.state.subNameval, () => {
                          onBlockChange(this, this.state.blockval, () => {
                            onLandParcelChange(
                              this,
                              this.state.parcelval,
                              () => {}
                            );
                          });
                        });
                      });
                    });
                  });
                }
                this.loadLists = false;
              }
            );
          }
        );
      });
    });
  }

  resetFields = () => {
    this.props.onChange([]);
    this.setState({ selectedLands: [], selectedLandsT: [] });
  };

  addParcelToSelect = (feature) => {
    return new Promise((resolve, reject) => {
      intersectQueryTask({
        outFields: [
          // "MUNICIPALITY_NAME",
          // "PARCEL_AREA",
          // "PARCEL_LAT_COORD",
          // "PARCEL_LONG_COORD",
          // "PARCEL_MAIN_LUSE",
          // "PLAN_NO",
          // "PARCEL_PLAN_NO",
          // "USING_SYMBOL",
          // "PARCEL_SPATIAL_ID",
          "*",
        ],
        geometry: feature.geometry,
        url: mapUrl + "/" + this.LayerID.Landbase_Parcel,
        where: "PARCEL_PLAN_NO is not null",
        callbackResult: (res) => {
          getFeatureDomainName(res.features, this.LayerID.Landbase_Parcel).then(
            (r) => {
              res.features = res.features.map((e, i) => {
                return {
                  ...e,
                  i: uniqid(),
                };
              });

              return resolve(res);
            }
          );
        },
      });
    });
  };

  DrawGraph = () => {
    if (!this.state.selectedLands.length) {
      this.map.graphics.clear();
      clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");

      highlightFeature(this.RolBackPol, this.map, {
        layerName: "SelectGraphicLayer",
        isZoom: true,
        isHiglightSymbol: true,
        highlighColor: [255, 0, 0, 0.25],
      });

      this.setState({
        parcelSearch: null,
        parcelNum: this.RolBackParcelNum,
        parcelval: undefined,
      });
    } else {
      this.parcelDis = selectDis(this.selectedLandsT);
      console.log(this.parcelDis);
      this.setAdjacentToStore(this.parcelDis);
      this.setState({ parcelSearch: null, parcelNum: this.parcelDis });

      clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

      highlightFeature(
        this.parcelDis.filter(
          (element) =>
            !this.state.selectedLands.find(
              (i) => i.id === element.attributes.PARCEL_SPATIAL_ID
            )
        ),
        this.map,
        {
          layerName: "SelectLandsGraphicLayer",
          noclear: false,
          isZoom: false,
          isHiglightSymbol: true,
          highlighColor: [0, 255, 0, 0.5],
          zoomFactor: 50,
        }
      );

      this.parcelDis
        .filter(
          (element) =>
            !this.state.selectedLands.find(
              (i) => i.id === element.attributes.PARCEL_SPATIAL_ID
            )
        )
        .forEach((f) => {
          addParcelNo(
            f.geometry.getExtent().getCenter(),
            this.map,
            f.attributes.PARCEL_PLAN_NO + "",
            "ParcelPlanNoGraphicLayer",
            14,
            [0, 0, 0]
          );
        });

      highlightFeature(
        this.parcelDis.filter((element) =>
          this.state.selectedLands.find(
            (i) => i.id === element.attributes.PARCEL_SPATIAL_ID
          )
        ),
        this.map,
        {
          layerName: "SelectLandsGraphicLayer",
          noclear: true,
          attr: { isParcel: true },
          isZoom: true,
          isHighlighPolygonBorder: true,
          zoomFactor: 50,
        }
      );

      this.parcelDis
        .filter((element) =>
          this.state.selectedLands.find(
            (i) => i.id === element.attributes.PARCEL_SPATIAL_ID
          )
        )
        .forEach((f) => {
          addParcelNo(
            f.geometry.getExtent().getCenter(),
            this.map,
            f.attributes.PARCEL_PLAN_NO + "",
            "ParcelPlanNoGraphicLayer",
            14,
            [0, 0, 0]
          );
        });
    }
  };

  mapLoaded = (map) => {
    this.map = map;
    if (
      this.props.input &&
      this.props.input.value &&
      this.props.input.value.parcels
    ) {
      highlightFeature(this.props.input.value.parcels, this.map, {
        layerName: "SelectGraphicLayer",
        noclear: true,
        isZoom: true,
        attr: { isParcel: true },
        isHighlighPolygonBorder: true,
        zoomFactor: 50,
      });

      //setTimeout(() => {
      this.props.input.value.parcels.forEach((f) => {
        f.geometry = new esri.geometry.Polygon(f.geometry);
        addParcelNo(
          f.geometry.getExtent().getCenter(),
          this.map,
          f.attributes.PARCEL_PLAN_NO + "",
          "ParcelPlanNoGraphicLayer",
          14,
          [0, 0, 0]
        );
      });

      highlightFeature(
        this.props.input.value?.temp?.parcelDis?.filter(
          (element) =>
            !this.props.input.value.parcels.find(
              (i) =>
                i.attributes.PARCEL_SPATIAL_ID ===
                element.attributes.PARCEL_SPATIAL_ID
            )
        ),
        this.map,
        {
          layerName: "SelectLandsGraphicLayer",
          noclear: false,
          isZoom: false,
          isHiglightSymbol: true,
          highlighColor: [0, 255, 0, 0.5],
          zoomFactor: 50,
        }
      );

      this.props.input.value?.temp?.parcelDis
        ?.filter(
          (element) =>
            !this.props.input.value.parcels.find(
              (i) =>
                i.attributes.PARCEL_SPATIAL_ID ===
                element.attributes.PARCEL_SPATIAL_ID
            )
        )
        ?.forEach((f) => {
          if (!f.geometry.getExtent) {
            f.geometry = new esri.geometry.Polygon(f.geometry);
          }
          addParcelNo(
            f.geometry.getExtent().getCenter(),
            this.map,
            f.attributes.PARCEL_PLAN_NO + "",
            "ParcelPlanNoGraphicLayer",
            14,
            [0, 0, 0]
          );
        });

      const {
        input: { value, onChange },
      } = this.props;

      let landsData = {
        ...value,
        conditions: this.state?.conditions,
        temp: {
          // map: this.map,
          // mun: value?.temp?.mun,
          // plan: value?.temp?.plan,
          // subtype: value?.temp?.subtype,
          // subname: value?.temp?.subname,
          // parcelDis: value?.temp?.parcelDis,
          // block: value?.temp?.block,
          // parcel: value?.temp?.parcel,
          mun: this.props.input.value.temp.mun,
          plan:
            this.props.mainObject?.landData?.landData?.PLAN_NO ||
            this.props.input.value.temp.plan,
          subTypeval: this.props.input.value.temp.subTypeval,
          subNameval: this.props.input.value.temp.subNameval,
          parcelDis: this.props.input.value.temp.parcelDis,
          blockval: this.props.input.value.temp.blockval,
          parcelval: this.props.input.value.temp.parcelval,
          subname: this.props.input.value.temp.subname,
          block_no: this.props.input.value.temp.block_no,
          city_name: this.props.input.value.temp.city_name,
        },
        parcels: [...value?.parcels],
      };
      onChange({ ...landsData });
    }
    this.setState({
      mapLoaded: true,
    });
    this.props.setCurrentMap(map);
  };

  myChangeHandler = (name, event) => {
    this["edit_" + name] = event.target.value;
  };

  enableEdit(name, i) {
    this.setState({ [name + "_isEdit_" + i]: true });
  }

  showEditBtn(name, value) {
    if (name == "USING_SYMBOL") {
      return value == null;
    } else {
      return (
        [
          "PARCEL_AREA",
          "PARCEL_BLOCK_NO",
          "DISTRICT_NAME",
          "SUBDIVISION_TYPE",
          "SUBDIVISION_DESCRIPTION",
          "Natural_Area",
        ].indexOf(name) > -1
      );
    }
  }

  saveEdit(id, name, i) {
    let findParcel = this.props.input.value.parcels.find((p) => {
      return [p?.id, p?.attributes?.PARCEL_SPATIAL_ID].indexOf(id) != -1;
    });
    findParcel.attributes[name] =
      this["edit_" + name] || findParcel.attributes[name];
    let selectLand = this.state.selectedLands.find((p) => {
      return [p?.id, p?.attributes?.PARCEL_SPATIAL_ID].indexOf(id) != -1;
    });
    selectLand.attributes[name] =
      this["edit_" + name] || selectLand.attributes[name];
    this.setState(
      {
        [name + "_isEdit_" + i]: false,
        selectedLands: [...this.state.selectedLands],
      },
      () => {
        this.setToStore();
      }
    );
  }

  resetGraphics = () => {
    this.state["selectedLands"] = [];
    this.state["selectedLandsT"] = [];
    this.DrawGraph();
    this.UpdateSubmissionDataObject();
  };

  UpdateSubmissionDataObject = () => {
    const { submission_data } = this.state;
    this.setToStore();
    this.props.change("submission_data", submission_data);
  };

  setValue = (item, event) => {
    item.value = event.target.value;

    this.UpdateSubmissionDataObject();
  };

  OnParcelSelect = () => {
    let submission_data = {};
    this.setState({ parcelval: undefined });
    clearGraphicFromLayer(this.map, "SelectGraphicLayer");
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");

    if (
      !this.state.selectedLands.filter((e) => e.id === this.state.parcelId)
        .length
    ) {
      queryTask({
        ...querySetting(
          this.LayerID.Landbase_Parcel,
          `PARCEL_SPATIAL_ID =${this.state.parcelId}`,
          true,
          [
            "PARCEL_AREA",
            "PARCEL_MAIN_LUSE",
            "PARCEL_LAT_COORD",
            "PARCEL_LONG_COORD",
            "PLAN_NO",
            "PARCEL_PLAN_NO",
            "USING_SYMBOL",
            "PARCEL_BLOCK_NO",
            "DISTRICT_NAME",
            "SUBDIVISION_DESCRIPTION",
            "SUBDIVISION_TYPE",
            "PARCEL_SPATIAL_ID",
            "MUNICIPALITY_NAME",
          ]
        ),
        callbackResult: (res) => {
          if (
            this.state.selectedLands &&
            this.state.selectedLands.length == 0
          ) {
            this.setParcelLengths(res.features[0]).then((submission_data) => {
              const formValues = applyFilters({
                key: "FormValues",
                form: "stepForm",
              });

              Object.keys(submission_data).forEach((key) => {
                submission_data[key] =
                  (+formValues.submission_data[key] || 0) +
                  (+submission_data[key] || 0);
              });

              queryTask({
                ...querySetting(
                  this.LayerID.Tbl_Parcel_Conditions,
                  `USING_SYMBOL_CODE ='${res.features[0].attributes.USING_SYMBOL}'`,
                  false,
                  [
                    "SLIDE_AREA",
                    "MIN_FROT_OFFSET",
                    "BUILDING_RATIO",
                    "FRONT_OFFSET",
                    "SIDE_OFFSET",
                    "BACK_OFFSET",
                    "FLOORS",
                    "FLOOR_HEIGHT",
                    "FAR",
                    "ADD_FLOOR",
                  ]
                ),
                callbackResult: (condition) => {
                  this.setState(
                    {
                      conditions: condition.features,
                      submission_data,
                    },
                    () => {
                      this.UpdateSubmissionDataObject();
                    }
                  );
                  getFeatureDomainName(
                    res.features,
                    this.LayerID.Landbase_Parcel
                  ).then((r) => {
                    this.setToStore(r);
                    this.addParcelToSelect(r[0]).then((res) => {
                      this.selectedLandsT.push(res);
                      this.DrawGraph();
                    });
                  });
                },
              });
            });
          } else {
            submission_data.north_length = "";
            submission_data.south_length = "";
            submission_data.east_length = "";
            submission_data.west_length = "";
            this.setState({ submission_data }, () => {
              this.UpdateSubmissionDataObject();
            });
            getFeatureDomainName(
              res.features,
              this.LayerID.Landbase_Parcel
            ).then((r) => {
              this.setToStore(r);
              this.addParcelToSelect(r[0]).then((res) => {
                this.selectedLandsT.push(res);
                this.DrawGraph();
              });
            });
          }
        },
      });
    }
  };

  setParcelLengths = (parcel) => {
    let submission_data = {};
    return new Promise((resolve, reject) => {
      LoadModules([
        "esri/geometry/Point",
        "esri/geometry/Polyline",
        "esri/geometry/Polygon",
        "esri/tasks/LengthsParameters",
        "esri/tasks/GeometryService",
        "esri/geometry/mathUtils",
      ]).then(
        ([
          Point,
          Polyline,
          Polygon,
          LengthsParameters,
          GeometryService,
          mathUtils,
        ]) => {
          let maxPoint, minPoint;
          let max = 0,
            min;
          //

          parcel.geometry = new esri.geometry.Polygon(parcel.geometry);
          for (let j = 0; j < parcel.geometry.rings[0].length - 1; j++) {
            let point1 = new esri.geometry.Point(
              parcel.geometry.rings[0][j][0],
              parcel.geometry.rings[0][j][1]
            );
            let point2 = new esri.geometry.Point(
              parcel.geometry.rings[0][j + 1][0],
              parcel.geometry.rings[0][j + 1][1]
            );

            if (point1.x > max) {
              max = point1.x;
              maxPoint = point1;
            }

            if (!min || point1.x < min) {
              min = point1.x;
              minPoint = point1;
            }

            if (point2.x > max) {
              max = point2.x;
              maxPoint = point2;
            }

            if (!min || point2.x < min) {
              min = point2.x;
              minPoint = point2;
            }
          }

          let arr = [...parcel.geometry.rings[0]];

          for (let i = arr.length - 1; i > 0; i--) {
            let pnt1 = new Point(arr[i], parcel.geometry.spatialReference);
            let pnt2 = new Point(arr[i - 1], parcel.geometry.spatialReference);
            let length = mathUtils.getLength(pnt1, pnt2);
            length = Number(parseFloat(length).toFixed(2));

            let path = {
              paths: [[arr[i], arr[i - 1]]],
              text: length,
              spatialReference: parcel.geometry.spatialReference,
            };

            let geometryServiceLength = new GeometryService(geometryServiceUrl);
            let polyline = new Polyline(path);
            let lengthParams = new LengthsParameters();

            lengthParams.polylines = [polyline];

            lengthParams.lengthUnit = GeometryService.UNIT_METER;

            lengthParams.geodesic = true;

            geometryServiceLength.lengths(lengthParams, (result) => {
              let polygonCenterPoint = parcel.geometry.getCentroid();
              let polylineCenterPoint = polyline.getExtent().getCenter();
              let maxPolgonPoint = maxPoint;
              let minPolygonPoint = minPoint;

              let diffrenceInXWithMaxPoint = Math.abs(
                polylineCenterPoint.x - maxPolgonPoint.x
              );
              let diffrenceWithPolygonCenterPoint = Math.abs(
                polylineCenterPoint.x - polygonCenterPoint.x
              );
              //east
              if (diffrenceInXWithMaxPoint < diffrenceWithPolygonCenterPoint) {
                submission_data.east_length = +(
                  parseFloat(submission_data.east_length || 0) +
                  (result?.lengths?.[0] || 0)
                ).toFixed(2);
              } else {
                let diffrenceInXWithMinPoint = Math.abs(
                  polylineCenterPoint.x - minPolygonPoint.x
                );
                if (
                  diffrenceInXWithMinPoint < diffrenceWithPolygonCenterPoint
                ) {
                  submission_data.west_length = +(
                    parseFloat(submission_data.west_length || 0) +
                    (result?.lengths?.[0] || 0)
                  ).toFixed(2);
                } else if (polylineCenterPoint.y > polygonCenterPoint.y) {
                  submission_data.north_length = +(
                    parseFloat(submission_data.north_length || 0) +
                    (result?.lengths?.[0] || 0)
                  ).toFixed(2);
                } else {
                  submission_data.south_length = +(
                    parseFloat(submission_data.south_length || 0) +
                    (result?.lengths?.[0] || 0)
                  ).toFixed(2);
                }
              }

              if (i == 1) {
                return resolve(submission_data);
              }
            });
          }
        }
      );
    });
  };

  setToStore = (r) => {
    const {
      input: { value },
    } = this.props;
    this.state.landsData = {
      ...value,
      mapGraphics: [],
      conditions: this.state.conditions,
      //submission_data: { ...this.state.submission_data },
      temp: {
        mun: this.state.munval,
        plan: this.state.planeval,
        subTypeval: this.state.subTypeval,
        subNameval: this.state.subNameval,
        subname: this.state.subName_name,
        parcelDis: this.parcelDis || this.RolBackParcelNum,
        block_no: this.state.block_no,
        blockval: this.state.blockval,
        parcelval: this.state.parcelval,
        city_name: this.state.city_name,
      },
    };
    if (r) {
      if (this.state.selectedLands.length) {
        this.state.landsData["parcels"] = [
          ...this.state.selectedLands,
          {
            attributes: r[0].attributes,
            id: this.state.parcelId,
            geometry: JSON.parse(JSON.stringify(r[0].geometry)),
          },
        ];
      } else {
        this.state.landsData["parcels"] = [
          {
            geometry: JSON.parse(JSON.stringify(r[0].geometry)),
            attributes: r[0].attributes,
            id: this.state.parcelId,
          },
        ];
      }
    }
    this.setState({ selectedLands: this.state.landsData.parcels || [] }, () => {
      this.props.input.onChange({ ...this.state.landsData });
    });
  };

  setAdjacentToStore = (r) => {
    let store = this.props.input.value;
    store.temp.parcelDis = r;
    this.props.input.onChange(store);
  };

  LandHoverOn = (f) => {
    if (this.state.selectedLands?.length) {
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      var parcel = this.state.parcelNum.filter((m) => m.i == f.key)[0];
      highlightFeature(parcel, this.map, {
        layerName: "SelectGraphicLayer",
        strokeColor: [0, 0, 0],
        isHighlighPolygonBorder: true,
        highlightWidth: 3,
      });
    }
  };

  LandHoverOff = (f) => {
    if (this.state.selectedLands?.length) {
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
    }
  };

  remove = (item) => {
    this.state.selectedLands.pop(item);
    const values = slice(this.props.input.value.parcels, 0, -1);
    this.props.input.onChange([...values]);
    if (this.state.selectedLandsT) {
      this.state.selectedLandsT.pop(item);
    }
    this.DrawGraph();

    if (this.state.selectedLands.length == 1) {
      this.setParcelLengths(item).then((submission_data) => {
        const formValues = applyFilters({
          key: "FormValues",
          form: "stepForm",
        });

        Object.keys(submission_data).forEach((key) => {
          submission_data[key] =
            (+formValues.submission_data[key] || 0) +
            (+submission_data[key] || 0);
        });

        this.setState({ submission_data }, () => {
          this.UpdateSubmissionDataObject();
        });
      });
    } else {
      let submission_data = {};
      submission_data.north_length = "";
      submission_data.south_length = "";
      submission_data.east_length = "";
      submission_data.west_length = "";
      this.setState({ submission_data }, () => {
        this.UpdateSubmissionDataObject();
      });
    }
  };

  render() {
    const {
      selectedLands,
      MunicipalityNames,
      subDivType,
      subDivNames,
      subNameval,
      blockNum,
      blockval,
      PlanNum,
      mapLoaded,
      planeval,
      parcelSearch,
      parcelNum,
      parcelval,
      conditions,
    } = this.state;
    const { fullMapWidth } = this.props;
    return (
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
        {/* <div className="btn-fixed">
          <MapBtnsComponent {...this.props}></MapBtnsComponent>
        </div> */}

        <div className={!fullMapWidth ? "content-section implementation" : ""}>
          {mapLoaded && (
            <div style={{ padding: "10px" }}>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                autoFocus
                onChange={(val) => {
                  onMunChange(this, val);
                }}
                showSearch
                value={this.state.munval}
                placeholder="اختر اسم البلديه"
                disabled={!this.state.MunicipalityNames?.length}
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (option.props.children) {
                    return (
                      option.props.children?.find((i) => {
                        return i && i.indexOf(input.trim().toLowerCase()) >= 0;
                      }) != null
                    );
                  } else {
                    return false;
                  }
                }}
              >
                {MunicipalityNames?.map((e) => (
                  <Option key={e.code} value={e.code}>
                    {e.name}{" "}
                  </Option>
                ))}
              </Select>

              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                //onChange={this.onPlaneChange}
                onChange={(val) => {
                  onPlaneChange(this, val);
                }}
                showSearch
                autoFocus
                disabled={!PlanNum.length}
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (option.props.children) {
                    return (
                      option.props.children?.indexOf(convertToArabic(input)) !=
                      -1
                    );
                  } else {
                    return false;
                  }
                }}
                value={planeval}
                placeholder="رقم المخطط"
                notFoundContent="not found"
              >
                {PlanNum
                  //.slice(0, 100)
                  .map((d, i) => {
                    return (
                      <Option key={d.i} value={d.i}>
                        {localizeNumber(d.attributes.PLAN_NO)}
                      </Option>
                    );
                  })}
              </Select>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                autoFocus
                onChange={(val) => {
                  onSubTypeChange(this, val);
                }}
                showSearch
                disabled={!subDivType.length}
                value={this.state.subTypeval}
                placeholder={"نوع التقسيم"}
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (option.props.children) {
                    return (
                      option.props.children?.indexOf(convertToArabic(input)) !=
                      -1
                    );
                  } else {
                    return false;
                  }
                }}
              >
                {subDivType
                  //.slice(0, 100)
                  .map((e, i) => (
                    <Option key={i} value={e.code}>
                      {" "}
                      {e.name}{" "}
                    </Option>
                  ))}
              </Select>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                autoFocus
                onChange={(val) => {
                  onSubNameChange(this, val);
                }}
                showSearch
                disabled={!subDivNames.length}
                placeholder="اسم التقسيم"
                value={subNameval}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children?.indexOf(convertToArabic(input)) != -1
                }
              >
                {subDivNames
                  //.slice(0, 100)
                  .map((e, i) => (
                    <Option key={i} value={e.attributes.SUBDIVISION_SPATIAL_ID}>
                      {" "}
                      {e.attributes.SUBDIVISION_DESCRIPTION}
                    </Option>
                  ))}
              </Select>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                autoFocus
                onChange={(val) => {
                  onBlockChange(this, val);
                }}
                showSearch
                disabled={!blockNum.length}
                value={blockval}
                placeholder="رقم البلك"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children?.indexOf(convertToArabic(input)) != -1
                }
              >
                {blockNum
                  //.slice(0, 100)
                  .map((e, i) => (
                    <Option key={i} value={e.attributes.BLOCK_SPATIAL_ID}>
                      {localizeNumber(e.attributes.BLOCK_NO)}
                    </Option>
                  ))}
              </Select>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                autoFocus
                onChange={(val) => {
                  onLandParcelChange(this, val);
                }}
                showSearch
                disabled={parcelNum && !parcelNum.length}
                onSearch={(e) => {
                  this.setState({ parcelSearch: e });
                  onSearch(this, e);
                }}
                filterOption={(input, option) => {
                  if (option.props.children) {
                    return (
                      option.props.children?.indexOf(convertToArabic(input)) !=
                      -1
                    );
                  } else {
                    return false;
                  }
                }}
                value={parcelval}
                placeholder="رقم قطعة الارض"
              >
                {parcelNum &&
                  parcelNum
                    .filter((e, i) => {
                      if (parcelSearch) {
                        if (this.state.selectedLands.length) {
                          return !this.state.selectedLands.find(
                            (tt) =>
                              tt.attributes.PARCEL_SPATIAL_ID ==
                              e.attributes.PARCEL_SPATIAL_ID
                          );
                        } else {
                          return (
                            e.attributes.PARCEL_PLAN_NO &&
                            e.attributes.PARCEL_PLAN_NO.toLowerCase().indexOf(
                              parcelSearch.toLowerCase()
                            ) >= 0
                          );
                        }
                      } else {
                        if (selectedLands?.length) {
                          return (
                            !selectedLands.find(
                              (tt) =>
                                tt.attributes.PARCEL_PLAN_NO ==
                                e.attributes.PARCEL_PLAN_NO
                            ) && e.attributes.PARCEL_PLAN_NO
                          );
                        } else {
                          return e.attributes.PARCEL_PLAN_NO;
                        }
                      }
                    })
                    .slice(0, 100)
                    .map((e, i) => {
                      return (
                        <Option
                          onMouseEnter={this.LandHoverOn}
                          onMouseLeave={this.LandHoverOff}
                          key={e.attributes.PARCEL_SPATIAL_ID}
                          value={e.i}
                        >
                          {localizeNumber(e.attributes.PARCEL_PLAN_NO)}
                        </Option>
                      );
                    })}
              </Select>

              <Button
                className="add-gis"
                disabled={this.state.parcelId === null}
                onClick={this.OnParcelSelect}
              >
                إضافة الأرض
              </Button>
            </div>
          )}

          <MapComponent
            mapload={this.mapLoaded.bind(this)}
            {...this.props}
          ></MapComponent>
        </div>
        {mapLoaded && (
          <div style={{ gridColumn: "1/3" }}>
            {selectedLands && selectedLands.length > 0 && (
              <div>
                <h1 className="titleSelectedParcel">الأراضي المختارة</h1>

                <table
                  className="table table-bordered"
                  style={{ marginTop: "1%" }}
                >
                  <thead>
                    <tr>
                      <th>رقم القطعه</th>
                      <th>المساحة من الصك م٢</th>
                      <th>رقم البلك</th>
                      <th>الحي</th>
                      <th>نوع التقسيم</th>
                      <th>اسم التقسيم</th>
                      <th>رمز الاستخدام</th>
                      {!window.isAkarApp && <th>المساحة من الطبيعة م٢</th>}
                      <th> خيارات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLands.map((e, i) => {
                      return (
                        <tr key={i}>
                          {this.parcel_fields.map((field, k) => {
                            return (
                              <td key={k}>
                                <div>
                                  {!this.state[field + "_isEdit_" + i] ? (
                                    <span>
                                      <span>
                                        {e.attributes[field] || "غير متوفر"}
                                      </span>
                                      {this.showEditBtn(
                                        field,
                                        e.attributes[field]
                                      ) && (
                                        <span>
                                          <button
                                            className="btn"
                                            style={{ marginRight: "20px" }}
                                            onClick={this.enableEdit.bind(
                                              this,
                                              field,
                                              i
                                            )}
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
                                        type="text"
                                        onChange={this.myChangeHandler.bind(
                                          this,
                                          field
                                        )}
                                      />
                                      <button
                                        className="btn"
                                        style={{ marginRight: "20px" }}
                                        onClick={this.saveEdit.bind(
                                          this,
                                          e.id,
                                          field,
                                          i
                                        )}
                                      >
                                        <i className="fa fa-floppy-o"></i>
                                      </button>
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}

                          {i === selectedLands.length - 1 ? (
                            <td>
                              <button
                                className=" btn btn-danger "
                                onClick={this.remove.bind(this, e)}
                              >
                                حذف
                              </button>
                            </td>
                          ) : (
                            ""
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(addedParcelsIdentifyComponnent);
