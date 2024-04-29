import {get} from 'lodash';
export const mapStateToProps = ({selectors}, ownProps) => ({
    mentions: get(selectors, 'variable.data', []).map(d=>d.name)
})
