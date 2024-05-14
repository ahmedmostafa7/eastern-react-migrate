import { workFlowUrl } from "imports/config";
import { pick, get } from "lodash";
import { fetchData } from "app/helpers/apiMethods";
import { handleErrorMessages } from "app/helpers/errors";
export const checkRequestsCount = (appId, props) => {
  return new Promise((resolve, reject) => {
    const { t } = props;
    fetchData(`/submission/GetRunningSubmissions/requested/${appId}`).then(
      (response) => {
        return resolve(response.count);
      },
      (err) => {
        handleErrorMessages(err, t);
        return reject();
      }
    );
  });
};
const defaultAppDetails = (appId, maxRequestNo) => {
  return {
    field: "select",
    moduleName: `workflows_${appId}`,
    hideLabel: "true",
    show: "workflows",
    className: "buttonSelect",
    showSearch: false,
    showArrow: false,
    reset: true,
    fetch: `${workFlowUrl}/workFlow/GetCreatedStepInWorkFlow/${appId}`,
    value_key: "id",
    label_key: "name",
    postRequest: (props, data) => {
      let appName = Object.keys(props.apps.splitandmerge).find(
        (app) =>
          location?.href?.toLowerCase()?.indexOf(app?.toLowerCase()) != -1
      );
      if (props.apps.splitandmerge[appName].id == 16) {
        if (props.user.engcompany_id) {
          //props.setData(data.filter((workflow) => workflow.id == 2209));
          props.setData(data);
        } else {
          props.setData(
            data.filter((workflow) => [2210, 2211].indexOf(workflow.id) != -1)
          );
        }
        props.setNextUrl("");
      } else {
        props.setData(data);
        props.setNextUrl("");
      }
    },
  };
};
export const tabsButtons = ({
  id: appId,
  max_request_no: maxRequestNo,
  name,
}) => ({
  create: {
    name: "create",
    label: "create",
    title: "create",
    ...defaultAppDetails(appId, maxRequestNo),
    selectChange: (val, rec, props) => {
      let actions = get(rec, "steps[0].steps_actions", []).reduce((a, b) => {
        b.actions.label_name = b.label_name;
        a.push({ ...b, ...b.actions });
        return a;
      }, []);
      checkRequestsCount(appId, props).then((count) => {
        const { history, setCurrentModule, removeMainObject, t } = props;
        if (maxRequestNo && count >= maxRequestNo) {
          window.notifySystem("error", t("messages:MAX_SUBMISSIONS"));
        } else {
          if (rec && [2029].indexOf(rec.id) == -1) {
            setCurrentModule({
              ...pick({ ...get(rec, "modules", {}) }, ["name", "id"]),
              record: {
                workflow_id: rec && rec.id,
                app_id: rec && rec.app_id,
                workflows: rec,
                CurrentStep: get(rec, "steps[0]", { is_create: true }),
              },
              print_state: (rec && rec.app_id == 14 && "A4") || "A3",
              actions: (name == "splitandmerge.surveycheck" && [
                ...actions,
              ]) || [
                get(rec, "steps[0].steps_actions[0].actions", {
                  name: "global.SUBMIT",
                  can_submit: true,
                  id: 1,
                  css_class: "send",
                }),
              ],
            });
            removeMainObject();
            history("/wizard");
          } else {
            let fields = {
              print_state: {
                type: "input",
                field: "radio",
                // hideLabel: true,
                options: [
                  { label: "A3", value: "A3" },
                  { label: "A0", value: "A0" },
                ],
                label: "تحديد نوع الطباعة",
                // hide_sublabel: true,
              },
            };
            props.mainProps.setMain("Popup", {
              popup: {
                type: "create",
                childProps: {
                  fields,
                  ok(values) {
                    setCurrentModule({
                      ...pick({ ...get(rec, "modules", {}) }, ["name", "id"]),
                      record: {
                        workflow_id: rec && rec.id,
                        // name: "بب",
                        app_id: rec && rec.app_id,
                        workflows: rec,
                        CurrentStep: get(rec, "steps[0]", { is_create: true }),
                      },
                      print_state: values.print_state,
                      actions: (name == "splitandmerge.surveycheck" && [
                        ...actions,
                      ]) || [
                        get(rec, "steps[0].steps_actions[0].actions", {
                          name: "global.SUBMIT",
                          can_submit: true,
                          id: 1,
                          css_class: "send",
                        }),
                      ],
                    });
                    removeMainObject();
                    history("/wizard");
                    return Promise.resolve(values);
                  },
                },
              },
            });
          }
        }
      });
    },
  },
  create_ordering: {
    name: "create_ordering",
    label: "create_ordering",
    title: "create_ordering",
    ...defaultAppDetails(appId, maxRequestNo),
    selectChange: (val, rec, props) => {
      let actions = get(rec, "steps[0].steps_actions", []).reduce((a, b) => {
        b.actions.label_name = b.label_name;
        a.push({ ...b, ...b.actions });
        return a;
      }, []);

      checkRequestsCount(appId, props).then((count) => {
        const { history, setCurrentModule, removeMainObject, t } = props;
        if (maxRequestNo && count >= maxRequestNo) {
          window.notifySystem("error", t("messages:MAX_SUBMISSIONS"));
        } else {
          if (rec && [2029].indexOf(rec.id) == -1) {
            setCurrentModule({
              ...pick({ ...get(rec, "modules", {}) }, ["name", "id"]),
              record: {
                workflow_id: rec && rec.id,
                app_id: rec && rec.app_id,
                workflows: rec,
                CurrentStep: get(rec, "steps[0]", { is_create: true }),
              },
              print_state: (rec && rec.app_id == 14 && "A4") || "A3",
              actions: [...actions],
            });
            removeMainObject();
            history("/wizard");
          } else {
            let fields = {
              print_state: {
                type: "input",
                field: "radio",
                // hideLabel: true,
                options: [
                  { label: "A3", value: "A3" },
                  { label: "A0", value: "A0" },
                ],
                label: "تحديد نوع الطباعة",
                // hide_sublabel: true,
              },
            };
            props.mainProps.setMain("Popup", {
              popup: {
                type: "create",
                childProps: {
                  fields,
                  ok(values) {
                    setCurrentModule({
                      ...pick({ ...get(rec, "modules", {}) }, ["name", "id"]),
                      record: {
                        workflow_id: rec && rec.id,
                        // name: "بب",
                        app_id: rec && rec.app_id,
                        workflows: rec,
                        CurrentStep: get(rec, "steps[0]", { is_create: true }),
                      },
                      print_state: values.print_state,
                      actions: [...actions],
                    });
                    removeMainObject();
                    history("/wizard");
                    return Promise.resolve(values);
                  },
                },
              },
            });
          }
        }
      });
    },
  },
});
