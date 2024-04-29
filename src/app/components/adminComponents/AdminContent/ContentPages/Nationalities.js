import React, { useState, useEffect } from "react";
import { Select, Row, Col, Input, notification, Form } from "antd";
import axios from "axios";
import { Button } from "react-bootstrap";
import AddModal from "../Modals/AddModal";
import queryStringSearch from "./queryStringSearch";
import DeleteModal from "../Modals/DeleteModal";
import EditModal from "../Modals/EditModal";
const { Search } = Input;
function Nationalities(props) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [rowId, setRowId] = useState(0);
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [allDataTable, setAllTableData] = useState([]);
  const [rowdata, setRowData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [nationalty_type_id, setTypeId] = useState(0);
  const [columns] = useState([
    {
      title: "الاسم",
      dataIndex: "local_name",
      key: "local_name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "نوع الهوية",
      dataIndex: "nationalty_type_id",
      key: "nationalty_type_id",
      render: (text) => (
        <a>{text == 1990 ? "مقيم" : text == 1988 ? "خليجية" : "سعودية"}</a>
      ),
    },
    {
      title: "الإجراء",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <>
          <i
            className="fas fa-wrench btn-edit"
            style={{ padding: "10px" }}
            id={record.id}
            onClick={openEdit.bind(this, record)}
          ></i>

          <i
            className="fas fa-times btn-danger "
            style={{ padding: "10px" }}
            id={record.id}
            onClick={openDelete}
          ></i>
        </>
      ),
    },
  ]);
  const [data] = useState([]);
  const confirmationDelete = () => {
    const args = {
      description: "تم حذف الجنسية بنجاح",
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
      .get(window.host + "/api/nationalities", {
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
    nationalty_type_id == 1990
      ? "مقيم"
      : nationalty_type_id == 1988
      ? "خليجية"
      : "سعودية";

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

  const handleUserInput = (e) => {
    // console.log(value);

    setSearchText(e.target.value);
    if (e.target.value == "") {
      props.getTableData(columns, allDataTable, count);
    }
  };

  const onDelete = (e) => {
    axios
      .delete(window.host + "/api/nationalities/" + e.target.id, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
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
      <AddModal
        title="nationalities"
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
                queryStringSearch(e, props, columns, "nationalities","local_name")
              }
              value={searchText}
              placeholder="ابحث..."
            />
          </Form.Item>
        </Col>
      </Row>
      <DeleteModal
        title="هذه الجنسية"
        showDelete={showDelete}
        id={rowId}
        closeDelete={closeDelete}
        onDelete={onDelete}
      />
      <EditModal
        title="nationalities"
        showEdit={showEdit}
        id={rowId}
        nationalty_type_id={nationalty_type_id}
        rowdata={rowdata}
        closeEditModal={closeEditModal}
        getTableData={props.getTableData}
        columns={columns}
      />
    </div>
  );
}
export default Form.create()(Nationalities);
