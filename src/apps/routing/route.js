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
import Home from "./home";
import UserApps from "app/components/userApps";
// import Admin from "app/components/admin";
import LoginForm from "app/components/Login/LoginForm";
import WizardWorkFlow from "app/components/wizard";
import Popups from "imports/popups";
//import AdminWorkFlow from '../admin/workFlow/workFlow'
// import AdminWorkFlow from "app/components/admin/components/workFlow";
// import { workFlowUrl } from "imports/config";
import WorkflowSteps from "../../app/components/adminComponents/AdminContent/ContentPages/WorkflowSteps";
import { connect } from "react-redux";
import { mapDispatchToProps } from "./mapping";
import Profile from "app/components/portal/header/profile";
import PrintRoutes from "./printRoutes";

import { get } from "lodash";

import { postItem } from "app/helpers/apiMethods";
import qs from "qs";
import IdentifyExportCad from "../../app/components/inputs/fields/identify/Component/exportCad";
import WizardById from "app/components/routeTier";
import axios from "axios";
import AdminMainPage from "../../app/components/adminComponents/AdminMainPage";
import NotFoundPage from "./errorFile";
import { workFlowUrl } from "imports/config";

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
      <Route path="/" element={<Home />}>
        <Route index path="/submissions/:app?" element={<Tabs />} />
        <Route path="/wizardById/:id" element={<WizardById />} />
        <Route path="/exportCad/:id" element={<IdentifyExportCad />} />
        <Route path="/apps" element={<UserApps />} />
        <Route path="/wizard" element={<WizardWorkFlow />} />
        <Route path="/steps" element={<WorkflowSteps />} />
        <Route path="*" element={<NotFoundPage />} />
        {/* <Route path="/prints/*" element={<PrintRoutes />} /> */}
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
