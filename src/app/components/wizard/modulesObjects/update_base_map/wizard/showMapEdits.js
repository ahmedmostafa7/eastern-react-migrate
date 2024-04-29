
import { addedParcelMapServiceUrl, addFeaturesMapLayers } from "../../../../inputs/fields/identify/Component/mapviewer/config";

import { selectionMapOperations } from "main_helpers/variables/mapOperations";

const _ = require("lodash");
export default {

    label: "بيانات المعاملة",
    preSubmit(values, currentStep, props) {

        return new Promise(function (resolve, reject) {
            
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
                    label: "",
                    field: "showMapEdits",
                    zoomfactor: 25,
                    activeHeight: false,
                    operations: [],
                    cad: {},
                    baseMapUrl: addedParcelMapServiceUrl,
                    enableDownloadCad: false,
                },
            },
        },
    },
};
