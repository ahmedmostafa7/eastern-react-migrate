import React, { Component } from "react";
import { Field, getFormValues, getFormMeta } from "redux-form";
import renderField from "app/components/inputs";
import {
  serverFieldMapper,
  apply_field_permission,
} from "app/helpers/functions";
import { map, pick, get } from "lodash";
import memoize from "memoize-one";
import { connect } from "react-redux";

class inputsComp extends Component {
  constructor(props) {
    super(props);
    const { fields, values, init_data } = this.props;
    if (init_data) {
      init_data(values, this.props, fields);
    }
    this.fields = map(fields, (value, key) => ({
      name: key,
      ...serverFieldMapper(value),
    }));
  }

  filteringFields = memoize((values) => {
    return this.fields.filter((field) =>
      apply_field_permission(values, field, this.props)
    );
  });

  render() {
    const { values } = this.props;
    return this.filteringFields(this.props.values).map((field) => (
      <Field
        className="wizard-input"
        component={renderField}
        key={field.name}
        {...{
          ...field,
          values,
          ...pick(this.props, ["touch", "untouch", "change"]),
        }}
      />
    ));
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...get(state.wizard, "mainObject"),
    mainObject: get(state.wizard, "mainObject"),
    currentModule: get(state.wizard, "currentModule"),
    values: get(ownProps, "values", get(state.form, "stepForm.values", {})),
  };
};
const mapDispatchToProps = (dispatch) => ({
  setSelector: (moduleName, data) => {
    dispatch({
      type: "setSelectors",
      path: `${moduleName}`,
      data,
    });
  },

  setMainObject: (data) => {
    dispatch({
      type: "setWizard",
      path: "mainObject",
      data,
    });
  },
});
export const inputs = connect(mapStateToProps, mapDispatchToProps)(inputsComp);
