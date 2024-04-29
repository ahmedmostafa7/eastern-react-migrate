export const jsonData = [
  {
    jsonPath: "landData.landData.lands.parcels.[*].attributes.PARCEL_PLAN_NO",
    name: "parcel_no",
  },
  {
    jsonPath:
      "landData.landData.lands.parcels.[0].attributes.MUNICIPALITY_NAME",
    name: "municipality",
  },
  {
    jsonPath:
      "landData.landData.lands.parcels.[0].attributes.SUB_MUNICIPALITY_NAME",
    name: "sub_municipality",
  },
  {
    jsonPath: "landData.landData.lands.parcels.[0].attributes.DISTRICT_NAME",
    name: "district",
  },
  {
    jsonPath: "landData.landData.lands.parcels.[0].attributes.PLAN_NO",
    name: "planno",
  },
  {
    jsonPath: "landData.landData.lands.parcels.[*].attributes.lat",
    name: "lat",
  },
  {
    jsonPath: "landData.landData.lands.parcels.[*].attributes.long",
    name: "long",
  },
  {
    jsonPath:
      "efada_lands_statements.efada_lands_statements.efada_melkia_aradi",
    name: "efada_lands_status",
  },
  {
    jsonPath:
      "efada_municipality_statements.efada_municipality_statements.efada__invest_activity",
    name: "efada_municipality_status",
  },
  {
    jsonPath:
      "efada_plan_statements.efada_plan_statements.efada__suggested_activity",
    name: "efada_plan_status",
  },
  {
    jsonPath: "landData.landData.lands.parcels.[*].attributes.SITE_ACTIVITY",
    name: "site_activity",
  },
  {
    jsonPath: "investType.invest_type.investType",
    name: "investType",
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
  status: {
    label: "الحالة",
    action: `((col) => {
      
      return (col.status == 1 && !col.CurrentStep.is_end)
      && "جارية"
      || (col.status == 2 || col.CurrentStep.is_end)
      && "منتهية"
      || (col.status == 3 && !col.CurrentStep.is_end)
      && "مرفوضة";
    })(col)`,
    conditionToShow: "true",
  },
  step_name: {
    label: "المرحلة الحالية",
    action: `((col) => {
      
      return col.CurrentStep.name + ([3020, 3021].indexOf(col.CurrentStep.id) != -1 && ' (' + col.json_props['sub_municipality']?.[0] + ')' || "")
    })(col)`,
    conditionToShow: "true",
  },
  creator_user: {
    label: "مقدم الطلب",
    action: `col.CreatorUser.name`,
    conditionToShow: "true",
  },
  municipality: {
    label: "البلدية",
    action: `col.json_props[headkey]?.join(' - ')`,
    conditionToShow: "true",
  },
  sub_municipality: {
    label: "البلدية الفرعية",
    action: `col.json_props[headkey]?.join(' - ')`,
    conditionToShow: "true",
  },
  district: {
    label: "الحي",
    action: `col.json_props[headkey]?.join(' - ')`,
    conditionToShow: "true",
  },
  planno: {
    label: "رقم المخطط",
    action: `col.json_props[headkey]?.join(' - ')`,
    conditionToShow: "true",
  },
  parcel_no: {
    label: "أرقام قطع الأراضي",
    action: `col.json_props[headkey]?.join(' - ')`,
    conditionToShow: "true",
  },
  site_activity: {
    label: "نوع النشاط المقترح",
    action: `col.json_props[headkey]?.join(' - ')`,
    conditionToShow: "true",
  },
  efada_lands_status: {
    label: "إفادة الإدارة العامة للأراضي والممتلكات عن ملكية الارض",
    action: `((col) => {
      return (col?.json_props?.[headkey] == 1 && 'عائدة للأمانة') || (col?.json_props?.[headkey] == 2 && 'غير عائدة للأمانة')
    })(col)`,
    conditionToShow: "true",
  },
  efada_municipality_status: {
    label: "إفادة البلدية على وجود عوائق لطرح الموقع الاستثماري",
    action: `((col) => {
      return (col?.json_props?.[headkey] == 1 && 'يوجد عائق') || (col?.json_props?.[headkey] == 2 && 'لايوجد عائق')
    })(col)`,
    conditionToShow: "true",
  },
  efada_plan_status: {
    label: "إفادة إدارة التخطيط العمراني على النشاط المقترح",
    action: `((col) => {
      return (col?.json_props?.[headkey] == 1 && 'موافق') || (col?.json_props?.[headkey] == 2 && 'مرفوض')
    })(col)`,
    conditionToShow: "true",
  },
  lat: {
    label: "الإحداثيات العشرية",
    action: `((col) => {
      return col?.json_props?.[headkey]?.map((lat, index) => {
        return '[' + lat + ', ' + (col?.json_props?.["long"]?.[index] || "") + ']';
      });
    })(col)`,
    conditionToShow: "true",
  },
  investType: {
    label: "نوع الإستثمار",
    action: ` ((col) => {
      return col.json_props[headkey]?.join(' - ') == 'newLocation'
      ? "طرح موقع استثماري جديد"
      : 'إعادة طرح موقع استثماري';
    })(col)`,
    conditionToShow: "true",
  },
};
