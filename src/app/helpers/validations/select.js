export const maxChoices = (max) => (value) =>
value && value.length > max
    ? `يجب ان تكون ${max} اختيارات او اقل`
    : undefined