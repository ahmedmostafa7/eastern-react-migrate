import React, { Component } from "react";
import { Button } from "antd";
import { map } from "lodash";
import { connect } from "react-redux";
import mapDispatchToProps from "main_helpers/actions/main";
import { withTranslation } from "react-i18next";

class actions extends Component {
  takeActions = (action) => {
    action.action(this.props, this.props.row, this.props.values);
  };
  render() {
    const { actions } = this.props.field;
    const { t } = this.props;
    console.log("ssd", this.props);
    return (
      <div
      //  style={{
      // display: 'grid',
      // gridTemplateColumns: '120px 120px 120px',
      // gridGap: '10px'}}
      >
        {map(actions, (action, key) => (
          <button
            className={action.className}
            onClick={this.takeActions.bind(this, action)}
          >
            {t(action.text)}
          </button>
        ))}
      </div>
    );
  }
}
export default connect(
  null,
  mapDispatchToProps
)(withTranslation("actions")(actions));
