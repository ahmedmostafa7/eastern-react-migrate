import Login from "./index";
import style from "./style.less";
import React, { Component } from "react";
import { withRouter } from "apps/routing/withRouter";
import { fromPairs } from "lodash";
import { mapStateToProps } from "./mapping";
import { connect } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { get, isEmpty } from "lodash";

function LoginForm({ user }) {
  const location = useLocation();
  const params = fromPairs(
    location?.search
      .toLowerCase()
      .substring(1)
      .split("&")
      .map((d) => d.split("="))
  );

  let currentUser = null;
  if (user && get(user, "groups")) {
    let found = user.groups
      .map((group) => group.groups_permissions)
      .filter((v) => v);
    currentUser = !isEmpty(found) ? user : null;
  }

  return user ? (
    !currentUser ? (
      <h1 style={{ margin: 32 }}> لا يوجد صلاحيات </h1>
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <Login className={style.login} {...params} />
  );
}
export default withRouter(connect(mapStateToProps)(LoginForm));
