import React, { Component, useState } from "react";
import { mapStateToProps } from "./mapping";
import mapDispatchToProps from "main_helpers/actions/main";
import { connect } from "react-redux";
import { Select, Button, Form, message } from "antd";
import "antd/dist/reset.css";
import applyFilters from "main_helpers/functions/filters";
import store from "app/reducers";
import {
  slice,
  map,
  get,
  pickBy,
  mapKeys,
  replace,
  assign,
  pick,
  includes,
  orderBy,
  isEqual,
} from "lodash";
import {
  generateUUID,
  localizeNumber,
} from "../../identify/Component/common/common_func";
import "./style.css";
class SelectedParcelsViewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  saveEdit = (e, name, i, isEditing) => {
    e.attributes[name] = this["edit_" + name + i];
    this.setState({
      [name + "_isEdit_" + i]: isEditing,
    });
  };

  myChangeHandler = (e, name, i, event) => {
    this["edit_" + name + i] = event.target.value;
    e.attributes[name] = event.target.value;
    this.setState({
      [name + "_isEdit_" + i]: true,
    });
  };

  showEditBtn = (name, value) => {
    const {
      input: {
        value: { fields_enable_editing },
      },
    } = this.props;
    return [...(fields_enable_editing || [])].indexOf(name) > -1;
  };

  enableEdit = (name, i) => {
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  openPopup = (scope, parcel) => {
    this.units = [
      { value: "متر", label: "متر" },
      { value: "قدم", label: "قدم" },
      { value: "مغرس", label: "مغرس" },
    ];
    let extInitialValue = "متر";
    let callBackSelect = (scope, controlName, val) => {
      let {
        input: { onChange, value },
      } = scope.props;
      // if (typeof value == 'string') {
      //   value = { inputValue: value };
      // }
      delete value[controlName];
      let controlValue = { [controlName]: val, ...value };
      scope.state[controlName] = val;
      onChange(controlValue);
      scope.setState(controlValue);
    };

    var editBoundriesMsg =
      "لتعديل أبعاد الحدود يرجي تعديل الأبعاد على ملف الرفع المساحي";
    var fields = {
      parcel_type: {
        label: "عبارة عن",
        placeholder: "من فضلك اخل نوع الأرض",
        type: "input",
        field: "select",
        name: "parcel_type",
        data: [
          { label: "أرض فضاء", value: "أرض فضاء" },
          { label: "مبنى سكني", value: "مبنى سكني" },
          { label: "ورشة", value: "ورشة" },
          { label: "أخرى", value: "أخرى" },
        ],
        required: true,
        disabled: true,
      },
      north_length: {
        label: "طول الحد الشمالي (م)",
        placeholder: "من فضلك ادخل طول الحد الشمالي (م)",
        field: "inputNumber",
        type: "input",
        name: "north_length",
        hasAU: true,
        value_key: "value",
        label_key: "value",
        data: [...this.units],
        onClick: callBackSelect,
        required: true,
        extInitialValue,
        disabled: true, // !this?.props?.input?.value?.modify_length_boundries,
        extDisabled: !this?.props?.input?.value?.update_lengths_units,
        title: editBoundriesMsg,
      },
      north_desc: {
        label: "وصف الحد الشمالي",
        placeholder: "من فضلك ادخل وصف الحد الشمالي",
        type: "text",
        name: "north_desc",
        maxLength: 200,
        required: true,
        disabled: true, // !this?.props?.input?.value?.modify_length_boundries,
        title: editBoundriesMsg,
      },
      south_length: {
        label: "طول الحد الجنوبي (م)",
        placeholder: "من فضلك ادخل طول الحد الجنوبي (م)",
        field: "inputNumber",
        type: "input",
        name: "south_length",
        required: true,
        hasAU: true,
        value_key: "value",
        label_key: "value",
        data: [...this.units],
        onClick: callBackSelect,
        extInitialValue,
        disabled: true, // !this?.props?.input?.value?.modify_length_boundries,
        extDisabled: !this?.props?.input?.value?.update_lengths_units,
        title: editBoundriesMsg,
      },
      south_desc: {
        label: "وصف الحد الجنوبي",
        placeholder: "من فضلك ادخل وصف الحد الجنوبي",
        type: "text",
        name: "south_desc",
        maxLength: 200,
        required: true,
        disabled: true, // !this?.props?.input?.value?.modify_length_boundries,
        title: editBoundriesMsg,
      },
      east_length: {
        label: "طول الحد الشرقي (م)",
        placeholder: "من فضلك ادخل طول الحد الشرقي (م)",
        field: "inputNumber",
        type: "input",
        name: "east_length",
        required: true,
        hasAU: true,
        value_key: "value",
        label_key: "value",
        data: [...this.units],
        onClick: callBackSelect,
        extInitialValue,
        disabled: true, // !this?.props?.input?.value?.modify_length_boundries,
        extDisabled: !this?.props?.input?.value?.update_lengths_units,
        title: editBoundriesMsg,
      },
      east_desc: {
        label: "وصف الحد الشرقي",
        placeholder: "من فضلك ادخل وصف الحد الشرقي",
        type: "text",
        name: "east_desc",
        maxLength: 200,
        required: true,
        disabled: true, // !this?.props?.input?.value?.modify_length_boundries,
        title: editBoundriesMsg,
      },
      west_length: {
        label: "طول الحد الغربي (م)",
        placeholder: "من فضلك ادخل طول الحد الغربي (م)",
        field: "inputNumber",
        type: "input",
        name: "west_length",
        required: true,
        hasAU: true,
        value_key: "value",
        label_key: "value",
        data: [...this.units],
        onClick: callBackSelect,
        extInitialValue,
        disabled: true, // !this?.props?.input?.value?.modify_length_boundries,
        extDisabled: !this?.props?.input?.value?.update_lengths_units,
        title: editBoundriesMsg,
      },
      west_desc: {
        label: "وصف الحد الغربي",
        placeholder: "من فضلك ادخل وصف الحد الغربي",
        type: "text",
        name: "west_desc",
        maxLength: 200,
        required: true,
        disabled: true, // !this?.props?.input?.value?.modify_length_boundries,
        title: editBoundriesMsg,
      },
    };
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        title: "حدود وابعاد الارض وفق لبيانات الرفع المساحي",
        childProps: {
          fields: { ...fields },
          initialValues: { ...parcel.parcelData },
          ok(values) {
            parcel.parcelData = values;
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  // componentDidUpdate() {
  //
  // }

  render() {
    const {
      parcel_fields,
      parcel_fields_headers,
      input: {
        value: { data },
      },
    } = this.props;
    return (
      <div class="col-xs-12">
        {data && data.length > 0 && (
          <div>
            <h1 className="titleSelectedParcel">الأراضي المختارة</h1>

            <table className="table table-bordered" style={{ marginTop: "1%" }}>
              <thead>
                <tr>
                  {parcel_fields_headers.map((field, k) => {
                    return <th>{field}</th>;
                  })}
                  <th> خيارات</th>
                </tr>
              </thead>
              <tbody>
                {data.map((e, i) => {
                  return (
                    <tr key={i}>
                      {parcel_fields.map((field, k) => {
                        return (
                          <td key={k}>
                            <div>
                              {!this.state[field + "_isEdit_" + i] ? (
                                <span>
                                  <span>
                                    {localizeNumber(e.attributes[field] || "")}
                                  </span>
                                  {this.showEditBtn(
                                    field,
                                    e.attributes[field]
                                  ) && (
                                    <span>
                                      <button
                                        className="btn"
                                        style={{
                                          marginRight: e.attributes[field]
                                            ? "20px"
                                            : "0px",
                                        }}
                                        onClick={this.enableEdit.bind(
                                          this,
                                          field,
                                          i
                                        )}
                                      >
                                        <i className="fas fa-edit"></i>
                                      </button>
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr auto",
                                  }}
                                >
                                  <input
                                    key={i}
                                    className="form-control"
                                    type="text"
                                    step="any"
                                    value={e.attributes[field]}
                                    onChange={this.myChangeHandler.bind(
                                      this,
                                      e,
                                      field,
                                      i
                                    )}
                                  />
                                  <button
                                    className="btn"
                                    style={{ marginRight: "20px" }}
                                    onClick={this.saveEdit.bind(
                                      this,
                                      e,
                                      field,
                                      i,
                                      false
                                    )}
                                  >
                                    <i className="fa fa-floppy-o"></i>
                                  </button>
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      <td>
                        <button
                          className="btn follow"
                          style={{ margin: "0px 5px" }}
                          onClick={() => {
                            this.openPopup(this, e);
                          }}
                        >
                          حدود و أبعاد الأرض
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectedParcelsViewComponent);
