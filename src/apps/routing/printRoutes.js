import React from "react";
import Temp1 from "app/components/wizard/modulesObjects/newPro/templates/karar_amin";
import Temp2 from "app/components/wizard/modulesObjects/newPro/templates/ma7dar_3adl";
import Temp3 from "app/components/wizard/modulesObjects/newPro/templates/lagna_takdeer";
import ServiceCondition from "app/components/wizard/modulesObjects/service/print/conditions";
import ServiceKroky from "app/components/wizard/modulesObjects/service/print/kroky";
import Temp4 from "app/components/wizard/modulesObjects/newPro/templates/lagna_faneh";
import Temp5 from "app/components/wizard/modulesObjects/newPro/templates/kroky_parcel";
import Temp6 from "app/components/wizard/modulesObjects/newPro/templates/buy_zayda";
import Addedparcels_requestsReport from "app/components/wizard/modulesObjects/newPro/templates/requestsReport_print";
import KararLagnaPrint from "app/components/wizard/modulesObjects/plan_approval/print/karar_lagna_print";
import Tawze3 from "app/components/wizard/modulesObjects/plan_approval/print/tawze3";
import Primary_approval_print from "app/components/wizard/modulesObjects/plan_approval/print/primary_approval_print";
import takrer_supervision_print from "app/components/wizard/modulesObjects/plan_approval/print/takrer_supervision_print";
import Takreer_primary_approval_print from "app/components/wizard/modulesObjects/plan_approval/print/takreer_primary_approval_print";
import TempA0 from "app/components/wizard/modulesObjects/plan_approval/print/tempA0";
import Gov_TempA0 from "app/components/wizard/modulesObjects/plan_approval/print/tempA0_gov";
import printDuplixs from "app/components/wizard/modulesObjects/split_merge/print/print_duplixs";
import printApartments from "app/components/wizard/modulesObjects/split_merge/print/print_appartments";
import printParcels from "app/components/wizard/modulesObjects/split_merge/print/print_parcels";
import GlobalPrintRoute from "app/components/editPrint/global_print_route";
import { Routes, Route } from "react-router-dom";
import PropertyRemovalPrintRoute from "app/components/wizard/modulesObjects/property_removal/PropertyRemovalPrintRoute";
import lagnaA4 from "app/components/wizard/modulesObjects/mergestreets/print/lagnaA4";
import addstreets from "app/components/wizard/modulesObjects/mergestreets/print/mergeA2";
import AkarPrint from "app/components/wizard/modulesObjects/akar/print";
import landsallotment_print from "app/components/wizard/modulesObjects/lands_allotment/print/landsallotment_print";
import landsallotment_beneficiary_print from "app/components/wizard/modulesObjects/lands_allotment/print/landsallotment_beneficiary_print";
import landsallotment_adle from "app/components/wizard/modulesObjects/lands_allotment/print/landsallotment_adle";
import PrintDescriptionCardComponent from "../../app/components/wizard/modulesObjects/investment_sites/printDescriptionCardComponent";
import investmentsites_lagnh_print from "../../app/components/wizard/modulesObjects/investment_sites/print/investmentsites_lagnh_print";
import sakPropertycheck_letter from "app/components/wizard/modulesObjects/property_check/print/sakPropertycheck_letter";
import sakPropertycheck_letter_return from "app/components/wizard/modulesObjects/property_check/print/sakPropertycheck_letter_return";
import adle_report_letter from "app/components/wizard/modulesObjects/plan_approval/print/adle_report_letter";
import ministry_report_letter from "app/components/wizard/modulesObjects/plan_approval/print/ministry_report_letter";
import PrintReportMa7dar from "app/components/print_report/print_report_ma7dar";
import PrintReport2 from "app/components/print_report/print_report_two";
import Test from "app/components/editPrint/test";
import Ma7dar from "app/components/print_ma7dar";
import PrintChart from "app/components/print";
import PrintBox from "app/components/print_box";
import PrintReport from "app/components/print_report";
export default function printRoutes() {
  return (
    <div>
      <Routes>
        <Route
          path="/print_description_card/:id"
          element={<PrintDescriptionCardComponent />}
        />
        <Route
          path="/investmentsites_lagnh_print/:id"
          element={<investmentsites_lagnh_print />}
        />
        <Route path="/print_chart" element={<PrintChart />} />
        <Route path="/print_box" element={<PrintBox />} />
        <Route path="/print_report" element={<PrintReport />} />
        <Route path="/addedparcel_temp1/:id" element={<Temp1 />} />
        <Route path="/addedparcel_temp2/:id" element={<Temp2 />} />
        <Route path="/addedparcel_temp3/:id" element={<Temp3 />} />
        <Route path="/addedparcel_temp4/:id" element={<Temp4 />} />
        <Route path="/addedparcel_temp5/:id" element={<Temp5 />} />
        <Route path="/addedparcel_temp6/:id" element={<Temp6 />} />
        <Route
          path="/addedparcels_requestsReport"
          element={<Addedparcels_requestsReport />}
        />
        <Route path="/test_print" element={<Test />} />
        <Route
          path="/plan_approval/a0_plan_approval/:id"
          element={<TempA0 />}
        />
        <Route
          path="/plan_approval/a0_gov_plan_approval/:id"
          element={<Gov_TempA0 />}
        />
        <Route
          path="/split_merge/print_duplixs/:id"
          element={<printDuplixs />}
        />
        <Route
          path="/survey_report/print_survay/:id"
          element={<GlobalPrintRoute />}
        />
        <Route
          path="/contract_update/print_sak/:id"
          element={<GlobalPrintRoute />}
        />
        <Route path="/lagnaA4/:id" element={<lagnaA4 />} />
        <Route path="/addstreets/addstreets/:id" element={<addstreets />} />
        <Route path="/parcels_invoice/:id" element={<GlobalPrintRoute />} />
        <Route
          path="/pri_price_lagna_takdeer/:id"
          element={<PropertyRemovalPrintRoute />}
        />
        <Route
          path="/init_procedure_print/:id"
          element={<PropertyRemovalPrintRoute />}
        />
        <Route
          path="/a3_property_removal/:id"
          element={<PropertyRemovalPrintRoute />}
        />
        <Route
          path="/building_limitation_report/:id"
          element={<PropertyRemovalPrintRoute />}
        />
        <Route
          path="/descripe_limitation_building_report/:id"
          element={<PropertyRemovalPrintRoute />}
        />
        <Route
          path="/final_price_lagna_takdeer/:id"
          element={<PropertyRemovalPrintRoute />}
        />
        <Route
          path="/approve_paying_report/:id"
          element={<PropertyRemovalPrintRoute />}
        />
        <Route
          path="/split_merge/print_appartments/:id"
          element={<printApartments />}
        />
        <Route
          path="/split_merge/print_parcel/:id"
          element={<printParcels />}
        />
        {/* <Route
                 path="/plan_approval/a2_plan_approval/:id"
                element={<TempA2}
               /> */}
        <Route path="/tawze3/:id" element={<Tawze3 />} />
        <Route
          path="/primary_approval_print/:id"
          element={<Primary_approval_print />}
        />
        <Route
          path="/takrer_supervision_print/:id"
          element={<takrer_supervision_print />}
        />
        <Route
          path="/takrer_primary_approval/:id"
          element={<Takreer_primary_approval_print />}
        />
        <Route
          path="/adle_report_letter/:id"
          element={<adle_report_letter />}
        />
        <Route
          path="/ministry_report_letter/:id"
          element={<ministry_report_letter />}
        />
        <Route
          path="/landsallotment_print/:id"
          element={<landsallotment_print />}
        />
        <Route
          path="/landsallotment_beneficiary_print/:id"
          element={<landsallotment_beneficiary_print />}
        />
        <Route
          path="/landsallotment_adle/:id"
          element={<landsallotment_adle />}
        />
        <Route
          path="/sakPropertycheck_letter/:id"
          element={<sakPropertycheck_letter />}
        />
        <Route
          path="/sakPropertycheck_letter_return/:id"
          element={<sakPropertycheck_letter_return />}
        />
        <Route path="/karar_lagna_print/:id" element={<KararLagnaPrint />} />
        <Route path="/akar_print/:id" element={<AkarPrint />} />
        <Route path="/print_report_ma7dar" element={<PrintReportMa7dar />} />
        <Route path="/print_technical/:id" element={<Ma7dar />} />
        <Route path="/print_report_ma7dar" element={<PrintReportMa7dar />} />
        <Route path="/service_condition/:id" element={<ServiceCondition />} />
        <Route path="/service_kroky/:id" element={<ServiceKroky />} />
        <Route path="/print_lic/:id" element={<PrintReport2 />} />
      </Routes>
    </div>
  );
}
