import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import { extraMapOperations } from "main_helpers/variables/mapOperations";
import { getMap } from "main_helpers/functions/filters/state";
import { mapSreenShot } from "../../../../../inputs/fields/identify/Component/common/common_func";
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
      //;
      var mapObj = getMap();
      console.log(values);

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
        /*landData_type: {
          moduleName: "landData_type",
          required: true,
          field: "radio",
          hideLabel: true,
          options: [
            {
              label: "اختيار من الخريطة",
              value: 1,
            },
            {
              label: "رسم على الخريطة",
              value: 2,
            },
          ],
          // permission: {
          //   show_match_value_mod: [90, 91],
          // },
          onClick: (evt, props) => {
            props.input.onChange(evt.target.value);
            props.change("landData.lands", {
              isReset: true,
              value: evt.target.value,
            });
          },
        },*/
        lands: {
          moduleName: "lands",
          deps: ["values.landData_type"],
          label: "بيانات الأرض",
          hideLabel: true,
          field: "propertyIdentify",
          className: "land_data",
          baseMapUrl: window.tadketMesahyMapUrl,
          isStatlliteMap: true,
          maxScale: 1146.0062689242377,
          ...extraMapOperations,
        },
      },
    },
  },
};
