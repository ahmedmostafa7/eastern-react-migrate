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
class sugLandData extends Component {
  constructor(props) {
    super(props);
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
        sugLandData: {
          sugLandData: { APPROVED_IMAGE },
        },
        landData: {
          landData: { req_type },
        },
      },
    } = this.props;
    const {
      treeNode: {
        option: { tabType, data },
      },
    } = this.props; // this.props.mainObject.landData.landData.lands

    return (
      <>
        {tabType == "parcels" && (
          <div>
            <table className="table table-bordered">
              <tr>
                <td valign="top" align="" style={{ width: "50%" }}>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td>{!req_type ? "رقم الأرض" : "رقم الدوبلكس"}</td>
                        <td>
                          {localizeNumber(
                            data.PARCEL_PLAN_NO || data.PARCELNAME
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          {t("Submission parcel area")} م{convertToArabic(2)}
                        </td>
                        <td>
                          {convertToArabic(data.AREA || data.NEW_PARCEL_AREA) ||
                            ""}{" "}
                          م{convertToArabic(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>{t("North Description")}</td>
                        <td>{`طوله ${convertToArabic(
                          data.north_length || 0
                        )} م ويحده ${
                          convertToArabic(data.north_desc) || ""
                        }`}</td>
                      </tr>
                      <tr>
                        <td>{t("East Description")}</td>
                        <td>{`طوله ${convertToArabic(
                          data.east_length || 0
                        )} م ويحده ${
                          convertToArabic(data.east_desc) || ""
                        } `}</td>
                      </tr>
                      <tr>
                        <td>{t("West Description")}</td>
                        <td>{`طوله ${convertToArabic(
                          data.west_length || 0
                        )} م ويحده ${
                          convertToArabic(data.west_desc) || ""
                        } `}</td>
                      </tr>
                      <tr>
                        <td>{t("South Description")}</td>
                        <td>{`طوله ${convertToArabic(
                          data.south_length || 0
                        )} م ويحده ${
                          convertToArabic(data.south_desc) || ""
                        } `}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td>
                  {checkImage(this.props, APPROVED_IMAGE, {
                    width: "100%",
                    height: "400px",
                  })}
                </td>
              </tr>
            </table>
          </div>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(sugLandData));
