import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import mapDispatchToProps1 from "main_helpers/actions/main";
import ButtonActions from "app/helpers/actions";
import { get } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";

export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "button"),
    ...mapDispatchToProps1(dispatch),
  };
};

class buttonComp extends Component {
  state = { textKalb: "" };
  componentDidMount() {
    // const { values, changeText, t, text } = this.props;
    // let textChange =
    //   values.owner_type == "1"
    //     ? "اضافة مالك"
    //     : values.owner_type == "2"
    //     ? "اضافة قطاع"
    //     : "اضافة قطاع تانى";
    // if (changeText) {
    //   this.setState({ textKalb: textChange });
    // } else {
    //   this.setState({ textKalb: t(text) });
    // }
  }
  // componentDidMount() {}
  render() {
    const {
      icon,
      text,
      disabled,
      className,
      htmlType = "button",
      input,
      action,
      values,
      changeText,
      style,
      t,
      field,
    } = this.props;
    let useIcon = icon ? icon : null;
    return (
      <button
        className={`btn add-btnT ${className}`}
        onClick={() =>
          ButtonActions(
            action || (field?.in_summery && field?.action),
            this.props,
            values
          )
        }
        type={htmlType}
        icon={useIcon}
        disabled={disabled}
        {...{ ...input, style }}
      >
        {t(text || field?.text)}
      </button>
    );
  }
}

// export default connect(
//   (state) => ({
//     mainObject: get(state, "wizard.mainObject", {}),
//   }),
//   mapDispatchToProps
// )(withTranslation("labels")(buttonComp));
export default connect(
  mapStateToProps,
  appMapDispatchToProps
)(withTranslation("labels")(buttonComp));
