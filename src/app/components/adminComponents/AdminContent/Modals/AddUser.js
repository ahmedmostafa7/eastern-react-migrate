import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Container } from "react-bootstrap";
import {
  Form,
  Row,
  Col,
  Input,
  message,
  Checkbox,
  Button,
  Radio,
  notification,
  Select,
} from "antd";
function AddUser(props) {
  const [userTypes] = useState([
    { name: "مستخدم أمانة", id: 2 },
    { name: "مستخدم بلدية", id: 1 },
    // { name: "مستخدم مكتب هندسي", id: 3 },
    // { name: "مستخدم جهة إصدار", id: 4 },
  ]);
  console.log("ro", props.rowdata);
  const [selectedUserType, setUserType] = useState({});
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedGroupsIds, setSelectedGroupsIds] = useState(null);
  const [selectedDepartment, setSelectDepartment] = useState(null);
  const [selectedDepartmentId, setSelectDepartmentId] = useState(null);
  const [currentValueRadio, setcurrentValueRadio] = useState(null);
  const [selectedJobTitle, setSelectJobTitle] = useState(null);
  const [selectedJobTitleId, setSelectJobTitleId] = useState(null);
  const [disableUserType, setDisableUserType] = useState(false);
  const [muncipilities, setMuncipility] = useState([]);
  const [muncipilitiesId, setMuncipilityId] = useState(null);
  const [selectedMuncipility, setSelectMuncipility] = useState(null);
  const [engOffices, setEngOffice] = useState([]);
  const [engOfficesId, setEngOfficeId] = useState();
  const [selectedEngOffice, setSelectEngOffice] = useState(undefined);
  const [selectedEngOfficeId, setSelectEngOfficeId] = useState(undefined);
  const [issuers, setissuers] = useState([]);
  const [selectedIssuer, setSelectIssuer] = useState(undefined);
  const [selectedIssuerId, setSelectIssuerId] = useState(null);
  const [finalGroups, setFinalGroups] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobTitles, setjobTitles] = useState([]);
  const [submunicipilty_id, setSubMunId] = useState([]);
  const [subMuns, setSubMuns] = useState([]);

  const [confirmDirty, setConfirmDirty] = useState(false);
  const [firstCheckboxsValue, setfirstCheckboxs] = useState({});
  const [secCheckboxsValue, setSecCheckboxs] = useState({});
  const [formValues, setFormValues] = useState({
    name: "",
    userName: "",
    password: "",
    rePassword: "",
    phone: "",
    mobile: "",
    address: "",
    email: "",
  });
  const [unique, setUnique] = useState(true);
  const [uniqueError, setUniqueError] = useState("");
  const [uniqueEmail, setUniqueEmail] = useState(true);
  const [firstChecked, setfirstChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);
  const [uniqueErrorEmial, setUniqueErrorEmail] = useState("");
  const handleUserAddress = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  const handleUserInput = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    if (e.target.name == "username") {
      axios
        .get(
          window.host +
            `/api/user/CheckUnique/?key=username&q=${e.target.value}`,
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
    }
    if (e.target.name == "email") {
      axios
        .get(
          window.host + `/api/user/CheckUnique/?key=email&q=${e.target.value}`,
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
            setUniqueEmail(true);
            setUniqueErrorEmail("");
          }
        })
        .catch((error) => {
          if (error.response.status === 302) {
            setUniqueEmail(false);
            setUniqueErrorEmail("هذا المسمي موجود سابقا");
          }
        });
    }
    if (e.target.value.length >= 9 && e.target.name === "phone") {
      // e.target.value = e.target.value.slice(0, 12);

      setFormValues({
        ...formValues,
        phone: "966" + e.target.value,
      });
    }
    if (e.target.value.length >= 9 && e.target.name === "mobile") {
      //  e.target.value = e.target.value.slice(0, 12);

      setFormValues({
        ...formValues,
        mobile: "966" + e.target.value,
      });
    }
  };
  const handleChangeUserType = (value, e) => {
    setUserType({ name: value, id: e.key });
    // if (e.key == 1 || e.key == 2) {
  };
  const onChangeCheckbox = (value, e) => {
    if (e.target.checked) {
      setfirstCheckboxs({ ...firstCheckboxsValue, [value]: 1 });
    } else {
      setfirstCheckboxs({ ...firstCheckboxsValue, [value]: null });
    }
    // : setfirstCheckboxs({ ...firstCheckboxsValue, [value]: null });
  };
  const onChangeSecCheckbox = (value, e) => {
    if (e.target.checked) {
      setSecCheckboxs({ ...secCheckboxsValue, [value]: true });
      // setSecondChecked(true);
    } else {
      setSecCheckboxs({ ...secCheckboxsValue, [value]: false });
      // setSecondChecked(true);
    }
  };
  const handleselectSubMuncipility = (value, e) => {
    setSubMunId(e.props.id);
  };
  const handleSelectGroups = (value, e) => {
    setSelectedGroups(value);
    // console.log(e);

    // if (value.includes("selectAll")) {
    //   setSelectedGroup(groups.map((g) => g.name));
    //   // setFinalGroups(groups);
    // } else {

    // setSelectedGroup(e.props.id);
    // let groupsId=groups.map((g) =>)
    // setGroupsId(ee)
    let selectedgroups = [];

    selectedgroups = groups.filter((g) => {
      return e.find((x) => x.key == g.id);
    });
    setSelectedGroupsIds(selectedgroups);
    // console.log(groups.map((g) => e.map((x) => (x.key == g.id ? g : null))));

    // }
  };
  const filterGroupsArrayForEdit = (groupsSel) => {
    if (groups.length > 0) {
      // let ids = props?.rowdata?.groups && groupsSel?.map((g) => g.id);
      return groupsSel.map((d) => d.name);
    }
  };
  const filterSubMunForEdit = (groupsSel) => {
    if (groupsSel && subMuns.length > 0) {
      // let ids = props?.rowdata?.groups && groupsSel?.map((g) => g.id);
      return groupsSel.map((d) => d.name);
    }
  };
  const filterPositionIdArray = (id) => {
    if (jobTitles.length > 0)
      return jobTitles.filter((d) => d.id == id)[0]?.name;
  };
  const filtermunArrayForEdit = (id) => {
    if (muncipilities.length > 0)
      return muncipilities.filter((d) => d.id == id)[0]?.name;
  };

  const filterDepartmentArrayForEdit = (id) => {
    if (departments.length > 0)
      return departments.filter((d) => d.id == id)[0]?.name;
  };
  const filterIssuerIdArray = (id) => {
    if (issuers.length > 0) return issuers.filter((d) => d.id == id)[0]?.name;
  };
  const filteEngOffIdArray = (id) => {
    if (engOffices.length > 0)
      return engOffices.filter((d) => d.id == id)[0]?.name;
  };
  // const onChangeRadio = (value, e) => {
  //   console.log("ra", value, e);
  //   setِِِActivated(value.target.value);
  // };
  const handleSelectDepartment = (value, e) => {
    setSelectDepartment(value);
    setSelectDepartmentId(e.props.id);
  };
  const handleselectMuncipility = (value, e) => {
    setSelectMuncipility(value);
    setMuncipilityId(e.props.id);
  };
  const handleselectEngOffice = (value, e) => {
    setSelectEngOffice(value);
    setEngOfficeId(e.props.id);
  };
  const handleselectIssuer = (value, e) => {
    setSelectIssuer(value);
    setSelectIssuerId(e.props.id);
  };
  const handleSelectJobTitle = (value, e) => {
    setSelectJobTitle(value);
    setSelectJobTitleId(e.props.id);
  };

  const firstCheckOptions = [
    { label: "مدير مسارات العمل", value: "is_workflow_admin" },
    { label: "مدير ادارة النظام", value: "is_super_admin" },
    { label: "قراءة فقط", value: "is_readonly" },
  ];
  const secCheckOptions = [
    {
      label: " مدير ادارة تطبيق مهامى",
      value: "is_mahamy_admin",
    },
    {
      label: " مدير تطبيق مهامى",
      value: "is_mahamy_director",
    },
    {
      label: "الارشيف",
      value: "is_readarchive",
    },
  ];
  useEffect(() => {
    // setFormValues({});
    axios.get(`${window.host}/api/group?page=0&pageSize=100000`).then((res) => {
      setGroups(res.data.results);
    });
    axios
      .get(`${window.host}/api/department?page=0&pageSize=100000000`)
      .then((res) => {
        setDepartments(res.data.results);
      });
    axios
      .get(`${window.host}/api/position?page=0&pageSize=100000000`)
      .then((res) => {
        setjobTitles(res.data.results);
      });
    // }
    // if (e.key == 2) {
    axios
      .get(`${window.host}/api/municipality?page=0&pageSize=100000000`)
      .then((res) => {
        setMuncipility(res.data.results);
      });
    axios
      .get(`${window.host}/api/submunicipality?page=0&pageSize=100000000`)
      .then((res) => {
        setSubMuns(res.data.results);
      });
  }, []);
  const confirmationAdd = () => {
    const args = {
      description: `تم ${
        props.removePasswordField ? "تعديل" : "اضافة"
      } المستخدم بنجاح`,
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
  };
  const addUser = (e) => {
    // let request = {};
    let dataSec = {
      is_mahamy_admin: props?.rowdata?.is_mahamy_admin,
      is_mahamy_director: props?.rowdata?.is_mahamy_director,
      is_readarchive: props?.rowdata?.is_readarchive,
      is_super_admin: props?.rowdata?.is_super_admin,
      is_workflow_admin: props?.rowdata?.is_workflow_admin,
      is_readonly: props?.rowdata?.is_readonly,
    };
    // let dataFirst = {
    // };
    // let firstCheckboxes = firstCheckboxsValue?.reduce(
    //   (a, v) => ({ ...a, [v]: 1 }),
    //   {}
    // );
    // let secondCheckboxes = secCheckboxsValue?.reduce(
    //   (a, v) => ({ ...a, [v]: true }),
    //   {}
    // );
    // let st1 = firstChecked ? { ...firstCheckboxsValue } : { ...dataFirst };
    // let st2 = secondChecked ? { ...secCheckboxsValue } : { ...dataSec };

    let request = {
      ...props.rowdata,
      ...firstCheckboxsValue,
      ...secCheckboxsValue,
      // ...editCheckboxs,

      name: formValues?.name || props?.rowdata?.name,
      address: formValues?.address || props?.rowdata?.address,
      email: formValues?.email || props?.rowdata?.email,
      password: formValues?.password,
      confirmPass: formValues?.rePassword,

      // is_active: currentValueRadio || props?.rowdata?.is_active,
      username: formValues?.userName || props?.rowdata?.username,
      minicipality_id: muncipilitiesId || props?.rowdata?.minicipality_id,

      issuer_id: selectedIssuerId || props?.rowdata?.issuer_id,
      engcompany_id: engOfficesId || props?.rowdata?.engcompany_id,
      province_id: 2,
      groups: selectedGroupsIds || props?.rowdata?.groups,
      mobile: formValues?.mobile || props?.rowdata?.mobile,
      phone: formValues?.phone || props?.rowdata?.phone,
      position_id: selectedJobTitleId || props?.rowdata?.position_id,
      department_id: selectedDepartmentId || props?.rowdata?.department_id,
      engineering_companies: null,
    };

    if (
      request?.name &&
      request?.mobile &&
      request?.email &&
      (request?.engcompany_id || request.position_id || request.groups)
    ) {
      if (props?.removePasswordField) {
        let newData = {
          ...dataSec,
          ...request,
        };
        axios
          .put(
            window.host + `/api/user/${props?.rowdata?.id}`,
            request,
            // { name: name, approving_dep: approving_dep },
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
                confirmationAdd()
              )
          );
        props.closeAdd();
      } else {
        axios
          .post(
            window.host + "/api/user",
            request,
            // { name: name, approving_dep: approving_dep },
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
                confirmationAdd()
              )
          );
        props.closeAdd();
      }
    } else {
      message.error("من فضلك أكمل البيانات");
    }
    setFormValues({});
  };
  const filterUserType = (mun, engId) => {
    if (engId) {
      // setDisableUserType(true);
      return "مكتب هندسى";
    } else if (mun) {
      return "مستخدم بلدية";
    } else {
      return "مستخدم أمانة";
    }
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
          <h5 className="px-5 pt-4">إضافة مستخدم جديد</h5>
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
                rules={[
                  {
                    message: "من فضلك ادخل نوع المستخدم",
                    required: true,
                  },
                ]}
                name="selectedUserType"
                hasFeedback
                label="نوع المستخدم"
              >
                {getFieldDecorator("selectedUserType", {
                  rules: [
                    { required: true, message: "من فضلك ادخل نوع المستخدم" },
                  ],
                  initialValue: filterUserType(
                    props?.rowdata?.minicipality_id,
                    props?.rowdata?.engcompany_id
                  ),
                })(
                  <Select
                    virtual={false}
                    showSearch
                    allowClear
                    disabled={props?.rowdata?.engcompany_id}
                    value={selectedUserType.name}
                    onChange={handleChangeUserType}
                    placeholder="اختر نوع المستخدم"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {userTypes && userTypes.length !== 0
                      ? userTypes.map((inq, index) => (
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
              <Form.Item name="name" hasFeedback label="الاسم">
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "من فضلك ادخل الاسم" }],
                  initialValue: props?.rowdata?.name,
                })(
                  <Input
                    name="name"
                    onChange={handleUserInput}
                    value={formValues.name}
                    placeholder="الاسم"
                  />
                )}
              </Form.Item>
            </Col>
            {!props?.removePasswordField && (
              <Col span={24} className="px-2">
                <Form.Item name="userName" hasFeedback label="اسم المستخدم">
                  {getFieldDecorator("userName", {
                    rules: [
                      { required: true, message: "من فضلك ادخل اسم المستخدم" },
                    ],
                    initialValue: props?.rowdata?.username,
                  })(
                    <Input
                      name="userName"
                      onChange={handleUserInput}
                      value={formValues.userName}
                      placeholder="اسم المستخدم"
                    />
                  )}
                </Form.Item>
                {uniqueError ? (
                  <p style={{ color: "#c0392b" }}>{uniqueError}</p>
                ) : null}
              </Col>
            )}
            {!props.removePasswordField && (
              <div>
                <Col span={24} className="px-2">
                  <Form.Item
                    className="passwordInputt"
                    name="password"
                    hasFeedback
                    label="كلمة المرور "
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
                          message: "من فضلك أدخل كلمة المرور",
                        },
                        {
                          validator: validateToNextPassword,
                        },
                      ],
                    })(
                      <Input.Password
                        size="large"
                        name="password"
                        onChange={handleUserInput}
                        value={formValues.password}
                        placeholder="ادخل كلمة المرور"
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={24} className="px-2">
                  <Form.Item
                    className="passwordInputt"
                    dependencies={["password"]}
                    name="rePassword"
                    hasFeedback
                    label="تأكيد كلمة المرور "
                  >
                    {getFieldDecorator("rePassword", {
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
                        name="rePassword"
                        onChange={handleUserInput}
                        value={formValues.rePassword}
                        placeholder="ادخل تأكيد كلمة المرور"
                        onBlur={handleConfirmBlur}
                      />
                    )}
                  </Form.Item>
                </Col>
              </div>
            )}
            <Col span={24} className="px-2 phoneNum">
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
                  initialValue: props?.rowdata?.phone?.split("966")[1],
                })(
                  <Input
                    addonAfter="966"
                    type="number"
                    onChange={handleUserInput}
                    name="phone"
                    value={formValues.phone}
                    placeholder="ادخل رقم الهاتف"
                  />
                )}
              </Form.Item>
            </Col>{" "}
            <Col span={24} className="px-2 phoneNum">
              <Form.Item name="mobile" hasFeedback label="رقم الجوال">
                {getFieldDecorator("mobile", {
                  rules: [
                    { required: true, message: "من فضلك ادخل رقم الجوال" },
                    {
                      message: "من فضلك أدخل رقم الجوال",
                      required: true,
                      max: "9999",
                    },
                    {
                      max: 9,
                      message: "رقم الجوال لا يزيد عن 9 أرقام",
                    },
                    {
                      min: 9,
                      message: "رقم الجوال لا يقل عن 9 أرقام",
                    },
                    // {
                    //   pattern: new RegExp(/^5/),
                    //   message: "يجب أن يبدأ رقم الجوال بالرقم 5",
                    // },
                  ],
                  initialValue: props?.rowdata?.mobile?.split("966")[1],
                })(
                  <Input
                    addonAfter="966"
                    type="number"
                    onChange={handleUserInput}
                    name="mobile"
                    value={formValues.mobile}
                    placeholder="ادخل رقم الجوال"
                  />
                )}
              </Form.Item>
            </Col>{" "}
            <Col span={24} className="px-2">
              <Form.Item name="email" hasFeedback label="البريد الالكتروني">
                {getFieldDecorator("email", {
                  rules: [
                    {
                      required: true,
                      message: "من فضلك ادخل البريد الالكتروني ",
                    },
                  ],
                  initialValue: props?.rowdata?.email,
                })(
                  <Input
                    name="email"
                    onChange={handleUserInput}
                    value={formValues.email}
                    placeholder="البريد الالكتروني"
                  />
                )}
              </Form.Item>
              {uniqueErrorEmial ? (
                <p style={{ color: "#c0392b" }}>{uniqueErrorEmial}</p>
              ) : null}
            </Col>
            <Col span={24} className="px-2">
              <Form.Item name="address" hasFeedback label="العنوان ">
                {getFieldDecorator("address", {
                  rules: [
                    // { required: true, message: "من فضلك ادخل اسم المستخدم" },
                  ],
                  initialValue: props?.rowdata?.address,
                })(
                  <Input
                    name="address"
                    onChange={handleUserAddress}
                    value={formValues.address}
                    placeholder="العنوان"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <div
                style={{
                  display: "flex",
                  direction: "rtl",
                  fontWeight: "bold",
                  alignItems: "center",
                  padding: "5px",
                }}
              >
                <Checkbox
                  defaultChecked={props?.rowdata?.is_workflow_admin}
                  onChange={onChangeCheckbox.bind(this, "is_workflow_admin")}
                ></Checkbox>
                مدير مسارات العمل
              </div>
            </Col>
            <Col span={24} className="px-2">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  direction: "rtl",
                  fontWeight: "bold",
                }}
              >
                <Checkbox
                  defaultChecked={props?.rowdata?.is_super_admin}
                  onChange={onChangeCheckbox.bind(this, "is_super_admin")}
                ></Checkbox>
                مدير ادارة النظام
              </div>
            </Col>
            <Col span={24} className="px-2">
              <div
                style={{
                  display: "flex",
                  direction: "rtl",
                  fontWeight: "bold",
                }}
              >
                <Checkbox
                  defaultChecked={props?.rowdata?.is_readonly}
                  onChange={onChangeCheckbox.bind(this, "is_readonly")}
                ></Checkbox>
                قرءاه فقط
              </div>
            </Col>
            <Col span={24} className="px-2">
              <div
                style={{
                  display: "flex",
                  direction: "rtl",
                  fontWeight: "bold",
                }}
              >
                <Checkbox
                  defaultChecked={props?.rowdata?.is_mahamy_admin}
                  onChange={onChangeSecCheckbox.bind(this, "is_mahamy_admin")}
                ></Checkbox>
                مدير ادارة تطبيق مهامى
              </div>
            </Col>
            <Col span={24} className="px-2">
              <div
                style={{
                  display: "flex",
                  direction: "rtl",
                  fontWeight: "bold",
                }}
              >
                <Checkbox
                  defaultChecked={props?.rowdata?.is_mahamy_director}
                  onChange={onChangeSecCheckbox.bind(
                    this,
                    "is_mahamy_director"
                  )}
                ></Checkbox>
                مدير تطبيق مهامى
              </div>
            </Col>
            <Col span={24} className="px-2">
              <div
                style={{
                  display: "flex",
                  direction: "rtl",
                  fontWeight: "bold",
                }}
              >
                <Checkbox
                  defaultChecked={props?.rowdata?.is_readarchive}
                  onChange={onChangeSecCheckbox.bind(this, "is_readarchive")}
                ></Checkbox>
                الارشيف
              </div>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item
                rules={[
                  {
                    message: "من فضلك ادخل المجموعات",
                    required: true,
                  },
                ]}
                name="selectedGroups"
                hasFeedback
                label="المجموعات"
              >
                {getFieldDecorator("selectedGroups", {
                  rules: [{ required: true, message: "من فضلك ادخل الإسم" }],
                  initialValue:
                    props?.rowdata?.groups &&
                    filterGroupsArrayForEdit(props?.rowdata?.groups),
                })(
                  <Select
                    showSearch
                    allowClear
                    value={selectedGroups}
                    mode="multiple"
                    onChange={handleSelectGroups}
                    placeholder="اختر المجموعات"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {groups && groups.length !== 0
                      ? groups.map((inq, index) => (
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
            {props?.rowdata?.minicipality_id || selectedUserType?.id == 1 ? (
              <div>
                <Col span={24} className="px-2">
                  <Form.Item
                    rules={[
                      {
                        message: "من فضلك ادخل البلدية",
                        required: true,
                      },
                    ]}
                    name="selectedMuncipility"
                    hasFeedback
                    label="البلدية"
                  >
                    {getFieldDecorator("selectedMuncipility", {
                      rules: [
                        { required: true, message: "من فضلك ادخل الإسم" },
                      ],
                      initialValue: filtermunArrayForEdit(
                        props?.rowdata?.minicipality_id
                      ),
                    })(
                      <Select
                        showSearch
                        allowClear
                        value={selectedMuncipility}
                        onChange={handleselectMuncipility}
                        placeholder="اختر البلدية"
                        getPopupContainer={(trigger) => trigger.parentNode}
                      >
                        {muncipilities && muncipilities.length !== 0
                          ? muncipilities.map((inq, index) => (
                              <Select.Option
                                className="selectgroup"
                                value={inq.name}
                                key={inq.id}
                                name={inq.name}
                                id={inq.id}
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
                    name="submunicipilty_id"
                    hasFeedback
                    label="البلدية الفرعية"
                  >
                    {getFieldDecorator("submunicipilty_id", {
                      initialValue: filterSubMunForEdit(
                        props?.rowdata?.submunicipilty_id
                      ),
                    })(
                      <Select
                        showSearch
                        allowClear
                        disabled={
                          !props?.rowdata?.minicipality_id || !muncipilitiesId
                            ? true
                            : false
                        }
                        value={submunicipilty_id}
                        onChange={handleselectSubMuncipility}
                        placeholder="اختر البلدية الفرعية"
                        getPopupContainer={(trigger) => trigger.parentNode}
                      >
                        {subMuns && subMuns.length !== 0
                          ? subMuns
                              .filter(
                                (x) => x.municipality_id == muncipilitiesId
                              )
                              .map((inq, index) => (
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
              </div>
            ) : null}
            {props?.rowdata?.engcompany_id ? null : (
              <div>
                <Col span={24} className="px-2">
                  <Form.Item
                    rules={[
                      {
                        message: "من فضلك ادخل القسم",
                        required: true,
                      },
                    ]}
                    name="selectedDepartment"
                    hasFeedback
                    label="القسم"
                  >
                    {getFieldDecorator("selectedDepartment", {
                      rules: [
                        { required: true, message: "من فضلك ادخل القسم" },
                      ],
                      initialValue: filterDepartmentArrayForEdit(
                        props?.rowdata?.department_id
                      ),
                    })(
                      <Select
                        showSearch
                        allowClear
                        value={selectedDepartment}
                        onChange={handleSelectDepartment}
                        placeholder="اختر القسم"
                        getPopupContainer={(trigger) => trigger.parentNode}
                      >
                        {departments && departments.length !== 0
                          ? departments.map((inq, index) => (
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
                  <Form.Item
                    rules={[
                      {
                        message: "من فضلك ادخل المسمي الوظيفي",
                        required: true,
                      },
                    ]}
                    name="selectedJobTitle"
                    hasFeedback
                    label="المسمي الوظيفي"
                  >
                    {getFieldDecorator("selectedJobTitle", {
                      rules: [
                        { required: true, message: "من فضلك ادخل الإسم" },
                      ],
                      initialValue: filterPositionIdArray(
                        props?.rowdata?.position_id
                      ),
                    })(
                      <Select
                        showSearch
                        allowClear
                        value={selectedJobTitle}
                        onChange={handleSelectJobTitle}
                        placeholder="اختر المسمي الوظيفي"
                        getPopupContainer={(trigger) => trigger.parentNode}
                      >
                        {jobTitles && jobTitles.length !== 0
                          ? jobTitles.map((inq, index) => (
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
              </div>
            )}
            {/* {selectedUserType.id == 3 ? (
              <Col span={24} className="px-2">
                <Form.Item
                  rules={[
                    {
                      message: "من فضلك ادخل المكتب الهندسي",
                      required: true,
                    },
                  ]}
                  name="selectedEngOffice"
                  hasFeedback
                  label="المكتب الهندسي"
                >
                  {getFieldDecorator("selectedEngOffice", {
                    rules: [{ required: true, message: "من فضلك ادخل الإسم" }],
                    initialValue: filteEngOffIdArray(
                      props?.rowdata?.engcompany_id
                    ),
                  })(
                    <Select
                      showSearch
                      allowClear
                      value={selectedEngOffice}
                      onChange={handleselectEngOffice}
                      placeholder="اختر المكتب الهندسي"
                      getPopupContainer={(trigger) => trigger.parentNode}
                    >
                      {engOffices && engOffices.length !== 0
                        ? engOffices.map((inq, index) => (
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
            ) : null}{" "}
            {selectedUserType.id == 4 ? (
              <Col span={24} className="px-2">
                <Form.Item
                  rules={[
                    {
                      message: "من فضلك ادخل اسم الجهة",
                      required: true,
                    },
                  ]}
                  name="selectedIssuer"
                  hasFeedback
                  label="اسم الجهة"
                >
                  {getFieldDecorator("selectedIssuer", {
                    rules: [{ required: true, message: "من فضلك ادخل الإسم" }],
                    initialValue: filterIssuerIdArray(
                      props?.rowdata?.issuer_id
                    ),
                  })(
                    <Select
                      showSearch
                      allowClear
                      value={selectedIssuer}
                      onChange={handleselectIssuer}
                      placeholder="اختر اسم الجهة"
                      getPopupContainer={(trigger) => trigger.parentNode}
                    >
                      {issuers && issuers.length !== 0
                        ? issuers.map((inq, index) => (
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
            ) : null} */}
          </Row>
          <Button className="cancelbtn" onClick={props.closeAdd}>
            اغلاق
          </Button>
          <Button className="addbtn" onClick={addUser}>
            حفظ
          </Button>
        </Form>
      </Container>
    </Modal>
  );
}
export default AddUser;
