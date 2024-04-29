import axios from "axios";
import store from "./app/reducers";
import { get } from "lodash";
// Add a request interceptor
export default () => {
  axios.interceptors.request.use(
    (config) => {
      // Do something before request is sent
      // if localstorage token
      const Token = localStorage.getItem("token");

      if (Token) {
        config.headers.common.Authorization = `Bearer ${Token}`;
      }
      config.headers.common["Cache-Control"] = "no-cache";
      const loading = get(store.getState(), "global.loading", 0);
      // if(!get(store.getState(), ''))
      store.dispatch({
        type: "set_mainGlobal",
        data: { loading: loading + 1 },
      });
      return config;
    },
    (error) => {
      // Do something with request error
      const loading = get(store.getState(), "global.loading", 0);
      // if(!get(store.getState(), ''))
      store.dispatch({
        type: "set_mainGlobal",
        data: { loading: loading - 1 },
      });
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    (response) => {
      // store.dispatch({type:'Show_Loading',loading:false})
      // Do something with response data
      const loading = get(store.getState(), "global.loading", 0);
      // if(!get(store.getState(), ''))
      store.dispatch({
        type: "set_mainGlobal",
        data: { loading: loading - 1 },
      });
      return response;
    },
    (error) => {
      // store.dispatch({type:'Show_Loading',loading:false})
      // Do something with response error
      const loading = get(store.getState(), "global.loading", 0);
      // if(!get(store.getState(), ''))
      store.dispatch({
        type: "set_mainGlobal",
        data: { loading: loading - 1 },
      });
      return Promise.reject(error);
    }
  );
};
