import { mapValues, get } from "lodash";
import * as Apps from "./apps";
export default function (mainObject, module, isReqModule, stepModuleId) {
  //var s = Apps;
  
  return mapValues(mainObject, (d, k) => {
    let views = get(Apps, k, () => [])(d, mainObject, module, stepModuleId);
    return views?.filter((view) => view.isRequestModule == isReqModule);
  });
}
