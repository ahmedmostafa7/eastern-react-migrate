import React, { Component } from "react";
import HijriDatePicker from "./components/HijriDatePicker";
import { isFunction, isEqual } from "lodash";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../../mapping";

class hijriDatePickerComp extends Component {
  componentDidMount() {
    const { init_data } = this.props;

    if (init_data) {
      init_data(this.props);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //
    return (
      !isEqual(nextProps.data, this.props.data) ||
      !isEqual(nextProps.input.value, this.props.input.value) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      (typeof nextProps?.forceUpdate != "function" &&
        typeof this.props.forceUpdate != "function" &&
        !isEqual(nextProps?.forceUpdate, this.props.forceUpdate)) ||
      true
    );
  }

  render() {
    let { disabled, values, className, input, label, placeholder, style, t } =
      this.props;
    disabled = isFunction(disabled) ? disabled(values, this.props) : disabled;
    ////
    return (
      <HijriDatePicker
        disabled={disabled}
        disableOnClickOutside
        {...{ className, input }}
        placeholder={t(placeholder ? placeholder : label)}
        {...{ style }}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(hijriDatePickerComp));
