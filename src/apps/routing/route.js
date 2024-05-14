import React, { Component, useEffect } from "react";
import {
  // HashRouter as Router,
  Route,
  useParams,
  Switch,
  Routes,
  useLocation,
  BrowserRouter,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  // Navigate,
} from "react-router-dom";
import ProtectedRoute from "./protectedRoute";
import AdminProtectedRoute from "./adminProtectedRoute";
import { Layout, message, Modal } from "antd";
import ThirdIdentifier from "../../app/components/inputs/fields/identify/Component/ThirdIdentifier";
import Tabs from "../modules/tabs";
// import "bootstrap/dist/css/bootstrap.min.css";
import Header from "app/components/portal/header";
import Footerr from "app/components/portal/header/Footerr";
import ContactUs from "app/components/contactUs";
import UserApps from "app/components/userApps";
// import Admin from "app/components/admin";
import LoginForm from "app/components/Login/LoginForm";
import WizardWorkFlow from "app/components/wizard";
import Popups from "imports/popups";
//import AdminWorkFlow from '../admin/workFlow/workFlow'
// import AdminWorkFlow from "app/components/admin/components/workFlow";
import WorkflowSteps from "../../app/components/adminComponents/AdminContent/ContentPages/WorkflowSteps";
import { connect } from "react-redux";
import Profile from "app/components/portal/header/profile";


import { mapDispatchToProps } from "./mapping";

import { get } from "lodash";

import { postItem } from "app/helpers/apiMethods";
import qs from "qs";
import IdentifyExportCad from "../../app/components/inputs/fields/identify/Component/exportCad";
import wizardById from "../../app/components/routeTier";
import axios from "axios";
import AdminMainPage from "../../app/components/adminComponents/AdminMainPage";
import NotFoundPage from "./errorFile";

// class Routing extends Component {
//   state = { superAdmin: null };
//   constructor(props) {
//     super(props);
//     const { addUser } = props;
//     // console.log(props);
//     const urlParams = get(window.location.href.split("?"), "1");
//     const params = qs.parse(urlParams, { ignoreQueryPrefix: true });
//     const Token = get(params, "tk");
//     if (Token) {
//       // get user from token
//       localStorage.setItem("token", Token);

//       const url = "http://77.30.168.84/GISAPIDEVV2" + "/authenticate";
//       let urlCheck =
//         "http://77.30.168.84/GISAPIDEVV2" + "/checkEngCompCirculars";
//       postItem(url)
//         .then((res) => {
//           addUser(res);
//           // this.setState({ superAdmin: res.is_super_admin });
//           let noTokenUser = Object.assign({}, res);
//           noTokenUser["token"] = null;
//           noTokenUser["esri_token"] = null;
//           noTokenUser["esriToken"] = null;
//           localStorage.setItem("user", JSON.stringify(noTokenUser));
//           localStorage.setItem("token", res.token);
//           localStorage.setItem("esri_token", res.esriToken);
//           axios.get(urlCheck).then((res) => {
//             if (res.data) {
//               Modal.error({
//                 title: "تنبيه",
//                 content:
//                   "عذرا، يرجي قراءة وإنهاء التعميمات المرسلة لديكم حتي يتثني لكم التعامل على التطبيق",
//               });
//               Modal.closable = false;
//               Modal.footer = null;
//               Modal.okText = "تم";
//               Modal.wrapClassName = "ss";
//               Modal.onOk = () => {};
//             }
//           });
//         })
//         .catch((err = {}) => {
//           console.log(err);
//           if (get(err.response, "status") == 403) {
//             message.error(err.response.data);
//           } else {
//             message.error("حدث خطأ");
//           }
//         });
//     } else {
//       const user = localStorage.getItem("user");
//       if (user) {
//         addUser(JSON.parse(user));
//         // this.setState({ superAdmin: JSON.parse(user).is_super_admin });
//       }
//     }
//   }

//   render() {
//     // let isSuperAdmin = JSON.parse(localStorage.getItem("user"));
//     return (
//       <Navigate>
//         <Routes>
//           <Route
//             path="/print_description_card/:id"
//             element={<PrintDescriptionCardComponent />}
//           />
//           <Route
//             path="/investmentsites_lagnh_print/:id"
//             element={<investmentsites_lagnh_print />}
//           />
//           <Route path="/print_chart" element={<PrintChart />} />
//           <Route path="/print_box" element={<PrintBox />} />
//           <Route path="/print_report" element={<PrintReport />} />
//           <Route path="/addedparcel_temp1/:id" element={<Temp1 />} />
//           <Route path="/addedparcel_temp2/:id" element={<Temp2 />} />
//           <Route path="/addedparcel_temp3/:id" element={<Temp3 />} />
//           <Route path="/addedparcel_temp4/:id" element={<Temp4 />} />
//           <Route path="/addedparcel_temp5/:id" element={<Temp5 />} />
//           <Route path="/addedparcel_temp6/:id" element={<Temp6 />} />
//           <Route
//             path="/addedparcels_requestsReport"
//             element={<Addedparcels_requestsReport />}
//           />
//           <Route path="/test_print" element={<Test />} />
//           <Route
//             path="/plan_approval/a0_plan_approval/:id"
//             element={<TempA0 />}
//           />
//           <Route
//             path="/plan_approval/a0_gov_plan_approval/:id"
//             element={<Gov_TempA0 />}
//           />
//           <Route
//             path="/split_merge/print_duplixs/:id"
//             element={<printDuplixs />}
//           />
//           <Route
//             path="/survey_report/print_survay/:id"
//             element={<GlobalPrintRoute />}
//           />
//           <Route
//             path="/contract_update/print_sak/:id"
//             element={<GlobalPrintRoute />}
//           />
//           <Route path="/lagnaA4/:id" element={<lagnaA4 />} />
//           <Route path="/addstreets/addstreets/:id" element={<addstreets />} />
//           <Route path="/parcels_invoice/:id" element={<GlobalPrintRoute />} />
//           <Route
//             path="/pri_price_lagna_takdeer/:id"
//             element={<PropertyRemovalPrintRoute />}
//           />
//           <Route
//             path="/init_procedure_print/:id"
//             element={<PropertyRemovalPrintRoute />}
//           />
//           <Route
//             path="/a3_property_removal/:id"
//             element={<PropertyRemovalPrintRoute />}
//           />
//           <Route
//             path="/building_limitation_report/:id"
//             element={<PropertyRemovalPrintRoute />}
//           />
//           <Route
//             path="/descripe_limitation_building_report/:id"
//             element={<PropertyRemovalPrintRoute />}
//           />
//           <Route
//             path="/final_price_lagna_takdeer/:id"
//             element={<PropertyRemovalPrintRoute />}
//           />
//           <Route
//             path="/approve_paying_report/:id"
//             element={<PropertyRemovalPrintRoute />}
//           />
//           <Route
//             path="/split_merge/print_appartments/:id"
//             element={<printApartments />}
//           />
//           <Route
//             path="/split_merge/print_parcel/:id"
//             element={<printParcels />}
//           />
//           {/* <Route
//                 path="/plan_approval/a2_plan_approval/:id"
//                element={<TempA2}
//               /> */}
//           <Route path="/tawze3/:id" element={<Tawze3 />} />
//           <Route
//             path="/primary_approval_print/:id"
//             element={<Primary_approval_print />}
//           />
//           <Route
//             path="/takrer_supervision_print/:id"
//             element={<takrer_supervision_print />}
//           />
//           <Route
//             path="/takrer_primary_approval/:id"
//             element={<Takreer_primary_approval_print />}
//           />
//           <Route
//             path="/adle_report_letter/:id"
//             element={<adle_report_letter />}
//           />
//           <Route
//             path="/ministry_report_letter/:id"
//             element={<ministry_report_letter />}
//           />
//           <Route
//             path="/landsallotment_print/:id"
//             element={<landsallotment_print />}
//           />
//           <Route
//             path="/landsallotment_beneficiary_print/:id"
//             element={<landsallotment_beneficiary_print />}
//           />
//           <Route
//             path="/landsallotment_adle/:id"
//             element={<landsallotment_adle />}
//           />
//           <Route
//             path="/sakPropertycheck_letter/:id"
//             element={<sakPropertycheck_letter />}
//           />
//           <Route
//             path="/sakPropertycheck_letter_return/:id"
//             element={<sakPropertycheck_letter_return />}
//           />
//           <Route path="/karar_lagna_print/:id" element={<KararLagnaPrint />} />
//           <Route path="/akar_print/:id" element={<AkarPrint />} />
//           <Route path="/print_report_ma7dar" element={<PrintReportMa7dar />} />
//           <Route path="/print_technical/:id" element={<Ma7dar />} />
//           <Route path="/print_report_ma7dar" element={<PrintReportMa7dar />} />
//           <Route path="/service_condition/:id" element={<ServiceCondition />} />
//           <Route path="/service_kroky/:id" element={<ServiceKroky />} />
//           <Route path="/print_lic/:id" element={<PrintReport2 />} />
//
//           <Route exact path="/" element={<LoginForm />} />
//           <Route path="/identify" element={<ThirdIdentifier />} />
//           <Route path="/contactus" element={<ContactUs />} />
//           <Route path="/exportCad/:id" element={<IdentifyExportCad />} />
//           {/* <ProtectedRoute path="/apps"element={<UserApps/>} />
//         <ProtectedRoute path="/steps"element={<WorkflowSteps/>} />
//
//           <Route exact path="/submissions/:app?" element={<Tabs />} />
//           {/* <Route exact path="/dynamicPrint"element={<DynamicPrint/>} /> */}
//           <Route path="/wizard" element={<WizardWorkFlow />} />
//           <Route path="/wizardById/:id" element={<wizardById />} />
//           {/* <Popups /> <Footerr /> */}
//         </Routes>
//       </Navigate>
//     );
//   }
// }

function Routing({ addUser }) {
  const { app } = useParams();

  console.log(app);
  useEffect(() => {
    const urlParams = get(window.location.href.split("?"), "1");
    const params = qs.parse(urlParams, { ignoreQueryPrefix: true });

    const Token = get(params, "tk");
    if (Token) {
      localStorage.setItem("token", Token);
      const url = workFlowUrl + "/authenticate";
      let urlCheck = workFlowUrl + "/checkEngCompCirculars";
      postItem(url)
        .then((res) => {
          addUser(res);
          // this.setState({ superAdmin: res.is_super_admin });
          let noTokenUser = Object.assign({}, res);
          noTokenUser["token"] = null;
          noTokenUser["esri_token"] = null;
          noTokenUser["esriToken"] = null;
          localStorage.setItem("user", JSON.stringify(noTokenUser));
          localStorage.setItem("token", res.token);
          localStorage.setItem("esri_token", res.esriToken);
          axios.get(urlCheck).then((res) => {
            if (res.data) {
              Modal.error({
                title: "تنبيه",
                content:
                  "عذرا، يرجي قراءة وإنهاء التعميمات المرسلة لديكم حتي يتثني لكم التعامل على التطبيق",
              });
              Modal.closable = false;
              Modal.footer = null;
              Modal.okText = "تم";
              Modal.wrapClassName = "ss";
              Modal.onOk = () => {};
            }
          });
        })
        .catch((err = {}) => {
          console.log(err);
          if (get(err.response, "status") == 403) {
            message.error(err.response.data);
          } else {
            message.error("حدث خطأ");
          }
        });
    } else {
      const user = localStorage.getItem("user");
      if (user) {
        addUser(JSON.parse(user));
        // this.setState({ superAdmin: JSON.parse(user).is_super_admin });
      }
    }
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Header />}>
        <Route index path="/submissions/:app?" element={<Tabs />} />
        <Route path="/wizardById/:id" element={<wizardById />} />
        <Route path="/exportCad/:id" element={<IdentifyExportCad />} />
        <Route path="/apps" element={<UserApps />} />
        <Route path="/wizard" element={<WizardWorkFlow />} />
        <Route path="/steps" element={<WorkflowSteps />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* {isSuperAdmin?.is_super_admin && (
//           <Route path="/admin"element={<AdminMainPage/>} />
//         )} */}
        {/* <ProtectedRoute path="/profile" element={<Profile />} />  */}
      </Route>
    )
  );

  return (
    <div>
      <RouterProvider router={router} />;
    </div>
  );
}
export default connect(null, mapDispatchToProps)(Routing);
