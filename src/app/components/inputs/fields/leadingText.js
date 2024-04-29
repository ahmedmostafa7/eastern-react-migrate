import React from "react";
import { Input } from "antd";
import mainInput from "app/helpers/main/input";
import { withTranslation } from "react-i18next";

class leadingTextComp extends mainInput {
  constructor(props) {
    super(props);
    const { addonBefore } = props;
    props.input.onChange(addonBefore);
  }

  render() {
    const { className, input, label, placeholder, style, t } = this.props;
    return (
      <Input
        {...{ className }}
        {...input}
        type="number"
        placeholder={t(placeholder ? placeholder : label)}
        {...{ style }}
      />
    );
  }
}

export const leadingText = withTranslation("labels")(leadingTextComp);
