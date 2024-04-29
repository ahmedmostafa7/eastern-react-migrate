import { workFlowUrl, SubAttachementUrl } from "imports/config";
import { host, host2 } from "imports/config";
import axios from "axios";
import { get } from "lodash";
import applyFilters from "main_helpers/functions/filters";
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
    field: "switchSelect",
    label: "الأراضي المختارة",
    placeholder: "الأراضي المختارة",
    required: true,
    disabled: (value, props) => {
      const values = applyFilters({
        key: "FormValues",
        form: "stepForm",
      });

      return values.waseka.sakType != 4 ? true : false;
    },
    moduleName: "selectedLands",
    init_data: (props) => {
      let {
        setSelector,
        values,
        input: { value, onChange },
      } = props;

      const vals = applyFilters({
        key: "FormValues",
        form: "stepForm",
      });

      let landNumbers =
        (vals.waseka.sakType == "4" &&
          Array.isArray(vals.waseka.waseka_data_select) &&
          vals.waseka.waseka_data_select.length &&
          vals.waseka.waseka_data_select.filter(
            (land) =>
              vals.waseka.table_waseka.filter(
                (sak) => sak.selectedLands == land
              ).length == 0
          )) ||
        vals.waseka.waseka_data_select;

      setSelector("selectedLands", {
        isMulti: Array.isArray(values.selectedLands),
        //initValue: value
        data: landNumbers,
      });

      onChange(landNumbers);
    },
  },
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
    //   postRequest: (props, response) => {
    //
    //     let deletedKeys;
    //     if (props.currentModule.record.workflow_id == 2128) {
    //       deletedKeys = Object.keys(response).filter((r) => +r != 211 && +r != 2928);
    //     }  else {
    //       deletedKeys = Object.keys(response).filter(
    //         (r) => +r == 211 || +r == 1968 || +r == 2928
    //       );
    //     }
    //     // else if (props.currentModule.record.workflow_id == 2241) {
    //     //   deletedKeys = Object.keys(response).filter((r) => +r != 2627);
    //     // } else if (
    //     //   [2261, 2262, 2263].indexOf(
    //     //     this.props.currentModule.record.workflow_id
    //     //   ) != -1
    //     // ) {
    //     //   deletedKeys = Object.keys(response).filter((r) => +r != 1253);
    //     // }

    //     deletedKeys.forEach((r) => {
    //       delete response[r];
    //     });
    //     return response;
    //   },
    filter_key: "q",
    label_key: "name",
    required: true,
    onSelect(value, option, values, props) {
      const issuer_id = option.id || "";
      props.change("issuer_id", option.id);
    },
  },
  image_waseka: {
    label: "صورة وثيقة الملكية",
    placeholder: "select file",
    field: "simpleUploader",
    multiple: true,
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
