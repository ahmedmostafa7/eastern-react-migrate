// import {map} from 'lodash'
import notes from "app/helpers/modules/imp_project/notes";
import editUpdateCreate from "../wizard/editUpdateCreate";
import locationData from "../wizard/locationData";
import mapEditFeatures from "../wizard/mapEditFeatures";
import selectEditingWorkFlow from "../wizard/selectEditingWorkFlow";
import showMapEdits from "../wizard/showMapEdits";

export const UPDATE_BASEMAp_CREATE = {
  name: "create_request",
  module_id: 95,
  steps: {
    locationData: { ...locationData },
    mapEditFeatures: { ...mapEditFeatures },
    approvalSubmissionNotes: { ...notes },
    summery: {
      number: 1,
      label: "Summery",
      sections: {
        summery: {
          label: "Summery",
          type: "wizardSummery",
        },
      },
    },
  },
};

export const EDIT_BASEMAp_CREATE = {
  name: "edit_request",
  module_id: 86,
  steps: {
    selectEditingWorkFlow: { ...selectEditingWorkFlow },
    editUpdateCreate: { ...editUpdateCreate },
    approvalSubmissionNotes: { ...notes },
    summery: {
      number: 1,
      label: "Summery",
      sections: {
        summery: {
          label: "Summery",
          type: "wizardSummery",
        },
      },
    },
  },
};

export const finish_BASEMAp_CREATE = {
  name: "finish_request",
  module_id: 102,
  steps: {
    summery: {
      number: 1,
      label: "Summery",
      sections: {
        summery: {
          label: "Summery",
          type: "wizardSummery",
        },
      },
    },
    showMapEdits: { ...showMapEdits },
  },
};
