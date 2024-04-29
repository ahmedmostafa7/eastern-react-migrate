import { get } from "lodash";

export const mapStateToProps = ({ wizard: {mainObject}, selectors }, ownProps) => {
    return {
        selectors,
        mainObject
    }
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
        setData: (data) => {
            dispatch({
                type: 'setSelectors',
                path: `${moduleName}.data`,
                data
            })
        },
        editData: (index, data) => {
            dispatch({
                type: 'setSelectors',
                path: `${moduleName}.data[${index}]`,
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
        
    }
}