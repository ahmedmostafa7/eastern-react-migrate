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
} from "../common/common_func";
import { workFlowUrl } from "configFiles/config";

import { message } from "antd";
import { LoadModules } from "../common/esri_loader";
import { mapUrl } from "../mapviewer/config/map";
import { Select, Button, Form } from "antd";
import "antd/dist/reset.css";
import MapComponent from "../MapComponent/MapComponent";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import { connect } from "react-redux";
import axios from "axios";
import { get } from "lodash";
const { Option } = Select;

class IdentifyServiceRange extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapLoaded: false,
      serviceVal: null,
      serviceSubTypeVal: null,
      servicesSubTypes: [],
      bufferDistance: null,
      servicesTypes: [],
      resultServices: [],
      lands: [],
    };
  }

  componentDidMount() {
    getInfo().then((res) => {
      //
      this.LayerID = res;
    });
  }

  mapLoaded = (map) => {
    this.map = map;

    this.props.setLoading(true);
    axios.get(`${workFlowUrl}/CadLayers/GetAll`).then((response) => {
      this.props.setLoading(false);
      response.data.results = response.data.results.filter((res) => {
        return res.layer_description.indexOf("خدمات") > -1;
      });
      this.setState({ servicesTypes: response.data.results });
    });

    var lands = get(this.props.mainObject, "LandWithCoordinate.landData.lands");

    if (lands) {
      highlightFeature(lands.parcels, this.map, {
        layerName: "SelectLandsGraphicLayer",
        isZoom: true,
        zoomFactor: 10,
        isHighlighPolygonBorder: true,
        highlighColor: [0, 0, 0, 0.7],
      });

      setTimeout(() => {
        lands.parcels.forEach((land) => {
          addParcelNo(
            land.geometry.getExtent().getCenter(),
            this.map,
            land.attributes.PARCEL_PLAN_NO + "",
            "ParcelPlanNoGraphicLayer",
            18,
            [0, 0, 0]
          );
        });
      }, 1000);
    }
    this.setState({ mapLoaded: true });

    this.selectedParcel = lands.parcels[0];
  };

  zoomToParcel = (f) => {
    highlightFeature(this.selectedParcel, this.map, {
      layerName: "SelectLandsGraphicLayer",
      isZoom: true,
      zoomFactor: 10,
      isHighlighPolygonBorder: true,
      highlighColor: [0, 0, 0, 0.7],
    });
  };

  clearBuffer = (f) => {
    this.map.getLayer("BufferGraphicLayer").clear();
  };

  onServieTypeChange = (f) => {
    this.setState({
      serviceVal: f,
      serviceSubTypeVal: null,
      servicesSubTypes:
        this.state.servicesTypes.find((x) => {
          return x.layer_code == f;
        }).cad_sublayers || [],
    });
  };
  onServieSubTypeChange = (f) => {
    this.setState({ serviceSubTypeVal: f });
  };

  getServicesOnBuffer() {
    LoadModules(["esri/geometry/Circle"]).then(([Circle]) => {
      var circleGeometry = new Circle({
        center: this.selectedParcel.geometry.getExtent().getCenter(),
        radius: +this.state.bufferDistance,
        radiusUnit: esri.Units.METERS,
      });

      highlightFeature(circleGeometry, this.map, {
        layerName: "BufferGraphicLayer",
        isZoom: true,
        zoomFactor: 10,
        isHiglightSymbol: true,
        highlighColor: [255, 0, 0, 0.4],
      });

      var where = "";
      if (this.state.serviceSubTypeVal) {
        where = "SRVC_SUBTYPE =" + this.state.serviceSubTypeVal;
      } else {
        console.log(this.state.servicesSubTypes);
        if (this.state.servicesSubTypes) {
          where =
            "SRVC_TYPE='" +
            (this.state.servicesSubTypes[0].sublayer_code + "").substring(
              0,
              3
            ) +
            "'";
        } else {
          where = "SRVC_TYPE=" + this.state.serviceVal;
        }
      }

      intersectQueryTask({
        url:
          mapUrl +
          "/" +
          (this.LayerID.Serivces_Data || this.LayerID.Service_Data),
        geometry: circleGeometry,
        where: where,
        returnGeometry: true,
        outFields: ["SRVC_NAME"],
        callbackResult: (res) => {
          if (res.features && res.features.length == 0) {
            message.warning("لا توجد نتائج لنطاق تأثير الخدمة المختارة");
          } else {
            highlightFeature(res.features, this.map, {
              layerName: "ZoomGraphicLayer",
              isZoom: true,
              zoomFactor: 10,
            });
          }

          this.setState({ resultServices: res.features });
        },
      });
    });
  }

  updateBufferDistance = (evt) => {
    this.setState({
      bufferDistance: evt.target.value,
    });
  };

  highlightService(feature) {
    highlightFeature(feature, this.map, {
      layerName: "highlightGraphicLayer",
      isHiglightSymbol: true,
      isZoom: true,
      zoomFactor: 10,
    });
  }

  render() {
    const {
      mapLoaded,
      servicesTypes,
      servicesSubTypes,
      serviceSubTypeVal,
      serviceVal,
      resultServices,
    } = this.state;

    return (
      <div>
        <div>
          <MapComponent mapload={this.mapLoaded.bind(this)}></MapComponent>
        </div>

        <h1 className="titleSelectedParcel">نطاق التأثير</h1>
        <div>
          <label>نوع الخدمة</label>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            onChange={this.onServieTypeChange}
            showSearch
            autoFocus
            disabled={!servicesTypes.length}
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
            value={serviceVal}
            placeholder="نوع الخدمة"
            notFoundContent="not found"
          >
            {servicesTypes.map((d, i) => {
              return (
                <Option key={i} value={d.layer_code}>
                  {d.layer_description}
                </Option>
              );
            })}
          </Select>

          <label>مستوى الخدمة</label>
          <Select
            getPopupContainer={(trigger) => trigger.parentNode}
            onChange={this.onServieSubTypeChange}
            showSearch
            autoFocus
            disabled={!servicesSubTypes.length}
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
            value={serviceSubTypeVal}
            placeholder="مستوى الخدمة"
            notFoundContent="not found"
          >
            {servicesSubTypes.map((d, i) => {
              return (
                <Option key={i} value={d.sublayer_code}>
                  {d.sublayer_description}
                </Option>
              );
            })}
          </Select>

          <label>نطاق التخديم بالمتر</label>
          <input
            className="ant-input"
            type="number"
            placeholder="نطاق التخديم بالمتر"
            required={true}
            value={this.state.bufferDistance}
            onChange={this.updateBufferDistance}
          />

          <button
            type="button"
            disabled={!this.state.bufferDistance}
            className="btn btn-primary"
            style={{
              width: "100px",
              marginTop: "20px",
              backgroundColor: "#337ab7",
            }}
            onClick={this.getServicesOnBuffer.bind(this)}
          >
            {" "}
            بحث{" "}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            style={{
              width: "auto",
              marginTop: "20px",
              marginRight: "35px",
              backgroundColor: "#337ab7",
            }}
            onClick={this.zoomToParcel.bind(this)}
          >
            {" "}
            تقريب إلي الأرض{" "}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            style={{
              width: "auto",
              marginTop: "20px",
              marginRight: "35px",
              backgroundColor: "#337ab7",
            }}
            onClick={this.clearBuffer.bind(this)}
          >
            {" "}
            مسح نطاق التأثير{" "}
          </button>

          {resultServices && resultServices.length > 0 && (
            <table className="table table-bordered" style={{ marginTop: "1%" }}>
              <thead>
                <th>اسم الخدمة</th>
                <th></th>
              </thead>
              <tbody>
                {resultServices.map((s) => {
                  return (
                    <tr>
                      <td>{s.attributes.SRVC_NAME}</td>
                      <td>
                        <button
                          className="btn btn-warning"
                          onClick={this.highlightService.bind(this, s)}
                        >
                          تقريب
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IdentifyServiceRange);
