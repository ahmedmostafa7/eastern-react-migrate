import { set, get, omit, pick } from 'lodash';

export const addValue = (values, params) => {
    return Promise.resolve({ ...values, ...params });
}

export const convertArrayToObjectArray = (values, { field, key, newKey }) => {
    const arr = get(values, field, []) || [];
    return Promise.resolve({
        ...values,
        [newKey || field]: arr.map(d => ({ [key]: d }))
    })
}

export const convertBoolToInt = (values, params) => {
    let newValues = {...values}
    params.map(param => {
        newValues[param] = values[param] ? 1 : 0
    })

    return Promise.resolve({ ...newValues });
}

export const removeValue = (values, params) => {
    return Promise.resolve(omit(values, params));
}

export const persistValue = (values, params, item) => {
    return Promise.resolve({ ...values, ...pick(item, params) });
}

export const addValuesFromSelector = (values, params, item, { selectors }) => {
    let newValues = values;
    params.map(({ moduleName, value_key, valueOf, key }) => {
        const moduleData = get(selectors, `${moduleName}.data`, []);
        const searchFor = get(values, valueOf);
        const found = moduleData.find(elem => get(elem, value_key) == searchFor);
        set(newValues, key, found);
    })
    return Promise.resolve(newValues)
}

export const convertArrayToObjectArrayFromSelectors = (values, params, item, { selectors }) => {
    const { field, moduleName, value_key, key } = params;
    const moduleData = get(selectors, `${moduleName}.data`, []);
    const currentValue = get(values, field, []);
    const items = moduleData.filter(o => currentValue.includes(get(o, value_key)));
    return Promise.resolve({ ...values, [key]: items })
}