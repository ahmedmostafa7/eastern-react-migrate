

export function mapStateToProps({mainApp, global}) {
    return { loading: mainApp.loading || global.loading }
}