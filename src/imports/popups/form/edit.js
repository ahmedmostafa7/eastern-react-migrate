import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import mapDispatchToProps from "main_helpers/actions/main";
import { Form } from "antd";
import { FormControl } from "app/components/inputs";
import { map, filter } from "lodash";

export class edit extends Component {
  submit = (values) => {
    const { ok, onCancel } = this.props;
    ok(values, this.props).then((data) => {
      onCancel();
    });
  };
  render() {
    const { fields, handleSubmit } = this.props;
    return (
      <Form onSubmit={handleSubmit(this.submit)}>
        {map(filter(fields, { edit: true }), (d) => (
          <FormControl {...d} />
        ))}
      </Form>
    );
  }
}

export default reduxForm({
  form: "stepForm",
  enableReinitialize: true,
})(connect(null, mapDispatchToProps)(edit));
