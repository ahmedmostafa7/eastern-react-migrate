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
class afada_adle_statements extends Component {
  render() {
    let appId = localStorage.getItem("appId") == "16" ? true : false;

    let table_afada = get(
      this.props.mainObject[this.props.data.sectionName][
        this.props.data.sectionName
      ],
      "table_afada",
      []
    );

    let acceptedEfadaIndex = table_afada.length - 1;
    return (
      <>
        {table_afada && (
          <div>
            {table_afada
              // .filter((d) => d.efada_status != "1")
              .map((d, k) => {
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
                      header={convertToArabic(`افادة ${k + 1}`)}
                      forceRender={true}
                      style={{ margin: "5px" }}
                    >
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <td> حالة الإفادة</td>
                            <td>{d.efada_status}</td>
                          </tr>
                          <tr>
                            <td>رقم الخطاب </td>
                            <td>{convertToArabic(d.letter_number)}</td>
                          </tr>
                          <tr>
                            <td>تاريخ الإفادة</td>
                            <td style={{ direction: "ltr" }}>
                              {convertToArabic(d.letter_date)}
                            </td>
                          </tr>
                          <tr>
                            <td>نص الإفادة</td>
                            <td>{convertToArabic(d.efada_text)}</td>
                          </tr>
                          <tr>
                            <td>مرفق خطاب سريان مفعول الصك</td>
                            <td>
                              {checkImage(this.props, d.sak_efada, {
                                width: "100px",
                              })}
                            </td>
                          </tr>
                          <tr>
                            <td>مرفق الإفادة</td>
                            <td>
                              {checkImage(this.props, d.image_efada, {
                                width: "100px",
                              })}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Panel>
                  </Collapse>
                );
              })}
            {table_afada[acceptedEfadaIndex] && (
              <Collapse className="Collapse" defaultActiveKey={["0"]} key={0}>
                <Panel
                  header={convertToArabic(`الإفادة النهائية`)}
                  forceRender={true}
                  style={{ margin: "5px" }}
                >
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <td> حالة الإفادة</td>
                        <td>{table_afada[acceptedEfadaIndex].efada_status}</td>
                      </tr>
                      <tr>
                        <td>رقم الخطاب </td>
                        <td>
                          {convertToArabic(
                            table_afada[acceptedEfadaIndex].letter_number
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>تاريخ الإفادة</td>
                        <td style={{ direction: "ltr" }}>
                          {convertToArabic(
                            table_afada[acceptedEfadaIndex].letter_date
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>نص الإفادة</td>
                        <td>
                          {convertToArabic(
                            table_afada[acceptedEfadaIndex].efada_text
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>مرفق خطاب سريان مفعول الصك</td>
                        <td>
                          {checkImage(
                            this.props,
                            table_afada[acceptedEfadaIndex].sak_efada,
                            {
                              width: "100px",
                            }
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>مرفق الإفادة</td>
                        <td>
                          {checkImage(
                            this.props,
                            table_afada[acceptedEfadaIndex].image_efada,
                            {
                              width: "100px",
                            }
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Panel>
              </Collapse>
            )}
          </div>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(afada_adle_statements));
