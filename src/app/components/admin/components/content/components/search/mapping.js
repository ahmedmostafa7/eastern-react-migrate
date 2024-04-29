import { get } from 'lodash';

export const mapStateToProps = ({ admin: { modules, currentModule }, filters, search }) => ({
    currentModule: get(modules, currentModule),
    currentModuleKey: currentModule,
    search,
    // filters: crud.filters
})

export const mapDispatchToProps = (dispatch) => {
    return {
        setSearch: (search) => {
            dispatch({
                type: 'setSearch',
                data: search
            })
        },
        removeSearch: () => {
            dispatch({
                type: 'removeSearch',
            })
        },
        // addFilter: (filterName, value) => {
        //     dispatch({
        //         type: 'setFilters',
        //         path: `filters.${filterName}`,
        //         data: value
        //     })
        // },
        // removeFilter: (filterName, props) => {
        //     const {filters} = props;
        //     const {clearField} = get(filters, filterName, {});
        //     clearField && clearField();
        //     dispatch({
        //         type: 'removeMainCrud',
        //         path: `filters.${filterName}`
        //     })
        // },
        // removeSelector: (moduleName) => {
        //     dispatch({
        //         type: 'removeSelectors',
        //         path: moduleName
        //     })
        // },
    }
}