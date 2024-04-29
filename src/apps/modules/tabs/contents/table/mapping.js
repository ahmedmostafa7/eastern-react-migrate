import { get } from "lodash";

export const mapStateToProps = ({ mainApp, user: { user } }, ownProps) => {
  return {
    currentTab: mainApp.currentTab,
    NotificationData: mainApp.NotificationData,
    search: mainApp.search,
    filters: mainApp.filters,
    cache: mainApp.cache,
    user,
    user_groups: get(user, "groups", []),
    ...get(mainApp.cache, ownProps.moduleName, {}),
    app_id: get(mainApp.apps, mainApp.currentApp, {}).id,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    fillData: (data, path) => {
      dispatch({
        type: "setMainApp",
        path: `cache.${path}`,
        data,
      });
    },
    setCountTab: (data) => {
      dispatch({
        type: "setMainApp",
        path: "countTabs",
        data,
      });
    },
    setBtnsParams: (data, path) => {
      dispatch({
        type: "setMainApp",
        path: `NotificationData`,
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
    setLoading: (data) => {
      dispatch({
        type: "setMainApp",
        path: "loading",
        data,
      });
    },
    setMainObject: (data) => {
      dispatch({
        type: "setWizard",
        path: "mainObject",
        data,
      });
    },
    addToMainObject: (data, path) => {
      dispatch({
        type: "setWizard",
        path: `mainObject.${path}`,
        data,
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
    //},
    setCurrentStep: (value) => {
      dispatch({
        type: "setWizard",
        path: "currentStep",
        data: value,
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
    setWizardActions: (data) => {
      dispatch({
        type: "setWizard",
        path: "currentModule.actions",
        data,
      });
    },
    removeItemInResults: (path, index) => {
      dispatch({
        type: "removeMainApp",
        path: path.indexOf('.') == -1 && `cache.${path}` || `${path}`,
        index,
      });
    },
  };
};
