import React, { Component } from "react";
import { Button, Form, message, Select, Tooltip } from "antd";
import RenderField from "app/components/inputs";
import { serverFieldMapper } from "app/helpers/functions";
import { mapDispatchToProps, mapStateToProps } from "./maping";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { formatKmlAttributes, groupBy } from "../common/common_func";
import { addFeaturesMapLayers } from "../mapviewer/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

class annotationTableComponent extends Component {
  constructor(props) {
    super(props);
    let savedObject = props.mainObject?.locationData?.uploadFileDetails;
    this.state = {
      annotationList:
        savedObject?.annotationList ||
        props.UploadFileDetails?.annotationList ||
        [],
      layerName:
        savedObject?.layerName ||
        props?.UploadFileDetails?.layerName ||
        props?.values?.layerName ||
        null,
      activeLayerDetails:
        savedObject?.activeLayerDetails ||
        props?.UploadFileDetails?.activeLayerDetails ||
        null,
      fileType:
        savedObject?.fileType ||
        props?.UploadFileDetails?.fileType ||
        props?.values?.uploadFileType ||
        null,
      fileData:
        savedObject?.fileData || props?.UploadFileDetails?.fileData || null,
      googlePoints:
        savedObject?.googlePoints ||
        props?.UploadFileDetails?.googlePoints ||
        [],
    };

    this.checkClearValues();
  }

  checkClearValues = () => {
    const { input } = this.props;

    if (input.value.clearAll) {
      //reset features
      this.props.setEditableFeatures(null);
      this.props.setUploadFileDetails(null);

      this.setState(
        {
          annotationList: [],
          layerName: input.value.layerName,
          activeLayerDetails: null,
          fileData: null,
          fileType: input.value.fileType,
        },
        () => {
          this.props.setUploadFileDetails({ ...this.state });
        }
      );
    }
  };

  componentDidUpdate(oldProps, newProps) {
    const { input } = this.props;

    //
    if (input.value.checkGoogleLink) {
      this.setState(
        {
          layerName: input.value.layerName,
          fileType: input.value.fileType,
        },
        () => {
          this.props.setUploadFileDetails({ ...this.state });
        }
      );
      input.value.checkGoogleLink = false;
    }

    if (input.value.clearAll) {
      //reset features
      this.props.setEditableFeatures(null);
      this.props.setUploadFileDetails(null);

      this.setState(
        {
          annotationList: [],
          layerName: input.value.layerName,
          activeLayerDetails: null,
          fileData: null,
          fileType: input.value.fileType,
        },
        () => {
          this.props.setUploadFileDetails({ ...this.state });
        }
      );

      input.value.clearAll = false;
    } else {
      if (input.value && input.value != "" && input.value.justInvoked) {
        //reset features
        this.props.setEditableFeatures(null);
        this.props.setUploadFileDetails(null);

        let activeLayerDetails = {
          ...addFeaturesMapLayers[input.value.layerName],
        };

        if (input.value.fileType == "kml") {
          let columns = formatKmlAttributes(input.value.data.features[0]);

          activeLayerDetails.outFields
            .filter((x) => x.mappingTypes.indexOf(input.value.fileType) > -1)
            .forEach((element) => {
              element.mappingField = Object.keys(columns).find(
                (x) => x.toLowerCase() == element.name.toLowerCase()
              );
              if (!element.mappingField) {
                element.mappingField = Object.keys(columns).find(
                  (x) => element.arName.toLowerCase() == x.toLowerCase()
                );
              }
            });

          this.setState(
            {
              annotationList: columns,
              layerName: input.value.layerName,
              activeLayerDetails: activeLayerDetails,
              fileData: input.value.data,
              fileType: input.value.fileType,
            },
            () => {
              this.props.setUploadFileDetails({ ...this.state });
            }
          );
        } else if (input.value.fileType == "shape") {
          let columns = input.value.data.features[0].attributes;

          activeLayerDetails.outFields
            .filter((x) => x.mappingTypes.indexOf(input.value.fileType) > -1)
            .forEach((element) => {
              element.mappingField = Object.keys(columns).find(
                (x) => x == element.name
              );
              if (!element.mappingField) {
                element.mappingField = Object.keys(columns).find((x) =>
                  element.name.startsWith(x)
                );
              }
            });

          this.setState(
            {
              annotationList: columns,
              layerName: input.value.layerName,
              activeLayerDetails: activeLayerDetails,
              fileData: input.value.data,
              fileType: input.value.fileType,
            },
            () => {
              this.props.setUploadFileDetails({ ...this.state });
            }
          );
        } else if (input.value.fileType == "cad") {
          let columns = groupBy(input.value.data.annotations, "layer");
          let keys = Object.keys(columns);

          activeLayerDetails.outFields
            .filter((x) => x.mappingTypes.indexOf(input.value.fileType) > -1)
            .forEach((element) => {
              element.mappingField = keys.find((x) => x == element.name);
              if (!element.mappingField) {
                element.mappingField = keys.find(
                  (x) => x.indexOf(element.name) > -1
                );
              }
            });

          this.setState(
            {
              annotationList: columns,
              layerName: input.value.layerName,
              activeLayerDetails: activeLayerDetails,
              fileData: input.value.data,
              fileType: input.value.fileType,
            },
            () => {
              this.props.setUploadFileDetails({ ...this.state });
            }
          );
        } else if (input.value.fileType == "excel") {
          if (this.validateExcel(input.value.data.features)) {
            let columns = input.value.data.features[0].attributes;

            activeLayerDetails.outFields
              .filter((x) => x.mappingTypes.indexOf(input.value.fileType) > -1)
              .forEach((element) => {
                element.mappingField = Object.keys(columns).find(
                  (x) =>
                    x.toLowerCase().trim() == element.name.toLowerCase().trim()
                );
                if (!element.mappingField) {
                  element.mappingField = Object.keys(columns).find(
                    (x) =>
                      element.arName.toLowerCase().trim() ==
                      x.toLowerCase().trim()
                  );
                }
              });

            this.setState(
              {
                annotationList: columns,
                layerName: input.value.layerName,
                activeLayerDetails: activeLayerDetails,
                fileData: input.value.data,
                fileType: input.value.fileType,
              },
              () => {
                this.props.setUploadFileDetails({ ...this.state });
              }
            );
          }
        }

        input.value.justInvoked = false;
      }
    }
  }

  validateExcel = (features) => {
    let notIncludeSerial = features.find((f) => {
      return !f.attributes.serial;
    });
    if (notIncludeSerial) {
      window.notifySystem("error", "الملف لا يحتوى على معرف خاص بكل البيانات");
      return false;
    }
    let notIncludeXY = features.find((f) => {
      return !f.attributes.x || !f.attributes.y;
    });
    if (notIncludeXY) {
      window.notifySystem("error", "الملف لا يحتوى على اماكن النقاط x , y");
      return false;
    }
    return true;
  };

  annotaionHandleChange = (e, value) => {
    this.props.setEditableFeatures(null);
    e.mappingField = value;
    this.setState({ activeLayerDetails: { ...this.state.activeLayerDetails } });
    this.props.input.onChange({ ...this.props.input, ...this.state });
    this.props.setUploadFileDetails({ ...this.state });
  };

  changeValue(name, e) {
    this.setState({ [name]: e.target.value });

    if (name == "googleLink") {
      let url = e.target.value;
      let regex = new RegExp("@(.*),(.*),");
      let lat_long_match = url.match(regex);

      if (!lat_long_match) {
        if (url.indexOf(",") > -1) {
          this.setState({
            lat: url.split(",")[0].trim(),
            long: url.split(",")[1].trim(),
          });
        }
      } else {
        let lat = lat_long_match[1];
        let long = lat_long_match[2];
        this.setState({ lat: lat, long: long });
      }
    }
  }

  addPoint() {
    if (this.state.lat && this.state.long) {
      if (
        this.state.googlePoints.find(
          (point) =>
            point.lat == this.state.lat && point.long == this.state.long
        )
      ) {
        window.notifySystem("error", "النقطة المدخلة مضافة من قبل");
      } else {
        this.props.setEditableFeatures(null);
        this.setState(
          {
            googlePoints: [
              ...this.state.googlePoints,
              { lat: this.state.lat, long: this.state.long },
            ],
            lat: "",
            long: "",
            googleLink: "",
          },
          () => {
            this.props.setUploadFileDetails({ ...this.state });
          }
        );
      }
    }
  }

  removeFeature(index) {
    this.state.googlePoints.splice(index, 1);

    this.setState({ googlePoints: [...this.state.googlePoints] });
  }

  render() {
    const {
      annotationList,
      activeLayerDetails,
      fileType,
      googleLink,
      lat,
      long,
      googlePoints,
    } = this.state;
    return (
      <div>
        {fileType != "google" ? (
          Object.keys(annotationList).length > 0 &&
          activeLayerDetails?.outFields?.filter(
            (x) => x.mappingTypes.indexOf(fileType) > -1
          )?.length > 0 && (
            <div>
              <label>جدول annotations</label>
              <table className="table table-bordered" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>طبقات ال Annotation</th>
                    <th>أعمدة الطبقة</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLayerDetails.outFields
                    .filter((x) => x.mappingTypes.indexOf(fileType) > -1)
                    .map((outField) => {
                      return (
                        <tr>
                          <td>
                            <Select
                              showSearch
                              style={{ width: "80%" }}
                              virtual={false}
                              onChange={this.annotaionHandleChange.bind(
                                this,
                                outField
                              )}
                              className="dont-show"
                              value={outField.mappingField}
                              placeholder="من فضلك اختر الحقل"
                              filterOption={(input, option) =>
                                option.props.children
                                  ?.toLowerCase()
                                  ?.indexOf(String(input).toLowerCase()) >= 0
                              }
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                            >
                              {Object.keys(annotationList).map((s, index) => {
                                return (
                                  <Select.Option value={s} id={index}>
                                    {s}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </td>
                          <td>
                            {outField.arName} - {outField.name}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div>
            <label>رفع البيانات الخاصة بالموقع</label>
            <div style={{ display: "flex" }}>
              <input
                name="input1"
                autoFocus
                placeholder="قم بلصق الرابط هنا"
                value={googleLink}
                className="form-control"
                onChange={this.changeValue.bind(this, "googleLink")}
              />

              <Button size="large" onClick={this.addPoint.bind(this)}>
                <FontAwesomeIcon icon={faPlus} className="" />
              </Button>
            </div>
            <div style={{ display: "flex", marginTop: "20px" }}>
              <input
                placeholder="إحداثيات خط الطول"
                value={long}
                type="number"
                className="form-control"
                onChange={this.changeValue.bind(this, "long")}
              />

              <input
                placeholder="إحداثيات دائرة العرض"
                value={lat}
                type="number"
                className="form-control"
                onChange={this.changeValue.bind(this, "lat")}
              />
            </div>

            <div style={{ marginTop: "20px" }}>
              {googlePoints.length > 0 && (
                <table
                  className="table table-bordered"
                  style={{ width: "100%" }}
                >
                  <thead>
                    <tr>
                      <th>التسلسل</th>
                      <th>إحداثيات خط الطول</th>
                      <th>إحداثيات دائرة العرض</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {googlePoints.map((point, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{point.long}</td>
                          <td>{point.lat}</td>
                          <td>
                            <Button
                              size="large"
                              onClick={this.removeFeature.bind(this, index)}
                            >
                              <FontAwesomeIcon icon={faTrash} className="" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(annotationTableComponent));
