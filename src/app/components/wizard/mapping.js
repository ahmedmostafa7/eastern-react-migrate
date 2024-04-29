import { get } from "lodash";
import { copyUser } from "../inputs/fields/identify/Component/common/common_func";

export const mapStateToProps = ({ wizard, mainApp }) => {
  console.log(wizard);
  if (wizard.currentModule) {
    let subType = wizard.currentModule.record.workflows
      ? "currentModule.record.workflows.name"
      : "mainObject.submissionTypeName";
    let curStep = wizard.currentModule.record.CurrentStep
      ? "currentModule.record.CurrentStep.id"
      : "mainObject.currentStepId";
    return {
      mainObject: {
        ...wizard.mainObject,
        submissionTypeName: get(wizard, subType, ""),
        currentStepId: get(wizard, curStep, 0),
        print_state: wizard?.mainObject?.print_state || get(wizard, "currentModule.print_state", ""),
      }, //
      currentStep: wizard.currentStep,
      // currentModuleName: get(wizard.currentModule, 'name'),
      currentModuleId: get(wizard.currentModule, "id"),
      currentModule: get(wizard, "currentModule"),
      mo3yna: mainApp.mo3yna,
      workflows: mainApp.workflows,
      // currentModuleRecordCreate: get(wizard.currentModule, 'record.CurrentStep.is_create') === 1
    };
  }
};

export const mapDispatchToProps = (dispatch) => {
  return {
    setWizardSettings: (value) => {
      dispatch({
        type: "setWizard",
        path: "wizardSettings",
        data: value,
      });
    },
    setSteps: (value) => {
      dispatch({
        type: "setWizard",
        path: "steps",
        data: value,
      });
    },
    setCurrentStep: (value) => {
      dispatch({
        type: "setWizard",
        path: "currentStep",
        data: value,
      });
    },
    setMainObject: (data, step, user) => {
      dispatch({
        type: "setWizard",
        path: `mainObject.${step}`,
        data,
      });

      if (user) {
        // user = { ...user, currentDate: moment().format("iYYYY/iM/iD") };

        dispatch({
          type: "setWizard",
          path: `mainObject.${step}.user`,
          data: copyUser({user}),
        });
      }
    },
    setComments: (data) => {
      dispatch({
        type: "setWizard",
        path: "comments",
        data,
      });
    },
    // setAllNotes:(data) => {
    //     dispatch({
    //         type:'setWizard',
    //         path:'allNotes',
    //         data
    //     });
    // },
    setModal: (data) => {
      dispatch({
        type: "setMainApp",
        path: `modal`,
        data,
      });
    },
    setCurrentModule: (data) => {
      dispatch({
        type: "setWizard",
        path: "currentModule",
        data,
      });
    },
    setMainObjectNoPath: (data) => {
      dispatch({
        type: "setWizard",
        path: "mainObject",
        data,
      });
    },
    removeMainObject: () => {
      dispatch({
        type: "removeWizard",
        path: "mainObject",
      });
    },
  };
};
