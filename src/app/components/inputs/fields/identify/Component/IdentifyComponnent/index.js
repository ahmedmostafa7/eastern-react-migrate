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
import {
  getParcels,
  onBlockChange,
  onLandParcelChange,
  onMunChange,
  onPlaneChange,
  onSearch,
  onSubNameChange,
  onSubTypeChange,
} from "../common";
const { Option } = Select;

class IdentifyComponent extends Component {
  constructor(props) {
    super(props);
    this.PlanNum = [];
    this.planId = null;
    this.parcelTs = [];
    this.selectedLandsT = [];
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

    this.parcelData = {
      label: "حدود الموقع حسب الصك",
      className: "parcelInfo",
      type: "inputs",
      required: true,
      fields: {
        north_length: {
          label: "طول الحد الشمالي",
          value: props?.input?.value?.submission_data?.north_length,
        },
        north_desc: {
          label: "وصف الحد الشمالي",
          value: props?.input?.value?.submission_data?.north_desc,
        },
        south_length: {
          label: "طول الحد الجنوبي",
          value: props?.input?.value?.submission_data?.south_length,
        },
        south_desc: {
          label: "وصف الحد الجنوبي",
          value: props?.input?.value?.submission_data?.south_desc,
        },
        east_length: {
          label: "طول الحد الشرقي",
          value: props?.input?.value?.submission_data?.east_length,
        },
        east_desc: {
          label: "وصف الحد الشرقي",
          value: props?.input?.value?.submission_data?.east_desc,
        },
        west_length: {
          label: "طول الحد الغربي",
          value: props?.input?.value?.submission_data?.west_length,
        },
        west_desc: {
          label: "وصف الحد الغربي",
          value: props?.input?.value?.submission_data?.west_desc,
        },
      },
    };

    this.state = {
      mapLoaded: false,
      munval:
        (props.input && props.input.value.temp && props.input.value.temp.mun) ||
        undefined,
      planeval:
        (props.input &&
          props.input.value.temp &&
          props.input.value.temp.plan) ||
        undefined,
      subTypeval:
        (props.input &&
          props.input.value.temp &&
          props.input.value.temp.subtype) ||
        undefined,
      subNameval:
        (props.input &&
          props.input.value.temp &&
          props.input.value.temp.subname) ||
        undefined,
      blockval:
        (props.input &&
          props.input.value.temp &&
          props.input.value.temp.block) ||
        undefined,
      selectedLands: (props.input && props.input.value.parcels) || [],
      parcelval:
        (props.input &&
          props.input.value.temp &&
          props.input.value.temp.parcel) ||
        undefined,
      blockNum: [],
      conditions: (props.input && props.input.value.conditions) || undefined,
      planSersh: null,
      subDivNames: [],
      subDivType: [],
      parcelNum: [],
      parcelNumS: [],
      MunicipalityNames: [],
      PlanNum: [],
      parcelId: null,
      mapExtend: null,
      parcelSearch: null,
      poly: null,
      parcelData: this.parcelData,
      parcelSideLengths:
        (props.input &&
          props.input.value.submission_data?.parcelsSidesInDetails) ||
        [],
      // submission_data:
      //   values.submission_data ||
      //   (props.input && props.input.value.submission_data) ||
      //   {},
      landsData: {},
    };

    this.UpdateSubmissionDataObject();
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
            let fcs = features
              .filter((r) => r.attributes.MUNICIPALITY_NAME)
              .map((r) => {
                return {
                  code: r.attributes.MUNICIPALITY_NAME_Code,
                  name: r.attributes.MUNICIPALITY_NAME,
                };
              });
            this.setState(
              {
                MunicipalityNames:
                  [2188].indexOf(this.props.currentModule.record.workflow_id) ==
                  -1
                    ? fcs
                    : fcs.filter((codeValue) => {
                        if (
                          this.props.currentModule.record.workflow_id == 2188 &&
                          codeValue.code == 10506
                        ) {
                          return codeValue;
                        }
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
      // esriRequest(mapUrl + "/" + this.LayerID.Municipality_Boundary).then(
      //   (response) => {
      //     this.setState({
      //       // MunicipalityNames:
      //       //   response.types[0].domains.MUNICIPALITY_NAME.codedValues,
      //       MunicipalityNames:
      //         [2188].indexOf(this.props.currentModule.record.workflow_id) == -1
      //           ? response.types[0].domains.MUNICIPALITY_NAME.codedValues
      //           : response.types[0].domains.MUNICIPALITY_NAME.codedValues.filter(
      //               (codeValue) => {
      //                 if (
      //                   this.props.currentModule.record.workflow_id == 2188 &&
      //                   codeValue.code == 10506
      //                 ) {
      //                   return codeValue;
      //                 }
      //               }
      //             ),
      //     });
      //   }
      // );
    });
  }

  // onMunChange = (e) => {
  //   //
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   this.setState({
  //     munval: e,
  //     planeval: undefined,
  //     subTypeval: undefined,
  //     subNameval: undefined,
  //     blockval: undefined,
  //     parcelval: undefined,
  //     selectedLands: [],
  //     selectedLandsT: [],
  //     PlanNum: [],
  //     blockNum: [],
  //     subDivNames: [],
  //     subDivType: [],
  //     parcelId: null,
  //     parcelNum: [],
  //     parcelData: this.parcelData,
  //   });
  //   this.planId = null;

  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Municipality_Boundary,
  //       `MUNICIPALITY_NAME='${e}'`,
  //       true,
  //       ["MUNICIPALITY_NAME"]
  //     ),
  //     callbackResult: (res) => {
  //       this.pol = res.features[0];
  //       highlightFeature(res.features[0], this.map, {
  //         layerName: "SelectGraphicLayer",
  //         isZoom: true,
  //         isHiglightSymbol: true,
  //         highlighColor: [0, 0, 0, 0.25],
  //       });
  //     },
  //   });
  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Plan_Data,
  //       `MUNICIPALITY_NAME='${e}'`,
  //       false,
  //       ["PLAN_SPATIAL_ID", "PLAN_NO"]
  //     ),
  //     callbackResult: (res) => {
  //       this.setState({
  //         PlanNum: res.features.map((e, i) => {
  //           return {
  //             ...e,
  //             i: uniqid(),
  //           };
  //         }),
  //       });
  //     },
  //   });
  // };

  resetFields = () => {
    this.props.onChange([]);
    this.setState({ selectedLands: [], selectedLandsT: [] });
  };

  // onPlaneChange = (f) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");

  //   var planSpatialId = this.state.PlanNum.filter((m) => m.i == f)?.[0]?.attributes
  //     ?.PLAN_SPATIAL_ID;
  //   this.setState({
  //     plan_no: this.state.PlanNum.filter((m) => m.i == f)?.[0]?.attributes?.PLAN_NO,
  //     planeval: f,
  //     subTypeval: undefined,
  //     subNameval: undefined,
  //     blockval: undefined,
  //     parcelval: undefined,
  //     blockNum: [],
  //     subDivNames: [],
  //     subDivType: [],
  //     parcelId: null,
  //     parcelNum: [],
  //     parcelData: this.parcelData,
  //   });

  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Plan_Data,
  //       `PLAN_SPATIAL_ID='${planSpatialId}'`,
  //       true,
  //       ["MUNICIPALITY_NAME"]
  //     ),
  //     callbackResult: (res) => {
  //       this.pol = res.features[0];
  //       highlightFeature(res.features[0], this.map, {
  //         layerName: "SelectGraphicLayer",
  //         isZoom: true,
  //         isHiglightSymbol: true,
  //         highlighColor: [0, 0, 0, 0.25],
  //       });
  //       this.planId = planSpatialId;
  //     },
  //   });
  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Survey_Block,
  //       `PLAN_SPATIAL_ID='${planSpatialId}'`,
  //       false,
  //       ["BLOCK_NO", "BLOCK_SPATIAL_ID"]
  //     ),
  //     callbackResult: (res) => {
  //       this.setState({ blockNum: res.features });
  //     },
  //   });
  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Landbase_Parcel,
  //       `PLAN_SPATIAL_ID='${planSpatialId}'`,
  //       false,
  //       ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
  //     ),
  //     callbackResult: (res) => {
  //       this.setState({
  //         parcelSearch: null,
  //         parcelNum: res.features.map((e, i) => {
  //           return {
  //             ...e,
  //             i,
  //           };
  //         }),
  //       });
  //     },
  //   });
  //   esriRequest(mapUrl + "/" + this.LayerID.Subdivision).then((response) => {
  //     this.setState({ subDivType: response.fields[7].domain.codedValues });
  //   });
  // };
  // onSubTypeChange = (e) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   this.setState({
  //     subType_name: this.state.subDivType.filter((m) => m.code == e)[0].name,
  //     subTypeval: e,
  //     subNameval: undefined,
  //     blockval: undefined,
  //     parcelval: undefined,
  //   });

  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Subdivision,
  //       `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${this.planId}`,
  //       false,
  //       ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"]
  //     ),
  //     callbackResult: (res) => {
  //       this.setState({ subDivNames: res.features });
  //     },
  //   });
  // };

  // onSubNameChange = (e) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   this.setState({
  //     subName_name: this.state.subDivNames.filter(
  //       (m) => m.attributes.SUBDIVISION_SPATIAL_ID == e
  //     )?.[0]?.attributes?.SUBDIVISION_DESCRIPTION,
  //     subNameval: e,
  //     blockval: undefined,
  //     parcelval: undefined,
  //     parcelNum: [],
  //     parcelId: null,
  //   });

  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Subdivision,
  //       `SUBDIVISION_SPATIAL_ID=${e}`,
  //       true,
  //       ["SUBDIVISION_SPATIAL_ID"]
  //     ),
  //     callbackResult: (res) => {
  //       this.pol = res.features[0];
  //       highlightFeature(res.features[0], this.map, {
  //         layerName: "SelectGraphicLayer",
  //         isZoom: true,
  //         isHiglightSymbol: true,
  //         highlighColor: [0, 0, 0, 0.25],
  //       });
  //     },
  //   });
  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Landbase_Parcel,
  //       `SUBDIVISION_SPATIAL_ID=${e}`,
  //       false,
  //       ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
  //     ),
  //     callbackResult: (res) => {
  //       this.setState({
  //         parcelSearch: null,
  //         parcelNum: res.features.map((e, i) => {
  //           return {
  //             ...e,
  //             i,
  //           };
  //         }),
  //       });
  //     },
  //   });
  // };

  // onBlockChange = (e) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   this.setState({
  //     block_no: this.state.blockNum.filter(
  //       (m) => m.attributes.BLOCK_SPATIAL_ID == e
  //     )?.[0]?.attributes?.BLOCK_NO,
  //     blockval: e,
  //     parcelval: undefined,
  //     parcelId: null,
  //     parcelNum: [],
  //   });

  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Survey_Block,
  //       `BLOCK_SPATIAL_ID=${e}`,
  //       true,
  //       ["BLOCK_SPATIAL_ID"]
  //     ),
  //     callbackResult: (res) => {
  //       this.pol = res.features[0];
  //       highlightFeature(res.features[0], this.map, {
  //         layerName: "SelectGraphicLayer",
  //         isZoom: true,
  //         isHiglightSymbol: true,
  //         highlighColor: [0, 0, 0, 0.25],
  //       });
  //     },
  //   });

  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Landbase_Parcel,
  //       `BLOCK_SPATIAL_ID=${e}`,
  //       false,
  //       ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
  //     ),
  //     callbackResult: (res) => {
  //       this.setState({
  //         parcelSearch: null,
  //         parcelNum: res.features.map((e, i) => {
  //           return {
  //             ...e,
  //             i,
  //           };
  //         }),
  //       });
  //     },
  //   });
  // };

  // onLandParcelChange = (f) => {
  //   if (!this.state.selectedLands.length) {
  //     var e = this.state.parcelNum.filter((m) => m.i === f)?.[0]?.attributes
  //       ?.PARCEL_SPATIAL_ID;
  //     this.setState({ parcelId: e, parcelval: f });
  //     this.RolBackPol = this.pol;
  //     this.RolBackParcelNum = this.state.parcelNum;

  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Landbase_Parcel,
  //         `PARCEL_SPATIAL_ID='${e}'`,
  //         true,
  //         ["PARCEL_SPATIAL_ID"]
  //       ),
  //       callbackResult: (res) => {
  //         this.selectedLandsT = [];
  //         highlightFeature(res.features[0], this.map, {
  //           layerName: "SelectGraphicLayer",
  //           strokeColor: [0, 0, 0],
  //           highlightWidth: 3,
  //           isHighlighPolygonBorder: true,
  //           isZoom: true,
  //           zoomFactor: 50,
  //         });
  //       },
  //     });
  //   } else {
  //     var g = this.state.parcelNum.filter((m) => m.i == f)[0];
  //     this.setState({ parcelId: g.attributes.PARCEL_SPATIAL_ID });
  //     highlightFeature(g, this.map, {
  //       layerName: "SelectGraphicLayer",
  //       strokeColor: [0, 0, 0],
  //       isHighlighPolygonBorder: true,
  //       highlightWidth: 3,
  //     });
  //     this.setState({ parcelval: f });
  //   }
  // };

  addParcelToSelect = () => {
    if (this.state.selectedLands && this.state.selectedLands.length > 0) {
      this.setState({
        parcelId:
          this.state.selectedLands[this.state.selectedLands.length - 1].id,
      });

      intersectQueryTask({
        outFields: [
          "MUNICIPALITY_NAME",
          "PARCEL_AREA",
          "PARCEL_LAT_COORD",
          "PARCEL_LONG_COORD",
          "PARCEL_MAIN_LUSE",
          "PLAN_NO",
          "PARCEL_PLAN_NO",
          "USING_SYMBOL",
          "PARCEL_SPATIAL_ID",
        ],
        geometry:
          this.state.selectedLands[this.state.selectedLands.length - 1]
            .geometry,
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
              this.selectedLandsT.push(res);
              this.DrawGraph();
            }
          );
        },
      });
    }
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
    }

    this.map.on("click", (geo) => {
      intersectQueryTask({
        outFields: [
          "MUNICIPALITY_NAME",
          "PARCEL_MAIN_LUSE",
          "PARCEL_AREA",
          "PARCEL_LAT_COORD",
          "PARCEL_LONG_COORD",
          "PLAN_NO",
          "PARCEL_PLAN_NO",
          "USING_SYMBOL",
          "PARCEL_SPATIAL_ID",
        ],
        geometry: geo.mapPoint,
        url: mapUrl + "/" + this.LayerID.Landbase_Parcel,
        where: "PARCEL_PLAN_NO is not null",
        callbackResult: (res) => {
          if (res.features.length > 0) {
            this.setState({
              munval: res.features[0].attributes.MUNICIPALITY_NAME,
            });
            getFeatureDomainName(
              res.features,
              this.LayerID.Landbase_Parcel
            ).then((r) => {
              this.setState({
                parcelSearch: null,
                parcelNum: res.features.map((e, i) => {
                  return {
                    ...e,
                    i,
                  };
                }),
              });

              res.features = res.features.map((e, i) => {
                return {
                  ...e,
                  i,
                };
              });

              this.RolBackParcelNum = res.features.map((e, i) => {
                return {
                  ...e,
                  i,
                };
              });

              //setTimeout(() => {
              if (
                this.selectedLandsT.length == 0 ||
                this.selectedLands.length == 0
              ) {
                this.selectedLandsT.push(res);

                this.DrawGraph(true);
                this.onLandParcelChange(0);
              }
              //}, 500);
            });
          }
        },
      });
    });

    this.props.setCurrentMap(map);

    const {
      input: { value, onChange },
    } = this.props;

    let landsData = {
      ...value,
      conditions: this.state?.conditions,
      temp: {
        map: this.map,
        mun: value?.temp?.mun,
        plan: value?.temp?.plan,
        subtype: value?.temp?.subtype,
        subname: value?.temp?.subname,
        parcelDis: value?.temp?.parcelDis,
        block: value?.temp?.block,
        parcel: value?.temp?.parcel,
      },
      parcels: [...value?.parcels],
      submission_data: { ...value?.submission_data },
    };

    this.setState({
      parcelSearch: null,
      parcelNum: value?.temp?.parcelDis,
      mapLoaded: true,
      landsData: { ...landsData },
    });
    onChange({ ...landsData });
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
    this.state.landsData = {
      ...this.props.input.value,
      parcels: [...this.state.selectedLands],
      submission_data: { ...this.state.submission_data },
    };
    this.props.input.onChange({ ...this.state.landsData });
    this.setState({
      [name + "_isEdit_" + i]: false,
      selectedLands: [...this.state.selectedLands],
    });
  }

  UpdateSubmissionDataObject = () => {
    const { submission_data = {}, parcelData, parcelSideLengths } = this.state;
    var fields = { ...parcelData.fields };

    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });

    Object.keys(fields).map((key, index) => {
      submission_data[key] =
        // (values.submission_data && values.submission_data[key]) ||
        // (this.props.input?.value?.submission_data &&
        //   this.props.input.value?.submission_data[key]) ||
        fields[key]?.value || "";
    });

    submission_data["parcelsSidesInDetails"] = parcelSideLengths;
    submission_data["parcel_data"] = { ...parcelData };

    let landsData = {
      ...this.props.input.value,
      parcels: [...this.state.selectedLands],
      submission_data: { ...submission_data },
    };
    this.props.input.onChange({ ...landsData });
    this.setState({ ...landsData });
    this.props.change("submission_data", submission_data);
  };

  setValue = (item, event) => {
    item.value = event.target.value;

    this.UpdateSubmissionDataObject();
  };

  OnParcelSelect = () => {
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
            !this.state?.parcelSideLengths?.filter((item, index) => {
              return item.parcelId === this.state.parcelId;
            })?.length
          ) {
            this.state?.parcelSideLengths?.push({
              parcelId: this.state.parcelId,
              lengths: { north: 0, south: 0, east: 0, west: 0 },
            });
          }
          if (
            this.state.selectedLands &&
            this.state.selectedLands.length == 0
          ) {
            this.setParcelLengths(res.features[0]);

            ///

            // if (
            //   this.state.selectedLands &&
            //   this.state.selectedLands.length == 0
            // ) {
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
                this.setState({
                  conditions: condition.features,
                });
                getFeatureDomainName(
                  res.features,
                  this.LayerID.Landbase_Parcel
                ).then((r) => {
                  this.setToStore(r);
                  this.addParcelToSelect();
                });
              },
            });
          } else {
            this.state.parcelData.fields.north_length.value = "";
            this.state.parcelData.fields.south_length.value = "";
            this.state.parcelData.fields.east_length.value = "";
            this.state.parcelData.fields.west_length.value = "";
            this.UpdateSubmissionDataObject();
            getFeatureDomainName(
              res.features,
              this.LayerID.Landbase_Parcel
            ).then((r) => {
              this.setToStore(r);
              this.addParcelToSelect();
            });
          }
        },
      });
    }
  };

  setParcelLengths = (parcel) => {
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
            let parcelSideLength = this.state?.parcelSideLengths?.filter(
              (item, index) => {
                return item.parcelId === this.state.parcelId;
              }
            )[0];

            if (parcelSideLength) {
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
                this.state.parcelData.fields.east_length.value = (
                  parseFloat(
                    this.state.parcelData.fields.east_length.value || 0
                  ) + (result?.lengths?.[0] || 0)
                ).toFixed(2);
                parcelSideLength.lengths.east = (
                  parseFloat(parcelSideLength.lengths.east) +
                  (result?.lengths?.[0] || 0)
                ).toFixed(2);
              } else {
                let diffrenceInXWithMinPoint = Math.abs(
                  polylineCenterPoint.x - minPolygonPoint.x
                );
                if (
                  diffrenceInXWithMinPoint < diffrenceWithPolygonCenterPoint
                ) {
                  this.state.parcelData.fields.west_length.value = (
                    parseFloat(
                      this.state.parcelData.fields.west_length.value || 0
                    ) + (result?.lengths?.[0] || 0)
                  ).toFixed(2);
                  parcelSideLength.lengths.west = (
                    parseFloat(parcelSideLength.lengths.west) +
                    (result?.lengths?.[0] || 0)
                  ).toFixed(2);
                } else if (polylineCenterPoint.y > polygonCenterPoint.y) {
                  this.state.parcelData.fields.north_length.value = (
                    parseFloat(
                      this.state.parcelData.fields.north_length.value || 0
                    ) + (result?.lengths?.[0] || 0)
                  ).toFixed(2);
                  parcelSideLength.lengths.north = (
                    parseFloat(parcelSideLength.lengths.north) +
                    (result?.lengths?.[0] || 0)
                  ).toFixed(2);
                } else {
                  this.state.parcelData.fields.south_length.value = (
                    parseFloat(
                      this.state.parcelData.fields.south_length.value || 0
                    ) + (result?.lengths?.[0] || 0)
                  ).toFixed(2);
                  parcelSideLength.lengths.south = (
                    parseFloat(parcelSideLength.lengths.south) +
                    (result?.lengths?.[0] || 0)
                  ).toFixed(2);
                }
              }
            }

            this.UpdateSubmissionDataObject();
          });
        }
      }
    );
  };
  setToStore = (r) => {
    if (r) {
      const {
        input: { value },
      } = this.props;
      this.state.landsData = {
        ...value,
        mapGraphics: [],
        conditions: this.state.conditions,
        submission_data: { ...this.state.submission_data },
        temp: {
          map: this.map,
          mun: this.state.munval,
          plan: this.state.plan_no,
          subtype: this.state.subType_name,
          subname: this.state.subName_name,
          parcelDis: this.RolBackParcelNum,
          block: this.state.block_no,
          parcel: this.state.parcelval,
        },
        parcels: [
          ...this.state.selectedLands,
          {
            attributes: r[0].attributes,
            id: this.state.parcelId,
            geometry: JSON.parse(JSON.stringify(r[0].geometry)),
          },
        ],
      };
      this.props.input.onChange({ ...this.state.landsData });

      this.state.selectedLands.push({
        geometry: r[0].geometry,
        attributes: r[0].attributes,
        id: this.state.parcelId,
      });
    }
  };

  setAdjacentToStore = (r) => {
    let store = this.props.input.value;
    store.temp.parcelDis = r;
    this.props.input.onChange(store);
  };

  LandHoverOn = (f) => {
    if (this.state.selectedLands.length) {
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
    if (this.state.selectedLands.length) {
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
      this.addParcelToSelect();
      this.state.parcelData.fields.north_length.value = "0";
      this.state.parcelData.fields.south_length.value = "0";
      this.state.parcelData.fields.east_length.value = "0";
      this.state.parcelData.fields.west_length.value = "0";
      this.setParcelLengths(this.state.selectedLands[0]);
    }
    if (!this.state.selectedLands.length) {
      onMunChange(this, this.state.munval);
    }
    this.setState({ selectedLands: [...this.state.selectedLands] });
  };

  render() {
    const {
      parcelData,
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
                      option.props.children.find((i) => {
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
                      <Option key={i} value={d.i}>
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
                        if (selectedLands.length) {
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
                إضافة الارض
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

                {window.isAkarApp && (
                  <div className="col-xs-12">
                    <h1 className="titleSelectedParcel">
                      حدود الموقع حسب الصك
                    </h1>

                    <Form
                      id="coorForm"
                      className="top1"
                      style={{ direction: "rtl", padding: "5px" }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gridGap: "10px",
                        }}
                      >
                        {["north", "south", "east", "west"].map(
                          (side, sideIndex) => {
                            return Object.keys(parcelData["fields"])
                              .filter((fSide, fSideIndex) => {
                                return fSide.indexOf(side) != -1;
                              })
                              .sort()
                              .map((obj, parentIndex) => {
                                return (
                                  <div
                                    style={{
                                      marginTop: "20px",
                                      marginBottom: "20px",
                                    }}
                                  >
                                    <label>
                                      {parcelData["fields"][obj].label}
                                    </label>
                                    <input
                                      type="text"
                                      class="form-control"
                                      value={parcelData["fields"][obj].value}
                                      onChange={this.setValue.bind(
                                        this,
                                        parcelData["fields"][obj]
                                      )}
                                    />
                                  </div>
                                );
                              });
                          }
                        )}
                      </div>
                    </Form>
                  </div>
                )}

                {!window.isPlusApp && !window.isAkarApp && conditions && (
                  <div className="col-xs-12">
                    {" "}
                    <h1 className="titleSelectedParcel">الاشتراطات</h1>
                    <table
                      className="table table-bordered"
                      style={{ marginTop: "1%" }}
                    >
                      <thead>
                        <tr>
                          <th>مساحة القسيمة (م2)</th>
                          <th>الحد الأدنى للواجهة (م)</th>
                          <th>نسبة البناء</th>
                          <th>إرتداد الواجهة (م)</th>
                          <th>ارتداد الجوانب (م)</th>
                          <th>ارتداد خلفي (م)</th>
                          <th>عدد الطوابق (م)</th>
                          <th>ارتفاع الطابق (م)</th>
                          <th>معامل كتلة البناء FAR</th>
                          <th>يمكن اضافة دور</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conditions.map((e, i) => {
                          return (
                            <tr key={i}>
                              <td>{e.attributes.SLIDE_AREA}</td>
                              <td>{e.attributes.MIN_FROT_OFFSET}</td>
                              <td>{e.attributes.BUILDING_RATIO}</td>
                              <td>{e.attributes.FRONT_OFFSET}</td>
                              <td>{e.attributes.SIDE_OFFSET}</td>
                              <td>{e.attributes.BACK_OFFSET}</td>
                              <td>{e.attributes.FLOORS}</td>
                              <td>{e.attributes.FLOOR_HEIGHT}</td>
                              <td>{e.attributes.FAR}</td>
                              <td>{e.attributes.ADD_FLOOR}</td>
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
        )}
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(IdentifyComponent);
