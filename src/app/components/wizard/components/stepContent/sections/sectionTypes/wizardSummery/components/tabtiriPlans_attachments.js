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
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { esriRequest } from "../../../../../../../inputs/fields/identify/Component/common/esri_request";
import { mapUrl } from "../../../../../../../inputs/fields/identify/Component/mapviewer/config/map";
import { map, get, assign, isEmpty } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { workFlowUrl } from "../../../../../../../../../imports/config";
class tabtiriPlans_attachments extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { mainObject } = this.props;
    console.log(mainObject);
  }

  render() {
    const {
      mainObject: {
        tabtiriPlans_attachments: {
          tabtiriPlans_attachments: { office_signature, cad_file },
        },
      },
    } = this.props;
    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>صورة مختومة من المكتب للمخطط منزل عليه الجدول التبتيري</td>
              <td>
                {checkImage(this.props, office_signature, { width: "100px" })}
              </td>
            </tr>
            {/* <tr>
              <td>ملف الكاد من الفكرة التخطيطية للمخططات المجاورة</td>
              <td>{checkImage(this.props, cad_file, { width: "100px" })}</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(tabtiriPlans_attachments));
