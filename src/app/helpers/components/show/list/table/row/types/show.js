import * as Fields from "app/helpers/components/show/types";
import React, { Component } from "react";
import { get } from "lodash";
export default class show extends Component {
  render() {
    const { field, d } = this.props;
    const FComponent = get(
      Fields,
      get(this.props, "field.field"),
      Fields.label
    );
    return <FComponent field={field} val={d} />;
  }
}
