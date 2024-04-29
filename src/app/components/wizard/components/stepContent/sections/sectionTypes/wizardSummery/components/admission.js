import React, { Component } from "react";
import { get, map, pick, keys } from "lodash";
import ShowField from "app/helpers/components/show";
import Admission from "app/helpers/modules/imp_project/admission";
const fields = {
  ...Admission.sections.admit.fields,
};
export default class submission extends Component {
  constructor(props) {
    super(props);
    const { admit } = this.props.mainObject.admission;
    this.data = admit;
  }
  renderInfo = (field, key) => {
    return <ShowField field={field} val={get(this.data, key)} key={key} />;
  };
  render() {
    return map(pick(fields, keys(this.data)), this.renderInfo);
  }
}
