import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { convertToArabic } from "../../../../../../../inputs/fields/identify/Component/common/common_func";
class duplix_building_details extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log("GG", this.props.mainObject);

    let {
      t,
      mainObject: {
        duplix_checktor: {
          duplix_checktor: {
            street_length_check,
            one_area_check,
            merged_duplixs,
            split_duplixs,
            direct_line,
            unit_connect,
            comm_air_room,
            internal_parking,
            externals,
            notes,
          },
        },
      },
    } = this.props;
    this.props.mainObject.duplix_checktor.duplix_checktor.line_area_len_merg =
      merged_duplixs;
    this.props.mainObject.duplix_checktor.duplix_checktor.line_area_len_split =
      split_duplixs;
    return (
      <>
        <div>
          <table className="table table-bordered">
            <tbody>
              {street_length_check && (
                <tr>
                  <td colspan={"100%"}>{"لا يقل عرض الشارع عن ١٢ متر"}</td>
                  {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={street_length_check}
                    disabled={true}
                  />
                </td> */}
                </tr>
              )}
              {one_area_check && (
                <tr>
                  <td colspan={"100%"}>
                    {"لا تقل مساحة القطعة الواحدة بعد التجزئة عن ٢٠٠ متر"}
                  </td>
                  {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={one_area_check}
                    disabled={true}
                  />
                </td> */}
                </tr>
              )}
              {merged_duplixs != 0 && merged_duplixs && (
                <tr>
                  <td colspan={"100%"}>{"البناء علي قطعة الأرض فلل متصلة"}</td>
                  {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={merged_duplixs}
                    disabled={true}
                  />
                </td> */}
                </tr>
              )}
              {split_duplixs != 0 && split_duplixs && (
                <tr>
                  <td colspan={"100%"}>{"البناء علي قطعة الأرض فلل منفصلة"}</td>
                  {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={split_duplixs}
                    disabled={true}
                  />
                </td> */}
                </tr>
              )}

              {this.props.mainObject.duplix_checktor.duplix_checktor
                .line_area_len_merg != 0 &&
                this.props.mainObject.duplix_checktor.duplix_checktor
                  .line_area_len_merg && (
                  <tr>
                    <td colspan={"100%"}>
                      {
                        "لا يقل طول ضلع القطعة الواحدة علي الشارع عن ٩.٥ متر للمباني المتصلة"
                      }
                    </td>
                    {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={this.props.mainObject.duplix_checktor.duplix_checktor.line_area_len_merg}
                    disabled={true}
                  />
                </td> */}
                  </tr>
                )}

              {this.props.mainObject.duplix_checktor.duplix_checktor
                .line_area_len_split != 0 &&
                this.props.mainObject.duplix_checktor.duplix_checktor
                  .line_area_len_split && (
                  <tr>
                    <td colspan={"100%"}>
                      {
                        "لا يقل طول ضلع القطعة الواحدة علي الشارع عن ١١.٥ متر للمباني المنفصلة"
                      }
                    </td>
                    {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={this.props.mainObject.duplix_checktor.duplix_checktor.line_area_len_split}
                    disabled={true}
                  />
                </td> */}
                  </tr>
                )}

              {direct_line && (
                <tr>
                  <td colspan={"100%"}>{"حد التقسيم مستقيماً"}</td>
                  {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={direct_line}
                    disabled={true}
                  />
                </td> */}
                </tr>
              )}

              {unit_connect && (
                <tr>
                  <td colspan={"100%"}>
                    {"لا يزيد التلاصق للوحدة الواحدة عن جهتين"}
                  </td>
                  {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={unit_connect}
                    disabled={true}
                  />
                </td> */}
                </tr>
              )}

              {comm_air_room && (
                <tr>
                  <td colspan={"100%"}>
                    {"لا تشترك الوحدات المتلاصقة في منور واحد"}
                  </td>
                  {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={comm_air_room}
                    disabled={true}
                  />
                </td> */}
                </tr>
              )}

              {internal_parking && (
                <tr>
                  <td colspan={"100%"}>{"موقف داخلي لكل قطعة سكنية مفرزة"}</td>
                  {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={internal_parking}
                    disabled={true}
                  />
                </td> */}
                </tr>
              )}

              {externals && (
                <tr>
                  <td colspan={"100%"}>{"الأرتدادات"}</td>
                  {/* <td colspan={"100%"}>
                  <input
                    type={"checkbox"}
                    checked={externals}
                    disabled={true}
                  />
                </td> */}
                </tr>
              )}

              {notes && (
                <tr>
                  <td>{"ملاحظات"}</td>
                  <td>{notes}</td>
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
