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
          label: "الشارع أو الممر فاصل بين أملاك صاحب العلاقة",
          field: "boolean",
          required: true,
        },
        street_morfak: {
          label: "الشارع أو الممر ليس ذات نفع عام أو له صلة المرفق العام",
          field: "boolean",
          required: true,
        },
        street_drr: {
          label: "لا يترتب على ضم الشارع أو الممر ضرر على أحد المنتفعين به",
          field: "boolean",
          required: true,
        },
        amana_benefit: {
          label:
            "يتم تحديد الوسيلة التي تعوض بالفائدة على الأمانة أو البلدية إما بالبيع أو المعاوضة",
          field: "boolean",
          required: true,
        },
      },
    },
  },
};
