import { render } from "react-dom";

import App from "./app";
import React from "react";
import store from "./app/reducers";
import i18n from "./app/translate";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import interceptor from "./interceptors";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/reset.css";
import reportWebVitals from "./reportWebVitals";
// import "@ant-design/compatible/assets/index.css";
interceptor();
if (!localStorage.esri_token && localStorage.user) {
  window.esriToken = JSON.parse(localStorage.getItem("user")).esriToken;
} else {
  window.esriToken = localStorage.esri_token;
}
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <>
          <App />
        </>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
