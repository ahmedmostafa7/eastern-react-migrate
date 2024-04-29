export const POSITIONS = {
    primaryKey: 'id',
    apiUrl: '/api/position',
    label: 'Positions',
    singleLabel: 'position',
    icon: 'global',
    views: ["name"],
    search_with:['name'],
    show: 'name',
    fields: {
        name: {
            required: true,
            label: 'Name',
            // unique: true
        },
    },
}