import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  convertToArabic,
  localizeNumber,
  getInfo,
  remove_duplicate,
  checkImage,
  map_object,
  project,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { esriRequest } from "../../../../../../../inputs/fields/identify/Component/common/esri_request";
import { mapUrl } from "../../../../../../../inputs/fields/identify/Component/mapviewer/config/map";
import { map, get, assign, isEmpty } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import {
  Select,
  Button,
  Form,
  message,
  Checkbox,
  Tabs,
  Collapse,
  Pagination,
  Tooltip,
} from "antd";
const Panel = Collapse.Panel;
const x = {
  width: "50%",
};
const parcel_fields = [
  { label: "Submission parcels", field: "PARCEL_PLAN_NO" },
  { label: "Submission parcel area", field: "PARCEL_AREA", ext: "م2" },
  { label: "Plan Number", field: "PLAN_NO" },
  { label: "BlockNo", field: "PARCEL_BLOCK_NO" },
  { label: "District", field: "DISTRICT_NAME" },
  { label: "SUBDIVISION_TYPE", field: "SUBDIVISION_DESCRIPTION" },
  { label: "رمز الاستخدام", field: "USING_SYMBOL" },
];
class landData_allotment extends Component {
  constructor(props) {
    super(props);
    this.parcel_fields_headers = {
      SHATFA_NORTH_EAST_DIRECTION: "شمال / شرق",
      SHATFA_NORTH_WEST_DIRECTION: "شمال / غرب",
      SHATFA_SOUTH_EAST_DIRECTION: "جنوب / شرق",
      SHATFA_SOUTH_WEST_DIRECTION: "جنوب / غرب",
    };
    this.parcel_fields_electric_headers = {
      ELEC_NORTH_EAST_DIRECTION: "شمال / شرق",
      ELEC_NORTH_WEST_DIRECTION: "شمال / غرب",
      ELEC_SOUTH_EAST_DIRECTION: "جنوب / شرق",
      ELEC_SOUTH_WEST_DIRECTION: "جنوب / غرب",
    };
  }
  openPrint = () => {
    // let id = this.props?.currentModule.CurrentStep?.id;
    if (this.props.currentModule.record.request_no) {
      const {
        t,
        mainObject: { submissionType },
        currentModule: {
          record: { id },
        },
      } = this.props;
      let landDataTemp =
        (this.props.mainObject.landData &&
          this.props.mainObject.landData.landData) ||
        {};

      localStorage.setItem(
        "parcelsData",
        JSON.stringify(landDataTemp?.lands?.parcels)
      );

      window.open(printHost + "/#/print_description_card/" + id, "_blank");
    } else {
      const { setModal } = this.props;
      setModal({
        title: "كارت الوصف",
        name: "fda2",
        // id: id,
        className: "mo3yna_full",
        type: "globalMo3yna",
        mo3aynaObject: this.props.mainObject,
      });
    }
  };

  exportParcelToGoogleMap(geometry) {
    var centerPoint = new esri.geometry.Polygon(geometry).getCentroid();
    project([centerPoint], 4326, (res) => {
      window.open(
        `http://maps.google.com/maps?q=${res[0].y},${res[0].x}`,
        "_blank"
      );
    });
  }

  render() {
    const { t, mainObject } = this.props;

    let landData = mainObject?.landData?.landData || {};

    //;
    const {
      treeNode: {
        option: { module_id },
      },
    } = this.props;

    return (
      (landData?.lands?.parcels?.length && (
        <>
          <Collapse className="Collapse" defaultActiveKey={["0"]}>
            <Panel
              key={"0"}
              header={`كارت الوصف`}
              forceRender={true}
              style={{ margin: "5px" }}
            >
              <div>
                <table className="table table-bordered no-margin table-striped">
                  {landData.site_allotment_before && (
                    <tr>
                      <td>هذا الموقع لم يتم تخصيصه مسبقا</td>
                      <td>
                        <Checkbox
                          checked={landData.site_allotment_before}
                          disabled={true}
                        />
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>كارت الوصف</td>
                    <td>
                      <Button
                        type="primary"
                        icon="print"
                        onClick={this.openPrint.bind(this)}
                      >
                        طباعة كارت الوصف
                      </Button>
                    </td>
                  </tr>
                </table>
              </div>
            </Panel>
          </Collapse>
          <Collapse className="Collapse" defaultActiveKey={["0"]}>
            {landData?.lands?.parcels
              .reduce((a, b) => {
                if (a.find((f) => f.mun == b.munval.name) == undefined) {
                  a = (a.length && [
                    ...a,
                    {
                      mun: b?.munval?.name,
                      data: landData?.lands?.parcels.filter(
                        (parcel) => parcel?.munval?.code == b?.munval?.code
                      ),
                    },
                  ]) || [
                    {
                      mun: b?.munval?.name,
                      data: landData?.lands?.parcels.filter(
                        (parcel) => parcel?.munval?.code == b?.munval?.code
                      ),
                    },
                  ];
                }
                return a;
              }, [])
              .map((section, index) => (
                <Panel
                  key={index}
                  header={`${section.mun}`}
                  forceRender={true}
                  style={{ margin: "5px" }}
                >
                  {section.data.map((parcel) => (
                    <div>
                      <table className="table table-bordered no-margin table-striped">
                        {parcel.planeval && (
                          <tr>
                            <td style={x}>{t("Plan Number")}</td>
                            <td>{localizeNumber(parcel.planeval.name)}</td>
                          </tr>
                        )}
                        {parcel.subTypeval && (
                          <tr>
                            <td style={x}>{parcel.subTypeval.name}</td>
                            <td>{parcel.subNameval.name}</td>
                          </tr>
                        )}
                        {parcel.blockval && (
                          <tr>
                            <td style={x}>{t("BlockNo")}</td>
                            <td>{localizeNumber(parcel.blockval.name)}</td>
                          </tr>
                        )}
                        {parcel.noOfParcels && (
                          <tr>
                            <td style={x}>{t("عدد الأراضي")}</td>
                            <td>{localizeNumber(parcel.noOfParcels)}</td>
                          </tr>
                        )}
                        {parcel.selectedLands.length > 0 && (
                          <tr>
                            <td style={x}>الأراضي المختارة</td>
                            <td>
                              {(parcel.landData_type == 1 ||
                                (parcel.landData_type == 2 &&
                                  [91, 92].indexOf(module_id) != -1)) &&
                                parcel.selectedLands.map((land) => (
                                  <table className="table table-bordered no-margin table-striped">
                                    <tr>
                                      <td>موقع الأرض على جوجل</td>
                                      <td>
                                        <button
                                          className="btn add-btnT"
                                          onClick={this.exportParcelToGoogleMap.bind(
                                            this,
                                            land.geometry
                                          )}
                                        >
                                          موقع المخطط على جوجل
                                        </button>
                                      </td>
                                    </tr>
                                    {parcel_fields.map(
                                      (parcelField) =>
                                        land.attributes[parcelField.field] && (
                                          <tr>
                                            <td>
                                              {land.attributes[
                                                parcelField.label
                                              ] || t(parcelField.label)}{" "}
                                              {parcelField.ext &&
                                                localizeNumber(parcelField.ext)}
                                            </td>
                                            <td>
                                              {localizeNumber(
                                                land.attributes[
                                                  parcelField.field
                                                ]
                                              )}{" "}
                                              {parcelField.ext &&
                                                localizeNumber(parcelField.ext)}
                                            </td>
                                          </tr>
                                        )
                                    )}

                                    {module_id == 92 && (
                                      <>
                                        <tr>
                                          <td>{t("North Description")}</td>
                                          <td>
                                            {convertToArabic(
                                              land.parcelData.north_desc
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("North Length")}</td>
                                          <td>
                                            {convertToArabic(
                                              land.parcelData.north_length
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("South Description")}</td>
                                          <td>
                                            {convertToArabic(
                                              land.parcelData.south_desc
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("South Length")}</td>
                                          <td>
                                            {convertToArabic(
                                              land.parcelData.south_length
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("East Description")}</td>
                                          <td>
                                            {convertToArabic(
                                              land.parcelData.east_desc
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("East Length")}</td>
                                          <td>
                                            {convertToArabic(
                                              land.parcelData.east_length
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("West Description")}</td>
                                          <td>
                                            {convertToArabic(
                                              land.parcelData.west_desc
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("West Length")}</td>
                                          <td>
                                            {convertToArabic(
                                              land.parcelData.west_length
                                            )}
                                          </td>
                                        </tr>
                                        {land?.parcelShatfa &&
                                          Object.keys(land?.parcelShatfa).map(
                                            (key, index) => {
                                              return (
                                                <tr>
                                                  <td>
                                                    إتجاه الشطفة :{" "}
                                                    {
                                                      this
                                                        .parcel_fields_headers[
                                                        key
                                                      ]
                                                    }
                                                  </td>
                                                  {(land?.parcelShatfa[key] && (
                                                    <td>
                                                      {convertToArabic(
                                                        land?.parcelShatfa[key]
                                                      )}{" "}
                                                      م{convertToArabic(2)}
                                                    </td>
                                                  )) || <td>بدون</td>}
                                                </tr>
                                              );
                                            }
                                          )}
                                        {/* {land.parcelElectric && (
                                          <>
                                            <tr>
                                              <td>
                                                {t("مساحة غرفة الكهرباء")}
                                              </td>
                                              <td>
                                                {convertToArabic(
                                                  land?.parcelElectric
                                                    ?.electric_room_area
                                                )}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>{t("مكان غرفة الكهرباء")}</td>
                                              <td>
                                                {convertToArabic(
                                                  land?.parcelElectric
                                                    ?.electric_room_place
                                                )}
                                              </td>
                                            </tr>
                                          </>
                                        )} */}
                                        {land?.parcelElectric &&
                                          Object.keys(land?.parcelElectric).map(
                                            (key, index) => {
                                              return (
                                                <tr>
                                                  <td>
                                                    إتجاه غرفة الكهرباء :{" "}
                                                    {
                                                      this
                                                        .parcel_fields_electric_headers[
                                                        key
                                                      ]
                                                    }
                                                  </td>
                                                  {(land?.parcelElectric[
                                                    key
                                                  ] && (
                                                    <td>
                                                      {convertToArabic(
                                                        land?.parcelElectric[
                                                          key
                                                        ]
                                                      )}{" "}
                                                      م{convertToArabic(2)}
                                                    </td>
                                                  )) || <td>بدون</td>}
                                                </tr>
                                              );
                                            }
                                          )}
                                      </>
                                    )}
                                  </table>
                                ))}
                            </td>
                          </tr>
                        )}
                      </table>
                    </div>
                  ))}
                </Panel>
              ))}
          </Collapse>
        </>
      )) || <></>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(landData_allotment));
