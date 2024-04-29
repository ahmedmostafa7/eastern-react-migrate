import React, { Component } from "react";
import { get, isEmpty, map } from "lodash";
import ShowField from "app/helpers/components/show";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { Popover, Icon, Modal } from "antd";
import {
  checkImage,
  localizeNumber,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
class Approval extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      Approval: { Approval, user },
      currentDate,
    } = this.props.mainObject;

    return (
      <table className="table table-bordered">
        <tr>
          <td>اسم المعمم</td>
          <td>
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
                  <span className="pl-3">{get(user, "name", "")}</span>
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
                <span className="pl-3">{get(user, "name", "")}</span>
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
        {currentDate && (
          <tr>
            <td>تاريخ التعميم</td>
            <td>
              {localizeNumber(currentDate)
                .replace("AM", "ص")
                .replace("PM", "م")
                .replaceAll("-", "/")}
            </td>
          </tr>
        )}
        <tr>
          <td>محتوى التعميم</td>
          <td>{Approval["remark"]}</td>
        </tr>
        <tr>
          <td>مرفقات التعميم</td>
          <td>
            {checkImage(this.props, Approval["image"], {
              width: "100px",
            })}
          </td>
        </tr>
      </table>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(Approval));
