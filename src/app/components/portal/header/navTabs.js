export default [
    {
        name: 'main',
        label: 'Home',
        path: '/',
    },
    {
        name: 'myApps',
        label: 'Applications',
        path: '/apps',
        permission: { show_every_props: ['user', 'apps'] }
    },
    {
        name: 'admin',
        label: 'Administration',
        path: '/administration',
        permission: { show_every_props: ['user', 'admin'] }
    },
    {
        name: 'contactUs',
        label: 'Contact us',
        path: '/contactus'
    }
]