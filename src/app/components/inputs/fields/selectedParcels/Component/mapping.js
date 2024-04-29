import { formValueSelector } from "redux-form";
import { get } from "lodash";
export const mapStateToProps = (
  {
    mapReducer,
    wizard: {
      steps,
      mainObject,
      currentStep,
      treeNode,
      currentModule,
      comments,
      wizardSettings,
    },
    selectors = {},
    ...state
  },
  { moduleName, path, value_key, ...props }
) => {
  return {
    mainObject,
    selectedRequestType: get(selectors[moduleName], "selectedRequestType", {}),
    domainList: get(selectors[moduleName], "domainList", {}),
    currentStep,
    steps,
    currentModule,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    getValues(name = "stepForm") {
      return formValueSelector("name");
    },
    setSelectorEnability: (moduleName, data) => {
      dispatch({
        type: "setSelectors",
        path: `${moduleName}.disabled`,
        data,
      });
    },
    removeSelector: (moduleName) => {
      dispatch({
        type: "removeSelectors",
        path: `${moduleName}`,
      });
    },
    setSelector: (moduleName, data) => {
      dispatch({
        type: "setSelectors",
        path: `${moduleName}`,
        data,
      });
    },
    // setSelectedParcels: (path, data) => dispatch({type: 'setWizard', path: `mainObject.waseka_data.selectedParcels`, data})
  };
};
