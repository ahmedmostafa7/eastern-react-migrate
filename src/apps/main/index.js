import React, { Component } from "react";
import { Button } from "antd";
import { withTranslation } from "react-i18next";
import { mapDispatchToProps } from "./mapping";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class Main extends Component {
  submissionClicked() {
    const { setCurrentApp, history } = this.props;
    history.push("submissions");
    setCurrentApp("submissions");
  }

  render() {
    const { t } = this.props;
    return (
      <div style={{ margin: "16px" }}>
        {/* <Button
          onClick={this.submissionClicked.bind(this)} 
          type='primary'> {t('submissions')}</Button> */}
      </div>
    );
  }
}

export default withRouter(
  connect(null, mapDispatchToProps)(withTranslation("common")(Main))
);
