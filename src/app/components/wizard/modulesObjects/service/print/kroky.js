import React, { Component } from "react";
import {
  get_print_data_by_id,
  checkImage,
} from "app/components/inputs/fields/identify/Component/common/common_func";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import { convertToArabic } from "../../../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { get, map } from "lodash";
export default class Kroky extends Component {
  state = { data: [] };
  componentDidMount() {
    initializeSubmissionData(this.props.params.id).then((res) => {
      let mainObject = res.mainObject;
      let submissionData = res.submission;
      let committee_report_no = get(submissionData, "committee_report_no");
      this.setState({ committee_report_no });
      console.log("data_print", mainObject, submissionData);
      this.setPrintValues(mainObject, submissionData);
    });
  }
  setPrintValues(mainObject, submissionData) {
    console.log("conditions", mainObject, submissionData);
    // let data_table = mainObject?.serviceSubmissionType?.data_table;
    var owner =
      mainObject.ownerData &&
      mainObject.ownerData.ownerData.owners[
        Object.keys(mainObject.ownerData.ownerData.owners)[0]
      ];
    var ownerdesc = "";
    var kind = "";
    if (owner) {
      if (owner.ssn) {
        ownerdesc = "المواطن / " + owner.name;
      } else if (owner.commercial_registeration) {
        ownerdesc = "الشركة / " + owner.name;
      } else if (owner.code_regesteration) {
        ownerdesc = "الجهة / " + owner.name;
      }

      if (owner.ssn) {
        kind = "المواطن "; //"/ " + owner.name;
      } else if (owner.commercial_registeration) {
        kind = "الشركة "; // + owner.name;
      } else if (owner.code_regesteration) {
        kind = "الجهة "; //+ owner.name;
      }
    }
    let city =
      mainObject.LandWithCoordinate.landData.lands.parcels[0].attributes
        .MUNICIPALITY_NAME;
    let plan_no =
      mainObject.LandWithCoordinate.landData.lands.parcels[0].attributes
        .PLAN_NO;
    let district_name =
      mainObject.LandWithCoordinate.landData.lands.parcels[0].attributes
        .DISTRICT_NAME;
    let parcel_no = mainObject.LandWithCoordinate.landData.lands.parcels
      .map((parcel) => parcel.attributes.PARCEL_PLAN_NO)
      .join(" - ");
    let LandWithCoordinate = mainObject?.LandWithCoordinate;

    this.setState({
      // data_table,
      ownerdesc,
      city,
      plan_no,
      district_name,
      parcel_no,
      LandWithCoordinate,
    });

    // this.setState({ LandWithCoordinate });
  }
  render() {
    let {
      // data_table,
      ownerdesc = "",
      city = "",
      plan_no = "",
      district_name = "",
      parcel_no = "",
      LandWithCoordinate,
    } = this.state;
    return (
      <>
        <div>
          <button
            className="btn add-btnT printBtn"
            onClick={() => {
              window.print();
            }}
          >
            طباعة
          </button>
        </div>
        <div
          className="table-report-container"
          style={{ margin: "10px", padding: "10px" }}
        >
          <h2
            style={{
              fontWeight: "bold",
              textDecoration: "underline",
              textAlign: "center",
            }}
          >
            استمارة تحديد كروكي الموقع
          </h2>
          <table
            className="table table-bordered table_conditons"
            style={{ marginBottom: 0 }}
          >
            <tbody>
              <tr>
                <td>اسم المالك</td>
                <td colSpan="3">{ownerdesc}</td>
              </tr>
              <tr>
                <td>المدينة / البلدية</td>
                <td>{city}</td>
                <td>رقم المخطط</td>
                <td>{convertToArabic(plan_no)}</td>
              </tr>
              <tr>
                <td>اسم الحي</td>
                <td>{district_name}</td>
                <td>أرقام قطع الأراضي</td>
                <td>{convertToArabic(parcel_no)}</td>
              </tr>
            </tbody>
          </table>
          <div>
            <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                textAlign: "right",
              }}
            >
              كروكي الموقع :
            </p>
            <div>
              {checkImage(
                this.props,
                LandWithCoordinate?.landData?.lands.screenshotURL,
                {}
              )}
            </div>
          </div>
          <div>
            <p
              style={{
                fontWeight: "bold",
                textDecoration: "underline",
                textAlign: "right",
                marginTop: "20px",
              }}
            >
              كروكي الموقع العام :
            </p>
            <div>
              {checkImage(
                this.props,
                LandWithCoordinate?.landData?.public_Image,
                {}
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}
