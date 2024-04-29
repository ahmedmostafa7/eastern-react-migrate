import { map, get, last } from "lodash";
import * as funcs from "app/helpers/submitionHelpers";
import seqentialPromise from "promise-sequential";

export const applySubmissionsFuncs = (
  values,
  submitionFuncs = {},
  item,
  props
) => {
  const promises = map(
    submitionFuncs,
    (params, fun) => (prevRes) =>
      get(funcs, fun, Promise.resolve(values))(
        prevRes || values,
        params,
        item,
        props
      )
  );
  if (!promises.length) {
    return Promise.resolve(values);
  }
  return new Promise((resolve) => {
    seqentialPromise(promises).then((res) => resolve(last(res)));
  });
};
