const SMSFields = [
    {
        name:'text',
        label:'Message text',
        required:true,
        field:'textArea',
    },
    {
        name:'to_owners',
        label:'Send to owner',
        field:'boolean',
        hideLabel:true,
    },
    {
        name:'to_actor',
        label:'Send to actor',
        field:'boolean',
        hideLabel:true,
    },
    {
        name:'creator',
        label:'Send to creator',
        field:'boolean',
        hideLabel:true,
    },
    {
        name:'action_id',
        label:'Actions',
        moduleName:'TableStepActions',
        required:true,
        field:'select',
        valueType:'steps_actions.actions.name'
    },
]

export const sendSMSFields = [
    ...SMSFields,
    {
        name: 'SMStable',
        field: 'table',
        hideLabel:true,
        tableActions:{
            delete:{
                name: 'delete',
                label: 'Delete',
                title:'Are you sure?',
                type:'danger',
                icon:'question-circle-o',
                color:'red',
                url: `/api/StepSMS/`,
                function: 'deleteFunc',
            }, 
        },
        fields:[ ...SMSFields ]
    }
]