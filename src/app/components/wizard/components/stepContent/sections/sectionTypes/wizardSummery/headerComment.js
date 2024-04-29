import React, { Component } from "react";
import { get, isEmpty } from "lodash";
import { filesHost } from "../../../../../../../../imports/config";
import { Popover, Icon, Modal } from "antd";
import {
  convertToArabic,
  checkImage,
} from "../../../../../../inputs/fields/identify/Component/common/common_func";
export default class Header extends Component {
  render() {
    const { comment, user } = this.props;
    let userImage = get(comment, "user.image", "");
    return (
      <>
        <div
          style={{
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h6> {get(comment, "user.departments.name", "")}</h6>
          <h6>
            {convertToArabic(
              get(comment, "currentDate", "").replaceAll("-", "/")
            )}
          </h6>
        </div>

        <div style={{ display: "flex", padding: "10px 0 5px 0" }}>
          <img
            style={{ width: "auto", height: "30px" }}
            src={`${filesHost}/${userImage}`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = "images/avatarImg.png";
            }}
            className="img-fluid pl-2"
            alt="userPhoto"
          />
          {(!isEmpty(get(this.props?.user, "engcompany_id", get(comment, "user.engcompany_id", ""))) && (
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
                      <td>{get(comment, "user.name", "")}</td>
                    </tr>
                    <tr>
                      <td>رقم الهاتف</td>
                      <td>{get(comment, "user.phone", "")}</td>
                    </tr>
                    <tr>
                      <td>رقم الجوال</td>
                      <td>{get(comment, "user.mobile", "")}</td>
                    </tr>
                    <tr>
                      <td>البريد الالكترونى</td>
                      <td>{get(comment, "user.email", "")}</td>
                    </tr>
                  </tbody>
                </table>
              }
              trigger="hover"
            >
              <span className="pl-2">
                {get(comment, "user.name", user.name)}
              </span>
              <i className="fa fa-exclamation-circle"></i>
            </Popover>
          )) || (
            <>
              <span className="pl-2">
                {get(comment, "user.name", user.name)}
              </span>
              <i className="fa fa-exclamation-circle"></i>
            </>
          )}
        </div>
      </>
    );
  }
}
