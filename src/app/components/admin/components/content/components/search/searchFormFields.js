import {get, map} from 'lodash';

export default (currentModule) => ({
    q: {
        placeholder: 'search',
        hideLabel: true,
        required: true
    },
    filter_key: {
        placeholder: 'search in column',
        hideLabel:true,
        required: true,
        data: map(get(currentModule, "search_with"), d => ({ label: get(currentModule, `fields.${d}.label`), value: d }))
    }
})