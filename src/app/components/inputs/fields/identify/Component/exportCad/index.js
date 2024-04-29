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
  uploadGISFile,
  localizeNumber,
  convertToArabic,
} from "../common/common_func";
import { mapUrl } from "../mapviewer/config/map";
import { Select, Button, Checkbox } from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import { connect } from "react-redux";
import { querySetting, selectDis } from "./Helpers";
var uniqid = require("uniqid");
import { slice } from "lodash";
import Axios from "axios";
import { workFlowUrl } from "../../../../../../../imports/config";
import store from "app/reducers";
const { Option } = Select;

class IdentifyExportCad extends Component {
  constructor(props) {
    super(props);
    this.PlanNum = [];
    this.planId = null;
    this.parcelTs = [];
    this.selectedLandsT = [];
    this.selectedLands = [];
    this.selectionMode = false;
    this.parcel_fields = ["PARCEL_PLAN_NO"];

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
    };
  }
  LayerID = [];

  convertToArabic(num) {
    if (num) {
      var id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "٧", "۸", "۹"];
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
    getInfo().then((res) => {
      this.LayerID = res;
      esriRequest(mapUrl + "/" + this.LayerID.Municipality_Boundary).then(
        (response) => {
          this.setState({
            MunicipalityNames:
              response.types[0].domains.MUNICIPALITY_NAME.codedValues,
          });
        }
      );
    });
  }

  onMunChange = (e) => {
    //
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
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
      subDivType: [],
      parcelId: null,
      parcelNum: [],
    });
    this.planId = null;

    queryTask({
      ...querySetting(
        this.LayerID.Municipality_Boundary,
        `MUNICIPALITY_NAME='${e}'`,
        true,
        ["MUNICIPALITY_NAME"]
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
        `MUNICIPALITY_NAME='${e}'`,
        false,
        ["PLAN_SPATIAL_ID", "PLAN_NO"]
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
  };

  resetFields = () => {
    this.props.onChange([]);
    this.setState({ selectedLands: [], selectedLandsT: [] });
  };

  onPlaneChange = (f) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");

    var planSpatialId = this.state.PlanNum.filter((m) => m.i == f)?.[0]
      ?.attributes?.PLAN_SPATIAL_ID;
    this.setState({
      plan_no: this.state.PlanNum.filter((m) => m.i == f)?.[0]?.attributes
        ?.PLAN_NO,
      planeval: f,
      subTypeval: undefined,
      subNameval: undefined,
      blockval: undefined,
      parcelval: undefined,
      blockNum: [],
      subDivNames: [],
      subDivType: [],
      parcelId: null,
      parcelNum: [],
    });

    queryTask({
      ...querySetting(
        this.LayerID.Plan_Data,
        `PLAN_SPATIAL_ID='${planSpatialId}'`,
        true,
        ["MUNICIPALITY_NAME"]
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
        `PLAN_SPATIAL_ID='${planSpatialId}'`,
        false,
        ["BLOCK_NO", "BLOCK_SPATIAL_ID"]
      ),
      callbackResult: (res) => {
        this.setState({ blockNum: res.features });
      },
    });
    queryTask({
      ...querySetting(
        this.LayerID.Landbase_Parcel,
        `PLAN_SPATIAL_ID='${planSpatialId}'`,
        false,
        ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
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
    esriRequest(mapUrl + "/" + this.LayerID.Subdivision).then((response) => {
      this.setState({ subDivType: response.fields[7].domain.codedValues });
    });
  };
  onSubTypeChange = (e) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    this.setState({
      subType_name: this.state.subDivType.filter((m) => m.code == e)[0].name,
      subTypeval: e,
      subNameval: undefined,
      blockval: undefined,
      parcelval: undefined,
    });

    queryTask({
      ...querySetting(
        this.LayerID.Subdivision,
        `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${this.planId}`,
        false,
        ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"]
      ),
      callbackResult: (res) => {
        this.setState({ subDivNames: res.features });
      },
    });
  };

  onSubNameChange = (e) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    this.setState({
      subName_name: this.state.subDivNames.filter(
        (m) => m.attributes.SUBDIVISION_SPATIAL_ID == e
      )?.[0]?.attributes?.SUBDIVISION_DESCRIPTION,
      subNameval: e,
      blockval: undefined,
      parcelval: undefined,
      parcelNum: [],
      parcelId: null,
    });

    queryTask({
      ...querySetting(
        this.LayerID.Subdivision,
        `SUBDIVISION_SPATIAL_ID=${e}`,
        true,
        ["SUBDIVISION_SPATIAL_ID"]
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
        `SUBDIVISION_SPATIAL_ID=${e}`,
        false,
        ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
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
  };

  onBlockChange = (e) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
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
        `BLOCK_SPATIAL_ID=${e}`,
        true,
        ["BLOCK_SPATIAL_ID"]
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
        `BLOCK_SPATIAL_ID=${e}`,
        false,
        ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
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
  };

  onLandParcelChange = (f) => {
    if (!this.state.selectedLands.length) {
      var e = this.state.parcelNum.filter((m) => m.i === f)?.[0]?.attributes
        ?.PARCEL_SPATIAL_ID;
      this.setState({ parcelId: e, parcelval: f });
      this.RolBackPol = this.pol;
      this.RolBackParcelNum = this.state.parcelNum;

      queryTask({
        ...querySetting(
          this.LayerID.Landbase_Parcel,
          `PARCEL_SPATIAL_ID='${e}'`,
          true,
          ["PARCEL_SPATIAL_ID"]
        ),
        callbackResult: (res) => {
          this.selectedLandsT = [];
          highlightFeature(res.features[0], this.map, {
            layerName: "SelectGraphicLayer",
            strokeColor: [0, 0, 0],
            highlightWidth: 3,
            isHighlighPolygonBorder: true,
            isZoom: true,
            zoomFactor: 50,
          });
        },
      });
    } else {
      var g = this.state.parcelNum.filter((m) => m.i == f)[0];
      this.setState({ parcelId: g.attributes.PARCEL_SPATIAL_ID });
      highlightFeature(g, this.map, {
        layerName: "SelectGraphicLayer",
        strokeColor: [0, 0, 0],
        isHighlighPolygonBorder: true,
        highlightWidth: 3,
      });
      this.setState({ parcelval: f });
    }
  };

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
        layerName: "SelectLandsGraphicLayer",
        noclear: true,
        isZoom: true,
        attr: { isParcel: true },
        isHighlighPolygonBorder: true,
        zoomFactor: 50,
      });

      this.props.input.onChange({
        conditions: this.state.conditions,
        temp: {
          map: this.map,
          mun: this.props.input.value.temp.mun,
          plan: this.props.input.value.temp.plan,
          subtype: this.props.input.value.temp.subtype,
          subname: this.props.input.value.temp.subname,
          block: this.props.input.value.temp.block,
          parcel: this.props.input.value.temp.parcel,
        },
        parcels: [...this.props.input.value.parcels],
      });
    }
    this.setState({ mapLoaded: true });
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
    this.props.input.onChange({
      ...this.props.input.value,
      parcels: [...this.props.input.value.parcels],
    });
    this.setState({
      [name + "_isEdit_" + i]: false,
      selectedLands: [...this.state.selectedLands],
    });
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
            });
          }
        },
      });
    }
  };

  setToStore = (r) => {
    /* this.props.input.onChange({
        conditions:this.state.conditions,
        temp : {
          map:this.map,
          mun:this.state.munval,
          plan:this.state.plan_no,
          subtype:this.state.subType_name,
          subname:this.state.subName_name,
          block:this.state.block_no,
          parcel:this.state.parcelval
        } , parcels:[...this.state.selectedLands,
        {attributes: r[0].attributes, id: this.state.parcelId,
      geometry: JSON.parse(JSON.stringify(r[0].geometry))}]
    })
*/
    this.state.selectedLands.push({
      geometry: r[0].geometry,
      attributes: r[0].attributes,
      id: this.state.parcelId,
    });
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

  // allInOneCADChanged = (item, evt) => {
  //
  //   this.setState({ allInOne: evt.target.checked });
  // };

  remove = (item) => {
    this.state.selectedLands.pop(item);
    //const values = slice(this.props.input.value.parcels, 0, -1)
    //this.props.input.onChange([...values])
    if (this.state.selectedLandsT) {
      this.state.selectedLandsT.pop(item);
    }

    this.DrawGraph();

    this.setState({
      selectedLands: [...this.state.selectedLands],
      // allInOne:
      //   this.state.selectedLands.length > 1 ? this.state["allInOne"] : false,
    });
  };

  close = () => {
    this.props.history.goBack();
  };

  exportCad = () => {
    console.log(this.state.selectedLands);

    var polygons = this.state.selectedLands;
    var cadPolygons = [];
    var jsonParcel;

    polygons.forEach((polygon) => {
      jsonParcel = {
        geometry: polygon.geometry,
        attributes: {
          Layer: "boundry",
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
    //cadPolygons.push(jsonParcel);

    // Axios.post(workFlowUrl + "/exportCadDes/", cadPolygons).then((data) => {
    //   window.location.href =
    //     window.location.protocol + "//" + window.location.hostname + data.data;
    // });

    // store.dispatch({ type: "Show_Loading_new", loading: true });

    // let featuresList = [];
    // if (!this.state["allInOne"]) {
    //   polygons.forEach((polygon) => {
    //     featuresList.push(
    //       `{"SDE.Landbase_Parcel": "PARCEL_PLAN_NO = '${polygon.attributes.PARCEL_PLAN_NO}' AND PARCEL_SPATIAL_ID = ${polygon.attributes.PARCEL_SPATIAL_ID}"}`
    //     );
    //   });
    // } else {
    //   featuresList.push(
    //     `{"SDE.Landbase_Parcel": "PARCEL_PLAN_NO IN (${polygons
    //       .map((polygon) => `'${polygon.attributes.PARCEL_PLAN_NO}'`)
    //       .join(",")}) AND PARCEL_SPATIAL_ID IN (${polygons
    //       .map((polygon) => polygon.attributes.PARCEL_SPATIAL_ID)
    //       .join(",")})"}`
    //   );
    // }
    //
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
      <div className="cadPageScroll">
        <div className={!fullMapWidth ? "content-section implementation" : ""}>
          {mapLoaded && (
            <div
              className={"exportCAD"}
              style={{
                width: "25vw",
                // boxShadow: "1px 1px 3px black",
                padding: "10px",
                margin: "0px -104px 0px 0px",
              }}
            >
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
                autoFocus
                onChange={this.onMunChange}
                showSearch
                value={this.state.munval}
                placeholder="اختر اسم البلدية"
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
                onChange={this.onPlaneChange}
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
                onChange={this.onSubTypeChange}
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
                {subDivNames
                  /// .slice(0, 100)
                  .map((e, i) => (
                    <Option key={i} value={e.attributes.SUBDIVISION_SPATIAL_ID}>
                      {" "}
                      {e.attributes.SUBDIVISION_DESCRIPTION}
                    </Option>
                  ))}
              </Select>
              <Select
                getPopupContainer={(trigger) => trigger.parentNode}
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
                      {localizeNumber(e.attributes.BLOCK_NO)}
                    </Option>
                  ))}
              </Select>
              <Select
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
                      option.props.children?.indexOf(convertToArabic(input)) !=
                      -1
                    );
                  } else {
                    return false;
                  }
                }}
                value={parcelval}
                placeholder="رقم قطعة الأرض"
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
              <br />
              <Button
                className="add-gis"
                disabled={this.state.parcelId === null}
                onClick={this.OnParcelSelect}
                style={{
                  margin: "15px 108px 0px 0px",
                }}
              >
                إضافة الأرض
              </Button>
            </div>
          )}
          <MapComponent mapload={this.mapLoaded.bind(this)}></MapComponent>
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
                      <th>رقم قطعة الأرض</th>
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
                              {/* {selectedLands.length > 1 && (
                                <Checkbox
                                  onChange={this.allInOneCADChanged.bind(
                                    this,
                                    e
                                  )}
                                  checked={this.state["allInOne"]}
                                >
                                  استيراد ملف واحد لكل الأراضي
                                </Checkbox>
                              )} */}
                              <button
                                className="btn btn-success"
                                style={{ marginRight: "20px" }}
                                onClick={this.exportCad.bind(this, e)}
                              >
                                إستيراد ملف أوتوكاد
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

        <button
          className=" btn btn-danger "
          onClick={this.close.bind(this)}
          style={{ float: "left", marginTop: "50px" }}
        >
          إغلاق
        </button>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(IdentifyExportCad);
