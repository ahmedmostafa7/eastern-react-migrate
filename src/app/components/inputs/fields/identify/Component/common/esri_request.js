import { LoadModules } from "./esri_loader";
import { layersSetting } from "../mapviewer/config";
import { queryTask } from "./common_func";
import store from "app/reducers";
const _ = require("lodash");
export const esriRequest = function (url) {
  //  //
  var token = "";

  store.dispatch({ type: "Show_Loading_new", loading: true });

  return LoadModules(["esri/request"]).then(([esriRequest]) => {
    var requestHandler = esriRequest({
      url: url,
      content: { f: "json", token: window.esriToken },
      callbackParamName: "callback",
    });

    return requestHandler.then(
      (data) => {
        store.dispatch({ type: "Show_Loading_new", loading: false });
        return data;
      },
      () => {
        store.dispatch({ type: "Show_Loading_new", loading: false });
        throw "error";
      }
    );
  });
};
// let mapInfo

export const getMapInfo = function (url) {
  //

  return new Promise((resolve, reject) => {
    let out = { layersSetting };
    var token = "";
    if (window.esriToken) token = "?token=" + window.esriToken;
    esriRequest(url + token).then(function (mapInfo) {
      // //
      out.info = {};
      out.info.mapInfo = mapInfo;
      esriRequest(url + "/legend" + token).then(function (legendInfo) {
        out.info.$legends = legendInfo.layers;
        esriRequest(url + "/layers" + token).then(function (layerInfo) {
          out.info.$layers = layerInfo;

          if (url == planMapEditing + "MapServer") {
            var layer = _.find(layerInfo.tables, (d) => {
              return d.name == "Tbl_Parcel_Conditions";
            });
            if (layer && layer.id) {
              queryTask({
                url: url + "/" + layer.id,
                where: "",
                outFields: ["*"],
                callbackResult: (result) => {
                  out.info.buildingCondition = result.features;
                  window.mapInfo = out;
                  resolve(out);
                },
                callbackError: () => {
                  out.info.buildingCondition = [];
                  window.mapInfo = out;
                  resolve(out);
                },
              });
            } else {
              out.info.buildingCondition = [];
              window.mapInfo = out;
              resolve(out);
            }
          } else {
            out.info.buildingCondition = [];
            window.mapInfo = out;
            resolve(out);
          }

          out.info.$layers.layers = out.info.$layers.layers.map(
            (layer, key) => {
              if (
                out.layersSetting[layer.name] &&
                out.layersSetting[layer.name].order
              )
                layer.viewerOrder = out.layersSetting[layer.name].order;
              layer.alias = out.info.$layers.layers[key].name;
              return layer;
            }
          );

          let visibiles = [];
          out.info.$legends = out.info.$legends.map((layer, key) => {
            layer.visible = out.info.$layers.layers[key].defaultVisibility;
            if (
              out.layersSetting[layer.name] &&
              out.layersSetting[layer.layerName].order
            )
              layer.viewerOrder = out.layersSetting[layer.layerName].order;
            // //

            if (layer.visible) {
              visibiles.push(layer.layerId);
            }

            layer.isHidden =
              out.layersSetting[layer.layerName] &&
              out.layersSetting[layer.layerName].isHidden;
            layer.alias = out.info.$layers.layers[key].name;
            return layer;
          });

          out.mapVisibleLayerIDs = visibiles;
          mapInfo = out;
        });
      });
    });
  });
};
