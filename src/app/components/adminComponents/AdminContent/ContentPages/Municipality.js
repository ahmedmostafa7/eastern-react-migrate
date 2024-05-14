import React, { useEffect, useState } from "react";
import { Select, Row, Col, Input, notification, Form, message } from "antd";
import axios from "axios";
import { Button } from "react-bootstrap";
import AddModal from "../Modals/AddModal";
import queryStringSearch from "./queryStringSearch";
import DeleteModal from "../Modals/DeleteModal";
import EditModal from "../Modals/EditModal";
const { Search } = Input;
function Municipality(props) {
  const [data] = useState([]);
  const [showEdit, setShowEdit] = useState(null);
  const [count, setCount] = useState(0);
  const [allDataTable, setAllTableData] = useState([]);
  const [rowId, setRowId] = useState(0);
  const [name, setName] = useState("");
  const [rowdata, setRowData] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [city_belong, setCityBelong] = useState(false);
  // const [searchText, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const filterCityId = (id) => {
    console.log(city_belong, allDataTable);
    return (
      city_belong.length > 0 && city_belong?.filter((d) => d.id == id)[0]?.name
    );
  };
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
    //   title: " المدينة التابع لها البلدية",
    //   dataIndex: "city_id",
    //   key: "city_id",
    //   render: (text) => <a>{filterCityId(text)}</a>,
    // },
    {
      title: " كود المدينة",
      dataIndex: "city_code",
      key: "city_code",
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
      description: "تم حذف البلدية بنجاح",
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
      .get(window.host + "/api/municipality", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setAllTableData(res.data);
        setCount(res.data.count);
        setCityBelong(res.data.results.filter((d) => d.city_code == null));
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

  const onSearch = (e) => {
    console.log(e);
  };
  const onDelete = (e) => {
    axios
      .delete(window.host + "/api/municipality/" + e.target.id, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) =>
        axios
          .get(window.host + "/api/municipality", {
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
        title="municipality"
        showAdd={showAdd}
        city_belong={city_belong}
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
                queryStringSearch(e, props, columns, "municipality", "name")
              }
              value={searchText}
              placeholder="ابحث..."
            />
          </Form.Item>
        </Col>
      </Row>
      <DeleteModal
        title="هذه البلدية"
        showDelete={showDelete}
        id={rowId}
        closeDelete={closeDelete}
        onDelete={onDelete}
      />{" "}
      <EditModal
        title="municipality"
        showEdit={showEdit}
        id={rowId}
        city_belong={city_belong}
        rowdata={rowdata}
        closeEditModal={closeEditModal}
        getTableData={props.getTableData}
        columns={columns}
      />
    </div>
  );
}
export default Municipality;
