import React, { Component } from "react";
import {
  backEndUrlforMap,
  host,
} from "../../../../../../../../../imports/config";
import { moment } from "moment-hijri";
import { Popover, Icon, Modal } from "antd";
import { get, isEmpty } from "lodash";
import {
  convertToArabic,
  checkImage,
  localizeNumber,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
class confirm_3 extends Component {
  state = { OpenModal: false };
  render() {
    let notes = this.props.mainObject.remarks;
    // const { user } = this.props.mainObject.Takdem.user;
    // att.split
    console.log("GG", notes);
    return (
      <>
        <Modal
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
                <td>
                  {(get(this.props.user, "engcompany_id", "") &&
                    "اسم الإدارة") ||
                    "اسم المستخدم"}
                </td>
                <td>{get(notes, "user.name", "")}</td>
              </tr>
              <tr>
                <td>رقم الهاتف</td>
                <td>{get(notes, "user.phone", "")}</td>
              </tr>
              <tr>
                <td>رقم الجوال</td>
                <td>{get(notes, "user.mobile", "")}</td>
              </tr>
              <tr>
                <td>البريد الالكترونى</td>
                <td>{get(notes, "user.email", "")}</td>
              </tr>
            </tbody>
          </table>
        </Modal>
        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>
                  {(get(this.props.user, "engcompany_id", "") &&
                    "اسم الإدارة") ||
                    "اسم المستخدم"}
                </td>
                <td>
                  {/*<button
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
                      get(notes, "user.engcompany_id", "")
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
                              <td>
                                {(get(this.props.user, "engcompany_id", "") &&
                                  "اسم الإدارة") ||
                                  "اسم المستخدم"}
                              </td>
                              <td>{get(notes, "user.name", "")}</td>
                            </tr>
                            <tr>
                              <td>رقم الهاتف</td>
                              <td>{get(notes, "user.phone", "")}</td>
                            </tr>
                            <tr>
                              <td>رقم الجوال</td>
                              <td>{get(notes, "user.mobile", "")}</td>
                            </tr>
                            <tr>
                              <td>البريد الالكترونى</td>
                              <td>{get(notes, "user.email", "")}</td>
                            </tr>
                          </tbody>
                        </table>
                      }
                      trigger="hover"
                    >
                      <span className="pl-3">
                        <span className="pl-3">
                          {get(notes, "user.name", "")}
                        </span>
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
                      <span className="pl-3">
                        {get(notes, "user.name", "")}
                      </span>
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
                {localizeNumber(notes.date + "  " + (notes.time || ""))
                  .replace("AM", "ص")
                  .replace("PM", "م")}
                {/* <td>{moment().format("iYYYY-iMM-iDD")}</td> */}
              </tr>
              <tr>
                <td>الملاحظات </td>
                <td>{notes.comment}</td>
              </tr>
              {notes.attachments && (
                <tr>
                  <td>المرفقات </td>
                  <td>
                    <div style={{ display: "flex" }}>
                      {checkImage(this.props, this.props.notes.attachments, {
                        width: "80px",
                        height: "100px",
                        padding: "10px",
                        cursor: "pointer",
                      })}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(confirm_3));
