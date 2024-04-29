import { workFlowUrl, host } from "imports/config";
import { fetchData, postItem } from "app/helpers/apiMethods";
import { map, get } from "lodash";
import { printHost } from "imports/config";
import moment from "moment-hijri";
import { followUp } from "../../../../../../apps/modules/tabs/tableActionFunctions";
export default {
  label: "قرار معالى الامين ",
  sections: {
    karar_amin: {
      label: "بيانات قرار معالى الامين",
      // className: "radio_det",
      fields: {
        // date_krar: {
        //   field: "hijriDatePicker",
        //   lessThanToday: true,
        //   required: true,
        //   label: "تاريخ القرار",
        // },
        // num_krar: {

        //   required: true,
        //   label: "رقم القرار",
        // },
        attachment: {
          label: "نسخة من قرار معالي الأمين",

          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          // required: true,
          maxNumOfFiles: 1,
          permission: {
            show_if_app_id_equal: { key: "currentModule.id", value: 68 },
          },
        },
        print_1: {
          field: "button",
          label: "طباعة القرار",
          text: "طباعه",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              // window.location.href = printHost + "/#/addedparcel_temp1";
              let id = stepItem["wizard"]["currentModule"]["record"].id;
              followUp({ id: id }, 0, {}, null, false, props).then((res) => {
                let aminStep =
                  res?.prevSteps?.[
                    res?.prevSteps?.findLastIndex(
                      (step) =>
                        step?.name?.indexOf("أمين المنطقة الشرقية") != -1
                    )
                  ];

                let mainObject = props["mainObject"];
                let hijDate = aminStep?.date || moment().format("iYYYY/iM/iD");
                mainObject["krar_amin"] = {
                  karar_amin: stepItem.form.stepForm.values["karar_amin"],
                  karar_amin_date: hijDate,
                };
                mainObject["karar_amin_date"] = hijDate;
                const url = "/Submission/SaveEdit";
                const params = { sub_id: id };
                delete mainObject.temp;

                postItem(
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
                    printHost + `/#/addedparcel_temp1/${id}`,
                    "_blank"
                  )
                );
              });
            },
          },
        },
      },
    },
  },
};
