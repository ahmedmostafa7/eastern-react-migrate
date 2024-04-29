import React, { Component } from "react";
import { Field } from "redux-form";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import renderField from "app/components/inputs";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Form } from "antd";
import { get } from "lodash";
import { createReduxForm } from "app/helpers/functions";

class filtersComponent extends Component {
  handleChange(field, value, valueObj, props) {
    this.props.addFilter(field.name, {
      label: get(valueObj, props.label_key || "label"),
      value: value,
      show: field.label,
      clearField: () => this.props.change(field.name, ""),
      selectChange: field.selectChange,
    });
    field.selectChange && field.selectChange(value, valueObj, props);
  }

  componentWillReceiveProps(prevProps) {
    if (this.props.currentApp.name !== prevProps.currentApp.name) {
      this.props.reset();
    }
  }
  render() {
    const {
      t,
      currentApp: { filters, fields },
    } = this.props;
    return (
      <Form layout="inline" className="top2">
        {filters &&
          filters.map((filter) => {
            const { name, label, ...field } =
              fields.find((d) => d.name == filter) || {};
            return (
              <Field
                key={filter}
                component={renderField}
                name={filter}
                label={t(label)}
                {...{ ...field, ...this.props }}
                field={
                  field.filterComponent ? field.filterComponent : field.field
                }
                selectChange={this.handleChange.bind(this, {
                  name,
                  label,
                  ...field,
                })}
              />
            );
          })}
      </Form>
    );
  }
}

export const Filters = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withTranslation("admins")(
    createReduxForm(filtersComponent, {
      form: "FiltersForm",
    })
  )
);
