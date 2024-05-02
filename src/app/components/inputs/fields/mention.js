import React from "react";
import { Mentions } from "antd";
import mainInput from "app/helpers/main/input";
import { withTranslation } from "react-i18next";
import { keys, get } from "lodash";
const { toString, toContentState } = Mentions;

export class mentionsComponent extends mainInput {
  state = {
    dataSource: [],
  };
  handleChange(contentState) {
    const {
      input: { onChange },
    } = this.props;
    onChange(toString(contentState));
  }
  onSearchChange(value, trigger) {
    const { suggestions } = this.props;
    let data = get(suggestions, trigger, []);
    data = Array.isArray(data) ? data : [];
    this.setState({
      dataSource: data.filter((item) => item.indexOf(value) !== -1),
    });
  }
  render() {
    const {
      className,
      input: { value, onBlur },
      t,
      suggestions,
      type,
      label,
      placeholder,
      notFoundContent,
    } = this.props;
    return (
      <Mention
        {...{ className }}
        onBlur={onBlur}
        defaultValue={toContentState(String(value))}
        onChange={this.handleChange.bind(this)}
        notFoundContent={notFoundContent ? notFoundContent : t("No data")}
        suggestions={this.state.dataSource}
        onSearchChange={this.onSearchChange.bind(this)}
        prefix={keys(suggestions)}
        label={label}
        type={type}
        placeholder={placeholder ? placeholder : label}
        {...{ className }}
      />
    );
  }
}

export default withTranslation("messages")(mentionsComponent);
