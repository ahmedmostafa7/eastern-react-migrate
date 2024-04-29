import { executePlanMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/mapping";
import { setPlanDefaults } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/planDefaults";
import { executeFarzSimpleMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/split_merge/split_empty_request/mapping";
import { executeFarzDuplixMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/split_merge/split_duplixs_request/mapping";
import { executeFarzCitizenMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/split_merge/split_empty_request_owner/mapping";
import { executeFarzDuplixNoGISMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/split_merge/split_duplixs_request_non_gis/mapping";
import { executeFarzSimpleNoGISMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/split_merge/split_empty_request_non_gis/mapping";
import { executePlannedKrokiMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/survey_report/create_survay_report_request/mapping";
import { executeUnplannedKrokiMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/survey_report/create_survay_report_request_non_gis/mapping";
import { executeCitizenMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/survey_report/split_empty_request_survey_engineer/mapping";
import { executeUpdateContractMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/update_contract/request_module/mapping";
import { executeUpdateContractOwnerMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/update_contract/contract_owner/mapping";
import { executeOrderingMapping } from "../../../apps/modules/tabs/tableActionFunctions/mappingObjects/Ordering/request_module/mapping";
import {
  checkUserObject,
  removeObjectInMainObjct,
} from "../../../app/components/inputs/fields/identify/Component/common/common_func";
export const applyMapping = (mainObject, record, submission) => {
  return new Promise((resolve, reject) => {
    let workflow_id = submission?.workflow_id || record?.workflows?.id || 0;
    if (record.app_id == 16) {
      if (mainObject.hasOwnProperty("search_survey_report")) {
        executePlanMapping(mainObject).then((response) => {
          checkUserObject(response);
          removeObjectInMainObjct(response, "lists");
          if (mainObject.gov_requests && !mainObject.requests) {
            mainObject.requests = mainObject.gov_requests;
          }
          return resolve({ mainObject: response });
        });
      } else {
        setPlanDefaults(mainObject);
        checkUserObject(mainObject);
        removeObjectInMainObjct(mainObject, "lists");
        if (mainObject.gov_requests && !mainObject.requests) {
          mainObject.requests = mainObject.gov_requests;
        }
        return resolve({ mainObject: mainObject });
      }
    } else if (record.app_id == 1) {
      if (
        mainObject.hasOwnProperty("contracts_data") ||
        mainObject.hasOwnProperty("identfiy_parcel")
      ) {
        if (workflow_id == 1928) {
          executeFarzSimpleMapping(mainObject).then((response) => {
            checkUserObject(response);
            removeObjectInMainObjct(response, "lists");
            return resolve({ mainObject: response });
          });
        } else if (workflow_id == 1949 || workflow_id == 2048) {
          executeFarzDuplixMapping(mainObject).then((response) => {
            checkUserObject(response);
            removeObjectInMainObjct(response, "lists");
            return resolve({ mainObject: response });
          });
        } else if (workflow_id == 1971 || workflow_id == 2068) {
          executeFarzDuplixNoGISMapping(mainObject).then((response) => {
            checkUserObject(response);
            removeObjectInMainObjct(response, "lists");
            return resolve({ mainObject: response });
          });
        } else if (workflow_id == 1968) {
          executeFarzSimpleNoGISMapping(mainObject).then((response) => {
            checkUserObject(response);
            removeObjectInMainObjct(response, "lists");
            return resolve({ mainObject: response });
          });
        } else if (workflow_id == 2148 || workflow_id == 2190) {
          executeFarzCitizenMapping(mainObject, submission?.workflow_id || workflow_id).then(
            (response) => {
              checkUserObject(response);
              removeObjectInMainObjct(response, "lists");
              return resolve({ mainObject: response });
            }
          );
        }
      } else {
        if (
          mainObject?.farz_commentments?.farz_commentents ||
          mainObject?.farz_commentents?.farz_commentents
        ) {
          mainObject.farz_commentments = {
            farz_commentments:
              mainObject?.farz_commentments?.farz_commentents ||
              mainObject?.farz_commentents?.farz_commentents,
          };
          delete mainObject?.farz_commentments?.farz_commentents;
          delete mainObject?.farz_commentents?.farz_commentents;
        }
        checkUserObject(mainObject);
        removeObjectInMainObjct(mainObject, "lists");
        return resolve({ mainObject: mainObject });
      }
    } else if (record.app_id == 8) {
      if (
        mainObject.hasOwnProperty("contracts_data") ||
        mainObject.hasOwnProperty("identfiy_parcel")
      ) {
        if (workflow_id == 2028) {
          executePlannedKrokiMapping(mainObject).then((response) => {
            checkUserObject(response);
            removeObjectInMainObjct(response, "lists");
            return resolve({ mainObject: response });
          });
        } else if (workflow_id == 2029) {
          executeUnplannedKrokiMapping(mainObject).then((response) => {
            checkUserObject(response);
            removeObjectInMainObjct(response, "lists");
            return resolve({ mainObject: response });
          });
        } else if (workflow_id == 2191) {
          executeCitizenMapping(mainObject).then((response) => {
            checkUserObject(response);
            removeObjectInMainObjct(response, "lists");
            return resolve({ mainObject: response });
          });
        }
      } else {
        if (
          mainObject?.farz_commentments?.farz_commentents ||
          mainObject?.farz_commentents?.farz_commentents
        ) {
          mainObject.farz_commentments = {
            farz_commentments:
              mainObject?.farz_commentments?.farz_commentents ||
              mainObject?.farz_commentents?.farz_commentents,
          };
          delete mainObject?.farz_commentments?.farz_commentents;
          delete mainObject?.farz_commentents?.farz_commentents;
        }
        checkUserObject(mainObject);
        removeObjectInMainObjct(mainObject, "lists");
        return resolve({ mainObject: mainObject });
      }
    } else if (record.app_id == 14) {
      /// 2208
      if (workflow_id != 2208) {
        if (
          mainObject.hasOwnProperty("contracts_data") ||
          mainObject.hasOwnProperty("identfiy_parcel")
        ) {
          executeUpdateContractMapping(mainObject).then((response) => {
            checkUserObject(response);
            removeObjectInMainObjct(response, "lists");
            return resolve({ mainObject: response });
          });
        } else {
          checkUserObject(mainObject);
          removeObjectInMainObjct(mainObject, "lists");
          return resolve({ mainObject: mainObject });
        }
      } else {
        if (
          mainObject.hasOwnProperty("contracts_and_kroky_attach") ||
          mainObject.hasOwnProperty("approve_request")
        ) {
          executeUpdateContractOwnerMapping(mainObject).then((response) => {
            checkUserObject(response);
            removeObjectInMainObjct(response, "lists");
            return resolve({ mainObject: response });
          });
        } else {
          checkUserObject(mainObject);
          removeObjectInMainObjct(mainObject, "lists");
          return resolve({ mainObject: mainObject });
        }
      }
    } else if (record.app_id == 11) {
      if (mainObject.hasOwnProperty("remarks")) {
        executeOrderingMapping(mainObject).then((response) => {
          checkUserObject(response);
          removeObjectInMainObjct(response, "lists");
          return resolve({ mainObject: response });
        });
      } else {
        checkUserObject(mainObject);
        removeObjectInMainObjct(mainObject, "lists");
        return resolve({ mainObject: mainObject });
      }
    } else {
      checkUserObject(mainObject);
      removeObjectInMainObjct(mainObject, "lists");
      return resolve({ mainObject: mainObject });
    }
  });
};
