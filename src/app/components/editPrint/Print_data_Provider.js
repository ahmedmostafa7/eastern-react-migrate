import React, { useState, useEffect, createContext } from "react";
import { get_print_data_by_id } from "app/components/inputs/fields/identify/Component/common/common_func";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getValuesFromMainObj } from "./globalPrintVals";
// import { useTranslation } from "react-i18next";
import { withTranslation } from "react-i18next";
export const PrintContext = createContext();
// const { t, i18n } = useTranslation("arabic");

const PrintDataProvider = (props) => {
  console.log(props);
  let [PureData, setPureData] = useState([]);
  const DynamicPrintId =
    props?.submission?.id || useSelector((state) => state.mainApp.print_id);
  const DynamicPrintName = useSelector((state) => state.mainApp.print_name);
  useEffect(() => {
    DynamicPrintId &&
      initializeSubmissionData(DynamicPrintId).then((res) => {
        console.log("res", res);
        let mainObject = res.mainObject;
        let submissionData = res.submission;
        let printObj = res?.printObj;

        let values = getValuesFromMainObj(
          props,
          mainObject,
          submissionData,
          DynamicPrintId,
          DynamicPrintName,
          printObj
        );
        let newVals = [{ ...values[0] }];
        setPureData(newVals);
        console.log(newVals);
      });
  }, [DynamicPrintId]);

  return (
    <PrintContext.Provider value={{ ...PureData[0] }}>
      {props.children}
    </PrintContext.Provider>
  );
};
export default withTranslation("labels")(PrintDataProvider);
