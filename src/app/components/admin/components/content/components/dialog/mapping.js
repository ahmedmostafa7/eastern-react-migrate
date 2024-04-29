import { getFormValues, getFormMeta } from 'redux-form';


export const mapStateToProps = (state, ownProps) => {
    const meta = getFormMeta(ownProps.form)(state)
    const actives = (meta && Object.keys(meta).find(field => meta[field].active)) || null
    return {
        dialog: state.dialog,
        values: getFormValues(ownProps.form)(state),
        actives
    };
}

// export const mapStateToProps = ({ dialog }) => ({
//     dialog
// })
export const mapDispatchToProps = (dispatch) => ({
    removeDialog() {
        dispatch({
            type: "removeDialog",
        })
    },
})