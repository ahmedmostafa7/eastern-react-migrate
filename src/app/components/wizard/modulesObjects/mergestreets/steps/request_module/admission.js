export default {
  number: 5,
  label: "Admission",
  //description: 'this is the Second Step description',
  sections: {
    admit: {
      label: "Admission",
      type: "inputs",
      fields: {
        street_separate: {
          label: "أن يكون الشارع أو الممر فاصل بين أملاك صاحب الطلب",
          field: "boolean",
          required: true,
        },
        transport_cost: {
          label:
            "إلتزام المالك بتحمل كافة تكاليف النقل و إزالة خدمات البنية التحتية إن وجدت وبالتنسيق مع الجهات المعنية",
          field: "boolean",
          required: true,
        },
      },
    },
  },
};
