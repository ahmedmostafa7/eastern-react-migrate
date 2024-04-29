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
  convertToArabic,
  convertToEnglish,
  drawLength,
  map_object,
  checkParcelAdjacents,
  localizeNumber,
} from "../common/common_func";

import { geometryServiceUrl, mapUrl } from "../mapviewer/config/map";
import { Select, Button, Form, message } from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import MapBtnsComponent from "../MapBtnsComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
import { connect } from "react-redux";
import { querySetting, selectDis } from "./Helpers";
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
const { Option } = Select;
export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "lands"),
    ...mapDispatchToProps1(dispatch),
  };
};

class krokiIdentifyComponnent extends Component {
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

    this.parcel_fields_headers = ["رقم الأرض", "المساحة (م2)", "رمز الأستخدام"];
    this.parcel_fields = [
      { name: "PARCEL_PLAN_NO", editable: false },
      { name: "PARCEL_AREA", editable: true },
      { name: "USING_SYMBOL", editable: false },
    ];
    this.parcelDataFields = {
      parcel_type: {
        label: "عبارة عن",
        placeholder: "من فضلك اخل نوع الأرض",
        type: "input",
        field: "select",
        name: "parcel_type",
        data: [
          { label: "أرض فضاء", value: "أرض فضاء" },
          { label: "مبنى سكني", value: "مبنى سكني" },
          { label: "ورشة", value: "ورشة" },
          { label: "أخرى", value: "أخرى" },
        ],
        required: true,
      },
      other: {
        label: "أخرى",
        placeholder: "من فضلك ادخل وصف أخرى",
        field: "text",
        type: "input",
        name: "other",
        maxLength: 200,
        required: true,
        permission: {
          // show_match_value: { parcel_type: "أخرى" },
          show_values_equal_list: [
            {
              key: "parcel_type",
              value: "أخرى",
            },
          ],
        },
      },
      north_length: {
        label: "طول الحد الشمالي (م)",
        placeholder: "من فضلك ادخل طول الحد الشمالي (م)",
        type: "number",
        name: "north_length",
        required: true,
      },
      north_desc: {
        label: "وصف الحد الشمالي",
        placeholder: "من فضلك ادخل وصف الحد الشمالي",
        type: "text",
        name: "north_desc",
        maxLength: 200,
        required: true,
      },
      south_length: {
        label: "طول الحد الجنوبي (م)",
        placeholder: "من فضلك ادخل طول الحد الجنوبي (م)",
        type: "number",
        name: "south_length",
        required: true,
      },
      south_desc: {
        label: "وصف الحد الجنوبي",
        placeholder: "من فضلك ادخل وصف الحد الجنوبي",
        type: "text",
        name: "south_desc",
        maxLength: 200,
        required: true,
      },
      east_length: {
        label: "طول الحد الشرقي (م)",
        placeholder: "من فضلك ادخل طول الحد الشرقي (م)",
        type: "number",
        name: "east_length",
        required: true,
      },
      east_desc: {
        label: "وصف الحد الشرقي",
        placeholder: "من فضلك ادخل وصف الحد الشرقي",
        type: "text",
        name: "east_desc",
        maxLength: 200,
        required: true,
      },
      west_length: {
        label: "طول الحد الغربي (م)",
        placeholder: "من فضلك ادخل طول الحد الغربي (م)",
        type: "number",
        name: "west_length",
        required: true,
      },
      west_desc: {
        label: "وصف الحد الغربي",
        placeholder: "من فضلك ادخل وصف الحد الغربي",
        type: "text",
        name: "west_desc",
        maxLength: 200,
        required: true,
      },
    };

    map_object(props.input && props.input.value.parcels);
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
      planSersh: null,
      blockNum: [],
      subDivNames: [],
      subDivType: [],
      MunicipalityNames: [],
      PlanNum: [],
      parcelNum: this.props?.input?.value?.temp?.parcelDis || [],
      parcelNumS: [],
      parcelId: null,
      mapExtend: null,
      parcelSearch: null,
      poly: null,
      //parcelSideLengths: [],
      domainLists: props.input.value.domainLists || {},
      parcelData: props.input.value.parcelData || {},
      landsData: {},
    };

    this.isloaded = true;
  }
  LayerID = [];

  UpdateSubmissionDataObject = () => {
    const { parcelData } = this.state;
    var fields = { ...parcelData.fields };
    Object.keys(fields).map((key, index) => {
      parcelData[key] = fields[key].value;
    });
    this.state.landsData = {
      ...this.props.input.value,
      parcels: [...this.state.selectedLands],
      parcelData: { ...parcelData },
      domainLists: { ...this.state.domainLists },
      // lists: {
      //   subDivNames: [...this.state.subDivNames],
      //   MunicipalityNames: [...this.state.MunicipalityNames],
      //   subDivType: [...this.state.subDivType],
      //   PlanNum: [...this.state.PlanNum],
      //   blockNum: [...this.state.blockNum],
      // },
    };
    // this.props.input.onChange({ ...this.state.landsData });
    this.setState({ parcelData: parcelData }, () => {
      this.setToStore();
    });
  };

  componentDidMount() {
    window.filterUrl = mapUrl;
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
      esriRequest(mapUrl + "/" + this.LayerID.Subdivision).then((response) => {
        this.setState({ subDivType: response.fields[7].domain.codedValues });
      });
    });
    this.isloaded = false;
    // if (
    //   this.props.mainObject &&
    //   this.props.mainObject.landData &&
    //   this.isloaded
    // ) {

    //   this.UpdateSubmissionDataObject();
    // }
  }

  //   onMunChange = (e, callback) => {
  //     //
  //     clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //     if (!callback) {
  //     this.setState({
  //       munval: e,
  //       planeval: undefined,
  //       subTypeval: undefined,
  //       subNameval: undefined,
  //       blockval: undefined,
  //       parcelval: undefined,
  //       selectedLands: [],
  //       selectedLandsT: [],
  //       PlanNum: [],
  //       blockNum: [],
  //       subDivNames: [],
  //       // subDivType: [],
  //       parcelId: null,
  //       parcelNum: [],
  //       parcelData: {},
  //     });
  //   }
  //     this.planId = null;
  // if (e) {
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Municipality_Boundary,
  //         `MUNICIPALITY_NAME='${e}'`,
  //         true,
  //         ["MUNICIPALITY_NAME"]
  //       ),
  //       callbackResult: (res) => {
  //         this.pol = res.features[0];
  //         highlightFeature(res.features[0], this.map, {
  //           layerName: "SelectGraphicLayer",
  //           isZoom: true,
  //           isHiglightSymbol: true,
  //           highlighColor: [0, 0, 0, 0.25],
  //         });
  //       },
  //     });
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Plan_Data,
  //         `MUNICIPALITY_NAME='${e}'`,
  //         false,
  //         ["PLAN_SPATIAL_ID", "PLAN_NO"]
  //       ),
  //       callbackResult: (res) => {
  //         this.setState({
  //           PlanNum: res.features.map((e, i) => {
  //             return {
  //               ...e,
  //               i: uniqid(),
  //             };
  //           }),
  //         });
  //       },
  //     });
  //   }
  //     this.resetGraphics();

  //     if (callback) {
  //       callback();
  //     }
  //   };

  resetFields = () => {
    this.props.onChange([]);
    this.setState({ selectedLands: [], selectedLandsT: [] });
  };

  // onPlaneChange = (f, callback) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   clearGraphicFromLayer(this.map, "SelectGraphicLayer");

  //   var planSpatialId = this.state.PlanNum.filter((m) => m.i == f)?.[0]?.attributes
  //     ?.PLAN_SPATIAL_ID;
  //     if (!callback) {
  //   this.setState({
  //     plan_no: this.state.PlanNum.filter((m) => m.i == f)?.[0]?.attributes?.PLAN_NO,
  //     planeval: f,
  //     subTypeval: undefined,
  //     subNameval: undefined,
  //     blockval: undefined,
  //     parcelval: undefined,
  //     blockNum: [],
  //     subDivNames: [],
  //     //subDivType: [],
  //     parcelId: null,
  //     parcelNum: [],
  //     parcelData: {},
  //   });
  // }

  // if (f) {
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
  //       ["*"]
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
  // }
  //   this.resetGraphics();
  //   if (callback) {
  //     callback();
  //   }
  // };

  resetGraphics = () => {
    this.state["selectedLands"] = [];
    this.state["selectedLandsT"] = [];
    this.parcelData = {};
    this.DrawGraph();
  };
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
  //   onSubTypeChange = (e, callback) => {
  //     this.onPlaneChange(this.state.planeval);
  //     if (!callback) {
  //     this.setState({
  //       subType_name: this.state.subDivType.filter((m) => m.code == e)[0].name,
  //       subTypeval: e,
  //     });
  //   }
  //   if (e) {
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Subdivision,
  //         `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${this.planId}`,
  //         false,
  //         ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"]
  //       ),
  //       callbackResult: (res) => {
  //         this.setState({ subDivNames: res.features });
  //       },
  //     });
  //   }

  //   if (callback) {
  //     callback();
  //   }
  //     // this.onSubNameChange(this.state.subNameval);
  //     // this.DrawGraph();
  //   };

  //   onSubNameChange = (e, callback) => {
  //     clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  // if (!callback) {
  //     this.setState({
  //       subName_name: this.state.subDivNames.filter(
  //         (m) => m.attributes.SUBDIVISION_SPATIAL_ID == e
  //       )?.[0]?.attributes?.SUBDIVISION_DESCRIPTION,
  //       subNameval: e,
  //       blockval: undefined,
  //       parcelval: undefined,
  //       parcelNum: [],
  //       parcelId: null,
  //     });
  //   }

  //   if (e){
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Subdivision,
  //         `SUBDIVISION_SPATIAL_ID=${e}`,
  //         true,
  //         ["SUBDIVISION_SPATIAL_ID"]
  //       ),
  //       callbackResult: (res) => {
  //         this.pol = res.features[0];
  //         highlightFeature(res.features[0], this.map, {
  //           layerName: "SelectGraphicLayer",
  //           isZoom: true,
  //           isHiglightSymbol: true,
  //           highlighColor: [0, 0, 0, 0.25],
  //         });
  //       },
  //     });
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Landbase_Parcel,
  //         `SUBDIVISION_SPATIAL_ID=${e}`,
  //         false,
  //         ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
  //       ),
  //       callbackResult: (res) => {
  //         this.setState({
  //           parcelSearch: null,
  //           parcelNum: res.features.map((e, i) => {
  //             return {
  //               ...e,
  //               i,
  //             };
  //           }),
  //         });
  //       },
  //     });
  //   }
  //     this.resetGraphics();
  //     if (callback) {
  //       callback();
  //     }
  //   };

  //   onBlockChange = (e,callback) => {
  //     clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //     if (!callback) {
  //     this.setState({
  //       block_no: this.state.blockNum.filter(
  //         (m) => m.attributes.BLOCK_SPATIAL_ID == e
  //       )?.[0]?.attributes?.BLOCK_NO,
  //       blockval: e,
  //       parcelval: undefined,
  //       parcelId: null,
  //       parcelNum: [],
  //     });
  //   }

  //   if (e) {

  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Survey_Block,
  //         `BLOCK_SPATIAL_ID=${e}`,
  //         true,
  //         ["BLOCK_SPATIAL_ID"]
  //       ),
  //       callbackResult: (res) => {
  //         this.pol = res.features[0];
  //         highlightFeature(res.features[0], this.map, {
  //           layerName: "SelectGraphicLayer",
  //           isZoom: true,
  //           isHiglightSymbol: true,
  //           highlighColor: [0, 0, 0, 0.25],
  //         });
  //       },
  //     });

  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Landbase_Parcel,
  //         `BLOCK_SPATIAL_ID=${e}`,
  //         false,
  //         ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
  //       ),
  //       callbackResult: (res) => {
  //         this.setState({
  //           parcelSearch: null,
  //           parcelNum: res.features.map((e, i) => {
  //             return {
  //               ...e,
  //               i,
  //             };
  //           }),
  //         });
  //       },
  //     });
  //   }
  //     this.resetGraphics();
  //     if (callback) {
  //       callback();
  //     }
  //   };

  //   onLandParcelChange = (f,callback) => {
  //     if (!this.state.selectedLands.length) {
  //       var e = this.state.parcelNum.filter((m) => m.i === f)?.[0]?.attributes
  //         ?.PARCEL_SPATIAL_ID;
  //         if (!callback) {
  //       this.setState({ parcelId: e, parcelval: f });
  //         }
  //       this.RolBackPol = this.pol;
  //       this.RolBackParcelNum = this.state.parcelNum;
  // if (f) {
  //       queryTask({
  //         ...querySetting(
  //           this.LayerID.Landbase_Parcel,
  //           `PARCEL_SPATIAL_ID='${e}'`,
  //           true,
  //           ["PARCEL_SPATIAL_ID"]
  //         ),
  //         callbackResult: (res) => {
  //           this.selectedLandsT = [];
  //           highlightFeature(res.features[0], this.map, {
  //             layerName: "SelectGraphicLayer",
  //             strokeColor: [0, 0, 0],
  //             highlightWidth: 3,
  //             isHighlighPolygonBorder: true,
  //             isZoom: true,
  //             zoomFactor: 25,
  //           });
  //         },
  //       });
  //     }
  //     } else {
  //       // var g = this.state.parcelNum.filter((m) => m.i == f)[0];
  //       // this.setState({ parcelId: g.attributes.PARCEL_SPATIAL_ID });
  //       // highlightFeature(g, this.map, {
  //       //   layerName: "SelectGraphicLayer",
  //       //   strokeColor: [0, 0, 0],
  //       //   isHighlighPolygonBorder: true,
  //       //   highlightWidth: 3,
  //       // });
  //       // this.setState({ parcelval: f });

  //       var prevParcelId = this.state.parcelId;
  //       var g = this.state.parcelNum.filter((m) => m.i == f)[0];
  //       this.state["parcelId"] = g.attributes.PARCEL_SPATIAL_ID;
  //       this.LandHoverOff(
  //         this.map
  //           .getLayer("SelectGraphicLayer")
  //           .graphics.find(
  //             (prevGraphic) =>
  //               prevGraphic.attributes.PARCEL_SPATIAL_ID == prevParcelId
  //           )
  //       );

  //       this.setState({ parcelval: f });
  //     }
  //     if (callback) {
  //       callback();
  //     }
  //   };

  addParcelToSelect = (feature) => {
    return new Promise((resolve, reject) => {
      // if (this.state.selectedLands && this.state.selectedLands.length > 0) {
      //   this.setState({
      //     parcelId:
      //       this.state.selectedLands[this.state.selectedLands.length - 1].id,
      //   });

      intersectQueryTask({
        outFields: [
          "OBJECTID",
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
      clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      //this.onSubNameChange(this.state.subNameval);
      this.setToStore(null);
    } else {
      this.parcelDis = selectDis(this.selectedLandsT);
      console.log(this.parcelDis);
      this.setAdjacentToStore(this.parcelDis);
      this.setState({ parcelNum: this.parcelDis });

      clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
      //clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
      //drawLength(this.map, this.state.selectedLands);
      // highlightFeature(
      //   this.parcelDis.filter(
      //     (element) =>
      //       !this.state.selectedLands.find(
      //         (i) => i.id === element.attributes.PARCEL_SPATIAL_ID
      //       )
      //   ),
      //   this.map,
      //   {
      //     layerName: "SelectLandsGraphicLayer",
      //     noclear: false,
      //     isZoom: false,
      //     isHiglightSymbol: true,
      //     highlighColor: [0, 255, 0, 0.5],
      //     zoomFactor: 25,
      //   }
      // );

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
            "PacrelNoGraphicLayer",
            20,
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
          layerName: "SelectGraphicLayer",
          noclear: true,
          attr: { isParcel: true },
          isZoom: true,
          isHighlighPolygonBorder: true,
          zoomFactor: 25,
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
            "PacrelNoGraphicLayer",
            20,
            [0, 0, 0]
          );
        });
    }
  };

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, "g"), replace);
  }

  mapLoaded = (map) => {
    this.map = map;
    this.props.setMap(map);
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
        zoomFactor: 25,
      });

      setTimeout(() => {
        this.props.input.value.parcels.forEach((f) => {
          f.geometry = new esri.geometry.Polygon(f.geometry);
          addParcelNo(
            f.geometry.getExtent().getCenter(),
            this.map,
            f.attributes.PARCEL_PLAN_NO + "",
            "PacrelNoGraphicLayer",
            20,
            [0, 0, 0]
          );
        });

        //drawLength(this.map, this.props.input.value.parcels);
        if (this.props.input.value?.temp?.parcelDis?.length) {
          // highlightFeature(
          //   this.props.input.value?.temp?.parcelDis.filter(
          //     (element) =>
          //       !this.props.input.value.parcels.find(
          //         (i) =>
          //           i.attributes.PARCEL_SPATIAL_ID ===
          //           element.attributes.PARCEL_SPATIAL_ID
          //       )
          //   ),
          //   this.map,
          //   {
          //     layerName: "SelectLandsGraphicLayer",
          //     noclear: false,
          //     isZoom: false,
          //     isHiglightSymbol: true,
          //     highlighColor: [0, 255, 0, 0.5],
          //     zoomFactor: 25,
          //   }
          // );

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
                "PacrelNoGraphicLayer",
                20,
                [0, 0, 0]
              );
            });

          console.log(this.props.input.value?.temp?.parcelDis);
          this.setState({
            parcelSearch: null,
            parcelNum: this.props.input.value?.temp?.parcelDis,
          });
        } else if (this.props.input?.value?.parcels?.length) {
          checkParcelAdjacents(this.props.input?.value?.parcels);
        }
      }, 500);

      const {
        input: { value },
      } = this.props;
      this.state.landsData = {
        ...value,
        conditions: this.state.conditions,
        temp: {
          //map: this.map,
          mun: this.props.input.value.temp.mun,
          plan:
            this.props.mainObject?.landData?.landData?.PLAN_NO ||
            this.props.input.value.temp.plan,
          subTypeval: this.props.input.value.temp.subTypeval,
          subNameval: this.props.input.value.temp.subNameval,
          parcelDis: this.props.input.value?.temp?.parcelDis,
          blockval: this.props.input.value.temp.blockval,
          parcelval: this.props.input.value.temp.parcelval,
          subname: this.props.input.value.temp.subname,
          block_no: this.props.input.value.temp.block_no,
        },
        parcels: [...this.props.input.value.parcels],
        parcelData: { ...this.props.input.value.parcelData },
        domainLists: { ...this.state.domainLists },
        // lists: {
        //   firstParcels: [...this.state.parcelNum],
        //   subDivNames: [...this.state.subDivNames],
        //   MunicipalityNames: [...this.state.MunicipalityNames],
        //   subDivType: [...this.state.subDivType],
        //   PlanNum: [...this.state.PlanNum],
        //   blockNum: [...this.state.blockNum],
        // },
      };
      this.props.input.onChange({ ...this.state.landsData });
    }
    this.setState({ mapLoaded: true });

    // this.map.on("click", (geo) => {
    //   intersectQueryTask({
    //     outFields: [
    //       "MUNICIPALITY_NAME",
    //       "PARCEL_MAIN_LUSE",
    //       "PARCEL_AREA",
    //       "PARCEL_LAT_COORD",
    //       "PARCEL_LONG_COORD",
    //       "PLAN_NO",
    //       "PARCEL_PLAN_NO",
    //       "USING_SYMBOL",
    //       "PARCEL_SPATIAL_ID",
    //     ],
    //     geometry: geo.mapPoint,
    //     url: mapUrl + "/" + this.LayerID.Landbase_Parcel,
    //     where: "PARCEL_PLAN_NO is not null",
    //     callbackResult: (res) => {
    //       if (res.features.length > 0) {
    //         this.setState({
    //           munval: res.features[0].attributes.MUNICIPALITY_NAME,
    //         });
    //         getFeatureDomainName(
    //           res.features,
    //           this.LayerID.Landbase_Parcel
    //         ).then((r) => {
    //           this.setState({
    //             parcelSearch: null,
    //             parcelNum: res.features.map((e, i) => {
    //               return {
    //                 ...e,
    //                 i,
    //               };
    //             }),
    //           });

    //           res.features = res.features.map((e, i) => {
    //             return {
    //               ...e,
    //               i,
    //             };
    //           });

    //           this.RolBackParcelNum = res.features.map((e, i) => {
    //             return {
    //               ...e,
    //               i,
    //             };
    //           });

    //           setTimeout(() => {
    //             if (
    //               this.selectedLandsT.length == 0 ||
    //               this.selectedLands.length == 0
    //             ) {
    //               this.selectedLandsT.push(res);

    //               this.DrawGraph(true);
    //               this.onLandParcelChange(0);
    //             }
    //           }, 500);
    //         });
    //       }
    //     },
    //   });
    // });

    this.props.setCurrentMap(map);
    //this.props.setMapLayers(mapLayers);
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
      // ["PARCEL_AREA", "PARCEL_MAIN_LUSE", "PARCEL_LAT_COORD", "PARCEL_LONG_COORD", "PLAN_NO", "PARCEL_PLAN_NO", "USING_SYMBOL", "PARCEL_BLOCK_NO", "DISTRICT_NAME", "SUBDIVISION_DESCRIPTION", "SUBDIVISION_TYPE", "PARCEL_SPATIAL_ID", "MUNICIPALITY_NAME"]
      queryTask({
        ...querySetting(
          this.LayerID.Landbase_Parcel,
          `PARCEL_SPATIAL_ID =${this.state.parcelId}`,
          true,
          ["*"]
        ),
        callbackResult: (res) => {
          if (
            this.state.selectedLands &&
            this.state.selectedLands.length == 0
          ) {
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
                  this.addParcelToSelect(r[0]).then(
                    (res) => {
                      this.setToStore(r);
                      this.setState({
                        parcelId: null,
                      });
                      this.selectedLandsT.push(res);
                      this.DrawGraph();
                    },
                    () => {
                      this.state.selectedLands.pop();
                      this.setToStore();
                    }
                  );
                });
              },
            });
          } else {
            getFeatureDomainName(
              res.features,
              this.LayerID.Landbase_Parcel
            ).then((r) => {
              this.addParcelToSelect(r[0]).then(
                (res) => {
                  this.setToStore(r);
                  this.setState({
                    parcelId: null,
                  });
                  this.selectedLandsT.push(res);
                  this.DrawGraph();
                },
                () => {
                  this.state.selectedLands.pop();
                  this.setToStore();
                }
              );
            });
          }
        },
      });
    }
  };

  setToStore = (r) => {
    const {
      input: { value },
    } = this.props;
    this.state.landsData = {
      ...value,
      mapGraphics: [],
      conditions: this.state.conditions,
      parcelData: { ...this.state.parcelData },
      temp: {
        //map: this.map,
        mun: this.state.munval,
        plan: this.state.planeval,
        subTypeval: this.state.subTypeval,
        subNameval: this.state.subNameval,
        subname: this.state.subName_name,
        parcelDis: this.parcelDis || this.RolBackParcelNum,
        block_no: this.state.block_no,
        blockval: this.state.blockval,
        parcelval: this.state.parcelval,
      },
      domainLists: { ...this.state.domainLists },
      // parcels: [
      //   ...this.state.selectedLands,
      //   {
      //     attributes: r[0].attributes,
      //     id: this.state.parcelId,
      //     geometry: JSON.parse(JSON.stringify(r[0].geometry)),
      //   },
      // ],
      // lists: {
      //   subdivisions: [...this.state.subDivNames],
      //   MunicipalityNames: [...this.state.MunicipalityNames],
      //   subDivType: [...this.state.subDivType],
      //   PlanNum: [...this.state.PlanNum],
      //   blockNum: [...this.state.blockNum],
      // },
    };

    //  if (r) {
    //       r[0].attributes.PARCEL_AREA = "";
    //       this.state.selectedLands.push({
    //         geometry: r[0].geometry,
    //         attributes: r[0].attributes,
    //         id: this.state.parcelId,
    //       });
    //     }

    if (r) {
      r[0].attributes.PARCEL_AREA = "";
      this.state.selectedLands.push({
        geometry: r[0].geometry,
        attributes: r[0].attributes,
        id: this.state.parcelId,
      });

      map_object(this.state.selectedLands);
    }

    this.state.landsData["parcels"] = [...this.state.selectedLands];
    this.props.input.onChange({ ...this.state.landsData });
  };

  setAdjacentToStore = (r) => {
    let store = this.props.input.value;
    store.temp.parcelDis = r;
    this.props.input.onChange(store);
  };

  // LandHoverOn = (f) => {
  //   if (this.state.selectedLands.length) {
  //     clearGraphicFromLayer(this.map, "SelectGraphicLayer");
  //     var parcel = this.state.parcelNum.filter((m) => m.i == f.key)[0];
  //     highlightFeature(parcel, this.map, {
  //       layerName: "SelectGraphicLayer",
  //       strokeColor: [0, 0, 0],
  //       isHighlighPolygonBorder: true,
  //       highlightWidth: 3,
  //     });
  //   }
  // };

  // LandHoverOff = (f) => {
  //   if (this.state.selectedLands.length) {
  //     clearGraphicFromLayer(this.map, "SelectGraphicLayer");
  //   }
  // };

  LandHoverOn = (f) => {
    if (this.state.selectedLands.length) {
      var fitleredGraphics = this.map
        .getLayer("SelectGraphicLayer")
        .graphics.filter((graphic) => {
          return graphic?.attributes?.OBJECTID != f?.attributes?.OBJECTID;
        });

      fitleredGraphics = [
        ...new Map(
          fitleredGraphics.map((item) => [
            item?.["attributes"]?.["OBJECTID"],
            item,
          ])
        ).values(),
      ];

      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      fitleredGraphics.forEach((graphic) => {
        this.map.getLayer("SelectGraphicLayer").add(graphic);
      });

      highlightFeature([f], this.map, {
        layerName: "SelectGraphicLayer",
        noclear: true,
        isZoom: false,
        isHiglightSymbol: false,
        attr: true,
      });
    }
  };

  LandHoverOff = (f) => {
    if (
      f &&
      this.state.selectedLands?.length &&
      f?.attributes?.PARCEL_SPATIAL_ID != this.state?.parcelId
    ) {
      highlightFeature([f], this.map, {
        layerName: "SelectGraphicLayer",
        noclear: true,
        isZoom: false,
        isHiglightSymbol: true,
        highlighColor: [0, 255, 0, 0.5],
        attr: true,
      });
    }
  };

  // remove = (item) => {
  //   this.state.parcelData = {};
  //   this.state.selectedLands.pop(item);
  //   const values = slice(this.props.input.value.parcels, 0, -1);
  //   this.props.input.onChange([...values]);
  //   if (this.state.selectedLandsT) {
  //     this.state.selectedLandsT.pop(item);
  //   }
  //   this.DrawGraph();
  //   this.UpdateSubmissionDataObject();
  // };

  remove = (item) => {
    let { mainObject } = this.props;
    if (mainObject && mainObject.waseka) {
      delete mainObject.waseka;
    }
    this.state.parcelData = {};
    this.state.selectedLands.pop(item);
    //this.props.input.value.parcels = slice(this.props.input.value.parcels, 0, -1)
    // this.props.input.onChange([...values])
    if (this.state.selectedLandsT) {
      this.state.selectedLandsT.pop(item);
    }
    this.DrawGraph();
    this.UpdateSubmissionDataObject();
  };

  saveEdit(id, name, i) {
    let findParcel = this.props.input.value.parcels.find((p) => {
      return [p?.id, p?.attributes?.PARCEL_SPATIAL_ID].indexOf(id) != -1;
    });
    findParcel.attributes[name] =
      this["edit_" + name + i] || findParcel.attributes[name];
    let selectLand = this.state.selectedLands.find((p) => {
      return [p?.id, p?.attributes?.PARCEL_SPATIAL_ID].indexOf(id) != -1;
    });
    selectLand.attributes[name] =
      this["edit_" + name + i] || selectLand.attributes[name];
    //
    this.setState(
      {
        [name + "_isEdit_" + i]: false,
        selectedLands: [...this.state.selectedLands],
      },
      () => {
        this.UpdateSubmissionDataObject();
      }
    );
  }

  openPopup = (scope) => {
    var fields = this.parcelDataFields;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...scope.state.parcelData },
          ok(values) {
            scope.state["parcelData"] = values;
            scope.UpdateSubmissionDataObject();
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  myChangeHandler = (name, i, e, event) => {
    //
    if (event.target.value && +event.target.value > 0) {
      this["edit_" + name + i] = event.target.value;
      e.attributes[name] = event.target.value;
      //e.attributes["PARCEL_AREA"] = event.target.value;
    } else {
      this["edit_" + name + i] = "";
      e.attributes[name] = "";
    }

    this.setState({ [name + "_isEdit_" + i]: true });
  };

  showEditBtn = (name, value) => {
    if (name == "USING_SYMBOL") {
      return value == null;
    } else {
      return ["PARCEL_AREA"].indexOf(name) > -1;
    }
  };

  enableEdit = (name, i) => {
    this.setState({ [name + "_isEdit_" + i]: true });
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
        <div className={!fullMapWidth ? "content-section implementation" : ""}>
          <div>
            {mapLoaded && (
              <div
                style={{
                  boxShadow: "1px 1px 3px black",
                  paddingLeft: "15px",
                  paddingTop: "30px",
                  height: "487px",
                }}
              >
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
                          return (
                            i && i.indexOf(input.trim().toLowerCase()) >= 0
                          );
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
                        option.props.children?.indexOf(
                          convertToArabic(input)
                        ) != -1
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
                          {convertToArabic(d.attributes.PLAN_NO)}
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
                        option.props.children?.indexOf(
                          convertToArabic(input)
                        ) != -1
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
                      <Option
                        key={i}
                        value={e.attributes.SUBDIVISION_SPATIAL_ID}
                      >
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
                        {convertToArabic(e.attributes.BLOCK_NO)}
                      </Option>
                    ))}
                </Select>
                {/* <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                onChange={this.onLandParcelChange}
                showSearch
                disabled={parcelNum && !parcelNum.length}
                onSearch={(e) => {
                  this.setState({ parcelSearch: e });
                }}
                filterOption={(input, option) => {
                  if (option.props.children) {
                    return (
                      option.props.children
                        .toLowerCase()
                        .indexOf(convertToArabic(input?.toLowerCase() || "")) != -1
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
                          {convertToArabic(e.attributes.PARCEL_PLAN_NO)}
                        </Option>
                      );
                    })}
              </Select> */}
                <Select
                  // onBlur={() => {
                  //   clearGraphicFromLayer(this.map, "SelectGraphicLayer");
                  // }}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  autoFocus
                  onFocus={() => {
                    //clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
                    if (!this.state["parcelId"]) {
                      highlightFeature(
                        parcelNum.filter((e, i) => {
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
                        }),
                        //.slice(0, 100),
                        this.map,
                        {
                          layerName: "SelectGraphicLayer",
                          noclear: false,
                          isZoom: false,
                          isHiglightSymbol: true,
                          highlighColor: [0, 255, 0, 0.5],
                          attr: true,
                        }
                      );
                    }
                  }}
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
                        option.props.children?.indexOf(
                          convertToArabic(input)
                        ) != -1
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
                      .sort((a, b) =>
                        a.attributes.PARCEL_PLAN_NO >
                        b.attributes.PARCEL_PLAN_NO
                          ? 1
                          : -1
                      )
                      .map((e, i) => {
                        return (
                          <Option
                            onMouseEnter={this.LandHoverOn.bind(this, e)}
                            onMouseLeave={this.LandHoverOff.bind(this, e)}
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
                  disabled={!this.state.parcelId}
                  onClick={this.OnParcelSelect}
                >
                  إضافة الأرض
                </Button>
              </div>
            )}
          </div>
          <div>
            <div>
              <MapBtnsComponent {...this.props}></MapBtnsComponent>
            </div>
            <div>
              <MapComponent
                mapload={this.mapLoaded.bind(this)}
                {...this.props}
              ></MapComponent>
            </div>
          </div>
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
                      {this.parcel_fields_headers.map((field_header, k) => {
                        return <th>{field_header}</th>;
                      })}
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
                                  {field.editable ? (
                                    !this.state[field.name + "_isEdit_" + i] ? (
                                      <span>
                                        <span>
                                          {localizeNumber(
                                            e.attributes[field.name] || ""
                                          )}
                                        </span>
                                        {this.showEditBtn(
                                          field.name,
                                          e.attributes[field.name]
                                        ) && (
                                          <span>
                                            <button
                                              className="btn"
                                              style={{
                                                marginRight: e.attributes[
                                                  field.name
                                                ]
                                                  ? "20px"
                                                  : "0px",
                                              }}
                                              onClick={this.enableEdit.bind(
                                                this,
                                                field.name,
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
                                          type="number"
                                          step="any"
                                          value={e.attributes[field.name]}
                                          onChange={this.myChangeHandler.bind(
                                            this,
                                            field.name,
                                            i,
                                            e
                                          )}
                                        />
                                        <button
                                          className="btn"
                                          style={{ marginRight: "20px" }}
                                          onClick={this.saveEdit.bind(
                                            this,
                                            e.attributes.PARCEL_SPATIAL_ID,
                                            field.name,
                                            i
                                          )}
                                        >
                                          <i className="fa fa-floppy-o"></i>
                                        </button>
                                      </span>
                                    )
                                  ) : (
                                    <span>
                                      <span>
                                        {localizeNumber(
                                          e.attributes[field.name] || ""
                                        )}
                                      </span>
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}

                          {i === selectedLands.length - 1 ? (
                            <td>
                              <button
                                className="btn follow"
                                style={{ margin: "0px 5px" }}
                                onClick={() => {
                                  this.openPopup(this);
                                }}
                              >
                                حدود و أبعاد الأرض
                              </button>
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
  appMapDispatchToProps
)(krokiIdentifyComponnent);
