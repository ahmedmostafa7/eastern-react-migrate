import { get } from "lodash";
export const mapStateToProps = ({
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
}) => {
  console.log(mainObject);
  // return ({
  //     map: mapReducer.map,
  //     mainObject,

  // })
  return {
    mainObject,
    currentStep,
    steps,
    currentModule,
    wizardSettings,
  };
  // console.log(mainObject)
};

export const mapDispatchToProps = (dispatch, { moduleName }) => {
  console.log(moduleName);
  return {};
};
