import React, { Component } from "react";
import { Form } from "antd";
import { withTranslation } from "react-i18next";
import { isEmpty, pick, get, map } from "lodash";
import { Field, FormSection } from "redux-form";
import renderField from "app/components/inputs";

class multiTableComponent extends Component {
  getTables() {
    const {
      values,
      name,
      fields,
      moduleName,
      tablesField: { split, config, label },
      t,
      input: { value = [], ...input },
    } = this.props;

    if (!isEmpty(split)) {
      return split.map((val, k) => (
        <FormSection name={moduleName} key={k}>
          <label>
            {" "}
            {t(label)} : {val.label}{" "}
          </label>
          <Field
            name={`${val.moduleName}`}
            className="wizard-input"
            component={renderField}
            field="tableList"
            className="modal-table"
            key={val.label}
            fields={fields}
            hideLabel={true}
            hideLabels={true}
            moduleName={val.moduleName}
            inline={true}
            footer={true}
            {...config}
            {...{ values }}
            {...pick(this.props, ["touch", "untouch", "change"])}
          />
        </FormSection>
      ));
    }
  }

  render() {
    const {
      t,
      input: { value = {}, ...input },
      change,
    } = this.props;

    let calculatedSum = 0;
    if (!isEmpty(get(value, "Sum", {}))) {
      map(
        get(value, "Sum", {}),
        (val) => (calculatedSum = parseFloat(calculatedSum) + parseFloat(val))
      );
    }

    return (
      <Form.Item>
        {this.getTables()}
        <label> {`${t("Total")} : ${calculatedSum}`} </label>
      </Form.Item>
    );
  }
}

export default withTranslation("labels")(multiTableComponent);
