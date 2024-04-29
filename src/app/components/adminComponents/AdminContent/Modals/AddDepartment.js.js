import React, { useState, useRef } from "react";
import axios from "axios";
import { Modal, Container } from "react-bootstrap";
import {
  Form,
  Row,
  Col,
  Input,
  Checkbox,
  message,
  Button,
  Icon,
  notification,
  Upload,
} from "antd";
import { workFlowUrl } from "imports/config";
function AddDepartment(props) {
  const [name, setName] = useState("");
  const [filePath, setFilePath] = useState(null);
  const [modal, setModal] = useState(false);
  // const [approving_dep, checkApprove] = useState(null);
  // const [can_reserve_appointments, seReserveAppointments] = useState(null);
  const [checkboxes, setCheckboxs] = useState({});
  const [disabled, setDisabled] = useState(false);
  const formRef = useRef(null);

  const handleUserInput = (e) => {
    setName(e.target.value);
  };
  const confirmationAdd = () => {
    const args = {
      description: "تم إضافة القسم بنجاح",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
  };
  const addDep = (e) => {
    let data = {
      name: name,
      approving_dep: checkboxes.approving_dep,
      image: filePath,
      can_reserve_appointments: checkboxes.can_reserve_appointments,
    };
    if (name !== "") {
      axios
        .post(window.host + "/api/department", data, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((res) =>
          axios
            .get(window.host + "/api/department", {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.token}`,
              },
            })

            .then(
              (res1) =>
                props.getTableData(props.columns, res1.data, res1.data.count),
              confirmationAdd()
            )
        );
      setName("");
      setCheckboxs({ ...checkboxes, approving_dep: null });

      props.closeAdd();
    }
  };
  const fileUPload = (e) => {
    let filePathVar = e?.file?.response?.map((d) => d.data)[0];
    setFilePath(filePathVar);

    console.log(filePath);
  };

  const onCheck = (e) => {
    e.target.checked == true
      ? setCheckboxs({ ...checkboxes, approving_dep: 1 })
      : setCheckboxs({ ...checkboxes, approving_dep: null });
  };
  const onCheckAppoint = (e) => {
    e.target.checked == true
      ? setCheckboxs({ ...checkboxes, can_reserve_appointments: true })
      : // seReserveAppointments(true)  setFormValues({ ...formValues, [e.target.name]: e.target.value });
        setCheckboxs({ ...checkboxes, can_reserve_appointments: false });
  };
  const { getFieldDecorator } = props.form;
  const handlePreview = () => {
    setModal(true);
  };
  const beforeUpload = (d) => {
    setFilePath([...d.name]);
  };
  const deleteImage = (filePath) => {
    setFilePath(null);
    // setModal(false);
  };

  return (
    <Modal
      keyboard={false}
      onHide={props.closeAdd}
      show={props.showAdd}
      backdrop="static"
      className="adminModal"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Container fluid>
        <div>
          <h5 className="px-5 pt-4">إضافة قسم جديد</h5>
        </div>
        <hr />
        <Form
          ref={formRef}
          className="my-4 px-md-5 regForms"
          layout="vertical"
          name="validate_other"
          initialValues={{
            name: name,
          }}
        >
          <Row>
            <Col span={24} className="px-2">
              <Form.Item name="name" hasFeedback label="الاسم">
                {" "}
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "من فضلك ادخل الاسم" }],
                })(
                  <Input
                    name="name"
                    onChange={handleUserInput}
                    value={name}
                    placeholder="الاسم"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <div className="checkDiv mb-4">
                جهة اعتماد المكاتب
                <Checkbox
                  className="ml-3"
                  onChange={onCheck}
                  style={{
                    lineHeight: "32px",
                  }}
                />
              </div>
            </Col>
            <Col>
              <Col span={24}>
                <div className="checkDiv mb-4">
                  امكانيه حجز موعد
                  <Checkbox
                    className="ml-3"
                    onChange={onCheckAppoint}
                    style={{
                      lineHeight: "32px",
                    }}
                  />
                </div>
              </Col>
              <Col span={24}>
                <Form.Item label="الصورة" valuePropName="fileList">
                  {/* {!filePath && ( */}
                  <Upload
                    action={workFlowUrl + "/uploadMultifiles"}
                    listType="picture-card"
                    style={{ width: "auto" }}
                    className="depUpload"
                    showUploadList={false}
                    accept="image/*"
                    maxCount={1}
                    // beforeUpload={beforeUpload}
                    onPreview={handlePreview}
                    multiple={false}
                    onRemove={() => {
                      setFilePath(null);
                    }}
                    disabled={filePath ? true : false}
                    // showUploadList={false}
                    onChange={fileUPload}
                  >
                    {" ارفاق صورة"}
                    <Modal
                      show={modal}
                      backdrop="static"
                      // className="department-modal"
                      width={40}
                      {...props}
                      // style={{ width: "40%" }}
                      size="lg"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                      title={"عرض الصورة"}
                      // footer={[]}
                      onHide={() => {
                        setModal(false);
                      }}
                    >
                      <div>
                        <img
                          alt="example"
                          style={{
                            width: "100%",
                          }}
                          src={window.filesHost + `${filePath}`}
                        />
                        <Modal.Footer
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            // float: "left",
                          }}
                        >
                          <div>
                            <Button
                              variant="secondary"
                              onClick={() => setModal(false)}
                            >
                              اغلاق
                            </Button>
                          </div>
                        </Modal.Footer>
                      </div>
                    </Modal>
                  </Upload>
                  {/* )} */}
                  {/* <Button variant="secondary" onClick={deleteImage}>
                    حذف الصورة
                  </Button> */}
                  {/* {filePath && (
                    <div>
                      <button
                        className="btn"
                        onClick={() => {
                          setFilePath(null);
                        }}
                      >
                        حذف الصورة
                      </button>
                    </div>
                  )} */}
                </Form.Item>
              </Col>
            </Col>
          </Row>
          <Button className="cancelbtn" onClick={props.closeAdd}>
            اغلاق
          </Button>
          <Button className="addbtn" onClick={addDep}>
            حفظ
          </Button>
        </Form>
      </Container>
    </Modal>
  );
}
export default Form.create()(AddDepartment);
