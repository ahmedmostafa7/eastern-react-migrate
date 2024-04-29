export const submissionType = (stepItem, object)=>{
    return [{
        label: 'Kroky Data',
        type: 'SubmissionType'
    }]
}

export const building = (stepItem, object)=>{
    return [{
        label: 'Building Data',
        type: 'Building'
    }]
}

export const approvalSubmissionNotes = (stepItem, object)=>{
    return [{
        label: "Notes",
        type: 'approvalSubmissionNotes'
    }]
}

export const project_attachment = (stepItem, object)=>{
    return [{
        label: 'Attachments',
        type: 'ProjectAttachment'
    }]
}
export const committee = (stepItem, object)=>{
    return [{
        label: 'Committee',
        type: 'Committee'
    }]
}

export const sakData = (stepItem, object)=>{
    return [{
        label: 'Saks',
        type: 'SakData'
    }]
}

export const approvals = (stepItem, object)=>{
    return [{
        label: 'Approvals',
        type: 'Approvals'
    }]
}
export const admission = (stepItem, object)=>{
    return [{
        label: 'Admission',
        type: 'Admission',
    }]
}

export const serviceSubmissionType = ()=>([{
    label: 'Submission Data',
    type: 'ServiceSubmissionType'
}])
export const Conditions = ()=>([{
    label: 'Conditions',
    type: 'Conditions'
}])
export const printSetting = ()=>([{
    label: 'printSetting',
    type: 'printSetting'
}])