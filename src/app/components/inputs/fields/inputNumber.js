import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Select, Button, Form, message } from "antd";
import { get, isEqual, omit, map, isFunction } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { withRouter } from "apps/routing/withRouter";
import mainInput from "app/helpers/main/input";
import { InputNumber } from "antd";

export class inputNumberComp extends mainInput {
  constructor(props) {
    super(props);

    if (this.props?.hasAU) {
      const {
        input: { value, onChange },
      } = props;

      let isValueString = typeof value == "string";
      this.state = {
        inputValue:
          (value && typeof value == "object" && value?.inputValue) ||
          (value != undefined && typeof value == "string" && value) ||
          "",
        extValue:
          (value && typeof value == "object" && value?.extValue) ||
          this.props?.extInitialValue,
      };

      if (isValueString) {
        onChange(this.state);
      }
    }

    if (props.init_data) {
      props.init_data(props);
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     !isEqual(nextProps.data, this.props.data) ||
  //     !isEqual(nextProps.input.value, this.props.input.value) ||
  //     !isEqual(nextProps.lang, this.props.lang) ||
  //     !isEqual(nextProps.forceUpdate, this.props.forceUpdate)
  //   );
  // }

  render() {
    let {
      className,
      input,
      label,
      type,
      t,
      textAfter,
      hasAU,
      data,
      disabled,
      extDisabled,
      title,
      values,
      placeholder,
    } = this.props;
    disabled = isFunction(disabled) ? disabled(values, this.props) : disabled;
    return (
      <>
        {(textAfter && (
          <div>
            <b>({textAfter})</b>
            <InputNumber
              {...{ className }}
              {...input}
              disabled={disabled}
              type={"number"}
              placeholder={t(label || placeholder)}
              title={title}
              onChange={(val) => {
                if (this.props.onClick) {
                  this.props.onClick(this.props, val);
                } else {
                  this.props.input.onChange(val);
                }
              }}
            />
          </div>
        )) ||
          (hasAU && (
            <>
              <InputNumber
                title={title}
                {...{ className }}
                disabled={disabled}
                type={"number"}
                placeholder={t(label || placeholder)}
                onChange={(val) => {
                  this.setState({ inputValue: val }, () => {
                    this.props.input.onChange({
                      inputValue: val,
                      extValue: this.state["extValue"],
                    });
                  });
                }}
                value={this.state["inputValue"]}
              />
              {
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  autoFocus
                  onChange={(val) => {
                    this.setState({ extValue: val }, () => {
                      this.props.input.onChange({
                        inputValue: this.state["inputValue"],
                        extValue: val,
                      });
                    });
                  }}
                  value={this.state["extValue"]}
                  disabled={extDisabled}
                >
                  <Option disabled="disabled" value={null}>
                    {"من فضلك ادخل وحدة الطول"}
                  </Option>
                  {data.map((e) => (
                    <Option key={e.value} value={e.value}>
                      {e.label}{" "}
                    </Option>
                  ))}
                </Select>
              }
            </>
          )) || (
            <>
              <InputNumber
                title={title}
                {...{ className }}
                {...input}
                disabled={disabled}
                type={"number"}
                placeholder={t(label || placeholder)}
                onChange={(val) => {
                  if (this.props.onClick) {
                    this.props.onClick(this.props, val);
                  } else {
                    this.props.input.onChange(val);
                  }
                }}
              />
            </>
          )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(inputNumberComp));
