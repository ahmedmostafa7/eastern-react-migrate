import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { Icon } from "antd";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import {
  convertToArabic,
  remove_duplicate,
  checkImage,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";

class supervision_attachments extends Component {
  render() {
    let supervision_attachments =
      this.props.mainObject.supervision_attachments.supervision_attachments;
    let supervision_letter =
      this.props.mainObject.supervision_attachments.supervision_letter;
    return (
      <>
        {supervision_attachments && (
          <div>
            <table className="table table-bordered">
              <tbody>
                {!isEmpty(
                  supervision_attachments[
                    "Type_of_project_resources_communication"
                  ]
                ) && (
                  <tr>
                    <td>بيان التواصل لأطراف المشروع نوعه</td>
                    <td>
                      {checkImage(
                        this.props,
                        supervision_attachments[
                          "Type_of_project_resources_communication"
                        ],
                        {
                          width: "80px",
                          height: "80px",
                        }
                      )}
                    </td>
                  </tr>
                )}
                {!isEmpty(supervision_attachments["Tatweer_stage"]) && (
                  <tr>
                    <td>بيان مرحلة التطوير</td>
                    <td>
                      {checkImage(
                        this.props,
                        supervision_attachments["Tatweer_stage"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
                {!isEmpty(supervision_attachments["Disclaimers"]) && (
                  <tr>
                    <td>محاضر وإخلاءات الطرف الاخرى</td>
                    <td>
                      {checkImage(
                        this.props,
                        supervision_attachments["Disclaimers"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
                {!isEmpty(supervision_attachments["Material_approvals"]) && (
                  <tr>
                    <td>اعتمادات المواد</td>
                    <td>
                      {checkImage(
                        this.props,
                        supervision_attachments["Material_approvals"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
                {!isEmpty(supervision_attachments["Full_designed_plans"]) && (
                  <tr>
                    <td>المخططات التصميمة كاملة</td>
                    <td>
                      {checkImage(
                        this.props,
                        supervision_attachments["Full_designed_plans"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
                {!isEmpty(supervision_attachments["Full_executed_plans"]) && (
                  <tr>
                    <td>المخططات التنفيذية كاملة</td>
                    <td>
                      {checkImage(
                        this.props,
                        supervision_attachments["Full_executed_plans"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
                {!isEmpty(supervision_attachments["Obstacles_solutions"]) && (
                  <tr>
                    <td>المعوقات والحلول</td>
                    <td>
                      {checkImage(
                        this.props,
                        supervision_attachments["Obstacles_solutions"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
                {!isEmpty(
                  supervision_attachments["Performance_evaluations"]
                ) && (
                  <tr>
                    <td>تقييمات الاداء</td>
                    <td>
                      {checkImage(
                        this.props,
                        supervision_attachments["Performance_evaluations"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
                {!isEmpty(supervision_attachments["Bank_Guarantee"]) && (
                  <tr>
                    <td>الضمان البنكي</td>
                    <td>
                      {checkImage(
                        this.props,
                        supervision_attachments["Bank_Guarantee"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
                {!isEmpty(supervision_letter["supervision_letter_num"]) && (
                  <tr>
                    <td>بيانات خطاب الإدارة العامة لإشراف</td>
                    <td>{supervision_letter["supervision_letter_num"]}</td>
                  </tr>
                )}
                {!isEmpty(supervision_letter["supervision_letter_date"]) && (
                  <tr>
                    <td>تاريخ خطاب الإدارة العامة لإشراف</td>
                    <td>{supervision_letter["supervision_letter_date"]}</td>
                  </tr>
                )}
                {!isEmpty(
                  supervision_letter["supervision_letter_attachment"]
                ) && (
                  <tr>
                    <td>مرفق خطاب الإدارة العامة لإشراف</td>
                    <td>
                      {checkImage(
                        this.props,
                        supervision_letter["supervision_letter_attachment"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
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
)(withTranslation("labels")(supervision_attachments));
