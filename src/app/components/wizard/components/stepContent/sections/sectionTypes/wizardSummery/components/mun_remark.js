import React, { Component } from "react";
import {
  backEndUrlforMap,
  host,
} from "../../../../../../../../../imports/config";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import {
  convertToArabic,
  remove_duplicate,
  checkImage,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { moment } from "moment-hijri";
import { Popover, Icon, Modal } from "antd";
import { get, isEmpty, map } from "lodash";

class mun_remark extends Component {
  state = { OpenModal: false };
  render() {
    const { user } = this.props.mainObject.mun_remark;
    const { comment, files } = this.props.mainObject.mun_remark.mun_remark;

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
        </Modal>

        <div>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>اسم المستخدم</td>

                <td>
                  {/* <button
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
                        <span className="pl-3"> {get(user, "name", "")}</span>
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
                      <span className="pl-3"> {get(user, "name", "")}</span>
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
                <td>الملاحظات </td>
                <td>{convertToArabic(comment)}</td>
              </tr>
              {files && (
                <tr>
                  <td>نسخة من اعتماد حالة الأرض</td>
                  <td>
                    <div style={{ display: "flex" }}>
                      {checkImage(this.props, files, {
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
)(withTranslation("labels")(mun_remark));
