import { map, get, assign, isEmpty } from "lodash";
import { host } from "imports/config";
export default {
  label: "تحديد نوع الاستثمار",
  preSubmit(values, currentStep, props) {
    return new Promise((resolve, reject) => {
      return resolve(values);
    });
  },
  sections: {
    invest_type: {
      label: "تحديد نوع الاستثمار",
      className: "radio_det",
      fields: {
        investType: {
          label: "من فضلك اختر نوع الاستثمار",
          placeholder: "من فضلك اختر نوع الاستثمار",
          type: "input",
          field: "select",
          name: "investType",
          moduleName: "investType",
          data: [
            { label: "طرح موقع استثماري جديد", value: "newLocation" },
            { label: "إعادة طرح موقع استثماري", value: "updateLocation" },
          ],
          required: true,
          selectChange: (val, rec, props) => {
            //

            props.setSelector(
              "SelectedLayer",
              val == "newLocation"
                ? {
                    data: [
                      { label: "طبقة الأراضي", value: "Landbase_Parcel" },
                      {
                        label: "طبقة المواقع الاستثمارية",
                        value: "Invest_Site_Polygon",
                      },
                    ],
                  }
                : {
                    data: [
                      {
                        label: "طبقة المواقع الاستثمارية",
                        value: "Invest_Site_Polygon",
                      },
                    ],
                  }
            );

            if (val == "updateLocation") {
              props.change("invest_type.SelectedLayer", "Invest_Site_Polygon");
            }
          },
        },

        SelectedLayer: {
          label: "اختيار طبقة المواقع",
          placeholder: "من فضلك اختر طبقة المواقع",
          type: "input",
          field: "select",
          name: "SelectedLayer",
          moduleName: "SelectedLayer",
          data: [
            { label: "طبقة الأراضي", value: "Landbase_Parcel" },
            { label: "طبقة المواقع الاستثمارية", value: "Invest_Site_Polygon" },
          ],
          required: true,
          permission: {
            show_any: ["investType", "invest_type.investType"],
          },
        },
      },
    },
    contract_Data: {
      type: "inputs",
      label: "بيانات العقد",
      fields: {
        contractType: {
          moduleName: "contractType",
          // required: true,
          label: "حالة العقد",
          placeholder: "من فضلك اختر حالة العقد",
          field: "select",
          label_key: "name",
          value_key: "code",
          data: [
            // { code: "عقد قائم", name: "عقد قائم" },
            { code: "عقد ساري", name: "عقد ساري" },
            { code: "عقد منتهي", name: "عقد منتهي" },
            { code: "عقد مستعاد", name: "عقد مستعاد" },
            { code: "عقد مغلق", name: "عقد مغلق" },
          ],
        },
        contractNumber: {
          name: "contractNumber",
          label: "رقم العقد",
          // type: "number",
          // required: true,
        },
        contractStartDate: {
          name: "contractStartDate",
          label: "تاريخ بداية العقد",
          field: "hijriDatePicker",
          // required: true,
        },
        contractEndDate: {
          name: "contractEndDate",
          label: "تاريخ نهاية العقد",
          field: "hijriDatePicker",
          // required: true,
        },
        contractEnquiryRequestNo: {
          name: "contractEnquiryRequestNo",
          label: "رقم معاملة إدارة العقود",
          field: "number",
          // required: true,
        },
        contractEnquiryRequestDate: {
          name: "contractEnquiryRequestDate",
          label: "تاريخ معاملة إدارة العقود",
          field: "hijriDatePicker",
          // required: true,
        },
        investorName: {
          name: "investorName",
          label: "اسم المستثمر",
          // required: true,
        },
      },
      permission: {
        show_if_val_equal: {
          key: "invest_type.investType",
          value: "updateLocation",
        },
      },
    },
    site_data: {
      type: "inputs",
      label: "بيانات الموقع",
      fields: {
        site_status: {
          name: "siteStatus",
          label: "حالة الموقع",
          placeholder: "من فضلك اختر حالة الموقع",
          field: "select",
          required: true,
          label_key: "name",
          value_key: "code",
          data: [
            { code: "أرض فضاء", name: "أرض فضاء" },
            { code: "أرض مسورة", name: "أرض مسورة" },
            { code: "مبني قائم", name: "مبني قائم" },
          ],
        },
      },
    },
    approves: {
      type: "inputs",
      label: "المرفقات",
      fields: {
        global_approve_attachments: {
          label: "مرفقات",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: true,
          required: false,
        },
        // gov_approve_img: {
        //   label: "موافقة الوزارة",
        //   field: "simpleUploader",
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   fileType: "image/*,.pdf",
        //   multiple: false,
        //   required: false,
        // },
        // build_wekala_img: {
        //   label: "موافقة وكالة التعميير",
        //   field: "simpleUploader",
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   fileType: "image/*,.pdf",
        //   multiple: false,
        //   required: false,
        // },
        // service_wekala_img: {
        //   label: "موافقة وكالة الخدمات",
        //   field: "simpleUploader",
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   fileType: "image/*,.pdf",
        //   multiple: false,
        //   required: false,
        // },
      },
    },
  },
};
