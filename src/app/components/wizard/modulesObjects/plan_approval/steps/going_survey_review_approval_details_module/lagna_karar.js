import { printHost } from "imports/config";
import { postItem, fetchData } from "app/helpers/apiMethods";
import { host } from "imports/config";
import { followUp } from "../../../../../../../apps/modules/tabs/tableActionFunctions/tableActions";
import store from "app/reducers";
import { map, get, assign } from "lodash";
import { message } from "antd";
import applyFilters from "main_helpers/functions/filters";
const _ = require("lodash");
import { saveEditsًWithoutPopup } from "../../../../components/stepContent/actions/actionFunctions/common";
import { setPlanDefaults } from "../../../../../../../apps/modules/tabs/tableActionFunctions/mappingObjects/plan_approval/planDefaults";
import { copyUser } from "../../../../../inputs/fields/identify/Component/common/common_func";
// import {} from '../../../../../../../'
export default {
  label: "قرار اللجنة الفنية",
  // preSubmit(values, currentStep, props) {
  //     return new Promise(function (resolve, reject) {
  //
  //         resolve(values);
  //     });
  // },
  sections: {
    lagna_karar: {
      label: "قرار اللجنة الفنية",
      type: "inputs",
      fields: {
        plans: {
          moduleName: "plans",
          label: "اختيار المخطط الأمثل",
          required: true,
          field: "radio",
          //initValue: "perfectCad",
          className: "radio_plan_approval",
          disabled: (val, props) => {
            ////
            return [87, 84].indexOf(props.currentModule.id) != -1;
          },
          init: (scope) => {
            if (scope.props) {
              //const { mainObject } = props;
              var opts = [];
              map(
                scope.props.mainObject.plans.plansData.planDetails
                  .uplodedFeatures,
                (plan, index) => {
                  if (plan) {
                    var currentPlan =
                      index == 0
                        ? "perfectCad"
                        : index == 1
                        ? "secondCad"
                        : "thirdCad";
                    opts.push({
                      label: `cadData:${currentPlan}`,
                      value: currentPlan,
                    });
                  }
                }
              );

              scope.props.setSelector("plans", {
                options: opts,
              });
            }
          },
          permission: {
            show_if_app_id_equal: { key: "currentModule.id", value: 42 },
          },
        },
        planStatus: {
          moduleName: "planStatus",
          label: "",
          required: true,
          field: "radio",
          hideLabel: true,
          initValue: "1",
          className: "radio_plan_approval",
          disabled: (val, props) => {
            ////
            return [87, 84].indexOf(props.currentModule.id) != -1;
          },
          permission: {
            show_if_app_id_equal: { key: "currentModule.id", value: 42 },
          },
          options: [
            {
              label: "REJECTION_AND_RETURN_ACTION",
              value: "1",
              actions: [3],
            },
            {
              label: "ACCEPTANCE_ACTION",
              value: "2",
              actions: [1, 6],
            },
          ],
        },
        // karar_attachment: {
        //   moduleName: "karar_attachment",
        //   label: "مرفق",
        //   // required: true,
        //   field: "simpleUploader",
        //   uploadUrl: `${host}/uploadMultifiles`,
        //   multiple: false,
        //   permission: {
        //     show_match_value: { planStatus: "2" },
        //     show_if_app_id_equal: { key: "currentModule.id", value: 42 },
        //   },
        // },
        suggested_plan_image: {
          label: "صورة المخطط المقترح موقع من أعضاء اللجنة الفنية",
          field: "simpleUploader",
          required: true,
          uploadUrl: `${host}/uploadMultifiles`,
          fileType: "image/*,.pdf",
          multiple: false,
          preRequest: (props) => {},
          postRequest: (uploadedUrl, props) => {},
          permission: {
            show_match_value: { planStatus: "2" },
            // show_if_app_id_equal: { key: "currentModule.id", value: 87 },
            show_if_app_id_equal: { key: "currentModule.id", value: 84 },
          },
        },
        karar_attachment_signatures: {
          moduleName: "karar_attachment",
          label: "مرفق محضر اللجنة الفنية",
          required: true,
          field: "simpleUploader",
          uploadUrl: `${host}/uploadMultifiles`,
          multiple: false,
          permission: {
            show_match_value: { planStatus: "2" },
            // show_if_app_id_equal: { key: "currentModule.id", value: 87 },
            show_if_app_id_equal: { key: "currentModule.id", value: 84 },
          },
        },
        plan_number: {
          moduleName: "plan_number",
          label: "رقم المخطط",
          placeholder: "من فضلك ادخل رقم المخطط",
          required: true,
          field: "text",
          disabled: (val, props) => {
            ////
            return [87, 84].indexOf(props.currentModule.id) != -1;
          },
          permission: {
            show_match_value: { planStatus: "2" },
            show_if_app_id_equal: { key: "currentModule.id", value: 42 },
          },
        },
        plan_name: {
          moduleName: "plan_name",
          label: "اسم المخطط",
          placeholder: "من فضلك ادخل اسم المخطط",
          required: true,
          field: "text",
          disabled: (val, props) => {
            ////
            return [87, 84].indexOf(props.currentModule.id) != -1;
          },
          permission: {
            show_match_value: { planStatus: "2" },
            show_if_app_id_equal: { key: "currentModule.id", value: 42 },
          },
        },
        ma7dar_lagna_no: {
          moduleName: "ma7dar_lagna_no",
          label: "رقم محضر اللجنة الفنية",
          placeholder: "من فضلك ادخل رقم محضر اللجنة الفنية",
          required: true,
          field: "text",
          init_data: (props) => {
            let reqNo = props.currentModule.record.request_no;
            props.input.onChange(props.input.value || reqNo);
          },
          disabled: true,
          permission: {
            show_match_value: { planStatus: "2" },
          },
        },
        ma7dar_lagna_date: {
          moduleName: "ma7dar_lagna_date",
          label: "تاريخ محضر اللجنة الفنية",
          placeholder: "من فضلك ادخل تاريخ محضر اللجنة الفنية",
          required: true,
          field: "hijriDatePicker",
          init_data: (props) => {
            if ([87, 84].indexOf(props.currentModule.id) != -1) {
              followUp(
                { ...props.currentModule.record },
                0,
                {},
                null,
                false,
                props
              ).then((res) => {
                let signatures = res?.prevSteps?.filter(
                  (steps) =>
                    // [2934, 2771, 2933, 2767, 3103, 3104].indexOf(
                    //   steps?.prevStep?.id
                    // ) != -1
                    [2851, 2771, 2850, 2767, 3103, 3104].indexOf(
                      steps?.prevStep?.id
                    ) != -1
                );
                if (signatures.length) {
                  //
                  props.input.onChange(
                    props.input.value ||
                      signatures?.[signatures.length - 1]?.date
                        .split("/")
                        .reverse()
                        .join("/")
                  );
                }
              });
            }
          },
          disabled: (val, props) => {
            ////
            return [87, 84].indexOf(props.currentModule.id) != -1;
          },
          permission: {
            show_match_value: { planStatus: "2" },
            show_if_app_id_equal: { key: "currentModule.id", value: 87 },
            show_if_app_id_equal: { key: "currentModule.id", value: 84 },
          },
        },
        notes: {
          moduleName: "notes",
          label: "ملاحظات",
          placeholder: "من فضلك ادخل هنا الملاحظات",
          field: "textArea",
          disabled: (val, props) => {
            ////
            return [87, 84].indexOf(props.currentModule.id) != -1;
          },
          rows: "8",
          permission: {
            show_match_value: { planStatus: "2" },
            show_if_app_id_equal: { key: "currentModule.id", value: 42 },
          },
        },
        ma7dar_report: {
          field: "button",
          hideLabel: true,
          text: "تقرير محضر اللجنة الفنية",
          action: {
            type: "custom",
            action(props, d, stepItem) {
              console.log("po", stepItem, props);

              let id = stepItem["wizard"]["currentModule"]["record"].id;
              let mainObject = props["mainObject"];
              mainObject["lagna_karar"] = {
                lagna_karar: stepItem.form.stepForm.values["lagna_karar"],
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
                window.open(printHost + `/#/karar_lagna_print/${id}`, "_blank")
              );
            },
          },
          permission: {
            show_match_value: { planStatus: "2" },
          },
        },
      },
    },
  },
};
