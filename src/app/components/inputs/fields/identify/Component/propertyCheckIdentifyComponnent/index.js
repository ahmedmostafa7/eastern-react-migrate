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
  resetMapData,
  resizeMap,
  project,
} from "../common/common_func";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapPin,
  faSearchPlus,
  faTrash,
  faArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import applyFilters from "main_helpers/functions/filters";
import {
  geometryServiceUrl,
  propetryCheckMapUrl,
} from "../mapviewer/config/map";
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
  omit,
} from "lodash";
import { LoadModules } from "../common/esri_loader";
import axios from "axios";
import ArchiveModal from "./ArchiveModal/ArchiveModal";
import PdfViewer from "./PdfViewer/PdfViewer";
import { workFlowUrl } from "../../../../../../../imports/config";
import {
  getParcels,
  onBlockChange,
  onDistrictChange,
  onLandParcelChange,
  onMunChange,
  onPlaneChange,
  onSearch,
  onSubNameChange,
  onSubTypeChange,
} from "../common/filters_objects";

const { Option } = Select;
export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "serviceLands"),
    ...mapDispatchToProps1(dispatch),
  };
};
class propertyCheckIdentifyComponent extends Component {
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
      //"PARCEL_BLOCK_NO",
      "DISTRICT_NAME",
      //"SUBDIVISION_TYPE",
      //"SUBDIVISION_DESCRIPTION",
      //"USING_SYMBOL",
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
        },
        // north_length_text: {
        //   label: "طول الحد الشمالي بالأحرف",
        //   value: 0,
        //   required: true,
        // },
        north_desc: {
          label: "وصف الحد الشمالي",
          value: "",
          required: true,
        },
        south_length: {
          label: "طول الحد الجنوبي",
          value: 0,
          required: true,
        },
        // south_length_text: {
        //   label: "طول الحد الجنوبي بالأحرف",
        //   value: 0,
        //   required: true,
        // },
        south_desc: {
          label: "وصف الحد الجنوبي",
          value: "",
          required: true,
        },
        east_length: {
          label: "طول الحد الشرقي",
          value: 0,
          required: true,
        },
        // east_length_text: {
        //   label: "طول الحد الشرقي بالأحرف",
        //   value: 0,
        //   required: true,
        // },
        east_desc: {
          label: "وصف الحد الشرقي",
          value: "",
          required: true,
        },
        west_length: {
          label: "طول الحد الغربي",
          value: 0,
          required: true,
        },
        // west_length_text: {
        //   label: "طول الحد الغربي بالأحرف",
        //   value: 0,
        //   required: true,
        // },
        west_desc: {
          label: "وصف الحد الغربي",
          value: "",
          required: true,
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
        parcel.districtval?.code == props.input.value?.temp?.districtval &&
        parcel.subNameval?.code == props.input.value?.temp?.subname &&
        parcel.blockval?.code == props.input.value?.temp?.block
      );
    });
    //}

    this.state = {
      mapLoaded: false,
      SUBMISSIONNO: null,
      munval:
        serviceParcel?.munval?.code ||
        props.input.value?.temp?.mun ||
        undefined,
      districtval:
        serviceParcel?.districtval?.code ||
        props.input.value?.temp?.districtval ||
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
      Districts: [],
      PlanNum: serviceParcel?.PlanNum || [],
      parcelId: null,
      mapExtend: null,
      parcelSearch: null,
      poly: null,
      landsData: {},
      isFirstStep: props?.currentModule?.id == 104,
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

      this.draw?.deactivate();
      this.map.enableMapNavigation();
    }
  }

  checkDrawAvailability = () => {
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });
    if (values?.landData?.landData_type == 2) {
      if (!this.draw) {
        this.draw = window.Draw(this.map, { showTooltips: true });
        this.draw.activate(esri.toolbars.Draw.POLYGON);
        this.map.disableMapNavigation();
        var symbol_pin = new esri.symbol.SimpleFillSymbol(
          esri.symbol.SimpleFillSymbol.STYLE_NULL,
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.Color([0, 0, 0]),
            3
          ),
          new esri.Color([0, 0, 0])
        );
        this.draw.on("draw-complete", (evt) => {
          if (
            (this.props.currentModule.app_id == 27 ||
              this.props.currentModule.record.app_id == 27) &&
            this.state.serviceData.length
          ) {
            return;
          }
          let id = uniqid();
          let layer = this.map.getLayer("SelectGraphicLayer");
          var graphic = new esri.Graphic(evt.geometry, symbol_pin, {
            PARCEL_PLAN_NO: "",
            PARCEL_AREA: "",
            PARCEL_BLOCK_NO: "",
            DISTRICT_NAME: this.state.districtval.name || "",
            SUBDIVISION_TYPE: "",
            SUBDIVISION_DESCRIPTION: "",
            USING_SYMBOL: "",
            ID: id,
            MUNICIPALITY_NAME: this.state.munval.code,
          });
          layer.add(graphic);
          this.RolBackPol = this.pol;
          this.setToStore([graphic], values?.landData?.landData_type);
        });
      } else {
        this.draw.activate(esri.toolbars.Draw.POLYGON);
      }
    }
  };
  componentDidMount() {
    const {
      currentModule: { id },
    } = this.props;
    if (window.isAkarApp) {
      console.log("window", window);
      this.parcel_fields = [
        "PARCEL_PLAN_NO",
        "PARCEL_AREA",
        //"PARCEL_BLOCK_NO",
        "DISTRICT_NAME",
        //"SUBDIVISION_TYPE",
        //"SUBDIVISION_DESCRIPTION",
        //"USING_SYMBOL",
      ];
    }
    getInfo(propetryCheckMapUrl).then((res) => {
      this.LayerID = res;
      window.filterUrl = propetryCheckMapUrl;
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
                MunicipalityNames: fcs,
              },
              () => {
                this.loadLists = true;

                if (this.state.munval) {
                  onMunChange(this, this.state.munval, () => {
                    onDistrictChange(this, this.state.districtval, () => {
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
      // queryTask({
      //   url: propetryCheckMapUrl + "/" + this.LayerID.UnplannedParcels,
      //   where: "1=1",
      //   outFields: ["MUNICIPALITY_NAME"],
      //   returnDistinctValues: true,
      //   returnGeometry: false,
      //   callbackResult: ({ features }) => {
      //     getFeatureDomainName(
      //       features,
      //       this.LayerID.UnplannedParcels,
      //       false,
      //       propetryCheckMapUrl
      //     ).then((res) => {
      //       this.setState({
      //         MunicipalityNames: res.map((r) => {
      //           return {
      //             code: r.attributes.MUNICIPALITY_NAME_Code,
      //             name: r.attributes.MUNICIPALITY_NAME,
      //           };
      //         }),
      //       });
      //     });
      //   },
      // });
    });
  }

  // onDistrictChange = (e) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

  //   const {
  //     values,
  //     currentModule: { id },
  //   } = this.props;
  //   this.setState({
  //     districtval: e,
  //     parcelval: undefined,
  //     parcelId: null,
  //     parcelNum: [],
  //     parcelData: this.parcelData,
  //     plan_no: undefined,
  //   });

  //   queryTask({
  //     url: propetryCheckMapUrl + "/" + this.LayerID.District_Boundary,
  //     where: `DISTRICT_NAME ='${e}'`,
  //     outFields: ["DISTRICT_NAME"],
  //     returnGeometry: true,
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

  //   this.getServiceParcels(null, e, null, null);
  // };

  // onMunChange = (e) => {
  //   //

  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");
  //   let serviceDataItem =
  //     this.state.serviceData?.find(
  //       (item) =>
  //         item.munval?.code == e &&
  //         item.districtval?.code == undefined &&
  //         item.subNameval?.code == undefined &&
  //         item.blockval?.code == undefined
  //     ) || {};
  //   const {
  //     values,
  //     currentModule: { id },
  //   } = this.props;
  //   this.setState({
  //     munval: e,
  //     districtval: undefined,
  //     parcelval: undefined,
  //     parcelId: null,
  //     parcelNum: [],
  //     parcelData: this.parcelData,
  //     plan_no: undefined,
  //   });
  //   this.planId = null;

  //   queryTask({
  //     url: propetryCheckMapUrl + "/" + this.LayerID.Municipality_Boundary,
  //     where: `MUNICIPALITY_NAME='${e}'`,
  //     outFields: ["MUNICIPALITY_NAME"],
  //     returnGeometry: true,
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
  //   this.GetDistrictByMunID(e);
  //   this.getServiceParcels(e, null, null, null);
  // };

  // GetDistrictByMunID = (e) => {
  //   queryTask({
  //     url: propetryCheckMapUrl + "/" + this.LayerID.UnplannedParcels,
  //     where: `MUNICIPALITY_NAME='${e}'`,
  //     outFields: ["DISTRICT_NAME"],
  //     returnDistinctValues: true,
  //     returnGeometry: false,
  //     callbackResult: ({ features }) => {
  //       getFeatureDomainName(
  //         features,
  //         this.LayerID.UnplannedParcels,
  //         false,
  //         propetryCheckMapUrl
  //       ).then((res) => {
  //         this.setState({
  //           Districts: res.map((r) => {
  //             return {
  //               code: r.attributes.DISTRICT_NAME_Code,
  //               name: r.attributes.DISTRICT_NAME,
  //             };
  //           }),
  //         });
  //       });
  //     },
  //   });
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
    onMunChange(this, undefined);
    this.props.input.onChange({});
    this.setState({ serviceData: [] });
  };

  getServiceParcels = (munval, districtval, subNameval, blockval) => {
    var district = this.state.Districts.find((m) => m.code == districtval);

    let whereStr = ``;
    whereStr +=
      (munval &&
        ` ${
          whereStr ? " AND " : " "
        }MUNICIPALITY_NAME='${munval}' AND SUBMISSIONNO IS NULL`) ||
      "";
    whereStr +=
      (district &&
        ` ${whereStr ? " AND " : " "}DISTRICT_NAME='${
          district.code
        }' AND PARCEL_PLAN_NO IS NOT NULL AND SUBMISSIONNO IS NULL`) ||
      "";
    /*whereStr +=
      (subNameval &&
        ` ${whereStr ? " AND " : " "}SUBDIVISION_SPATIAL_ID=${subNameval}`) ||
      "";
    whereStr +=
      (blockval &&
        ` ${whereStr ? " AND " : " "}BLOCK_SPATIAL_ID=${blockval}`) ||
      "";*/

    queryTask({
      url: propetryCheckMapUrl + "/" + this.LayerID.UnplannedParcels,
      where: `${whereStr}`,
      outFields: ["*"],
      returnGeometry: true,
      callbackResult: (res) => {
        let mun = this.state.MunicipalityNames?.filter(
          (e) => e?.code == munval
        ).map((e) => ({ code: e.code, name: e.name }))[0];
        let district = this.state.Districts.filter(
          (d, i) => d.code == districtval
        )?.[0];
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
            serviceDataItem.districtval?.code == districtval &&
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
                districtval: district,
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
  //         item.districtval?.code == this.state.districtval &&
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
  //         item.districtval?.code == this.state.districtval &&
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
  //   this.getServiceParcels(this.state.munval, this.state.districtval, e, null);
  // };

  // onBlockChange = (e) => {
  //   clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
  //   clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

  //   let serviceDataItem =
  //     this.state.serviceData?.find(
  //       (item) =>
  //         item.munval?.code == this.state.munval &&
  //         item.districtval?.code == this.state.districtval &&
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
  //     this.state.districtval,
  //     this.state.subNameval,
  //     e
  //   );
  // };

  // onLandParcelChange = (f) => {
  //   //;
  //   let serviceDataItem = this.state.serviceData?.find(
  //     (item) =>
  //       item.munval?.code == this.state.munval &&
  //       item.districtval?.code == this.state.districtval &&
  //       item.subNameval?.code == this.state.subNameval &&
  //       item.blockval?.code == this.state.blockval
  //   );
  //   let selectedLands = serviceDataItem?.selectedLands || [];

  //   var e = (serviceDataItem?.parcelNum || this.state.parcelNum)?.filter(
  //     (m) => m.i === f
  //   )?.[0]?.attributes?.PARCEL_SPATIAL_ID;

  //   var s = (serviceDataItem?.parcelNum || this.state.parcelNum)?.filter(
  //     (m) => m.i === f
  //   )?.[0]?.attributes?.SUBMISSIONNO;

  //   this.setState({
  //     parcelId: e,
  //     parcelval: f,
  //     SUBMISSIONNO: s,
  //   });
  //   this.RolBackPol = this.pol;
  //   this.RolBackParcelNum =
  //     serviceDataItem?.parcelNum || this.state.parcelNum || [];

  //   queryTask({
  //     url: propetryCheckMapUrl + "/" + this.LayerID.UnplannedParcels,
  //     where: `PARCEL_SPATIAL_ID='${e}'`,
  //     outFields: ["PARCEL_SPATIAL_ID"],
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

  onLandParcelChangeById = (f, serviceDataItem) => {
    //;

    let selectedLands = serviceDataItem?.selectedLands || [];
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    clearGraphicFromLayer(this.map, "SelectGraphicLayer");
    clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");
    if (serviceDataItem.landData_type == 1) {
      this.setState({
        parcelId: f,
      });
      this.RolBackPol = this.pol;
      this.RolBackParcelNum = serviceDataItem?.parcelNum || [];
      queryTask({
        ...querySetting(
          this.LayerID.UnplannedParcels,
          `PARCEL_SPATIAL_ID='${f}'`,
          true,
          ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
        ),
        returnGeometry: true,
        callbackResult: (res) => {
          if (serviceDataItem && !selectedLands.length) {
            serviceDataItem.selectedLandsT = [];
          }

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
    } else {
      let polygon = new esri.geometry.Polygon(
        serviceDataItem?.selectedLands?.find((land) => land.id == f)?.geometry
      );
      highlightFeature(polygon, this.map, {
        layerName: "SelectGraphicLayer",
        strokeColor: [0, 0, 0],
        highlightWidth: 3,
        isHighlighPolygonBorder: true,
        isZoom: true,
        zoomFactor: 50,
      });
      addParcelNo(
        polygon.getExtent().getCenter(),
        this.map,
        serviceDataItem?.selectedLands?.find((land) => land.id == f)?.attributes
          ?.PARCEL_PLAN_NO + "",
        "ParcelPlanNoGraphicLayer",
        14,
        [0, 0, 0]
      );
    }
  };

  addParcelToSelect = () => {
    let selectedLands =
      this.props.mainObject?.landData?.landData?.lands?.parcels[0].parcelNum;
    if (selectedLands && selectedLands.length > 0) {
      this.setState({
        parcelId: selectedLands[selectedLands.length - 1]?.attributes.OBJECTID,
      });

      intersectQueryTask({
        outFields: [
          "SUBMISSIONNO",
          "PARCEL_PLAN_NO",
          "PARCEL_SPATIAL_ID",
          "OBJECTID",
        ],
        geometry: new esri.geometry.Polygon(
          selectedLands[selectedLands.length - 1].geometry
        ),
        url: propetryCheckMapUrl + "/" + this.LayerID.UnplannedParcels,
        where:
          "PARCEL_PLAN_NO is not null AND SUBMISSIONNO IS NOT NULL AND OBJECTID <> " +
          selectedLands[selectedLands.length - 1]?.attributes.OBJECTID,
        callbackResult: (res) => {
          res.features = res.features.map((e, i) => {
            return {
              ...e,
              i: uniqid(),
            };
          });

          this.setState({
            parcelSearch: null,
            parcelNum: res.features.map((e, i) => {
              return {
                ...e,
                i,
              };
            }),
          });

          this.state.serviceData[0].parcelNum = res.features.map((e, i) => {
            return {
              ...e,
              i,
            };
          });
        },
        distance: 30,
      });
      //this.DrawGraph();
    }
  };

  DrawGraph = (serviceDataItem) => {
    let selectedLands = serviceDataItem?.selectedLands || [];
    if (!selectedLands.length) {
      this.map.graphics.clear();
      clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      highlightFeature(
        serviceDataItem.RolBackPol || this.RolBackPol,
        this.map,
        {
          layerName: "SelectGraphicLayer",
          isZoom: true,
          isHiglightSymbol: true,
          highlighColor: [255, 0, 0, 0.25],
        }
      );

      this.setState({
        parcelSearch: null,
        parcelNum: this.RolBackParcelNum,
        parcelval: undefined,
      });
    } else {
      this.parcelDis = selectDis(serviceDataItem?.selectedLandsT || []);
      console.log(this.parcelDis);
      this.setAdjacentToStore(this.parcelDis);
      this.setState({ parcelSearch: null }); //, parcelNum: this.parcelDis

      clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
      clearGraphicFromLayer(this.map, "SelectGraphicLayer");
      clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

      highlightFeature(
        this.parcelDis.filter(
          (element) =>
            !selectedLands.find(
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
            !selectedLands.find(
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

    if (!this.state.isFirstStep) {
      this.map.on("click", (evt) => {
        intersectQueryTask({
          outFields: [
            "SUBMISSIONNO",
            "PARCEL_PLAN_NO",
            "PARCEL_SPATIAL_ID",
            "OBJECTID",
          ],
          geometry: evt.mapPoint,
          url: propetryCheckMapUrl + "/" + this.LayerID.UnplannedParcels,
          callbackResult: (res) => {
            if (res.features.length)
              this.openArchive(res.features[0].attributes.SUBMISSIONNO);
          },
        });
      });

      setTimeout(() => {
        if (
          this.props?.mainObject?.data_msa7y?.msa7yData?.cadDetails
            ?.suggestionsParcels
        ) {
          var polygonZoom = new esri.geometry.Polygon(
            this.props.mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels[0].polygon
          );

          project([polygonZoom], this.map.spatialReference.wkid, (res) => {
            highlightFeature({ geometry: res[0] }, this.map, {
              layerName: "SelectLandsGraphicLayer",
              strokeColor: [0, 0, 0],
              highlightWidth: 3,
              isHighlighPolygonBorder: true,
              isZoom: true,
              zoomFactor: 50,
            });
          });
        }
      }, 500);
    }

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

    resizeMap(map);

    this.setState({ mapLoaded: true });
    this.props.setCurrentMap(map);

    if (!this.state.isFirstStep) this.addParcelToSelect();
  };

  myChangeHandler = (name, mainIndex, i, event) => {
    //;
    this["edit_" + name + "_" + mainIndex + "_" + i] = event.target.value;
  };

  enableEdit(name, mainIndex, i) {
    this.setState({ [name + "_isEdit_" + mainIndex + "_" + i]: true });
  }

  showEditBtn(name, value) {
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });
    if (values?.landData?.landData_type == 1 && name == "USING_SYMBOL") {
      return value == null;
    } else {
      let defaultArr = [
        "PARCEL_AREA",
        "PARCEL_BLOCK_NO",
        "DISTRICT_NAME",
        "SUBDIVISION_TYPE",
        "SUBDIVISION_DESCRIPTION",
        "Natural_Area",
      ];

      return (
        [
          ...defaultArr,
          ...Object.keys(
            omit(
              _.reduce(this.parcel_fields, (a, b) => ({ ...a, [b]: b }), {}),
              (values?.landData?.landData_type == 1 && this.parcel_fields) ||
                defaultArr
            )
          ),
        ].indexOf(name) > -1
      );
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

  OnParcelSelect = () => {
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });
    if (
      (this.props.currentModule.app_id == 27 ||
        this.props.currentModule.record.app_id == 27) &&
      this.state.serviceData.length
    ) {
      return;
    }
    this.setState({ parcelval: undefined });
    //clearGraphicFromLayer(this.map, "SelectGraphicLayer");
    //clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    let serviceDataItem = this.state.serviceData?.find(
      (item) =>
        item.munval?.code == this.state.munval &&
        item.districtval?.code == this.state.districtval &&
        item.subNameval?.code == this.state.subNameval &&
        item.blockval?.code == this.state.blockval
    );

    let selectedLands = serviceDataItem?.selectedLands || [];
    if (!selectedLands.filter((e) => e.id === this.state.parcelId).length) {
      queryTask({
        url: propetryCheckMapUrl + "/" + this.LayerID.UnplannedParcels,
        where: `PARCEL_SPATIAL_ID =${this.state.parcelId}`,
        returnGeometry: true,
        outFields: ["*"],
        callbackResult: (res) => {
          //this.validation(res.features[0]).then((result) => {

          getFeatureDomainName(
            res.features,
            this.LayerID.UnplannedParcels,
            false,
            propetryCheckMapUrl
          ).then((r) => {
            // intersectQueryTask({
            //   outFields: ["SRVC_SUBTYPE"],
            //   geometry: new esri.geometry.Polygon(r[0].geometry),
            //   url: mapUrl + "/" + this.LayerID.Service_Data,
            //   callbackResult: (serviceRes) => {
            //     //
            //     getFeatureDomainName(
            //       serviceRes.features,
            //       this.LayerID.Service_Data
            //     ).then((serviceDomainsRes) => {
            //       r[0].attributes = {
            //         ...r[0].attributes,
            //         SRVC_SUBTYPE:
            //           (serviceDomainsRes.length &&
            //             serviceDomainsRes[0].attributes.SRVC_SUBTYPE) ||
            //           null,
            //         SRVC_SUBTYPE_Code:
            //           (serviceDomainsRes.length &&
            //             serviceDomainsRes[0].attributes.SRVC_SUBTYPE_Code) ||
            //           null,
            //       };
            //       //
            //       this.setToStore(r, this.props.values?.landData_type);
            //       this.addParcelToSelect();
            //     });
            //   },
            // });
            this.setToStore(r, values?.landData?.landData_type);

            clearGraphicFromLayer(this.map, "ParcelPlanNoGraphicLayer");

            addParcelNo(
              r[0].geometry.getExtent().getCenter(),
              this.map,
              r[0].attributes.PARCEL_PLAN_NO + "",
              "ParcelPlanNoGraphicLayer",
              20,
              [0, 0, 0]
            );

            //this.DrawGraph();
            //this.addParcelToSelect();
          });
        },
      });
    }
  };

  setToStore = (r, landData_type) => {
    let index = this.state.serviceData?.findIndex(
      (item) =>
        item.munval?.code == this.state.munval &&
        item.districtval?.code == this.state.districtval &&
        item.subNameval?.code == this.state.subNameval &&
        item.blockval?.code == this.state.blockval
    );
    const {
      input: { value },
    } = this.props;

    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });
    let mun = this.state.MunicipalityNames?.filter(
      (e) => e?.code == this.state.munval
    ).map((e) => ({ code: e.code, name: e.name }))[0];
    let district = this.state.Districts.filter(
      (d, i) => d.code == this.state.districtval
    )?.[0];
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

    if (r /* && landData_type == 1*/) {
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
          districtval: district,
          subNameval: subName,
          blockval: block,
          subTypeval: subType,
          landData_type: values?.landData?.landData_type,
          PlanNum: this.state.PlanNum,
          parcelNum: this.state?.parcelNum || [],
          blockNum: this.state?.blockNum || [],
          subDivNames: this.state?.subDivNames || [],
          subDivType: this.state?.subDivType || [],
          RolBackPol: this.pol,
          selectedLands: [
            {
              attributes: r[0].attributes,
              id: this.state.parcelId,
              geometry: JSON.parse(JSON.stringify(r[0].geometry)),
              symbol: r[0].symbol,
            },
          ],
          selectedLandsT: [],
        });
      }
    } else if (r && landData_type == 2) {
      //;
      if (index != -1) {
        if (r?.[0] != undefined) {
          this.state.serviceData[index].selectedLands =
            (!this.state.serviceData[index].selectedLands.length && [
              {
                attributes: r[0].attributes,
                id: this.state.parcelId || uniqid(),
                geometry: JSON.parse(JSON.stringify(r[0].geometry)),
              },
            ]) || [
              ...this.state.serviceData[index].selectedLands,
              {
                attributes: r[0].attributes,
                id: this.state.parcelId || uniqid(),
                geometry: JSON.parse(JSON.stringify(r[0].geometry)),
              },
            ] ||
            [];
        }
      } else {
        this.state.serviceData.push({
          munval: mun,
          districtval: district,
          subNameval: subName,
          blockval: block,
          subTypeval: subType,
          landData_type: values?.landData?.landData_type,
          currentExtent: r.currentExtent || this.pol,
          noOfAvailableServiceParcels: this.state?.parcelNum?.length || 0,
          PlanNum: this.state.PlanNum,
          parcelNum: this.state?.parcelNum || [],
          blockNum: this.state?.blockNum || [],
          subDivNames: this.state?.subDivNames || [],
          subDivType: this.state?.subDivType || [],
          RolBackPol: this.pol,
          selectedLands:
            (r?.[0] != undefined && [
              {
                attributes: r[0].attributes,
                id: this.state.parcelId || uniqid(),
                geometry: JSON.parse(JSON.stringify(r[0].geometry)),
                symbol: r[0].symbol,
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
        districtval: this.state.districtval,
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

  LandHoverOn = (f) => {
    let serviceDataItem = this.state.serviceData?.find(
      (item) =>
        item.munval?.code == this.state.munval &&
        item.districtval?.code == this.state.districtval &&
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
        item.districtval?.code == this.state.districtval &&
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
    this.setState({
      munval: this.state.serviceData[mainIndex]?.munval?.code || undefined,
      districtval:
        this.state.serviceData[mainIndex]?.districtval?.code || undefined,
      subTypeval:
        this.state.serviceData[mainIndex]?.subTypeval?.code || undefined,
      subNameval:
        this.state.serviceData[mainIndex]?.subNameval?.code || undefined,
      blockval: this.state.serviceData[mainIndex]?.blockval?.code || undefined,
      parcelId:
        this.state.serviceData[mainIndex]?.selectedLands[index]?.attributes
          ?.ID || undefined,
      PlanNum: this.state.serviceData[mainIndex]?.PlanNum || [],
      blockNum: this.state.serviceData[mainIndex]?.blockNum || [],
      subDivNames: this.state.serviceData[mainIndex]?.subDivNames || [],
      subDivType: this.state.serviceData[mainIndex]?.subDivType || [],
      parcelNum: this.state.serviceData[mainIndex]?.parcelNum || [],
    });
    let landData_type = this.state.serviceData[mainIndex].landData_type;
    if (landData_type == 2) {
      this.removeGraphicByProperty(
        this.map.getLayer("SelectGraphicLayer"),
        "ID",
        (index != -1 &&
          this.state.serviceData[mainIndex]?.selectedLands[index]?.attributes
            ?.ID) ||
          null
      );
    }
    if (index != -1) {
      this.state.serviceData[mainIndex].selectedLands.splice(index, 1);
      if (!this.state.serviceData[mainIndex].selectedLands.length) {
        clearGraphicFromLayer(this.map, "SelectGraphicLayer");
        clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
        onMunChange(this, this.state.serviceData[mainIndex].munval.code);
        this.state.serviceData.splice(mainIndex, 1);
      } else if (landData_type == 1) {
        let length = this.state.serviceData[mainIndex].selectedLands.length;
        this.doHighlightOrZoom(
          this.state.serviceData[mainIndex].selectedLands[length - 1],
          this.state.serviceData[mainIndex],
          false
        );
        this.DrawGraph(this.state.serviceData[mainIndex]);
      }
    } else {
      this.state.serviceData[mainIndex].selectedLands = [];
      this.DrawGraph(this.state.serviceData[mainIndex]);
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
        districtval: this.state.districtval,
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

  openArchiveMessage = () => {
    message.info("من فضلك قم باختيار قطعة الأرض المراد عرض الأرشيف الخاص بها");
  };

  openArchive = (parcel) => {
    let url = `https://webgis.eamana.gov.sa/GISAPIV2/GetCorrespondenceInfo?displayNo=${parcel}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        let archiveData = res.data;
        this.setState({ archiveDataModal: archiveData });
      })
      .catch((err) => {
        console.log(err);
        //notificationMessage("حدث خطأ أثناء استرجاع البيانات", 5);
      });
  };

  openPopup = (mainIndex, index) => {
    //;
    var fields = this.parcelData.fields;
    let thisScope = this;
    const vals = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: {
            ...this.state.serviceData[mainIndex].selectedLands[index]
              .parcelData,
          },
          ok(values) {
            thisScope.state.serviceData[mainIndex].selectedLands[
              index
            ].parcelData = values;
            thisScope.setToStore(null, vals.landData.landData_type);
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  zoom = (e, serviceDataItem, evt) => {
    this.doHighlightOrZoom(e, serviceDataItem, false);
  };

  removeGraphicByProperty = (graphicLayer, graphicPropertyName, value) => {
    graphicLayer.graphics
      .filter((graphic) => {
        return (
          !value ||
          (value &&
            graphic.attributes &&
            graphic.attributes[graphicPropertyName] == value)
        );
      })
      ?.forEach((graphic) => {
        graphicLayer.remove(graphic);
      });
  };

  doHighlightOrZoom = (e, serviceDataItem, isHighlight) => {
    //;
    const {
      currentModule: { id },
    } = this.props;
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
      munval: serviceDataItem?.munval?.code || undefined,
      districtval: serviceDataItem?.districtval?.code || undefined,
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
      this.onLandParcelChangeById(e?.id, serviceDataItem);
    } else {
      this.state.parcelId = null;
      this.getServiceParcels(
        serviceDataItem?.munval?.code,
        serviceDataItem?.districtval?.code,
        serviceDataItem?.subNameval?.code,
        serviceDataItem?.blockval?.code
      );
    }
  };

  highlight = (e, serviceDataItem, evt) => {
    this.doHighlightOrZoom(e, serviceDataItem, true);
  };

  closeArchiveModal = () => {
    this.setState({ archiveDataModal: null });
  };

  render() {
    const {
      parcelData,
      serviceData,
      MunicipalityNames,
      subDivType,
      subDivNames,
      subNameval,
      blockNum,
      blockval,
      PlanNum,
      mapLoaded,
      districtval,
      parcelSearch,
      parcelNum,
      parcelval,
      Districts,
      isFirstStep,
      archiveDataModal,
    } = this.state;
    let serviceDataItem =
      serviceData?.find(
        (item) =>
          item.munval?.code == this.state.munval &&
          item.districtval?.code == this.state.districtval &&
          item.subNameval?.code == this.state.subNameval &&
          item.blockval?.code == this.state.blockval
      ) || {};
    const {
      fullMapWidth,
      //values,
      currentModule: { id },
      t,
    } = this.props;
    const values = applyFilters({
      key: "FormValues",
      form: "stepForm",
    });

    return (
      <div>
        {archiveDataModal && (
          <ArchiveModal
            isOpen={true}
            galleryData={archiveDataModal}
            closeModal={() => this.closeArchiveModal()}
          >
            <PdfViewer
              isOpen={true}
              data={archiveDataModal}
              closeModal={() => this.closeArchiveModal()}
              title={"أرشيف الأراضي الخام"}
            />
          </ArchiveModal>
        )}

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
              {isFirstStep && (
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
                    !this.state.MunicipalityNames.length || !isFirstStep
                  }
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
              )}

              {isFirstStep && (
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  autoFocus
                  onChange={(val) => {
                    onDistrictChange(this, val);
                  }}
                  showSearch
                  value={this.state.districtval}
                  placeholder="اختر اسم الحي"
                  disabled={!this.state.Districts.length || !isFirstStep}
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
                  {Districts
                    //.slice(0, 100)
                    .map((e) => (
                      <Option key={e.code} value={e.code}>
                        {e.name}{" "}
                      </Option>
                    ))}
                </Select>
              )}

              {
                <>
                  {isFirstStep && (
                    <Select
                      getPopupContainer={(trigger) => trigger.parentNode}
                      autoFocus
                      onChange={(val) => {
                        onLandParcelChange(this, val);
                      }}
                      showSearch
                      disabled={
                        parcelNum &&
                        !parcelNum.filter(
                          (parcel) => parcel.attributes.PARCEL_PLAN_NO != null
                        ).length
                      }
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
                      placeholder={
                        isFirstStep
                          ? "رقم قطعة الارض"
                          : "رقم قطعة الأرض المجاورة"
                      }
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
                  )}

                  {isFirstStep ? (
                    <Button
                      className="add-gis"
                      disabled={
                        this.state.parcelId === null || serviceData.length > 0
                      }
                      onClick={this.OnParcelSelect}
                    >
                      إضافة الارض
                    </Button>
                  ) : (
                    <Button
                      className="add-gis"
                      style={{ padding: "5px" }}
                      onClick={this.openArchiveMessage.bind(
                        this,
                        this.state.SUBMISSIONNO
                      )}
                    >
                      أرشيف الأراضي الخام
                    </Button>
                  )}
                </>
              }
            </div>
          )}

          <MapComponent
            mapload={this.mapload.bind(this)}
            {...this.props}
          ></MapComponent>
        </div>
        {mapLoaded && isFirstStep && (
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
                        serviceDataItem?.selectedLands?.length > 0 && (
                          <>
                            <tr key={mainIndex}>
                              <td>البلدية</td>
                              <td>{serviceDataItem?.munval?.name}</td>
                              {serviceDataItem?.districtval?.name && (
                                <>
                                  <td>الحي</td>
                                  <td>
                                    {convertToArabic(
                                      serviceDataItem?.districtval?.name
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
                              {serviceDataItem.landData_type == 2 && (
                                <td>
                                  <span
                                    key={mainIndex}
                                    className="toolsBtnStyle center"
                                    style={{
                                      width: "100%",
                                      position: "relative",
                                      display: "flex",
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
                                    {isFirstStep && (
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
                            {(this.props.currentModule.app_id == 27 ||
                              this.props.currentModule.record.app_id == 27) && (
                              <tr>
                                <td>وصف الأرض</td>
                                {isFirstStep ? (
                                  <td colSpan={"100%"}>
                                    <input
                                      key={0}
                                      maxLength={500}
                                      className="form-control"
                                      type="text"
                                      defaultValue={
                                        this[
                                          "edit_" +
                                            "PARCEL_DESCRIPTION" +
                                            "_" +
                                            mainIndex +
                                            "_" +
                                            0
                                        ] ||
                                        serviceDataItem?.selectedLands?.[0]
                                          ?.attributes["PARCEL_DESCRIPTION"] ||
                                        ""
                                      }
                                      onChange={(event) => {
                                        this.myChangeHandler(
                                          "PARCEL_DESCRIPTION",
                                          mainIndex,
                                          0,
                                          event
                                        );
                                        this.saveEdit(
                                          serviceDataItem?.selectedLands?.[0]
                                            ?.id,
                                          "PARCEL_DESCRIPTION",
                                          mainIndex,
                                          0
                                        );
                                      }}
                                    />
                                  </td>
                                ) : (
                                  <td colSpan={"100%"}>
                                    {
                                      serviceDataItem?.selectedLands?.[0]
                                        ?.attributes["PARCEL_DESCRIPTION"]
                                    }
                                  </td>
                                )}
                              </tr>
                            )}
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
                                        {/*<th>رقم البلك</th>*/}
                                        <th>الحي</th>
                                        {/*<th>نوع التقسيم</th>
                                        <th>اسم التقسيم</th>*/}
                                        {/*<th>رمز الاستخدام</th>*/}
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
                                                                e.attributes[
                                                                  field
                                                                ] || "غير متوفر"
                                                              )}
                                                            </span>
                                                            {isFirstStep &&
                                                              this.showEditBtn(
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
                                                                i
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
                                                  {
                                                    <>
                                                      {isFirstStep && (
                                                        <button
                                                          className="btn follow"
                                                          onClick={this.openPopup.bind(
                                                            this,
                                                            mainIndex,
                                                            i
                                                          )}
                                                        >
                                                          حدود و أبعاد الأرض
                                                        </button>
                                                      )}
                                                      <Divider type="vertical" />
                                                      {!isFirstStep && (
                                                        <button
                                                          className="btn follow"
                                                          onClick={this.openArchive.bind(
                                                            this,
                                                            e
                                                          )}
                                                        >
                                                          أرشيف الأراضي الخام
                                                        </button>
                                                      )}
                                                      <Divider type="vertical" />
                                                    </>
                                                  }
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
                                                  {isFirstStep && (
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
)(propertyCheckIdentifyComponent);
