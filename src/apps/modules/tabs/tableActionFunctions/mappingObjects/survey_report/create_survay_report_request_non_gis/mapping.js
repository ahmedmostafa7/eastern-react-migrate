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
  dataMsa7yObject,
  duplixBuildingDetailsObject,
  duplixChecktorObject,
  commentsObject,
  remarksObject
} from "./mapObjects";
import { paths } from "./mapPaths";
import { krokiObjects } from "./krokiObjects";
import { resolveOnChange } from "antd/lib/input/Input";

export const executeUnplannedKrokiMapping = (oldMain) => {
  return new Promise((resolve, reject) => {
    var jsonMainObject = {
      ownerData: { ...ownerDataObject.ownerData },
      landData: { ...landDataObject.landData },
      waseka: { ...wasekaObject.waseka },
      data_msa7y: { ...dataMsa7yObject.data_msa7y },
      approvalSubmissionNotes: {
        ...approvalSubmissionNotesObject.approvalSubmissionNotes,
      },
      comments: {},
      remarks: [],
    };

    checkObjectsAvailability(oldMain, jsonMainObject, krokiObjects);
    let newMain = mapOldMainObject(oldMain, jsonMainObject, paths);
    return resolve(newMain);
  });
};
