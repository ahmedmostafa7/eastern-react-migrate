export const jsonData = [
  {
    jsonPath: "owners_data.owners.[*]",
    name: "owners",
  },
  {
    jsonPath: "landData.landData",
    name: "lands",
  },
  {
    jsonPath: "landData.landData.lands.parcels.[0].selectedLands.[*]",
    name: "parcels",
  },
  {
    jsonPath: "landData.landData.lands.parcels.[*]",
    name: "parcels_temp",
  },
  {
    jsonPath: "data_msa7y.msa7yData.cadDetails.suggestionsParcels.[*]",
    name: "parcels_dataMsa7y",
  },
  {
    jsonPath: "afada_adle_statements.afada_adle_statements.table_afada.[*]",
    name: "efadat",
  },
  {
    jsonPath: "afada_adle_statements.afada_adle_statements.letter_number",
    name: "letter_number",
  },
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
    label: "تاريخ إنشاء المعاملة",
    action: "col.create_date",
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
    label: "رقم الهوية",
    action: `((col) => {
      return col.json_props["owners"]?.map(r => r?.ssn)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  owner_commercial_registeration: {
    label: "السجل التجاري",
    action: `((col) => {
      return col.json_props["owners"]?.map(r => r?.commercial_registeration)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  owner_code_regesteration: {
    label: "كود الجهة",
    action: `((col) => {
      return col.json_props["owners"]?.map(r => r?.code_regesteration)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  municipality: {
    label: "البلدية",
    action: `((col) => {
      
      return col.json_props["parcels"]?.map(r => r?.attributes?.MUNICIPALITY_NAME)?.join(' - ')  || col.json_props["parcels_temp"]?.map(r => r?.attributes?.MUNICIPALITY_NAME)?.join(' - ') || col.json_props["lands"]?.map(r => r?.municipality.name)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  parcel_name: {
    label: "أرقام قطع الأراضي",
    action: `((col) => {
      return col.json_props["parcels"]?.map(r => r?.attributes?.PARCEL_PLAN_NO)?.join(' - ') || col.json_props["parcels_temp"]?.map(r => r?.attributes?.PARCEL_PLAN_NO)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  parcel_area: {
    label: "المساحة من الصك",
    action: `((col) => {
      return col.json_props["parcels"]?.map(r => r?.attributes?.PARCEL_AREA)?.join(' - ') || col.json_props["parcels_temp"]?.map(r => r?.attributes?.PARCEL_AREA)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  parcel_area_natural: {
    label: "المساحة من الطبيعة",
    action: `((col) => {
      return col.json_props["parcels_dataMsa7y"]?.map(r => r?.area)?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  final_efada_status: {
    label: "حالة الإفادة النهائية",
    action: `((col) => {
      let status = col.json_props["efadat"]?.[col.json_props["efadat"].length - 1]?.efada_status;
      return status && _.isNumber(+status) && [{
        label: "موافق",
        value: "1",
      }, {
        label: "مرفوض",
        value: "2",
      }]?.find(r => status == r?.value)?.label || status;
    })(col)`,
    conditionToShow: "true",
  },
  final_efada_letter_no: {
    label: "رقم الخطاب الافادة النهائية",
    action: `((col) => {
      return col.json_props["efadat"]?.[col.json_props["efadat"].length - 1]?.letter_number || col.json_props["letter_number"]?.join(' - ');
    })(col)`,
    conditionToShow: "true",
  },
  final_efada_letter_date: {
    label: "تاريخ الخطاب الافادة النهائية",
    action: `((col) => {
      return col.json_props["efadat"]?.[col.json_props["efadat"].length - 1]?.letter_date;
    })(col)`,
    conditionToShow: "true",
  },
};
