

export const mapDispatchToProps = (dispatch, ownProps) => {
    return {

        setCurrentApp(data){
            dispatch({
                type:'setMainApp',
                path:`currentApp`,
                data:data
            })
        },
        setCurrentTab(currentApp,data){
            dispatch({
                type:'setMainApp',
                path:`currentTab`,
                data:data
            })
        },
    }
}   