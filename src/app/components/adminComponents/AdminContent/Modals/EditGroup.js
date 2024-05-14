import React, { useState, useEffect, useRef } from "react";
import { Modal, Container } from "react-bootstrap";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  message,
  notification,
  Select,
  Table,
} from "antd";
import axios from "axios";
import { ArabicAppModules } from "./arabic_translate";
function EditGroup(props) {
  console.log(props?.rowdata?.groups_permissions);
  const [name, setName] = useState(props.rowdata.name);
  const [jobs, setJobs] = useState(
    props?.rowdata?.groups_permissions?.map((d) => d.name)
  );
  const formRef = useRef(null);
  const [uniqueError, setUniqueError] = useState("");
  const [unique, setUnique] = useState(true);
  //  const [uniqueError, setUniqueError] = useState("");
  const [applications, setApps] = useState([]);
  const [tableData, setTableData] = useState(
    []
    // props?.rowdata?.groups_permissions
  );
  // const [tableColumns, setTableColumns] = useState();

  // const [jobs, setJobs] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [appId, setAppId] = useState([]);
  const [selectedApps, setSelectedApps] = useState(undefined);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [allMod, setAllMod] = useState([]);
  const [is_mahamy, setIsMahamy] = useState(false);
  const [depId, setDepId] = useState(null);
  const [departments, setDepartments] = useState([]);

  const handleUserInput = (e) => {
    setName(e.target.value);
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
  const confirmationEdit = () => {
    const args = {
      description: "تم تعديل البلدية بنجاح",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
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
        // let oldTableData = props?.rowdata?.groups_permissions?.map((d) => ({
        //   app: d.applications.translate_ar_caption,
        //   jobs: d.apps_modules.name,
        // }));
      });
    axios.get(window.host + "/api/department").then((res) => {
      setDepartments(res.data.results);
    });
    props.rowdata.groups_permissions &&
      setTableData(props.rowdata.groups_permissions);
  }, []);
  const editToTable = () => {
    let oldTableData = props.rowdata.groups_permissions.map((d) => ({
      name: ArabicAppModules[d.apps_modules.name],
      app_id: d.applications.id,
      id: d?.id,
      get: 1,
      module_id: d.module_id,
      // applications: selectedApps,
    }));
    let app = selectedApps?.map((d) => d.translate_ar_caption)[0];
    // let app_id = selectedApps?.map((d) => d.id)[0];
    // let newFormValues = { name: name, groups_permissions: "" };
    let jobs = selectedJobs?.map((d) => d.name);
    // let oldselected = Object.assign(selectedJobs);
    // let oldselected = selectedJobs.map((a) => ({ ...a }));

    let appId = tableData.map((d) => d.app_id);
    let allAppIds = applications.map((d) => d.id);
    let modifiedtabledata = [...oldTableData, ...formValues.groups_permissions];
    if (tableData.length == 0) {
      setTableData(modifiedtabledata);
    } else if (
      formValues.groups_permissions
        .map((d) => appId.includes(d.app_id))
        .includes(true)
    ) {
      message.info("تم الاضافة من قبل");
    } else {
      setTableData((prevState) => [
        ...prevState,
        ...formValues.groups_permissions,
      ]);
    }
    // setFormValues((prevState) => ({
    //   ...prevState,
    //   groups_permissions: tableData,
    // }));
  };
  const handleSelectDeps = (value, e) => {
    setDepId(e.key);
  };
  const editMun = (e) => {
    // let allGroupPermission = JSON.parse(localStorage.getItem("filedit"));
    if (name !== "") {
      axios
        .put(
          window.host + "/api/group/" + props.id,
          {
            name: name,
            groups_permissions:
              tableData.length > 0
                ? tableData
                : props?.rowdata?.groups_permissions,
            is_mahamy: is_mahamy || props?.rowdata?.is_mahamy,
            department_id: depId || props?.rowdata?.department_id,
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
              props.closeEditModal();
            })
        );
      // .then((res) => );
    }
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
    setSelectedJobs(filteredJobs);
    setFormValues((prevState) => ({
      ...prevState,
      groups_permissions: filteredJobs,
    }));
  };
  const handleSelectJobs = (value, e) => {
    console.log(selectedJobs);
    let selectedG = [];
    if (value.includes("selectAll")) {
      setSelectedJobs(jobs);
    }
    if (value.includes("deleteAll")) {
      setSelectedJobs([]);
    }
    // else {
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
    setFormValues((prevState) => ({
      ...prevState,
      groups_permissions: filteredJobs,
    }));
  };
  // console.log(
  //   props?.rowdata?.groups_permissions?.map((d) => ({
  //     app: d.applications.translate_ar_caption,
  //     jobs: d.apps_modules.name,
  //   }))
  // );
  const deleteGroup = (data) => {
    console.log(data);
    // let deletedGr;
    if (data?.id) {
      setTableData(
        tableData.length > 0
          ? tableData.filter((d) => d.id != data.id)
          : props.rowdata.groups_permissions.filter((d) => d.id != data.id)
      );
    } else {
      setTableData(
        tableData.length > 0
          ? tableData.filter((d) => d != data)
          : props.rowdata.groups_permissions.filter((d) => d.id != data.id)
      );
    }
  };
  const filterJobs = (id) => {
    return applications?.filter((d) => d.id == id)[0]?.translate_ar_caption;
  };
  // let tableData =[];
  // setTableData(tableDatalocal);
  // let tableColumnslocal = localStorage.getItem("tableCol");
  // setTableColumns(tableColumnslocal);
  // const editToTable = () => {};
  // let oldTableData = props.rowdata.groups_permissions.map((d) => ({
  //   app: d.applications.translate_ar_caption,
  //   jobs: d.apps_modules.name,
  // }));
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
      {localStorage.setItem("nameEdit", props.rowdata.name)}
      <Container fluid>
        <div>
          <h5 className="px-5 pt-4">تعديل المجموعة</h5>
        </div>
        <hr />
        <Form
          ref={formRef}
          className="my-4 px-md-5 regForms"
          layout="vertical"
          name="validate_other"
          // initialValues={{
          //   name: name,
          // }}
          // initialValues={{
          //   name: props.rowdata.name,
          // }}
        >
          <Row>
            <Col span={24} className="px-2">
              <Form.Item name="name" hasFeedback label="الإسم">
                {getFieldDecorator("name", {
                  rules: [{ required: true, message: "من فضلك ادخل الإسم" }],
                  initialValue: props.rowdata?.name,
                })(
                  <Input
                    // defaultValue={props?.rowdata?.name}
                    name="name"
                    onChange={handleUserInput}
                    value={name}
                    placeholder="الإسم"
                  />
                )}
              </Form.Item>
              {uniqueError ? (
                <p style={{ color: "#c0392b", textAlign: "center" }}>
                  {uniqueError}
                </p>
              ) : null}
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
                  {getFieldDecorator("department", {
                    rules: [{ required: true, message: "من فضلك ادخل القسم" }],
                    initialValue: props.rowdata?.departments?.name,
                  })(
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
                  )}
                </Form.Item>
              </Col>
            )}{" "}
          </Row>
          <Col span={24} className="px-2">
            <Form.Item>
              <Button className="cancelbtn" onClick={editToTable}>
                تعديل
              </Button>
            </Form.Item>
          </Col>
          {/* {props?.rowdata?.groups_permissions?.length > 0 && ( */}
          <Col span={24} className="px-2">
            {/* <Table dataSource={tableData} columns={tableColumns} />; */}
            <table className="table table-bordered">
              <thead>
                <th>الإجراءات</th>
                <th>الوظائف</th>
                <th>التطبيقات</th>
              </thead>
              <tbody>
                {(
                  (tableData.length > 0 && tableData) ||
                  props?.rowdata?.groups_permissions
                )?.map((d, k) => {
                  return (
                    <tr key={k}>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={deleteGroup.bind(this, d || props?.rowdata)}
                        >
                          حذف
                        </button>
                      </td>
                      <td>
                        {d.name || ArabicAppModules[d?.apps_modules?.name]}
                      </td>
                      <td>{filterJobs(d.app_id)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Col>
          {/* )} */}
          {/* <Col span={24} className="px-2">
            <Table
              dataSource={
                tableData.length > 0
                  ? tableData
                  : props?.rowdata?.groups_permissions?.map((d) => ({
                      app: d.applications.translate_ar_caption,
                      jobs: d.apps_modules.name,
                    }))
              }
              columns={[
                { title: "الوظائف", dataIndex: "jobs", name: "jobs" },
                { title: "التطبيقات", dataIndex: "app", name: "app" },
              ]}
            />
            ;
          </Col> */}
          <Button className="cancelbtn" onClick={props.closeEditModal}>
            اغلاق
          </Button>
          <Button className="addbtn" onClick={editMun}>
            حفظ
          </Button>
        </Form>
      </Container>
    </Modal>
  );
}

export default EditGroup;
