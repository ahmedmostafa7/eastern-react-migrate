import * as validations from '../validations'
import { assign, map, get } from 'lodash';

export function serverFieldMapper(field, props) {
    return  assign({}, field, {
            hideLabel: get(field, 'hideLabel', ['boolean'].includes(field.field)),
            validate: map(field, (value, key) => (
                value!=null && !get(field, 'warning', []).includes(key) ? get(validations, key, () => { })(value, field, props) : undefined
            )).filter(f => f),
            warn: map(field, (value, key) => (
                value!=null && get(field, 'warning', []).includes(key) ? get(validations, key, () => { })(value, field) : undefined
            )).filter(f => f)
        })   
}
