import { postItem, updateItem, deleteItem } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import { applySubmissionsFuncs } from "app/helpers/functions";
import { get, pick, pickBy, map } from "lodash";

export function addNewItem() {
  const { currentModule, setDialog, addToTable, t, currentModuleKey } =
    this.props;
  const { fields, singleLabel, apiUrl } = currentModule;
  const fieldsObj = pickBy(
    fields,
    (field, key) => !get(currentModule, "hide_new", []).includes(key)
  );
  setDialog({
    name: "input",
    title: `${t("actions:Add")} ${t("labels:" + singleLabel)}`,
    fields: fieldsObj,
    currentModule,
    submitFun: (values) => {
      return applySubmissionsFuncs(
        pick(
          values,
          map(fieldsObj, (value, key) => key)
        ),
        get(currentModule, "preSubmit.new", {}),
        undefined,
        this.props
      )
        .then((_values) => postItem(`${apiUrl}`, _values))
        .then((response) => {
          console.log(response, currentModuleKey);
          response && addToTable(response, currentModuleKey);
          window.notifySystem("success", t("successfuly added"));
        })
        .catch((e) => window.notifySystem("error", t("failed to add")));
    },
  });
}

export function updateCurrentItem({ item, itemIndex }, params, props) {
  const { currentModule, setDialog, editItemInTable, t, currentModuleKey } =
    props;
  const { fields, singleLabel, apiUrl, primaryKey } = currentModule;
  const fieldsObj = pickBy(
    fields,
    (field, key) => !get(currentModule, "hide_edit", []).includes(key)
  );
  applySubmissionsFuncs(item, get(currentModule, "preOpen.edit", {})).then(
    (_item) =>
      setDialog({
        name: "input",
        title: `${t("actions:Edit")} ${t("labels:" + singleLabel)}`,
        fields: fieldsObj,
        item: _item,
        currentModule,
        submitFun(values) {
          return applySubmissionsFuncs(
            { ...item, ...values },
            get(currentModule, "preSubmit.edit", {}),
            item,
            props
          )
            .then((_values) =>
              updateItem(`${apiUrl}`, _values, get(item, primaryKey, "id"))
            )
            .then((response) => {
              editItemInTable(response, itemIndex, currentModuleKey);
              window.notifySystem("success", t("successfuly edited"));
            })
            .catch((e) => window.notifySystem("error", t("failed to edit")));
        },
      })
  );
}

export function deleteCurrentItem({ item, itemIndex }, params, props) {
  const { currentModule, setDialog, deleteItemInTable, t, currentModuleKey } =
    props;
  const { singleLabel, apiUrl, primaryKey, show, deleteMessage } =
    currentModule;

  setDialog({
    name: "confirmation",
    title: `${t("actions:Delete")} ${t("labels:" + singleLabel)}`,
    message: `${t("messages:Are you sure you want to delete this")} ${t(
      "labels:" + singleLabel
    )} ${t("messages:?")}`,
    show: show || undefined,
    item,
    currentModule,
    submitFun() {
      return deleteItem(`${apiUrl}`, get(item, primaryKey, "id"))
        .then((response) => {
          deleteItemInTable(itemIndex, currentModuleKey);
          window.notifySystem("success", t("successfully deleted"));
        })
        .catch((e) =>
          window.notifySystem(
            "error",
            t(deleteMessage ? deleteMessage : "failed to delete")
          )
        );
    },
  });
}
