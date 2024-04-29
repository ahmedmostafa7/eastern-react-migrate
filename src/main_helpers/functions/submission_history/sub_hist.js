import { followUp } from "../../../apps/modules/tabs/tableActionFunctions/tableActions";
import { fetchData } from "../../../app/helpers/apiMethods";
import store from "app/reducers";
export const getSubmissionHistory = (
  workflow_id,
  props,
  sub_info = props.match.params
) => {
  return new Promise((resolve, reject) => {
    fetchData(`${window.workFlowUrl}/api/workflow/${workflow_id}`).then(
      (result) => {
        followUp({ ...sub_info }, 0, null, null, false, props).then((res) => {
          store.dispatch({ type: "Show_Loading_new", loading: false });
          return resolve({
            steps: result.steps,
            steps_history: res,
          });
        });
      }
    );
  });
};
