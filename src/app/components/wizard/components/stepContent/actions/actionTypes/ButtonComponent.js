import React, { Component } from "react";
import { Button } from "antd";
import { withTranslation } from "react-i18next";

class ButtonComp extends Component {
  render() {
    const {
      actionVals: { label, htmlType, className, can_submit, color, label_name },
      onClick,
      t,
      newBtn,
    } = this.props;

    let Type = can_submit ? "submit" : htmlType;
    console.log(t(label_name || label));

    return newBtn ? (
      <button type={Type} {...{ onClick }}>
        {t(label_name || label)}
      </button>
    ) : (
      <Button
        style={
          (color && { margin: "10px", backgroundColor: color }) || {
            margin: "10px",
          }
        }
        type="primary"
        className={className}
        htmlType={Type}
        {...{ onClick }}
        id={t(label_name || label) == "توجيه" ? "saveEdits" : ""}
      >
        {t(label_name || label)}
      </Button>
    );
  }
}

export const ButtonComponent = withTranslation("actions")(ButtonComp);
