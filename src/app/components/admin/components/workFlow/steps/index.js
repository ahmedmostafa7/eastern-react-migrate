import React, { Component } from "react";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "../mapping";
import { get, sortBy, isEmpty } from "lodash";
import { StepContainer } from "./stepContainer";
import * as Dialogs from "../dialogs";
import { withTranslation } from "react-i18next";

class stepsComponent extends Component {
  constructor(props) {
    super(props);

    this.styles = {
      steps: {
        height: "900px",
        display: "flex",
        flexFlow: "row wrap",
        overflowY: "auto",
      },
    };
  }

  render() {
    const { allSteps = {}, dialog = {}, removeDialog, t } = this.props;

    const Dialog = get(Dialogs, dialog.name, null);

    const steps = sortBy(allSteps, ["index"]).map((singleStep) => (
      <StepContainer key={singleStep.name} step={{ ...singleStep }} />
    ));

    return (
      <div>
        <div style={this.styles.steps}>
          {!isEmpty(allSteps) ? (
            steps
          ) : (
            <h1 style={{ backgroundColor: "white" }}>
              {" "}
              {t("workFlow:No steps")}{" "}
            </h1>
          )}
        </div>
        {Dialog && (
          <Dialog
            dialog={dialog}
            handleCancel={removeDialog}
            initialValues={dialog.item}
          />
        )}
      </div>
    );
  }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export const Steps = connector(
  withTranslation("workFlow", "messages")(stepsComponent)
);
