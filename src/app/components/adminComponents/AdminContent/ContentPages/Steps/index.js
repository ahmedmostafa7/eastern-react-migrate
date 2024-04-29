import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddEditModal from "./addeditmodal";
import { Modal, message } from "antd";
import Box from "./box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, withRouter, NavLink } from "react-router-dom";
import { faTimes, faWrench, faPlus } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import axios from "axios";
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const DragDrop = () => {
  const [WORKFLOWID, setWorkFlowID] = useState(0);
  let [actions, setActions] = useState([]);
  let [positions, setPositions] = useState([]);
  let [groups, setGroups] = useState([]);
  let [appId, setAppId] = useState("");
  const sendArrange = () => {
    let arragedSteps = project.map((d, i) => ({ ...d, index: i + 1 }));
    axios
      .put(window.host + "/steps/updatewfsteps", arragedSteps, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((res) => {
        setProject(res.data);
        message.success("تم ترتيب الخطوات بنجاح");
      });
  };
  useEffect(() => {
    let recordId = localStorage.getItem("workflowId");
    let actionRequest = axios.get(`${window.host}/api/actions`);
    let groupsReq = axios.get(
      `${window.host}/api/groups?page=0&pageSize=100000`
    );
    let postionsReq = axios.get(`${window.host}/api/position`);
    let workflowReq = axios.get(
      window.host +
        `/api/workflow/GetAll?filter_key=id&q=${recordId}&pageSize=50`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
    );
    axios
      .all([workflowReq, actionRequest, groupsReq, postionsReq])
      .then(
        axios.spread((workflReq, actionReq, grReq, posReq) => {
          {
            let workflow = workflReq?.data?.results;
            let arabic_actions_name = actionReq.data.results.map((d) => ({
              ...d,
              name: translate_step_actions[d.name],
            }));
            setActions(arabic_actions_name);
            setPositions(posReq.data.results);
            setGroups(grReq.data.results);
            // setActionModalVisible(true);
            setName(workflow[0].name);
            let workflowID = workflow[0].id;
            setWorkFlowID(workflowID);
            setAppId(workflow[0]?.app_id);
            console.log("w", workflowID);
            let steps = workflow
              .filter((d) => d.id == recordId)
              .map((x) => x.steps);
            // let arrWorkflow = [...workflow];
            setProject(
              ...steps.map((x) => x.sort((a, b) => a.index - b.index))
            );
          }
        })
      )
      .catch((err) => {
        message.error("حدث خطأ");
      });
  }, []);
  const [project, setProject] = useState([]);
  const [name, setName] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;
    const projects = reorder(
      project,
      result.source.index,
      result.destination.index
    );
    //store reordered state.
    setProject(projects);
    console.log(project);
  };
  return (
    <div
      style={{
        border: "1px solid #242424",
        height: "80vh",
        overflow: "auto",
      }}
    >
      <h2 style={{ textAlign: "center", padding: "10px", margin: "10px" }}>
        {name}:{project && project.length > 0 ? project.length : 0}
      </h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          padding: "10px",
          gridGap: "10px",
        }}
      >
        <button
          className="follow  btn btn-primary"
          onClick={() => {
            setEditModalVisible(true);
          }}
        >
          {/* <FontAwesomeIcon icon={faPlus} label={"اضافة"} /> */}
          اضافة
        </button>
        <h4 onClick={sendArrange}>
          <button className="btn btn-info">ترتيب الخطوات</button>
        </h4>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                // border: "1px solid #242424",
                // opacity: 0.5,
                // borderRadius: "5px",
                display: "grid",
                gridTemplateColumns: " 1fr 1fr 1fr 1fr",
              }}
            >
              {project?.length > 0 &&
                project.map((item, index) => (
                  <Draggable
                    draggableId={item.id.toString()}
                    key={item.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Box
                          name={item.name}
                          item={item}
                          steps={project}
                          length={project?.length}
                          workflowId={WORKFLOWID}
                          actions={actions}
                          groups={groups}
                          positions={positions}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal
        title="اضافة خطوة"
        width="63vw"
        visible={editModalVisible}
        footer={null}
        closable={false}
        onCancel={() => {
          setEditModalVisible(false);
        }}
      >
        <AddEditModal
          length={
            // project && project?.length > 0 ? project?.length : 0
            project?.length ?? 0
          }
          // item={item}
          workflowId={WORKFLOWID}
          appId={appId}
          visible={() => {
            setEditModalVisible(false);
          }}
          steps={project}
        />
      </Modal>
    </div>
  );
};
export default DragDrop;
