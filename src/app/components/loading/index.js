import React, { Component } from "react";
import Loader from "react-loader-spinner";
import { connect } from "react-redux";
import { mapStateToProps } from "./mapping";

class Loading extends Component {
  constructor(props) {
    super(props);
    let loader = document.getElementById("loader");
    if (loader) {
      loader.remove();
    }
  }
  render() {
    return (
      <div>
        {this.props.loading ? (
          <div className="spinner-bk">
            <div className="sk-cube-grid">
              <div className="sk-cube sk-cube1"></div>
              <div className="sk-cube sk-cube2"></div>
              <div className="sk-cube sk-cube3"></div>
              <div className="sk-cube sk-cube4"></div>
              <div className="sk-cube sk-cube5"></div>
              <div className="sk-cube sk-cube6"></div>
              <div className="sk-cube sk-cube7"></div>
              <div className="sk-cube sk-cube8"></div>
              <div className="sk-cube sk-cube9"></div>
            </div>
            {/* <Loader type="TailSpin" color="#036777" height="100" width="100" /> */}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}
export default connect(mapStateToProps)(Loading);
//  <div className="spinner-bk">
// <div className="sk-cube-grid">
//   <div className="sk-cube sk-cube1"></div>
//   <div className="sk-cube sk-cube2"></div>
//   <div className="sk-cube sk-cube3"></div>
//   <div className="sk-cube sk-cube4"></div>
//   <div className="sk-cube sk-cube5"></div>
//   <div className="sk-cube sk-cube6"></div>
//   <div className="sk-cube sk-cube7"></div>
//   <div className="sk-cube sk-cube8"></div>
//   <div className="sk-cube sk-cube9"></div>
// </div>
