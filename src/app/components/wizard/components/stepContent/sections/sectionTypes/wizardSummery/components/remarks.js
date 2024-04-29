import React, { Component } from "react";
import { get, isEmpty, map, omit } from "lodash";
import ShowField from "app/helpers/components/show";
import Comment from "app/helpers/modules/comment";
import Notes from "./remarks_summary";
import { Popover, Icon, Modal } from "antd";
import { filesHost } from "../../../../../../../../../imports/config";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import {
  convertToArabic,
  localizeNumber,
  remove_duplicate,
  checkImage,
  reformatDateTime,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";

// delete fields.attachments;
class remarks extends Component {
  state = { OpenModal: false };
  constructor(props) {
    super(props);

    this.fields = {
      step_name: {
        label: "Step Name",
        name: "step.name",
      },
      name: {
        label:
          (get(props.user, "engcompany_id", "") && "اسم الإدارة") ||
          "اسم المستخدم",
        name:
          (get(props.user, "engcompany_id", "") && "user.departments.name") ||
          "user.name",
      },
      date: {
        label: "date",
        name: "date",
      },
      // attachments: {
      //   label: "Attachments",
      //   name: "attachments",
      // },

      ...Comment.sections.comment.fields,
    };
  }

  convertEnglishToArabic(english, notreverse) {
    //
    var arabicNumbers = ["۰", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (english == null || english == "") {
      return "";
    } else {
      english = english.toString();
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

  renderInfo = (data, field, key) => {
    console.log(key, data);

    if (
      (!field?.permission?.show_match_value_mod[0] ||
        (field?.permission?.show_match_value_mod[0] &&
          field?.permission?.show_match_value_mod[0] ==
            +localStorage.getItem("module_id"))) &&
      (!field?.permission?.show_every ||
        (field?.permission?.show_every &&
          data[field?.permission?.show_every[0]]))
    ) {
      return (
        <ShowField
          field={field}
          val={(key == "date" && reformatDateTime(data, key)) || get(data, key)}
          key={key}
        />
      );
    }
  };
  ButtonModal = (data) => {
    return (
      // <button
      //   className="btn btn-warning"
      //   onClick={() => {
      //     this.setState({ OpenModal: true });
      //   }}
      // >
      //   بيانات المستخدم
      // </button>
      (!isEmpty(
        get(
          this.props?.user,
          "engcompany_id",
          get(data, "user.engcompany_id", "")
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
                  <td>
                    {(get(this.props.user, "engcompany_id", "") &&
                      get(data, "user.departments.name", "")) ||
                      get(data, "user.name", "")}
                  </td>
                </tr>
                <tr>
                  <td>رقم الهاتف</td>
                  <td>{get(data, "user.phone", "")}</td>
                </tr>
                <tr>
                  <td>رقم الجوال</td>
                  <td>{get(data, "user.mobile", "")}</td>
                </tr>
                <tr>
                  <td>البريد الالكترونى</td>
                  <td>{get(data, "user.email", "")}</td>
                </tr>
              </tbody>
            </table>
          }
          trigger="hover"
        >
          <span className="pl-3">
            <span className="pl-3">
              {" "}
              {(get(this.props.user, "engcompany_id", "") &&
                get(data, "user.departments.name", "")) ||
                get(data, "user.name", "")}
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
            {" "}
            {(get(this.props.user, "engcompany_id", "") &&
              get(data, "user.departments.name", "")) ||
              get(data, "user.name", "")}
          </span>
          <img
            style={{ width: "auto", height: "30px" }}
            src="images/avatarImg.png"
            className="img-fluid pl-3"
            alt="userPhoto"
          />
        </span>
      )
    );
  };
  render() {
    ////
    let { data, isEmpty } = this.props;
    // let imgs = get(data, "attachments.0.data", []);
    // let dateTime =
    //   get(data, "date", "").length > 0 && get(data, "date", "").includes(",")
    //     ? get(data, "date", "").split(",")[0]
    //     : get(data, "date", "").split(" ")[0];
    // let time =
    //   get(data, "date", "").length > 0 && get(data, "date", "").includes(",")
    //     ? get(data, "date", "").split(",")[1]
    //     : get(data, "date", "").split(" ")[2];
    data = {
      ...data,
      attachemnts: data.attachemnts && data.attachemnts,
      step_name: get(data, "step.name"),
      // date: (
      //   <div>
      //     {data.date ? (
      //       <div style={{ display: "flex" }}>
      //         <p style={{ order: "2", marginRight: "10px" }}>
      //           {localizeNumber(
      //             get(data, "date", "").replace("AM", "ص").replace("PM", "م")
      //           )}
      //         </p>
      //       </div>
      //     ) : (
      //       <span></span>
      //     )}
      //     {/* {this.ButtonModal()} */}
      //   </div>
      // ),
      name: <div>{this.ButtonModal(data)}</div>,
    };
    console.log(data, this.fields);
    let checkField = {
      field: "radio",
      hideLabel: false,
      initValue: "1",
      label: "موقف المدقق من الرفع المساحي",
      options: {
        accept: { label: " مقبول", value: "1" },
        reject: { label: "مرفوض ", value: "2" },
      },
      required: true,
    };
    if (data["step_name"] !== "مراجعة و إعتماد المخطط مساحيا") {
      this.fields = omit(this.fields, ["check_plan_approval"]);
    } else {
      this.fields = { ...this.fields, check_plan_approval: checkField };
    }

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
                <td>
                  {(get(this.props.user, "engcompany_id", "") &&
                    get(data, "user.departments.name", "")) ||
                    get(data, "user.name", "")}
                </td>
              </tr>
              <tr>
                <td>رقم الهاتف</td>
                <td>{get(data, "user.phone", "")}</td>
              </tr>
              <tr>
                <td>رقم الجوال</td>
                <td>{get(data, "user.mobile", "")}</td>
              </tr>
              <tr>
                <td>البريد الالكترونى</td>
                <td>{get(data, "user.email", "")}</td>
              </tr>
            </tbody>
          </table>
        </Modal>
        {(!isEmpty && map(this.fields, this.renderInfo.bind(this, data))) || (
          <div className="uu">
            <div className="table-div">
              <div>
                <label style={{ whiteSpace: "nowrap" }}>{data.comments}</label>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(remarks));
