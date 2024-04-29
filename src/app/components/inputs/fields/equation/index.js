import React from "react";
import { Row, Col } from "antd";
import { Button } from "antd";
import { compact } from "lodash";
import { mentionOptions, operationArray } from "./data";
import { Field } from "redux-form";
import renderField from "app/components/inputs";
import { get, split, includes, isEqual, first, last } from "lodash";
import { connect } from "react-redux";
import { mapStateToProps } from "./mapping";
import { withTranslation } from "react-i18next";
import mainInput from "app/helpers/main/input";
import { required } from "app/helpers/validations";
const req = required(true);
class equationComponent extends mainInput {
  constructor(props) {
    super(props);
    const {
      input: { onChange },
    } = props;
    onChange({ eq: [""], final_eq: "", isSpecial: false });
    this.state = {
      numberOfMention: 1,
    };
    this.blurFlag = false;
    this.operationsValues = operationArray
      .map((d) => d.value)
      .filter((d) => d != 1);
  }

  componentDidMount() {
    const {
      input: { value, onChange },
    } = this.props;
    onChange(this.toEquationObject(value));
  }

  toEquationObject(stringEquation = "") {
    if (first(stringEquation) == "(" && last(stringEquation) == ")") {
      return {
        final_eq: stringEquation,
        isSpecial: true,
        queryBuilder: stringEquation.replace("(", "").replace(/.$/, ""),
        eq: [""],
      };
    }
    stringEquation = (stringEquation || "").replace("(", "");
    stringEquation = (stringEquation || "").replace(/^\(|\)$/, "");
    if (/^(?=.*>)(?=.*&&)(?=.*<).*$/.test(stringEquation)) {
      const [left, , greaterThan, , , , lessThan] = split(
        stringEquation,
        /(\)&&\(|<|>)/
      ).map((d) => (d || "").replace(/\(|\)/g, ""));
      return {
        eq: [""],
        final_eq: stringEquation,
        leftParam: left,
        operation: "<>",
        greaterThan,
        lessThan,
      };
    }
    let [leftParam, operation = 1, rightParam] = split(
      stringEquation,
      /(!=|==|<>|>=|<=|<|>)/
    );
    let rightOperation = "";
    let eq = [""];
    if (includes(rightParam, "||")) {
      rightOperation = "||";
      eq = split(rightParam, "||");
    } else if (/(Max|Min)/.test(rightParam)) {
      const [, rightOp, equation] = split(rightParam, /(Max|Min)/);
      rightOperation = rightOp;
      eq = compact(split(equation, /[,()]/));
    } else {
      eq = [rightParam];
    }
    eq = eq.map((d) => (d || "").replace(/\(|\)/g, ""));
    return {
      final_eq: stringEquation,
      leftParam,
      operation,
      rightOperation,
      eq,
    };
  }
  build_eq() {
    const {
      input: { value, onChange },
    } = this.props;
    let final_eq = "";
    if (value.isSpecial) {
      final_eq = `(${(value.queryBuilder || "").replace(/@|#/g, "")})`;
    } else {
      if (value.leftParam) {
        final_eq += value.leftParam;
      }
      if (value.operation && value.operation !== 1) {
        final_eq += value.operation;
      }
      const eqs =
        value.eq &&
        [...value.eq.slice()].map((d = "") => d.replace(/@|#/g, ""));
      if (eqs.length > 1) {
        if (value.rightOperation) {
          if (value.rightOperation == "||") {
            final_eq += `(${eqs.map((d) => `(${d})`).join("||")})`;
          } else {
            final_eq += `(${value.rightOperation}((${eqs[0]}),(${eqs[1]})))`;
          }
        }
      } else if (value.operation !== "<>") {
        final_eq += `(${get(eqs, "[0]")})`;
      }
      if (value.operation === "<>") {
        final_eq = `((${value.leftParam}>${value.greaterThan})&&(${value.leftParam}<${value.lessThan}))`;
      }
    }
    if (value.final_eq != final_eq) {
      onChange({ ...value, final_eq });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      input: { value: newVal, name },
      meta: { touched: newTouch },
      touch,
      untouch,
    } = this.props;
    const {
      input: { value: oldVal },
      meta: { touched: oldTouch },
    } = prevProps;
    if (
      this.blurFlag &&
      newVal.final_eq == oldVal.final_eq &&
      oldVal.final_eq != undefined &&
      isEqual(newVal, oldVal)
    ) {
      this.build_eq();
      this.blurFlag = false;
    }
    if (!isEqual(newTouch, oldTouch)) {
      if (newTouch) {
        untouch(`${name}.leftParam`);
      } else {
        touch(`${name}.leftParam`);
      }
    }
  }

  addField() {
    const {
      input: { value, onChange },
    } = this.props;
    onChange({ ...value, eq: [...value.eq, ""] });
  }

  checkMention() {
    const {
      input: { value },
    } = this.props;
    return get(value, "eq.length", 0) > 1;
  }

  setBlurred() {
    this.blurFlag = true;
  }
  render() {
    const {
      input: { name, value },
      t,
      mentions,
    } = this.props;
    const suggestions = { "@": mentions, "#": this.operationsValues };
    return (
      <div>
        <Row
          style={{
            display: "grid",
            gridTemplateColumns: "0 1fr 1fr 1fr 1fr",
            gridGap: "10px",
          }}
        >
          <Col>
            <Field
              component={renderField}
              field="select"
              moduleName="variable"
              valueKey="name"
              name={`${name}.leftParam`}
              placeholder={t("Left equation")}
              onBlur={this.setBlurred.bind(this)}
              validate={[req]}
            />
          </Col>
          <Col>
            <Field
              component={renderField}
              field="boolean"
              name={`${name}.isSpecial`}
              hideLabel={true}
              label={t("Special equation")}
            />
          </Col>
          {value.isSpecial ||
          value.rightOperation === "Min" ||
          value.rightOperation === "Max" ? (
            value.isSpecial ? (
              <Col>
                <Field
                  component={renderField}
                  field={"mentions"}
                  {...{ suggestions }}
                  placeholder={t("Query Builder")}
                  name={`${name}.queryBuilder`}
                  onBlur={this.setBlurred.bind(this)}
                />
              </Col>
            ) : (
              <Col>
                <Field
                  component={renderField}
                  field="select"
                  data={operationArray.map((d) => ({
                    ...d,
                    label: t(d.label),
                  }))}
                  name={`${name}.operation`}
                  placeholder={t("Operation")}
                  onChange={this.setBlurred.bind(this)}
                />
                <Field
                  component={renderField}
                  field={"mentions"}
                  {...{ suggestions }}
                  placeholder={t("Equation")}
                  name={`${name}.eq[0]`}
                  onBlur={this.setBlurred.bind(this)}
                />
                <Field
                  component={renderField}
                  field={"mentions"}
                  {...{ suggestions }}
                  placeholder={t("Equation")}
                  name={`${name}.eq[1]`}
                  onBlur={this.setBlurred.bind(this)}
                />
                <Field
                  component={renderField}
                  field="select"
                  data={mentionOptions}
                  name={`${name}.rightOperation`}
                  placeholder={t("Right operation")}
                  onChange={this.setBlurred.bind(this)}
                />
              </Col>
            )
          ) : (
            <div>
              <Col>
                <Field
                  component={renderField}
                  field="select"
                  data={operationArray.map((d) => ({
                    ...d,
                    label: t(d.label),
                  }))}
                  name={`${name}.operation`}
                  placeholder={t("Operation")}
                  onChange={this.setBlurred.bind(this)}
                />
              </Col>
              {value.operation !== 1 && value.operation != "<>" && (
                <div>
                  <Col>
                    <div>
                      {(value.eq || []).map((d, k) => (
                        <div key={k} style={{ gridColumn: "1/5" }}>
                          <Field
                            component={renderField}
                            field={"mentions"}
                            {...{ suggestions }}
                            placeholder={t("Equation")}
                            name={`${name}.eq[${k}]`}
                            onBlur={this.setBlurred.bind(this)}
                          />
                        </div>
                      ))}
                    </div>
                    {this.checkMention() && (
                      <div>
                        <Field
                          component={renderField}
                          field="select"
                          data={mentionOptions}
                          name={`${name}.rightOperation`}
                          placeholder={t("Right operation")}
                          onChange={this.setBlurred.bind(this)}
                        />
                      </div>
                    )}
                  </Col>
                  <Col>
                    <div>
                      <Button
                        icon="plus-circle"
                        shape="circle"
                        onClick={this.addField.bind(this)}
                      />
                      {/* <Button icon="minus-circle" shape="circle" onClick={this.removeField.bind(this)} /> */}
                    </div>
                  </Col>
                </div>
              )}
              {value.operation == "<>" && (
                <Col>
                  <Field
                    component={renderField}
                    field={"mentions"}
                    {...{ suggestions }}
                    placeholder={t("Greater than")}
                    name={`${name}.greaterThan`}
                    onBlur={this.setBlurred.bind(this)}
                  />
                  <Field
                    component={renderField}
                    field={"mentions"}
                    {...{ suggestions }}
                    placeholder={t("Less than")}
                    name={`${name}.lessThan`}
                    onBlur={this.setBlurred.bind(this)}
                  />
                </Col>
              )}
            </div>
          )}
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps)(
  withTranslation("labels")(equationComponent)
);
