import { get } from 'lodash';

export const mapStateToProps = ({ mainApp :{inputTable={}} }) => ({
    ...inputTable
})

export const mapDispatchToProps = (dispatch) => {
    return {
        fillData:(data) => {
            dispatch({
                type:'setMainApp',
                path: `inputTable`,
                data
            })
        },
        removeData:() => {
            dispatch({
                type:'removeMainApp',
                path:'inputTable'
            })
        },
        removeItemInResults:(index) => {
            dispatch({
                type: 'removeMainApp',
                path: `inputTable.results`,
                index
            })
        }
    }
}