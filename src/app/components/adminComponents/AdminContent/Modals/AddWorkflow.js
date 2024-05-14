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
  notification,
  Select,
} from "antd";
function AddWorkflow(props) {
  const [name, setName] = useState("");
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [applications, setApps] = useState([]);
  const [selectedApps, setSelectedApps] = useState({});
  const [activated, setِِِActivated] = useState(null);
  const [expire_period, setExpirePeriod] = useState();
  const [filename, setFilename] = useState();
  const [filenames, setFilenames] = useState();
  const [checkboxValues, setCheckbox] = useState();

  const [unique, setUnique] = useState(true);
  const [uniqueError, setUniqueError] = useState("");
  const [tableColumns, setTableColumns] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [appId, setAppId] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [allMod, setAllMod] = useState([]);

  const [formValues, setFormValues] = useState({});

  const handleUserInput = (e) => {
    setName(e.target.value);
    axios
      .get(
        window.host + `/api/workflow/CheckUnique/?key=name&q=${e.target.value}`,
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
  useEffect(() => {
    axios.get(`${window.host}/api/applications`).then((res) => {
      setApps(res.data.results);
      // console.log("apps",)
    });
    axios
      .get(`${window.host}/api/groups?page=0&pageSize=100000`)
      .then((res) => {
        setGroups(res.data.results);
      });
    // PrintDocument/GetAll?q=44&filter_key=app_id&operand=%3D&order=desc&page=0&pageSize=30
    console.log(applications);
    // axios
    //   .get(`${window.host}/api/appmodules?page=0&pageSize=100000`)
    //   .then((res) => {
    //     setJobs(res.data.results);
    //     console.log("jobs", jobs);
    //   });
  }, []);
  const filterGroupsArrayForEdit = (id) => {
    if (groups.length > 0) return groups.filter((d) => d.id == id)[0]?.name;
  };
  const confirmationAdd = (check) => {
    const args = {
      description:
        check == "edit"
          ? "تم تعديل مسار العمل بنجاح"
          : "تم إضافة مسار العمل بنجاح",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
  };
  const handleExpirePeriod = (value, e) => {
    setExpirePeriod(value);
  };
  const sendWorkflow = (values) => {
    let AllcheckboxValues = checkboxValues?.reduce(
      (a, v) => ({ ...a, [v]: 1 }),
      {}
    );
    // let uneditedCheckboxValues = props.rowdata.filter(
    //   (d) =>
    //     d.check_land_contract &&
    //     d.munual_map_update &&
    //     d.validate_identify_parcel
    // );
    // console.log(uneditedCheckboxValues);
    let data = {
      name: name || props.rowdata.name,
      is_deactivated: activated || props.rowdata.is_deactivated,
      expire_period: expire_period || props.rowdata.expire_period,
      print_state: filename || props.rowdata.print_state,
      group_creator: groupId || props.rowdata.group_creator,
      app_id: appId || props.rowdata.app_id,
      ...AllcheckboxValues,
    };
    //  let dataEdit = {
    //    name: props.rowdata.name,
    //    is_deactivated: props.rowdata.is_deactivatedactivated,
    //    expire_period: expire_period,
    //    print_state: filename,
    //    group_creator: groupId,
    //    app_id: appId,
    //    ...AllcheckboxValues,
    //  };
    console.log(data);
    if (data && open == "add") {
      axios
        .post(window.host + "/api/workflow", data, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((res) => {
          axios
            .get(window.host + "/api/workflow", {
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
            );
        });

      setName("");
      // checkApprove(null);

      props.closeAdd();
    }
    if (data && open == "edit") {
      axios
        .put(window.host + `/api/workflow/${props.rowdata.id}`, data, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((res) => confirmationAdd("edit"));

      setName("");
      // checkApprove(null);

      props.closeAdd();
    }
  };
  const handleSelectedGroups = (value, e) => {
    console.log("gr", value, e);
    let wholeApplication = applications.filter((x) => x.id == e.key);
    setSelectedApps(wholeApplication);
    console.log(e, value, wholeApplication);
    setGroupId(e.props.id);
  };
  const onChangeRadio = (value, e) => {
    console.log("ra", value, e);
    setِِِActivated(value.target.value);
  };
  const handleFilename = (value, e) => {
    setFilename(e.key);
    console.log("ra", value, e);
  };
  const onChangeCheckbox = (value, e) => {
    console.log("ck", value, e);
    setCheckbox(value);
  };
  const handleSelectApps = (value, e) => {
    let wholeApplication = applications.filter((x) => x.id == e.key);
    setSelectedApps(wholeApplication);
    console.log(e, value, wholeApplication);
    setAppId(e.key);
    let url = `/PrintDocument/GetAll?q=${e.key}&filter_key=app_id&operand=%3D&order=desc&page=0&pageSize=30`;
    axios.get(window.host + url).then((res) => {
      setFilenames(res.data.results?.filter((x) => x.is_main));
    });
  };

  const { getFieldDecorator } = props.form;
  const { showAdd, showEdit, open } = props;

  return (
    <Modal
      keyboard={false}
      onHide={props.closeAdd}
      show={showAdd}
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
            {open == "add" ? "إضافة مسار عمل جديد" : "تعديل مسار عمل"}
          </h5>
        </div>
        <hr />
        <form
          className="my-4 px-md-5 regForms"
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
                    onChange={handleUserInput}
                    value={formValues.name}
                    placeholder="الاسم"
                  />
                )}
              </Form.Item>
              {uniqueError ? (
                <p style={{ color: "#c0392b" }}>{uniqueError}</p>
              ) : null}
            </Col>
            <Col span={24} className="px-2">
              <Form.Item
                rules={[
                  {
                    message: "من فضلك ادخل التطبيقات",
                    required: true,
                  },
                ]}
                name="selectedApps"
                hasFeedback
                label="التطبيقات"
              >
                {getFieldDecorator("selectedApps", {
                  rules: [{ required: true, message: "من فضلك ادخل التطبيق" }],
                  initialValue:
                    props?.rowdata?.applications?.translate_ar_caption,
                })(
                  <Select
                    virtual={false}
                    showSearch
                    allowClear
                    onChange={handleSelectApps}
                    placeholder="اختر التطبيق"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {applications && applications.length !== 0
                      ? applications.map((inq, index) => (
                          <Select.Option
                            className="selectgroup"
                            value={inq.translate_ar_caption}
                            key={inq.id}
                            id={inq.id}
                          >
                            {inq.translate_ar_caption}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                )}
              </Form.Item>
            </Col>{" "}
            <Col span={24} className="px-2">
              <Form.Item
                rules={[
                  {
                    message: "من فضلك اختر المجموعات",
                    required: true,
                  },
                ]}
                name="selectedGroup"
                hasFeedback
                label="مسئول مسار العمل"
              >
                {getFieldDecorator("selectedGroup", {
                  rules: [{ required: true, message: "من فضلك ادخل الاسم" }],
                  initialValue: filterGroupsArrayForEdit(
                    props?.rowdata?.group_creator
                  ),
                })(
                  <Select
                    virtual={false}
                    showSearch
                    allowClear
                    onChange={handleSelectedGroups}
                    placeholder="اختر المجموعة"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {groups && groups.length !== 0
                      ? groups.map((gr, index) => (
                          <Select.Option
                            className="selectgroup"
                            value={gr.name}
                            key={gr.id}
                            id={gr.id}
                          >
                            {gr.name}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item name="filename" hasFeedback label="طباعة ملف">
                {getFieldDecorator("filename", {
                  rules: [
                    // { required: true, message: " من فضلك ادخل عنوان الطباعة" },
                  ],
                  initialValue: props?.rowdata?.print_state,
                })(
                  <Select
                    virtual={false}
                    showSearch
                    allowClear
                    onSelect={handleFilename}
                    placeholder="اختر عنوان طباعة الملف"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {filenames && filenames.length !== 0
                      ? filenames.map((gr, index) => (
                          <Select.Option
                            className="selectgroup"
                            value={gr.name}
                            key={gr.url}
                            id={gr.id}
                          >
                            {gr.name}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2" style={{ textAlign: "right" }}>
              <Form.Item label="الحالة">
                {getFieldDecorator("state", {
                  rules: [{ required: true, message: " من فضلك ادخل الحالة" }],
                  initialValue: props?.rowdata?.is_deactivated == null ? 0 : 1,
                })(
                  <Radio.Group onChange={onChangeRadio} value={activated}>
                    <Radio style={{ direction: "rtl" }} value={0}>
                      مفعل
                    </Radio>
                    <Radio style={{ direction: "rtl" }} value={1}>
                      غير مفعل
                    </Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item>
                {getFieldDecorator("choices", {
                  rules: [
                    // { required: true, message: " من فضلك ادخل اسم الملف" },
                  ],
                  initialValue: [
                    props?.rowdata?.check_land_contract != null &&
                      "check_land_contract",

                    props?.rowdata?.validate_identify_parcel != null &&
                      "validate_identify_parcel",
                    props?.rowdata?.munual_map_update != null &&
                      "munual_map_update",
                  ],
                })(
                  <Checkbox.Group
                    name="choices"
                    // style={{ width: "100%" }}
                    onChange={onChangeCheckbox}
                  >
                    <Checkbox
                      value={"check_land_contract"}
                      style={{ direction: "rtl" }}
                    >
                      إصدار أكثر من معاملة على الأرض
                    </Checkbox>
                    <Checkbox
                      value={"validate_identify_parcel"}
                      style={{ direction: "rtl" }}
                    >
                      {" "}
                      التحقق من الأراضى المختارة
                    </Checkbox>
                    <Checkbox
                      value={"munual_map_update"}
                      style={{ direction: "rtl" }}
                    >
                      تحديث الخريطة باليد
                    </Checkbox>
                  </Checkbox.Group>
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item
                name="expire_period"
                hasFeedback
                label="انتهاء العقد (يوم)"
              >
                {getFieldDecorator("expire_period", {
                  rules: [
                    {
                      required: true,
                      message: " من فضلك ادخل مدة انتهاء العقد",
                    },
                  ],
                  initialValue: props?.rowdata?.expire_period,
                })(
                  <InputNumber
                    name="expire_period"
                    min={1}
                    max={100}
                    defaultValue={1}
                    onChange={handleExpirePeriod}
                    value={formValues.expire_period}
                    placeholder="من فضلك ادخل مدة انتهاء العقد"
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ display: "flex" }}>
            <Form.Item>
              <Button className="cancelbtn" onClick={props.closeAdd}>
                اغلاق
              </Button>
            </Form.Item>
            <Form.Item>
              <Button className="addbtn" onClick={sendWorkflow}>
                حفظ
              </Button>
            </Form.Item>
          </Row>
        </form>
      </Container>
    </Modal>
  );
}
export default AddWorkflow;
