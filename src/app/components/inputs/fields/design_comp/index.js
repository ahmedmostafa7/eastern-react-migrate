import React, { Component } from "react";
import Field from "app/helpers/components/input/field";
import { FormSection } from "redux-form";
import { map, pick, last } from "lodash";
export default class DesignComp extends Component {
  render() {
    const { className, style } = this.props;
    const { fields, input } = this.props;
    const picking = ["change", "touch", "untouch", "values", "index"];
    const mainProps = pick(this.props, picking);
    const name = last(input.name.split("."));
    return (
      <div className={className} style={style}>
        <FormSection name={`${name}`}>
          {map(fields, (f, k) => (
            <Field
              key={k}
              {...mainProps}
              mainProps={mainProps}
              mainValues={input.value}
              field={f}
            />
          ))}
        </FormSection>
      </div>
    );
  }
}
