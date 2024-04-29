import React, { Component } from "react";
import { get, map, pickBy } from "lodash";
import ShowField from "app/helpers/components/show";
import types from "app/helpers/modules/service/type";
import { apply_field_permission } from "app/helpers/functions";

const fields = {
  ...types.sections.submission.fields,
};
export default class submission extends Component {
  constructor(props) {
    super(props);
    const { submission } = this.props.mainObject.serviceSubmissionType;
    this.data = submission;
    this.fields = pickBy(fields, (field) => {
      return apply_field_permission(submission, field, this.props);
    });
    console.log(this.fields);
  }
  renderInfo = (field, key) => {
    return (
      <ShowField
        field={field}
        val={get(this.data, field.name || key)}
        key={key}
        values={this.data}
      />
    );
  };
  render() {
    return map(this.fields, this.renderInfo);
  }
}
