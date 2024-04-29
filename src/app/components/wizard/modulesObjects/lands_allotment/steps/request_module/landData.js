import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
const _ = require("lodash");
export default {
  number: 3,
  label: "Land Data",
  preSubmit(values, currentStep, props) {
    //return values
    const {
      t,
      currentModule: { id },
    } = props;
    return new Promise(function (resolve, reject) {
      console.log(values);
      if (!values?.landData?.lands?.parcels?.length) {
        window.notifySystem(
          "error",
          `من فضلك اضف ${
            values.landData.landData_type == 1
              ? " أرض على الأقل "
              : " منطقة وعدد الأراضي الممكنة لإضافتها من قبل التخطيط"
          }`
        );
        return reject();
      }
      let isInvalidParcelData = false;
      let isInvalidParcelAreaText = false;
      let isInvalidParcelsToSelect = false;
      let isInvalidSelectedParcels = false;
      let isInvalidZone = false;
      let isInvalidZoneWithoutParcels = false;
      values?.landData?.lands?.parcels?.forEach((parcel) => {
        if (
          (id == 90 &&
            parcel?.landData_type == 1 &&
            !parcel?.selectedLands.length) ||
          (id == 91 && !parcel?.selectedLands.length)
        ) {
          isInvalidZoneWithoutParcels = true;
        }
        parcel?.selectedLands?.forEach((land) => {
          if (
            id == 92 &&
            !isInvalidParcelAreaText &&
            !land.attributes.PARCEL_AREA_TEXT
          ) {
            isInvalidParcelAreaText = true;
          }
          if (
            id == 92 &&
            !isInvalidParcelData &&
            (!land.parcelData ||
              (land.parcelData && Object.keys(land.parcelData).length == 0))
          ) {
            isInvalidParcelData = true;
          }
        });
        if (
          id == 90 &&
          parcel?.landData_type == 2 &&
          parcel?.noOfAvailableServiceParcels == 0
        ) {
          isInvalidZone = true;
        }
        if (
          id == 90 &&
          parcel?.landData_type == 2 &&
          parcel?.noOfParcels > parcel?.noOfAvailableServiceParcels
        ) {
          isInvalidParcelsToSelect = true;
        }
        if (
          id == 91 &&
          parcel?.landData_type == 2 &&
          parcel?.noOfParcels != parcel?.selectedLands.length
        ) {
          isInvalidSelectedParcels = true;
        }
      });
      if (isInvalidParcelAreaText) {
        window.notifySystem("error", "من فضلك ادخل مساحة الأرض بالحروف");
        return reject();
      }
      if (isInvalidParcelData) {
        window.notifySystem("error", "من فضلك ادخل مواصفات الأرض");
        return reject();
      }
      if (isInvalidZone) {
        window.notifySystem(
          "error",
          "المنطقة المختارة لا يوجد بها أراضي خدمات"
        );
        return reject();
      }
      if (isInvalidParcelsToSelect) {
        window.notifySystem(
          "error",
          "اجمالي عدد الأراضي في هذه المنطقة لا يساوي عدد الأراضي المراد ادخالها من قبل التخطيط"
        );
        return reject();
      }

      if (isInvalidSelectedParcels) {
        window.notifySystem(
          "error",
          "اجمالي عدد الأراضي في هذه المنطقة لا يساوي عدد الأراضي المدخلة من قبل التخطيط"
        );
        return reject();
      }

      if (isInvalidZoneWithoutParcels) {
        window.notifySystem(
          "error",
          "هناك منطقة مختارة ليس لهاأراضي خدمات محددة"
        );
        return reject();
      }

      return resolve(values);
    });
  },
  sections: {
    landData: {
      label: "Land Data",
      type: "inputs",
      fields: {
        // reset: {
        //   field: "button",
        //   hideLabel: true,
        //   text: "...",
        //   style: {
        //     position: "absolute",
        //     right: "430px",
        //     marginTop: "10px",
        //     zIndex: "999",
        //   },
        //   action: {
        //     type: "custom",
        //     action(props, stepItem) {
        //       props.change("landData.landData_type", null);
        //       props.change("landData.lands", {
        //         isReset: true,
        //       });
        //     },
        //   },
        //   permission: {
        //     show_match_value_mod: [90],
        //   },
        // },
        landData_type: {
          moduleName: "landData_type",
          required: true,
          field: "radio",
          hideLabel: true,
          options: [
            {
              label: "معلوم قطع الأراضي",
              value: 1,
            },
            // {
            //   label: "غير معلوم قطع الأراضي",
            //   value: 2,
            // },
          ],
          permission: {
            show_match_value_mod: [90, 91],
          },
          onClick: (evt, props) => {
            props.input.onChange(evt.target.value);
            props.change("landData.lands", {
              isReset: true,
              value: evt.target.value,
            });
          },
        },
        lands: {
          moduleName: "lands",
          deps: ["values.landData_type"],
          label: "بيانات الأرض",
          hideLabel: true,
          field: "ServiceIdentify",
          className: "land_data",
          enableDownloadCad: false,
          ...extraMapOperations,
        },
        site_allotment_before: {
          moduleName: "site_allotment_before",
          required: true,
          label: "هذا الموقع لم يتم تخصيصه مسبقا",
          field: "boolean",
          // disabled: (props) => {
          //   return props.currentModule.id != 90
          // },
          permission: {
            show_match_value_mod: [90],
          },
        },
      },
    },
  },
};
