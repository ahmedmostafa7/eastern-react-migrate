import React, { Component } from "react";
import { host } from "imports/config";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { followUp } from "../../../../../../../../../apps/modules/tabs/tableActionFunctions";
import moment from "moment-hijri";
import { postItem } from "../../../../../../../../helpers/apiMethods";
class Karar_amin extends Component {
  print() {
    const {
      currentModule: { record },
    } = this.props;

    followUp({ id: record.id }, 0, {}, null, false, this.props).then((res) => {
      let aminStep = null;

      if (record.app_id == 16) {
        let primaryApprovalIndex = res?.prevSteps?.findLastIndex(
          (step) => [2326, 3107].indexOf(step.prevStep.id) != -1
        );

        let aminSignPrimaryApprovalIndex = res?.prevSteps?.findLastIndex(
          (step) => [2851, 3112].indexOf(step.prevStep.id) != -1
        );

        let finalApprovalIndex = res?.prevSteps?.findLastIndex(
          (step) => [2372, 2330, 3119].indexOf(step.prevStep.id) != -1
        );

        if (
          aminSignPrimaryApprovalIndex > primaryApprovalIndex &&
          (finalApprovalIndex == -1 ||
            (finalApprovalIndex > -1 &&
              finalApprovalIndex > aminSignPrimaryApprovalIndex))
        ) {
          aminStep = res?.prevSteps?.[aminSignPrimaryApprovalIndex];
        }
      } else if (record.app_id == 22) {
        let aminSignAddedParcelIndex = res?.prevSteps?.findLastIndex(
          (step) => [2856, 2859, 3011, 3013].indexOf(step.prevStep.id) != -1
        );
        aminStep = res?.prevSteps?.[aminSignAddedParcelIndex];
      }

      // let aminStep =
      //   res?.prevSteps?.[
      //     res?.prevSteps?.findLastIndex(
      //       (step) => step?.name?.indexOf("أمين المنطقة الشرقية") != -1
      //     )
      //   ];

      let mainObject = this.props["mainObject"];
      let hijDate =
        // mainObject["krar_amin"]?.karar_amin_date ||
        aminStep?.date || moment().format("iYYYY/iM/iD");

      mainObject["krar_amin"] = {
        karar_amin_date: hijDate,
      };

      mainObject["karar_amin_date"] = hijDate;
      const url = "/Submission/SaveEdit";
      const params = { sub_id: record.id };
      delete mainObject.temp;

      postItem(
        url,
        {
          mainObject: window.lzString.compressToBase64(
            JSON.stringify({ ...mainObject })
          ),
          tempFile: {},
        },
        { params }
      ).then(() => {
        let id = record.id;
        window.open(printHost + `/#/addedparcel_temp1/${id}`, "_blank");
      });
    });
  }
  render() {
    const { karar_amin } = this.props.mainObject.krar_amin;
    const { karar_amin_date } = this.props.mainObject;
    let imgSrc = (karar_amin && karar_amin["attachment"]) || "";
    let karar_num = localStorage.getItem("req_no");
    console.log("GG", this.props.mainObject);
    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <td>رقم القرار</td>
              <td>{karar_num}</td>
            </tr>
            <tr>
              <td>تاريخ القرار</td>
              <td>{karar_amin_date}</td>
            </tr>
            {imgSrc && (
              <tr>
                <td>نسخة من قرار معالي الأمين</td>
                {imgSrc ? (
                  <td>
                    <a href={window.filesHost + `${imgSrc}`} target="_blank">
                      الملف المرفق
                    </a>
                  </td>
                ) : (
                  <td></td>
                )}
              </tr>
            )}
            <tr>
              <td>طباعة قرار معالي الأمين</td>
              <td>
                <button
                  className="btn add-btnT"
                  onClick={this.print.bind(this)}
                >
                  طباعة
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(Karar_amin));
