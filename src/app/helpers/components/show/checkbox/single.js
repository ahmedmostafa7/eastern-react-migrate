import React from "react";
import { withTranslation } from "react-i18next";
import Icon from "app/components/icon";

class booleanComp extends React.Component {
  render() {
    const { val = false } = this.props;
    return <Icon icon={`fa ${val ? "fa-check" : "fa-times"}`} />;
  }
}

export default withTranslation("labels")(booleanComp);
