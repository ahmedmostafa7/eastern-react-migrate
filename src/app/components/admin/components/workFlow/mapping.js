import {get, last} from 'lodash'

export const mapStateToProps = ({ workFlow, selectors}, ownProps) => {
    return({
    allSteps: workFlow.allSteps,
    openStep: workFlow.openStep,
    dialog: workFlow.dialog,
    workFlowId: last(get(ownProps, "history.location.pathname" , "").split('/')),
    selectors,
  })}

export const mapDispatchToProps = (dispatch) => {
    return {
        fillSteps:(data) => {
            dispatch({
                type:'setWorkFlow',
                path: 'allSteps',
                data
            })
        },
        addStep:(data) => {
            dispatch({
                type:'insertInArrayWorkFlow',
                path:'allSteps',
                data
            })
        },
        changeStep:(data, path) => {
            dispatch({
                type:'setWorkFlow',
                path:`allSteps.${path}`,
                data
            })
        },
        setDialog: (data) => {
            dispatch({
                type: 'setWorkFlow',
                path: 'dialog',
                data
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