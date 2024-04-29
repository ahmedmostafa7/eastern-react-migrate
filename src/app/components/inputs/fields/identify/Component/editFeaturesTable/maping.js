export const mapStateToProps = state => {
    
    return {
        mainObject: state.wizard.mainObject,
        UploadFileDetails: state.mainApp.uploadFileDetails,
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
        setCurrentMap: (data) => {
            mainMap = data;
            setMap(data);
          },
        setmap: (e) => dispatch({ type: 'setMap', value: e }),
        setEditableFeatures: (e) => {
            dispatch({
                type: 'setMainApp',
                path: 'editableFeatures',
                data: e
            })
        }

    };
}
