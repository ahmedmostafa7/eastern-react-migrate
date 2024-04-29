export default {
    number: 5,
    label: 'Admission',
    //description: 'this is the Second Step description',
    sections: {
        admit: {
            label: 'Admission',
            type: 'inputs',
            fields: {
                building: {
                    label: 'ان اتكون المخططات وفقا لكود البناء السعودي.',
                    field: 'boolean',
                    required: true
                },
                water: {
                    label: "أن يتم توفير شبكتين لتدوير المياه.",
                    field: 'boolean',
                    required: true
                },
                electric: {
                    label: 'استخدام الجهد الكهربائي (230/400 فولت)',
                    field: 'boolean',
                    required: true
                },
                flow: {
                    label: 'استخدام العزل الحراري',
                    field: 'boolean',
                    required: true
                },
                specials: {
                    label: 'تطبـيـق الإشتـراطـات الـفنية لذوي الاحتياجات الخاصة',
                    field: 'boolean',
                    required: true
                },
                land: {
                    label: 'تسوير كامل الأرض قبل وأثناء فترة إنشاء المشروع.',
                    field: 'boolean',
                    required: true
                },
                typical: {
                    label: 'التأكد من مطابقة مواقع الاعمدة الانشائية في المخططات   النهائية للمشروع لما هو معتمد ضمن المخططات المبدئية المعتمدة و في حال تغيير مواقعها و تأثير ذلك على مواقف السيارات من ناحية حركتها او عددها فان الموافقة تعتبر بذلك ملغية.',
                    field: 'boolean',
                    required: true
                },
                finish: {
                    label: 'اعتماد مواد التـشطيب بأنواعها وألوانها المحددة بالـمـخـطـطـات المبدئية والتأكد من مطابقتها لما تم اعتماده أثناء تنفيذ المشروع',
                    field: 'boolean',
                    required: true
                },

            }
        },
    }
};
