export const mapStateToProps = ({ admin: { modules } }) => ({
    modules
})

export const mapDispatchToProps = (dispatch) =>({
    setCurrentModule(moduleName){
        dispatch({
            type: "setAdmin",
            path: "currentModule",
            data: moduleName
        })
    },
})