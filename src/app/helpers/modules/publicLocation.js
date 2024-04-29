import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import axios from "axios";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign, isEmpty } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import { mapSreenShot } from "../../../app/components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
export default {
  number: 2,
  label: "تحديد الموقع العام",
  preSubmit(values, currentStep, props) {
    let mapObj = getMap();
    return new Promise(function (resolve, reject) {
      if (mapObj) {
        mapSreenShot(
          mapObj,
          (result) => {
            values.landData.lands.public_screenshotURL = result.value;
            values.landData.public_Image = result.value;
            return resolve(values);
          },
          () => {},
          false,
          "public_landData"
        );
      } else {
        return resolve(values);
      }
    });
  },
  sections: {
    landData: {
      label: "تحديد الموقع العام",
      type: "inputs",
      required: true,
      fields: {
        lands: {
          hideLabel: true,
          field: "IdentifyPublicLocation",
          className: "land_data",
          moduleName: "lands",
          publicLocation: {},
        },
        print_landData_type: {
          label: "طباعة كروكي الموقع ",
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);
              const { t } = props;
              let mapObj = getMap();
              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];
              mainObject.LandWithCoordinate.landData = props?.values;
              const url = "/Submission/SaveEdit";
              const params = { sub_id: id };

              mapSreenShot(
                mapObj,
                (result) => {
                  if (mainObject?.LandWithCoordinate?.landData?.lands) {
                    mainObject.LandWithCoordinate.landData.lands.public_screenshotURL =
                      result.value;
                    mainObject.LandWithCoordinate.landData.public_Image =
                      result.value;
                  }
                  delete mainObject.temp;

                  postItem(
                    url,
                    {
                      mainObject: window.lzString.compressToBase64(
                        JSON.stringify({ ...mainObject })
                      ),
                      tempFile: {},
                    },
                    { params }
                  ).then(() =>
                    window.open(printHost + `/#/service_kroky/${id}`, "_blank")
                  );
                },
                () => {
                  window.notifySystem("error", t("Failed to update"));
                },
                false,
                "public_landData"
              );
              // localStorage.setItem("edit_price", JSON.stringify(edit_price));
            },
          },
        },
      },
    },
  },
};
