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

export const IMP_PROJECT_CREATE = {
  name: "project_create_submission",
  module_id: 49,
  steps: {
    submissionType: { ...type },
    ownerData: { ...ownerData },
    landData: {
      ...LandData,
    },
    sakData: {
      ...SakData({
        search_params: {
          municapility_id: "wizard.mainObject.landData.landData.lands.temp.mun",
        },
      }),
    },
    building: { ...BuildingData },
    project_attachment: { ...Attachment },
    admission: { ...admission },
    approvalSubmissionNotes: { ...notes },
    summery: {
      number: 8,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
  },
};

export const IMP_COMMITTEE_NUMBER = {
  name: "project_create_submission",
  module_id: 50,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    committee: { ...Committee(3) },
    approvals_select: { ...approvalsSelect },
    remark: { ...Comment },
  },
};
export const IMP_ATTACHMENT = {
  name: "project_create_submission",
  module_id: 51,
  steps: {
    summery: {
      number: 1,
      label: "Summary",
      sections: {
        summery: {
          label: "Summary",
          type: "wizardSummery",
        },
      },
    },
    approvals: { ...Approvals },
    remark: { ...Comment },
  },
};
