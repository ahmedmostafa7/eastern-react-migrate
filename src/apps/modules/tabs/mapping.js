import { get, find, keys, toLower } from "lodash";

export const mapStateToProps = (
  { user, mainApp, wizard, admin },
  ownProps,
  modules
) => {
  const name = ownProps.match.params.app.replace("-", "") || ownProps;
  const {
    currentApp = `splitandmerge.${find(
      keys(get(mainApp, "apps.splitandmerge", {})),
      (d) => toLower(d).replace("_", "") == toLower(name)
    )}`,
  } = mainApp;
  // console.log("mod", modules);
  return {
    currentApp: get(mainApp, `apps.${currentApp}`),
    countTabsCount: get(mainApp, `countTabs`),
    app_name: currentApp,
    workflows: get(mainApp, `apps.${currentApp}.workflows`),
    tabs: get(mainApp, `apps.${currentApp}.modules`),
    color: get(mainApp, `apps.${currentApp}.color`),
    currentTab: mainApp.currentTab,
    modal: mainApp.modal,
    ...mainApp[ownProps.moduleName],
    user: get(user, "user", {}),
  };
};
// console.log("s", mainApp, ownProps);

export const mapDispatchToProps = (dispatch) => {
  return {
    setWorkflows: (data) => {
      dispatch({
        type: "setMainApp",
        path: "workflows",
        data,
      });
    },
    setCurrentApp: (data) => {
      dispatch({
        type: "setMainApp",
        path: "currentApp",
        data,
      });
    },
    setCurrentTab: (data) => {
      dispatch({
        type: "setMainApp",
        path: "currentTab",
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
    removeModal: () => {
      dispatch({
        type: "removeMainApp",
        path: `modal`,
      });
    },
    removeCahce: (path) => {
      dispatch({
        type: "removeMainApp",
        path: `cache.${path}`,
      });
    },
    setMo3yna: (data) => {
      dispatch({
        type: "setMainApp",
        path: "mo3yna",
        data,
      });
    },
  };
};
