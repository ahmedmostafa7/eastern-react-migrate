import { mapSreenShot } from "../../components/inputs/fields/identify/Component/common/common_func";
import { message } from "antd";

import { host } from "configFiles/config";
export default {
  number: 2,
  label: "تحديث خريطة الأساس",
  preSubmit(values, currentStep, props) {
    //return values
    return new Promise(function (resolve, reject) {
      if (!values.updateMap) {
        if (
          !values.suggestParcel ||
          !values.suggestParcel.suggestParcels.polygons
        ) {
          message.error("من فضلك قم برفع ملف الاوتكاد");
          // throw "error in land selection"
          reject();
        } else if (
          values.suggestParcel.suggestParcels.polygons
            .filter((polygon) => {
              return polygon.layerName != "plus";
            })
            .find((polygon) => {
              return !(
                polygon.north_Desc &&
                polygon.weast_Desc &&
                polygon.south_Desc &&
                polygon.east_Desc
              );
            })
        ) {
          message.error("من فضلك قم بإدخال وصف الحدود");
          // throw "error in land selection"
          reject();
        } else {
          mapSreenShot(
            values.suggestParcel.suggestParcels.temp.map,
            (result) => {
              delete values.suggestParcel.suggestParcels.temp.map;
              values.submission_data = {};
              values.submission_data.suggestionUrl = result.value;
              resolve(values);
            },
            () => {
              message.error("حدث خطأ - يرجي التواصل مع الدعم الفني");
              reject();
            },
            false,
            "updateMap"
          );
        }
      } else {
        resolve(values);
      }
    });
  },
  //description: 'this is the Second Step description',
  sections: {
    updateMap: {
      label: "تحديث خارطة الأساس",
      type: "inputs",
      required: true,
      fields: {
        updateMap: {
          label: "تحديث خارطة الأساس",
          field: "updateMapFinal",
          className: "land_data",
        },
      },
    },
  },
};
