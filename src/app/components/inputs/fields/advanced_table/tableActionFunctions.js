import { workFlowUrl } from "configFiles/config";
import axios from "axios";

export function deleteFunc({ id }, index, action) {
  const { removeItemInResults, t } = this.props;
  const { url } = action;
  const deleteUrl = `${url}${id}`;

  axios
    .delete(workFlowUrl + deleteUrl)
    .then(() => {
      window.notifySystem("success", t("Succesfully deleted"));
      removeItemInResults(index);
    })
    .catch(() => {
      window.notifySystem("error", t("Failed to delete"));
    });
}
