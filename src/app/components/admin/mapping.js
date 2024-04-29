export const mapStateToProps = ({ admin: { apiModules } }) => ({
    apiModules
})

export const mapDispatchToProps = (dispatch) => ({
    setModules(modules) {
        dispatch({
            type: "setAdmin",
            path: "modules",
            data: modules
        })
    },
})