import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import renderField from "app/components/inputs";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Form } from "antd";
import { get } from "lodash";
import style from "./style.less";

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
    if (this.props.currentTab.name !== prevProps.currentTab.name) {
      this.props.reset();
    }
  }
  render() {
    const {
      t,
      content: { filters, fields },
    } = this.props;

    return (
      <Form
        layout="inline"
        className={style.search}
        style={{ marginRight: "20px", marginLeft: "20px" }}
      >
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
                {...{ ...field }}
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
    reduxForm({
      form: "FiltersForm",
    })(filtersComponent)
  )
);
