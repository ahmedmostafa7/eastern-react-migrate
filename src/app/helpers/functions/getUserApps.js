import {get, set} from 'lodash';

// export const getUserApps = user => {
//     const apps = {};
//     get(user, "groups", []).map(group =>
//         get(group, "groups_permissions", []).map(group_permissions => {
//             const {
//                 applications: {
//                     name: appName,
//                     ...application
//                 },
//                 apps_modules: {
//                     name: moduleName,
//                     ..._module
//                 },
//                 ...modulePermissions
//             } = group_permissions;
//             !get(apps, appName) && set(apps, appName, application);
//             set(apps, `${appName}.${moduleName}`, { ..._module, ...modulePermissions });
//             console.log(apps, appName, moduleName, _module)
//         })
//     )
//     console.log(apps)
//     return omit(get(apps, 'splitandmerge'), ['portal']);
// }

export const getUserApps = user => {
    const apps = {};
    get(user, "groups", []).map(group =>

        get(group, "groups_permissions", []).map(group_permission => {
            const {
                applications={},
                apps_modules={},
                ...modulePermissions
            } = group_permission;
            if(applications && applications.name){
                get(apps, applications.name) ? set(apps, `${ applications.name}.main`, applications):set(apps, applications.name, applications);
            }
            if(apps_modules && apps_modules.name){
                set(apps, `${applications.name}.${apps_modules.name}`, { ...apps_modules, ...modulePermissions });
            }
        })

    )
    
    return apps;
} 