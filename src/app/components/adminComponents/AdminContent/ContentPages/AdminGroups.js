import React, { useState, useEffect } from "react";
import { Select, Row, Col, Input, notification, Form } from "antd";
import axios from "axios";
import { Button } from "react-bootstrap";
import DeleteModal from "../Modals/DeleteModal";
import AddGroup from "../Modals/AddGroup.js";
import EditGroup from "../Modals/EditGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faWrench } from "@fortawesome/free-solid-svg-icons";

import queryStringSearch from "./queryStringSearch";
const { Search } = Input;
import qs from "qs";
function AdminGroups(props) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [count, setCount] = useState(0);
  const [allDataTable, setAllTableData] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [rowId, setRowId] = useState(0);
  const [name, setName] = useState("");
  const [rowdata, setRowData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [columns] = useState([
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "الإجراء",
      dataIndex: "action",
      key: "action",
      // eslint-disable-next-line react/display-name
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
          {/* <Button
            id={record.id}
            onClick={openDelete.bind(this, record)}
            className="btn-danger"
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button> */}
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
      .get(window.host + "/api/Group", {
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
      .delete(window.host + "/api/Group/" + e.target.id, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) =>
        axios
          .get(window.host + "/api/Group", {
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
      );

    closeDelete();
  };
  return (
    <div className="baladyaAdmin">
      <Button className="follow" onClick={openAdd}>
        إضافة جديد
      </Button>
      <AddGroup
        showAdd={showAdd}
        closeAdd={closeAdd}
        openAdd={openAdd}
        getTableData={props.getTableData}
        columns={columns}
      />
      <Row>
        <Col>
          <Form.Item name="searchText" hasFeedback label="ابحث">
            <Search
              name="searchText"
              onChange={handleUserInput}
              onPressEnter={(e) =>
                queryStringSearch(e, props, columns, "Group", "name")
              }
              value={searchText}
              placeholder="ابحث..."
            />
          </Form.Item>
        </Col>
      </Row>
      <DeleteModal
        title="هذه المجموعة"
        showDelete={showDelete}
        id={rowId}
        closeDelete={closeDelete}
        onDelete={onDelete}
      />
      <EditGroup
        showEdit={showEdit}
        id={rowId}
        rowdata={rowdata}
        closeEditModal={closeEditModal}
        getTableData={props.getTableData}
        columns={columns}
      />
    </div>
  );
}
export default AdminGroups;
