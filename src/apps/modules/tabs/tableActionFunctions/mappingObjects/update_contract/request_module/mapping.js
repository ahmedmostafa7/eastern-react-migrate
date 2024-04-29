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
  signaturesObject,
  updateContractSubmissionDataObject,
  dataMsa7yObject,
  commentsObject,
  remarksObject,
  contractCommentmentsObject
} from "./mapObjects";
import { paths } from "./mapPaths";
import { updateContractObjects } from "./updateContractObjects";
import { resolveOnChange } from "antd/lib/input/Input";

export const executeUpdateContractMapping = (oldMain) => {
  return new Promise((resolve, reject) => {
    var jsonMainObject = {
      ownerData: { ...ownerDataObject.ownerData },
      landData: { ...landDataObject.landData },
      waseka: { ...wasekaObject.waseka },
      data_msa7y: { ...dataMsa7yObject.data_msa7y },
      approvalSubmissionNotes: {
        ...approvalSubmissionNotesObject.approvalSubmissionNotes,
      },
      signatures: { ...signaturesObject.signatures },
      update_contract_submission_data: { ...updateContractSubmissionDataObject.update_contract_submission_data },
      contract_commentments: { ...contractCommentmentsObject.contract_commentments },
      comments: {},
      remarks: [],
      remark: {}
    };

    if ((oldMain.mainObject || oldMain).hasOwnProperty("contracts_data")) {
      updateContractObjects.push({ contracts_data: "waseka" });
    }

    if ((oldMain.mainObject || oldMain).hasOwnProperty("contracts_and_kroky_attach")) {
      updateContractObjects.push({ contracts_and_kroky_attach: "waseka" });
    }

    checkObjectsAvailability(oldMain, jsonMainObject, updateContractObjects);
    
    let newMain = mapOldMainObject(oldMain, jsonMainObject, paths);
    return resolve(newMain);
  });
};
