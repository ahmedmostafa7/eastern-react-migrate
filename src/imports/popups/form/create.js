import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import mapDispatchToProps from "main_helpers/actions/main";
import { Form } from "antd";
import { FormControl } from "app/components/inputs";
import { map, filter, pick } from "lodash";
import Actions from "./actions";
import {
  serverFieldMapper,
  apply_field_permission,
} from "app/helpers/functions";
import memoize from "memoize-one";
import { getFormValues } from "redux-form";
import { createReduxForm } from "app/helpers/functions";

export class create extends Component {
  constructor(props) {
    super(props);
    this.fields = filter(
      map(props.fields, (value, key) => ({
        name: key,
        ...serverFieldMapper(value),
      })),
      props.filter
    );
  }
  filteringFields = memoize((values) => {
    return this.fields.filter((field) =>
      apply_field_permission(values, field, this.props)
    );
  });
  submit = (values) => {
    const { ok, onCancel } = this.props;
    ok(values, this.props).then((data) => {
      onCancel();
    });
  };
  render() {
    //
    const { handleSubmit, initialValues } = this.props;
    // console.log(this.prosp)

    return (
      <Form onSubmit={handleSubmit(this.submit)}>
        {map(this.filteringFields(this.props.values), (d) => (
          <FormControl
            {...d}
            {...pick(this.props, ["values", "change", "touch", "untouch"])}
          />
        ))}
        <Actions {...this.props} />
      </Form>
    );
  }
}
export default createReduxForm(
  connect(
    (state) => ({
      values: getFormValues("Create")(state),
    }),
    mapDispatchToProps
  )(create),
  { form: "Create" },
  "fields",
  "currentModule"
);
