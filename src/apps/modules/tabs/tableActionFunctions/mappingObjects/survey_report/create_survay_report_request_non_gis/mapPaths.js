export const paths = [
  {
    "landData.landData": "",
    fields: {
      municipality_id:
        "identfiy_parcel.MUNICIPALITY_NAME.code",
      submunicipality_id: "identfiy_parcel.SUB_MUNICIPALITY_NAME.Submun_code",
      parcel_desc: "identfiy_parcel.PARCEL_PLAN_NO",
      parcel_area: "identfiy_parcel.plan_amana_cut_area_desc",
      "lands.parcelData.approved_Image": "identfiy_parcel.submissionData.approved_Image",
      "lands.parcelData.previous_Image": "identfiy_parcel.submissionData.previous_Image",
      "municipality.code":
        "identfiy_parcel.MUNICIPALITY_NAME.code",
      "municipality.name": "identfiy_parcel.MUNICIPALITY_NAME.name",
      area: "identfiy_parcel.submissionData.area",
      sub_type: "identfiy_parcel.submissionData.sub_type",
      "lands.parcels": "identfiy_parcel.selectedParcels",
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
        "lands.parcelData.parcel_type": "identfiy_parcel.submissionData.printLandDescription",
      image_uploader:
        "identfiy_parcel.previous_Image",
      "krokySubject": "identfiy_parcel.submissionData.krokySubject",
      "isSurvay": "identfiy_parcel.submissionData.isSurvay",
    },
  },
  {
    data_msa7y: "",
    fields: {
      screenshotURL: "suggestion_survayreport.suggestionsParcels.0.approved_Image",
    },
  },
  {
    "data_msa7y.msa7yData": "",
    fields: {
      "cadDetails.temp.hideDrag": false,
      "cadDetails.temp.notify": "",
      "cadDetails.temp.isPlan": false,
      "cadDetails.temp.isUpdateContract": false,
      "cadDetails.temp.isKrokyUpdateContract": true,
      "cadDetails.temp.isFarz": false,
      "cadDetails.temp.cadResults.data": "suggestion_survayreport.cad_file",
      "cadDetails.survayParcelCutter": "suggestion_survayreport.survayParcelCutter",
      "cadDetails.temp.have_electric_room": "suggestion_survayreport.have_electric_room", 
      "cadDetails.temp.electric_room_area": "suggestion_survayreport.electric_room_area",
      "cadDetails.cuttes_area": "suggestion_survayreport.cuttes_area",
      "cadDetails.isWithinUrbanBoundry": "suggestion_survayreport.isWithinUrbanBoundry",
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
    "data_msa7y.msa7yData.cadDetails.temp.parcel_name":
      "suggestion_survayreport.suggestionsParcels|parcelName",
  },
  // {
  //   "data_msa7y.msa7yData.cadDetails.temp.parcelSliceNo":
  //     "suggestion_survayreport.suggestionsParcels|parcelNameLeft",
  // },
  {
    "data_msa7y.msa7yData.cadDetails.temp.area":
      "suggestion_survayreport.suggestionsParcels|area",
  },
  // {
  //   "data_msa7y.msa7yData.cadDetails.temp.duplixType":
  //     "suggestion_survayreport.suggestionsParcels|duplixType",
  // },
  {
    "data_msa7y.msa7yData.cadDetails.suggestionsParcels":
      "suggestion_survayreport.suggestionsParcels",
    fields: {
      north_Desc: "data.0.border",
      east_Desc: "data.1.border",
      west_Desc: "data.3.border",
      south_Desc: "data.4.border",
      parcel_name: "parcelName",
      plateformWidth_north: 'data.0.plateformWidth',
      plateformWidth_south: 'data.4.plateformWidth',
      plateformWidth_east: 'data.1.plateformWidth',
      plateformWidth_west: 'data.3.plateformWidth',
    },
    copyAllFields: true,
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
  //waseka
  {
    "waseka.waseka.waseka_data_select": "contracts_data.lands",
    fields: {
      "": "PARCEL_PLAN_NO",
    },
    //selectedIndex: "contracts_data.lands.length"
  },
  // {
  //   "waseka.selectedLands": "identfiy_parcel.PARCEL_PLAN_NO",
  // },
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
      data_msa7y2: "suggestion_survayreport",
      duplix_building_details: "duplix_building_details",
      duplix_checktor: "duplix_checktor",
    },
  },
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
 ];
