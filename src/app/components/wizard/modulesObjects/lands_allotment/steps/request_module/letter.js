import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
export default {
  label: "letter",
  //   preSubmit(values, currentStep, props) {
  //     return new Promise(function (resolve, reject) {

  //     });
  //   },
  number: 2,
  sections: {
    letter: {
      label: "letter",
      className: "radio_det",
      fields: {
        letter_image: {
          moduleName: "letter_image",
          label: "الخطاب",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          required: true,
        },
        letter_no: {
          moduleName: "letter_no",
          label: "رقم الخطاب",
          placeholder: "من فضلك ادخل رقم الخطاب",
          required: true,
          field: "text",
        },
        letter_date: {
          moduleName: "letter_date",
          label: "تاريخ الخطاب",
          placeholder: "من فضلك ادخل تاريخ الخطاب",
          required: true,
          field: "hijriDatePicker",
        },
        import_no: {
          moduleName: "import_no",
          label: "رقم الوارد",
          placeholder: "من فضلك ادخل رقم الوارد",
          required: true,
          field: "text",
        },
        import_date: {
          moduleName: "import_date",
          label: "تاريخ الورود",
          placeholder: "من فضلك ادخل تاريخ الورود",
          required: true,
          field: "hijriDatePicker",
        },
        calling_destination: {
          moduleName: "calling_destination",
          //required: true,
          label: "تبليغ طلب الجهة المستفيدة",
          field: "boolean",
        },
        calling_no: {
          moduleName: "calling_no",
          label: "رقم تبليغ الطلب",
          placeholder: "من فضلك ادخل رقم تبليغ الطلب",
          required: true,
          field: "text",
          permission: { show_match_value: { calling_destination: true } },
        },
        calling_date: {
          moduleName: "calling_date",
          label: "تاريخ تبليغ الطلب",
          placeholder: "من فضلك ادخل تاريخ تبليغ الطلب",
          required: true,
          field: "hijriDatePicker",
          permission: { show_match_value: { calling_destination: true } },
        },
      },
    },
  },
};
