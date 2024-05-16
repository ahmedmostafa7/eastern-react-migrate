import React, { Component } from "react";
import { find, round, filter, sortBy } from "lodash";
import queryString from "query-string";
import {
  getFeatureDomainName,
  highlightFeature,
  localizeNumber,
  project,
  queryTask,
} from "../inputs/fields/identify/Component/common/common_func";
import MapComponent from "../inputs/fields/identify/Component/MapComponent/MapComponent";
import {
  investMapUrl,
  mapUrl,
} from "../inputs/fields/identify/Component/mapviewer/config";
import { initializeSubmissionData } from "main_helpers/functions/prints/print_func";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { mapStateToProps } from "./mapping";
import { getMapInfo } from "../inputs/fields/identify/Component/common/esri_request";
const investSugges = "SITE_ACTIVITY";

class PrintDescriptionCardComponent extends Component {
  layerName = "";
  lat = "lat";
  lng = "long";

  parcelsData = localStorage.getItem("parcelsData");

  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidMount() {
    const { mo3aynaObject } = this.props.modal;
    if (mo3aynaObject) {
      getMapInfo(mapUrl).then((data) => {
        this.layers = data.info.mapInfo.layers;
        this.table = data.info.mapInfo.tables;

        this.setState({
          selectedFeatures: mo3aynaObject?.landData?.landData?.lands?.parcels,
        });

        //this.getFeatures(data.info.mapInfo.layers);
      });
    } else {
      initializeSubmissionData(this.props.params.id).then((response) => {
        getMapInfo(mapUrl).then((data) => {
          this.layers = data.info.mapInfo.layers;
          this.table = data.info.mapInfo.tables;

          this.setState({
            selectedFeatures:
              response?.mainObject?.landData?.landData?.lands?.parcels,
          });

          //this.getFeatures(data.info.mapInfo.layers);
        });
      });
    }
  }

  parcel_fields_headers = [
    "البلدية",
    "البلدية الفرعية",
    "الحي",
    "رقم المخطط",
    "رقم الأرض",
    "المساحة التقريبية (م۲)",
    "رمز الإستخدام",
    "النشاط الرئيسي",
    "النشاط المقترح",
    "الإحداثي السيني",
    "الإحداثي الصادي",
  ];

  parcel_fields = [
    {
      name: "MUNICIPALITY_NAME",
    },
    {
      name: "SUB_MUNICIPALITY_NAME",
    },
    {
      name: "DISTRICT_NAME",
    },
    {
      name: "PLAN_NO",
    },
    { name: "PARCEL_PLAN_NO" },
    {
      name: "PARCEL_AREA",
    },
    { name: "USING_SYMBOL" },
    {
      name: "PARCEL_MAIN_LUSE",
    },
    {
      name: investSugges,
    },
    {
      name: "X",
    },
    {
      name: "Y",
    },
  ];

  componentDidMount() {}

  onMapCreate(feature, map) {
    highlightFeature(feature, map, {
      isZoom: true,
      layerName: "ZoomGraphicLayer",
      zoomFactor: 50,
      fillColor: "red",
      strokeColor: "red",
    });
  }

  removeBaseMap(feature, map) {
    setTimeout(() => {
      var f = new esri.geometry.Polygon(feature.geometry);
      project([f], 102100, (res) => {
        highlightFeature({ geometry: res[0] }, map, {
          isZoom: true,
          layerName: "ZoomGraphicLayer",
          zoomFactor: 50,
          fillColor: "red",
          strokeColor: "red",
          callback: () => {
            var removedBaseMap = map.getLayer(map.layerIds[1]);
            if (removedBaseMap) {
              map.removeLayer(removedBaseMap);
            }
          },
        });
      });
    }, 500);
  }

  render() {
    let { selectedFeatures = [] } = this.state;
    return selectedFeatures?.length > 0 ? (
      <div className="reportDesign" style={{}}>
        <div className="printCardDes">
          <div
            className="hidden2"
            style={{
              direction: "ltr",
              justifyContent: "flex-end",
              marginLeft: "2%",
            }}
          >
            <button
              className="btn btn-warning"
              onClick={() => {
                window.print();
              }}
            >
              طباعه
            </button>
          </div>
          <div className="header_fixed">
            <div>
              <img src="images/logo3.png" width="100px" />
            </div>
            <div style={{ display: "grid", justifyItems: "center" }}>
              <img src="images/logo2.png" width="100px" />
              <p style={{ textAlign: "center" }}>
                الإدارة العامة لتنمية الصادرات
              </p>
            </div>
            <div>
              <img src="images/saudiVision.png" width="100px" />
            </div>
          </div>
          {selectedFeatures.map((feature, key) => (
            <div
              key={key}
              style={{
                padding: "10px",
                margin: "1%",
                pageBreakAfter: "always",
                marginTop: "20vh",
              }}
              className="tar7"
            >
              <div
              //  style={{ display: 'grid', gridGap: '10px' }}
              >
                <h4 className="titleStyleReport">بيانات الموقع</h4>

                <div style={{ display: "grid", gridGap: "5px" }}>
                  {this.parcel_fields_headers.map((field_header, k) => {
                    return (
                      <div key={key}>
                        {
                          <div className="reportRow">
                            <div>{field_header}</div>

                            <div style={{ direction: "ltr" }}>
                              {localizeNumber(
                                feature.attributes[
                                  this.parcel_fields[k].name
                                ] || "غير متوفر"
                              )}
                            </div>
                          </div>
                        }
                      </div>
                    );
                  })}
                  <div className="reportRow" style={{}}>
                    <span>رابط جوجل</span>
                    <a
                      href={
                        "http://maps.google.com/maps?q=" +
                        feature.attributes[this.lat] +
                        "," +
                        feature.attributes[this.lng]
                      }
                      target="blank"
                    ></a>
                  </div>

                  <div
                    style={{
                      //   display: "grid",
                      marginTop: "20px",
                      gridTemplateColumns: "50% 50%",
                      display: "grid",
                      gridGap: "10px",
                    }}
                  >
                    <div className="divBorder moswer">
                      <label className="labelReport">المصور الفضائي</label>
                      <div style={{ zoom: 0.62 }}>
                        <MapComponent
                          mapload={this.removeBaseMap.bind(this, feature)}
                          mapId={`reportMapNoMap${key}`}
                          siteSpatial={feature.attributes.PARCEL_SPATIAL_ID}
                          isReportMap="true"
                          isStatlliteMap="true"
                          //printStyle={true}
                        />
                      </div>
                    </div>
                    <div className="divBorder moswer  ">
                      <label className="labelReport">
                        صورة المستكشف الجغرافي
                      </label>
                      <div className="zoomPrint">
                        <MapComponent
                          mapload={this.onMapCreate.bind(this, feature)}
                          baseMapUrl={investMapUrl}
                          mapId={`reportMap${key}`}
                          isReportMap="true"
                          //printStyle={true}
                          // zoomPrint=
                          // style={{ width: "50%", height: "150px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      "no result"
    );
  }
}

export const descriptionCard = connect(mapStateToProps)(
  withTranslation("modals")(PrintDescriptionCardComponent)
);
//export default PrintDescriptionCardComponent;
