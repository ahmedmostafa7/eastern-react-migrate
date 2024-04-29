import axios from "axios";
import { applyMapping } from "../app_mappings";
import { workFlowUrl, backEndUrlforMap } from "../../../imports/config";
import { get } from "lodash";
import { esriRequest } from "../../../app/components/inputs/fields/identify/Component/common/esri_request";
import { fetchData } from "app/helpers/apiMethods";
import {
  getInfo,
  collectAllPathsFromObject,
} from "../../../app/components/inputs/fields/identify/Component/common/common_func";
import { sendEdits } from "../../../app/components/wizard/components/stepContent/actions/actionFunctions/apiActions";
import moment from "moment-hijri";
import store from "app/reducers";
const base64Regex =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
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

export const getMuns = () => {
  return new Promise((resolve, reject) => {
    getInfo().then((res) => {
      esriRequest(mapUrl + "/" + res.Municipality_Boundary).then((response) => {
        return resolve(response.types[0].domains.MUNICIPALITY_NAME.codedValues);
      });
    });
  });
};

export const setPrintSignatures = (
  submission,
  mainObject,
  signature_type = ""
) => {
  if (!mainObject?.print_signature) {
    mainObject.print_signature = {};
  }

  let print_names = submission?.CurrentStep?.print_data?.split(",") || [];
  let signatures = submission?.CurrentStep?.signatures; //?.filter(r => !r.is_automatic);
  if (
    signatures?.length &&
    submission?.signatures_history?.length &&
    print_names?.length
  ) {
    print_names.forEach((print_name) => {
      if (print_name.indexOf("a0_plan_approval") != -1 && signature_type) {
        if (!mainObject.print_signature[print_name.replaceAll('"', "")]) {
          mainObject.print_signature[print_name.replaceAll('"', "")] = {
            main_signatures: {},
            lagna_signatures: {},
          };
        }

        mainObject.print_signature[print_name.replaceAll('"', "")][
          signature_type
        ] = {
          stepId: submission?.CurrentStep?.id,
          signatures: signatures || [],
          signatures_history: submission?.signatures_history,
        };
      } else if (print_name.indexOf("a0_plan_approval") == -1) {
        mainObject.print_signature[print_name.replaceAll('"', "")] = {
          stepId: submission?.CurrentStep?.id,
          signatures: signatures || [],
          signatures_history: submission?.signatures_history,
        };
      }
    });
  } else if (
    signatures?.length &&
    !submission?.signatures_history?.length &&
    print_names?.length
  ) {
    print_names.forEach((print_name) => {
      if (print_name.indexOf("a0_plan_approval") != -1 && signature_type) {
        if (!mainObject.print_signature[print_name.replaceAll('"', "")]) {
          mainObject.print_signature[print_name.replaceAll('"', "")] = {
            main_signatures: {},
            lagna_signatures: {},
          };
        }

        mainObject.print_signature[print_name.replaceAll('"', "")][
          signature_type
        ] = {
          stepId: submission?.CurrentStep?.id,
          signatures: signatures || [],
        };
      } else if (print_name.indexOf("a0_plan_approval") == -1) {
        mainObject.print_signature[print_name.replaceAll('"', "")] = {
          stepId: submission?.CurrentStep?.id,
          signatures: signatures || [],
        };
      }
    });
  }
};

// export const setPrintSignatures = (submission, mainObject) => {
//   if (!mainObject?.print_signature) {
//     mainObject.print_signature = {};
//   }

//   let print_name =
//     (location.hash.indexOf("?tk=") == -1 &&
//       location.hash.indexOf("#/wizard") == -1 &&
//       location.hash.split("/")[
//         location.hash.indexOf(submission?.workflows?.print_state) != -1 ? 2 : 1
//       ]) ||
//     submission?.workflows?.print_state?.split("/")?.[2];

//   if (print_name) {
//     if (
//       submission.CurrentStep?.signatures &&
//       submission.CurrentStep?.signatures?.length
//     ) {
//       if (
//         mainObject?.print_signature &&
//         mainObject?.print_signature[print_name]
//       ) {
//         if (Array.isArray(mainObject?.print_signature[print_name])) {
//           if (
//             mainObject?.print_signature[print_name]?.find(
//               (step) => step.stepId == submission.CurrentStep?.id
//             ) != undefined
//           ) {
//             let sginatureIndex = mainObject?.print_signature[
//               print_name
//             ]?.findIndex((step) => step.stepId == submission.CurrentStep?.id);
//             if (sginatureIndex) {
//               mainObject.print_signature[print_name][sginatureIndex] = {
//                 stepId: submission?.CurrentStep?.id,
//                 signatures: submission?.CurrentStep?.signatures || [],
//                 signatures_history:
//                   submission?.signatures_history?.length &&
//                   submission?.signatures_history,
//               };
//             }
//           } else {
//             mainObject?.print_signature[print_name].splice(
//               mainObject?.print_signature[print_name].length - 1,
//               0,
//               {
//                 stepId: submission?.CurrentStep?.id,
//                 signatures: submission?.CurrentStep?.signatures || [],
//                 signatures_history:
//                   submission?.signatures_history?.length &&
//                   submission?.signatures_history,
//               }
//             );
//           }
//         } else {
//           mainObject.print_signature[print_name] = [
//             {
//               ...mainObject?.print_signature[print_name],
//             },
//           ];
//           setPrintSignatures(submission, mainObject);
//         }
//       } else {
//         mainObject.print_signature[print_name] = [
//           {
//             stepId: submission?.CurrentStep?.id,
//             signatures: submission?.CurrentStep?.signatures || [],
//             signatures_history:
//               submission?.signatures_history?.length &&
//               submission?.signatures_history,
//           },
//         ];
//       }
//     }
//   }
// };

export const initializeSubmissionData = (id) => {
  var results = {
    historyData: null,
    mainObject: null,
    ceator_user_name: "",
    submission: null,
    printObj: {},
    MunicipalityNames: [],
  };
  return new Promise((resolve, reject) => {
    fetchData(workFlowUrl + "/api/Submission/" + id).then(
      (sub_data) => {
        //store.dispatch({type:'Show_Loading_new',loading: false})
        results.ceator_user_name = get(sub_data, "CreatorUser.name", "");
        results.submission = sub_data;
        setEngUserName(id.toString()).then(
          (historydata) => {
            //created_date
            historydata.data.results = historydata.data.results.sort(
              (a, b) =>
                new Date(
                  moment(a.created_date, "iD/iM/iYYYY").format("YYYY-M-D")
                ) -
                new Date(
                  moment(b.created_date, "iD/iM/iYYYY").format("YYYY-M-D")
                )
            );

            results.historyData = historydata;
            fetchData(
              backEndUrlforMap +
                sub_data.submission_file_path +
                "mainObject.json"
            ).then(
              (data) => {
                //store.dispatch({type:'Show_Loading_new',loading: false})

                data =
                  (typeof data == "string" &&
                    JSON.parse(window.lzString.decompressFromBase64(data))) ||
                  data;
                applyMapping(data, results.submission).then(
                  (response) => {
                    results.mainObject = response.mainObject;
                    if (results.submission.workflows) {
                      results.mainObject.submissionTypeName =
                        results.submission.workflows.name;
                    }
                    if (results.submission.current_step) {
                      results.mainObject.currentStepId =
                        results.submission.current_step;
                    }

                    let signature_type = "";

                    if (
                      [2768, 3105].indexOf(
                        results.submission?.CurrentStep.id
                      ) != -1
                    ) {
                      signature_type = "lagna_signatures";
                    } else if (
                      [2900, 3125, 2922].indexOf(
                        results.submission?.CurrentStep.id
                      ) != -1
                    ) {
                      signature_type = "main_signatures";
                    }

                    setPrintSignatures(
                      results.submission,
                      results.mainObject,
                      signature_type
                    );

                    getMuns().then((muns) => {
                      results.MunicipalityNames = muns;

                      if (sub_data.submission_file_path) {
                        fetchData(
                          backEndUrlforMap +
                            sub_data.submission_file_path +
                            "printObject.json"
                        ).then(
                          (print_data) => {
                            // store.dispatch({
                            //   type: "Show_Loading_new",
                            //   loading: false,
                            // });
                            results.printObj = print_data.newPrintObj;
                            return resolve(results);
                          },
                          (error) => {
                            // store.dispatch({
                            //   type: "Show_Loading_new",
                            //   loading: false,
                            // });
                            return resolve(results);
                          }
                        );
                      } else {
                        // store.dispatch({
                        //   type: "Show_Loading_new",
                        //   loading: false,
                        // });
                        return resolve(results);
                      }
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
      },
      (error) => {
        return reject();
      }
    );
  });
};
