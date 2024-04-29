export const paths = [
  // {
  //   "landData.landData.municipality_id":
  //     "identfiy_parcel.MUNICIPALITY_NAME.code",
  // },
  // {
  //   "landData.landData.municipality": "identfiy_parcel.MUNICIPALITY_NAME",
  // },
  // {
  //   "landData.landData.submunicipality_id":
  //     "identfiy_parcel.SUB_MUNICIPALITY_NAME.id",
  // },
  // {
  //   "landData.landData.parcel_desc": "identfiy_parcel.PARCEL_PLAN_NO",
  // },
  // {
  //   "landData.landData.image_uploader": "identfiy_parcel.previous_Image",
  // },
  // {
  //   "landData.landData.lands.parcels": "identfiy_parcel.selectedParcels",
  // },
  // {
  //   "landData.landData.lands.parcelData.north_length":
  //     "identfiy_parcel.submissionData.north_length",
  // },
  // {
  //   "landData.landData.lands.parcelData.north_desc":
  //     "identfiy_parcel.submissionData.north_boundry",
  // },
  // {
  //   "landData.landData.lands.parcelData.south_desc":
  //     "identfiy_parcel.submissionData.south_boundry",
  // },
  // {
  //   "landData.landData.lands.parcelData.south_length":
  //     "identfiy_parcel.submissionData.south_length",
  // },

  {
    "landData.landData": "",
    fields: {
      area: "identfiy_parcel.submissionData.area",
      GIS_PARCEL_AREA: "",
      submissionType: "identfiy_parcel.submissionData.sub_type_name",
      parcel_area: "identfiy_parcel.plan_amana_cut_area_desc",
      approved_Image: "identfiy_parcel.submissionData.approved_Image",
      "lands.parcelData.approved_Image":
        "identfiy_parcel.submissionData.approved_plan_Image",
      "lands.parcelData.west_length":
        "identfiy_parcel.submissionData.west_length",
      "lands.parcelData.west_desc":
        "identfiy_parcel.submissionData.west_boundry",
      "lands.parcelData.east_length":
        "identfiy_parcel.submissionData.east_length",
      "lands.parcelData.east_desc":
        "identfiy_parcel.submissionData.east_boundry",
      "lands.parcelData.south_length":
        "identfiy_parcel.submissionData.south_length",
      "lands.parcelData.south_desc":
        "identfiy_parcel.submissionData.south_boundry",
      "lands.parcelData.north_desc":
        "identfiy_parcel.submissionData.north_boundry",
      "lands.parcelData.north_length":
        "identfiy_parcel.submissionData.north_length",
      "lands.parcels": "identfiy_parcel.selectedParcels",
      image_uploader: "identfiy_parcel.previous_Image",
      parcel_desc: "identfiy_parcel.PARCEL_PLAN_NO",
      submunicipality_id: "identfiy_parcel.SUB_MUNICIPALITY_NAME.id",
      municipality: "identfiy_parcel.MUNICIPALITY_NAME",
      municipality_id: "identfiy_parcel.MUNICIPALITY_NAME.code",
     
    },
  },
  // {
  //   "landData.landData.lands.parcelData.east_desc":
  //     "identfiy_parcel.submissionData.east_boundry",
  // },
  // {
  //   "landData.landData.lands.parcelData.east_length":
  //     "identfiy_parcel.submissionData.east_length",
  // },
  // {
  //   "landData.landData.lands.parcelData.west_desc":
  //     "identfiy_parcel.submissionData.west_boundry",
  // },
  // {
  //   "landData.landData.lands.parcelData.west_length":
  //     "identfiy_parcel.submissionData.west_length",
  // },
  // {
  //   "landData.landData.lands.parcelData.approved_Image":
  //     "identfiy_parcel.submissionData.approved_Image",
  // },
  // {
  //   "landData.landData.parcel_area": "identfiy_parcel.plan_amana_cut_area_desc",
  // },
  // {
  //   "landData.landData.submissionType":
  //     "identfiy_parcel.submissionData.sub_type_name",
  // },
  // {
  //   "landData.landData.GIS_PARCEL_AREA": "",
  // },
  // {
  //   "landData.landData.area": "identfiy_parcel.submissionData.area",
  // },

  {
    "data_msa7y.msa7yData": "",
    fields: {
      "cadDetails.temp.hideDrag": false,
      "cadDetails.temp.notify": "",
      "cadDetails.temp.isPlan": true,
      "cadDetails.temp.isUpdateContract": false,
      "cadDetails.temp.isKrokyUpdateContract": false,
      "cadDetails.temp.cadResults.data": "suggestion_survayreport.cad_file",
      "cadDetails.temp.cadResults.header": "200",
      "cadDetails.mun": "identfiy_parcel.MUNICIPALITY_NAME",
      "cadDetails.isWithinUrbanBoundry":
        "suggestion_survayreport.isWithinUrbanBoundry",
      // "cadDetails.suggestionsParcels":
      //   "suggestion_survayreport.suggestionsParcels",
      "cadDetails.planDescription": "suggestion_survayreport.planDescription",
      image_uploader: "",
      "mapviewer.activeHeight": false,
      "mapviewer.zoomfactor": "25",
    },
  },

  // {
  //   "data_msa7y.msa7yData.mapviewer.zoomfactor": "25",
  // },
  // {
  //   "data_msa7y.msa7yData.mapviewer.activeHeight": false,
  // },
  // {
  //   "data_msa7y.msa7yData.image_uploader": "",
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.planDescription":
  //     "suggestion_survayreport.planDescription",
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.suggestionsParcels":
  //     "suggestion_survayreport.suggestionsParcels",
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.isWithinUrbanBoundry":
  //     "suggestion_survayreport.isWithinUrbanBoundry",
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.mun": "identfiy_parcel.MUNICIPALITY_NAME",
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.temp.cadResults.header": "200",
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.temp.cadResults.data":
  //     "suggestion_survayreport.cad_file",
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.temp.isKrokyUpdateContract": false,
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.temp.isUpdateContract": false,
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.temp.isPlan": true,
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.temp.notify": "",
  // },
  // {
  //   "data_msa7y.msa7yData.cadDetails.temp.hideDrag": false,
  // },

  {
    "data_msa7y.msa7yData.cadDetails.temp.north_Desc":
      "suggestion_survayreport.suggestionsParcels|data.0.border",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.east_Desc":
      "suggestion_survayreport.suggestionsParcels|data.1.border",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.west_Desc":
      "suggestion_survayreport.suggestionsParcels|data.3.border",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.south_Desc":
      "suggestion_survayreport.suggestionsParcels|data.4.border",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.area":
      "suggestion_survayreport.suggestionsParcels|area",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.duplixType":
      "suggestion_survayreport.suggestionsParcels|duplixType",
  },
  {
    "data_msa7y.msa7yData.cadDetails.suggestionsParcels":
      "suggestion_survayreport.suggestionsParcels",
    fields: {
      north_Desc: "data.0.border",
      east_Desc: "data.1.border",
      west_Desc: "data.3.border",
      south_Desc: "data.4.border",
    },
    copyAllFields: true,
  },
  // {
  //   "plans.plansData.mapviewer.zoomfactor": "25",
  // },
  // {
  //   "plans.plansData.mapviewer.activeHeight": false,
  // },
  {
    "plans.plansData": "suggestionGov_survayreport.cad_file_first",
    selectedIndex: "0",
    fields: { image_uploader1: "cad_path" },
  },
  {
    "plans.plansData.planDetails.uplodedFeatures[0]":
      "suggestionGov_survayreport.cad_file_first",
    selectedIndex: "0",
  },
  {
    "plans.plansData": "suggestionGov_survayreport.cad_file_seconed",
    selectedIndex: "0",
    fields: { image_uploader2: "cad_path" },
  },
  {
    "plans.plansData.planDetails.uplodedFeatures[1]":
      "suggestionGov_survayreport.cad_file_seconed",
    selectedIndex: "0",
  },
  {
    "plans.plansData": "suggestionGov_survayreport.cad_file_third",
    selectedIndex: "0",
    fields: { image_uploader3: "cad_path" },
  },
  {
    "plans.plansData.planDetails.uplodedFeatures[2]":
      "suggestionGov_survayreport.cad_file_third",
    selectedIndex: "0",
  },

  {
    "plans.plansData.planDetails.uplodedFeatures":
      "suggestionGov_survayreport.cad_file_first",
    selectedIndex: "0",
  },
  {
    "plans.plansData.planDetails.uplodedFeatures":
      "suggestionGov_survayreport.cad_file_seconed",
    selectedIndex: "0",
  },
  {
    "plans.plansData.planDetails.uplodedFeatures":
      "suggestionGov_survayreport.cad_file_third",
    selectedIndex: "0",
  },
  // {
  //   "plans.plansData.mapviewer": "",
  //   fields: { zoomfactor: "25", activeHeight: false },
  // },
  {
    "plans.plansData": "",
    fields: {
      "planDetails.hide_details": false,
      "planDetails.statisticsParcels": "statisticsParcels",
      "planDetails.planDescription": "planDescription",
      "planDetails.enableDownlaodCad": "enableDownlaodCad",
      "planDetails.selectedCAD":
        "suggestionGov_survayreport.suggestionsPlan.selectedModel",
      "mapviewer.zoomfactor": "25",
      "mapviewer.activeHeight": false,
    },
  },

  //sub
  {
    // has_representer: is_not_kroky
    "submission_data.mostafed_data": "search_survey_report",
    fields: {
      has_representer: "is_not_kroky",
      req_location: "issuer",
      masarat: "path_execute",
      use_sumbol: "plan_using",
      req_date: "request_date",
      req_no: "request_no",
      mo5tat_use: "request_type.name",
      mostafed_type: "user_type.name",
    },
  },

  // {
  //   "submission_data.mostafed_data.req_location": "search_survey_report.issuer",
  // },
  // {
  //   "submission_data.mostafed_data.masarat":
  //     "search_survey_report.path_execute",
  // },
  // {
  //   "submission_data.mostafed_data.use_sumbol":
  //     "search_survey_report.plan_using",
  // },
  // {
  //   "submission_data.mostafed_data.req_date":
  //     "search_survey_report.request_date",
  // },
  // { "submission_data.mostafed_data.req_no": "search_survey_report.request_no" },
  // {
  //   "submission_data.mostafed_data.mo5tat_use_government":
  //     "search_survey_report.request_type.name",
  // },
  // {
  //   "submission_data.mostafed_data.mo5tat_use_private":
  //     "search_survey_report.request_type.name",
  // },
  // {
  //   "submission_data.mostafed_data.mostafed_type":
  //     "search_survey_report.user_type.name",
  // },

  {
    "ownerData.ownerData.owners": "owners_data.owners",
    groupBy: "id",
    fields: { main_id: "id", subtype_status: "status" },
    isUUID: true,
    copyAllFields: true,
  },
  {
    ownerData: "owners_data",
    fields: {
      issuerData: "issuers",
      "representerData.reps": "representer",
      "ownerData.owner_type": "owner_type",
      "ownerData.has_representer": "has_representer",
      "representData.image": "representative_image",
      "representData.sak_number": "representive_contract_number",
      "representData.sak_date": "issuer_date",
      "representData.issuer": "issuers.name",
      "representData.note": "issuers.remarks",
    },
  },
  {
    "requests.requests": "govAuthorities_approvals",
    fields: { attachment_cad: "cad", attachment_img: "image" },
  },
  {
    "requests.attachments.table_attachments":
      "govAuthorities_approvals.attachments",
    fields: {
      id: "$index",
      number: "num",
      date: "date",
      name: "model.label",
      image_motlbat: "attachement",
    },
  },
  // {
  //   "requests.attachments.table_attachments.3.fa7s.name":
  //     "govAuthorities_approvals.solid_details.creator_name",
  // },
  // {
  //   "requests.attachments.table_attachments.3.fa7s.gohd":
  //     "govAuthorities_approvals.solid_details.creator_name",
  // },
  // {
  //   "requests.attachments.table_attachments.3.fa7s.depth":
  //     "govAuthorities_approvals.solid_details.deepth",
  // },
  // {
  //   "requests.attachments.table_attachments.3.fa7s.recommendtion":
  //     "govAuthorities_approvals.solid_details.recommend",
  // },
  // {
  //   "requests.attachments.table_attachments.3.fa7s.type":
  //     "govAuthorities_approvals.solid_details.construct_type",
  // },
  {
    "requests.attachments.table_attachments.3.fa7s":
      "govAuthorities_approvals.solid_details",
    fields: {
      over_all_different: "total_down",
      over_all_down: "partial_down",
      type: "construct_type",
      recommendtion: "recommend",
      depth: "deepth",
      gohd: "weight",
      office_name: "creator_name",
      depth_water: "water_deepth",
    },
  },
  // {
  //   "requests.attachments.table_attachments.3.fa7s.gohd":
  //     "govAuthorities_approvals.solid_details.weight",
  // },
  // {
  //   "requests.attachments.table_attachments.3.fa7s.over_all_down":
  //     "govAuthorities_approvals.solid_details.partial_down",
  // },
  // {
  //   "requests.attachments.table_attachments.3.fa7s.over_all_different":
  //     "govAuthorities_approvals.solid_details.total_down",
  // },

  //{ "ownerData.ownerData.owners": "owners_data.owners", groupBy: "id" },

  // waseka
  // {
  //   "waseka.waseka.waseka_data_select": "contracts_data.lands",
  // },
  {
    "waseka.selectedLands": "identfiy_parcel.PARCEL_PLAN_NO",
  },
  {
    "waseka.waseka.table_waseka": "contracts_data.lands",
    fields: {
      selectedLands: "PARCEL_PLAN_NO",
      number_waseka: "contract.contract_number",
      date_waseka: "contract.issue_date",
      mlkya_type: "contract.sak_type.id",
      waseka_search: "contract.issuers.name",
      image_waseka: "contract.image",
      name_waseka: "contract.sak_name",
      sakValid: "contract.valid"
    },
    copyAllFields: true,
  },
  {
    "waseka.waseka.table_waseka": "contracts_data.skok",
    fields: {
      selectedLands: "lands.0",
      number_waseka: "contract_number",
      date_waseka: "issue_date",
      mlkya_type: "sak_type.id",
      waseka_search: "issuers.name",
      image_waseka: "image.0.data",
      name_waseka: "sak_name",
    },
  },
  //remarks
  {
    approvalSubmissionNotes: "eng_create_remark",
    fields: {
      "notes.notes.attachments": "files",
      "notes.notes.notes": "comment",
      user: "user",
      "notes.date": "comment_date",
    },
  },
  //comments التعليقات
  {
    comments: "comments",
    commentFields: {
      submission_data: "search_survey_report",
      requests: "govAuth_approval",
      data_msa7y: "suggestion_survayreport",
      data_msa7y1: "suggestion_survayreport",
      data_msa7y2: "suggestion_survayreport",
      bda2l: "bands_approval",
      lagna_karar: "remark_technical",
      plans: "suggestionGov_survayreport",
      approvalSubmissionNotes: "undefined",
      ownerData: [
        "owners_data",
        "general_owners_data",
        "special_owners_data",
        "special_owner_data_owners",
        "others_owners_data",
      ],
      waseka: ["contracts_attach", "contracts_and_kroky_attach"],
      landData: ["moamla_data", "identfiy_parcel"],
      remarks: ["remarks", "undefined"],
    },
  },
  // {
  //   "comments.submission_data": "comments.search_survey_report0",
  //   fields: {
  //     comment: "comment",
  //     user: "user",
  //     currentDate: "",
  //     checked: false,
  //   },
  // },
  // {
  //   "comments.ownerData": "comments.owners_data0",
  //   fields: {
  //     comment: "comment",
  //     user: "user",
  //     currentDate: "",
  //     checked: false,
  //   },
  // },
  // {
  //   "comments.requests": "comments.govAuth_approval0",
  //   fields: {
  //     comment: "comment",
  //     user: "user",
  //     currentDate: "",
  //     checked: false,
  //   },
  // },
  // {
  //   "comments.submission_data": "comments.bands_approval0",
  //   fields: {
  //     comment: "",
  //     user: "",
  //     currentDate: "",
  //     checked: "",
  //   },
  // },
  // {
  //   "comments.requests": "comments.suggestion_survayreport0",
  //   fields: {
  //     comment: "",
  //     user: "",
  //     currentDate: "",
  //     checked: "",
  //   },
  // },
  // {
  //   "comments.requests": "comments.moamla_data0",
  //   fields: {
  //     comment: "",
  //     user: "",
  //     currentDate: "",
  //     checked: "",
  //   },
  // },
  // {
  //   "comments.requests": "comments.remark_technical0:",
  //   fields: {
  //     comment: "",
  //     user: "",
  //     currentDate: "",
  //     checked: "",
  //   },
  // },
  //remarks
  {
    remarks: "remarks",
    fields: {
      attachemnts: "files",
      comment: "comment",
      date: "comment_date",

      step: "step",
      user: "user",
    },
  },
  {
    remarks: "eng_create_remark",
    fields: {
      attachemnts: "files",
      comment: "comment",
      user: "user",
      date: "comment_date",
      step: "step",
    },
  },
  {
    "bda2l.bands_approval.band_number.oldOptions": "bands_approval",
    fields: {
      checked: "band_list.selected",
      value: "band_list.value",
      label: "band_number_N",
    },
  },
  {
    "bda2l.bands_approval.band_number.selectedValues":
      "bands_approval.band_list.value",
    selectedIndex: "bands_approval.band_index",
  },
  {
    "bda2l.bands_approval.band_number.owner_selectedValues":
      "bands_approval.band_list.value",
    selectedIndex: "bands_approval.band_index",
  },
  {
    "bda2l.bands_approval": "bands_approval",
    fields: {
      urban: "urban.id",
      owner_acceptance: "owner_acceptance",
      others: "others",
    },
  },
  {
    "lagna_notes.lagna_remarks.remarks": "lgnah_remarks.lgnah_remarks",
    fields: {
      checked: "checked",
      isDefault: true,
      num: "num",
      remark: "remark",
      isSignAmin: "isSignAmin",
    },
  },
  {
    "print_notes.printed_remarks": "printed_remarks",
    fields: {
      plan_desc: "plan_desc",
      printType: "printType",
    },
  },
  {
    "print_notes.printed_remarks.remarks": "printed_remarks.remarks",
    fields: {
      id: "$index",
    },
    copyAllFields: true,
  },
  {
    "lagna_karar.lagna_karar": "remark_technical",
    fields: {
      plan_number: "plan_no",
      plan_name: "plan_name",
      planStatus: "action_name",
      ma7dar_lagna_no: "technical_num",
      karar_attachment: "files",
      ma7dar_lagna_date: "date",
      plans: "selected_cad",
      notes: "comment",
    },
  },
  { "fees.feesInfo": "", fields: { feesValue: "feesInfo" } },
  {
    "tabtiriPlans.tabtiriPlansData": "plan_nitry_suggestion.cad_file_first",
    selectedIndex: "0",
    fields: { image_uploader: "cad_path" },
  },
  {
    "tabtiriPlans.tabtiriPlansData.planDetails.uplodedFeatures[0]":
      "plan_nitry_suggestion.cad_file_first",
    selectedIndex: "0",
  },

  // {
  //   "tabtiriPlans.tabtiriPlansData.mapviewer.zoomfactor": "25",
  // },
  // {
  //   "tabtiriPlans.tabtiriPlansData.mapviewer.activeHeight": false,
  // },

  // {
  //   "tabtiriPlans.tabtiriPlansData.planDetails.enableDownlaodCad":
  //     "enableDownlaodCad",
  // },
  {
    "tabtiriPlans.tabtiriPlansData": "",
    fields: {
      "mapviewer.zoomfactor": "25",
      "mapviewer.activeHeight": false,
      "planDetails.enableDownlaodCad": "enableDownlaodCad",
      "planDetails.planDescription": "planDescription",
      "planDetails.selectedCAD": "perfectCad",
      "planDetails.hide_details": false,
    },
  },
  // {
  //   "tabtiriPlans.tabtiriPlansData.planDetails.planDescription":
  //     "planDescription",
  // },
  // {
  //   "tabtiriPlans.tabtiriPlansData.planDetails.selectedCAD": "perfectCad",
  // },
  // {
  //   "tabtiriPlans.tabtiriPlansData.planDetails.selectedCADIndex": "0",
  // },
  // {
  //   "tabtiriPlans.tabtiriPlansData.planDetails.hide_details": false,
  // },
  {
    "admissions.admission_ctrl.attachments": "admission_ctrl.attachments",
    fields: {
      attachment: "attachement.0.PrevFileName",
      attachment_type: "model.label",
      id: "$index",
      isAdded: true,
      request_date: "date",
      request_no: "num",
    },
  },
];
