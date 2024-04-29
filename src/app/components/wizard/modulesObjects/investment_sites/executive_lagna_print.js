import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import applyFilters from "main_helpers/functions/filters";
import { withTranslation } from "react-i18next";
import { getMapGraphics } from "../../../inputs/fields/identify/Component/common/common_func";

export default {
  label: "طباعة محضر اللجنة التنفيذية",
  sections: {
    executive_lagna_print: {
      label: "طباعة محضر اللجنة التنفيذية",
      className: "radio_det",
      fields: {
        print: {
          label: "طباعة محضر اللجنة التنفيذية لإعتماد المواقع الاستثمارية",
          //hideLabel: true,
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);
              let id = stepItem["wizard"]["currentModule"]["record"].id;
              window.open(
                printHost + `/#/investmentsites_lagnh_print/${id}`,
                "_blank"
              );
            },
          },
        },
      },
    },
  },
};
