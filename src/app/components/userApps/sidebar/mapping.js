export const mapStateToProps = ({ mainApp: { apps } }) => ({
    apps
})

export const mapDispatchToProps = (dispatch) => ({
    setCurrentApp(data) {
        dispatch({
            type: 'setMainApp',
            path: 'currentApp',
            data
        });
        dispatch({
            type: "removeMainApp",
            path: "cache",
        });
        dispatch({
            type: "removeMainApp",
            path: "charts",
        });
        dispatch({
            type: "removeMainApp",
            path: "currentTab",
        });
    },
})