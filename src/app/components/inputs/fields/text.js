import React from "react";
import { Input } from "antd";
import mainInput from "app/helpers/main/input";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { isFunction, isEqual } from "lodash";

class textComp extends mainInput {
  componentDidMount() {
    const { init_data } = this.props;

    if (init_data) {
      init_data(this.props);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.data, this.props.data) ||
      !isEqual(nextProps.input.value, this.props.input.value) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      (typeof nextProps?.forceUpdate != "function" &&
        typeof this.props.forceUpdate != "function" &&
        !isEqual(nextProps?.forceUpdate, this.props.forceUpdate)) ||
      true
      //   ||
      // (typeof nextProps?.forceUpdate == "function" && nextProps?.forceUpdate())
    );
  }

  render() {
    let {
      disabled,
      textAfter,
      className,
      input,
      label,
      type,
      placeholder,
      style,
      value,
      defaultValue,
      t,
      values,
      title,
      onChangeInput,
    } = this.props;
    disabled = isFunction(disabled) ? disabled(values, this.props) : disabled;
    return (
      <>
        {textAfter ? (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Input
              // disabled={disabled}
              disabled={disabled}
              {...{ className }}
              value={value}
              {...input}
              {...{ type }}
              placeholder={t(placeholder ? placeholder : label)}
              {...{ style }}
              title={title}
              onChange={(evt) => {
                if (onChangeInput) {
                  onChangeInput(this.props, evt);
                }
                this.props.input.onChange(evt.target.value);
              }}
            />
            <b style={{ fontSize: "18px", marginRight: "10px" }}>
              ({textAfter})
            </b>
          </div>
        ) : (
          <Input
            disabled={disabled}
            {...{ className }}
            value={value}
            {...input}
            {...defaultValue}
            {...{ type }}
            placeholder={t(placeholder ? placeholder : label)}
            {...{ style }}
            title={title}
            onChange={(evt) => {
              if (onChangeInput) {
                onChangeInput(this.props, evt);
              }
              this.props.input.onChange(evt.target.value);
            }}
          />
        )}
      </>
    );
  }
}

//export default withTranslation("labels")(textComp);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(textComp));
