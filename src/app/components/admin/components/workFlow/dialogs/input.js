import React, { Component } from "react";
import { Modal, Form } from "antd";
import { Field } from "redux-form";
import renderField from "app/components/inputs";
import { connect } from "react-redux";
import { getFormValues } from "redux-form";
import { isEqual } from "lodash";
import {
  apply_field_permission,
  serverFieldMapper,
} from "app/helpers/functions";
import { get } from "lodash";
import { createReduxForm } from "app/helpers/functions";
import { withTranslation } from "react-i18next";

class inputComponent extends Component {
  constructor(props) {
    super(props);
    const { fields } = this.props.dialog;
    this.fields = fields.map((f) => serverFieldMapper(f));
  }

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(nextProps.values, this.props.values) ||
      !isEqual(nextProps.dialog.fields, this.props.fields)
    );
  }

  render() {
    const { title, submit, tableData } = this.props.dialog;
    const {
      handleSubmit,
      handleCancel,
      submitting,
      values,
      selectors,
      change,
      t,
    } = this.props;

    let renderedFields = this.fields.filter((field) => {
      return apply_field_permission(values, field, this.props);
    });
    let stepsActions = get(selectors, "steps_actions.data", []);

    return (
      <Modal
        width={700}
        title={t(title)}
        visible={true}
        onOk={handleSubmit((values) => submit(values, stepsActions))}
        okText={t("Ok")}
        onCancel={handleCancel}
        cancelText={t("Cancel")}
        confirmLoading={submitting}
      >
        <Form>
          {renderedFields.map((field) => (
            <Field
              component={renderField}
              key={field.name}
              tableData={tableData}
              change={change}
              {...{ ...field }}
            />
          ))}
        </Form>
      </Modal>
    );
  }
}

const theComponent = connect((state) => {
  return {
    values: getFormValues("WorkFlowInputForm")(state),
    selectors: state.selectors,
  };
}, null)(withTranslation("modals")(inputComponent));

export const input = createReduxForm(
  theComponent,
  { form: "WorkFlowInputForm" },
  "dialog.fields",
  "dialog.workFlowId"
);
