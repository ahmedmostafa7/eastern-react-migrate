import { printHost } from "imports/config";
import { postItem } from "app/helpers/apiMethods";
import { host, workFlowUrl } from "imports/config";
// import { plan_approval_fields } from "./reqFields";
import { get } from "lodash";
import { copyUser } from "../../../../../inputs/fields/identify/Component/common/common_func";
export default {
  label: "طباعة التقارير",
  sections: {
    takreers: {
      label: "طباعة التقارير",
      init_data: (values, props, fields) => {
        if (props.currentModule.id == 47) {
          let mainObject = props["mainObject"];
          let notes =
            " - طلب التخطيط مقدم من المالك مرفقا به صورة صك الملكية . \n - خطاب من الجهة التي صدر منها الصك ( كتابة العدل ) يفيد بسلامة وسريان مفعول صك الملكية وأساساته التي بني عليها وإنه مستكملة للإجراءات الشرعية والنظامية وأن استخراجها تم وفقا للأنظمة والتعليمات . \n - نسخة من الرفع المساحي للموقع معدا من قبل مكتب هندسي موضحا عليه الإحداثيات لكل أركان وزوايا الموقع وحدود الملكية حسب الصك ومطابقتها للطبيعة ، ومصدقا عليه من الجهة المختصة بالأمانة . \n - موافقة الجهة المختصة على تقرير دراسة فحص التربة للموقع . \n - موافقة وزارة الطاقة والصناعة والثروة المعدنية علي تخطيط الأرض . ";
          let notes_1 =
            " - خطوط التنظيم ، والمرحلة التي يقع بها بالنسبة للنطاق العمراني ، واشتراطات المرحلة ، والاستعمالات ، وأنظمة البناء . \n - البيانات الإحصائية للمخطط . \n - موافقة خطية من المالك على المخطط وإقرار بالتنازل عن التعويض في حالة الزيادة علي النسبة النظامية حسب التعميم الوزاري رقم ٥٤١٩١ وتاريخ ١٩ / ١١ / ١٤٢١ هـ .  ";
          let notes_2 =
            " - ثانيا : يبلغ أصل هذا القرار وصورتين مصدقتين من المخطط للإدارةالعامة للتخطيط العمراني لإستكـمال الإجراءات النظامية حيال اعتماده . \n - ثالثا : يبلغ صورة من هذا القرار وصورة من المخطط مع نسخة من كـامل أوراق المعاملة إلي المجلس البلدي وفقا للقرار الوزاري رقم ٦٠٧٧٨ / ص ز وتاريخ ١٠ / ٩ / ١٤٢٨ هـ";
          let text1 =
            " - ص / لمكتبنا \n - صورة للإدارة العامة للتخطيط العمراني للقيد رقم................. في ....... / ....... / .............. هـ \n - ص / للصادر العام \n - ص / للمهندس المختص ";
          let text2 =
            " - صورة لمكتبنا \n - صورة للإدارة العامة للتخطيط العمراني للقيد رقم-................. في ....... / ....... / .............. هـ \n - صورة للبلدية \n - صورة للمهندس المختص ";
          let text3 =
            " - صورة لمكتبنا \n - صورة للإدارة العامة للتخطيط العمراني للقيد رقم-................. في ....... / ....... / .............. هـ \n - صورة لإدارة نظم المعلومات الجغرافية \n - صورة لوحدة التدقيق والمتابعة لمخاطبة المجلس البلدي وتزويده بنسخة من كامل الأوراق \n - صورة للمهندس المختص ";
          setTimeout(() => {
            props.change("takreers.mol7zat_2", notes);
            props.change("takreers.mol7zat_1", notes_1);
            props.change("takreers.mol7zat_3", notes_2);
            props.change("takreers.debagh_text_area_1", text1);
            // props.change("takreers.debagh_text_area_2", text2);
            props.change("takreers.debagh_text_area_3", text3);
          }, 1000);
        }
      },
      fields: {
        selectMoralat: {
          field: "select",
          required: true,
          label: "اختر نوع الخطاب",
          label_key: "label",
          value_key: "value",
          data: [
            { label: "تحديد غرف توزيع الكهرباء بالمخطط", value: "1" },
            // { label: "خطاب المجلس البلدي", value: "2" },
            { label: "تقرير قرار الاعتماد الابتدائي", value: "3" },
          ],
          selectChange(value, option, values, props) {
            console.log("sss", value, option, values, props);

            if (!values.mainObject.takreers) {
              values.mainObject.takreers = {};
            }

            values.mainObject.takreers.select = value;
            // props.change("takreers.selectMoralat", value);
          },
          permission: {
            show_if_app_id_equal: { key: "currentModule.id", value: 47 },
          },
        },
        // mol7zat_2: {
        //   field: "textArea",
        //   required: true,
        //   rows: "8",
        //   label: "الملاحظات",
        //   permission: {
        //     hide_text: { key: "selectMoralat", value: "2" },
        //   },
        // },
        // mol7zat_1: {
        //   field: "textArea",
        //   required: true,
        //   rows: "8",
        //   label: "الملاحظات",
        //   permission: {
        //     hide_text: { key: "selectMoralat", value: "2" },
        //   },
        // },
        mol7zat_3: {
          field: "textArea",
          required: true,
          rows: "8",

          label: "الملاحظات",
          permission: {
            hide_text: { key: "selectMoralat", value: "3" },
            show_if_app_id_equal: { key: "currentModule.id", value: 47 },
          },
        },
        print_check: {
          label: "المراسلات",
          field: "boolean",
          hideLabel: true,
          permission: {
            show_if_app_id_equal: { key: "currentModule.id", value: 47 },
          },
        },
        debagh_text_area_1: {
          field: "textArea",
          required: true,
          rows: "8",

          label: "المراسلات",
          permission: {
            hide_text: { key: "selectMoralat", value: "1" },
            show_if_app_id_equal: { key: "currentModule.id", value: 47 },
          },
        },
        // debagh_text_area_2: {
        //   field: "textArea",
        //   required: true,
        //   rows: "8",

        //   label: "المراسلات",
        //   permission: {
        //     hide_text: { key: "selectMoralat", value: "2" },
        //   },
        // },
        debagh_text_area_3: {
          field: "textArea",
          required: true,
          rows: "8",

          label: "المراسلات",
          permission: {
            hide_text: { key: "selectMoralat", value: "3" },
            show_if_app_id_equal: { key: "currentModule.id", value: 47 },
          },
        },

        print_tawze3: {
          label: "خطاب تحديد غرف توزيع الكهرباء بالمخطط",
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);

              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];
              mainObject["takreers"] = {
                print_check: d["print_check"],
                text1: d["debagh_text_area_1"],
                // selectMoralat: d["print_check"],
              };

              mainObject["engUserNameToPrint"] = {
                engUserName: props.user.name,
                engUser: copyUser(props),
              };
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
                window.open(printHost + `/#/tawze3/${id}`, "_blank")
              );
            },
          },
        },
        // print_approval: {
        //   label: "خطاب المجلس البلدي",
        //   field: "button",
        //   className: "botnPrint",
        //   text: "طباعة",
        //   action: {
        //     type: "custom",
        //     action(props, d, stepItem) {
        //       console.log("po", stepItem, props);

        //       let id = stepItem["wizard"]["currentModule"]["record"].id;
        //       let mainObject = props["mainObject"];

        //       mainObject["engUserNameToPrint"] = {
        //         engUserName: props.user.name,
        //         engUser: props.user,
        //         // text1: d["debagh_text_area_2"],
        //       };
        //       mainObject["takreers"] = {
        //         print_check: d["print_check"],
        //         text1: d["debagh_text_area_2"],
        //         notes1: d["mol7zat_1"],
        //         notes: d["mol7zat_2"],
        //         // selectMoralat: d["print_check"],
        //       };

        //       const url = "/Submission/SaveEdit";
        //       const params = { sub_id: id };

        //       delete mainObject.temp;

        //       return postItem(
        //         url,
        //         { mainObject: mainObject, tempFile: {} },
        //         { params }
        //       ).then(() =>
        //         window.open(
        //           printHost + `/#/primary_approval_print/${id}`,
        //           "_blank"
        //         )
        //       );
        //     },
        //   },
        // },
        print_takrer_primary_approval: {
          label: "خطاب قرار الاعتماد الابتدائي",
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);

              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];

              mainObject["engUserNameToPrint"] = {
                engUserName: props.user.name,
                engUser: copyUser(props),
                // text1: d["debagh_text_area_3"],
              };
              mainObject["takreers"] = {
                print_check: d["print_check"],
                text1: d["debagh_text_area_3"],
                notes: d["mol7zat_3"],
                // selectMoralat: d["print_check"],
              };
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
                window.open(
                  printHost + `/#/takrer_primary_approval/${id}`,
                  "_blank"
                )
              );
            },
          },
        },
        print_takrer_supervision: {
          label: "خطاب الإشراف",
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);

              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];

              mainObject["engUserNameToPrint"] = {
                engUserName: props.user.name,
                engUser: copyUser(props),
                // text1: d["debagh_text_area_3"],
              };
              // mainObject["takreers"] = {
              //   print_check: d["print_check"],
              //   text1: d["debagh_text_area_3"],
              //   notes: d["mol7zat_3"],
              //   // selectMoralat: d["print_check"],
              // };
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
                window.open(
                  printHost + `/#/takrer_supervision_print/${id}`,
                  "_blank"
                )
              );
            },
          },
        },
      },
    },
  },
};
