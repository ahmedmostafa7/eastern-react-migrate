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
import { StickyContainer, Sticky } from "react-sticky";

import { geometryServiceUrl, mapUrl } from "../mapviewer/config/map";
import { Select, Button, Form, message } from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import MapBtnsComponent from "../MapBtnsComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
import { connect } from "react-redux";
import { querySetting, selectDis } from "./Helpers";
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

class updateContractIdentifyComponnent extends Component {
  constructor(props) {
    super(props);
    this.PlanNum = [];
    this.planId = null;
    this.parcelTs = [];

    this.selectionMode = false;

    this.parcel_fields_headers = [
      "رقم الأرض",
      "المساحة (م2)",
      "رقم البلوك",
      "رقم المخطط",
      "الحي",
      "نوع التقسيم",
      "اسم التقسيم",
      "رمز الإستخدام",
      // "وصف الإستخدام",
    ];
    this.units = [
      { value: "متر", label: "متر" },
      { value: "قدم", label: "قدم" },
      { value: "مغرس", label: "مغرس" },
    ];
    let extInitialValue = "متر";

    this.parcel_fields = [
      { name: "PARCEL_PLAN_NO", editable: false },
      {
        name: "PARCEL_AREA",
        editable: true,
        extName: "PARCEL_AREA_UNIT_NAME",
        extData: [
          { value: "متر مربع", label: "متر مربع" },
          { value: "قدم", label: "قدم" },
          { value: "مغرس", label: "مغرس" },
        ],
        extInitialValue: "متر مربع",
      },
      { name: "PARCEL_BLOCK_NO", editable: true, type: "text" },
      { name: "PLAN_NO", editable: true, type: "text" },
      { name: "DISTRICT_NAME", editable: true, type: "text" },
      { name: "SUBDIVISION_TYPE", editable: false },
      { name: "SUBDIVISION_DESCRIPTION", editable: false },
      { name: "USING_SYMBOL", editable: false },
    ];

    let callBackSelect = (scope, controlName, val) => {
      let {
        input: { onChange, value },
      } = this.props;
      //delete value[controlName];
      let controlValue = { [controlName]: val, ...value };
      //this.state[controlName] = val;
      onChange(controlValue);
      this.setState(controlValue);
    };
    this.parcelDataFields = {
      parcel_type: {
        label: "عبارة عن",
        placeholder: "من فضلك اخل نوع الأرض",
        type: "input",
        field: "select",
        className: "select_flex",
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
        field: "inputNumber",
        type: "input",
        name: "north_length",
        hasAU: true,
        value_key: "value",
        label_key: "value",
        data: [...this.units],
        //onClick: callBackSelect,
        required: true,
        extInitialValue,
      },
      north_desc: {
        label: "وصف الحد الشمالي",
        placeholder: "من فضلك ادخل وصف الحد الشمالي",
        field: "text",
        type: "input",
        name: "north_desc",
        maxLength: 200,
        required: true,
      },
      south_length: {
        label: "طول الحد الجنوبي (م)",
        placeholder: "من فضلك ادخل طول الحد الجنوبي (م)",
        field: "inputNumber",
        type: "input",
        name: "south_length",
        required: true,
        hasAU: true,
        value_key: "value",
        label_key: "value",
        data: [...this.units],
        //onClick: callBackSelect,
        extInitialValue,
      },
      south_desc: {
        label: "وصف الحد الجنوبي",
        placeholder: "من فضلك ادخل وصف الحد الجنوبي",
        field: "text",
        type: "input",
        name: "south_desc",
        maxLength: 200,
        required: true,
      },
      east_length: {
        label: "طول الحد الشرقي (م)",
        placeholder: "من فضلك ادخل طول الحد الشرقي (م)",
        field: "inputNumber",
        type: "input",
        name: "east_length",
        required: true,
        hasAU: true,
        value_key: "value",
        label_key: "value",
        data: [...this.units],
        //onClick: callBackSelect,
        extInitialValue,
      },
      east_desc: {
        label: "وصف الحد الشرقي",
        placeholder: "من فضلك ادخل وصف الحد الشرقي",
        field: "text",
        type: "input",
        name: "east_desc",
        maxLength: 200,
        required: true,
      },
      west_length: {
        label: "طول الحد الغربي (م)",
        placeholder: "من فضلك ادخل طول الحد الغربي (م)",
        field: "inputNumber",
        type: "input",
        name: "west_length",
        required: true,
        hasAU: true,
        value_key: "value",
        label_key: "value",
        data: [...this.units],
        //onClick: callBackSelect,
        extInitialValue,
      },
      west_desc: {
        label: "وصف الحد الغربي",
        placeholder: "من فضلك ادخل وصف الحد الغربي",
        field: "text",
        type: "input",
        name: "west_desc",
        maxLength: 200,
        required: true,
      },
    };

    map_object(props.input && props.input.value.parcels);
    this.selectedLandsT =
      (props?.input?.value?.temp?.parcelDis && [
        { features: props?.input?.value?.temp?.parcelDis },
      ]) ||
      [];
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
          props.input.value.temp.parcel) ||
        undefined,
      conditions: (props.input && props.input.value.conditions) || undefined,
      planSersh: null,
      parcelNum: props?.input?.value?.temp?.parcelDis || [],
      parcelNumS: [],
      blockNum: [],
      subDivNames: [],
      subDivType: [],
      MunicipalityNames: [],
      PlanNum: [],
      parcelId: null,
      mapExtend: null,
      parcelSearch: null,
      poly: null,
      //parcelSideLengths: [],
      //parcelData: props.input.value.parcelData || {},
      landsData: {},
    };

    this.isloaded = true;
  }
  LayerID = [];

  componentDidMount() {
    window.filterUrl = mapUrl;
    getInfo().then((res) => {
      this.LayerID = res;
      esriRequest(mapUrl + "/" + this.LayerID.Municipality_Boundary).then(
        (response) => {
          let muns =
            [2088].indexOf(this.props.currentModule.record.workflow_id) == -1
              ? response.types[0].domains.MUNICIPALITY_NAME.codedValues.filter(
                  (codeValue) =>
                    (this.props.currentModule.record.workflow_id == 2128 &&
                      codeValue.code == 10506) ||
                    (this.props.currentModule.record.workflow_id == 2241 &&
                      codeValue.code == 10513) ||
                    ([2261, 2262, 2263].indexOf(
                      this.props.currentModule.record.workflow_id
                    ) != -1 &&
                      codeValue.code == 10501) ||
                    this.props.currentModule.record.workflow_id == 2208
                )
              : response.types[0].domains.MUNICIPALITY_NAME.codedValues.filter(
                  (codeValue) => {
                    if ([10506].indexOf(codeValue.code) == -1) {
                      // 10501,10513,
                      return codeValue;
                    }
                  }
                );

          this.setState(
            {
              MunicipalityNames: muns,
              munval: (muns.length == 1 && muns[0].code) || this.state.munval,
            },
            () => {
              if (this.state.munval) {
                this.onMunChange(this.state.munval, () => {
                  this.onPlaneChange(this.state.planeval, () => {
                    this.onSubTypeChange(this.state.subTypeval, () => {
                      this.onSubNameChange(this.state.subNameval, () => {
                        this.onBlockChange(this.state.blockval, () => {
                          this.onLandParcelChange(
                            this.state.parcelval,
                            () => {}
                          );
                        });
                      });
                    });
                  });
                });
              }
            }
          );

          if (muns.length == 1 && muns[0].code) {
            setTimeout(() => {
              if (!this.state.selectedLands?.length) {
                this.onMunChange(muns[0].code);
              }
            }, 1000);
          }
        }
      );
      esriRequest(mapUrl + "/" + this.LayerID.Subdivision).then((response) => {
        this.setState({ subDivType: response.fields[7].domain.codedValues });
      });
    });

    this.isloaded = false;
  }

  onMunChange = (e, callback) => {
    //
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    this.planId = null;
    if (
      (!callback || (callback && typeof callback == "object")) &&
      !this.loadLists
    ) {
      this.setState({
        munval: e,
        planeval: undefined,
        subTypeval: undefined,
        subNameval: undefined,
        blockval: undefined,
        parcelval: undefined,
        selectedLands: [],
        selectedLandsT: [],
        PlanNum: [],
        blockNum: [],
        subDivNames: [],
        //subDivType: [],
        parcelId: null,
        parcelNum: [],
        //parcelData: {},
      });

      queryTask({
        ...querySetting(
          ([2261, 2262, 2263].indexOf(
            this.props.currentModule.record.workflow_id
          ) == -1 &&
            this.LayerID.Municipality_Boundary) ||
            this.LayerID.District_Boundary,
          `MUNICIPALITY_NAME='${e}'` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          true,
          ([2261, 2262, 2263].indexOf(
            this.props.currentModule.record.workflow_id
          ) == -1 && ["MUNICIPALITY_NAME"]) || [
            "MUNICIPALITY_NAME",
            "SUB_MUNICIPALITY_NAME",
          ]
        ),
        callbackResult: (res) => {
          this.pol = res.features[0];
          highlightFeature(res.features[0], this.map, {
            layerName: "SelectGraphicLayer",
            isZoom: true,
            isHiglightSymbol: true,
            highlighColor: [0, 0, 0, 0.25],
          });
        },
      });
      queryTask({
        ...querySetting(
          this.LayerID.Plan_Data,
          `MUNICIPALITY_NAME='${e}'` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          false,
          ["PLAN_SPATIAL_ID", "PLAN_NO", "SUB_MUNICIPALITY_NAME"]
        ),
        callbackResult: (res) => {
          this.setState({
            PlanNum: res.features.map((e, i) => {
              return {
                ...e,
                i: uniqid(),
              };
            }),
          });
        },
      });

      queryTask({
        ...querySetting(
          this.LayerID.Landbase_Parcel,
          `MUNICIPALITY_NAME='${e}'` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          false,
          ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO", "SUB_MUNICIPALITY_NAME"]
        ),
        callbackResult: (res) => {
          this.setState({
            parcelSearch: null,
            parcelNum: res.features.map((e, i) => {
              return {
                ...e,
                i,
              };
            }),
          });
        },
      });
      this.resetGraphics();
    } else {
      if (e) {
        queryTask({
          ...querySetting(
            ([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) == -1 &&
              this.LayerID.Municipality_Boundary) ||
              this.LayerID.District_Boundary,
            `MUNICIPALITY_NAME='${e}'` +
              (([2261, 2262, 2263].indexOf(
                this.props.currentModule.record.workflow_id
              ) != -1 &&
                ` AND SUB_MUNICIPALITY_NAME = '${
                  (this.props.currentModule.record.workflow_id == 2261 &&
                    1050103) ||
                  (this.props.currentModule.record.workflow_id == 2262 &&
                    1050101) ||
                  (this.props.currentModule.record.workflow_id == 2263 &&
                    1050102)
                }'`) ||
                ""),
            true,
            ([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) == -1 && ["MUNICIPALITY_NAME"]) || [
              "MUNICIPALITY_NAME",
              "SUB_MUNICIPALITY_NAME",
            ]
          ),
          callbackResult: (res) => {
            this.pol = res.features[0];
            queryTask({
              ...querySetting(
                this.LayerID.Plan_Data,
                `MUNICIPALITY_NAME='${e}'` +
                  (([2261, 2262, 2263].indexOf(
                    this.props.currentModule.record.workflow_id
                  ) != -1 &&
                    ` AND SUB_MUNICIPALITY_NAME = '${
                      (this.props.currentModule.record.workflow_id == 2261 &&
                        1050103) ||
                      (this.props.currentModule.record.workflow_id == 2262 &&
                        1050101) ||
                      (this.props.currentModule.record.workflow_id == 2263 &&
                        1050102)
                    }'`) ||
                    ""),
                false,
                ["PLAN_SPATIAL_ID", "PLAN_NO", "SUB_MUNICIPALITY_NAME"]
              ),
              callbackResult: (res) => {
                this.setState(
                  {
                    PlanNum: res.features.map((e, i) => {
                      return {
                        ...e,
                        i: uniqid(),
                      };
                    }),
                  },
                  callback
                );
              },
            });
          },
        });
      } else if (callback && typeof callback == "function") {
        callback();
      }
    }
  };

  resetFields = () => {
    this.props.onChange([]);
    this.setState({ selectedLands: [], selectedLandsT: [] });
  };

  onPlaneChange = (f, callback) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    clearGraphicFromLayer(this.map, "SelectGraphicLayer");

    var planSpatialId = this.state.PlanNum.filter(
      (m) => m.i == f || m.attributes.PLAN_NO == f
    )?.[0]?.attributes?.PLAN_SPATIAL_ID;
    this.planId = planSpatialId;
    if (
      (!callback || (callback && typeof callback == "object")) &&
      !this.loadLists
    ) {
      this.setState({
        plan_no: this.state.PlanNum.filter(
          (m) => m.i == f || m.attributes.PLAN_NO == f
        )?.[0]?.attributes?.PLAN_NO,
        planeval: f,
        subTypeval: undefined,
        subNameval: undefined,
        blockval: undefined,
        parcelval: undefined,
        blockNum: [],
        subDivNames: [],
        //subDivType: [],
        parcelId: null,
        parcelNum: [],
        //parcelData: {},
      });
      queryTask({
        ...querySetting(
          this.LayerID.Plan_Data,
          `PLAN_SPATIAL_ID='${planSpatialId}'` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          true,
          //["MUNICIPALITY_NAME"]
          [
            (this.state.munval != 10501 && "MUNICIPALITY_NAME") ||
              "SUB_MUNICIPALITY_NAME",
          ]
        ),
        callbackResult: (res) => {
          this.pol = res.features[0];
          highlightFeature(res.features[0], this.map, {
            layerName: "SelectGraphicLayer",
            isZoom: true,
            isHiglightSymbol: true,
            highlighColor: [0, 0, 0, 0.25],
          });
          this.planId = planSpatialId;
        },
      });
      queryTask({
        ...querySetting(
          this.LayerID.Survey_Block,
          `PLAN_SPATIAL_ID='${planSpatialId}'` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          false,
          ["BLOCK_NO", "BLOCK_SPATIAL_ID", "SUB_MUNICIPALITY_NAME"]
        ),
        callbackResult: (res) => {
          this.setState({ blockNum: res.features });
        },
      });
      queryTask({
        ...querySetting(
          this.LayerID.Landbase_Parcel,
          `PLAN_SPATIAL_ID='${planSpatialId}'` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          false,
          ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO", "SUB_MUNICIPALITY_NAME"]
        ),
        callbackResult: (res) => {
          this.setState({
            parcelSearch: null,
            parcelNum: res.features.map((e, i) => {
              return {
                ...e,
                i,
              };
            }),
          });
        },
      });
      this.resetGraphics();
    } else {
      if (f) {
        this.pol = this.state.PlanNum.filter(
          (m) => m.i == f || m.attributes.PLAN_NO == f
        )?.[0];
        queryTask({
          ...querySetting(
            this.LayerID.Survey_Block,
            `PLAN_SPATIAL_ID='${planSpatialId}'` +
              (([2261, 2262, 2263].indexOf(
                this.props.currentModule.record.workflow_id
              ) != -1 &&
                ` AND SUB_MUNICIPALITY_NAME = '${
                  (this.props.currentModule.record.workflow_id == 2261 &&
                    1050103) ||
                  (this.props.currentModule.record.workflow_id == 2262 &&
                    1050101) ||
                  (this.props.currentModule.record.workflow_id == 2263 &&
                    1050102)
                }'`) ||
                ""),
            false,
            ["BLOCK_NO", "BLOCK_SPATIAL_ID", "SUB_MUNICIPALITY_NAME"]
          ),
          callbackResult: (res) => {
            this.setState({ blockNum: res.features }, callback);
          },
        });
      } else if (callback && typeof callback == "function") {
        callback();
      }
    }
  };

  resetGraphics = () => {
    this.state["selectedLands"] = [];
    this.state["selectedLandsT"] = [];
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
  onSubTypeChange = (e, callback) => {
    //this.onPlaneChange(this.state.planeval);

    if (
      (!callback || (callback && typeof callback == "object")) &&
      !this.loadLists
    ) {
      this.setState({
        subType_name: this.state.subDivType.filter((m) => m.code == e)[0].name,
        subTypeval: e,
      });
      queryTask({
        ...querySetting(
          this.LayerID.Subdivision,
          `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${this.planId}` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          false,
          [
            "SUBDIVISION_DESCRIPTION",
            "SUBDIVISION_SPATIAL_ID",
            "SUB_MUNICIPALITY_NAME",
          ]
        ),
        callbackResult: (res) => {
          this.setState({ subDivNames: res.features });
        },
      });
    } else {
      if (e) {
        queryTask({
          ...querySetting(
            this.LayerID.Subdivision,
            `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${this.planId}` +
              (([2261, 2262, 2263].indexOf(
                this.props.currentModule.record.workflow_id
              ) != -1 &&
                ` AND SUB_MUNICIPALITY_NAME = '${
                  (this.props.currentModule.record.workflow_id == 2261 &&
                    1050103) ||
                  (this.props.currentModule.record.workflow_id == 2262 &&
                    1050101) ||
                  (this.props.currentModule.record.workflow_id == 2263 &&
                    1050102)
                }'`) ||
                ""),
            false,
            [
              "SUBDIVISION_DESCRIPTION",
              "SUBDIVISION_SPATIAL_ID",
              "SUB_MUNICIPALITY_NAME",
            ]
          ),
          callbackResult: (res) => {
            this.setState({ subDivNames: res.features }, callback);
          },
        });
      } else if (callback && typeof callback == "function") {
        callback();
      }
    }
  };

  onSubNameChange = (e, callback) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    var selectedSubDivName = this.state.subDivNames.filter(
      (m) =>
        m.attributes.SUBDIVISION_SPATIAL_ID == e ||
        m.attributes.SUBDIVISION_DESCRIPTION == e
    )?.[0];
    if (
      (!callback || (callback && typeof callback == "object")) &&
      !this.loadLists
    ) {
      this.setState({
        subName_name: selectedSubDivName?.attributes?.SUBDIVISION_DESCRIPTION,
        subNameval: e,
        blockval: undefined,
        parcelval: undefined,
        parcelNum: [],
        parcelId: null,
      });
      queryTask({
        ...querySetting(
          this.LayerID.Subdivision,
          `SUBDIVISION_SPATIAL_ID=${e}` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          true,
          ["SUBDIVISION_SPATIAL_ID", "SUB_MUNICIPALITY_NAME"]
        ),
        callbackResult: (res) => {
          this.pol = res.features[0];
          highlightFeature(res.features[0], this.map, {
            layerName: "SelectGraphicLayer",
            isZoom: true,
            isHiglightSymbol: true,
            highlighColor: [0, 0, 0, 0.25],
          });
        },
      });
      queryTask({
        ...querySetting(
          this.LayerID.Landbase_Parcel,
          `SUBDIVISION_SPATIAL_ID=${e}` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          false,
          ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO", "SUB_MUNICIPALITY_NAME"]
        ),
        callbackResult: (res) => {
          this.setState({
            parcelSearch: null,
            parcelNum: res.features.map((e, i) => {
              return {
                ...e,
                i,
              };
            }),
          });
        },
      });
      this.resetGraphics();
    } else {
      this.pol = selectedSubDivName;
      if (callback && typeof callback == "function") {
        callback();
      }
    }
  };

  onBlockChange = (e, callback) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    if (
      (!callback || (callback && typeof callback == "object")) &&
      !this.loadLists
    ) {
      this.setState({
        block_no: this.state.blockNum.filter(
          (m) => m.attributes.BLOCK_SPATIAL_ID == e
        )?.[0]?.attributes?.BLOCK_NO,
        blockval: e,
        parcelval: undefined,
        parcelId: null,
        parcelNum: [],
      });
      queryTask({
        ...querySetting(
          this.LayerID.Survey_Block,
          `BLOCK_SPATIAL_ID=${e}` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          true,
          ["BLOCK_SPATIAL_ID", "SUB_MUNICIPALITY_NAME"]
        ),
        callbackResult: (res) => {
          this.pol = res.features[0];
          highlightFeature(res.features[0], this.map, {
            layerName: "SelectGraphicLayer",
            isZoom: true,
            isHiglightSymbol: true,
            highlighColor: [0, 0, 0, 0.25],
          });
        },
      });
      queryTask({
        ...querySetting(
          this.LayerID.Landbase_Parcel,
          `BLOCK_SPATIAL_ID=${e}` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          false,
          ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO", "SUB_MUNICIPALITY_NAME"]
        ),
        callbackResult: (res) => {
          this.setState({
            parcelSearch: null,
            parcelNum: res.features.map((e, i) => {
              return {
                ...e,
                i,
              };
            }),
          });
        },
      });
      this.resetGraphics();
    } else {
      this.pol = this.state.blockNum.filter(
        (m) => m.attributes.BLOCK_SPATIAL_ID == e
      )?.[0];
      if (callback && typeof callback == "function") {
        callback();
      }
    }
  };

  onLandParcelChange = (f, callback) => {
    this.RolBackPol = this.pol;
    this.RolBackParcelNum = this.state.parcelNum;

    if (!this.state.selectedLands?.length) {
      var e = this.state.parcelNum.filter((m) => m.i === f)?.[0]?.attributes
        ?.PARCEL_SPATIAL_ID;
      if (
        (!callback || (callback && typeof callback == "object")) &&
        !this.loadLists
      ) {
        this.setState({ parcelId: e, parcelval: f });
      }
      if (f) {
        queryTask({
          ...querySetting(
            this.LayerID.Landbase_Parcel,
            `PARCEL_SPATIAL_ID='${e}'` +
              (([2261, 2262, 2263].indexOf(
                this.props.currentModule.record.workflow_id
              ) != -1 &&
                ` AND SUB_MUNICIPALITY_NAME = '${
                  (this.props.currentModule.record.workflow_id == 2261 &&
                    1050103) ||
                  (this.props.currentModule.record.workflow_id == 2262 &&
                    1050101) ||
                  (this.props.currentModule.record.workflow_id == 2263 &&
                    1050102)
                }'`) ||
                ""),
            true,
            ["PARCEL_SPATIAL_ID", "SUB_MUNICIPALITY_NAME"]
          ),
          callbackResult: (res) => {
            this.selectedLandsT = [];
            highlightFeature(res.features[0], this.map, {
              layerName: "SelectGraphicLayer",
              strokeColor: [0, 0, 0],
              highlightWidth: 3,
              isHighlighPolygonBorder: true,
              isZoom: true,
              zoomFactor: 25,
            });
          },
        });
      }
    } else {
      var prevParcelId = this.state.parcelId;
      var g = this.state.parcelNum.filter((m) => m.i == f)?.[0];
      this.state["parcelId"] = g?.attributes?.PARCEL_SPATIAL_ID;
      this.LandHoverOff(
        this.map
          .getLayer("SelectGraphicLayer")
          .graphics.find(
            (prevGraphic) =>
              prevGraphic.attributes.PARCEL_SPATIAL_ID == prevParcelId
          )
      );

      this.setState({ parcelval: f });
    }

    if (callback && typeof callback == "function") {
      callback();
    }
  };

  addParcelToSelect = (feature) => {
    return new Promise((resolve, reject) => {
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
          "SUB_MUNICIPALITY_NAME",
        ],
        geometry: feature.geometry,
        url: mapUrl + "/" + this.LayerID.Landbase_Parcel,
        where:
          "PARCEL_PLAN_NO is not null" +
          (([2261, 2262, 2263].indexOf(
            this.props.currentModule.record.workflow_id
          ) != -1 &&
            ` AND SUB_MUNICIPALITY_NAME = '${
              (this.props.currentModule.record.workflow_id == 2261 &&
                1050103) ||
              (this.props.currentModule.record.workflow_id == 2262 &&
                1050101) ||
              (this.props.currentModule.record.workflow_id == 2263 && 1050102)
            }'`) ||
            ""),
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
    if (!this.state.selectedLands?.length) {
      this.map.graphics.clear();
      clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
      clearGraphicFromLayer(this.map, "editlengthGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      this.setToStore(null);
    } else {
      this.parcelDis = selectDis(this.selectedLandsT);
      console.log(this.parcelDis);
      this.setAdjacentToStore(this.parcelDis);
      this.setState({ parcelNum: this.parcelDis });

      clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      clearGraphicFromLayer(this.map, "PacrelNoGraphicLayer");
      this.parcelDis
        .filter(
          (element) =>
            !this.state.selectedLands?.find(
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
          this.state.selectedLands?.find(
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
          this.state.selectedLands?.find(
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
        domainLists: { ...this.state.domainLists },
      };
      this.props.input.onChange({ ...this.state.landsData });
    }
    this.setState({ mapLoaded: true });

    this.props.setCurrentMap(map);
  };

  setValue = (item, event) => {
    item.value = event.target.value;

    this.setToStore();
  };

  OnParcelSelect = () => {
    this.setState({ parcelval: undefined });
    clearGraphicFromLayer(this.map, "SelectGraphicLayer");
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");

    if (
      !this.state.selectedLands?.filter((e) => e.id === this.state.parcelId)
        .length
    ) {
      // ["PARCEL_AREA", "PARCEL_MAIN_LUSE", "PARCEL_LAT_COORD", "PARCEL_LONG_COORD", "PLAN_NO", "PARCEL_PLAN_NO", "USING_SYMBOL", "PARCEL_BLOCK_NO", "DISTRICT_NAME", "SUBDIVISION_DESCRIPTION", "SUBDIVISION_TYPE", "PARCEL_SPATIAL_ID", "MUNICIPALITY_NAME"]
      queryTask({
        ...querySetting(
          this.LayerID.Landbase_Parcel,
          `PARCEL_SPATIAL_ID =${this.state.parcelId}` +
            (([2261, 2262, 2263].indexOf(
              this.props.currentModule.record.workflow_id
            ) != -1 &&
              ` AND SUB_MUNICIPALITY_NAME = '${
                (this.props.currentModule.record.workflow_id == 2261 &&
                  1050103) ||
                (this.props.currentModule.record.workflow_id == 2262 &&
                  1050101) ||
                (this.props.currentModule.record.workflow_id == 2263 && 1050102)
              }'`) ||
              ""),
          true,
          ["*"]
        ),
        callbackResult: (res) => {
          if (
            this.state.selectedLands &&
            this.state.selectedLands?.length == 0
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
                      this.selectedLandsT?.push(res);
                      this.DrawGraph();
                    },
                    () => {
                      this.state.selectedLands?.pop();
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
                  this.selectedLandsT?.push(res);
                  this.DrawGraph();
                },
                () => {
                  this.state.selectedLands?.pop();
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
      conditions: this.state.conditions,
      mapGraphics: [],
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
      r[0].attributes.PARCEL_AREA = "";
      this.state.selectedLands?.push({
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

  LandHoverOn = (f) => {
    if (this.state.selectedLands?.length) {
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

  remove = (item) => {
    var itemIndex = this.state.selectedLands?.findIndex((parcel) => {
      return parcel.attributes.PARCEL_PLAN_NO == item.attributes.PARCEL_PLAN_NO;
    });
    var itemIndexT = this.state.selectedLandsT?.findIndex((parcel) => {
      return parcel.attributes.PARCEL_PLAN_NO == item.attributes.PARCEL_PLAN_NO;
    });
    //this.state.parcelData = {};
    if (itemIndex != -1) {
      let { mainObject } = this.props;
      if (mainObject && mainObject.waseka) {
        delete mainObject.waseka;
      }
      this.state.selectedLands?.splice(itemIndex, 1);
      this.state.selectedLandsT?.splice(itemIndexT, 1);
    }
    this.DrawGraph();
    this.setToStore();
  };

  saveEdit(id, name, i) {
    let findParcel = this.props.input.value.parcels.find((p) => {
      return [p?.id, p?.attributes?.PARCEL_SPATIAL_ID].indexOf(id) != -1;
    });
    findParcel.attributes[name] =
      this["edit_" + name + i] || findParcel.attributes[name];
    let selectLand = this.state.selectedLands?.find((p) => {
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
        this.setToStore();
      }
    );
  }

  openPopup = (scope) => {
    scope = this;
    var fields = this.parcelDataFields;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        className: "contract-modal",
        childProps: {
          fields,
          initialValues: { ...this.state.selectedLands[0].parcelData },
          ok(values) {
            scope.state.selectedLands?.forEach((parcel) => {
              parcel.parcelData = values;
            });
            scope.setToStore();
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  myChangeHandler = (name, i, e, event) => {
    let val = (typeof event == "string" && event) || event.target.value;
    e.attributes[name] = val;
    // e.attributes["PARCEL_AREA"] = event.target.value;
    if (this.showEditBtn(name, val)) {
      this["edit_" + name + i] = val;
      this.setState({ [name + "_isEdit_" + i]: true });
    } else {
      this.setState({});
    }
  };

  showEditBtn = (name, value) => {
    if (name == "USING_SYMBOL") {
      return value == null;
    } else {
      return (
        [
          "PARCEL_AREA",
          "PLAN_NO",
          "DISTRICT_NAME",
          "USING_SYMBOL_TEXT",
        ].indexOf(name) > -1
      );
    }
  };

  enableEdit = (name, i) => {
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  render() {
    const {
      //parcelData,
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
                  onChange={this.onMunChange}
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
                  onChange={this.onPlaneChange}
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
                  onChange={this.onSubTypeChange}
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
                  onChange={this.onSubNameChange}
                  showSearch
                  disabled={!subDivNames.length}
                  placeholder="اسم التقسيم"
                  value={subNameval}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children?.indexOf(convertToArabic(input)) != -1
                  }
                >
                  {subDivNames.map((e, i) => (
                    <Option key={i} value={e.attributes.SUBDIVISION_SPATIAL_ID}>
                      {" "}
                      {e.attributes.SUBDIVISION_DESCRIPTION}
                    </Option>
                  ))}
                </Select>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  autoFocus
                  onChange={this.onBlockChange}
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
                <Select
                  onFocus={() => {
                    //clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
                    if (!this.state["parcelId"]) {
                      highlightFeature(
                        parcelNum.filter((e, i) => {
                          if (parcelSearch) {
                            if (this.state.selectedLands?.length) {
                              return !this.state.selectedLands?.find(
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
                                !selectedLands?.find(
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
                  onChange={this.onLandParcelChange}
                  showSearch
                  disabled={parcelNum && !parcelNum.length}
                  onSearch={(e) => {
                    this.setState({ parcelSearch: e });
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
                          if (this.state.selectedLands?.length) {
                            return !this.state.selectedLands?.find(
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
                              !selectedLands?.find(
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
            {selectedLands && selectedLands?.length > 0 && (
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
                    {selectedLands?.map((e, i) => {
                      return (
                        <tr key={i}>
                          {this.parcel_fields.map((field, k) => {
                            return (
                              <td key={k}>
                                <div className="select_width">
                                  {field.editable ? (
                                    !this.state[field.name + "_isEdit_" + i] ? (
                                      <span>
                                        <span>
                                          {localizeNumber(
                                            `${
                                              e.attributes[field.name] || ""
                                            } ${
                                              e.attributes[field.extName] || ""
                                            }`
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
                                          gridTemplateColumns: "1fr 100px auto",
                                          alignItems: "center",
                                          gridGap: "10px",
                                        }}
                                      >
                                        <input
                                          key={i}
                                          className="form-control"
                                          type={field.type || "number"}
                                          step="any"
                                          value={e.attributes[field.name]}
                                          onChange={this.myChangeHandler.bind(
                                            this,
                                            field.name,
                                            i,
                                            e
                                          )}
                                        />
                                        {field.extName && (
                                          <Select
                                            getPopupContainer={(trigger) =>
                                              trigger.parentNode
                                            }
                                            autoFocus
                                            value={
                                              e.attributes[field.extName] ||
                                              this.myChangeHandler(
                                                field.extName,
                                                i,
                                                e,
                                                field.extInitialValue
                                              )
                                            }
                                            onChange={this.myChangeHandler.bind(
                                              this,
                                              field.extName,
                                              i,
                                              e
                                            )}
                                            placeholder={
                                              "من فضلك ادخل وحدة الطول"
                                            }
                                          >
                                            {field.extData.map((e, i) => (
                                              <Option key={i} value={e.value}>
                                                {e.label}
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
                            );
                          })}

                          {i === selectedLands?.length - 1 ? (
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
                            <td>
                              <button
                                className=" btn btn-danger "
                                onClick={this.remove.bind(this, e)}
                              >
                                حذف
                              </button>
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
)(updateContractIdentifyComponnent);
