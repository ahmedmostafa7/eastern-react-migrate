import { message } from "antd";
import store from "app/reducers";
import {
  getMapGraphics,
  mapSreenShot,
} from "../../../../inputs/fields/identify/Component/common";
import { getMap } from "main_helpers/functions/filters/state";
export default {
  number: 2,
  label: "Land Data",
  preSubmit(values, currentStep, props) {
    //return values
    var mapObj = getMap();
    return new Promise(function (resolve, reject) {
      if (!values.landData || !values.landData.lands.parcels) {
        message.error("من فضلك قم بأختيار الأرض");
        // throw "error in land selection"
        reject();
      } else if (
        values.landData.lands &&
        !values.landData.lands.parcels[0].attributes.Natural_Area &&
        !window.isAkarApp
      ) {
        message.error("من فضلك قم بإدخال المساحة من الطبيعة");
        // throw "error in land selection"
        reject();
      } else {
        if (
          !values.submission_data.north_length ||
          !values.submission_data.north_desc ||
          !values.submission_data.south_length ||
          !values.submission_data.south_desc ||
          !values.submission_data.east_length ||
          !values.submission_data.east_desc ||
          !values.submission_data.west_length ||
          !values.submission_data.west_desc
        ) {
          message.error("من فضلك تأكد من ادخال حدود وأطوال الأراضي");
          return reject();
        }

        let parcel = values.landData.lands.parcels[0];
        values.landData.BLOCK_NO = parcel.attributes.PARCEL_BLOCK_NO;
        values.landData.PLAN_NO = parcel.attributes.PLAN_NO;
        values.landData.BLOCK_SPATIAL_ID = parcel.attributes.BLOCK_SPATIAL_ID;
        values.landData.DIVISION_NO = parcel.attributes.SUBDIVISION_DESCRIPTION;
        values.landData.MUNICIPALITY_NAME = parcel.attributes.MUNICIPALITY_NAME;

        if (mapObj) {
          values.landData.lands.mapGraphics =
            (mapObj && getMapGraphics(mapObj)) || [];
          mapSreenShot(
            mapObj,
            (result) => {
              values.submission_data.approvedUrl = result.value;
              resolve(values);
            },
            () => {
              message.error("حدث خطأ - يرجي التواصل مع الدعم الفني");
              reject();
            },
            false,
            "landData"
          );
        } else {
          return resolve(values);
        }
      }
    });
  },
  //description: 'this is the Second Step description',
  sections: {
    landData: {
      label: "Land Data",
      type: "inputs",
      required: true,
      fields: {
        lands: {
          label: "بيانات الأرض",
          field: "addedParcelsIdentify",
          className: "land_data",
        },
      },
    },
    submission_data: {
      label: "حدود الموقع",
      className: "parcelInfo",
      moduleName: "submission_data",
      type: "inputs",
      fields: {
        north_length: {
          label: "North Length",
          maxLength: 6,
          digits: true,
          required: true,
        },
        north_desc: {
          label: "North Description",
          required: true,
        },

        south_length: {
          digits: true,
          maxLength: 6,
          label: "South Length",
          required: true,
        },
        south_desc: {
          label: "South Description",
          required: true,
        },

        east_length: {
          maxLength: 6,
          digits: true,
          label: "East Length",
          required: true,
        },
        east_desc: {
          label: "East Description",
          required: true,
        },

        west_length: {
          digits: true,
          maxLength: 6,
          label: "West Length",
          required: true,
        },
        west_desc: {
          label: "West Description",
          required: true,
        },
      },
    },
  },
};
