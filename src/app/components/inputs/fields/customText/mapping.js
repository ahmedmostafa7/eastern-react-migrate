import { get } from 'lodash';
import {formValueSelector} from 'redux-form'
export const mapStateToProps = ({ selectors = {}, mainApp, mapViewer, ...state }, { moduleName, path, value_key, ...props }) => {
    return ({
    })
}

export const mapDispatchToProps = (dispatch, { moduleName }) => {
    return {
        getValues(name='stepForm'){return formValueSelector('name')},
        
        
    }
}
