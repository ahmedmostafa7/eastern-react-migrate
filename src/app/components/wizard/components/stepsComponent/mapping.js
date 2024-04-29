export const mapStateToProps = ({ wizard:{currentStep='', steps=[], wizardSettings, mainObject, currentModule,} }) => ({
  currentStep,
  steps,
  wizardSettings,
  mainObject,
  currentModule
})

export const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setStep: (step) => {
      dispatch({
        type: 'setWizard',
        path: 'currentStep',
        data: step
      })
    },
  }
}