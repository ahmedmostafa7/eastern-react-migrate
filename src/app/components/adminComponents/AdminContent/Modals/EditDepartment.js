import React, { useEffect, useState } from "react";
import { Modal, Container } from "react-bootstrap";
import {
  Form,
  Row,
  Col,
  Input,
  // Img,
  Checkbox,
  Button,
  notification,
  Upload,
} from "antd";
import { last } from "lodash";
import axios from "axios";
import Img from "app/helpers/components/image";
import { filesHost, workFlowUrl } from "imports/config";
function EditDepartment(props) {
  const [name, setName] = useState(props.rowdata.name);
  // const [approving_dep, checkApprove] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [modal, setModal] = useState(false);
  const [oldImage, setOldImage] = useState(true);
  // const [can_reserve_appointments, seReserveAppointments] = useState(null);
  const [checkboxes, setCheckboxs] = useState({});
  const [showPreview, setImagePreview] = useState(true);

  const handleUserInput = (e) => {
    setName(e.target.value);
  };
  const confirmationEdit = () => {
    const args = {
      description: "تم تعديل القسم بنجاح",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
  };
  const fileUPload = (e) => {
    let filePath = e?.file?.response?.map((d) => d.data)[0];
    setFilePath(filePath);
    setOldImage(false);
    console.log(filePath);
  };
  // const url = get(image, "url", "");
  const type = last(props?.rowdata?.image?.split("."))?.toLowerCase();

  useEffect(() => {
    console.log(props.approving_dep);
    console.log(name);
  });
  const editDep = (e) => {
    if (name !== "") {
      axios
        .put(
          window.host + "/api/department/" + props.id,
          {
            ...props.rowdata,
            name: name == undefined || name == "" ? props.rowdata.name : name,
            approving_dep: checkboxes.approving_dep,
            image: filePath || props?.rowdata?.image,
            can_reserve_appointments: checkboxes.can_reserve_appointments,
            // ||props?.rowdata?.can_reserve_appointments,
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
              confirmationEdit()
            )
        );
      // this.setState({
      //   name: "",
      // });
      props.closeEditModal();
    }
  };
  const handlePreview = () => {
    setModal(true);
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
          <h5 className="px-5 pt-4">تعديل القسم</h5>
        </div>
        <hr />
        <Form
          className="my-4 px-md-5 regForms"
          layout="vertical"
          name="validate_other"
        >
          <Row>
            <Col span={24} className="px-2">
              <Form.Item name="name" hasFeedback label="الاسم">
                {" "}
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "من فضلك ادخل الاسم" }],
                  initialValue: props.rowdata.name,
                })(
                  <Input
                    name="name"
                    onChange={handleUserInput}
                    value={name}
                    placeholder="الاسم"
                  />
                )}
              </Form.Item>
            </Col>{" "}
            <Col span={24}>
              <div className="checkDiv mb-4">
                جهة اعتماد المكاتب
                <Checkbox
                  defaultChecked={props?.rowdata?.approving_dep}
                  className="ml-3"
                  onChange={onCheck}
                  style={{
                    lineHeight: "32px",
                  }}
                />
              </div>
            </Col>
            <Col span={24}>
              <div className="checkDiv mb-4">
                امكانيه حجز موعد
                <Checkbox
                  defaultChecked={props?.rowdata?.can_reserve_appointments}
                  className="ml-3"
                  onChange={onCheckAppoint}
                  style={{
                    lineHeight: "32px",
                  }}
                />
              </div>
            </Col>
            <Col span={24}>
              <Form.Item
                label="الصورة"
                valuePropName="fileList"
                // style={{ display: "flex" }}
              >
                {getFieldDecorator("fileupload", {
                  // rules: [{ required: true, message: "من فضلك ادخل المرفقات" }],
                  initialValue: props?.rowdata?.image,
                })(
                  <Upload
                    action={workFlowUrl + "/uploadMultifiles"}
                    listType="picture-card"
                    style={{ width: "auto" }}
                    className="depUpload"
                    onChange={fileUPload}
                    maxCount={1}
                    onPreview={handlePreview}
                    onRemove={() => {
                      setFilePath("");
                    }}
                    disabled={filePath ? true : false}
                    // previewFile={[
                    //   workFlowUrl + filePath ||
                    //     workFlowUrl + props?.rowdata?.image,
                    // ]}
                  >
                    تعديل صورة
                    <div style={{ display: "grid" }}>
                      <Modal
                        show={modal}
                        backdrop="static"
                        className="adminModal"
                        {...props}
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
                            src={
                              window.filesHost + `${filePath}`
                              // window.filesHost + "/" + props.rowdata.image
                            }
                          />
                          <Modal.Footer
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
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
                    </div>
                  </Upload>
                )}
              </Form.Item>
              {oldImage && props.rowdata.image && (
                <img src={filesHost + "/" + props.rowdata.image} />
                // <Img
                //   type={type}
                //   file={props?.rowdata?.image}
                //   style={{ width: "100px" }}
                // />
              )}
            </Col>
            {/* </Modal> */}
          </Row>
          <Button className="cancelbtn" onClick={props.closeEditModal}>
            اغلاق
          </Button>
          <Button className="addbtn" onClick={editDep}>
            حفظ
          </Button>
        </Form>
      </Container>
    </Modal>
  );
}
export default EditDepartment;
