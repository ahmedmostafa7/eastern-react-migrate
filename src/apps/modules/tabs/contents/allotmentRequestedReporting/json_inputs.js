import moment from "moment-hijri";
export const jsonData = [
  {
    jsonPath: "destinationData.destinationData.entity.name",
    name: "entity_name",
  },
  {
    jsonPath: "destinationData.destinationData.entity_type_id",
    name: "entity_type",
  },
  {
    jsonPath: "letter.letter.letter_no",
    name: "letter_no",
  },
  { jsonPath: "letter.letter.letter_date", name: "letter_date" },
  { jsonPath: "landData.landData.lands.parcels[0].selectedLands.[*]", name: "parcels" },
  { jsonPath: "destinationData.allotment_type.type", name: "allotment_type" },
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
  create_date: {
    label: "تاريخ انشاء المعاملة",
    action: "col.create_date",
    conditionToShow: "true",
  },
  entity_name: {
    label: "الجهة المستفيدة",
    action: "col.json_props[headkey][0]",
    conditionToShow: "true",
  },
  entity_type: {
    label: "نوع الجهة المستفيدة",
    action: `((col) => {
      
      return [
        { label: "حكومي", value: 1 },
        { label: "مركز أهلي", value: 2 },
        { label: "جمعيات خيرية", value: 3 },
      ]?.find(r => r.value == col.json_props[headkey][0])?.label;
    })(col)`,
    conditionToShow: "true",
  },
  letter_no: {
    label: "رقم طلب الجهة المستفيدة",
    action: "col.json_props[headkey][0]",
    conditionToShow: "true",
  },
  letter_date: {
    label: "تاريخ طلب الجهة المستفيدة",
    action: "col.json_props[headkey][0]",
    conditionToShow: "true",
  },
  municipality_name: {
    label: "اسم المدينة أو القرية",
    action: "col.json_props['parcels'].map(r => r.attributes.MUNICIPALITY_NAME || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  district_name: {
    label: "الحي",
    action: "col.json_props['parcels'].map(r => r.attributes.DISTRICT_NAME || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  subdivision_type: {
    label: "نوع التقسيم",
    action: "col.json_props['parcels'].map(r => r.attributes.SUBDIVISION_TYPE || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  subdivision_description: {
    label: "اسم التقسيم",
    action: "col.json_props['parcels'].map(r => r.attributes.SUBDIVISION_DESCRIPTION || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  parcel_block_no: {
    label: "رقم البلك",
    action: "col.json_props['parcels'].map(r => r.attributes.PARCEL_BLOCK_NO || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  parcel_plan_no: {
    label: "رقم قطعة الأرض",
    action: "col.json_props['parcels'].map(r => r.attributes.PARCEL_PLAN_NO || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  parcel_area: {
    label: "المساحة م2",
    action: "col.json_props['parcels'].map(r => r.attributes.PARCEL_AREA || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  srvc_subtype: {
    label: "الغرض من التخصيص",
    action: "col.json_props['parcels'].map(r => r.attributes.SRVC_SUBTYPE + ' ( ' + r.attributes.DETAILED_LANDUSE + ' )' || 'غير متوفر').join(' - ')",
    conditionToShow: "true",
  },
  allotment_type: {
    label: "نوع التخصيص",
    action: "col.json_props[headkey][0]",
    conditionToShow: "true",
  },
  allotment_krar_no: {
    label: "رقم قرار التخصيص",
    action: `((col) => {
      
      let aminSignIndex = col?.submission_history?.findLastIndex(
        (step) => [2999].indexOf(step.step_id) != -1
      );

      let krarPrintIndex = col?.submission_history?.findLastIndex(
        (step) => [3000].indexOf(step.step_id) != -1
      );
  

      let aminStepDate;
      if (
        (krarPrintIndex == -1 && aminSignIndex != -1) ||
        (krarPrintIndex > -1 &&
          aminSignIndex > -1 &&
          krarPrintIndex > aminSignIndex &&
          krarPrintIndex - aminSignIndex == 1)
      ) {
        aminStepDate = col?.submission_history?.[aminSignIndex]?.created_date;
      }

      return aminStepDate;
    })(col) && col.request_no || ''`,
    conditionToShow: "true",
  },
  allotment_date: {
    label: "تاريخ قرار التخصيص (الهجري)",
    action: `((col) => {
      
      let aminSignIndex = col?.submission_history?.findLastIndex(
        (step) => [2999].indexOf(step.step_id) != -1
      );

      let krarPrintIndex = col?.submission_history?.findLastIndex(
        (step) => [3000].indexOf(step.step_id) != -1
      );
  

      let aminStepDate;
      if (
        (krarPrintIndex == -1 && aminSignIndex != -1) ||
        (krarPrintIndex > -1 &&
          aminSignIndex > -1 &&
          krarPrintIndex > aminSignIndex &&
          krarPrintIndex - aminSignIndex == 1)
      ) {
        aminStepDate = col?.submission_history?.[aminSignIndex]?.created_date;
      }

      return aminStepDate;
    })(col)`, //"col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  allotment_date_georg: {
    label: "تاريخ قرار التخصيص (الميلادي)",
    action: `((col, moment) => {
      
      let aminSignIndex = col?.submission_history?.findLastIndex(
        (step) => [2999].indexOf(step.step_id) != -1
      );

      let krarPrintIndex = col?.submission_history?.findLastIndex(
        (step) => [3000].indexOf(step.step_id) != -1
      );
  

      let aminStepDate;
      if (
        (krarPrintIndex == -1 && aminSignIndex != -1) ||
        (krarPrintIndex > -1 &&
          aminSignIndex > -1 &&
          krarPrintIndex > aminSignIndex &&
          krarPrintIndex - aminSignIndex == 1)
      ) {
        aminStepDate = col?.submission_history?.[aminSignIndex]?.created_date;
      }

      return aminStepDate && moment(aminStepDate, "iD/iM/iYYYY").format("YYYY-M-D") || "";
    })(col, m)`, //"col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
};
