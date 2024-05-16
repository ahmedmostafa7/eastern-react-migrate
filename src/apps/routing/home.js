import { Header } from "app/components/portal/header";
import Footerr from "app/components/portal/header/Footerr";
import React from "react";
import { Outlet } from "react-router-dom";

export default function home() {
  // console.log("ff", props);
  return (
    <div>
      <Header />
      <Outlet />
      <Footerr />
    </div>
  );
}
// render={(props) => <Dashboard {...props} authed={true} />}
