
import { addedParcelMapServiceUrl, addFeaturesMapLayers } from "../../../../inputs/fields/identify/Component/mapviewer/config";

import { extraMapOperations } from "main_helpers/variables/mapOperations";

const _ = require("lodash");
export default {

    label: "اختيار مسار العمل",
    preSubmit(values, currentStep, props) {

        return new Promise(function (resolve, reject) {

            
            if (props.mainApp.editableFeatures &&
                props?.mainObject?.selectEditingWorkFlow?.selectWorkFlow?.workflowType != values?.selectWorkFlow?.workflowType) {

                props.setEditableFeatures(null);
            }

            return resolve(values);

        })

    },
    sections: {
        selectWorkFlow: {
            label: "إختيار مسار العمل",
            className: "radio_det",
            fields: {
                workflowTypes: {
                    label: "إختيار مسار العمل",
                    placeholder: "من فضلك اختر مسار العمل",
                    type: "input",
                    field: "select",
                    required: true,
                    name: "workflowType",
                    moduleName: "workflowTypes",
                    data: [
                        { label: "تعديل بيانات جغرافية", value: "edit" },
                        { label: "حذف بيانات جغرافية", value: "delete" },
                        { label: "تحديث الإحداثيات", value: "update_geo" }
                    ]
                }
            },
        },
    },
};
