import React, { Component } from "react";
import * as Actions from "./actionTypes";
import { get, omit } from "lodash";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import * as actionFuncs from "./actionFunctions";
import { withRouter } from "react-router";
import { withTranslation } from "react-i18next";
import axios from "axios";
import { workFlowUrl } from "imports/config";

class RenderAction extends Component {
  constructor(props) {
    super(props);
    this.Action = get(Actions, props.actionVals.type, Actions.ButtonComponent);
    this.state = {
      params: null,
    };
  }

  takeAction = (actionName, params, props, values) => {
    get(actionFuncs, actionName, () => {})(params, props, values);
  };
  //   componentDidMount() {
  //     let appId = localStorage.getItem("appId");

  //     let id = this.props.currentModule.workflow_id;
  //     axios
  //       .get(workFlowUrl + `/workFlow/GetCreatedStepInWorkFlow/${appId}`)
  //       .then(({ data }) => {
  //         var workflows = data;
  //         // console.log("count", this.state.count);
  //         let print_host =
  //           workflows && workflows.filter((d) => d.id == id)[0].print_state;
  //         this.props.setWorkflows(print_host);
  //       })
  //       .catch((e) => {});
  //   }

  compareObjects = (obj1 = {}, obj2 = {}) => {
    const common = Object.keys(obj1).filter((key) => {
      if (!obj2.hasOwnProperty(key)) {
        return true;
      }
      return false;
    });
    return common;
  };

  render() {
    const { Action } = this;
    const {
      handleSubmit,
      actionVals: { htmlType, can_submit },
      actionName,
      formValues,
    } = this.props;

    const handleClick =
      htmlType == "submit" || can_submit == true
        ? handleSubmit((values) => {
            this.takeAction(actionName, this.state.params, this.props, values);
          })
        : (e) => {
            this.takeAction(
              actionName,
              this.state.params,
              this.props,
              formValues
            );
          };

    return (
      <Action
        className="aaaaction"
        onClick={(e) => {
          this.setState({ params: e }, handleClick);
        }}
        {...this.props}
      />
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("messages")(RenderAction))
);
