import { message } from "antd";
export default {
  label: "موافقة المالك",
  preSubmit(values, currentStep, props) {
    //return values
    
    return new Promise(function (resolve, reject) {
      // let isFormValid = true;
      // values.submission_data = values.landData.lands.submission_data || {};
      if (values.owner_approval.acceptOrReject == 2) {
        reject();
      }
      // throw "error in land selection"
      else {
        // props.actionVals.className = "next";
        resolve(values);
      }
    });
  },
  sections: {
    owner_approval: {
      label: "موافقة المالك",
      type: "inputs",
      className: "radio_det",
      fields: {
        date: {
          label: "تاريخ المحضر",
          func: "get_date_ma7dar",
          deps: ["values"],
          field: "calculator",
        },
        meter_price: {
          label: " سعر المتر مربع",
          textAfter: "ريال",
          func: "get_meter_ma7dar",
          deps: ["values"],
          field: "calculator",
        },

        text_meter: {
          placeholder: "سعر المتر مربع بالحروف  ",
          label: "المتر بالحروف  ",
          func: "get_meter_letters_ma7dar",
          deps: ["values"],
          field: "calculator",
        },
        declaration: {
          label: "القيمة الاجمالية",
          field: "calculator",
          func: "get_total_ma7dar",
          deps: ["values"],
        },

        text_declaration: {
          placeholder: "القيمة الاجمالية بالحروف  ",
          label: "القيمة الاجمالية بالحروف  ",
          func: "get_total_letters_ma7dar",
          deps: ["values"],
          field: "calculator",
        },

        acceptOrReject: {
          field: "radio",
          initValue: "1",
          label: "موافقة المالك على سعر الزائدة",
          hideLabel: false,
          // permission: {
          //   hide_owner_approval: { key: "acceptOrReject", compare: "2" },
          // },
          options: {
            accept: {
              label: "موافق",
              value: "1",
              required: true,
            },
            reject: {
              label: "غير موافق ",
              value: "2",
            },
          },
          required: true,
        },
        details: {
          field: "textArea",
          label: "تفاصيل",
          hideLabel: false,
          required: true,
          permission: {
            show_if_value_has_includes: { key: "acceptOrReject", compare: "2" },
          },
          rows: "5",
        },
      },
    },
  },
};
