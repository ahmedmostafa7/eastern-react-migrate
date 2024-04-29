import { get } from "lodash";
import { formValueSelector } from "redux-form";
import mapDispatchToProps1 from "main_helpers/actions/main";
export const mapStateToProps = (
  state,
  { moduleName, path, value_key, ...props }
) => {
  const { wizard, selectors = {}, mainApp, mapViewer } = state;
  const { mainObject, currentStep, steps, currentModule } = wizard;
  
  return {
    data: props.data || get(state, path),
    lang: mainApp.language,
    selectors,
    apps: mainApp.apps,
    info: get(mapViewer, "info.info", {}),
    ...(selectors[moduleName] || {}),
    value_key: get(selectors[moduleName], "value_key", value_key),
    //hideLabel: get(selectors[moduleName], "hideLabel", true),
    mainObject: { ...mainObject },
    currentStep,
    steps,
    currentModule,
    user: get(state.user, "user", {}),
    wizardSettings: wizard.wizardSettings,
  };
};

export const mapDispatchToProps = (dispatch, { moduleName }) => {
  return {
    getValues(name = "stepForm") {
      return formValueSelector("name");
    },
    setSelector: (moduleName, data) => {
      dispatch({
        type: "setSelectors",
        path: `${moduleName}`,
        data,
      });
    },
    // setMain: (app, data) => {
    //   return {
    //     type: `set_main${app}`,
    //     data,
    //   };
    // },
    mainProps: mapDispatchToProps1(dispatch),
    setValueLabelKeys: (label_key, value_key) => {
      dispatch({
        type: "setSelectors",
        path: `${moduleName}.label_key`,
        data: label_key,
      });
      dispatch({
        type: "setSelectors",
        path: `${moduleName}.value_key`,
        data: value_key,
      });
    },
    setData: (data) => {
      dispatch({
        type: "setSelectors",
        path: `${moduleName}.data`,
        data,
      });
    },
    setParams: (params) => {
      
      dispatch({
        type: "setSelectors",
        path: `${moduleName}.params`,
        params,
      });
    },
    addToData: (data, index, operation) => {
      dispatch({
        type: "insertInArraySelectors",
        path: `${moduleName}.data`,
        operation,
        index,
        data,
      });
    },
    setNextUrl: (nextUrl) => {
      dispatch({
        type: "setSelectors",
        path: `${moduleName}.links.nextLink`,
        data: nextUrl,
      });
    },
    addNewSelector: (moduleName, data) => {
      dispatch({
        type: "setSelectors",
        path: moduleName,
        data,
      });
    },
    removeSelector: (moduleName) => {
      dispatch({
        type: "removeSelectors",
        path: moduleName,
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
        path: "comments",
      });
      dispatch({
        type: "removeWizard",
        path: "allNotes",
      });
    },
    saveComment: (data) => {
      dispatch({
        type: "setWizard",
        path: "mainObject.comments",
        data,
      });
    },
    setMainObject: (data) => {
      dispatch({
        type: 'setWizard',
        path: 'mainObject',
        data
      });
    },
  };
};
