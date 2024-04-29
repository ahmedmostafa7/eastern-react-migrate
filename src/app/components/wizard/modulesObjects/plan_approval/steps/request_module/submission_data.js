import { host } from "imports/config";
import { get } from "lodash";
export default {
  label: "بيانات المعاملة",
  sections: {
    mostafed_data: {
      label: "بيانات المعاملة",

      fields: {
        mostafed_type: {
          required: true,
          placeholder: "من فضلك اختر نوع المستفيد",
          field: "select",
          showSearch: true,
          moduleName: "mostafedTypes",
          selectChange(selected, obj, props) {
            let d = [];
            let d1 = [
              // {
              //   id: "سكني",
              //   name: "سكني",
              // },
              // {
              //   id: "صناعي",
              //   name: "صناعي",
              // },
              {
                id: "حكومي",
                name: "حكومي",
              },
              {
                id: "استثماري",
                name: "استثماري",
              },
              {
                id: "تجاري",
                name: "تجاري",
              },
            ];
            let d2 = [
              {
                id: "سكني",
                name: "سكني",
              },
              {
                id: "صناعي",
                name: "صناعي",
              },
              {
                id: "زراعي",
                name: "زراعي",
              },
              {
                id: "تجاري",
                name: "تجاري",
              },
              {
                id: "خدمات عامة",
                name: "خدمات عامة",
              },
              {
                id: "مركز تجارة و أعمال",
                name: "مركز تجارة و أعمال",
              },
              {
                id: "أسواق جملة",
                name: "أسواق جملة",
              },
            ];
            if (selected == "حكومي") {
              props.setSelector("plan_use", { data: d1 });
            } else {
              props.setSelector("plan_use", { data: d2 });
            }
          },
          label_key: "label",
          value_key: "value",
          data: [
            {
              value: "حكومي",
              label: "حكومي",
            },
            {
              value: "خاص",
              label: "خاص",
            },
          ],
          init: (props) => {
            if (props.currentModule.record.app_id == 16) {
              props.input.onChange(
                ([2210, 2211].indexOf(props.currentModule.record.workflow_id) ==
                  -1 &&
                  props.user.engcompany_id &&
                  "خاص") ||
                  "حكومي"
              );
            }
          },
          disabled: (values, props) => {
            if (props.currentModule.record.app_id == 16) {
              return true;
            }
            return false;
          },
          label: "نوع المستفيد",
        },
        plan_type: {
          moduleName: "plan_type",
          label: "نوع المخطط",
          required: true,
          field: "radio",
          initValue: "1",
          className: "radio_plan_approval",
          options: [
            {
              label: "مخطط جديد",
              value: "1",
            },
            {
              label: "تعديل على مخطط",
              value: "2",
            },
          ],
        },
        plan_no: {
          moduleName: "plan_no",
          label: "رقم المخطط",
          placeholder: "من فضلك ادخل رقم المخطط",
          required: true,
          field: "text",
          permission: {
            show_match_value: { plan_type: "2" },
          },
        },
        mo5tat_use: {
          // permission: { show_match_value: { mostafed_type: "1" } },
          placeholder: "من فضلك اختر نوع استعمال المخطط",
          required: true,
          field: "select",
          showSearch: true,
          moduleName: "plan_use",
          label_key: "name",
          value_key: "id",
          // data: [
          //   { id: "حكومى", name: "حكومى" },
          //   { id: "حكومى", name: "حكومى" },
          // ],
          label: " استعمال المخطط",
        },
        e3adt_tanzem: {
          label: "إعادة تنظيم المخطط",
          field: "boolean",
        },
        // mo5tat_use_private: {
        //   permission: { show_match_value: { mostafed_type: "2" } },
        //   placeholder: "من فضلك اختر نوع استعمال المخطط",
        //   required: true,
        //   field: "select",
        //   showSearch: true,
        //   moduleName: "plan_use",
        //   label_key: "name",
        //   value_key: "id",
        //   data: [
        //     {
        //       id: "سكنى",
        //       name: "سكني",
        //     },
        //     {
        //       id: "صناعى",
        //       name: "صناعي",
        //     },
        //     {
        //       id: "زراعى",
        //       name: "زراعي",
        //     },
        //     {
        //       id: "خدمات عامة",
        //       name: "خدمات عامة",
        //     },
        //   ],
        //   label: " استعمال المخطط",
        // },
        use_sumbol: {
          label: "رمز الاستخدام",
          required: true,
          placeholder: "من فضلك ادخل رمز الاستخدام",
        },
        // sak_type: {
        //   moduleName: "sak_type",
        //   label: "نوع الصك",
        //   required: true,
        //   field: "radio",
        //   initValue: "1",
        //   className: "radio_plan_approval",
        //   options: [
        //     {
        //       label: "صك ورقي",
        //       value: "1",
        //     },
        //     {
        //       label: "صك الكتروني",
        //       value: "2",
        //     },
        //   ],
        //   permission: {
        //     show_match_value_props: ["currentModule.id", 25],
        //   },
        // },
        kroky_search: {
          field: "search",
          search_match: "eq",
          label: " البحث برقم الكروكي المساحي ",
          placeholder: "من فضلك ادخل رقم الكروكي المساحي",
          deps: ["values.kroky_search"],
          min: 2,
          url: `${host}/Submission/GetFirstMulitFilter?fake=`,
          filter_key: "request_no",
          label_key: "ssn",
          label_value: "ssn",
          params: {
            app_id: "8",
          },
          onSelect(value, option, values, props) {
            const owners = values.owners || {};
            props.change("mostafed_data.kroky_search", {
              ...owners,
              [option.id]: { ...option, main_id: option.id },
            });
          },
          permission: {
            hide_every: ["has_representer"],
          },
        },

        has_representer: {
          label: "غير مرتبط بكروكي مساحي",
          field: "boolean",
          defaultValue: false,
        },
        req_no: {
          label: " رقم المعاملة ",
          required: true,
          placeholder: "من فضلك ادخل رقم المعاملة",
          permission: {
            show_every: ["has_representer"],
          },
        },
        req_date: {
          label: " تاريخ المعاملة ",
          field: "hijriDatePicker",
          lessThanToday: true,
          required: true,
          placeholder: "من فضلك ادخل تاريخ المعاملة",
          permission: {
            show_every: ["has_representer"],
          },
        },
        req_location: {
          label: " جهة الإصدار  ",
          required: true,
          placeholder: "من فضلك ادخل جهة الإصدار",
          permission: {
            show_every: ["has_representer"],
          },
        },
        masarat: {
          label: "مسارات التنفيذ",
          className: "masarat",
          required: true,
          initValue: "1",
          field: "radio",
          options: [
            {
              label: " المسار الأول :-  إعتماد إبتدائي وإفراغ متدرج",
              value: "1",
            },
            {
              label:
                " المسار الثاني :- الإعتماد الإبتدائي والنهائي قبل التنفيذ",
              value: "2",
            },
            {
              label:
                " المسار الثالث :- الإعتماد الإبتدائي والنهائي وبيع جميع القطع قبل التنفيذ",
              value: "3",
            },
          ],
        },
      },
    },
  },
};
