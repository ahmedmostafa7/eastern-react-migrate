import React, { Component } from "react";
import { get, map, pick, keys } from "lodash";
import ShowField from "app/helpers/components/show";
import Approvals from "app/helpers/modules/imp_project/approvals";
const fields = {
  ...Approvals.sections.approvals.fields,
};
export default class submission extends Component {
  constructor(props) {
    super(props);
    const { approvals } = this.props.mainObject.approvals;
    this.data = approvals;
  }
  renderInfo = (field, key) => {
    return <ShowField field={field} val={get(this.data, key)} key={key} />;
  };
  render() {
    return map(pick(fields, keys(this.data)), this.renderInfo);
  }
}
