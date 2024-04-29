import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import {
  convertToArabic,
  remove_duplicate,
  checkImage,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
class duplix_building_details extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log("GG", this.props.mainObject);

    const {
      t,
      mainObject: {
        duplix_building_details: {
          duplix_building_details: {
            duplix_licence_number,
            duplix_licence_date,
            duplix_is,
            build_licence_image,
            arc_blocks_images,
            land_real_image,
            front_build_image,
          },
        },
      },
    } = this.props;
    return (
      <>
        <div>
          <table className="table table-bordered">
            <tbody>
              {duplix_licence_number && (
                <tr>
                  <td>{"رقم رخصة البناء"}</td>
                  <td>{convertToArabic(duplix_licence_number)}</td>
                </tr>
              )}
              {duplix_licence_date && (
                <tr>
                  <td>{"تاريخ رخصة البناء"}</td>
                  <td>{convertToArabic(duplix_licence_date)}</td>
                </tr>
              )}
              {duplix_is && (
                <tr>
                  <td>{"عبارة عن"}</td>
                  <td>{duplix_is}</td>
                </tr>
              )}
              {build_licence_image && (
                <tr>
                  <td>{"صورة رخصة البناء"}</td>
                  <td>{checkImage(this.props, build_licence_image)}</td>
                </tr>
              )}
              {arc_blocks_images && (
                <tr>
                  <td>{"صور المخطط المعماري المعتمد"}</td>
                  <td>{checkImage(this.props, arc_blocks_images)}</td>
                </tr>
              )}
              {land_real_image && (
                <tr>
                  <td>{"صورة فوتوغرافية للأرض"}</td>
                  <td>{checkImage(this.props, land_real_image)}</td>
                </tr>
              )}
              {front_build_image && (
                <tr>
                  <td>{"صور فوتوغرافية للمبني"}</td>
                  <td>{checkImage(this.props, front_build_image)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(duplix_building_details));
