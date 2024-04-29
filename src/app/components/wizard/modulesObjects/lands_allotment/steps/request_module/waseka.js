import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
const _ = require("lodash");
export default {
  number: 4,
  label: "كتابة العدل",
  sections: {
    waseka: {
      label: "كتابة العدل",
      type: "inputs",
      required: true,
      fields: {
        waseka_search: {
          field: "search",
          label: "كتابة العدل",
          placeholder: "من فضلك اختر كتابة العدل",
          url: `${workFlowUrl}/issuers/searchbymunicabilityid?municapility_id=10513`,
          filter_key: "q",
          label_key: "name",
          required: true,
          onSelect(value, option, values, props) {
            const issuer_id = option.id || "";
            props.change("issuer_id", option.id);
          },
        },
      },
    },
  },
};
