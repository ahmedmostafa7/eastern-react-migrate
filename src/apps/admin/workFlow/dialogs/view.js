import React, { Component } from "react";
import { Modal, Form } from "antd";
import { Field, reduxForm } from "redux-form";
import renderField from "app/components/inputs";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";

class inputComponent extends Component {
  render() {
    const { title, fields } = this.props.dialog;
    const { handleCancel, submitting } = this.props;
    return (
      <Modal
        title={title}
        visible={true}
        footer={null}
        confirmLoading={submitting}
        onCancel={handleCancel}
      >
        <Form layout="horizontal">
          {fields.map((field) => (
            <Field
              component={renderField}
              key={field.name}
              {...{ ...field }}
              field="label"
              hideLabel={false}
            />
          ))}
        </Form>
      </Modal>
    );
  }
}

export const view = reduxForm({
  form: "WorkFlowInputForm", // a unique identifier for this form
})(
  connect((state) => {
    return { values: getFormValues("WorkFlowInputForm")(state) };
  }, null)(inputComponent)
);
