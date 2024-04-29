export const showFields = {
    request_no: {
        label: 'Request No',
    },
    step_name: {
        show: 'currentStep.name',
        label: 'Step Name'
    },
    
}
export default {
    permissions:{
     owner_key:{show_match_value:{searchWith:'owner_key'}}
    },
    fields: [{
            label: "search1",
            name: "searchWith",
            required: true,
            field: 'select',
            data: [{
                    value: 'request_no',
                    label: 'رقم المشروع'
                },
                {
                    value: 'PARCEL_PLAN_NO',
                    label: 'رقم الارض'
                },
                {
                    value: 'committee_report_no',
                    label: 'رقم المحضر'
                },
                {
                    value: 'owner_key',
                    label: 'بيانات المالك'
                },

            ]
        },
        {
            label: "search2",
            name: "owner_key",
            required: true,
            field: 'select',
            data: [{
                    value: '1',
                    label: 'رقم الهوية'
                },
                {
                    value: '2',
                    label: 'كود الجهة'
                },
                {
                    value: '3',
                    label: 'رقم السجل التجارى'
                },
                {
                    value: '4',
                    label: 'اسم المالك'
                }
            ]
        },
        {
            label: "word",
            name: "searchWord",
            
        },
        {
            label: "from",
            name: "from_date",
            field: 'hijriDatePicker',
            lessThanToday:true,
          
        },
        {
            label: "to",
            name: "to_date",
            field: 'hijriDatePicker',
            lessThanToday:true,
           
        },




    ]
}