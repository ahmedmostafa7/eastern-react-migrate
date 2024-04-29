
import * as actions from './actions'
import { bindActionCreators } from "redux";

export default (dispatch)=>({
    ...bindActionCreators({...actions}, dispatch)
})