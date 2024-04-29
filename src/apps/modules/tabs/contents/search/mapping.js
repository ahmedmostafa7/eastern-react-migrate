import { get } from 'lodash';
import { getFormValues } from 'redux-form';

export const mapStateToProps = (state, ownProps) => {
    const { mainApp } = state;
    return {
        currentApp: mainApp.currentApp || {},
        currentTab: mainApp.currentTab || {},
        apps: mainApp.apps ||[],
        search: mainApp.search,
        filters: mainApp.filters,
        formVals: getFormValues("SearchForm")(state),
        ...mainApp[ownProps.moduleName]
    }
}

export const mapDispatchToProps = (dispatch) => {
    return {
        setSearch: (search) => {
            dispatch({
                type: 'setMainApp',
                path: 'search',
                data: search
            })
        },
        removeSearch: () => {
            dispatch({
                type: 'removeMainApp',
                path: 'search'
            })
        },
        addFilter: (filterName, value) => {
            dispatch({
                type: 'setMainApp',
                path: `filters.${filterName}`,
                data: value
            })
        },
        removeFilter: (filterName, props) => {
            const {filters} = props;
            const {clearField, selectChange} = get(filters, filterName);
            clearField && clearField();
            selectChange && selectChange(null, null, props);
            dispatch({
                type: 'removeMainApp',
                path: `filters.${filterName}`
            })
        },
        removeSelector: (moduleName) => {
            dispatch({
                type: 'removeSelectors',
                path: moduleName
            })
        },
        setData: (data) => {
            dispatch({
                type: 'setMainApp',
                path: 'data',
                data: data
            })
        }
    }
}