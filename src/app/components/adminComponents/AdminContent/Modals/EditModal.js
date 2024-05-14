import React, { useState, useEffect } from "react";
import { Modal, Container } from "react-bootstrap";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  notification,
  Select,
  InputNumber,
  Checkbox,
} from "antd";
import axios from "axios";
function EditModal(props) {
  const [name, setName] = useState(
    props.title == "nationalities"
      ? props.rowdata.local_name
      : props.rowdata.name
  );
  const [appsNumber, setAppsNumber] = useState(props.rowdata.max_request_no);
  const [unique, setUnique] = useState(true);
  const [uniqueError, setUniqueError] = useState("");
  const [idTypes] = useState([
    { name: "مقيم", id: 1990 },
    { name: "هوية خليجية", id: 1988 },
    { name: "هوية وطنية", id: 1890 },
  ]);
  const [defultMunClass, setDefultClass] = useState(undefined);
  const [checks, setCheck] = useState({
    // contract_credence: null,
    // elec_credence: null,
    // water_credence: null,
    // procuration_credence: null,
  });
  const [munClassId, setMunClass] = useState(props.rowdata.classification_id);
  const [munCLasses, setAllMunClass] = useState([]);
  const [codeNum, setMunCode] = useState();
  const [code, setCityBelong] = useState(null);
  const [city_id, setCityId] = useState(null);
  const [city_name_a, setCityName] = useState(null);
  const handleMunCode = (e) => {
    setMunCode(e);
  };
  const handleCityId = (e) => {
    setCityId(e);
  };
  const onCheck = (value, e) => {
    if (e.target.checked) {
      setCheck({ ...checks, [value]: 1 });
    } else {
      setCheck({ ...checks, [value]: null });
    }
  };
  const [nationalty_type_id, setTypeId] = useState(
    props.rowdata.nationalty_type_id
  );
  const handleAppsNumber = (e) => {
    setAppsNumber(e.target.value);
  };
  const handleCityBelong = (value, e) => {
    setCityBelong(e?.props?.code);
    setCityName(e.props?.code_name);
  };
  useEffect(() => {
    if (props.title == "municipality") {
      axios
        .get(
          `${window.host}/api/MunicipalityClasses/GetAll?page=0&pageSize=10000000`
        )
        .then((res) => {
          setAllMunClass(res.data.results);
        });
    }
  }, []);
  const handleUserInput = (e) => {
    setName(e.target.value);
    axios
      .get(
        window.host +
          `/api/${props.title}/CheckUnique/?key=${
            props.title == "position"
              ? "name"
              : props.title == "issuerstype"
              ? "name"
              : "local_name"
          }&q=${e.target.value}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setUnique(true);
          setUniqueError("");
        }
      })
      .catch((error) => {
        if (error.response.status === 302) {
          setUnique(false);
          setUniqueError("هذا المسمي موجود سابقا");
        }
      });
  };
  const confirmationEdit = () => {
    const args = {
      description: `تم تعديل ${
        props.title == "municipality"
          ? "البلدية"
          : props.title == "nationalities"
          ? "الجنسية "
          : props.title == "applications"
          ? "عدد الطلبات"
          : props.title == "issuerstype"
          ? " نوع جهة الاصدار "
          : "المسمي الوظيفي"
      } بنجاح`,
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
  };

  const editMun = (e) => {
    console.log(name);
    if (name !== "") {
      axios
        .put(
          window.host + "/api/municipality/" + props.id,
          {
            ...props.rowdata,
            name: name || props.rowdata.name,
            mun_class_id: munClassId || props.rowdata.mun_class_id,
            province_id: 2,
            code: codeNum || props.rowdata.codeNum,
            city_id: city_id || props.rowdata.city_id,
            city_code: code || props?.rowdata?.city_code,
            CITY_NAME_A: city_name_a || props?.rowdata?.CITY_NAME_A,
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
            .get(window.host + "/api/municipality", {
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

      props.closeEditModal();
    }
  };
  const editJobTitle = (e) => {
    if (name !== "" && unique) {
      console.log(props.rowdata);
      axios
        .put(
          window.host + "/api/position/" + props.id,
          {
            ...props.rowdata,
            name: name !== undefined ? name : props.rowdata.name,
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
            .get(window.host + "/api/position", {
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

      props.closeEditModal();
    }
  };
  const editNationality = (e) => {
    if (name !== "" && unique) {
      axios
        .put(
          window.host + "/api/nationalities/" + props.id,
          {
            ...props.rowdata,
            local_name: name !== undefined ? name : props.rowdata.local_name,
            nationalty_type_id:
              nationalty_type_id || props.rowdata.nationalty_type_id,
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
            .get(window.host + "/api/nationalities", {
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

      props.closeEditModal();
    }
  };
  const editIssuerType = (e) => {
    if (name !== "" && unique) {
      axios
        .put(
          window.host + "/api/issuerstype/" + props.id,
          {
            ...props.rowdata,
            ...checks,
            name: name !== undefined ? name : props.rowdata.name,
            // contract_credence:
            //   checks.contract_credence || props.rowdata.contract_credence,
            // elec_credence: checks.elec_credence || props.rowdata.elec_credence,
            // water_credence:
            //   checks.water_credence || props.rowdata.water_credence,
            // procuration_credence:
            //   checks.procuration_credence || props.rowdata.procuration_credence,
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
            .get(window.host + "/api/issuerstype", {
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

      props.closeEditModal();
    }
  };
  const { getFieldDecorator } = props.form;
  const closeModal = (e) => {
    setName("");
    props.closeEditModal();
  };
  const handleChangeMunClass = (value, e) => {
    setMunClass(Number(e.key));
  };
  const handleChangeIdType = (value, e) => {
    setTypeId(e.key);
    console.log(e);
  };
  const editApps = (e) => {
    console.log(name);
    if (appsNumber !== "") {
      axios
        .put(
          window.host + "/api/applications/" + props.id,
          {
            ...props.rowdata,
            max_request_no: appsNumber,
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
            .get(window.host + "/api/applications", {
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
            تعديل
            {props.title == "municipality"
              ? " البلدية "
              : props.title == "nationalities"
              ? " الجنسية "
              : props.title == "applications"
              ? " عدد طلبات التطبيق "
              : props.title == "issuerstype"
              ? " نوع جهة الاصدار  "
              : " المسمي الوظيفي "}
          </h5>
        </div>
        <hr />
        <Form
          className="my-4 px-md-5 regForms"
          layout="vertical"
          name="validate_other"
        >
          {props.title !== "applications" ? (
            <Row>
              <Col span={24} className="px-2">
                <Form.Item name="name" hasFeedback label="الاسم">
                  {getFieldDecorator("name", {
                    rules: [{ required: true, message: "من فضلك ادخل الاسم" }],
                    initialValue:
                      props.title == "nationalities"
                        ? props.rowdata.local_name
                        : props.rowdata.name,
                  })(
                    <Input
                      name="name"
                      onChange={handleUserInput}
                      value={name}
                      placeholder="الاسم"
                    />
                  )}
                </Form.Item>
                {(props.title == "position" ||
                  props.title == "nationalities" ||
                  props.title == "issuerstype") &&
                uniqueError ? (
                  <p style={{ color: "#c0392b" }}>{uniqueError}</p>
                ) : null}
              </Col>
              {props.title == "municipality" && (
                <div>
                  <Col span={24} className="px-2">
                    <Form.Item
                      name="city_code"
                      hasFeedback
                      label="المدينة التابع لها البلدية"
                    >
                      {getFieldDecorator("city_code", {
                        rules: [
                          // {
                          //   required: true,
                          //   message: "من فضلك ادخل المدينة التابع لها البلدية",
                          // },
                        ],
                        initialValue:
                          props?.city_belong.length > 0 &&
                          props?.city_belong.filter(
                            (x) => x.code == props?.rowdata?.city_code
                          )[0]?.name,
                      })(
                        <Select
                          virtual={false}
                          showSearch
                          allowClear
                          onChange={handleCityBelong}
                          // value={munClassId}
                          placeholder="اختر  المدينه"
                          getPopupContainer={(trigger) => trigger.parentNode}
                        >
                          {props?.city_belong && props?.city_belong.length !== 0
                            ? props?.city_belong.map((inq, index) => (
                                <Select.Option
                                  className="selectgroup"
                                  value={inq.id}
                                  key={inq.id}
                                  id={inq.id}
                                  code_name={inq.CITY_NAME_A}
                                  code={inq.code}
                                >
                                  {inq.name}
                                </Select.Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-2">
                    <Form.Item
                      name="city_code"
                      hasFeedback
                      label="كود البلدية "
                    >
                      {getFieldDecorator("code", {
                        rules: [
                          { required: true, message: "من فضلك ادخل الكود " },
                        ],
                        initialValue: props.rowdata?.code,
                        maxLength: 15,
                      })(
                        <InputNumber
                          name="code"
                          min={1}
                          onChange={handleMunCode}
                          value={code}
                          placeholder=" كود البلدية "
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-2">
                    <Form.Item
                      name="city_id"
                      hasFeedback
                      label="رقم البلدية لحاسبة الرسوم   "
                    >
                      {getFieldDecorator("city_id", {
                        rules: [
                          {
                            required: true,
                            message: "رقم البلدية لحاسبة الرسوم ",
                          },
                        ],
                        initialValue: props.rowdata?.city_id,
                        maxLength: 15,
                      })(
                        <InputNumber
                          name="city_id"
                          min={1}
                          onChange={handleCityId}
                          value={city_id}
                          placeholder=" رقم البلدية لحاسبة الرسوم  "
                        />
                      )}
                    </Form.Item>
                  </Col>
                </div>
              )}
              {props.title == "municipality" ? (
                <Col span={24} className="px-2">
                  <Form.Item
                    rules={[
                      {
                        message: "من فضلك ادخل تصنيف البلدية",
                        required: true,
                      },
                    ]}
                    name="munClassId"
                    hasFeedback
                    label="تصنيف البلدية"
                  >
                    <Select
                      virtual={false}
                      showSearch
                      allowClear
                      onChange={handleChangeMunClass}
                      // value={munClassId}
                      defaultValue={
                        munCLasses.length > 0 && munCLasses !== undefined
                          ? munCLasses.filter(
                              (x) =>
                                x.mun_class_id == props.rowdata.mun_class_id
                            )[0] !== undefined
                            ? munCLasses.filter(
                                (x) =>
                                  x.mun_class_id == props.rowdata.mun_class_id
                              )[0].mun_class
                            : null
                          : null
                      }
                      placeholder="اختر تصنيف البلدية"
                      getPopupContainer={(trigger) => trigger.parentNode}
                    >
                      {munCLasses && munCLasses.length !== 0
                        ? munCLasses.map((inq, index) => (
                            <Select.Option
                              className="selectgroup"
                              value={inq.mun_class}
                              key={inq.mun_class_id}
                              id={inq.mun_class_id}
                            >
                              {inq.mun_class}
                            </Select.Option>
                          ))
                        : null}
                    </Select>
                  </Form.Item>
                </Col>
              ) : null}
              {props.title == "nationalities" ? (
                <Col span={24} className="px-2">
                  <Form.Item
                    rules={[
                      {
                        message: "من فضلك ادخل نوع الهوية",
                        required: true,
                      },
                    ]}
                    name="nationalty_type_id"
                    hasFeedback
                    label="نوع الهوية"
                  >
                    <Select
                      virtual={false}
                      showSearch
                      defaultValue={
                        props.rowdata.nationalty_type_id == 1990
                          ? "مقيم"
                          : props.rowdata.nationalty_type_id == 1988
                          ? "هوية خليجية"
                          : "هوية سعودية"
                      }
                      allowClear
                      onChange={handleChangeIdType}
                      // value={nationalty_type_id}
                      placeholder="اختر نوع الهوية"
                      getPopupContainer={(trigger) => trigger.parentNode}
                    >
                      {idTypes && idTypes.length !== 0
                        ? idTypes.map((inq, index) => (
                            <Select.Option
                              className="selectgroup"
                              value={inq.name}
                              key={inq.id}
                              id={inq.id}
                            >
                              {inq.name}
                            </Select.Option>
                          ))
                        : null}
                    </Select>
                  </Form.Item>
                </Col>
              ) : null}{" "}
              {props.title == "issuerstype" ? (
                <Col span={24}>
                  <div className="checkDiv mb-2">
                    إصدار صكوك
                    <Checkbox
                      defaultChecked={props.rowdata.contract_credence}
                      className="ml-3"
                      onChange={onCheck.bind(this, "contract_credence")}
                      // name="contract_credence"
                      style={{
                        lineHeight: "32px",
                      }}
                    />
                  </div>{" "}
                  <div className="checkDiv mb-2">
                    إصدار موافقات كهرباء
                    <Checkbox
                      className="ml-3"
                      defaultChecked={props?.rowdata?.elec_credence}
                      onChange={onCheck.bind(this, "elec_credence")}
                      // name="elec_credence"
                      style={{
                        lineHeight: "32px",
                      }}
                    />
                  </div>{" "}
                  <div className="checkDiv mb-2">
                    إصدار موافقات مياة
                    <Checkbox
                      className="ml-3"
                      defaultChecked={props.rowdata.water_credence}
                      onChange={onCheck.bind(this, "water_credence")}
                      // name="water_credence"
                      style={{
                        lineHeight: "32px",
                      }}
                    />
                  </div>
                  <div className="checkDiv mb-2">
                    إصدار وكالات
                    <Checkbox
                      className="ml-3"
                      defaultChecked={props.rowdata.procuration_credence}
                      onChange={onCheck.bind(this, "procuration_credence")}
                      // name="procuration_credence"
                      style={{
                        lineHeight: "32px",
                      }}
                    />
                  </div>
                </Col>
              ) : null}
            </Row>
          ) : (
            <Row>
              <Col span={24} className="px-2">
                <Form.Item
                  hasFeedback
                  name="appsNumber"
                  label="عدد الطلبات المسموح بها"
                >
                  {getFieldDecorator("appsNumber", {
                    rules: [
                      // {
                      //   required: true,
                      //   message: "من فضلك ادخل عدد الطلبات المسموح بها",
                      // },
                    ],
                    initialValue: props.rowdata.max_request_no,
                  })(
                    <Input
                      type="number"
                      onChange={handleAppsNumber}
                      name="appsNumber"
                      value={appsNumber}
                      placeholder="ادخل عدد الطلبات المسموح بها"
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          )}
          <Button className="cancelbtn" onClick={closeModal}>
            اغلاق
          </Button>
          <Button
            className="addbtn"
            onClick={
              props.title == "municipality"
                ? editMun
                : props.title == "nationalities"
                ? editNationality
                : props.title == "applications"
                ? editApps
                : props.title == "issuerstype"
                ? editIssuerType
                : editJobTitle
            }
          >
            حفظ
          </Button>
        </Form>
      </Container>
    </Modal>
  );
}
export default EditModal;
