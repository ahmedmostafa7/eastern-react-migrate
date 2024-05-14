import React, { useEffect, useState } from "react";
import axios from "axios";
import { groupBy } from "lodash";
import { Modal, Container } from "react-bootstrap";
import {
  Form,
  Row,
  Col,
  Table,
  message,
  Input,
  Checkbox,
  Button,
  notification,
  Select,
} from "antd";
import { ArabicAppModules } from "./arabic_translate";
function AddGroup(props) {
  const [name, setName] = useState("");
  const [approving_dep, checkApprove] = useState(null);
  const [unique, setUnique] = useState(true);
  const [uniqueError, setUniqueError] = useState("");
  const [applications, setApps] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [is_mahamy, setIsMahamy] = useState(false);
  const [depId, setDepId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [appId, setAppId] = useState([]);
  const [selectedApps, setSelectedApps] = useState({});
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [allMod, setAllMod] = useState([]);

  const [formValues, setFormValues] = useState({});

  const handleUserInput = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    axios
      .get(
        window.host + `/api/Group/CheckUnique/?key=name&q=${e.target.value}`,
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
    });
    console.log(applications);
    axios
      .get(`${window.host}/api/appmodules?page=0&pageSize=100000`)
      .then((res) => {
        setJobs(
          res.data.results.map((d) => ({
            ...d,
            name: ArabicAppModules[d.name],
          }))
        );

        console.log("jobs", jobs);
      });
    axios.get(window.host + "/api/department").then((res) => {
      setDepartments(res.data.results);
    });
  }, []);
  const confirmationAdd = () => {
    const args = {
      description: "تم إضافة المجوعه بنجاح",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
  };
  const deleteGroup = (data) => {
    let deletedGr = tableData.length > 0 && tableData.filter((d) => d != data);
    setTableData(deletedGr);
  };
  const saveGroup = (values) => {
    // this.setState;
    console.log(values);

    if (formValues?.name && formValues?.groups_permissions.length > 0) {
      axios
        .post(
          window.host + "/api/group",
          {
            name: formValues?.name,
            groups_permissions: tableData,
            is_mahamy: is_mahamy,
            department_id: depId,
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
            .get(window.host + "/api/group", {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.token}`,
              },
            })
            .then((res1) => {
              props.getTableData(props.columns, res1.data, res1.data.count);
              setTableData([]);
              confirmationAdd();
            })
        );
    }

    setName("");
    checkApprove(null);

    props.closeAdd();
  };
  const filterJobs = (id) => {
    return applications?.filter((d) => d.id == id)[0]?.translate_ar_caption;
  };
  const handleSelectDeps = (value, e) => {
    setDepId(e.key);
  };

  const handleSelectApps = (value, e) => {
    let wholeApplication = applications.filter((x) => x.id == e.key);
    console.log(e, value, wholeApplication);
    setSelectedApps(wholeApplication);

    setAppId(e.key);
    if (e.key == "24") {
      setIsMahamy(true);
    }

    // let selectedG = jobs.filter((g) => {
    //   return e.find((x) => x.key == g.id);
    // });
    let jobsWithIds = selectedJobs.map((d, i) => ({
      ...d,
      app_id: e.key,
      get: 1,
      module_id: d.id,
      // id: i + 1,
      applications: selectedApps,
    }));
    let filteredJobs = jobsWithIds.map(
      ({ can_edit, css_class, id, index, settings, applications, ...d }) => d
    );
    // setSelectedJobs(filteredJobs);
    setFormValues((prevState) => ({
      ...prevState,
      groups_permissions: filteredJobs,
    }));
    // setJobs([]);
    // setSelectedJobs([]);
    console.log("dc", filteredJobs);
  };
  const handleSelectJobs = (value, e) => {
    console.log(selectedJobs);
    let selectedG = [];

    selectedG = jobs.filter((g) => {
      return e.find((x) => x.key == g.id);
    });
    setSelectedJobs(selectedG);
    let jobsWithIds = selectedG.map((d, i) => ({
      ...d,
      app_id: appId,
      get: 1,
      module_id: d.id,
      // id: i + 1,
      applications: selectedApps,
    }));
    let filteredJobs = jobsWithIds.map(
      ({ can_edit, css_class, id, index, settings, applications, ...d }) => d
    );
    setSelectedJobs(filteredJobs);
    // ...{ applications: selectedApps },
    console.log("fil", filteredJobs);
    setFormValues((prevState) => ({
      ...prevState,
      groups_permissions: filteredJobs,
    }));
    // let x = [];
    // x.push(filteredJobs);
    // localStorage.setItem("fil", JSON.stringify(x));
  };
  const addToTable = () => {
    console.log(formValues);
    // let allDataTable = tableData;

    let app = selectedApps?.map((d) => d.translate_ar_caption)[0];
    // let app_id = selectedApps?.map((d) => d.id)[0];
    // let newFormValues = { name: name, groups_permissions: "" };
    let jobs = selectedJobs?.map((d) => d.name);
    // let oldselected = Object.assign(selectedJobs);
    let oldselected = selectedJobs.map((a) => ({ ...a }));

    let appId = tableData.map((d) => d.app_id);
    let allAppIds = applications.map((d) => d.id);
    if (
      formValues.groups_permissions
        .map((d) => appId.includes(d.app_id))
        .includes(true)
    ) {
      message.info("تم الاضافة من قبل");
    } else if (!allAppIds.includes(appId)) {
      setTableData((prevState) => [
        ...prevState,
        ...formValues.groups_permissions,
      ]);
      // let overrideData = tableData.filter((x) => x.app !== app);
      // let combined = [...overrideData, dataTable];
      // setTableData(combined);
      console.log(tableData);
      // localStorage.setItem("tableData", JSON.stringify(combined));
    } else {
      // tableData.push(dataTable);
      // let groupbedData = groupBy(formValues.groups_permissions, (d) => {
      //   return d.app_id;
      // });
      setTableData(formValues.groups_permissions);
      console.log(tableData);
      // localStorage.setItem("tableData", JSON.stringify(allDataTable));
    }
    console.log(tableData);

    // allMod.push(...selectedJobs);

    // localStorage.setItem("fil", JSON.stringify(allMod));

    setTableColumns([
      { title: "الوظائف", dataIndex: "jobs", name: "jobs" },
      { title: "التطبيقات", dataIndex: "app", name: "app" },
    ]);
    // localStorage.setItem("tableCol", tableColumns);
    // if(a[])

    // data && setTableData(data);
  };
  const { getFieldDecorator } = props.form;

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
            {/* <span>
              <i
                className="fas fa-times fa-1x"
                onClick={props.closeAdd}
                style={{
                  textAlign: "left",
                  float: "left",
                  cursor: "pointer",
                }}
              ></i>
            </span> */}
            إضافة مجموعة جديدة
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
              <Form.Item name="name" hasFeedback label="الإسم">
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "من فضلك ادخل الإسم" }],
                })(
                  <Input
                    name="name"
                    onChange={handleUserInput}
                    value={formValues.name}
                    placeholder="الإسم"
                  />
                )}
              </Form.Item>
              {uniqueError ? (
                <p style={{ color: "#c0392b", textAlign: "center" }}>
                  {uniqueError}
                </p>
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
              </Form.Item>
            </Col>{" "}
            <Col span={24} className="px-2">
              <Form.Item
                rules={[
                  {
                    message: "من فضلك ادخل الوظائف",
                    required: true,
                  },
                ]}
                name="selectedJobs"
                hasFeedback
                label="وظائف إدارة النظام"
              >
                <Select
                  showSearch
                  allowClear
                  // value={selectedJobs}
                  mode="multiple"
                  onChange={handleSelectJobs}
                  placeholder="اختر الوظائف"
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {jobs && jobs.length !== 0
                    ? jobs.map((inq, index) => (
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
              </Form.Item>
            </Col>
            {is_mahamy && (
              <Col span={24} className="px-2">
                <Form.Item
                  rules={[
                    {
                      message: "من فضلك ادخل الاقسام",
                      required: true,
                    },
                  ]}
                  name="selectedDeps"
                  hasFeedback
                  label="الاقسام"
                >
                  <Select
                    virtual={false}
                    showSearch
                    allowClear
                    onChange={handleSelectDeps}
                    placeholder="اختر القسم"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {departments && departments.length !== 0
                      ? departments.map((inq, index) => (
                          <Select.Option
                            className="selectgroup"
                            value={inq.translate_ar_caption}
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
            )}{" "}
            <Col span={24} className="px-2">
              <Form.Item>
                <Button className="cancelbtn" onClick={addToTable}>
                  اضافة
                </Button>
              </Form.Item>
            </Col>
            {tableData.length > 0 && (
              <Col span={24} className="px-2">
                {/* <Table dataSource={tableData} columns={tableColumns} />; */}
                <table className="table table-bordered">
                  <thead>
                    <th>#</th>
                    <th>الوظائف</th>
                    <th>التطبيقات</th>
                  </thead>
                  <tbody>
                    {tableData.map((d, k) => {
                      return (
                        <tr key={k}>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={deleteGroup.bind(this, d)}
                            >
                              حذف
                            </button>
                          </td>
                          <td>{d.name}</td>
                          <td>{filterJobs(d.app_id)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Col>
            )}
          </Row>
          <Row style={{ display: "flex" }}>
            <Form.Item>
              <Button className="cancelbtn" onClick={props.closeAdd}>
                اغلاق
              </Button>
            </Form.Item>
            <Form.Item>
              <Button className="addbtn" onClick={saveGroup}>
                حفظ
              </Button>
            </Form.Item>
          </Row>
        </form>
      </Container>
    </Modal>
  );
}
export default AddGroup;
