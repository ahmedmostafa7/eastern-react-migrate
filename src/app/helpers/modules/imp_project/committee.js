import { filter } from "lodash";
import { Message } from "antd";
import store from "app/reducers";
import { get } from "lodash";
export default (number) => ({
  number: 5,
  label: "Committee",
  preSubmit(values, currentStep, props) {
    const members = filter(get(values, "members.main"), (d) => d.active);
    if (!number || members.length >= number) {
      return Promise.resolve(values);
    }
    Message.error(props.t("Please Choose 3 members"));
    return Promise.reject();
  },
  //description: 'this is the Second Step description',
  sections: {
    members: {
      label: "Members",
      type: "inputs",
      init_data(values, props) {
        // const = {Conditions} = props;
        // console.log(values, props);

        let selectedActors = get(
          props,
          "mainObject.committee.members.main",
          {}
        );
        setTimeout(() => {
          const state = store.getState();
          const committes = get(
            state,
            "wizard.currentModule.record.committees.committee_actors",
            get(state, "wizard.currentModule.record.CurrentStep.signatures", [])
          );
          const mainData = committes.reduce(
            (o, v) => ({
              ...o,
              [v.user_id]: {
                id: v.user_id,
                sign_order: v.sign_order,
                position_name: v.position_name,
                active: selectedActors[v.user_id]?.active || false,
                name:
                  selectedActors[v.user_id]?.name ||
                  (v.users.name.indexOf("مهندس") == -1 &&
                    `المهندس \ ${get(v, "users.name")}`) ||
                  get(v, "users.name"),
              },
            }),
            {}
          );
          props.change("members.main", mainData);
        });
      },
      fields: {
        main: {
          label: "Members",
          field: "list",
          fields: {
            name: { head: "Name" },
            position_name: {
              head: "Position",
            },
            active: {
              head: "Active",
              type: "input",
              field: "boolean",
              hide_sublabel: true,
            },
          },
          // required: true
        },
      },
    },
  },
});
