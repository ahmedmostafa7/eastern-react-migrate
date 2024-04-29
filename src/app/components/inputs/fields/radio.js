import React, { Component } from "react";
import mainInput from "app/helpers/main/input";
import { Radio } from "antd";
import { withTranslation } from "react-i18next";
import { Input } from "antd";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { get, isEqual, omit, map, isFunction } from "lodash";

const RadioGroup = Radio.Group;
export class radioComp extends mainInput {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { init } = this.props;

    if (init) init(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.options, this.props.options) ||
      !isEqual(nextProps.input.value, this.props.input.value) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      (!isFunction(this.props.forceUpdate) &&
        !isEqual(nextProps.forceUpdate, this.props.forceUpdate))
    );
  }

  render() {
    // console.log(this.props);
    const {
      input: { ...input },
      type,
      options = [],
      className,
      placeholder,
      labelText,
      t,
      value,
      defaultValue,
      anotherField,
      inputText,
      typeText,
      disabled,
      onClick,
    } = this.props;

    let selectedOptions = map(options, (option, index) => ({
      ...option,
      disabled: isFunction(option.disabled)
        ? option.disabled(input.value, this.props)
        : option.disabled,
      label: t(option.label),
    }));

    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {(onClick && (
          <RadioGroup
            disabled={
              isFunction(disabled)
                ? disabled(input.value, this.props)
                : disabled
            }
            {...{ defaultValue }}
            {...{ className }}
            {...input}
            onChange={(event) => {
              if (onClick) {
                onClick(event, this.props);
              }
            }}
            options={selectedOptions}
            type={type}
          />
        )) || (
          <RadioGroup
            disabled={
              isFunction(disabled)
                ? disabled(input.value, this.props)
                : disabled
            }
            {...{ defaultValue }}
            {...{ className }}
            {...input}
            options={selectedOptions}
            type={type}
          />
        )}
        {/* {anotherField && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gridGap: "10px",
            }}
          >
            <label>{labelText}</label>
            <Input
              // value={value}
              {...inputText}
              type="text"
              placeholder={t(placeholder ? placeholder : labelText)}
              // label={labelText}
            />
          </div>
        )} */}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(radioComp));
