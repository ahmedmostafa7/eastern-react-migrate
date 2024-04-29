import { workFlowUrl, SubAttachementUrl } from "imports/config";
import { host, host2 } from "imports/config";
import axios from "axios";
import { get } from "lodash";
export const motalbat_2 = {
  name: {
    label: "اسم المرفق",
    field: "text",
    name: "name",
    // placeholder: 'Please Enter Your Name',
    required: true,
    maxLength: 200,
  },
  image_motlbat: {
    label: "المرفقات",
    placeholder: "select file",
    field: "simpleUploader",
    multiple: false,
    required: true,
    uploadUrl: `${host}/uploadMultifiles`,
    name: "image",
    extensions: ".jpg,.jpeg,.png",
    // path: SubAttachementUrl + "submission/identity_photo",
  },

  number: {
    label: "الرقم",
    digits: true,
  },
  date: {
    label: " التاريخ",
    field: "hijriDatePicker",
    lessThanToday: true,
    required: true,
  },
};

export const motalbat_1 = {
  image_motlbat: {
    label: "المرفقات",
    placeholder: "select file",
    field: "simpleUploader",
    multiple: false,
    required: true,
    uploadUrl: `${host}/uploadMultifiles`,
    // name: "image",
    extensions: ".jpg,.jpeg,.png",
    // path: SubAttachementUrl + "submission/identity_photo",
  },
  number: {
    label: "الرقم",
    digits: true,
  },
  date: {
    label: " التاريخ",
    field: "hijriDatePicker",
    lessThanToday: true,
    required: true,
  },
};
// export const image_show = {
//   image: {
//     label: "المرفقات",
//     placeholder: "select file",
//     field: "simpleUploader",
//     multiple: false,
//     required: true,
//     uploadUrl: `${host}/uploadMultifiles`,
//     // name: "image",
//     extensions: ".jpg,.jpeg,.png",
//     // path: SubAttachementUrl + "submission/identity_photo",
//   },
// };
export const wasekaFields = {
  selectedLands: {
    field: "multiSelect",
    label: "الأراضي المختارة",
    placeholder: "الأراضي المختارة",
    required: true,
    // label_key: "id",
    // value_key: "name",
    label_key: "name",
    value_key: "id",
    moduleName: "waseka",
    // onSelect: (value, props) => {
    //
    // }
  },
  // mlkya_type: {
  //   field: "select",
  //   label: " نوع وثيقة الملكية  ",
  //   placeholder: "من فضلك اختر نوع وثيقة الملكية",
  //   label_key: "name",
  //   value_key: "id",
  //   showSearch: true,
  //   required: true,
  //   moduleName: "ee",
  //   data: [
  //     { id: "1", name: " صك ملكية" },
  //     { id: "2", name: " أخري" },
  //   ],
  // },
  number_waseka: {
    label: "رقم وثيقة الملكية",
    placeholder: "من فضلك ادخل رقم وثيقة الملكية",
    required: true,
    //digits: true,
  },
  date_waseka: {
    label: " تاريخ إصدار وثيقة الملكية",
    placeholder: "من فضلك ادخل تاريخ إصدار وثيقة الملكية",
    field: "hijriDatePicker",
    lessThanToday: true,
    required: true,
  },
  waseka_search: {
    field: "search",
    label: " جهة إصدار وثيقة الملكية ",
    placeholder: "من فضلك اختر جهة إصدار وثيقة الملكية",
    url: `${workFlowUrl}/issuers/searchbymunicabilityid?municapility_id=10513`,

    filter_key: "q",
    label_key: "name",
    required: true,
    value_key: "id",

    onSelect(value, option, values, props) {
      const issuer_id = option.id || "";
      props.change("issuer_id", option.id);
    },
  },
  image_waseka: {
    label: "صورة وثيقة الملكية",
    placeholder: "select file",
    field: "simpleUploader",
    multiple: false,
    required: true,
    uploadUrl: `${host}/uploadMultifiles`,
    fileType: "image/*,.pdf",
    // name: "image",
    // path: SubAttachementUrl + "submission/identity_photo",
  },
  name_waseka: {
    label: "اسم وثيقة الملكية",
    placeholder: "من فضلك ادخل اسم وثيقة الملكية",
    required: true,
    permission: { show_match_value: { mlkya_type: "2" } },
  },
};
export const fa7s = {
  office_name: {
    label: "اسم  المكتب معد التقرير",
    placeholder: "من فضلك ادخل اسم المكتب معد التقرير ",
    required: true,
    // permission: { show_match_value: { mlkya_type: "2" } },
  },

  gohd: {
    label: "جهد التربة التصميمي كجم / سم٢",
    placeholder: "من فضلك ادخل جهد التربة التصميمي كجم / سم٢",
    digits: true,
    required: true,
  },
  depth: {
    label: "عمق التأسيس",
    placeholder: "من فضلك ادخل عمق التأسيس ",
    digits: true,
    required: true,
  },
  type: {
    required: true,
    label: "نوع التأسيس",
    placeholder: "من فضلك ادخل نوع التأسيس ",
    // digits: true,
  },
  over_all_down: {
    label: "الهبوط الكلي المسموح به",
    placeholder: "من فضلك ادخل الهبوط الكلي المسموح به",
    required: true,
    digits: true,
  },
  over_all_different: {
    required: true,
    label: "الهبوط المتفاوت المسموح به",
    placeholder: "من فضلك ادخل الهبوط المتفاوت المسموح به",
    digits: true,
  },
  depth_water: {
    required: true,
    label: "عمق منسوب المياة الجوفية",
    placeholder: "من فضلك ادخل عمق منسوب المياة الجوفية",
    digits: true,
  },
  recommendtion: {
    // required: true,
    label: "التوصيات الخاصة ببناء الموقع",
    placeholder: "من فضلك ادخل هنا التوصيات الخاصة ببناء الموقع",
    // digits: true,
    field: "textArea",
  },
};
export const plan_approval_fields = {
  1: motalbat_2,
  2: motalbat_1,
  3: wasekaFields,
  4: fa7s,
};
