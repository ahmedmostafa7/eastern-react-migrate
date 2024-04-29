export const DEPARTMENTS = {
    primaryKey: 'id',
    apiUrl: '/api/department',
    label: 'Departments',
    singleLabel: 'department',
    icon: 'global',
    views: ["name", "approving_dep"],
    search_with:['name'],
    show: 'name',
    fields: {
        name: {
            required: true,
            label: 'Name',
        },
        approving_dep: {
            label: "جهة معتمدة للمكاتب",
            field: "boolean",
            hideLabel: true
        }
    },
}