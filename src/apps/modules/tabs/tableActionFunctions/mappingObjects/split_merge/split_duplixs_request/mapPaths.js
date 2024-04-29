 export const paths = [
  {
    "duplix_building_details.duplix_building_details":
      "duplix_building_details",
    fields: {
      build_licence_image: "build_licence_image",
      duplix_is: "duplix_is",
      duplix_licence_date: "duplix_licence_date",
      duplix_licence_number: "duplix_licence_number",
      land_real_image: "land_real_image",
      arc_blocks_images: "arc_blocks_images",
      front_build_image: "front_build_image",
    },
  },
  {
    "duplix_checktor.duplix_checktor": "duplix_checktor",
    fields: {
      comm_air_room: "comm_air_room",
      direct_line: "direct_line",
      externals: "externals",
      internal_parking: "internal_parking",
      line_area_len_split: "line_area_len_split",
      line_area_len_merg: "line_area_len_merg",
      merged_duplixs: "merged_duplixs",
      one_area_check: "one_area_check",
      split_duplixs: "split_duplixs",
      street_length_check: "street_length_check",
      unit_connect: "unit_connect",
    },
  },
  {
    "landData.landData": "",
    fields: {
      submissionType: "تقسيم",
      BLOCK_NO: "identfiy_parcel.submissionData.BLOCK_NO",
      BLOCK_SPATIAL_ID: "identfiy_parcel.submissionData.BLOCK_SPATIAL_ID",
      CHANGEPARCEL: "identfiy_parcel.is_diffrent",
      CHANGEPARCELReason: "identfiy_parcel.diffrent_parcel_text",
      VIOLATION_STATE: "identfiy_parcel.violation_state",
      DISTRICT: "identfiy_parcel.submissionData.DISTRICT",
      DIVISION_NO: "identfiy_parcel.submissionData.DIVISION_NO",
      subdivisions: "identfiy_parcel.submissionData.subdivisions",
      MUNICIPALITY_NAME:
        "identfiy_parcel.selectedParcels.0.attributes.MUNICIPALITY_NAME",
      "municipality.code":
        "identfiy_parcel.selectedParcels.0.attributes.MUNICIPALITY_NAME",
      "municipality.name": "identfiy_parcel.submissionData.MUNICIPALITY_NAME",
      PLAN_NO: "identfiy_parcel.submissionData.PLAN_NO",
      approved_Image: "identfiy_parcel.submissionData.approved_Image",
      previous_Image: "identfiy_parcel.submissionData.previous_Image",
      area: "identfiy_parcel.submissionData.area",
      sub_type: "identfiy_parcel.submissionData.sub_type",
      "lands.parcels": "identfiy_parcel.selectedParcels",
      "lands.screenshotURL": "identfiy_parcel.screenshotURL",
      //GIS_PARCEL_AREA: "",
      scale: "identfiy_parcel.scale",
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
      image_uploader:
        "duplix_building_details.duplix_building_details.land_real_image",
      req_type: "req_type",
    },
  },
  {
    landData: "",
    fields: {
      requestType: "requestType",
    },
  },
  {
    data_msa7y: "",
    fields: {
      screenshotURL: "suggestion_duplix.screenshotURL",
    },
  },
  {
    "data_msa7y.msa7yData": "",
    fields: {
      "cadDetails.temp.hideDrag": false,
      "cadDetails.temp.notify": "",
      "cadDetails.temp.isPlan": false,
      "cadDetails.temp.isUpdateContract": false,
      "cadDetails.temp.isKrokyUpdateContract": false,
      "cadDetails.temp.isFarz": true,
      "cadDetails.temp.cadResults": "suggestion_duplix.cad_file.0",
      //"cadDetails.temp.cadResults.header": "200",
      image_uploader: "",
      "mapviewer.activeHeight": false,
      "mapviewer.zoomfactor": "25",
      "HEAD" :"suggestion_duplix.head"
    },
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.north_Desc":
      "suggestion_duplix.suggestionsDuplixes|data.0.border",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.east_Desc":
      "suggestion_duplix.suggestionsDuplixes|data.1.border",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.west_Desc":
      "suggestion_duplix.suggestionsDuplixes|data.3.border",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.south_Desc":
      "suggestion_duplix.suggestionsDuplixes|data.4.border",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.parcel_name":
      "suggestion_duplix.suggestionsDuplixes|parcelNameRight",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.parcelSliceNo":
      "suggestion_duplix.suggestionsDuplixes|parcelNameLeft",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.area":
      "suggestion_duplix.suggestionsDuplixes|area",
  },
  {
    "data_msa7y.msa7yData.cadDetails.temp.duplixType":
      "suggestion_duplix.suggestionsDuplixes|duplixType",
  },
  {
    "data_msa7y.msa7yData.cadDetails.suggestionsParcels":
      "suggestion_duplix.suggestionsDuplixes",
    fields: {
      north_Desc: "data.0.border",
      east_Desc: "data.1.border",
      west_Desc: "data.3.border",
      south_Desc: "data.4.border",
      parcel_name: "parcelName",
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
  {
    "waseka.waseka": "contracts_attach",
    fields: {
      image: "image",
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
      data_msa7y2: "suggestion_duplix",
      duplix_building_details: "duplix_building_details",
      duplix_checktor: "duplix_checktor",
    },
  },
  {
    "farz_commentments.farz_commentments": "approve_request",
    fields: {
      approved_accept: "approved_accept",
      owner_approval: "owner_approval",
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
  // {
  //   remarks: "eng_create_remark",
  //   fields: {
  //     attachemnts: "files",
  //     comment: "comment",
  //     user: "user",
  //     date: "comment_date",
  //     step: "step",
  //   },
  // },
 ];
