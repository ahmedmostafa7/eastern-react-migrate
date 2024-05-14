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
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
const ActionsSteps = ({
  item,
  steps,
  form,
  actions,
  groups,
  positions,
  setActionModalVisible,
  actionModalVisible,
}) => {
  let [textArea, setTextArea] = useState("");
  let [tableData, setTableData] = useState([]);
  let [action_id, setActionId] = useState("");
  let [showGAP, setShowGAP] = useState(false);
  let [group_id, setGroupId] = useState("");
  let [position_id, setPositionId] = useState("");
  let [name, setName] = useState("");
  let [color, setColor] = useColor("hex", "#121212");
  let [disableGr, setAssignGoP] = useState(false);
  let [disablePo, setAssignPoP] = useState(false);
  let { getFieldDecorator } = form;
  let [checkbox, setCheckbox] = useState(false);

  let [hideSteps, setHideSteps] = useState(false);
  let [stepsSingle, setStepsSingle] = useState(false);
  let [stepsMulti, setStepsMulti] = useState(false);
  let [selectedSingleStep, setStep] = useState(null);
  let [selectedMultiSteps, setSelectedMultiSteps] = useState("");

  let { TextArea } = Input;
  const handleActions = (value, e) => {
    setActionId(e.props.id);
    let restOfActionsId = [2, 5, 6, 7, 8, 9, 10, 11, 14];
    let showAndHiddenGAP = [5, 12, 14];
    let multiIds = [15, 3, 12];
    let singleIds = [1, 4, 13];
    if (showAndHiddenGAP.includes(e.props.id)) {
      setShowGAP(true);
    } else {
      setShowGAP(false);
    }

    if (restOfActionsId.includes(e.props.id)) {
      setHideSteps(false);
    } else {
      if (multiIds.includes(e.props.id)) {
        setHideSteps(true);
        setStepsMulti(true);
        setStepsSingle(false);
      } else {
        setHideSteps(true);
        setStepsMulti(false);
      }
      if (singleIds.includes(e.props.id)) {
        setHideSteps(true);
        setStepsSingle(true);
        setStepsMulti(false);
      } else {
        setHideSteps(true);
        setStepsSingle(false);
      }
    }
  };
  const onChangeCheckbox = (value) => {
    setCheckbox(value);
  };
  const handleSelectedGroupsActor = (value, e) => {
    if (value) {
      setGroupId(e.props.id);
      setAssignPoP(true);
    }
  };
  const handleSelectPositon = (value, e) => {
    setPositionId(e.props.id);
    setAssignGoP(true);
  };
  const handleName = (e) => {
    setName(e.target.value);
  };
  // const handleColor = (e) => {};
  const handleSteps = (value, e) => {
    if (stepsMulti) {
      let selectedSteps = [];

      selectedSteps = steps.filter((g) => {
        return e.find((x) => x.key == g.id);
      });
      let selectedStepsIndex = selectedSteps.map((d) => d.id).join(",");
      // setSelectedMultiSteps;
      setSelectedMultiSteps(selectedStepsIndex);
    } else {
      setStep(value);
    }
  };
  // const handleSelectedGroupsActor = (value, e) => {};
  const deleteRow = (row) => {
    let deleteActiondata =
      tableData.length > 0 && tableData.filter((d) => d.id != row.id);
    axios
      .delete(window.host + `/api/stepsactions/${row.id}`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        // setSmsModalVisible(false);
        //  setTableData(concatedData);
        message.success("تم الحذف بنجاح");
        setTableData(deleteActiondata);
      });
  };
  useEffect(() => {
    axios
      .get(
        window.host + `/api/stepsactions/GetAll?filter_key=step_id&q=${item.id}`
      )
      .then((res) => {
        setTableData(res.data.results);
      });
  }, []);
  const addAction = () => {
    let data = {
      label_name: name,
      color: checkbox == "color" ? color.hex : null,
      action_id: action_id,
      groupid: group_id ? group_id : null,
      positionid: position_id ? position_id : null,
      step_id: item.id,
      next_step: stepsSingle ? selectedSingleStep : null,
      action_steps: stepsMulti ? selectedMultiSteps : null,
    };
    console.log(data);
    if (!data.action_id) {
      message.info("من فضلك ادخل الجرائات");
    } else {
      var concatedData = tableData.concat(data);
      if (tableData.length >= 1 || concatedData.length >= 1) {
        var valueArr = concatedData.map(function (item) {
          return item.action_id;
          // return `${item.label_name} - ${item.action_id}-${item.next_step}`;
        });

        var isDuplicate = valueArr.some(function (f, idx) {
          return valueArr.indexOf(f) != idx;
        });
        if (isDuplicate) {
          message.info("تم الاضافة من قبل");
        } else {
          let checkData = concatedData.map((x) => x.action_id);
          if (checkData.includes(undefined)) {
            message.info("من فضلك ادخل الجرائات");
          } else {
            axios
              .post(window.host + `/api/stepsactions`, data, {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${localStorage.token}`,
                },
              })
              .then((res) => {
                // setSmsModalVisible(false);
                message.success("تم الاضافة بنجاح");
                let id = res?.data?.id;
                concatedData[concatedData.length - 1].id = id;
                setTableData(concatedData);
                setGroupId(null);
              });

            console.log("tableData", tableData);
          }
        }
      }
    }
  };
  const filterActions = (id) => {
    return actions?.filter((d) => d.id == id)[0]?.name ?? "";
  };
  const filterGroupId = (id) => {
    return groups?.filter((d) => d.id == id)[0]?.name ?? "";
  };
  const filterPositionId = (id) => {
    return positions?.filter((d) => d.id == id)[0]?.name ?? "";
  };
  const filterSteps = (ids, type) => {
    let filteredSteps;
    if (type == "action_steps") {
      let intIds = ids.split(",").map((x) => parseInt(x));
      filteredSteps = steps
        ?.filter((d) => intIds.includes(d.id))
        .map((x) => x.name);
      return filteredSteps?.join("-");
    } else if (type == "next_step") {
      filteredSteps = steps?.filter((d) => d.id == ids)[0]?.name;
      return filteredSteps;
    } else return "";
  };
  return (
    <div>
      <div>
        <Modal
          title=""
          visible={actionModalVisible}
          closable={false}
          className="closeModal"
          width="63vw"
          footer={[
            <Button
              // style={{ float: "left" }}
              key="back"
              onClick={() => {
                setActionModalVisible(false);
                window.location.reload();
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
                      // mode="multiple"
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
                              value={inq?.id}
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
              <Col span={24} className="px-2">
                <Form.Item name="name" hasFeedback label="الاسم ">
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "من فضلك ادخل الاسم",
                        max: "100",
                      },
                    ],
                    // initialValue: props.rowdata?.name,
                  })(
                    <Input
                      name="name"
                      onChange={handleName}
                      value={name}
                      placeholder="الاسم "
                    />
                  )}
                </Form.Item>
              </Col>
              <Col span={24} className="px-2">
                <Form.Item>
                  <Checkbox.Group
                    name="check_color"
                    // style={{ width: "100%" }}
                    onChange={onChangeCheckbox}
                  >
                    <Checkbox
                      value={"color"}
                      // disabled={assign_to_creator}
                    >
                      تحديد اللون{" "}
                    </Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
              {checkbox == "color" && (
                <Col span={24} className="px-2">
                  <Form.Item name="color" hasFeedback label="اللون ">
                    {getFieldDecorator(
                      "color",
                      {}
                    )(
                      <ColorPicker
                        width={450}
                        height={100}
                        color={color}
                        onChange={setColor}
                        hideHSV
                        dark
                      />
                    )}
                  </Form.Item>
                </Col>
              )}
              {hideSteps && (
                <Col span={24} className="px-2">
                  <Form.Item
                    rules={[
                      {
                        message: "من فضلك اختر الخطوات   ",
                        required: true,
                      },
                    ]}
                    name="related_step_actor"
                    hasFeedback
                    label=" الخطوات "
                  >
                    {getFieldDecorator("related_step_actor", {
                      // initialValue: rowdata?.related_step_actor,
                    })(
                      <Select
                        virtual={false}
                        mode={stepsMulti ? "multiple" : "single"}
                        showSearch
                        allowClear
                        onChange={handleSteps}
                        placeholder="اختر الخطوات"
                        getPopupContainer={(trigger) => trigger.parentNode}
                      >
                        {steps?.length !== 0
                          ? steps?.map((st, index) => (
                              <Select.Option
                                className="selectgroup"
                                value={st.id}
                                key={st.id}
                                id={st.id}
                              >
                                {st.name}
                              </Select.Option>
                            ))
                          : null}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              )}
              {showGAP && (
                <div>
                  <Col span={24} className="px-2">
                    <Form.Item
                      rules={[
                        {
                          message: "من فضلك اختر المجموعات",
                          required: true,
                        },
                      ]}
                      name="selectedGroupActor"
                      hasFeedback
                      label="ممثل الخطوة (المجموعة)"
                    >
                      {getFieldDecorator("selectedGroupActor", {
                        rules: [
                          { required: true, message: "من فضلك ادخل الإسم" },
                        ],
                        // initialValue: filterGroupsArrayForEdit(
                        //   props?.rowdata?.group_creator
                        // ),
                      })(
                        <Select
                          virtual={false}
                          showSearch
                          disabled={disableGr}
                          allowClear={true}
                          onChange={handleSelectedGroupsActor}
                          placeholder="اختر المجموعة"
                          getPopupContainer={(trigger) => trigger.parentNode}
                        >
                          {groups && groups.length !== 0
                            ? groups.map((gr, index) => (
                                <Select.Option
                                  className="selectgroup"
                                  value={gr.name}
                                  key={gr.id}
                                  id={gr.id}
                                >
                                  {gr.name}
                                </Select.Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-2">
                    <Form.Item
                      rules={[
                        {
                          message: "من فضلك المسمى الوظيفى",
                          required: true,
                        },
                      ]}
                      name="selectedPosition"
                      hasFeedback
                      label="ممثل الخطوة (المسمى الوظيفى)"
                    >
                      {getFieldDecorator("selectedPosition", {
                        rules: [
                          { required: true, message: "من فضلك ادخل المسمى" },
                        ],
                        // initialValue: filterPositionIdArray(
                        //   props?.rowdata?.assign_to_position_id
                        // ),
                      })(
                        <Select
                          virtual={false}
                          showSearch
                          allowClear={true}
                          disabled={disablePo}
                          onChange={handleSelectPositon}
                          placeholder="المسمى الوظيفى"
                          getPopupContainer={(trigger) => trigger.parentNode}
                        >
                          {positions && positions.length !== 0
                            ? positions.map((inq, index) => (
                                <Select.Option
                                  className="selectgroup"
                                  value={inq.name}
                                  key={inq.id}
                                  id={inq.id}
                                >
                                  {inq.name}
                                </Select.Option>
                              ))
                            : null}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>{" "}
                </div>
              )}
            </Row>
            <Row>
              <Col span={24} className="px-2">
                <Form.Item>
                  <Button className="addbtn" onClick={addAction}>
                    اضافه
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            {tableData && tableData.length > 0 && (
              <Row>
                <table className="table table-bordered">
                  <thead>
                    <th>الاجراء</th>
                    <th>الاسم</th>
                    <th>اللون </th>
                    <th>الخطوات </th>
                    <th>المسمى الوظيفى </th>
                    <th>المجموعة</th>
                    <th>#</th>
                  </thead>
                  <tbody>
                    {tableData.map((d, i) => {
                      return (
                        <tr key={i}>
                          <td>{filterActions(d.action_id)}</td>
                          <td>{d.label_name}</td>
                          <td>
                            <div
                              style={{
                                background: checkbox == "color" ? d.color : "",
                                width: "50px",
                                height: "50px",
                              }}
                            ></div>
                          </td>
                          <td>
                            {d.next_step
                              ? filterSteps(d.next_step, "next_step")
                              : d.action_steps
                              ? filterSteps(d.action_steps, "action_steps")
                              : filterSteps(null, null)}
                          </td>
                          <td>{filterPositionId(d.positionid)}</td>
                          <td>{filterGroupId(d.groupid)}</td>
                          {/* <td>{filterActions(d.action_id)}</td> */}
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
    </div>
  );
};

export default ActionsSteps;
