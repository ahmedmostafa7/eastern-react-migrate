import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign, isEmpty } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
export default {
  label: "التعهد",
  sections: {
    farz_commentments: {
      label: "التعهد",
      // className: "radio_det",
      fields: {
        owner_owner_approval: {
          label:
            "يتعهد المستفيد بأن رقم الهاتف المدخل هو رقم المالك أو الوكيل الشرعي بموجب وكالة شرعية.",
          field: "boolean",
          required: true,
        },
        owner_sak_approved: {
          label:
            "يتعهد المستفيد بأن الأوراق في المعاملات تم مطابقتها بالأوراق والنماذج الأصلية ووجدت مطابقة.",
          field: "boolean",
          required: true,
        },
        eng_comp_edit_approved: {
          label: "جميع البيانات المدخلة يمكن تعديلها من قبل المكتب الهندسي.",
          field: "boolean",
          required: true,
        },
      },
    },
  },
};
