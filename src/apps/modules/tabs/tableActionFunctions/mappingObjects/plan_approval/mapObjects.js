export const submissionDataObject = {
  submission_data: {
    mostafed_data: {
      masarat: "",
      has_representer: false,
      mostafed_type: "",
      mo5tat_use_government: "",
      use_sumbol: "",
      req_no: "",
      req_date: "",
      req_location: "",
    },
  },
};
export const ownerDataObject = {
  ownerData: {
    ownerData: {
      owner_type: "",
      has_representer: false,
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
    // "issuerData": {
    //     "id": 0,
    //     "name": "",
    //     "remarks": null,
    //     "type": null,
    //     "type_id": 0,
    //     "code": 0,
    //     "address": null,
    //     "fax": null,
    //     "email": null,
    //     "website": null,
    //     "phone": null,
    //     "municipality_id": 0,
    //     "is_court": null,
    //     "municipalities": null,
    //     "issuers_type": null,
    //     "users": null,
    //     "export_id": 0
    // }
  },
};
export const landDataObject = {
  landData: {
    landData: {
      municipality_id: 0,
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
          users: null,
        },
        users: null,
        mun_classes: {
          mun_class_id: 0,
          mun_class: "",
        },
        city_code: null,
      },
      submunicipality_id: 0,
      parcel_desc: "",
      image_uploader: "",
      lands: {
        parcelData: {
          north_length: "",
          north_desc: "",
          south_desc: "",
          south_length: "",
          east_desc: "",
          east_length: "",
          west_desc: "",
          west_length: "",
          approved_Image: "",
        },
      },
      GIS_PARCEL_AREA: null,
      area: 0,
    },
  },
};
export const wasekaObject = {
  waseka: {
    waseka: {
      waseka_data_select: [],
      table_waseka: [],
    },
    selectedLands: [],
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
        isWithinUrbanBoundry: [],
        mun: {
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
            users: null,
          },
          users: null,
          mun_classes: {
            mun_class_id: 0,
            mun_class: "",
          },
          city_code: null,
        },
        temp: {
          cadResults: {
            header: 0,
            data: [],
          },
          isKrokyUpdateContract: false,
          isUpdateContract: false,
          isPlan: false,
          notify: false,
          hideDrag: false,
          westBoundries0: [],
          southBoundries0: [],
          northBoundries0: [],
          eastBoundries0: [],
          north_Desc0: "",
          east_Desc0: "",
          west_Desc0: "",
          south_Desc0: "",
          area0: "",
        },
      },
    },
  },
};
export const plansObject = {
  plans: {
    plansData: {
      mapviewer: {
        mapHeight: 0,
        mapWidth: 0,
        zoomfactor: 0,
        activeHeight: false,
      },
      image_uploader1: "",
      planDetails: {
        perfectCad: {
          lineFeatures: [],
          cadFeatures: [],
          shapeFeatures: {
            landbase: [],
            boundry: [],
            nearby_plans: [],
            subdivision: [],
            block: [],
          },
          annotations: [],
          pointFeatures: [],
        },
        statisticsParcels: [],
        enableDownlaodCad: false,
        planDescription: "",
        streets: [],
        detailsParcelTypes: [],
        uplodedFeatures: [null, null, null],
        streetsAnnotation: [],
        serviceSubType: {},
        serviceType: {},
        selectedCAD: "",
        selectedCADIndex: 0,
        planUsingSymbol: "",
        hide_details: false,
        servicesTypes: [],
        servicesSubTypes: [],
        TotalParcelArea: 0,
        current_step: 0,
        totalParcelPage: 0,
        minParcelIndex: 0,
        maxParcelIndex: 0,
        totalStreetPage: 0,
        minStreetIndex: 0,
        maxStreetIndex: 0,
      },
    },
  },
};
export const requestsObject = {
  requests: {
    attachments: {
      table_attachments: [],
    },
    requests: {
      attachment_img: "",
      attachment_cad: "",
    },
  },
};
export const approvalSubmissionNotesObject = {
  approvalSubmissionNotes: {
    notes: {
      notes: [],
    },
  },
};
export const ownersDataObject = {
  owners_data: {
    owners: [],
  },
};
export const bda2lObject = {
  bda2l: {
    bands_approval: {
      band_number: {
        selectedValues: [],
        owner_selectedValues: {
          key: "",
          values: [],
          modal: "",
        },
        oldOptions: [],
      },
      urban: "",
      main_header_title: "",
      main_footer_title: "",
      owner_acceptance: "",
    },
  },
};
export const printNotesObject = {
  print_notes: {
    printed_remarks: {
      printType: 0,
      plan_desc: "",
      remarks: [],
    },
  },
};
export const lagnaNotesObject = {
  lagna_notes: {
    lagna_remarks: {
      remarks: [],
    },
  },
};
export const lagnaKararObject = {
  lagna_karar: {
    lagna_karar: {
      planStatus: "",
      plan_number: "",
      plan_name: "",
      ma7dar_lagna_no: "",
      karar_attachment: "",
      plans: "",
      ma7dar_lagna_date: "",
    },
  },
};
export const feesObject = {
  fees: {
    feesInfo: {
      feesValue: "",
    },
  },
};
export const printTakreerObject = {
  print_takreer: {
    takreers: {
      print_check: 0,
    },
  },
};
export const admissionsObject = {
  admissions: {
    admission_ctrl: {
      attachments: [],
    },
  },
};
export const tabtiriPlansObject = {
  tabtiriPlans: {
    tabtiriPlansData: {
      mapviewer: {
        mapHeight: 0,
        mapWidth: 0,
        zoomfactor: 0,
        activeHeight: false,
      },
    },
  },
};
export const remarksObject = {
  remarks: [],
};
export const commentsObject = {
  comments: {},
};
