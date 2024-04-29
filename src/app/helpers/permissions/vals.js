import { every, get, map, find, isEqual, keys, some, isEmpty } from "lodash";
// import store from "../../../../../store";
export const match_value = (values, params = {}) => {
  return every(
    map(params, (value, key) => {
      if (Array.isArray(value)) {
        return (
          find(value, (d) =>
            isEqual(
              d,
              get(values, key) != undefined
                ? get(values, key)
                : get(
                    (values &&
                      Object.values(values)?.find((obj) =>
                        obj?.hasOwnProperty(key)
                      )) ||
                      {},
                    key
                  )
            )
          ) !== undefined
        );
      }
      return isEqual(
        value,
        get(values, key) != undefined
          ? get(values, key)
          : get(
              (values &&
                Object.values(values)?.find((obj) =>
                  obj?.hasOwnProperty(key)
                )) ||
                {},
              key
            )
      );
    })
  );
};

export const match_value_props = (props, params = []) => {
  try {
    return isEqual(eval(`props.${params[0]}`), params[1]);
  } catch (e) {
    return true;
  }
};

export const show_match_value = (values, params = {}, props) => {
  //

  return match_value(values, params);
};

export const show_match_value_props = (values, params = [], props) => {
  debugger;
  return match_value_props(props, params);
};

export const show_match_value_mod = (values, params = {}, props) => {
  console.log(values, params, props);

  let moduleId = props.currentModule.id || localStorage.getItem("module_id");
  if (
    (Array.isArray(params) && params.indexOf(moduleId) != -1) ||
    params == moduleId
  ) {
    return true;
  } else {
    return false;
  }
};
export const show_match_id = (values, params = {}, props) => {
  //

  if (values["id"] == params[0]) {
    return true;
  }
  return match_value(values, params);
};
export const show_match_value_modified = (values, params = []) => {
  if (values["id"] && Object.values(params)[0] == 1) {
    return true;
  }
  return false;

  // return Object.values(params)[0];
};

export const not_match_value = (values, params = {}) => {
  return !match_value(values, params);
};

//if the value of the field is an array and i wanna check if the array contains certain values
//how it is written in permission => show_include_value_array: {
// *field name*: [*array of the values *]
// }
export const show_include_value_array = (values, params = {}) => {
  let key = keys(params)[0];
  return some(get(values, key, []), (v) => get(params, key, null).includes(v));
};

export const floor_repeat = (values = {}, params = {}) => {
  return ["Repeated", "Under Ground", "Level"].includes(values.type);
};
