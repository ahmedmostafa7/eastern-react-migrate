import React, { useEffect, useState } from "react";
import { Select, Row, Col, Input, Form } from "antd";
import axios from "axios";
import { Button } from "react-bootstrap";
import AddModal from "../Modals/AddModal";
import EditModal from "../Modals/EditModal";
import queryStringSearch from "./queryStringSearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";
// import qs
const { Search } = Input;
function Apps(props) {
  const [showEdit, setShowEdit] = useState(null);
  const [count, setCount] = useState(0);
  const [allDataTable, setAllTableData] = useState([]);
  const [rowId, setRowId] = useState(0);
  const [rowdata, setRowData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [columns] = useState([
    {
      title: "الاسم",
      dataIndex: "translate_ar_caption",
      key: "translate_ar_caption",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "عدد الطلبات المسموح بتقديمها",
      dataIndex: "max_request_no",
      key: "max_request_no",
      render: (text) => <a>{text}</a>,
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
        </>
      ),
    },
  ]);

  useEffect(() => {
    axios
      .get(window.host + "/api/applications", {
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

  const openEdit = (e, data) => {
    setRowId(e.id);
    setRowData(e);
    setShowEdit(true);
  };
  const closeEditModal = () => {
    setRowId(0);
    setShowEdit(false);
  };

  const handleUserInput = (e) => {
    // console.log(value);

    setSearchText(e.target.value);
    if (e.target.value == "") {
      props.getTableData(columns, allDataTable, count);
    }
  };
  return (
    <div className="baladyaAdmin">
      <Row>
        <Col>
          <Form.Item name="searchText" hasFeedback label="ابحث">
            <Search
              name="searchText"
              onChange={handleUserInput}
              onPressEnter={(e) =>
                queryStringSearch(
                  e,
                  props,
                  columns,
                  "applications",
                  "translate_ar_caption"
                )
              }
              value={searchText}
              placeholder="ابحث..."
            />
          </Form.Item>
        </Col>
      </Row>

      <EditModal
        title="applications"
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
export default Apps;
