import axios from "axios";
import { executeFarzSimpleMapping } from "../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/split_merge/split_empty_request/mapping";
import { executeFarzDuplixMapping } from "../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/split_merge/split_duplixs_request/mapping";
import { executeFarzDuplixNoGISMapping } from "../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/split_merge/split_duplixs_request_non_gis/mapping";
import { executeFarzSimpleNoGISMapping } from "../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/split_merge/split_empty_request_non_gis/mapping";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
import {getInfo} from "../../../../inputs/fields/identify/Component/common/common_func"
import {esriRequest} from "../../../../inputs/fields/identify/Component/common/esri_request"
import { geometryServiceUrl, mapUrl } from "../../../../inputs/fields/identify/Component/mapviewer/config/map";
import { get } from "lodash";

export const setEngUserName = (submission_id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        workFlowUrl +
          "/api/SubmissionHistory/GetAllMulitFilter?page=0&pageSize=20",
        {
          step_id: "2322",
          submission_id: submission_id,
        }
      )
      .then(
        (historydata) => {
          return resolve(historydata);
        },
        (error) => {
          return reject();
        }
      );
    //return resolve({});
  });
};

export const mapPrintObjects = (data, submission) => {
  return new Promise((resolve, reject) => {
    if (data.hasOwnProperty("contracts_data")  ||
    data.hasOwnProperty("identfiy_parcel")) {
      if (submission.workflows.id == 1928) {
        executeFarzSimpleMapping(data).then((response) => {
          data = response;
          if (submission.workflows) {
            data.submissionTypeName = submission.workflows.name;
          }
          if (submission.CurrentStep && submission.CurrentStep.id) {
            data.currentStepId = submission.CurrentStep.id;
          }

          if (submission.CurrentStep && submission.CurrentStep.id) {
            data.currentStepId = submission.CurrentStep.id;
          }

          return resolve(data);
          
        });
      } else if (
        submission.workflows.id == 1949 ||
        submission.workflows.id == 2048
      ) {
        executeFarzDuplixMapping(data).then((response) => {
          data = response;
          if (submission.workflows) {
            data.submissionTypeName = submission.workflows.name;
          }
          if (submission.CurrentStep && submission.CurrentStep.id) {
            data.currentStepId = submission.CurrentStep.id;
          }

          if (submission.CurrentStep && submission.CurrentStep.id) {
            data.currentStepId = submission.CurrentStep.id;
          }

          return resolve(data);
          
        });
      } else if (
        submission.workflows.id == 1971 ||
        submission.workflows.id == 2068
      ) {
        executeFarzDuplixNoGISMapping(data).then((response) => {
          data = response;
          if (submission.workflows) {
            data.submissionTypeName = submission.workflows.name;
          }
          if (submission.CurrentStep && submission.CurrentStep.id) {
            data.currentStepId = submission.CurrentStep.id;
          }

          if (submission.CurrentStep && submission.CurrentStep.id) {
            data.currentStepId = submission.CurrentStep.id;
          }
        
          return resolve(data);
        });
      } else if (submission.workflows.id == 1968) {
        executeFarzSimpleNoGISMapping(data).then((response) => {
          data = response;
          if (submission.workflows) {
            data.submissionTypeName = submission.workflows.name;
          }
          if (submission.CurrentStep && submission.CurrentStep.id) {
            data.currentStepId = submission.CurrentStep.id;
          }

          if (submission.CurrentStep && submission.CurrentStep.id) {
            data.currentStepId = submission.CurrentStep.id;
          }
          
          return resolve(data);
        });
      }
    } else {
      return resolve(data);
    }
  });
};

export const initializeSubmissionData = (id) => {
  var results = { mainObject: null, ceator_user_name: "", submission: null, MunicipalityNames: null };
  return new Promise((resolve, reject) => {
    axios.get(workFlowUrl + "/api/Submission/" + id).then(
      ({ data }) => {
        console.log("submission", data);
        results.ceator_user_name = get(data, "CreatorUser.name", "");
        results.submission = data;
        axios
          .get(backEndUrlforMap + data.submission_file_path + "mainObject.json")
          .then(
            (data) => {
              console.log("mainObject", data.data);
              data.data = typeof data.data == "string" && JSON.parse(window.lzString.decompressFromBase64(data.data)) || data.data;
              mapPrintObjects(data.data, results.submission).then(
                (response) => {
                  results.mainObject = response;
                  getInfo().then((res) => {
                    esriRequest(mapUrl + "/" + res.Municipality_Boundary).then(
                      (response) => {
                        results.MunicipalityNames = response.types[0].domains.MUNICIPALITY_NAME.codedValues;
                        return resolve(results);
                      }
                    );
                  });
                  
                },
                (error) => {
                  return reject();
                }
              );
            },
            (error) => {
              return reject();
            }
          );
      },
      (error) => {
        return reject();
      }
    );
  });
};
