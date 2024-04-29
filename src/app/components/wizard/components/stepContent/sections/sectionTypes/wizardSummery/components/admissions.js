import React, { Component } from "react";
import { get, map, pick, keys } from "lodash";
import ShowField from "app/helpers/components/show";
import admission_ctrl from "../../../../../../modulesObjects/plan_approval/steps/addmission_ministry_ctrl_module/admission_ctrl";
import { convertToArabic } from "../../../../../../../inputs/fields/identify/Component/common/common_func";
const fields = {
  ...admission_ctrl.sections.admission_ctrl.fields,
};
export default class submission_ctrl extends Component {
  constructor(props) {
    super(props);
    const { admission_ctrl } = this.props.mainObject.admissions;

    this.data = {
      attachments: JSON.parse(JSON.stringify(admission_ctrl)).attachments.map(
        (attachment) => {
          return {
            ...attachment,
            request_no: convertToArabic(attachment.request_no),
            request_date: convertToArabic(attachment.request_date),
          };
        }
      ),
      //...final_elec_letter
    };
  }
  renderInfo = (field, key) => {
    delete field?.fields?.actions?.actions?.edit;
    delete field?.fields?.actions?.actions?.add;
    delete field?.fields?.actions?.actions?.delete;
    return <ShowField field={field} val={get(this.data, key)} key={key} />;
  };
  render() {
    return map(pick(fields, keys(this.data)), this.renderInfo);
  }
}
