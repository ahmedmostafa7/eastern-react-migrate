import React from "react";
import { esriRequest, getMapInfo } from "./esri_request";
import { Carousel } from "react-carousel-minimal";
import {
  mapUrl,
  geometryServiceUrl,
  addedParcelMapServiceUrl,
  investMapUrl,
} from "../mapviewer/config/map";
import {
  find,
  map,
  isEmpty,
  isBoolean,
  cloneDeep,
  get,
  isNumber,
} from "lodash";
import { LoadModules } from "./esri_loader";
import {
  editAndDeleteMapLayers,
  layersSetting,
} from "../mapviewer/config/layers";
import Axios, { post } from "axios";
import { workFlowUrl, filesHost, backEndUrlforMap } from "imports/config";
import { useQuery } from "react-query";
import * as turf from "@turf/turf";
import store from "app/reducers";
import {
  getMap,
  getIsMapLoaded,
  setIsMapLoaded,
} from "main_helpers/functions/filters/state";
import moment from "moment-hijri";
import { message } from "antd";
import { lineString } from "@turf/turf";

import groupByLodash from "lodash/groupBy";
import { checkDate } from "../../../../../../helpers/validations/general";
import { setMap } from "main_helpers/functions/filters/state";
import { getSubmissionHistory } from "main_helpers/functions/submission_history";
import axios from "axios";
import applyFilters from "main_helpers/functions/filters";
var XLSX = require("xlsx");
window.lzString = require("lz-string");
window.pako = require("pako");

const _ = require("lodash");
window.Domains = [];
window.loadings = [];
window.loadedLayers = [];
LoadModules([
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",
  "esri/geometry/mathUtils",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/graphic",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/Color",
]).then(
  ([
    Point,
    Polyline,
    Polygon,
    mathUtils,
    PictureMarkerSymbol,
    SimpleMarkerSymbol,
    Graphic,
    SimpleFillSymbol,
    SimpleLineSymbol,
    Color,
  ]) => {
    window.Point = Point;
    window.Polyline = Polyline;
    window.Polygon = Polygon;
    window.mathUtils = mathUtils;
    window.PictureMarkerSymbol = PictureMarkerSymbol;
    window.SimpleMarkerSymbol = SimpleMarkerSymbol;
    window.Graphic = Graphic;
    window.SimpleFillSymbol = SimpleFillSymbol;
    window.SimpleLineSymbol = SimpleLineSymbol;
    window.Color = Color;
  }
);
LoadModules([
  "esri/tasks/query",
  "esri/tasks/StatisticDefinition",
  "esri/tasks/QueryTask",
  "dojo/promise/all",
  "esri/geometry/geometryEngine",
  "esri/tasks/Geoprocessor",
  "esri/toolbars/edit",
  "esri/toolbars/draw",
  "esri/geometry/webMercatorUtils",
  "esri/tasks/ProjectParameters",
  "esri/layers/WebTiledLayer",
]).then(
  ([
    Query,
    StatisticDefinition,
    QueryTask,
    all,
    geometryEngine,
    Geoprocessor,
    Edit,
    Draw,
    webMercatorUtils,
    ProjectParameters,
    WebTiledLayer,
  ]) => {
    window.Query = Query;
    window.StatisticDefinition = StatisticDefinition;
    window.QueryTask = QueryTask;
    window.promiseAll = all;
    window.geometryEngine = geometryEngine;
    window.Geoprocessor = Geoprocessor;
    window.Edit = Edit;
    window.Draw = Draw;
    window.webMercatorUtils = webMercatorUtils;
    window.ProjectParameters = ProjectParameters;
    window.WebTiledLayer = WebTiledLayer;
  }
);

export const decoder = (base64url) => {
  let compressedData = Uint8Array.from(atob(base64url), (c) => c.charCodeAt(0));
  let decompressedData = pako.inflate(compressedData, {
    to: "string",
  });
  return JSON.parse(decompressedData);
};

export const CreateCustomTileLayer = () => {
  return window.WebTiledLayer.createSubclass({
    properties: {
      urlTemplate: null,
      id: null,
      tint: {
        value: null,
        type: Color,
      },
    },

    // generate the tile url for a given level, row and column
    getTileUrl: function (level, row, col) {
      return this.urlTemplate
        .replace("{z}", level)
        .replace("{x}", col)
        .replace("{y}", row);
    },
    // This method fetches tiles for the specified level and size.
    // Override this method to process the data returned from the server.
    fetchTile: function (level, row, col, options) {
      // call getTileUrl() method to construct the URL to tiles
      // for a given level, row and col provided by the LayerView
      const url = this.getTileUrl(level, row, col);

      // request for tiles based on the generated url
      // the signal option ensures that obsolete requests are aborted
      return esriRequest(url, {
        responseType: "image",
        signal: options && options.signal,
      }).then(
        function (response) {
          // when esri request resolves successfully
          // get the image from the response
          const image = response.data;
          const width = this.tileInfo.size[0];
          const height = this.tileInfo.size[0];

          // create a canvas with 2D rendering context
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;

          // Apply the tint color provided by
          // by the application to the canvas
          if (this.tint) {
            // Get a CSS color string in rgba form
            // representing the tint Color instance.
            context.fillStyle = this.tint.toCss();
            context.fillRect(0, 0, width, height);

            // Applies "difference" blending operation between canvas
            // and steman tiles. Difference blending operation subtracts
            // the bottom layer (canvas) from the top layer (tiles) or the
            // other way round to always get a positive value.
            context.globalCompositeOperation = "difference";
          }

          // Draw the blended image onto the canvas.
          context.drawImage(image, 0, 0, width, height);

          return canvas;
        }.bind(this)
      );
    },
  });
};

export const resetMapData = (map) => {
  if (map?.graphicsLayerIds) {
    map.graphicsLayerIds.forEach(
      function (layerName, index) {
        clearGraphicFromLayer(map, layerName);
      }.bind(this)
    );
  }

  if (map?.spatialReference?.wkid == 32639) {
    map?.setExtent(
      new esri.geometry.Extent({
        xmin: 351074.79384063353,
        ymin: 2908411.351837893,
        xmax: 461736.99433170113,
        ymax: 2947768.2013849253,
        spatialReference: {
          wkid: 32639,
        },
      })
    );
  } else {
    //this.map.setBasemap("satellite");
    map?.setExtent(
      new esri.geometry.Extent({
        xmin: 5565121.73626563,
        ymin: 3047018.8544949857,
        xmax: 5581608.618197727,
        ymax: 3054625.640541891,
        spatialReference: {
          wkid: 102100,
        },
      })
    );
  }
};

export const querySetting = (num, where, geo, outfields, url) => {
  return {
    url: (url || mapUrl) + "/" + num,
    where,
    returnGeometry: geo,
    outFields: outfields,
  };
};

export const validation = async (item, props) => {
  const { t } = props;
  // return new Promise(async (resolve, reject) => {
  try {
    let data = await axios.post(
      host +
        "/IsHasSubmission/" +
        item.attributes.PARCEL_SPATIAL_ID +
        "/" +
        (props.currentModule.record.id || 0),
      {
        PARCEL_PLAN_NO: item.attributes.PARCEL_PLAN_NO,
        PARCEL_BLOCK_NO: item.attributes.PARCEL_BLOCK_NO,
        PLAN_NO: item.attributes.PLAN_NO,
        municipilty_code:
          item.attributes.MUNICIPALITY_NAME_Code ||
          item.attributes.MUNICIPALITY_NAME?.code ||
          item.attributes.MUNICIPALITY_NAME,
      }
    );

    if (data.status == 204 || item.attributes.IS_EDITED_Code != 1) {
      return true;
    } else {
      window.notifySystem("warning", t("messages:global.PARCELSWARNING"));
      return false;
    }
  } catch (err) {
    window.notifySystem(
      "warning",
      t(
        `messages:${
          err.msg ||
          (err && err.response && err.response.data && err.response.data.msg)
        }`
      )
    );
    return false;
  }
  //});
};

export const validationList = async (items, props) => {
  const { t } = props;
  let promises = [];
  return new Promise(async (resolve, reject) => {
    items.forEach((item) => {
      promises.push(
        axios.post(
          host +
            "/IsHasSubmission/" +
            item.attributes.PARCEL_SPATIAL_ID +
            "/" +
            (props.currentModule.record.id || 0),
          {
            PARCEL_PLAN_NO: item.attributes.PARCEL_PLAN_NO,
            PARCEL_BLOCK_NO: item.attributes.PARCEL_BLOCK_NO,
            PLAN_NO: item.attributes.PLAN_NO,
            municipilty_code:
              item.attributes.MUNICIPALITY_NAME_Code ||
              item.attributes.MUNICIPALITY_NAME?.code ||
              item.attributes.MUNICIPALITY_NAME,
          }
        )
      );
    });

    try {
      let responses = await Promise.all(promises);

      let data;
      for (let key in responses) {
        data = responses[key];
        if (data.status == 204 || item.attributes.IS_EDITED_Code != 1) {
          return resolve(true);
        } else {
          window.notifySystem("warning", t("messages:global.PARCELSWARNING"));
          return resolve(false);
        }
      }
    } catch (err) {
      window.notifySystem(
        "warning",
        t(
          `messages:${
            err.msg ||
            (err && err.response && err.response.data && err.response.data.msg)
          }`
        )
      );
      return resolve(false);
    }
  });
};

export const validationWithoutPromise = async (item, props) => {
  const { t } = props;
  let data = await axios.post(
    host +
      "/IsHasSubmission/" +
      item.attributes.PARCEL_SPATIAL_ID +
      "/" +
      (props.currentModule.record.id || 0),
    {
      PARCEL_PLAN_NO: item.attributes.PARCEL_PLAN_NO,
      PARCEL_BLOCK_NO: item.attributes.PARCEL_BLOCK_NO,
      PLAN_NO: item.attributes.PLAN_NO,
      municipilty_code:
        item.attributes.MUNICIPALITY_NAME_Code ||
        item.attributes.MUNICIPALITY_NAME?.code ||
        item.attributes.MUNICIPALITY_NAME,
    }
  );

  if (data.status == 204 || item.attributes.IS_EDITED_Code != 1) {
    return true;
  } else {
    window.notifySystem("warning", t("messages:global.PARCELSWARNING"));
    return false;
  }
};

export const updateStatisticParcels = (
  uplodedFeatures,
  planDetails,
  mainObject
) => {
  //statistics استعمالات
  let statisticsParcels = [];
  var pacrelTypes = _.chain(uplodedFeatures?.shapeFeatures?.landbase)
    ?.sortBy(
      function (d) {
        var found = _.find(planDetails.servicesTypes, function (v) {
          return v.symbol_id == d.typeId;
        });
        return found && found.sort_id ? found.sort_id : 100;
      }.bind(this)
    )
    ?.groupBy("typeName");

  planDetails.detailsParcelTypes = pacrelTypes
    ?.map(function (list, key) {
      return {
        key: key,
        usingTypeArea: _.reduce(
          list,
          function (memo, d) {
            return memo + +d.area;
          },
          0
        ),
        value: _.chain(list)
          .groupBy(function (d) {
            return d.subType && d.subType.sublayer_code;
          })
          .map(function (list, key) {
            return {
              key: key,
              value: list,
              total_area: _.reduce(
                list,
                function (memo, d) {
                  return memo + +d.area;
                },
                0
              ),
            };
          })
          .value(),
      };
    })
    ?.value();
  pacrelTypes = pacrelTypes?.value();
  var msa7y_area = _.chain(
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
  )
    ?.reduce(function (a, b) {
      return a + +b.area;
    }, 0)
    ?.value();
  Object.keys(pacrelTypes)?.forEach(
    function (parcelTypeKey) {
      var area = pacrelTypes[parcelTypeKey]
        .map(function (p) {
          return p.area;
        })
        .reduce(function (a, b) {
          return a + b;
        });

      statisticsParcels.push({
        name: parcelTypeKey,
        area: area,
        is_cut: pacrelTypes[parcelTypeKey][0].is_cut,
        is_notfees: pacrelTypes[parcelTypeKey][0].is_notfees,
        areaPercentage:
          (area /
            ((mainObject.submission_data.mostafed_data.e3adt_tanzem &&
              msa7y_area) ||
              planDetails.TotalParcelArea ||
              uplodedFeatures?.shapeFeatures?.landbase?.reduce(
                (a, b) => a + b.area,
                0
              ))) *
          100,
      });
    }.bind(this)
  );
  //

  calculateSchemanticProportions(
    uplodedFeatures,
    statisticsParcels,
    planDetails.TotalParcelArea,
    mainObject
  );
  // statisticsParcels.push({
  //   name: "خدمات",
  //   area: statisticsParcels
  //     .filter(function (st) {
  //       return st.name.indexOf("خدمات") > -1;
  //     })
  //     .reduce(function (a, b) {
  //       return a + +b.area;
  //     }, 0),
  //   areaPercentage: statisticsParcels
  //     .filter(function (st) {
  //       return st.name.indexOf("خدمات") > -1;
  //     })
  //     .reduce(function (a, b) {
  //       return a + +b.areaPercentage;
  //     }, 0),
  // });

  return statisticsParcels;
};

export const toFixed = (num, fixed) => {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
};

export const drawLength_1 = (map, polygons) => {
  var poistions = [];

  if (polygons) {
    clearGraphicFromLayer(map, "editlengthGraphicLayer");

    polygons.forEach(function (polygon) {
      for (var j = 0, n = polygon.geometry.rings[0].length - 1; j < n; j++) {
        var point1 = new esri.geometry.Point(
          polygon.geometry.rings[0][j][0],
          polygon.geometry.rings[0][j][1]
        );
        var point2 = new esri.geometry.Point(
          polygon.geometry.rings[0][j + 1][0],
          polygon.geometry.rings[0][j + 1][1]
        );

        var length = esri.geometry.getLength(point1, point2);
        length = Number(parseFloat(length).toFixed(2));
        var path = {
          paths: [
            [polygon.geometry.rings[0][j], polygon.geometry.rings[0][j + 1]],
          ],
          text: length,
          spatialReference: polygon.geometry.spatialReference,
        };

        var polyline = new esri.geometry.Polyline(path);
        var pt = polyline.getExtent().getCenter();

        if (
          !(poistions.indexOf(pt.x.toFixed(4) + "," + pt.y.toFixed(4)) > -1)
        ) {
          poistions.push(pt.x.toFixed(4) + "," + pt.y.toFixed(4));

          var attr = {
            text: (+length).toFixed(2),
            angle: getPacrelNoAngle(polygon),
          };
          addParcelNo(
            pt,
            map,
            "" + (+length).toFixed(2) + "",
            "editlengthGraphicLayer",
            20,
            null,
            getPacrelNoAngle(polygon),
            null,
            attr
          );
        }
      }
    });
  }
};

export const calculateSchemanticProportions = (
  uplodedFeatures,
  statisticsParcels,
  TotalParcelArea,
  mainObject
) => {
  var msa7y_area = _.chain(
    mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
  )
    ?.reduce(function (a, b) {
      return a + +b.area;
    }, 0)
    ?.value();

  var cutAreaIsCut =
    _.chain(uplodedFeatures?.shapeFeatures?.landbase)
      ?.filter((parcel) => {
        return parcel.is_cut && parcel.is_cut != 2;
      })
      ?.reduce((a, b) => {
        return a + +b.area;
      }, 0)
      ?.value() +
    (_.chain(statisticsParcels)
      ?.filter((parcel) => parcel.isInvestalIncluded == true)
      ?.reduce((a, b) => {
        return a + +b.area;
      }, 0)
      ?.value() || 0);

  var totalLandbasesArea = _.chain(uplodedFeatures?.shapeFeatures?.landbase)
    ?.reduce((a, b) => {
      return a + +b.area;
    }, 0)
    ?.value();

  var newCutArea = mainObject?.submission_data?.mostafed_data?.e3adt_tanzem
    ? msa7y_area - (totalLandbasesArea - cutAreaIsCut)
    : cutAreaIsCut;

  let nesabIndex = statisticsParcels?.findIndex(
    (parcel) => parcel.name == "النسب التخطيطية"
  );
  let nesabObj = {
    name: "النسب التخطيطية",
    area: newCutArea,
    areaPercentage:
      (newCutArea /
        ((mainObject?.submission_data?.mostafed_data?.e3adt_tanzem &&
          msa7y_area) ||
          TotalParcelArea ||
          uplodedFeatures?.shapeFeatures?.landbase?.reduce(
            (a, b) => a + b.area,
            0
          ))) *
      100,
  };
  if (nesabIndex == -1) {
    statisticsParcels.push(nesabObj);
  } else {
    statisticsParcels[nesabIndex] = nesabObj;
  }
};

export const getAngle = (cx, cy, ex, ey) => {
  var dy = ey - cy;
  var dx = ex - cx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  return -theta;
};
export const angle360 = (cx, cy, ex, ey) => {
  var theta = getAngle(cx, cy, ex, ey); // range (-180, 180]
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
};

export const drawLength = (map, polygons, isParallelWithLines) => {
  var poistions = [];

  if (polygons) {
    clearGraphicFromLayer(map, "editlengthGraphicLayer");

    var arcLines = [];
    polygons.forEach(function (polygon) {
      for (var j = 0, n = polygon.geometry.rings[0].length - 1; j < n; j++) {
        var point1 = new esri.geometry.Point(
          polygon.geometry.rings[0][j][0],
          polygon.geometry.rings[0][j][1]
        );
        var point2 = new esri.geometry.Point(
          polygon.geometry.rings[0][j + 1][0],
          polygon.geometry.rings[0][j + 1][1]
        );

        var length = esri.geometry.getLength(point1, point2);
        length = Number(parseFloat(length).toFixed(2));

        var path = {
          paths: [
            [polygon.geometry.rings[0][j], polygon.geometry.rings[0][j + 1]],
          ],
          text: length,
          spatialReference: polygon.geometry.spatialReference,
        };

        if (length < 10) {
          var polyline = new esri.geometry.Polyline(path);
          arcLines.push(polyline);
        } else {
          if (arcLines.length > 0) {
            var arcLength = 0;
            arcLines.forEach(function (arcLine) {
              arcLength += Number(arcLine.text);
            });

            path.text = arcLength;

            var pt = arcLines[Math.floor(arcLines.length / 2)]
              .getExtent()
              .getCenter();

            var attr = {
              text: (+path.text).toFixed(2),
              angle: getPacrelNoAngle(polygon),
            };
            addParcelNo(
              pt,
              map,
              "" + (+path.text).toFixed(2) + "",
              "editlengthGraphicLayer",
              20,
              null,
              getPacrelNoAngle(polygon),
              null,
              attr
            );

            arcLines = [];
          }

          var polyline = new esri.geometry.Polyline(path);
          var pt = polyline.getExtent().getCenter();

          if (
            !(poistions.indexOf(pt.x.toFixed(4) + "," + pt.y.toFixed(4)) > -1)
          ) {
            poistions.push(pt.x.toFixed(4) + "," + pt.y.toFixed(4));

            let angle = getPacrelNoAngle(polygon);

            if (isParallelWithLines) {
              angle = getAngle(
                polyline.paths[0][0][0],
                polyline.paths[0][0][1],
                polyline.paths[0][polyline.paths[0].length - 1][0],
                polyline.paths[0][polyline.paths[0].length - 1][1]
              );
            }

            var attr = {
              text: (+length).toFixed(2),
              angle: angle,
            };
            addParcelNo(
              pt,
              map,
              "" + (+length).toFixed(2) + "",
              "editlengthGraphicLayer",
              20,
              null,
              angle,
              null,
              attr
            );
          }
        }
      }

      if (arcLines.length > 0) {
        var arcLength = 0;
        arcLines.forEach(function (arcLine) {
          arcLength += Number(arcLine.text);
        });

        path.text = arcLength;

        var polyline = new esri.geometry.Polyline(path);
        var pt = arcLines[Math.floor(arcLines.length / 2)]
          .getExtent()
          .getCenter();

        if (
          !(poistions.indexOf(pt.x.toFixed(4) + "," + pt.y.toFixed(4)) > -1)
        ) {
          let angle = getPacrelNoAngle(polygon);

          if (isParallelWithLines) {
            angle = getAngle(
              polyline.paths[0][0][0],
              polyline.paths[0][0][1],
              polyline.paths[0][polyline.paths[0].length - 1][0],
              polyline.paths[0][polyline.paths[0].length - 1][1]
            );
          }
          poistions.push(pt.x.toFixed(4) + "," + pt.y.toFixed(4));
          var attr = {
            text: (+path.text).toFixed(2),
            angle: angle,
          };

          addParcelNo(
            pt,
            map,
            "" + (+path.text).toFixed(2) + "",
            "editlengthGraphicLayer",
            20,
            null,
            angle,
            null,
            attr
          );
        }

        arcLines = [];
      }
    });
  }
};

export const drawLength_Lines = (map, lines) => {
  var poistions = [];

  if (lines) {
    clearGraphicFromLayer(map, "editlengthGraphicLayer");

    var arcLines = [];
    lines.forEach(function (line) {
      for (var j = 0, n = line.geometry.paths[0].length - 1; j < n; j++) {
        var point1 = new esri.geometry.Point(
          line.geometry.paths[0][j][0],
          line.geometry.paths[0][j][1]
        );
        var point2 = new esri.geometry.Point(
          line.geometry.paths[0][j + 1][0],
          line.geometry.paths[0][j + 1][1]
        );

        var length = esri.geometry.getLength(point1, point2);
        length = Number(parseFloat(length).toFixed(2));

        var path = {
          paths: [[line.geometry.paths[0][j], line.geometry.paths[0][j + 1]]],
          text: length,
          spatialReference: line.geometry.spatialReference,
        };

        if (length < 10) {
          var polyline = new esri.geometry.Polyline(path);
          arcLines.push(polyline);
        } else {
          if (arcLines.length > 0) {
            var arcLength = 0;
            arcLines.forEach(function (arcLine) {
              arcLength += Number(arcLine.text);
            });

            path.text = arcLength;

            var pt = arcLines[Math.floor(arcLines.length / 2)]
              .getExtent()
              .getCenter();

            var attr = {
              text: (+path.text).toFixed(2),
              angle: 10,
            };
            addParcelNo(
              pt,
              map,
              "" + (+path.text).toFixed(2) + "",
              "editlengthGraphicLayer",
              20,
              null,
              10,
              null,
              attr
            );

            arcLines = [];
          }

          var polyline = new esri.geometry.Polyline(path);
          var pt = polyline.getExtent().getCenter();

          if (
            !(poistions.indexOf(pt.x.toFixed(4) + "," + pt.y.toFixed(4)) > -1)
          ) {
            poistions.push(pt.x.toFixed(4) + "," + pt.y.toFixed(4));

            var attr = {
              text: (+length).toFixed(2),
              angle: 10,
            };
            addParcelNo(
              pt,
              map,
              "" + (+length).toFixed(2) + "",
              "editlengthGraphicLayer",
              20,
              null,
              10,
              null,
              attr
            );
          }
        }
      }

      if (arcLines.length > 0) {
        var arcLength = 0;
        arcLines.forEach(function (arcLine) {
          arcLength += Number(arcLine.text);
        });

        path.text = arcLength;

        var polyline = new esri.geometry.Polyline(path);
        var pt = arcLines[Math.floor(arcLines.length / 2)]
          .getExtent()
          .getCenter();

        if (
          !(poistions.indexOf(pt.x.toFixed(4) + "," + pt.y.toFixed(4)) > -1)
        ) {
          poistions.push(pt.x.toFixed(4) + "," + pt.y.toFixed(4));
          var attr = {
            text: (+path.text).toFixed(2),
            angle: 10,
          };

          addParcelNo(
            pt,
            map,
            "" + (+path.text).toFixed(2) + "",
            "editlengthGraphicLayer",
            20,
            null,
            10,
            null,
            attr
          );
        }

        arcLines = [];
      }
    });
  }
};
export const getPacrelNoAngle = (parcel) => {
  var xMin;
  var xMax = 0;
  var yMin;
  var yMax = 0;

  parcel.geometry.rings[0].forEach((point) => {
    if (point[0] > xMax) xMax = point[0];

    if (!xMin || point[0] < xMin) xMin = point[0];

    if (point[1] > yMax) yMax = point[1];

    if (!yMin || point[1] < yMin) yMin = point[1];
  });

  return yMax - yMin > xMax - xMin ? 60 : -15;
};

export const getInfo = function (mapServiceUrl) {
  return esriRequest(mapServiceUrl || mapUrl).then((res) => {
    var temp = {};
    res.layers.forEach((l) => (temp[l.name] = l.id));
    res.tables.forEach((l) => (temp[l.name] = l.id));
    return temp;
  });
};

export const getMunicipalityById = function (id) {
  return new Promise((resolve, reject) => {
    esriRequest(`${mapUrl}/9`).then((res) => {
      let mun = res?.types[0]?.domains?.MUNICIPALITY_NAME?.codedValues?.find(
        (mun) => mun.code == id
      );
      return resolve(mun?.name || "بدون");
    });
  });
};

export const reformatNumLetters = (text, unit) => {
  return text
    .split("فاصل")
    .filter(
      (subText) => subText.indexOf("صفر") == -1 && !isEmpty(subText?.trim())
    )
    .map((subText, index) => {
      if (index == 0) {
        return `${subText} ${unit}`;
      }
      return (
        (unit?.indexOf("متر") != -1 && `${subText} سنتي${unit}`) ||
        (unit?.indexOf("ريال") != -1 && `${subText} هللة`)
      );
    })
    .join(" و ");
};

export const checkCommentsAvailability = (data, submission) => {
  if (data.summery) {
    delete data.summery;
  }
  if (Object.keys(data.comments || {}).length > 0) {
    Object.keys(data.comments).forEach((commentsKey, index) => {
      //
      if (Array.isArray(data.comments[commentsKey])) {
        data.comments[commentsKey] = data.comments[commentsKey].filter(
          (comment) =>
            comment && comment.comment != undefined && comment.comment != null
        );
        if (data.comments[commentsKey].length) {
          data.comments[commentsKey].forEach((comment, index) => {
            if (comment != null) {
              comment.is_disabled =
                (comment.reply && comment.reply_text) || !submission.is_returned
                  ? // ||
                    // submission?.CurrentStep?.id != comment?.commentStep?.stepId
                    true
                  : false;
            }
          });
        } else {
          delete data.comments[commentsKey];
        }
      } else {
        if (data.comments[commentsKey].comment) {
          console.log(`comment 1`, data.comments[commentsKey]);
          data.comments[commentsKey].is_disabled =
            (data.comments[commentsKey].reply &&
              data.comments[commentsKey].reply_text) ||
            !submission.is_returned
              ? // ||
                // submission?.CurrentStep?.id != comments?.commentStep?.stepId
                true
              : false;
        } else {
          delete data.comments[commentsKey];
        }
      }
    });
  }
};

export const apps = [
  { appId: 1, name: "الفرز الإلكتروني" },
  { appId: 8, name: "اصدار الكروكي المساحي" },
  { appId: 14, name: "تحديث الصكوك" },
  { appId: 16, name: "اعتماد المخططات" },
  { appId: 19, name: "تراخيص المشاريع الخدمية" },
  { appId: 22, name: "شراء الزوائد التنظيمية" },
  { appId: 23, name: "استمارة تملك عقار" },
  { appId: 21, name: "ضم الشوارع والنوافذ" },
  { appId: 26, name: "طرح المواقع الإستثمارية" },
  { appId: 15, name: "خارطة الأساس" },
  { appId: 25, name: "تخصيص الأراضي" },
  { appId: 27, name: "فحص الملكية" },
];

export const ids = {
  1440: 1,
  1445: 2,
  1450: 3,
  "حد التنمية": 4,
};

export const getUrbans = (props) => {
  if (props) {
    return _.uniqBy(
      _.map(
        // _.filter(
        //   props.mainObject.data_msa7y.msa7yData.cadDetails.isWithinUrbanBoundry,
        //   function (d, index) {
        //     return d.attributes.REMARKS != "حد التنمية";
        //   }
        // ),
        props.mainObject.data_msa7y.msa7yData.cadDetails.isWithinUrbanBoundry,
        function (d, index) {
          return {
            name: d.attributes.REMARKS,
            code: ids[d.attributes.REMARKS],
          };
        }
      ),
      (value) => value.name && value.code
    );
  }
};

export let print_name = "";
export let signature_type = "";
export const selectActors = (submissionData, mainObject, userIndexes) => {
  let users = [];
  if (!submissionData) return users;
  let print_state = submissionData?.workflows?.print_state;
  print_name =
    (location.hash.indexOf("?tk=") == -1 &&
      location.hash.indexOf("#/wizard") == -1 &&
      location.hash.split("/")[
        location.hash.indexOf(
          (print_state?.startsWith("#") ? "/" : "") + print_state
        ) != -1 || location.hash.indexOf(print_state) != -1
          ? (location.hash?.startsWith("#") && 1) || 2
          : 1
      ]) ||
    (
      (print_state.startsWith("/#/") && print_state) ||
      print_state.replace("#", "/#/").replace("//", "/")
    )?.split("/")?.[2] ||
    "";
  signature_type = "";
  if ([2768, 3105].indexOf(submissionData?.CurrentStep.id) != -1) {
    signature_type = "lagna_signatures";
  } else if ([2900, 3125, 2922].indexOf(submissionData?.CurrentStep.id) != -1) {
    signature_type = "main_signatures";
  }
  if (
    !submissionData?.committees?.committee_actors?.length &&
    print_name.indexOf("a0_plan_approval") != -1 &&
    signature_type &&
    mainObject?.print_signature &&
    mainObject?.print_signature[print_name] &&
    mainObject?.print_signature[print_name][signature_type]?.signatures?.length
  ) {
    userIndexes.forEach((userIndex) => {
      let signature = mainObject?.print_signature[print_name][
        signature_type
      ]?.signatures
        ?.filter((r) => !r.is_automatic)
        ?.find((sign) => sign.sign_order == userIndex + 1);

      //mainObject?.print_signature[print_name]?.signatures.forEach((signature) => {
      if (signature) {
        let signature_hist = (
          submissionData?.signatures_history ||
          mainObject?.print_signature[print_name][signature_type]
            .signatures_history ||
          []
        )
          ?.filter((r) => !r.is_automatic)
          ?.find(
            (signature_hist) => signature_hist?.user_id == signature?.user_id
          );
        users.splice(
          users.length,
          0,
          ((signature.is_automatic ||
            (signature.is_manual && signature_hist)) && {
            id: signature?.user?.id || 0,
            name:
              (signature?.user?.name.indexOf("المهندس") != -1 &&
                signature?.user?.name
                  .replaceAll("المهندس /", "")
                  .replaceAll("المهندس/", "")) ||
              signature?.user?.name,
            user:
              (signature?.user && copyUser({ user: signature?.user })) || null,
            position: signature?.title || "",
            is_approved: true,
            index: (signature?.sign_order || 0) - 1,
          }) || {
            id: signature?.user?.id || 0,
            name:
              (signature?.user?.name.indexOf("المهندس") != -1 &&
                signature?.user?.name
                  .replaceAll("المهندس /", "")
                  .replaceAll("المهندس/", "")) ||
              signature?.user?.name,
            user:
              (signature?.user && copyUser({ user: signature?.user })) || null,
            position: signature?.title || "",
            is_approved: false,
            index: (signature?.sign_order || 0) - 1,
          }
        );
      }
    });
  } else if (
    !submissionData?.committees?.committee_actors?.length &&
    mainObject?.print_signature &&
    mainObject?.print_signature[print_name]?.signatures?.length &&
    print_name.indexOf("a0_plan_approval") == -1
  ) {
    userIndexes.forEach((userIndex) => {
      let signature = mainObject?.print_signature[print_name]?.signatures
        ?.filter((r) => !r.is_automatic)
        ?.find((sign) => sign.sign_order == userIndex + 1);

      //mainObject?.print_signature[print_name]?.signatures.forEach((signature) => {
      if (signature) {
        let signature_hist = (
          submissionData?.signatures_history ||
          mainObject?.print_signature[print_name].signatures_history ||
          []
        )
          ?.filter((r) => !r.is_automatic)
          ?.find(
            (signature_hist) => signature_hist?.user_id == signature?.user_id
          );
        users.splice(
          users.length,
          0,
          ((signature.is_automatic ||
            (signature.is_manual && signature_hist)) && {
            id: signature?.user?.id || 0,
            name:
              (signature?.user?.name.indexOf("المهندس") != -1 &&
                signature?.user?.name
                  .replaceAll("المهندس /", "")
                  .replaceAll("المهندس/", "")) ||
              signature?.user?.name,
            user:
              (signature?.user && copyUser({ user: signature?.user })) || null,
            position: signature?.title || "",
            is_approved: true,
            index: (signature?.sign_order || 0) - 1,
          }) || {
            id: signature?.user?.id || 0,
            name:
              (signature?.user?.name.indexOf("المهندس") != -1 &&
                signature?.user?.name
                  .replaceAll("المهندس /", "")
                  .replaceAll("المهندس/", "")) ||
              signature?.user?.name,
            user:
              (signature?.user && copyUser({ user: signature?.user })) || null,
            position: signature?.title || "",
            is_approved: false,
            index: (signature?.sign_order || 0) - 1,
          }
        );
      }
    });
  } else {
    userIndexes.forEach((userIndex) => {
      let signature = submissionData?.committees?.committee_actors?.find(
        (sign) => sign.sign_order == userIndex + 1
      );
      users.splice(users.length, 0, {
        id: signature?.users?.id || 0,
        name:
          (signature?.users?.name.indexOf("المهندس /") != -1 &&
            signature?.users?.name.replaceAll("المهندس /", "")) ||
          signature?.users?.name ||
          "",
        user:
          (signature?.users && copyUser({ user: signature?.users })) || null,
        position: signature?.position_name || "",
        is_approved: true,
        index: (signature?.sign_order || 0) - 1,
      });
    });
  }

  (
    (mainObject?.print_signature[print_name] &&
      (mainObject?.print_signature[print_name]?.signatures ||
        mainObject?.print_signature[print_name][signature_type]?.signatures)) ||
    submissionData?.CurrentStep?.signatures ||
    []
  )
    ?.filter((r) => r.is_automatic)
    .forEach((signature) => {
      users[(signature?.sign_order || 0) - 1] = {
        id: signature?.user?.id || 0,
        name:
          (signature?.user?.name.indexOf("المهندس") != -1 &&
            signature?.user?.name
              .replaceAll("المهندس /", "")
              .replaceAll("المهندس/", "")) ||
          signature?.user?.name,
        user: (signature?.user && copyUser({ user: signature?.user })) || null,
        position: signature?.title || "",
        is_approved: true,
        index: (signature?.sign_order || 0) - 1,
      };
    });

  return users?.filter((user) => user != null && user?.id != 0) || [];
};

export const reformatDateTime = (data, key) => {
  let originalDateTime = get(data, key)?.replaceAll("undefined", "") || "";
  if (key == "date" && originalDateTime) {
    if (originalDateTime.indexOf("T") == -1) {
      originalDateTime = originalDateTime?.split(" ")?.reduce((d, r) => {
        return d + ((["PM", "AM"].indexOf(r) == -1 && d && "-" + r) || " " + r);
      }, "");
    } else {
      originalDateTime = moment(new Date(originalDateTime))
        ?.format("iD/iM/iYYYY hh:mm:ss a")
        ?.split(" ")
        ?.reduce((d, r) => {
          return (
            d +
            ((["PM", "AM", "pm", "am"].indexOf(r) == -1 && d && "-" + r) ||
              " " + r)
          );
        }, "");
    }

    let datetime = localizeNumber(originalDateTime)
      ?.replace("AM", "ص")
      ?.replace("PM", "م")
      ?.replace("am", "ص")
      ?.replace("pm", "م");

    let time;
    if (data.time) {
      time = moment(new Date(data.date + " " + (data.time || "")))
        .format("hh:mm:ss a")
        ?.replace("AM", "ص")
        ?.replace("PM", "م")
        ?.replace("am", "ص")
        ?.replace("pm", "م");
    }
    //
    return (
      <>
        <span>
          {(datetime
            ?.split("-")?.[0]
            ?.replaceAll("undefined", "")
            .split("/")[0]
            .trim().length == 4 &&
            localizeNumber(
              originalDateTime
                ?.replaceAll("undefined", "")
                ?.split("-")[0]
                .trim()
                .split("/")
                .reverse()
                .join(" / ")
            )) ||
            datetime?.split("-")?.[0]?.replaceAll("undefined", "")}
        </span>
        <span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>
          {datetime?.split("-")?.[1]?.replaceAll("undefined", "") ||
            localizeNumber(time)?.replaceAll("undefined", "") ||
            ""}
        </span>
      </>
    );
  }

  return <span></span>;
};

export const plan_classes = [
  {
    id: 1,
    name: "", //"فقرة أ",
    f: function (d) {
      return d >= 500000;
    },
  },
  {
    id: 2,
    name: "فقرة ب",
    f: function (d) {
      return d < 500000 && d >= 40000;
    },
    // name: "إفراغ كلي",
  },
  {
    id: 3,
    name: "فقرة ب",
    f: function (d) {
      return d < 500000 && d >= 40000;
    },
    // name: "إفراغ جزئي",
  },
  {
    id: 4,
    name: "فقرة ج",
    f: function (d) {
      return d < 40000 && d >= 10000;
    },
  },
  {
    id: 5,
    name: "فقرة د",
    f: function (d) {
      return d < 10000;
    },
  },
];

export const computeStreetAngle = (pointA, pointB, cetroid) => {
  var dy = pointA[1] - pointB[1];
  var dx = pointA[0] - pointB[0];
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  return theta;
};

// تمسح جرافيك عن طريق الاسم
export const clearGraphicFromMap = function (map, name) {
  // //
  map?.graphics.graphics.forEach(function (graphic) {
    if (graphic.attributes) {
      if (graphic.attributes.name == name) map?.graphics.remove(graphic);
    }
  });
};

export const getLayer = function (layerName, map, index) {
  var layerId = "Layer_" + layerName;

  var editingLayer = map?.getLayer(layerId, map);

  if (!editingLayer) {
    editingLayer = new esri.layers.GraphicsLayer();
    editingLayer.opacity = 1;
    editingLayer.id = layerId;
    if (index) map?.addLayer(editingLayer, index);
    else map?.addLayer(editingLayer);
  }

  return layerId;
};

export const clearGraphicFromLayer = function (map, name) {
  // //
  if (map && map?.getLayer) {
    let graphicLayer = map?.getLayer(name);
    if (graphicLayer) graphicLayer.clear();
  }
};

export const getFieldDomain = function (field, layerId, customMapUrl) {
  return getDomain(layerId, {}, customMapUrl).then((data) => {
    return data;
  });
};

export const getDistrictNameById = (districtId) => {
  return new Promise((resolve, reject) => {
    if (!isNaN(Number(districtId))) {
      esriRequest(`${mapUrl}/4`).then((res) => {
        let district = res?.fields?.[2]?.domain?.codedValues.find(
          (district) => district?.code == districtId
        );

        return resolve(convertToArabic(district?.name || districtId || "بدون"));
      });
    } else {
      return resolve(convertToArabic(districtId));
    }
  });
};

export const getFeatures = (layerId) => {
  return new Promise((resolve, reject) => {
    let token;
    if (window.esriToken) token = "?token=" + window.esriToken;
    var flayer = new esri.layers.FeatureLayer(`${mapUrl}/${layerId}` + token, {
      outFields: ["*"],
    });
    var query = new esri.tasks.Query();
    query.where = "1=1"; // name of the district
    query.returnGeometry = true;
    query.outFields = ["*"];
    flayer.queryFeatures(query, (featureSet) => {
      return resolve(featureSet);
    });
  });
};

export const reformatWasekaData = (props, table_waseka) => {
  let validWaseka = table_waseka
    .filter((item) => {
      return (
        (item.number_waseka != undefined &&
          item.date_waseka != undefined &&
          item.mlkya_type != undefined) ||
        item.contract != undefined
      );
    })
    .map((item) => {
      return (
        (item?.contract?.length && {
          number_waseka: item?.contract[0]?.contract_number,
          date_waseka: item?.contract[0]?.issue_date,
          mlkya_type: item?.contract[0]?.sak_type.id,
          waseka_search: item?.contract[0]?.issuers.name,
          issuer_Id: item?.contract[0]?.issuer_Id,
          image_waseka: item?.contract[0]?.image,
        }) ||
        item
      );
    });

  var resArr = [];
  if (validWaseka) {
    validWaseka = validWaseka
      .map((waseka_item) => {
        return {
          ...waseka_item,
          selectedLands: localizeNumber(
            props.waseka?.waseka?.waseka_data_select?.[0] ||
              props.mainObject?.waseka?.selectedLands?.[0]
          ),
        };
      })
      .forEach((item) => {
        var i = resArr.findIndex((x) => x.number_waseka == item.number_waseka);
        if (i <= -1) {
          resArr.push({ ...item });
        }
      });
  }

  return resArr;
};
export const switchBetweenTadkekMsa7yAndOriginalMsa7y = (mainObject) => {
  let imported_mainObject = checkImportedMainObject({ mainObject });
  return (
    (imported_mainObject && mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData) ||
    mainObject?.data_msa7y?.msa7yData
  );
};
export const selectMainObject = (props) => {
  let imported_mainObject = checkImportedMainObject(props);
  if (imported_mainObject && typeof imported_mainObject == "boolean")
    return props?.mainObject;
  else if (imported_mainObject && typeof imported_mainObject == "object") {
    return imported_mainObject;
  } else {
    return props?.mainObject;
  }
};

export const checkImportedMainObject = (props) => {
  const values = applyFilters({
    key: "FormValues",
    form: "stepForm",
  });

  let imported_mainObject =
    props.mainObject?.update_contract_submission_data
      ?.update_contract_submission_data?.imported_mainObject ||
    values?.[props?.input?.name?.split(".")?.[0]]?.imported_mainObject ||
    props.mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData?.imported_mainObject;

  return imported_mainObject;
};

export const checkRequestNoOfImportedMainObject = (props) => {
  return (
    props.mainObject?.update_contract_submission_data
      ?.update_contract_submission_data ||
    props.mainObject?.tadkek_data_Msa7y?.tadkek_msa7yData
  )?.request_no;
};

export const checkWasekaLands = (props) => {
  let mainObject = props["mainObject"];
  let parcels = get(
    mainObject,
    "landData.landData.lands.parcels",
    get(checkImportedMainObject(props), "landData.landData.lands.parcels", [])
  );
  return parcels.map((d) => ({
    id:
      ([20, 21].indexOf(
        props.currentModule.app_id || props.currentModule.record.app_id
      ) != -1 &&
        ((parcels.filter(
          (land) => land.attributes["PLAN_NO"] == d.attributes["PLAN_NO"]
        ).length == parcels.length &&
          d.attributes["PARCEL_PLAN_NO"]) ||
          d.attributes["PLAN_NO"])) ||
      ([1].indexOf(
        props.currentModule.app_id || props.currentModule.record.app_id
      ) != -1 &&
        d.attributes["PARCEL_SPATIAL_ID"]) ||
      d.attributes["PARCEL_PLAN_NO"],
    name: d.attributes["PARCEL_PLAN_NO"],
  }));
};

export const resizeMap = (map, zoomFactor) => {
  map.resize();
  map.reposition();
  let arr = [];
  let shape;
  let symbol;
  getMapGraphics(map).forEach((item) => {
    arr = [
      ...arr,
      ...item?.graphics?.map((graphic) => {
        if (graphic?.geometry?.paths?.length) {
          shape = new esri.geometry.Polyline(graphic?.geometry);
          symbol = new esri.symbol.SimpleLineSymbol(graphic?.symbol);
        } else if (graphic?.geometry?.rings?.length) {
          shape = new esri.geometry.Polygon(graphic?.geometry);
          symbol = new esri.symbol.SimpleFillSymbol(graphic?.symbol);
        } else if (graphic?.symbol?.type == "esriTS") {
          shape = new esri.geometry.Point(graphic?.geometry);
          symbol = new esri.symbol.TextSymbol(graphic?.symbol);
        }
        // else {
        //   shape = new esri.geometry.Point(graphic?.geometry);
        //   symbol = new esri.symbol.SimpleMarkerSymbol(graphic?.symbol);
        // }

        return new esri.Graphic(shape, symbol, graphic?.attributes);
      }),
    ];
  });

  if (arr.length) {
    var extent = esri.graphicsExtent(arr).getExtent();
    if (zoomFactor) {
      extent.xmin = extent.xmin - zoomFactor;
      extent.ymin = extent.ymin - zoomFactor;
      extent.xmax = extent.xmax + zoomFactor;
      extent.ymax = extent.ymax + zoomFactor;
    }
    extent.spatialReference = map.spatialReference;
    map.setExtent(extent);
  }
};

// maping field with domain
export const getFeatureDomainName = function (
  features,
  layerId,
  notReturnCode,
  customMapUrl
) {
  // //
  return getDomain(layerId, {}, customMapUrl).then(
    function (data) {
      var codedValue = {};
      features.forEach(function (feature) {
        Object.keys(feature.attributes).forEach(function (attr) {
          let result = find(data, { name: attr });
          if (result && result.domain) {
            codedValue = find(result.domain.codedValues, {
              code: feature.attributes[attr],
            });
            if (!codedValue) {
              if (!isNaN(feature.attributes[attr])) {
                codedValue = find(result.domain.codedValues, {
                  code: +feature.attributes[attr],
                });
              }
            }
            if (codedValue && codedValue.name) {
              if (!notReturnCode)
                feature.attributes[attr + "_Code"] = feature.attributes[attr];
              feature.attributes[attr] = codedValue.name;
            }
          }
        });
      });
      return features;
    },
    function (error) {
      return;
    }
  );
};

export const getPolygons = function (autocadResponse, callback) {
  LoadModules([
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/Polygon",
    "esri/geometry/mathUtils",
  ]).then(([Point, Polyline, Polygon, mathUtils]) => {
    var map = getMap();
    var out = { good: [], notified: [] };
    autocadResponse.forEach(function (elem, key) {
      var polygon = {};
      polygon = new Polygon(elem);
      if (!polygon.spatialReference || isEmpty(polygon.spatialReference)) {
        polygon.spatialReference = map?.spatialReference;
      }
      if (callback) {
        callback(
          polygon,
          {
            Point: Point,
            mathUtils: mathUtils,
            Polyline: Polyline,
          },
          elem,
          key
        );
      }
      if (elem.notify) {
        out.notified.push(polygon);
      } else {
        out.good.push(polygon);
      }
    });
  });
};

export const getFieldDomainValue = (attribute, layerId, notReturnCode) => {
  return new Promise((resolve, reject) => {
    var returnResult;
    getDomain(layerId, {}).then(
      (data) => {
        var domain = {},
          codedValue = {};
        result = _.filter(data, (d) => d.name == attribute.name)[0];
        if (result && result.domain) {
          codedValue = _.filter(
            result.domain.codedValues,
            (d) => d.code == attribute.code
          )[0];
          if (codedValue && codedValue.name) {
            returnResult = codedValue.name;
          }
        } else {
          returnResult = attribute.code;
        }
        return resolve(returnResult);
      },
      (error) => {}
    );
  });
};

export const getFeatureDomainCode = (features, layerId, notReturnCode) => {
  return new Promise((resolve, reject) => {
    getDomain(layerId, {}).then(
      (data) => {
        var domain = {},
          codedValue = {};
        features.forEach((feature) => {
          Object.keys(feature.attributes).forEach(function (attr) {
            let result = _.filter(data, (d) => d.name == attr)[0];
            if (result && result.domain) {
              codedValue = _.filter(
                result.domain.codedValues,
                (d) => d.name == feature.attributes[attr]
              )[0];
              if (codedValue && codedValue.name) {
                feature.attributes[attr] = codedValue.code;
              }
            }
          });
        });

        return resolve(features);
      },
      (error) => {}
    );
  });
};

export const deleteFromLandContract = (values) => {
  //delete from land contracts
  return new Promise((resolve, reject) => {
    Axios.post(
      window.host + "/deleteLands",
      values.parcelSpatialIdsToDeleteFromLandContract
    ).then(
      (data) => {
        return resolve(data);
      },
      function (data) {
        return reject(data);
      }
    );
  });
};
export const createFeatureLayer = function (
  layerId,
  layerName,
  isHidden,
  visible,
  callback
) {
  LoadModules(["esri/layers/FeatureLayer"]).then(([FeatureLayer]) => {
    var token = "";
    if (window.esriToken) token = "?token=" + window.esriToken;
    let featureLayer = new FeatureLayer(mapUrl + "/" + layerId + token, {
      opacity: 0,
      mode: FeatureLayer.MODE_ONDEMAND,
      visible: visible,
      outFields: ["*"],
    });

    callback(featureLayer);
  });
};

export const computeLineLength1 = (pointA, pointB, cetroid) => {
  var y = pointA[1] - pointB[1];
  var x = pointA[0] - pointB[0];

  var gap = 2;
  var angleDeg;
  //right
  //north
  if (pointA[1] > cetroid.y && pointB[1] > cetroid.y)
    return { length: Math.sqrt(x * x + y * y), direction: "north" };
  else if (pointA[0] > cetroid.x && pointB[0] > cetroid.x) {
    return { length: Math.sqrt(x * x + y * y), direction: "east" };
  }

  //left
  else if (pointA[0] < cetroid.x && pointB[0] < cetroid.x) {
    return { length: Math.sqrt(x * x + y * y), direction: "weast" };
  }
  //south
  else return { length: Math.sqrt(x * x + y * y), direction: "south" };
};

export const getGraphicDimensions = (polygon, spatialReference = 32639) => {
  return new Promise((resolve, reject) => {
    let polylines = [];
    for (let i = 0; i < polygon.rings[0].length - 1; i++) {
      let fromPoint = new esri.geometry.Point(polygon.rings[0][i]);
      let toPoint = new esri.geometry.Point(polygon.rings[0][i + 1]);
      let paths = [
        [fromPoint.x, fromPoint.y],
        [toPoint.x, toPoint.y],
      ];

      polylines.push(
        new esri.geometry.Polyline({
          paths: [paths],
          spatialReference: spatialReference,
        })
      );
    }

    LoadModules([
      "esri/tasks/LengthsParameters",
      "esri/tasks/GeometryService",
    ]).then(([LengthsParameters, GeometryService]) => {
      let lengthParams = new LengthsParameters();
      lengthParams.calculationType = "geodesic";
      lengthParams.geodesic = true;
      lengthParams.polylines = polylines;
      lengthParams.lengthUnit = GeometryService.UNIT_METER;
      lengthParams.sr = polygon.spatialReference.wkid;

      let geomSerVice = new GeometryService(geometryServiceUrl);
      geomSerVice.lengths(lengthParams, function (result) {
        return resolve(result);
      });
    });
  });
};

export const computeLineLength = (pointA, pointB, cetroid) => {
  var y = pointA[1] - pointB[1];
  var x = pointA[0] - pointB[0];
  // getGraphicDimensions(pointA, pointB, cetroid.spatialReference).then((res) => {
  //
  // });
  var gap = 2;
  var angleDeg;
  //right
  //north
  if (
    parseInt(pointA[1]) >= parseInt(cetroid.y) - gap &&
    parseInt(pointB[1]) >= parseInt(cetroid.y) - gap &&
    !(
      parseInt(pointA[0]) >= parseInt(cetroid.x) &&
      parseInt(pointB[0]) >= parseInt(cetroid.x)
    )
  )
    return { length: Math.sqrt(x * x + y * y), direction: "north" };
  else if (
    parseInt(pointA[0]) >= parseInt(cetroid.x) &&
    parseInt(pointB[0]) >= parseInt(cetroid.x)
  ) {
    return { length: Math.sqrt(x * x + y * y), direction: "east" };
  }

  //left
  else if (
    parseInt(pointA[0]) <= parseInt(cetroid.x) &&
    parseInt(pointB[0]) <= parseInt(cetroid.x)
  ) {
    return { length: Math.sqrt(x * x + y * y), direction: "weast" };
  }
  //south
  else if (
    parseInt(pointA[1]) <= parseInt(cetroid.y) &&
    parseInt(pointB[1]) <= parseInt(cetroid.y)
  )
    return { length: Math.sqrt(x * x + y * y), direction: "south" };
  else if (
    ((pointA[0] > cetroid.x || pointB[0] > cetroid.x) &&
      pointA[1] < cetroid.y &&
      pointB[1] > cetroid.y) ||
    (pointA[1] > cetroid.y && pointB[1] < cetroid.y)
  )
    return { length: Math.sqrt(x * x + y * y), direction: "east" };
  else return { length: Math.sqrt(x * x + y * y), direction: "weast" };
};

const computeLineAngleWithDirection = (pointA, pointB, cetroid) => {
  var y = pointA[1] - pointB[1];
  var x = pointA[0] - pointB[0];

  var angleDeg;
  var direction;

  if (pointA[0] > cetroid.x && pointB[0] > cetroid.x) {
    angleDeg = (Math.atan2(-y, x) * 180) / Math.PI;
    direction = "east";
  } else if (pointA[0] < cetroid.x && pointB[0] < cetroid.x) {
    angleDeg = (Math.atan2(y, -x) * 180) / Math.PI;
    direction = "weast";
  } else if (pointA[1] > cetroid.y && pointB[1] > cetroid.y) {
    angleDeg = (Math.atan2(y, -x) * 180) / Math.PI;
    direction = "north";
  } else {
    angleDeg = (Math.atan2(-y, x) * 180) / Math.PI;
    direction = "south";
  }

  return { angle: angleDeg, direction: direction };
};

export const rotate = (cx, cy, x, y, angle) => {
  var radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = cos * (x - cx) + sin * (y - cy) + cx,
    ny = cos * (y - cy) - sin * (x - cx) + cy;
  return [nx, ny];
};

const rotatePoint = (point, center, angle) => {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const x = center.x + dx * ca - dy * sa;
  const y = center.y + dx * sa + dy * ca;
  return [x, y];
};

export const computeLineAngle = (pointA, pointB, cetroid) => {
  var y = pointA[1] - pointB[1];
  var x = pointA[0] - pointB[0];

  var angleDeg;
  //right
  if (pointA[0] > cetroid.x && pointB[0] > cetroid.x) {
    angleDeg = (Math.atan2(-y, x) * 180) / Math.PI;
  }
  //left
  else if (pointA[0] < cetroid.x && pointB[0] < cetroid.x) {
    angleDeg = (Math.atan2(y, -x) * 180) / Math.PI;
  }
  //north
  else if (pointA[1] > cetroid.y && pointB[1] > cetroid.y)
    angleDeg = (Math.atan2(y, -x) * 180) / Math.PI;
  //south
  else angleDeg = (Math.atan2(y, -x) * 180) / Math.PI;

  return angleDeg;
  // return x > y || x ==y ? -angleDeg : angleDeg;
};

export const computeLineDirections = (pointA, pointB, cetroid, polygon) => {
  var y = pointA[1] - pointB[1];
  var x = pointA[0] - pointB[0];
  var line = new esri.geometry.Polyline([pointA, pointB]);
  var direction = getLengthDirectionByCentroid(
    [pointA, pointB],
    line.getExtent().getCenter(),
    polygon
  );

  var y = pointA[1] - pointB[1];
  var x = pointA[0] - pointB[0];

  return { length: Math.sqrt(x * x + y * y), direction: direction };
};

export const getLengthOffset = (lineCenter, polygon) => {
  var maxPoint, minPoint;
  var max = 0,
    min;
  //

  for (var j = 0; j < polygon.polygon.rings[0].length - 1; j++) {
    var point1 = new esri.geometry.Point(
      polygon.polygon.rings[0][j][0],
      polygon.polygon.rings[0][j][1]
    );
    var point2 = new esri.geometry.Point(
      polygon.polygon.rings[0][j + 1][0],
      polygon.polygon.rings[0][j + 1][1]
    );

    if (point1.x > max) {
      max = point1.x;
      maxPoint = point1;
    }

    if (!min || point1.x < min) {
      min = point1.x;
      minPoint = point1;
    }

    if (point2.x > max) {
      max = point2.x;
      maxPoint = point2;
    }

    if (!min || point2.x < min) {
      min = point2.x;
      minPoint = point2;
    }
  }

  var centerPointofLine = lineCenter;
  var polygon = new esri.geometry.Polygon(polygon.polygon);

  var polygonCenterPoint = polygon.getExtent().getCenter();

  var diffrenceInXWithMaxPoint = Math.abs(centerPointofLine.x - maxPoint.x);
  var diffrenceWithPolygonCenterPoint = Math.abs(
    centerPointofLine.x - polygonCenterPoint.x
  );
  //
  //east
  if (diffrenceInXWithMaxPoint < diffrenceWithPolygonCenterPoint) {
    return { x: 10, y: 0 };
  } else {
    var diffrenceInXWithMinPoint = Math.abs(centerPointofLine.x - minPoint.x);
    //south
    if (diffrenceInXWithMinPoint < diffrenceWithPolygonCenterPoint) {
      return { x: -10, y: 0 };
    }
    // north
    else if (centerPointofLine.y > polygonCenterPoint.y) {
      return { x: 0, y: 10 };
    }
    //weast
    else {
      return { x: 0, y: -10 };
    }
  }
};

export const GetSpatialId = (graphic) => {
  if (!graphic.geometry) {
    graphic = new esri.geometry.Polygon(graphic);
    graphic = new esri.Graphic(graphic, null, null, null);
  }

  var pt = graphic.geometry.getExtent().getCenter();
  var polygonlatlng = esri.geometry.xyToLngLat(pt.x, pt.y);

  var lat = (polygonlatlng[0] + "").replace(".", "");
  var lng = (polygonlatlng[1] + "").replace(".", "");

  var parcelSpatialId =
    lat.substring(lat.length - 7, lat.length) +
    lng.substring(lng.length - 7, lng.length);

  return parcelSpatialId;
};

export const getLineLength = (array, point1, point2, isArc) => {
  return (
    isArc &&
    _.find(array, function (d) {
      return (
        (d.points[0].x.toFixed(4) == point1.x.toFixed(4) &&
          d.points[0].y.toFixed(4) == point1.y.toFixed(4) &&
          d.points[1].x.toFixed(4) == point2.x.toFixed(4) &&
          d.points[1].y.toFixed(4) == point2.y.toFixed(4)) ||
        (d.points[0].x.toFixed(4) == point2.x.toFixed(4) &&
          d.points[0].y.toFixed(4) == point2.y.toFixed(4) &&
          d.points[1].x.toFixed(4) == point1.x.toFixed(4) &&
          d.points[1].y.toFixed(4) == point1.y.toFixed(4))
      );
    })
  );
};

export const zoomToIdentifyParcel = (mapObj) => {
  zoomToLayer("boundriesGraphicLayer", mapObj, 8);
};

export const formatPythonObject = (object) => {
  return JSON.parse(
    dojo
      .toJson(object)
      .replaceAll('\\"', "")
      .replaceAll('"', '"')
      .replaceAll(true, '"True"')
      .replaceAll(false, '"False"')
      .replaceAll(null, '"None"')
  ).map((graphic) => graphic.geometry);
};

// export const formatPythonObjectForFarz = (object) => {
//   return JSON.parse(
//     dojo
//       .toJson(object)
//       .replaceAll('\\"', "")
//       .replaceAll('"', '"')
//       .replaceAll(true, '"True"')
//       .replaceAll(false, '"False"')
//       .replaceAll(null, '"None"')
//   );
// };

export const formatPythonObjectForFarz = (object) => {
  return JSON.parse(
    dojo
      .toJson(object)
      .replaceAll('\\"', "")
      .replaceAll('"', '"')
      .replaceAll(true, '"True"')
      .replaceAll(false, '"False"')
      .replaceAll(null, '"None"')
  );
};

// export const addGraphicToLayer = function (
//   feature,
//   map,
//   layerName,
//   fillColor,
//   strokeColor,
//   isSolid,
//   callback,
//   attributes,
//   pictureOffest,
//   isNoFull,
//   isDashedLines,
//   thickniess
// ) {
//   LoadModules([
//     "esri/geometry/Point",
//     "esri/geometry/Polyline",
//     "esri/geometry/Polygon",
//     "esri/geometry/mathUtils",
//     "esri/symbols/PictureMarkerSymbol",
//     "esri/symbols/SimpleMarkerSymbol",
//     "esri/graphic",
//     "esri/symbols/SimpleFillSymbol",
//     "esri/symbols/SimpleLineSymbol",
//     "esri/Color",
//   ]).then(
//     ([
//       Point,
//       Polyline,
//       Polygon,
//       mathUtils,
//       PictureMarkerSymbol,
//       SimpleMarkerSymbol,
//       Graphic,
//       SimpleFillSymbol,
//       SimpleLineSymbol,
//       Color,
//     ]) => {
//       var graphicLayer = map?.getLayer(layerName);
//       fillColor = fillColor || [100, 100, 100];
//       strokeColor = strokeColor || [255, 255, 255];
//       var symbol;

//       if (layerName == "pictureGraphicLayer") {
//         symbol = new PictureMarkerSymbol({
//           url: "",
//           height: 20,
//           width: 20,
//           xoffset: pictureOffest.x || 0,
//           yoffset: pictureOffest.y || 0,
//           type: "esriPMS",
//         });
//       } else if (feature && feature.type === "point") {
//         symbol = new SimpleMarkerSymbol(
//           SimpleMarkerSymbol.STYLE_SQUARE,
//           50,
//           new SimpleLineSymbol(
//             SimpleLineSymbol.STYLE_SOLID,
//             new Color(fillColor),
//             1
//           ),
//           new Color(strokeColor)
//         );
//       } else if (feature && feature.type === "polyline") {
//         symbol = new SimpleLineSymbol(
//           SimpleLineSymbol.STYLE_SOLID,
//           new Color(fillColor),
//           thickniess || 3
//         );
//       } else {
//         if (isSolid)
//           symbol = new SimpleFillSymbol(
//             SimpleFillSymbol.STYLE_SOLID,
//             new SimpleLineSymbol(
//               SimpleFillSymbol.STYLE_SOLID,
//               new Color([0, 0, 0]),
//               1
//             ),
//             new Color([255, 255, 255])
//           );
//         else if (isDashedLines)
//           symbol = new SimpleFillSymbol(
//             SimpleFillSymbol.STYLE_BACKWARD_DIAGONAL,
//             new SimpleLineSymbol(
//               SimpleFillSymbol.STYLE_SOLID,
//               new Color([0, 0, 0]),
//               1
//             ),
//             new Color([255, 255, 255])
//           );
//         else if (isNoFull)
//           symbol = new SimpleFillSymbol(
//             SimpleFillSymbol.STYLE_NULL,
//             new SimpleLineSymbol(
//               SimpleFillSymbol.STYLE_SOLID,
//               new Color(fillColor),
//               3
//             ),
//             new Color(strokeColor)
//           );
//         else
//           symbol = new SimpleFillSymbol(
//             SimpleFillSymbol.STYLE_SOLID,
//             new SimpleLineSymbol(
//               SimpleFillSymbol.STYLE_SOLID,
//               new Color(fillColor),
//               1
//             ),
//             new Color(strokeColor)
//           );
//       }

//       if (feature && feature.geometry) {
//         if (feature.geometry.type == "polygon") {
//           feature.geometry = new Polygon(feature.geometry);
//         }
//       }

//       project(
//         [feature],
//         map.spatialReference.wkid,
//         (res) => {
//           let resFeature = res[0];
//           if (resFeature && resFeature.symbol && resFeature.attributes) {
//             resFeature.symbol = symbol;
//             graphicLayer.add(resFeature);
//           } else {
//             var graphic = new Graphic(
//               (resFeature && resFeature.geometry) || resFeature,
//               symbol,
//               attributes,
//               null
//             );

//             if (!graphic.geometry) {
//               graphic = new Graphic(resFeature, symbol, attributes, null);
//             }

//             graphicLayer.add(graphic);

//             if (callback) {
//               ////;
//               callback(graphic);
//             }
//           }
//         },
//         true
//       );
//     }
//   );
// };

export const addGraphicToLayer = function (
  feature,
  map,
  layerName,
  fillColor,
  strokeColor,
  isSolid,
  callback,
  attributes,
  pictureOffest,
  isNoFull,
  isDashedLines,
  thickniess,
  loadOnMap = true
) {
  // LoadModules([
  //   "esri/geometry/Point",
  //   "esri/geometry/Polyline",
  //   "esri/geometry/Polygon",
  //   "esri/geometry/mathUtils",
  //   "esri/symbols/PictureMarkerSymbol",
  //   "esri/symbols/SimpleMarkerSymbol",
  //   "esri/graphic",
  //   "esri/symbols/SimpleFillSymbol",
  //   "esri/symbols/SimpleLineSymbol",
  //   "esri/Color",
  // ]).then(
  //   ([
  //     Point,
  //     Polyline,
  //     Polygon,
  //     mathUtils,
  //     PictureMarkerSymbol,
  //     SimpleMarkerSymbol,
  //     Graphic,
  //     SimpleFillSymbol,
  //     SimpleLineSymbol,
  //     Color,
  //   ]) => {
  var graphicLayer = map?.getLayer(layerName);
  fillColor = fillColor || [100, 100, 100];
  strokeColor = strokeColor || [255, 255, 255];
  var symbol;

  if (layerName == "pictureGraphicLayer") {
    symbol = new PictureMarkerSymbol({
      url: "",
      height: 20,
      width: 20,
      xoffset: pictureOffest.x || 0,
      yoffset: pictureOffest.y || 0,
      type: "esriPMS",
    });
  } else if (feature && feature.type === "point") {
    symbol = new SimpleMarkerSymbol(
      SimpleMarkerSymbol.STYLE_SQUARE,
      50,
      new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color(fillColor),
        1
      ),
      new Color(strokeColor)
    );
  } else if (feature && feature.type === "polyline") {
    symbol = new SimpleLineSymbol(
      SimpleLineSymbol.STYLE_SOLID,
      new Color(fillColor),
      thickniess || 3
    );
  } else {
    if (isSolid)
      symbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new Color([0, 0, 0]),
          1
        ),
        new Color([255, 255, 255])
      );
    else if (isDashedLines)
      symbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_BACKWARD_DIAGONAL,
        new SimpleLineSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new Color([0, 0, 0]),
          1
        ),
        new Color([255, 255, 255])
      );
    else if (isNoFull)
      symbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_NULL,
        new SimpleLineSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new Color(fillColor),
          3
        ),
        new Color(strokeColor)
      );
    else
      symbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleFillSymbol.STYLE_SOLID,
          new Color(fillColor),
          1
        ),
        new Color(strokeColor)
      );
  }

  if (feature && feature.geometry) {
    if (feature.geometry.type == "polygon") {
      feature.geometry = new Polygon(feature.geometry);
    }
  }
  if (
    !feature?.spatialReference?.wkid ||
    (feature?.spatialReference?.wkid &&
      feature?.spatialReference?.wkid != map.spatialReference.wkid)
  ) {
    project(
      [feature.geometry || feature],
      map.spatialReference.wkid,
      (res) => {
        let resFeature = res[0];
        if (resFeature && resFeature.symbol && resFeature.attributes) {
          resFeature.symbol = symbol;

          if (loadOnMap) {
            if (graphicLayer) graphicLayer.add(resFeature);
            if (callback) {
              ////;
              callback(graphic);
            }
          } else {
            addLayerFeature(map, layerName, resFeature);
          }
        } else {
          var graphic = new Graphic(
            (resFeature && resFeature.geometry) || resFeature,
            symbol,
            attributes,
            null
          );

          if (!graphic.geometry) {
            graphic = new Graphic(resFeature, symbol, attributes, null);
          }

          if (loadOnMap) {
            if (graphicLayer) graphicLayer.add(graphic);
            if (callback) {
              ////;
              callback(graphic);
            }
          } else {
            addLayerFeature(map, layerName, graphic);
          }
        }
      },
      true
    );
  } else {
    var graphic = new Graphic(
      (feature && feature.geometry) || feature,
      symbol,
      attributes,
      null
    );

    if (loadOnMap) {
      if (graphicLayer) graphicLayer.add(graphic);
      if (callback) {
        ////;
        callback(graphic);
      }
    } else {
      addLayerFeature(map, layerName, graphic);
    }
  }
  //   }
  // );
};

export const intersectQueryTask = function (settings) {
  // url, where, outFields, callbackResult, geometry) {

  // store.dispatch({ type: "Show_Loading_new", loading: true });
  LoadModules([
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/geometry/Polygon",
  ]).then(([Query, QueryTask]) => {
    let query = new Query();
    var token = "";
    if (window.esriToken) token = "?token=" + window.esriToken;
    var qt = new QueryTask(settings.url + token);
    query.geometry = dojo.clone(settings.geometry);
    query.where = settings.where;
    query.outFields = settings.outFields;
    if (settings.preQuery) {
      settings.preQuery(query, Query);
    }
    if (
      (!query.spatialRelationship &&
        (!settings.spatialRelationship ||
          (settings.spatialRelationship &&
            settings.spatialRelationship == Query.SPATIAL_REL_INTERSECTS))) ||
      (query.spatialRelationship &&
        query.spatialRelationship == Query.SPATIAL_REL_INTERSECTS)
    ) {
      query.distance = settings.distance || 1;
    }

    query.returnGeometry = true;
    query.spatialRelationship =
      (!query.spatialRelationship &&
        (settings.spatialRelationship || Query.SPATIAL_REL_INTERSECTS)) ||
      query.spatialRelationship;
    qt.execute(
      query,
      (res) => {
        if (settings.callbackResult) {
          settings.callbackResult(res);
        }
      },
      (res) => {
        if (settings.errorCallbackResult) {
          settings.errorCallbackResult(res);
          console.log(res);
        }
      }
    );
  });
};

export const queryTask_updated = (
  url,
  where,
  outFields,
  callbackResult,
  callbackError,
  preQuery,
  returnGeometry,
  orderByFields,
  outSpatialReference
) => {
  LoadModules([
    "esri/tasks/query",
    "esri/tasks/StatisticDefinition",
    "esri/tasks/QueryTask",
  ]).then(([Query, StatisticDefinition, QueryTask]) => {
    var query = new Query();
    // console.log(outSpatialReference)
    query.returnGeometry = returnGeometry || false;

    query.outFields = outFields;
    if (preQuery) {
      preQuery(query, Query);
    }
    if (orderByFields) query.orderByFields = orderByFields;

    if (outSpatialReference)
      query.outSpatialReference = new esri.SpatialReference(
        outSpatialReference
      );

    if (where) {
      query.where = where;
    } else {
      query.where = "1=1";
    }

    var token = "?token=" + window.esriToken;
    if (url.indexOf("?token=") > -1) {
      token = "";
    }
    var queryTask = new QueryTask(url + token);

    function callback(data) {
      callbackResult(data);
    }

    function callbError(data) {
      if (callbackError) {
        callbackError(data);
      }
    }

    queryTask.execute(query, callback, callbError);
  });
};

export const queryTask = function (settings) {
  //store.dispatch({type:'Show_Loading_new',loading: true})
  // url, where, outFields, callbackResult,statistics[], callbackError, preQuery, returnGeometry) {

  var query = new window.Query();
  query.returnGeometry = settings.returnGeometry || false;
  if (settings.geometry) query.geometry = window.dojo.clone(settings.geometry);

  query.returnIdsOnly = settings.returnIdsOnly || false;
  //query.returnCountOnly = settings.returnCountOnly || false
  query.outFields = settings.outFields || ["*"];

  query.returnDistinctValues = settings.returnDistinctValues || false;

  if (query.returnDistinctValues) {
    query.returnGeometry = false;
  }

  if (settings.statistics) {
    query.outStatistics = [];
    var statisticDefinition = {};
    settings.statistics.forEach(function (val) {
      statisticDefinition = new window.StatisticDefinition();
      statisticDefinition.statisticType = val.type;
      statisticDefinition.onStatisticField = val.field;
      statisticDefinition.outStatisticFieldName = val.name;
      query.outStatistics.push(statisticDefinition);
    });
  }

  query.groupByFieldsForStatistics = settings.groupByFields;
  // query.returnCountOnly = settings.returnCountOnly || false
  if (settings.preQuery) {
    settings.preQuery(query, window.Query);
  }

  if (settings.orderByFields) {
    query.orderByFields = settings.orderByFields;
  }

  if (settings.queryWithGemoerty) {
    query.geometry = settings.geometry;

    if (settings.spatialRelationship == "SPATIAL_REL_OVERLAPS") {
      query.spatialRelationship =
        esri.tasks._SpatialRelationship.SPATIAL_REL_OVERLAPS;
    } else {
      query.distance = settings.bufferDistance || 5;
    }
  } else query.where = settings.where || "1=1";

  var token = "";
  if (window.esriToken) token = "?token=" + window.esriToken;
  // var hasPermission = $rootScope.getPermissions('splitandmerge.MAPEXPLORER', 'modules.INVESTMENTLAYERS')
  // if (hasPermission) {
  // token = '?token=' + $rootScope.User.esriToken
  // }
  if (settings.url.indexOf("?token=") > -1) {
    token = "";
  }

  var queryTask = new window.QueryTask(settings.url + token); // + "?token=" + $rootScope.User.esriToken + "&username='d'")

  function callback(data) {
    // store.dispatch({type:'Show_Loading_new',loading: false})
    settings.callbackResult(data);
  }

  function callbError(data) {
    //window.notifySystem('warning', 'حدث خطأ اثناء استرجاع البيانات')
    // store.dispatch({type:'Show_Loading_new',loading: false})
    if (settings.callbackError) {
      settings.callbackError(data);
    }
  }

  if (settings.returnCountOnly) {
    queryTask.executeForCount(query, callback, callbError);
  } else if (settings.returnExecuteObject) {
    return queryTask.execute(query);
  } else {
    queryTask.execute(query, callback, callbError);
  }
};

export const computeAngle = (pointA, pointB) => {
  var dLon = ((pointB[0] - pointA[0]) * Math.PI) / 180;
  var lat1 = (pointA[1] * Math.PI) / 180;
  var lat2 = (pointB[1] * Math.PI) / 180;
  var y = Math.sin(dLon) * Math.cos(lat2);
  var x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  var bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = ((bearing + 360) % 360).toFixed(1); //Converting -ve to +ve (0-360)
  var out = {};
  if (bearing >= 0 && bearing < 90) {
    out.text = " شمال " + (bearing != 0 ? " شرق " : "");
    out.bearing = bearing;
  }
  if (bearing >= 90 && bearing < 180) {
    out.text = (bearing != 90 ? " جنوب " : "") + " شرق ";
    out.bearing = (180 - bearing).toFixed(1);
  }
  if (bearing >= 180 && bearing < 270) {
    out.text = " جنوب " + (bearing != 180 ? " غرب " : "");
    out.bearing = (bearing - 180).toFixed(1);
  }
  if (bearing >= 270) {
    out.text = (bearing != 270 ? " شمال " : "") + " غرب ";
    out.bearing = (360 - bearing).toFixed(1);
  }
  out.bearing = bearing;
  if (out.text) {
    return out.text + " بزاوية " + "<b>" + out.bearing + "° </b> ";
  }
  return " شمال ";
};

export const isPointOrArc = (point, polygonIndex, cadFeatures) => {
  var value = false;
  if (cadFeatures) {
    var points = cadFeatures[polygonIndex];
    if (points && points.length) {
      for (var i = 0; i < points.length; i++) {
        if (points[i][0] == point.x && points[i][1] == point.y) {
          value = true;
          break;
        }
      }
    }
  }
  return value;
};

export const IdentifyTask = function (settings) {
  //store.dispatch({type:'Show_Loading_new',loading: true})
  // url, where, outFields, callbackResult,statistics[], callbackError, preQuery, returnGeometry) {
  LoadModules([
    "esri/tasks/IdentifyTask",
    "esri/tasks/IdentifyParameters",
  ]).then(([IdentifyTask, IdentifyParameters]) => {
    var identifyTask = new IdentifyTask(
      (settings.url || window.mapUrl) + "?token=" + window.esriToken
    );
    var identifyParams = new IdentifyParameters();

    identifyParams.layerIds = [];
    // identifyParams.layerIds.push(Municipality_Boundary.id);
    // identifyParams.layerIds.push(UrbanAreaBoundary.id);
    var identifyLayers = ["Municipality_Boundary", "UrbanAreaBoundary"];
    if (settings.layers) {
      settings.layers.forEach(function (layer) {
        if (identifyLayers.indexOf(layer.name) > -1)
          identifyParams.layerIds.push(layer.id);
      });
    }
    identifyParams.tolerance = settings.tolerance;
    identifyParams.returnGeometry = settings.returnGeometry || false;
    identifyParams.layerOption =
      settings.layerOption || IdentifyParameters.LAYER_OPTION_ALL;
    identifyParams.width = settings.map?.width;
    identifyParams.height = settings.map?.height;
    var identifyGeomoetry = new esri.geometry.Polygon(settings.polygonFeature);
    identifyParams.geometry = identifyGeomoetry;
    identifyParams.mapExtent = settings.map?.extent;
    identifyParams.spatialReference = new esri.SpatialReference({
      wkid: 32639,
    });
    identifyTask.execute(identifyParams, settings.identifyResults);
    //store.dispatch({type:'Show_Loading_new',loading: false})
  });
};

export const generateUUID = function () {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};

export const getStatistics = function (attribute, layerIndex) {
  return new Promise((resolve, reject) => {
    LoadModules([
      "esri/tasks/query",
      "esri/tasks/StatisticDefinition",
      "esri/tasks/QueryTask",
    ]).then(([Query, StatisticDefinition, QueryTask]) => {
      var sqlExpression = "1";

      var url = `${mapUrl}/${layerIndex}`;
      var sd = new StatisticDefinition();
      sd.statisticType = "count";
      sd.onStatisticField = sqlExpression;
      sd.outStatisticFieldName = "Count";

      var queryParams = new Query();
      queryParams.outFields = [attribute];
      queryParams.outStatistics = [sd];
      queryParams.groupByFieldsForStatistics = [attribute];
      var queryTask = new QueryTask(url);
      queryTask.execute(queryParams).then((r) => {
        getFeatureDomainName(r.features, layerIndex).then((res) => {
          resolve(res);
        });
      });
    });
  });
};
export const getInvestStatisticsBySiteActivity = () => {
  return getStatistics("SITE_ACTIVITY", 4).then((d) =>
    d.map((v) => v.attributes)
  );
};
export const getInvestStatisticsBySiteStatus = () => {
  return getStatistics("SITE_STATUS", 5).then((d) =>
    d.map((v) => v.attributes)
  );
};
window.mapViewer = {};
// fieldName ,code for subtypes
export const getDomain = (layerId, settings, customMapUrl) => {
  return new Promise((resolve, reject) => {
    var returnedDomain;

    if (Domains?.length) {
      Domains.forEach(function (domain) {
        if (domain.layerId == layerId) {
          if (!settings.fieldName && !settings.code) {
            domain?.fields?.forEach(function (val) {
              if (!val.domain) {
                settings.fieldName = val.name;
                settings.isSubType = true;
                if (domain.types) {
                  returnedDomain = getSubTypes(domain, settings);

                  if (returnedDomain) {
                    if (settings.isfilterOpened) val.domain = returnedDomain;
                    else val.domain = { codedValues: returnedDomain };
                  }
                  //val.domain =  returnedDomain ;
                  else val.domain = null;
                }
              }
            });
            returnedDomain = domain.fields;
          } else if (settings.isSubType && settings.fieldName) {
            returnedDomain = getSubTypes(domain, settings);
          } else {
            domain.fields.forEach(function (field) {
              if (field.name == settings.fieldName && field.domain) {
                returnedDomain = field.domain.codedValues;
              }
            });
          }
        }
      });
    }

    if (returnedDomain) {
      return resolve(returnedDomain);
    } else {
      var url = (customMapUrl || mapUrl) + "/" + layerId;
      if (loadings.indexOf(url) == -1) {
        loadings.push(url);
        esriRequest(url).then(
          function (res) {
            Domains.push({
              layerId: layerId,
              fields: res.fields,
              types: res.types,
            });
            //loadings.pop(url);
            getDomain(layerId, settings, customMapUrl).then(
              (data) => {
                return resolve(data);
              },
              () => {
                return reject();
              }
            );
          },
          () => {
            loadings.pop(url);
            return reject();
          }
        );
      } else {
        return reject();
      }
    }
  });
};

export const getMapGraphics = (map) => {
  // setTimeout(() => {

  var graphics = [];
  let layers = map.graphicsLayerIds;
  layers.forEach((_layerKey, layerIndex) => {
    if (typeof map.getLayer(_layerKey).refresh == "function") {
      //map.getLayer(_layerKey).refresh();
      if (["basemap", "map_graphics"].indexOf(_layerKey.toLowerCase()) == -1)
        graphics.push({
          graphics: map
            .getLayer(_layerKey)
            .graphics.filter((graphic) => graphic.geometry != null)
            .map((graphic) => {
              return graphic.toJson();
            }),
          layerName: _layerKey,
          layerIndex: layerIndex,
        });
    }
  });
  return graphics.filter((graphic) => graphic?.graphics.length) || [];
  // }, 0);
};

export const getSubTypes = function (domain, settings) {
  var returnedDomain = [];
  if (domain.types) {
    domain.types.forEach(function (subType) {
      if (settings.isSubType && !settings.code) {
        if (!returnedDomain) returnedDomain = [];

        if (subType.domains[settings.fieldName]) {
          if (settings.isfilterOpened)
            returnedDomain.push({
              id: subType.id,
              name: subType.name,
              isSubType: true,
            });
          else
            returnedDomain.push.apply(
              returnedDomain,
              subType.domains[settings.fieldName].codedValues
            );
        }
      } else {
        if (
          subType.id == settings.code &&
          subType.domains[settings.fieldName]
        ) {
          returnedDomain = subType.domains[settings.fieldName].codedValues;
        }
      }
    });
  }

  return returnedDomain.length == 0 ? null : returnedDomain;
};

// export const getCornerIconPosition = (cornerKey, lines) => {
//   var out = { x: 0, y: 0 };
//   var direction = "";
//   var count = 0;

//   lines.forEach(function (line) {

//       if (line.attributes.FROM_CORNER == cornerKey || line.attributes.TO_CORNER == cornerKey) {

//           if (line.attributes.BOUNDARY_DIRECTION == 3 || line.attributes.BOUNDARY_DIRECTION == 4) {
//               count++;
//           }
//           if (line.attributes.BOUNDARY_DIRECTION == 4) {
//               out.x = 15;
//               out.y = -6;
//           }
//           else {
//               if (line.attributes.BOUNDARY_DIRECTION == 1) {
//                   out.x = -6;
//                   out.y = -15;
//               }
//               else if (line.attributes.BOUNDARY_DIRECTION == 3) {
//                   out.x = -15;
//                   out.y = 7;
//               }

//           }

//       }

//   });

//   if (count == 2) {
//       out.x = 6;
//       out.y = 16;
//   }

//   return out;
// }

export const getSubdivisionNameByCode = (code, subDivisionDomains) => {
  if (subDivisionDomains && subDivisionDomains.domain) {
    var subDivisionType = _.filter(
      subDivisionDomains.domain.codedValues,
      (domain, index) => {
        return domain.code == code;
      }
    )[0];

    if (subDivisionType) {
      return subDivisionType.name;
    }
  }
  return code;
};

export const getSubdivisionCode = (name, subDivisionDomains) => {
  if (subDivisionDomains && subDivisionDomains.domain) {
    var subDivisionType = _.filter(
      subDivisionDomains.domain.codedValues,
      (domain, index) => {
        return domain.name == name;
      }
    )[0];

    if (subDivisionType) {
      return subDivisionType.code;
    }
  }

  return name;
};

export const fromLatLngToDegreeSymbol = (angleInDegrees) => {
  while (angleInDegrees < -180.0) angleInDegrees += 360.0;

  while (angleInDegrees > 180.0) angleInDegrees -= 360.0;

  var result = {};

  //switch the value to positive
  result.IsNegative = angleInDegrees < 0;
  angleInDegrees = Math.abs(angleInDegrees);

  //gets the degree
  result.deg = Math.floor(angleInDegrees);
  var delta = angleInDegrees - result.deg;

  //gets minutes and seconds
  var seconds = 3600.0 * delta;
  result.sec = seconds % 60;
  result.min = Math.floor(seconds / 60.0);

  return result.deg + "° " + result.min + "' " + result.sec + "'' ";
};

export const fromLatLngToDegreeSymbolFormatted = (angleInDegrees) => {
  while (angleInDegrees < -180.0) angleInDegrees += 360.0;

  while (angleInDegrees > 180.0) angleInDegrees -= 360.0;

  var result = {};

  //switch the value to positive
  result.IsNegative = angleInDegrees < 0;
  angleInDegrees = Math.abs(angleInDegrees);

  //gets the degree
  result.deg = Math.floor(angleInDegrees);
  var delta = angleInDegrees - result.deg;

  //gets minutes and seconds
  var seconds = 3600.0 * delta;
  result.sec = seconds % 60;
  result.min = Math.floor(seconds / 60.0);

  return result.deg + "° " + result.min + "' " + result.sec.toFixed(1) + "'' ";
};

export const GetSpatial = function (graphic) {
  if (graphic) {
    var fromLatLngToDegree = function (angleInDegrees) {
      while (angleInDegrees < -180.0) angleInDegrees += 360.0;

      while (angleInDegrees > 180.0) angleInDegrees -= 360.0;

      var result = {};

      //switch the value to positive
      result.IsNegative = angleInDegrees < 0;
      angleInDegrees = Math.abs(angleInDegrees);

      //gets the degree
      result.deg = Math.floor(angleInDegrees);
      var delta = angleInDegrees - result.deg;

      //gets minutes and seconds
      var seconds = 3600.0 * delta;
      result.sec = seconds % 60;

      //add 0 before number lower than 2 digit to prevent duplicate numbers
      if (result.sec < 10) {
        result.sec = "0" + result.sec;
      }
      result.min = Math.floor(seconds / 60.0);

      return result.deg + "" + result.min + "" + result.sec;
    };

    var lat = fromLatLngToDegree(graphic.y).replace(".", "");
    var lng = fromLatLngToDegree(graphic.x).replace(".", "");

    var parcelSpatialId = lat.substring(0, 7) + lng.substring(0, 7);

    return parcelSpatialId;
  }
  return null;
};

export const loadCurrentPlan = (props, map, mapGraphics, isGraphicsLoaded) => {
  if (props.captureMapExtent) {
    props.captureMapExtent(map);
  }
  clearGraphicFromLayer(map, "highlightBoundriesGraphicLayer");
  clearGraphicFromLayer(map, "editlengthGraphicLayer");
  clearGraphicFromLayer(map, "PacrelNoGraphicLayer");
  clearGraphicFromLayer(map, "addedParclGraphicLayer");
  clearGraphicFromLayer(map, "boundriesGraphicLayer");
  clearGraphicFromLayer(map, "boundriesDirection");
  clearGraphicFromLayer(map, "pictureGraphicLayer");
  clearGraphicFromLayer(map, "PacrelUnNamedGraphicLayer");
  clearGraphicFromLayer(map, "ParcelPlanNoGraphicLayer");
  clearGraphicFromLayer(map, "detailedGraphicLayer");

  if (props.input) {
    setTimeout(() => {
      if (mapGraphics?.length && isGraphicsLoaded) {
        mapGraphics.forEach((layer) => {
          let _layer = map.getLayer(layer?.layerName);
          if (!_layer) {
            _layer = new esri.layers.GraphicsLayer();
            _layer.opacity = 1;
            _layer.id = layer?.layerName;
            if (layer.layerIndex) {
              map?.addLayer(_layer, layer.layerIndex);
            } else {
              map?.addLayer(_layer);
            }
          }

          // if (_layer?.graphics?.length) {
          //   clearGraphicFromLayer(map, layer?.layerName);
          // }
          layer?.graphics?.forEach((graphic) => {
            let shape;
            let symbol;
            if (graphic?.geometry?.paths) {
              shape = new esri.geometry.Polyline(graphic?.geometry);
              symbol = new esri.symbol.SimpleLineSymbol(graphic?.symbol);
            } else if (graphic?.geometry?.rings) {
              shape = new esri.geometry.Polygon(graphic?.geometry);
              symbol = new esri.symbol.SimpleFillSymbol(graphic?.symbol);
            } else if (graphic?.symbol?.type == "esriTS") {
              shape =
                (graphic?.geometry.x != "NaN" &&
                  graphic?.geometry.y != "NaN" &&
                  new esri.geometry.Point(graphic?.geometry)) ||
                null;
              symbol = new esri.symbol.TextSymbol(graphic?.symbol);
            } else {
              shape = new esri.geometry.Point(graphic?.geometry);
              symbol = new esri.symbol.SimpleMarkerSymbol(graphic?.symbol);
            }

            //

            if (symbol.text) {
              //   if (symbol.text.indexOf("/") > -1) {
              //     symbol.text = reverseString(symbol.text);
              //   }
              //   else
              if (symbol.text.indexOf("\\") > -1) {
                symbol.text = symbol.text.replaceAll("\\", "/");
                //symbol.text = reverseString(symbol.text);
              }

              symbol.text = symbol.text
                .split("/")
                .map((element) => element.trim());
              symbol.text = convertToArabic(symbol.text.join(" / "));
            }

            if (shape) {
              _layer?.add(new esri.Graphic(shape, symbol, graphic?.attributes));
            }
          });
          _layer?.refresh();
        });

        resizeMap(map);
      }

      isGraphicsLoaded = false;
    }, 0);
  }
};

//Reproject features
export const project = (features, outSR, callback, isSame) => {
  if (features && features?.length) {
    var isSameWkid = false;
    if (features[0]?.spatialReference?.wkid == outSR) {
      isSameWkid = true;
      if (isSame) {
        callback(features);
      } else {
        callback([features]);
      }
    } else {
      outSR = new window.esri.SpatialReference({
        wkid: outSR,
      });

      var gemoertyService =
        window.esri.tasks.GeometryService(geometryServiceUrl);

      var params = new window.ProjectParameters();

      if (features.length) params.geometries = features;
      else params.geometries = [features];

      params.outSR = outSR;
      gemoertyService.project(params, callback);
    }
  } else {
    callback(null);
  }
};

export const projectWithPromise = (features, outSR, callback, isSame) => {
  return new Promise((resolve, reject) => {
    if (features && features?.length) {
      var isSameWkid = false;
      if (features[0]?.spatialReference?.wkid == outSR) {
        isSameWkid = true;
        if (isSame) {
          return resolve(features);
        } else {
          return resolve([features]);
        }
      } else {
        LoadModules(["esri/tasks/ProjectParameters"]).then(
          ([ProjectParameters]) => {
            outSR = new window.esri.SpatialReference({
              wkid: outSR,
            });

            var gemoertyService =
              window.esri.tasks.GeometryService(geometryServiceUrl);

            var params = new ProjectParameters();

            if (features.length) params.geometries = features;
            else params.geometries = [features];

            params.outSR = outSR;
            gemoertyService.project(params, (features) => {
              return resolve(features);
            });
          },
          function (error) {
            // //
          }
        );
      }
    } else {
      return resolve(null);
    }
  });
};

let i = 0;
export const checkUserObject = (object) => {
  if (object) {
    Object.keys(object).forEach((key) => {
      if (object[key]) {
        if (
          typeof object[key] == "object" &&
          key.toLowerCase().indexOf("user") != -1 &&
          Object.keys(object[key]).find((r) => r == "token") != undefined
        ) {
          object[key] =
            (object[key] && copyUser({ user: object[key] })) || null;
        } else if (
          typeof object[key] == "object" &&
          !Array.isArray(object[key])
        ) {
          checkUserObject(object[key]);
        } else if (
          typeof object[key] == "object" &&
          Array.isArray(object[key])
        ) {
          object[key].forEach((sub_object) => {
            if (sub_object && typeof sub_object == "object") {
              checkUserObject(sub_object);
            }
          });
        }
      }
    });
  }
};

export const removeObjectInMainObjct = (object, objectName) => {
  if (object) {
    Object.keys(object).forEach((key) => {
      if (object[key]) {
        if (
          typeof object[key] == "object" &&
          key.toLowerCase().indexOf(objectName) != -1
        ) {
          delete object[key];
        } else if (
          typeof object[key] == "object" &&
          !Array.isArray(object[key])
        ) {
          removeObjectInMainObjct(object[key], objectName);
        } else if (
          typeof object[key] == "object" &&
          Array.isArray(object[key])
        ) {
          object[key].forEach((sub_object) => {
            if (sub_object && typeof sub_object == "object") {
              removeObjectInMainObjct(sub_object, objectName);
            }
          });
        }
      }
    });
  }
};

export const copyUser = (props) => {
  const {
    id,
    name,
    positions,
    departments,
    province_id,
    municipalities,
    subMunicipality,
    mobile,
    engcompany_id,
  } = props.user;
  return {
    id: id,
    name: name,
    positions: positions,
    departments: departments,
    province_id: province_id,
    municipalities: municipalities,
    subMunicipality: subMunicipality,
    mobile: mobile,
    engcompany_id: engcompany_id,
  };
};

export const redrawNames = (
  polygon,
  map,
  rename,
  layerName = "PacrelUnNamedGraphicLayer",
  index = 0
) => {
  console.log("---r----");
  let parcelNumberFont = 20;
  if (polygon) {
    var filteredGraphic = map
      .getLayer(layerName)
      .graphics.find(
        (graphic) =>
          graphic.geometry.x == polygon.position.x &&
          graphic.geometry.y == polygon.position.y
      );

    if (filteredGraphic) {
      map?.getLayer(layerName).remove(filteredGraphic);
    }

    addParcelNo(
      polygon.position,
      map,
      "" + convertToArabic(polygon.parcel_name || rename) + "",
      layerName,
      parcelNumberFont,
      [0, 0, 0],
      getPacrelNoAngle({ geometry: polygon.polygon })
    );
    setMap(map);
  }
};

export const executeGPTool = async (
  gpUrl,
  params,
  callback,
  callbackError,
  outputName = "output_value"
) => {
  if (gpUrl) {
    //store.dispatch({type: 'Show_Loading_new', loading: true})

    try {
      var gp = new window.Geoprocessor(`${gpUrl}`);
      params.Filters = JSON.stringify(params.Filters);
      gp.submitJob(params, (response) => {
        gp.getResultData(response.jobId, outputName, callback);
      });
    } catch (ex) {
      window.notifySystem("error", t("global.INTERNALSERVERERROR"));
      callbackError();
    }
  }
};

export const uploadGISFile = function (
  url,
  params,
  callback,
  outputName = "output_value"
) {
  if (url) {
    //store.dispatch({type: 'Show_Loading_new', loading: true})

    try {
      var gp = new window.Geoprocessor(`${url}?token=${window.esriToken}`);
      gp.submitJob(params, (response) => {
        gp.getResultData(response.jobId, outputName, callback);
      });
    } catch (ex) {
      window.notifySystem("error", t("global.INTERNALSERVERERROR"));
    }
  }
};

export const formatKmlAttributes = function (feature) {
  let popupInfo = feature.attributes.PopupInfo.split("</td>")
    .join("\n")
    .split("<td>")
    .join("\n")
    .split("\n")
    .join("\n")
    .split("</tr>")
    .join("\n")
    .split("<tr>")
    .filter(Boolean)
    .join("\n")
    .split("\n")
    .filter(Boolean);
  let y = [];
  popupInfo.forEach((item) => {
    if (!(item.indexOf("<") > -1) || item == "<Null>") y.push(item);
  });

  if (y.length % 2 != 0) {
    y.splice(0, 1);
  }

  let list = {};
  for (let i = 0; i < y.length; i += 2) {
    list[y[i]] = y[i + 1];
  }
  return list;
};

export const queryOnInvestLayers = function (where, layers, layersName) {
  let count = layers.length;
  var result = {};

  return new Promise((resolve, reject) => {
    layers.forEach((layer, key) => {
      queryTask({
        url: mapUrl + "/" + layer,
        where: where.join(" and "),
        outFields: layersSetting[layersName[key]].outFields,
        callbackResult: (data) => {
          count--;

          if (!result.features) result = data;
          else result.features.push.apply(result.features, data.features);

          if (count == 0) {
            resolve(result);
          }
        },
        returnGeometry: true,
        callbackError(error) {},
      });
    });
  });
};

export const objectPropFreqsInArray = (list, prop, val) => {
  var count = 0;
  if (list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][prop] === val) {
        count += 1;
      }
    }
  }
  if (count > 1) {
    return true;
  }
  return false;
};

export const objectPropFreqsInArrayForKroki = (list, prop, val) => {
  var count = 0;
  if (list.length > 0) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][prop] === val) {
        count += 1;
      }
    }
  }
  if (count > 1) {
    return true;
  }
  return false;
};

export const highlightGeometry = function (feature) {
  //noclear, layerName, isZoom, fillColor, strokeColor, isDashStyle, isHighlighPolygonBorder, callback, highlightWidth,zoomFactor) {
  LoadModules([
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/Polygon",
    "esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/PictureMarkerSymbol",
  ]).then(
    ([
      Point,
      Polyline,
      Polygon,
      Graphic,
      SimpleFillSymbol,
      SimpleLineSymbol,
      SimpleMarkerSymbol,
      PictureMarkerSymbol,
    ]) => {}
  );
};

export const checkParcelAdjacents = (parcels, isToBeHighlighted = true) => {
  getInfo().then((res) => {
    let LayerID = res;
    var token = "";
    var url = mapUrl + "/" + LayerID.Landbase_Parcel;
    if (window.esriToken) token = "?token=" + window.esriToken;
    var flayer = new esri.layers.FeatureLayer(url + token, {
      outFields: ["*"],
    });

    let besideParcels = [];
    let i = 0;
    if (parcels) {
      var query = new esri.tasks.Query();
      query.where = `PARCEL_SPATIAL_ID IN (${parcels
        .map((feature) => feature.attributes.PARCEL_SPATIAL_ID)
        .join(", ")})`;
      query.outFields = ["*"];
      flayer.queryFeatures(query, (featureSet) => {
        featureSet.features.forEach((parcel) => {
          var clonedGraphic = dojo.clone(parcel.geometry);
          getParcelAdjacents(clonedGraphic, url).then((res) => {
            i++;
            Array.prototype.push.apply(besideParcels, res.features);
            if (featureSet.features.length == i) {
              initAddParcelNo(
                [
                  ...new Map(
                    besideParcels
                      .filter((queryParcel) => {
                        return (
                          featureSet.features.filter((fsFeature) => {
                            return (
                              queryParcel.attributes.OBJECTID ==
                              fsFeature.attributes.OBJECTID
                            );
                          }).length == 0
                        );
                      })
                      .map((item) => [item["attributes"]["OBJECTID"], item])
                  ).values(),
                ],
                isToBeHighlighted
              );
            }
          });
        });
      });
    }
  });
};

export const checkOverlappingFeaturesWithLayer = (
  url,
  polygon,
  where,
  tempMap
) => {
  return new Promise((resolve, reject) => {
    let token;
    if (window.esriToken) token = "?token=" + window.esriToken;
    var flayer = new esri.layers.FeatureLayer(url + token, {
      outFields: ["*"],
    });
    var query = new esri.tasks.Query();
    query.where = where || "1=1"; // name of the district
    query.returnGeometry = true;
    query.outFields = ["*"]; // if you want all attribute being returned
    let polygonToContains = null;
    let includedPoints = [];
    let excludedPoints = [];
    let map = getMap();

    if (!map) {
      map = tempMap;
    }

    let pt;
    flayer.queryFeatures(query, (featureSet) => {
      //check existance of a Distric at that point

      if (featureSet.features.length > 0) {
        featureSet.features.forEach((feature) => {
          if (
            !polygonToContains &&
            feature.geometry &&
            feature.geometry.contains(polygon.getExtent().getCenter())
          ) {
            polygonToContains = feature;
            polygon.rings[0].forEach((point) => {
              pt = new esri.geometry.Point(
                point[0],
                point[1],
                map?.spatialReference || polygon?.spatialReference
              );
              if (point[0] && point[1]) {
                let isContained = !CheckShapesWithinBoundryOrNotUsingEsri(
                  feature.geometry,
                  pt,
                  "point"
                );

                if (isContained) {
                  includedPoints.push(
                    new esri.geometry.Point(
                      point[0],
                      point[1],
                      map?.spatialReference || polygon?.spatialReference
                    )
                  );
                } else {
                  excludedPoints.push(
                    new esri.geometry.Point(
                      point[0],
                      point[1],
                      map?.spatialReference || polygon?.spatialReference
                    )
                  );
                }
              }
            });
          }
        });
      }

      console.log("includedPointsCount:" + includedPoints.length);
      console.log("excludedPointsCount:" + excludedPoints.length);
      console.log("polygon rings:" + polygon.rings[0].length);
      if (!excludedPoints.length) {
        return resolve(featureSet);
      } else {
        return reject();
      }
    });
  });
};

export const getParcelAdjacents = (geometry, url) => {
  return new Promise((resolve, reject) => {
    intersectQueryTask({
      outFields: [
        "OBJECTID",
        "MUNICIPALITY_NAME",
        "PARCEL_AREA",
        "PARCEL_LAT_COORD",
        "PARCEL_LONG_COORD",
        "PARCEL_MAIN_LUSE",
        "PLAN_NO",
        "PARCEL_PLAN_NO",
        "USING_SYMBOL",
        "PARCEL_SPATIAL_ID",
      ],
      //spatialRelationship: esri.tasks.Query.SPATIAL_REL_TOUCHES,
      geometry: geometry, // features[0].geometry
      url: url,
      where: "PARCEL_PLAN_NO is not null",
      callbackResult: (res) => {
        return resolve(res);
      },
    });
    //}
  });
};

export const initAddParcelNo = (pacrels, isToBeHighlighted) => {
  //clearGraphicFromLayer(this.map, "MapPacrelNoGraphicLayer");
  //
  let map = getMap();

  // if (isToBeHighlighted) {
  //   highlightFeature(pacrels, map, {
  //     layerName: "SelectLandsGraphicLayer",
  //     noclear: false,
  //     isZoom: false,
  //     isHiglightSymbol: true,
  //     highlighColor: [0, 255, 0, 0.5],
  //     zoomFactor: 10,
  //   });
  // }
  pacrels.forEach((val) => {
    var pt;

    try {
      pt = val.geometry.getExtent().getCenter();
    } catch (e) {
      if (val.geometry.type == "polygon") {
        val.geometry = new esri.geometry.Polygon(val.geometry);
      }
      pt = val.geometry.getExtent().getCenter();
    }

    var angle = getPacrelNoAngle(val);

    addParcelNo(
      pt,
      map,
      localizeNumber(val.attributes.PARCEL_PLAN_NO),
      "PacrelUnNamedGraphicLayer",
      20,
      null,
      angle
    );
  });
};

export const highlightFeature = function (feature, map, settings) {
  //noclear, layerName, isZoom, fillColor, strokeColor, isDashStyle, isHighlighPolygonBorder, callback, highlightWidth,zoomFactor) {

  if (feature) {
    if (!settings.isSavePreviosZoom) window.extent = undefined;

    window.identify = false;
    LoadModules([
      "esri/geometry/Point",
      "esri/geometry/Polyline",
      "esri/geometry/Polygon",
      "esri/graphic",
      "esri/symbols/SimpleFillSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/PictureMarkerSymbol",
    ]).then(
      ([
        Point,
        Polyline,
        Polygon,
        Graphic,
        SimpleFillSymbol,
        SimpleLineSymbol,
        SimpleMarkerSymbol,
        PictureMarkerSymbol,
      ]) => {
        let symbol;

        let graphicLayer = map?.getLayer(settings.layerName);

        //

        if (!settings.noclear) graphicLayer.clear();

        // let highlightWidth = settings.highlightWidth || 3
        let fillColor = settings.fillColor || "black";
        let strokeColor = settings.strokeColor || "black";
        let highlighColor = settings.highlighColor || [0, 255, 255];
        let Color = window.dojo.Color;

        function highlightGeometry(feature) {
          if (feature.geometry) {
            if (feature.geometry.type == "polygon") {
              feature.geometry = new Polygon(feature.geometry);
              if (settings.isGetCenter) {
                feature.geometry = feature.geometry.getExtent().getCenter();
              }
            } else if (feature.geometry.type == "point") {
              feature.geometry = new Point(feature.geometry);
            }

            var graphic;

            if (feature.geometry.type === "point") {
              if (settings.isHiglightSymbol) {
                strokeColor = highlighColor;
                fillColor = settings.fillColor || highlighColor;
              }

              //settings.zoomFactor = 50
              symbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                28,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color(strokeColor),
                  2
                ),
                new Color([0, 0, 0, 0.2])
              );

              if (settings.isBorderOnly) {
                symbol = new SimpleMarkerSymbol(
                  SimpleMarkerSymbol.STYLE_NULL,
                  15,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color(strokeColor),
                    2
                  ),
                  new Color([0, 0, 0, 0.2])
                );
              }

              if (settings.isInvest) {
                symbol = new PictureMarkerSymbol({
                  angle: 0,
                  xoffset: 0,
                  yoffset: 0,
                  type: "esriPMS",
                  url: "./images/noty.svg",
                  contentType: "image/png",
                  width: 40,
                  height: 40,
                });
              } else if (settings.isInvestPoint) {
                symbol = new PictureMarkerSymbol({
                  angle: 0,
                  xoffset: 0,
                  yoffset: 0,
                  type: "esriPMS",
                  url: "./images/invest_point.svg",
                  contentType: "image/png",
                  width: 40,
                  height: 40,
                });
              } else if (settings.isLocation) {
                console.log("1");
                symbol = new PictureMarkerSymbol({
                  angle: 0,
                  xoffset: 0,
                  yoffset: 0,
                  type: "esriPMS",
                  url: "./images/marker2.png",
                  contentType: "image/png",
                  width: 20,
                  height: 20,
                });
              }
            } else if (feature.geometry.type === "polyline") {
              symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color(highlighColor || fillColor),
                7
              );
            } else {
              symbol = GetSymbol(
                settings,
                settings.fillColor || fillColor,
                strokeColor,
                SimpleFillSymbol,
                SimpleLineSymbol,
                PictureMarkerSymbol
              );
            }
            graphic = new Graphic(
              feature.geometry,
              symbol,
              (settings.attr &&
                isBoolean(settings.attr) &&
                feature.attributes) ||
                settings.attr
            );
          } else {
            if (feature.type === "point") {
              if (settings.isHiglightSymbol) {
                strokeColor = highlighColor;
                fillColor = settings.fillColor || highlighColor;
              }
              settings.zoomFactor = settings.pointZoomFactor || 50;
              symbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                28,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color(strokeColor),
                  2
                ),
                new Color(fillColor)
              );
              if (settings.isBorderOnly) {
                symbol = new SimpleMarkerSymbol(
                  SimpleMarkerSymbol.STYLE_NULL,
                  15,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color(strokeColor),
                    2
                  ),
                  new Color([0, 0, 0, 0.2])
                );
              }

              if (settings.isLocation) {
                console.log("2");
                symbol = new PictureMarkerSymbol({
                  angle: 0,
                  xoffset: 0,
                  yoffset: 0,
                  type: "esriPMS",
                  url: "./images/marker2.png",
                  contentType: "image/png",
                  width: 20,
                  height: 20,
                });
              }
            } else if (feature.type === "polyline") {
              symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color(highlighColor || fillColor),
                7
              );
            } else {
              symbol = GetSymbol(
                settings,
                settings.fillColor || fillColor,
                strokeColor,
                SimpleFillSymbol,
                SimpleLineSymbol,
                PictureMarkerSymbol
              );
            }
            graphic = new Graphic(
              feature,
              symbol,
              (settings.attr &&
                isBoolean(settings.attr) &&
                feature.attributes) ||
                settings.attr,
              null
            );
          }
          graphicLayer.add(graphic);

          if (!settings.listOfFeatures && settings.isZoom) {
            if (!feature.length) {
              zoomToFeature(
                [feature],
                map,
                settings.zoomFactor || 300,
                settings.callback
              );
            } else {
              zoomToFeature(
                feature,
                map,
                settings.zoomFactor || 300,
                settings.callback
              );
            }
          }

          graphicLayer.redraw();
        }
        // //
        if (feature && !feature.length) {
          if (feature.geometry || feature.type) {
            highlightGeometry(feature);
          }
        } else {
          if (
            feature &&
            feature[0] &&
            feature[0].geometry &&
            feature[0].geometry.type === "point"
          ) {
            if (settings.isHiglightSymbol) {
              strokeColor = highlighColor;
              fillColor = settings.fillColor || highlighColor;
            }
            settings.zoomFactor = 50;
            symbol = new SimpleMarkerSymbol(
              SimpleMarkerSymbol.STYLE_CIRCLE,
              10,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color(strokeColor),
                2
              ),
              new Color(fillColor)
            );
            if (settings.isBorderOnly) {
              symbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_NULL,
                15,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_SOLID,
                  new Color(strokeColor),
                  2
                ),
                new Color([0, 0, 0, 0.2])
              );
            }
          } else {
            symbol = GetSymbol(
              settings,
              settings.fillColor || fillColor,
              strokeColor,
              SimpleFillSymbol,
              SimpleLineSymbol,
              PictureMarkerSymbol
            );
          }

          feature.forEach(function (elem) {
            if (elem.geometry) {
              if (elem.geometry.type == "polygon") {
                elem.geometry = new Polygon(elem.geometry);
                if (settings.isGetCenter) {
                  elem.geometry = elem.geometry.getExtent().getCenter();
                }
              } else if (elem.geometry.type == "point") {
                elem.geometry = new Point(elem.geometry);
              } else if (elem.geometry.type == "polyline") {
                elem.geometry = new Polyline(elem.geometry);
              }
              if (settings.isBorderOnly) {
                symbol = new SimpleMarkerSymbol(
                  SimpleMarkerSymbol.STYLE_NULL,
                  15,
                  new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color(strokeColor),
                    2
                  ),
                  new Color([0, 0, 0, 0.2])
                );
              }
              if (settings.isInvest) {
                symbol = new PictureMarkerSymbol({
                  angle: 0,
                  xoffset: 0,
                  yoffset: 0,
                  type: "esriPMS",
                  url: "./images/noty.svg",
                  contentType: "image/png",
                  width: 40,
                  height: 40,
                });
              } else if (settings.isInvestPoint) {
                symbol = new PictureMarkerSymbol({
                  angle: 0,
                  xoffset: 0,
                  yoffset: 0,
                  type: "esriPMS",
                  url: "./images/invest_point.svg",
                  contentType: "image/png",
                  width: 40,
                  height: 40,
                });
              } else if (settings.isLocation) {
                symbol = new PictureMarkerSymbol({
                  angle: 0,
                  xoffset: 0,
                  yoffset: 0,
                  type: "esriPMS",
                  url: "./images/marker2.png",
                  contentType: "image/png",
                  width: 20,
                  height: 20,
                });
              }

              var graphic = new Graphic(
                elem.geometry,
                symbol,
                (settings.attr &&
                  isBoolean(settings.attr) &&
                  elem.attributes) ||
                  settings.attr,
                null
              );
              graphicLayer.add(graphic);
            } else if (elem.type == "point") {
              if (settings.isInvest) {
                symbol = new PictureMarkerSymbol({
                  angle: 0,
                  xoffset: 0,
                  yoffset: 0,
                  type: "esriPMS",
                  url: "./images/noty.svg",
                  contentType: "image/png",
                  width: 40,
                  height: 40,
                });
                if (settings.isBorderOnly) {
                  symbol = new SimpleMarkerSymbol(
                    SimpleMarkerSymbol.STYLE_NULL,
                    15,
                    new SimpleLineSymbol(
                      SimpleLineSymbol.STYLE_SOLID,
                      new Color(strokeColor),
                      2
                    ),
                    new Color([0, 0, 0, 0.2])
                  );
                }
              } else if (settings.isInvestPoint) {
                symbol = new PictureMarkerSymbol({
                  angle: 0,
                  xoffset: 0,
                  yoffset: 0,
                  type: "esriPMS",
                  url: "./images/invest_point.svg",
                  contentType: "image/png",
                  width: 40,
                  height: 40,
                });
              } else if (settings.isLocation) {
                symbol = new PictureMarkerSymbol({
                  angle: 0,
                  xoffset: 0,
                  yoffset: 0,
                  type: "esriPMS",
                  url: "./images/marker2.png",
                  contentType: "image/png",
                  width: 20,
                  height: 20,
                });
              }

              graphic = new Graphic(
                elem,
                symbol,
                (settings.attr &&
                  isBoolean(settings.attr) &&
                  elem.attributes) ||
                  settings.attr,
                null
              );
              graphicLayer.add(graphic);
            }
          });

          if (settings.isZoom) {
            if (!feature.length) {
              zoomToFeature(
                [feature],
                map,
                settings.zoomFactor || 150,
                settings.callback
              );
            } else {
              zoomToFeature(
                feature,
                map,
                settings.zoomFactor || 150,
                settings.callback
              );
            }
          }
          graphicLayer.redraw();
        }
      }
    );
  }
};

export const GetSymbol = function (
  settings,
  fillColor,
  strokeColor,
  SimpleFillSymbol,
  SimpleLineSymbol,
  PictureMarkerSymbol
) {
  // //
  let symbol;
  let Color = window.dojo.Color;
  let highlightWidth = settings.highlightWidth || 3;
  let highlighColor = settings.highlighColor || [0, 255, 255];
  if (settings.isLocation) {
    symbol = new PictureMarkerSymbol({
      angle: 0,
      xoffset: 0,
      yoffset: 0,
      type: "esriPMS",
      url: "./images/marker2.png",
      contentType: "image/png",
      width: 20,
      height: 20,
    });
  } else if (settings.isHiglightSymbol)
    symbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new Color(highlighColor),
        highlightWidth
      ),
      new Color(highlighColor)
    );
  else if (settings.isDashStyle)
    symbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_BACKWARD_DIAGONAL,
      new SimpleLineSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new Color(strokeColor),
        highlightWidth
      ),
      new Color(fillColor)
    );
  else if (settings.isHighlighPolygonBorder)
    symbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_NULL,
      new SimpleLineSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new Color(strokeColor),
        highlightWidth
      ),
      new Color(fillColor)
    );
  else
    symbol = new SimpleFillSymbol(
      SimpleFillSymbol.STYLE_NULL,
      new SimpleLineSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new Color(strokeColor),
        highlightWidth
      ),
      new Color(fillColor)
    );
  return symbol;
};

export const zoomToLayer = function (layerName, map, factor) {
  if (map?.getLayer(layerName).graphics.length > 0) {
    zoomToFeature(map?.getLayer(layerName).graphics, map, factor || 2);
  }
};

export const isArabicNumber = function (number) {
  return (
    number == "٠" ||
    number == "١" ||
    number == "٢" ||
    number == "٣" ||
    number == "٤" ||
    number == "٥" ||
    number == "٦" ||
    number == "٧" ||
    number == "٨" ||
    number == "٩"
  );
};

export const HasArabicCharacters = (text) => {
  var arregex = /[\u0600-\u06FF]/;
  return arregex.test(text);
};

// export const convertToArabic = (num) => {
//   if (num) {
//     let dates = [];
//     if (num.toString().split("/").length == 2)
//       dates = num.toString().match(/\d+([\/.-])\d+/g);
//     else dates = num.toString().match(/\d+([\/.-])\d+\1\d{4}/g);

//     if (dates && Array.isArray(dates)) {
//       dates.forEach((date) => {
//         num = num
//           .toString()
//           .replaceAll(date, date.split("/").reverse().join("/"));
//       });
//     }

//     var id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];

//     // if (num.toString().indexOf("/").length != -1) {
//     //   return num.toString()
//     //   .split("/")
//     //   .map((number) => {
//     //     return number.toString().trim().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
//     //   }).reverse().join(" / ");
//     // } else {
//     return num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
//     //}
//   } else {
//     return num != undefined && num != null && num.toString() == "0"
//       ? "0.00".toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d])
//       : "";
//   }
// };

export const convertToArabicToMap = (num) => {
  if (num) {
    if (num.indexOf("/") > -1) {
      num = num.split("/");
      num = num.reverse();
      num = num.join(" / ");
    }
  }
  if (num) {
    var id = ["۰", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹"];
    return num.replace(/[0-9]/g, function (w) {
      return id[+w];
    });
  } else {
    return "";
  }
};

export const map_subM = (parcels) => {
  if (isEmpty(parcels)) return;
  var sub_mun = [
    {
      name: "شرق الدمام",
      code: 1050101,
    },
    {
      name: "غرب الدمام",
      code: 1050102,
    },
    {
      name: "وسط الدمام",
      code: 1050103,
    },
    {
      name: "الظهران",
      code: 1051301,
    },
    {
      name: "الخبر الشمالية",
      code: 1050601,
    },
    {
      name: "الخبر الغربية",
      code: 1050602,
    },
    {
      name: "الخبر الجنوبية",
      code: 1050603,
    },
    {
      name: "الخبر",
      code: 1050604,
    },
    {
      name: "تاروت",
      code: 1051401,
    },
    {
      name: "سيهات",
      code: 1051601,
    },
    {
      name: "القطيف",
      code: 1050501,
    },
    {
      name: "عنك",
      code: 1051701,
    },
    {
      name: "صفوى",
      code: 1051501,
    },
    {
      name: "راس تنورة",
      code: 1050801,
    },
    {
      name: "القديح",
      code: 1050502,
    },
  ];
  ((Array.isArray(parcels) && parcels) || [parcels]).forEach((d) => {
    // if (
    //   !isNaN(d.attributes.SUB_MUNICIPALITY_NAME) &&
    //   d.attributes.SUB_MUNICIPALITY_NAME
    // )
    var sub = sub_mun.find((v) => {
      return (
        v.code == d.attributes.SUB_MUNICIPALITY_NAME ||
        v.name == d.attributes.SUB_MUNICIPALITY_NAME
      );
    });

    if (sub) {
      d.attributes.SUB_MUNICIPALITY_NAME = sub.name;
      d.attributes.SUB_MUNICIPALITY_NAME_Code = sub.code;
    }

    _.forEach(d.attributes, (value, key) => {
      if (["null", "Null", "NULL"].indexOf(value) > -1) {
        d.attributes[key] = null;
      }
    });
  });
};

export const map_object = (object) => {
  if (object && !Array.isArray(object)) {
    _.forEach(object, (value, key) => {
      if (typeof object[key] != "object") {
        if (["null", "Null", "NULL"].indexOf(value) > -1) {
          object[key] = null;
        }
      } else {
        map_object(object[key]);
      }
    });
  } else {
    _.map(object, (item) => {
      map_object(item);
    });
  }
};

export const delete_null_object = (object) => {
  if (object && !Array.isArray(object)) {
    _.forEach(object, (value, key) => {
      if (typeof object[key] != "object") {
        if (["null", "Null", "NULL", null].indexOf(value) > -1) {
          delete object[key];
        }
      } else {
        delete_null_object(object[key]);
      }
    });
  } else {
    _.map(object, (item) => {
      delete_null_object(item);
    });
  }

  return object;
};

export const landsNoSort = (d, key) => {
  return _.map((d[key] || d).split("/"), (d) => {
    return pad(d, 5);
  });
};

export const pad = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

export const pdfFileName = (path) => {
  //var pathes = path.split('/');
  //pathes[pathes.length-1] = 'pdf_'+ pathes[pathes.length-1]
  //return pathes.join('/');
  return path;
};

export const mappingCity = (mainObject, cities) => {
  if (
    mainObject?.landData?.landData?.lands?.parcels &&
    mainObject?.landData?.landData?.lands?.parcels[0]?.attributes?.CITY_NAME &&
    !(
      typeof mainObject?.landData?.landData?.lands?.parcels[0]?.attributes
        ?.CITY_NAME == "string"
    )
  ) {
    var city = _.find(cities, (d) => {
      return (
        mainObject?.landData?.landData?.lands?.parcels[0]?.attributes
          ?.CITY_NAME == d?.code
      );
    });
    if (city) {
      mainObject.landData.landData.lands.parcels[0].attributes.CITY_NAME =
        city?.name;
    }
  }
};

export const extractNumbers = (expr, num, isReverse) => {
  let dates = [];
  // num = num
  //   .toString()
  //   .split("/")
  //   .map((str) => str.trim())
  //   .join("/");
  dates = num.toString().match(expr);

  if (dates && Array.isArray(dates)) {
    dates.forEach((date) => {
      num =
        (!isReverse &&
          num.toString().replace(
            date,
            date
              .toString()
              ?.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d])
              ?.replaceAll(".", ",")
          )) ||
        num
          .toString()
          .replace(
            date,
            localizeNumber(date.toString().trim())
              ?.replaceAll(".", ",")
              ?.replaceAll(" ", "")
              .trim()
              .split("/")
              .reverse()
              .join("/")
              .trim()
          );
    });
  }

  return num;
};
export const convertToArabic = (num) => {
  var isArabic =
    HasArabicCharacters(num) &&
    (/[\u0660-\u0669]/.test(num) || /[\u06f0-\u06f9]/.test(num));
  if (isArabic) return num;
  num = convertToEnglish(num);
  let isDate = checkDate(num);
  if (num && /\d/.test(num)) {
    num = num
      .split("/")
      .map((r) => r.trim())
      .join(" / ");
    if (num.toString().match(/\//g)?.length == 2) {
      num = extractNumbers(/(\d{4})\/(\d{1,2})\/(\d{1,2})/g, num, !isDate);
      num = extractNumbers(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, num, isDate);
    }
    // num = extractNumbers(/(\d+)\/(\d{4})/g, num, true);
    // num = extractNumbers(/(\d{4})\/(\d+)/g, num, false);
    //
    num = extractNumbers(/(\d+\/?)+/g, num, true);
    return (
      (num.toString().trim().indexOf("/") == -1 &&
        localizeNumber(num.toString().trim())?.replaceAll(".", ",")) ||
      num?.toString()?.trim()
    ).replaceAll("< / ", "</");
    // );
  } else {
    return num != undefined && num != null && num.toString() == "0"
      ? "0.00"
          .toString()
          ?.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d])
          ?.replaceAll(".", ",")
      : num;
  }
};

export const getParcelLengths = (data) => {
  let northLength = 0,
    eastLength = 0,
    southLength = 0,
    westLength = 0;
  if (data?.data) {
    data?.data?.forEach((direction) => {
      direction?.data?.forEach((polygon) => {
        if (polygon?.lines) {
          polygon?.lines?.forEach((line, key) => {
            if (direction.name == "north") {
              northLength =
                (direction?.totalLength && +direction?.totalLength) ||
                northLength + line?.text;
            } else if (
              ["weast", "west"].indexOf(direction.name.toLowerCase()) != -1
            ) {
              westLength =
                (direction?.totalLength && +direction?.totalLength) ||
                westLength + line?.text;
            } else if (direction.name == "south") {
              southLength =
                (direction?.totalLength && +direction?.totalLength) ||
                southLength + line?.text;
            } else if (direction.name == "east") {
              eastLength =
                (direction?.totalLength && +direction?.totalLength) ||
                eastLength + line?.text;
            }
          });
        } else {
          if (direction.name == "north") {
            northLength =
              (direction?.totalLength && +direction?.totalLength) ||
              northLength + polygon?.text;
          } else if (
            ["weast", "west"].indexOf(direction.name.toLowerCase()) != -1
          ) {
            westLength =
              (direction?.totalLength && +direction?.totalLength) ||
              westLength + polygon?.text;
          } else if (direction.name == "south") {
            southLength =
              (direction?.totalLength && +direction?.totalLength) ||
              southLength + polygon?.text;
          } else if (direction.name == "east") {
            eastLength =
              (direction?.totalLength && +direction?.totalLength) ||
              eastLength + polygon?.text;
          }
        }
      });
    });
  } else if (data?.attributes) {
    eastLength = +data?.attributes?.east_length;
    northLength = +data?.attributes?.north_length;
    southLength = +data?.attributes?.south_length;
    westLength = +data?.attributes?.west_length;
  }
  return (
    <>
      <td>{convertToArabic(northLength.toFixed(2))} م</td>
      <td>{convertToArabic(southLength.toFixed(2))} م</td>
      <td>{convertToArabic(eastLength.toFixed(2))} م</td>
      <td>{convertToArabic(westLength.toFixed(2))} م</td>
    </>
  );
};

export const getParcelLengthsForContractPrint = (data) => {
  let northLength = 0,
    eastLength = 0,
    southLength = 0,
    westLength = 0;

  data?.data?.forEach((direction) => {
    direction?.data?.forEach((polygon) => {
      if (polygon?.lines) {
        polygon?.lines?.forEach((line, key) => {
          if (polygon.lineDirection == 1) {
            northLength =
              (direction?.totalLength && +direction?.totalLength) ||
              northLength + line?.text;
          } else if (polygon.lineDirection == 4) {
            westLength =
              (direction?.totalLength && +direction?.totalLength) ||
              westLength + line?.text;
          } else if (polygon.lineDirection == 3) {
            southLength =
              (direction?.totalLength && +direction?.totalLength) ||
              southLength + line?.text;
          } else if (polygon.lineDirection == 2) {
            eastLength =
              (direction?.totalLength && +direction?.totalLength) ||
              eastLength + line?.text;
          }
        });
      } else {
        if (polygon.lineDirection == 1) {
          northLength =
            (direction?.totalLength && +direction?.totalLength) ||
            northLength + polygon?.text;
        } else if (polygon.lineDirection == 4) {
          westLength =
            (direction?.totalLength && +direction?.totalLength) ||
            westLength + polygon?.text;
        } else if (polygon.lineDirection == 3) {
          southLength =
            (direction?.totalLength && +direction?.totalLength) ||
            southLength + polygon?.text;
        } else if (polygon.lineDirection == 2) {
          eastLength =
            (direction?.totalLength && +direction?.totalLength) ||
            eastLength + polygon?.text;
        }
      }
    });
  });

  return (
    <>
      <td>
        {`يحدها :${convertToArabic(data.north_Desc)} `}
        <br />
        {` بطول : ${convertToArabic(northLength.toFixed(2))}`} م
      </td>
      <td>
        {`يحدها :${convertToArabic(data.south_Desc)} `}
        <br />
        {` بطول : ${convertToArabic(southLength.toFixed(2))}`} م
      </td>
      <td>
        {`يحدها :${convertToArabic(data.east_Desc)} `}
        <br />
        {` بطول : ${convertToArabic(eastLength.toFixed(2))}`} م
      </td>
      <td>
        {`يحدها :${convertToArabic(data.west_Desc)} `}
        <br />
        {` بطول : ${convertToArabic(westLength.toFixed(2))}`} م
      </td>
    </>
  );
};

export const checkImage = (
  props,
  d,
  style = { width: "45px", height: "45px" }
) => {
  let filteredImg;
  let imgSrc;
  let imgHtml;
  let downloadFiles = [".pdf", ".PDF", ".dwg", ".docx"];
  let viewFiles = [".jpg", ".jpeg", ".png"];
  if (d && typeof d == "string") {
    filteredImg = remove_duplicate(d);
    imgSrc =
      d?.includes(".pdf") || d?.includes(".PDF")
        ? "images/pdf.png"
        : d?.includes(".dwg")
        ? "images/cad.png"
        : d?.includes(".doc") || d?.includes(".docx")
        ? "images/docs.png"
        : remove_duplicate(d);
    imgHtml =
      filteredImg?.includes(".pdf") ||
      filteredImg?.includes(".PDF") ||
      filteredImg?.includes(".dwg") ||
      filteredImg?.includes(".docx") ? (
        <a href={filteredImg} target="_blank" rel="noreferrer">
          <img
            src={imgSrc}
            style={{ width: "45px", height: "45px" }}
            className="pdf_img"
          />
        </a>
      ) : (
        <a
          onClick={() => {
            // props.setMain("Popup", {
            //   popup: {
            //     type: "confirm",
            //     imageModal: true,
            //     imgUrl: filteredImg,
            //     // ...style
            //   },
            // });
            window.open(filteredImg, "_blank");
          }}
        >
          <img src={imgSrc} style={{ ...style }} className="img_mol5s" />
        </a>
      );
  } else if (Array.isArray(d)) {
    const captionStyle = {
      fontSize: "2em",
      fontWeight: "bold",
    };
    const slideNumberStyle = {
      fontSize: "20px",
      fontWeight: "bold",
    };
    imgHtml =
      // (
      //   <Carousel
      //     data={d.map((img) => {
      //       let imageData =
      //         (img?.data || img)?.includes(".pdf") ||
      //         (img?.data || img)?.includes(".PDF")
      //           ? "images/pdf.png"
      //           : (img?.data || img)?.includes(".dwg")
      //           ? "images/cad.png"
      //           : (img?.data || img)?.includes(".docx") ||
      //             (img?.data || img)?.includes(".doc")
      //           ? "images/docs.png"
      //           : remove_duplicate(img?.data || img);
      //       return {
      //         image: imageData,
      //         caption: imageData.replace(/^.*[\\\/]/, ""),
      //       };
      //     })}
      //     time={2000}
      //     width= {style.width || "850px"}
      //     height={style.height || "500px"}
      //     captionStyle={captionStyle}
      //     radius="10px"
      //     slideNumber={true}
      //     slideNumberStyle={slideNumberStyle}
      //     captionPosition="bottom"
      //     automatic={true}
      //     dots={true}
      //     pauseIconColor="white"
      //     pauseIconSize="40px"
      //     //slideBackgroundColor="darkgrey"
      //     slideImageFit="cover"
      //     thumbnails={true}
      //     thumbnailWidth="100px"
      //     style={{
      //       textAlign: "center",
      //       maxWidth: style.width || "850px",
      //       maxHeight: style.height || "500px",
      //       margin: "40px auto",
      //     }}
      //   />
      // ) ||
      d?.map((img) => {
        //filteredImg = remove_duplicate(img?.data || img);
        imgSrc =
          (img?.data || img)?.includes(".pdf") ||
          (img?.data || img)?.includes(".PDF")
            ? "images/pdf.png"
            : (img?.data || img)?.includes(".dwg")
            ? "images/cad.png"
            : (img?.data || img)?.includes(".docx") ||
              (img?.data || img)?.includes(".doc")
            ? "images/docs.png"
            : remove_duplicate(img?.data || img);
        if (
          (img?.data || img)?.includes(".pdf") ||
          (img?.data || img)?.includes(".PDF") ||
          (img?.data || img)?.includes(".dwg") ||
          (img?.data || img)?.includes(".docx")
        ) {
          return (
            <a
              href={img?.data ? filesHost + img?.data : filesHost + img}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={imgSrc}
                className="pdf_img"
                style={{ width: "45px", height: "45px" }}
              />
            </a>
          );
        } else {
          return (
            <a
              onClick={() => {
                // props.setMain("Popup", {
                //   popup: {
                //     type: "confirm",
                //     imageModal: true,
                //     imgUrl: remove_duplicate(img?.data || img),
                //     // ...style
                //   },
                // });
                window.open(remove_duplicate(img?.data || img), "_blank");
              }}
            >
              <img src={imgSrc} style={{ ...style }} className="img_mol5s" />
            </a>
          );
        }
      });
  }

  return imgHtml;
};

export const remove_duplicate = (url) => {
  if (url?.length > 0) {
    return (
      (typeof url == "string" &&
        filesHost +
          url
            .split("/")
            .filter((d) => d.toLowerCase() != "GISAPI".toLowerCase())
            .join("/")
            .toString()
            .substring(
              url.toLowerCase().indexOf("subattachments"),
              url.length
            )) ||
      (Array.isArray(url) &&
        url.map((img) => {
          return (
            filesHost +
            img
              .split("/")
              .filter((d) => d.toLowerCase() != "GISAPI".toLowerCase())
              .join("/")
              .toString()
              .substring(
                img.toLowerCase().indexOf("subattachments"),
                img.length
              )
          );
        }))
    );
  } else {
    return;
  }
};

export const isAbsolute = (path) => {
  return path.charAt(0) === "/";
};

export const getExtension = (path) => {
  var basename = path.split(/[\\/]/).pop(), // extract file name from full path ...
    // (supports `\\` and `/` separators)
    pos = basename.lastIndexOf("."); // get last position of `.`

  if (basename === "" || pos < 1)
    // if file name is empty or ...
    return ""; //  `.` not found (-1) or comes first (0)

  return basename.slice(pos + 1); // extract extension ignoring `.`
};
export const getDropOptions = async (url, params) => {
  return new Promise((resolve, reject) => {
    let reqBody =
      (params &&
        Axios.get(url, {
          params: params,
        })) ||
      Axios.get(url);

    reqBody.then(
      ({ data }) => {
        return resolve(data.results);
      },
      (err) => {
        return reject();
      }
    );
  });
};

export const get_print_data_by_id = async (id) => {
  // return new Promise((resolve, reject) => {
  // const { data } = useQuery("", () => {
  //   return Axios.get(workFlowUrl + "/api/Submission/" + id);
  // });
  let submissionData = await Axios.get(
    workFlowUrl + "/api/Submission/" + id
  ).then(({ data }) => {
    return data;
  });
  let mainObjectJson = await Axios.get(
    backEndUrlforMap + submissionData.submission_file_path + "mainObject.json"
  );
  mainObjectJson =
    (typeof mainObjectJson == "string" &&
      JSON.parse(window.lzString.decompressFromBase64(mainObjectJson))) ||
    mainObjectJson;
  return { submissionData, mainObjectJson };
  //  mainObject;
};

export const convertToEnglish = (string) => {
  if (string && string.toString().match(/\//g)?.length == 2) {
    string =
      extractNumbers(/(\d{4})\/(\d{1,2})\/(\d{1,2})/g, string, true) || string;
  }
  return ((string || "") + "")
    .replace(/[\u0660-\u0669]/g, function (c) {
      return c.charCodeAt(0) - 0x0660;
    })
    .replace(/[\u06f0-\u06f9]/g, function (c) {
      return c.charCodeAt(0) - 0x06f0;
    });
};

export const reverseString = (s) => {
  return [...s.split("/")]
    .reverse()
    .filter((r) => !_.isEmpty(r.trim()))
    .map((r) => r.trim())
    .join(" / "); //[...s].reverse().map(r => r.trim()).join(" / ");
};

export const isValidUrl = (urlString) => {
  let isValid = true;
  var image = new Image();
  image.onerror = function () {
    isValid = false;
  };
  image.src = urlString;
  return (isValid && urlString) || "";
};

// export const addParcelNo = function (
//   point,
//   map,
//   text,
//   layerName,
//   fontsize,
//   color,
//   angle,
//   offset,
//   attr,
//   notLocalize
// ) {
//   //
//   // LoadModules([
//   //   "esri/symbols/Font",
//   //   'esri/geometry/Point',
//   //   "esri/symbols/TextSymbol", 'esri/Color',
//   //   'esri/graphic']).then(([Font,Point,TextSymbol,Color,Graphic]) => {

//   //
//   if (text) {
//     if (text.length == 2) {
//       if (isArabicNumber(text[0]) || isArabicNumber(text[1])) {
//         text = text[0] + "" + text[1];
//       }
//     }
//   }
//   if (!notLocalize) text = localizeNumber(text);

//   ////
//   // if (text) {
//   //   if (text.indexOf(" / ") > -1) {
//   //     text = text.split("/").map((element) => element.trim());
//   //     text = text.join(" / ");
//   //     //text = reverseString(text);
//   //   } else if (text.indexOf("/") > -1) {
//   //     text = text.split("/").map((element) => element.trim());
//   //     text = text.join("/");
//   //   }
//   // }

//   // if (text) {
//   //   if (text.indexOf("\\") > -1) {
//   //     text = text.replaceAll("\\", "/");
//   //   }
//   // }

//   var font = new esri.symbol.Font();
//   font.setSize(fontsize || 28);
//   font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
//   var textSymbol = new esri.symbol.TextSymbol(text);
//   textSymbol.setColor(new esri.Color(color || [0, 0, 0]));
//   //textSymbol.setAlign(TextSymbol.ALIGN_START);
//   //if (offset) textSymbol.setOffset(offset.x, offset.y);
//   if (offset) {
//     point.x += offset.x;
//     point.y += offset.y;
//   }
//   textSymbol.setAngle(angle || 15);
//   textSymbol.setFont(font);
//   var attributes = attr || null;
//   var layer = map?.getLayer(layerName);
//   var pt = new esri.geometry.Point(point);

//   project(
//     [pt],
//     map.spatialReference.wkid,
//     (res) => {
//       if (layer) layer.add(new esri.Graphic(res[0], textSymbol, attributes));
//     },
//     true
//   );
//   //})
// };

const addLayerFeature = (map, layerName, response) => {
  let maplayerIndex = map.graphicsLayerIds.findIndex((r) => r == layerName);
  let layerIndex = window.loadedLayers.findIndex(
    (r) => r.layerName == layerName
  );

  if (layerIndex > -1) {
    let graphicIndex = window.loadedLayers[layerIndex].graphics.findIndex(
      (r) => {
        return (
          (r?.geometry?.x &&
            response?.geometry?.x &&
            r?.geometry?.x == response?.geometry?.x &&
            r?.geometry?.y == response?.geometry?.y) ||
          (r?.geometry?.rings &&
            response?.geometry?.rings &&
            response?.geometry?.rings[0].filter(
              (t, i) =>
                t?.[0]?.[0] == r?.geometry?.rings?.[0]?.[i]?.[0] &&
                t?.[0]?.[1] == r?.geometry?.rings?.[0]?.[i]?.[1]
            ).length == r?.geometry?.rings[0].length) ||
          (r?.geometry?.paths &&
            response?.geometry?.paths &&
            response?.geometry?.paths[0].filter(
              (t, i) =>
                t?.[0]?.[0] == r?.geometry?.paths?.[0]?.[i]?.[0] &&
                t?.[0]?.[1] == r?.geometry?.paths?.[0]?.[i]?.[1]
            ).length == r?.geometry?.paths[0].length)
        );
      }
    );

    if (graphicIndex != -1) {
      window.loadedLayers[layerIndex].graphics[graphicIndex] =
        response.toJson();
    } else {
      window.loadedLayers[layerIndex].graphics.push(response.toJson());
    }
  } else {
    window.loadedLayers.splice(0, 0, {
      layerIndex: maplayerIndex,
      layerName: layerName,
      graphics: [response.toJson()],
    });
  }
};

export const addParcelNo = function (
  point,
  map,
  text,
  layerName,
  fontsize,
  color,
  angle,
  offset,
  attr,
  notLocalize,
  callback,
  loadOnMap = true
) {
  //
  // LoadModules([
  //   "esri/symbols/Font",
  //   'esri/geometry/Point',
  //   "esri/symbols/TextSymbol", 'esri/Color',
  //   'esri/graphic']).then(([Font,Point,TextSymbol,Color,Graphic]) => {

  //
  if (text) {
    if (text.length == 2) {
      if (isArabicNumber(text[0]) || isArabicNumber(text[1])) {
        text = text[0] + "" + text[1];
      }
    }
  }
  if (!notLocalize) text = localizeNumber(text);

  ////
  // if (text) {
  //   if (text.indexOf(" / ") > -1) {
  //     text = text.split("/").map((element) => element.trim());
  //     text = text.join(" / ");
  //     //text = reverseString(text);
  //   } else if (text.indexOf("/") > -1) {
  //     text = text.split("/").map((element) => element.trim());
  //     text = text.join("/");
  //   }
  // }

  // if (text) {
  //   if (text.indexOf("\\") > -1) {
  //     text = text.replaceAll("\\", "/");
  //   }
  // }

  var font = new esri.symbol.Font();
  font.setSize(fontsize || 28);
  font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
  var textSymbol = new esri.symbol.TextSymbol(text);
  textSymbol.setColor(new esri.Color(color || [0, 0, 0]));
  //textSymbol.setAlign(TextSymbol.ALIGN_START);
  //if (offset) textSymbol.setOffset(offset.x, offset.y);
  if (offset) {
    point.x += offset.x;
    point.y += offset.y;
  }
  textSymbol.setAngle(angle || 15);
  textSymbol.setFont(font);
  var attributes = attr || null;
  var layer = map?.getLayer(layerName);
  var pt = new esri.geometry.Point(point);

  if (
    !pt.spatialReference.wkid ||
    (pt.spatialReference.wkid &&
      pt.spatialReference.wkid != map.spatialReference.wkid)
  ) {
    project(
      [pt],
      map.spatialReference.wkid,
      (res) => {
        if (loadOnMap) {
          if (layer)
            layer.add(new esri.Graphic(res[0], textSymbol, attributes));
          if (callback)
            callback(new esri.Graphic(res[0], textSymbol, attributes));
        } else {
          addLayerFeature(
            map,
            layerName,
            new esri.Graphic(res[0], textSymbol, attributes)
          );
        }
      },
      true
    );
  } else {
    if (loadOnMap) {
      if (layer) layer.add(new esri.Graphic(pt, textSymbol, attributes));
      if (callback) callback(new esri.Graphic(pt, textSymbol, attributes));
    } else {
      addLayerFeature(
        map,
        layerName,
        new esri.Graphic(pt, textSymbol, attributes)
      );
    }
  }
  //})
};

export const getFileName = (url) => {
  if (url) {
    var m = url.toString().match(/.*\/(.+?)\./);

    if (m && m.length > 1) {
      return m[1];
    }
  }
  return "";
};

export const convertListToString = (lst, objField) => {
  var list =
    lst?.map(function (d) {
      return eval(`d.${objField}`);
    }) || [];
  var mappedList = list.map(function (d, index) {
    return convertToArabic(index + 1 + " - " + d);
  });
  return mappedList.join(" ");
};

export const convertStringToList = (
  input,
  regex = /(\d+\-\d*)\s?(.*?)(?=\d+\-|$)/gs
) => {
  return input.match(regex);
};

export const getUsingSymbol = function (code) {
  if (window.mapInfo) {
    var layer = _.find(window.mapInfo.info.$layers.layers, function (d) {
      return d.name == "Landbase_Parcel";
    });
    var usingSymbol = _.find(layer.fields, function (d) {
      return d.name == "USING_SYMBOL";
    });
    return (
      code &&
      _.find(usingSymbol?.domain?.codedValues || [], function (d) {
        return d.code?.replace(/ /g, "") == code;
      })
      //   ||
      // usingSymbol?.domain?.codedValues
    );
  }

  return null;
};

export const getUsingSymbolCode = function (layerId, domainField, domainText) {
  if (window.mapInfo) {
    var layer = _.find(window.mapInfo.info.$layers.layers, function (d) {
      return d.id == layerId;
    });
    var usingSymbol = _.find(layer.fields, function (d) {
      return d.name == domainField;
    });
    return (
      domainText &&
      _.find(usingSymbol?.domain?.codedValues || [], function (d) {
        return d.name == domainText;
      })?.code
      //   ||
      // usingSymbol?.domain?.codedValues
    );
  }

  return null;
};

export const getUsingSymbols = function () {
  return new Promise((resolve, reject) => {
    esriRequest(`${mapUrl}/3`).then((res) => {
      var usingSymbol = _.find(res?.fields, function (d) {
        return d.name == "USING_SYMBOL";
      });
      return resolve(usingSymbol?.domain?.codedValues || []);
    });
  });
};

export const setParcelName = (strings) => {
  return _(strings)
    .filter(function (d) {
      return d;
    })
    .join("/");
};

export const localizeNumber = (input) => {
  // if (($translate.use() == "ar") && input != null) {

  var newValue = "";
  var tempStr = String(input);
  // //
  var engStart = "0".charCodeAt(),
    arStart = "٠".charCodeAt();
  var diff = arStart - engStart;
  for (var i = 0, n = tempStr.length; i < n; i++) {
    var ch = tempStr.charCodeAt(i);
    if (ch >= engStart && ch <= engStart + 9) {
      newValue = newValue + String.fromCharCode(ch + diff);
    } else if (tempStr[i] == "/") {
      var pre =
        tempStr.charCodeAt(i - 1) >= engStart &&
        tempStr.charCodeAt(i - 1) <= engStart + 9;
      if (i != n - 1) {
        var post =
          tempStr.charCodeAt(i + 1) >= engStart &&
          tempStr.charCodeAt(i + 1) <= engStart + 9;
      }
      if (pre && post) newValue += " / ";
      else newValue += String.fromCharCode(ch);
    } else {
      newValue = newValue + String.fromCharCode(ch);
    }
  }
  // } else {
  //     newValue = input;
  // }
  return newValue;
};

export const getObjectPath = (obj, start, path, paths) => {
  if (
    obj !== null &&
    obj[`${start}`] !== null &&
    typeof obj[`${start}`] == "object"
  ) {
    Object.keys(obj[`${start}`]).forEach((key) => {
      getObjectPath(
        obj[`${start}`],
        key,
        (path && `${path}.${key}`) || `${start}.${key}`,
        paths
      );
    });

    paths.push(path);
  }
};

export const findObject = (obj, item) => {
  var path = find(obj, item);
  if (path == null) {
    return "";
  }
  return 'myObj["' + path.join('"]["') + '"]';
};

export const getColorFromCadIndex = (index) => {
  index = index || 0;
  var colors = [
    [0, 0, 0],
    [255, 0, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 255, 255],
    [0, 0, 255],
    [255, 0, 255],
    [0, 0, 0],
    [65, 65, 65],
    [128, 128, 128],
  ];

  return colors[index > 0 ? Math.abs(index) % 10 : Math.abs(index + 7) % 10];
};

export const mapSreenShot = function (
  map,
  printResult,
  error,
  removeBaseMap,
  folderName,
  isHideSatellite
) {
  store.dispatch({ type: "Show_Loading_new", loading: true });
  LoadModules([
    "esri/tasks/PrintTemplate",
    "esri/tasks/PrintTask",
    "esri/tasks/PrintParameters",
    "dojo/_base/json",
  ]).then(([PrintTemplate, PrintTask, PrintParameters, _JSON]) => {
    var template = PrintTemplate();
    var serverUrl = workFlowUrl;
    template.exportOptions = {
      dpi: 96,
      width: map?.width || 1400,
      height: map?.height || 600,
    };
    template.format = "JPG";
    template.width = 100;
    template.preserveScale = false;
    template.showAttribution = false;
    template.showLabels = false;
    template.layout = "MAP_ONLY";

    var params = PrintParameters();
    params.map = map;
    params.removeBaseMap = removeBaseMap;
    params.template = template;
    let url = serverUrl + "/PrintTask/execute";
    let operationalLayers = [];

    var spatialRefrence = map?.spatialReference;
    map?.graphicsLayerIds.forEach(function (layer) {
      var l = map?.getLayer(layer);
      if (l) {
        l.spatialReference = spatialRefrence;
        l.graphics = l.graphics
          .filter(
            (graphic) =>
              graphic != null &&
              graphic.geometry != null &&
              graphic.symbol != null
          )
          .map(function (g) {
            if (g.geometry) g.geometry.spatialReference = spatialRefrence;
            if (g.symbol) g.symbol.text = convertToArabic(g?.symbol?.text);
            if (g?.symbol && g?.symbol?.text) {
              if (g?.symbol?.text && g?.symbol?.text?.indexOf(" / ") > -1) {
                g.symbol.text = g?.symbol?.text
                  .split(" / ")
                  .reverse()
                  .join(" / ");

                // g?.symbol?.font?.setFamily("arial");
              }
            }
            return g;
          });
      }
    });

    var printTask = new PrintTask();
    var mapDefinition = printTask._getPrintDefinition(map);
    if (removeBaseMap) {
      mapDefinition.operationalLayers = mapDefinition.operationalLayers.filter(
        (layer) => layer.id != "basemap"
      );
    }

    let asJSON = {
      Format: template.format,
      Layout_Template: template.layout,
      Web_Map_as_JSON: {
        exportOptions: {
          dpi: template.exportOptions.dpi,
          outputSize: [
            template.exportOptions.width,
            template.exportOptions.height,
          ],
        },
        mapOptions: mapDefinition.mapOptions,
        operationalLayers: isHideSatellite
          ? mapDefinition.operationalLayers.filter((x) => x.id != "bs")
          : mapDefinition.operationalLayers,
      },
    };
    uploadGISFile(
      `${window.restServicesPath}/WebMap_ScreenShot/GPServer/WebMap_ScreenShot`,
      {
        width: template.exportOptions.width,
        height: template.exportOptions.height,
        quality: template.exportOptions.dpi,
        Web_Map_as_JSON: _JSON.toJson(asJSON.Web_Map_as_JSON),
        //folder_name: folderName || ''
      },
      (data) => {
        store.dispatch({ type: "Show_Loading_new", loading: false });
        printResult(data);
      }
    );
  });
};

export const applyEditsMultiple = (serviceUrl, transactionObject) => {
  var formmData = new FormData();
  formmData.append("edits", transactionObject);
  formmData.append("rollbackOnFailure", true);
  formmData.append("returnEditMoment", true);
  return esri.request(
    {
      url: serviceUrl.replace("MapServer", "FeatureServer") + "/applyEdits",
      content: {
        f: "json",
        token: window.esriToken,
        method: "post",
        handleAs: "json",
      },
      handleAs: "json",
      timeout: 600000,
      form: formmData,
      callbackParamName: "callback",
    },
    {
      handleAs: "json",
      usePost: true,
      returnProgress: true,
    }
  );
};

export const applyEditsByParams = (layerName, processType, objects) => {
  return new Promise((resolve, reject) => {
    esriRequest(window.mapUrl + "/layers").then(
      function (maplayers) {
        var layerIndex = maplayers.layers.filter((layer) => {
          return layer.name == layerName;
        })[0].id;

        var formData = new FormData();
        formData.append("features", JSON.stringify(objects));
        formData.append("rollbackOnFailure", true);
        formData.append("returnEditMoment", true);

        var requestHandle = esri.request(
          {
            url: `${window.mapUrl.replace(
              "MapServer",
              "FeatureServer"
            )}/${layerIndex}/${processType}`,
            content: { f: "json", token: window.esriToken },
            callbackParamName: "callback",
            handleAs: "json",
            form: formData,
          },
          { usePost: "true", returnProgress: true }
        );

        return resolve(requestHandle);
      },
      function () {
        return reject();
      }
    );
  });
};

const checkNoOfBoundryPolygons = (boundry) => {
  if (boundry.length > 1) {
    window.notifySystem("error", "polygon تحتوي على أكتر من  boundry طبقة");
    return false;
  }

  return true;
};

const checLayerFeatures = (layerData, layerName, layerType) => {
  if (layerData.length && layerType == "polygon") {
    if (layerData[0].rings) {
      if (
        layerData[0].rings[0].length > 1 &&
        layerData[0].rings[0].filter(
          (ring) =>
            ring[0] == layerData[0].rings[0][0][0] &&
            ring[1] == layerData[0].rings[0][0][1]
        ).length == 1
      ) {
        window.notifySystem(
          "error",
          `غير مغلقة polygons تحتوي على ${layerName} طبقة`
        );
        return false;
      } else if (
        layerData[0].rings[0].length > 1 &&
        layerData[0].rings[0].filter((ring) => ring.length == 1).length > 0
      ) {
        window.notifySystem("error", `تحتوي على نطقة واحدة ${layerName} طبقة`);
        return false;
      }
    } else if (layerData[0].paths) {
      window.notifySystem("error", `polylines تحتوي على ${layerName} طبقة`);
      return false;
    } else if (layerData[0].x && layerData[0].y) {
      window.notifySystem("error", `points تحتوي على ${layerName} طبقة`);
      return false;
    }
  } else if (layerData.length && layerType == "polyline") {
    if (layerData[0].paths) {
      if (layerData[0].paths[0].filter((path) => path.length == 1).length > 0) {
        window.notifySystem("error", `تحتوي على نقطة واحدة ${layerName} طبقة`);
        return false;
      }
    } else if (layerData[0].x && layerData[0].y) {
      window.notifySystem("error", `points تحتوي على  ${layerName} طبقة`);
      return false;
    }
  } else if (layerData.length && layerType == "point") {
    if (
      layerData.filter(
        (point) => !point.shape.x || !point.shape.y || !point.text
      ).length > 0
    ) {
      window.notifySystem(
        "error",
        `تحتوي على نقاط غير معرفة ${layerName} طبقة`
      );
      return false;
    }
  }

  return true;
};

export const CheckPolygonPointsWithinBoundry = (
  boundryExtent,
  layerDataItem
) => {
  let centerPoint;
  let isValid = true;
  let parcel = new esri.geometry.Polygon(layerDataItem);
  let container = new esri.geometry.Polygon(boundryExtent);
  let count = 0;
  for (let i = 0; i < parcel.rings[0].length; i++) {
    if (
      window.geometryEngine.within(
        new esri.geometry.Point(parcel.rings[0][i]),
        container
      ) ||
      window.geometryEngine.touches(
        new esri.geometry.Point(parcel.rings[0][i]),
        container
      ) ||
      window.geometryEngine.intersects(
        new esri.geometry.Point(parcel.rings[0][i]),
        container
      ) ||
      window.geometryEngine.overlaps(
        new esri.geometry.Point(parcel.rings[0][i]),
        container
      ) ||
      window.geometryEngine.crosses(
        new esri.geometry.Point(parcel.rings[0][i]),
        container
      ) ||
      window.geometryEngine.contains(
        container,
        new esri.geometry.Point(parcel.rings[0][i])
      )
    ) {
      count++;
    }
  }

  return count == parcel.rings[0].length;
};

export const CheckShapesWithinBoundryOrNot = (
  boundryExtent,
  layerDataItem,
  isContained = false
) => {
  let centerPoint;
  let isValid = true;
  let point;
  let line;
  let polygon;
  if (layerDataItem.rings || layerDataItem.paths) {
    let ringsOrPaths =
      (layerDataItem.rings &&
        new esri.geometry.Polygon(layerDataItem).rings[0]) ||
      new esri.geometry.Polyline(layerDataItem).paths[0];
    for (let y = 0; y < ringsOrPaths.length - 1; y++) {
      centerPoint = [ringsOrPaths[y][0], ringsOrPaths[y][1]];
      point = turf.point([...centerPoint]);

      let polygonRings = boundryExtent.rings.map((ring) =>
        ring.map((position, index) => [position[0], position[1]])
      );
      polygon = turf.polygon(polygonRings);

      line = turf.lineString([...polygonRings[0]]);

      isValid =
        turf.booleanPointInPolygon(point, polygon) ||
        turf.inside(point, polygon) ||
        turf.booleanPointOnLine(point, line) ||
        turf.booleanWithin(point, line) ||
        turf.booleanIntersects(line, point) ||
        turf.booleanContains(line, point);

      if (!isValid) break;
    }
  } else {
    centerPoint = [layerDataItem.shape.x, layerDataItem.shape.y];
    point = turf.point([...centerPoint]);
    let polygonRings = boundryExtent.rings.map((ring) =>
      ring.map((position, index) => [position[0], position[1]])
    );
    polygon = turf.polygon(polygonRings);

    line = turf.lineString([...polygonRings[0]]);
    isValid =
      turf.booleanPointInPolygon(point, polygon) ||
      turf.inside(point, polygon) ||
      turf.booleanPointOnLine(point, line) ||
      turf.booleanWithin(point, line) ||
      turf.booleanIntersects(line, point) ||
      turf.booleanContains(line, point);
  }

  return isContained ? isValid : isValid == false;
};

const CheckPointsWithinPolygonOrNotUsingEsri = (polygon, point) => {
  let map = getMap();

  if (!point?.spatialReference?.wkid && map) {
    point.spatialReference = map.spatialReference;
  }
  if (!polygon?.spatialReference?.wkid && map) {
    polygon.spatialReference = map.spatialReference;
  }
  let isWithin = window.geometryEngine.within(
    new esri.geometry.Point(point),
    new esri.geometry.Polygon(polygon)
  );
  return isWithin;
};

export const CheckShapeOverlapWithBoundry = (
  boundryExtent,
  layerDataItem,
  shapeType = "polygon"
) => {
  let map = getMap();

  if (!boundryExtent || !layerDataItem) return false;

  if (layerDataItem && !layerDataItem?.spatialReference?.wkid) {
    layerDataItem.spatialReference = map.spatialReference;
  }
  if (boundryExtent && !boundryExtent?.spatialReference?.wkid) {
    boundryExtent.spatialReference = map.spatialReference;
  }

  let boundry = esri.geometry.Polygon(boundryExtent);
  let shape;

  if (layerDataItem) {
    delete layerDataItem.cache;
  }

  switch (shapeType) {
    case "polygon":
      shape = new esri.geometry.Polygon(layerDataItem);
      break;
    case "point":
      shape = new esri.geometry.Point(layerDataItem);
      break;
    case "polyline":
      shape = new esri.geometry.Polyline(layerDataItem);
      break;
  }

  let isWithin =
    window.geometryEngine.within(shape, boundry) ||
    window.geometryEngine.contains(boundry, shape) ||
    window.geometryEngine.intersects(boundry, shape) ||
    window.geometryEngine.overlaps(boundry, shape);
  return isWithin;
};

const CheckShapesWithinBoundryOrNotUsingEsri = (
  boundryExtent,
  layerDataItem,
  shapeType = "polygon"
) => {
  let map = getMap();

  if (!boundryExtent || !layerDataItem) return false;

  if (layerDataItem && !layerDataItem?.spatialReference?.wkid) {
    layerDataItem.spatialReference = map.spatialReference;
  }
  if (boundryExtent && !boundryExtent?.spatialReference?.wkid) {
    boundryExtent.spatialReference = map.spatialReference;
  }

  let shape;
  switch (shapeType) {
    case "polygon":
      shape = new esri.geometry.Polygon(layerDataItem);
      break;
    case "point":
      shape = new esri.geometry.Point(layerDataItem);
      break;
    case "polyline":
      shape = new esri.geometry.Polyline(layerDataItem);
      break;
  }

  let isWithin =
    window.geometryEngine.within(shape, boundryExtent) ||
    window.geometryEngine.contains(boundryExtent, shape) ||
    window.geometryEngine.intersects(boundryExtent, shape) ||
    window.geometryEngine.overlaps(boundryExtent, shape);
  return !isWithin;
};

const checklayerWithinBoundryOrNot = (
  layerData,
  boundryPolygons,
  layerName,
  annotationPoints
) => {
  let map = getMap();
  let isOutOfBoundry = false;
  let boundryExtent;
  for (let i = 0; i < layerData.length; i++) {
    if (
      (layerData[i].shape &&
        layerName &&
        ["landbase", "block", "subdivision"].indexOf(layerName) != -1) ||
      layerData[i].rings ||
      layerData[i].paths
    ) {
      isOutOfBoundry =
        boundryPolygons.filter((boundryPolygon) => {
          if (!boundryPolygon?.spatialReference?.wkid && map) {
            boundryPolygon.spatialReference = map.spatialReference;
          }
          layerData[i].spatialReference = map.spatialReference;
          boundryExtent = new esri.geometry.Polygon(boundryPolygon);
          return CheckShapesWithinBoundryOrNotUsingEsri(
            boundryExtent,
            layerData[i]
          );
        }).length > 0;

      if (isOutOfBoundry) {
        window.notifySystem(
          "error",
          `في المخطط المقترح داخل حدود الرفع المساحي (${layerName}) من فضلك تأكد طبقة`
        );
        if (annotationPoints) {
          let text = getAnnotationTextIntersectedByLandbase(
            annotationPoints,
            layerName,
            layerData[i]
          )?.text;
          if (text) {
            window.notifySystem(
              "error",
              `من فضلك تأكد من القطعة (${text})`,
              10
            );
          }
        }
        return false;
      }
    }
  }

  return true;
};

const checkNoOfAnnotationsPerLayer = (
  annotationData,
  layerName,
  layerLength
) => {
  let isValid = true;
  if (
    annotationData.filter((ann) => ann.layer == layerName).length <
      layerLength &&
    layerName != "boundry"
  ) {
    window.notifySystem(
      "error",
      `في نفس الطبقة Polygons أقل من عدد ${layerName} في طبقة annotations عدد`
    );
    isValid = false;
  }
  return isValid;
};

const validateAnnotationIntersectedWithShape = (
  annotationData,
  layerName,
  layerData
) => {
  let isValid = false;
  let point,
    line,
    polygon,
    unintersectedAnnotations = [];
  annotationData
    .filter((ann) => ann.layer == layerName)
    .forEach((ann) => {
      isValid = false;
      layerData.forEach((shape) => {
        if (!isValid) {
          try {
            //point = turf.point([ann.shape.x, ann.shape.y]);

            // polygon = turf.polygon(
            //   shape.rings.map((ring) =>
            //     ring.map((position) => [position[0], position[1]])
            //   )
            // );

            isValid = CheckPointsWithinPolygonOrNotUsingEsri(shape, ann.shape);
            // line = turf.lineString(
            //   shape.rings.map((ring) =>
            //     ring
            //       // .filter((position, index) => {
            //       //   return index != ring.length - 1;
            //       // })
            //       .map((position, index) => [position[0], position[1]])
            //   )[0]
            // );
            // isValid =
            //   turf.booleanPointInPolygon(point, polygon) ||
            //   turf.booleanPointOnLine(point, line) ||
            //   turf.booleanWithin(point, line) ||
            //   turf.booleanIntersects(line, point) ||
            //   turf.booleanContains(line, point);
          } catch (exception) {
            console.log(shape, ann);
          }
        }
      });

      if (!isValid) {
        unintersectedAnnotations.splice(
          unintersectedAnnotations.length - 1,
          0,
          ann
        );
      }
    });

  if (unintersectedAnnotations.length) {
    window.notifySystem(
      "error",
      `${layerName} التالية: (${unintersectedAnnotations
        .map((ann) => ann.text)
        .join(", ")}) غير متقاطعة مع طبقة annotations`
      //(${unintersectedAnnotations.map((ann) => ann.text).join(", ")})
    );
    return false;
  }
  return checkNoOfAnnotationsPerLayer(
    annotationData,
    layerName,
    layerData.length
  );
};

const getAnnotationTextIntersectedByLandbase = (
  annotationData,
  layerName,
  layerDataItem
) => {
  let isValid = false;
  let point, line, polygon;

  return annotationData
    .filter((ann) => ann.layer == layerName)
    .filter((ann) => {
      isValid = false;
      if (!isValid) {
        //point = turf.point([ann.shape.x, ann.shape.y]);
        isValid = CheckPointsWithinPolygonOrNotUsingEsri(
          layerDataItem,
          ann.shape
        );
        // polygon = turf.polygon(
        //   layerDataItem.rings.map((ring) =>
        //     ring.map((position) => [position[0], position[1]])
        //   )
        // );
        // line = turf.lineString(
        //   layerDataItem.rings.map((ring) =>
        //     ring
        //       // .filter((position, index) => {
        //       //   return index != ring.length - 1;
        //       // })
        //       .map((position, index) => [position[0], position[1]])
        //   )[0]
        // );
        // isValid =
        //   turf.booleanPointInPolygon(point, polygon) ||
        //   turf.booleanPointOnLine(point, line) ||
        //   turf.booleanWithin(point, line) ||
        //   turf.booleanIntersects(line, point) ||
        //   turf.booleanContains(line, point);
      }

      return isValid;
    })?.[0];
};

export const checkUploadedLayersFullyContainedByBoundry = (
  uploadedFeatures,
  with_e3adt_tanzem,
  request_no = ""
) => {
  let isCADValid = true;
  if (with_e3adt_tanzem) return isCADValid;
  if (!request_no) {
    let boundryPolygons = uploadedFeatures.shapeFeatures.boundry;
    let blockPolygons = uploadedFeatures.shapeFeatures.block || [];
    let subdivisionPolygons = uploadedFeatures.shapeFeatures.subdivision || [];
    let landbasePolygons = uploadedFeatures.shapeFeatures.landbase || [];
    let annotationPoints = uploadedFeatures?.annotations || [];

    if (boundryPolygons.length) {
      if (
        checkNoOfBoundryPolygons(boundryPolygons) &&
        checLayerFeatures(boundryPolygons, "boundry", "polygon")
      ) {
        if (uploadedFeatures?.shapeFeatures) {
          if (
            checLayerFeatures(landbasePolygons, "landbase", "polygon") &&
            validateAnnotationIntersectedWithShape(
              uploadedFeatures?.annotations,
              "landbase",
              landbasePolygons
            )
          ) {
            if (
              isCADValid &&
              !checklayerWithinBoundryOrNot(
                landbasePolygons,
                boundryPolygons,
                "landbase",
                annotationPoints
              )
            ) {
              isCADValid = false;
            }
          } else {
            isCADValid = false;
          }
          if (
            checLayerFeatures(blockPolygons, "block", "polygon") &&
            validateAnnotationIntersectedWithShape(
              uploadedFeatures?.annotations,
              "block",
              blockPolygons
            )
          ) {
            if (
              isCADValid &&
              !checklayerWithinBoundryOrNot(
                blockPolygons,
                boundryPolygons,
                "block",
                annotationPoints
              )
            ) {
              isCADValid = false;
            }
          } else {
            isCADValid = false;
          }

          if (
            checLayerFeatures(subdivisionPolygons, "subdivision", "polygon") &&
            validateAnnotationIntersectedWithShape(
              uploadedFeatures?.annotations,
              "subdivision",
              subdivisionPolygons
            )
          ) {
            if (
              isCADValid &&
              !checklayerWithinBoundryOrNot(
                subdivisionPolygons,
                boundryPolygons,
                "subdivision",
                annotationPoints
              )
            ) {
              isCADValid = false;
            }
          } else {
            isCADValid = false;
          }
        }
        if (annotationPoints.length) {
          if (checLayerFeatures(annotationPoints, "annotations", "point")) {
            if (
              isCADValid &&
              !checklayerWithinBoundryOrNot(
                annotationPoints,
                boundryPolygons,
                "annotations"
              )
            ) {
              isCADValid = false;
            }
          } else {
            isCADValid = false;
          }
        }
      } else {
        isCADValid = false;
      }
    }
  }

  return isCADValid;
};

export const checkUploadedLayersFullyContainedByBoundry1 = (
  boundryPolygons,
  landbasePolygons
) => {
  let map = getMap();
  let isOutOfBoundry = false;
  if (landbasePolygons.length && boundryPolygons.length) {
    for (let i = 0; i < landbasePolygons.length; i++) {
      isOutOfBoundry =
        landbasePolygons[i]?.rings?.[0]?.find((ringPoint) => {
          return (
            boundryPolygons.filter((boundryPolygon) => {
              if (!boundryPolygon?.spatialReference?.wkid && map) {
                boundryPolygon.spatialReference = map.spatialReference;
              }
              return !new esri.geometry.Polygon(boundryPolygon).contains(
                new esri.geometry.Point(
                  ringPoint[0],
                  ringPoint[1],
                  boundryPolygon.spatialReference
                )
              );
            }).length > 0
          );
        }) != undefined;

      if (isOutOfBoundry) {
        window.notifySystem(
          "error",
          "من فضلك تاكد من ان حدود قطع الاراضي داخل حدود الرفع المساحي"
        );
        return false;
      }
    }
  }

  return true;
};

export const reverse = (s) => {
  return s.split("/").reverse().join("/");
};

export const DrawGraphics = (mapObj, data) => {
  return new Promise((resolve, reject) => {
    if (data) {
      clearGraphicFromLayer(mapObj, "ZoomGraphicLayer");
      clearGraphicFromLayer(mapObj, "annotation");

      var polygons = [];
      var annotations = [];
      var uploadGraphics = [];

      //data = JSON.parse(data);

      data.annotations.forEach(function (annotation) {
        var point = new esri.geometry.Point(annotation.shape);
        point.text = annotation.text;
        addParcelNo(
          point,
          mapObj,
          convertToArabic(point.text),
          "ParcelPlanNoGraphicLayer",
          40,
          [0, 0, 0],
          annotation.angle
        );
        annotations.push(point);
      });

      if (data.shapeFeatures.boundry) {
        if (data.shapeFeatures.boundry.length == 1) {
          data.shapeFeatures.boundry.forEach(function (feature) {
            if (feature.rings) {
              var polygon = new esri.geometry.Polygon(feature);
              polygons.push(polygon);
            } else {
              reject("طبقة ال Boundry ليست polygon!");
            }
          });
        } else {
          reject(
            "من فضلك تأكد من وجود ميزات داخل طبقة ال Boundry: يجب اضافة ميزة واحدة فقط تابعة لهذه الطبقة!"
          );
        }
      } else {
        reject("لا يوجد طبقة ال Boundry متاحة!");
      }

      if (data?.shapeFeatures?.details) {
        data?.shapeFeatures?.details.forEach(function (feature) {
          if (!feature.rings && !feature.paths) {
            var point = new esri.geometry.Point(feature);
            polygons.push(point);
          } else if (feature.paths) {
            var line = new esri.geometry.Polyline(feature);
            polygons.push(line);
          } else {
            var polygon = new esri.geometry.Polygon(feature);
            polygons.push(polygon);
          }
        });
      }

      polygons.forEach(function (polygon) {
        annotations.forEach(function (annotation) {
          if (polygon.contains && polygon.contains(annotation)) {
            polygon.text = annotation.text;
          }
        });
      });

      polygons.forEach(function (polygon, key) {
        var symbol;

        if (polygon.type === "point") {
          symbol = new esri.symbol.SimpleMarkerSymbol(
            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
            28,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleLineSymbol.STYLE_SOLID,
              new esri.Color([0, 0, 0]),
              2
            ),
            new esri.Color([0, 0, 0])
          );
        } else if (polygon.type === "polyline") {
          symbol = new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([0, 0, 0]),
            7
          );
        } else {
          symbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_NULL,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleFillSymbol.STYLE_SOLID,
              new esri.Color([0, 0, 0]),
              3
            ),
            new esri.Color([0, 0, 0])
          );
        }

        var graphic = new esri.Graphic(polygon, symbol, null);

        graphic.attributes = {
          annotation: polygon.text,
          PARCEL_PLAN_NO: polygon.text,
          PARCEL_AREA: polygon.area,
        };

        mapObj.getLayer("ZoomGraphicLayer").add(graphic);

        uploadGraphics.push(graphic);
      });
      zoomToFeature(
        mapObj.getLayer("ZoomGraphicLayer").graphics,
        mapObj,
        2,
        () => {}
      );

      setTimeout(function () {
        resolve({ ...data });
      }, 0);
    } else {
      reject();
    }
  });
};

export const DrawFeatures = (mapObj, uploadFileDetails) => {
  return new Promise((resolve, reject) => {
    let data = uploadFileDetails.fileData;
    let outFields = uploadFileDetails.activeLayerDetails.outFields;
    let layerName = uploadFileDetails.layerName + "_Layer";
    let mainAnnotaionField =
      uploadFileDetails.activeLayerDetails.outFields.find(
        (x) => x.isMainAnnotaion
      );
    let mainAnnotationLayer =
      uploadFileDetails.activeLayerDetails.outFields[0].mappingField;

    if (mainAnnotaionField)
      mainAnnotationLayer = mainAnnotaionField.mappingField;

    if (data) {
      clearGraphicFromLayer(mapObj, "ZoomGraphicLayer");
      clearGraphicFromLayer(mapObj, "annotation");

      var polygons = [];
      var annotations = [];
      var uploadGraphics = [];

      //data = JSON.parse(data);

      data.annotations.forEach(function (annotation) {
        if (!annotation.shape.spatialReference.wkid) {
          annotation.shape.spatialReference.wkid = 32639;
        }
        var point = new esri.geometry.Point(annotation.shape);
        point.text = annotation.text;
        point.layer = annotation.layer;
        if (annotation.layer == mainAnnotationLayer) {
          addParcelNo(
            point,
            mapObj,
            convertToArabic(point.text),
            "ParcelPlanNoGraphicLayer",
            40,
            [0, 0, 0],
            annotation.angle
          );
        }
        annotations.push(point);
      });

      Object.keys(data.shapeFeatures).forEach((key) => {
        if (data.shapeFeatures[key]) {
          data.shapeFeatures[key].forEach(function (feature) {
            if (feature.rings) {
              if (!feature.spatialReference.wkid) {
                feature.spatialReference.wkid = 32639;
              }
              var polygon = new esri.geometry.Polygon(feature);
              polygons.push(polygon);
            }
          });
        }
      });

      polygons.forEach(function (polygon) {
        annotations.forEach(function (annotation) {
          if (polygon.contains && polygon.contains(annotation)) {
            let outField = outFields.find(
              (x) => x.mappingField == annotation.layer
            );
            if (outField) polygon[outField.name] = annotation.text;
          }
        });
      });

      polygons.forEach(function (polygon, key) {
        var symbol;

        if (polygon.type === "point") {
          symbol = new esri.symbol.SimpleMarkerSymbol(
            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
            28,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleLineSymbol.STYLE_SOLID,
              new esri.Color([0, 0, 0]),
              2
            ),
            new esri.Color([0, 0, 0])
          );
        } else if (polygon.type === "polyline") {
          symbol = new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([0, 0, 0]),
            7
          );
        } else {
          symbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_NULL,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleFillSymbol.STYLE_SOLID,
              new esri.Color([0, 0, 0]),
              3
            ),
            new esri.Color([0, 0, 0])
          );
        }

        var graphic = new esri.Graphic(polygon, symbol, null);

        graphic.attributes = {};

        outFields.forEach((outField) => {
          if (outField.isArea) {
            graphic.attributes[outField.name] = polygon.area;
          } else {
            graphic.attributes[outField.name] = polygon[outField.name];
          }
        });

        mapObj.getLayer("ZoomGraphicLayer").add(graphic);

        uploadGraphics.push({
          geometry: polygon,
          attributes: graphic.attributes,
        });
      });

      zoomToFeature(
        mapObj.getLayer("ZoomGraphicLayer").graphics,
        mapObj,
        2,
        () => {}
      );

      setTimeout(function () {
        resolve([...uploadGraphics]);
      }, 0);
    } else {
      reject();
    }
  });
};

export const DrawIntersectLines = () => {
  return;
};

export const getCornersIndex = function (corners, corner) {
  var found = -1;

  if (corners != null && corners.length != null && corners.length > 0) {
    corners.forEach(function (value, key) {
      if (value.x == corner.x && value.y == corner.y) {
        found = key + 1;
        return true;
      }
    });
  }

  return found;
};

export const sortLines = function (polygons) {
  polygons.forEach(function (polygon) {
    polygon.data.forEach(function (lineTypes) {
      if (lineTypes.data && lineTypes.data.length)
        lineTypes.data.sort(function (a, b) {
          if (lineTypes.name == "north" || lineTypes.name == "south")
            return a.centroid.x - b.centroid.x;
          else if (
            lineTypes.name == "east" ||
            lineTypes.name == "weast" ||
            lineTypes.name == "west"
          )
            return a.centroid.y - b.centroid.y;
        });
    });
  });
};

export const getCornerIconPosition = (cornerKey, lines) => {
  var out = { x: 0, y: 0 };
  var direction = "";
  var count = 0;

  lines.forEach(function (line) {
    if (
      line.attributes.FROM_CORNER == cornerKey ||
      line.attributes.TO_CORNER == cornerKey
    ) {
      if (
        line.attributes.BOUNDARY_DIRECTION == 3 ||
        line.attributes.BOUNDARY_DIRECTION == 4
      ) {
        count++;
      }
      if (line.attributes.BOUNDARY_DIRECTION == 4) {
        out.x = 15;
        out.y = -6;
      } else {
        if (line.attributes.BOUNDARY_DIRECTION == 1) {
          out.x = -6;
          out.y = -15;
        } else if (line.attributes.BOUNDARY_DIRECTION == 3) {
          out.x = -15;
          out.y = 7;
        }
      }
    }
  });

  if (count == 2) {
    out.x = 6;
    out.y = 16;
  }

  return out;
};

export const DrawGraphicsOld = (
  mapObj,
  layerName,
  data,
  callback,
  identifier
) => {
  if (data.length != 0) {
    //$rootScope.$apply();
    clearGraphicFromLayer(mapObj, layerName);
    var polygons = [];
    var uploadGraphics = [];
    var fields = [];
    data = eval(data);

    if (data[0].features[0]["SHAPE@JSON"]) {
      data.forEach(function (layer, e) {
        layer.features.forEach(function (ring, i) {
          var ringsData = JSON.parse(ring["SHAPE@JSON"]);
          if (!ringsData.rings && !ringsData.paths) {
            var point = new esri.geometry.Point(ringsData);
            polygons.push({ graphic: point, parentIndex: e, subIndex: i });
          } else if (ringsData.paths) {
            var line = new esri.geometry.Polyline(ringsData);
            polygons.push({ graphic: line, parentIndex: e, subIndex: i });
          } else {
            var polygon = new esri.geometry.Polygon(ringsData);
            polygons.push({ graphic: polygon, parentIndex: e, subIndex: i });
          }
        });
      });

      Object.keys(data[0].features[0]).forEach(function (key) {
        if (identifier == "kml") {
          if (key == "PopupInfo") {
            fields.push({ name: key, alias: key });
          }
        } else {
          if (key != "SHAPE@JSON") {
            fields.push({ name: key, alias: key });
          }
        }
      });

      polygons.forEach(function (polygon, key) {
        var symbol = new esri.symbol.SimpleFillSymbol(
          esri.symbol.SimpleFillSymbol.STYLE_NULL,
          new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.Color([0, 0, 0]),
            3
          ),
          new esri.Color([0, 0, 0])
        );

        var graphic = new esri.Graphic(
          polygon.graphic,
          symbol,
          data[polygon.parentIndex].features[polygon.subIndex]
        );
        mapObj.getLayer(layerName).add(graphic);
        graphic.attributes["SHAPE@JSON"] = "";
        uploadGraphics.push(graphic);
      });
    } else {
      data.forEach(function (layer) {
        layer.features.forEach(function (feature) {
          var ring = feature.geometry;
          if (!ring.curvePaths && !ring.curveRings) {
            if (!ring.rings && !ring.paths) {
              var point = new esri.geometry.Point(ring);
              polygons.push({ graphic: point, fields: layer.fields });
            } else if (ring.paths) {
              var line = new esri.geometry.Polyline({
                paths: ring.paths,
                spatialReference: mapObj.spatialReference,
              });
              polygons.push({ graphic: line, fields: layer.fields });
            } else {
              var polygon = new esri.geometry.Polygon({
                rings: ring.rings,
                spatialReference: mapObj.spatialReference,
              });
              polygons.push({ graphic: polygon, fields: layer.fields });
            }
          }
        });
      });

      polygons.forEach(function (polygon, key) {
        var symbol;
        if (polygon.graphic.type === "point") {
          symbol = new esri.symbol.SimpleMarkerSymbol(
            esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
            28,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleLineSymbol.STYLE_SOLID,
              new esri.Color([0, 0, 0]),
              2
            ),
            new esri.Color([0, 0, 0])
          );
        } else if (polygon.graphic.type === "polyline") {
          symbol = new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_SOLID,
            new esri.Color([0, 0, 0]),
            7
          );
        } else {
          symbol = new esri.symbol.SimpleFillSymbol(
            esri.symbol.SimpleFillSymbol.STYLE_NULL,
            new esri.symbol.SimpleLineSymbol(
              esri.symbol.SimpleFillSymbol.STYLE_SOLID,
              new esri.Color([0, 0, 0]),
              3
            ),
            new esri.Color([0, 0, 0])
          );
        }

        var graphic = new esri.Graphic(polygon.graphic, symbol, polygon.fields);

        uploadGraphics.push(graphic);

        mapObj.getLayer(layerName).add(graphic);
      });
    }

    zoomToFeature(
      mapObj.getLayer("ZoomGraphicLayer").graphics,
      mapObj,
      2,
      () => {}
    );

    callback({ uploadGraphics: uploadGraphics });
  }
};

export const clone = (obj, attr) => {
  var graphic = new esri.Graphic(obj.toJson());

  if (graphic && !graphic.geometry) {
    graphic.geometry = obj;
  }
  if (attr) graphic.attributes = attr;
  return graphic;
};

export const projectPolygons = function (polygons, landDataParcels) {
  return new Promise((resolve, reject) => {
    var max = [0, 0];
    var identifyMax = [0, 0];

    if (
      polygons[0].polygon &&
      polygons[0].polygon.spatialReference.wkid != 32639
    ) {
      polygons.forEach(function (polygon) {
        delete polygon.polygon.cache;
        polygon.polygon.rings[0].forEach(function (point) {
          if (point[0] > max[0]) max = point;
        });
      });

      if (landDataParcels) {
        landDataParcels.forEach(function (polygon) {
          polygon.geometry.rings[0].forEach(function (point) {
            if (point[0] > identifyMax[0]) identifyMax = point;
          });
        });

        var identifyMax = new esri.geometry.Point(
          identifyMax[0],
          identifyMax[1],
          landDataParcels[0].geometry.spatialReference
        );

        var sR =
          landDataParcels[0].geometry.spatialReference.wkid == 32639
            ? 32639
            : 102100;

        project(identifyMax, sR, function (projectedPointsRes) {
          var delta = [
            projectedPointsRes[0].x - max[0],
            projectedPointsRes[0].y - max[1],
          ];

          polygons.forEach(function (polygon, key) {
            polygon.polygon.rings[0].forEach(function (point) {
              point[0] += delta[0];
              point[1] += delta[1];
            });

            polygon.polygon.spatialReference = new esri.SpatialReference({
              wkid: 32639,
            });

            if (key + 1 == polygons.length) {
              resolve({ polygons: polygons, delta: delta });
            }
          });
        });
      } else {
        LoadModules([
          "esri/tasks/ProjectParameters",
          "esri/geometry/Polygon",
        ]).then(([ProjectParameters, Polygon]) => {
          var outSR = new esri.SpatialReference(32639);
          let gsvc = new esri.tasks.GeometryService(
            "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
          );
          var params = new ProjectParameters();
          params.geometries = polygons.map(
            (polygon) => new Polygon(polygon.polygon)
          );
          params.outSR = outSR;
          gsvc.project(params, function (projectedPolygons) {
            projectedPolygons.forEach((polygon, index) => {
              polygons[index].polygon = polygon;
            });
            resolve([...polygons]);
          });
        });
      }
    } else {
      resolve({ polygons: polygons });
    }
  });
};

export const lineIntersect = function (a, b) {
  a.m = (a[0][1] - a[1][1]) / (a[0][0] - a[1][0]); // slope of line 1
  b.m = (b[0][1] - b[1][1]) / (b[0][0] - b[1][0]); // slope of line 2
  return a.m < 0 || b.m < 0 || Math.abs(a.m - b.m) < Number.EPSILON
    ? undefined
    : {
        x: (a.m * a[0][0] - b.m * b[0][0] + b[0][1] - a[0][1]) / (a.m - b.m),
        y:
          (a.m * b.m * (b[0][0] - a[0][0]) + b.m * a[0][1] - a.m * b[0][1]) /
          (b.m - a.m),
      };
};

export const setDistance = function (point, slope, d) {
  var r = Math.sqrt(1 + Math.pow(slope, 2));
  var newX = point.x + d / r;
  var newY = point.y + (d * slope) / r;
  var newXX = point.x - d / r;
  var newYY = point.y - (d * slope) / r;

  return new esri.geometry.Polyline({
    paths: [
      [
        [newXX, newYY],
        [newX, newY],
      ],
    ],
    spatialReference: { wkid: 32639 },
  });
};

export const between = function (a, n, b) {
  var min = Math.min(a, b),
    max = Math.max(a, b);
  return n > min && n < max;
};

export const calcPolygonArea = function (vertices) {
  var total = 0;

  for (var i = 0, l = vertices.length; i < l; i++) {
    var addX = vertices[i][0];
    var addY = vertices[i == vertices.length - 1 ? 0 : i + 1][1];
    var subX = vertices[i == vertices.length - 1 ? 0 : i + 1][0];
    var subY = vertices[i][1];

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }

  return Math.abs(total);
};

export const lineLength = function (x, y, x0, y0) {
  return Math.sqrt((x -= x0) * x + (y -= y0) * y);
};

export const segment_intersection = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  var x =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  var y =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
  if (isNaN(x) || isNaN(y)) {
    return false;
  } else {
    if (x1 >= x2) {
      if (!between(x2, x, x1)) {
        return false;
      }
    } else {
      if (!between(x1, x, x2)) {
        return false;
      }
    }
    if (y1 >= y2) {
      if (!between(y2, y, y1)) {
        return false;
      }
    } else {
      if (!between(y1, y, y2)) {
        return false;
      }
    }
    if (x3 >= x4) {
      if (!between(x4, x, x3)) {
        return false;
      }
    } else {
      if (!between(x3, x, x4)) {
        return false;
      }
    }
    if (y3 >= y4) {
      if (!between(y4, y, y3)) {
        return false;
      }
    } else {
      if (!between(y3, y, y4)) {
        return false;
      }
    }
  }
  return { x: x, y: y };
};

export const zoomToFeature = function (feature, map, zoomFactor, callback) {
  //
  LoadModules([
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/Polygon",
    "esri/graphic",
    "esri/graphicsUtils",
    "esri/geometry/Extent",
  ]).then(([Point, Polyline, Polygon, Graphic, graphicsUtils, Extent]) => {
    // //
    var myFeatureExtent;

    try {
      myFeatureExtent = graphicsUtils.graphicsExtent(feature);
    } catch (e) {
      if (feature.length) {
        feature.forEach(function (f) {
          if (f.geometry) {
            if (f.geometry.type.toLowerCase().indexOf("polygon") != -1) {
              if (!f.geometry.spatialReference)
                f.geometry.spatialReference = {
                  wkid: map?.spatialReference.wkid,
                };
              f.geometry = new Polygon(f.geometry);
            } else if (f.geometry.type.toLowerCase().indexOf("point") != -1) {
              if (!f.geometry.spatialReference)
                f.geometry.spatialReference = {
                  wkid: map?.spatialReference.wkid,
                };
              f.geometry = new Point(f.geometry);
            }
          } else if (f.type) {
            if (f.type.toLowerCase().indexOf("point") != -1) {
              f.geometry = new Point(f);
            }
          }
        });
      } else {
        if (
          feature.geometry &&
          feature.geometry.type &&
          feature.geometry.type.toLowerCase().indexOf("polygon") != -1
        ) {
          feature.geometry = new Polygon(feature.geometry);
        }
        feature = [feature];
      }
      try {
        myFeatureExtent = graphicsUtils.graphicsExtent(feature);
      } catch (e) {
        // $rootScope.$apply()
      }
    }

    if (!feature.length) {
      if (feature.geometry.type.toLowerCase().indexOf("point") != -1) {
        let extent = new Extent(
          myFeatureExtent.xmin - zoomFactor,
          myFeatureExtent.ymin - zoomFactor,
          myFeatureExtent.xmax + zoomFactor,
          myFeatureExtent.ymax + zoomFactor,
          map?.spatialReference
        );

        map?.setExtent(extent.expand(5), true).then(callback);
      } else {
        if (zoomFactor && myFeatureExtent) {
          myFeatureExtent.xmin = myFeatureExtent.xmin - zoomFactor;
          myFeatureExtent.ymin = myFeatureExtent.ymin - zoomFactor;
          myFeatureExtent.xmax = myFeatureExtent.xmax + zoomFactor;
          myFeatureExtent.ymax = myFeatureExtent.ymax + zoomFactor;
          map?.setExtent(myFeatureExtent, true).then(callback);
        }
      }
    } else {
      if (feature[0].geometry) {
        if (feature[0].geometry.type.toLowerCase().indexOf("point") != -1) {
          var extent = new Extent(
            myFeatureExtent.xmin - zoomFactor,
            myFeatureExtent.ymin - zoomFactor,
            myFeatureExtent.xmax + zoomFactor,
            myFeatureExtent.ymax + zoomFactor,
            map?.spatialReference
          );

          map?.setExtent(extent.expand(5), true).then(callback);
        } else {
          if (zoomFactor && myFeatureExtent) {
            myFeatureExtent.xmin = myFeatureExtent.xmin - zoomFactor;
            myFeatureExtent.ymin = myFeatureExtent.ymin - zoomFactor;
            myFeatureExtent.xmax = myFeatureExtent.xmax + zoomFactor;
            myFeatureExtent.ymax = myFeatureExtent.ymax + zoomFactor;
            map?.setExtent(myFeatureExtent, true).then(callback);
          }
        }
      } else if (
        feature[0].type &&
        feature[0].type.toLowerCase().indexOf("point") != -1
      ) {
        extent = new Extent(
          myFeatureExtent.xmin - zoomFactor,
          myFeatureExtent.ymin - zoomFactor,
          myFeatureExtent.xmax + zoomFactor,
          myFeatureExtent.ymax + zoomFactor,
          map?.spatialReference
        );

        map?.setExtent(extent.expand(5), true).then(callback);
      } else {
        if (zoomFactor && myFeatureExtent) {
          myFeatureExtent.xmin = myFeatureExtent.xmin - zoomFactor;
          myFeatureExtent.ymin = myFeatureExtent.ymin - zoomFactor;
          myFeatureExtent.xmax = myFeatureExtent.xmax + zoomFactor;
          myFeatureExtent.ymax = myFeatureExtent.ymax + zoomFactor;
          map?.setExtent(myFeatureExtent, true).then(callback);
        }
      }
    }
  });
};

export const formatDate = (dateArray) => {
  const dateArrayInt = map(dateArray, (value) => parseInt(value));
  return new Date(dateArrayInt[2], dateArrayInt[1] - 1, dateArrayInt[0]);
};

export const zoomToGraphics = function (layerName, map, zoomFactor, callback) {
  LoadModules([
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/Polygon",
    "esri/graphic",
    "esri/graphicsUtils",
    "esri/geometry/Extent",
  ]).then(([Point, Polyline, Polygon, Graphic, graphicsUtils, Extent]) => {
    // //
    var myFeatureExtent;
    myFeatureExtent = graphicsUtils
      .graphicsExtent(map?.getLayer(layerName).graphics)
      .expand(3);
    var inputExtent = new esri.geometry.Extent(
      myFeatureExtent,
      new esri.SpatialReference(32639)
    );
    var outSR = new esri.SpatialReference(102100);
    let gsvc = new esri.tasks.GeometryService(
      "http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer"
    );
    gsvc.project(
      [myFeatureExtent],
      outSR,
      function (finalExtent) {
        map?.setExtent(finalExtent);
      },
      () => {}
    );
  });
};

export const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const getLengthDirectionByCentroid = (line, lineCenter, polygon) => {
  var maxPoint, minPoint;
  var max = 0,
    min;
  //

  for (var j = 0; j < polygon.rings[0].length - 1; j++) {
    var point1 = new esri.geometry.Point(
      polygon.rings[0][j][0],
      polygon.rings[0][j][1]
    );
    var point2 = new esri.geometry.Point(
      polygon.rings[0][j + 1][0],
      polygon.rings[0][j + 1][1]
    );

    if (point1.x > max) {
      max = point1.x;
      maxPoint = point1;
    }

    if (!min || point1.x < min) {
      min = point1.x;
      minPoint = point1;
    }

    if (point2.x > max) {
      max = point2.x;
      maxPoint = point2;
    }

    if (!min || point2.x < min) {
      min = point2.x;
      minPoint = point2;
    }
  }

  let gap = 5;
  var centerPointofLine = lineCenter;
  var polygon = new esri.geometry.Polygon(polygon);

  var polygonCenterPoint = polygon.getExtent().getCenter();

  var diffrenceInXWithMaxPoint = Math.abs(centerPointofLine.x - maxPoint.x);
  var diffrenceWithPolygonCenterPoint = Math.abs(
    centerPointofLine.x - polygonCenterPoint.x
  );

  //
  //east
  if (diffrenceInXWithMaxPoint < diffrenceWithPolygonCenterPoint) {
    return "east";
  } else {
    var diffrenceInXWithMinPoint = Math.abs(centerPointofLine.x - minPoint.x);

    if (diffrenceInXWithMinPoint < diffrenceWithPolygonCenterPoint) {
      if (centerPointofLine.y > polygonCenterPoint.y) {
        return "north";
      }
      return "weast";
    }
    // north
    else if (centerPointofLine.y > polygonCenterPoint.y) {
      if (
        line[0][0] > polygonCenterPoint.x - gap &&
        line[1][0] > polygonCenterPoint.x - gap
      ) {
        return "east";
      }
      if (
        line[0][0] - gap < polygonCenterPoint.x &&
        line[1][0] - gap < polygonCenterPoint.x
      ) {
        return "weast";
      }
      return "north";
    } else {
      if (
        line[0][0] > polygonCenterPoint.x - gap &&
        line[1][0] > polygonCenterPoint.x - gap
      ) {
        return "east";
      }
      if (
        line[0][0] - gap < polygonCenterPoint.x &&
        line[1][0] - gap < polygonCenterPoint.x
      ) {
        return "weast";
      }
      return "south";
    }
  }
};

export const computePointDirection = (
  originalPolygon,
  pointA,
  pointB,
  polygon
) => {
  var y = pointA[1] - pointB[1];
  var x = pointA[0] - pointB[0];
  var line = new esri.geometry.Polyline([pointA, pointB]);
  var direction = getLengthDirectionByLineCentroid(
    originalPolygon,
    line,
    polygon
  );

  var y = pointA[1] - pointB[1];
  var x = pointA[0] - pointB[0];

  return { length: Math.sqrt(x * x + y * y), direction: direction };
};

export const getLengthDirectionByLineCentroid = (
  originalPolygon,
  line,
  polygon
) => {
  var polygon = new esri.geometry.Polygon(polygon);

  var polygonCenterPoint = polygon.getExtent().getCenter();
  var lineCenter = line.getExtent().getCenter();
  // let lineAngle = computeLineAngle(
  //   [originalPolygon.maxPoint.x, originalPolygon.maxPoint.y],
  //   [originalPolygon.minPoint.x, originalPolygon.minPoint.y],
  //   polygonCenterPoint
  // );
  //
  // let angle =
  //   !polygon.isFullBoundry &&
  //   Math.abs(Math.abs(lineAngle) - 180) > 25 &&
  //   Math.abs(Math.abs(lineAngle) - 180) < 75
  //     ? (lineAngle < 0 && -1 * lineAngle - 180) || lineAngle - 180
  //     : 0;
  // // (((lineAngle > 0 && (lineAngle > 90 ? -90 : 90)) ||
  // //   (lineAngle < 0 && (lineAngle > -90 ? -90 : 90))) -
  // //   lineAngle) %
  // // 90;
  //
  // let rotatedLine1 = (angle != 0 &&
  //   rotatePoint(
  //     polygonCenterPoint,
  //     new esri.geometry.Point(line.paths[0][0]),
  //     angle
  //   )) || [line.paths[0][0][0], line.paths[0][0][1]];
  // let rotatedLine2 = (angle != 0 &&
  //   rotatePoint(
  //     polygonCenterPoint,
  //     new esri.geometry.Point(line.paths[0][1]),
  //     angle
  //   )) || [line.paths[0][1][0], line.paths[0][1][1]];

  // let rotatedLine = new esri.geometry.Polyline([rotatedLine1, rotatedLine2]);
  // addGraphicToLayer(
  //   rotatedLine,
  //   getMap(),
  //   "boundriesGraphicLayer",
  //   null,
  //   null,
  //   null,
  //   () => {}
  // );

  var centerPointofLine = lineCenter;

  var diffrenceInXWithMaxPoint = Math.abs(
    centerPointofLine.x - originalPolygon.maxPoint.x
  );
  var diffrenceWithPolygonCenterPoint = Math.abs(
    centerPointofLine.x - polygonCenterPoint.x
  );

  if (diffrenceInXWithMaxPoint < diffrenceWithPolygonCenterPoint) {
    return "east";
  } else {
    var diffrenceInXWithMinPoint = Math.abs(
      centerPointofLine.x - originalPolygon.minPoint.x
    );
    if (diffrenceInXWithMinPoint < diffrenceWithPolygonCenterPoint) {
      return "west";
    } else if (centerPointofLine.y > polygonCenterPoint.y) {
      return "north";
    } else {
      return "south";
    }
  }
};

export const addFeaturesToMap_FeatureServer = function (mainObject) {
  return new Promise((resolve, reject) => {
    let layerName =
      mainObject?.locationData?.locationData?.annotationTable?.layerName;

    getMapInfo(addedParcelMapServiceUrl).then((response) => {
      let layerId = getLayerId(response, layerName);
      //
      if (layerId != null) {
        var url =
          addedParcelMapServiceUrl.replace("/MapServer", "/FeatureServer") +
          "/" +
          layerId +
          "?token=" +
          window.esriToken;

        var out = new esri.layers.FeatureLayer(url, {
          opacity: 0,
          id: "temp_FeatureLayer",
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"],
        });

        let features = [...mainObject.mapEditFeatures.editableFeatures];
        features.map((f) => {
          Object.keys(f.attributes).forEach((attribute) => {
            if (f.attributes[attribute + "_Code"] != null) {
              f.attributes[attribute] = f.attributes[attribute + "_Code"];
              delete f.attributes[attribute + "_Code"];
            }
          });

          if (f.geometry.paths) {
            f.geometry = esri.geometry.Polyline(
              f.geometry,
              f.geometry.spatialReference
            );
          } else if (f.geometry.rings) {
            f.geometry = esri.geometry.Polygon(
              f.geometry,
              f.geometry.spatialReference
            );
          } else {
            f.geometry = esri.geometry.Point(
              f.geometry,
              f.geometry.spatialReference
            );
          }
        });

        let graphicFeatures = [];

        features.forEach((f) => {
          var graphic = new esri.Graphic(f.geometry, null, f.attributes);
          graphicFeatures.push(graphic);
        });

        out.applyEdits(
          graphicFeatures,
          null,
          null,
          (result) => {
            if (result.find((x) => !x.success)) {
              message.error("حدث خطأ أثناء إضافة البيانات المكانية والوصفية");
              reject();
            } else {
              resolve(result);
            }
          },
          (error) => {
            message.error("حدث خطأ أثناء إضافة البيانات المكانية والوصفية");
            reject();
          }
        );
      } else {
        message.error("حدث خطأ أثناء إضافة البيانات المكانية والوصفية");
        reject();
      }
    });
  });
};

export const isLayerExist = function (mapInfo, layerName) {
  let findLayer = mapInfo.info.$layers.layers.find((x) => x.name == layerName);
  if (!findLayer) {
    findLayer = mapInfo.info.$layers.tables.find((x) => x.name == layerName);
  }
  return findLayer;
};

export const showLoading = (value) => {
  store.dispatch({ type: "Show_Loading_new", loading: value });
};

export const getLayerId = function (mapInfo, layerName) {
  let findLayer = mapInfo.info.$layers.layers.find((x) => x.name == layerName);
  if (!findLayer) {
    findLayer = mapInfo.info.$layers.tables.find((x) => x.name == layerName);
  }
  return findLayer && findLayer.id;
};

export const zoomToFeatureByFilter = (
  where,
  layerName,
  map,
  returnGeometryAndNotZoom,
  callback
) => {
  let layerdId = getLayerId(map.__mapInfo, layerName);

  queryTask({
    url: map.getLayer("basemap").url.split("?")[0] + "/" + layerdId,
    where: where,
    outFields: ["OBJECTID"],
    returnGeometry: true,
    callbackResult: ({ features }) => {
      if (features.length > 0) {
        if (!returnGeometryAndNotZoom) {
          highlightFeature(features[0], map, {
            layerName: "ZoomGraphicLayer",
            isZoom: true,
            isHighlighPolygonBorder: true,
            zoomFactor: 20,
          });
        }
        if (callback) callback(features[0]);
      }
    },
    callbackError(error) {},
  });
};

export const updateAndDeleteFeatures_FeatureServer = function (mainObject) {
  return new Promise((resolve, reject) => {
    let editableFeatures = {
      ...mainObject?.editUpdateCreate?.editableFeatures,
    };
    let transactionList = [];

    getInfo(addedParcelMapServiceUrl).then((response) => {
      Object.keys(editableFeatures).forEach((layer) => {
        let layerId = response[layer];

        //delete features
        let deletesFeatures = editableFeatures[layer].features.filter(
          (f) => f.isDelete
        );
        if (deletesFeatures.length) {
          transactionList.push({
            id: layerId,
            deletes: deletesFeatures.map((x) => x.attributes.OBJECTID),
          });
        }

        //update features
        let updateFeatures = editableFeatures[layer].features.filter(
          (f) => !f.isDelete
        );

        updateFeatures.forEach((f) => {
          if (f.attributes.OBJECTID)
            f.attributes.OBJECTID = +f.attributes.OBJECTID;
          Object.keys(f.attributes).forEach((attribute) => {
            if (f.attributes[attribute + "_Code"] != null) {
              f.attributes[attribute] = f.attributes[attribute + "_Code"];
              delete f.attributes[attribute + "_Code"];
            }
          });
        });

        if (updateFeatures.length) {
          let transactionObject = transactionList.find((x) => x.id == layerId);
          if (transactionObject) {
            transactionObject.updates = updateFeatures.map((x) => {
              return x.isUploaded
                ? { attributes: x.attributes, geometry: x.geometry }
                : { attributes: x.attributes };
            });
          } else {
            transactionList.push({
              id: layerId,
              updates: updateFeatures.map((x) => {
                return x.isUploaded
                  ? { attributes: x.attributes, geometry: x.geometry }
                  : { attributes: x.attributes };
              }),
            });
          }
        }
      });

      applyEditsMultiple(
        addedParcelMapServiceUrl,
        JSON.stringify(transactionList)
      ).then(
        (data) => {
          resolve(true);
        },
        () => {
          reject();
          window.notifySystem("error", "حدث خطأ أثناء تحديث خارطة الأساس");
        }
      );
    });
  });
};

export const addFeatures_ToUnplannedParcels = function (mainObject, record) {
  return new Promise((resolve, reject) => {
    let transactionList = [];

    let addedFeatures = JSON.parse(
      JSON.stringify(
        mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels
      )
    );

    getInfo(mapUrl).then((response) => {
      let unplannedParcels_layerId = response["UnplannedParcels"];

      addedFeatures.forEach((f) => {
        let polygonCentroid = new esri.geometry.Polygon(
          f.polygon
        ).getCentroid();
        let spatialId = GetSpatial(polygonCentroid);

        f.attributes = {
          MUNICIPALITY_NAME: mainObject.landData.landData.municipality.code,
          SUB_MUNICIPALITY_NAME:
            mainObject?.landData?.landData?.submunicipality?.Submun_code ||
            mainObject?.landData?.landData?.lands?.parcels?.[0]?.attributes
              ?.SUB_MUNICIPALITY_NAME?.Submun_code,
          PARCEL_PLAN_NO: f.parcel_name,
          PARCEL_AREA: f.area,
          PARCEL_SPATIAL_ID: +spatialId,
          SUBMISSIONNO: record.request_no,
        };
      });

      if (addedFeatures.length) {
        transactionList.push({
          id: unplannedParcels_layerId,
          adds: addedFeatures.map((x) => {
            return {
              attributes: x.attributes,
              geometry: x.polygon,
            };
          }),
        });
      }

      applyEditsMultiple(mapUrl, JSON.stringify(transactionList)).then(
        (data) => {
          resolve(true);
        },
        () => {
          reject();
          window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
        }
      );
    });
  });
};
export const updateContractFeatures_FeatureServer = function (mainObject) {
  return new Promise((resolve, reject) => {
    let transactionList = [];

    let parcels = JSON.parse(
      JSON.stringify(mainObject.landData.landData.lands.parcels)
    );

    let updateFeatures = JSON.parse(
      JSON.stringify(
        mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels
      )
    );

    getInfo(mapUrl).then((response) => {
      let layerId = response["Landbase_Parcel"];
      let history_layerId = response["Landbase_Parcel_H"];

      let spatialIds = parcels.map(
        (x) => "PARCEL_SPATIAL_ID =" + x.attributes.PARCEL_SPATIAL_ID
      );

      let where = spatialIds.join(" or ");

      queryTask({
        url: mapUrl + "/" + layerId,
        outFields: ["*"],
        where: where,
        returnGeometry: true,
        callbackResult: ({ features }) => {
          features.forEach((f) => {
            updateFeatures.find(
              (x) => x.parcel_name == f.attributes.PARCEL_PLAN_NO
            ).OBJECTID = f.attributes.OBJECTID;
            delete f.attributes.OBJECTID;
          });

          if (updateFeatures.length) {
            transactionList.push({
              id: layerId,
              updates: updateFeatures.map((x) => {
                return {
                  attributes: { PARCEL_AREA: x.area, OBJECTID: x.OBJECTID },
                  geometry: {
                    rings: x.polygon.rings,
                    spatialReference: x.polygon.spatialReference,
                  },
                };
              }),
            });

            transactionList.push({
              id: history_layerId,
              adds: features.map((x) => {
                return {
                  attributes: x.attributes,
                  geometry: {
                    rings: x.geometry.rings,
                    spatialReference: x.geometry.spatialReference,
                  },
                };
              }),
            });
          }

          applyEditsMultiple(mapUrl, JSON.stringify(transactionList)).then(
            (data) => {
              resolve(true);
            },
            () => {
              reject();
              window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
            }
          );
        },
      });
    });
  });
};

export const updateInvestFeatures_FeatureServer = function (mainObject) {
  return new Promise((resolve, reject) => {
    let transactionList = [];

    let updateFeatures = JSON.parse(
      JSON.stringify(mainObject.landData.landData.lands.parcels)
    );

    getInfo(investMapUrl).then((response) => {
      let layerId = response["Invest_Site_Polygon"];

      let siteGeoSpatialIds = updateFeatures.map(
        (x) =>
          "SITE_GEOSPATIAL_ID='" +
          (x.attributes.PARCEL_SPATIAL_ID || x.attributes.SITE_GEOSPATIAL_ID) +
          "'"
      );

      queryTask({
        url: investMapUrl + "/" + layerId,
        where: siteGeoSpatialIds.join(" or "),
        returnGeometry: false,
        outFields: ["OBJECTID", "SITE_GEOSPATIAL_ID"],
        callbackResult: (res) => {
          if (res.features.length) {
            //set object id's
            updateFeatures.forEach((f) => {
              f.attributes.OBJECTID = res.features?.find(
                (x) =>
                  x.attributes.PARCEL_SPATIAL_ID ==
                    f.attributes.PARCEL_SPATIAL_ID ||
                  x.attributes.SITE_GEOSPATIAL_ID ==
                    f.attributes.PARCEL_SPATIAL_ID
              )?.attributes?.OBJECTID;
            });

            updateFeatures.forEach((f) => {
              f.attributes.SITE_GEOSPATIAL_ID = f.attributes.PARCEL_SPATIAL_ID;

              f.attributes.PARCELOWNER =
                mainObject?.efada_lands_statements?.efada_lands_statements?.efada_melkia_aradi;

              if (f.attributes.OBJECTID)
                f.attributes.OBJECTID = +f.attributes.OBJECTID;
              Object.keys(f.attributes).forEach((attribute) => {
                if (f.attributes[attribute + "_Code"] != null) {
                  f.attributes[attribute] = f.attributes[attribute + "_Code"];
                  delete f.attributes[attribute + "_Code"];
                }
                resetBoolValues(f, [
                  "SITE_UTL_WATER",
                  "SITE_UTL_SWG",
                  "SITE_UTL_ELECT",
                  "SITE_UTL_GAS",
                  "SITE_UTL_HAZARD",
                  "SITE_UTL_TELEPHONE",
                  "SITE_UTL_ASPHALT",
                ]);
              });
            });

            if (updateFeatures.length) {
              transactionList.push({
                id: layerId,
                updates: updateFeatures.map((x) => {
                  return { attributes: x.attributes };
                }),
              });
            }

            applyEditsMultiple(
              investMapUrl,
              JSON.stringify(transactionList)
            ).then(
              (data) => {
                resolve(true);
              },
              () => {
                reject();
                window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
              }
            );
          } else {
            reject();
            window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
          }
        },
      });
    });
  });
};

export const update_ParcelOwner_FeatureServer = function (
  mainObject,
  layerName
) {
  return new Promise((resolve, reject) => {
    let transactionList = [];

    let updateFeatures = JSON.parse(
      JSON.stringify(mainObject.landData.landData.lands.parcels)
    );

    getInfo(investMapUrl).then((response) => {
      let layerId = response[layerName];

      let parcelSpatialIds = updateFeatures.map(
        (x) =>
          "PARCEL_SPATIAL_ID='" +
          (x.attributes.PARCEL_SPATIAL_ID || x.attributes.SITE_GEOSPATIAL_ID) +
          "'"
      );
      let siteGeoSpatialIds = updateFeatures.map(
        (x) =>
          "SITE_GEOSPATIAL_ID='" +
          (x.attributes.PARCEL_SPATIAL_ID || x.attributes.SITE_GEOSPATIAL_ID) +
          "'"
      );

      queryTask({
        url: investMapUrl + "/" + layerId,
        where:
          layerName == "Invest_Site_Polygon"
            ? siteGeoSpatialIds.join(" or ")
            : parcelSpatialIds.join(" or "),
        returnGeometry: false,
        outFields:
          layerName == "Invest_Site_Polygon"
            ? ["OBJECTID", "SITE_GEOSPATIAL_ID"]
            : ["OBJECTID", "PARCEL_SPATIAL_ID"],
        callbackResult: (res) => {
          if (res.features.length) {
            updateFeatures.forEach((f) => {
              f.attributes.OBJECTID = res.features?.find(
                (x) =>
                  x.attributes.PARCEL_SPATIAL_ID ==
                    f.attributes.PARCEL_SPATIAL_ID ||
                  x.attributes.SITE_GEOSPATIAL_ID ==
                    f.attributes.PARCEL_SPATIAL_ID
              )?.attributes?.OBJECTID;
            });

            updateFeatures.forEach((f) => {
              f.attributes = {
                PARCELOWNER:
                  mainObject?.efada_lands_statements?.efada_lands_statements
                    ?.efada_melkia_aradi,
                OBJECTID: +f.attributes.OBJECTID,
              };
            });

            if (updateFeatures.length) {
              transactionList.push({
                id: layerId,
                updates: updateFeatures.map((x) => {
                  return { attributes: x.attributes };
                }),
              });
            }

            applyEditsMultiple(
              investMapUrl,
              JSON.stringify(transactionList)
            ).then(
              (data) => {
                resolve(true);
              },
              () => {
                reject();
                window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
              }
            );
          } else {
            reject();
            window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
          }
        },
      });
    });
  });
};

export const addInvestFeatures_FeatureServer = function (mainObject) {
  return new Promise((resolve, reject) => {
    let addFeatures = JSON.parse(
      JSON.stringify(mainObject.landData.landData.lands.parcels)
    );

    getInfo(investMapUrl).then((response) => {
      let investLayerId = response["Invest_Site_Polygon"];
      let parcelLayerId = response["Landbase_Parcel"];

      let parcelSpatialIds = addFeatures.map(
        (x) =>
          "PARCEL_SPATIAL_ID='" +
          (x.attributes.PARCEL_SPATIAL_ID || x.attributes.SITE_GEOSPATIAL_ID) +
          "'"
      );
      let siteGeoSpatialIds = addFeatures.map(
        (x) =>
          "SITE_GEOSPATIAL_ID='" +
          (x.attributes.PARCEL_SPATIAL_ID || x.attributes.SITE_GEOSPATIAL_ID) +
          "'"
      );

      queryTask({
        url: investMapUrl + "/" + parcelLayerId,
        where: parcelSpatialIds.join(" or "),
        returnGeometry: false,
        outFields: ["OBJECTID", "PARCEL_SPATIAL_ID"],
        callbackResult: (res) => {
          if (res.features.length) {
            addFeatures.forEach((f) => {
              f.attributes.OBJECTID = res.features?.find(
                (x) =>
                  x.attributes.PARCEL_SPATIAL_ID ==
                    f.attributes.PARCEL_SPATIAL_ID ||
                  x.attributes.SITE_GEOSPATIAL_ID ==
                    f.attributes.PARCEL_SPATIAL_ID
              )?.attributes?.OBJECTID;
            });

            let transactionList = [];
            //delete from parcel
            if (addFeatures.length) {
              transactionList.push({
                id: parcelLayerId,
                deletes: addFeatures.map((x) => x.attributes.OBJECTID),
              });
            }

            addFeatures.forEach((f) => {
              f.attributes.SITE_GEOSPATIAL_ID = f.attributes.PARCEL_SPATIAL_ID;
              f.attributes.SITE_STATUS = 2;
              f.attributes.SITE_SUBTYPE = 4;
              f.attributes.SITE_AREA = f.attributes.PARCEL_AREA;
              f.attributes.SITE_LAT_COORD = f.attributes.lat;
              f.attributes.SITE_LONG_COORD = f.attributes.long;
              f.attributes.SITE_XUTM_COORD = f.attributes.X;
              f.attributes.SITE_YUTM_COORD = f.attributes.Y;
              f.attributes.SITE_LANDUSE = f.attributes.ACTUAL_MAINLANDUSE;
              f.attributes.PARCELOWNER =
                mainObject?.efada_lands_statements?.efada_lands_statements?.efada_melkia_aradi;

              resetBoolValues(f, [
                "SITE_UTL_WATER",
                "SITE_UTL_SWG",
                "SITE_UTL_ELECT",
                "SITE_UTL_GAS",
                "SITE_UTL_HAZARD",
                "SITE_UTL_TELEPHONE",
                "SITE_UTL_ASPHALT",
              ]);

              if (f.attributes.OBJECTID) delete f.attributes.OBJECTID;

              Object.keys(f.attributes).forEach((attribute) => {
                if (f.attributes[attribute + "_Code"] != null) {
                  f.attributes[attribute] = f.attributes[attribute + "_Code"];
                  delete f.attributes[attribute + "_Code"];
                }
              });
            });

            //add to invest
            if (addFeatures.length) {
              transactionList.push({
                id: investLayerId,
                adds: addFeatures.map((x) => {
                  return { attributes: x.attributes, geometry: x.geometry };
                }),
              });
            }

            applyEditsMultiple(
              investMapUrl,
              JSON.stringify(transactionList)
            ).then(
              (data) => {
                resolve(true);
              },
              () => {
                reject();
                window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
              }
            );
          } else {
            queryTask({
              url: investMapUrl + "/" + investLayerId,
              where: siteGeoSpatialIds.join(" or "),
              returnGeometry: false,
              outFields: ["OBJECTID", "PARCEL_SPATIAL_ID"],
              callbackResult: (res) => {
                if (res.features.length) {
                  resolve(true);
                } else {
                  reject();
                  window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
                }
              },
            });
          }
        },
      });
    });
  });
};

const resetBoolValues = (f, fields) => {
  fields.forEach((field) => {
    try {
      if (f.attributes[field]) {
        if (
          f.attributes[field].toLowerCase() == "false" ||
          f.attributes[field].toLowerCase() == "true"
        )
          f.attributes[field] =
            f.attributes[field].toLowerCase() === "false" ? 0 : 1;
      }
    } catch (error) {}
  });
};

const getServicesCount = (mainObject, typeName) => {
  return !_.isEmpty(typeName)
    ? mainObject?.tabtiriPlans?.tabtiriPlansData.planDetails.detailsParcelTypes
        .filter((r) => r.key.trim() == typeName)
        ?.reduce((a, b) => {
          return a + b?.value?.[0]?.value?.length;
        }, 0) ||
        mainObject?.tabtiriPlans?.tabtiriPlansData.planDetails.detailsParcelTypes?.reduce(
          (a, b) => {
            return (
              a +
              b?.value?.[0]?.value?.filter((r) => r.typeName.trim() == typeName)
                ?.length
            );
          },
          0
        )
    : mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails?.uplodedFeatures?.[
        mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails
          ?.selectedCADIndex
      ]?.shapeFeatures?.landbase?.filter((x) => {
        return !x.is_cut;
      }).length;
};

const getPolylineMidPoint = (polyline) => {
  const path = polyline.paths[0];
  const length = new esri.geometry.geometryEngine.geodesicLength(
    polyline,
    "feet"
  ); // esri.geometry.geometryEngine
  const middleLength = length / 2;
  var currentDistance = 0;
  var beforeIndex = 0;
  var startPoint = polyline.getPoint(0, 0);
  for (let i = 1; i < path.length - 1; i++) {
    var nextPoint = polyline.getPoint(0, i);
    var d = new esri.geometry.geometryEngine.distance(
      startPoint,
      nextPoint,
      "feet"
    );
    if (currentDistance + d < middleLength) {
      currentDistance += d;
      startPoint = nextPoint;
    } else {
      beforeIndex = i === 1 ? 0 : i;
      break;
    }
  }
  startPoint = polyline.getPoint(0, beforeIndex);
  const endPoint = polyline.getPoint(0, beforeIndex + 1);
  const x = (startPoint.x + endPoint.x) / 2;
  const y = (startPoint.y + endPoint.y) / 2;
  const midPoint = new Point({
    x,
    y,
    spatialReference: { wkid: polyline.spatialReference.wkid },
  }); // esri.geometry.Point
  return midPoint;
};

const getSubTypeByDesc = (typeDesc, codedValues) => {
  if (!codedValues) {
    codedValues = [];
  }
  if (
    typeDesc.indexOf("مجاورة") != -1 ||
    typeDesc.indexOf("مجاوره") != -1 ||
    typeDesc == 2
  ) {
    return codedValues.find(
      (x) => ["مجاورة", "مجاوره"].indexOf(x.name) != -1 || x.code == typeDesc
    )?.code;
  } else if (
    typeDesc.indexOf("منطقة") != -1 ||
    typeDesc.indexOf("منطقه") != -1 ||
    typeDesc == 3
  ) {
    return codedValues.find(
      (x) => ["منطقة", "منطقه"].indexOf(x.name) != -1 || x.code == typeDesc
    )?.code;
  } else if (
    typeDesc.indexOf("الحى") != -1 ||
    typeDesc.indexOf("الحي") != -1 ||
    typeDesc == 4
  ) {
    return codedValues.find(
      (x) => ["الحى", "الحي"].indexOf(x.name) != -1 || x.code == typeDesc
    )?.code;
  } else if (
    typeDesc.indexOf("مرحلة") != -1 ||
    typeDesc.indexOf("مرحله") != -1 ||
    typeDesc == 5
  ) {
    return codedValues.find(
      (x) => ["مرحلة", "مرحله"].indexOf(x.name) != -1 || x.code == typeDesc
    )?.code;
  } else if (
    typeDesc.indexOf("فئه") != -1 ||
    typeDesc.indexOf("فئة") != -1 ||
    typeDesc == 1
  ) {
    return codedValues.find(
      (x) => ["فئة", "فئه"].indexOf(x.name) != -1 || x.code == typeDesc
    )?.code;
  } else {
    return typeDesc;
  }
};

const getSubTypeByCode = (code, codedValues) => {
  if (!codedValues) {
    codedValues = [];
  }
  return codedValues.find((x) => x.code == code)?.name || code || null;
};

const recomputeLineAngles = (feature) => {
  let north_points = [];
  let south_points = [];
  let weast_points = [];
  let east_points = [];
  let linesCenters = feature.rings[0].reduce((a, b, i) => {
    if (feature.rings[0][i + 1] != undefined) {
      a.push(
        esri.geometry
          .Polyline({
            paths: [[b, feature.rings[0][i + 1]]],
            spatialReference: feature.spatialReference,
          })
          .getExtent()
          .getCenter()
      );
    }
    return a;
  }, []);

  Array.prototype.max = function () {
    return Math.max.apply(null, this);
  };

  Array.prototype.min = function () {
    return Math.min.apply(null, this);
  };

  let maxY = linesCenters.map((x) => x.y).max();
  let minY = linesCenters.map((x) => x.y).min();

  for (var j = 0; j < linesCenters.length; j++) {
    let direction;
    let polygonCenter = new esri.geometry.Polygon(feature)
      .getExtent()
      .getCenter();
    let lineCenter = linesCenters[j];

    if (lineCenter.y == maxY) {
      direction = "north";
    } else if (lineCenter.y == minY) {
      direction = "south";
    } else if (
      lineCenter.x < polygonCenter.x &&
      lineCenter.y > minY &&
      lineCenter.y < maxY
    ) {
      direction = "weast";
    } else if (
      lineCenter.x > polygonCenter.x &&
      lineCenter.y > minY &&
      lineCenter.y < maxY
    ) {
      direction = "east";
    }

    if (direction == "north") {
      north_points.push(lineCenter);
    } else if (direction == "south") {
      south_points.push(lineCenter);
    } else if (direction == "east") {
      east_points.push(lineCenter);
    } else {
      weast_points.push(lineCenter);
    }
  }

  return {
    north_points: north_points,
    south_points: south_points,
    east_points: east_points,
    weast_points: weast_points,
  };
};

const checkPlanFeatures = (
  props,
  layerId,
  values,
  mainObject,
  submission,
  sub_steps,
  distRes,
  transactionList,
  url,
  deletesOnly = false
) => {
  return new Promise((resolve, reject) => {
    try {
      getFieldDomain("", layerId).then((domains) => {
        let planSpatialIds = "";
        let addFeatures = [];

        let finalApprovalIndex =
          sub_steps?.steps_history?.prevSteps?.findLastIndex(
            (step) => [2372, 2330, 3119].indexOf(step.prevStep.id) != -1
          );
        let aminSignatureIndex =
          sub_steps?.steps_history?.prevSteps?.findLastIndex(
            (step) => [2899, 3124, 2921].indexOf(step.prevStep.id) != -1
          );

        let approvalDate = "";
        if (aminSignatureIndex > finalApprovalIndex) {
          approvalDate =
            (finalApprovalIndex != -1 &&
              sub_steps?.steps_history?.prevSteps[aminSignatureIndex].date) ||
            "";
        }

        let spatialId = "";
        let polygonCentroid = null;

        if (!values?.boundry.length) return reject();

        values?.boundry?.forEach((f) => {
          polygonCentroid = new esri.geometry.Polygon(f).getCentroid();
          spatialId = GetSpatial(polygonCentroid);
          planSpatialIds += (_.isEmpty(planSpatialIds) ? "" : ", ") + spatialId;
          let district = distRes.features.find(
            (x) =>
              //CheckPointsWithinPolygonOrNotUsingEsri(x.geometry, polygonCentroid)
              window.geometryEngine.within(
                new esri.geometry.Polygon(f),
                x.geometry.getExtent()
              ) ||
              window.geometryEngine.contains(
                x.geometry.getExtent(),
                new esri.geometry.Polygon(f)
              ) ||
              window.geometryEngine.intersects(
                x.geometry.getExtent(),
                new esri.geometry.Polygon(f)
              ) ||
              window.geometryEngine.overlaps(
                x.geometry.getExtent(),
                new esri.geometry.Polygon(f)
              )
          );

          let polygon = esri.geometry.Polygon(f);
          delete polygon.hasM;
          delete polygon.hasZ;
          let plan_object = {
            geometry: polygon,
            attributes: {
              MUNICIPALITY_NAME: mainObject.landData.landData.municipality_id,
              SUB_MUNICIPALITY_NAME:
                mainObject?.landData?.landData?.submunicipality?.Submun_code ||
                mainObject?.landData?.landData?.lands?.parcels?.[0]?.attributes
                  ?.SUB_MUNICIPALITY_NAME?.Submun_code,
              PLAN_NO: mainObject.lagna_karar.lagna_karar.plan_number,
              PLAN_NAME: mainObject.landData.landData.parcel_desc || null,
              PLAN_SAK_NO:
                mainObject.waseka.waseka.table_waseka[0].number_waseka || null,
              PLAN_AREA: f.area || null,
              PLAN_CLASS:
                (submission.workflows?.id == 2209 && 1) ||
                (submission.workflows?.id == 2210 && 2),
              PLAN_STATUS: 1,
              PLAN_LANDUSE:
                getUsingSymbolCode(
                  layerId,
                  "PLAN_LANDUSE",
                  mainObject.submission_data.mostafed_data.mo5tat_use
                ) || null,
              // PLAN_SOILTEST_OFFICE:
              //   domains[14].domain.codedValues.find(
              //     (x) =>
              //       x.name.indexOf(
              //         mainObject.requests.attachments.table_attachments[3].fa7s
              //           .office_name
              //       ) != -1
              //   )?.code || 1 || null,
              PLAN_APPROVDOC_NO:
                (approvalDate && submission.request_no) || null,
              PLAN_APPROVDATE: approvalDate || null,
              // PLAN_PARCEL_NO: getServicesCount(mainObject) || null,
              // PLAN_RESDUNIT_NO: getServicesCount(mainObject, "سكنى"),
              // PLAN_COMMUNIT_NO: getServicesCount(mainObject, "خدمات تجارية"),
              // PLAN_INDSTUNIT_NO: getServicesCount(mainObject, "خدمات صناعية"),
              // PLAN_MOSQUE_NO: getServicesCount(mainObject, "خدمات دينية"),
              // PLAN_SCHOOL_NO: getServicesCount(mainObject, "خدمات تعليمية"),
              // PLAN_GOVFACILITY_NO: getServicesCount(mainObject, "خدمات حكومية"),
              // PLAN_GARDEN_NO:
              //   getServicesCount(mainObject, "خدمات ترفيهية ورياضية") || null,
              // PLAN_MEDICAL_NO:
              //   getServicesCount(mainObject, "خدمات صحية") || null,
              PLAN_APPROVED_BY: 105 || null,
              PLAN_SPATIAL_ID: +spatialId || null,
              DISTRICT_NAME: district?.attributes?.DISTRICT_NAME || null,
              APPROVAL_STATUS: 1,
              PLAN_LAT_COORD: polygonCentroid?.y?.toString() || null,
              PLAN_LONG_COORD: polygonCentroid?.x?.toString() || null,
            },
          };
          if (url) {
            plan_object["attributes"].SUBMISSION_NO = submission.request_no;
          }
          addFeatures.push(plan_object);
        });

        if (!planSpatialIds) {
          return reject();
        }

        // console.log('plan spatial Ids', planSpatialIds);
        let parcelPromises = window.promiseAll([
          queryTask({
            url: (url || mapUrl) + "/" + layerId,
            where:
              (deletesOnly && `SUBMISSION_NO = ${submission.request_no}`) ||
              "PLAN_SPATIAL_ID IN (" + planSpatialIds + ")",
            outFields: ["OBJECTID"],
            returnExecuteObject: true,
          }),
        ]);
        parcelPromises.then((resultsData) => {
          //loop on polygons and add polygon that not add before
          resultsData.forEach((result, index) => {
            if (result.features.length > 0) {
              transactionList.push({
                id: layerId,
                deletes: result.features.map((x) => {
                  return x.attributes.OBJECTID;
                }),
              });
            }
            if (!deletesOnly) {
              transactionList.push({
                id: layerId,
                adds: addFeatures.map((x) => {
                  return { attributes: x.attributes, geometry: x.geometry };
                }),
              });
            }
          });
          resolve(true);
        });
      });
    } catch (err) {
      console.error(err);
      reject();
    }
  });
};
const checkLandbaseFeatures = (
  props,
  layerId,
  values,
  mainObject,
  submission,
  sub_steps,
  distRes,
  domains,
  transactionList,
  url,
  deletesOnly = false
) => {
  return new Promise(async (resolve, reject) => {
    let servicesTypes = await Axios.get(
      `${host}/CadLayers/GetAll?pageSize=1000`
    );
    try {
      let spatialIds = "";
      let addFeatures = [];
      let polygonCentroid;
      let spatialId;
      let lands = values?.landbase?.filter((x) => x.text != "23");
      if (!lands.length) return reject();
      lands?.forEach((f) => {
        polygonCentroid = new esri.geometry.Polygon(f).getCentroid();
        spatialId = GetSpatial(polygonCentroid);
        spatialIds += (_.isEmpty(spatialIds) ? "" : ", ") + spatialId;

        let block = values?.block?.find((x) =>
          CheckPointsWithinPolygonOrNotUsingEsri(x, polygonCentroid)
        );
        let subdivision = values?.subdivision?.find((x) =>
          CheckPointsWithinPolygonOrNotUsingEsri(x, polygonCentroid)
        );
        let district = distRes?.features?.find(
          (x) =>
            //CheckPointsWithinPolygonOrNotUsingEsri(x.geometry, polygonCentroid)
            window.geometryEngine.within(
              new esri.geometry.Polygon(f),
              x.geometry.getExtent()
            ) ||
            window.geometryEngine.contains(
              x.geometry.getExtent(),
              new esri.geometry.Polygon(f)
            ) ||
            window.geometryEngine.intersects(
              x.geometry.getExtent(),
              new esri.geometry.Polygon(f)
            ) ||
            window.geometryEngine.overlaps(
              x.geometry.getExtent(),
              new esri.geometry.Polygon(f)
            )
        );
        let cadLayers = servicesTypes?.data?.results.find(
          (x) => x.symbol_id == f?.typeId
        );
        let polygon = esri.geometry.Polygon(f);
        delete polygon.hasM;
        delete polygon.hasZ;

        let parcel_object = {
          geometry: polygon,
          attributes: {
            MUNICIPALITY_NAME: mainObject.landData.landData.municipality_id,
            SUB_MUNICIPALITY_NAME:
              mainObject?.landData?.landData?.submunicipality?.Submun_code ||
              mainObject?.landData?.landData?.lands?.parcels?.[0]?.attributes
                ?.SUB_MUNICIPALITY_NAME?.Submun_code,
            DISTRICT_NAME: district?.attributes?.DISTRICT_NAME || null,
            CITY_NAME:
              domains[26]?.domain?.codedValues?.find(
                (city) =>
                  city.name ==
                  mainObject?.landData?.landData?.municipality?.CITY_NAME_A
              )?.code || null,
            PARCEL_PLAN_NO: f?.number || null,
            PARCEL_AREA: f?.area || null,
            PARCEL_MAIN_LUSE: cadLayers?.layer_main_code,
            PARCEL_SUB_LUSE: cadLayers?.layer_code || null,
            PARCEL_BLOCK_NO: block?.text || null,
            USING_SYMBOL:
              (f?.text?.indexOf("@") != -1 && f?.usingSymbol) || null,
            PLAN_NO: mainObject.lagna_karar.lagna_karar.plan_number,
            PARCEL_LAT_COORD: polygonCentroid?.y?.toString() || null,
            PARCEL_LONG_COORD: polygonCentroid?.x?.toString() || null,
            PARCEL_SPATIAL_ID: +spatialId,
            BLOCK_SPATIAL_ID:
              +GetSpatial(new esri.geometry.Polygon(block).getCentroid()) ||
              null,
            SUBDIVISION_TYPE:
              getSubTypeByDesc(
                subdivision?.text.trim() || "",
                domains?.[22]?.domain?.codedValues
              ) || null,
            SUBDIVISION_DESCRIPTION: getSubTypeByCode(
              subdivision?.text,
              domains?.[22]?.domain?.codedValues
            ),
            SUBDIVISION_SPATIAL_ID:
              (subdivision &&
                +GetSpatial(
                  new esri.geometry.Polygon(subdivision).getCentroid()
                )) ||
              null,
            PLAN_SPATIAL_ID:
              (values?.boundry?.[0] &&
                +GetSpatial(
                  new esri.geometry.Polygon(values?.boundry?.[0]).getCentroid()
                )) ||
              null,
          },
        };
        if (url) {
          parcel_object["attributes"].SUBMISSION_NO = submission.request_no;
        }
        addFeatures.push(parcel_object);
      });

      if (!spatialIds) {
        return reject();
      }

      //console.log('land spatial Ids', spatialIds);
      let parcelPromises = window.promiseAll([
        queryTask({
          url: (url || mapUrl) + "/" + layerId,
          where:
            (deletesOnly && `SUBMISSION_NO = ${submission.request_no}`) ||
            "PARCEL_SPATIAL_ID IN (" + spatialIds + ")",
          outFields: ["OBJECTID"],
          returnExecuteObject: true,
        }),
      ]);
      parcelPromises.then((resultsData) => {
        //loop on polygons and add polygon that not add before
        resultsData.forEach((result, index) => {
          if (result.features.length > 0) {
            transactionList.push({
              id: layerId,
              deletes: result.features.map((x) => {
                return x.attributes.OBJECTID;
              }),
            });
          }
          if (!deletesOnly) {
            transactionList.push({
              id: layerId,
              adds: addFeatures.map((x) => {
                return {
                  attributes: x.attributes,
                  geometry: x.geometry,
                };
              }),
            });
          }
        });
        resolve(true);
      });
    } catch (err) {
      console.error(err);
      reject();
    }
  });
};
const checkStreetFeatures = (
  props,
  layerId,
  values,
  mainObject,
  submission,
  sub_steps,
  distRes,
  domains,
  transactionList,
  url,
  deletesOnly = false
) => {
  return new Promise((resolve, reject) => {
    try {
      let addFeatures = [];
      let polygonCentroid;
      let polylineCenter;
      let spatialIds = "";
      let spatialId;
      let streets = (
        props.formValues?.tabtiriPlansData ||
        mainObject.tabtiriPlans?.tabtiriPlansData
      )?.planDetails?.streets;
      if (!streets?.length) return resolve(true);
      streets?.forEach((f) => {
        polygonCentroid = new esri.geometry.Polygon(f).getCentroid();
        let district = distRes?.features?.find(
          (x) =>
            //CheckPointsWithinPolygonOrNotUsingEsri(x.geometry, polygonCentroid)
            window.geometryEngine.within(
              new esri.geometry.Polygon(f),
              x.geometry.getExtent()
            ) ||
            window.geometryEngine.contains(
              x.geometry.getExtent(),
              new esri.geometry.Polygon(f)
            ) ||
            window.geometryEngine.intersects(
              x.geometry.getExtent(),
              new esri.geometry.Polygon(f)
            ) ||
            window.geometryEngine.overlaps(
              x.geometry.getExtent(),
              new esri.geometry.Polygon(f)
            )
        );

        let computedFeature = recomputeLineAngles(f);

        let weast_center_point = computedFeature.weast_points[0];
        let east_center_point = computedFeature.east_points[0];
        let south_center_point = computedFeature.south_points[0];
        let north_center_point = computedFeature.north_points[0];

        let polyline = new esri.geometry.Polyline({
          paths: [
            [
              [north_center_point.x, north_center_point.y],
              [south_center_point.x, south_center_point.y],
            ],
          ],
          spatialReference: f.spatialReference,
        });

        // addGraphicToLayer(
        //   polyline,
        //   getMap(),
        //   "Layer_G23",
        //   null,
        //   [255, 255, 255],
        //   null,
        //   () => {},
        //   null,
        //   null,
        //   false
        // );

        polylineCenter = polyline.getExtent().getCenter();
        spatialId = GetSpatial(polylineCenter);
        spatialIds += (_.isEmpty(spatialIds) ? "" : ", ") + spatialId;
        let street_object = {
          geometry: polyline,
          attributes: {
            MUNICIPALITY_NAME: mainObject.landData.landData.municipality_id,
            SUB_MUNICIPALITY_NAME:
              mainObject?.landData?.landData?.submunicipality?.Submun_code ||
              mainObject?.landData?.landData?.lands?.parcels?.[0]?.attributes
                ?.SUB_MUNICIPALITY_NAME?.Submun_code,
            DISTRICT_NAME: district?.attributes?.DISTRICT_NAME || null,
            CITY_NAME:
              domains[26]?.domain?.codedValues?.find(
                (city) =>
                  city.name ==
                  mainObject?.landData?.landData?.municipality?.CITY_NAME_A
              )?.code || null,
            STREET_FULLNAME: (f?.streetname || f?.number || "").trim(),
            STREET_CLASS: f?.streetClass || null,
            STREET_TYPE: f?.streetType || null,
            ONE_WAY: f?.oneWay != undefined ? (f?.oneWay && 1) || 0 : null,
            DIVIDED: f?.divided != undefined ? (f?.divided && 1) || 0 : null,
            WIDTH: f?.width,
            STREET_SPATIAL_ID: spatialId,
          },
        };

        if (url) {
          street_object["attributes"].SUBMISSION_NO = submission.request_no;
        }
        addFeatures.push(street_object);
      });

      if (!spatialIds) {
        return reject();
      }

      //console.log('street spatial Ids', spatialIds);
      let parcelPromises = window.promiseAll([
        queryTask({
          url: (url || mapUrl) + "/" + layerId,
          where:
            (deletesOnly && `SUBMISSION_NO = ${submission.request_no}`) ||
            "STREET_SPATIAL_ID IN (" + spatialIds + ")",
          outFields: ["OBJECTID"],
          returnExecuteObject: true,
        }),
      ]);
      parcelPromises.then((resultsData) => {
        //loop on polygons and add polygon that not add before
        resultsData.forEach((result, index) => {
          if (result.features.length > 0) {
            transactionList.push({
              id: layerId,
              deletes: result.features.map((x) => {
                return x.attributes.OBJECTID;
              }),
            });
          }
          if (!deletesOnly) {
            transactionList.push({
              id: layerId,
              adds: addFeatures.map((x) => {
                return { attributes: x.attributes, geometry: x.geometry };
              }),
            });
          }
        });
        resolve(true);
      });
    } catch (err) {
      console.error(err);
      reject();
    }
  });
};
const checkBlockFeatures = (
  props,
  layerId,
  values,
  mainObject,
  submission,
  sub_steps,
  distRes,
  transactionList,
  url,
  deletesOnly = false
) => {
  return new Promise((resolve, reject) => {
    try {
      let spatialIds = "";
      let addFeatures = [];
      let spatialId = "";
      let polygonCentroid;
      if (!values?.block?.length) return resolve(true);
      values?.block?.forEach((f) => {
        polygonCentroid = new esri.geometry.Polygon(f).getCentroid();
        spatialId = GetSpatial(polygonCentroid);
        spatialIds += (_.isEmpty(spatialIds) ? "" : ", ") + spatialId;
        let district = distRes?.features?.find(
          (x) =>
            //CheckPointsWithinPolygonOrNotUsingEsri(x.geometry, polygonCentroid)
            window.geometryEngine.within(
              new esri.geometry.Polygon(f),
              x.geometry.getExtent()
            ) ||
            window.geometryEngine.contains(
              x.geometry.getExtent(),
              new esri.geometry.Polygon(f)
            ) ||
            window.geometryEngine.intersects(
              x.geometry.getExtent(),
              new esri.geometry.Polygon(f)
            ) ||
            window.geometryEngine.overlaps(
              x.geometry.getExtent(),
              new esri.geometry.Polygon(f)
            )
        );
        let polygon = esri.geometry.Polygon(f);
        delete polygon.hasM;
        delete polygon.hasZ;
        let block_object = {
          geometry: polygon,
          attributes: {
            MUNICIPALITY_NAME: mainObject.landData.landData.municipality_id,
            SUB_MUNICIPALITY_NAME:
              mainObject?.landData?.landData?.submunicipality?.Submun_code ||
              mainObject?.landData?.landData?.lands?.parcels?.[0]?.attributes
                ?.SUB_MUNICIPALITY_NAME?.Submun_code,
            BLOCK_NO: f?.text || null,
            PLAN_NO: mainObject.lagna_karar.lagna_karar.plan_number,
            BLOCK_AREA: f?.area || null,
            BLOCK_LAT_COORD: polygonCentroid?.y?.toString() || null,
            BLOCK_LONG_COORD: polygonCentroid?.x?.toString() || null,
            BLOCK_SPATIAL_ID: +spatialId,
            DISTRICT_NAME: district?.attributes?.DISTRICT_NAME || null,
            PLAN_SPATIAL_ID:
              (values?.boundry?.[0] &&
                +GetSpatial(
                  new esri.geometry.Polygon(values?.boundry?.[0]).getCentroid()
                )) ||
              null,
          },
        };
        if (url) {
          block_object["attributes"].SUBMISSION_NO = submission.request_no;
        }
        addFeatures.push(block_object);
      });

      if (!spatialIds) {
        return resolve(true);
      }

      //console.log('block spatial Ids', spatialIds);
      let parcelPromises = window.promiseAll([
        queryTask({
          url: (url || mapUrl) + "/" + layerId,
          where:
            (deletesOnly && `SUBMISSION_NO = ${submission.request_no}`) ||
            "BLOCK_SPATIAL_ID IN (" + spatialIds + ")",
          outFields: ["OBJECTID"],
          returnExecuteObject: true,
        }),
      ]);
      parcelPromises.then((resultsData) => {
        //loop on polygons and add polygon that not add before
        resultsData.forEach((result, index) => {
          if (result.features.length > 0) {
            transactionList.push({
              id: layerId,
              deletes: result.features.map((x) => {
                return x.attributes.OBJECTID;
              }),
            });
          }
          if (!deletesOnly) {
            transactionList.push({
              id: layerId,
              adds: addFeatures.map((x) => {
                return { attributes: x.attributes, geometry: x.geometry };
              }),
            });
          }
        });
        resolve(true);
      });
    } catch (err) {
      console.error(err);
      reject();
    }
  });
};
const checkSubdivisionFeatures = (
  props,
  layerId,
  values,
  mainObject,
  submission,
  sub_steps,
  domains,
  transactionList,
  url,
  deletesOnly = false
) => {
  return new Promise((resolve, reject) => {
    try {
      let spatialIds = "";
      let addFeatures = [];
      let spatialId = "";
      let polygonCentroid;
      if (!values?.subdivision?.length) return resolve(true);
      values?.subdivision?.forEach((f) => {
        polygonCentroid = new esri.geometry.Polygon(f).getCentroid();
        spatialId = GetSpatial(polygonCentroid);
        spatialIds += (_.isEmpty(spatialIds) ? "" : ", ") + spatialId;
        let polygon = esri.geometry.Polygon(f);
        delete polygon.hasM;
        delete polygon.hasZ;
        let subdivision_object = {
          geometry: polygon,
          attributes: {
            MUNICIPALITY_NAME: mainObject.landData.landData.municipality_id,
            SUB_MUNICIPALITY_NAME:
              mainObject?.landData?.landData?.submunicipality?.Submun_code ||
              mainObject?.landData?.landData?.lands?.parcels?.[0]?.attributes
                ?.SUB_MUNICIPALITY_NAME?.Submun_code,
            SUBDIVISION_NO: f?.text.trim() || null,
            PLAN_NO: mainObject.lagna_karar.lagna_karar.plan_number,
            SUBDIVISION_AREA: f?.area || null,
            SUBDIVISION_DESCRIPTION: getSubTypeByCode(
              f?.text.trim(),
              domains?.[22]?.domain?.codedValues
            ),
            SUBDIVISION_TYPE:
              getSubTypeByDesc(
                f?.text.trim() || "",
                domains?.[22]?.domain?.codedValues
              ) || null,
            SUBDIVISION_SPATIAL_ID: +spatialId || null,
            PLAN_SPATIAL_ID:
              (values?.boundry?.[0] &&
                +GetSpatial(
                  new esri.geometry.Polygon(values?.boundry?.[0]).getCentroid()
                )) ||
              null,
            LONG_COORD: polygonCentroid?.x?.toString(),
            LAT_COORD: polygonCentroid?.y?.toString(),
          },
        };

        if (url) {
          subdivision_object["attributes"].SUBMISSION_NO =
            submission.request_no;
        }

        addFeatures.push(subdivision_object);
      });

      if (!spatialIds) {
        return resolve(true);
      }

      //console.log('subdivision spatial Ids', spatialIds);
      let parcelPromises = window.promiseAll([
        queryTask({
          url: (url || mapUrl) + "/" + layerId,
          where:
            (deletesOnly && `SUBMISSION_NO = ${submission.request_no}`) ||
            "SUBDIVISION_SPATIAL_ID IN (" + spatialIds + ")",
          outFields: ["OBJECTID"],
          returnExecuteObject: true,
        }),
      ]);
      parcelPromises.then((resultsData) => {
        //loop on polygons and add polygon that not add before
        resultsData.forEach((result, index) => {
          if (result.features.length > 0) {
            transactionList.push({
              id: layerId,
              deletes: result.features.map((x) => {
                return x.attributes.OBJECTID;
              }),
            });
          }
          if (!deletesOnly) {
            transactionList.push({
              id: layerId,
              adds: addFeatures.map((x) => {
                return { attributes: x.attributes, geometry: x.geometry };
              }),
            });
          }
        });
        resolve(true);
      });
    } catch (err) {
      console.error(err);
      reject();
    }
  });
};

export const addPlanFeatures_FeatureServer = function (
  mainObject,
  submission,
  props,
  url
) {
  return new Promise((resolve, reject) => {
    let transactionList = [];

    let values =
      (url &&
        mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[0]
          ?.shapeFeatures) ||
      mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails
        ?.uplodedFeatures?.[0]?.shapeFeatures;

    getInfo(url || mapUrl).then((response) => {
      let planDataLayerId = response[`${(url && "Pre_") || ""}Plan_Data`];
      let parcelLayerId = response[`${(url && "Pre_") || ""}Landbase_Parcel`];
      let StreetNamingLayerId =
        response[`${(url && "Pre_") || ""}Street_Naming`];
      let blockLayerId = response[`${(url && "Pre_") || ""}Survey_Block`];
      let subdivisionLayerId = response[`${(url && "Pre_") || ""}Subdivision`];
      let districtLayerId = response["District_Boundary"];
      getSubmissionHistory(submission.workflow_id, props, submission).then(
        (result) => {
          getFeatures(districtLayerId).then((distRes) => {
            getFieldDomain("", parcelLayerId).then((domains) => {
              let onError = (err) => {
                reject();
                window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
              };
              checkPlanFeatures(
                props,
                planDataLayerId,
                values,
                mainObject,
                submission,
                result,
                distRes,
                transactionList,
                url
              ).then((result) => {
                if (result) {
                  checkLandbaseFeatures(
                    props,
                    parcelLayerId,
                    values,
                    mainObject,
                    submission,
                    result,
                    distRes,
                    domains,
                    transactionList,
                    url
                  ).then((result) => {
                    if (result) {
                      checkStreetFeatures(
                        props,
                        StreetNamingLayerId,
                        values,
                        mainObject,
                        submission,
                        result,
                        distRes,
                        domains,
                        transactionList,
                        url
                      ).then((result) => {
                        if (result) {
                          checkBlockFeatures(
                            props,
                            blockLayerId,
                            values,
                            mainObject,
                            submission,
                            result,
                            distRes,
                            transactionList,
                            url
                          ).then((result) => {
                            if (result) {
                              checkSubdivisionFeatures(
                                props,
                                subdivisionLayerId,
                                values,
                                mainObject,
                                submission,
                                result,
                                domains,
                                transactionList,
                                url
                              ).then((result) => {
                                if (result) {
                                  applyEditsMultiple(
                                    mapUrl,
                                    JSON.stringify(transactionList)
                                  ).then(
                                    (data) => {
                                      resolve(true);
                                    },
                                    (res) => {
                                      reject();
                                      window.notifySystem(
                                        "error",
                                        "حدث خطأ أثناء إنهاء المعاملة"
                                      );
                                    }
                                  );
                                }
                              }, onError);
                            }
                          }, onError);
                        }
                      }, onError);
                    }
                  }, onError);
                }
              }, onError);
            });
          });
        }
      );
    });
  });
};

export const deletePriApprovedPlanFeatures_FeatureServer = function (
  mainObject,
  submission,
  props,
  url
) {
  return new Promise((resolve, reject) => {
    let transactionList = [];

    let values =
      (url &&
        mainObject?.plans?.plansData?.planDetails?.uplodedFeatures?.[0]
          ?.shapeFeatures) ||
      mainObject?.tabtiriPlans?.tabtiriPlansData?.planDetails
        ?.uplodedFeatures?.[0]?.shapeFeatures;

    getInfo(url || mapUrl).then((response) => {
      let planDataLayerId = response[`${(url && "Pre_") || ""}Plan_Data`];
      let parcelLayerId = response[`${(url && "Pre_") || ""}Landbase_Parcel`];
      let StreetNamingLayerId =
        response[`${(url && "Pre_") || ""}Street_Naming`];
      let blockLayerId = response[`${(url && "Pre_") || ""}Survey_Block`];
      let subdivisionLayerId = response[`${(url && "Pre_") || ""}Subdivision`];
      let districtLayerId = response["District_Boundary"];
      getSubmissionHistory(submission.workflow_id, props, submission).then(
        (result) => {
          getFeatures(districtLayerId).then((distRes) => {
            getFieldDomain("", parcelLayerId).then((domains) => {
              let onError = () => {
                reject();
                window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
              };
              checkPlanFeatures(
                props,
                planDataLayerId,
                values,
                mainObject,
                submission,
                result,
                distRes,
                transactionList,
                url,
                true
              ).then((result) => {
                if (result) {
                  checkLandbaseFeatures(
                    props,
                    parcelLayerId,
                    values,
                    mainObject,
                    submission,
                    result,
                    distRes,
                    domains,
                    transactionList,
                    url,
                    true
                  ).then((result) => {
                    if (result) {
                      checkStreetFeatures(
                        props,
                        StreetNamingLayerId,
                        values,
                        mainObject,
                        submission,
                        result,
                        distRes,
                        domains,
                        transactionList,
                        url,
                        true
                      ).then((result) => {
                        if (result) {
                          checkBlockFeatures(
                            props,
                            blockLayerId,
                            values,
                            mainObject,
                            submission,
                            result,
                            distRes,
                            transactionList,
                            url,
                            true
                          ).then((result) => {
                            if (result) {
                              checkSubdivisionFeatures(
                                props,
                                subdivisionLayerId,
                                values,
                                mainObject,
                                submission,
                                result,
                                domains,
                                transactionList,
                                url,
                                true
                              ).then((result) => {
                                if (result) {
                                  applyEditsMultiple(
                                    mapUrl,
                                    JSON.stringify(transactionList)
                                  ).then(
                                    (data) => {
                                      resolve(true);
                                    },
                                    (res) => {
                                      reject();
                                      window.notifySystem(
                                        "error",
                                        "حدث خطأ أثناء إنهاء المعاملة"
                                      );
                                    }
                                  );
                                }
                              }, onError);
                            }
                          }, onError);
                        }
                      }, onError);
                    }
                  }, onError);
                }
              }, onError);
            });
          });
        }
      );
    });
  });
};

export const addGovPlanFeatures_FeatureServer = function (mainObject) {
  return new Promise((resolve, reject) => {
    let transactionList = [];

    let addFeatures = mainObject.landData.landData.lands.parcels;

    getInfo(investMapUrl).then((response) => {
      let investLayerId = response["Invest_Site_Polygon"];
      let parcelLayerId = response["Landbase_Parcel"];

      //delete from parcel
      if (addFeatures.length) {
        transactionList.push({
          id: parcelLayerId,
          deletes: addFeatures.map((x) => x.attributes.OBJECTID),
        });
      }

      addFeatures.forEach((f) => {
        f.attributes.SITE_GEOSPATIAL_ID = f.attributes.PARCEL_SPATIAL_ID;
        f.attributes.SITE_STATUS = 2;
        f.attributes.SITE_SUBTYPE = 4;
        f.attributes.SITE_AREA = f.attributes.PARCEL_AREA;
        f.attributes.SITE_LAT_COORD = f.attributes.lat;
        f.attributes.SITE_LONG_COORD = f.attributes.long;
        f.attributes.SITE_XUTM_COORD = f.attributes.X;
        f.attributes.SITE_YUTM_COORD = f.attributes.Y;
        f.attributes.SITE_LANDUSE = f.attributes.ACTUAL_MAINLANDUSE;

        if (f.attributes.OBJECTID) delete f.attributes.OBJECTID;

        Object.keys(f.attributes).forEach((attribute) => {
          if (f.attributes[attribute + "_Code"] != null) {
            f.attributes[attribute] = f.attributes[attribute + "_Code"];
            delete f.attributes[attribute + "_Code"];
          }
        });
      });

      //add to invest
      if (addFeatures.length) {
        transactionList.push({
          id: investLayerId,
          adds: addFeatures.map((x) => {
            return { attributes: x.attributes, geometry: x.geometry };
          }),
        });
      }

      // applyEditsMultiple(investMapUrl, JSON.stringify(transactionList)).then(
      //   (data) => {
      resolve(true);
      //   },
      //   () => {
      //     reject();
      //     window.notifySystem("error", "حدث خطأ أثناء إنهاء المعاملة");
      //   }
      // );
    });
  });
};

export const readExcel = function (uploadedUrl, callback) {
  /* set up async GET request */
  var req = new XMLHttpRequest();
  req.open("GET", window.filesHost + "/" + uploadedUrl, true);
  req.responseType = "arraybuffer";

  req.onload = function (e) {
    try {
      var data = new Uint8Array(req.response);
      var workbook = XLSX.read(data, { type: "array" });
      if (workbook.SheetNames?.length) {
        let first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        let worksheet = workbook.Sheets[first_sheet_name];

        let _JsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

        callback({
          features: _JsonData.map((item) => {
            return { attributes: item };
          }),
        });
      } else {
        window.notifySystem("error", "ملف excel غير صالح");
      }
    } catch (error) {
      window.notifySystem("error", "ملف excel غير صالح");
      console.error(error);
    }
    store.dispatch({
      type: "Show_Loading_new",
      loading: false,
    });
  };

  req.send();
};

export const formatMappingShape = function (tempfeatures, layer, map) {
  let columns = tempfeatures[0].attributes;
  let mappingfields = {};

  let mappedFeatures = JSON.parse(JSON.stringify(tempfeatures));

  mappedFeatures.forEach((f) => {
    f.attributes = {};
  });

  editAndDeleteMapLayers[layer]?.outFields.forEach((outField) => {
    let field = Object.keys(columns).find((x) => x == outField.name);
    if (field) {
      mappingfields[outField.name] = field;
    } else {
      field = Object.keys(columns).find((x) => outField.name.startsWith(x));
      mappingfields[outField.name] = field;
    }
  });

  //for subdivision
  if (mappingfields["SUBDIVISION_DESCRIPTION"]) {
    mappingfields["SUBDIVISION_DESCRIPTION"] = "SUBDIVIS_1";
  }

  mappedFeatures.forEach((f, index) => {
    f.attributes["OBJECTID"] = tempfeatures[index].attributes["MAP_OBJE_1"];
    Object.keys(mappingfields).forEach((key) => {
      f.attributes[key] = tempfeatures[index].attributes[mappingfields[key]];
    });
  });

  let spatialReference = new esri.SpatialReference(map.spatialReference.wkid);

  mappedFeatures.forEach((f) => {
    if (editAndDeleteMapLayers[layer].type == "polygon") {
      f.geometry = esri.geometry.Polygon(f.geometry, spatialReference);
    } else if (editAndDeleteMapLayers[layer].type == "line") {
      f.geometry = esri.geometry.Polyline(f.geometry, spatialReference);
    } else if (editAndDeleteMapLayers[layer].type == "point") {
      f.geometry = esri.geometry.Point(f.geometry, spatialReference);
    }

    f.geometry.spatialReference = spatialReference;
  });

  return mappedFeatures;
};

export const formatMappingExcel = function (tempfeatures, layerName, map) {
  let notFormatedFeatures = tempfeatures.map((object) => ({ ...object }));

  let xMapFieldName = "x";
  let yMapFieldName = "y";
  let serialMapFieldName = "OBJECTID";

  notFormatedFeatures = groupByLodash(
    notFormatedFeatures,
    (v) => v.attributes[serialMapFieldName]
  );

  let features = [];

  if (editAndDeleteMapLayers[layerName].type == "polygon") {
    Object.keys(notFormatedFeatures).forEach((serial) => {
      let rings = [
        notFormatedFeatures[serial].map((f) => {
          return [f.attributes[xMapFieldName], f.attributes[yMapFieldName]];
        }),
      ];

      //check if start point = end point x , y
      if (
        !(
          rings[0][0][0] == rings[0][rings[0].length - 1][0] &&
          rings[0][0][1] == rings[0][rings[0].length - 1][1]
        )
      ) {
        rings[0].push(rings[0][0]);
      }

      features.push({
        attributes: notFormatedFeatures[serial][0].attributes,
        geometry: { rings: rings },
      });
    });
  } else if (editAndDeleteMapLayers[layerName].type == "line") {
    Object.keys(notFormatedFeatures).forEach((serial) => {
      let paths = [
        notFormatedFeatures[serial].map((f) => {
          return [f.attributes[xMapFieldName], f.attributes[yMapFieldName]];
        }),
      ];

      features.push({
        attributes: notFormatedFeatures[serial][0].attributes,
        geometry: { paths: paths },
      });
    });
  } else if (editAndDeleteMapLayers[layerName].type == "point") {
    Object.keys(notFormatedFeatures).forEach((serial) => {
      let points = notFormatedFeatures[serial].map((f) => {
        return [f.attributes[xMapFieldName], f.attributes[yMapFieldName]];
      });

      features.push({
        attributes: notFormatedFeatures[serial][0].attributes,
        geometry: { x: points[0][0], y: points[0][1] },
      });
    });
  }

  let spatialReference = new esri.SpatialReference(map.spatialReference.wkid);

  features.forEach((f) => {
    if (editAndDeleteMapLayers[layerName].type == "polygon") {
      f.geometry = esri.geometry.Polygon(f.geometry, spatialReference);
    } else if (editAndDeleteMapLayers[layerName].type == "line") {
      f.geometry = esri.geometry.Polyline(f.geometry, spatialReference);
    } else if (editAndDeleteMapLayers[layerName].type == "point") {
      f.geometry = esri.geometry.Point(f.geometry, spatialReference);
    }

    f.geometry.spatialReference = spatialReference;
  });

  return features;
};
