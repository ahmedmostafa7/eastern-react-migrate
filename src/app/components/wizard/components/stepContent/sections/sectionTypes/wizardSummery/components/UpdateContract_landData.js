import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import {
  convertToArabic,
  localizeNumber,
  getInfo,
  remove_duplicate,
  checkImage,
  map_object,
  getMunicipalityById,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { esriRequest } from "../../../../../../../inputs/fields/identify/Component/common/esri_request";
import { mapUrl } from "../../../../../../../inputs/fields/identify/Component/mapviewer/config/map";
import { map, get, assign, isEmpty } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
const backGroundStyle = {
  backgroundColor: "#9797ca",
};
class UpdateContract_landData extends Component {
  constructor(props) {
    super(props);
    let {
      treeNode: {
        option: { tabType, data, label },
      },
    } = props;
    this.state = {
      reformattedMunValue:
        data?.parcel?.attributes?.MUNICIPALITY_NAME || "بدون",
    };
  }
  resizeImage = (evt) => {
    evt.target.style.height =
      evt.target.clientWidth - evt.target.clientWidth * 0.3 + "px";
  };

  componentDidMount() {
    let {
      treeNode: {
        option: { tabType, data, label },
      },
    } = this.props;

    if (
      this.state.reformattedMunValue &&
      Number(this.state.reformattedMunValue)
    ) {
      getMunicipalityById(data?.parcel?.attributes?.MUNICIPALITY_NAME).then(
        (res) => {
          this.setState({ reformattedMunValue: res });
        }
      );
    }
  }

  render() {
    let {
      t,
      mainObject: { submissionType },
      treeNode: {
        option: { tabType, data, label },
      },
    } = this.props;

    const { reformattedMunValue } = this.state;

    label = "assd";
    return (
      (data && (
        <>
          <div>
            <table className="table table-bordered">
              <tr>
                <td valign="top" style={{ width: "50%" }}>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>{t("Submission Type")}</td>
                        <td>{"تحديث صكوك"}</td>
                      </tr>
                      <tr>
                        <td>{t("Municipality name")}</td>
                        <td>{reformattedMunValue}</td>
                      </tr>
                      {data?.parcel?.attributes?.DISTRICT_NAME && (
                        <tr>
                          <td>{t("District")}</td>
                          <td>
                            {localizeNumber(
                              data?.parcel?.attributes?.DISTRICT_NAME
                            )}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.attributes?.PLAN_NO && (
                        <tr>
                          <td>{t("Plan Number")}</td>
                          <td>
                            {localizeNumber(data?.parcel?.attributes?.PLAN_NO)}
                          </td>
                        </tr>
                      )}
                      {["Null", null, 0, undefined].indexOf(
                        data?.parcel?.attributes?.PARCEL_BLOCK_NO
                      ) == -1 && (
                        <tr>
                          <td>{t("BlockNo")}</td>
                          <td>
                            {localizeNumber(
                              data?.parcel?.attributes?.PARCEL_BLOCK_NO
                            )}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.attributes?.PARCEL_PLAN_NO && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>{t("Submission parcels")}</td>
                          <td>
                            {localizeNumber(
                              data?.parcel?.attributes?.PARCEL_PLAN_NO
                            )}
                          </td>
                        </tr>
                      )}
                      {[undefined, 0, null].indexOf(
                        data?.parcel?.attributes?.PARCEL_AREA
                      ) == -1 && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>
                            {t("Submission parcel area")} (م{localizeNumber(2)})
                          </td>
                          <td>
                            {localizeNumber(
                              data?.parcel?.attributes?.PARCEL_AREA
                            )}{" "}
                            م{localizeNumber(2)}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.parcelData?.north_desc && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>{t("North Description")}</td>
                          <td>
                            {localizeNumber(
                              data?.parcel?.parcelData?.north_desc
                            )}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.parcelData?.north_length && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>
                            {t("North Length")} (
                            {data?.parcel?.parcelData?.north_length?.extValue ||
                              "متر"}
                            )
                          </td>
                          <td>
                            {localizeNumber(
                              `${
                                data?.parcel?.parcelData?.north_length
                                  ?.inputValue ||
                                data?.parcel?.parcelData?.north_length
                              } ${
                                data?.parcel?.parcelData?.north_length
                                  ?.extValue || "متر"
                              }`
                            )}{" "}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.parcelData?.east_desc && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>{t("East Description")}</td>
                          <td>
                            {localizeNumber(
                              data?.parcel?.parcelData?.east_desc
                            )}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.parcelData?.east_length && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>
                            {t("East Length")} (
                            {data?.parcel?.parcelData?.east_length?.extValue ||
                              "متر"}
                            )
                          </td>
                          <td>
                            {localizeNumber(
                              `${
                                data?.parcel?.parcelData?.east_length
                                  ?.inputValue ||
                                data?.parcel?.parcelData?.east_length
                              } ${
                                data?.parcel?.parcelData?.east_length
                                  ?.extValue || "متر"
                              }`
                            )}{" "}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.parcelData?.west_desc && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>{t("West Description")}</td>
                          <td>
                            {localizeNumber(
                              data?.parcel?.parcelData?.west_desc
                            )}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.parcelData?.west_length && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>
                            {t("West Length")} (
                            {data?.parcel?.parcelData?.west_length?.extValue ||
                              "متر"}
                            )
                          </td>
                          <td>
                            {localizeNumber(
                              `${
                                data?.parcel?.parcelData?.west_length
                                  ?.inputValue ||
                                data?.parcel?.parcelData?.west_length
                              } ${
                                data?.parcel?.parcelData?.west_length
                                  ?.extValue || "متر"
                              }`
                            )}{" "}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.parcelData?.south_desc && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>{t("South Description")}</td>
                          <td>
                            {localizeNumber(
                              data?.parcel?.parcelData?.south_desc
                            )}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.parcelData?.south_length && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>
                            {t("South Length")} (
                            {data?.parcel?.parcelData?.south_length?.extValue ||
                              "متر"}
                            )
                          </td>
                          <td>
                            {localizeNumber(
                              `${
                                data?.parcel?.parcelData?.south_length
                                  ?.inputValue ||
                                data?.parcel?.parcelData?.south_length
                              } ${
                                data?.parcel?.parcelData?.south_length
                                  ?.extValue || "متر"
                              }`
                            )}{" "}
                          </td>
                        </tr>
                      )}
                      {data?.parcel?.parcelData?.parcel_type && (
                        <tr style={(data.isNew && backGroundStyle) || {}}>
                          <td>{t("About")}</td>
                          <td>
                            {localizeNumber(
                              data?.parcel?.parcelData?.parcel_type
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
              {data?.screenshotURL && (
                <tr>
                  {" "}
                  <td colSpan="100%">
                    <table className="table">
                      <tr>
                        <td valign="middle" align="center">
                          {t("ParcelImage")}
                        </td>
                      </tr>
                      <tr>
                        <td valign="middle" align="center">
                          {checkImage(this.props, data?.screenshotURL, {})}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              )}
            </table>
          </div>
        </>
      )) || <></>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(UpdateContract_landData));
