import { every, get, some } from 'lodash';

export const ObjectsHas = params => (value) => {
    return every(value, o => every(params, k => get(o, k, false))) ? undefined : "Required"
}

export const ObjectHasLength = params => (value) => {
    return every(params, p => get(value, p, []).length > 0 ) ? undefined : "Required"
}

export const ObjectHasOne = params => (value) => {
    return some(value, o => some(params, k => get(o,k,false))) ? undefined : "Required"
}