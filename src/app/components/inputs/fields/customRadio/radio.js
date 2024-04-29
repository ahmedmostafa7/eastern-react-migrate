import React, { Component } from "react";
import { Radio } from "antd";
import { withTranslation } from "react-i18next";
import { get, isEqual, omit, map, isFunction, lte, isBoolean } from "lodash";
import { Input } from "antd";
import { mapStateToProps } from "./mapping";
import mapDispatchToProps from "main_helpers/actions/main";
import { connect } from "react-redux";
import { convertListToString } from "../identify/Component/common/common_func";
const RadioGroup = Radio.Group;
const cellStyle = {
  padding: "0px 2.5px",
};
export class customRadioComp extends Component {
  constructor(props) {
    super(props);

    if (props?.mainObject?.bda2l?.bands_approval?.band_number) {
      const {
        mainObject: {
          bda2l: {
            bands_approval: {
              band_number: {
                selectedValues,
                owner_selectedValues,
                oldOptions,
                boundary_code,
                mun_class_id,
                plan_class_id,
                label,
              },
            },
          },
        },
      } = props;
      this.state = {
        selectedValues: selectedValues || [],
        owner_selectedValues:
          owner_selectedValues || selectedValues || undefined,
        oldOptions: oldOptions || [],
        boundary_code: boundary_code || 0,
        mun_class_id: mun_class_id || 0,
        plan_class_id: plan_class_id || 0,
        label: label || "",
      };
    } else {
      this.state = {
        selectedValues: [],
        owner_selectedValues: undefined,
        oldOptions: [],
        boundary_code: 0,
        mun_class_id: 0,
        plan_class_id: 0,
        label: "",
      };
    }
    this.isloaded = true;
  }

  handleChange(val, options, evt) {
    if (val) {
      val.checked =
        (evt && evt.target.checked) || (!val.checked && true) || false;
      const {
        input: { name, onChange, value },
        radios,
        checkboxes,
        change,
        isMotabkh,
        mainObject: { bda2l },
      } = this.props;
      let newVal = {};
      if (!isMotabkh) {
        //const [value, setValue] = React.useState(1);
        let arrSelectedValues = [];

        if (checkboxes) {
          arrSelectedValues = (value &&
            value?.selectedValues?.length &&
            ((!Array.isArray(value?.selectedValues) && [
              value?.selectedValues,
            ]) || [...value?.selectedValues])) || [val];
          if (evt?.target?.checked == true) {
            arrSelectedValues = [
              ...arrSelectedValues,
              JSON.parse(JSON.stringify(val)),
            ];
          } else if (evt?.target?.checked == false) {
            arrSelectedValues = arrSelectedValues.filter(
              (selectValue) => selectValue.key != val.key
            );
          }
        }

        newVal = {
          selectedValues:
            (checkboxes && arrSelectedValues) ||
            JSON.parse(
              JSON.stringify(radios && ((Array.isArray(val) && val[0]) || val))
            ),
          oldOptions: JSON.parse(JSON.stringify(options)),
          boundary_code: value.boundary_code || this.state.boundary_code || 0,
          mun_class_id: value.mun_class_id || this.state.mun_class_id || 0,
          plan_class_id: value.plan_class_id || this.state.plan_class_id || 0,
          label: value.label || this.state.label || "",
        };
      } else {
        newVal = {
          ...bda2l?.bands_approval?.band_number,
          owner_selectedValues: JSON.parse(JSON.stringify(val)),
        };
      }
      //setValue(newVal);
      onChange(newVal);
      this.setState(newVal);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      !isEqual(nextProps.input.value, this.props.input.value) ||
      !isEqual(nextProps.lang, this.props.lang) ||
      !isEqual(nextProps.forceUpdate, this.props.forceUpdate)
    );
    {
      return true;
    }

    return false;
  }

  componentDidUpdate(oldProps, newProps) {
    const { input, isMotabkh } = this.props;
    if (input.value && input.value != "" && input.value.justInvoked) {
      input.value.justInvoked = false;
      var value = get(input.value.options[0], "value");
      if (value) {
        this.handleChange(value[0], input.value.options);
      }
    } else if (this.isloaded) {
      this.isloaded = false;
      this.handleChange(
        (!isMotabkh && this.state.selectedValues) ||
          this.state.owner_selectedValues,
        this.state.oldOptions
      );
    }
  }

  openPopup = (scope, fieldValues) => {
    const {
      options,
      input: { value },
    } = scope.props;

    this.handleChange(fieldValues, value.oldOptions);
    var fields = this.props.popupFields;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...fieldValues },
          ok(values) {
            if (values) {
              const {
                options,
                input: { onChange, value },
              } = scope.props;
              map(value.oldOptions, (option) => {
                if (option.value[0].key == values.key) {
                  option.label = convertListToString(
                    values.values,
                    "condition.item_description"
                  );
                  let max;
                  values.values.forEach((value) => {
                    if (!value.item_code) {
                      max = values.values
                        .filter((val) => val.item_code)
                        .reduce(function (a, b) {
                          return Math.max(a, b.item_code);
                        }, 0);
                      value.item_code = ++max;
                      value.condition.item_code = value.item_code;
                      value.boundary_code = scope.state["boundary_code"];
                      value.mun_class_id = scope.state["mun_class_id"];
                      value.plan_class_id = scope.state["plan_class_id"];
                    }
                  });
                  option.value[0].values = values.values.sort((a, b) =>
                    a.item_code > b.item_code ? 1 : -1
                  );
                }
              });

              scope.handleChange(values, value.oldOptions);
              return Promise.resolve(true);
            }
          },
        },
      },
    });
  };

  render() {
    // console.log(this.props);
    const {
      input: { value },
      type,
      options,
      className,
      placeholder,
      labelText,
      t,
      defaultValue,
      anotherField,
      inputText,
      typeText,
      editButton,
      radios,
      checkboxes,
      isMotabkh,
    } = this.props;
    const {
      mainObject: { bda2l },
    } = this.props;
    const { oldOptions, label } = this.state;
    return (
      <div>
        <label>{label}</label>
        {!isMotabkh &&
          map(value.oldOptions, (option) => {
            return (
              <div className="form-group col-xs-12">
                <table className="">
                  <tr>
                    {(radios && (
                      <td style={cellStyle}>
                        <label>
                          <input
                            style={{ display: "inline", margin: "0px 10px" }}
                            type="radio"
                            value={option.value && option.value[0].key}
                            className="form-control"
                            onChange={this.handleChange.bind(
                              this,
                              option.value && option.value[0],
                              value.oldOptions
                            )}
                            checked={
                              isBoolean(option.value[0].checked)
                                ? option.value[0].checked
                                : value.selectedValues.key ==
                                    (option.value && option.value[0].key) &&
                                  value?.selectedValues?.values.length ==
                                    option.value[0].values.length
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      </td>
                    )) ||
                      (checkboxes && (
                        <td style={cellStyle}>
                          <label>
                            <input
                              style={{ display: "inline", margin: "0px 10px" }}
                              type="checkbox"
                              value={option.value && option.value[0].key}
                              className="form-control"
                              onChange={this.handleChange.bind(
                                this,
                                option.value && option.value[0],
                                value.oldOptions
                              )}
                              checked={
                                isBoolean(option.value[0].checked)
                                  ? option.value[0].checked
                                  : (value?.selectedValues &&
                                      (
                                        (!Array.isArray(
                                          value?.selectedValues
                                        ) && [value?.selectedValues]) || [
                                          ...value?.selectedValues,
                                        ]
                                      )?.find((selectedValue) => {
                                        return (
                                          selectedValue?.key ==
                                            option?.value?.[0]?.key &&
                                          value?.selectedValues?.values
                                            .length ==
                                            option.value[0].values.length
                                        );
                                      }) != undefined) ||
                                    false
                              }
                            />
                            <span>{option.label}</span>
                          </label>
                        </td>
                      ))}
                    {editButton && (
                      <td style={cellStyle}>
                        <button
                          onClick={() => {
                            this.openPopup(
                              this,
                              option.value && option.value[0]
                            );
                          }}
                          className="ant-btn ediT ant-btn-primary"
                        >
                          {t("tabs:Edit")}
                        </button>
                      </td>
                    )}
                  </tr>
                </table>
              </div>
            );
          })}
        {isMotabkh &&
          map(
            value.oldOptions.filter(
              (option) =>
                (!Array.isArray(
                  bda2l?.bands_approval?.band_number?.selectedValues
                ) &&
                  bda2l?.bands_approval?.band_number?.selectedValues.key ==
                    option.value[0].key) ||
                (Array.isArray(
                  bda2l?.bands_approval?.band_number?.selectedValues
                ) &&
                  bda2l?.bands_approval?.band_number?.selectedValues?.find(
                    (selectedValue) => selectedValue.key == option.value[0].key
                  ) != undefined)
            ),
            (option) => {
              return (
                <div className="form-group col-xs-12">
                  <table className="">
                    <tr>
                      <td style={cellStyle}>
                        <label>
                          <input
                            style={{ display: "inline", margin: "0px 10px" }}
                            type="radio"
                            value={option.value && option.value[0].key}
                            className="form-control"
                            onChange={this.handleChange.bind(
                              this,
                              option.value && option.value[0],
                              value.oldOptions
                            )}
                            checked={
                              isBoolean(option.value[0].checked)
                                ? option.value[0].checked
                                : value?.owner_selectedValues?.key ==
                                    (option.value && option.value[0].key) &&
                                  value?.owner_selectedValues?.modal ==
                                    (option.value && option.value[0].modal) &&
                                  value?.owner_selectedValues?.values.length ==
                                    option.value[0].values.length
                            }
                          />
                          <span>{option.label}</span>
                        </label>
                      </td>
                      {editButton && (
                        <td style={cellStyle}>
                          <button
                            onClick={() => {
                              this.openPopup(
                                this,
                                option.value && option.value[0]
                              );
                            }}
                            className="ant-btn ediT ant-btn-primary"
                          >
                            {t("tabs:Edit")}
                          </button>
                        </td>
                      )}
                    </tr>
                  </table>
                </div>
              );
            }
          )}
      </div>
    );
  }
}

//export default withTranslation("labels")(radioComp);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(customRadioComp));
