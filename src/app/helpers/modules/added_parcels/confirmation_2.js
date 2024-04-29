import { host } from "imports/config";
import { printHost } from "imports/config";
import { sendEdits } from "app/components/wizard/components/stepContent/actions/actionFunctions/apiActions";
import { postItem, updateItem, fetchData } from "app/helpers/apiMethods";
// import {host} from 'configFiles/config'
export default {
  label: "مرئيات الاراضى و الممتلكات",
  sections: {
    notes_2: {
      label: "مرئيات الاراضى و الممتلكات",
      type: "inputs",
      fields: {
        acceptOrReject: {
          field: "radio",
          initValue: "1",
          label: "الموافقة على بيع الزائدة",
          hideLabel: false,
          options: {
            accept: {
              label: "يمكن بيعها",
              value: "1",
            },
            reject: {
              label: "عدم بيعها",
              value: "2",
            },
          },
          required: true,
        },

        details: {
          field: "textArea",
          label: "تفاصيل",
          hideLabel: false,
          rows: "5",
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
              mainObject["ma7dar"] = {
                ma7dar_mola5s: stepItem.form.stepForm.values["ma7dar_mola5s"],
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
                window.open(printHost + `/#/addedparcel_temp5/${id}`, "_blank")
              );
            },
          },
        },
        // attachment: {
        //   label: "نسخة من محضر اللجنة الفنية",

        //   field: "simpleUploader",
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   fileType: "image/*,.pdf",
        //   multiple: false,
        //   required: true,
        //   maxNumOfFiles: 1,
        // },
      },
    },
  },
};
