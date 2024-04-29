import React from "react";
import { Input } from "antd";
import mainInput from "app/helpers/main/input";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { get, isEqual, omit, map, isFunction } from "lodash";

class customTextComp extends mainInput {
  constructor(props) {
    super(props);
    this.state = { value: isFunction(props.getValue) ? props.getValue() : "" };
  }

  changeInput = (e) => {
    const { textInputChanged = () => {}, input } = this.props;
    this.state["value"] = e.target.value;
    input.onChange(e.target.value);

    return textInputChanged(e.target.value, this.props, e);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.data, this.props.data) ||
      !isEqual(nextProps.input.value, this.props.input.value) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      !isEqual(nextProps.forceUpdate, this.props.forceUpdate)
    );
  }
  // onBlur = (e) => {
  //   const {
  //     input,
  //     textInputChanged,
  //     disabled
  // } = this.props;
  //   e.target.disabled = isFunction(disabled) ?  (disabled(input.value) != "" && disabled(input.value) != null && disabled(input.value) != undefined) : disabled;
  // }
  render() {
    const {
      disabled,
      textAfter,
      className,
      input: { value },
      label,
      type,
      placeholder,
      style,
      defaultValue,
      t,
      textInputChanged,
      defaultDisabled,
      values,
    } = this.props;
    console.log(values);

    return (
      <>
        {textAfter ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              disabled={isFunction(disabled) ? disabled(values) : disabled}
              {...{ className }}
              value={this.state["value"] || value}
              onChange={this.changeInput}
              //{...input}
              {...{ type }}
              placeholder={t(placeholder ? placeholder : label)}
              {...{ style }}
            />
            <span style={{ fontSize: "18px", marginRight: "10px" }}>
              {textAfter}
            </span>
          </div>
        ) : (
          <Input
            disabled={isFunction(disabled) ? disabled(values) : disabled}
            {...{ className }}
            value={this.state["value"] || value}
            onChange={this.changeInput}
            {...defaultValue}
            {...{ type }}
            placeholder={t(placeholder ? placeholder : label)}
            {...{ style }}
          />
        )}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(customTextComp);
