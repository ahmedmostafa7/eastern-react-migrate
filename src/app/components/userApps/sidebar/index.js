import React, { Component } from "react";
import { connect } from "react-redux";
import Sidebar from "app/components/sidebar";
import { mapStateToProps, mapDispatchToProps } from "./mapping";

class SidebarComp extends Component {
  render() {
    const { apps, setCurrentApp } = this.props;
    return <Sidebar items={apps} baseUrl="apps" onItemChange={setCurrentApp} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarComp);
