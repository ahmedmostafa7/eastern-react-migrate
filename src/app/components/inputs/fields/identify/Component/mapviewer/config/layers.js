export const InvestMunicpality = "10501,10506,10505,10513,10512";

export const addFeaturesMapLayers = (() => {

  let returnObj = {};

  let obj = {
    Landbase_Parcel: {
      type: 'polygon',
      label: "بيانات قطع الأراضي",
      outFields: [
        { name: "MUNICIPALITY_NAME", arName: "اسم البلدية", mappingTypes: "" },
        { name: "DISTRICT_NAME", arName: "اسم الحي", mappingTypes: "" },
        { name: "SUBDIVISION_DESCRIPTION", arName: "وصف التقسيم", mappingTypes: "" },
        { name: "PLAN_NO", arName: "رقم المخطط", mappingTypes: "" },
        { name: "PARCEL_BLOCK_NO", arName: "رقم البلوك", mappingTypes: "" },
        { name: "PARCEL_PLAN_NO", arName: "رقم قطعة الأرض", isMainAnnotaion: true, isMandatory: true, mappingTypes: "kml,cad,shape,excel" },
        { name: "PARCEL_MAIN_LUSE", arName: "الاستخدام الرئيسي", mappingTypes: "kml,cad,shape,excel" },
        { name: "PARCEL_SPATIAL_ID", arName: "المميز المكاني لقطعة الأرض", mappingTypes: "", isSpatialId: true },
        { name: "USING_SYMBOL", arName: "رمز الاستخدام", mappingTypes: "kml,cad,shape,excel", isMandatory: true },
        { name: "PARCEL_AREA", arName: " مساحة الأرض ( التقريبية ) م2", isArea: true, mappingTypes: "kml,shape,excel" },
        { name: "serial", arName: "المعرف", notInclude: true, mappingTypes: "excel" },
        { name: "x", arName: "الإحداثي السيني", notInclude: true, mappingTypes: "excel" },
        { name: "y", arName: "الإحداثي الصادي", notInclude: true, mappingTypes: "excel" }
      ],
      spatialRelationLayers: [
        { layerName: "Municipality_Boundary", bindFields: [{ dependLayerField: "MUNICIPALITY_NAME", mappingField: "MUNICIPALITY_NAME" }] },
        //{ layerName: "Sub_Municipality_Boundary", bindFields: [{ dependLayerField: "SUB_MUNICIPALITY_NAME", mappingField: "SUB_MUNICIPALITY_NAME" }] },
        { layerName: "District_Boundary", bindFields: [{ dependLayerField: "DISTRICT_NAME", mappingField: "DISTRICT_NAME" }] },
        { layerName: "Subdivision", bindFields: [{ dependLayerField: "SUBDIVISION_DESCRIPTION", mappingField: "SUBDIVISION_DESCRIPTION" }, { dependLayerField: "SUBDIVISION_SPATIAL_ID", mappingField: "SUBDIVISION_SPATIAL_ID" }, { dependLayerField: "SUBDIVISION_TYPE", mappingField: "SUBDIVISION_TYPE" }] },
        { layerName: "Plan_Data", bindFields: [{ dependLayerField: "PLAN_NO", mappingField: "PLAN_NO" }, { dependLayerField: "PLAN_SPATIAL_ID", mappingField: "PLAN_SPATIAL_ID" }] },
        { layerName: "Survey_Block", bindFields: [{ dependLayerField: "BLOCK_NO", mappingField: "PARCEL_BLOCK_NO" }, { dependLayerField: "BLOCK_SPATIAL_ID", mappingField: "BLOCK_SPATIAL_ID" }] },
        { checkSelfIntersect: true, layerName: "Landbase_Parcel", bindFields: [{ dependLayerField: "PARCEL_PLAN_NO", mappingField: "PARCEL_PLAN_NO" }] },

      ]
    },
    Street_Naming: {
      type: 'line', label: "الشوارع",
      outFields: [
        { name: "MUNICIPALITY_NAME", arName: "اسم البلدية", mappingTypes: "" },
        { name: "DISTRICT_NAME", arName: "اسم الحي", mappingTypes: "" },
        {
          name: "STREET_FULLNAME", arName: "اسم الشارع", isMainAnnotaion: true,
          mappingTypes: "kml,shape,excel", isMandatory: true
        },
        { name: "STREET_NAME_CLS", arName: "تصنيف اسم الطريق", mappingTypes: "kml,shape,excel" },
        { name: "STREET_CLASS", arName: "صنف الشارع", mappingTypes: "kml,shape,excel" },
        { name: "STREET_TYPE", arName: "نوع الشارع", mappingTypes: "kml,shape,excel" },
        { name: "WIDTH", arName: "عرض الشارع", mappingTypes: "kml,shape,excel", isMandatory: true },
        { name: "serial", arName: "المعرف", notInclude: true, mappingTypes: "excel" },
        { name: "x", arName: "الإحداثي السيني", notInclude: true, mappingTypes: "excel" },
        { name: "y", arName: "الإحداثي الصادي", notInclude: true, mappingTypes: "excel" }
      ],
      spatialRelationLayers: [
        { layerName: "Municipality_Boundary", bindFields: [{ dependLayerField: "MUNICIPALITY_NAME", mappingField: "MUNICIPALITY_NAME" }] },
        { layerName: "District_Boundary", bindFields: [{ dependLayerField: "DISTRICT_NAME", mappingField: "DISTRICT_NAME" }] },
        { checkSelfIntersect: true, layerName: "Street_Naming", bindFields: [{ dependLayerField: "STREET_FULLNAME", mappingField: "STREET_FULLNAME" }] },

      ]
    },
    Serivces_Data: {
      type: 'point', label: "بيانات الخدمات",
      outFields: [
        { name: "MUNICIPALITY_NAME", arName: "اسم البلدية", mappingTypes: "" },
        { name: "DISTRICT_NAME", arName: "اسم الحي", mappingTypes: "" },
        { name: "PLAN_NO", arName: "رقم المخطط", mappingTypes: "" },
        {
          name: "SRVC_NO", arName: "مميز الخدمة", isMainAnnotaion: true,
          mappingTypes: "kml,shape,excel"
        },
        { name: "SRVC_TYPE", arName: "نوع الخدمة", mappingTypes: "kml,shape,excel", isMandatory: true },
        { name: "SRVC_DESCRIPTION", arName: "وصف الخدمة", mappingTypes: "kml,shape,excel" },
        { name: "SRVC_NAME", arName: "اسم الخدمة", mappingTypes: "kml,shape,excel", isMandatory: true },
        {
          name: "SERVICE_DVELOPED", arName: "الخدمة منماة او غير منماة",
          mappingTypes: "kml,shape,excel"
        },
        { name: "serial", arName: "المعرف", notInclude: true, mappingTypes: "excel" },
        { name: "x", arName: "الإحداثي السيني", notInclude: true, mappingTypes: "excel" },
        { name: "y", arName: "الإحداثي الصادي", notInclude: true, mappingTypes: "excel" }
      ],
      spatialRelationLayers: [
        { layerName: "Municipality_Boundary", bindFields: [{ dependLayerField: "MUNICIPALITY_NAME", mappingField: "MUNICIPALITY_NAME" }] },
        { layerName: "District_Boundary", bindFields: [{ dependLayerField: "DISTRICT_NAME", mappingField: "DISTRICT_NAME" }] },
        { layerName: "Plan_Data", bindFields: [{ dependLayerField: "PLAN_NO", mappingField: "PLAN_NO" }, { dependLayerField: "PLAN_SPATIAL_ID", mappingField: "PLAN_SPATIAL_ID" }] },
        { layerName: "Landbase_Parcel", bindFields: [{ dependLayerField: "PARCEL_SPATIAL_ID", mappingField: "PARCEL_SPATIAL_ID" }] },
        { checkSelfIntersect: true, layerName: "Serivces_Data", bindFields: [{ dependLayerField: "SRVC_NAME", mappingField: "SRVC_NAME" }] },
      ]
    },
    ASPHALT_MIXER: {
      type: 'point', label: "طبقة الأسفلت",
      outFields: [
        { name: "MUNICIPALITY_NAME", arName: "اسم البلدية", mappingTypes: "" },
        { name: "DISTRICT_NAME", arName: "اسم الحي", mappingTypes: "" },
        {
          name: "COMPANY_NAME", arName: "اسم الشركة",
          mappingTypes: "kml,shape,excel", isMandatory: true
        },
        { name: "NUM", arName: "NUM", isMainAnnotaion: true, mappingTypes: "excel" },
        { name: "RATING", arName: "التصنيف", mappingTypes: "excel" },
        { name: "CAPACITY", arName: "طاقة الاستيعاب", mappingTypes: "kml,shape,excel" },
        { name: "X_COORDINATE", arName: "X_COORDINATE", mappingTypes: "kml,shape,excel" },
        { name: "Y_COORDINATE", arName: "Y_COORDINATE", mappingTypes: "kml,shape,excel" },
        { name: "serial", arName: "المعرف", notInclude: true, mappingTypes: "excel" },

        { name: "x", arName: "الإحداثي السيني", notInclude: true, mappingTypes: "excel" },
        { name: "y", arName: "الإحداثي الصادي", notInclude: true, mappingTypes: "excel" }
      ],
      spatialRelationLayers: [
        { layerName: "Municipality_Boundary", bindFields: [{ dependLayerField: "MUNICIPALITY_NAME", mappingField: "MUNICIPALITY_NAME" }] },
        { layerName: "District_Boundary", bindFields: [{ dependLayerField: "DISTRICT_NAME", mappingField: "DISTRICT_NAME" }] },
        { checkSelfIntersect: true, layerName: "ASPHALT_MIXER", bindFields: [{ dependLayerField: "NUM", mappingField: "NUM" }] },
      ]
    },
  } 

  let user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    (user.groups.find((x) => x.id == 5820)?.layers || []).forEach((layer) => {
      if (obj[layer.name]) {
        returnObj[layer.name] = obj[layer.name];
        returnObj[layer.name].outFields = returnObj[layer.name].outFields.filter((x)=>layer.outfields.find(y=>y.name.toLowerCase().trim() == x.name.toLowerCase())?.is_editable || x.notInclude );
      }
    });
  }

  return returnObj;

})();

export const editAndDeleteMapLayers = (() => {
  let returnObj = {};

  let obj = {
    Plan_Data: {
      type: 'polygon',
      outFields: [
        { name: "MUNICIPALITY_NAME", arName: "اسم البلدية", isDisabled: true, isSummary: true },
        { name: "DISTRICT_NAME", arName: "اسم الحي", isDisabled: true, isSummary: true },
        {
          name: "PLAN_NO", arName: "رقم المخطط", isMandatory: true, isSummary: true,
          isShowLabelOnMap: true
        },
        { name: "PLAN_NAME", arName: "اسم المخطط", isMandatory: true },
        { name: "PLAN_AREA", isArea: true, arName: "مساحة المخطط ( التقريبية ) م2", isMandatory: true },
        { name: "PLAN_CLASS", arName: "تصنيف المخطط" },
        { name: "PLAN_TYPE", arName: "نوع المخطط" }
      ],
      searchFields: [
        {
          field: "MUNICIPALITY_NAME",
          alias: "البلدية",
          zoomLayer: {
            name: "Municipality_Boundary",
            filterField: "MUNICIPALITY_NAME",
          },
        },
        {
          field: "PLAN_NO",
          alias: "رقم المخطط",
          zoomLayer: { name: "Plan_Data", filterField: "PLAN_SPATIAL_ID" },
        },
      ],
      name: 'بيانات المخططات'
    },
    Street_Naming: {
      type: 'line',
      outFields: [
        { name: "MUNICIPALITY_NAME", arName: "اسم البلدية", isDisabled: true, isSummary: true },
        { name: "DISTRICT_NAME", arName: "اسم الحي", isDisabled: true, isSummary: true },
        {
          name: "STREET_FULLNAME", arName: "اسم الشارع",
          isMandatory: true, isSummary: true,
          isShowLabelOnMap: true
        },
        { name: "STREET_NAME_CLS", arName: "تصنيف اسم الطريق" },
        { name: "STREET_CLASS", arName: "صنف الشارع" },
        { name: "STREET_TYPE", arName: "نوع الشارع" },
        { name: "WIDTH", arName: "عرض الشارع", isMandatory: true }
      ],
      searchFields: [
        {
          field: "MUNICIPALITY_NAME",
          alias: "البلدية",
          zoomLayer: {
            name: "Municipality_Boundary",
            filterField: "MUNICIPALITY_NAME",
          },
        },
        {
          field: "STREET_FULLNAME", alias: "اسم الشارع",
          zoomLayer: {
            name: "Street_Naming",
            filterField: "STREET_FULLNAME",
          },
        },
      ],
      name: 'الشوارع'
    },
    Landbase_Parcel: {
      type: 'polygon',
      outFields: [
        { name: "MUNICIPALITY_NAME", arName: "اسم البلدية", isDisabled: true, isSummary: true },
        { name: "DISTRICT_NAME", arName: "اسم الحي", isDisabled: true, isSummary: true },
        { name: "SUBDIVISION_DESCRIPTION", arName: "وصف التقسيم" },
        { name: "PLAN_NO", arName: "رقم المخطط", isSummary: true },
        { name: "PARCEL_BLOCK_NO", arName: "رقم البلوك" },
        {
          name: "PARCEL_PLAN_NO", arName: "رقم قطعة الأرض",
          isMandatory: true, isSummary: true, isShowLabelOnMap: true
        },
        { name: "PARCEL_MAIN_LUSE", arName: "الاستخدام الرئيسي" },
        { name: "USING_SYMBOL", arName: "رمز الاستخدام", isMandatory: true },
        { name: "PARCEL_AREA", isArea: true, arName: " مساحة الأرض ( التقريبية ) م2", isMandatory: true },
      ],
      searchFields: [
        {
          field: "MUNICIPALITY_NAME",
          alias: "اسم البلدية",
          zoomLayer: {
            name: "Municipality_Boundary",
            filterField: "MUNICIPALITY_NAME",
          },
        },
        {
          field: "DISTRICT_NAME",
          alias: "اسم الحي",
          zoomLayer: { name: "District_Boundary", filterField: "DISTRICT_NAME" },
        },
        {
          field: "PLAN_NO",
          alias: "رقم المخطط",
          zoomLayer: { name: "Plan_Data", filterField: "PLAN_SPATIAL_ID" },
        },
        {
          field: "SUBDIVISION_TYPE",
          alias: "نوع التقسيم"
        },
        {
          field: "SUBDIVISION_DESCRIPTION",
          alias: "وصف التقسيم"
        },
        {
          field: "PARCEL_BLOCK_NO",
          alias: "رقم البلوك",
          zoomLayer: { name: "Survey_Block", filterField: "BLOCK_SPATIAL_ID" },
        },
        {
          field: "PARCEL_PLAN_NO", alias: "رقم الأرض", isServerSideSearch: true,
          zoomLayer: { name: "Landbase_Parcel", filterField: "PARCEL_SPATIAL_ID" }
        },
      ],
      name: 'الأراضي'
    },
    Serivces_Data: {
      type: 'point',
      name: 'بيانات الخدمات',
      searchFields: [
        {
          field: "MUNICIPALITY_NAME",
          alias: "اسم البلدية",
          zoomLayer: {
            name: "Municipality_Boundary",
            filterField: "MUNICIPALITY_NAME",
          }, isSummary: true
        },
        {
          field: "DISTRICT_NAME",
          alias: "اسم الحي",
          zoomLayer: { name: "District_Boundary", filterField: "DISTRICT_NAME" },
          isSummary: true
        },
        {
          field: "PLAN_NO",
          alias: "رقم المخطط",
          zoomLayer: { name: "Plan_Data", filterField: "PLAN_SPATIAL_ID" },
        },
        { field: "SRVC_TYPE", alias: "نوع الخدمة" },
        { field: "SRVC_SUBTYPE", alias: "الاستخدام الفرعى للخدمة" },
        {
          field: "SRVC_NAME", alias: "اسم الخدمة",
          zoomLayer: {
            name: "Serivces_Data",
            filterField: "SRVC_NAME",
          }
          , isSummary: true
        },
      ],
      outFields: [
        { name: "MUNICIPALITY_NAME", arName: "اسم البلدية", isDisabled: true },
        { name: "DISTRICT_NAME", arName: "اسم الحي", isDisabled: true },
        { name: "PLAN_NO", arName: "رقم المخطط" },
        { name: "SRVC_NO", arName: "مميز الخدمة" },
        { name: "SRVC_TYPE", arName: "نوع الخدمة", isMandatory: true },
        { name: "SRVC_DESCRIPTION", arName: "وصف الخدمة" },
        {
          name: "SRVC_NAME", arName: "اسم الخدمة", isMandatory: true,
          isShowLabelOnMap: true
        }
      ]
    },
    ASPHALT_MIXER: {
      type: 'point',
      name: 'طبقة الأسفلت',
      searchFields: [
        {
          field: "MUNICIPALITY_NAME",
          alias: "اسم البلدية",
          zoomLayer: {
            name: "Municipality_Boundary",
            filterField: "MUNICIPALITY_NAME",
          }, isSummary: true
        },
        {
          field: "DISTRICT_NAME",
          alias: "اسم الحي",
          zoomLayer: { name: "District_Boundary", filterField: "DISTRICT_NAME" },
          isSummary: true
        },
        { field: "RATING", alias: "التصنيف" },
        { field: "COMPANY_NAME", alias: "اسم الشركة" },
        {
          field: "NUM", alias: "NUM",
          zoomLayer: {
            name: "ASPHALT_MIXER",
            filterField: "NUM",
          }
          , isSummary: true
        },
      ],
      outFields: [
        { name: "MUNICIPALITY_NAME", arName: "اسم البلدية", isDisabled: true },
        { name: "DISTRICT_NAME", arName: "اسم الحي", isDisabled: true },
        { name: "COMPANY_NAME", arName: "اسم الشركة", isMandatory: true },
        { name: "NUM", arName: "NUM", isShowLabelOnMap: true, isMandatory: true },
        { name: "CAPACITY", arName: "طاقة الاستيعاب" },
        { name: "RATING", arName: "التصنيف" },
        { name: "X_COORDINATE", arName: "X", isMandatory: true },
        {
          name: "Y_COORDINATE", arName: "Y", isMandatory: true,
        }
      ]

    }
  }
  let user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    (user.groups.find((x) => x.id == 5820)?.layers || []).forEach((layer) => {
      if (obj[layer.name]) {
        returnObj[layer.name] = obj[layer.name];
        returnObj[layer.name].outFields = returnObj[layer.name].outFields.filter((x)=>layer.outfields.find(y=>y.name.toLowerCase().trim() == x.name.toLowerCase())?.is_editable );
      }
    });
  }
  return returnObj;

})();

export const investMapLayers = {

  Invest_Site_Polygon: {
    type: 'polygon',
    outFields: [
      { name: "MUNICIPALITY_NAME", arName: "اسم البلدية", isDisabled: true, isSummary: true },
      { name: "SUB_MUNICIPALITY_NAME", arName: "اسم البلدية الفرعية", isDisabled: true, isSummary: true },
      { name: "DISTRICT_NAME", arName: "اسم الحي", isDisabled: true, isSummary: true },
      { name: "PLAN_NO", arName: "رقم المخطط", isSummary: true },
      { name: "BLOCK_NO", arName: "رقم البلوك" },
      {
        name: "PARCEL_PLAN_NO", arName: "رقم قطعة الأرض",
        isMandatory: true, isSummary: true, isShowLabelOnMap: true
      },
      { name: "USING_SYMBOL", arName: "رمز الاستخدام", isMandatory: true },
      { name: "SITE_AREA", isArea: true, arName: " مساحة الأرض ( التقريبية ) م2", isMandatory: true },
      { name: "SITE_GEOSPATIAL_ID" },
    ],
    searchFields: [
      {
        field: "MUNICIPALITY_NAME",
        alias: "اسم البلدية",
        zoomLayer: {
          name: "Municipality_Boundary",
          filterField: "MUNICIPALITY_NAME",
        },
      },
      {
        field: "DISTRICT_NAME",
        alias: "اسم الحي",
        zoomLayer: { name: "District_Boundary", filterField: "DISTRICT_NAME" },
      },
      {
        field: "PLAN_NO",
        alias: "رقم المخطط",
      },
      {
        field: "BLOCK_NO",
        alias: "رقم البلوك",
      },
      {
        field: "PARCEL_PLAN_NO", alias: "رقم الأرض", isServerSideSearch: true,
        zoomLayer: { name: "Invest_Site_Polygon", filterField: "SITE_GEOSPATIAL_ID" }
      },
    ],
    name: 'الأراضي'
  },
}

export const layersSetting = {
  Province_Boundary: {
    name: 'حدود الأمانة',
    outFields: [
      'OBJECTID',
      'PROVINCE_NAME',
      'PROVINCE_ENGNAME'
    ],
    aliasOutFields: [
      'أسم الأمانة',
      'اسم الأمانة باللغة الانجليزية'
    ]
  },
  Survey_Block_H: {
    name: 'بلوك',
    isHidden: true
  },
  Services_H: {
    isHidden: true
  },
  // Survey_Block_H: {
  //   isHidden: true
  // },
  Subdivision_H: {
    isHidden: true
  },
  Plans_H: {
    isHidden: true
  },
  Landbase_Parcel_H: {
    fromAnotherLayer: [{ fieldName: 'SUBDIVISION_TYPE', layerName: 'Subdivision', outFields: ['SUBDIVISION_DESCRIPTION'] }],
    isSearchable: true,
    name: 'أرشيف الأراضي',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'PLAN_NO',
      'PARCEL_PLAN_NO',
      'DISTRICT_NAME',
      'PARCEL_AREA',
      'USING_SYMBOL',
      'PARCEL_BLOCK_NO',
      'SUBDIVISION_TYPE',
      'PARCEL_MAIN_LUSE',
      'PARCEL_SUB_LUSE',
      'LANDMARK_NAME',
      'BLDG_CONDITIONS',
      'PARCEL_SPATIAL_ID'
    ],
    dependecies: [
      {
        name: 'Tbl_Parcel_Conditions',
        icon: 'fa fa-building-o',
        filter: 'USING_SYMBOL',
        isTable: true
      }
    ],
    filter: 'PARCEL_SPATIAL_ID',
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'رقم المخطط',
      'رقم قطعة الأرض بالمخطط',
      'اسم الحى',
      'مساحة قطعة الأرض حسب المخطط',
      'رمز اشتراط البناء',
      'رقم البلك',
      'نوع التقسيم',
      'الأستخدام الرئيسي لقطعة الأرض',
      'الأستخدام الفرعي لقطعة الأرض',
      'إسم المبنى القائم',
      'وصف اشتراط البناء'
    ],
    area: [
      {
        type: 'sum',
        field: 'PARCEL_AREA',
        name: 'area'
      }
    ],
    statistic: {
      allFeature: true,
      groupBy: 'PARCEL_SUB_LUSE',
      dependenent: 'Landbase_Parcel',
      aggregate: [
        {
          type: 'sum',
          field: 'PARCEL_AREA',
          name: 'AREA'
        },
        {
          type: 'count',
          field: 'OBJECTID',
          name: 'RESCOUNT'
        }
      ]
    }

  },
  Street_Naming_H: {
    isHidden: true
  },
  Proposed_Service: {
    isHidden: true
  },
  Proposed_Survey_Block: {
    isHidden: true
  },
  Proposed_Subdivision: {
    isHidden: true
  },
  Proposed_Plan_data: {
    isHidden: true
  },
  Service_Data: {
    isHidden: true
  },
  Proposed_Landbase_Parcel: {
    isHidden: true
  },
  Proposed_Street_Naming: {
    isHidden: true
  },
  Invst_Cntrct: {
    name: 'استثمار نقاط',
    outFields: [
      'OBJECTID',
      'INVST_CNTRCT_NO',
      'INVST_CNTRCT_DT',
      'INVST_PRJCT_NM',
      'INVST_PRJCT_LOC',
      'INVSTR_NM',
      'INVST_LCNS_NO',
      'MUNICIPALITY',
      'DISTRICT',
      'PLAN_NO',
      'STREET_NAME'
    ],
    aliasOutFields: [
      'رقم العقد',
      'تاريخ العقد',
      'إسم المشروع',
      'موقع المشروع',
      'إسم المستثمر',
      'رقم الرخصة',
      'اسم البلدية',
      'اسم الحى',
      'رقم المخطط',
      'اسم الشارع'
    ]
  },
  Boards: {
    name: 'استثمار - طبقة اللوحات المعدنية',
    outFields: [
      'OBJECTID',
      'COMPANY_NAME',
      'BOARD_SER',
      'H_S_CONT_DATE',
      'BOARD_STATE'
    ],
    aliasOutFields: [
      'اسم الوكالة',
      'رقم التسلسل',
      'تاريخ بداية العقد',
      'حالة اللوحة'
    ]
  },
  Invst_Cntrct_Polygon: {
    name: 'استثمار مضلعات',
    outFields: [
      'OBJECTID',
      'INVST_CNTRCT_NO',
      'INVST_CNTRCT_DT',
      'INVST_PRJCT_NM',
      'INVST_PRJCT_LOC',
      'INVSTR_NM',
      'INVST_LCNS_NO',
      'MUNICIPALITY',
      'DISTRICT',
      'PLAN_NO',
      'STREET_NAME'
    ],
    aliasOutFields: [
      'رقم العقد',
      'تاريخ العقد',
      'إسم المشروع',
      'موقع المشروع',
      'إسم المستثمر',
      'رقم الرخصة',
      'اسم البلدية',
      'اسم الحى',
      'رقم المخطط',
      'اسم الشارع'
    ]
  },
  Municipality_Boundary: {
    order: 2,
    name: 'حدود البلدية',
    outFields: [
      'OBJECTID',
      'PROVINCE_NAME',
      'MUNICIPALITY_NAME',
      'MUNICIPLAITY_TYPE'
    ],
    aliasOutFields: [
      'أسم الأمانة',
      'اسم البلدية',
      'نوع البلدية'
    ],
    chartInfo: { text: '', displayField: 'MUNICIPALITY_NAME' },
    filter: 'MUNICIPALITY_NAME',
    filerType: 'subType',
    area: [{
      type: 'sum',
      field: 'SHAPE.AREA',
      name: 'area'
    }],
    // statistic: chartStaticsSettigns.landBaseParcel
  },
  Sub_Municipality_Boundary: {
    order: 3,
    chartInfo: { text: '', displayField: 'SUB_MUNICIPALITY_NAME' },
    name: 'حدود البلديات الفرعية',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME'
    ],
    filter: 'SUB_MUNICIPALITY_NAME',
    filerType: 'subType',
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية'
    ],
    // statistic: chartStaticsSettigns.landBaseParcel
  },
  UrbanAreaBoundary: {
    order: 1,
    chartInfo: { text: '', displayField: 'URBAN_BOUNDARY_TYPE' },
    name: 'حدود النطاق العمرانى',
    outFields: [
      'OBJECTID',
      'PROVINCE_NAME',
      'URBAN_BOUNDARY_TYPE'
    ],
    aliasOutFields: [
      'اسم الأمانة',
      'نوع النطاق العمرانى'
    ]
  },
  District_Boundary: {
    order: 4,
    chartInfo: { text: 'حي', displayField: 'DISTRICT_NAME' },
    isSearchable: true,
    name: 'حدود الاحياء',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'DISTRICT_NAME'
    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم الحى'
    ],
    filerType: 'domain',
    filter: 'DISTRICT_NAME',
    // statistic: chartStaticsSettigns.landBaseParcel
  },
  Plan_Data: {
    order: 5,
    chartInfo: { text: 'مخطط رقم', displayField: 'PLAN_NO' },
    isSearchable: true,
    name: 'بيانات المخططات',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'PLAN_NO',
      'PLAN_NAME',
      'PLAN_SAK_NO',
      'PLAN_AREA',
      'PLAN_CLASS',
      'PLAN_TYPE',
      'PLAN_STATUS',
      'PLAN_SPATIAL_ID'
    ],
    dependecies: [
      {
        name: 'Landbase_Parcel',
        icon: 'fa fa-sitemap'
      }],
    filter: 'PLAN_SPATIAL_ID',
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'رقم المخطط',
      'اسم المخطط',
      'رقم صك الملكية',
      'المساحة الكلية للمخطط - كم2',
      'تصنيف المخطط',
      'نوع المخطط',
      'حالة المخطط'
    ],
    area: [{
      type: 'sum',
      field: 'PLAN_AREA',
      name: 'area'
    }],
    // statistic: chartStaticsSettigns.landBaseParcel

  },
  Pre_Plan_Data: {
    order: 5,
    chartInfo: { text: 'مخطط رقم', displayField: 'PLAN_NO' },
    isSearchable: true,
    name: 'بيانات المخططات (المعتمد ابتدائيا)',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'PLAN_NO',
      'PLAN_NAME',
      'PLAN_SAK_NO',
      'PLAN_AREA',
      'PLAN_CLASS',
      'PLAN_TYPE',
      'PLAN_STATUS',
      'PLAN_SPATIAL_ID'
    ],
    dependecies: [
      {
        name: 'Landbase_Parcel',
        icon: 'fa fa-sitemap'
      }],
    filter: 'PLAN_SPATIAL_ID',
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'رقم المخطط',
      'اسم المخطط',
      'رقم صك الملكية',
      'المساحة الكلية للمخطط - كم2',
      'تصنيف المخطط',
      'نوع المخطط',
      'حالة المخطط'
    ],
    area: [{
      type: 'sum',
      field: 'PLAN_AREA',
      name: 'area'
    }],
    // statistic: chartStaticsSettigns.landBaseParcel

  },
  Subdivision: {
    order: 6,
    chartInfo: { text: '', displayField: 'SUBDIVISION_DESCRIPTION' },
    name: 'التقسيم',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'SUBDIVISION_NO',
      'PLAN_NO',
      'SUBDIVISION_AREA',
      'SUBDIVISION_DESCRIPTION',
      'SUBDIVISION_TYPE',
      'SUBDIVISION_SPATIAL_ID'
    ],
    filter: 'SUBDIVISION_SPATIAL_ID',
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'رقم التقسيم',
      'رقم المخطط',
      'مساحة التقسيم',
      'وصف التقسيم',
      'نوع التقسيم'
    ],
    area: [{
      type: 'sum',
      field: 'SUBDIVISION_AREA',
      name: 'area'
    }],
    // statistic: chartStaticsSettigns.landBaseParcel
  },
  Pre_Subdivision: {
    order: 6,
    chartInfo: { text: '', displayField: 'SUBDIVISION_DESCRIPTION' },
    name: 'التقسيم (المعتمد ابتدائيا)',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'SUBDIVISION_NO',
      'PLAN_NO',
      'SUBDIVISION_AREA',
      'SUBDIVISION_DESCRIPTION',
      'SUBDIVISION_TYPE',
      'SUBDIVISION_SPATIAL_ID'
    ],
    filter: 'SUBDIVISION_SPATIAL_ID',
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'رقم التقسيم',
      'رقم المخطط',
      'مساحة التقسيم',
      'وصف التقسيم',
      'نوع التقسيم'
    ],
    area: [{
      type: 'sum',
      field: 'SUBDIVISION_AREA',
      name: 'area'
    }],
    // statistic: chartStaticsSettigns.landBaseParcel
  },
  Satellite_Image_Boundary: {
    name: 'حدود تغطية صور الأقمار الصناعية',
    outFields: [
      'SATTELITE_IMAGE_DATE',
      'SATELLITE_IMAGE_SOURCE',
      'COVER_AREA'
    ],
    aliasOutFields: [
      'تاريخ صورة القمر الصناعي',
      'مصدر صورة القمر الصناعي',
      'مساحة نطاق التغطية - كم2'
    ]
  },

  Serivces_Data: {
    order: 8,
    isSearchable: true,
    depenedFilter: [{ fieldName: 'DISTRICT_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['DISTRICT_NAME'], layer: 'District_Boundary' },
    { fieldName: 'SUB_MUNICIPALITY_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['SUB_MUNICIPALITY_NAME'], layer: 'Sub_Municipality_Boundary' }],
    name: 'بيانات الخدمات',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'DISTRICT_NAME',
      'SUB_MUNICIPALITY_NAME',
      'CITY_NAME',
      'PLAN_NO',
      'SRVC_NAME',
      'SRVC_TYPE',
      'SRVC_DESCRIPTION',
      'SRVC_SUBTYPE'
      // "SRVC_OWNER_TYPE"
    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم الحى',
      'اسم البلدية الفرعية',
      'اسم المدينة',
      'رقم المخطط',
      'اسم الخدمة',
      'نوع الخدمة',
      'وصف الخدمة',
      'الاستخدام الفرعى للخدمة'
      // "ملكية الخدمة"
    ]
  },
  LightPoles: {
    name: 'اعمدة الإنارة',
    isHidden: true,
    outFields: [
      'OBJECTID',
      'CITY_NAME',
      'STREET_NAME',
      'POLE_INSTALLATIONDATE',
      'POLE_ENABLED',
      'POLE_LAMBS_COUNT',
      'POLE_MATERIAL_TYPE',
      'POLE_HEIGHT',
      'POLE_LAMPTYPE',
      'POLE_USAGE'
    ],
    aliasOutFields: [
      'اسم المدينة',
      'اسم الشارع',
      'تاريخ التركيب',
      'حالة عمود الإنارة',
      'عدد المصابيح',
      'مادة صنع العمود',
      'ارتفاع العمود',
      'نوع المصباح',
      'نوع خدمة العمود'
    ]
  },
  GCP_Data: {
    name: 'جدول بيانات نقاط الثوابت الأرضية',
    outFields: [
      'OBJECTID',
      'GCP_NO',
      'GCP_SOURCE',
      'GCP_ORDER',
      'GCP_STATUS',
      'X_COORDINATE',
      'Y_COORDINATE',
      'GCP_MATRIAL'
    ],
    aliasOutFields: [
      'رقم نقطة التحكم',
      'مصدر النقطة',
      'درجة النقطة',
      'حالة النقطة',
      'الاحداثيات الشرقية',
      'الاحداثيات الشمالية',
      'مادة صنع النقة'
    ]
  },
  Survey_Block: {
    order: 7,
    depenedFilter: [{ fieldName: 'DISTRICT_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['DISTRICT_NAME'], layer: 'District_Boundary' },
    { fieldName: 'SUB_MUNICIPALITY_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['SUB_MUNICIPALITY_NAME'], layer: 'Sub_Municipality_Boundary' }],
    chartInfo: { text: 'بلوك رقم', displayField: 'BLOCK_NO' },
    name: 'بيانات البلكات المرفوعة مساحياً',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'BLOCK_NO',
      'PLAN_NO',
      'BLOCK_LUSE',
      'BLOCK_AREA',
      'DISTRICT_NAME',
      'CITY_NAME',
      'BLOCK_SPATIAL_ID'
    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'رقم البلك',
      'رقم المخطط',
      'استخدام البلك',
      'مساحة البلك',
      'اسم الحى',
      'اسم المدينة'
    ],
    filter: 'BLOCK_SPATIAL_ID',
    area: [{
      type: 'sum',
      field: 'BLOCK_AREA',
      name: 'area'
    }],
    // statistic: chartStaticsSettigns.landBaseParcel

  },
  Pre_Survey_Block: {
    order: 7,
    depenedFilter: [{ fieldName: 'DISTRICT_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['DISTRICT_NAME'], layer: 'District_Boundary' },
    { fieldName: 'SUB_MUNICIPALITY_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['SUB_MUNICIPALITY_NAME'], layer: 'Sub_Municipality_Boundary' }],
    chartInfo: { text: 'بلوك رقم', displayField: 'BLOCK_NO' },
    name: 'بيانات البلكات المرفوعة مساحياً (المعتمد ابتدائيا)',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'BLOCK_NO',
      'PLAN_NO',
      'BLOCK_LUSE',
      'BLOCK_AREA',
      'DISTRICT_NAME',
      'CITY_NAME',
      'BLOCK_SPATIAL_ID'
    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'رقم البلك',
      'رقم المخطط',
      'استخدام البلك',
      'مساحة البلك',
      'اسم الحى',
      'اسم المدينة'
    ],
    filter: 'BLOCK_SPATIAL_ID',
    area: [{
      type: 'sum',
      field: 'BLOCK_AREA',
      name: 'area'
    }],
    // statistic: chartStaticsSettigns.landBaseParcel

  },
  Block_Boundary: {
    name: 'بيانات حدود البلك',
    outFields: [
      'OBJECTID',
      'BOUNDARY_NO',
      'FROM_CORNER',
      'TO_CORNER',
      'BOUNDARY_LENGTH',
      'BOUNDARY_DESC',
      'BOUNDARY_DETAILS'
    ],
    aliasOutFields: [
      'رقم الحد',
      'رقم نقطة بداية الحد',
      'رقم نقطة نهاية الحد',
      'طول الحد - م',
      'وصف الحد',
      'وصف تفصيلى للحد'
    ]
  },
  Block_Corner: {
    name: 'نقاط اركان البلك',
    outFields: [
      'OBJECTID',
      'CORNER_NO',
      'XUTM_COORD',
      'YUTM_COORD',
      'XGCS_COORD',
      'YGCS_COORD'
    ],
    aliasOutFields: [
      'رقم النقطة بالبلك',
      'الإحداثي السينى',
      'الإحداثي الصادي',
      'إحداثي خط الطول',
      'إحداثي دائرة العرض'
    ]
  },
  Survey_Parcel: {
    order: 8,
    fromAnotherLayer: [{ fieldName: 'SUBDIVISION_TYPE', layerName: 'Subdivision', outFields: ['SUBDIVISION_DESCRIPTION'] }],
    isSearchable: true,
    name: 'بيانات قطع الأراضى المرفوعة مساحياً',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'PLAN_NO',
      'PARCEL_PLAN_NO',
      'DISTRICT_NAME',
      'PARCEL_AREA',
      'USING_SYMBOL',
      'PARCEL_BLOCK_NO',
      'SUBDIVISION_TYPE',
      'BLDG_CONDITIONS',
      // "ACTUAL_MAINLANDUSE",
      // "LANDMARK_NAME",
      'PARCEL_SPATIAL_ID'
    ],
    dependecies: [{
      name: 'Tbl_Parcel_Conditions',
      icon: 'fa fa-building-o',
      filter: 'USING_SYMBOL',
      isTable: true
    }],
    filter: 'PARCEL_SPATIAL_ID',
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'رقم المخطط',
      'رقم قطعة الأرض بالمخطط',
      'اسم الحى',
      'المساحة التقريبية م٢',
      'رمز الاستخدام',
      'رقم البلك',
      'نوع التقسيم',
      // "وصف اشتراط البناء",
      // "الاستخدام الفعلى لقطعة الارض",
      'اسم المعلم'
    ],
    area: [{
      type: 'sum',
      field: 'PARCEL_AREA',
      name: 'area'
    }],
    statistic: {
      allFeature: true,
      groupBy: 'USING_SYMBOL',
      dependenent: 'Survey_Parcel',
      aggregate: [{
        type: 'sum',
        field: 'PARCEL_AREA',
        name: 'AREA'
      }, {
        type: 'count',
        field: 'OBJECTID',
        name: 'RESCOUNT'
      }]
    }

  },
  Landbase_Parcel: {
    isPublicSearchable: true,
    displayField: "PARCEL_PLAN_NO",
    order: 8,
    fromAnotherLayer: [{ fieldName: 'SUBDIVISION_TYPE', layerName: 'Subdivision', outFields: ['SUBDIVISION_DESCRIPTION'] }],
    depenedFilter: [{ fieldName: 'DISTRICT_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['DISTRICT_NAME'], layer: 'District_Boundary' },
    { fieldName: 'DISTRICT_NAME', depenedField: 'SUB_MUNICIPALITY_NAME', outFields: ['DISTRICT_NAME'], layer: 'District_Boundary' },
    { fieldName: 'SUB_MUNICIPALITY_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['SUB_MUNICIPALITY_NAME'], layer: 'Sub_Municipality_Boundary' }],

    isSearchable: true,
    name: 'بيانات قطع الأراضى',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'PLAN_NO',
      'PARCEL_PLAN_NO',
      'DISTRICT_NAME',
      'PARCEL_AREA',
      'DETAILED_LANDUSE',
      'USING_SYMBOL',
      'PARCEL_BLOCK_NO',
      'SUBDIVISION_TYPE',
      'SUBDIVISION_DESCRIPTION',
      'PARCEL_MAIN_LUSE',
      'PARCEL_SUB_LUSE',
      'LANDMARK_NAME',
      'BLDG_CONDITIONS',
      'PARCEL_SPATIAL_ID',
      'LIC_NO',
      'LIC_YEAR',
      'REQ_TASK_TEXT'
    ],
    dependecies: [
      {
        name: 'Tbl_Parcel_Conditions',
        icon: 'fa fa-building-o',
        filter: 'USING_SYMBOL',
        isTable: true
      },
      {
        name: 'TBL_Parcel_LIC',
        icon: 'fa fa-file-pdf-o',
        filter: 'PARCEL_SPATIAL_ID',
        isTable: true
      },
      {
        name: 'Tbl_SHOP_LIC_MATCHED',
        icon: 'fa fa-shopping-cart',
        filter: 'PARCEL_SPATIAL_ID',
        isTable: true
      }
    ],
    filter: 'PARCEL_SPATIAL_ID',
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'رقم المخطط',
      'رقم قطعة الأرض بالمخطط',
      'اسم الحى',
      'المساحة التقريبية م2',
      'الاستخدام التفصيلى',
      'رمزالاستخدام',
      'رقم البلك',
      'نوع التقسيم',
      'وصف التقسيم',
      'الأستخدام الرئيسي لقطعة الأرض',
      'الأستخدام الفرعي لقطعة الأرض',
      'اسم المبنى القائم',
      'وصف اشتراط البناء',
      'رقم الرخصه',
      'تاريخ الرخصه',
      'حالة التيار',
      'عدد الادوار',
      'نوع الطلب',
      'نوع المبنى',
      'حالة الطلب',
      'رقم اشتراط المنطقة',
      'المساحة من الصك',
      'رقم الخطاب',
      'تاريخ الخطاب',
      'التاريخ الهجرى',
      'عدد الوحدات الصناعية',
      'عدد الوحدات السكنية',
      'عدد الخدمات',
      'رقم الهوية',
      'تاريخ الهوية',
      'مصدر الهوية',
      'مستوى دقة البيان',
      'اسم المحل',
      'رقم رخصة المحل',
      'تاريخ رخصة المحل',
      'رقم رخصة الارض'

    ],
    area: [
      {
        type: 'sum',
        field: 'PARCEL_AREA',
        name: 'area'
      }
    ],
    // statistic: chartStaticsSettigns.landBaseParcel

  },
  Pre_Landbase_Parcel: {
    isPublicSearchable: true,
    displayField: "PARCEL_PLAN_NO",
    order: 8,
    fromAnotherLayer: [{ fieldName: 'SUBDIVISION_TYPE', layerName: 'Subdivision', outFields: ['SUBDIVISION_DESCRIPTION'] }],
    depenedFilter: [{ fieldName: 'DISTRICT_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['DISTRICT_NAME'], layer: 'District_Boundary' },
    { fieldName: 'DISTRICT_NAME', depenedField: 'SUB_MUNICIPALITY_NAME', outFields: ['DISTRICT_NAME'], layer: 'District_Boundary' },
    { fieldName: 'SUB_MUNICIPALITY_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['SUB_MUNICIPALITY_NAME'], layer: 'Sub_Municipality_Boundary' }],

    isSearchable: true,
    name: 'بيانات قطع الأراضى (المعتمد ابتدائيا)',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'PLAN_NO',
      'PARCEL_PLAN_NO',
      'DISTRICT_NAME',
      'PARCEL_AREA',
      'DETAILED_LANDUSE',
      'USING_SYMBOL',
      'PARCEL_BLOCK_NO',
      'SUBDIVISION_TYPE',
      'SUBDIVISION_DESCRIPTION',
      'PARCEL_MAIN_LUSE',
      'PARCEL_SUB_LUSE',
      'LANDMARK_NAME',
      'BLDG_CONDITIONS',
      'PARCEL_SPATIAL_ID',
      'LIC_NO',
      'LIC_YEAR',
      'REQ_TASK_TEXT'
    ],
    dependecies: [
      {
        name: 'Tbl_Parcel_Conditions',
        icon: 'fa fa-building-o',
        filter: 'USING_SYMBOL',
        isTable: true
      },
      {
        name: 'TBL_Parcel_LIC',
        icon: 'fa fa-file-pdf-o',
        filter: 'PARCEL_SPATIAL_ID',
        isTable: true
      },
      {
        name: 'Tbl_SHOP_LIC_MATCHED',
        icon: 'fa fa-shopping-cart',
        filter: 'PARCEL_SPATIAL_ID',
        isTable: true
      }
    ],
    filter: 'PARCEL_SPATIAL_ID',
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'رقم المخطط',
      'رقم قطعة الأرض بالمخطط',
      'اسم الحى',
      'المساحة التقريبية م2',
      'الاستخدام التفصيلى',
      'رمزالاستخدام',
      'رقم البلك',
      'نوع التقسيم',
      'وصف التقسيم',
      'الأستخدام الرئيسي لقطعة الأرض',
      'الأستخدام الفرعي لقطعة الأرض',
      'اسم المبنى القائم',
      'وصف اشتراط البناء',
      'رقم الرخصه',
      'تاريخ الرخصه',
      'حالة التيار',
      'عدد الادوار',
      'نوع الطلب',
      'نوع المبنى',
      'حالة الطلب',
      'رقم اشتراط المنطقة',
      'المساحة من الصك',
      'رقم الخطاب',
      'تاريخ الخطاب',
      'التاريخ الهجرى',
      'عدد الوحدات الصناعية',
      'عدد الوحدات السكنية',
      'عدد الخدمات',
      'رقم الهوية',
      'تاريخ الهوية',
      'مصدر الهوية',
      'مستوى دقة البيان',
      'اسم المحل',
      'رقم رخصة المحل',
      'تاريخ رخصة المحل',
      'رقم رخصة الارض'

    ],
    area: [
      {
        type: 'sum',
        field: 'PARCEL_AREA',
        name: 'area'
      }
    ],
    // statistic: chartStaticsSettigns.landBaseParcel

  },
  Tbl_SHOP_LIC_MATCHED: {
    name: 'رخص المحلات',
    outFields: [
      'OBJECTID',
      'SHOP_NAME',
      'S_SHOP_LIC_NO',
      'S_SHOP_YEAR',
      'S_LIC_NO'
    ],
    isHidden: true,
    aliasOutFields: [
      'اسم المحل',
      'رقم رخصة المحل',
      'تاريخ رخصة المحل',
      'رقم رخصة الارض'

    ]
  },
  TBL_Parcel_LIC: {
    name: 'رخص البناء',
    outFields: [
      'OBJECTID',
      'LIC_NO',
      'LIC_YEAR',
      'H_ISSUE_DATE',
      'NO_FLOORS',
      'REQ_TASK_TEXT',
      'ORD_TYPE',
      'BLD_TYPE',
      'RECORD_STATUS_TEXT',
      'REGION_USE_NO',
      'AREA_IN_ORD',
      'EL_LETTER_NO',
      'EL_LETTER_YEAR',
      'H_DATE',
      'REQ_TASK_TEXT',
      'NO_IND_UNITS',
      'NO_LIV_UNITS',
      'NO_SRV_UNITS',
      'OWNER_ID_NO',
      'OWNER_ID_DATE',
      'OWNER_ID_SOURCE',
      'RANK',
      'RANK_DESCRIPTION'
    ],
    isHidden: true,
    aliasOutFields: [
      'رقم الرخصة',
      'سنة إصدار الرخصة',
      'تاريخ اصدار الرخصة',
      'عدد الادوار',
      'REQ_TASK_TEXT',
      'نوع الطلب',
      'نوع المبنى',
      'حالة الطلب',
      'رقم اشتراط المنطقة',
      'المساحة من الصك',
      'رقم الخطاب',
      'تاريخ الخطاب',
      'التاريخ الهجرى',
      'حالة التيار',
      'عدد الوحدات الصناعية',
      'عدد الوحدات السكنية',
      'عدد الخدمات',
      'رقم الهوية',
      'تاريخ الهوية',
      'مصدر الهوية',
      'مستوى دقة البيان',
      'دقة البيان'
    ]
  },
  Parcel_Boundary: {
    name: 'جدول أضلاع الأراضي',
    outFields: [
      'OBJECTID',
      'BOUNDARY_NO',
      'FROM_CORNER',
      'TO_CORNER',
      'BOUNDARY_LENGTH',
      'BOUNDARY_DIRECTION',
      'BOUNDARY_DESCRIPTION'
    ],
    isHidden: true,
    aliasOutFields: [
      'رقم الحد',
      'رقم نقطة بداية الضلع',
      'رقم نقطة نهاية الضلع',
      'طول الحد - م',
      'Boundary_Direction',
      'وصف الحد'
    ]
  },
  Parcel_Corner: {
    name: 'جدول نقاط إحداثيات الأركان',
    outFields: [
      'OBJECTID',
      'CORNER_NO',
      'XUTM_COORD',
      'YUTM_COORD',
      'XGCS_COORD',
      'YGCS_COORD'
    ],
    isHidden: true,
    aliasOutFields: [
      'رقم النقطة بقطعة الارض',
      'الإحداثي السينى',
      'الإحداثي الصادي',
      'إحداثي خط الطول',
      'إحداثي خط العرض'
    ]
  },
  Building_Data: {
    name: 'بيانات المبانى',
    outFields: [
      'OBJECTID',
      'BLDG_NO',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'DISTRICT_NAME',
      'STREET_NAME',
      'BLDG_NAME',
      'BLDG_ADDRESS',
      'BLDG_STATUS',
      'BLDG_AREA',
      'BLDG_HEIGHT',
      'BLDG_FLOOR_NO'
    ],
    aliasOutFields: [
      'رقم المبنى',
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'اسم الحى',
      'اسم الشارع',
      'اسم المبني',
      'عنوان البيت',
      'حالة المبني',
      'مساحة المبني',
      'ارتفاع المبنى',
      'عدد أدوار المبنى'
    ]
  },
  Violation_Data: {
    name: 'بيانات التعديات',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'VIOLATION_AREA',
      'VIOLATION_DESC'
    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'مساحة التعدى- م2',
      'وصف التعدي'
    ]
  },
  Street_Polygon: {
    name: 'عروض الشوارع',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME'
    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية'
    ]
  },

  ASPHALT_MIXER: {
    name: 'طبقة الأسفلت',
    outFields: [
      'OBJECTID',
      "MUNICIPALITY_NAME",
      "DISTRICT_NAME",
      "COMPANY_NAME",
      "NUM",
      "CAPACITY",
      "RATING",
      "X_COORDINATE",
      "Y_COORDINATE"
    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم الحى',
      'اسم الشركة',
      'NUM',
      'طاقة الاستيعاب',
      'التصنيف',
      'X_COORDINATE',
      'Y_COORDINATE'

    ]
  },
  Street_Naming: {
    order: 9,
    isSearchable: true,
    depenedFilter: [{ fieldName: 'DISTRICT_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['DISTRICT_NAME'], layer: 'District_Boundary' },
    { fieldName: 'SUB_MUNICIPALITY_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['SUB_MUNICIPALITY_NAME'], layer: 'Sub_Municipality_Boundary' }],
    name: 'خط منتصف الطريق',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'DISTRICT_NAME',
      'STREET_FULLNAME',
      'STREET_NAME_CLS',
      'STREET_CLASS',
      // "STREET_LENGTH",
      "WIDTH",
      "STREET_TYPE",
      // "STREET_SPEED_CLASS",
      // "STREET_LIFECYCLE_STATUS",

    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'اسم الحى',
      'اسم الشارع',
      'تصنيف اسم الطريق',
      'صنف الشارع',
      // "طول الطريق",
      "عرض الطريق",
      "نوع الشارع",
      // "سرعة الطريق",
      // "الحالة العمرية للطريق",

    ]
  },
  Pre_Street_Naming: {
    order: 9,
    isSearchable: true,
    depenedFilter: [{ fieldName: 'DISTRICT_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['DISTRICT_NAME'], layer: 'District_Boundary' },
    { fieldName: 'SUB_MUNICIPALITY_NAME', depenedField: 'MUNICIPALITY_NAME', outFields: ['SUB_MUNICIPALITY_NAME'], layer: 'Sub_Municipality_Boundary' }],
    name: 'خط منتصف الطريق (المعتمد ابتدائيا)',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'DISTRICT_NAME',
      'STREET_FULLNAME',
      'STREET_NAME_CLS',
      'STREET_CLASS',
      // "STREET_LENGTH",
      "WIDTH",
      "STREET_TYPE",
      // "STREET_SPEED_CLASS",
      // "STREET_LIFECYCLE_STATUS",

    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'اسم الحى',
      'اسم الشارع',
      'تصنيف اسم الطريق',
      'صنف الشارع',
      // "طول الطريق",
      "عرض الطريق",
      "نوع الشارع",
      // "سرعة الطريق",
      // "الحالة العمرية للطريق",

    ]
  },
  Pavement: {
    name: 'أرصفة',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME'
    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية'
    ]
  },
  Street_Median: {
    name: 'جزر الشوارع',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME'
    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية'
    ]
  },
  Passageway: {
    name: 'ممر مشاة',
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME'
    ],
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية'
    ]
  },
  Proposed_Survey_Parcel: {
    name: 'الاراضى المقترحة',
    outFields: [
      '*'
    ],
    isHidden: true,
    aliasOutFields: [],
    area: [{
      type: 'sum',
      field: 'PARCEL_AREA ',
      name: 'area'
    }]
  },
  Survey_Parcel_H: {
    outFields: [
      'OBJECTID',
      'MUNICIPALITY_NAME',
      'SUB_MUNICIPALITY_NAME',
      'DISTRICT_NAME',
      'PLAN_NO',
      'PARCEL_PLAN_NO',
      'PARCEL_AREA',
      'ARCHIVE_TIME',
      'OPERATION_TYPE',
      'USER_NAME'
    ],
    isHidden: true,
    aliasOutFields: [
      'اسم البلدية',
      'اسم البلدية الفرعية',
      'اسم الحى',
      'رقم المخطط',
      'رقم قطعة الأرض بالمخطط',
      'المساحة التقريبية م٢',
      'تاريخ الارشيف',
      'نوع العملية',
      'اسم المستخدم'
    ],
    area: [{
      type: 'sum',
      field: 'PARCEL_AREA',
      name: 'area'
    }]
  },
  Invest_Site_Polygon: {
    name: 'الأراضي الاستثمارية',
    outFields: [
      'SUB_MUNICIPALITY_NAME',
      'MUNICIPALITY_NAME',
      'DISTRICT_NAME',
      'PLAN_NO',
      'PARCEL_PLAN_NO',
      'SITE_AREA',
      'SITE_ACTIVITY',
      'SITE_GEOSPATIAL_ID',
      'USING_SYMBOL'
      //'BLDG_CONDATIONS'
    ],
    hideFields: ['SITE_LAT_COORD', 'SITE_GEOSPATIAL_ID', 'SITE_LONG_COORD'],
    hideAlaisOutFields: ['احداثى دائرة العرض للمركز الهندسى', 'احداثى خط الطول للمركز الهندسى', 'المميز المكاني للموقع الاستثمارى'],
    title: [
      'SITE_ACTIVITY',
      'CONTRACT_NUMBER',
      'PROJECT_NO'
    ],
    subTitle: [
      'MUNICIPALITY_NAME',
      'DISTRICT_NAME'

    ],
    dependecies: [

    ],
    filter: 'SITE_GEOSPATIAL_ID',
    filteralias: 'المميز المكاني للموقع الاستثمارى',
    aliasOutFields: [
      'اسم البلدية',
      'اسم الحى',
      'رقم المخطط',
      'رقم قطعة الأرض بالمخطط',
      'المساحة م2',
      'النشاط الاستثمارى',
      'رمز الاستخدام'
      //'وصف اشتراط البناء'
    ]
  },
  Advertising_boards: {
    name: 'اللوحات الاعلانية',
    outFields: [

      'MUNICIPALITY_NAME',
      'DISTRICT_NAME',
      'PLAN_NO',
      'PARCEL_PLAN_NO',
      'STREET_NAME',
      'SITE_ACTIVITY',
      'SITE_STATUS',
      'SITE_SUBTYPE',
      'CONTRACT_NUMBER',
      'PROJECT_NO',
      'SITE_LAT_COORD',
      'SITE_LONG_COORD',
      'SITE_GEOSPATIAL_ID',
      'GROUP_CODE',

    ],
    title: [
      'SITE_ACTIVITY',
      'CONTRACT_NUMBER',
      'PROJECT_NO'
    ],
    subTitle: [
      'MUNICIPALITY_NAME',
      'DISTRICT_NAME'

    ],
    dependecies: [
    ],
    filter: 'SITE_GEOSPATIAL_ID',
    filteralias: 'المميز المكاني للموقع الاستثمارى',
    aliasOutFields: [
      'اسم البلدية',
      'اسم الحى',
      'رقم المخطط',
      'رقم قطعة الأرض بالمخطط',
      'اسم الشارع الرئيسى',
      'النشاط الاستثمارى',
      'حالة الموقع',
      'نوع الموقع اللاستثمارى',
      'رقم العقد',
      'رقم المزايدة',
      'احداثى دائرة العرض للمركز الهندسى',
      'احداثى خط الطول للمركز الهندسى'
    ]
  },

  'SDE.TBL_Borads': {
    name: 'اللوحات الاعلانية',
    dataTitle: 'بيانات اللوحة الاعلانية',
    outFields: [
      'BOARD_CODE',
      'BOARD_STATUS',
      'BOARD_TYPE_DESC',
      'BOARD_GROUP_DESC',
      'GROUP_CODE'
    ],
    isHidden: true,
    aliasOutFields: [
      'رقم التسلسل',
      'حالة اللوحة',
      'نوع اللوحة',
      'وصف المجموعة',
      'رقم المجوعة'
    ]
  },
  'SDE.TBL_BoardsGroup': {
    dataTitle: 'بيانات المجموعة',
    name: 'مجموعة اللوحات',
    outFields: [
      'BOARD_TYPE',
      'SITE_NO',
      'BOARD_NO',
      'FRONTBOARD_NO',
      'LIGHT_STATUS',
      'GROUP_DESCRIPTION',
      'GROUP_BOARD_LENGTH',
      'GROUP_BOARD_WIDTH',
      'GROUP_BOARD_AREA'
    ],
    isHidden: true,
    aliasOutFields: [
      'نوع اللوحة',
      'عدد المواقع',
      'عدد اللوحات',
      'عدد الاوجه',
      'حالة الاضاءة',
      'وصف المجموعة',
      'طول اللوحة داخل المجموعة',
      'عرض اللوحة داخل المجموعة',
      'مساحة اللوحة داخل المجموعة'
    ]
  },
  'SDE.TBL_Towers': {
    name: 'ابراج الاتصالات',
    dataTitle: 'بيانات برج الاتصال',
    outFields: [
      'TOWER_LOCATION_CODE',
      'TOWER_TYPE',
      'TOWER_HEIGHT',
      'TOWER_AREA',
      'TOWER_SERVICE_PROVIDER',
      'TOWER_LANDUSE',
      'TOWER_XCOORDINATE',
      'TOWER_YCOORDINATE'
    ],
    isHidden: true,
    aliasOutFields: [
      'كود البرج',
      'نوع البرج',
      'الارتفاع',
      'المساحة',
      'مزود الخدمة',
      'استخدام الارض',
      'الاحداثيات الشرقية للبرج',
      'الاحداثيات الشمالية للبرج'
    ]
  },
  'SDE.TBL_Building_Data': {
    name: 'بيانات المباني',
    dataTitle: 'بيانات المبنى',
    outFields: [
      'BLD_CODE',
      'BLD_AREA',
      'BLD_MATRIAL',
      'BLD_STATUS',
      'BLD_LIC_NO',
      'BLD_NO_FLOORS',
      'BLD_NO_UNITS',
      'BLD_SERVICE',
      'BLD_POST_CODE'
    ],
    isHidden: true,
    aliasOutFields: [
      'كود المبنى',
      'مساحة المبنى',
      'مادة البناء',
      'حالة المبنى',
      'رخصة البناء',
      'عدد الادوار',
      'عدد الوحدات',
      'خدمات العقار',
      'الرمز البريدى'
    ]
  },
  Tbl_Parcel_Conditions: {
    name: 'اشتراطات البناء',
    outFields: [
      'OBJECTID',
      'SLIDE_AREA',
      'MIN_FROT_OFFSET',
      'DESCRIPTION',
      'BUILDING_RATIO',
      'FRONT_OFFSET',
      'SIDE_OFFSET',
      'BACK_OFFSET',
      'FLOORS',
      'FLOOR_HEIGHT',
      'ADD_FLOOR',
      'USING_SYMBOL',
      'FAR'
    ],
    isHidden: true,
    aliasOutFields: [
      'مساحة_القسيمة',
      'الحد_الأدنى_للواجهة',
      'الوصف',
      'نسبة_البناء',
      'إرتداد_الواجهة',
      'ارتداد_الجوانب',
      'طوابق',
      'ارتفاع_الطابق',
      'يمكن اضافة دور',
      'رمز الاستعمال',
      'معامل_كتلة_البناء'
    ]
  },
  Admin_Mun_VoteLocation: {
    isSearchable: true,
    name: 'المراكز الانتخابية',
    outFields: [
      'OBJECTID',
      'NAME',
      'VOTEDISTRICT_CODE',
      'TYPE'
    ],
    aliasOutFields: [
      'الاسم',
      'رقم الدائرة الأنتخابية',
      'النوع'

    ]

  },
  Admin_Mun_VoteDistrict: {
    isSearchable: true,
    name: 'الدوائر الانتخابية',
    outFields: [
      'OBJECTID',
      'VOTEDISTRICT_CODE',
      'VOTEDISTRICT_NAME_A'
    ],
    aliasOutFields: [
      'رقم الدائرة الأنتخابية',
      'Voting District Name'
    ]
  },
  Invest_Site_Boundary: {
    isHidden: true,
    name: 'حدود الارض',
    outFields: [
      'BOUNDARY_DIRECTION',
      'BOUNDARY_LENGTH'

    ],
    aliasOutFields: ['اتجاه الحد', 'طول الحد - م ']
  },
  Invest_Site_Corner: {
    isHidden: true,
    name: 'حدود الارض',
    outFields: [
      'CORNER_NO',
      'XUTM_COORD',
      'YUTM_COORD'
    ],
    aliasOutFields: [' رقم النقطة', 'الإحداثي السينى', 'الإحداثي الصادي']
  },
  rfp: {
    layerName: 'rfp',
    name: 'المزايدات',
    outFields: [
      'rfp_number',
      'name',
      'contract_duration',
      'area',
      'end_date',
      'open_date',
      'rfb_price'
    ],
    isHidden: true,
    title: [
      'name',
      'rfp_number'
    ],
    subTitle: [
      'rfb_price'
    ],
    aliasOutFields: [
      'رقم المزايدة',
      'اسم المزايدة',
      'مدة العقد (سنه)',
      'المساحة (م 2)',
      'أخر موعد لتقديم العطاءات',
      'تاريخ فتح المظاريف',
      'قيمة الكراسة (ريال)'
    ]
  }

}
