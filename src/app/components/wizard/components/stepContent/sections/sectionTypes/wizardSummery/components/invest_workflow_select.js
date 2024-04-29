import React, { Component } from "react";
import { filesHost } from "../../../../../../../../../imports/config";
import {
  checkImage,
  convertToArabic,
  localizeNumber,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { Collapse } from "antd";
import { isEmpty } from "lodash";
const { Panel } = Collapse;

export default class investType extends Component {
  getInvestType(type) {
    let types = [
      { label: "طرح موقع استثماري جديد", value: "newLocation" },
      { label: "إعادة طرح موقع استثماري", value: "updateLocation" },
    ];

    return types.find((t) => t.value == type)?.label;
  }

  getLayer(type) {
    let types = [
      { label: "طبقة الأراضي", value: "Landbase_Parcel" },
      {
        label: "طبقة المواقع الاستثمارية",
        value: "Invest_Site_Polygon",
      },
    ];

    return types.find((t) => t.value == type)?.label;
  }

  render() {
    const {
      mainObject: {
        investType: {
          invest_type: { investType, SelectedLayer },
          contract_Data,
          site_data,
          approves,
        },
      },
    } = this.props;

    return (
      <div>
        <div></div>
        <div>
          <Collapse className="Collapse" defaultActiveKey={[0]} key={0}>
            <Panel
              header={"تحديد نوع الاستثمار"}
              forceRender={true}
              style={{ margin: "5px" }}
            >
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td>نوع الاستثمار</td>
                    <td>{this.getInvestType(investType)}</td>
                  </tr>
                  <tr>
                    <td>طبقة المواقع</td>
                    <td>{this.getLayer(SelectedLayer)}</td>
                  </tr>
                </tbody>
              </table>
            </Panel>
          </Collapse>
        </div>
        {investType == "updateLocation" && !isEmpty(contract_Data) ? (
          <div>
            <Collapse className="Collapse" defaultActiveKey={[0]} key={0}>
              <Panel
                header={"بيانات العقد"}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <table className="table table-bordered">
                  <tbody>
                    {contract_Data?.contractType && (
                      <tr>
                        <td>نوع العقد</td>
                        <td>{contract_Data?.contractType}</td>
                      </tr>
                    )}
                    {contract_Data?.contractNumber && (
                      <tr>
                        <td>رقم العقد</td>
                        <td>
                          {convertToArabic(contract_Data?.contractNumber)}
                        </td>
                      </tr>
                    )}
                    {contract_Data?.contractStartDate && (
                      <tr>
                        <td>تاريخ بداية العقد</td>
                        <td>
                          {convertToArabic(contract_Data?.contractStartDate)} هـ
                        </td>
                      </tr>
                    )}
                    {contract_Data?.contractEndDate && (
                      <tr>
                        <td>تاريخ نهاية العقد</td>
                        <td>
                          {convertToArabic(contract_Data?.contractEndDate)} هـ
                        </td>
                      </tr>
                    )}
                    {contract_Data?.contractEnquiryRequestNo && (
                      <tr>
                        <td>رقم معاملة إدارة العقود</td>
                        <td>
                          {convertToArabic(
                            contract_Data?.contractEnquiryRequestNo
                          )}
                        </td>
                      </tr>
                    )}
                    {contract_Data?.contractEnquiryRequestDate && (
                      <tr>
                        <td>تاريخ معاملة إدارة العقود</td>
                        <td>
                          {convertToArabic(
                            contract_Data?.contractEnquiryRequestDate
                          )}{" "}
                          هـ
                        </td>
                      </tr>
                    )}
                    {contract_Data?.investorName && (
                      <tr>
                        <td>اسم المستثمر</td>
                        <td>{contract_Data?.investorName}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Panel>
            </Collapse>
          </div>
        ) : (
          <></>
        )}
        <div>
          <Collapse className="Collapse" defaultActiveKey={[0]} key={0}>
            <Panel
              header={"بيانات الموقع"}
              forceRender={true}
              style={{ margin: "5px" }}
            >
              <table className="table table-bordered">
                <tbody>
                  {/* {site_data?.buildingLicense && (
                    <tr>
                      <td>رخصة البناء</td>
                      <td>{convertToArabic(site_data?.buildingLicense)}</td>
                    </tr>
                  )} */}
                  {site_data?.siteStatus && (
                    <tr>
                      <td>حالة الموقع</td>
                      <td>{site_data?.siteStatus}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Panel>
          </Collapse>
        </div>
        {approves?.global_approve_attachments && (
          <div>
            <Collapse className="Collapse" defaultActiveKey={[0]} key={0}>
              <Panel
                header={"المرفقات"}
                forceRender={true}
                style={{ margin: "5px" }}
              >
                <table className="table table-bordered">
                  <tbody>
                    {approves?.global_approve_attachments && (
                      <tr>
                        <td colSpan={"100%"} className="morfkat_invest">
                          {checkImage(
                            this.props,
                            approves.global_approve_attachments,
                            {}
                          )}
                        </td>
                      </tr>
                    )}
                    {/* {approves?.gov_approve_img && (
              <tr>
                <td>موافقة الوزارة</td>
                <td>{checkImage(this.props, approves.gov_approve_img, {})}</td>
              </tr>
            )}
            {approves?.build_wekala_img && (
              <tr>
                <td>موافقة وكالة التعميير</td>
                <td>{checkImage(this.props, approves.build_wekala_img, {})}</td>
              </tr>
            )}
            {approves?.service_wekala_img && (
              <tr>
                <td>موافقة وكالة الخدمات</td>
                <td>
                  {checkImage(this.props, approves.service_wekala_img, {})}
                </td>
              </tr>
            )} */}
                  </tbody>
                </table>
              </Panel>
            </Collapse>
          </div>
        )}
      </div>
    );
  }
}
