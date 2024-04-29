import React, { useState, useRef, useEffect } from "react";
import { Modal, Container } from "react-bootstrap";
import { Form, Row, Col, Input, Button, notification } from "antd";
import axios from "axios";
export default function ActivateUser(props) {
  const [deactivation_reason, setReason] = useState(null);
  const formRef = useRef(null);

  const handleUserInput = (e) => {
    setReason(e.target.value);
  };
  const confirmationActivate = () => {
    const args = {
      description:
        props.rowdata.is_active == 1
          ? "تم تجميد المستخدم بنجاح"
          : "تم تفعيل المستخدم بنجاح",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
  };
  const activate = (e) => {
    axios
      .put(
        window.host + "/api/user/" + props.id,
        {
          ...props.rowdata,
          is_active: props.rowdata.is_active == 1 ? 0 : 1,
          deactivation_reason:
            props.rowdata.is_active == 1 ? deactivation_reason : null,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      )
      .then((res) =>
        axios
          .get(window.host + "/api/user", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
          })
          .then(
            (res1) =>
              props.getTableData(props.columns, res1.data, res1.data.count),
            setReason(null),
            confirmationActivate()
          )
      );

    props.closeActivate();
  };
  useEffect(() => {
    console.log(props.rowdata);
  });
  return (
    <Modal
      keyboard={false}
      onHide={props.closeActivate}
      show={props.showActivate}
      backdrop="static"
      className="adminModal"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container fluid>
        <div>
          <h5 className="px-5 pt-4">
            {props.rowdata.is_active == 1 ? "تجميد المستخدم" : "تفعيل المستخدم"}
          </h5>
        </div>
        <hr />
        <Form
          ref={formRef}
          className="my-4 px-md-5 regForms"
          layout="vertical"
          name="validate_other"
        >
          {props.rowdata.is_active == 1 ? (
            <Row>
              <Col span={24} className="px-2">
                <Form.Item
                  name="deactivation_reason"
                  hasFeedback
                  label="سبب التجميد"
                >
                  <Input
                    name="deactivation_reason"
                    onChange={handleUserInput}
                    value={deactivation_reason}
                    placeholder="سبب التجميد"
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <p>هل تريد بالتأكيد تنشيط الحساب ؟</p>
          )}
          <Button className="cancelbtn" onClick={props.closeActivate}>
            اغلاق
          </Button>
          <Button className="addbtn" onClick={activate}>
            حفظ
          </Button>
        </Form>
      </Container>
    </Modal>
  );
}
