export const regex = regex => value =>
    value && !regex.test(value) ? 'مدخل غير صحيح' : undefined;

export const digits = isDigits => value => 
    value && isDigits && isNaN(value) ? 'يجب أن يكون رقما' : undefined; 

