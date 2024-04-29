import { map, get, isEmpty, pickBy, find } from "lodash";
import * as asyncFuncs from "app/helpers/asyncValidations";
import { delayedPromise } from "app/helpers/functions";

export const composeAsyncValidations =
  (fieldsPath, currentAppPath) => (values, dispatch, props, currentField) => {
    const { asyncErrors } = props;
    const fields = get(props, fieldsPath, []);
    let field = get(fields, currentField);
    field = field
      ? { ...field, name: currentField }
      : find(fields, (field) => field.name == currentField) || {};
    if (field) {
      const currentFieldValue = get(values, currentField, "");
      const currentApp = get(props, currentAppPath);
      const validatesPromises = map(field, (params, key) => {
        return { params, fun: get(asyncFuncs, key, null) };
      }).filter((d) => d.fun);
      if (validatesPromises.length) {
        return delayedPromise(
          () =>
            Promise.all(
              validatesPromises.map((d) =>
                d.fun(
                  d.params,
                  currentFieldValue,
                  values,
                  asyncErrors,
                  field,
                  currentApp,
                  props
                )
              )
            ),
          500
        ).then((d) => true);
      }
    }
    return Promise.resolve(true).then(() => {
      const errors = pickBy(asyncErrors, (d) => d);
      if (!isEmpty(errors)) {
        throw { ...errors };
      }
      return true;
    });
  };
