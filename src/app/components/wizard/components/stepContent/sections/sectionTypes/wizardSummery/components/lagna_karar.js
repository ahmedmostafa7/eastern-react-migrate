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
class kararLagna extends Component {
  print() {
    const {
      currentModule: { record },
    } = this.props;

    let id = record.id;
    window.open(printHost + `/#/karar_lagna_print/${id}`, "_blank");
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
            suggested_plan_image,
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
                {module_id == 42 && plans && (
                  <tr>
                    <td>{t("selectedPlan")}</td>
                    <td>{t(`cadData:${plans}`)}</td>
                  </tr>
                )}
                {module_id == 42 && planStatus && (
                  <tr>
                    <td>{t("PlanStatus")}</td>
                    <td>
                      {t(
                        `${
                          "labels:" +
                          [
                            { id: 1, name: "REJECTION_AND_RETURN_ACTION" },
                            { id: 2, name: "ACCEPTANCE_ACTION" },
                          ]?.find((item) => item.id == planStatus)?.name
                        }`
                      )}
                    </td>
                  </tr>
                )}
                {module_id == 42 && plan_number && (
                  <tr>
                    <td>{t("Plan Number")}</td>
                    <td>{convertToArabic(plan_number)}</td>
                  </tr>
                )}
                {module_id == 42 && plan_name && (
                  <tr>
                    <td>{t("Plan name")}</td>
                    <td>{localizeNumber(plan_name)}</td>
                  </tr>
                )}
                <tr>
                  <td>{t("ma7dar_lagna_number")}</td>
                  <td>{convertToArabic(ma7dar_lagna_no)}</td>
                </tr>
                {ma7dar_lagna_date && (
                  <tr>
                    <td>{t("ma7dar_lagna_date")}</td>
                    <td>{convertToArabic(ma7dar_lagna_date)}</td>
                  </tr>
                )}
                {module_id == 42 && notes && (
                  <tr>
                    <td>{t("notes")}</td>
                    <td>{convertToArabic(notes)}</td>
                  </tr>
                )}
                {module_id == 42 && karar_attachment && (
                  <tr>
                    <td>{t("Attachments")}</td>
                    <td valign="middle" align="center">
                      {checkImage(this.props, karar_attachment, {
                        width: "100px",
                      })}
                    </td>
                  </tr>
                )}
                {[84].indexOf(module_id) != -1 && suggested_plan_image && (
                  <tr>
                    <td>
                      {t("صورة المخطط المقترح موقع من أعضاء اللجنة الفنية")}
                    </td>
                    <td valign="middle" align="center">
                      {checkImage(this.props, suggested_plan_image, {
                        width: "100px",
                      })}
                    </td>
                  </tr>
                )}
                {[84, 87].indexOf(module_id) != -1 &&
                  karar_attachment_signatures && (
                    <tr>
                      <td>{t("مرفق محضر اللجنة الفنية")}</td>
                      <td valign="middle" align="center">
                        {checkImage(this.props, karar_attachment_signatures, {
                          width: "100px",
                        })}
                      </td>
                    </tr>
                  )}
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
)(withTranslation("labels")(kararLagna));
