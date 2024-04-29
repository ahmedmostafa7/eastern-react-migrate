import React, { Component, useState } from "react";
import { mapStateToProps } from "./mapping";
import mapDispatchToProps from "main_helpers/actions/main";
import { postItem, fetchData } from "app/helpers/apiMethods";
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
  convertToArabic,
  convertToEnglish,
} from "../../identify/Component/common/common_func";
import "./style.css";
class farzParcelsComponent extends Component {
  constructor(props) {
    super(props);
    const { input } = props;
    this.parcel_fields_headers = [
      { name: "PARCEL_PLAN_NO", label: "رقم الأرض", hidden: false },
      { name: "NEW_PARCEL_AREA", label: "المساحة (م۲)", hidden: false },
      {
        name: "USING_SYMBOL_SELECT",
        label: "رمز الإستخدام ( الرجاء التأكد من المخطط الارشادي والتنظيمي )",
        hidden: false,
      },
      // { name: "USING_SYMBOL_TEXT", label: "وصف الأستخدام", hidden: true },
    ];
    this.parcel_fields = [
      {
        name: "PARCEL_PLAN_NO",
        editable: false,
        hidden: false,
        toBeShown: undefined,
      },
      {
        name: "NEW_PARCEL_AREA",
        editable: true,
        type: "number",
        hidden: false,
        toBeShown: undefined,
      },
      {
        name: "USING_SYMBOL_SELECT",
        editable: true,
        type: "select",
        options: [],
        hidden: false,
        toBeShown: "USING_SYMBOL_TEXT",
      },
      // {
      //   name: "USING_SYMBOL_TEXT",
      //   editable: true,
      //   type: "text",
      //   hidden: !(
      //     input.value && input.value.parcels[0].attributes.USING_SYMBOL_TEXT
      //   )
      //     ? true
      //     : false,
      //   toBeShown: undefined,
      // },
    ];
    this.parcelDataFields = {};

    this.parcels = (input && input.value && input.value.parcels) || [];
    this.state = {
      parcels: (input && input.value && input.value.parcels) || [],
      parcelData: (input && input.value && input.value.parcelData) || {},
      reqType:
        ([1971, 2068].indexOf(this.props.currentModule.record.workflow_id) !=
          -1 &&
          "duplex") ||
        "",
    };

    if (
      [23].indexOf(this.props.currentModule.id) != -1 ||
      [1968].indexOf(this.props.currentModule.record.workflow_id) != -1
    ) {
      this.parcelDataFields["parcel_type"] = {
        label: "عبارة عن",
        placeholder: "من فضلك اخل نوع الأرض",
        type: "text",
        name: "parcel_type",
        required: true,
      };
    }
    this.parcelDataFields["north_length"] = {
      label: "طول الحد الشمالي (م)",
      placeholder: "من فضلك ادخل طول الحد الشمالي (م)",
      field: "inputNumber",
      name: "north_length",
      required: true,
    };
    this.parcelDataFields["north_desc"] = {
      label: "وصف الحد الشمالي",
      placeholder: "من فضلك ادخل وصف الحد الشمالي",
      type: "text",
      name: "north_desc",
      maxLength: 200,
      required: true,
    };
    this.parcelDataFields["south_length"] = {
      label: "طول الحد الجنوبي (م)",
      placeholder: "من فضلك ادخل طول الحد الجنوبي (م)",
      field: "inputNumber",
      name: "south_length",
      required: true,
    };
    (this.parcelDataFields["south_desc"] = {
      label: "وصف الحد الجنوبي",
      placeholder: "من فضلك ادخل وصف الحد الجنوبي",
      type: "text",
      name: "south_desc",
      maxLength: 200,
      required: true,
    }),
      (this.parcelDataFields["east_length"] = {
        label: "طول الحد الشرقي (م)",
        placeholder: "من فضلك ادخل طول الحد الشرقي (م)",
        field: "inputNumber",
        name: "east_length",
        required: true,
      });
    this.parcelDataFields["east_desc"] = {
      label: "وصف الحد الشرقي",
      placeholder: "من فضلك ادخل وصف الحد الشرقي",
      type: "text",
      name: "east_desc",
      maxLength: 200,
      required: true,
    };
    this.parcelDataFields["west_length"] = {
      label: "طول الحد الغربي (م)",
      placeholder: "من فضلك ادخل طول الحد الغربي (م)",
      field: "inputNumber",
      name: "west_length",
      required: true,
    };
    this.parcelDataFields["west_desc"] = {
      label: "وصف الحد الغربي",
      placeholder: "من فضلك ادخل وصف الحد الغربي",
      type: "text",
      name: "west_desc",
      maxLength: 200,
      required: true,
    };

    fetchData(`${workFlowUrl}/Symbols/GetAll`).then((response) => {
      this.parcel_fields[2].options = response.results;
      fetchData(`${backEndUrlforMap}${response.next}`).then((data) => {
        this.parcel_fields[2].options = this.parcel_fields[2].options.concat(
          data.results
        );
      });
    });
  }

  UpdateStore(parcels) {
    var landsData = {
      parcels: [...parcels],
      parcelData: this.state.parcelData,
    };
    if (
      [23].indexOf(this.props.currentModule.id) != -1 ||
      [1968].indexOf(this.props.currentModule.record.workflow_id) != -1
    )
      landsData["selectedRequestType"] = this.props.selectedRequestType;

    this.props.input.onChange({ ...landsData });
    this.setState({ ...landsData });
  }

  addParcel = (item) => {
    const { input, onResetParcelDesc, values } = this.props;
    var parcel_desc = get(values, "PARCEL_NO", "");
    if (
      !_.find(this.parcels, function (d) {
        return d.attributes.PARCEL_PLAN_NO == parcel_desc;
      }) &&
      parcel_desc
    ) {
      this.parcels.push({
        attributes: {
          PARCEL_PLAN_NO: parcel_desc,
          NEW_PARCEL_AREA: "",
          PARCEL_SPATIAL_ID: generateUUID(),
          MUNICIPALITY_NAME_Code: get(values, "municipality_id", ""),
          PARCEL_AREA: "",
        },
      });
      this.UpdateStore(this.parcels);
    }
  };

  remove = (item) => {
    this.state.parcelData = {};
    this.parcels.pop(item);
    // let field_header = this.parcel_fields_headers.find((p) => {
    //   return p.name == "USING_SYMBOL_TEXT";
    // });
    // let field = this.parcel_fields.find((p) => {
    //   return p.name == "USING_SYMBOL_TEXT";
    // });
    // field_header.hidden = true;
    // field.hidden = true;
    this.UpdateStore(this.parcels);
  };

  saveEdit(id, name, i, fieldNameToBeShown) {
    let findParcel = this.state.parcels.find((p) => {
      return p.attributes.PARCEL_SPATIAL_ID == id;
    });
    findParcel.attributes[name] = this["edit_" + name + i];

    if (fieldNameToBeShown) {
      if (findParcel.attributes.USING_SYMBOL_SELECT) {
        findParcel.attributes.USING_SYMBOL_CODE = null;
        this.props.domainList.usingSymbols.forEach(function (symbol, key) {
          if (symbol.name == findParcel.attributes.USING_SYMBOL_SELECT) {
            findParcel.attributes.USING_SYMBOL_CODE = symbol.code;
          }
        });

        let field_header = this.parcel_fields_headers.find((p) => {
          return p.name == fieldNameToBeShown;
        });
        let field = this.parcel_fields.find((p) => {
          return p.name == fieldNameToBeShown;
        });
        findParcel.attributes.USING_SYMBOL_TEXT = "";

        if (
          findParcel.attributes.USING_SYMBOL_SELECT &&
          !findParcel.attributes.USING_SYMBOL_CODE
        ) {
          findParcel.attributes.USING_SYMBOL =
            findParcel.attributes.USING_SYMBOL_SELECT;
        } else {
          findParcel.attributes.USING_SYMBOL_TEXT =
            findParcel.attributes.USING_SYMBOL_SELECT;
        }

        // field.hidden = false;
        // field_header.hidden = false;
      }
      // else {
      //   field.hidden = true;
      //   field_header.hidden = true;
      // }
    }

    this.parcels = this.state.parcels;
    this.UpdateStore(this.parcels);
    this.setState({ [name + "_isEdit_" + i]: false });
  }

  openPopup = (scope) => {
    var fields = this.parcelDataFields;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...scope.state.parcelData },
          ok(values) {
            scope.state["parcelData"] = values;
            scope.UpdateStore(scope.parcels);
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

  selectOnchange = (name, i, e, value) => {
    this["edit_" + name + i] = value;
    e.attributes[name] = value;
    //e.attributes['PARCEL_AREA'] = event.target.value;
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  showEditBtn = (name, value) => {
    return ["NEW_PARCEL_AREA", "USING_SYMBOL_SELECT"].indexOf(name) > -1;
  };

  enableEdit = (name, i) => {
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  render() {
    const { parcels } = this.state;

    const {
      parcel_fields,
      parcel_fields_headers,
      values,
      multiple,
      selectedRequestType,
    } = this.props;

    var uploadedImage = get(values, "image_uploader", "");
    var PARCEL_NO = get(values, "PARCEL_NO", "");
    var MUNICIPALITY = get(values, "MUNICIPALITY", "");

    var parcelBtnDisabled = false;
    if (
      [23].indexOf(this.props.currentModule.id) != -1 ||
      ([1968].indexOf(this.props.currentModule.record.workflow_id) != -1 &&
        selectedRequestType == 1 &&
        parcels.length > 0)
    ) {
      parcelBtnDisabled = true;
    }

    return (
      <div style={{ gridColumn: "1/3" }}>
        <Button
          className="add-gis"
          disabled={
            !uploadedImage || !PARCEL_NO || !MUNICIPALITY || parcelBtnDisabled
          }
          onClick={this.addParcel.bind(this)}
        >
          إضافة الأرض
        </Button>
        {parcels && parcels.length > 0 && (
          <div>
            <h1 className="titleSelectedParcel">الأراضي المختارة</h1>

            <table className="table table-bordered" style={{ marginTop: "1%" }}>
              <thead>
                <tr>
                  {this.parcel_fields_headers.map((field_header, k) => {
                    return (
                      !field_header.hidden && <th>{field_header.label}</th>
                    );
                  })}
                  <th> خيارات</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((e, i) => {
                  return (
                    <tr key={i}>
                      {this.parcel_fields.map((field, k) => {
                        return (
                          !field.hidden && (
                            <td key={k}>
                              <div>
                                {field.editable ? (
                                  !this.state[field.name + "_isEdit_" + i] ? (
                                    <span>
                                      <span>
                                        {convertToArabic(
                                          e.attributes[field.name] || ""
                                        )}
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
                                      {field.type != "select" && (
                                        <input
                                          key={i}
                                          className="form-control"
                                          type={field.type}
                                          step="any"
                                          value={e.attributes[field.name]}
                                          onChange={this.myChangeHandler.bind(
                                            this,
                                            field.name,
                                            i,
                                            e
                                          )}
                                        />
                                      )}
                                      {field.type == "select" && (
                                        <Select
                                          getPopupContainer={(trigger) =>
                                            trigger.parentNode
                                          }
                                          value={e.attributes[field.name]}
                                          onChange={this.selectOnchange.bind(
                                            this,
                                            field.name,
                                            i,
                                            e
                                          )}
                                          optionFilterProp="children"
                                          filterOption={(input, option) => {
                                            if (option.props.children) {
                                              return (
                                                option.props.children
                                                  ?.toLowerCase()
                                                  ?.indexOf(
                                                    convertToArabic(
                                                      input.toLowerCase()
                                                    )
                                                  ) != -1
                                              );
                                            } else {
                                              return false;
                                            }
                                          }}
                                        >
                                          {field.options.map((f, x) => (
                                            <Option key={f.id} value={f.name}>
                                              {convertToArabic(f.name)}
                                            </Option>
                                          ))}
                                        </Select>
                                      )}
                                      <button
                                        className="btn"
                                        style={{
                                          marginRight: "20px",
                                        }}
                                        onClick={this.saveEdit.bind(
                                          this,
                                          e.attributes.PARCEL_SPATIAL_ID,
                                          field.name,
                                          i,
                                          field.toBeShown
                                        )}
                                      >
                                        <i className="fa fa-floppy-o"></i>
                                      </button>
                                    </span>
                                  )
                                ) : (
                                  <span>
                                    <span>
                                      {convertToArabic(
                                        e.attributes[field.name] || ""
                                      )}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </td>
                          )
                        );
                      })}

                      {i === parcels.length - 1 ? (
                        <td>
                          <button
                            className="btn follow"
                            style={{ margin: "0px 5px" }}
                            onClick={() => {
                              this.openPopup(this);
                            }}
                          >
                            حدود و أبعاد الأرض
                          </button>
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
  mapDispatchToProps
)(farzParcelsComponent);
