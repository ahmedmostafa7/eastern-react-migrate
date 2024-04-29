import { mapSreenShot } from "../../components/inputs/fields/identify/Component/common/common_func";
import { message } from "antd";
export default {
  number: 2,
  label: "Land Data",
  preSubmit(values, currentStep, props) {
    //return values

    return new Promise(function (resolve, reject) {
      let isFormValid = true;
      values.submission_data = values.landData.lands.submission_data || {};
      if (values.submission_data) {
        Object.keys(values.submission_data).map((key, index) => {
          if (
            values.submission_data[key] == undefined ||
            values.submission_data[key] == "" ||
            values.submission_data[key] == 0
          ) {
            isFormValid = false;
          }
        });
      } else if (!values.submission_data) {
        isFormValid = false;
      }
      if (!values.landData || !values.landData.lands.parcels) {
        message.error("من فضلك قم بأختيار الأرض");
        // throw "error in land selection"
        reject();
      } else if (!isFormValid) {
        message.error("من فضلك قم بإكمال بيانات حدود الموقع حسب الصك");
        reject();
      } else {
        if (values.landData.lands.temp.map) {
          mapSreenShot(
            values.landData.lands.temp.map,
            (result) => {
              delete values.landData.lands.temp.map;
              //values.lands = values.landData.lands || {};
              values.submission_data.approvedUrl = result.value;

              // delete values.landData.lands;
              resolve(values);
            },
            () => {
              message.error("حدث خطأ - يرجي التواصل مع الدعم الفني");
              reject();
            },
            false, "landData"
          );
        } else {
          return resolve(values);
        }
      }
    });
  },
  //description: 'this is the Second Step description',
  sections: {
    landData: {
      label: "Land Data",
      type: "inputs",
      required: true,
      fields: {
        lands: {
          label: "بيانات الأرض",
          field: "Identify",
          className: "land_data",
        },
      },
    },
    akar_data: {
      label: "بيانات العقار",
      className: "parcelInfo",
      type: "inputs",
      fields: {
        loc_name: {
          label: "اسم الموقع",
        },
        desc: {
          label: "وصف العقار",
        },
        number: {
          label: "رقم المبني",
        },
        using: {
          label: "نوع الاستعمال",
        },
        price: {
          label: "القيمة التقديرية للموقع",
        },
      },
    },
    loc_data: {
      label: "بيانات الموقع",
      className: "parcelInfo",
      type: "inputs",
      fields: {
        loc_status: {
          label: "حالة الموقع",
        },
        request_no: {
          label: "رقم المعاملة المرتبطة",
        },
      },
    },
  },
};
