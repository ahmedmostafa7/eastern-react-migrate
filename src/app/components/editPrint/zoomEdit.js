import React, { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Slider } from "antd";

import { postItem } from "app/helpers/apiMethods";
export default function EditPrint({
  children,
  printObj,
  id,
  path,
  ZoomRatio,
  className,
}) {
  // console.log( mainObject);
  const [zoom, setZoom] = useState(0);

  const dispatch = useDispatch();
  // console.log(dispatch);
  // const DynamicValue = useSelector((state) => state.mainApp.sliderValue);
  // console.log(DynamicValue);
  const setDefaultValueForSlider = (zoom) => {
    return {
      type: "setMainApp",
      path: "sliderValue",
      data: zoom,
    };
  };
  function onChange(value) {
    let zoom = value;
    setZoom(zoom);
    saveZoom(zoom);
    // dispatch(setDefaultValueForSlider(zoom));

    console.log("onChange: ", value);
  }
  useEffect(() => {
    setZoom(ZoomRatio);
    // checkText();
  }, []);
  function saveZoom(zoom) {
    const url = "/Submission/SavePrint";
    const params = { sub_id: id };
    if (printObj) {
      let newPrintObj = printObj;
      let pathParent = path.split(".")[0];
      let pathChild = path.split(".")[1];
      if (
        !newPrintObj?.printTextEdited ||
        !newPrintObj?.printTextEdited[pathParent]
      ) {
        newPrintObj.printTextEdited = {};
        newPrintObj.printTextEdited[pathParent] = {};
        newPrintObj.printTextEdited[pathParent][pathChild] = {};
      }
      // newMainObject.printTextEdited
      newPrintObj.printTextEdited[pathParent][pathChild] = zoom;
      return postItem(url, { newPrintObj: newPrintObj }, { params }).then(
        () => {
          setZoom(zoom);
        }
      );
    }
  }
  function onAfterChange(value) {
    console.log("onAfterChange: ", value);
    let zoom = value;

    setZoom(zoom);
  }
  console.log("zoom", zoom);
  return (
    <div style={{ zoom: zoom }} className={className}>
      <div
        className="printBtn"
        style={{
          // display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          margin: "5px",
        }}
      >
        {/* <button className="btn btn-primary" onClick={saveZoom}>
          حفظ
        </button> */}
        <Slider
          range={false}
          step={0.01}
          dots={true}
          max={1}
          // marks={{ number: [1, 2] }}
          min={0.7}
          reverse={true}
          tooltip={{
            open: true,
            placement: "top",
            defaultOpen: true,
          }}
          value={zoom}
          onChange={onChange}
          onAfterChange={onAfterChange}
        />
      </div>
      {children}
    </div>
  );
}
