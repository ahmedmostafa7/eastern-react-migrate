
export const PLANUSAGES = {
    primaryKey: 'id',
    apiUrl: '/PlanUsage',
    label: 'Plan usages',
    singleLabel: 'Plan usage',
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