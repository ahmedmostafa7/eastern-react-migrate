import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { reformatNumLetters } from "../../../../inputs/fields/identify/Component/common/common_func";
import { toArabicWord } from "number-to-arabic-words/dist/index-node.js";
export default {
  label: "محضر تقدير",
  sections: {
    ma7dar_mola5s: {
      label: "بيانات محضر التقدير",
      className: "radio_det",
      fields: {
        date: {
          field: "hijriDatePicker",
          lessThanToday: true,
          required: true,
          label: "تاريخ المحضر",
        },
        meter_price: {
          label: " سعر المتر مربع",
          textAfter: "ريال",
          field: "text",
          digits: true,
          maxLength: 15,
          required: true,
          onChangeInput: (props, evt) => {
            debugger;
            let val = evt.target.value;
            if (val) {
              if (val?.match(/[+-]?\d+(\.\d+)?/g)) {
                props.change(
                  "ma7dar_mola5s.text_meter",
                  reformatNumLetters(
                    toArabicWord(
                      val.match(/[+-]?\d+(\.\d+)?/g)?.[0]?.toString()
                    ),
                    "ريال"
                  )
                );
              }
            }
          },
        },

        text_meter: {
          placeholder: "سعر المتر مربع بالحروف",
          label: "سعر المتر مربع بالحروف",
          required: true,
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
          totalChange: (props, val) => {
            debugger;
            if (val) {
              if (val?.match(/[+-]?\d+(\.\d+)?/g)) {
                props.change(
                  "ma7dar_mola5s.text_declaration",
                  reformatNumLetters(
                    toArabicWord(
                      val.match(/[+-]?\d+(\.\d+)?/g)?.[0]?.toString()
                    ),
                    "ريال"
                  )
                );
              }
            }
          },
        },

        text_declaration: {
          placeholder: "القيمة الاجمالية بالحروف  ",
          label: "القيمة الاجمالية بالحروف  ",
          required: true,
        },
        debagh_text: {
          field: "textArea",
          // required: true,
          rows: "8",
          // textEdit:"-حسب استمارة طلب شراء الزائدة الموقعة من سعادة مدير عام التخطيط العمراني بموجب خطاب رقم   بتاريخ  هـ المرفقة ضمن أوراق المعاملة -	وبعد دراسة الأوراق اتضح لأعضاء اللجنة أن المساحة الزائدة التنظيمية الشائعة المطلوب شرائها لا يمكن البناء عليها بشكل مستقل وتقع ضمن حدود خطوط التنظيم داخل أرض المواطن المذكور وليس في بيعها عليه ضرر على أحد وبناءا عليه يرى أعضاء اللجنة ان يتم بيع المساحة الزائدة المشار اليها بهذا المحضر على المواطن المذكور أعلاه",
          label: "دباجة محضر لجنة التقدير",
        },
        attachment: {
          label: "نسخة من محضر لجنة التقدير",

          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
          maxNumOfFiles: 1,
        },
        print_takder: {
          label: "طباعة محضر التقدير",
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
