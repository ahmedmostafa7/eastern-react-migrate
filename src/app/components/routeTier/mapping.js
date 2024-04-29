import { get } from 'lodash';

export const mapStateToProps = ({ wizard, user: { user } }) => {

  console.log(wizard);
  if (wizard.currentModule) {
    let subType = wizard.currentModule.record.workflows ? "currentModule.record.workflows.name" : 'mainObject.submissionTypeName';
    let curStep = wizard.currentModule.record.CurrentStep ? "currentModule.record.CurrentStep.id" : 'mainObject.currentStepId';
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

      user_groups: get(user, "groups", []),
      // currentModuleRecordCreate: get(wizard.currentModule, 'record.CurrentStep.is_create') === 1
    };
  }
  else {
    return { user_groups: get(user, "groups", []) }
  }
}

export const mapDispatchToProps = (dispatch) => {

  return {
    setWizardSettings: (value) => {
      dispatch({
        type: 'setWizard',
        path: 'wizardSettings',
        data: value
      })
    },
    setCurrentApp: (data) => {

      dispatch({
        type: "setMainApp",
        path: "currentApp",
        data,
      });
    },
    setSteps: (value) => {
      dispatch({
        type: 'setWizard',
        path: 'steps',
        data: value
      })
    },
    setCurrentStep: (value) => {
      dispatch({
        type: 'setWizard',
        path: 'currentStep',
        data: value
      })
    },
    setMainObject: (data) => {
      dispatch({
        type: 'setWizard',
        path: 'mainObject',
        data
      });
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
        type: 'setWizard',
        path: "currentModule",
        data
      })
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
  }
}
