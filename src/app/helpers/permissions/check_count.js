export const check_count = (value = {}, params)=>
{
    return params.check.includes(value[params.name])
} 

