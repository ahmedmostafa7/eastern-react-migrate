export const MUNICIPALITIES = {
    primaryKey: 'id',
    apiUrl: '/Municipalities',
    label: 'Municipalities',
    singleLabel: 'municipality',
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
        province_id: {
            label: 'Province',
            disabled: true,
            field: 'select',
            data: [{label:'امانة المنطقة الشرقية', value:1}],
            VALUE:1
        },
    },
}