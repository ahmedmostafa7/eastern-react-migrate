import React from "react";
import { Input } from "antd";
import mainInput from "app/helpers/main/input";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../fields/select/mapping";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
const { TextArea } = Input;

class textAreaComp extends mainInput {
  handleSubmit(e) {
    const {
      input: { value, onChange },
      value_func,
      saveComment,
    } = this.props;
    onChange(e.target.value);
    saveComment(e.target.value);
  }
  render() {
    const {
      input: { value, onChange },
      value_func,
      saveComment,
    } = this.props;
    const {
      className,
      input,
      label,
      type,
      placeholder,
      style,
      textEdit = "",
      rows = 1,
      t,
    } = this.props;
    // console.log("rows", rows)
    onChange(value);
    // saveComment(value);
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        <TextArea
          {...{ className }}
          {...{ rows }}
          {...input}
          {...{ type }}
          placeholder={t(placeholder ? placeholder : label)}
          value={value || textEdit}
          {...{ style }}
        />
        <button type="submit">ارسال</button>
      </form>
    );
  }
}

// export default withTranslation('labels')(textAreaComp)
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("labels")(textAreaComp))
);
