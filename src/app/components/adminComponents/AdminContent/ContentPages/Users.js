/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";
import {
  Select,
  Row,
  Col,
  Input,
  notification,
  Form,
  // Container,
  // Modal,
  message,
} from "antd";

import axios from "axios";
import { Button } from "react-bootstrap";
import AddUser from "../Modals/AddUser";
import DeleteModal from "../Modals/DeleteModal";
import EditModal from "../Modals/EditUser";
import queryStringSearch from "./queryStringSearch";
import ActivateUser from "../Modals/ActivateUser";
import ChangePass from "../Modals/ChangePass";
const { Search } = Input;
function Users(props) {
  const [data] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showActivate, setShowActivate] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [rowId, setRowId] = useState(0);
  const [changepassword, setChangePassword] = useState(false);

  const [name, setName] = useState("");
  const [rowdata, setRowData] = useState({});
  const [count, setCount] = useState(0);
  const [allDataTable, setAllTableData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const [columns, setColumns] = useState([
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "اسم المستخدم",
      dataIndex: "username",
      key: "username",
      render: (text) => <a>{text == null ? "--" : text}</a>,
    },

    {
      title: "رقم الجوال",
      dataIndex: "mobile",
      key: "mobile",
      render: (text) => <a>{text == null ? "--" : text}</a>,
    },
    {
      title: "البريد الالكتروني",
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text == null ? "--" : text}</a>,
    },
    {
      title: "الحالة",
      dataIndex: "is_active",
      key: "is_active",
      render: (text) => <a>{text == 1 ? "مفعل" : "مجمد"}</a>,
    },
    {
      title: "الإجراء",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div
          style={{
            // display: "grid",
            gridTemplateColumns: "1fr 1fr ",
            alignItems: "center",
          }}
        >
          <i
            className="fas fa-wrench btn-edit"
            style={{ padding: "10px" }}
            id={record.id}
            onClick={openEdit.bind(this, record)}
          ></i>
          {/* <i
            className="fas fa-times btn-danger "
            style={{ padding: "10px" }}
            id={record.id}
            onClick={openDelete}
          ></i>{" "} */}
          <Button
            className={record.is_active == 1 ? " freezeBtn" : "activateBtn"}
            style={{ padding: "10px" }}
            id={record.id}
            onClick={openActivate.bind(this, record)}
          >
            {record.is_active == 1 ? "تجميد" : "تفعيل"}
          </Button>
          <Button
            className="btn btn-info"
            style={{ padding: "2px", gridColumn: "1 / 4", margin: "11px" }}
            id={record.id}
            onClick={openChangePassword.bind(this, record)}
          >
            تغيير كلمة المرور
          </Button>
        </div>
      ),
    },
  ]);

  const confirmationDelete = () => {
    const args = {
      description: "تم حذف المستخدم بنجاح",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
  };
  const errorDelete = () => {
    const args = {
      description: "لا يمكنك حذف هذا العنصر",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#e74c3c",
      },
    };
    notification.open(args);
  };
  useEffect(() => {
    axios
      .get(window.host + "/api/user", {
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
  const openActivate = (e, data) => {
    setRowId(e.id);
    setShowActivate(true);
    setRowData(e);
  };
  const openChangePassword = (e, data) => {
    setRowId(e.id);
    setChangePassword(true);
    setRowData(e);
  };
  const closeActivate = () => {
    setRowId(null);
    setShowActivate(false);
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
      .delete(window.host + "/api/user/" + e.target.id, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
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
            (res1) => props.getTableData(columns, res1.data, res1.data.count),
            confirmationDelete()
          )
      )
      .catch((error) => {
        if (error.response.status == 406) {
          errorDelete();
        }
      });

    closeDelete();
  };

  return (
    <div className="baladyaAdmin">
      <Button className="follow" onClick={openAdd}>
        إضافة جديد
      </Button>
      <AddUser
        showAdd={showAdd ? showAdd : showEdit}
        closeAdd={showAdd ? closeAdd : closeEditModal}
        openAdd={openAdd}
        removePasswordField={showEdit ? true : false}
        rowdata={showEdit ? rowdata : null}
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
                queryStringSearch(e, props, columns, "user", "name")
              }
              value={searchText}
              placeholder="ابحث..."
            />
          </Form.Item>
        </Col>
      </Row>
      {/* <DeleteModal
        title="هذا المستخدم"
        showDelete={showDelete}
        id={rowId}
        closeDelete={closeDelete}
        onDelete={onDelete}
      /> */}
      {/* <EditModal
        showEdit={showEdit}
        id={rowId}
        rowdata={rowdata}
        closeEditModal={closeEditModal}
        getTableData={props.getTableData}
        columns={columns}
      />{" "} */}
      <ActivateUser
        showActivate={showActivate}
        id={rowId}
        rowdata={rowdata}
        closeActivate={closeActivate}
        getTableData={props.getTableData}
        columns={columns}
      />
      <ChangePass
        show={changepassword}
        id={rowId}
        close={() => setChangePassword(false)}
        rowdata={rowdata}
        getTableData={props.getTableData}
        columns={columns}
      />
    </div>
  );
}
export default Users;
