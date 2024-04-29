import React, { useState, useEffect, StrictMode } from "react";
import { postItem } from "app/helpers/apiMethods";
import { convertToArabic } from "../../components/inputs/fields/identify/Component/common/common_func";
import { useForm } from "react-hook-form";
export default function EditPrint({ oldText, printObj, id, path }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [text, setText] = useState(oldText);
  const [edit, setEdit] = useState(false);
  const url = "/Submission/SavePrint";

  const params = { sub_id: id };
  const onSubmit = (data) => {
    let newPrintObj = printObj;
    // if (newPrintObj) {
    // }

    // delete newPrintObj;

    let pathParent = path.split(".")[0];
    let pathChild = path.split(".")[1];

    if (
      !newPrintObj.printTextEdited ||
      !newPrintObj.printTextEdited[pathParent]
    ) {
      newPrintObj.printTextEdited = {};
      newPrintObj.printTextEdited[pathParent] = {};
      newPrintObj.printTextEdited[pathParent][pathChild] = {};
    }
    // newMainObject.printTextEdited
    newPrintObj.printTextEdited[pathParent][pathChild] = data.newText;
    return postItem(
      url,
      { newPrintObj: { printTextEdited: newPrintObj.printTextEdited } },
      { params }
    ).then(() => {
      setText(data.newText);
      setEdit(false);
    });
  };
  function checkText(text) {
    let convertedText = convertToArabic(text);
    if (convertedText && convertedText.includes("-")) {
      return convertedText
        .split("$")
        .filter((d) => d)
        .map((text, k) => {
          return <div key={k}>{"" + text}</div>;
        });
    } else {
      return convertedText;
    }
  }

  useEffect(() => {
    setText(oldText);
    // checkText();
  }, [oldText]);

  function openEdit() {
    setEdit(true);
  }
  // console.log(text);
  return (
    <div style={{ display: "inline-block" }}>
      {!edit && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3>
            {checkText(text)}
            {/* {text.includes("-")
              ? text.split("-").map((x, k) => {
                  return <div key={k}>-{x}</div>;
                })
              : text} */}
          </h3>
          <button className="btn btn-success printBtn" onClick={openEdit}>
            <span>
              <i className="fas fa-edit"></i>
            </span>
          </button>
        </div>
      )}
      {edit && (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex" }}>
          {/* register your input into the hook by invoking the "register" function */}
          <textarea
            rows="4"
            cols="150"
            className="form-control"
            defaultValue={oldText}
            {...register("newText")}
          />

          {/* include validation with required or other standard HTML validation rules */}
          {/* <input {...register("exampleRequired", { required: true })} /> */}
          {/* errors will return when field validation fails  */}
          {/* {errors.exampleRequired && <span>This field is required</span>} */}

          <button type="submit" className="btn">
            <span>
              <i className="fas fa-save" style={{ fontSize: "2rem" }}></i>{" "}
            </span>
          </button>
          <button
            onClick={() => {
              setEdit(false);
            }}
            className="btn"
          >
            الغاء
          </button>
        </form>
      )}
    </div>
  );
}
