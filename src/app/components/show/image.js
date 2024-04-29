import React, { Component } from "react";
import { SERVER_URL } from "configFiles/config";
export default class image extends Component {
  render() {
    console.log("d", SERVER_URL, src);
    const { src, ...props } = this.props;
    return <img {...props} src={`${SERVER_URL}${src}`} />;
  }
}
