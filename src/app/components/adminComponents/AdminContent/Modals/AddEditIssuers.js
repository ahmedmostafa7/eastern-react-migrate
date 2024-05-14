import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Container } from "react-bootstrap";
import {
  Form,
  Row,
  Col,
  Table,
  InputNumber,
  Input,
  Radio,
  Checkbox,
  Button,
  message,
  span,
  notification,
  Select,
} from "antd";

import { set } from "lodash";
import { withTranslation } from "react-i18next";
function AddEditIssuers(props) {
  const { getFieldDecorator } = props.form;
  const [name, setName] = useState("");
  const [exportNo, setExportNo] = useState("");
  const [email, setEmail] = useState("");
  const [unique, setUnique] = useState(true);
  const [uniqueError, setUniqueError] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [vpn, setValidatePhoneNumber] = useState("");
  const [issuerTypeId, setIssuerTypeId] = useState("");
  const [munId, setMunId] = useState("");
  const [issuerTypes, setIssuerType] = useState([]);
  const [municipalities, setMuncipility] = useState([]);
  useEffect(() => {
    let issuerType = axios.get(window.host + "/api/issuerstype", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
    });
    let municipality = axios.get(window.host + "/api/municipality", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
    });
    axios.all([issuerType, municipality]).then(
      axios.spread((issReq, munReq) => {
        {
          setIssuerType(issReq.data.results);
          setMuncipility(munReq.data.results);
        }
      })
    );
  }, []);
  const handleIsserName = (e) => {
    setName(e.target.value);
    axios
      .get(
        window.host + `/api/issuer/CheckUnique/?key=name&q=${e.target.value}`,
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
          // setName(e.target.value);
          setUniqueError("");
        }
      })
      .catch((err) => {
        if (err?.response?.status === 302) {
          setUnique(false);
          setUniqueError("هذا المسمي موجود سابقا");
        }
      });
  };
  const handleUserCode = (e) => {
    setCode(e);
  };
  const handleselectMuncipility = (value, e) => {
    setMunId(e.props.id);
  };
  const handleselectIssuer = (value, e) => {
    setIssuerTypeId(e.props.id);
  };
  const handleUserAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleUserPhone = (e) => {
    setPhone(e.target.value);
  };
  const handleUserFax = (e) => {
    setFax(e);
  };
  const handleUserEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleUserWebsite = (e) => {
    setWebsite(e.target.value);
  };
  const handleUserExportNo = (e) => {
    setExportNo(e.target.value);
  };
  const addEditIssuer = () => {
    // if (phone.length != 10) {
    //   message.error("رقم الهاتف غير صحيح");
    // } else {
    //   setValidatePhoneNumber(966 + phone);
    // }
    let data = {
      ...props.rowdata,
      name: name || props.rowdata.name,
      phone: "966" + phone || props?.rowdata?.phone,
      fax: fax || props?.rowdata?.fax,
      address: address || props?.rowdata?.address,
      website: website || props?.rowdata?.website,
      export_id: exportNo || props?.rowdata?.export_id,
      type_id: issuerTypeId || props?.rowdata?.issuers_type?.id,
      municipality_id: munId || props?.rowdata?.municipalities?.id,
      email: email || props?.rowdata?.email,
      code: code || props?.rowdata?.code,
    };
    if (
      data.name &&
      data.code &&
      data.export_id &&
      data.type_id &&
      data.municipality_id
    ) {
      if (props?.rowdata) {
        axios
          .put(window.host + `/api/issuer/${props.rowdata.id}`, data, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
          })
          .then((res) => {
            axios
              .get(window.host + "/api/issuer", {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${localStorage.token}`,
                },
              })
              .then((res1) => {
                props.getTableData(props.columns, res1.data, res1.data.count),
                  props.close();
                message.success("تم التعديل بنجاح");
              });
          });
      } else {
        axios
          .post(window.host + `/api/issuer/`, data, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
          })
          .then((res) =>
            axios
              .get(window.host + "/api/issuer", {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${localStorage.token}`,
                },
              })
              .then((res1) => {
                props.getTableData(props.columns, res1.data, res1.data.count),
                  props.close();
                message.success("تم الاضافة بنجاح");
              })
          );
      }
    } else {
      message.error("من فضلك أكمل البيانات");
    }
    console.log(data);
  };
  return (
    <div>
      <div>
        <form
          className=""
          layout="vertical"
          // onSubmit={addGroup}
          name="validate_other"
        >
          <Row>
            <Col span={24} className="px-2">
              <Form.Item name="name" hasFeedback label="الاسم">
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "من فضلك ادخل الاسم" }],
                  initialValue: props.rowdata?.name,
                })(
                  <Input
                    name="name"
                    onChange={handleIsserName}
                    value={name}
                    placeholder="الاسم"
                  />
                )}
              </Form.Item>
              {uniqueError ? (
                <p style={{ color: "#c0392b" }}>{uniqueError}</p>
              ) : null}
            </Col>
            <Col span={24} className="px-2">
              <Form.Item name="code" hasFeedback label="كود الجهه">
                {getFieldDecorator("code", {
                  rules: [
                    { required: true, message: "من فضلك ادخل كود الجهة" },
                  ],
                  initialValue: props.rowdata?.code,
                })(
                  <InputNumber
                    name="code"
                    onChange={handleUserCode}
                    value={code}
                    placeholder="كود الجهة"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item name="exportNo" hasFeedback label="رقم الصادر ">
                {getFieldDecorator("exportNo", {
                  rules: [
                    { required: true, message: "من فضلك ادخل رقم الصادر" },
                  ],
                  initialValue: props.rowdata?.export_id,
                })(
                  <Input
                    name="exportNo"
                    onChange={handleUserExportNo}
                    value={exportNo}
                    placeholder="رقم الصادر "
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item
                name="selectedIssuer"
                hasFeedback
                label="نوع جهة الاصدار"
              >
                {getFieldDecorator("selectedIssuer", {
                  rules: [
                    {
                      message: "من فضلك ادخل جهة الاصدار",
                      required: true,
                    },
                  ],
                  initialValue: props?.rowdata?.issuers_type?.name,
                })(
                  <Select
                    virtual={false}
                    showSearch
                    allowClear
                    onChange={handleselectIssuer}
                    placeholder="اختر نوع جهة الاصدار"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {issuerTypes && issuerTypes.length !== 0
                      ? issuerTypes.map((inq, index) => (
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
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item name="selectedMun" hasFeedback label="البلدية">
                {getFieldDecorator("selectedMun", {
                  rules: [
                    {
                      message: "من فضلك ادخل البلدية",
                      required: true,
                    },
                  ],
                  initialValue: props?.rowdata?.municipalities?.name,
                })(
                  <Select
                    showSearch
                    allowClear
                    // value={selectedJobs}
                    // mode="multiple"
                    onChange={handleselectMuncipility}
                    placeholder="اختر البلدية"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {municipalities && municipalities.length !== 0
                      ? municipalities.map((inq, index) => (
                          <Select.Option
                            className="selectgroup"
                            value={inq.name}
                            key={inq.id}
                            name={inq.name}
                            id={inq.id}
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
              <Form.Item name="address" hasFeedback label="العنوان">
                {getFieldDecorator("address", {
                  rules: [{ required: true, message: "من فضلك ادخل العنوان" }],
                  initialValue: props.rowdata?.address,
                })(
                  <Input
                    name="name"
                    onChange={handleUserAddress}
                    value={address}
                    placeholder="العنوان"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item name="phone" hasFeedback label="رقم الهاتف">
                {getFieldDecorator("phone", {
                  rules: [
                    // { required: true, message: "من فضلك ادخل رقم الهاتف" },
                    // {
                    //   message: "من فضلك أدخل رقم الهاتف",
                    //   required: true,
                    // },
                    {
                      max: 9,
                      message: "رقم الهاتف لا يزيد عن 9 أرقام",
                    },
                    {
                      min: 9,
                      message: "رقم الهاتف لا يقل عن 9 أرقام",
                    },
                  ],
                  initialValue: props?.rowdata?.phone
                    ?.toString()
                    .split("966")[1],
                })(
                  <Input
                    addonBefore="966"
                    type="number"
                    onChange={handleUserPhone}
                    name="phone"
                    value={phone}
                    placeholder="ادخل رقم الهاتف"
                  />
                )}
              </Form.Item>
              {/* })(
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gridGap: "10px",
                    }}
                  >
                    <div
                      style={{
                        background: "#ddd",
                        padding: "3px",
                        borderRadius: "5px",
                        margin: "1vh 0 0 7vh",
                        alignItems: "center",
                        direction: "ltr",
                      }}
                    >
                      +966
                    </div>
                    <InputNumber
                      name="phone"
                      min={1}
                      onChange={handleUserPhone}
                      value={phone}
                      addonAfter="966"
                      placeholder="رقم الهاتف (5xxxxxxxx) "
                    />
                  </div>
                )}
              </Form.Item> */}
            </Col>
            <Col span={24} className="px-2">
              <Form.Item name="fax" hasFeedback label="الفاكس">
                {getFieldDecorator("fax", {
                  // rules: [{ required: true, message: "من فضلك ادخل الفاكس " }],
                  initialValue: props.rowdata?.fax,
                  maxLength: 15,
                })(
                  <InputNumber
                    name="fax"
                    // min={1}
                    onChange={handleUserFax}
                    value={fax}
                    placeholder="الفاكس  "
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item name="email" hasFeedback label="البريد الالكتروني">
                {getFieldDecorator("email", {
                  rules: [
                    {
                      type: "email",
                      required: true,
                      message: "من فضلك ادخل البريد الالكترونى",
                    },
                  ],
                  initialValue: props.rowdata?.email,
                })(
                  <Input
                    name="name"
                    onChange={handleUserEmail}
                    value={email}
                    placeholder="البريد الالكتروني"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item name="website" hasFeedback label="الموقع الالكترونى">
                {getFieldDecorator("website", {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: "من فضلك ادخل الموقع الالكترونى",
                  //   },
                  // ],
                  initialValue: props.rowdata?.website,
                })(
                  <Input
                    name="website"
                    onChange={handleUserWebsite}
                    value={website}
                    placeholder="الموقع الالكترونى"
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
              <Button className="addbtn" onClick={addEditIssuer}>
                حفظ
              </Button>
            </Form.Item>
          </Row>
        </form>
      </div>
    </div>
  );
}
// export default AddEditIssuers;
export default AddEditIssuers;
