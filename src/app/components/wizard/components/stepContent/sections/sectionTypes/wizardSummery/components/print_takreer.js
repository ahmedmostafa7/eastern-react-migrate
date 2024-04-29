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
class printTakreer extends Component {
  print_tawze3() {
    const {
      currentModule: { record },
    } = this.props;

    let id = record.id;
    window.open(printHost + `/#/tawze3/${id}`, "_blank");
  }
  print_takrer_primary_approval() {
    const {
      currentModule: { record },
    } = this.props;

    let id = record.id;
    window.open(printHost + `/#/takrer_primary_approval/${id}`, "_blank");
  }
  print_takrer_supervision() {
    const {
      currentModule: { record },
    } = this.props;

    let id = record.id;
    window.open(printHost + `/#/takrer_supervision_print/${id}`, "_blank");
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

    if (mainObject.lagna_karar.lagna_karar) {
      const {
        lagna_karar: {
          lagna_karar: {
            plans,
            planStatus,
            karar_attachment,
            karar_attachment_signatures,
            plan_number,
            plan_name,
            ma7dar_lagna_no,
            ma7dar_lagna_date,
            notes,
          },
        },
      } = mainObject;

      return (
        <>
          <div>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>خطاب تحديد غرف توزيع الكهرباء بالمخطط</td>
                  <td>
                    <button
                      className="btn add-btnT"
                      onClick={this.print_tawze3.bind(this)}
                    >
                      طباعة
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>خطاب قرار الاعتماد الابتدائي</td>
                  <td>
                    <button
                      className="btn add-btnT"
                      onClick={this.print_takrer_primary_approval.bind(this)}
                    >
                      طباعة
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>خطاب الإشراف</td>
                  <td>
                    <button
                      className="btn add-btnT"
                      onClick={this.print_takrer_supervision.bind(this)}
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
)(withTranslation("labels")(printTakreer));
