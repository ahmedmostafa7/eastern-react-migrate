import React from "react";
import { Input, Modal } from "antd";
import mainInput from "app/helpers/main/input";
import { withTranslation } from "react-i18next";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { connect } from "react-redux";
import { get } from "lodash";
class UserDetailsModal extends mainInput {
  componentDidMount() {
    const { init_data } = this.props;
    if (init_data) {
      init_data(this.props);
    }
  }
  state = { OpenModal: false };

  render() {
    const {
      disabled,
      textAfter,
      className,
      input,
      label,
      type,
      placeholder,
      style,
      value,
      defaultValue,
      t,
    } = this.props;
    console.log(this.props);
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
          {/* <table className="table table-bordered">
            <tbody>
              <tr>
                <td>اسم المستخدم</td>
                <td>
                  {get(
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
          </table> */}
        </Modal>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h4>hh</h4>
          <button type="button" onClick={this.setState({ OpenModal: true })}>
            بيانات المستخدم
          </button>
        </div>
      </>
    );
  }
}

//export default withTranslation("labels")(textComp);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(UserDetailsModal));
