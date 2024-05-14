import {
  omitBy,
  isNull,
  sortBy,
  filter,
  concat,
  includes,
  omit,
  get,
  find,
  assign,
  Alert,
  pick,
  isEmpty,
} from "lodash";
// import { goToInboxScreen } from "../../../../app/components/wizard/components/stepContent/actions/actionFunctions/apiActions";
import axios from "axios";
// import { workFlowUrl, host, backEndUrlforMap, printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { applyMapping } from "main_helpers/functions/app_mappings";
import { initializeSubmissionData } from "main_helpers/functions/prints";
import { getEvaluationData } from "app/components/charts/apiFunctions";
import { sendEdits } from "../../../../app/components/wizard/components/stepContent/actions/actionFunctions/apiActions";
import moment from "moment-hijri";
import {
  formatDate,
  collectAllPathsFromObject,
  checkCommentsAvailability,
  copyUser,
  checkImportedMainObject,
} from "../../../../app/components/inputs/fields/identify/Component/common/common_func";
import { retrieveFeesInfo } from "../../../../main_helpers/functions/fees";
const base64Regex =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
export const getTimelineData = (
  data,
  asignedUser,
  showPopup,
  props,
  isOffice,
  isGov
) => {
  const { setModal } = props;
  const {
    submission_history,
    CurrentStep: { id, name, index, scalation_hours },
    workflows: { steps },
  } = data;

  function hasDecimal(num) {
    return !!(num % 1);
  }

  let isScalated;
  if (scalation_hours) {
    let scalated_days = scalation_hours / 24;
    scalated_days =
      ((scalated_days == 0 || hasDecimal(scalated_days)) && scalated_days) ||
      scalated_days + 1;

    let scalated_date = formatDate(
      moment(data.update_at, "iD/iM/iYYYY").format("D/M/YYYY").split("/")
    );

    let toDay = formatDate(moment(new Date()).format("D/M/YYYY").split("/"));

    const diffScalatedDays = Math.ceil(
      Math.abs(toDay - scalated_date) / (1000 * 60 * 60 * 24)
    );
    isScalated =
      (data.status == 1 && diffScalatedDays > scalated_days) || false;
  } else {
    isScalated = false;
  }
  const sortedHistory = sortBy(submission_history, (v) => v.id);
  const sortedSteps = filter(
    sortBy(steps, (v) => v.index),
    (val) => val.index > index
  );
  let startFormatedDate = null;
  let endFormatedDate = null;
  let diffDays = 0;
  let totalDiffDays = 0;
  let prevSteps = sortedHistory.map((val, index) => {
    if (index > 0) {
      let startDate = moment(val.created_date, "iD/iM/iYYYY").format(
        "D/M/YYYY"
      );
      startFormatedDate = formatDate(startDate.split("/"));
      if (sortedHistory[index - 1]) {
        let endDate = moment(
          sortedHistory[index - 1].created_date,
          "iD/iM/iYYYY"
        ).format("D/M/YYYY");
        endFormatedDate = formatDate(endDate.split("/"));
        const diffTime = Math.abs(endFormatedDate - startFormatedDate);
        diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        totalDiffDays =
          (val?.users?.province_id &&
            val?.CurrentStep?.id != 2327 &&
            totalDiffDays + (data.status == 1 ? diffDays : 0)) ||
          totalDiffDays;
      }
    }

    return {
      prevStep: val?.CurrentStep,
      name:
        (((isOffice && !isGov) || (isOffice && isGov)) &&
          val?.CurrentStep?.categoryname) ||
        ([14].indexOf(data.app_id) != -1 &&
          [2172, 2127, 2333].indexOf(val?.CurrentStep.id) != -1 &&
          !data.survey_check_request_no &&
          `طباعة المعاملة`) ||
        ([1].indexOf(data.app_id) != -1 &&
          [1851, 1955, 2115].indexOf(val?.CurrentStep.id) != -1 &&
          !data.survey_check_request_no &&
          `طباعة المحضر الفني`) ||
        val?.CurrentStep?.name,
      stepActionUserName:
        (!isOffice &&
          ((props?.user?.province_id != null && val?.users?.name) ||
            (props?.user?.province_id == null &&
              props?.user?.id == val?.users?.id &&
              val?.users?.name))) ||
        "",
      // userNamePosition:
      //   (props?.user?.province_id != null && val?.users?.positions?.name) ||
      //   (props?.user?.province_id == null &&
      //     props?.user?.id == val?.users?.id &&
      //     val?.users?.positions?.name) ||
      //   "",
      userNamePosition: (!isOffice && val?.users?.positions?.name) || "",
      // userNameDeptartment: val?.users?.departments?.name || "",
      date: !isOffice && `${val?.created_date}`,
      status: 0, //finished
      datePeriod:
        index > 0 && (diffDays > 0 ? ` ${diffDays} يوم` : ` أقل من يوم`),
      diffDays: diffDays,
    };
  });

  prevSteps = prevSteps.reduce((a, b) => {
    if (a[a.length - 1] && a[a.length - 1].name == b.name) {
      a[a.length - 1].diffDays += b.diffDays;
      (a[a.length - 1].datePeriod =
        a[a.length - 1].diffDays > 0
          ? ` ${a[a.length - 1].diffDays} يوم`
          : ` أقل من يوم`),
        (a[a.length - 1].userNamePosition = "");
      a[a.length - 1].date = "";
    } else {
      a.push(b);
    }

    return a;
  }, []);

  let startDate = moment(
    sortedHistory[sortedHistory.length - 1].created_date,
    "iD/iM/iYYYY"
  ).format("D/M/YYYY");
  startFormatedDate = formatDate(startDate.split("/"));
  endFormatedDate = formatDate(
    moment(new Date()).format("D/M/YYYY").split("/")
  );

  if (data.status == 1) {
    const diffTime = Math.abs(endFormatedDate - startFormatedDate);
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    totalDiffDays =
      (asignedUser?.province_id != null &&
        id != 2327 &&
        totalDiffDays + diffDays) ||
      totalDiffDays;
  }
  const currentStep = {
    currentStep: data.CurrentStep,
    name:
      (((isOffice && !isGov) || (isOffice && isGov)) &&
        data.CurrentStep.categoryname) ||
      ([14].indexOf(data.app_id) != -1 &&
        [2172, 2127, 2333].indexOf(data?.CurrentStep.id) != -1 &&
        !data.survey_check_request_no &&
        `طباعة المعاملة`) ||
      ([1].indexOf(data.app_id) != -1 &&
        [1851, 1955, 2115].indexOf(data?.CurrentStep.id) != -1 &&
        !data.survey_check_request_no &&
        `طباعة المحضر الفني`) ||
      name,
    status: 1, //running
    datePeriod:
      (data.status == 1 &&
        sortedHistory.length > 0 &&
        (diffDays > 0 ? ` ${diffDays} يوم` : ` أقل من يوم`)) ||
      "",
  };

  const nextSteps = (
    (((isOffice && !isGov) || (isOffice && isGov)) &&
      sortedSteps.reduce((a, b) => {
        if (
          a
            .map((x) => x?.categoryname || x.name)
            ?.indexOf(b.categoryname || b.name) == -1
        ) {
          a.push(b);
        }
        return a;
      }, [])) ||
    sortedSteps
  ).map((val) => {
    return {
      name:
        (((isOffice && !isGov) || (isOffice && isGov)) && val?.categoryname) ||
        ([14].indexOf(data.app_id) != -1 &&
          [2172, 2127, 2333].indexOf(val?.id) != -1 &&
          !data.survey_check_request_no &&
          `طباعة المعاملة`) ||
        ([1].indexOf(data.app_id) != -1 &&
          [1851, 1955, 2115].indexOf(val?.id) != -1 &&
          !data.survey_check_request_no &&
          `طباعة المحضر الفني`) ||
        val.name,
      nextStep: val,
      //name: val.name,
      status: 2, //upcoming
    };
  });

  // if (data.status == 1) {
  //   let lastDate = moment(
  //     sortedHistory[0].created_date,
  //     "iD/iM/iYYYY"
  //   ).format("D/M/YYYY");
  //   let lastFormatedDate = formatDate(lastDate.split("/"));
  //   const diffTime = Math.abs(new Date() - lastFormatedDate);
  //   diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   totalDiffDays += diffDays;
  // }

  if (showPopup) {
    setModal({
      title: `Steps timeline, ( مدة المعاملة : ${totalDiffDays} يوم ) `,
      type: "timeLine",
      data:
        (data.status == 1 && concat(prevSteps, currentStep, nextSteps)) ||
        prevSteps,
      isScalated: isScalated,
    });
  }

  console.log({
    prevSteps: prevSteps,
    currentSteps: currentStep,
    nextSteps: nextSteps,
  });

  return {
    prevSteps: prevSteps,
    currentSteps: currentStep,
    nextSteps: nextSteps,
  };
};
export async function sakUpdate(
  record,
  flag,
  aciton,
  evt,
  showPopup = true,
  props = this.props
) {
  debugger;
  const { submission_file_path, CurrentStep, id, is_delayed } = record;
  fetchData(backEndUrlforMap + submission_file_path + "mainObject.json").then(
    (data) => {
      data =
        (typeof data == "string" &&
          JSON.parse(window.lzString.decompressFromBase64(data))) ||
        data;
      debugger;
      //return data;
      let deedsObjects = [];
      data.waseka.waseka.table_waseka.forEach((waseka) => {
        if (!_.isNaN(+waseka?.number_waseka)) {
          if (!Array.isArray(waseka.selectedLands)) {
            deedsObjects = (deedsObjects.length && [
              ...deedsObjects,
              {
                deedNumber: +waseka?.number_waseka,
                parcelPlanNo: waseka.selectedLands.replaceAll(" ", ""),
              },
            ]) || [
              {
                deedNumber: +waseka?.number_waseka,
                parcelPlanNo: waseka.selectedLands.replaceAll(" ", ""),
              },
            ];
          } else {
            waseka.selectedLands.forEach((selectedLand) => {
              if (typeof selectedLand == "string") {
                deedsObjects = (deedsObjects.length && [
                  ...deedsObjects,
                  {
                    deedNumber: +waseka?.number_waseka,
                    parcelPlanNo: selectedLand.replaceAll(" ", ""),
                  },
                ]) || [
                  {
                    deedNumber: +waseka?.number_waseka,
                    parcelPlanNo: selectedLand.replaceAll(" ", ""),
                  },
                ];
              }
            });
          }
        }
      });
      debugger;

      axios
        .post(
          `${workFlowUrl}/submission/GenerateElectronicDeed`,
          deedsObjects,
          {
            params: {
              exportNo: record.export_no,
            },
          }
        )
        .then((res) => {
          debugger;
          if (!res.data.sucsess) {
            window.notifySystem("error", res.data.error, 10);
          } else {
            window.notifySystem("success", "تم تحديث بيانات الصك بنجاح", 10);
          }
        });
    }
  );
}
export async function followUp(
  { id, CurrentStep, workflow_id },
  flag,
  aciton,
  evt,
  showPopup = true,
  props = this.props
) {
  return new Promise((resolve, reject) => {
    const url = `${workFlowUrl}/submission/GetTimeLine/${id}`;
    fetchData(url).then((data) => {
      data = omitBy(data, isNull);
      if (data.assign_to_user_id) {
        fetchData(`${workFlowUrl}/api/user/${data.assign_to_user_id}`).then(
          (user) => {
            return resolve(
              getTimelineData(
                data,
                user,
                showPopup,
                props,
                [2210, 2211].indexOf(workflow_id) == -1 &&
                  !_.isNull(props?.user?.engcompany_id) &&
                  !_.isUndefined(props?.user?.engcompany_id),
                [2210, 2211].indexOf(workflow_id) != -1
              )
            );
          }
        );
      } else {
        return resolve(
          getTimelineData(
            data,
            props.user,
            showPopup,
            props,
            [2210, 2211].indexOf(workflow_id) == -1 &&
              !_.isNull(props?.user?.engcompany_id) &&
              !_.isUndefined(props?.user?.engcompany_id),
            [2210, 2211].indexOf(workflow_id) != -1
          )
        );
      }
    });
  });
}

//function to req the json_file that contains the summery data(data of the previous steps)
async function getJsonFile(url, setMainObject, setComments, name = "") {
  return fetchData(backEndUrlforMap + url + "mainObject.json").then((data) => {
    data =
      (typeof data == "string" &&
        JSON.parse(window.lzString.decompressFromBase64(data))) ||
      data;
    setComments(data.comments);
    // setAllNotes(data.allNotes)
    // const data = mainNodelObject
    setMainObject(omit({ ...data }, ["allNotes"]));
    return data;
  });

  /*
    var requestOptions = {
        method: 'GET'
    };

    return fetch(backEndUrlforMap + url + 'mainObject.json', requestOptions)
    .then(response => response.json())
        .then(data => {
            setComments(data.comments)
            // setAllNotes(data.allNotes)
            // const data = mainNodelObject
            setMainObject(omit({ ...data }, ['allNotes']))
            return data
        })
        .catch(error => console.log('error', error));
    */
}

//function to req the action buttons of the wizard for the current step
function getButtons(id, is_delayed) {
  const url = `${workFlowUrl}/GetActions/${id}`;
  const params = { is_delayed };
  return fetchData(url, { ...params }).then((data) => {
    return data.actions;
  });
}

function success(t) {
  window.notifySystem("success", t("Successfully retrieved data"));
}

function failure(t) {
  window.notifySystem("error", t("An error occured, can not retrieve data"));
}

export function view(record, index, action) {
  if (
    window.newTabShowWizardApps.find(
      (x) => localStorage.appname.toLowerCase().indexOf(x) > -1
    )
  ) {
    window.open(
      window.location.pathname +
        "#/wizardById/" +
        record.id +
        "?tk=" +
        localStorage.token +
        "&appname=" +
        localStorage.appname +
        "&appId=" +
        localStorage.appId +
        "&tabName=" +
        this.props.name,
      "_blank"
    );

    return;
  }
  // console.log("leba", this.props, record, index, action);
  const {
    user_groups,
    addToMainObject,
    name,
    setCurrentModule,
    history,
    removeMainObject,
    setMainObject,
    setComments,
    user,
    // here is the logged in user
    t,
  } = this.props;

  const {
    submission_file_path,
    id,
    is_delayed,
    CurrentStep,
    status,
    request_no,
  } = record;
  let module_id = record.CurrentStep && record.CurrentStep?.module_id;
  console.log("cs", CurrentStep, record);
  localStorage.setItem("id_submission", id);

  localStorage.setItem("module_id", module_id);
  // getButtons(id,is_delayed)
  removeMainObject();
  //let oldMain, newMain;
  if (id) {
    axios
      .get(workFlowUrl + "/api/Submission/GetByIdForWizard/" + id)
      .then((response) => {
        getJsonFile(submission_file_path, setMainObject, setComments, name)
          .then((data) => {
            data =
              (typeof data == "string" &&
                JSON.parse(window.lzString.decompressFromBase64(data))) ||
              data;
            if (!action?.under_signature) {
              getButtons(id, is_delayed).then((actions) => {
                if (
                  data.submissionType &&
                  typeof data.submissionType == "string"
                ) {
                  delete data.submissionType;
                }

                openSubmission(
                  data,
                  includes(["PROBLEM_REAL_ESTATE"], name) ||
                    includes(["PROBLEM_EXPORT_SAK"], name) ||
                    includes(["PROBLEM_SAK_REQUESTS"], name)
                    ? (actions.find(
                        (r) => r.name.indexOf("global.RETURNFROMSTART") != -1
                      ) && [
                        actions.find(
                          (r) => r.name.indexOf("global.RETURNFROMSTART") != -1
                        ),
                      ]) ||
                        []
                    : includes(["unpaid"], name)
                    ? (actions.find(
                        (r) => r.name.indexOf("global.RETURN") != -1
                      ) && [
                        actions.find(
                          (r) => r.name.indexOf("global.RETURN") != -1
                        ),
                      ]) ||
                      []
                    : !record.is_returned
                    ? actions
                    : [
                        {
                          name: "global.SUBMIT",
                          can_submit: true,
                          id: 1,
                          css_class: "send",
                        },
                      ],
                  action,
                  record,
                  this.props,
                  response.status
                );
              });
            } else {
              openSubmission(
                data,
                [
                  {
                    can_submit: 1,
                    css_class: "btn-success",
                    name: "global.SIGN",
                  },
                ],
                action,
                record,
                this.props,
                response.status
              );
            }
          })
          .catch((e) => {
            console.error(e);
            failure(t);
          });
      })
      .catch((error) => {
        Alert("عذرا، لا تملك صلاحية لعرض هذة المعاملة");
      });
  }
}

function openSubmission(data, actions, action, record, props, response_status) {
  const { setMainObject, t } = props;
  data =
    (typeof data == "string" &&
      JSON.parse(window.lzString.decompressFromBase64(data))) ||
    data;
  applyMapping(data, record).then((response) => {
    data = response.mainObject;

    window.Supporting = (data.Supporting == true ? {} : data.Supporting) || {};
    if (record.workflows) {
      data.submissionTypeName = record.workflows.name;
    }
    if (record.CurrentStep && record.CurrentStep.id) {
      data.currentStepId = record.CurrentStep.id;
    }

    retrieveFeesInfo(data, record);

    checkCommentsAvailability(data, record);

    // let paths = [];
    // collectAllPathsFromObject(data, "", paths);
    // //data["All_Attachments"] = paths;

    setMainObject(omit(data, ["allNotes", "workflow_id"]));
    applyCurrentModule1(record, action, actions, props, response_status);
  });
}

function applyCurrentModule1(record, action, actions, props, response_status) {
  const {
    user_groups,
    addToMainObject,
    name,
    setCurrentModule,
    history,
    removeMainObject,
    setMainObject,
    setComments,
    user,
    // here is the logged in user
    t,
  } = props;

  const {
    submission_file_path,
    id,
    is_delayed,
    CurrentStep,
    status,
    request_no,
    workflows,
  } = record;

  success(t);
  //

  // if (
  //   includes(["PROBLEM_REAL_ESTATE"], name) ||
  //   includes(["PROBLEM_EXPORT_SAK"], name) ||
  //   includes(["PROBLEM_SAK_REQUESTS"], name) ||
  //   includes(["unpaid"], name)
  // ) {
  //   setCurrentModule({
  //     record,
  //     actions: [
  //       {
  //         can_submit: 0,
  //         css_class: "btn-primary",
  //         id: 3,
  //         name: "global.RETURN",
  //         label: "global.RETURN",

  //       },
  //     ],
  //     id: CurrentStep?.module_id,
  //   });
  // }
  if (includes(["outbox"], name) || includes(["Outnbox_Ordering"], name)) {
    setCurrentModule({
      record,
      actions: (!record.transfered_user_id && actions) || [],
      name: "default_module",
      id: 2,
    });
    localStorage.setItem("req_no", request_no);
    localStorage.setItem("CurrentStep", CurrentStep.name);
    history("/wizard");
  } else if (includes(["Unsigned"], name) || includes(["signed"], name)) {
    setCurrentModule({
      record,
      actions: actions,
      name: "default_module",
      id: 7,
    });
    localStorage.setItem("req_no", request_no);
    localStorage.setItem("CurrentStep", CurrentStep.name);
    history("/wizard");
  } else if (
    includes(["inbox"], name) ||
    includes(["Inbox_Ordering"], name) ||
    includes(["UPDATING_SUBMISSIONS"], name) ||
    includes(["unpaid"], name) ||
    includes(["Paid"], name) ||
    (includes(["archive"], name) &&
      /*find(
        user_groups,
        (group) => group.id == get(CurrentStep, "groups.id", "")
      ) &&*/
      includes([1], status))
  ) {
    //2 is a finished submission & 3 is rejected
    if (includes(["archive"], name) && response_status == 270) {
      setCurrentModule({
        record,
        actions: (!record.transfered_user_id && actions) || [],
        name: "summary",
        id: 7,
      }); // default_module id
    } else {
      if (
        record.assign_to_user_id == props.user.id ||
        record.assign_to_position_id == props.user.position_id ||
        props.user.groups.find(
          (group) => group.id == record.assign_to_group_id
        ) != undefined
      ) {
        setCurrentModule({
          record,
          actions: (!record.transfered_user_id && actions) || [],
          id: CurrentStep?.module_id,
        });
      } else {
        setCurrentModule({
          record,
          actions: (!record.transfered_user_id && actions) || [],
          name: "default_module",
          id: 2,
        });
      }
    }
  } else {
    let action = status == 3 || status == 2 ? {} : actions;
    if (record.plan_status == 4) {
      //stopped plan status
      addToMainObject(record.stop_reason, "stoppingReason.stoppingReason");
    }

    setCurrentModule({
      record,
      actions: (!record.transfered_user_id && actions) || [],
      name: "default_module",
      id: 2,
    }); // default_module id
  }

  localStorage.setItem("req_no", request_no);
  localStorage.setItem("CurrentStep", CurrentStep.name);
  localStorage.setItem("workFlowName", workflows.name);
  history("/wizard");

  /*window.open( window.location.pathname +"#/wizardById/"+id
    +"?tk=" + localStorage.token+
    "&appname=" + localStorage.appname+
    "&appId=" + localStorage.appId+
    "&tabName=" + this.props.name
   , "_blank");*/
}

export function approveTransferd(record, index, action) {
  let { t, history, setModal } = this.props;
  var settings = {
    title: "قبول المعاملة المحولة",
    name: "TransferAccept",
    type: "confirmation",
    content: "هل أنت متأكد من قبول المعاملة المحولة؟",
    submit: () => {
      axios
        .post(
          `${workFlowUrl}/api/submission/approveTransferdSub?sub_id=${record.id}`
        )
        .then((data) => {
          window.notifySystem("success", t("Succesfully transfered"));

          reloadURI(action.reloadUrl, this.props, action.appId);
        });
    },
  };

  setModal({ ...settings });
}

export function rejectTransferd(record, index, action) {
  let { t, history, setModal } = this.props;

  var settings = {
    title: "رفض المعاملة المحولة",
    name: "TansferRejection",
    type: "confirmation",
    content: "هل أنت متأكد من رفض المعاملة المحولة؟",
    submit: () => {
      axios
        .post(
          `${workFlowUrl}/api/submission/refuseTransferdSub?sub_id=${record.id}`
        )
        .then((data) => {
          window.notifySystem("success", t("refused"));

          reloadURI(action.reloadUrl, this.props, action.appId);
        });
    },
  };

  setModal({ ...settings });
}

export function ActivateEmgComp(record, index, action) {
  let { t, history, setModal } = this.props;

  var settings = {
    title: "تفعيل",
    name: "Activate",
    type: "confirmation",
    content: "هل أنت متأكد من تفعيل المكتب؟",
    submit: () => {
      axios
        .post(`${workFlowUrl}/engineercompany/SetStatus/${record.id}`, {
          appid: action.appId,
          status: 0,
        })
        .then((data) => {
          window.notifySystem("success", t("actions:Succesfully activated"));

          reloadURI(action.reloadUrl, this.props, action.appId);
        });
    },
  };

  setModal({ ...settings });
}

export const reloadURI = (url, props, appId) => {
  const {
    next,
    count,
    results = [],
    fillData,
    setCountTab,
    getCountTab,
    moduleName,
    setLoading,
  } = props;

  //if (next) {
  fetchData(workFlowUrl + url).then(
    (result) => {
      const newResults = result.results;
      console.log("res", newResults);
      // ? [...results, ...recievedData]
      // : recievedData;

      fillData({ ...result, results: newResults }, moduleName);
      if (appId) {
        let countUrl = `/submission/counts?appid=${appId}`;
        axios
          .get(workFlowUrl + countUrl)
          .then(({ data }) => {
            setCountTab(data);
          })
          .catch((e) => {});
      }
    },
    () => {
      setLoading(false);
    }
  );
  //}
};

export function FreezeEngComp(record, index, action) {
  let { t, history, setModal } = this.props;

  var settings = {
    title: "تجميد",
    name: "Freezed",
    type: "confirmation",
    content: "هل أنت متأكد من تجميد المكتب؟",
    submit: () => {
      axios
        .post(`${workFlowUrl}/engineercompany/SetStatus/${record.id}`, {
          appid: action.appId,
          status: 1,
        })
        .then((data) => {
          window.notifySystem("success", t("actions:Succesfully freezed"));

          reloadURI(action.reloadUrl, this.props, action.appId);
        });
    },
  };

  setModal({ ...settings });
}

export function editReturned(record, index, action) {
  const {
    removeMainObject,
    setCurrentModule,
    history,
    setMainObject,
    setComments,
    t,
  } = this.props;
  let module_id = record.CurrentStep && record.CurrentStep?.module_id;
  localStorage.setItem("module_id", module_id);
  const { submission_file_path, CurrentStep, id, is_delayed } = record;
  localStorage.setItem("id_submission", id);
  removeMainObject();
  getJsonFile(submission_file_path, setMainObject, setComments)
    .then((data) => {
      data =
        (typeof data == "string" &&
          JSON.parse(window.lzString.decompressFromBase64(data))) ||
        data;
      getButtons(id, is_delayed).then((actions) => {
        // if(CurrentStep.is_create == 1) {
        //     setCurrentModule({record, actions, name: 'create_module', id:777})
        // } else {

        if (data.submissionType && typeof data.submissionType == "string") {
          delete data.submissionType;
        }

        applyMapping(data, record).then((response) => {
          data = response.mainObject;

          window.Supporting =
            (data.Supporting == true ? {} : data.Supporting) || {};
          if (record.workflows) {
            data.submissionTypeName = record.workflows.name;
          }
          if (record.CurrentStep && record.CurrentStep.id) {
            data.currentStepId = record.CurrentStep.id;
          }

          retrieveFeesInfo(data, record);

          checkCommentsAvailability(data, record);

          let paths = [];
          //collectAllPathsFromObject(data, "", paths);
          //data["All_Attachments"] = paths;

          setMainObject(omit(data, ["allNotes", "workflow_id"]));
          applyCurrentModule2(record, this.props);
        });
      });
    })
    .catch(() => {
      failure(t);
    });
}

function applyCurrentModule2(record, props) {
  const {
    removeMainObject,
    setCurrentModule,
    history,
    setMainObject,
    setComments,
    t,
  } = props;
  const {
    submission_file_path,
    CurrentStep,
    id,
    is_delayed,

    request_no,
  } = record;
  success(t);
  setCurrentModule({
    record,
    actions: [
      {
        name: "global.SUBMIT",
        can_submit: true,
        id: 1,
        css_class: "send",
      },
    ],
    id: CurrentStep?.module_id,
  });
  //}
  localStorage.setItem("req_no", request_no);
  localStorage.setItem("CurrentStep", CurrentStep.name);
  history("/wizard");
}

export function continueSubmission(record) {
  const { setMainObject, history, removeMainObject, setCurrentModule, t } =
    this.props;
  const { path } = record;

  removeMainObject();
  // const data = mainNodelObject
  fetchData(backEndUrlforMap + path)
    .then((data) => {
      let mainObject =
        (typeof data.mainObject == "string" &&
          JSON.parse(window.lzString.decompressFromBase64(data.mainObject))) ||
        data.mainObject;

      let submission =
        data.submission || {
          app_id: data.submission.app_id,
          workflow_id: data.submission.workflow_id,
          id:
            (data.submission.CurrentStep &&
              data.submission?.CurrentStep?.module_id) ||
            data.submission.id ||
            25,
          name: data.submission.module || "",
          actions: get(data, "submission.actions", [
            {
              name: "global.SUBMIT",
              can_submit: true,
              id: 1,
              css_class: "send",
            },
          ]),
        } ||
        {};

      if (!submission.id) {
        submission.id = data.submission?.CurrentStep?.module_id;
      }
      if (!data.submission.CurrentStep) {
        fetchData(
          `${workFlowUrl}/steps/GetAll?q=${data.submission.workflow_id}&filter_key=work_flow_id&operand=%3D&order=desc&page=0&pageSize=30`
        ).then((data) => {
          let result = data.results.find((result) => result.index == 1);

          submission.CurrentStep = result;
          applyCurrentModule3(record, submission, this.props, false);
        });
      }

      if (
        mainObject.submissionType &&
        typeof mainObject.submissionType == "string"
      ) {
        delete mainObject.submissionType;
      }

      applyMapping(mainObject, record, submission).then((response) => {
        mainObject = response.mainObject;

        window.Supporting =
          (mainObject.Supporting == true ? {} : mainObject.Supporting) || {};

        ////
        checkCommentsAvailability(mainObject, record);

        let paths = [];
        //collectAllPathsFromObject(mainObject, "", paths);
        //mainObject["All_Attachments"] = paths;

        setMainObject(omit(mainObject, ["allNotes", "workflow_id"]));
        applyCurrentModule3(record, submission, this.props);
      });
    })
    .catch((error) => {
      console.log(error);
      console.error(error);
      failure(t);
    });
}

function applyCurrentModule3(record, submission, props, is_redirect = true) {
  const { setMainObject, history, removeMainObject, setCurrentModule, t } =
    props;
  const { path, request_no, name } = record;
  console.log(record);

  setCurrentModule({
    record: assign({}, record, submission, {
      id: record.id,
      name: record.name,
    }),
    ...submission,
    draft: true,
  });
  localStorage.setItem("req_no", "");
  localStorage.setItem("CurrentStep", name);

  if (is_redirect) {
    success(t);
    history("/wizard");
  }
}

export function deleteFunc({ id }, index, action) {
  const { setModal, removeItemInResults, currentTab, t } = this.props;
  const { url, name, deleteFrom } = action;
  const deleteUrl = `${url}${id}`;
  let method = url.includes("ResetWarning") ? "get" : "delete";
  setModal({
    title: "Delete",
    content: "Are you sure you want to delete?",
    type: "confirmation",
    index,
    name,
    deleteFrom,
    submit: () => {
      axios[method](workFlowUrl + deleteUrl)
        .then(() => {
          window.notifySystem("success", t("Succesfully deleted"));
          let path = deleteFrom ? deleteFrom : currentTab;
          removeItemInResults(path, index);
          if (path.toLowerCase().indexOf("evaluationchart") != -1) {
            getEvaluationData(this.props);
          }
        })
        .catch(() => {
          window.notifySystem("error", t("Failed to delete"));
        });
    },
  });
}

export function print(record, index, action) {
  const { t } = this.props;
  initializeSubmissionData(record.id).then(
    (response) => {
      var mainObject = response.mainObject;
      if (record.app_id == 8) {
        try {
          if (
            (Array.isArray(eval(record.workflows.print_state)) &&
              mainObject.print_state) ||
            !mainObject.print_state
          ) {
            record.workflows.print_state = `#/survey_report/print_survay/`;
          }
        } catch (ex) {}
      }

      let imported_mainObject = checkImportedMainObject(response);
      var url =
        (record.app_id == 1
          ? (imported_mainObject && printHost) ||
            printHost.replace("gisv3", "gisv2")
          : printHost) + record.workflows.print_state;

      if ([42, 20, 28].indexOf(record.CurrentStep?.module_id) != -1) {
        mainObject["engUserNameToPrint"] = {
          engUserName: this?.props?.user.name,
          engUser: copyUser(this?.props),
        };
      }

      localStorage.setItem(
        "record",
        JSON.stringify(
          pick({ ...record }, ["request_no", "submission_file_path"])
        )
      );

      let savedObject = { ...mainObject, temp: {} };
      sendEdits(record.id, savedObject, t).then((d) => {
        window.open(
          url + record.id + "?tk=" + window.localStorage["token"],
          "_blank"
        );
      });
    },
    () => {
      window.notifySystem("error", "حدث خطأ");
    }
  );
}

export function invoicePrint(record, index, action, props) {
  const { t } = this.props;
  initializeSubmissionData(record.id).then(
    (response) => {
      var mainObject = response.mainObject;
      var url = printHost + "/#/parcels_invoice/";
      if ([42, 20, 28].indexOf(record.CurrentStep?.module_id) != -1) {
        mainObject["engUserNameToPrint"] = {
          engUserName: props.user.name,
          engUser: copyUser(props),
        };
      }

      let savedObject = { ...mainObject, temp: {} };
      sendEdits(record.id, savedObject, t).then((d) => {
        window.open(
          url + record.id + "?tk=" + window.localStorage["token"],
          "_blank"
        );
      });
    },
    () => {
      window.notifySystem("error", "حدث خطأ");
    }
  );
}

export function ma7darReport(record, index, action) {
  window.open(printHost + `/#/karar_lagna_print/${record.id}`, "_blank");
}

export function checkTabsColumnsByAppId(appId, cols) {
  if (appId == 30) {
    cols = cols.filter(
      (r) =>
        ["CreatorUser.departments.name", "owner_name"].indexOf(r.name) == -1
    );
  }
  return cols;
}
