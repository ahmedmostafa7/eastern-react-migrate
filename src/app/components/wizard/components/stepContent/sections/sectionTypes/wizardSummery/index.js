import React, { Component } from "react";
import { Layout } from "antd";
import Side from "./side";
import ViewData from "./viewData";

const { Sider, Content } = Layout;

export class wizardSummery extends Component {
  render() {
    return (
      <Layout
        style={{
          minHeight: "200px",
          display: "grid",
          gridTemplateColumns: "1fr 10fr",
          gridGap: "10px",
        }}
      >
        <Sider
          style={{ background: "#fff", height: "520px", overflow: "auto" }}
        >
          <Side />
        </Sider>
        <div className='summaryDiv'
        // style={{ margin: "0 10px 10px 10px" }}
        >
          <ViewData />
        </div>
      </Layout>
    );
  }
}
