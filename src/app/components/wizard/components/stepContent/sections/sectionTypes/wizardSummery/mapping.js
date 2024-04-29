import { get } from "lodash";

export const mapStateToProps = ({
  selectors,
  user: { user },
  wizard: {
    steps,
    mainObject,
    currentStep,
    treeNode,
    currentModule,
    comments,
    wizardSettings,
    workflowSteps
  },
  mainApp: { currentTab },
}) => ({
  steps,
  treeNode,
  mainObject,
  currentTab,
  comments,
  //allNotes,
  currentModule,
  currentRecordEdit: get(currentModule, "record.CurrentStep.is_edit"),
  userId: get(user, "id", null),
  user,
  wizardSettings,
  currentStep,
  selectors,
  workflowSteps: workflowSteps || []
});

export const mapDispatchToProps = (dispatch) => {
  return {
    setMain: (app, data) => {
      dispatch({
        type: `set_main${app}`,
        data,
      });
    },
    setMainApp: (data) => {
      dispatch({
        type: "setWizard",
        path: "commentChecked",
        data,
      });
    },
    setCurrentTreeNode: (data) => {
      dispatch({
        type: "setWizard",
        path: "treeNode",
        data,
      });
    },
    removeCurrentTreeNode: () => {
      dispatch({
        type: "removeWizard",
        path: "treeNode",
      });
    },
    setComments: (currentNode, index, data) => {
      dispatch({
        type: "setWizard",
        path: `mainObject.comments.${currentNode}.${index}`,
        data,
      });
    },
    setSummeryComments: (path, data) => {
      if (data.comments) {
        dispatch({
          type: "setWizard",
          path: `mainObject.summery.summery.${path}`,
          data,
        });
      }
    },
    updateSummery: (data) => {
      dispatch({
        type: "setWizard",
        path: `mainObject.summery.summery`,
        data,
      });
    },
    setWorkflowSteps: (data) => {
      dispatch({
        type: "setWizard",
        path: `workflowSteps`,
        data,
      });
    },
    setSelectorData: (data, moduleName) => {
      dispatch({
        type: "setSelectors",
        path: `${moduleName}.data`,
        data,
      });
    },
    setModal: (data) => {
      dispatch({
        type: "setMainApp",
        path: `modal`,
        data,
      });
    },
  };
};
