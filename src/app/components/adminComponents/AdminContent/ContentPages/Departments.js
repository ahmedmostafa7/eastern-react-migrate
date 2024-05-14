import React, { useState, useEffect } from "react";
import {
  Select,
  Row,
  Col,
  Input,
  notification,
  Button,
  Form,
  message,
} from "antd";
import axios from "axios";
const { Search } = Input;
import AddModal from "../Modals/AddModal";
import DeleteModal from "../Modals/DeleteModal";
import AddDepartment from "../Modals/AddDepartment.js";
import EditDepartment from "../Modals/EditDepartment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheck,
  faWrench,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import queryStringSearch from "./queryStringSearch";
function Departments(props) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [rowId, setRowId] = useState(0);
  const [name, setName] = useState("");
  const [rowdata, setRowData] = useState({});
  const [count, setCount] = useState(0);
  const [allDataTable, setAllTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [approving_dep, setApprove] = useState(false);
  const [columns] = useState([
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "جهة معتمدة للمكاتب",
      dataIndex: "approving_dep",
      key: "approving_dep",
      render: (text) => (
        <a>
          {text == 1 ? (
            <FontAwesomeIcon icon={faCheck} />
          ) : (
            <FontAwesomeIcon icon={faBan} />
          )}
        </a>
      ),
    },
    {
      title: "الإجراء",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            id={record.id}
            onClick={openEdit.bind(this, record)}
            className="btn-edit"
            style={{ padding: "0 10px" }}
          >
            <FontAwesomeIcon icon={faWrench} />
          </Button>
          <Button
            id={record.id}
            onClick={openDelete.bind(this, record)}
            className="btn-danger"
            style={{ padding: "0 10px" }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </>
      ),
    },
  ]);
  const [data] = useState([]);
  const confirmationDelete = () => {
    const args = {
      description: "تم حذف القسم بنجاح",
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
    axios
      .get(window.host + "/api/department", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setAllTableData(res.data);
        setCount(res.data.count);
        props.getTableData(columns, res.data, res.data.count);
      });
  }, []);

  const openDelete = (e) => {
    setRowId(e.id);

    setShowDelete(true);
  };
  const closeDelete = () => {
    setRowId(null);
    setShowDelete(false);
  };

  const openEdit = (e, data) => {
    e.approving_dep == 1 ? setApprove(true) : setApprove(false);
    setRowId(e.id);
    setRowData(e);
    setShowEdit(true);
  };
  const closeEditModal = () => {
    setRowId(0);
    setShowEdit(false);
  };
  const openAdd = (e) => {
    setShowAdd(true);
  };
  const closeAdd = () => {
    setShowAdd(false);
  };

  const handleSelectName = (e) => {};
  const handleUserInput = (e) => {
    // console.log(value);

    setSearchText(e.target.value);
    if (e.target.value == "") {
      props.getTableData(columns, allDataTable, count);
    }
  };
  const onDelete = (e) => {
    axios
      .delete(window.host + "/api/department/" + rowId, {
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
            (res1) => props.getTableData(columns, res1.data, res1.data.count),
            confirmationDelete()
          )
      )
      .catch((err) => {
        message.error("حدث خطأ");
      });

    closeDelete();
  };
  return (
    <div className="baladyaAdmin">
      <Button className="follow" onClick={openAdd}>
        إضافة جديد
      </Button>
      <AddDepartment
        showAdd={showAdd}
        closeAdd={closeAdd}
        openAdd={openAdd}
        getTableData={props.getTableData}
        columns={columns}
      />
      <Row>
        <Col
          md={{ span: 24 }}
          lg={{ span: 12 }}
          style={{ paddingRight: "10px" }}
        ></Col>
        <Col>
          <Form.Item name="searchText" hasFeedback label="ابحث">
            <Search
              name="searchText"
              onChange={handleUserInput}
              onPressEnter={(e) =>
                queryStringSearch(e, props, columns, "department", "name")
              }
              value={searchText}
              placeholder="ابحث..."
            />
          </Form.Item>
        </Col>
      </Row>
      <DeleteModal
        title="هذا القسم"
        showDelete={showDelete}
        id={rowId}
        closeDelete={closeDelete}
        onDelete={onDelete}
      />
      <EditDepartment
        showEdit={showEdit}
        id={rowId}
        approving_dep={approving_dep}
        rowdata={rowdata}
        closeEditModal={closeEditModal}
        getTableData={props.getTableData}
        columns={columns}
      />
    </div>
  );
}
export default Departments;
