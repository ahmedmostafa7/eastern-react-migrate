import React, { useEffect, useState } from "react";
import { Select, Row, Col, Input, notification } from "antd";
import axios from "axios";
import { Button } from "react-bootstrap";
import DeleteModal from "../Modals/DeleteModal";
// import AddOwner from "../Modals/AddOwner";
import EditOwner from "../Modals/EditOwner";

export default function Owners(props) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [rowId, setRowId] = useState(0);
  const [name, setName] = useState("");
  const [rowdata, setRowData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [searchText, setSearch] = useState("");
  const [columns, setColumns] = useState([
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "العنوان",
      dataIndex: "address",
      key: "address",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "رقم الجوال",
      dataIndex: "mobile",
      key: "mobile",
      render: (text) => <a>{text == null ? "--" : text}</a>,
    },
    {
      title: "رقم الهاتف",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <a>{text == null ? "--" : text}</a>,
    },
    {
      title: "البريد الالكتروني",
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text == null ? "--" : text}</a>,
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
  const confirmationDelete = () => {
    const args = {
      description: "تم حذف المالك بنجاح",
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
      .get(window.host + "/api/owner", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => props.getTableData(columns, res.data, res.data.count));
  });
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

  const handleUserInput = (e) => {
    setName(e.target.value);
  };
  const onDelete = (e) => {
    axios
      .delete(window.host + "/api/owner/" + e.target.id, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) =>
        axios
          .get(window.host + "/api/owner", {
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
      {/* <AddOwner
        title="owner"
        showAdd={showAdd}
        closeAdd={closeAdd}
        openAdd={openAdd}
        getTableData={props.getTableData}
        columns={columns}
      /> */}
      <Row>
        <Col
          md={{ span: 24 }}
          lg={{ span: 12 }}
          style={{ paddingRight: "10px" }}
        >
          <Select
            virtual={false}
            showSearch
            allowClear
            // onChange={handleSelectName}
            // value={name}
            placeholder="اختر"
            getPopupContainer={(trigger) => trigger.parentNode}
          >
            {/* <Select.Option>الاسم</Select.Option>
          <Select.Option>كود البلدية</Select.Option> */}
          </Select>
        </Col>
        <Col md={{ span: 24 }} lg={{ span: 12 }}>
          <Input
            name="searchText"
            onChange={handleUserInput}
            value={searchText}
            placeholder="ابحث..."
          />
        </Col>
      </Row>
      <DeleteModal
        title="هذا المالك"
        showDelete={showDelete}
        id={rowId}
        closeDelete={closeDelete}
        onDelete={onDelete}
      />{" "}
      <EditOwner
        title="owner"
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
