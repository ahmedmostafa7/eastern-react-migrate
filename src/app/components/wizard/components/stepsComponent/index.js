import React, { Component } from "react";
import { mapStateToProps, mapDispatchToProps } from "./mapping";
import { Steps, Icon } from "antd";
import { get, isEmpty } from "lodash";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import Media from "react-media";
import landData_farz_simple from "../../modulesObjects/split_merge/steps/request_module/landData_farz_simple";
import farz_msa7y from "../../modulesObjects/split_merge/steps/request_module/farz_msa7y";
import landData_farz_no_gis from "../../modulesObjects/split_merge/steps/request_module/landData_farz_no_gis";
import sugLandData_farz_no_gis from "../../modulesObjects/split_merge/steps/request_module/suggestedParcels_no_gis";

import landData_farz_simple_duplix from "../../modulesObjects/split_merge/steps/request_module/landData_farz_simple_duplix";
import sugLandData_farz_duplex_no_gis from "../../modulesObjects/split_merge/steps/request_module/suggestedParcels_duplex_no_gis";
import landData_farz_duplex_no_gis from "../../modulesObjects/split_merge/steps/request_module/landData_farz_duplex_no_gis";

const Step = Steps.Step;

class StepsComponent extends Component {
  handleStepClick(step) {
    const { setStep, mainObject, wizardSettings, steps } = this.props;
    const unsubmittedSteps = steps.filter((step) => !get(mainObject, step));
    // mainObject.owner_summary.owner_summary.submissionType

    if ([23, 34].indexOf(wizardSettings.module_id) != -1) {
      if (mainObject.owner_summary) {
        var obj = wizardSettings.steps;
        delete wizardSettings.steps.landData;
        delete wizardSettings.steps.data_msa7y;
        delete wizardSettings.steps.sugLandData;

        var index = steps.indexOf("landData");
        if (index !== -1) {
          steps.splice(index, 1);
        }
        index = steps.indexOf("data_msa7y");
        if (index !== -1) {
          steps.splice(index, 1);
        }

        index = steps.indexOf("sugLandData");
        if (index !== -1) {
          steps.splice(index, 1);
        }
        if (mainObject.owner_summary.owner_summary.submissionType) {
          if (+mainObject.owner_summary.owner_summary.submissionType == 1) {
            obj["landData"] = { ...landData_farz_simple };
            obj["data_msa7y"] = { ...farz_msa7y };
            if (steps.indexOf("landData") == -1) {
              steps.splice(1, 0, "landData");
            }
            if (steps.indexOf("data_msa7y") == -1) {
              steps.splice(3, 0, "data_msa7y");
            }
          } else {
            obj["landData"] = { ...landData_farz_no_gis };
            obj["sugLandData"] = { ...sugLandData_farz_no_gis };
            if (steps.indexOf("landData") == -1) {
              steps.splice(1, 0, "landData");
            }
            if (steps.indexOf("sugLandData") == -1) {
              steps.splice(3, 0, "sugLandData");
            }
          }
        }
        if (mainObject.owner_summary.owner_summary.submissionType_duplix) {
          if (
            +mainObject.owner_summary.owner_summary.submissionType_duplix ==
              1 ||
            +mainObject.owner_summary.owner_summary.submissionType_duplix == 3
          ) {
            obj["landData"] = { ...landData_farz_simple_duplix };
            obj["data_msa7y"] = { ...farz_msa7y };
            if (steps.indexOf("landData") == -1) {
              steps.splice(1, 0, "landData");
            }
            if (steps.indexOf("data_msa7y") == -1) {
              steps.splice(4, 0, "data_msa7y");
            }
          } else {
            obj["landData"] = { ...landData_farz_duplex_no_gis };
            obj["sugLandData"] = { ...sugLandData_farz_duplex_no_gis };
            if (steps.indexOf("landData") == -1) {
              steps.splice(1, 0, "landData");
            }
            if (steps.indexOf("sugLandData") == -1) {
              steps.splice(4, 0, "sugLandData");
            }
          }
        }

        wizardSettings.steps = obj;
      }
    }
    if (
      !Object.values(mainObject?.summery?.summery || {})?.filter(
        (comment) =>
          comment != undefined &&
          !isEmpty(comment.comments) &&
          comment?.checked == false
      )?.length
    ) {
      if (
        steps.findIndex((step) => step.toLowerCase() == "summery") == 0 &&
        unsubmittedSteps.indexOf("summery") != -1
      ) {
        unsubmittedSteps.splice(0, 1);
      }
      if (
        this.props?.record?.is_returned ||
        this.props?.currentModule?.record?.is_returned
      ) {
        if (steps.findIndex((step) => step.toLowerCase() == "summery") == 0) {
          if (
            !Object.values(mainObject?.comments || {})?.filter(
              (com) =>
                (com != undefined &&
                  Array.isArray(com) &&
                  com.find(
                    (comment) =>
                      !isEmpty(comment.comment) &&
                      comment?.checked == true &&
                      isEmpty(comment.reply_text) &&
                      ((!comment?.step?.isRequestModule &&
                        comment?.step?.module_id ==
                          this.props.currentModule.id &&
                        comment?.step?.stepId ==
                          this.props.currentModule.record.CurrentStep.id) ||
                        (comment?.step?.isRequestModule &&
                          comment?.step?.stepId ==
                            this.props.currentModule.record.CurrentStep.id))
                  ) != undefined) ||
                (!Array.isArray(com) &&
                  !isEmpty(com.comment) &&
                  com?.checked == true &&
                  isEmpty(com.reply_text) &&
                  ((!com?.step?.isRequestModule &&
                    com?.step?.module_id == this.props.currentModule.id &&
                    com?.step?.stepId ==
                      this.props.currentModule.record.CurrentStep.id) ||
                    (com?.step?.isRequestModule &&
                      com?.step?.stepId ==
                        this.props.currentModule.record.CurrentStep.id)))
            )?.length
          ) {
            if (get(mainObject, step) || unsubmittedSteps.indexOf(step) == -1) {
              setStep(step);
            }
          } else {
            window.notifySystem("error", "من فضلك ادخل الرد على التعليقات");
          }
        } else {
          if (get(mainObject, step) || unsubmittedSteps.indexOf(step) == -1) {
            setStep(step);
          }
        }
      } else {
        if (get(mainObject, step) || unsubmittedSteps.indexOf(step) == -1) {
          setStep(step);
        }
      }
    } else {
      window.notifySystem(
        "error",
        "لا يمكن عمل التالي حتي يتم تنفيذ التعليقات المدخلة"
      );
    }
  }

  render() {
    const { steps, currentStep, wizardSettings, mainObject, currentModule, t } =
      this.props;
    const stepsSettings = get(wizardSettings, "steps");
    console.log("steps", steps);

    // if (
    //   currentModule?.record?.CurrentStep?.module_id == 44 &&
    //   currentModule?.record?.CurrentStep?.id == 2328
    // ) {
    //   let admissionsIndex = steps.findIndex((step) => step == "admissions");
    //   if (admissionsIndex > -1) {
    //     steps.splice(admissionsIndex, 1);
    //     delete stepsSettings.admissions;
    //   }
    // } else if (
    //   currentModule?.record?.CurrentStep?.module_id == 44 &&
    //   currentModule?.record?.CurrentStep?.id != 2328
    // ) {
    //   let printAdmissionsIndex = steps.findIndex((step) => step == "print_takreer");
    //   if (printAdmissionsIndex > -1) {
    //     steps.splice(printAdmissionsIndex, 1);
    //     delete stepsSettings.print_takreer;
    //   }
    // }

    return (
      <div className="wizard-container-steps">
        <Media query="(max-width: 768px)">
          {(matches) =>
            matches ? (
              <Steps
                current={steps.indexOf(currentStep)}
                style={{ margin: "16px", padding: "10px 20px 0 20px" }}
                className="steps-wizard ant-steps-vertical "
              >
                {steps.map((stepKey) => {
                  const step = get(stepsSettings, stepKey);
                  const icon = get(step, "icon");
                  return (
                    <Step
                      style={{ cursor: "pointer" }}
                      title={t(get(step, "label"))}
                      status={
                        get(mainObject, stepKey) && stepKey !== currentStep
                          ? "finish"
                          : undefined
                      }
                      key={stepKey}
                      name={stepKey}
                      icon={icon && <Icon type={icon} />}
                      description={
                        get(step, "description") &&
                        t(`messages:${get(step, "description")}`)
                      }
                      onClick={this.handleStepClick.bind(this, stepKey)}
                    />
                  );
                })}
              </Steps>
            ) : (
              <Steps
                current={steps.indexOf(currentStep)}
                style={{ margin: "16px", padding: "15px" }}
                className="steps-wizard"
              >
                {steps.map((stepKey) => {
                  const step = get(stepsSettings, stepKey);
                  const icon = get(step, "icon");
                  return (
                    <Step
                      style={{ cursor: "pointer" }}
                      title={t(get(step, "label"))}
                      status={
                        get(mainObject, stepKey) && stepKey !== currentStep
                          ? "finish"
                          : undefined
                      }
                      key={stepKey}
                      name={stepKey}
                      icon={icon && <Icon type={icon} />}
                      description={
                        get(step, "description") &&
                        t(`messages:${get(step, "description")}`)
                      }
                      onClick={this.handleStepClick.bind(this, stepKey)}
                    />
                  );
                })}
              </Steps>
            )
          }
        </Media>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation("labels")(StepsComponent));
