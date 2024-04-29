import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import {
  getUrbans,
  convertListToString,
  convertToArabic,
  remove_duplicate,
  checkImage,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
class bda2l extends Component {
  render() {
    //console.log("GG", this.props.mainObject);

    const {
      data,
      t,
      mainObject: {
        bda2l: {
          bands_approval: {
            urban,
            band_number: { owner_selectedValues },
            owner_acceptance,
            others,
          },
        },
      },
      treeNode: {
        option: { module_id },
      },
    } = this.props;
    var _urban = getUrbans(this.props).find((d) => {
      return d.code == urban;
    });
    // mainObject.bda2l.bands_approval.band_number.oldOptions
    let values =
      this.props.mainObject.bda2l.bands_approval.band_number.selectedValues;
    let selectedValues =
      this.props.mainObject?.bda2l?.bands_approval?.band_number?.oldOptions
        ?.filter(
          (r) =>
            ((!Array.isArray(values) && values.values) || values)?.find(
              (e) =>
                r.value[0].key == e?.key &&
                r.value[0].modal == e?.modal &&
                e?.values?.length == r.value[0].values.length
            ) != undefined
          // &&
          // (!Array.isArray(values) && values.values || values)?.find((e) => r.value[0].modal == e?.modal  && e?.values?.length == r.value[0].values.length) != undefined
        )
        ?.map((t) => {
          let values = t.value[0];
          return values;
        });

    return (
      <>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>النطاق العمراني</td>
                <td>{convertToArabic((_urban && _urban.name) || urban)}</td>
              </tr>
              <tr>
                <td>البنود</td>
                <td>
                  {convertToArabic(
                    (module_id == 42 &&
                      !Array.isArray(selectedValues) &&
                      selectedValues.values &&
                      convertListToString(
                        selectedValues.values,
                        "condition.item_description"
                      )) ||
                      (module_id == 42 &&
                        Array.isArray(selectedValues) &&
                        selectedValues.length &&
                        selectedValues
                          .map((value) =>
                            convertListToString(
                              value.values,
                              "condition.item_description"
                            )
                          )
                          .join("\n")) ||
                      (module_id == 39 &&
                        !Array.isArray(owner_selectedValues) &&
                        owner_selectedValues.values &&
                        convertListToString(
                          owner_selectedValues.values,
                          "condition.item_description"
                        )) ||
                      (module_id == 39 &&
                        Array.isArray(owner_selectedValues) &&
                        owner_selectedValues.length &&
                        owner_selectedValues
                          .map((value) =>
                            convertListToString(
                              value.values,
                              "condition.item_description"
                            )
                          )
                          .join("\n"))
                  )}
                </td>
              </tr>
              {owner_acceptance && (
                <tr>
                  <td>
                    نسخة من المخطط مصدقة من المكتب الهندسي مصدقة من المالك
                  </td>
                  <td valign="middle" align="center">
                    {checkImage(this.props, owner_acceptance)}
                  </td>
                </tr>
              )}
              {others && (
                <tr>
                  <td>أخرى</td>
                  <td valign="middle" align="center">
                    {checkImage(this.props, others)}
                  </td>
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
)(withTranslation("labels")(bda2l));
