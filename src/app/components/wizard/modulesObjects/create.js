export const create_module = {
    name: 'create_module',
    module_id: 1,
    steps: {
        firstStep: {
            number: 1,
            label: 'First step',
            views:['profileData'],
            sections: {
                profileData: {
                    label: 'Profile Data',
                    type: 'inputs',
                    fields: {
                        firstName: {
                            name: 'firstName',
                            label: 'Name',
                            required: true
                        },
                        age: {
                            name: 'age',
                            label: 'Age',
                            required: true,
                            type: 'number'
                        },
                        email: {
                            name: 'email',
                            label: 'Email',
                            type: 'email',
                            emailValid:true,
                            required: true
                        }
                    }
                },
                ownerData: {
                    label: 'Owner Data',
                    type: 'inputs',
                    fields: {
                        firstName: {
                            name: 'firstName',
                            label: 'Name',
                            //required: true
                        }
                    }
                }
            }
        },

        secondStep: {
            number: 2,
            label: 'Second step',
            name: 'secondStep',
            views:['differentInputs','SecondInputs'],
            //description: 'this is the Second Step description',
            sections: {
                differentInputs: {
                    label: 'Different inputs',
                    type: 'inputs',
                    fields: {
                        file: {
                            name: 'file',
                            label: 'Upload file',
                            field: 'simpleUploader',
                            //required: true
                        },
                        choose: {
                            name: 'choose',
                            label: 'choose',
                            field:'select',
                            //required: true,
                            data:[
                                {label:'hey', value:'hey'},
                                {label:'bye', value:'bye'},
                                {label:'halloloya', value:'halloloya'},
                                {label:'nop', value:'nop'},
                                {label:'yup', value:'yup'},
                            ]
                        }
                    }
                },
                SecondInputs: {
                    label: 'Second inputs',
                    type: 'inputs',
                    fields: {
                        address: {
                            name: 'address',
                            label: 'Address',
                            field:'address',
                            //required: true
                        },
                        isIT: {
                            name: 'isIt',
                            label: 'IS it?',
                            field: 'boolean',
                        },
                        radio: {
                            name: 'radio',
                            label: 'well lets try a radio',
                            field:'radio',
                            options:[
                                {label:'secondHey', value:'secondHey'},
                                {label:'plus', value:'plus'},
                                {label:'minus', value:'minus'},
                                {label:'divide', value:'divide'},
                            ]
                        }
                    }
                }
                
            }
        },
        thirdStep: {
            number: 3,
            label: 'Third step',
            name: 'thirdStep',
            //description: 'this is the Third Step description',
            sections: {
                tring: {
                    label: 'dataaaaaa',
                    type: 'inputs',
                    fields: [
                        {
                            name: 'date',
                            label: 'Date',
                            field:'datePicker'
                        },
                        {
                            name: 'multiSelect',
                            label: 'multi select',
                            field:'multiSelect',
                            data:[
                                {label:'awalaan', value:'awalaan'},
                                {label:'thaneyaaaan', value:'thaneyaaaan'},
                                {label:'thalethaan', value:'thalethaan'},
                                {label:'rabe3aaan', value:'rabe3aaan'},
                                {label:'5amesaaan', value:'5amesaaan'},
                                {label:'sadesaaan', value:'sadesaaan'},
                            ]

                        },
                    ]
                },

            }
        },
        summery:{
            number: 4,
            label: 'Summery',
            name: 'summery',
            sections: {
                summery: {
                    name:'summery',
                    label: 'summery',
                    type: 'wizardSummery',
                }
            }
        }
    }
}