import {
  mapOldMainObject,
  buildMapObjectsPaths,
  resetMainObject,
  checkObjectsAvailability,
} from "../../../mapFunction";
import {
  ownerDataObject,
  contractCommentmentsObject,
  wasekaObject,
} from "./mapObjects";
import { paths } from "./mapPaths";
import { updateContractObjects } from "./updateContractObjects";
import { resolveOnChange } from "antd/lib/input/Input";

export const executeUpdateContractOwnerMapping = (oldMain) => {
  return new Promise((resolve, reject) => {
    var jsonMainObject = {
      ownerData: { ...ownerDataObject.ownerData },
      contract_commentments: { ...contractCommentmentsObject.contract_commentments },
      waseka: { ...wasekaObject.waseka },
    };

    checkObjectsAvailability(oldMain, jsonMainObject, updateContractObjects);
    
    let newMain = mapOldMainObject(oldMain, jsonMainObject, paths);
    return resolve(newMain);
  });
};
