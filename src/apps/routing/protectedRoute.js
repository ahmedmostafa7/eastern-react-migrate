import React, { Component } from "react";
import { mapStateToProps } from "./mapping";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";

class ProtectedRoute extends Component {
  
  render() {
    const { component: Component, user, path } = this.props;
    return (
      <Route
        {...{ ...path }}
        render={(props) =>
          user ? (
            <Component {...props} />
          ) : (
            // <Redirect to={`/login?redirect_to=${path}`} />
            <Redirect to={`${path}`} />
          )
        }
      />
    );
  }
}

export default connect(mapStateToProps)(ProtectedRoute);
