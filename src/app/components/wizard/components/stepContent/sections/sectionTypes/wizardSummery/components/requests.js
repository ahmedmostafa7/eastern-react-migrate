import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import { Icon } from "antd";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { get, isEmpty } from "lodash";
import {
  convertToArabic,
  remove_duplicate,
  checkImage,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";

class Requests extends Component {
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
    let requests = this.props.mainObject.requests.attachments.table_attachments;
    let filteredRequests = requests.filter((d) => d.date);
    // let imgSrc = (ma7dar_mola5s && ma7dar_mola5s["attachment"]) || "";
    let attachmentsFiles = this.props.mainObject.requests.requests;
    console.log("GG", requests, filteredRequests);
    return (
      <>
        {requests && (
          <div>
            <table className="table table-bordered">
              <thead>
                <th>نوع المرفق</th>
                <th>الرقم </th>
                <th>التاريخ</th>
                <th>المرفقات</th>
              </thead>
              <tbody>
                {filteredRequests.map((d, k) => {
                  return (
                    <tr key={k}>
                      <td>{this.props.t(d.name)}</td>
                      <td>{this.convertEnglishToArabic(d.number)}</td>
                      <td>{convertToArabic(d.date)}</td>

                      <td>
                        {checkImage(this.props, d.image_motlbat, {
                          width: "100px",
                        })}
                      </td>
                    </tr>
                  );
                })}
                <tr>
                  <td>صورة من الفكرة التخطيطية للمخططات المجاورة </td>
                  <td>
                    {checkImage(
                      this.props,
                      attachmentsFiles["attachment_img"],
                      {
                        width: "80px",
                        height: "80px",
                      }
                    )}
                  </td>
                </tr>
                <tr>
                  <td>ملف الكاد من الفكرة التخطيطية للمخططات المجاورة </td>
                  <td>
                    {checkImage(
                      this.props,
                      attachmentsFiles["attachment_cad"],
                      {
                        width: "100px",
                      }
                    )}
                  </td>
                </tr>
                {!isEmpty(attachmentsFiles["service_domains"]) && (
                  <tr>
                    <td>نطاقات التخديم</td>
                    <td>
                      {checkImage(
                        this.props,
                        attachmentsFiles["service_domains"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
                {!isEmpty(attachmentsFiles["m7dar_papers_delivery"]) && (
                  <tr>
                    <td>محضر تسليم أوراق المعاملة</td>
                    <td>
                      {checkImage(
                        this.props,
                        attachmentsFiles["m7dar_papers_delivery"],
                        {
                          width: "100px",
                        }
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(Requests));
