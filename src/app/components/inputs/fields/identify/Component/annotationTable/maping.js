export const mapStateToProps = state => {
    return {
        mainObject: state.wizard.mainObject,
        UploadFileDetails: state.mainApp.uploadFileDetails,
        map: state.map,
        editableFeatures: state.mainApp.editableFeatures
    };
}


export const mapDispatchToProps = dispatch => {
    return {
        setLoading: (data) => {
            dispatch({
                type: 'setMainApp',
                path: 'loading',
                data
            })
        },
        setmap: (e) => dispatch({ type: 'setMap', value: e }),
        setUploadFileDetails: (e) => {
            dispatch({
                type: 'setMainApp',
                path: 'uploadFileDetails',
                data: e
            })
        },
        setEditableFeatures: (e) => {
            dispatch({
                type: 'setMainApp',
                path: 'editableFeatures',
                data: e
            })
        }
    };
}
