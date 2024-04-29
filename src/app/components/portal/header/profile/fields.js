export const newPasswordFields = [
    {
        name: 'password',
        type: "password",
        label:'password',
        required: true,
       
    },
    {
        name: 'newPassword',
        label: 'New Password',
        required: true,
        type: "password",

    },
    {
        name: 'confirmNewPassword',
        label: 'Confirm Password',
        type: "password",
        required: true,
        match: 'newPassword'

    },
]