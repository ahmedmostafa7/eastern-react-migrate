import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { map, get, assign } from "lodash";
import { message } from "antd";
import store from "app/reducers";
import { withTranslation } from "react-i18next";
import {
  uploadGISFile,
  getInfo,
  queryTask,
  objectPropFreqsInArrayForKroki,
  clearGraphicFromLayer,
  addParcelNo,
  mapSreenShot,
  getFileName,
  formatPythonObject,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import { getMap } from "main_helpers/functions/filters/state";
export default {
  label: "الإمضاءات",
  preSubmit(values, currentStep, props) {
    const { t } = props;
    return new Promise(function (resolve, reject) {
      if (values.signatures.commit_actors.length > 1) {
        window.notifySystem("error", "يجب اختيار توقيع واحد فقط");
        return reject();
      }

      return resolve(values);
    });
  },
  sections: {
    signatures: {
      label: "الإمضاءات",
      className: "radio_det ",
      fields: {
        commit_actors: {
          label: "اللجة الفنية",
          placeholder: "من فضلك اختر امضاءات اللجنة الفنية",
          field: "multiSelect",
          data: [],
          className: "sig_tab",
          required: true,
          init_data: (props) => {
            let commit_actors = [];
            const committes = get(
              props,
              "currentModule.record.committees.committee_actors",
              get(props, "currentModule.record.CurrentStep.signatures", [])
            );
            if (committes?.length > 0) {
              committes?.forEach(function (val, key) {
                commit_actors?.push({
                  label: committes?.[key]?.users?.name,
                  value: committes?.[key]?.users?.id,
                });
              });
            }

            props.setData(commit_actors);
          },
          label_key: "label",
          value_key: "value",
        },
        sak_search: {
          field: "search",
          label: " جهة إصدار الصك ",
          placeholder: "من فضلك اختر جهة إصدار الصك",
          url: `${workFlowUrl}/issuers/searchbymunicabilityid?municapility_id=10513`,
          filter_key: "q",
          label_key: "name",
          required: true,
          value_key: "id",
          onSelect(value, option, values, props) {
            const issuer_id = option.id || "";
            props.change("signatures.issuer_id", option.id);
            props.change("signatures.issuers", option);
          },
        },
      },
    },
  },
};
