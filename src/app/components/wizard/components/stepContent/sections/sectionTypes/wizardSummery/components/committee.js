import React, { Component } from "react";
import { get, map } from "lodash";
import ShowField from "app/helpers/components/show";
import committee from "app/helpers/modules/imp_project/committee";
const Committee = committee(3);
const fields = {
  ...Committee.sections.members.fields,
};
export default class submission extends Component {
  constructor(props) {
    super(props);
    const { members } = this.props.mainObject.committee;
    this.data = members;
  }
  renderInfo = (field, key) => {
    return <ShowField field={field} val={get(this.data, key)} key={key} />;
  };
  render() {
    return map(fields, this.renderInfo);
  }
}
