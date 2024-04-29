import { get } from "lodash";
import { updateItem, postItem } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
import { USER_TITLE as USER_TITLE_MODULE } from "./";
import { workFlowUrl } from "configFiles/config";

export const USER_TITLE = {
  freeze({ item, itemIndex }, params, props) {
    const { setDialog, editItemInTable, t } = props;
    const { singleLabel, apiUrl, primaryKey, show } = USER_TITLE_MODULE;
    setDialog({
      name: "confirmation",
      title: `${t("actions:Freeze")} ${t("labels:" + singleLabel)}`,
      message: `${t("messages:Are you sure you want to freeze this")} ${t(
        "labels:" + singleLabel
      )} ${t("messages:?")}`,
      show: show || undefined,
      item,
      currentModule: USER_TITLE_MODULE,
      submitFun() {
        return updateItem(
          `${apiUrl}`,
          { ...item, is_active: 0 },
          get(item, primaryKey, "id")
        ).then(
          (response) => editItemInTable(response, itemIndex, "USER_TITLE"),
          (err) => handleErrorMessages(err, t)
        );
      },
    });
  },

  activate({ item, itemIndex }, params, props) {
    const { setDialog, editItemInTable, t } = props;
    const { singleLabel, apiUrl, primaryKey, show } = USER_TITLE_MODULE;
    setDialog({
      name: "confirmation",
      title: `${t("actions:Freeze")} ${t("labels:" + singleLabel)}`,
      message: `${t("messages:Are you sure you want to activate this")} ${t(
        "labels:" + singleLabel
      )} ${t("messages:?")}`,
      show: show || undefined,
      item,
      currentModule: USER_TITLE_MODULE,
      submitFun() {
        return updateItem(
          `${apiUrl}`,
          { ...item, is_active: 1 },
          get(item, primaryKey, "id")
        ).then(
          (response) => editItemInTable(response, itemIndex, "USER_TITLE"),
          (err) => handleErrorMessages(err, t)
        );
      },
    });
  },

  changePassword({ item }, params, props) {
    const { currentModule, setDialog, t } = props;
    const { primaryKey } = USER_TITLE_MODULE;
    setDialog({
      name: "input",
      title: `${t("actions:Change Password")}`,
      fields: {
        newPassword: {
          label: "Password",
          type: "password",
          required: true,
        },
        confirmNewPassword: {
          label: "Confirm Password",
          type: "password",
          required: true,
          match: "newPassword",
        },
      },
      currentModule,
      submitFun(values) {
        return postItem(
          `${workFlowUrl}/Users/changepassword/${get(item, primaryKey)}`,
          values,
          get(item, primaryKey, "id")
        );
      },
    });
  },
};
