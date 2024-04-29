import React, { useEffect, useState } from "react";
import { Select, Row, Col, Input, notification, Form, message } from "antd";
import axios from "axios";
import { Button } from "react-bootstrap";
import AddModal from "../Modals/AddModal";
import DeleteModal from "../Modals/DeleteModal";
import EditModal from "../Modals/EditModal";
const { Search } = Input;
import queryStringSearch from "./queryStringSearch";
export default function JobTitle(props) {
  const [data] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [rowId, setRowId] = useState(0);
  const [name, setName] = useState("");
  const [count, setCount] = useState(0);
  const [allDataTable, setAllTableData] = useState([]);
  const [rowdata, setRowData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [columns, setColumns] = useState([
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "كود البلدية",
    //   dataIndex: "code",
    //   key: "code",
    //   render: (text) => <a>{text}</a>,
    // },
    // {
    //   title: "كود المدينة",
    //   dataIndex: "city_id",
    //   key: "city_id",
    //   render: (text) => <a>{text == null ? "--" : text}</a>,
    // },
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
  const confirmationDelete = () => {
    const args = {
      description: "تم حذف المسمى الوظيفى بنجاح",
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
      .get(window.host + "/api/position", {
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
      .delete(window.host + "/api/position/" + e.target.id, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
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
      <AddModal
        title="position"
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
                queryStringSearch(e, props, columns, "position", "name")
              }
              value={searchText}
              placeholder="ابحث..."
            />
          </Form.Item>
        </Col>
      </Row>
      <DeleteModal
        title="هذا المسمي الوظيفي"
        showDelete={showDelete}
        id={rowId}
        closeDelete={closeDelete}
        onDelete={onDelete}
      />
      <EditModal
        title="position"
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
