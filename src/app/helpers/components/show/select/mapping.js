import { get } from 'lodash';
export const mapStateToProps = ({ selectors = {}, mainApp, mapViewer, ...state }, { moduleName, path, value_key, ...props }) => {
    return ({
        data: props.field.data || get(state, path),
        lang: mainApp.language,
        selectors,
        apps: mainApp.apps,
        info: get(mapViewer, 'info.info', {}),
        ...selectors[moduleName] || {},
        value_key: get(selectors[moduleName], 'value_key', value_key)
    })
}

export const mapDispatchToProps = (dispatch, { moduleName }) => {
    return {
        setSelector: (moduleName, data) => {
            dispatch({
                type: 'setSelectors',
                path: `${moduleName}`,
                data
            });
        },
        setValueLabelKeys: (label_key, value_key) => {
            dispatch({
                type: 'setSelectors',
                path: `${moduleName}.label_key`,
                data: label_key
            });
            dispatch({
                type: 'setSelectors',
                path: `${moduleName}.value_key`,
                data: value_key
            });
        },
        setData: (data) => {
            dispatch({
                type: 'setSelectors',
                path: `${moduleName}.data`,
                data
            })
        },
        setChildData: (field, data) => {
            field.data = data;
            dispatch({
                type: 'setSelectors',
                path: `${field.moduleName}.data`,
                data
            })
        },
        addToData: (data, index, operation) => {
            dispatch({
                type: 'insertInArraySelectors',
                path: `${moduleName}.data`,
                operation,
                index,
                data
            })
        },
        setNextUrl: (nextUrl) => {
            dispatch({
                type: 'setSelectors',
                path: `${moduleName}.links.nextLink`,
                data: nextUrl
            })
        },
        addNewSelector: (moduleName, data) => {
            dispatch({
                type: 'setSelectors',
                path: moduleName,
                data
            })
        },
        removeSelector: (moduleName) => {
            dispatch({
                type: 'removeSelectors',
                path: moduleName
            })
        },
        setCurrentModule: (data) => {
            dispatch({
                type: 'setWizard',
                path: "currentModule",
                data
            })
        },
        removeMainObject: () => {
            dispatch({
                type: 'removeWizard',
                path: 'mainObject'
            });
            dispatch({
                type: 'removeWizard',
                path: 'currentStep'
            });
            dispatch({
                type: 'removeWizard',
                path: 'comments'
            });
            dispatch({
                type: 'removeWizard',
                path: 'allNotes'
            });
        },
        
    }
}
