import React, { Component } from "react";
import { workFlowUrl } from "imports/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import renderField from "app/components/inputs";
import {
  queryTask,
  getInfo,
  highlightFeature,
  clearGraphicFromLayer,
  getFeatureDomainName,
  intersectQueryTask,
  addParcelNo,
  getPacrelNoAngle,
  drawLength,
  convertToEnglish,
  map_object,
  delete_null_object,
  checkParcelAdjacents,
  convertToArabic,
  uploadGISFile,
} from "./identify/Component/common/common_func";
import { Field, reduxForm } from "redux-form";
import store from "app/reducers";
import { withTranslation } from "react-i18next";
import {
  Select,
  Button,
  Form,
  message,
  Tooltip,
  Divider,
  Collapse,
} from "antd";
// import "antd/dist/reset.css";
import { mapDispatchToProps, mapStateToProps } from "../mapping";
import mapDispatchToProps1 from "main_helpers/actions/main";
import { connect } from "react-redux";
import { fetchData } from "../../../helpers/apiMethods";
import { fetchAllData } from "../../../helpers/functions";
import { serverFieldMapper } from "app/helpers/functions";
import { map } from "lodash";
const { Option } = Select;
const Panel = Collapse.Panel;
export const appMapDispatchToProps = (dispatch) => {
  return {
    ...mapDispatchToProps(dispatch, "lands"),
    ...mapDispatchToProps1(dispatch),
  };
};

class propertyRemoval_compensationShakeComponent extends Component {
  constructor(props) {
    super(props);

    this.lists = [
      [
        {
          name: "MUNICIPALITY_NAME",
          hideLabel: true,
          visible: true,
          editable: false,
          field: "text",
          placeholder: "البلدية",
          colSpan: null,
        },
        {
          name: "PLAN_NO",
          hideLabel: true,
          editable: false,
          field: "text",
          visible: true,
          placeholder: "رقم المخطط",
          colSpan: null,
        },
        {
          name: "PARCEL_PLAN_NO",
          hideLabel: true,
          editable: false,
          field: "text",
          visible: true,
          placeholder: "رقم قطعة الأرض",
          colSpan: null,
        },
        {
          name: "DISTRICT_NAME",
          hideLabel: true,
          editable: (!this.props.isView && true) || false,
          field: "text",
          visible: false,
          placeholder: "الحي",
          colSpan: null,
        },
        {
          name: "SUBDIVISION_TYPE",
          hideLabel: true,
          editable: false,
          field: "select",
          visible: false,
          placeholder: "نوع التقسيم",
          colSpan: null,
        },
        {
          name: "SUBDIVISION_DESCRIPTION",
          hideLabel: true,
          editable: false,
          field: "text",
          visible: false,
          placeholder: "وصف التقسيم",
          colSpan: null,
        },
      ],
      [
        {
          name: "PARCEL_AREA",
          hideLabel: true,
          visible: true,
          editable: false,
          field: "text",
          placeholder: "المساحة (م٢)",
          colSpan: "1",
        },
        {
          name: "COMPENSATION_ATTACHMENT",
          hideLabel: true,
          editable: true,
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          visible: true,
          placeholder: "مرفق خطاب الصرف",
          colSpan: "1",
          disabled: this.props.disabled,
        },
        {
          name: "CHEQUE_ATTACHMENT",
          hideLabel: true,
          editable: true,
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          visible: true,
          placeholder: "مرفق شيك الصرف",
          colSpan: "1",
          disabled: this.props.disabled,
        },
      ],
    ];

    this.lists.forEach((list) => {
      list = map(list, (value, key) => ({
        name: key,
        ...serverFieldMapper(value),
      }));
    });

    map_object(
      props?.input?.value?.selectedLands ||
        props?.mainObject.landData.landData.lands?.parcels ||
        []
    );
    this.state = {
      selectedLands:
        props?.input?.value?.selectedLands ||
        props?.mainObject.landData.landData.lands?.parcels ||
        [],
    };

    this.isloaded = true;
  }

  setToStore = (polygon) => {
    const {
      input: { value },
    } = this.props;

    let landIndex = this.state.selectedLands.find(
      (r) =>
        r.attributes.PARCEL_SPATIAL_ID ==
          polygon.attributes.PARCEL_SPATIAL_ID &&
        r.attributes.PARCEL_PLAN_NO == polygon.attributes.PARCEL_PLAN_NO
    );
    if (polygon && landIndex == -1) {
      polygon.attributes.PARCEL_AREA = (+polygon.attributes
        .PARCEL_AREA).toFixed(2);

      this.state.selectedLands.push({
        geometry: polygon.geometry,
        attributes: polygon.attributes,
      });
    } else {
      this.state.selectedLands[landIndex] = polygon;
    }
    this.setState({ selectedLands: this.state.selectedLands });
    this.props.input.onChange({ selectedLands: this.state.selectedLands });
  };

  enableEdit = (name, i) => {
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  showEditBtn = (name, value, attributes) => {
    let editables = ["COMPENSATION_ATTACHMENT", "CHEQUE_ATTACHMENT"];

    return editables.indexOf(name) > -1;
  };

  myChangeHandler = (url, name, i, e) => {
    // this["edit_" + name + i] =
    //   (typeof event != "object" && event) || event.target.value;
    if (e.attributes) {
      e.attributes[name] = url;
    } else {
      e[name] = url;
    }
    //e.attributes['PARCEL_AREA'] = event.target.value;
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  selectOnchange = (name, i, e, value) => {
    // this["edit_" + name + i] = value;
    e.attributes[name] = value;
    //e.attributes['PARCEL_AREA'] = event.target.value;
    this.setState({ [name + "_isEdit_" + i]: true });
  };

  saveEdit(id, name, i) {
    let selectLand = this.state.selectedLands.find((p) => {
      return [p?.id, p?.attributes?.PARCEL_SPATIAL_ID].indexOf(id) != -1;
    });
    // selectLand.attributes["TOTAL_PARCEL_CUT_PRICE"] =
    //   (selectLand.attributes["PARCEL_METER_PRICE"] &&
    //     (
    //       +selectLand.attributes["PARCEL_METER_PRICE"] *
    //       +selectLand.attributes["PARCEL_CUT_AREA"]
    //     ).toFixed(2)) ||
    //   "";

    // let pricing_table_totals = [
    //   {
    //     total_of_totals_of_cut_areas: this.state.selectedLands
    //       .reduce((a, b) => a + +(b.attributes.PARCEL_CUT_AREA || 0), 0)
    //       .toFixed(2),
    //     total_of_totals_of_cut_prices: this.state.selectedLands
    //       .reduce((a, b) => a + +(b.attributes.TOTAL_PARCEL_CUT_PRICE || 0), 0)
    //       .toFixed(2),
    //   },
    // ];

    // this.props.change(
    //   "primary_pricing.pricing_table_totals",
    //   pricing_table_totals
    // );
    this.setState(
      {
        [name + "_isEdit_" + i]: false,
      },
      () => {
        this.setToStore(selectLand);
      }
    );
  }

  render() {
    const { selectedLands } = this.state;
    return (
      <div>
        {
          <div style={{ gridColumn: "1/3" }}>
            {selectedLands && selectedLands.length > 0 && (
              <div>
                <div>
                  <h1 className="titleSelectedParcel">الأراضي المختارة</h1>
                  <Collapse
                    className="Collapse"
                    defaultActiveKey={[...selectedLands.map((e, i) => i)]}
                  >
                    {selectedLands.map((e, i) => {
                      return (
                        <Panel
                          header={convertToArabic(
                            `قطعة الأرض رقم  ${e.attributes.PARCEL_PLAN_NO}`
                          )}
                          forceRender={true}
                          style={{ margin: "5px" }}
                          key={i}
                        >
                          <table
                            className="table table-bordered"
                            style={{ marginTop: "1%" }}
                          >
                            <tbody>
                              {this.lists.map((list, listIndex) => (
                                <tr key={i}>
                                  {list.map((field, k) => {
                                    return (
                                      field.visible &&
                                      ((
                                        <>
                                          <th
                                            style={{
                                              width:
                                                (listIndex == 0 && "10%") || "",
                                            }}
                                          >
                                            {field.placeholder}
                                          </th>
                                          <td
                                            key={k}
                                            colSpan={field.colSpan}
                                            style={{
                                              width:
                                                (listIndex == 0 && "10%") || "",
                                            }}
                                          >
                                            <div>
                                              {field.editable ? (
                                                // !this.state[
                                                //   field.name + "_isEdit_" + i
                                                // ] ? (
                                                //   <span>
                                                //     <span>
                                                //       {<Field
                                                //         init_data={(props) => {
                                                //           props.input.onChange(
                                                //             e.attributes[
                                                //               field.name
                                                //             ]
                                                //           );
                                                //         }}
                                                //         name={`${field.name}${i}`}
                                                //         component={renderField}
                                                //         className="form-control"
                                                //         {...{ field }}
                                                //         field={
                                                //           field.type ||
                                                //           field.field
                                                //         }
                                                //         uploadUrl={
                                                //           field.uploadUrl
                                                //         }
                                                //         fileType={
                                                //           field.fileType
                                                //         }
                                                //         label={
                                                //           field.placeholder
                                                //         }
                                                //         hideLabel={true}
                                                //         value={
                                                //           e.attributes[
                                                //             field.name
                                                //           ]
                                                //         }
                                                //         disabled={true}
                                                //       />}
                                                //     </span>
                                                //     {!this.props?.field
                                                //       ?.isReadOnly &&
                                                //       this.showEditBtn(
                                                //         field.name,
                                                //         e.attributes[
                                                //           field.name
                                                //         ],
                                                //         e.attributes
                                                //       ) && (
                                                //         <span>
                                                //           <button
                                                //             className="btn"
                                                //             style={{
                                                //               marginRight: e
                                                //                 .attributes[
                                                //                 field.name
                                                //               ]
                                                //                 ? "20px"
                                                //                 : "0px",
                                                //             }}
                                                //             onClick={this.enableEdit.bind(
                                                //               this,
                                                //               field.name,
                                                //               i
                                                //             )}
                                                //           >
                                                //             <i className="fas fa-edit"></i>
                                                //           </button>
                                                //         </span>
                                                //       )}
                                                //   </span>
                                                // ) : (
                                                //   <span
                                                //     style={{
                                                //       display: "grid",
                                                //       gridTemplateColumns:
                                                //         "1fr auto",
                                                //     }}
                                                //   >
                                                //     {field.field !=
                                                //       "select" && (
                                                //       <Field
                                                //         init_data={(props) => {
                                                //           props.input.onChange(
                                                //             e.attributes[
                                                //               field.name
                                                //             ]
                                                //           );
                                                //         }}
                                                //         name={`${field.name}${i}`}
                                                //         component={renderField}
                                                //         className="form-control"
                                                //         {...{ field }}
                                                //         field={
                                                //           field.type ||
                                                //           field.field
                                                //         }
                                                //         uploadUrl={
                                                //           field.uploadUrl
                                                //         }
                                                //         fileType={
                                                //           field.fileType
                                                //         }
                                                //         label={
                                                //           field.placeholder
                                                //         }
                                                //         hideLabel={true}
                                                //         value={
                                                //           e.attributes[
                                                //             field.name
                                                //           ]
                                                //         }
                                                //         postRequest={(url) => {
                                                //           ;
                                                //           this.myChangeHandler(
                                                //             url,
                                                //             field.name,
                                                //             i,
                                                //             e
                                                //           );
                                                //           this.saveEdit(
                                                //             e.attributes
                                                //               .PARCEL_SPATIAL_ID,
                                                //             field.name,
                                                //             i
                                                //           )
                                                //         }}
                                                //       />
                                                //     )}
                                                //     {field.field ==
                                                //       "select" && (
                                                //       <Select
                                                //         value={
                                                //           e.attributes[
                                                //             field.name
                                                //           ]
                                                //         }
                                                //         onChange={this.selectOnchange.bind(
                                                //           this,
                                                //           field.name,
                                                //           i,
                                                //           e
                                                //         )}
                                                //         optionFilterProp="children"
                                                //         filterOption={(
                                                //           input,
                                                //           option
                                                //         ) =>
                                                //           convertToEnglish(
                                                //             option.props
                                                //               .children
                                                //           )
                                                //             ?.toLowerCase()
                                                //             ?.indexOf(
                                                //               input.toLowerCase()
                                                //             ) >= 0
                                                //         }
                                                //       >
                                                //         {field?.options?.map(
                                                //           (e, i) => (
                                                //             <Option
                                                //               key={i}
                                                //               value={e.name}
                                                //             >
                                                //               {convertToArabic(
                                                //                 e.name
                                                //               )}
                                                //             </Option>
                                                //           )
                                                //         )}
                                                //       </Select>
                                                //     )}
                                                //     <button
                                                //       className="btn"
                                                //       style={{
                                                //         marginRight: "20px",
                                                //       }}
                                                //       onClick={this.saveEdit.bind(
                                                //         this,
                                                //         e.attributes
                                                //           .PARCEL_SPATIAL_ID,
                                                //         field.name,
                                                //         i
                                                //       )}
                                                //     >
                                                //       <i className="fa fa-floppy-o"></i>
                                                //     </button>
                                                //   </span>
                                                // )
                                                <Field
                                                  init={(props) => {
                                                    props.input.onChange(
                                                      e.attributes[field.name]
                                                    );
                                                  }}
                                                  name={`${field.name}${i}`}
                                                  component={renderField}
                                                  className="form-control"
                                                  {...{ field }}
                                                  field={
                                                    field.type || field.field
                                                  }
                                                  uploadUrl={field.uploadUrl}
                                                  fileType={field.fileType}
                                                  label={field.placeholder}
                                                  hideLabel={true}
                                                  value={
                                                    e.attributes[field.name]
                                                  }
                                                  postRequest={(url) => {
                                                    this.myChangeHandler(
                                                      url,
                                                      field.name,
                                                      i,
                                                      e
                                                    );
                                                    this.saveEdit(
                                                      e.attributes
                                                        .PARCEL_SPATIAL_ID,
                                                      field.name,
                                                      i
                                                    );
                                                  }}
                                                />
                                              ) : (
                                                <span>
                                                  <span>
                                                    {convertToArabic(
                                                      e.attributes[
                                                        field.name
                                                      ] || "غير متوفر"
                                                    )}
                                                  </span>
                                                </span>
                                              )}
                                            </div>
                                          </td>
                                        </>
                                      ) || <td></td>)
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </Panel>
                      );
                    })}
                  </Collapse>
                </div>
              </div>
            )}
          </div>
        }
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  appMapDispatchToProps
)(withTranslation("labels")(propertyRemoval_compensationShakeComponent));
