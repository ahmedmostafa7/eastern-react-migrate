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
import { generateUUID } from "../../identify/Component/common/common_func";
import "./style.css";
class krokiParcelsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.parcel_fields_headers = ["رقم الأرض", "المساحة (م2)", "رمز الأستخدام"];
    this.parcel_fields = [
      { name: "PARCEL_PLAN_NO", editable: false },
      { name: "PARCEL_AREA", editable: true },
      { name: "USING_SYMBOL", editable: false },
    ];
    this.parcelDataFields = {
      north_length: {
        label: "طول الحد الشمالي (م)",
        placeholder: "من فضلك ادخل طول الحد الشمالي (م)",
        type: "number",
        name: "north_length",
        required: true,
      },
      north_desc: {
        label: "وصف الحد الشمالي",
        placeholder: "من فضلك ادخل وصف الحد الشمالي",
        type: "text",
        name: "north_desc",
        maxLength: 200,
        required: true,
      },
      south_length: {
        label: "طول الحد الجنوبي (م)",
        placeholder: "من فضلك ادخل طول الحد الجنوبي (م)",
        type: "number",
        name: "south_length",
        required: true,
      },
      south_desc: {
        label: "وصف الحد الجنوبي",
        placeholder: "من فضلك ادخل وصف الحد الجنوبي",
        type: "text",
        name: "south_desc",
        maxLength: 200,
        required: true,
      },
      east_length: {
        label: "طول الحد الشرقي (م)",
        placeholder: "من فضلك ادخل طول الحد الشرقي (م)",
        type: "number",
        name: "east_length",
        required: true,
      },
      east_desc: {
        label: "وصف الحد الشرقي",
        placeholder: "من فضلك ادخل وصف الحد الشرقي",
        type: "text",
        name: "east_desc",
        maxLength: 200,
        required: true,
      },
      west_length: {
        label: "طول الحد الغربي (م)",
        placeholder: "من فضلك ادخل طول الحد الغربي (م)",
        type: "number",
        name: "west_length",
        required: true,
      },
      west_desc: {
        label: "وصف الحد الغربي",
        placeholder: "من فضلك ادخل وصف الحد الغربي",
        type: "text",
        name: "west_desc",
        maxLength: 200,
        required: true,
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps.selectedLands, this.props.selectedLands);
  }

  openPopup = (scope) => {
    const { selectedLands, UpdateSubmissionDataObject } = scope.props;

    var fields = this.parcelDataFields;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...scope.props.parcelData },
          ok(values) {
            scope.props.parcelData = values;
            UpdateSubmissionDataObject();
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  myChangeHandler = (name, i, e, event) => {
    this["edit_" + name + i] = event.target.value;
    e.attributes[name] = event.target.value;
    e.attributes["PARCEL_AREA"] = event.target.value;
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  showEditBtn = (name, value) => {
    if (name == "USING_SYMBOL") {
      return value == null;
    } else {
      return ["NEW_PARCEL_AREA"].indexOf(name) > -1;
    }
  };

  enableEdit = (name, i) => {
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  render() {
    // const {
    //     selectedLands
    // } = this.state;

    const { selectedLands, saveEdits, remove } = this.props;

    return (
      <div style={{ gridColumn: "1/3" }}>
        {selectedLands && selectedLands.length > 0 && (
          <div>
            <h1 className="titleSelectedParcel">الأراضي المختارة</h1>

            <table className="table table-bordered" style={{ marginTop: "1%" }}>
              <thead>
                <tr>
                  {this.parcel_fields_headers.map((field_header, k) => {
                    return <th>{field_header}</th>;
                  })}
                  <th> خيارات</th>
                </tr>
              </thead>
              <tbody>
                {selectedLands.map((e, i) => {
                  return (
                    <tr key={i}>
                      {this.parcel_fields.map((field, k) => {
                        return (
                          <td key={k}>
                            <div>
                              {field.editable ? (
                                !this.state[field.name + "_isEdit_" + i] ? (
                                  <span>
                                    <span>
                                      {e.attributes[field.name] || ""}
                                    </span>
                                    {this.showEditBtn(
                                      field.name,
                                      e.attributes[field.name]
                                    ) && (
                                      <span>
                                        <button
                                          className="btn"
                                          style={{
                                            marginRight: e.attributes[
                                              field.name
                                            ]
                                              ? "20px"
                                              : "0px",
                                          }}
                                          onClick={this.enableEdit.bind(
                                            this,
                                            field.name,
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
                                      type="number"
                                      step="any"
                                      value={e.attributes[field.name]}
                                      onChange={this.myChangeHandler.bind(
                                        this,
                                        field.name,
                                        i,
                                        e
                                      )}
                                    />
                                    <button
                                      className="btn"
                                      style={{
                                        marginRight: "20px",
                                      }}
                                      onClick={saveEdits(
                                        e.attributes.PARCEL_SPATIAL_ID,
                                        field.name,
                                        i
                                      )}
                                    >
                                      <i className="fa fa-floppy-o"></i>
                                    </button>
                                  </span>
                                )
                              ) : (
                                <span>
                                  <span>{e.attributes[field.name] || ""}</span>
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}

                      {i === selectedLands.length - 1 ? (
                        <td>
                          <button
                            className="btn follow"
                            style={{ margin: "0px 5px" }}
                            onClick={() => {
                              this.openPopup(this);
                            }}
                          >
                            حدود و أبعاد الأرض حسب وثيقة الملكية
                          </button>
                          <button
                            className=" btn btn-danger "
                            onClick={remove.bind(this, e)}
                          >
                            حذف
                          </button>
                        </td>
                      ) : (
                        ""
                      )}
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
)(krokiParcelsComponent);
