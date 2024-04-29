import { get } from "lodash";
import { moment } from "moment-hijri";
import { copyUser } from "../../../../inputs/fields/identify/Component/common/common_func";
export const mapStateToProps = ({
  mainApp,
  user,
  selectors,
  wizard: {
    currentStep,
    wizardSettings,
    steps,
    mainObject,
    comments,
    currentModule,
  },
}) => {
  return {
    currentStep,
    workflows: selectors && selectors.workflows_1 && selectors.workflows_1.data,
    steps,
    // workflows: mainApp.workflows,
    mainObject: {
      ...mainObject,
      submissionTypeName: get(
        currentModule,
        "record.workflows.name",
        get(mainObject, "submissionTypeName", "")
      ),
      currentStepId: get(
        currentModule,
        "record.CurrentStep.id",
        get(mainObject, "currentStepId", 0)
      ),
      print_state: mainObject?.print_state || get(currentModule, "print_state", ""),
      //  currentModuleId: get(currentModule, "id"),
    },
    currentModule,
    user: get(user, "user", {}),
    comments,
    wizardSettings,
    selectors,
    mainApp,
  };
};

export const mapDispatchToProps = (dispatch) => ({
  setCurrentStep: (step) => {
    dispatch({
      type: "setWizard",
      path: "currentStep",
      data: step,
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
  setStep: (step) => {
    dispatch({
      type: 'setWizard',
      path: 'currentStep',
      data: step
    })
  },
  setMo3yna: (data) => {
    dispatch({
      type: "setMainApp",
      path: "mo3yna",
      data,
    });
  },
  setWorkflows: (data) => {
    dispatch({
      type: "setMainApp",
      path: "workflows",
      data,
    });
  },
  setUploadFileDetails: (e) => {
    dispatch({
      type: 'setMainApp',
      path: 'uploadFileDetails',
      data: e
    })
  },
  setEditableFeatures: (e) => {
    dispatch({
      type: 'setMainApp',
      path: 'editableFeatures',
      data: e
    })
  },
  setOriginalFeatures: (e) => {
    dispatch({
      type: 'setMainApp',
      path: 'originalFeatures',
      data: e
    })
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
});
