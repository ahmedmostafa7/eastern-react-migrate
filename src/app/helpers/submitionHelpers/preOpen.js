import { get, findKey } from 'lodash'
export const convertObjectArrayToArray = (values, { field, key, newKey }) => {
    const arr = get(values, field, []) || [];
    return Promise.resolve({
        ...values,
        [newKey || field]: arr.map(d => get(d, key))
    })
}
export const addValueConditional = (values, { key, value = [] }) => {
    const _value = findKey(values, (v, k) => v && value.includes(k))
    return Promise.resolve({
        ...values,
        [key]: _value
    })
}