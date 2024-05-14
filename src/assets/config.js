﻿window.__config = {
  prod: {
    hostURL: "https://webgis.eamana.gov.sa",
    workFlowUrl: "https://webgis.eamana.gov.sa/gisapiv2",
    backEndUrlforMap: "https://webgis.eamana.gov.sa",
    mapUrl: (function () {
      return [
        "gisservices",
        "tamlikakar",
        "addedparcel",
        "landsallotment",
        "propertyremoval"
      ].some((d) => window.location.href.indexOf(d) > -1)
        ? "https://webgis.eamana.gov.sa/arcgisnew/rest/services/App_Mapviewer/MapServer"
        : ["plan-approval"].some(
          (d) =>
            window.location.href
              .replace("plan-approval", "planapproval")
              .indexOf(d.replace("-", "")) > -1
        )
          ? "https://webgis.eamana.gov.sa/arcgisnew/rest/services/Approved_Plan/MapServer"
          : "https://webgis.eamana.gov.sa/arcgisnew/rest/services/appsgissecure/MapServer";
    })(),
    geometryServiceUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/Utilities/Geometry/GeometryServer",
    pythonPrintHost: "webgis.eamana.gov.sa",
    mainArcGisUrl: "https://webgis.eamana.gov.sa/arcgisnew",
    angularUrl: "https://webgis.eamana.gov.sa/gisnew",
    hostUpload: "https://webgis.eamana.gov.sa",
    host: "https://webgis.eamana.gov.sa/gisapiv2",
    filesHost: "https://webgis.eamana.gov.sa/GISAPI/",
    sigHost: "https://webgis.eamana.gov.sa/GISAPI/users/",
    printHost: 
      window.location.protocol + "//" + window.location.hostname + "/gisv3",
    // (function () {
    //   return [
    //     "splitemargelabel",
    //   ].some((d) => window.location.href.toLowerCase().indexOf(d) > -1)
    //     ? window.location.protocol + "//" + window.location.hostname + "/gisv3"
    //     : window.location.protocol + "//" + window.location.hostname + "/gisv2"
    // })(),
    SubAttachementUrl: "/uploads",
    APIURL: "/gisapiv2",
    planMap: "/arcgis/rest/services/Approved_Plan/",
    planMapEditing:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/Approved_Plan/",
    restServicesPath: "https://webgis.eamana.gov.sa/arcgisnew/rest/services",
    newTabShowWizardApps: ["splitemargelabel"],
    showNotificationApps: [
      "addedparcels",
      "planapproval",
      "splitemargelabel",
      "gisservices",
      "tamlikakar",
      "surveyreport",
      "contractupdate",
      "mergestreets",
      "investmentsites",
      "landsallotment",
      "propertycheck",
      "surveycheck",
    ],
    addedParcelMapServiceUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWER_EDIT/MapServer",
    ticketshost: "http://localhost:3000",

    exportFeaturesGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/ExportFeatures/GPServer/ExportFeatures",
    filesURL: "https://webgis.eamana.gov.sa/GISAPI/",
    investMapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWER_EDIT/MapServer",
    tadketMesahyMapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/app_auxiliary/MapServer",
    propetryCheckMapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/app_auxiliary/MapServer",
    surveyCheck_Exceptions: [26275095025759, 26275055025632, 50123532623095],
  },

  prod_stg: {
    hostURL: "https://webgis.eamana.gov.sa",
    workFlowUrl: "https://webgis.eamana.gov.sa/gisapistg",
    backEndUrlforMap: "https://webgis.eamana.gov.sa",
    mapUrl: (function () {
      return [
        "gisservices",
        "tamlikakar",
        "addedparcel",
        "landsallotment",
        "propertyremoval"
      ].some((d) => window.location.href.indexOf(d) > -1)
        ? "https://webgis.eamana.gov.sa/arcgisnew/rest/services/App_Mapviewer/MapServer"
        : ["plan-approval"].some(
          (d) =>
            window.location.href
              .replace("plan-approval", "planapproval")
              .indexOf(d.replace("-", "")) > -1
        )
          ? "https://webgis.eamana.gov.sa/arcgisnew/rest/services/Approved_Plan/MapServer"
          : "https://webgis.eamana.gov.sa/arcgisnew/rest/services/appsgissecure/MapServer";
    })(),
    geometryServiceUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/Utilities/Geometry/GeometryServer",
    pythonPrintHost: "webgis.eamana.gov.sa",
    mainArcGisUrl: "https://webgis.eamana.gov.sa/arcgisnew",
    angularUrl: "https://webgis.eamana.gov.sa/gisnew",
    hostUpload: "https://webgis.eamana.gov.sa",
    host: "https://webgis.eamana.gov.sa/gisapistg",
    filesHost: "https://webgis.eamana.gov.sa/GISAPI/",
    sigHost: "https://webgis.eamana.gov.sa/GISAPI/users/",
    printHost:
      window.location.protocol + "//" + window.location.hostname + "/gisv3",
    SubAttachementUrl: "/uploads",
    APIURL: "/gisapistg",
    planMap: "/arcgis/rest/services/Approved_Plan/",
    planMapEditing:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/Approved_Plan/",
    restServicesPath: "https://webgis.eamana.gov.sa/arcgisnew/rest/services",
    newTabShowWizardApps: ["splitemargelabel"],
    showNotificationApps: [
      "addedparcels",
      "planapproval",
      "splitemargelabel",
      "gisservices",
      "tamlikakar",
      "surveyreport",
      "contractupdate",
      "mergestreets",
      "investmentsites",
      "landsallotment",
      "propertycheck",
      "surveycheck",
    ],
    addedParcelMapServiceUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWER_EDIT/MapServer",
    ticketshost: "http://localhost:3000",

    exportFeaturesGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/ExportFeatures/GPServer/ExportFeatures",
    filesURL: "https://webgis.eamana.gov.sa/GISAPI/",
    investMapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWER_EDIT/MapServer",
    tadketMesahyMapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/app_auxiliary/MapServer",
    propetryCheckMapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/app_auxiliary/MapServer",
    surveyCheck_Exceptions: [26275095025759, 26275055025632, 50123532623095],
  },

  prod_deploy: {
    hostURL: window.origin,
    workFlowUrl: window.location.origin + "/gisapiv2",
    backEndUrlforMap: window.location.origin,
    mapUrl: (function () {
      return [
        "gisservices",
        "tamlikakar",
        "addedparcel",
        "landsallotment",
        "propertyremoval"
      ].some((d) => window.location.href.indexOf(d) > -1)
        ? window.location.origin +
        "/arcgisnew/rest/services/App_Mapviewer/MapServer"
        : ["plan-approval"].some(
          (d) =>
            window.location.href
              .replace("plan-approval", "planapproval")
              .indexOf(d.replace("-", "")) > -1
        )
          ? window.location.origin +
          "/arcgisnew/rest/services/Approved_Plan/MapServer"
          : window.location.origin +
          "/arcgisnew/rest/services/appsgissecure/MapServer";
    })(),
    geometryServiceUrl:
      window.location.origin +
      "/arcgisnew/rest/services/Utilities/Geometry/GeometryServer",
    pythonPrintHost: "webgis.eamana.gov.sa",
    mainArcGisUrl: window.location.origin + "/arcgisnew",
    angularUrl: window.location.origin + "/gisnew",
    hostUpload: window.location.origin,
    host: window.location.origin + "/GISAPIV2",
    filesHost: window.location.origin + "/GISAPI/",
    sigHost: window.location.origin + "/GISAPI/users/",
    printHost: 
      window.location.protocol + "//" + window.location.hostname + "/gisv3",
    // (function () {
    //   return [
    //     "splitemargelabel",
    //   ].some((d) => window.location.href.toLowerCase().indexOf(d) > -1)
    //     ? window.location.protocol + "//" + window.location.hostname + "/gisv3"
    //     : window.location.protocol + "//" + window.location.hostname + "/gisv2"
    // })(),
    SubAttachementUrl: "/uploads",
    APIURL: "/gisapiv2",
    planMap: "/arcgis/rest/services/Approved_Plan/",
    planMapEditing:
      window.location.origin + "/arcgisnew/rest/services/Approved_Plan/",
    restServicesPath: window.location.origin + "/arcgisnew/rest/services",
    newTabShowWizardApps: ["splitemargelabel"],
    showNotificationApps: [
      "addedparcels",
      "planapproval",
      "splitemargelabel",
      "gisservices",
      "tamlikakar",
      "surveyreport",
      "contractupdate",
      "mergestreets",
      "investmentsites",
      "landsallotment",
      "propertycheck",
      "surveycheck",
    ],

    addedParcelMapServiceUrl:
      window.location.origin +
      "/arcgisnew/rest/services/MAPVIEWER_EDIT/MapServer",
    ticketshost: window.location.origin,
    exportFeaturesGPUrl:
      window.location.origin +
      "/arcgisnew/rest/services/ExportFeatures/GPServer/ExportFeatures",
    filesURL: window.location.origin + "/GISAPI/",
    investMapUrl:
      window.location.origin +
      "/arcgisnew/rest/services/MAPVIEWER_EDIT/MapServer",
    tadketMesahyMapUrl:
      window.location.origin + "/arcgisnew/rest/services/app_auxiliary/MapServer",
    propetryCheckMapUrl:
      window.location.origin + "/arcgisnew/rest/services/app_auxiliary/MapServer",
    surveyCheck_Exceptions: [26275095025759, 26275055025632, 50123532623095],
  },

  stage: {
    hostURL: "http://77.30.168.86",
    workFlowUrl: "http://77.30.168.84/GISAPITESTV2",
    backEndUrlforMap: "http://77.30.168.84",
    mapUrl: (function () {
      return [
        "gisservices",
        "tamlikakar",
        "addedparcel",
        "landsallotment",
        "propertyremoval"
      ].some((d) => window.location.href.indexOf(d) > -1)
        ? "http://77.30.168.84:6080/arcgis/rest/services/App_Mapviewer/MapServer"
        : ["plan-approval"].some(
          (d) =>
            window.location.href
              .replace("plan-approval", "planapproval")
              .indexOf(d.replace("-", "")) > -1
        )
          ? "http://77.30.168.84:6080/arcgis/rest/services/Approved_Plan/MapServer"
          : "http://77.30.168.84:6080/arcgis/rest/services/appsgissecure/MapServer";
    })(),
    geometryServiceUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
    pythonPrintHost: "77.30.168.84",
    mainArcGisUrl: "http://77.30.168.84:6080/arcgis",
    angularUrl: "http://77.30.168.84/gis",
    hostUpload: "http://77.30.168.84",
    host: "http://77.30.168.84/GISAPITESTV2",
    filesHost: "http://77.30.168.84/GISAPI/",
    sigHost: "http://77.30.168.84/GISAPI/users/",
    printHost:
      window.location.protocol + "//" + window.location.hostname + "/gisv3",
    SubAttachementUrl: "/uploads",
    planMap: "/arcgis/rest/services/Approved_Plan/",
    hostObjectIdMap:
      "http://77.30.168.84:6080/arcgis/rest/services/appsgisutmobject/",
    hostMapEditing:
      "http://77.30.168.84:6080/arcgis/rest/services/utmSEditing/",
    planMapEditing:
      "http://77.30.168.84:6080/arcgis/rest/services/Approved_Plan/",
    APIURL: "/gisapi",
    restServicesPath: "http://77.30.168.84:6080/arcgis/rest/services/Eastern",
    newTabShowWizardApps: ["splitemargelabel"],
    showNotificationApps: [
      "addedparcels",
      "planapproval",
      "splitemargelabel",
      "gisservices",
      "tamlikakar",
      "surveyreport",
      "contractupdate",
      "mergestreets",
      "investmentsites",
      "landsallotment",
      "propertycheck",
      "surveycheck",
    ],
    addedParcelMapServiceUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/MAPVIEWER_EDIT/MapServer",
    ticketshost: "http://localhost:3000",
    exportFeaturesGPUrl:
      "http://77.30.168.84:6080/arcgisnew/rest/services/ExportFeatures/GPServer/ExportFeatures",
    filesURL: "http://77.30.168.84/GISAPI/",
    investMapUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/MAPVIEWER_EDIT/MapServer",
    tadketMesahyMapUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/app_auxiliary/MapServer",
    propetryCheckMapUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/app_auxiliary/MapServer",
    surveyCheck_Exceptions: [26275095025759, 26275055025632, 50123532623095],
  },

  master: {
    // development config
    hostURL: "http://77.30.168.86",
    workFlowUrl: "http://77.30.168.84/GISAPIDEVV2",
    backEndUrlforMap: "http://77.30.168.84",
    mapUrl: (function () {
      return [
        "gisservices",
        "tamlikakar",
        "addedparcel",
        "landsallotment",
        "propertyremoval",
      ].some((d) => window.location.href.indexOf(d) > -1)
        ? "http://77.30.168.84:6080/arcgis/rest/services/App_Mapviewer/MapServer"
        : ["plan-approval"].some(
          (d) =>
            window.location.href
              .replace("plan-approval", "planapproval")
              .indexOf(d.replace("-", "")) > -1
        )
          ? "http://77.30.168.84:6080/arcgis/rest/services/Approved_Plan/MapServer"
          : "http://77.30.168.84:6080/arcgis/rest/services/appsgissecure/MapServer";
    })(),
    geometryServiceUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
    pythonPrintHost: "77.30.168.84",
    mainArcGisUrl: "http://77.30.168.84:6080/arcgis",
    angularUrl: "http://77.30.168.84/gisnew",
    hostUpload: "http://77.30.168.84",
    host: "http://77.30.168.84/GISAPIDEVV2",
    // filesHost: "http://77.30.168.84/GISAPIV2/",
    filesHost: "http://77.30.168.84/GISAPI/",
    sigHost: "http://77.30.168.84/GISAPI/users/",
    printHost: window.location.protocol + "//" + window.location.host,
    SubAttachementUrl: "/uploads",
    planMap: "/arcgis/rest/services/Approved_Plan/",
    hostObjectIdMap:
      "http://77.30.168.84:6080/arcgis/rest/services/appsgisutmobject/",
    hostMapEditing:
      "http://77.30.168.84:6080/arcgis/rest/services/utmSEditing/",
    planMapEditing:
      "http://77.30.168.84:6080/arcgis/rest/services/Approved_Plan/",
    APIURL: "/gisapidev",
    restServicesPath: "http://77.30.168.84:6080/arcgis/rest/services/Eastern",
    newTabShowWizardApps: ["splitemargelabel"],
    showNotificationApps: [
      "addedparcels",
      "planapproval",
      "splitemargelabel",
      "gisservices",
      "tamlikakar",
      "surveyreport",
      "contractupdate",
      "mergestreets",
      "investmentsites",
      "landsallotment",
      "propertycheck",
      "surveycheck",
    ],
    addedParcelMapServiceUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/MAPVIEWER_EDIT/MapServer",
    ticketshost: "http://localhost:3000",
    exportFeaturesGPUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/ExportGeoData/GPServer/ExportFeatures",
    filesURL: "http://77.30.168.84/GISAPI/",
    investMapUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/MAPVIEWER_EDIT/MapServer",
    tadketMesahyMapUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/app_auxiliary/MapServer",
    propetryCheckMapUrl:
      "http://77.30.168.84:6080/arcgis/rest/services/app_auxiliary/MapServer",
    surveyCheck_Exceptions: [26275095025759, 26275055025632, 50123532623095],
  },
};
