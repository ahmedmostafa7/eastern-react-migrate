// import {map} from 'lodash'
import type from "app/helpers/modules/imp_project/type";
import BuildingData from "app/helpers/modules/imp_project/building";
import admission from "app/helpers/modules/imp_project/admission";
import ownerData from "app/helpers/modules/owner";
import LandData from "app/helpers/modules/land";
import SakData from "app/helpers/modules/skok";
import Attachment from "app/helpers/modules/imp_project/attachment";
import Committee from "app/helpers/modules/imp_project/committee";
import Approvals, {
  approvalsSelect,
} from "app/helpers/modules/imp_project/approvals";
import notes from "app/helpers/modules/imp_project/notes";
import Comment from "app/helpers/modules/comment";

import defaultComp from "../../default";

export const Confirmation = {
  name: "confirm_zayda",
  module_id: 66,
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
    // newComp: { ...newComp },
    remark: { ...Comment },
  },
};
export const Confirmation_1 = {
  name: "confirm_zayda",
  module_id: 67,
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
    // newComp: { ...newComp },
    remark: { ...Comment },
  },
};
export const Confirmation_2 = {
  name: "confirm_zayda",
  module_id: 68,
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
    // newComp: { ...newComp },
    remark: { ...Comment },
  },
};
export const Confirmation_3 = {
  name: "confirm_zayda",
  module_id: 69,
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
    // newComp: { ...newComp },
    remark: { ...Comment },
  },
};
