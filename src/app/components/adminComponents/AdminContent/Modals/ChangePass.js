import React, { useEffect, useState } from "react";
import { Modal, Container } from "react-bootstrap";
import { Form, Row, Col, Input, Button, notification, message } from "antd";
import axios from "axios";

function ChangePass(props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");
  const [confirmDirty, setConfirmDirty] = useState(false);
  const handleUserPassword = (e) => {
    setNewPassword(e.target.value);
  };
  const handleConfirmUserPassword = (e) => {
    setconfirmNewPassword(e.target.value);
  };
  const handleConfirmBlur = (e) => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };
  const { getFieldDecorator, getFieldValue, validateFields } = props.form;
  const validateToNextPassword = (rule, value, callback) => {
    if (value && confirmDirty) {
      validateFields(["confirm"], { force: true });
    }
    callback();
  };
  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue("password")) {
      callback("كلمة المرور غير متطابقة ");
    } else {
      callback();
    }
  };
  const changePassReq = () => {
    let data = {
      newPassword: newPassword,
      confirmNewPassword: confirmNewPassword,
      id: props.rowdata.id,
    };
    axios
      .post(window.host + `/changepassword`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((response) => {
        message.success("تم تغير كلمة المرور بنجاح");
        props.close();
      })
      .catch((err) => {
        if (err) message.error("حدث خطأ");
      });
  };
  return (
    <>
      <Modal
        show={props.show}
        keyboard={false}
        onHide={props.close}
        // show={props.showAdd}
        backdrop="static"
        className="adminModal"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Container fluid>
          <div>
            <h5 className="px-5 pt-4">
              {/* <span>
                <i
                  className="fas fa-times fa-1x"
                  onClick={props.close}
                  style={{
                    textAlign: "left",
                    float: "left",
                    cursor: "pointer",
                  }}
                ></i>
              </span> */}
              تغيير كلمة المرور
            </h5>
          </div>
          <hr />
          <Form
            className="my-4 px-md-5 regForms"
            layout="vertical"
            name="validate_other"
          >
            <Row>
              <Col span={24} className="px-2">
                <Form.Item
                  className="passwordInputt"
                  name="newPassword"
                  hasFeedback
                  label="كلمة المرور  الجديدة"
                >
                  {getFieldDecorator("password", {
                    rules: [
                      {
                        pattern: new RegExp(
                          /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/
                        ),
                        message:
                          "  الرجاءإدخال كلمة مرور معقدة لا يقل طولها عن 8 رموز تحتوي علي حرف كبير و حرف صغير و أرقام وعلامات خاصة ",
                      },
                      {
                        required: true,
                        message: "من فضلك أدخل كلمة المرور الجديدة",
                      },
                      {
                        validator: validateToNextPassword,
                      },
                    ],
                  })(
                    <Input.Password
                      size="large"
                      name="password"
                      onChange={handleUserPassword}
                      value={newPassword}
                      placeholder=" ادخل كلمة المرور الجديدة"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={24} className="px-2">
                <Form.Item
                  className="passwordInputt"
                  dependencies={["password"]}
                  name="confirmNewPassword"
                  hasFeedback
                  label="تأكيد كلمة المرور "
                >
                  {getFieldDecorator("confirmNewPassword", {
                    rules: [
                      {
                        message: "من فضلك ادخل تأكيد كلمة المرور",
                        required: true,
                      },
                      {
                        validator: compareToFirstPassword,
                      },
                    ],
                  })(
                    <Input.Password
                      size="large"
                      name="confirmNewPassword"
                      onChange={handleConfirmUserPassword}
                      value={confirmNewPassword}
                      placeholder="ادخل تأكيد كلمة المرور"
                      onBlur={handleConfirmBlur}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ display: "flex", justifyContent: "flex-start" }}>
              <Form.Item>
                <Button className="cancelbtn" onClick={props.close}>
                  اغلاق
                </Button>
              </Form.Item>
              <Form.Item>
                <Button className="addbtn" onClick={changePassReq}>
                  حفظ
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Container>
      </Modal>
    </>
  );
}
export default Form.create()(ChangePass);
