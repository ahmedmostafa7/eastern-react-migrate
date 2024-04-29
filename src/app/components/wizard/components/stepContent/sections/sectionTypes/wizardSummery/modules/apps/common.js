import {get, map} from 'lodash'
// export const remark = (stepItem, object)=>{
//     return [{
//         label: 'Remark',
//         type: 'Remark'
//     }]
// }

export const remarks = (stepItem, object)=>{
    return map(stepItem, d=>({
        label: get(d, 'step.name'),
        type: 'Remarks',
        data: d
    }))
}