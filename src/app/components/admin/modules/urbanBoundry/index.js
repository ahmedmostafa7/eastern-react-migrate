
export const URBANBOUNDRY = {
    primaryKey: 'id',
    apiUrl: '/UrbanBoundry',
    label: 'UrbanBoundries',
    singleLabel: 'UrbanBoundry',
    icon: 'global',
    views: ["name"],
    //deleteMessage:"unable to delete urban boundry because there are submissions using it",
    search_with:['name'],
    show: 'name',
    fields: {
        name: {
            required: true,
            label: 'Name',
        },
    },
}