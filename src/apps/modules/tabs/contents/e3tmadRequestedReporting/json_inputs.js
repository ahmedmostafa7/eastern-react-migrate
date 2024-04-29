export const jsonData = [
  {
    jsonPath: "landData.landData.municipality.CITY_NAME_A",
    name: "municipality_name",
  },
  {
    jsonPath: "submission_data.mostafed_data.mostafed_type",
    name: "mostafed_type",
  },
  {
    jsonPath: "submission_data.mostafed_data.use_sumbol",
    name: "use_sumbol",
  },
  { jsonPath: "submission_data.mostafed_data.plan_type", name: "e3tmad_geha" },
  { jsonPath: "submission_data.mostafed_data.plan_type", name: "plan_type" },
  { jsonPath: "lagna_karar.lagna_karar.plan_name", name: "plan_name" },
  { jsonPath: "lagna_karar.lagna_karar.plan_number", name: "plan_number" },
  {
    jsonPath: "data_msa7y.msa7yData.cadDetails.suggestionsParcels.[*].area",
    name: "msa7y_area",
  },
  {
    jsonPath: "submission_data.mostafed_data.kroky_search",
    name: "kroky_search",
  },
  { jsonPath: "owners_data.owners[*].name", name: "owner_name" },
  { jsonPath: "owners_data.owners[*].mobile", name: "mobile" },
  { jsonPath: "lagna_karar.lagna_karar.planStatus", name: "plan_status" },
  {
    jsonPath: "lagna_karar.lagna_karar.ma7dar_lagna_no",
    name: "ma7dar_lagna_no",
  },
  {
    jsonPath: "lagna_karar.lagna_karar.ma7dar_lagna_date",
    name: "ma7dar_lagna_date",
  },
  { jsonPath: "fees.feesInfo.feesList", name: "invoices" },
  {
    jsonPath:
      "plans.plansData.planDetails.uplodedFeatures[0].shapeFeatures.landbase.[*].typeName",
    name: "type_name",
  },
  {
    jsonPath: `plans.plansData.planDetails.uplodedFeatures[0].shapeFeatures.landbase.[*].is_cut`,
    name: "cuts",
  },
  {
    jsonPath: `plans.plansData.planDetails.uplodedFeatures[0].shapeFeatures.landbase.[*]`,
    name: "lands",
  },
  {
    jsonPath:
      "plans.plansData.planDetails.uplodedFeatures[0].shapeFeatures.landbase.[*].usingSymbol",
    name: "services_count",
  },
  // { jsonPath: "gardenCount", name: "garden_count" },
  // { jsonPath: "parkingCount", name: "parking_count" },
];

export const columns = {
  id: {
    label: "رقم المسلسل",
    action: "col.no",
    conditionToShow: "true",
  },
  municipality_name: {
    label: "اسم المدينة أو القرية",
    action: "col.json_props[headkey][0]",
    conditionToShow: "true",
  },
  // request_no: {
  //   label: "رقم المعاملة",
  //   action: "col.request_no",
  //   conditionToShow: "true",
  // },
  plan_name: {
    label: "اسم المخطط المعتمد",
    action: "col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  plan_number: {
    label: "رقم المخطط المعتمد",
    action: "col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  msa7y_area: {
    label: "مساحة المخطط (م٢)",
    action: `col.json_props[headkey].reduce(
      (a, b) => a + (+b || 0),
      0
    ).toFixed(2)`,
    conditionToShow: "true",
  },
  // e3tmad_geha: {
  //   label: "جهة الاعتماد",
  //   action:
  //     "(col.json_props[headkey][0] == 1 && 'مخطط جديد') || 'تعديل على مخطط'",
  //   conditionToShow: "true",
  // },
  plan_type: {
    label: "وضع المخطط",
    action:
      "(col.json_props[headkey][0] == 1 && 'مخطط جديد') || 'تعديل على مخطط'",
    conditionToShow: "true",
  },
  mostafed_type: {
    label: "نوع المخطط",
    action: `col.json_props[headkey].join(' - ')`,
    conditionToShow: "true",
  },
  use_sumbol: {
    label: "نوع الإستخدام",
    action: `col.json_props[headkey].join(' - ')`,
    conditionToShow: "true",
  },
  // kroky_search: {
  //   label: "رقم القرار المساحي",
  //   action: "col.json_props[headkey].join(' - ')",
  //   conditionToShow: "true",
  // },
  owner_name: {
    label: "اسم المالك",
    action: "col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  mobile: {
    label: "رقم الجوال",
    action: "col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  // plan_status: {
  //   label: "حالة الطلب من الللجنة الفنية",
  //   action: "(col.json_props[headkey][0] == 1 && 'مرفوض') || 'مقبول'",
  //   conditionToShow: "true",
  // },
  ma7dar_lagna_no: {
    label: "رقم قرار اعتماد اللجنة الفنية",
    action:
      "col.json_props['ma7dar_lagna_date'].join(' - ') && col.json_props[headkey].join(' - ') || ''",
    conditionToShow: "true",
  },
  ma7dar_lagna_date: {
    label: "تاريخ قرار اعتماد اللجنة الفنية",
    action: "col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  // invoices: {
  //   label: "تاريخ دفع الرسوم",
  //   action:
  //     "col.json_props[headkey].filter(r => r.is_paid == true).map(r => r.invoice_date).join(' - ')",
  //   conditionToShow: "true",
  // },
  primary_Approval_no: {
    label: "رقم قرار الاعتماد الابتدائي",
    action: `((col) => {
      
      let primaryApprovalIndex = col?.submission_history?.findLastIndex(
        (step) => [2326, 3107].indexOf(step.step_id) != -1
      );

      let aminSignPrimaryApprovalIndex = col?.submission_history?.findLastIndex(
        (step) => [2851, 3112].indexOf(step.step_id) != -1
      );

      let finalApprovalIndex = col?.submission_history?.findLastIndex(
        (step) => [2372, 2330, 3119].indexOf(step.step_id) != -1
      );

      let aminStepDate = '';
      if (
        aminSignPrimaryApprovalIndex > primaryApprovalIndex &&
        (finalApprovalIndex == -1 ||
          (finalApprovalIndex > -1 &&
            finalApprovalIndex > aminSignPrimaryApprovalIndex))
      ) {
        aminStepDate = col?.submission_history?.[aminSignPrimaryApprovalIndex]?.created_date;
      }

      return aminStepDate;
    })(col) && col.request_no || ''`,
    conditionToShow: "true",
  },
  primary_Approval_date: {
    label: "تاريخ قرار الاعتماد الابتدائي",
    action: `((col) => {
      
      let primaryApprovalIndex = col?.submission_history?.findLastIndex(
        (step) => [2326, 3107].indexOf(step.step_id) != -1
      );

      let aminSignPrimaryApprovalIndex = col?.submission_history?.findLastIndex(
        (step) => [2851, 3112].indexOf(step.step_id) != -1
      );

      let finalApprovalIndex = col?.submission_history?.findLastIndex(
        (step) => [2372, 2330, 3119].indexOf(step.step_id) != -1
      );

      let aminStepDate = '';
      if (
        aminSignPrimaryApprovalIndex > primaryApprovalIndex &&
        (finalApprovalIndex == -1 ||
          (finalApprovalIndex > -1 &&
            finalApprovalIndex > aminSignPrimaryApprovalIndex))
      ) {
        aminStepDate = col?.submission_history?.[aminSignPrimaryApprovalIndex]?.created_date;
      }

      return aminStepDate;
    })(col)`, //"col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  final_Approval_no: {
    label: "رقم قرار الاعتماد النهائي",
    action: `((col) => {
      
      let finalApprovalIndex = col.submission_history.findLastIndex(
        (step) => [2372, 2330, 3119].indexOf(step.step_id) != -1
      );
      let aminSignatureIndex = col.submission_history.findLastIndex(
        (step) => [2899, 3124, 2921].indexOf(step.step_id) != -1
      );
      return (finalApprovalIndex != -1 && col.submission_history?.[aminSignatureIndex]?.created_date) || "";
    })(col) && col.request_no || ''`,
    conditionToShow: "true",
  },
  final_Approval_date: {
    label: "تاريخ قرار الاعتماد النهائي",
    action: `((col) => {
      
      let finalApprovalIndex = col.submission_history.findLastIndex(
        (step) => [2372, 2330, 3119].indexOf(step.step_id) != -1
      );
      let aminSignatureIndex = col.submission_history.findLastIndex(
        (step) => [2899, 3124, 2921].indexOf(step.step_id) != -1
      );
      return (finalApprovalIndex != -1 && col.submission_history?.[aminSignatureIndex]?.created_date) || "";
    })(col)`, //"col.json_props[headkey].join(' - ')",
    conditionToShow: "true",
  },
  parcels_count: {
    label: "عدد قطع الأراضي السكنية",
    action: `col.json_props["cuts"]?.filter((a) => (!a))?.length || 0`,
    conditionToShow: "true",
  },
  parcels_total_area: {
    label: "مساحات قطع الأراضي السكنية",
    action: `col.json_props["lands"]?.filter((a) => (!a.is_cut))?.reduce(
      (a, b) => {
        
      return a + (+b.area || 0)
      },
      0
    )?.toFixed(2) || 0`,
    conditionToShow: "true",
  },
  // services_count: {
  //   label: "عدد قطع الأراضي مرفق حكومي (خدمات)",
  //   action: `col.json_props["services_count"]?.filter((a) => a == "خ")?.length?.toFixed(2)`,
  //   conditionToShow: "true",
  // },
  commercial_count: {
    label: "عدد قطع الأراضي التجارية",
    action:
      "col.json_props['type_name']?.filter(r => r == 'تجارى')?.length || 0",  
    conditionToShow: "true",
  },
  commercial_total_area: {
    label: "مساحات قطع الأراضي التجارية",
    action: `col.json_props["lands"]?.filter((a) => a.typeName == 'تجارى')?.reduce(
      (a, b) => {
        
      return a + (+b.area || 0)
      },
      0
    )?.toFixed(2) || 0`,
    conditionToShow: "true",
  },
  marafik_count: {
    label: "عدد قطع الأراضي مرفق حكومي (مرافق + خدمات)",
    action: `(col.json_props['services_count']?.filter((a) => a == 'خ')?.length + 
      col.json_props['type_name']?.filter(r => r == 'مواقف')?.length + 
      col.json_props['type_name']?.filter(r => r == 'حدائق')?.length) || 0`,
    conditionToShow: "true",
  },
  marafik_total_area: {
    // usingSymbol
    label: "مساحات قطع الأراضي مرفق حكومي (مرافق + خدمات)",
    action: `(+col.json_props["lands"]?.filter((a) => a.usingSymbol == 'خ')?.reduce(
      (a, b) => {
        
      return a + (+b.area || 0)
      },
      0
    )?.toFixed(2) + +col.json_props["lands"]?.filter((a) => a.typeName == 'مواقف')?.reduce(
      (a, b) => {
        
      return a + (+b.area || 0)
      },
      0
    )?.toFixed(2) + +col.json_props["lands"]?.filter((a) => a.typeName == 'حدائق')?.reduce(
      (a, b) => {
        
      return a + (+b.area || 0)
      },
      0
    )?.toFixed(2)) || 0`,
    conditionToShow: "true",
  },
};
