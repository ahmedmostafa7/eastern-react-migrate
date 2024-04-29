export const NATIONALIDTYPES = {
    primaryKey: 'id',
    apiUrl: '/api/NatinalIdTypes',
    label: 'National ID Types',
    singleLabel: 'national ID type',
    icon: 'global',
    views: ["name"],
    search_with:['name'],
    show: 'name',
    fields: {
        name: {
            required: true,
            label: 'Name',
            unique: true
        },
    },
}