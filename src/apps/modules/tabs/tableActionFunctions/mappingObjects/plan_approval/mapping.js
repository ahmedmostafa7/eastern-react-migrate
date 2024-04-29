import {
  mapOldMainObject,
  buildMapObjectsPaths,
  resetMainObject,
  checkObjectsAvailability,
} from "../../mapFunction";
import {
  submissionDataObject,
  ownerDataObject,
  landDataObject,
  wasekaObject,
  dataMsa7yObject,
  plansObject,
  requestsObject,
  approvalSubmissionNotesObject,
  ownersDataObject,
  bda2lObject,
  printNotesObject,
  lagnaNotesObject,
  lagnaKararObject,
  feesObject,
  printTakreerObject,
  admissionsObject,
  tabtiriPlansObject,
  remarksObject,
  commentsObject,
} from "./mapObjects";
import { setPlanDefaults } from "./planDefaults";
import { paths } from "./mapPaths";
import { planObjects } from "./planObjects";
import { resolveOnChange } from "antd/lib/input/Input";

export const executePlanMapping = (oldMain, applyDefaults = true) => {
    var jsonMainObject = {
      submission_data: { ...submissionDataObject.submission_data },
      ownerData: { ...ownerDataObject.ownerData },
      landData: { ...landDataObject.landData },
      waseka: { ...wasekaObject.waseka },
      data_msa7y: { ...dataMsa7yObject.data_msa7y },
      plans: { ...plansObject.plans },
      requests: { ...requestsObject.requests },
      approvalSubmissionNotes: {
        ...approvalSubmissionNotesObject.approvalSubmissionNotes,
      },
      owners_data: { ...ownersDataObject.owners_data },
      bda2l: { ...bda2lObject.bda2l },
      print_notes: { ...printNotesObject.print_notes },
      lagna_notes: { ...lagnaNotesObject.lagna_notes },
      lagna_karar: { ...lagnaKararObject.lagna_karar },
      fees: { ...feesObject.fees },
      print_takreer: { ...printTakreerObject.print_takreer },
      admissions: { ...admissionsObject.admissions },
      tabtiriPlans: { ...tabtiriPlansObject.tabtiriPlans },
      comments: {},
      remarks: [],
    };

    checkObjectsAvailability(oldMain, jsonMainObject, planObjects);
    let newMain = mapOldMainObject(oldMain, jsonMainObject, paths);
    return applyDefaults ? setPlanDefaults(newMain) : newMain;
  
};
