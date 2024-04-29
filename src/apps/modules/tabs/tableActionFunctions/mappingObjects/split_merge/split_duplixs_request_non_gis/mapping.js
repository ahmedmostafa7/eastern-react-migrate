import {
  mapOldMainObject,
  buildMapObjectsPaths,
  resetMainObject,
  checkObjectsAvailability,
} from "../../../mapFunction";
import {
  ownerDataObject,
  landDataObject,
  wasekaObject,
  approvalSubmissionNotesObject,
  farzCommentmentsObject,
  sugLandDataObject,
  duplixBuildingDetailsObject,
  duplixChecktorObject,
  commentsObject,
  remarksObject
} from "./mapObjects";
import { paths } from "./mapPaths";
import { farzObjects } from "./farzObjects";
import { resolveOnChange } from "antd/lib/input/Input";

export const executeFarzDuplixNoGISMapping = (oldMain) => {
  return new Promise((resolve, reject) => {
    var jsonMainObject = {
      ownerData: { ...ownerDataObject.ownerData },
      landData: { ...landDataObject.landData },
      waseka: { ...wasekaObject.waseka },
      sugLandData: { ...sugLandDataObject.sugLandData },
      approvalSubmissionNotes: {
        ...approvalSubmissionNotesObject.approvalSubmissionNotes,
      },
      farz_commentments: { ...farzCommentmentsObject.farz_commentments },
      duplix_building_details: {...duplixBuildingDetailsObject.duplix_building_details},
      duplix_checktor: {...duplixChecktorObject.duplix_checktor},
      comments: {},
      remarks: [],
    };

    checkObjectsAvailability(oldMain, jsonMainObject, farzObjects);
    let newMain = mapOldMainObject(oldMain, jsonMainObject, paths);
    return resolve(newMain);
  });
};
