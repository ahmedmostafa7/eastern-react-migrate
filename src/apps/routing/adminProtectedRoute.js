// import React, { Component } from "react";
// import { mapStateToProps } from "./mapping";
// import { connect } from "react-redux";
// import { Route, Navigate } from "react-router-dom";

// class AdminProtectedRoute extends Component {
//   render() {
//     const { component: Component, user, path } = this.props;
//     return (
//       user?.is_super_admin && (
//         <Route {...{ ...path }} render={(props) => <Component {...props} />} />
//       )
//     );
//   }
// }

// export default connect(mapStateToProps)(AdminProtectedRoute);
