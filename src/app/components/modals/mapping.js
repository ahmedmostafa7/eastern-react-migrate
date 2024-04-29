import {get} from 'lodash'

export const mapStateToProps = ({mainApp}, ownProps) => {
    return({
    modal: mainApp.modal,
    currentTab: mainApp.currentTab,
    // ...get(mainApp.cache, ownProps.moduleName)
})}
