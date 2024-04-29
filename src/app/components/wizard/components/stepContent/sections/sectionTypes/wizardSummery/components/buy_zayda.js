import React, { Component } from "react";
import { printHost } from "imports/config";

import { backEndUrlforMap } from "imports/config";
import Axios from "axios";

export default class BuyZayda extends Component {
  zayda_buy(data, id) {
    const { mainObject } = this.props;

    // let newObj = Object.assign({}, mainObject, data);
    const url = "/Submission/SaveEdit";
    const params = { sub_id: id };
    window.open(printHost + `/#/addedparcel_temp6/${id}`, "_blank");
    // Axios.post(url, { mainObject, tempFile: {} }, { params }).then(() =>
    // );
  }
  render() {
    const { zayda_data } = this.props.mainObject.buy_zayda;
    let id = localStorage.getItem("id_submission");
    console.log("GG", this.props.mainObject);
    return (
      <div>
        <div style={{ marginTop: "30px" }}>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>{"عائدة الزائدة"}</td>
                <td>{zayda_data["zayda_3aada"]}</td>
              </tr>
              <tr>
                <td>{"منشأ الزائدة"}</td>
                <td>{zayda_data["zayda_mansh2"]}</td>
              </tr>
              <tr>
                <td>{"مدى ملائمة تلك الزائدة"}</td>
                <td>
                  {zayda_data["radio1"] == "2" ? "غير ملائمة" : " ملائمة "}
                </td>
                {zayda_data["text3"] && <td>{zayda_data["text3"]}</td>}
              </tr>
              <tr>
                <td>{"خلوها من الشوائب و المنازعات"}</td>
                <td>{zayda_data["radio2"] == "2" ? "لايوجد" : "يوجد "}</td>
                {zayda_data["text4"] && <td>{zayda_data["text4"]}</td>}
              </tr>
              <tr>
                <td>{"هل يمكن البناء عليها بشكل منفرد؟"}</td>
                <td>{zayda_data["radio3"] == "2" ? "لا" : "نعم"}</td>
                {zayda_data["text5"] && <td>{zayda_data["text5"]}</td>}
              </tr>
              <tr>
                <td>{"هل توجد منشأت قائمة عليها؟"}</td>
                <td>{zayda_data["radio4"] == "2" ? "لا" : "نعم"}</td>
                {zayda_data["text6"] && <td>{zayda_data["text6"]}</td>}
              </tr>
              <tr>
                <td>{" هل للزائدة استمرارية يمكن ان تكون تكملة لها؟"}</td>
                <td>{zayda_data["radio5"] == "2" ? "لا" : "نعم"}</td>
                {zayda_data["text7"] && <td>{zayda_data["text7"]}</td>}
              </tr>
              <tr>
                <td>
                  {
                    "هل المذكور هو المستفيد الوحيد من الزائدة وليس فى بيعها ضرر على احد ؟ "
                  }
                </td>
                <td>{zayda_data["radio6"] == "2" ? "لا" : "نعم"}</td>
                {zayda_data["text8"] && <td>{zayda_data["text8"]}</td>}
              </tr>
              <tr>
                <td>طباعة استمارة شراء الزائده</td>
                <td>
                  <button
                    className="btn btn-success print "
                    onClick={this.zayda_buy.bind(this, zayda_data, id)}
                  >
                    طباعة
                  </button>
                </td>
              </tr>
              {/* <tr>
                <td>الخدمات المتوفرة بالزائده</td>
                <td>{buy_zayda["services"].join("-")}</td>
                <td>
                  {buy_zayda["services"].includes("اخرى")
                    ? buy_zayda["other_services"]
                    : ""}
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
