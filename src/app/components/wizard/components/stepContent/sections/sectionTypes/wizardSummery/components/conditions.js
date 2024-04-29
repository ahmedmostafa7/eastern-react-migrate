import React, { Component } from "react";
import { get, map, pickBy } from "lodash";
import { Summary } from "app/helpers/modules/service/conditions";
import ShowField from "app/helpers/components/show";
import { apply_field_permission } from "app/helpers/functions";
const fields = {
  conditions: Summary.sections.conditions.fields,
};

export default class submission extends Component {
  constructor(props) {
    super(props);
    //
    this.fields = pickBy(fields.conditions, (field) => {
      return apply_field_permission(submission, field, this.props);
    });
  }
  renderInfo = (data, field, key) => {
    // console.log(field, key)

    if (
      ["utility_same_distance", "utility_opposite_distance"].indexOf(key) != -1
    ) {
      let value = get(data, key);
      if (typeof value == "object") {
        value =
          (value.inputValue && `${value.inputValue} ${value.extValue || ""}`) ||
          "";
      }
      return <ShowField field={field} val={value} key={key} />;
    }
    return <ShowField field={field} val={get(data, key)} key={key} />;
  };
  render() {
    const { conditions } = this.props.mainObject.Conditions;
    // console.log(fields.conditions)
    return <>{map(this.fields, this.renderInfo.bind(this, conditions))}</>;
  }
}
