import React, { Component } from "react";
import {
  convertToArabic,
  checkImage,
  reformatDateTime,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
// import { Modal } from "antd";
import { get, isEmpty, map, omit } from "lodash";
import { Popover, Icon, Modal } from "antd";
import { host } from "imports/config";
export default class printCreate extends Component {
  state = { OpenModal: false };
  render() {
    const { printCreate } = this.props.mainObject.printCreate;
    const { user } = this.props.mainObject.printCreate;
    let { currentDate } = this.props.mainObject;
    let date = this.props.mainObject?.currentDate?.split(" ")[0];
    let time = this.props.mainObject?.currentDate?.split(" ")[1];
    // " " + currentDate.split(" ")[2];
    let imgSrc = printCreate?.attachemnts;
    let comment = printCreate?.comment;
    let imgSrcCreate = printCreate?.attachment_print_create;
    console.log("printCreate", this.props.mainObject);
    return (
      <>
        <div>
          {/* <Modal
            title={"بيانات المستخدم"}
            visible={this.state.OpenModal}
            onCancel={() => {
              this.setState({ OpenModal: false });
            }}
            footer={null}
            cancelText="اغلاق"
          >
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>اسم المستخدم</td>
                  <td>{user?.name}</td>
                </tr>
                <tr>
                  <td>رقم الهاتف</td>
                  <td>{user?.phone}</td>
                </tr>
                <tr>
                  <td>رقم الجوال</td>

                  <td>{user?.mobile}</td>
                </tr>
                <tr>
                  <td>البريد الالكترونى</td>
                  <td>{user?.email}</td>
                </tr>
              </tbody>
            </table>
          </Modal> */}
          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <td>اسم المستخدم</td>

                <td>
                  {/* {user?.name}

                  <button
                    onClick={() => {
                      this.setState({ OpenModal: true });
                    }}
                    className="btn btn-warning"
                  >
                    بيانات المستخدم
                  </button> */}
                  {(!isEmpty(
                    get(
                      this.props?.user,
                      "engcompany_id",
                      get(user, "engcompany_id", "")
                    )
                  ) && (
                    <Popover
                      placement={"bottom"}
                      content={
                        <table
                          className="table table-bordered"
                          style={{ direction: "rtl" }}
                        >
                          <tbody>
                            <tr>
                              <td>اسم المستخدم</td>
                              <td>{get(user, "name", "")}</td>
                            </tr>
                            <tr>
                              <td>رقم الهاتف</td>
                              <td>{get(user, "phone", "")}</td>
                            </tr>
                            <tr>
                              <td>رقم الجوال</td>
                              <td>{get(user, "mobile", "")}</td>
                            </tr>
                            <tr>
                              <td>البريد الالكترونى</td>
                              <td>{get(user, "email", "")}</td>
                            </tr>
                          </tbody>
                        </table>
                      }
                      trigger="hover"
                    >
                      <span className="pl-3">
                        <span className="pl-3">{user?.name}</span>
                        <img
                          style={{ width: "auto", height: "30px" }}
                          src="images/avatarImg.png"
                          className="img-fluid pl-3"
                          alt="userPhoto"
                        />
                      </span>
                    </Popover>
                  )) || (
                    <span className="pl-3">
                      <span className="pl-3">{user?.name}</span>
                      <img
                        style={{ width: "auto", height: "30px" }}
                        src="images/avatarImg.png"
                        className="img-fluid pl-3"
                        alt="userPhoto"
                      />
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td>تاريخ الملاحظات</td>
                <td>
                  {currentDate &&
                    reformatDateTime(this.props.mainObject, "currentDate")}
                </td>
              </tr>
              {comment && (
                <tr>
                  <td>الملاحظات</td>
                  <td>{comment}</td>
                </tr>
              )}
              <tr>
                <td>المرفقات</td>
                <td style={{ display: "flex" }}>
                  {imgSrc && imgSrc.length > 0
                    ? imgSrc.map((d, k) => {
                        return (
                          <div key={k}>
                            {d.includes(".pdf") ? (
                              <a
                                href={window.filesHost + `${d}`}
                                target="_blank"
                              >
                                <img
                                  src="images/pdf.png"
                                  width="50px"
                                  height="50px"
                                />
                              </a>
                            ) : d.includes(".dwg") ? (
                              <a
                                href={window.filesHost + `${d}`}
                                target="_blank"
                              >
                                <img
                                  src="images/cad.png"
                                  width="50px"
                                  height="50px"
                                />
                              </a>
                            ) : (
                              <a
                                href={window.filesHost + `${d}`}
                                target="_blank"
                              >
                                <img
                                  src={window.filesHost + `${d}`}
                                  width="50px"
                                  height="50px"
                                />
                              </a>
                              // remove_duplicate(d)
                            )}
                          </div>
                        );
                      })
                    : "لا يوجد"}
                </td>
              </tr>

              <tr>
                <td>نسخة من محضر اللجنة الفنية</td>
                {imgSrcCreate ? (
                  <td>
                    <a
                      href={window.filesHost + `${imgSrcCreate}`}
                      target="_blank"
                    >
                      محضر اللجنة الفنية
                    </a>
                  </td>
                ) : (
                  <td></td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
