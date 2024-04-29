import React, { Component } from "react";
import { Select } from "antd";
import { withTranslation } from "react-i18next";
import { get, map } from "lodash";
import {
  convertToArabic,
  convertToEnglish,
} from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
const Option = Select.Option;
class multiSelect extends Component {
  data = [];
  render() {
    const { values, filter = {}, data, t } = this.props;
    // if (this.data.length < data.length) {
    this.data = data;
    // }
    const value = get(values, filter.name);
    return (
      <Select
        //style={{ width: "30%" }}
        mode={filter.mode || "multiple"}
        showSearch
        //getPopupContainer={(trigger) => trigger.parentNode}
        optionFilterProp="children"
        value={value}
        onChange={this.props.handleChange.bind(this, filter)}
        placeholder={t(filter ? filter.placeholder : filter.label)}
        allowClear
        autoClearSearchValue
        filterOption={(input, option) => {
          return (
            option.props.children
              ?.toLowerCase()
              ?.indexOf(convertToArabic(String(input).toLowerCase())) >= 0
          );
        }}
      >
        {map(this.data, (d, key) => (
          <Option value={d} data={d} key={d}>
            {convertToArabic(d)}
          </Option>
        ))}
      </Select>
    );
  }
}

export default withTranslation("label")(multiSelect);
