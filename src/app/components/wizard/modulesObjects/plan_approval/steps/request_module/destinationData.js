import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import { workFlowUrl } from "imports/config";
import axios from "axios";
const _ = require("lodash");
export default {
  number: 1,
  label: "بيانات الجهة الحكومية",
  sections: {
    destinationData: {
      label: "بيانات الجهة الحكومية",
      type: "inputs",
      required: true,
      fields: {
        entity_id: {
          showSearch: true,
          moduleName: "entity_id",
          label: "اسم الجهة",
          placeholder: "من فضلك اسم الجهة",
          field: "select",
          label_key: "name",
          value_key: "id",
          api_config: { params: { pageIndex: 1, pageSize: 1000 } },
          fetch: `${workFlowUrl}/api/entity`,
          required: true,
          selectChange: (val, rec, props) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            if (rec) {
              values.destinationData["entity"] = rec;
              values.destinationData["entity_type_id"] =
                rec.entity_type_id || 1;
            }
          },
        },
        entity_type_id: {
          moduleName: "entity_type_id",
          label: "نوع الجهة",
          required: true,
          field: "radio",
          className: "radio_allotment",
          options: [
            { label: "قطاع حكومي", value: 1 },
            { label: "مركز أهلي", value: 2 },
            { label: "جمعية خيرية", value: 3 },
          ],
          initValue: 1,
        },
      },
    },
  },
};
