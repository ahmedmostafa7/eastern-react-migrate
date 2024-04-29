import React, { Component } from "react";
import { Modal } from "antd";
import { get } from "lodash";
export default class SimpleModal extends Component {
  state = { openMale: false };
  render() {
    console.log("simp", this.props);
    let userData = this.props.val;
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
          {userData && <table className="table table-bordered">
            <tbody>
              <tr>
                <td>اسم المستخدم</td>
                <td>{userData.name || ''}</td>
              </tr>
              <tr>
                <td>رقم الهاتف</td>
                <td>{userData.phone}</td>
              </tr>
              <tr>
                <td>رقم الجوال</td>
                <td>{userData.mobile}</td>
              </tr>
              <tr>
                <td>البريد الالكترونى</td>
                <td>{userData.email}</td>
              </tr>
            </tbody>
          </table>}
        </Modal>
        <h5>
          {userData && userData.name || ''}
          <span>
            <button
              onClick={() => {
                this.setState({ OpenModal: true });
              }}
              className="btn btn-warning"
            >
              بيانات المستخدم
            </button>
          </span>
        </h5>{" "}
      </>
    );
  }
}
