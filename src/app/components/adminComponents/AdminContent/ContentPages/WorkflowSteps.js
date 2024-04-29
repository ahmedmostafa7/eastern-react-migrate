import React, { useState, useEffect } from "react";
// import Draggable from "react-draggable";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import DragDrop from "./Steps";
import axios from "axios";
function WorkFLowSteps(props) {
  // const [steps, setSteps] = useState([]);
  const [name, setName] = useState(props?.location?.state?.name);
  const [reqStep, setRecStep] = useState([]);

  console.log(reqStep);
  return (
    <div>
      <DragDrop />;
    </div>
  );
}

export default WorkFLowSteps;
