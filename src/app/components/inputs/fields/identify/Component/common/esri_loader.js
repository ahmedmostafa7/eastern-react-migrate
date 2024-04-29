import esriLoader from 'esri-loader';
const options = {
    url: 'https://js.arcgis.com/3.13'
}

export const LoadModules = (modules)=>{
    return esriLoader.loadModules(modules, options)
}
