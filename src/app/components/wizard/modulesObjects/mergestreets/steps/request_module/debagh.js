import { workFlowUrl, host } from "imports/config";
import { fetchData, postItem } from "app/helpers/apiMethods";
import { map, get } from "lodash";
import { printHost } from "imports/config";
export default {
  label: "محضر اللجنة الفنية",
  sections: {
    debagh: {
      label: "طباعة محضر اللجنة الفنية",
      fields: {
        // debagh_text_area: {
        //   field: "textArea",
        //   required: true,
        //   rows: "8",
        //   label: "دباجة طباعة محضر اللجنة الفنية",
        // },
        print_lagna: {
          label: "طباعة محضر اللجنة الفنية",
          field: "button",
          className: "botnPrint",
          text: "طباعة",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);
              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];
              // let edit_price = props["values"];
              // localStorage.setItem("edit_price", JSON.stringify(edit_price));
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
                window.open(printHost + `/#/lagnaA4/${id}`, "_blank")
              );
            },
          },
        },
      },
    },
  },
};
