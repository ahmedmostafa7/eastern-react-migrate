import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { get, map, pick, keys, isEqual } from "lodash";
import ShowField from "app/helpers/components/show";
import { checkImage } from "../../../../../../../inputs/fields/identify/Component/common/common_func";
// const fields = {};
import approvals from "../../../../../../modulesObjects/mergestreets/steps/request_module/approvals";

import final_approvals from "../../../../../../modulesObjects/mergestreets/steps/request_module/final_approvals";
import final_approvals_attahments from "../../../../../../modulesObjects/mergestreets/steps/request_module/final_approvals_attahments";
class attachments extends Component {
  constructor(props) {
    super(props);
  }

  renderInfo = (field, key) => {
    const { t } = this.props;
    return (
      <div className="uu">
        <table className="table no-margin table-bordered table-striped">
          <tr>
            <td style={{ width: "30%" }}>
              <label style={{ whiteSpace: "nowrap" }}>{t(field.label)}</label>
            </td>
            <td>
              {checkImage(this.props, get(this.data, key), {
                width: "100px",
                // height: "400px",
              })}
            </td>
          </tr>
        </table>
      </div>
    );
  };
  render() {
    const { data } = this.props;

    this.fields =
      (data.objectName == "approvals" && {
        ...approvals?.sections?.approvals?.fields,
      }) ||
      (data.objectName == "final_approvals" && {
        ...final_approvals?.sections?.final_approvals?.fields,
      }) ||
      (data.objectName == "final_approvals_attahments" && {
        ...final_approvals_attahments?.sections?.final_approvals?.fields,
      });

    this.data = data.data;

    return map(pick(this.fields, keys(this.data)), this.renderInfo);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(attachments));
