import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { withTranslation } from "react-i18next";
import {
  convertToArabic,
  localizeNumber,
  getInfo,
  remove_duplicate,
  checkImage,
  map_object,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { esriRequest } from "../../../../../../../inputs/fields/identify/Component/common/esri_request";
import { mapUrl } from "../../../../../../../inputs/fields/identify/Component/mapviewer/config/map";
import { map, get, assign, isEmpty } from "lodash";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { workFlowUrl } from "../../../../../../../../../imports/config";
import { CalculateTotalFees } from "../../../../../../../../../main_helpers/functions/fees";
class feesInfo_addedparcels extends Component {
  constructor(props) {
    super(props);
  }

  print() {
    const {
      currentModule: { record },
    } = this.props;

    let id = record.id;
    window.open(printHost + `/#/parcels_invoice/${id}`, "_blank");
  }

  render() {
    const {
      mainObject: {
        fees: {
          feesInfo: { feesValue, notes, feesList, is_paid },
        },
      },
      currentModule: {
        record: { invoice_number, invoice_date },
      },
    } = this.props;
    let suggestionsParcels =
      this.props.mainObject?.data_msa7y?.msa7yData?.cadDetails
        ?.suggestionsParcels ||
      this.props.mainObject?.suggestParcel?.suggestParcel?.suggestParcels
        ?.polygons;
    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>المساحة الإجمالية للأرض بعد إضافة الزائدة التنظيمية</td>
              <td>
                {convertToArabic(
                  suggestionsParcels
                    ?.reduce((a, b) => {
                      return a + +b.area;
                    }, 0)
                    ?.toFixed(2) + " م2"
                )}
              </td>
            </tr>
            {feesValue && (
              <tr>
                <td>رسوم الفاتورة</td>
                <td>
                  {convertToArabic(
                    feesValue && typeof feesValue == "string"
                      ? feesValue?.indexOf(":") != -1 &&
                          feesValue?.split(":")[1]
                      : feesValue || 0
                  )}
                </td>
              </tr>
            )}
            <tr>
              <td>حالة الدفع لجميع الفواتير</td>
              <td>
                <span>{is_paid ? "تم الدفع" : "لم يتم الدفع"}</span>
              </td>
            </tr>
            {invoice_number && !feesList?.length && (
              <>
                <tr>
                  <td>رقم الفاتورة</td>
                  <td>{convertToArabic(invoice_number)} </td>
                </tr>
                <tr>
                  <td>تاريخ الفاتورة</td>
                  <td>{convertToArabic(invoice_date)} هـ</td>
                </tr>
              </>
            )}
            {!invoice_number && feesList?.length && (
              <tr>
                <td>الفواتير</td>
                <td>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>رقم الفاتورة</th>
                        <th>تاريخ الفاتورة</th>
                        <th>قيمة الفاتورة</th>
                        <th>حالة الدفع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feesList.map((invoice) => {
                        return (
                          <tr>
                            <td>
                              <span>
                                {convertToArabic(invoice.invoice_number)}
                              </span>
                            </td>
                            <td>
                              <span>
                                {convertToArabic(invoice.invoice_date)}
                              </span>
                            </td>
                            <td>
                              <span>{convertToArabic(invoice.fees)} ريال</span>
                            </td>
                            <td>
                              <span>
                                {invoice.is_paid ? "تم الدفع" : "لم يتم الدفع"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </td>
              </tr>
            )}
            {is_paid && (
              <tr>
                <td>طباعة الفاتورة</td>
                <td>
                  <button
                    className="btn add-btnT"
                    onClick={this.print.bind(this)}
                  >
                    طباعة
                  </button>
                </td>
              </tr>
            )}
            {/* {feesList?.length && feesValue && (
              <tr>
                <td>اجمالي الفواتير</td>
                <td>
                  {feesList?.length &&
                    convertToArabic(
                      ` ${CalculateTotalFees(
                        { feesValue, notes, feesList, is_paid },
                        false
                      )} ريال`
                    )}
                </td>
              </tr>
            )}
            {notes && (
              <tr>
                <td>ملاحظات الرسوم</td>
                <td>{convertToArabic(notes)}</td>
              </tr>
            )} */}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(feesInfo_addedparcels));
