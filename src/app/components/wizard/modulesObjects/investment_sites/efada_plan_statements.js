import { host } from "imports/config";
import { printHost } from "imports/config";
import { sendEdits } from "app/components/wizard/components/stepContent/actions/actionFunctions/apiActions";
import { postItem, updateItem, fetchData } from "app/helpers/apiMethods";
import { esriRequest } from "../../../inputs/fields/identify/Component/common";
import applyFilters from "main_helpers/functions/filters";
// import {host} from 'configFiles/config'
export default {
  label: "إفادة إدارة التخطيط العمراني",
  preSubmit(values, currentStep, props) {
    const { t } = props;
    return new Promise(function (resolve, reject) {
      if (
        values.efada_plan_statements.efada__suggested_activity == "2" &&
        !values?.efada_plan_statements?.site_activities?.length
      ) {
        window.notifySystem(
          "error",
          "يجب اختيار نشاط مقترح واحد على الأقل",
          10
        );
        return reject();
      }
      return resolve(values);
    });
  },
  sections: {
    efada_plan_statements: {
      init_data: (values, props, fields) => {
        let defaultSiteActivities =
          props.mainObject.landData.landData.lands.parcels
            .map((land) => land.attributes.SITE_ACTIVITY)
            .reduce((a, b) => {
              if (!a.find((r) => r == b)) {
                a.push(b);
              }

              return a;
            }, []);
        if (values?.efada_plan_statements) {
          values.efada_plan_statements.activities_list =
            (values?.efada_plan_statements?.activities_list?.length &&
              values?.efada_plan_statements?.activities_list.filter(
                (r) => defaultSiteActivities.indexOf(r.SITE_ACTIVITY) == -1
              )) ||
            [];

          setTimeout(() => {
            if (values.efada_plan_statements.efada__suggested_activity == "1") {
              props.change("efada_plan_statements.activities_list", [
                ...defaultSiteActivities.map((site) => ({
                  SITE_ACTIVITY: site,
                })),
                ...values.efada_plan_statements.activities_list,
              ]);
            } else {
              props.change("efada_plan_statements.activities_list", [
                ...values.efada_plan_statements.activities_list.filter(
                  (r) => defaultSiteActivities.indexOf(r.SITE_ACTIVITY) == -1
                ),
              ]);
            }
          }, 200);
        }
      },
      label: "إفادة إدارة التخطيط العمراني",
      type: "inputs",
      fields: {
        efada__suggested_activity: {
          field: "radio",
          initValue: "1",
          label: "إفادة إدارة التخطيط العمراني على النشاط المقترح",
          hideLabel: false,
          options: {
            accept: {
              label: "موافق",
              value: "1",
            },
            reject: {
              label: "مرفوض",
              value: "2",
            },
          },
          onClick: (evt, props) => {
            let defaultSiteActivities =
              props.mainObject.landData.landData.lands.parcels
                .map((land) => land.attributes.SITE_ACTIVITY)
                .reduce((a, b) => {
                  if (!a.find((r) => r == b)) {
                    a.push(b);
                  }

                  return a;
                }, []);
            const formValues = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            formValues.efada_plan_statements.activities_list =
              (formValues?.efada_plan_statements?.activities_list?.length &&
                formValues?.efada_plan_statements?.activities_list.filter(
                  (r) => defaultSiteActivities.indexOf(r.SITE_ACTIVITY) == -1
                )) ||
              [];

            if (evt.target.value == "1") {
              props.change("efada_plan_statements.activities_list", [
                ...defaultSiteActivities.map((site) => ({
                  SITE_ACTIVITY: site,
                })),
                ...formValues.efada_plan_statements.activities_list,
              ]);
            } else {
              props.change("efada_plan_statements.activities_list", [
                ...formValues.efada_plan_statements.activities_list,
              ]);
            }

            props.input.onChange(evt.target.value);
          },
          required: true,
        },

        notes: {
          field: "textArea",
          label: "ملاحظات على الإفادة",
          hideLabel: false,
          rows: "5",
        },
        site_activities: {
          name: "site_activities",
          moduleName: "site_activities",
          label: "النشاط المقترح",
          field: "multiSelect",
          init: (props) => {
            esriRequest(investMapUrl + "/" + 13).then((response) => {
              props.setSelector("site_activities", {
                data: response.fields[45].domain.codedValues,
              });
            });
          },
          label_key: "name",
          value_key: "name",
          onSelect: (results, props) => {
            let defaultSiteActivities =
              props.mainObject.landData.landData.lands.parcels
                .map((land) => land.attributes.SITE_ACTIVITY)
                .reduce((a, b) => {
                  if (!a.find((r) => r == b)) {
                    a.push(b);
                  }

                  return a;
                }, []);
            const formValues = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            let list = formValues.efada_plan_statements.activities_list
              .filter(
                (r) => defaultSiteActivities.indexOf(r.SITE_ACTIVITY) == -1
              )
              .filter((r) => results.indexOf(r.SITE_ACTIVITY) != -1);

            results.forEach((res) => {
              if (!list.find((r) => res == r.SITE_ACTIVITY)) {
                list.splice(list.length, 0, { SITE_ACTIVITY: res });
              }
            });

            if (
              formValues.efada_plan_statements.efada__suggested_activity == "1"
            ) {
              props.change("efada_plan_statements.activities_list", [
                ...defaultSiteActivities.map((site) => ({
                  SITE_ACTIVITY: site,
                })),
                ...list,
              ]);
            } else {
              props.change("efada_plan_statements.activities_list", [...list]);
            }
          },
        },
        activities_list: {
          field: "list",
          className: "modal-table",
          label: " النشاطات المقترحة",
          moduleName: "activities_list",
          fields: {
            SITE_ACTIVITY: {
              head: "النشاط المقترح",
            },
          },
          permission: { show_every: ["activities_list"] },
        },
        efadat: {
          field: "list",
          className: "modal-table",
          label: "efadat",
          moduleName: "efadat",
          fields: {
            option: {
              head: "إفادات إدارة التخطيط العمراني",
            },
            notes: {
              head: "ملاحظات على الإفادة",
            },
          },
          permission: { show_every: ["efadat"] },
        },
      },
    },
  },
};
