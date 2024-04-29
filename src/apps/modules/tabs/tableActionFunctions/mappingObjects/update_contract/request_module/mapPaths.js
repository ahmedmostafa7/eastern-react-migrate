export const paths = [
  {
    "landData.landData": "",
    fields: {
      BLOCK_NO: "identfiy_parcel.submissionData.BLOCK_NO",
      BLOCK_SPATIAL_ID: "identfiy_parcel.submissionData.BLOCK_SPATIAL_ID",
      CHANGEPARCEL: "identfiy_parcel.is_diffrent",
      CHANGEPARCELReason: "identfiy_parcel.diffrent_parcel_text",
      VIOLATION_STATE: "identfiy_parcel.violation_state",
      DISTRICT: "identfiy_parcel.submissionData.DISTRICT",
      DIVISION_NO: "identfiy_parcel.submissionData.DIVISION_NO",
      subdivisions:
        "identfiy_parcel.selectedParcels[0].attributes.SUBDIVISION_TYPE",
      MUNICIPALITY_NAME:
        "identfiy_parcel.selectedParcels[0].attributes.MUNICIPALITY_NAME",
      "municipality.code":
        "identfiy_parcel.selectedParcels.0.attributes.MUNICIPALITY_NAME",
      "municipality.name": "identfiy_parcel.submissionData.MUNICIPALITY_NAME",
      PLAN_NO: "identfiy_parcel.submissionData.PLAN_NO",
      approved_Image: "identfiy_parcel.submissionData.approved_Image",
      previous_Image: "identfiy_parcel.submissionData.previous_Image",
      area: "identfiy_parcel.submissionData.area",
      sub_type: "identfiy_parcel.submissionData.sub_type",
      //"lands.parcels": "identfiy_parcel.selectedParcels",
      //"lands.screenshotURL": "identfiy_parcel.screenshotURL",
      "lands.selectedRequestType": "identfiy_parcel.submissionData.sub_type",
      scale: "identfiy_parcel.scale",

      image_uploader: "identfiy_parcel.land_real_image",
    },
  },
  {
    "landData.landData.lands.parcels": "identfiy_parcel.selectedParcels",
    fields: {
      "parcelData.parcel_type": "submissionData.printLandDescription",
      "parcelData.west_length": "submissionData.west_length",
      "parcelData.west_desc": "submissionData.west_boundry",
      "parcelData.east_length": "submissionData.east_length",
      "parcelData.east_desc": "submissionData.east_boundry",
      "parcelData.south_length": "submissionData.south_length",
      "parcelData.south_desc": "submissionData.south_boundry",
      "parcelData.north_desc": "submissionData.north_boundry",
      "parcelData.north_length": "submissionData.north_length",
    },
    copyAllFields: true,
  },
  {
    landData: "",
    fields: {
      requestType: "requestType",
      screenshotURL: "identfiy_parcel.screenshotURL",
    },
  },
  {
    "data_msa7y.msa7yData": "",
    fields: {
      "cadDetails.temp.hideDrag": false,
      "cadDetails.temp.notify": "",
      "cadDetails.temp.isPlan": false,
      "cadDetails.temp.isUpdateContract": true,
      "cadDetails.temp.isKrokyUpdateContract": false,
      "cadDetails.temp.isFarz": false,
      "cadDetails.temp.cadResults.data.0": "suggestion_survayreport.cad_file.0",
      "cadDetails.isWithinUrbanBoundry":
        "suggestion_survayreport.isWithinUrbanBoundry",
      image_uploader: "",
      "mapviewer.activeHeight": false,
      "mapviewer.zoomfactor": "25",
    },
  },
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
    "data_msa7y.msa7yData.cadDetails.temp.north_length_text":
      "suggestion_survayreport.suggestionsParcels|data.0.length_text",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.east_length_text":
      "suggestion_survayreport.suggestionsParcels|data.1.length_text",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.west_length_text":
      "suggestion_survayreport.suggestionsParcels|data.3.length_text",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.south_length_text":
      "suggestion_survayreport.suggestionsParcels|data.4.length_text",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.parcelName":
      "suggestion_survayreport.suggestionsParcels|parcelNameRight",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.parcelSliceNo":
      "suggestion_survayreport.suggestionsParcels|parcelNameLeft",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.area":
      "suggestion_survayreport.suggestionsParcels|area",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.area_text":
      "suggestion_survayreport.suggestionsParcels|area_text",
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
      parcel_name: "parcelName",
      north_length_text: "data.0.length_text",
      east_length_text: "data.1.length_text",
      west_length_text: "data.3.length_text",
      south_length_text: "data.4.length_text",
    },
    copyAllFields: true,
  },
  {
    "update_contract_submission_data.update_contract_submission_data":
      "update_contract_submission_data",
    fields: {
      update_owner_date: "update_owner_date",
      modify_length_boundries: "modify_length_boundries",
      modify_transaction_type_dukan: "modify_transaction_type_dukan",
      modify_area_increase: "modify_area_increase",
      modify_area_decrease: "modify_area_decrease",
      update_lengths_units: "update_lengths_units",
      update_district_name: "update_district_name",
      update_plan_number: "update_plan_number",
      update_block: "update_block",
      update_paper_contract: "update_paper_contract",
      splite_parcels_by_one_contarct: "splite_parcels_by_one_contarct",
      marge_contracts_for_parcels: "marge_contracts_for_parcels",
    },
  },
  // {
  //   "update_contract_submission_data.update_contract_submission_data.parcels.newMainObject.landData.selectedParcels":
  //     "update_contract_submission_data.selectedParcels",
  //   fields: {
  //     "parcelData.parcel_type": "submissionData.printLandDescription",
  //     "parcelData.west_length": "submissionData.west_length",
  //     "parcelData.west_desc": "submissionData.west_boundry",
  //     "parcelData.east_length": "submissionData.east_length",
  //     "parcelData.east_desc": "submissionData.east_boundry",
  //     "parcelData.south_length": "submissionData.south_length",
  //     "parcelData.south_desc": "submissionData.south_boundry",
  //     "parcelData.north_desc": "submissionData.north_boundry",
  //     "parcelData.north_length": "submissionData.north_length",
  //   },
  //   copyAllFields: true,
  // },
  {
    "signatures.signatures": "assign_signtures",
    fields: {
      sak_search: "issuers.name",
    },
  },
  {
    "signatures.signatures.commit_actors": "assign_signtures.commit_actors",
    fields: {
      "": "id",
    },
  },
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
  // waseka
  {
    "waseka.waseka.waseka_data_select": "contracts_data.lands",
    fields: {
      "": "PARCEL_PLAN_NO",
    },
    // selectedIndex: "contracts_data.lands.length",
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
      sakValid: "contract.valid",
    },
    copyAllFields: true,
  },
  {
    "waseka.waseka": "contracts_and_kroky_attach",
    fields: {
      image: "contract_image",
      kroky_image: "kroky_image",
    },
  },
  {
    "contract_commentments.contract_commentments": "approve_request",
    fields: {
      approved_accept: "approved_accept",
      approved_sak: "approved_sak",
      approved_sak_status: "approved_sak_status",
      owner_approval: "owner_approval",
    },
  },
  {
    "waseka.waseka.table_waseka_temp": "contracts_data.lands",
    fields: {
      selectedLands: "PARCEL_PLAN_NO",
      number_waseka: "contract.contract_number",
      date_waseka: "contract.issue_date",
      mlkya_type: "contract.sak_type.id",
      waseka_search: "contract.issuers.name",
      image_waseka: "contract.image",
      name_waseka: "contract.sak_name",
      sakValid: "contract.valid",
    },
    copyAllFields: true,
  },
  {
    "waseka.waseka": "contracts_data",
    fields: {
      sakType: "update_contract_type",
    },
  },
  //remarks
  {
    approvalSubmissionNotes: "eng_create_remark",
    fields: {
      "notes.notes.0.attachments": "files",
      "notes.notes.0.notes": "comment",
      user: "user",
      "notes.date": "comment_date",
    },
  },
  //comments التعليقات
  {
    comments: "comments",
    commentFields: {
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
      data_msa7y1: "suggestion_survayreport",
    },
  },
  {
    remark: "surv_remark",
    fields: {
      "comment.attachemnts": "files",
      "comment.comment": "comment",
      "comment.calling_momtlkat_management": "goto_ownes_management",
      "comment.invoice_image": "order_image",
      "comment.agreements": "other_images",
      "comment.invoice_number": "order_number",
      "comment.invoice_date": "order_date",
      "comment.step": "step",
      "comment.user": "user",
    },
  },
  {
    remarks: "eng_create_remark",
    fields: {
      "eng_create_remark.attachemnts": "files",
      "eng_create_remark.comment": "comment",
      "eng_create_remark.user": "user",
      "eng_create_remark.step": "step",
    },
  },
  {
    remarks: "remarks",
    fields: {
      "remarks.attachemnts": "files",
      "remarks.comment": "comment",
      "remarks.user": "user",
      "remarks.step": "step",
    },
  },
  {
    remarks: "surv_remark",
    fields: {
      "surv_remark.attachemnts": "files",
      "surv_remark.comment": "comment",
      "surv_remark.user": "user",
      "surv_remark.step": "step",
    },
  },
];
