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
class letter_print extends Component {
  print(module_id) {
    const {
      currentModule: { record },
      mainObject,
    } = this.props;

    let id = record.id;
    window.open(
      printHost +
        (module_id == 105 &&
        mainObject?.afada_adle_statements?.afada_adle_statements?.table_afada
          ?.length > 0
          ? `/#/sakPropertycheck_letter_return/${id}`
          : `/#/sakPropertycheck_letter/${id}`),
      "_blank"
    );
  }
  render() {
    //console.log("GG", this.props.mainObject);
    //

    const {
      data,
      t,
      mainObject,
      treeNode: {
        option: { module_id, label },
      },
    } = this.props;

    if (mainObject.letter_print) {
      return (
        <>
          <div>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>
                    {(module_id == 105 &&
                      ((mainObject?.afada_adle_statements?.afada_adle_statements
                        ?.table_afada?.length > 0 &&
                        "طباعة اعادة خطاب سريان مفعول الصك") ||
                        "اصدار خطاب سريان مفعول الصك")) ||
                      label}
                  </td>
                  <td>
                    <button
                      className="btn add-btnT"
                      onClick={() => {
                        this.print(module_id);
                      }}
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
)(withTranslation("labels")(letter_print));
