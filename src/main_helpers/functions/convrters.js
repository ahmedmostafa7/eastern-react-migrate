export const convertApiPath = (api) => {

    return (api).replace(/-/g, '_').replace(/\//g,'__');
}