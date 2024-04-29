import React, { Component } from "react";
import Icon from "app/components/icon";

export default class singleSwitch extends Component {
  render() {
    const { val } = this.props;
    return <Icon icon={`fa ${val ? "fa-check" : "fa-close"}`} />;
  }
}
