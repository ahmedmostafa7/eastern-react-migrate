import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import store from "app/reducers";
import { map, get, assign, isEmpty } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import { mapUrl } from "../../../../../../components/inputs/fields/identify/Component/mapviewer/config/map";
import { esriRequest } from "../../../../../../components/inputs/fields/identify/Component/common/esri_request";
import {
  getInfo,
  queryTask,
  convertToEnglish,
} from "../../../../../../components/inputs/fields/identify/Component/common/common_func";
import {
  querySetting,
  selectDis,
} from "../../../../../../components/inputs/fields/identify/Component/farzIdentifyComponnent/Helpers";
import { getMap } from "main_helpers/functions/filters/state";
export default {
  label: "بيانات الأرض",
  preSubmit(values, currentStep, props) {
    return new Promise(function (resolve, reject) {
      const { t } = props;
      values.requestType = values.landData.lands.selectedRequestType;
      var isparcel = true;
      var parcelSymbols = [
        "س1",
        "س2",
        "س1-أ",
        "س1-أ/ص",
        "س1-ب",
        "س1-ب/ص",
        "س2-أ",
        "س2-أ/ص",
        "س2-ب",
        "س2-ب/ص",
        "س3-أ",
        "س3-أ/ص",
        "س3-ب",
        "س3-ب/ص",
        "ت-10",
        "ت-10/ص",
        "ت-12",
        "ت-12/ص",
        "ت-15",
        "ت-15/ص",
        "ت-2",
        "ت-2/ص",
        "ت-3",
        "ت-3/ص",
        "ت-5",
        "ت-5/ص",
        "ت1-أ",
        "ت1-أ/ص",
        "ت1-ب",
        "ت1-ب/ص",
        "ت2-أ",
        "ت2-أ/ص",
        "خ ت",
      ];

      if (values.landData) {
        values.landData.req_type = "";
        values.landData.sub_type = values.landData.lands.selectedRequestType;
        values.landData.area = 0;
        values.landData.isNonGis = true;
        values.landData.municipilty_code = values.landData.MUNICIPALITY;
        if (values.landData.lands.parcels) {
          var invalid = false;
          values.landData.lands.parcels.forEach(function (val, key) {
            if (val.attributes.PARCEL_AREA) {
              values.landData.area += parseFloat(
                convertToEnglish(val.attributes.PARCEL_AREA)
              );
            } else {
              invalid = true;
            }
          });

          if (invalid) {
            window.notifySystem("error", t("messages:ParcelArea"));
            return reject();
          }

          if (
            !window.Supporting ||
            (window.Supporting && !window.Supporting.OverArea)
          ) {
            if (
              values.landData.lands.parcels.length == 1 &&
              values.landData.area >= 10000
            ) {
              window.notifySystem("error", t("messages:allowedArea"));
              return reject();
            }
          }
        }
      }

      if (!values.landData) {
        window.notifySystem("error", t("messages:validboundries"));
        return reject();
      }

      var errorInParcelData = false;
      var invalid = false;
      if (values.landData.lands.parcels) {
        values.landData.lands.parcels.forEach(function (elem) {
          if (
            elem.attributes.USING_SYMBOL_CODE &&
            elem.attributes.PARCEL_AREA
          ) {
            if (elem.attributes.USING_SYMBOL_CODE && isparcel && !invalid) {
              if (
                parcelSymbols.indexOf(elem.attributes.USING_SYMBOL_CODE) == -1
              ) {
                invalid = true;
              }
            }
          } else {
            errorInParcelData = true;
            return;
          }
        });

        if (invalid) {
          window.notifySystem("error", t("messages:USINGSYMBOLCHECKERS"));
          return reject();
        }

        if (errorInParcelData) {
          window.notifySystem("error", t("messages:errorInParcelData"));
          return reject();
        }
      } else {
        return reject();
      }

      if (values.landData.lands.parcels && values.requestType) {
        if (
          values.requestType == 2 &&
          values.landData.lands.parcels.length <= 1
        ) {
          window.notifySystem("error", t("messages:validRequestTypes"));
          return reject();
        }
      } else {
        return reject();
      }

      if (
        values.landData.lands.parcels &&
        isEmpty(values.landData.lands.parcelData)
      ) {
        window.notifySystem(
          "error",
          t("messages:PARCELDESCRIPTIONANDBOUNDARIES")
        );
        return reject();
      }

      resolve(values);
    });
  },
  sections: {
    landData: {
      label: "بيانات الأرض",
      className: "radio_det",
      fields: {
        REQUEST_NO: {
          moduleName: "REQUEST_NO",
          required: true,
          label: "نوع المعاملة",
          placeholder: "من فضلك ادخل نوع المعاملة",
          field: "select",
          label_key: "name",
          value_key: "code",
          deps: ["values.lands"],
          data: [
            { code: 1, name: "فرز", key: "" },
            { code: 2, name: "دمج", key: "" },
            { code: 3, name: "تقسيم", key: "" },
          ],
          init: (props) => {
            if (!props.input.value) props.input.onChange(1);
          },
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
          selectChange: (value, rec, props) => {
            getInfo().then((res) => {
              esriRequest(mapUrl + "/" + res["Landbase_Parcel"]).then(
                (response) => {
                  let domainLists = {};
                  domainLists.usingSymbols = [];
                  domainLists.districtNames = [];
                  domainLists.SUB_MUNICIPALITY_NAME_Domains = [];
                  domainLists.cityNames = [];
                  response.fields.forEach(function (val) {
                    //;
                    if (val.name === "USING_SYMBOL") {
                      // list.push(val.domain);
                      val.domain.codedValues.forEach(function (domain) {
                        // ////
                        domainLists.usingSymbols.push(domain);
                      });
                    } else if (val.name === "DISTRICT_NAME") {
                      val.domain.codedValues.forEach(function (domain) {
                        // ////
                        domainLists.districtNames.push(domain);
                      });
                    } else if (val.name === "SUB_MUNICIPALITY_NAME") {
                      val.domain.codedValues.forEach(function (domain) {
                        // ////
                        domainLists.SUB_MUNICIPALITY_NAME_Domains.push(domain);
                      });
                    } else if (val.name === "CITY_NAME") {
                      val.domain.codedValues.forEach(function (domain) {
                        domainLists.cityNames.push(domain);
                      });
                    }
                  });

                  props.setSelector("lands", {
                    selectedRequestType: value,
                    domainList: domainLists,
                  });

                  const values = applyFilters({
                    key: "FormValues",
                    form: "stepForm",
                  });

                  values.landData.submissionType = rec.name;
                }
              );
            });
          },
        },
        MUNICIPALITY: {
          moduleName: "MUNICIPALITY",
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
                props.setSelector("SUB_MUNICIPALITY", {
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
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
        },
        SUB_MUNICIPALITY: {
          moduleName: "SUB_MUNICIPALITY",
          label: "البلدية",
          placeholder: "من فضلك اختر البلدية",
          field: "select",
          deps: ["values.lands"],
          label_key: "name",
          value_key: "id",
          api_config: { params: { pageIndex: 1, pageSize: 1000 } },
          fetch: `${workFlowUrl}/api`,
          //required: true,
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
        },
        PLAN_NO: {
          moduleName: "PLAN_NO",
          required: true,
          label: "رقم المخطط",
          placeholder: "من فضلك ادخل رقم المخطط",
          deps: ["values.lands"],
          field: "ctext",
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
        },
        DIVISION_NO: {
          moduleName: "DIVISION_NO",
          // required: true,
          label: "نوع التقسيم",
          placeholder: "من فضلك ادخل نوع التقسيم",
          field: "select",
          deps: ["values.lands"],
          label_key: "name",
          value_key: "code",
          init: (props) => {
            getInfo().then((res) => {
              esriRequest(mapUrl + "/" + res.Subdivision).then((response) => {
                props.setSelector("DIVISION_NO", {
                  data: response.fields[7].domain.codedValues.filter((item) => {
                    return item.code != 4;
                  }),
                  value: null,
                });
              });
            });
          },
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
        },
        DIVISION_DESCRIPTION: {
          moduleName: "DIVISION_DESCRIPTION",
          // required: true,
          label: "اسم التقسيم",
          deps: ["values.lands"],
          placeholder: "من فضلك ادخل اسم التقسيم",
          field: "ctext",
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
        },
        BLOCK_NO: {
          moduleName: "BLOCK_NO",
          //required: true,
          label: "رقم البلك",
          placeholder: "من فضلك ادخل رقم البلك",
          field: "ctext",
          deps: ["values.lands"],
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
          textInputChanged: (value, props, event) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });

            var whereClause = [];

            var mun = get(values, "landData.MUNICIPALITY", "");
            if (mun) whereClause.push(`MUNICIPALITY_NAME='${mun}'`);
            var submun = get(values, "landData.SUB_MUNICIPALITY", "");
            if (submun) whereClause.push(`SUB_MUNICIPALITY_NAME='${submun}'`);
            var planno = get(values, "landData.PLAN_NO", "");
            if (planno) whereClause.push(`PLAN_NO ='${planno}'`);

            whereClause.push(`BLOCK_NO='${value}'`);

            getInfo().then((LayerID) => {
              queryTask({
                ...querySetting(
                  LayerID.Survey_Block,
                  whereClause.join(" AND "),
                  false,
                  ["BLOCK_NO", "BLOCK_SPATIAL_ID"]
                ),
                callbackResult: (res) => {
                  if (res.features.length) {
                    values.landData.BLOCK_SPATIAL_ID =
                      res.features[0].attributes.BLOCK_SPATIAL_ID;
                  } else values.landData.BLOCK_SPATIAL_ID = 0;
                },
              });
            });
          },
        },
        DISTRICT_NO: {
          moduleName: "DISTRICT_NO",
          // required: true,
          label: "اسم الحي",
          placeholder: "من فضلك ادخل اسم الحي",
          field: "ctext",
          deps: ["values.lands"],
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
        },
        STREET_NO: {
          moduleName: "STREET_NO",
          // required: true,
          label: "اسم الشارع",
          placeholder: "من فضلك ادخل اسم الشارع",
          field: "ctext",
          deps: ["values.lands"],
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(get(values, "landData.lands.parcels.length", false));
          },
        },
        PARCEL_NO: {
          moduleName: "PARCEL_NO",
          // required: true,
          label: "رقم قطعة الأرض",
          placeholder: "من فضلك ادخل رقم قطعة الأرض",
          field: "ctext",
          deps: ["values.lands"],
          // disabled: (val) => {
          //   const values = applyFilters({
          //     key: "FormValues",
          //     form: "stepForm",
          //   });
          //   return Boolean(get(values, "landData.lands.parcels.length", false));
          // },
        },
        image_uploader: {
          label: "صورة الكروكي للوضع القائم",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*",
          multiple: false,
          required: true,
          deps: ["values.lands"],
        },
        PARCEL_IMAGE: {
          label: "صورة فوتوغرافية للأرض",
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*",
          multiple: false,
          required: true,
        },
        lands: {
          moduleName: "lands",
          label: "بيانات الأرض",
          field: "FarzParcels",
          deps: [
            "values.image_uploader",
            "values.PARCEL_NO",
            "values.MUNICIPALITY",
            "values.REQUEST_NO",
          ],
          className: "land_data",
          multiple: false,
          setReqType: (props) => {
            return "";
          },
          hideLabel: true,
        },
        VIOLATIONS: {
          label: "المخالفات",
          field: "textArea",
          rows: 4,
          maxLength: 100,
        },
      },
    },
  },
};
