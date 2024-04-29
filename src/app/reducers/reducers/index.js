import { map, upperFirst } from "lodash";
import * as handlers from './functions';
import reducersList from './reducersList';


const createReducer = reducerName => {
  let functions = {};
  map(handlers, (v, k) => {functions[k.replace('__REDUCER__', upperFirst(reducerName))] = v});
  return (state = {}, action) => {
    return functions[action.type]
    ? functions[action.type](state, action)
    : state;
  }
};

const reducers = {};
reducersList.map(reducerName =>
  reducers[reducerName] = createReducer(reducerName)
);

export default reducers
