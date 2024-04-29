import {get} from 'lodash'

export const mapStateToProps = ({ workFlow, selectors}) => ({
    allSteps: workFlow.allSteps,
    openStep: workFlow.openStep,
    dialog: workFlow.dialog,
    workFlowId: get(workFlow, 'allSteps.0.work_flow_id',''),
    selectors,
  })

export const mapDispatchToProps = (dispatch) => {
    return {
        fillSteps:(value) => {
            dispatch({
                type:'setWorkFlow',
                path: 'allSteps',
                data: value
            })
        },
        addStep:(value) => {
            dispatch({
                type:'pushToListWorkFlow',
                path:'allSteps',
                data:value
            })
        },
        changeStep:(value, path) => {
            dispatch({
                type:'setWorkFlow',
                path:`allSteps.${path}`,
                data: value
            })
        },
        setDialog: (dialog) => {
            dispatch({
                type: 'setWorkFlow',
                path: 'dialog',
                data: dialog
            })
        },
        removeDialog: () => {
            dispatch({
                type: 'removeWorkFlow',
                path: 'dialog'
            });
        },
        setSelectData:(data,path) => {
            dispatch({
                type:'setSelectors',
                path:`${path}.data`,
                data
            })
        },
        removeResults:() => {
            dispatch({
                type: 'removeMainApp',
                path: `inputTable.results`,
            })
        }
    }
}