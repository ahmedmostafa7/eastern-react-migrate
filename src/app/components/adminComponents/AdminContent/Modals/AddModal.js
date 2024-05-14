import React, { useEffect, useState } from "react";
import { Modal, Container } from "react-bootstrap";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  InputNumber,
  notification,
  Select,
  Checkbox,
} from "antd";
// import Loader from "../../../containers/Loader";
import axios from "axios";
function AddModal(props) {
  const [name, setName] = useState("");
  const [unique, setUnique] = useState(true);
  const [uniqueError, setUniqueError] = useState("");
  const [codeNum, setMunCode] = useState(null);
  const [nationalty_type_id, setTypeId] = useState(null);
  const [munClassId, setMunClass] = useState(null);
  const [code, setCityBelong] = useState(null);
  const [city_id, setCityId] = useState(null);
  const [city_name_a, setCityName] = useState(null);
  const [amana, setAmana] = useState("امانة المنطقة الشرقية");
  const [munCLasses, setAllMunClass] = useState([]);
  const [idTypes] = useState([
    { name: "مقيم", id: 1990 },
    { name: "هوية خليجية", id: 1988 },
    { name: "هوية وطنية", id: 1890 },
  ]);
  const [checks, setCheck] = useState({
    contract_credence: null,
    elec_credence: null,
    water_credence: null,
    procuration_credence: null,
  });
  const handleCityId = (e) => {
    setCityId(e);
  };
  const handleMunCode = (e) => {
    setMunCode(e);
  };
  const handleCityBelong = (value, e) => {
    if (value) {
      setCityBelong(e.props.code);

      setCityName(e.props?.code_name);
    }
  };
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
  const confirmationAdd = () => {
    const args = {
      description: `تم إضافة ${
        props.title == "municipality"
          ? "بلدية "
          : props.title == "nationalities"
          ? "جنسية "
          : props.title == "issuerstype"
          ? "نوع جهة إصدار"
          : "مسمي وظيفي "
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
  const onCheck = (e) => {
    e.target.checked == true
      ? setCheck({ ...checks, [e.target.name]: 1 })
      : setCheck({ ...checks, [e.target.name]: null });
  };
  const addMun = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        axios
          .post(
            window.host + "/api/municipality",
            {
              name: name,
              mun_class_id: munClassId,
              province_id: 2,
              city_id: city_id,
              code: codeNum,
              city_code: code,
              CITY_NAME_A: code ? city_name_a : name,
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
              .then((res1) => {
                props.getTableData(props.columns, res1.data, res1.data.count);

                confirmationAdd();
              })
          );

        setName("");
        props.closeAdd();
      }
    });
  };
  const handleChangeCityBelong = (e) => {};
  const addJobTitle = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        axios
          .post(
            window.host + "/api/position",
            { name: name },
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
                confirmationAdd()
              )
          );

        setName("");
        props.closeAdd();
      }
    });
  };
  const addNationality = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        axios
          .post(
            window.host + "/api/nationalities",
            { local_name: name, nationalty_type_id: nationalty_type_id },
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
                confirmationAdd()
              )
          );

        setName("");
        props.closeAdd();
      }
    });
  };

  const closeModal = (e) => {
    setName("");
    props.closeAdd();
  };
  const addIssuerType = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        axios
          .post(
            window.host + "/api/issuerstype",
            {
              name: name,
              contract_credence: checks.contract_credence,
              elec_credence: checks.elec_credence,
              water_credence: checks.water_credence,
              procuration_credence: checks.procuration_credence,
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
                confirmationAdd()
              )
          );

        setName("");
        props.closeAdd();
      }
    });
  };
  const { getFieldDecorator, validateFields } = props.form;
  const handleChangeIdType = (value, e) => {
    setTypeId(e.key);
  };
  const handleChangeMunClass = (value, e) => {
    setMunClass(Number(e.key));
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
  console.log(props.title);
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
          <h5 className="px-5 pt-4">
            <span></span>
            إضافة
            {props.title == "municipality"
              ? " بلدية جديدة "
              : props.title == "nationalities"
              ? " جنسية جديدة "
              : props.title == "issuerstype"
              ? " نوع جهة إصدار جديدة "
              : " مسمي وظيفي جديد "}
          </h5>
        </div>
        <hr />
        <Form
          onSubmit={
            props.title == "municipality"
              ? addMun
              : props.title == "nationalities"
              ? addNationality
              : props.title == "issuerstype"
              ? addIssuerType
              : addJobTitle
          }
          className="my-4 px-md-5 regForms"
          layout="vertical"
          name="validate_other"
        >
          <Row>
            <Col span={24} className="px-2">
              {(props.title == "position" ||
                props.title == "nationalities" ||
                props.title == "municipality" ||
                props.title == "issuerstype") && (
                <Form.Item name="name" hasFeedback label="الاسم">
                  {getFieldDecorator("name", {
                    rules: [{ required: true, message: "من فضلك ادخل  الإسم" }],
                  })(
                    <Input
                      name="name"
                      onChange={handleUserInput}
                      value={name}
                      placeholder="الاسم "
                    />
                  )}
                </Form.Item>
              )}
              {(props.title == "position" ||
                props.title == "nationalities" ||
                props.title == "municipality" ||
                props.title == "issuerstype") &&
              uniqueError ? (
                <p style={{ color: "#c0392b" }}>{uniqueError}</p>
              ) : null}
            </Col>{" "}
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
                  <Form.Item name="code" hasFeedback label="كود البلدية ">
                    {getFieldDecorator("code", {
                      rules: [
                        { required: true, message: "من فضلك ادخل الكود " },
                      ],
                      // initialValue: props.rowdata?.city_code,
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
                      // initialValue: props.rowdata?.city_code,
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
              </div>
            )}
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
            ) : // </div>
            null}
            {props.title == "issuerstype" ? (
              <Col span={24}>
                <div className="checkDiv mb-2">
                  إصدار صكوك
                  <Checkbox
                    className="ml-3"
                    onChange={onCheck}
                    name="contract_credence"
                    style={{
                      lineHeight: "32px",
                    }}
                  />
                </div>{" "}
                <div className="checkDiv mb-2">
                  إصدار موافقات كهرباء
                  <Checkbox
                    className="ml-3"
                    onChange={onCheck}
                    name="elec_credence"
                    style={{
                      lineHeight: "32px",
                    }}
                  />
                </div>{" "}
                <div className="checkDiv mb-2">
                  إصدار موافقات مياة
                  <Checkbox
                    className="ml-3"
                    onChange={onCheck}
                    name="water_credence"
                    style={{
                      lineHeight: "32px",
                    }}
                  />
                </div>{" "}
                <div className="checkDiv mb-2">
                  إصدار وكالات
                  <Checkbox
                    className="ml-3"
                    onChange={onCheck}
                    name="procuration_credence"
                    style={{
                      lineHeight: "32px",
                    }}
                  />
                </div>
              </Col>
            ) : // </div>
            null}
          </Row>
          <Button className="cancelbtn" onClick={closeModal}>
            اغلاق
          </Button>
          <Button
            className="addbtn"
            htmlType="submit"
            // onClick={
            //   props.title == "municipality"
            //     ? addMun
            //     : props.title == "nationalities"
            //     ? addNationality
            //     : props.title == "issuerstype"
            //     ? addIssuerType
            //     : addJobTitle
            // }
          >
            حفظ
          </Button>
        </Form>
      </Container>
    </Modal>
  );
}
export default AddModal;
