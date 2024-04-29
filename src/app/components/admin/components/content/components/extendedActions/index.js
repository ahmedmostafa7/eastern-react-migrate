import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import { get } from "lodash";
import { apply_permissions } from "app/helpers/functions";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import memoize from "memoize-one";
import { withTranslation } from "react-i18next";

class tableActions extends Component {
  buildExtendedActions = memoize((currentModule) => {
    const { t } = this.props;
    return [
      {
        name: "add",
        label: `${t("actions:Add")} ${t(
          get(currentModule, "singleLabel", "")
        )}`,
        function: "addNewItem",
        permissions: get(currentModule, "actions_permissions.add"),
        icon: "Plus",
      },
      ...get(currentModule, "extendedActions", []),
    ];
  });

  render() {
    const { currentModule } = this.props;
    const extendedActions = currentModule
      ? this.buildExtendedActions(currentModule)
      : [];
    return (
      <div className="add-setting">
        {extendedActions
          .filter((d) => apply_permissions({}, d, "permissions", this.props))
          .map((action) => (
            <Button
              key={action.name}
              onClick={get(currentModule.actionFuncs, action.function).bind(
                this
              )}
              className="add_mktab"
              type="primary"
              icon={action.icon}
            >
              {" "}
              {action.label}{" "}
            </Button>
          ))}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(tableActions));
