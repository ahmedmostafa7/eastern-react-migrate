export const OWNERS = {
    primaryKey: 'id',
    apiUrl: '/api/owner',
    label: 'Owners',
    singleLabel: 'owner',
    icon: 'global',
    views: ["name", "address", "mobile", "phone", "email"],
    show: 'name',
    search_with:['name'],
    actions_permissions: {
        add: { hide: true },
        edit: { hide: true },
        delete: { hide: true },
    },
    fields: {
        name: { label: 'Name' },
        address: { label: 'Address' },
        mobile: { label: 'Mobile Number',type:'number' },
        phone: { label: 'Phone Number' },
        email: { label: 'Email' },
    }
}