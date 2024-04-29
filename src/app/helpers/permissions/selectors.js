import {
  get,
  flatten,
  findIndex,
  filter,
  find,
  difference,
  keys,
  isEqual,
  includes,
  padEnd,
} from "lodash";
import applyFilter from "main_helpers/functions/filters";
import { get_total_letters_ma7dar } from "../../components/inputs/fields/calculator/functions";
export const hide_every = (values, params = []) => {
  return !params.every((d) =>
    get(values, d) != undefined
      ? get(values, d)
      : get(
          (values &&
            Object.values(values)?.find((obj) => obj?.hasOwnProperty(d))) ||
            {},
          d
        )
  );
};

export const hide_every_props = (values, params = [], props) => {
  return !params.every((d) => get(props, d));
};
export const hide_text = (values, params = [], props) => {
  let mainObject = props.mainObject.print_takreer;
  let vv = values && values.selectMoralat;
  let check = get(mainObject, "takreers.select", "4");
  if (vv == params.value) {
    return true;
  } else {
    return false;
  }
};

export const hide_any = (values, params = []) => {
  return !params.some((d) =>
    get(values, d) != undefined
      ? get(values, d)
      : get(
          (values &&
            Object.values(values)?.find((obj) => obj?.hasOwnProperty(d))) ||
            {},
          d
        )
  );
};
export const hide_any_props = (values, params = [], props) => {
  return !params.some((d) =>
    get(values, d) != undefined
      ? get(values, d)
      : get(
          (values &&
            Object.values(values)?.find((obj) => obj?.hasOwnProperty(d))) ||
            {},
          d
        )
  );
};

export const show_any = (values, params = []) => {
  return params.some((d) =>
    get(values, d) != undefined
      ? get(values, d)
      : get(
          (values &&
            Object.values(values)?.find((obj) => obj?.hasOwnProperty(d))) ||
            {},
          d
        )
  );
};

export const show_any_props = (values, params = [], props) => {
  return params.some((d) => get(props, d));
};

export const show_every = (values, params = []) => {
  let f = values;

  return params.every((d) =>
    get(values, d) != undefined
      ? get(values, d)
      : get(
          (values &&
            Object.values(values)?.find((obj) => obj?.hasOwnProperty(d))) ||
            {},
          d
        )
  );
};

export const show_every_props = (values, params = [], props) => {
  return params.every((d) =>
    get(values, d) != undefined
      ? get(values, d)
      : get(
          (values &&
            Object.values(values)?.find((obj) => obj?.hasOwnProperty(d))) ||
            {},
          d
        )
  );
};

export const show_props_equal_list = (values, params = [], props) => {
  return params.every((v) =>
    isEqual(get(props, v.key, get(values, v.key)), v.value)
  );
};

export const show_multiProps_equal_list = (values, params = [], props) => {
  return Object.values(params).filter((r) =>
    show_props_equal_list(values, r, props)
  ).length;
};

export const show_values_equal_list = (values, params = [], props) => {
  return params.every((v) =>
    isEqual(get(values, v.key, get(props, v.key)), v.value)
  );
};

export const show_multiValues_equal_list = (values, params = [], props) => {
  return Object.values(params).filter((r) =>
    show_values_equal_list(values, r, props)
  ).length;
};

export const hide_props_equal_list = (values, params = [], props) => {
  return params.every(
    (v) => !isEqual(get(props, v.key, get(values, v.key)), v.value)
  );
};

export const hide_values_equal_list = (values, params = [], props) => {
  return params.every(
    (v) => !isEqual(get(values, v.key, get(props, v.key)), v.value)
  );
};

export const show_props_not_equal_list = (values, params = [], props) => {
  return params.every((v) => !isEqual(get(props, v.key), v.value));
};

export const show_if_propsArray_contains = (values, { key, params }, props) => {
  return find(props[key], params);
};

export const show_if_props_equal = (values, { key, value }, props) => {
  return isEqual(get(props, key), value);
};
export const hide_if_lists_equal = (values, { compare, value }, props) => {
  return !isEqual(get(props, value), get(props, compare));
};
export const show_if_lists_equal = (values, { compare, value }, props) => {
  return isEqual(get(props, value), get(props, compare));
};
export const show_if_app_id_equal = (values, { key, value }, props) => {
  // if (props.record.app_id != 16) {
  //   show_check_index(_, -1, { list: [] });
  // }
  return isEqual(
    get(props, key),
    (props?.record?.app_id &&
      value.filter((d) => d == props.record.app_id)[0]) ||
      value
  );
};
export const not_show_if_app_id_equal = (values, { key, value }, props) => {
  return !isEqual(
    get(props, key),
    (props?.record?.app_id &&
      value.filter((d) => d == props.record.app_id)[0]) ||
      value
  );
};
export const hide_check_index = (values, params, { list, itemIndex }) => {
  let index = params;
  if (params < 0) {
    index = list.length + params;
  }
  return itemIndex != index;
};

// export const hide_if_app_id_equal = (values, { key, value }, props) => {
//   return isEqual(
//     get(props, key),
//     value.filter((d) => d == props.record.app_id)[0]
//   );
// };
// export const show_if_props_equal_2 = (values, { key, value }, props) => {
//   return isEqual(get(props, key), value);
// };
export const show_if_props_equal_3 = (values, { key, value }, props) => {
  if (
    props.record.is_approved == null ||
    props.record.is_approved == undefined
  ) {
    return true;
  } else {
    return false;
  }
  // if (props[key] == null || props[key] == undefined) {
  //   return true;
  // } else {
  //   return false;
  // }
};
export const show_if_val_equal = (
  values,
  { key, value, defaultValue },
  props
) => {
  return isEqual(get(values || props, key, defaultValue), value);
};
export const show_if_val_not_equal = (
  values,
  { key, value, defaultValue },
  props
) => {
  return !isEqual(get(values || props, key, defaultValue), value);
};
export const show_if_props_includes = (
  values,
  { key, value, defaultValue },
  props
) => {
  return includes(value, get(props, key, defaultValue));
};

export const show_if_props_not_includes = (
  values,
  { key, value, defaultValue },
  props
) => {
  return !includes(value, get(props, key, defaultValue));
};

export const check_props_values = (values, params = [], props) => {
  let valid = true;

  params.forEach((param) => {
    if (
      param.equals &&
      ((param.value &&
        ((Array.isArray(param.value) &&
          param.value.indexOf(get(props, param.key)) == -1) ||
          (!Array.isArray(param.value) &&
            !isEqual(get(props, param.key), param.value)))) ||
        (param.compare &&
          !isEqual(get(props, param.key), get(props, param.compare))))
    ) {
      valid = false;
      return;
    } else if (
      !param.equals &&
      ((param.value &&
        ((Array.isArray(param.value) &&
          param.value.indexOf(get(props, param.key)) != -1) ||
          (!Array.isArray(param.value) &&
            isEqual(get(props, param.key), param.value)))) ||
        (param.compare &&
          isEqual(get(props, param.key), get(props, param.compare))))
    ) {
      valid = false;
      return;
    }
  });
  return valid;
};

export const show_if_value_included = (values, { compare, key }, props) => {
  return includes(compare, get(values, key));
};
export const show_if_value_has_includes = (values, { compare, key }, props) => {
  return includes(get(values, key), compare);
};
export const hide_if_value_is_zero = (values, { compare, key }, props) => {
  // return includes(get(values, key), compare);
  let elem = values && values[key];
  if (elem == "no") {
    return false;
  } else {
    return true;
  }
};
export const hide_if_value_included = (values, { compare, key }, props) => {
  return !includes(compare, get(values, key));
};

export const hide_if_props_equal = (values, { key, value }, props) => {
  return !isEqual(get(props, key), value);
};

export const hide_if_props_equal_multiple = (values, compareList, props) => {
  let found = false;

  compareList.forEach((item) => {
    if (!found) found = isEqual(get(props, item.key), item.value);
  });

  return !found;
};

export const hide_if_props_includes = (values, { key, value }, props) => {
  return !includes(value, get(props, key));
};

export const show_check_index = (values, params, { list, itemIndex }) => {
  let index = params;
  if (params < 0) {
    index = list.length + params;
  }
  return itemIndex == index;
};
export const hide_if = (values, params, { list, itemIndex }, props) => {
  let index = list.indexOf("summery");
  let summery = localStorage.getItem("summery");
  if (index <= itemIndex && summery == "true") {
    return true;
  } else {
    return false;
  }
};
// export const show_owner_approval = (values, params, { list, itemIndex }) => {
//   // get_total_letters_ma7dar();
//   // window.acceptOrReject = 1;
//   if (window.acceptOrReject == params) {
//     return true;
//   } else {
//     return false;
//   }
// };
export const hide_check_index_multi = (values, params, { list, itemIndex }) => {
  let index = params.index;
  let indexs = flatten(
    params.keys.map((d) =>
      filter(list, d).map((d, i, l) => ({
        index: findIndex(list, d),
        dataIndex: i,
        negIndex: i - l.length,
      }))
    )
  );
  if (index < 0) {
    return !find(indexs, { index: itemIndex, negIndex: index });
  }
  return !find(indexs, { index: itemIndex, dataIndex: index });
};

export const object_has_list = (values, { objectKey, listKey }, props) => {
  const object = get(props, objectKey);
  const list = get(props, listKey);
  return !difference(list, keys(object)).length;
};

export const check_object_keys_length = (values, { key, value }, props) => {
  return values
    ? !values[key] || (values[key] && Object.keys(values[key]).length == value)
    : true;
};

export const hide = () => false;
export const show = () => true;

export const stateFilter = (values, params, props) => {
  return applyFilter(params, values, undefined, props);
};
