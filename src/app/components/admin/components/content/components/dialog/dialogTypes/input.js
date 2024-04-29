import React, { Component } from "react";
import { Modal, Form } from "antd";
import renderField from "app/components/inputs";
import { connect } from "react-redux";
import {
  apply_field_permission,
  serverFieldMapper,
} from "app/helpers/functions";
import { getFormValues, getFormMeta } from "redux-form";
import { isEqual, map } from "lodash";
import {
  composeAsyncValidations,
  createReduxForm,
} from "app/helpers/functions";
import { reduxForm, Field } from "redux-form";
import memoize from "memoize-one";
import { withTranslation } from "react-i18next";

class inputComponent extends Component {
  constructor(props) {
    super(props);
    const { fields = {} } = this.props;
    this.state = { submitting: false };
    this.fields = map(fields, (field, key) => ({
      name: key,
      ...serverFieldMapper(field),
    }));
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     return !isEqual(nextProps.actives, this.props.actives) || !isEqual(nextState, this.state) || !isEqual(nextProps.values, this.props.values)
  // }

  filteringFields = memoize((values) => {
    return this.fields.filter((field) =>
      apply_field_permission(values, field, this.props)
    );
  });

  handleOk(values) {
    const { removeDialog, submitFun, t } = this.props;
    this.setState({ submitting: true });
    submitFun(values)
      .then(() => {
        removeDialog();
      })
      .catch(() => {
        this.setState({ submitting: false });
        window.notifySystem("error", t("failed to save"));
      });
  }

  render() {
    const { title, handleSubmit, removeDialog, values, t } = this.props;
    const { submitting } = this.state;
    this.renderedFields = this.filteringFields(values);

    return (
      <Modal
        title={title}
        visible={true}
        onOk={handleSubmit(this.handleOk.bind(this))}
        onCancel={removeDialog}
        confirmLoading={submitting}
        okText={t("Submit")}
        cancelText={t("Cancel")}
        okButtonProps={{ disabled: submitting, loading: submitting }}
      >
        <Form>
          {this.renderedFields.map((field) => (
            <Field
              component={renderField}
              key={field.name}
              {...{ values, ...field }}
              label={field.label}
            />
          ))}
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const meta = getFormMeta(ownProps.form)(state);
  const actives =
    (meta && Object.keys(meta).find((field) => meta[field].active)) || null;
  return {
    values: getFormValues(ownProps.form)(state),
    actives,
  };
};

// export const input = reduxForm({
//     asyncValidate: composeAsyncValidations('fields', 'currentModule'),
//     form: 'AdminInputForm',
// })((connect(mapStateToProps))(withTranslation('actions')(inputComponent)));

const theComponent = connect(mapStateToProps)(
  withTranslation("actions")(inputComponent)
);

export const input = createReduxForm(
  theComponent,
  { form: "AdminInputForm" },
  "fields",
  "currentModule"
);
