import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host } from "imports/config";
import applyFilters from "main_helpers/functions/filters";
import { map, get, assign } from "lodash";
export default {
  label: "محضر إعادة التقدير",
  sections: {
    ma7dar_mola5s: {
      label: "بيانات محضر إعادة التقدير",
      // className: "radio_det",
      init_data: (values, props, fields) => {
        const { mainObject } = props;
        //
        if (!mainObject?.e3adt_ma7dar) {
          let e3adt_ma7dar = mainObject?.ma7dar?.ma7dar_mola5s;
          setTimeout(() => {
            props.change(
              "ma7dar_mola5s.nice_price_check",
              e3adt_ma7dar?.nice_price_check || false
            );
            props.change("ma7dar_mola5s.date", e3adt_ma7dar?.date);
            props.change(
              "ma7dar_mola5s.meter_price",
              e3adt_ma7dar?.meter_price
            );
            props.change("ma7dar_mola5s.text_meter", e3adt_ma7dar?.text_meter);
            props.change("ma7dar_mola5s.zayda_area", e3adt_ma7dar?.zayda_area);
            props.change(
              "ma7dar_mola5s.shatfa_area",
              e3adt_ma7dar?.shatfa_area
            );
            props.change("ma7dar_mola5s.elc_area", e3adt_ma7dar?.elc_area);
            props.change(
              "ma7dar_mola5s.declaration",
              e3adt_ma7dar?.declaration
            );
            props.change(
              "ma7dar_mola5s.text_declaration",
              e3adt_ma7dar?.text_declaration
            );
            props.change(
              "ma7dar_mola5s.debagh_text",
              e3adt_ma7dar?.debagh_text
            );
            props.change("ma7dar_mola5s.attachment", e3adt_ma7dar?.attachment);
          }, 500);
        }
      },
      fields: {
        nice_price_check: {
          label: "سعر المتر مناسبا ولن يتم عمل محضر إعادة التقدير",
          field: "boolean",
        },
        date: {
          label: "تاريخ المحضر",
          field: "hijriDatePicker",
          lessThanToday: true,
          required: true,
          deps: ["values.nice_price_check"],
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(
              get(values, "ma7dar_mola5s.nice_price_check", false)
            );
          },
        },
        meter_price: {
          label: " سعر المتر مربع",
          textAfter: "ريال",
          digits: true,
          maxLength: 15,
          required: true,
          deps: ["values.nice_price_check"],
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(
              get(values, "ma7dar_mola5s.nice_price_check", false)
            );
          },
        },

        text_meter: {
          placeholder: "سعر المتر مربع بالحروف",
          label: "سعر المتر مربع بالحروف",
          required: true,
          deps: ["values.nice_price_check"],
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(
              get(values, "ma7dar_mola5s.nice_price_check", false)
            );
          },
        },
        zayda_area: {
          label: "مساحة الزائدة التنظيمية ",
          // hideLabel: true,
          field: "calculator",
          func: "total_price_zayda_area",
          deps: ["values"],
          values: "meter_price",
        },
        shatfa_area: {
          label: "مساحة الشطفة ",
          // hideLabel: true,
          field: "calculator",
          func: "shatfa_area",
          deps: ["values"],
          permission: {
            hide_if_value_is_zero: { key: "shatfa_area" },
          },
        },
        // zayda_area_after_shatfa: {
        //   label: "مساحة الزائدة التنظيمية بعد خصم الشطفة",
        //   // hideLabel: true,
        //   field: "calculator",
        //   func: "after_shatfa",
        //   deps: ["values"],

        //   permission: {
        //     hide_if_value_is_zero: { key: "zayda_area_after_shatfa" },
        //   },
        // },
        elc_area: {
          label: "مساحة غرفة الكهرباء ",
          // hideLabel: true,
          field: "calculator",
          func: "elc_area",
          deps: ["values"],

          permission: {
            hide_if_value_is_zero: { key: "elc_area" },
          },
        },
        declaration: {
          label: "القيمة الاجمالية",
          // hideLabel: true,
          field: "calculator",
          func: "total_price_zayda",
          deps: ["values"],
          values: "meter_price",
        },

        text_declaration: {
          placeholder: "القيمة الاجمالية بالحروف  ",
          label: "القيمة الاجمالية بالحروف  ",
          required: true,
          deps: ["values.nice_price_check"],
          disabled: (val) => {
            const values = applyFilters({
              key: "FormValues",
              form: "stepForm",
            });
            return Boolean(
              get(values, "ma7dar_mola5s.nice_price_check", false)
            );
          },
        },
        debagh_text: {
          field: "textArea",
          // required: true,
          rows: "8",
          // textEdit:"-حسب استمارة طلب شراء الزائدة الموقعة من سعادة مدير عام التخطيط العمراني بموجب خطاب رقم   بتاريخ  هـ المرفقة ضمن أوراق المعاملة -	وبعد دراسة الأوراق اتضح لأعضاء اللجنة أن المساحة الزائدة التنظيمية الشائعة المطلوب شرائها لا يمكن البناء عليها بشكل مستقل وتقع ضمن حدود خطوط التنظيم داخل أرض المواطن المذكور وليس في بيعها عليه ضرر على أحد وبناءا عليه يرى أعضاء اللجنة ان يتم بيع المساحة الزائدة المشار اليها بهذا المحضر على المواطن المذكور أعلاه",
          label: "دباجة محضر لجنة إعادة التقدير",
        },
        attachment: {
          label: "نسخة من محضر لجنة إعادة التقدير",

          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
          maxNumOfFiles: 1,
        },
        print_takder: {
          label: "طباعة محضر إعادة التقدير",
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);

              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];

              let edit_price = props["values"];
              localStorage.setItem("edit_price", JSON.stringify(edit_price));
              const url = "/Submission/SaveEdit";
              const params = { sub_id: id };

              delete mainObject.temp;

              return postItem(
                url,
                {
                  mainObject: window.lzString.compressToBase64(
                    JSON.stringify({ ...mainObject })
                  ),
                  tempFile: {},
                },
                { params }
              ).then(() =>
                window.open(printHost + `/#/addedparcel_temp3/${id}`, "_blank")
              );
            },
          },
        },

        print_parcel: {
          label: "طباعة كروكي بيانات الارض",
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);

              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];
              // mainObject["ma7dar"] = {
              //   ma7dar_mola5s: stepItem.form.stepForm.values["ma7dar_mola5s"],
              // };
              let edit_price = props["values"];
              localStorage.setItem("edit_price", JSON.stringify(edit_price));
              const url = "/Submission/SaveEdit";
              const params = { sub_id: id };

              delete mainObject.temp;

              return postItem(
                url,
                {
                  mainObject: window.lzString.compressToBase64(
                    JSON.stringify({ ...mainObject })
                  ),
                  tempFile: {},
                },
                { params }
              ).then(() =>
                window.open(printHost + `/#/addedparcel_temp5/${id}`, "_blank")
              );
            },
          },
        },
      },
    },
  },
};
