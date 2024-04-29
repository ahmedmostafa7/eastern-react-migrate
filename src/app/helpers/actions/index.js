import store from "app/reducers";
import { get } from "lodash";
import * as actions from "./actions";
export default (
  params,
  props,
  data = {},
  state = store.getState(),
  ...args
) => {
  const action = get(actions, params.type, () => {});
  return action(
    params,
    props,
    (props.currentStep && data[props.currentStep]) || data,
    state,
    ...args
  );
};
