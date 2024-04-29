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
  querySetting,
} from "../../../../../inputs/fields/identify/Component/common";
import { getMap } from "main_helpers/functions/filters/state";
import { message } from "antd";
import store from "app/reducers";
import { host } from "imports/config";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
import { isEmpty } from "lodash";

export default {
  number: 2,
  label: "تحديد مسار النزع",
  preSubmit(values, currentStep, props) {
    //return values
    console.log(values);

    function getParcelsArea(parcels, attr) {
      return parcels
        .map((parcel) => {
          return parcel ? parcel[attr] || parcel.attributes[attr] : 0;
        })
        .reduce((partialSum, a) => (+partialSum || 0) + (+a || 0), 0)
        .toFixed(2);
    }

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
      } else {
        let suggestParcels = (
          props?.formValues?.suggestParcel || values?.suggestParcel
        ).suggestParcels;
        let lands = props.mainObject.landData.landData.lands.parcels;

        let isNotValid = false;
        if (
          getParcelsArea(
            suggestParcels.polygons.filter(
              (d) => d.layerName?.toLowerCase() == "boundry"
            ),
            "area"
          ) != getParcelsArea(lands, "PARCEL_AREA")
        ) {
          message.error(
            "المساحة الكلية للأرض من الطبيعة لا تساوى المساحة الكلية للأرض من الصك"
          );
          // throw "error in land selection"
          isNotValid = true;
        }
        if (
          getParcelsArea(
            suggestParcels.polygons.filter(
              (d) => d.layerName?.toLowerCase() == "cut_parcel"
            ),
            "area"
          ) != getParcelsArea(lands, "PARCEL_CUT_AREA")
        ) {
          message.error(
            "المساحة الكلية للجزء المنزوع من الطبيعة لا يساوي المساحة الكلية للجزء المنزوع من بيانات الأرض"
          );
          // throw "error in land selection"
          isNotValid = true;
        }

        if (isNotValid) {
          return reject();
        }

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
              return resolve(props.formValues || values);
            },
            () => {
              message.error("حدث خطأ - يرجي التواصل مع الدعم الفني");
              return reject();
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
      label: "تحديد مسار النزع",
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
                        props.change("msa7yData.mapviewer", {
                          ...props.values?.mapviewer,
                          mapGraphics: [],
                        });
                        props.change("suggestParcel.suggestParcels", {
                          cadData: data.value,
                          justInvoked: true,
                        });
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
          label: "تحديد مسار النزع",
          field: "SuggestParcelPropertyRemovable",
          className: "land_data",
          ...extraMapOperations,
        },
      },
    },
  },
};
