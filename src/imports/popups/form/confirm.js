import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import mapDispatchToProps from "main_helpers/actions/main";
import { Form } from "antd";
import Actions from "./actions";
import { withTranslation } from "react-i18next";

export class create extends Component {
  submit = (values) => {
    const { ok, onCancel } = this.props;
    ok(values, this.props).then((data) => {
      onCancel();
    });
  };
  render() {
    const { msg, t, handleSubmit } = this.props;
    console.log("render");
    return (
      <Form onSubmit={handleSubmit(this.submit)}>
        <p>{t(msg)}</p>
        <Actions {...this.props} />
      </Form>
    );
  }
}

export default reduxForm({
  form: "Confirm",
  enableReinitialize: true,
})(connect(null, mapDispatchToProps)(withTranslation("labels")(create)));
