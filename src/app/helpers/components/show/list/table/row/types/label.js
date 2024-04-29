import React, { Component } from "react";
import { withTranslation } from "react-i18next";

class label extends Component {
  render() {
    const { t } = this.props;
    return <span>{this.props.d && t(this.props.d)}</span>;
  }
}

export default withTranslation("labels")(label);
