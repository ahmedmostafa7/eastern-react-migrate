import Login from "./index";
import style from "./style.less";
import React, { Component } from "react";
import { withRouter } from "apps/routing/withRouter";
import { fromPairs } from "lodash";
import { mapStateToProps } from "./mapping";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { get, isEmpty } from "lodash";

class LoginForm extends Component {
  render() {
    const {
      history: {
        location: { search },
      },
      user,
    } = this.props;
    const params = fromPairs(
      search
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
}

export default withRouter(connect(mapStateToProps)(LoginForm));
