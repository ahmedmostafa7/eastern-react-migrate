import { get } from "lodash";
import { setMap } from "main_helpers/functions/filters/state";
import { getFormValues } from "redux-form";
import { copyUser } from "./common";
let mainMap = undefined;
export const mapStateToProps = (state, ownProps, modules) => {
  return {
    map: state.mapReducer.map,
    mainObject: state.wizard.mainObject,
    currentStep: state.wizard.currentStep,
    mapObj: mainMap,
    mapLayers: state.wizard.mapLayers,
    steps: state.wizard.steps,
    currentModule: state.wizard.currentModule,
    user: get(state.user, "user", {}),
    app_id: +get(ownProps, `match.params.id`, ownProps?.match?.params?.id || localStorage.getItem("appId")),
    selectMapLayer: state.mainApp.selectMapLayer,
    selectedFeaturesOnMap: state.mainApp.selectedFeaturesOnMap,
    values: getFormValues(ownProps.form)(state),
  };
  // console.log(mainObject)
};

export const mapDispatchToProps = (dispatch, { moduleName }) => {
  //console.log(moduleName);
  return {
    setMain: (app, data) => {
      dispatch({
        type: `set_main${app}`,
        data,
      });
    },
    setCurrentMap: (data) => {
      mainMap = data;
      setMap(data);
    },
    setMapExtent: (path, data) =>
      dispatch({
        type: "setWizard",
        path: `${path}.publicLocation`,
        data,
      }),
    setMapLayers: (data) =>
      dispatch({ type: "setWizard", path: "mapLayers", data }),
    setCADDetails: (data) =>
      dispatch({ type: "setWizard", path: "cadData", data }),
    setMap: (e) => {
      dispatch({
        type: "setMap",
        value: e,
      });
    },
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
    setLoading: (data) => {
      dispatch({
        type: "setMainApp",
        path: "loading",
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
    setPolygonSides: (path, data) =>
      dispatch({ type: "setWizard", path: `${path}.submission_data`, data }),

    setSelectMapLayer: (e) => {
      dispatch({
        type: "setMainApp",
        path: "selectMapLayer",
        data: e,
      });
    },

    setSelectedFeaturesOnMap: (e) => {
      dispatch({
        type: "setMainApp",
        path: "selectedFeaturesOnMap",
        data: e,
      });
    },
  };
};
