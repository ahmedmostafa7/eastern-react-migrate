import React, { Component } from "react";
import { FormControl } from "app/components/inputs";
import { serverFieldMapper } from "app/helpers/functions";
export default class input extends Component {
  constructor(props) {
    super(props);
    this.field = serverFieldMapper(props.field);
  }
  render() {
    const { mainProps } = this.props;
    // console.log(this.field)
    return <FormControl {...this.field} {...mainProps} />;
  }
}
