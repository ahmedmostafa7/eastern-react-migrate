import React, { Component } from "react";
import { Table, Tooltip, Button } from "antd";
const { Column, ColumnGroup } = Table;
// import mainInput from 'app/helpers/main/input';
import { withTranslation } from "react-i18next";
import {
  map,
  get,
  set,
  last,
  pick,
  isEmpty,
  uniq,
  isString,
  flattenDeep,
  groupBy,
  filter,
} from "lodash";
import { Field } from "redux-form";
import renderField from "app/components/inputs";
import { serverFieldMapper } from "app/helpers/functions";
import * as fieldValues from "app/helpers/fieldValues";
import { connect } from "react-redux";

class fixedTableComp extends Component {
  constructor(props) {
    super(props);
    const {
      fields,
      input: { onChange, value },
    } = props;
    this.data = [];
    this.state = { editingIndex: -1 };
    let _fields = {};
    this.currentFieldsKeys = [];
    map(fields, (value, key) => {
      _fields[key] = this.getFieldWithValidations(value, key);
      if (value.Fixed) {
        let newData = this.getData(value, props);
        newData.map(
          (v, i) =>
            (this.data = set(this.data, `[${i}]`, {
              ...get(this.data, `[${i}]`),
              [key]: v.value,
            }))
        );
      }
    });
    !get(value, "length") && onChange(this.data);
    this.columns = this.constructColumns(_fields);
  }

  getFieldWithValidations(field) {
    const subFields = get(field, "fields");
    if (subFields) {
      let returned = field;
      map(subFields, (value, key) => {
        set(returned, `fields.${key}`, this.getFieldWithValidations(value));
      });
      return returned;
    } else {
      return serverFieldMapper(field);
    }
  }

  //for filtering what to show and what not to show from the first two columns
  getData(field, props) {
    const { check = {} } = field;
    let newData = get(field, "data", []);

    if (!isEmpty(check)) {
      const checkVal = get(props, `${check.props}.${check.props}`, {});
      let newKeys = groupBy({ ...checkVal }, (v) => v[check.firstColumn]);

      if (check.key == check.firstColumn) {
        newData = map({ ...newKeys }, (single, k) => {
          let count = filter(single, { check: true }).length;

          if (count > 1) {
            let repeatedData = [];
            for (let i = count; i > 0; i--) {
              repeatedData.push({ value: k, rowSpan: i == count ? i : 0 });
            }

            return repeatedData;
          } else {
            return count == 0 ? null : { value: k };
          }
        }).filter((v) => v);
      } else if (check.key == check.secondColumn) {
        newData = map({ ...newKeys }, (single) => {
          const subjects = filter(single, { check: true });
          return !isEmpty(subjects)
            ? subjects.map((subject) => ({ value: subject.subject }))
            : [];
        });
      }
    }
    return flattenDeep(newData);
  }

  renderCell(value, row, index, field, fieldKey) {
    let { Fixed, data, sameRowSpan, field: fieldType } = field;
    const { t } = this.props;

    data = this.getData(field, this.props);
    const fieldValue = get(fieldValues, fieldType, null);

    const showValue = fieldValue ? (
      fieldValue(value, row, field, t)
    ) : value ? (
      value
    ) : (
      <label style={{ color: "gray" }}> {t("No Data")} </label>
    );
    if (Fixed) {
      return {
        children: showValue,
        props: { rowSpan: get(data, `[${index}].rowSpan`, 1) },
      };
    }
    if (sameRowSpan && index != this.state.editingIndex) {
      const { fields } = this.props;
      const rowSpan = get(fields, `${sameRowSpan}.data[${index}].rowSpan`, 1);
      return { children: showValue, props: { rowSpan } };
    }
    if (index == this.state.editingIndex) {
      const {
        input: { name },
      } = this.props;
      const _name = last(name.split("."));
      this.currentFieldsKeys = uniq([
        ...this.currentFieldsKeys,
        `${name}[${index}].${fieldKey}`,
      ]);
      return (
        <Field
          key={`${_name}[${index}].${fieldKey}`}
          name={`${_name}[${index}].${fieldKey}`}
          component={renderField}
          {...{ ...field, ...pick(this.props, ["touch", "untouch", "change"]) }}
        />
      );
    }
    return showValue;
  }

  getColumn(field, key) {
    const { t } = this.props;
    const subFields = get(field, "fields");
    if (subFields) {
      return (
        <ColumnGroup title={t(get(field, "label"))}>
          {map(subFields, (subField, subKey) =>
            this.getColumn(subField, `${key}.${subKey}`)
          )}
        </ColumnGroup>
      );
    } else {
      return (
        <Column
          title={t(get(field, "label"))}
          dataIndex={key}
          key={key}
          render={(value, row, index) =>
            this.renderCell.call(this, value, row, index, field, key)
          }
        />
      );
    }
  }

  saveData() {
    const {
      meta: { error },
      touch,
      untouch,
      input: { name },
    } = this.props;
    if (!isEmpty(error) && !isString(error)) {
      touch(...this.currentFieldsKeys);
    } else {
      untouch(...this.currentFieldsKeys, name.split(".")[0]);
      this.currentFieldsKeys = [];
      this.setState({ editingIndex: -1 });
    }
  }

  cancel() {
    this.props.input.onChange(this.state.oldData);
    this.setState({ editingIndex: -1 });
    this.props.untouch(...this.currentFieldsKeys);
    this.currentFieldsKeys = [];
  }
  constructColumns(fields) {
    const { t } = this.props;
    return [
      ...map(fields, (value, key) => {
        return this.getColumn(value, key);
      }),
      <Column
        title={t("Actions")}
        key={"action"}
        render={(value, row, index) =>
          this.state.editingIndex == -1 ? (
            <Tooltip placement="bottom" title={t("actions:Edit")}>
              <a
                onClick={() =>
                  this.setState({
                    editingIndex: index,
                    oldData: this.props.input.value,
                  })
                }
              >
                <span className="icon-color">
                  <i className={"fas fa-edit"}></i>
                </span>
              </a>
            </Tooltip>
          ) : this.state.editingIndex == index ? (
            <div>
              <Button className="save" onClick={this.saveData.bind(this)}>
                {t("actions:Save")}
              </Button>
              <Button className="cancel" onClick={this.cancel.bind(this)}>
                {t("actions:Cancel")}
              </Button>
            </div>
          ) : (
            <div></div>
          )
        }
      />,
    ];
  }

  render() {
    const {
      className,
      input: { value },
    } = this.props;
    return (
      <Table
        {...{ className }}
        className="fixed-table"
        dataSource={value}
        pagination={false}
        bordered
      >
        {this.columns}
      </Table>
    );
  }
}

export const mapStateToProps = ({ wizard: { mainObject } }) => ({
  finalApprovalCheck: get(mainObject, "finalApprovalCheck.finalApproval"),
});

export const fixedTable = connect(mapStateToProps)(
  withTranslation("labels")(fixedTableComp)
);
