import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import {
  convertToArabic,
  localizeNumber,
  getInfo,
  remove_duplicate,
  checkImage,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { esriRequest } from "../../../../../../../inputs/fields/identify/Component/common/esri_request";
import { mapUrl } from "../../../../../../../inputs/fields/identify/Component/mapviewer/config/map";
import { map, get, assign, isEmpty } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
class landData extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   subDivList: [],
    // };
  }

  // componentDidMount() {
  //   if (this.state.subDivList.length == 0) {
  //     getInfo().then((res) => {
  //       esriRequest(mapUrl + "/" + res.Subdivision).then((response) => {
  //         this.setState({
  //           subDivList: response.fields[7].domain.codedValues.filter((item) => {
  //             return item.code != 4;
  //           }),
  //         });
  //       });
  //     });
  //   }
  // }

  resizeImage = (evt) => {
    evt.target.style.height =
      evt.target.clientWidth - evt.target.clientWidth * 0.3 + "px";
  };

  render() {
    const { t } = this.props;
    let landData = this.props?.mainObject?.LandWithCoordinate?.landData || {};

    return (
      <>
        <div>
          <table className="table table-bordered">
            {landData.lands.screenshotURL && (
              <tr>
                {" "}
                <td colSpan="100%">
                  {checkImage(this.props, landData.lands.screenshotURL, {})}
                </td>
              </tr>
            )}
            <tr>
              <td valign="top" style={{ width: "50%" }}>
                <table className="table table-bordered">
                  <tbody>
                    {landData?.lands?.temp?.mun && (
                      <tr>
                        <td>{t("Municipality name")}</td>
                        <td>
                          {
                            landData?.lands?.parcels.find(
                              (parcel) =>
                                parcel?.attributes?.MUNICIPALITY_NAME_Code ==
                                landData?.lands?.temp?.mun
                            )?.attributes?.MUNICIPALITY_NAME
                          }
                        </td>
                      </tr>
                    )}
                    {((landData?.lands?.parcels &&
                      landData?.lands?.parcels[0]?.attributes?.PLAN_NO) ||
                      landData?.lands?.temp?.plan) && (
                      <tr>
                        <td>{t("Plan Number")}</td>
                        <td>
                          {convertToArabic(
                            (landData?.lands?.parcels &&
                              landData?.lands?.parcels[0]?.attributes
                                ?.PLAN_NO) ||
                              landData?.lands?.temp?.plan
                          )}
                        </td>
                      </tr>
                    )}
                    {((landData?.lands?.parcels &&
                      landData?.lands?.parcels[0]?.attributes
                        .SUBDIVISION_TYPE) ||
                      landData?.lands?.temp?.subtype) &&
                      ((landData?.lands?.parcels &&
                        landData?.lands?.parcels[0]?.attributes
                          .SUBDIVISION_DESCRIPTION) ||
                        landData?.lands?.temp?.subname) && (
                        <tr>
                          <td>
                            {(landData?.lands?.parcels &&
                              landData?.lands?.parcels[0]?.attributes
                                .SUBDIVISION_TYPE) ||
                              landData?.lands?.temp?.subtype}
                          </td>
                          <td>
                            {(landData?.lands?.parcels &&
                              landData?.lands?.parcels[0]?.attributes
                                .SUBDIVISION_DESCRIPTION) ||
                              landData?.lands?.temp?.subname}
                          </td>
                        </tr>
                      )}
                    {((landData?.lands?.parcels &&
                      landData?.lands?.parcels[0]?.attributes
                        .SUBDIVISION_TYPE) ||
                      landData?.lands?.temp?.subtype) &&
                      !(
                        (landData?.lands?.parcels &&
                          landData?.lands?.parcels[0]?.attributes
                            .SUBDIVISION_DESCRIPTION) ||
                        landData?.lands?.temp?.subname
                      ) && (
                        <tr>
                          <td>
                            {(landData?.lands?.parcels &&
                              landData?.lands?.parcels[0]?.attributes
                                .SUBDIVISION_TYPE) ||
                              landData?.lands?.temp?.subtype}
                          </td>
                          <td>{"بدون"}</td>
                        </tr>
                      )}
                    {landData?.lands?.parcels &&
                      landData?.lands?.parcels[0]?.attributes.DISTRICT_NAME && (
                        <tr>
                          <td>{t("District")}</td>
                          <td>
                            {convertToArabic(
                              landData?.lands?.parcels &&
                                landData?.lands?.parcels[0]?.attributes
                                  .DISTRICT_NAME
                            )}
                          </td>
                        </tr>
                      )}
                    {((landData?.lands?.parcels &&
                      landData?.lands?.parcels[0]?.attributes
                        .PARCEL_BLOCK_NO) ||
                      landData?.lands?.temp?.block) && (
                      <tr>
                        <td>{t("BlockNo")}</td>
                        <td>
                          {convertToArabic(
                            (landData?.lands?.parcels &&
                              landData?.lands?.parcels[0]?.attributes
                                .PARCEL_BLOCK_NO) ||
                              landData?.lands?.temp?.block
                          )}
                        </td>
                      </tr>
                    )}
                    {
                      <tr>
                        <td>
                          {t("Submission parcel area")} (م{convertToArabic(2)})
                        </td>
                        <td>
                          {convertToArabic(
                            landData?.area ||
                              landData?.lands?.parcels.reduce(function (a, b) {
                                return a + b.attributes.PARCEL_AREA;
                              }, 0)
                          ) || 0}{" "}
                          م{convertToArabic(2)}
                        </td>
                      </tr>
                    }
                    {landData?.lands && landData?.lands?.parcels && (
                      <tr>
                        <td>{t("Submission parcels")}</td>
                        <td>
                          {localizeNumber(
                            landData?.lands?.parcels
                              .map((parcel, index) => {
                                return (
                                  parcel.attributes.PARCEL_PLAN_NO ||
                                  parcel.attributes.PARCELNAME
                                );
                              })
                              .join(", ")
                          )}
                        </td>
                      </tr>
                    )}
                    {landData?.lands &&
                      landData?.lands?.parcelData &&
                      landData?.lands?.parcelData?.north_desc && (
                        <tr>
                          <td>{t("North Description")}</td>
                          <td>
                            {convertToArabic(
                              landData?.lands?.parcelData?.north_desc
                            )}
                          </td>
                        </tr>
                      )}
                    {landData?.lands?.parcelData?.north_length && (
                      <tr>
                        <td>{t("North Length")} (م)</td>
                        <td>
                          {convertToArabic(
                            landData?.lands?.parcelData?.north_length
                          )}{" "}
                          م
                        </td>
                      </tr>
                    )}
                    {landData?.lands?.parcelData?.east_desc && (
                      <tr>
                        <td>{t("East Description")}</td>
                        <td>
                          {convertToArabic(
                            landData?.lands?.parcelData?.east_desc
                          )}
                        </td>
                      </tr>
                    )}
                    {landData?.lands?.parcelData?.east_length && (
                      <tr>
                        <td>{t("East Length")} (م)</td>
                        <td>
                          {convertToArabic(
                            landData?.lands?.parcelData?.east_length
                          )}{" "}
                          م
                        </td>
                      </tr>
                    )}
                    {landData?.lands?.parcelData?.west_desc && (
                      <tr>
                        <td>{t("West Description")}</td>
                        <td>
                          {convertToArabic(
                            landData?.lands?.parcelData?.west_desc
                          )}
                        </td>
                      </tr>
                    )}
                    {landData?.lands?.parcelData?.west_length && (
                      <tr>
                        <td>{t("West Length")} (م)</td>
                        <td>
                          {convertToArabic(
                            landData?.lands?.parcelData?.west_length
                          )}{" "}
                          م
                        </td>
                      </tr>
                    )}
                    {landData?.lands?.parcelData?.south_desc && (
                      <tr>
                        <td>{t("South Description")}</td>
                        <td>
                          {convertToArabic(
                            landData?.lands?.parcelData?.south_desc
                          )}
                        </td>
                      </tr>
                    )}
                    {landData?.lands?.parcelData?.south_length && (
                      <tr>
                        <td>{t("South Length")} (م)</td>
                        <td>
                          {convertToArabic(
                            landData?.lands?.parcelData?.south_length
                          )}{" "}
                          م
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(landData));
