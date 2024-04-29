import React, { Component } from "react";
import { map, pickBy } from "lodash";
import { connect } from "react-redux";
import mapDispatchToProps from "main_helpers/actions/main";
import { mapStateToProps } from "../../../mapping";
import { withTranslation } from "react-i18next";
import { apply_permissions } from "app/helpers/functions";
class actions extends Component {
  takeActions = (action) => {
    action.action(
      this.props,
      this.props.row,
      this.props.values || this.props.mainObject
    );
  };
  render() {
    const { actions } = this.props.field;
    const { t } = this.props;
    console.log("ssd", this.props);
    return (
      <div

      // style={{
      //     display: 'grid',
      //     gridTemplateColumns: '120px 120px 120px',
      //     gridGap: '10px'}}
      >
        {map(
          pickBy(actions, (d) =>
            apply_permissions(this.props.row, d, "permissions", this.props)
          ),
          (action, key) => (
            <button
              className={action.className}
              onClick={this.takeActions.bind(this, action)}
            >
              {t(action.text)}
            </button>
          )
        )}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("actions")(actions));
