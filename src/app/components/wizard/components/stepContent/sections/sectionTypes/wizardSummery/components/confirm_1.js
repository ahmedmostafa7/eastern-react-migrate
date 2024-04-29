import React, { Component } from "react";
import { host } from "configFiles/config";
export default class confirm extends Component {
  render() {
    const { notes } = this.props.mainObject.sellingConfirmation;
    const { ma7dar_mola5s } = this.props.mainObject.ma7dar || "";
    let imgSrc = (notes && notes["attachment"]) || "";
    console.log("GGx", notes);
    return (
      <>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td> الموافقة على بيع الزائدة</td>
                <td>
                  {notes["acceptOrReject"] == "1"
                    ? " يمكن بيعها"
                    : "  عدم بيعها"}
                </td>
              </tr>
              <tr>
                <td>التفاصيل </td>
                <td>{notes["details"]}</td>
              </tr>
              <tr>
                <td>
                  تم التحقق من خصم مساحة الشطفة من مساحة الزائدة التنظيمية (إن
                  وجدت)
                </td>
                {
                  <td>
                    <input
                      type={"checkbox"}
                      checked={notes.shatfa_check}
                      disabled
                    ></input>
                  </td>
                }
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
