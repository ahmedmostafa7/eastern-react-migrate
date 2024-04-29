import { get } from "lodash";

const data_paths = [
  "landData.imported_suggestImage",
  "landData.landData.BLOCK_NO",
  "landData.landData.CHANGEPARCELReason",
  "landData.landData.DIVISION_DESCRIPTION",
  "landData.landData.DIVISION_NO",
  "landData.landData.MUNICIPALITY_NAME",
  "landData.landData.PLAN_NO",
  "landData.landData.SITE_DESC",
  "landData.landData.SITE_DESC_METER",
  "landData.landData.STREET_NO",
  "landData.landData.VIOLATION_STATE",
  "landData.landData.area",
  "landData.landData.district_id",
  "landData.landData.image_uploader",
  "landData.landData.isInvest",
  "landData.landData.krokySubject",
  "landData.landData.land_number",
  "landData.landData.land_usage",
  "landData.landData.lands.parcelData",
  "landData.landData.lands.parcels",
  "landData.landData.lands.screenshotURL",
  "landData.landData.lands.selectedMoamlaType",
  "landData.landData.lands.temp",
  "landData.landData.municipality",
  "landData.landData.municipality_id",
  "landData.landData.municipilty_code",
  "landData.landData.parcel_area",
  "landData.landData.plan_area",
  "landData.landData.plan_number",
  "landData.landData.previous_Image",
  "landData.landData.req_type",
  "landData.landData.screenshotURL",
  "landData.landData.sub_type",
  "landData.landData.subdivisions",
  "landData.landData.submissionType",
  "landData.landData.urban_boundaries_id",
  "landData.requestType",
  "landData.screenshotURL",
];

export const extractImportantData = (object) => {
  let extractedObject = {};
  
  for (let path = 0; path < data_paths.length; path++) {
    if (get(object, data_paths[path])) {
        deepSet(extractedObject, data_paths[path], get(object, data_paths[path]));
      //extractedObject[data_paths[path]] = get(object, data_paths[path]);
    }
  }

  return extractedObject;
};

export const deepSet = (obj, path, val) => {
    path = path.replaceAll("[", ".[");
    const keys = path.split(".");

    for (let i = 0; i < keys.length; i++) {
        let currentKey = keys[i];
        let nextKey = keys[i + 1];
        if (currentKey.includes("[")) {
            currentKey = parseInt(currentKey.substring(1, currentKey.length - 1));
        }
        if (nextKey && nextKey.includes("[")) {
            nextKey = parseInt(nextKey.substring(1, nextKey.length - 1));
        }

        if (typeof nextKey !== "undefined") {
            obj[currentKey] = obj[currentKey] ? obj[currentKey] : (isNaN(nextKey) ? {} : []);
        } else {
            obj[currentKey] = val;
        }

        obj = obj[currentKey];
    }
};
