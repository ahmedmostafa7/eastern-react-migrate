import { get } from 'lodash';
import {formValueSelector} from 'redux-form'
export const mapStateToProps = ({ wizard: {mainObject}, selectors = {}, mainApp, mapViewer, ...state }, { moduleName, path, value_key, ...props }) => {
    return ({
        mainObject: {...mainObject},
    })
}

export const mapDispatchToProps = (dispatch, { moduleName }) => {
    return {
        getValues(name='stepForm'){return formValueSelector('name')},        
    }
}
