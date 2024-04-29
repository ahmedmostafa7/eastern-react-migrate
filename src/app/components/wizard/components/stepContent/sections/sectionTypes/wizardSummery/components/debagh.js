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
class debagh extends Component {
  print() {
    const {
      currentModule: { record },
    } = this.props;

    let id = record.id;
    window.open(printHost + `/#/lagnaA4/${id}`, "_blank");
  }
  render() {
    //console.log("GG", this.props.mainObject);
    //

    const {
      data,
      t,
      mainObject,
      treeNode: {
        option: { module_id },
      },
    } = this.props;

    if (mainObject.debagh) {
      return (
        <>
          <div>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>طباعة محضر اللجنة الفنية</td>
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
    } else {
      return <div></div>;
    }
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(debagh));
