import React, { Component } from "react";
import { esriRequest } from "../common/esri_request";
import { workFlowUrl } from "imports/config";
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
} from "../common/common_func";
import store from "app/reducers";
import { withTranslation } from "react-i18next";
import { geometryServiceUrl, mapUrl } from "../mapviewer/config/map";
import { Select, Button, Form, message } from "antd";
// import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import MapBtnsComponent from "../MapBtnsComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
import { connect } from "react-redux";
import { querySetting, selectDis } from "./Helpers";
import { StickyContainer, Sticky } from "react-sticky";
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

class SurveyIdentifyComponnent extends Component {
  constructor(props) {
    super(props);
    this.PlanNum = [];
    this.planId = null;
    this.parcelTs = [];
    //this.parcelFilterWhere = "";
    this.selectedLandsT =
      (props?.input?.value?.temp?.parcelDis && [
        { features: props?.input?.value?.temp?.parcelDis },
      ]) ||
      [];
    this.selectedLands = [];
    this.selectionMode = false;
    this.parcel_fields_headers_shatfa = [
      "الإتجاه",
      "شمال / شرق",
      "شمال / غرب",
      "جنوب / شرق",
      "جنوب / غرب",
    ];
    this.parcel_fields_shatfa = [
      { name: "direction", editable: false },
      { name: "SHATFA_NORTH_EAST_DIRECTION", editable: true },
      { name: "SHATFA_NORTH_WEST_DIRECTION", editable: true },
      { name: "SHATFA_SOUTH_EAST_DIRECTION", editable: true },
      { name: "SHATFA_SOUTH_WEST_DIRECTION", editable: true },
    ];

    this.parcel_fields_headers = this.props.parcel_fields_headers || [
      "رقم الأرض",
      "المساحة من الصك (م۲)",
      "رقم المخطط",
      "رقم البلك",
      "الحي",
      "نوع التقسيم",
      "اسم التقسيم",
      "رمز الإستخدام",
    ];
    this.parcel_fields = this.props.parcel_fields || [
      { name: "PARCEL_PLAN_NO", editable: false, type: "text" },
      {
        name: "PARCEL_AREA",
        editable: (!this.props.isView && true) || false,
        type: "number",
      },
      {
        name: "PLAN_NO",
        editable: (!this.props.isView && true) || false,
        type: "text",
      },
      {
        name: "PARCEL_BLOCK_NO",
        editable: (!this.props.isView && true) || false,
        type: "text",
      },
      {
        name: "DISTRICT_NAME",
        editable: (!this.props.isView && true) || false,
        type: "text",
      },
      {
        name: "SUBDIVISION_TYPE",
        editable: false,
        type: "select",
      },
      {
        name: "SUBDIVISION_DESCRIPTION",
        editable: false,
        type: "text",
      },
      { name: "USING_SYMBOL", editable: false },
    ];

    if (props?.input?.value?.selectedMoamlaType == 1) {
      this.parcel_fields_headers.push("عدد الوحدات");
      this.parcel_fields.push({ name: "UNITS_NUMBER", editable: false });
    }

    this.checkUnitNumberAvailability(
      [...((props.input && props.input.value.parcels) || [])],
      props?.input?.value?.temp?.mun
    );

    this.parcelDataFields = {};
    this.parcelShatfaFields = {};
    this.parcelElectricFields = {};

    ///////////////////////////////////////////////

    this.parcelElectricFields["electric_room_area"] = {
      label: "مساحة غرفة الكهرباء",
      placeholder: "من فضلك ادخل مساحة غرفة الكهرباء",
      field: "inputNumber",
      name: "electric_room_area",
      required: false,
    };
    this.parcelElectricFields["electric_room_place"] = {
      label: "مكان غرفة الكهرباء",
      placeholder: "من فضلك ادخل مكان غرفة الكهرباء",
      type: "input",
      field: "select",
      data: [
        { label: "(شمال / شرق)", value: "(شمال / شرق)" },
        { label: "(شمال / غرب)", value: "(شمال / غرب)" },
        { label: "(جنوب / شرق)", value: "(جنوب / شرق)" },
        { label: "(جنوب / غرب)", value: "(جنوب / غرب)" },
      ],
      name: "electric_room_place",
      required: false,
    };

    ///////////////////////////////////////////////

    this.parcelShatfaFields["SHATFA_NORTH_EAST_DIRECTION"] = {
      label: "مساحة الشطفة في إتجاة (شمال / شرق) ",
      placeholder: " من فضلك ادخل مساحة الشطفة في إتجاة (شمال / شرق) ",
      field: "inputNumber",
      name: "SHATFA_NORTH_EAST_DIRECTION",
      required: false,
    };
    this.parcelShatfaFields["SHATFA_NORTH_WEST_DIRECTION"] = {
      label: "مساحة الشطفة في إتجاة (شمال / غرب) ",
      placeholder: "من فضلك ادخل مساحة الشطفة في إتجاة (شمال / غرب)",
      field: "inputNumber",
      name: "SHATFA_NORTH_WEST_DIRECTION",
      required: false,
    };
    this.parcelShatfaFields["SHATFA_SOUTH_EAST_DIRECTION"] = {
      label: "مساحة الشطفة في إتجاة (جنوب / شرق) ",
      placeholder: "من فضلك ادخل مساحة الشطفة في إتجاة (جنوب / شرق)",
      field: "inputNumber",
      name: "SHATFA_SOUTH_EAST_DIRECTION",
      required: false,
    };
    this.parcelShatfaFields["SHATFA_SOUTH_WEST_DIRECTION"] = {
      label: "مساحة الشطفة في إتجاة (جنوب / غرب) ",
      placeholder: "من فضلك ادخل مساحة الشطفة في إتجاة (جنوب / غرب)",
      field: "inputNumber",
      name: "SHATFA_SOUTH_WEST_DIRECTION",
      required: false,
    };

    //////////////////////////////////////////////

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
      boundariesBtnIsVisible:
        this.props.boundariesBtnIsVisible != undefined
          ? this.props.boundariesBtnIsVisible
          : true,
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
      // blockNum:
      //   (props.input.value.lists && props.input.value.lists.blockNum) || [],
      conditions: (props.input && props.input.value.conditions) || undefined,
      planSersh: null,
      // subDivNames:
      //   (props.input.value.lists && props.input.value.lists.subDivNames) || [],
      // subDivType:
      //   (props.input.value.lists && props.input.value.lists.subDivType) || [],
      parcelNum: this.props?.input?.value?.temp?.parcelDis || [],
      parcelNumS: [],
      // MunicipalityNames:
      //   (props.input.value.lists &&
      //     props.input.value.lists.MunicipalityNames) ||
      //   [],
      requestTypes: [
        { code: 1, name: "فرز ودمج الأراضي", key: "" },
        { code: 2, name: "تحديث وفرز الصكوك", key: "" },
        //{ code: 3, name: "تقسيم", key: "" },
      ],
      Req_types: [
        { code: "", name: "فرز ودمج أرض فضاء", key: "" },
        { code: "duplix", name: "فرز دوبلكسات", key: "" },
      ],
      // PlanNum:
      //   (props.input.value.lists && props.input.value.lists.PlanNum) || [],
      blockNum: [],
      subDivNames: [],
      subDivType: [],
      MunicipalityNames: [],
      PlanNum: [],
      parcelId: null,
      mapExtend: null,
      parcelSearch: null,
      poly: null,
      selectedMoamlaType: props?.input?.value?.selectedMoamlaType,
      selected_Req_type: props?.input?.value?.selected_Req_type,
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
      city_name: props?.input?.value?.temp?.city_name,

      survayParcelCutter: props.input.value.survayParcelCutter || [
        {
          direction: "الشطفة",
          SHATFA_NORTH_EAST_DIRECTION: "",
          SHATFA_NORTH_WEST_DIRECTION: "",
          SHATFA_SOUTH_EAST_DIRECTION: "",
          SHATFA_SOUTH_WEST_DIRECTION: "",
        },
      ],
      electric_room_area: props.input.value.electric_room_area,
      have_electric_room: props.input.value.have_electric_room,
      electric_room_place: props.input.value.electric_room_place,
    };

    if (this.state.selectedMoamlaType == 2) {
      /*this.parcelShatfaFields["isSubtractArea"] = {
        label: "خصم مساحة الشطفة",
        field: "boolean",
        type: "boolean",
        name: "isSubtractArea",
        required: false,
      };

      this.parcelElectricFields["isSubtractArea"] = {
        label: "خصم مساحة غرفة الكهرباء",
        type: "boolean",
        field: "boolean",
        name: "isSubtractArea",
        required: false,
      };*/
    }

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
      //   firstParcels: [...this.state.parcelNum],
      //   subDivNames: [...this.state.subDivNames],
      //   MunicipalityNames: [...this.state.MunicipalityNames],
      //   subDivType: [...this.state.subDivType],
      //   PlanNum: [...this.state.PlanNum],
      //   blockNum: [...this.state.blockNum],
      // },
      survayParcelCutter: this.state.survayParcelCutter,
      electric_room_area: this.state.electric_room_area,
      have_electric_room: this.state.have_electric_room,
      electric_room_place: this.state.electric_room_place,
      selected_Req_type: this.state.selected_Req_type,
      selectedMoamlaType: this.state.selectedMoamlaType,
      selectedRequestType:
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
        3,
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
    //this.props.input.onChange({ ...this.state.landsData });
    this.setState({ parcelData }, () => {
      this.setToStore();
    });
  };

  farzRequestType = (value) => {
    this.setState(
      {
        selected_Req_type: value,
      },
      () => {
        this.UpdateSubmissionDataObject();
      }
    );
  };

  moamlaTypeChange = (value) => {
    if (value == 2) {
      /*this.parcelShatfaFields["isSubtractArea"] = {
        label: "خصم مساحة الشطفة",
        field: "boolean",
        type: "boolean",
        name: "isSubtractArea",
        required: false,
      };

      this.parcelElectricFields["isSubtractArea"] = {
        label: "خصم مساحة غرفة الكهرباء",
        type: "boolean",
        field: "boolean",
        name: "isSubtractArea",
        required: false,
      };*/

      this.parcel_fields_headers = [
        ...this.parcel_fields_headers.filter((x) => x != "عدد الوحدات"),
      ];
      this.parcel_fields = [
        ...this.parcel_fields.filter((x) => x.name != "UNITS_NUMBER"),
      ];
    } else {
      delete this.parcelShatfaFields["isSubtractArea"];
      delete this.parcelElectricFields["isSubtractArea"];

      this.state.selectedLands.forEach((parcel) => {
        delete parcel.parcelElectric?.isSubtractArea;
        delete parcel.parcelShatfa?.isSubtractArea;
      });

      if (!this.parcel_fields_headers.find((x) => x == "عدد الوحدات")) {
        this.parcel_fields_headers.push("عدد الوحدات");
        this.parcel_fields.push({ name: "UNITS_NUMBER", editable: false });
      }
    }

    this.setState(
      {
        selectedMoamlaType: value,
      },
      () => {
        this.UpdateSubmissionDataObject();
      }
    );
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
    esriRequest(mapUrl + "/" + this.LayerID["Landbase_Parcel"]).then(
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
      // this.props.mainObject &&
      // this.props.mainObject.landData &&
      this.isloaded
    ) {
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
        esriRequest(mapUrl + "/" + this.LayerID.Subdivision).then(
          (response) => {
            if (this.parcel_fields[5]) {
              this.parcel_fields[5].options =
                response.fields[7].domain.codedValues;
            }
            this.setState({
              subDivType: response.fields[7].domain.codedValues,
            });
            //this.forceUpdate();
          }
        );
      });

      this.isloaded = false;
      //this.DrawGraph();

      //this.UpdateSubmissionDataObject();
    }
  }

  // onMunChange = (e, callback) => {
  //   if (
  //     (!callback || (callback && typeof callback == "object")) &&
  //     !this.loadLists
  //   ) {
  //     clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //     this.setState({
  //       munval: e,
  //       planeval: undefined,
  //       subTypeval: undefined,
  //       subNameval: undefined,
  //       blockval: undefined,
  //       parcelval: undefined,
  //       // selectedLands: [],
  //       // selectedLandsT: [],
  //       PlanNum: [],
  //       blockNum: [],
  //       subDivNames: [],
  //       //subDivType: [],
  //       parcelId: null,
  //       parcelNum: [],
  //       parcelData: {},
  //     });

  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Municipality_Boundary,
  //         `MUNICIPALITY_NAME='${e}'`,
  //         true,
  //         ["*"]
  //       ),
  //       callbackResult: (res) => {
  //         this.pol = res.features[0];
  //         highlightFeature(this.pol, this.map, {
  //           layerName: "SelectGraphicLayer",
  //           isZoom: true,
  //           isHiglightSymbol: true,
  //           highlighColor: [0, 0, 0, 0.25],
  //         });
  //         this.setState({ city_name: this.pol?.attributes?.CITY_NAME_A || "" });
  //       },
  //     });
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Plan_Data,
  //         `MUNICIPALITY_NAME='${e}'`,
  //         false,
  //         ["PLAN_SPATIAL_ID", "PLAN_NO"]
  //       ),
  //       returnGeometry: true,
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
  //     this.resetGraphics();
  //   } else {
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Municipality_Boundary,
  //         `MUNICIPALITY_NAME='${e}'`,
  //         true,
  //         ["*"]
  //       ),
  //       callbackResult: (res) => {
  //         this.pol = res.features[0];
  //         this.planId = null;
  //         if (e) {
  //           queryTask({
  //             ...querySetting(
  //               this.LayerID.Plan_Data,
  //               `MUNICIPALITY_NAME='${e}'`,
  //               false,
  //               ["PLAN_SPATIAL_ID", "PLAN_NO"]
  //             ),
  //             returnGeometry: true,
  //             callbackResult: (res) => {
  //               this.setState(
  //                 {
  //                   PlanNum: res.features.map((e, i) => {
  //                     return {
  //                       ...e,
  //                       i: uniqid(),
  //                     };
  //                   }),
  //                 },
  //                 callback
  //               );
  //             },
  //           });
  //         } else {
  //           if (callback && typeof callback == "function") {
  //             callback();
  //           }
  //         }
  //       },
  //     });
  //   }
  // };

  resetFields = () => {
    this.props.onChange([]);
    this.setState({ selectedLands: [], selectedLandsT: [] });
  };

  // onPlaneChange = (f, callback) => {
  //   var planSpatialId = this.state.PlanNum.filter(
  //     (m) => m.i == f || m.attributes.PLAN_NO == f
  //   )?.[0]?.attributes?.PLAN_SPATIAL_ID;
  //   this.planId = planSpatialId;
  //   if (
  //     (!callback || (callback && typeof callback == "object")) &&
  //     !this.loadLists
  //   ) {
  //     clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //     clearGraphicFromLayer(this.map, "SelectGraphicLayer");
  //     this.setState({
  //       plan_no: this.state.PlanNum.filter((m) => m.i == f)?.[0]?.attributes
  //         ?.PLAN_NO,
  //       planeval: f,
  //       subTypeval: undefined,
  //       subNameval: undefined,
  //       blockval: undefined,
  //       parcelval: undefined,
  //       blockNum: [],
  //       subDivNames: [],
  //       // subDivType: [],
  //       parcelId: null,
  //       parcelNum: [],
  //       parcelData: {},
  //       // selectedLands: [],
  //       // selectedLandsT: [],
  //     });
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Plan_Data,
  //         `PLAN_SPATIAL_ID='${planSpatialId}'`,
  //         true,
  //         ["MUNICIPALITY_NAME"]
  //       ),
  //       returnGeometry: true,
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
  //     this.getParcelsWithinBufferedArea(
  //       this.state.PlanNum.filter((m) => m.i == f)?.[0],
  //       `PLAN_SPATIAL_ID='${planSpatialId}'`
  //     ).then((resps) => {
  //       this.setState({
  //         parcelSearch: null,
  //         parcelNum: resps.features.map((e, i) => {
  //           return {
  //             ...e,
  //             i,
  //           };
  //         }),
  //       });
  //     });
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Survey_Block,
  //         `PLAN_SPATIAL_ID='${planSpatialId}'`,
  //         false,
  //         ["BLOCK_NO", "BLOCK_SPATIAL_ID"]
  //       ),
  //       returnGeometry: true,
  //       callbackResult: (res) => {
  //         this.setState({ blockNum: res.features });
  //       },
  //     });
  //     this.resetGraphics();
  //   } else {
  //     this.pol = this.state.PlanNum.filter(
  //       (m) => m.i == f || m.attributes.PLAN_NO == f
  //     )?.[0];

  //     if (f) {
  //       queryTask({
  //         ...querySetting(
  //           this.LayerID.Survey_Block,
  //           `PLAN_SPATIAL_ID='${planSpatialId}'`,
  //           false,
  //           ["BLOCK_NO", "BLOCK_SPATIAL_ID"]
  //         ),
  //         returnGeometry: true,
  //         callbackResult: (res) => {
  //           this.setState({ blockNum: res.features }, callback);
  //         },
  //       });
  //     } else {
  //       if (callback && typeof callback == "function") {
  //         callback();
  //       }
  //     }
  //   }
  // };
  // onSubTypeChange = (e, callback) => {
  //   //this.onPlaneChange(this.state.planeval);
  //   if (
  //     (!callback || (callback && typeof callback == "object")) &&
  //     !this.loadLists
  //   ) {
  //     this.setState({
  //       subType_name: this.state.subDivType.filter((m) => m.code == e)?.[0]
  //         ?.name,
  //       subTypeval: e,
  //     });
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Subdivision,
  //         `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${this.planId}`,
  //         false,
  //         ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"]
  //       ),
  //       returnGeometry: true,
  //       callbackResult: (res) => {
  //         this.setState({ subDivNames: res.features });
  //       },
  //     });
  //   } else {
  //     if (e) {
  //       queryTask({
  //         ...querySetting(
  //           this.LayerID.Subdivision,
  //           `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${this.planId}`,
  //           false,
  //           ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"]
  //         ),
  //         returnGeometry: true,
  //         callbackResult: (res) => {
  //           this.setState({ subDivNames: res.features }, callback);
  //         },
  //       });
  //     } else {
  //       if (callback && typeof callback == "function") {
  //         callback();
  //       }
  //     }
  //   }

  //   // if (callback && typeof callback == "function") {
  //   //   callback();
  //   // }
  //   // this.onSubNameChange(this.state.subNameval);
  //   // this.DrawGraph();
  // };

  resetGraphics = () => {
    this.state["selectedLands"] = [];
    this.state["selectedLandsT"] = [];
    this.parcelData = {};
    this.DrawGraph();
  };
  // onSubNameChange = (value, callback) => {
  //   var selectedSubDivName = this.state.subDivNames.filter(
  //     (m) =>
  //       m.attributes.SUBDIVISION_SPATIAL_ID == value ||
  //       m.attributes.SUBDIVISION_DESCRIPTION == value
  //   )?.[0];
  //   //if (selectedSubDivName) {
  //   var e = selectedSubDivName?.attributes?.SUBDIVISION_SPATIAL_ID;
  //   if (
  //     (!callback || (callback && typeof callback == "object")) &&
  //     !this.loadLists
  //   ) {
  //     clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //     this.setState({
  //       subName_name: selectedSubDivName?.attributes?.SUBDIVISION_DESCRIPTION,
  //       subNameval: e,
  //       blockval: undefined,
  //       parcelval: undefined,
  //       parcelNum: [],
  //       parcelId: null,
  //     });
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Subdivision,
  //         `SUBDIVISION_SPATIAL_ID=${e}`,
  //         true,
  //         ["SUBDIVISION_SPATIAL_ID"]
  //       ),
  //       returnGeometry: true,
  //       callbackResult: (res) => {
  //         if (res) {
  //           this.pol = res.features[0];
  //           highlightFeature(res.features[0], this.map, {
  //             layerName: "SelectGraphicLayer",
  //             isZoom: true,
  //             isHiglightSymbol: true,
  //             highlighColor: [0, 0, 0, 0.25],
  //           });
  //         }
  //       },
  //     });
  //     this.getParcelsWithinBufferedArea(
  //       selectedSubDivName,
  //       `SUBDIVISION_SPATIAL_ID=${e}`
  //     ).then((res) => {
  //       this.setState({
  //         parcelSearch: null,
  //         parcelNum: res.features.map((e, i) => {
  //           return {
  //             ...e,
  //             i,
  //           };
  //         }),
  //       });
  //     });
  //     this.resetGraphics();
  //   } else {
  //     this.pol = selectedSubDivName;
  //     if (callback && typeof callback == "function") {
  //       callback();
  //     }
  //   }
  // };

  // onBlockChange = (e, callback) => {
  //   if (
  //     (!callback || (callback && typeof callback == "object")) &&
  //     !this.loadLists
  //   ) {
  //     clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //     this.setState({
  //       block_no: this.state.blockNum.filter(
  //         (m) => m.attributes.BLOCK_SPATIAL_ID == e
  //       )?.[0]?.attributes?.BLOCK_NO,
  //       blockval: e,
  //       parcelval: undefined,
  //       parcelId: null,
  //       parcelNum: [],
  //       // selectedLands: [],
  //       // selectedLandsT: [],
  //     });
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Survey_Block,
  //         `BLOCK_SPATIAL_ID=${e}`,
  //         true,
  //         ["BLOCK_SPATIAL_ID"]
  //       ),
  //       returnGeometry: true,
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
  //     this.getParcelsWithinBufferedArea(
  //       this.state.blockNum.filter(
  //         (m) => m.attributes.BLOCK_SPATIAL_ID == e
  //       )?.[0],
  //       `BLOCK_SPATIAL_ID=${e}`
  //     ).then((res) => {
  //       this.setState({
  //         parcelSearch: null,
  //         parcelNum: res.features.map((e, i) => {
  //           return {
  //             ...e,
  //             i,
  //           };
  //         }),
  //       });
  //     });
  //     this.resetGraphics();
  //   } else {
  //     this.pol = this.state.blockNum.filter(
  //       (m) => m.attributes.BLOCK_SPATIAL_ID == e
  //     )?.[0];
  //     if (callback && typeof callback == "function") {
  //       callback();
  //     }
  //   }
  // };

  // onLandParcelChange = (f, callback) => {
  //
  //   this.RolBackPol = this.pol;
  //   this.RolBackParcelNum = this.state.parcelNum;
  //   if (!this.state.selectedLands.length) {
  //     var e = this.state.parcelNum.filter((m) => m.i === f)?.[0]?.attributes
  //       ?.PARCEL_SPATIAL_ID;
  //     if (
  //       (!callback || (callback && typeof callback == "object")) &&
  //       !this.loadLists
  //     ) {
  //       this.setState({ parcelId: e, parcelval: f });
  //       this.getParcelsWithinBufferedArea(
  //         this.RolBackPol,
  //         `PARCEL_SPATIAL_ID='${e}'`
  //       ).then((res) => {
  //         this.selectedLandsT = [];
  //         highlightFeature(res.features[0], this.map, {
  //           layerName: "SelectGraphicLayer",
  //           strokeColor: [0, 0, 0],
  //           highlightWidth: 3,
  //           isHighlighPolygonBorder: true,
  //           isZoom: true,
  //           zoomFactor: 10,
  //         });
  //       });
  //     }
  //   } else {
  //     // clearGraphicFromLayer(this.map, "SelectGraphicLayer");
  //     if (f) {
  //       var prevParcelId = this.state.parcelId;
  //       var g = this.state.parcelNum.filter((m) => m.i == f)?.[0];
  //       this.state["parcelId"] = g?.attributes?.PARCEL_SPATIAL_ID;
  //       //this.setState({ parcelId: g.attributes.PARCEL_SPATIAL_ID });

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
  //   }

  //   if (callback && typeof callback == "function") {
  //     callback();
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
            municipilty_code:
              item.attributes.MUNICIPALITY_NAME_Code ||
              item.attributes.MUNICIPALITY_NAME?.code ||
              item.attributes.MUNICIPALITY_NAME,
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
      this.getParcelsWithinBufferedArea(
        feature,
        "PARCEL_PLAN_NO is not null",
        true
      ).then((res) => {
        getFeatureDomainName(res.features, this.LayerID.Landbase_Parcel).then(
          (r) => {
            res.features = r.map((e, i) => {
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
              return resolve(res);
              /*this.validation(feature, this.props).then(
                () => {
                  return resolve(res);
                },
                () => {
                  return reject();
                }
              );*/
            } else {
              return resolve(res);
            }
          }
        );
      });
      // intersectQueryTask({
      //   outFields: [
      //     "OBJECTID",
      //     "MUNICIPALITY_NAME",
      //     "PARCEL_AREA",
      //     "PARCEL_LAT_COORD",
      //     "PARCEL_LONG_COORD",
      //     "PARCEL_MAIN_LUSE",
      //     "PLAN_NO",
      //     "PARCEL_PLAN_NO",
      //     "USING_SYMBOL",
      //     "PARCEL_SPATIAL_ID",
      //   ],
      //   distance: 20,
      //   geometry: feature.geometry,
      //   url: mapUrl + "/" + this.LayerID.Landbase_Parcel,
      //   where: "PARCEL_PLAN_NO is not null",
      //   callbackResult: (res) => {
      //     getFeatureDomainName(res.features, this.LayerID.Landbase_Parcel).then(
      //       (r) => {
      //         res.features = res.features.map((e, i) => {
      //           return {
      //             ...e,
      //             i: uniqid(),
      //           };
      //         });

      //         if (
      //           [20, 21].indexOf(this.props?.currentModule?.record.app_id) ==
      //             -1 &&
      //           [2191].indexOf(
      //             this.props?.currentModule?.record?.workflow_id
      //           ) == -1
      //         ) {
      //           this.validation(feature, this.props).then(
      //             () => {
      //               return resolve(res);
      //             },
      //             () => {
      //               return reject();
      //             }
      //           );
      //         } else {
      //           return resolve(res);
      //         }
      //       }
      //     );
      //   },
      // });
      //}
    });
  };

  getParcelsWithinBufferedArea = (
    feature,
    where,
    isToIntersect = false,
    outFields,
    moreSettings = {}
  ) => {
    return new Promise((resolve, reject) => {
      if (isToIntersect) {
        intersectQueryTask({
          outFields: ["*"],
          distance:
            ([20, 21].indexOf(this.props?.currentModule?.record.app_id) == -1 &&
              20) ||
            50,
          geometry: new esri.geometry.Polygon(feature.geometry),
          url: mapUrl + "/" + this.LayerID.Landbase_Parcel,
          where: where,
          callbackResult: (res) => {
            getFeatureDomainName(
              res.features,
              this.LayerID.Landbase_Parcel
            ).then((r) => {
              res.features = r;
              return resolve(res);
            });
          },
        });
      } else {
        if (where.indexOf("PARCEL_SPATIAL_ID") < 0)
          this.parcelFilterWhere = where;

        queryTask({
          ...querySetting(
            this.LayerID.Landbase_Parcel,
            where,
            false,
            (!outFields && [
              "PARCEL_SPATIAL_ID",
              "PARCEL_PLAN_NO",
              "OBJECTID",
            ]) || [...outFields]
          ),
          returnGeometry: false,
          callbackResult: (res) => {
            return resolve(res);
          },
          ...moreSettings,
        });
      }
    });
  };

  // onSearch = async ( filterValue) => {

  //   if (!this.state.selectedLands.length && filterValue != "") {

  //     if (this.searchTimeOut) clearTimeout(this.searchTimeOut);

  //     this.searchTimeOut = setTimeout(async () => {

  //       let filterQuery = [];
  //       filterQuery.push(this.parcelFilterWhere);
  //       filterQuery.push("PARCEL_PLAN_NO like '" + filterValue + "%'");

  //       let filterWhere = filterQuery.join(" and ");
  //       queryTask({
  //         ...querySetting(this.LayerID.Landbase_Parcel, filterWhere, false,
  //           [
  //             "PARCEL_SPATIAL_ID",
  //             "PARCEL_PLAN_NO",
  //             "OBJECTID"
  //           ]),
  //         returnGeometry: false,
  //         callbackResult: (res) => {
  //           res.features = res.features.map((e, i) => {
  //             return {
  //               ...e,
  //               i: uniqid(),
  //             };
  //           });
  //           this.setState({
  //             parcelId: null,
  //             parcelNum: res.features,
  //           });
  //         }
  //       });

  //     }, 500);
  //   }
  // }

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
      clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
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

  mapLoaded = (map) => {
    this.map = map;
    this.props.setMap(map);

    if (
      this.props.input &&
      this.props.input.value &&
      this.props.input.value.parcels &&
      this.props.input.value.temp
    ) {
      highlightFeature(this.props.input.value.parcels, this.map, {
        layerName: "SelectGraphicLayer",
        noclear: true,
        isZoom: true,
        attr: { isParcel: true },
        isHighlighPolygonBorder: true,
        zoomFactor: 10,
      });

      if (!this.props?.input?.value?.mapGraphics?.length) {
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
            checkParcelAdjacents(this.props.input?.value?.parcels, false);
          }
        }, 500);
      }

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
        // lists: {
        //   firstParcels: [...this.state.parcelNum],
        //   subDivNames: [...this.state.subDivNames],
        //   MunicipalityNames: [...this.state.MunicipalityNames],
        //   subDivType: [...this.state.subDivType],
        //   PlanNum: [...this.state.PlanNum],
        //   blockNum: [...this.state.blockNum],
        // },
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
    this.setState({ mapLoaded: true });

    this.props.setCurrentMap(map);
    //this.props.setMapLayers(mapLayers);
    store.dispatch({ type: "Show_Loading_new", loading: false });
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

      axios
        .get(
          `${workFlowUrl}/Land/HasSurveyCheckRequest?spatialId=${this.state.parcelId}`
        )
        .then(({ data }) => {
          if (data.hasSurveyCheckRequest) {
            if (data.submissions[0].status == 1) {
              if (
                this.props.currentModule?.record?.request_no !=
                data.submissions[0].request_no
              ) {
                window.notifySystem(
                  "warning",
                  "يوجد معاملة تدقيق مكاني جارية على قطعة الأرض  برقم " +
                    convertToArabic(data.submissions[0].request_no)
                );
              } else {
                this.addParcelToWorkflow(false);
              }
            } else if (data.submissions[0].status == 2) {
              axios
                .get(
                  `${workFlowUrl}/Land/HasRIdRequest?spatialId=${this.state.parcelId}`
                )
                .then((res) => {
                  if (!res.data.hasRIdRequest) {
                    window.notifySystem(
                      "warning",
                      "يوجد معاملة تدقيق مكاني منتهية على قطعة الأرض  برقم " +
                        convertToArabic(data.submissions[0].request_no)
                    );
                  } else {
                    if (res.data.isRIdIssued) {
                      if (res.data.status == 2) this.addParcelToWorkflow(true);
                      else {
                        window.notifySystem(
                          "warning",
                          "برجاء مراجعة الدعم الفني يوجد معاملة نشطة بتطبيق " +
                            res.data.app_name +
                            " برقم " +
                            convertToArabic(res.data.request_no)
                        );
                      }
                    } else {
                      window.notifySystem(
                        "warning",
                        "برجاء مراجعة الدعم الفني يوجد طلب هوية عقارية نشط بتطبيق " +
                          res.data.app_name +
                          " برقم " +
                          convertToArabic(res.data.request_no)
                      );
                    }
                  }
                });
            }
          } else {
            this.addParcelToWorkflow(false);
          }
        });
    }
  };

  addParcelToWorkflow = (isTadkeekBefore) => {
    queryTask({
      ...querySetting(
        this.LayerID.Landbase_Parcel,
        `PARCEL_SPATIAL_ID =${this.state.parcelId}`,
        true,
        ["*"]
      ),
      callbackResult: (res) => {
        //set it for test
        if (isTadkeekBefore) {
          res.features[0].attributes.isTadkeekBefore = true;
        } else {
          delete res.features[0].attributes.isTadkeekBefore;
        }
        ////////////////////

        /*if (res.features[0].attributes.REALESTATEID) {
          window.notifySystem(
            "warning",
            "عذرًا ، تم تدقيق الرفع المساحي من قبل على هذة الأرض"
          );
        } else*/
        /*if (res.features[0].attributes.SUBDIVISION_TYPE
          &&
          !(surveyCheck_Exceptions.indexOf(res.features[0].attributes.PARCEL_SPATIAL_ID) > -1)) {

          window.notifySystem(
            "warning",
            "عذرًا ، لا يمكن تقديم طلب تدقيق مكانى على هذة الأرض حاليًا"
          );

        } else {*/
        if (this.state.selectedLands && this.state.selectedLands.length == 0) {
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
                      parcelNum: res.features,
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
          getFeatureDomainName(res.features, this.LayerID.Landbase_Parcel).then(
            (r) => {
              this.addParcelToSelect(r[0]).then(
                (res) => {
                  this.setToStore(r);
                  this.setState({
                    parcelId: null,
                    parcelNum: res.features,
                  });
                  this.selectedLandsT.push(res);
                  this.DrawGraph();
                },
                () => {
                  this.state.selectedLands.pop();
                  this.setToStore();
                }
              );
            }
          );
        }
        //}
      },
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
      parcelData: { ...this.state.parcelData },
      selectedMoamlaType: this.state.selectedMoamlaType,
      selected_Req_type: this.state.selected_Req_type,
      temp: {
        //map: this.map,
        // ...value,
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
      domainLists: { ...this.state.domainLists },
      // lists: {
      //   firstParcels: [...this.state.parcelNum],
      //   subDivNames: [...this.state.subDivNames],
      //   MunicipalityNames: [...this.state.MunicipalityNames],
      //   subDivType: [...this.state.subDivType],
      //   PlanNum: [...this.state.PlanNum],
      //   blockNum: [...this.state.blockNum],
      // },
      electric_room_area: this.state.electric_room_area,
      have_electric_room: this.state.have_electric_room,
      electric_room_place: this.state.electric_room_place,
    };

    if (r) {
      if (r[0].attributes.isTadkeekBefore) {
        r[0].attributes.PARCEL_AREA = (+r[0].attributes.PARCEL_AREA).toFixed(2);
      } else {
        r[0].attributes.PARCEL_AREA = "";
      }

      this.state.selectedLands.push({
        geometry: r[0].geometry,
        attributes: r[0].attributes,
        id: this.state.parcelId,
      });

      map_object(this.state.selectedLands);

      this["edit_PARCEL_AREA" + (this.state.selectedLands.length - 1)] =
        r[0].attributes.PARCEL_AREA;
      this["edit_PARCEL_BLOCK_NO" + (this.state.selectedLands.length - 1)] =
        r[0].attributes.PARCEL_BLOCK_NO;
      this["edit_DISTRICT_NAME" + (this.state.selectedLands.length - 1)] =
        r[0].attributes.DISTRICT_NAME;
      this["edit_SUBDIVISION_TYPE" + (this.state.selectedLands.length - 1)] =
        r[0].attributes.SUBDIVISION_TYPE;
      this[
        "edit_SUBDIVISION_DESCRIPTION" + (this.state.selectedLands.length - 1)
      ] = r[0].attributes.SUBDIVISION_DESCRIPTION;
    }

    this.checkUnitNumberAvailability(
      [...this.state.selectedLands],
      this.state.munval
    );
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

  checkUnitNumberAvailability = (selectedLands, munval) => {
    if (
      [10501, 10506, 10513].indexOf(munval) != -1 &&
      selectedLands.find(
        (parcel) => parcel.attributes.USING_SYMBOL_Code == "س1-أ"
      ) != undefined &&
      [1].indexOf(this.props?.currentModule?.record.app_id) != -1
    ) {
      this.parcel_fields_headers = (!this.parcel_fields_headers.find(
        (f) => f == "عدد الوحدات"
      ) && [...this.parcel_fields_headers, "عدد الوحدات"]) || [
        ...this.parcel_fields_headers,
      ];
      this.parcel_fields = (!this.parcel_fields.find(
        (f) => f.name == "UNITS_NUMBER"
      ) && [
        ...this.parcel_fields,
        {
          name: "UNITS_NUMBER",
          editable: false,
          dependsOn: "USING_SYMBOL_Code",
          value: "س1-أ",
        },
      ]) || [...this.parcel_fields];
    }
  };

  LandHoverOn = (f) => {
    if (
      !this.state.selectedLands.length &&
      [1].indexOf(this.props?.currentModule?.record.app_id) != -1
    ) {
      return;
    }
    var fitleredGraphics = this.map
      .getLayer("ZoomGraphicLayer")
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

    clearGraphicFromLayer(this.map, "ZoomGraphicLayer");
    clearGraphicFromLayer(this.map, "SelectGraphicLayer");
    /*fitleredGraphics.forEach((graphic) => {
      this.map.getLayer("SelectGraphicLayer").add(graphic);
    });*/

    queryTask({
      ...querySetting(
        this.LayerID.Landbase_Parcel,
        "PARCEL_SPATIAL_ID = " + f.attributes.PARCEL_SPATIAL_ID,
        false,
        ["OBJECTID"]
      ),
      returnGeometry: true,
      callbackResult: (res) => {
        f.geometry = res?.features?.[0]?.geometry;
        highlightFeature(res.features, this.map, {
          layerName: "ZoomGraphicLayer",
          noclear: false,
          isZoom: true,
          isHighlighPolygonBorder: true,
          zoomFactor: 10,
          attr: true,
        });
      },
    });
  };

  LandHoverOff = (f) => {
    if (
      !this.state.selectedLands?.length &&
      [1].indexOf(this.props?.currentModule?.record.app_id) != -1
    ) {
      return;
    }
    if (f && f?.attributes?.PARCEL_SPATIAL_ID != this.state?.parcelId) {
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
    if (name.indexOf("SHATFA_") > -1) {
      this.state.survayParcelCutter[0][name] = this["edit_" + name + i];
      this.setState({
        [name + "_isEdit_" + i]: false,
        survayParcelCutter: this.state.survayParcelCutter,
      });

      // this.state.landsData.survayParcelCutter = [
      //   ...this.state.survayParcelCutter,
      // ];
      // this.props.input.onChange({ ...this.state.landsData });
      this.UpdateSubmissionDataObject();

      console.log(this.props.input);
    } else {
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
  }

  openPopup = (scope) => {
    var fields = this.parcelDataFields;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...scope.state["parcelData"] },
          ok(values) {
            scope.state["parcelData"] = values;
            scope.UpdateSubmissionDataObject();
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  openParcelElectricInfoPopup = (scope, index) => {
    var fields = this.parcelElectricFields;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...scope.state.selectedLands[index].parcelElectric },
          ok(values) {
            scope.state.selectedLands[index].parcelElectric = values;
            scope.UpdateSubmissionDataObject();
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  openParcelShatfaInfoPopup = (scope, index) => {
    var fields = this.parcelShatfaFields;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...scope.state.selectedLands[index].parcelShatfa },
          ok(values) {
            scope.state.selectedLands[index].parcelShatfa = values;
            scope.UpdateSubmissionDataObject();
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  openParcelDirectionInfoPopup = (scope, index) => {
    var fields = this.parcelDataFields;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...scope.state.selectedLands[index].parcelData },
          ok(values) {
            scope.state.selectedLands[index].parcelData = values;
            scope.UpdateSubmissionDataObject();
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  myChangeHandler = (name, i, e, event) => {
    this["edit_" + name + i] = event.target.value;
    if (e.attributes) {
      e.attributes[name] = event.target.value;
    } else {
      e[name] = event.target.value;
    }
    //e.attributes['PARCEL_AREA'] = event.target.value;
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  selectOnchange = (name, i, e, value) => {
    this["edit_" + name + i] = value;
    e.attributes[name] = value;
    //e.attributes['PARCEL_AREA'] = event.target.value;
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  showEditBtn = (name, value, attributes) => {
    if (attributes.isTadkeekBefore) {
      return null;
    } else {
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
            "SHATFA_NORTH_EAST_DIRECTION",
            "SHATFA_NORTH_WEST_DIRECTION",
            "SHATFA_SOUTH_EAST_DIRECTION",
            "SHATFA_SOUTH_WEST_DIRECTION",
          ].indexOf(name) > -1
        );
      }
    }
  };

  onElectricInputChange = (stateName, evt) => {
    this.setState({
      [stateName]:
        evt.target.type == "checkbox" ? evt.target.checked : evt.target.value,
    });

    this.state.landsData[stateName] =
      evt.target.type == "checkbox" ? evt.target.checked : evt.target.value;
    this.props.input.onChange({ ...this.state.landsData });
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
      Req_types,
      selectedRequestType,
      boundariesBtnIsVisible,
      selectedMoamlaType,
      survayParcelCutter,
    } = this.state;

    const { t, fullMapWidth } = this.props;

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
          >
            {(mapLoaded && !this.props.isView && (
              <div
                style={{
                  direction: "ltr",
                  width: "95%",
                }}
              >
                {([22, 23].indexOf(this.props.currentModule.id) != -1 ||
                  [1928].indexOf(
                    this.props?.currentModule?.record?.workflow_id
                  ) != -1) &&
                  [2190, 2191].indexOf(
                    this.props?.currentModule?.record?.workflow_id
                  ) == -1 && (
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      autoFocus
                      onChange={this.parcelQueryTask.bind(this)}
                      showSearch
                      value={this.state.selectedRequestType}
                      placeholder="اختر نوع المعاملة"
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
                      {requestTypes.map((e) => (
                        <Option key={e.code} value={e.code}>
                          {e.name}{" "}
                        </Option>
                      ))}
                    </Select>
                  )}

                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  autoFocus
                  onChange={this.moamlaTypeChange.bind(this)}
                  showSearch
                  value={this.state.selectedMoamlaType}
                  placeholder="اختر الغرض من المعاملة"
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
                  {requestTypes.map((e) => (
                    <Option key={e.code} value={e.code}>
                      {e.name}{" "}
                    </Option>
                  ))}
                </Select>

                {this.state.selectedMoamlaType == 1 && (
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    autoFocus
                    onChange={this.farzRequestType.bind(this)}
                    showSearch
                    value={this.state.selected_Req_type}
                    placeholder="اختر نوع الفرز"
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
                    {Req_types.map((e) => (
                      <Option key={e.code} value={e.code}>
                        {e.name}{" "}
                      </Option>
                    ))}
                  </Select>
                )}

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
                {false && (
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
                )}
                {false && (
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
                          option.props.children?.indexOf(
                            convertToArabic(input)
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
                )}
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
                        option.props.children?.indexOf(
                          convertToArabic(input)
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
                      <Option key={i} value={e.attributes.BLOCK_SPATIAL_ID}>
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
                                    tt.attributes.PARCEL_SPATIAL_ID ==
                                    e.attributes.PARCEL_SPATIAL_ID
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
                          noclear: true,
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
                  disabled={planeval == undefined}
                  showSearch
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
                                  tt.attributes.PARCEL_SPATIAL_ID ==
                                  e.attributes.PARCEL_SPATIAL_ID
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
                            onMouseEnter={this.LandHoverOn.bind(this, e)}
                            //onMouseLeave={this.LandHoverOff.bind(this, e)}
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
                  disabled={!this.state.parcelId || parcelBtnDisabled}
                  onClick={this.OnParcelSelect}
                >
                  إضافة الأرض
                </Button>
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
            {selectedLands && selectedLands.length > 0 && (
              <div>
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
                        <th>خيارات الأرض</th>
                        {selectedLands.length > 1 && <th>خيارات المعاملة</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedLands.map((e, i) => {
                        return (
                          <tr key={i}>
                            {this.parcel_fields.map((field, k) => {
                              return (
                                ((!field.dependsOn ||
                                  (field.dependsOn &&
                                    e.attributes[field.dependsOn] ==
                                      field.value)) && (
                                  <td key={k}>
                                    <div>
                                      {field.editable ? (
                                        !this.state[
                                          field.name + "_isEdit_" + i
                                        ] ? (
                                          <span>
                                            <span>
                                              {localizeNumber(
                                                e.attributes[field.name] || ""
                                              )}
                                            </span>
                                            {this.showEditBtn(
                                              field.name,
                                              e.attributes[field.name],
                                              e.attributes
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
                                            {field.type != "select" && (
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
                                                value={e.attributes[field.name]}
                                                onChange={this.selectOnchange.bind(
                                                  this,
                                                  field.name,
                                                  i,
                                                  e
                                                )}
                                                placeholder="نوع التقسيم"
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
                                                {field?.options?.map((e, i) => (
                                                  <Option
                                                    key={i}
                                                    value={e.name}
                                                  >
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
                                )) || <td></td>
                              );
                            })}

                            {!this.props.isView ? (
                              <td>
                                {boundariesBtnIsVisible &&
                                  !selectedLands[0].attributes
                                    .isTadkeekBefore && (
                                    <>
                                      <button
                                        className="btn follow"
                                        style={{ margin: "0px 5px" }}
                                        onClick={() => {
                                          this.openParcelDirectionInfoPopup(
                                            this,
                                            i
                                          );
                                        }}
                                      >
                                        أبعاد الأرض تبعا للصك
                                      </button>
                                      <button
                                        className="btn follow"
                                        style={{ margin: "0px 5px" }}
                                        onClick={() => {
                                          this.openParcelShatfaInfoPopup(
                                            this,
                                            i
                                          );
                                        }}
                                      >
                                        الشطفات
                                      </button>
                                      <button
                                        className="btn follow"
                                        style={{ margin: "0px 5px" }}
                                        onClick={() => {
                                          this.openParcelElectricInfoPopup(
                                            this,
                                            i
                                          );
                                        }}
                                      >
                                        غرفة الكهرباء
                                      </button>
                                    </>
                                  )}
                              </td>
                            ) : (
                              <></>
                            )}

                            {!this.props.isView &&
                            i === selectedLands.length - 1 ? (
                              <td>
                                {/*boundariesBtnIsVisible &&
                                  selectedLands.length > 1 && (
                                    <button
                                      className="btn follow"
                                      style={{ margin: "0px 5px" }}
                                      onClick={() => {
                                        this.openPopup(this);
                                      }}
                                    >
                                      حدود و أبعاد المعاملة
                                    </button>
                                    )*/}
                                <button
                                  className="btn btn-danger"
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
                {/*<>
                  <div>
                    <div style={{ marginTop: "20px" }}>
                      <h1 className="titleSelectedParcel">الشطفات</h1>

                      <table
                        className="table table-bordered"
                        style={{ marginTop: "1%" }}
                      >
                        <thead>
                          <tr>
                            {this.parcel_fields_headers_shatfa.map(
                              (field_header, k) => {
                                return <th>{field_header}</th>;
                              }
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {survayParcelCutter &&
                            survayParcelCutter.map((e, i) => {
                              return (
                                <tr key={i}>
                                  {this.parcel_fields_shatfa.map((field, k) => {
                                    return (
                                      <td key={k}>
                                        <div>
                                          {field.editable ? (
                                            !this.state[
                                              field.name + "_isEdit_" + i
                                            ] ? (
                                              <span>
                                                <span>{e[field.name] || ""}</span>
                                                {this.showEditBtn(
                                                  field.name,
                                                  e[field.name]
                                                ) && (
                                                  <span>
                                                    <button
                                                      className="btn"
                                                      style={{
                                                        marginRight: e[field.name]
                                                          ? "20px"
                                                          : "0px",
                                                      }}
                                                      onClick={(event) => {
                                                        this.enableEdit(
                                                          field.name,
                                                          i
                                                        );
                                                      }}
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
                                                  name={`${field.name + i}`}
                                                  value={e[field.name]}
                                                  onChange={(event) => {
                                                    this.myChangeHandler(
                                                      field.name,
                                                      i,
                                                      e,
                                                      event
                                                    );
                                                  }}
                                                />
                                                <button
                                                  className="btn"
                                                  style={{
                                                    marginRight: "20px",
                                                  }}
                                                  onClick={(event) => {
                                                    this.saveEdit(
                                                      0,
                                                      field.name,
                                                      i
                                                    );
                                                  }}
                                                >
                                                  <i className="fa fa-floppy-o"></i>
                                                </button>
                                              </span>
                                            )
                                          ) : (
                                            <span>
                                              <span>{e[field.name] || ""}</span>
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <div>
                      <input
                        type="checkbox"
                        style={{
                          width: "20px",
                          height: "20px",
                          margin: "3px",
                        }}
                        checked={this.state["have_electric_room"]}
                        onChange={(evt) => {
                          this.state["electric_room_area"] = "";
                          this.onElectricInputChange("have_electric_room", evt);
                        }}
                      />
                      تشمل غرفة الكهرباء
                    </div>
                    {this.state["have_electric_room"] && (
                      <div>
                        <input
                          className="form-control"
                          type="number"
                          step="any"
                          name="electric_room_area"
                          value={this.state["electric_room_area"]}
                          placeholder="مساحة غرفة الكهرباء"
                          onChange={this.onElectricInputChange.bind(
                            this,
                            "electric_room_area"
                          )}
                        />
                      </div>
                    )}
                    {this.state["have_electric_room"] && (
                      <div>
                        <input
                          className="form-control"
                          type="text"
                          name="electric_room_place"
                          value={this.state["electric_room_place"]}
                          placeholder="مكان غرفة الكهرباء"
                          onChange={this.onElectricInputChange.bind(
                            this,
                            "electric_room_place"
                          )}
                        />
                      </div>
                    )}
                  </div>
                          </>*/}
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
)(withTranslation("labels")(SurveyIdentifyComponnent));
