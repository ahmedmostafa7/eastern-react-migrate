export const ownerSummaryObject = {
  owner_summary: {
    submissionType: 0,
    submissionType_duplix: 0,
  },
};
export const ownerDataObject = {
  ownerData: {
    ownerData: {
      owner_type: "",
      has_representer: 0,
      owner: "",
      owners: {},
    },
    representerData: {
      rep_search: "",
      reps: [],
    },
    representData: {
      image: "",
      sak_number: "",
      sak_date: "",
      issuer: [],
      note: "",
    },
  },
};

export const landDataObject_noGIS = {
  landData: {
    landData: {
      REQUEST_NO: 0,
      submissionType: "",
      MUNICIPALITY: 0,
      municipality: {
        id: 0,
        name: "",
        svc_url: null,
        province_id: 0,
        code: 0,
        CITY_NAME_A: "",
        city_id: 0,
        classification_id: 0,
        provinces: {
          id: 0,
          name: "",
          svc_url: null,
          code: 0,
          municipalities: null,
          users: null,
        },
        users: null,
        mun_classes: {
          mun_class_id: 0,
          mun_class: "",
        },
        city_code: null,
        mun_class_id: 0,
      },
      SUB_MUNICIPALITY: 0,
      PLAN_NO: "",
      DIVISION_NO: 0,
      DIVISION_DESCRIPTION: "",
      BLOCK_NO: "",
      BLOCK_SPATIAL_ID: 0,
      DISTRICT_NO: "",
      STREET_NO: "",
      PARCEL_NO: "",
      image_uploader: "",
      PARCEL_IMAGE: "",
      lands: {
        parcels: [],
        parcelData: {
          north_length: "",
          north_desc: "",
          south_length: "",
          east_length: "",
          east_desc: "",
          west_length: "",
          west_desc: "",
          south_desc: "",
        },
      },
      req_type: "",
      sub_type: 0,
      area: 0,
      isNonGis: false,
      municipilty_code: 0,
    },
    requestType: 0,
    approved_Image: "",
  },
};

export const landDataObject = {
  landData: {
    landData: {
      CHANGEPARCEL: 0,
      lands: {
        conditions: [],
        parcelData: {
          parcel_type: "",
          north_length: "",
          north_desc: "",
          south_desc: "",
          south_length: "",
          east_length: "",
          east_desc: "",
          west_length: "",
          west_desc: "",
        },
        temp: {
          mun: 0,
          plan: "",
          parcelDis: [],
        },
        domainLists: {
          usingSymbols: [],
          districtNames: [],
          SUB_MUNICIPALITY_NAME_Domains: [],
          cityNames: [],
        },
        lists: {
          firstParcels: [],
          subDivNames: [],
          MunicipalityNames: [],
          subDivType: [],
          PlanNum: [],
          blockNum: [],
        },
        parcels: [],
        selectedRequestType: 0,
        screenshotURL: "",
        mapHeight: 0,
        mapWidth: 0,
        zoomfactor: 0,
        activeHeight: false,
      },
      image_uploader: "",
      area: 0,
      sub_type: 0,
      BLOCK_NO: null,
      PLAN_NO: "",
      BLOCK_SPATIAL_ID: 0,
      DIVISION_NO: null,
      MUNICIPALITY_NAME: 0,
      DISTRICT: "",
      municipality: {
        name: "",
        code: 0,
      },
      submissionType: "",
      previous_Image: "",
      approved_Image: "",
      req_type: "",
    },
    requestType: 0,
  },
};
export const wasekaObject = {
  waseka: {
    selectedLands: [],
    waseka: {
      waseka_data_select: "",
      table_waseka: [],
      image: "",
    },
  },
};

export const sugLandDataObject = {
  sugLandData: {
    sugLandData: {
      HEAD: false,
      APPROVED_IMAGE: "",
      lands: {
        suggestedParcels: [],
        selectedRequestType: 0,
      },
    },
  },
};

export const dataMsa7yObject = {
  data_msa7y: {
    msa7yData: {
      mapviewer: {
        mapHeight: 0,
        mapWidth: 0,
        zoomfactor: 0,
        activeHeight: false,
      },
      image_uploader: "",
      cadDetails: {
        suggestionsParcels: [],
        planDescription: "",
        mun: {},
        temp: {
          cadResults: {
            lineFeatures: [],
            boundryFeaturesLen: [],
            cadFeatures: [],
            shapeFeatures: [],
          },
          notify: false,
          hideDrag: false,
          hasNotify: false,
          outRange: false,
          isFarz: false,
          westBoundries0: [],
          southBoundries0: [],
          northBoundries0: [],
          eastBoundries0: [],
          north_Desc0: "",
          east_Desc0: "",
          west_Desc0: "",
          south_Desc0: "",
          area0: "",
          parcelSliceNo0: "",
          parcel_name0: "",
          duplixType0: 0,
        },
      },
    },
    screenshotURL: "",
  },
};
export const approvalSubmissionNotesObject = {
  approvalSubmissionNotes: {
    notes: {
      notes: [],
      date: "",
      time: "",
    },
  },
};

export const farzCommentmentsObject = {
  farz_commentments: {
    farz_commentments: {
      eng_comp_edit_approved: 0,
      owner_owner_approval: 0,
      owner_sak_approved: 0,
    },
  },
};

export const remarksObject = {
  remarks: [],
};
export const commentsObject = {
  comments: {},
};
