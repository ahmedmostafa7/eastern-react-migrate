
import { addedParcelMapServiceUrl, addFeaturesMapLayers } from "../../../../inputs/fields/identify/Component/mapviewer/config";

import { selectionMapOperations } from "main_helpers/variables/mapOperations";

const _ = require("lodash");
export default {

    label: "بيانات المعاملة",
    preSubmit(values, currentStep, props) {

        return new Promise(function (resolve, reject) {
            values.editableFeatures = {};

            if (props.mainApp.editableFeatures) {
                values.editableFeatures = { ...props.mainApp.editableFeatures };
                values.originalFeatures = { ...props.mainApp.originalFeatures };
            }

            if (Object.keys(values.editableFeatures).length == 0) {
                window.notifySystem("error", "لا توجد بيانات مدخلة");
                return reject();
            }
            else {
                let includeFeature = false;

                Object.keys(values.editableFeatures).forEach((layer) => {
                    if (values.editableFeatures[layer]?.features?.length > 0) {
                        includeFeature = true;
                    }
                })

                if (!includeFeature) {

                    window.notifySystem("error", "لا توجد بيانات مدخلة");
                    return reject();

                }
            }

            return resolve(values);
        })

    },
    sections: {
        mapEditFeatures: {
            label: "بيانات المعاملة",
            className: "radio_det",
            fields: {
                mapviewer: {
                    moduleName: "lands",
                    label: "بحث عن موقع",
                    field: "editUpdateFilter",
                    className: "land_data",
                    zoomfactor: 25,
                    activeHeight: false,
                    operations: [],
                    cad: {},
                    baseMapUrl: addedParcelMapServiceUrl,
                    enableDownloadCad: false,
                    ...selectionMapOperations,
                },
            },
        },
    },
};
