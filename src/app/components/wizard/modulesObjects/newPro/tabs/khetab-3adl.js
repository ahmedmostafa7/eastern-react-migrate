import { workFlowUrl, host } from "imports/config";
import { fetchData } from "app/helpers/apiMethods";
import { map, get } from "lodash";
import { postItem, updateItem } from "app/helpers/apiMethods";
import { printHost } from "imports/config";
export default {
  label: "خطاب كتابة العدل",
  sections: {
    khetab: {
      label: "خطاب كتابة العدل",
      // className: "radio_det",
      fields: {
        attachment: {
          label: " نسخة من خطاب كتابة العدل",

          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          required: true,
          maxNumOfFiles: 1,
        },
        print_1: {
          field: "button",
          label: "خطاب كتابة العدل",
          text: "طباعه",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];
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
                window.open(printHost + `/#/addedparcel_temp2/${id}`, "_blank")
              );
            },
          },
        },
      },
    },
  },
};
