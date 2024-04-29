import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import { getMap } from "main_helpers/functions/filters/state";
import { extraMapOperations } from "main_helpers/variables/mapOperations";
import { mapSreenShot } from "../../../../../inputs/fields/identify/Component/common";
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
      var mapObj = getMap();
      console.log(values);

      if (!values?.landData?.lands?.parcels?.length) {
        window.notifySystem("error", "من فضلك قم باختيار الأراضي");
        return reject();
      }

      if (
        values?.landData?.lands?.parcels?.find(
          (p) => !p.attributes.PARCEL_CUT_AREA
        )
      ) {
        window.notifySystem(
          "error",
          "من فضلك تأكد من إدخال المساحة المراد نزعها لجميع قطع الأراضي"
        );
        return reject();
      }

      if (
        values?.landData?.lands?.parcels?.find(
          (p) => +p.attributes.PARCEL_CUT_AREA > +p.attributes.PARCEL_AREA
        )
      ) {
        window.notifySystem(
          "error",
          "يجب أن تكون المساحة المراد نزعها أقل من مساحة الأرض"
        );
        return reject();
      }

      if (
        values?.landData?.lands?.parcels?.find(
          (p) => !p.attributes.parcelData?.north_length
        )
      ) {
        window.notifySystem(
          "error",
          "من فضلك تأكد من إدخال حدود وأبعاد الأرض من الطبيعة لجميع قطع الأراضي"
        );
        return reject();
      }

      if (
        values?.landData?.lands?.parcels?.find(
          (p) =>
            !p.attributes.PARCEL_CUT_North_Lenght ||
            !p.attributes.PARCEL_CUT_North_Desc ||
            !p.attributes.PARCEL_CUT_East_Lenght ||
            !p.attributes.PARCEL_CUT_East_Desc ||
            !p.attributes.PARCEL_CUT_South_Lenght ||
            !p.attributes.PARCEL_CUT_South_Desc ||
            !p.attributes.PARCEL_CUT_West_Lenght ||
            !p.attributes.PARCEL_CUT_West_Desc
        )
      ) {
        window.notifySystem(
          "error",
          "من فضلك تأكد من إدخال وصف وأبعاد الحدود لبيانات الجزء المنزوع من الأرض لجميع قطع الأراضي"
        );
        return reject();
      }

      if (
        values?.landData?.lands?.parcels?.find(
          (p) =>
            !p.attributes.PARCEL_Remain_North_Lenght ||
            !p.attributes.PARCEL_Remain_North_Desc ||
            !p.attributes.PARCEL_Remain_East_Lenght ||
            !p.attributes.PARCEL_Remain_East_Desc ||
            !p.attributes.PARCEL_Remain_South_Lenght ||
            !p.attributes.PARCEL_Remain_South_Desc ||
            !p.attributes.PARCEL_Remain_West_Lenght ||
            !p.attributes.PARCEL_Remain_West_Desc
        )
      ) {
        window.notifySystem(
          "error",
          "من فضلك تأكد من إدخال وصف وأبعاد الحدود لبيانات الجزء المتبقي من الأرض لجميع قطع الأراضي"
        );
        return reject();
      }

      let cutAllParcel = values.landData.lands.parcels
        .map((parcel) => {
          return parcel.attributes.PARCEL_CUT_AREA;
        })
        .reduce((partialSum, a) => (+partialSum || 0) + (+a || 0), 0)
        .toFixed(2);

      let allParcelArea = values.landData.lands.parcels
        .map((parcel) => {
          return parcel.attributes.PARCEL_AREA;
        })
        .reduce((partialSum, a) => (+partialSum || 0) + (+a || 0), 0)
        .toFixed(2);

      /*if (cutAllParcel != allParcelArea) {
        window.notifySystem("error", "عذرًا يجب أن يكون إجمالي مساحة النزع مساوية لإجمالي مساحة الأرض");
        return reject();
      }*/

      function printResult(result) {
        values.screenshotURL = result.value;
        values.total_cut_area = values?.landData.lands.parcels
          .map((parcel) => {
            return parcel.attributes.PARCEL_CUT_AREA;
          })
          .reduce((partialSum, a) => (+partialSum || 0) + (+a || 0), 0);

        values.landData.previous_Image = result.value;
        values.landData.image_uploader = result.value;
        return resolve(values);
      }

      if (mapObj) {
        mapSreenShot(mapObj, printResult, () => {}, false, "landData");
      } else {
        return resolve(values);
      }
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
        project_name: {
          moduleName: "project_name",
          label: "اسم المشروع",
          required: true,
          field: "text",
          init_data: (props) => {
            props.input.onChange(
              props.mainObject.project_attachments.project_attachments
                .project_name
            );
          },
          disabled: true,
          //value:
        },
        lands: {
          moduleName: "lands",
          label: "بيانات الأرض",
          hideLabel: true,
          field: "propertyRemovalIdentify",
          className: "land_data",
          enableDownloadCad: false,
          ...extraMapOperations,
        },
      },
    },
  },
};
