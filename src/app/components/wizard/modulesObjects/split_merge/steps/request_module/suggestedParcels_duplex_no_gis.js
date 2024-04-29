import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import { mapUrl } from "../../../../../../components/inputs/fields/identify/Component/mapviewer/config/map";
import { esriRequest } from "../../../../../../components/inputs/fields/identify/Component/common/esri_request";
import { getInfo } from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
export default {
  label: "الدوبلكسات المقترحة",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      const { t } = props;
      props.mainObject.landData.approved_Image =
        values.sugLandData.APPROVED_IMAGE;
      if (values.sugLandData.lands.suggestedParcels) {
        var total_sug_duplix_areas = 0;
        values.sugLandData.lands.suggestedParcels.forEach(function (val, key) {
          if (val.attributes.AREA) {
            total_sug_duplix_areas += parseFloat(val.attributes.AREA);
          }
        });
        if (
          +(+total_sug_duplix_areas).toFixed(2) !=
          +props.mainObject.landData.landData.area
        ) {
          window.notifySystem("error", t("messages:PARCEL_AREA_PROBLEM"));
          return reject();
        } else {
          if (props.mainObject.duplix_checktor) {
            props.mainObject.duplix_checktor.duplix_checktor.one_area_check = false;
          }
        }

        if (
          !(
            (values.sugLandData.lands.suggestedParcels.length > 1 &&
              props.mainObject.landData.requestType == 1) ||
            (props.mainObject.landData.requestType == 2 &&
              values.sugLandData.lands.suggestedParcels.length == 1)
          )
        ) {
          if (
            values.sugLandData.lands.suggestedParcels.length < 2 &&
            props.mainObject.landData.requestType == 1
          ) {
            window.notifySystem("error", t("messages:wrongFarz", false));
            return reject();
          } else if (
            values.sugLandData.lands.suggestedParcels.length > 1 &&
            props.mainObject.landData.requestType == 2
          ) {
            window.notifySystem("error", t("messages:wrongDamge", false));
            return reject();
          }
        }
      } else {
        window.notifySystem("error", t("messages:required"));
        return reject();
      }

      resolve(values);
    });
  },
  sections: {
    sugLandData: {
      label: "الدوبلكسات المقترحة",
      className: "radio_det",
      fields: {
        APPROVED_IMAGE: {
          label: "صورة الكروكي للوضع المقترح",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*",
          multiple: false,
          required: true,
        },
        HEAD: {
          moduleName: "HEAD",
          //required: true,
          label: "عرض الصور في الإستمارة بشكل رأسي",
          field: "boolean",
        },
        lands: {
          moduleName: "lands",
          label: "بيانات الأرض",
          field: "FarzSuggestedParcels",
          className: "land_data",
          hideLabel: true,
          setReqType: (props) => {
            return "duplex";
          },
        },
      },
    },
  },
};
