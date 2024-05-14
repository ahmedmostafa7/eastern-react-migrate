import React, { useState, useEffect } from "react";
import {
  Modal,
  Row,
  Col,
  // TextArea,
  Button,
  Form,
  Checkbox,
  message,
  Select,
  Input,
} from "antd";
import axios from "axios";
function SMS({ smsModalVisible, setSmsModalVisible, item, form }) {
  let [textArea, setTextArea] = useState("");
  let [tableData, setTableData] = useState([]);
  let [action_id, setActionId] = useState("");
  let [actions, setActions] = useState([]);
  let { getFieldDecorator } = form;
  let [checkboxesValues, setCheckbox] = useState(false);
  let { TextArea } = Input;
  const translate_step_actions = {
    "global.SENDAMANA": "ارسال الى الامانة",
    "global.ASSIGN": "توجيه",
    "global.VERIFY": "تأكيد",
    "global.RETURNFROMSTART": "اعادة توجيه مع اعادة المسار ",
    "global.TRANSFER": "تحويل",
    "global.ASSIGNMULTI": " توجيه لمتعدد",
    "global.REJECT": "اعتذار",
    "global.SUBMIT": "ارسال",
    "global.RETURN": "اعادة توجيه",
    "global.GOTO": "مخاطبة",
    "global.APPROVE": "موافقه و توجيه الى",
    انهاء: "انهاء",
    "global.FINISH": "انهاء",
    "global.STOP": "ايقاف",
    "global.BACK": "السابق",
    // "global.TRANSFER": "ايقاف",
  };
  const onChangeCheckbox = (value) => {
    setCheckbox(value);
  };
  const handleUserTextArea = (e) => {
    setTextArea(e.target.value);
  };
  const handleActions = (value, e) => {
    setActionId(e.props.id);
  };
  const addSMS = () => {
    // let checkboxis=
    if (checkboxesValues && textArea && action_id) {
      let checkboxes = checkboxesValues?.reduce(
        (a, v) => ({ ...a, [v]: 1 }),
        {}
      );
      let data = {
        step_id: item.id,
        text: textArea,
        ...checkboxes,
        action_id: action_id,
        // id: item.id,
      };
      var concatedData = tableData.concat(data);

      if (tableData.length >= 1 || concatedData.length >= 1) {
        var valueArr = concatedData.map(function (item) {
          return `${item.text} - ${item.action_id}`;
        });

        var isDuplicate = valueArr.some(function (f, idx) {
          return valueArr.indexOf(f) != idx;
        });
        if (isDuplicate) {
          message.info("تم الاضافة من قبل");
        } else {
          let checkData = concatedData.map((x) => x.text);
          // let checkCheckboxs = concatedData.map(
          //   (x) => x.to_actor || x.to_owners || x.creator
          // );
          if (checkData.includes(undefined)) {
            message.info("من فضلك ادخل الرسالة");
          } else {
            axios
              .post(window.host + `/api/stepSms`, data, {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${localStorage.token}`,
                },
              })
              .then((res) => {
                // setSmsModalVisible(false);
                let id = res?.data?.id;
                concatedData[concatedData.length - 1].id = id;
                setTableData(concatedData);
                console.log("tableData", concatedData);
              });
          }
        }
      }
    } else {
      message.info("من فضلك اختر نص الرسالة و جهة ارسال ");
    }
  };
  const filterActions = (id) => {
    return actions?.filter((d) => d.id == id)[0]?.name ?? "";
  };

  useEffect(() => {
    let smsRequest = axios.get(
      window.host + `/api/stepSms/GetAll?filter_key=step_id&q=${item.id}`
    );

    let actionRequest = axios.get(`${window.host}/api/actions`);

    axios.all([smsRequest, actionRequest]).then(
      axios.spread((smsReq, actionReq) => {
        {
          setTableData(smsReq.data.results);
          let arabic_actions_name = actionReq.data.results.map((d) => ({
            ...d,
            name: translate_step_actions[d.name],
          }));
          setActions(arabic_actions_name);
        }
      })
    );
  }, []);

  // const sendSMS = (data) => {
  //   axios
  //     .post(window.host + `/api/stepSms`, data, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         Authorization: `Bearer ${localStorage.token}`,
  //       },
  //     })
  //     .then((res) => {
  //       setSmsModalVisible(false);
  //     });
  // };
  const deleteRow = (row, e) => {
    if (row) {
      let deleteActiondata =
        tableData.length > 0 && tableData.filter((d) => d.id != row.id);
      axios
        .delete(window.host + `/api/stepSms/${row.id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((res) => {
          // setSmsModalVisible(false);
          //  setTableData(concatedData);
        });
      setTableData(deleteActiondata);
    }
  };
  return (
    <div>
      <Modal
        title=""
        visible={smsModalVisible}
        className="closeModal"
        width="63vw"
        footer={[
          <Button
            // style={{ float: "left" }}
            key="back"
            onClick={() => {
              setSmsModalVisible(false);
            }}
          >
            اغلاق
          </Button>,
        ]}
      >
        <form
          className="my-1 px-md-1 regForms"
          layout="vertical"
          // onSubmit={addGroup}
          name="validate_other"
        >
          <Row>
            <Col span={24} className="px-2">
              <Form.Item name="text" hasFeedback label="نص الرسالة">
                {getFieldDecorator("text", {
                  rules: [
                    {
                      required: true,
                      message: "من فضلك ادخل الرسالة",
                      max: "100",
                    },
                  ],
                  // initialValue: props.rowdata?.name,
                })(
                  <TextArea
                    name="text"
                    onChange={handleUserTextArea}
                    value={textArea}
                    placeholder="نص الرسالة"
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item>
                <Checkbox.Group
                  name="choices"
                  // style={{ width: "100%" }}
                  onChange={onChangeCheckbox}
                >
                  <Checkbox
                    value={"creator"}
                    // disabled={assign_to_creator}
                  >
                    ارسال الى المنشىء
                  </Checkbox>
                  <Checkbox
                    value={"to_owners"}
                    // disabled={assign_to_owner}
                  >
                    {" "}
                    ارسال الى المالك{" "}
                  </Checkbox>
                  <Checkbox value={"to_actor"}> ارسال الى المنفذ</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col span={24} className="px-2">
              <Form.Item
                rules={[
                  {
                    message: "من فضلك ادخل الاجراءت",
                    required: true,
                  },
                ]}
                name="selectedActions"
                hasFeedback
                label="الاجراءات"
              >
                {getFieldDecorator("selectedActions", {
                  rules: [
                    { required: true, message: "من فضلك ادخل الاجراءات" },
                  ],
                })(
                  <Select
                    showSearch
                    allowClear
                    // value={selectedJobs}
                    // mode="multiple"
                    onChange={handleActions}
                    placeholder="اختر الاجراءات"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {actions && actions.length !== 0
                      ? actions.map((inq, index) => (
                          <Select.Option
                            className="selectgroup"
                            value={inq?.name}
                            key={inq?.id}
                            name={inq?.name}
                            id={inq?.id}
                          >
                            {inq?.name}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} className="px-2">
              <Form.Item>
                <Button className="addbtn" onClick={addSMS}>
                  اضافه
                </Button>
              </Form.Item>
            </Col>
          </Row>
          {tableData && tableData.length > 0 && (
            <Row>
              <table className="table table-bordered">
                <thead>
                  <th>الرسالة</th>
                  <th>ارسال للمالك</th>
                  <th>ارسال للمنشىء</th>
                  <th>ارسال للمنفذ</th>
                  <th>الاجراءات</th>
                  <th>#</th>
                </thead>
                <tbody>
                  {tableData.map((d, i) => {
                    return (
                      <tr key={i}>
                        <td>{d.text}</td>
                        <td>
                          {d.to_owners == true ? (
                            <i className="fa fa-check"></i>
                          ) : (
                            <i className="fa fa-times"></i>
                          )}
                        </td>
                        <td>
                          {d.creator == true ? (
                            <i className="fa fa-check"></i>
                          ) : (
                            <i className="fa fa-times"></i>
                          )}
                        </td>
                        <td>
                          {d.to_actor == true ? (
                            <i className="fa fa-check"></i>
                          ) : (
                            <i className="fa fa-times"></i>
                          )}
                        </td>
                        <td>{filterActions(d.action_id)}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => deleteRow(d)}
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Row>
          )}
        </form>
        {/* <div>
          <button
            type="button"
            className="btn btn-success"
            onClick={() => {
              setSmsModalVisible(false);
            }}
          >
            اغلاق
          </button>
        </div> */}
      </Modal>
    </div>
  );
}

// export default SmS;
export default SMS;
