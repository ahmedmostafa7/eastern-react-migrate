import { get } from 'lodash';

export const mapStateToProps = ({ admin: { modules, currentModule }, selectors, search }) => ({
    currentModule: get(modules, currentModule),
    currentModuleKey: currentModule,
    ...get(selectors, currentModule),
    selectors,
    search
})

export const mapDispatchToProps = (dispatch) => ({
    setSelector(data, moduleName) {
        dispatch({
            type: 'setSelectors',
            path: moduleName,
            data
        })
    },
    addToData(data, links, moduleName) {
        dispatch({
            type: 'insertInArraySelectors',
            path: `${moduleName}.data`,
            index: -1,
            data
        });
        dispatch({
            type: 'setSelectors',
            path: `${moduleName}.links`,
            data: links
        });
    },
    setDialog(data) {
        dispatch({
            type: "setDialog",
            data: data
        })
    },
    editItemInTable(data, index, moduleName) {
        dispatch({
            type: "insertInArraySelectors",
            operation: "rewrite",
            path: `${moduleName}.data`,
            index,
            data
        })
    },
    deleteItemInTable(index, moduleName) {
        dispatch({
            type: "removeSelectors",
            path: `${moduleName}.data`,
            index
        })
    },
    fillSteps:(value) => {
        dispatch({
            type:'setWorkFlow',
            path: 'allSteps',
            data: value
        })
    },
})