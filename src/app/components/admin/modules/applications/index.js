export const APPLICATIONS = {
    primaryKey: 'id',
    apiUrl: '/Applications',
    label: 'Applications',
    singleLabel: 'application',
    icon: 'global',
    views: ["translate_ar_caption", "max_request_no"],
    hide_edit: ["translate_ar_caption"],
    search_with:['name'],
    show: 'translate_ar_caption',
    actions_permissions: {
        add: { hide: true },
        delete: { hide: true },
    },
    fields: {
        translate_ar_caption: {
        label: "Name"
        },
        max_request_no: {
            label: "Maximum Number of Requests",
            field: "inputNumber",
        }
    },
}