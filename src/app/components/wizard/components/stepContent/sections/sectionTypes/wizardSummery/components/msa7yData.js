import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import {
  convertToArabic,
  remove_duplicate,
  checkImage,
  localizeNumber,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { Checkbox } from "antd";
class msa7yData extends Component {
  constructor(props) {
    super(props);
    this.parcel_fields_headers = {
      NORTH_EAST_DIRECTION: "شمال / شرق",
      NORTH_WEST_DIRECTION: "شمال / غرب",
      SOUTH_EAST_DIRECTION: "جنوب / شرق",
      SOUTH_WEST_DIRECTION: "جنوب / غرب",
    };
  }

  resizeImage = (evt) => {
    evt.target.style.height =
      evt.target.clientWidth - evt.target.clientWidth * 0.3 + "px";
  };

  render() {
    //console.log("GG", this.props.mainObject);

    const {
      t,
      mainObject: {
        data_msa7y: {
          msa7yData: {
            image_uploader,
            cadDetails: {
              suggestionsParcels,
              temp: { isPlan, isKrokyUpdateContract, isUpdateContract, isFarz },
            },
            benefitsType,
            usingSymbolType,
            submissionType,
            screenshotURL,
          },
        },
      },
    } = this.props;

    // const {
    //   treeNode: {
    //     option: { tabType, data },
    //   },
    // } = this.props;

    let data =
      (!this.props?.treeNode?.option?.data && this.props?.data?.data) ||
      (!this.props?.data?.data && this.props?.data) ||
      this.props?.treeNode?.option?.data ||
      this.props?.data?.data;
    let tabType =
      (!this.props?.treeNode?.option?.tabType && this.props?.data?.tabType) ||
      this.props?.treeNode?.option?.tabType;

    var northLength = 0,
      eastLength = 0,
      southLength = 0,
      westLength = 0;

    data?.data?.forEach((direction) => {
      direction?.data?.forEach((polygon) => {
        if (polygon?.lines) {
          polygon?.lines?.forEach((line, key) => {
            if (polygon?.lineDirection == 1) {
              northLength =
                (direction?.totalLength && +direction?.totalLength) ||
                northLength + line?.text;
            } else if (polygon?.lineDirection == 4) {
              westLength =
                (direction?.totalLength && +direction?.totalLength) ||
                westLength + line?.text;
            } else if (polygon?.lineDirection == 3) {
              southLength =
                (direction?.totalLength && +direction?.totalLength) ||
                southLength + line?.text;
            } else if (polygon?.lineDirection == 2) {
              eastLength =
                (direction?.totalLength && +direction?.totalLength) ||
                eastLength + line?.text;
            }
          });
        } else {
          if (polygon?.lineDirection == 1) {
            northLength =
              (direction?.totalLength && +direction?.totalLength) ||
              northLength + polygon?.text;
          } else if (polygon?.lineDirection == 4) {
            westLength =
              (direction?.totalLength && +direction?.totalLength) ||
              westLength + polygon?.text;
          } else if (polygon?.lineDirection == 3) {
            southLength =
              (direction?.totalLength && +direction?.totalLength) ||
              southLength + polygon?.text;
          } else if (polygon?.lineDirection == 2) {
            eastLength =
              (direction?.totalLength && +direction?.totalLength) ||
              eastLength + polygon?.text;
          }
        }
      });
    });

    return (
      <>
        <div>
          <table className="table table-bordered">
            <tr>
              <td valign="top" align="" style={{ width: "60%" }}>
                {tabType == "parcels" && (
                  <table className="table table-bordered">
                    <tbody>
                      {
                        <tr>
                          <td>
                            {t(
                              (!this.props?.mainObject?.landData?.landData
                                ?.req_type &&
                                "PARCELNAME") ||
                                "DUPLIXNAME"
                            )}
                          </td>
                          <td>{convertToArabic(data?.parcel_name)}</td>
                        </tr>
                      }
                      {+data?.area > 0 && (
                        <tr>
                          <td>
                            {t("Submission parcel area")} م{convertToArabic(2)}
                          </td>
                          <td>
                            {convertToArabic(
                              (data?.deducted_area &&
                                (+data?.deducted_area).toFixed(2)) ||
                                (+data?.area).toFixed(2)
                            ) || ""}{" "}
                            م{convertToArabic(2)}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td>{t("North Description")}</td>
                        <td>{`طوله ${convertToArabic(
                          (
                            northLength ||
                            (data?.data && +data?.data[0]?.totalLength) ||
                            0
                          ).toFixed(2)
                        )} م ويحده ${convertToArabic(data?.north_Desc) || ""} ${
                          isUpdateContract && data?.plateformWidth_north
                            ? "وعرض الرصيف من هذا الاتجاه هو " +
                              convertToArabic(data?.plateformWidth_north)
                            : ""
                        }`}</td>
                      </tr>
                      <tr>
                        <td>{t("East Description")}</td>
                        <td>{`طوله ${convertToArabic(
                          (
                            eastLength ||
                            (data?.data && +data?.data[1]?.totalLength) ||
                            0
                          ).toFixed(2)
                        )} م ويحده ${convertToArabic(data?.east_Desc) || ""} ${
                          isUpdateContract && data?.plateformWidth_east
                            ? "وعرض الرصيف من هذا الاتجاه هو " +
                              convertToArabic(data?.plateformWidth_east)
                            : ""
                        }`}</td>
                      </tr>
                      <tr>
                        <td>{t("West Description")}</td>
                        <td>{`طوله ${convertToArabic(
                          (
                            westLength ||
                            (data?.data && +data?.data[3]?.totalLength) ||
                            0
                          ).toFixed(2)
                        )} م ويحده ${convertToArabic(data?.west_Desc) || ""} ${
                          isUpdateContract && data?.plateformWidth_west
                            ? "وعرض الرصيف من هذا الاتجاه هو " +
                              convertToArabic(data?.plateformWidth_west)
                            : ""
                        }`}</td>
                      </tr>
                      <tr>
                        <td>{t("South Description")}</td>
                        <td>{`طوله ${convertToArabic(
                          (
                            southLength ||
                            (data?.data && +data?.data[4]?.totalLength) ||
                            0
                          ).toFixed(2)
                        )} م ويحده ${convertToArabic(data?.south_Desc) || ""} ${
                          isUpdateContract && data?.plateformWidth_south
                            ? "وعرض الرصيف من هذا الاتجاه هو " +
                              convertToArabic(data?.plateformWidth_south)
                            : ""
                        }`}</td>
                      </tr>
                      {submissionType != undefined && (
                        <tr>
                          <td>نوع المعاملة</td>
                          <td>{submissionType}</td>
                        </tr>
                      )}
                      {benefitsType != undefined && (
                        <tr>
                          <td>نوع معاوضة الفائدة</td>
                          <td>{benefitsType}</td>
                        </tr>
                      )}
                      {usingSymbolType != undefined && (
                        <tr>
                          <td>نوع استخدام المنطقة</td>
                          <td>{usingSymbolType}</td>
                        </tr>
                      )}
                      <tr>
                        <td>{t("Download CAD")}</td>
                        <td>
                          <a href={filesHost + "/" + image_uploader} download>
                            {t("CAD File")}
                          </a>
                        </td>
                      </tr>
                      {this.props?.mainObject.data_msa7y?.msa7yData?.cadDetails
                        .isUnPlannedParcelIntersect && (
                        <tr>
                          <td colspan="2">
                            {" "}
                            الأرض المرفوعة تتقاطع مع أحد الأراضي في طبقة الأراضي
                            الخام معاملة رقم{" "}
                            {
                              this.props?.mainObject.data_msa7y?.msa7yData
                                ?.cadDetails.isUnPlannedParcelIntersect
                            }
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
                {tabType == "cuttes" && (
                  <table className="table table-bordered">
                    <tbody>
                      {Object.keys(data?.cuttes).map((key, index) => {
                        return (
                          <>
                            {index > 0 ? (
                              <tr>
                                <td>
                                  إتجاه الشطفة :{" "}
                                  {this.parcel_fields_headers[key]}
                                </td>
                                {(data?.cuttes[key] && (
                                  <td>
                                    {convertToArabic(data?.cuttes[key])} م
                                    {convertToArabic(2)}
                                  </td>
                                )) || <td>بدون</td>}
                              </tr>
                            ) : (
                              <></>
                            )}
                          </>
                        );
                      })}
                      {data?.have_electric_room && (
                        <tr>
                          <td>{"غرفة الكهرباء"}</td>
                          <td>
                            {convertToArabic(data?.electric_room_area)} م
                            {convertToArabic(2)}
                          </td>
                        </tr>
                      )}
                      {data?.have_electric_room &&
                        data?.electric_room_place && (
                          <tr>
                            <td>{"مكان غرفة الكهرباء"}</td>
                            <td>
                              {convertToArabic(data?.electric_room_place)}
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                )}
              </td>
              {(data?.approved_Image ||
                this.props?.mainObject?.landData?.landData?.lands?.parcelData
                  ?.approved_Image ||
                this.props?.mainObject?.landData?.landData?.approved_Image ||
                screenshotURL ||
                this.props?.mainObject?.data_msa7y?.msa7yData?.cadDetails
                  ?.suggestionsParcels[0]?.approved_Image) && (
                <td>
                  {checkImage(
                    this.props,
                    data?.approved_Image ||
                      this.props?.mainObject?.landData?.landData?.lands
                        ?.parcelData?.approved_Image ||
                      this.props?.mainObject?.landData?.landData
                        ?.approved_Image ||
                      screenshotURL ||
                      this.props?.mainObject?.data_msa7y?.msa7yData?.cadDetails
                        ?.suggestionsParcels[0]?.approved_Image,
                    {
                      // popup_width: screen.width, //`${screen.width}px`,
                      // popup_height: screen.height //`${screen.height}px`,
                    }
                  )}
                </td>
              )}
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
)(withTranslation("labels")(msa7yData));
