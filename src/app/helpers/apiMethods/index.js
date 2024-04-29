import axios from "axios";
import { workFlowUrl, hostUpload } from "imports/config";
import { omitBy, isNull, isObject, isArray } from "lodash";

export function fetchData(api_url, config) {
  //
  if (api_url) {
    const url =
      (api_url
        .replace("/GISBusinessAPI", "")
        .indexOf(workFlowUrl.split("/")[workFlowUrl.split("/").length - 1]) !=
        -1 &&
        (api_url.includes("http")
          ? api_url
          : hostUpload + api_url.replace("/GISBusinessAPI", ""))) ||
      (api_url.includes("http")
        ? api_url
        : workFlowUrl + api_url.replace("/GISBusinessAPI", ""));
    // const url = api_url.includes("http") ? api_url : workFlowUrl + api_url.replace('/GISBusinessAPI', '');
    var preConf = isObject(config) ? omitBy(config, (v) => isNull(v)) : config;
    // let newConfig = { headers: { "Access-Control-Allow-Origin": "*", ...preConf }
    return axios.get(url, preConf).then(({ data }) => data);
  }
  return Promise.resolve([]);
}

export function postItem(api_url, item, config) {
  const url = api_url.includes("http")
    ? api_url
    : workFlowUrl + api_url.replace("/GISBusinessAPI", "");
  var newItem = isObject(item) ? omitBy(item, (v) => isNull(v)) : item;
  var newConfig = isObject(config) ? omitBy(config, (v) => isNull(v)) : config;
  return axios.post(url, newItem, newConfig).then(({ data }) => {
    return data;
  });
}

export function postItem2(api_url, item, config) {
  var myHeaders = new Headers();

  const Token = localStorage.getItem("token");
  if (Token) {
    myHeaders.append("Authorization", `Bearer ${Token}`);
  }
  myHeaders.append("Accept", "application/json, text/plain, */*");
  myHeaders.append("Cache-Control", "no-cache");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
  };

  return fetch(api_url, requestOptions)
    .then((response) => response.json())
    .then(({ data }) => data)
    .catch((error) => console.log("error", error));
}

export function updateItem(api_url, item, itemId, config) {
  //const url = api_url.includes("http")? api_url :  workFlowUrl + api_url ;

  const url = api_url.includes("http")
    ? api_url
    : workFlowUrl + api_url.replace("/GISBusinessAPI", "");
  const id = itemId ? `/${itemId}` : "";
  var newItem =
    !isArray(item) && isObject(item) ? omitBy(item, (v) => isNull(v)) : item;
  var newConfig =
    !isArray(config) && isObject(config)
      ? omitBy(config, (v) => isNull(v))
      : config;
  return axios.put(url + id, newItem, newConfig).then(({ data }) => data);
}

export function deleteItem(api_url, itemId, config) {
  const url = api_url.includes("http")
    ? api_url
    : workFlowUrl + api_url.replace("/GISBusinessAPI", "");
  var newConfig = isObject(config) ? omitBy(config, (v) => isNull(v)) : config;
  return axios.delete(url + "/" + itemId, newConfig).then(({ data }) => data);
}
