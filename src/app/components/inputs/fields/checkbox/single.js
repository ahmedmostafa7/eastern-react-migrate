import React from "react";
import { Checkbox } from "antd";
import mainInput from "app/helpers/main/input";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../../mapping";
import { connect } from "react-redux";
import { isFunction, isEqual } from "lodash";

class booleanComp extends mainInput {
  constructor(props) {
    super(props);
    const {
      input: { value, onChange },
      init_data,
    } = props;
    value ? onChange(1) : onChange(0);

    if (init_data) {
      init_data(props);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.data, this.props.data) ||
      !isEqual(nextProps.input.value, this.props.input.value) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      !isEqual(nextProps.forceUpdate, this.props.forceUpdate) ||
      true
    );
  }

  handleChange(value, options) {
    const {
      wizardSettings: { steps },
      input: { onChange },
      change,
      resetFields,
      values,
      mainObject,
      onChangeValidate,
    } = this.props;
    if (resetFields && change) {
      resetFields.map((f) => change(f, false));
    }

    onChange(value);
    if (onChangeValidate) onChangeValidate(value, this.props);
  }

  render() {
    const {
      t,
      className,
      disabled = false,
      input: { value, onChange, ...input },
      type,
      label,
      hide_sublabel,
      values,
      checked = false,
      onChangeValidate,
    } = this.props;
    return (
      <Checkbox
        {...{ className }}
        disabled={isFunction(disabled) ? disabled(this.props) : disabled}
        onChange={this.handleChange.bind(this)}
        {...input}
        checked={
          (checked != undefined &&
            isFunction(checked) &&
            checked(this.props)) ||
          value
            ? true
            : false
        }
      >
        {" "}
        {!hide_sublabel && t(label)}{" "}
      </Checkbox>
    );
  }
}

//export default withTranslation('labels')(booleanComp)
const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(withTranslation("messages", "labels")(booleanComp));
