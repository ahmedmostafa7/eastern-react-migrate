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

      fields: {
        approved_accept: {
          label:
            "يتعهد المكتب الهندسي بأن المخططات المعمارية المقدمة هي المعتمدة من قبل الأمانة وبأنها مطابقة للطبيعة ولا يوجد اي مخالفات بها.",
          field: "boolean",
          required: true,
        },
        owner_approval: {
          label:
            "يتعهد المكتب بأن رقم الهاتف المدخل هو رقم المالك أو الوكيل الشرعي بموجب وكالة شرعية.",
          field: "boolean",
          required: true,
        },
      },
    },
  },
};
