import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import {
  convertToArabic,
  localizeNumber,
  getInfo,
  remove_duplicate,
  checkImage,
  map_object,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { esriRequest } from "../../../../../../../inputs/fields/identify/Component/common/esri_request";
import { mapUrl } from "../../../../../../../inputs/fields/identify/Component/mapviewer/config/map";
import { map, get, assign, isEmpty } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
const backGroundStyle = {
  backgroundColor: "#9797ca",
};
class update_contract_submission_data extends Component {
  resizeImage = (evt) => {
    evt.target.style.height =
      evt.target.clientWidth - evt.target.clientWidth * 0.3 + "px";
  };

  render() {
    let {
      t,
      mainObject: { submissionType },
      treeNode: {
        option: { tabType, data, label },
      },
    } = this.props;

    return (
      (data && (
        <>
          <div>
            <table className="table table-bordered">
              {[
                {
                  key: "request_no",
                  label: "رقم معاملة التدقيق المكاني",
                  isValue: true,
                },
                { key: "update_owner_date", label: "CONTRACTUPDATEOWNWEDATA" },
                {
                  key: "modify_length_boundries",
                  label: "CONTRACTUPDATEBOUNDRIESMODIFICATION",
                },
                {
                  key: "modify_transaction_type_dukan",
                  label: "DUKANTRANSACTIONTYPE",
                },
                // {
                //   key: "modify_area_increase",
                //   label: "CONTRACTUPDATEAREAMODIFICATIONINC",
                // },
                // {
                //   key: "modify_area_decrease",
                //   label: "CONTRACTUPDATEAREAMODIFICATIONDEC",
                // },
                {
                  key: "update_lengths_units",
                  label: "CONTRACTUPDATELENGTHSUNITS",
                },
                {
                  key: "update_district_name",
                  label: "CONTRACTUPDATEDISTRECTNAME",
                },
                {
                  key: "update_plan_number",
                  label: "CONTRACTUPDATEPLANENUMBER",
                },
                { key: "update_block", label: "CONTRACTUPDATEBLOCK" },
                {
                  key: "update_paper_contract",
                  label: "CONTRACTUPDATEPAPERCONTRACT",
                },
                {
                  key: "splite_parcels_by_one_contarct",
                  label: "CONTRACTUPDATETOONECONTRACT",
                },
                {
                  key: "marge_contracts_for_parcels",
                  label: "CONTRACTUPDATEMARGECONTRACTS",
                },
              ]
                .filter((item) => data[item.key])
                .map((item, index) => {
                  return (
                    <tr>
                      <td>{t(`${item.label}`)}</td>
                      {item.isValue && (
                        <td>{convertToArabic(data[item.key])}</td>
                      )}
                    </tr>
                  );
                }) || (
                <tr>
                  <td>لا يوجد بيانات</td>
                </tr>
              )}
            </table>
          </div>
        </>
      )) || <></>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(update_contract_submission_data));
