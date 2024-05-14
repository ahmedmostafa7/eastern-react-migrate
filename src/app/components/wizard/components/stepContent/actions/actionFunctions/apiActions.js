import plans_status from "../../../../plan_status";
import {
  keys,
  omit,
  mapValues,
  get,
  xor,
  isEqual,
  omitBy,
  isNull,
  pick,
  isArray,
  isEmpty,
  map,
  concat,
  toArray,
  isNumber,
} from "lodash";
import { workFlowUrl } from "imports/config";
import { getFormValues } from "redux-form";
import {
  convertToArabic,
  applyEditsByParams,
  convertToEnglish,
  delete_null_object,
  map_subM,
  getInfo,
  getFieldDomain,
  getSubdivisionCode,
  getFeatureDomainCode,
  getFeatureDomainName,
  copyUser,
  checkImportedMainObject,
  checkRequestNoOfImportedMainObject,
  selectMainObject,
  addGovPlanFeatures_FeatureServer,
  addPlanFeatures_FeatureServer,
  queryTask,
} from "../../../../../inputs/fields/identify/Component/common/common_func";
import { setPrintSignatures } from "../../../../../../../../src/main_helpers/functions/prints/print_func";
import { setMap } from "main_helpers/functions/filters/state";
import { postItem, updateItem, fetchData } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import * as preActions from "./saved_data";
import { message } from "antd";
const draftApi = "/api/draft/";
import moment from "moment-hijri";
import store from "app/reducers";
import { checkRealEstateObject } from "./realestate_object";
import { extractImportantData } from "./tadkek_data_paths";
import { setPlanDefaults } from "../../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/planDefaults";
export const settingMainObject = (values, props) => {
  const { currentStep, setMainObject, user, mainObject } = props;
  let currentUser = user;
  // return new Promise((resolve, reject) => {
  let vals = values;
  let obsoleteObjects = [];
  if (!isEmpty(vals)) {
    Object.keys(vals).forEach((key) => {
      if (key != "user") {
        Object.keys(props.wizardSettings.steps).forEach((stepKey) => {
          if (
            Object.keys(props.wizardSettings.steps[stepKey]?.sections).indexOf(
              key
            ) != -1 &&
            stepKey != props.currentStep
          ) {
            obsoleteObjects.splice(0, 0, key);
          }
        });
      }
    });
  }
  setMainObject(omit(values, obsoleteObjects), currentStep, currentUser);
  //   resolve();
  // });
};
export const createDraft = (
  values,
  json_file,
  t,
  workflow_id,
  app_id,
  currentModule,
  props
) => {
  let imported_mainObject = checkImportedMainObject(props);

  setImportedMainObjectAsBoolean(
    json_file,
    imported_mainObject,
    currentModule.record
  );

  var data =
    json_file?.landData ||
    imported_mainObject?.landData ||
    json_file?.LandWithCoordinate;
  if (data) delete data?.landData?.lands?.temp?.map;

  const params = {
    app_id,
    workflow_id,

    json_file: {
      submission: {
        app_id,
        workflow_id,
        CurrentStep: currentModule.record.CurrentStep,

        ...pick(currentModule, ["id", "name", "actions", "CurrentStep"]),
      },
      //mainObject: { ...json_file },
      mainObject: window.lzString.compressToBase64(
        JSON.stringify({ ...json_file })
      ),
    },
    ...values,
  };

  postItem(draftApi, { ...params })
    .then(() => {
      message.success(t("Successfully created draft"));
    })
    .catch((error) => {
      const message = error.response.data
        ? error.response.data
        : "Failed to create draft";
      message.error(t(message));
    });
};

export const updateDraft = (
  draft,
  json_file,
  t,
  workflow_id,
  currentModule,
  props
) => {
  let imported_mainObject = checkImportedMainObject(props);

  setImportedMainObjectAsBoolean(
    json_file,
    imported_mainObject,
    currentModule.record
  );

  var data =
    json_file?.landData ||
    imported_mainObject?.landData ||
    json_file?.LandWithCoordinate;
  if (data) delete data?.landData?.lands?.temp?.map;

  const params = {
    ...draft,
    workflow_id,
    json_file: {
      submission: {
        app_id: draft.app_id,
        workflow_id,
        ...pick(currentModule, ["id", "name", "actions", "CurrentStep"]),
      },
      //mainObject: { ...json_file },
      mainObject: window.lzString.compressToBase64(
        JSON.stringify({ ...json_file })
      ),
    },
  };

  updateItem(draftApi, { ...params }, draft.id)
    .then(() => {
      window.notifySystem("success", t("Successfully updated"));
    })
    .catch((e) => {
      console.log(e);
      handleErrorMessages(e, t);
    });
};

export const checkFormsValidaity = (props) => {
  return new Promise((resolve, reject) => {
    const { setStep, actionName } = props;
    //setMap(undefined);
    if (
      [
        "GOTO",
        "RETURN",
        "REJECT",
        "APPROVE",
        "BACK",
        "RETURNFROMSTART",
      ].indexOf(actionName.toUpperCase()) == -1
    ) {
      let validSteps = [];
      let isRouted = false;
      Object.keys(props.wizardSettings.steps).forEach((stepKey) => {
        const promise = get(
          props.wizardSettings.steps[stepKey],
          "preSubmit",
          (values) => {
            //
            return Promise.resolve(values);
          }
        );

        let values =
          (props.currentStep == stepKey && props.formValues) || undefined;
        promise(
          props.mainObject[stepKey],
          props.wizardSettings.steps[stepKey],
          { ...props, formValues: values }
        )
          .then((values) => {
            validSteps.push(stepKey);
            if (
              validSteps.length ==
              Object.keys(props.wizardSettings.steps).length
            ) {
              return resolve(true);
            }
          })
          .catch((err) => {
            if (!isRouted) {
              isRouted = true;
              window.notifySystem(
                "error",
                "برجاءالتحقق من اتمام المطلوب في جميع الشاشات"
              );
              setStep(stepKey);
              return reject();
            }
          });
      });
    } else {
      return resolve(true);
    }
  });
};

const checkComments = (props, reAssign) => {
  const { mainObject, setStep, actionName, currentModule } = props;
  return new Promise((resolve, reject) => {
    if (
      ["FINISH", "GOTO", "RETURN", "REJECT", "APPROVE", "BACK"].indexOf(
        actionName.toUpperCase()
      ) == -1
    ) {
      if (mainObject?.comments) {
        if (
          Object.keys(mainObject?.comments).filter(
            (commentKey) =>
              commentKey == "remarks" &&
              mainObject?.comments[commentKey].length &&
              mainObject?.comments[commentKey].find(
                (comm) =>
                  !isEmpty(comm) &&
                  (comm.checked == false || comm.checked == undefined) &&
                  !isEmpty(comm.comment) &&
                  !isEmpty(comm.step)
              ) != undefined
          ).length > 0
        ) {
          window.notifySystem("error", "برجاء مراجعة التعليقات في الملخص");
          return resolve(false);
        } else if (
          Object.keys(mainObject?.comments).filter(
            (commentKey) =>
              commentKey != "remarks" &&
              mainObject?.comments[commentKey].length &&
              mainObject?.comments[commentKey].find(
                (comm) =>
                  !isEmpty(comm) &&
                  (comm.checked == false || comm.checked == undefined) &&
                  !isEmpty(comm.comment) &&
                  isEmpty(comm.commentStep) &&
                  ((!(comm?.step || comm.commentStep)?.isRequestModule &&
                    (comm?.step || comm.commentStep)?.module_id ==
                      currentModule.id &&
                    (comm?.step || comm.commentStep)?.stepId ==
                      currentModule.record.CurrentStep.id) ||
                    ((comm?.step || comm.commentStep)?.isRequestModule &&
                      (comm?.step || comm.commentStep)?.stepId ==
                        currentModule.record.CurrentStep.id)) &&
                  Object.values(mainObject?.comments).filter(
                    (comment) =>
                      comment.find(
                        (subComment) =>
                          subComment?.commentStep?.name == commentKey
                      ) != undefined
                  ).length == 0
              ) != undefined
          ).length > 0
        ) {
          window.notifySystem("error", "برجاء مراجعة التعليقات في الملخص");
          return resolve(false);
        } else if (
          Object.keys(
            Object.keys(mainObject.comments)
              .filter(
                (commentKey) =>
                  commentKey != "remarks" &&
                  mainObject.comments[commentKey].length &&
                  mainObject.comments[commentKey].find(
                    (comm) =>
                      (comm.checked == false || comm.checked == undefined) &&
                      !isEmpty(comm.comment) &&
                      !isEmpty(comm.commentStep)
                  ) != undefined &&
                  mainObject?.summery?.summery &&
                  mainObject?.summery?.summery[commentKey] == undefined
              )
              ?.reduce(
                (groups, itemKey) => ({
                  ...groups,
                  [mainObject.comments[itemKey][0]?.commentStep?.stepId]: [
                    ...(groups[
                      mainObject.comments[itemKey][0]?.commentStep?.stepId
                    ] || []),
                    mainObject.comments[itemKey],
                  ],
                }),
                {}
              )
          ).length > 1
        ) {
          window.notifySystem(
            "error",
            "لا يمكن ادخال تعليقات لأكثر من خطوة في الملخص"
          );
          return resolve(false);
        } else if (
          Object.keys(
            Object.keys(mainObject.comments)
              .filter(
                (commentKey) =>
                  commentKey != "remarks" &&
                  mainObject.comments[commentKey].length &&
                  mainObject.comments[commentKey].find(
                    (comm) =>
                      (comm.checked == false || comm.checked == undefined) &&
                      !isEmpty(comm.comment) &&
                      !isEmpty(comm.commentStep) &&
                      ((!(comm?.step || comm.commentStep)?.isRequestModule &&
                        (comm?.step || comm.commentStep)?.module_id ==
                          currentModule.id &&
                        (comm?.step || comm.commentStep)?.stepId ==
                          currentModule.record.CurrentStep.id) ||
                        ((comm?.step || comm.commentStep)?.isRequestModule &&
                          (comm?.step || comm.commentStep)?.stepId ==
                            currentModule.record.CurrentStep.id))
                  ) != undefined
                // ||
                // mainObject?.summery?.summery &&
                // mainObject?.summery?.summery[commentKey] == undefined
              )
              ?.reduce(
                (groups, itemKey) => ({
                  ...groups,
                  [mainObject.comments[itemKey][0]?.commentStep?.stepId]: [
                    ...(groups[
                      mainObject.comments[itemKey][0]?.commentStep?.stepId
                    ] || []),
                    mainObject.comments[itemKey],
                  ],
                }),
                {}
              )
          ).length == 1 &&
          currentModule.record.is_returned
        ) {
          window.notifySystem("error", "برجاء مراجعة التعليقات في الملخص");
          return resolve(false);
        } else if (
          currentModule.record.is_returned &&
          Object.values(mainObject?.comments || {})?.filter(
            (com) =>
              (com != undefined &&
                Array.isArray(com) &&
                com.find(
                  (comment) =>
                    !isEmpty(comment.comment) &&
                    comment?.checked == true &&
                    isEmpty(comment.reply_text) &&
                    ((!(comment?.step || comment.commentStep)
                      ?.isRequestModule &&
                      (comment?.step || comment.commentStep)?.module_id ==
                        currentModule.id &&
                      (comment?.step || comment.commentStep)?.stepId ==
                        currentModule.record.CurrentStep.id) ||
                      ((comment?.step || comment.commentStep)
                        ?.isRequestModule &&
                        (comment?.step || comment.commentStep)?.stepId ==
                          currentModule.record.CurrentStep.id))
                ) != undefined) ||
              (!Array.isArray(com) &&
                !isEmpty(com.comment) &&
                com?.checked == true &&
                isEmpty(com.reply_text) &&
                ((!(com?.step || com.commentStep)?.isRequestModule &&
                  (com?.step || com.commentStep)?.module_id ==
                    currentModule.id &&
                  (com?.step || com.commentStep)?.stepId ==
                    currentModule.record.CurrentStep.id) ||
                  ((com?.step || com.commentStep)?.isRequestModule &&
                    (com?.step || com.commentStep)?.stepId ==
                      currentModule.record.CurrentStep.id)))
          )?.length
        ) {
          window.notifySystem("error", "من فضلك ادخل الرد على التعليقات");
          return resolve(false);
        }
      }
    } else if (
      get(currentModule, "record.CurrentStep.is_edit") == 1 &&
      ["RETURN"].indexOf(actionName.toUpperCase()) != -1
    ) {
      if (
        !mainObject?.summery?.summery ||
        (mainObject?.summery?.summery &&
          Object.keys(mainObject?.summery?.summery)?.length == 0)
      ) {
        window.notifySystem(
          "error",
          "لا يمكن اعادة توجيه المعاملة دون إضافة تعليق واحد على الأقل"
        );
        return resolve(false);
      }
    }
    // else if (["RETURN"].indexOf(actionName.toUpperCase()) != -1) {
    //   if (
    //     //!mainObject?.comments ||
    //     mainObject?.comments &&
    //     (mainObject?.comments?.length == 0 ||
    //       Object.keys(mainObject?.comments).filter(
    //         (commentKey) =>
    //           mainObject?.comments[commentKey]?.length > 0 &&
    //           mainObject?.comments[commentKey].find(
    //             (comment) => !comment.checked
    //           ) != undefined
    //       )?.length == 0)
    //   ) {
    //     window.notifySystem(
    //       "error",
    //       "لا يمكن اعادة توجيه المعاملة دون إضافة تعليق واحد على الأقل!"
    //     );
    //     return resolve(false);
    //   }
    // }

    //if (mainObject?.summery?.summery) {
    let groupedSummery = Object.values(mainObject?.summery?.summery || {})
      ?.filter(
        (comment) =>
          (!Array.isArray(comment) &&
            comment?.step != undefined &&
            comment?.comments != undefined &&
            comment?.comments != "" &&
            comment?.checked == false) ||
          (Array.isArray(comment) &&
            comment.filter(
              (subComment) =>
                subComment?.step != undefined &&
                subComment?.comments != undefined &&
                subComment?.comments != "" &&
                subComment?.checked == false
            ).length > 0)
      )
      ?.reduce((groups, item) => {
        return {
          ...groups,
          [((!Array.isArray(item) && item) || item[0])?.step?.stepId]: [
            ...(groups[
              ((!Array.isArray(item) && item) || item[0])?.step?.stepId
            ] || []),
            ...((!Array.isArray(item) && [item]) || item),
          ],
        };
      }, {});

    if (groupedSummery && Object.keys(groupedSummery)?.length > 1) {
      window.notifySystem(
        "error",
        "لا يمكن ادخال تعليقات لأكثر من خطوة في الملخص"
      );
      return resolve(false);
    } else {
      //
      if (
        Object.keys(groupedSummery).length == 1 &&
        groupedSummery[reAssign] == undefined
      ) {
        window.notifySystem(
          "error",
          "عذرا لا يمكن عمل اعادة توجيه يجب ادخال التعليقات فى احدي تابات الخطوة المعاد التوجيه اليها"
        );
        return resolve(false);
      }
    }
    //}

    return resolve(true);
  });
};

const setImportedMainObjectAsBoolean = (
  mainObject,
  imported_mainObject,
  record
) => {
  if ([1, 14].indexOf(record.app_id) != -1) {
    if (imported_mainObject && typeof imported_mainObject == "object") {
      mainObject.landData = {
        ...extractImportantData(imported_mainObject).landData,
        imported_suggestImage:
          imported_mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels?.find(
            (r) => r?.approved_Image != undefined
          )?.approved_Image ||
          imported_mainObject?.data_msa7y?.msa7yData?.screenshotURL,
      };

      if (
        mainObject.update_contract_submission_data
          ?.update_contract_submission_data.imported_mainObject
      ) {
        mainObject.update_contract_submission_data.update_contract_submission_data.imported_mainObject = true;
      }

      if (mainObject.tadkek_data_Msa7y?.tadkek_msa7yData.imported_mainObject) {
        mainObject.tadkek_data_Msa7y.tadkek_msa7yData.imported_mainObject = true;
      }
    }
  }
};

export const doSendReqAction = async (props, json_data, reAssign, vals) => {
  let {
    mainObject,
    t,
    history,

    actionVals: { id, steps, users, name, step_action_id },
    currentUser,
    currentModule: { record, draft },
  } = props;

  let imported_mainObject = checkImportedMainObject(props);
  let mapInfo = await getInfo();
  let Landbase_Parcel_layer = mapInfo.Landbase_Parcel;
  let LayerDomains = await getFieldDomain("", Landbase_Parcel_layer);

  let timeNow = new Date().toLocaleString().split(",")[1];
  if (
    get(json_data, "remark.comment.comment", false) ||
    get(json_data, "remark.comment.check_plan_approval", false)
    // get(json_data, "remark.comment.attachments", false)
  ) {
    json_data = {
      ...json_data,
      // printCreate: [
      //   ...json_data?.printCreate,
      //   {
      //     user: json_data.remark.user,
      //     date: moment().format("iD/iMM/iYYYY") + timeNow,
      //   },
      // ],
      remark: {},
      remarks: [
        ...get(json_data, "remarks", []),
        {
          ...json_data.remark.comment,
          step: record.CurrentStep,
          user: json_data.remark.user,
          date: moment().format("iD/iMM/iYYYY") + timeNow,
        },
      ],
    };
  }
  const list_owners = get(json_data, "ownerData.ownerData.owners");
  if (list_owners) {
    json_data.owners_data = { owners: toArray(list_owners) };
  }
  const url = "/TakeActions/";
  const addedParams =
    reAssign && !reAssign?.target
      ? steps
        ? { step_id: reAssign }
        : users
        ? isArray(reAssign)
          ? { submission_actor: reAssign.map((v) => ({ user_id: v })) }
          : { user_id: reAssign }
        : reAssign
      : null;

  var data =
    mainObject?.landData ||
    imported_mainObject?.landData ||
    mainObject?.LandWithCoordinate;

  const firstSubmission =
    get(record.CurrentStep, "is_create", false) || draft
      ? {
          plan_status: plans_status.Running,
          eng_company_id: get(
            mainObject,
            "basic_data.basic_data.eng_company_id",
            null
          ),
          ...omit({ ...get(mainObject, "ownerData.ownerData", {}) }, [
            "nationalIdImage",
            "companyImage",
          ]),
          ...pick({ ...get(data, "landData", {}) }, [
            "district_id",
            "land_number",
            "land_usage",
            "municipality_id",
            "plan_area",
            "plan_number",
            "urban_boundaries_id",
          ]),
        }
      : null;

  const plan_status =
    !firstSubmission && !steps && record.CurrentStep.name == "الإعتماد الأولي"
      ? plans_status.FirstApproval
      : plans_status.Running;
  let submission = !draft && record.id ? omitBy(record, isNull) : {};
  if (!reAssign) {
    const saved_data = eval(
      "(" + (record.CurrentStep.saved_data || "[]") + ")"
    );
    saved_data.map((d) => {
      const fun = get(preActions, d);
      submission =
        (fun && typeof fun == "function" && fun(mainObject, submission)) ||
        submission;
    });
  }

  if (
    reAssign &&
    steps &&
    get(record.CurrentStep, "name", "") == "الإعتماد النهائي"
  ) {
    json_data = omit({ ...json_data }, ["finalApproval"]);
  }

  submission.submission_lands_contracts =
    data?.landData?.lands?.parcels.length &&
    (
      (data?.landData?.lands?.parcels[0].attributes &&
        (await getFeatureDomainName(
          data?.landData?.lands?.parcels,
          mapInfo.Subdivision
        ))) ||
      data?.landData?.lands?.parcels.reduce((a, b) => {
        if (b.selectedLands.length) {
          a = (a.length && [...a, ...b.selectedLands]) || [...b.selectedLands];
        } else {
          a = (a.length && [
            ...a,
            {
              attributes: {
                PLAN_NO: b.planeval?.name || null,
                PARCEL_BLOCK_NO: b.blockval?.name || null,
                SUBDIVISION_DESCRIPTION: b.subnNameval?.name || null,
                SUBDIVISION_TYPE: b.subTypeval?.name || null,
                PARCEL_Subdivision_DESC: b.subnNameval?.name || null,
                PARCEL_Subdivision_TYPE: b.subTypeval?.code || null,
                SUBDIVISION_TYPE_Code: b.subTypeval?.code || null,
                MUNICIPALITY_NAME_Code: b.munval?.code || null,
                PARCEL_PLAN_NO: b.planeval?.name || null,
                PARCEL_AREA: 0,
              },
            },
          ]) || [
            {
              attributes: {
                PLAN_NO: b.planeval?.name || null,
                PARCEL_BLOCK_NO: b.blockval?.name || null,
                SUBDIVISION_DESCRIPTION: b.subnNameval?.name || null,
                SUBDIVISION_TYPE: b.subTypeval?.name || null,
                PARCEL_Subdivision_DESC: b.subnNameval?.name || null,
                PARCEL_Subdivision_TYPE: b.subTypeval?.code || null,
                SUBDIVISION_TYPE_Code: b.subTypeval?.code || null,
                MUNICIPALITY_NAME_Code: b.munval?.code || null,
                PARCEL_PLAN_NO: b.planeval?.name || null,
                PARCEL_AREA: 0,
              },
            },
          ];
        }

        return a;
      }, [])
    ).map((parcel) => {
      map_subM(parcel);
      parcel.attributes.PARCEL_AREA = convertToEnglish(
        parcel.attributes.PARCEL_AREA
      );
      return {
        PARCEL_PLAN_NO: parcel.attributes.PARCEL_PLAN_NO,
        PARCEL_BLOCK_NO: parcel.attributes.PARCEL_BLOCK_NO,
        SUBDIVISION_DESCRIPTION: parcel.attributes.SUBDIVISION_DESCRIPTION,
        SUBDIVISION_TYPE: parcel.attributes.SUBDIVISION_TYPE_Code,
        PARCEL_Subdivision_DESC: parcel.attributes.SUBDIVISION_DESCRIPTION,
        PARCEL_Subdivision_TYPE: parcel.attributes.SUBDIVISION_TYPE_Code,
        PARCEL_SPATIAL_ID: parcel.attributes.PARCEL_SPATIAL_ID,
        PARCEL_BLOCK_NO: parcel.attributes.PARCEL_BLOCK_NO,

        PLAN_NO: parcel.attributes.PLAN_NO,
        USING_SYMBOL: parcel.attributes.USING_SYMBOL,
        area:
          (isNaN(parcel.attributes.PARCEL_AREA) &&
            +parcel.attributes.PARCEL_AREA.match(
              /-?(?:\d+(?:\.\d*)?|\.\d+)/
            )[0]) ||
          +parcel.attributes.PARCEL_AREA,
        contract: [],
        municipilty_code:
          parcel.attributes.MUNICIPALITY_NAME_Code ||
          parcel.attributes.MUNICIPALITY_NAME?.code ||
          parcel.attributes.MUNICIPALITY_NAME ||
          data?.landData.municipilty_code ||
          data?.landData.municipality?.code ||
          data?.landData.lands?.temp?.mun,
        subMunicipilty_code:
          parcel.attributes.SUB_MUNICIPALITY_NAME_Code ||
          parcel.attributes.SUB_MUNICIPALITY_NAME?.Submun_code ||
          parcel.attributes.SUB_MUNICIPALITY_NAME,
      };
    });
  if (!submission.without_export_no) {
    if (
      props?.record?.app_id == 14 &&
      props?.record?.CurrentStep?.module_id == 19
    ) {
      submission.issuer_export_id =
        mainObject?.signatures?.signatures?.issuer_id;
    } else {
      submission.issuer_export_id =
        mainObject?.waseka?.waseka?.table_waseka?.[0]?.contract?.issuers?.id ||
        mainObject?.waseka?.waseka?.table_waseka?.[0]?.issuer_id;
    }
  }

  // if (
  //   mainObject?.waseka?.waseka?.table_waseka?.[0]?.contract?.issuers?.id &&
  //   !submission.without_export_no
  // ) {
  //   submission.issuer_export_id =
  //     mainObject?.waseka?.waseka?.table_waseka?.[0]?.contract?.issuers?.id;
  // }
  json_data.Supporting = window.Supporting || {};
  if ([97, 98, 99].indexOf(props?.record?.CurrentStep?.module_id) != -1) {
    let mod_id = props?.record?.CurrentStep?.module_id;
    let objectName =
      (mod_id == 97 && "efada_lands_statements") ||
      (mod_id == 98 && "efada_plan_statements") ||
      (mod_id == 99 && "efada_municipality_statements");
    let flagField =
      (mod_id == 97 && "efada_melkia_aradi") ||
      (mod_id == 98 && "efada__suggested_activity") ||
      (mod_id == 99 && "efada__invest_activity");
    if (props.mainObject[objectName]) {
      const {
        mainObject: {
          [objectName]: {
            [objectName]: { notes },
          },
        },
        wizardSettings: {
          steps: {
            [objectName]: {
              sections: {
                [objectName]: {
                  fields: {
                    [flagField]: { options },
                  },
                },
              },
            },
          },
        },
      } = props;

      if (notes) {
        if (json_data?.[objectName]?.[objectName]?.efadat?.length) {
          json_data[objectName][objectName].efadat = [
            ...json_data[objectName][objectName].efadat,
            {
              notes: notes,
              option: Object.values(options).find(
                (r) =>
                  r.value ==
                  (json_data?.[objectName]?.[objectName]?.[flagField] || 1)
              )?.label,
            },
          ];
        } else {
          json_data[objectName][objectName].efadat = [
            {
              notes: notes,
              option: Object.values(options).find(
                (r) =>
                  r.value ==
                  (json_data?.[objectName]?.[objectName]?.[flagField] || 1)
              )?.label,
            },
          ];
        }
      }
    }
  } else if (
    [107].indexOf(props?.record?.CurrentStep?.module_id) != -1 &&
    (name.includes("RETURN") || name.includes("SUBMIT"))
  ) {
    let objectName = "afada_adle_statements";
    let flagField = "efada_status";
    const {
      mainObject: {
        [objectName]: {
          [objectName]: {
            letter_number,
            sak_efada,
            image_efada,
            letter_date,
            efada_text,
          },
        },
      },
      wizardSettings: {
        steps: {
          [objectName]: {
            sections: {
              [objectName]: {
                fields: {
                  [flagField]: { options },
                },
              },
            },
          },
        },
      },
    } = props;

    if (efada_text) {
      if (json_data?.[objectName]?.[objectName]?.table_afada?.length) {
        json_data[objectName][objectName].table_afada = [
          ...json_data[objectName][objectName].table_afada,
          {
            letter_number,
            sak_efada,
            image_efada,
            letter_date,
            efada_text,
            efada_status: Object.values(options).find(
              (r) =>
                r.value ==
                (json_data?.[objectName]?.[objectName]?.[flagField] || 1)
            )?.label,
          },
        ];
      } else {
        json_data[objectName][objectName].table_afada = [
          {
            letter_number,
            sak_efada,
            image_efada,
            letter_date,
            efada_text,
            efada_status: Object.values(options).find(
              (r) =>
                r.value ==
                (json_data?.[objectName]?.[objectName]?.[flagField] || 1)
            )?.label,
          },
        ];
      }
    }
  } else if ([105].indexOf(props?.record?.CurrentStep?.module_id) != -1) {
    json_data.emission_sak_user = {
      name: props?.user.name,
      emUser: copyUser(props),
    };
  } else if ([73].indexOf(props?.record?.CurrentStep?.module_id) != -1) {
    json_data.fees_exporter = {
      name: props?.user.name,
      exporterUser: copyUser(props),
    };
  }

  if ([42, 20, 28].indexOf(props?.record?.CurrentStep?.module_id) != -1) {
    json_data.engUserNameToPrint = {
      engUserName: props?.user.name,
      engUser: copyUser(props),
    };
  } else if ([96].indexOf(props?.record?.CurrentStep?.module_id) != -1) {
    json_data.invest_emp_name = {
      name: props?.user.name,
      investEmpUser: copyUser(props),
    };
  } else if ([130].indexOf(props?.record?.CurrentStep?.module_id) != -1) {
    json_data.propertyRemovalUserNameToPrint = {
      propertyRemovalUserName: props?.user.name,
      propertyRemovalUser: copyUser(props),
    };
  } else if ([103].indexOf(props?.record?.CurrentStep?.module_id) != -1) {
    json_data.allotmentUserNameToPrint = {
      allotmentUserName: props?.user.name,
      allotmentUser: copyUser(props),
    };
  } else if ([3021].indexOf(props?.record?.CurrentStep?.id) != -1) {
    json_data.municipilty_manager_name = {
      name: props?.user.name,
      munManagerUser: copyUser(props),
    };
  } else if (
    [2903, 3133].indexOf(props?.record?.CurrentStep?.id) != -1 ||
    [137, 139].indexOf(props?.record?.CurrentStep?.module_id) != -1
  ) {
    json_data.survey_manager_user = {
      name: props?.user.name,
      survManagerUser: copyUser(props),
    };
  } else if (
    [2902, 3132].indexOf(props?.record?.CurrentStep?.id) != -1 ||
    [136, 121].indexOf(props?.record?.CurrentStep?.module_id) != -1
  ) {
    json_data.survey_user = {
      name: props?.user.name,
      survUser: copyUser(props),
    };
  } else if ([138].indexOf(props?.record?.CurrentStep?.module_id) != -1) {
    json_data.munplan_manager_user = {
      name: props?.user.name,
      munPlanSurvUser: copyUser(props),
    };
  } else if ([140].indexOf(props?.record?.CurrentStep?.module_id) != -1) {
    json_data.engplan_user = {
      name: props?.user.name,
      engPlanUser: copyUser(props),
    };
  } else if ([141].indexOf(props?.record?.CurrentStep?.module_id) != -1) {
    json_data.plan_manager_user = {
      name: props?.user.name,
      planManagerUser: copyUser(props),
    };
  }

  if (
    json_data.mun_remark &&
    (json_data.currentStepId == 1848 || json_data.currentStepId == 1849)
  ) {
    json_data.mun_remark.step_id = json_data.currentStepId;
  }

  let signature_type = "";

  if ([2768, 3105].indexOf(record?.CurrentStep.id) != -1) {
    signature_type = "lagna_signatures";
  } else if ([2900, 3125, 2922].indexOf(record?.CurrentStep.id) != -1) {
    signature_type = "main_signatures";
  }

  setPrintSignatures(record, json_data, signature_type);

  const owners =
    (_.toArray(_.get(mainObject, "ownerData.ownerData.owners", {})).length &&
      toArray(get(mainObject, "ownerData.ownerData.owners", {}))) ||
    (get(mainObject, "destinationData.destinationData.entity", null) && [
      get(mainObject, "destinationData.destinationData.entity", {}),
    ]);

  let isMobileValid = true;
  owners?.map((r) => {
    let mobile = r?.mobile?.replace("966", "");
    if (!mobile?.startsWith("5") && isMobileValid) {
      isMobileValid = false;
    }
  });

  if (
    !isMobileValid &&
    (record?.CurrentStep.is_create == 1 ||
      record?.CurrentStep.is_create == true ||
      draft) &&
    !mainObject.destinationData
  ) {
    window.notifySystem(
      "error",
      convertToArabic("لا بد أن يبدأ رقم الجوال بالرقم 5")
    );
    return;
  }

  console.log("mainaa", mainObject);
  if (
    submission.CreatorUser
    // &&
    // record?.CurrentStep.is_create != 1 &&
    // record?.CurrentStep.is_create != true
  ) {
    delete submission.CreatorUser;
    delete submission.users;
  }

  const params = {
    step_action_id: step_action_id,
    //CurrentStep: record.CurrentStep,
    ...submission,
    plan_status,
    newMainObject: true,
    ...firstSubmission,
    owners: owners,
    get owner_name() {
      return get(owners, "[0].name", "")?.replaceAll("\t", "");
    },
    ...addedParams,
    action_id: id,
    workflow_id: record.workflow_id,
    workflows: record.workflows,
    app_id: record.app_id,
    temp_json: {},
    dateSend: moment().format("iYYYY-iMM-iD"),
    fees: !record.fees
      ? mainObject["ma7dar"] && mainObject["ma7dar"]["ma7dar_mola5s"]
        ? mainObject["ma7dar"]["ma7dar_mola5s"]["declaration"]
            .replace("ريال", "")
            .trim()
        : mainObject["fees"] &&
          mainObject["fees"]["feesInfo"] &&
          mainObject["fees"]["feesInfo"]["feesValue"]
        ? typeof mainObject["fees"]["feesInfo"]["feesValue"] == "string"
          ? (!record?.submission_invoices?.length
              ? +mainObject["fees"]["feesInfo"]["feesValue"].match(/(\d+)/)?.[0]
              : 0) +
            +mainObject["fees"]["feesInfo"]["feesValue"].match(/(\d+)/)?.[0] *
              ((+mainObject["fees"]["feesInfo"]["increasePercentage"] || 0) /
                100)
          : (!record?.submission_invoices?.length
              ? mainObject["fees"]["feesInfo"]["feesValue"]
              : 0) +
            mainObject["fees"]["feesInfo"]["feesValue"] *
              ((+mainObject["fees"]["feesInfo"]["increasePercentage"] || 0) /
                100)
        : null
      : record.fees,
    newinvoice: !record?.submission_invoices?.length
      ? true
      : (mainObject["fees"] &&
          mainObject["fees"]["feesInfo"] &&
          !mainObject["fees"]["feesInfo"]["increasePercentage"]) ||
        (mainObject["fees"] &&
          mainObject["fees"]["feesInfo"] &&
          +mainObject["fees"]["feesInfo"]["increasePercentage"] == 0)
      ? false
      : true,
    invoice_description: get(mainObject, "fees.feesInfo.description", ""),
    json_data,
    issuername:
      json_data?.waseka?.waseka.table_waseka?.[0]?.waseka_search ||
      json_data?.sakData?.sakData?.issuer,
  };

  if (record.app_id == 16) {
    params.cutAreaPercentage = json_data.cutAreaPercentage;
  }

  if ([1, 14].indexOf(record.app_id) != -1) {
    params.realestate_object = await checkRealEstateObject(
      selectMainObject(props),
      mainObject,
      record
    );
    console.log("real state object:", params.realestate_object);

    let survey_check_request_no = checkRequestNoOfImportedMainObject(props);
    if (survey_check_request_no) {
      params.survey_check_request_no = survey_check_request_no;
    }

    setImportedMainObjectAsBoolean(
      params.json_data,
      imported_mainObject,
      record
    );
  }
  //
  // return;
  json_data.currentDate = moment().format("iYYYY-iMM-iDD") + timeNow;

  if ([1, 14].indexOf(record.app_id) != -1) {
    let deedsNumbers = json_data?.waseka?.waseka?.table_waseka
      ?.filter((r) => !_.isNaN(+r?.number_waseka))
      ?.reduce((a, b) => {
        if (!a.filter((r) => r == b.number_waseka).length) {
          a.push(b.number_waseka);
        }
        return a;
      }, [])
      ?.map((r) => +r);

    params.momrahDeedRequest = {
      requestTypeId: +(
        (record.app_id == 14 &&
          json_data?.update_contract_submission_data
            ?.update_contract_submission_data?.sakType == "1" &&
          "1") ||
        (record.app_id == 14 &&
          json_data?.update_contract_submission_data
            ?.update_contract_submission_data?.sakType == "3" &&
          "4") ||
        (record.app_id == 14 &&
          json_data?.update_contract_submission_data
            ?.update_contract_submission_data?.sakType == "4" &&
          "0") ||
        (record.app_id == 1 &&
          json_data?.tadkek_data_Msa7y?.tadkek_msa7yData?.requestType == 1 &&
          "1") ||
        (record.app_id == 1 &&
          json_data?.tadkek_data_Msa7y?.tadkek_msa7yData?.requestType == 2 &&
          "3")
      ),
      deedsNumbers:
        (record.app_id == 14 &&
          json_data?.waseka?.waseka?.table_waseka?.[0]?.number_waseka.indexOf(
            "/"
          ) == -1 && [
            +json_data?.waseka?.waseka?.table_waseka?.[0]?.number_waseka,
          ]) ||
        (record.app_id == 1 && deedsNumbers.length && deedsNumbers) ||
        null,
    };

    params.json_data.momrahDeedRequest = params?.momrahDeedRequest;
  }
  //
  //
  // return;

  console.log(params);
  if (
    get(record.CurrentStep, "name", "") == "الإعتماد الأولي" &&
    name.includes("SUBMIT")
  ) {
    if (!json_data.studies || keys(json_data.studies).length < 2) {
      window.notifySystem("error", t("Studies are not filled yet"));
    } else if (keys(json_data.studies).length < 4) {
      const all_studies = [
        "hydraulics_studies",
        "soil_testing",
        "traffic_studies",
      ];
      const not_entered = xor(keys(json_data.studies), all_studies).filter(
        (v) => v != "user"
      );

      const message =
        t("These studies are not filled yet ") +
        not_entered.map((v) => ` ${t(v)} `);

      window.notifySystem("error", message);
    }
  }
  //

  params.json_data = window.lzString.compressToBase64(
    JSON.stringify({ ...params.json_data })
  );

  // return;
  if (
    [1, 11].indexOf(props.currentModule.id) != -1 &&
    (name.includes("SUBMIT") ||
      name.includes("REJECT") ||
      name.includes("FINISH") ||
      name.includes("STOP"))
  ) {
    //if (!window.noGIS) {

    queryTask({
      url: window.mapUrl + "/" + mapInfo.Landbase_Parcel,
      where: data?.landData?.lands?.parcels
        .map((r) => `PARCEL_SPATIAL_ID = ${r.attributes.PARCEL_SPATIAL_ID}`)
        .join(" or "),
      outFields: ["OBJECTID"],
      returnGeometry: false,
      callbackResult: ({ features }) => {
        //return;
        if (features.length > 0) {
          applyEditsByParams(
            "Landbase_Parcel",
            "updateFeatures",
            _.chain(features)
              .map((d) => {
                return d.attributes.OBJECTID;
              })
              .value()
              .map((objectId) => {
                return {
                  attributes: {
                    OBJECTID: objectId,
                    IS_EDITED: name.includes("SUBMIT") ? 1 : 0,
                  },
                };
              })
          ).then(
            (d) => {
              postItem(url, { ...params }).then(
                (data) => {
                  window.notifySystem(
                    "success",
                    t(`Successfully ${name} request with number `) +
                      ` ${convertToArabic(data.request_no)}`,
                    4
                  );

                  goToInboxScreen(history);
                },
                (err, head) => {
                  handleErrorMessages(err, t);
                }
              );
            },
            (data) => {
              window.notifySystem(
                "error",
                t("global.UPDATINGfEATURESFAILED"),
                4
              );
            }
          );
        }
      },
      callbackError(error) {},
    });

    // } else {
    //   postItem(url, { ...params }).then(
    //     (data) => {
    //       window.notifySystem(
    //         "success",
    //         t(`Successfully ${name} request with number `) +
    //           ` ${convertToArabic(data.request_no)}`,
    //         4
    //       );

    //       goToInboxScreen(history);
    //     },
    //     (err, head) => {
    //       handleErrorMessages(err, t);
    //     }
    //   );
    // }
  } else {
    //finish step and check splitandmerge app
    if (id == 8 && window.finishSplitMergeParcels && name.includes("FINISH")) {
      window
        .finishSplitMergeParcels()
        .then((data) => {
          makeAction(url, params, name, history, t);
        })
        .catch((error) => {
          window.notifySystem("error", "حدث خطأ أثناء تحديث خريطة الأساس", 4);
        });
    }
    // else if (id == 8 && window.finishSubmittedPlans && name.includes("FINISH")) {
    //   window
    //     .finishSubmittedPlans()
    //     .then((data) => {
    //       //makeAction(url, params, name, history, t);
    //     })
    //     .catch((error) => {
    //       window.notifySystem("error", "حدث خطأ أثناء تحديث خريطة الأساس", 4);
    //     });
    // }
    else {
      if (record?.CurrentStep?.module_id == 47 && record.app_id == 16) {
        addPlanFeatures_FeatureServer(
          mainObject,
          record,
          props,
          window.mapUrl
        ).then((res) => {
          makeAction(url, params, name, history, t);
        });
      } else {
        makeAction(url, params, name, history, t);
      }
    }
  }
};
// let currentDate =
export const sendRequest = (props, json_data, reAssign, vals) => {
  const { mainObject, setStep, actionName, currentModule } = props;
  checkFormsValidaity(props).then((isFormsValidated) => {
    if (isFormsValidated) {
      if (
        currentModule?.record?.is_returned ||
        get(currentModule, "record.CurrentStep.is_edit") == 1
      ) {
        checkComments(props, reAssign).then(
          (commentsState) => {
            if (commentsState) {
              if (
                currentModule.record.app_id == 16 &&
                !json_data.cutAreaPercentage
              ) {
                setPlanDefaults(json_data).then((response) => {
                  doSendReqAction(props, response, reAssign, vals);
                });
              } else {
                doSendReqAction(props, json_data, reAssign, vals);
              }
            }
          },
          (error) => {
            window.notifySystem("error", "برجاءا مراجعة التعليقات في الملخص");
          }
        );
      } else {
        if (currentModule.record.app_id == 16 && !json_data.cutAreaPercentage) {
          setPlanDefaults(json_data).then((response) => {
            doSendReqAction(props, response, reAssign, vals);
          });
        } else {
          doSendReqAction(props, json_data, reAssign, vals);
        }
      }
    }
  });
};

export const goToInboxScreen = (history) => {
  let appname = localStorage["appname"].split(".");
  appname = appname[1] || localStorage["appname"];

  history(
    "/submissions/" + appname.toLowerCase() + "?tk=" + localStorage["token"]
  );
};
export const makeAction = (url, params, name, history, t) => {
  postItem(url, { ...params }).then(
    (data) => {
      window.notifySystem(
        "success",
        t(`Successfully ${name} request with number `) +
          ` ${convertToArabic(data.request_no)}`,
        4
      );

      goToInboxScreen(history);
    },
    (err, head) => {
      handleErrorMessages(err, t);
    }
  );
};

export const isVarifty = (props, values, reAssign, vals) => {
  const {
    actionVals: { is_varify },
    mainObject,
    currentStep,
    user,
    // comments = {},
    setModal,
  } = props;
  let comments = props.mainObject.comments;
  let json_data = mainObject || {};

  const summeryComments = get(
    values,
    "summery",
    get(mainObject, "summery.summery", {})
  );
  //
  console.log("c", values);
  if (!isEmpty(summeryComments)) {
    let currentUser = copyUser({ user });
    //making comments an object of stepNames array that contains 1.the comment and 2.the user who wrote it
    //NOTE: there is no submit values from summery other than comments so far
    let newComments = comments || summeryComments;

    map(summeryComments, (v, k) => {
      // map(value , (v, k) => {
      if (v.step && !v.step.stepId) {
        v.step.stepId = reAssign;
        //
      }
      if (!Array.isArray(v)) {
        if (v.comments) {
          let comment = {
            ...v,
            comment: v.comments,
            user: currentUser,
            currentDate: moment().format("iYYYY-iMM-iDD"),
            checked: get(v, "checked", false),
            commentStep: get(v, "step", false) || "",
          };
          delete comment.comments;
          summeryComments[k] = {
            ...comment,
          };
        }
      } else {
        v.forEach((c, index) => {
          if (c.step && !c.step.stepId) {
            c.step.stepId = reAssign;
          }
          if (!Array.isArray(c)) {
            if (c.comments) {
              let comment = {
                ...c,
                comment: c.comments,
                user: currentUser,
                currentDate: moment().format("iYYYY-iMM-iDD"),
                checked: get(c, "checked", false),
                commentStep: get(c, "step", false) || "",
              };
              delete comment.comments;
              summeryComments[k][index] = {
                ...comment,
              };
            }
          }
        });
      }

      if (!json_data.comments) {
        json_data.comments = {};
      }

      if (json_data.comments[k]) {
        json_data.comments[k] = (
          (Array.isArray(summeryComments[k]) && summeryComments[k]) || [
            summeryComments[k],
          ]
        )?.concat(
          (Array.isArray(json_data.comments[k]) && json_data.comments[k]) || [
            json_data.comments[k],
          ]
        );
      } else {
        json_data.comments[k] = (Array.isArray(summeryComments[k]) &&
          summeryComments[k]) || [summeryComments[k]];
      }
    });
  } else if (!isEmpty(comments)) {
    json_data.comments = comments;
  }

  //adding the last step vals cause it might not be added in the store yet
  if (values && !isEqual(currentStep, "summery")) {
    json_data[currentStep] = values;
    json_data[currentStep].user = user;
  }

  // if(currentStep.includes("Notes") && values) {
  //     let newNotes = allNotes
  //     newNotes[currentStep] = newNotes[currentStep] || []
  //     let found = get(newNotes[currentStep], `${newNotes[currentStep].length-1}`,{}) || {}
  //     values[`notes${id}`] &&
  //     (found.notes != get(values, `notes${id}.notes`,'')) ?
  //     newNotes[currentStep] = concat(newNotes[currentStep], get(values, `notes${id}`, [])) : null
  //     setAllNotes(newNotes)
  //     json_data.allNotes = newNotes;
  // } else if (!isEmpty(allNotes)) {
  //     json_data.allNotes = allNotes;
  // }

  json_data = omit(json_data, ["summery"]);
  console.log(json_data);
  is_varify && is_varify == 1
    ? setModal({
        title: "Is verify",
        name: "verifySubmission",
        type: "confirmation",
        content: "Are you sure?",
        submit: () => {
          sendRequest(props, json_data, reAssign, vals);
        },
      })
    : sendRequest(props, json_data, reAssign, vals);
};

export const sendAlert = (id, t) => {
  const url = "/Submission/SetWarning";
  const params = {
    sub_id: id,
    set: true,
  };
  postItem(url, null, { params })
    .then(() => window.notifySystem("success", t("Successfully sent")))
    .catch(() => window.notifySystem("error", t("global.INTERNALSERVERERROR")));
};

export const sign = (id, stepId, t, history) => {
  const url = `/submission/${id}/sign/${stepId}`;

  postItem(url, null)
    .then(() => {
      window.notifySystem("success", t("Successfully approved"));
      history.goBack();
    })
    .catch(() => window.notifySystem("error", t("global.INTERNALSERVERERROR")));
};

export const sendEdits = (id, mainObject, t, messageAfterSave = true) => {
  const url = "/Submission/SaveEdit";
  const params = { sub_id: id };

  delete mainObject.temp;

  return postItem(
    url,
    {
      mainObject:
        (typeof mainObject == "string" && mainObject) ||
        window.lzString.compressToBase64(JSON.stringify({ ...mainObject })),
      tempFile: {},
    },
    { params }
  )
    .then(() => {
      if (messageAfterSave) {
        window.notifySystem(
          "success",
          t ? t("messages:Successfully saved") : "تم الحفظ بنجاح"
        );
      }
    })
    .catch(() => {
      if (messageAfterSave) {
        window.notifySystem(
          "error",
          t ? t("messages:failed to save") : "لم يتم الحفظ"
        );
      }
    });
};
export const continueSub = (id, t, history) => {
  const url = `/Submission/Continue`;
  const params = { sub_id: id };

  postItem(url, null, { params })
    .then(() => {
      window.notifySystem("success", t("Successfully sent"));
      history.goBack();
    })
    .catch(() => window.notifySystem("error", t("failed to send")));
};

export const sendMessage = (props, values, t) => {
  const {
    currentModule: { record },
  } = props;

  const url = "/SendSms";
  const params = {
    ...mapValues(values, (val) => (val == true ? 1 : val)),
    Submission_id: record.id,
    MobileNo: [],
  };

  postItem(url, { ...params })
    .then((data) => window.notifySystem("success", t(data)))
    .catch(() => window.notifySystem("error", t("failed to send")));
};

export const getSubmission = (props, stepValues) => {
  const {
    steps,
    currentStep,
    user,
    setCurrentStep,
    setMainObjectNoPath,
    setMainObject,
  } = props;
  let currentUser = user;
  const url = `/Submission/GetSubmissionMainObject`;

  fetchData(url, {
    params: { request_no: get(stepValues, "firstData.request_no") },
  })
    .then((data) => {
      data =
        (typeof data == "string" &&
          JSON.parse(window.lzString.decompressFromBase64(data))) ||
        data;
      setMainObjectNoPath(omit({ ...data }, ["comments"]));
      setMainObject(stepValues, currentStep, currentUser);
      setCurrentStep(get(steps, steps.indexOf(currentStep) + 1));
    })
    .catch((e) => {
      setCurrentStep(get(steps, steps.indexOf(currentStep) + 1));
    });
};
