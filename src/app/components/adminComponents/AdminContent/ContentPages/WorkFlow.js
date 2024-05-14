/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import { Select, Row, Col, Input, notification, Form, message } from "antd";
import axios from "axios";
import { Button } from "react-bootstrap";
import DeleteModal from "../Modals/DeleteModal";
import AddWorkflow from "../Modals/AddWorkflow";
import queryStringSearch from "./queryStringSearch";
// import EditWorkflow from "../Modals/AddWorkflow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";
import { withRouter } from "apps/routing/withRouter";
import qs from "qs";
import { faTimes, faWrench } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheck,
  // faWrench,
  // faTimes,
} from "@fortawesome/free-solid-svg-icons";
// import { useDispatch } from "react-redux";
function AdminWorkflow(props) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [rowId, setRowId] = useState(0);
  const [count, setCount] = useState(0);
  const [allDataTable, setAllTableData] = useState([]);
  const [name, setName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [rowdata, setRowData] = useState({});
  const [searchText, setSearchText] = useState("");
  const { Search } = Input;
  const handleSteps = (steps, record) => {
    props.history.push({
      pathname: "/steps",
      state: { name: record?.name, data: steps },
    });
    localStorage.setItem("workflowId", record.id);
    // localStorage.setItem("stepsContent", true);
  };

  const [columns] = useState([
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a
          onClick={handleSteps.bind(this, text, record)}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "عدد الخطوات",
      dataIndex: "steps",
      key: "steps",
      render: (text, record) => <span> {text ? text.length : 0}</span>,
    },
    {
      title: "التطبيقات",
      dataIndex: "applications",
      key: "applications",
      render: (text) => <a>{text.translate_ar_caption}</a>,
    },
    {
      title: "الحاله",
      dataIndex: "is_deactivated",
      key: "is_deactivated",
      render: (text) => (
        <a>
          {text == null ? (
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
          {" "}
          <Button
            id={record.id}
            onClick={openEdit.bind(this, record)}
            className="btn-edit"
          >
            <FontAwesomeIcon icon={faWrench} />
          </Button>
          <Button id={record.id} onClick={openDelete} className="btn-danger">
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </>
      ),
    },
  ]);
  console.log(columns);
  const confirmationDelete = () => {
    const args = {
      description: "تم حذف مسار العمل بنجاح",
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
      .get(window.host + "/api/workflow", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setTableData(res.data.results), setAllTableData(res.data);
        setCount(res.data.count);
        props.getTableData(columns, res.data, res.data.count);
      });

    // dispatch(SetSteps(appName));
  }, []);

  const openDelete = (e) => {
    setRowId(e.target.id);
    setShowDelete(true);
  };
  const closeDelete = () => {
    setRowId(null);
    setShowDelete(false);
  };

  const openEdit = (e, data) => {
    setRowId(e.id);
    setRowData(e);
    setShowEdit(true);
    setShowAdd(false);
  };
  const closeEditModal = () => {
    setRowId(0);
    setShowEdit(false);
  };
  const openAdd = (e) => {
    setShowAdd(true);
    setShowEdit(false);
  };
  const closeAdd = () => {
    setShowAdd(false);
  };

  const handleSelectName = (e) => {
    setSelectedOption(e);
  };
  const handleUserInput = (e) => {
    // console.log(value);

    setSearchText(e.target.value);
    if (e.target.value == "") {
      props.getTableData(columns, allDataTable, count);
    }
  };

  const onDelete = (e) => {
    axios
      .delete(window.host + "/api/workflow/" + e.target.id, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) =>
        axios
          .get(window.host + "/api/workflow", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.token}`,
            },
          })
          .then((res1) => {
            props.getTableData(columns, res1.data, res1.data.count),
              confirmationDelete();
          })
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
      <AddWorkflow
        showAdd={showAdd ? showAdd : showEdit}
        closeAdd={showAdd ? closeAdd : closeEditModal}
        open={showAdd ? "add" : "edit"}
        rowdata={showAdd ? {} : rowdata}
        getTableData={props.getTableData}
        columns={columns}
        // appId={}
      />
      <form
        className="my-1 px-md-1 regForms"
        layout="vertical"
        // onSubmit={addGroup}
        name="validate_other"
      >
        <Row>
          <Col>
            <Form.Item name="searchText" hasFeedback label="ابحث">
              <Search
                name="searchText"
                onChange={handleUserInput}
                onPressEnter={(e) =>
                  queryStringSearch(e, props, columns, "workflow", "name")
                }
                value={searchText}
                placeholder="ابحث..."
              />
            </Form.Item>
          </Col>
        </Row>
      </form>
      <DeleteModal
        title="هذا مسار عمل"
        showDelete={showDelete}
        id={rowId}
        closeDelete={closeDelete}
        onDelete={onDelete}
      />
    </div>
  );
}
export default withRouter(AdminWorkflow);
