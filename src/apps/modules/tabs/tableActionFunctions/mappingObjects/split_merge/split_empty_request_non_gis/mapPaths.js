export const paths = [
  {
    "landData.landData": "",
    fields: {
      DISTRICT_NO: "identfiy_parcel.DISTRICT_NAME",
      submissionType: "identfiy_parcel.sub_type_name",
      BLOCK_NO: "identfiy_parcel.PARCEL_BLOCK_NO",
      // CHANGEPARCEL: "identfiy_parcel.is_diffrent",
      // CHANGEPARCELReason: "identfiy_parcel.diffrent_parcel_text",
      // VIOLATION_STATE :"identfiy_parcel.violation_state",
      DIVISION_DESCRIPTION: "identfiy_parcel.DIVISION_NO",
      DIVISION_NO: "identfiy_parcel.subdivisions",
      municipality: "identfiy_parcel.MUNICIPALITY_NAME",
      MUNICIPALITY: "identfiy_parcel.MUNICIPALITY_NAME.code",
      // parcel_desc: "identfiy_parcel.PARCEL_PLAN_NO",
      PARCEL_NO: "identfiy_parcel.PARCEL_PLAN_NO",
      PLAN_NO: "identfiy_parcel.PLAN_NO",
      REQUEST_NO: "identfiy_parcel.requestTypes",
      STREET_NO: "identfiy_parcel.STREET_NAME",
      SUB_MUNICIPALITY: "identfiy_parcel.SUB_MUNICIPALITY_NAME.Submun_code",
      approved_Image: "identfiy_parcel.submissionData.approved_Image",
      previous_Image: "identfiy_parcel.submissionData.previous_Image",
      area: "identfiy_parcel.submissionData.area",
      isNonGis: "identfiy_parcel.submissionData.isNonGis",
      sub_type: "identfiy_parcel.submissionData.sub_type",
      "lands.selectedRequestType": "identfiy_parcel.requestTypes",
      "lands.parcelData.parcel_type":
        "identfiy_parcel.submissionData.printLandDescription",
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
      municipilty_code: "identfiy_parcel.MUNICIPALITY_NAME.code",
      req_type: "",
      PARCEL_IMAGE: "identfiy_parcel.land_real_image",
    },
  },
  {
    landData: "",
    fields: {
      requestType: "requestType",
    },
  },
  {
    "sugLandData.sugLandData": "suggestion_parcel",
    fields: {
      APPROVED_IMAGE: "approved_Image",
      HEAD: "head",
    },
  },
  {
    "sugLandData.sugLandData.lands": "",
    fields: {
      selectedRequestType: "requestType",
    },
  },
  {
    "sugLandData.sugLandData.lands.suggestedParcels":
      "suggestion_parcel.suggestionsParcels",
    fields: {
      "attributes.NEW_PARCEL_AREA": "area",
      "attributes.parcel_type": "printLandDescription",
      "attributes.PARCEL_PLAN_NO": "parcelName",
      "attributes.east_desc": "east_boundry",
      "attributes.east_length": "east_length",
      "attributes.north_desc": "north_boundry",
      "attributes.north_length": "north_length",
      "attributes.south_desc": "south_boundry",
      "attributes.south_length": "south_length",
      "attributes.west_desc": "west_boundry",
      "attributes.west_length": "west_length",
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
  },
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
      sugLandData_parcel: "suggestion_parcel",
    },
  },
  {
    "farz_commentments.farz_commentments": "approve_request",
    fields: {
      approved_accept: "approved_accept",
      approved_sak: "approved_sak",
      approved_sak_status: "approved_sak_status",
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
