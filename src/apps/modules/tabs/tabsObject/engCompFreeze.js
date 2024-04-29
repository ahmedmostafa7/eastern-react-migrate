export const engCompFreeze = ({id:appId}) => ({
    number: 10,
    label: 'EngCompFreeze',
    name: 'engComp',
    moduleName: 'engCompFreeze',
    apiUrl: `EngineeringCompany/GetEngCompByAppId/${appId}`,
    content: { type: 'EngComp' }
})