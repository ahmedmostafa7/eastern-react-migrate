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
class printKararAllotment extends Component {
  print_khetab() {
    const {
      currentModule: { record },
    } = this.props;
    let id = record.id;
    window.open(printHost + `/#/landsallotment_adle/${id}`, "_blank");
    console.log("print");
  }
  print_karar() {
    const {
      currentModule: { record },
    } = this.props;
    let id = record.id;
    window.open(printHost + `/#/landsallotment_print/${id}`, "_blank");
    console.log("print");
  }
  print_tabligh() {
    const {
      currentModule: { record },
    } = this.props;
    let id = record.id;
    window.open(
      printHost + `/#/landsallotment_beneficiary_print/${id}`,
      "_blank"
    );
    console.log("print");
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
                {[103, 93].indexOf(module_id) != -1 && (
                  <tr>
                    <td>طباعة قرار التخصيص</td>
                    <td>
                      <button
                        className="btn add-btnT"
                        onClick={this.print_karar.bind(this)}
                      >
                        طباعة
                      </button>
                    </td>
                  </tr>
                )}
                {module_id == 93 && (
                  <tr>
                    <td>طباعة خطاب تبليغ الجهة المستفيدة</td>
                    <td>
                      <button
                        className="btn add-btnT"
                        onClick={this.print_tabligh.bind(this)}
                      >
                        طباعة
                      </button>
                    </td>
                  </tr>
                )}
                {module_id == 94 && (
                  <tr>
                    <td>طباعة خطاب العدل</td>
                    <td>
                      <button
                        className="btn add-btnT"
                        onClick={this.print_khetab.bind(this)}
                      >
                        طباعة
                      </button>
                    </td>
                  </tr>
                )}
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
)(withTranslation("labels")(printKararAllotment));
