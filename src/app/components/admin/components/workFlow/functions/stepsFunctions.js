import { stepFields } from "./stepFields";
import { sendSMSFields } from "./SMSFields";
import {
  get,
  assign,
  isEmpty,
  max,
  map,
  omitBy,
  isNull,
  isEqual,
  filter,
  has,
  mapValues,
  find,
  includes,
  keys,
} from "lodash";
import { workFlowUrl } from "configFiles/config";
import { updateItem, postItem } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
const stepsUrl = "/steps";

export function arrangeSteps() {
  const { allSteps, t } = this.props;

  allSteps
    ? updateItem("/steps/updatewfsteps", allSteps)
        .then(() =>
          window.notifySystem("success", t("messages:Successfully updated"))
        )
        .catch((err) => {
          handleErrorMessages(err, t);
        })
    : null;
}

export function createStep() {
  const { setDialog, removeDialog, addStep, allSteps, t, workFlowId } =
    this.props;

  setDialog({
    name: "input",
    title: "Add a step",
    fields: [...stepFields],
    workFlowId,
    submit(values, stepsActions) {
      const index =
        allSteps && !isEmpty(allSteps)
          ? max(map([...allSteps], (val) => val.index)) + 1
          : 1;
      const params = {
        ...mapValues({ ...values }, (v) =>
          v == true ? 1 : v == false ? 0 : v
        ),
        steps_actions: values.steps_actions
          ? values.steps_actions.map((v) => {
              let selectedAction = find(stepsActions, { name: v }, null);
              return {
                actions: selectedAction,
                action_id: selectedAction.id,
              };
            })
          : null,
        //saved_data: values.saved_data ? `[${getStringArray( values.saved_data)}]` : null,
        //validate_data:values.validate_data ? `[${getStringArray( values.validate_data)}]` : null,
        work_flow_id: workFlowId,
        index,
      };

      postItem(stepsUrl, { ...params })
        .then((resp) => {
          addStep(resp);
          window.notifySystem(
            "success",
            t("messages:Step created successfully")
          );
          removeDialog();
        })
        .catch(() =>
          window.notifySystem("error", t("messages:Failed to create step"))
        );
    },
  });
}

function getStringArray(array) {
  return array.map((val) => `"${val}"`);
}

//object that contains names of fileds in the step where the shown value isnt the same as the recieved
const changedValues = {
  assign_to_position_id: "positions",
  scalator_positon_id: "positions1",
  assign_to_group_id: "groups",
  scalator_group_id: "groups1",
  module_id: "modules",
};

export function viewStep(props) {
  const { setDialog, step } = props;

  const item = mapValues(
    omitBy({ ...step }, (v) => isEqual(v, "[]") || isNull(v)),
    (v, k) =>
      k == "steps_actions"
        ? v.map((singleAction) => singleAction.actions.name)
        : includes(keys(changedValues), k) && step[changedValues[k]]
        ? step[changedValues[k]].name
        : v
  );

  const fields = filter([...stepFields], (field) => has(item, field.name));
  setDialog({
    name: "view",
    title: `${step.name}`,
    fields,
    item,
  });
}

export function editStep(props) {
  const { setDialog, removeDialog, step, changeStep, t, workFlowId } = props;
  const fields = [...stepFields];

  const item = mapValues({ ...step }, (v, k) =>
    k == "steps_actions"
      ? v.map((singleAction) => singleAction.actions.name)
      : includes(["saved_data", "validate_data"], k) && v
      ? v.replace(/"/g, "").replace("[", "").replace("]", "").split(",")
      : v
  );

  //setting the scalation checkbox to true if the values recieved contains scalation hrs
  //because the values recieved from db dont contain it
  item.scalation_hours ? (item.scalation = 1) : null;

  setDialog({
    name: "input",
    title: `Edit step`,
    fields,
    item,
    workFlowId,
    submit(values, stepsActions) {
      let steps_actions = values.steps_actions
        ? values.steps_actions.map((v) => {
            let selectedAction = find(stepsActions, { name: v }, null);
            return {
              actions: selectedAction,
              action_id: selectedAction.id,
              step_id: step.id,
            };
          })
        : null;

      const params = {
        ...mapValues({ ...values }, (v) =>
          v == true ? 1 : v == false ? 0 : v
        ),
        steps_actions,
        //steps_actions: values.steps_actions ? values.steps_actions.map((v) => find(stepsActions,{name: v},null)) : null,
        //saved_data: values.saved_data,
        //validate_data: values.validate_data ,
      };
      updateItem(stepsUrl, params, step.id)
        .then((resp) => {
          const changedStep = steps_actions
            ? assign({ ...resp, steps_actions })
            : { ...resp };
          window.notifySystem(
            "success",
            t("messages:Successfully updated step")
          );
          changeStep(changedStep, step.index - 1);
          removeDialog();
        })
        .catch(() =>
          window.notifySystem("error", t("messages:Failed to update step"))
        );
    },
  });
}

export function sendSMS(props) {
  const { setDialog, removeResults, step, setSelectData, t } = props;

  const selectData = step.steps_actions.map((singleAction) => {
    return { label: singleAction.actions.name, value: singleAction.actions.id };
  });
  setSelectData(selectData, "TableStepActions");

  const tableData = {
    method: "get",
    fetchUrl: `${workFlowUrl}/StepSMS/GetAll`,
    params: null,
    queryParams: { params: { filter_key: "step_id", q: step.id } },
  };

  setDialog({
    name: "input",
    title: `Message content`,
    fields: sendSMSFields,
    tableData,
    submit(values) {
      const params = mapValues({ ...values }, (val) =>
        val == true ? 1 : val == false ? null : val
      );
      postItem("/api/StepSMS/", { ...params, step_id: step.id })
        .then(() => {
          removeResults();
          window.notifySystem("success", t("messages:Successfully created"));
        })
        .catch(() =>
          window.notifySystem("success", t("messages:Failed to create"))
        );
    },
  });
}
