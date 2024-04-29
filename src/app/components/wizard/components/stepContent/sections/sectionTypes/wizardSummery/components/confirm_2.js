import React, { Component } from "react";
import { host } from "configFiles/config";
export default class confirm_2 extends Component {
  render() {
    const { notes_1 } = this.props.mainObject.sellingConfirmation_2;
    // const { ma7dar_mola5s } = this.props.mainObject.ma7dar||"";
    // let imgSrc=(notes_1&&notes_1['attachment'])||''
    console.log("GGx", notes_1);
    return (
      <>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td> الموافقة على بيع الزائدة</td>
                <td>
                  {notes_1["acceptOrReject"] == "1"
                    ? " يمكن بيعها"
                    : "  عدم بيعها"}
                </td>
              </tr>
              <tr>
                <td>التفاصيل </td>
                <td>{notes_1["details"]}</td>
              </tr>
              {/* <tr>
             <td>المرفقات</td>
             {imgSrc ?<td><a href={`${host}/${imgSrc}`}   target="_blank">الملف المرفق</a></td>:<td></td>}
           </tr> */}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
