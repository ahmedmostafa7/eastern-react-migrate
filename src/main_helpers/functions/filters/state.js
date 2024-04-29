import {get, filter, mapValues, includes, pick, set, reduce, map} from 'lodash';

export function mapSelect(params, data, state){
    return mapValues(params.select, d=>(get(state, d)))
}
export const Selector = (params, data, state)=>{
    return get(data, get(state, params.path), {});
}
export const GetDataSelector = (params, data, state)=>{
    return get(data, params.show, '');
}

export const PartialSelector = (params, data, state, props = {})=>{
    return pick(get(data, get(state, params.path), {}), props.names || props.fields.map(d=>d.name));
}
export const List = (params, data, state)=>{
    return filter(data,mapSelect(params, data, state))
}

export const ListInside = (params, data, state)=>{
    const Filters = mapValues(params.filters, d=>{
        const rData = get(state, `${d.redux}.data`, {});
        return filter(rData, mapSelect(d, rData, state)).map(v=>get(v, v.get, v))
    })
    const fList = get(Filters, params.main.from);
    return filter(data, d=>(includes(fList, get(d, params.main.key))))
}
export const keys = (params, data, state)=>{
    return reduce(data, (o, v)=>{
        set(o, `${map(params.level, d=>(get(v, d, ''))).join('.')}`, v);
        return o
    }, {})
}

let globalMap = undefined;
let isMapLoaded = false;
export const setMap = (map)=>{
    globalMap = map;
    setIsMapLoaded(!globalMap ? false : true);
}

export const getMap = ()=>{
    return globalMap;
}

export const getIsMapLoaded = ()=>{
    return isMapLoaded;
}

export const setIsMapLoaded = (loadState)=>{
   isMapLoaded  = loadState;
}


