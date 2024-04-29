import React, { Component } from "react";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import RenderField from "app/components/inputs";
import { withTranslation } from "react-i18next";
import { apply_permissions, serverFieldMapper } from "app/helpers/functions";
import { newPasswordFields } from "./fields";
import { Modal, Form } from "antd";
import axios from "axios";
import { workFlowUrl } from "configFiles/config";
class Profile extends Component {
  constructor(props) {
    super(props);
    //  const { modal: { fields } } = this.props

    this.fields = newPasswordFields.map((f) => serverFieldMapper(f));
    this.state = { popUp: false };
  }

  changePassword(values) {
    const { user } = this.props;
    let url = workFlowUrl + "/users/changepassword/" + user.id;
    if (values.password != user.password) {
      window.notifySystem("error", "كلمة المرور خاطئة");
    } else {
      axios
        .post(url, { ...values })
        .then((response) => {
          window.notifySystem("success", "تم تغير كلمة المرور بنجاح");
          this.setState({ popUp: false });
        })
        .catch((error) => {
          window.notifySystem("error", "حدث خطأ");
        });
    }
  }
  render() {
    const { user, handleSubmit } = this.props;
    const { popUp } = this.state;
    return (
      <div>
        <table className="table" style={{ width: "75vw", margin: "auto" }}>
          <thead>
            <th>الاسم</th>
            <th>البريد الالكترونى</th>
            <th>رقم الجوال</th>
            <th>تغير كلمة المرور</th>
          </thead>
          <tbody>
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button
                  className="btn btn-info"
                  onClick={() => {
                    this.setState({ popUp: true });
                  }}
                >
                  تغير
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <Modal
          title="تغير كلمة المرور"
          visible={popUp}
          onOk={handleSubmit((values) => this.changePassword(values))}
          onCancel={() => {
            this.setState({ popUp: false });
          }}
          cancelText="اغلاق"
          okText="تغير"
        >
          <Form>
            {this.fields.map((field) => (
              <Field
                key={field.name}
                name={field.name}
                component={RenderField}
                {...field}
              />
            ))}
          </Form>
        </Modal>
      </div>
    );
  }
}
export default reduxForm({
  form: "resetForm",
})(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation("labels")(Profile))
  )
);
