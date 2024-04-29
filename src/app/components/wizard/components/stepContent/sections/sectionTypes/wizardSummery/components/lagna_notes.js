import React, { Component } from "react";
import { get, map } from "lodash";
import ShowField from "app/helpers/components/show";
import lagna_notes from "../../../../../../../../../app/components/wizard/modulesObjects/plan_approval/steps/going_survey_review_approval_details_module/lagna_notes.js";
import { convertToArabic } from "../../../../../../../inputs/fields/identify/Component/common/common_func.js";

export default class lagnaNotes extends Component {
  constructor(props) {
    super(props);
  }
  renderInfo = (data, field, key) => {
    delete field?.fields?.actions;
    if (field.field != "button") {
      if (field.field == "list") {
        field.fields = {
          remark: field.fields.remark,
          checked: field.fields.checked,
        };

        let remarks = get(data, key, []).map((remark) => ({
          ...remark,
          remark: convertToArabic(remark.remark),
        }));
        return <ShowField field={field} val={remarks} key={key} />;
      }
      if (field.field == "text") {
        return (
          <ShowField
            field={field}
            val={convertToArabic(get(data, key))}
            key={key}
          />
        );
      }
      return <ShowField field={field} val={get(data, key)} key={key} />;
    }
  };
  render() {
    const { lagna_remarks } = this.props.mainObject.lagna_notes;

    return (
      <>
        {map(
          lagna_notes.sections.lagna_remarks.fields,
          this.renderInfo.bind(this, lagna_remarks)
        )}
      </>
    );
  }
}
