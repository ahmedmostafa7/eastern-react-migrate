import { get } from 'lodash';

export const mapStateToProps = ({ admin: { modules, currentModule }, selectors }) => ({
    currentModule: get(modules, currentModule),
    currentModuleKey: currentModule,
    selectors
})

export const mapDispatchToProps = (dispatch) => ({
    setDialog(data) {
        dispatch({
            type: "setDialog",
            data: data
        })
    },
    addToTable(data, moduleName) {
        dispatch({
            type: "insertInArraySelectors",
            path: `${moduleName}.data`,
            index: 0,
            data
        })
    }
})