import {
  mapOldMainObject,
  buildMapObjectsPaths,
  resetMainObject,
  checkObjectsAvailability,
} from "../../../mapFunction";
import {
  approvalObject,
} from "./mapObjects";
import { paths } from "./mapPaths";
import { orderingObjects } from "./orderingObjects";
import { resolveOnChange } from "antd/lib/input/Input";

export const executeOrderingMapping = (oldMain) => {
  return new Promise((resolve, reject) => {
    var jsonMainObject = {
      Approval: { ...approvalObject.Approval },
    };

    checkObjectsAvailability(oldMain, jsonMainObject, orderingObjects);
    
    let newMain = mapOldMainObject(oldMain, jsonMainObject, paths);
    return resolve(newMain);
  });
};
