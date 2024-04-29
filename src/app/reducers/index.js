import { combineReducers, createStore, compose } from "redux";
import reducers from './reducers';
import { reducer as formReducer } from "redux-form";
import {reduxBatch} from '@manaflair/redux-batch';
import * as initState from './init_data';
export const rootReducer = combineReducers({
  ...reducers,
  form: formReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancer(
    compose(
        reduxBatch
    )
);

const store = createStore(rootReducer, initState, enhancer);
// +  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export default store;
