import React, { Component } from "react";
import { esriRequest } from "../common/esri_request";
import {
  queryTask,
  getInfo,
  highlightFeature,
  clearGraphicFromLayer,
  getFeatureDomainName,
  intersectQueryTask,
  project,
  addParcelNo,
  convertToEnglish,
  localizeNumber,
  convertToArabic,
  resetMapData,
} from "../common/common_func";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
import { LoadModules } from "../common/esri_loader";
import { mapUrl } from "../mapviewer/config/map";
import { Select, Button, Form, message } from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import MapBtnsComponent from "../MapBtnsComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
import { connect } from "react-redux";
import { querySetting, selectDis } from "./Helpers";
var uniqid = require("uniqid");
import { StickyContainer, Sticky } from "react-sticky";
import { slice, isEqual } from "lodash";
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
export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "lands"),
    ...mapDispatchToProps1(dispatch),
  };
};

class IdentifyComponnentCoord extends Component {
  constructor(props) {
    super(props);
    this.PlanNum = [];
    this.cateogry = null;
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
    ];
    this.parcelDataFields = {};
    this.parcelDataFields["north_length"] = {
      label: "طول الحد الشمالي (م)",
      placeholder: "من فضلك ادخل طول الحد الشمالي (م)",
      field: "inputNumber",
      name: "north_length",
      required: true,
    };
    this.parcelDataFields["north_desc"] = {
      label: "وصف الحد الشمالي",
      placeholder: "من فضلك ادخل وصف الحد الشمالي",
      type: "text",
      name: "north_desc",
      maxLength: 200,
      required: true,
    };
    this.parcelDataFields["south_length"] = {
      label: "طول الحد الجنوبي (م)",
      placeholder: "من فضلك ادخل طول الحد الجنوبي (م)",
      field: "inputNumber",
      name: "south_length",
      required: true,
    };
    (this.parcelDataFields["south_desc"] = {
      label: "وصف الحد الجنوبي",
      placeholder: "من فضلك ادخل وصف الحد الجنوبي",
      type: "text",
      name: "south_desc",
      maxLength: 200,
      required: true,
    }),
      (this.parcelDataFields["east_length"] = {
        label: "طول الحد الشرقي (م)",
        placeholder: "من فضلك ادخل طول الحد الشرقي (م)",
        field: "inputNumber",
        name: "east_length",
        required: true,
      });
    this.parcelDataFields["east_desc"] = {
      label: "وصف الحد الشرقي",
      placeholder: "من فضلك ادخل وصف الحد الشرقي",
      type: "text",
      name: "east_desc",
      maxLength: 200,
      required: true,
    };
    this.parcelDataFields["west_length"] = {
      label: "طول الحد الغربي (م)",
      placeholder: "من فضلك ادخل طول الحد الغربي (م)",
      field: "inputNumber",
      name: "west_length",
      required: true,
    };
    this.parcelDataFields["west_desc"] = {
      label: "وصف الحد الغربي",
      placeholder: "من فضلك ادخل وصف الحد الغربي",
      type: "text",
      name: "west_desc",
      maxLength: 200,
      required: true,
    };
    this.polygonPoints = [];

    this.state = {
      mapLoaded: false,
      radioValue: 1,
      munval: props.input.value?.temp?.mun || undefined,
      planeval: props.input.value?.temp?.plan || undefined,
      subTypeval: props.input.value?.temp?.subtype || undefined,
      subNameval: props.input.value?.temp?.subname || undefined,
      blockval: props.input.value?.temp?.block || undefined,
      selectedLands: props.input.value.parcels || [],
      parcelData: props.input.value.parcelData || {},
      parcelval: props.input.value?.temp?.parcel || undefined,
      blockNum: [],
      conditions: props.input.value.conditions || undefined,
      coordinateParcel: props.input.value?.temp?.coordinateParcel,
      planSersh: null,
      subDivNames: [],
      subDivType: [],
      parcelNum: props.input.value?.temp?.parcelNum || [],
      parcelNumS: [],
      MunicipalityNames: [],
      PlanNum: [],
      parcelId: null,
      mapExtend: null,
      parcelSearch: null,
      poly: null,
      polygonPoints: [],
      x: "",
      y: "",
      selectedLands: props.input.value?.parcels || [],
    };
  }
  LayerID = [];

  handleDelete(index) {
    this.polygonPoints.splice(index, 1);
    this.setState({ polygonPoints: this.polygonPoints });
    this.setState({ state: this.state });
  }

  componentDidMount() {
    getInfo().then((res) => {
      //
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
      // esriRequest(mapUrl + "/" + this.LayerID.Municipality_Boundary).then(
      //   (response) => {
      //     this.setState({
      //       MunicipalityNames:
      //         response.types[0].domains.MUNICIPALITY_NAME.codedValues,
      //     });
      //   }
      // );
    });
  }

  componentDidUpdate() {
    const {
      input,
      mainObject,
      currentModule: { id },
    } = this.props;
    if (input.value.isReset) {
      input.value.isReset = false;
      this.resetFields();
      this.map.enableMapNavigation();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("coords", nextProps);
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });

    if (this.state.radioValue != values?.landData?.ParcelChooseType)
      this.setState({ radioValue: values?.landData?.ParcelChooseType });

    return !isEqual(
      { state: this.state, props: this.props },
      { props: nextProps, state: nextState }
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
            scope.setToStore();
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  // onMunChange = (e) => {
  //   //
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   this.setState({
  //     munval: e,
  //     requiredMun: true,
  //     planeval: undefined,
  //     subTypeval: undefined,
  //     subNameval: undefined,
  //     blockval: undefined,
  //     parcelval: undefined,
  //     selectedLands: [],
  //     parcelData: {},
  //     selectedLandsT: [],
  //     PlanNum: [],
  //     blockNum: [],
  //     subDivNames: [],
  //     subDivType: [],
  //     parcelId: null,
  //     parcelNum: [],
  //   });
  //   this.planId = null;

  //   axios
  //     .get(
  //       window.workFlowUrl +
  //         "/utilityType/" +
  //         this.props.mainObject.serviceSubmissionType.submission
  //           .utilitytype_id +
  //         "/utilityClass?municipalityCode=" +
  //         e
  //     )
  //     .then((response) => {
  //       this.cateogry = response.data;
  //     });

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
    resetMapData(this.map);
    onMunChange(this, undefined);
    this.props.input.onChange({});
    this.setState({
      selectedLands: [],
      selectedLandsT: [],
      parcelData: {},
      polygonPoints: [],
      x: "",
      y: "",
      parcel_area: "",
      parcel_desc: "",
      coordinateParcel: null,
      conditions: [],
    });
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
  //       ["PARCEL_MAIN_LUSE", "PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
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
  //       ["PARCEL_MAIN_LUSE", "PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
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
          "PARCEL_MAIN_LUSE",
          "PARCEL_AREA",
          "PARCEL_LAT_COORD",
          "PARCEL_LONG_COORD",
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

  DrawGraph = (isclick) => {
    if (!this.state.selectedLands.length && !isclick) {
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

      /*this.parcelDis.filter(element => !this.state.selectedLands.find(i => i.id === element.attributes.PARCEL_SPATIAL_ID)).forEach((f)=>{

        addParcelNo( f.geometry.getExtent().getCenter() , this.map ,f.attributes.PARCEL_PLAN_NO+'', "ParcelPlanNoGraphicLayer",14,[0,0,0])

      })*/

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

      /*this.parcelDis.filter(element => this.state.selectedLands.find(i => i.id === element.attributes.PARCEL_SPATIAL_ID)).forEach((f)=>{

        addParcelNo( f.geometry.getExtent().getCenter() , this.map ,f.attributes.PARCEL_PLAN_NO+'', "ParcelPlanNoGraphicLayer",14,[0,0,0])

      })*/
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
        layerName: "SelectLandsGraphicLayer",
        noclear: true,
        isZoom: true,
        attr: { isParcel: true },
        isHighlighPolygonBorder: true,
        zoomFactor: 50,
      });

      const {
        input: { value },
      } = this.props;
      this.props.input.onChange({
        ...value,
        conditions: this.state.conditions,
        temp: {
          map: this.map,
          mun: this.props.input.value?.temp?.mun,
          plan: this.props.input.value?.temp?.plan,
          subtype: this.props.input.value?.temp?.subtype,
          subname: this.props.input.value?.temp?.subname,
          block: this.props.input.value?.temp?.block,
          parcel: this.props.input.value?.temp?.parcel,
          coordinateParcel: this.props.input.value?.coordinateParcel,
          parcelNum: this.props.input.value?.temp?.parcelNum,
        },
        parcels: [...this.props.input.value?.parcels],
        parcelData: { ...this.props.input.value?.parcelData },
      });
    }
    this.setState({ mapLoaded: true });

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
            axios
              .get(
                window.workFlowUrl +
                  "/utilityType/" +
                  this.props.mainObject.serviceSubmissionType.submission
                    .utilitytype_id +
                  "/utilityClass?municipalityCode=" +
                  res.features[0].attributes.MUNICIPALITY_NAME
              )
              .then((response) => {
                this.cateogry = response.data;
              });
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

              if (
                this.selectedLandsT.length == 0 ||
                this.selectedLands.length == 0
              ) {
                this.selectedLandsT.push(res);
                this.DrawGraph(true);
                this.onLandParcelChange(0);
              }
            });
          }
        },
      });
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
        ].indexOf(name) > -1
      );
    }
  }

  saveEdit(id, name, i) {
    let findParcel = this.props.input.value.parcels.find((p) => {
      return [p?.id, p?.attributes?.PARCEL_SPATIAL_ID].indexOf(id) != -1;
    });
    if (this["edit_" + name]) {
      findParcel.attributes[name] = this["edit_" + name];
      let selectLand = this.state.selectedLands.find((p) => {
        return [p?.id, p?.attributes?.PARCEL_SPATIAL_ID].indexOf(id) != -1;
      });

      selectLand.attributes[name] = this["edit_" + name];
      this.props.input.onChange({
        ...this.props.input.value,
        parcels: [...this.props.input.value.parcels],
        parcelData: { ...this.props.input.value.parcelData },
      });
      this.setState({
        [name + "_isEdit_" + i]: false,
        selectedLands: [...this.state.selectedLands],
        parcelData: { ...this.state.parcelData },
      });
    } else {
      this.setState({
        [name + "_isEdit_" + i]: false,
        parcelData: { ...this.state.parcelData },
      });
    }
  }

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
            "PARCEL_MAIN_LUSE",
            "SUBDIVISION_TYPE",
            "MUNICIPALITY_NAME",
            "PARCEL_SPATIAL_ID",
          ]
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
                  this.setToStore(r);
                  this.addParcelToSelect();
                });
              },
            });
          } else {
            getFeatureDomainName(
              res.features,
              this.LayerID.Landbase_Parcel
            ).then((r) => {
              this.setToStore(r);
              this.addParcelToSelect();
              this.setState({ state: this.state });
            });
          }
        },
      });
    }
  };

  setToStore = (r) => {
    console.log(this.state.coordinateParcel);
    let data;
    if (r) {
      r[0].attributes.category = this.cateogry;
      const {
        input: { value },
      } = this.props;
      data = {
        ...value,
        mapGraphics: [],
        conditions: this.state.conditions,
        temp: {
          map: this.map,
          mun: this.state.munval,
          plan: this.state.plan_no,
          subtype: this.state.subType_name,
          subname: this.state.subName_name,
          block: this.state.block_no,
          parcel: this.state.parcelval,
          coordinateParcel: this.state.coordinateParcel,
          parcelNum: this.parcelDis,
        },
        parcels: [
          ...this.state.selectedLands,
          {
            attributes: r[0].attributes,
            id: this.state.parcelId,
            geometry: JSON.parse(JSON.stringify(r[0].geometry)),
          },
        ],
        parcelData: { ...this.state.parcelData },
      };

      if (this.state.radioValue == 1)
        this.state.selectedLands.push({
          geometry: r[0].geometry,
          attributes: r[0].attributes,
          id: this.state.parcelId,
        });
    } else {
      const {
        input: { value },
      } = this.props;
      data = {
        ...value,
        conditions: this.state.conditions,
        temp: {
          map: this.map,
          mun: this.state.munval,
          plan: this.state.plan_no,
          subtype: this.state.subType_name,
          subname: this.state.subName_name,
          block: this.state.block_no,
          parcel: this.state.parcelval,
          coordinateParcel: this.state.coordinateParcel,
          parcelNum: this.parcelDis,
        },
        parcels: [...this.state.selectedLands],
        parcelData: { ...this.state.parcelData },
      };
    }

    this.props.input.onChange({ ...data });
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
    if (this.state.selectedLands == 0) {
      this.state.parcelData = {};
    }
    this.setToStore();
    if (this.state.selectedLandsT) {
      this.state.selectedLandsT.pop(item);
    }

    this.DrawGraph();

    this.setState({
      selectedLands: [...this.state.selectedLands],
      parcelData: this.state.parcelData,
    });
  };

  addPoint() {
    LoadModules(["esri/geometry/Point"]).then(([Point]) => {
      let point = new Point({
        x: parseFloat(this.state.x),
        y: parseFloat(this.state.y),
        spatialReference: { wkid: 4326 },
      });

      document.getElementById("coorForm").reset();

      this.polygonPoints = this.polygonPoints || [];
      this.polygonPoints.push(point);

      this.setState({ polygonPoints: this.polygonPoints, x: null, y: null });
    });
  }

  zoomtopoint() {
    LoadModules(["esri/geometry/Polygon", "esri/geometry/Point"]).then(
      ([Polygon, Point]) => {
        if (!this.state.munval) {
          this.setState({ requiredMun: true });
          return;
        }
        this.props.setLoading(true);
        this.polygonPoints.push(this.polygonPoints[0]);
        project(this.polygonPoints, 32639, (t) => {
          let polygon = new Polygon({
            rings: [
              t.map((polygon) => {
                return [polygon.x, polygon.y];
              }),
            ],
            spatialReference: this.map.spatialReference,
          });

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
            geometry: polygon,
            url: mapUrl + "/" + this.LayerID.Landbase_Parcel,
            callbackResult: (res) => {
              if (res.features && res.features.length == 0) {
                highlightFeature([{ geometry: polygon }], this.map, {
                  layerName: "SelectGraphicLayer",
                  isZoom: true,
                  zoomFactor: 10,
                  isHighlighPolygonBorder: true,
                  highlighColor: [0, 255, 255, 0.7],
                });

                this.setState({
                  requiredMun: false,
                  coordinateParcel: {
                    geometry: polygon,
                    attributes: {
                      MUNICIPALITY_NAME_Code: this.state.munval,
                      PARCEL_PLAN_NO: this.state.parcel_desc,
                      PARCEL_AREA: this.state.parcel_area,
                      MUNICIPALITY_NAME: this.state.MunicipalityNames?.find(
                        (x) => {
                          return x.code == this.state.munval;
                        }
                      ).name,
                    },
                  },
                });

                this.setToStore([
                  {
                    geometry: polygon,
                    attributes: {
                      MUNICIPALITY_NAME_Code: this.state.munval,
                      PARCEL_PLAN_NO: this.state.parcel_desc,
                      PARCEL_AREA: this.state.parcel_area,
                      MUNICIPALITY_NAME: this.state.MunicipalityNames?.find(
                        (x) => {
                          return x.code == this.state.munval;
                        }
                      ).name,
                    },
                  },
                ]);

                this.props.setLoading(false);
              } else {
                message.error(
                  "الأرض المختارة تتقاطع مع أرض بخارطة الأساس . يمكنك اختيار الارض بالضغط على الخريطة لاضافتها"
                );
                this.props.setLoading(false);
              }
            },
          });
        });
      }
    );
  }

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

  updateDescValue = (evt) => {
    this.setState({
      parcel_desc: evt.target.value,
    });
  };
  updateareaValue = (evt) => {
    this.setState({
      parcel_area: evt.target.value,
    });
  };

  updateYValue = (evt) => {
    this.setState({
      y: evt.target.value,
    });
  };
  updateXValue = (evt) => {
    this.setState({
      x: evt.target.value,
    });
  };

  removeCoordinateParcel() {
    this.setState({ coordinateParcel: null });
  }

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
      radioValue,
      coordinateParcel,
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
        <div className={"content-section implementation"}>
          {mapLoaded && (
            <div style={{ padding: "10px" }}>
              {radioValue == 2 ? (
                <div>
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

                  <Form
                    id="coorForm"
                    className="top1"
                    style={{ direction: "rtl", padding: "5px" }}
                  >
                    <div>
                      <label>وصف الأرض</label>
                      <input
                        className="ant-input"
                        type="text"
                        placeholder="وصف الأرض"
                        required={true}
                        value={this.state.parcel_desc}
                        onChange={this.updateDescValue}
                      />

                      <label>مساحة الأرض</label>
                      <input
                        className="ant-input"
                        type="text"
                        placeholder="مساحة الأرض"
                        required={true}
                        value={this.state.parcel_area}
                        onChange={this.updateareaValue}
                      />

                      <label>دوائر العرض</label>
                      <input
                        className="ant-input"
                        type="number"
                        placeholder="ex 26.424895"
                        required={true}
                        value={this.state.y}
                        onChange={this.updateYValue}
                      />

                      <label style={{ marginTop: "15px" }}>خط الطول</label>
                      <input
                        className="ant-input"
                        type="number"
                        placeholder="ex 50.067738"
                        required={true}
                        value={this.state.x}
                        onChange={this.updateXValue}
                      />
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridGap: "10px",
                        marginTop: "20px",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={this.addPoint.bind(this)}
                      >
                        {" "}
                        إضافة النقطة
                      </button>
                      <button
                        type="button"
                        disabled={
                          this.state.polygonPoints.length < 3 ||
                          coordinateParcel ||
                          !this.state.requiredMun
                        }
                        className="btn btn-success"
                        onClick={this.zoomtopoint.bind(this)}
                      >
                        {" "}
                        إضافة الأرض
                      </button>
                    </div>
                    {this.state.polygonPoints.length > 0 && (
                      <div style={{ marginTop: "20px" }}>
                        <table>
                          <thead>
                            <th>دوائر العرض</th>
                            <th>خطوط الطول</th>
                          </thead>
                          <tbody>
                            {this.state.polygonPoints.map((point, k) => {
                              return (
                                <tr key={k}>
                                  <td>{point.y}</td>
                                  <td>{point.x}</td>
                                  <td>
                                    <button
                                      type="button"
                                      className=" btn btn-danger "
                                      onClick={this.handleDelete.bind(this, k)}
                                    >
                                      حذف
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Form>
                </div>
              ) : (
                <div>
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
                          option.props.children
                            ?.toLowerCase()
                            ?.indexOf(convertToArabic(input)) != -1
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
                      option.props.children
                        ?.toLowerCase()
                        ?.indexOf(convertToArabic(input)) != -1
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
                      option.props.children?.indexOf(
                        convertToArabic(input || "")
                      ) != -1
                    }
                  >
                    {blockNum
                      //.slice(0, 100)
                      .map((e, i) => (
                        <Option key={i} value={e.attributes.BLOCK_SPATIAL_ID}>
                          {localizeNumber(e.attributes.BLOCK_SPATIAL_ID)}
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
                    onSearch={(e) => {
                      this.setState({ parcelSearch: e });
                      onSearch(this, e);
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
                  {this.state.selectedLands.length > 0 && (
                    <label style={{ marginTop: 10, marginBottom: 10 }}>
                      لاختيار الاراضى المجاورة. يرجى الاختيار من قائمة رقم قطعة
                      الأرض
                    </label>
                  )}
                  <Button
                    className="add-gis"
                    disabled={this.state.parcelId === null}
                    onClick={this.OnParcelSelect}
                  >
                    إضافة الأرض
                  </Button>
                </div>
              )}
            </div>
          )}
          <MapComponent
            mapload={this.mapLoaded.bind(this)}
            {...this.props}
          ></MapComponent>
        </div>
        {mapLoaded && (
          <div style={{ gridColumn: "1/3" }}>
            {coordinateParcel && radioValue == 2 && (
              <div>
                <table
                  className="table table-bordered"
                  style={{ marginTop: "1%" }}
                >
                  <thead>
                    <th>اسم البلدية</th>
                    <th>وصف الأرض</th>
                    <th>مساحة الأرض</th>
                    <th>الإجراءات</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{coordinateParcel.attributes.MUNICIPALITY_NAME}</td>
                      <td>{coordinateParcel.attributes.PARCEL_PLAN_NO}</td>
                      <td>{coordinateParcel.attributes.PARCEL_AREA}</td>
                      <td>
                        <button
                          className=" btn btn-danger "
                          onClick={this.removeCoordinateParcel.bind(this)}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {selectedLands && selectedLands.length > 0 && radioValue == 1 && (
              <div>
                <h1 className="titleSelectedParcel">الأراضي المختارة</h1>

                <table
                  className="table table-bordered"
                  style={{ marginTop: "1%" }}
                >
                  <thead>
                    <tr>
                      <th>رقم القطعه</th>
                      <th>المساحه م2</th>
                      <th>رقم البلك</th>
                      <th>الحي</th>
                      <th>نوع التقسيم</th>
                      <th>اسم التقسيم</th>
                      <th>رمز الاستخدام</th>
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
                                className="btn follow"
                                style={{ margin: "0px 5px" }}
                                onClick={() => {
                                  this.openPopup(this);
                                }}
                              >
                                حدود و أبعاد الأرض
                              </button>
                              <button
                                className="bn btn btn-danger "
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

                {false && conditions && (
                  <div>
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
export default connect(
  mapStateToProps,
  appMapDispatchToProps
)(IdentifyComponnentCoord);
