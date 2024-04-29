import React, { useState, useRef } from "react";
import { Modal, Container } from "react-bootstrap";
import { Form, Row, Col, Input, Button, notification } from "antd";
import axios from "axios";
export default function EditUser(props) {
  const [name, setName] = useState(props.rowdata.name);
  const formRef = useRef(null);

  const handleUserInput = (e) => {
    setName(e.target.value);
  };
  const confirmationEdit = () => {
    const args = {
      description: "تم تعديل اسم المستخدم بنجاح",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,     style: {
        background: "#176d73",
      },
    };
    notification.open(args);
  };
  const editMun = (e) => {
    if (name !== "") {
      axios
        .put(
          window.host + "/api/municipality/" + props.id,
          { ...props.rowdata, name: name },
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
            .get(window.host + "/api/municipality", {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.token}`,
              },
            })
            .then(
              (res1) =>
                props.getTableData(
                  props.columns,
                  res1.data,
                  res1.data.count
                ),
              confirmationEdit()
            )
        );

      props.closeEditModal();
    }
  };
  return (
    <Modal
      keyboard={false}
      onHide={props.closeEditModal}
      show={props.showEdit}
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
            <span>
              <i
                className="fas fa-times fa-1x"
                onClick={props.closeEditModal}
                style={{
                  textAlign: "left",
                  float: "left",
                  cursor: "pointer",
                }}
              ></i>
            </span>
            تعديل البلدية
          </h5>
        </div>
        <hr />
        <Form
          ref={formRef}
          className="my-4 px-md-5 regForms"
          layout="vertical"
          name="validate_other"
          initialValues={{
            name: props.rowdata.name,
          }}
        >
          <Row>
            <Col span={24} className="px-2">
              <Form.Item
                rules={[
                  {
                    message: "من فضلك ادخل الإسم",
                    required: true,
                  },
                ]}
                name="name"
                hasFeedback
                label="الإسم"
              >
                <Input
                  defaultValue={props.rowdata.name}
                  name="name"
                  onChange={handleUserInput}
                  value={name}
                  placeholder="الإسم"
                />
              </Form.Item>
            </Col>
          </Row>
          <Button className="cancelbtn" onClick={props.closeEditModal}>
            لا
          </Button>
          <Button className="addbtn" onClick={editMun}>
            نعم
          </Button>
        </Form>
      </Container>
    </Modal>
  );
}
