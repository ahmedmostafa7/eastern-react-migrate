import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import axios from "axios";
import { workFlowUrl } from "imports/config";
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
        // addEntity: {
        //   field: "button",
        //   hideLabel: true,
        //   text: "إضافة جهة",
        //   action: {
        //     type: "custom",
        //     action(props, stepItem) {
        //       console.log("stem", stepItem);
        //       const fields = {
        //         code: {
        //           field: "text",
        //           label: "كود الجهة",
        //           required: true,
        //         },
        //         name: {
        //           field: "text",
        //           label: "اسم الجهة",
        //           required: true,
        //         },
        //         entity_type_id: {
        //           moduleName: "entity_type_id",
        //           label: "نوع الجهة",
        //           placeholder: "من فضلك نوع الجهة",
        //           field: "select",
        //           label_key: "name",
        //           value_key: "id",
        //           api_config: { params: { pageIndex: 1, pageSize: 1000 } },
        //           fetch: `${workFlowUrl}/api/entitytype`,
        //           required: true,
        //         },
        //       };
        //       props.setMain("Popup", {
        //         popup: {
        //           type: "create",
        //           childProps: {
        //             fields,
        //             ok(values) {
        //               const { selectors } = props;
        //               //;
        //               let data = selectors.entity_id.data || [];
        //               postItem(`${workFlowUrl}/api/entity`, {
        //                 ...values,
        //                 id: 0,
        //               }).then((resp) => {
        //                 //       //;
        //                 props.setSelector("entity_id", {
        //                   label_key: "name",
        //                   value_key: "id",
        //                   data: [
        //                     ...data,
        //                     { ...values, id: data[data.length - 1].id + 1 },
        //                   ],
        //                   value: null,
        //                 });
        //               });
        //               return Promise.resolve(values);
        //             },
        //           },
        //         },
        //       });
        //     },
        //   },
        // },
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
            { label: "حكومي", value: 1 },
            { label: "مركز أهلي", value: 2 },
            { label: "جمعيات خيرية", value: 3 },
          ],
          initValue: 1,
          // init: (scope) => {
          //   if (scope.props) {
          //
          //     const {
          //       input: { onChange },
          //     } = scope.props;

          //     const values = applyFilters({
          //       key: "FormValues",
          //       form: "stepForm",
          //     });

          //     onChange(values.destinationData["entity_type_id"] || 1);
          //   }
          // },
        },
        center_name: {
          moduleName: "center_name",
          label: "اسم المركز",
          placeholder: "من فضلك ادخل اسم المركز",
          required: true,
          field: "text",
          //
          permission: { show_match_value: { entity_type_id: 2 } },
        },
        center_owner_name: {
          moduleName: "center_owner_name",
          label: "اسم صاحب المركز",
          placeholder: "من فضلك ادخل اسم صاحب المركز",
          required: true,
          field: "text",
          permission: { show_match_value: { entity_type_id: 2 } },
        },
        center_license_number: {
          moduleName: "center_license_number",
          label: " رقم الرخصة للمركز الأهلي",
          placeholder: "من فضلك ادخل رقم الرخصة للمركز الأهلي",
          required: true,
          field: "text",
          permission: { show_match_value: { entity_type_id: 2 } },
        },
        license_issue_date: {
          moduleName: "license_issue_date",
          label: "تاريخ إصدار الرخصة",
          placeholder: "من فضلك تاريخ إصدار الرخصة",
          required: true,
          field: "hijriDatePicker",
          permission: { show_match_value: { entity_type_id: 2 } },
        },
      },
    },
    allotment_type: {
      label: "Allotment Type",
      type: "inputs",
      required: true,
      fields: {
        type: {
          moduleName: "type",
          label: "Allotment Type",
          placeholder: "من فضلك نوع التخصيص",
          field: "select",
          label_key: "label",
          value_key: "value",
          required: true,
          data: [
            { label: "مؤقت", value: "مؤقت" },
            { label: "دائم", value: "دائم" },
            { label: "مشروط", value: "مشروط" },
            {
              label: "مشروط بالتنازل عن الموقع السابق",
              value: "مشروط بالتنازل عن الموقع السابق",
            },
            { label: "مشروط بإقامة مبنى", value: "مشروط بإقامة مبنى" },
          ],
        },
      },
    },
  },
};
