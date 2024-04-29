import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { printHost } from "imports/config";
import {
  convertToArabic,
  remove_duplicate,
  localizeNumber,
  checkImage,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
class executive_lagna_print extends Component {
  print() {
    const {
      currentModule: { record },
    } = this.props;

    let id = record.id;
    window.open(printHost + `/#/investmentsites_lagnh_print/${id}`, "_blank");
  }

  render() {
    return (
      <>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>طباعة محضر اللجنة التنفيذية لإعتماد المواقع الاستثمارية</td>
                <td>
                  <button
                    className="btn add-btnT"
                    onClick={this.print.bind(this)}
                  >
                    طباعة
                  </button>
                </td>
              </tr>
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
)(withTranslation("labels")(executive_lagna_print));
