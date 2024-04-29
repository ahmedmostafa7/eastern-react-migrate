import React, { Component } from "react";
import { serverFieldMapper } from "app/helpers/functions";
export default class input extends Component {
  constructor(props) {
    super(props);
    this.field = serverFieldMapper(props.field);
  }
  render() {
    const { mainProps, ShowField, d, row } = this.props;
    // console.log(this.field)
    return (
      <ShowField
        {...this.field}
        {...mainProps}
        val={d}
        values={row}
        field={this.field}
      />
    );
  }
}
