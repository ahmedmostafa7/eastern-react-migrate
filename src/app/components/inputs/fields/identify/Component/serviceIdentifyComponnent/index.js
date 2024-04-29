import React, { Component } from "react";
import { esriRequest } from "../common/esri_request";
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";
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
  resetMapData,
  reformatNumLetters,
} from "../common/common_func";
import {
  getParcels,
  onBlockChange,
  onLandParcelChange,
  onMunChange,
  onPlaneChange,
  onSearch,
  onSubNameChange,
  onSubTypeChange,
} from "../common/filters_objects";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapPin,
  faSearchPlus,
  faTrash,
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import applyFilters from "main_helpers/functions/filters";
import { geometryServiceUrl, mapUrl } from "../mapviewer/config/map";
import {
  Select,
  Button,
  Form,
  message,
  InputNumber,
  Tooltip,
  Icon,
  Divider,
} from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import MapBtnsComponent from "../MapBtnsComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
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
  isEmpty,
} from "lodash";
import { LoadModules } from "../common/esri_loader";
import axios from "axios";
import { fetchData } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
const { Option } = Select;
export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "serviceLands"),
    ...mapDispatchToProps1(dispatch),
  };
};
class ServiceIdentifyComponent extends Component {
  constructor(props) {
    super(props);
    this.isLoaded = true;
    this.PlanNum = [];
    this.planId = null;
    this.parcelTs = [];
    this.selectedLandsT = [];
    this.selectedLands = [];
    this.selectionMode = false;
    this.parcel_fields = [
      "PARCEL_PLAN_NO",
      "PARCEL_AREA",
      "PARCEL_AREA_TEXT",
      "PARCEL_BLOCK_NO",
      "DISTRICT_NAME",
      "SUBDIVISION_TYPE",
      "SUBDIVISION_DESCRIPTION",
      "PARCEL_MAIN_LUSE",
      "USING_SYMBOL",
      "DETAILED_LANDUSE",
      "SRVC_SUBTYPE",
    ];
    this.parcelData = {
      label: "حدود الموقع حسب الصك",
      className: "parcelInfo",
      type: "inputs",
      required: true,
      fields: {
        north_length: {
          label: "طول الحد الشمالي",
          value: 0,
          required: true,
          field: "inputNumber",
          onClick: (props, val) => {
            debugger;
            props.change(
              "north_length_text",
              reformatNumLetters(toArabicWord(val), "متر")
            );
          },
        },
        north_length_text: {
          label: "طول الحد الشمالي بالأحرف",
          value: 0,
          required: true,
          disabled: true,
        },
        north_desc: {
          label: "وصف الحد الشمالي",
          value: "",
          required: true,
        },
        south_length: {
          label: "طول الحد الجنوبي",
          value: 0,
          required: true,
          field: "inputNumber",
          onClick: (props, val) => {
            debugger;
            props.change(
              "south_length_text",
              reformatNumLetters(toArabicWord(val), "متر")
            );
          },
        },
        south_length_text: {
          label: "طول الحد الجنوبي بالأحرف",
          value: 0,
          required: true,
          disabled: true,
        },
        south_desc: {
          label: "وصف الحد الجنوبي",
          value: "",
          required: true,
        },
        east_length: {
          label: "طول الحد الشرقي",
          value: 0,
          required: true,
          field: "inputNumber",
          onClick: (props, val) => {
            debugger;
            props.change(
              "east_length_text",
              reformatNumLetters(toArabicWord(val), "متر")
            );
          },
        },
        east_length_text: {
          label: "طول الحد الشرقي بالأحرف",
          value: 0,
          required: true,
          disabled: true,
        },
        east_desc: {
          label: "وصف الحد الشرقي",
          value: "",
          required: true,
        },
        west_length: {
          label: "طول الحد الغربي",
          value: 0,
          required: true,
          field: "inputNumber",
          onClick: (props, val) => {
            debugger;
            props.change(
              "west_length_text",
              reformatNumLetters(toArabicWord(val), "متر")
            );
          },
        },
        west_length_text: {
          label: "طول الحد الغربي بالأحرف",
          value: 0,
          required: true,
          disabled: true,
        },
        west_desc: {
          label: "وصف الحد الغربي",
          value: "",
          required: true,
        },
      },
    };

    this.parcelShatfa = {
      label: "الشطفات",
      fields: {
        SHATFA_NORTH_EAST_DIRECTION: {
          label: "مساحة الشطفة في إتجاة (شمال / شرق) ",
          placeholder: " من فضلك ادخل مساحة الشطفة في إتجاة (شمال / شرق) ",
          field: "inputNumber",
          name: "SHATFA_NORTH_EAST_DIRECTION",
          required: false,
        },
        SHATFA_NORTH_WEST_DIRECTION: {
          label: "مساحة الشطفة في إتجاة (شمال / غرب) ",
          placeholder: "من فضلك ادخل مساحة الشطفة في إتجاة (شمال / غرب)",
          field: "inputNumber",
          name: "SHATFA_NORTH_WEST_DIRECTION",
          required: false,
        },
        SHATFA_SOUTH_EAST_DIRECTION: {
          label: "مساحة الشطفة في إتجاة (جنوب / شرق) ",
          placeholder: "من فضلك ادخل مساحة الشطفة في إتجاة (جنوب / شرق)",
          field: "inputNumber",
          name: "SHATFA_SOUTH_EAST_DIRECTION",
          required: false,
        },
        SHATFA_SOUTH_WEST_DIRECTION: {
          label: "مساحة الشطفة في إتجاة (جنوب / غرب) ",
          placeholder: "من فضلك ادخل مساحة الشطفة في إتجاة (جنوب / غرب)",
          field: "inputNumber",
          name: "SHATFA_SOUTH_WEST_DIRECTION",
          required: false,
        },
      },
    };

    this.parcelElectric = {
      label: "مساحة غرفة الكهرباء",
      // fields: {
      //   electric_room_area: {
      //     label: "مساحة غرفة الكهرباء",
      //     placeholder: "من فضلك ادخل مساحة غرفة الكهرباء",
      //     field: "inputNumber",
      //     name: "electric_room_area",
      //     required: false,
      //   },
      //   electric_room_place: {
      //     label: "مكان غرفة الكهرباء",
      //     placeholder: "من فضلك ادخل مكان غرفة الكهرباء",
      //     field: "select",
      //     init: (props) => {
      //       props.setData([
      //         { label: "(شمال / شرق)", value: "(شمال / شرق)" },
      //         { label: "(شمال / غرب)", value: "(شمال / غرب)" },
      //         { label: "(جنوب / شرق)", value: "(جنوب / شرق)" },
      //         { label: "(جنوب / غرب)", value: "(جنوب / غرب)" },
      //       ])
      //     },
      //     name: "electric_room_place",
      //     required: false,
      //     label_key: "label",
      //     value_key: "value",
      //   },
      // },
      fields: {
        ELEC_NORTH_EAST_DIRECTION: {
          label: "مساحة غرفة الكهرباء في إتجاة (شمال / شرق) ",
          placeholder:
            " من فضلك ادخل مساحة غرفة الكهرباء في إتجاة (شمال / شرق) ",
          field: "inputNumber",
          name: "ELEC_NORTH_EAST_DIRECTION",
          required: false,
        },
        ELEC_NORTH_WEST_DIRECTION: {
          label: "مساحة غرفة الكهرباء في إتجاة (شمال / غرب) ",
          placeholder: "من فضلك ادخل مساحة غرفة الكهرباء في إتجاة (شمال / غرب)",
          field: "inputNumber",
          name: "ELEC_NORTH_WEST_DIRECTION",
          required: false,
        },
        ELEC_SOUTH_EAST_DIRECTION: {
          label: "مساحة غرفة الكهرباء في إتجاة (جنوب / شرق) ",
          placeholder: "من فضلك ادخل مساحة غرفة الكهرباء في إتجاة (جنوب / شرق)",
          field: "inputNumber",
          name: "ELEC_SOUTH_EAST_DIRECTION",
          required: false,
        },
        ELEC_SOUTH_WEST_DIRECTION: {
          label: "مساحة غرفة الكهرباء في إتجاة (جنوب / غرب) ",
          placeholder: "من فضلك ادخل مساحة غرفة الكهرباء في إتجاة (جنوب / غرب)",
          field: "inputNumber",
          name: "ELEC_SOUTH_WEST_DIRECTION",
          required: false,
        },
      },
    };

    let serviceParcel;
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });
    console.log(values);
    //;
    // if (values.landData?.landData_type == 2) {
    //   //;
    serviceParcel = props.input?.value?.parcels?.find((parcel) => {
      return (
        parcel.munval?.code == props.input.value?.temp?.mun &&
        parcel.planeval?.code == props.input.value?.temp?.planeval &&
        parcel.subNameval?.code == props.input.value?.temp?.subname &&
        parcel.blockval?.code == props.input.value?.temp?.block
      );
    });
    //}

    props.input?.value?.parcels?.forEach((r) => {
      if (r.selectedLands.length) {
        r.selectedLands.forEach((d) => {
          d.attributes.PARCEL_AREA_TEXT = reformatNumLetters(
            toArabicWord((+d.attributes.PARCEL_AREA).toFixed(2)),
            "متر مربع"
          );
        });
      }
    });

    this.state = {
      whereClause: `USING_SYMBOL = 'خ'`,
      mapLoaded: false,
      munval:
        serviceParcel?.munval?.code ||
        props.input.value?.temp?.mun ||
        undefined,
      planeval:
        serviceParcel?.planeval?.code ||
        props.input.value?.temp?.planeval ||
        undefined,
      plan_no:
        serviceParcel?.planeval?.name ||
        props.input.value?.temp?.plan ||
        undefined,
      subTypeval:
        serviceParcel?.subTypeval?.code ||
        props.input.value?.temp?.subtype ||
        undefined,
      subType_name:
        serviceParcel?.subTypeval?.name ||
        props.input.value?.temp?.subtype ||
        undefined,
      subNameval:
        serviceParcel?.subNameval?.code ||
        props.input.value?.temp?.subname ||
        undefined,
      subName_name:
        serviceParcel?.subNameval?.name ||
        props.input.value?.temp?.subname ||
        undefined,
      blockval:
        serviceParcel?.blockval?.code ||
        props.input.value?.temp?.block ||
        undefined,
      block_no:
        serviceParcel?.blockval?.name ||
        props.input.value?.temp?.block ||
        undefined,
      serviceData: props.input?.value?.parcels || [],
      parcelval: props.input.value?.temp?.parcel || undefined,
      blockNum: serviceParcel?.blockNum || [],
      subDivNames: serviceParcel?.subDivNames || [],
      subDivType: serviceParcel?.subDivType || [],
      parcelNum: serviceParcel?.parcelNum || [],
      MunicipalityNames: [],
      PlanNum: serviceParcel?.PlanNum || [],
      parcelId: null,
      mapExtend: null,
      parcelSearch: null,
      poly: null,
      landsData: {},
      noOfParcels:
        (serviceParcel &&
          serviceParcel.landData_type == 2 &&
          serviceParcel.noOfParcels) ||
        0,
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

  componentDidUpdate() {
    const {
      input,
      mainObject,
      currentModule: { id },
    } = this.props;
    if (input.value.isReset) {
      input.value.isReset = false;
      this.resetFields();
    }
  }
  componentDidMount() {
    const {
      currentModule: { id },
    } = this.props;
    if (window.isAkarApp) {
      console.log("window", window);
      this.parcel_fields = [
        "PARCEL_PLAN_NO",
        "PARCEL_AREA",
        "PARCEL_AREA_TEXT",
        "PARCEL_BLOCK_NO",
        "DISTRICT_NAME",
        "SUBDIVISION_TYPE",
        "SUBDIVISION_DESCRIPTION",
        "USING_SYMBOL",
        "DETAILED_LANDUSE",
        "SRVC_SUBTYPE",
      ];
    }
    getInfo().then((res) => {
      this.LayerID = res;

      getParcels(this, null, "", { returnDistinctValues: true }, [
        "MUNICIPALITY_NAME",
      ]).then((features) => {
        getFeatureDomainName(features, this.LayerID.Landbase_Parcel).then(
          (features) => {
            debugger;
            let fcs = features
              .filter((r) => r.attributes.MUNICIPALITY_NAME)
              // .reduce((a, b) => {
              //   if (!a.find(r => r.attributes.MUNICIPALITY_NAME_Code == b.attributes.MUNICIPALITY_NAME_Code)) {
              //     a.push(b);
              //   }
              //   return a;
              // }, [])
              .map((r) => {
                return {
                  code: r.attributes.MUNICIPALITY_NAME_Code,
                  name: r.attributes.MUNICIPALITY_NAME,
                  ...r,
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
                          codeValue?.code == 10506
                        ) {
                          return codeValue;
                        }
                      }),
              },
              () => {
                this.resetFilters();
              }
            );
          }
        );
      });
    });
  }

  // onMunChange = (e) => {
  //   //
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");
  //   let serviceDataItem =
  //     this.state.serviceData?.find(
  //       (item) =>
  //         item.munval?.code == e &&
  //         item.planeval?.code == undefined &&
  //         item.subNameval?.code == undefined &&
  //         item.blockval?.code == undefined
  //     ) || {};
  //   const {
  //     values,
  //     currentModule: { id },
  //   } = this.props;
  //   this.setState({
  //     munval: e,
  //     planeval: undefined,
  //     plan_no: undefined,
  //     subTypeval: undefined,
  //     subType_name: undefined,
  //     subNameval: undefined,
  //     subName_name: undefined,
  //     blockval: undefined,
  //     block_no: undefined,
  //     parcelval: undefined,
  //     PlanNum: [],
  //     blockNum: [],
  //     subDivNames: [],
  //     subDivType: [],
  //     parcelId: null,
  //     parcelNum: [],
  //     parcelData: this.parcelData,
  //     parcelElectricData: this.parcelElectricData,
  //     parcelShatfaData: this.parcelShatfaData,
  //     plan_no: undefined,
  //     noOfParcels: serviceDataItem?.noOfParcels || 0,
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
  //   this.GetPlansByMunID(e).then(() => {});
  //   this.getServiceParcels(e, null, null, null);
  // };

  // GetPlansByMunID = (e) => {
  //   return new Promise((resolve, reject) => {
  //     queryTask({
  //       ...querySetting(
  //         this.LayerID.Plan_Data,
  //         `MUNICIPALITY_NAME='${e}'`,
  //         false,
  //         ["PLAN_SPATIAL_ID", "PLAN_NO"]
  //       ),
  //       callbackResult: (res) => {
  //         let plans = res.features.map((e, i) => {
  //           return {
  //             ...e,
  //             i: uniqid(),
  //           };
  //         });
  //         this.setState({
  //           PlanNum: plans,
  //         });
  //         return resolve(plans);
  //       },
  //     });
  //   });
  // };

  resetFields = () => {
    resetMapData(this.map);
    onMunChange(this, undefined, () => {});
    this.props.input.onChange({});
    this.setState({ serviceData: [] });
  };

  getServiceParcels = (munval, planeval, subNameval, blockval) => {
    var plan = this.state.PlanNum.filter(
      (m) => m.i == planeval //|| m?.attributes?.PLAN_NO == planeval
    );
    let whereStr = `PARCEL_MAIN_LUSE IN (20, 30, 40)`;
    if (munval) {
      whereStr +=
        (munval && ` ${whereStr ? " AND " : " "}MUNICIPALITY_NAME=${munval}`) ||
        "";
    }
    if (plan?.[0]?.attributes?.PLAN_SPATIAL_ID) {
      whereStr +=
        (plan &&
          ` ${whereStr ? " AND " : " "}PLAN_SPATIAL_ID=${
            plan?.[0]?.attributes?.PLAN_SPATIAL_ID
          } AND PARCEL_PLAN_NO IS NOT NULL`) ||
        "";
    }
    if (subNameval) {
      whereStr +=
        (subNameval &&
          ` ${whereStr ? " AND " : " "}SUBDIVISION_SPATIAL_ID=${subNameval}`) ||
        "";
    }
    if (blockval) {
      whereStr +=
        (blockval &&
          ` ${whereStr ? " AND " : " "}BLOCK_SPATIAL_ID=${blockval}`) ||
        "";
    }
    this.parcelFilterWhere = whereStr;
    queryTask({
      ...querySetting(this.LayerID.Landbase_Parcel, `${whereStr}`, false, [
        "*",
      ]),
      returnGeometry: true,
      callbackResult: (res) => {
        let mun = this.state.MunicipalityNames?.filter(
          (e) => e?.code == munval
        ).map((e) => ({ code: e.code, name: e.name }))[0];
        let plan = this.state.PlanNum.filter((d, i) => d.i == planeval).map(
          (e) => ({
            code: e.i,
            name: e?.attributes?.PLAN_NO,
          })
        )[0];
        let block = this.state.blockNum
          .filter((block) => block?.attributes?.BLOCK_SPATIAL_ID == blockval)
          ?.map((e) => ({
            code: e?.attributes?.BLOCK_SPATIAL_ID,
            name: e?.attributes?.BLOCK_NO,
          }))[0];
        let subName = this.state.subDivNames
          .filter((e, i) => e.attributes.SUBDIVISION_SPATIAL_ID == subNameval)
          .map((e) => ({
            code: e.attributes.SUBDIVISION_SPATIAL_ID,
            name: e.attributes.SUBDIVISION_DESCRIPTION,
          }))[0];

        let index = this.state.serviceData.findIndex(
          (serviceDataItem) =>
            serviceDataItem.munval?.code == munval &&
            serviceDataItem.planeval?.code == planeval &&
            serviceDataItem.subNameval?.code == subNameval &&
            serviceDataItem.blockval?.code == blockval
        );

        //;
        if (
          index == -1 &&
          res.features.filter(
            (parcel) => parcel.attributes.PARCEL_PLAN_NO != null
          ).length &&
          this.state.parcelId
        ) {
          this.setState({
            parcelSearch: null,
            parcelNum: res.features.map((e, i) => {
              return {
                ...e,
                i,
              };
            }),
            serviceData: [
              ...this.state.serviceData,
              {
                munval: mun,
                planeval: plan,
                subNameval: subName,
                blockval: block,
                selectedLands: [],
                selectedLandsT: [],
                parcelNum: res.features.map((e, i) => {
                  return {
                    ...e,
                    i,
                  };
                }),
                noOfAvailableServiceParcels: res.features?.length || 0,
              },
            ],
          });
        } else {
          this.setState({
            parcelSearch: null,
            parcelNum: res.features.map((e, i) => {
              return {
                ...e,
                i,
              };
            }),
          });
        }
      },
    });
  };

  // onPlaneChange = (f) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

  //   let serviceDataItem =
  //     this.state.serviceData?.find(
  //       (item) =>
  //         item.munval?.code == this.state.munval &&
  //         item.planeval?.code == f &&
  //         item.subNameval?.code == undefined &&
  //         item.blockval?.code == undefined
  //     ) || {};
  //   const {
  //     values,
  //     currentModule: { id },
  //   } = this.props;

  //   var planSpatialId = this.state.PlanNum.filter((m) => m.i == f)?.[0]
  //     ?.attributes?.PLAN_SPATIAL_ID;
  //   this.setState({
  //     plan_no: this.state.PlanNum.filter((m) => m.i == f)?.[0]?.attributes
  //       ?.PLAN_NO,
  //     planeval: f,
  //     subTypeval: undefined,
  //     subType_name: undefined,
  //     subNameval: undefined,
  //     subName_name: undefined,
  //     blockval: undefined,
  //     block_no: undefined,
  //     parcelval: undefined,
  //     blockNum: [],
  //     subDivNames: [],
  //     subDivType: [],
  //     parcelId: null,
  //     parcelNum: [],
  //     parcelData: this.parcelData,
  //     parcelElectricData: this.parcelElectricData,
  //     parcelShatfaData: this.parcelShatfaData,
  //     noOfParcels: serviceDataItem?.noOfParcels || 0,
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
  //   this.GetBlocksByPlanID(planSpatialId);
  //   this.getServiceParcels(this.state.munval, f, null, null);
  //   esriRequest(mapUrl + "/" + this.LayerID.Subdivision).then((response) => {
  //     this.setState({ subDivType: response.fields[7].domain.codedValues });
  //   });
  // };

  // GetBlocksByPlanID = (planSpatialId) => {
  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Survey_Block,
  //       `PLAN_SPATIAL_ID='${planSpatialId}'`,
  //       false,
  //       ["*"]
  //     ),
  //     callbackResult: (res) => {
  //       console.log(res.features);
  //       let blocks = [];
  //       res.features.forEach((feature) => {
  //         if (feature.attributes.BLOCK_NO) {
  //           blocks.push(feature);
  //         }
  //       });
  //       this.setState({ blockNum: blocks });
  //     },
  //   });
  // };
  // onSubTypeChange = (e) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");
  //   let serviceDataItem =
  //     this.state.serviceData?.find(
  //       (item) =>
  //         item.munval?.code == this.state.munval &&
  //         item.planeval?.code == this.state.planeval &&
  //         item.subTypeval?.code == e &&
  //         item.blockval?.code == undefined
  //     ) || {};
  //   this.setState({
  //     subType_name: this.state.subDivType.filter((m) => m?.code == e)[0].name,
  //     subTypeval: e,
  //     subNameval: undefined,
  //     subName_name: undefined,
  //     blockval: undefined,
  //     block_no: undefined,
  //     parcelval: undefined,
  //     noOfParcels: serviceDataItem?.noOfParcels || 0,
  //   });
  //   this.getSubNamesBySubType(e);
  // };

  // getSubNamesBySubType = (e) => {
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
  //   clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

  //   let serviceDataItem =
  //     this.state.serviceData?.find(
  //       (item) =>
  //         item.munval?.code == this.state.munval &&
  //         item.planeval?.code == this.state.planeval &&
  //         item.subNameval?.code == e &&
  //         item.blockval?.code == undefined
  //     ) || {};

  //   const {
  //     values,
  //     currentModule: { id },
  //   } = this.props;

  //   this.setState({
  //     subName_name: this.state.subDivNames.filter(
  //       (m) => m.attributes.SUBDIVISION_SPATIAL_ID == e
  //     )?.[0]?.attributes?.SUBDIVISION_DESCRIPTION,
  //     subNameval: e,
  //     blockval: undefined,
  //     block_no: undefined,
  //     parcelval: undefined,
  //     parcelNum: [],
  //     parcelId: null,
  //     noOfParcels: serviceDataItem?.noOfParcels || 0,
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
  //   this.getServiceParcels(this.state.munval, this.state.planeval, e, null);
  // };

  // onBlockChange = (e) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

  //   let serviceDataItem =
  //     this.state.serviceData?.find(
  //       (item) =>
  //         item.munval?.code == this.state.munval &&
  //         item.planeval?.code == this.state.planeval &&
  //         item.subNameval?.code == this.state.subNameval &&
  //         item.blockval?.code == e
  //     ) || {};

  //   const {
  //     values,
  //     currentModule: { id },
  //   } = this.props;

  //   this.setState({
  //     block_no: this.state.blockNum.filter(
  //       (m) => m.attributes.BLOCK_SPATIAL_ID == e
  //     )?.[0]?.attributes?.BLOCK_NO,
  //     blockval: e,
  //     parcelval: undefined,
  //     parcelId: null,
  //     parcelNum: [],
  //     noOfParcels: serviceDataItem?.noOfParcels || 0,
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

  //   this.getServiceParcels(
  //     this.state.munval,
  //     this.state.planeval,
  //     this.state.subNameval,
  //     e
  //   );
  // };

  // onLandParcelChange = (f) => {
  //   let serviceDataItem = this.state.serviceData?.find(
  //     (item) =>
  //       item.munval?.code == this.state.munval &&
  //       item.planeval?.code == this.state.planeval &&
  //       item.subNameval?.code == this.state.subNameval &&
  //       item.blockval?.code == this.state.blockval
  //   );
  //   let selectedLands = serviceDataItem?.selectedLands || [];

  //   var e = (serviceDataItem?.parcelNum || this.state.parcelNum)?.filter(
  //     (m) => m.i === f
  //   )?.[0]?.attributes?.PARCEL_SPATIAL_ID;
  //   this.setState({
  //     parcelId: e,
  //     parcelval: f,
  //     noOfParcels: serviceDataItem?.noOfParcels || this.state.noOfParcels || 0,
  //   });
  //   this.RolBackPol = this.pol;
  //   this.RolBackParcelNum =
  //     serviceDataItem?.parcelNum || this.state.parcelNum || [];
  //   queryTask({
  //     ...querySetting(
  //       this.LayerID.Landbase_Parcel,
  //       `PARCEL_SPATIAL_ID='${e}'`,
  //       true,
  //       ["PARCEL_SPATIAL_ID"]
  //     ),
  //     returnGeometry: true,
  //     callbackResult: (res) => {
  //       if (serviceDataItem && !selectedLands.length) {
  //         serviceDataItem.selectedLandsT = [];
  //       }
  //       highlightFeature(res.features[0], this.map, {
  //         layerName: "SelectGraphicLayer",
  //         strokeColor: [0, 0, 0],
  //         highlightWidth: 3,
  //         isHighlighPolygonBorder: true,
  //         isZoom: true,
  //         zoomFactor: 50,
  //       });
  //     },
  //   });
  // };

  onLandParcelChangeById = (f) => {
    //;
    let serviceDataItem = this.state.serviceData?.find(
      (item) =>
        item.munval?.code == this.state.munval &&
        item.planeval?.code == this.state.planeval &&
        item.subNameval?.code == this.state.subNameval &&
        item.blockval?.code == this.state.blockval
    );
    let selectedLands = serviceDataItem?.selectedLands || [];

    this.setState({
      parcelId: f,
      // parcelval: serviceDataItem?.parcelNum?.findIndex(
      //   (m) => m.attributes.PARCEL_SPATIAL_ID === f
      // )?.toString(),
      noOfParcels: serviceDataItem?.noOfParcels || this.state.noOfParcels || 0,
    });
    this.RolBackPol = this.pol;
    this.RolBackParcelNum = serviceDataItem?.parcelNum || [];
    queryTask({
      ...querySetting(
        this.LayerID.Landbase_Parcel,
        `PARCEL_SPATIAL_ID='${f}'`,
        true,
        ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
      ),
      returnGeometry: true,
      callbackResult: (res) => {
        if (serviceDataItem && !selectedLands.length) {
          serviceDataItem.selectedLandsT = [];
        }
        clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
        clearGraphicFromLayer(this.map, "SelectGraphicLayer");
        clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");
        highlightFeature(res.features[0], this.map, {
          layerName: "SelectGraphicLayer",
          strokeColor: [0, 0, 0],
          highlightWidth: 3,
          isHighlighPolygonBorder: true,
          isZoom: true,
          zoomFactor: 50,
        });
        addParcelNo(
          new esri.geometry.Polygon(res.features[0].geometry)
            .getExtent()
            .getCenter(),
          this.map,
          res.features[0].attributes.PARCEL_PLAN_NO + "",
          "ParcelPlanNoGraphicLayer",
          14,
          [0, 0, 0]
        );
      },
    });
  };

  addParcelToSelect = () => {
    let serviceDataItem = this.state.serviceData?.find(
      (item) =>
        item.munval?.code == this.state.munval &&
        item.planeval?.code == this.state.planeval &&
        item.subNameval?.code == this.state.subNameval &&
        item.blockval?.code == this.state.blockval
    );
    let selectedLands = serviceDataItem?.selectedLands || [];
    if (selectedLands && selectedLands.length > 0) {
      this.setState({
        parcelId: selectedLands[selectedLands.length - 1]?.id,
      });

      // highlightFeature(selectedLands[selectedLands.length - 1], this.map, {
      //   layerName: "SelectGraphicLayer",
      //   strokeColor: [0, 0, 0],
      //   highlightWidth: 3,
      //   isHighlighPolygonBorder: true,
      //   isZoom: true,
      //   zoomFactor: 50,
      // });
      // addParcelNo(
      //   new esri.geometry.Polygon(selectedLands[selectedLands.length - 1].geometry)
      //     .getExtent()
      //     .getCenter(),
      //   this.map,
      //   selectedLands[selectedLands.length - 1].attributes.PARCEL_PLAN_NO + "",
      //   "ParcelPlanNoGraphicLayer",
      //   14,
      //   [0, 0, 0]
      // );

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
        geometry: new esri.geometry.Polygon(
          selectedLands[selectedLands.length - 1].geometry
        ),
        url: mapUrl + "/" + this.LayerID.Landbase_Parcel,
        where:
          "PARCEL_PLAN_NO is not null AND (USING_SYMBOL = 'خ' OR USING_SYMBOL = 'م' OR USING_SYMBOL like '%ت%')",
        callbackResult: (res) => {
          getFeatureDomainName(res.features, this.LayerID.Landbase_Parcel).then(
            (r) => {
              debugger;
              res.features = res.features
                .filter((r) => r.attributes.PARCEL_SPATIAL_ID)
                .map((e, i) => {
                  return {
                    ...e,
                    i: e.attributes.PARCEL_SPATIAL_ID?.toString(),
                  };
                });
              debugger;
              serviceDataItem.selectedLandsT.push(res);
              this.DrawGraph();
            }
          );
        },
      });
      //this.DrawGraph();
    }
  };

  DrawGraph = () => {
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });
    let serviceDataItem = this.state.serviceData?.find(
      (item) =>
        item.munval?.code == this.state.munval &&
        item.planeval?.code == this.state.planeval &&
        item.subNameval?.code == this.state.subNameval &&
        item.blockval?.code == this.state.blockval
    );
    let selectedLands = serviceDataItem?.selectedLands || [];
    if (!selectedLands.length) {
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
      this.parcelDis = selectDis(serviceDataItem?.selectedLandsT || []);
      // console.log(this.parcelDis);
      this.setAdjacentToStore(this.parcelDis);
      this.setState({ parcelSearch: null }); //, parcelNum: this.parcelDis

      clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

      // highlightFeature(
      //   this.parcelDis.filter(
      //     (element) =>
      //       !selectedLands.find(
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
      //     zoomFactor: 50,
      //   }
      // );

      // this.parcelDis
      //   .filter(
      //     (element) =>
      //       !selectedLands.find(
      //         (i) => i.id === element.attributes.PARCEL_SPATIAL_ID
      //       )
      //   )
      //   .forEach((f) => {
      //     addParcelNo(
      //       f.geometry.getExtent().getCenter(),
      //       this.map,
      //       f.attributes.PARCEL_PLAN_NO + "",
      //       "ParcelPlanNoGraphicLayer",
      //       14,
      //       [0, 0, 0]
      //     );
      //   });

      highlightFeature(
        this.parcelDis.filter((element) =>
          selectedLands.find(
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
          selectedLands.find(
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

  mapload = (map) => {
    this.map = map;
    setTimeout(() => {
      if (this.state?.serviceData?.length) {
        if (this.state?.serviceData?.[0]?.selectedLands?.length) {
          this.highlight(
            this.state?.serviceData?.[0]?.selectedLands?.[0],
            this.state?.serviceData?.[0],
            null
          );
        } else if (this.state?.serviceData?.[0]?.currentExtent) {
          this.highlight(
            this.state?.serviceData?.[0]?.currentExtent,
            this.state?.serviceData?.[0],
            null
          );
        }
      }
    }, 1500);

    this.setState({ mapLoaded: true });
    this.props.setCurrentMap(map);
  };

  myChangeHandler = (name, mainIndex, i, e, event) => {
    if (name == "PARCEL_AREA" && event.target.value) {
      e.attributes.PARCEL_AREA_TEXT = reformatNumLetters(
        toArabicWord((+event.target.value).toFixed(2)),
        "متر مربع"
      );
    }
    this["edit_" + name + "_" + mainIndex + "_" + i] = event.target.value;
  };

  enableEdit(name, mainIndex, i) {
    this.setState({ [name + "_isEdit_" + mainIndex + "_" + i]: true });
  }

  showEditBtn(name, value) {
    if (name == "USING_SYMBOL") {
      return value == null;
    } else {
      const {
        currentModule: { id },
      } = this.props;
      let editables = [
        "PARCEL_BLOCK_NO",
        "DISTRICT_NAME",
        "SUBDIVISION_TYPE",
        "SUBDIVISION_DESCRIPTION",
        "Natural_Area",
        "DETAILED_LANDUSE",
      ];

      if (id == 92) {
        editables = ["PARCEL_AREA", "PARCEL_AREA_TEXT", ...editables];
      }

      return editables.indexOf(name) > -1;
    }
  }

  saveEdit(id, name, mainIndex, i) {
    let serviceDataItem = this.state.serviceData[mainIndex];
    let selectedLands = serviceDataItem?.selectedLands || [];
    let findParcel = selectedLands[i];
    findParcel.attributes[name] =
      this["edit_" + name + "_" + mainIndex + "_" + i] ||
      findParcel.attributes[name];
    let selectLand = selectedLands.find((p) => {
      return [p?.id, p?.attributes?.PARCEL_SPATIAL_ID].indexOf(id) != -1;
    });
    selectLand.attributes[name] =
      this["edit_" + name + "_" + mainIndex + "_" + i] ||
      selectLand.attributes[name];
    this.state.landsData = {
      ...this.props.input.value,
      parcels: [...this.state.serviceData],
    };
    this.props.input.onChange({ ...this.state.landsData });
    this.setState({
      [name + "_isEdit_" + mainIndex + "_" + i]: false,
      serviceData: [...this.state.serviceData],
    });
  }

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

  checkAllocated = () => {
    return new Promise((resolve, reject) => {
      fetchData(
        `/submission/CheckAllocated?spatialId=${
          this.state.parcelId
        }&submissionId=${this.props.currentModule.record.id || 0}`
      ).then(
        (result) => {
          resolve(result);
        },
        (err) => {
          handleErrorMessages(err, t);
          reject();
        }
      );
    });
  };
  OnParcelSelect = () => {
    this.checkAllocated().then((result) => {
      if (!result) {
        const values = applyFilters({
          key: "FormValues",
          form: "stepForm",
        });
        if (values?.landData?.landData_type == 2 && !this.state.noOfParcels) {
          window.notifySystem("error", "يجب ادخال عدد الأراضي الغير معلومة", 5);
          return;
        }
        this.setState({ parcelval: undefined });
        clearGraphicFromLayer(this.map, "SelectGraphicLayer");
        clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
        let serviceDataItem = this.state.serviceData?.find(
          (item) =>
            item.munval?.code == this.state.munval &&
            item.planeval?.code == this.state.planeval &&
            item.subNameval?.code == this.state.subNameval &&
            item.blockval?.code == this.state.blockval
        );

        let selectedLands = serviceDataItem?.selectedLands || [];
        if (!selectedLands.filter((e) => e.id === this.state.parcelId).length) {
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
                "DETAILED_LANDUSE",
                "SUB_MUNICIPALITY_NAME",
                "PARCEL_SUB_LUSE",
              ]
            ),
            callbackResult: (res) => {
              //this.validation(res.features[0]).then((result) => {
              getFeatureDomainName(
                res.features,
                this.LayerID.Landbase_Parcel
              ).then((r) => {
                intersectQueryTask({
                  outFields: ["SRVC_SUBTYPE"],
                  geometry: new esri.geometry.Polygon(r[0].geometry),
                  url: mapUrl + "/" + this.LayerID.Service_Data,
                  callbackResult: (serviceRes) => {
                    //
                    getFeatureDomainName(
                      serviceRes.features,
                      this.LayerID.Service_Data
                    ).then((serviceDomainsRes) => {
                      r[0].attributes = {
                        ...r[0].attributes,
                        SRVC_SUBTYPE:
                          (serviceDomainsRes.length &&
                            serviceDomainsRes[0].attributes.SRVC_SUBTYPE) ||
                          null,
                        // SRVC_SUBTYPE_DESC:
                        //   (serviceDomainsRes.length &&
                        //     serviceDomainsRes[0].attributes.SRVC_SUBTYPE) +
                        //     ` (${r[0].attributes.DETAILED_LANDUSE})` || null,
                        SRVC_SUBTYPE_Code:
                          (serviceDomainsRes.length &&
                            serviceDomainsRes[0].attributes
                              .SRVC_SUBTYPE_Code) ||
                          null,
                        PARCEL_AREA_TEXT: reformatNumLetters(
                          toArabicWord(r[0].attributes.PARCEL_AREA),
                          "متر مربع"
                        ),
                      };
                      //
                      this.setToStore(r, values?.landData?.landData_type);
                      this.addParcelToSelect();
                      //this.DrawGraph();
                    });
                  },
                });
              });
            },
          });
        }
      } else {
        window.notifySystem("error", "تم تخصيص الأرض من قبل", 5);
        return;
      }
    });
  };

  setToStore = (r, landData_type) => {
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });

    let index = this.state.serviceData?.findIndex(
      (item) =>
        item.munval?.code == this.state.munval &&
        item.planeval?.code == this.state.planeval &&
        item.subNameval?.code == this.state.subNameval &&
        item.blockval?.code == this.state.blockval
    );
    const {
      input: { value },
    } = this.props;

    let mun = this.state.MunicipalityNames?.filter(
      (e) => e?.code == this.state.munval
    ).map((e) => ({ code: e.code, name: e.name }))[0];
    let plan = this.state.PlanNum.filter(
      (d, i) => d.i == this.state.planeval
    ).map((e) => ({ code: e.i, name: e?.attributes?.PLAN_NO }))[0];
    let block = this.state.blockNum
      .filter(
        (block) => block?.attributes?.BLOCK_SPATIAL_ID == this.state.blockval
      )
      ?.map((e) => ({
        code: e?.attributes?.BLOCK_SPATIAL_ID,
        name: e?.attributes?.BLOCK_NO,
      }))[0];
    let subName = this.state.subDivNames
      .filter(
        (e, i) => e.attributes.SUBDIVISION_SPATIAL_ID == this.state.subNameval
      )
      .map((e) => ({
        code: e.attributes.SUBDIVISION_SPATIAL_ID,
        name: e.attributes.SUBDIVISION_DESCRIPTION,
      }))[0];

    let subType = this.state.subDivType
      .filter((e, i) => e.code == this.state.subTypeval)
      .map((e) => ({
        code: e.code,
        name: e.name,
      }))[0];

    if (r && landData_type == 1) {
      if (index != -1) {
        this.state.serviceData[index].selectedLands = [
          ...this.state.serviceData[index].selectedLands,
          {
            attributes: r[0].attributes,
            id: this.state.parcelId,
            geometry: JSON.parse(JSON.stringify(r[0].geometry)),
          },
        ];
      } else {
        this.state.serviceData.push({
          munval: mun,
          planeval: plan,
          subNameval: subName,
          blockval: block,
          subTypeval: subType,
          landData_type: values?.landData?.landData_type,
          PlanNum: this.state.PlanNum,
          parcelNum: this.state?.parcelNum || [],
          blockNum: this.state?.blockNum || [],
          subDivNames: this.state?.subDivNames || [],
          subDivType: this.state?.subDivType || [],
          selectedLands: [
            {
              attributes: r[0].attributes,
              id: this.state.parcelId,
              geometry: JSON.parse(JSON.stringify(r[0].geometry)),
            },
          ],
          selectedLandsT: [],
        });
      }
    } else if (r && landData_type == 2) {
      //;
      if (index != -1) {
        this.state.serviceData[index].noOfParcels =
          r.noOfParcels || this.state.serviceData[index]?.noOfParcels;
        this.state.serviceData[index].noOfAvailableServiceParcels =
          this.state?.parcelNum?.length || 0;
        if (r?.[0] != undefined) {
          this.state.serviceData[index].selectedLands =
            (!this.state.serviceData[index].selectedLands.length && [
              {
                attributes: r[0].attributes,
                id: this.state.parcelId,
                geometry: JSON.parse(JSON.stringify(r[0].geometry)),
              },
            ]) || [
              ...this.state.serviceData[index].selectedLands,
              {
                attributes: r[0].attributes,
                id: this.state.parcelId,
                geometry: JSON.parse(JSON.stringify(r[0].geometry)),
              },
            ] ||
            [];
        }
      } else {
        this.state.serviceData.push({
          munval: mun,
          planeval: plan,
          subNameval: subName,
          blockval: block,
          subTypeval: subType,
          landData_type: values?.landData?.landData_type,
          noOfParcels: r.noOfParcels || this.state?.noOfParcels,
          currentExtent: r.currentExtent || this.pol,
          noOfAvailableServiceParcels: this.state?.parcelNum?.length || 0,
          PlanNum: this.state.PlanNum,
          parcelNum: this.state?.parcelNum || [],
          blockNum: this.state?.blockNum || [],
          subDivNames: this.state?.subDivNames || [],
          subDivType: this.state?.subDivType || [],
          selectedLands:
            (r?.[0] != undefined && [
              {
                attributes: r[0].attributes,
                id: this.state.parcelId,
                geometry: JSON.parse(JSON.stringify(r[0].geometry)),
              },
            ]) ||
            [],
          selectedLandsT: [],
        });
      }
    }

    //;
    this.state.landsData = {
      ...value,
      mapGraphics: [],
      submission_data: { ...this.state.submission_data },
      temp: {
        mun: this.state.munval,
        plan: this.state.plan_no,
        planeval: this.state.planeval,
        subtype: this.state.subType_name,
        subname: this.state.subName_name,
        parcelDis: this.RolBackParcelNum,
        block: this.state.block_no,
        parcel: this.state.parcelval,
      },
      parcels: [...this.state.serviceData],
    };
    this.props.input.onChange({ ...this.state.landsData });
    this.setState({ serviceData: [...this.state.serviceData] });
  };

  setAdjacentToStore = (r) => {
    let store = this.props.input.value;
    store.temp.parcelDis = r;
    this.props.input.onChange(store);
  };

  resetFilters = () => {
    debugger;
    this.loadLists = true;
    if (this.state.munval) {
      onMunChange(this, this.state.munval, () => {
        onPlaneChange(this, this.state.planeval, () => {
          onSubTypeChange(this, this.state.subTypeval, () => {
            onSubNameChange(this, this.state.subNameval, () => {
              onBlockChange(this, this.state.blockval, () => {
                onLandParcelChange(this, this.state.parcelval, () => {});
              });
            });
          });
        });
      });
    }
    this.loadLists = false;
  };

  LandHoverOn = (f) => {
    let serviceDataItem = this.state.serviceData?.find(
      (item) =>
        item.munval?.code == this.state.munval &&
        item.planeval?.code == this.state.planeval &&
        item.subNameval?.code == this.state.subNameval &&
        item.blockval?.code == this.state.blockval
    );
    let selectedLands = serviceDataItem?.selectedLands || [];
    if (selectedLands.length) {
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      var parcel = serviceDataItem?.parcelNum?.filter((m) => m.i == f.key)[0];
      highlightFeature(parcel, this.map, {
        layerName: "SelectGraphicLayer",
        strokeColor: [0, 0, 0],
        isHighlighPolygonBorder: true,
        highlightWidth: 3,
      });
    }
  };

  LandHoverOff = (f) => {
    let serviceDataItem = this.state.serviceData?.find(
      (item) =>
        item.munval?.code == this.state.munval &&
        item.planeval?.code == this.state.planeval &&
        item.subNameval?.code == this.state.subNameval &&
        item.blockval?.code == this.state.blockval
    );
    let selectedLands = serviceDataItem?.selectedLands || [];
    if (selectedLands.length) {
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
    }
  };

  remove = (mainIndex, index) => {
    const {
      input: { value },
    } = this.props;

    if (index != -1) {
      this.state.serviceData[mainIndex].selectedLands.splice(index, 1);
      if (!this.state.serviceData[mainIndex].selectedLands.length) {
        clearGraphicFromLayer(this.map, "SelectGraphicLayer");
        clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
        clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");
        // onMunChange(
        //   this,
        //   this.state.serviceData[mainIndex].munval.code,
        //   () => {}
        // );
        // onPlaneChange(this.state.serviceData[mainIndex].planeval.code);
        this.resetFilters();
        // highlightFeature(this.pol, this.map, {
        //   layerName: "SelectGraphicLayer",
        //   isZoom: true,
        //   isHiglightSymbol: true,
        //   highlighColor: [0, 0, 0, 0.25],
        // });
        debugger;
        this.getServiceParcels(
          this.state.munval,
          this.state.planeval,
          this.state.subNameval,
          this.state.blockval
        );
      } else {
        let length = this.state.serviceData[mainIndex].selectedLands.length;
        this.doHighlightOrZoom(
          this.state.serviceData[mainIndex].selectedLands[length - 1],
          this.state.serviceData[mainIndex],
          false
        );
      }
    } else {
      this.state.serviceData.splice(mainIndex, 1);
    }

    // if (this.state.serviceDataT?.length) {
    //   this.state.serviceDataT.pop(item);
    // }

    this.state.landsData = {
      ...value,
      mapGraphics: [],
      submission_data: { ...this.state.submission_data },
      temp: {
        mun: this.state.munval,
        planeval: this.state.planeval,
        plan: this.state.plan_no,
        subtype: this.state.subType_name,
        subname: this.state.subName_name,
        parcelDis: this.RolBackParcelNum,
        block: this.state.block_no,
        parcel: this.state.parcelval,
      },
      parcels: [...this.state.serviceData],
    };

    this.props.input.onChange({ ...this.state.landsData });
    this.setState({ serviceData: [...this.state.serviceData] });
    this.DrawGraph();
  };

  setNoOfParcels = (evt) => {
    //;
    this.setState({ noOfParcels: evt.target.value });
  };

  assignNoOfParcels = () => {
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });
    this.setToStore(
      { noOfParcels: this.state.noOfParcels, currentExtent: this.pol },
      values?.landData?.landData_type
    );
  };

  openPopup = (mainIndex, index, fieldsObj) => {
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });
    var fields = this?.[fieldsObj]?.fields;
    let thisScope = this;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: {
            ...(this.state.serviceData[mainIndex].selectedLands[index]?.[
              fieldsObj
            ] || {}),
          },
          ok(values) {
            thisScope.state.serviceData[mainIndex].selectedLands[index][
              fieldsObj
            ] = values;
            thisScope.setToStore(null, values?.landData?.landData_type);
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  zoom = (e, serviceDataItem, evt) => {
    this.doHighlightOrZoom(e, serviceDataItem, false);
  };

  doHighlightOrZoom = (e, serviceDataItem, isHighlight) => {
    const {
      currentModule: { id },
    } = this.props;
    // let planeval;
    // this.state.munval = serviceDataItem?.munval?.code;
    // this.state.blockval = serviceDataItem?.blockval?.code;
    // this.state.subNameval = serviceDataItem?.subNameval?.code;
    // this.state.subTypeval = serviceDataItem?.subTypeval?.code;
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    clearGraphicFromLayer(this.map, "SelectGraphicLayer");
    clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

    highlightFeature(e, this.map, {
      layerName: "SelectLandsGraphicLayer",
      noclear: false,
      isZoom: true,
      isHiglightSymbol: isHighlight,
      highlighColor: [0, 255, 0, 0.5],
      zoomFactor: 50,
    });

    //;
    this.setState({
      noOfParcels: serviceDataItem?.noOfParcels,
      munval: serviceDataItem?.munval?.code || undefined,
      planeval: serviceDataItem?.planeval?.code || undefined,
      plan_no: serviceDataItem?.planeval?.name || undefined,
      subTypeval: serviceDataItem?.subTypeval?.code || undefined,
      subNameval: serviceDataItem?.subNameval?.code || undefined,
      blockval: serviceDataItem?.blockval?.code || undefined,
      parcelId: e?.id || undefined,
      PlanNum: serviceDataItem?.PlanNum || [],
      blockNum: serviceDataItem?.blockNum || [],
      subDivNames: serviceDataItem?.subDivNames || [],
      subDivType: serviceDataItem?.subDivType || [],
      parcelNum: serviceDataItem?.parcelNum || [],
    });

    if (serviceDataItem?.selectedLands.length) {
      this.onLandParcelChangeById(e?.id);
    } else {
      this.state.parcelId = null;
      this.getServiceParcels(
        serviceDataItem?.munval?.code,
        serviceDataItem?.planeval?.code,
        serviceDataItem?.subNameval?.code,
        serviceDataItem?.blockval?.code
      );
    }

    // if (serviceDataItem?.munval?.code && serviceDataItem?.planeval?.name) {
    //   this.GetPlansByMunID(serviceDataItem?.munval?.code).then((plans) => {
    //     if (serviceDataItem?.planeval?.name) {
    //       planeval = plans.find(
    //         (plan) => plan.attributes.PLAN_NO == serviceDataItem?.planeval?.name
    //       )?.i;

    //       this.state.planeval = planeval;
    //       this.state.plan_no = serviceDataItem?.planeval?.name;
    //       this.planId = plans.find(
    //         (plan) => plan.attributes.PLAN_NO == serviceDataItem?.planeval?.name
    //       )?.attributes.PLAN_SPATIAL_ID;

    //       if (serviceDataItem?.blockval?.code) {
    //         this.GetBlocksByPlanID(this.planId);
    //       }
    //     }

    //     if (
    //       serviceDataItem?.subNameval?.code &&
    //       serviceDataItem?.subTypeval?.code
    //     ) {
    //       this.getSubNamesBySubType(serviceDataItem?.subTypeval?.code);
    //     }

    //     if (serviceDataItem?.selectedLands.length) {
    //       this.state.parcelNum = serviceDataItem?.parcelNum || [];
    //       this.onLandParcelChangeById(e?.id);
    //     } else {
    //       this.state.parcelId = null;
    //       this.getServiceParcels(
    //         serviceDataItem?.munval?.code,
    //         serviceDataItem?.planeval?.name,
    //         serviceDataItem?.subNameval?.code,
    //         serviceDataItem?.blockval?.code
    //       );
    //     }
    //     if (serviceDataItem?.landData_type == 2) {
    //       this.setState({ noOfParcels: serviceDataItem?.noOfParcels });
    //     }
    //   });
    // } else {
    //   if (serviceDataItem?.selectedLands.length) {
    //     this.state.parcelNum = serviceDataItem?.parcelNum || [];
    //     this.onLandParcelChangeById(e?.id);
    //   } else {
    //     this.state.parcelId = null;
    //     this.getServiceParcels(
    //       serviceDataItem?.munval?.code,
    //       serviceDataItem?.planeval?.name,
    //       serviceDataItem?.subNameval?.code,
    //       serviceDataItem?.blockval?.code
    //     );
    //   }
    //   if (serviceDataItem?.landData_type == 2) {
    //     this.setState({ noOfParcels: serviceDataItem?.noOfParcels });
    //   }
    // }
  };

  highlight = (e, serviceDataItem, evt) => {
    this.doHighlightOrZoom(e, serviceDataItem, true);
  };

  render() {
    const {
      parcelData,
      parcelElectricData,
      parcelShatfaData,
      serviceData,
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
      noOfParcels,
    } = this.state;
    let serviceDataItem =
      serviceData?.find(
        (item) =>
          item.munval?.code == this.state.munval &&
          item.planeval?.code == this.state.planeval &&
          item.subNameval?.code == this.state.subNameval &&
          item.blockval?.code == this.state.blockval
      ) || {};
    const {
      fullMapWidth,
      currentModule: { id },
      t,
    } = this.props;
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });

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

        <div
          className={
            !fullMapWidth && id != 92 ? "content-section implementation" : ""
          }
        >
          {mapLoaded && id != 92 && (
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
                disabled={
                  !values?.landData?.landData_type ||
                  (values?.landData?.landData_type && this.state.munval) ||
                  !this.state.MunicipalityNames?.length
                }
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
                      convertToEnglish(option.props.children)
                        .replaceAll(" ", "")
                        .indexOf(input.replaceAll(" ", "")) != -1
                    );
                  } else {
                    return false;
                  }
                }}
                value={planeval}
                placeholder="رقم المخطط"
                notFoundContent="not found"
              >
                {(id == 91 &&
                  serviceData.length &&
                  serviceData.find(
                    (item) => item?.planeval?.code != undefined
                  ) != undefined &&
                  PlanNum
                    //.slice(0, 100)
                    .map((d, i) => {
                      return (
                        serviceData.find(
                          (item) => item?.planeval?.code == d.i
                        ) != undefined && (
                          <Option
                            key={d.attributes.PLAN_SPATIAL_ID}
                            value={d.i}
                          >
                            {localizeNumber(d.attributes.PLAN_NO)}
                          </Option>
                        )
                      );
                    })) ||
                  PlanNum.map((d, i) => {
                    return (
                      <Option key={d.attributes.PLAN_SPATIAL_ID} value={d.i}>
                        {localizeNumber(d.attributes.PLAN_NO)}
                      </Option>
                    );
                  })}
              </Select>
              {!blockval && (
                <>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    autoFocus
                    onChange={(val) => {
                      onSubTypeChange(this, val);
                    }}
                    showSearch
                    disabled={
                      [90, 91].indexOf(id) == -1 ||
                      !values?.landData?.landData_type ||
                      !subDivType.length
                    }
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
                    disabled={
                      [90, 91].indexOf(id) == -1 ||
                      !values?.landData?.landData_type ||
                      !subDivNames.length
                    }
                    placeholder="اسم التقسيم"
                    value={subNameval}
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      return (
                        option.props.children?.indexOf(
                          convertToArabic(input)
                        ) != -1
                      );
                    }}
                  >
                    {subDivNames
                      //.slice(0, 100)
                      .map((e, i) => (
                        <Option
                          key={e.attributes.SUBDIVISION_SPATIAL_ID}
                          value={e.i}
                        >
                          {e.attributes.SUBDIVISION_DESCRIPTION}
                        </Option>
                      ))}
                  </Select>
                </>
              )}
              {!this.state.subTypeval && (
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  autoFocus
                  onChange={(val) => {
                    onBlockChange(this, val);
                  }}
                  showSearch
                  disabled={
                    [90, 91].indexOf(id) == -1 ||
                    !values?.landData?.landData_type ||
                    !blockNum.length
                  }
                  value={
                    this.state.blockNum?.filter(
                      (m) => m.attributes.BLOCK_SPATIAL_ID == blockval
                    )?.[0]?.i
                  }
                  placeholder="رقم البلك"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children?.indexOf(convertToArabic(input)) != -1
                  }
                >
                  {blockNum
                    //.slice(0, 100)
                    .map((e, i) => (
                      <Option key={e.attributes.BLOCK_SPATIAL_ID} value={e.i}>
                        {localizeNumber(e.attributes.BLOCK_NO)}
                      </Option>
                    ))}
                </Select>
              )}
              {values?.landData?.landData_type == 2 && (
                <>
                  <InputNumber
                    type="number"
                    placeholder="عدد قطع الأراضي"
                    value={noOfParcels}
                    onBlur={this.setNoOfParcels.bind(this)}
                    disabled={
                      (id == 91 &&
                        values?.landData?.landData_type == 2 &&
                        noOfParcels != 0 &&
                        noOfParcels != "" &&
                        noOfParcels != undefined) ||
                      !this.state.munval
                    }
                    style={{
                      minWidth: "350px",
                      marginTop: "4px",
                      height: "40px",
                    }}
                  />
                  {id == 90 && (
                    <Button
                      className="add-gis"
                      disabled={!noOfParcels}
                      onClick={this.assignNoOfParcels.bind(this)}
                    >
                      إضافة الأرض
                    </Button>
                  )}
                </>
              )}
              {(id == 91 || values?.landData?.landData_type == 1) && (
                <>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    autoFocus
                    onChange={(val) => {
                      this.setState({ isOnSearch: false }, () => {
                        onLandParcelChange(this, val);
                      });
                    }}
                    showSearch
                    disabled={
                      (!this.state.isOnSearch &&
                        parcelNum &&
                        !parcelNum.filter(
                          (parcel) => parcel.attributes.PARCEL_PLAN_NO != null
                        ).length) ||
                      (values?.landData?.landData_type == 1 &&
                        this.props.currentModule.id != 90)
                    }
                    // onSearch={(e) => {
                    //   this.setState(
                    //     { parcelSearch: e, isOnSearch: true },
                    //     () => {
                    //       onSearch(this, e);
                    //     }
                    //   );
                    // }}
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
                            if (serviceDataItem?.selectedLands?.length) {
                              return !serviceDataItem?.selectedLands?.find(
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
                            if (serviceDataItem?.selectedLands?.length) {
                              return (
                                !serviceDataItem?.selectedLands?.find(
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
                </>
              )}
            </div>
          )}

          <MapComponent
            mapload={this.mapload.bind(this)}
            {...this.props}
          ></MapComponent>
        </div>
        {mapLoaded && (
          <div style={{ gridColumn: "1/3" }}>
            {serviceData && serviceData.length > 0 && (
              <div>
                <h1 className="titleSelectedParcel">الأراضي المختارة</h1>

                <table
                  className="table table-bordered"
                  style={{ marginTop: "1%" }}
                >
                  <tbody>
                    {serviceData.map((serviceDataItem, mainIndex) => {
                      return (
                        ((serviceDataItem?.landData_type == 1 &&
                          serviceDataItem?.selectedLands?.length > 0) ||
                          serviceDataItem?.landData_type == 2) && (
                          <>
                            <tr key={mainIndex}>
                              <td>البلدية</td>
                              <td>{serviceDataItem?.munval?.name}</td>
                              {serviceDataItem?.planeval?.name && (
                                <>
                                  <td>المخطط</td>
                                  <td>
                                    {convertToArabic(
                                      serviceDataItem?.planeval?.name
                                    )}
                                  </td>
                                </>
                              )}
                              {serviceDataItem?.subNameval?.name && (
                                <>
                                  <td>التقسيم</td>
                                  <td>
                                    {convertToArabic(
                                      serviceDataItem?.subNameval?.name
                                    )}
                                  </td>
                                </>
                              )}
                              {serviceDataItem?.blockval?.name && (
                                <>
                                  <td>البلك</td>
                                  <td>
                                    {convertToArabic(
                                      serviceDataItem?.blockval?.name
                                    )}
                                  </td>
                                </>
                              )}
                              {serviceDataItem.noOfParcels && (
                                <>
                                  <td>عدد الأراضي</td>
                                  <td>
                                    {convertToArabic(
                                      serviceDataItem.noOfParcels
                                    )}
                                  </td>
                                </>
                              )}
                              {serviceDataItem.landData_type == 2 && (
                                <td>
                                  <span
                                    key={mainIndex}
                                    className="toolsBtnStyle center"
                                    style={{
                                      width: "100%",
                                      position: "relative",
                                      display: "flex",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {serviceDataItem.currentExtent &&
                                      !serviceDataItem?.selectedLands
                                        ?.length && (
                                        // <button
                                        //   className=" btn btn-primary "
                                        //   onClick={this.zoom.bind(
                                        //     this,
                                        //     serviceDataItem.currentExtent,
                                        //     serviceDataItem
                                        //   )}
                                        // >
                                        //   اختيار
                                        // </button>
                                        <>
                                          <Tooltip
                                            placement="bottom"
                                            title={t(`actions:Zoom`)}
                                          >
                                            <span
                                              style={{
                                                cursor: "pointer",
                                              }}
                                              onClick={this.zoom.bind(
                                                this,
                                                serviceDataItem.currentExtent,
                                                serviceDataItem
                                              )}
                                            >
                                              <FontAwesomeIcon
                                                icon={faSearchPlus}
                                                size={"1x"}
                                              />
                                            </span>
                                            {/* </a> */}
                                          </Tooltip>
                                          <Divider type="vertical" />
                                        </>
                                      )}
                                    {id != 92 && (
                                      <>
                                        <Tooltip
                                          placement="bottom"
                                          title={t(`actions:Delete`)}
                                        >
                                          <span
                                            style={{
                                              cursor: "pointer",
                                            }}
                                            onClick={this.remove.bind(
                                              this,
                                              mainIndex,
                                              -1
                                            )}
                                          >
                                            <FontAwesomeIcon
                                              icon={faTrash}
                                              size={"1x"}
                                            />
                                          </span>
                                        </Tooltip>
                                        <Divider type="vertical" />
                                      </>
                                    )}
                                  </span>
                                </td>
                              )}
                            </tr>
                            {serviceDataItem?.selectedLands?.length > 0 && (
                              <tr>
                                <td colSpan={"100%"}>
                                  <table
                                    className="table table-bordered"
                                    style={{ marginTop: "1%" }}
                                  >
                                    <thead>
                                      <tr>
                                        <th>رقم القطعه</th>
                                        <th>المساحة من الصك م٢</th>
                                        <th>المساحة بالحروف (م٢)</th>
                                        <th>رقم البلك</th>
                                        <th>الحي</th>
                                        <th>نوع التقسيم</th>
                                        <th>اسم التقسيم</th>
                                        <th>الاستخدام الرئيسي</th>
                                        <th>رمز الاستخدام</th>
                                        <th>الإستخدام التفصيلي</th>
                                        <th>الغرض من الأرض</th>
                                        <th> خيارات</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {serviceDataItem.selectedLands.map(
                                        (e, i) => {
                                          return (
                                            <tr key={i}>
                                              {this.parcel_fields.map(
                                                (field, k) => {
                                                  return (
                                                    <td key={k}>
                                                      <div>
                                                        {!this.state[
                                                          field +
                                                            "_isEdit_" +
                                                            mainIndex +
                                                            "_" +
                                                            i
                                                        ] ? (
                                                          <span>
                                                            <span>
                                                              {convertToArabic(
                                                                (field ==
                                                                  "PARCEL_AREA" &&
                                                                  (+e
                                                                    .attributes?.[
                                                                    field
                                                                  ])?.toFixed(
                                                                    2
                                                                  )) ||
                                                                  e.attributes[
                                                                    field
                                                                  ] ||
                                                                  "غير متوفر"
                                                              )}
                                                            </span>
                                                            {this.showEditBtn(
                                                              field,
                                                              e.attributes[
                                                                field
                                                              ]
                                                            ) && (
                                                              <span>
                                                                <button
                                                                  className="btn"
                                                                  style={{
                                                                    marginRight:
                                                                      "20px",
                                                                  }}
                                                                  onClick={this.enableEdit.bind(
                                                                    this,
                                                                    field,
                                                                    mainIndex,
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
                                                              gridTemplateColumns:
                                                                "1fr auto",
                                                            }}
                                                          >
                                                            <input
                                                              key={i}
                                                              className="form-control"
                                                              type="text"
                                                              defaultValue={
                                                                this[
                                                                  "edit_" +
                                                                    field +
                                                                    "_" +
                                                                    mainIndex +
                                                                    "_" +
                                                                    i
                                                                ] ||
                                                                e.attributes[
                                                                  field
                                                                ] ||
                                                                "غير متوفر"
                                                              }
                                                              onChange={this.myChangeHandler.bind(
                                                                this,
                                                                field,
                                                                mainIndex,
                                                                i,
                                                                e
                                                              )}
                                                            />
                                                            <button
                                                              className="btn"
                                                              style={{
                                                                marginRight:
                                                                  "20px",
                                                              }}
                                                              onClick={this.saveEdit.bind(
                                                                this,
                                                                e.id,
                                                                field,
                                                                mainIndex,
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
                                                }
                                              )}
                                              <td>
                                                {/* {id == 92 && (
                                                  <button
                                                    className="btn follow"
                                                    style={{
                                                      margin: "0px 5px",
                                                    }}
                                                    onClick={this.openPopup.bind(
                                                      this,
                                                      mainIndex,
                                                      i
                                                    )}
                                                  >
                                                    حدود و أبعاد الأرض
                                                  </button>
                                                )} */}
                                                <span
                                                  key={i}
                                                  className="toolsBtnStyle center"
                                                  style={{
                                                    width: "100%",
                                                    position: "relative",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                  }}
                                                >
                                                  {id == 92 && (
                                                    <>
                                                      {/* <Tooltip
                                                        placement="bottom"
                                                        title={
                                                          "حدود و أبعاد الأرض"
                                                        }
                                                      >
                                                        <span
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={this.openPopup.bind(
                                                            this,
                                                            mainIndex,
                                                            i
                                                          )}
                                                        >
                                                          <FontAwesomeIcon
                                                            icon={faArrowsAlt}
                                                            size={"1x"}
                                                          />
                                                        </span>
                                                      </Tooltip> */}
                                                      <button
                                                        className="btn follow"
                                                        onClick={this.openPopup.bind(
                                                          this,
                                                          mainIndex,
                                                          i,
                                                          "parcelData"
                                                        )}
                                                      >
                                                        حدود و أبعاد الأرض
                                                      </button>
                                                      <Divider type="vertical" />
                                                      <button
                                                        className="btn follow"
                                                        style={{
                                                          margin: "0px 5px",
                                                        }}
                                                        onClick={this.openPopup.bind(
                                                          this,
                                                          mainIndex,
                                                          i,
                                                          "parcelShatfa"
                                                        )}
                                                      >
                                                        الشطفات
                                                      </button>
                                                      <Divider type="vertical" />
                                                      <button
                                                        className="btn follow"
                                                        style={{
                                                          margin: "0px 5px",
                                                        }}
                                                        onClick={this.openPopup.bind(
                                                          this,
                                                          mainIndex,
                                                          i,
                                                          "parcelElectric"
                                                        )}
                                                      >
                                                        غرفة الكهرباء
                                                      </button>
                                                      <Divider type="vertical" />
                                                    </>
                                                  )}

                                                  {/* {id != 92 && (
                                                  <button
                                                    className=" btn btn-danger "
                                                    onClick={this.remove.bind(
                                                      this,
                                                      mainIndex,
                                                      i
                                                    )}
                                                  >
                                                    حذف
                                                  </button>
                                                )} */}
                                                  {/* <button
                                                  className=" btn btn-primary "
                                                  onClick={this.zoom.bind(
                                                    this,
                                                    e,
                                                    serviceDataItem
                                                  )}
                                                >
                                                  اختيار
                                                </button>
                                                <button
                                                  className=" btn btn-primary "
                                                  onClick={this.highlight.bind(
                                                    this,
                                                    e,
                                                    serviceDataItem
                                                  )}
                                                >
                                                  تحديد
                                                </button> */}

                                                  <Tooltip
                                                    placement="bottom"
                                                    title={t(`actions:Zoom`)}
                                                  >
                                                    <span
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={this.highlight.bind(
                                                        this,
                                                        e,
                                                        serviceDataItem
                                                      )}
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={faSearchPlus}
                                                        size={"1x"}
                                                      />
                                                    </span>
                                                    {/* </a> */}
                                                  </Tooltip>
                                                  <Divider type="vertical" />
                                                  {id != 92 && (
                                                    <>
                                                      <Tooltip
                                                        placement="bottom"
                                                        title={t(
                                                          `actions:Delete`
                                                        )}
                                                      >
                                                        <span
                                                          style={{
                                                            cursor: "pointer",
                                                          }}
                                                          onClick={this.remove.bind(
                                                            this,
                                                            mainIndex,
                                                            i
                                                          )}
                                                        >
                                                          <FontAwesomeIcon
                                                            icon={faTrash}
                                                            size={"1x"}
                                                          />
                                                        </span>
                                                      </Tooltip>

                                                      <Divider type="vertical" />
                                                    </>
                                                  )}
                                                </span>
                                              </td>
                                            </tr>
                                          );
                                        }
                                      )}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                          </>
                        )
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
)(ServiceIdentifyComponent);
