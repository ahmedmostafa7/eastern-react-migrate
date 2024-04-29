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
    contract_commentments: {
      label: "التعهد",
      // className: "radio_det",
      fields: {
        approved_accept: {
          label:
            "يتعهد المكتب الهندسي بأن الأرض لازالت فضاء حتي وقت تقديم الطلب ولا يحول دون فرزها اي سبب معلوم للمكتب الهندسي.",
          field: "boolean",
          required: true,
        },
        owner_approval: {
          label:
            "يتعهد المكتب بأن رقم الهاتف المدخل هو رقم المالك أو الوكيل الشرعي بموجب وكالة شرعية.",
          field: "boolean",
          required: true,
        },
        approved_sak: {
          label:
            "يتعهد المكتب بأن الأوراق في المعاملات تم مطابقتها بالأوراق والنماذج الأصلية ووجدت مطابقة.",
          field: "boolean",
          required: true,
        },
        approved_sak_status: {
          label: "تخلو الأرض من أية عوائق والصك مطابق للطبيعة.",
          field: "boolean",
          required: true,
        },
      },
    },
  },
};
