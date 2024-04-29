import {viewStep, editStep, sendSMS} from '../functions/stepsFunctions'

const defaultStyling = {
    shape: 'circle',
    style:{margin:'0 5px 0px 5px'}
}

export const stepIcons = [
    {
        name: 'view',
        icon: 'eye',
        ...defaultStyling,
        action() { viewStep(this.props)}
    },
    {
        name: 'edit',
        icon: 'edit',
        ...defaultStyling,
        action() { editStep(this.props) },
        
    },
    // {
    //     name: 'message',
    //     icon: 'mail',
    //     ...defaultStyling,
    //     action() { sendSMS(this.props) }
    // },
]