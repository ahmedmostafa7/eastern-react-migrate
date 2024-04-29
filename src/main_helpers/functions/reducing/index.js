import {get} from 'lodash'
import * as funs from './main'

export default (fun, field, index, list, values, props)=>{
    return get(funs, fun.key, d=>null)(field, index, list, values, props)
}