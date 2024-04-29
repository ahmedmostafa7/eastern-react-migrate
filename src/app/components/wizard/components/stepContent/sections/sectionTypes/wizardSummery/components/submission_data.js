import React, { Component } from "react";
import {
  convertEnglishNotReverseToArabic,
  convertEnglishToArabic,
} from "../../../../../../modulesObjects/newPro/templates/helperFunctions";
import { convertToArabic } from "../../../../../../../inputs/fields/identify/Component/common/common_func";
export default class Mostafed extends Component {
  checkMo5tatUse(data) {
    let cases = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (
      data["mo5tat_use_private"] &&
      cases.some((e) => data["mo5tat_use_private"].includes(e))
    ) {
      return (
        data["mo5tat_use_private"].split(".")[1] ||
        data["mo5tat_use_government"].split(".")[1]
      );
    } else {
      return data["mo5tat_use_government"] || data["mo5tat_use_private"];
    }
  }
  convertEnglishNotReverseToArabic(english) {
    var arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (english == null || english == "") {
      return "";
    } else {
      var chars = english.split("");
      for (var i = 0; i < chars.length; i++) {
        if (/\d/.test(chars[i])) {
          chars[i] = arabicNumbers[chars[i]];
        }
      }
      let revesedChars = chars.join("");
      return revesedChars;
    }
  }
  convertEnglishToArabic(english, notreverse) {
    //
    var arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (english == null || english == "") {
      return "";
    } else {
      var chars = english.split("");
      for (var i = 0; i < chars.length; i++) {
        if (/\d/.test(chars[i])) {
          chars[i] = arabicNumbers[chars[i]];
        }
      }
      let revesedChars = chars.join("");
      if (notreverse) return revesedChars; //.split('/').reverse().join('/')
      return revesedChars.split("/").reverse().join("/");
    }
  }
  render() {
    let mostafed_data = this.props.mainObject.submission_data.mostafed_data;
    // let imgSrc = (ma7dar_mola5s && ma7dar_mola5s["attachment"]) || "";
    console.log("GG", this.props.mainObject);
    return (
      <>
        {mostafed_data && (
          <div>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td> نوع المستفيد</td>
                  <td>{mostafed_data["mostafed_type"]}</td>
                </tr>
                <tr>
                  <td> استعمال المخطط</td>
                  <td>{mostafed_data["mo5tat_use"]}</td>
                </tr>
                {mostafed_data["plan_type"] && (
                  <tr>
                    <td> نوع المخطط</td>
                    <td>
                      {(mostafed_data["plan_type"] == "2" &&
                        "تعديل على مخطط") ||
                        "مخطط جديد"}
                    </td>
                  </tr>
                )}
                <tr>
                  <td> رمز الاستخدام </td>
                  <td>{convertToArabic(mostafed_data["use_sumbol"])}</td>
                </tr>
                <tr>
                  <td>إعادة تنظيم المخطط</td>
                  <td>
                    {mostafed_data["e3adt_tanzem"] ? (
                      <span>
                        <i className="fa fa-check"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fa fa-times"></i>
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td> غير مرتبط بكروكي مساحي</td>
                  <td>
                    {mostafed_data["has_representer"] ? (
                      <span>
                        <i className="fa fa-check"></i>
                      </span>
                    ) : (
                      <span>
                        <i className="fa fa-times"></i>
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td> رقم المعاملة </td>
                  <td>{convertToArabic(mostafed_data["req_no"])}</td>
                </tr>
                <tr>
                  <td>تاريخ المعاملة </td>
                  <td style={{ direction: "ltr" }}>
                    {convertToArabic(mostafed_data["req_date"])}
                  </td>
                </tr>

                <tr>
                  <td>جهة الإصدار </td>
                  <td>{mostafed_data["req_location"]}</td>
                </tr>

                <tr>
                  <td> مسارات التنفيذ </td>
                  <td>
                    {mostafed_data["masarat"] == 1
                      ? "  المسار الاول :إعتماد إبتدائي وإفراغ متدرج "
                      : mostafed_data["masarat"] == 2
                      ? "المسار الثانى: الإعتماد الإبتدائي والنهائي قبل التنفيذ"
                      : "المسار الثالث: الإعتماد الإبتدائي والنهائي وبيع جميع القطع قبل التنفيذ"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
}
