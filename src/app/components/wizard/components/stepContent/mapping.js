import { get, assign, isEmpty, omit } from "lodash";
import { getFormValues } from "redux-form";

export const mapStateToProps = (state, ownProps) => {
  const { wizard, mainApp, user } = state;
  //console.log('MAINOBJECT', wizard);
  if (wizard.currentModule.id == 92) {
    wizard.wizardSettings.steps.landData.label =
      wizard.wizardSettings.steps.landData.sections.landData.label =
        "ارفاق الكروكي المساحي";
  } else if (wizard.currentModule.id == 94) {
    wizard.wizardSettings.steps.debagh.label =
      wizard.wizardSettings.steps.debagh.sections.debagh.label =
        "اصدار خطاب كتابة العدل";
  }
  return {
    formValues: getFormValues("stepForm")(state),
    steps: wizard.steps,
    treeNode: wizard.treeNode,
    mainObject: wizard.mainObject,
    wizardSettings: wizard.wizardSettings,
    initialValues: assign({}, get(wizard.mainObject, wizard.currentStep)),
    currentStep: {
      name: wizard.currentStep,
      ...get(wizard.wizardSettings, ["steps", wizard.currentStep]),
    },
    actions: get(wizard.currentModule, "actions") || [],
    record: get(wizard.currentModule, "record") || [],
    currentModuleName: get(wizard.currentModule, "name") || "",
    modal: mainApp.modal,
    is_workflow_admin: get(user, "user.is_workflow_admin", {}),
    workflowSteps: wizard.workflowSteps || []
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    removeModal: () => {
      dispatch({
        type: "removeMainApp",
        path: `modal`,
      });
    },
  };
};
