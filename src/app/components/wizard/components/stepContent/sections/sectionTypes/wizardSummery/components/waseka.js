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
        waseka: { waseka },
      },
      currentModule,
    } = this.props;

    var ownerData =
      mainObject.ownerData &&
      mainObject.ownerData.ownerData.owners[
        Object.keys(mainObject.ownerData.ownerData.owners)[0]
      ];

    (waseka?.table_waseka_fullList || waseka?.table_waseka)?.forEach(
      (waseka) => {
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
                contractDate: waseka?.date_waseka?.split("/")?.join("-"),
                contractNo: waseka?.number_waseka,
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
      }
    );
  }

  render() {
    let appId = localStorage.getItem("appId") == "16" ? true : false;
    const {
      mainObject: {
        waseka: { waseka },
      },
      currentModule,
    } = this.props;
    let waseka_table =
      (this.props.currentModule.record.app_id == 16 &&
        reformatWasekaData(
          this.props,
          waseka?.table_waseka_fullList || waseka?.table_waseka
        )) ||
      waseka?.table_waseka_fullList ||
      waseka?.table_waseka;

    let wasekaImage = [];
    if (waseka.image) {
      wasekaImage.unshift(waseka.image[0]);
    }
    if (localStorage.getItem("appId") == "14" && waseka.kroky_image) {
      wasekaImage.unshift(waseka.kroky_image[0]);
    }

    // let attachmentsFiles = this.props.mainObject.requests.requests;
    console.log("GG", waseka);

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
                    header={convertToArabic(`صك ${k + 1}`)}
                    forceRender={true}
                    style={{ margin: "5px" }}
                  >
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <td> الارض المختارة</td>
                          <td>
                            {(d.selectedLands &&
                              localizeNumber(d.selectedLands)) ||
                              (waseka[0] && localizeNumber(waseka[0])) ||
                              localizeNumber(
                                this.props.mainObject.waseka.selectedLands[0]
                              )}
                          </td>
                        </tr>
                        <tr>
                          {((!d.mlkya_type ||
                            ["1", "2"].indexOf(d.mlkya_type) != -1) && (
                            <td>رقم وثيقة الملكية </td>
                          )) ||
                            (d.mlkya_type == "3" && (
                              <td>رقم القرار الوزاري </td>
                            )) ||
                            (d.mlkya_type == "4" && (
                              <td>رقم قرار نزع الملكية </td>
                            ))}
                          <td>{convertToArabic(d.number_waseka)}</td>
                        </tr>
                        <tr>
                          {((!d.mlkya_type ||
                            ["1", "2"].indexOf(d.mlkya_type) != -1) && (
                            <td>تاريخ وثيقة الملكية</td>
                          )) ||
                            (d.mlkya_type == "3" && (
                              <td>تاريخ القرار الوزاري </td>
                            )) ||
                            (d.mlkya_type == "4" && (
                              <td>تاريخ قرار نزع الملكية </td>
                            ))}

                          <td style={{ direction: "ltr" }}>
                            {convertToArabic(d.date_waseka)}
                          </td>
                        </tr>
                        {[1, 2].indexOf(d.mlkya_type) != -1 &&
                          d.waseka_search && (
                            <tr>
                              <td>جهة اصدار وثيقة الملكية</td>
                              <td>{d.waseka_search}</td>
                            </tr>
                          )}
                        {appId && (
                          <tr>
                            <td>نوع وثيقة الملكية</td>
                            <td>
                              {d.mlkya_type == 1
                                ? "صك ملكية"
                                : d.mlkya_type == 3
                                ? "قرار وزاري"
                                : d.mlkya_type == 4
                                ? "قرار نزع ملكية"
                                : "اخرى"}
                            </td>
                          </tr>
                        )}
                        {d.name_waseka && (
                          <tr>
                            <td>اسم وثيقة الملكية </td>
                            <td>{d.name_waseka}</td>
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
                            {checkImage(this.props, d.image_waseka, {
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

        {wasekaImage.length > 0 && (
          <Collapse className="Collapse" defaultActiveKey={["0"]} key={0}>
            <Panel
              header={`مرفقات الصك`}
              forceRender={true}
              style={{ margin: "5px" }}
            >
              <table className="table table-bordered">
                <tr>
                  <td>صورة الصك</td>
                  <td>
                    {checkImage(this.props, wasekaImage, {
                      width: "500px",
                      height: "400px",
                    })}
                  </td>
                </tr>
              </table>
            </Panel>
          </Collapse>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(Waseka));
