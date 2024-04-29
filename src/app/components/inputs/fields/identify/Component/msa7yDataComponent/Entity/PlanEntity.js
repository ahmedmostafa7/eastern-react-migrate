import axios from "axios";
import { fetchData } from "../../../../../../../helpers/apiMethods";
import {
  HasArabicCharacters,
  IdentifyTask,
  addGraphicToLayer,
  addParcelNo,
  calculateSchemanticProportions,
  checkOverlappingFeaturesWithLayer,
  checkUploadedLayersFullyContainedByBoundry,
  computeLineAngle,
  computePointDirection,
  computeStreetAngle,
  convertToArabic,
  getColorFromCadIndex,
  getFieldDomain,
  getInfo,
  getLayer,
  getLengthDirectionByCentroid,
  getLengthOffset,
  getLineLength,
  getPolygons,
  getUsingSymbol,
  intersectQueryTask,
  isPointOrArc,
  loadCurrentPlan,
  project,
  queryTask,
  queryTask_updated,
  resizeMap,
  reverse,
  zoomToLayer,
} from "../../common/common_func";
import { LoadModules } from "../../common/esri_loader";
import { esriRequest } from "../../common/esri_request";
import { geometryServiceUrl, mapUrl } from "../../mapviewer/config/map";
import { isEmpty } from "lodash";

Array.prototype.sum = (prop) => {
  if (!this) return;
  var total = 0;
  for (var y = 0, _len = this.length; y < _len; y++) {
    prop = prop.replace(/\[(\w+)\]/g, ".$1");
    prop = prop.replace(/^\./, "");
    var a = prop.split(".");
    var data = JSON.parse(JSON.stringify(this[y]));

    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in data) {
        data = data[k];
      } else {
        return 0;
      }
    }

    total += data;
  }
  return total;
};

export class PlanEntity {
  constructor(props, plan) {
    const {
      mainObject: { currentStepId },
      currentModule: {
        record: { CurrentStep },
      },
    } = props;
    let _props = props;
    if (plan?.selectedCAD == "firstCAD" || plan?.selectedCAD == "perfectCad")
      this.selectedCAD = "perfectCad";
    else if (
      plan?.selectedCAD == "secondCAD" ||
      plan?.selectedCAD == "secondCad"
    )
      this.selectedCAD = "secondCad";
    else if (plan?.selectedCAD == "thirdCAD" || plan?.selectedCAD == "thirdCad")
      this.selectedCAD = "thirdCad";
    this.selectedCADIndex = this?.selectedCAD
      ? this?.selectedCAD == "perfectCad"
        ? 0
        : this?.selectedCAD == "secondCad"
        ? 1
        : 2
      : -1;
    this.layers =
      (plan?.layers?.length && plan.layers) ||
      _props.values?.mapviewer?.mapGraphics ||
      [];
    this.pageSize = _props?.pageSize || 15;
    this.isInvestalIncluded = plan?.isInvestalIncluded || false;
    this.statisticsParcels = plan?.statisticsParcels || [];
    this.enableDownlaodCad = plan?.enableDownlaodCad || false;
    this.planDescription = plan?.planDescription || "";
    this.streets = plan?.streets || [];
    this.detailsParcelTypes = plan?.detailsParcelTypes || [];
    this.uplodedFeatures = plan?.uplodedFeatures || [];
    this.streetsAnnotation = plan?.streetsAnnotation || [];
    this.serviceSubType = plan?.serviceSubType || {};
    this.serviceType = plan?.serviceType || {};
    this.planUsingSymbol = plan?.planUsingSymbol || "";
    this.hide_details =
      plan?.hide_details || (this.statisticsParcels.length > 0 ? false : true);
    this.servicesTypes = plan?.servicesTypes || [];
    this.servicesSubTypes = plan?.servicesSubTypes || [];
    this.TotalParcelArea = plan?.TotalParcelArea || 0;
    this.current_step = (CurrentStep && CurrentStep.id) || currentStepId;
    //this.totalParcelPage = plan?.totalParcelPage || 0;
    //this.totalInvestalParcelPage = plan?.totalInvestalParcelPage || 0;
    //this.totalStreetPage = plan?.totalStreetPage || 0;
    this.minParcelIndex = plan?.minParcelIndex || 0;
    this.maxParcelIndex = plan?.maxParcelIndex || 1 * this.pageSize;
    this.minInvestalParcelIndex = plan?.minInvestalParcelIndex || 0;
    this.maxInvestalParcelIndex =
      plan?.maxInvestalParcelIndex || 1 * this.pageSize;

    this.minStreetIndex = plan?.minStreetIndex || 0;
    this.maxStreetIndex = plan?.maxStreetIndex || 1 * this.pageSize;
    this.bufferDistance = plan?.bufferDistance || 5;

    this.totalParcelPage =
      plan?.uplodedFeatures?.[
        plan?.selectedCADIndex || 0
      ]?.shapeFeatures?.landbase?.filter((parcel) => parcel.is_cut != 2)
        ?.length / this.pageSize || 0;
    this.totalInvestalParcelPage =
      plan?.uplodedFeatures?.[
        plan?.selectedCADIndex || 0
      ]?.shapeFeatures?.landbase?.filter((parcel) => parcel.is_cut == 2)
        ?.length / this.pageSize || 0;
    this.totalStreetPage =
      (plan?.streets && plan?.streets.length / this.pageSize) || 0;

    this.servicesLayer = _.filter(
      window?.mapInfo?.info?.$layers?.layers || [],
      (d) => {
        return d.name == "Serivces_Data" || d.name == "Service_Data";
      }
    )[0];

    if (
      !plan?.buildingCondition?.length &&
      !_props?.mainObject?.buildingCondition?.length
    ) {
      this.setBuildingCondition(_props).then((response) => {
        
        this.buildingCondition = response;
      });
    } else {
      this.buildingCondition =
        plan?.buildingCondition || _props?.mainObject?.buildingCondition;
    }

    this.tempParcels = plan?.uplodedFeatures?.[
      plan?.selectedCADIndex || 0
    ]?.shapeFeatures.landbase.filter(function (land) {
      return (
        land.typeName != "شوارع" &&
        land.typeName != "مواقف" &&
        land.typeName != "ممرات مشاة"
      );
    });
  }
  servicesLayer = {};
  pageSize = 15;
  domains = [];
  zoomRatio = 50;
  autoCadColor = [
    [255, 0, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 255, 255],
    [0, 0, 255],
    [255, 0, 255],
    [255, 255, 255],
    [128, 128, 128],
    [192, 192, 192],
    [255, 0, 0],
    [255, 127, 127],
    [204, 0, 0],
    [204, 102, 102],
    [153, 0, 0],
    [153, 76, 76],
    [127, 0, 0],
    [127, 63, 63],
    [76, 0, 0],
    [76, 38, 38],
    [255, 63, 0],
    [255, 159, 127],
    [204, 51, 0],
    [204, 127, 102],
    [153, 38, 0],
    [153, 95, 76],
    [127, 31, 0],
    [127, 79, 63],
    [76, 19, 0],
    [76, 47, 38],
    [255, 127, 0],
    [255, 191, 127],
    [204, 102, 0],
    [204, 153, 102],
    [153, 76, 0],
    [153, 114, 76],
    [127, 63, 0],
    [127, 95, 63],
    [76, 38, 0],
    [76, 57, 38],
    [255, 191, 0],
    [255, 223, 127],
    [204, 153, 0],
    [204, 178, 102],
    [153, 114, 0],
    [153, 133, 76],
    [127, 95, 0],
    [127, 111, 63],
    [76, 57, 0],
    [76, 66, 38],
    [255, 255, 0],
    [255, 255, 127],
    [204, 204, 0],
    [204, 204, 102],
    [153, 153, 0],
    [153, 153, 76],
    [127, 127, 0],
    [127, 127, 63],
    [76, 76, 0],
    [76, 76, 38],
    [191, 255, 0],
    [223, 255, 127],
    [153, 204, 0],
    [178, 204, 102],
    [114, 153, 0],
    [133, 153, 76],
    [95, 127, 0],
    [111, 127, 63],
    [57, 76, 0],
    [66, 76, 38],
    [127, 255, 0],
    [191, 255, 127],
    [102, 204, 0],
    [153, 204, 102],
    [76, 153, 0],
    [114, 153, 76],
    [63, 127, 0],
    [95, 127, 63],
    [38, 76, 0],
    [57, 76, 38],
    [63, 255, 0],
    [159, 255, 127],
    [51, 204, 0],
    [127, 204, 102],
    [38, 153, 0],
    [95, 153, 76],
    [31, 127, 0],
    [79, 127, 63],
    [19, 76, 0],
    [47, 76, 38],
    [0, 255, 0],
    [127, 255, 127],
    [0, 204, 0],
    [102, 204, 102],
    [0, 153, 0],
    [76, 153, 76],
    [0, 127, 0],
    [63, 127, 63],
    [0, 76, 0],
    [38, 76, 38],
    [0, 255, 63],
    [127, 255, 159],
    [0, 204, 51],
    [102, 204, 127],
    [0, 153, 38],
    [76, 153, 95],
    [0, 127, 31],
    [63, 127, 79],
    [0, 76, 19],
    [38, 76, 47],
    [0, 255, 127],
    [127, 255, 191],
    [0, 204, 102],
    [102, 204, 153],
    [0, 153, 76],
    [76, 153, 114],
    [0, 127, 63],
    [63, 127, 95],
    [0, 76, 38],
    [38, 76, 57],
    [0, 255, 191],
    [127, 255, 223],
    [0, 204, 153],
    [102, 204, 178],
    [0, 153, 114],
    [76, 153, 133],
    [0, 127, 95],
    [63, 127, 111],
    [0, 76, 57],
    [38, 76, 66],
    [0, 255, 255],
    [127, 255, 255],
    [0, 204, 204],
    [102, 204, 204],
    [0, 153, 153],
    [76, 153, 153],
    [0, 127, 127],
    [63, 127, 127],
    [0, 76, 76],
    [38, 76, 76],
    [0, 191, 255],
    [127, 223, 255],
    [0, 153, 204],
    [102, 178, 204],
    [0, 114, 153],
    [76, 133, 153],
    [0, 95, 127],
    [63, 111, 127],
    [0, 57, 76],
    [38, 66, 76],
    [0, 127, 255],
    [127, 191, 255],
    [0, 102, 204],
    [102, 153, 204],
    [0, 76, 153],
    [76, 114, 153],
    [0, 63, 127],
    [63, 95, 127],
    [0, 38, 76],
    [38, 57, 76],
    [0, 63, 255],
    [127, 159, 255],
    [0, 51, 204],
    [102, 127, 204],
    [0, 38, 153],
    [76, 95, 153],
    [0, 31, 127],
    [63, 79, 127],
    [0, 19, 76],
    [38, 47, 76],
    [0, 0, 255],
    [127, 127, 255],
    [0, 0, 204],
    [102, 102, 204],
    [0, 0, 153],
    [76, 76, 153],
    [0, 0, 127],
    [63, 63, 127],
    [0, 0, 76],
    [38, 38, 76],
    [63, 0, 255],
    [159, 127, 255],
    [51, 0, 204],
    [127, 102, 204],
    [38, 0, 153],
    [95, 76, 153],
    [31, 0, 127],
    [79, 63, 127],
    [19, 0, 76],
    [47, 38, 76],
    [127, 0, 255],
    [191, 127, 255],
    [102, 0, 204],
    [153, 102, 204],
    [76, 0, 153],
    [114, 76, 153],
    [63, 0, 127],
    [95, 63, 127],
    [38, 0, 76],
    [57, 38, 76],
    [191, 0, 255],
    [223, 127, 255],
    [153, 0, 204],
    [178, 102, 204],
    [114, 0, 153],
    [133, 76, 153],
    [95, 0, 127],
    [111, 63, 127],
    [57, 0, 76],
    [66, 38, 76],
    [255, 0, 255],
    [255, 127, 255],
    [204, 0, 204],
    [204, 102, 204],
    [153, 0, 153],
    [153, 76, 153],
    [127, 0, 127],
    [127, 63, 127],
    [76, 0, 76],
    [76, 38, 76],
    [255, 0, 191],
    [255, 127, 223],
    [204, 0, 153],
    [204, 102, 178],
    [153, 0, 114],
    [153, 76, 133],
    [127, 0, 95],
    [127, 63, 111],
    [76, 0, 57],
    [76, 38, 66],
    [255, 0, 127],
    [255, 127, 191],
    [204, 0, 102],
    [204, 102, 153],
    [153, 0, 76],
    [153, 76, 114],
    [127, 0, 63],
    [127, 63, 95],
    [76, 0, 38],
    [76, 38, 57],
    [255, 0, 63],
    [255, 127, 159],
    [204, 0, 51],
    [204, 102, 127],
    [153, 0, 38],
    [153, 76, 95],
    [127, 0, 31],
    [127, 63, 79],
    [76, 0, 19],
    [76, 38, 47],
    [51, 51, 51],
    [91, 91, 91],
    [132, 132, 132],
    [173, 173, 173],
    [214, 214, 214],
    [255, 255, 255],
  ];
  isInvestalIncluded = false;
  statisticsParcels = [];
  enableDownlaodCad = false;
  planDescription = "";
  streets = [];
  detailsParcelTypes = [];
  uplodedFeatures = [];
  streetsAnnotation = [];
  serviceSubType = {};
  serviceType = {};
  selectedCAD = "";
  selectedCADIndex = 0;
  planUsingSymbol = "";
  hide_details = true;
  servicesTypes = [];
  servicesSubTypes = [];
  TotalParcelArea = 0;
  current_step = 0;
  totalParcelPage = 0;
  totalInvestalParcelPage = 0;
  minParcelIndex = 0;
  maxParcelIndex = 0;
  minInvestalParcelIndex = 0;
  maxInvestalParcelIndex = 0;
  totalStreetPage = 0;
  minStreetIndex = 0;
  maxStreetIndex = 0;
  bufferDistance = 5;
  isWithIn = false;
  hideAll = false;
  plans = [];
  markall = { isVisibile: true };
  currentStreetPage = 1;
  currentParcelPage = 1;
  currentInvestalParcelPage = 1;
  buildingCondition = [];
  layers = [];
  tempParcels = [];
  #fields = {
    survayParcelCutter: {
      field: "list",
      hideLabel: true,
      init_data: (values, props) => {
        if (!props.input.value) {
          props.input.onChange([
            {
              direction: "الشطفة",
              NORTH_EAST_DIRECTION: "",
              NORTH_WEST_DIRECTION: "",
              SOUTH_EAST_DIRECTION: "",
              SOUTH_WEST_DIRECTION: "",
            },
          ]);
        }
      },
      fields: {
        direction: { head: "الإتجاه" },
        NORTH_EAST_DIRECTION: {
          head: "شمال / شرق",
          type: "input",
          placeholder: "شمال / شرق",
          field: "text",
          hideLabel: true,
        },
        NORTH_WEST_DIRECTION: {
          head: "شمال / غرب",
          type: "input",
          placeholder: "شمال / غرب",
          field: "text",
          hideLabel: true,
        },
        SOUTH_EAST_DIRECTION: {
          head: "جنوب / شرق",
          type: "input",
          placeholder: "جنوب / شرق",
          field: "text",
          hideLabel: true,
        },
        SOUTH_WEST_DIRECTION: {
          head: "جنوب / غرب",
          type: "input",
          placeholder: "جنوب / غرب",
          field: "text",
          hideLabel: true,
        },
      },
    },
  };
  #editFields = {
    survayParcelCutter: {
      field: "list",
      hideLabel: true,
      fields: {
        direction: { head: "الإتجاه" },
        NORTH_EAST_DIRECTION: {
          head: "شمال / شرق",
        },
        NORTH_WEST_DIRECTION: {
          head: "شمال / غرب",
        },
        SOUTH_EAST_DIRECTION: {
          head: "جنوب / شرق",
        },
        SOUTH_WEST_DIRECTION: {
          head: "جنوب / غرب",
        },
      },
    },
  };

  checkStreetDomains = () => {
    return new Promise((resolve, reject) => {
      getInfo(mapUrl).then((response) => {
        let StreetNamingLayerId = response["Street_Naming"];
        getFieldDomain("", StreetNamingLayerId).then((domains) => {
          resolve(domains);
        });
      });
    });
  };

  checkServicesTypes = () => {
    return new Promise((resolve, reject) => {
      axios.get(`${host}/CadLayers/GetAll?pageSize=1000`).then(({ data }) => {
        data.results.forEach((type) => {
          type.layer_color = eval(type.layer_color);
        });
        resolve(data.results);
      });
    });
  };
  isValidCondition = (props, parcel) => {
    const { mainObject } = props;
    if (parcel.usingSymbol) {
      var condition = _.find(this.buildingCondition || [], (d) => {
        return d.attributes.USING_SYMBOL_CODE == parcel.usingSymbol;
      });
      if (condition && condition.attributes && condition.attributes.SLIDE_AREA)
        return condition.attributes.SLIDE_AREA <= parcel.area;
      else return true;
    } else return true;
  };

  setBuildingCondition = (props) => {
    return new Promise((resolve, reject) => {
      try {
        let { mainObject } = props;
        var usingSymbolObj;
        if (this.uplodedFeatures) {
          usingSymbolObj = _(
            this?.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures.landbase
          )
            .groupBy("usingSymbol")
            .value();
        }
        var maxCount = 0;
        if (!isEmpty(usingSymbolObj)) {
          Object.keys(usingSymbolObj)
            .filter((d) => {
              return d && d != "undefined";
            })
            .forEach((ele, key) => {
              if (
                ele.startsWith("س") ||
                ele.startsWith("(س") ||
                ele.startsWith("ص") ||
                ele.startsWith("ت") ||
                ele.startsWith("ز") ||
                ele.startsWith("خ") ||
                ele.startsWith("م-") ||
                ele.startsWith("ت-ج")
              ) {
                if (usingSymbolObj[ele].length > maxCount) {
                  maxCount = usingSymbolObj[ele].length;

                  // if (ele == "ت-3") {
                  //   ele = "م-ت ع";
                  // }

                  mainObject.selectedMaxUsingSymbolCode = ele;
                  mainObject.selectedMaxUsingSymbol =
                    "منطقة " +
                    mainObject.submission_data.mostafed_data.mostafed_type +
                    (ele.indexOf("س") > -1 ? "ة" : "") +
                    " " +
                    ele;
                }
              }
            });
          mainObject.MaxUsingSymbolDescription =
            "يُسمح بالأستعمالات ال" +
            mainObject.submission_data.mostafed_data.mostafed_type +
            "ة" +
            "وأستعمالاتها التبعية فى المنطقة ال" +
            mainObject.submission_data.mostafed_data.mostafed_type +
            "ة" +
            " " +
            mainObject.selectedMaxUsingSymbol;

          esriRequest(window.planMapEditing + "MapServer/layers").then(
            (maplayers) => {
              
              if (window.planMapEditing) {
                var layer = _.find(maplayers.tables, (d) => {
                  return d.name == "Tbl_Parcel_Conditions";
                });
                if (layer && layer.id) {
                  queryTask_updated(
                    window.planMapEditing + "MapServer/" + layer.id,
                    "USING_SYMBOL_CODE='" +
                      mainObject.selectedMaxUsingSymbolCode +
                      "'",
                    ["*"],
                    (result) => {
                      
                      resolve(result.features);
                    }
                  );
                }
              }
            }
          );
        }
      } catch (error) {
        console.error(error);
        return reject();
      }
    });
  };

  init_plan = (props, planVal, map, callback) => {
    const {
      currentModule: { record },
    } = props;
    setTimeout(() => {
      if (
        this.uplodedFeatures?.[planVal]?.shapeFeatures?.landbase &&
        checkUploadedLayersFullyContainedByBoundry(
          this.uplodedFeatures[planVal],
          props.mainObject.submission_data.mostafed_data.e3adt_tanzem,
          record?.request_no
        )
      ) {
        this.drawFeatures(props, map, callback);
        
        loadCurrentPlan(props, map, window.loadedLayers, true);
      } else {
        this.isInvestalIncluded = false;
        this.statisticsParcels = [];
        this.enableDownlaodCad = false;
        this.planDescription = "";
        this.streets = [];
        this.detailsParcelTypes = [];
        this.uplodedFeatures = [];
        this.streetsAnnotation = [];
        this.serviceSubType = {};
        this.serviceType = {};
        this.selectedCAD = "";
        this.selectedCADIndex = 0;
        this.planUsingSymbol = "";
        this.hide_details = true;
        this.servicesTypes = [];
        this.servicesSubTypes = [];
        this.TotalParcelArea = 0;
        this.current_step = 0;
        this.totalParcelPage = 0;
        this.totalInvestalParcelPage = 0;
        this.minParcelIndex = 0;
        this.maxParcelIndex = 0;
        this.minInvestalParcelIndex = 0;
        this.maxInvestalParcelIndex = 0;
        this.totalStreetPage = 0;
        this.minStreetIndex = 0;
        this.maxStreetIndex = 0;
      }

      if (callback) {
        callback();
      }
    }, 500);
  };

  drawBuffer = (bufferDistance, map, callback) => {
    if (map.getLayer("BufferGraphicLayer"))
      map.getLayer("BufferGraphicLayer").clear();

    if (bufferDistance > 0) {
      LoadModules([
        "esri/tasks/GeometryService",
        "esri/tasks/BufferParameters",
        "esri/geometry/Polygon",
        "esri/geometry/Circle",
      ]).then(([GeometryService, BufferParameters, Polygon, Circle]) => {
        if (!this.serviceSubType) {
          _.filter(
            this.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures
              ?.landbase,
            (d) => {
              return d?.typeId == this.serviceType?.symbol_id;
            }
          ).forEach((feature) => {
            if (!feature.spatialReference.wkid) {
              feature.spatialReference = map.spatialReference;
            }
            feature = new Polygon(feature);

            var circleGeometry = new Circle({
              center: feature.getExtent().getCenter(),
              radius: +bufferDistance,
              radiusUnit: esri.Units.METERS,
            });

            addGraphicToLayer(
              circleGeometry,
              map,
              "BufferGraphicLayer",
              [0, 0, 255],
              null,
              false,
              (response) => {
                this.#addLayerFeature(map, "BufferGraphicLayer", response);
              },
              null,
              null,
              true,
              true,
              null,
              false
            );
          });
        } else {
          _.filter(
            this.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures
              ?.landbase,
            (d) => {
              return d.useDetails == this.serviceSubType?.symbol_id;
            }
          ).forEach((feature) => {
            if (!feature.spatialReference.wkid) {
              feature.spatialReference = map.spatialReference;
            }
            feature = new Polygon(feature);

            var circleGeometry = new Circle({
              center: feature.getExtent().getCenter(),
              radius: +bufferDistance,
              radiusUnit: esri.Units.METERS,
            });

            addGraphicToLayer(
              circleGeometry,
              map,
              "BufferGraphicLayer",
              [0, 0, 255],
              null,
              false,
              (response) => {
                this.#addLayerFeature(map, "BufferGraphicLayer", response);
              },
              null,
              null,
              true,
              true,
              null,
              false
            );
          });
        }

        var gsvc = GeometryService(geometryServiceUrl);
        var params = new BufferParameters();

        var boundry = new Polygon(
          this.uplodedFeatures[
            this.selectedCADIndex
          ]?.shapeFeatures?.boundry?.[0]
        );

        params.geometries = [dojo.clone(boundry)];
        params.distances = [+bufferDistance];
        params.unit = GeometryService.UNIT_METER;
        params.outSpatialReference = map.spatialReference;

        gsvc.buffer(params, (geometries) => {
          var where = "SRVC_TYPE =" + this.serviceType?.layer_code;

          if (this.serviceSubType && this.serviceSubType?.sublayer_code)
            where = "SRVC_SUBTYPE =" + this.serviceSubType?.sublayer_code;

          queryTask({
            url: planMapEditing + "MapServer/" + this.servicesLayer?.id,
            where: where,
            outFields: ["OBJECTID"],
            callbackResult: (res) => {
              res.features.forEach((feature) => {
                var f = new esri.geometry.Point(feature?.geometry);

                if (!boundry.contains(f)) {
                  var circleGeometry = new Circle({
                    center: f,
                    radius: +bufferDistance,
                    radiusUnit: esri.Units.METERS,
                  });

                  addGraphicToLayer(
                    circleGeometry,
                    map,
                    "BufferGraphicLayer",
                    [0, 0, 255],
                    null,
                    false,
                    (response) => {
                      this.#addLayerFeature(
                        map,
                        "BufferGraphicLayer",
                        response
                      );
                    },
                    null,
                    null,
                    true,
                    true,
                    null,
                    false
                  );
                }
              });
            },
            callbackError: () => {
              // store.dispatch({ type: "Show_Loading_new", loading: false });
              if (callback) {
                callback();
              }
            },
            preQuery: (query, Query) => {
              query.geometry = dojo.clone(geometries[0]);
            },
            returnGeometry: true,
          });
        });
      });
    }
  };

  compareTwoFeatures = (feature1, feature2) => {
    var same = true;
    if (feature1.rings[0].length == feature2.rings[0].length) {
      for (var j = 0, n = feature1.rings[0].length - 1; j < n; j++) {
        if (feature1.rings[0][j] != feature2.rings[0][j]) {
          same = false;
          break;
        }
      }

      return same;
    } else {
      return false;
    }
  };

  computeLineAngle = (pointA, pointB, cetroid, polygon) => {
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

  checkCADAreas = (props) => {
    let valid = true;
    const {
      currentModule: { record },
    } = props;

    let msa7yArea = +_.chain(
      props.mainObject.data_msa7y.msa7yData.cadDetails.suggestionsParcels
    )
      .reduce((a, b) => {
        return a + +b.area;
      }, 0)
      .value()
      .toFixed(2);
    let landbasesArea = +_.chain(
      this?.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures.landbase
    )
      .reduce((a, b) => {
        return a + +b.area;
      }, 0)
      .value()
      .toFixed(2);
    
    if (
      !props.mainObject.submission_data.mostafed_data.e3adt_tanzem &&
      !record.request_no &&
      msa7yArea != landbasesArea &&
      (!window.Supporting ||
        (window.Supporting && !window.Supporting.areaDifference))
    ) {
      window.notifySystem(
        "error",
        "boundry لا يساوي اجمالي مساحة المخطط landbase اجمالي مساحات الرسم داخل طبقة",
        10
      );
      window.notifySystem(
        "error",

        convertToArabic(msa7yArea) + " م2 " + ":boundry اجمالي مساحة طبقة",
        10
      );
      window.notifySystem(
        "error",

        convertToArabic(landbasesArea) +
          " م2 " +
          " :landbase اجمالي مساحة طبقة",
        10
      );
      valid = false;
    }

    return valid;
  };

  clearMapLayers = (map) => {
    if (map?.graphicsLayerIds) {
      map.graphicsLayerIds.forEach((layerID) => {
        if (map.getLayer(layerID)) map.getLayer(layerID).clear();
      });
    }
  };

  drawfeaturesAnnotations(
    props,
    map,
    cadLayer,
    annotationLayerName,
    layerCallback,
    annotationCallback,
    finalCallback,
    boundryColor
  ) {
    const { mainObject } = props;
    const {
      mainObject: { currentStepId },
      currentModule: {
        record: { CurrentStep },
      },
    } = props;
    if (cadLayer[annotationLayerName]?.length) {
      cadLayer[annotationLayerName]?.forEach((cadfeature) => {
        if (cadfeature.spatialReference && !cadfeature.spatialReference.wkid) {
          cadfeature.spatialReference = map.spatialReference;
        }

        var feature = new esri.geometry.Polygon(cadfeature);

        _.filter(
          this.uplodedFeatures?.[this.selectedCADIndex]?.annotations,
          (d) => {
            return d.layer == annotationLayerName;
          }
        ).forEach((annotation) => {
          let isContained = false;
          if (
            annotation?.shape?.spatialReference &&
            !annotation?.shape?.spatialReference?.wkid
          ) {
            annotation.shape.spatialReference = map?.spatialReference;
          }
          if (feature.contains && feature.contains(annotation.shape)) {
            cadfeature.text = annotation.text;
            isContained = true;
          }

          if (annotationCallback) {
            annotationCallback(cadfeature, annotation, isContained);
          }
        });

        var found = [];

        if (mainObject?.data_msa7y && annotationLayerName == "boundry") {
          found = _.filter(feature.rings[0], (ring) => {
            return _.find(
              mainObject.data_msa7y.msa7yData.cadDetails.temp.cadResults.data[0]
                .shapeFeatures[0].rings[0],
              (ring2) => {
                return ring2[0] == ring[0] && ring2[1] == ring[1];
              }
            );
          });

          if (
            found.length !=
              mainObject.data_msa7y.msa7yData.cadDetails.temp.cadResults.data[0]
                .shapeFeatures[0].rings[0].length &&
            CurrentStep == 2317
          ) {
            this.isWithIn = false;
            window.notifySystem("error", t("PLANOOUTSIDETHEBOUDRY"));
          } else {
            this.isWithIn = true;
            addGraphicToLayer(
              feature,
              map,
              "detailedGraphicLayer",
              boundryColor || [0, 0, 0],
              null,
              null,
              (response) => {
                this.#addLayerFeature(map, "detailedGraphicLayer", response);
                resizeMap(map);
              },
              null,
              null,
              true,
              null,
              null,
              false
            );
          }
        } else {
          addGraphicToLayer(
            feature,
            map,
            "detailedGraphicLayer",
            [0, 0, 0],
            null,
            null,
            (response) => {
              this.#addLayerFeature(map, "detailedGraphicLayer", response);
              resizeMap(map);
            },
            null,
            null,
            true,
            null,
            null,
            false
          );
        }

        if (annotationLayerName == "boundry") {
          cadfeature.area -=
            +mainObject?.data_msa7y?.msa7yData?.cadDetails?.cuttes_area?.toFixed(
              2
            ) || 0;
        } else if (annotationLayerName == "landbase") {
          this.TotalParcelArea += cadfeature.area;
        }

        if (layerCallback) {
          layerCallback(map, cadfeature);
        }
      });

      if (this.isWithIn) {
        if (finalCallback) {
          finalCallback();
        }
      }
    }
  }

  readAnnotationPoints = (map, layerName, pointColor) => {
    this.uplodedFeatures?.[this.selectedCADIndex]?.annotations.forEach(
      (annotation) => {
        annotation.shape = new esri.geometry.Point(annotation.shape);

        if (annotation.layer == layerName) {
          var txt = annotation.text;
          if (annotation.text) {
            txt = annotation.text;
          }

          var attr = {
            text: convertToArabic(txt),
            angle: -15,
          };

          addParcelNo(
            annotation.shape,
            map,
            convertToArabic(txt),
            "PacrelNoGraphicLayer",
            12,
            pointColor || [60, 60, 60],
            -15,
            { y: 0, x: 0 },
            attr,
            null,
            (response) => {
              this.#addLayerFeature(map, "PacrelNoGraphicLayer", response);
            },
            false
          );
        }
      }
    );
  };

  drawFeaturesLines = (map) => {
    if (
      this.uplodedFeatures?.[this.selectedCADIndex]?.lineFeatures.length > 0
    ) {
      this.uplodedFeatures?.[this.selectedCADIndex]?.lineFeatures.forEach(
        (detail) => {
          var polyline = new esri.geometry.Polyline(detail);
          addGraphicToLayer(
            polyline,
            map,
            "detailedGraphicLayer",
            detail.color ? this.autoCadColor[detail.color - 1] : [60, 60, 60],
            null,
            null,
            (response) => {
              this.#addLayerFeature(map, "detailedGraphicLayer", response);
              resizeMap(map);
            },
            null,
            null,
            null,
            null,
            null,
            false
          );
        }
      );
    } else {
      zoomToLayer("detailedGraphicLayer", map, this.zoomRatio);
    }
  };

  #getMaxTwoLinesLength = (streetsLines) => {
    var largestA = streetsLines[0];
    var largestB = streetsLines[1];

    for (var i = 0; i < streetsLines.length; i++) {
      if (streetsLines[i].text > largestA.text) {
        largestB = largestA;
        largestA = streetsLines[i];
      } else if (
        streetsLines[i].text > largestB.text &&
        streetsLines[i].paths[0][0][0] != largestA.paths[0][0][0]
      ) {
        largestB = streetsLines[i];
      }
    }

    return [largestA, largestB];
  };

  setSideCenterPoint = (map, landbase, sideName) => {
    landbase[`${sideName}_center_point`] = null;
    if (landbase[`${sideName}_points`].length >= 1) {
      var polyline = new esri.geometry.Polyline({
        paths: landbase[`${sideName}_points`],
        spatialReference: map.spatialReference,
      });
      landbase[`${sideName}_center_point`] = polyline.getExtent().getCenter();
    }
  };

  drawStreetsAnnotations = (map) => {
    this.streetsAnnotation = [];
    for (var j = 0; j < this.streetsAnnotation.length; j++) {
      var extractNmber = this.streetsAnnotation[j].text.match(/[\d\.]+/);

      if (extractNmber && extractNmber.length > 0) {
        extractNmber = extractNmber[0];
        this.streetsAnnotation[j].text = this.streetsAnnotation[j].text.replace(
          extractNmber,
          extractNmber
        );
      } else {
        extractNmber = this.streetsAnnotation[j].text;
      }

      if (!this.streetsAnnotation[j].feature.spatialReference.wkid) {
        this.streetsAnnotation[j].feature.spatialReference.wkid =
          map.spatialReference.wkid;
      }

      var attr = {
        text: this.streetsAnnotation[j].text,
        angle: 360 - this.streetsAnnotation[j].angle,
      };

      addParcelNo(
        this.streetsAnnotation[j].feature,
        map,
        this.streetsAnnotation[j].text,
        "PacrelNoGraphicLayer",
        12,
        [0, 0, 0],
        360 - this.streetsAnnotation[j].angle,
        { y: 0, x: 0 },
        attr,
        true,
        (response) => {
          this.#addLayerFeature(map, "PacrelNoGraphicLayer", response);
        },
        false
      );
    }
  };

  setPlanUsingSymbolDesc = () => {
    var maxCount = 0;
    var usingSymbolObj = _(
      this?.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures.landbase
    )
      .toArray()
      .groupBy("usingSymbol")
      .value();
    Object.keys(usingSymbolObj)
      .filter((d) => {
        return d && d != "undefined";
      })
      .forEach((ele, key) => {
        if (
          ele.startsWith("س") ||
          ele.startsWith("ص") ||
          ele.startsWith("ت") ||
          ele.startsWith("ز") ||
          ele.startsWith("خ") ||
          ele.startsWith("م-") ||
          ele.startsWith("ت-ج")
        ) {
          if (usingSymbolObj[ele].length > maxCount) {
            maxCount = usingSymbolObj[ele].length;
            this.planUsingSymbol = "رمز استعمال المخطط " + "( " + ele + " )";
          }
        }
      });
  };

  drawFeatures = (props, map, callback) => {
    if (!this.checkCADAreas(props)) {
      return;
    }
    this.clearMapLayers(map);
    this.isWithIn = false;

    var moacount = 0;

    this.bufferDistance = 0;

    this.drawfeaturesAnnotations(
      props,
      map,
      this?.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures,
      "boundry",
      null,
      null,
      () => {
        var legends = [];
        var isValidCad = true;
        var cadErrors = {};
        var color = [0, 255, 255];
        this.streetsAnnotation = [];
        let maxLines = 0;
        this.drawfeaturesAnnotations(
          props,
          map,
          this?.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures,
          "out_sak_boundry"
        );
        this.drawFeaturesLines(map);
        this.drawfeaturesAnnotations(
          props,
          map,
          this?.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures,
          "nearby_plans",
          null,
          null,
          () => {
            this.readAnnotationPoints(map, "nearby_plans", [60, 60, 60]);
          },
          [60, 60, 60]
        );

        this.drawfeaturesAnnotations(
          props,
          map,
          this?.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures,
          "subdivision",
          null,
          null,
          null,
          [0, 0, 255]
        );
        this.drawfeaturesAnnotations(
          props,
          map,
          this?.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures,
          "block",
          null,
          null,
          null,
          [0, 255, 0]
        );
        this.drawfeaturesAnnotations(
          props,
          map,
          this?.uplodedFeatures[this.selectedCADIndex]?.shapeFeatures,
          "landbase",
          (map, landbase) => {
            if (landbase.usingSymbol == "خ" && landbase.typeName == "حدائق") {
              landbase.number = landbase.number + "م ";
            } else if (landbase.usingSymbol == "خ") {
              landbase.number = landbase.number + "خ ";
            }

            landbase.north_points = [];
            landbase.south_points = [];
            landbase.weast_points = [];
            landbase.east_points = [];
            let feature = new esri.geometry.Polygon(landbase);
            var min = 0;
            var max = 0;
            for (var j = 0, n = landbase.rings[0].length - 1; j < n; j++) {
              // var info = this.computeLineAngle(
              //   landbase.rings[0][j],
              //   landbase.rings[0][j + 1],
              //   feature.getExtent().getCenter(),
              //   feature
              // );

              var point1 = new esri.geometry.Point(
                landbase.rings[0][j][0],
                landbase.rings[0][j][1]
              );
              var point2 = new esri.geometry.Point(
                landbase.rings[0][j + 1][0],
                landbase.rings[0][j + 1][1]
              );

              if (point1.x > max) {
                max = point1.x;
                landbase.maxPoint = point1;
              }

              if (!min || point1.x < min) {
                min = point1.x;
                landbase.minPoint = point1;
              }

              if (point2.x > max) {
                max = point2.x;
                landbase.maxPoint = point2;
              }

              if (!min || point2.x < min) {
                min = point2.x;
                landbase.minPoint = point2;
              }
              let info = computePointDirection(
                landbase,
                landbase.rings[0][j],
                landbase.rings[0][j + 1],
                landbase
              );

              
              if (info.direction == "north") {
                landbase.north_length =
                  (landbase.north_length || 0) + info.length;
                landbase.north_points.push([
                  landbase.rings[0][j],
                  landbase.rings[0][j + 1],
                ]);
              } else if (info.direction == "south") {
                landbase.south_length =
                  (landbase.south_length || 0) + info.length;
                landbase.south_points.push([
                  landbase.rings[0][j],
                  landbase.rings[0][j + 1],
                ]);
              } else if (info.direction == "east") {
                landbase.east_length =
                  (landbase.east_length || 0) + info.length;
                landbase.east_points.push([
                  landbase.rings[0][j],
                  landbase.rings[0][j + 1],
                ]);
              } else {
                landbase.weast_length =
                  (landbase.weast_length || 0) + info.length;
                landbase.weast_points.push([
                  landbase.rings[0][j],
                  landbase.rings[0][j + 1],
                ]);
              }
            }

            this.setSideCenterPoint(map, landbase, "weast");
            this.setSideCenterPoint(map, landbase, "north");
            this.setSideCenterPoint(map, landbase, "east");
            this.setSideCenterPoint(map, landbase, "south");

            landbase.is_north_front = true;
            landbase.is_south_front = true;
            landbase.is_east_front = true;
            landbase.is_weast_front = true;

            this.tempParcels.forEach((temp_landbase) => {
              if (!temp_landbase.spatialReference.wkid) {
                temp_landbase.spatialReference = this.map.spatialReference;
              }
              for (
                var j = 0, n = temp_landbase.rings[0].length - 1;
                j < n;
                j++
              ) {
                if (!this.compareTwoFeatures(landbase, temp_landbase)) {
                  var path = {
                    paths: [
                      [
                        temp_landbase.rings[0][j],
                        temp_landbase.rings[0][j + 1],
                      ],
                    ],
                    spatialReference: map.spatialReference,
                  };

                  var polyline = new esri.geometry.Polyline(path);
                  var pt = polyline.getExtent().getCenter();

                  if (
                    landbase.north_center_point != null &&
                    landbase.north_center_point.x == pt.x &&
                    landbase.north_center_point.y == pt.y
                  ) {
                    landbase.is_north_front = false;
                  }

                  if (
                    landbase.south_center_point != null &&
                    landbase.south_center_point.x == pt.x &&
                    landbase.south_center_point.y == pt.y
                  ) {
                    landbase.is_south_front = false;
                  }

                  if (
                    landbase.east_center_point != null &&
                    landbase.east_center_point.x == pt.x &&
                    landbase.east_center_point.y == pt.y
                  ) {
                    landbase.is_east_front = false;
                  }

                  if (
                    landbase.weast_center_point != null &&
                    landbase.weast_center_point.x == pt.x &&
                    landbase.weast_center_point.y == pt.y
                  ) {
                    landbase.is_weast_front = false;
                  }
                }
              }
            });

            if (!landbase.frontLength) {
              landbase.frontLength = 0;

              if (landbase.is_east_front) {
                landbase.frontLength = landbase.east_length;
              }
              if (landbase.is_north_front) {
                if (landbase.north_length > landbase.frontLength)
                  landbase.frontLength = landbase.north_length;
              }
              if (landbase.is_south_front) {
                if (landbase.south_length > landbase.frontLength)
                  landbase.frontLength = landbase.south_length;
              }
              if (landbase.is_weast_front) {
                if (landbase.weast_length > landbase.frontLength)
                  landbase.frontLength = landbase.weast_length;
              }

              landbase.frontLength = (+landbase?.frontLength)?.toFixed(2);
            }

            let textcolor = [255, 255, 255];

            if (
              landbase.usingSymbol &&
              landbase.usingSymbol.indexOf("س") > -1
            ) {
              textcolor = [0, 0, 0];
            }
            if (
              landbase.typeName == "مواقف" ||
              landbase.typeName == "ممرات مشاة"
            ) {
              textcolor = [0, 0, 0];
              color = [255, 255, 255];
            }

            if (landbase.subType && landbase.subType.sublayer_description) {
              var attr = {
                text: landbase.subType.sublayer_description,
                angle: -15,
              };

              addParcelNo(
                feature.getExtent().getCenter(),
                map,
                convertToArabic(landbase.subType.sublayer_description),
                "PacrelNoGraphicLayer",
                12,
                textcolor,
                -15,
                { y: -10, x: 0 },
                attr,
                null,
                (response) => {
                  this.#addLayerFeature(map, "PacrelNoGraphicLayer", response);
                },
                false
              );
            } else if (
              landbase.usingSymbol &&
              landbase.usingSymbol.indexOf("س") < 0 &&
              landbase.typeName &&
              landbase.typeName.indexOf("شوارع") < 0
            ) {
              if (
                landbase.typeName == "مواقف" ||
                landbase.typeName == "ممرات مشاة"
              ) {
                moacount++;

                ang =
                  360 -
                  computeStreetAngle(
                    maxLines[0].paths[0][0],
                    maxLines[0].paths[0][1],
                    feature.getExtent().getCenter()
                  );

                var attr = {
                  text:
                    landbase.typeName +
                    " " +
                    "م" +
                    " " +
                    (landbase.typeName != "ممرات مشاة" ? moacount : ""),
                  angle: ang,
                };

                addParcelNo(
                  feature.getExtent().getCenter(),
                  map,
                  convertToArabic(
                    landbase.typeName +
                      " " +
                      "م" +
                      " " +
                      (landbase.typeName != "ممرات مشاة" ? moacount : "")
                  ),
                  "PacrelNoGraphicLayer",
                  12,
                  textcolor,
                  ang,
                  { y: 0, x: 0 },
                  attr,
                  null,
                  (response) => {
                    this.#addLayerFeature(
                      map,
                      "PacrelNoGraphicLayer",
                      response
                    );
                  },
                  false
                );
              } else if (landbase.typeName == "مناطق مفتوحة") {
                var attr = {
                  text: landbase.typeName + " " + "م" + " " + moacount,
                  angle: -15,
                };

                addParcelNo(
                  feature.getExtent().getCenter(),
                  map,
                  convertToArabic(
                    landbase.typeName + " " + "م" + " " + moacount
                  ),
                  "PacrelNoGraphicLayer",
                  12,
                  textcolor,
                  -15,
                  { y: -10, x: 0 },
                  attr,
                  null,
                  (response) => {
                    this.#addLayerFeature(
                      map,
                      "PacrelNoGraphicLayer",
                      response
                    );
                  },
                  false
                );
              } else {
                var attr = {
                  text: landbase.typeName,
                  angle: -15,
                };

                addParcelNo(
                  feature.getExtent().getCenter(),
                  map,
                  convertToArabic(landbase.typeName),
                  "PacrelNoGraphicLayer",
                  12,
                  textcolor,
                  -15,
                  { y: -10, x: 0 },
                  attr,
                  null,
                  (response) => {
                    this.#addLayerFeature(
                      map,
                      "PacrelNoGraphicLayer",
                      response
                    );
                  },
                  false
                );
              }
            }
            if (landbase.number) {
              var ang = -15;
              if (landbase.typeName == "شوارع") {
                color = [255, 255, 255];
              } else {
                ang = -15;

                var attr = {
                  text: convertToArabic(landbase.number),
                  angle: -15,
                };

                addParcelNo(
                  feature.getExtent().getCenter(),
                  map,
                  convertToArabic(landbase.number),
                  "PacrelNoGraphicLayer",
                  12,
                  textcolor,
                  ang,
                  { y: 0, x: 0 },
                  attr,
                  null,
                  (response) => {
                    this.#addLayerFeature(
                      map,
                      "PacrelNoGraphicLayer",
                      response
                    );
                  },
                  false
                );
              }
            }

            if (landbase.typeId && getLayer("G" + landbase.typeId, map, 8)) {
              addGraphicToLayer(
                feature,
                map,
                "Layer_G" + landbase.typeId,
                null,
                color,
                null,
                (response) => {
                  this.#addLayerFeature(
                    map,
                    "Layer_G" + landbase.typeId,
                    response
                  );
                  resizeMap(map);
                },
                null,
                null,
                false,
                null,
                null,
                false
              );
            } else {
              addGraphicToLayer(
                feature,
                map,
                "detailedGraphicLayer",
                null,
                color,
                null,
                (response) => {
                  this.#addLayerFeature(map, "detailedGraphicLayer", response);
                  resizeMap(map);
                },
                null,
                null,
                false,
                null,
                null,
                false
              );
            }
          },
          (landbase, annotation, isContained) => {
            if (isContained) {
              var res = annotation.text.split("@");

              if (annotation.text.indexOf("@") < 0 && isNaN(annotation.text)) {
                this.streetsAnnotation.push({
                  feature: annotation.shape,
                  text: annotation.text,
                  angle: annotation.angle,
                });
                //break;
              } else {
                if (
                  res.length != 3 &&
                  res.length == 1 &&
                  (res[0] < 12 || res[0] > 29)
                ) {
                  cadErrors["parcels"] =
                    "يجب ان تحتوى الأراضي على رقم الأرض - الاستخدام التفصيلي - رمز الاستخدام";
                  isValidCad = false;
                  return;
                }

                landbase.north_length = 0;
                landbase.south_length = 0;
                landbase.weast_length = 0;
                landbase.east_length = 0;

                if (res.length == 1) {
                  landbase.usingSymbol = res[0].replace(/ /g, "");
                  landbase.useDetails = res[0].replace(/ /g, "");
                } else {
                  landbase.number = res[0];
                  landbase.useDetails = res[1];

                  if (res.length > 2) {
                    landbase.usingSymbol = res[2].replace(/ /g, "");

                    if (getUsingSymbol(res[2].replace(/ /g, "")))
                      landbase.usingSymbolName = getUsingSymbol(
                        res[2].replace(/ /g, "")
                      ).name;
                    else if (getUsingSymbol(res[2]))
                      landbase.usingSymbolName = getUsingSymbol(res[2]).name;
                    else {
                      res.reverse();

                      landbase.number = res[0];
                      landbase.useDetails = res[1];
                      landbase.usingSymbol = res[2].replace(/ /g, "");

                      if (getUsingSymbol(res[2].replace(/ /g, "")))
                        landbase.usingSymbolName = getUsingSymbol(
                          res[2].replace(/ /g, "")
                        ).name;
                      else if (getUsingSymbol(res[2]))
                        landbase.usingSymbolName = getUsingSymbol(res[2]).name;
                      else {
                        cadErrors["usingSymbol"] =
                          "رمز الاستخدام غير صحيح لأرض رقم " +
                          landbase.usingSymbol;
                        isValidCad = false;
                        return;
                      }
                    }
                  }
                }

                this.servicesTypes.forEach((type) => {
                  var subType = _.find(type.cad_sublayers, (d) => {
                    return d.symbol_id == landbase.useDetails;
                  });

                  if (subType) {
                    var f = legends.find((x) => {
                      return x.id == type.id;
                    });
                    if (!f) legends.push(type);

                    landbase.subType = subType;
                    color = type.layer_color;

                    if (!color) color = [0, 255, 255];

                    landbase.typeName = type.layer_description;
                    landbase.typeId = type.symbol_id;
                    landbase.is_cut = type.is_cut;
                    landbase.is_notfees = type.is_notfees;
                  }
                });

                if (!landbase.subType) {
                  var type = _.find(this.servicesTypes, (d) => {
                    return d.symbol_id == landbase.useDetails;
                  });

                  if (type) {
                    var f = legends.find((x) => {
                      return x.id == type.id;
                    });
                    if (!f) legends.push(type);
                    landbase.is_cut = type.is_cut;
                    landbase.is_notfees = type.is_notfees;
                    landbase.typeName = type.layer_description;
                    landbase.typeId = type.symbol_id;
                    color = type.layer_color;
                    if (!color) color = [0, 255, 255];
                  } else {
                    if (landbase.typeId != 23 && res.length != 1) {
                      cadErrors["useDetails"] =
                        "الاستخدام التفصيلي غير صحيح لأرض رقم " +
                        landbase.number;
                      isValidCad = false;
                      return;
                    }
                  }
                }
              }
            }

            if (
              landbase.typeName == "شوارع" ||
              landbase.typeName == "مواقف" ||
              landbase.typeName == "ممرات مشاة"
            ) {
              var streetLines = [];
              landbase.isHide = true;
              var min = 0;
              var max = 0;
              for (var j = 0, n = landbase.rings[0].length - 1; j < n; j++) {
                var point1 = new esri.geometry.Point(
                  landbase.rings[0][j][0],
                  landbase.rings[0][j][1]
                );
                var point2 = new esri.geometry.Point(
                  landbase.rings[0][j + 1][0],
                  landbase.rings[0][j + 1][1]
                );

                var length = esri.geometry.getLength(point1, point2);
                length = Number(parseFloat(length)?.toFixed(2));
                var path = {
                  paths: [[landbase.rings[0][j], landbase.rings[0][j + 1]]],
                  text: length,
                  spatialReference: landbase.spatialReference,
                };

                streetLines.push(path);
              }

              maxLines = this.#getMaxTwoLinesLength(streetLines);
              var polyline1 = new esri.geometry.Polyline(maxLines[0]);
              var polyline2 = new esri.geometry.Polyline(maxLines[1]);
              var ptLine1 = polyline1.getExtent().getCenter();
              var ptLine2 = polyline2.getExtent().getCenter();

              landbase.length = maxLines[0].text;
              landbase.width = +esri.geometry
                .getLength(ptLine1, ptLine2)
                .toPrecision(2);
              if (landbase.typeName == "شوارع")
                landbase.number = " م" + landbase.width + " ضرع عراش";
            }
          },
          null,
          [0, 255, 0]
        );

        this.drawStreetsAnnotations(map);
        this.setPlanUsingSymbolDesc();
        //
        if (
          !isValidCad &&
          !props.mainObject.submission_data.mostafed_data.e3adt_tanzem
        ) {
          this.hideAll = true;
          this.hide_details = true;
          Object.keys(cadErrors).forEach((f) => {
            window.notifySystem("error", cadErrors[f], 10);
          });

          this.uplodedFeatures[this.selectedCADIndex] = null;
          props.change(
            `plansData.image_uploader${this.selectedCADIndex + 1}`,
            ""
          );
          this.plans = [];
          for (var i = 0; i < this.uplodedFeatures?.length; i++) {
            if (this.uplodedFeatures[i]) {
              this.selectedCADIndex = i;
              var currentPlan =
                i == 0 ? "perfectCad" : i == 1 ? "secondCad" : "thirdCad";
              this.selectedCAD = currentPlan;
              this.plans.push(currentPlan);
            } else {
              break;
            }
          }

          this.checkStreetDomains().then((domains) => {
            this.domains = domains;
            this.checkServicesTypes().then((serviceTypes) => {
              this.servicesTypes = serviceTypes;
              this.init_plan(props, this.selectedCADIndex, callback);
            });
          });
        } else {
          this.hideAll = false;
          this.hide_details = false;
        }

        this.servicesTypes = legends;
        this.servicesTypes.unshift({
          cad_sublayers: null,
          id: "markall",
          is_cut: 1,
          layer_code: 210,
          layer_color: "",
          layer_description: "تحديد الكل",
          sort_id: 1000,
          symbol_id: "markall",
        });

        this.streets =
          (this.streets?.length && this?.streets) ||
          this?.uplodedFeatures[
            this.selectedCADIndex
          ]?.shapeFeatures.landbase.filter((d) => {
            return d.typeName == "شوارع";
          });

        this.statisticsParcels = this.updateStatisticParcels(props);
        this.totalParcelPage =
          this.uplodedFeatures?.[this.selectedCADIndex]?.shapeFeatures?.landbase
            ?.length || 0 / this.pageSize;

        this.totalInvestalParcelPage =
          this.uplodedFeatures?.[
            this.selectedCADIndex
          ]?.shapeFeatures?.landbase?.filter((parcel) => parcel.is_cut == 2)
            ?.length || 0 / this.pageSize;

        this.totalStreetPage = this.streets?.length || 0 / this.pageSize;

        this.enableDownlaodCad = this.uplodedFeatures?.[this.selectedCADIndex]
          ?.cad_path
          ? true
          : false;
      }
    );
  };

  updateStatisticParcels = (props) => {
    //statistics استعمالات
    let statisticsParcels = [];
    var pacrelTypes = _.chain(
      this.uplodedFeatures?.[this.selectedCADIndex]?.shapeFeatures?.landbase
    )
      ?.sortBy((d) => {
        var found = _.find(this.servicesTypes, (v) => {
          return v.symbol_id == d.typeId;
        });
        return found && found.sort_id ? found.sort_id : 100;
      })
      ?.groupBy("typeName");

    this.detailsParcelTypes = pacrelTypes
      ?.map((list, key) => {
        return {
          key: key,
          usingTypeArea: _.reduce(
            list,
            (memo, d) => {
              return memo + +d.area;
            },
            0
          ),
          value: _.chain(list)
            .groupBy((d) => {
              return d.subType && d.subType.sublayer_code;
            })
            .map((list, key) => {
              return {
                key: key,
                value: list,
                total_area: _.reduce(
                  list,
                  (memo, d) => {
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
      props.mainObject?.data_msa7y?.msa7yData?.cadDetails?.suggestionsParcels
    )
      ?.reduce((a, b) => {
        return a + +b.area;
      }, 0)
      ?.value();
    Object.keys(pacrelTypes)?.forEach((parcelTypeKey) => {
      var area = pacrelTypes[parcelTypeKey]
        .map((p) => {
          return p.area;
        })
        .reduce((a, b) => {
          return a + b;
        });
      statisticsParcels.push({
        name: parcelTypeKey,
        area: area,
        is_cut: pacrelTypes[parcelTypeKey][0].is_cut,
        is_notfees: pacrelTypes[parcelTypeKey][0].is_notfees,
        areaPercentage:
          (area /
            ((props.mainObject.submission_data.mostafed_data.e3adt_tanzem &&
              msa7y_area) ||
              this.TotalParcelArea)) *
          100,
      });
    });
    //

    calculateSchemanticProportions(
      this.uplodedFeatures?.[this.selectedCADIndex],
      statisticsParcels,
      this.TotalParcelArea,
      props.mainObject
    );

    return statisticsParcels;
  };

  dragLength = (map, event) => {
    map.disableMapNavigation();
    map.getLayer("PacrelNoGraphicLayer").remove(event.graphic);
    addParcelNo(
      event.mapPoint,
      map,
      "" + event.graphic.attributes["text"],
      "PacrelNoGraphicLayer",
      12,
      null,
      event.graphic.attributes["angle"],
      null,
      {
        text: event.graphic.attributes["text"],
        angle: event.graphic.attributes["angle"],
      },
      true,
      (response) => {
        this.#addLayerFeature(map, "PacrelNoGraphicLayer", response);
      },
      false
    );
  };

  clearBuffer = (map) => {
    if (map.getLayer("BufferGraphicLayer"))
      map.getLayer("BufferGraphicLayer").clear();
  };

  #addLayerFeature = (map, layerName, response) => {
    let maplayerIndex = map.graphicsLayerIds.findIndex((r) => r == layerName);
    let layerIndex = this.layers.findIndex((r) => r.layerName == layerName);
    
    if (layerIndex > -1) {
      let graphicIndex = this.layers[layerIndex].graphics.findIndex((r) => {
        return (
          (r?.geometry?.x &&
            response?.geometry?.x &&
            r?.geometry?.x == response?.geometry?.x &&
            r?.geometry?.y == response?.geometry?.y) ||
          (r?.geometry?.rings &&
            response?.geometry?.rings &&
            response?.geometry?.rings[0].filter(
              (t, i) =>
                t[0][0] == r?.geometry?.rings[0][i][0] &&
                t[0][1] == r?.geometry?.rings[0][i][1]
            ).length == r?.geometry?.rings[0].length) ||
          (r?.geometry?.paths &&
            response?.geometry?.paths &&
            response?.geometry?.paths[0].filter(
              (t, i) =>
                t[0][0] == r?.geometry?.paths[0][i][0] &&
                t[0][1] == r?.geometry?.paths[0][i][1]
            ).length == r?.geometry?.paths[0].length)
        );
      });

      if (graphicIndex != -1) {
        this.layers[layerIndex].graphics[graphicIndex] = response.toJson();
      } else {
        this.layers[layerIndex].graphics.push(response.toJson());
      }
    } else {
      this.layers.splice(0, 0, {
        layerIndex: maplayerIndex,
        layerName: layerName,
        graphics: [response.toJson()],
      });
    }
  };

  openPopup = (props, inEditMode, key, callback) => {
    let scope = this;
    let { selectedCADIndex, uplodedFeatures } = scope;
    let selectedPlan = uplodedFeatures && uplodedFeatures[selectedCADIndex];
    var fields = (inEditMode && this.#fields) || this.#editFields;

    props.setMain("Popup", {
      popup: {
        type: "create",
        childProps: {
          fields,
          initialValues: {
            ...selectedPlan.shapeFeatures.landbase[key],
          },
          ok(values) {
            values.cuttes_area = 0;
            if (values.survayParcelCutter.length) {
              if (values.survayParcelCutter[0].NORTH_EAST_DIRECTION) {
                values.cuttes_area +=
                  +values.survayParcelCutter[0].NORTH_EAST_DIRECTION;
              }
              if (values.survayParcelCutter[0].NORTH_WEST_DIRECTION) {
                values.cuttes_area +=
                  +values.survayParcelCutter[0].NORTH_WEST_DIRECTION;
              }
              if (values.survayParcelCutter[0].SOUTH_EAST_DIRECTION) {
                values.cuttes_area +=
                  +values.survayParcelCutter[0].SOUTH_EAST_DIRECTION;
              }
              if (values.survayParcelCutter[0].SOUTH_WEST_DIRECTION) {
                values.cuttes_area +=
                  +values.survayParcelCutter[0].SOUTH_WEST_DIRECTION;
              }
            }
            selectedPlan.shapeFeatures.landbase[key] = {
              ...selectedPlan.shapeFeatures.landbase[key],
              ...values,
            };

            callback();

            return Promise.resolve(true);
          },
        },
      },
    });
  };
}
