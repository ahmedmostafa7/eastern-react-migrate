import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
import { convertToEnglish } from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
const _ = require("lodash");
export default {
  label: "بيانات الموقع",
  preSubmit(values, currentStep, props) {
    //return values

    return new Promise(function (resolve, reject) {
      if (
        values.landData &&
        !values.landData.submissionType &&
        props.record.workflows
      ) {
        values.landData.submissionType = props.record.workflows.name;
      }

      // if (values.landData && !values.landData.municipality_name) {
      //     values.landData.municipality_name = props.currentModule.record.workflows.name;
      // }

      if (values.parcel_desc) {
        delete values.parcel_desc;
      }
      if (
        values.landData &&
        (!values.landData.lands ||
          (values.landData.lands && !values.landData.lands.parcels.length))
      ) {
        message.error("من فضلك قم بإضافة الأرض");
        // throw "error in land selection"
        reject();
      } else if (_.isEmpty(values.landData.lands.parcelData)) {
        message.error("من فصلك ادخل مواصفات الأرض");
        // throw "error in land selection"
        reject();
      } else {
        values.landData.area = 0;
        values.landData.lands.parcels.forEach(function (val, key) {
          if (val.attributes.PARCEL_AREA || val.attributes.NEW_PARCEL_AREA) {
            values.landData.area += parseFloat(
              convertToEnglish(
                val.attributes.PARCEL_AREA || val.attributes.NEW_PARCEL_AREA
              )
            );
          }
        });
        resolve(values);
      }
    });
  },
  sections: {
    landData: {
      label: "بيانات الموقع",
      className: "radio_det",
      fields: {
        municipality_id: {
          moduleName: "Municipalities",
          label: "المدينة",
          placeholder: "من فضلك اختر المدينة",
          required: true,
          deps: ["values.lands"],
          field: "select",
          label_key: "name",
          value_key: "code",
          fetch: `${workFlowUrl}/api/Municipality`,
          selectChange: (val, rec, props) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });

            if (rec) {
              values.landData["municipality"] = rec;
              values.landData.CITY_NAME = rec.CITY_NAME_A || "";
              fetchData(
                `${workFlowUrl}/submunicipalityByMunicipality/${rec.code}`
              ).then((response) => {
                props.setSelector("subMunicipalities", {
                  label_key: "name",
                  value_key: "id",
                  data: response,
                  value: null,
                });
              });
            }
          },
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            console.log(values);
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
        },
        submunicipality_id: {
          moduleName: "subMunicipalities",
          label: "البلدية",
          placeholder: "من فضلك اختر البلدية",
          field: "select",
          deps: ["values.lands"],
          label_key: "name",
          value_key: "id",
          api_config: { params: { pageIndex: 1, pageSize: 1000 } },
          fetch: `${workFlowUrl}/api`,
          required: true,
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            console.log(values);
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
        },
        parcel_desc: {
          moduleName: "parcelDesc",
          required: true,
          label: "اسم / وصف الأرض",
          placeholder: "من فضلك ادخل اسم / وصف الأرض",
          field: "ctext",
          deps: ["values.lands"],
          textInputChanged: () => {},
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            console.log(values);
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
          getValue: () => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return get(values, "landData.parcel_desc", "");
          },
        },
        image_uploader: {
          label: "صورةالموقع العام (يجب أن يكون حجم الصورة 172*215)",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          deps: ["values.lands"],
          fileType: "image/*",
          multiple: false,
          required: true,
          // hideLabel: true,
          postRequest: (uploadedUrl, props) => {},
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            console.log(values);
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
        },
        lands: {
          moduleName: "selectedParcels",
          label: "بيانات الأرض",
          hideLabel: true,
          field: "SelectedParcels",
          className: "land_data",
          deps: ["values.image_uploader", "values.parcel_desc"],
          parcel_fields: ["PARCEL_PLAN_NO", "NEW_PARCEL_AREA"],
          parcel_fields_headers: [
            "اسم / وصف الأرض",
            "مساحة الأرض حسب وثيقة الملكية",
          ],
          action: (values, props, state) => {},
          multiple: false,
        },
        parcel_area: {
          moduleName: "parcelArea",
          label: "المساحة المستقطعة",
          placeholder: "من فضلك ادخل المساحة المستقطعة",
          field: "text",
          required: false,
        },
      },
    },
  },
};
