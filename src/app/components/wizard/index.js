import React, { Component } from "react";
import * as modules from "./modulesObjects";
import {
  get,
  keys,
  head,
  find,
  omit,
  includes,
  isEqual,
  isEmpty,
} from "lodash";
import { connect } from "react-redux";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import Steps from "./components/stepsComponent";
import StepContent from "./components/stepContent";
import { withRouter } from "apps/routing/withRouter";
import { withTranslation } from "react-i18next";
import { Modal } from "antd";
// import PrintParcel from "./modulesObjects/split_merge/print/print_parcels";
import PrintParcel from "./modulesObjects/split_merge/print/print_parcels";
import PrintDuplix from "./modulesObjects/split_merge/print/print_duplixs";
import { updateSteps } from "./components/stepContent/actions/actionFunctions";
import bda2l_gov from "./modulesObjects/plan_approval/steps/motabkh_module/bda2l_gov";

export class Wizard extends Component {
  state = { showModal: false };
  constructor(props) {
    super(props);
    this.reUpdateSteps();
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    if (!isEqual(nextProps.currentStep, this.props.currentStep)) {
      this.reUpdateSteps();
      return true;
    }
    //
    // this.reUpdateSteps();
  }

  reUpdateSteps = () => {
    const {
      currentModuleId,
      currentStep,
      setCurrentStep,
      setSteps,
      setWizardSettings,
      mainObject,
      currentModule: {
        record: { workflow_id },
      },
    } = this.props;

    console.log("prooops", this.props);
    //setting the current wizard module and its steps

    let wizard =
      find(modules, { module_id: currentModuleId }) ||
      modules.IMP_COMMITTEE_NUMBER;
    //console.log("wizard", wizard);

    let steps = updateSteps(get(wizard, "steps"), mainObject);
    //console.log("KEYS>>>>>>>>>", steps);

    if (workflow_id == 2211 && this.props.currentModule.id == 39) {
      wizard.steps = { ...wizard.steps, bda2l: { ...bda2l_gov } };
    }
    setSteps(steps);
    if (!currentStep) {
      setCurrentStep(head(steps));
    }
    setWizardSettings(wizard);
  };
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (Object.keys(nextProps.mo3yna).length > 0 && !this.state.showModal) {
  //     this.setState({ showModal: true });
  //   }
  //   return this.state.showModal;
  // }
  getPrintComp(mainObject, workflows, mo3yna) {
    if (workflows.length > 0 && Object.keys(mo3yna).length > 0) {
      let id = mo3yna && mo3yna.currentModule.workflow_id;

      let print_host =
        workflows && workflows.filter((d) => d.id == id)[0]?.print_state;
      if (print_host && print_host.includes("print_parcel")) {
        return <PrintParcel mo3aynaObject={mainObject} />;
      } else {
        return <PrintDuplix mo3aynaObject={mainObject} />;
      }
    }
  }
  render() {
    console.log("wizardpros", this.props);
    const { mo3yna, mainObject, workflows } = this.props;

    // console.log("wok", print_host);
    return (
      <div>
        <Steps />

        <StepContent />
        {/* {this.state.showModal && (
          <Modal
            className="mo3yna_full"
            visible={true}
            title="معاينة"
            onCancel={() => {
              this.setState({ showModal: false });
            }}
            cancelText="اغلاق"
            footer={null}
          >
            {this.getPrintComp(
              mainObject && mainObject,
              workflows && workflows,
              mo3yna && mo3yna
            )}
          </Modal>
        )} */}
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withTranslation("actions")(Wizard))
);
