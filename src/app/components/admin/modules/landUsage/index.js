
export const LANDUSAGE = {
    primaryKey: 'id',
    apiUrl: '/LandUsage',
    label: 'LandUsages',
    singleLabel: 'LandUsage',
    icon: 'global',
    views: ["name"],
    search_with:['name'],
    show: 'name',
    fields: {
        name: {
            required: true,
            label: 'Name',
        },
    },
}