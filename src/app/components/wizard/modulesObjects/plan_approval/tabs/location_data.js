import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host } from "imports/config";
export default {
  label: "محضر تقدير",
  sections: {
    ma7dar_mola5s: {
      label: "بيانات محضر التقدير",
      className: "radio_det",
      fields: {
        name: {
          label: "اسم المحضر",
        },
        selectData: {
          label: "Province",
          field: "select",
          data: [{ label: "امانة المنطقة الشرقية", value: 1 }],
          VALUE: 1,
        },
      },
    },
  },
};
