let mainMap = undefined;
import { setMap } from 'main_helpers/functions/filters/state'
export const mapStateToProps = state => {

    return {
        mainObject: state.wizard.mainObject,
        UploadFileDetails: state.mainApp.uploadFileDetails,
        editableFeatures: state.mainApp.editableFeatures,
        originalFeatures: state.mainApp.originalFeatures,
        selectMapLayer: state.mainApp.selectMapLayer,
        selectedFeaturesOnMap: state.mainApp.selectedFeaturesOnMap
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
        setMap: (e) => dispatch({ type: 'setMap', value: e }),
        setEditableFeatures: (e) => {
            dispatch({
                type: 'setMainApp',
                path: 'editableFeatures',
                data: e
            })
        },
        setSelectMapLayer: (e) => {
            dispatch({
                type: 'setMainApp',
                path: 'selectMapLayer',
                data: e
            })
        },
        setOriginalFeatures: (e) => {
            dispatch({
                type: 'setMainApp',
                path: 'originalFeatures',
                data: e
            })
        },
        setSelectedFeaturesOnMap: (e) => {
            dispatch({
                type: 'setMainApp',
                path: 'selectedFeaturesOnMap',
                data: e
            })
        }

    };
}
