import {
  mapOldMainObject,
  buildMapObjectsPaths,
  resetMainObject,
  checkObjectsAvailability,
} from "../../../mapFunction";
import {
  ownerDataObject,
  landDataObject,
  landDataObject_noGIS,
  wasekaObject,
  approvalSubmissionNotesObject,
  farzCommentmentsObject,
  dataMsa7yObject,
  sugLandDataObject,
  ownerSummaryObject,
} from "./mapObjects";

import { paths as simpleFarzNonGIS } from "../split_empty_request_non_gis/mapPaths";
import { paths as simpleFarz } from "../split_empty_request/mapPaths";
import { paths as duplixFarzNonGIS } from "../split_duplixs_request_non_gis/mapPaths";
import { paths as duplixFarz } from "../split_duplixs_request/mapPaths";
import { paths as ownerFarz } from "./mapPaths";

import { farzObjects } from "./farzObjects";
import { resolveOnChange } from "antd/lib/input/Input";

export const executeFarzCitizenMapping = (
  oldMain,
  workflow_id,
  submission_id
) => {
  return new Promise((resolve, reject) => {
    let selectedPaths = ownerFarz;
    let newMain;
    var jsonMainObject = {
      owner_summary: { ...ownerSummaryObject.owner_summary },
      ownerData: { ...ownerDataObject.ownerData },
      landData: { ...landDataObject.landData },
      waseka: { ...wasekaObject.waseka },
      data_msa7y: { ...dataMsa7yObject.data_msa7y },
      approvalSubmissionNotes: {
        ...approvalSubmissionNotesObject.approvalSubmissionNotes,
      },
      farz_commentments: { ...farzCommentmentsObject.farz_commentments },
      comments: {},
      remarks: [],
    };

    if (submission_id) {
      
      if ((oldMain.mainObject || oldMain).hasOwnProperty("contracts_data")) {
        farzObjects.push({ contracts_data: "waseka" });
      }

      if ((oldMain.mainObject || oldMain).hasOwnProperty("contracts_attach")) {
        farzObjects.push({ contracts_attach: "waseka" });
      }

      if ((oldMain.mainObject || oldMain)?.owner_summary) {
        let {
          owner_summary: {
            owner_summary: { submissionType, submissionType_duplix },
          },
        } = oldMain.mainObject || oldMain;

        ownerSummaryObject.owner_summary.submissionType = submissionType;
        ownerSummaryObject.owner_summary.submissionType_duplix =
          submissionType_duplix;
        if (
          (submissionType && submissionType == "1") ||
          (submissionType_duplix &&
            ["1", "3"].indexOf(submissionType_duplix) != -1)
        ) {
          jsonMainObject.landData = { ...landDataObject.landData };
          jsonMainObject.data_msa7y = { ...dataMsa7yObject.data_msa7y };

          selectedPaths =
            (submissionType && submissionType == "1" && [...simpleFarz]) ||
            (submissionType_duplix &&
              ["1", "3"].indexOf(submissionType_duplix) != -1 && [
                ...duplixFarz,
              ]);
        } else if (
          (submissionType && submissionType == "2") ||
          (submissionType_duplix &&
            ["2", "4"].indexOf(submissionType_duplix) != -1)
        ) {
          jsonMainObject.landData = { ...landDataObject_noGIS.landData };
          jsonMainObject.sugLandData = { ...sugLandDataObject.sugLandData };

          selectedPaths =
            (submissionType &&
              submissionType == "2" && [...simpleFarzNonGIS]) ||
            (submissionType_duplix &&
              ["2", "4"].indexOf(submissionType_duplix) != -1 && [
                ...duplixFarzNonGIS,
              ]);
        }
      } else {
        jsonMainObject.landData = { ...landDataObject.landData };
        jsonMainObject.data_msa7y = { ...dataMsa7yObject.data_msa7y };

        let submissionType = (workflow_id == 2148 && "1") || undefined;
        let submissionType_duplix = (workflow_id == 2190 && "1") || undefined;

        selectedPaths =
          (submissionType && submissionType == "1" && [...simpleFarz]) ||
          (submissionType_duplix &&
            ["1", "3"].indexOf(submissionType_duplix) != -1 && [...duplixFarz]);

        ownerSummaryObject.owner_summary.submissionType = submissionType;
        ownerSummaryObject.owner_summary.submissionType_duplix =
          submissionType_duplix;
      }
    } else {
      farzObjects.push({ contracts_attach: "waseka" });
    }

    
    checkObjectsAvailability(
      oldMain.mainObject || oldMain,
      jsonMainObject,
      farzObjects
    );
    newMain = mapOldMainObject(
      oldMain.mainObject || oldMain,
      jsonMainObject,
      selectedPaths
    );

    if (submission_id) {
      newMain.owner_summary = {
        owner_summary: {
          submissionType: ownerSummaryObject?.owner_summary?.submissionType,
          submissionType_duplix:
            ownerSummaryObject?.owner_summary?.submissionType_duplix,
        },
      };
    }
    
    return resolve(newMain);
  });
};
