import { set, omit, pick, get, cloneDeep, assign } from "lodash";
import { array_to_obj } from "main_helpers/functions";

export const set__REDUCER__ = (state, payload) => {
  if (!payload.path) {
    return { ...payload.data };
  }
  let newState = cloneDeep(state);
  set(newState, payload.path, payload.data);
  // console.log('newState', newState);
  return newState;
};
export const set_data__REDUCER__ = (state, action) => {
  const data = Array.isArray(action.data)
    ? array_to_obj(action.data)
    : action.data;
  return { ...state, ...{ data: { ...state.data, ...data } } };
};
export const set_main__REDUCER__ = (state, action) => {
  return { ...state, ...action.data };
};
export const append_path__REDUCER__ = (state, action) => {
  //
  if (!action.path) {
    return state;
  }
  let newState = cloneDeep(state);
  const data = Array.isArray(action.data)
    ? array_to_obj(action.data)
    : action.data;
  set(newState, action.path, assign(get(newState, action.path, {}), data));
  console.log(action.path);
  return newState;
};
export const set_path__REDUCER__ = (state, action) => {
  if (!action.path) {
    return state;
  }
  let newState = cloneDeep(state);
  const data = Array.isArray(action.data)
    ? array_to_obj(action.data)
    : action.data;
  set(newState, action.path, data);
  return newState;
};
export const remove_main__REDUCER__ = (state, action) => {
  return { ...omit(state, action.data) };
};
export const remove_data__REDUCER__ = (state, action) => {
  return { ...state, data: { ...omit(state.data, action.data) } };
};
export const reset_all__REDUCER__ = (state, action) => {
  // const data = Array.isArray(action.data) ? array_to_obj(action.data):action.data
  return {};
};

export const remove__REDUCER__ = (state, payload) => {
  let newState = cloneDeep(state);
  let data = get(newState, payload.path);
  if (!payload.path) {
    return {};
  }
  if (Array.isArray(data)) {
    data.splice(payload.index, 1);
    set(newState, payload.path, data);
    return newState;
  }
  return omit(state, payload.path);
};

export const reset__REDUCER__ = (state, payload) => {
  return pick(state, payload.path);
};

export const insertInArray__REDUCER__ = (state, payload) => {
  const { path, data, index: _index, operation } = payload;
  const isDataArray = Array.isArray(data);
  if (isDataArray && !data.length) {
    return state;
  }
  let newState = cloneDeep(state);
  const array = get(newState, path, []);
  const index = _index == -1 ? array.length : _index;
  isDataArray && index > array.length - 1
    ? set(array, index + data.length - 1, undefined)
    : null;
  if (
    operation === "rewrite" ||
    (isDataArray && array[index + data.length - 1] == undefined)
  ) {
    isDataArray
      ? array.splice(index, data.length, ...data)
      : array.splice(index, 1, data);
  } else {
    isDataArray
      ? array.splice(index, 0, ...data)
      : array.splice(index, 0, data);
  }
  set(newState, payload.path, array);
  return newState;
};

export const pushToList__REDUCER__ = (state, payload) => {
  let newState = { ...state };
  const oldList = get(newState, payload.path, {});
  let newList = { ...oldList, ...payload.data };
  set(newState, payload.path, newList);
  return newState;
};

export const Show_Loading_new = (state, payload) => {
  let count = -1;
  if (payload.loading) {
    count = 1;
  }
  let loading = (state.loading || 0) + count;
  return {
    ...state,
    loading: loading < 0 ? 0 : loading,
  };
};
