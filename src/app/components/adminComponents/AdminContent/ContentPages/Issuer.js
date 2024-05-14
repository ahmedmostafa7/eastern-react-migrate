import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { Select, Form, Row, Col, Input, message, notification } from "antd";
import { Modal, Container } from "react-bootstrap";
import AddEditIssuers from "../Modals/AddEditIssuers";
import DeleteModal from "../Modals/DeleteModal";
const { Search } = Input;
import queryStringSearch from "./queryStringSearch";
function Issuer(props) {
  const [count, setCount] = useState(0);
  const [allDataTable, setAllTableData] = useState([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [rowdata, setRowData] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [rowId, setRowId] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [columns] = useState([
    {
      title: "الاسم",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "كود الجهة",
      dataIndex: "code",
      key: "code",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "نوع جهة الاصدار",
      dataIndex: "issuers_type.name",
      key: "issuers_type.name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "البلدية",
      dataIndex: "municipalities.name",
      key: "municipalities.name",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "رقم الصادر",
      dataIndex: "export_id",
      key: "export_id",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "الإجراء",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <>
          <Button
            className="follow"
            id={record.id}
            onClick={openEdit.bind(this, record)}
            // onClick={openEdit}
          >
            <i className="fas fa-wrench"></i>
          </Button>
          <Button
            className="btn-danger"
            onClick={openDelete.bind(this, record)}
          >
            <i className="fas fa-times"></i>
          </Button>
        </>
      ),
    },
  ]);
  const openDelete = (e) => {
    setRowId(e.id);
    setShowDelete(true);
  };
  const closeDelete = () => {
    setRowId(null);
    setShowDelete(false);
  };
  useEffect(() => {
    axios
      .get(window.host + "/api/issuer", {
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
  // const openDelete = (e) => {
  //   setRowId(e.target.id);
  //   setShowDelete(true);
  // };
  // const closeDelete = () => {
  //   setRowId(null);
  //   setShowDelete(false);
  // };
  const confirmationDelete = () => {
    const args = {
      description: "تم حذف  جهة الاصدار بنجاح",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
  };
  const onDelete = (rec) => {
    axios
      .delete(window.host + `/api/issuer/${rowId}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) =>
        axios
          .get(window.host + "/api/issuer", {
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
  const openEdit = (e, data) => {
    setRowId(e.id);
    setRowData(e);
    setEdit(true);
    // setShow(true);
  };
  const handleSelectName = (e) => {};
  const handleUserInput = (e) => {
    // console.log(value);

    setSearchText(e.target.value);
    if (e.target.value == "") {
      props.getTableData(columns, allDataTable, count);
    }
  };

  return (
    <div className="baladyaAdmin">
      <Button
        className="follow"
        onClick={() => {
          setShow(true);
        }}
      >
        إضافة جديد
      </Button>
      <Modal
        // title={edit ? "تعديل جهة اصدار" : "إضافة جهة اصدار جديدة "}
        // width="63vw"
        show={show ? show : edit}
        // footer={null}
        keyboard={false}
        backdrop="static"
        className="adminModal"
        // {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Container fluid>
          <div>
            <h5 className="px-5 pt-4">
              {edit ? "تعديل جهة اصدار" : "إضافة جهة اصدار جديدة "}
            </h5>
          </div>
          <hr />
          <AddEditIssuers
            getTableData={props.getTableData}
            columns={columns}
            close={() => {
              show ? setShow(false) : setEdit(false);
            }}
            id={edit ? rowId : ""}
            rowdata={edit ? rowdata : ""}
          />
        </Container>
      </Modal>
      <DeleteModal
        title=" جهة الاصدار"
        showDelete={showDelete}
        id={rowId}
        closeDelete={closeDelete}
        onDelete={onDelete}
      />{" "}
      <Row>
        <Col>
          <Form.Item name="searchText" hasFeedback label="ابحث">
            <Search
              name="searchText"
              onChange={handleUserInput}
              onPressEnter={(e) =>
                queryStringSearch(e, props, columns, "issuer", "name")
              }
              value={searchText}
              placeholder="ابحث..."
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
export default Issuer;
