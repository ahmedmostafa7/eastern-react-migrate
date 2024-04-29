import React from "react";
import { Input } from "antd";
import mainInput from "app/helpers/main/input";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import { isFunction, isEqual } from "lodash";
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

  // onChangeInput(e){
  //   //
  //   const {onExtChange, input:  {onChange}} = this.props;
  //   if (onExtChange && typeof onExtChange == 'function') {
  //     onExtChange(e);
  //   }
  //   onChange(e);
  // }
  render() {
    const {
      input: { value, onChange },
      value_func,
      saveComment,
    } = this.props;
    let {
      className,
      input,
      label,
      type,
      placeholder,
      style,
      textEdit = "",
      rows = 1,
      t,
      onChangeInput,
      disabled,
      values,
    } = this.props;
    // console.log("rows", rows)
    onChange(value);
    // saveComment(value);
    disabled = isFunction(disabled) ? disabled(values, this.props) : disabled;
    return (
      <form onSubmit={this.handleSubmit.bind(this)}>
        {(onChangeInput && (
          <TextArea
            disabled={disabled}
            {...{ className }}
            {...{ rows }}
            {...input}
            {...{ type }}
            placeholder={t(placeholder ? placeholder : label)}
            value={value || textEdit}
            {...{ style }}
            onChange={onChangeInput.bind(this, this.props)}
          />
        )) || (
          <TextArea
            disabled={disabled}
            {...{ className }}
            {...{ rows }}
            {...input}
            {...{ type }}
            placeholder={t(placeholder ? placeholder : label)}
            value={value || textEdit}
            {...{ style }}
          />
        )}
        {/* <button type="submit">ارسال</button> */}
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
