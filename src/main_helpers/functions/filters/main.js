import {get, includes, reject, pick,pickBy, min, max, filter, mapValues, 
    isEqual, set, reduce, last, toArray, map, keys as lKeys, flattenDeep, find, 
    every, some, omit, gt, gte, lt, lte, eq, isEmpty} from 'lodash';
import moment from 'moment'
import { getFormValues } from 'redux-form';
const ops = {
    gt,
    gte,
    lt,
    lte,
    eq
}
export const FormValues = (params, data, state, props) => {
  return getFormValues(params.form)(state); // getFormValues(params.form)(state)
};

export function mapSelect(params, data, state){
    return mapValues(params.select, d=>(get(data, d, get(state, d, ''))))
}
export const mapParams = (params, data, state)=>{
    return mapValues(params.params, d=>(get(state, d, d)))
}
export const Selector = (params, data, state)=>{
    return get(data, get(state, params.path), {});
}
export const compare = (params, data, state, props={})=>{
    const val = get(data, params.with)
    const valid = isEqual(params.val, val)
    return val!=undefined && params.not ? !valid:valid
}
export const Comparing = (params, data, state, props={})=>{
    const valid = isEqual(params.val, get(state, params.path, ''))
    return valid
}
export const StateSelector = (params, data, state)=>{
    return get(state, params.path, '');
}
export const StateSelectorCompare = (params, data, state)=>{
    const op = get(ops, params.op, ops.eq)
    
    return op(get(state, params.path, ''), params.compare);
}
export const path = (params, data, state)=>{
    return get(state, params.path, '');
}
export const GetDataSelector = (params, data, state, props={})=>{
    return get(data || props.data, params.show, '');
}
export const PartialSelector = (params, data, state, props = {})=>{
    return pick(get(data, get(state, params.path), {}), params.names || (props.fields||[]).map(d=>d.name));
}
export const List = (params, data, state)=>{
    return filter(data, mapSelect(params, data, state))
}
export const Match = (params, data, state)=>{
    return find(data, mapSelect(params, data, state)) || {}
}
export const FindFromState = (params, data, state)=>{
    return find(data, mapSelect(params, data, state))
}
export const Filter = (params, data, state)=>{
    return filter(data, mapParams(params, data, state))
}
export const FilterIncludes = (params, data, state)=>{
    return filter(data, (d) => every(params.params , (p,k) =>{ 
        return get(d,k) ? get(d,k,"").toString().includes(`${p}`) : false
    }))
}
export const pickingBy = (params, data, state) => {
    return pickBy(data, mapParams(params, data, state))
}
export const Last = (params, data, state) => {
    return last(toArray(data), params.params)
}
export const ListIncludes = (params, data)=>{
    return pickBy(data, d => params.selector.includes(get(d, params.match,'')))
}
export const RejectList = (params, data, state)=>{
    return reject(data, mapSelect(params, data, state))
}
export const Reject = (params, data, state)=>{
    return reject(data, mapParams(params, data, state))
}
export const FindOne = (params, data, state)=>{
    return find(data, mapSelect(params, data, state))
}
export const Find = (params, data, state)=>{
    return find(data, mapParams(params, data, state))
}
export const keys = (params, data, state) => {
    return reduce(data, (o, v) => {
        set(o, `${map(params.levels, d => (get(v, d, ''))).join('.')}`, get(v, params.select, v));
        return o
    }, {})
}
export const mapObjectToArray = (params, data, state, index=0, end=params.length-1, extra={})=>{
    return map(data, (d, k)=>(
        index < end ? [...mapObjectToArray(params, d, state, index+1, end, {[params[index]]: k, ...extra})]:{...d, [params[index]]: k, ...extra})
    )
}
export const reverseKeys = (params, data, state)=>{
    const keys = params.levels;
    return flattenDeep(mapObjectToArray(keys, data, state));
}
export const selectFromState = (params, data, state, ks=lKeys(params), index=0, end=ks.length) =>{
    if(end == index){
        return data;
    }
    const key = ks[index];
    index = index+1;
    const select = get(params, `${key}.select`, params[key])
    return selectFromState(params, get(state, `${key}.data.${get(data, select, get(state, select, ''))}`), state, ks, index, end);

}
export const selectMultiFromState = (params, data, state, ks=lKeys(params), index=0, end=ks.length, out) =>{
    if(end == index){
        return out;
    }
    const key = ks[index];
    index = index+1;
    const d = get(state, `${key}.data.${get(data, get(params, `${key}.select`, params[key]), '')}`)
    return selectMultiFromState(params, d , state, ks, index, end, {...out, [key]: d});

}
export function chain(params, data, state, props={}){
    const out = selectFromState(params.selectors, props.data || data, state)
    return out
}
export function chainMulti(params, data, state){
    const out = selectMultiFromState(params.selectors, data, state)
    return out
}
export const ListInside = (params, data, state, props)=>{
    return filter(data, d=>{
        return isEqual(get(state, params.compare, get(props.data, params.compare)), get(chain(params, d, state), params.select, 'id'))
    })
}
export const Includes = (params, data, state, props)=>{
    const i_data = map(props.data || get(state, params.compare, []), d=>(get(d, params.pick, d)))
    
    return filter(data, d=>{
        return includes(i_data, get(d, params.select))
    })
}

export const IncludesOne = (params, data, state, props)=>{
    return filter(data, d=>{
        return every(mapValues(params.params, (v, k)=>(get(d, k, []).includes(v))))
    })
}

export const childData = (params, data, state)=>{
    const list = get(state, `${params.redux}.data`, {})
    return filter(list, mapSelect(params, data, state))
}

export const joining = (params, data, state, props)=>{
    return params.select.map(d=>props.applyFilters(d, data, state, props)).join(params.joins || ' - ')
}
export const multiData = (params, data, state, props)=>{
    return reduce(params.cols, (o, d, index)=>({
        ...o,
        [d.name || index]: props.applyFilters(d, get(state, `${d.reduxName || d.name}.data`, {}), state, {...props, extra: o})
    }), {})
}
export const includeAny = (params, data, state, props)=>{
    let listData = get(state, `${params.reduxName}.data`, props.data)
    listData = filter(listData, params.filters)
    return some(params.func, d=>(someData(d, listData, state, props)) )
}
const getChainedData = (cols={}, data, state, props, out={}) => {
    const key = cols.reduxName;
    out = {...out, [key]: props.applyFilters(cols, get(state, `${key}.data`, {}), state, props)}
    if(cols.child){
        return getChainedData(cols.child, data, state, props, out)
    }
    return out
}
export const chainChildData = (params, data, state, props)=>{
    return getChainedData(params.cols, data, state, props);
}
export const everyFilter = (params, data, state, props)=>{
    return every(params.func, (d)=>(!!props.applyFilters(d, data, state, props)))
}
export const everyData = (params, data, state, props)=>{
    return every(data, (d)=>(!!props.applyFilters(params.func, d, state, props)))
}
export const someData = (params, data, state, props)=>{
    return some(data, (d)=>(!!props.applyFilters(params.func, d, state, props)))
}
export const anyFilter = (params, data, state, props)=>{
    return some(params.func, (d)=>(!!props.applyFilters(d, data, state, props)))
}

export const picking = (params, data, state, props)=>{
    const ids = map(get(state, params.pick, props.data || data), d=>(get(d, params.select, d)))
    return pick(get(state, `${params.reduxName}.data`, data), ids)
}

export const pickMax = (params, data, state, props)=>{
    return max(map(data, d=>(get(d, params.select))))
}

export const pickMin = (params, data, state, props)=>{
    return min(map(data, d=>(get(d, params.select))))
}

export const DateBetween = (params, data, state, props)=>{
    return filter(data, d => moment(get(d, params.compare)).isBetween(params.date.start, params.date.end))
}
export const sameDate = (params, data, state)=>{
    return filter(data, d=>(isEqual(moment(get(state, params.compare)).format(params.format), moment(get(d, params.select)).format(params.format))))
}
export const dateRanged = (params, data, state)=>{
    const start = get(state, params.start) ? moment(get(state, params.start)).format(params.format):''
    const end = get(state, params.end) ? moment(get(state, params.end)).format(params.format):start
    return filter(data, d=>{
        const mainDate = moment(get(d, params.select)).format(params.format);
        return mainDate >= start && mainDate <= end
    })
}

export const ShowBUOM = (params, data, state, props)=>{
    const d = get(props, `data.${params.select}`, '')
    let UOM = get(data, d, {});
    if(UOM.is_universal){
        UOM = find(data, {_type: UOM._type, is_base: true})
    }
    return get(UOM, params.show, '')
}

export const UOMConvert = (params, data, state, props={})=>{
    const s_u = get(props.data, 'stock_unit', '')
    const r_u = get(props.data, 'recipe_unit', '')
    return `${get(data, `${s_u}.${params.show}`, '??')} = ${get(props.data, 'recipe_unit_ratio', '??')} x ${get(data, `${r_u}.${params.show}`, '??')}`
}

export const matchDifferent = (params, data, state, props={})=>{
    
    const fullData = get(state, `${params.fullData}.data`, {});
    let picker = get(state, `${params.path}.data`)

    if(params.filter) {
        const filter = get(state, `${params.filter}`)
        picker = filter ? pickBy(picker, p => filter.includes(get(p, params.filter_key, p.id))) : {}
    }
    const filteredData = map(picker, f => get(f, params.pick))
    
    return pick(fullData, filteredData)
    
    
}

export const notMatchDifferent = (params, data, state, props={})=>{
    
    let fullData =get(state, `${params.fullData}.data`, {});
    let filteredData = map(get(state, `${params.path}.data`), f => get(f, params.pick))
    
    return omit(fullData, filteredData)
    
    
}