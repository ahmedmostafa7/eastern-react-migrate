import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import jsonp from "fetch-jsonp";
import qs from "qs";
import AddEditModal from "./addeditmodal";
import SmsModal from "./smsModal";
import {
  Row,
  Col,
  Form,
  Select,
  Input,
  Radio,
  Tooltip,
  message,
  Modal,
  Button,
} from "antd";
import axios from "axios";
import { FaSignature, FaCog } from "react-icons/fa";
import {
  ReOrderableItem,
  ReOrderableList,
  ReOrderableListGroup,
} from "react-reorderable-list";
import ShowDetails from "./showDetalsModal";
import { ListGroup } from "react-bootstrap";
import ActionModal from "./actionsLogic";
import { faEye, faPen, faEnvelope } from "@fortawesome/free-solid-svg-icons";

function Box({
  name,
  item,
  length,
  workflowId,
  steps,
  form,
  actions,
  positions,
  groups,
}) {
  const { getFieldDecorator } = form;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sendFeedback, setSendFeedback] = useState(false);
  const [signOrder, setSignOrder] = useState(0);
  const [lastSignOrder, setLastSignOrder] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [smsModalVisible, setSmsModalVisible] = useState(false);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [deletedRows, setDeletedrows] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [newUserData, setNewUsersData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [radioOption, setRadioOption] = useState(false);
  const [title, setTitle] = useState("");
  const [commitiesModal, setCommitiesModal] = useState(false);

  console.log(item);
  const showModal = () => {
    setIsModalVisible(true);
  };
  const editData = () => {
    setEditModalVisible(true);
  };
  useEffect(() => {}, []);
  const send = () => {
    setSmsModalVisible(true);
    // ("api/StepSMS/");
  };
  let timeout;
  let currentValue;
  const fetch = (value, callback) => {
    if (timeout) {
      window.clearTimeout(timeout);
      timeout = null;
    }

    currentValue = value;

    const fake = () => {
      // if (value.length >= 3) {
      const str = qs.stringify({
        code: "utf-8",
        q: value,
        filter_key: "name",
        contain: "true",
        operand: "=",
        order: "desc",
        page: 0,
        pageSize: 30,
      });
      axios
        .get(window.host + `/api/user?${str}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((res) => {
          callback(res.data.results);
          console.log(users);
          //  setCommitiesModal(true);
        });
      // fetch(newValue, setUsers);

      // else {
      //   setUsers([]);
      // }
    };

    timeout = setTimeout(fake, 100);
  };

  const handleSearch = (newValue) => {
    if (newValue.length >= 3) {
      fetch(newValue, setUsers);
    } else {
      setUsers([]);
    }
  };
  const sendCommeties = () => {
    console.log(tableData);
    axios
      .put(window.host + `/steps/${item?.id}/signatures`, tableData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setCommitiesModal(false);
        message.success("تم الحفظ بنجاح");
      });
  };
  const handleUserTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleUsers = (value, e) => {
    let selectedUser = users.filter((g) => g.id == e.key);

    console.log("sel", selectedUser);

    setSelectedUser(selectedUser);
    setTitle(selectedUser?.[0]?.positions?.name);
  };

  // const saved_data = JSON.parse(item?.saved_data);
  const saveCommeties = () => {
    let userRequest = axios.get(window.host + "/api/user", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.token}`,
      },
    });
    // .then((res) => {
    //   setUsers(res.data.results);
    let backendDataRequest = axios.get(
      window.host + `/steps/${item?.id}/signatures`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
    );
    axios.all([userRequest, backendDataRequest]).then(
      axios.spread((usersReq, backendData) => {
        setUsers(usersReq.data.results);
        let newStoredData = backendData.data.map((f, i) => ({
          ...f,
          name: f?.user?.name,
          //   .data.results
          //     // .filter((s) => s.id == f.user_id)
          //     .map((d) => d.name)[
          //   // delete: deleteRow(f, tableData),
        }));
        let sorted = newStoredData.sort((v, c) => v.sign_order - c.sign_order);
        setTableData(sorted);
        if (newStoredData.length > 0) {
          let lastSignOrder =
            newStoredData[newStoredData.length - 1]?.sign_order;
          setSignOrder(lastSignOrder);
          // newStoredData.map((x) => () => {
        }
        //   x.delete.deleteRow.call(tableData, x);
        // });
        console.log(newStoredData, lastSignOrder);
        setCommitiesModal(true);
      })
    );
    // .then((res) => {

    // });
    // });
  };
  const onChangeRadio = (e) => {
    setRadioOption(e.target.value);
  };
  const addCommites = () => {
    let data =
      selectedUser.length > 0 &&
      selectedUser.map((d, i) => ({
        name: d.name,
        title: title,
        step_id: item.id,
        user_id: d.id,
        sign_order: signOrder >= 1 ? signOrder + 1 : i + 1,
        sign_priority: signOrder >= 1 ? signOrder + 1 : i + 1,
        is_manual: radioOption,
      }));
    // if(data)
    var concatedData = tableData.concat(data);
    if (tableData.length >= 1 || concatedData.length >= 1) {
      var valueArr = concatedData.map(function (item) {
        return item.name;
      });

      var isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx;
      });
      if (isDuplicate) {
        message.info("تم الاضافة من قبل");
      } else {
        let checkData = concatedData.map((x) => x.name);
        if (checkData.includes(undefined)) {
          message.info("من فضلك ادخل الموقعين");
        } else {
          // reorderAfterDarag(concatedData);
          let sorted = concatedData.sort((v, c) => v.sign_order - c.sign_order);
          setTableData(sorted);
          console.log("tableData", tableData);
        }
      }
    }
    // if (tableData.length > 0) {
    //
    //   setTableData(concatedDataBacked);
    // }
    setSignOrder((prev) => (signOrder > 1 ? signOrder + 1 : prev + 1));
    // let concatedData = tableData.concat(data);
    // else {
    //   setTableData(data);
    // }
    // console.log(data);
  };
  // };
  const deleteRow = (row, tableDataSent) => {
    let deleteActiondata =
      tableData.length > 0 && tableData.filter((d) => d.user_id != row.user_id);
    // setDeletedrows(deleteActiondata);
    // reorderAfterDarag(deleteActiondata);
    let lastSignOrder =
      deleteActiondata[deleteActiondata.length - 1]?.sign_order;
    setSignOrder(lastSignOrder);

    let sorted = deleteActiondata.sort((v, c) => v.sign_order - c.sign_order);

    reorderAfterDarag(sorted);
  };
  const reorderAfterDarag = (list) => {
    let newList = list.map((d, i) => ({
      ...d,
      sign_order: i + 1,
      sign_priority: i + 1,
    }));
    setTableData(newList);
    console.log(newList);
  };
  return (
    <div>
      <div
        // ref={drag}
        // key={key}
        style={{
          boxShadow: "1px 0px 4px",
          padding: "20px",
          margin: "20px",
          // width: "15vw",
          height: "15vh",
          textAlign: "right",
          background: "#fff",
        }}
      >
        <div
          style={{
            background: "#33b8ac",
            padding: "10px",
            height: "5vh",
            display: "flex",
            color: "#fff",
            cursor: "pointer",
            gridGap: "20px",
            justifyContent: "space-around",
          }}
        >
          <Tooltip placement="top" title="بيانات الخطوة">
            <FontAwesomeIcon icon={faEye} onClick={showModal} />
          </Tooltip>
          <Tooltip placement="top" title="تعديل الخطوة">
            <FontAwesomeIcon icon={faPen} onClick={editData} />
          </Tooltip>
          <Tooltip placement="top" title="الرسائل">
            <FontAwesomeIcon icon={faEnvelope} onClick={send} />
          </Tooltip>
          <Tooltip placement="top" title="الموقعين">
            <FaSignature onClick={saveCommeties} />
          </Tooltip>
          <Tooltip placement="top" title="الاجراءات">
            <FaCog
              onClick={setActionModalVisible}
              // style={{ marginRight: "3vw" }}
            />
          </Tooltip>
        </div>
        {name}
      </div>
      <ShowDetails
        item={item}
        setIsModalVisible={setIsModalVisible}
        isModalVisible={isModalVisible}
        steps={steps}
      />

      <Modal
        title="تعديل خطوة"
        width="63vw"
        visible={editModalVisible}
        footer={null}
        onCancel={() => {
          setEditModalVisible(false);
        }}
      >
        <AddEditModal
          edit={true}
          rowdata={item}
          steps={steps}
          length={length}
          workflowId={workflowId}
          visible={() => {
            setEditModalVisible(false);
          }}
        />
      </Modal>

      <Modal
        title="الموقعين"
        width="63vw"
        closable={false}
        visible={commitiesModal}
        footer={null}
        onCancel={() => {
          setCommitiesModal(false);
        }}
      >
        <form
          className="my-1 px-md-1 regForms"
          layout="vertical"
          // onSubmit={addGroup}
          name="validate_other"
        >
          <Row>
            <Col span={24} className="px-2">
              <Form.Item
                rules={[
                  {
                    message: "من فضلك ادخل الموقعين",
                    required: true,
                  },
                ]}
                name="selectedCommittes"
                hasFeedback
                label="الموقعين"
              >
                {getFieldDecorator("selectedCommittes", {
                  rules: [{ required: true, message: "من فضلك ادخل الموقعين" }],
                  // initialValue: "",
                })(
                  <Select
                    showSearch
                    allowClear
                    onSearch={handleSearch}
                    // value={selectedJobs}
                    // onDropdownVisibleChange={() => {
                    //   setUsers([]);
                    // }}
                    onClear={() => {
                      setUsers([]);
                    }}
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    // optionFilterProp="children"
                    // filterOption={false}
                    // mode="multiple"
                    onChange={handleUsers}
                    notFoundContent={null}
                    // optionFilterProp="name"
                    placeholder="اختر الموقعين"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {users && users.length !== 0
                      ? users.map((inq, index) => (
                          <Select.Option
                            className="selectgroup"
                            value={inq.name}
                            key={inq.id}
                            name={inq.name}
                            id={inq.id}
                          >
                            {inq.name}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={24} className="px-2">
              <Form.Item name="title" hasFeedback label="الوظيفة ">
                {getFieldDecorator("title", {
                  rules: [
                    {
                      required: true,
                      message: "من فضلك ادخل الوظيفة ",
                      max: "100",
                    },
                  ],
                  initialValue: selectedUser[0]?.positions?.name,
                })(
                  <Input
                    name="title"
                    onChange={handleUserTitle}
                    value={title}
                    initialValues={selectedUser[0]?.positions?.name}
                    placeholder="الوظيفة "
                  />
                )}
              </Form.Item>
            </Col>

            <Col span={24} className="px-2">
              <Form.Item name="name" hasFeedback label="التوقيع الالكترونى ">
                <Radio.Group onChange={onChangeRadio} value={radioOption}>
                  <Radio value={true}>نعم</Radio>

                  <Radio value={false}> لا</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={24} className="px-2">
              <Form.Item>
                <Button className="addbtn" onClick={addCommites}>
                  اضافه
                </Button>
              </Form.Item>
            </Col>
          </Row>
          {tableData.length >= 1 && (
            <Row>
              {/* <table className="table table-bordered"> */}
              <div
                style={{
                  display: "grid",
                  justifyItems: "center",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  border: "1px solid #ddd",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                {/* <div>الاسم</div> */}
                <div>الموقعين</div>
                <div>الوظيفة</div>
                <div>التوقيع الالكترونى</div>
                <div>حذف</div>
                {/* <th>الترتيب</th> */}
              </div>

              <ReOrderableList
                //The unique identifier for this list. Should be unique from other lists and list groups.
                name="list2"
                //your list data
                list={tableData}
                //the list update callback
                onListUpdate={(newList) => reorderAfterDarag(newList)}
                component={ListGroup}
              >
                {tableData.map((d, index) => (
                  <ReOrderableItem key={`item-${d.sign_order}`}>
                    <ListGroup.Item>
                      <div
                        style={{
                          display: "grid",
                          justifyItems: "center",
                          gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        }}
                      >
                        {/* <div>{d.title}</div> */}
                        <div>{d.name}</div>
                        <div style={{ whiteSpace: "nowrap" }}>{d.title}</div>
                        <div>
                          {d.is_manual == true ? (
                            <i className="fa fa-check"></i>
                          ) : (
                            <i className="fa fa-times"></i>
                          )}
                        </div>
                        <div>
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => deleteRow(d)}
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </ListGroup.Item>
                  </ReOrderableItem>
                ))}
              </ReOrderableList>
            </Row>
          )}
        </form>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <button
            type="button"
            className="btn btn-success"
            onClick={sendCommeties}
          >
            حفظ
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              setCommitiesModal(false);
            }}
          >
            اغلاق
          </button>
        </div>
      </Modal>
      {smsModalVisible && (
        <SmsModal
          smsModalVisible={smsModalVisible}
          setSmsModalVisible={setSmsModalVisible}
          item={item}
        />
      )}
      {actionModalVisible && (
        <ActionModal
          item={item}
          actionModalVisible={actionModalVisible}
          setActionModalVisible={setActionModalVisible}
          steps={steps}
          actions={actions}
          groups={groups}
          positions={positions}
        />
      )}
    </div>
  );
}

// export default Box;
export default Form.create()(Box);
