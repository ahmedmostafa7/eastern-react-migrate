import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
//import {Button, Form, Tooltip } from 'antd';
import RenderField from "app/components/inputs";
import { serverFieldMapper } from "app/helpers/functions";
import coorFields from "./fields";
import { LoadModules } from "../common/esri_loader";
import { esriRequest } from "../common/esri_request";
import {
  queryTask,
  intersectQueryTask,
  project,
  getInfo,
  highlightFeature,
  clearGraphicFromLayer,
  getFeatureDomainName,
} from "../common/common_func";
import { mapUrl } from "../mapviewer/config/map";
import { Select, Button, Form, Spin, Radio } from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import CoorIdentify from "../identifyByCoor/index";
import { querySetting, selectDis } from "./Helpers";
import { loadModules } from "esri-loader";
import MapBtnsComponent from "../MapBtnsComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import { connect } from "react-redux";
var uniqid = require("uniqid");
const { Option } = Select;

class ThirdIdentifire extends Component {
  constructor() {
    super();
    this.fields = coorFields.map((f) => serverFieldMapper(f));
    this.map = null;
    this.parcelPlanNo = null;
    this.parcelSpatialId = null;
    this.selectedParcels = [];
    this.selectedParcelsByCoor = [];
    this.parcelGeo = null;
    this.PlanNum = [];
    this.parcelTs = [];
    this.selectionMode = false;
    this.state = {
      identifyMethod: 1,
      submitting: false,
      error: "",
      selectedParcels: [],
      selectedParcelsByCoor: [],
      selectedCoor: [],
      munval: undefined,
      planeval: undefined,
      subTypeval: undefined,
      subNameval: undefined,
      blockval: undefined,
      parcelval: undefined,
      spinning: false,
      planId: null,
      blockNum: [],
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

  componentDidMount() {
    getInfo().then((res) => {
      this.LayerID = res;
      esriRequest(mapUrl + "/" + this.LayerID.Municipality_Boundary).then(
        (response) => {
          console.log(response);
          this.setState({
            MunicipalityNames:
              response.types[0].domains.MUNICIPALITY_NAME.codedValues,
          });
        }
      );
    });
  }
  mapload = (map) => {
    this.map = map;
    this.props.setCurrentMap(map);
  };

  //#region SELECT Change
  onMunChange = (e) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    this.setState({
      munval: e,
      planeval: undefined,
      subTypeval: undefined,
      subNameval: undefined,
      blockval: undefined,
      parcelval: undefined,
      PlanNum: [],
      planId: null,
      blockNum: [],
      subDivNames: [],
      subDivType: [],
      parcelId: null,
      parcelNum: [],
      spinning: true,
    });
    var count = 0;
    if (count === 1) {
      this.setState({ spinning: false });
    } else {
      count++;
    }
    queryTask({
      ...querySetting(
        this.LayerID.Municipality_Boundary,
        `MUNICIPALITY_NAME="${e}"`,
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

        if (count === 1) {
          this.setState({ spinning: false });
        } else {
          count++;
        }
      },
    });

    queryTask({
      ...querySetting(
        this.LayerID.Plan_Data,
        `MUNICIPALITY_NAME="${e}"`,
        false,
        ["PLAN_SPATIAL_ID", "PLAN_NO"]
      ),
      callbackResult: (res) => {
        this.setState({
          PlanNum: res.features.map((e, i) => {
            return { ...e, i: uniqid() };
          }),
        });

        if (count === 1) {
          this.setState({ spinning: false });
        } else {
          count++;
        }
      },
    });
  };

  onPlaneChange = (f) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    // this.props.restSelect()
    var e = this.state.PlanNum.filter((m) => m.i == f)?.[0]?.attributes
      ?.PLAN_SPATIAL_ID;
    this.setState({
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
      spinning: true,
    });
    var count = 0;
    queryTask({
      ...querySetting(this.LayerID.Plan_Data, `PLAN_SPATIAL_ID="${e}"`, true, [
        "MUNICIPALITY_NAME",
      ]),
      callbackResult: (res) => {
        this.pol = res.features[0];
        highlightFeature(res.features[0], this.map, {
          layerName: "SelectGraphicLayer",
          isZoom: true,
          isHiglightSymbol: true,
          highlighColor: [0, 0, 0, 0.25],
        });
        this.setState({ planId: e });
        if (count == 2) {
          this.setState({ spinning: false });
        } else {
          count++;
        }
      },
    });
    queryTask({
      ...querySetting(
        this.LayerID.Survey_Block,
        `PLAN_SPATIAL_ID="${e}"`,
        false,
        ["BLOCK_NO", "BLOCK_SPATIAL_ID"]
      ),
      callbackResult: (res) => {
        this.setState({ blockNum: res.features });
        if (count == 2) {
          this.setState({ spinning: false });
        } else {
          count++;
        }
      },
    });
    queryTask({
      ...querySetting(
        this.LayerID.Landbase_Parcel,
        `PLAN_SPATIAL_ID="${e}"`,
        false,
        ["PARCEL_SPATIAL_ID", "PARCEL_PLAN_NO"]
      ),
      callbackResult: (res) => {
        this.setState({
          parcelSearch: null,
          parcelNum: res.features.map((e, i) => {
            return { ...e, i };
          }),
        });
        if (count == 2) {
          this.setState({ spinning: false });
        } else {
          count++;
        }
      },
    });
    esriRequest(mapUrl + "/" + this.LayerID.Subdivision).then((response) => {
      this.setState({ subDivType: response.fields[7].domain.codedValues });
    });
  };
  onSubTypeChange = (e) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    this.setState({
      subTypeval: e,
      subNameval: undefined,
      blockval: undefined,
      parcelval: undefined,
      spinning: true,
    });

    queryTask({
      ...querySetting(
        this.LayerID.Subdivision,
        `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${this.state.planId}`,
        false,
        ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"]
      ),
      callbackResult: (res) => {
        this.setState({ subDivNames: res.features, spinning: false });
      },
    });
  };
  onSubNameChange = (e) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    this.setState({
      subNameval: e,
      blockval: undefined,
      parcelval: undefined,
      parcelNum: [],
      parcelId: null,
      spinning: true,
    });
    var count = 0;

    queryTask({
      ...querySetting(
        this.LayerID.Subdivision,
        `SUBDIVISION_SPATIAL_ID=${e}`,
        true,
        ["SUBDIVISION_SPATIAL_ID"]
      ),
      callbackResult: (res) => {
        //this.setState({subDivNames:res.features,spinning:false})
        this.pol = res.features[0];
        highlightFeature(res.features[0], this.map, {
          layerName: "SelectGraphicLayer",
          isZoom: true,
          isHiglightSymbol: true,
          highlighColor: [0, 0, 0, 0.25],
        });

        if (count == 1) {
          this.setState({ spinning: false });
        } else {
          count++;
        }
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
            return { ...e, i };
          }),
        });
        if (count == 1) {
          this.setState({ spinning: false });
        } else {
          count++;
        }
      },
    });
  };

  onBlockChange = (e) => {
    clearGraphicFromLayer(this.map, "SelectLandsGraphicLayer");
    this.setState({
      blockval: e,
      parcelval: undefined,
      parcelId: null,
      parcelNum: [],
      spinning: true,
    });
    var count = 0;

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
        if (count === 1) {
          this.setState({ spinning: false });
        } else {
          count++;
        }
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
            return { ...e, i };
          }),
        });
        if (count == 1) {
          this.setState({ spinning: false });
        } else {
          count++;
        }
      },
    });
  };

  onLandParcelChange = (f) => {
    console.log(f, this.state.parcelNum);

    var e = this.state.parcelNum.filter((m) => m.i === f)?.[0]?.attributes;
    this.parcelPlanNo = e.PARCEL_PLAN_NO;
    this.setState({
      spinning: true,
      parcelId: e.PARCEL_SPATIAL_ID,
      parcelval: f,
    });

    queryTask({
      ...querySetting(
        this.LayerID.Landbase_Parcel,
        `PARCEL_SPATIAL_ID="${e.PARCEL_SPATIAL_ID}"`,
        true,
        ["PARCEL_SPATIAL_ID"]
      ),
      callbackResult: (res) => {
        this.parcelGeo = res.features[0].geometry;
        highlightFeature(res.features[0], this.map, {
          layerName: "SelectGraphicLayer",
          strokeColor: [255, 255, 0],
          isHighlighPolygonBorder: true,
          highlightWidth: 8,
          isZoom: true,
          zoomFactor: 50,
        });
      },
    });
  };
  //#endregion
  OnParcelSelect = () => {
    intersectQueryTask({
      url: mapUrl + "/" + this.LayerID.UrbanAreaBoundary,
      geometry: this.parcelGeo,
      outFields: ["URBAN_BOUNDARY_TYPE"],
      callbackResult: (res) => {
        getFeatureDomainName(res.features, this.LayerID.UrbanAreaBoundary).then(
          (result) => {
            this.selectedParcels.push({
              parcel: this.parcelPlanNo,
              urban: result[0]
                ? result.map((t) => t.attributes.URBAN_BOUNDARY_TYPE).join()
                : null,
            });
            this.setState({ selectedParcels: this.selectedParcels });
          }
        );

        //
        //     this.selectedParcels.push({parcel:this.parcelPlanNo,urban:res.features[0]?res.features[0].attributes.URBAN_BOUNDARY_TYPE:null})
        //     this.setState({selectedParcels:this.selectedParcels})
      },
    });
  };
  onRadioChange = (e) => {
    this.setState({ identifyMethod: e.target.value });
    console.log(e);
  };

  addPoint = (e) => {
    LoadModules(["esri/geometry/Point"]).then(([Point]) => {
      //let polygon = new Polygon({"rings":[rings],"spatialReference":spatialReference})

      let test = new Point({
        x: parseFloat(e.x),
        y: parseFloat(e.y),
        spatialReference: { wkid: 32639 },
      });
      project(test, 32639, (t) => {
        intersectQueryTask({
          url: mapUrl + "/" + this.LayerID.UrbanAreaBoundary,
          geometry: t[0],
          outFields: ["URBAN_BOUNDARY_TYPE"],
          callbackResult: (res) => {
            getFeatureDomainName(
              res.features,
              this.LayerID.UrbanAreaBoundary
            ).then((result) => {
              this.selectedParcelsByCoor.push({
                x: e.x,
                y: e.y,
                urban: result[0]
                  ? result.map((t) => t.attributes.URBAN_BOUNDARY_TYPE).join()
                  : null,
              });
              this.setState({
                selectedParcelsByCoor: this.selectedParcelsByCoor,
              });
            });
          },
        });
      });
    });
  };
  zoomtopoint = (e) => {
    LoadModules(["esri/geometry/Point"]).then(([Point]) => {
      //let polygon = new Polygon({"rings":[rings],"spatialReference":spatialReference})

      let test = new Point({
        x: parseFloat(e.x),
        y: parseFloat(e.y),
        spatialReference: { wkid: 32639 },
      });
      project(test, 32639, (t) => {
        highlightFeature({ geometry: t[0] }, this.map, {
          layerName: "SelectGraphicLayer",
          isZoom: true,
          isHiglightSymbol: true,
          highlighColor: [0, 0, 0, 0.25],
        });
      });
    });
  };
  render() {
    const { handleSubmit } = this.props;
    return (
      <div style={{ background: "white" }}>
        <div>
          <MapBtnsComponent {...this.props}></MapBtnsComponent>
        </div>
        <div>
          <MapComponent mapload={this.mapload} {...this.props} />
        </div>
        <Radio.Group onChange={this.onRadioChange} value={this.state.value}>
          <Radio value={1}>بيانات الأرض</Radio>
          <Radio value={2}>الأحداثيات</Radio>
        </Radio.Group>
        <div>
          {this.state.identifyMethod == 1 ? (
            <>
              <div>
                <div>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    autoFocus
                    onChange={this.onMunChange}
                    showSearch
                    value={this.state.munval}
                    style={{ width: 200 }}
                    placeholder="اختر اسم البلديه"
                    disabled={!this.state.MunicipalityNames?.length}
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      if (option.props.children) {
                        return (
                          option.props.children
                            ?.toLowerCase()
                            ?.indexOf(input.toLowerCase()) >= 0
                        );
                      } else {
                        return false;
                      }
                    }}
                  >
                    {this.state.MunicipalityNames?.map((e) => (
                      <Option key={e.code} value={e.code}>
                        {e.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  onChange={this.onPlaneChange}
                  showSearch
                  autoFocus
                  disabled={!this.state.PlanNum.length}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (option.props.children) {
                      return (
                        option.props.children
                          ?.toLowerCase()
                          ?.indexOf(input.toLowerCase()) >= 0
                      );
                    } else {
                      return false;
                    }
                  }}
                  style={{ width: 200 }}
                  value={this.state.planeval}
                  placeholder="رقم المخطط"
                  notFoundContent="not found"
                >
                  {this.state.PlanNum
                    //.slice(0, 100)
                    .map((d, i) => {
                      return (
                        <Option key={i} value={d.i}>
                          {d.attributes.PLAN_NO}
                        </Option>
                      );
                    })}
                </Select>
              </div>
              <div>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  autoFocus
                  onChange={this.onSubTypeChange}
                  showSearch
                  disabled={!this.state.subDivType.length}
                  style={{ width: 200 }}
                  value={this.state.subTypeval}
                  placeholder={"نوع التقسيم"}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (option.props.children) {
                      return (
                        option.props.children
                          ?.toLowerCase()
                          ?.indexOf(input.toLowerCase()) >= 0
                      );
                    } else {
                      return false;
                    }
                  }}
                >
                  {this.state.subDivType
                    //.slice(0, 100)
                    .map((e, i) => (
                      <Option key={i} value={e.code}>
                        {e.name}
                      </Option>
                    ))}
                </Select>
              </div>
              <div>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  autoFocus
                  onChange={this.onSubNameChange}
                  showSearch
                  disabled={!this.state.subDivNames.length}
                  style={{ width: 200 }}
                  placeholder="اسم التقسيم"
                  value={this.state.subNameval}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      ?.toLowerCase()
                      ?.indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.subDivNames
                    //.slice(0, 100)
                    .map((e, i) => (
                      <Option
                        key={i}
                        value={e.attributes.SUBDIVISION_SPATIAL_ID}
                      >
                        {e.attributes.SUBDIVISION_DESCRIPTION}
                      </Option>
                    ))}
                </Select>
              </div>
              <div>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  autoFocus
                  onChange={this.onBlockChange}
                  showSearch
                  disabled={!this.state.blockNum.length}
                  style={{ width: 200 }}
                  value={this.state.blockval}
                  placeholder="رقم البلك"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children
                      ?.toLowerCase()
                      ?.indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.blockNum
                    //.slice(0, 100)
                    .map((e, i) => (
                      <Option key={i} value={e.attributes.BLOCK_SPATIAL_ID}>
                        {e.attributes.BLOCK_NO}
                      </Option>
                    ))}
                </Select>
              </div>
              <div>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  autoFocus
                  onChange={this.onLandParcelChange}
                  showSearch
                  disabled={!this.state.parcelNum.length}
                  onSearch={(e) => {
                    this.setState({ parcelSearch: e });
                  }}
                  style={{ width: 200 }}
                  value={this.state.parcelval}
                  placeholder="رقم قطعة الارض"
                  optionFilterProp="children"

                  //  filterOption={(input, option)=>
                  //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  // }
                >
                  {this.state.parcelNum
                    .filter((e, i) => {
                      if (this.state.parcelSearch) {
                        return (
                          i < 100 &&
                          e.attributes.PARCEL_PLAN_NO &&
                          e.attributes.PARCEL_PLAN_NO.toLowerCase().indexOf(
                            this.state.parcelSearch.toLowerCase()
                          ) >= 0
                        );
                      } else {
                        return i < 1000 && e.attributes.PARCEL_PLAN_NO;
                      }
                    })
                    .slice(0, 100)
                    .map((e, i) => {
                      return (
                        <Option key={e.i} value={e.i}>
                          {e.attributes.PARCEL_PLAN_NO}
                        </Option>
                      );
                    })}
                </Select>
              </div>
              <Button
                type="danger"
                disabled={this.state.parcelId === null}
                onClick={this.OnParcelSelect}
              >
                إضافة الأرض
              </Button>
              <table>
                <thead>
                  <tr>
                    <th>رقم قطعة الارض</th>
                    <th>النطاق العمرانى</th>
                    <th>حد التنميه</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.selectedParcels.map((e, i) => {
                    console.log(this.state.selectedParcels);
                    return (
                      <tr key={i}>
                        <td>{e.parcel}</td>
                        <td>{e.urban}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div>
              <Form layout="inline" className="top1">
                {this.fields.map((field) => {
                  return (
                    <Field
                      key={field.name}
                      name={field.name}
                      component={RenderField}
                      {...field}
                    />
                  );
                })}

                <button type="submit" onClick={handleSubmit(this.zoomtopoint)}>
                  {" "}
                  معاينة النقطه
                </button>
                <button type="submit" onClick={handleSubmit(this.addPoint)}>
                  {" "}
                  اضافة النقطه
                </button>
              </Form>
              <table>
                <thead>
                  <tr>
                    <th>دائرة العرض</th>
                    <th>خط الطول</th>
                    <th>النطاق العمرانى</th>
                    <th>حد التنميه</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.selectedParcelsByCoor.map((e, i) => {
                    console.log(this.state.selectedParcelsByCoor);
                    return (
                      <tr key={i}>
                        <td>{e.x}</td>
                        <td>{e.y}</td>
                        <td>{e.urban}</td>
                        <td>{e.parcel}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default reduxForm({ form: "Add" })(
  connect(mapStateToProps, mapDispatchToProps)(ThirdIdentifire)
);
