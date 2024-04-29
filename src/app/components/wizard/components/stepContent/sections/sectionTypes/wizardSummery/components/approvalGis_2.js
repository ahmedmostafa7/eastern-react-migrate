import React, { Component } from "react";
import { host } from "imports/config";
export default class ApprovalConfirmGis extends Component {
  render() {
    const { notes_1 } = this.props.mainObject?.ApprovalGis_2;
    // const { ma7dar_mola5s } = this.props.mainObject.ma7dar || "";
    let imgSrc = notes_1?.attachment;
    console.log("GGx", notes_1);
    return (
      <>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>قرار مدير عام التخطيط العمراني على المعاملة</td>
                <td>
                  {notes_1["acceptOrReject"] == "1"
                    ? " موافق "
                    : "  غير موافق "}
                </td>
              </tr>
              <tr>
                <td>الملاحظات </td>
                <td>{notes_1.details ? notes_1.details : "بدون"}</td>
              </tr>
              <tr>
                <td>المرفقات</td>
                {imgSrc ? (
                  <td>
                    <a href={`${host}/${imgSrc}`} target="_blank">
                      الملف المرفق
                    </a>
                  </td>
                ) : (
                  <td>بدون</td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
