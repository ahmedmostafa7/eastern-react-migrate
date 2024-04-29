import React, { Component, useState } from "react";
//import { mapStateToProps } from "./mapping";
import { mapDispatchToProps, mapStateToProps } from "./mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
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
export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "lands"),
    ...mapDispatchToProps1(dispatch),
  };
};
class planParcelsComponent extends Component {
  constructor(props) {
    super(props);

    this.parcelDataFields = {
      north_length: {
        label: "طول الحد الشمالي (م)",
        placeholder: "من فضلك ادخل طول الحد الشمالي (م)",
        field: "inputNumber",
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
        field: "inputNumber",
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
        field: "inputNumber",
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
        field: "inputNumber",
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

    if (
      props.mainObject &&
      props.mainObject.landData &&
      props.mainObject.landData.landData &&
      props.mainObject.landData.landData.lands
    ) {
      const {
        mainObject: {
          landData: {
            landData: { lands },
          },
        },
      } = props;

      lands.parcels.forEach((parcel) => {
        if (
          parcel.attributes.PARCEL_AREA &&
          !parcel.attributes.NEW_PARCEL_AREA
        ) {
          parcel.attributes.NEW_PARCEL_AREA = parcel.attributes.PARCEL_AREA;
        }
      });

      this.selectedParcels = JSON.parse(JSON.stringify(lands.parcels || []));

      this.state = {
        selectedParcels: JSON.parse(JSON.stringify(lands.parcels || [])),
        parcelData: JSON.parse(JSON.stringify(lands.parcelData || {})),
      };
    } else {
      this.selectedParcels = [];
      this.state = {
        selectedParcels: [],
        parcelData: {},
      };
    }
  }

  saveEdit = (PARCEL_SPATIAL_ID, name, i, isEditing) => {
    let { input, onResetParcelDesc, values, setSelector, change } = this.props;

    change("landData.parcel_desc", this["edit_" + name + i]);
    // setSelector("parcelDesc", {
    //   value: this["edit_" + name + i]
    // })
    this.selectedParcels[i].attributes[name] = this["edit_" + name + i];
    this.props.input.onChange({
      parcels: [...this.selectedParcels],
      parcelData: { ...this.state.parcelData },
    });
    this.setState({
      [name + "_isEdit_" + i]: isEditing,
      selectedParcels: [...this.selectedParcels],
      parcelData: this.state.parcelData,
    });
  };

  myChangeHandler = (name, i, e, event) => {
    this["edit_" + name + i] = event.target.value;
    this.selectedParcels[i].attributes[name] = this["edit_" + name + i];
    this.setState({
      [name + "_isEdit_" + i]: true,
      selectedParcels: [...this.selectedParcels],
      parcelData: this.state.parcelData,
    });
  };

  showEditBtn = (name, value) => {
    if (name == "USING_SYMBOL") {
      return value == null;
    } else {
      return ["PARCEL_PLAN_NO", "NEW_PARCEL_AREA"].indexOf(name) > -1;
    }
  };

  enableEdit = (name, i) => {
    this["edit_" + name + i] = this.selectedParcels[i].attributes[name];
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  remove = (item) => {
    this.selectedParcels.pop(item);
    if (this.selectedParcels.length == 0) {
      this.state.parcelData = {};
      //this.props.action(this.props.values, this.props, this.state);
    }
    this.state.selectedParcels = [...this.selectedParcels];
    this.props.input.onChange({
      parcels: [...this.state.selectedParcels],
      parcelData: { ...this.state.parcelData },
    });
    this.setState({
      selectedParcels: [...this.selectedParcels],
      parcelData: this.state.parcelData,
    });
  };

  addParcel = (item) => {
    const { input, onResetParcelDesc, values } = this.props;
    var parcel_desc = get(values, "parcel_desc", "");
    if (
      !_.find(this.selectedParcels, function (d) {
        return d.PARCEL_PLAN_NO == parcel_desc;
      }) &&
      parcel_desc
    ) {
      this.selectedParcels.push({
        attributes: {
          PARCEL_PLAN_NO: parcel_desc,
          NEW_PARCEL_AREA: "",
          PARCEL_SPATIAL_ID: generateUUID(),
          MUNICIPALITY_NAME_Code: get(values, "municipality_id", ""),
          PARCEL_AREA: "",
        },
      });
      this.props.input.onChange({
        parcels: JSON.parse(JSON.stringify([...this.selectedParcels])),
        parcelData: JSON.parse(JSON.stringify({ ...this.state.parcelData })),
      });
      this.setState({
        selectedParcels: [...this.selectedParcels],
        parcelData: this.state.parcelData,
      });
    }
  };

  openPopup = (scope) => {
    var fields = this.parcelDataFields;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...scope.state.parcelData },
          ok(values) {
            scope.props.input.onChange({
              parcels: [...scope.state.selectedParcels],
              parcelData: { ...values },
            });
            scope.setState({
              selectedParcels: [...scope.selectedParcels],
              parcelData: { ...values },
            });
            return Promise.resolve(true);
          },
        },
      },
    });
  };

  render() {
    const { selectedParcels } = this.state;

    const { parcel_fields, parcel_fields_headers, values, multiple } =
      this.props;

    var uploadedImage = get(values, "image_uploader", "");

    return (
      <div style={{ gridColumn: "1/3" }}>
        <Button
          className="add-gis"
          disabled={
            !multiple ? !uploadedImage || selectedParcels.length > 0 : false
          }
          onClick={this.addParcel.bind(this)}
        >
          إضافة الأرض
        </Button>
        {selectedParcels && selectedParcels.length > 0 && (
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
                {selectedParcels.map((e, i) => {
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
                                    type={
                                      field != "PARCEL_PLAN_NO"
                                        ? "number"
                                        : "text"
                                    }
                                    step="any"
                                    maxLength={200}
                                    value={e.attributes[field]}
                                    onChange={this.myChangeHandler.bind(
                                      this,
                                      field,
                                      i,
                                      e
                                    )}
                                  />
                                  <button
                                    className="btn"
                                    style={{ marginRight: "20px" }}
                                    onClick={this.saveEdit.bind(
                                      this,
                                      e.attributes.PARCEL_SPATIAL_ID,
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

                      {i === selectedParcels.length - 1 ? (
                        <td>
                          {this.props.currentModule.id != 108 && (
                            <button
                              className="btn follow"
                              style={{ margin: "0px 5px" }}
                              onClick={() => {
                                this.openPopup(this);
                              }}
                            >
                              حدود و أبعاد الأرض حسب وثيقة الملكية
                            </button>
                          )}
                          <button
                            className=" btn btn-danger "
                            onClick={this.remove.bind(this, e)}
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
  appMapDispatchToProps
)(planParcelsComponent);
