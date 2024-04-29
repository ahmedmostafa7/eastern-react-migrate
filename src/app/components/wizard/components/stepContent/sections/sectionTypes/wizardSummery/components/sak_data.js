import React, { Component } from "react";
import { host, filesHost } from "imports/config";
import {
  convertToArabic,
  localizeNumber,
  remove_duplicate,
  checkImage,
  reformatWasekaData,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { Collapse } from "antd";
import { get } from "lodash";
const { Panel } = Collapse;
import axios from "axios";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
class Waseka extends Component {
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

  componentDidMount() {
    const { mainObject } = this.props;
    let {
      mainObject: {
        sakData: {
          sakData: { saks },
        },
      },
      currentModule,
    } = this.props;

    var ownerData =
      mainObject.ownerData &&
      mainObject.ownerData.ownerData.owners[
        Object.keys(mainObject.ownerData.ownerData.owners)[0]
      ];

    Object.values(saks)?.forEach((waseka) => {
      if (
        waseka.sakValid == undefined ||
        waseka.sakValid == null ||
        waseka.sakValid == ""
      ) {
        axios
          .get(window.host + "/api/contracts/IsVarifiedContract", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
            params: {
              id:
                ownerData &&
                (ownerData.ssn ||
                  ownerData.commercial_registeration ||
                  ownerData.code_regesteration),
              contractDate: waseka?.date?.split("/")?.join("-"),
              contractNo: waseka?.number,
            },
          })
          .then(
            (res) => {
              waseka.sakValid = res.data;
              this.setState({});
            },
            (res) => {
              waseka.sakValid = "لم يتم التأكد من سريان الصك";
              this.setState({});
            }
          );
      }
    });
  }

  render() {
    let appId = localStorage.getItem("appId") == "16" ? true : false;
    const {
      mainObject: {
        sakData: {
          sakData: { saks },
        },
      },
      currentModule,
    } = this.props;

    let waseka_table = (saks && Object.values(saks)) || [];

    return (
      <>
        {waseka_table && (
          <div>
            {waseka_table.map((d, k) => {
              return (
                <Collapse
                  className="Collapse"
                  defaultActiveKey={[
                    "0",
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    "6",
                    "7",
                    "8",
                    "9",
                  ]}
                  key={k}
                >
                  <Panel
                    header={`صك ${k + 1}`}
                    forceRender={true}
                    style={{ margin: "5px" }}
                  >
                    <table className="table table-bordered">
                      <tbody>
                        {d.lands && (
                          <tr>
                            <td> الارض المختارة</td>
                            <td>{convertToArabic(d.lands)}</td>
                          </tr>
                        )}
                        <tr>
                          <td>رقم وثيقة الملكية </td>
                          <td>{convertToArabic(d.number)}</td>
                        </tr>
                        <tr>
                          <td>تاريخ وثيقة الملكية</td>
                          <td style={{ direction: "ltr" }}>
                            {convertToArabic(d.date)}
                          </td>
                        </tr>
                        {d.issuer && (
                          <tr>
                            <td>جهة اصدار وثيقة الملكية</td>
                            <td>{d.issuer}</td>
                          </tr>
                        )}
                        <tr>
                          <td>المرفقات</td>
                          <td>
                            {/* <a href={`${filesHost}/${d.image_waseka}`} download>
                              <img
                                src={`${filesHost}/${d.image_waseka}`}
                                width="100px"
                              />
                            </a> */}
                            {checkImage(this.props, d.image, {
                              width: "100px",
                            })}
                          </td>
                        </tr>
                        {d.sakValid && (
                          <tr>
                            <td>التأكد من سريان مفعول الصك</td>
                            <td>{d.sakValid}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </Panel>
                </Collapse>
              );
            })}
          </div>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(Waseka));
