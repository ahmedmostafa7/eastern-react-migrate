import { host, printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import main from "../../../../inputs/fields/calculator/main";
export default {
  label: "استمارة شراء زائدة",
  sections: {
    zayda_data: {
      className: "zayda_buy",
      label: "بيانات شراء زائدة",

      fields: {
        zayda_3aada: {
          label: "عائدة الزائدة",
          required: true,
        },
        zayda_mansh2: {
          label: "منشأ الزائدة",
          required: true,
        },
        radio1: {
          field: "radio",
          initValue: "1",
          required: true,
          label: "مدى ملائمة تلك الزائدة ",
          options: {
            suit: {
              label: "ملائمة",
              value: "1",
            },
            not_suit: {
              label: "غير ملائمة",
              value: "2",
            },
          },
        },
        text3: {
          label: "تفاصيل",
          placeholder: "تفاصيل",
          // required: true,
        },
        radio2: {
          field: "radio",
          initValue: "1",
          required: true,
          label: "خلوها من الشوائب و المنازعات ",
          options: {
            yes: {
              label: "يوجد",
              value: "1",
            },
            no: {
              label: " لا يوجد",
              value: "2",
            },
          },
        },
        text4: {
          label: "تفاصيل",
          placeholder: "تفاصيل",
          // required: true,
        },
        radio3: {
          field: "radio",
          initValue: "1",
          required: true,
          label: "هل يمكن البناء عليها بشكل منفرد؟ ",
          options: {
            suit: {
              label: "نعم",
              value: "1",
            },
            not_suit: {
              label: "لا",
              value: "2",
            },
          },
        },
        text5: {
          label: "لماذا؟",
          placeholder: "التفاصيل",
          // required: true,
        },

        radio4: {
          field: "radio",
          initValue: "1",
          // anotherField: true,
          required: true,
          label: "هل توجد منشأت قائمة عليها؟ ",
          options: {
            suit: {
              label: "نعم",
              value: "1",
            },
            not_suit: {
              label: "لا",
              value: "2",
            },
          },
        },
        text6: {
          label: "نوعها ؟",
          placeholder: "التفاصيل",
          // required: true,
        },
        radio5: {
          field: "radio",
          initValue: "1",
          required: true,
          label: " هل للزائدة استمرارية يمكن ان تكون تكملة لها؟",
          options: {
            suit: {
              label: "نعم",
              value: "1",
            },
            not_suit: {
              label: "لا",
              value: "2",
            },
          },
        },
        text7: {
          label: "تفاصيل",
          // required: true,
        },
        radio6: {
          field: "radio",
          initValue: "1",
          // anotherField: true,
          labelText: "التفاصيل",
          required: true,
          label:
            "هل المذكور هو المستفيد الوحيد من الزائدة وليس فى بيعها ضرر على احد ؟ ",
          options: {
            suit: {
              label: "نعم",
              value: "1",
            },
            not_suit: {
              label: "لا",
              value: "2",
            },
          },
        },
        text8: {
          label: "تفاصيل",
          // required: true,
        },
        services: {
          label: "الخدمات المتوفرة  بالزائده",
          field: "multiSelect",
          required: true,
          data: [
            { label: "انارة", value: "انارة" },
            { label: "شبكة صرف صحى", value: "شبكة صرف صحى" },
            { label: "شبكة الكهرباء", value: "شبكة الكهرباء" },
            { label: "شبكة الهاتف", value: "شبكة الهاتف" },
            { label: "تشجير", value: "تشجير" },
            { label: "طرق اسفلتية", value: "طرق اسفلتية" },
            { label: "اخرى", value: "اخرى" },
            { label: "لا توجد", value: "لا توجد" },
          ],
        },
        other_services: {
          placeholder: " خدمات اخرى ",
          label: "خدمات اخرى",
          permission: {
            show_if_value_has_includes: { key: "services", compare: "اخرى" },
          },
        },
        // print_takder: {
        //   label: "طباعة كروكي بيانات الارض",
        //   field: "button",
        //   className: "botnPrint",
        //   text: "طباعة",
        //   action: {
        //     type: "custom",
        //     action(props, d, stepItem) {
        //       console.log("po", stepItem, props);
        //
        //       let id = stepItem["wizard"]["currentModule"]["record"].id;
        //       let mainObject = props["mainObject"];

        //       let zayda = {
        //         buy_zayda: stepItem.form.stepForm.values["zayda_data"],
        //       };
        //       Object.assign(mainObject, zayda);

        //       const url = "/Submission/SaveEdit";
        //       const params = { sub_id: id };
        //       delete mainObject.temp;

        //       return postItem(
        //         url,
        //         { mainObject: mainObject, tempFile: {} },
        //         { params }
        //       ).then(() => {
        //         window.open(printHost + `/#/addedparcel_temp6/${id}`, "_blank");
        //       });
        //     },
        //   },
        // },
        print_parcel: {
          label: "طباعة استمارة شراء زائدة",
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);

              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];
              // mainObject["buy_zayda"] = {
              //   buy_zayda: stepItem.form.stepForm.values["zayda_data"],
              // };
              let zayda = {
                buy_zayda: stepItem.form.stepForm.values["zayda_data"],
              };
              let newObj = Object.assign({}, mainObject, zayda);
              const url = "/Submission/SaveEdit";
              const params = { sub_id: id };

              delete mainObject.temp;

              return postItem(
                url,
                {
                  mainObject: window.lzString.compressToBase64(
                    JSON.stringify({ ...newObj })
                  ),
                  tempFile: {},
                },
                { params }
              ).then(() =>
                window.open(printHost + `/#/addedparcel_temp6/${id}`, "_blank")
              );
            },
          },
        },
      },
    },
  },
};
