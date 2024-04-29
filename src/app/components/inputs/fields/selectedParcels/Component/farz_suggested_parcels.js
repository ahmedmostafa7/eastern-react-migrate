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
  isEmpty,
} from "lodash";
import {
  generateUUID,
  convertToArabic,
} from "../../identify/Component/common/common_func";
import "./style.css";
class farzSuggestedParcelsComponent extends Component {
  constructor(props) {
    super(props);
    const { input } = props;

    this.suggestedParcels =
      (input && input.value && input.value.suggestedParcels) || [];
    this.state = {
      suggestedParcels:
        (input && input.value && input.value.suggestedParcels) || [],
      reqType:
        ([1971, 2068].indexOf(this.props.currentModule.record.workflow_id) !=
          -1 &&
          "duplex") ||
        "",
    };

    this.parcel_fields_headers = [
      {
        name: `${
          [23].indexOf(this.props.currentModule.id) != -1 ||
          [1968].indexOf(this.props.currentModule.record.workflow_id) != -1
            ? "PARCEL_PLAN_NO"
            : "PARCELNAME"
        }`,
        label: `${
          [23].indexOf(this.props.currentModule.id) != -1 ||
          [1968].indexOf(this.props.currentModule.record.workflow_id) != -1
            ? "رقم الأرض"
            : "اسم الدوبلكس"
        }`,
        hidden: false,
      },
    ];
    this.parcel_fields = [
      {
        name: `${
          [23].indexOf(this.props.currentModule.id) != -1 ||
          [1968].indexOf(this.props.currentModule.record.workflow_id) != -1
            ? "PARCEL_PLAN_NO"
            : "PARCELNAME"
        }`,
        editable: false,
        hidden: false,
        toBeShown: undefined,
      },
    ];
    this.parcelDataFields = {};

    if (
      [23].indexOf(this.props.currentModule.id) != -1 ||
      [1968].indexOf(this.props.currentModule.record.workflow_id) != -1
    ) {
      this.parcelDataFields["PARCEL_PLAN_NO"] = {
        label: "أرض رقم",
        placeholder: "من فضلك أدخل رقم الأرض",
        type: "text",
        name: "PARCEL_PLAN_NO",
        required: true,
      };

      this.parcelDataFields["NEW_PARCEL_AREA"] = {
        label: "المساحة (م۲)",
        placeholder: "المساحة (م۲)",
        type: "text",
        name: "NEW_PARCEL_AREA",
        required: true,
      };

      this.parcelDataFields["parcel_type"] = {
        label: "عبارة عن",
        placeholder: "من فضلك اخل نوع الأرض",
        type: "text",
        name: "parcel_type",
        required: true,
      };
    } else {
      this.parcelDataFields["PARCELNAME"] = {
        label: "دوبلكس",
        placeholder: "دوبلكس",
        type: "text",
        name: "PARCELNAME",
        required: true,
      };

      this.parcelDataFields["AREA"] = {
        label: "المساحة (م۲)",
        placeholder: "المساحة (م۲)",
        type: "text",
        name: "AREA",
        required: true,
      };

      this.parcelDataFields["duplixType"] = {
        label: "النوع",
        field: "radio",
        options: [
          { label: "فلل منفصلة", value: "splited" },
          { label: "فلل متصلة", value: "marged" },
        ],
        name: "duplixType",
        initValue: "splited",
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
  }

  UpdateStore(parcels) {
    const {
      mainObject: {
        landData: {
          landData: {
            lands: { selectedRequestType },
          },
        },
      },
    } = this.props;
    var landsData = { suggestedParcels: [...parcels] };
    if (
      [23].indexOf(this.props.currentModule.id) != -1 ||
      [1968].indexOf(this.props.currentModule.record.workflow_id) != -1
    )
      landsData["selectedRequestType"] = selectedRequestType;

    this.props.input.onChange({ ...landsData });
    this.setState({ ...landsData });
  }

  addParcel = (item, isEdit, index) => {
    var recordEdited = false;
    const { t } = this.props;
    var parcel_desc = get(
      item,
      `${
        [23].indexOf(this.props.currentModule.id) != -1 ||
        [1968].indexOf(this.props.currentModule.record.workflow_id) != -1
          ? "PARCEL_PLAN_NO"
          : "PARCELNAME"
      }`,
      ""
    );
    if (
      !_.find(this.suggestedParcels, function (d) {
        return (
          d.attributes.PARCEL_PLAN_NO == parcel_desc &&
          d.attributes.PARCEL_SPATIAL_ID != item.PARCEL_SPATIAL_ID
        );
      }) &&
      parcel_desc
    ) {
      if (
        [1971, 2068].indexOf(this.props.currentModule.record.workflow_id) != -1
      ) {
        if (item.duplixType == "splited") {
          if (
            +item.east_length >= 11.5 &&
            +item.west_length >= 11.5 &&
            +item.north_length >= 11.5 &&
            +item.south_length >= 11.5
          ) {
            if (!isEdit) {
              this.suggestedParcels.push({
                attributes: { ...item, PARCEL_SPATIAL_ID: generateUUID() },
              });
            } else {
              this.suggestedParcels[index].attributes = item;
            }
            recordEdited = true;
          } else {
            window.notifySystem("error", t("DUPLIX_ERROR_MSG"));
            recordEdited = false;
          }
        }
        if (item.duplixType == "marged") {
          if (
            +item.east_length >= 9.5 &&
            +item.west_length >= 9.5 &&
            +item.north_length >= 9.5 &&
            +item.south_length >= 9.5
          ) {
            if (!isEdit) {
              this.suggestedParcels.push({
                attributes: { ...item, PARCEL_SPATIAL_ID: generateUUID() },
              });
            } else {
              this.suggestedParcels[index].attributes = item;
            }
            recordEdited = true;
          } else {
            window.notifySystem("error", t("DUPLIX_ERROR_MSG"));
            recordEdited = false;
          }
        }
      } else {
        if (!isEdit) {
          this.suggestedParcels.push({
            attributes: { ...item, PARCEL_SPATIAL_ID: generateUUID() },
          });
        } else {
          this.suggestedParcels[index].attributes = item;
        }
        recordEdited = true;
      }
    } else {
      window.notifySystem(
        "error",
        t(
          [23].indexOf(this.props.currentModule.id) != -1 ||
            [1968].indexOf(this.props.currentModule.record.workflow_id) != -1
            ? "PARCEL_UNIQUE"
            : "DUPLIX_UNIQUE"
        )
      );
      recordEdited = false;
    }

    this.UpdateStore(this.suggestedParcels);
    return recordEdited;
  };

  remove = (index) => {
    this.suggestedParcels.splice(index, 1);
    this.UpdateStore(this.suggestedParcels);
  };

  openPopup = (item, index) => {
    var fields = this.parcelDataFields;
    var isEdit = !isEmpty(item);
    var scope = this;
    this.props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: { ...item },
          ok(values) {
            if (scope.addParcel(values, isEdit, index)) {
              return Promise.resolve(true);
            } else {
              return Promise.reject();
            }
          },
        },
      },
    });
  };

  render() {
    const { suggestedParcels, reqType } = this.state;

    const {
      parcel_fields,
      parcel_fields_headers,
      values,
      multiple,
      selectedRequestType,
    } = this.props;
    return (
      <div style={{ gridColumn: "1/3" }}>
        <Button className="add-gis" onClick={this.openPopup.bind(this, {}, 0)}>
          {[23].indexOf(this.props.currentModule.id) != -1 ||
          [1968].indexOf(this.props.currentModule.record.workflow_id) != -1
            ? "إضافة الأرض"
            : "إضافة الدوبلكس"}
        </Button>
        {suggestedParcels && suggestedParcels.length > 0 && (
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
                {suggestedParcels.map((e, i) => {
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
                      <td>
                        <button
                          className="btn follow"
                          style={{ margin: "0px 5px" }}
                          onClick={() => {
                            this.openPopup(e.attributes, i);
                          }}
                        >
                          {[23].indexOf(this.props.currentModule.id) != -1 ||
                          [1968].indexOf(
                            this.props.currentModule.record.workflow_id
                          ) != -1
                            ? "تعديل"
                            : "تعديل دوبلكس"}
                        </button>
                        <button
                          className=" btn btn-danger "
                          onClick={this.remove.bind(this, i)}
                        >
                          حذف
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
)(farzSuggestedParcelsComponent);
