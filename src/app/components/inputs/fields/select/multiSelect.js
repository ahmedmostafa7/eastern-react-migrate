import React from "react";
import { Select } from "antd";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { get, map, isFunction, isEqual } from "lodash";
import { selectComponent } from "./select";
console.log(selectComponent);
const Option = Select.Option;
class multiSelectComponent extends selectComponent {
  constructor(props) {
    super(props);
    const { init_data } = this.props;

    if (init_data) {
      init_data(this.props);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    //this.checkData(nextProps, this.props);
    return (
      !isEqual(nextProps.data, this.props.data) ||
      !isEqual(nextProps.input.value, this.props.input.value) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      !isEqual(nextProps.forceUpdate, this.props.forceUpdate)
    );
  }

  handleChange(value) {
    const { maxChoices } = this.props;
    const {
      input: { onChange },
      init_data,
    } = this.props;
    // onChange(value)
    if (Array.isArray(value)) {
      maxChoices
        ? value.length <= maxChoices && onChange(value)
        : onChange(value);
    }

    
    if (this.props.onSelect) {
      this.props.onSelect(value, this.props);
    }
  }
  render() {
    const {
      input: { value, ...input },
      label,
      placeholder,
      ux_pattern,
      data = [],
      label_key = "label",
      value_key = "value",
      disabled,
    } = this.props;
    return (
      <Select
        style={{ direction: "rtl", textAlign: "right" }}
        mode="multiple"
        onPopupScroll={
          ux_pattern == "infiniteScrolling" && this.onScroll.bind(this)
        }
        disabled={isFunction(disabled) ? disabled(value, this.props) : disabled}
        showSearch
        getPopupContainer={(trigger) => trigger.parentNode}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.props?.children
            ?.toLowerCase()
            ?.indexOf(input?.toLowerCase()) >= 0
        }
        value={value == "" ? undefined : value}
        {...input}
        onChange={this.handleChange.bind(this)}
        placeholder={placeholder ? placeholder : label}
        //allowClear={false}
      >
        {Array.isArray(data) &&
          typeof data[0] == "object" &&
          map(data, (d, key) => (
            <Option value={get(d, value_key)} data={d} key={get(d, value_key)}>
              {get(d, label_key)}
            </Option>
          ))}
        {Array.isArray(data) &&
          typeof data[0] == "string" &&
          map(data, (d, key) => (
            <Option value={d} data={d} key={d}>
              {d}
            </Option>
          ))}
      </Select>
    );
  }
}

export const multiSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)(multiSelectComponent);
export default multiSelect;
