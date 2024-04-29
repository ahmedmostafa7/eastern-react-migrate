import React, { useEffect, useState, Suspense } from "react";
import PrintDataProvider from "./Print_data_Provider";
import { useDispatch } from "react-redux";
import PriPriceLagnaTakdeer from './prints/pri_price_lagna_takdeer'
import InitProcedurePrint from './prints/init_procedure_print'
import a3PropertyRemoval from './prints/a3_property_removal'
import BuildingLimitation from './prints/building_limitation_report'
import DescripeLimitationBuilding from './prints/descripe_limitation_building_report'
import FinalPriceLagnaTakdeer from './prints/final_price_lagna_takdeer'
import ApprovePaying from './prints/approve_paying_report'
const GlobalRoute = (props) => {
    let [DynamicComp, setDynamicComp] = useState(null);
    let [name, setName] = useState("survey_html");
    let id = props.match.params.id;
    let appName = props?.match?.url.split("/")[1];
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
            {appName == "pri_price_lagna_takdeer" && <PriPriceLagnaTakdeer />}
            {appName == "init_procedure_print" && <InitProcedurePrint />}
            {appName == "a3_property_removal" && <a3PropertyRemoval />} 
            {appName == "building_limitation_report" && <BuildingLimitation />} 
            {appName == "descripe_limitation_building_report" && <DescripeLimitationBuilding />} 
            {appName == "final_price_lagna_takdeer" && <FinalPriceLagnaTakdeer />} 
            {appName == "approve_paying_report" && <ApprovePaying />} 
        </PrintDataProvider>
    );
};
export default GlobalRoute;
