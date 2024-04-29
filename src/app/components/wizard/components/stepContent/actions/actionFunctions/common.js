import { get, omit, pick, isEqual, every, isEmpty, keys } from "lodash";
import { fetchData } from "app/helpers/apiMethods";
import {
  getSubmission,
  createDraft,
  updateDraft,
  sendAlert,
  isVarifty,
  sign,
  sendMessage,
  sendEdits,
  continueSub,
  goToInboxScreen,
  checkFormsValidaity,
  settingMainObject,
} from "./apiActions";
import { getMap } from "main_helpers/functions/filters/state";
import { printHost, workFlowUrl } from "imports/config";

import {
  addFeaturesToMap_FeatureServer,
  addFeatures_ToUnplannedParcels,
  addInvestFeatures_FeatureServer,
  addPlanFeatures_FeatureServer,
  checkImportedMainObject,
  copyUser,
  deletePriApprovedPlanFeatures_FeatureServer,
  updateAndDeleteFeatures_FeatureServer,
  updateContractFeatures_FeatureServer,
  updateInvestFeatures_FeatureServer,
  updateLandBase_ParcelOwner_FeatureServer,
  update_ParcelOwner_FeatureServer,
} from "../../../../../inputs/fields/identify/Component/common/common_func";
// import { print } from "../../common";
export const updateSteps = (steps, mainObject) => {
  return keys(steps).filter(
    // get(props.wizardSettings, "steps")
    (key) =>
      steps[key].isHidden == undefined ||
      (typeof steps[key].isHidden == "function" &&
        !steps[key].isHidden(
          // (!isEmpty(mainObject?.Supporting) && mainObject?.Supporting) ||
          //   (!isEmpty(window.Supporting) && window.Supporting)
          { ...(mainObject.Supporting || {}), ...(window.Supporting || {}) }
        ))
  );
};

export const preview = (params, props, values) => {
  if (props.mainObject?.sakData) {
    let issuer = Object.values(props.mainObject?.sakData?.sakData?.saks)[0]
      ?.issuer;
    if (issuer) {
      props.mainObject.sakData.sakData.issuer = issuer;
    }
  }
  const {
    steps,
    currentStep,
    setCurrentStep,
    setModal,
    setMo3yna,
    setWorkflows,
    workflows,
  } = props;

  let mo3aynaObject = props.mainObject;
  let id = props.currentModule.workflow_id;

  if (props.record.request_no && props.record.request_no) {
    print(null, props, values);
  } else {
    let print_host =
      workflows && workflows.filter((d) => d.id == id)[0]?.print_state;
    if (props.record.app_id == 1) {
      if (workflows && print_host && print_host.includes("print_parcel")) {
        setModal({
          title: "فرز ارض فضاء",
          name: "fda2",
          className: "mo3yna_full",
          type: "parcels",
          mo3aynaObject: mo3aynaObject,
        });
      } else {
        setModal({
          title: "فرز دوبلكسات",
          name: "duplix",
          className: "mo3yna_full",
          type: "duplxis",
          mo3aynaObject: mo3aynaObject,
        });
      }
    } else if (props.record.app_id == 8) {
      setModal({
        title: "كروكي مساحي",
        name: "kroky",
        className: "mo3yna_full",
        type: "globalMo3yna",
        mo3aynaObject: mo3aynaObject,
      });
    } else if (props.record.app_id == 14) {
      setModal({
        title: "تحديث الصكوك",
        name: "contractupdate",
        className: "mo3yna_full",
        type: "globalMo3yna",
        mo3aynaObject: mo3aynaObject,
      });
    } else if (props.record.app_id == 25) {
      setModal({
        title: "أراضي التخصيص",
        name: "landsallotment",
        className: "mo3yna_full",
        type: "globalMo3yna",
        mo3aynaObject: mo3aynaObject,
      });
    } else if (props.record.app_id == 27) {
      setModal({
        title: "فحص الملكية",
        name: "propertycheck",
        className: "mo3yna_full",
        type: "globalMo3yna",
        mo3aynaObject: mo3aynaObject,
      });
    }
    // else if (props.record.app_id == 27) {
    //   setModal({
    //     title: "فحص الملكية",
    //     name: "propertycheck",
    //     className: "mo3yna_full",
    //     type: "globalMo3yna",
    //     mo3aynaObject: mo3aynaObject,
    //   });
    // }
    //   else if (props.record.app_id == 27) {
    //     setModal({
    //       title: "أراضى التخصيص ",
    //       name: "landCust",
    //       className: "mo3yna_full",
    //       type: "globalMo3yna",
    //       mo3aynaObject: mo3aynaObject,
    //     });
    //   }
  }

  console.log("preview", props, params, values);
};
export const doNextAction = async (params, props, values) => {
  const {
    currentStep,
    setCurrentStep,
    t,
    record,
    setMainObjectNoPath,
    setMo3yna,
    mainObject,
  } = props;
  setMo3yna({});
  const mainStep = get(props.wizardSettings.steps, currentStep, {});

  let steps = updateSteps(get(props.wizardSettings, "steps"), mainObject);
  const promise = get(mainStep, "preSubmit", (values) =>
    Promise.resolve(values)
  );
  values = await promise(values, mainStep, props);

  if (currentStep.includes("finalApproval")) {
    const val = get(values, "finalApproval.finalApproval");
    const ObjectsHas = [
      "issuer",
      "subject",
      "outbox.number",
      "outbox.date",
      "outbox.attachment",
      "inbox.number",
      "inbox.date",
      "inbox.attachment",
    ];
    let valid = every(val, (o) => every(ObjectsHas, (k) => get(o, k, false)))
      ? true
      : false;
    if (valid) {
      settingMainObject(values, props);
      setCurrentStep(get(steps, steps.indexOf(currentStep) + 1));
    } else {
      window.notifySystem("error", t("the table is required to be filled"));
    }
  } else if (
    currentStep.includes("firstData") &&
    get(record, "CurrentStep.is_create") &&
    !get(record, "is_returned")
  ) {
    if (
      get(values, "firstData.submission_type", null) == "2" &&
      get(values, "firstData.find_submission", null) == "1"
    ) {
      getSubmission(props, values);
    } else {
      setMainObjectNoPath({});
      settingMainObject(values, props);
      setCurrentStep(get(steps, steps.indexOf(currentStep) + 1));
    }
  } else {
    settingMainObject(values, props);
    setCurrentStep(get(steps, steps.indexOf(currentStep) + 1));
  }
};

export const next = async (params, props, values) => {
  const {
    steps,
    currentStep,
    setCurrentStep,
    t,
    record,
    setMainObjectNoPath,
    setMo3yna,
    mainObject,
  } = props;
  if (
    !Object.values(mainObject?.summery?.summery || {})?.filter(
      (comment) =>
        comment != undefined &&
        !isEmpty(comment.comments) &&
        comment?.checked == false
    )?.length
  ) {
    if (
      record.is_returned &&
      steps.findIndex((step) => step.toLowerCase() == "summery") == 0
    ) {
      if (
        !Object.values(mainObject?.comments || {})?.filter(
          (com) =>
            (com != undefined &&
              Array.isArray(com) &&
              com.find(
                (comment) =>
                  !isEmpty(comment.comment) &&
                  comment?.checked == true &&
                  isEmpty(comment.reply_text) &&
                  ((!comment?.step?.isRequestModule &&
                    comment?.step?.module_id == props.currentModule.id &&
                    comment?.step?.stepId ==
                      props.currentModule.record.CurrentStep.id) ||
                    (comment?.step?.isRequestModule &&
                      comment?.step?.stepId ==
                        props.currentModule.record.CurrentStep.id))
              ) != undefined) ||
            (!Array.isArray(com) &&
              !isEmpty(com.comment) &&
              com?.checked == true &&
              isEmpty(com.reply_text) &&
              ((!com?.step?.isRequestModule &&
                com?.step?.module_id == props.currentModule.id &&
                com?.step?.stepId ==
                  props.currentModule.record.CurrentStep.id) ||
                (com?.step?.isRequestModule &&
                  com?.step?.stepId ==
                    props.currentModule.record.CurrentStep.id)))
        )?.length
      ) {
        doNextAction(params, props, values);
      } else {
        window.notifySystem("error", "من فضلك ادخل الرد على التعليقات");
      }
    } else {
      doNextAction(params, props, values);
    }
  } else {
    window.notifySystem(
      "error",
      "لا يمكن عمل التالي حتي يتم تنفيذ التعليقات المدخلة"
    );
  }
};

export const previous = (params, props, values) => {
  // const { currentStep, setCurrentStep, setMo3yna, mainObject } = props;
  const {
    currentStep,
    setCurrentStep,
    t,
    record,
    setMainObjectNoPath,
    setMo3yna,
    mainObject,
  } = props;
  // const { setModal, setMo3yna } = props;
  setMo3yna({});
  settingMainObject(props.formValues, props);

  let steps = updateSteps(get(props.wizardSettings, "steps"), mainObject);
  // if (
  //   currentStep == "summery" &&
  //   steps.findIndex((step) => step.toLowerCase() == "summery") ==
  //     steps.length - 1
  // ) {
  //   Object.keys(mainObject.summery.summery)
  // }
  setCurrentStep(get(steps, steps.indexOf(currentStep) - 1));
};

// const Pre_Submit = (params, props, values)=>{
//     const {currentStep, mainObject, setMainObjectNoPath} = props;
//     if(get(mainObject, 'remark.comment', false) || get(mainObject, 'remark.attachment', false)){
//         let remarks = [...get(mainObject, "remarks", []), {...get(mainObject, 'remark'), step: currentStep}]
//         const newObject = {...mainObject, remark: {}, remarks}
//         setMainObjectNoPath(newObject);
//         return Promise.resolve(newObject)
//     }
//     return Promise.resolve(mainObject);

// }

const setSecratoryName = (props) => {
  let { mainObject } = props;
  return new Promise((resolve, reject) => {
    if (
      props.record?.app_id == 1 &&
      [881, 1995, 1952, 2003, 2112, 2151, 2251, 2296].indexOf(
        props.record?.CurrentStep?.id
      ) != -1
    ) {
      mainObject.engSecratoryName = props.user?.name;
      mainObject.engSecratoryUser = {
        engSecratoryName: props.user?.name,
        user: copyUser({ user: props?.user }),
      };
      return resolve(true);
    } else if (
      [8, 14].indexOf(props.record?.app_id) != -1 &&
      [20, 19].indexOf(props.record?.CurrentStep?.module_id) != -1
    ) {
      //////
      getPositionName(props.user.position_id).then((positionName) => {
        //////
        mainObject[
          (props.record?.CurrentStep?.module_id == 20 && "surveyUser") ||
            "surveyManagerUser"
        ] = {
          [(props.record?.CurrentStep?.module_id == 20 && "surveyName") ||
          "surveyManagerName"]: props.user?.name,
          user: copyUser({ user: props?.user }),
          position: positionName,
        };
        return resolve(true);
      });
    } else {
      return resolve(true);
    }
  });
};

const getPositionName = (position_id) => {
  //////
  return new Promise((resolve, reject) => {
    fetchData(`${workFlowUrl}/Position/${position_id}`).then((data) => {
      //////
      return resolve(data?.name);
    });
  });
};

export const SUBMIT = (params, props, values) => {
  if (values.lagna_karar && values.lagna_karar.planStatus == "1") return;
  if (props.mainObject?.sakData) {
    let issuer = Object.values(props.mainObject?.sakData?.sakData?.saks)[0]
      ?.issuer;
    if (issuer) {
      props.mainObject.sakData.sakData.issuer = issuer;
    }
  }

  const { setModal, setMo3yna } = props;
  setMo3yna({});
  let map = getMap();
  settingMainObject(
    (props?.currentModule?.record?.workflows?.app_id == 16 &&
      map &&
      props.formValues) ||
      values,
    props
  );
  setModal({
    title: "Submisison Submit",
    name: "submitSubmission",
    type: "confirmation",
    content: "Are you sure from this action?",
    submit: () => {
      setSecratoryName(props).then(() => {
        if (
          props?.currentModule?.record?.workflows?.app_id == 27 &&
          props?.currentModule?.id == 135
        ) {
          addFeatures_ToUnplannedParcels(props.mainObject, props.record).then(
            (res) => {
              isVarifty(props, values);
            }
          );
        } else {
          isVarifty(
            props,
            (props?.currentModule?.record?.workflows?.app_id == 16 &&
              map &&
              props.formValues) ||
              values
          );
        }
      });
    },
  });
};

export const saveDraft = (params, props, values) => {
  const {
    user,
    currentStep,
    mainObject,
    setModal,
    currentModule: { record, draft },
    t,
    setMo3yna,
  } = props;
  setMo3yna({});
  settingMainObject(values, props);
  //adding last step to the json_file cause it might not be yet added in the store
  let json_file = mainObject || {};
  json_file.Supporting = window.Supporting || {};
  // if(currentStep.includes("Notes") && values) {
  //     let newNotes = allNotes
  //     values[`notes${id}`] ?
  //     newNotes[currentStep] = concat([], get(values, `notes${id}`, [])) : null
  //     setAllNotes(newNotes)
  //     json_file.allNotes = newNotes;
  // } else if (!isEmpty(allNotes)) {
  //     json_file.allNotes = allNotes;
  // }

  if (values && !isEqual(currentStep, "summery")) {
    json_file[currentStep] = values;
    json_file[currentStep].user = user;
  }
  json_file = omit({ ...json_file }, "summery");

  if (record && record.request_no) {
    saveEditsًWithoutPopup(params, props, values);
  } else if (draft) {
    updateDraft(
      record,
      json_file,
      t,
      record.workflow_id,
      props.currentModule,
      props
    );
  } else {
    setModal({
      title: "set draft name",
      name: "saveDraft",
      type: "inputs",
      fields: [
        {
          name: "name",
          label: "File name",
          required: true,
        },
      ],
      submit: (vals) => {
        createDraft(
          vals,
          json_file,
          t,
          record.workflow_id,
          record.app_id,
          props.currentModule,
          props
        );
      },
    });
  }
};
export const sendSMS = (params, props, values) => {
  const { setModal, t, setMo3yna } = props;
  setMo3yna({});

  setModal({
    title: "Send SMS",
    name: "sendMessage",
    type: "inputs",
    fields: [
      {
        name: "owner_phone",
        label: "Owner",
        field: "boolean",
      },
      {
        name: "reprs_phone",
        label: "Representative",
        field: "boolean",
      },
      {
        name: "eng_office_phone",
        label: "Engineering office",
        field: "boolean",
      },
      {
        name: "MessageText",
        label: "Message",
        field: "textArea",
        hideLabel: true,
        required: true,
      },
    ],
    submit: (vals) => {
      sendMessage(props, vals, t);
    },
  });
};

export const cancel = (params, props, values) => {
  const {
    setModal,
    setMo3yna,
    setUploadFileDetails,
    setEditableFeatures,
    setOriginalFeatures,
  } = props;
  setMo3yna({});
  setModal({
    title: "Cancel",
    name: "rejectSubmission",
    type: "confirmation",
    content: "Are you sure?",
    submit: () => {
      //props.history.goBack();
      setUploadFileDetails({});
      setEditableFeatures({});
      setOriginalFeatures({});
      goToInboxScreen(props.history);
    },
  });
};

export const REJECT = (params, props, values) => {
  const { setModal, setMo3yna } = props;
  setMo3yna({});
  settingMainObject(values, props);
  setModal({
    title: "Reject",
    name: "rejectSubmission",
    className: "d",
    type: "confirmation",
    content: "Are you sure from this action?",
    submit: () => {
      if (props?.currentModule?.record?.workflows?.app_id == 27) {
        addFeatures_ToUnplannedParcels(props.mainObject, props.record).then(
          (res) => {
            isVarifty(props, values);
          }
        );
      } else {
        isVarifty(props, values);
      }
    },
  });
};
export const STOP = (params, props, values) => {
  const { setModal, setMo3yna } = props;
  setMo3yna({});
  settingMainObject(values, props);
  setModal({
    title: "Stop",
    name: "stopSubmission",

    type: "inputs",
    fields: [
      {
        name: "stop_reason",
        label: "Reason for Stopping",
        field: "textArea",
        required: true,
      },
    ],
    submit: (vals) => {
      isVarifty(props, values, vals);
    },
  });
};

const reassign = (params, props, values, name, title, customFooter = null) => {
  const { setModal, setMo3yna } = props;
  setMo3yna({});
  settingMainObject(values, props);
  ////
  var settings = {
    title,
    name,
    type: "confirmation",
    content: "Are you sure from this action?",
    submit: () => {
      isVarifty(props, values, params);
    },
  };
  if (customFooter) {
    settings["customFooter"] = [...customFooter];
  }
  setModal({ ...settings });
};

export const RETURN = (params, props, values) => {
  props.setMo3yna({});
  reassign(params, props, values, "returnSubmission", "Return");
};

export const RETURNFROMSTART = (params, props, values) => {
  ////
  props.setMo3yna({});
  reassign(params, props, values, "returnSubmission", "Return");
};

export const ASSIGN = (params, props, values) => {
  props.setMo3yna({});
  if (props.mainObject?.sakData) {
    let issuer = Object.values(props.mainObject?.sakData?.sakData?.saks)[0]
      ?.issuer;
    if (issuer) {
      props.mainObject.sakData.sakData.issuer = issuer;
    }
  }

  reassign(params, props, values, "assignSubmission", "Assign");
};

export const ASSIGNMULTI = (params, props, values) => {
  reassign(params, props, values, "assignSubmission", "Assign multi");
};
export const GOTO = (params, props, values) => {
  reassign(params, props, values, "gotoSubmission", "Go to");
};
export const TRANSFER = (params, props, values) => {
  reassign(params, props, values, "transferSubmission", "transfer");
};

export const SIGN = (params, props, values) => {
  const {
    currentModule: { record },
    t,
    history,
    setModal,
  } = props;
  //
  var settings = {
    title: "موافقة",
    name: "موافقة",
    type: "confirmation",
    content: "Are you sure from this action?",
    submit: () => {
      sign(record.id, record.CurrentStep.id, t, history);
    },
  };
  setModal({ ...settings });
};

export const BACK = (params, props, values) => {
  const { setModal } = props;
  props.setMo3yna({});
  settingMainObject(values, props);
  var settings = {
    title: "Back",
    name: "backSubmission",
    type: "confirmation",
    content: "Are you sure from this action?",
    submit: () => {
      isVarifty(props, values);
    },
  };
  setModal({ ...settings });
};
export const APPROVE = (params, props, values) => {
  props.setMo3yna({});
  if (props.mainObject?.sakData) {
    let issuer = Object.values(props.mainObject?.sakData?.sakData?.saks)[0]
      ?.issuer;
    if (issuer) {
      props.mainObject.sakData.sakData.issuer = issuer;
    }
  }
  // let propsWithIssuer = {
  //   ...props,
  //   "props.mainObject.sakData.sakData.saks.issuer": issuer,
  // };
  setSecratoryName(props).then(() => {
    reassign(
      params,
      props,
      values,
      "approveSubmission",
      "Approve",
      props.record.app_id == 1 && [
        // {
        //   label: "WITHOUT_EXPORT_NO",
        //   class: "btn follow",
        //   onClick: (evt) => {
        //     props.record.without_export_no = true;
        //     //setSecratoryName(props);
        //     isVarifty(props, values, params);
        //     props.removeModal();
        //   },
        // },
        {
          label: "WITH_EXPORT_NO",
          class: "btn follow",
          onClick: (evt) => {
            //setSecratoryName(props);
            isVarifty(props, values, params);
            props.removeModal();
          },
        },
      ]
    );
  });
};
export const SENDAMANA = (params, props, values) => {
  props.setMo3yna({});
  if (props.mainObject?.sakData) {
    let issuer = Object.values(props.mainObject?.sakData?.sakData?.saks)[0]
      ?.issuer;
    if (issuer) {
      props.mainObject.sakData.sakData.issuer = issuer;
    }
  }
  const { setModal } = props;
  let map = getMap();
  settingMainObject(
    (props?.currentModule?.record?.workflows?.app_id == 16 &&
      map &&
      props.formValues) ||
      values,
    props
  );

  var settings = {
    title: "Send Amana",
    name: "approveSubmission",
    type: "confirmation",
    content: "Are you sure from this action?",
    submit: () => {
      isVarifty(
        props,
        (props?.currentModule?.record?.workflows?.app_id == 16 &&
          map &&
          props.formValues) ||
          values
      );
    },
  };
  setModal({ ...settings });
};

export const alert = (params, props, values) => {
  props.setMo3yna({});
  const {
    currentModule: { record },
    t,
  } = props;
  sendAlert(record.id, t);
};

export const print = (params, props, values) => {
  // props.setMo3yna({});

  const {
    currentModule: { record },
    wizardSettings = {},
    mainObject,
    currentStep,
    t,
  } = props;
  // Printing
  if (record.app_id == 14) {
    let pritBtn = document.getElementsByClassName("grid-3");
    pritBtn.classList.add("printDisappear");
  }
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

  let imported_mainObject = checkImportedMainObject(props);
  var url =
    (record.app_id == 1
      ? (imported_mainObject && printHost) ||
        printHost.replace("gisv3", "gisv2")
      : printHost) + record.workflows.print_state;

  if ([42, 20, 28].indexOf(record.CurrentStep?.module_id) != -1) {
    mainObject["engUserNameToPrint"] = {
      engUserName: props.user.name,
      engUser: copyUser(props),
    };
  } else if ([103].indexOf(record.CurrentStep?.module_id) != -1) {
    mainObject["allotmentUserNameToPrint"] = {
      allotmentUserName: props?.user.name,
      allotmentUser: copyUser(props),
    };
  }
  let savedObject = {
    ...mainObject,
    temp: {},
    Supporting: {
      ...(mainObject.Supporting || {}),
      ...(window.Supporting || {}),
    },
  };
  savedObject[`${currentStep}`] = values;
  // delete savedObject.summery;

  sendEdits(record.id, savedObject, t).then((d) => {
    window.open(url + record.id, "_blank");
  });
  localStorage.setItem(
    "record",
    JSON.stringify(pick({ ...record }, ["request_no", "submission_file_path"]))
  );
};

export const saveEdits = (params, props, values) => {
  props.setMo3yna({});
  const {
    currentModule: { record },
    mainObject,
    currentStep,
    t,
    setModal,
  } = props;

  settingMainObject(values, props);

  setModal({
    title: "Save edits",
    name: "saveEdits",
    type: "confirmation",
    content: "Are you sure?",
    submit: () => {
      let savedObject = {
        ...mainObject,
        temp: {},
        Supporting: {
          ...(mainObject.Supporting || {}),
          ...(window.Supporting || {}),
        },
      };
      savedObject[`${currentStep}`] = values;
      // delete savedObject.summery;
      sendEdits(record.id, savedObject, t);
    },
  });
};

export const saveEditsًWithoutPopup = (params, props, values) => {
  props.setMo3yna({});
  return new Promise((resolve, reject) => {
    const {
      currentModule: { record },
      mainObject,
      currentStep,
      t,
    } = props;
    //
    settingMainObject(values, props);
    let savedObject = {
      ...mainObject,
      temp: {},
      Supporting: {
        ...(mainObject.Supporting || {}),
        ...(window.Supporting || {}),
      },
    };
    savedObject[`${currentStep}`] = values;
    // delete savedObject.summery;
    sendEdits(record.id, savedObject, t)
      .then(() => {
        resolve();
      })
      .catch(() => {
        reject();
      });
  });
};

export const continueSubmission = (params, props, values) => {
  if (props.mainObject?.sakData) {
    let issuer = Object.values(props.mainObject?.sakData?.sakData?.saks)[0]
      ?.issuer;
    if (issuer) {
      props.mainObject.sakData.sakData.issuer = issuer;
    }
  }
  props.setMo3yna({});
  const { record, t, history, setModal } = props;
  setModal({
    title: "Continue submission",
    name: "continueSubmission",
    type: "confirmation",
    content: "Are you sure?",
    submit: () => {
      continueSub(get(record, "id"), t, history);
    },
  });
};

export const FINISH = (params, props, values) => {
  props.setMo3yna({});
  const { setModal } = props;

  console.log("finish", props);
  let map = getMap();
  settingMainObject(
    (props?.currentModule?.record?.workflows?.app_id == 16 &&
      map &&
      props.formValues) ||
      values,
    props
  );
  setModal({
    title: "Finish",
    name: "finishSubmission",
    type: "confirmation",
    content: "Are you sure from this action?",
    submit: () => {
      if (window.updateMap) {
        if (
          props?.mainObject?.landData?.landData?.lands?.parcels?.length !=
          props?.mainObject?.suggestParcel?.suggestParcel?.suggestParcels?.polygons?.filter(
            (x) => x.polygon.layer == "boundry"
          ).length
        ) {
          window.notifySystem(
            "error",
            "عذرًا لا يمكن إنهاء المعاملة من خلال النظام"
          );
        } else {
          window.updateMap().then((result) => {
            isVarifty(props, values);
          });
        }
      } else {
        //2209, 2210
        if (props?.currentModule?.id == 52) {
          checkFormsValidaity(props).then((isFormsValidated) => {
            if (isFormsValidated) {
              addPlanFeatures_FeatureServer(
                props.mainObject,
                props.currentModule.record,
                props
              ).then((res) => {
                deletePriApprovedPlanFeatures_FeatureServer(
                  props.mainObject,
                  props.currentModule.record,
                  props,
                  window.mapUrl
                ).then((res) => {
                  isVarifty(props, props.formValues || values);
                });
              });
            }
          });
        }
        // else if (
        //   props?.currentModule?.record?.workflows?.app_id == 16 &&
        //   props?.currentModule?.record?.workflows?.id == 2210
        // ) {
        //   addGovPlanFeatures_FeatureServer(props.mainObject, props.currentModule.record, props).then((res) => {
        //     //isVarifty(props, values);
        //   });
        // }
        //2252
        else if (props?.currentModule?.id == 102) {
          addFeaturesToMap_FeatureServer(props.mainObject).then((res) => {
            isVarifty(props, values);
          });
        }
        //2253
        else if (props?.currentModule?.id == 133) {
          updateAndDeleteFeatures_FeatureServer(props.mainObject).then(
            (res) => {
              isVarifty(props, values);
            }
          );
        }
        //invest app
        //2154
        else if (props?.currentModule?.id == 101) {
          if (
            props.mainObject.efada_lands_statements?.efada_lands_statements
              ?.efada_melkia_aradi == 1 &&
            props.mainObject.efada_municipality_statements
              ?.efada_municipality_statements?.efada__invest_activity == 2 &&
            props.mainObject.efada_plan_statements?.efada_plan_statements
              ?.efada__suggested_activity == 1
          ) {
            //update
            if (
              props.mainObject.investType.invest_type.SelectedLayer ==
              "Invest_Site_Polygon"
            ) {
              updateInvestFeatures_FeatureServer(props.mainObject).then(
                (res) => {
                  isVarifty(props, values);
                }
              );
            }
            //copy and delete
            else {
              addInvestFeatures_FeatureServer(props.mainObject).then((res) => {
                isVarifty(props, values);
              });
            }
          } else if (
            props.mainObject?.efada_lands_statements?.efada_lands_statements
              ?.efada_melkia_aradi == 2
          ) {
            update_ParcelOwner_FeatureServer(
              props.mainObject,
              props.mainObject.investType.invest_type.SelectedLayer
            ).then((res) => {
              isVarifty(props, values);
            });
          } else {
            isVarifty(props, values);
          }
        }

        //contract update app
        //2088
        else if (props?.currentModule?.id == 118) {
          updateContractFeatures_FeatureServer(props.mainObject).then((res) => {
            isVarifty(props, values);
          });
        }
        //propetry check
        //2155
        /*else if (props?.currentModule?.id == 119) {
          addFeatures_ToUnplannedParcels(props.mainObject, props.record).then(
            (res) => {
              isVarifty(props, values);
            }
          );
        }*/
        else {
          isVarifty(props, values);
        }
      }
    },
  });
};
