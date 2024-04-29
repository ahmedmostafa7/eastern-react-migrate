import type from "app/helpers/modules/service/type";
// import printSetting from "app/helpers/modules/service/print_settings";
import Conditions from "app/helpers/modules/service/conditions";
import ownerData from "app/helpers/modules/owner";
import LandWithCoordinate from "app/helpers/modules/landcoord";
import IdentifyPublicLocation from "app/helpers/modules/publicLocation";
import SakData from "app/helpers/modules/skok";
import notes from "app/helpers/modules/imp_project/notes";
import Comment from "app/helpers/modules/comment";
import Committee from "app/helpers/modules/imp_project/committee";
import Maps from "app/helpers/modules/service/map";
import ApprovalGis_1 from "../tabs/approvalGis_1";
import ApprovalGis_2 from "../tabs/approvalGis_2.js";
import ApprovalGis_3 from "../tabs/approvalGis_3";
export const SERVICE_CREATE = {
  name: "service_create",
  module_id: 53,
  steps: {
    serviceSubmissionType: { ...type },
    ownerData: { ...ownerData },
    LandWithCoordinate: {
      ...LandWithCoordinate,
    },
    sakData: {
      ...SakData({
        search_params: {
          municapility_id:
            "wizard.mainObject.LandWithCoordinate.landData.lands.temp.mun",
        },
      }),
    },
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

export const SERVICE_REVIEW = {
  name: "Service_Review",
  module_id: 54,
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
    Conditions,
    LandWithCoordinate: { ...IdentifyPublicLocation },
    remark: { ...Comment },
  },
};
export const FINAL_SERVICE_REVIEW = {
  name: "project_review_service",
  module_id: 55,
  saved_before_print: true,
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
    Conditions: Maps,
    committee: { ...Committee(3) },
    remark: { ...Comment },
  },
};
export const approve_manager_gisservices_request_1 = {
  name: "approval_gis_1",
  module_id: 80,
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
    ApprovalGis_1: { ...ApprovalGis_1 },
  },
};
export const approve_planmanager_gisservices_request = {
  name: "approval_gis_2",
  module_id: 81,
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
    ApprovalGis_2: { ...ApprovalGis_2 },
  },
};
export const approve_assistant_planmanager_gisservices_request = {
  name: "approval_gis_3",
  module_id: 82,
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
    ApprovalGis_3: { ...ApprovalGis_3 },
  },
};
