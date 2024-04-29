import {
  mapSreenShot,
  uploadGISFile,
  queryTask,
  getInfo,
  highlightFeature,
  getPolygons,
  addGraphicToLayer,
  clearGraphicFromLayer,
  getFeatureDomainName,
  intersectQueryTask,
  project,
  addParcelNo,
  zoomToLayer,
  getMapGraphics,
} from "../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
import { querySetting } from "../../components/inputs/fields/identify/Component/IdentifyComponnentCoord/Helpers"; //
import { message } from "antd";
import store from "app/reducers";
import { host } from "imports/config";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
import { isEmpty } from "lodash";
export default {
  number: 2,
  label: "suggest Parcel",
  preSubmit(values, currentStep, props) {
    //return values
    console.log(values);
    return new Promise(function (resolve, reject) {
      var mapObj = getMap();
      if (
        !(props?.formValues?.suggestParcel || values?.suggestParcel) ||
        !(props?.formValues?.suggestParcel || values?.suggestParcel)
          .suggestParcels.polygons
      ) {
        message.error("من فضلك قم برفع ملف الاوتكاد");
        // throw "error in land selection"
        reject();
      } else if (
        (
          props?.formValues?.suggestParcel || values?.suggestParcel
        ).suggestParcels.polygons
          .filter((polygon) => {
            return (
              polygon?.layerName &&
              polygon?.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
              polygon?.layerName?.toLowerCase() != "notPlus"?.toLowerCase()
            );
          })
          .find((polygon) => {
            return (
              isEmpty(polygon?.north_Desc) ||
              isEmpty(polygon?.weast_Desc) ||
              isEmpty(polygon?.south_Desc) ||
              isEmpty(polygon?.east_Desc)
            );
          }) != undefined
      ) {
        message.error("من فضلك قم بإدخال وصف الحدود");
        // throw "error in land selection"
        reject();
      } else if (
        (
          props?.formValues?.suggestParcel || values?.suggestParcel
        ).suggestParcels.polygons
          .filter((polygon) => {
            return polygon.layerName?.toLowerCase() == "notPlus"?.toLowerCase();
          })
          .find((polygon) => {
            return !(
              polygon.parcel_name &&
              polygon.area &&
              polygon.parcel_area_desc
            );
          })
      ) {
        message.error("من فضلك قم بإدخال بيانات الزائدة");
        // throw "error in land selection"
        reject();
      } else if (
        props.mainObject.landData.landData.lands.parcels.length !=
          (
            (
              props?.formValues?.suggestParcel || values?.suggestParcel
            ).suggestParcels.polygons.find((polygon) => {
              return (
                polygon.layerName?.toLowerCase() ==
                "full_boundry"?.toLowerCase()
              );
            }) ||
            (
              props?.formValues?.suggestParcel || values?.suggestParcel
            ).suggestParcels.polygons.filter((polygon) => {
              return (
                polygon.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
                polygon.layerName?.toLowerCase() != "notPlus"?.toLowerCase()
              );
            })
          ).length ||
        props.mainObject.landData.landData.lands.parcels.filter(
          (r) =>
            (
              (
                props?.formValues?.suggestParcel || values?.suggestParcel
              ).suggestParcels.polygons.find((polygon) => {
                return (
                  polygon.layerName?.toLowerCase() ==
                  "full_boundry"?.toLowerCase()
                );
              }) ||
              (
                props?.formValues?.suggestParcel || values?.suggestParcel
              ).suggestParcels.polygons.filter((polygon) => {
                return (
                  polygon.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
                  polygon.layerName?.toLowerCase() != "notPlus"?.toLowerCase()
                );
              })
            ).filter((polygon) => {
              return r.attributes.PARCEL_PLAN_NO == polygon.parcel_name;
            }).length != 1
        ).length ||
        props.mainObject.landData.landData.lands.parcels.filter(
          (r) =>
            !(
              (
                props?.formValues?.suggestParcel || values?.suggestParcel
              ).suggestParcels.polygons.find((polygon) => {
                return (
                  polygon.layerName?.toLowerCase() ==
                  "full_boundry"?.toLowerCase()
                );
              }) ||
              (
                props?.formValues?.suggestParcel || values?.suggestParcel
              ).suggestParcels.polygons.filter((polygon) => {
                return (
                  polygon.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
                  polygon.layerName?.toLowerCase() != "notPlus"?.toLowerCase()
                );
              })
            ).filter((polygon) => {
              return (
                r.attributes.PARCEL_PLAN_NO == polygon.parcel_name &&
                +(+r.attributes.Natural_Area).toFixed(2) ==
                  +polygon?.area?.toFixed(2) -
                    ((+polygon.shtfa_southweast || 0) +
                      (+polygon.shtfa_southeast || 0) +
                      (+polygon.shtfa_northweast || 0) +
                      (+polygon.shtfa_northeast || 0)) -
                    (+polygon.electricArea || 0)
              );
            }).length
        ).length ||
        +(
          [
            ...((
              props?.formValues?.suggestParcel || values?.suggestParcel
            ).suggestParcels.polygons.find((polygon) => {
              return (
                polygon.layerName?.toLowerCase() ==
                "full_boundry"?.toLowerCase()
              );
            }) ||
              (
                props?.formValues?.suggestParcel || values?.suggestParcel
              ).suggestParcels.polygons.filter((polygon) => {
                return (
                  polygon.layerName?.toLowerCase() != "plus"?.toLowerCase() &&
                  polygon.layerName?.toLowerCase() != "notPlus"?.toLowerCase()
                );
              })),
          ]?.reduce((a, b) => {
            return (
              a +
              (+b?.area?.toFixed(2) -
                ((+b.shtfa_southweast || 0) +
                  (+b.shtfa_southeast || 0) +
                  (+b.shtfa_northweast || 0) +
                  (+b.shtfa_northeast || 0)) -
                (+b.electricArea || 0))
            );
          }, 0) || 0
        ).toFixed(2) !=
          +props.mainObject.landData.landData.lands.parcels
            .reduce((a, b) => {
              return a + +b?.attributes?.Natural_Area;
            }, 0)
            .toFixed(2)
      ) {
        message.error(
          "من فضلك تاكد من ان مساحة الارض في شاشة موقع الزائدة مساوي لمساحة الارض من الطبيعة بشاشة بيانات الأرض"
        );
        // throw "error in land selection"
        reject();
      } else {
        if (mapObj) {
          (
            props?.formValues?.suggestParcel || values?.suggestParcel
          ).suggestParcels.mapGraphics =
            (mapObj && getMapGraphics(mapObj)) || [];
          mapSreenShot(
            mapObj,
            (result) => {
              //delete (props?.formValues?.suggestParcel || values?.suggestParcel).suggestParcels.temp.map;
              (
                props.formValues.suggestParcel || values.suggestParcel
              ).submission_data = {};
              (
                props.formValues.suggestParcel || values.suggestParcel
              ).submission_data.suggestionUrl = result.value;
              resolve(props.formValues || values);
            },
            () => {
              message.error("حدث خطأ - يرجي التواصل مع الدعم الفني");
              reject();
            },
            false,
            "zayda_data_msa7y"
          );
        } else {
          return resolve(props.formValues || values);
        }
      }
    });
  },
  //description: 'this is the Second Step description',
  sections: {
    suggestParcel: {
      label: "suggest Parcel",
      type: "inputs",
      required: true,
      fields: {
        image_uploader: {
          label: "ملف الأتوكاد",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: ".DWG",
          multiple: false,
          required: false,
          postRequest: (uploadedUrl, props) => {
            store.dispatch({ type: "Show_Loading_new", loading: true });
            if (uploadedUrl) {
              let queryConditions = [];
              let isGuid = false;
              let where = "1=-1";
              let parcels = props.mainObject.landData.landData.lands.parcels;
              parcels.forEach((elem) => {
                queryConditions.push(
                  "PARCEL_SPATIAL_ID  = " + elem.attributes.PARCEL_SPATIAL_ID
                );
                if (typeof elem.attributes.PARCEL_SPATIAL_ID == "string") {
                  if (elem.attributes.PARCEL_SPATIAL_ID.indexOf("-") > -1)
                    isGuid = true;
                }
              });
              where = queryConditions.join(" or ");

              if (isGuid || parcels.length == 0)
                where = "PARCEL_SPATIAL_ID = -1";
              getInfo().then((res) => {
                // ////
                queryTask({
                  ...querySetting(res.Landbase_Parcel, where, true, ["*"]),
                  callbackResult: (res) => {
                    res.features = res.features.map((feature, index) => {
                      feature.attributes.PARCEL_LAT_COORD = "";
                      feature.attributes.PARCEL_LONG_COORD = "";
                      return feature.toJson();
                    });

                    uploadGISFile(
                      `${window.restServicesPath}/GeoData_SuggestedPlans_Zawayed/GPServer/GeoData_SuggestedPlans_Zawayed`,
                      {
                        CAD_File_Name: uploadedUrl, //`${getFileName(uploadedUrl)}.dwg`
                        Parcels: JSON.stringify(res),
                      },
                      (data) => {
                        data.value[0].shapeFeatures.forEach((r) => {
                          if (
                            find(parcels, (e) =>
                              window.geometryEngine.within(
                                new esri.geometry.Polygon(r).getCentroid(),
                                new esri.geometry.Polygon(e.geometry)
                              )
                            ) != undefined &&
                            r.notify == "mapview.parcels.NOTIFY"
                          ) {
                            r.notify = "mapview.parcels.NOTIFY_INTERSECT";
                          }
                        });
                        if (
                          data.value[0].shapeFeatures.filter((polygon) => {
                            return (
                              polygon.layer?.toLowerCase() !=
                                "plus"?.toLowerCase() &&
                              polygon.layer?.toLowerCase() !=
                                "notPlus"?.toLowerCase()
                            );
                          }).length == parcels.length
                        ) {
                          props.change("msa7yData.mapviewer", {
                            ...props.values?.mapviewer,
                            mapGraphics: [],
                          });
                          props.change("suggestParcel.suggestParcels", {
                            cadData: data.value,
                            justInvoked: true,
                          });
                        } else {
                          props.change("suggestParcel.suggestParcels", {
                            cadData: null,
                            justInvoked: true,
                          });
                          window.notifySystem(
                            "error",
                            "مساوية لعدد الأراضي المختارة من شاشة بيانات الارض (boundry) من فضلك تاكد من ان عدد الأراضي المرفوعة فى طبقة ال",
                            10
                          );
                        }
                        store.dispatch({
                          type: "Show_Loading_new",
                          loading: false,
                        });
                      }
                    );
                  },
                });
              });
            } else {
              props.change("suggestParcel.suggestParcels", {
                cadData: null,
                justInvoked: true,
              });
              store.dispatch({ type: "Show_Loading_new", loading: false });
            }
          },
          hideLabel: true,
        },
        suggestParcels: {
          label: "موقع الزائدة",
          field: "SuggestParcel",
          className: "land_data",
          ...extraMapOperations,
          boundsFields: {
            north: [
              {
                name: "north_Desc",
                type: "text",
                placeholder: "وصف الحد الشمالي",
              },
            ],
            south: [
              {
                name: "south_Desc",
                type: "text",
                placeholder: "وصف الحد الجنوبي",
              },
            ],
            west: [
              {
                name: "weast_Desc",
                type: "text",
                placeholder: "وصف الحد الغربي",
              },
            ],
            east: [
              {
                name: "east_Desc",
                type: "text",
                placeholder: "وصف الحد الشرقي",
              },
            ],
          },
        },

        checkOwn: {
          name: "check",
          label: "المخطط ملكية خاصة",
          field: "boolean",
          //   rows: "5",
        },
        /*uploadSurvay: {
          label: 'مرفق الرفع المساحى',
          field: 'simpleUploader',
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: 'image/*,.pdf'
        }*/
      },
    },
  },
};
