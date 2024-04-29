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
  mapSreenShot,
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
class landData_propertyCheck extends Component {
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
                              {parcel.selectedLands.map((land) => (
                                <table className="table table-bordered no-margin table-striped">
                                  {parcel_fields.map(
                                    (parcelField) =>
                                      land.attributes[parcelField.field] && (
                                        <>
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
                                        </>
                                      )
                                  )}
                                  <tr>
                                    <td>وصف الأرض</td>
                                    <td>
                                      {
                                        landData?.lands?.parcels[0]
                                          ?.selectedLands[0]?.attributes
                                          ?.PARCEL_DESCRIPTION
                                      }
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("North Description")}</td>
                                    <td>
                                      {localizeNumber(
                                        land.parcelData.north_desc
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("North Length")}</td>
                                    <td>
                                      {localizeNumber(
                                        land.parcelData.north_length
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("South Description")}</td>
                                    <td>
                                      {localizeNumber(
                                        land.parcelData.south_desc
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("South Length")}</td>
                                    <td>
                                      {localizeNumber(
                                        land.parcelData.south_length
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("East Description")}</td>
                                    <td>
                                      {localizeNumber(
                                        land.parcelData.east_desc
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("East Length")}</td>
                                    <td>
                                      {localizeNumber(
                                        land.parcelData.east_length
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("West Description")}</td>
                                    <td>
                                      {localizeNumber(
                                        land.parcelData.west_desc
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>{t("West Length")}</td>
                                    <td>
                                      {localizeNumber(
                                        land.parcelData.west_length
                                      )}
                                    </td>
                                  </tr>
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
          <table className="table">
            <tr>
              <td valign="middle" align="center">
                {t("ParcelImage")}
              </td>
            </tr>
            <tr>
              <td valign="middle" align="center">
                {checkImage(this.props, landData.previous_Image, {})}
              </td>
            </tr>
          </table>
        </>
      )) || <></>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(landData_propertyCheck));
