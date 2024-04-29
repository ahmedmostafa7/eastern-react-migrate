import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
import { fetchAllData } from "../../../../../../helpers/functions";
const _ = require("lodash");
export default {
  number: 1,
  label: "Destination Data",
  sections: {
    destinationData: {
      label: "Destination Data",
      type: "inputs",
      required: true,
      fields: {
        entity_type_id: {
          moduleName: "entity_type_id",
          label: "نوع الجهة",
          required: true,
          field: "select",
          className: "radio_allotment",
          value_key: "value",
          label_key: "label",
          data: [
            { label: "الوكالة", value: 1 },
            { label: "إدارة حكومية", value: 2 },
            { label: "بلدية", value: 3 },
          ],
          selectChange: (val, rec, props) => {
            // if (val != 3) {
            //   props.change("destinationData.municipality_id", null);
            // } else {
            props.change("destinationData.entity_name", null);
            //  }
            props.input.onChange(val);
          },
        },
        entity_name: {
          showSearch: true,
          moduleName: "entity_name",
          label: "اسم الجهة",
          placeholder: "من فضلك اسم الجهة",
          field: "text",
          init_data: (props) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });

            if (
              values.destinationData["municipality_id"] &&
              typeof values.destinationData["municipality_id"] != "string"
            ) {
              fetchAllData(`${workFlowUrl}/api/Municipality`, {
                params: { pageIndex: 1, pageSize: 1000 },
              }).then((data) => {
                let mun =
                  data.find(
                    (r) => r?.code == values?.destinationData["municipality_id"]
                  )?.name || "";
                props.input.onChange(mun);
              });
            }
          },
          //label_key: "name",
          // value_key: "name",
          // api_config: { params: { pageIndex: 1, pageSize: 1000 } },
          // fetch: `${workFlowUrl}/api/entity`,
          // required: true,
          // selectChange: (val, rec, props) => {
          //   const values = applyFilters({
          //     key: "FormValues",
          //     form: "stepForm",
          //   });
          //   if (rec) {
          //     values.destinationData["entity"] = rec;
          //     values.destinationData["entity_type_id"] =
          //       rec.entity_type_id || 1;
          //   }
          // },
          permission: { show_match_value: { entity_type_id: [1, 2, 3] } },
        },
      },
    },
  },
};
