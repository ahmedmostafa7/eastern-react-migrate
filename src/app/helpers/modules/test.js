import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
//import {Button, Form, Tooltip } from 'antd';
import RenderField from "app/components/inputs";
import { serverFieldMapper } from "app/helpers/functions";
import coorFields from "./fields";
import { LoadModules } from "../common/esri_loader";
import { esriRequest } from "../common/esri_request";
import Loading from "../../../../../loading/loading2";
import {
  queryTask,
  intersectQueryTask,
  project,
  withInQueryTask,
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
      fields: coorFields.map((f) => serverFieldMapper(f)),
      value: 1,
      submitting: false,
      loading: false,
      error: "",
      polygonPoints: [],
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
      x: null,
      y: null,
    };
  }

  componentDidMount() {
    document.title = "استعلام عن موقع بالنسبة لحد التنمية";
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
      loading: true,
    });
    var count = 0;
    if (count === 1) {
      this.setState({ loading: false });
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
          this.setState({ loading: false });
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
          this.setState({ loading: false });
        } else {
          count++;
        }
      },
    });
  };

  onPlaneChange = (f) => {
    this.setState({ loading: true });
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
          this.setState({ loading: false });
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
          this.setState({ loading: false });
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
          this.setState({ loading: false });
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
      loading: true,
    });

    queryTask({
      ...querySetting(
        this.LayerID.Subdivision,
        `SUBDIVISION_TYPE=${e} AND PLAN_SPATIAL_ID=${this.state.planId}`,
        false,
        ["SUBDIVISION_DESCRIPTION", "SUBDIVISION_SPATIAL_ID"]
      ),
      callbackResult: (res) => {
        this.setState({
          subDivNames: res.features,
          spinning: false,
          loading: false,
        });
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
      loading: true,
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
          loading: false,
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
    this.setState({ loading: true });
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
        this.setState({ loading: false });
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
    this.setState({ loading: true });
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
        this.setState({ loading: false });
        this.parcelGeo = res.features[0].geometry;
        highlightFeature(res.features[0], this.map, {
          layerName: "SelectGraphicLayer",
          strokeColor: [0, 0, 0],
          isHighlighPolygonBorder: true,
          highlightWidth: 3,
          isZoom: true,
          zoomFactor: 50,
        });
      },
    });
  };
  //#endregion
  OnParcelSelect = () => {
    this.setState({ loading: true });

    intersectQueryTask({
      url: mapUrl + "/" + this.LayerID.UrbanAreaBoundary,
      geometry: this.parcelGeo,
      outFields: ["URBAN_BOUNDARY_TYPE"],
      callbackResult: (res) => {
        getFeatureDomainName(res.features, this.LayerID.UrbanAreaBoundary).then(
          (result) => {
            this.selectedParcels = this.selectedParcels || [];
            this.selectedParcels.push({
              parcel: this.parcelPlanNo,
              urban: result[0]
                ? result.map((t) => t.attributes.URBAN_BOUNDARY_TYPE).join("-")
                : null,
              dev: result.length,
            });
            this.setState({
              selectedParcels: this.selectedParcels,
              loading: false,
            });
          }
        );
      },
    });
    this.setState({
      munval: undefined,
      planeval: undefined,
      subTypeval: undefined,
      parcelval: undefined,
      blockval: undefined,
      subNameval: undefined,
      parcelId: null,
    });
    // this.state.parcelId
  };
  onRadioChange = (e) => {
    this.setState({ value: e.target.value });
  };

  addPoint = (e) => {
    LoadModules(["esri/geometry/Point"]).then(([Point]) => {
      //let polygon = new Polygon({"rings":[rings],"spatialReference":spatialReference})

      let test = new Point({
        x: parseFloat(this.state.x),
        y: parseFloat(this.state.y),
        spatialReference: { wkid: 4326 },
      });

      document.getElementById("coorForm").reset();

      this.polygonPoints = this.polygonPoints || [];
      //console.log(t[0])
      this.polygonPoints.push(test);

      this.setState({ polygonPoints: this.polygonPoints, x: null, y: null });
    });
  };
  zoomtopoint = (e) => {
    this.setState({ loading: true });
    LoadModules(["esri/geometry/Polygon", "esri/geometry/Point"]).then(
      ([Polygon, Point]) => {
        project(this.polygonPoints, 102100, (t) => {
          //this.setState({ loading: false });

          let polygon = new Polygon({
            rings: [
              t.map((polygon) => {
                return [polygon.x, polygon.y];
              }),
            ],
            spatialReference: this.map.spatialReference,
          });

          withInQueryTask({
            url: mapUrl + "/" + this.LayerID.UrbanAreaBoundary,
            geometry: polygon,
            outFields: ["URBAN_BOUNDARY_TYPE"],
            callbackResult: (res) => {
              getFeatureDomainName(
                res.features,
                this.LayerID.UrbanAreaBoundary
              ).then((result) => {
                this.selectedParcelsByCoor = this.selectedParcelsByCoor || [];
                this.selectedParcelsByCoor.push({
                  urban: result[0]
                    ? result
                        .map((t) => t.attributes.URBAN_BOUNDARY_TYPE)
                        .join("-")
                    : null,
                  dev: result.length,
                });
                this.setState({
                  selectedParcelsByCoor: this.selectedParcelsByCoor,
                  loading: false,
                  polygonPoints: [],
                });
              });
            },
          });

          highlightFeature([{ geometry: polygon }], this.map, {
            layerName: "SelectGraphicLayer",
            isZoom: true,
            zoomFactor: 10,
            isHighlighPolygonBorder: true,
            strokeColor: [0, 255, 255],
          });
        });

        /*let test = new Point({
        x: parseFloat(e.x),
        y: parseFloat(e.y),
        spatialReference: {
          wkid: 4326
        }
      });
      project(test, 102100, t => {
        this.setState({ loading: false });
        highlightFeature({ geometry: t[0] }, this.map, {
          layerName: "SelectGraphicLayer",
          isZoom: true,
          zoomFactor:10,
          isHiglightSymbol: true,
          highlighColor: [0, 0, 0, 0.25]
        });
      });*/
      }
    );
  };

  handleDelete(index) {
    this.polygonPoints.splice(index, 1);
    this.setState({ polygonPoints: this.polygonPoints });
  }

  DelCoor = (index) => {
    this.selectedParcelsByCoor = this.selectedParcelsByCoor.filter(
      (e, i) => i !== index
    );
    this.setState({ selectedParcelsByCoor: this.selectedParcelsByCoor });
  };
  DelParcel = (index) => {
    this.selectedParcels = this.selectedParcels.filter((e, i) => i !== index);
    this.setState({ selectedParcels: this.selectedParcels });
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
  render() {
    const { loading } = this.state;
    const { handleSubmit } = this.props;
    return (
      <div>
        {loading ? <Loading /> : false}

        <div className="thirdComp-style">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "5fr 1fr",
            }}
          >
            <MapComponent mapload={this.mapload} />
            <div className="side-third">
              <Radio.Group
                onChange={this.onRadioChange}
                value={this.state.value}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto",
                  width: "180px",
                  margin: "auto",
                }}
              >
                <Radio value={1}>بيانات الأرض</Radio>
                <Radio value={2}>الأحداثيات</Radio>
              </Radio.Group>
              <div
                style={{
                  display: "grid",
                  padding: "15px",
                  gridGap: "10px",
                }}
              >
                {this.state.value == 1 ? (
                  <div>
                    <div>
                      <div>
                        <label>البلدية</label>
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
                      <label>المخطط</label>
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
                        value={this.state.planeval}
                        placeholder="رقم المخطط"
                        notFoundContent="not found"
                      >
                        {this.state.PlanNum.map((d, i) => {
                          return (
                            <Option key={i} value={d.i}>
                              {d.attributes.PLAN_NO}
                            </Option>
                          );
                        })}
                      </Select>
                    </div>
                    <div>
                      <label> نوع التقسيم</label>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        onChange={this.onSubTypeChange}
                        showSearch
                        disabled={!this.state.subDivType.length}
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
                        {this.state.subDivType.map((e, i) => (
                          <Option key={i} value={e.code}>
                            {e.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label>اسم التقسيم</label>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        onChange={this.onSubNameChange}
                        showSearch
                        disabled={!this.state.subDivNames.length}
                        placeholder="اسم التقسيم"
                        value={this.state.subNameval}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            ?.toLowerCase()
                            ?.indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.subDivNames.map((e, i) => (
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
                      <label>رقم البلك</label>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        onChange={this.onBlockChange}
                        showSearch
                        disabled={!this.state.blockNum.length}
                        value={this.state.blockval}
                        placeholder="رقم البلك"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.children
                            ?.toLowerCase()
                            ?.indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {this.state.blockNum.map((e, i) => (
                          <Option key={i} value={e.attributes.BLOCK_SPATIAL_ID}>
                            {e.attributes.BLOCK_NO}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label>رقم قطعة الارض</label>
                      <Select
                        getPopupContainer={(trigger) => trigger.parentNode}
                        onChange={this.onLandParcelChange}
                        showSearch
                        disabled={!this.state.parcelNum.length}
                        onSearch={(e) => {
                          this.setState({ parcelSearch: e });
                        }}
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
                          .map((e, i) => {
                            return (
                              <Option key={e.i} value={e.i}>
                                {e.attributes.PARCEL_PLAN_NO}
                              </Option>
                            );
                          })}
                      </Select>
                    </div>
                    <button
                      className="btn btn-success"
                      style={{ display: "grid", margin: "9% auto" }}
                      disabled={this.state.parcelId === null}
                      onClick={this.OnParcelSelect}
                    >
                      اضافة الارض
                    </button>
                  </div>
                ) : (
                  <div>
                    <Form
                      id="coorForm"
                      className="top1"
                      style={{ display: "grid", gridTemplateColumns: "14vw" }}
                    >
                      <div>
                        <label>خطوط الطول</label>
                        <input
                          className="ant-input"
                          type="number"
                          placeholder="ex 26.424895"
                          required={true}
                          value={this.state.y}
                          onChange={this.updateYValue}
                        />

                        <label>دوائر العرض</label>
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
                          type="submit"
                          className="btn btn-warning"
                          onClick={handleSubmit(this.addPoint)}
                        >
                          {" "}
                          إضافة النقطة
                        </button>
                        <button
                          type="submit"
                          disabled={this.state.polygonPoints.length < 3}
                          className="btn btn-success"
                          onClick={handleSubmit(this.zoomtopoint)}
                        >
                          {" "}
                          معاينة الموقع
                        </button>
                      </div>
                      {this.state.polygonPoints.length > 0 && (
                        <div style={{ marginTop: "20px" }}>
                          <table>
                            <thead>
                              <th>خطوط الطول</th>
                              <th>دوائر العرض</th>
                            </thead>
                            <tbody>
                              {this.state.polygonPoints.map((point, k) => {
                                return (
                                  <tr key={k}>
                                    <td>{point.y}</td>
                                    <td>{point.x}</td>
                                    <td>
                                      <button
                                        className=" btn btn-danger "
                                        onClick={this.handleDelete.bind(
                                          this,
                                          k
                                        )}
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
                )}
              </div>
            </div>
          </div>
          {this.state.value == 1 ? (
            <div
              style={{
                direction: "rtl",
                height: "24vh",
                overflow: "auto",
              }}
            >
              {this.state.selectedParcels.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>رقم قطعة الارض</th>
                      <th>النطاق العمرانى</th>
                      <th>حد التنميه</th>
                      <th>اجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.selectedParcels.map((e, i) => {
                      console.log(this.state.selectedParcels);
                      return (
                        <tr key={i}>
                          <td>{e.parcel}</td>
                          <td>{e.urban}</td>
                          <td>
                            {e.dev ? (
                              <span>
                                <i className="fa fa-check"></i>
                              </span>
                            ) : (
                              <span>
                                <i className="fa fa-times"></i>
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              className=" btn btn-danger "
                              onClick={() => {
                                this.DelParcel(i);
                              }}
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                false
              )}
            </div>
          ) : (
            <div
              style={{
                direction: "rtl",
                height: "24vh",
                overflow: "auto",
              }}
            >
              {this.state.selectedParcelsByCoor.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>النطاق العمرانى</th>
                      {/* <th>رقم قطعة الارض</th> */}
                      <th>حد التنميه</th>
                      <th>اجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.selectedParcelsByCoor.map((e, i) => {
                      return (
                        <tr key={i}>
                          <td>{e.urban}</td>
                          {/* <td>{e.parcel}</td> */}
                          <td>
                            {e.dev ? (
                              <span>
                                <i className="fa fa-check"></i>
                              </span>
                            ) : (
                              <span>
                                <i className="fa fa-times"></i>
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              className=" btn btn-danger "
                              onClick={() => {
                                this.DelCoor(i);
                              }}
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                false
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default reduxForm({ form: "Add" })(ThirdIdentifire);
