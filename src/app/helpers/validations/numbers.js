import {gte, gt, lte, lt, eq, get} from 'lodash'
const op = {
    gte,
    gt,
    lte,
    lt,
    eq
}
const msg = {
    gte: "المدخل اقل من",
    lte: "المدخل اكبر من",
    gt: "المدخل اقل من",
    lt: "المدخل اكبر من",
    eq: "المدخل لا يساوي",
}
export const compare = (params, field, props)=>(value, values)=>{
    const mainOp = get(op, params.op, op.eq)
    const path = [params.compare, props.index, params.col].join('.')
    const val = get(values, path)
    // console.log(values, props, path);
    return mainOp(value, val) ? undefined:`${get(msg, params.op, op.eq)} ${val}`
}

export const maxValue = max => value =>
value && value > max
    ? `يجب ان تكون القيمة اقل من ${max}`
    : undefined

export const minValue = min => value =>
(value && value < min)
    ? `القيمة يجب ان تكون اكبر من ${min}`
    : undefined

export const precision = precision => value => {
    const afterDot = value? value.toString().split('.')[1] : undefined; 
    return value && afterDot && afterDot.length > precision? 
`يجب ان تكون الدقة ${precision} او اقل` : undefined
}

export const scale = scale => value => { 
    return value && value.toString().replace('.', '').length > scale? 
`يجب ان يكون المقياس ${scale} او اقل` : undefined
}
