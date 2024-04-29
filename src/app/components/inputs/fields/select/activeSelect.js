import React, { Component, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postItem } from "app/helpers/apiMethods";
import SelectComponent from "./select";
import MultiSelectComponent from "./multiSelect";
export default function activeSelect({ isMulti, selectProps }) {
  // console.log( mainObject);

  return (
    <div>
      <div>
        {(isMulti && <MultiSelectComponent {...selectProps} />) || (
          <SelectComponent {...selectProps} />
        )}
      </div>
    </div>
  );
}
