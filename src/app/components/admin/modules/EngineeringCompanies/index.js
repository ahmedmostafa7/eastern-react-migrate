export const ENGINEERING_COMPANIES = {
    primaryKey: 'id',
    apiUrl: '/EngineeringCompanies',
    label: 'Engineering Companies',
    singleLabel: 'engineering company',
    icon: 'global',
    views: ["name", "register_no", "office_phone", "fax", "email", "engineer_phone"],
    show: 'name',
    search_with:['name', "email"],
    // actions_permissions: {
    //     add: { hide: false },
    //     edit: { hide: false },
    //     delete: { hide: false },
    // },
    fields: {
        name: { 
            label: 'Name', 
            required:true,
            maxLength:80, 
        },
        register_no: { 
            label: 'Engineering License Number', 
            required:true,
            maxLength:15  
        },
        office_phone: { 
            label: 'Office Phone Number', 
            required:true,
            maxLength:15 
        },
        fax: { 
            label: 'Fax Number', 
            required:true,
            maxLength:15  
        },
        engineer_phone: { 
            label: 'Planning Engineer Phone Number', 
            required:true ,
            maxLength:15 
        },
        email: { 
            label: 'Email Address', 
            required:true,
            emailValid: true,
            placeholder: "Ex example@example.com" 
        },
    }
}