export const jsonData = [
  { jsonPath: "ownerData.ownerData.owner_type", name: "owner_type" },
  { jsonPath: "owners_data.owners[*].name", name: "owner_name" },
  { jsonPath: "owners_data.owners[*].ssn", name: "ssn" },
  {
    jsonPath: "owners_data.owners[*].code_regesteration",
    name: "code_regesteration",
  },
  {
    jsonPath: "owners_data.owners[*].commercial_registeration",
    name: "commercial_registeration",
  },
  {
    jsonPath: "landData.landData.lands.parcels[*].attributes.MUNICIPALITY_NAME",
    name: "MUNICIPALITY_NAME",
  },
  {
    jsonPath: "landData.landData.lands.parcels[*].attributes.PLAN_NO",
    name: "PLAN_NO",
  },
  {
    jsonPath: "landData.landData.lands.parcels[*].attributes.PARCEL_PLAN_NO",
    name: "PARCEL_PLAN_NO",
  },
  {
    jsonPath: "landData.landData.lands.parcels[*].attributes.PARCEL_AREA",
    name: "PARCEL_AREA",
  },
  {
    jsonPath: "landData.landData.lands.parcels[*].attributes.Natural_Area",
    name: "Natural_Area",
  },
  {
    jsonPath:
      "suggestParcel.suggestParcel.suggestParcels.polygons.[*].parcel_name",
    name: "Zayda_layerName",
  },
  {
    jsonPath: "suggestParcel.suggestParcel.suggestParcels.polygons.[*].area",
    name: "Zayda_area",
  },
  {
    jsonPath: "suggestParcel.suggestParcel.suggestParcels.temp.shtfa_northeast",
    name: "shtfa_northeast",
  },
  {
    jsonPath:
      "suggestParcel.suggestParcel.suggestParcels.temp.shtfa_northweast",
    name: "shtfa_northweast",
  },
  {
    jsonPath: "suggestParcel.suggestParcel.suggestParcels.temp.shtfa_southeast",
    name: "shtfa_southeast",
  },
  {
    jsonPath:
      "suggestParcel.suggestParcel.suggestParcels.temp.shtfa_southweast",
    name: "shtfa_southweast",
  },
  {
    jsonPath: "suggestParcel.suggestParcel.electricArea",
    name: "electricArea",
  },
  { jsonPath: "krar_amin.karar_amin", name: "karar_amin" },
  { jsonPath: "krar_amin.karar_amin_date", name: "karar_amin_date" },
];

export const columns = {
  id: {
    label: "رقم المسلسل",
    action: "col.no",
    conditionToShow: "true",
  },
  request_no: {
    label: "رقم المعاملة",
    action: "col.request_no",
    conditionToShow: "true",
  },
  create_date: {
    label: "تاريخ انشاء المعاملة",
    action: "col.create_date",
    conditionToShow: "true",
  },
  status: {
    label: "حالة المعاملة",
    action: `((col) => {
      
      return (col.status == 1 && !col.CurrentStep.is_end)
      && "جارية"
      || (col.status == 2 || col.CurrentStep.is_end)
      && "منتهية"
      || (col.status == 3 && !col.CurrentStep.is_end)
      && "معتذر عنها";
    })(col)`,
    conditionToShow: "true",
  },
  // owner_type: {
  //   label: "نوع المالك",
  //   action: "col.json_props[headkey] == 1 ",
  //   conditionToShow: "false",
  // },
  owner_name: {
    label: "اسم المالك",
    action: "col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  ssn: {
    label: "رقم الهوية ",
    action:
      "!col.json_props[headkey][0] ? 'لا يوجد'  : col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  code_regesteration: {
    label: "كود الجهة",
    action:
      "!col.json_props[headkey][0] ? 'لا يوجد'  : col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  commercial_registeration: {
    label: "رقم السجل التجاري",
    action:
      "!col.json_props[headkey][0] ? 'لا يوجد'  : col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  MUNICIPALITY_NAME: {
    label: "البلدية",
    action: "col.json_props[headkey][0]",
    conditionToShow: "true",
  },
  PLAN_NO: {
    label: "رقم المخطط",
    action: "col.json_props[headkey][0]",
    conditionToShow: "true",
  },
  PARCEL_PLAN_NO: {
    label: "رقم قطعة الأرض",
    action: "col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  PARCEL_AREA: {
    label: "مساحة الأرض من الصك",
    action: `col.json_props[headkey].reduce(
        (a, b) => a + (+b || 0),
        0
      ).toFixed(2)`,
    conditionToShow: "true",
  },
  Natural_Area: {
    label: "مساحة الأرض من الطبيعة",
    action: `col.json_props[headkey].reduce(
        (a, b) => a + (+b || 0),
        0
      ).toFixed(2)`,
    conditionToShow: "true",
  },
  Zayda_area: {
    label: "مساحة الزائدة (المساحة)",
    action: `((!_.isEmpty(col.json_props) && col.json_props["Zayda_area"]) || [0])?.reduce((a, b, i) => {
        if (
          ["plus", "notplus", "الزائدة", "الزائده التنظيميه"].indexOf(
            col.json_props["Zayda_layerName"][i]?.toLowerCase()
          ) != -1
        ) {
          a = a + (+b || 0);
        }
  
        return a;
      }, 0)?.toFixed(2)`,
    conditionToShow: "true",
  },
  // shtfa_northeast: {
  //   label: "مساحة الشطفات(الشمال الشرقي)",
  //   action: "col.json_props[headkey].join(' - ')",
  //   conditionToShow: "true",
  // },
  // shtfa_northweast: {
  //   label: "مساحة الشطفات(الشمال الغربي)",
  //   action: "col.json_props[headkey].join(' - ')",
  //   conditionToShow: "true",
  // },
  // shtfa_southeast: {
  //   label: "مساحة الشطفات(الجنوب الشرقي)",
  //   action: "col.json_props[headkey].join(' - ')",
  //   conditionToShow: "true",
  // },
  // shtfa_southweast: {
  //   label: "مساحة الشطفات(الجنوب الغربي)",
  //   action: "col.json_props[headkey].join(' - ')",
  //   conditionToShow: "true",
  // },
  // electricArea: {
  //   label: "غرفة الكهرباء",
  //   action: "col.json_props[headkey].join(' - ') || 0",
  //   conditionToShow: "true",
  // },
  karar_amin: {
    label: "رقم خطاب قرار معالي الأمين",
    action: "(col.json_props['karar_amin_date'][0] && col.request_no) || ''",
    conditionToShow: "true",
  },
  karar_amin_date: {
    label: "تاريخ خطاب قرار معالي الأمين",
    action: "col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  is_paid: {
    label: "حالة الفاتورة",
    action:
      "(col['submission_invoices']?.length && col['submission_invoices']?.find(r => r.is_paid == true)?.is_paid && 'تم الدفع') || 'لم يتم الدفع'",
    conditionToShow: "true",
  },
  invoice_number: {
    label: "رقم الفاتورة",
    action:
      "col['submission_invoices']?.length && col['submission_invoices']?.find(r => r.is_paid == true)?.invoice_number.toString() || ''",
    conditionToShow: "true",
  },
  invoice_date: {
    label: "تاريخ الفاتورة",
    action:
      "col['submission_invoices']?.length && col['submission_invoices']?.find(r => r.is_paid == true)?.invoice_date || ''",
    conditionToShow: "true",
  },
};


