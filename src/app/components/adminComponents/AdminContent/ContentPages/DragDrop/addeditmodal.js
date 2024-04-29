import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Container } from "react-bootstrap";
import {
  Form,
  Row,
  Col,
  Table,
  InputNumber,
  Input,
  Radio,
  Checkbox,
  Button,
  notification,
  Select,
} from "antd";
import { set } from "lodash";
import { withTranslation } from "react-i18next";
function AddEditStep(props) {
  console.log("steps", props.steps);
  const [name, setName] = useState("");
  const [groups, setGroups] = useState([]);
  const [scalation, setScalation] = useState(false);
  const [assign_to_group_id, setGroupId] = useState("");
  const [checkGp, setCheckGp] = useState(true);
  const [assign_to_owner, setAssignToOwner] = useState(false);
  const [assign_to_creator, setAssignToCreator] = useState(false);
  const [anotherCheck, setShowAnotherCheck] = useState(false);
  const [showhiddenfields, setShowHiddenFields] = useState(false);
  const [assignActor, setAssignActor] = useState(false);

  const [applications, setApps] = useState([]);
  const [module_id, setModuleId] = useState("");
  const [assign_to_position_id, setPositionId] = useState("");
  const [scalator_position_id, setScalatedPosition] = useState("");
  const [stepActorId, setStepActorId] = useState("");

  const [selectedPosition, setSelectedPosition] = useState({});
  const [selectedModule, setSelectedModule] = useState({});
  const [positions, setPositions] = useState([]);
  const [modules, setModules] = useState([]);
  const [actions, setActions] = useState([]);
  const [steps_actions, setSelectedActions] = useState([]);
  const [stepID, setSelectedActionsStepID] = useState([]);

  const [activated, setِِِActivated] = useState(1);
  const [expire_period, setExpirePeriod] = useState();
  const [filename, setFilename] = useState();
  const [checkboxValues, setCheckbox] = useState();
  const [secondcheckboxValues, setSecondCheckboxes] = useState();
  const [print_data, setPrintData] = useState();

  const [unique, setUnique] = useState(true);
  const [uniqueError, setUniqueError] = useState("");
  const [tableColumns, setTableColumns] = useState([]);
  const [appId, setAppId] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [scalation_hours, setScalationHours] = useState("");
  const [allMod, setAllMod] = useState([]);
  const [savedData, setSavedData] = useState("");
  const [validated_data, setCheckedData] = useState("");

  const [scalator_group_id, setGroupIdScalation] = useState("");
  const [group_id_actor, setGroupIdActor] = useState([]);
  const translate_step_actions = {
    "global.SENDAMANA": "ارسال الى الامانة",
    "global.ASSIGN": "توجيه",
    "global.ASSIGNMULTI": " توجيه لمتعدد",
    "global.REJECT": "اعتذار",
    "global.SUBMIT": "ارسال",
    "global.RETURN": "اعادة توجيه",
    "global.GOTO": "مخاطبة",
    "global.APPROVE": "موافقه و توجيه الى",
    انهاء: "انهاء",
    "global.STOP": "ايقاف",
    "global.TRANSFER": "global.TRANSFER",
    "global.BACK": "السابق",
    // "global.TRANSFER": "ايقاف",
  };
  const [formValues, setFormValues] = useState({});
  const handleScalationHoursChange = (value) => {
    setScalationHours(value);
  };
  const handleScalationPosition = (value, e) => {
    // setScalationHours(value);
    setScalatedPosition(e.key);
  };
  const handleScalationGroup = (value, e) => {
    setGroupIdScalation(e.props.id);
  };
  const handleUserInput = (e) => {
    setName(e.target.value);
    axios
      .get(
        window.host + `/api/workflow/CheckUnique/?key=name&q=${e.target.value}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setUnique(true);
          setUniqueError("");
        }
      })
      .catch((error) => {
        if (error.response.status === 302) {
          setUnique(false);
          setUniqueError("هذا المسمي موجود سابقا");
        }
      });
  };
  useEffect(() => {
    axios.get(`${window.host}/api/position`).then((res) => {
      setPositions(res.data.results);
      // console.log("apps",)
    });
    axios.get(`${window.host}/api/actions`).then((res) => {
      let arabic_actions_name = res.data.results.map((d) => ({
        ...d,
        name: translate_step_actions[d.name],
      }));
      setActions(arabic_actions_name);
      // console.log("apps",)
    });
    axios.get(`${window.host}/api/modules`).then((res) => {
      setModules(res.data.results);
      // console.log("apps",)
    });
    // axios.get(`${window.host}/api/applications`).then((res) => {
    //   setApps(res.data.results);
    //   // console.log("apps",)
    // });
    axios
      .get(`${window.host}/api/groups?page=0&pageSize=100000`)
      .then((res) => {
        setGroups(res.data.results);
      });
    // console.log(applications);
  }, []);
  const filterGroupsArrayForEdit = (id) => {
    if (groups.length > 0) return groups.filter((d) => d.id == id)[0]?.name;
  };
  const filterModulesArray = (id) => {
    if (modules.length > 0) return modules.filter((d) => d.id == id)[0]?.name;
  };
  const filterPositionIdArray = (id) => {
    if (positions.length > 0)
      return positions.filter((d) => d.id == id)[0]?.name;
  };
  const handleActions = (value, e) => {
    let selectedAction = [];
    if (value.includes("selectAll")) {
      setSelectedActions(actions);
    }
    if (value.includes("deleteAll")) {
      setSelectedActions([]);
    }
    // else {
    selectedAction = actions.filter((g) => {
      return e.find((x) => x.key == g.id);
    });
    // let steps = value.map((d) => d.actions.name);
    let selectedActionWithActionId = selectedAction.map((d) => ({
      ...d,
      action_id: d.id,
    }));

    setSelectedActions(selectedActionWithActionId);
    console.log("ac", selectedAction);
    let selectedActionName = selectedAction.map((d) => d.name);

    if (
      selectedActionName.includes("انهاء") ||
      selectedActionName.includes("موافقه و توجيه الى") ||
      selectedActionName.includes("ارسال")
    ) {
      setShowHiddenFields(true);
    } else {
      setShowHiddenFields(false);
    }
    if (selectedActionName.includes("توجيه")) {
      setAssignActor(true);
    } else {
      setAssignActor(false);
    }
  };
  const handleSelectedGroupsActor = (value, e) => {
    setGroupIdActor(e.props.id);
  };
  const handleCheckData = (value, e) => {
    setCheckedData(JSON.stringify(value));
    console.log("checkedData", value, e);
  };
  const handleSaveData = (value, e) => {
    setSavedData(JSON.stringify(value));
    console.log("savedData", value, e);
  };
  const handleSelectedStepsActors = (value, e) => {
    // setSavedData(JSON.stringify(value));
    setStepActorId(e.props.id);
    console.log("stepActor", value, e);
  };
  const handlePrintData = (value, e) => {
    // setSavedData(JSON.stringify(value));
    setPrintData(JSON.stringify(value));
    console.log("stepActor", value, e);
  };
  const filterStepsActionsArray = (data) => {
    if (data) {
      // let step_id = data.map((d) => d.step_id)[0];
      // let action_id = data;
      // let selectedActonWithStepId = { steps_actions, step_id: step_id };
      // steps_actions.length > 0 &&
      // steps_actions.map((d) => ({
      //   ...d,
      //   step_id: step_id,
      // }));
      setSelectedActions(data);

      let steps = data.map((d) => d.actions.name);
      let arabic_actions_name = steps.map((d) => translate_step_actions[d]);
      // if (
      //   steps.includes("انهاء") ||
      //   steps.includes("global.APPROVE") ||
      //   steps.includes("global.SUBMIT")
      // ) {
      //   setShowHiddenFields(true);
      // } else {
      //   setShowHiddenFields(false);
      // }
      // if (steps.includes("global.ASSIGN")) {
      //   setAssignActor(true);
      // } else {
      //   setAssignActor(false);
      // }
      return arabic_actions_name;
    }
  };
  const confirmationAdd = () => {
    const args = {
      description: props.edit ? "تم تعديل الخطوة" : "تم إضافة الخطوة بنجاح",
      duration: 5,
      placement: "bottomLeft",
      bottom: 5,
      style: {
        background: "#176d73",
      },
    };
    notification.open(args);
    props.visible();
  };
  const handleExpirePeriod = (value, e) => {
    setExpirePeriod(value);
  };
  // const sendWorkflow = (values) => {};
  const handleSelectedModule = (value, e) => {
    console.log("gr", value, e);
    let module = modules.filter((x) => x.id == e.key);
    setSelectedModule(module);
    console.log(e, value, module);
    setModuleId(e.props.id);
  };
  // const onChangeRadio = (value, e) => {
  //   console.log("ra", value, e);
  //   setِِِActivated(value.target.value);
  // };
  // const handleFilename = (value, e) => {
  //   console.log("ra", value, e);
  //   setFilename(value.target.value);
  // };
  const onChangeCheckbox_after = (value, e) => {
    if (value.includes("scalation")) {
      setScalation(true);
    } else {
      setScalation(false);
    }
    setSecondCheckboxes(value);
  };
  const onChangeCheckbox = (value, e) => {
    console.log("ck", value, e);
    let createorIndex = value.indexOf("assign_to_creator");
    let owneerIndex = value.indexOf("assign_to_owner");
    let greaterIndex =
      owneerIndex > createorIndex ? owneerIndex : createorIndex;
    if (value.includes("is_create")) {
      setShowAnotherCheck(true);
    } else {
      setShowAnotherCheck(false);
    }
    value.includes("assign_to_creator")
      ? setAssignToOwner(true)
      : value.includes("assign_to_owner")
      ? setAssignToCreator(true)
      : !value.includes("assign_to_owner") &&
        !value.includes("assign_to_creator")
      ? setAssignToOwner(false) & setAssignToCreator(false)
      : "";
    setCheckbox(value);
    // setCheckbox(value);
  };
  const handleSelectPositon = (value, e) => {
    let position = positions.filter((x) => x.id == e.key);
    setSelectedPosition(position);
    console.log(e, value, position);
    setPositionId(e.key);
  };
  const handleSelectedGroups = (value, e) => {
    console.log("gr", value, e);

    setGroupId(e.props.id);
  };
  console.log("row", props.rowdata);
  const { getFieldDecorator } = props.form;
  const { showAdd, showEdit, open } = props;
  const addEditStep = () => {
    let firstCheckboxes = checkboxValues?.reduce(
      (a, v) => ({ ...a, [v]: 1 }),
      {}
    );
    let secondCheckboxes = secondcheckboxValues?.reduce(
      (a, v) => ({ ...a, [v]: 1 }),
      {}
    );
    // if (!firstCheckboxes) {
    const { rowdata } = props;
    let checkboxes = {
      assign_to_creator: props?.rowdata?.assign_to_creator,
      assign_to_owner: props?.rowdata?.assign_to_owner,
      is_create: props?.rowdata?.is_create,
      setCreator: props?.rowdata?.setCreator,
      is_deactivated: props?.rowdata?.is_deactivated,
      is_optional: props?.rowdata?.is_optional,
      scalation: props?.rowdata?.scalation,
      show_step_in_list: props?.rowdata?.show_step_in_list,
      can_warn: props?.rowdata?.can_warn,
      is_edit: props?.rowdata?.is_edit,
      generate_export_no: props?.rowdata?.generate_export_no,
      // index: props?.rowdata?.index,
      is_fees: props?.rowdata?.is_fees,
      is_municipality: props?.rowdata?.is_municipality,
      is_end: props?.rowdata?.is_end,
      is_eng_office: props?.rowdata?.is_eng_office,
      generate_fees: props?.rowdata?.generate_fees,
      // };
    };
    // if (!secondCheckboxes) {
    //   const { rowdata } = props;
    //   let secondCheckboxes = {
    //     is_deactivated: rowdata?.is_deactivated,
    //     is_optional: rowdata?.is_optional,
    //     scalation: rowdata?.scalation,
    //     show_step_in_list: rowdata?.show_step_in_list,
    //     can_warn: rowdata?.can_warn,
    //     is_edit: rowdata?.is_edit,
    //     generate_export_no: rowdata?.generate_export_no,
    //   };
    // }
    let data = {
      // assign_to_creator: assign_to_creator,
      // assign_to_owner: assign_to_owner,
      // is_create: is_create,
      // setCreator: setCreator,
      ...firstCheckboxes,

      // is_deactivated: is_deactivated,
      // is_optional: is_optional,
      // scalation: scalation,
      // show_step_in_list: show_step_in_list,
      // can_warn: can_warn,
      // is_edit: is_edit,
      // generate_export_no: 1,

      ...secondCheckboxes,

      index: props.edit ? props.rowdata.index : props?.length + 1,
      work_flow_id: props?.workflowId || props?.rowdata?.work_flow_id,

      assign_to_group_id:
        assign_to_group_id || props?.rowdata?.assign_to_group_id,
      assign_to_position_id:
        assign_to_position_id || props?.rowdata?.assign_to_position_id,
      module_id: module_id || props?.rowdata?.module_id,
      name: name || props?.rowdata?.name,
      savedData: savedData || props?.rowdata?.saved_data,
      validate_data: validated_data || props?.rowdata?.validate_data,
      steps_actions: steps_actions || props?.rowdata?.steps_actions,
      related_step_actor: stepActorId || props?.rowdata?.related_step_actor,
      print_data: print_data || props?.rowdata?.print_data,
      scalation_hours: scalation_hours || props?.rowdata?.scalation_hours,
      scalator_group_id: scalator_group_id || props?.rowdata?.scalator_group_id,
      scalator_position_id:
        scalator_position_id || props?.rowdata?.scalator_position_id,
    };
    console.log("Aa", data);
    if (data && props.edit) {
      let newData = {
        ...data,
        ...checkboxes,
      };
      axios
        .put(window.host + `/api/steps/${props?.rowdata?.id}`, newData, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((res) => confirmationAdd());
    } else {
      axios
        .post(window.host + "/api/steps", data, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        })
        .then((res) => confirmationAdd());
    }
  };
  return (
    <Container fluid>
      <form
        className="my-1 px-md-1 regForms"
        layout="vertical"
        // onSubmit={addGroup}
        name="validate_other"
      >
        <Row>
          <Col span={24} className="px-2">
            <Form.Item name="name" hasFeedback label="اسم الخطوة">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "من فضلك ادخل اسم الخطوة",
                    max: "100",
                  },
                ],
                initialValue: props.rowdata?.name,
              })(
                <Input
                  name="name"
                  onChange={handleUserInput}
                  value={formValues.name}
                  placeholder="اسم الخطوة"
                />
              )}
            </Form.Item>
            {uniqueError ? (
              <p style={{ color: "#c0392b" }}>{uniqueError}</p>
            ) : null}
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
                rules: [{ required: true, message: "من فضلك ادخل المسمى" }],
                initialValue: filterPositionIdArray(
                  props?.rowdata?.assign_to_position_id
                ),
              })(
                <Select
                  virtual={false}
                  showSearch
                  allowClear
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
          <Col span={24} className="px-2">
            <Form.Item
              rules={[
                {
                  message: "من فضلك اختر المجموعات",
                  required: true,
                },
              ]}
              name="selectedGroup"
              hasFeedback
              label="ممثل الخطوة (المجموعة)"
            >
              {getFieldDecorator("selectedGroup", {
                rules: [{ required: true, message: "من فضلك ادخل الإسم" }],
                initialValue: filterGroupsArrayForEdit(
                  props?.rowdata?.assign_to_group_id
                ),
              })(
                <Select
                  virtual={false}
                  showSearch
                  allowClear
                  onChange={handleSelectedGroups}
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
                  message: "من فضلك اختر ممثل الخطوة المختارة ",
                  required: true,
                },
              ]}
              name="related_step_actor"
              hasFeedback
              label=" ممثل الخطوة المختاره "
            >
              {getFieldDecorator("related_step_actor", {
                initialValue: props?.rowdata?.related_step_actor,
              })(
                <Select
                  virtual={false}
                  showSearch
                  allowClear
                  onChange={handleSelectedStepsActors}
                  placeholder="اختر المجموعة"
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {props && props?.steps?.length !== 0
                    ? props?.steps?.map((st, index) => (
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
          <Col span={24} className="px-2">
            <Form.Item>
              {getFieldDecorator("choices", {
                rules: [
                  // { required: true, message: " من فضلك ادخل اسم الملف" },
                ],
                initialValue: [
                  props?.rowdata?.assign_to_owner != null && "assign_to_owner",

                  props?.rowdata?.assign_to_creator != null &&
                    "assign_to_creator",
                  props?.rowdata?.is_create != null && "is_create",
                  props?.rowdata?.setCreator != null && "setCreator",
                ],
              })(
                <Checkbox.Group
                  name="choices"
                  // style={{ width: "100%" }}
                  onChange={onChangeCheckbox}
                >
                  <Checkbox
                    value={"assign_to_creator"}
                    disabled={assign_to_creator}
                  >
                    توجيه الى المنشىء
                  </Checkbox>
                  <Checkbox
                    value={"assign_to_owner"}
                    disabled={assign_to_owner}
                  >
                    {" "}
                    اتوجيه الى المالك{" "}
                  </Checkbox>
                  <Checkbox value={"is_create"}>خطوة انشاء</Checkbox>
                  {anotherCheck && (
                    <Checkbox value={"setCreator"}>ضبط المنشىء</Checkbox>
                  )}
                </Checkbox.Group>
              )}
            </Form.Item>
          </Col>
          <Col span={24} className="px-2">
            <Form.Item
              rules={[
                {
                  message: "من فضلك اختر المحتوى",
                  required: true,
                },
              ]}
              name="selectedContent"
              hasFeedback
              label="المحتوى"
            >
              {getFieldDecorator("selectedContent", {
                rules: [{ required: true, message: "من فضلك ادخل المحتوى" }],
                initialValue: filterModulesArray(props?.rowdata?.module_id),
              })(
                <Select
                  virtual={false}
                  showSearch
                  allowClear
                  onChange={handleSelectedModule}
                  placeholder="اختر المحتوى"
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {modules && modules.length !== 0
                    ? modules.map((gr, index) => (
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
                  message: "من فضلك ادخل الاجراءت",
                  required: true,
                },
              ]}
              name="selectedActions"
              hasFeedback
              label="الاجراءات"
            >
              {getFieldDecorator("selectedActions", {
                rules: [{ required: true, message: "من فضلك ادخل الاجراءات" }],
                initialValue: filterStepsActionsArray(
                  props?.rowdata?.steps_actions
                ),
              })(
                <Select
                  showSearch
                  allowClear
                  // value={selectedJobs}
                  mode="multiple"
                  onChange={handleActions}
                  placeholder="اختر الاجراءات"
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  <Select.Option
                    className="selectgroup"
                    value="selectAll"
                    key="selectAll"
                  >
                    اختيار الكل
                  </Select.Option>
                  <Select.Option
                    className="selectgroup"
                    value="deleteAll"
                    key="deleteAll"
                  >
                    حذف الكل
                  </Select.Option>
                  {actions && actions.length !== 0
                    ? actions.map((inq, index) => (
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
          {assignActor && (
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
                  rules: [{ required: true, message: "من فضلك ادخل الإسم" }],
                  initialValue: filterGroupsArrayForEdit(
                    props?.rowdata?.group_creator
                  ),
                })(
                  <Select
                    virtual={false}
                    showSearch
                    allowClear
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
          )}
          {showhiddenfields && (
            <div>
              <Col span={24} className="px-2">
                <Form.Item
                  rules={[
                    {
                      message: "من فضلك اختر حفظ البيانات",
                      required: true,
                    },
                  ]}
                  name="savedData"
                  hasFeedback
                  label=" حفظ البيانات "
                >
                  {getFieldDecorator("savedData", {
                    initialValue: props?.rowdata?.saved_data,
                  })(
                    <Select
                      showSearch
                      allowClear
                      // value={selectedJobs}
                      mode="multiple"
                      onChange={handleSaveData}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placeholder="اختر حفظ البيانات "
                    >
                      <Select.Option
                        className="selectgroup"
                        value="selectAll"
                        key="selectAll"
                      >
                        اختيار الكل
                      </Select.Option>
                      <Select.Option
                        className="selectgroup"
                        value="deleteAll"
                        key="deleteAll"
                      >
                        حذف الكل
                      </Select.Option>
                      <Select.Option
                        label="معاملة مرتبطة"
                        value="update_contract_submission_data"
                      >
                        معاملة مرتبطة
                      </Select.Option>
                      <Select.Option
                        label="بيانات صكوك "
                        value="submitSuggestionsParcels"
                      >
                        بيانات صكوك{" "}
                      </Select.Option>
                      <Select.Option label="بيانات مالك " value="owner_data">
                        بيانات مالك{" "}
                      </Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={24} className="px-2">
                <Form.Item
                  rules={[
                    {
                      message: "من فضلك اختر تحقيق البيانات",
                      required: true,
                    },
                  ]}
                  name="checkData"
                  hasFeedback
                  label="تحقيق البيانات"
                >
                  {getFieldDecorator("checkData", {
                    initialValue: props?.rowdata?.validate_data,
                  })(
                    <Select
                      showSearch
                      allowClear
                      // value={selectedJobs}
                      mode="multiple"
                      onChange={handleCheckData}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placeholder=" تحقيق البيانات "
                    >
                      <Select.Option
                        className="selectgroup"
                        value="selectAll"
                        key="selectAll"
                      >
                        اختيار الكل
                      </Select.Option>
                      <Select.Option
                        className="selectgroup"
                        value="deleteAll"
                        key="deleteAll"
                      >
                        حذف الكل
                      </Select.Option>
                      <Select.Option label="رقم صادر " value="export_no">
                        رقم الصادر
                      </Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </div>
          )}
          <Col span={24} className="px-2">
            <Form.Item
              rules={[
                {
                  message: "من فضلك اختر قوالب الطباعة",
                  required: true,
                },
              ]}
              name="print_data"
              hasFeedback
              label=" قوالب الطباعة"
            >
              {getFieldDecorator("printData", {
                initialValue: props?.rowdata?.print_data,
              })(
                <Select
                  showSearch
                  allowClear
                  // value={selectedJobs}
                  mode="multiple"
                  onChange={handlePrintData}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  placeholder=" قوالب الطباعة "
                >
                  <Select.Option
                    className="selectgroup"
                    value="selectAll"
                    key="selectAll"
                  >
                    اختيار الكل
                  </Select.Option>
                  <Select.Option
                    className="selectgroup"
                    value="deleteAll"
                    key="deleteAll"
                  >
                    حذف الكل
                  </Select.Option>
                  <Select.Option label="قرار لجنه " value="karar_lagna_print">
                    تيمب قرار لجنه
                  </Select.Option>
                  <Select.Option label="تيمب a0 " value="temp_a0">
                    تيمب A0
                  </Select.Option>
                  <Select.Option label="فرز دوبلكسات " value="farz_duplix">
                    تيمب فرز دوبلكسات
                  </Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col span={24} className="px-2">
            <Form.Item>
              {getFieldDecorator("choices_after", {
                rules: [
                  // { required: true, message: " من فضلك ادخل اسم الملف" },
                ],
                initialValue: [
                  props?.rowdata?.is_edit != null && "is_edit",
                  props?.rowdata?.is_optional != null && "is_optional",
                  props?.rowdata?.can_warn != null && "can_warn",
                  props?.rowdata?.is_deactivatied != null && "is_deactivatied",
                  props?.rowdata?.scalation != null && "scalation",
                  props?.rowdata?.is_fees != null && "is_fees",
                  props?.rowdata?.is_municipality != null && "is_municipality",
                  props?.rowdata?.is_end != null && "is_end",
                  props?.rowdata?.is_eng_office != null && "is_eng_office",
                  props?.rowdata?.generate_fees != null && "generate_fees",
                  props?.rowdata?.show_step_in_list != null &&
                    "show_step_in_list",
                  props?.rowdata?.generate_export_no != null &&
                    "generate_export_no",
                ],
              })(
                <Checkbox.Group
                  name="choices_after"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  }}
                  // style={{ width: "100%" }}
                  onChange={onChangeCheckbox_after}
                >
                  <Checkbox value={"is_edit"}>امكانية التعليق</Checkbox>
                  <Checkbox value={"is_optional"}> خطوه اختياريه</Checkbox>
                  <Checkbox value={"can_warn"}>امكانيه التحذير </Checkbox>
                  <Checkbox value={"is_deactivatied"}>خطوة غير مفعلة </Checkbox>
                  <Checkbox value={"scalation"}>لها مده زمنيه </Checkbox>
                  <Checkbox value={"is_fees"}> الزامية دفع الرسوم </Checkbox>
                  <Checkbox value={"is_municipality"}>
                    خطوة تابعه للبلديات{" "}
                  </Checkbox>
                  <Checkbox value={"is_end"}>خطوة نهاية المسار </Checkbox>
                  <Checkbox value={"is_eng_office"}>خطوة مكتب هندسى </Checkbox>
                  <Checkbox value={"generate_fees"}>خطوه حساب الرسوم </Checkbox>
                  <Checkbox value={"generate_export_no"}>
                    اصدار رقم صادر{" "}
                  </Checkbox>
                  <Checkbox value={"show_step_in_list"}>
                    اظهار الخطوه فى القوائم{" "}
                  </Checkbox>
                </Checkbox.Group>
              )}
            </Form.Item>
          </Col>
          {scalation && (
            <div>
              <Col span={24} className="px-2">
                <Form.Item
                  name="scalation_hours"
                  hasFeedback
                  label="المده الزمنية (ساعة) "
                >
                  {getFieldDecorator("scalation_hours", {
                    rules: [{ required: true, message: "من فضلك ادخل المده " }],
                    initialValue: props.rowdata?.scalation_hours,
                    maxLength: 15,
                  })(
                    <InputNumber
                      name="scalation_hours"
                      min={1}
                      onChange={handleScalationHoursChange}
                      value={scalation_hours}
                      placeholder="المدة الزمنية "
                    />
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
                  name="scalator_position_id"
                  hasFeedback
                  label="ممثل الخطوة (المسمى الوظيفى)"
                >
                  {getFieldDecorator("scalator_position_id", {
                    rules: [{ required: true, message: "من فضلك ادخل المسمى" }],
                    initialValue: filterPositionIdArray(
                      props?.rowdata?.scalator_positon_id
                    ),
                  })(
                    <Select
                      virtual={false}
                      showSearch
                      allowClear
                      onChange={handleScalationPosition}
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
              <Col span={24} className="px-2">
                <Form.Item
                  rules={[
                    {
                      message: "من فضلك اختر المجموعات",
                      required: true,
                    },
                  ]}
                  name="scalator_group_id"
                  hasFeedback
                  label="ممثل الخطوة (المجموعة)"
                >
                  {getFieldDecorator("scalator_group_id", {
                    rules: [{ required: true, message: "من فضلك ادخل الإسم" }],
                    initialValue: filterGroupsArrayForEdit(
                      props?.rowdata?.scalator_group_id
                    ),
                  })(
                    <Select
                      virtual={false}
                      showSearch
                      allowClear
                      onChange={handleScalationGroup}
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
            </div>
          )}
        </Row>
        <Row style={{ display: "flex", justifyContent: "flex-end" }}>
          <Form.Item>
            <Button className="addbtn" onClick={addEditStep}>
              نعم
            </Button>
          </Form.Item>
          <Form.Item>
            <Button className="cancelbtn" onClick={props.visible}>
              لا
            </Button>
          </Form.Item>
        </Row>
      </form>
    </Container>
  );
}
export default Form.create()(withTranslation("admin")(AddEditStep));
