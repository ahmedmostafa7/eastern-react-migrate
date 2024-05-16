import { render } from "react-dom";

import App from "./app";
import React, { useEffect } from "react";
import store from "./app/reducers";
import i18n from "./app/translate";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import interceptor from "./interceptors";
import "bootstrap/dist/css/bootstrap.min.css";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "antd";

// import "./assets/css/portal.css";
// import "./assets/css/main.css";
import "antd/dist/reset.css";
// import "./assets/css/font-awesome.css";
// import "./assets/css/esri.css";
// import "./assets/css/style.css";
// import "imports/configT";
// import "./imports/config-link";
import "imports/config";
// import "https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css";
// import "antd/dist/antd.css";
interceptor();
if (!localStorage.esri_token && localStorage.user) {
  window.esriToken = JSON.parse(localStorage.getItem("user")).esriToken;
} else {
  window.esriToken = localStorage.esri_token;
}

const root = createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ConfigProvider theme={{ hashed: false }}>
          <App />
        </ConfigProvider>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
);
reportWebVitals();
