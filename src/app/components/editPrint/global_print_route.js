import React, { useEffect, useState, Suspense } from "react";
import SurveyHtml from "../../components/wizard/modulesObjects/survey_report/print/survey_html";
import ContractUpdate from "../../components/wizard/modulesObjects/contract_update/print/";
import PrintDataProvider from "./Print_data_Provider";
import ParcelInvoice from "../print/parcel_invoice.js";
// components\wizard\modulesObjects\survey_report\print\survey_html
import { useDispatch } from "react-redux";
// import LagnaA4 from "../wizard/modulesObjects/mergestreets/print/lagnaA4";
// import MergeA2 from "../wizard/modulesObjects/mergestreets/print/mergeA2";
const GlobalRoute = (props) => {
  let [DynamicComp, setDynamicComp] = useState(null);
  let [name, setName] = useState("survey_html");
  let id = props.params.id;
  let appName = props?.url.split("/")[1];
  console.log("appName", appName);
  const SetPrintId = (id) => {
    return {
      type: "setMainApp",
      path: "print_id",
      data: id,
    };
  };
  const SetPrintName = (name) => {
    return {
      type: "setMainApp",
      path: "print_name",
      data: name,
    };
  };
  callDispatch(id);

  function callDispatch(id) {
    const dispatch = useDispatch();
    useEffect(() => {
      dispatch(SetPrintId(id));
      dispatch(SetPrintName(appName));
      // const Comp = React.lazy(async () => (await import("./survey_html")).HTML);

      // return setDynamicComp(Comp);
      // console.log("comp", Comp);
    }, []);
  }

  return (
    <PrintDataProvider>
      {appName == "survey_report" && <SurveyHtml />}
      {appName == "contract_update" && <ContractUpdate />}
      {appName == "parcels_invoice" && <ParcelInvoice />}
    </PrintDataProvider>
  );
};
export default GlobalRoute;
