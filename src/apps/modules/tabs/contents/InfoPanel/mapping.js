import { getFormValues } from "redux-form";
import { get } from "lodash";

export const mapStateToProps = (state, ownProps) => ({
  currentApp: get(state.mainApp, `apps.${state.mainApp.currentApp}`),
  searchVals: getFormValues("searchForm")(state),
  user_groups: get(state.user, "user.groups", []),
  ...get(state.mainApp.cache, ownProps.moduleName, {}),
  user: get(state.user, "user", {}),
});

export const mapDispatchToProps = (dispatch) => {
  return {
    setMainObject: (data) => {
      dispatch({
        type: "setWizard",
        path: "mainObject",
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

    setCurrentModule: (data) => {
      dispatch({
        type: "setWizard",
        path: "currentModule",
        data,
      });
    },
    removeMainObject: () => {
      dispatch({
        type: "removeWizard",
        path: "mainObject",
      });
      dispatch({
        type: "removeWizard",
        path: "currentStep",
      });
      dispatch({
        type: "removeWizard",
        path: "currentModule",
      });
      dispatch({
        type: "removeWizard",
        path: "comments",
      });
      dispatch({
        type: "removeWizard",
        path: "allNotes",
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
    addToMainObject: (data, path) => {
      dispatch({
        type: "setWizard",
        path: `mainObject.${path}`,
        data,
      });
    },
  };
};
