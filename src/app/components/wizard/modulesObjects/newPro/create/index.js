// import {map} from 'lodash'
import ownerData from "app/helpers/modules/owner_windows";
import LandData from "../tabs/landData";
import SakData from "app/helpers/modules/skok";
import suggestParcel from "app/helpers/modules/suggestParcel";

import updateMap from "app/helpers/modules/updateMap";
import notes from "app/helpers/modules/imp_project/notes_windows";
import Comment from "app/helpers/modules/comment";
import confirmation from "app/helpers/modules/added_parcels/confirmation";
import confirmation_1 from "app/helpers/modules/added_parcels/confirmation_1";
import confirmation_3 from "app/helpers/modules/added_parcels/confirmation_3";
import confirmation_2 from "app/helpers/modules/added_parcels/confirmation_2";
import BuyZayda from "../tabs/buy_zayda";
import Ma7dar from "../tabs/ma7dar";
import sakData from "../tabs/waseka";
import e3adt_Ma7dar from "../tabs/e3adt_ma7dar";
import PrintCreate from "../tabs/printCreate";
import krar_amin from "../tabs/karar_amin";
import owner_approval from "../tabs/owner_approval";
import khetab from "../tabs/khetab-3adl";
import landBound from "../tabs/land-bound.js";
import debagh from "../tabs/debagh";
// import debagh2 from "../tabs/debagh2";
export const New_PROJECT_CREATE = {
  name: "create_addedparcels",
  module_id: 64,
  steps: {
    ownerData: { ...ownerData },
    landData: {
      ...LandData,
    },
    sakData: sakData,
    // sakData: { ...SakData({
    //   search_params: {
    //     municapility_id:
    //       "wizard.mainObject.landData.landData.lands.temp.mun",
    //   },
    // }) },
    suggestParcel: { ...suggestParcel },

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
export const updateMapF = {
  name: "updatemap_addedparcels",
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
    updateMap: { ...updateMap },
  },
};
export const BUY_ZAYDA = {
  name: "project_buyZayda",
  module_id: 65,
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
    buy_zayda: { ...BuyZayda },

    remark: { ...Comment },
  },
};
export const New_PROJECT_CONFIIRM = {
  name: "confirm_addedparcels",
  module_id: 66,
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
    sellingConfirmation: { ...confirmation },
    remark: { ...Comment },
  },
};
export const New_PROJECT_CONFIIRM_1 = {
  name: "confirm_addedparcel_plan",
  module_id: 70,
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
    sellingConfirmation_2: { ...confirmation_1 },
    remark: { ...Comment },
  },
};
export const New_PROJECT_CONFIIRM_3 = {
  name: "confirm_addedparcels_survey",
  module_id: 85,
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
    sellingConfirmation_4: { ...confirmation_3 },
    remark: { ...Comment },
  },
};
export const New_PROJECT_CONFIIRM_2 = {
  name: "confirm_addedparcel_land",
  module_id: 71,
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
    sellingConfirmation_3: { ...confirmation_2 },
    remark: { ...Comment },
  },
};
export const khetab_3adl = {
  name: "print_addedparcels_sak",
  module_id: 72,
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
    land_bound: { ...landBound },
    khetab: { ...khetab },
    remark: { ...Comment },
  },
};
export const PrintCreateModule = {
  name: "print_create",
  module_id: 76,
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
    debagh: { ...debagh },
    printCreate: { ...PrintCreate },
  },
};
export const krar_amin_module = {
  name: "karar_amin",
  module_id: 68,
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
    krar_amin: { ...krar_amin },
    remark: { ...Comment },
  },
};
export const ma7dar_takdeer = {
  name: "ma7dar",
  module_id: 67,
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
    ma7dar: { ...Ma7dar },
    // debagh2:{...debagh2},
    remark: { ...Comment },
  },
};
export const reevaluation_ma7dar_takdeer = {
  name: "reevaluation_ma7dar",
  module_id: 83,
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
    e3adt_ma7dar: { ...e3adt_Ma7dar },
    // debagh2:{...debagh2},
    remark: { ...Comment },
  },
};
export const owner_approval_module = {
  name: "owner_approval",
  module_id: 73,
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
    owner_approval: { ...owner_approval },
    remark: { ...Comment },
  },
};
export const approve_references_addedparcels = {
  name: "approve_references_addedparcels",
  module_id: 28,
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
    krar_amin: { ...krar_amin },
    remark: { ...Comment },
  },
};
export const approve_landmanager_addedparcels = {
  name: "approve_landmanager_addedparcels",
  module_id: 29,
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
    krar_amin: { ...krar_amin },
    remark: { ...Comment },
  },
};
export const approve_amin_addedparcels = {
  name: "approve_amin_addedparcels",
  module_id: 110,
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
    krar_amin: { ...krar_amin },
    remark: { ...Comment },
  },
};
