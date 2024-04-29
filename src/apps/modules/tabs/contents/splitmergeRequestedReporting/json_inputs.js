import moment from "moment-hijri";
export const jsonData = [
  {
    jsonPath: "tadkek_data_Msa7y.tadkek_msa7yData.requestType",
    name: "selectedRequestType",
  },
  {
    jsonPath: "owners_data.owners.[*]",
    name: "owners",
  },
  { jsonPath: "letter.letter.letter_date", name: "letter_date" },
  { jsonPath: "landData.landData.lands.parcels", name: "parcels" },
  { jsonPath: "waseka.waseka.table_waseka", name: "table_waseka" },
  {
    jsonPath: "duplix_building_details.duplix_building_details",
    name: "duplix_building_details",
  },
  {
    jsonPath:
      "tadkek_data_Msa7y.tadkek_msa7yData.cadDetails.suggestionsParcels",
    name: "polygons",
  },
  { jsonPath: "approvalSubmissionNotes.notes.notes[0].notes", name: "notes" },
  // { jsonPath: "landData.landData.lands.parcels[0].selectedLands.[*].attributes.PARCEL_PLAN_NO", name: "parcel_plan_no" },
  // { jsonPath: "landData.landData.lands.parcels[0].selectedLands.[*].attributes.MUNICIPALITY_NAME", name: "municipality_name" },
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
  committee_report_no: {
    label: "رقم المحضر",
    action: "col.committee_report_no",
    conditionToShow: "true",
  },
  committee_date: {
    label: "تاريخ المحضر",
    action: "col.committee_date",
    conditionToShow: "true",
  },
  export_no: {
    label: "رقم الصادر",
    action: `col.export_no`,
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
  selectedRequestType: {
    label: "نوع المعاملة",
    action: `((col) => {
      return (col?.json_props[headkey][0] == 1 && "فرز") || (col?.json_props[headkey][0] == 2 && "دمج") || "" ;
    })(col)`,
    conditionToShow: "true",
  },
  creator_name: {
    label: "اسم المنشئ",
    action: "col.CreatorUser.name",
    conditionToShow: "true",
  },
  owner_name: {
    label: "اسم المالك",
    action: `((col) => {
      
      return col.json_props["owners"]?.map(r => r?.name)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  owner_ssn: {
    label: "رقم الهوية الوطنية",
    action: `((col) => {
      return col.json_props["owners"]?.map(r => r?.ssn)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  owner_commercial_registeration: {
    label: "رقم السجل التجاري",
    action: `((col) => {
      return col.json_props["owners"]?.map(r => r?.commercial_registeration)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  mobile: {
    label: "رقم الجوال",
    action: `((col) => {
      return col.json_props["owners"]?.map(r => r?.mobile)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  rid: {
    label: "رقم الهوية العقارية الصادر",
    action: "col.submission_lands_contracts[0].rid",
    conditionToShow: "true",
  },
  municipality_name: {
    label: "أسم البلدية",
    action:
      "col.json_props['parcels'].map(r => r.attributes.MUNICIPALITY_NAME || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  district_name: {
    label: "أسم الحي",
    action:
      "col.json_props['parcels'].map(r => r.attributes.DISTRICT_NAME || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  plan_no: {
    label: "رقم المخطط",
    action:
      "col.json_props['parcels'].map(r => r.attributes.PLAN_NO || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  parcel_block_no: {
    label: "رقم البلك",
    action:
      "col.json_props['parcels'].map(r => r.attributes.PARCEL_BLOCK_NO || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  parcel_plan_no: {
    label: "رقم قطعة الأرض",
    action:
      "col.json_props['parcels'].map(r => r.attributes.PARCEL_PLAN_NO || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  parcel_area_sak: {
    label: "مساحة الأرض من الصك",
    action:
      "col.json_props['parcels'].map(r => (+r.attributes.PARCEL_AREA).toFixed(2) || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  parcel_area_natural: {
    label: "مساحة الأرض من الطبيعة",
    action:
      "col.json_props['polygons'][0].filter(r => r.parcel_name == col.json_props['parcels'][0].attributes.PARCEL_PLAN_NO).map(r => (+r.area).toFixed(2) || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  sak_no: {
    label: "رقم الصك",
    action: `((col) => {
      
      return col.json_props['table_waseka'][0].filter(r => r.selectedLands == col.json_props['parcels'][0].attributes.PARCEL_PLAN_NO).map(r => r.number_waseka || 'غير متوفر').join(' - ')
    })(col)`,
    conditionToShow: "true",
  },
  duplix_licence_number: {
    label: "رقم رخصة البناء",
    action:
      "col.json_props['duplix_building_details'].map(r => r.duplix_licence_number || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  duplix_licence_date: {
    label: "تاريخ رخصة البناء",
    action:
      "col.json_props['duplix_building_details'].map(r => r.duplix_licence_date || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  notes: {
    label: "الملاحظات",
    action: "col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  is_paid: {
    label: "حالة الدفع",
    action:
      "col.submission_invoices?.[(col.submission_invoices?.length - 1) || 0]?.is_paid && 'تم الدفع' || 'لم يتم الدفع'",
    conditionToShow: "true",
  },
  invoice_number: {
    label: "رقم الفاتورة",
    action:
      "col.submission_invoices?.[(col.submission_invoices?.length - 1) || 0]?.invoice_number",
    conditionToShow: "true",
  },
  invoice_date: {
    label: "تاريخ الفاتورة",
    action:
      "col.submission_invoices?.[(col.submission_invoices?.length - 1) || 0]?.invoice_date",
    conditionToShow: "true",
  },
};
