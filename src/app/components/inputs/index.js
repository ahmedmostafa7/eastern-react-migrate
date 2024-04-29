import React, { Component, Suspense } from "react";
import * as FieldsComponent from "./fields";
import { get, isString, isEqual, pick } from "lodash";
import { Form } from "antd";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Field } from "redux-form";
import applyFilters from "main_helpers/functions/filters";

class renderFields extends Component {
  constructor(props) {
    super(props);
    this.FieldComponent = get(
      FieldsComponent,
      props.field,
      FieldsComponent.text
    );
    if (props.input && !props.input.value && props.initValue) {
      props.input.onChange(props.initValue);
    }
  }
  updateInitValue(props) {
    if (props.input && !props.input.value && props.initValue) {
      props.input.onChange(props.initValue);
    }
  }
  shouldComponentUpdate(nextProps) {
    const compare = [
      "meta",
      "input",
      "data",
      "errors",
      "lang",
      "po",
      "label",
      "initValue",
      ...(nextProps.deps || []),
    ];
    // console.log(nextProps.values, nextProps.deps, )
    const newData = pick(nextProps, compare);
    const oldData = pick(this.props, compare);
    this.updateInitValue(nextProps);
    const check = !isEqual(newData, oldData);
    if (check) this.forceUpdate = !this.forceUpdate;
    return check;
  }

  render() {
    let { FieldComponent } = this;
    if (this.props.field) {
      FieldComponent = get(
        FieldsComponent,
        this.props.field,
        FieldsComponent.text
      );
    }
    // console.log(FieldComponent, this.props.field)
    let {
      label_fun,
      label,
      label_state,
      meta: { touched, error = {}, warning, asyncValidating },
      t,
      hideLabel,
      placeholder,
      className,
    } = this.props;
    if (!label && label_fun) {
      label = label_fun(this.props);
    }
    error = error.error || error;
    let validateStatus = null;
    const stringError = isString(error);
    const stringWarning = isString(warning);
    if (touched) {
      if (error && stringError) {
        validateStatus = "error";
      } else if (warning && stringWarning) {
        validateStatus = "warning";
      } else if (asyncValidating) {
        validateStatus = "validating";
      }
    }
    const labelLocal = label_state
      ? applyFilters({
          path: label_state,
        })
      : t(`labels:${label}`);
    return (
      <Form.Item
        className={className}
        label={!hideLabel && labelLocal}
        colon
        hasFeedback
        validateStatus={validateStatus}
        help={
          touched &&
          ((stringError && t(`messages:${error}`, { label: labelLocal })) ||
            (stringWarning && t(`messages:${warning}`)))
        }
      >
        <Suspense fallback={<></>}>
          <FieldComponent
            {...{
              ...this.props,
              forceUpdate: this.forceUpdate,
              label: t(`labels:${label}`),
              FormControl: FormControl,
              placeholder: placeholder && t(`labels:${placeholder}`),
            }}
          />
        </Suspense>
      </Form.Item>
    );
  }
}
export const mapStateToProps = ({ mainApp }) => ({
  lang: mainApp.language,
});

const renderInput = connect(mapStateToProps)(
  withTranslation("messages", "labels")(renderFields)
);

export class FormControl extends Component {
  render() {
    return <Field {...this.props} component={renderInput} />;
  }
}

export default renderInput;
