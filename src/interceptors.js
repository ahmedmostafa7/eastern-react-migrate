import axios from "axios";
import store from "./app/reducers";
import { get } from "lodash";
// Add a request interceptor
export default () => {
  axios.interceptors.request.use(
    (config) => {
      const Token = localStorage.getItem("token");

      if (Token) {
        // config.headers.common.Authorization = `Bearer ${Token}`;
        config.headers["Authorization"] = `Bearer ${Token}`;
      }
      config.headers["Cache-Control"] = "no-cache";
      const loading = get(store.getState(), "global.loading", 0);

      store.dispatch({
        type: "set_mainGlobal",
        data: { loading: loading + 1 },
      });
      return config;
    },
    (error) => {
      const loading = get(store.getState(), "global.loading", 0);
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
      // if(!get(store.getState(), ''))
      const loading = get(store.getState(), "global.loading", 0);
      store.dispatch({
        type: "set_mainGlobal",
        data: { loading: loading - 1 },
      });
      return response;
    },
    (error) => {
      // store.dispatch({type:'Show_Loading',loading:false})
      // Do something with response error
      // if(!get(store.getState(), ''))
      const loading = get(store.getState(), "global.loading", 0);
      store.dispatch({
        type: "set_mainGlobal",
        data: { loading: loading - 1 },
      });
      return Promise.reject(error);
    }
  );
};
