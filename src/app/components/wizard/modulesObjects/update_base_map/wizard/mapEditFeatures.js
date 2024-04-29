
import { addedParcelMapServiceUrl, addFeaturesMapLayers } from "../../../../inputs/fields/identify/Component/mapviewer/config";

import { extraMapOperations } from "main_helpers/variables/mapOperations";

const _ = require("lodash");
export default {

    label: "مراجعة بيانات المواقع",
    preSubmit(values, currentStep, props) {

        return new Promise(function (resolve, reject) {

            let mandatoryFields = addFeaturesMapLayers[props.mainApp.uploadFileDetails.layerName].outFields.filter((x) => x.isMandatory);

            values.editableFeatures = [...props.mainApp.editableFeatures];

            if (values.editableFeatures.length == 0) {
                window.notifySystem("error", "لا توجد بيانات مدخلة");
                return reject();
            }

            mandatoryFields.forEach((field) => {
                if (values.editableFeatures.find((feature) => {
                    return !feature.attributes[field.name]
                })) {
                    window.notifySystem("error", "يجب إدخال " + field.arName);
                    return reject();
                }
            });

            return resolve(values);
        })

    },
    sections: {
        mapEditFeatures: {
            label: "مراجعة بيانات المواقع",
            className: "radio_det",
            fields: {
                mapviewer: {
                    label: "طبقات الخريطة",
                    moduleName: "mapviewer",
                    field: "msa7yData",
                    zoomfactor: 25,
                    activeHeight: false,
                    cad: {},
                    baseMapUrl: addedParcelMapServiceUrl,
                    enableDownloadCad: false,
                    hideLabel: true,
                    fullMapWidth: true,
                    operations: []
                },
                editFeaturesTable: {
                    moduleName: "mapviewer",
                    label: "",
                    field: "editFeaturesTable",
                },
            },
        },
    },
};
