export default {
  label: "sellingConfirmation",
  sections: {
    notes: {
      label: "sellingConfirmation",
      type: "inputs",
      fields: {
        acceptOrReject: {
          field: "radio",
          initValue: "1",
          label: "الموافقة على بيع الزائدة",
          hideLabel: false,
          options: {
            accept: {
              label: "يمكن بيعها",
              value: "1",
            },
            reject: {
              label: "عدم بيعها",
              value: "2",
            },
          },
          required: true,
        },
        details: {
          field: "textArea",
          label: "تفاصيل",
          hideLabel: false,
          rows: "5",
        },
        shatfa_check: {
          label:
            "تم التحقق من خصم مساحة الشطفة من مساحة الزائدة التنظيمية  (إن وجدت)",
          field: "boolean",
          hideLabel: true,
          required: true,
        },
      },
    },
  },
};
