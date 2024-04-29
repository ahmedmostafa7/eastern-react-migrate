import React, { Component } from "react";
import {
  backEndUrlforMap,
  host,
} from "../../../../../../../../../imports/config";
import {
  convertToArabic,
  checkImage,
  localizeNumber,
  reformatDateTime,
} from "../../../../../../../inputs/fields/identify/Component/common/common_func";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Popover, Icon, Modal } from "antd";
import { get, isEmpty, map } from "lodash";
class confirm_3 extends Component {
  state = { OpenModal: false };
  render() {
    const user = this.props?.mainObject?.approvalSubmissionNotes?.user;
    console.log("MM", this.props?.mainObject?.approvalSubmissionNotes);
    const notes = this.props?.mainObject?.approvalSubmissionNotes?.notes.notes;

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
                    get(
                      this.props.mainObject.approvalSubmissionNotes.user,
                      "departments.name",
                      ""
                    )) ||
                    get(
                      this.props.mainObject.approvalSubmissionNotes.user,
                      "name",
                      ""
                    )}
                </td>
              </tr>
              <tr>
                <td>رقم الهاتف</td>
                <td>
                  {get(
                    this.props.mainObject.approvalSubmissionNotes.user,
                    "phone",
                    ""
                  )}
                </td>
              </tr>
              <tr>
                <td>رقم الجوال</td>
                <td>
                  {get(
                    this.props.mainObject.approvalSubmissionNotes.user,
                    "mobile",
                    ""
                  )}
                </td>
              </tr>
              <tr>
                <td>البريد الالكترونى</td>
                <td>
                  {get(
                    this.props.mainObject.approvalSubmissionNotes.user,
                    "email",
                    ""
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </Modal>

        <div>
          {(notes.length &&
            notes.map((note, key) => {
              return (
                <table key={key} className="table table-bordered">
                  <tbody>
                    <tr>
                      <td>
                        {(get(this.props.user, "engcompany_id", "") &&
                          "اسم الإدارة") ||
                          "اسم المستخدم"}
                      </td>

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
                            get(
                              this.props.mainObject.approvalSubmissionNotes
                                .user,
                              "engcompany_id"
                            )
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
                                      {(get(
                                        this.props.user,
                                        "engcompany_id",
                                        ""
                                      ) &&
                                        "اسم الإدارة") ||
                                        "اسم المستخدم"}
                                    </td>
                                    <td>
                                      {(get(
                                        this.props.user,
                                        "engcompany_id",
                                        ""
                                      ) &&
                                        get(
                                          this.props.mainObject
                                            .approvalSubmissionNotes.user,
                                          "departments.name",
                                          ""
                                        )) ||
                                        get(
                                          this.props.mainObject
                                            .approvalSubmissionNotes.user,
                                          "name",
                                          ""
                                        )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>رقم الهاتف</td>
                                    <td>
                                      {get(
                                        this.props.mainObject
                                          .approvalSubmissionNotes.user,
                                        "phone",
                                        ""
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>رقم الجوال</td>
                                    <td>
                                      {get(
                                        this.props.mainObject
                                          .approvalSubmissionNotes.user,
                                        "mobile",
                                        ""
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>البريد الالكترونى</td>
                                    <td>
                                      {get(
                                        this.props.mainObject
                                          .approvalSubmissionNotes.user,
                                        "email",
                                        ""
                                      )}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            }
                            trigger="hover"
                          >
                            <span className="pl-3">
                              <span className="pl-3">
                                {(get(this.props.user, "engcompany_id", "") &&
                                  get(
                                    this.props.mainObject
                                      .approvalSubmissionNotes.user,
                                    "departments.name",
                                    ""
                                  )) ||
                                  get(
                                    this.props.mainObject
                                      .approvalSubmissionNotes.user,
                                    "name",
                                    ""
                                  )}
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
                              {(get(this.props.user, "engcompany_id", "") &&
                                get(
                                  this.props.mainObject.approvalSubmissionNotes
                                    .user,
                                  "departments.name",
                                  ""
                                )) ||
                                get(
                                  this.props.mainObject.approvalSubmissionNotes
                                    .user,
                                  "name",
                                  ""
                                )}
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
                      <td style={{ display: "flex" }}>
                        {/* {this.props.mainObject.approvalSubmissionNotes.notes
                          .date ? (
                          <span
                            style={{
                              direction: "ltr",
                              unicodeBidi: "bidi-override",
                              marginRight: "10px",
                              order: 2,
                            }}
                          >
                            {localizeNumber(
                              this.props.mainObject.approvalSubmissionNotes
                                .notes.time ||
                                this.props.mainObject.approvalSubmissionNotes.notes.date.split(
                                  ","
                                )[1]
                            ).replace('AM', 'ص').replace('PM', 'م')}
                          </span>
                        ) : (
                          <span></span>
                        )}
                        <span> &nbsp;&nbsp;</span> */}
                        {this.props?.mainObject?.approvalSubmissionNotes?.notes
                          ?.date ? (
                          reformatDateTime(
                            this.props?.mainObject?.approvalSubmissionNotes
                              ?.notes,
                            "date"
                          )
                        ) : (
                          <span></span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>الملاحظات </td>
                      <td>{convertToArabic(note.notes)}</td>
                    </tr>
                    {note.attachments && (
                      <tr>
                        <td>المرفقات </td>
                        <td>
                          <div style={{ display: "flex" }}>
                            {checkImage(this.props, note.attachments, {
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
              );
            })) || (
            <div>
              <p>لا يوجد ملاحظات</p>
            </div>
          )}
          {this.props.mainObject.approvalSubmissionNotes.notes.check && (
            <div>
              <span>
                {this.props.mainObject.approvalSubmissionNotes.notes.check ==
                true ? (
                  <span>
                    <i className="fa fa-check"></i>
                  </span>
                ) : (
                  <span>
                    <i className="fa fa-close"></i>
                  </span>
                )}
                <span>
                  يقر مقدم الطلب بصحة جميع البيانات و اطلاعى على اتفاقية مستوى
                  الخدمة
                </span>
              </span>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(confirm_3));
