import React, { Component } from "react";
import { find, round, filter, sortBy } from "lodash";
import queryString from "query-string";
import {
  drawLength,
  fromLatLngToDegreeSymbol,
  fromLatLngToDegreeSymbolFormatted,
  getFeatureDomainName,
  highlightFeature,
  localizeNumber,
  project,
  queryTask,
} from "../../../inputs/fields/identify/Component/common/common_func";
import MapComponent from "../../../inputs/fields/identify/Component/MapComponent/MapComponent";
import {
  investMapUrl,
  mapUrl,
} from "../../../inputs/fields/identify/Component/mapviewer/config";
import { getMapInfo } from "../../../inputs/fields/identify/Component/common/esri_request";
import { initializeSubmissionData } from "../../../../../main_helpers/functions/prints/print_func";

const investSugges = "SITE_ACTIVITY";

class PrintDescriptionCardComponent extends Component {
  layerName = "";
  lat = "lat";
  lng = "long";

  parcelsData = localStorage.getItem("parcelsData");

  getDomainValue = (data, attribute) => {
    let result = data.fields.find((d) => d.name == attribute.name);
    if (result && result.domain) {
      let codedValue = result.domain.codedValues.find(
        (d) => d.code == attribute.code
      );
      if (codedValue && codedValue.name) {
        return codedValue.name;
      } else {
        return attribute.code;
      }
    } else {
      return attribute.code;
    }
  };

  constructor(props) {
    super(props);

    this.parcel_fields_headers = (localStorage.getItem("appId") == 25 && [
      "البلدية",
      "الحي",
      "رقم المخطط",
      "رقم الأرض",
      "المساحة التقريبية (م۲)",
      "الاستخدام الرئيسي",
      "رمز الإستخدام",
      "الاستخدام التفصيلي",
      "الغرض من الارض",
      "دوائر العرض",
      "خط الطول",
    ]) || [
      "البلدية",
      "البلدية الفرعية",
      "الحي",
      "رقم المخطط",
      "رقم الأرض",
      "المساحة التقريبية (م۲)",
      "رمز الإستخدام",
      "النشاط الرئيسي",
      "النشاط المقترح",
      "دوائر العرض",
      "خط الطول",
    ];

    this.parcel_fields = (localStorage.getItem("appId") == 25 && [
      {
        name: "MUNICIPALITY_NAME",
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
      {
        name: "PARCEL_MAIN_LUSE",
      },
      { name: "USING_SYMBOL" },
      {
        name: "DETAILED_LANDUSE",
      },
      {
        name: "SRVC_SUBTYPE",
      },
      {
        name: "Y",
      },
      {
        name: "X",
      },
    ]) || [
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
        name: "Y",
      },
      {
        name: "X",
      },
    ];
    this.state = {};
    const { mo3aynaObject } = this.props;
    let features = [];
    if (mo3aynaObject) {
      getMapInfo(mapUrl).then((data) => {
        this.layers = data.info.mapInfo.layers;
        this.table = data.info.mapInfo.tables;
        features =
          (!mo3aynaObject?.landData?.landData?.lands?.parcels?.[0]
            ?.selectedLands &&
            mo3aynaObject?.landData?.landData?.lands?.parcels) ||
          mo3aynaObject?.landData?.landData?.lands?.parcels.reduce((a, b) => {
            b.selectedLands.forEach((feature) => {
              let parcelCentroid = new esri.geometry.Polygon(
                feature.geometry
              ).getCentroid();
              feature.attributes[this.lng] = parcelCentroid?.x || "";
              feature.attributes[this.lat] = parcelCentroid?.y || "";
              feature.parcelCentroid = parcelCentroid;
              a.push(feature);
            });

            return a;
          }, []);
        

        if (features?.[0]?.parcelCentroid) {
          project(
            features.map((r) => r.parcelCentroid),
            4326,
            (res) => {
              res?.forEach((point, index) => {
                features[index].attributes[this.lng] = point?.x || "";
                features[index].attributes[this.lat] = point?.y || "";
              });
              if (features) {
                features.forEach((feature) => {
                  feature.attributes["X"] =
                    feature?.attributes?.[this.lng]?.toFixed(8);
                  feature.attributes["Y"] =
                    feature?.attributes?.[this.lat]?.toFixed(8);
                });
              }
              this.setState({
                selectedFeatures: features,
              });
            }
          );
        } else {
          if (features) {
            features.forEach((feature) => {
              feature.attributes["X"] =
                feature?.attributes?.[this.lng]?.toFixed(8);
              feature.attributes["Y"] =
                feature?.attributes?.[this.lat]?.toFixed(8);
            });
          }
          this.setState({
            selectedFeatures: features,
          });
        }
      });
    } else {
      initializeSubmissionData(this.props?.match?.params?.id).then(
        (response) => {
          getMapInfo(investMapUrl).then((data) => {
            this.layers = data.info.mapInfo.layers;
            this.table = data.info.mapInfo.tables;

            let domains = data.info.$layers.layers.find(
              (x) => x.name == "Invest_Site_Polygon"
            );
            let domains_landbase = data.info.$layers.layers.find(
              (x) => x.name == "Landbase_Parcel"
            );
            features =
              (!response?.mainObject?.landData?.landData?.lands?.parcels?.[0]
                ?.selectedLands &&
                response?.mainObject?.landData?.landData?.lands?.parcels) ||
              response?.mainObject?.landData?.landData?.lands?.parcels.reduce(
                (a, b) => {
                  b.selectedLands.forEach((feature) => {
                    let parcelCentroid = new esri.geometry.Polygon(
                      feature.geometry
                    ).getCentroid();
                    feature.attributes[this.lng] = parcelCentroid?.x || "";
                    feature.attributes[this.lat] = parcelCentroid?.y || "";
                    feature.parcelCentroid = parcelCentroid;
                    a.push(feature);
                  });

                  return a;
                },
                []
              );
            if (features?.[0]?.parcelCentroid) {
              project(
                features.map((r) => r.parcelCentroid),
                4326,
                (res) => {
                  res?.forEach((point, index) => {
                    features[index].attributes[this.lng] = point?.x || "";
                    features[index].attributes[this.lat] = point?.y || "";
                  });
                  if (features.length) {
                    getFeatureDomainName(
                      features,
                      this.layers.find((x) => x.name == "Invest_Site_Polygon")
                        .id,
                      false,
                      investMapUrl
                    ).then((res) => {
                      features = [...res];
                      features.forEach((feature) => {
                        feature.attributes["X"] =
                          feature.attributes[this.lng].toFixed(8);
                        // fromLatLngToDegreeSymbolFormatted(
                        //   feature.attributes[this.lng]
                        // ) + " E";
                        (feature.attributes["Y"] =
                          feature.attributes[this.lat].toFixed(8)),
                          // fromLatLngToDegreeSymbolFormatted(
                          //   feature.attributes[this.lat]
                          // ) + " N";

                          (feature.attributes.PARCEL_MAIN_LUSE =
                            this.getDomainValue(domains_landbase, {
                              name: "PARCEL_MAIN_LUSE",
                              code: feature?.attributes?.PARCEL_MAIN_LUSE || "",
                            }));
                      });

                      this.setState({
                        selectedFeatures: features,
                      });
                    });
                  }
                }
              );
            } else {
              if (features.length) {
                getFeatureDomainName(
                  features,
                  this.layers.find((x) => x.name == "Invest_Site_Polygon").id,
                  false,
                  investMapUrl
                ).then((res) => {
                  features = [...res];
                  features.forEach((feature) => {
                    feature.attributes["X"] =
                      feature.attributes[this.lng].toFixed(8);
                    // fromLatLngToDegreeSymbolFormatted(
                    //   feature.attributes[this.lng]
                    // ) + " E";
                    (feature.attributes["Y"] =
                      feature.attributes[this.lat].toFixed(8)),
                      // fromLatLngToDegreeSymbolFormatted(
                      //   feature.attributes[this.lat]
                      // ) + " N";

                      (feature.attributes.PARCEL_MAIN_LUSE =
                        this.getDomainValue(domains_landbase, {
                          name: "PARCEL_MAIN_LUSE",
                          code: feature?.attributes?.PARCEL_MAIN_LUSE || "",
                        }));
                  });

                  this.setState({
                    selectedFeatures: features,
                  });
                });
              }
            }

            //this.getFeatures(data.info.mapInfo.layers);
          });
        }
      );
      // this.setPrintValues(mainObject, submissionData, municipalities);
    }
  }

  exportParcelToGoogleMap(geometry) {
    
    var centerPoint = new esri.geometry.Polygon(geometry).getCentroid();
    project([centerPoint], 4326, (res) => {
      window.open(
        `http://maps.google.com/maps?q=${res[0].y},${res[0].x}`,
        "_blank"
      );
    });
  }

  componentDidMount() {}

  onMapCreate(feature, map) {
    highlightFeature(feature, map, {
      isZoom: true,
      layerName: "ZoomGraphicLayer",
      zoomFactor: 50,
      fillColor: "red",
      strokeColor: "red",
    });

    drawLength(map, [feature]);
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
                {`${localStorage.getItem("appId") == 25 && 'الإدارة العامة للأراضي والممتلكات' || 'وكالة الإستثمارات وتنمية الإيرادات'}`}
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
                zoom: ".85",
              }}
              className="tar7"
            >
              <div style={{ display: "grid", gridGap: "10px", margin: "auto" }}>
                <h4 className="titleStyleReport">بيانات الموقع</h4>

                <div style={{ display: "grid", gridGap: "5px", zoom: ".9" }}>
                  {this.parcel_fields_headers.map((field_header, k) => {
                    return (
                      <div key={key}>
                        {
                          <div className="reportRow">
                            <div>{field_header}</div>

                            <div
                              style={{
                                direction: "ltr",
                                unicodeBidi:
                                  this.parcel_fields[k].name == "X" ||
                                  this.parcel_fields[k].name == "Y"
                                    ? "bidi-override"
                                    : "",
                              }}
                            >
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
                      style={{ width: "20%" }}
                      // onClick={this.exportParcelToGoogleMap.bind(
                      //   this,
                      //   feature.geometry
                      // )}
                      // href="javascript:void(0);"
                      href={
                        "http://maps.google.com/maps?q=" +
                        feature.attributes[this.lat] +
                        "," +
                        feature.attributes[this.lng]
                      }
                      target="blank"
                    >
                      <span className="hidden2">
                        {" "}
                        {"http://maps.google.com/maps?q=" +
                          feature.attributes[this.lat] +
                          "," +
                          feature.attributes[this.lng]}
                      </span>
                    </a>
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
                          isShowZoomSlider={true}
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
                          isShowZoomSlider={true}
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

export default PrintDescriptionCardComponent;
