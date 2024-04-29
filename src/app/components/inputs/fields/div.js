import React from "react";
import { Input } from "antd";
import mainInput from "app/helpers/main/input";
import { withTranslation } from "react-i18next";

class divClass extends mainInput {
  render() {
    const {
      disabled,
      className,
      input,
      label,
      type,
      placeholder,
      style,
      value,
      t,
    } = this.props;
    return <div></div>;
  }
}

export default withTranslation("labels")(divClass);
