import {map,omit} from 'lodash'
export const setMain = (app, data)=>{
    return ({
        type: `set_main${app}`, data
    })
}
export const setData = (app, data) => ({
    type: `set_data${app}`, data
})
export const resetAll = (app, data)=>({
    type: `reset_all${app}`, data
})
export const omitData = (app, data) => ({
    type: `omit_data${app}`, data
})
export const setPath = (app, path, data) => ({
    type: `set_path${app}`, data, path
})

export const appendPath = (app, path, data)=>({
    type: `append_path${app}`, path, data
})

export const dispatchMulti = (dispatch) => {
    return (apps) => {
        const dispatches = map(apps, (d,v)=>({
            type: d.app ? `${d.type}_${d.app}`:d.type,
            ...omit(d, ['type', 'name'])
        }))
        dispatch(dispatches);
    }
}