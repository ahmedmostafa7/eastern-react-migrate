import React, { Component } from "react";
import { connect } from "react-redux";
import Sidebar from "app/components/sidebar";
import { mapStateToProps, mapDispatchToProps } from "./mapping";

class SidebarComp extends Component {
  render() {
    const { setCurrentModule, modules } = this.props;
    return (
      <Sidebar items={modules} onItemChange={setCurrentModule} sortBy="index" />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarComp);
