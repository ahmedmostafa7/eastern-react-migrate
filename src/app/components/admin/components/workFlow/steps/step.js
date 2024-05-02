import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { Layout, Icon, Button } from "antd";
import { stepIcons } from "./stepIcons";
import { withTranslation } from "react-i18next";
import { omit } from "lodash";
import { withRouter } from "apps/routing/withRouter";

class stepComponent extends Component {
  constructor(props) {
    super(props);

    this.style = {
      layout: {
        width: "300px",
        height: "150px",
        flex: "initial",
        border: "2px solid #41668A",
        borderRadius: "5px",
        margin: "10px",
        // padding: '10px',
      },
    };
  }

  render() {
    const {
      step: { name },
    } = this.props;

    return (
      <div>
        <Layout style={this.style.layout}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              background: "#41668A",
              padding: "8px",
            }}
          >
            {stepIcons.map((icon) => (
              <Button
                {...omit({ ...icon }, ["action"])}
                ghost
                shape="circle"
                key={icon.name}
                onClick={icon.action.bind(this)}
              />
            ))}
          </div>

          <label style={{ fontSize: "large", margin: "8px" }}> {name}</label>
        </Layout>
      </div>
    );
  }
}

export const Step = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("workFlow")(stepComponent))
);
