import React, { Component } from "react";
import { Modal, Form } from "antd";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { mapStateToProps } from "./mapping";
import { apply_permissions, serverFieldMapper } from "app/helpers/functions";
import RenderField from "app/components/inputs";

class inputsComponent extends Component {
  constructor(props) {
    super(props);
    const {
      modal: { fields },
    } = this.props;

    this.fields = fields.map((f) => serverFieldMapper(f));
    this.renderedFields = this.filteringFields(props.values);
  }

  filteringFields(values) {
    const {
      modal: { permissions },
    } = this.props;
    return this.fields.filter((field) =>
      apply_permissions(values, permissions, `${field.name}.form`)
    );
  }

  handleOk(values) {
    const {
      modal: { submit },
      handleCancel,
    } = this.props;
    submit(values);
    handleCancel();
  }

  render() {
    const {
      handleCancel,
      t,
      modal: { title },
      values,
      handleSubmit,
    } = this.props;
    return (
      <Modal
        title={t(title)}
        visible={true}
        onOk={handleSubmit(this.handleOk.bind(this))}
        okText={t("Yes")}
        cancelText={t("Cancel")}
        onCancel={handleCancel}
      >
        <Form className="input-dialog">
          {this.renderedFields.map((field) => (
            <Field
              component={RenderField}
              key={field.name}
              {...field}
              // {...{ ...field, ...this.props, values }}

              label={t(field.label)}
            />
          ))}
        </Form>
      </Modal>
    );
  }
}

export const inputs = reduxForm({
  form: "inputModalForm", // a unique identifier for this form
})(connect(mapStateToProps)(withTranslation("modals")(inputsComponent)));
