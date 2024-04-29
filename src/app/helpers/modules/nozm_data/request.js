export default {
    number: 2,
    label: 'بيانات مقدم الطلب',
    sections: {
       requestData: {
            label: 'بيانات الطلب',
            type: 'inputs',
            fields: {
                requester_name: {
                    label: 'اسم مقدم الطلب',
                    maxLength: 60,
                    required: true
                },
                requester_national_id: {
                    label: 'رقم الهويه',
                    placeholder: "Ex 9660000000000",
                    digits: true,
                    maxLength: 14,
                    isFixed: true,
                    required: true
                },
                requester_mobile: {
                    label: 'رقم الجوال',
                    placeholder: "Ex 9660000000000",
                    digits: true,
                    maxLength: 12,
                    isFixed: true,
                    required: true
                },
                requester_email: {
                    label: 'البريد الالكترونى',
                    maxLength: 60,
                    required: true
                },
                request_letter: {
                    label: 'خطاب طلب البيانات',
                    hideLabel: true,
                    field: 'simpleUploader',
                    uploadUrl: 'http://192.168.4.103/uploadMultifiles/',
                    fileType: 'image/*,.pdf',
                    multiple: true,
                    required: true
                },
            
            }
        },
      
    
    }
}
