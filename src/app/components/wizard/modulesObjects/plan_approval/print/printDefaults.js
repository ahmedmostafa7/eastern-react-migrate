import axios from "axios";
import { setPlanDefaults } from "../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/planDefaults";
import { executePlanMapping } from "../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/mapping";
import {
  workFlowUrl,
  backEndUrlforMap,
} from "../../../../../../imports/config";
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
    if (data.hasOwnProperty("search_survey_report")) {
      executePlanMapping(data).then(
        (response) => {
          data = response;
          if (submission.workflows) {
            data.submissionTypeName = submission.workflows.name;
          }
          if (submission.current_step) {
            data.currentStepId = submission.current_step;
          }

          return resolve(data);
        },
        (error) => {
          return reject();
        }
      );
    } else {
      setPlanDefaults(data).then(
        (response) => {
          data = response;
          if (submission.workflows) {
            data.submissionTypeName = submission.workflows.name;
          }
          if (submission.current_step) {
            data.currentStepId = submission.current_step;
          }
          return resolve(data);
        },
        (error) => {
          return reject();
        }
      );
    }
  });
};

export const initializeSubmissionData = (id) => {
  var results = { historyData: null, mainObject: null, ceator_user_name: '', submission: null };
  return new Promise((resolve, reject) => {
    axios.get(workFlowUrl + "/api/Submission/" + id).then(
      ({ data }) => {
        
        console.log("submission", data);
        results.ceator_user_name = get(data, "CreatorUser.name", "");
        results.submission = data;
        setEngUserName(id.toString()).then(
          (historydata) => {
            results.historyData = historydata;
            axios
              .get(
                backEndUrlforMap + data.submission_file_path + "mainObject.json"
              )
              .then(
                (data) => {
                  console.log("mainObject", data.data);
                  data.data = typeof data.data == "string" && JSON.parse(window.lzString.decompressFromBase64(data.data)) || data.data;
                  mapPrintObjects(data.data, results.submission).then(
                    (response) => {
                      results.mainObject = response;
                      return resolve(results);
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
      },
      (error) => {
        return reject();
      }
    );
  });
};
