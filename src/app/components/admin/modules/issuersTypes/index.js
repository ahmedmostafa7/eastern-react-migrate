export const ISSUERS_TYPE = {
    primaryKey: 'id',
    apiUrl: '/api/issuerstype',
    label: 'Issuers Types',
    singleLabel: 'issuer type',
    icon: 'global',
    views: ["name", "contract_credence", "elec_credence", "water_credence", "procuration_credence"],
    show: 'name',
    search_with:['name'],
    fields: {
        name: {
            required: true,
            label: 'Name',
            unique: true
        },
        contract_credence:{
            field:'boolean',
            label:'Contracts Credence',
        },
        elec_credence:{
            field:'boolean',
            label:'Electrical Credence',
        },
        water_credence:{
            field:'boolean',
            label:'Water Credence',
        },
        procuration_credence:{
            field:'boolean',
            label:'Procuration Credence',
        },
    },
}