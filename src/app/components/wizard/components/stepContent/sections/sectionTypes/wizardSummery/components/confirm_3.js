import React, { Component } from "react";
import { host } from "configFiles/config";
export default class confirm_3 extends Component {
  render() {
    const { notes_2 } = this.props.mainObject.sellingConfirmation_3;
    const { ma7dar_mola5s } = this.props.mainObject.ma7dar || "";
    let imgSrc = (notes_2 && notes_2["attachment"]) || "";
    console.log("GG", notes_2);
    return (
      <>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td> الموافقة على بيع الزائدة</td>
                <td>
                  {notes_2["acceptOrReject"] == "1"
                    ? " يمكن بيعها"
                    : "  عدم بيعها"}
                </td>
              </tr>
              <tr>
                <td>التفاصيل </td>
                <td>{notes_2["details"]}</td>
              </tr>
              {/*<tr>
             <td>نسخة من محضر اللجنة الفنية</td>
             {imgSrc ?<td><a href={`${host}/${imgSrc}`}   target="_blank">الملف المرفق</a></td>:<td></td>}
           </tr>*/}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
