import React, { Component } from "react";
import { esriRequest, getMapInfo } from "../common/esri_request";
import {
  queryTask,
  getInfo,
  highlightFeature,
  clearGraphicFromLayer,
  getFeatureDomainName,
  intersectQueryTask,
  addParcelNo,
  convertToArabic,
  getPacrelNoAngle,
  drawLength,
  convertToEnglish,
  map_object,
  delete_null_object,
  checkParcelAdjacents,
  localizeNumber,
  uploadGISFile,
  project,
} from "../common/common_func";
import store from "app/reducers";
import { withTranslation } from "react-i18next";
import { geometryServiceUrl, investMapUrl } from "../mapviewer/config/map";
import { Select, Button, Form, message, Row, Col, Input } from "antd";

import { Tabs, Tab, Container } from "react-bootstrap";
// import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import MapBtnsComponent from "../MapBtnsComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
import { connect } from "react-redux";
import { querySetting, selectDis } from "./Helpers";
import { StickyContainer, Sticky } from "react-sticky";
import {
  faSearchPlus,
  faEdit,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

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
  reject,
} from "lodash";
import { LoadModules } from "../common/esri_loader";
import axios from "axios";
import { host } from "imports/config";
import FilterComponentInvest from "../FilterComponentInvest";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InvestMunicpality } from "../mapviewer/config";
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
const investSugges = "SITE_ACTIVITY";
export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "lands"),
    ...mapDispatchToProps1(dispatch),
  };
};

class InvestIdentifyComponnent extends Component {
  constructor(props) {
    super(props);
    this.PlanNum = [];
    this.planId = null;
    this.parcelTs = [];
    this.selectedLandsT = [];
    this.selectedLands = [];
    this.selectionMode = false;

    this.parcel_fields_headers = this.props.parcel_fields_headers || [
      "البلدية",
      "البلدية الفرعية",
      "الحي",
      "رقم المخطط",
      "رقم الأرض",
      "المساحة التقريبية (م۲)",
      "اسم التقسيم",
      "وصف التقسيم",
      "رمز الإستخدام",
      "النشاط الرئيسي",
      "النشاط المقترح",
      "الإحداثي السيني",
      "الإحداثي الصادي",
      "رابط الوصول بخرائط جوجل",
    ];
    this.parcel_fields = this.props.parcel_fields || [
      {
        name: "MUNICIPALITY_NAME",
        editable:
          ((!this.props.isView && true) || false) &&
          !this.props?.currentModule?.record?.is_returned,
        type: "select",
      },
      {
        name: "SUB_MUNICIPALITY_NAME",
        editable:
          ((!this.props.isView && true) || false) &&
          !this.props?.currentModule?.record?.is_returned,
        type: "select",
      },
      {
        name: "DISTRICT_NAME",
        editable:
          ((!this.props.isView && true) || false) &&
          !this.props?.currentModule?.record?.is_returned,
        type: "text",
      },
      {
        name: "PLAN_NO",
        editable:
          ((!this.props.isView && true) || false) &&
          !this.props?.currentModule?.record?.is_returned,
        type: "text",
      },
      { name: "PARCEL_PLAN_NO", editable: false, type: "text" },
      {
        name: "PARCEL_AREA",
        editable:
          ((!this.props.isView && true) || false) &&
          !this.props?.currentModule?.record?.is_returned,
        type: "number",
      },
      { name: "SUBDIVISION_TYPE", editable: false },
      { name: "SUBDIVISION_DESCRIPTION", editable: false },
      { name: "USING_SYMBOL", editable: false },
      {
        name: "PARCEL_MAIN_LUSE",
        editable:
          ((!this.props.isView &&
            this.props.mainObject.investType.invest_type.SelectedLayer ==
              "Landbase_Parcel") ||
            false) &&
          !this.props?.currentModule?.record?.is_returned,
        type: "select",
      },
      {
        name: investSugges,
        editable:
          (!this.props.isView && true) ||
          false ||
          this.props?.currentModule?.record?.is_returned,
        type: "select",
      },
      {
        name: "X",
        editable: false,
        type: "text",
      },
      {
        name: "Y",
        editable: false,
        type: "text",
      },
      {
        name: "googleLink",
        editable: false,
        type: "button",
      },
    ];

    this.parcelDataFields = {};

    if (
      ([22, 23].indexOf(props.currentModule.id) != -1 ||
        [1928].indexOf(props.currentModule.record.workflow_id) != -1) &&
      props.is_parcel_type
    ) {
      this.parcelDataFields["parcel_type"] = {
        label: "عبارة عن",
        placeholder: "من فضلك اخل نوع الأرض",
        type: "text",
        name: "parcel_type",
        required: true,
      };
    }
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

    map_object(props.input && props.input.value.parcels);

    this.state = {
      formValues: {},
      boundariesBtnIsVisible:
        this.props.boundariesBtnIsVisible != undefined
          ? this.props.boundariesBtnIsVisible
          : true,
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
      blockNum:
        (props.input.value.lists && props.input.value.lists.blockNum) || [],
      conditions: (props.input && props.input.value.conditions) || undefined,
      planSersh: null,
      subDivNames:
        (props.input.value.lists && props.input.value.lists.subDivNames) || [],
      subDivType:
        (props.input.value.lists && props.input.value.lists.subDivType) || [],
      parcelNum: [],
      parcelNumS: [],
      MunicipalityNames:
        (props.input.value.lists &&
          props.input.value.lists.MunicipalityNames) ||
        [],
      requestTypes: [
        { code: 1, name: "فرز", key: "" },
        { code: 2, name: "دمج", key: "" },
        { code: 3, name: "تقسيم", key: "" },
      ],
      PlanNum:
        (props.input.value.lists && props.input.value.lists.PlanNum) || [],
      parcelId: null,
      mapExtend: null,
      parcelSearch: null,
      poly: null,
      selectedRequestType:
        props?.input?.value?.selectedRequestType ||
        ([2190, 2191].indexOf(this.props?.currentModule?.record?.workflow_id) ==
          -1 &&
          1) ||
        props?.mainObject?.landData?.requestType ||
        "",
      parcelData: props.input.value.parcelData || {},
      landsData: {},
      domainLists: props.input.value.domainLists || {},
    };

    this.isloaded = true;
  }
  LayerID = [];

  handleChange = (e) => {
    this.setState({
      formValues: { ...this.state.formValues, [e.target.name]: e.target.value },
    });
  };

  CoordinateSearch = (e) => {
    e.preventDefault();
    this.onPublicUserDecimalSubmit(this.state.formValues);
  };
  degSearch = (e) => {
    e.preventDefault();
    this.onPublicUserDegreesSubmit(this.state.formValues);
  };

  showGoogleLink = (googleLink) => {
    window.open(googleLink, "_blank");
  };

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
      lists: {
        firstParcels: [...this.state.parcelNum],
        subDivNames: [...this.state.subDivNames],
        MunicipalityNames: [...this.state.MunicipalityNames],
        subDivType: [...this.state.subDivType],
        PlanNum: [...this.state.PlanNum],
        blockNum: [...this.state.blockNum],
      },
    };

    this.state.landsData["selectedRequestType"] =
      (([22, 23].indexOf(this.props.currentModule.id) != -1 ||
        [1928].indexOf(this.props?.currentModule?.record?.workflow_id) != -1) &&
        [2190, 2191].indexOf(this.props?.currentModule?.record?.workflow_id) ==
          -1 &&
        this.state.selectedRequestType) ||
      ([2190].indexOf(this.props?.currentModule?.record?.workflow_id) != -1 &&
        "فرد") ||
      ([2191].indexOf(this.props?.currentModule?.record?.workflow_id) != -1 &&
        "اصدار الكروكي (المواطن)") ||
      3;
    this.props.input.onChange({ ...this.state.landsData });
    this.setState({ parcelData: parcelData });
  };

  parcelQueryTask = (value) => {
    this.setState({
      selectedLands: [],
      selectedLandsT: [],
      parcelId: null,
      parcelNum: [],
      parcelData: {},
      selectedRequestType: value,
    });
    esriRequest(investMapUrl + "/" + this.LayerID["Landbase_Parcel"]).then(
      (response) => {
        let { domainLists } = this.state;
        domainLists.usingSymbols = [];
        domainLists.districtNames = [];
        domainLists.SUB_MUNICIPALITY_NAME_Domains = [];
        domainLists.cityNames = [];
        response.fields.forEach(function (val) {
          //;
          if (val.name === "USING_SYMBOL") {
            // list.push(val.domain);
            val.domain.codedValues.forEach(function (domain) {
              // ////
              domainLists.usingSymbols.push(domain);
            });
          } else if (val.name === "DISTRICT_NAME") {
            val.domain.codedValues.forEach(function (domain) {
              // ////
              domainLists.districtNames.push(domain);
            });
          } else if (val.name === "SUB_MUNICIPALITY_NAME") {
            val.domain.codedValues.forEach(function (domain) {
              // ////
              domainLists.SUB_MUNICIPALITY_NAME_Domains.push(domain);
            });
          } else if (val.name === "CITY_NAME") {
            val.domain.codedValues.forEach(function (domain) {
              domainLists.cityNames.push(domain);
            });
          }
        });
        this.DrawGraph();
        this.UpdateSubmissionDataObject();
      }
    );
  };

  componentDidMount() {
    if (
      this.props.mainObject.investType.invest_type.SelectedLayer ==
      "Invest_Site_Polygon"
    ) {
      this.parcel_fields_headers[7] = "النشاط المستثمر";
    } else {
      this.parcel_fields_headers[7] = "النشاط الرئيسي";
    }

    getInfo(investMapUrl).then((res) => {
      //
      this.LayerID = res;
      this.mapUrl = investMapUrl;

      getParcels(this, null, "", { returnDistinctValues: true }, [
        "MUNICIPALITY_NAME",
      ]).then((features) => {
        getFeatureDomainName(
          features,
          this.LayerID.Landbase_Parcel,
          false,
          investMapUrl
        ).then((features) => {
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
              MunicipalityNames: fcs.filter(
                (x) => InvestMunicpality.indexOf(x.code) > -1
              ),
              allParcels: features,
            },
            () => {
              this.loadLists = true;
              window.filterUrl = investMapUrl;
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
        });
      });
      // esriRequest(investMapUrl + "/" + this.LayerID.Municipality_Boundary).then(
      //   (response) => {
      //     //
      //     this.setState({
      //       MunicipalityNames:
      //         response.types[0].domains.MUNICIPALITY_NAME.codedValues.filter(
      //           (x) => InvestMunicpality.indexOf(x.code) > -1
      //         ),
      //     });
      //   }
      // );
      /*esriRequest(mapUrl + "/" + this.LayerID.Subdivision).then((response) => {
        this.setState({ subDivType: response.fields[7].domain.codedValues });
        if (this.parcel_fields[4]) {
          this.parcel_fields[4].options = response.fields[7].domain.codedValues;
        }
      });*/
      //
      esriRequest(investMapUrl + "/" + this.LayerID.Invest_Site_Polygon).then(
        (response) => {
          //
          if (this.parcel_fields.find((x) => x.name == investSugges)) {
            this.parcel_fields.find((x) => x.name == investSugges).options =
              response.fields.find(
                (x) => x.name == investSugges
              ).domain.codedValues;
          }
        }
      );
      //
      // let i = 0;
      // this.props.mainObject?.landData?.landData?.lands?.parcels.forEach(
      //   (parcel) => {
      //     i++;
      //     this.addParcelToSelect(parcel).then((res) => {
      //       this.selectedLandsT.push(res);
      //
      //       if (
      //         this.props.mainObject?.landData?.landData?.lands?.parcels.length == i
      //       ) {
      //         this.DrawGraph();
      //       }
      //     });
      //   }
      // );
    });

    if (
      this.props.mainObject &&
      this.props.mainObject.landData &&
      this.isloaded
    ) {
      this.isloaded = false;
      //this.DrawGraph();

      this.UpdateSubmissionDataObject();
    }
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
  //     // selectedLands: [],
  //     // selectedLandsT: [],
  //     PlanNum: [],
  //     blockNum: [],
  //     subDivNames: [],
  //     //subDivType: [],
  //     parcelId: null,
  //     parcelNum: [],
  //     parcelData: {},
  //   });
  //   this.planId = null;

  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Municipality_Boundary,
  //       `MUNICIPALITY_NAME='${e}'`,
  //       true,
  //       ["*"],
  //       investMapUrl
  //     ),
  //     callbackResult: (res) => {
  //       this.pol = res.features[0];
  //       highlightFeature(this.pol, this.map, {
  //         layerName: "SelectGraphicLayer",
  //         isZoom: true,
  //         isHiglightSymbol: true,
  //         highlighColor: [0, 0, 0, 0.25],
  //       });
  //       this.setState({ city_name: this.pol?.attributes?.CITY_NAME_A || "" });
  //     },
  //   });
  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Plan_Data,
  //       `MUNICIPALITY_NAME='${e}'`,
  //       false,
  //       ["PLAN_SPATIAL_ID", "PLAN_NO"],
  //       investMapUrl
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

  //   this.resetGraphics();
  // };

  resetFields = () => {
    this.props.onChange([]);
    this.setState({ selectedLands: [], selectedLandsT: [] });
  };

  // onPlaneChange = (f) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   clearGraphicFromLayer(this.map, "SelectGraphicLayer");

  //   var planSpatialId = this.state.PlanNum.filter((m) => m.i == f)[0].attributes
  //     .PLAN_SPATIAL_ID;
  //   this.setState({
  //     plan_no: this.state.PlanNum.filter((m) => m.i == f)[0].attributes.PLAN_NO,
  //     planeval: f,
  //     subTypeval: undefined,
  //     subNameval: undefined,
  //     blockval: undefined,
  //     parcelval: undefined,
  //     blockNum: [],
  //     subDivNames: [],
  //     // subDivType: [],
  //     parcelId: null,
  //     parcelNum: [],
  //     parcelData: {},
  //     // selectedLands: [],
  //     // selectedLandsT: [],
  //   });

  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Plan_Data,
  //       `PLAN_SPATIAL_ID='${planSpatialId}'`,
  //       true,
  //       ["MUNICIPALITY_NAME"],
  //       investMapUrl
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
  //       ["BLOCK_NO", "BLOCK_SPATIAL_ID"],
  //       investMapUrl
  //     ),
  //     callbackResult: (res) => {
  //       // var blocks = [];
  //       // if (res.features) {
  //       //   res.features.forEach((feature, index) => {
  //       //     if (feature.attributes.Block_NO) {
  //       //       blocks.splice(0, 0, feature);
  //       //     }
  //       //   });
  //       // }
  //       // this.setState({ blockNum: blocks });
  //       this.setState({ blockNum: res.features });
  //     },
  //   });
  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Landbase_Parcel,
  //       `PLAN_SPATIAL_ID='${planSpatialId}'`,
  //       false,
  //       ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"],
  //       investMapUrl
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

  //   this.resetGraphics();
  // };
  // onSubTypeChange = (e) => {
  //   this.onPlaneChange(this.state.planeval);
  //   this.setState({
  //     subType_name: this.state.subDivType.filter((m) => m.code == e)[0].name,
  //     subTypeval: e,
  //   });

  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Subdivision,
  //       `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${this.planId}`,
  //       false,
  //       ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"],
  //       investMapUrl
  //     ),
  //     callbackResult: (res) => {
  //       this.setState({ subDivNames: res.features });
  //     },
  //   });

  //   // this.onSubNameChange(this.state.subNameval);
  //   // this.DrawGraph();
  // };

  resetGraphics = () => {
    this.state["selectedLands"] = [];
    this.state["selectedLandsT"] = [];
    this.DrawGraph();
  };
  // onSubNameChange = (value) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   var selectedSubDivName = this.state.subDivNames.filter(
  //     (m) =>
  //       m.attributes.SUBDIVISION_SPATIAL_ID == value ||
  //       m.attributes.SUBDIVISION_DESCRIPTION == value
  //   )[0];
  //   //if (selectedSubDivName) {
  //   var e = selectedSubDivName?.attributes?.SUBDIVISION_SPATIAL_ID;

  //   this.setState({
  //     subName_name: selectedSubDivName?.attributes?.SUBDIVISION_DESCRIPTION,
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
  //       ["SUBDIVISION_SPATIAL_ID"],
  //       investMapUrl
  //     ),
  //     callbackResult: (res) => {
  //       if (res) {
  //         this.pol = res.features[0];
  //         highlightFeature(res.features[0], this.map, {
  //           layerName: "SelectGraphicLayer",
  //           isZoom: true,
  //           isHiglightSymbol: true,
  //           highlighColor: [0, 0, 0, 0.25],
  //         });
  //       }
  //     },
  //   });
  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Landbase_Parcel,
  //       `SUBDIVISION_SPATIAL_ID=${e}`,
  //       false,
  //       ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"],
  //       investMapUrl
  //     ),
  //     callbackResult: (res) => {
  //       if (res) {
  //         this.setState({
  //           parcelSearch: null,
  //           parcelNum: res.features.map((e, i) => {
  //             return {
  //               ...e,
  //               i,
  //             };
  //           }),
  //         });
  //       }
  //     },
  //   });

  //   this.resetGraphics();
  //   //}
  // };

  // onBlockChange = (e) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   this.setState({
  //     block_no: this.state.blockNum.filter(
  //       (m) => m.attributes.BLOCK_SPATIAL_ID == e
  //     )[0].attributes.BLOCK_NO,
  //     blockval: e,
  //     parcelval: undefined,
  //     parcelId: null,
  //     parcelNum: [],
  //     // selectedLands: [],
  //     // selectedLandsT: [],
  //   });

  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Survey_Block,
  //       `BLOCK_SPATIAL_ID=${e}`,
  //       true,
  //       ["BLOCK_SPATIAL_ID"],
  //       investMapUrl
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
  //       ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"],
  //       investMapUrl
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

  //   this.resetGraphics();
  // };

  // onLandParcelChange = (f) => {
  //   if (!this.state.selectedLands.length) {
  //     var e = this.state.parcelNum.filter((m) => m.i === f)[0].attributes
  //       .PARCEL_SPATIAL_ID;
  //     this.setState({ parcelId: e, parcelval: f });
  //     this.RolBackPol = this.pol;
  //     this.RolBackParcelNum = this.state.parcelNum;

  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Landbase_Parcel,
  //         `PARCEL_SPATIAL_ID='${e}'`,
  //         true,
  //         ["PARCEL_SPATIAL_ID"],
  //         investMapUrl
  //       ),
  //       callbackResult: (res) => {
  //         this.selectedLandsT = [];
  //         highlightFeature(res.features[0], this.map, {
  //           layerName: "SelectGraphicLayer",
  //           strokeColor: [0, 0, 0],
  //           highlightWidth: 3,
  //           isHighlighPolygonBorder: true,
  //           isZoom: true,
  //           zoomFactor: 10,
  //         });
  //       },
  //     });
  //   } else {
  //     // clearGraphicFromLayer(this.map, "SelectGraphicLayer");
  //     var prevParcelId = this.state.parcelId;
  //     var g = this.state.parcelNum.filter((m) => m.i == f)[0];
  //     this.state["parcelId"] = g.attributes.PARCEL_SPATIAL_ID;
  //     //this.setState({ parcelId: g.attributes.PARCEL_SPATIAL_ID });

  //     this.LandHoverOff(
  //       this.map
  //         .getLayer("SelectGraphicLayer")
  //         .graphics.find(
  //           (prevGraphic) =>
  //             prevGraphic.attributes.PARCEL_SPATIAL_ID == prevParcelId
  //         )
  //     );
  //     // if (
  //     //   this.state.selectedLands.map(
  //     //     ((land) =>
  //     //       land.attributes.OBJECTID ==
  //     //       this.state.parcelval.attributes.OBJECTID).length == 0
  //     //   )
  //     // ) {
  //     //   highlightFeature([this.state.parcelval], this.map, {
  //     //     layerName: "SelectGraphicLayer",
  //     //     noclear: true,
  //     //     isZoom: false,
  //     //     isHiglightSymbol: true,
  //     //     highlighColor: [0, 255, 0, 0.5],
  //     //     attr: true,
  //     //   });
  //     // }
  //     // // highlightFeature(g, this.map, {
  //     // //   layerName: "SelectGraphicLayer",
  //     // //   strokeColor: [0, 0, 0],
  //     // //   isHighlighPolygonBorder: true,
  //     // //   highlightWidth: 3,
  //     // // });

  //     this.setState({ parcelval: f });
  //   }
  // };

  validation = (item) => {
    const { t } = this.props;
    return new Promise((resolve, reject) => {
      axios
        .post(
          host +
            "/IsHasSubmission/" +
            item.attributes.PARCEL_SPATIAL_ID +
            "/" +
            (this.props.currentModule.record.id || 0),
          {
            PARCEL_PLAN_NO: item.attributes.PARCEL_PLAN_NO,
            PARCEL_BLOCK_NO: item.attributes.PARCEL_BLOCK_NO,
            PLAN_NO: item.attributes.PLAN_NO,
          }
        )
        .then(
          (data) => {
            if (data.status == 204 || item.attributes.IS_EDITED_Code != 1) {
              return resolve();
            } else {
              window.notifySystem(
                "warning",
                t("messages:global.PARCELSWARNING")
              );
              return reject();
            }
          },
          (err) => {
            window.notifySystem(
              "warning",
              t(
                `messages:${
                  err.msg ||
                  (err &&
                    err.response &&
                    err.response.data &&
                    err.response.data.msg)
                }`
              )
            );
            return reject();
          }
        );
      // if (item.attributes.IS_EDITED_Code != 1) {
      //   return resolve();
      // } else {
      //   window.notifySystem("warning", t("messages:PARCELSWARNING"));
      //   return reject();
      // }
    });
  };

  addParcelToSelect = (feature) => {
    return new Promise((resolve, reject) => {
      //if (this.state.selectedLands && this.state.selectedLands.length > 0) {
      intersectQueryTask({
        outFields: [
          "OBJECTID",
          "MUNICIPALITY_NAME",
          "SUB_MUNICIPALITY_NAME",
          "PARCEL_AREA",
          "PARCEL_LAT_COORD",
          "PARCEL_LONG_COORD",
          "PARCEL_MAIN_LUSE",
          "PLAN_NO",
          "PARCEL_PLAN_NO",
          "USING_SYMBOL",
          "PARCEL_SPATIAL_ID",
        ],
        distance: 20,
        geometry: feature.geometry,
        url: investMapUrl + "/" + this.LayerID.Landbase_Parcel,
        where: "PARCEL_PLAN_NO is not null",
        callbackResult: (res) => {
          getFeatureDomainName(
            res.features,
            this.LayerID.Landbase_Parcel,
            false,
            investMapUrl
          ).then((r) => {
            res.features = res.features.map((e, i) => {
              return {
                ...e,
                i: uniqid(),
              };
            });

            if (
              [20, 21].indexOf(this.props?.currentModule?.record.app_id) ==
                -1 &&
              [2191].indexOf(this.props?.currentModule?.record?.workflow_id) ==
                -1
            ) {
              this.validation(feature, this.props).then(
                () => {
                  return resolve(res);
                },
                () => {
                  return reject();
                }
              );
            } else {
              return resolve(res);
            }
          });
        },
      });
      //}
    });
  };

  DrawGraph = () => {
    if (!this.state.selectedLands.length) {
      this.map.graphics.clear();
      clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
      clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      clearGraphicFromLayer(this.map, "ZoomGraphicLayer");

      //this.onSubNameChange(this.state.subNameval);
      this.setToStore(null);
    } else {
      this.parcelDis = selectDis(this.selectedLandsT);
      console.log(this.parcelDis);
      //this.setAdjacentToStore(this.parcelDis);
      //this.setState({ parcelNum: this.parcelDis });

      clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
      clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      clearGraphicFromLayer(this.map, "ZoomGraphicLayer");
      //clearGraphicFromLayer(this.map, "editlengthGraphicLayer")
      drawLength(this.map, this.state.selectedLands);
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
      //     zoomFactor: 10,
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
          zoomFactor: 10,
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

  setSelectMapLayer = (layer) => {
    this.props.setSelectMapLayer(layer);
  };

  mapLoaded = (map) => {
    this.map = map;
    getMapInfo(investMapUrl).then((response) => {
      map.__mapInfo = response;
      this.setState({ mapLoaded: true });
    });

    this.props.setSelectMapLayer("Landbase_Parcel");

    this.props.setMap(map);
    if (
      this.props.input &&
      this.props.input.value &&
      this.props.input.value.parcels &&
      this.props.input.value.temp
    ) {
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

        drawLength(this.map, this.props.input.value.parcels);
        if (this.props.input.value?.temp?.parcelDis?.length) {
          // highlightFeature(
          //   this.props.input.value.temp.parcelDis.filter(
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
          //     zoomFactor: 10,
          //   }
          // );

          this.props.input.value.temp.parcelDis
            .filter(
              (element) =>
                !this.props.input.value.parcels.find(
                  (i) =>
                    i.attributes.PARCEL_SPATIAL_ID ===
                    element.attributes.PARCEL_SPATIAL_ID
                )
            )
            .forEach((f) => {
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

          console.log(this.props.input.value.temp.parcelDis);
          this.setState({
            parcelSearch: null,
            parcelNum: this.props.input.value.temp.parcelDis,
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
          plan: this.props.input.value.temp.plan,
          subTypeval: this.props.input.value.temp.subTypeval,
          subNameval: this.props.input.value.temp.subNameval,
          parcelDis: this.props.input.value.temp.parcelDis,
          blockval: this.props.input.value.temp.blockval,
          parcelval: this.props.input.value.temp.parcelval,
          subname: this.props.input.value.temp.subname,
          block_no: this.props.input.value.temp.block_no,
          city_name: this.props.input.value.temp.city_name,
        },
        parcels: [...this.props.input.value.parcels],
        parcelData: { ...this.props.input.value.parcelData },
        domainLists: { ...this.state.domainLists },
        lists: {
          firstParcels: [...this.state.parcelNum],
          subDivNames: [...this.state.subDivNames],
          MunicipalityNames: [...this.state.MunicipalityNames],
          subDivType: [...this.state.subDivType],
          PlanNum: [...this.state.PlanNum],
          blockNum: [...this.state.blockNum],
        },
      };

      this.state.landsData["selectedRequestType"] =
        (([22, 23].indexOf(this.props.currentModule.id) != -1 ||
          [1928].indexOf(this.props?.currentModule?.record?.workflow_id) !=
            -1) &&
          [2190, 2191].indexOf(
            this.props?.currentModule?.record?.workflow_id
          ) == -1 &&
          this.state.selectedRequestType) ||
        ([2190].indexOf(this.props?.currentModule?.record?.workflow_id) != -1 &&
          "فرد") ||
        ([2191].indexOf(this.props?.currentModule?.record?.workflow_id) != -1 &&
          "اصدار الكروكي (المواطن)") ||
        3;

      this.props.input.onChange({ ...this.state.landsData });
    }

    this.props.setCurrentMap(map);

    if (this.props.input.value.parcels) {
      setTimeout(() => {
        highlightFeature([this.props.input.value.parcels[0]], this.map, {
          layerName: "SelectGraphicLayer",
          noclear: true,
          isZoom: true,
          attr: { isParcel: true },
          isHighlighPolygonBorder: true,
          zoomFactor: 10,
        });
      }, 1000);
    }

    //this.props.setMapLayers(mapLayers);
    store.dispatch({ type: "Show_Loading_new", loading: false });
  };

  setValue = (item, event) => {
    item.value = event.target.value;

    this.UpdateSubmissionDataObject();
  };

  addSelectedFeaturesFromMap = () => {
    this.props.selectedFeaturesOnMap.forEach((f) => {
      if (
        this.props.mainObject.investType.invest_type.SelectedLayer ==
        "Invest_Site_Polygon"
      ) {
        f.attributes.PARCEL_MAIN_LUSE = f.attributes[investSugges];
        f.attributes[investSugges] = null;
        f.attributes.PARCEL_AREA = f.attributes["SITE_AREA"];
      }

      f.id = f.attributes.PARCEL_SPATIAL_ID;

      this.setToStore([f]).then(() => {
        this.setState({
          parcelId: null,
        });

        var res = {
          features: [
            {
              ...f,
              i: uniqid(),
            },
          ],
        };

        this.selectedLandsT.push(res);
        this.DrawGraph();
      });
    });

    this.props.setSelectedFeaturesOnMap([]);
  };

  addFeature = (feature) => {
    feature.attributes.PARCEL_SPATIAL_ID =
      feature.attributes.SITE_GEOSPATIAL_ID;

    this.setState({ parcelId: feature.attributes.SITE_GEOSPATIAL_ID }, () => {
      this.OnParcelSelect();
    });
  };

  OnParcelSelect = () => {
    //
    this.setState({ parcelval: undefined });
    clearGraphicFromLayer(this.map, "SelectGraphicLayer");
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");

    if (
      !this.state.selectedLands.filter((e) => e.id === this.state.parcelId)
        .length
    ) {
      // ["PARCEL_AREA", "PARCEL_MAIN_LUSE", "PARCEL_LAT_COORD", "PARCEL_LONG_COORD", "PLAN_NO", "PARCEL_PLAN_NO", "USING_SYMBOL", "PARCEL_BLOCK_NO", "DISTRICT_NAME", "SUBDIVISION_DESCRIPTION", "SUBDIVISION_TYPE", "PARCEL_SPATIAL_ID", "MUNICIPALITY_NAME"]

      let layerId = this.LayerID.Landbase_Parcel;
      let filterField = "PARCEL_SPATIAL_ID";

      if (
        this.props.mainObject.investType.invest_type.SelectedLayer ==
        "Invest_Site_Polygon"
      ) {
        layerId = this.LayerID.Invest_Site_Polygon;
        filterField = "SITE_GEOSPATIAL_ID";
      }

      queryTask({
        ...querySetting(
          layerId,
          `${filterField} =${this.state.parcelId}`,
          true,
          ["*"],
          investMapUrl
        ),
        callbackResult: (res) => {
          if (res.features.length > 0) {
            if (res.features[0].attributes.PARCELOWNER == 2) {
              window.notifySystem(
                "warning",
                "عذرا لا يمكن تقديم معاملة طرح مواقع استثمارية على هذة الأرض حيث تم الإفادة مسبقًا بأن الأرض غير عائدة للأمانة"
              );
            } else {
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
                    ],
                    investMapUrl
                  ),
                  callbackResult: (condition) => {
                    this.setState({
                      conditions: condition.features,
                    });
                    getFeatureDomainName(
                      res.features,
                      layerId,
                      false,
                      investMapUrl
                    ).then((r) => {
                      if (
                        this.props.mainObject.investType.invest_type
                          .SelectedLayer == "Invest_Site_Polygon"
                      ) {
                        r[0].attributes.PARCEL_MAIN_LUSE =
                          r[0].attributes[investSugges];
                        r[0].attributes.PARCEL_AREA =
                          r[0].attributes["SITE_AREA"];
                        r[0].attributes[investSugges] = null;
                      }

                      this.setToStore(r).then(() => {
                        this.setState({
                          parcelId: null,
                        });
                        this.selectedLandsT.push(res);
                        this.DrawGraph();

                        //this.state.selectedLands.pop();
                      });
                    });
                  },
                });
              } else {
                getFeatureDomainName(
                  res.features,
                  layerId,
                  false,
                  investMapUrl
                ).then((r) => {
                  if (
                    this.props.mainObject.investType.invest_type
                      .SelectedLayer == "Invest_Site_Polygon"
                  ) {
                    r[0].attributes.PARCEL_MAIN_LUSE =
                      r[0].attributes[investSugges];
                    r[0].attributes[investSugges] = null;
                    r[0].attributes.PARCEL_AREA = r[0].attributes["SITE_AREA"];
                  }

                  this.setToStore(r).then(() => {
                    this.setState({
                      parcelId: null,
                    });
                    this.selectedLandsT.push(res);
                    this.DrawGraph();

                    //this.state.selectedLands.pop();
                  });
                });
              }
            }
          }
        },
      });
    }
  };

  setToStore = (r) => {
    return new Promise((resolve, reject) => {
      const {
        input: { value },
      } = this.props;

      if (
        value?.parcels?.find(
          (x) => x.attributes["OBJECTID"] == (r && r[0].attributes["OBJECTID"])
        )
      ) {
        window.notifySystem("warning", "هذة الأرض تم اختيارها من قبل");
      } else {
        this.state.landsData = {
          ...value,
          mapGraphics: [],
          conditions: this.state.conditions,
          parcelData: { ...this.state.parcelData },
          temp: {
            //map: this.map,
            // ...value,
            mun: this.state.munval,
            plan: this.state.planeval,
            subTypeval: this.state.subTypeval,
            subNameval: this.state.subNameval,
            subname: this.state.subName_name,
            parcelDis: this.RolBackParcelNum,
            block_no: this.state.block_no,
            blockval: this.state.blockval,
            parcelval: this.state.parcelval,
            city_name: this.state.city_name,
          },
          domainLists: { ...this.state.domainLists },
          lists: {
            firstParcels: [...this.state.parcelNum],
            subDivNames: [...this.state.subDivNames],
            MunicipalityNames: [...this.state.MunicipalityNames],
            subDivType: [...this.state.subDivType],
            PlanNum: [...this.state.PlanNum],
            blockNum: [...this.state.blockNum],
          },
        };

        if (r) {
          //r[0].attributes.PARCEL_AREA = "";

          let geometry = new esri.geometry.Polygon(r[0].geometry);
          let pt = geometry.getExtent().getCenter();

          project([pt], 4326, (res) => {
            //

            r[0].attributes.X = pt.x;
            r[0].attributes.Y = pt.y;
            r[0].attributes.lat = res[0].y;
            r[0].attributes.long = res[0].x;
            r[0].attributes.googleLink =
              "https://maps.google.com/?q=" + res[0].y + "," + res[0].x;

            this.state.selectedLands.push({
              geometry: r[0].geometry,
              attributes: r[0].attributes,
              id: this.state.parcelId || r[0].attributes.PARCEL_SPATIAL_ID,
            });

            map_object(this.state.selectedLands);

            this["edit_PARCEL_AREA" + (this.state.selectedLands.length - 1)] =
              r[0].attributes.PARCEL_AREA;
            this[
              "edit_PARCEL_BLOCK_NO" + (this.state.selectedLands.length - 1)
            ] = r[0].attributes.PARCEL_BLOCK_NO || r[0].attributes.BLOCK_NO;
            this["edit_DISTRICT_NAME" + (this.state.selectedLands.length - 1)] =
              r[0].attributes.DISTRICT_NAME;
            this[
              "edit_SUBDIVISION_TYPE" + (this.state.selectedLands.length - 1)
            ] = r[0].attributes.SUBDIVISION_TYPE;
            this[
              "edit_SUBDIVISION_DESCRIPTION" +
                (this.state.selectedLands.length - 1)
            ] = r[0].attributes.SUBDIVISION_DESCRIPTION;

            this.updateSelectParcels();
            resolve();
          });
        } else {
          this.updateSelectParcels();
          resolve();
        }
      }
    });
  };

  updateSelectParcels = () => {
    this.state.landsData["parcels"] = [...this.state.selectedLands];

    this.state.landsData["selectedRequestType"] =
      (([22, 23].indexOf(this.props.currentModule.id) != -1 ||
        [1928].indexOf(this.props?.currentModule?.record?.workflow_id) != -1) &&
        [2190, 2191].indexOf(this.props?.currentModule?.record?.workflow_id) ==
          -1 &&
        this.state.selectedRequestType) ||
      ([2190].indexOf(this.props?.currentModule?.record?.workflow_id) != -1 &&
        "فرد") ||
      ([2191].indexOf(this.props?.currentModule?.record?.workflow_id) != -1 &&
        "اصدار الكروكي (المواطن)") ||
      3;

    this.props.input.onChange({ ...this.state.landsData });
  };

  setAdjacentToStore = (r) => {
    let store_value = this.props.input.value;
    store_value.temp.parcelDis = r;
    this.props.input.onChange(store_value);
  };

  LandHoverOn = (f) => {
    if (this.state.selectedLands.length) {
      var fitleredGraphics = this.map
        .getLayer("SelectGraphicLayer")
        .graphics.filter((graphic) => {
          return graphic.attributes.OBJECTID != f.attributes.OBJECTID;
        });

      fitleredGraphics = [
        ...new Map(
          fitleredGraphics.map((item) => [item["attributes"]["OBJECTID"], item])
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
      this.state.selectedLands.length &&
      f.attributes.PARCEL_SPATIAL_ID != this.state.parcelId
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

  remove = (item) => {
    let { mainObject } = this.props;
    if (mainObject && mainObject.waseka) {
      delete mainObject.waseka;
    }
    this.state.parcelData = {};
    //this.state.selectedLands.pop(item);

    let filterField = "SITE_GEOSPATIAL_ID";

    if (!item.attributes["SITE_GEOSPATIAL_ID"]) {
      filterField = "PARCEL_SPATIAL_ID";
    }
    this.state.selectedLands = this.state.selectedLands.filter(
      (x) => x.attributes[filterField] != item.attributes[filterField]
    );
    //this.props.input.value.parcels = slice(this.props.input.value.parcels, 0, -1)
    // this.props.input.onChange([...values])
    if (this.state.selectedLandsT) {
      this.state.selectedLandsT.filter(
        (x) => x.attributes[filterField] != item.attributes[filterField]
      );

      //this.state.selectedLandsT.pop(item);
    }
    this.DrawGraph();
    this.UpdateSubmissionDataObject();
  };

  saveEdit(id, name, i) {
    let filterField = "PARCEL_SPATIAL_ID";

    if (
      this.props.mainObject.investType.invest_type.SelectedLayer ==
      "Invest_Site_Polygon"
    ) {
      filterField = "SITE_GEOSPATIAL_ID";
    }

    let findParcel = this.props.input.value.parcels.find((p) => {
      return [p?.id, p?.attributes[filterField]].indexOf(id) != -1;
    });
    findParcel.attributes[name] =
      this["edit_" + name + i] || findParcel.attributes[name];
    let selectLand = this.state.selectedLands.find((p) => {
      return [p?.id, p?.attributes[filterField]].indexOf(id) != -1;
    });
    selectLand.attributes[name] =
      this["edit_" + name + i] || selectLand.attributes[name];
    this.state.landsData = {
      ...this.props.input.value,
      parcels: [...this.state.selectedLands],
      parcelData: { ...this.state.parcelData },
      domainLists: { ...this.state.domainLists },
      lists: {
        firstParcels: [...this.state.parcelNum],
        subDivNames: [...this.state.subDivNames],
        MunicipalityNames: [...this.state.MunicipalityNames],
        subDivType: [...this.state.subDivType],
        PlanNum: [...this.state.PlanNum],
        blockNum: [...this.state.blockNum],
      },
    };

    this.state.landsData["selectedRequestType"] =
      (([22, 23].indexOf(this.props.currentModule.id) != -1 ||
        [1928].indexOf(this.props?.currentModule?.record?.workflow_id) != -1) &&
        [2190, 2191].indexOf(this.props?.currentModule?.record?.workflow_id) ==
          -1 &&
        this.state.selectedRequestType) ||
      ([2190].indexOf(this.props?.currentModule?.record?.workflow_id) != -1 &&
        "فرد") ||
      ([2191].indexOf(this.props?.currentModule?.record?.workflow_id) != -1 &&
        "اصدار الكروكي (المواطن)") ||
      3;

    this.props.input.onChange({ ...this.state.landsData });
    this.setState({
      [name + "_isEdit_" + i]: false,
      selectedLands: [...this.state.selectedLands],
    });
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
    this["edit_" + name + i] = event.target.value;
    e.attributes[name] = event.target.value;
    //e.attributes['PARCEL_AREA'] = event.target.value;
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  selectOnchange = (name, i, e, value) => {
    this["edit_" + name + i] = value;
    e.attributes[name] = value;

    if (name == investSugges) {
      e.attributes[name + "_Code"] = this.parcel_fields
        .find((x) => x.name == investSugges)
        .options.find((x) => x.name == value).code;
    }

    //e.attributes['PARCEL_AREA'] = event.target.value;
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  showEditBtn = (name, value) => {
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
          investSugges,
        ].indexOf(name) > -1
      );
    }
  };

  enableEdit = (name, i) => {
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  exportCad = () => {
    console.log(this.state.selectedLands);

    var polygons = this.state.selectedLands;
    var cadPolygons = [];

    polygons.forEach((polygon) => {
      delete polygon.geometry.cache;
      var jsonParcel = {
        geometry: polygon.geometry,
        attributes: {
          Layer: "floor",
          Color: 1,
          LyrColor: 1,
        },
      };
      cadPolygons.push(jsonParcel);
    });

    var jsonParcel = {
      attributes: {
        Layer: "plus",
        Color: 2,
        LyrColor: 2,
      },
    };
    uploadGISFile(
      `${window.restServicesPath}/ExportGeoDataToCAD/GPServer/ExportGeoDataToCAD`,
      {
        ParcelsToExport: JSON.stringify(cadPolygons), //`[${featuresList.join(", ")}]` ,
      },
      (data) => {
        //store.dispatch({ type: "Show_Loading_new", loading: false });
        data.value.split(",").forEach((item) => {
          //setTimeout(() => {

          var file_path =
            window.filesHost +
            "/" +
            item.replaceAll(/\s/g, "").replaceAll("\\", "/");
          var a = document.createElement("A");
          a.href = file_path;
          a.download = file_path.substr(file_path.lastIndexOf("/") + 1);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          //}, 1000);
        });
      }
    );
  };

  setSelectMapLayer = (layer) => {
    this.props.setSelectMapLayer(layer);
  };

  onPublicUserDegreesSubmit = (values) => {
    // convert (deg, min, sec) to value of (lat,lng)
    this.zoomToDegreePoint(values);
  };

  zoomToDegreePoint = (values) => {
    let latitudeResult =
      +values.latitudeDeg +
      +values.latitudeMinutes / 60 +
      +values.latitudeSeconds / 3600;
    let longitudeResult =
      +values.longitudeDeg +
      +values.longitudeMinutes / 60 +
      +values.longitudeSeconds / 3600;

    this.zoomToLatLng(latitudeResult, longitudeResult);
  };

  zoomToLatLng = (lat, lng) => {
    let point = new esri.geometry.Point({
      latitude: lat,
      longitude: lng,
    });

    this.checkPointInAmana(point);
  };

  checkPointInAmana = (point) => {
    project([point], this.map.spatialReference.wkid, (res) => {
      highlightFeature(res[0], this.map, {
        layerName: "ZoomGraphicLayer",
        isZoom: true,
        pointZoomFactor: 10,
        isZoomOnly: true,
        isLocation: true,
      });
    });

    /*project([point], this.map.spatialReference.wkid, (res) => {
      queryTask({
        url: investMapUrl + "/" + this.LayerID["Province_Boundary"],
        geometry: res[0],
        outFields: ["OBJECTID"],
        returnGeometry: false,
        callbackResult: ({ features }) => {
          if (!features.length) {
            message.warning("هذة النقطة خارج حدود الأمانة");
          } else {
            highlightFeature(res[0], this.map, {
              layerName: "ZoomGraphicLayer",
              isZoom: true,
              pointZoomFactor: 10,
              isZoomOnly: true,
              isLocation: true,
            });
          }
        },
      });
    });*/
  };

  onPublicUserDecimalSubmit = (values) => {
    if (values.latitude && values.longitude) {
      let point = new esri.geometry.Point({
        latitude: +values.latitude,
        longitude: +values.longitude,
      });
      this.checkPointInAmana(point);
    }
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
      requestTypes,
      selectedRequestType,
      boundariesBtnIsVisible,
      formValues,
    } = this.state;

    const { t, fullMapWidth, selectedFeaturesOnMap, mainObject } = this.props;

    var parcelBtnDisabled = false; // this.props?.currentModule?.record?.workflow_id
    if (
      ([22, 23].indexOf(this.props.currentModule.id) != -1 ||
        [1928].indexOf(this.props?.currentModule?.record?.workflow_id) != -1) &&
      [2190, 2191].indexOf(this.props?.currentModule?.record?.workflow_id) ==
        -1 &&
      selectedRequestType == 1 &&
      selectedLands.length > 0
    ) {
      parcelBtnDisabled = true;
    }

    return (
      <div>
        <div className={!fullMapWidth ? "content-section implementation" : ""}>
          <div
            style={
              (!this.props.isView && {
                display: "flex",
                marginTop: "35px",
              }) || {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }
            }
            className="removeActive"
          >
            {(mapLoaded && !this.props.isView && (
              <div
                style={{
                  direction: "ltr",
                  width: "95%",
                }}
              >
                <Tabs
                  defaultActiveKey="searchLands"
                  style={{ direction: "rtl" }}
                >
                  <Tab
                    className="tabsPaddingLand"
                    eventKey="searchLands"
                    title="بحث عن أرض"
                    style={{ paddingTop: "10px", padding: "10px" }}
                  >
                    {mainObject.investType.invest_type.SelectedLayer ==
                    "Landbase_Parcel" ? (
                      <>
                        <Select
                          getPopupContainer={(trigger) => trigger.parentNode}
                          autoFocus
                          onChange={(val) => {
                            onMunChange(this, val);
                          }}
                          showSearch
                          value={this.state.munval}
                          placeholder="اختر اسم البلديه"
                          disabled={!this.state.MunicipalityNames.length}
                          optionFilterProp="children"
                          filterOption={(input, option) => {
                            if (option.props.children) {
                              return (
                                option.props.children.find((i) => {
                                  return (
                                    i.indexOf(input.trim().toLowerCase()) >= 0
                                  );
                                }) != null
                              );
                            } else {
                              return false;
                            }
                          }}
                        >
                          {MunicipalityNames.map((e) => (
                            <Option key={e.code} value={e.code}>
                              {e.name}{" "}
                            </Option>
                          ))}
                        </Select>
                        <Select
                          onChange={(val) => {
                            onPlaneChange(this, val);
                          }}
                          showSearch
                          getPopupContainer={(trigger) => trigger.parentNode}
                          autoFocus
                          disabled={!PlanNum.length}
                          optionFilterProp="children"
                          filterOption={(input, option) => {
                            if (option.props.children) {
                              return (
                                option.props.children
                                  ?.toLowerCase()
                                  ?.indexOf(
                                    convertToArabic(input.toLowerCase())
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
                                option.props.children
                                  ?.toLowerCase()
                                  ?.indexOf(
                                    convertToArabic(input.toLowerCase())
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
                          filterOption={(input, option) => {
                            if (option.props.children) {
                              return (
                                option.props.children
                                  ?.toLowerCase()
                                  ?.indexOf(
                                    convertToArabic(input.toLowerCase())
                                  ) != -1
                              );
                            } else {
                              return false;
                            }
                          }}
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
                          filterOption={(input, option) => {
                            if (option.props.children) {
                              return (
                                option.props.children
                                  ?.toLowerCase()
                                  ?.indexOf(
                                    convertToArabic(input.toLowerCase())
                                  ) != -1
                              );
                            } else {
                              return false;
                            }
                          }}
                        >
                          {blockNum
                            //.slice(0, 100)
                            .map((e, i) => (
                              <Option
                                key={i}
                                value={e.attributes.BLOCK_SPATIAL_ID}
                              >
                                {convertToArabic(e.attributes.BLOCK_NO)}
                              </Option>
                            ))}
                        </Select>
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
                                // .slice(0, 100),
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
                                option.props.children
                                  ?.toLowerCase()
                                  ?.indexOf(
                                    convertToArabic(input.toLowerCase())
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
                              .map((e, i) => {
                                return (
                                  <Option
                                    onMouseEnter={this.LandHoverOn.bind(
                                      this,
                                      e
                                    )}
                                    onMouseLeave={this.LandHoverOff.bind(
                                      this,
                                      e
                                    )}
                                    key={e.attributes.PARCEL_SPATIAL_ID}
                                    value={e.i}
                                  >
                                    {localizeNumber(
                                      e.attributes.PARCEL_PLAN_NO
                                    )}
                                  </Option>
                                );
                              })}
                        </Select>

                        <Button
                          className="add-gis"
                          disabled={!this.state.parcelId || parcelBtnDisabled}
                          onClick={this.OnParcelSelect}
                        >
                          إضافة الأرض
                        </Button>
                      </>
                    ) : (
                      <>
                        <FilterComponentInvest
                          map={this.map}
                          setSelectMapLayer={this.setSelectMapLayer}
                          searchLayer={
                            mainObject.investType.invest_type.SelectedLayer
                          }
                          addFeature={this.addFeature}
                        />
                      </>
                    )}
                  </Tab>
                  <Tab
                    eventKey="coords"
                    title="بحث بالإحداثيات"
                    style={{ marginTop: "30px" }}
                  >
                    <Tabs defaultActiveKey="decimal" className="">
                      <Tab eventKey="deg" title="درجات-دقائق-ثواني">
                        <Form
                          onFinish={this.onPublicUserDegreesSubmit}
                          className="coordinateForm"
                          layout="vertical"
                          name="validate_other"
                        >
                          <Container fluid>
                            <h5 className="mt-4 mr-1">دوائر العرض</h5>
                            <Row>
                              <Col span={7} className="mr-1 ml-2">
                                <Form.Item
                                  rules={[
                                    {
                                      message: "اختر الدرجة",
                                      required: true,
                                    },
                                  ]}
                                  name="latitudeDeg"

                                  // help="Should be combination of numbers & alphabets"
                                >
                                  <Input
                                    // type="number"
                                    name="latitudeDeg"
                                    onChange={this.handleChange}
                                    value={formValues.latitudeDeg}
                                    placeholder="درجات"
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={7} className="mr-1">
                                <Form.Item
                                  rules={[
                                    {
                                      message: "اختر الدقيقة",
                                      required: true,
                                    },
                                  ]}
                                  name="latitudeMinutes"

                                  // help="Should be combination of numbers & alphabets"
                                >
                                  <Input
                                    // type="number"
                                    name="latitudeMinutes"
                                    onChange={this.handleChange}
                                    value={formValues.latitudeMinutes}
                                    placeholder="دقائق"
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  name="latitudeSeconds"
                                  rules={[
                                    {
                                      message: "إختر الثانية",
                                      required: true,
                                    },
                                  ]}
                                  // help="Should be combination of numbers & alphabets"
                                >
                                  <Input
                                    // type="number"
                                    name="latitudeSeconds"
                                    onChange={this.handleChange}
                                    value={formValues.latitudeSeconds}
                                    placeholder="ثواني"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            <h5 className="mt-4 mr-1">خط الطول</h5>
                            <Row>
                              <Col span={7} className="mr-1 ml-2">
                                <Form.Item
                                  name="longitudeDeg"
                                  rules={[
                                    {
                                      message: "اختر الدرجة",
                                      required: true,
                                    },
                                  ]}
                                >
                                  <Input
                                    // type="number"
                                    name="longitudeDeg"
                                    onChange={this.handleChange}
                                    value={formValues.longitudeDeg}
                                    placeholder="درجات"
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={7} className="mr-1">
                                <Form.Item
                                  name="longitudeMinutes"
                                  rules={[
                                    {
                                      message: "اختر الدقيقة",
                                      required: true,
                                    },
                                  ]}
                                  // help="Should be combination of numbers & alphabets"
                                >
                                  <Input
                                    // type="number"
                                    name="longitudeMinutes"
                                    onChange={this.handleChange}
                                    value={formValues.longitudeMinutes}
                                    placeholder="دقائق"
                                  />
                                </Form.Item>
                              </Col>

                              <Col span={8}>
                                <Form.Item
                                  name="longitudeSeconds"
                                  rules={[
                                    {
                                      message: "اختر الثواني",
                                      required: true,
                                    },
                                  ]}

                                  // help="Should be combination of numbers & alphabets"
                                >
                                  <Input
                                    // type="number"
                                    name="longitudeSeconds"
                                    onChange={this.handleChange}
                                    value={formValues.longitudeSeconds}
                                    placeholder="ثواني"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                            <div style={{ textAlign: "center" }}>
                              <Button
                                style={{ float: "inherit", width: "60%" }}
                                className="add-gis"
                                size="large"
                                htmlType="submit"
                                onClick={this.degSearch}
                              >
                                بحث
                              </Button>
                            </div>
                          </Container>
                        </Form>
                      </Tab>
                      <Tab eventKey="decimal" title="إحداثيات عشرية">
                        <Form
                          onFinish={this.onPublicUserDecimalSubmit}
                          className="coordinateForm"
                          layout="vertical"
                          name="validate_other"
                        >
                          <Container>
                            <Row>
                              <Col span={24} className="">
                                <h5 className="mt-4 ">دوائر العرض</h5>
                                <Form.Item
                                  name="latitude"
                                  rules={[
                                    {
                                      message: "اختر دوائر العرض",
                                      required: true,
                                    },
                                  ]}
                                >
                                  <Input
                                    // type="number"
                                    name="latitude"
                                    onChange={this.handleChange}
                                    value={formValues.latitude}
                                    placeholder="ex: 26.xxxxxx"
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={24} className="">
                                <h5 className="mt-2">خط الطول</h5>
                                <Form.Item
                                  rules={[
                                    {
                                      message: "اختر خط الطول",
                                      required: true,
                                    },
                                  ]}
                                  name="longitude"
                                >
                                  <Input
                                    // type="number"
                                    name="longitude"
                                    onChange={this.handleChange}
                                    value={formValues.longitude}
                                    placeholder="ex: 50.xxxxxx"
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                            <div style={{ textAlign: "center" }}>
                              <Button
                                style={{ float: "inherit", width: "60%" }}
                                onClick={this.CoordinateSearch}
                                className="add-gis"
                                size="large"
                                htmlType="submit"
                              >
                                بحث
                              </Button>
                            </div>
                          </Container>
                        </Form>
                      </Tab>
                    </Tabs>
                  </Tab>
                </Tabs>
              </div>
            )) || (
              <div
                style={{
                  direction: "ltr",
                }}
              >
                <Button className="add-gis" onClick={this.exportCad}>
                  استخراج ملف كاد
                </Button>
              </div>
            )}
          </div>
          <div>
            {/* <div className="btn-fixed">
              <MapBtnsComponent {...this.props}></MapBtnsComponent>
            </div> */}
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
        {mapLoaded && (
          <div style={{ gridColumn: "1/3" }}>
            <div style={{ textAlign: "end", marginTop: "10px" }}>
              {selectedFeaturesOnMap && selectedFeaturesOnMap.length ? (
                <Button
                  onClick={this.addSelectedFeaturesFromMap.bind(this)}
                  className="add_mktab toolsBtnStyle addFromMapbtn"
                  type="primary"
                  icon="plus"
                >
                  إضافة الأراضي المحددة
                </Button>
              ) : (
                <div></div>
              )}
            </div>
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
                                        {field.type != "select" &&
                                          field.type != "button" && (
                                            <input
                                              key={i}
                                              className="form-control"
                                              type={field.type}
                                              step="any"
                                              value={e.attributes[field.name]}
                                              onChange={this.myChangeHandler.bind(
                                                this,
                                                field.name,
                                                i,
                                                e
                                              )}
                                            />
                                          )}
                                        {field.type == "select" && (
                                          <Select
                                            getPopupContainer={(trigger) =>
                                              trigger.parentNode
                                            }
                                            autoFocus
                                            value={e.attributes[field.name]}
                                            onChange={this.selectOnchange.bind(
                                              this,
                                              field.name,
                                              i,
                                              e
                                            )}
                                            placeholder="النشاط المقترح"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                              convertToEnglish(
                                                option.props.children
                                              )
                                                ?.toLowerCase()
                                                ?.indexOf(
                                                  input.toLowerCase()
                                                ) >= 0
                                            }
                                          >
                                            {field.options.map((e, i) => (
                                              <Option key={i} value={e.name}>
                                                {convertToArabic(e.name)}
                                              </Option>
                                            ))}
                                          </Select>
                                        )}
                                        <button
                                          className="btn"
                                          style={{ marginRight: "20px" }}
                                          onClick={this.saveEdit.bind(
                                            this,
                                            mainObject.investType.invest_type
                                              .SelectedLayer ==
                                              "Invest_Site_Polygon"
                                              ? e.attributes.SITE_GEOSPATIAL_ID
                                              : e.attributes.PARCEL_SPATIAL_ID,
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
                                      {field.type == "button" ? (
                                        <button
                                          className="btn btn-primary"
                                          style={{ marginRight: "20px" }}
                                          onClick={this.showGoogleLink.bind(
                                            this,
                                            e.attributes.googleLink
                                          )}
                                        >
                                          عرض
                                        </button>
                                      ) : (
                                        <span>
                                          {localizeNumber(
                                            e.attributes[field.name] || ""
                                          )}
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          })}

                          {!this.props.isView ? (
                            <td>
                              <div>
                                <button
                                  className="btn btn-danger"
                                  onClick={this.remove.bind(this, e)}
                                >
                                  حذف
                                </button>

                                <Button
                                  className="toolsBtnStyle"
                                  style={{ margin: "auto 1px" }}
                                  size="large"
                                  onClick={this.zoomToFeature.bind(this, e)}
                                >
                                  <FontAwesomeIcon
                                    icon={faSearchPlus}
                                    className=""
                                  />
                                </Button>
                              </div>
                            </td>
                          ) : (
                            <td>
                              <Button
                                className="toolsBtnStyle"
                                style={{ margin: "auto 1px" }}
                                size="large"
                                onClick={this.zoomToFeature.bind(this, e)}
                              >
                                <FontAwesomeIcon
                                  icon={faSearchPlus}
                                  className=""
                                />
                              </Button>
                            </td>
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
)(withTranslation("labels")(InvestIdentifyComponnent));
